'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Search, User, Mail, Briefcase, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function MembresPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Données fictives pour la démonstration
  const membres = [
    {
      id: 1,
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'amadou.diallo@uam.ne',
      fonction: 'Doyen',
      profil_utilisateur: 'admin'
    },
    {
      id: 2,
      nom: 'Traoré',
      prenom: 'Fatou',
      email: 'fatou.traore@uam.ne',
      fonction: 'Vice-doyen',
      profil_utilisateur: 'membre'
    },
    {
      id: 3,
      nom: 'Koné',
      prenom: 'Moussa',
      email: 'moussa.kone@uam.ne',
      fonction: 'Secrétaire général',
      profil_utilisateur: 'membre'
    },
    {
      id: 4,
      nom: 'Ouattara',
      prenom: 'Aïcha',
      email: 'aicha.ouattara@uam.ne',
      fonction: 'Responsable administratif',
      profil_utilisateur: 'membre'
    }
  ]

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

  return (
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
            <Card key={membre.id} className="hover:shadow-md transition-shadow">
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
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
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
  )
} 