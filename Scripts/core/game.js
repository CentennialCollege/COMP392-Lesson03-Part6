/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = THREE.Scene;
var Renderer = THREE.WebGLRenderer;
var Camera = THREE.Camera;
var PerspectiveCamera = THREE.PerspectiveCamera;
var OrthographicCamera = THREE.OrthographicCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var CameraHelper = THREE.CameraHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var RepeatWrapping = THREE.RepeatWrapping;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var DirectionalLight = THREE.DirectionalLight;
var HemisphereLight = THREE.HemisphereLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var Fog = THREE.Fog;
//Custom Game Objects
var gameObject = objects.gameObject;
var scene;
var renderer;
var camera;
var axes;
var directionalLightHelper;
var cube;
var plane;
var sphere;
var ambientLight;
var ambientColour;
var spotLight0;
var spotLight1;
var directionalLight;
var pointColour;
var pointLight;
var hemiLight;
var control;
var gui;
var stats;
var step = 0;
var invert = 1;
var phase = 0;
var target;
var stopMovingLight = false;
var planeMaterial;
var planeGeometry;
var cubeMaterial;
var cubeGeometry;
var sphereMaterial;
var sphereGeometry;
var sphereLight;
var sphereLightMaterial;
var sphereLightMesh;
var textureGrass;
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
    // Add a HemisphereLight
    hemiLight = new HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    hemiLight.position.set(0, 500, 0);
    hemiLight.visible = true;
    scene.add(hemiLight);
    console.log("Added Hemisphere Light to Scene");
    // Add a PointLight to the scene
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
    // add controls
    gui = new GUI();
    control = new Control(0.03, 0.03, false, 0x00ff00, 0x0000ff, 0.6);
    addControl(control);
    // Add framerate stats
    addStatsObject();
    console.log("Added Stats to scene...");
    document.body.appendChild(renderer.domElement);
    gameLoop(); // render the scene	
    window.addEventListener('resize', onResize, false);
}
// Change the Camera Aspect Ratio according to Screen Size changes
function onResize() {
    if (camera instanceof PerspectiveCamera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function addControl(controlObject) {
    gui.add(controlObject, 'hemisphere').onChange(function (flag) {
        hemiLight.visible = flag;
    });
    gui.addColor(controlObject, 'groundColour').onChange(function (color) {
        hemiLight.groundColor = new Color(color);
    });
    gui.addColor(controlObject, 'skyColour').onChange(function (color) {
        hemiLight.color = new Color(color);
    });
    gui.add(controlObject, 'intensity', 0, 5).onChange(function (intensity) {
        hemiLight.intensity = intensity;
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
function gameLoop() {
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
function setupRenderer() {
    renderer = new Renderer();
    renderer.setClearColor(0xEEEEEE, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    console.log("Finished setting up Renderer...");
}
// Setup main camera for the scene
function setupCamera() {
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;
    camera.lookAt(new Vector3(10, 0, 0));
    console.log("Finished setting up Initial Camera...");
}
//# sourceMappingURL=game.js.map