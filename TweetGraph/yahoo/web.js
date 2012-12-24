var Twit = require('twit');
var mongo = require('mongoskin');
var constants = require("./constants.js");

var T = new Twit(constants.apiSettings);
var DB = mongo.db('ajake:ajake@ds037047.mongolab.com:37047/tweets?auto_reconnect');

var userSettings;

loadSettings(function()
{
	updateTimeline(function()
	{
		console.log("done");
	});
});

function loadSettings(cb)
{
	DB.collection("settings").find({_id:"1"}).toArray(function(err,settings)
	{
		if (settings.length > 0)
		{
			userSettings = settings[0];
			cb();
		}
		else
		{
			userSettings = {_id: "1"};
			DB.collection("settings").insert(userSettings,function(err,records)
			{
				cb();
			})
		}
	});
}

function updateTimeline(cb)
{
	var params = {};

	if (userSettings.lastTimelineId)
	{
		params.sinceId = userSettings.lastTimelineId;
	}

	T.get('statuses/home_timeline',params,function(err, reply)
	{
		if (reply)
		{
			console.log(reply.length);
			var recentItem = reply[0];

			insertTimelineItems(reply,function()
			{
				userSettings.lastTimelineId = recentItem.id;
				saveUserSettings(function()
				{
					cb();
				});
			});
		}
		else
		{
			cb();
		}
});
}

function insertTimelineItems(items,cb)
{
	if (!items || items.length == 0)
	{
		cb();
		return;
	}

	var item = items.shift();
	item._id = item.id;

	DB.collection("timeline").save(item,function(err,records)
	{
		insertTimelineItems(items,cb);
	});
}

function saveUserSettings(cb)
{
	DB.collection("settings").save(userSettings,function(err,records)
	{
		cb();
	});
}