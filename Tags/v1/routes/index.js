var fs = require("fs");
var _ = require("underscore");
var neo4jlib = require("neo4j-lib");
var mongoskin = require("mongoskin");
var bubbles = require("./bubbles.js");
var cyphers = require("./cyphers.js");
var EventEmitter = require("events").EventEmitter;
var Meetup = require("meetup");

var Neo4Lib = neo4jlib.Neo4Lib;
var Node = neo4jlib.Node;
var CompoundOperation = neo4jlib.CompoundOperation;
var Operation = neo4jlib.Operation;

var neoDB = new Neo4Lib("localhost", "7474");
var title = 'B.A.G.L. #1';
var meetup = Meetup.key("5424df694f5c726b96d6820353849");

exports.index = function(req, res)
{
  	res.render('index', { title: title});
};

exports.profile = function(req, res)
{
	res.render('profile', { title: title});
};

exports.visualizeData = function(req, res)
{
	res.render('data', { title: title});
};

exports.visualizeMembers = function(req,res)
{
	res.render('members', {title: title})
}

exports.visualizeTags = function(req, res)
{
	res.render('tags', { title: title});
}

exports.profileFields = function(req, res)
{
	res.sendfile(process.cwd() + "/public/data/fields.json");
}

exports.sendOfType = function(t)
{
	return (function(type)
	{
		return function(req,res)
		{
			var cypher = cyphers.createMemberStatCypher(neoDB);
			cypher.getOfTypeAnd(type,function(ofType)
			{
				res.send(formatTypeMembers(ofType));
			});
		}
	})(t);
};

exports.sendMembersStat = function(req,res)
{
	var stat = req.params["stat"];
	var cypher = cyphers.createMemberStatCypher(neoDB);

	cypher.getMemberStatsAnd(stat,function(results)
	{
		res.send(formatTypeMembers(results));
	});
};

exports.sendMembersTagsOfType = function(req,res)
{
	var memberId = req.params["memberId"];
	var tagType = req.params["tagType"];
	var cypher = cyphers.createMemberStatCypher(neoDB);

	cypher.getMemberTagsOfType(memberId,tagType,function(results)
	{
		res.send(formatTypeMembers(results));
	});
}

exports.sendMembersOfType = function(type,relType)
{
	return (function (t,r)
	{
		return function(req,res)
		{
			var value = req.params["value"];
			var cypher = cyphers.createMembersByCypher(neoDB);

			cypher.getMembersByOfType(type,relType,value,function(results)
			{
				res.send(formatTypeMembers(results));
			});
		}

	})(type,relType);
};

exports.sendBubbles = function(req,res)
{
	var bubble = new bubbles.GroupStatBubble(req.params["group"],req.params["stat"]);
	bubble(req,res);
};

exports.createMember = function(req, res)
{
	var memberName = req.body.memberName;
	var op = new CompoundOperation();

	create "member" with {name: "Ariel Jakobovits"}

	START typeNode=node:types(name = "member")
	CREATE UNIQUE typeNode<-[r:is]-(ofType {name: "Ariel Jakobovits"})
	RETURN typeNode, r, ofType

	op.addOp(new Operation("newMember",function(lib,context)
	{
		return lib.createNodeINE({
			name: memberName
		},{
			indexName: "member",
			key: "name",
			value: memberName
		});
	}));

	op.addOp(new Operation("memberType",function(lib,context)
	{
		return lib.getNodesFromIndex("types", "name", "member");
	}));

	op.addOp(new Operation("memberRel", function(lib,context)
	{
		var newMemberNode = Node.fromResult(context["newMember"]);
		var memberTypeNode = Node.fromResult(context["memberType"][0]);

		return lib.createRelationship(newMemberNode.id,memberTypeNode.id,"is",{});
	}));

	var ee = op.execute(neoDB,function()
	{
		res.send("member created");
	});
}

