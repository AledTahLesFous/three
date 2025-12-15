/**
 * Tests unitaires pour la classe Enemy
 * Teste les points de vie, les dégâts et la destruction
 */
import { Enemy } from '../enemy.js';
import * as THREE from 'three';

// Mock de la scène THREE
const mockScene = {
  add: jest.fn(),
  remove: jest.fn()
};

// Mock minimal de Player utilisé par Enemy (pour getPosition / velocity)
const mockPlayer = {
  getPosition: () => new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0)
};

describe('Enemy - Système de vie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devrait initialiser avec des points de vie positifs', () => {
    const enemy = new Enemy(mockScene, mockPlayer, Enemy.TYPES.NORMAL);

    expect(enemy.hp).toBeGreaterThan(0);
    expect(enemy.maxHp).toBe(enemy.hp);
    expect(enemy.mesh).toBeTruthy();
    expect(mockScene.add).toHaveBeenCalled();
  });

  test('takeDamage devrait réduire les points de vie sans détruire immédiatement', () => {
    const enemy = new Enemy(mockScene, mockPlayer, Enemy.TYPES.LIGHT);
    const initialHp = enemy.hp;

    const destroyed = enemy.takeDamage(10);

    expect(enemy.hp).toBe(initialHp - 10);
    expect(destroyed).toBe(false);
    expect(enemy.mesh).not.toBeNull();
  });

  test('takeDamage devrait détruire l\'ennemi quand hp <= 0', () => {
    const enemy = new Enemy(mockScene, mockPlayer, Enemy.TYPES.HEAVY);

    // On applique plus de dégâts que les HP actuels
    const destroyed = enemy.takeDamage(enemy.hp + 10);

    expect(destroyed).toBe(true);
    expect(enemy.mesh).toBeNull();
    expect(mockScene.remove).toHaveBeenCalled();
  });

  test('getHealthPercent devrait retourner un pourcentage entre 0 et 100', () => {
    const enemy = new Enemy(mockScene, mockPlayer, Enemy.TYPES.NORMAL);

    const full = enemy.getHealthPercent();
    expect(full).toBeGreaterThan(0);
    expect(full).toBeLessThanOrEqual(100);

    enemy.takeDamage(enemy.hp + 100);
    const afterDeath = enemy.getHealthPercent();
    expect(afterDeath).toBe(0);
  });
});
