
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

export async function createSession(data: SessionData) {
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
      throw new Error(error.message || 'Erreur inconnue')
    }

    const session = await response.json()
    return session
  } catch (error) {
    console.error('Erreur POST /api/session/post:', error)
    return null
  }
}
