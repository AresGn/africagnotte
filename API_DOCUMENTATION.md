# Documentation des APIs Cagnottes

## Vue d'ensemble

Cette documentation couvre toutes les APIs disponibles pour la gestion des cagnottes, dons et actualités.

## Authentification

Certaines APIs nécessitent une authentification. Passez l'ID utilisateur dans le header :
```
x-user-id: [USER_ID]
```

## APIs des Cagnottes

### 1. Détail d'une Cagnotte
**GET** `/api/cagnottes/detail/[slugOrId]`

Récupère les détails complets d'une cagnotte avec ses dons et actualités récents.

**Paramètres :**
- `slugOrId` : URL personnalisée ou ID de la cagnotte

**Réponse :**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "longDescription": "string",
  "category": "string",
  "images": ["url1", "url2"],
  "video": "url",
  "current_amount": 1500000,
  "target_amount": 2000000,
  "participants_count": 12,
  "author": {
    "name": "Dr. Aminata Diallo",
    "phone": "+221 77 456 78 90",
    "socials": {
      "facebook": "url",
      "twitter": "url",
      "instagram": "url"
    }
  },
  "donations": [
    {
      "id": "uuid",
      "donor_name": "Mamadou Seck",
      "amount": 250000,
      "comment": "Message de soutien",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "actualites": [
    {
      "id": "uuid",
      "title": "Titre de l'actualité",
      "content": "Contenu...",
      "images": ["url1"],
      "video_url": "url",
      "amount_at_time": 1200000,
      "created_at": "2024-01-10T14:20:00Z"
    }
  ]
}
```

## APIs des Dons

### 2. Liste des Dons
**GET** `/api/cagnottes/[id]/donations`

**Paramètres de requête :**
- `sortBy` : `date` (défaut) ou `amount`
- `limit` : nombre de résultats (défaut: 50)
- `offset` : décalage pour pagination (défaut: 0)

**Headers requis :**
- `x-user-id` : requis si cagnotte privée

**Réponse :**
```json
{
  "donations": [
    {
      "id": "uuid",
      "donor_name": "Fatou Ndiaye",
      "amount": 75000,
      "comment": "Pour le sourire des enfants",
      "is_anonymous": false,
      "payment_status": "completed",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

### 3. Créer un Don
**POST** `/api/cagnottes/[id]/donations`

**Body :**
```json
{
  "donor_name": "Nom du donateur",
  "amount": 100000,
  "comment": "Message optionnel",
  "is_anonymous": false,
  "payment_reference": "ref_payment_123"
}
```

**Réponse :**
```json
{
  "message": "Don créé avec succès.",
  "donation": {
    "id": "uuid",
    "donor_name": "Nom du donateur",
    "amount": 100000,
    "payment_status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Confirmer un Don (Webhook)
**PUT** `/api/cagnottes/donations/[donationId]/confirm`

**Body :**
```json
{
  "payment_status": "completed",
  "payment_reference": "ref_payment_123",
  "webhook_signature": "signature_verification"
}
```

### 5. Statut d'un Don
**GET** `/api/cagnottes/donations/[donationId]/confirm`

## APIs des Actualités

### 6. Liste des Actualités
**GET** `/api/cagnottes/[id]/actualites`

**Paramètres de requête :**
- `limit` : nombre de résultats (défaut: 10)
- `offset` : décalage pour pagination (défaut: 0)
- `includeUnpublished` : `true` pour inclure les brouillons (propriétaire uniquement)

**Réponse :**
```json
{
  "actualites": [
    {
      "id": "uuid",
      "title": "Titre de l'actualité",
      "content": "Contenu détaillé...",
      "images": ["url1", "url2"],
      "video_url": "url",
      "amount_at_time": 1200000,
      "is_published": true,
      "created_at": "2024-01-10T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

### 7. Créer une Actualité
**POST** `/api/cagnottes/[id]/actualites`

**Headers requis :**
- `x-user-id` : ID du propriétaire

**Body :**
```json
{
  "title": "Titre de l'actualité",
  "content": "Contenu détaillé de l'actualité...",
  "images": ["url1", "url2"],
  "video_url": "https://youtube.com/embed/...",
  "is_published": true
}
```

### 8. Détail d'une Actualité
**GET** `/api/cagnottes/actualites/[actualiteId]`

### 9. Modifier une Actualité
**PUT** `/api/cagnottes/actualites/[actualiteId]`

**Headers requis :**
- `x-user-id` : ID du propriétaire

### 10. Supprimer une Actualité
**DELETE** `/api/cagnottes/actualites/[actualiteId]`

**Headers requis :**
- `x-user-id` : ID du propriétaire

## API des Statistiques

### 11. Statistiques d'une Cagnotte
**GET** `/api/cagnottes/[id]/stats`

**Headers optionnels :**
- `x-user-id` : pour accéder aux statistiques détaillées (propriétaire)

**Réponse (publique) :**
```json
{
  "cagnotte_info": {
    "id": "uuid",
    "title": "Titre",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "basic_stats": {
    "total_amount": 1750000,
    "target_amount": 2000000,
    "participants_count": 12,
    "completion_percentage": 88
  },
  "public_stats": {
    "first_donation": "2024-01-01T10:00:00Z",
    "last_donation": "2024-01-15T16:30:00Z",
    "average_donation": 145833,
    "actualites_count": 3
  }
}
```

**Réponse (propriétaire) :**
Inclut en plus `detailed_stats` avec :
- `amount_distribution` : répartition par tranches
- `weekly_evolution` : évolution hebdomadaire
- `top_donors` : top donateurs (anonymisé)
- `comment_stats` : statistiques des commentaires
- `pending_donations` : dons en attente
- `average_donation` : don moyen

## Codes d'Erreur

- `400` : Données invalides
- `401` : Authentification requise
- `403` : Accès non autorisé
- `404` : Ressource introuvable
- `500` : Erreur serveur

## Exemples d'Utilisation

### Afficher une cagnotte complète
```javascript
const response = await fetch('/api/cagnottes/detail/c6f60eb3-5f2c-425c-a686-08c752b51915');
const cagnotte = await response.json();
```

### Créer un don
```javascript
const donation = await fetch('/api/cagnottes/c6f60eb3-5f2c-425c-a686-08c752b51915/donations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    donor_name: 'Jean Dupont',
    amount: 50000,
    comment: 'Bon courage !',
    is_anonymous: false
  })
});
```

### Ajouter une actualité
```javascript
const actualite = await fetch('/api/cagnottes/c6f60eb3-5f2c-425c-a686-08c752b51915/actualites', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-user-id': 'user-id-here'
  },
  body: JSON.stringify({
    title: 'Nouvelle actualité',
    content: 'Contenu de l\'actualité...',
    is_published: true
  })
});
```
