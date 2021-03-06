
JSPrimMesher.ViewerFace = function( primFaceNumber ) {
	this.primFaceNumber = primFaceNumber || 0;
	this.v1 = new JSPrimMesher.Coord(0,0);
	this.v2 = new JSPrimMesher.Coord(0,0);
	this.v3 = new JSPrimMesher.Coord(0,0);
	
	this.n1 = new JSPrimMesher.Coord(0,0);
	this.n2 = new JSPrimMesher.Coord(0,0);
	this.n3 = new JSPrimMesher.Coord(0,0);
	
	this.uv1 = new JSPrimMesher.UVCoord(0,0);
	this.uv2 = new JSPrimMesher.UVCoord(0,0);
	this.uv3 = new JSPrimMesher.UVCoord(0,0);
	this.coordIndex1 = -1;
	this.coordIndex2 = -1;
	this.coordIndex3 = -1;
};
JSPrimMesher.ViewerFace.prototype = {
	constructor : JSPrimMesher.ViewerFace,
	Scale : function ( x, y, z ) {
		this.v1.X *= x;
		this.v1.Y *= y;
		this.v1.Z *= z;

		this.v2.X *= x;
		this.v2.Y *= y;
		this.v2.Z *= z;

		this.v3.X *= x;
		this.v3.Y *= y;
		this.v3.Z *= z;
	},
	AddPos : function ( x, y, z ) {
		this.v1.X += x;
		this.v2.X += x;
		this.v3.X += x;

		this.v1.Y += y;
		this.v2.Y += y;
		this.v3.Y += y;

		this.v1.Z += z;
		this.v2.Z += z;
		this.v3.Z += z;
	},
	AddRot : function ( q ) {
		this.v1 = JSPrimMesher.Coord.MulQuat(v1, q);
		this.v2 = JSPrimMesher.Coord.MulQuat(v2, q);
		this.v3 = JSPrimMesher.Coord.MulQuat(v3, q);

		this.n1 = JSPrimMesher.Coord.MulQuat(n1, q);
		this.n2 = JSPrimMesher.Coord.MulQuat(n2, q);
		this.n3 = JSPrimMesher.Coord.MulQuat(n3, q);
	}, 
	CalcSurfaceNormal : function () {
		var edge1 = new JSPrimMesher.Coord(this.v2.X - this.v1.X, this.v2.Y - this.v1.Y, this.v2.Z - this.v1.Z);
		var edge2 = new JSPrimMesher.Coord(this.v3.X - this.v1.X, this.v3.Y - this.v1.Y, this.v3.Z - this.v1.Z);
		this.n1 = this.n2 = this.n3 = JSPrimMesher.Coord.Cross(edge1, edge2).Normalize();	
	}, 
	Copy : function() {
		var copy = new JSPrimMesher.ViewerFace(this.primFaceNumber);
		
		copy.v1 = this.v1.Copy();
		copy.v2 = this.v2.Copy();
		copy.v3 = this.v3.Copy();
		
		copy.n1 = this.n1.Copy();
		copy.n2 = this.n2.Copy();
		copy.n3 = this.n3.Copy();
		
		copy.uv1 = this.uv1.Copy();
		copy.uv2 = this.uv2.Copy();
		copy.uv3 = this.uv3.Copy();
		copy.coordIndex1 = this.coordIndex1;
		copy.coordIndex2 = this.coordIndex2;
		copy.coordIndex3 = this.coordIndex3;
		
	},
	Planarize : function(scale) {
		this.PlanarCalc(this.v1,this.n1,this.uv1,scale);
		this.PlanarCalc(this.v2,this.n2,this.uv2,scale);
		this.PlanarCalc(this.v3,this.n3,this.uv3,scale);
	},
	PlanarCalc : function(pv1,pn1,puv1, pscale) {
		var UnitX = new JSPrimMesher.Coord(1,0,0);
		var UnitY = new JSPrimMesher.Coord(0,1,0);
		var binormal;
		var tangent;
		var scaledPos;
		var d;
		d = JSPrimMesher.Coord.Dot(pn1,UnitX);
		if (d >= 0.5 || d <= -0.5) {
			binormal = UnitY.Copy();
			if (pn1.X < 0) { binormal.X = binormal.X * -1;binormal.Y = binormal.Y * -1;binormal.Z = binormal.Z * -1; }
		} else {
			binormal = UnitX.Copy();
			if (pn1.Y < 0) { binormal.X = binormal.X * -1;binormal.Y = binormal.Y * -1;binormal.Z = binormal.Z * -1; }
		}
		tangent = JSPrimMesher.Coord.Cross(binormal,pn1);
		scaledPos = JSPrimMesher.Coord.Mul(pv1, pscale);
		puv1.U = 1 + (JSPrimMesher.Coord.Dot(binormal,scaledPos) * 2 - 0.5);
		puv1.V = -1 * (JSPrimMesher.Coord.Dot(tangent,scaledPos) * 2 - 0.5);
	}
			
};