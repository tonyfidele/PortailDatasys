# DATASYS CONNECT

Portail numérique DATASYS construit avec Next.js, React, TypeScript et Tailwind CSS.

## Démarrage local

```powershell
npm install
npm run dev
```

Le portail est accessible sur `http://localhost:3000/portail`.

Contrôles disponibles :

- `npm run lint` : vérification ESLint.
- `npm run build` : build de production.

## Fonctionnalités de démonstration

- Portail responsive, recherche, filtres et statuts de services.
- Gestion locale des plateformes : ajout, modification, suppression, visibilité et ordre.
- Les plateformes exemples ne contiennent volontairement pas de liens réels. Les URL, logos et coordonnées doivent être confirmés par DATASYS.
- La gestion et les consultations utilisent le `localStorage` du navigateur : elles ne sont ni partagées entre appareils ni adaptées à un environnement public.

## Avant mise en production

- Remplacer la gestion locale par une API sécurisée et une base PostgreSQL.
- Ajouter une authentification et une autorisation pour les administrateurs.
- Vérifier l’infrastructure DATASYS et le routage HTTPS de `datasys.com/portail` afin de préserver le site existant.
- Configurer les vrais liens, logos, informations de contact et règles de conservation des statistiques.
- Tester le déploiement, prévoir sauvegarde et retour arrière, puis générer le QR code officiel pointant vers `https://datasys.com/portail`.

L’interface d’administration actuelle est une démonstration non protégée. Ne pas la publier telle quelle ni y saisir de données sensibles.

