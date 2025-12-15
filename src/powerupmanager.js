import { PowerUp } from './powerup.js';
import * as THREE from 'three';

/**
 * Classe PowerUpManager - Gère la génération et la récolte des bonus
 * Génère des PowerUps aléatoirement et détecte les collisions avec le joueur
 */
export class PowerUpManager {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.powerups = [];
    this.spawnInterval = 5; // spawn d'un bonus toutes les 5 secondes
    this.timeSinceLastSpawn = 0;
    this.spawnDistance = 150; // distance de spawn autour du joueur
  }

  spawnPowerUp() {
    const playerPos = this.player.getPosition();
    
    // Position aléatoire autour du joueur
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * 60;
    const distance = 80 + Math.random() * 100;
    
    const pos = new THREE.Vector3(
      playerPos.x + Math.cos(angle) * distance,
      playerPos.y + elevation,
      playerPos.z + Math.sin(angle) * distance
    );

    const powerup = new PowerUp(this.scene, pos);
    this.powerups.push(powerup);
  }

  update(delta) {
    // Générer un nouveau bonus tous les 5 secondes
    this.timeSinceLastSpawn += delta;
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
      this.spawnPowerUp();
      this.timeSinceLastSpawn = 0;
    }

    // Mettre à jour tous les powerups
    this.powerups.forEach(powerup => powerup.update(delta));

    // Supprimer les powerups inactifs
    this.powerups = this.powerups.filter(p => p.active);

    // Vérifier les collisions avec le joueur
    this.handleCollisions();
  }

  handleCollisions() {
    this.powerups.forEach(powerup => {
      if (!powerup.mesh) return;

      const playerPos = this.player.getPosition();
      const distance = playerPos.distanceTo(powerup.mesh.position);

      // Rayon de récolte : 5 unités
      if (distance < 5) {
        this.player.activatePowerUp(powerup.type);
        powerup.destroy();
      }
    });
  }

  clear() {
    this.powerups.forEach(p => p.destroy());
    this.powerups = [];
  }
}
