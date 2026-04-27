-- Create image_aliases table for tracking renames
CREATE TABLE public.image_aliases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  old_id TEXT NOT NULL UNIQUE,
  new_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE INDEX idx_image_aliases_new_id ON public.image_aliases(new_id);

ALTER TABLE public.image_aliases ENABLE ROW LEVEL SECURITY;

-- Public can read (so the smart resolver works for unauthenticated visitors)
CREATE POLICY "Image aliases are publicly readable"
ON public.image_aliases
FOR SELECT
USING (true);

CREATE POLICY "Admins and editors can insert image aliases"
ON public.image_aliases
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins and editors can update image aliases"
ON public.image_aliases
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins can delete image aliases"
ON public.image_aliases
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));