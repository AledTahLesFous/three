import { Enemies } from '../enemies.js';
import * as THREE from 'three';

/**
 * Tests for the Enemies collection manager
 */

describe('Enemies', () => {
  let mockScene;
  let mockPlayer;

  beforeEach(() => {
    mockScene = {
      add: jest.fn(),
      remove: jest.fn()
    };

    mockPlayer = {
      getPosition: () => new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0)
    };
  });

  test('should create the requested number of enemies', () => {
    const enemies = new Enemies(mockScene, mockPlayer, 5, 1);

    expect(enemies.enemies.length).toBe(5);
  });

  test('clear should destroy all enemies and empty the array', () => {
    const enemies = new Enemies(mockScene, mockPlayer, 3, 1);

    const destroySpies = enemies.enemies.map(e => jest.spyOn(e, 'destroy'));

    enemies.clear();

    destroySpies.forEach(spy => {
      expect(spy).toHaveBeenCalled();
    });
    expect(enemies.enemies.length).toBe(0);
  });

  test('update should remove enemies whose mesh has been destroyed', () => {
    const enemies = new Enemies(mockScene, mockPlayer, 3, 1);

    // Manually "destroy" the first enemy mesh
    enemies.enemies[0].mesh = null;

    enemies.update(0.016);

    expect(enemies.enemies.length).toBe(2);
  });

  test('getEnemyType should always return a valid type', () => {
    const enemies = new Enemies(mockScene, mockPlayer, 0, 5);

    for (let i = 0; i < 20; i++) {
      const type = enemies.getEnemyType();
      expect(['light', 'normal', 'heavy']).toContain(type);
    }
  });
});
