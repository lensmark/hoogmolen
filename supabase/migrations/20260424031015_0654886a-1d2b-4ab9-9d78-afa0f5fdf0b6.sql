-- Vervang de authenticated-only SELECT-policy door een publieke leesregel.
-- INSERT/UPDATE/DELETE policies blijven ongewijzigd (admin/editor only).
DROP POLICY IF EXISTS "Authenticated users can view image library" ON public.image_library;

CREATE POLICY "Image library is publicly readable"
  ON public.image_library
  FOR SELECT
  TO anon, authenticated
  USING (status = 'success');