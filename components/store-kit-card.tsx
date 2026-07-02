import Image from "next/image";
import Link from "next/link";
import { MessageCircle, PackageCheck } from "lucide-react";
import type { StoreKit } from "@/types/platform";

type StoreKitCardProps = {
  kit: StoreKit;
};

export function StoreKitCard({ kit }: StoreKitCardProps) {
  const discount = Math.round(((kit.mrp - kit.sellingPrice) / kit.mrp) * 100);

  return (
    <article className="rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-zinc-950 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-zinc-100">
        <Image
          src={kit.imageGallery[0] ?? "/images/hero-lab.png"}
          alt={kit.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs font-black text-zinc-600">
            {kit.category}
          </span>
          <span className="text-xs font-black text-zinc-950">{discount}% off</span>
        </div>
        <h3 className="mt-3 text-lg font-black text-zinc-950">{kit.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{kit.summary}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-zinc-400 line-through">Rs. {kit.mrp}</p>
            <p className="text-2xl font-black text-zinc-950">Rs. {kit.sellingPrice}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-black text-zinc-700">
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            {kit.stockStatus ? "In stock" : "Preorder"}
          </span>
        </div>
        <Link
          href={`https://wa.me/?text=${encodeURIComponent(`I want to buy ${kit.title} from ProjectsKatta`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Buy via WhatsApp
        </Link>
      </div>
    </article>
  );
}
