(function ($, M139) {

    // Mock测试
    // 实现思路为对XMLHttpRequest对象进行模拟，以控制对远程资源的请求过滤与处理（因为目前139客户端均采用ajax请求数据）
    // 代码实现本身比较简单，其中部分代码借鉴自jQuery插件mockjax，可参考：https://github.com/appendto/jquery-mockjax

    var _ajax = $.ajax,
        mockHandlers = [];

    var parseXML = M139.Text.Xml.parseXML;

    // 参数匹配校验
    function isMockDataEqual(mock, live) {
        var identical = true;
        if (typeof live === 'string') {
            return $.isFunction(mock.test) ? mock.test(live) : mock == live;
        }
        $.each(mock, function (k) {
            if (live[k] === undefined) {
                identical = false;
                return identical;
            } else {
                if (typeof live[k] == 'object') {
                    identical = identical && isMockDataEqual(mock[k], live[k]);
                } else {
                    if ($.isFunction(mock[k].test)) {
                        identical = identical && mock[k].test(live[k]);
                    } else {
                        identical = identical && (mock[k] == live[k]);
                    }
                }
            }
        });
        return identical;
    }

    function getMockForRequest(handler, requestSettings) {
        // 也接受API参数，但优先使用URL
        handler.url = handler.url || handler.api || "NO_URL_FOR_MATCH";
        if (handler && handler.type &&
            handler.type.toLowerCase() != requestSettings.type.toLowerCase()) {
            // 请求类型不一致，也不予拦截
            return null;
        }
        if ($.isFunction(handler.url.test)) {
            // 正则表达式的情形
            if (!handler.url.test(requestSettings.url)) {
                return null;
            }
        } else {
            // 
            if (!new RegExp(handler.url.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace(/\*/g, '.+')).test(requestSettings.url)) {
                return null;
            }
        }
        // 匹配的数据，为POST的数据
        if (handler.data && requestSettings.data) {
            if (!isMockDataEqual(handler.data, requestSettings.data)) {
                return null;
            }
        }
        return handler;
    }

    function _xhrSend(mockHandler, requestSettings, origSettings) {

        var process = (function (that) {
            return function () {
                return (function () {
                    var onReady;
                    this.status = mockHandler.status;
                    this.statusText = mockHandler.statusText;
                    this.readyState = 4;

                    if (requestSettings.dataType == 'json' && (typeof mockHandler.responseText == 'object')) {
                        // 这里的JSON化，M139公共代码里已包含相关API
                        this.responseText = JSON.stringify(mockHandler.responseText);
                    } else if (requestSettings.dataType == 'xml') {
                        if (typeof mockHandler.responseXML == 'string') {
                            this.responseXML = parseXML(mockHandler.responseXML);
                            this.responseText = mockHandler.responseXML;
                        } else {
                            this.responseXML = mockHandler.responseXML;
                        }
                    } else {
                        this.responseText = mockHandler.responseText;
                    }
                    if (typeof mockHandler.status == 'number' || typeof mockHandler.status == 'string') {
                        this.status = mockHandler.status;
                    }
                    if (typeof mockHandler.statusText === "string") {
                        this.statusText = mockHandler.statusText;
                    }
                    /**
                     *  modify by wn
                     *  @调换回调函数位置，并且传入实例
                     */
                    // 调用用户回调函数
                    if ($.isFunction(mockHandler.response)) {
                        // 回调接收当前请求的相关参数，urlParams包含URL请求参数，data包含POST数据
                        mockHandler.response(origSettings , this );
                    }

                    onReady = this.onreadystatechange || this.onload;

                    if ($.isFunction(onReady)) {
                        if (mockHandler.isTimeout) {
                            this.status = -1;
                        }
                        onReady.call(this, mockHandler.isTimeout ? 'timeout' : undefined);
                    } else if (mockHandler.isTimeout) {
                        this.status = -1;
                    }
                }).apply(that);
            };
        })(this);

        if (mockHandler.proxy) {
            // 请求远程资源
            _ajax({
                global: false,
                url: mockHandler.proxy,
                type: mockHandler.proxyType,
                data: mockHandler.data,
                dataType: requestSettings.dataType === "script" ? "text/plain" : requestSettings.dataType,
                complete: function (xhr) {
                    mockHandler.responseXML = xhr.responseXML;
                    mockHandler.responseText = xhr.responseText;
                    mockHandler.status = xhr.status;
                    mockHandler.statusText = xhr.statusText;
                    process();
                }
            });
        } else {
            // type == 'POST' || 'GET'
            if (requestSettings.async === false) {
                process();
            } else {
                this.responseTimer = setTimeout(process, mockHandler.responseTime || 50);
            }
        }
    }

    // 构造一个xhr mock对象
    function xhr(mockHandler, requestSettings, origSettings, origHandler) {
        mockHandler = $.extend(true, {}, M139.API.Mock.settings, mockHandler);

        if (typeof mockHandler.headers === 'undefined') {
            mockHandler.headers = {};
        }
        if (mockHandler.contentType) {
            mockHandler.headers['content-type'] = mockHandler.contentType;
        }

        return {
            status: mockHandler.status,
            statusText: mockHandler.statusText,
            readyState: 1,
            open: function () {},
            send: function () {
                origHandler.fired = true;
                _xhrSend.call(this, mockHandler, requestSettings, origSettings);
            },
            abort: function () {
                clearTimeout(this.responseTimer);
            },
            setRequestHeader: function (header, value) {
                mockHandler.headers[header] = value;
            },
            getResponseHeader: function (header) {
                if (mockHandler.headers && mockHandler.headers[header]) {
                    return mockHandler.headers[header];
                } else if (header.toLowerCase() == 'last-modified') {
                    return mockHandler.lastModified || (new Date()).toString();
                } else if (header.toLowerCase() == 'etag') {
                    return mockHandler.etag || '';
                } else if (header.toLowerCase() == 'content-type') {
                    return mockHandler.contentType || 'text/plain';
                }
            },
            getAllResponseHeaders: function () {
                var headers = '';
                $.each(mockHandler.headers, function (k, v) {
                    headers += k + ': ' + v + "\n";
                });
                return headers;
            }
        };
    }

    // 保留当前请求的URL参数和POST数据，这里URLParams和POST Data分开保存
    function copyUrlParameters(origSettings, requestSettings) {
        // 将URL参数及POST数据保留下来
        origSettings.urlParams = M139.Text.Url.getQueryObj(origSettings.url) || {};
        origSettings.data = requestSettings.data || {};
    }

    // 获取ajax客户端mock对象
    function getMockForXHR(origSettings) {
        var mockRequest, requestSettings, mockHandler;
        requestSettings = $.extend(true, {}, M139.API.Mock.settings, origSettings);

        requestSettings.data = requestSettings.origRequestData || origSettings.data;
        requestSettings.type = requestSettings.method;

        for (var k = 0; k < mockHandlers.length; k++) {
            if (!mockHandlers[k]) {
                continue;
            }
            mockHandler = getMockForRequest(mockHandlers[k], requestSettings);
            if (!mockHandler) {
                continue;
            }

            M139.API.Mock.settings.log(mockHandler, requestSettings);

            mockHandler.cache = requestSettings.cache;
            mockHandler.timeout = requestSettings.timeout;
            mockHandler.global = requestSettings.global;

            copyUrlParameters(origSettings, requestSettings);

            //返回ajax客户端的Mock对象
            return xhr(mockHandler, requestSettings, origSettings, mockHandlers[k]);
        }

        // 不需要拦截该次请求
        return null;
    }

    var client = M139.HttpClient,
        exclient = M139.ExchangeHttpClient;

    if (client) {
        var xhrCreator = client.prototype.utilCreateXHR;
        // 拦截代理原ajax客户端
        // 目前对utilCreateXHR方法进行覆写，其实是依赖了这个实现的，主要是由于M139.HttpClient的request中还包含了些其他的处理，直接覆写request要多写些额外的代码
        // 若以后该方法变更或失效了，可改为替换request方法，代码稍作变换即可
        client.prototype.utilCreateXHR = function (options) {
            return getMockForXHR(options || {}) || xhrCreator.apply(this, arguments);
        };
        if (exclient) {
            // 需要在数据进行转换前保留原始数据，用于参数匹配
            var origExRequest = exclient.prototype.request;
            exclient.prototype.request = function (options) {
                options && (options.origRequestData = options.data);
                return origExRequest.apply(this, arguments);
            };
        }
    }

    M139.core.namespace("M139.API.Mock", {
        // 添加一个Mock对象，返回Mock对象对应的ID
        add: function (settings) {
            var i = mockHandlers.length;
            mockHandlers[i] = settings;
            return i;
        },
        // 清除指定ID的Mock对象，不传参时清空所有Mock对象
        clear: function (i) {
            if (arguments.length == 1) {
                mockHandlers[i] = null;
            } else {
                mockHandlers = [];
            }
        },
        // 全局配置对象
        settings: {
            //url: null,
            //type: 'GET',
            log: function (mockHandler, requestSettings) {
                if (mockHandler.logging === false ||
                    (typeof mockHandler.logging === 'undefined' && M139.API.Mock.settings.logging === false)) {
                    return;
                }
                if (window.console && typeof console.log === 'function') {
                    var message = 'MOCK ' + requestSettings.type.toUpperCase() + ': ' + requestSettings.url;
                    var request = $.extend({}, requestSettings);
                    console.log(message, request);
                }
            },
            logging: true,
            status: 200,
            statusText: "OK",
            responseTime: 80,
            isTimeout: false,
            contentType: 'text/plain',
            response: '',
            responseText: '',
            responseXML: '',
            proxy: '',
            proxyType: 'GET',
            lastModified: null,
            etag: '',
            headers: {
                etag: 'IJF@H#@923uf8023hFO@I#H#',
                'content-type': 'text/plain'
            }
        }
    });

    // 绑定全局对象
    window.$Mock = M139.API.Mock;

})(jQuery, M139);