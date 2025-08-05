'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { FileText, Calendar, User, ArrowLeft, Edit, Download, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getProcesVerbalById, type ProcesVerbal } from 'utils/procesVerbal'
import { toast } from 'sonner'

export default function ProcesVerbalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [procesVerbal, setProcesVerbal] = useState<ProcesVerbal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcesVerbal = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const pvId = parseInt(params.id as string)
        const pvData = await getProcesVerbalById(pvId)
        setProcesVerbal(pvData)
      } catch (error) {
        console.error('Erreur lors du chargement du procès-verbal:', error)
        setError('Erreur lors du chargement du procès-verbal')
        toast.error('Erreur lors du chargement du procès-verbal')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProcesVerbal()
    }
  }, [params.id])

  const handleDownload = async () => {
    if (!procesVerbal) return

    try {
      const response = await fetch(`/api/proces-verbaux/${procesVerbal.id_pv}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `proces-verbal-${procesVerbal.id_pv}.html`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Téléchargement réussi')
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error('Erreur lors du téléchargement')
    }
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
          <Link href="/proces-verbaux">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Procès-verbal - Session du {procesVerbal.session?.date_session ? new Date(procesVerbal.session.date_session).toLocaleDateString('fr-FR') : 'Date non spécifiée'}
            </h1>
            <p className="text-gray-600">Détails du procès-verbal</p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/proces-verbaux/${procesVerbal.id_pv}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>

        {/* Informations de la session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Informations de la session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date de la session</p>
                  <p className="font-medium">
                    {procesVerbal.session?.date_session ? new Date(procesVerbal.session.date_session).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Président</p>
                  <p className="font-medium">{procesVerbal.session?.president || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Lieu</p>
                  <p className="font-medium">{procesVerbal.session?.lieu || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Rédacteur</p>
                  <p className="font-medium">{procesVerbal.auteur_pv}</p>
                </div>
              </div>
            </div>
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
              Rédigé le {new Date(procesVerbal.date_redaction).toLocaleDateString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {procesVerbal.contenu_pv}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métadonnées */}
        <Card>
          <CardHeader>
            <CardTitle>Métadonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID du procès-verbal</p>
                <p className="font-medium">#{procesVerbal.id_pv}</p>
              </div>
              <div>
                <p className="text-gray-500">Date de création</p>
                <p className="font-medium">{new Date(procesVerbal.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-500">Dernière modification</p>
                <p className="font-medium">{new Date(procesVerbal.updatedAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 