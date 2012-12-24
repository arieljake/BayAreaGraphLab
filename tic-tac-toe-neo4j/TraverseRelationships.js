
var Operation = require("neo4j-lib").Operation;
var CompoundOperation = require("neo4j-lib").CompoundOperation;
var EventEmitter = require("events").EventEmitter;
var Relationship = require("neo4j-lib").Relationship;

var TraverseRelationships = module.exports = function()
{

};

TraverseRelationships.prototype.traverse = function(lib,nodeId,cb)
{
	var op = new CompoundOperation();
	var traverseOperation = this.createTraverseOperation(op,lib,nodeId);

	op.addOp(traverseOperation);
	op.execute(lib,function()
	{
		if (cb)
		{
			cb(op.results);
		}
	})
};

TraverseRelationships.prototype.createTraverseOperation = function(op,lib,nodeId)
{
	var self = this;

	return new Operation("node" + nodeId,function(lib,context)
	{
		var ee = new EventEmitter();
		var getEE = lib.getNode(nodeId);
		getEE.on('complete', function(nodeResult)
		{
			var relsEE = lib.getNodeRelationshipsOut(nodeId);
			relsEE.on('complete',function(relsResult)
			{
				var relationships = JSON.parse(relsResult);
				relationships.forEach(function(relationship)
				{
					var relObj = new Relationship(relationship);
					context["rel:" + "node" + nodeId + ":" + "node" + relObj.endId] = relObj;

					if (context["node" + relObj.endId] === undefined)
					{
						context["node" + relObj.endId] = null;
						op.addOp(self.createTraverseOperation(op,lib,relObj.endId));
					}
				});

				ee.emit('complete',nodeResult);
			});
		})

		return ee;
	});
}