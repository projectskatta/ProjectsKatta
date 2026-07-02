import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Gamepad2,
  LayoutDashboard,
  Package,
  Rocket,
  Store
} from "lucide-react";
import { MasterSearch } from "@/components/master-search";
import { getTrendingItems, projects, storeKits } from "@/lib/platform-data";
import { getSubjects } from "@/lib/platform";

const launchTiles = [
  { href: "/education", label: "Education Hub", detail: "Notes, PYQs, solved papers", icon: BookOpenText },
  { href: "/projects", label: "Projects Library", detail: "Reports, BOM, source code", icon: Rocket },
  { href: "/store", label: "Kit Store", detail: "Robotics and IoT kits", icon: Store },
  { href: "/games", label: "Games Arcade", detail: "Source-code locker funnel", icon: Gamepad2 },
  { href: "/admin-katta", label: "Admin Center", detail: "Upload control center", icon: LayoutDashboard }
];

export default async function HomePage() {
  const subjects = await getSubjects();
  const trending = getTrendingItems().slice(0, 6);
  const stats = [
    { label: "Mapped Subjects", value: `${subjects.length}+` },
    { label: "Project Builds", value: `${projects.length}+` },
    { label: "Ready Kits", value: `${storeKits.length}+` }
  ];

  return (
    <div className="bg-zinc-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-zinc-500">ProjectsKatta MVP</p>
          <h1 className="mt-5 text-5xl font-black leading-none tracking-tight text-zinc-950 sm:text-7xl lg:text-8xl">
            Engineering ka search engine.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            Notes, PYQs, solved papers, robotics projects, source code, reports, and ready kits
            in one fast, monochrome, mobile-first platform.
          </p>
          <div className="mt-10">
            <MasterSearch />
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <Image
              src="/images/hero-lab.png"
              alt="Students working on electronics and robotics projects"
              width={1792}
              height={1024}
              priority
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          <div className="grid gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-4xl font-black text-zinc-950">{stat.value}</p>
                <p className="mt-2 text-sm font-black uppercase tracking-wide text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
          {launchTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-zinc-950 hover:shadow-lg"
              >
                <Icon className="h-6 w-6 text-zinc-950" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-black text-zinc-950">{tile.label}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{tile.detail}</p>
                <ArrowRight className="mt-5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Trending Ticker</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">
              High-click study files and builds
            </h2>
          </div>
          <div className="grid gap-3">
            {trending.map((item, index) => (
              <Link
                key={`${item.title}-${index}`}
                href={item.href}
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-950"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-black text-zinc-950">{item.title}</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-500">{item.meta}</p>
                </div>
                <span className="shrink-0 rounded-md bg-zinc-950 px-2 py-1 text-xs font-black text-white">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
