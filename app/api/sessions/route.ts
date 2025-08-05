import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

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

    return NextResponse.json({session, message: 'Session créée avec succès' }, { status: 201})
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 