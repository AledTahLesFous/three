import { Enemy } from './enemy.js';
import * as THREE from 'three';

/**
 * Classe Enemies - Gère la collection d'astéroïdes hostiles
 * Génère aléatoirement des ennemis autour du joueur et maintient un nombre constant
 */
export class Enemies {
  constructor(scene, player, count = 20) {
    this.scene = scene;
    this.player = player;
    this.enemies = [];
    this.spawnDistance = 200; // distance minimale autour du joueur pour spawn
    this.spawnRange = 400;    // distance maximale de spawn

    // Création des ennemis initiaux
    for (let i = 0; i < count; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    // Générer une position aléatoire autour du joueur mais pas trop proche
    const playerPos = this.player.getPosition();
    const pos = new THREE.Vector3(
      playerPos.x + THREE.MathUtils.randFloatSpread(this.spawnRange) + Math.sign(Math.random() - 0.5) * this.spawnDistance,
      playerPos.y + THREE.MathUtils.randFloatSpread(this.spawnRange) + Math.sign(Math.random() - 0.5) * this.spawnDistance,
      playerPos.z + THREE.MathUtils.randFloatSpread(this.spawnRange) + Math.sign(Math.random() - 0.5) * this.spawnDistance
    );

    const enemy = new Enemy(this.scene, this.player);
    enemy.mesh.position.copy(pos);
    this.enemies.push(enemy);
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

    // Garder un nombre constant d'ennemis
    while (this.enemies.length < 20) {
      this.spawnEnemy();
    }
  }
}
