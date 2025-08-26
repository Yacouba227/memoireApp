'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  FileText, 
  LogOut, 
  Settings, 
  Mail, 
  List, 
  ChevronLeft, 
  ChevronRight,
  User,
  Sun,
  Moon,
  Globe,
  Menu
} from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { Button } from 'components/ui/Button'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<'fr' | 'en'>('fr')

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

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
    // Ici vous pouvez ajouter la logique pour changer le thème global
  }

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
    // Ici vous pouvez ajouter la logique pour changer la langue
  }

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-screen fixed left-0 top-0 z-50 shadow-lg`}>
      
      {/* Header avec logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-3">
            <img 
              src="/images/logo-fast.gif" 
              alt="Logo FAST" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-gray-800">FAST</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex justify-center">
            <img 
              src="/images/logo-fast.gif" 
              alt="Logo FAST" 
              className="w-8 h-8 object-contain"
            />
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-1 h-8 w-8"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer avec contrôles et profil */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Contrôles de thème et langue */}
        <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'space-x-2'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 h-8 w-8"
            title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="p-2 h-8 w-8"
            title={`Langue: ${language === 'fr' ? 'Français' : 'English'}`}
          >
            <Globe className="w-4 h-4" />
          </Button>
        </div>

        {/* Profil utilisateur */}
        {user && (
          <div className={`${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.profil_utilisateur === 'admin' ? 'Administrateur' : 'Membre'}
                  </p>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={`mt-2 w-full ${isCollapsed ? 'px-2' : 'px-3'}`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Déconnexion</span>}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
