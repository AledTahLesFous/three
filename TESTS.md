# Tests - Space Shooter 3D

## Installation rapide

```bash
npm install
```

## Lancer les tests

### Tests simples (Node.js natif - recommandé)
```bash
npm test
```

Résultat :
```
Testing LevelSystem...

✓ Niveau 1 débloqué par défaut
✓ Niveau 2 verrouillé par défaut
✓ Ne complète pas sans assez de score
✓ Complète avec assez de score
✓ Déverrouille le niveau suivant
✓ Nombre d'ennemis augmente par niveau
✓ Ne complète pas si temps limite dépassé

Tests terminés!
```

### Tests complets avec Jest (optionnel)
```bash
npm run test:full
```

## Structure des tests

### Tests simples (`src/__tests__/simple.test.js`)
- ✅ Pas de dépendances externes
- ✅ Utilise Node.js natif
- ✅ Exécution rapide
- ✅ Facile à déboguer

Tests couverts :
1. LevelSystem - 7 tests
   - Déverrouillage des niveaux
   - Conditions de victoire
   - Score et temps limites
   - Nombre d'ennemis

## Ajouter de nouveaux tests simples

```javascript
// En haut du fichier
import { MonModule } from '../monmodule.js';
import assert from 'assert';

// Ajouter un test
try {
  const result = MonModule.faireSomething();
  assert.strictEqual(result, valeur_attendue);
  console.log(`${colors.green}✓${colors.reset} Description du test`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}
```

## Architecture

```
Space Shooter 3D
├── src/
│   ├── __tests__/
│   │   ├── simple.test.js       # Tests Node.js natifs
│   │   ├── powerup.test.js      # Tests Jest (optionnel)
│   │   ├── player.test.js       # Tests Jest (optionnel)
│   │   ├── levelsystem.test.js  # Tests Jest (optionnel)
│   │   └── ui.test.js           # Tests Jest (optionnel)
│   └── *.js
├── jest.config.cjs              # Config Jest
├── .babelrc.cjs                 # Config Babel
└── package.json
```

## Notes

- **Tests simples** : Recommandés pour ES modules
- **Tests Jest** : Plus avancés mais plus complexes à configurer
- **Coverage** : Peut être exécuté avec `npm run test:full`
- **CI/CD** : Peut utiliser `npm test` dans une pipeline

## Avantages de cette approche

✅ Pas de compilation Babel requise
✅ Utilise les ES modules natifs
✅ Sortie couleur lisible
✅ Facile à étendre
✅ Pas de dépendances supplémentaires
