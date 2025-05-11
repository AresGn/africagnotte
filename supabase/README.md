# Migrations Supabase pour AfriCagnotte

Ce dossier contient les migrations SQL pour la base de données Supabase d'AfriCagnotte.

## Comment appliquer ces migrations

### Méthode 1 : Via l'interface Supabase

1. Connectez-vous à votre projet Supabase
2. Allez dans la section "SQL Editor"
3. Copiez et collez le contenu du fichier SQL
4. Exécutez le script

### Méthode 2 : Via Supabase CLI

Si vous avez installé [Supabase CLI](https://supabase.com/docs/guides/cli), vous pouvez appliquer les migrations avec la commande suivante :

```bash
supabase db push
```

## Structure de la base de données

### Table `profiles`

Cette table stocke les informations de profil des utilisateurs.

| Colonne       | Type       | Description                               |
|---------------|------------|-------------------------------------------|
| id            | UUID       | Clé primaire, liée à auth.users(id)       |
| first_name    | TEXT       | Prénom de l'utilisateur                   |
| last_name     | TEXT       | Nom de l'utilisateur                      |
| username      | TEXT       | Pseudo unique de l'utilisateur            |
| phone_number  | TEXT       | Numéro de téléphone                       |
| country       | TEXT       | Pays de résidence                         |
| created_at    | TIMESTAMP  | Date de création du profil                |
| updated_at    | TIMESTAMP  | Date de dernière mise à jour du profil    |

### Politiques de sécurité (RLS)

La table `profiles` utilise Row Level Security (RLS) pour garantir que les utilisateurs ne peuvent accéder qu'à leurs propres données.

- **"Les utilisateurs peuvent voir leur propre profil"** : Permet à un utilisateur de lire son propre profil
- **"Les utilisateurs peuvent mettre à jour leur propre profil"** : Permet à un utilisateur de mettre à jour son propre profil
- **"Les utilisateurs peuvent créer leur propre profil"** : Permet à un utilisateur de créer son profil 