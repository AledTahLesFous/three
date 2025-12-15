import * as THREE from 'three';

/**
 * Classe PowerUp - Représente un bonus apparaissant aléatoirement dans l'espace
 * 3 types : TRIPLE_SHOT (bleu), FIRE_RATE (vert), SHIELD (rouge)
 * Durée : 10 secondes
 */
export class PowerUp {
  static TYPES = {
    TRIPLE_SHOT: 'triple_shot',
    FIRE_RATE: 'fire_rate',
    SHIELD: 'shield'
  };

  static COLORS = {
    triple_shot: 0x0099ff,  // Bleu lumineux
    fire_rate: 0x00ff00,    // Vert lumineux
    shield: 0xff0000        // Rouge lumineux
  };

  static DURATION = 10; // secondes

  constructor(scene, position, type) {
    this.scene = scene;
    this.type = type || this.getRandomType();
    this.active = true;
    this.timeRemaining = PowerUp.DURATION;
    this.rotationSpeed = 3; // radians par seconde

    // Créer le cube lumineux
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: PowerUp.COLORS[this.type],
      emissive: PowerUp.COLORS[this.type],
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.2
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this.mesh.userData.powerupType = this.type;

    // Ajouter un glow avec PointLight
    const light = new THREE.PointLight(PowerUp.COLORS[this.type], 2, 20);
    light.position.copy(position);
    this.light = light;
    this.mesh.add(light);

    this.scene.add(this.mesh);
  }

  getRandomType() {
    const types = Object.values(PowerUp.TYPES);
    return types[Math.floor(Math.random() * types.length)];
  }

  update(delta) {
    if (!this.active || !this.mesh) return;

    // Rotation continue
    this.mesh.rotation.x += this.rotationSpeed * delta;
    this.mesh.rotation.y += this.rotationSpeed * delta;

    // Décrémente le temps
    this.timeRemaining -= delta;

    // Animation de disparition (scaling vers 0)
    if (this.timeRemaining <= 1) {
      const opacity = this.timeRemaining; // 1 à 0
      this.mesh.scale.set(opacity, opacity, opacity);
      this.light.intensity = 2 * opacity;
    }

    // Destruction
    if (this.timeRemaining <= 0) {
      this.destroy();
    }
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh = null;
    }
    this.active = false;
  }
}
