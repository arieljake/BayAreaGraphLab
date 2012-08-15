var members;
var fieldsets;

function getMemberById(memberId)
{
	return _.find(members,function(member) {
		return member.id == memberId;
	});
}

function getMemberByName(memberName)
{
	return _.find(members,function(member) {
		return member.data.name == memberName;
	});
}

$(document).ready(function()
{
	createFields();
	createDialogs();
	hideThankYouMessage();
	showLoadProfileDialog();
	loadMembers();
	loadExamples({
		product: "/products",
		interest: "/interests",
		idea: "/ideas",
		academicFocus: "/academicFoci"
	});
});

function createFields()
{
	$.get('/profile/fields',function(data)
	{
		fieldsets = data.fieldsets;

		var form = $("#form");
		form.append("<input type='hidden' id='memberId' value='' />");

		fieldsets.forEach(function(fieldset)
		{
			form.append("<fieldset></fieldset>");

			var fs = $("#form fieldset:last-child");

			fieldset.fields.forEach(function(field)
			{
				fs.append("<div class='field'>" +
					"<label for='" + field.id + "'>" + field.label + "</label>" +
					"<div class='examples' id='" + field.id + "List'></div>" +
					"<input name='" + field.id + "' id='" + field.id + "' class='field tagsinput' />" +
					"</div>");
			});
		});

		form.append("<br /><button id='save'>SAVE</button>");

		$('.tagsinput').tagsInput();
		$('#save').click(function(e)
		{
			showThankYouMessage();
			saveProfile(function ()
			{
				function completeSave()
				{
					hideThankYouMessage();
					window.scrollTo(0,0);
					showLoadProfileDialog();
				}

				resetForm();
				setTimeout(completeSave, 5000);
			});
		});
	});
}

function createDialogs()
{
	$(".dialog").each(function(index,target)
	{
		target = $(target);

		var titleElem = target.find('.title');
		var title = titleElem.text();
		titleElem.remove();

		target.dialog({autoOpen: false, title: title});
	});

	$("#memberList").change(function(e)
	{
		var memberId = $(e.target).val();

		if (memberId)
			loadMember(memberId);
	});
}

function loadMember(memberId)
{
	var member = getMemberById(memberId);
	prepareFormForMember(member);
}

function onMemberNameChange(e)
{
	if (!members)
		return;

	var memberName = $(e.target).val();

	if (e.keyCode == 13)
	{
		createMember(memberName);
		setMemberList(members);
		$(e.target).val("");
	}
	else
	{
		var filteredMembers = [];

		members.forEach(function(member)
		{
			if (member.data.name.toLowerCase().indexOf(memberName.toLowerCase()) == 0)
			{
				filteredMembers.push(member);
			}
		});

		setMemberList(filteredMembers);
	}
}

function showThankYouMessage()
{
	$("#thankyou").dialog('open');
	setTimeout(resetPage,3000);

	function resetPage()
	{
		hideThankYouMessage();
	}
}

function hideThankYouMessage()
{
	$("#thankyou").dialog('close');
	$("#form").hide();
	$("#loadProfile").show();
}

function showLoadProfileDialog()
{
	$("#form").hide();
	$("#loadProfile").show();
}

function hideLoadProfileDialog()
{
	$("#loadProfile").hide();
	$("#form").show();
}

function loadMembers(cb)
{
	$.get("/members",function(data)
	{
		members = data;

		setMemberList(members);

		if (cb)
			cb();
	});
}

function loadExamples(examples)
{
	var types = _.keys(examples);

	function loadExamplesForType(type)
	{
		$.get(examples[type],function(data)
		{
			window[type] = data;

			var names = [];

			data.forEach(function(item)
			{
				names.push(item.data.name);
			});

			$("#" + type + "List").children().remove();
			$("#" + type + "List").append("Ex: ");
			$("#" + type + "List").append(names.slice(0,5).join(", "));

			if (types.length > 0)
				loadExamplesForType(types.shift());
		});
	}

	loadExamplesForType(types.shift());
}

function setMemberList(values)
{
	$("#memberList").children().remove();

	values.forEach(function(member)
	{
		$("#memberList").append("<option value='" + member.id + "'>" + member.data.name + "</option>");
	})
}

function resetForm()
{
	$("input.field").each(function(index,input)
	{
		input = $(input);
		input.importTags("");
	});

	$("#memberId").val('');
}

function prepareFormForMember(member)
{
	$("#memberId").val(member.id);
	$("#memberName").text(member.data.name);

	fieldsets.forEach(function(fieldset)
	{
		fieldset.fields.forEach(function(field)
		{
			$.get('/members/' + member.id + '/tags/' + field.id,function(tags)
			{
				var tagList = [];

				tags.forEach(function(tag)
				{
					tagList.push(tag.data.name);
				})

				$("#" + field.id).importTags(tagList.join(","));
			})
		});
	});


	hideLoadProfileDialog();
}

function saveProfile(cb)
{
	var memberId = $("#memberId").val();
	var profile = {};

	$("input.field").each(function(index,input)
	{
		input = $(input);
		profile[input.attr('id')] = input.val();
	});

	$.post('/members/' + memberId + "/profile",profile,function(data)
	{
		cb();
	});
}

function createMember(memberName)
{
	$.post('/members',{memberName: memberName},function(data)
	{
		loadMembers(function()
		{
			var member = getMemberByName(memberName);
			prepareFormForMember(member);
		});
	});
}