'use client'

import React, { useState } from 'react'
import { useAuth } from 'contexts/AuthContext'
import ProfileModal from 'components/profile/ProfileModal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'components/ui/Card'
import { Button } from 'components/ui/Button'

export default function MonProfilPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentification requise</CardTitle>
            <CardDescription>Veuillez vous connecter pour accéder à votre profil.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/login">Se connecter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-2">Gérez vos informations personnelles et votre photo de profil</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Modifier vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setOpen(true)}>Ouvrir l'éditeur de profil</Button>
        </CardContent>
      </Card>

      <ProfileModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}


