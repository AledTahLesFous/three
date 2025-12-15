import * as THREE from 'three';

/**
 * Classe Enemy - Représente un astéroïde hostile généré aléatoirement
 * Chaque astéroïde poursuit le joueur, a une taille et une vie variées
 */
export class Enemy {
  constructor(scene, player, options = {}) {
    this.scene = scene;
    this.player = player; // Référence au player pour suivre sa position

    // Paramètres
    this.radius = options.radius || THREE.MathUtils.randFloat(1, 5);
    this.hp = options.hp || THREE.MathUtils.randInt(50, 150);
    this.speed = options.speed || THREE.MathUtils.randFloat(15, 25); // rapide mais jouable
    this.color = options.color || Math.random() * 0xffffff;

    // Création de la géométrie de l'astéroïde
    const geometry = new THREE.IcosahedronGeometry(this.radius, 1);
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.8,
      metalness: 0.2,
    });

    this.mesh = new THREE.Mesh(geometry, material);

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

    scene.add(this.mesh);
  }

  // Mise à jour à chaque frame
  update(delta) {
    if (!this.mesh) return;

    // Calculer la direction vers le joueur
    const playerPos = this.player.getPosition();
    const direction = new THREE.Vector3()
      .subVectors(playerPos, this.mesh.position)
      .normalize();

    // Déplacement vers le joueur
    this.mesh.position.add(direction.multiplyScalar(this.speed * delta));

    // Rotation continue pour un effet réaliste
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  destroy() {
    if (!this.mesh) return;
    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.mesh = null;
  }
}
