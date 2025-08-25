# Supabase Integration for Notes App Frontend

This frontend connects directly to Supabase for notes CRUD operations.

## Environment Variables (Create React App)
Set the following in the container .env (not committed):
- REACT_APP_SUPABASE_URL: Supabase project URL (https://<project>.supabase.co)
- REACT_APP_SUPABASE_ANON_KEY: Supabase public anon key

A `.env.example` is provided under notes_app_frontend for reference.

IMPORTANT: If these environment variables are not set at runtime, the app will render but any Supabase CRUD operation will fail. Ensure they are present in the container's environment.

## Database Table

We configured the `notes` table in Supabase with the following schema. We used `gen_random_uuid()` for portability (pgcrypto) instead of `uuid_generate_v4()` (uuid-ossp).

```sql
-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists "pgcrypto";

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  category text,
  updated_at timestamptz default now()
);
```

If you prefer `uuid_generate_v4()`, enable the extension first:
```sql
create extension if not exists "uuid-ossp";
```
…and change the default for id accordingly.

## Security: Row Level Security (RLS)

RLS is enabled on the table with permissive public demo policies to allow anonymous read/write access. For production, replace these with user-scoped policies.

```sql
alter table public.notes enable row level security;

-- Public demo policies (read/write for all anonymous users)
-- Run idempotently (only create if missing)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'Public read'
  ) then
    create policy "Public read" on public.notes for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'Public insert'
  ) then
    create policy "Public insert" on public.notes for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'Public update'
  ) then
    create policy "Public update" on public.notes for update using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'notes' and policyname = 'Public delete'
  ) then
    create policy "Public delete" on public.notes for delete using (true);
  end if;
end $$;
```

Notes:
- These public policies are suitable for demos only. For authenticated users, add a `user_id uuid references auth.users(id)` column and replace policies with user-scoped checks (e.g., `auth.uid() = user_id`).

## Frontend Code

- `src/supabaseClient.js` initializes the Supabase client using env vars.
- `src/services/notesService.js` contains CRUD functions for the `notes` table.
- `src/context/NotesContext.js` uses the service to load and mutate notes.

The CRUD service expects:
- Table: `notes`
- Columns: `id (uuid)`, `title (text)`, `content (text)`, `category (text)`, `updated_at (timestamptz)`
- The UI consumes `{ id, title, content, category, updatedAt:number }`. The service maps `updated_at` to a numeric ms timestamp.

## Troubleshooting

- If inserts fail with “permission denied for table notes”: verify RLS policies exist and include INSERT, UPDATE, DELETE as needed.
- If “function uuid_generate_v4() does not exist”: either enable the `uuid-ossp` extension or use `gen_random_uuid()` by enabling `pgcrypto`.
- If the app loads but no notes are visible after creating one:
  - Check env vars REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
  - Confirm the `notes` table exists and RLS policies allow reads.
  - Open browser devtools > Network, confirm requests to Supabase succeed.

## Dev/Prod configuration

- For demos, the provided public policies allow the anon key to perform all operations.
- For production, remove public policies, add `user_id`, and enforce user-scoped RLS policies.

