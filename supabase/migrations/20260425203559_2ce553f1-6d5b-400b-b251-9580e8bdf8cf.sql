-- Per-unit gallery instellingen: verbergen + handmatige volgorde per foto
CREATE TABLE public.unit_gallery_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  context_type TEXT NOT NULL,
  context_key TEXT NOT NULL,
  image_id UUID NOT NULL REFERENCES public.image_library(id) ON DELETE CASCADE,
  hidden BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  set_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (context_type, context_key, image_id)
);

CREATE INDEX idx_unit_gallery_settings_ctx
  ON public.unit_gallery_settings (context_type, context_key);

ALTER TABLE public.unit_gallery_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unit gallery settings are publicly readable"
  ON public.unit_gallery_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert unit gallery settings"
  ON public.unit_gallery_settings FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update unit gallery settings"
  ON public.unit_gallery_settings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can delete unit gallery settings"
  ON public.unit_gallery_settings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER update_unit_gallery_settings_updated_at
  BEFORE UPDATE ON public.unit_gallery_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.unit_gallery_settings;
ALTER TABLE public.unit_gallery_settings REPLICA IDENTITY FULL;