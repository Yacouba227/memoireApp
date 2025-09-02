'use client'

import React from 'react'
import Modal from 'components/ui/Modal'
import { Button } from 'components/ui/Button'
import { Calendar, Mail, User, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import type { Convocation } from 'utils/convocation'

interface ConvocationModalProps {
  isOpen: boolean
  onClose: () => void
  convocation: Convocation | null
}

const getStatusIcon = (statut: string) => {
  switch (statut) {
    case 'confirmée':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'lue':
      return <Clock className="w-4 h-4 text-blue-600" />
    case 'envoyée':
      return <Mail className="w-4 h-4 text-yellow-600" />
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />
  }
}

const ConvocationModal: React.FC<ConvocationModalProps> = ({
  isOpen,
  onClose,
  convocation
}) => {
  if (!convocation) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de la convocation"
      size="lg"
    >
      <div className="space-y-4 text-gray-700">
        <p className="text-lg font-semibold">Membre: {convocation.membre?.prenom} {convocation.membre?.nom}</p>
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <p>Email: {convocation.membre?.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <p>Fonction: {convocation.membre?.fonction}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <p>Session: {convocation.session?.titre_session || `Session du ${new Date(convocation.session?.date_session || '').toLocaleDateString('fr-FR')}`}</p>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <p>Lieu: {convocation.session?.lieu}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(convocation.statut)}
          <p>Statut: {convocation.statut}</p>
        </div>
        {convocation.date_envoi && (
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <p>Date d'envoi: {new Date(convocation.date_envoi).toLocaleString('fr-FR')}</p>
          </div>
        )}
        {convocation.date_lecture && (
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <p>Date de lecture: {new Date(convocation.date_lecture).toLocaleString('fr-FR')}</p>
          </div>
        )}
        {convocation.reponse_membre && (
          <div className="space-y-2">
            <p className="font-medium">Réponse du membre:</p>
            <p className="p-2 bg-gray-100 rounded-md">{convocation.reponse_membre}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </Modal>
  )
}

export default ConvocationModal
