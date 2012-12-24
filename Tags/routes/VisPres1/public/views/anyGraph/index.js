var graphW = 600;
var graphH = 600;

define(RequireImports.new()
	.add("/js/graphs",["IGraphDatasource.js"])
	.toArray(),function()
{

	var AnyGraphView = window.AnyGraphView = function()
	{
		var self = this;

		$(document).ready(function()
		{
			var location = window.location.href;
			var props;

			if (location.indexOf("?"))
			{
				var params = location.split("?").pop();
				props = _.toQueryParams(params);
			}

			if (props && props.dataUrl && props.graphType)
			{
				var datasource = new IGraphDatasource({
					getData: function(cb)
					{
						$.get(props.dataUrl, function(data)
						{
							cb(null,data);
						})
					}
				});

				$.getScript("/js/graphs/" + props.graphType + ".js", function(data)
				{
					$("body").append('<div id="graph"></div>');

					var graphClassName = props.graphType.split("/").pop().split(".").shift();
					var graphClass = window[graphClassName];
					var graph = new graphClass("#graph",graphW,graphH,datasource);
					graph.init();
					graph.load();
				});
			}
			else
			{
				var parent = $("body");

				parent.append("query params:<br />");
				parent.append(" - dataUrl = http endpoint for data <br />");
				parent.append(" - graphType = graph script to load");
			}
		})
	};
});