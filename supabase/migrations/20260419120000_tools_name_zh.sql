-- Add the missing Chinese-name column that the import-tool + ZH UI expect.
-- Safe to re-run: IF NOT EXISTS is idempotent.
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS name_zh text;
