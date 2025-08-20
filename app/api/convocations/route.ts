import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

export async function GET() {
  try {
    const convocations = await prisma.convocation.findMany({
      include: {
        session: true,
        membre: {
          select: {
            id_membre: true,
            nom: true,
            prenom: true,
            email: true,
            fonction: true
          }
        }
      },
      orderBy: {
        date_envoi: 'desc'
      }
    })

    return NextResponse.json(convocations)
  } catch (error) {
    console.error('Erreur lors de la récupération des convocations:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth admin
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    const decoded = await verifyToken(token)
    if (!decoded?.userId) return NextResponse.json({ message: 'Token invalide' }, { status: 401 })

    const me = await prisma.membre.findUnique({ where: { id_membre: decoded.userId } })
    if (!me || me.profil_utilisateur !== 'admin') {
      return NextResponse.json({ message: 'Interdit' }, { status: 403 })
    }

    const { sessionId, membreId, statut } = await request.json()

    if (!sessionId || !membreId) {
      return NextResponse.json(
        { message: 'Session et membre requis' },
        { status: 400 }
      )
    }

    // Vérifier si la convocation existe déjà
    const existingConvocation = await prisma.convocation.findFirst({
      where: {
        sessionId,
        membreId
      }
    })

    if (existingConvocation) {
      return NextResponse.json(
        { message: 'Une convocation existe déjà pour ce membre et cette session' },
        { status: 409 }
      )
    }

    const convocation = await prisma.convocation.create({
      data: {
        sessionId,
        membreId,
        statut: statut || 'envoyée'
      },
      include: {
        session: true,
        membre: {
          select: {
            id_membre: true,
            nom: true,
            prenom: true,
            email: true,
            fonction: true
          }
        }
      }
    })

    return NextResponse.json(convocation, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la convocation:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

