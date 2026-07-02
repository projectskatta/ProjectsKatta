import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase";
import {
  educationResources,
  getProjectBySlug,
  gameScripts,
  projects,
  subjectCatalog,
  storeKits
} from "@/lib/platform-data";
import type { AcademicSubject, EducationResource, GameScript, Project, StoreKit } from "@/types/platform";

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

function yearFromSemester(semester: number) {
  return Math.ceil(semester / 2);
}

function mapSubjectRow(row: Record<string, unknown>): AcademicSubject {
  const subjectName = String(row.subject_name ?? "");
  const semester = Number(row.semester ?? 1);

  return {
    id: String(row.id),
    university: String(row.university ?? "SPPU") as AcademicSubject["university"],
    patternScheme: String(row.pattern_scheme ?? ""),
    branch: String(row.branch ?? ""),
    year: Number(row.year ?? yearFromSemester(semester)),
    semester,
    subjectName,
    subjectSlug: String(row.subject_slug ?? slugify(subjectName)),
    subjectCode: row.subject_code ? String(row.subject_code) : undefined,
    regulationYear: row.regulation_year ? String(row.regulation_year) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

function mapEducationRow(row: Record<string, unknown>): EducationResource {
  const subjectName = String(row.subject_name ?? "");
  const semester = Number(row.semester ?? 1);

  return {
    id: String(row.id),
    subjectId: row.subject_id ? String(row.subject_id) : undefined,
    university: String(row.university ?? "SPPU") as EducationResource["university"],
    patternScheme: String(row.pattern_scheme ?? ""),
    branch: String(row.branch ?? ""),
    year: Number(row.year ?? yearFromSemester(semester)),
    semester,
    subjectName,
    subjectSlug: String(row.subject_slug ?? slugify(subjectName)),
    categoryType: String(row.category_type ?? "notes") as EducationResource["categoryType"],
    fileTitle: String(row.file_title ?? subjectName),
    fileUrl: String(row.file_url ?? "#"),
    filePath: row.file_path ? String(row.file_path) : undefined,
    examYear: row.exam_year ? String(row.exam_year) : undefined,
    downloadCount: Number(row.download_count ?? 0),
    isTrending: Boolean(row.is_trending),
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

function mapProjectRow(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    projectSlug: String(row.project_slug),
    title: String(row.title),
    projectTier: String(row.project_tier ?? "basic") as Project["projectTier"],
    categoryTag: String(row.category_tag ?? "Basic") as Project["categoryTag"],
    imageUrl: String(row.image_url ?? "/images/hero-lab.png"),
    youtubeUrl: normalizeYoutubeUrl(String(row.youtube_url ?? "")),
    theoryContent: String(row.theory_content ?? ""),
    bomList: Array.isArray(row.bom_list) ? (row.bom_list as Project["bomList"]) : [],
    reportUrl: String(row.report_url ?? "#"),
    codeString: String(row.code_string ?? ""),
    codeFileUrl: row.code_file_url ? String(row.code_file_url) : undefined,
    relatedKitSlug: row.related_kit_slug ? String(row.related_kit_slug) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

function mapStoreKitRow(row: Record<string, unknown>): StoreKit {
  return {
    id: String(row.id),
    productSlug: String(row.product_slug),
    title: String(row.title),
    category: String(row.category ?? "Robotics Kits") as StoreKit["category"],
    summary: String(row.summary ?? ""),
    mrp: Number(row.mrp ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    stockStatus: Boolean(row.stock_status),
    imageGallery: Array.isArray(row.image_gallery) ? (row.image_gallery as string[]) : ["/images/hero-lab.png"],
    technicalSpecs:
      typeof row.technical_specs === "object" && row.technical_specs !== null
        ? (row.technical_specs as StoreKit["technicalSpecs"])
        : {},
    createdAt: String(row.created_at ?? new Date().toISOString())
  };
}

function mapGameRow(row: Record<string, unknown>): GameScript {
  const youtubeUrl = normalizeYoutubeUrl(String(row.youtube_url ?? row.youtube_video_id ?? ""));

  return {
    id: String(row.id),
    slug: String(row.slug ?? slugify(String(row.title ?? "game"))),
    title: String(row.title),
    description: String(row.description ?? ""),
    channel: String(row.channel ?? "projectskatta_gaming") as GameScript["channel"],
    youtubeUrl,
    promoVideoId: row.promo_video_id ? String(row.promo_video_id) : undefined,
    gameFileUrl: row.game_file_url ? String(row.game_file_url) : undefined,
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    sourceCode: String(row.source_code ?? ""),
    sourceCodeFileUrl: row.source_code_file_url ? String(row.source_code_file_url) : undefined
  };
}

export async function getSubjects(query?: string): Promise<AcademicSubject[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return filterSubjects(subjectCatalog, query);
  }

  let request = supabase
    .from("subjects")
    .select("id, university, pattern_scheme, branch, year, semester, subject_name, subject_slug, subject_code, regulation_year, created_at")
    .order("university", { ascending: true })
    .order("pattern_scheme", { ascending: true })
    .order("branch", { ascending: true })
    .order("year", { ascending: true })
    .order("semester", { ascending: true })
    .order("subject_name", { ascending: true });

  if (query) {
    request = request.ilike("subject_name", `%${query.replace(/[%_,]/g, " ")}%`);
  }

  const { data, error } = await request;

  if (error || !data) {
    return filterSubjects(subjectCatalog, query);
  }

  return data.map((row) => mapSubjectRow(row));
}

export async function getEducationResources(query?: string): Promise<EducationResource[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return filterEducation(educationResources, query);
  }

  let request = supabase
    .from("resources")
    .select(
      "id, subject_id, university, pattern_scheme, branch, year, semester, subject_name, subject_slug, category_type, file_title, file_url, file_path, exam_year, download_count, is_trending, created_at"
    )
    .order("created_at", { ascending: false });

  if (query) {
    request = request.ilike("subject_name", `%${query.replace(/[%_,]/g, " ")}%`);
  }

  const { data, error } = await request;

  if (error || !data) {
    return filterEducation(educationResources, query);
  }

  return data.map((row) => mapEducationRow(row));
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return projects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, project_slug, title, project_tier, category_tag, image_url, youtube_url, theory_content, bom_list, report_url, code_string, code_file_url, related_kit_slug, created_at"
    )
    .order("created_at", { ascending: false });

  return error || !data ? projects : data.map((row) => mapProjectRow(row));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getProjectBySlug(slug);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, project_slug, title, project_tier, category_tag, image_url, youtube_url, theory_content, bom_list, report_url, code_string, code_file_url, related_kit_slug, created_at"
    )
    .eq("project_slug", slug)
    .maybeSingle();

  return error || !data ? getProjectBySlug(slug) : mapProjectRow(data);
}

export async function getStoreKits(): Promise<StoreKit[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return storeKits;
  }

  const { data, error } = await supabase
    .from("store_kits")
    .select(
      "id, product_slug, title, category, summary, mrp, selling_price, stock_status, image_gallery, technical_specs, created_at"
    )
    .order("created_at", { ascending: false });

  return error || !data ? storeKits : data.map((row) => mapStoreKitRow(row));
}

export async function getGames(): Promise<GameScript[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return gameScripts;
  }

  const { data, error } = await supabase
    .from("games")
    .select(
      "id, slug, title, description, channel, youtube_url, promo_video_id, game_file_url, thumbnail_url, source_code, source_code_file_url, created_at"
    )
    .order("created_at", { ascending: false });

  return error || !data ? gameScripts : data.map((row) => mapGameRow(row));
}

function filterSubjects(items: AcademicSubject[], query?: string) {
  if (!query) {
    return items;
  }

  const normalized = query.toLowerCase();
  return items.filter(
    (item) =>
      item.subjectName.toLowerCase().includes(normalized) ||
      item.branch.toLowerCase().includes(normalized) ||
      item.university.toLowerCase().includes(normalized) ||
      item.patternScheme.toLowerCase().includes(normalized) ||
      item.subjectCode?.toLowerCase().includes(normalized)
  );
}

function filterEducation(items: EducationResource[], query?: string) {
  if (!query) {
    return items;
  }

  const normalized = query.toLowerCase();
  return items.filter(
    (item) =>
      item.subjectName.toLowerCase().includes(normalized) ||
      item.branch.toLowerCase().includes(normalized) ||
      item.university.toLowerCase().includes(normalized)
  );
}
