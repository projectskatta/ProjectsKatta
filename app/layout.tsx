import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "ProjectsKatta | Engineering Resources",
  description:
    "Find engineering notes, PYQs, solved papers, electronics projects, robotics builds, and project kits."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Sitewide subtle background — same color family as the animated
            homepage hero, but static (no motion) and much lower intensity.
            Fixed so it never scrolls away, on every page. */}
        <div className="pk-site-bg" aria-hidden="true" />
        <Navbar />
        <main className="relative">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
