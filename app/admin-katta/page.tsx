import { ShieldCheck } from "lucide-react";
import { AdminCommandCenter } from "@/components/admin-command-center";
import { hasSupabaseConfig } from "@/lib/supabase";

export default function AdminKattaPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Admin Center</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              Upload everything from one admin portal.
            </h1>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-black text-zinc-700">
            <ShieldCheck className="h-4 w-4 text-zinc-950" aria-hidden="true" />
            {hasSupabaseConfig ? "Supabase Ready" : "Demo Mode"}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminCommandCenter />
      </section>
    </div>
  );
}
