
JSPrimMesher.UVCoord = function(u, v) {
	this.U = u || 0;
	this.V = v || 0;
};

JSPrimMesher.UVCoord.prototype = {
	constructor : JSPrimMesher.UVCoord, 
	Flip: function() {
		return new JSPrimMesher.UVCoord(1.0 - this.U, 1.0 - this.V);
	}, 
	Copy : function() {
		return new JSPrimMesher.UVCoord(this.U, this.V);	
	}
};
 