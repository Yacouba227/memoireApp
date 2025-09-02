'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import {
  Search,
  Calendar,
  MapPin,
  User,
  Clock,
  Loader2,
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { getAllSessions, updateSession, type Session, type OrdreDuJour } from 'utils/session'
import { toast } from 'sonner'
import { useAuth } from 'contexts/AuthContext'
import OrdreDuJourModal from 'components/ordres-du-jour/OrdreDuJourModal'

interface OrdreDuJourItemModal {
  id?: number
  titre: string
  description: string
  duree_estimee: string
  type: 'presentation' | 'discussion' | 'vote' | 'information'
  ordre: number
}

interface OrdreDuJourModalData {
  id_ordre?: number
  date_creation: string
  session_id?: number
  items: OrdreDuJourItemModal[]
}

export default function OrdresDuJourPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const [isOrdreDuJourModalOpen, setIsOrdreDuJourModalOpen] = useState(false)
  const [currentSessionForOrdreDuJour, setCurrentSessionForOrdreDuJour] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const sessionsData = await getAllSessions()
        setSessions(sessionsData)
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error)
        setError('Erreur lors du chargement des sessions')
        toast.error('Erreur lors du chargement des sessions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const filteredSessions = sessions.filter(
    (session) =>
      session.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.titre_session && session.titre_session.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des ordres du jour...</p>
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
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ordres du jour</h1>
            <p className="text-gray-600">Gestion des ordres du jour des sessions</p>
          </div>
          {user?.profil_utilisateur === 'admin' && (
            <Link href="/sessions/nouvelle">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            </Link>
          )}
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par président, lieu ou titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions avec leurs ordres du jour */}
        <div className="grid gap-6">
          {filteredSessions.map((session) => (
            <Card
              key={session.id_session}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {session.titre_session || `Session du ${new Date(session.date_session).toLocaleDateString('fr-FR')}`}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(session.date_session).toLocaleString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{session.lieu}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Président: {session.president}</span>
                        </div>
                        {session.duree_prevue && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duree_prevue} min</span>
                          </div>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <Link href={`/sessions/${session.id_session}`}>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {session.ordresDuJour && session.ordresDuJour.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Points à l'ordre du jour :</h4>
                    <div className="grid gap-3">
                      {session.ordresDuJour
                        .sort((a, b) => (a.ordre_affichage || 0) - (b.ordre_affichage || 0))
                        .map((ordre, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  Point {ordre.numero_point || index + 1}: {ordre.titre_point}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ordre.description_point}
                                </p>
                                {ordre.responsable && (
                                  <p className="text-xs text-gray-500 mt-2">
                                    Responsable: {ordre.responsable}
                                  </p>
                                )}
                                {ordre.duree_estimee && (
                                  <p className="text-xs text-gray-500">
                                    Durée estimée: {ordre.duree_estimee} min
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun ordre du jour défini pour cette session</p>
                    {user?.profil_utilisateur === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setCurrentSessionForOrdreDuJour(session)
                          setIsOrdreDuJourModalOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Ajouter des points
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune session trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Aucune session ne correspond à votre recherche."
                  : "Aucune session n'a été créée pour le moment."}
              </p>
              {user?.profil_utilisateur === 'admin' && (
                <Link href="/sessions/nouvelle">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la première session
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {currentSessionForOrdreDuJour && (
        <OrdreDuJourModal
          isOpen={isOrdreDuJourModalOpen}
          onClose={() => setIsOrdreDuJourModalOpen(false)}
          ordreDuJour={{
            date_creation: currentSessionForOrdreDuJour.createdAt,
            session_id: currentSessionForOrdreDuJour.id_session,
            items: currentSessionForOrdreDuJour.ordresDuJour?.map((item, index) => ({
              id: item.id_ordre,
              titre: item.titre_point,
              description: item.description_point,
              duree_estimee: item.duree_estimee?.toString() || '',
              type: 'information', // Default type, adjust if you have this info
              ordre: item.ordre_affichage || index + 1,
            })) || []
          }}
          onSave={async (updatedOrdreDuJour: OrdreDuJourModalData) => {
            try {
              const transformedOrdresDuJour: OrdreDuJour[] = updatedOrdreDuJour.items.map((item, index) => ({
                id_ordre: item.id,
                titre_point: item.titre,
                description_point: item.description,
                ordre_affichage: item.ordre,
                numero_point: item.ordre,
                duree_estimee: parseInt(item.duree_estimee) || undefined,
                responsable: item.responsable || undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sessionId: currentSessionForOrdreDuJour.id_session,
              }))

              await updateSession(currentSessionForOrdreDuJour.id_session, { ordresDuJour: transformedOrdresDuJour })
              toast.success("Ordre du jour mis à jour avec succès")
              setIsOrdreDuJourModalOpen(false)
              // Refetch sessions to update the list
              const sessionsData = await getAllSessions()
              setSessions(sessionsData)
            } catch (err: any) {
              console.error(err)
              toast.error(err.message || "Erreur lors de la mise à jour de l'ordre du jour")
            }
          }}
          mode="edit"
        />
      )}
    </Layout>
  )
}




