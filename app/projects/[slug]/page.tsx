import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Code2, Download, FileText, LockKeyhole, ShoppingBag } from "lucide-react";
import { getProject } from "@/lib/platform";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const isPremium = project.projectTier === "premium";

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">{project.categoryTag}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">{project.title}</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={1200}
            height={900}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <iframe
            title={`${project.title} video`}
            src={project.youtubeUrl}
            className="aspect-video w-full rounded-md border border-zinc-200"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <p className="mt-4 text-base leading-8 text-zinc-700">{project.theoryContent}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Bill of Materials</h2>
          <div className="mt-4 grid gap-3">
            {project.bomList.map((item) => (
              <div key={item.item} className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
                <Check className="h-4 w-4 text-zinc-950" aria-hidden="true" />
                <span className="text-sm font-bold text-zinc-700">{item.item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Documents</h2>
          {isPremium ? (
            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <LockKeyhole className="h-5 w-5 text-zinc-950" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-black text-zinc-950">Premium files locked</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Report, source code, and downloads are hidden for premium projects. The preview image and video remain visible.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href={project.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-950 transition hover:border-zinc-950"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  View Report
                </Link>
                <Link
                  href={project.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download Report
                </Link>
              </div>
              <details className="mt-5 rounded-lg bg-zinc-950 p-4 text-white">
                <summary className="flex cursor-pointer items-center gap-2 text-sm font-black">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  View Source Code
                </summary>
                <pre className="mt-4 max-h-80 overflow-auto rounded-md border border-zinc-700 p-4 text-sm leading-6 text-zinc-100">
                  <code>{project.codeString}</code>
                </pre>
              </details>
              {project.reportUrl && project.reportUrl !== "#" && (
                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-zinc-500">
                    In-page Report Preview
                  </h3>
                  <iframe
                    title={`${project.title} report preview`}
                    src={project.reportUrl}
                    className="h-[520px] w-full rounded-lg border border-zinc-200 bg-zinc-50"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {project.relatedKitSlug && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-zinc-950 px-4 py-3 text-white shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-black">Get this complete kit at 30% off.</p>
            <Link
              href="/store"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-black text-zinc-950"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Buy Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
