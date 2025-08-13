import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        ordresDuJour: true,
        participations: {
          include: {
            membre: true
          }
        },
        convocations: {
          include: {
            membre: true
          }
        },
        procesVerbal: true
      },
      orderBy: {
        date_session: 'desc'
      }
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error)
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

    const { date_session, lieu, president, ordresDuJour } = await request.json()

    if (!date_session || !lieu || !president) {
      return NextResponse.json(
        { message: 'Date, lieu et président requis' },
        { status: 400 }
      )
    }

    const session = await prisma.session.create({
      data: {
        date_session: new Date(date_session),
        lieu,
        president,
        ordresDuJour: {
          create: ordresDuJour.map((ordre: any, index: number) => ({
            titre_point: ordre.titre_point,
            description_point: ordre.description_point,
            ordre_affichage: index
          }))
        }
      },
      include: {
        ordresDuJour: true
      }
    })

    return NextResponse.json(session, { status: 201})
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 