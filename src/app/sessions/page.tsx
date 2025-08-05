'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Search, Calendar, MapPin, User, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Données fictives pour la démonstration
  const sessions = [
    {
      id: 1,
      date: '2024-01-15',
      lieu: 'Salle de réunion A',
      president: 'Dr. Diallo',
      statut: 'planifiée',
      ordresDuJour: 5
    },
    {
      id: 2,
      date: '2024-01-10',
      lieu: 'Salle de réunion B',
      president: 'Dr. Traoré',
      statut: 'terminée',
      ordresDuJour: 3
    },
    {
      id: 3,
      date: '2024-01-05',
      lieu: 'Salle de réunion A',
      president: 'Dr. Koné',
      statut: 'terminée',
      ordresDuJour: 4
    },
    {
      id: 4,
      date: '2024-01-20',
      lieu: 'Salle de réunion C',
      president: 'Dr. Ouattara',
      statut: 'planifiée',
      ordresDuJour: 2
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planifiée':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'terminée':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'en_cours':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planifiée':
        return 'bg-yellow-100 text-yellow-800'
      case 'terminée':
        return 'bg-green-100 text-green-800'
      case 'en_cours':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
            <p className="text-gray-600">Gestion des sessions du conseil</p>
          </div>
          <Link href="/sessions/nouvelle">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle session
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par président ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions */}
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(session.statut)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Session du {new Date(session.date).toLocaleDateString('fr-FR')}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.lieu}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Président: {session.president}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{session.ordresDuJour} ordres du jour</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.statut)}`}>
                      {session.statut}
                    </span>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session trouvée</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucune session ne correspond à votre recherche.' : 'Aucune session n\'a été créée pour le moment.'}
              </p>
              <Link href="/sessions/nouvelle">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la première session
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
} 