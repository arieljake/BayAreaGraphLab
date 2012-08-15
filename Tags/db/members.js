var EventEmitter = require("events").EventEmitter;
var CompoundOperation = require("neo4j-lib").CompoundOperation;
var Operation = require("neo4j-lib").Operation;

module.exports.assureMembers = assureMembers;
module.exports.getMembers = getMembers;

function assureMembers(neo4j,members)
{
	var ee = new EventEmitter();

	var getEE = getMembers(neo4j);
	getEE.on('complete',function(curMembers)
	{
		var newMembersOp = new CompoundOperation();

		nodeTypes.forEach(function(nodeType)
		{
			var result = nodes[nodeType];
			var node = JSON.parse(result);

			if (node.length == 0 || (node.exception && node.exception == "org.neo4j.graphdb.NotFoundException"))
			{
				console.log("exception");

				newTypeNodesOp.addOp(new Operation(nodeType,function(neo4j, context, data)
					{
						return neo4j.createNode(data.nodeProps,data.indexProps);
					},
					{
						nodeProps:
						{type: nodeType},
						indexProps:
						{indexName: "types",key: "name",value: nodeType}
					}));
			}
			else
			{
				console.dir(node);
			}
		});

		newTypeNodesOp.execute(neo4j,function()
		{
			ee.emit('complete',nodeTypes);
		});
	});

	return ee;
}

function getMembers(neo4j)
{
	var ee = new EventEmitter();
	var getOp = new CompoundOperation();

	nodeTypes.forEach(function(nodeType)
	{
		getOp.addOp(new Operation(nodeType,function(neo4j)
		{
			return neo4j.getNodesFromIndex("types","name",nodeType);
		}))
	})

	getOp.execute(neo4j,function()
	{
		ee.emit('complete',getOp.results);
	});

	return ee;
}