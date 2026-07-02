import Link from "next/link";
import { Bookmark, FileUp, LockKeyhole } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-950 text-white">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950">Student Dashboard</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            This route is ready for Supabase Auth. For now it previews saved notes and contribution areas.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <Bookmark className="h-5 w-5 text-zinc-950" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-zinc-950">Bookmarked Notes</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Rapid exam-night access once user auth is enabled.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <FileUp className="h-5 w-5 text-zinc-950" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-zinc-950">Contribution Corner</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Student notes can enter an admin approval queue later.</p>
            </div>
          </div>

          <Link
            href="/auth"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700"
          >
            Auth Setup Preview
          </Link>
        </div>
      </section>
    </div>
  );
}
