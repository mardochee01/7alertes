-- ════════════════════════════════════════════════════════════════
--  Les 7 Alertes — Supabase schema (idempotent)
-- ════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  queen_name      text        not null default 'Reine',
  king_name       text        not null default 'mon roi',
  kingdom_name    text        not null default 'Le Royaume',
  profile_photo   text,
  crown_hp        smallint    not null default 7  check (crown_hp between 0 and 7),
  xp              integer     not null default 0  check (xp >= 0),
  streak          smallint    not null default 1,
  last_active     date,
  start_date      date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;
drop policy if exists "Users see own profile"    on profiles;
drop policy if exists "Users update own profile" on profiles;
drop policy if exists "Users insert own profile" on profiles;
create policy "Users see own profile"    on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- ── Chapter progress ──────────────────────────────────────────
create table if not exists chapter_progress (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references profiles(id) on delete cascade,
  chapter_num  smallint    not null check (chapter_num between 1 and 7),
  completed    boolean     not null default false,
  slide_index  smallint    not null default 0,
  completed_at timestamptz,
  unique (user_id, chapter_num)
);

alter table chapter_progress enable row level security;
drop policy if exists "Own progress" on chapter_progress;
create policy "Own progress" on chapter_progress for all using (auth.uid() = user_id);

-- ── Journal entries ───────────────────────────────────────────
create table if not exists journal_entries (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references profiles(id) on delete cascade,
  chapter_num  smallint    not null,
  question_idx smallint    not null,
  response     text        not null default '',
  created_at   timestamptz not null default now(),
  unique (user_id, chapter_num, question_idx)
);

alter table journal_entries enable row level security;
drop policy if exists "Own journal" on journal_entries;
create policy "Own journal" on journal_entries for all using (auth.uid() = user_id);

-- ── Actions ───────────────────────────────────────────────────
create table if not exists actions (
  id           uuid     primary key default uuid_generate_v4(),
  user_id      uuid     not null references profiles(id) on delete cascade,
  chapter_num  smallint not null,
  action_idx   smallint not null,
  completed    boolean  not null default false,
  unique (user_id, chapter_num, action_idx)
);

alter table actions enable row level security;
drop policy if exists "Own actions" on actions;
create policy "Own actions" on actions for all using (auth.uid() = user_id);

-- ── Posts ─────────────────────────────────────────────────────
create table if not exists posts (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references profiles(id) on delete cascade,
  chapter_num smallint,
  text        text        not null,
  likes_count integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table posts enable row level security;
drop policy if exists "Anyone can read posts" on posts;
drop policy if exists "Own posts insert"      on posts;
drop policy if exists "Own posts update"      on posts;
drop policy if exists "Own posts delete"      on posts;
create policy "Anyone can read posts" on posts for select using (true);
create policy "Own posts insert"      on posts for insert with check (auth.uid() = user_id);
create policy "Own posts update"      on posts for update using (auth.uid() = user_id);
create policy "Own posts delete"      on posts for delete using (auth.uid() = user_id);

-- ── Post likes ────────────────────────────────────────────────
create table if not exists post_likes (
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  primary key (post_id, user_id)
);

alter table post_likes enable row level security;
drop policy if exists "Own likes" on post_likes;
create policy "Own likes" on post_likes for all using (auth.uid() = user_id);

-- ── Comments ──────────────────────────────────────────────────
create table if not exists comments (
  id          uuid        primary key default uuid_generate_v4(),
  post_id     uuid        not null references posts(id) on delete cascade,
  user_id     uuid        not null references profiles(id) on delete cascade,
  text        text        not null,
  likes_count integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table comments enable row level security;
drop policy if exists "Anyone can read comments" on comments;
drop policy if exists "Own comment insert"       on comments;
drop policy if exists "Own comment update"       on comments;
drop policy if exists "Own comment delete"       on comments;
create policy "Anyone can read comments" on comments for select using (true);
create policy "Own comment insert"       on comments for insert with check (auth.uid() = user_id);
create policy "Own comment update"       on comments for update using (auth.uid() = user_id);
create policy "Own comment delete"       on comments for delete using (auth.uid() = user_id);

-- ── Comment likes ─────────────────────────────────────────────
create table if not exists comment_likes (
  comment_id uuid not null references comments(id) on delete cascade,
  user_id    uuid not null references profiles(id)  on delete cascade,
  primary key (comment_id, user_id)
);

alter table comment_likes enable row level security;
drop policy if exists "Own comment likes" on comment_likes;
create policy "Own comment likes" on comment_likes for all using (auth.uid() = user_id);

-- ── Trigger: updated_at ───────────────────────────────────────
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();

-- NOTE: pas de trigger auto-create profile
-- Le profil est créé manuellement dans le code d'onboarding via saveProfile()
drop trigger  if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
