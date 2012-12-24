
var Operation = require("neo4j-lib").Operation;
var CompoundOperation = require("neo4j-lib").CompoundOperation;
var Node = require("neo4j-lib").Node;

var Board = module.exports = function(lib,size)
{
	this.lib = lib;
	this.size = size;
}

Board.prototype.init = function(cb)
{
	var op = new CompoundOperation();

	var self = this;
	var lib = this.lib;
	var boardSize = this.size;
	var numCells = boardSize * boardSize;

	for (var i=0; i < numCells; i++)
	{
		var cellId = "cell" + i;
		var index = i;
		var nodeOp = function (index)
		{
			return new Operation(cellId,function(lib,context)
			{
				return lib.createNode({
					type: "cell",
					index: index,
					selected: "false"
				});
			});
		}(index);

		op.addOp(nodeOp);
	}

	var edgesToCreate = Board.generateEdgesPerCell(boardSize);

	for (var i=0; i < edgesToCreate.length; i++)
	{
		var edgeData = edgesToCreate[i];

		var cellIndex = edgeData.cell;
		var edgeTypes = edgeData.edges;

		for (var j=0; j < edgeTypes.length; j++)
		{
			var edgeType = edgeTypes[j];
			var relationshipId = "rel" + i + j;
			var toCellIndex = getEdgeFrom(cellIndex,edgeType);
			var relOp = function (relationshipId,relType,curCellIndex,toCellIndex)
			{
				return new Operation(relationshipId,function(lib,context)
				{
					var curCell = Node.fromResult(context["cell" + curCellIndex]);
					var toCell = Node.fromResult(context["cell" + toCellIndex]);

					if (toCell === null)
					{
						console.dir({
							curCell: curCellIndex,
							toCell: toCellIndex
						});

						process.exit(1);
					}
					else
					{
						return lib.createRelationship(curCell.id,toCell.id,relType,{});
					}
				});
			}(relationshipId,edgeType,cellIndex,toCellIndex);

			op.addOp(relOp);
		}
	}

	op.execute(lib,function()
	{
		self.startNode = Node.fromResult(op.results["cell0"]);

		cb();
	})
};

Board.generateEdgesPerCell = function(boardSize)
{
	var edges = [];
	var numCells = boardSize * boardSize;

	for (var i=0; i < numCells; i++)
	{
		var cellDesc = getCellDesc(i,boardSize);

		edges.push({
			cell: i,
			edges: getEdges(cellDesc)
		})
	}

	return edges;
};

function getCellDesc(cellIndex,boardSize)
{
	var cellCol = getCellCol(cellIndex,boardSize);
	var cellRow = getCellRow(cellIndex,boardSize);

	var cellDesc = [];

	if (cellCol == 0)
		cellDesc.push(firstCol);
	else if (cellCol == (boardSize-1))
		cellDesc.push(lastCol);
	else
		cellDesc.push(middleCol);

	if (cellRow == 0)
		cellDesc.push(firstRow);
	else if (cellRow == (boardSize-1))
		cellDesc.push(lastRow);
	else
		cellDesc.push(middleRow);

	return cellDesc;
}

function getEdges(edgeFxns)
{
	var edges = [];

	["T","L","R","B","TL","TR","BL","BR"].forEach(function(edge)
	{
		var ok = true;
		edgeFxns.forEach(function(edgeFxn)
		{
			if (!edgeFxn(edge))
			{
				ok = false;
			}
		})

		if (ok)
			edges.push(edge);
	})

	return edges;
}

function getEdgeFrom(cell,dir)
{
	switch (dir)
	{
		case "L":
			return cell - 1;
		case "R":
			return cell + 1;
		case "T":
			return cell - 3;
		case "B":
			return cell + 3;
		case "TL":
			return cell - 4;
		case "TR":
			return cell - 2;
		case "BL":
			return cell + 2;
		case "BR":
			return cell + 4;
	}
}

function getCellCol(cellIndex,boardSize)
{
	return cellIndex % boardSize;
}

function getCellRow(cellIndex,boardSize)
{
	return Math.floor(cellIndex / boardSize);
}

function firstRow(edge)
{
	return edge.indexOf("T") == -1;
}

function middleRow(edge)
{
	return true;
}

function lastRow(edge)
{
	return edge.indexOf("B") == -1;
}

function firstCol(edge)
{
	return edge.indexOf("L") == -1;
}

function middleCol(edge)
{
	return true;
}

function lastCol(edge)
{
	return edge.indexOf("R") == -1;
}