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

    const session = await prisma.session.findUnique({
      where: { id_session: id },
      include: {
        ordresDuJour: true,
        participations: { include: { membre: true } },
        convocations: { include: { membre: true } },
        procesVerbal: true,
      },
    })

    if (!session) {
      return NextResponse.json({ message: 'Session non trouvée' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Erreur GET session:', error)
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
    const { date_session, lieu, president, ordresDuJour } = body

    const updated = await prisma.session.update({
      where: { id_session: id },
      data: {
        ...(date_session ? { date_session: new Date(date_session) } : {}),
        ...(lieu ? { lieu } : {}),
        ...(president ? { president } : {}),
        ...(Array.isArray(ordresDuJour)
          ? {
              ordresDuJour: {
                deleteMany: {},
                create: ordresDuJour.map((o: any, index: number) => ({
                  titre_point: o.titre_point,
                  description_point: o.description_point,
                  ordre_affichage: index,
                })),
              },
            }
          : {}),
      },
      include: { ordresDuJour: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erreur PUT session:', error)
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

    await prisma.session.delete({ where: { id_session: id } })
    return NextResponse.json({ message: 'Session supprimée' })
  } catch (error) {
    console.error('Erreur DELETE session:', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}



