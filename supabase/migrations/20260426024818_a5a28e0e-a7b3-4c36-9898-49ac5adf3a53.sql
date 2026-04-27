-- 1. Nieuwe kolom (nullable tijdens backfill, daarna NOT NULL)
ALTER TABLE public.image_library
  ADD COLUMN IF NOT EXISTS sequence_number INTEGER;

-- 2. Backfill op basis van created_at (oudste = 1)
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM public.image_library
)
UPDATE public.image_library il
SET sequence_number = ordered.rn
FROM ordered
WHERE il.id = ordered.id
  AND il.sequence_number IS NULL;

-- 3. Unieke index + NOT NULL
CREATE UNIQUE INDEX IF NOT EXISTS image_library_sequence_number_key
  ON public.image_library (sequence_number);

ALTER TABLE public.image_library
  ALTER COLUMN sequence_number SET NOT NULL;

-- 4. Trigger functie: nieuwe rij krijgt MAX+1
CREATE OR REPLACE FUNCTION public.assign_image_sequence_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sequence_number IS NULL THEN
    SELECT COALESCE(MAX(sequence_number), 0) + 1
      INTO NEW.sequence_number
      FROM public.image_library;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Trigger op INSERT
DROP TRIGGER IF EXISTS trg_assign_image_sequence_number ON public.image_library;
CREATE TRIGGER trg_assign_image_sequence_number
  BEFORE INSERT ON public.image_library
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_image_sequence_number();