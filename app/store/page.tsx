import Link from "next/link";
import { MessageCircle, SlidersHorizontal } from "lucide-react";
import { StoreKitCard } from "@/components/store-kit-card";
import { getStoreKits } from "@/lib/platform";

const categories = ["All Kits", "Robotics Kits", "Embedded Systems", "Electronics DIY", "IoT Automation"];

export default async function StorePage() {
  const kits = await getStoreKits();

  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-zinc-500">The Store</p>
            <h1 className="mt-2 max-w-4xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              Kits, components, and custom hardware requirements.
            </h1>
          </div>
          <Link
            href={`https://wa.me/?text=${encodeURIComponent("Custom Kit Requirement for ProjectsKatta:%0AProject:%0AComponents:%0ABudget:%0ADeadline:")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-black text-white transition hover:bg-zinc-700"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Custom Kit Requirement
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg border border-zinc-200 bg-white p-2">
          <SlidersHorizontal className="ml-2 mt-2 h-5 w-5 shrink-0 text-zinc-500" aria-hidden="true" />
          {categories.map((category) => (
            <span key={category} className="shrink-0 rounded-md border border-zinc-200 px-3 py-2 text-sm font-black text-zinc-700">
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((kit) => (
            <StoreKitCard key={kit.id} kit={kit} />
          ))}
        </div>
      </section>
    </div>
  );
}
