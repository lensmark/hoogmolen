-- 1. Verwijder eventuele duplicaten (behoud oudste per cloudflare_id)
DELETE FROM public.image_library a
USING public.image_library b
WHERE a.cloudflare_id IS NOT NULL
  AND a.cloudflare_id = b.cloudflare_id
  AND a.created_at > b.created_at;

-- 2. Unieke constraint op cloudflare_id (NULL toegestaan voor pending/failed uploads)
ALTER TABLE public.image_library
  ADD CONSTRAINT image_library_cloudflare_id_unique UNIQUE (cloudflare_id);

-- 3. Index voor snelle lookups tijdens sync
CREATE INDEX IF NOT EXISTS idx_image_library_cloudflare_id
  ON public.image_library (cloudflare_id)
  WHERE cloudflare_id IS NOT NULL;