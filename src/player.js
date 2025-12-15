import * as THREE from 'three';
import { Bullet } from './bullet.js';

/**
 * Classe Player - Représente le pilote d'un vaisseau spatial en vue FPS
 * Gère la caméra, les mouvements 3D, les tirs automatiques et le rétroviseur
 */
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
    // bind handlers so we can add/remove them if needed
    this._onKeyDown = (e) => { this.keys[e.code] = true; };
    this._onKeyUp = (e) => { this.keys[e.code] = false; };
    // use document listeners (more reliable with pointer lock / focus)
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    // clear keys when window loses focus to avoid stuck keys
    window.addEventListener('blur', () => { this.keys = {}; });

    // Pointeur lock pour FPS
    // Make body focusable so we can focus it on pointer lock and keep receiving keyboard events
    document.body.tabIndex = -1;
    document.body.addEventListener('click', () => {
      document.body.requestPointerLock();
    });

    // ensure the body has focus when pointer lock is active
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === document.body) {
        try { document.body.focus(); } catch (e) {}
      }
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

    // --- PowerUps actifs ---
    this.activePowerUps = {}; // { type: { timeout, timeRemaining } }
    this.powerupTimers = {}; // { type: intervalID }
    this.tripleShot = false;
    this.shieldActive = false;
    this.shieldHealth = 0;
    this.baseFireRate = 2;
    // --- Vies ---
    this.lives = 3;
    this.maxLives = 3;
    this.isAlive = true;
    this.invincibilityTime = 0;
    this.invincibilityDuration = 3; // 3 secondes d'invincibilité

    // --- Rearview mirror camera ---
    this.rearviewCamera = null;
  }

  setRearviewCamera(camera) {
    this.rearviewCamera = camera;
  }

  updateRearviewCamera() {
    if (!this.rearviewCamera) return;
    // Position: at player's position
    this.rearviewCamera.position.copy(this.yawObject.position);
    // Rotation: same as yaw object (includes pitch) but rotated 180° to look behind
    this.rearviewCamera.rotation.order = 'YXZ';
    this.rearviewCamera.rotation.y = this.yawObject.rotation.y + Math.PI;
    this.rearviewCamera.rotation.x = this.pitchObject.rotation.x;
    this.rearviewCamera.rotation.z = 0;
  }

  activatePowerUp(type) {
    switch (type) {
      case 'triple_shot':
        this.tripleShot = true;
        this.activatePowerUpTimer('triple_shot');
        break;
      case 'fire_rate':
        this.baseFireRate = 6; // augmenter la cadence
        this.fireRate = 6;
        this.activatePowerUpTimer('fire_rate');
        break;
      case 'shield':
        this.shieldActive = true;
        this.shieldHealth = 100; // absorbe 100 points de dégâts
        this.activatePowerUpTimer('shield');
        break;
    }
  }

  activatePowerUpTimer(type) {
    const DURATION = 10; // 10 secondes

    if (this.activePowerUps[type]) {
      clearTimeout(this.activePowerUps[type].timeout);
      if (this.powerupTimers[type]) clearInterval(this.powerupTimers[type]);
    }

    // Store powerup with time remaining
    this.activePowerUps[type] = {
      timeRemaining: DURATION,
      timeout: setTimeout(() => {
        this.deactivatePowerUp(type);
      }, DURATION * 1000)
    };

    // Update remaining time every 100ms for smooth bar, but display counts down
    this.powerupTimers[type] = setInterval(() => {
      if (this.activePowerUps[type]) {
        this.activePowerUps[type].timeRemaining -= 0.1;
        if (this.activePowerUps[type].timeRemaining < 0) {
          this.activePowerUps[type].timeRemaining = 0;
        }
      }
    }, 100);
  }

  deactivatePowerUp(type) {
    switch (type) {
      case 'triple_shot':
        this.tripleShot = false;
        break;
      case 'fire_rate':
        this.baseFireRate = 2;
        this.fireRate = 2;
        break;
      case 'shield':
        this.shieldActive = false;
        this.shieldHealth = 0;
        break;
    }
    if (this.powerupTimers[type]) {
      clearInterval(this.powerupTimers[type]);
      delete this.powerupTimers[type];
    }
    delete this.activePowerUps[type];
  }

  damageShield(amount) {
    if (this.shieldActive) {
      this.shieldHealth -= amount;
      if (this.shieldHealth <= 0) {
        this.deactivatePowerUp('shield');
      }
      return true; // dégât absorbé
    }
    return false; // pas de bouclier
  }

  takeDamage(amount) {
    // Si le joueur est invincible, ignorer les dégâts
    if (this.invincibilityTime > 0) {
      return this.isAlive;
    }

    // Si le joueur a un bouclier, il absorbe les dégâts
    if (this.damageShield(amount)) {
      this.invincibilityTime = this.invincibilityDuration;
      return this.isAlive;
    }

    // Sinon, perte de vie
    this.lives -= 1;
    this.invincibilityTime = this.invincibilityDuration; // 3 secondes d'invincibilité après dégât
    
    if (this.lives <= 0) {
      this.lives = 0;
      this.isAlive = false;
    }
    return this.isAlive;
  }

  isInvincible() {
    return this.invincibilityTime > 0;
  }

  update(delta) {
    // Décrémenter l'invincibilité
    if (this.invincibilityTime > 0) {
      this.invincibilityTime -= delta;
    }

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

  if (this.tripleShot) {
    // Triple tir : gauche, centre, droite
    const left = new THREE.Vector3(-0.5, -0.1, -1);
    const center = new THREE.Vector3(0, -0.1, -1);
    const right = new THREE.Vector3(0.5, -0.1, -1);

    left.applyQuaternion(this.camera.quaternion);
    center.applyQuaternion(this.camera.quaternion);
    right.applyQuaternion(this.camera.quaternion);

    this.bullets.push(new Bullet(this.scene, basePos.clone().add(left), dir.clone()));
    this.bullets.push(new Bullet(this.scene, basePos.clone().add(center), dir.clone()));
    this.bullets.push(new Bullet(this.scene, basePos.clone().add(right), dir.clone()));
  } else {
    // Tir normal : deux canons latéraux
    const left = new THREE.Vector3(-0.3, -0.1, -1);
    const right = new THREE.Vector3(0.3, -0.1, -1);

    left.applyQuaternion(this.camera.quaternion);
    right.applyQuaternion(this.camera.quaternion);

    this.bullets.push(new Bullet(this.scene, basePos.clone().add(left), dir.clone()));
    this.bullets.push(new Bullet(this.scene, basePos.clone().add(right), dir.clone()));
  }
}




  getPosition() {
    return this.yawObject.position;
  }
}
