import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";
import { DashboardProfile } from "@/components/dashboard-profile";
import { DashboardAddresses } from "@/components/dashboard-addresses";
import { DashboardBookmarks } from "@/components/dashboard-bookmarks";
import { NotificationBell } from "@/components/notification-bell";
import { DashboardNotesUpload } from "@/components/dashboard-notes-upload";
import {
  getProfile,
  listAddresses,
  listBookmarks,
  getNotifications,
  listMyNotes
} from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Middleware already guards this route, this is a second check in case
  // the page is ever rendered a different way.
  if (!user) {
    redirect("/auth?next=/dashboard");
  }

  const [profile, addresses, bookmarks, notifications, myNotes] = await Promise.all([
    getProfile(),
    listAddresses(),
    listBookmarks(),
    getNotifications(),
    listMyNotes()
  ]);

  const resolvedProfile =
    profile ?? {
      fullName: "",
      phone: "",
      country: "",
      city: "",
      avatarUrl: "",
      profileType: "student" as const,
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

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">My Dashboard</h1>
          <SignOutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* LEFT: Profile */}
          <DashboardProfile email={user.email ?? ""} profile={resolvedProfile} />

          {/* RIGHT: Orders + Addresses */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-end">
              <NotificationBell notifications={notifications} />
            </div>

            <div className="pk-glass flex-1 rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-zinc-950">Your Orders</h3>
                <span className="flex items-center gap-1 text-sm font-black text-blue-600">
                  <Package className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center">
                <p className="text-sm font-semibold text-zinc-500">
                  You haven&apos;t ordered anything yet. Kit orders you place will show up here.
                </p>
              </div>
            </div>

            <DashboardAddresses addresses={addresses} />
          </div>
        </div>

        {/* Student-only: upload your own notes to share */}
        {resolvedProfile.profileType === "student" && (
          <div className="mt-6">
            <DashboardNotesUpload notes={myNotes} />
          </div>
        )}

        {/* BOTTOM: Bookmarks */}
        <section className="pk-glass mt-6 rounded-3xl p-8">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200/60 pb-4">
            <div>
              <h3 className="text-xl font-black text-zinc-950">Saved Notes &amp; Bookmarks</h3>
              <p className="mt-1 text-sm text-zinc-500">Your personal library of notes, PYQs, and saved projects.</p>
            </div>
          </div>
          <DashboardBookmarks bookmarks={bookmarks} />
        </section>
      </div>
    </div>
  );
}
