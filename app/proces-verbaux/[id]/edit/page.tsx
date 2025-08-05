'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { FileText, Calendar, User, ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getProcesVerbalById, updateProcesVerbal, type ProcesVerbal } from 'utils/procesVerbal'
import { getAllSessions, type Session } from 'utils/session'
import { toast } from 'sonner'

export default function EditProcesVerbalPage() {
  const params = useParams()
  const router = useRouter()
  const [procesVerbal, setProcesVerbal] = useState<ProcesVerbal | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    id_session: 0,
    auteur_pv: '',
    contenu_pv: '',
    date_redaction: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const pvId = parseInt(params.id as string)
        
        // Charger le procès-verbal et les sessions en parallèle
        const [pvData, sessionsData] = await Promise.all([
          getProcesVerbalById(pvId),
          getAllSessions()
        ])
        
        setProcesVerbal(pvData)
        setSessions(sessionsData)
        if (pvData) {
          setFormData({
            id_session: pvData.session?.id_session || 0,
            auteur_pv: pvData.auteur_pv,
            contenu_pv: pvData.contenu_pv,
            date_redaction: new Date(pvData.date_redaction).toISOString().split('T')[0]
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        setError('Erreur lors du chargement')
        toast.error('Erreur lors du chargement')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!procesVerbal) return

    try {
      setIsSaving(true)
      await updateProcesVerbal(procesVerbal.id_pv, formData)
      toast.success('Procès-verbal modifié avec succès')
      router.push(`/proces-verbaux/${procesVerbal.id_pv}`)
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      toast.error('Erreur lors de la modification')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement du procès-verbal...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !procesVerbal) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error || 'Procès-verbal non trouvé'}</p>
            <Button onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/proces-verbaux/${procesVerbal.id_pv}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier le procès-verbal
            </h1>
            <p className="text-gray-600">Modifiez les informations du procès-verbal</p>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Informations du procès-verbal</span>
            </CardTitle>
            <CardDescription>
              Modifiez les informations du procès-verbal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session associée
                </label>
                <select
                  value={formData.id_session}
                  onChange={(e) => handleInputChange('id_session', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez une session</option>
                  {sessions.map((session) => (
                    <option key={session.id_session} value={session.id_session}>
                      Session du {new Date(session.date_session).toLocaleDateString('fr-FR')} - {session.president} ({session.lieu})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auteur/Rédacteur
                </label>
                <Input
                  value={formData.auteur_pv}
                  onChange={(e) => handleInputChange('auteur_pv', e.target.value)}
                  placeholder="Nom de l'auteur"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de rédaction
                </label>
                <Input
                  type="date"
                  value={formData.date_redaction}
                  onChange={(e) => handleInputChange('date_redaction', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu du procès-verbal
                </label>
                <textarea
                  value={formData.contenu_pv}
                  onChange={(e) => handleInputChange('contenu_pv', e.target.value)}
                  placeholder="Contenu détaillé du procès-verbal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={15}
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 