-- 1. Kolommen toevoegen
ALTER TABLE public.unit_compositions
  ADD COLUMN IF NOT EXISTS unit_type text NOT NULL DEFAULT 'composition',
  ADD COLUMN IF NOT EXISTS visible_on text[] NOT NULL DEFAULT ARRAY['hoogmolen']::text[],
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text;

-- 2. Index voor snelle filtering per site
CREATE INDEX IF NOT EXISTS idx_unit_compositions_visible_on
  ON public.unit_compositions USING GIN (visible_on);

-- 3. Bestaande 7 formules taggen — Oudsbergen, België, beide sites zichtbaar
UPDATE public.unit_compositions
SET
  country = 'België',
  city = 'Oudsbergen',
  visible_on = ARRAY['hoogmolen','stayyousoon']::text[],
  unit_type = CASE
    WHEN slug IN ('watermolen','peerdermolen') THEN 'house'
    ELSE 'composition'
  END
WHERE slug IN (
  'watermolen','peerdermolen','watermolen-plus','peerdermolen-plus',
  'volmolen','volmolen-plus','landgoed-de-hoogmolen'
);

-- 4. Comment voor toekomstige editors
COMMENT ON COLUMN public.unit_compositions.unit_type IS 'room | house | villa | composition';
COMMENT ON COLUMN public.unit_compositions.visible_on IS 'Array van site-IDs: hoogmolen, stayyousoon';
COMMENT ON COLUMN public.unit_compositions.country IS 'België | Spanje | ...';
COMMENT ON COLUMN public.unit_compositions.city IS 'Vrij tekstveld — Oudsbergen, Houthalen, Pilar de la Horadada, San Pedro del Pinatar, ...';