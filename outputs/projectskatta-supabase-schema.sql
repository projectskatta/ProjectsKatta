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
