'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Calendar, Users, FileText, Plus, Clock, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react'
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
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Tableau de bord</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {isLoading ? 'Chargement des données...' : 'Vue d\'ensemble de la plateforme de gestion des sessions'}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoading(true)
                fetchDashboardData()
              }}
              disabled={isLoading}
              className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              Actualiser
            </Button>
            {user?.profil_utilisateur === 'admin' && (
              <Button onClick={() => window.location.href = '/sessions/nouvelle'} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle session
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {isLoading ? (
            // Affichage de chargement
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="dark:bg-gray-700 dark:border-gray-600 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="dark:bg-gray-700 dark:border-gray-600 transform transition-transform hover:scale-105 duration-200">
                  <CardContent className="p-6 flex flex-col items-start">
                    <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg')} bg-opacity-10 mb-4`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Sessions récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader className="border-b pb-4 dark:border-gray-600">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sessions récentes</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">Les dernières sessions du conseil</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {isLoading ? (
                  // Affichage de chargement pour les sessions
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600 animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  ))
                ) : recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div key={session.id_session} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(session.statut)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Session du {new Date(session.date_session).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {session.lieu} • Président: {session.president}
                          </p>
                        </div>
                      </div>
                      <Link href={`/sessions/${session.id_session}`}>
                        <Button variant="outline" size="sm" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                          Voir
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune session récente à afficher.
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Link href="/sessions">
                  <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900">
                    Voir toutes les sessions <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader className="border-b pb-4 dark:border-gray-600">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Actions rapides</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">Accès rapide aux fonctionnalités clés</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {user?.profil_utilisateur === 'admin' && (
                  <Link href="/sessions/nouvelle">
                    <Button variant="outline" className="w-full justify-start dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une nouvelle session
                    </Button>
                  </Link>
                )}
                <Link href="/membres">
                  <Button variant="outline" className="w-full justify-start dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Gérer les membres
                  </Button>
                </Link>
                <Link href="/proces-verbaux">
                  <Button variant="outline" className="w-full justify-start dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
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