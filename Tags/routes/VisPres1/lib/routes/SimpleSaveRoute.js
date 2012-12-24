
var SimpleSaveRoute = module.exports = function(db,baseUrl)
{
	this.db = db;
	this.baseUrl = baseUrl;
};

SimpleSaveRoute.prototype.attachToApp = function(app)
{
	var self = this;
	var baseUrl = self.baseUrl;

	app.post(baseUrl + '/:valueId', function(req,res)
	{
		var key = req.params["valueId"];
		var value = req.body;

		self.db.set(key,value,function(err,result)
		{
			if (err)
				res.send(err);
			else
				res.send(result);
		});
	});

	app.get(baseUrl + "/:valueId", function(req,res)
	{
		var key = req.params["valueId"];

		self.db.get(key,function(err,result)
		{
			if (err)
				res.send(err);
			else
				res.send(result);
		});
	});
}