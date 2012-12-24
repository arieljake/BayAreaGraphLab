
var _ = require("underscore");

var SimpleViewRoute = module.exports = function(params)
{
	params = params || {};

	_.defaults(params,{
		template: "simpleView",
		baseUrl: "/views",
		viewParamsGenerator: this.viewParamsGenerator
	});

	this.params = params;
};

SimpleViewRoute.prototype.attachToApp = function(app)
{
	var self = this;
	var baseUrl = self.params.baseUrl;

	app.get(baseUrl + "/:viewId", function(req,res)
	{
		var viewId = self.getViewId(req);
		var viewParams = self.params.viewParamsGenerator(req,viewId);

		_.defaults(viewParams,{
			title: ""
		});

		res.render(self.params.template,viewParams);
	});
};

SimpleViewRoute.prototype.getViewId = function(req)
{
	var viewId = req.params.viewId;

	return viewId;
}

SimpleViewRoute.prototype.viewParamsGenerator = function(req,viewId)
{
	var viewFilename = "index.js";

	return {
		params: {
			viewId: viewId,
			viewFile: viewFilename
		}
	};
}