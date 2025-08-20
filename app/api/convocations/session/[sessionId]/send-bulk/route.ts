import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'
import { verifyToken } from 'lib/auth'
import { sendEmail } from 'lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
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

    const sessionId = parseInt(params.sessionId)
    if (Number.isNaN(sessionId)) {
      return NextResponse.json({ message: 'ID de session invalide' }, { status: 400 })
    }

    const { membreIds } = await request.json()

    if (!Array.isArray(membreIds) || membreIds.length === 0) {
      return NextResponse.json({ message: 'Liste des membres requise' }, { status: 400 })
    }

    // Récupérer la session
    const session = await prisma.session.findUnique({
      where: { id_session: sessionId }
    })

    if (!session) {
      return NextResponse.json({ message: 'Session non trouvée' }, { status: 404 })
    }

    // Récupérer les membres
    const membres = await prisma.membre.findMany({
      where: { id_membre: { in: membreIds } }
    })

    if (membres.length === 0) {
      return NextResponse.json({ message: 'Aucun membre trouvé' }, { status: 404 })
    }

    const results = []

    for (const membre of membres) {
      try {
        // Créer ou mettre à jour la convocation
        const convocation = await prisma.convocation.upsert({
          where: {
            membreId_sessionId: {
              membreId: membre.id_membre,
              sessionId
            }
          },
          update: {
            statut: 'envoyée'
          },
          create: {
            membreId: membre.id_membre,
            sessionId,
            statut: 'envoyée'
          }
        })

        // Envoyer l'email
        const emailSent = await sendEmail({
          to: membre.email,
          subject: `Convocation - Session du ${new Date(session.date_session).toLocaleDateString('fr-FR')}`,
          html: `
            <h2>Convocation à la session</h2>
            <p>Bonjour ${membre.prenom} ${membre.nom},</p>
            <p>Vous êtes convoqué(e) à la session du conseil qui se tiendra :</p>
            <ul>
              <li><strong>Date :</strong> ${new Date(session.date_session).toLocaleString('fr-FR')}</li>
              <li><strong>Lieu :</strong> ${session.lieu}</li>
              <li><strong>Président :</strong> ${session.president}</li>
            </ul>
            <p>Merci de confirmer votre présence.</p>
            <p>Cordialement,<br>L'équipe administrative</p>
          `
        })

        results.push({
          membreId: membre.id_membre,
          email: membre.email,
          convocationId: convocation.id_convocation,
          emailSent
        })
      } catch (error) {
        console.error(`Erreur pour le membre ${membre.id_membre}:`, error)
        results.push({
          membreId: membre.id_membre,
          email: membre.email,
          error: 'Erreur lors du traitement'
        })
      }
    }

    const successCount = results.filter(r => r.emailSent).length
    const errorCount = results.length - successCount

    return NextResponse.json({
      message: `${successCount} convocations envoyées avec succès${errorCount > 0 ? `, ${errorCount} erreurs` : ''}`,
      results
    })
  } catch (error) {
    console.error('Erreur lors de l\'envoi des convocations:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

