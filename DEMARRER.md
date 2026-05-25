# 🚀 Démarrer MinimalBlog v2

## Prérequis
- Node.js v22 ou supérieur (installé ✅)

## Lancement

```bash
# 1. Installer les dépendances (une seule fois)
npm install

# 2. Démarrer le serveur
node server.js

# 3. Ouvrir dans le navigateur
# → http://localhost:3000          (blog public)
# → http://localhost:3000/admin/   (panneau admin)
```

## Identifiants Admin
- **Login :** admin
- **Mot de passe :** admin123

## Architecture
```
minimalblog2/
├── server.js          ← Serveur Express + SQLite (backend)
├── blog.db            ← Base de données (créée au premier démarrage)
├── js/
│   └── api.js         ← Client API (remplace db.js/localStorage)
├── index.html         ← Page d'accueil
├── article.html       ← Page article + commentaires
└── admin/
    ├── login.html     ← Connexion admin
    ├── dashboard.html ← Tableau de bord
    ├── articles.html  ← Gestion articles (créer, modifier, publier)
    └── commentaires.html ← Modération commentaires
```

## Fonctionnalités
- ✅ **Commentaires en direct** : s'affichent immédiatement après soumission
- ✅ **Publication d'articles** : via le panneau Admin → Articles → + Nouvel article
- ✅ **Données persistantes** : stockées en base SQLite, partagées entre tous les navigateurs
- ✅ **Modération** : l'admin peut supprimer ou approuver les commentaires
