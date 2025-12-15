import * as THREE from 'three';

/**
 * Classe Enemy - Représente un astéroïde hostile généré aléatoirement
 * Types : LIGHT (1 coup), NORMAL (2-3 coups), HEAVY (4-5 coups)
 */
export class Enemy {
  static TYPES = {
    LIGHT: 'light',
    NORMAL: 'normal',
    HEAVY: 'heavy'
  };

  static CONFIG = {
    light: {
      radius: () => THREE.MathUtils.randFloat(0.8, 2),
      hpMultiplier: 1,
      speedMultiplier: 1.3,
      color: 0x00ff00, // Vert
    },
    normal: {
      radius: () => THREE.MathUtils.randFloat(1.5, 3),
      hpMultiplier: 2.5,
      speedMultiplier: 1,
      color: 0xffffff, // Blanc
    },
    heavy: {
      radius: () => THREE.MathUtils.randFloat(3, 6),
      hpMultiplier: 4,
      speedMultiplier: 0.6,
      color: 0xff6600, // Orange
    }
  };

  constructor(scene, player, type = null) {
    this.scene = scene;
    this.player = player;

    // Déterminer le type d'ennemi
    this.type = type || this.getRandomType();
    const config = Enemy.CONFIG[this.type];

    // Paramètres
    this.radius = config.radius();
    this.baseHp = THREE.MathUtils.randInt(40, 80); // HP de base
    this.hp = this.baseHp * config.hpMultiplier;
    this.maxHp = this.hp;
    this.speed = THREE.MathUtils.randFloat(15, 25) * config.speedMultiplier;
    this.color = config.color;

    // Données pour la création visuelle
    this.damageFlashTime = 0;
    this.flashDuration = 0.1;

    // Création de la géométrie de l'astéroïde
    const geometry = new THREE.IcosahedronGeometry(this.radius, 2);
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.8,
      metalness: this.type === 'heavy' ? 0.5 : 0.2,
      emissive: this.type === 'heavy' ? 0x333300 : 0,
      emissiveIntensity: this.type === 'heavy' ? 0.5 : 0,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.originalMaterial = material;

    // Position aléatoire loin du player
    this.mesh.position.set(
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 400
    );

    // Rotation initiale aléatoire
    this.mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Vitesse de rotation basée sur le type
    this.rotationSpeed = this.type === 'heavy' ? 0.005 : 0.015;

    scene.add(this.mesh);
  }

  getRandomType() {
    const random = Math.random();
    if (random < 0.6) return Enemy.TYPES.LIGHT;
    if (random < 0.9) return Enemy.TYPES.NORMAL;
    return Enemy.TYPES.HEAVY;
  }

  // Mise à jour à chaque frame
  update(delta) {
    if (!this.mesh) return;

    // Calculer la direction vers le joueur avec lissage
    const playerPos = this.player.getPosition();
    const toPlayer = new THREE.Vector3()
      .subVectors(playerPos, this.mesh.position)
      .normalize();

    // Ajouter un peu de prédiction pour les ennemis lourds
    if (this.type === 'heavy') {
      const playerVel = this.player.velocity || new THREE.Vector3();
      toPlayer.add(playerVel.clone().normalize().multiplyScalar(0.2));
      toPlayer.normalize();
    }

    // Déplacement vers le joueur
    this.mesh.position.add(toPlayer.multiplyScalar(this.speed * delta));

    // Rotation continue avec variation selon le type
    this.mesh.rotation.x += this.rotationSpeed;
    this.mesh.rotation.y += this.rotationSpeed * 1.5;

    // Gestion du clignotement de dégâts
    if (this.damageFlashTime > 0) {
      this.damageFlashTime -= delta;
      const flashIntensity = (this.damageFlashTime / this.flashDuration);
      this.mesh.material.emissive.setHex(0xff3333);
      this.mesh.material.emissiveIntensity = flashIntensity * 0.8;
    } else {
      if (this.type === 'heavy') {
        this.mesh.material.emissiveIntensity = 0.5;
      }
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.damageFlashTime = this.flashDuration;

    if (this.hp <= 0) {
      this.destroy();
      return true; // Enemy destroyed
    }
    return false; // Enemy still alive
  }

  getHealthPercent() {
    return Math.max(0, (this.hp / this.maxHp) * 100);
  }

  destroy() {
    if (!this.mesh) return;
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
}
