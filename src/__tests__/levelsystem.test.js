/**
 * Tests unitaires pour le système de niveaux
 * Teste la progression et les conditions de victoire
 */
import { LevelSystem } from '../utils.js';

describe('LevelSystem', () => {
  let levelSystem;

  beforeEach(() => {
    levelSystem = new LevelSystem();
  });

  test('devrait initialiser avec le niveau 1 débloqué', () => {
    expect(levelSystem.isLevelUnlocked(1)).toBe(true);
    expect(levelSystem.isLevelUnlocked(2)).toBe(false);
  });

  test('devrait avoir au minimum 4 niveaux', () => {
    expect(levelSystem.levels[1]).toBeDefined();
    expect(levelSystem.levels[2]).toBeDefined();
    expect(levelSystem.levels[3]).toBeDefined();
    expect(levelSystem.levels[4]).toBeDefined();
  });

  test('devrait augmenter le score requis pour chaque niveau', () => {
    const level1Score = levelSystem.levels[1].requiredScore;
    const level2Score = levelSystem.levels[2].requiredScore;
    const level3Score = levelSystem.levels[3].requiredScore;
    const level4Score = levelSystem.levels[4].requiredScore;

    expect(level2Score).toBeGreaterThan(level1Score);
    expect(level3Score).toBeGreaterThan(level2Score);
    expect(level4Score).toBeGreaterThan(level3Score);
  });

  test('ne devrait pas compléter sans assez de score', () => {
    const result = levelSystem.isLevelComplete(1, 1000, 0);

    expect(result.success).toBe(false);
  });

  test('devrait compléter quand le score est suffisant', () => {
    const result = levelSystem.isLevelComplete(1, 2000, 0);

    expect(result.success).toBe(true);
    expect(result.nextLevel).toBe(2);
  });

  test('devrait déverrouiller le niveau suivant après succès', () => {
    levelSystem.unlockLevel(2);

    expect(levelSystem.isLevelUnlocked(2)).toBe(true);
  });

  test('ne devrait pas compléter si le temps limite est dépassé', () => {
    const result = levelSystem.isLevelComplete(2, 4000, 150); // temps > limite

    expect(result.success).toBe(false);
  });

  test('devrait retourner le nombre d\'ennemis correct', () => {
    const enemies1 = levelSystem.getEnemyCount(1);
    const enemies2 = levelSystem.getEnemyCount(2);
    const enemies3 = levelSystem.getEnemyCount(3);

    expect(enemies1).toBe(20);
    expect(enemies2).toBeGreaterThan(enemies1);
    expect(enemies3).toBeGreaterThan(enemies2);
  });

  test('devrait gérer les niveaux inexistants', () => {
    const result = levelSystem.isLevelComplete(999, 999999, 0);

    expect(result.success).toBe(false);
  });
});
