var width = 960,
	height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
	.charge(-500)
	.linkDistance(50)
	.size([width, height]);

var svg = d3.select("#chart").append("svg")
	.attr("width", width)
	.attr("height", height);

// JSClass

JS.require('JS.Set', function() {

	loadData();

});

var nodes;
var links;

function modelGraph(json)
{
	var originalNodes = new JS.Set(json.nodes);
	var originalLinks = new JS.Set(json.links);

	var nodeGroups = originalNodes.classify(function(n)
	{
		return n.group;
	});

	var joinedNodes = nodeGroups.get(1).product(nodeGroups.get(2));

	joinedNodes.forEach(function(pair)
	{
		originalLinks.add({source: pair[0].id, target: pair[1].id, value: 1});
	});

	var nodes = [];
	var links = [];

	originalLinks.forEach(function(link)
	{
		links.push(link)
	});

	visualizeGraph({nodes: json.nodes, links: links});
}

// End JSClass

function loadData()
{
	d3.json("/data/3nodes.json", function(json)
	{
		modelGraph(json);
		visualizeGraph(json);
	});
}

function visualizeGraph(json)
{
	force
		.nodes(json.nodes)
		.links(json.links)
		.start();

	var link = svg.selectAll("line.link")
		.data(json.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) { return Math.sqrt(d.value); });

	var node = svg.selectAll("circle.node")
		.data(json.nodes)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", 5)
		.style("fill", function(d) { return color(d.group); })
		.call(force.drag);

	node.append("title")
		.text(function(d) { return d.name; });

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
	});
}