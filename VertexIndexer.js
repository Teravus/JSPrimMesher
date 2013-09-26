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
    //console.log("primMesh.coords.length:" + primMesh.coords.length);
    for (var primFaceNumber = 0; primFaceNumber < this.numPrimFaces; primFaceNumber++)
    {
        // set all indices to -1 to indicate an invalid index
        var vertIndices = new Array(primMesh.coords.length);
        //viewerVertIndices[primFaceNumber] = new Array();
        for (var i = 0; i < primMesh.coords.length; i++)
        {
            vertIndices[i] = -1;
            //console.log("viewerVertIndices[" + primFaceNumber + "]:" + JSON.stringify(viewerVertIndices[primFaceNumber]));
        }
        viewerVertIndices[primFaceNumber] = vertIndices;
        //viewerVertices[primFaceNumber] = new Array(numVertsPerPrimFace[primFaceNumber]);
        this.viewerVertices[primFaceNumber] = new Array();
        this.viewerPolygons[primFaceNumber] = new Array();
    }

    for (var vfNdx = 0; vfNdx < primMesh.viewerFaces.length; vfNdx++)
    //for (var vfNdx in primMesh.viewerFaces)
    {
        var vf = primMesh.viewerFaces[vfNdx];
        //console.log("vfNdx:" + vfNdx + " vf:" + JSON.stringify(vf));
        var v1 = -1;
        var v2 = -1;
        var v3 = -1;
        
        var vertIndices = viewerVertIndices[vf.primFaceNumber];
        console.log("face:" + vf.primFaceNumber + " vertIndices:" + JSON.stringify(vertIndices));
        
        var viewerVerts = this.viewerVertices[vf.primFaceNumber];

        // add the vertices
        //console.log("indexer: vertIndices:" + JSON.stringify(vertIndices));
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