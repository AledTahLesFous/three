export class LevelSystem {
  constructor() {
    this.levels = {
      1: { requiredScore: 4000, timeLimit: null },
      2: { requiredScore: 5000, timeLimit: 60 },
      3: { requiredScore: 7000, timeLimit: 55 },
      4: { requiredScore: 9000, timeLimit: 50 },
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
}
