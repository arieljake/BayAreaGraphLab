var express = require('express');
var Neo4Lib = require("neo4j-lib").Neo4Lib;
var TraverseRelationships = require("./TraverseRelationships.js");
var WinningTraversal = require("./CypherWinningTraversal.js");
var NodeFormatter = require("./FormatNodesForArbor.js");
var Board = require("./Board.js");
var _ = require("underscore");

var port = 3000;
var app = express.createServer();
var lib = getLib();

app.configure(function ()
{
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.logger());
	app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/uploads" }))
	app.use(express.query());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
});

app.get('/board/init', function (request, response)
{
	var boardSize = request.query.boardSize;

	if (boardSize === undefined)
		boardSize = 3;

	var board = new Board(lib,boardSize);
	board.init(function()
	{
		response.send({
			boardSize: boardSize,
			startNode: board.startNode.id
		});
	})
});

app.get('/board', function (request, response)
{
	var endNode = request.query.endNode;

	var traverseOp = new TraverseRelationships();
	traverseOp.traverse(lib,endNode,function(results)
	{
		var ui = NodeFormatter.format(results);
		var nodeList = [];

		_.keys(ui.nodes).forEach(function(item)
		{
			nodeList.push(item.replace("node",""));
		});

		WinningTraversal.getWinningNodes(nodeList,lib,function(results)
		{
			ui.winningQuery = results.query;
			ui.winningNodes = results.winningNodes;

			response.send(ui);
		});
	});
});

app.get('/cell/select/:nodeId',function(request,response)
{
	var ee = lib.setNodeProperty(request.params.nodeId,"selected","true");
	ee.on('complete',function(result)
	{
		response.send({result: "OK"});
	});
});

app.get('/cell/unselect/:nodeId',function(request,response)
{
	var ee = lib.setNodeProperty(request.params.nodeId,"selected","false");
	ee.on('complete',function(result)
	{
		response.send({result: "OK"});
	});
});

app.listen(port, function()
{
	console.log("Listening on " + port);
});

function getLib()
{
	var host = "localhost";
	var port = "7474";

	return new Neo4Lib(host,port);
}