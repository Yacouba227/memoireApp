'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from 'components/ui/Button'
import { Users, Calendar, FileText, LogOut, Settings, Menu, Mail, List, Sun, Moon, User as UserIcon } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { useTheme } from 'contexts/ThemeContext'
// Supprimer l'importation de ProfileModal
// import ProfileModal from 'components/profile/ProfileModal'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Supprimer l'état isProfileOpen
  // const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  type Role = 'admin' | 'membre'
  const allNav: { name: string; href: string; icon: any; roles: Role[] }[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, roles: ['admin'] },
    { name: 'Sessions', href: '/sessions', icon: Calendar, roles: ['admin', 'membre'] },
    { name: 'Ordres du jour', href: '/ordres-du-jour', icon: List, roles: ['admin', 'membre'] },
    { name: 'Convocations', href: '/convocations', icon: Mail, roles: ['admin'] },
    { name: 'Procès-verbaux', href: '/proces-verbaux', icon: FileText, roles: ['admin'] },
    { name: 'Membres', href: '/membres', icon: Users, roles: ['admin'] },
    { name: 'Paramètres', href: '/parametres', icon: Settings, roles: ['admin'] },
  ]
  const navigation = allNav.filter(item => {
    if (!user) return item.name === 'Sessions' || item.name === 'Procès-verbaux'
    return item.roles.includes(user.profil_utilisateur as Role)
  })

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/images/logo-fast.gif" 
                alt="Logo" 
                className="w-16 h-16 object-contain"
              />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 h-9 w-9 hover:bg-gray-100 transition-colors"
              title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={user.photo_url || '/images/logo-fast.gif'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Supprimer le bouton Profil et les informations utilisateur */} 
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center space-x-1"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profil</span>
                </Button>
                <span className="text-sm text-gray-700">
                  {user.prenom} {user.nom}
                </span> */}
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
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            {user && (
              <button
                onClick={() => { /* setIsProfileOpen(true); */ setMobileOpen(false) }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <UserIcon className="w-4 h-4" />
                <span>Mon profil</span>
              </button>
            )}
          </nav>
        </div>
      )}
      {/* Supprimer le rendu de ProfileModal */}
      {/* <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} /> */}
    </header>
  )
}

export default Header 