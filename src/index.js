import * as THREE from 'three';
import { Player } from './player.js';
import { createScene } from './scene.js';
import { Enemies } from './enemies.js';
import { LevelSystem } from './utils.js';

// Level system
const levelSystem = new LevelSystem();
let currentLevel = 1;

// Score + Chrono
let score = 0;
let time = 0;

// HUD elements
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const levelEl = document.getElementById('level');
const levelCompleteHUD = document.getElementById('levelComplete');
const levelCompleteMessage = document.getElementById('levelCompleteMessage');
const nextLevelBtn = document.getElementById('nextLevelBtn');

levelEl.textContent = `Niveau : ${currentLevel}`;

// Pause variable
let isPaused = false;

// Scene
const scene = createScene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 2000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crosshair
const crosshair = document.createElement('div');
crosshair.id = 'crosshair';
document.body.appendChild(crosshair);

// Player
const player = new Player(camera, scene);

// Enemies
let enemies = new Enemies(scene, player, 20);

// Clock
const clock = new THREE.Clock();

// Collision bullet ↔ enemy
function handleCollisions() {
  player.bullets.forEach(bullet => {
    enemies.enemies.forEach(enemy => {
      if (!enemy.mesh || !bullet.mesh) return;

      if (bullet.mesh.position.distanceTo(enemy.mesh.position) < enemy.radius + 0.5) {

        enemy.takeDamage(50);
        bullet.destroy();

        if (enemy.hp <= 0) {
          score += 100;
          scoreEl.textContent = `Score : ${score}`;
        }
      }
    });
  });
}

// Level check
function checkLevelStatus() {
  const result = levelSystem.isLevelComplete(currentLevel, score, time);

  if (result.success) {
    isPaused = true;

    levelSystem.unlockLevel(result.nextLevel);

    levelCompleteMessage.textContent =
      `Score : ${score} — Temps : ${time.toFixed(1)}s`;

    levelCompleteHUD.classList.remove("hidden");
  }
}

// Next level button
nextLevelBtn.onclick = () => {
  currentLevel++;
  levelEl.textContent = `Niveau : ${currentLevel}`;

  // Reset stats
  score = 0;
  time = 0;
  scoreEl.textContent = "Score : 0";
  timerEl.textContent = "Temps : 0s";

  // Reset HUD
  levelCompleteHUD.classList.add("hidden");

  // Reset enemies
  enemies.clear();
  enemies = new Enemies(scene, player, 20 + currentLevel * 10);

  // Resume game
  isPaused = false;
};

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (isPaused) {
    renderer.render(scene, camera);
    return;
  }

  const delta = clock.getDelta();

  time += delta;
  timerEl.textContent = `Temps : ${time.toFixed(1)}s`;

  player.update(delta);
  enemies.update(delta);

  handleCollisions();
  checkLevelStatus();

  renderer.render(scene, camera);
}

animate();
