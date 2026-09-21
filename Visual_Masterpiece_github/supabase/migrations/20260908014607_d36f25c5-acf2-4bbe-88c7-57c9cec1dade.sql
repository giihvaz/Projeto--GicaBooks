ALTER TABLE public.book_comments ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.book_comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS book_comments_parent_idx ON public.book_comments(parent_id);

CREATE TABLE IF NOT EXISTS public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.book_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
GRANT SELECT ON public.comment_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.comment_likes TO authenticated;
GRANT ALL ON public.comment_likes TO service_role;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY comment_likes_read ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY comment_likes_insert ON public.comment_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY comment_likes_delete_own ON public.comment_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT ON public.shelf_items TO anon;
CREATE POLICY shelf_public_read ON public.shelf_items FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.perfil_publico(_user_id uuid)
RETURNS TABLE (id uuid, nome text, avatar text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.nome, p.avatar, p.created_at FROM public.profiles p WHERE p.id = _user_id
$$;
GRANT EXECUTE ON FUNCTION public.perfil_publico(uuid) TO anon, authenticated;