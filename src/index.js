import * as THREE from 'three';
import { Player } from './player.js';
import { createScene } from './scene.js';
import { Enemies } from './enemies.js';
import { LevelSystem } from './utils.js';
import { PowerUpManager } from './powerupmanager.js';
import { PowerUpUI } from './powerupui.js';
import { LivesUI } from './livesui.js';
import { GameOverUI } from './gameoverul.js';
import { Menu } from './menu.js';

// ============ ÉTAT DU JEU ============
let gameMode = null;
let isGameStarted = false;
const levelSystem = new LevelSystem();
let currentLevel = 1;
let score = 0;
let time = 0;
let waveTime = 0;
let isPaused = false;

// ============ HUD ELEMENTS ============
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const levelEl = document.getElementById('level');
const levelCompleteHUD = document.getElementById('levelComplete');
const levelCompleteMessage = document.getElementById('levelCompleteMessage');
const nextLevelBtn = document.getElementById('nextLevelBtn');

// ============ THREE.JS SETUP ============
const scene = createScene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 2000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const crosshair = document.createElement('div');
crosshair.id = 'crosshair';
document.body.appendChild(crosshair);

// ============ PLAYER & REARVIEW ============
const player = new Player(camera, scene);

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

// ============ GAME SYSTEMS ============
let enemies = null;
const powerupManager = new PowerUpManager(scene, player);
const powerupUI = new PowerUpUI();
const livesUI = new LivesUI();
const gameOverUI = new GameOverUI();
const clock = new THREE.Clock();

// ============ MENU ============
const menu = new Menu();
menu.onModeSelected = (mode) => {
  startGame(mode);
};

// ============ GAME FUNCTIONS ============

function startGame(mode) {
  isGameStarted = true;
  gameMode = mode;
  score = 0;
  time = 0;
  waveTime = 0;
  currentLevel = 1;
  
  scoreEl.textContent = `Score : 0`;
  timerEl.textContent = `Temps : 0s`;
  
  if (mode === 'normal') {
    levelEl.textContent = `Niveau : ${currentLevel}`;
    levelEl.style.display = 'block';
    enemies = new Enemies(scene, player, levelSystem.getEnemyCount(currentLevel), currentLevel);
    player.lives = player.maxLives;
    livesUI.updateLives(player.lives, player.maxLives);
  } else if (mode === 'playground') {
    levelEl.textContent = `Vague : 1`;
    levelEl.style.display = 'block';
    enemies = new Enemies(scene, player, 15, 1);
    player.lives = 999;
    livesUI.updateLives(player.lives, player.maxLives);
  }
  
  levelCompleteHUD.classList.add('hidden');
  gameOverUI.hide();
  isPaused = false;
}

function resetLevel() {
  if (gameMode === 'normal') {
    currentLevel++;
    levelEl.textContent = `Niveau : ${currentLevel}`;
  } else if (gameMode === 'playground') {
    currentLevel++;
    levelEl.textContent = `Vague : ${currentLevel}`;
  }
  
  score = 0;
  time = 0;
  scoreEl.textContent = "Score : 0";
  timerEl.textContent = "Temps : 0s";
  
  levelCompleteHUD.classList.add("hidden");
  
  enemies.clear();
  
  if (gameMode === 'normal') {
    enemies = new Enemies(scene, player, levelSystem.getEnemyCount(currentLevel), currentLevel);
  } else {
    const waveEnemies = 15 + Math.floor((currentLevel - 1) * 3);
    enemies = new Enemies(scene, player, waveEnemies, currentLevel);
  }
  
  powerupManager.clear();
  powerupUI.clear();
  
  player.tripleShot = false;
  player.baseFireRate = 2;
  player.fireRate = 2;
  player.shieldActive = false;
  player.shieldHealth = 0;
  player.activePowerUps = {};
  player.powerupTimers = {};
  player.invincibilityTime = 0;
  
  gameOverUI.hide();
  isPaused = false;
}

function handleCollisions() {
  if (!enemies) return;
  
  // Collision balle ↔ ennemi
  player.bullets.forEach(bullet => {
    enemies.enemies.forEach(enemy => {
      if (!enemy.mesh || !bullet.mesh) return;

      if (bullet.mesh.position.distanceTo(enemy.mesh.position) < enemy.radius + 0.5) {
        const destroyed = enemy.takeDamage(50);
        bullet.destroy();

        if (destroyed) {
          let points = 50;
          if (enemy.type === 'normal') points = 100;
          else if (enemy.type === 'heavy') points = 200;
          
          score += points;
          scoreEl.textContent = `Score : ${score}`;
        }
      }
    });
  });

  // Collision astéroïde ↔ joueur
  const playerPos = player.getPosition();
  enemies.enemies.forEach(enemy => {
    if (!enemy.mesh) return;
    const distance = playerPos.distanceTo(enemy.mesh.position);
    if (distance < 5 && !player.isInvincible()) {
      const stillAlive = player.takeDamage(50);
      
      if (!stillAlive && gameMode === 'normal') {
        isPaused = true;
        gameOverUI.show(score, time);
      }
    }
  });
}

function checkLevelStatus() {
  if (gameMode !== 'normal' || !enemies) return;

  const result = levelSystem.isLevelComplete(currentLevel, score, time);
  if (result.success) {
    isPaused = true;
    levelSystem.unlockLevel(result.nextLevel);
    levelCompleteMessage.textContent = `Score : ${score} — Temps : ${time.toFixed(1)}s`;
    levelCompleteHUD.classList.remove("hidden");
  }
}

function updateHUD() {
  if (!isGameStarted) return;
  
  timerEl.textContent = `Temps : ${time.toFixed(1)}s`;
  
  if (gameMode === 'playground') {
    waveTime += clock.getDelta();
    if (waveTime > 60) {
      currentLevel++;
      levelEl.textContent = `Vague : ${currentLevel}`;
      waveTime = 0;
    }
  }
}

// ============ EVENT LISTENERS ============

gameOverUI.onReplay = () => {
  menu.show();
};

nextLevelBtn.onclick = () => {
  resetLevel();
};

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ ANIMATION LOOP ============

function animate() {
  requestAnimationFrame(animate);

  if (!isGameStarted) {
    renderer.render(scene, camera);
    return;
  }

  if (isPaused) {
    renderer.render(scene, camera);
    return;
  }

  const delta = clock.getDelta();
  time += delta;

  player.update(delta);
  if (enemies) {
    enemies.update(delta);
  }
  powerupManager.update(delta);

  handleCollisions();
  checkLevelStatus();
  updateHUD();

  powerupUI.updatePowerUps(player.activePowerUps);
  livesUI.updateLives(player.lives, player.maxLives);

  if (player.isInvincible()) {
    const blinkAmount = Math.sin(player.invincibilityTime * Math.PI * 3) * 0.5 + 0.5;
    crosshair.style.opacity = 0.3 + blinkAmount * 0.7;
  } else {
    crosshair.style.opacity = '1';
  }

  renderer.render(scene, camera);

  player.updateRearviewCamera();
  rearviewRenderer.render(scene, rearviewCamera);
}

// ============ STARTUP ============
menu.show();
animate();
