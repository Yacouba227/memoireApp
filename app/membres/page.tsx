'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import ProtectedRoute from 'components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Plus, Search, User, Mail, Briefcase, Edit, Trash2, Eye, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllMembres, deleteMembre, type Membre } from 'utils/membre'
import { toast } from 'sonner'

export default function MembresPage() {
  // Page réservée admin seulement
  // On pourrait aussi utiliser ProtectedRoute au niveau de la page
  const [searchTerm, setSearchTerm] = useState('')
  const [membres, setMembres] = useState<Membre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const membresData = await getAllMembres()
        setMembres(membresData)
      } catch (error) {
        console.error('Erreur lors du chargement des membres:', error)
        setError('Erreur lors du chargement des membres')
        toast.error('Erreur lors du chargement des membres')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembres()
  }, [])

  // Recharger les données quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      fetchMembres()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchMembres = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const membresData = await getAllMembres()
      setMembres(membresData)
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error)
      setError('Erreur lors du chargement des membres')
      toast.error('Erreur lors du chargement des membres')
    } finally {
      setIsLoading(false)
    }
  }

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

  const filteredMembres = membres.filter(membre =>
    membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    membre.fonction.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des membres...</p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <ProtectedRoute requireAdmin>
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Membres</h1>
            <p className="text-gray-600">Gestion des membres du conseil</p>
          </div>
          <Link href="/membres/nouveau">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, email ou fonction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des membres */}
        <div className="grid gap-4">
          {filteredMembres.map((membre) => (
            <Card key={membre.id_membre} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {membre.prenom} {membre.nom}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{membre.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{membre.fonction}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfilColor(membre.profil_utilisateur)}`}>
                      {membre.profil_utilisateur}
                    </span>
                    <div className="flex space-x-2">
                      <Link href={`/membres/${membre.id_membre}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                                             <Link href={`/membres/${membre.id_membre}/edit`}>
                         <Button variant="outline" size="sm">
                           <Edit className="w-4 h-4" />
                         </Button>
                       </Link>
                       <Button 
                         variant="destructive" 
                         size="sm"
                         onClick={async () => {
                           if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
                             try {
                               await deleteMembre(membre.id_membre)
                               toast.success('Membre supprimé avec succès')
                               // Recharger la liste
                               fetchMembres()
                             } catch (error) {
                               console.error('Erreur lors de la suppression:', error)
                               toast.error('Erreur lors de la suppression')
                             }
                           }
                         }}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembres.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun membre ne correspond à votre recherche.' : 'Aucun membre n\'a été ajouté pour le moment.'}
              </p>
              <Link href="/membres/nouveau">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le premier membre
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
    </ProtectedRoute>
  )
} 