import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  Boxes,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Store,
  Truck,
  Wrench
} from "lucide-react";
import { CursorGlow } from "@/components/cursor-glow";
import { FaqSection } from "@/components/faq-accordion";
import { TestimonialsSection } from "@/components/testimonials-section";
import { getHomepageStats } from "@/lib/platform";

const offerCards = [
  {
    href: "/projects",
    icon: Rocket,
    title: "Projects",
    detail: "Free and premium builds — full source code, wiring diagrams, and component lists.",
    accent: "bg-violet-600"
  },
  {
    href: "/store",
    icon: Store,
    title: "Kit Store",
    detail: "Tested hardware kits, shipped to your door, ready to build.",
    accent: "bg-amber-500"
  },
  {
    href: "/education",
    icon: GraduationCap,
    title: "Education",
    detail: "SPPU and MSBTE-aligned notes and PYQs, organized by branch and semester.",
    accent: "bg-blue-600"
  }
];

export default async function HomePage() {
  const stats = await getHomepageStats();

  return (
    <div className="relative overflow-hidden">
      {/* Animated ambient background for the hero — respects prefers-reduced-motion */}
      <div className="pk-animated-bg absolute inset-x-0 top-0 z-0 h-[760px]" aria-hidden="true" />
      <CursorGlow />

      {/* ============================= HERO ============================= */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24 lg:px-8">
        <h1 className="pk-gradient-text text-4xl font-black tracking-tight sm:text-5xl">ProjectsKatta</h1>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Build · Learn · Create</p>

        <h2 className="mx-auto mt-8 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
          From idea to hardware. <br className="hidden sm:block" />
          For engineers, everywhere.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600">
          Real projects with full build guides and source code. Tested hardware kits shipped to your door. A
          platform built for makers and engineering students who want to build, not just read about it.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/projects"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Explore Projects
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/store"
            className="pk-glass inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-black text-zinc-950 transition hover:-translate-y-0.5"
          >
            Shop Hardware Kits
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <div className="pk-glass flex items-center gap-3 rounded-full px-6 py-3">
            <span className="text-lg font-black text-blue-600">{stats.kitAndProjectCount}+</span>
            <span className="text-left text-[11px] font-bold leading-tight text-zinc-500">
              Kits &amp;
              <br />
              Projects
            </span>
          </div>
          <div className="pk-glass flex items-center gap-3 rounded-full px-6 py-3">
            <span className="text-lg font-black text-blue-600">{stats.resourceCount}+</span>
            <span className="text-left text-[11px] font-bold leading-tight text-zinc-500">
              Study
              <br />
              Resources
            </span>
          </div>
          <div className="pk-glass flex items-center gap-3 rounded-full px-6 py-3">
            <span className="text-lg font-black text-blue-600">{stats.branchCount}</span>
            <span className="text-left text-[11px] font-bold leading-tight text-zinc-500">
              Branches
              <br />
              Covered
            </span>
          </div>
        </div>
      </section>

      {/* ===================== WHAT WE OFFER — 3 cards ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-wide text-blue-600">Our vision</p>
          <p className="mt-3 text-lg font-bold leading-8 text-zinc-800">
            We build real hardware, ship it anywhere, and help engineers learn by actually building things —
            not just reading about them.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {offerCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="pk-glass group flex flex-col rounded-3xl p-7 transition hover:-translate-y-1"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent} text-white`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-lg font-black text-zinc-950">{card.title}</p>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">{card.detail}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-blue-600">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===================== PROJECTS FEATURE ===================== */}
      <section className="relative z-10 border-y border-zinc-200/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Rocket className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
                Build real projects, not just read about them
              </h2>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Every project ships with a demo video, a component list, and step-by-step build instructions.
                Free projects are free forever — premium projects unlock full wiring diagrams and source code
                for a small one-time fee.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  "Full source code and circuit diagrams",
                  "Complete bill of materials",
                  "Demo video always free to watch",
                  "New builds added regularly"
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" aria-hidden="true" />
                    <span className="text-sm font-semibold text-zinc-700">{point}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/projects"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Browse Projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="pk-glass rounded-3xl p-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                  <Cpu className="h-5 w-5 text-violet-600" aria-hidden="true" />
                  <span className="text-sm font-bold text-zinc-800">Robotics, IoT, and embedded builds</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                  <ShieldCheck className="h-5 w-5 text-violet-600" aria-hidden="true" />
                  <span className="text-sm font-bold text-zinc-800">Free tier stays free — always</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                  <Wrench className="h-5 w-5 text-violet-600" aria-hidden="true" />
                  <span className="text-sm font-bold text-zinc-800">Pair any project with a matching kit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STORE FEATURE ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 pk-glass rounded-3xl p-6 lg:order-1">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <Boxes className="h-5 w-5 text-amber-600" aria-hidden="true" />
                <span className="text-sm font-bold text-zinc-800">Robotics &amp; embedded kits</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <Wrench className="h-5 w-5 text-amber-600" aria-hidden="true" />
                <span className="text-sm font-bold text-zinc-800">Every kit tested before it ships</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4">
                <Truck className="h-5 w-5 text-amber-600" aria-hidden="true" />
                <span className="text-sm font-bold text-zinc-800">Ships across India</span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white">
              <Store className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">
              Build it yourself with our kits
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Every kit lists exactly what&apos;s in the box, its warranty, and its specs — no surprises. Pair it
              with a matching free project guide and you&apos;re set.
            </p>
            <Link
              href="/store"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Browse the Store
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== WHY CHOOSE US ===================== */}
      <section className="relative z-10 border-y border-zinc-200/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">Why ProjectsKatta</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-zinc-600">Built by an engineer, for engineers.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Rocket, title: "Made by a maker", detail: "Every feature here solves a problem we've personally run into building real hardware." },
              { icon: ShieldCheck, title: "Free stays free", detail: "Free projects and academic resources will never be paywalled." },
              { icon: Wrench, title: "Kits that are tested", detail: "We build and test every kit ourselves before it's listed." },
              { icon: Truck, title: "Built to ship", detail: "From your workbench to ours — kits packed and shipped properly." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="pk-glass rounded-2xl p-6">
                  <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  <p className="mt-4 text-sm font-black text-zinc-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== EDUCATION — smaller, condensed ===================== */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="pk-glass rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <BookOpenText className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-zinc-950">
                Everything you need for exams, in one place
              </h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                For SPPU (2019 &amp; 2024 Pattern) and MSBTE (I-Scheme &amp; K-Scheme) students — syllabus,
                unit-wise notes, PYQs, and model answers, organized by branch and semester.
              </p>
            </div>
            <Link
              href="/education"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Browse Education Hub
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">What people say</h2>
        </div>
        <div className="mt-10">
          <TestimonialsSection />
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="relative z-10 border-t border-zinc-200/60">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">Got questions?</h2>
            <p className="mt-3 text-base text-zinc-600">Everything you need to know about ProjectsKatta.</p>
          </div>
          <div className="mt-10">
            <FaqSection />
          </div>
        </div>
      </section>
    </div>
  );
}
