'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import {
  Search,
  Mail,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { getAllConvocations, type Convocation, sendConvocationEmail } from 'utils/convocation'
import { toast } from 'sonner'
import { useAuth } from 'contexts/AuthContext'
import ConvocationModal from 'components/convocations/ConvocationModal'

// interface Notification {
//   id: number;
//   type: string;
//   message: string;
//   createdAt: string;
//   convocationId: number;
// }

export default function ConvocationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [convocations, setConvocations] = useState<Convocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmails, setSendingEmails] = useState<Set<number>>(new Set())
  const { user } = useAuth()
  const [isConvocationModalOpen, setIsConvocationModalOpen] = useState(false)
  const [currentConvocation, setCurrentConvocation] = useState<Convocation | null>(null)
  // const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  // const [lastNotificationId, setLastNotificationId] = useState<number | null>(null) // Track the last seen notification

  const fetchConvocations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const convocationsData = user?.profil_utilisateur === 'membre' 
        ? await getAllConvocations(user.id_membre)
        : await getAllConvocations()
      setConvocations(convocationsData)
    } catch (error) {
      console.error('Erreur lors du chargement des convocations:', error)
      setError('Erreur lors du chargement des convocations')
      toast.error('Erreur lors du chargement des convocations')
    } finally {
      setIsLoading(false)
    }
  }

  // const fetchNotifications = async () => {
  //   if (user?.profil_utilisateur === 'membre') {
  //     try {
  //       const response = await fetch('/api/notifications')
  //       if (response.ok) {
  //         const newNotifications: Notification[] = await response.json()
  //         const unread = newNotifications.filter(notif => notif.id > (lastNotificationId || 0))

  //         if (unread.length > 0) {
  //           // Update lastNotificationId to the highest ID among new notifications
  //           const maxId = Math.max(...unread.map(notif => notif.id))
  //           setLastNotificationId(maxId)
  //           setUnreadNotificationCount(prev => prev + unread.length)
  //           unread.forEach(notif => {
  //             toast.info(notif.message, {
  //               action: {
  //                 label: 'Voir',
  //                 onClick: () => {
  //                   // Find the convocation and open the modal
  //                   const conv = convocations.find(c => c.id_convocation === notif.convocationId)
  //                   if (conv) {
  //                     setCurrentConvocation(conv)
  //                     setIsConvocationModalOpen(true)
  //                     setUnreadNotificationCount(prev => Math.max(0, prev - 1)) // Decrease count when notification is viewed
  //                   }
  //                 },
  //               },
  //             })
  //           })
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Erreur lors du chargement des notifications:', error)
  //     }
  //   }
  // }

  useEffect(() => {
    fetchConvocations()
    // fetchNotifications() // Initial fetch

    // const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds

    // return () => clearInterval(interval)
  }, [user])

  // useEffect(() => {
  //   // Reset notification count if convo modal is opened and convocation is new
  //   if (isConvocationModalOpen && currentConvocation?.statut === 'envoyée' && user?.profil_utilisateur === 'membre') {
  //     setUnreadNotificationCount(prev => Math.max(0, prev - 1))
  //   }
  // }, [isConvocationModalOpen, currentConvocation, user])

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'confirmée':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'lue':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'envoyée':
        return <Mail className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'confirmée':
        return 'bg-green-100 text-green-800'
      case 'lue':
        return 'bg-blue-100 text-blue-800'
      case 'envoyée':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSendEmail = async (convocationId: number) => {
    try {
      setSendingEmails(prev => new Set(prev).add(convocationId))
      const success = await sendConvocationEmail(convocationId)
      if (success) {
        toast.success('Email envoyé avec succès')
        // Recharger les convocations pour mettre à jour les statuts
        const updatedConvocations = await getAllConvocations()
        setConvocations(updatedConvocations)
      } else {
        toast.error('Erreur lors de l\'envoi de l\'email.')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error)
      toast.error('Erreur lors de l\'envoi de l\'email')
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev)
        newSet.delete(convocationId)
        return newSet
      })
    }
  }

  const filteredConvocations = convocations.filter(
    (convocation) =>
      convocation.membre?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convocation.membre?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convocation.membre?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convocation.session?.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des convocations...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout /* unreadNotificationCount={unreadNotificationCount} */>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Convocations</h1>
            <p className="text-gray-600">Gestion des convocations aux sessions</p>
          </div>
          {user?.profil_utilisateur === 'admin' && (
            <Link href="/convocations/nouvelle">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle convocation
              </Button>
            </Link>
          )}
        </div>

        {/* Barre de recherche (visible seulement pour l'admin) */}
        {user?.profil_utilisateur === 'admin' && (
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par membre, email ou lieu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des convocations */}
        <div className="grid gap-4">
          {filteredConvocations.map((convocation) => (
            <Card
              key={convocation.id_convocation}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(convocation.statut)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user?.profil_utilisateur === 'admin'
                              ? `${convocation.membre?.prenom} ${convocation.membre?.nom}`
                              : `Convocation à la session du ${new Date(convocation.session?.date_session || '').toLocaleDateString('fr-FR')}`}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            {user?.profil_utilisateur === 'admin' && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{convocation.membre?.email}</span>
                              </div>
                            )}
                            {user?.profil_utilisateur === 'admin' && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{convocation.membre?.fonction}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Session du {new Date(convocation.session?.date_session || '').toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{convocation.session?.lieu}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        convocation.statut
                      )}`}
                    >
                      {convocation.statut}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentConvocation(convocation)
                        setIsConvocationModalOpen(true)
                      }}
                    >
                      Voir détails
                    </Button>
                    {user?.profil_utilisateur === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendEmail(convocation.id_convocation)}
                        disabled={sendingEmails.has(convocation.id_convocation)}
                      >
                        {sendingEmails.has(convocation.id_convocation) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {sendingEmails.has(convocation.id_convocation) ? 'Envoi...' : 'Renvoyer'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConvocations.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune convocation trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Aucune convocation ne correspond à votre recherche."
                  : "Aucune convocation n'a été créée pour le moment."}
              </p>
              {user?.profil_utilisateur === 'admin' && (
                <Link href="/convocations/nouvelle">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la première convocation
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <ConvocationModal
        isOpen={isConvocationModalOpen}
        onClose={() => setIsConvocationModalOpen(false)}
        convocation={currentConvocation}
        onUpdateConvocation={(updatedConvocation) => {
          setConvocations(prev => 
            prev.map(conv => conv.id_convocation === updatedConvocation.id_convocation ? updatedConvocation : conv)
          )
          setCurrentConvocation(updatedConvocation)
          // If a convocation is updated, re-fetch notifications to clear any related unread notifications.
          // fetchNotifications() 
        }}
      />
    </Layout>
  )
}

