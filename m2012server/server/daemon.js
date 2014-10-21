///<reference path="tslib/node.d.ts" />
///<reference path="logger/logger.ts" />
///<reference path="toolkit/index.ts" />
var _logger = require("./logger/logger");
var daemonLogger = _logger.getLogger('daemon');
var c_p = require('child_process');
var Toolkit = require("./toolkit/index");

//定时做health check，如果服务超过一段时间不响应，自动重启
var checkInterval = 3000;
var healthCheckCount = 0;
var MaxErrorCount = 3;
setInterval(function () {
    //使用简单http请求探测服务是否正常工作
    var healthCheckUrl = "http://127.0.0.1:9500/m2012server/memory";
    var curl = c_p.spawn("curl", [healthCheckUrl]);
    curl.stdout.on("data", function (data) {
        data = data.toString();
        if (data.indexOf("heapTotal") > -1) {
            healthCheckCount = 0; //危险阀值清0
        }
    });
    curl.stdin.end();

    //健康检查没有得到响应
    if (healthCheckCount > MaxErrorCount) {
        daemonLogger.error("health check noresponse");
        healthCheckCount = 0;
        killAndRestart();
    } else {
        healthCheckCount++; //危险阀值 +1
    }
}, checkInterval);

function killAndRestart() {
    var startJSPath = __dirname + "/master.js";
    Toolkit.Utils.killProcess(startJSPath, function () {
        setTimeout(function () {
            var start = c_p.spawn("node", [startJSPath]);
        }, 2000);
    });
}

process.on("uncaughtException", function (err) {
    console.error("uncaughtException:%j", err && err.stack);
});
