var Gearman = require("node-gearman");
var gearman = new Gearman("23.23.158.70", "4730");

var job = gearman.submitJob("reverse", "test string");

job.on("data", function(data){
	console.log(data.toString("utf-8")); // gnirts tset
});

job.on("end", function(){
	console.log("Job completed!");
});

job.on("error", function(error){
	console.log(error.message);
});