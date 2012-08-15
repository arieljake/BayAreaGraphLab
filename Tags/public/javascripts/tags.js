
var format = d3.format(",d");
var fill = d3.scale.category20c();

var vis;
var bubbles = {
	name: "ROOT",
	children: []
};
var profileFields;
var updateCountdown;

$(document).ready(function()
{
	getFields(function()
	{
		updateCountdown = profileFields.length;
		bubbles.children = [];

		profileFields.forEach(function(profileField)
		{
			d3.json("/bubbles/member/" + profileField.id, function(fieldResults)
			{
				updateCountdown--;

				if (fieldResults)
				{
					bubbles.children.push({
						name: profileField.id,
						children: fieldResults
					});
				}

				if (updateCountdown == 0)
					refreshBubbles();
			});
		})
	});

	vis = d3.select("#chart").append("svg")
		.attr("class", "bubble");

	createDialogs();
});

$(window).resize(function()
{
	refreshBubbles();
});

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
}

function getFields(cb)
{
	profileFields = [];

	$.get('/profile/fields',function(data)
	{
		data.fieldsets.forEach(function(fieldset)
		{
			fieldset.fields.forEach(function(field)
			{
				profileFields.push(field);
			})
		});

		cb();
	});
}

var nodeColors;
var legendSize = 20;
var legendFontSize = 20;
var vgap = 10;
var hgap = 10;
var lpad = legendSize;
var tpad = legendSize;
var textvoffset = 17;

function refreshBubbles()
{
	var w = $(window).width();
	var h = $(window).height();

	var bubble = d3.layout.pack()
		.sort(null)
		.size([w, h]);

	nodeColors = {};

	vis.attr("width", w *.9)
		.attr("height", h *.9);

	var node = vis.selectAll("g.node").remove()
		.data(bubble.nodes(formatTags(bubbles))
		.filter(function(d)
		{
			if (!d.children)
			{
				d.fill = fill(d.group);
				nodeColors[d.group] = d.fill;
				return true;
			}

			return false;
		}))
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + (d.x-30) + "," + (d.y-30) + ")"; });

	node.append("title")
		.text(function(d) { return d.group; });

	node.append("circle")
		.attr("r", function(d) { return d.r; })
		.style("fill", function(d) { return d.fill; });

	node.append("text")
		.attr("text-anchor", "middle")
		.style("font-size", function(d) { return Math.round(d.r) })
		.style("fill", "#FFFFFF" )
		.attr("dy", ".3em")
		.text(function(d) { return d.value; });

	node.append("text")
		.attr("text-anchor", "middle")
		.style("font-size", function(d) { return Math.round(d.r / 4) })
		.attr("dy", "2.1em")
		.text(function(d) { return d.text; });

	node.on('click',function(d,i) { showPeople(d); })

	// refresh legend
	var legend = vis.selectAll("g.legend")
		.data(bubble.nodes(formatLegend(bubbles,1))
		.filter(function(d) { return d.label; }))
		.enter().append("g")
		.attr("class", "legend");

	legend.append("title")
		.text(function(d) { return d.label; });

	legend.append("rect")
		.attr("width", function(d) { return legendSize; })
		.attr("height", function(d) { return legendSize; })
		.attr("x", function(d) { return lpad; })
		.attr("y", function(d,index) { return tpad + ((legendSize+vgap) * index); })
		.style("fill", function(d) { return nodeColors[d.label]; });

	legend.append("text")
		.attr("text-anchor", "left")
		.attr("x", function(d) { return lpad + legendSize + hgap; })
		.attr("y", function(d,index) { return (tpad+textvoffset) + ((legendSize+vgap) * index); })
		.style("font-size", legendFontSize)
		.text(function(d) { return _.str.humanize(d.label); });
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function formatTags(root) {
	var tags = [];

	function recurse(name, node) {
		if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
		else tags.push({group: name, text:node.value.name, value: node.value.count});
	}

	recurse(null, root);
	return {children: tags};
}

function formatLegend(root,desiredLevel) {
	var items = [];

	function recurse(node,level) {

		if (level > 0 && node.children)
		{
			node.children.forEach(function(child) { recurse(child,level-1); });
		}
		else if (level == 0)
		{
			items.push({label: node.name});
		}
	}

	recurse(root,desiredLevel);
	return {children: items};
}

function showPeople(d)
{
	$.get('/' + d.group + '/' + d.text + '/members',function(members)
	{
		$("#peopleList").html('');

		members.forEach(function(member)
		{
			$("#peopleList").append(member.data.name + "<br />");
		});

		$("#peopleList").dialog('open');
	});
}