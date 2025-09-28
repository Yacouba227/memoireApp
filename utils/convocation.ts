interface ConvocationData {
  sessionId: number
  membreId: number
  statut?: string
  reponse_membre?: string
}

interface Convocation {
  id_convocation: number
  sessionId: number
  membreId: number
  date_envoi: string
  statut: string
  date_lecture?: string
  reponse_membre?: string
  createdAt: string
  updatedAt: string
  session?: {
    id_session: number
    titre_session?: string
    date_session: string
    lieu: string
    president: string
  }
  membre?: {
    id_membre: number
    nom: string
    prenom: string
    email: string
    fonction: string
  }
}

// Créer une nouvelle convocation
export async function createConvocation(data: ConvocationData): Promise<Convocation | null> {
  try {
    const response = await fetch('/api/convocations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de la convocation')
    }

    const convocation = await response.json()
    return convocation
  } catch (error) {
    console.error('Erreur lors de la création de la convocation:', error)
    throw error
  }
}

// Récupérer toutes les convocations (optionnellement filtrées par membreId)
export async function getAllConvocations(membreId?: number): Promise<Convocation[]> {
  try {
    const url = membreId ? `/api/convocations?membreId=${membreId}` : '/api/convocations'
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération des convocations')
    }

    const convocations = await response.json()
    return convocations
  } catch (error) {
    console.error('Erreur lors de la récupération des convocations:', error)
    throw error
  }
}

// Récupérer les convocations d'une session
export async function getConvocationsBySession(sessionId: number): Promise<Convocation[]> {
  try {
    const response = await fetch(`/api/convocations/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération des convocations')
    }

    const convocations = await response.json()
    return convocations
  } catch (error) {
    console.error('Erreur lors de la récupération des convocations:', error)
    throw error
  }
}

// Récupérer une convocation par son ID
export async function getConvocationById(id: number): Promise<Convocation | null> {
  try {
    const response = await fetch(`/api/convocations/${id}`, {
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
      throw new Error(error.message || 'Erreur lors de la récupération de la convocation')
    }

    const convocation = await response.json()
    return convocation
  } catch (error) {
    console.error('Erreur lors de la récupération de la convocation:', error)
    throw error
  }
}

// Mettre à jour une convocation
export async function updateConvocation(id: number, data: Partial<ConvocationData>): Promise<Convocation | null> {
  try {
    const response = await fetch(`/api/convocations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de la convocation')
    }

    const convocation = await response.json()
    return convocation
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la convocation:', error)
    throw error
  }
}

// Supprimer une convocation
export async function deleteConvocation(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/convocations/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression de la convocation')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la convocation:', error)
    throw error
  }
}

// Marquer une convocation comme lue
export async function markConvocationAsRead(convocationId: number): Promise<Convocation | null> {
  try {
    const response = await fetch(`/api/convocations/${convocationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // const error = await response.json()
      // throw new Error(error.message || 'Erreur lors du marquage de la convocation comme lue')
      return null
    }

    const convocation = await response.json()
    return convocation
  } catch (error) {
    console.error('Erreur lors du marquage de la convocation comme lue:', error)
    // throw error
    return null
  }
}

// Envoyer une convocation par email
export async function sendConvocationEmail(convocationId: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/convocations/${convocationId}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // const error = await response.json()
      // throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email')
      return false
    }

    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    // throw error
    return false
  }
}

// Envoyer des convocations en masse pour une session
export async function sendBulkConvocations(sessionId: number, membreIds: number[]): Promise<boolean> {
  try {
    const response = await fetch(`/api/convocations/session/${sessionId}/send-bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ membreIds }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de l\'envoi des convocations')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi des convocations:', error)
    throw error
  }
}

// Exporter les types pour utilisation dans d'autres fichiers
export type { ConvocationData, Convocation }

