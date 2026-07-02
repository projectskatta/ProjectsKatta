import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, Phone, Youtube } from "lucide-react";

const platformLinks = [
  { href: "/education", label: "Education Hub" },
  { href: "/projects", label: "Projects Library" },
  { href: "/store", label: "Kit Store" },
  { href: "/games", label: "Games Arcade" },
  { href: "/dashboard", label: "Student Dashboard" }
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/pk_logo.png"
              alt="ProjectsKatta logo"
              width={64}
              height={64}
              className="h-14 w-14 rounded-lg border border-zinc-800 object-cover"
            />
            <div>
              <p className="text-xl font-black tracking-tight">ProjectsKatta</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.24em] text-zinc-400">
                Build. Learn. Create.
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
            A focused platform for engineering students to discover academic resources,
            technical projects, playable web games, and practical hardware kits.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-300">Platform</h2>
          <div className="mt-4 grid gap-3">
            {platformLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-zinc-400 hover:text-white">
                {link.label}
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
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs font-semibold text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright 2026 ProjectsKatta. All rights reserved.</p>
          <p>Built for students, makers, and engineering teams.</p>
        </div>
      </div>
    </footer>
  );
}
