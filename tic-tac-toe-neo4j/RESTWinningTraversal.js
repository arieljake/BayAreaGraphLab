
var traversalDef = {
	"order" : "depth_first",
	"max_depth" : 2,
	"prune_evaluator" : {
		"body" : "position.endNode().getProperty('selected').toString() == 'false'",
		"language" : "javascript"
	},
	"return_filter" : {
		"body" : "position.length() == 2 && position.endNode().getProperty('selected').toString() == 'true' && ((Math.abs(position.endNode().getProperty('index') - position.startNode().getProperty('index')) == 2) || (Math.abs(position.endNode().getProperty('index') - position.startNode().getProperty('index')) == 6))",
		"language" : "javascript"
	}
};

var WinningTraversal = module.exports = {

	getWinningNodes : function(nodeList,lib,cb)
	{
		if (nodeList.length == 0)
			return cb([]);

		var startNode = nodeList.pop();
		var traverseEE = lib.traverseNode(startNode,"path",traversalDef);
		traverseEE.on('complete',function(result)
		{
			var winningResult = JSON.parse(result);
			var winningNodes = [];

			if (winningResult.length > 0)
			{
				winningResult[0].nodes.forEach(function(nodePath)
				{
					winningNodes.push(nodePath.split("/").pop());
				});

				console.log("WIN: " + startNode);
				cb(winningNodes);
			}
			else
			{
				WinningTraversal.getWinningNodes(nodeList,lib,cb);
			}
		});
	}

}