UPDATE public.unit_compositions
SET module_location_ids = ARRAY(
  SELECT replace(elem, 'hoogmolen-verblijf-duplexsuite-', 'hoogmolen-verblijf-suite-')
  FROM unnest(module_location_ids) AS elem
)
WHERE EXISTS (
  SELECT 1 FROM unnest(module_location_ids) AS elem
  WHERE elem LIKE 'hoogmolen-verblijf-duplexsuite-%'
);