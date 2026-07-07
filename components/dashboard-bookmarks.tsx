"use client";

import Link from "next/link";
import { FileText, Rocket, Trash2 } from "lucide-react";
import { deleteBookmark, type BookmarkItem } from "@/app/actions/dashboard";

export function DashboardBookmarks({ bookmarks }: { bookmarks: BookmarkItem[] }) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-8 text-center">
        <p className="text-sm font-semibold text-zinc-500">
          Nothing saved yet. Bookmark notes or projects while browsing and they&apos;ll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {bookmarks.map((item) => {
        const Icon = item.itemType === "project" ? Rocket : FileText;
        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white/50 p-4 transition hover:bg-white/90"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-700">{item.title}</p>
                {item.meta && <p className="mt-0.5 text-xs text-zinc-500">{item.meta}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.fileUrl && (
                <Link
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-zinc-950 px-4 py-1.5 text-xs font-bold text-white hover:bg-zinc-700"
                >
                  View
                </Link>
              )}
              <form action={deleteBookmark}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  title="Remove bookmark"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
