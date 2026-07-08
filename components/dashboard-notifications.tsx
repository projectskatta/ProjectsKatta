"use client";

import { Bell, Megaphone, MessageCircleQuestion, Package } from "lucide-react";
import { markNotificationRead, type NotificationItem } from "@/app/actions/dashboard";

const iconByType = {
  order: Package,
  advertisement: Megaphone,
  faq_answer: MessageCircleQuestion
};

export function DashboardNotifications({ notifications }: { notifications: NotificationItem[] }) {
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="pk-glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-black text-zinc-950">
          <Bell className="h-5 w-5 text-blue-600" aria-hidden="true" />
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-black text-white">{unreadCount} new</span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-500">
            Nothing here yet. Order updates, announcements, and answers to your questions will show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {notifications.map((item) => {
            const Icon = iconByType[item.type];
            return (
              <div
                key={item.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                  item.isRead ? "border-zinc-100 bg-white/40" : "border-blue-100 bg-blue-50/60"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-800">{item.title}</p>
                  <p className="mt-0.5 whitespace-pre-line text-xs text-zinc-600">{item.body}</p>
                  {!item.isRead && (
                    <form action={markNotificationRead} className="mt-1.5">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-xs font-bold text-blue-600 hover:underline">
                        Mark as read
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
