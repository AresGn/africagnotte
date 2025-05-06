# AfricaGnotte

AfricaGnotte est une plateforme de collecte de dons 100% dédiée à l'Afrique, centrée sur l'aide aux personnes en difficulté (malades, familles sans abri, orphelins, etc.).

## Caractéristiques

- Création rapide de cagnottes pour différentes catégories (Santé, Famille, Orphelins, Urgences)
- Interface responsive optimisée pour mobile, tablette et ordinateur
- Système de paiement sécurisé adapté à l'Afrique (Mobile Money, cartes bancaires, etc.)
- Partage facile sur réseaux sociaux et WhatsApp
- Support pour les photos et vidéos
- Système de modération pour garantir l'authenticité des besoins

## Technologies utilisées

- **Frontend:** Next.js 15.3, React 19
- **Styling:** Tailwind CSS 4
- **Deployment:** À définir

## Installation

```bash
# Cloner le répertoire
git clone <repository-url>

# Installer les dépendances
cd africagnotte
npm install

# Lancer le serveur de développement
npm run dev
```

## Structure du projet

```
africagnotte/
├── app/              # Dossier principal de l'application Next.js
│   ├── components/   # Composants React réutilisables
│   ├── globals.css   # Styles globaux
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Page d'accueil
├── public/           # Fichiers statiques (images, etc.)
├── README.md         # Ce fichier
├── package.json      # Dépendances du projet
└── tailwind.config.js # Configuration Tailwind CSS
```

## Prochaines étapes

- Mise en place de l'authentification
- Intégration des passerelles de paiement africaines
- Système de modération des cagnottes
- Tableaux de bord utilisateurs et administrateurs
- Support multilingue

## Licence

[À définir]
