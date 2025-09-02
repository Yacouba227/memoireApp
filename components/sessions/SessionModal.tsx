'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Users, FileText, Plus, Edit } from 'lucide-react'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'
import type { OrdreDuJour } from 'utils/session'

interface Session {
  id_session?: number // Rendu facultatif pour la création de session
  titre_session?: string
  date_session: string
  lieu: string
  president: string
  statut_session: 'planifiée' | 'en_cours' | 'terminée' | 'annulée' // Renommé de 'statut'
  duree_prevue?: number
  quorum_requis?: number
  ordresDuJour?: OrdreDuJour[]
  createdAt?: string // Rendu facultatif
  updatedAt?: string // Rendu facultatif
}

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  session: Session | null
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
    id_session: session?.id_session, // Ajout de id_session
    titre_session: session?.titre_session || '',
    date_session: session?.date_session ? new Date(session.date_session).toISOString().split('T')[0] : '',
    lieu: session?.lieu || '',
    president: session?.president || '',
    statut_session: session?.statut_session || 'planifiée',
    duree_prevue: session?.duree_prevue || undefined,
    quorum_requis: session?.quorum_requis || undefined,
    ordresDuJour: session?.ordresDuJour || [],
    createdAt: session?.createdAt || new Date().toISOString(),
    updatedAt: session?.updatedAt || new Date().toISOString(),
  })

  React.useEffect(() => {
    if (session) {
      setFormData({
        id_session: session.id_session, // Ajout de id_session
        titre_session: session.titre_session || '',
        date_session: session.date_session ? new Date(session.date_session).toISOString().split('T')[0] : '',
        lieu: session.lieu || '',
        president: session.president || '',
        statut_session: session.statut_session || 'planifiée',
        duree_prevue: session.duree_prevue || undefined,
        quorum_requis: session.quorum_requis || undefined,
        ordresDuJour: session.ordresDuJour || [],
        createdAt: session.createdAt || new Date().toISOString(),
        updatedAt: session.updatedAt || new Date().toISOString(),
      })
    } else {
      setFormData({
        id_session: undefined, // S'assurer que c'est undefined pour la création
        titre_session: '',
        date_session: '',
        lieu: '',
        president: '',
        statut_session: 'planifiée',
        duree_prevue: undefined,
        quorum_requis: undefined,
        ordresDuJour: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }))
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : parseInt(value)
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
              Titre de la session
            </label>
            <Input
              name="titre_session"
              value={formData.titre_session}
              onChange={handleInputChange}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Président *
            </label>
            <Input
              name="president"
              value={formData.president}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full"
              placeholder="Nom du président"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut de la session
            </label>
            <select
              name="statut_session" // Nom mis à jour
              value={formData.statut_session}
              onChange={handleInputChange}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="planifiée">Planifiée</option>
              <option value="en_cours">En cours</option>
              <option value="terminée">Terminée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée prévue (min)
            </label>
            <Input
              name="duree_prevue"
              type="number"
              value={formData.duree_prevue}
              onChange={handleNumberInputChange}
              disabled={isReadOnly}
              className="w-full"
              placeholder="Ex: 60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quorum requis
            </label>
            <Input
              name="quorum_requis"
              type="number"
              value={formData.quorum_requis}
              onChange={handleNumberInputChange}
              disabled={isReadOnly}
              className="w-full"
              placeholder="Ex: 5"
            />
          </div>
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
