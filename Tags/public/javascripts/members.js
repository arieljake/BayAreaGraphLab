
var format = d3.format(",d");
var fill = d3.scale.category20c();

var members;
var vis;
var bubbles = {
	name: "ROOT",
	children: []
};
var countThreshold = 25;

$(document).ready(function()
{
	vis = d3.select("#chart").append("svg")
		.attr("class", "bubble");

	d3.json("/meetup/bagl/members", function(result)
	{
		members = result;
		bubbles.children = [];

		members.results.forEach(function (member)
		{
			bubbles.children.push({
				name: member.name,
				children: member.topics,
				data: member
			});
		})

		refreshBubbles();
	});
});

$(window).resize(function()
{
	refreshBubbles();
});

var nodeColors;

function refreshBubbles()
{
	$("#loading").show();

	var w = $(window).width();
	var h = $(window).height();

	var bubble = d3.layout.pack()
		.sort(null)
		.size([w, h]);

	nodeColors = {};

	vis.attr("width", w *.9)
		.attr("height", h *.9);

	var node = vis.selectAll("g.node").remove()
		.data(bubble.nodes(formatTopics(bubbles))
		.filter(function(d)
		{
			if (!d.children)
			{
				d.fill = fill(d.text);
				nodeColors[d.text] = d.fill;
				return true;
			}

			return false;
		}))
		.enter().append("g")
		.attr("class", "node")
		.attr("transform", function(d) { return "translate(" + (d.x-30) + "," + (d.y-30) + ")"; });

	node.append("title")
		.text(function(d) { return d.text; });

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

	$("#loading").hide();
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function formatTopics(root) {
	var tags = [];
	var tagLookup = {};

	function recurse(name, node) {
		if (node.children)
		{
			node.children.forEach(function(child) { recurse(node.name, child); });
		}
		else
		{
			var tag;

			if (tagLookup[node.id] === undefined)
			{
				tag = {text:node.name, id: node.id, value: 0};
				tags.push(tag);
				tagLookup[node.id] = tag;
			}
			else
			{
				tag = tagLookup[node.id];
			}

			tag.value++;
		}
	}

	recurse(null, root);

	var finalTags = [];

	tags.forEach(function(tag)
	{
		if (tag.value >= countThreshold)
		{
			finalTags.push(tag);
		}
	});

	return {children: finalTags};
}