"use strict";
/* 
JSPrimMesher Copyright(c) Teravus @ Dahlia https://github.com/Teravus/JSPrimMesher
JavaScript Port of PrimMesher - Teravus (teravus 47 gmail d0t c0m)

The primary developer of the original 
C# PrimMesher(http://forge.opensimulator.org/gf/project/primmesher/) is 
Dahlia Trimble.
 
Some portions of PrimMesher are from the following projects:
LibOpenMetaverse (quaternion multiplication routine)

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the JSPrimMesher Project nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE DEVELOPERS ``AS IS'' AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  
*/

var JSPrimMesher = JSPrimMesher || { REVISION: '2' };

JSPrimMesher.Angle = function(p_angle, x, y) {
	this.angle = p_angle || 0;
	this.X = x || 0;
	this.Y = y || 0;
};
JSPrimMesher.Angle.prototype = {
	constructor : JSPrimMesher.Angle
};

JSPrimMesher.AngleList = function() {
	this.iX = 0;
	this.iY = 0;	
	this.angles3 = new Array();
	this.normals3 = new Array();
	this.angles4 = new Array();
	this.normals4 = new Array();
	this.initialized = false;
	this.angles24 = new Array();
	this.angles = new Array();
	this.normals = new Array();
	this.angles3[0] = new JSPrimMesher.Angle(0, 1.0, 0);
	this.angles3[1] = new JSPrimMesher.Angle(0.33333333333333333, -0.5, 0.86602540378443871);
	this.angles3[2] = new JSPrimMesher.Angle(0.66666666666666667, -0.5, -0.86602540378443837);
	this.angles3[3] = new JSPrimMesher.Angle(1.0, 1.0, 0.0);
	
	this.normals3[0] = new JSPrimMesher.Coord(0.25, 0.4330127019, 0.0).Normalize();
	this.normals3[1] = new JSPrimMesher.Coord(-0.5, 0.0, 0.0).Normalize();
	this.normals3[2] = new JSPrimMesher.Coord(0.25, -0.4330127019, 0.0).Normalize();
	this.normals3[3] = new JSPrimMesher.Coord(0.25, 0.4330127019, 0.0).Normalize();
	
	this.angles4[0] = new JSPrimMesher.Angle(0.0, 1.0, 0.0);
	this.angles4[1] = new JSPrimMesher.Angle(0.25, 0.0, 1.0);
	this.angles4[2] = new JSPrimMesher.Angle(0.5, -1.0, 0.0);
	this.angles4[3] = new JSPrimMesher.Angle(0.75, 0.0, -1.0);
	this.angles4[4] = new JSPrimMesher.Angle(1.0, 1.0, 0.0);
	
	this.normals4[0] = new JSPrimMesher.Coord(0.5, 0.5, 0.0).Normalize();
	this.normals4[1] = new JSPrimMesher.Coord( -0.5, 0.5, 0.0).Normalize();
	this.normals4[2] = new JSPrimMesher.Coord( -0.5, -0.5, 0.0).Normalize();
	this.normals4[3] = new JSPrimMesher.Coord(0.5, -0.5, 0.0).Normalize();
	this.normals4[4] = new JSPrimMesher.Coord(0.5, 0.5, 0.0).Normalize();
	
	this.angles24[0] = new JSPrimMesher.Angle(0.0, 1.0, 0.0);
	this.angles24[1] = new JSPrimMesher.Angle(0.041666666666666664, 0.96592582628906831, 0.25881904510252074);
	this.angles24[2] = new JSPrimMesher.Angle(0.083333333333333329, 0.86602540378443871, 0.5);
	this.angles24[3] = new JSPrimMesher.Angle(0.125, 0.70710678118654757, 0.70710678118654746);
	this.angles24[4] = new JSPrimMesher.Angle(0.16666666666666667, 0.5, 0.8660254037844386);
	this.angles24[5] = new JSPrimMesher.Angle(0.20833333333333331, 0.25881904510252096, 0.9659258262890682);
	this.angles24[6] = new JSPrimMesher.Angle(0.25, 0.0, 1.0);
	this.angles24[7] = new JSPrimMesher.Angle(0.29166666666666663, -0.25881904510252063, 0.96592582628906831);
	this.angles24[8] = new JSPrimMesher.Angle(0.33333333333333333, -0.5, 0.86602540378443871);
	this.angles24[9] = new JSPrimMesher.Angle(0.375, -0.70710678118654746, 0.70710678118654757);
	this.angles24[10] = new JSPrimMesher.Angle(0.41666666666666663, -0.86602540378443849, 0.5);
	this.angles24[11] = new JSPrimMesher.Angle(0.45833333333333331, -0.9659258262890682, 0.25881904510252102);
	this.angles24[12] = new JSPrimMesher.Angle(0.5, -1.0, 0.0);
	this.angles24[13] = new JSPrimMesher.Angle(0.54166666666666663, -0.96592582628906842, -0.25881904510252035);
	this.angles24[14] = new JSPrimMesher.Angle(0.58333333333333326, -0.86602540378443882, -0.5);
	this.angles24[15] = new JSPrimMesher.Angle(0.62499999999999989, -0.70710678118654791, -0.70710678118654713);
	this.angles24[16] = new JSPrimMesher.Angle(0.66666666666666667, -0.5, -0.86602540378443837);
	this.angles24[17] = new JSPrimMesher.Angle(0.70833333333333326, -0.25881904510252152, -0.96592582628906809);
	this.angles24[18] = new JSPrimMesher.Angle(0.75, 0.0, -1.0);
	this.angles24[19] = new JSPrimMesher.Angle(0.79166666666666663, 0.2588190451025203, -0.96592582628906842);
	this.angles24[20] = new JSPrimMesher.Angle(0.83333333333333326, 0.5, -0.86602540378443904);
	this.angles24[21] = new JSPrimMesher.Angle(0.875, 0.70710678118654735, -0.70710678118654768);
	this.angles24[22] = new JSPrimMesher.Angle(0.91666666666666663, 0.86602540378443837, -0.5);
	this.angles24[23] = new JSPrimMesher.Angle(0.95833333333333326, 0.96592582628906809, -0.25881904510252157);
	this.angles24[24] = new JSPrimMesher.Angle(1.0, 1.0, 0.0);
	this.initialized = true;
};
JSPrimMesher.AngleList.prototype = {
	constructor : JSPrimMesher.AngleList,
	interpolatePoints : function ( newPoint, p1, p2 ) {
		var m = (newPoint - p1.angle) / (p2.angle - p1.angle);
        return new JSPrimMesher.Angle(newPoint, p1.X + m * (p2.X - p1.X), p1.Y + m * (p2.Y - p1.Y));
	},
	intersection : function ( x1, y1, x2, y2, x3, y3, x4, y4 ) {
		// ref: http://local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/
			var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
			var uaNumerator = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
			
			if (denom != 0.0)
            {
                var ua = uaNumerator / denom;
                this.iX = (x1 + ua * (x2 - x1));
                this.iY = (y1 + ua * (y2 - y1));
            }
	}, 
	makeAngles : function ( sides, startAngle, stopAngle ) {
		this.angles = new Array();
		this.normals = new Array();
		var twoPi = Math.PI * 2.0;
		var twoPiInv = 1.0 / twoPi;
		if (sides < 1) {
			throw "number of sides not greater then zero";
		}
		if (stopAngle <= startAngle) {
			throw "stopAngle not greater then startAngle";
		}
		if ((sides == 3) || (sides == 4) || (sides = 24)) {
			startAngle *= twoPiInv;
			stopAngle *= twoPiInv;
			
			var sourceAngles = new Array();
			
			if (sides == 3)
				sourceAngles = this.angles3;
			else if (sides == 4)
				sourceAngles = this.angles4;
			else
				sourceAngles = this.angles24;
				
			var startAngleIndex = ~~(startAngle * sides);
			var endAngleIndex = sourceAngles.length - 1;
			
			if (stopAngle < 1.0)
				endAngleIndex = (~~(stopAngle * sides) + 1);
				
			if (endAngleIndex == startAngleIndex)
				endAngleIndex++;
				
			for (var angleIndex = startAngleIndex; angleIndex < endAngleIndex + 1; angleIndex++)
			{
				this.angles.push(sourceAngles[angleIndex]);
				if (sides == 3)
					this.normals.push(this.normals3[angleIndex]);
				else if (sides == 4)
					this.normals.push(this.normals4[angleIndex]);
			}
			
			if (startAngle > 0.0)
				this.angles[0] = this.interpolatePoints(startAngle, this.angles[0], this.angles[1]);
			
			if (stopAngle < 1.0)
			{
				var lastAngleIndex = this.angles.length - 1;
				this.angles[lastAngleIndex] = this.interpolatePoints(stopAngle, this.angles[lastAngleIndex - 1], this.angles[lastAngleIndex]);
			}	
		} else {
			var stepSize = twoPi / sides;
			var startStep = ~~(startAngle / stepSize);
			var angle = stepSize * startStep;
			var step = startStep;
			var stopAngleTest = stopAngle;
			
			if (stopAngle < twoPi)
			{
				stopAngleTest = stepSize * (~~(stopAngle / stepSize) + 1);
				if (stopAngleTest < stopAngle)
					stopAngleTest += stepSize;
				if (stopAngleTest > twoPi)
					stopAngleTest = twoPi;
				
			}
			
			while (angle <= stopAngleTest)
			{
				var newAngle = new JSPrimMesher.Angle(angle, Math.cos(angle), Math.sin(angle));
				this.angles.push(newAngle);
				step += 1;
				angle = stepSize * step;
			}
			
			if (startAngle > this.angles[0].angle)
			{
				this.intersection(this.angles[0].X, this.angles[0].Y, this.angles[1].X, this.angles[1].Y, 0.0, 0.0, Math.cos(startAngle), Math.sin(startAngle));
				var newAngle1 = new JSPrimMesher.Angle(startAngle, this.iX, this.iY);
				this.angles[0] = newAngle1;
			}
			
			var index = this.angles.length - 1;
			if (stopAngle < this.angles[index].angle)
			{
				this.intersection(this.angles[index - 1].X, this.angles[index - 1].Y, this.angles[index].X, this.angles[index].Y, 0.0, 0.0, Math.cos(stopAngle), Math.sin(stopAngle));
				var newAngle2 = new JSPrimMesher.Angle(stopAngle, this.iX, this.iY);
				this.angles[index] = newAngle2;
			}
				
		}
		
	}
};
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
JSPrimMesher.PathType = { Linear : 0, Circular : 1, Flexible : 2 };

