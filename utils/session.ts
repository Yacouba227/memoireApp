
interface OrdreDuJour {
  titre_point: string
  description_point: string
}

interface SessionData {
  date_session: string
  lieu: string
  president: string
  ordresDuJour: OrdreDuJour[]
}

interface Session {
  id: any
  id_session: number
  date_session: string
  lieu: string
  president: string
  createdAt: string
  updatedAt: string
  ordresDuJour?: OrdreDuJour[]
}

// Créer une nouvelle session
export async function createSession(data: SessionData): Promise<Session | null> {
  try {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de la session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error)
    throw error
  }
}

// Récupérer toutes les sessions
export async function getAllSessions(): Promise<Session[]> {
  try {
    const response = await fetch('/api/sessions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération des sessions')
    }

    const sessions = await response.json()
    return sessions
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
    throw error
  }
}

// Récupérer une session par son ID
export async function getSessionById(id: number): Promise<Session | null> {
  try {
    const response = await fetch(`/api/sessions/${id}`, {
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
      throw new Error(error.message || 'Erreur lors de la récupération de la session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Erreur lors de la récupération de la session:', error)
    throw error
  }
}

// Mettre à jour une session
export async function updateSession(id: number, data: Partial<SessionData>): Promise<Session | null> {
  try {
    const response = await fetch(`/api/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de la session')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la session:', error)
    throw error
  }
}

// Supprimer une session
export async function deleteSession(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/sessions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression de la session')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression de la session:', error)
    throw error
  }
}

// Exporter les types pour utilisation dans d'autres fichiers
export type { SessionData, Session, OrdreDuJour }
