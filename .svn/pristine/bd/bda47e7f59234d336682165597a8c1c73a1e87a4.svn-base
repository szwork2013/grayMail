/**
 * @fileOverview 定义M139.ExchangeHttpClient客户端类.
 */

(function (M139) {
    var $T = M139.Text;
    //todo rename Adapter
    M139.ExchangeHttpClient = M139.HttpClient.extend(
        /**
        *@lends M139.ExchangeHttpClient.prototype
        */
    {
        /** 具有数据转换能力的HttpClient类的继承对象，主要作用是在request之前整合上行数据包，在response之后整合下行数据包
        *@constructs M139.ExchangeHttpClient
        *@extends M139.HttpClient
        *@param {Object} options 初始化配置，参数继承M139.HttpClient的初始化参数
        *@param {String} options.router 路由标志位
        *@param {String} options.requestDataType 请求时要转化的数据类型，如：ObjectToXML
        *@param {String} options.responseDataType 请求时要转化的数据类型，如：JSONToObject、XMLToObject
        *@example
        var rmClient = new M139.ExchangeHttpClient(
            {
                name:"RichMailHttpClient",
                router:"appsvr",
                requestDataType:"ObjectToXML",
                responseDataType:"JSON2Object"
            }
        );
        */
        initialize: function (options) {
            M139.HttpClient.prototype.initialize.apply(this, arguments);
        },

        defaults: {
            name: "M139.ExchangeHttpClient"
        },

        /**
        *继承自M139.HttpClient.request方法， 增加了一些参数功能
        *@see M139.HttpClient#request
        *@param {Object} options 配置参数
        *@param {String} options.api 与url参数不同，api可以通过路由对象转化为url，要配合初始化参数router使用
        *@returns {M139.HttpClient} 返回对象自身
        *@example
        client.request(
            {
                method:"post",
                timeout:10000,
                data:{
                    fid:1
                },
                api:"mbox:listMessage",
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
            var This = this;
            var requestDataType = options.requestDataType || this.get("requestDataType");
            if (requestDataType) {
                var changeData = M139.ExchangeHttpClient.DataType[requestDataType];
                if (!changeData) {
                    throw this.logger.getThrow("RequestDataType \"" + requestDataType + "\" unregister");
                }
                //转换请求数据
                if (changeData.exchangeData) {
                    options.data = changeData.exchangeData(options.data, options.headers);
                }
                //修改http头
                if (changeData.exchangeHeader) {
                    options.headers = changeData.exchangeHeader(options.headers || {});
                }
            }
            //请求父类的方法
            return M139.HttpClient.prototype.request.apply(this, arguments);
        },
        /**@inner*/
        onResponse: function (info) {
            var This = this;
            var responseDataType = this.requestOptions.responseDataType || this.get("responseDataType");
            //转换报文为数据对象，添加到info的responseData属性上
            if (responseDataType) {
                var dataChange = M139.ExchangeHttpClient.DataType[responseDataType];
                if (!dataChange) {
                    throw this.logger.getThrow("ResponseDataType \"" + responseDataType + "\" unregister");
                }
                info.responseData = dataChange.exchangeData(info.responseText);
                if (info.responseData == null && info.getHeaders()["Content-Type"] != "text/html") {
                    //上报日志 todo as event
                    M139.Logger.sendClientLog({
                        level: "ERROR",
                        name: "ExchangeHttpClient",
                        url: this.requestOptions.url,
                        errorMsg: "exchange data error",
                        dataType: responseDataType,
                        responseText: info.responseText
                    });
                    /**解析数据异常
                        * @name M139.ExchangeHttpClient#exchangeerror
                        * @event
                        * @param {Object} e 事件参数
                        * @param {String} e.responseText 解析出错的文本
                        * @example
                        client.on("exchangeerror",function(e){
                        });
                    */
                    this.trigger("exchangeerror", {
                        dataType: responseDataType,
                        responseText: info.responseText
                    });
                }
            }
            return M139.HttpClient.prototype.onResponse.apply(this, arguments);
        }
    });
    /**
     *静态对象，存放数据对象转换类
    */
    M139.ExchangeHttpClient.DataType = {};
    //后续需要改造成管理类
    /**
     *注册转换的数据类型处理
     *@static
     *@param {Object} options 配置参数
     *@param {String} options.dataType 转换的数据类型
     *@param {Function} options.exchangeData 转换数据
     *@param {Function} options.exchangeHeader 转换http头
    */
    M139.ExchangeHttpClient.registerExchangeDataType = function (options) {
        var map = M139.ExchangeHttpClient.DataType;
        map[options.dataType] = options;
    }

    //内置几种常用的数据解析方法
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "ObjectToXML",
        exchangeData: function (data,headers) {
            if (typeof data == "string") {
                return data;
            } else {
                if (headers && headers["Content-Type"] == "application/x-www-form-urlencoded") {
                    return data;
                } else {
                    return $T.Xml.obj2xml(data);
                }
            }
        },
        exchangeHeader: function (headers) {
            if (!headers["Content-Type"]) {
                headers["Content-Type"] = "application/xml";
            }
            return headers;
        }
    });
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "ObjectToXML2",
        exchangeData: function (data) {
            if(typeof data == "string"){
                return data;
            }else{
                return $T.Xml.obj2xml2(data);
            }
        },
        exchangeHeader: function (headers) {
            if (!headers["Content-Type"]) {
                headers["Content-Type"] = "application/xml";
            }
            return headers;
        }
    });
    //.net站点的通讯录模式
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "ObjectToXML2_URL",
        exchangeData: function (data) {
            return "xml=" + encodeURIComponent($T.Xml.obj2xml2(data));
        },
        exchangeHeader: function (headers) {
            headers["Content-Type"] = "application/x-www-form-urlencoded";
            return headers;
        }
    });

    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "XML2Object",
        exchangeData: function (data) {
            return M139.Text.Xml.xml2object(data);
        }
    });

    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "JSON2Object",
        exchangeData: function (data) {
            return M139.JSON.tryEval(data);
        }
    });
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "Nothing",
        exchangeData: function (data) {
            return data;
        }
    });
    // add by tkh 云邮局阅读器http请求上行报文数据格式：JSON字符串
    M139.ExchangeHttpClient.registerExchangeDataType({
        dataType: "Object2JSON",
        exchangeData: function (data) {
            return M139.JSON.stringify(data);
        }
    });
})(M139);