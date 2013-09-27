
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
