import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const procesVerbaux = await prisma.procesVerbal.findMany({
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
      },
      orderBy: {
        date_redaction: 'desc'
      }
    })

    return NextResponse.json(procesVerbaux)
  } catch (error) {
    console.error('Erreur lors de la récupération des procès-verbaux:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, contenu_pv, auteur_pv, redacteurId } = await request.json()

    if (!sessionId || !contenu_pv || !auteur_pv || !redacteurId) {
      return NextResponse.json(
        { message: 'Session, contenu, auteur et rédacteur requis' },
        { status: 400 }
      )
    }

    // Vérifier si un procès-verbal existe déjà pour cette session
    const existingPV = await prisma.procesVerbal.findUnique({
      where: { sessionId }
    })

    if (existingPV) {
      return NextResponse.json(
        { message: 'Un procès-verbal existe déjà pour cette session' },
        { status: 409 }
      )
    }

    const procesVerbal = await prisma.procesVerbal.create({
      data: {
        contenu_pv,
        auteur_pv,
        sessionId,
        redacteurId
      },
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

    return NextResponse.json(procesVerbal, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du procès-verbal:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 