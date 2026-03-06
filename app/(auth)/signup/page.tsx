'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const plans = [
  { id: 'trial', label: 'Essai gratuit', price: '0€', duration: '7 jours', priceId: null },
  { id: 'basic',   label: 'Basic',   price: '9€/mois',  duration: null, priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC },
  { id: 'pro',     label: 'Pro',     price: '19€/mois', duration: null, priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO },
  { id: 'premium', label: 'Premium', price: '39€/mois', duration: null, priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep]         = useState<'plan' | 'details'>('plan')
  const [selectedPlan, setPlan] = useState('trial')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: 'client', plan: selectedPlan },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Si plan payant → Stripe Checkout
    const plan = plans.find(p => p.id === selectedPlan)
    if (plan?.priceId && data.user) {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId }),
      })
      const { url } = await res.json()
      if (url) { window.location.href = url; return }
    }

    // Essai gratuit → dashboard direct
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-bold text-2xl">FOR<span className="text-orange">GE</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'plan' ? 'Choisissez votre plan' : 'Créez votre compte'}
          </h1>
          <p className="text-gray-500 mt-2">
            {step === 'plan' ? '7 jours d\'essai gratuit sur tous les plans' : 'Quelques informations pour commencer'}
          </p>
        </div>

        <div className="card shadow-sm">

          {/* ── ÉTAPE 1 : PLAN ── */}
          {step === 'plan' && (
            <div className="flex flex-col gap-4">
              {plans.map(plan => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPlan(plan.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedPlan === plan.id
                      ? 'border-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedPlan === plan.id ? 'border-orange bg-orange' : 'border-gray-300'
                    }`}>
                      {selectedPlan === plan.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{plan.label}</div>
                      {plan.duration && <div className="text-xs text-gray-500">{plan.duration}</div>}
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${selectedPlan === plan.id ? 'text-orange' : 'text-gray-500'}`}>
                    {plan.price}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => setStep('details')}
                className="btn-primary py-3.5 mt-2"
              >
                Continuer →
              </button>
            </div>
          )}

          {/* ── ÉTAPE 2 : INFORMATIONS ── */}
          {step === 'details' && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Plan sélectionné */}
              <div className="bg-orange-50 border border-orange/20 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-700">Plan sélectionné</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-orange">{plans.find(p => p.id === selectedPlan)?.label}</span>
                  <button type="button" onClick={() => setStep('plan')} className="text-xs text-gray-400 hover:text-orange underline">
                    Changer
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Alex Dupont"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                En créant un compte, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité.
              </p>

              <button type="submit" disabled={loading} className="btn-primary py-3.5 mt-1">
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>

              <button type="button" onClick={() => setStep('plan')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← Retour
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-orange font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
