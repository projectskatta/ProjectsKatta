# ProjectsKatta Setup Guide

## 1. Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `outputs/projectskatta-supabase-schema.sql`.
4. Create a Storage bucket for PDFs/images later, for example `projectskatta-files`.

## 2. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=projectskatta-files
```

`SUPABASE_SERVICE_ROLE_KEY` is only for server actions in the admin portal. Never put it in client code.
Direct uploads from `/admin-katta` need this key because PDFs/images/code files are uploaded server-side.

## 3. Admin Upload Flow

Open `/admin-katta`.

- Education tab inserts into `resources`.
- Education tab uploads PDFs to Storage, auto-creates the subject in `subjects`, and inserts into `resources`.
- Projects tab uploads images, reports, and code files, then inserts into `projects`.
- Store tab uploads kit images and inserts into `store_kits`.
- Games tab uploads playable HTML files, thumbnails, and source code files, then inserts into `games`.

Without the service role key, direct uploads may fail. With all env vars, the same forms publish to Supabase.

## 4. Run Locally

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.
