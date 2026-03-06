import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Zap, Users, BarChart3, Utensils, Video, Timer,
  CheckCircle2, Star, ArrowRight, ChevronRight
} from 'lucide-react'

// ─── Features ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Séances guidées',
    desc: 'Mode assisté avec chronomètre global, enchaînement automatique des exercices et timer de repos.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Gestion des clients',
    desc: 'Créez des comptes clients, assignez des programmes et suivez leur progression en temps réel.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Suivi de progression',
    desc: 'Graphiques de poids, historique des séances et évolution des performances par exercice.',
  },
  {
    icon: <Utensils className="w-6 h-6" />,
    title: 'Plans nutritionnels',
    desc: 'Créez des plans repas détaillés avec calories et macronutriments. Assignez-les à vos clients.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Vidéos de démonstration',
    desc: 'Chaque exercice est accompagné d\'une vidéo de démonstration pour une exécution parfaite.',
  },
  {
    icon: <Timer className="w-6 h-6" />,
    title: 'Timers intégrés',
    desc: 'Chronomètre de séance, timer de repos entre les séries — tout est automatisé.',
  },
]

// ─── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    title: 'Le coach crée le programme',
    desc: 'Push, Pull, Legs — le coach construit les séances, ajoute les exercices, les séries, les répétitions et les vidéos.',
  },
  {
    num: '02',
    title: 'Le client reçoit son plan',
    desc: 'Le client se connecte et trouve son programme et son plan nutritionnel directement dans son tableau de bord.',
  },
  {
    num: '03',
    title: 'Suivi et progression',
    desc: 'Chaque séance est enregistrée automatiquement. Le coach et le client voient la progression en temps réel.',
  },
]

// ─── Plans ────────────────────────────────────────────────────────────────────
const plans = [
  {
    name: 'Basic',
    price: '9',
    desc: 'Pour démarrer',
    features: ['Jusqu\'à 5 clients', 'Programmes Push/Pull/Legs', 'Plans nutritionnels', 'Suivi de progression', 'Vidéos de démo'],
    cta: 'Démarrer l\'essai gratuit',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '19',
    desc: 'Le plus populaire',
    features: ['Jusqu\'à 20 clients', 'Tout Basic inclus', 'Mode assisté guidé', 'Analytics avancés', 'Support prioritaire', 'Exports PDF'],
    cta: 'Démarrer l\'essai gratuit',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '39',
    desc: 'Pour les coachs pro',
    features: ['Clients illimités', 'Tout Pro inclus', 'Marque blanche', 'API access', 'Gestionnaire de compte dédié', 'Onboarding personnalisé'],
    cta: 'Nous contacter',
    highlight: false,
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Coach fitness, Paris',
    text: 'FORGE a complètement transformé ma façon de travailler avec mes clients. Je gagne un temps fou sur le suivi et ils sont beaucoup plus engagés.',
    stars: 5,
  },
  {
    name: 'Lucas Dupont',
    role: 'Client — 6 mois de suivi',
    text: 'Le mode assisté pendant les séances c\'est game-changer. Je n\'ai plus besoin de penser à quoi faire, je suis juste le programme.',
    stars: 5,
  },
  {
    name: 'Amélie Renard',
    role: 'Coach nutrition & sport',
    text: 'La gestion des plans nutritionnels est top. Mes clients voient leurs macros en temps réel et ça change vraiment leur rapport à l\'alimentation.',
    stars: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange px-4 py-2 rounded-full text-sm font-semibold mb-8">
            <Zap className="w-4 h-4" />
            Essai gratuit 7 jours — Sans carte bancaire
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Le coaching fitness{' '}
            <span className="text-orange">professionnel</span>{' '}
            réinventé
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Gérez vos clients, assignez des programmes personnalisés, suivez leur progression.
            Tout en un seul endroit, conçu pour les coachs sérieux.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
              Voir comment ça marche
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Aucune carte requise
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Annulation à tout moment
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Support inclus
            </div>
          </div>
        </div>

        {/* Hero mockup */}
        <div className="mt-20 relative">
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 text-gray-500 text-xs font-mono">forge-fitness.com/dashboard</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Clients actifs', value: '12', color: 'bg-orange' },
                { label: 'Séances ce mois', value: '48', color: 'bg-gray-700' },
                { label: 'Progression moy.', value: '+8%', color: 'bg-gray-700' },
              ].map(card => (
                <div key={card.label} className={`${card.color} rounded-2xl p-4`}>
                  <div className="text-gray-400 text-xs mb-2">{card.label}</div>
                  <div className="text-white text-2xl font-bold">{card.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-xs mb-3">Prochaine séance — Thomas D.</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">💪 PUSH DAY</div>
                  <div className="text-gray-500 text-sm mt-1">Pectoraux · Triceps · Épaules · 6 exercices</div>
                </div>
                <div className="bg-orange text-white text-sm font-bold px-4 py-2 rounded-xl">Démarrer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Tout ce dont vous avez besoin</h2>
            <p className="section-subtitle">
              Une plateforme complète, pensée pour les coachs professionnels et leurs clients.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-orange-50 text-orange rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Comment ça marche</h2>
            <p className="section-subtitle">
              Trois étapes pour transformer votre activité de coaching.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gray-200 -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-white font-bold text-xl">{step.num}</span>
                  </div>
                  <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Des tarifs transparents</h2>
            <p className="section-subtitle">
              Commencez avec 7 jours d'essai gratuit. Aucune carte bancaire requise.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 flex flex-col ${
                  plan.highlight
                    ? 'bg-orange text-white shadow-2xl shadow-orange/30 scale-105'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <div className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                    ⭐ Populaire
                  </div>
                )}
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-orange-100' : 'text-gray-500'}`}>
                  {plan.desc}
                </div>
                <div className={`text-5xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  €{plan.price}
                </div>
                <div className={`text-sm mb-8 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>
                  par mois
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-white' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`text-center font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-95 ${
                    plan.highlight
                      ? 'bg-white text-orange hover:bg-orange-50'
                      : 'bg-orange text-white hover:bg-orange-dark'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-8">
            Tous les plans incluent 7 jours d'essai gratuit · Annulation à tout moment
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Ils font confiance à FORGE</h2>
            <p className="section-subtitle">
              Des coachs et des clients qui ont transformé leur routine.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-orange text-orange" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Prêt à faire passer votre coaching au niveau supérieur ?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Rejoignez des centaines de coachs qui font confiance à FORGE pour gérer leur activité.
          </p>
          <Link href="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
            Démarrer l'essai gratuit
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-white">FOR<span className="text-orange">GE</span></span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} FORGE. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
