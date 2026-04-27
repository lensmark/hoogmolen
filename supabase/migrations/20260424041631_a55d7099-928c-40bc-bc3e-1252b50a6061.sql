-- Realtime publicatie voor image_library zodat clients live updates krijgen
-- bij INSERT/UPDATE/DELETE (gebruikt door useImageLibrary).
ALTER TABLE public.image_library REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'image_library'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.image_library;
  END IF;
END $$;