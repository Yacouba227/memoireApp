'use client'

import React, { useState, useEffect } from 'react'
import { User, Edit, Save, X, Lock, Eye, EyeOff, Upload } from 'lucide-react'
import { useAuth } from 'contexts/AuthContext'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'
import { toast } from 'sonner'
import { Membre, updateMembre } from 'utils/membre' // Importation du type Membre et de updateMembre

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: Membre | null // Ajout de la prop user
  onSave: (updatedUser: Membre) => void // Ajout de la prop onSave
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const { updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction: '',
    mot_de_passe: '',
    photo_url: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        fonction: user.fonction || '',
        mot_de_passe: '',
        photo_url: user.photo_url || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    if (!user || !user.id_membre) return

    setIsLoading(true)
    try {
      const updatedData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        fonction: formData.fonction,
        // Le mot_de_passe ne doit être envoyé que s'il est modifié
        ...(formData.mot_de_passe && { mot_de_passe: formData.mot_de_passe }),
        photo_url: formData.photo_url,
      }

      const updatedMembre = await updateMembre(user.id_membre, updatedData)

      if (updatedMembre) {
        if (onSave) {
          onSave(updatedMembre) // Appeler la prop onSave avec le membre mis à jour
        }
        if (updateUser) {
          updateUser(updatedMembre) // Mettre à jour le contexte AuthContext
        }
        toast.success('Profil mis à jour avec succès')
        setIsEditing(false)
        setFormData(prev => ({ ...prev, mot_de_passe: '' }))
      } else {
        toast.error('Erreur lors de la mise à jour du profil')
      }
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error(error.message || 'Erreur lors de la sauvegarde')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        fonction: user.fonction || '',
        mot_de_passe: '',
        photo_url: user.photo_url || ''
      })
    }
    setIsEditing(false)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !user.id_membre) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('id_membre', String(user.id_membre))
      // Envoyer la photo de profil via l'API spécifique
      const res = await fetch('/api/auth/profile/photo', { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || 'Erreur lors du téléversement')
        return
      }
      const data = await res.json()
      // Après le téléversement réussi, on met à jour les données du membre
      if (data.user) {
        if (onSave) {
          onSave(data.user) // Appeler la prop onSave avec le membre mis à jour
        }
        if (updateUser) {
          updateUser(data.user) // Mettre à jour le contexte AuthContext
        }
        setFormData(prev => ({ ...prev, photo_url: data.user.photo_url || '' }))
        toast.success('Photo mise à jour')
      }
    } catch (err) {
      toast.error('Erreur lors du téléversement')
    } finally {
      setUploading(false)
    }
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
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
              Photo de profil
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                  src={formData.photo_url || user.photo_url || '/images/logo-fast.gif'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Téléversement...' : 'Téléverser'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo de profil (URL)
            </label>
            <Input
              name="photo_url"
              value={formData.photo_url}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full"
              placeholder="https://.../photo.jpg"
            />
          </div>
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

        {/* Mot de passe (réservé admin) */}
        {isEditing && user.profil_utilisateur === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe (optionnel)
            </label>
            <div className="relative">
              <Input
                name="mot_de_passe"
                type={showPassword ? 'text' : 'password'}
                value={formData.mot_de_passe}
                onChange={handleInputChange}
                placeholder="Laissez vide pour ne pas changer"
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour conserver le mot de passe actuel
            </p>
          </div>
        )}

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
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
                <span>Annuler</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProfileModal
