'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">
              FOR<span className="text-orange">GE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-600 hover:text-orange transition-colors text-sm font-medium">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-orange transition-colors text-sm font-medium">
              Comment ça marche
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-orange transition-colors text-sm font-medium">
              Tarifs
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-gray-700 hover:text-orange font-medium text-sm transition-colors">
              Connexion
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-5">
              Créer un compte
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 animate-fade-in">
          <Link href="#features" onClick={() => setOpen(false)} className="text-gray-700 font-medium py-2">Fonctionnalités</Link>
          <Link href="#how-it-works" onClick={() => setOpen(false)} className="text-gray-700 font-medium py-2">Comment ça marche</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="text-gray-700 font-medium py-2">Tarifs</Link>
          <hr className="border-gray-100" />
          <Link href="/login" className="text-gray-700 font-medium py-2">Connexion</Link>
          <Link href="/signup" className="btn-primary text-center">Créer un compte</Link>
        </div>
      )}
    </nav>
  )
}
