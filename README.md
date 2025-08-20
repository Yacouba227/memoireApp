# Plateforme FAST - Gestion des Sessions du Conseil

Une plateforme moderne pour la gestion des sessions du conseil, des ordres du jour, des convocations et des procès-verbaux.

## Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec JWT
- Gestion des rôles (admin/membre)
- Protection des routes

### 📅 Sessions
- Création et gestion des sessions
- Planification avec date, lieu et président
- Statuts (planifiée, en cours, terminée)

### 📋 Ordres du jour
- Gestion des points à traiter
- Numérotation et ordre d'affichage
- Durée estimée et responsable par point
- Interface dédiée pour la consultation

### 📧 Convocations
- Création de convocations par session
- Envoi automatique d'emails
- Suivi des statuts (envoyée, lue, confirmée)
- Envoi en masse pour une session

### 📄 Procès-verbaux
- Rédaction et gestion des PV
- Génération de PDF
- Association aux sessions

### 👥 Membres
- Gestion des membres du conseil
- Profils utilisateur
- Informations de contact

## Installation

1. Clonez le repository
```bash
git clone <repository-url>
cd memoireCode
```

2. Installez les dépendances
```bash
npm install
```

3. Configurez la base de données
```bash
npx prisma db push
npx prisma generate
```

4. Configurez les variables d'environnement
Créez un fichier `.env` avec les variables suivantes :

```env
# Configuration de la base de données
DATABASE_URL="file:./dev.db"

# Configuration JWT
NEXTAUTH_SECRET="your-secret-key-here"

# Configuration SMTP pour l'envoi d'emails
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Configuration Email (Gmail)

Pour utiliser Gmail comme serveur SMTP :

1. Activez l'authentification à 2 facteurs sur votre compte Gmail
2. Allez dans les paramètres de sécurité de votre compte Google
3. Générez un "mot de passe d'application"
4. Utilisez ce mot de passe comme `SMTP_PASS`

5. Lancez le serveur de développement
```bash
npm run dev
```

## Structure de la base de données

### Modèles principaux

- **MEMBRES** : Gestion des utilisateurs et membres du conseil
- **SESSIONS** : Sessions du conseil avec informations de planification
- **ORDRES_JOUR** : Points à traiter lors des sessions
- **CONVOCATIONS** : Invitations envoyées aux membres
- **PROCES_VERBAUX** : Comptes-rendus des sessions
- **PARTICIPATIONS** : Présence des membres aux sessions
- **DOCUMENTS** : Fichiers associés aux sessions

## Utilisation

### Pour les administrateurs
1. Créez des sessions avec leurs ordres du jour
2. Invitez les membres via les convocations
3. Gérez les procès-verbaux
4. Suivez les présences

### Pour les membres
1. Consultez les sessions et ordres du jour
2. Recevez les convocations par email
3. Accédez aux procès-verbaux

## Technologies utilisées

- **Frontend** : Next.js 15, React 18, TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : SQLite avec Prisma
- **Authentification** : JWT
- **Email** : Nodemailer
- **UI Components** : Lucide React Icons

## Scripts disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Build pour la production
npm run start        # Démarre le serveur de production
npm run lint         # Vérifie le code avec ESLint
npm run db:generate  # Génère le client Prisma
npm run db:push      # Synchronise la base de données
npm run db:studio    # Ouvre Prisma Studio
```

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. 