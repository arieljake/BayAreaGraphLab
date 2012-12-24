var Node = require("neo4j-lib").Node;
var _ = require("underscore");

var NodesForArbor = module.exports = {

	format: function(results)
	{
		var nodes = {};
		var edges = {};
		var keys = _.keys(results);

		for (var i=0; i < keys.length; i++)
		{
			var key = keys[i];

			// rel
			if (key.indexOf("rel") == 0)
			{
				var relParts = key.split(":");

				if (!edges[relParts[1]])
				{
					edges[relParts[1]] = {};
				}

				edges[relParts[1]][relParts[2]] = {length:.8};
			}
			// node
			else
			{
				var node = Node.fromResult(results[key]);
				var data = node.data;
				data.id = node.id;
				nodes[key] = data;
			}
		}

		var ui = {
			nodes: nodes,
			edges: edges
		};

		return ui;
	}
};