# Plateforme FAST - Gestion des Sessions du Conseil

## 📋 Description

Plateforme web de gestion des sessions du conseil de la Faculté des Sciences et Techniques (FAST) de l'Université Abdou Moumouni (UAM). Cette application permet de numériser l'organisation des réunions du conseil, depuis la planification jusqu'à la rédaction du procès-verbal.

## 🎯 Fonctionnalités principales

- **Gestion des membres** : Ajout, modification et suppression des membres du conseil avec différents rôles
- **Planification des sessions** : Création et gestion des réunions avec date, lieu et président
- **Ordres du jour** : Gestion des points à traiter pour chaque session
- **Convocations** : Envoi et suivi des convocations aux membres
- **Procès-verbaux** : Rédaction et consultation des procès-verbaux après chaque réunion
- **Interface sécurisée** : Authentification et gestion des droits d'accès

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, React 18, TypeScript
- **Styling** : Tailwind CSS
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : JWT avec bcryptjs
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form avec Zod validation

## 📁 Structure du projet

```
plateforme-fast/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Tableau de bord
│   │   ├── sessions/          # Gestion des sessions
│   │   ├── membres/           # Gestion des membres
│   │   ├── proces-verbaux/    # Gestion des PV
│   │   └── login/             # Page de connexion
│   ├── components/            # Composants React
│   │   ├── ui/               # Composants UI réutilisables
│   │   └── layout/           # Composants de mise en page
│   └── lib/                  # Utilitaires et configurations
├── prisma/                   # Schéma de base de données
├── public/                   # Assets statiques
└── package.json
```

## 🚀 Installation et configuration

### Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repository-url>
cd plateforme-fast
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

Créer un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="postgresql://username:password@localhost:5432/plateforme_fast"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configuration de la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# (Optionnel) Ouvrir Prisma Studio pour visualiser les données
npm run db:studio
```

### 5. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📊 Modèle de données (MCD)

### Entités principales

#### 🔹 Membre
- `id_membre` (PK)
- `nom`, `prenom`, `email`, `fonction`
- `mot_de_passe`, `profil_utilisateur`
- Relations : participations, convocations, procès-verbaux

#### 🔹 Session
- `id_session` (PK)
- `date_session`, `lieu`, `president`, `statut`
- Relations : ordres du jour, participations, convocations, procès-verbal

#### 🔹 Ordre_du_jour
- `id_ordre` (PK)
- `titre_point`, `description_point`, `ordre_affichage`
- Relation : session (1:N)

#### 🔹 Convocation
- `id_convocation` (PK)
- `date_envoi`, `statut`
- Relations : membre et session (N:N)

#### 🔹 Proces_Verbal
- `id_pv` (PK)
- `contenu_pv`, `auteur_pv`, `date_redaction`
- Relations : session (1:1), rédacteur (N:1)

## 🎨 Interface utilisateur

### Pages principales

1. **Page d'accueil** (`/`) : Présentation de la plateforme
2. **Connexion** (`/login`) : Authentification des utilisateurs
3. **Tableau de bord** (`/dashboard`) : Vue d'ensemble avec statistiques
4. **Sessions** (`/sessions`) : Liste et gestion des sessions
5. **Membres** (`/membres`) : Gestion des membres du conseil
6. **Procès-verbaux** (`/proces-verbaux`) : Consultation et rédaction des PV

### Composants UI

- **Button** : Boutons avec différentes variantes
- **Input** : Champs de saisie avec validation
- **Card** : Cartes pour organiser le contenu
- **Layout** : Mise en page cohérente avec header

## 🔐 Sécurité

- **Authentification** : JWT avec cookies httpOnly
- **Hachage des mots de passe** : bcryptjs
- **Validation des données** : Zod schemas
- **Protection CSRF** : Intégrée dans Next.js

## 📱 Responsive Design

L'interface est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🚀 Scripts disponibles

```bash
npm run dev          # Développement
npm run build        # Production build
npm run start        # Démarrer en production
npm run lint         # Vérification du code
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma DB
npm run db:studio    # Interface Prisma Studio
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/login` : Connexion utilisateur

### Sessions
- `GET /api/sessions` : Liste des sessions
- `POST /api/sessions` : Créer une session

### Membres
- `GET /api/membres` : Liste des membres
- `POST /api/membres` : Créer un membre

### Procès-verbaux
- `GET /api/proces-verbaux` : Liste des PV
- `POST /api/proces-verbaux` : Créer un PV

## 📝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé dans le cadre d'un mémoire de fin d'études.

## 👥 Auteur

**Halidou** - Étudiant en informatique à l'Université Abdou Moumouni

---

*Plateforme développée pour la Faculté des Sciences et Techniques (FAST) - UAM* 