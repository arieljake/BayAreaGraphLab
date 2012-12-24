var http = require("http");

var DatabaseAdapter = module.exports = function()
{

};


DatabaseAdapter.prototype.getResourceByName = function(name)
{
    return http.get(name, function(result)
    {

    });
}