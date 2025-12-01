import * as THREE from 'three';
import { Player } from './player.js';
import { createScene } from './scene.js';

// Création de la scène spatiale
const scene = createScene();

// Caméra
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Croix au centre
const crosshair = document.createElement('div');
crosshair.id = 'crosshair';
document.body.appendChild(crosshair);

// Clock pour delta time
const clock = new THREE.Clock();

// Player
const player = new Player(camera, scene);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  player.update(delta);

  renderer.render(scene, camera);
}

animate();
