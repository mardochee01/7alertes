# 👑 Les 7 Alertes — Conserve ta couronne

Application web de coaching conjugal basée sur le livre **"Les 7 alertes avant que ton couple ne se brise"** de Maman Lili (Pasteure Liliane Sanogo).

---

## Stack technique

| Outil                       | Rôle                                               |
| --------------------------- | -------------------------------------------------- |
| **Next.js 16** (App Router) | Framework React — SSR + routes                     |
| **Supabase**                | Auth (email/password) + PostgreSQL + Storage       |
| **Tailwind CSS v4**         | Styles utilitaires + design tokens                 |
| **Framer Motion**           | Animations et transitions                          |
| **Zustand**                 | State management client (persist localStorage)     |

---

## Fonctionnalités utilisateur

### Parcours des 7 chapitres

- 7 alertes conjugales (Mehuman → Carcas)
- Chaque chapitre = 7 slides : Pourquoi · Maman Lili · Clés · Journal · Actions · Défi · Partage
- Couronne HP (7 lumières) — perd une lumière à chaque mauvaise réponse
- Barre XP + streak quotidien
- Calendrier du challenge (11 jours programmés)
- Progression sauvegardée en DB

### Communauté

- Fil de posts partagé entre toutes les utilisatrices
- Likes persistants (trigger Supabase), commentaires
- L'autrice peut supprimer son propre post

### Maman Lili — messagerie personnalisée

- Envoi de questions confidentielles à Maman Lili
- Réponse personnalisée de l'équipe via le panel admin
- Historique de la conversation affiché dans le chat

### Message du jour

- Message texte + audio programmé par l'admin
- Apparaît automatiquement sur le dashboard si activé
- Section désactivable par l'admin

### Compte & synchronisation

- Inscription (email + mot de passe) en 4 étapes : prénom · roi · nom du royaume · compte
- Connexion avec rechargement de la progression complète
- Synchronisation multi-appareils via Supabase

---

## Panel d'administration (`/admin`)

Accès réservé aux profils avec `is_admin = true` dans Supabase.

| Page                | Contenu                                                           |
| ------------------- | ----------------------------------------------------------------- |
| **Vue globale**     | Stats : reines, publications, questions, progression par chapitre |
| **Utilisateurs**    | Liste HP/XP/streak/chapitres · désactiver · promouvoir admin      |
| **Modération**      | Posts + commentaires · masquer / supprimer · filtres · recherche  |
| **Messages**        | Conversations par utilisatrice · réponse personnalisée            |
| **Message du jour** | Créer · programmer · publier · upload audio · activer/désactiver  |

Badges de notification sur chaque section (se réinitialisent à la visite).

---

## Installation

### 1. Prérequis

- Node.js 20+
- Compte [Supabase](https://supabase.com) (gratuit)

### 2. Cloner et installer

```bash
git clone https://github.com/TON_REPO/royaume.git
cd royaume
npm install
```

### 3. Variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Base de données Supabase

Colle le contenu de [`supabase/schema.sql`](supabase/schema.sql) dans **Supabase Dashboard → SQL Editor → Run**.

Réglages recommandés :

- **Authentication → Providers → Email → Confirm email** : `OFF` (dev) ou configuré avec SMTP (prod)
- **Authentication → Providers → Email → Check email reachability** : `OFF`

### 5. Bucket Storage

Le bucket `daily-audio` est créé automatiquement par le schema SQL.

### 6. Lancer en développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

### 7. Activer le premier admin

Dans Supabase SQL Editor :

```sql
UPDATE profiles SET is_admin = true
WHERE queen_name = 'Ton prénom';
```

---

## Structure du projet

```text
royaume/
├── app/
│   ├── (auth)/onboarding/     # Inscription 4 étapes
│   ├── login/                 # Connexion
│   ├── dashboard/             # Tableau de bord
│   ├── chapter/[id]/          # Lecteur 7 slides
│   ├── community/             # Communauté
│   ├── maman-lili/            # Chat Maman Lili
│   ├── spiritual/             # Ressources
│   ├── admin/                 # Panel admin (protégé)
│   │   ├── users/
│   │   ├── community/
│   │   ├── questions/
│   │   └── daily/
│   └── api/chat/              # Route serveur
├── components/
│   ├── dashboard/             # CrownHeader, CalendarStrip, DailyMessage…
│   ├── story/slides/          # WhySlide, GameSlide…
│   ├── layout/                # BottomNav
│   └── ui/                    # CrownSvg, QueenAvatar, Toast
├── lib/
│   ├── data/                  # Chapitres, FAQ, schedule (données statiques)
│   ├── supabase/              # client · server · profile · admin
│   └── utils.ts
├── store/useAppStore.ts        # Zustand (persist)
├── types/index.ts
├── supabase/schema.sql         # Schéma complet (idempotent)
└── proxy.ts                    # Auth middleware Next.js 16
```

---

## Déploiement

```bash
npm run build
```

Compatible **Vercel** — ajoute les variables d'environnement dans les settings du projet.
