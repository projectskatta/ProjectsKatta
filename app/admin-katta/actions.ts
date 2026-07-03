"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

export type CommandState = {
  status: "idle" | "success" | "error";
  message: string;
};

const ok = (message: string): CommandState => ({ status: "success", message });
const fail = (message: string): CommandState => ({ status: "error", message });

// Belt-and-suspenders check: middleware already blocks /admin-katta for
// non-admins, but every action re-checks the session directly too, so
// these can never be triggered by a direct/replayed request either.
// Returns null when the caller is an admin, otherwise a fail state to return immediately.
async function requireAdmin(): Promise<CommandState | null> {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    return fail("Not authorized.");
  }

  return null;
}
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "projectskatta-files";

function read(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readNumber(formData: FormData, key: string) {
  return Number(read(formData, key));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeYoutubeUrl(value: string) {
  if (!value) {
    return "";
  }

  if (value.includes("/embed/")) {
    return value;
  }

  const watchMatch = value.match(/[?&]v=([^&]+)/);
  const shortMatch = value.match(/youtu\.be\/([^?]+)/);
  const id = watchMatch?.[1] ?? shortMatch?.[1] ?? value;
  return `https://www.youtube.com/embed/${id}`;
}

function getYoutubeId(value: string) {
  const watchMatch = value.match(/[?&]v=([^&]+)/);
  const shortMatch = value.match(/youtu\.be\/([^?]+)/);
  const embedMatch = value.match(/embed\/([^?]+)/);
  return watchMatch?.[1] ?? shortMatch?.[1] ?? embedMatch?.[1] ?? value;
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseBom(value: string) {
  return parseLines(value).map((line) => {
    const [item, link] = line.split("|").map((part) => part.trim());
    return link ? { item, link } : { item };
  });
}

function parseSpecs(value: string) {
  return parseLines(value).reduce<Record<string, string>>((acc, line) => {
    const [key, ...rest] = line.split(":");
    const valueText = rest.join(":").trim();

    if (key?.trim() && valueText) {
      acc[key.trim()] = valueText;
    }

    return acc;
  }, {});
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function cleanFileName(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? `.${parts.pop()}` : "";
  const base = parts.join(".") || name;
  return `${slugify(base)}-${Date.now()}${ext.toLowerCase()}`;
}

async function uploadFile(file: File | null, folder: string) {
  if (!file) {
    return null;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase keys are required for direct file uploads.");
  }

  const path = `${folder}/${cleanFileName(file.name)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

async function insertOrDemo(table: string, payload: Record<string, unknown>, paths: string[]) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return ok(`Demo mode: ${table} entry validated. Add Supabase env vars to publish for real.`);
  }

  const { error } = await supabase.from(table).insert(payload);

  if (error) {
    return fail(error.message);
  }

  paths.forEach((path) => revalidatePath(path));
  return ok(`${table} entry published successfully.`);
}

async function ensureSubject(payload: {
  university: string;
  pattern_scheme: string;
  branch: string;
  semester: number;
  subject_name: string;
  subject_slug: string;
  subject_code?: string;
  regulation_year?: string;
}) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: existing } = await supabase
    .from("subjects")
    .select("id")
    .eq("university", payload.university)
    .eq("pattern_scheme", payload.pattern_scheme)
    .eq("branch", payload.branch)
    .eq("semester", payload.semester)
    .eq("subject_slug", payload.subject_slug)
    .maybeSingle();

  if (existing?.id) {
    return String(existing.id);
  }

  const { data, error } = await supabase.from("subjects").insert(payload).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  return String(data.id);
}

export async function publishEducationResource(
  _previous: CommandState,
  formData: FormData
): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const subjectName = read(formData, "subject_name");
  const pdfFile = getFile(formData, "resource_file");

  if (!subjectName || !pdfFile) {
    return fail("Subject name and PDF file are required.");
  }

  try {
    const university = read(formData, "university");
    const patternScheme = read(formData, "pattern_scheme");
    const branch = read(formData, "branch");
    const semester = readNumber(formData, "semester");
    const subjectSlug = slugify(subjectName);
    const uploaded = await uploadFile(pdfFile, `education/${university}/${patternScheme}/${branch}/sem-${semester}`);
    const subjectId = await ensureSubject({
      university,
      pattern_scheme: patternScheme,
      branch,
      semester,
      subject_name: subjectName,
      subject_slug: subjectSlug,
      subject_code: read(formData, "subject_code") || undefined,
      regulation_year: read(formData, "regulation_year") || patternScheme
    });

    return insertOrDemo(
      "resources",
      {
        subject_id: subjectId,
        university,
        pattern_scheme: patternScheme,
        branch,
        semester,
        subject_name: subjectName,
        subject_slug: subjectSlug,
        category_type: read(formData, "category_type"),
        file_title: read(formData, "file_title") || `${subjectName} ${read(formData, "category_type")}`,
        file_url: uploaded?.url,
        file_path: uploaded?.path,
        exam_year: read(formData, "exam_year") || null,
        is_trending: formData.get("is_trending") === "on"
      },
      ["/", "/education"]
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to upload education file.");
  }
}

export async function publishSubject(_previous: CommandState, formData: FormData): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const subjectName = read(formData, "subject_name");

  if (!subjectName) {
    return fail("Subject name is required.");
  }

  try {
    const subjectId = await ensureSubject({
      university: read(formData, "university"),
      pattern_scheme: read(formData, "pattern_scheme"),
      branch: read(formData, "branch"),
      semester: readNumber(formData, "semester"),
      subject_name: subjectName,
      subject_slug: slugify(subjectName),
      subject_code: read(formData, "subject_code") || undefined,
      regulation_year: read(formData, "regulation_year") || read(formData, "pattern_scheme")
    });

    if (!subjectId) {
      return ok("Demo mode: subject entry validated. Add database access to publish for real.");
    }

    revalidatePath("/");
    revalidatePath("/education");
    return ok("Subject saved successfully.");
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to save subject.");
  }
}

export async function publishProject(_previous: CommandState, formData: FormData): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const title = read(formData, "title");
  const reportFile = getFile(formData, "report_file");

  if (!title || !read(formData, "youtube_url")) {
    return fail("Project title and YouTube URL are required.");
  }

  try {
    // FIX: Hamesha slugify run hoga taaki URL mein space na aaye
    const rawSlug = read(formData, "project_slug") || title;
    const slug = slugify(rawSlug);
    
    const imageUpload = await uploadFile(getFile(formData, "image_file"), `projects/${slug}/images`);
    const reportUpload = await uploadFile(reportFile, `projects/${slug}/reports`);
    const codeFile = getFile(formData, "code_file");
    const codeUpload = await uploadFile(codeFile, `projects/${slug}/code`);
    const codeString = codeFile ? await codeFile.text() : read(formData, "code_string");
    const projectTier = read(formData, "project_tier") || "basic";

    return insertOrDemo(
      "projects",
      {
        project_slug: slug,
        title,
        project_tier: projectTier,
        category_tag: projectTier === "premium" ? "Premium" : read(formData, "category_tag"),
        image_url: imageUpload?.url || read(formData, "image_url") || "/images/hero-lab.png",
        youtube_url: normalizeYoutubeUrl(read(formData, "youtube_url")),
        theory_content: read(formData, "theory_content"),
        bom_list: parseBom(read(formData, "bom_list")),
        report_url: reportUpload?.url || read(formData, "report_url") || "#",
        code_string: codeString,
        code_file_url: codeUpload?.url || null,
        related_kit_slug: read(formData, "related_kit_slug") || null
      },
      ["/", "/projects", `/projects/${slug}`]
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to publish project.");
  }
}

export async function publishStoreKit(_previous: CommandState, formData: FormData): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const title = read(formData, "title");

  if (!title || !read(formData, "selling_price")) {
    return fail("Kit title and selling price are required.");
  }

  try {
    // FIX: Hamesha slugify run hoga
    const rawSlug = read(formData, "product_slug") || title;
    const slug = slugify(rawSlug);
    
    const imageUpload = await uploadFile(getFile(formData, "image_file"), `store/${slug}`);
    const gallery = parseLines(read(formData, "image_gallery"));

    return insertOrDemo(
      "store_kits",
      {
        product_slug: slug,
        title,
        category: read(formData, "category"),
        summary: read(formData, "summary"),
        mrp: readNumber(formData, "mrp"),
        selling_price: readNumber(formData, "selling_price"),
        stock_status: formData.get("stock_status") === "on",
        image_gallery: imageUpload?.url ? [imageUpload.url, ...gallery] : gallery,
        technical_specs: parseSpecs(read(formData, "technical_specs"))
      },
      ["/", "/store"]
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to publish kit.");
  }
}

export async function publishVideoPoolItem(
  _previous: CommandState,
  formData: FormData
): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const youtubeVideoId = read(formData, "youtube_video_id");

  if (!youtubeVideoId) {
    return fail("YouTube video ID is required.");
  }

  return insertOrDemo(
    "video_rotation_pool",
    {
      youtube_video_id: youtubeVideoId,
      video_description: read(formData, "video_description"),
      is_primary: formData.get("is_primary") === "on"
    },
    ["/games"]
  );
}

export async function publishGame(_previous: CommandState, formData: FormData): Promise<CommandState> {
  const authError = await requireAdmin();
  if (authError) return authError;

  const title = read(formData, "title");
  const htmlFile = getFile(formData, "html_file");

  if (!title || !htmlFile || !read(formData, "youtube_url")) {
    return fail("Game title, YouTube URL, and HTML file are required.");
  }

  try {
    // FIX: Hamesha slugify run hoga
    const rawSlug = read(formData, "slug") || title;
    const slug = slugify(rawSlug);
    
    const gameUpload = await uploadFile(htmlFile, `games/${slug}`);
    const thumbnailUpload = await uploadFile(getFile(formData, "thumbnail_file"), `games/${slug}/thumb`);
    const sourceFile = getFile(formData, "source_code_file");
    const sourceUpload = await uploadFile(sourceFile, `games/${slug}/source`);
    const sourceCode = sourceFile ? await sourceFile.text() : read(formData, "source_code");
    const youtubeUrl = normalizeYoutubeUrl(read(formData, "youtube_url"));

    return insertOrDemo(
      "games",
      {
        slug,
        title,
        description: read(formData, "description"),
        channel: read(formData, "channel"),
        youtube_url: youtubeUrl,
        promo_video_id: getYoutubeId(youtubeUrl),
        game_file_url: gameUpload?.url,
        thumbnail_url: thumbnailUpload?.url || null,
        source_code: sourceCode,
        source_code_file_url: sourceUpload?.url || null
      },
      ["/games"]
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Unable to publish game.");
  }
}