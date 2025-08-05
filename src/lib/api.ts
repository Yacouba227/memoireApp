const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Authentification
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(response.token)
    return response
  }

  async register(userData: {
    nom: string
    prenom: string
    email: string
    password: string
    profil_utilisateur: string
  }) {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    this.setToken(response.token)
    return response
  }

  async getMe() {
    return this.request<any>('/auth/me')
  }

  // Membres
  async getMembres() {
    return this.request<any[]>('/membres')
  }

  async getMembre(id: number) {
    return this.request<any>(`/membres/${id}`)
  }

  async createMembre(membreData: any) {
    return this.request<any>('/membres', {
      method: 'POST',
      body: JSON.stringify(membreData),
    })
  }

  async updateMembre(id: number, membreData: any) {
    return this.request<any>(`/membres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(membreData),
    })
  }

  async deleteMembre(id: number) {
    return this.request<void>(`/membres/${id}`, {
      method: 'DELETE',
    })
  }

  // Sessions
  async getSessions(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)

    const query = searchParams.toString()
    const endpoint = query ? `/sessions?${query}` : '/sessions'
    return this.request<any[]>(endpoint)
  }

  async getSession(id: number) {
    return this.request<any>(`/sessions/${id}`)
  }

  async createSession(sessionData: any) {
    return this.request<any>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
  }

  async updateSession(id: number, sessionData: any) {
    return this.request<any>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    })
  }

  async deleteSession(id: number) {
    return this.request<void>(`/sessions/${id}`, {
      method: 'DELETE',
    })
  }

  async addParticipation(sessionId: number, participationData: any) {
    return this.request<any>(`/sessions/${sessionId}/participations`, {
      method: 'POST',
      body: JSON.stringify(participationData),
    })
  }

  // Procès-verbaux
  async getProcesVerbaux(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const query = searchParams.toString()
    const endpoint = query ? `/proces-verbaux?${query}` : '/proces-verbaux'
    return this.request<any[]>(endpoint)
  }

  async getProcesVerbal(id: number) {
    return this.request<any>(`/proces-verbaux/${id}`)
  }

  async getProcesVerbalBySession(sessionId: number) {
    return this.request<any>(`/proces-verbaux/session/${sessionId}`)
  }

  async createProcesVerbal(procesVerbalData: any) {
    return this.request<any>('/proces-verbaux', {
      method: 'POST',
      body: JSON.stringify(procesVerbalData),
    })
  }

  async updateProcesVerbal(id: number, procesVerbalData: any) {
    return this.request<any>(`/proces-verbaux/${id}`, {
      method: 'PUT',
      body: JSON.stringify(procesVerbalData),
    })
  }

  async deleteProcesVerbal(id: number) {
    return this.request<void>(`/proces-verbaux/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL) 