/**
 * Classe LevelSystem - Gère la progression par niveaux
 * Chaque niveau a un score minimum requis et un temps limite optionnel
 * Permet de configurer la difficulté progressive du jeu
 */
export class LevelSystem {
  constructor() {
    this.levels = {
      1: { requiredScore: 2000, timeLimit: null, enemyCount: 20 },
      2: { requiredScore: 4000, timeLimit: 120, enemyCount: 30 },
      3: { requiredScore: 6000, timeLimit: 100, enemyCount: 40 },
      4: { requiredScore: 8000, timeLimit: 80, enemyCount: 50 },
      5: { requiredScore: 10000, timeLimit: 60, enemyCount: 60 },
    };

    this.unlockedLevels = [1];
  }

  isLevelUnlocked(level) {
    return this.unlockedLevels.includes(level);
  }

  isLevelComplete(level, score, time) {
    const data = this.levels[level];

    if (!data) return { success: false };

    if (score < data.requiredScore) return { success: false };
    if (data.timeLimit !== null && time > data.timeLimit) return { success: false };

    return {
      success: true,
      nextLevel: level + 1
    };
  }

  unlockLevel(level) {
    if (!this.unlockedLevels.includes(level)) {
      this.unlockedLevels.push(level);
    }
  }

  getEnemyCount(level) {
    return this.levels[level]?.enemyCount || 20;
  }
}
