/// <reference path="_reference.ts"/>

// MAIN GAME FILE

// THREEJS Aliases
import Scene = THREE.Scene;
import Renderer = THREE.WebGLRenderer;
import Camera = THREE.Camera;
import PerspectiveCamera = THREE.PerspectiveCamera;
import OrthographicCamera = THREE.OrthographicCamera;
import BoxGeometry = THREE.BoxGeometry;
import CubeGeometry = THREE.CubeGeometry;
import PlaneGeometry = THREE.PlaneGeometry;
import SphereGeometry = THREE.SphereGeometry;
import Geometry = THREE.Geometry;
import AxisHelper = THREE.AxisHelper;
import CameraHelper = THREE.CameraHelper;
import LambertMaterial = THREE.MeshLambertMaterial;
import MeshBasicMaterial = THREE.MeshBasicMaterial;
import Material = THREE.Material;
import Texture = THREE.Texture;
import RepeatWrapping = THREE.RepeatWrapping;
import Mesh = THREE.Mesh;
import Object3D = THREE.Object3D;
import SpotLight = THREE.SpotLight;
import PointLight = THREE.PointLight;
import AmbientLight = THREE.AmbientLight;
import DirectionalLight = THREE.DirectionalLight;
import HemisphereLight = THREE.HemisphereLight;
import Control = objects.Control;
import GUI = dat.GUI;
import Color = THREE.Color;
import Vector3 = THREE.Vector3;
import Face3 = THREE.Face3;
import Point = objects.Point;
import Fog = THREE.Fog;
import LensFlare = THREE.LensFlare;
import AdditiveBlending = THREE.AdditiveBlending;

//Custom Game Objects
import gameObject = objects.gameObject;

var scene: Scene;
var renderer: Renderer;
var camera: Camera;
var axes: AxisHelper;
var directionalLightHelper: CameraHelper;
var cube: Mesh;
var plane: Mesh;
var sphere: Mesh;
var ambientLight: AmbientLight;
var ambientColour: string;
var spotLight0: SpotLight;
var spotLight1: SpotLight;
var directionalLight: DirectionalLight;
var pointColour: string;
var pointLight: PointLight;
var hemiLight: HemisphereLight;
var control: Control;
var gui: GUI;
var stats: Stats;
var step: number = 0;
var invert: number = 1;
var phase: number = 0;
var target: Object3D;
var stopMovingLight: boolean = false;
var planeMaterial: LambertMaterial;
var planeGeometry: PlaneGeometry;
var cubeMaterial: LambertMaterial;
var cubeGeometry: CubeGeometry;
var sphereMaterial: LambertMaterial;
var sphereGeometry: SphereGeometry;
var sphereLight: SphereGeometry;
var sphereLightMaterial: MeshBasicMaterial;
var sphereLightMesh: Mesh;
var textureGrass: Texture;
var textureFlare0: Texture;
var textureFlare3: Texture;
var flareColour: Color;
var lensFlare: LensFlare;

