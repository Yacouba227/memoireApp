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
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Chargement des membres...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
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
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Membres</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Gestion des membres du conseil</p>
          </div>
          <Link href="/membres/nouveau">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card className="dark:bg-gray-700 dark:border-gray-600">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, email ou fonction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des membres */}
        <div className="grid gap-4">
          {filteredMembres.map((membre) => (
            <Card key={membre.id_membre} className="hover:shadow-md transform transition-transform hover:scale-105 duration-200 dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-200" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {membre.prenom} {membre.nom}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>{membre.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span>{membre.fonction}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfilColor(membre.profil_utilisateur)} dark:bg-opacity-20`}>
                      {membre.profil_utilisateur}
                    </span>
                    <div className="flex space-x-2">
                      <Link href={`/membres/${membre.id_membre}`}>
                        <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                                             <Link href={`/membres/${membre.id_membre}/edit`}>
                         <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
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
                         className="dark:hover:bg-red-900 dark:hover:text-red-300"
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
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun membre trouvé</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm ? 'Aucun membre ne correspond à votre recherche.' : 'Aucun membre n\'a été ajouté pour le moment.'}
              </p>
              <Link href="/membres/nouveau">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
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