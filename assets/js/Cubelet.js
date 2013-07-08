
var ROTATE_90_AROUND_X = new THREE.Vector3(Math.PI / 180 * 90, 0, 0);
var ROTATE_90_AROUND_Y = new THREE.Vector3(0, Math.PI / 180 * 90, 0);
var ROTATE_90_AROUND_Z = new THREE.Vector3(0, 0, Math.PI / 180 * 90);

function moveAlongX(distance) {
    return new THREE.Vector3(distance, 0, 0);
}

function moveAlongY(distance) {
    return new THREE.Vector3(0, distance, 0);
}

function moveAlongZ(distance) {
    return new THREE.Vector3(0, 0, distance);
}

function faceMesh(faceGeometry, color, rotation, trnslation) {
    var mesh = new THREE.Mesh( 
        faceGeometry, 
        new THREE.MeshBasicMaterial( { color: color }));
    if (rotation) {
        mesh.rotation = rotation;
    }
    mesh.position = trnslation;
    return mesh;
}

function faceMeshGen(faceGeometry) {
    return function(color, rotation, trnslation) {
        return faceMesh(faceGeometry, color, rotation, trnslation);
    }
}

/**
 * position: THREE.Vector3 
 * cubeMetrics: { cubeletCount: {x: 3, y: 3, z: 3}, cubeSize: 20}
 * 
 * returns the cubelet as a Mesh
 **/
function buildCubelet(position, cubeMetrics) {
    
    var cubeletSize = cubeMetrics.cubeSize / cubeMetrics.cubeletCount.x;
    var mesh = faceMeshGen(new THREE.CubeGeometry( 1, cubeletSize - 5, cubeletSize - 5, 1, 1, 1 ));
    
    var cubelet =new THREE.Mesh( 
        new THREE.CubeGeometry( cubeletSize, cubeletSize, cubeletSize, 1, 1, 1 ), 
        new THREE.MeshBasicMaterial( { color: 0x5F5F5F }) );
    
    var color;
	// color external faces
	if (position.y == 0)
	{
        cubelet.add(mesh(COLORS.bottom, ROTATE_90_AROUND_Z, moveAlongY( -cubeletSize / 2)));
	}
	if (position.y==cubeMetrics.cubeletCount.y-1)
	{
        cubelet.add(mesh(COLORS.top, ROTATE_90_AROUND_Z, moveAlongY( cubeletSize / 2)));
	}
	if (position.x ==cubeMetrics.cubeletCount.x-1)
	{
        cubelet.add(mesh(COLORS.right, undefined, moveAlongX( cubeletSize / 2)));
	}
	if (position.x==0)
	{
        cubelet.add(mesh(COLORS.left, undefined, moveAlongX( -cubeletSize / 2)));
	}
	if (position.z==cubeMetrics.cubeletCount.z-1)
	{
        cubelet.add(mesh(COLORS.front, ROTATE_90_AROUND_Y, moveAlongZ( cubeletSize / 2)));
	}
	if (position.z==0)
	{
        cubelet.add(mesh(COLORS.back, ROTATE_90_AROUND_Y, moveAlongZ( -cubeletSize / 2)));
	}
	
	cubelet.overdraw = true;
    
    // TODO: move to rubik.js
	cubelet.extra_data={xx:position.x ,yy:position.y,zz:position.z};
    
    return cubelet;
}