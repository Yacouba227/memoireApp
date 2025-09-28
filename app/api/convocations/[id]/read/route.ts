import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const convocationId = parseInt(params.id, 10)

    // Auth membre (or admin)
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    const decoded = await verifyToken(token)
    if (!decoded?.userId) return NextResponse.json({ message: 'Token invalide' }, { status: 401 })

    const convocation = await prisma.convocation.findUnique({
      where: { id_convocation: convocationId },
    })

    if (!convocation) {
      return NextResponse.json({ message: 'Convocation non trouvée' }, { status: 404 })
    }

    // Only the member who received the convocation or an admin can mark it as read
    if (convocation.membreId !== decoded.userId && decoded.profil_utilisateur !== 'admin') {
        return NextResponse.json({ message: 'Interdit' }, { status: 403 })
    }

    const updatedConvocation = await prisma.convocation.update({
      where: { id_convocation: convocationId },
      data: {
        statut: 'lue',
        date_lecture: new Date(),
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

    return NextResponse.json(updatedConvocation)
  } catch (error) {
    console.error('Erreur lors du marquage de la convocation comme lue:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
