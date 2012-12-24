

var Sunburst = function (parentSelector,w,h,datasource)
{
	this.parent = d3.selectAll(parentSelector);
	this.datasource = datasource;
	this.w = w;
	this.h = h;
}

Sunburst.prototype.init = function()
{
	var self = this;

	this.vis = this.parent.append("svg:svg")
		.attr("width", this.w)
		.attr("height", this.h)
		.append("g")
		.attr("transform", "translate(" + this.w / 2 + "," + this.h / 2 + ")");

	this.radius = Math.min(this.w, this.h) / 2;

	this.partition = d3.layout.partition()
		.sort(null)
		.size([2 * Math.PI, this.radius * this.radius])
		.value(function(d) { return 1; });

	this.arc = d3.svg.arc()
		.startAngle(function(d) { return d.x; })
		.endAngle(function(d) { return d.x + d.dx; })
		.innerRadius(function(d) { return Math.sqrt(d.y); })
		.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

	this.color = d3.scale.category20c();

	this.stash = function(d)
	{
		d.x0 = d.x;
		d.dx0 = d.dx;
	};

	this.arcTween = function(a)
	{
		var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
		return function(t) {
			var b = i(t);
			a.x0 = b.x;
			a.dx0 = b.dx;
			return self.arc(b);
		};
	};
};

Sunburst.prototype.load = function(cb)
{
	var self = this;

	self.datasource.getData(function(results)
	{
		var chart = self.vis.data([results]);

		var paths = chart.selectAll("path")
			.data(self.partition.nodes);

		paths.enter()
			.append("path")
			.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
			.attr("d", self.arc)
			.attr("fill-rule", "evenodd")
			.style("stroke", "#fff")
			.style("fill", function(d) { return self.color(d.name); })
			.each(self.stash);

		paths
			.data(self.partition.value(function(d) { return d.size; }))
			.transition()
			.duration(1500)
			.attrTween("d", self.arcTween);
	});
};