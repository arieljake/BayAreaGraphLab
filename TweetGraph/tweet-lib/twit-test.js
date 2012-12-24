var Twit = require('twit');

var T = new Twit({
	consumer_key:         '4I2mz2WOghzsAJk57fPsyg'
	, consumer_secret:      'X3g4psfvCIAmRgDSEQNUcHk40ydFCkTBXRalU6QYlI'
	, access_token:         '15362615-3MPzk2jw9Wk0VB7wTgVlSCj7I5KGVyQXDl0KBUWCk'
	, access_token_secret:  'HNiPfXwjACspzp5AAepKeiC1wMyGqF4su91MrPEjY'
});

T.get('search', { q: 'banana', since: '2011-11-11' }, function(err, reply) {

	console.dir(reply);

});

var stream = T.stream('statuses/sample')

stream.on('tweet', function (tweet) {
	console.log(tweet);
});