var Toolkit = require("./server/toolkit");
var spawn = require('child_process').spawn;
var startJSPath = __dirname + "/start.js";

Toolkit.Utils.killProcess(__dirname + "/server/daemon.js", function () {
    Toolkit.Utils.killProcess(__dirname + "/server/master.js", function () {
        var start = spawn("node", [startJSPath]);

        start.stdout.on("data", function (data) {
            process.stdin.write(data);
        })

        start.on("exit", function () {
            process.exit();
        })
    });
});