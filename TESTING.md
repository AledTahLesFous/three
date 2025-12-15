# Tests Unitaires - Space Shooter 3D

## Installation des dépendances de test

```bash
npm install
```

## Lancer les tests

### Tests simples
```bash
npm test
```

### Tests en mode watch (surveillance)
```bash
npm run test:watch
```

### Couverture de code
```bash
npm run test:coverage
```

## Structure des tests

Les tests sont organisés par classe/module :

### 1. **powerup.test.js** 
Tests du système de PowerUps :
- ✅ Création avec le bon type
- ✅ Génération aléatoire de type
- ✅ Décrémentation du temps
- ✅ Désactivation après expiration
- ✅ Couleurs correctes
- ✅ Rotation continue

### 2. **player.test.js**
Tests des systèmes du joueur :

**Lives System**
- ✅ Initialisation avec 3 vies
- ✅ Perte de vies après dégâts
- ✅ Invincibilité après collision
- ✅ Pas de dégâts pendant l'invincibilité
- ✅ Mort à 0 vies
- ✅ Décrémentation de l'invincibilité
- ✅ Fin de l'invincibilité après 3s

**Shield System**
- ✅ Absorption des dégâts
- ✅ Désactivation du bouclier
- ✅ Pas d'absorption sans bouclier
- ✅ Pas de perte de vies avec bouclier

**PowerUp System**
- ✅ Activation du triple tir
- ✅ Augmentation de la cadence
- ✅ Activation du bouclier
- ✅ Désactivation après 10 secondes

### 3. **levelsystem.test.js**
Tests du système de niveaux :
- ✅ Niveau 1 débloqué par défaut
- ✅ Au minimum 4 niveaux
- ✅ Progression de la difficulté
- ✅ Condition de score requise
- ✅ Déverrouillage du niveau suivant
- ✅ Limite de temps
- ✅ Nombre d'ennemis par niveau
- ✅ Gestion des niveaux inexistants

## Coverage rapide

Actuellement ~70% du code métier est couvert par les tests unitaires.

Les tests se concentrent sur :
- Mécanique de jeu (vies, dégâts, invincibilité)
- Système de PowerUps
- Progression par niveaux

Les tests ne couvrent PAS :
- Le rendu 3D (Three.js)
- Les interactions clavier/souris
- L'affichage UI
- Les collisions

## Ajouter de nouveaux tests

Pour ajouter un test, créez un fichier `__tests__/nom.test.js` :

```javascript
describe('MonModule', () => {
  test('devrait faire quelque chose', () => {
    // Arrange
    const module = new MonModule();
    
    // Act
    const result = module.faireQuelqueChose();
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## Notes

- Les tests utilisent **Jest** comme framework
- Mock des objets Three.js (scène, caméra)
- Timers mockés pour tester les asynchrones
- Peut être facilement étendu pour couvrir plus de code
