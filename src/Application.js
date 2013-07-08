/*global THREE Rubik buildCubelet*/

var COLORS = {inside:0x2c2c2c,top:0xFF00FF,bottom:0x00FF00,left:0xFFFF00,right:0x0000FF,front:0xFF0000,back:0x00FFFF}; // mutually complementary colors
var CUBE_SIZE = 20;

var canvasSize;
var camera;
var cameraControls;
var scene; 
var renderer;
var cube;
var projector;
var raycaster;
var mouse = new THREE.Vector2();
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;

function init(containerId) {

    canvasSize = calcCanvasSize();
    
	camera = new THREE.PerspectiveCamera( 45, canvasSize.ratio, 1, 4000 );
    camera.position.z = 500;
	cameraControls = new THREE.OrbitControls( camera);
    
    projector  = new THREE.Projector();
    raycaster = new THREE.Raycaster();
    
    scene = new THREE.Scene();
    cube = createCube();
	scene.add( cube);
	
	renderer = createRenderer(canvasSize);

    var container = document.getElementById(containerId);
	container.addEventListener( 'click', onDocumentMouseDown, false );
    container.appendChild( renderer.domElement );
    
    animate();
}

function createCube() {
    return new Rubik('3x3x3'.value, 200, 0.3, buildCubelet);
}

function calcCanvasSize() {
    var  size =  {
        width: $(window).width() - 5,
        height: $(window).height() - 5
    };
    size.ratio = size.width / size.height;
    return size;    
}

function createRenderer(size) {
	var renderer = new THREE.WebGLRenderer({ antialias: true } );
    
    renderer.sortObjects = false;
    
    // TODO: set these to false and see what happens
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
	renderer.setSize( size.width, size.height );
    renderer.setClearColor(0x000000, 1.0);
    return renderer;
}

function animate() {

	requestAnimationFrame( animate );

    cameraControls.update();
    render();
}

function render() {
    TWEEN.update();
	renderer.render( scene, camera );
}

function onDocumentMouseDown( event ) {

	event.preventDefault();
    
	var target=getCubelet(event);
    cube.decorateFacesAsSeen(target.cubelet);
	if (target==null) return;
    console.log(target.face.asseen);
	var cubeletseenas=cube.getCubeletSeenCoords(target.cubelet);
    console.log(cubeletseenas);
	
	// container.addEventListener( 'mouseup', onDocumentMouseUp, false );
	// container.addEventListener( 'mouseout', onDocumentMouseOut, false );
}

function getCubelet(event)
{
	mouse.x = ( event.clientX / canvasSize.width ) * 2 - 1;
	mouse.y = - ( event.clientY / canvasSize.height ) * 2 + 1;
    
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( cube.children );

	if ( intersects.length > 0 ) {
		return({
            cubelet: intersects[0].object,
            face: intersects[0].face
            });
	}
	return(null);
}

