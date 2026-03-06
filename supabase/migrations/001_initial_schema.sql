-- ============================================================
-- FORGE — Migration initiale
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'client' check (role in ('coach', 'client')),
  full_name   text,
  avatar_url  text,
  coach_id    uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────
create table public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan                    text not null default 'trial' check (plan in ('trial','basic','pro','premium')),
  status                  text not null default 'trialing',
  trial_end               timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now()
);

-- ─── WORKOUT PROGRAMS ────────────────────────────────────────
create table public.workout_programs (
  id          uuid primary key default uuid_generate_v4(),
  coach_id    uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

-- ─── EXERCISES ───────────────────────────────────────────────
create table public.exercises (
  id          uuid primary key default uuid_generate_v4(),
  program_id  uuid not null references public.workout_programs(id) on delete cascade,
  category    text not null check (category in ('push','pull','legs')),
  name        text not null,
  video_url   text,
  sets        int not null default 3,
  reps        text not null default '10',
  rest_seconds int not null default 60,
  order_index int not null default 0
);

-- ─── CLIENT PROGRAMS (assignation) ───────────────────────────
create table public.client_programs (
  id          uuid primary key default uuid_generate_v4(),
  client_id   uuid not null references public.profiles(id) on delete cascade,
  program_id  uuid not null references public.workout_programs(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  active      boolean not null default true
);

-- ─── WORKOUT SESSIONS ────────────────────────────────────────
create table public.workout_sessions (
  id               uuid primary key default uuid_generate_v4(),
  client_id        uuid not null references public.profiles(id) on delete cascade,
  program_id       uuid references public.workout_programs(id) on delete set null,
  category         text not null check (category in ('push','pull','legs')),
  mode             text not null default 'manual' check (mode in ('manual','assisted')),
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  duration_seconds int
);

-- ─── EXERCISE LOGS ───────────────────────────────────────────
create table public.exercise_logs (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id     uuid not null references public.exercises(id) on delete cascade,
  set_number      int not null,
  weight_kg       numeric(6,2),
  reps_completed  int,
  completed       boolean not null default false,
  logged_at       timestamptz not null default now()
);

-- ─── NUTRITION PLANS ─────────────────────────────────────────
create table public.nutrition_plans (
  id              uuid primary key default uuid_generate_v4(),
  coach_id        uuid not null references public.profiles(id) on delete cascade,
  client_id       uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  daily_calories  int,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ─── MEALS ───────────────────────────────────────────────────
create table public.meals (
  id          uuid primary key default uuid_generate_v4(),
  plan_id     uuid not null references public.nutrition_plans(id) on delete cascade,
  name        text not null,
  time_of_day text,
  calories    int,
  protein_g   numeric(6,1),
  carbs_g     numeric(6,1),
  fats_g      numeric(6,1),
  description text,
  order_index int not null default 0
);

-- ─── WEIGHT LOGS ─────────────────────────────────────────────
create table public.weight_logs (
  id         uuid primary key default uuid_generate_v4(),
  client_id  uuid not null references public.profiles(id) on delete cascade,
  weight_kg  numeric(5,2) not null,
  logged_at  date not null default current_date,
  unique(client_id, logged_at)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.workout_programs enable row level security;
alter table public.exercises        enable row level security;
alter table public.client_programs  enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs    enable row level security;
alter table public.nutrition_plans  enable row level security;
alter table public.meals            enable row level security;
alter table public.weight_logs      enable row level security;

-- ─── Helpers ─────────────────────────────────────────────────
create or replace function public.get_my_role()
  returns text language sql security definer stable as $$
    select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_my_client(client_id uuid)
  returns bool language sql security definer stable as $$
    select exists(
      select 1 from public.profiles
      where id = client_id and coach_id = auth.uid()
    );
$$;

-- ─── profiles ─────────────────────────────────────────────────
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or coach_id = auth.uid());

create policy "profiles_update" on public.profiles for update
  using (id = auth.uid());

-- ─── subscriptions ────────────────────────────────────────────
create policy "subscriptions_select" on public.subscriptions for select
  using (user_id = auth.uid());

-- ─── workout_programs ─────────────────────────────────────────
create policy "programs_select" on public.workout_programs for select
  using (
    coach_id = auth.uid() or
    exists(select 1 from public.client_programs cp where cp.program_id = id and cp.client_id = auth.uid())
  );

create policy "programs_insert" on public.workout_programs for insert
  with check (coach_id = auth.uid() and public.get_my_role() = 'coach');

create policy "programs_update" on public.workout_programs for update
  using (coach_id = auth.uid());

create policy "programs_delete" on public.workout_programs for delete
  using (coach_id = auth.uid());

-- ─── exercises ────────────────────────────────────────────────
create policy "exercises_select" on public.exercises for select
  using (
    exists(
      select 1 from public.workout_programs wp
      where wp.id = program_id and (
        wp.coach_id = auth.uid() or
        exists(select 1 from public.client_programs cp where cp.program_id = wp.id and cp.client_id = auth.uid())
      )
    )
  );

create policy "exercises_insert" on public.exercises for insert
  with check (
    exists(select 1 from public.workout_programs wp where wp.id = program_id and wp.coach_id = auth.uid())
  );

-- ─── client_programs ──────────────────────────────────────────
create policy "cp_select" on public.client_programs for select
  using (client_id = auth.uid() or public.is_my_client(client_id));

create policy "cp_insert" on public.client_programs for insert
  with check (public.is_my_client(client_id) and public.get_my_role() = 'coach');

-- ─── workout_sessions ─────────────────────────────────────────
create policy "sessions_select" on public.workout_sessions for select
  using (client_id = auth.uid() or public.is_my_client(client_id));

create policy "sessions_insert" on public.workout_sessions for insert
  with check (client_id = auth.uid());

create policy "sessions_update" on public.workout_sessions for update
  using (client_id = auth.uid());

-- ─── exercise_logs ────────────────────────────────────────────
create policy "logs_select" on public.exercise_logs for select
  using (
    exists(
      select 1 from public.workout_sessions s
      where s.id = session_id
        and (s.client_id = auth.uid() or public.is_my_client(s.client_id))
    )
  );

create policy "logs_insert" on public.exercise_logs for insert
  with check (
    exists(
      select 1 from public.workout_sessions s
      where s.id = session_id and s.client_id = auth.uid()
    )
  );

create policy "logs_update" on public.exercise_logs for update
  using (
    exists(
      select 1 from public.workout_sessions s
      where s.id = session_id and s.client_id = auth.uid()
    )
  );

-- ─── nutrition_plans ──────────────────────────────────────────
create policy "nutrition_select" on public.nutrition_plans for select
  using (client_id = auth.uid() or coach_id = auth.uid());

create policy "nutrition_insert" on public.nutrition_plans for insert
  with check (coach_id = auth.uid() and public.get_my_role() = 'coach');

-- ─── meals ────────────────────────────────────────────────────
create policy "meals_select" on public.meals for select
  using (
    exists(
      select 1 from public.nutrition_plans np
      where np.id = plan_id and (np.client_id = auth.uid() or np.coach_id = auth.uid())
    )
  );

-- ─── weight_logs ──────────────────────────────────────────────
create policy "weight_select" on public.weight_logs for select
  using (client_id = auth.uid() or public.is_my_client(client_id));

create policy "weight_insert" on public.weight_logs for insert
  with check (client_id = auth.uid());

create policy "weight_update" on public.weight_logs for update
  using (client_id = auth.uid());

-- ============================================================
-- TRIGGER : Création automatique du profil à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
  returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
