'use client'

import React, { useState } from 'react'
import { User, Edit, Save, X } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    fonction: user?.fonction || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
      // await updateProfile(formData)
      setIsEditing(false)
      // Optionnel: afficher un message de succès
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      fonction: user?.fonction || ''
    })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil Utilisateur"
      size="md"
    >
      <div className="space-y-6">
        {/* Avatar et informations de base */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-sm text-gray-500">
              {user.profil_utilisateur === 'admin' ? 'Administrateur' : 'Membre'}
            </p>
            <p className="text-sm text-gray-500">{user.fonction}</p>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <Input
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <Input
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fonction
            </label>
            <Input
              name="fonction"
              value={formData.fonction}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProfileModal
