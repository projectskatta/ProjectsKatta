import { EducationExplorer } from "@/components/education-explorer";
import { getEducationResources, getSubjects } from "@/lib/platform";

type EducationPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function EducationPage({ searchParams }: EducationPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q ?? "";
  const subjects = await getSubjects(query);
  const resources = await getEducationResources(query);

  return (
    <div className="min-h-screen">
      <section className="border-b border-zinc-200/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Education Hub</p>
          <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
            University, scheme, branch, semester, subject. Clean files below.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
            SPPU, MSBTE, and other academic files are organized into notes, in-sem papers,
            end-sem papers, and solved papers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <EducationExplorer subjects={subjects} resources={resources} initialQuery={query} />
      </section>
    </div>
  );
}
