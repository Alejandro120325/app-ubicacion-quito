create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  cedula text unique,
  phone text,
  role text not null default 'persona' check (role in ('admin', 'persona')),
  language text default 'es',
  created_at timestamptz default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  relation text,
  status text not null default 'active',
  created_at timestamptz default now(),
  unique (group_id, user_id)
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  accuracy double precision check (accuracy is null or accuracy >= 0),
  heading double precision,
  speed double precision,
  sharing boolean not null default true,
  address text,
  sector text,
  updated_at timestamptz default now()
);

create index if not exists locations_group_updated_idx
  on public.locations (group_id, updated_at desc);
create index if not exists locations_user_updated_idx
  on public.locations (user_id, updated_at desc);

create or replace view public.latest_user_locations as
select distinct on (user_id, group_id)
  id,
  user_id,
  group_id,
  latitude,
  longitude,
  accuracy,
  heading,
  speed,
  sharing,
  address,
  sector,
  updated_at
from public.locations
order by user_id, group_id, updated_at desc;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.locations enable row level security;

-- El backend usa exclusivamente SUPABASE_SERVICE_ROLE_KEY. No exponer esta
-- clave en Vercel ni en el navegador. Las politicas para acceso directo del
-- cliente deben definirse cuando la autenticacion migre a Supabase Auth.
