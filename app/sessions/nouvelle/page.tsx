'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from 'components/layout/Layout'
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
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center space-x-4">
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle session</h1>
            <p className="text-gray-600">Créer une nouvelle session du conseil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la session</CardTitle>
              <CardDescription>
                Renseignez les informations de base de la session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    label="Date de la session"
                    type="datetime-local"
                    value={formData.date_session}
                    onChange={(e) => setFormData({ ...formData, date_session: e.target.value })}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    label="Lieu"
                    placeholder="Salle de réunion A"
                    value={formData.lieu}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    required
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    label="Président"
                    placeholder="Dr. Diallo"
                    value={formData.president}
                    onChange={(e) => setFormData({ ...formData, president: e.target.value })}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ordres du jour */}
          <Card>
            <CardHeader>
              <CardTitle>Ordres du jour</CardTitle>
              <CardDescription>
                Ajoutez les points à traiter lors de cette session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.ordresDuJour.map((ordre, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Point {index + 1}</h4>
                    {formData.ordresDuJour.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOrdreDuJour(index)}
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
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un point
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Link href="/sessions">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer la session'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
} 