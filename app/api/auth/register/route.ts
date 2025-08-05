import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from 'lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, prenom, email, fonction, password, profil_utilisateur } = body

    // Validation des champs requis
    if (!nom || !prenom || !email || !fonction || !password) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.membre.findFirst({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer le nouveau membre
    const newMembre = await prisma.membre.create({
      data: {
        nom,
        prenom,
        email,
        fonction,
        mot_de_passe: hashedPassword,
        profil_utilisateur: profil_utilisateur || 'admin'
      }
    })

    // Retourner les informations du membre (sans le mot de passe)
    const { mot_de_passe, ...membreWithoutPassword } = newMembre

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        membre: membreWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 