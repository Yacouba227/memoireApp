'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Palette,
  Plus,
  Edit,
  Trash2,
  Eye,
  Lock
} from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import Modal from 'components/ui/Modal'
import ProfileModal from 'components/profile/ProfileModal'
import PasswordManagerModal from 'components/profile/PasswordManagerModal'
import { Membre } from 'utils/membre' // Importation du type Membre

// Suppression de l'interface User locale, on utilisera Membre de utils/membre.ts
/*
interface User {
  id_membre: number
  nom: string
  prenom: string
  email: string
  fonction: string
  profil_utilisateur: string
}
*/

export default function ParametresPage() {
  const { user, updateUser } = useAuth()
  const [users, setUsers] = useState<Membre[]>([]) 
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPasswordManagerOpen, setIsPasswordManagerOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Membre | null>(null) 
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: '',
    profil_utilisateur: 'membre',
    password: '', 
    photo_url: '',
  })

  useEffect(() => {
    if (user?.profil_utilisateur === 'admin') {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/membres')
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : (data.membres || []))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
    }
  }

  const handleUserAction = (action: 'create' | 'edit' | 'view', userData?: Membre) => {
    if (action === 'create') {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        fonction: '',
        profil_utilisateur: 'membre',
        password: '',
        photo_url: '',
      })
      setIsEditing(false)
    } else if (action === 'edit' && userData) {
      setFormData({
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        fonction: userData.fonction,
        profil_utilisateur: userData.profil_utilisateur,
        password: '',
        photo_url: userData.photo_url || '',
      })
      setIsEditing(true)
      setSelectedUser(userData)
    } else if (action === 'view' && userData) {
      setSelectedUser(userData)
      setIsEditing(false)
    }
    setIsUserModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing && selectedUser) {
        const response = await fetch(`/api/membres/${selectedUser.id_membre}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            fonction: formData.fonction,
            profil_utilisateur: formData.profil_utilisateur,
            // Utiliser le champ attendu par l'API
            mot_de_passe: formData.password ? formData.password : undefined,
            photo_url: formData.photo_url,
          })
        })
        if (response.ok) {
          fetchUsers()
          setIsUserModalOpen(false)
        }
      } else {
        const response = await fetch('/api/membres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            fonction: formData.fonction,
            profil_utilisateur: formData.profil_utilisateur,
            // Utiliser le champ attendu par l'API
            mot_de_passe: formData.password,
            photo_url: formData.photo_url,
          })
        })
        if (response.ok) {
          fetchUsers()
          setIsUserModalOpen(false)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`/api/membres/${userId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchUsers()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Les membres non-admin voient uniquement leur profil; les admins voient tout

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">
            Gérez les paramètres de votre plateforme et vos utilisateurs
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Mon Profil</CardTitle>
            <CardDescription>
              Consultez et modifiez vos informations personnelles
            </CardDescription>
          </CardHeader>
        </Card>

        {user?.profil_utilisateur === 'admin' && (
          <>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleUserAction('create')}>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Nouvel Utilisateur</CardTitle>
                <CardDescription>
                  Ajoutez un nouveau membre à la plateforme
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsSettingsModalOpen(true)}>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Paramètres Système</CardTitle>
                <CardDescription>
                  Configurez les paramètres globaux de la plateforme
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsPasswordManagerOpen(true)}>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Gestion des Mots de Passe</CardTitle>
                <CardDescription>
                  Réinitialisez les mots de passe des membres en cas d'oubli
                </CardDescription>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      {user?.profil_utilisateur === 'admin' && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
          <CardDescription>
            Gérez les comptes utilisateurs de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nom</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Fonction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Rôle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem: Membre) => ( // Ajout de l'assertion de type ici
                  <tr key={userItem.id_membre} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {userItem.prenom} {userItem.nom}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{userItem.email}</td>
                    <td className="py-3 px-4 text-gray-600">{userItem.fonction}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        userItem.profil_utilisateur === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userItem.profil_utilisateur === 'admin' ? 'Administrateur' : 'Membre'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUserAction('view', userItem)}
                          className="p-1 h-8 w-8"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user?.profil_utilisateur === 'admin' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUserAction('edit', userItem)}
                              className="p-1 h-8 w-8"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(userItem.id_membre)}
                              className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      )}

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user} // Passer la prop user
        onSave={(updatedUser) => {
          // Mettre à jour le contexte d'authentification après la sauvegarde
          if (updateUser) {
            updateUser(updatedUser)
          }
        }}
      />

      {user?.profil_utilisateur === 'admin' && (
        <PasswordManagerModal
          isOpen={isPasswordManagerOpen}
          onClose={() => setIsPasswordManagerOpen(false)}
        />
      )}

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <Input
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <Input
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fonction *
              </label>
              <Input
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle *
              </label>
              <select
                name="profil_utilisateur"
                value={formData.profil_utilisateur}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="membre">Membre</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUserModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Paramètres Système"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Générale</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la plateforme
                </label>
                <Input defaultValue="Plateforme FAST" className="w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de l'application
                </label>
                <Input defaultValue="https://fast.uam.ne" className="w-full" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuseau horaire
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Africa/Niamey">Africa/Niamey (UTC+1)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button>
              Sauvegarder
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 