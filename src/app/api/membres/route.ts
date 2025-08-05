import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const membres = await prisma.membre.findMany({
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
      },
      orderBy: {
        nom: 'asc'
      }
    })

    return NextResponse.json(membres)
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nom, prenom, email, fonction, mot_de_passe, profil_utilisateur } = await request.json()

    if (!nom || !prenom || !email || !fonction || !mot_de_passe) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingMembre = await prisma.membre.findUnique({
      where: { email }
    })

    if (existingMembre) {
      return NextResponse.json(
        { message: 'Un membre avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(mot_de_passe)

    const membre = await prisma.membre.create({
      data: {
        nom,
        prenom,
        email,
        fonction,
        mot_de_passe: hashedPassword,
        profil_utilisateur: profil_utilisateur || 'membre'
      }
    })

    // Retourner le membre sans le mot de passe
    const { mot_de_passe: _, ...membreSansMotDePasse } = membre

    return NextResponse.json(membreSansMotDePasse, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du membre:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 