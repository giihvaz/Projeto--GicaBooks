CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT 'Leitora',
  email text,
  avatar text NOT NULL DEFAULT 'gato',
  tema text NOT NULL DEFAULT 'rosa',
  modo text NOT NULL DEFAULT 'light',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.shelf_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id text NOT NULL,
  titulo text NOT NULL,
  autor text NOT NULL DEFAULT '',
  genero text NOT NULL DEFAULT 'Romance',
  paginas integer NOT NULL DEFAULT 0,
  bg text,
  status text NOT NULL DEFAULT 'quero',
  pagina_atual integer NOT NULL DEFAULT 0,
  iniciado_em timestamptz,
  terminado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shelf_items TO authenticated;
GRANT ALL ON public.shelf_items TO service_role;
ALTER TABLE public.shelf_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shelf_own" ON public.shelf_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.community_books (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  autor text NOT NULL DEFAULT '',
  genero text NOT NULL DEFAULT 'Romance',
  paginas integer NOT NULL DEFAULT 0,
  blurb text NOT NULL DEFAULT '',
  bg text,
  adicionado_por text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_books TO anon;
GRANT SELECT, INSERT, DELETE ON public.community_books TO authenticated;
GRANT ALL ON public.community_books TO service_role;
ALTER TABLE public.community_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_books_read" ON public.community_books FOR SELECT USING (true);
CREATE POLICY "community_books_insert" ON public.community_books FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_books_delete_own" ON public.community_books FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.book_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT 'Leitora',
  avatar text NOT NULL DEFAULT 'gato',
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.book_comments TO anon;
GRANT SELECT, INSERT, DELETE ON public.book_comments TO authenticated;
GRANT ALL ON public.book_comments TO service_role;
ALTER TABLE public.book_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "book_comments_read" ON public.book_comments FOR SELECT USING (true);
CREATE POLICY "book_comments_insert" ON public.book_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "book_comments_delete_own" ON public.book_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX book_comments_book_idx ON public.book_comments (book_id, created_at);

CREATE TABLE public.community_playlists (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  spotify_id text NOT NULL,
  comentario text NOT NULL DEFAULT '',
  adicionado_por text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_playlists TO anon;
GRANT SELECT, INSERT, DELETE ON public.community_playlists TO authenticated;
GRANT ALL ON public.community_playlists TO service_role;
ALTER TABLE public.community_playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_playlists_read" ON public.community_playlists FOR SELECT USING (true);
CREATE POLICY "community_playlists_insert" ON public.community_playlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "community_playlists_delete_own" ON public.community_playlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', split_part(COALESCE(NEW.email, 'leitora'), '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar', 'gato')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();