import * as THREE from 'three';

export class Player {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.speed = 5;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.add(this.pitchObject);
    this.pitchObject.add(this.camera);

    this.scene.add(this.yawObject);

    // Sensibilité de la souris
    this.sensitivity = 0.002;

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
  }

  update(delta) {
    // Reset direction
    this.direction.set(0, 0, 0);
    if (this.keys['KeyW']) this.direction.z -= 1;
    if (this.keys['KeyS']) this.direction.z += 1;
    if (this.keys['KeyA']) this.direction.x -= 1;
    if (this.keys['KeyD']) this.direction.x += 1;
    if (this.keys['Space']) this.direction.y += 1;
    if (this.keys['ShiftLeft']) this.direction.y -= 1;

    this.direction.normalize();

    // Déplacement relatif à la rotation du joueur
    const move = this.direction.clone().applyQuaternion(this.yawObject.quaternion).multiplyScalar(this.speed * delta);
    this.yawObject.position.add(move);
  }

  getPosition() {
    return this.yawObject.position;
  }
}
