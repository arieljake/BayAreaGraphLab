var program = require("commander");
var Neo4Lib = require("neo4j-lib").Neo4Lib;
var Board = require("./Board.js");
var TraverseRelationships = require("./TraverseRelationships.js");

function getLib()
{
	var host = program.host ? program.host : "localhost";
	var port = program.port ? program.port : "7474";

	return new Neo4Lib(host,port);
}

program
	.version('0.0.1')
	.option('-d, --debug', 'debug mode')
	.option('-h, --host <host>', 'neo4j host')
	.option('-p, --port <port>', 'neo4j port');

program
	.command('edges <boardSize>')
	.description('print calculated edges per cell')
	.action(function(boardSize)
	{
		console.dir(Board.generateCells(boardSize));
	})

program
	.command('init <boardSize>')
	.description('build the gameboard')
	.action(function(boardSize)
	{
		var lib = getLib();
		var board = new Board(lib,boardSize);
		board.init(function()
		{
			console.log("start node: " + board.startNode.id);
		})
	});

program
	.command('board <endNode>')
	.description('get the gameboard')
	.action(function(endNode)
	{
		var lib = getLib();

		var traverseOp = new TraverseRelationships();
		traverseOp.traverse(lib,endNode,function(results)
		{
			var formatter = new NodesForSite();
			var ui = formatter.format(results);

			console.dir(ui);
		});
	});

program.parse(process.argv);
