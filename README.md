# Ald-short-stories
Un recueil d'histoires fantastisques regroupés sous la forme de courtes histoires. 

# 🔥 Grimoire d'Histoires - Firebase Integration

## 📋 Étapes pour mettre à jour votre site GitHub Pages

### 1. Configurer les règles de sécurité Firebase

Dans Firebase Console, allez dans **Firestore Database** → **Règles** et remplacez par :

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /stories/{story} {
      // Tout le monde peut lire les histoires
      allow read: if true;
      
      // Tout le monde peut créer, modifier et supprimer des histoires
      // Pour une version plus sécurisée, vous devriez ajouter l'authentification
      allow write: if true;
    }
  }
}
```

Cliquez sur **Publier** pour appliquer ces règles.

### 2. Mettre à jour les fichiers sur GitHub

1. **Remplacez** votre fichier `script.js` actuel par le nouveau `script.js`
2. **Remplacez** votre fichier `index.html` actuel par le nouveau `index.html`
3. Gardez votre fichier `styles.css` tel quel (pas de modification nécessaire)

### 3. Vérifier que ça fonctionne

1. Attendez quelques minutes que GitHub Pages se mette à jour
2. Visitez votre site : https://kazei-7.github.io/Ald-short-stories/
3. Créez une histoire test
4. Ouvrez le site dans un autre navigateur ou en navigation privée → vous devriez voir la même histoire !

## ✨ Nouvelles fonctionnalités

- ✅ **Stockage en ligne** : Les histoires sont maintenant sauvegardées dans Firebase
- ✅ **Accessible partout** : N'importe qui peut voir toutes les histoires
- ✅ **Synchronisation automatique** : Les nouvelles histoires apparaissent pour tout le monde
- ✅ **Indicateur de chargement** : Message "Inscription en cours..." pendant la sauvegarde

## 🔒 Sécurité (optionnel - pour plus tard)

Pour l'instant, n'importe qui peut ajouter/supprimer des histoires. Si vous voulez limiter ça :

1. Activez l'authentification Firebase (Google, Email, etc.)
2. Modifiez les règles Firestore pour exiger une authentification
3. Ajoutez un système de connexion au site

## 📊 Surveillance

Pour voir vos données Firebase :
- Firebase Console → Firestore Database
- Vous y verrez toutes les histoires enregistrées

## ❓ Besoin d'aide ?

Si quelque chose ne fonctionne pas :
1. Ouvrez la console du navigateur (F12) pour voir les erreurs
2. Vérifiez que les règles Firestore sont bien configurées
3. Assurez-vous que les fichiers sont bien uploadés sur GitHub

---

**Bon grimoire ! 📖✨**
