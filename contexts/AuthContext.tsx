'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Membre } from 'utils/membre' // Importer le type Membre

// Suppression de l'interface User locale, on utilisera Membre de utils/membre.ts
/*
interface User {
  id_membre: number
  nom: string
  prenom: string
  email: string
  fonction: string
  profil_utilisateur: string
  photo_url?: string | null
}
*/

interface AuthContextType {
  user: Membre | null // Utiliser Membre au lieu de User
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Membre) => void // Utiliser Membre au lieu de User
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Membre | null>(null) // Utiliser Membre au lieu de User
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'utilisateur courant via le cookie de session
    const init = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Email ou mot de passe incorrect')
    }
    // Récupérer l'utilisateur courant après connexion
    const me = await fetch('/api/auth/me', { cache: 'no-store' })
    if (me.ok) {
      const data = await me.json()
      setUser(data.user)
    }
  }

  const register = async (userData: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "Erreur d'inscription")
    }
    // auto login après inscription
    await login(userData.email, userData.password)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const updateUser = (userData: Membre) => {
    setUser(userData)
  }

  const value = { user, login, register, logout, updateUser, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}