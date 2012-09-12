
, db = require("./db")
	, neo4jlib = require("neo4j-lib")
var Neo4Lib = neo4jlib.Neo4Lib;
var neo4j = new Neo4Lib("localhost",7474);

var routes = {
	"GET": {

		"/" : routes.index
		, "/v/profile" : routes.renderProfile
		, "/v/data" : routes.renderData
		, "/v/members" : routes.renderMembers
		, "/v/tags" : routes.renderTags
		, "/bubbles/1" : routes.getBubble1
		, "/data/profileFields.json" : routes.getProfileFields
		, "/:coreDataType" : routes.getCoreData
		, "/members/:stat" : routes.get
		, "/members/:memberId/tags/:tagType" : routes.sendMembersTagsOfType
		, "/members/:memberId/profile" : routes.updateMemberProfile
		, "/members" : routes.createMember

		, "/products" : routes.sendOfType("product"));
		, "/ideas" : routes.sendOfType("idea"));
		, "/interests" : routes.sendOfType("interest"));
		, "/academicFoci" : routes.sendOfType("academicFocus"));

		, "/product/:value/members" : routes.sendMembersOfType("product","taggedProduct"));
		, "/academicFocus/:value/members" : routes.sendMembersOfType("academicFocus","taggedAcademicFocus"));
		, "/interest/:value/members" : routes.sendMembersOfType("interest","taggedInterest"));
		, "/idea/:value/members" : routes.sendMembersOfType("idea","taggedIdea")
	}
};

		, ");

		, "/meetup/bagl', function(req,res)
{
	// returnEEResult(routes.getMeetupGroupByGroupUrl,["bay-area-graph-lab"])
	res.sendfile(__dirname + "/public/data/bagl.json");
});
		, "/meetup/bagl/events', function(req,res)
{
	// returnEEResult(routes.getEventsByGroupUrl,["bay-area-graph-lab"])
	res.sendfile(__dirname + "/public/data/bagl-events.json");
});
		, "/meetup/bagl/members', function(req,res)
{
	// returnEEResult(routes.getMembersByGroupUrl,["bay-area-graph-lab"]));
	res.sendfile(__dirname + "/public/data/bagl-members.json");
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