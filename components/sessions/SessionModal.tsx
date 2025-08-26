'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Users, FileText, Plus, Edit } from 'lucide-react'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'

interface Session {
  id_session?: number
  titre: string
  date_session: string
  heure_debut: string
  heure_fin: string
  lieu: string
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee'
  description?: string
}

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  session?: Session
  mode: 'create' | 'edit' | 'view'
  onSave: (session: Session) => void
}

const SessionModal: React.FC<SessionModalProps> = ({ 
  isOpen, 
  onClose, 
  session, 
  mode, 
  onSave 
}) => {
  const [formData, setFormData] = useState<Session>({
    titre: session?.titre || '',
    date_session: session?.date_session || '',
    heure_debut: session?.heure_debut || '',
    heure_fin: session?.heure_fin || '',
    lieu: session?.lieu || '',
    statut: session?.statut || 'planifiee',
    description: session?.description || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const isReadOnly = mode === 'view'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'create' ? 'Nouvelle Session' :
        mode === 'edit' ? 'Modifier la Session' :
        'Détails de la Session'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la session *
            </label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
              placeholder="Ex: Conseil de Faculté - Janvier 2024"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de la session *
            </label>
            <Input
              name="date_session"
              type="date"
              value={formData.date_session}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleInputChange}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="planifiee">Planifiée</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure de début *
            </label>
            <Input
              name="heure_debut"
              type="time"
              value={formData.heure_debut}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure de fin *
            </label>
            <Input
              name="heure_fin"
              type="time"
              value={formData.heure_fin}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu *
            </label>
            <Input
              name="lieu"
              value={formData.lieu}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
              placeholder="Ex: Salle de réunion A, Bâtiment principal"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isReadOnly}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Description détaillée de la session..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {isReadOnly ? 'Fermer' : 'Annuler'}
          </Button>
          
          {!isReadOnly && (
            <Button type="submit" className="flex items-center space-x-2">
              {mode === 'create' ? (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Créer</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Mettre à jour</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default SessionModal
