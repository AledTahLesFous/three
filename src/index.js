import * as THREE from 'three';
import { Player } from './player.js';
import { createScene } from './scene.js';
import { Enemies } from './enemies.js';

// --- Création de la scène spatiale ---
const scene = createScene();

// --- Caméra ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Croix au centre ---
const crosshair = document.createElement('div');
crosshair.id = 'crosshair';
document.body.appendChild(crosshair);

// --- Player ---
const player = new Player(camera, scene);

// --- Ennemis ---
const enemies = new Enemies(scene, player, 20);

// --- Clock pour delta time ---
const clock = new THREE.Clock();

// --- Gestion des collisions bullets ↔ ennemis ---
function handleCollisions() {
  player.bullets.forEach(bullet => {
    enemies.enemies.forEach(enemy => {
      if (!enemy.mesh || !bullet.mesh) return;

      const distance = bullet.mesh.position.distanceTo(enemy.mesh.position);
      if (distance < enemy.radius + 0.5) { // 0.5 = rayon approximatif du bullet
        enemy.takeDamage(50); // dégâts
        bullet.destroy();
      }
    });
  });
}

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Mise à jour du player
  player.update(delta);

  // Mise à jour des ennemis
  enemies.update(delta);

  // Vérification collisions
  handleCollisions();

  // Rendu
  renderer.render(scene, camera);
}

animate();
