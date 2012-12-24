var Gearman = require("node-gearman");
var TweetGrapher = require("./TweetGrapher.js");
var Neo4Lib = require("././Neo4Lib.js");

var gearman = new Gearman("23.23.158.70", "4730");
var tweetGrapher = new TweetGrapher();
var lib = new Neo4Lib('localhost',7474);

gearman.registerWorker("tweet-graph", function(payload, worker)
{
	if(!payload){
		worker.error();
		return;
	}

	var analysis = JSON.parse(payload.toString("utf-8"));
	var graph = tweetGrapher.graph(analysis);

	graph.execute(lib,function()
	{
		worker.end("ok");
	});
});