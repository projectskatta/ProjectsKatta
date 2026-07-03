import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// This client reads/writes the auth session cookie. Use it anywhere you need
// to know WHO is logged in (dashboard, admin checks, sign-out, server actions).
// It is separate from lib/supabase.ts, which is used for public data fetching
// and does not carry a user session.
export async function createSupabaseAuthServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component where cookies can't be written.
          // Safe to ignore — middleware refreshes the session on navigation.
        }
      }
    }
  });
}

export async function getCurrentUser() {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}
