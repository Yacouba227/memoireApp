'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Calendar, MapPin, User, ArrowLeft, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getSessionById, deleteSession, updateSession, type Session } from 'utils/session'
import { toast } from 'sonner'
import { useAuth } from 'contexts/AuthContext'
import SessionModal from 'components/sessions/SessionModal'

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentSessionToEdit, setCurrentSessionToEdit] = useState<Session | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const id = parseInt(params.id as string)
        const data = await getSessionById(id)
        setSession(data)
      } catch (err) {
        console.error('Erreur lors du chargement de la session:', err)
        setError('Erreur lors du chargement de la session')
        toast.error('Erreur lors du chargement de la session')
      } finally {
        setIsLoading(false)
      }
    }
    if (params.id) fetchSession()
  }, [params.id])

  const handleDelete = async () => {
    if (!session) return
    if (!confirm('Supprimer cette session ?')) return
    try {
      await deleteSession(session.id_session)
      toast.success('Session supprimée')
      router.push('/sessions')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Suppression impossible')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement de la session...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !session) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error || 'Session non trouvée'}</p>
            <Button onClick={() => router.back()}>Retour</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Session du {new Date(session.date_session).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </h1>
            <p className="text-gray-600">Détails de la session</p>
          </div>
          {user?.profil_utilisateur === 'admin' && (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => {
                setCurrentSessionToEdit(session)
                setIsEditModalOpen(true)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(session.date_session).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium">{session.lieu}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Président</p>
                  <p className="font-medium">{session.president}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {session.ordresDuJour && session.ordresDuJour.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ordres du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.ordresDuJour.map((o: any, i: number) => (
                <div key={i} className="border border-gray-200 rounded p-3">
                  <p className="font-medium">{o.titre_point}</p>
                  <p className="text-sm text-gray-600">{o.description_point}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
      {currentSessionToEdit && (
        <SessionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          session={currentSessionToEdit}
          mode="edit"
          onSave={async (updatedSession) => {
            try {
              const sessionDataToUpdate = {
                titre_session: updatedSession.titre_session,
                date_session: updatedSession.date_session,
                lieu: updatedSession.lieu,
                president: updatedSession.president,
                statut: updatedSession.statut,
                duree_prevue: updatedSession.duree_prevue,
                statut_session: updatedSession.statut_session,
                quorum_requis: updatedSession.quorum_requis,
              }
              await updateSession(updatedSession.id_session!, sessionDataToUpdate)
              // Refetch session to get the latest data including relations
              const fetchedSession = await getSessionById(updatedSession.id_session!)
              if (fetchedSession) {
                setSession(fetchedSession)
              }
              toast.success("Session mise à jour avec succès")
              setIsEditModalOpen(false)
            } catch (err: any) {
              console.error(err)
              toast.error(err.message || "Erreur lors de la mise à jour de la session")
            }
          }}
        />
      )}
    </Layout>
  )
}



