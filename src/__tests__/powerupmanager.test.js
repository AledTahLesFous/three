import { PowerUpManager } from '../powerupmanager.js';
import * as THREE from 'three';

/**
 * Tests for PowerUpManager spawning and collection logic
 */

describe('PowerUpManager', () => {
  let mockScene;
  let mockPlayer;

  beforeEach(() => {
    mockScene = {
      add: jest.fn(),
      remove: jest.fn()
    };

    mockPlayer = {
      getPosition: () => new THREE.Vector3(0, 0, 0),
      activatePowerUp: jest.fn()
    };
  });

  test('spawnPowerUp should create a powerup around the player', () => {
    const manager = new PowerUpManager(mockScene, mockPlayer);

    manager.spawnPowerUp();

    expect(manager.powerups.length).toBe(1);
    const powerup = manager.powerups[0];
    expect(powerup.mesh).toBeTruthy();
  });

  test('update should spawn at least one powerup after enough time', () => {
    const manager = new PowerUpManager(mockScene, mockPlayer);

    expect(manager.powerups.length).toBe(0);

    // 5 seconds interval -> give a bit more than that
    manager.update(5.5);

    expect(manager.powerups.length).toBeGreaterThanOrEqual(1);
  });

  test('collision with the player should activate the powerup and destroy it', () => {
    const manager = new PowerUpManager(mockScene, mockPlayer);

    manager.spawnPowerUp();
    expect(manager.powerups.length).toBe(1);

    const powerup = manager.powerups[0];

    // Place the powerup directly on the player to guarantee collision
    powerup.mesh.position.copy(mockPlayer.getPosition());

    manager.update(0); // triggers handleCollisions

    expect(mockPlayer.activatePowerUp).toHaveBeenCalledWith(powerup.type);
    expect(powerup.active).toBe(false);
    expect(powerup.mesh).toBeNull();
  });

  test('clear should destroy and remove all powerups', () => {
    const manager = new PowerUpManager(mockScene, mockPlayer);

    manager.spawnPowerUp();
    manager.spawnPowerUp();

    expect(manager.powerups.length).toBe(2);

    manager.clear();

    expect(manager.powerups.length).toBe(0);
  });
});
