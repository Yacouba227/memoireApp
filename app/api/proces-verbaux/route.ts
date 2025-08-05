import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

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
    const { id_session, contenu_pv, auteur_pv, date_redaction } = await request.json()

    if (!id_session || !contenu_pv || !auteur_pv) {
      return NextResponse.json(
        { message: 'Session, contenu et auteur requis' },
        { status: 400 }
      )
    }

    // Vérifier si un procès-verbal existe déjà pour cette session
    const existingPV = await prisma.procesVerbal.findFirst({
      where: { sessionId: id_session }
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
        sessionId: id_session,
        redacteurId: 1, // ID par défaut du rédacteur
        date_redaction: date_redaction ? new Date(date_redaction) : new Date()
      },
      include: {
        session: true
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