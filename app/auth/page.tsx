export default function AuthPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-zinc-500">Auth</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950">Supabase Auth placeholder</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Email login, saved notes, and admin role checks will plug in here when Supabase credentials are configured.
          </p>
        </div>
      </section>
    </div>
  );
}
