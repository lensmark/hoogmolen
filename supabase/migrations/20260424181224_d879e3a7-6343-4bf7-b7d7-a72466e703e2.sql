UPDATE public.unit_compositions SET sort_order = CASE slug
  WHEN 'watermolen' THEN 10
  WHEN 'peerdermolen' THEN 20
  WHEN 'watermolen-plus' THEN 30
  WHEN 'peerdermolen-plus' THEN 40
  WHEN 'volmolen' THEN 50
  WHEN 'volmolen-plus' THEN 60
  WHEN 'landgoed-de-hoogmolen' THEN 70
  ELSE sort_order
END
WHERE slug IN ('watermolen','peerdermolen','watermolen-plus','peerdermolen-plus','volmolen','volmolen-plus','landgoed-de-hoogmolen');