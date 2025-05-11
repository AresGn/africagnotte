# Guide d'installation de la table profiles dans Supabase

## Instructions

1. Connectez-vous à votre projet Supabase
2. Allez dans la section **SQL Editor** du menu gauche
3. Cliquez sur **+ New Query**
4. Copiez et collez le script SQL ci-dessous
5. Cliquez sur **RUN** pour exécuter le script

## Script SQL

```sql
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

-- Politique permettant à un utilisateur de créer son profil
CREATE POLICY "Les utilisateurs peuvent créer leur propre profil"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

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
```

## Vérification

Après avoir exécuté le script, vous devriez voir un message de succès. Pour vérifier que la table a été créée correctement :

1. Allez dans la section **Table Editor** du menu gauche
2. Vous devriez voir la table `profiles` dans la liste des tables
3. Si vous cliquez sur cette table, vous devriez voir les colonnes `id`, `first_name`, `last_name`, `username`, `phone_number`, `country`, `created_at` et `updated_at`

## Dépannage

Si vous rencontrez des erreurs lors de l'exécution du script, voici quelques problèmes courants et leurs solutions :

- **Erreur de syntaxe SQL** : Assurez-vous d'avoir copié tout le script sans erreur
- **La table existe déjà** : Ce n'est pas un problème, le script utilise `IF NOT EXISTS` pour éviter les conflits
- **Erreur de permission** : Assurez-vous d'être connecté avec un compte qui a les droits d'administrateur sur le projet 