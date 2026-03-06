import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'FORGE — Fitness Coaching Platform',
  description: 'La plateforme de coaching fitness professionnelle. Gérez vos clients, assignez des programmes et suivez leur progression.',
  keywords: ['coaching', 'fitness', 'workout', 'nutrition', 'suivi sportif'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
