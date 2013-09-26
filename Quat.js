
JSPrimMesher.Quat = function ( x, y, z, w ) {
	this.X = x || 0;
	this.Y = y || 0;
	this.Z = z || 0;
	this.W = (w != undefined ) ? w: 1;
};
JSPrimMesher.Quat.prototype = {
	constructor: JSPrimMesher.Quat,
	set: function ( x, y, z, w) {
		this.X = x;
		this.Y = y;
		this.Z = z;
		this.W = w;
		return this;
	},
	QuatAxisAngle: function ( axis, angle ) {
		var iaxis = axis.Normalize();
		var iangle = angle * 0.5;
		var c = Math.cos(iangle);
		var s = Math.sin(iangle);
		var retQuat = new JSPrimMesher.Quat(iaxis.X * s, iaxis.Y * s, iaxis.Z * s, c);
		retQuat.Normalize();
		return reQuat;
	},
	Length: function() {
		return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z + this.W * this.W);	
	},
	Normalize: function() {
		var mag = this.Length();
		if ( mag > 0.0000001 ) {
			var oomag = 1.0 / mag;
			this.X *= oomag;
			this.Y *= oomag;
			this.Z *= oomag;
			this.W *= oomag;
		} else {
			this.X = 0.0;
			this.Y = 0.0;
			this.Z = 0.0;
			this.W = 1.0;
		}
	},
	Mul: function ( q1, q2 ) {
		var x = q1.W * q2.X + q1.X * q2.W + q1.Y * q2.Z - q1.Z * q2.Y;
        var y = q1.W * q2.Y - q1.X * q2.Z + q1.Y * q2.W + q1.Z * q2.X;
		var z = q1.W * q2.Z + q1.X * q2.Y - q1.Y * q2.X + q1.Z * q2.W;
		var w = q1.W * q2.W - q1.X * q2.X - q1.Y * q2.Y - q1.Z * q2.Z;	
		return new JSPrimMesher.Quat( x, y, z, w ); 
	}, 
	ToString: function () {
		return "&gt; X: " + this.X + ", Y: " + this.Y + ", Z: " + this.Z + ", W: " + this.W + " &lt;";
	}
};

JSPrimMesher.Quat.Mul = function ( q1, q2 ) {
	var x = q1.W * q2.X + q1.X * q2.W + q1.Y * q2.Z - q1.Z * q2.Y;
	var y = q1.W * q2.Y - q1.X * q2.Z + q1.Y * q2.W + q1.Z * q2.X;
	var z = q1.W * q2.Z + q1.X * q2.Y - q1.Y * q2.X + q1.Z * q2.W;
	var w = q1.W * q2.W - q1.X * q2.X - q1.Y * q2.Y - q1.Z * q2.Z;	
	return new JSPrimMesher.Quat( x, y, z, w ); 
};
JSPrimMesher.Quat.QuatAxisAngle = function ( axis, angle ) {
	var iaxis = axis.Normalize();
	var iangle = angle * 0.5;
	var c = Math.cos(iangle);
	var s = Math.sin(iangle);
	var retQuat = new JSPrimMesher.Quat(iaxis.X * s, iaxis.Y * s, iaxis.Z * s, c);
	retQuat.Normalize();
	return retQuat;
};
