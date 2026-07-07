import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { getCurrentUser } from "@/lib/supabase-server";

export default async function AuthPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const user = await getCurrentUser();

  if (user) {
    redirect(next || "/dashboard");
  }

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Auth</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">Sign in to Projects Katta</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Sign in with Google to access your dashboard, saved notes, and purchases.
          </p>

          {error ? (
            <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-600">
              Login failed. Please try again.
            </p>
          ) : null}

          <div className="mt-6">
            <GoogleSignInButton next={next} />
          </div>
        </div>
      </section>
    </div>
  );
}
