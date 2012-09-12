var Neo4Lib = require("neo4j-lib").Neo4Lib;
var program = require("commander");
var db = require("");
var Meetup = require("./meetup");

var neo4j = new Neo4Lib("localhost",7474);
var meetup = Meetup.key("5424df694f5c726b96d6820353849");
var groupUrl = "bay-area-graph-lab";

program
	.version('0.0.1')
	.option('-d, --debug', 'debug mode')
	.option('-h, --host <host>', 'hostname of neo4j instance', function (val) {
		neo4j.host = val;
	})
	.option('-p, --port <port>', 'port of neo4j instance', function (val) {
		neo4j.port = val;
	});

program
	.command('import <type>')
	.description('assure node types in neo4j')
	.action(function(type)
	{
		switch (type)
		{
			case "nodetypes":
				var ee = db.TypeNodes.assureTypeNodes(neo4j);
				ee.on('complete',function(nodeTypes)
				{
					console.log("nodeTypes: " + nodeTypes);

					ee = db.TypeNodes.getTypeNodes(neo4j);
					ee.on('complete', function(nodes)
					{
						console.dir(nodes);
					});
				});
				break;

			case "members":

				break;
		}
	});

//4408872

program
	.command('bagl')
	.description('get bagl info')
	.action(function(){
		var ee = meetup.getByGroupUrl(groupUrl);
		ee.on('complete', function(results)
		{
			console.dir(results);
		});
	});

program
	.command('bagl-members')
	.description('get bagl members list')
	.action(function(){
		var ee = meetup.getMembersByGroupUrl(groupUrl);
		ee.on('complete', function(results)
		{
			console.dir(results);
		});
	});

program
	.command('bagl-events')
	.description('get bagl members list')
	.action(function(){
		var ee = meetup.getEventsByGroupUrl(groupUrl);
		ee.on('complete', function(results)
		{
			console.dir(results);
		});
	});

program.parse(process.argv);
