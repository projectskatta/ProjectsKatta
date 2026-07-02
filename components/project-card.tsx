import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, LockKeyhole } from "lucide-react";
import type { Project } from "@/types/platform";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-zinc-950 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2 py-1 text-xs font-black text-zinc-600">
          {project.projectTier === "premium" ? (
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {project.projectTier === "premium" ? "Premium" : project.categoryTag}
        </div>
        <h3 className="text-lg font-black leading-snug text-zinc-950">{project.title}</h3>
        <Link
          href={`/projects/${project.projectSlug}`}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-black text-white transition hover:bg-zinc-700"
        >
          {project.projectTier === "premium" ? "Preview Project" : "Open Project"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
