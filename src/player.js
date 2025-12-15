import * as THREE from 'three';
import { Bullet } from './bullet.js';

export class Player {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.speed = 40;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.add(this.pitchObject);
    this.pitchObject.add(this.camera);

    this.scene.add(this.yawObject);

    // Sensibilité de la souris
    this.sensitivity = 0.003;

    // État des touches
    this.keys = {};
    window.addEventListener('keydown', (e) => (this.keys[e.code] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.code] = false));

    // Pointeur lock pour FPS
    document.body.addEventListener('click', () => {
      document.body.requestPointerLock();
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        this.yawObject.rotation.y -= e.movementX * this.sensitivity;
        this.pitchObject.rotation.x -= e.movementY * this.sensitivity;
        this.pitchObject.rotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, this.pitchObject.rotation.x)
        );
      }
    });

    // --- Gestion des tirs automatiques ---
    this.bullets = [];
    this.fireRate = 2; // tirs par seconde
    this.fireCooldown = 0;
  }

  update(delta) {
    // --- Mouvement ---
    this.direction.set(0, 0, 0);
    if (this.keys['KeyW']) this.direction.z -= 1;
    if (this.keys['KeyS']) this.direction.z += 1;
    if (this.keys['KeyA']) this.direction.x -= 1;
    if (this.keys['KeyD']) this.direction.x += 1;
    if (this.keys['Space']) this.direction.y += 1;
    if (this.keys['ShiftLeft']) this.direction.y -= 1;

    this.direction.normalize();
    const move = this.direction.clone().applyQuaternion(this.yawObject.quaternion).multiplyScalar(this.speed * delta);
    this.yawObject.position.add(move);

    // --- Tir automatique ---
    this.fireCooldown -= delta;
    if (this.fireCooldown <= 0) {
      this.fire();
      this.fireCooldown = 1 / this.fireRate;
    }

    // --- Mettre à jour les bullets ---
    this.bullets.forEach(bullet => bullet.update(delta));
    this.bullets = this.bullets.filter(b => b.mesh !== null);
  }

fire() {
  // direction réelle de la caméra (yaw + pitch + inclinaisons)
  const dir = new THREE.Vector3();
  this.camera.getWorldDirection(dir);
  dir.normalize();

  // position du joueur (caméra)
  const basePos = this.camera.getWorldPosition(new THREE.Vector3());

  // Offsets locaux des deux canons (en espace caméra)
  const left = new THREE.Vector3(-0.3, -0.1, -1);
  const right = new THREE.Vector3(0.3, -0.1, -1);

  // Les offsets doivent être transformés dans l'espace du monde via la rotation *de la caméra*
  left.applyQuaternion(this.camera.quaternion);
  right.applyQuaternion(this.camera.quaternion);

  // Création des bullets à la bonne position et dans la bonne direction
  this.bullets.push(new Bullet(this.scene, basePos.clone().add(left), dir.clone()));
  this.bullets.push(new Bullet(this.scene, basePos.clone().add(right), dir.clone()));
}




  getPosition() {
    return this.yawObject.position;
  }
}
