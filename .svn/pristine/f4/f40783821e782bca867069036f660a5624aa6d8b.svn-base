///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/m2012.d.ts" />
var API = require("../api/api");
var Router = require("../router/router");
var Toolkit = require("../toolkit/index");
var Logger = require("../logger/logger");
var config = eval('require("../config.js")');

var logger = Logger.getLogger("app");

var HttpClient = (function () {
    function HttpClient(options) {
        this.options = options;
        this.requestCookie = this.getRequestCookie();
        this.userNumber = this.getUserNumber();
    }
    HttpClient.prototype.getCommonLog = function () {
        return 'PID=' + process.pid + '|USERNUMBER=' + this.userNumber + '|SID=' + this.options.sid + '|PARTID=' + this.getPartId() + '|CLIENTIP=' + this.getClientIP();
    };

    HttpClient.prototype.logInfo = function (log) {
        var log = this.getCommonLog() + "|" + log;
        logger.info(log);
        console.info(log);
    };

    HttpClient.prototype.logError = function (log) {
        var log = this.getCommonLog() + "|" + log;
        logger.error(log);
        console.error(log);
    };

    HttpClient.prototype.logRequestTime = function (httpStatus, url, reqTime, length) {
        var log = "NAME=HttpClient|STATUS=" + httpStatus + "|URL=" + url + "|REQUESTTIME=" + reqTime + "|SIZE=" + length;
        this.logInfo(log);
    };

    HttpClient.prototype.logTimeout = function (url) {
        this.logError("NAME=HttpClient|TIMEOUT=" + url);
    };

    HttpClient.prototype.logJSONError = function (api) {
        this.logError("NAME=HttpClient|JSONERROR=" + api);
    };

    HttpClient.prototype.logHttpError = function (url, httpStatus, errorMsg) {
        var log = "NAME=HttpClient|HTTPERROR=" + url + "|STATUS=" + httpStatus;
        if (errorMsg) {
            log += "|ERRORMSG=" + errorMsg;
        }
        this.logError(log);
    };

    HttpClient.prototype.logResponseError = function (api, responseText) {
        this.logError("NAME=HttpClient|RESPONSEERROR=" + api + "|BODY=" + responseText.substr(0, 500).replace(/\n/g, "\\n"));
    };

    HttpClient.prototype.getUserNumber = function () {
        var userNumber = "";
        var ud = this.options.cookies.UserData;
        if (ud) {
            var reg = /userNumber:'(\d+)'/;
            var match = ud.match(reg);
            if (match) {
                userNumber = match[1];
            }
        }
        return userNumber;
    };

    HttpClient.prototype.getPartId = function () {
        return this.options.cookies.cookiepartid;
    };

    HttpClient.prototype.getInitDataConfig = function (callback) {
        var _this = this;
        var api = API.GetInitDataConfig;
        this.request(api, function (err, buffer) {
            if (err) {
                callback(err, null);
            } else {
                var text = buffer.toString();
                var obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getInitDataConfig");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getInitDataConfig", text);
                }
                callback(err, obj);
            }
        });
    };
    HttpClient.prototype.getInfoSet = function (callback) {
        var _this = this;
        var api = API.GetInfoSet;
        this.request(API.GetInfoSet, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getInfoSet");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getInfoSet", text);
                }
            }
            callback(err, obj);
        });
    };
    HttpClient.prototype.getAdlink = function (callback) {
        var _this = this;
        var api = API.GetAdlink;
        this.request(API.GetAdlink, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                text = text.replace(/^var AdLink=|;top\.AdLink=AdLink;$/g, "");
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getAdlink");
                }
            }
            callback(err, obj);
        });
    };
    HttpClient.prototype.getArtifact = function (callback) {
        var _this = this;
        var api = API.GetArtifact;
        this.request(API.GetArtifact, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getArtifact");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getArtifact", text);
                }
            }
            callback(err, obj);
        });
    };
    HttpClient.prototype.getQueryUserInfo = function (callback) {
        var _this = this;
        var api = API.GetQueryUserInfo;
        this.request(API.GetQueryUserInfo, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getQueryUserInfo");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getQueryUserInfo", text);
                }
            }
            callback(err, obj);
        });
    };
    HttpClient.prototype.getUnifiedPositionContent = function (callback) {
        var _this = this;
        var api = API.GetUnifiedPositionContent;
        this.request(API.GetUnifiedPositionContent, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getUnifiedPositionContent");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getUnifiedPositionContent", text);
                }
            }
            callback(err, obj);
        });
    };
    HttpClient.prototype.getBirthContactsInfo = function (callback) {
        var _this = this;
        var api = API.BirthContacts;
        this.request(API.BirthContacts, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("BirthContacts");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("BirthContacts", text);
                }
            }
            callback(err, obj);
        });
    };

    /**
    *获得一个cguid，带在请求的url上，方便前后端串联日志
    *cguid规范：由时间和4位的随机数组成。格式：小时+分+秒+毫秒+4位的随机
    */
    HttpClient.prototype.getCGUID = function () {
        function padding(n, m) {
            var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
            return new Array(len + 1).join("0") + n;
        };

        var now = new Date();
        return '' + padding(now.getHours()) + padding(now.getMinutes()) + padding(now.getSeconds()) + padding(now.getMilliseconds(), 3) + padding(Math.ceil(Math.random() * 9999), 4);
    };

    /**
    *解压报文然后发送到webapp
    */
    HttpClient.prototype.sendMailCompress = function (queryObj, data, callback) {
        var _this = this;
        var api = API.RichMailCompose;
        var url = api.url;
        if (queryObj) {
            for (var p in queryObj) {
                if (p !== "sid" && queryObj.hasOwnProperty(p)) {
                    url += "&" + p + "=" + encodeURIComponent(queryObj[p]);
                }
            }
        }

        this.request({
            site: api.site,
            url: url,
            requestData: data
        }, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("sendMailCompress");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("sendMailCompress", text);
                }
            }
            callback(err, obj);
        });
    };

    HttpClient.prototype.getRequestCookie = function () {
        var arr = ["cookiepartid", "RMKEY", "Os_SSO_" + this.options.sid];
        var cookies = this.options.cookies;
        var result = "";
        arr.forEach(function (c) {
            result += c + "=" + cookies[c] + ";";
        });
        return result;
    };

    /**
    *经过了nginx的透传，这里要取到客户端的ip需要从http头获取
    */
    HttpClient.prototype.getClientIP = function () {
        return this.options.clientIP;
    };

    HttpClient.prototype.request = function (options, callback) {
        var _this = this;
        var host = Router.getServerHost(options.site, this.getPartId());
        var port = host.indexOf(":") > -1 ? host.split(":")[1] : 80;
        var headers = {
            host: host.split(":")[0],
            cookie: this.requestCookie,
            //Node服务器需要将客户端的IP传给透传目标服务器(如传给中间件,RM等)
            "X-Forwarded-For": this.getClientIP(),
            "Richinfo-Client-IP": this.getClientIP(),
            "X-Real-IP": this.getClientIP()
        };
        if ("requestData" in options) {
            headers["Content-Length"] = Buffer.byteLength(options.requestData);
        }
        var path = options.url.replace("$sid", this.options.sid);

        //如果客户端没带cguid，就带上
        if (path.indexOf("cguid=") == -1) {
            path += "&cguid=" + this.getCGUID();
        }
        var startRequestTime = Date.now();
        var request = Toolkit.Http.request({
            headers: headers,
            hostname: host,
            port: port,
            path: path,
            method: 'POST',
            clientIP: this.getClientIP(),
            timeout: options.timeout || config.HTTPClientTimeout
        }, options.requestData, function (args) {
            var fullUrl = host + path;
            if (args.isSuccess) {
                //记录性能日志
                _this.logRequestTime(args.httpStatus, fullUrl, Date.now() - startRequestTime, args.contentLength);
                callback(null, args.responseBody);
            } else if (args.isError) {
                //记录异常日志
                _this.logHttpError(fullUrl, args.httpStatus, args.errorMsg);
                callback({ httpError: true }, null);
            } else if (args.isTimeout) {
                //记录超时日志
                _this.logTimeout(fullUrl);
                callback({ timeout: true }, null);
            }
        });
    };
    return HttpClient;
})();
exports.HttpClient = HttpClient;
