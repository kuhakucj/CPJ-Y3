import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';

// Image paths - add your images here
const imagePaths = [
    'assets/images/term-1/01-1.jpg',
    'assets/images/term-1/01-2.jpg',
    'assets/images/term-1/01-3.png'
];

const cycleInterval = 4000; // Change image every 4 seconds
let currentImageIndex = 0;
let textures = [];
let texturesLoaded = 0;

// Three.js variables
const container = document.getElementById("splash-canvas-container");
const splashWrapper = document.querySelector(".splash-wrapper");

let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let aberrationIntensity = 0.0;
let prevPosition = { x: 0.5, y: 0.5 };

// Shaders
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;    
    uniform sampler2D u_texture2;
    uniform float u_blend;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform float u_aberrationIntensity;

    void main() {
        vec2 gridUV = floor(vUv * vec2(20.0, 20.0)) / vec2(20.0, 20.0);
        vec2 centerOfPixel = gridUV + vec2(1.0/20.0, 1.0/20.0);
        
        vec2 mouseDirection = u_mouse - u_prevMouse;
        
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
 
        vec2 uvOffset = strength * -mouseDirection * 0.2;
        vec2 uv = vUv - uvOffset;

        // Sample both textures with aberration
        vec4 colorR1 = texture2D(u_texture, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG1 = texture2D(u_texture, uv);
        vec4 colorB1 = texture2D(u_texture, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 color1 = vec4(colorR1.r, colorG1.g, colorB1.b, 1.0);

        vec4 colorR2 = texture2D(u_texture2, uv + vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 colorG2 = texture2D(u_texture2, uv);
        vec4 colorB2 = texture2D(u_texture2, uv - vec2(strength * u_aberrationIntensity * 0.01, 0.0));
        vec4 color2 = vec4(colorR2.r, colorG2.g, colorB2.b, 1.0);

        // Blend between textures
        gl_FragColor = mix(color1, color2, u_blend);
    }
`;

// Load all textures first
const textureLoader = new THREE.TextureLoader();

function loadTextures() {
    imagePaths.forEach((path, index) => {
        textureLoader.load(path, (texture) => {
            textures[index] = texture;
            texturesLoaded++;
            
            // Once all textures loaded, initialize the scene
            if (texturesLoaded === imagePaths.length) {
                initializeScene();
            }
        });
    });
}

function initializeScene() {
    scene = new THREE.Scene();

    // Camera setup - use window dimensions
    camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    );
    camera.position.z = 1;

    // Uniforms
    let shaderUniforms = {
        u_mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
        u_prevMouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
        u_aberrationIntensity: { type: "f", value: 0.0 },
        u_texture: { type: "t", value: textures[0] },
        u_texture2: { type: "t", value: textures[1] || textures[0] },
        u_blend: { type: "f", value: 0.0 }
    };

    // Create plane mesh
    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader
        })
    );

    scene.add(planeMesh);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // Show the splash once ready
    splashWrapper.style.opacity = '1';

    // Start animation and cycling
    animateScene();
    startImageCycling();
}

function animateScene() {
    requestAnimationFrame(animateScene);

    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

    planeMesh.material.uniforms.u_mouse.value.set(
        mousePosition.x,
        1.0 - mousePosition.y
    );

    planeMesh.material.uniforms.u_prevMouse.value.set(
        prevPosition.x,
        1.0 - prevPosition.y
    );

    aberrationIntensity = Math.max(0.0, aberrationIntensity - 0.05);
    planeMesh.material.uniforms.u_aberrationIntensity.value = aberrationIntensity;

    renderer.render(scene, camera);
}

// Image cycling with crossfade
let blendProgress = 0;
let isTransitioning = false;
let nextImageIndex = 1;

function startImageCycling() {
    if (imagePaths.length <= 1) return;

    setInterval(() => {
        // Start transition to next image
        nextImageIndex = (currentImageIndex + 1) % imagePaths.length;
        planeMesh.material.uniforms.u_texture2.value = textures[nextImageIndex];
        isTransitioning = true;
        blendProgress = 0;

        // Animate the blend
        function animateBlend() {
            if (blendProgress < 1) {
                blendProgress += 0.02; // Adjust speed here
                planeMesh.material.uniforms.u_blend.value = blendProgress;
                requestAnimationFrame(animateBlend);
            } else {
                // Transition complete
                currentImageIndex = nextImageIndex;
                planeMesh.material.uniforms.u_texture.value = textures[currentImageIndex];
                planeMesh.material.uniforms.u_blend.value = 0;
                isTransitioning = false;
            }
        }
        animateBlend();

    }, cycleInterval);
}

// Event listeners
container.addEventListener("mousemove", handleMouseMove);
container.addEventListener("mouseenter", handleMouseEnter);
container.addEventListener("mouseleave", handleMouseLeave);

function handleMouseMove(event) {
    easeFactor = 0.02;
    let rect = container.getBoundingClientRect();
    prevPosition = { ...targetMousePosition };

    targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    targetMousePosition.y = (event.clientY - rect.top) / rect.height;

    aberrationIntensity = 1;
}

function handleMouseEnter(event) {
    easeFactor = 0.02;
    let rect = container.getBoundingClientRect();

    mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseLeave() {
    easeFactor = 0.05;
    targetMousePosition = { ...prevPosition };
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Start loading
loadTextures();