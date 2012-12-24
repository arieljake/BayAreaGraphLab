var express = require('express');
var Gearman = require("node-gearman");
var Job = require("./gearman-lib/Job.js");

var gearman = new Gearman("23.23.158.70", "4730");
var port = 3000;
var app = express.createServer();

app.configure(function ()
{
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.logger());
	app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + "/public/uploads" }))
	app.use(express.query());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
});

app.post('/tweet/analyse', function (request, response)
{
	var tweet = request.body.tweet;

	var job = new Job(gearman,"tweet-analyse",tweet);
	job.execute(function(err,result)
	{
		if (err)
			response.send(err);
		else
			response.send(result);
	})
});

app.post('/tweet/analysis/graph', function (request, response)
{
	var analysis = request.body.analysis;

	var job = new Job(gearman,"tweet-graph",analysis);
	job.execute(function(err,result)
	{
		if (err)
			response.send(err);
		else
			response.send(result);
	})
});

app.listen(port, function()
{
	console.log("Listening on " + port);
});