import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  const decoded = await verifyToken(token)
  if (!decoded?.userId) return null
  const user = await prisma.membre.findUnique({ where: { id_membre: decoded.userId } })
  return user
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 })
    }

    const convocation = await prisma.convocation.findUnique({
      where: { id_convocation: id },
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
      }
    })

    if (!convocation) {
      return NextResponse.json({ message: 'Convocation non trouvée' }, { status: 404 })
    }

    return NextResponse.json(convocation)
  } catch (error) {
    console.error('Erreur GET convocation:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const me = await getUserFromRequest(request)
    if (!me) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    if (me.profil_utilisateur !== 'admin') return NextResponse.json({ message: 'Interdit' }, { status: 403 })

    const id = parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 })
    }

    const body = await request.json()
    const { statut, reponse_membre } = body

    const updated = await prisma.convocation.update({
      where: { id_convocation: id },
      data: {
        ...(statut ? { statut } : {}),
        ...(reponse_membre ? { reponse_membre } : {}),
        ...(statut === 'lue' ? { date_lecture: new Date() } : {})
      },
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
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erreur PUT convocation:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const me = await getUserFromRequest(request)
    if (!me) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    if (me.profil_utilisateur !== 'admin') return NextResponse.json({ message: 'Interdit' }, { status: 403 })

    const id = parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 })
    }

    await prisma.convocation.delete({ where: { id_convocation: id } })
    return NextResponse.json({ message: 'Convocation supprimée' })
  } catch (error) {
    console.error('Erreur DELETE convocation:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}

