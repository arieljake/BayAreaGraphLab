
var express = require("express");
var http = require("http");
var path = require("path");
var mongo = require('mongoskin');
var routes = require("./lib/routes");

var mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/tags?auto_reconnect=true";
var mongoDB = mongo.db(mongoURL,{safe: true});
var app = express();

app.configure(function(){
	app.set("port", process.env.PORT || 3000);
	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "public")));
});

app.get("/", function(req,res)
{
	res.send("tags app is running");
});

app.get("/survey/:surveyId/edit", routes.EditSurvey());
app.get("/survey/:surveyId", routes.ShowSurvey(mongoDB));

app.post("/surveys/:surveyId/questions", routes.PostSurveyQuestion(mongoDB));
app.post("/surveys/:surveyId", routes.PostSurvey(mongoDB));
app.get("/surveys/:surveyId", routes.GetSurvey(mongoDB));

app.get("/questions", routes.GetQuestions(mongoDB));
app.del("/questions", routes.DelQuestion(mongoDB));

http.createServer(app).listen(app.get("port"), function(){
	console.log("Express server listening on port " + app.get("port"));
});