import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer des membres de test
  const hashedPassword = await hashPassword('password123')

  const membre1 = await prisma.membre.upsert({
    where: { email: 'admin@fast.uam.ne' },
    update: {},
    create: {
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'admin@fast.uam.ne',
      fonction: 'Doyen',
      mot_de_passe: hashedPassword,
      profil_utilisateur: 'admin'
    }
  })

  const membre2 = await prisma.membre.upsert({
    where: { email: 'vice-doyen@fast.uam.ne' },
    update: {},
    create: {
      nom: 'Traoré',
      prenom: 'Fatou',
      email: 'vice-doyen@fast.uam.ne',
      fonction: 'Vice-doyen',
      mot_de_passe: hashedPassword,
      profil_utilisateur: 'membre'
    }
  })

  const membre3 = await prisma.membre.upsert({
    where: { email: 'secretaire@fast.uam.ne' },
    update: {},
    create: {
      nom: 'Koné',
      prenom: 'Moussa',
      email: 'secretaire@fast.uam.ne',
      fonction: 'Secrétaire général',
      mot_de_passe: hashedPassword,
      profil_utilisateur: 'membre'
    }
  })

  // Créer des sessions de test
  const session1 = await prisma.session.create({
    data: {
      date_session: new Date('2024-01-15T10:00:00Z'),
      lieu: 'Salle de réunion A',
      president: 'Dr. Diallo',
      statut: 'planifiée',
      ordresDuJour: {
        create: [
          {
            titre_point: 'Approbation du budget 2024',
            description_point: 'Examen et validation du budget de fonctionnement pour l\'année 2024',
            ordre_affichage: 1
          },
          {
            titre_point: 'Recrutement des enseignants',
            description_point: 'Discussion sur les besoins en recrutement pour les départements',
            ordre_affichage: 2
          }
        ]
      }
    }
  })

  const session2 = await prisma.session.create({
    data: {
      date_session: new Date('2024-01-10T14:00:00Z'),
      lieu: 'Salle de réunion B',
      president: 'Dr. Traoré',
      statut: 'terminée',
      ordresDuJour: {
        create: [
          {
            titre_point: 'Validation des programmes',
            description_point: 'Validation des programmes d\'enseignement pour le semestre',
            ordre_affichage: 1
          }
        ]
      }
    }
  })

  // Créer des participations
  await prisma.participation.createMany({
    data: [
      { membreId: membre1.id_membre, sessionId: session1.id_session, present: true },
      { membreId: membre2.id_membre, sessionId: session1.id_session, present: false },
      { membreId: membre3.id_membre, sessionId: session1.id_session, present: true },
      { membreId: membre1.id_membre, sessionId: session2.id_session, present: true },
      { membreId: membre2.id_membre, sessionId: session2.id_session, present: true },
      { membreId: membre3.id_membre, sessionId: session2.id_session, present: true }
    ]
  })

  // Créer des convocations
  await prisma.convocation.createMany({
    data: [
      { membreId: membre1.id_membre, sessionId: session1.id_session, statut: 'confirmée' },
      { membreId: membre2.id_membre, sessionId: session1.id_session, statut: 'envoyée' },
      { membreId: membre3.id_membre, sessionId: session1.id_session, statut: 'confirmée' },
      { membreId: membre1.id_membre, sessionId: session2.id_session, statut: 'confirmée' },
      { membreId: membre2.id_membre, sessionId: session2.id_session, statut: 'confirmée' },
      { membreId: membre3.id_membre, sessionId: session2.id_session, statut: 'confirmée' }
    ]
  })

  // Créer un procès-verbal pour la session terminée
  await prisma.procesVerbal.create({
    data: {
      contenu_pv: 'Procès-verbal de la session du conseil du 10 janvier 2024\n\nPrésents : Dr. Diallo, Dr. Traoré, Dr. Koné\n\nDécisions prises :\n- Validation des programmes d\'enseignement pour le semestre\n- Approbation du calendrier académique\n\nProchaine session : 15 janvier 2024',
      auteur_pv: 'Dr. Koné',
      sessionId: session2.id_session,
      redacteurId: membre3.id_membre
    }
  })

  console.log('✅ Seeding terminé avec succès !')
  console.log(`📊 Données créées :`)
  console.log(`   - ${await prisma.membre.count()} membres`)
  console.log(`   - ${await prisma.session.count()} sessions`)
  console.log(`   - ${await prisma.procesVerbal.count()} procès-verbaux`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 