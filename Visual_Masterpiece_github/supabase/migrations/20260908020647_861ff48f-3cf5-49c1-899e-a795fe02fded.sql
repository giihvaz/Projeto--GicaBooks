ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';

DROP FUNCTION IF EXISTS public.perfil_publico(uuid);

CREATE FUNCTION public.perfil_publico(_user_id uuid)
RETURNS TABLE(id uuid, nome text, avatar text, bio text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, nome, avatar, bio, created_at FROM public.profiles WHERE id = _user_id;
$$;

GRANT EXECUTE ON FUNCTION public.perfil_publico(uuid) TO anon, authenticated;