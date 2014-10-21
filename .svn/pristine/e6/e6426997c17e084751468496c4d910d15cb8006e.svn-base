var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

//启动守护进程mother
var motherJSPath = __dirname + "/server/master.js";
var daemonJSPath = __dirname + "/server/daemon.js";
var mother = spawn("node", [motherJSPath]);


mother.on("exit",function(code){
	error();
});
mother.stdout.on("data",function(data){
	var code = data.toString();
	if(code == "200"){
	    console.log("start success!! ^_^");
	    var maemon = exec("node " + daemonJSPath);
	    setTimeout(function () {
	        process.exit();
	    }, 2000);
	}
});


function error(){
	console.log("start fail!! =_=");
	process.exit();
}