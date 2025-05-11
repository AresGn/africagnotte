-- Création de la table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  phone_number TEXT,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activation de la sécurité RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Suppression des politiques existantes si elles existent déjà
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur propre profil" ON public.profiles;
DROP POLICY IF EXISTS "Service role peut créer un profil" ON public.profiles;

-- Création des politiques de sécurité
-- Politique permettant à un utilisateur de voir son propre profil
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Politique permettant à un utilisateur de mettre à jour son propre profil
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Politique permettant à un utilisateur authentifié de créer son propre profil
CREATE POLICY "Les utilisateurs peuvent créer leur propre profil"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Politique permettant au service role (via l'API) de créer des profils
-- Cette politique est nécessaire pour l'inscription initiale
CREATE POLICY "Service role peut créer un profil"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (true);

-- Fonction pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Suppression du trigger s'il existe déjà
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

-- Trigger pour mettre à jour la date
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 