var mongo = require('mongoskin');
var IDatabase = require("./IDatabase.js");

var MongoKeyValueStore = module.exports = function(mongoURL,tableName)
{
	this.mongoDB = mongo.db(mongoURL,{safe: true});
	this.tableName = tableName;
};

MongoKeyValueStore.prototype.get = function(name,cb)
{
	var self = this;

	this.mongoDB.collection(self.tableName).find(
			{
				key: name
			}
		).toArray(function(err,items)
		{
			if (err || (items.length > 1))
			{
				cb(err);
			}
			else
			{
				if (items.length > 0)
					cb(err,items[0].value);
				else
					cb(err,null);
			}
		});
};

MongoKeyValueStore.prototype.set = function(name,value,cb)
{
	var self = this;
	
	this.mongoDB.collection(self.tableName).remove(
		{
			key: name	
		},
		function (err,items)
		{
			self.mongoDB.collection(self.tableName).insert(
					{
						key: name,
						value: value
					},
					function(err,items)
					{
						cb(err,items);
					}
				);
		}
	);
};

MongoKeyValueStore.prototype.del = function(name,cb)
{
	var self = this;

	this.mongoDB.collection(self.tableName).remove(
		{
			// all
		},
		function (err)
		{
			cb(err,"deleted");
		}
	);
};
	
MongoKeyValueStore.prototype.toIDatabase = function()
{
	return new IDatabase(this);
}