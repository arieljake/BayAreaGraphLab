var program = require("commander");
var TweetAnalyser = require("./TweetAnalyser.js");
var TweetGrapher = require("./TweetGrapher.js");
var Neo4Lib = require("neo4j-lib").Neo4Lib;
var Twit = require("twit");
var dateFormat = require('dateformat');
var twitterFunctions = require("./TweetFunctions.js");

var lib = new Neo4Lib("23.23.158.70", "7474");
var twitter = new Twit({
    consumer_key:  "4I2mz2WOghzsAJk57fPsyg",
    consumer_secret: "X3g4psfvCIAmRgDSEQNUcHk40ydFCkTBXRalU6QYlI",
    access_token: "15362615-3MPzk2jw9Wk0VB7wTgVlSCj7I5KGVyQXDl0KBUWCk",
    access_token_secret: "HNiPfXwjACspzp5AAepKeiC1wMyGqF4su91MrPEjY"
})

var debugOut = function(debugging,result)
{
	if (debugging)
	{
		console.dir(result);
	}
}

program
	.version('0.0.1')
	.option('-d, --debug', 'debug mode');

program
    .command("getRT <query>")
    .action(function(query)
    {
        var one_day=1000*60*60*24; // one day in ms
        var now = new Date();
        var since = new Date(now.getTime() - (one_day*30));

        twitter.get('search', { q: query, since: dateFormat(since,'yyyy-mm-dd'), lang: "en" }, function(err, reply)
        {
            console.log("refresh_url: " + reply.refresh_url);
            console.log("results: " + reply.results.length);

            reply.results.forEach(function(result)
            {
                var user = result["from_user_name"];
                var id = result["id"];
                var text = result["text"];

                var retweetSources = twitterFunctions.getRetweetSources(text);

                if (retweetSources)
                {
                    console.dir(retweetSources);
                }
            })
        });
    })

program
	.command('analyse <tweet>')
	.description('analyse a tweet')
	.action(function(tweet){
		var analyser = new TweetAnalyser();
		debugOut(program.debug,analyser.analyse(tweet));
	});

program
	.command('graph <tweet>')
	.description('graph an analysed tweet')
	.action(function(tweet){
		var analyser = new TweetAnalyser();
		var analysis = analyser.analyse(tweet);

		var grapher = new TweetGrapher();
		var graph = grapher.graph(analysis);

		debugOut(program.debug,graph);

		graph.execute(lib,function()
		{
			console.log("done");
		});
	});

program.parse(process.argv);
