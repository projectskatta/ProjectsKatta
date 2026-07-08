"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { FileUp, Star, Trash2 } from "lucide-react";
import { deleteStudentNote, uploadStudentNote, type DashboardState, type StudentNoteItem } from "@/app/actions/dashboard";

const initialState: DashboardState = { status: "idle", message: "" };

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-zinc-950 px-5 text-sm font-black text-white disabled:opacity-60"
    >
      <FileUp className="h-4 w-4" aria-hidden="true" />
      {pending ? "Uploading..." : "Upload Note"}
    </button>
  );
}

function UploadForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(uploadStudentNote, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4">
      <input name="title" placeholder="Note title, e.g. Unit 3 - Digital Electronics" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
      <input name="note_file" type="file" accept="application/pdf" required className="text-sm" />
      <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
        <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>{state.message}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700">
            Cancel
          </button>
          <UploadButton />
        </div>
      </div>
    </form>
  );
}

export function DashboardNotesUpload({ notes }: { notes: StudentNoteItem[] }) {
  const [uploading, setUploading] = useState(false);

  return (
    <section className="pk-glass rounded-3xl p-8">
      <div className="mb-4 flex items-center justify-between border-b border-zinc-200/60 pb-4">
        <div>
          <h3 className="text-xl font-black text-zinc-950">Upload Your Notes</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Share your notes with other students and let them rate you with stars.
          </p>
        </div>
        {!uploading && (
          <button
            type="button"
            onClick={() => setUploading(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-black text-white"
          >
            <FileUp className="h-4 w-4" aria-hidden="true" />
            Upload
          </button>
        )}
      </div>

      {uploading && <UploadForm onDone={() => setUploading(false)} />}

      <div className="mt-3 grid gap-2.5">
        {notes.length === 0 && !uploading && (
          <p className="rounded-xl bg-white/50 p-4 text-sm text-zinc-500">
            You haven&apos;t uploaded any notes yet.
          </p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white/50 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-700">{note.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                    note.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {note.isApproved ? "Published" : "Pending review"}
                </span>
                {note.ratingCount > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {note.averageStars} ({note.ratingCount})
                  </span>
                )}
              </div>
            </div>
            <form action={deleteStudentNote}>
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
