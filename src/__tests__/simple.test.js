/**
 * Tests unitaires simples pour Space Shooter 3D
 * Exécutable avec: node --test src/__tests__/*.test.js
 */

import { LevelSystem } from '../utils.js';
import assert from 'assert';

// Couleurs pour la sortie
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

console.log(`${colors.yellow}Testing LevelSystem...${colors.reset}\n`);

// Tests du LevelSystem
const levelSystem = new LevelSystem();

// Test 1
try {
  assert.strictEqual(levelSystem.isLevelUnlocked(1), true);
  console.log(`${colors.green}✓${colors.reset} Niveau 1 débloqué par défaut`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 2
try {
  assert.strictEqual(levelSystem.isLevelUnlocked(2), false);
  console.log(`${colors.green}✓${colors.reset} Niveau 2 verrouillé par défaut`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 3
try {
  const result = levelSystem.isLevelComplete(1, 1000, 0);
  assert.strictEqual(result.success, false);
  console.log(`${colors.green}✓${colors.reset} Ne complète pas sans assez de score`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 4
try {
  const result = levelSystem.isLevelComplete(1, 2000, 0);
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.nextLevel, 2);
  console.log(`${colors.green}✓${colors.reset} Complète avec assez de score`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 5
try {
  levelSystem.unlockLevel(2);
  assert.strictEqual(levelSystem.isLevelUnlocked(2), true);
  console.log(`${colors.green}✓${colors.reset} Déverrouille le niveau suivant`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 6
try {
  const enemies1 = levelSystem.getEnemyCount(1);
  const enemies2 = levelSystem.getEnemyCount(2);
  assert.strictEqual(enemies1, 20);
  assert.strictEqual(enemies2 > enemies1, true);
  console.log(`${colors.green}✓${colors.reset} Nombre d'ennemis augmente par niveau`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

// Test 7
try {
  const result = levelSystem.isLevelComplete(2, 4000, 150);
  assert.strictEqual(result.success, false);
  console.log(`${colors.green}✓${colors.reset} Ne complète pas si temps limite dépassé`);
} catch (e) {
  console.log(`${colors.red}✗${colors.reset} ${e.message}`);
}

console.log(`\n${colors.yellow}Tests terminés!${colors.reset}`);
