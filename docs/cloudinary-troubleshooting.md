# Guide de dépannage Cloudinary - AfriCagnotte

## Problème: "Upload preset not found"

### Diagnostic
L'erreur "Upload preset not found" indique que le preset `africagnotte_media` n'existe pas dans votre compte Cloudinary ou n'est pas configuré correctement.

### Solution 1: Créer le preset manuellement (Recommandé)

1. **Connectez-vous à Cloudinary**
   - Allez sur https://cloudinary.com/users/login
   - Utilisez vos identifiants Cloudinary

2. **Naviguez vers les Upload Presets**
   - Dans le menu de gauche, cliquez sur "Settings"
   - Puis cliquez sur "Upload"
   - Vous verrez la section "Upload presets"

3. **Créer un nouveau preset**
   - Cliquez sur "Add upload preset"
   - Configurez comme suit:

   ```
   Preset name: africagnotte_media
   Signing Mode: Unsigned (IMPORTANT!)
   Resource type: Auto
   Max file size: 10485760 (10MB)
   Allowed formats: jpg,png,gif,mp4,mov,webp
   Quality: Auto
   Format: Auto
   Folder: africagnotte (optionnel, pour organiser)
   Use filename: true
   Unique filename: true
   Overwrite: false
   ```

4. **Paramètres avancés (optionnels)**
   - Tags: `africagnotte,user_upload`
   - Max image width: 1920
   - Max image height: 1080

5. **Sauvegarder**
   - Cliquez sur "Save"

### Solution 2: Créer le preset via script (Avancé)

Si vous avez votre API Secret:

1. **Ajoutez l'API Secret dans .env.local**
   ```
   CLOUDINARY_API_SECRET=votre_api_secret_ici
   ```

2. **Exécutez le script**
   ```bash
   node scripts/create-cloudinary-preset.js
   ```

### Vérification de la configuration

1. **Variables d'environnement requises**
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dql2osqaj
   NEXT_PUBLIC_CLOUDINARY_API_KEY=953753544822435
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=africagnotte_media
   ```

2. **Test de la configuration**
   - Allez sur http://localhost:3000/test-cloudinary
   - Vérifiez que toutes les variables sont affichées
   - Testez l'upload avec le bouton de test

### Problèmes courants

#### 1. Preset existe mais erreur persiste
- Vérifiez que le mode est "Unsigned"
- Vérifiez l'orthographe exacte du nom du preset
- Redémarrez votre serveur de développement

#### 2. Variables d'environnement non chargées
- Vérifiez que les variables commencent par `NEXT_PUBLIC_`
- Redémarrez le serveur après modification des variables
- Vérifiez qu'il n'y a pas d'espaces dans les valeurs

#### 3. Erreur de CORS
- Assurez-vous que le preset est en mode "Unsigned"
- Vérifiez les domaines autorisés dans Cloudinary

### Test de fonctionnement

1. **Page de test**
   - http://localhost:3000/test-cloudinary
   - Testez l'upload d'une image
   - Vérifiez les logs dans la console

2. **Dans l'application**
   - Allez sur la page de création de cagnotte
   - Testez l'upload d'images et vidéos
   - Vérifiez que les URLs sont générées correctement

### Logs utiles

Ouvrez la console du navigateur (F12) pour voir:
- Configuration Cloudinary chargée
- Résultats des uploads
- Erreurs détaillées

### Support

Si le problème persiste:
1. Vérifiez votre quota Cloudinary
2. Consultez la documentation Cloudinary
3. Vérifiez les logs du serveur Cloudinary dans votre dashboard