exports.updateMemberProfile = function(req, res)
{
	var ee = new EventEmitter();
	var memberId = req.params["memberId"];
	var profile = req.body;
	var profileKeys = _.keys(profile);
	var op = new CompoundOperation();
	var cypher = cyphers.createMembersByCypher(neoDB);

	fs.writeFile(__dirname + "/public/data/profiles/" + memberId + ".json")

	cypher.deleteMemberTags(memberId,function(results)
	{
		// GET MEMBER

		op.addOp((function (id)
		{
			return new Operation("theMember",function(lib,context)
			{
				return lib.getNode(id);
			});

		})(memberId));

		// GET TAG TYPES

		profileKeys.forEach(function(key)
		{
			op.addOp((function (type)
			{
				return new Operation(type,function(lib,context)
				{
					return lib.getNodesFromIndex("types","name",type);
				});

			})(key));
		});

		// SAVE TAGS

		var tags = [];

		profileKeys.forEach(function(key)
		{
			var values = profile[key].toLowerCase().split(",");

			if (values.length > 0)
			{
				values.forEach(function(value)
				{
					if (value.length > 0)
					{
						var tag = {
							value: value,
							group: key
						};

						tags.push(tag);

						// CREATE THE VALUE
						op.addOp((function (type,term)
						{
							return new Operation(type + term,function(lib,context)
							{
								return lib.createNodeINE({
									name: term
								},{
									indexName: type,
									key: "name",
									value: term
								});
							});

						})(tag.group,tag.value));

						// GET TAG RELS
						op.addOp((function (type,term)
						{
							return new Operation(type + term + "relsOut",function(lib,context)
							{
								var termNode = Node.fromResult(context[type + term]);

								return lib.getNodeRelationshipsOut(termNode.id);
							});

						})(tag.group,tag.value));

						// RELATE VALUE TO TYPE
						op.addOp((function (type,term)
						{
							return new Operation("",function(lib,context)
							{
								var typeNode = Node.fromResult(context[type]);
								var termNode = Node.fromResult(context[type + term]);
								var termRels = context[type + term + "relsOut"];

								if (termRels.length > 0)
								{
									return null;
								}
								else
								{
									return lib.createRelationship(termNode.id,typeNode.id,"is",{});
								}
							})
						})(tag.group,tag.value));
					}
				});
			}
		});

		// RELATE MEMBER TO TAGS

		tags.forEach(function(tag)
		{
			op.addOp((function (t,g)
			{
				return new Operation("",function(lib,context)
				{
					var memberNode = Node.fromResult(context.theMember);
					var termNode = Node.fromResult(context[g + t]);

					if (termNode != null)
					{
						return lib.createRelationship(memberNode.id,termNode.id,"tagged",{});
					}
					else
					{
						console.log("context");
						console.dir(context);
						process.exit(1);
						return null;
					}
				})
			})(tag.value,tag.group));
		});

		op.execute(neoDB,function()
		{
			ee.emit('complete');
		});
	});
};

exports.getMeetupGroupByGroupUrl = function(groupUrl)
{
	var groupEE = new EventEmitter();

	var ee = meetup.getByGroupUrl(groupUrl);
	ee.on('complete', function(results)
	{
		groupEE.emit('complete',results);
	});

	return groupEE;
}

exports.getMembersByGroupUrl = function(groupUrl)
{
	var memberEE = new EventEmitter();

	var ee = meetup.getMembersByGroupUrl(groupUrl);
	ee.on('complete', function(results)
	{
		memberEE.emit('complete',results);
	});

	return memberEE;
};

exports.getEventsByGroupUrl = function(groupUrl)
{
	var memberEE = new EventEmitter();

	var ee = meetup.getEventsByGroupUrl(groupUrl);
	ee.on('complete', function(results)
	{
		memberEE.emit('complete',results);
	});

	return memberEE;
}

exports.getRsvpsByEventId - function(eventId)
{
	var rsvpsEE = new EventEmitter();

	var ee = meetup.getRsvpsByEventId(eventId);
	ee.on('complete', function(results)
	{
		rsvpsEE.emit('complete',results);
	});

	return rsvpsEE;
}

// FORMATTING

function formatTypeMembers(results)
{
	var members = [];

	if (results.hasOwnProperty("data"))
	{
		results.data.forEach(function(member)
		{
			members.push(new Node(member[0]));
		});
	}

	return members;
}