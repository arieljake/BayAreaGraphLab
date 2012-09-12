var http = require("http");
var EventEmitter = require("events").EventEmitter;

module.exports.key = function(key)
{
	var that = {};

	that.key = key;
	that.getByGroupUrl = function(url)
	{
		var ee = that.sendRequest("/2/groups",["group_urlname=" + url]);
		return ee;
	};

	that.getMembersByGroupUrl = function(url)
	{
		var ee = that.sendRequest("/2/members",["group_urlname=" + url]);
		return ee;
	};

	that.getEventsByGroupUrl = function(url)
	{
		var ee = that.sendRequest("/2/events",["group_urlname=" + url]);
		return ee;
	};

	that.getRsvpsByEventId = function(eventId)
	{
		var ee = that.sendRequest("/2/rsvps",["event_id=" + eventId]);
		return ee;
	};

	that.sendRequest = function(path,params)
	{
		var ee = new EventEmitter();

		var url = "http://api.meetup.com" + path + "?key=" + this.key + "&" + params.join("&");

		var post_req = http.get(url, function(res)
		{
			var result = "";

			res.setEncoding('utf-8');
			res.on('data', function (chunk)
			{
				result += chunk;
			});
			res.on('end', function ()
			{
				ee.emit('complete',result);
			});
		});

		return ee;
	};

	return that;
}