'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
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
      const response = await fetch('/api/membres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/membres')
      } else {
        console.error('Erreur lors de la création du membre')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouveau membre</h1>
            <p className="text-gray-600">Ajouter un nouveau membre au conseil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription>
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
                />
                <Input
                  label="Prénom"
                  placeholder="Amadou"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="membre@fast.uam.ne"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </CardContent>
          </Card>

          {/* Fonction et profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Fonction et profil</span>
              </CardTitle>
              <CardDescription>
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
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profil utilisateur
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.profil_utilisateur}
                  onChange={(e) => setFormData({ ...formData, profil_utilisateur: e.target.value })}
                >
                  <option value="membre">Membre</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Accès et sécurité</span>
              </CardTitle>
              <CardDescription>
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
              />
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Le mot de passe doit contenir au moins 8 caractères. 
                  Il est recommandé d'utiliser une combinaison de lettres, chiffres et caractères spéciaux.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/membres">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Création...' : 'Créer le membre'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 