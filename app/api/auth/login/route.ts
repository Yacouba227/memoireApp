import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateToken } from 'lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const token = generateToken(user.id_membre, user.email)

    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          id: user.id_membre,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          fonction: user.fonction,
          profil_utilisateur: user.profil_utilisateur
        }
      },
      { status: 200 }
    )

    // Définir le cookie de session
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response
  } catch (error) {
    console.error('Erreur de connexion:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 