'use client'

import { useState, useEffect } from 'react'
import Layout from 'components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/Card'
import { Button } from 'components/ui/Button'
import { Input } from 'components/ui/Input'
import { Plus, Search, FileText, Calendar, User, Eye, Download, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getAllProcesVerbaux, type ProcesVerbal } from 'utils/procesVerbal'
import { toast } from 'sonner'

export default function ProcesVerbauxPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [procesVerbaux, setProcesVerbaux] = useState<ProcesVerbal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProcesVerbaux = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const procesVerbauxData = await getAllProcesVerbaux()
        setProcesVerbaux(procesVerbauxData)
      } catch (error) {
        console.error('Erreur lors du chargement des procès-verbaux:', error)
        setError('Erreur lors du chargement des procès-verbaux')
        toast.error('Erreur lors du chargement des procès-verbaux')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProcesVerbaux()
  }, [])

  // Recharger les données quand on revient sur la page
  useEffect(() => {
    const handleFocus = () => {
      fetchProcesVerbaux()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchProcesVerbaux = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const procesVerbauxData = await getAllProcesVerbaux()
      setProcesVerbaux(procesVerbauxData)
    } catch (error) {
      console.error('Erreur lors du chargement des procès-verbaux:', error)
      setError('Erreur lors du chargement des procès-verbaux')
      toast.error('Erreur lors du chargement des procès-verbaux')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProcesVerbaux = procesVerbaux.filter(pv =>
    pv.session?.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.auteur_pv.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.session?.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-gray-600">Chargement des procès-verbaux...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Procès-verbaux</h1>
            <p className="text-gray-600">Gestion des procès-verbaux des sessions</p>
          </div>
          <Link href="/proces-verbaux/nouveau">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau procès-verbal
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par président, auteur ou lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des procès-verbaux */}
        <div className="grid gap-4">
          {filteredProcesVerbaux.map((pv) => (
            <Card key={pv.id_pv} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Procès-verbal - Session du {new Date(pv.session?.date_session || '').toLocaleDateString('fr-FR')}
                          </h3>
                          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{pv.session?.lieu || 'Lieu non spécifié'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Président: {pv.session?.president || 'Non spécifié'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Rédacteur: {pv.auteur_pv}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {pv.contenu_pv.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500">
                      Rédigé le {new Date(pv.date_redaction).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="flex space-x-2">
                      <Link href={`/proces-verbaux/${pv.id_pv}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/proces-verbaux/${pv.id_pv}/pdf`)
                            if (response.ok) {
                              const blob = await response.blob()
                              const url = window.URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `proces-verbal-${pv.id_pv}.pdf`
                              document.body.appendChild(a)
                              a.click()
                              window.URL.revokeObjectURL(url)
                              document.body.removeChild(a)
                            }
                          } catch (error) {
                            console.error('Erreur lors du téléchargement:', error)
                            toast.error('Erreur lors du téléchargement')
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProcesVerbaux.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun procès-verbal trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun procès-verbal ne correspond à votre recherche.' : 'Aucun procès-verbal n\'a été rédigé pour le moment.'}
              </p>
              <Link href="/proces-verbaux/nouveau">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Rédiger le premier procès-verbal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
} 