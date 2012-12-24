
var survey;
var questions;

$(document).ready(function()
{
	initPage();
	refreshPage();
})

function initPage(cb)
{
	var title = $("<div class='title'></div>");
	title.text("Survey " + surveyId);
	title.appendTo("body");

	var surveyNameInput = $("<input type='text' id='surveyName' />");
	surveyNameInput.appendTo("body");
	surveyNameInput.bind("blur", function()
	{
		var surveyObj = {name: surveyNameInput.val()};

		$.ajax({
			url: "/surveys/" + surveyId,
			type: "POST",
			contentType: "application/json;charset=utf8",
			data: JSON.stringify(surveyObj),
			dataType: "json",
			success: function()
			{
			}
		})
	})

	var list = $("<div class='questionList'></div>");
	list.appendTo("body");
}

function refreshPage()
{
	loadData(null, function()
	{
		updateSurveyInfo();
		displayQuestions();
		addNewQuestionButton();
	});
}

function loadData(params,cb)
{
	$.get("/surveys/" + surveyId, function (data)
	{
		survey = data.survey || {};
		questions = data.questions || [];

		cb();
	})
}

function updateSurveyInfo()
{
	$("#surveyName").val(survey.name);
}

function displayQuestions()
{
	var list = $(".questionList");
	list.children().remove();

	questions.forEach(function(question)
	{
		var questionItem = $("<div class='questionItem'></div>");
		questionItem.append("<span class='questionText'>" + question.text + "</span>");

		var deleteQuestionLink = $("<a></a>");
		deleteQuestionLink.text("Delete");
		deleteQuestionLink.attr("href","#deleteQuestion");
		deleteQuestionLink.appendTo(questionItem);
		deleteQuestionLink.on("click", function()
		{
			$.ajax({
				url: "/questions",
				type: "DELETE",
				contentType: "application/json",
				data: JSON.stringify(question),
				success: function(data)
				{
					refreshPage();
				}
			});
		})

		questionItem.appendTo(list);
	})
}

function addNewQuestionButton()
{
	var newQButton = $("<a id='newQuestionBtn'>New Question</a>");
	newQButton.attr("href","#newQuestion");
	newQButton.appendTo(".questionList");
	newQButton.on("click", function()
	{
		var questionText = prompt("Please enter your new question:","");

		if (questionText != null && questionText != "")
		{
			var questionObj = {text: questionText};

			$.ajax({
				url: "/surveys/" + surveyId + "/questions",
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify(questionObj),
				success: function(data)
				{
					refreshPage();
				}
			});
		}
	})
}