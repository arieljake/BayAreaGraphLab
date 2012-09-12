
$(document).ready(function()
{
	var context = {};

	settings(context);
	execute(context);
});

function settings(context)
{
	var dataAccessLayers = ["java","shell","rest","rest-cypher"];

	context.execute = function()
	{
		var dao = new DAO();
		return dao.access(dataAccessLayers).create('1000 nodes').execute();
	};
}

function execute(executable)
{
	var timer = new Timer(true);
	var ee = executable.execute();
	ee.on('complete',function()
	{
		timer.printTTC(); // Time to complete (now!)
	});
}

var DAO = function ()
{
	this.dataAccessLayer = null;
};

DAO.prototype.access = function(value)
{
	this.dataAccessLayer = value;

	return this;
};


var Timer = function(autoStart,name)
{
	this.startTime = new Date();
	this.name = name ? name : "Timer";
};

Timer.prototype.printTTC = function()
{
	this.endTime = new Date();

	var duration = this.endTime.getTime() - this.startTime.getTime();

	console.log(this.name + " completed in " + duration + "ms");
}