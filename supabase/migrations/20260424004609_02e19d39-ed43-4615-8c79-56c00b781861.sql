-- Add cloudflare_uid: unique, indexed identifier for de-duplication during Cloudflare sync.
-- Stap 1: kolom toevoegen (nullable voor backfill).
ALTER TABLE public.image_library
  ADD COLUMN IF NOT EXISTS cloudflare_uid text;

-- Stap 2: backfill — bestaande rijen met cloudflare_id krijgen dezelfde waarde als uid.
UPDATE public.image_library
SET cloudflare_uid = cloudflare_id
WHERE cloudflare_uid IS NULL AND cloudflare_id IS NOT NULL;

-- Stap 3: rijen zonder cloudflare_id krijgen een tijdelijke placeholder zodat NOT NULL niet faalt.
UPDATE public.image_library
SET cloudflare_uid = 'pending-' || id::text
WHERE cloudflare_uid IS NULL;

-- Stap 4: NOT NULL + UNIQUE constraint.
ALTER TABLE public.image_library
  ALTER COLUMN cloudflare_uid SET NOT NULL;

ALTER TABLE public.image_library
  ADD CONSTRAINT image_library_cloudflare_uid_unique UNIQUE (cloudflare_uid);

-- Stap 5: index voor snelle lookup tijdens sync (UNIQUE-constraint maakt al een index, maar expliciet voor duidelijkheid).
CREATE INDEX IF NOT EXISTS idx_image_library_cloudflare_uid
  ON public.image_library (cloudflare_uid);