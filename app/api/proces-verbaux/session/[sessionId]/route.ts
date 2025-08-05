import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = parseInt(params.sessionId)
    
    if (isNaN(sessionId)) {
      return NextResponse.json(
        { message: 'ID de session invalide' },
        { status: 400 }
      )
    }

    const procesVerbal = await prisma.procesVerbal.findUnique({
      where: { sessionId },
      include: {
        session: true,
        redacteur: {
          select: {
            id_membre: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    })

    if (!procesVerbal) {
      return NextResponse.json(
        { message: 'Procès-verbal non trouvé pour cette session' },
        { status: 404 }
      )
    }

    return NextResponse.json(procesVerbal)
  } catch (error) {
    console.error('Erreur lors de la récupération du procès-verbal:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 