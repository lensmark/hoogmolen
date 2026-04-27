-- Sync History audit log
CREATE TABLE public.sync_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
  action TEXT NOT NULL,
  message TEXT NOT NULL,
  affected_items TEXT[] NOT NULL DEFAULT '{}',
  counts JSONB NOT NULL DEFAULT '{}'::jsonb,
  triggered_by UUID
);

-- Index voor snelle "laatste N" queries
CREATE INDEX idx_sync_history_created_at ON public.sync_history (created_at DESC);
CREATE INDEX idx_sync_history_action ON public.sync_history (action);

-- Enable RLS
ALTER TABLE public.sync_history ENABLE ROW LEVEL SECURITY;

-- Alleen admins en editors mogen de history bekijken
CREATE POLICY "Admins and editors can view sync history"
ON public.sync_history
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
);

-- Alleen admins en editors mogen handmatig records toevoegen (edge functions gebruiken service-role en bypassen RLS)
CREATE POLICY "Admins and editors can insert sync history"
ON public.sync_history
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
);

-- Alleen admins mogen records verwijderen (voor opruimen)
CREATE POLICY "Admins can delete sync history"
ON public.sync_history
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));