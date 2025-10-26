'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Plus, Edit, Trash2, Loader2, List, Calendar, MapPin, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from 'contexts/AuthContext'
import { getAllSessions, updateSession, type Session, type OrdreDuJour } from 'utils/session'
import { useRouter } from 'next/navigation'

interface OrdreDuJourItemForm {
  id?: number;
  titre: string;
  description: string;
  duree_estimee: string;
  type: 'presentation' | 'discussion' | 'vote' | 'information';
  ordre: number;
}

export default function NouvelleOrdreDuJourPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const [ordreDuJourItems, setOrdreDuJourItems] = useState<OrdreDuJourItemForm[]>([])
  const [newItem, setNewItem] = useState<Omit<OrdreDuJourItemForm, 'ordre' | 'id'>>({
    titre: '',
    description: '',
    duree_estimee: '',
    type: 'information'
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user?.profil_utilisateur !== 'admin') {
      router.push('/dashboard') // Redirect non-admins
      return
    }

    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true)
        const sessionsData = await getAllSessions()
        setSessions(sessionsData)
      } catch (err) {
        console.error('Erreur lors du chargement des sessions:', err)
        setError('Erreur lors du chargement des sessions')
        toast.error('Erreur lors du chargement des sessions')
      } finally {
        setIsLoadingSessions(false)
      }
    }

    fetchSessions()
  }, [user, router])

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addItem = () => {
    if (newItem.titre && newItem.description) {
      const item: OrdreDuJourItemForm = {
        ...newItem,
        ordre: ordreDuJourItems.length + 1
      }
      setOrdreDuJourItems(prev => [...prev, item])
      setNewItem({
        titre: '',
        description: '',
        duree_estimee: '',
        type: 'information'
      })
    } else {
      toast.error('Veuillez remplir le titre et la description du point.')
    }
  }

  const removeItem = (index: number) => {
    setOrdreDuJourItems(prev => 
      prev.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        ordre: i + 1
      }))
    )
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === ordreDuJourItems.length - 1)
    ) {
      return
    }

    const newItems = [...ordreDuJourItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    
    newItems.forEach((item, i) => {
      item.ordre = i + 1
    })

    setOrdreDuJourItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSessionId) {
      toast.error('Veuillez sélectionner une session.')
      return
    }
    if (ordreDuJourItems.length === 0) {
      toast.error('Veuillez ajouter au moins un point à l\'ordre du jour.')
      return
    }

    setIsSaving(true)
    try {
      const sessionToUpdate = sessions.find(s => s.id_session === selectedSessionId)
      if (!sessionToUpdate) {
        toast.error('Session introuvable.')
        setIsSaving(false)
        return
      }

      const transformedOrdresDuJour: OrdreDuJour[] = ordreDuJourItems.map((item) => ({
        titre_point: item.titre,
        description_point: item.description,
        ordre_affichage: item.ordre,
        numero_point: item.ordre,
        duree_estimee: parseInt(item.duree_estimee) || undefined,
        // responsable: item.responsable || undefined, // Add responsable if it exists in OrdreDuJourItemForm
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sessionId: selectedSessionId,
      }))

      const updatedSession = await updateSession(selectedSessionId, { 
        ordresDuJour: [...(sessionToUpdate.ordresDuJour || []), ...transformedOrdresDuJour] 
      })
      
      toast.success('Ordre du jour créé avec succès pour la session')
      router.push('/ordres-du-jour')
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erreur lors de la création de l\'ordre du jour')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingSessions) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-300">Chargement des sessions...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Nouvel Ordre du Jour</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Créez un nouvel ordre du jour pour une session existante.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de la session */}
          <div>
            <label htmlFor="session" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sélectionner une session *
            </label>
            <Select onValueChange={(value) => setSelectedSessionId(parseInt(value, 10))} value={selectedSessionId?.toString() || ''}>
              <SelectTrigger className="w-full bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400">
                <SelectValue placeholder="Choisissez une session" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {sessions.map(session => (
                  <SelectItem key={session.id_session} value={session.id_session.toString()} className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    Session du {new Date(session.date_session).toLocaleDateString('fr-FR')} - {session.lieu}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ajout des points de l'ordre du jour */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ajouter des points à l'ordre du jour</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre *</label>
                <Input
                  name="titre"
                  value={newItem.titre}
                  onChange={handleItemInputChange}
                  placeholder="Titre du point"
                  className="w-full bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <Select onValueChange={(value: OrdreDuJourItemForm['type']) => setNewItem(prev => ({ ...prev, type: value }))} value={newItem.type}>
                  <SelectTrigger className="w-full bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <SelectItem value="presentation" className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Présentation</SelectItem>
                    <SelectItem value="discussion" className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Discussion</SelectItem>
                    <SelectItem value="vote" className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Vote</SelectItem>
                    <SelectItem value="information" className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Durée estimée (min)</label>
                <Input
                  name="duree_estimee"
                  value={newItem.duree_estimee}
                  onChange={handleItemInputChange}
                  placeholder="Ex: 15"
                  type="number"
                  className="w-full bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={addItem} className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter point
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleItemInputChange}
                placeholder="Description détaillée du point..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Liste des points ajoutés */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Points de l'ordre du jour (Prévisualisation)</h4>
            {ordreDuJourItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                <List className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p>Aucun point ajouté. Utilisez le formulaire ci-dessus pour ajouter des points.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordreDuJourItems.map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="w-7 h-7 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center justify-center text-sm font-bold">
                            {item.ordre}
                          </span>
                          <h5 className="font-medium text-gray-900 dark:text-white text-base">{item.titre}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === 'presentation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            item.type === 'discussion' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            item.type === 'vote' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          } dark:bg-opacity-20`}>
                            {item.type === 'presentation' ? 'Présentation' :
                             item.type === 'discussion' ? 'Discussion' :
                             item.type === 'vote' ? 'Vote' : 'Information'}
                          </span>
                          {item.duree_estimee && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                              {item.duree_estimee} min
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1 h-8 w-8 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(index, 'down')}
                          disabled={index === ordreDuJourItems.length - 1}
                          className="p-1 h-8 w-8 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="p-1 h-8 w-8 text-red-600 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => router.push('/ordres-du-jour')} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">Annuler</Button>
            <Button type="submit" disabled={isSaving || !selectedSessionId || ordreDuJourItems.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {isSaving ? 'Création...' : 'Créer l\'ordre du jour'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
