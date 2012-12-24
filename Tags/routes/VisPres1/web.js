var http = require('http');
var path = require('path');
var express = require('express');
var MongoKeyValueStore = require("./lib/data/MongoKeyValueStore.js");
var SimpleSaveRoute = require("./lib/routes/SimpleSaveRoute.js");
var SimpleViewRoute = require("./lib/routes/SimpleViewRoute.js");

var webPort = 3000;
var webDir = __dirname;
var app = express();
var mongoRepo = new MongoKeyValueStore(process.env.MONGO_URI || 'mongodb://localhost:27017/finances',"values");
var mongoDB = mongoRepo.mongoDB;
var simpleDB = mongoRepo.toIDatabase();

app.configure(function ()
{
	app.set('port', webPort);
	app.set('views', webDir + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger({ immediate: true, format: 'dev' }));
	app.use(express.bodyParser({strict: false}));
	app.use(app.router);
	app.use(express.directory(path.join(webDir, 'public')));
	app.use(express.static(path.join(webDir, 'public')));

	configureRoutes(app);
});

http.createServer(app).listen(app.get('port'), function ()
{
	console.log("Express server listening on port " + app.get('port'));
	console.log("web dir: " + webDir);
});

function configureRoutes(app)
{
	var simpleViewRoute = new SimpleViewRoute({baseUrl: "/v"});
	var simpleSaveRoute = new SimpleSaveRoute(simpleDB,"/values");

	app.get("/", function(req,res)
	{
		res.send("Node.js is running");
	});

	simpleViewRoute.attachToApp(app);
	simpleSaveRoute.attachToApp(app);
}