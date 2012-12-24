/**
 * Tremendous article today from Applied Mythology's Steve Savage @grapedoc on #ArticApples!: appliedmythology.blogspot.ca/2012/07/consum...
 *
 * @type {Function}
 */

var twitterFunctions = require("./TweetFunctions.js");

var TweetAnalyser = module.exports = function()
{

};

TweetAnalyser.prototype.analyse = function(tweet)
{
	var analysis = {};

	analysis.tweet = tweet;
	analysis.tweetParts = tweet.split(" ");
	analysis.atRefs = twitterFunctions.getAtRefsFromParts(analysis.tweetParts);
	analysis.hashes = twitterFunctions.getHashesFromParts(analysis.tweetParts);
	analysis.urls = twitterFunctions.getUrlsFromParts(analysis.tweetParts);

	return analysis;
}