JSPrimMesher.PrimMesh = function ( psides, pprofileStart, pprofileEnd, phollow, phollowSides ) {
	this.errorMessage = "";
	this.twoPi = 2.0 * Math.PI;
	this.coords = new Array();
	this.normals = new Array();
	this.faces = new Array();
	this.viewerFaces = new Array();
	this.sides = 4;
	this.hollowSides = 4;
	this.profileStart = 0.0;
	this.profileEnd = 1.0;
	this.hollow = 0.0;
	
	this.twistBegin = 0;
	this.twistEnd = 0;
	this.topShearX = 0.0;
	this.topShearY = 0.0;
	this.pathCutBegin = 0.0;
	this.pathCutEnd = 1.0;
	this.dimpleBegin = 0.0;
	this.dimpleEnd = 1.0;
	this.skew = 0.0;
	this.holeSizeX = 1.0;
	this.holeSizeY = 0.25;
	this.taperX = 0.0;
	this.taperY = 0.0;
	this.radius = 0.0;
	this.revolutions = 1.0;
	this.stepsPerRevolution = 24;
	
	this.profileOuterFaceNumber = -1;
	this.profileHollowFaceNumber = -1;
	
	this.hasProfileCut = false;
	this.hasHollow = false;
	this.calcVertexNormals = false;
	this.normalsProcessed = false;
	this.viewerMode = false;
	this.sphereMode = false;
	
	this.numPrimFaces = 0;
	
	this.coords = new Array();
	this.faces = new Array();
	
	this.sides = psides || 4;
	this.profileStart = pprofileStart || 0.0;
	this.profileEnd = pprofileEnd || 1.0;
	this.hollow = phollow || 0.0;
	this.hollowSides = phollowSides || 4;
	
	if (psides < 3)
		this.sides = 3;
	if (phollowSides < 3)
		this.hollowSides = 3;
	if (pprofileStart < 0.0)
		this.profileStart = 0.0;
	if (pprofileEnd > 1.0)
		this.profileEnd = 1.0;
	if (pprofileEnd < 0.02)
		this.profileEnd = 0.02;
	if (pprofileStart >= pprofileEnd)
		this.profileStart = this.profileEnd - 0.02;
	if (phollow > 0.99)
		this.hollow = 0.99;
	if (phollow < 0.0)
		this.hollow = 0.0;
		
	this.hasProfileCut = (this.profileStart > 0.0 || this.profileEnd < 1.0);
	this.hasHollow = (this.hollow > 0.001);
};
JSPrimMesher.PrimMesh.prototype = {
	constructor: JSPrimMesher.PrimMesh,
	ParamsToDisplayString: function () {
		var s = "";
		s += "sides..................: " + this.sides;
		s += "\nhollowSides..........: " + this.hollowSides;
		s += "\nprofileStart.........: " + this.profileStart;
		s += "\nprofileEnd...........: " + this.profileEnd;
		s += "\nhollow...............: " + this.hollow;
		s += "\ntwistBegin...........: " + this.twistBegin;
		s += "\ntwistEnd.............: " + this.twistEnd;
		s += "\ntopShearX............: " + this.topShearX;
		s += "\ntopShearY............: " + this.topShearY;
		s += "\npathCutBegin.........: " + this.pathCutBegin;
		s += "\npathCutEnd...........: " + this.pathCutEnd;
		s += "\ndimpleBegin..........: " + this.dimpleBegin;
		s += "\ndimpleEnd............: " + this.dimpleEnd;
		s += "\nskew.................: " + this.skew;
		s += "\nholeSizeX............: " + this.holeSizeX;
		s += "\nholeSizeY............: " + this.holeSizeY;
		s += "\ntaperX...............: " + this.taperX;
		s += "\ntaperY...............: " + this.taperY;
		s += "\nradius...............: " + this.radius;
		s += "\nrevolutions..........: " + this.revolutions;
		s += "\nstepsPerRevolution...: " + this.stepsPerRevolution;
		s += "\nsphereMode...........: " + this.sphereMode;
		s += "\nhasProfileCut........: " + this.hasProfileCut;
		s += "\nhasHollow............: " + this.hasHollow;
		s += "\nviewerMode...........: " + this.viewerMode;
		return s;	
	},
	SurfaceNormalCoord : function ( c1, c2, c3 ) {
		var edge1 = new JSPrimMesher.Coord(c2.X - c1.X, c2.Y - c1.Y, c2.Z - c1.Z);
		var edge2 = new JSPrimMesher.Coord(c3.X - c1.X, c3.Y - c1.Y, c3.Z - c1.Z);
		var normal = JSPrimMesher.Coord.Cross(edge1, edge2);
		normal = normal.Normalize();
		return normal;
	},
	SurfaceNormalFace : function ( face ) {
		return SurfaceNormalCoord(this.coords[face.v1], this.coords[face.v2], this.coords[face.v3]);
	},
	SurfaceNormal : function ( faceIndex ) {
		var numFaces = this.faces.length;
		if (faceIndex < 0 || faceIndex >= numFaces)
			throw "faceIndex out of range";
		
		return SurfaceNormalFace(this.faces[faceIndex]);	
	}, 
	Copy : function () {
		var copy = new JSPrimMesher.PrimMesh(this.sides, this.profileStart, this.profileEnd, this.hollow, this.hollowSides);
		copy.twistBegin = this.twistBegin;
		copy.twistEnd = this.twistEnd;
		copy.topShearX = this.topShearX;
		copy.topShearY = this.topShearY;
		copy.pathCutBegin = this.pathCutBegin;
		copy.pathCutEnd = this.pathCutEnd;
		copy.dimpleBegin = this.dimpleBegin;
		copy.dimpleEnd = this.dimpleEnd;
		copy.skew = this.skew;
		copy.holeSizeX = this.holeSizeX;
		copy.holeSizeY = this.holeSizeY;
		copy.taperX = this.taperX;
		copy.taperY = this.taperY;
		copy.radius = this.radius;
		copy.revolutions = this.revolutions;
		copy.stepsPerRevolution = this.stepsPerRevolution;
		copy.calcVertexNormals = this.calcVertexNormals;
		copy.normalsProcessed = this.normalsProcessed;
		copy.viewerMode = this.viewerMode;
		copy.numPrimFaces = this.numPrimFaces;
		copy.errorMessage = this.errorMessage;
		
		copy.coords = this.coords.concat();
		copy.faces = this.faces.concat();
		copy.viewerFaces = this.viewerFaces.concat();
		copy.normals = this.normals.concat();
			
		return copy;	
	}, 
	CalcNormals : function () {
		if (normalsProcessed)
				return;
			
		normalsProcessed = true;
		
		var numFaces = faces.length;
		
		if (!this.calcVertexNormals)
			this.normals = new Array();
			
		for (var i = 0; i < numFaces; i++)
		{
			var face = faces[i];
			
			this.normals.push(this.SurfaceNormal(i).Normalize());
			
			var normIndex = normals.length - 1;
			face.n1 = normIndex;
			face.n2 = normIndex;
			face.n3 = normIndex;
			
			this.faces[i] = face;
		}	
	},
	AddPos : function ( x, y, z ) {
		var i = 0;
		var numVerts = this.coords.length;
		var vert = new JSPrimMesher.Coord(0,0);
		
		for (i = 0; i < numVerts; i++)
		{
			vert = this.coords[i];
			vert.X += x;
			vert.Y += y;
			vert.Z += z;
			this.coords[i] = vert;
		}
		
		if (this.viewerFaces)
		{
			var numViewerFaces = this.viewerFaces.length;
			for (i = 0; i < numViewerFaces; i++)
			{
				var v = this.viewerFaces[i];
				v.AddPos(x, y, z);
				this.viewerFaces[i] = v;
			}
		}	
	}, 
	AddRot : function ( q ) {
		var i = 0;
		var numVerts = this.coords.length;
		
		for (i = 0; i < numVerts; i++)
			this.coords[i] = JSPrimMesher.Coord.MulQuat(this.coords[i], q);
			
		if (this.normals)
		{
			var numNormals = this.normals.length;
			for (i = 0; i < numNormals; i++)
				this.normals[i] = JSPrimMesher.Coord.MulQuat(this.normals[i], q);
		}
		
		if (this.viewerFaces != null)
		{
			var numViewerFaces = this.viewerFaces.length;
			for (i = 0; i < numViewerFaces; i++)
			{
				var v = this.viewerFaces[i];
				v.v1 = Coord.MulQuat(v.v1, q);
				v.v2 = Coord.MulQuat(v.v2, q);
				v.v3 = Coord.MulQuat(v.v3, q);
				
				v.n1 = Coord.MulQuat(v.n1, q);
				v.n2 = Coord.MulQuat(v.n2, q);
				v.n3 = Coord.MulQuat(v.n3, q);
				this.viewerFaces[i] = v;
			}
		}	
	}, 
	Scale : function ( x, y, z ) {
		var i = 0;
		var numVerts = this.coords.length;
		
		var m = new JSPrimMesher.Coord(x, y, z);
		for (i = 0; i < numVerts; i++)
			this.coords[i] = JSPrimMesher.Coord.Mul(this.coords[i], m);
		
		
		if (this.viewerFaces != null)
		{
			var numViewerFaces = this.viewerFaces.length;
			for (i = 0; i < numViewerFaces; i++)
			{
				var v = this.viewerFaces[i];
				v.v1 = JSPrimMesher.Coord.Mul(v.v1, m);
				v.v2 = JSPrimMesher.Coord.Mul(v.v2, m);
				v.v3 = JSPrimMesher.Coord.Mul(v.v3, m);
				this.viewerFaces[i] = v;
			}
		}	
	},
	ProfileOuterFaceNumber : function() {
		return this.profileOuterFaceNumber;
	},
	ProfileHollowFaceNumber : function() {
		return this.profileHollowFaceNumber;
	},
	HasProfileCut : function() {
		return this.hasProfileCut;
	},
	HasHollow : function() {
		return this.hasHollow;
	},
	Extrude : function ( pathType ) {
		var needEndFaces = false;
		
		this.coords = new Array();
		this.faces = new Array();
		
		if (this.viewerMode) {
			this.viewerFaces = new Array();
			this.calcVertexNormals = true;
		}
		
		if (this.calcVertexNormals)
			this.normals = new Array();
		
		var steps = 1;
		
		var length = this.pathCutEnd - this.pathCutBegin;
		this.normalsProcessed = false;
		
		if (this.viewerMode && this.sides == 3) {
			// prisms don't taper well so add some vertical resolution
			// other prims may benefit from this but just do prisms for now
			if (Math.abs(this.taperX) > 0.01 || Math.abs(this.taperY) > 0.01) 
				steps = ~~(steps * 4.5 * length);
				
		}
		
		if (this.sphereMode)
			this.hasProfileCut = this.profileEnd - this.profileStart < 0.4999;
		else
			this.hasProfileCut = this.profileEnd - this.profileStart < 0.9999;
		this.hasHollow = (this.hollow > 0.001);
		
		var twistBegin = this.twistBegin / 360.0 * this.twoPi;
		var twistEnd = this.twistEnd / 360.0 * this.twoPi;
		var twistTotal = twistEnd - twistBegin;
		var twistTotalAbs = Math.abs(twistTotal);
		if (twistTotalAbs > 0.01)
			steps += ~~(twistTotalAbs * 3.66);
			
		var hollow = this.hollow;
		
		if (pathType == JSPrimMesher.PathType.Circular)
		{
			needEndFaces = false;
			if (this.pathCutBegin != 0.0 || this.pathCutEnd != 1.0)
				needEndFaces = true;
			else if (this.taperX != 0.0 || this.taperY != 0.0)
				needEndFaces = true;
			else if (this.skew != 0.0)
				needEndFaces = true;
			else if (twistTotal != 0.0)
				needEndFaces = true;
			else if (this.radius != 0.0)
				needEndFaces = true;
		}
		else needEndFaces = true;
		
		// sanity checks
		
		var initialProfileRot = 0.0;
		
		if (pathType == JSPrimMesher.PathType.Circular)
		{
			if (this.sides == 3)
			{
				initialProfileRot = Math.PI;
				if (this.hollowSides == 4)
				{
					if (hollow > 0.7)
						hollow = 0.7;
					hollow *= 0.707;
				}
				else 
					hollow *= 0.5;
			}
			else if (this.sides == 4)
			{
				initialProfileRot = 0.25 * Math.PI;
				if (this.hollowSides != 4)
					hollow *= 0.707;
			}
			else if (this.sides > 4)
			{
				initialProfileRot = Math.PI;
				if (this.hollowSides == 4)
				{
					if (hollow > 0.7)
						hollow = 0.7;
					hollow /= 0.7;
				}
			}
		}
		else 
		{
			if (this.sides == 3)
			{
				if (this.hollowSides == 4)
				{
					if (hollow > 0.7)
						hollow = 0.7;
					hollow *= 0.707;
				}
				else 
					hollow *= 0.5;
			}
			else if (this.sides == 4)
			{
				initialProfileRot = 1.25 * Math.PI;
				if (this.hollowSides != 4)
					hollow *= 0.707;
			}
			else if (this.sides == 24 && this.hollowSides == 4)
				hollow *= 1.414;
		}
		
		var profile = new JSPrimMesher.Profile(this.sides, this.profileStart, this.profileEnd, hollow, this.hollowSides, true, this.calcVertexNormals);
		this.errorMessage = profile.errorMessage;
		
		this.numPrimFaces = profile.numPrimFaces;
		
		var cut1FaceNumber = profile.bottomFaceNumber + 1;
		var cut2FaceNumber = cut1FaceNumber + 1;
		if (!needEndFaces)
		{
			cut1FaceNumber -= 2;
			cut2FaceNumber -= 2;
		}

		this.profileOuterFaceNumber = profile.outerFaceNumber;
		if (!needEndFaces)
			this.profileOuterFaceNumber--;

		if (this.hasHollow)
		{
			this.profileHollowFaceNumber = profile.hollowFaceNumber;
			if (!needEndFaces)
				this.profileHollowFaceNumber--;
		}

		
		var cut1Vert = -1;
		var cut2Vert = -1;
		
		if (this.hasProfileCut) {
			if (this.hasHollow) {
				cut1Vert = profile.coords.length - 1;
				cut2Vert = profile.numOuterVerts - 1;
			} else  {
				cut1Vert = 0;
				cut2Vert = profile.numOuterVerts;
			}
		}
		
		if (initialProfileRot != 0.0) {
			profile.AddRot(JSPrimMesher.Quat.QuatAxisAngle(new JSPrimMesher.Coord(0.0, 0.0, 1.0), initialProfileRot));
			if (this.viewerMode)
				profile.MakeFaceUVs();
		}
		
		var lastCutNormal1 = new JSPrimMesher.Coord();
		var lastCutNormal2 = new JSPrimMesher.Coord();
		
		var lastV = 0.0;
		var thisV = 0.0;
		
		var path = new JSPrimMesher.Path();
		path.twistBegin = twistBegin;
		path.twistEnd = twistEnd;
		path.topShearX = this.topShearX;
		path.topShearY = this.topShearY;
		path.pathCutBegin = this.pathCutBegin;
		path.pathCutEnd = this.pathCutEnd;
		path.dimpleBegin = this.dimpleBegin;
		path.dimpleEnd = this.dimpleEnd;
		path.skew = this.skew;
		path.holeSizeX = this.holeSizeX;
		path.holeSizeY = this.holeSizeY;
		path.taperX = this.taperX;
		path.taperY = this.taperY;
		path.radius = this.radius;
		path.revolutions = this.revolutions;
		path.stepsPerRevolution = this.stepsPerRevolution;
		
		path.Create(pathType, steps);
		//var pathNodeCount:uint = path.pathNodes.length;
		
		for (var nodeIndex = 0; nodeIndex < path.pathNodes.length; nodeIndex++) {
			var node = path.pathNodes[nodeIndex];
			//var newLayer  = JSON.parse(JSON.stringify(profile));
			var newLayer = profile.Copy(true);
			//var newLayer = new JSPrimMesher.Profile(this.sides, this.profileStart, this.profileEnd, hollow, this.hollowSides, true, this.calcVertexNormals);
			//if (initialProfileRot != 0.0) {
			//	newLayer.AddRot(JSPrimMesher.Quat.QuatAxisAngle(new JSPrimMesher.Coord(0.0, 0.0, 1.0), initialProfileRot));
			//	if (this.viewerMode)
			//		newLayer.MakeFaceUVs();
			//}
			newLayer.Scale(node.xScale, node.yScale);
			newLayer.AddRot(node.rotation);
			newLayer.AddPosCoord(node.position);
			
			if (needEndFaces && nodeIndex == 0) {
				newLayer.FlipNormals();
				
				// add the top faces to the viewerFaces list here
				if (this.viewerMode) {
					var faceNormal = newLayer.faceNormal;
					var newViewerFace = new JSPrimMesher.ViewerFace(profile.bottomFaceNumber);
					var numFaces = newLayer.faces.length;
					var facesa = newLayer.faces.concat();  // Need to concat?  (wasn't concat in original.
					
					for (var i = 0; i < numFaces; i++) {
						newViewerFace = new JSPrimMesher.ViewerFace(profile.bottomFaceNumber);
						var vface = facesa[i];
						newViewerFace.v1 = newLayer.coords[vface.v1].Copy();
						newViewerFace.v2 = newLayer.coords[vface.v2].Copy();
						newViewerFace.v3 = newLayer.coords[vface.v3].Copy();
						
						newViewerFace.coordIndex1 = vface.v1;
						newViewerFace.coordIndex2 = vface.v2;
						newViewerFace.coordIndex3 = vface.v3;
						
						newViewerFace.n1 = faceNormal.Copy();
						newViewerFace.n2 = faceNormal.Copy();
						newViewerFace.n3 = faceNormal.Copy();
						
						newViewerFace.uv1 = newLayer.faceUVs[vface.v1].Copy();
						newViewerFace.uv2 = newLayer.faceUVs[vface.v2].Copy();
						newViewerFace.uv3 = newLayer.faceUVs[vface.v3].Copy();
						
						if (pathType == JSPrimMesher.PathType.Linear)
						{
							newViewerFace.uv1 = newViewerFace.uv1.Flip();
							newViewerFace.uv2 = newViewerFace.uv2.Flip();
							newViewerFace.uv3 = newViewerFace.uv3.Flip();
						}
						
						this.viewerFaces.push(newViewerFace);
					}
				}
			} // if (nodeIndex == 0)
			// append this layer
			
			var coordsLen = this.coords.length;
			newLayer.AddValue2FaceVertexIndices(coordsLen);
			
			//this.coords = this.coords.concat(newLayer.coords);
			var vi = newLayer.coords.length;
			var destinationarraycount = coordsLen;
			while (vi--)
				this.coords[destinationarraycount + vi] = newLayer.coords[vi].Copy();
			
			if (this.calcVertexNormals) {
				newLayer.AddValue2FaceNormalIndices(this.normals.length);
				destinationarraycount = this.normals.length;
				vi = newLayer.vertexNormals.length;
				while (vi--)
					this.normals[destinationarraycount + vi] = newLayer.vertexNormals[vi].Copy();
				//this.normals = this.normals.concat(newLayer.vertexNormals);
			}
			
			if (node.percentOfPath < this.pathCutBegin + 0.01 || node.percentOfPath > this.pathCutEnd - 0.01)
				//this.faces = this.faces.concat(newLayer.faces);
				destinationarraycount = this.faces.length;
				vi = newLayer.faces.length;
				while (vi--)
					this.faces[destinationarraycount + vi] = newLayer.faces[vi].Copy();
				
			// fill faces between layers
			
			var numVerts = newLayer.coords.length;
			var newFace1 = new JSPrimMesher.Face(0,0,0);
			var newFace2 = new JSPrimMesher.Face(0,0,0);
			
			thisV = 1.0 - node.percentOfPath;
			
			if (nodeIndex > 0) {
				var startVert = coordsLen + 1;
				var endVert = this.coords.length;
				
				if (this.sides < 5 || this.hasProfileCut || this.hasHollow)
					startVert--;
				
				for (var i = startVert; i < endVert; i++) {
					var iNext  = i + 1;
					if (i == endVert - 1)
						iNext = startVert;
					
					var whichVert  = i - startVert;
					newFace1 = new JSPrimMesher.Face(0, 0, 0);
					newFace1.v1 = i;
					newFace1.v2 = i - numVerts;
					newFace1.v3 = iNext;

					newFace1.n1 = newFace1.v1;
					newFace1.n2 = newFace1.v2;
					newFace1.n3 = newFace1.v3;
					this.faces.push(newFace1);
					
					newFace2 = new JSPrimMesher.Face(0, 0, 0);
					newFace2.v1 = iNext;
					newFace2.v2 = i - numVerts;
					newFace2.v3 = iNext - numVerts;

					newFace2.n1 = newFace2.v1;
					newFace2.n2 = newFace2.v2;
					newFace2.n3 = newFace2.v3;
					this.faces.push(newFace2);
					
					if (this.viewerMode) {
						// add the side faces to the list of viewerFaces here
						
						var primFaceNum = profile.faceNumbers[whichVert];
						if (!needEndFaces)
							primFaceNum -= 1;
							
						var newViewerFace1 = new JSPrimMesher.ViewerFace(primFaceNum);
						var newViewerFace2 = new JSPrimMesher.ViewerFace(primFaceNum);
						
						var uIndex = whichVert;
						if (!this.hasHollow && this.sides > 4 && uIndex < newLayer.us.length - 1)
						{
							uIndex++;
						}
						
						var u1 = newLayer.us[uIndex];
						var u2 = 1.0;
						
						if (uIndex < (~~(newLayer.us.length)) - 1)
                                u2 = newLayer.us[uIndex + 1];
							
						if (whichVert == cut1Vert || whichVert == cut2Vert) {
							u1 = 0.0;
							u2 = 1.0;
						} else if (this.sides < 5) {
							if (whichVert < profile.numOuterVerts) { // boxes and prisms have one texture face per side of the prim, so the U values have to be scaled
								// to reflect the entire texture width
								
								u1 *= this.sides;
								u2 *= this.sides;
								u2 -= ~~(u1);
								u1 -= ~~(u1);
								if (u2 < 0.1)
									u2 = 1.0;
							}
						}
						if (this.sphereMode)
						{
							if (whichVert != cut1Vert && whichVert != cut2Vert)
							{
								u1 = u1 * 2.0 - 1.0;
								u2 = u2 * 2.0 - 1.0;

								if (whichVert >= newLayer.numOuterVerts)
								{
									u1 -= hollow;
									u2 -= hollow;
								}

							}
						}
						
						newViewerFace1.uv1.U = u1;
						newViewerFace1.uv2.U = u1;
						newViewerFace1.uv3.U = u2;

						newViewerFace1.uv1.V = thisV;
						newViewerFace1.uv2.V = lastV;
						newViewerFace1.uv3.V = thisV;

						newViewerFace2.uv1.U = u2;
						newViewerFace2.uv2.U = u1;
						newViewerFace2.uv3.U = u2;

						newViewerFace2.uv1.V = thisV;
						newViewerFace2.uv2.V = lastV;
						newViewerFace2.uv3.V = lastV;

						newViewerFace1.v1 = this.coords[newFace1.v1].Copy();
						newViewerFace1.v2 = this.coords[newFace1.v2].Copy();
						newViewerFace1.v3 = this.coords[newFace1.v3].Copy();

						newViewerFace2.v1 = this.coords[newFace2.v1].Copy();
						newViewerFace2.v2 = this.coords[newFace2.v2].Copy();
						newViewerFace2.v3 = this.coords[newFace2.v3].Copy();

						newViewerFace1.coordIndex1 = newFace1.v1;
						newViewerFace1.coordIndex2 = newFace1.v2;
						newViewerFace1.coordIndex3 = newFace1.v3;

						newViewerFace2.coordIndex1 = newFace2.v1;
						newViewerFace2.coordIndex2 = newFace2.v2;
                        newViewerFace2.coordIndex3 = newFace2.v3;
						
						 // profile cut faces
						if (whichVert == cut1Vert) {
							newViewerFace1.primFaceNumber = cut1FaceNumber;
							newViewerFace2.primFaceNumber = cut1FaceNumber;
							newViewerFace1.n1 = newLayer.cutNormal1;
							newViewerFace1.n2 = newViewerFace1.n3 = lastCutNormal1;

							newViewerFace2.n1 = newViewerFace2.n3 = newLayer.cutNormal1;
							newViewerFace2.n2 = lastCutNormal1;
						} else if (whichVert == cut2Vert) {
							newViewerFace1.primFaceNumber = cut2FaceNumber;
							newViewerFace2.primFaceNumber = cut2FaceNumber;
							newViewerFace1.n1 = newLayer.cutNormal2;
							newViewerFace1.n2 = lastCutNormal2;
							newViewerFace1.n3 = lastCutNormal2;

							newViewerFace2.n1 = newLayer.cutNormal2;
							newViewerFace2.n3 = newLayer.cutNormal2;
							newViewerFace2.n2 = lastCutNormal2;
						} else { // outer and hollow faces
						
							if ((this.sides < 5 && whichVert < newLayer.numOuterVerts) || (this.hollowSides < 5 && whichVert >= newLayer.numOuterVerts)) { 
							    // looks terrible when path is twisted... need vertex normals here
								newViewerFace1.CalcSurfaceNormal();
								newViewerFace2.CalcSurfaceNormal();
							} else {
								newViewerFace1.n1 = this.normals[newFace1.n1].Copy();
								newViewerFace1.n2 = this.normals[newFace1.n2].Copy();
								newViewerFace1.n3 = this.normals[newFace1.n3].Copy();

								newViewerFace2.n1 = this.normals[newFace2.n1].Copy();
								newViewerFace2.n2 = this.normals[newFace2.n2].Copy();
								newViewerFace2.n3 = this.normals[newFace2.n3].Copy();
							}
						}
						this.viewerFaces.push(newViewerFace1);
						this.viewerFaces.push(newViewerFace2);
					}
				}
			}
			
			lastCutNormal1 = newLayer.cutNormal1;
			lastCutNormal2 = newLayer.cutNormal2;
			lastV = thisV;
			
			if (needEndFaces && nodeIndex == path.pathNodes.length - 1 && this.viewerMode)
			{
				var faceNormal = newLayer.faceNormal;
				var newViewerFace = new JSPrimMesher.ViewerFace();
				newViewerFace.primFaceNumber = 0;
				var numFaces2  = newLayer.faces.length;
				var facesb = newLayer.faces;
				
				
				
				for (var i = 0; i < numFaces2; i++) {
					newViewerFace = new JSPrimMesher.ViewerFace();
					newViewerFace.primFaceNumber = 0;
					var vface = facesb[i];
					//trace((vface.v1 - coordsLen) + " " + vface.v1 + " " + coordsLen);
					newViewerFace.v1 = newLayer.coords[vface.v1 - coordsLen].Copy();
					newViewerFace.v2 = newLayer.coords[vface.v2 - coordsLen].Copy();
					newViewerFace.v3 = newLayer.coords[vface.v3 - coordsLen].Copy();

					newViewerFace.coordIndex1 = vface.v1 - coordsLen;
					newViewerFace.coordIndex2 = vface.v2 - coordsLen;
					newViewerFace.coordIndex3 = vface.v3 - coordsLen;

					newViewerFace.n1 = faceNormal.Copy();
					newViewerFace.n2 = faceNormal.Copy();
					newViewerFace.n3 = faceNormal.Copy();

					newViewerFace.uv1 = newLayer.faceUVs[vface.v1 - coordsLen];
					newViewerFace.uv2 = newLayer.faceUVs[vface.v2 - coordsLen];
					newViewerFace.uv3 = newLayer.faceUVs[vface.v3 - coordsLen];
					
					if (pathType == JSPrimMesher.PathType.Linear)
					{
						newViewerFace.uv1 = newViewerFace.uv1.Flip();
						newViewerFace.uv2 = newViewerFace.uv2.Flip();
						newViewerFace.uv3 = newViewerFace.uv3.Flip();
					}
					
					this.viewerFaces.push(newViewerFace);
				}
			}
			
		} // for (int nodeIndex = 0; nodeIndex < path.pathNodes.Count; nodeIndex++)
	}, 
	ExtrudeLinear: function() {
		this.Extrude(JSPrimMesher.PathType.Linear);
	}, 
	ExtrudeCircular: function() {
		this.Extrude(JSPrimMesher.PathType.Circular);
	}
};
JSPrimMesher.Profile = function ( psides, pprofileStart, pprofileEnd, phollow, phollowSides, pcreateFaces, pcalcVertexNormals )
{
	this.twoPi = 2.0 * Math.PI;
	this.errorMessage = "";
	this.coords = new Array();
	this.faces = new Array();
	this.vertexNormals = new Array();
	this.us = new Array();
	this.faceUVs = new Array();
	this.faceNumbers = new Array();
	this.outerCoordIndices = new Array();
	this.hollowCoordIndices = new Array();
	this.cut1CoordIndices = new Array();
	this.cut2CoordIndices = new Array();
	this.faceNormal = new JSPrimMesher.Coord(0.0,0.0,1.0);
	this.cutNormal1 = new JSPrimMesher.Coord(0,0,0);
	this.cutNormal2 = new JSPrimMesher.Coord(0,0,0);
	this.numOuterVerts = 0;
	this.numHollowVerts = 0;
	
	this.outerFaceNumber = -1;
	this.hollowFaceNumber = -1;
	
	this.bottomFaceNumber = 0;
	this.numPrimFaces = 0;
	
	var sides = psides || -1;
	var profileStart = pprofileStart || 0;
	var profileEnd = pprofileEnd || 0
	var hollow = phollow || 0;
	var hollowSides = phollowSides || 0;
	var createFaces = ( pcreateFaces !== undefined ) ? pcreateFaces : false; 
	this.calcVertexNormals = ( pcalcVertexNormals !== undefined ) ? pcalcVertexNormals : false; 
	
	if (sides == -1)
		return;
	var center = new JSPrimMesher.Coord(0,0,0);
	var hollowCoords = new Array();
	var hollowNormals = new Array();
	var hollowUs = new Array();
	
	if (this.calcVertexNormals) {
		this.outerCoordIndices = new Array();
		this.hollowCoordIndices = new Array();
		this.cut1CoordIndices = new Array();
		this.cut2CoordIndices = new Array();	
	}
	
	var hasHollow = ( hollow > 0.0 );
	var hasProfileCut = ( profileStart > 0.0 || profileEnd < 1.0 );
	
	var angles = new JSPrimMesher.AngleList();
	var hollowAngles = new JSPrimMesher.AngleList();
	
	var xScale = 0.5;
	var yScale = 0.5;
	
	if ( sides == 4 ) {// corners of a square are sqrt(2) from center
		xScale = 0.707107;
		yScale = 0.707107;
	}
	var startAngle = profileStart * this.twoPi;
	var stopAngle = profileEnd * this.twoPi;
	
	try {
		angles.makeAngles( sides, startAngle, stopAngle );
	} catch (ex) {
		errorMessage = "makeAngles failed : Exception " + ex.message + "\nsides: " + sides + " startAngle: " + startAngle + " stopAngle: " + stopAngle;
		return;
	}
	
	this.numOuterVerts = angles.angles.length;
			
	var simpleFace = (sides < 5 && !hasHollow && !hasProfileCut);
	
	if (hasHollow) {
		if (sides == hollowSides)
			hollowAngles = angles;
		else  {
			try {
				hollowAngles.makeAngles(hollowSides, startAngle, stopAngle);
			} catch (ex) {
				errorMessage = "makeAngles failed: Exception: " + ex.message
				+ "\nsides: " + sides + " startAngle: " + startAngle + " stopAngle: " + stopAngle;
				return;
			}
		}
		this.numHollowVerts = hollowAngles.angles.length;
	} else if (!simpleFace) {
		this.coords.push(center);
		if (this.calcVertexNormals)
			this.vertexNormals.push(new JSPrimMesher.Coord(0.0, 0.0, 1.0));
		this.us.push(0.0);
	}
	
	var z = 0.0;
	
	var angle = new JSPrimMesher.Angle(0,0,0);
	var newVert = new JSPrimMesher.Coord(0.0,0.0,0.0);
	if (hasHollow && hollowSides != sides) {
		var numHollowAngles = hollowAngles.angles.length;
		for (var i = 0; i < numHollowAngles; i++) {
			angle = hollowAngles.angles[i];
			newVert = new JSPrimMesher.Coord();
			newVert.X = hollow * xScale * angle.X;
			newVert.Y = hollow * yScale * angle.Y;
			newVert.Z = z;
			
			hollowCoords.push(newVert);
			if (this.calcVertexNormals) {
				if (hollowSides < 5)
					hollowNormals.push(hollowAngles.normals[i].Invert());
				else 
					hollowNormals.push(new JSPrimMesher.Coord( -angle.X, -angle.Y, 0.0));
					
				//hollowUs.push(angle.angle * hollow);
				if ( hollowSides == 4 ) 
					hollowUs.push(angle.angle * hollow * 0.707107);
				else 
					hollowUs.push(angle.angle * hollow);				
			}
		}
	}
	
	var index = 0;
	var numAngles = angles.angles.length;
	
	for (var i = 0; i < numAngles; i++) {
		angle = angles.angles[i];
		newVert = new JSPrimMesher.Coord(0,0,0);
		newVert.X = angle.X * xScale;
		newVert.Y = angle.Y * yScale;
		newVert.Z = z;
		this.coords.push(newVert);
		
		if (this.calcVertexNormals) {
			this.outerCoordIndices.push(this.coords.length - 1);
			var u = angle.angle;
			if (sides < 5) {
				this.vertexNormals.push(angles.normals[i]);
				this.us.push(u);
			} else {
				this.vertexNormals.push(new JSPrimMesher.Coord(angle.X, angle.Y, 0.0));
				this.us.push(u);
			}
		}
		
		if (hasHollow) {
			if (hollowSides == sides) {
				newVert = new JSPrimMesher.Coord(newVert.X, newVert.Y, newVert.Z);
				newVert.X *= hollow;
				newVert.Y *= hollow;
				newVert.Z = z;
				hollowCoords.push(newVert);
				
				if (this.calcVertexNormals) {
					if (sides < 5) {
						hollowNormals.push(angles.normals[i].Invert());
					}
					else 
						hollowNormals.push(new JSPrimMesher.Coord( -angle.X, -angle.Y, 0.0));
					
					hollowUs.push(angle.angle * hollow);
				}
			}
		}
		else if (!simpleFace && createFaces && angle.angle > 0.0001) {
			var newFace = new JSPrimMesher.Face(0,index,index + 1);
			
			this.faces.push(newFace);
		}
		index += 1;
	}
	if (hasHollow) {
		hollowCoords = hollowCoords.reverse();
		if (this.calcVertexNormals) {
			hollowNormals = hollowNormals.reverse();
			hollowUs = hollowUs.reverse();
		}
		
		if (createFaces) {
			var numTotalVerts = this.numOuterVerts + this.numHollowVerts;
			if (this.numOuterVerts == this.numHollowVerts) {
				
				for (var coordIndex = 0; coordIndex < this.numOuterVerts - 1; coordIndex++) {
					var newFace = new JSPrimMesher.Face(coordIndex,coordIndex + 1,numTotalVerts - coordIndex - 1);
					this.faces.push(newFace);
					newFace = new JSPrimMesher.Face(coordIndex + 1, numTotalVerts - coordIndex - 2, numTotalVerts - coordIndex - 1);
					this.faces.push(newFace);							
				}
			} else {
				if (this.numOuterVerts < this.numHollowVerts) {
					var j = 0;
					var maxJ = this.numOuterVerts - 1;
					for (var k = 0; k < this.numHollowVerts; k++) {
						if ( j < maxJ ) {
							if (angles.angles[j + 1].angle - hollowAngles.angles[k].angle < hollowAngles.angles[k].angle - angles.angles[j].angle + 0.000001) {
								var newFace = new JSPrimMesher.Face(numTotalVerts - k - 1, j, j + 1);
								this.faces.push(newFace);
								j += 1;
							}
						}
						
						var newFace = new JSPrimMesher.Face(j, numTotalVerts - k - 2, numTotalVerts - k - 1);
						this.faces.push(newFace);
					}
				} else  { // numHollowVerts < numOuterVerts 
				
					var jt = 0;
					var maxJ = this.numHollowVerts - 1;
					for (var k = 0; k < this.numOuterVerts; k++) {
						if (jt < maxJ) {
							if (hollowAngles.angles[jt + 1].angle - angles.angles[k].angle < angles.angles[k].angle - hollowAngles.angles[jt].angle + 0.000001) {
								var newFace = new JSPrimMesher.Face(k, numTotalVerts - jt - 2, numTotalVerts - jt - 1);
								this.faces.push(newFace);
								jt += 1;
							}
						}
						
						var newFacee = new JSPrimMesher.Face(numTotalVerts - jt - 1, k, k + 1);
						this.faces.push(newFacee);
					}
				}
			}
		}
		
		if (this.calcVertexNormals) {
			for (var ihc = 0; ihc < hollowCoords.length; ihc++) {
				this.coords.push(hollowCoords[ihc]);
				this.hollowCoordIndices.push(this.coords.length - 1);
			}
		} else {
			this.coords = this.coords.concat(hollowCoords);
		}
		
		if (this.calcVertexNormals) {
			this.vertexNormals = this.vertexNormals.concat(hollowNormals);
			this.us = this.us.concat(hollowUs);
		}
		
	}
	
	if (simpleFace && createFaces) {
		if (sides == 3) {
			this.faces.push(new JSPrimMesher.Face(0, 1, 2));
		} else if (sides == 4) {
			this.faces.push(new JSPrimMesher.Face(0, 1, 2));
			this.faces.push(new JSPrimMesher.Face(0, 2, 3));
		}
	}
	
	if (this.calcVertexNormals && hasProfileCut) {
		var lastOuterVertIndex = this.numOuterVerts - 1;
		if (hasHollow) {
			this.cut1CoordIndices.push(0);
			this.cut1CoordIndices.push(this.coords.length - 1);
			
			this.cut2CoordIndices.push(lastOuterVertIndex + 1);
			this.cut2CoordIndices.push(lastOuterVertIndex);
			
			this.cutNormal1.X = this.coords[0].Y - this.coords[this.coords.length - 1].Y;
			this.cutNormal1.Y = -(this.coords[0].X - this.coords[this.coords.length - 1].X);
			
			this.cutNormal2.X = this.coords[lastOuterVertIndex + 1].Y - this.coords[lastOuterVertIndex].Y;
			this.cutNormal2.Y = -(this.coords[lastOuterVertIndex + 1].X - this.coords[lastOuterVertIndex].X);
		} else {
			this.cut1CoordIndices.push(0);
			this.cut1CoordIndices.push(1);
			
			this.cut2CoordIndices.push(lastOuterVertIndex);
			this.cut2CoordIndices.push(0);
			this.cutNormal1.X = this.vertexNormals[1].Y;
			this.cutNormal1.Y = - this.vertexNormals[1].X;
			
			this.cutNormal2.X = -this.vertexNormals[this.vertexNormals.length - 2].Y;
			this.cutNormal2.Y = this.vertexNormals[this.vertexNormals.length - 2].X;
		}
		this.cutNormal1 = this.cutNormal1.Normalize();
		this.cutNormal2 = this.cutNormal2.Normalize();
	}
	
	this.MakeFaceUVs();
	hollowCoords = null;
	hollowNormals = null;
	hollowUs = null;
	
	if (this.calcVertexNormals) { // calculate prim face numbers
		// face number order is top, outer, hollow, bottom, start cut, end cut
		// I know it's ugly but so is the whole concept of prim face numbers
		
		var faceNum = 1; // start with outer faces
		var startVert = 0;
		this.outerFaceNumber = faceNum;
		
		if (hasProfileCut && !hasHollow)
			startVert = 1;
		else 
			startVert = 0;
		
		
		if (startVert > 0)
			this.faceNumbers.push( -1);
		
		for (var k = 0; k < this.numOuterVerts - 1; k++) {
			if (sides < 5)
				this.faceNumbers.push(faceNum++);
			else 
				this.faceNumbers.push(faceNum);
		}
		
		if (hasProfileCut)
			this.faceNumbers.push( -1);
		else 
			this.faceNumbers.push(faceNum++);
		
		if (sides > 4 && (hasHollow || hasProfileCut))
			faceNum++;
			
		if (sides < 5 && (hasHollow || hasProfileCut) && this.numOuterVerts < sides)
			faceNum++;
				
		if (hasHollow) {
			for (var kt = 0; kt < this.numHollowVerts; kt++)
				this.faceNumbers.push(faceNum);
			
			this.hollowFaceNumber = faceNum++;
		}
		
		this.bottomFaceNumber = faceNum++;
		
		if (hasHollow && hasProfileCut)
			this.faceNumbers.push(faceNum++);
		
		for (var k = 0; k < this.faceNumbers.length; k++) {
			if (this.faceNumbers[k] == -1)
				this.faceNumbers[k] = faceNum++;
		}
		this.numPrimFaces = faceNum;
	}
	
};
JSPrimMesher.Profile.prototype = {
	constructor: JSPrimMesher.Profile,
	MakeFaceUVs : function() {
		this.faceUVs = new Array();
		for (var i = 0; i < this.coords.length; i++) {
			this.faceUVs.push(new JSPrimMesher.UVCoord(1.0 - (0.5 + this.coords[i].X), 1.0 - (0.5 - this.coords[i].Y)));
		}
	},
	Copy : function( pneedfaces ) {
		var needfaces = ( pneedfaces !== undefined) ? pneedfaces : true;
		var copy = new JSPrimMesher.Profile();
		copy.coords = new Array(this.coords.length);
		var li = this.coords.length;
		while (li--) {
			copy.coords[li] = this.coords[li].Copy();	
		}
		
		
		copy.faceUVs = new Array(this.faceUVs.length);
		li = this.faceUVs.length;
		while (li--) {
			copy.faceUVs[li] = this.faceUVs[li].Copy();
		}
		
		
		if (needfaces)
		{
			copy.faces = new Array(this.faces.length);
			li=this.faces.length;
			while (li--) 
				copy.faces[li] = this.faces[li].Copy();			
		}
		if ((copy.calcVertexNormals = this.calcVertexNormals) == true)
		{
			copy.vertexNormals = new Array(this.vertexNormals.length);
			li=this.vertexNormals.length;
			while (li--) {
				copy.vertexNormals[li] = this.vertexNormals[li].Copy();	
			}
			
			copy.faceNormal = new JSPrimMesher.Coord(this.faceNormal.X, this.faceNormal.Y, this.faceNormal.Z);
			copy.cutNormal1 = new JSPrimMesher.Coord(this.cutNormal1.X, this.cutNormal1.Y, this.cutNormal1.Z);
			copy.cutNormal2 = new JSPrimMesher.Coord(this.cutNormal2.X, this.cutNormal2.Y, this.cutNormal2.Z);
			copy.us = JSON.parse(JSON.stringify(this.us));
			copy.faceNumbers = JSON.parse(JSON.stringify(this.faceNumbers));
			
			copy.cut1CoordIndices = JSON.parse(JSON.stringify(this.cut1CoordIndices));
			copy.cut2CoordIndices = JSON.parse(JSON.stringify(this.cut2CoordIndices));
			copy.hollowCoordIndices = JSON.parse(JSON.stringify(this.hollowCoordIndices));
			copy.outerCoordIndices = JSON.parse(JSON.stringify(this.outerCoordIndices));
		}
		copy.numOuterVerts = this.numOuterVerts;
		copy.numHollowVerts = this.numHollowVerts;
		
		return copy;
	},
	AddPosCoord : function ( v ) {
		this.AddPos( v.X, v.Y, v.Z );
	},
	AddPos : function ( x, y, z ) {
		var vert = new JSPrimMesher.Coord();
		var coordlength = this.coords.length;
		for (var i = 0; i < coordlength; i++) {
			vert = this.coords[i];
			vert.X += x;
			vert.Y += y;
			vert.Z += z;
			this.coords[i] = vert;
		}	
	}, 
	AddRot : function ( q ) {
		var coordlength = this.coords.length;
		for (var i = 0; i < coordlength; i++) {
			this.coords[i] = JSPrimMesher.Coord.MulQuat(this.coords[i], q);
		}
		
		if (this.calcVertexNormals) {
			var vertexNormallength = this.vertexNormals.length;
			for (var it = 0; it < vertexNormallength; it++) {
				this.vertexNormals[it] = JSPrimMesher.Coord.MulQuat(this.vertexNormals[it], q);
			}
			
			this.faceNormal = JSPrimMesher.Coord.MulQuat(this.faceNormal, q);
			this.cutNormal1 = JSPrimMesher.Coord.MulQuat(this.cutNormal1, q);
			this.cutNormal2 = JSPrimMesher.Coord.MulQuat(this.cutNormal2, q);
			
		}
	}, 
	Scale : function ( x, y ) {
		var vert = new JSPrimMesher.Coord(0,0,0);
		var numVerts = this.coords.length;
		for (var i = 0; i < numVerts; i++) {
			vert = this.coords[i];
			vert.X *= x;
			vert.Y *= y;
			this.coords[i] = vert;
		}
	},
	FlipNormals : function () {
		var i = 0;
		var numFaces = this.faces.length;
		var tmpFace = new JSPrimMesher.Face();
		var tmp = 0;
		
		for (i = 0; i < numFaces; i++)
		{
			tmpFace = this.faces[i];
			tmp = tmpFace.v3;
			tmpFace.v3 = tmpFace.v1;
			tmpFace.v1 = tmp;
			this.faces[i] = tmpFace;
		}
		
		if (this.calcVertexNormals) {
			var normalCount = this.vertexNormals.length;
			if (normalCount > 0) {
				var n = this.vertexNormals[normalCount - 1];
				n.Z = -n.Z;
				this.vertexNormals[normalCount - 1] = n;
			}
		}
		
		this.faceNormal.X = -this.faceNormal.X;
		this.faceNormal.Y = -this.faceNormal.Y;
		this.faceNormal.Z = -this.faceNormal.Z;
		
		var numfaceUVs = this.faceUVs.length;
		
		for (i = 0; i < numfaceUVs; i++)
		{
			var uv = this.faceUVs[i];
			uv.V = 1.0 - uv.V;
			this.faceUVs[i] = uv;
		}	
	},
	AddValue2FaceVertexIndices : function ( num ) {
		var numFaces = this.faces.length;
		var tmpFace = new JSPrimMesher.Face();
		for (var i = 0; i < numFaces; i++)
		{
			tmpFace = this.faces[i];
			tmpFace.v1 += num;
			tmpFace.v2 += num;
			tmpFace.v3 += num;
			
			this.faces[i] = tmpFace;
		}
	},
	AddValue2FaceNormalIndices : function ( num ) {
		if (this.calcVertexNormals) {
			var numFaces = this.faces.length;
			var tmpFace = new JSPrimMesher.Face();
			for (var i = 0; i < numFaces; i++) {
				tmpFace = this.faces[i];
				tmpFace.n1 += num;
				tmpFace.n2 += num;
				tmpFace.n3 += num;

				this.faces[i] = tmpFace;
			}
		}
	},
	DumpRaw : function () {
		var message = "";
			var faceCount = this.faces.length;
			for (var i = 0; i < faceCount; i++)
			{
				message = message.concat( this.coords[this.faces[i].v1].ToString() + " " + this.coords[this.faces[i].v2].ToString() + " " + this.coords[this.faces[i].v3].ToString() + "\n");
			}
			return message;
	}
};

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
 var JSVertexIndexer = JSVertexIndexer || { revision : '72' };

