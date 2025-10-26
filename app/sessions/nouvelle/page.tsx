'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
import ProtectedRoute from 'components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Calendar, MapPin, User, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from "sonner"
import { createSession, type SessionData } from 'utils/session'

export default function NouvelleSessionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SessionData>({
    date_session: '',
    lieu: '',
    president: '',
    ordresDuJour: [
      { titre_point: '', description_point: '' }
    ]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const session = await createSession(formData)
      
      if (session) {
        toast('Session créée avec succès')
        router.push('/sessions')
      } else {
        toast.error('Erreur lors de la création de la session')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la création de la session')
    } finally {
      setIsLoading(false)
    }
  }

  const addOrdreDuJour = () => {
    setFormData({
      ...formData,
      ordresDuJour: [
        ...formData.ordresDuJour,
        { titre_point: '', description_point: '' }
      ]
    })
  }

  const removeOrdreDuJour = (index: number) => {
    if (formData.ordresDuJour.length > 1) {
      setFormData({
        ...formData,
        ordresDuJour: formData.ordresDuJour.filter((_, i) => i !== index)
      })
    }
  }

  const updateOrdreDuJour = (index: number, field: string, value: string) => {
    const newOrdresDuJour = [...formData.ordresDuJour]
    newOrdresDuJour[index] = { ...newOrdresDuJour[index], [field]: value }
    setFormData({
      ...formData,
      ordresDuJour: newOrdresDuJour
    })
  }

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
      <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-64px)] rounded-lg shadow-inner">
        {/* En-tête */}
        <div className="flex items-center space-x-4">
          <Link href="/sessions">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Nouvelle session</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">Créer une nouvelle session du conseil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Informations de la session</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Renseignez les informations de base de la session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    label="Date de la session"
                    type="datetime-local"
                    value={formData.date_session}
                    onChange={(e) => setFormData({ ...formData, date_session: e.target.value })}
                    required
                    className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    label="Lieu"
                    placeholder="Salle de réunion A"
                    value={formData.lieu}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    required
                    className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
                
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <Input
                    label="Président"
                    placeholder="Dr. Diallo"
                    value={formData.president}
                    onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                    required
                    className="pl-10 bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ordres du jour */}
          <Card className="dark:bg-gray-700 dark:border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Ordres du jour</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                Ajoutez les points à traiter lors de cette session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ordresDuJour.map((ordre, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Point {index + 1}</h4>
                    {formData.ordresDuJour.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOrdreDuJour(index)}
                        className="dark:hover:bg-red-900 dark:hover:text-red-300"
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="Titre du point"
                      placeholder="Ex: Approbation du budget 2024"
                      value={ordre.titre_point}
                      onChange={(e) => updateOrdreDuJour(index, 'titre_point', e.target.value)}
                      required
                      className="bg-gray-100 border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400"
                        rows={3}
                        placeholder="Description détaillée du point à traiter..."
                        value={ordre.description_point}
                        onChange={(e) => updateOrdreDuJour(index, 'description_point', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addOrdreDuJour}
                className="w-full dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un point
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/sessions">
              <Button variant="outline" type="button" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800">
              {isLoading ? 'Création...' : 'Créer la session'}
            </Button>
          </div>
        </form>
      </div>
      </Layout>
    </ProtectedRoute>
  )
} 