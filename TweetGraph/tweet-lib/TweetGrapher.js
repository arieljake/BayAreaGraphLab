
var neo4jlib = require("neo4j-lib");

var Operation = neo4jlib.Operation;
var CompoundOperation = neo4jlib.CompoundOperation;
var Node = neo4jlib.Node;

var TweetGrapher = module.exports = function()
{

};

TweetGrapher.prototype.graph = function(tweetObj)
{
	var op = new CompoundOperation();

	op.addOp(new Operation("tweet",function(lib,context)
	{
		return lib.createNode({
			type: "tweet",
			originalText: tweetObj.tweet
		});
	}));

	this.addTweetChildren(op,tweetObj.atRefs,"ref","references");
	this.addTweetChildren(op,tweetObj.hashes,"hash","mentions");
	this.addTweetChildren(op,tweetObj.urls,"url","linksTo");

	return op;
};

TweetGrapher.prototype.addTweetChildren = function(op,children,nodeType,relType)
{
	var childIndex = 0;

	children.forEach(function(child)
	{
		var childId = nodeType + childIndex;

		op.addOp(new Operation(childId,function(lib,context)
		{
			return lib.createNodeINE({
				type: nodeType,
				value: child
			},{
				indexName: nodeType,
				key: "id",
				value: child
			});
		}));

		op.addOp(new Operation(childId + "rel",function(lib,context)
		{
			console.log(context["tweet"]);
			console.log("A" + context[childId] + "Z");

			var tweetNode = Node.fromResult(context["tweet"]);
			var childNode = Node.fromResult(context[childId]);

			return lib.createRelationship(tweetNode.id,childNode.id,relType);
		}));

		childIndex++;
	});
}