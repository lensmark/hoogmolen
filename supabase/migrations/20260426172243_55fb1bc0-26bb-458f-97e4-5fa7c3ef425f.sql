-- Allow public (anon) read access to overrides so live visitors see admin choices.
-- Write access (INSERT/UPDATE/DELETE) remains restricted to admins/editors.

DROP POLICY IF EXISTS "Authenticated users can view image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Authenticated users can view text overrides" ON public.text_overrides;

CREATE POLICY "Anyone can view image overrides"
  ON public.image_overrides
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view text overrides"
  ON public.text_overrides
  FOR SELECT
  TO anon, authenticated
  USING (true);