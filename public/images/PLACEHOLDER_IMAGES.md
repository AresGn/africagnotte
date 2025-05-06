# Images pour AfricaGnotte

## Instructions pour le téléchargement des images

Pour que l'application fonctionne correctement, veuillez télécharger les images suivantes dans ce dossier:

1. `hero-image.jpg` - Image principale de la page d'accueil (1920x1080px recommandé)
2. `campaign-1.jpg`, `campaign-2.jpg`, `campaign-3.jpg` - Images pour les cagnottes mises en avant (800x600px recommandé)
3. `testimonial-1.jpg`, `testimonial-2.jpg` - Photos pour les témoignages (300x300px recommandé)

## Où trouver des images gratuites?

Vous pouvez utiliser des images libres de droits depuis:
- [Unsplash](https://unsplash.com/fr/s/photos/afrique)
- [Pexels](https://www.pexels.com/fr-fr/chercher/afrique/)
- [Pixabay](https://pixabay.com/fr/images/search/afrique/)

## Exemple de commandes pour créer des placeholder temporaires

Si vous utilisez Linux ou macOS, vous pouvez générer des images de placeholder avec la commande suivante:

```bash
# Installer ImageMagick si nécessaire
# sudo apt-get install imagemagick   # Pour Ubuntu/Debian
# brew install imagemagick           # Pour macOS

# Créer des placeholders
convert -size 1920x1080 xc:#FAF3E0 -gravity center -pointsize 40 -annotate 0 "Hero Image" hero-image.jpg
convert -size 800x600 xc:#FAF3E0 -gravity center -pointsize 30 -annotate 0 "Campaign 1" campaign-1.jpg
convert -size 800x600 xc:#FAF3E0 -gravity center -pointsize 30 -annotate 0 "Campaign 2" campaign-2.jpg
convert -size 800x600 xc:#FAF3E0 -gravity center -pointsize 30 -annotate 0 "Campaign 3" campaign-3.jpg
convert -size 300x300 xc:#FAF3E0 -gravity center -pointsize 20 -annotate 0 "Testimonial 1" testimonial-1.jpg
convert -size 300x300 xc:#FAF3E0 -gravity center -pointsize 20 -annotate 0 "Testimonial 2" testimonial-2.jpg
``` 