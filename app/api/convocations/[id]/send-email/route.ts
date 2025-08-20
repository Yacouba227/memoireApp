import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'
import { sendEmail } from 'lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth admin
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 })
    const decoded = await verifyToken(token)
    if (!decoded?.userId) return NextResponse.json({ message: 'Token invalide' }, { status: 401 })

    const me = await prisma.membre.findUnique({ where: { id_membre: decoded.userId } })
    if (!me || me.profil_utilisateur !== 'admin') {
      return NextResponse.json({ message: 'Interdit' }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'ID invalide' }, { status: 400 })
    }

    const convocation = await prisma.convocation.findUnique({
      where: { id_convocation: id },
      include: {
        session: true,
        membre: true
      }
    })

    if (!convocation) {
      return NextResponse.json({ message: 'Convocation non trouvée' }, { status: 404 })
    }

    // Envoyer l'email
    const emailSent = await sendEmail({
      to: convocation.membre.email,
      subject: `Convocation - Session du ${new Date(convocation.session.date_session).toLocaleDateString('fr-FR')}`,
      html: `
        <h2>Convocation à la session</h2>
        <p>Bonjour ${convocation.membre.prenom} ${convocation.membre.nom},</p>
        <p>Vous êtes convoqué(e) à la session du conseil qui se tiendra :</p>
        <ul>
          <li><strong>Date :</strong> ${new Date(convocation.session.date_session).toLocaleString('fr-FR')}</li>
          <li><strong>Lieu :</strong> ${convocation.session.lieu}</li>
          <li><strong>Président :</strong> ${convocation.session.president}</li>
        </ul>
        <p>Merci de confirmer votre présence.</p>
        <p>Cordialement,<br>L'équipe administrative</p>
      `
    })

    if (emailSent) {
      // Mettre à jour le statut de la convocation
      await prisma.convocation.update({
        where: { id_convocation: id },
        data: { statut: 'envoyée' }
      })

      return NextResponse.json({ message: 'Email envoyé avec succès' })
    } else {
      return NextResponse.json({ message: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

