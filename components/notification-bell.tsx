"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Bell,
  Heart,
  MessageCircle,
  Megaphone,
  Package,
  Rocket,
  ShoppingCart,
  Star,
  Truck,
  Users,
  X,
  GraduationCap
} from "lucide-react";
import {
  markNotificationRead,
  replyToNotification,
  type DashboardState,
  type NotificationItem
} from "@/app/actions/dashboard";

const initialState: DashboardState = { status: "idle", message: "" };

const categoryMeta: Record<
  NotificationItem["type"],
  { icon: typeof Package; label: string }
> = {
  order: { icon: Package, label: "Order" },
  shipping: { icon: Truck, label: "Shipping" },
  reply: { icon: MessageCircle, label: "Reply" },
  announcement: { icon: Megaphone, label: "Announcement" },
  education: { icon: GraduationCap, label: "Education" },
  projects: { icon: Rocket, label: "Projects" },
  store: { icon: ShoppingCart, label: "Store" },
  rating: { icon: Star, label: "Rating" },
  like: { icon: Heart, label: "Like" },
  community: { icon: Users, label: "Community" }
};

function ReplyForm({ notificationId, onSent }: { notificationId: string; onSent: () => void }) {
  const [state, formAction] = useActionState(replyToNotification, initialState);
  const { pending } = useFormStatus();

  return (
    <form
      action={async (formData) => {
        await formAction(formData);
        onSent();
      }}
      className="mt-4 grid gap-2 border-t border-zinc-200 pt-4"
    >
      <input type="hidden" name="notification_id" value={notificationId} />
      <textarea
        name="message"
        rows={2}
        placeholder="Write a reply..."
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
      />
      <div className="flex items-center justify-between">
        <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>
          {state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-full bg-zinc-950 px-4 text-xs font-black text-white disabled:opacity-60"
        >
          {pending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </form>
  );
}

function NotificationDetail({ item, onClose }: { item: NotificationItem; onClose: () => void }) {
  const Icon = categoryMeta[item.type].icon;
  const [replied, setReplied] = useState(false);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/40" onClick={onClose} />
      <div className="pk-glass relative w-full max-w-sm rounded-3xl p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-950"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="mt-3 text-xs font-black uppercase tracking-wide text-zinc-400">{categoryMeta[item.type].label}</p>
        <h3 className="mt-1 text-lg font-black text-zinc-950">{item.title}</h3>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-600">{item.body}</p>

        {item.linkUrl ? (
          <a
            href={item.linkUrl}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-sm font-black text-white"
          >
            {item.type === "store" ? "Buy Now" : "View"}
          </a>
        ) : replied ? (
          <p className="mt-4 text-xs font-bold text-emerald-700">Reply sent.</p>
        ) : (
          <ReplyForm notificationId={item.id} onSent={() => setReplied(true)} />
        )}
      </div>
    </div>
  );
}

export function NotificationBell({ notifications }: { notifications: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  function openItem(item: NotificationItem) {
    setSelected(item);
    setOpen(false);
    if (!item.isRead) {
      const formData = new FormData();
      formData.set("id", item.id);
      markNotificationRead(formData);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-xs font-black text-zinc-700 transition hover:bg-white"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        Notifications
        {unreadCount > 0 && (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="pk-glass absolute right-0 top-12 z-50 max-h-96 w-80 overflow-y-auto rounded-2xl p-2">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-xs font-semibold text-zinc-500">No notifications yet.</p>
            ) : (
              notifications.map((item) => {
                const Icon = categoryMeta[item.type].icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openItem(item)}
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-white/70 ${
                      item.isRead ? "" : "bg-blue-50/60"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-zinc-800">{item.title}</p>
                      <p className="truncate text-xs text-zinc-500">{item.body}</p>
                    </div>
                    {!item.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}

      {selected && <NotificationDetail item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
