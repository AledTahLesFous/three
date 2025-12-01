import * as THREE from 'three';

export class Bullet {
  constructor(scene, position, direction) {
    this.scene = scene;
    this.speed = 100; // très rapide pour être crédible
    this.lifeTime = 2; // durée de vie en secondes

    // Géométrie longue pour être bien visible
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);

    // Position et orientation
    this.mesh.position.copy(position);
    // Orienter la "longueur" du cylindre dans la direction du tir
    this.mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );

    this.direction = direction.clone().normalize();
    this.elapsed = 0;

    scene.add(this.mesh);
  }

  update(delta) {
    if (!this.mesh) return;

    // Avancer
    this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed * delta));

    // Timer de vie
    this.elapsed += delta;
    if (this.elapsed > this.lifeTime) {
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
