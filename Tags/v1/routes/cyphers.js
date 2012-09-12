

// STATIC

var Cypher = function(db)
{
	this.db = db;
};

exports.createMemberStatCypher = function (neoDB)
{
	return new Cypher(neoDB);
}

exports.createMembersByCypher = function(neoDB)
{
	return new Cypher(neoDB);
}

Cypher.prototype.getOfTypeAnd = function(type,andFxn)
{
	this.executeCypher(
		'START theType=node:types(name = {type}) MATCH theType<-[:is]-ofType RETURN ofType',
		{
			type: type
		},
		andFxn
	);
};

Cypher.prototype.getMembersByOfType = function(type,relType,value,andFxn)
{
	this.executeCypher(
		'START theType=node:types(name={type}) MATCH theType<-[:is]-ofType<-[:tagged]-members WHERE ofType.name = {value} RETURN distinct members',
		{
			type: type,
			value: value
		},
		andFxn
	);
}

Cypher.prototype.getMemberStatsAnd = function(stat,andFxn)
{
	var nodeType = "member";

	this.executeCypher(
		'START memberType=node:types(name = {type}) MATCH memberType<-[:is]-members-[:tagged]->stats-[:is]->statType WHERE statType.name = {stat} RETURN stats',
		{
			type: "member",
			stat: stat
		},
		andFxn
	);
};

Cypher.prototype.getMemberTagsOfType = function(memberId,tagType,andFxn)
{
	this.executeCypher(
		'START member=node(' + memberId + ') MATCH member-[:tagged]->tags-[:is]->tagType WHERE tagType.name = {tagType} RETURN tags',
		{
			tagType: tagType
		},
		andFxn
	);
}

Cypher.prototype.deleteMemberTags = function(memberId,andFxn)
{
	this.executeCypher(
		'START member=node(' + memberId + ') MATCH member-[r:tagged]->() DELETE r',
		{

		},
		andFxn
	);
}

Cypher.prototype.executeCypher = function(query,params,cb)
{
	try
	{
		var ee = this.db.cypher({
			query: query,
			params: params
		});
		ee.on('complete', function (results)
		{
			cb(results);
		});
	}
	catch (e)
	{
		throw new Error("neo4j is not responding");
	}
}