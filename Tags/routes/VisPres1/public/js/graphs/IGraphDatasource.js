
define(function () {

	var IGraphDatasource = window.IGraphDatasource = function (api)
	{
		this.api = api;
	};

	IGraphDatasource.prototype.getData = function (cb)
	{
		this.api.getData(function (err,response)
		{
			cb(response);
		})
	};

});