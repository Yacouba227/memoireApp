'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { FileText, ArrowLeft, Save, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { getAllSessions, type Session } from 'utils/session'
import { createProcesVerbal } from 'utils/procesVerbal'
import { toast } from 'sonner'

export default function NouveauProcesVerbalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [formData, setFormData] = useState({
    sessionId: '',
    contenu_pv: '',
    auteur_pv: '',
    redacteurId: 1 // À remplacer par l'ID de l'utilisateur connecté
  })

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionsData = await getAllSessions()
        setSessions(sessionsData)
      } catch (error) {
        console.error('Erreur lors du chargement des sessions:', error)
        toast.error('Erreur lors du chargement des sessions')
      }
    }

    fetchSessions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createProcesVerbal({
        id_session: parseInt(formData.sessionId),
        auteur_pv: formData.auteur_pv,
        contenu_pv: formData.contenu_pv,
        date_redaction: new Date().toISOString()
      })
      toast.success('Procès-verbal créé avec succès')
      router.push('/proces-verbaux')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Erreur lors de la création du procès-verbal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/proces-verbaux">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau procès-verbal</h1>
            <p className="text-gray-600">Rédiger un nouveau procès-verbal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de la session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Sélection de la session</span>
              </CardTitle>
              <CardDescription>
                Choisissez la session pour laquelle vous rédigez le procès-verbal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.sessionId}
                  onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                  required
                >
                  <option value="">Sélectionner une session</option>
                  {sessions.map((session) => (
                    <option key={session.id_session} value={session.id_session}>
                      Session du {new Date(session.date_session).toLocaleDateString('fr-FR')} - {session.lieu} - Président: {session.president}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Informations du procès-verbal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations du rédacteur</span>
              </CardTitle>
              <CardDescription>
                Renseignez les informations du rédacteur du procès-verbal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Auteur/Rédacteur"
                placeholder="Nom du rédacteur du procès-verbal"
                value={formData.auteur_pv}
                onChange={(e) => setFormData({ ...formData, auteur_pv: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Contenu du procès-verbal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Contenu du procès-verbal</span>
              </CardTitle>
              <CardDescription>
                Rédigez le contenu détaillé du procès-verbal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={15}
                  placeholder="Rédigez ici le contenu du procès-verbal..."
                  value={formData.contenu_pv}
                  onChange={(e) => setFormData({ ...formData, contenu_pv: e.target.value })}
                  required
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Conseils de rédaction :</strong>
                  <br />
                  • Commencez par un en-tête avec la date et le lieu de la session
                  <br />
                  • Listez les participants présents
                  <br />
                  • Détaillez chaque point de l'ordre du jour traité
                  <br />
                  • Mentionnez les décisions prises et les actions à suivre
                  <br />
                  • Terminez par la date et la signature du rédacteur
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/proces-verbaux">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Création...' : 'Créer le procès-verbal'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 