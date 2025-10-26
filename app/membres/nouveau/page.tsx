'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import ProtectedRoute from 'components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { User, Mail, Briefcase, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NouveauMembrePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: '',
    mot_de_passe: '',
    profil_utilisateur: 'membre'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { createMembre } = await import('utils/membre')
      await createMembre(formData)
      router.push('/membres')
    } catch (error: any) {
      console.error('Erreur:', error)
      // Gérer l'erreur (afficher un toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requireAdmin>
    <Layout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/membres">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Nouveau membre</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Ajouter un nouveau membre au conseil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Renseignez les informations de base du membre
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="Diallo"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                  className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
                <Input
                  label="Prénom"
                  placeholder="Amadou"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                  className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="membre@fast.uam.ne"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </CardContent>
          </Card>

          {/* Fonction et profil */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
                <Briefcase className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span>Fonction et profil</span>
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Définissez la fonction et le profil utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Fonction"
                placeholder="Ex: Vice-doyen, Secrétaire général, Responsable département"
                value={formData.fonction}
                onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                required
                className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profil utilisateur
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                  value={formData.profil_utilisateur}
                  onChange={(e) => setFormData({ ...formData, profil_utilisateur: e.target.value })}
                >
                  <option value="membre" className="dark:bg-gray-900">Membre</option>
                  <option value="admin" className="dark:bg-gray-900">Administrateur</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rôle académique
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                  value={(formData as any).role_membre}
                  onChange={(e) => setFormData({ ...formData, role_membre: e.target.value as any })}
                >
                  <option value="professeur" className="dark:bg-gray-900">Professeur</option>
                  <option value="docteur" className="dark:bg-gray-900">Docteur</option>
                  <option value="doyen" className="dark:bg-gray-900">Doyen</option>
                  <option value="recteur" className="dark:bg-gray-900">Recteur</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
                <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span>Accès et sécurité</span>
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Définissez le mot de passe pour l'accès à la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={formData.mot_de_passe}
                onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                required
                className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note :</strong> Le mot de passe doit contenir au moins 8 caractères. 
                  Il est recommandé d'utiliser une combinaison de lettres, chiffres et caractères spéciaux.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/membres">
              <Button variant="outline" type="button" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Création...' : 'Créer le membre'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
    </ProtectedRoute>
  )
} 