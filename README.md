# DATASYS CONNECT

Portail numérique DATASYS construit avec Next.js, React, TypeScript et Tailwind CSS. Le catalogue et les compteurs d’accès sont stockés côté serveur dans PostgreSQL sur Neon. L’administration utilise Auth.js Credentials avec un compte administrateur configuré par variables d’environnement.

## Développement local

1. Installer les dépendances : `npm install`.
2. Créer `.env.local` à partir de `.env.example` et renseigner les quatre variables sans les committer.
3. Créer une base Neon puis exécuter `db/migrations/0001_platforms.sql` dans le SQL Editor de Neon.
4. Démarrer `npm run dev`. Le portail est disponible à `http://localhost:3000/portail`, l’administration à `http://localhost:3000/admin`.

Vérifications : `npm run lint` et `npm run build`.

### Variables d’environnement

- `DATABASE_URL` : chaîne de connexion PostgreSQL Neon, gardée côté serveur.
- `AUTH_SECRET` : secret aléatoire Auth.js (au moins 32 octets aléatoires).
- `ADMIN_EMAIL` : adresse e-mail autorisée pour le compte d’administration unique.
- `ADMIN_PASSWORD_HASH` : hash bcrypt du mot de passe admin (coût 12 ou supérieur). Choisir un mot de passe fort d’au moins 12 caractères (72 octets maximum pour bcrypt), le conserver avec un gestionnaire de mots de passe et utiliser un outil bcrypt local fiable pour produire le hash. Ne pas enregistrer le mot de passe ou le hash dans le dépôt, les journaux ou les tickets. Il n’existe ni inscription publique ni mot de passe par défaut.

Les valeurs réelles doivent être ajoutées uniquement dans `.env.local` non suivi ou dans les paramètres chiffrés du projet Vercel. Ne jamais utiliser le préfixe `NEXT_PUBLIC_` pour ces variables.

## Schéma PostgreSQL

`db/migrations/0001_platforms.sql` crée la table `platforms`, l’index du catalogue public et insère les quatre plateformes de démonstration si elles n’existent pas déjà. Cette migration est idempotente et peut être exécutée dans le SQL Editor de Neon. La table comprend les champs modifiables du catalogue, l’ordre, la visibilité, le statut et le compteur d’accès.

Le portail ne lit que les plateformes visibles. Toutes les lectures administratives et mutations revérifient la session Auth.js côté serveur; les données d’administration ne sont jamais renvoyées à une requête anonyme. Les modifications valident le schéma des entrées, limitent la taille des corps JSON et vérifient l’origine. Les liens et logos acceptent uniquement HTTP(S).

## Créer un nouveau projet Vercel avec Neon

Cette procédure décrit les étapes manuelles; aucun projet ni service n’est créé par ce dépôt.

1. Dans Neon, créer un nouveau projet PostgreSQL et copier la chaîne de connexion avec SSL. La garder privée.
2. Dans Neon SQL Editor, exécuter le contenu de `db/migrations/0001_platforms.sql`.
3. Dans Vercel, choisir **Add New → Project**, importer `tonyfidele/PortailDatasys` et utiliser la racine `./` avec le framework Next.js détecté. Garder la commande de build `npm run build`.
4. Avant le déploiement, créer les valeurs Auth.js et un hash bcrypt admin localement. Dans **Project → Settings → Environment Variables**, ajouter `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD_HASH` aux environnements nécessaires (**Production**, **Preview** et **Development** selon le besoin). Ne pas inclure les valeurs dans le dépôt ou les fichiers partagés.
5. Déployer le projet Vercel. Tester l’URL `*.vercel.app`, le catalogue public, la connexion `/admin/login`, puis les opérations d’ajout, édition, visibilité, ordre et suppression. Ne pas saisir de vrais liens ou données avant leur validation par DATASYS.
6. Pour les aperçus, définir aussi des variables valides pour l’environnement **Preview**. Le QR code pointe vers l’URL officielle `https://datasys.com/portail`, y compris depuis un aperçu Vercel.

La connexion de ce dépôt à GitHub ne réutilise pas un ancien projet de production : choisir/créer explicitement un nouveau projet Vercel. Ne pas modifier le routage HTTPS existant de `datasys.com/portail` avant validation de DATASYS, plan de retour arrière et test de l’adresse publique.

## Fonctionnalités

- Portail responsive, recherche, filtres et statuts de services.
- Catalogue partagé entre les visiteurs, avec gestion administrateur protégée : ajout, modification, suppression, visibilité et ordre.
- Compteur partagé des accès aux services disponibles. Il mesure les clics au niveau applicatif, pas des visites uniques.
- QR code téléchargeable PNG/SVG visant `https://datasys.com/portail`.
- Les plateformes exemples ne contiennent volontairement pas de liens réels. Les URL, logos et coordonnées doivent être confirmés par DATASYS.

Le code n’a pas créé de projet Vercel, déployé l’application ni provisionné une base. Prévoir sauvegarde Neon, règles de conservation des compteurs et rotation des secrets avant mise en production.

