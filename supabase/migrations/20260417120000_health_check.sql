ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS health_status text NOT NULL
    DEFAULT 'unknown'
    CHECK (health_status IN ('healthy', 'flagged', 'unknown')),
  ADD COLUMN IF NOT EXISTS health_fail_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS health_last_checked timestamptz,
  ADD COLUMN IF NOT EXISTS health_last_failure timestamptz;

CREATE INDEX IF NOT EXISTS tools_health_status_idx
  ON public.tools (health_status);
