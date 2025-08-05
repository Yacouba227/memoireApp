'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { User, Mail, Briefcase, Calendar, ArrowLeft, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getMembreById, deleteMembre, type Membre } from 'utils/membre'
import { toast } from 'sonner'

export default function MembreDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembre = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const membreId = parseInt(params.id as string)
        const membreData = await getMembreById(membreId)
        setMembre(membreData)
      } catch (error) {
        console.error('Erreur lors du chargement du membre:', error)
        setError('Erreur lors du chargement du membre')
        toast.error('Erreur lors du chargement du membre')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchMembre()
    }
  }, [params.id])

  const getProfilColor = (profil: string) => {
    switch (profil) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'membre':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement du membre...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !membre) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error || 'Membre non trouvé'}</p>
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
          <Link href="/membres">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {membre.prenom} {membre.nom}
            </h1>
            <p className="text-gray-600">Détails du membre</p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/membres/${membre.id_membre}/edit`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button 
              variant="destructive"
              onClick={async () => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
                  try {
                    await deleteMembre(membre.id_membre)
                    toast.success('Membre supprimé avec succès')
                    router.push('/membres')
                  } catch (error) {
                    console.error('Erreur lors de la suppression:', error)
                    toast.error('Erreur lors de la suppression')
                  }
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Informations principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations personnelles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium">{membre.prenom} {membre.nom}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{membre.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fonction</p>
                  <p className="font-medium">{membre.fonction}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfilColor(membre.profil_utilisateur)}`}>
                  {membre.profil_utilisateur}
                </span>
                <div>
                  <p className="text-sm text-gray-500">Profil utilisateur</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Statistiques</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-gray-600">Sessions participées</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-gray-600">Procès-verbaux rédigés</p>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Membre depuis</p>
                <p className="font-medium">{new Date(membre.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historique des participations */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des participations</CardTitle>
            <CardDescription>
              Sessions auxquelles ce membre a participé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune participation enregistrée</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 