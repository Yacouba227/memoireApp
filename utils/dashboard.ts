import { getAllSessions } from './session'
import { getAllMembres } from './membre'
import { getAllProcesVerbaux } from './procesVerbal'

export interface DashboardStats {
  sessionsPlanifiees: number
  membresActifs: number
  procesVerbaux: number
  sessionsTerminees: number
  sessionsEnCours: number
}

export interface RecentSession {
  id_session: number
  date_session: string
  lieu: string
  president: string
  statut: string
}

// Récupérer les statistiques du dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [sessions, membres, procesVerbaux] = await Promise.all([
      getAllSessions(),
      getAllMembres(),
      getAllProcesVerbaux()
    ])

    const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifiée').length
    const sessionsTerminees = sessions.filter(s => s.statut === 'terminée').length
    const sessionsEnCours = sessions.filter(s => s.statut === 'en_cours').length

    return {
      sessionsPlanifiees,
      membresActifs: membres.length,
      procesVerbaux: procesVerbaux.length,
      sessionsTerminees,
      sessionsEnCours
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return {
      sessionsPlanifiees: 0,
      membresActifs: 0,
      procesVerbaux: 0,
      sessionsTerminees: 0,
      sessionsEnCours: 0
    }
  }
}

// Récupérer les sessions récentes
export async function getRecentSessions(limit: number = 5): Promise<RecentSession[]> {
  try {
    const sessions = await getAllSessions()
    
    // Trier par date de création (les plus récentes en premier)
    const sortedSessions = sessions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .map(session => ({
        id_session: session.id_session,
        date_session: session.date_session,
        lieu: session.lieu,
        president: session.president,
        statut: session.statut
      }))

    return sortedSessions
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions récentes:', error)
    return []
  }
} 