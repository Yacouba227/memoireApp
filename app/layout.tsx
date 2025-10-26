import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from 'contexts/AuthContext'
import { ThemeProvider, useTheme } from 'contexts/ThemeContext'
import { Toaster } from 'src/components/ui/sonner'
import ThemeWrapper from 'components/layout/ThemeWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plateforme FAST - Gestion des Sessions',
  description: 'Plateforme de gestion des sessions du conseil de la Faculté des Sciences et Techniques',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <ThemeWrapper>
              {children}
            </ThemeWrapper>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
} 