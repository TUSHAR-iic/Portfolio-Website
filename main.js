import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  antialias: true,
  alpha: true, // Enable transparency for the canvas background
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'; // Position canvas on top
renderer.domElement.style.top = 0;
renderer.domElement.style.left = 0;
renderer.domElement.style.zIndex = 1000; // Ensure highest z-index
camera.position.z = 30; // Set initial camera position

// Orbit controls for user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

// Lighting setup
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Load the Millennium Falcon model
const loader = new GLTFLoader();
let falconModel; // To store the loaded model

loader.load(
  './millennium_falcon/scene.gltf', // Ensure the correct path
  (gltf) => {
    falconModel = gltf.scene;
    falconModel.scale.set(2, 2, 2); // Adjust the scale if necessary
    falconModel.position.set(0, 0, 0); // Center the model
    console.log('Model loaded:', falconModel);
    scene.add(falconModel);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  (error) => {
    console.error('Error loading the model:', error);
  }
);


// **Improved Keyboard Movement Handling**
let keysPressed = {}; // Track pressed keys
let moveSpeed = 0.5;

// Register key events
window.addEventListener('keydown', (e) => { keysPressed[e.key] = true; });
window.addEventListener('keyup', (e) => { keysPressed[e.key] = false; });

// Move the falcon based on pressed keys
function moveFalcon() {
  if (!falconModel) return; // Ensure the model is loaded before moving

  if (keysPressed['ArrowUp']) falconModel.position.y += moveSpeed;
  if (keysPressed['ArrowDown']) falconModel.position.y -= moveSpeed;
  if (keysPressed['ArrowLeft']) falconModel.position.x -= moveSpeed;
  if (keysPressed['ArrowRight']) falconModel.position.x += moveSpeed;
}


// Function to add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  // Randomly position the star
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);

  scene.add(star);
}

// Create 500 stars
Array(600).fill().forEach(addStar);

// const spaceTexture = new THREE.TextureLoader().load('img/19109.jpg');
// scene.background = spaceTexture;

// Animation logic
let animationRunning = true; // Track animation state
let startTime = Date.now();
let animationFrameId;

// Function to handle the animation loop
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  
  const elapsedTime = Date.now() - startTime;

  if (elapsedTime < 6000) { // Run animation for 6 seconds
    camera.position.z -= 0.5; // Warp effect simulation
    scene.rotation.x += 0.0005;
    scene.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
  } else if (animationRunning) {
    animationRunning = false; // Stop further animation

    // Stop animation loop
    cancelAnimationFrame(animationFrameId);

    // Make content visible
    const contentDiv = document.getElementById('content');
    contentDiv.classList.add('visible');

    // Enable scrolling now that the animation has ended
    document.body.style.overflowY = 'auto';
  }
}


// Resize handler to adjust the canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();




// download pdf button
document.getElementById("downloadBtn").addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = "Tushar CV (1).pdf";  // Replace with the path to your PDF
  link.download = "Tushar-resume.pdf";  // Name the file as you want it to appear when downloaded
  link.click();
});