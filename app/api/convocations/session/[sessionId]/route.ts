import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId)
    if (Number.isNaN(sessionId)) {
      return NextResponse.json({ message: 'ID de session invalide' }, { status: 400 })
    }

    const convocations = await prisma.convocation.findMany({
      where: { sessionId },
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

