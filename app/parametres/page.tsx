'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { User, Lock, Bell, Database, Download, Upload, LogOut, Save, Loader2 } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { toast } from 'sonner'

export default function ParametresPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: ''
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notifications, setNotifications] = useState({
    newSessions: true,
    convocations: true,
    procesVerbaux: true,
    reminders: false
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        fonction: user.fonction || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/membres/${user?.id_membre}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          fonction: formData.fonction
        }),
      })

      if (response.ok) {
        toast.success('Profil mis à jour avec succès')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la mise à jour du profil')
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsSaving(true)
    
    try {
      // Simulation de changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Mot de passe changé avec succès')
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe')
    } finally {
      setIsSaving(false)
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Déconnexion réussie')
      router.push('/login')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // Simulation d'export
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Données exportées avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'export')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportData = async () => {
    setIsLoading(true)
    try {
      // Simulation d'import
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Données importées avec succès')
    } catch (error) {
      toast.error('Erreur lors de l\'import')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackup = async () => {
    setIsLoading(true)
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Sauvegarde créée avec succès')
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

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
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <Input
                      value={formData.nom}
                      onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                      placeholder="Diallo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <Input
                      value={formData.prenom}
                      onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                      placeholder="Amadou"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fonction
                  </label>
                  <Input
                    value={formData.fonction}
                    onChange={(e) => setFormData(prev => ({ ...prev, fonction: e.target.value }))}
                    placeholder="Doyen"
                  />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder les modifications
                    </>
                  )}
                </Button>
              </form>
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
              <form onSubmit={handlePasswordChange}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancien mot de passe
                  </label>
                  <Input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changement...
                    </>
                  ) : (
                    'Changer le mot de passe'
                  )}
                </Button>
              </form>
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
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={notifications.newSessions}
                    onChange={(e) => handleNotificationChange('newSessions', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Convocation reçue</span>
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={notifications.convocations}
                    onChange={(e) => handleNotificationChange('convocations', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Procès-verbal disponible</span>
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={notifications.procesVerbaux}
                    onChange={(e) => handleNotificationChange('procesVerbaux', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rappels de session</span>
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={notifications.reminders}
                    onChange={(e) => handleNotificationChange('reminders', e.target.checked)}
                  />
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleExportData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exporter les données
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleImportData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Importer des données
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleBackup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
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
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 