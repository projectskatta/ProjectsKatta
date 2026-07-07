"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Menu,
  Package,
  Rocket,
  Store,
  X
} from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

const iconByName = {
  GraduationCap,
  BookOpenText,
  Rocket,
  Store,
  Package,
  LayoutDashboard
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof iconByName;
};

export function NavbarClient({ navItems, userEmail }: { navItems: NavItem[]; userEmail: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav links — hidden below the lg breakpoint, hamburger takes over there */}
      <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur-md lg:flex">
        {navItems.map((item) => {
          const Icon = iconByName[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        {userEmail ? (
          <>
            <span className="max-w-[10rem] truncate text-sm font-bold text-zinc-300">{userEmail}</span>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/auth"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </Link>
        )}
      </div>

      {/* Hamburger trigger — visible below the lg breakpoint */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Mobile slide-down menu */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/40" onClick={() => setOpen(false)} />
          <div className="pk-glass absolute left-1/2 top-4 w-[92%] -translate-x-1/2 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Menu</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 grid gap-1.5">
              {navItems.map((item) => {
                const Icon = iconByName[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-bold text-zinc-700 transition hover:bg-white"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              {userEmail ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-bold text-zinc-700">{userEmail}</span>
                  <SignOutButton />
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-black text-white"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
