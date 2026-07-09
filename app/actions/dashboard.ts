"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAuthServerClient, getCurrentUser } from "@/lib/supabase-server";
import { createSupabaseAdminClient } from "@/lib/supabase";

export type DashboardState = {
  status: "idle" | "success" | "error";
  message: string;
};

function read(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadUserFile(userId: string, file: File, folder: string, forceContentType?: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const bucket = "projectskatta-files";
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").toLowerCase();
  const path = `${folder}/${userId}/${Date.now()}-${cleanName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: forceContentType || file.type || "application/octet-stream",
    upsert: false
  });

  if (error) return null;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export type ProfileType = "student" | "professional" | "hobbyist" | "organization" | "teacher";

export type Profile = {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  avatarUrl: string;
  profileType: ProfileType;
  // student
  university: string;
  course: string;
  branch: string;
  semester: string;
  enrollmentId: string;
  // professional
  company: string;
  role: string;
  experience: string;
  industry: string;
  portfolioLink: string;
  // hobbyist
  interests: string;
  experienceLevel: string;
  toolsUsed: string;
  // organization
  orgName: string;
  gstNumber: string;
  shippingContact: string;
  orgType: string;
  website: string;
  // teacher
  institution: string;
  subjectTaught: string;
  designation: string;
  yearsTeaching: string;
  department: string;
};

const emptyProfile: Profile = {
  fullName: "",
  phone: "",
  country: "",
  city: "",
  avatarUrl: "",
  profileType: "student",
  university: "",
  course: "",
  branch: "",
  semester: "",
  enrollmentId: "",
  company: "",
  role: "",
  experience: "",
  industry: "",
  portfolioLink: "",
  interests: "",
  experienceLevel: "",
  toolsUsed: "",
  orgName: "",
  gstNumber: "",
  shippingContact: "",
  orgType: "",
  website: "",
  institution: "",
  subjectTaught: "",
  designation: "",
  yearsTeaching: "",
  department: ""
};

export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, phone, country, city, avatar_url, profile_type, university, course, branch, semester, enrollment_id, company, role, experience, industry, portfolio_link, interests, experience_level, tools_used, org_name, gst_number, shipping_contact, org_type, website, institution, subject_taught, designation, years_teaching, department"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!data) return emptyProfile;

  return {
    fullName: data.full_name ?? "",
    phone: data.phone ?? "",
    country: data.country ?? "",
    city: data.city ?? "",
    avatarUrl: data.avatar_url ?? "",
    profileType: (data.profile_type as ProfileType) ?? "student",
    university: data.university ?? "",
    course: data.course ?? "",
    branch: data.branch ?? "",
    semester: data.semester ?? "",
    enrollmentId: data.enrollment_id ?? "",
    company: data.company ?? "",
    role: data.role ?? "",
    experience: data.experience ?? "",
    industry: data.industry ?? "",
    portfolioLink: data.portfolio_link ?? "",
    interests: data.interests ?? "",
    experienceLevel: data.experience_level ?? "",
    toolsUsed: data.tools_used ?? "",
    orgName: data.org_name ?? "",
    gstNumber: data.gst_number ?? "",
    shippingContact: data.shipping_contact ?? "",
    orgType: data.org_type ?? "",
    website: data.website ?? "",
    institution: data.institution ?? "",
    subjectTaught: data.subject_taught ?? "",
    designation: data.designation ?? "",
    yearsTeaching: data.years_teaching ?? "",
    department: data.department ?? ""
  };
}

export async function updateProfile(_previous: DashboardState, formData: FormData): Promise<DashboardState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to be signed in." };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { status: "error", message: "Database isn't configured." };

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: read(formData, "full_name") || null,
    phone: read(formData, "phone") || null,
    country: read(formData, "country") || null,
    city: read(formData, "city") || null,
    profile_type: read(formData, "profile_type") || "student",
    university: read(formData, "university") || null,
    course: read(formData, "course") || null,
    branch: read(formData, "branch") || null,
    semester: read(formData, "semester") || null,
    enrollment_id: read(formData, "enrollment_id") || null,
    company: read(formData, "company") || null,
    role: read(formData, "role") || null,
    experience: read(formData, "experience") || null,
    industry: read(formData, "industry") || null,
    portfolio_link: read(formData, "portfolio_link") || null,
    interests: read(formData, "interests") || null,
    experience_level: read(formData, "experience_level") || null,
    tools_used: read(formData, "tools_used") || null,
    org_name: read(formData, "org_name") || null,
    gst_number: read(formData, "gst_number") || null,
    shipping_contact: read(formData, "shipping_contact") || null,
    org_type: read(formData, "org_type") || null,
    website: read(formData, "website") || null,
    institution: read(formData, "institution") || null,
    subject_taught: read(formData, "subject_taught") || null,
    designation: read(formData, "designation") || null,
    years_teaching: read(formData, "years_teaching") || null,
    department: read(formData, "department") || null,
    updated_at: new Date().toISOString()
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  return { status: "success", message: "Profile updated." };
}

export async function updateAvatar(_previous: DashboardState, formData: FormData): Promise<DashboardState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to be signed in." };

  const file = getFile(formData, "avatar_file");
  if (!file) return { status: "error", message: "Please choose an image first." };

  const uploaded = await uploadUserFile(user.id, file, "avatars");
  if (!uploaded) return { status: "error", message: "Upload failed. Please try again." };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { status: "error", message: "Database isn't configured." };

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, avatar_url: uploaded.url, updated_at: new Date().toISOString() });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  return { status: "success", message: "Profile photo updated." };
}

export async function deleteAvatar(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return;

  await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Addresses
// ---------------------------------------------------------------------------

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  city: string;
  state: string;
  streetAddress: string;
  isDefault: boolean;
};

export async function listAddresses(): Promise<Address[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("addresses")
    .select("id, full_name, phone, pincode, city, state, street_address, is_default")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: String(row.id),
    fullName: String(row.full_name),
    phone: String(row.phone),
    pincode: String(row.pincode),
    city: String(row.city),
    state: String(row.state),
    streetAddress: String(row.street_address),
    isDefault: Boolean(row.is_default)
  }));
}

export async function addAddress(_previous: DashboardState, formData: FormData): Promise<DashboardState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to be signed in." };

  const fullName = read(formData, "full_name");
  const phone = read(formData, "phone");
  const pincode = read(formData, "pincode");
  const city = read(formData, "city");
  const state = read(formData, "state");
  const streetAddress = read(formData, "street_address");

  if (!fullName || !phone || !pincode || !city || !state || !streetAddress) {
    return { status: "error", message: "Please fill in every field." };
  }

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { status: "error", message: "Database isn't configured." };

  const makeDefault = formData.get("is_default") === "on";

  if (makeDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    full_name: fullName,
    phone,
    pincode,
    city,
    state,
    street_address: streetAddress,
    is_default: makeDefault
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  return { status: "success", message: "Address added." };
}

export async function deleteAddress(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = read(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return;

  await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Bookmarks
// ---------------------------------------------------------------------------

export type BookmarkItem = {
  id: string;
  itemType: "resource" | "project";
  title: string;
  meta: string | null;
  fileUrl: string | null;
};

export async function listBookmarks(): Promise<BookmarkItem[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("bookmarks")
    .select("id, item_type, title, meta, file_url")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: String(row.id),
    itemType: row.item_type === "project" ? "project" : "resource",
    title: String(row.title),
    meta: row.meta ? String(row.meta) : null,
    fileUrl: row.file_url ? String(row.file_url) : null
  }));
}

export async function deleteBookmark(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = read(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return;

  await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationItem = {
  id: string;
  type: "order" | "shipping" | "reply" | "announcement" | "education" | "projects" | "store" | "rating" | "like" | "community";
  title: string;
  body: string;
  linkUrl: string | null;
  createdAt: string;
  isRead: boolean;
};

export async function getNotifications(): Promise<NotificationItem[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return [];

  const [{ data: notifications }, { data: reads }] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, type, title, body, link_url, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.from("notification_reads").select("notification_id").eq("user_id", user.id)
  ]);

  const readIds = new Set((reads ?? []).map((row) => String(row.notification_id)));

  return (notifications ?? []).map((row) => ({
    id: String(row.id),
    type: row.type as NotificationItem["type"],
    title: String(row.title),
    body: String(row.body),
    linkUrl: row.link_url ? String(row.link_url) : null,
    createdAt: String(row.created_at),
    isRead: readIds.has(String(row.id))
  }));
}

export async function markNotificationRead(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = read(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return;

  await supabase.from("notification_reads").upsert({ notification_id: id, user_id: user.id });
  revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Student-uploaded notes
// ---------------------------------------------------------------------------

export type StudentNoteItem = {
  id: string;
  title: string;
  fileUrl: string;
  isApproved: boolean;
  averageStars: number;
  ratingCount: number;
};

export async function listMyNotes(): Promise<StudentNoteItem[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return [];

  const { data: notes } = await supabase
    .from("student_notes")
    .select("id, title, file_url, is_approved")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!notes || notes.length === 0) return [];

  const noteIds = notes.map((note) => note.id);
  const { data: ratings } = await supabase.from("student_note_ratings").select("note_id, stars").in("note_id", noteIds);

  return notes.map((note) => {
    const noteRatings = (ratings ?? []).filter((rating) => rating.note_id === note.id);
    const averageStars = noteRatings.length
      ? Math.round((noteRatings.reduce((sum, rating) => sum + rating.stars, 0) / noteRatings.length) * 10) / 10
      : 0;

    return {
      id: String(note.id),
      title: String(note.title),
      fileUrl: String(note.file_url),
      isApproved: Boolean(note.is_approved),
      averageStars,
      ratingCount: noteRatings.length
    };
  });
}

export async function uploadStudentNote(_previous: DashboardState, formData: FormData): Promise<DashboardState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to be signed in." };

  const title = read(formData, "title");
  const file = getFile(formData, "note_file");

  if (!title || !file) {
    return { status: "error", message: "Please add a title and choose a PDF." };
  }

  const uploaded = await uploadUserFile(user.id, file, "student-notes", "application/pdf");
  if (!uploaded) return { status: "error", message: "Upload failed. Please try again." };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { status: "error", message: "Database isn't configured." };

  const { error } = await supabase.from("student_notes").insert({
    user_id: user.id,
    title,
    file_url: uploaded.url,
    file_path: uploaded.path
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  return { status: "success", message: "Note uploaded! It'll appear once reviewed." };
}

export async function deleteStudentNote(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const id = read(formData, "id");
  if (!id) return;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return;

  await supabase.from("student_notes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function replyToNotification(_previous: DashboardState, formData: FormData): Promise<DashboardState> {
  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "You need to be signed in." };

  const notificationId = read(formData, "notification_id");
  const message = read(formData, "message");

  if (!message) return { status: "error", message: "Type a message first." };

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return { status: "error", message: "Database isn't configured." };

  const { error } = await supabase.from("notification_replies").insert({
    notification_id: notificationId || null,
    user_id: user.id,
    message
  });

  if (error) return { status: "error", message: error.message };

  return { status: "success", message: "Reply sent." };
}
