# 🔐 Gestionnaire de Mots de Passe

## 📋 **Description**

Le **Gestionnaire de Mots de Passe** est une fonctionnalité sécurisée permettant aux administrateurs de réinitialiser les mots de passe des membres en cas d'oubli. Cette fonctionnalité est accessible uniquement depuis la page des paramètres.

## 🎯 **Fonctionnalités**

### ✅ **Recherche de membres**
- Recherche par nom, prénom, email ou fonction
- Liste filtrée en temps réel
- Affichage des informations complètes du membre

### ✅ **Génération de mots de passe sécurisés**
- Mots de passe de 12 caractères
- Combinaison de lettres (majuscules/minuscules), chiffres et symboles
- Génération automatique avec bouton dédié

### ✅ **Gestion des mots de passe**
- Affichage/masquage du mot de passe généré
- Copie dans le presse-papiers
- Réinitialisation immédiate en base de données

### ✅ **Interface sécurisée**
- Accès restreint aux administrateurs uniquement
- Avertissements de sécurité
- Validation des actions

## 🚀 **Comment utiliser**

### 1. **Accès à la fonctionnalité**
- Connectez-vous en tant qu'**administrateur**
- Allez dans **Paramètres** → **Gestion des Mots de Passe**
- Cliquez sur la carte rouge avec l'icône de cadenas

### 2. **Recherche d'un membre**
- Utilisez la barre de recherche pour trouver le membre
- Tapez le nom, prénom, email ou fonction
- Cliquez sur le membre dans la liste pour le sélectionner

### 3. **Génération du mot de passe**
- Cliquez sur le bouton **🔄** pour générer un mot de passe sécurisé
- Le mot de passe s'affiche dans le champ
- Utilisez l'icône **👁️** pour afficher/masquer le mot de passe

### 4. **Copie du mot de passe**
- Cliquez sur l'icône **📋** pour copier le mot de passe
- Un message de confirmation s'affiche
- Le mot de passe est copié dans le presse-papiers

### 5. **Réinitialisation**
- Vérifiez que le bon membre est sélectionné
- Cliquez sur **"Réinitialiser le mot de passe"**
- Le mot de passe est immédiatement appliqué en base

## ⚠️ **Sécurité et Avertissements**

### 🔒 **Accès restreint**
- **Seuls les administrateurs** peuvent accéder à cette fonctionnalité
- Vérification automatique du rôle utilisateur
- Redirection si accès non autorisé

### ⚠️ **Avertissements importants**
- Le mot de passe est **immédiatement appliqué**
- L'ancien mot de passe devient **invalide instantanément**
- **Communiquez le nouveau mot de passe de manière sécurisée**

### 📧 **Recommandations**
- Envoyez le mot de passe par **email sécurisé**
- Demandez au membre de **changer le mot de passe** lors de la première connexion
- **Ne partagez jamais** le mot de passe par message ou téléphone

## 🛠️ **Structure technique**

### **Fichiers créés :**
- `components/profile/PasswordManagerModal.tsx` - Modal principal
- `app/api/auth/profile/route.ts` - API de mise à jour (déjà existante)

### **Fichiers modifiés :**
- `app/parametres/page.tsx` - Ajout du bouton et de l'état

### **Dépendances :**
- Composants UI existants (Button, Input, Modal)
- Contexte d'authentification
- API de gestion des membres

## 🔧 **Configuration requise**

### **Permissions :**
- Rôle utilisateur : **Administrateur**
- Accès à l'API `/api/membres`
- Droits de modification des membres

### **Fonctionnalités :**
- Base de données Prisma configurée
- Schéma de membres avec champ `mot_de_passe`
- Système d'authentification fonctionnel

## 📱 **Interface utilisateur**

### **Design :**
- **Carte rouge** avec icône de cadenas
- **Layout en deux colonnes** (membres + gestion)
- **Couleurs d'alerte** pour les éléments sensibles
- **Responsive** pour mobile et desktop

### **États visuels :**
- **Sélection** : Bordure bleue autour du membre sélectionné
- **Copie** : Icône verte de confirmation
- **Chargement** : Bouton désactivé avec texte "Réinitialisation..."
- **Erreur** : Messages d'erreur avec toast

## 🚨 **Gestion des erreurs**

### **Erreurs courantes :**
- **Membre non trouvé** : Vérifiez la recherche
- **Erreur de réinitialisation** : Vérifiez les permissions
- **Erreur de copie** : Vérifiez l'accès au presse-papiers

### **Solutions :**
- Rechargez la page en cas d'erreur
- Vérifiez votre rôle d'administrateur
- Contactez le support technique si nécessaire

## 🔄 **Maintenance et mises à jour**

### **Futures améliorations :**
- **Envoi automatique d'email** avec le nouveau mot de passe
- **Historique des réinitialisations** pour audit
- **Expiration automatique** des mots de passe temporaires
- **Notifications** aux membres lors de la réinitialisation

### **Monitoring :**
- Logs des réinitialisations
- Alertes de sécurité
- Statistiques d'utilisation

## 📞 **Support**

Pour toute question ou problème avec cette fonctionnalité :
- Vérifiez d'abord que vous êtes connecté en tant qu'administrateur
- Consultez les logs d'erreur dans la console
- Contactez l'équipe technique si le problème persiste

---

**⚠️ Important :** Cette fonctionnalité donne accès aux mots de passe des utilisateurs. Utilisez-la avec précaution et respectez les bonnes pratiques de sécurité.
