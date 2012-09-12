
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, db = require("./db")
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
app.get('/profile', routes.profile);
app.get('/v/data', routes.visualizeData);
app.get('/v/members', routes.visualizeMembers);
app.get('/v/tags', routes.visualizeTags);
app.get('/bubbles/:group/:stat', routes.sendBubbles);

app.get('/profile/fields', routes.profileFields);
app.get('/members', routes.sendOfType("member"));
app.get('/members/:stat', routes.sendMembersStat);
app.get('/members/:memberId/tags/:tagType', routes.sendMembersTagsOfType);
app.post('/members/:memberId/profile', routes.updateMemberProfile);
app.post('/members', routes.createMember);

app.get('/products', routes.sendOfType("product"));
app.get('/ideas', routes.sendOfType("idea"));
app.get('/interests', routes.sendOfType("interest"));
app.get('/academicFoci', routes.sendOfType("academicFocus"));

app.get('/product/:value/members', routes.sendMembersOfType("product","taggedProduct"));
app.get('/academicFocus/:value/members', routes.sendMembersOfType("academicFocus","taggedAcademicFocus"));
app.get('/interest/:value/members', routes.sendMembersOfType("interest","taggedInterest"));
app.get('/idea/:value/members', routes.sendMembersOfType("idea","taggedIdea"));

app.get('/meetup/bagl', function(req,res)
{
	// returnEEResult(routes.getMeetupGroupByGroupUrl,["bay-area-graph-lab"])
	res.sendfile(__dirname + "/public/data/bagl.json");
});
app.get('/meetup/bagl/events', function(req,res)
{
	// returnEEResult(routes.getEventsByGroupUrl,["bay-area-graph-lab"])
	res.sendfile(__dirname + "/public/data/bagl-events.json");
});
app.get('/meetup/bagl/members', function(req,res)
{
	// returnEEResult(routes.getMembersByGroupUrl,["bay-area-graph-lab"]));
	res.sendfile(__dirname + "/public/data/bagl-members.json");
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
	assureTypes();
});

function returnEEResult(fxn,args)
{
	return function(req,res)
	{
		var ee = fxn.apply(null,args);
		ee.on('complete',function(result)
		{
			res.send(result);
		});
	}
}

function returnResult(fxn,args)
{
	return function(req,res)
	{
		var result = fxn.apply(null,args);

		res.send(result);
	}
}

function assureTypes()
{
	var ee = db.TypeNodes.assureTypeNodes(neo4j);
	ee.on('complete',function(nodeTypes)
	{
		console.log("types created");
	});
}