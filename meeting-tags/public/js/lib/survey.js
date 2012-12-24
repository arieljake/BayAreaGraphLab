
var survey;
var questions;

$(document).ready(function()
{
	$.ajax({
		url: "/surveys/" + surveyId,
		type: "GET",
		success: function(data)
		{
			survey = data.survey;
			questions = data.questions;

			initPage();
			refreshOutput();
		}
	})
})

function initPage()
{
	var title = $("<div class='title'></div>");
	title.appendTo("body");

	var list = $("<div class='questionList'></div>");
	list.appendTo("body");
}

function refreshOutput()
{
	$(".title").text(survey.name);

	var questionList = $(".questionList");
	questionList.children().remove();

	questions.forEach(function(question)
	{
		var questionItem = $("<div class='questionItem'></div>");
		questionItem.append("<span>" + question.text + "</span>");

		var questionInput = $("<textarea class='questionInput'></textarea>");
		questionInput.attr("id",question._id);
		questionInput.appendTo(questionItem);

		questionItem.appendTo(questionList);
	});

	$('.questionInput').tagsInput();

	var submitButton = $("<button id='submit'>Submit</button>");
	submitButton.appendTo(questionList);
	submitButton.bind("click", function()
	{

	})
}