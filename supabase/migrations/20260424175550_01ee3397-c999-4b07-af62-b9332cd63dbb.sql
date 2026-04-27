-- Tabel voor dynamisch beheer van samengestelde verhuurformules
CREATE TABLE public.unit_compositions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  module_location_ids TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.unit_compositions ENABLE ROW LEVEL SECURITY;

-- Iedereen mag lezen (publieke site gebruikt deze data voor galleries)
CREATE POLICY "Compositions are publicly readable"
ON public.unit_compositions FOR SELECT
USING (true);

-- Admins en editors kunnen aanpassen
CREATE POLICY "Admins and editors can insert compositions"
ON public.unit_compositions FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update compositions"
ON public.unit_compositions FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can delete compositions"
ON public.unit_compositions FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_unit_compositions_updated_at
BEFORE UPDATE ON public.unit_compositions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed met huidige config-waarden zodat niets breekt
INSERT INTO public.unit_compositions (slug, display_name, module_location_ids, sort_order) VALUES
  ('watermolen-plus', 'Watermolen Plus', ARRAY[
    'hoogmolen-verblijf-watermolen',
    'hoogmolen-verblijf-duplexsuite-a5',
    'hoogmolen-verblijf-duplexsuite-a6',
    'hoogmolen-verblijf-molenhuys'
  ], 10),
  ('peerdermolen-plus', 'Peerdermolen Plus', ARRAY[
    'hoogmolen-verblijf-peerdermolen',
    'hoogmolen-verblijf-duplexsuite-a5',
    'hoogmolen-verblijf-duplexsuite-a6',
    'hoogmolen-verblijf-molenhuys'
  ], 20),
  ('volmolen', 'Volmolen', ARRAY[
    'hoogmolen-verblijf-watermolen',
    'hoogmolen-verblijf-peerdermolen'
  ], 30),
  ('volmolen-plus', 'Volmolen Plus', ARRAY[
    'hoogmolen-verblijf-watermolen',
    'hoogmolen-verblijf-peerdermolen',
    'hoogmolen-verblijf-duplexsuite-a5',
    'hoogmolen-verblijf-duplexsuite-a6',
    'hoogmolen-verblijf-molenhuys'
  ], 40),
  ('landgoed-de-hoogmolen', 'Landgoed De Hoogmolen', ARRAY[
    'hoogmolen-verblijf-watermolen',
    'hoogmolen-verblijf-peerdermolen',
    'hoogmolen-verblijf-duplexsuite-a1',
    'hoogmolen-verblijf-duplexsuite-a2',
    'hoogmolen-verblijf-duplexsuite-a3',
    'hoogmolen-verblijf-duplexsuite-a4',
    'hoogmolen-verblijf-duplexsuite-a5',
    'hoogmolen-verblijf-duplexsuite-a6',
    'hoogmolen-verblijf-molenhuys'
  ], 50);