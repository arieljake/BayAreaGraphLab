

(function(varContext, varName)
{
	var root = varContext;
	var isNode = false;

	var that = function(api)
	{
		this.api = api;
	};

	if (typeof module !== 'undefined' && module.exports)
	{
		module.exports = that;
		isNode = true;
	}
	else if (typeof window !== 'undefined')
	{
		window[varName] = that;
	}

	that.prototype.get = function (name, cb) {
		this.api.get(name, function (err,response) {
			if (cb)
				cb(err,response);
		})
	};

	that.prototype.set = function (name, value, cb) {
		this.api.set(name, value, function () {
			if (cb)
				cb();
		});
	};

	that.prototype.del = function (name, cb) {
		this.api.del(name, function () {
			if (cb)
				cb();
		});
	};

})(this,"IDatabase");
