CREATE TABLE IF NOT EXISTS public.text_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  section_key text NOT NULL,
  text_value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE INDEX IF NOT EXISTS text_overrides_lookup_idx
  ON public.text_overrides (page_path, section_key);

ALTER TABLE public.text_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view text overrides"
  ON public.text_overrides FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admins and editors can insert text overrides"
  ON public.text_overrides FOR INSERT
  TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

CREATE POLICY "Admins and editors can update text overrides"
  ON public.text_overrides FOR UPDATE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

CREATE POLICY "Admins and editors can delete text overrides"
  ON public.text_overrides FOR DELETE
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

CREATE TRIGGER trg_text_overrides_updated_at
  BEFORE UPDATE ON public.text_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();