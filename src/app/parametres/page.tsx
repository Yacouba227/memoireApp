'use client'

import Layout from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Lock, Bell, Database, Download, Upload } from 'lucide-react'

export default function ParametresPage() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configuration de votre compte et de la plateforme</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profil utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profil utilisateur</span>
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="Diallo"
                  defaultValue="Amadou"
                />
                <Input
                  label="Prénom"
                  placeholder="Amadou"
                  defaultValue="Diallo"
                />
              </div>
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                defaultValue="admin@fast.uam.ne"
              />
              <Input
                label="Fonction"
                placeholder="Doyen"
                defaultValue="Doyen"
              />
              <Button className="w-full">
                Sauvegarder les modifications
              </Button>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Sécurité</span>
              </CardTitle>
              <CardDescription>
                Modifiez votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Ancien mot de passe"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                placeholder="••••••••"
              />
              <Button className="w-full">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configurez vos préférences de notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nouvelles sessions</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Convocation reçue</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Procès-verbal disponible</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rappels de session</span>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
              <Button className="w-full">
                Sauvegarder les préférences
              </Button>
            </CardContent>
          </Card>

          {/* Base de données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Base de données</span>
              </CardTitle>
              <CardDescription>
                Gestion des données et sauvegardes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter les données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Sauvegarder la base
                </Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Statistiques de la base :</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Membres : <span className="font-medium">3</span></div>
                  <div>Sessions : <span className="font-medium">2</span></div>
                  <div>PV : <span className="font-medium">1</span></div>
                  <div>Taille : <span className="font-medium">2.5 MB</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions système */}
        <Card>
          <CardHeader>
            <CardTitle>Actions système</CardTitle>
            <CardDescription>
              Actions administratives pour la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                Vider le cache
              </Button>
              <Button variant="outline" className="w-full">
                Réinitialiser les données
              </Button>
              <Button variant="destructive" className="w-full">
                Déconnexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 