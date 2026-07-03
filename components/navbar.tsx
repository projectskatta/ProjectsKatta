import Image from "next/image";
import Link from "next/link";
import {
  BookOpenText,
  Gamepad2,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Package,
  Rocket,
  Store
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { SignOutButton } from "@/components/sign-out-button";

const baseNavItems = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/education", label: "Education", icon: BookOpenText },
  { href: "/projects", label: "Projects", icon: Rocket },
  { href: "/store", label: "Store", icon: Store },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/dashboard", label: "Dashboard", icon: Package }
];

export async function Navbar() {
  const user = await getCurrentUser();
  // Admin link only shows up for the two allowed emails — everyone else
  // never even sees that the route exists.
  const navItems = isAdminEmail(user?.email)
    ? [...baseNavItems, { href: "/admin-katta", label: "Admin", icon: LayoutDashboard }]
    : baseNavItems;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/pk_logo.png"
            alt="ProjectsKatta logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg border border-zinc-200 object-cover"
            priority
          />
          <span className="leading-tight">
            <span className="block text-base font-black tracking-tight text-zinc-950">
              ProjectsKatta
            </span>
            <span className="hidden text-xs font-medium text-zinc-500 sm:block">
              Notes, projects, kits
            </span>
          </span>
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-zinc-600 transition hover:bg-white hover:text-zinc-950 hover:shadow-sm"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user ? (
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden max-w-[10rem] truncate text-sm font-bold text-zinc-700 sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/auth"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
