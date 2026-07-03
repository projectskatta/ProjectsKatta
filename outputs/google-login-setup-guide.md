# Google Login Setup — Projects Katta

Code side ka kaam ho gaya hai. Ab 2 dashboards pe kuch settings karni hain (ye code se nahi ho sakta, Supabase/Google apne dashboard me manual karwate hain).

## What changed in the code

- **`proxy.ts`** (root) — naya file. Ye har request ke `/dashboard` aur `/admin-katta` route pe check karta hai:
  - `/dashboard` → login required, warna `/auth` pe bhej dega
  - `/admin-katta` → sirf 2 allowed emails, baaki sabko `/` pe bhej dega (bina reveal kiye ki route exist karta hai)
- **`lib/admin.ts`** — allowed admin emails ki list. Yahin se edit karo agar email change karni ho:
  ```ts
  const ADMIN_EMAILS = [
    "harshsalunke.official@gmail.com",
    "projectskattaofficial@ggmail.com"   // ⚠️ check this — looks like a typo for gmail.com
  ];
  ```
- **`lib/supabase-browser.ts`** / **`lib/supabase-server.ts`** — naye auth-aware Supabase clients (login session ke liye). Purana `lib/supabase.ts` untouched hai — wo data fetching (projects/store/etc.) ke liye hi use hota rehta hai.
- **`app/auth/page.tsx`** — ab real "Continue with Google" button hai.
- **`app/auth/callback/route.ts`** — naya route, Google se wapas aane par session set karta hai.
- **`app/dashboard/page.tsx`** — real user email dikhata hai + sign out button.
- **`app/admin-katta/page.tsx`** + **`actions.ts`** — admin check page level aur har server action level dono pe (triple protection: proxy + page + action).
- **`components/navbar.tsx`** — "Admin" link ab sirf tumhe hi dikhega, baaki users ko nahi.

⚠️ **Important:** `.env.local` me **koi naya variable nahi chahiye** — jo `NEXT_PUBLIC_SUPABASE_URL` aur `NEXT_PUBLIC_SUPABASE_ANON_KEY` already hain, wahi use honge. Google OAuth config Supabase ke dashboard me hoti hai, code me nahi.

---

## Step 1 — Google Cloud Console

1. [console.cloud.google.com](https://console.cloud.google.com) pe jao, naya project banao (ya existing use karo)
2. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name: Projects Katta, support email daalo, save karo
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs me ye daalo (Supabase project ka callback URL):
     ```
     https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback
     ```
     (Ye URL Supabase dashboard → Authentication → Providers → Google me hi mil jayega, copy karke yahan paste karna)
4. Create karne ke baad **Client ID** aur **Client Secret** mil jayenge — dono copy kar lo

## Step 2 — Supabase Dashboard

1. Apne Supabase project me jao → **Authentication → Providers**
2. **Google** provider find karo, enable karo
3. Step 1 se mila **Client ID** aur **Client Secret** paste karo, save karo
4. **Authentication → URL Configuration** me jao:
   - **Site URL**: `https://projectskatta.com` (ya jo bhi primary domain use karoge)
   - **Redirect URLs** me ye add karo:
     ```
     http://localhost:3000/auth/callback
     https://projectskatta.com/auth/callback
     https://projectskatta.in/auth/callback
     ```
     (dono domains agar dono use ho rahe hain)

## Step 3 — Test karo

1. `npm install` chalao (naya package `@supabase/ssr` add hua hai)
2. `npm run dev`
3. `/dashboard` pe seedha jao bina login ke — `/auth` pe redirect hona chahiye
4. "Continue with Google" pe click karo, apne email se login karo
5. Login ke baad `/dashboard` pe wapas aana chahiye, email dikhna chahiye
6. Ab tumhare admin email se login karke `/admin-katta` try karo — khulna chahiye
7. Kisi aur (non-admin) email se login karke `/admin-katta` try karo — `/` pe redirect ho jana chahiye

---

## Note on payments

Login ab compulsory ban chuka hai dashboard ke liye. Jab payment integration karoge, wahi `getCurrentUser()` helper (`lib/supabase-server.ts` se) use kar sakte ho — agar user logged in nahi hai to checkout se pehle `/auth` pe bhej dena, same pattern jo dashboard me use hua hai.
