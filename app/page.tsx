'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Users, Calendar, FileText } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  // Supprimer la redirection automatique pour laisser accéder à /login

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plateforme FAST
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gestion des sessions du conseil de la Faculté des Sciences et Techniques
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Calendar className="w-8 h-8 text-primary-600 mb-2" />
              <CardTitle>Gestion des Sessions</CardTitle>
              <CardDescription>
                Planifiez et gérez les réunions du conseil
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary-600 mb-2" />
              <CardTitle>Gestion des Membres</CardTitle>
              <CardDescription>
                Gérez les membres et leurs rôles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-primary-600 mb-2" />
              <CardTitle>Procès-verbaux</CardTitle>
              <CardDescription>
                Consultez et rédigez les procès-verbaux
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => router.push('/login')}>
            Commencer
          </Button>
        </div>
      </div>
    </div>
  )
} 