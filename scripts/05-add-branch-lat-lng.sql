-- Adds latitude/longitude columns to branches and related constraints/indexes
-- Safe to run multiple times (idempotent)

BEGIN;

-- 1) Add columns if they do not exist
ALTER TABLE IF EXISTS public.branches
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

-- 2) Add range constraints (guarded so they are created only once)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'branches_latitude_range'
  ) THEN
    ALTER TABLE public.branches
      ADD CONSTRAINT branches_latitude_range
      CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'branches_longitude_range'
  ) THEN
    ALTER TABLE public.branches
      ADD CONSTRAINT branches_longitude_range
      CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180);
  END IF;
END$$;

-- 3) Useful index for geo lookups (e.g., nearest/within radius)
CREATE INDEX IF NOT EXISTS idx_branches_lat_lon ON public.branches (latitude, longitude);

-- 4) Optional: backfill coordinates for existing branches
-- Uncomment and replace values/ids accordingly
-- UPDATE public.branches SET latitude = -5.397140, longitude = 105.266640 WHERE id = 'branch-your-id-here';
-- UPDATE public.branches SET latitude = -6.200000, longitude = 106.816666 WHERE id = 'branch-another-id';

COMMIT;

