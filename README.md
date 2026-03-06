# FORGE — Fitness Coaching SaaS

## 🚀 Guide de déploiement complet

### Prérequis
- Node.js 18+
- Compte Supabase (supabase.com)
- Compte Stripe (stripe.com)
- Compte Vercel (vercel.com)
- Git installé

---

## Étape 1 — Cloner et installer

```bash
# Dans votre terminal
git clone <votre-repo> forge
cd forge
npm install
```

---

## Étape 2 — Configurer Supabase

1. Allez sur **supabase.com** → New Project
2. Notez votre **Project URL** et **anon key** (Settings > API)
3. Notez votre **service_role key** (Settings > API)
4. Allez dans **SQL Editor** et collez le contenu de :
   `supabase/migrations/001_initial_schema.sql`
5. Cliquez **Run** — toutes les tables et politiques RLS sont créées

---

## Étape 3 — Configurer Stripe

1. Allez sur **dashboard.stripe.com**
2. Créez 3 produits avec abonnements mensuels :
   - **Basic** → 9€/mois
   - **Pro** → 19€/mois
   - **Premium** → 39€/mois
3. Copiez les **Price IDs** de chaque produit (commencent par `price_`)
4. Activez les webhooks : Developers > Webhooks > Add endpoint
   - URL : `https://votre-domaine.vercel.app/api/stripe/webhook`
   - Events : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copiez le **Webhook secret** (commence par `whsec_`)

---

## Étape 4 — Variables d'environnement

Copiez `.env.example` en `.env.local` et remplissez :

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_PREMIUM=price_...

NEXT_PUBLIC_URL=http://localhost:3000
```

---

## Étape 5 — Lancer en local

```bash
npm run dev
```

Ouvrez http://localhost:3000 — votre site tourne localement !

---

## Étape 6 — Déployer sur Vercel

```bash
# Installez la CLI Vercel si besoin
npm install -g vercel

# Déployez
vercel

# Suivez les instructions, puis ajoutez les variables d'env dans :
# Vercel Dashboard > votre projet > Settings > Environment Variables
```

Ajoutez toutes les variables de `.env.local` dans Vercel.
Changez `NEXT_PUBLIC_URL` pour votre vrai domaine Vercel.

---

## Étape 7 — Créer le premier coach

Dans Supabase SQL Editor, exécutez :

```sql
-- Remplacez avec l'email du coach créé via /signup
update public.profiles
set role = 'coach'
where id = (
  select id from auth.users where email = 'votre-email-coach@exemple.com'
);
```

---

## Structure des fichiers

```
forge/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx          ← Connexion
│   │   ├── signup/page.tsx         ← Inscription
│   │   ├── reset-password/page.tsx ← Mot de passe oublié
│   │   └── update-password/page.tsx
│   └── api/
│       └── stripe/
│           ├── checkout/route.ts   ← Crée la session Stripe
│           └── webhook/route.ts    ← Reçoit les événements Stripe
├── components/
│   └── Navbar.tsx
├── lib/
│   └── supabase/
│       ├── client.ts               ← Client navigateur
│       └── server.ts               ← Client serveur
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  ← Toutes les tables SQL
├── middleware.ts                   ← Protection des routes
└── .env.example                    ← Template des variables
```

---

## Prochaines étapes (sessions suivantes)

- [ ] Dashboard client
- [ ] Pages workout (manuel + assisté)
- [ ] Panneau coach
- [ ] Plans nutritionnels
- [ ] Graphiques de progression
- [ ] Page abonnement
