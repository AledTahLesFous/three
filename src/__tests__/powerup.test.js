/**
 * Tests unitaires pour la classe PowerUp
 * Teste la création, les timers et la destruction
 */
import { PowerUp } from '../src/powerup.js';
import * as THREE from 'three';

// Mock de la scène THREE
const mockScene = {
  add: jest.fn(),
  remove: jest.fn()
};

describe('PowerUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('devrait créer un PowerUp avec le bon type', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const powerup = new PowerUp(mockScene, position, 'triple_shot');

    expect(powerup.type).toBe('triple_shot');
    expect(powerup.active).toBe(true);
    expect(powerup.timeRemaining).toBe(PowerUp.DURATION);
    expect(mockScene.add).toHaveBeenCalled();
  });

  test('devrait générer un type aléatoire si non spécifié', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const powerup = new PowerUp(mockScene, position);

    const validTypes = Object.values(PowerUp.TYPES);
    expect(validTypes).toContain(powerup.type);
  });

  test('devrait décrémenter le timeRemaining lors de update', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const powerup = new PowerUp(mockScene, position, 'fire_rate');
    const initialTime = powerup.timeRemaining;

    powerup.update(1); // 1 seconde

    expect(powerup.timeRemaining).toBe(initialTime - 1);
  });

  test('devrait se désactiver quand timeRemaining <= 0', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const powerup = new PowerUp(mockScene, position, 'shield');

    powerup.update(PowerUp.DURATION + 1);

    expect(powerup.active).toBe(false);
    expect(powerup.mesh).toBeNull();
  });

  test('devrait avoir la bonne couleur selon le type', () => {
    const position = new THREE.Vector3(0, 0, 0);
    
    const tripleShot = new PowerUp(mockScene, position, 'triple_shot');
    expect(tripleShot.mesh.material.color.getHex()).toBe(PowerUp.COLORS.triple_shot);

    const fireRate = new PowerUp(mockScene, position, 'fire_rate');
    expect(fireRate.mesh.material.color.getHex()).toBe(PowerUp.COLORS.fire_rate);

    const shield = new PowerUp(mockScene, position, 'shield');
    expect(shield.mesh.material.color.getHex()).toBe(PowerUp.COLORS.shield);
  });

  test('devrait tourner continuellement', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const powerup = new PowerUp(mockScene, position, 'triple_shot');

    const initialRotX = powerup.mesh.rotation.x;
    const initialRotY = powerup.mesh.rotation.y;

    powerup.update(1);

    expect(powerup.mesh.rotation.x).toBeGreaterThan(initialRotX);
    expect(powerup.mesh.rotation.y).toBeGreaterThan(initialRotY);
  });
});
