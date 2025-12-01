import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const cubes = []; // tableau pour stocker tous les cubes
const MAX_CUBES = 5; // nombre maximum de cubes à l'écran
const CUBE_LIFETIME = 3000; // durée de vie d'un cube en ms

// Fonction pour créer un cube avec vitesse aléatoire
function createRandomCube() {
  if (cubes.length >= MAX_CUBES) return; // ne crée pas de cube si le max est atteint

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(geometry, material);

  // Position initiale aléatoire
  cube.position.x = (Math.random() - 0.5) * 20;
  cube.position.y = (Math.random() - 0.5) * 20;
  cube.position.z = (Math.random() - 0.5) * 20;

  // Vitesse aléatoire sur x, y, z
  cube.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1
  );

  scene.add(cube);
  cubes.push(cube);

  // Supprimer le cube après 3 secondes
  setTimeout(() => {
    scene.remove(cube);
    const index = cubes.indexOf(cube);
    if (index > -1) cubes.splice(index, 1);
  }, CUBE_LIFETIME);

  return cube;
}

camera.position.z = 30;

function animate() {
  cubes.forEach(cube => {
    cube.position.add(cube.userData.velocity);

    // rebonds simples sur les limites (-15,15)
    ['x', 'y', 'z'].forEach(axis => {
      if (cube.position[axis] > 15 || cube.position[axis] < -15) {
        cube.userData.velocity[axis] *= -1;
      }
    });

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

// Ajouter un cube toutes les 2 secondes si moins de 5 cubes
setInterval(createRandomCube, 2000);
