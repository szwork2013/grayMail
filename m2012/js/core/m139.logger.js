/**
 * @fileOverview 定义日志类.
 */

(function (Backbone, M139) {

    M139.Logger = Backbone.Model.extend(
    /**
     *@lends M139.Logger.prototype
     */
    {
        /** 日志类
         *@constructs M139.Logger
         *@param {Object} options 初始化配置
         *@param {String} options.name logger名，通常以项目命名
         *@example
         var logger = new M139.Logger({name:"sms_sendpage"});
         logger.error("发送失败");
        */
        initialize: function (options) {
            if (!options || !options.name) {
                this.set("name", "unknown");
            }
        },
        /**
        *记录debug级别日志
        */
        debug: function (msg) {
            if (!top.SiteConfig.isDev) return;
            if (top.console && arguments.length > 0){
                if (top.console.debug){
                    if ( "[object Function]" === Object.prototype.toString.call(top.console.debug) ) {
                        top.console.debug("[DEBUG][" + this.get("name") + "]");
                        top.console.debug.apply(top.console, arguments);
                    } else {
                        top.console.debug("[DEBUG][" + this.get("name") + "]" + msg);
                    }
                } else {
                    top.console.log("[DEBUG][" + this.get("name") + "]" + msg);
                }
            };
        },
        /**
        *记录info级别日志
        *@param {String} msg 日志内容
        *@param {Boolean} bSendToServer 是否记录到服务端
        */
        info: function (msg, bSendToServer) {
            var pefix = "[INFO][" + this.get("name") + "]";
            pefix += "[" + msg + "]";
            if (top.console && arguments.length > 0){
                if (top.console.info){
                    if (top.console.info.apply){
                        top.console.info(pefix);
                        top.console.info.apply(top.console, arguments);
                    } else {
                        top.console.info(pefix);
                    }
                } else {
                    top.console.log(pefix);
                }
            };
            if (bSendToServer) {
                M139.Logger.sendClientLog({
                    level: "INFO",
                    name: "Logger-" + this.get("name"),
                    errorMsg: msg
                });
            }
        },
        /**
        *记录error级别日志，此级别以上日志上报到服务端
        */
        error: function (msg) {
            var pefix = "[ERROR][" + this.get("name") + "]";
            if (top.console && arguments.length > 0) {
                if (top.console.error){
                    if ("[object Function]" === Object.prototype.toString.call(top.console.error)){
                        top.console.error(pefix);
                        top.console.error.apply(top.console, arguments);
                        if (top.console.trace) { top.console.trace(); }
                    } else {
                        top.console.error(pefix + msg);
                    }
                }
            };
            M139.Logger.sendClientLog({
                level: "ERROR",
                name: "Logger-" + this.get("name"),
                errorMsg: msg
            });
        },
        /**
        *记录fatal级别日志，出现此类日志业务无法正常使用
        */
        fatal: function (msg) {
            var pefix = "[FATAL][" + this.get("name") + "]";
            if (top.console && arguments.length > 0){
                if (top.console.warn){
                    if (top.console.warn.apply){
                        top.console.warn(pefix);
                        top.console.warn.apply(top.console, arguments);
                    } else {
                        top.console.warn(pefix + msg);
                    }
                }
            };
            M139.Logger.sendClientLog({
                level: "FATAL",
                name: "Logger-" + this.get("name"),
                errorMsg: msg
            });
        },
        /**
        *常规的调用log
        */
        log: function (level, msg) {
            if (top.console && arguments.length > 0){
                if (top.console.log){
                    if (top.console.log.apply){
                        top.console.log("[" + this.get("name") + "][" + level + "]");
                        top.console.log.apply(top.console, arguments);
                    } else {
                        top.console.log("[" + this.get("name") + "][" + level + "]" + msg);
                    }
                }
            };
        },
        /**
        *得到异常提示语，在throw的时候用，如: throw this.logger.getThrow("出错了");
        *@example
        throw this.logger.getThrow("出错了");
        */
        getThrow: function (error) {
            return this.get("name") + ":" + error;
        },
        
        /**
        * 上报到日志服务器，不推荐直接调用。
        */
        _report_: function(message) {
            console.log("_report_ has remove");
        }
    });


    jQuery.extend(M139.Logger,
    /**@lends M139.Logger*/
    {
        /**返回一个默认的日志对象，适用于没有依赖对象的时候*/
        getDefaultLogger: function () {
            if (!this.defaultLogger) {
                this.defaultLogger = new M139.Logger({ name: "default" });
            }
            return this.defaultLogger;
        },
        /**
         *上报点击行为日志
         *@param {Object} options参数集合
         *@param {String} options.key 行为键值，发送到服务端匹配
         *@param {String} options.actionId 可选参数，老的模式actionId
         *@param {String} options.thingId 可选参数，老的模式thingId
         */
        logBehavior: function (options) {
            if (window != window.top) {
                return top.M139.Logger.logBehavior(options);
            }
            if (!options) {
                console.error("M139.Logger.logBehavior()行为日志上报，参数为空");
                return;
            }
            //console.log("[上报日志]" + JSON.stringify(options));
            //只在测试线输出, 要在现网输出,在控制台输入"top.SiteConfig.isDev=true"并回车
            try { M139.Logger.getDefaultLogger().debug("[上报日志]" + JSON.stringify(options)) } catch (e) { }
            if (typeof options == "string") {
                options = { key: options };
            }
            var item = {};
            if (options.key) {
	            item.key = options.key;
            } else {
	            item.pageId = 24;
            }
            if (options.actionId) item.action = String(options.actionId);
            if (options.thingId) item.thingId = String(options.thingId);
            if (options.moduleId) item.module = String(options.moduleId);
            if (options.actionType) item.actionType = String(options.actionType);
            if (options.pageId) item.pageId = String(options.pageId);
            //插到待发队列里
            this.waitList.push(item);
            if (!this.behaviorTimer) {
                this.startWatchSend();
            }
        },
        /**
         *检查被点击的元素是否需要上报日志
         */
        behaviorClick: function (target) {
            var bhKey;
            var thingId;
            var actionId;
            var element = target;
            while (element) {
                if (element.getAttribute) {
                    bhKey = element.getAttribute("bh") || element.getAttribute("behavior");
                    actionId = element.getAttribute("action");
                    thingId = element.getAttribute("thing");
                }
                if (bhKey || actionId) {
                    break;
                } else {
                    element = element.parentNode;
                }
            }
            if (bhKey || actionId) {
                M139.Logger.logBehavior({
                    key: bhKey,
                    actionId: actionId,
                    thingId: thingId
                });
            } else {
                m2011Behavior();
            }
            //老的行为捕获
            function m2011Behavior() {
                var behavior;
                var ext;
                var element = target;
                var pageId = '';
                //冒泡找到html节点里定义的行为
                try {
                    while (element) {
                        //广告系统输出的链接
                        //默认actionId为8000
                        //moduleId -1 表示到后台才检索模块id
                        if (element.getAttribute("thingid") && !element.getAttribute("behavior")) {
                            var elementThingId = element.getAttribute("thingid");
                            if (/^\d+$/.test(elementThingId)) {
                                top.M139.Logger.logBehavior({
                                    actionId: 8000,
                                    thingId: elementThingId,
                                    moduleId: 0,
                                    pageId: pageId
                                });
                                return;
                            }
                        }

                        behavior = element.getAttribute("behavior");
                        ext = element.getAttribute("ext");
                        if (behavior) {
                            break;
                        } else {
                            var actionId = element.getAttribute("tj_actionid");
                            if (actionId && /^\d+$/.test(actionId)) {
                                var thingId = element.getAttribute("tj_thingid");
                                var moduleId = element.getAttribute("tj_moduleid");
                                top.M139.Logger.logBehavior({
                                    actionId: tj_actionid,
                                    thingId: thingId,
                                    moduleId: moduleId,
                                    pageId: pageId
                                });
                                return;
                            }
                        }
                        element = element.parentNode;
                        if (element == null || "#document" === element.nodeName) {
                            break;
                        }
                    }
                } catch (e) { }
            }
        },
        //行为日志暂时放这里，回头移除掉
        waitList: [],
        startWatchSend: function () {
            var This = this;
            //todo 写死
            var _sid = '';
            if (top.sid) {
                _sid = top.sid;
            } else if (top.$App && typeof(top.$App.getSid) === "function") {
                _sid = top.$App.getSid();
            } else {
                return;
            }

            var url = M139.Text.Url.makeUrl(top.SiteConfig.behaviorLog, {
                sid: _sid
            });
            this.behaviorTimer = setInterval(function () {
                var list = This.waitList.concat();
                
                if (list.length == 0) {
                    return;
                }
                This.waitList.length = 0;
                //console.log("开始发送行为日志：" + JSON.stringify(This.waitList));
                //只在测试线输出, 要在现网输出,在控制台输入"top.SiteConfig.isDev=true"并回车
                try { M139.Logger.getDefaultLogger().debug("开始发送行为日志：" + JSON.stringify(This.waitList)) } catch (e) { }
                M139.RichMail.API.call(url, {
                    version: "m2012",
                    behaviors: list
                }, function (res) {
                    //console.log(JSON.stringify(res.responseData));
                    try { M139.Logger.getDefaultLogger().debug(JSON.stringify(res.responseData)) } catch (e) { }
                });
            }, 10000);
        },

        clientLogSendCount: 0,
        clientLogSendMax: 50, //最多50条日志，防止无限制刷

        /**
         *发送客户端日志：如脚本报错，HTTP接口异常
         *@param {Object} options参数集合
         *@param {String} options.level 日志级别：一般为INFO、ERROR，默认为ERROR
         *@param {String} options.name 日志名称
         */
        sendClientLog: function (options) {
            if (!options) return;

            if (this.clientLogSendCount > this.clientLogSendMax) {
                return;
            }

            if (!options.name) options.name = "NONE";
            if (!options.level) options.level = "ERROR";
            var postData = {};
            //key全部转大写
            for (var p in options) {
                var value = String(options[p]);
                if (value.indexOf("\n") > -1) {
                    value = encodeURIComponent(value);
                }
                postData[p.toUpperCase()] = value;
            }
            //todo 迁移逻辑
            try{
                var _sid = top.sid || top.$App.getSid();
            } catch (e) { }

            var url = M139.Text.Url.makeUrl(top.SiteConfig.scriptLog, {
                sid: _sid
            });
            this.clientLogSendCount++;

            var client = new M139.HttpClient();
            client.request({
                method: "post",
                timeout: 10000,
                url: url,
                isSendClientLog:false,//通讯异常不上报日志，避免上报死循环
                data: M139.Text.Xml.obj2xml({
                    version: "m2012",
                    messages: [postData]
                }),
                headers: {
                    "Content-Type": "application/xml"
                }
            });
        }
    });


    /**
     *脚本异常日志
     *@inner
     */
    window.onerror = function (msg, file, lines) {
        if (typeof msg != "string") return;
        var stack = [];
        var caller = arguments.callee.caller;
        if (caller == null) return;

        var reg_getFunName = /function (\w*\([^(]*\))/;

        for ( var i = 0xFF; i > -1; i-- ) {
        //while (caller) {
            var funCode = caller.toString();
            var match = funCode.match(reg_getFunName);
            stack.push((match && match[1]) || funCode);
            caller = caller.caller;
            if (!caller) break;
        }

        //上报日志
        M139.Logger.sendClientLog({
            level: "ERROR",
            name: "SCRIPTERROR",
            file: file,
            errorMsg: msg,
            lines: lines,
            stack: M139.Text.Utils.getTextOverFlow(stack.join(""),200,true)
        });
    }


    if (window == window.top) {
        //点击行为日志
        M139.Event.GlobalEvent.on("click", function (e) {
            var event = e.event;
            var target = event.target;
            M139.Logger.behaviorClick(target);
       });
    }
    //日志接口缩写
    window.BH = function (options) {
        return M139.Logger.logBehavior(options);
    }
    if (window.addBehavior) {
        var delegate = window.addBehavior;
        
        var logger = M139.Logger.getDefaultLogger();
        
        window.addBehavior = function (key) {
            delegate(key);
            logger.info("调用了旧版的addBehavior：" + key);
        }
    }
})(Backbone, M139);