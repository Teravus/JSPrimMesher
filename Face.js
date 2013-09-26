
JSPrimMesher.Face = function(v1, v2, v3, n1, n2, n3, uv1, uv2, uv3 ) {
	this.primFace = 0;
	this.v1 = v1 || 0;
	this.v2 = v2 || 0;
	this.v3 = v3 || 0;
	
	this.n1 = n1 || 0;
	this.n2 = n2 || 0;
	this.n3 = n3 || 0;
	
	this.uv1 = uv1 || 0;
	this.uv2 = uv2 || 0;
	this.uv3 = uv3 || 0;
};
JSPrimMesher.Face.prototype = {
	constructor : JSPrimMesher.Face,
	SurfaceNormal : function( coordlist ) {
		var c1 = coordlist[this.v1];
		var c2 = coordlist[this.v2];
		var c3 = coordlist[this.v3];
		
		var edge1 = new JSPrimMesher.Coord(c2.X - c1.X, c2.Y - c1.Y, c2.Z - c1.Z);
		var edge2 = new JSPrimMesher.Coord(c3.X - c1.X, c3.Y - c1.Y, c3.Z - c1.Z);	
		return JSPrimMesher.Coord.Cross( edge1, edge2 ).Normalize();
	}, 
	Copy : function () {
		return new JSPrimMesher.Face(this.v1,this.v2,this.v3,this.n1,this.n2,this.n3,this.uv1,this.uv2,this.uv3);
	}
};