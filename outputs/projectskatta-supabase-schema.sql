-- ProjectsKatta MVP Supabase schema
-- Run in Supabase SQL Editor after enabling pgcrypto if needed.

create extension if not exists pgcrypto;

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  university text not null,
  pattern_scheme text not null,
  branch text not null,
  semester int not null,
  subject_name text not null,
  subject_slug text not null,
  subject_code text,
  regulation_year text,
  created_at timestamp with time zone default now(),
  unique (university, pattern_scheme, branch, semester, subject_slug)
);

create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id),
  university text not null,
  pattern_scheme text not null,
  branch text not null,
  semester int not null,
  subject_name text not null,
  subject_slug text not null,
  category_type text not null check (category_type in ('notes', 'insem_pyq', 'endsem_pyq', 'solved')),
  file_title text not null default 'Untitled file',
  file_url text not null,
  file_path text,
  exam_year text,
  download_count int default 0,
  is_trending boolean default false,
  created_at timestamp with time zone default now()
);

alter table resources add column if not exists subject_id uuid references subjects(id);
alter table resources add column if not exists university text;
alter table resources add column if not exists pattern_scheme text;
alter table resources add column if not exists branch text;
alter table resources add column if not exists semester int;
alter table resources add column if not exists subject_name text;
alter table resources add column if not exists subject_slug text;
alter table resources add column if not exists category_type text;
alter table resources add column if not exists file_title text default 'Untitled file';
alter table resources add column if not exists file_url text;
alter table resources add column if not exists file_path text;
alter table resources add column if not exists exam_year text;
alter table resources add column if not exists download_count int default 0;
alter table resources add column if not exists is_trending boolean default false;

create index if not exists resources_lookup_idx
  on resources (university, pattern_scheme, branch, semester, subject_slug);

create table if not exists store_kits (
  id uuid primary key default gen_random_uuid(),
  product_slug text unique not null,
  title text not null,
  category text not null,
  summary text default '',
  mrp int not null,
  selling_price int not null,
  stock_status boolean default true,
  image_gallery text[] not null default '{}',
  technical_specs jsonb not null default '{}',
  created_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  project_slug text unique not null,
  title text not null,
  project_tier text not null default 'basic' check (project_tier in ('basic', 'advanced', 'premium')),
  category_tag text not null,
  image_url text default '/images/hero-lab.png',
  youtube_url text not null,
  theory_content text not null,
  bom_list jsonb not null default '[]',
  report_url text not null,
  code_string text not null,
  code_file_url text,
  related_kit_slug text references store_kits(product_slug),
  created_at timestamp with time zone default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text default '',
  channel text not null default 'projectskatta_gaming',
  youtube_url text,
  promo_video_id text,
  game_file_url text not null,
  thumbnail_url text,
  source_code text default '',
  source_code_file_url text,
  created_at timestamp with time zone default now()
);

create table if not exists custom_kit_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  requirements text not null,
  budget text,
  status text default 'new',
  whatsapp_opened_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists download_events (
  id uuid primary key default gen_random_uuid(),
  resource_id text,
  ip_hash text,
  user_agent text,
  created_at timestamp with time zone default now()
);

create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  entity_type text not null,
  entity_id text,
  created_at timestamp with time zone default now()
);

-- Keep public reads open for launch.
alter table resources enable row level security;
alter table subjects enable row level security;
alter table projects enable row level security;
alter table store_kits enable row level security;
alter table games enable row level security;

drop policy if exists "Public read resources" on resources;
create policy "Public read resources" on resources for select using (true);

drop policy if exists "Public read subjects" on subjects;
create policy "Public read subjects" on subjects for select using (true);

drop policy if exists "Public read projects" on projects;
create policy "Public read projects" on projects for select using (true);

drop policy if exists "Public read store kits" on store_kits;
create policy "Public read store kits" on store_kits for select using (true);

drop policy if exists "Public read games" on games;
create policy "Public read games" on games for select using (true);

