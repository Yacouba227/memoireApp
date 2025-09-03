import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { hashPassword } from 'lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    const membre = await prisma.membre.findUnique({
      where: { id_membre: id },
      include: {
        participations: {
          include: {
            session: true
          }
        },
        convocations: {
          include: {
            session: true
          }
        },
        procesVerbaux: true
      }
    })

    if (!membre) {
      return NextResponse.json(
        { message: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    // Retourner le membre sans le mot de passe
    const { mot_de_passe: _, ...membreSansMotDePasse } = membre

    return NextResponse.json(membreSansMotDePasse)
  } catch (error) {
    console.error('Erreur lors de la récupération du membre:', error)
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
    const id = parseInt(await params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    const { nom, prenom, email, fonction, mot_de_passe, profil_utilisateur, photo_url } = await request.json()

    // Vérifier si le membre existe
    const existingMembre = await prisma.membre.findUnique({
      where: { id_membre: id }
    })

    if (!existingMembre) {
      return NextResponse.json(
        { message: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      nom,
      prenom,
      email,
      fonction,
      profil_utilisateur,
      photo_url
    }

    // Hasher le mot de passe seulement s'il est fourni
    if (mot_de_passe) {
      updateData.mot_de_passe = await hashPassword(mot_de_passe)
    }

    const membre = await prisma.membre.update({
      where: { id_membre: id },
      data: updateData
    })

    // Retourner le membre sans le mot de passe
    const { mot_de_passe: _, ...membreSansMotDePasse } = membre

    return NextResponse.json(membreSansMotDePasse)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du membre:', error)
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
    const id = parseInt(await params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    // Vérifier si le membre existe
    const existingMembre = await prisma.membre.findUnique({
      where: { id_membre: id }
    })

    if (!existingMembre) {
      return NextResponse.json(
        { message: 'Membre non trouvé' },
        { status: 404 }
      )
    }

    await prisma.membre.delete({
      where: { id_membre: id }
    })

    return NextResponse.json({ message: 'Membre supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 