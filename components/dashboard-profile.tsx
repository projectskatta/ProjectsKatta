"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Pencil, X } from "lucide-react";
import { updateProfile, type DashboardState, type Profile } from "@/app/actions/dashboard";

const initialState: DashboardState = { status: "idle", message: "" };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

function initials(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

export function DashboardProfile({ email, profile }: { email: string; profile: Profile }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateProfile, initialState);

  if (editing) {
    return (
      <section className="pk-glass relative rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Edit Profile</p>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <form action={formAction} className="mt-6 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Full Name</span>
              <input
                name="full_name"
                defaultValue={profile.fullName}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Phone Number</span>
              <input
                name="phone"
                defaultValue={profile.phone}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-black uppercase tracking-wide text-zinc-500">University</span>
              <input
                name="university"
                defaultValue={profile.university}
                placeholder="e.g. Savitribai Phule Pune University"
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Branch</span>
              <input
                name="branch"
                defaultValue={profile.branch}
                placeholder="e.g. E&TC Engineering"
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-zinc-500">Status</span>
              <select
                name="academic_status"
                defaultValue={profile.academicStatus || "Degree"}
                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white/70 px-3 text-sm font-semibold"
              >
                <option>Diploma</option>
                <option>Degree</option>
                <option>Graduated</option>
              </select>
            </label>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-4">
            <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>
              {state.message}
            </p>
            <SaveButton />
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="pk-glass relative rounded-3xl p-8">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-white"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </button>

      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-600 text-3xl font-black text-white shadow-lg">
          {initials(profile.fullName, email)}
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">{profile.fullName || "Add your name"}</h2>
          <span className="mt-1 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black tracking-wide text-blue-600">
            Verified Student
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 border-t border-zinc-200/60 pt-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Email</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Phone Number</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.phone || "Not added yet"}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">University</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.university || "Not added yet"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Branch</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.branch || "Not added yet"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Status</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-700">{profile.academicStatus || "Not added yet"}</p>
        </div>
      </div>
    </section>
  );
}
