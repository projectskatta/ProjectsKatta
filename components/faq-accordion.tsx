"use client";

import { useActionState, useState } from "react";
import { ChevronDown, MessageCircleQuestion, Send } from "lucide-react";
import { submitFaqQuestion, type FaqSubmitState } from "@/app/actions/faq";

const faqs: { question: string; answer: string }[] = [
  {
    question: "Is ProjectsKatta free to use?",
    answer:
      "Yes. All study notes, PYQs, and free-tier projects are free to browse and download, forever. You don't need to pay anything to use the Education Hub."
  },
  {
    question: "Do I need to log in to download notes or PYQs?",
    answer:
      "No. Browsing and downloading free content in the Education Hub doesn't require an account. Login is only needed for your dashboard, unlocking premium projects, and buying kits."
  },
  {
    question: "Which university and board patterns are supported?",
    answer: "We currently cover SPPU's 2019 and 2024 Patterns, and MSBTE's I-Scheme and K-Scheme."
  },
  {
    question: "My branch or subject isn't listed yet. What do I do?",
    answer:
      "Ask us using the form below, or message us directly. We prioritize adding branches and subjects based on real student requests."
  },
  {
    question: "Are the free projects really free, including source code?",
    answer:
      "Yes. Every free-tier project includes the full source code, component list, and build steps at no cost."
  },
  {
    question: "What's different about Premium projects?",
    answer:
      "The demo video is always free to watch for every project. Premium projects additionally unlock the detailed build steps, wiring/circuit diagrams, and complete source code for a small one-time fee."
  },
  {
    question: "How does the premium project unlock payment work?",
    answer:
      "It's a one-time payment through Razorpay. As soon as the payment is verified, the project unlocks immediately on your account — no waiting."
  },
  {
    question: "How do I buy a hardware kit?",
    answer: "Go to the Store, pick a kit, and check out with Razorpay. You'll get a confirmation once payment succeeds."
  },
  {
    question: "Is Cash on Delivery (COD) available for kits?",
    answer:
      "Not yet — kits are currently prepaid only through Razorpay. We're working on adding COD once our shipping partner integration is ready."
  },
  {
    question: "What if my kit arrives damaged or doesn't work?",
    answer:
      "Contact us with your order details and photos of the issue. Genuine manufacturing defects are replaced — this is separate from each kit's own return policy shown on its product page."
  },
  {
    question: "Can I return a kit if I change my mind?",
    answer:
      "Each kit lists its own warranty and return policy on its product page, since this can vary by kit. Check there before ordering."
  },
  {
    question: "Do kits ship across India?",
    answer: "Yes, kits can be shipped across India. Delivery time depends on your location and the shipping option chosen at checkout."
  },
  {
    question: "Is my data safe if I sign in with Google?",
    answer:
      "Yes. We use standard Google Sign-In — we never see or store your Google password. We only receive your name and email to identify your account."
  },
  {
    question: "Can colleges or labs order kits in bulk?",
    answer: "Yes — reach out to us directly for bulk academic-lab orders and we'll work out the details with you."
  },
  {
    question: "How do I contact support?",
    answer: "Email us, message us on WhatsApp, or use the Contact page — links are in the footer of every page."
  },
  {
    question: "Can I contribute my own notes to the platform?",
    answer:
      "Not yet through a self-upload option, but it's on our roadmap. For now, send us your notes directly and we'll add them with credit to you."
  }
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pk-glass overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-bold text-zinc-900 sm:text-base">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-6 text-zinc-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

const initialFaqState: FaqSubmitState = { status: "idle", message: "" };

function AskQuestionForm() {
  const [state, formAction] = useActionState(submitFaqQuestion, initialFaqState);

  return (
    <form action={formAction} className="pk-glass grid gap-4 rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <MessageCircleQuestion className="h-5 w-5 text-blue-600" aria-hidden="true" />
        <p className="text-sm font-black text-zinc-900">Didn&apos;t find your answer? Ask us directly.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Your name (optional)"
          className="h-11 rounded-xl border border-zinc-200 bg-white/70 px-4 text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Your email (optional)"
          className="h-11 rounded-xl border border-zinc-200 bg-white/70 px-4 text-sm"
        />
      </div>
      <textarea
        name="question"
        required
        rows={3}
        placeholder="Type your question here..."
        className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm"
      />
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-xs font-bold ${
            state.status === "success"
              ? "text-emerald-700"
              : state.status === "error"
                ? "text-red-600"
                : "text-transparent"
          }`}
        >
          {state.message || "placeholder"}
        </p>
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          Send question
        </button>
      </div>
    </form>
  );
}

export function FaqSection() {
  return (
    <div className="grid gap-3">
      {faqs.map((item) => (
        <AccordionItem key={item.question} question={item.question} answer={item.answer} />
      ))}
      <AskQuestionForm />
    </div>
  );
}
