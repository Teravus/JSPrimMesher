
JSPrimMesher.PathNode = function() {
	this.position = new JSPrimMesher.Coord();
	this.rotation = new JSPrimMesher.Quat(0,0,0,1);
	this.xScale = 0;
	this.yScale = 0;
	this.percentOfPath = 0;
};

JSPrimMesher.PathNode.prototype = {
	constructor : JSPrimMesher.PathNode	
};