

var Bubble = function (parentSelector,w,h,datasource)
{
	this.parent = d3.selectAll(parentSelector);
	this.datasource = datasource;
	this.radius = w;
}

Bubble.prototype.init = function()
{
	var self = this;

	this.format = d3.format(",d");
	this.fill = d3.scale.category20c();

	this.bubble = d3.layout.pack()
		.sort(null)
		.size([self.radius, self.radius])
		.padding(1.5);

	this.vis = this.parent.append("svg")
		.attr("width", self.radius)
		.attr("height", self.radius)
		.attr("class", "bubble");

	this.classes = function(root)
	{
		var classes = [];

		function recurse(name, node) {
			if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
			else classes.push({packageName: name, className: node.name, value: node.size});
		}

		recurse(null, root);
		return {children: classes};
	}
}

Bubble.prototype.load = function()
{
	var self = this;

	self.datasource.getData(function(results)
	{
		var node = self.vis.selectAll("g.node")
			.data(self.bubble.nodes(self.classes(results))
			.filter(function(d) { return !d.children; }))
			.enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		node.append("title")
			.text(function(d) { return d.className + ": " + self.format(d.value); });

		node.append("circle")
			.attr("r", function(d) { return d.r; })
			.style("fill", function(d) { return self.fill(d.className); });

		node.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.text(function(d) { return d.className.substring(0, d.r / 3); });
	});
}