import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    const procesVerbal = await prisma.procesVerbal.findUnique({
      where: { id_pv: id },
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
        { message: 'Procès-verbal non trouvé' },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    const { contenu_pv, auteur_pv } = await request.json()

    // Vérifier si le procès-verbal existe
    const existingPV = await prisma.procesVerbal.findUnique({
      where: { id_pv: id }
    })

    if (!existingPV) {
      return NextResponse.json(
        { message: 'Procès-verbal non trouvé' },
        { status: 404 }
      )
    }

    const procesVerbal = await prisma.procesVerbal.update({
      where: { id_pv: id },
      data: {
        contenu_pv,
        auteur_pv
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

    return NextResponse.json(procesVerbal)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du procès-verbal:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    // Vérifier si le procès-verbal existe
    const existingPV = await prisma.procesVerbal.findUnique({
      where: { id_pv: id }
    })

    if (!existingPV) {
      return NextResponse.json(
        { message: 'Procès-verbal non trouvé' },
        { status: 404 }
      )
    }

    await prisma.procesVerbal.delete({
      where: { id_pv: id }
    })

    return NextResponse.json({ message: 'Procès-verbal supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du procès-verbal:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 