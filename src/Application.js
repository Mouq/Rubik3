var camera;
var cameraControls;
var scene; 
var renderer;
var COLORS = {inside:0x2c2c2c,top:0xFF00FF,bottom:0x00FF00,left:0xFFFF00,right:0x0000FF,front:0xFF0000,back:0x00FFFF}; // mutually complementary colors

function init(containerId) {

    var size = calcCanvasSize();
    
	camera = new THREE.PerspectiveCamera( 45, size.ratio, 1, 4000 );
    camera.position.z = 500;
	cameraControls = new THREE.OrbitControls( camera);
    cameraControls.addEventListener('change', render);
    
    scene = new THREE.Scene();
	scene.add( cube() );
	
	renderer = createRenderer(size);
    
	document.getElementById(containerId).appendChild( renderer.domElement );
    
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
    
    // TODO: set these to false and see what happens
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    
	renderer.setSize( size.width, size.height );
    renderer.setClearColorHex(0x000000, 1.0);
    return renderer;
}

function animate() {

	requestAnimationFrame( animate );

    cameraControls.update();

}

function render() {
	renderer.render( scene, camera );
}
