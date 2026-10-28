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

## Aperçu Vercel

Le dépôt GitHub `tonyfidele/PortailDatasys` est déjà relié à ce projet. Pour publier un aperçu :

1. Créer une branche de prévisualisation et y pousser les changements, sans toucher à `main` (par exemple `preview-datasys-connect`).
2. Dans Vercel, choisir **Add New → Project**, puis importer `tonyfidele/PortailDatasys`.
3. Garder la racine `./` et le framework Next.js détecté automatiquement. La commande de build est `npm run build` ; aucune variable d’environnement n’est actuellement requise.
4. Cliquer sur **Deploy** et ouvrir l’URL `*.vercel.app` produite.

Vercel génère des URL d’aperçu pour les branches de test. Le QR affiché sur la page est produit à partir de l’URL actuellement visitée et cible `/portail` ; il pointera donc vers l’aperçu Vercel une fois celui-ci ouvert.

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
- Tester le déploiement, prévoir sauvegarde et retour arrière, puis vérifier l’adresse publique avant de diffuser le QR officiel.

L’interface d’administration actuelle est une démonstration non protégée. Ne pas la publier telle quelle ni y saisir de données sensibles.

