-- Inserts and reads go through the Supabase service role (server-side only), which bypasses RLS.
-- Drop the anon insert policy so the table is not writable with the anon key from browsers.

drop policy if exists "submissions_insert_public" on public.submissions;
