import './style.css'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
let logo = undefined;
const logoProps = {rotationSpeed: 1};

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const manager = new THREE.LoadingManager();
function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

    }

}

function onError() {}

const loader = new OBJLoader( manager );
loader.load( '/models/Youngworld_Icon_3D.obj', function ( obj ) {

    logo = obj;
    logo.scale.set(.2, .2, .2);

    const logoFolder = gui.addFolder('Logo');
    logoFolder.add(logo.position, 'x').min(-20).max(20).step(.01);
    logoFolder.add(logo.position, 'y').min(-20).max(20).step(.01);
    logoFolder.add(logo.position, 'z').min(-20).max(20).step(.01);
    logoFolder.add(logoProps, 'rotationSpeed').min(0).max(5).step(.1);
    scene.add(logo);
    console.log(logo);

}, onProgress, onError );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x').min(-20).max(20).step(.01);
cameraFolder.add(camera.position, 'y').min(-20).max(20).step(.01);
cameraFolder.add(camera.position, 'z').min(-20).max(20).step(.01);

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    if (logo) {
        logo.children[0].rotation.x = logoProps.rotationSpeed * elapsedTime

        logo.children[1].rotation.x = -logoProps.rotationSpeed * elapsedTime;
        logo.children[2].rotation.x = -logoProps.rotationSpeed * elapsedTime;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()