@echo off
setlocal

:: Nom du projet
set "PROJECT_NAME=africagnotte"

:: Créer le projet avec Next.js
echo 🔧 Création du projet Next.js : %PROJECT_NAME%
npx create-next-app@latest %PROJECT_NAME% --typescript --app --tailwind --eslint --src-dir --import-alias "@/*"

cd %PROJECT_NAME%

:: Installation des dépendances nécessaires
echo 📦 Installation des bibliothèques principales...
call npm install prisma @prisma/client next-auth react-hook-form zod @hookform/resolvers axios @stripe/stripe-js stripe resend classnames date-fns lucide-react dotenv

:: Initialisation de Prisma
echo 🗃️ Initialisation de Prisma...
npx prisma init

:: Écrire un exemple de schéma Prisma
echo ✍️ Écriture du schéma Prisma...

> prisma\schema.prisma (
echo datasource db {
echo   provider = "postgresql"
echo   url      = env("DATABASE_URL")
echo }
echo.
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo model User {
echo   id        String   @id @default(cuid())
echo   email     String   @unique
echo   name      String?
echo   password  String?
echo   createdAt DateTime @default(now())
echo   cagnottes Cagnotte[]
echo }
echo.
echo model Cagnotte {
echo   id          String   @id @default(cuid())
echo   titre       String
echo   description String
echo   montant     Float
echo   userId      String
echo   user        User     @relation(fields: [userId], references: [id])
echo }
)

:: Ajout d’un fichier .env avec une base de données factice (à modifier par l'utilisateur)
echo 🌐 Configuration de la base de données...
echo DATABASE_URL="postgresql://user:password@localhost:5432/africagnotte_db" > .env

:: Pousser le schéma vers la base (préparer les tables)
echo 🛠️ Création de la base de données (via Prisma DB Push)...
npx prisma db push

echo ✅ Projet %PROJECT_NAME% prêt !
echo Lance "npm run dev" pour démarrer le serveur de développement.

endlocal
pause
