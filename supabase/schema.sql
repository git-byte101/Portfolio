-- Enable UUID generation helpers.
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text not null check (category in ('AI Automation', 'Programming', 'NoSQL')),
  tech_stack text[] not null default '{}',
  version text not null default 'v1.0.0',
  status text not null check (status in ('Production', 'Scaling', 'R&D')),
  summary text not null,
  thumbnail_src text not null default '/images/project-placeholder.svg',
  repo_url text,
  live_url text,
  featured boolean not null default false,
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_settings (
  id text primary key default 'default',
  name text not null,
  sidebar_footnote text not null,
  dashboard_title text not null,
  dashboard_subtitle text not null,
  profile_photo_src text not null,
  overview_heading text not null,
  overview_intro text not null,
  learner_heading text not null,
  learner_intro text not null,
  availability_text text not null,
  target_text text not null,
  work_style_text text not null,
  foundation_areas text[] not null default '{}',
  contact_heading text not null,
  contact_intro text not null,
  contact_bio text not null,
  contact_highlights text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience_entries (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  role text not null,
  company text not null,
  summary text not null,
  highlights text[] not null default '{}',
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tool_badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  file_url text not null,
  file_name text not null,
  is_active boolean not null default false,
  sort_order integer not null default 1000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_profile_settings_updated_at on public.profile_settings;
create trigger trg_profile_settings_updated_at
before update on public.profile_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_experience_entries_updated_at on public.experience_entries;
create trigger trg_experience_entries_updated_at
before update on public.experience_entries
for each row execute function public.set_updated_at();

drop trigger if exists trg_social_links_updated_at on public.social_links;
create trigger trg_social_links_updated_at
before update on public.social_links
for each row execute function public.set_updated_at();

drop trigger if exists trg_tool_badges_updated_at on public.tool_badges;
create trigger trg_tool_badges_updated_at
before update on public.tool_badges
for each row execute function public.set_updated_at();

drop trigger if exists trg_resume_assets_updated_at on public.resume_assets;
create trigger trg_resume_assets_updated_at
before update on public.resume_assets
for each row execute function public.set_updated_at();

insert into public.profile_settings (
  id,
  name,
  sidebar_footnote,
  dashboard_title,
  dashboard_subtitle,
  profile_photo_src,
  overview_heading,
  overview_intro,
  learner_heading,
  learner_intro,
  availability_text,
  target_text,
  work_style_text,
  foundation_areas,
  contact_heading,
  contact_intro,
  contact_bio,
  contact_highlights
)
values (
  'default',
  'PAULO',
  'Fresh graduate in Information Technology focused on building practical skills in support, systems, and software fundamentals.',
  'Portfolio Dashboard',
  'Fresh Graduate IT Profile',
  '/images/mecha-profile-photo.svg',
  'Fresh Graduate IT Portfolio',
  'Entry-level IT graduate with beginner knowledge in support, networking, programming, AI automation, and database tasks. Actively learning through practical projects and guided real-world exposure.',
  'Entry-Level IT Focus',
  'Open to junior opportunities where I can support day-to-day IT operations, contribute to technical tasks, and keep building strong fundamentals through mentorship and hands-on work.',
  'Open to Junior Roles',
  'IT Support / Staff',
  'Responsible, coachable, and documentation-driven. I focus on clear communication, task ownership, and steady improvement.',
  array[
    'IT Support and Troubleshooting',
    'Computer Networks Fundamentals',
    'Programming Fundamentals: HTML, CSS, JavaScript',
    'AI Automation Basics',
    'Database Management Basics',
    'Basic System Administration',
    'Tools: ChatGPT, Claude, Gemini'
  ],
  'Let''s Connect',
  'Recently completed internship training and now open to junior and entry-level IT roles where I can contribute and continue growing.',
  'I am a fresh graduate in Information Technology with beginner-level knowledge in core IT work. After completing internship experience, I am continuing to build skills in networking, programming, AI automation, database tasks, and user support.',
  array[
    'Basic IT support and troubleshooting for common technical issues',
    'Foundational networking and system setup knowledge',
    'Beginner web development with HTML, CSS, and JavaScript',
    'Entry-level AI assistant usage with ChatGPT, Claude, and Gemini',
    'Basic database handling and simple task documentation'
  ]
)
on conflict (id) do nothing;
