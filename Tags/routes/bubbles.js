var _ = require("underscore");
var _str = require("underscore.string");
var neo4jlib = require("neo4j-lib");
var mongoskin = require("mongoskin");
var cyphers = require("./cyphers.js");

var Neo4Lib = neo4jlib.Neo4Lib;
var Node = neo4jlib.Node;

var neoDB = new Neo4Lib("localhost", "7474");
var mongoUrl = 'mongodb://localhost:27017/bagl_tags';
var mongoDB = mongoskin.db(mongoUrl);

exports.GroupStatBubble = function(group,stat)
{
	this.table = group + _str.capitalize(stat);

	var self = this;
	var that = {

		stat: stat,

		sendBubbles: function(req,res)
		{
			var cypher = cyphers.createMemberStatCypher(neoDB);

			cypher.getMemberStatsAnd(that.stat, function(results)
			{
				if (results)
				{
					that.countResults(results,function(counts)
					{
						res.send(counts);
					});
				}
				else
				{
					res.send([]);
				}
			});
		},

		countResults: function(results,cb)
		{
			mongoDB.collection(self.table).remove();

			if (results.hasOwnProperty("data"))
			{
				saveResultsForAggregation(results.data,function()
				{
					mongoDB.executeDbCommand({
							mapreduce: self.table,
							out: self.table + "Count",
							map: (function()
							{
								emit(this.data.name,{
									name: this.data.name,
									count: 1,
									url: this.self,
									id: this.self.split("/").pop()
								});

							}).toString(),
							reduce: (function(key, values)
							{
								var sum = 0;

								values.forEach(function(value)
								{
									sum += value.count;
								})

								return {
									count: sum,
									url: values[0].url,
									name: values[0].name,
									id: values[0].id
								};

							}).toString()
						},
						function (err,results)
						{
							mongoDB.collection(self.table + "Count").find().toArray(function(err,items)
							{
								cb(items);
							});
						});
				});
			}
			else
			{
				cb([]);
			}

			function saveResultsForAggregation(mps,cb)
			{
				if (mps.length == 0)
					return cb();

				var mp = mps.shift();

				mongoDB.collection(self.table).insert(mp,function(err,results)
				{
					saveResultsForAggregation(mps,cb);
				});
			}
		}
	};

	return function(req,res)
	{
		that.sendBubbles(req,res);
	};
};