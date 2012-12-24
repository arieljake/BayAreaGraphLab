_.toQueryParams = function(string, separator)
{
	var match = _.str.strip(string).match(/([^?#]*)(#.*)?$/);
	if (!match) return { };

	return _(match[1].split(separator || '&')).reduce(function(hash, pair) {
		if ((pair = pair.split('='))[0]) {
			var key = decodeURIComponent(pair.shift()),
				value = pair.length > 1 ? pair.join('=') : pair[0];

			if (value != undefined) value = decodeURIComponent(value);

			if (key in hash) {
				if (!_.isArray(hash[key])) hash[key] = [hash[key]];
				hash[key].push(value);
			}
			else hash[key] = value;
		}
		return hash;
	}, {});
}