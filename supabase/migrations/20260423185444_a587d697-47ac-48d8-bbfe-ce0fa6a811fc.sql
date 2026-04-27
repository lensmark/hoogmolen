-- Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- image_library: audit trail of every upload attempt
CREATE TABLE public.image_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  cloudflare_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_msg TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_image_library_created_at ON public.image_library (created_at DESC);
CREATE INDEX idx_image_library_status ON public.image_library (status);
CREATE INDEX idx_image_library_filename ON public.image_library (filename);

ALTER TABLE public.image_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view image library"
  ON public.image_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert image library"
  ON public.image_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update image library"
  ON public.image_library FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete image library"
  ON public.image_library FOR DELETE
  TO authenticated
  USING (true);

-- image_overrides: maps page sections to override image URLs
CREATE TABLE public.image_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  section_key TEXT NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (page_path, section_key)
);

CREATE INDEX idx_image_overrides_page ON public.image_overrides (page_path);

ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view image overrides"
  ON public.image_overrides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert image overrides"
  ON public.image_overrides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update image overrides"
  ON public.image_overrides FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete image overrides"
  ON public.image_overrides FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER trg_image_overrides_updated_at
  BEFORE UPDATE ON public.image_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();