import { createScene } from '../scene.js';
import * as THREE from 'three';

/**
 * Tests for scene creation (lights, stars, and planets)
 */

describe('createScene', () => {
  test('should create a THREE.Scene with background and objects', () => {
    const scene = createScene();

    expect(scene).toBeInstanceOf(THREE.Scene);
    expect(scene.background).toBeInstanceOf(THREE.Color);

    const hasDirectionalLight = scene.children.some(
      (child) => child instanceof THREE.DirectionalLight
    );
    const hasAmbientLight = scene.children.some(
      (child) => child instanceof THREE.AmbientLight
    );

    const hasStars = scene.children.some(
      (child) => child instanceof THREE.Points
    );

    expect(hasDirectionalLight).toBe(true);
    expect(hasAmbientLight).toBe(true);
    expect(hasStars).toBe(true);

    // There should be at least a few meshes used as planets/asteroids
    const meshCount = scene.children.filter(
      (child) => child instanceof THREE.Mesh
    ).length;

    expect(meshCount).toBeGreaterThanOrEqual(5);
  });
});
