///<reference path="../tslib/node.d.ts" />
///<reference path="index.ts" />
///<reference path="../logger/logger.ts" />
var Toolkit = require("./index");
process.on("message", function (msg) {
    var body = Toolkit.RawDeflate.inflate(msg.body);
    process['send'](body);
});

//防止服务不退出
setTimeout(function () {
    process.exit(1);
}, 30 * 1000);
