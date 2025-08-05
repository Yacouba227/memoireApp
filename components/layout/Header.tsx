'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from 'components/ui/Button'
import { Users, Calendar, FileText, LogOut, Settings } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Users },
    { name: 'Sessions', href: '/sessions', icon: Calendar },
    { name: 'Procès-verbaux', href: '/proces-verbaux', icon: FileText },
    { name: 'Membres', href: '/membres', icon: Users },
    { name: 'Paramètres', href: '/parametres', icon: Settings },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Plateforme FAST
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.prenom} {user.nom}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 