import * as THREE from 'three';

/**
 * Crée la scène spatiale 3D pour Space Shooter 3D
 * - Arrière-plan noir avec 2000 étoiles (point cloud)
 * - Illumination : lumière directionnelle (soleil) + lumière ambiante
 * - Éléments de décor : astéroïdes/planètes statiques
 * @returns {THREE.Scene} - La scène 3D configurée
 */
export function createScene() {
  const scene = new THREE.Scene();

  // Fond noir
  scene.background = new THREE.Color(0x000000);

  // Lumière principale (comme le soleil)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);

  // Lumière d'ambiance douce pour ne pas avoir de zones trop noires
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // couleur et intensité
  scene.add(ambientLight);

  // Étoiles (point cloud)
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 2000;
  const starVertices = [];
  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Exemples d'objets spatiaux (planètes ou astéroïdes)
  for (let i = 0; i < 10; i++) {
    const radius = Math.random() * 3 + 1;
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    );
    scene.add(planet);
  }

  return scene;
}
