import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 })
    }

    const user = await prisma.membre.findUnique({ where: { id_membre: decoded.userId } })
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 })
    }

    const { mot_de_passe, ...userWithoutPassword } = user as any

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Erreur auth/me:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}


