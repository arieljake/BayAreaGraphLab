var Gearman = require("node-gearman");
var gearman = new Gearman("23.23.158.70", "4730");

gearman.registerWorker("reverse", function(payload, worker)
{
	if(!payload){
		worker.error();
		return;
	}

	var stringToReverse = payload.toString("utf-8");

	console.log("reversing string: " + stringToReverse);

	var reversed = payload.toString("utf-8").split("").reverse().join("");

	worker.end(reversed);
});