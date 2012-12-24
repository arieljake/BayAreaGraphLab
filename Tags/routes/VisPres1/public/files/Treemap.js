

var Treemap = function (parentSelector,w,h,datasource)
{
	this.parent = d3.selectAll(parentSelector);
	this.datasource = datasource;
	this.width = w;
	this.height = h;
}

Treemap.prototype.init = function()
{
	var self = this;

	this.color = d3.scale.category20c();

	this.treemap = d3.layout.treemap()
		.size([self.width, self.height])
		.sticky(true)
		.value(function(d) { return d.size; });

	this.div = this.parent
		.append("svg:svg")
		.style("position", "relative")
		.style("width", self.width + "px")
		.style("height", self.height + "px");

	this.cell = function()
	{
		this
			.attr("x", function(d) { return d.x + "px"; })
			.attr("y", function(d) { return d.y + "px"; })
			.attr("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			.attr("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	};

	this.label = function()
	{
		this
			.attr("x", function(d) { return (d.x + 10) + "px"; })
			.attr("y", function(d) { return (d.y + 20) + "px"; })
			.attr("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
			.attr("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
	};
}

Treemap.prototype.load = function()
{
	var self = this;

	self.datasource.getData(function(results)
	{
		var boxes = self.div.data([results]).selectAll("g")
			.data(self.treemap.nodes);

		var newBoxes = boxes.enter()
			.append("g");

		newBoxes.append("rect")
			.call(self.cell)
			.attr("fill", function(d) { return self.color(d.name); });

		newBoxes.append("text")
			.call(self.label)
			.text(function(d) { return d.children ? "" : d.name; });
	});
}