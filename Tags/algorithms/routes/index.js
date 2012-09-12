var fs = require("fs");
var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

var neo4jlib = require("neo4j-lib");
var mongoskin = require("mongoskin");

var Neo4Lib = neo4jlib.Neo4Lib;
var Node = neo4jlib.Node;
var CompoundOperation = neo4jlib.CompoundOperation;
var Operation = neo4jlib.Operation;

var neoDB = new Neo4Lib("localhost", "7474");
var title = 'Algorithms';

exports.index = function(req, res)
{
  	res.render('index', { title: title});
};