JSVertexIndexer.ViewerVertex = function(coord, normal, uv) 
{
    this.v = coord;
    this.n = normal;
    this.uv = uv;
};

JSVertexIndexer.ViewerVertex.prototype = {
    constructor : JSVertexIndexer.ViewerVertex
};


JSVertexIndexer.ViewerPolygon = function(v1, v2, v3)
{
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
};

JSVertexIndexer.ViewerPolygon.prototype = {
    constructor : JSVertexIndexer.ViewerPolygon
};


JSVertexIndexer.VertexIndexer = function(primMesh)
{
    var maxPrimFaceNumber = 0;
    for (var face = 0; face < primMesh.viewerFaces.length; face++)
    {
        var vf = primMesh.viewerFaces[face];
        if (maxPrimFaceNumber < vf.primFaceNumber)
            maxPrimFaceNumber = vf.primFaceNumber;
    }
    
    // public
    this.numPrimFaces = maxPrimFaceNumber + 1;
    this.viewerVertices = new Array(this.numPrimFaces);
    this.viewerPolygons = new Array(this.numPrimFaces);
    
    // private
    var viewerVertIndices = new Array(this.numPrimFaces);
    var numViewerVerts = new Array(this.numPrimFaces);
    var numVertsPerPrimFace = new Array(this.numPrimFaces);
    
    for (var i = 0; i < this.numPrimFaces; i++)
    {
        numViewerVerts[i] = 0;
        numVertsPerPrimFace[i] = 0;   
    }
    
    for (vf in primMesh.viewerFaces)
        numVertsPerPrimFace[vf.primFaceNumber] += 3;
    

    // create index lists
    for (var primFaceNumber = 0; primFaceNumber < this.numPrimFaces; primFaceNumber++)
    {
        // set all indices to -1 to indicate an invalid index
        var vertIndices = new Array(primMesh.coords.length);
        for (var i = 0; i < primMesh.coords.length; i++)
        {
            vertIndices[i] = -1;
        }
        viewerVertIndices[primFaceNumber] = vertIndices;
        
        this.viewerVertices[primFaceNumber] = new Array();
        this.viewerPolygons[primFaceNumber] = new Array();
    }

    for (var vfNdx = 0; vfNdx < primMesh.viewerFaces.length; vfNdx++)
    {
        var vf = primMesh.viewerFaces[vfNdx];
        var v1 = -1;
        var v2 = -1;
        var v3 = -1;
        
        var vertIndices = viewerVertIndices[vf.primFaceNumber];
        
        var viewerVerts = this.viewerVertices[vf.primFaceNumber];

        // add the vertices
        if (vertIndices[vf.coordIndex1] < 0)
        {
            viewerVerts.push(new JSVertexIndexer.ViewerVertex(vf.v1, vf.n1, vf.uv1));
            v1 = viewerVerts.length - 1;
            vertIndices[vf.coordIndex1] = v1;
        }
        else v1 = vertIndices[vf.coordIndex1];

        if (vertIndices[vf.coordIndex2] < 0)
        {
            viewerVerts.push(new JSVertexIndexer.ViewerVertex(vf.v2, vf.n2, vf.uv2));
            v2 = viewerVerts.length - 1;
            vertIndices[vf.coordIndex2] = v2;
        }
        else v2 = vertIndices[vf.coordIndex2];

        if (vertIndices[vf.coordIndex3] < 0)
        {
            viewerVerts.push(new JSVertexIndexer.ViewerVertex(vf.v3, vf.n3, vf.uv3));
            v3 = viewerVerts.length - 1;
            vertIndices[vf.coordIndex3] = v3;
        }
        else v3 = vertIndices[vf.coordIndex3];
        
        this.viewerPolygons[vf.primFaceNumber].push(new JSVertexIndexer.ViewerPolygon(v1, v2, v3));
    }
    
};

JSVertexIndexer.VertexIndexer.prototype = {
    constructor : JSVertexIndexer.VertexIndexer
};
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
		
	}
			
};