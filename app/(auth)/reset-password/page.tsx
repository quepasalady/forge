'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/update-password`,
    })

    if (error) {
      setError('Impossible d\'envoyer l\'email. Vérifiez l\'adresse et réessayez.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-bold text-2xl">FOR<span className="text-orange">GE</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié ?</h1>
          <p className="text-gray-500 mt-2">
            Entrez votre email, on vous envoie un lien de réinitialisation.
          </p>
        </div>

        <div className="card shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-bold text-lg text-gray-900 mb-2">Email envoyé !</h2>
              <p className="text-gray-500 text-sm mb-6">
                Vérifiez votre boîte mail. Le lien expire dans 1 heure.
              </p>
              <Link href="/login" className="btn-secondary text-sm inline-block">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
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
              <button type="submit" disabled={loading} className="btn-primary py-3.5">
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>
              <Link href="/login" className="text-sm text-center text-gray-400 hover:text-gray-600 transition-colors">
                ← Retour à la connexion
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
