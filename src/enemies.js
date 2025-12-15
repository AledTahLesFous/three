import { Enemy } from './enemy.js';
import * as THREE from 'three';

/**
 * Classe Enemies - Gère la collection d'astéroïdes hostiles avec difficulté variable
 * Génère des ennemis de types différents selon le niveau de difficulté
 */
export class Enemies {
  constructor(scene, player, count = 20, difficultyLevel = 1) {
    this.scene = scene;
    this.player = player;
    this.enemies = [];
    this.difficultyLevel = difficultyLevel;
    this.spawnDistance = 150;
    this.spawnRange = 350;

    // Création des ennemis initiaux selon la difficulté
    for (let i = 0; i < count; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    // Déterminer le type d'ennemi selon la difficulté
    const type = this.getEnemyType();

    // Générer une position aléatoire autour du joueur
    const playerPos = this.player.getPosition();
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * 200;
    const distance = this.spawnDistance + Math.random() * (this.spawnRange - this.spawnDistance);

    const pos = new THREE.Vector3(
      playerPos.x + Math.cos(angle) * distance,
      playerPos.y + elevation,
      playerPos.z + Math.sin(angle) * distance
    );

    const enemy = new Enemy(this.scene, this.player, type);
    enemy.mesh.position.copy(pos);
    this.enemies.push(enemy);
  }

  getEnemyType() {
    // Plus le niveau augmente, plus il y a d'ennemis puissants
    const heavyChance = Math.min(0.3, 0.05 * this.difficultyLevel);
    const normalChance = 0.4 + (0.1 * this.difficultyLevel);
    
    const random = Math.random();
    if (random < heavyChance) return Enemy.TYPES.HEAVY;
    if (random < heavyChance + normalChance) return Enemy.TYPES.NORMAL;
    return Enemy.TYPES.LIGHT;
  }

  clear() {
    this.enemies.forEach(e => e.destroy());
    this.enemies = [];
  }

  update(delta) {
    // Mise à jour de tous les ennemis
    this.enemies.forEach(enemy => enemy.update(delta));

    // Supprimer les ennemis détruits
    this.enemies = this.enemies.filter(enemy => enemy.mesh !== null);
  }

  // Pour les modes spécifiques
  updateForMode(delta, config) {
    this.update(delta);

    // Mode normal : maintenir un nombre constant
    if (config.mode === 'normal') {
      while (this.enemies.length < config.maxEnemies) {
        this.spawnEnemy();
      }
    }
    // Mode playground : augmenter progressivement
    else if (config.mode === 'playground') {
      const waveProgress = config.waveProgress || 0;
      const targetCount = config.baseEnemies + Math.floor(waveProgress * 0.5);
      
      while (this.enemies.length < targetCount) {
        this.spawnEnemy();
      }
    }
  }
}
