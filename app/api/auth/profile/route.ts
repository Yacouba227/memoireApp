import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'lib/auth'

const prisma = new PrismaClient()

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id_membre, nom, prenom, email, fonction, mot_de_passe } = body

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.membre.findUnique({
      where: { id_membre: parseInt(id_membre) }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      nom,
      prenom,
      email,
      fonction
    }

    // Si un nouveau mot de passe est fourni, le hasher
    if (mot_de_passe && mot_de_passe.trim() !== '') {
      updateData.mot_de_passe = await hashPassword(mot_de_passe)
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.membre.update({
      where: { id_membre: parseInt(id_membre) },
      data: updateData,
      select: {
        id_membre: true,
        nom: true,
        prenom: true,
        email: true,
        fonction: true,
        profil_utilisateur: true,
        role_membre: true
      }
    })

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}
