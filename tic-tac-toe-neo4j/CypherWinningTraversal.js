
var _ = require("underscore");

var CYPHER_traversalDef = {
	query: 'start x  = node(#nodes#) match x-[r1]->y-[r2]->z where x.selected = {isSelected} and y.selected = {isSelected} and z.selected = {isSelected} and x.index <> z.index and type(r1) = type(r2) return x.index,type(r1),y.index,type(r2),z.index',
	params: {
		isSelected:"true"
	}
};

var WinningTraversal = module.exports = {

	getWinningNodes : function(nodeList,lib,cb)
	{
		var query = _.clone(CYPHER_traversalDef);
		query.query = query.query.replace("#nodes#",nodeList.join(','));

		var queryEE = lib.cypher(query);
		queryEE.on('complete',function(result)
		{
			var winningResult = JSON.parse(result).data;
			var winningNodes = [];

			if (winningResult.length > 0)
			{
				winningNodes.push(winningResult[0][0]);
				winningNodes.push(winningResult[0][2]);
				winningNodes.push(winningResult[0][4]);
			}

			cb({
				winningNodes: winningNodes,
				query: query
			});
		});
	}

}