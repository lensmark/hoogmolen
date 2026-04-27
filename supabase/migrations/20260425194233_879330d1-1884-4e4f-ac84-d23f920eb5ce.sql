-- ============================================================
-- main_photos: flexibele hoofdfoto-markering per context
-- Context-formaten: "unit:<slug>", "page:<path>", "section:<key>",
--                   "category:<tag>", of vrij naar keuze
-- ============================================================

CREATE TABLE public.main_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  context_type TEXT NOT NULL,        -- 'unit' | 'page' | 'section' | 'category'
  context_key TEXT NOT NULL,         -- 'watermolen' | '/' | 'home-hero' | 'sfeer'
  image_id UUID NOT NULL REFERENCES public.image_library(id) ON DELETE CASCADE,
  set_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Maximum één hoofdfoto per context
  UNIQUE (context_type, context_key)
);

-- Index voor snelle lookups
CREATE INDEX idx_main_photos_context
  ON public.main_photos (context_type, context_key);

CREATE INDEX idx_main_photos_image_id
  ON public.main_photos (image_id);

-- Trigger voor updated_at
CREATE TRIGGER update_main_photos_updated_at
  BEFORE UPDATE ON public.main_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.main_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Main photos are publicly readable"
  ON public.main_photos
  FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert main photos"
  ON public.main_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

CREATE POLICY "Admins and editors can update main photos"
  ON public.main_photos
  FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

CREATE POLICY "Admins and editors can delete main photos"
  ON public.main_photos
  FOR DELETE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.main_photos;