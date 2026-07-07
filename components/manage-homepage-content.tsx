"use client";

import { useActionState } from "react";
import { Star, Trash2 } from "lucide-react";
import {
  deleteFaqQuestion,
  deleteTestimonial,
  publishTestimonial,
  updateFaqQuestionStatus,
  type CommandState
} from "@/app/admin-katta/actions";

const initialState: CommandState = { status: "idle", message: "" };

type FaqQuestionRow = {
  id: string;
  name: string | null;
  email: string | null;
  question: string;
  status: string;
  created_at: string;
};

type TestimonialRow = {
  id: string;
  student_name: string;
  student_detail: string | null;
  quote: string;
  rating: number;
  is_published: boolean;
};

function FaqInbox({ questions }: { questions: FaqQuestionRow[] }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3">
      <h3 className="font-bold text-zinc-700 border-b pb-2 text-xs uppercase tracking-wider flex justify-between">
        <span>Homepage — Question Inbox</span>
        <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[10px]">{questions.length}</span>
      </h3>
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {questions.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No questions submitted yet.</p>
        ) : (
          questions.map((item) => (
            <div key={item.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-800">{item.question}</p>
                  <p className="mt-1 text-[10px] text-zinc-400">
                    {item.name || "Anonymous"} {item.email ? `· ${item.email}` : ""}
                  </p>
                </div>
                <form action={deleteFaqQuestion}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700 p-1 shrink-0" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
              <form action={updateFaqQuestionStatus} className="mt-2 flex items-center gap-2">
                <input type="hidden" name="id" value={item.id} />
                <select
                  name="status"
                  defaultValue={item.status}
                  className="h-7 rounded-md border border-zinc-200 bg-white px-2 text-[10px] font-bold"
                >
                  <option value="new">New</option>
                  <option value="answered">Answered</option>
                  <option value="archived">Archived</option>
                </select>
                <button type="submit" className="h-7 rounded-md bg-zinc-950 px-3 text-[10px] font-black text-white">
                  Update
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AddTestimonialForm() {
  const [state, formAction] = useActionState(publishTestimonial, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
        Add a real testimonial (only add this when a genuine student review comes in)
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="student_name"
          placeholder="Student name"
          required
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs font-bold"
        />
        <input
          name="student_detail"
          placeholder="College / branch (optional)"
          className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs font-bold"
        />
      </div>
      <textarea
        name="quote"
        placeholder="What they said"
        required
        rows={2}
        className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs font-bold"
      />
      <div className="flex items-center gap-3">
        <select name="rating" defaultValue="5" className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs font-bold">
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} stars
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
          <input name="is_published" type="checkbox" defaultChecked className="h-3.5 w-3.5" />
          Show on homepage
        </label>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-2">
        <p className={`text-[10px] font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-600"}`}>
          {state.message}
        </p>
        <button type="submit" className="h-9 rounded-md bg-zinc-950 px-4 text-xs font-black text-white">
          Add Testimonial
        </button>
      </div>
    </form>
  );
}

function TestimonialsList({ testimonials }: { testimonials: TestimonialRow[] }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3">
      <h3 className="font-bold text-zinc-700 border-b pb-2 text-xs uppercase tracking-wider flex justify-between">
        <span>Homepage — Testimonials</span>
        <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[10px]">{testimonials.length}</span>
      </h3>
      <AddTestimonialForm />
      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
        {testimonials.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
            <div className="min-w-0">
              <div className="flex gap-0.5">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-xs font-bold text-zinc-800">{item.student_name}</p>
              <p className="text-[10px] text-zinc-500 line-clamp-2">{item.quote}</p>
            </div>
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="text-red-500 hover:text-red-700 p-1 shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ManageHomepageContent({
  questions,
  testimonials
}: {
  questions: FaqQuestionRow[];
  testimonials: TestimonialRow[];
}) {
  return (
    <div className="grid gap-4">
      <FaqInbox questions={questions} />
      <TestimonialsList testimonials={testimonials} />
    </div>
  );
}
