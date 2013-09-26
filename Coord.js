
JSPrimMesher.Coord = function(x, y, z) {
	this.X = x || 0;
	this.Y = y || 0;
	this.Z = z || 0;
};

JSPrimMesher.Coord.prototype = {
	constructor: JSPrimMesher.Coord,
	Length : function() {
		return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
	},
	Invert : function() {
		this.X = -this.X;
		this.Y = -this.Y;
		this.Z = -this.Z;
		return new JSPrimMesher.Coord(this.X, this.Y, this.Z);	
	},
	Normalize : function() {
		var mag = this.Length();
		var newx = this.X;
		var newy = this.Y;
		var newz = this.Z;
		if (mag > 0.0000001) {
			var oomag = 1.0 / mag;
			newx *= oomag;
			newy *= oomag;
			newz *= oomag;
		} else {
			newx = 0;
			newy = 0;
			newz = 0;
		}
		return new JSPrimMesher.Coord(newx, newy, newz);
	}, 
	ToString : function() {
		return "" + this.X + " " + this.Y + " " + this.Z + "";
	}, 
	Copy : function() {
		return new JSPrimMesher.Coord(this.X, this.Y, this.Z);
	}
}
JSPrimMesher.Coord.Cross = function ( c1, c2 ) {
	return new JSPrimMesher.Coord(
		c1.Y * c2.Z - c2.Y * c1.Z,
		c1.Z * c2.X - c2.Z * c1.X,
		c1.X * c2.Y - c2.X * c1.Y
	);
};
JSPrimMesher.Coord.Add = function ( v, a ) {
	return new JSPrimMesher.Coord(v.X + a.X, v.Y + a.Y, v.Z + a.Z);
};
JSPrimMesher.Coord.Mul = function ( v, m ) {
	return new JSPrimMesher.Coord(v.X * m.X, v.Y * m.Y, v.Z * m.Z);
};
JSPrimMesher.Coord.MulQuat = function ( v, q ) {
	var c2 = new JSPrimMesher.Coord(0.0, 0.0, 0.0);
	c2.X = q.W * q.W * v.X +
		2.0 * q.Y * q.W * v.Z -
		2.0 * q.Z * q.W * v.Y +
			  q.X * q.X * v.X +
		2.0 * q.Y * q.X * v.Y +
		2.0 * q.Z * q.X * v.Z -
			  q.Z * q.Z * v.X -
			  q.Y * q.Y * v.X;
	c2.Y =
		2.0 * q.X * q.Y * v.X +
			  q.Y * q.Y * v.Y +
		2.0 * q.Z * q.Y * v.Z +
		2.0 * q.W * q.Z * v.X -
			  q.Z * q.Z * v.Y +
			  q.W * q.W * v.Y -
		2.0 * q.X * q.W * v.Z -
			  q.X * q.X * v.Y;
	c2.Z =
		2.0 * q.X * q.Z * v.X +
		2.0 * q.Y * q.Z * v.Y +
			  q.Z * q.Z * v.Z -
		2.0 * q.W * q.Y * v.X -
			  q.Y * q.Y * v.Z +
		2.0 * q.W * q.X * v.Y -
			  q.X * q.X * v.Z +
			  q.W * q.W * v.Z;
	return c2;
};