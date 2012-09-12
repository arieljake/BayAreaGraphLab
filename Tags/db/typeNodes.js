var EventEmitter = require("events").EventEmitter;
var CompoundOperation = require("neo4j-lib").CompoundOperation;
var Operation = require("neo4j-lib").Operation;

var nodeTypes = ["member","idea","interest","product","academicFocus"];

module.exports.assureTypeNodes = assureTypeNodes;
module.exports.getTypeNodes = getTypeNodes;

function assureTypeNodes(neo4j)
{
	var ee = new EventEmitter();

	var getEE = getTypeNodes(neo4j);
	getEE.on('complete',function(nodes)
	{
		var newTypeNodesOp = new CompoundOperation();

		nodeTypes.forEach(function(nodeType)
		{
			var node = nodes[nodeType];

			if (node.length == 0 || (node.exception && node.exception == "org.neo4j.graphdb.NotFoundException"))
			{
				newTypeNodesOp.addOp(new Operation(nodeType,function(neo4j, context, data)
					{
						return neo4j.createNode(data.nodeProps,data.indexProps);
					},
					{
						nodeProps:
						{name: nodeType},
						indexProps:
						{indexName: "types",key: "name",value: nodeType}
					}));
			}
		});

		newTypeNodesOp.execute(neo4j,function()
		{
			ee.emit('complete',nodeTypes);
		});
	});

	return ee;
}

function getTypeNodes(neo4j)
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