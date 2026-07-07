import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { NavbarClient, type NavItem } from "@/components/navbar-client";

const baseNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: "GraduationCap" },
  { href: "/education", label: "Education", icon: "BookOpenText" },
  { href: "/projects", label: "Projects", icon: "Rocket" },
  { href: "/store", label: "Store", icon: "Store" },
  { href: "/dashboard", label: "Dashboard", icon: "Package" }
];

export async function Navbar() {
  const user = await getCurrentUser();
  // Admin link only shows up for the two allowed emails — everyone else
  // never even sees that the route exists.
  const navItems: NavItem[] = isAdminEmail(user?.email)
    ? [...baseNavItems, { href: "/admin-katta", label: "Admin", icon: "LayoutDashboard" }]
    : baseNavItems;

  return (
    <header className="sticky top-0 z-50 overflow-hidden bg-gradient-to-b from-zinc-950 to-[#0B1220] backdrop-blur">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, rgba(37,99,235,0.28) 0%, transparent 55%), radial-gradient(circle at 90% 100%, rgba(124,58,237,0.2) 0%, transparent 55%)"
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/pk_logo.png"
            alt="ProjectsKatta logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg border border-white/10 object-cover"
            priority
          />
          <span className="leading-tight">
            <span className="pk-gradient-text block text-base font-black tracking-tight">ProjectsKatta</span>
            <span className="hidden text-xs font-bold uppercase tracking-[0.18em] text-blue-300/80 sm:block">
              Build · Learn · Create
            </span>
          </span>
        </Link>

        <NavbarClient navItems={navItems} userEmail={user?.email ?? null} />
      </div>
    </header>
  );
}
