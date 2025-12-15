import * as THREE from 'three';
import { Player } from './player.js';
import { createScene } from './scene.js';
import { Enemies } from './enemies.js';
import { LevelSystem } from './utils.js';
import { PowerUpManager } from './powerupmanager.js';
import { PowerUpUI } from './powerupui.js';
import { LivesUI } from './livesui.js';
import { GameOverUI } from './gameoverul.js';

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

// Rearview mirror setup
const rearviewCanvas = document.createElement('canvas');
rearviewCanvas.id = 'rearview';
rearviewCanvas.width = 320;
rearviewCanvas.height = 240;
document.body.appendChild(rearviewCanvas);

const rearviewRenderer = new THREE.WebGLRenderer({ canvas: rearviewCanvas, antialias: true, alpha: true });
rearviewRenderer.setSize(320, 240);
rearviewRenderer.setClearColor(0x000000, 1);

const rearviewCamera = new THREE.PerspectiveCamera(75, 320 / 240, 0.1, 2000);
player.setRearviewCamera(rearviewCamera);

// Enemies
let enemies = new Enemies(scene, player, levelSystem.getEnemyCount(currentLevel));

// PowerUp Manager
const powerupManager = new PowerUpManager(scene, player);

// PowerUp UI
const powerupUI = new PowerUpUI();

// Lives UI
const livesUI = new LivesUI();
livesUI.updateLives(player.lives, player.maxLives);

// Game Over UI
const gameOverUI = new GameOverUI();
gameOverUI.onReplay(() => {
  location.reload(); // Recharger la page pour recommencer
});// Clock
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

  // Collision asteroid ↔ player (avec bouclier et invincibilité)
  const playerPos = player.getPosition();
  enemies.enemies.forEach(enemy => {
    if (!enemy.mesh) return;
    const distance = playerPos.distanceTo(enemy.mesh.position);
    if (distance < 5 && !player.isInvincible()) {
      // Appliquer les dégâts au joueur (gère bouclier ou perte de vie)
      const stillAlive = player.takeDamage(50);
      
      if (!stillAlive) {
        // Game Over
        isPaused = true;
        gameOverUI.show(score, time);
      }
    }
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
  enemies = new Enemies(scene, player, levelSystem.getEnemyCount(currentLevel));

  // Reset powerups
  powerupManager.clear();
  powerupUI.clear();

  // Reset player powerups
  player.tripleShot = false;
  player.baseFireRate = 2;
  player.fireRate = 2;
  player.shieldActive = false;
  player.shieldHealth = 0;
  player.activePowerUps = {};
  player.powerupTimers = {};
  player.invincibilityTime = 0;

  // Hide game over UI if visible
  gameOverUI.hide();

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
  powerupManager.update(delta);

  handleCollisions();
  checkLevelStatus();

  // Update PowerUp UI
  powerupUI.updatePowerUps(player.activePowerUps);

  // Update Lives UI
  livesUI.updateLives(player.lives, player.maxLives);

  // Feedback visuel invincibilité (clignotement du crosshair)
  if (player.isInvincible()) {
    const blinkAmount = Math.sin(player.invincibilityTime * Math.PI * 3) * 0.5 + 0.5;
    crosshair.style.opacity = 0.3 + blinkAmount * 0.7;
  } else {
    crosshair.style.opacity = '1';
  }

  renderer.render(scene, camera);

  // Render rearview
  player.updateRearviewCamera();
  rearviewRenderer.render(scene, rearviewCamera);
}

animate();
