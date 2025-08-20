import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Fonction pour envoyer un email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Vérifier que les variables d'environnement sont configurées
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Configuration SMTP manquante')
      return false
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Version texte sans HTML
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email envoyé:', info.messageId)
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return false
  }
}

// Fonction pour envoyer un email de test
export async function sendTestEmail(to: string): Promise<boolean> {
  return sendEmail({
    to,
    subject: 'Test - Plateforme FAST',
    html: `
      <h2>Test de configuration email</h2>
      <p>Ceci est un email de test pour vérifier la configuration SMTP.</p>
      <p>Si vous recevez cet email, la configuration est correcte.</p>
      <p>Cordialement,<br>L'équipe FAST</p>
    `
  })
}

// Fonction pour envoyer une notification de convocation
export async function sendConvocationNotification(
  membreEmail: string,
  membreNom: string,
  membrePrenom: string,
  sessionDate: string,
  sessionLieu: string,
  sessionPresident: string
): Promise<boolean> {
  return sendEmail({
    to: membreEmail,
    subject: `Convocation - Session du ${new Date(sessionDate).toLocaleDateString('fr-FR')}`,
    html: `
      <h2>Convocation à la session</h2>
      <p>Bonjour ${membrePrenom} ${membreNom},</p>
      <p>Vous êtes convoqué(e) à la session du conseil qui se tiendra :</p>
      <ul>
        <li><strong>Date :</strong> ${new Date(sessionDate).toLocaleString('fr-FR')}</li>
        <li><strong>Lieu :</strong> ${sessionLieu}</li>
        <li><strong>Président :</strong> ${sessionPresident}</li>
      </ul>
      <p>Merci de confirmer votre présence.</p>
      <p>Cordialement,<br>L'équipe administrative</p>
    `
  })
}

// Fonction pour envoyer une notification de rappel
export async function sendReminderNotification(
  membreEmail: string,
  membreNom: string,
  membrePrenom: string,
  sessionDate: string,
  sessionLieu: string
): Promise<boolean> {
  return sendEmail({
    to: membreEmail,
    subject: `Rappel - Session du ${new Date(sessionDate).toLocaleDateString('fr-FR')}`,
    html: `
      <h2>Rappel de session</h2>
      <p>Bonjour ${membrePrenom} ${membreNom},</p>
      <p>Ceci est un rappel pour la session du conseil qui se tiendra :</p>
      <ul>
        <li><strong>Date :</strong> ${new Date(sessionDate).toLocaleString('fr-FR')}</li>
        <li><strong>Lieu :</strong> ${sessionLieu}</li>
      </ul>
      <p>Merci de confirmer votre présence si ce n'est pas déjà fait.</p>
      <p>Cordialement,<br>L'équipe administrative</p>
    `
  })
}

