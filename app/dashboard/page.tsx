'use client'

import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Calendar, Users, FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Données fictives pour la démonstration
  const stats = [
    { title: 'Sessions planifiées', value: '12', icon: Calendar, color: 'text-blue-600' },
    { title: 'Membres actifs', value: '25', icon: Users, color: 'text-green-600' },
    { title: 'Procès-verbaux', value: '8', icon: FileText, color: 'text-purple-600' },
  ]

  const recentSessions = [
    {
      id: 1,
      date: '2024-01-15',
      lieu: 'Salle de réunion A',
      president: 'Dr. Diallo',
      statut: 'planifiée'
    },
    {
      id: 2,
      date: '2024-01-10',
      lieu: 'Salle de réunion B',
      president: 'Dr. Traoré',
      statut: 'terminée'
    },
    {
      id: 3,
      date: '2024-01-05',
      lieu: 'Salle de réunion A',
      president: 'Dr. Koné',
      statut: 'terminée'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planifiée':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'terminée':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
          </div>
          <Button onClick={() => window.location.href = '/sessions/nouvelle'}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle session
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Sessions récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessions récentes</CardTitle>
              <CardDescription>Les dernières sessions du conseil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(session.statut)}
                      <div>
                        <p className="font-medium text-gray-900">
                          Session du {new Date(session.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.lieu} • Président: {session.president}
                        </p>
                      </div>
                    </div>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/sessions">
                  <Button variant="ghost" className="w-full">
                    Voir toutes les sessions
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Accès rapide aux fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/sessions/nouvelle">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une nouvelle session
                  </Button>
                </Link>
                <Link href="/membres">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les membres
                  </Button>
                </Link>
                <Link href="/proces-verbaux">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Consulter les procès-verbaux
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 