import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

const platformLinks = [
  { href: "/projects", label: "Projects Library" },
  { href: "/store", label: "Kit Store" },
  { href: "/education", label: "Education Hub" },
  { href: "/dashboard", label: "Student Dashboard" },
  { href: "/#faq", label: "FAQ" }
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" }
];

const categories = [
  "Robotics Kits",
  "Embedded Systems",
  "Electronics DIY",
  "IoT & Automation",
  "Free Project Library",
  "Premium Project Unlocks"
];

const trustPoints = [
  "Kits tested before they ship",
  "Free projects stay free, always",
  "Built and run by a student, for students"
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-[#0B1220] to-[#0A0F1C] text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(37,99,235,0.22) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(124,58,237,0.16) 0%, transparent 45%)"
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/pk_logo.png"
              alt="ProjectsKatta logo"
              width={64}
              height={64}
              className="h-14 w-14 rounded-xl border border-white/10 object-cover"
            />
            <div>
              <p className="text-xl font-black tracking-tight">ProjectsKatta</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-blue-400">
                Build · Learn · Create
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
            An engineering platform for makers — real hardware kits, free and premium project builds, and academic
            resources, built by an engineering student for engineers everywhere.
          </p>

          <div className="mt-6 grid gap-2.5">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                {point}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-300">Platform</h2>
          <div className="mt-4 grid gap-3">
            {platformLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-1 text-sm font-semibold text-zinc-400 hover:text-white"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-300">Company</h2>
          <div className="mt-4 grid gap-3">
            {companyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-zinc-400 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>

          <h2 className="mt-7 text-sm font-black uppercase tracking-wide text-zinc-300">What We Offer</h2>
          <div className="mt-4 grid gap-1.5">
            {categories.map((category) => (
              <p key={category} className="text-xs font-semibold text-zinc-500">
                {category}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-300">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm font-semibold text-zinc-400">
            <a href="mailto:projectskattaofficial@gmail.com" className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              projectskattaofficial@gmail.com
            </a>
            <a href="tel:+919096919688" className="flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" aria-hidden="true" />
              +91 90969 19688
            </a>
            <a
              href="https://www.youtube.com/@projectskatta"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <Youtube className="h-4 w-4" aria-hidden="true" />
              YouTube @projectskatta
            </a>
            <a
              href="https://www.instagram.com/projectskatta"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
              Instagram @projectskatta
            </a>
            <div className="flex items-center gap-2 text-zinc-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Pune, Maharashtra, India
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-8 pt-2 text-xs font-semibold text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Copyright 2026 ProjectsKatta. All rights reserved.</p>
        <p>Built for makers, engineers, and students everywhere.</p>
      </div>
    </footer>
  );
}
