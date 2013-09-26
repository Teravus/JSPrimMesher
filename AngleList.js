
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