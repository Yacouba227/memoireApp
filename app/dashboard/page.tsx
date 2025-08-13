'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Calendar, Users, FileText, Plus, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats, getRecentSessions, type DashboardStats, type RecentSession } from 'utils/dashboard'
import { toast } from 'sonner'
import { useAuth } from 'contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    sessionsPlanifiees: 0,
    membresActifs: 0,
    procesVerbaux: 0,
    sessionsTerminees: 0,
    sessionsEnCours: 0
  })
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [dashboardStats, sessions] = await Promise.all([
        getDashboardStats(),
        getRecentSessions(5)
      ])
      
      setStats(dashboardStats)
      setRecentSessions(sessions)
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    // Rafraîchir les données quand on revient sur la page
    const handleFocus = () => {
      fetchDashboardData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const statsCards = [
    { 
      title: 'Sessions planifiées', 
      value: stats.sessionsPlanifiees.toString(), 
      icon: Calendar, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Membres actifs', 
      value: stats.membresActifs.toString(), 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      title: 'Procès-verbaux', 
      value: stats.procesVerbaux.toString(), 
      icon: FileText, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Sessions terminées', 
      value: stats.sessionsTerminees.toString(), 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      title: 'Sessions en cours', 
      value: stats.sessionsEnCours.toString(), 
      icon: Clock, 
      color: 'text-yellow-600' 
    },
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
            <p className="text-gray-600">
              {isLoading ? 'Chargement des données...' : 'Vue d\'ensemble de la plateforme'}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoading(true)
                fetchDashboardData()
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              Actualiser
            </Button>
            {user?.profil_utilisateur === 'admin' && (
              <Button onClick={() => window.location.href = '/sessions/nouvelle'}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {isLoading ? (
            // Affichage de chargement
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
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
            })
          )}
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
                {isLoading ? (
                  // Affichage de chargement pour les sessions
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))
                ) : recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div key={session.id_session} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(session.statut)}
                        <div>
                          <p className="font-medium text-gray-900">
                            Session du {new Date(session.date_session).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.lieu} • Président: {session.president}
                          </p>
                        </div>
                      </div>
                      <Link href={`/sessions/${session.id_session}`}>
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Aucune session récente
                  </div>
                )}
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
                {user?.profil_utilisateur === 'admin' && (
                  <Link href="/sessions/nouvelle">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une nouvelle session
                    </Button>
                  </Link>
                )}
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