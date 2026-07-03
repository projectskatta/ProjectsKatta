import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Image
            src="/images/pk_logo.png"
            alt="ProjectsKatta logo"
            width={480}
            height={480}
            className="w-full max-w-sm rounded-xl border border-zinc-200 object-cover shadow-sm"
          />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-zinc-500">About ProjectsKatta</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              Build, learn, and create with practical engineering resources.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600">
              ProjectsKatta is designed for engineering and diploma students who need a clean
              place to find academic files, project documentation, source code, technical videos,
              and hardware kit information without noise.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          ["Education", "Organized subjects, notes, past papers, and solved resources."],
          ["Projects", "Project videos, theory, BOM, report previews, and source code."],
          ["Store", "Ready kits and custom hardware requirements for student builds."]
        ].map(([title, description]) => (
          <div key={title} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-zinc-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}


//git add .
//git commit -m "Fixed image block in Next config"
//git push