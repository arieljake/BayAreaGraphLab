var Gearman = require("node-gearman");
var gearman = new Gearman("23.23.158.70", "4730");

var TweetAnalyser = require("./TweetAnalyser.js");
var tweetAnalyser = new TweetAnalyser();

gearman.registerWorker("tweet-analyse", function(payload, worker)
{
	if(!payload)
	{
		worker.error();
		return;
	}

	var tweet = payload.toString("utf-8");
	var analysis = tweetAnalyser.analyze(tweet);
	var result = JSON.stringify(analysis);

	worker.end(result);
});