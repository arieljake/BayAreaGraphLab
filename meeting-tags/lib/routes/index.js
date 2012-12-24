
var async = require("async");

// Browsing

module.exports.EditSurvey = function()
{
	return function(req,res)
	{
		var surveyId = req.params.surveyId;

		res.render("editSurvey",{title: "Survey " + surveyId,surveyId: surveyId});
	}
}

module.exports.ShowSurvey = function(mongoDB)
{
	return function(req,res)
	{
		var surveyId = req.params.surveyId;

		res.render("survey",{title: "Survey " + surveyId,surveyId: surveyId});
	}
}

// Data Access

module.exports.GetSurvey = function(mongoDB)
{
	return function(req,res)
	{
		var surveyId = req.params.surveyId;
		var data = {};

		async.parallel([
			function(cb)
			{
				mongoDB.collection("surveys").find({id:surveyId}).toArray(function(err,items)
				{
					data.survey = items && items.length > 0 ? items[0] : null;
					cb();
				})
			},
			function(cb)
			{
				mongoDB.collection("questions").find({surveyId:surveyId}).toArray(function(err,items)
				{
					data.questions = items;
					cb();
				})
			}
		],
			function(cb)
			{
				res.send(data);
			});
	}
}

module.exports.GetQuestions = function(mongoDB)
{
	return function(req,res)
	{
		if (req.query.surveyId)
		{
			var surveyId = req.query.surveyId;

			mongoDB.collection("questions").find({surveyId:surveyId}).toArray(function(err,items)
			{
				if (err)
					res.send(err);
				else
					res.send(items);
			})
		}
	}
}

module.exports.PostSurveyQuestion = function(mongoDB)
{
	return function(req,res)
	{
		var surveyId = req.params.surveyId;
		var question = req.body;
		question.surveyId = surveyId;

		mongoDB.collection("questions").insert(question,{safe: true},function(err,items)
		{
			if (err)
				res.send(err);
			else
				res.send(items);
		})
	}
}

module.exports.PostSurvey = function(mongoDB)
{
	return function(req,res)
	{
		var surveyId = req.params.surveyId;
		var survey = req.body;
		survey.id = surveyId;

		mongoDB.collection("surveys").update({id: surveyId},survey,{safe: true,upsert: true},function(err,items)
		{
			if (err)
				res.send(err);
			else
				res.send(items);
		})
	}
}

module.exports.DelQuestion = function(mongoDB)
{
	return function(req,res)
	{
		var question = req.body;
		var questionId = mongoDB.toObjectID(question._id);

		mongoDB.collection("questions").remove({_id: questionId},function(err,items)
		{
			if (err)
				res.send(err);
			else
				res.send("OK");
		})
	}
}