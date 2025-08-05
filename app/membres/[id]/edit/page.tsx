'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { User, Mail, Briefcase, ArrowLeft, Save, Trash2, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getMembreById, updateMembre, deleteMembre, type Membre } from 'utils/membre'
import { toast } from 'sonner'

export default function EditMembrePage() {
  const params = useParams()
  const router = useRouter()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: '',
    profil_utilisateur: 'membre'
  })

  useEffect(() => {
    const fetchMembre = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const membreId = parseInt(params.id as string)
        const membreData = await getMembreById(membreId)
        setMembre(membreData)
        setFormData({
          nom: membreData.nom,
          prenom: membreData.prenom,
          email: membreData.email,
          fonction: membreData.fonction,
          profil_utilisateur: membreData.profil_utilisateur
        })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!membre) return

    try {
      setIsSaving(true)
      await updateMembre(membre.id_membre, formData)
      toast.success('Membre modifié avec succès')
      router.push(`/membres/${membre.id_membre}`)
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      toast.error('Erreur lors de la modification')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!membre) return

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      return
    }

    try {
      setIsDeleting(true)
      await deleteMembre(membre.id_membre)
      toast.success('Membre supprimé avec succès')
      router.push('/membres')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
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
          <Link href={`/membres/${membre.id_membre}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Modifier {membre.prenom} {membre.nom}
            </h1>
            <p className="text-gray-600">Modifiez les informations du membre</p>
          </div>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informations du membre</span>
            </CardTitle>
            <CardDescription>
              Modifiez les informations personnelles du membre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <Input
                    value={formData.prenom}
                    onChange={(e) => handleInputChange('prenom', e.target.value)}
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <Input
                    value={formData.nom}
                    onChange={(e) => handleInputChange('nom', e.target.value)}
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemple.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction
                </label>
                <Input
                  value={formData.fonction}
                  onChange={(e) => handleInputChange('fonction', e.target.value)}
                  placeholder="Fonction"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profil utilisateur
                </label>
                <select
                  value={formData.profil_utilisateur}
                  onChange={(e) => handleInputChange('profil_utilisateur', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="membre">Membre</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" disabled={isSaving} className="flex-1">
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
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