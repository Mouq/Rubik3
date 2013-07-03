var camera;
var cameraControls;
var scene; 
var renderer;
var COLORS = {inside:0x2c2c2c,top:0xFF00FF,bottom:0x00FF00,left:0xFFFF00,right:0x0000FF,front:0xFF0000,back:0x00FFFF}; // mutually complementary colors
var CUBE_SIZE = 20;

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
    return new Rubik('3x3x3'.value, 200, 0.3, buildCubelet);
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
    renderer.setClearColor(0x000000, 1.0);
    return renderer;
}

function animate() {

	requestAnimationFrame( animate );

    cameraControls.update();

}

function render() {
	renderer.render( scene, camera );
}

/**
 * position: THREE.Vector3 
 * sizes: THREE.Vector3 
 * 
 * returns the cubelet as a Mesh
 **/
function buildCubelet(position, sizes) {
	
    var color;
	// color external faces
	if (position.y == 0)
	{
        color = COLORS.bottom;
	}
	if (position.y==sizes.y-1)
	{
        color = COLORS.top;
	}
	if (position.x ==sizes.x-1)
	{
        color = COLORS.right;
	}
	if (position.x==0)
	{
        color = COLORS.left;
	}
	if (position.z==sizes.z-1)
	{
        color = COLORS.front;
	}
	if (position.z==0)
	{
        color = COLORS.back;
	}
	
	// new cubelet
	var cubelet =new THREE.Mesh( new THREE.CubeGeometry( CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 1, 1, 1 ), 
    new THREE.MeshBasicMaterial( {color: color}) );
	
    var side = CUBE_SIZE * 3;
	// position it centered
	cubelet.position.x = (CUBE_SIZE)*position.x -side/2 +CUBE_SIZE/2;
	cubelet.position.y = (CUBE_SIZE)*position.y -side/2 +CUBE_SIZE/2;
	cubelet.position.z = (CUBE_SIZE)*position.z -side/2 +CUBE_SIZE/2;
	cubelet.overdraw = true;
	// cubelet.extra_data={xx:xx,yy:yy,zz:zz};
    
    return cubelet;
}