insert into storage.buckets (id, name, public)
values ('projectskatta-files', 'projectskatta-files', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read projectskatta files" on storage.objects;
create policy "Public read projectskatta files"
  on storage.objects for select using (bucket_id = 'projectskatta-files');

insert into subjects (university, pattern_scheme, branch, semester, subject_name, subject_slug, subject_code, regulation_year)
values
  ('SPPU', '2024 Pattern', 'First Year Engineering', 1, 'Basic Electrical and Electronics Engineering', 'basic-electrical-and-electronics-engineering', 'BEE', '2024'),
  ('SPPU', '2024 Pattern', 'First Year Engineering', 1, 'Engineering Mathematics I', 'engineering-mathematics-i', 'EM-I', '2024'),
  ('SPPU', '2024 Pattern', 'First Year Engineering', 1, 'Engineering Chemistry', 'engineering-chemistry', 'CHEM', '2024'),
  ('SPPU', '2019 Pattern', 'First Year Engineering', 2, 'Basic Electronics Engineering', 'basic-electronics-engineering', 'BEE', '2019'),
  ('SPPU', '2019 Pattern', 'Computer', 3, 'Data Structures and Algorithms', 'data-structures-and-algorithms', 'DSA', '2019'),
  ('SPPU', '2019 Pattern', 'E&TC', 3, 'Network Theory', 'network-theory', 'NT', '2019'),
  ('MSBTE', 'K-Scheme', 'Computer', 3, 'Applied Mathematics', 'applied-mathematics', 'AMS', 'K-Scheme'),
  ('MSBTE', 'K-Scheme', 'Computer', 3, 'Data Structures Using C', 'data-structures-using-c', 'DSU', 'K-Scheme'),
  ('MSBTE', 'K-Scheme', 'E&TC', 4, 'Microcontroller Applications', 'microcontroller-applications', 'MIC', 'K-Scheme'),
  ('MSBTE', 'I-Scheme', 'Computer', 5, 'Advanced Java Programming', 'advanced-java-programming', 'AJP', 'I-Scheme'),
  ('MSBTE', 'I-Scheme', 'E&TC', 5, 'Microcontroller and Applications', 'microcontroller-and-applications', 'MCA', 'I-Scheme')
on conflict (university, pattern_scheme, branch, semester, subject_slug) do nothing;

-- Inserts should happen from server actions using SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose the service role key in the browser.

-- ---------------------------------------------------------------------------
-- Homepage additions: FAQ question submissions + real testimonials.
-- ---------------------------------------------------------------------------

-- Student-submitted questions from the homepage FAQ "ask a question" form.
-- Admin reviews these in the admin panel and can turn good ones into public FAQs.
create table if not exists faq_questions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  question text not null,
  status text not null default 'new' check (status in ('new', 'answered', 'archived')),
  created_at timestamp with time zone default now()
);

alter table faq_questions enable row level security;
drop policy if exists "faq_questions insert" on faq_questions;
create policy "faq_questions insert" on faq_questions for insert with check (true);

-- Real testimonials only — added manually by admin when a genuine review comes in.
-- The homepage shows this section empty until real entries exist here.
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  student_detail text,
  quote text not null,
  rating int not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  created_at timestamp with time zone default now()
);

alter table testimonials enable row level security;
drop policy if exists "testimonials public read" on testimonials;
create policy "testimonials public read" on testimonials for select using (is_published = true);

-- ---------------------------------------------------------------------------
-- Store Kits: extra fields for the full product page + Shiprocket shipping.
-- ---------------------------------------------------------------------------
alter table store_kits add column if not exists whats_in_box text default '';
alter table store_kits add column if not exists warranty_info text default '';
alter table store_kits add column if not exists return_policy text default '';
alter table store_kits add column if not exists weight_grams int;
alter table store_kits add column if not exists package_length_cm numeric;
alter table store_kits add column if not exists package_width_cm numeric;
alter table store_kits add column if not exists package_height_cm numeric;
alter table store_kits add column if not exists availability_status text not null default 'available';
alter table store_kits drop constraint if exists store_kits_availability_status_check;
alter table store_kits add constraint store_kits_availability_status_check
  check (availability_status in ('available', 'coming_soon', 'out_of_stock'));

-- ---------------------------------------------------------------------------
-- Student Dashboard: profile, saved addresses, bookmarks.
-- Each table is scoped so a user can only ever see/edit their OWN rows —
-- enforced by Postgres RLS using auth.uid(), not just app-level checks.
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  university text,
  branch text,
  academic_status text,
  updated_at timestamp with time zone default now()
);

alter table profiles enable row level security;
drop policy if exists "profiles select own" on profiles;
drop policy if exists "profiles insert own" on profiles;
drop policy if exists "profiles update own" on profiles;
create policy "profiles select own" on profiles for select using (auth.uid() = id);
create policy "profiles insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on profiles for update using (auth.uid() = id);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  pincode text not null,
  city text not null,
  state text not null,
  street_address text not null,
  is_default boolean not null default false,
  created_at timestamp with time zone default now()
);

alter table addresses enable row level security;
drop policy if exists "addresses select own" on addresses;
drop policy if exists "addresses insert own" on addresses;
drop policy if exists "addresses update own" on addresses;
drop policy if exists "addresses delete own" on addresses;
create policy "addresses select own" on addresses for select using (auth.uid() = user_id);
create policy "addresses insert own" on addresses for insert with check (auth.uid() = user_id);
create policy "addresses update own" on addresses for update using (auth.uid() = user_id);
create policy "addresses delete own" on addresses for delete using (auth.uid() = user_id);

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('resource', 'project')),
  item_id uuid,
  title text not null,
  meta text,
  file_url text,
  created_at timestamp with time zone default now()
);

