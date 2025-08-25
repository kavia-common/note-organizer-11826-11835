# Supabase Integration for Notes App Frontend

This frontend connects directly to Supabase for notes CRUD operations.

## Environment Variables (Create React App)
Set the following in the container .env (not committed):
- REACT_APP_SUPABASE_URL: Supabase project URL (https://<project>.supabase.co)
- REACT_APP_SUPABASE_ANON_KEY: Supabase public anon key

A `.env.example` is provided under notes_app_frontend for reference.

## Database Table
Create the `notes` table in your Supabase project:

```sql
create table if not exists public.notes (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  category text,
  updated_at timestamp with time zone default now()
);
```

If `uuid_generate_v4()` is not available, enable the extension:
```sql
create extension if not exists "uuid-ossp";
```

## Security
If using Row Level Security (recommended), enable it and add a policy to allow read/write for anon if appropriate for your use case, or restrict by user with auth:

```sql
alter table public.notes enable row level security;

-- public demo policy (read/write for all)
create policy "Public read" on public.notes for select using (true);
create policy "Public insert" on public.notes for insert with check (true);
create policy "Public update" on public.notes for update using (true);
create policy "Public delete" on public.notes for delete using (true);
```

For authenticated users, replace the policies with user-specific constraints and add user_id column, etc.

## Frontend Code
- `src/supabaseClient.js` initializes the Supabase client using env vars.
- `src/services/notesService.js` contains CRUD functions for the `notes` table.
- `src/context/NotesContext.js` uses the service to load and mutate notes.

No keys are hardcoded. Ensure env vars are set in the runtime environment.
