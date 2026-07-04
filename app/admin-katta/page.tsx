import { redirect } from "next/navigation";
import { ShieldCheck, Trash2, Folder, PlusCircle } from "lucide-react";
import { AdminCommandCenter } from "@/components/admin-command-center";
import { ManageStoreKits } from "@/components/manage-store-kits";
import { hasSupabaseConfig } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { 
  listProjects, 
  listStoreKits, 
  listGames, 
  listEducationResources, 
  deleteProject, 
  deleteGame, 
  deleteEducationResource 
} from "./actions";

export default async function AdminKattaPage() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  // Live data fetching from backend engine
  const projects = await listProjects();
  const storeKits = await listStoreKits();
  const games = await listGames();
  const educationResources = await listEducationResources();

  return (
    <div className="min-h-screen bg-zinc-50 pb-16">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Admin Center
            </p>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Tera Asli Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2 border-b pb-3">
              <PlusCircle className="w-5 h-5 text-blue-600" /> Upload New Content
            </h2>
            <AdminCommandCenter />
          </div>
        </div>

        {/* Right Side: Delete aur List wala section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Folder className="w-5 h-5 text-zinc-700" /> Manage Content
          </h2>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3">
            <h3 className="font-bold text-zinc-700 border-b pb-2 text-xs uppercase tracking-wider flex justify-between">
              <span>Projects</span>
              <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[10px]">{projects.length}</span>
            </h3>
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {projects.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No projects uploaded yet.</p>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-lg border border-zinc-100 text-xs hover:bg-zinc-100/50 transition">
                    <div className="truncate mr-2">
                      <p className="font-bold text-zinc-800 truncate">{p.title}</p>
                      <p className="text-[10px] text-zinc-400 truncate">slug: {p.project_slug}</p>
                    </div>
                    <form action={deleteProject} className="flex items-center">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition" title="Delete Project">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Tu yahan Store Kits aur Games ka bhi same block add kar sakta hai agar zaroorat pade */}
          <ManageStoreKits kits={storeKits} />
        </div>
      </div>
    </div>
  );
}