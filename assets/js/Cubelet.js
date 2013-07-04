
var ROTATE_90_AROUND_X = new THREE.Vector3(Math.PI / 180 * 90, 0, 0);
var ROTATE_90_AROUND_Y = new THREE.Vector3(0, Math.PI / 180 * 90, 0);
var ROTATE_90_AROUND_Z = new THREE.Vector3(0, 0, Math.PI / 180 * 90);
var CUBELET_SIZE = 20;
var FACE_GEOMETRY = new THREE.CubeGeometry( 1, CUBELET_SIZE - 5, CUBELET_SIZE - 5, 1, 1, 1 );

function moveAlongX(distance) {
    return new THREE.Vector3(distance, 0, 0);
}

function moveAlongY(distance) {
    return new THREE.Vector3(0, distance, 0);
}

function moveAlongZ(distance) {
    return new THREE.Vector3(0, 0, distance);
}

function faceMesh(color, rotation, trnslation) {
    var mesh = new THREE.Mesh( 
        FACE_GEOMETRY, 
        new THREE.MeshBasicMaterial( { color: color }));
    if (rotation) {
        mesh.rotation = rotation;
    }
    mesh.position = trnslation;
    return mesh;
}

/**
 * position: THREE.Vector3 
 * sizes: THREE.Vector3 
 * 
 * returns the cubelet as a Mesh
 **/
function buildCubelet(position, sizes) {
    
    var cubelet =new THREE.Mesh( 
        new THREE.CubeGeometry( CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE, 1, 1, 1 ), 
        new THREE.MeshBasicMaterial( { color: 0x0F0F0F }) );
    
    var color;
	// color external faces
	if (position.y == 0)
	{
        cubelet.add(faceMesh(COLORS.bottom, ROTATE_90_AROUND_Z, moveAlongY( -CUBELET_SIZE / 2)));
	}
	if (position.y==sizes.y-1)
	{
        cubelet.add(faceMesh(COLORS.top, ROTATE_90_AROUND_Z, moveAlongY( CUBELET_SIZE / 2)));
	}
	if (position.x ==sizes.x-1)
	{
        cubelet.add(faceMesh(COLORS.right, undefined, moveAlongX( CUBELET_SIZE / 2)));
	}
	if (position.x==0)
	{
        cubelet.add(faceMesh(COLORS.left, undefined, moveAlongX( -CUBELET_SIZE / 2)));
	}
	if (position.z==sizes.z-1)
	{
        cubelet.add(faceMesh(COLORS.front, ROTATE_90_AROUND_Y, moveAlongZ( CUBELET_SIZE / 2)));
	}
	if (position.z==0)
	{
        cubelet.add(faceMesh(COLORS.back, ROTATE_90_AROUND_Y, moveAlongZ( -CUBELET_SIZE / 2)));
	}
	
	cubelet.overdraw = true;
	// cubelet.extra_data={xx:xx,yy:yy,zz:zz};
    
    return cubelet;
}