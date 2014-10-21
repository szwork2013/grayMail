///<reference path="../tslib/node.d.ts" />
var http = require('http');
var config = eval('require("../config.js")');

//得到负载均衡的ip主机
function getBalanceIP(host, serverMap, clientIP) {
    var serverList = serverMap[host];
    if (serverList && serverList.length > 0) {
        var newHost = serverList[getBalanceIPRandomKey(clientIP) % serverList.length];
        console.log("getBalanceIP:" + host + " to " + newHost);
    } else {
        return host;
    }

    //简单ip随机算法
    function getBalanceIPRandomKey(ip) {
        var list = ip.split(".");
        var count = 0;
        for (var i = 0; i < list.length; i++) {
            count += list[i] * 1;
        }
        return count;
    }
    return newHost || host;
}

function request(options, requestData, callback) {
    var fiddlerMode = config.fiddlerMode;

    var host = fiddlerMode ? "127.0.0.1" : options.hostname;
    var port = fiddlerMode ? 8888 : (options.port || 80);

    //多服务器负载， 同时具备 域名->内网IP的作用
    if (!fiddlerMode && config.BalanceList && options.clientIP) {
        host = getBalanceIP(host, config.BalanceList, options.clientIP);
        port = host.indexOf(":") > -1 ? host.split(":")[1] : 80;
        host = host.indexOf(":") > -1 ? host.split(":")[0] : host;
    }

    var request = http.request({
        headers: options.headers,
        hostname: host,
        port: port,
        path: options.path,
        method: options.method || "POST"
    }, function (res) {
        var buffers = [];
        var allLength = 0;
        res.on("data", function (chunk) {
            buffers.push(chunk);
            allLength += chunk.length;
        });
        res.on("end", function () {
            clearTimeout(timeoutTimer);
            if (res.statusCode == 200) {
                var bf;
                switch (buffers.length) {
                    case 0:
                        bf = new Buffer(0);
                        break;
                    case 1:
                        bf = buffers[0];
                        break;
                    default:
                        bf = new Buffer(allLength);
                        for (var i = 0, pos = 0; i < buffers.length; i++) {
                            var chunk = buffers[i];
                            chunk.copy(bf, pos);
                            pos += chunk.length;
                        }
                        break;
                }
                callback({
                    isSuccess: true,
                    responseBody: bf,
                    contentLength: allLength,
                    httpStatus: res.statusCode
                });
            } else {
                callback({
                    isError: true,
                    httpStatus: res.statusCode
                });
            }
        });
    });
    var isHandledTimeout = false;
    request.on("error", function (e) {
        clearTimeout(timeoutTimer);
        if (!isHandledTimeout) {
            callback({
                isError: true,
                errorMsg: JSON.stringify(e)
            });
        }
    });
    var timeoutTimer = setTimeout(function () {
        isHandledTimeout = true;
        callback({
            isTimeout: true
        });
        request.abort(); //这样会抛出异常，被error捕获
    }, options.timeout || 10000);
    if (requestData) {
        request.write(requestData);
    }
    request.end();
    return request;
}
exports.request = request;
