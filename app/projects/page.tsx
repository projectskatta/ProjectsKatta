import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/lib/platform";

export default async function ProjectsPage() {
  const projects = await getProjects();
  const groups = [
    { id: "basic", title: "Basic Projects", description: "Beginner-friendly builds with reports and source code." },
    { id: "advanced", title: "Advanced Projects", description: "More complex robotics, IoT, and embedded builds." },
    { id: "premium", title: "Premium Projects", description: "Image and video preview visible. Files and source stay locked." }
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Projects Library</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            Reports, BOM, YouTube embeds, and source code in one place.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-10">
          {groups.map((group) => {
            const items = projects.filter((project) => project.projectTier === group.id);

            return (
              <section key={group.id}>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-zinc-950">{group.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-zinc-600">{group.description}</p>
                  </div>
                  <span className="text-sm font-black text-zinc-500">{items.length} projects</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
