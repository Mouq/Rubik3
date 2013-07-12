/*global THREE Rubik buildCubelet*/

var COLORS = {inside:0x2c2c2c,top:0xFF00FF,bottom:0x00FF00,left:0xFFFF00,right:0x0000FF,front:0xFF0000,back:0x00FFFF}; // mutually complementary colors
var CUBE_SIZE = 20;

var container;
var canvasSize;
var camera;
var cameraControls;
var scene; 
var renderer;
var cube;
var projector;
var raycaster;
var mousepx = new THREE.Vector2();
var possibleRotation;

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

    container = document.getElementById(containerId);
	container.addEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener( 'mouseup', onDocumentMouseUp, false );
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
    mousepx = getMousePositionPx(event);

	event.preventDefault();
    
	var target=getCubelet(event);
    if (target==null) return;
    cube.decorateFacesAsSeen(target.cubelet);
	var cubeletseenas=cube.getCubeletSeenCoords(target.cubelet);
    // console.log(target.face.asseen);
    // console.log(cubeletseenas);
	
    possibleRotation = calculateRotation(cubeletseenas, target.face.asseen);
}
// TODO: finish
function calculateRotation(cubeletseenas, faceasseen) {
    console.log(faceasseen)
    if (cubeletseenas.xx == 1 && cubeletseenas.yy == 1) {
        return null;
    }
    if (cubeletseenas.yy == 1 && cubeletseenas.zz == 1) {
        return null;
    }
    if (cubeletseenas.zz == 1 && cubeletseenas.xx == 1) {
        return null;
    }
    var r = {};
    console.log(cubeletseenas.xx + " " + cubeletseenas.yy + " " + cubeletseenas.zz);
    if (cubeletseenas.xx == 1 || (cubeletseenas.yy != 1 && cubeletseenas.zz != 1 && faceasseen != 'left' && faceasseen != 'right' ) ) {
        r.row = cubeletseenas.xx;
        r.axis = 'x';
        r.angle = boolToInt(
            ( faceasseen == 'front' && cubeletseenas.yy === 0 ) ||
            ( faceasseen == 'back' && cubeletseenas.yy !== 0 ) ||
            ( faceasseen == 'top' && cubeletseenas.zz !== 0 ) ||
            ( faceasseen == 'bottom' && cubeletseenas.zz === 0 ));
        
        return r;
    }
    else if (cubeletseenas.yy == 1 || (cubeletseenas.zz != 1 && cubeletseenas.xx != 1 && faceasseen != 'top' && faceasseen != 'bottom' ) ) {
        r.row = cubeletseenas.yy;
        r.axis = 'y';
        r.angle = boolToInt(
            ( faceasseen == 'left' && cubeletseenas.zz !== 0 ) ||
            ( faceasseen == 'right' && cubeletseenas.zz === 0 ) ||
            ( faceasseen == 'front' && cubeletseenas.xx !== 0 ) ||
            ( faceasseen == 'back' && cubeletseenas.xx === 0 ));
        
        return r;
    }
    else if (cubeletseenas.zz == 1 || (cubeletseenas.xx != 1 && cubeletseenas.yy != 1 && faceasseen != 'front' && faceasseen != 'back' ) ) {
        r.row = cubeletseenas.zz;
        r.axis = 'z';
        r.angle = boolToInt(
            ( faceasseen == 'top' && cubeletseenas.xx === 0 ) ||
            ( faceasseen == 'bottom' && cubeletseenas.xx !== 0 ) ||
            ( faceasseen == 'left' && cubeletseenas.yy === 0 ) ||
            ( faceasseen == 'right' && cubeletseenas.yy !== 0 ));
        
        return r;
    }
    return null;
    
}

function boolToInt(b) {
    return b? 1: -1;
}
function onDocumentMouseUp( event ) {
    var newMousePx = getMousePositionPx(event);
    if (!possibleRotation) {
        return;
    }
    
    if (newMousePx.sub(mousepx).length() < 10.0) {
        possibleRotation.duration = 0.3;
        cube.rotate(possibleRotation);
    }
    possibleRotation = null;
}

function getMousePosition(event) {
    return new THREE.Vector2(
        ( event.clientX / canvasSize.width ) * 2 - 1,
        - ( event.clientY / canvasSize.height ) * 2 + 1
        );
}

function getMousePositionPx(event) {
    return new THREE.Vector2(
        event.clientX,
        event.clientY);
}

function getCubelet(event)
{
    var mouse = getMousePosition(event);
    // console.log(mouse);
    
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

