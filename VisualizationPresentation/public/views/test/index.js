


define(RequireImports.new()
	.toArray(),function()
{

	var TestView = window.TestView = function()
	{
		$(document).ready(function()
		{
			$("body").append("Test view is working");
		})
	}

});