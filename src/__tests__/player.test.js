/**
 * Tests unitaires pour le système de vies du Player
 * Teste les dégâts, l'invincibilité et la mort
 */
import { Player } from '../src/player.js';
import * as THREE from 'three';

// Mock de la scène et caméra
const mockScene = {
  add: jest.fn(),
  remove: jest.fn()
};

const mockCamera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);

describe('Player - Lives System', () => {
  let player;

  beforeEach(() => {
    player = new Player(mockCamera, mockScene);
  });

  test('devrait initialiser avec 3 vies', () => {
    expect(player.lives).toBe(3);
    expect(player.maxLives).toBe(3);
    expect(player.isAlive).toBe(true);
  });

  test('devrait perdre une vie quand frappé', () => {
    const stillAlive = player.takeDamage(50);

    expect(player.lives).toBe(2);
    expect(stillAlive).toBe(true);
  });

  test('devrait activer l\'invincibilité après dégât', () => {
    player.takeDamage(50);

    expect(player.invincibilityTime).toBeGreaterThan(0);
    expect(player.isInvincible()).toBe(true);
  });

  test('ne devrait pas prendre de dégâts si invincible', () => {
    player.takeDamage(50); // -1 vie
    const livesAfterFirst = player.lives;

    player.takeDamage(50); // Devrait être ignoré

    expect(player.lives).toBe(livesAfterFirst);
  });

  test('devrait mourir quand les vies atteignent 0', () => {
    player.lives = 1;
    const stillAlive = player.takeDamage(50);

    expect(player.lives).toBe(0);
    expect(stillAlive).toBe(false);
    expect(player.isAlive).toBe(false);
  });

  test('l\'invincibilité devrait décrémenter avec le temps', () => {
    player.takeDamage(50);
    const initialTime = player.invincibilityTime;

    player.update(1); // 1 seconde

    expect(player.invincibilityTime).toBeLessThan(initialTime);
  });

  test('devrait cesser d\'être invincible après 3 secondes', () => {
    player.takeDamage(50);
    player.update(3.5); // 3.5 secondes

    expect(player.invincibilityTime).toBeLessThanOrEqual(0);
    expect(player.isInvincible()).toBe(false);
  });
});

describe('Player - Shield System', () => {
  let player;

  beforeEach(() => {
    player = new Player(mockCamera, mockScene);
  });

  test('le bouclier devrait absorber les dégâts', () => {
    player.shieldActive = true;
    player.shieldHealth = 100;

    const absorbed = player.damageShield(50);

    expect(absorbed).toBe(true);
    expect(player.shieldHealth).toBe(50);
  });

  test('le bouclier devrait se désactiver quand détruit', () => {
    player.shieldActive = true;
    player.shieldHealth = 30;

    player.damageShield(50);

    expect(player.shieldActive).toBe(false);
  });

  test('les dégâts ne devraient pas être absorbés sans bouclier', () => {
    player.shieldActive = false;

    const absorbed = player.damageShield(50);

    expect(absorbed).toBe(false);
  });

  test('avec bouclier, takeDamage ne devrait pas perdre de vie', () => {
    player.shieldActive = true;
    player.shieldHealth = 100;
    const initialLives = player.lives;

    player.takeDamage(50);

    expect(player.lives).toBe(initialLives);
  });
});

describe('Player - PowerUp System', () => {
  let player;

  beforeEach(() => {
    player = new Player(mockCamera, mockScene);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('devrait activer le triple tir', () => {
    player.activatePowerUp('triple_shot');

    expect(player.tripleShot).toBe(true);
    expect(player.activePowerUps['triple_shot']).toBeDefined();
  });

  test('devrait augmenter la cadence de tir', () => {
    const initialFireRate = player.fireRate;
    player.activatePowerUp('fire_rate');

    expect(player.fireRate).toBeGreaterThan(initialFireRate);
  });

  test('devrait activer le bouclier', () => {
    player.activatePowerUp('shield');

    expect(player.shieldActive).toBe(true);
    expect(player.shieldHealth).toBe(100);
  });

  test('devrait désactiver le powerup après 10 secondes', () => {
    player.activatePowerUp('triple_shot');
    expect(player.tripleShot).toBe(true);

    jest.advanceTimersByTime(10100); // 10.1 secondes

    expect(player.tripleShot).toBe(false);
  });
});
