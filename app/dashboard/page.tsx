import { redirect } from "next/navigation";
import { Bookmark, FileUp } from "lucide-react";
import { getCurrentUser } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Middleware already guards this route, this is a second check in case
  // the page is ever rendered a different way.
  if (!user) {
    redirect("/auth?next=/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-950">Student Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Signed in as <span className="font-bold text-zinc-950">{user.email}</span>
              </p>
            </div>
            <SignOutButton />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <Bookmark className="h-5 w-5 text-zinc-950" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-zinc-950">Bookmarked Notes</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Rapid exam-night access to your saved notes.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <FileUp className="h-5 w-5 text-zinc-950" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-zinc-950">Contribution Corner</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Student notes can enter an admin approval queue later.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
