
/**
 * Module dependencies.
 */

var util = require("util");
var spawn = require("child_process").spawn;
var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, neo4jlib = require("neo4j-lib");

var app = express();
var Neo4Lib = neo4jlib.Neo4Lib;
var neo4j = new Neo4Lib("localhost",7474);

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/createNodes', routes.createNodes);

http.createServer(app).listen(app.get('port'), function(){

	// startNeo4J();

	console.log("Express server listening on port " + app.get('port'));
});


function startNeo4J()
{
	startProgram(["start"],"/Users/arieljake/Downloads/Neo4J/neo4j-community-1.8.M04/bin/neo4j");
}

var noRestartOn = null;
var crash_queued = false;

function startProgram (prog, exec)
{
	util.debug("Starting child process with '" + exec + " " + prog.join(" ") + "'");
	crash_queued = false;

	var child = exports.child = spawn(exec, prog);
	child.stdout.addListener("data", function (chunk) { chunk && util.print(chunk); });
	child.stderr.addListener("data", function (chunk) { chunk && util.debug(chunk); });
	child.addListener("exit", function (code)
	{

	});
}