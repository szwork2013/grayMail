/**
 * @fileOverview 定义AJAX客户端类.
 */
(function (M139) {
    M139.HttpClient = Backbone.Model.extend(
        /**
        *@lends M139.HTTPClient.prototype
        */
    {
        /** AJAX客户端
        *@constructs M139.HttpClient
        *@param {Object} options 初始化配置
        *@param {String} options.name client名称，打印日志定位问题时有用
        *@param {Window} options.proxy 其它代理窗口，用于跨域请求
        *@example
        var client = new M139.HTTPClient(
            {
                name:"RichMailHttpClient"
            }
        );
        */
        initialize: function (options) {
            /**
             *关联一个日志对象，日志的name关联此类的name，一般只在继承类里使用
             *@field
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({
                name: this.get("name")
            });


            this.on("beforerequest", this.onBeforeRequest);
        },

        defaults: {
            name: "M139.HttpClient"
        },

        /**
        *AJAX方法的封装 *注：每一次ajax方法都会重新创建一个XMLHttpRequest对象，因此可以重复发请求
        *@param {Object} options 配置参数
        *@param {String} options.url 请求提交的地址
        *@param {String} options.method http方法，post或者get，默认是get
        *@param {String} options.data 发送的数据，一般为String类型，如果data为对象，则默认以url-encoding的方式转换为key=value&key1=
        *@param {Number} options.timeout http方法，请求超时时间设置(毫秒)，为了避免阻塞其它请求，timeout还是很有必要的
        *@param {Object} options.headers http头设置，比如：Content-Type
        *@param {Function} callback 响应回调，自动监听为 client.on("response",callback);
        *@returns {M139.HttpClient} 返回对象自身
        *@example
        httpClient.request(
            {
                method:"post",
                timeout:10000,
                url:"/s?func=mbox:listMessage",
                headers:{
                    "Content-Type":"text/javascript"
                }
            },
            function(e){
                console.log(e.status);//http返回码，200,404等
                console.log(e.isTimeout);//返回是否超时
                console.log(e.responseText);//http返回码，200,404等
                console.log(e.getHeaders());//返回的http头集合，使用函数因为默认处理http头会消耗性能
            }
        );
        */
        request: function (options, callback) {
            this.requestOptions = options;
            var This = this;
            if (this.xhr) {
                throw this.logger.getThrow("一个HTTPClient实例只能执行一次request操作");
            }
            //在时间中处理是否要取消当前请求（改为从代理页发起）
            this.trigger("beforerequest", options, callback);

            if (options.cancel) {
                if (options.async === false) {
                    return options.responseResult;
                } else {
                    return this;
                }
            }

            var xhr = this.xhr = this.utilCreateXHR(options);
            if (options.timeout) {
                var timer = setTimeout(function () {
                    if (xhr.readyState == 3 && xhr.status == 200) return;
                    xhr.abort();
                    This.onTimeout();
                }, options.timeout);
            }
            if (callback) {
                this.on("response", callback);
            }
            xhr.onreadystatechange = function (data) {
                //同步的ajax已在外面做了处理
                if (options.async === false) {
                    return;
                }

                if (xhr.readyState == 4 && xhr.status != 0) {//abort()后xhr.status为0
                    clearTimeout(timer);
                    clearTimeout(This.sendTimer);

                    var _status = xhr.status;

                    //httpStatus=1223是IE的一个bug，会将204状态码变为1223
                    //http://bugs.jquery.com/ticket/1450
                    //204状态是指服务器成功处理了客户端请求，但服务器无返回内容。204是HTTP中数据量最少的响应状态
                    if (1223 === _status && window.ActiveXObject) {
                        _status = 204;
                    }

                    if (_status == 304 || (_status >= 200 && _status < 300)) {
                        //保存服务时间，协助M139.Date.getServerTime()
                        //if (!M139._ServerTime_) {
                        var headers = This.utilGetHttpHeaders(xhr);
                        if (headers && headers["Date"]) {
                            var servreTime = new Date(headers["Date"]);
                            M139._ServerTime_ = servreTime;
                            M139._ClientDiffTime_ = new Date() - servreTime;
                        }
                        //}

                        This.onResponse({
                            responseText: xhr.responseText,
                            status: _status,
                            getHeaders: function () {
                                return This.utilGetHttpHeaders(xhr);
                            }
                        });

                       

                    } else {
                        This.onError({
                            status: _status,
                            responseText: xhr.responseText
                        });
                        try {
                            if (top.$App) {
                                top.$App.trigger('httperror', {
                                    status: _status
                                });
                            }
                        } catch (e) { }
                    }
                }
            }

            //url增加cguid，方便定位异常
            options.url = M139.Text.Url.makeUrl(options.url, {
                cguid: this.getCGUID()
            });

            var method = options.method || "get";
            var data = options.data;

            //如果到了这里data仍为object类型，则自动转化为urlencoded
            if (typeof data == "object") {
                data = [];
                for (var p in options.data) {
                    data.push(p + "=" + encodeURIComponent(options.data[p]));
                }
                data = data.join("&");
                if (!options.headers) options.headers = {};
                if (!options.headers["Content-Type"]) {
                    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }

            if (method.toLowerCase() == "get" && typeof data == "string") {
                options.url += "&" + data;
                data = "";
            }

            xhr.open(method, options.url, options.async !== false);

            

            this.utilSetHttpHeaders(options.headers, xhr);


            this.sendTimer = setTimeout(function () {
                if (options.isSendClientLog !== false) {
                    //上报日志 todo as event
                    M139.Logger.sendClientLog({
                        level: "ERROR",
                        name: "HttpClient",
                        errorMsg: "LongTimeNoResponse",
                        url: This.requestOptions.url
                    });
                    try {
                        if (top.$App) {
                            top.$App.trigger('httperror', {
                                isTimeout:true
                            });
                        }
                    } catch (e) { }
                }
            }, 10000);
            //同步ajax
            if (options.async === false) {
                xhr.send(data);
                clearTimeout(timer);
                clearTimeout(This.sendTimer);
                if (xhr.status == 304 || (xhr.status >= 200 && xhr.status < 300)) {
                    return This.onResponse({
                        responseText: xhr.responseText,
                        status: xhr.status,
                        getHeaders: function () {
                            return This.utilGetHttpHeaders(xhr);
                        }
                    });
                } else {
                    return This.onError({
                        status: xhr.status,
                        responseText: xhr.responseText
                    });
                }
            } else {
                xhr.send(data);
                return this;
            }
        },

        /**
         *获得一个cguid，带在请求的url上，方便前后端串联日志
         *cguid规范：由时间和4位的随机数组成。格式：小时+分+秒+毫秒+4位的随机
         */
        getCGUID: function () {
            function padding (n, m){
                var len = (m||2) - (1+Math.floor(Math.log(n|1)/Math.LN10+10e-16));
                return new Array(len+1).join("0") + n;
            };
            var now = new Date();
            return '' + padding(now.getHours()) + padding(now.getMinutes()) + padding(now.getSeconds()) + padding(now.getMilliseconds(), 3) + padding(Math.ceil(Math.random() * 9999), 4);
        },

        abort: function (options) {
            this.xhr.abort();
            this.onAbort();
            return this;
        },
        /**@static*/
        utilCreateXHR: function (options) {
            //return new XMLHttpRequest();
            var win = (options && options.window) || window;
            if (win.XMLHttpRequest) {
                return new win.XMLHttpRequest();
            }else {
                var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
                for (var n = 0; n < MSXML.length; n++) {
                    try {
                        return new win.ActiveXObject(MSXML[n]);
                        break;
                    }
                    catch (e) {
                    }
                }
            }
        },
        /**@static*/
        utilSetHttpHeaders: function (headers, xhr) {
            if (headers) {
                for (var p in headers) {
                    xhr.setRequestHeader(p, headers[p]);
                }
            }
        },
        /**@static*/
        utilGetHttpHeaders: function (xhr) {
            var lines = xhr.getAllResponseHeaders();
            var result = {};
            if (lines) {
                lines = lines.split(/\r?\n/);
                for (var i = 0; i < lines.length; i++) {
                    var l = lines[i];
                    var arr = l.split(": ");
                    var h = arr[0].replace(/^\w|-\w/g, function (v) { return v.toUpperCase(); }); //服务端有可能返回小写的头
                    if (h && arr[1]) {
                        result[h] = arr[1];
                    }
                }
            }
            return result;
        },
        /**@inner*/
        onAbort: function () {
            /**请求被中断事件
                * @name M139.HTTPClient#abort
                * @event
                * @param {Object} e 事件参数
                * @example
                httpClient.on("abort",function(e){
                });
            */
            this.trigger("abort");
        },
        /**@inner*/
        onResponse: function (info) {
            /**服务端响应事件
                * @name M139.HTTPClient#response
                * @event
                * @param {Object} e 事件参数
                * @param {Object} e.responseText 服务端响应报文
                * @param {Object} e.getHeaders() 获得响应头
                * @example
                httpClient.on("response",function(e){
                    console.log(e.status);
                    console.log(e.responseText);
                    console.log(e.getHeaders());
                });
            */
            this.trigger("response", info);
            return info;
        },
        /**
            *@inner
        */
        onError: function (e) {
            if (this.requestOptions.isSendClientLog !== false) {
                //上报日志 todo as event
                M139.Logger.sendClientLog({
                    level: "ERROR",
                    name: "HttpClient",
                    url: this.requestOptions.url,
                    status: e.status,
                    responseText: e.responseText
                });
            }
            /**服务端异常事件
                * @name M139.HTTPClient#error
                * @event
                * @param {Object} e 事件参数
                * @example
                httpClient.on("error",function(e){
                    console.log(e.status);
                    console.log(e.responseText);
                });
            */
            this.trigger("error", e);
        },
        /**@inner*/
        onTimeout: function () {
            /**服务端超时事件
                * @name M139.HTTPClient#timeout
                * @event
                * @param {Object} e 事件参数
                * @example
                httpClient.on("timeout",function(e){
                });
            */
            this.trigger("timeout");
        },

        /**
         *todo在这里处理路由
         *@inner
         */
        onBeforeRequest: function (options, callback) {
            if (document.domain == "10086.cn" && !options.hasRouted) {
                var This = this;
                var proxyConf = M139.HttpRouter.getProxy(options.url);
                if (proxyConf) {
                    //如果是同步请求，要立即返回
                    options.responseResult = M139.HttpRouter.proxyReady("http://" + proxyConf.host + "/" + proxyConf.proxy, function (win) {
                        options.url = proxyConf.url;
                        options.window = win;
                        options.cancel = false;
                        options.hasRouted = true;//避免路由多次
                        return M139.HttpClient.prototype.request.call(This, options, callback);//避免走子类重新的怪异行为
                    });
                    options.cancel = true;
                }
            }
        }
    });
})(M139);
