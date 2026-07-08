"use server";

import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/supabase-server";

export type FaqSubmitState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitFaqQuestion(
  _previous: FaqSubmitState,
  formData: FormData
): Promise<FaqSubmitState> {
  const question = String(formData.get("question") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!question) {
    return { status: "error", message: "Please type your question first." };
  }

  if (question.length > 500) {
    return { status: "error", message: "Please keep your question under 500 characters." };
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      status: "error",
      message: "Question submissions aren't connected to a database yet."
    };
  }

  // If they're logged in, tie the question to their account so the answer
  // can reach them as a notification. Anonymous questions still work fine —
  // they just won't get a notification back since there's no account to notify.
  const user = await getCurrentUser();

  const { error } = await supabase.from("faq_questions").insert({
    question,
    name: name || null,
    email: email || null,
    user_id: user?.id ?? null
  });

  if (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  return { status: "success", message: "Thanks! We'll get back to you soon." };
}
