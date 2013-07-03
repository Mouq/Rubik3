var container;
var camera;
var cameraControls;
var scene; 
var renderer;
var COLORS = {inside:0x2c2c2c,top:0xFF00FF,bottom:0x00FF00,left:0xFFFF00,right:0x0000FF,front:0xFF0000,back:0x00FFFF}; // mutually complementary colors

function init(containerId) {

    var size = getWindowSize();
    
	container=configureContainer(containerId, size);

	camera = new THREE.PerspectiveCamera( 45, size.ratio, 1, 4000 );
    camera.position.z = 500;
	cameraControls = new THREE.OrbitControls( camera);
    cameraControls.addEventListener('change', render);
    
    scene = new THREE.Scene();
	scene.add( cube() );
	
	renderer = createRenderer(size);

	container.appendChild( renderer.domElement );
    
    animate();
}

function cube() {
    //var rubikcube=new Rubik('3x3x3'.value,200,0.3,colors);
    var CUBE_SIZE = 100;
    var cubeMesh = new THREE.Mesh(
        new THREE.CubeGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE),
        new THREE.MeshBasicMaterial( {wireframe: true } ));
    return cubeMesh;
}

function getWindowSize() {
    var size = {
        width: window.innerWidth,        
        height: window.innerHeight,        
    };
    size.ratio = size.width / size.height;
    return size;
    
}

function configureContainer(containerId, size) {
	container=document.getElementById(containerId);
	
	container.style.width=size.width + "px";
	container.style.height=size.height + "px";
    return container;
}

function createRenderer(size) {
	var renderer = new THREE.WebGLRenderer({ antialias: true } );
	renderer.setSize( size.width, size.height );
    return renderer;
}

function animate() {

	requestAnimationFrame( animate );

    cameraControls.update();

}

function render() {
	renderer.render( scene, camera );
}
