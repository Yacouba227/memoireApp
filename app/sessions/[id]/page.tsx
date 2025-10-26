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
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Chargement de la session...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !session) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error || 'Session non trouvée'}</p>
            <Button onClick={() => router.back()} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
              Retour
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/sessions">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                Session du {new Date(session.date_session).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">Détails de la session</p>
            </div>
          </div>
          {user?.profil_utilisateur === 'admin' && (
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={() => {
                setCurrentSessionToEdit(session)
                setIsEditModalOpen(true)
              }} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              <Button variant="destructive" onClick={handleDelete} className="dark:hover:bg-red-900 dark:hover:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </div>
          )}
        </div>

        <Card className="dark:bg-gray-700 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{new Date(session.date_session).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lieu</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session.lieu}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Président</p>
                  <p className="font-medium text-gray-900 dark:text-white">{session.president}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {session.ordresDuJour && session.ordresDuJour.length > 0 && (
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Ordres du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.ordresDuJour.map((o: any, i: number) => (
                <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <p className="font-medium text-gray-900 dark:text-white">{o.titre_point}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{o.description_point}</p>
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



