'use client'

import { useState } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Plus, Search, FileText, Calendar, User, Eye, Download } from 'lucide-react'
import Link from 'next/link'

export default function ProcesVerbauxPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Données fictives pour la démonstration
  const procesVerbaux = [
    {
      id: 1,
      session_date: '2024-01-10',
      session_lieu: 'Salle de réunion B',
      session_president: 'Dr. Traoré',
      auteur_pv: 'Dr. Koné',
      date_redaction: '2024-01-11',
      contenu_preview: 'Procès-verbal de la session du conseil du 10 janvier 2024...'
    },
    {
      id: 2,
      session_date: '2024-01-05',
      session_lieu: 'Salle de réunion A',
      session_president: 'Dr. Koné',
      auteur_pv: 'Dr. Diallo',
      date_redaction: '2024-01-06',
      contenu_preview: 'Procès-verbal de la session du conseil du 5 janvier 2024...'
    },
    {
      id: 3,
      session_date: '2023-12-20',
      session_lieu: 'Salle de réunion C',
      session_president: 'Dr. Ouattara',
      auteur_pv: 'Dr. Traoré',
      date_redaction: '2023-12-21',
      contenu_preview: 'Procès-verbal de la session du conseil du 20 décembre 2023...'
    }
  ]

  const filteredProcesVerbaux = procesVerbaux.filter(pv =>
    pv.session_president.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.auteur_pv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.session_lieu.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procès-verbaux</h1>
            <p className="text-gray-600">Gestion des procès-verbaux des sessions</p>
          </div>
          <Link href="/proces-verbaux/nouveau">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau procès-verbal
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par président, auteur ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des procès-verbaux */}
        <div className="grid gap-4">
          {filteredProcesVerbaux.map((pv) => (
            <Card key={pv.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Procès-verbal - Session du {new Date(pv.session_date).toLocaleDateString('fr-FR')}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{pv.session_lieu}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Président: {pv.session_president}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Rédacteur: {pv.auteur_pv}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {pv.contenu_preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">
                      Rédigé le {new Date(pv.date_redaction).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex space-x-2">
                      <Link href={`/proces-verbaux/${pv.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProcesVerbaux.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun procès-verbal trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun procès-verbal ne correspond à votre recherche.' : 'Aucun procès-verbal n\'a été rédigé pour le moment.'}
              </p>
              <Link href="/proces-verbaux/nouveau">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Rédiger le premier procès-verbal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
} 