
JSPrimMesher.Path = function() {
	this.pathNodes= new Array();
	this.twistBegin = 0.0;
	this.twistEnd = 0.0;
	this.topShearX = 0.0;
	this.topShearY = 0.0;
	this.pathCutBegin = 0.0;
	this.pathCutEnd = 1.0;
	this.dimpleBegin = 0.0;
	this.dimpleEnd = 1.0;
	this.skew = 0.0;
	this.holeSizeX = 1.0; // called pathScaleX in pbs
	this.holeSizeY = 0.25;
	this.taperX = 0.0;
	this.taperY = 0.0;
	this.radius = 0.0;
	this.revolutions = 1.0;
	this.stepsPerRevolution = 24;
	this.twoPi = 2.0 * Math.PI;
};
JSPrimMesher.Path.prototype = {
	constructor : JSPrimMesher.Path,
	Create : function ( pathType, steps ) {
		if (pathType == JSPrimMesher.PathType.Linear ||	pathType == JSPrimMesher.PathType.Flexible ) {
			var step = 0;
			var length = this.pathCutEnd - this.pathCutBegin;
			var twistTotal = this.twistEnd - this.twistBegin;
			var twistTotalAbs = Math.abs(twistTotal);
			if (twistTotalAbs > 0.01)
				steps += ~~(twistTotalAbs * 3.66); // dahlia's magic number
				
			var start = -0.5;
			var stepSize = length / steps;
			var percentOfPathMultiplier = stepSize * 0.999999;
			var xOffset = this.topShearX * this.pathCutBegin;
			var yOffset = this.topShearY * this.pathCutBegin;
			var zOffset = start;
			var xOffsetStepIncrement = this.topShearX * length / steps;
			var yOffsetStepIncrement = this.topShearY * length / steps;
			
			var percentOfPath = this.pathCutBegin;
			zOffset += percentOfPath;
			// sanity checks
			var done = false;
			while (!done) {
				var newNode = new JSPrimMesher.PathNode();
				
				newNode.xScale = 1.0;
				if (this.taperX == 0.0)
					newNode.xScale = 1.0;
				else if (this.taperX > 0.0)
					newNode.xScale = 1.0 - percentOfPath * this.taperX;
				else 
					newNode.xScale = 1.0 + (1.0 - percentOfPath) * this.taperX;
					
				newNode.yScale = 1.0;
				if (this.taperY == 0.0)
					newNode.yScale = 1.0;
				else if (this.taperY > 0.0)
					newNode.yScale = 1.0 - percentOfPath * this.taperY;
				else
					newNode.yScale = 1.0 + (1.0 - percentOfPath) * this.taperY;
					
				var twist = this.twistBegin + twistTotal * percentOfPath;
				
				newNode.rotation = JSPrimMesher.Quat.QuatAxisAngle(new JSPrimMesher.Coord(0, 0, 1), twist);
				newNode.position = new JSPrimMesher.Coord(xOffset, yOffset, zOffset);
				newNode.percentOfPath = percentOfPath;
				this.pathNodes.push(newNode);
				
				if (step < steps)
				{
					step += 1;
					percentOfPath += percentOfPathMultiplier;
					xOffset += xOffsetStepIncrement;
					yOffset += yOffsetStepIncrement;
					zOffset += stepSize;
					if (percentOfPath > this.pathCutEnd)
						done = true;
				}
				else 
					done = true;
			} // end of linear path code
		} else { // pathType == Circular 
			var twistTotal = this.twistEnd - this.twistBegin;
			
			// if the profile has a lot of twist, add more layers otherwise the layers may overlap
			// and the resulting mesh may be quite inaccurate. This method is arbitrary and doesn't
			// accurately match the viewer
			var twistTotalAbs = Math.abs(twistTotal);
			if (twistTotalAbs > 0.01)
			{
				if (twistTotalAbs > Math.PI * 1.5)
					steps *= 2;
					
				if (twistTotalAbs > Math.PI * 3.0)
					steps *= 2;
			}
			
			var yPathScale = this.holeSizeY * 0.5;
			var pathLength = this.pathCutEnd - this.pathCutBegin;
			var totalSkew = this.skew * 2.0 * pathLength;
			var skewStart = this.pathCutBegin * 2.0 * this.skew - this.skew;
			var xOffsetTopShearXFaxtor = this.topShearX * (0.25 + 0.5 * (0.5 - this.holeSizeY));
			var yShearCompensation = 1.0 + Math.abs(this.topShearY) * 0.25;
			
			// It's not quite clear what pushY (Y top shear) does, but subtracting it from the start and end
			// angles appears to approximate it's effects on path cut. Likewise, adding it to the angle used
			// to calculate the sine for generating the path radius appears to approximate it's effects there
			// too, but there are some subtle differences in the radius which are noticeable as the prim size
			// increases and it may affect megaprims quite a bit. The effect of the Y top shear parameter on
			// the meshes generated with this technique appear nearly identical in shape to the same prims when
			// displayed by the viewer.
			
			var startAngle = (this.twoPi * this.pathCutBegin * this.revolutions) - this.topShearY * 0.9;
			var endAngle = (this.twoPi * this.pathCutEnd * this.revolutions) - this.topShearY * 0.9;
			var stepSize = this.twoPi / this.stepsPerRevolution;
			
			var step = ~~(startAngle / stepSize);
			var angle = startAngle;
			
			var done = false;
			
			while (!done) // loop through the length of the path and add the layers
			{
				var newNode = new JSPrimMesher.PathNode();
				
				var xProfileScale = (1.0 - Math.abs(this.skew)) * this.holeSizeX;
				var yProfileScale = this.holeSizeY;
				
				var percentOfPath = angle / (this.twoPi * this.revolutions);
				var percentOfAngles = (angle - startAngle) / (endAngle - startAngle);
				
				if (this.taperX > 0.01)
					xProfileScale *= 1.0 - percentOfPath * this.taperX;
				else if (this.taperX < -0.01)
					xProfileScale *= 1.0 + (1.0 - percentOfPath) * this.taperX;
				
				if (this.taperY > 0.01)
					yProfileScale *= 1.0 - percentOfPath * this.taperY;
				else if (this.taperY < -0.01)
					yProfileScale *= 1.0 + (1.0 - percentOfPath) * this.taperY;
					
				newNode.xScale = xProfileScale;
				newNode.yScale = yProfileScale;
				
				var radiusScale = 1.0;
				
				if (this.radius > 0.001)
					radiusScale = 1.0 - this.radius * percentOfPath;
				else if (this.radius < 0.001)
					radiusScale = 1.0 + this.radius * (1.0 - percentOfPath);
					
				var twist = this.twistBegin + twistTotal * percentOfPath;
				
				var xOffset = 0.5 * (skewStart + totalSkew * percentOfAngles);
				xOffset += Math.sin(angle) * xOffsetTopShearXFaxtor;
				
				var yOffset = yShearCompensation * Math.cos(angle) * (0.5 - yPathScale) * radiusScale;
				var zOffset = Math.sin(angle + this.topShearY) * (0.5 - yPathScale) * radiusScale;
				
				newNode.position = new JSPrimMesher.Coord(xOffset, yOffset, zOffset);
				
				// now orient the rotation of the profile layer relative to it's position on the path
				// adding taperY to the angle used to generate the quat appears to approximate the viewer

				 newNode.rotation = JSPrimMesher.Quat.QuatAxisAngle(new JSPrimMesher.Coord(1.0, 0.0, 0.0), angle + this.topShearY);

				// next apply twist rotation to the profile layer
				if (twistTotal != 0.0 || this.twistBegin != 0.0)
					newNode.rotation = JSPrimMesher.Quat.Mul(newNode.rotation,JSPrimMesher.Quat.QuatAxisAngle(new JSPrimMesher.Coord(0.0, 0.0, 1.0), twist));

				newNode.percentOfPath = percentOfPath;

				this.pathNodes.push(newNode);

				// calculate terms for next iteration
				// calculate the angle for the next iteration of the loop

				if (angle >= endAngle - 0.01)
					done = true;
				else
				{
					step += 1;
					angle = stepSize * step;
					if (angle > endAngle)
						angle = endAngle;
				}
			}
		}
	}
};