///<reference path="tslib/node.d.ts" />
///<reference path="tslib/m2012.d.ts" />
///<reference path="logger/logger.ts" />
var _logger = require("./logger/logger");
var cluster = require("cluster");
var os = require("os");
var config = eval('require("./config.js")');

var DaemonApp = (function () {
    function DaemonApp(options) {
        var _this = this;
        this.options = options;
        this.workers = [];
        this.lastWorkerRequest = {};
        this.childMessageCount = 0;
        this.workerNumbers = {};
        cluster.setupMaster({ exec: options.childScript });
        this.logger = _logger.getLogger('master');

        var workerCount = this.getWokerCount();
        for (var i = 0; i < workerCount; i++) {
            this.createWorker();
        }

        cluster.on('exit', function (worker, code, signal) {
            _this.onWorkerExit(worker, code, signal);
        });

        setInterval(function () {
            _this.checkWorkerHealth();
        }, 1000);

        /**
        *3秒钟收不到所有子进程启动成功的信息就退出
        */
        setTimeout(function () {
            if (_this.childMessageCount < workerCount) {
                console.error("start fail -_-!!!");
                process.exit(1);
            }
        }, 3000);
    }
    /**
    *返回进程数量
    */
    DaemonApp.prototype.getWokerCount = function () {
        var numCPUs = os.cpus().length;
        return Math.min(numCPUs, this.options.maxWorker);
        ;
    };

    /**
    *给子多个worker进程分配编号（永远是1开始，maxWorkerCount结束，用来规范每个进程的日志写入特定编号的文件中
    */
    DaemonApp.prototype.getFreeWorkerNumber = function () {
        var count = this.getWokerCount();
        for (var i = 1; i <= count; i++) {
            if (!this.workerNumbers[i]) {
                return i;
            }
        }
        return 0;
    };

    DaemonApp.prototype.useWorkerNumber = function (num, pid) {
        this.workerNumbers[num] = pid;
    };

    DaemonApp.prototype.removeWorkerNumber = function (pid) {
        for (var p in this.workerNumbers) {
            if (this.workerNumbers[p] == pid) {
                delete this.workerNumbers[p];
            }
        }
    };

    /**
    *创建子进程
    */
    DaemonApp.prototype.createWorker = function () {
        var _this = this;
        var workerNumber = this.getFreeWorkerNumber();
        var child = cluster.fork({
            workerNumber: workerNumber
        });
        child.on('message', function (message) {
            _this.onWorkerMessage(child, message);
        });

        //占用一个worker编号
        this.useWorkerNumber(workerNumber, child.process.pid);

        this.logger.info('worker ' + child.process.pid + ' start');
        console.info('worker ' + child.process.pid + ' start');
        this.workers.push(child);
    };

    DaemonApp.prototype.onWorkerMessage = function (worker, message) {
        this.childMessageCount++;
        if (this.childMessageCount == this.getWokerCount()) {
            console.info("start success ^_^ !!!");
            try  {
                //因为有可能在node-webkit下运行，这行会报错，所以加捕获
                process.stdout.write("200"); //告诉主进程我已经成功启动
            } catch (e) {
            }
        }

        //console.log("worder " + worker.process.pid + " send message:" + message);
        this.lastWorkerRequest[worker.process.pid] = new Date();
    };

    DaemonApp.prototype.onWorkerExit = function (worker, code, signal) {
        delete this.lastWorkerRequest[worker.process.pid];
        this.removeWorkerNumber(worker.process.pid);
        for (var i = 0; i < this.workers.length; i++) {
            if (this.workers[i] == worker) {
                this.workers.splice(i, 1);
            }
        }
        this.logger.error('worker ' + worker.process.pid + ' died');
        console.error('worker ' + worker.process.pid + ' died');
        this.createWorker();
    };

    DaemonApp.prototype.checkWorkerHealth = function () {
        var now = new Date();
        for (var i = 0; i < this.workers.length; i++) {
            var child = this.workers[i];
            var m = this.lastWorkerRequest[child.process.pid];
            if (m) {
                //子进程长时间没响应就杀进程
                if (now.getTime() - m.getTime() > this.options.noResponseToKill) {
                    this.stopWorker(child);
                }
            } else {
                this.lastWorkerRequest[child.id] = now;
            }
        }
    };

    DaemonApp.prototype.stopWorker = function (child) {
        console.log("kill worker " + child.process.pid);
        child.process.kill();
    };
    return DaemonApp;
})();

var app = new DaemonApp({
    childScript: __dirname + '/app.js',
    maxWorker: 4,
    noResponseToKill: 5000
});

process.on("uncaughtException", function (err) {
    console.error("uncaughtException:%j", err && err.stack);
});
