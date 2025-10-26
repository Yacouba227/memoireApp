'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from 'components/ui/Button'
import { Users, Calendar, FileText, LogOut, Settings, Menu, Mail, List, Sun, Moon, User as UserIcon, Bell, ChevronRight } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { useTheme } from 'contexts/ThemeContext'
import { toast } from 'sonner'
// Supprimer l'importation de ProfileModal
// import ProfileModal from 'components/profile/ProfileModal'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false) // Nouvelle état pour le menu profil
  const [unreadNotificationCount, setUnreadNotificationCount] = React.useState(0) // État pour les notifications
  const [lastNotificationId, setLastNotificationId] = React.useState<number | null>(null) // Pour suivre les notifications

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

  // Supprimer l'état isProfileOpen
  // const [isProfileOpen, setIsProfileOpen] = React.useState(false)

  // Fonction pour gérer le clic sur une notification
  const handleNotificationClick = async (convocationId: number) => {
    try {
      const response = await fetch(`/api/convocations/${convocationId}/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        toast.success('Convocation ouverte avec succès!')
        // Recharger les notifications après l'ouverture
        setUnreadNotificationCount(prev => prev - 1)
        setLastNotificationId(prev => prev || 0) // Reset lastNotificationId to 0 to refetch all
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Erreur lors de l\'ouverture de la convocation.')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la convocation via notification:', error)
      toast.error('Erreur lors de l\'ouverture de la convocation.')
    }
  }

  // Fonction pour récupérer les notifications
  const fetchNotifications = async () => {
    if (user?.profil_utilisateur === 'membre') {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const newNotifications: Notification[] = await response.json()
          const unread = newNotifications.filter(notif => notif.id > (lastNotificationId || 0))

          if (unread.length > 0) {
            const maxId = Math.max(...unread.map(notif => notif.id))
            setLastNotificationId(maxId)
            setUnreadNotificationCount(prev => prev + unread.length)
            unread.forEach(notif => {
              toast.info(notif.message, {
                action: {
                  label: 'Voir',
                  onClick: () => handleNotificationClick(notif.convocationId),
                },
              })
            })
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
      }
    }
  }

  // Effet pour récupérer les notifications
  React.useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 w-full z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre de l'application */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/images/logo-fast.gif" 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">MemoireApp</span>
            </Link>
          </div>

          {/* Boutons d'action : Notifications, Thème, Profil */}
          <div className="flex items-center space-x-4">
            {/* Bouton de notifications */}
            {user?.profil_utilisateur === 'membre' && (
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </Button>
            )}

            {/* Bouton de thème */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Menu utilisateur */}
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 h-9 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                >
                  <img
                    src={user.photo_url || '/images/logo-fast.gif'}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium dark:text-white hidden md:block">{user.prenom}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-90' : 'rotate-0'} hidden md:block`} />
                </Button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50">
                    <Link href="/parametres"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Mon profil</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bouton pour le menu mobile (pour écrans plus petits) */}
            <button className="md:hidden p-2 text-gray-700 dark:text-gray-300" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile (affiché quand mobileOpen est true) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors 
                    ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            {user && (
              <Link href="/parametres"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <UserIcon className="w-4 h-4" />
                <span>Mon profil</span>
              </Link>
            )}
            <button
              onClick={() => {
                handleLogout()
                setMobileOpen(false)
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
            {/* Bouton de thème pour mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  convocationId: number;
} 