'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import ProtectedRoute from 'components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Calendar, User, ArrowLeft, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createConvocation, sendConvocationEmail, type ConvocationData } from 'utils/convocation'
import { getAllSessions, type Session } from 'utils/session'
import { getAllMembres, type Membre } from 'utils/membre'

export default function NouvelleConvocationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [membres, setMembres] = useState<Membre[]>([])
  const [formData, setFormData] = useState<ConvocationData>({
    sessionId: 0,
    membreId: 0,
    statut: 'envoyée'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, membresData] = await Promise.all([
          getAllSessions(),
          getAllMembres()
        ])
        setSessions(sessionsData)
        setMembres(membresData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        toast.error('Erreur lors du chargement des données')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.sessionId || !formData.membreId) {
        toast.error('Veuillez sélectionner une session et un membre')
        return
      }

      const convocation = await createConvocation(formData)
      
      if (convocation) {
        toast.success('Convocation créée avec succès')
        
        // Envoyer l'email automatiquement
        try {
          await sendConvocationEmail(convocation.id_convocation)
          toast.success('Email envoyé avec succès')
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError)
          toast.error('Convocation créée mais erreur lors de l\'envoi de l\'email')
        }
        
        router.push('/convocations')
      } else {
        toast.error('Erreur lors de la création de la convocation')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la création de la convocation')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedSession = sessions.find(s => s.id_session === formData.sessionId)
  const selectedMembre = membres.find(m => m.id_membre === formData.membreId)

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-center space-x-4">
            <Link href="/convocations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle convocation</h1>
              <p className="text-gray-600">Créer une nouvelle convocation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection de la session */}
            <Card>
              <CardHeader>
                <CardTitle>Sélection de la session</CardTitle>
                <CardDescription>
                  Choisissez la session pour laquelle créer la convocation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session
                  </label>
                  <select
                    value={formData.sessionId}
                    onChange={(e) => setFormData({ ...formData, sessionId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une session</option>
                    {sessions.map((session) => (
                      <option key={session.id_session} value={session.id_session}>
                        Session du {new Date(session.date_session).toLocaleDateString('fr-FR')} - {session.lieu}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSession && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Détails de la session</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date: {new Date(selectedSession.date_session).toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Président: {selectedSession.president}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sélection du membre */}
            <Card>
              <CardHeader>
                <CardTitle>Sélection du membre</CardTitle>
                <CardDescription>
                  Choisissez le membre à convoquer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membre
                  </label>
                  <select
                    value={formData.membreId}
                    onChange={(e) => setFormData({ ...formData, membreId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner un membre</option>
                    {membres.map((membre) => (
                      <option key={membre.id_membre} value={membre.id_membre}>
                        {membre.prenom} {membre.nom} - {membre.fonction}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedMembre && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Détails du membre</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Nom: {selectedMembre.prenom} {selectedMembre.nom}</div>
                      <div>Email: {selectedMembre.email}</div>
                      <div>Fonction: {selectedMembre.fonction}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statut */}
            <Card>
              <CardHeader>
                <CardTitle>Statut de la convocation</CardTitle>
                <CardDescription>
                  Définissez le statut initial de la convocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="envoyée">Envoyée</option>
                    <option value="lue">Lue</option>
                    <option value="confirmée">Confirmée</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Link href="/convocations">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Créer et envoyer
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}