alter table bookmarks enable row level security;
drop policy if exists "bookmarks select own" on bookmarks;
drop policy if exists "bookmarks insert own" on bookmarks;
drop policy if exists "bookmarks delete own" on bookmarks;
create policy "bookmarks select own" on bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks insert own" on bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks delete own" on bookmarks for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Notifications: order updates, admin broadcast ads, and FAQ answers.
-- user_id = NULL means a broadcast notification (everyone sees it).
-- Read-state is tracked per-user separately, since one user marking a
-- broadcast notification as read shouldn't affect anyone else.
-- ---------------------------------------------------------------------------

alter table faq_questions add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table faq_questions add column if not exists answer text;

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('order', 'advertisement', 'faq_answer')),
  title text not null,
  body text not null,
  link_url text,
  created_at timestamp with time zone default now()
);

alter table notifications enable row level security;
drop policy if exists "notifications select own or broadcast" on notifications;
create policy "notifications select own or broadcast" on notifications
  for select using (auth.uid() = user_id or user_id is null);

create table if not exists notification_reads (
  notification_id uuid references notifications(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  read_at timestamp with time zone default now(),
  primary key (notification_id, user_id)
);

alter table notification_reads enable row level security;
drop policy if exists "notification_reads own" on notification_reads;
create policy "notification_reads own" on notification_reads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Profile expansion: global profile types (not just students), avatar,
-- and type-specific fields. Only the fields relevant to the selected
-- profile_type get shown/filled — the rest stay null.
-- ---------------------------------------------------------------------------

alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists country text;
alter table profiles add column if not exists city text;
alter table profiles add column if not exists profile_type text not null default 'student'
  check (profile_type in ('student', 'professional', 'hobbyist', 'organization', 'teacher'));

-- Student
alter table profiles add column if not exists course text;
alter table profiles add column if not exists semester text;
-- university, branch already existed from the first profiles migration

-- Professional
alter table profiles add column if not exists company text;
alter table profiles add column if not exists role text;
alter table profiles add column if not exists experience text;

-- Hobbyist
alter table profiles add column if not exists interests text; -- comma-separated

-- Organization
alter table profiles add column if not exists org_name text;
alter table profiles add column if not exists gst_number text;
alter table profiles add column if not exists shipping_contact text;

-- Teacher
alter table profiles add column if not exists institution text;
alter table profiles add column if not exists subject_taught text;
alter table profiles add column if not exists designation text;

-- ---------------------------------------------------------------------------
-- Student-uploaded notes — students can share their own notes; other
-- students can rate them. Where these surface on the Education page is
-- decided later when that page gets redesigned.
-- ---------------------------------------------------------------------------

create table if not exists student_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_path text,
  is_approved boolean not null default false,
  created_at timestamp with time zone default now()
);

alter table student_notes enable row level security;
drop policy if exists "student_notes select own" on student_notes;
drop policy if exists "student_notes select approved" on student_notes;
drop policy if exists "student_notes insert own" on student_notes;
drop policy if exists "student_notes delete own" on student_notes;
create policy "student_notes select own" on student_notes for select using (auth.uid() = user_id);
create policy "student_notes select approved" on student_notes for select using (is_approved = true);
create policy "student_notes insert own" on student_notes for insert with check (auth.uid() = user_id);
create policy "student_notes delete own" on student_notes for delete using (auth.uid() = user_id);

create table if not exists student_note_ratings (
  note_id uuid references student_notes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  created_at timestamp with time zone default now(),
  primary key (note_id, user_id)
);

alter table student_note_ratings enable row level security;
drop policy if exists "student_note_ratings select all" on student_note_ratings;
drop policy if exists "student_note_ratings own" on student_note_ratings;
create policy "student_note_ratings select all" on student_note_ratings for select using (true);
create policy "student_note_ratings own" on student_note_ratings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Profile richness: give every profile type a comparable depth of fields,
-- not just Student.
-- ---------------------------------------------------------------------------
alter table profiles add column if not exists enrollment_id text; -- student, optional
alter table profiles add column if not exists industry text; -- professional
alter table profiles add column if not exists portfolio_link text; -- professional / hobbyist
alter table profiles add column if not exists experience_level text; -- hobbyist
alter table profiles add column if not exists tools_used text; -- hobbyist
alter table profiles add column if not exists org_type text; -- organization
alter table profiles add column if not exists website text; -- organization
alter table profiles add column if not exists years_teaching text; -- teacher
alter table profiles add column if not exists department text; -- teacher

-- ---------------------------------------------------------------------------
-- Notifications: expand into proper categories with icons on the frontend.
-- ---------------------------------------------------------------------------
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications add constraint notifications_type_check
  check (type in ('order', 'shipping', 'reply', 'announcement', 'education', 'projects', 'store', 'rating', 'like', 'community'));

-- Lightweight two-way thread: lets a user reply to a notification (e.g. reply
-- to an admin's FAQ answer). Admin sees these the same place as FAQ questions.
create table if not exists notification_replies (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid references notifications(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table notification_replies enable row level security;
drop policy if exists "notification_replies own" on notification_replies;
create policy "notification_replies own" on notification_replies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
