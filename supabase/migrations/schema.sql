create extension if not exists pgcrypto;

-- ================
-- Helper Functions
-- ================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

-- ========
-- Profiles
-- ========

create table if not exists public.profiles (
  "userId" uuid primary key
    references auth.users(id)
    on delete cascade,

  "firstName" text not null default '',
  "lastName" text not null default '',
  username text not null default '',
  "avatarUrl" text,
  bio text,
  location text,
  website text,
  "phoneNumber" text,
  "onboardingCompleted" boolean not null default false,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username <> '';

-- ==============
-- Vault Settings
-- ==============

create table if not exists public."vaultSettings" (
  "userId" uuid primary key
    references auth.users(id)
    on delete cascade,

  "kdfSalt" text not null,
  "passwordVerifier" text not null,
  "verifierIv" text not null,
  "kdfIterations" integer not null default 310000
    check ("kdfIterations" >= 100000),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- =========
-- Passwords
-- =========

create table if not exists public.passwords (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null
    references auth.users(id)
    on delete cascade,
  "encryptedData" text not null,
  "encryptionIv" text not null,
  "encryptionVersion" integer not null default 1
    check ("encryptionVersion" = 1),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- =============
-- Login Devices
-- =============

create table if not exists public."loginDevices" (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null
    references auth.users(id)
    on delete cascade,
  "deviceId" text not null,
  "deviceName" text not null,
  browser text not null default 'Unknown browser',
  os text not null default 'Unknown OS',
  "lastSeenAt" timestamptz not null default now(),
  "createdAt" timestamptz not null default now()
);

create unique index if not exists login_devices_user_device_idx
  on public."loginDevices" ("userId", "deviceId");

create index if not exists login_devices_user_id_idx
  on public."loginDevices" ("userId");

-- ================
-- Table Privileges
-- ================

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public."vaultSettings" to authenticated;
grant select, insert, update, delete on table public.passwords to authenticated;
grant select, insert, update, delete on table public."loginDevices" to authenticated;

-- =======
-- Indexes
-- =======

create index if not exists passwords_user_id_idx
  on public.passwords ("userId");

create index if not exists passwords_updated_at_idx
  on public.passwords ("updatedAt" desc);

-- ==================
-- Row Level Security
-- ==================

alter table public.profiles enable row level security;
alter table public."vaultSettings" enable row level security;
alter table public.passwords enable row level security;
alter table public."loginDevices" enable row level security;

-- =================
-- Profiles Policies
-- =================

drop policy if exists "profiles owner select" on public.profiles;
create policy "profiles owner select"
  on public.profiles for select to authenticated
  using (auth.uid() = "userId");

drop policy if exists "profiles owner insert" on public.profiles;
create policy "profiles owner insert"
  on public.profiles for insert to authenticated
  with check (auth.uid() = "userId");

drop policy if exists "profiles owner update" on public.profiles;
create policy "profiles owner update"
  on public.profiles for update to authenticated
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

drop policy if exists "profiles owner delete" on public.profiles;
create policy "profiles owner delete"
  on public.profiles for delete to authenticated
  using (auth.uid() = "userId");

-- =======================
-- Vault Settings Policies
-- =======================

drop policy if exists "vault settings owner select" on public."vaultSettings";
create policy "vault settings owner select"
  on public."vaultSettings" for select to authenticated
  using (auth.uid() = "userId");

drop policy if exists "vault settings owner insert" on public."vaultSettings";
create policy "vault settings owner insert"
  on public."vaultSettings" for insert to authenticated
  with check (auth.uid() = "userId");

drop policy if exists "vault settings owner update" on public."vaultSettings";
create policy "vault settings owner update"
  on public."vaultSettings" for update to authenticated
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

drop policy if exists "vault settings owner delete" on public."vaultSettings";
create policy "vault settings owner delete"
  on public."vaultSettings" for delete to authenticated
  using (auth.uid() = "userId");

-- ==================
-- Passwords Policies
-- ==================

drop policy if exists "password owner select" on public.passwords;
create policy "password owner select"
  on public.passwords for select to authenticated
  using (auth.uid() = "userId");

drop policy if exists "password owner insert" on public.passwords;
create policy "password owner insert"
  on public.passwords for insert to authenticated
  with check (auth.uid() = "userId");

drop policy if exists "password owner update" on public.passwords;
create policy "password owner update"
  on public.passwords for update to authenticated
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

drop policy if exists "password owner delete" on public.passwords;
create policy "password owner delete"
  on public.passwords for delete to authenticated
  using (auth.uid() = "userId");

-- ======================
-- Login Devices Policies
-- ======================

drop policy if exists "login devices owner select" on public."loginDevices";
create policy "login devices owner select"
  on public."loginDevices" for select to authenticated
  using (auth.uid() = "userId");

drop policy if exists "login devices owner insert" on public."loginDevices";
create policy "login devices owner insert"
  on public."loginDevices" for insert to authenticated
  with check (auth.uid() = "userId");

drop policy if exists "login devices owner update" on public."loginDevices";
create policy "login devices owner update"
  on public."loginDevices" for update to authenticated
  using (auth.uid() = "userId")
  with check (auth.uid() = "userId");

drop policy if exists "login devices owner delete" on public."loginDevices";
create policy "login devices owner delete"
  on public."loginDevices" for delete to authenticated
  using (auth.uid() = "userId");

-- ===================
-- Updated At Triggers
-- ===================

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists vault_settings_touch_updated_at on public."vaultSettings";
create trigger vault_settings_touch_updated_at
before update on public."vaultSettings"
for each row execute function public.touch_updated_at();

drop trigger if exists passwords_touch_updated_at on public.passwords;
create trigger passwords_touch_updated_at
before update on public.passwords
for each row execute function public.touch_updated_at();

-- =======================
-- Storage: Public Avatars
-- =======================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatar upload own folder" on storage.objects;
create policy "avatar upload own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar update own folder" on storage.objects;
create policy "avatar update own folder"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar delete own folder" on storage.objects;
create policy "avatar delete own folder"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ================
-- Reload PostgREST
-- ================

notify pgrst, 'reload schema';
