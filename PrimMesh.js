
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
		normalsProcessed = false;
		
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
		path.twistBegin = this.twistBegin;
		path.twistEnd = this.twistEnd;
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
							newViewerFace.uv1.Flip();
							newViewerFace.uv2.Flip();
							newViewerFace.uv3.Flip();
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
						newViewerFace.uv1.Flip();
						newViewerFace.uv2.Flip();
						newViewerFace.uv3.Flip();
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