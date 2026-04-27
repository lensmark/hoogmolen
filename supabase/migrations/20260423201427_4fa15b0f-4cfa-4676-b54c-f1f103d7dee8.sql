-- Tighten image_library policies (admins/editors only for mutations)
DROP POLICY IF EXISTS "Authenticated users can insert image library" ON public.image_library;
DROP POLICY IF EXISTS "Authenticated users can update image library" ON public.image_library;
DROP POLICY IF EXISTS "Authenticated users can delete image library" ON public.image_library;

CREATE POLICY "Admins and editors can insert image library"
  ON public.image_library FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update image library"
  ON public.image_library FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can delete image library"
  ON public.image_library FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Tighten image_overrides policies
DROP POLICY IF EXISTS "Authenticated users can insert image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Authenticated users can update image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Authenticated users can delete image overrides" ON public.image_overrides;

CREATE POLICY "Admins and editors can insert image overrides"
  ON public.image_overrides FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update image overrides"
  ON public.image_overrides FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can delete image overrides"
  ON public.image_overrides FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));