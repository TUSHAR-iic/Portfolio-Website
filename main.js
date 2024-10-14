import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 5, 11);

// Create two renderers: one for the background and one for the model
const backgroundRenderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  alpha: true,
});
backgroundRenderer.setSize(window.innerWidth, window.innerHeight);

const modelRenderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('modelCanvas'),
  antialias: true,
  alpha: true,
});
modelRenderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls for the model
const controls = new OrbitControls(camera, modelRenderer.domElement);
controls.enableDamping = true;

// Lighting setup
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// SpotLight setup with nebula-inspired color
const spotLight = new THREE.SpotLight(0x2d3c54, 3, 100, 0.2, 0.5); // Nebula-inspired color and intensity
spotLight.position.set(0, 25, 0); // Positioned above and to the side of the model
spotLight.castShadow = true; // Enable shadows for better effect

// Configure shadow settings for higher quality
spotLight.shadow.mapSize.width = 1024; // Shadow resolution width
spotLight.shadow.mapSize.height = 1024; // Shadow resolution height
spotLight.shadow.camera.near = 0.1; // Start of shadow camera
spotLight.shadow.camera.far = 50; // End of shadow camera
spotLight.angle = Math.PI / 6; // Spot angle (adjust if needed)
spotLight.penumbra = 0.3; // Soft edges for the spotlight


scene.add(spotLight);



// Load the 3D model
const loader = new GLTFLoader();
let falconModel;

loader.load(
  './millennium_falcon/scene.gltf',
  (gltf) => {
    falconModel = gltf.scene;
    falconModel.scale.set(3, 3, 3);
    falconModel.position.set(0, 0, 0);
    scene.add(falconModel);
  },
  undefined,
  (error) => console.error('Error loading model:', error)
);

// Track key presses for movement
let keysPressed = {};
let moveSpeed = 0.5;

window.addEventListener('keydown', (e) => { keysPressed[e.key] = true; });
window.addEventListener('keyup', (e) => { keysPressed[e.key] = false; });

function moveFalcon() {
  if (!falconModel) return;

  const canvasWidth = window.innerWidth / 2;
  const canvasHeight = window.innerHeight / 2;

  // Move the model within canvas boundaries
  if (keysPressed['ArrowUp'] && falconModel.position.y < canvasHeight) 
    falconModel.position.y += moveSpeed;
  if (keysPressed['ArrowDown']) {
    if (falconModel.position.y > -canvasHeight) {
      falconModel.position.y -= moveSpeed;
    } else {
      document.body.style.overflowY = 'auto'; // Enable scrolling
      window.scrollBy(0, 10); // Gradually scroll down
    }
  }
  if (keysPressed['ArrowLeft'] && falconModel.position.x > -canvasWidth) 
    falconModel.position.x -= moveSpeed;
  if (keysPressed['ArrowRight'] && falconModel.position.x < canvasWidth) 
    falconModel.position.x += moveSpeed;
}

// Add stars to the background
function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(600).fill().forEach(addStar);

// Animation loop
let animationRunning = true;
let startTime = Date.now();

function animate() {
  requestAnimationFrame(animate);
  moveFalcon(); // Handle movement

  const elapsedTime = Date.now() - startTime;
  if (elapsedTime < 6000) {
    camera.position.z -= 0.5;
    scene.rotation.x += 0.0005;
    scene.rotation.y += 0.001;
  } else if (animationRunning) {
    animationRunning = false;
    const contentDiv = document.getElementById('content');
    contentDiv.classList.add('visible');
    document.body.style.overflowY = 'auto';
  }

  controls.update();
  modelRenderer.render(scene, camera);
  backgroundRenderer.render(scene, camera); // Render background separately
}

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  modelRenderer.setSize(window.innerWidth, window.innerHeight);
  backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();


// additional functionalities 

// PDF download button functionality
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = "Tushar CV (1).pdf";
  link.download = "Tushar-resume.pdf";
  link.click();
});

// Add event listeners for navigation links
const navLinks = document.querySelectorAll('.navbar-links a');

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the default anchor click behavior
    const targetId = link.getAttribute('href'); // Get the target section ID
    const targetSection = document.querySelector(targetId); // Select the target section

    // Scroll to the target section smoothly
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});
