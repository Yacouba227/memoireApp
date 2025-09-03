interface MembreData {
  nom: string
  prenom: string
  email: string
  fonction: string
  mot_de_passe: string
  profil_utilisateur: string
}

interface Membre extends MembreData {
  id_membre: number
  createdAt: string
  updatedAt: string
  photo_url?: string // Ajout de la propriété photo_url
}

// Créer un nouveau membre
export async function createMembre(data: MembreData): Promise<Membre | null> {
  try {
    const response = await fetch('/api/membres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création du membre')
    }

    const membre = await response.json()
    return membre
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error)
    throw error
  }
}

// Récupérer tous les membres
export async function getAllMembres(): Promise<Membre[]> {
  try {
    const response = await fetch('/api/membres', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la récupération des membres')
    }

    const membres = await response.json()
    return membres
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error)
    throw error
  }
}

// Récupérer un membre par son ID
export async function getMembreById(id: number): Promise<Membre | null> {
  try {
    const response = await fetch(`/api/membres/${id}`, {
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
      throw new Error(error.message || 'Erreur lors de la récupération du membre')
    }

    const membre = await response.json()
    return membre
  } catch (error) {
    console.error('Erreur lors de la récupération du membre:', error)
    throw error
  }
}

// Mettre à jour un membre
export async function updateMembre(id: number, data: Partial<MembreData>): Promise<Membre | null> {
  try {
    const response = await fetch(`/api/membres/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour du membre')
    }

    const membre = await response.json()
    return membre
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error)
    throw error
  }
}

// Supprimer un membre
export async function deleteMembre(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/membres/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la suppression du membre')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error)
    throw error
  }
}

// Exporter les types pour utilisation dans d'autres fichiers
export type { MembreData, Membre } 