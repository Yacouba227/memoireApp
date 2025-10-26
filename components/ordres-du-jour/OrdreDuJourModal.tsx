'use client'

import React, { useState } from 'react'
import { List, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import Modal from 'components/ui/Modal'

interface OrdreDuJourItem {
  id?: number
  titre: string
  description: string
  duree_estimee: string
  type: 'presentation' | 'discussion' | 'vote' | 'information'
  ordre: number
}

interface OrdreDuJour {
  id_ordre?: number
  titre: string
  date_creation: string
  session_id?: number
  items: OrdreDuJourItem[]
}

interface OrdreDuJourModalProps {
  isOpen: boolean
  onClose: () => void
  ordreDuJour?: OrdreDuJour
  mode: 'create' | 'edit' | 'view'
  onSave: (ordreDuJour: OrdreDuJour) => void
}

const OrdreDuJourModal: React.FC<OrdreDuJourModalProps> = ({ 
  isOpen, 
  onClose, 
  ordreDuJour, 
  mode, 
  onSave 
}) => {
  const [formData, setFormData] = useState<OrdreDuJour>({
    titre: ordreDuJour?.titre || '',
    date_creation: ordreDuJour?.date_creation || new Date().toISOString().split('T')[0],
    session_id: ordreDuJour?.session_id,
    items: ordreDuJour?.items || []
  })

  const [newItem, setNewItem] = useState<Omit<OrdreDuJourItem, 'ordre'>>({
    titre: '',
    description: '',
    duree_estimee: '',
    type: 'presentation'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addItem = () => {
    if (newItem.titre && newItem.description) {
      const item: OrdreDuJourItem = {
        ...newItem,
        ordre: formData.items.length + 1
      }
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, item]
      }))
      setNewItem({
        titre: '',
        description: '',
        duree_estimee: '',
        type: 'presentation'
      })
    }
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        ordre: i + 1
      }))
    }))
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.items.length - 1)
    ) {
      return
    }

    const newItems = [...formData.items]
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    
    // Mettre à jour l'ordre
    newItems.forEach((item, i) => {
      item.ordre = i + 1
    })

    setFormData(prev => ({
      ...prev,
      items: newItems
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
        mode === 'create' ? 'Nouvel Ordre du Jour' :
        mode === 'edit' ? 'Modifier l\'Ordre du Jour' :
        'Détails de l\'Ordre du Jour'
      }
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre de l'ordre du jour *
            </label>
            <Input
              name="titre"
              value={formData.titre}
              onChange={handleInputChange}
              required
              disabled={isReadOnly}
              className="w-full bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
              placeholder="Ex: Ordre du jour - Conseil de Faculté du 15 janvier 2024"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date de création
            </label>
            <Input
              name="date_creation"
              type="date"
              value={formData.date_creation}
              onChange={handleInputChange}
              disabled={true}
              className="w-full bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400"
            />
          </div>
        </div>

        {/* Ajout d'un nouvel item */}
        {!isReadOnly && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Ajouter un point à l'ordre du jour</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre *
                </label>
                <Input
                  name="titre"
                  value={newItem.titre}
                  onChange={handleItemInputChange}
                  placeholder="Titre du point"
                  className="w-full text-sm bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={newItem.type}
                  onChange={handleItemInputChange}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                >
                  <option value="presentation">Présentation</option>
                  <option value="discussion">Discussion</option>
                  <option value="vote">Vote</option>
                  <option value="information">Information</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Durée estimée
                </label>
                <Input
                  name="duree_estimee"
                  value={newItem.duree_estimee}
                  onChange={handleItemInputChange}
                  placeholder="Ex: 15 min"
                  className="w-full text-sm bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!newItem.titre || !newItem.description}
                  className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleItemInputChange}
                placeholder="Description détaillée du point..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Liste des items */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Points de l'ordre du jour</h4>
          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {item.ordre}
                      </span>
                      <h5 className="font-medium text-gray-900 dark:text-white">{item.titre}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'presentation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        item.type === 'discussion' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        item.type === 'vote' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {item.type === 'presentation' ? 'Présentation' :
                         item.type === 'discussion' ? 'Discussion' :
                         item.type === 'vote' ? 'Vote' : 'Information'}
                      </span>
                      {item.duree_estimee && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.duree_estimee}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                  
                  {!isReadOnly && (
                    <div className="flex space-x-1 ml-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 h-6 w-6 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === formData.items.length - 1}
                        className="p-1 h-6 w-6 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="p-1 h-6 w-6 text-red-600 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {formData.items.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <List className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p>Aucun point ajouté à l'ordre du jour</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {isReadOnly ? 'Fermer' : 'Annuler'}
          </Button>
          
          {!isReadOnly && (
            <Button type="submit" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
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

export default OrdreDuJourModal
