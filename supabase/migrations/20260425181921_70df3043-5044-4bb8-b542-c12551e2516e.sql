-- 1. Add tags column to image_library
ALTER TABLE public.image_library
ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_image_library_tags ON public.image_library USING GIN(tags);

-- 2. Create unique_tags table
CREATE TABLE IF NOT EXISTS public.unique_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

ALTER TABLE public.unique_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unique tags are publicly readable"
ON public.unique_tags FOR SELECT
USING (true);

CREATE POLICY "Admins and editors can insert unique tags"
ON public.unique_tags FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update unique tags"
ON public.unique_tags FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins can delete unique tags"
ON public.unique_tags FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Seed standard tags (Hoogmolen brand colors)
INSERT INTO public.unique_tags (label, color) VALUES
  ('sfeer', 'accent'),
  ('omgeving', 'primary'),
  ('drone', 'primary-deep'),
  ('detail', 'secondary'),
  ('exterieur', 'primary'),
  ('interieur', 'accent'),
  ('mensen', 'primary-deep'),
  ('food', 'secondary')
ON CONFLICT (label) DO NOTHING;