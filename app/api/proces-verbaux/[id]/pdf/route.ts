import { NextRequest, NextResponse } from 'next/server'
import { prisma } from 'lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { message: 'ID invalide' },
        { status: 400 }
      )
    }

    const procesVerbal = await prisma.procesVerbal.findUnique({
      where: { id_pv: id },
      include: {
        session: true,
        redacteur: {
          select: {
            id_membre: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    })

    if (!procesVerbal) {
      return NextResponse.json(
        { message: 'Procès-verbal non trouvé' },
        { status: 404 }
      )
    }

    // Générer le contenu HTML du PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Procès-verbal - Session ${procesVerbal.session?.date_session ? new Date(procesVerbal.session.date_session).toLocaleDateString('fr-FR') : ''}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          .info-section {
            margin-bottom: 30px;
          }
          .info-item {
            margin-bottom: 10px;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          .content {
            margin-top: 30px;
            text-align: justify;
          }
          .footer {
            margin-top: 50px;
            text-align: right;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">PROCÈS-VERBAL</div>
          <div class="subtitle">Conseil de la Faculté des Sciences et Techniques</div>
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <span class="label">Session du :</span>
            <span>${procesVerbal.session?.date_session ? new Date(procesVerbal.session.date_session).toLocaleDateString('fr-FR') : 'Non spécifié'}</span>
          </div>
          <div class="info-item">
            <span class="label">Lieu :</span>
            <span>${procesVerbal.session?.lieu || 'Non spécifié'}</span>
          </div>
          <div class="info-item">
            <span class="label">Président :</span>
            <span>${procesVerbal.session?.president || 'Non spécifié'}</span>
          </div>
          <div class="info-item">
            <span class="label">Rédacteur :</span>
            <span>${procesVerbal.auteur_pv}</span>
          </div>
          <div class="info-item">
            <span class="label">Date de rédaction :</span>
            <span>${new Date(procesVerbal.date_redaction).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div class="content">
          ${procesVerbal.contenu_pv.replace(/\n/g, '<br>')}
        </div>
        
        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>Plateforme FAST - Université Abdou Moumouni</p>
        </div>
      </body>
      </html>
    `

    // Pour une vraie génération de PDF, vous devriez utiliser une bibliothèque comme puppeteer
    // Pour l'instant, on retourne le HTML qui peut être converti en PDF côté client
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="proces-verbal-${id}.html"`
      }
    })
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
} 