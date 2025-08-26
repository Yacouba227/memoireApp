'use client'

import React, { useState, useEffect } from 'react'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Search, 
  RefreshCw, 
  Copy, 
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'
import { toast } from 'sonner'

interface Membre {
  id_membre: number
  nom: string
  prenom: string
  email: string
  fonction: string
  profil_utilisateur: string
  role_membre?: string
}

interface PasswordManagerModalProps {
  isOpen: boolean
  onClose: () => void
}

const PasswordManagerModal: React.FC<PasswordManagerModalProps> = ({ isOpen, onClose }) => {
  const [membres, setMembres] = useState<Membre[]>([])
  const [filteredMembres, setFilteredMembres] = useState<Membre[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchMembres()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMembres(membres)
    } else {
      const filtered = membres.filter(membre =>
        membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membre.fonction.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredMembres(filtered)
    }
  }, [searchTerm, membres])

  const fetchMembres = async () => {
    try {
      const response = await fetch('/api/membres')
      if (response.ok) {
        const data = await response.json()
        setMembres(data.membres || [])
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error)
      toast.error('Erreur lors de la récupération des membres')
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setNewPassword(password)
  }

  const copyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopiedPassword(password)
      toast.success('Mot de passe copié dans le presse-papiers')
      setTimeout(() => setCopiedPassword(null), 2000)
    } catch (error) {
      toast.error('Erreur lors de la copie')
    }
  }

  const resetPassword = async () => {
    if (!selectedMembre || !newPassword.trim()) {
      toast.error('Veuillez sélectionner un membre et générer un mot de passe')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/membres/${selectedMembre.id_membre}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: selectedMembre.nom,
          prenom: selectedMembre.prenom,
          email: selectedMembre.email,
          fonction: selectedMembre.fonction,
          profil_utilisateur: selectedMembre.profil_utilisateur,
          mot_de_passe: newPassword
        })
      })

      if (response.ok) {
        toast.success(`Mot de passe réinitialisé pour ${selectedMembre.prenom} ${selectedMembre.nom}`)
        setNewPassword('')
        setSelectedMembre(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la réinitialisation')
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error)
      toast.error('Erreur lors de la réinitialisation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMembreSelect = (membre: Membre) => {
    setSelectedMembre(membre)
    setNewPassword('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestionnaire de Mots de Passe"
      size="xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Réinitialisation des Mots de Passe
          </h3>
          <p className="text-sm text-gray-600">
            Générez de nouveaux mots de passe pour les membres en cas d'oubli
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher un membre
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Nom, prénom, email ou fonction..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
              {filteredMembres.map((membre) => (
                <div
                  key={membre.id_membre}
                  onClick={() => handleMembreSelect(membre)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMembre?.id_membre === membre.id_membre ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {membre.prenom} {membre.nom}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {membre.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {membre.fonction} • {membre.profil_utilisateur}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {selectedMembre ? (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Membre sélectionné
                  </h4>
                  <p className="text-sm text-blue-800">
                    <strong>{selectedMembre.prenom} {selectedMembre.nom}</strong><br />
                    {selectedMembre.email}<br />
                    {selectedMembre.fonction}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Générez un mot de passe sécurisé"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button
                      onClick={generatePassword}
                      variant="outline"
                      className="px-3"
                      title="Générer un mot de passe sécurisé"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {newPassword && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Mot de passe généré :</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {newPassword}
                      </code>
                      <Button
                        onClick={() => copyPassword(newPassword)}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6"
                        title="Copier le mot de passe"
                      >
                        {copiedPassword === newPassword ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">⚠️ Attention</p>
                      <p>Ce mot de passe sera immédiatement appliqué. Assurez-vous de le communiquer de manière sécurisée au membre.</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={resetPassword}
                  disabled={!newPassword.trim() || isLoading}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Lock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Sélectionnez un membre pour réinitialiser son mot de passe</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PasswordManagerModal
