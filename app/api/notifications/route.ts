import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded?.userId) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 401 })
    }

    const memberId = decoded.userId
    const userProfile = decoded.profil_utilisateur

    if (userProfile !== 'membre') {
      return NextResponse.json({ message: 'Interdit' }, { status: 403 })
    }

    const unreadConvocations = await prisma.convocation.findMany({
      where: {
        membreId: memberId,
        statut: 'envoyée',
        date_lecture: null,
      },
      include: {
        session: true,
      },
    })

    // Format notifications
    const notifications = unreadConvocations.map(convocation => ({
      id: convocation.id_convocation,
      type: 'new_convocation',
      message: `Nouvelle convocation pour la session du ${new Date(convocation.session?.date_session || '').toLocaleDateString('fr-FR')}`,
      createdAt: convocation.createdAt,
      convocationId: convocation.id_convocation,
    }))

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
