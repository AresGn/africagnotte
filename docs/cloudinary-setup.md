# Configuration Cloudinary - AfriCagnotte

## Résumé du problème

L'erreur "Upload preset not found" indique que le preset `africagnotte_media` n'existe pas dans votre compte Cloudinary.

## Solution rapide

### Étape 1: Créer le preset manuellement

1. **Connectez-vous à Cloudinary**: https://cloudinary.com/users/login
2. **Allez dans Settings → Upload**
3. **Cliquez sur "Add upload preset"**
4. **Configurez le preset**:
   - **Nom**: `africagnotte_media`
   - **Mode**: `Unsigned` (IMPORTANT!)
   - **Resource type**: `Auto`
   - **Max file size**: `10MB`
   - **Formats**: `jpg,png,gif,mp4,mov,webp`

### Étape 2: Tester la configuration

```bash
# Tester la configuration complète
npm run cloudinary:test

# Vérifier que le preset existe
npm run cloudinary:verify
```

### Étape 3: Tester dans l'application

1. Allez sur http://localhost:3000/test-cloudinary
2. Testez l'upload d'une image
3. Vérifiez que l'upload fonctionne sans erreur

## Scripts disponibles

```bash
# Tester la configuration Cloudinary
npm run cloudinary:test

# Vérifier l'existence du preset
npm run cloudinary:verify

# Créer le preset automatiquement (nécessite API Secret)
npm run cloudinary:create
```

## Configuration requise

### Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dql2osqaj
NEXT_PUBLIC_CLOUDINARY_API_KEY=953753544822435
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=africagnotte_media
```

### Configuration du preset Cloudinary

```json
{
  "name": "africagnotte_media",
  "unsigned": true,
  "resource_type": "auto",
  "allowed_formats": ["jpg", "png", "gif", "mp4", "mov", "webp"],
  "max_file_size": 10485760,
  "quality": "auto",
  "format": "auto",
  "folder": "africagnotte",
  "use_filename": true,
  "unique_filename": true,
  "overwrite": false,
  "tags": ["africagnotte", "user_upload"]
}
```

## Vérification du fonctionnement

### 1. Test automatisé
```bash
npm run cloudinary:test
```

**Résultat attendu**:
- ✅ Variables d'environnement: OK
- ✅ Format Cloud Name: OK  
- ✅ Connectivité Cloudinary: OK
- ✅ Existence du preset: OK

### 2. Test manuel
1. Ouvrez http://localhost:3000/test-cloudinary
2. Cliquez sur "Tester l'upload Cloudinary"
3. Sélectionnez une image
4. Vérifiez que l'upload réussit

### 3. Test dans l'application
1. Allez sur la page de création de cagnotte
2. Testez l'upload d'images et vidéos
3. Vérifiez que les médias s'affichent correctement

## Dépannage

### Erreur "Upload preset not found"
- Le preset n'existe pas → Créez-le manuellement
- Mauvais nom de preset → Vérifiez l'orthographe exacte
- Mode "Signed" → Changez en mode "Unsigned"

### Variables d'environnement non chargées
- Redémarrez le serveur de développement
- Vérifiez que les variables commencent par `NEXT_PUBLIC_`
- Vérifiez qu'il n'y a pas d'espaces dans les valeurs

### Erreur de CORS
- Assurez-vous que le preset est en mode "Unsigned"
- Vérifiez les domaines autorisés dans Cloudinary

## Nettoyage après configuration

Une fois que tout fonctionne, supprimez les logs de debug :

```typescript
// Supprimez ces lignes du composant MediaUpload
console.log('Cloudinary Config:', {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
});
```

## Support

- **Documentation Cloudinary**: https://cloudinary.com/documentation
- **Guide de dépannage**: `docs/cloudinary-troubleshooting.md`
- **Page de test**: http://localhost:3000/test-cloudinary
