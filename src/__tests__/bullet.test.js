import { Bullet } from '../bullet.js';
import * as THREE from 'three';

/**
 * Tests for Bullet movement and lifetime
 */

describe('Bullet', () => {
  let mockScene;

  beforeEach(() => {
    mockScene = {
      add: jest.fn(),
      remove: jest.fn()
    };
  });

  test('should create a mesh at the given position and add it to the scene', () => {
    const position = new THREE.Vector3(1, 2, 3);
    const direction = new THREE.Vector3(0, 0, -1);

    const bullet = new Bullet(mockScene, position, direction);

    expect(bullet.mesh).toBeTruthy();
    expect(bullet.mesh.position.x).toBeCloseTo(1);
    expect(bullet.mesh.position.y).toBeCloseTo(2);
    expect(bullet.mesh.position.z).toBeCloseTo(3);
    expect(mockScene.add).toHaveBeenCalledWith(bullet.mesh);
  });

  test('should move forward and be destroyed after its lifetime', () => {
    const position = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3(0, 0, -1);

    const bullet = new Bullet(mockScene, position, direction);

    // Advance half of its lifetime
    bullet.update(1);
    expect(bullet.mesh).not.toBeNull();
    expect(bullet.mesh.position.length()).toBeGreaterThan(0);

    // Advance beyond its lifetime (2 seconds total)
    bullet.update(2);

    expect(bullet.mesh).toBeNull();
    expect(mockScene.remove).toHaveBeenCalled();
  });
});
