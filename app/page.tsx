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
/* 

Faire un bon UI/UX et d'agrandir les interface.

Refactorisation de l'interface utilisateur

Remplacer la barre de navigation (NavBar) par une barre latérale (SideBar) tout en intégrant le logo.
Mettre à jour la page de connexion pour qu'elle ne permette qu'à un administrateur d'ajouter ou de supprimer des utilisateurs.

Gestion des rôles et des permissions

Modifier le projet pour différencier les interfaces utilisateur entre les membres et les administrateurs.
Les membres n'auront pas la permission de modifier ou de créer de nouveaux utilisateurs, sessions, procès-verbaux, etc.
Seuls les administrateurs auront les droits nécessaires pour effectuer ces actions.
Et que leur interface se difere

 Révision des pages et fonctionnalités

Revoir la page des paramètres.
Modifier la page des convocations, en particulier la fonctionnalité liée à Nodemailer.

 Améliorations de l'ergonomie (UX)
 Implémenter des fenêtres modales pour certaines pages, notamment pour :
  La gestion des sessions (créer, afficher les détails, etc.), La gestion des ordre du jour (créer, afficher les détails, etc.), La gestion des membres (créer, afficher les détails, etc.)...etc
 Créer une fenêtre de profil pour permettre aux utilisateurs de consulter et de modifier leurs informations.
 Développer une fenêtre d'affichage des convocations.
Ajouter un sélecteur de thème et un bouton de changement de langue.

*/