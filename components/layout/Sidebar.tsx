'use client'

import React, { useState, useEffect } from 'react'
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
  Menu
} from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { Button } from 'components/ui/Button'
import ProfileModal from 'components/profile/ProfileModal'
import { toast } from 'sonner'
import { markConvocationAsRead, type Convocation, getAllConvocations } from 'utils/convocation'
import ConvocationModal from 'components/convocations/ConvocationModal'

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  convocationId: number;
}

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  // unreadNotificationCount?: number // Cette prop sera gérée en interne
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const [lastNotificationId, setLastNotificationId] = useState<number | null>(null)
  const [isConvocationModalOpen, setIsConvocationModalOpen] = useState(false)
  const [currentConvocation, setCurrentConvocation] = useState<Convocation | null>(null)

  type Role = 'admin' | 'membre'
  
  const allNav: { name: string; href: string; icon: any; roles: Role[] }[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Users, roles: ['admin'] },
    { name: 'Sessions', href: '/sessions', icon: Calendar, roles: ['admin', 'membre'] },
    { name: 'Ordres du jour', href: '/ordres-du-jour', icon: List, roles: ['admin', 'membre'] },
    { name: 'Convocations', href: '/convocations', icon: Mail, roles: ['admin', 'membre'] },
    { name: 'Procès-verbaux', href: '/proces-verbaux', icon: FileText, roles: ['admin', 'membre'] },
    { name: 'Membres', href: '/membres', icon: Users, roles: ['admin'] },
    { name: 'Paramètres', href: '/parametres', icon: Settings, roles: ['admin'] },
  ]

  const navigation = allNav.filter(item => {
    if (!user) return item.name === 'Sessions' || item.name === 'Procès-verbaux'
    return item.roles.includes(user.profil_utilisateur as Role)
  })

  const handleNotificationClick = async (convocationId: number) => {
    // Fetch the specific convocation to display in the modal
    try {
      const allConvocations = await getAllConvocations(user?.id_membre) // Fetch all member convocations
      const conv = allConvocations.find(c => c.id_convocation === convocationId)
      if (conv) {
        setCurrentConvocation(conv)
        setIsConvocationModalOpen(true)

        // Marquer la convocation comme lue si elle est encore "envoyée"
        if (conv.statut === 'envoyée') {
          const updatedConvocation = await markConvocationAsRead(convocationId)
          if (updatedConvocation) {
            // Update the convocation list in case we go to convocations page later
            // For now, just ensuring the state is updated for the modal
            console.log("Convocation marquée comme lue via notification:", updatedConvocation)
            // Decrease the unread count as this convocation is now read
            setUnreadNotificationCount(prev => Math.max(0, prev - 1))
          } else {
            toast.error('Erreur lors du marquage de la convocation comme lue.')
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de la convocation via notification:', error)
      toast.error('Erreur lors de l\'ouverture de la convocation.')
    }
  }

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

  useEffect(() => {
    // Fetch notifications immediately when user is available
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user]) // Re-run when user changes

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }



  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } h-screen fixed left-0 top-0 z-50 shadow-lg flex flex-col`}>
      
      {/* Header avec logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-3">
            <img 
              src="/images/logo-fast.gif" 
              alt="Logo" 
              className="w-12 h-12 object-contain"
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/dashboard" className="flex justify-center">
            <img 
              src="/images/logo-fast.gif" 
              alt="Logo" 
              className="w-12 h-12 object-contain"
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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              {!isCollapsed && (
                <span className="flex items-center justify-between w-full">
                  {item.name}
                  {item.name === 'Convocations' && unreadNotificationCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadNotificationCount}
                    </span>
                  )}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer avec contrôles et profil */}
      <div className="p-4 border-t border-gray-200 space-y-4">
        {/* Profil utilisateur */}
        {user && (
          <div className={`${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={(user as any).photo_url || '/images/logo-fast.gif'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
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
              className={`mt-3 w-full ${isCollapsed ? 'px-2' : 'px-3'} hover:bg-red-50 hover:text-red-600 transition-colors`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Déconnexion</span>}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProfileOpen(true)}
              className={`mt-2 w-full ${isCollapsed ? 'px-2' : 'px-3'}`}
            >
              {!isCollapsed ? 'Mon profil' : 'Profil'}
            </Button>
          </div>
        )}

        {/* Contrôles déplacés dans le Header */}
      </div>
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} // Passer la prop user
        onSave={(updatedUser) => {
          // Mettre à jour le contexte d'authentification après la sauvegarde
          if (updateUser) {
            updateUser(updatedUser)
          }
        }}
      />
      <ConvocationModal
        isOpen={isConvocationModalOpen}
        onClose={() => setIsConvocationModalOpen(false)}
        convocation={currentConvocation}
        onUpdateConvocation={(updatedConvocation) => {
          // If the modal updates a convocation (e.g., confirms attendance),
          // we need to potentially decrement the unread count if it was a new notification.
          // For now, simply update currentConvocation.
          setCurrentConvocation(updatedConvocation)
          // Since convocations list is in convocations/page.tsx, this update will only apply to the modal
          // We re-fetch notifications after an update to clear any potential stale unread counts.
          fetchNotifications() 
        }}
      />
    </div>
  )
}

export default Sidebar
