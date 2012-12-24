


var Job = module.exports = function(connection,name,payload)
{
	this.connection = connection;
	this.name = name;
	this.payload = payload;
};

Job.prototype.execute = function(cb)
{
	var gearmanJob = this.connection.submitJob(this.name, this.payload);
	var result = {data: ""};

	gearmanJob.on("data", function(data)
	{
		result.data += data.toString("utf-8");
	});

	gearmanJob.on("end", function()
	{
		cb(null,result.data);
	});

	gearmanJob.on("error", function(error)
	{
		cb(error,null);
	});
}