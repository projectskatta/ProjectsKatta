"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAuthServerClient, getCurrentUser } from "@/lib/supabase-server";

export type DashboardState = {
  status: "idle" | "success" | "error";
  message: string;
};

function read(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export type Profile = {
  fullName: string;
  phone: string;
  university: string;
  branch: string;
  academicStatus: string;
};

export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseAuthServerClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name, phone, university, branch, academic_status")
    .eq("id", user.id)
    .maybeSingle();

  return {
    fullName: data?.full_name ?? "",
    phone: data?.phone ?? "",
    university: data?.university ?? "",
    branch: data?.branch ?? "",
    academicStatus: data?.academic_status ?? ""
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
    university: read(formData, "university") || null,
    branch: read(formData, "branch") || null,
    academic_status: read(formData, "academic_status") || null,
    updated_at: new Date().toISOString()
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/dashboard");
  return { status: "success", message: "Profile updated." };
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

  // .eq("user_id", user.id) here is a belt-and-suspenders check — RLS
  // already guarantees this, but it keeps the query self-explanatory.
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
