ALTER TABLE public.unit_compositions
ADD COLUMN IF NOT EXISTS modules text[] NOT NULL DEFAULT '{}';

UPDATE public.unit_compositions
SET modules = CASE slug
  WHEN 'watermolen-plus' THEN ARRAY['watermolen', 'de-shetlander', 'de-jutlander']
  WHEN 'peerdermolen-plus' THEN ARRAY['peerdermolen', 'de-shetlander', 'de-jutlander']
  WHEN 'volmolen' THEN ARRAY['watermolen', 'peerdermolen']
  WHEN 'volmolen-plus' THEN ARRAY['watermolen', 'peerdermolen', 'de-shetlander', 'de-jutlander']
  WHEN 'landgoed-de-hoogmolen' THEN ARRAY['watermolen', 'peerdermolen', 'de-fries', 'de-fjord', 'de-brabander', 'de-draver', 'de-shetlander', 'de-jutlander']
  ELSE modules
END
WHERE coalesce(array_length(modules, 1), 0) = 0;