function init() {
    // Instantiate a new Scene object
    scene = new Scene();
    scene.fog = new Fog(0xaaaaaa, 0.010, 200);

    setupRenderer(); // setup the default renderer
	
    setupCamera(); // setup the camera
	
    // add an axis helper to the scene
    axes = new AxisHelper(20);
    scene.add(axes);
    console.log("Added Axis Helper to scene...");

    // create the ground plane
    textureGrass = THREE.ImageUtils.loadTexture("Assets/textures/ground/grasslight-big.jpg");
    textureGrass.wrapS = RepeatWrapping;
    textureGrass.wrapT = RepeatWrapping;
    textureGrass.repeat.set(4, 4);
    console.log("Loaded Grass Texture...");
     
    //Add a Plane to the Scene
    planeGeometry = new THREE.PlaneGeometry(1000, 200, 20, 20);
    planeMaterial = new THREE.MeshLambertMaterial({ map: textureGrass });
    plane = new gameObject(planeGeometry, planeMaterial, 15, 0, 0);
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    console.log("Added Plane Primitive to scene...");

    // Add a Cube to the Scene
    cubeMaterial = new LambertMaterial({ color: 0xff3333 });
    cubeGeometry = new CubeGeometry(4, 4, 4);
    cube = new gameObject(cubeGeometry, cubeMaterial, -4, 3, 0);
    scene.add(cube);
    console.log("Added Cube Primitive to the Scene");
    
    // Add a Sphere to the Scene
    sphereGeometry = new SphereGeometry(4, 25, 25);
    sphereMaterial = new LambertMaterial({ color: 0x7777ff });
    sphere = new gameObject(sphereGeometry, sphereMaterial, 10, 5, 10);
    scene.add(sphere);
    console.log("Add a Sphere Primitive");
    
    // Add an AmbientLight to the scene
    ambientColour = "#1c1c1c";
    ambientLight = new AmbientLight(ambientColour);
    scene.add(ambientLight);
    console.log("Added an Ambient Light to Scene");
	
    // Add a SpotLight to the scene
    spotLight0 = new SpotLight(0xffffff);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane.position);
    scene.add(spotLight0);
    console.log("Added Spot Light 0 to Scene");

    target = new Object3D();
    target.position = new Vector3(5, 0, 0);
    
    // Add a Directional Light to the scene
    pointColour = "#ffffff";
    directionalLight = new DirectionalLight(pointColour);
    directionalLight.position.set(30, 10, -50);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 0.1;
    directionalLight.shadowCameraFar = 100;
    directionalLight.shadowCameraFov = 50;
    directionalLight.target = plane;
    directionalLight.shadowCameraNear = 2;
    directionalLight.shadowCameraFar = 200;
    directionalLight.shadowCameraLeft = -100;
    directionalLight.shadowCameraRight = 100;
    directionalLight.shadowCameraTop = 100;
    directionalLight.shadowCameraBottom = -100;
    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;
    scene.add(directionalLight);
    console.log("Added Directional Light to Scene");
    
    // Setup Lens Flare
    textureFlare0 = THREE.ImageUtils.loadTexture("Assets/lensflare/lensflare0.png");
    textureFlare3 = THREE.ImageUtils.loadTexture("Assets/lensflare/lensflare3.png");
    flareColour = new Color(0xffaacc);
    lensFlare = new LensFlare(textureFlare0, 350, 0.0, AdditiveBlending, flareColour);
    
    lensFlare.add(textureFlare3, 60, 0.6, AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 0.7, AdditiveBlending);
    lensFlare.add(textureFlare3, 120, 0.9, AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 1.0, AdditiveBlending);
    
    lensFlare.position.set(30, 10, -50);
    scene.add(lensFlare)
    console.log("Added Lens Flare to Scene");
    
    // add controls
    gui = new GUI();
    control = new Control(0.03, 0.03, ambientColour, pointColour, 0.1, 0, 30, 0.1, false, true, false, "Plane");
    addControl(control);

    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");

    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    
    window.addEventListener('resize', onResize, false);
}

// Change the Camera Aspect Ratio according to Screen Size changes
function onResize(): void {
    if (camera instanceof PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addControl(controlObject: Control): void {
    gui.addColor(controlObject, 'ambientColour').onChange((color) => {
        ambientLight.color = new Color(color);
    });

    gui.addColor(controlObject, 'pointColour').onChange((color) => {
        directionalLight.color = new Color(color);
    });

    gui.add(controlObject, 'intensity', 0, 5).onChange((intensity)=>{
        directionalLight.intensity = intensity;
    });

}

// Add Stats Object to the Scene
function addStatsObject() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);
}

// Setup main game loop
function gameLoop(): void {
    stats.update();

    //rotate the cube around its axes
    cube.rotation.x += control.rotationSpeed;
    cube.rotation.y += control.rotationSpeed;
    cube.rotation.z += control.rotationSpeed;
    
    //bounce the sphere up and down
    step += control.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));
    
    // render using requestAnimationFrame
    requestAnimationFrame(gameLoop);
	
    // render the scene
    renderer.render(scene, camera);
}

// Setup default renderer
function setupRenderer(): void {
    renderer = new Renderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}

// Setup main camera for the scene
function setupCamera(): void {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;
    camera.lookAt(new Vector3(10, 0, 0));
    console.log("Finished setting up Initial Camera...");
}
