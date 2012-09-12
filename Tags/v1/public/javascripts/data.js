


$(document).ready(function()
{
	populateListWithData('memberList','/members','member');
	populateListWithData('academicFocusList','/academicFoci','academicFocus');
	populateListWithData('productList','/products','product');
	populateListWithData('interestList','/interests','interest');
	populateListWithData('ideaList','/ideas','idea');
});

function populateListWithData(listId,url,itemClass)
{
	$("#" + listId).children().remove();

	$.get(url, function(data)
	{
		data.forEach(function(item)
		{
			$("#" + listId).append('<li class="' + itemClass + '">' + item.data.name + '</li>');
		})
	})
}