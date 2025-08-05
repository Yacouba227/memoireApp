interface ProcesVerbalData {
  id_session: number
  contenu_pv: string
  auteur_pv: string
  date_redaction?: string
}

interface ProcesVerbal {
  id_pv: number
  sessionId: number
  contenu_pv: string
  auteur_pv: string
  date_redaction: string
  createdAt: string
  updatedAt: string
  session?: {
    id_session: number
    date_session: string
    lieu: string
    president: string
  }
}

// Créer un nouveau procès-verbal
export async function createProcesVerbal(data: ProcesVerbalData): Promise<ProcesVerbal | null> {
  try {
    const response = await fetch('/api/proces-verbaux', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création du procès-verbal')
    }

    const procesVerbal = await response.json()
    return procesVerbal
  } catch (error) {
    console.error('Erreur lors de la création du procès-verbal:', error)
    throw error
  }
}

// Récupérer tous les procès-verbaux
export async function getAllProcesVerbaux(): Promise<ProcesVerbal[]> {
  try {
    const response = await fetch('/api/proces-verbaux', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération des procès-verbaux')
    }

    const procesVerbaux = await response.json()
    return procesVerbaux
  } catch (error) {
    console.error('Erreur lors de la récupération des procès-verbaux:', error)
    throw error
  }
}

// Récupérer un procès-verbal par son ID
export async function getProcesVerbalById(id: number): Promise<ProcesVerbal | null> {
  try {
    const response = await fetch(`/api/proces-verbaux/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération du procès-verbal')
    }

    const procesVerbal = await response.json()
    return procesVerbal
  } catch (error) {
    console.error('Erreur lors de la récupération du procès-verbal:', error)
    throw error
  }
}

// Récupérer un procès-verbal par session
export async function getProcesVerbalBySession(sessionId: number): Promise<ProcesVerbal | null> {
  try {
    const response = await fetch(`/api/proces-verbaux/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération du procès-verbal')
    }

    const procesVerbal = await response.json()
    return procesVerbal
  } catch (error) {
    console.error('Erreur lors de la récupération du procès-verbal:', error)
    throw error
  }
}

// Mettre à jour un procès-verbal
export async function updateProcesVerbal(id: number, data: Partial<ProcesVerbalData>): Promise<ProcesVerbal | null> {
  try {
    const response = await fetch(`/api/proces-verbaux/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour du procès-verbal')
    }

    const procesVerbal = await response.json()
    return procesVerbal
  } catch (error) {
    console.error('Erreur lors de la mise à jour du procès-verbal:', error)
    throw error
  }
}

// Supprimer un procès-verbal
export async function deleteProcesVerbal(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/proces-verbaux/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression du procès-verbal')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du procès-verbal:', error)
    throw error
  }
}

// Générer un PDF du procès-verbal
export async function generatePDF(id: number): Promise<Blob> {
  try {
    const response = await fetch(`/api/proces-verbaux/${id}/pdf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la génération du PDF')
    }

    return response.blob()
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    throw error
  }
}

// Exporter les types pour utilisation dans d'autres fichiers
export type { ProcesVerbalData, ProcesVerbal } 