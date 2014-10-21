/**
 * @fileOverview 定义M139基础框架的文件.
 */
var M139;
(function (jQuery, Backbone) {
    /**
       *@namespace 
       @inner
       *顶级命名空间
    */
    M139 = {};

    M139.Core = Backbone.Model.extend(
        /**
        *@lends M139.Core.prototype
        */
        {


            /**
                *标准版框架基础类，实例化以后是M139.core (小写)
                *@constructs M139.Core
                *@memberOf M139
                *@param {Object} options 初始化参数集，主要是一些配置信息
                *@param {Stirng} options.jsPath 声明JS文件存放的路径
            */
            initialize: function (options) {
                this.jsPath = options.jsPath;
            },

            /**
                *JS模块异步加载状态，未加载|加载中|已加载
                *@inner
            */
            NSLOADEDSTATUS: {
                "NOTLOAD": "none",
                "LOADING": "loading",
                "LOADED": "loaded"
            },

            /**
                *定义异常
                *@inner
            */
            THROWS: {
                "NSNOTEXIST": "namespace not registered:"
            },


            /***@inner*/
            defaults: {
                definedJSNSPath: {},
                loadingJSPath: {},
                loadedJSPath: {}
            },


            /**
            *声明命名空间与对应的JS对象
            *@param {Stirng} namespace 名称空间，比如M139.dom
            *@param {Object} obj 名称空间对应的JS对象
            *@param {Window} win 注册名称空间的window对象
            * @example
            * M139.core.namespace("M139.dom",{ hasClass:function(){} });
            */
            namespace: function (namespace, obj, win) {
                var path = namespace.split(".");
                var target = win || window;
                while (path.length > 0) {
                    var p = path.shift();
                    if (!target[p]) {
                        if (path.length > 0) {
                            target[p] = {};
                        } else {
                            target[p] = obj || {};
                        }
                    } else {
                        if (path.length == 0) {
                            target[p] = jQuery.extend(target[p], obj);
                        }
                    }
                    target = target[p];
                }
                /**命名空间注册产生的事件
                    * @name M139.Core#namespace
                    * @event
                    * @param {String} ns 加载成功的命名空间
                    * @example M139.core.on("namespace",function(ns){});
                */
                this.trigger("namespace", namespace);
                return target;
            },


            /**
            *@inner
            */
            getJSPathByNS: function (ns) {
                var container = this.get("definedJSNSPath");
                var p = container[ns];
                if (!p) {
                    p = ns.toLowerCase() + ".js";//如果没有注册，则默认为命名空间的小写单词文件名
                }
                return this.jsPath + "/" + p;
            },


            /**
            *声明名称空间与对应的JS文件路径
            *@param {String} namespace 要注册名称空间
            *@param {String} jsPath 实际JS文件路径
            * @example
            * M139.core.registerJS("M139.dom","m139.dom.js");
            */
            registerJS: function (namespace, jsPath) {
                var container = this.get("definedJSNSPath");
                container[namespace] = jsPath;
                this.trigger("registerjs", { namespace: namespace, path: jsPath });
            },


            /**
            *加载名称空间类库，如果已加载则不重复加载
            *@param {Array} usingNSList 要引入的模块
            *@param {Function} callback 模块引入后一步调用callback
            * @example
            * M139.core.requireJS(["M139.dom","M139.text"],function(){});
            */
            requireJS: function (usingNSList, callback) {
                var count = 0;
                var notLoadNS = [];
                var loadingNS = [];
                var loadedNS = [];
                for (var i = 0; i < usingNSList.length; i++) {
                    var ns = usingNSList[i];
                    var readyStatus = this.checkNSLoaded(ns);
                    switch (readyStatus) {
                        case this.NSLOADEDSTATUS.NOTLOAD:
                            notLoadNS.push(ns);
                            break;
                        case this.NSLOADEDSTATUS.LOADING:
                            loadingNS.push(ns);
                            break;
                        case this.NSLOADEDSTATUS.LOADED:
                            loadedNS.push(ns);
                            break;
                    }
                }
                count = loadedNS.length;
                var notReadyNS = loadingNS.concat(notLoadNS);
                //所有ns都已经加载过了
                if (count === usingNSList.length) {
                    doCallback();
                } else {
                    //这里还要检查是否加载成功

                    this.on("namespaceload", function (e) {
                        if (jQuery.inArray(e.namespace, notReadyNS) > -1) {
                            count++;
                            if (count === usingNSList.length) {
                                this.off("namespaceload", arguments.callee);
                                doCallback();
                            }
                        }
                    });
                    var This = this;
                    for (var i = 0; i < notLoadNS.length; i++) {
                        this.loadNS(notLoadNS[i], function () {
                            This.trigger("namespaceload", {
                                namespace: ns,
                                path: path
                            });
                        });
                    }
                }
                function doCallback() {
                    setTimeout(callback, 0);
                }
            },


            /**
            *判断该名称空间是否已加载
            *@returns {NSLOADEDSTATUS}
            *@inner
            */
            checkNSLoaded: function (ns) {
                if (this.get("loadingJSPath")[ns]) {
                    return this.NSLOADEDSTATUS.LOADING;
                } else if (this.get("definedJSNSPath")[ns]) {
                    return this.NSLOADEDSTATUS.NOTLOAD;
                } else {
                    var obj;
                    try {
                        obj = eval(ns);
                    } catch (e) { }
                    if (obj) {
                        return this.NSLOADEDSTATUS.LOADED;
                    } else {
                        return this.NSLOADEDSTATUS.NOTLOAD;
                    }
                }
            },


            /**@inner*/
            loadNS: function (ns, callback) {
                var path = this.getJSPathByNS(ns);
                this.utilCreateScriptTag({
                    id: ns,
                    src: path
                }, function () {
                    //这里要先检查

                    this.trigger("namespaceload", {
                        namespace: ns,
                        path: path
                    });
                    delete this.get("loadingJSPath")[ns];
                    this.get("loadedJSPath")[ns] = 1;
                });
                this.get("loadingJSPath")[ns] = 1;
            },

            /**
             *获得js加载路径
             *@inner
             */
            getScriptPath: function (jsFile) {
                var isLocalJS = /\.js($|\?)/.test(jsFile) && !/\/|http:/.test(jsFile);
                if (isLocalJS) {
                    var base = "/m2012/js";
                    if (jsFile.indexOf(".pack.js") > -1) {
                        base += "/packs/";
                    }
                    if (jsFile.indexOf("?") == -1) {
                        try {
                            jsFile += "?sid=" + $App.getSid();
                        } catch (e) { }
                    }
                    return base + "/" + jsFile;
                } else {
                    return jsFile;
                }
            },

            /**
            *动态加载script标签
            *@param {Object} options 配置
            *@param {Stirng} options.id script标签的id ; 
            *@param {Stirng} options.src JS文件地址（完整路径）; 
            *@param {Stirng} options.charset 给script标签加charset属性
            *@param {Function} callback 加载完成的回调
            *@example
            *M139.core.utilCreateScriptTag(
                 {
                    id:"examplejs",
                    src:"http://images.139cm.com/m2012/richmail/js/example.js",
                    charset:"utf-8"
                 },
                 function(){
                     alert("文件加载完毕");
                 }
            *);
            */
            utilCreateScriptTag: function (options, callback) {
                var This = this;
                if (callback) {
                    var _callback = callback;
                    var callback = function () {
                        _callback.call(This);
                    }
                }
                var scriptId = options.id;
                var dataHref = this.getScriptPath(options.src);
                var charset = options.charset;
                var isReady = false;
                var head = document.getElementsByTagName("head")[0];
                var objScript = scriptId && document.getElementById(scriptId);
                //是否移出脚本DOM(非IE9时处理)
                var isRemoveScriptDom = !document.all && true || false,
                browserVersion = ["trident/7.0", "msie 10.0", "msie 9.0", "chrome", "firefox"],
                i = 0, bvLenght = browserVersion.length - 1,
                currVersion = window.navigator.userAgent.toLowerCase() || "";
                //IE9、chrome、firefox时处理
                while (i <= bvLenght) {
                    isRemoveScriptDom = currVersion.indexOf(browserVersion[i]) > -1 && true || false;
                    if (isRemoveScriptDom) {
                        break;
                    }
                    i++;
                }
                browserVersion = null;
                try {
                    if (objScript && isRemoveScriptDom) {
                        objScript.src = "";
                        objScript.parentNode.removeChild(objScript);
                        objScript = null;
                    }
                }
                catch (e) { }
                if (objScript != null) {
                    if (dataHref.indexOf("?") == -1) dataHref += "?";
                    dataHref += "&" + Math.random();
                    objScript.src = dataHref;
                    var dataScript = objScript;
                } else {
                    var dataScript = document.createElement("script");
                    if (scriptId) {
                        dataScript.id = scriptId;
                    }
                    if (charset) {
                        dataScript.charset = charset;
                    }
                    try {
                        if (dataHref.indexOf("?") == -1) {
                            dataHref = M139.Text.Url.makeUrl(dataHref, {
                                sid: top.$App.getSid()
                            });
                        }
                    } catch (e) {
                    }
                    dataScript.src = dataHref;
                    dataScript.defer = true;
                    dataScript.type = "text/javascript";
                    head.appendChild(dataScript);
                }
                if (document.all) {
                    dataScript.onreadystatechange = function () {
                        if (dataScript.readyState == "loaded" || dataScript.readyState == "complete") {
                            isReady = true;
                            if (callback) callback();
                        }
                    }
                } else {
                    dataScript.onload = function () {
                        isReady = true;
                        if (callback) callback();
                    }
                    dataScript.onerror = function () {
                        isReady = true;
                        if (callback) callback();
                    }
                }
            }
        });
    //静态实例化
    M139.core = M139.Core = new M139.Core({
        jsPath: "/m2012/js"
    });

    M139.namespace = function () {
        M139.Core.namespace.apply(M139.Core, arguments);
    };
    M139.requireJS = function () {
        M139.Core.requireJS.apply(M139.Core, arguments);
    };
    M139.registerJS = function () {
        M139.Core.registerJS.apply(M139.Core, arguments);
    };

    /**
     * 进行复杂的排重，根据isEquals来判断两个对象是否相同。
     * @param {Array} a 对象组
     * @param {Function} isEquals 判断两对象相同的函数。
     * @return {Array} 
     */
    M139.unique = function (a, isEquals) {
        var c = [];
        try{
            for(var i=0,length=a.length; i<length; i++){
                var b = a[i];
                
                var isExists = false;
                for (var j=0, m = c.length; j < m; j++){
                    if (isEquals(c[j], b)) {
                        isExists = true;
                        break;
                    }
                }

                if( !isExists ){
                    c.push(a[i])
                }
            }
        }catch(e){
            c=a
        }
        return c;
    };

})(jQuery, Backbone);
﻿/**
 * @fileOverview 定义文本处理类静态函数.
 */

(function (jQuery) {
    var $ = jQuery;
    /**定义文本处理类静态函数，缩写为$T
    *@namespace
    *@inner
    */
    M139.Text =
    /**@lends M139.Text */
    {
    /**
    *@namespace
    */
    Mobile: {
        /***
        *获得匹配中国移动手机号的正则(可能来自全局配置)
        *@returns {RegExp}
        **/
        getChinaMobileRegex: function () {
            return new RegExp("^8613[4-9][0-9]{8}$|^8615[012789][0-9]{8}$|^8618[23478][0-9]{8}$|^8614[7][0-9]{8}$");
        },
        /***
        *获得匹配移动手机号的正则(可能来自全局配置)
        *@returns {RegExp}
        **/
        getMobileRegex: function () {
            return new RegExp("^8613[0-9]{9}$|^8615[012356789][0-9]{8}$|^8618[0-9]{9}$|^8614[7][0-9]{8}$");
        },
        /***
        *检测输入文本是否为一个手机号（中国大陆的手机号），文本必须为纯数字号码
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isMobile: function (text) {
            text = this.add86(text);
            return this.getMobileRegex().test(text);
        },
        /***
        *检测输入文本是否为中国移动的手机号，文本必须为纯数字号码
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isChinaMobile: function (text) {
            if (!text) return false;
            text = this.add86(text);
            return this.getChinaMobileRegex().test(text);
        },
        /***
        *检测输入文本是否为一个手机号（中国大陆的手机号），可以带人名加尖括号，如："李福拉"<15889394143>
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isMobileAddr: function (text) {
            if (/^\d+$/.test(text)) {
                return this.isMobile(text);
            }
            var reg = /^(?:"[^"]*"|'[^']*'|[^"<>;,；，]*)\s*<(\d+)>$/;
            var match = text.match(reg);
            if (match) {
                var number = match[1];
                return this.isMobile(number);
            } else {
                return false;
            }
        },
        /***
        *检测输入文本是否为一个中国移动手机号，可以带人名加尖括号，如："李福拉"<15889394143>
        *@param {String} text 要检测的文本
        *@returns {Boolean}
        **/
        isChinaMobileAddr: function (text) {
            if (/^\d+$/.test(text)) {
                return this.isChinaMobile(text);
            }
            var reg = /^(?:"[^"]*"|'[^']*'|[^"<>;,；，]*)\s*<(\d+)>$/;
            var match = text.match(reg);
            if (match) {
                var number = match[1];
                return this.isChinaMobile(number);
            } else {
                return false;
            }
        },
        /***
        *解析一段字符串里的多个手机号，一般为逗号或分号分隔，并返回解析结果
        *@param {String} inputText 要解析的文本
        *@param {Object} options 可选参数，高级参数
        *@param {String} options.checkType 当该属性为chinamobile的时候，检查里面的手机号是中国移动手机号
        *@returns {Object} 返回一个结果集obj,obj.error表示非法的字段，obj.numbers表示收集到的手机号
        *@example
        var result = $Mobile.parse("15889394143;李福拉<13600000000>;lifula");
        //返回的结果
        {
        error:"lifula",//这个不是手机号
        numbers:["15889394143",'"李福拉"<13600000000>']
        }
        **/
        parse: function (inputText, options) {
            var result = {};
            result.error = "";
            if (typeof inputText != "string") {
                result.error = "参数不合法";
                return result;
            }
            /*
            简单方式处理,不覆盖签名里包含分隔符的情况
            */
            var lines = inputText.split(/[;,，；]/);
            var resultList = result.numbers = [];
            for (var i = 0; i < lines.length; i++) {
                var text = $.trim(lines[i]);
                if (text == "") continue;
                var checked = false;

                if (options && options.checkType && options.checkType.toLowerCase() == "chinamobile") {
                    checked = this.isChinaMobileAddr(text)
                } else {
                    checked = this.isMobileAddr(text)
                }

                if (checked) {
                    resultList.push(text);
                } else {
                    result.error = text;
                }
            }
            if (!result.error) {
                result.success = true;
            } else {
                result.success = false;
            }
            return result;
        },
        /**
        *返回一段带人名的手机地址中的人名，如：lifula<15889394143>中的"lifula"
        *@returns {String}
        */
        getName: function (addr) {
            if (this.isMobileAddr(addr)) {
                if (addr.indexOf("<") == -1) {
                    return "";
                } else {
                    return addr.replace(/<\d+>$/, "").replace(/^["']|["']$/g, "");
                }
            }
            return "";
        },
        /**
        *返回一段带人名的手机地址中的手机号，如：lifula<15889394143>中的"15889394143"
        *@returns {String}
        */
        getNumber: function (addr) {
            if (typeof (addr) != "string") return "";
            addr = addr.trim();
            if (this.isMobile(addr)) {
                return addr;
            } else {
                var reg = /<(\d+)>$/;
                var match = addr.match(reg);
                if (match) {
                    return match[1].toLowerCase();
                } else {
                    return "";
                }
            }
            return "";
        },
        /**
        *判断两个手机号是否相等
        *@returns {Boolean}
        *@example
        $Mobile.compare("15889394143","李福拉<8615889394143>");//返回true
        */
        compare: function (mobile1, mobile2) {
            if (!mobile1 || !mobile2) {
                return false;
            }
            mobile1 = this.remove86(this.getNumber(mobile1));
            mobile2 = this.remove86(this.getNumber(mobile2));
            if (mobile1 && mobile1 == mobile2) return true;
            return false;
        },

        /**
        * 把传入字符串中的多个手机号码分解出来
        * @param {String} text 多个手机地址
        * @returns {Array}
        * @example
        $Mobile.splitAddr("15889394143,13600000000");
        //返回["15889394143","13600000000"]
        */
        splitAddr: function (text) {
            var list = text.split(/[,;；，]/);
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
                if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
                    var nextItem = list[i + 1];
                    if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                        list[i] = item + " " + nextItem;
                        list.splice(i + 1, 1);
                        i--;
                    }
                }
            }
            return list;
        },
        
        /**
        *给手机号码添加86，如果已存在则不添加
        *@returns {String}
        */
        add86: function (mobile) {
            if (typeof mobile != "string") mobile = mobile.toString();
            return mobile.trim().replace(/^(?:86)?(?=\d{11}$)/, "86");
        },
        /**
        *移除手机号码前的86
        *@returns {String}
        */
        remove86: function (mobile) {
            if (typeof mobile != "string") mobile = mobile.toString();
            return mobile.trim().replace(/^86(?=\d{11}$)/, "");
        },
        /**
        *根据人名以及手机号得到发送文本
        *@returns {String}
        *@example
        $Mobile.getSendText("李福拉","15889394143");
        //返回"李福拉"<15889394143>
        */
        getSendText: function (name, number) {
            if (typeof name != "string" || typeof number != "string") return "";
            return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + number.replace(/\D/g, "") + ">";
        }
    },
    /**
    *@namespace
    */
    Email: {
        /**
        *获得检测邮件地址的正则表达式(可能来自全局配置)
        *@returns {RegExp}
        */
        getEmailRegex: function () {
            //RFC 2822 太耗性能
            //return new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
            return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        },
        getEmailRegexQuckMode:function(){
            return /<([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6})>$/i;
        },
        /**
        * 验证邮箱地址是否合法
        * @param {string} text 验证的邮箱地址字符串
        * @returns {Boolean}
        * @example
        $Email.isEmail("lifula@139.com");//返回true
        */
        isEmail: function (text) {
            if (typeof text != "string") return false;
            text = $.trim(text);
            //RFC 2822
            var reg = this.getEmailRegex();
            return reg.test(text);
        },
        /**
        * 验证邮箱地址是否合法(可以带人名)
        * @param {string} text 验证的邮箱地址字符串，如："人名"&lt;account@139.com&gt;
        * @returns {Boolean}
        * @example
        $Email.isEmailAddr("李福拉&lt;lifula@139.com&gt;");//返回true
        */
        isEmailAddr: function (text) {
            if (typeof text != "string") return false;
            text = $.trim(text);
            //无签名邮件地址
            if (this.isEmail(text)) {
                return true;
            }
            //完整格式
            var r1 = /^(?:"[^"]*"\s?|[^;,，；"]*|'[^']*')<([^<>\s]+)>$/;
            var match = text.match(r1);
            if (match) {
                if (this.isEmail(match[1])) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        },
        /**
        * 得到带人名的邮箱地址字符中的邮件地址部分。
        * @param {String} text 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getName("李福拉<lifula@139.com>");//返回"李福拉"
        $Email.getName("lifula@139.com");//返回"lifula"
        */
        getName: function (email) {
            if (typeof email != "string") return "";
            email = email.trim();
            if (this.isEmail(email)) {
                return email.split("@")[0];
            } else if (this.isEmailAddr(email)) {
                var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = $.trim(name.replace(/"/g, ""));
                if (name == "") return this.getAccount(email);
                return name;
            } else {
                return "";
            }
        },

        /**
         *快速模式，提高性能
         */
        getNameQuick: function (email) {
            var result = "";
            if (email.indexOf("<") == -1) {
                if (this.isEmail(email)) {
                    result = email.split("@")[0];
                } 
            }else{
                var name = email.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = name.replace(/"/g, "").trim();
                result = name || this.getAccount(email);
            }
            return result;
        },

        getObjQuick:function(text){
            var reg,match;
            if (text.indexOf("<") > -1) {
                reg = this.getEmailRegexQuckMode();
                match = text.match(reg);

                var name = text.replace(/<[^@<>]+@[^@<>]+>$/, "");
                name = name.replace(/"/g, "").trim();
                result = name || this.getAccount(text);

                return { original: text, email: match ? match[1].toLowerCase() : "", name: result }
            }else{
                reg = this.getEmailRegex();
                match = text.match(reg);
                return { original: text, email: match ? match[0].toLowerCase() : "", name: match[1] }
            }
        },

        /**
        * 得到带人名的邮箱地址字符中的邮件地址部分。
        * @param {String} text 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getEmail("李福拉&lt;lifula@139.com&gt;");//返回"lifula@139.com"
        */
        getEmail: function (text) {
            if (this.isEmailAddr(text)) {
                return this.getAccount(text) + "@" + this.getDomain(text);
            }
            return "";
        },

        getEmailQuick:function(text){
            var reg,match;
            if (text.indexOf("<") > -1) {
                reg = this.getEmailRegexQuckMode();
                match = text.match(reg);
                return match ? match[1].toLowerCase() : "";
            }else{
                reg = this.getEmailRegex();
                match = text.match(reg);
                return match ? match[0].toLowerCase() : "";
            }
        },

        /**
        * 得到邮箱地址字符中的账号部分。
        * @param {String} email 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getAccount("lifula@139.com");//返回"lifula"
        */
        getAccount: function (email) {
            if (typeof email != "string") return "";
            email = $.trim(email);
            if (this.isEmail(email)) {
                return email.split("@")[0].toLowerCase();;
            } else if (this.isEmailAddr(email)) {
                return email.match(/<([^@<>]+)@[^@<>]+>$/)[1].toLowerCase();
            } else {
                return "";
            }
        },
        /**
        * 得到邮箱地址字符中的域名部分。
        * @param {String} email 邮件地址字符串
        * @returns {String}
        * @example
        $Email.getDomain("lifula@139.com");//返回"139.com"
        */
        getDomain: function (email) {
            if (typeof email != "string") return "";
            email = $.trim(email);
            if (this.isEmail(email)) {
                return email.split("@")[1].toLowerCase();
            } else if (this.isEmailAddr(email)) {
                return email.match(/@([^@]+)>$/)[1].toLowerCase();
            } else {
                return "";
            }
        },
        /**
        * 把传入字符串中的多个邮件地址解析出来
        * @param {String} text 多个邮件地址
        * @returns {Array}
        * @example
        $Email.splitAddr("lifula@139.com;李福拉&lt;lifl@richinfo.cn&gt;");
        //返回["lifula@139.com","李福拉&lt;lifl@richinfo.cn&gt;"]
        */
        splitAddr: function (text) {
            var list = text.split(/[,;；，]/);
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                //如果分割完了以后前后2个地址都存在一个双引号，说明是因为人名当中有分隔符，所以得前后2个值合并成一个
                if (item.indexOf("\"") == 0 && item.lastIndexOf("\"") == 0) {
                    var nextItem = list[i + 1];
                    if (nextItem && nextItem.indexOf("\"") == nextItem.lastIndexOf("\"")) {
                        list[i] = item + " " + nextItem;
                        list.splice(i + 1, 1);
                        i--;
                    }
                }
            }
            return list;
        },
        /**
        * 比对2个邮件地址是否相同
        * @param {String} email1 邮箱1
        * @param {String} email2 邮箱2
        * @returns {Boolean}
        * @example
        $Email.compare("lifula@139.com","李福拉&lt;lifula@139.com&gt;");//返回true
        */
        compare: function (email1, email2) {
            var m1 = this.getEmail(email1).toLowerCase();
            if (m1 && m1 == this.getEmail(email2).toLowerCase()) {
                return true;
            }
            return false;
        },
        /**
        * 格式化发件人地址
        * @param {String} name 署名
        * @param {String} email 邮件地址
        * @returns {String}
        * @example
        $Email.getSendText('李福拉','lifula@139.com');
        //返回"李福拉"&lt;lifula@139.com&gt;
        */
        getSendText: function (name, email) {
            if (typeof name != "string" || typeof email != "string") return "";
            return "\"" + name.replace(/[\s;,；，<>"]/g, " ") + "\"<" + email.replace(/[\s;,；，<>"]/g, "") + ">";
        },
        /**
        * 解析一长串用户输入的邮件地址，得到解析结果
        * @param {Object} mailText 邮箱地址字符串，如："人名"&lt;account@139.com&gt;;account@139.com;account@139.com
        * @returns {Object}
        * @example
        $Email.parse('"人名"&lt;account@139.com&gt;;account@139.com;abc');
        //返回
        {
        error:"abc",//不是合法邮箱地址
        emails:['"人名"&lt;account@139.com&gt;',"account@139.com"]
        }
        */
        parse: function (mailText) {
            var result = {};
            result.error = "";
            if (typeof mailText != "string") {
                result.error = "参数不合法";
                return result;
            }
            /*
            简单方式处理,不覆盖签名里包含分隔符的情况
            */
            var lines = mailText.split(/[;,，；]/);
            var resultList = result.emails = [];
            for (var i = 0; i < lines.length; i++) {
                var text = $.trim(lines[i]);
                if (text == "") continue;
                if (this.isEmail(text)) {
                    resultList.push(text);
                } else if (this.isEmailAddr(text)) {
                    resultList.push(text);
                } else {
                    result.error = text;
                }
            }
            if (!result.error) {
                result.success = true;
            } else {
                result.success = false;
            }
            return result;
        },
        /**
		 * 解析email地址成数组对象
		 * <pre>示例：<br>
		 * <br>Utils.parseEmail("abc@abc.com");
		 * </pre>
		 * @param {string} text 必须参数，邮箱地址。
		 * @return {数组对象}
		 */
        parseEmail : function(text){
		    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
		    var regName=/^"([^"]+)"|^([^<]+)</;
		    var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
		    var matches=text.match(reg);
		    var result=[];
		    if(matches){
		        for(var i=0,len=matches.length;i<len;i++){
		            var item={};
		            item.all=matches[i];
		            var m=matches[i].match(regName);
		            if(m)item.name=m[1];
		            m=matches[i].match(regAddr);
		            if(m)item.addr=m[1];
		            if(item.addr){
		                item.account=item.addr.split("@")[0];
		                item.domain=item.addr.split("@")[1];
		                if(!item.name)item.name=item.account;
		                result.push(item);
		            }
		        }
		    }
		    return result;
		},
		getMailListFromString : function (p){
			if(typeof p != 'string'){
				return;
			}
	        p = p.split(",");
	        for(var i=0;i<p.length;i++){
	            if(p[i].trim()==""){
	                p.splice(i, 1);
	                i--;
	            }
	        }
		    return p;
		}
    },
    /**
    *@namespace
    */
    Url: {
        /**获取Url中的Get参数
        *@param {String} key url中的查询参数
        *@param {String} url 可选参数，默认是取当前窗口的location.href
        *@returns {String}
        *@example
        var sid = $T.Url.queryString("sid");
        */
        queryString: function (key, url) {
            url = (url === undefined ? location.search : url);
            url = url.split(/&|\?/);
            var result = null;
            key = String(key).toLowerCase();
            for (var i = 0; i < url.length; i++) {
                var keyValue = url[i];
                var part = keyValue.split("=");
                if (part[0].toLowerCase() == key) {
                    result = part[1];
                    break;
                }
            }
            if (result) {
                try {
                    result = M139.Text.Encoding.tryDecode(result);
                } catch (e) { }
            }
            return result;
        },
        /**
        @param {String} url 可选参数,要解析的url，默认是取当前窗口的location.href
        @returns {Object} 返回{key:value}对应的所有get参数集合的对象
        @example
        var obj = $Url.getQueryObj("http://baidu.com/?a=1&b=2");
        //返回
        {
        a:"1",
        b:"2"
        }
        */
        getQueryObj: function (url) {
            var result = {};
            url = url || location.href;
            if (typeof url != "string") {
                throw "参数url必须是字符串类型";
            }
            if (url.indexOf("?") != -1) {
                var search = url.split("?")[1];
                var list = search.split("&");

                for (var i = 0; i < list.length; i++) {
                    var pair = list[i].split("=");
                    var key = pair[0];
                    var value = pair[1];
                    try {
                        value = M139.Text.Encoding.tryDecode(value);
                    } catch (e) { }
                    result[key] = value;
                }
            }
            return result;
        },
        /**拼接Url字符串
        *@param {String} url 基础地址，可以带？也可以不带？
        *@param {Object} queryObj Get查询参数
        *@returns {String}
        *@example
        var url = $T.Url.makeUrl("http://baidu.com",{
            sid:"xxxxxxx",
            key:"yyyyyyy"
        });
        得到 http://baidu.com/?sid=xxxxxxx&key=yyyyyyy
        或者
        var url = $T.Url.makeUrl("http://baidu.com","a=1&b=2");
        得到 http://baidu.com/?a=1&b=2
        自动判断是否应该加上"?"
        */ 
        makeUrl: function (url, queryObj) {
            if (url.indexOf("?") == -1) {
                url += "?";
            }
            if (!/\?$/.test(url)) {
                url += "&";
            }
            if (typeof queryObj == "string") {
                url += queryObj;
            } else {
                url += this.urlEncodeObj(queryObj);
            }
            return url;
        },
        /**inner*/
        urlEncodeObj: function (queryObj) {
            var arr = [];
            for (var p in queryObj) {
                if (queryObj.hasOwnProperty(p)) {
                    arr.push(p + "=" + encodeURIComponent(queryObj[p]));
                }
            }
            return arr.join("&");
        },
        /**通过相对地址获得绝对地址,在非ie系列回调子串口的Function相当有用
        *@param {String} relativeUrl 必选参数，要转化的相对地址
        *@param {String} baseUrl 可选参数，参照的url,默认取当前窗口的location.href
        *@returns {String}
        *@example
        var url = $T.Url.getAbsoluteUrl("/s");
        得到 http://mail.10086.cn/s
        */
        getAbsoluteUrl: function (relativeUrl, baseUrl) {
            baseUrl = baseUrl || location.href;
            baseUrl = baseUrl.split("?")[0];//去掉search
            baseUrl = baseUrl.replace(/([^:\/])\/+/g, "$1/");//去掉重复的斜杠
            relativeUrl = relativeUrl.replace(/\/+/g, "/");//去掉重复的斜杠
            baseUrl = baseUrl.replace(/\/[^\/]*$/, "");//去掉最后一级路径
            if (relativeUrl.indexOf("http://") > -1) {
                return relativeUrl;
            }
            if (relativeUrl.indexOf("/") == 0) {
                return "http://" + this.getHost(baseUrl) + relativeUrl;
            }
            while (relativeUrl.indexOf("../") == 0) {
                relativeUrl = relativeUrl.replace("../", "");
                baseUrl = baseUrl.replace(/\/[^\/]*$/, "");
            }
            return baseUrl + "/" + relativeUrl;
        },
        /**
        *根据完整的本地路径或者网络路径，获得文件名
        *@returns {String}
        */
        getFileName: function (fullpath) {
            if (typeof fullpath == "string") {
                var url = fullpath.split("?")[0];
                var reg = /[^\/\\]+$/;
                var m = url.match(reg);
                if (m) {
                    return m[0];
                }
            }
            return "";
        },
        /**
        *获得小写的文件扩展名，不带.号
        *@returns {String}
        */
        getFileExtName: function (fileName) {
            if (fileName && fileName.indexOf(".") > -1) {
                return fileName.split(".").pop().toLowerCase();
            }
            return "";
        },
        /**
         *获得文件名，不包括扩展名
         *@returns {String}
         */
        getFileNameNoExt: function (filePath) {
            var name = this.getFileName(filePath);
            return name.replace(/([^.]+)\.[^.]+$/, "$1");
        },

        /**
         *根据给出的长度截断文件名，显示...，但是保留扩展名
         *@param {String} fileName 文件名
         *@param {Number} maxLength 要截断的最大长度
         *@returns {String} 返回缩略的文件名
         */
        getOverflowFileName: function(fileName,maxLength) {
            maxLength = maxLength || 25;
            fileName = this.getFileName(fileName);
            if (fileName.length <= maxLength) {
                return fileName;
            }
            var point = fileName.lastIndexOf(".");
            if (point == -1 || fileName.length - point > 5) {
                return fileName.substring(0, maxLength - 2) + "…";
            }
            var pattern = "^(.{" + (maxLength - 4) + "}).*(\\.[^.]+)$";
            return fileName.replace(new RegExp(pattern), "$1…$2");
        },

        /**
         *判断字符串是否为一个url链接
         *@param {String} url 要判断的文本
         *@returns {Boolean}
         */
        isUrl: function (url) {
            var reg = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
            return reg.test(url);
        },

        /**
         *根据一个url返回host
         *@example
         M139.Text.Url.getHost("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn
         */
        getHost: function (url) {
            url = this.removeProtocols(url);
            var match = url.match(/([^\/]+)/);
            if (match) {
                return match[1];
            } else {
                return "";
            }
        },

        /**
         *移除一个url的协议部分
         *@example
         M139.Text.Url.removeProtocols("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn/g2
         */
        removeProtocols: function (url) {
            try{
                return url.replace(/^(http|ftp|https|file):\/\//, "");
            } catch (e) {
                return "";
            }
        },

        /**
         *移除一个http url的协议部分
         *@example
          M139.Text.Url.removeHttp("http://appmail.mail.10086.cn/g2");//返回 appmail.mail.10086.cn/g2
         */
        removeHttp:function(){
            return this.removeProtocols.apply(this,arguments);
        },

        /**
         *当你不确定一个url是否缺少http://开头的时候，可以调用一下(请别传一个相对地址进来)
         *@returns {String}
         *@example
         $Url.addHttp("163.com");
         返回:http://163.com
         */
        addHttp:function(url){
            if (!/^https?:\/\//.test(url)) {
                url = "http://" + url;
            }
            return url;
        },

        /**
         *连接一个url的多个部分，自动识别是否需要加上反斜杠
         *@returns {String}
         *@example
         $Url.joinUrl("appmail.mail.10086.cn","sms/sms");
         返回:appmail.mail.10086.cn/sms/sms
         */
        joinUrl:function(){
            return Array.prototype.join.call(arguments, "/").replace(/\/+/g,"/");//替换多余的/
        },

        /**
         *根据一个url移除host部分
         *@example
         M139.Text.Url.removeHost("http://appmail.mail.10086.cn/g2");//返回 /g2
         */
        removeHost: function (url) {
            url = this.removeProtocols(url);
            return url.replace(/^[^\/]+/, "");
        }
    },
    /**
    *@namespace
    */
    Xml: {
        /**@inner*/
        xml_encodes: {
            '&': '&amp;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;'
        },
        /**@inner*/
        xml_decodes: {
            '&amp;': '&',
            '&quot;': '"',
            '&lt;': '<',
            '&gt;': '>'
        },
        /**
        *编码文本中的xml特殊字符
        *@param {String} text 要编码的文本
        *@returns {String}
        */
        encode: function (text) {
            if (typeof text != "string") {
                if (text === undefined) {
                    text = "";
                } else {
                    text = String(text);
                }
            } else if (text.indexOf("<![CDATA[") == 0) {
                return text;
            }
            var map = this.xml_encodes;
            //多次replace有bug，必须用逼近式替换
            return text.replace(/([\&"<>])/g, function (str, item) {
                return map[item];
            });
        },
        /**
        *解码文本中的xml实体字符
        *@param {String} text 要解码的文本
        *@returns {String}
        */
        decode: function (text) {
            var map = this.xml_decodes;
            return text.replace(/(&quot;|&lt;|&gt;|&amp;)/g, function (str, item) {
                return map[item];
            });
        },
        /**
        *解析xml文本，返回一个文档对象，捕获异常，解析失败返回null
        *@param {String} xmlString 要解析的xml文本
        *@returns {XMLDocument}
        */
        parseXML: function (xmlString) {
            var doc = null;
            try {
                if (document.all) {
                    var ax = this.getIEXMLDoc();
                    ax.loadXML(xmlString);
                    if (ax.documentElement) {
                        doc = ax;
                    }
                } else {
                    doc = jQuery.parseXML(xmlString);
                }
            } catch (e) { }
            return doc;
        },
        /**
        *主要为了兼容某些ie浏览器的xml组件有bug(jQuery没做容错)
        *@returns {XMLDocument}
        */
        getIEXMLDoc: function () {
            var XMLDOC = ["Microsoft.XMLDOM", "MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
            if (this.enabledXMLObjectVersion) return new ActiveXObject(this.enabledXMLObjectVersion);
            for (var i = 0; i < XMLDOC.length; i++) {
                try {
                    var version = XMLDOC[i];
                    var obj = new ActiveXObject(version);
                    if (obj) {
                        this.enabledXMLObjectVersion = version; //缓存结果
                        return obj;
                    }
                } catch (e) { }
            }
            return null;
        },

        /**
         *将js对象转化成普通的xml文档字符串
         *@example
         var str = $Xml.obj2xml2({
            person:{
                name:"Lily",
                age:18
            }
         });
         返回：
         &lt;person&gt;
            &lt;name&gt;Lily&lt;/name&gt;
            &lt;age&gt;18&lt;/age&gt;
         &lt;/person&gt;
        */
        obj2xml2:function(inputObj) {
            var result = [];
            function obj2xmlInner(obj) {
                for (var elem in obj) {
                    var current = obj[elem];
                    if (typeof (current) == "string" || typeof (current) == "number" || typeof (current) == "boolean") {
                        var val = typeof (current) == "string" && current.indexOf("<![CDATA[") == 0 ? current : M139.Text.Xml.encode(current)
                        result.push("<" + elem + ">" + val + "</" + elem + ">");
                    } else if($.isArray(current)){
                        for(var i=0;i<current.length;i++){
                            result.push("<" + elem + ">");
                            result.push(obj2xmlInner(current[i]));
                            result.push("</" + elem + ">");
                        }
                    } else if (current && current.attributes){
                        result.push("<" + elem + " ");
                        for (var j in current.attributes) {
                            if (current.attributes.hasOwnProperty(j)) {
                                result.push(j + '="' + current.attributes[j] + '" ');
                            }
                        }
                        result.push(">");
                        delete current.attributes;
                        result.push(obj2xmlInner(current));
                        result.push("</" + elem + ">");
                    } else if (typeof (current) == "object") { //数组或object
                        result.push("<" + elem + ">");
                        result.push(obj2xmlInner(current));
                        result.push("</" + elem + ">");
                    }
                }
                //return result;
            }
            obj2xmlInner(inputObj);
            return result.join("");

        },
        /**
        *以rm报文的形式将object转换为xml
        *@param {Object} obj 要转换的对象实体
        *@returns {String}
        *@example
        var str = $Xml.obj2xml({name:"Lily",age:18});
        返回:
        &lt;object&gt;
        &lt;string name="name"&gt;Lily&lt;/string&gt;
        &lt;int name="age"&gt;18&lt;/int&gt;
        &lt;/object>
        */
        obj2xml: function (obj) {
            return varToXML(obj);
            function varToXML(obj) {
                return namedVarToXML(null, obj, "\n").substr(1);
            }
            function getDataType(obj) {
                return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
            }
            function namedVarToXML(name, obj, prefix) {
                if (obj == null) {
                    return prefix + tagXML("null", name);
                }
                var type = getDataType(obj);
                if (type == "String") {
                    return prefix + tagXML("string", name, $Xml.encode(textXML(obj)));
                } else {
                    if (type == "Object") {
                        if (obj.nodeType) {
                            T.Tip.show("参数错误");
                            return "";
                        }
                        var s = "";
                        for (var i in obj) {
                            s += namedVarToXML(i, obj[i], prefix + "  ");
                        }
                        return prefix + tagXML("object", name, s + prefix);
                    } else {
                        if (type == "Array") {
                            var s = "";
                            for (var i = 0; i < obj.length; i++) {
                                s += namedVarToXML(null, obj[i], prefix + "  ");
                            }
                            return prefix + tagXML("array", name, s + prefix);
                        } else {
                            if (type == "Boolean" || type == "Number") {
                                var s = obj.toString();
                                return prefix + tagXML(getVarType(obj, s), name, s);
                            } else {
                                if (type == "Date") {
                                    var s = "" + obj.getFullYear() + "-" + (obj.getMonth() + 1) + "-" + obj.getDate();
                                    if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                                        s += " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
                                    }
                                    return prefix + tagXML(getVarType(obj, s), name, s);
                                } else {
                                    return "";
                                }
                            }
                        }
                    }
                }
            }
            function getVarType(obj, stringValue) {
                if (obj == null) {
                    return "null";
                }
                var type = getDataType(obj);
                if (type == "Number") {
                    var s = stringValue ? stringValue : obj.toString();
                    if (s.indexOf(".") == -1) {
                        if (obj >= -2 * 1024 * 1024 * 1024 & obj < 2 * 1024 * 1024 * 1024) {
                            return "int";
                        } else {
                            if (!isNaN(obj)) {
                                return "long";
                            }
                        }
                    }
                    return "int";
                } else {
                    return type.toLowerCase();
                }
            }
            function tagXML(dataType, name, val) {
                var s = "<" + dataType;
                if (name) {
                    s += " name=\"" + textXML(name) + "\"";
                }
                if (val) {
                    s += ">" + val;
                    if (val.charAt(val.length - 1) == ">") {
                        s += "\n";
                    }
                    return s + "</" + dataType + ">";
                } else {
                    return s + " />";
                }
            }
            function textXML(s) {
                s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
                return s;
            }
            function replaceDataType(arr, xml) {
                var count = arr.length;
                for (var i = 0; i < count; i++) {
                    xml = xml.replace(arr[i].type, arr[i].replaceTxt);
                }
                return xml;
            }
        },
        /**
         *处理简单的xml文本转换成obj对象
         *@param {String} xml 要处理的xml文本
         *@returns {Object}
         *@example
         var obj = M139.Text.Xml.xml2object("&lt;person&gt;&lt;name&gt;lily&lt;/name&gt;&lt;age&gt;19&lt;/age&gt;&lt;/person&gt;");
         返回：
         {name:"lily",age:"19"}
        */
        xml2object: function (xml) {
            var result = null;
            var doc = this.parseXML(xml);
            if (doc && doc.documentElement) {
                var el = doc.documentElement;
                result = getObject(el);
            }
            return result;
            function getObject(el) {
                if (el.firstChild && el.firstChild.nodeType == 3) {
                    return $(el.firstChild).text();
                } else {
                    if (el.firstChild) {
                        var obj = {};
                        if (el.childNodes) {
                            for (var i = 0; i < el.childNodes.length; i++) {
                                var child = el.childNodes[i];
                                var oldItem = obj[child.nodeName];
                                //如果一个相同名称的节点出现多次，则第一次当做一个对象，第二次则组装成数组
                                if (oldItem) {
                                    if (!$.isArray(oldItem)) {
                                        obj[child.nodeName] = [oldItem];
                                    }
                                    obj[child.nodeName].push(getObject(child));
                                } else {
                                    obj[child.nodeName] = getObject(child);
                                }
                            }
                        }
                        return obj;
                    } else {
                        return "";
                    }
                }
            }
        }
    },
    /**
    *@namespace
    */
    Html: {
        /**@inner*/
        html_decodes: {
            '&amp;': '&',
            '&quot;': '"',
            '&lt;': '<',
            '&gt;': '>',
            "&nbsp;": " ",
            "&#39;": "'"
        },
        /**
        *转义html为安全文本
        *@returns {String}
        */
        encode: function (str) {
            if (typeof str != "string") return "";
            str = str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/\'/g, "&#39;")
                .replace(/ /g, "&nbsp;")
            //.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
            return str;
        },
        /**
        *encode的逆函数
        *@returns {String}
        */
        decode: function (text) {
            if (typeof text != "string") return "";
            var map = this.html_decodes;
            //多个replace会有bug
            return text.replace(/(&quot;|&lt;|&gt;|&amp;|&nbsp;|&#39;)/g, function (str, item) {
                return map[item];
            });
            return text;
        }
    },
    /**一些难分类的函数在此命名空间下定义
    *@namespace
    */
    Utils: {
        /***
        *获得描述性的文件大小文本，如：传入1124，返回1.1KB
        *@param {Number} fileSize 必选参数，文件大小
        *@param {String} options.byteChar 可选参数,可以把"B"替换为"字节"
        *@param {String} options.maxUnit 可选参数,最大单位,目前支持：B|K|M,默认为G
        *@param {String} options.comma 可选参数,是否用逗号分开每千单位
        *@returns {String}
        *@example
        //返回1G
        $T.Utils.getFileSizeText(1024 * 1024 * 1024);
        //返回10字节
        $T.Utils.getFileSizeText(10,{
        byteChar:"字节"
        });
        //返回102400B
        $T.Utils.getFileSizeText(102400,{
        maxUnit:"B"
        });
        //返回5,000KB
        $T.Utils.getFileSizeText(1024 * 5000,{
        maxUnit:"K",
        comma:true
        });
        */
        getFileSizeText: function (fileSize, options) {
            var unit = "B";
            if (!options) { options = {};}
            if (options.byteChar) {
                unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
                if (options.maxUnit == "B") options.maxUnit = unit;
            }
            var maxUnit = options.maxUnit || "T";
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "K";
                fileSize = fileSize / 1024;
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "M";
                    fileSize = fileSize / 1024;
                    //debugger
                    if (unit != maxUnit && fileSize >= 1024) {
                        unit = "G";
                        fileSize = fileSize / 1024;
						if(unit != maxUnit && fileSize >= 1024){
							unit = "T";
							fileSize = fileSize / 1024;
						}
                    }
                }
                fileSize = Math.ceil(fileSize * 100) / 100;
            }
            if (options.comma) {
                var reg = /(\d)(\d{3})($|\.)/;
                fileSize = fileSize.toString();
                while (reg.test(fileSize)) {
                    fileSize = fileSize.replace(reg, "$1,$2$3");
                }
            }
            return fileSize + unit;
        },
        /**
        *截断字符串，并显示省略号
        * @param {String} text 必选参数，要截断的字符串。
        * @param {Number} maxLength 必选参数，文字长度。
        * @param {Boolean} showReplacer 可选参数，截断后是否显示...，默认为true。
        *@returns {String}
        */
        getTextOverFlow: function (text, maxLength, showReplacer) {
            if (text.length <= maxLength) {
                return text;
            } else {
                return text.substring(0, maxLength) + (showReplacer ? "..." : "");
            }
        },
        getTextOverFlow2: function (text, maxLength, showReplacer) {
            var charArr = text.split("");
            var byteLen = 0;
            var reg=new RegExp("[\x41-\x5A]|[^\x00-\xff]", "g")
            for (var i = 0; i < charArr.length; i++) {
                var cArr = charArr[i].match(reg);
                byteLen += (cArr == null ? 1 : 2)

                if (byteLen > maxLength) {
                    return text.substring(0, i) + (showReplacer ? "..." : "");
                }
            }
            return text;
        },
        /***
        *格式化字符串，提供数组和object两种方式
        *@example
        *$T.Utils.format("hello,{name}",{name:"kitty"})
        *$T.Utils.format("hello,{0}",["kitty"])
        *@returns {String}
        */
        format: function (str, arr) {
            var reg;
            if ($.isArray(arr)) {
                reg = /\{([\d]+)\}/g;
            } else {
                reg = /\{([\w]+)\}/g;
            }
            return str.replace(reg,function($0,$1){
                var value = arr[$1];
                if(value !== undefined){
                    return value;
                }else{
                    return "";
                }
            });
        },

        /**
        * 数组数据批量格式化，返回数组 (性能优化，避免了重复构造正则)
        */
		formatBatch: function (tpl, maps) {
			var i, len, re, ret;
			var key, keys = [], keymaps = {};

			if( (len = maps.length) <= 0 ) return [];

			for (key in maps[0]) {
				keys.push(key);
				keymaps["{"+key+"}"] = key;
			}

			re = new RegExp("{(?:"+keys.join("|")+")}", 'gm');

			for(i=0,ret=[]; i<len; i++){
				ret.push(tpl.replace(re, function($0){
					return String(maps[i][keymaps[$0]]);
				}));
			}

			return ret;
		},

        /**
        * 得到字符串长度
        * <pre>示例：<br>
        * <br>alert("123".getBytes());
        * </pre>
        * @return {字符长度]
        */
        getBytes: function (str) {
            var cArr = str.match(/[^\x00-\xff]/ig);
            return str.length + (cArr == null ? 0 : cArr.length);
        },
        /**
		 * 得到xml对象
		 * <pre>示例：<br>
		 * <br>Utils.getXmlDoc(xmlStr);
		 * </pre>
		 * @param {Object} xml 必选参数，xml字符串。
		 * @return {xml对象}
		 */
        getXmlDoc: function (xml) {
            if (window.DOMParser) {
                var parser = new DOMParser();
                return parser.parseFromString(xml, "text/xml");
            }else{
		        var ax = this.createIEXMLObject();
		        ax.loadXML(xml);
		        return ax;
		    }
		},
		createIEXMLObject : function() {
		    var XMLDOC = ["Microsoft.XMLDOM","MSXML2.DOMDocument.6.0", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML.DOMDocument"];
		    if (window.enabledXMLObjectVersion) return new ActiveXObject(enabledXMLObjectVersion);
		    for (var i = 0; i < XMLDOC.length; i++) {
		        try {
		            var version = XMLDOC[i];
		            var obj = new ActiveXObject(version);
		            if (obj) {
		                enabledXMLObjectVersion = version;
		                return obj;
		            }
		        } catch (e) { }
		    }
		    return null;
		},
		/**
		 * 编码html标签字符
		 * <pre>示例：<br>
		 * <br>Utils.htmlEncode("&lt;div&gt;内容&lt;div/&gt;");
		 * </pre>
		 * @param {string} str 必选参数，要编码的html标签字符串
		 * @return {编码后的字符串}
		 */
	    htmlEncode: function(str){
	        if (typeof str == "undefined") return "";
	        str = str.replace(/&/g, "&amp;");
	        str = str.replace(/</g, "&lt;");
	        str = str.replace(/>/g, "&gt;");
	        str = str.replace(/\"/g, "&quot;");
	        //str = str.replace(/\'/g, "&apos;"); //IE不支持apos
	        str = str.replace(/ /g, "&nbsp;");
	        str = str.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
	        return str;
	    },
		/**
		 * 转换签名邮箱成对象。
		 * <pre>示例：<br>
		 * <br>Utils.parseSingleEmail('"签名"<帐号@139.com>');
		 * </pre>
		 * @param {Object} text 必选参数，邮箱地址。如："签名"<帐号@139.com> 或 帐号@139.com
		 * @return {Object 如result.addr,result.name,result.all}
		 */
		parseSingleEmail : function(text) {
		    text = $.trim(text);
		    var result = {};
		    var reg = /^([\s\S]*?)<([^>]+)>$/;
		    if (text.indexOf("<") == -1) {
		        result.addr = text;
		        result.name = text.split("@")[0];
		        result.all = text;
		    } else {
		        var match = text.match(reg);
		        if (match) {
		            result.name = $.trim(match[1]).replace(/^"|"$/g, "");
		            result.addr = match[2];
		            //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
		            result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
		            result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
		        } else {
		            result.addr = text;
		            result.name = text;
		            result.all = text;
		        }
		    }
		    if(result.name){
				result.name = this.htmlEncode(result.name);
			}
		    return result;
		},
		/**
        * 获取文件格式图标
        * size = 1 大图标 size = 0 小图标
        */
        getFileIcoClass: function(size,fileName){
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|rar|zip|7z|exe|apk|ipa|mp3|wav|iso|avi|rmvb|wmv|flv|bt|fla|swf|dvd|cd|fon)$/i;
            var length = fileName.split(".").length;
            var fileFormat = fileName.split(".")[length-1].toLowerCase();
            if(reg.test(fileName)){
                return size == 1 ? "i_file i_f_" + fileFormat : "i_file_16 i_m_" + fileFormat;
            }else{
                return size == 1 ? "i_file i_f_139" : "i_file_16 i_m_139";
            }
        },
        /**
        * 获取文件格式图标 网盘重构
        * size = 1 大图标 size = 0 小图标
        */
        getFileIcoClass2: function(size,fileName){
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|eml|rar|zip|7z|exe|apk|ipa|mp3|wav|iso|avi|rmvb|wmv|flv|bt|fla|swf|dvd|cd|fon|mp4|3gp|mpg|mkv|asf|mov|rm|wma|m4a|asf)$/i;
            var length = fileName.split(".").length;
            var fileFormat = fileName.split(".")[length-1].toLowerCase();
            if(reg.test(fileName)){
                return size == 1 ? "i_file i_f_" + fileFormat : "i-file-smalIcion i-f-" + fileFormat;
            }else{
                return size == 1 ? "i_file i_f_139" : "i-file-smalIcion i_m_139";
            }
        },
        /** 
         * 文本编辑框文字聚焦到最后
		 * <pre>示例：<br>
		 * <br>$T.Utils.textFocusEnd(document.getElementById('text'));
		 * </pre>
		 * @param {Object} textObj 必选参数，文本框DOM对象
        */
        textFocusEnd: function(textObj){
            if(textObj){
                textObj.focus();
                var len = textObj.value.length;
                if (document.selection) { //IE
                    var sel = textObj.createTextRange();
                    sel.moveStart('character', len);
                    sel.collapse();
                    sel.select();
                } else if (typeof textObj.selectionStart == 'number' && typeof textObj.selectionEnd == 'number') {
                    textObj.selectionStart = textObj.selectionEnd = len; //非IE 
                }
            }
        },
        /**
         *获得一个cguid，带在请求的url上，方便前后端串联日志
         *cguid规范：由时间和4位的随机数组成。格式：小时+分+秒+毫秒+4位的随机
         */
        getCGUID: function (d) {
            function padding(n, m) {
                var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
                return new Array(len + 1).join("0") + n;
            };
            var now = d || new Date();
            return '' + padding(now.getHours()) + padding(now.getMinutes()) + padding(now.getSeconds()) + padding(now.getMilliseconds(), 3) + padding(Math.ceil(Math.random() * 9999), 4);
        },


        /**
         *从cguid中提取时间(因为只有精确到小时，所以日期可能不准)
         */
        getDateTimeFromCGUID: function (cguid) {
            var reg = /^(\d{2})(\d{2})(\d{2})(\d{3})/;
            var match = cguid.match(reg);
            if (match) {
                var h = parseInt(match[1], 10);
                var m = parseInt(match[2], 10);
                var s = parseInt(match[3], 10);
                var ms = parseInt(match[4], 10);
                var d = new Date();
                return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s, ms);
            } else {
                return null;
            }
        }
        
    },
    /**
    *@namespace
    */
    Cookie: {
        /**
        *读取cookie值
        *@returns {String}
        */
        get: function (name) {
            var arr = document.cookie.match(new RegExp("(^|\\W)" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]);
            return "";
        },
        /**
        *@param {Object} options 参数配置
        *@param {String} options.name cookie的名称
        *@param {String} options.value cookie的值
        *@param {String} options.domain cookie访问权限域名，默认为当前域名
        *@param {String} options.path 默认为 /
        *@param {Date} options.expires 如果不设置，则默认为会话cookie
        *@returns {void}
        */
        set: function (options) {
            var name = options.name;
            var value = options.value;
            var path = options.path || "/";
            var domain = options.domain;
            var expires = options.expires;
            var str = name + "=" + escape(value) + "; ";
            str += "path=" + path + "; ";
            if (domain) str += "domain=" + domain + "; ";
            if (expires) str += "expires=" + expires.toGMTString() + "; ";
            document.cookie = str;
        }
    },
    /**
    *@namespace
    */
    Encoding: {
        /**
         *当编码字符串不确定是用escape还是encodeURIComponent哪种方式编码的时候，可以使用这个来尝试性解码
         */
        tryDecode: function (text) {
            var result = "";
            if (/%u[0-9A-Fa-f]{4}|\+/.test(text) && !/~|!/.test(text)) {
                try {
                    result = unescape(text);
                } catch (e) { }
            } else {
                try {
                    result = decodeURIComponent(text);
                } catch (e) { }
            }
            return result;
        }
    }
};

//定义缩写
$T = M139.Text;
$Xml = M139.Text.Xml;
$JSON = M139.Text.JSON;
$Cookie = M139.Text.Cookie;
$Email = M139.Text.Email;
$Mobile = M139.Text.Mobile;
//fixed
$Mobile.getMobile = $Mobile.getNumber;
$TextUtils = M139.Text.Utils;
$Url = M139.Text.Url;

$T.format = M139.Text.Utils.format;
/**@inner*/

if(typeof String.prototype.trim !== "function") {
	String.prototype.trim = function () {
	    return this.replace(/^\s+|\s+$/g, "");
	};
}

String.prototype.toNormalString = function(){
    var regUnc = /&#([^\;]+);/ig;
    var str = new String(this);
    var ms = str.match(regUnc);
    if (ms==null || ms.length==0)return this;
    for(var i=0; i<ms.length; i++){
        var _char = String.fromCharCode(parseInt(ms[i].replace(regUnc, "$1"),10));
        str = str.replace(ms[i], _char);
    }
    return str;
}
String.prototype.getByteCount = function(){
  var A=this.length,_,$=0;
  while(A--){
    _=this.charCodeAt(A);
    switch(true){
    case _<=127:
      $+=1;
      break ;
    case _<=2047:
      $+=2;
      break ;
    case _<=65535:
      $+=3;
      break ;
    case _<=131071:
      $+=4;
      break ;
    case _<=34359738367:
      $+=5;
      break ;
    }
  }
  return $;
}
/*String.prototype.format = function (){
    var str=this,tmp;
    for(var i=0;i<arguments.length;i++){
        tmp=String(arguments[i]).replace(/\$/g,"$$$$");
        str=str.replace(eval("/\\{"+i+"\\}/g"),tmp);
    }
    return str;
}*/
String.prototype.format = function (){
	var str = this;
	var args = arguments;
	var len = args.length;
	str = str.replace(/\{(\d+)\}/g, function($0, $1){
		$1 = String($1);
		return ($1 >= len) ? $0 : args[$1];
	});
	return str;
}
String.prototype.encode = function () {
    return M139.Text.Html.encode(this);
}
String.prototype.decode = function () {
    return M139.Text.Html.decode(this);
}
})(jQuery);
﻿﻿/**
 * @fileOverview 定义DOM事件相关的常用方法的静态类
 */

(function (jQuery, Backbone, M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$Event
    *@namespace
    *@name M139.Event
    */
    M139.Event = {
        /**
        *老版本的代码，根据dom处理参数的上下文找到event参数，兼容多浏览器
        *@example
        document.onclick = function(e){
            e = M139.Event.getEvent(e);//或者 M139.Event.getEvent()
        }
        */
        getEvent: function (A) {
            var evt = A || window.event;
            if (!evt) {
                var arr = [], C = this.getEvent.caller;
                while (C) {
                    evt = C.arguments[0];
                    if (evt && (evt.constructor.target || evt.srcElement)) {
                        break;
                    }
                    var B = false;
                    for (var D = 0; D < arr.length; D++) {
                        if (C == arr[D]) {
                            B = true;
                            break;
                        }
                    }
                    if (B) {
                        break;
                    } else {
                        arr.push(C);
                    }
                    C = C.caller;
                }
            }
            return evt;
        },

        /**
        *同时取消事件冒泡，以及默认行为，即：stopPropagation和preventDefault，兼容IE
        *@example
        document.onclick = function(e){
            M139.Event.stopEvent(e);
        }
        */
        stopEvent: function (e) {
            if (!e) {
                e = this.getEvent();
            }
            if (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }
        },

        /**
         *keycode常量，会根据浏览器做兼容
         *@filed
         */
        KEYCODE: {//浏览器版本不一样 keyCode会不一样
            A:65,
            C:67,
            X:88,
            V:86,
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            SPACE: 32,
            TAB: 9,
            LEFT: 37,
            RIGHT: 39,
            DELETE:46,
            BACKSPACE:8,
            //分号
            SEMICOLON: ($.browser.mozilla || $.browser.opera) ? 59 : 186,
            //逗号
            COMMA: 188,
            Esc:27
        }

    };

    M139.Event.GlobalEventManager = Backbone.Model.extend(
    /**@lends M139.Event.GlobalEventManager.prototype*/
    {
        /**
        *全窗口dom鼠标键盘事件帮助类,可以一次监听所有窗口的鼠标、键盘事件（前提是该窗口引用了此文件）
        *@constructs M139.Event.GlobalEventManager
        *@example
        $GlobalEvent.on("click",function(e){
            e.window;
            e.event
        });
        */
        initialize: function (options) {
            var This = this;
            options = options || {};
            var win = options.window || window;

            jQuery(win.document).bind("click", function (e) {
                This.triggerEvent("click", { window: win, event: e });
            }).bind("mousemove", function (e) {
                This.triggerEvent("mousemove", { window: win, event: e });
            }).bind("mouseup", function (e) {
                This.triggerEvent("mouseup", { window: win, event: e });
            }).bind("keydown", function (e) {
                This.triggerEvent("keydown", { window: win, event: e });
            });
        },

        /**@inner*/
        triggerEvent: function (eventName, eventData) {
            try {
                var g =  this.getTopManager();
                g.trigger(eventName, eventData);
            } catch (e) { }
        },

        /**@inner*/
        getTopManager: function () {
            var item = this;
            var win = this.get("window")|| window;;
            try {
                //while (win.parent) {
                //    if (win.$GlobalEvent) {
                //        item = win.$GlobalEvent;
                //    }
                //    if (win == win.top) break;
                //    win = win.parent;
                //}

                for (var i = 0; i < 0xFF; i++) {
                    if (win.parent) {
                        if (win.$GlobalEvent) {
                            item = win.$GlobalEvent;
                        }

                        if (win == win.top) {
                            break;
                        }

                        win = win.parent;
                    }
                }

            } catch (e) { }
            return item;
        },

        /**
         *重写了Backbone.Model的on方法，增加try{}catch(e){}
         *@param {String} eventName 监听事件名，现在支持click，mousemove，keydown
         *@param {Function} handler 处理回调，这里内部加了异常捕获，不会抛出异常（防止其它回调被中断）
         */
        on: function (eventName, handler, catchError) {
            var topObj = this.getTopManager();
            if(this !== topObj){
                return topObj.on.apply(topObj,arguments);
            }
            if (catchError !== false) {
                var This = this;
                var newHandler = function () {
                    try {
                        handler.apply(this, arguments);
                    } catch (e) {
                        //出错一次就会移除
                        //This.off(eventName, arguments.callee);
                    }
                };
            } else {
                newHandler = handler;
            }
            Backbone.Model.prototype.on.apply(this, [eventName, newHandler]);
            return newHandler;
        },
        off: function (eventName, handler) {
            var topObj = this.getTopManager();
            if (this !== topObj) {
                return topObj.off.apply(topObj, arguments);
            }
            return Backbone.Model.prototype.off.apply(this, arguments);
        }

    });

    //定义缩写
    window.$Event = M139.Event;
    window.$GlobalEvent = M139.Event.GlobalEvent = new M139.Event.GlobalEventManager();


})(jQuery, Backbone, M139);
﻿/**
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
﻿/**
 * @fileOverview 定义Model基类.
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    /**
   *@namespace
   */
    M139.Model = {};
    var superClass = Backbone.Model;
    M139.Model.ModelBase = superClass.extend(
    /**
    *@lends M139.Model.ModelBase.prototype
    */
    {
        /**
        *规范化的Model的基类,主要为了统一常用事件、方法的命名
        *它规定实例化的参数必须是Object类型，事件参数必须是Object类型，类必须有name属性
        *@constructs M139.Model.ModelBase
        *@require M139.Logger
        *@param {Object} options 参数集合
        *@example
        */
        initialize: function (options) {

            var name = this.name || this.get("name");

            /**
             *日志对象
             *@filed
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({ name: name || "ModelBase" });

            if (name == null) {
                throw "继承自ModelBase的类型缺少name属性";
            }
            if (options && !_.isObject(options)) {
                throw "继承自ModelBase的类型初始化参数必须为Object类型";
            }
        },

        /**
         *覆盖基类的trigger方法，对事件参数给予约束，data必须是Object类型
         */
        trigger: function (eventName, data) {
            if (typeof data == "undefined") {
                data = {};
            }
            if (!_.isObject(data)) {
                throw this.get("name") + ".trigger(" + eventName + ")" + "方法必须使用Object数据参数";
            }
            return superClass.prototype.trigger.apply(this, arguments);
        }

    });

})(jQuery, _, M139);
﻿/**
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

﻿﻿/**
 * @fileOverview 定义DOM操作相关的常用方法的静态类
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Dom
    *@requires jQuery
    */
    M139.Dom = {
        /**
        *判断view是否隐藏掉了，即display:none
        *@param {HTMLElement} element 判断的元素
        *@param {Boolean} bubblingParent 此参数为true的话则判断节点所在父元素是否可见
        */
        isHide: function (element, bubblingParent) {
            //todo is(":visible",ele)


            var result = false;
            if (element) {
                if (bubblingParent) {
                    while (element) {
                        if (element.style && element.style.display == "none") {
                            result = true;
                            break;
                        }
                        element = element.parentNode;
                    }
                } else {
                    result = element.style.display == "none";
                }
            }
            return result;
        },
        /***
         * 判断元素是否在指定的矩形区域内
         * @example:$D.inBounds("#div_main",{left:0,top:30,right:1240,bottom:800});
         */
        inBounds: function (elem, bounds) {
            if (elem.top && elem.left) {
                var position = elem;
            } else {
                var position = $(elem).position();
            }
            if (position.left >= bounds.left && position.top >= bounds.top
                && position.left  <= bounds.right && position.top  <= bounds.bottom) {
                return true;
            } else {
                return false;
            }
        },
        /**
        *判断element是否在某容器里，如果container等于element，返回true
        *@param {HTMLElement} container 容器
        *@param {HTMLElement} element 子元素
        */
        containElement: function (container, element) {
            return jQuery.contains(container, element);
            /*
            while (element && element.parentNode) {
                if (container === element) {
                    return true;
                }
                element = element.parentNode;
            }
            return false;
            */
        },
        /**
        *得到目标元素的父元素
        *@param {HTMLElement} target 目标元素
        *@param {String} parentTagName 父元素的标签
        */
        findParent: function (target, parentTagName) {
            parentTagName = parentTagName.toUpperCase();
            while (target) {
                if (target.tagName == parentTagName) {
                    return target;
                }
                target = target.parentNode;
            }
            return null;
        },
        /**
        *判断元素是否已被移除
        *@param {HTMLElement} element 判断的元素
        */
        isRemove: function (element) {
            try {
                while (element) {
                    if (element.tagName == "BODY") return false;
                    element = element.parentNode;
                }
            } catch (e) {
                return true;
            }
            return true;
        },
        /**
        *与input.focus()的区别是，这里捕获异常，并且获得焦点后光标默认在文本最后
        *@param {HTMLElement} objTextBox 获得焦点的文本框
        *@param {Object} options 扩展参数集合
        *@param {Number} options.pointerAt 光标的位置 0:最前,1:选中所有文本,2:最后,默认为2
        */
        selectTextBox: function (objTextBox, options) {
            options = options || {};
            var pointerAt = options.pointerAt === undefined ? 2 : options.pointerAt;
            try {
                if (pointerAt == 2) {
                    if (document.all) {
                            var r = objTextBox.createTextRange();
                            r.moveStart("character", objTextBox.value.length);
                            r.collapse(true);
                            r.select();
                    } else {
                        objTextBox.setSelectionRange(objTextBox.value.length, objTextBox.value.length);
                        objTextBox.focus();
                    }
                } else if (pointerAt == 1) {
                    objTextBox.select();
                } else {
                    objTextBox.focus();
                }
            } catch (e) { }
        },

        ZINDEX:5000,

        /**
         *获得从10000开始，自增的下一个zIndex
         */
        getNextZIndex:function(){
            return this.ZINDEX += 10;
        },

        /**
        *图片预加载
        *@param {Array} images 图片地址列表
        */
        preloadImages: function (images) {

        },
         //碰撞检测
        hitTest: function (o, l) {
        
            //console.log($(o).offset());
            //console.log(o);

            var r1 = $(o).offset();
            r1.width = o.offsetWidth; r1.height = o.offsetHeight;

            var r2 = $(l).offset();
            r2.width = l.offsetWidth; r2.height = l.offsetHeight;

           //判断一个点是否在矩形区域内
            function inRect(point,rect){
                return (point.left >= rect.left && point.top >= rect.top
                && point.left <= rect.left+rect.width && point.top <= rect.top+rect.height)
            }
            //判断两个矩形是否有交焦，以一个矩形2为参照，矩形1的四个顶点只要有一个落在矩形2内，则说明两矩形有相交，互为参照共要判断8次
            if (inRect({ left: r1.left, top: r1.top }, r2) || inRect({ left: r1.left+r1.width, top: r1.top }, r2)
                || inRect({ left: r1.left, top: r1.top + r1.height }, r2) || inRect({ left: r1.left + r1.width, top: r1.top + r1.height }, r2)
                || inRect({ left: r2.left, top: r2.top }, r1) || inRect({ left: r2.left + r2.width, top: r2.top }, r1)
                || inRect({ left: r2.left, top: r2.top + r2.height }, r1) || inRect({ left: r2.left + r2.width, top: r2.top + r2.height }, r1)) {
                
                return true;
            } else {
                return false;
            }
            /*function getOffset(o, isPoint) {
                var w = isPoint ? 1 : o.offsetWidth; //是1个像素的点
                var h = isPoint ? 1 : o.offsetHeight;
                for (var r = { l: o.offsetLeft, t: o.offsetTop, r: w, b: h };
                    o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop)
                return r.r += r.l, r.b += r.t, r;
            }
            
            for (var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
            b = getOffset(l[--i], true), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
            && (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
            return j ? !!r.length : r;
            */
            
        },

        /**
        *设置对象可拖拽
        *@param {HTMLElement} o 拖拽移动的对象
        *@param {Object} options 选项集合参数
        *@param {String} options.handleElement 拖拽的热区元素的路径，如: .titleBar
        *@param {Function} options.onDragStart 拖拽开始的回调
        *@param {Function} options.onDragMove 拖拽移动的回调
        *@param {Function} options.onDragEnd 拖拽结束的回调
        *@example
        $D.setDragAble(myDiv,{
            handleElement:".titleBar",
            onDragStart:function(e){
                //
            },
            onDragMove:function(e){
                //
            },
            onDragEnd:function(e){
                //
            }
        });
        */
        setDragAble: function (o, options) {
            options = options || {};
            var handleElement = options.handleElement;
            if (handleElement) {
                if (typeof (handleElement) == "string") {
                    var handleObj = $(o).find(handleElement);
                } else if (typeof (handleElement) == "object") {
                    //支持绑定多个热区元素
                    var handleObj = this.isJQueryObj(handleElement) ? handleElement : $(handleElement);
                }
            }
            o.orignX = 0;
            o.orignY = 0;
            var jObj = $(o);
            var min_x = 0, min_y = 0;
            var max_x, max_y;
            
            var manager = o;
            var offset = [];

            if (handleObj) {
                handleObj.mousedown(function (e) { drag_mouseDown(e) });//支持绑定多个热区元素
            } else {
                o.onmousedown = drag_mouseDown;
            }
            o.startDrag = function (e) {
                var x, y;
                e = M139.Event.getEvent();
                if (window.event) {
                    x = event.clientX + document.body.scrollLeft;
                    y = event.clientY + document.body.scrollTop;

                } else {
                    x = e.pageX;
                    y = e.pageY;
                }

                var postion = $(o).position();
                if (postion.left <= 0) {
                    offset = [0, 0];
                    
                } else {
                    offset = [x - postion.left, y - postion.top];
                }

                //window.status=x+","+y;
                var isStart = true; //拖动是否开始
                if (options.onDragStart) {
                    startResult = options.onDragStart({ x: x, y: y, target: (e.target || e.srcElement) });
                    if (startResult == false) { //在onDragStart返回false，可以
                        isStart = false;
                    }
                }
                if (isStart) { //确定拖动开始（某些dom元素上如文本框不能启动拖动）
                    if (o.setCapture) {	//在窗口以外也能响应鼠标事件
                        o.setCapture();
                    } else if (window.captureEvents) {
                        window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    $(document).bind("mousemove", drag_mouseMove);//.bind("mouseup", drag_mouseUp);
                    $GlobalEvent.on("mouseup", function (e) {
                        drag_mouseUp(e);
                    })
                   M139.Event.stopEvent(e); //阻止事件泡冒
                }
            }
            o.stopDrag = function () {
                if (o.releaseCapture) {
                    o.releaseCapture();
                }
                else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                if (options.onDragEnd) {
                    options.onDragEnd();
                }
                $GlobalEvent.off("mouseup");
                $(document).unbind("mousemove", drag_mouseMove).unbind("mouseup", drag_mouseUp);

            }

            function drag_mouseMove(e) {
                var newX, newY;
                if (window.event) {
					//chrome没有document.documentElement.scrollTop；有document.body.scrollTop(chrome执行到这个地方也有window.event)
                    newX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
                    newY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
                    
                } else {
                    newX = e.pageX;
                    newY = e.pageY;
                }

                if (options.bounds) { //控制拖拽边界
                    var bounds = {
                        left: options.bounds[0],
                        top: options.bounds[1],
                        right: options.bounds[2],
                        bottom: options.bounds[3]
                    }
                    var inBounds = $D.inBounds({ left: newX, top: newY }, bounds);
                    if (!inBounds) {
                        //manager.stopDrag(e);
                        return;
                    }

                }

                var _x = newX- offset[0];
                var _y = newY - offset[1];

                if (_x < 0) {
                    _x = 0;
                } else if (_x > getMax_X()) {
                    _x = getMax_X();
                }
                if (_y < 0) {
                    _y = 0;
                } else if (_y > getMax_Y()) {
                    _y = getMax_Y();
                }
                if (options.orignOffset) {
                    _x = _x + options.orignOffset.x;
                    _y = _y + options.orignOffset.y;
                }
                o.style.position = "absolute";
                if (!options.lockX) {
                    o.style.left = _x + "px";
                }
                if (!options.lockY) {
                    o.style.top = _y + "px";
                }

                if (options.onDragMove) {
                    options.onDragMove({ x: newX, y: newY,target:e.target});
                }
            }
            function drag_mouseDown(e) {
                manager.startDrag(e);
            }
            function drag_mouseUp(e) {
                manager.stopDrag(e);
            }

            function getMax_X() {
                if (!max_x){
                    max_x = $(document.body).width() - jObj.width();
                }
                return max_x;
            }
            function getMax_Y() {
                if (!max_y) {
                    max_y = $(document.body).height() - jObj.height();
                }
                return max_y;
            }
        },
        /**
         *获得元素的实际样式值  todo jQuery.curCss
         */
        getCurrentCSS:function(element,cssName){
            if (element.currentStyle) {
                return element.currentStyle[cssName.replace(/-[a-z]/, function(m) { return m.replace("-", "").toUpperCase() })];
            } else {
                return element.ownerDocument.defaultView.getComputedStyle(element, '').getPropertyValue(cssName);
            }
        },
        /**
        *让弹出菜单自动消失的一个工具函数，目前只支持点击其它区域自动关闭菜单，鼠标移出的话需要另外扩展
        *@param {Object} options 参数集合
        *@param {String} options.action 执行什么行为自动关闭菜单，可以是click|mouseout(注意这里是全局的)，默认是click
        *@param {Function} options.callback 可选参数，譬如：点击菜单以外的地区触发的回调
        *@param {HTMLElement} options.element 菜单元素节点
        *@param {Boolean} options.stopEvent 当action为click的时候，是否点击菜单自身不触发关闭菜单动作
        *@example
        var menu = createSomeMenu();
        M2012.UI.PopMenu.bindAutoHide({
            action:"click",
            element:menu.el,
            callback:function(){
                menu.remove();
            }
        });
        */
        bindAutoHide: function (options) {
            if (!options.element) {
                console.log("M139.Dom.bindAutoHide(),缺少element参数");
                return;
            }
            var action = options.action || "click";
            var showTime = new Date;
            if (action == "click") {
                if ($(options.element).attr("bindAutoHide") != "1") {//防止重复绑定
                    M139.Dom.unBindAutoHide(options);
                    $(options.element).attr("bindAutoHide", "1");
                    setTimeout(function () {
                        var evtHost = M139.Event.GlobalEvent;
                        if (top.M139) {
                            evtHost = top.M139.Event.GlobalEvent;
                        }

                        options.element.autoHideHandler = evtHost.on("click", function (data) {
                            try{
                                if (options.stopEvent) {
                                    var target = data.event.target;
                                    if (M139.Dom.containElement(options.element, target)) {
                                        return;
                                    }
                                }
                                if (new Date <= showTime) {
                                    return;
                                }
                                if ($.isFunction(options.callback)) {
                                    options.callback(data);
                                    options.callback = null;
                                }
                                evtHost.off("click", arguments.callee);//todo 有些时候移除不掉？
                            } catch (e) { }
                        },false);
                    }, 0);
                }
            }
        },
        /**
         *获取html对象的高度，与jQuery.height()不同的是会增加padding的计算
         */
        getElementHeight:function(el){
            var $el = $(el);
            var paddingTop = parseInt($el.css("padding-top")) || 0;
            var paddingBottom = parseInt($el.css("padding-bottom")) || 0;
            return $el.height() + paddingTop + paddingBottom;
        },

        /**取消绑定点击空白自动消失
        *@param {Object} options 参数集合
        *@param {String} options.action 执行什么行为自动关闭菜单，可以是click|mouseout(注意这里是全局的)，默认是click
        *@param {HTMLElement} options.element 菜单元素节点
        */
        unBindAutoHide: function (options) {
            if (!options.element) return;
            $(options.element).attr("bindAutoHide", "0");
            if (options.element.autoHideHandler) {
                M139.Event.GlobalEvent.off(options.action, options.element.autoHideHandler);
                options.element.autoHideHandler = null;
            }
        },
        /**工具函数，根据坐标，判断一个dom元素或一个点在屏幕中所处的方位（象限）
        *example
        $D.getDirection(documentElementById("div1"))
        $D.getDirection({left:100,top:100})
        */
        getQuadrant: function (elem) {
            var pos;
            var win = window;
            if ("left" in elem) { //是坐标点
                pos = elem;
            } else { //是dom元素
                pos = $(elem).offset();
                win = $(elem)[0].ownerDocument;
            }

            var w = $(win).width();
            var h = $(win).height();
            var center = { left: (w / 2), top: (h / 2) };//党中央的坐标

            if (pos.left <= center.left && pos.top <= center.top) {
                return 2;//"UpLeft"左上，第二象限
            } else if (pos.left >= center.left && pos.top <= center.top) {
                return 1;//"UpRight"右上，第一象限
            } else if (pos.left <= center.left && pos.top >= center.top) {
                return 3;//"LeftDown"左下，第三象限
            } else if (pos.left >= center.left && pos.top >= center.top) {
                return 4;// "RightDown" 右下，第四象限
            }

        },

        /**
         *将元素根据坐标停靠在目标元素边,比如弹出菜单(默认定位在正下方,可优化)
         *@param {HTMLElement} targetElement 目标元素（固定）
         *@param {HTMLElement} dockElement 要定位的元素
         *@param {Object} options 预留选项
         *@param {String} options.direction 方向 取值范围 auto:四个方向自适应,leftRight:左右自适应,upDown：上下自适应（默认值）,up:固定向上，down:固定向下,left:固定向左,right:固定向右
         *@param {Number} options.margin 空白边距，默认为0
         @example
         $D.dockElement($("#div1")[0],$("#div2")[0],{direction:"auto",margin:10})
         */
        dockElement: function (targetElement, dockElement, options) {
            options = options || {};
            var map = { //定义map是为了防止多条件排列组合产生大量if分支
                1: { //处于第一象限
                    auto: "leftDown",//左下
                    leftRight: "left", //向左
                    upDown: "down" //向下
                },
                2: { //处于第二象限
                    auto: "rightDown",
                    leftRight: "right",
                    upDown: "down"
                },
                3: { //处于第三象限
                    auto: "rightUp",
                    leftRight: "right",
                    upDown: "up"
                },
                4: { //处于第四象限
                    auto: "leftUp",
                    leftRight: "left",
                    upDown: "up"
                }
            };
            var direction;
            if (!options.direction) { //设置默认值
                options.direction = "upDown";
            }

            if (options.direction == "auto" || options.direction == "leftRight" || options.direction == "upDown") {
                var direction = map[this.getQuadrant(targetElement)][options.direction];
            } else { //指定单个方向
                direction = options.direction;
            }
            dockToDirection(direction);
            return direction;//因为要根据定位改变样式，所以外面要知道方位（比如箭头位置）
            function dockToDirection(direction) {
                var jTarget = $(targetElement);
                var jDock = $(dockElement);
                var offset = jTarget.offset();
                var margin = options.margin || 0;//空隙
                var left = offset.left;
                var top = offset.top;
                var offset = {
                    "up": offset.top - M139.Dom.getElementHeight(jDock) - margin,
                    "down": offset.top + jTarget.height() + margin,
                    "left": offset.left - jDock.width() - margin,
                    "right": offset.left + jTarget.width() + margin
                };
                switch (direction) {
                    case "up":
                        top = offset["up"];
                        break;
                    case "down":
                        top = offset["down"];
                        break;
                    case "left":
                        left = offset["left"];
                        break;
                    case "right":
                        left = offset["right"];
                        break;
                    case "leftUp":
                        left = offset["left"];
                        top = offset["up"];
                        break;
                    case "leftDown":
                        left = offset["left"];
                        top = offset["down"];
                        break;
                    case "rightUp":
                        left = offset["right"];
                        top = offset["up"];
                        break;
                    case "rightDown":
                        left = offset["right"];
                        top = offset["down"];
                        break;
                }
                
                left += options.dx|0;
                top += options.dy|0;
                
				// bugfix: 最终的位置是相对jDock的offsetParent计算出来的
				// 因此，jTarget的offset的计算也要相对于jDock的offsetParent
                var parentOffset = jDock.offsetParent().offset();
                left -= parentOffset.left;
                top -= parentOffset.top;

                jDock.css({
                    position : "absolute",
                    left: left + "px",
                    top: top + "px"
                });
            }

            return direction;
        },
        /**
         *当一个html元素里面有多个节点的时候，使用innerText会覆盖掉其它子元素，此函数可以只设置子文本节点的文字
         *@example
         &lt;a&gt;&lt;i /&gt;text&lt;/a&gt;
         M139.Dom.setTextNode(obj,"hehe");
         &lt;a&gt;&lt;i /&gt;text&lt;/a&gt;
         */
        setTextNode: function (el, text) {
            el = this.isHTMLElement(el) ? el : el[0];
            for (var i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].nodeType == 3) {//文本节点
                    el.childNodes[i].nodeValue = text;
                    break;
                }
            }
        },
        /**
         *判断是否原生的html元素，非jq托管对象
         */
        isHTMLElement: function (el) {
            return Boolean(el && el.getAttribute);
        },
        /**
         *使元素闪烁，通常用在文本框上，比如提示用户文本框需要填值，联系人重复等
         */
        flashElement: function (element, options) {
            var heightLineColor = "#FE9";
            var jEl = $(element);
            if (!/INPUT|TEXTAREA/.test(jEl[0].tagName)) {
                jEl = jEl.find("*").add(jEl);
            }
            var count = 0;
            var timer = setInterval(function () {
                count++;
                if (count % 2 == 1) {
                    jEl.css("background-color", heightLineColor);
                } else {
                    jEl.css("background-color", "");
                }
                if (count > 5) {
                    clearInterval(timer);
                }
            }, 100);
        },

        /**
         * 文本框获得焦点并定位光标到末尾
         * <pre>示例：<br>
         * <br>Utils.focusTextBox(document.getElementById("text"));
         * </pre>
         * @param {Object} objTextBox 必选参数，文档框对象。
         * @return{无返回值}
         */
        focusTextBox: function(objTextBox){
            try{
                if(document.all){
                    var r =objTextBox.createTextRange();
                    r.moveStart("character",objTextBox.value.length);
                    r.collapse(true);
                    r.select();
                }else{
                    objTextBox.setSelectionRange(objTextBox.value.length,objTextBox.value.length);
                    objTextBox.focus();
                }
            }catch(e){}
        },
        /**
         *修复因移除带文本框的浮层而使光标丢失的问题
         */
        fixIEFocus: function (bFocus) {
            //修复光标丢失问题
            if (bFocus || M139.Browser.is.ie) {
                try {
                    if (!top.ghostInput) {
                        top.ghostInput = top.$('<input type="text" style="height:1px;wdith:1px;position:absolute;left:0px;top:0px;"/>').appendTo(top.document.body);
                    }
                    top.ghostInput.focus().blur();
                } catch (e) { }
            }
        },

        /**
         *将原来的dom元素拆除，在原来的节点位置重新生成一个，目的是为了解除原来的事件绑定
         *@param {Object} obj 目标元素，jq对象或者HtmlElement对象
         */
        rebuildDom: function (obj) {
            try{
                if (this.isJQueryObj(obj)) {
                    obj.each(function () {
                        var node = this.cloneNode(true);
                        $(this).replaceWith(node);
                    });
                } else {
                    var node = obj.cloneNode(true);
                    $(obj).replaceWith(node);
                }
            } catch (e) { }
        },

        /**
         *判断一个对象是否为jQuery对象实例
         */
        isJQueryObj:function(obj){
            return Boolean(obj instanceof jQuery || (obj && obj.jquery));
        },

        /**
         *设置文本框输入长度，向下兼容
         */
        setTextBoxMaxLength: function (textbox, maxLength) {
            var jq = $(textbox);

            // 360浏览器选择文档ie11 + 文本ie7模式会抛出异常
            try {
                jq.attr("maxLength", maxLength);
            } catch (e) {}
            
            var _ks = M139.Event.KEYCODE;
            var _cks = [_ks.BACKSPACE, _ks.DELETE, _ks.UP, _ks.DOWN, _ks.LEFT, _ks.RIGHT];
            if ($B.is.ie && $B.getVersion() <=9) {
                //限制描述的文字
                jq.keydown(function (e) {
                    if (this.value.length >= maxLength) {
                        if (_.indexOf(_cks, e.keyCode) == -1) {
                            return false;
                        }
                    }
                }).bind("paste", function () {
                    if (this.value.length >= maxLength) {
                        return false;
                    }
                });
            }
        },

        appendHTML:function(el,html){
            if (el.insertAdjacentHTML) {
                el.insertAdjacentHTML("beforeEnd", html);
            } else {
                $(el).append(html);
            }
        },

        getHTMLElement: function(el){
            if (typeof (el) === "string") {
                return $(el)[0];
            } else if (this.isJQueryObj(el)) {
                return el[0];
            } else {
                return el;
            }
        },
        _getGhostDiv: function () {
            var self = this;
            if (!this._ghostDiv) {
                var html = "<div style='position:absolute;width:100%;height:100%;left:0px;top:0px;visibility: hidden;'></div>";
                this.appendHTML(document.body, html);
                var div = this._ghostDiv = document.body.lastChild;
                $(window).resize(function () {
                    delete self.cacheHeight;
                    delete self.cacheWidth;
                });
            }
            return this._ghostDiv;
        },
        getWinHeight:function(){
            var pageHeight = window.innerHeight; 
            if (typeof pageHeight != "number") {
                if (this.cacheHeight) {
                    pageHeight = this.cacheHeight;
                } else {
                    this.cacheHeight = pageHeight = this._getGhostDiv().offsetHeight;
                }
            }
            return pageHeight;
        },
        getWinWidth: function () {
            var pageWidth = window.innerWidth;
            if (typeof pageWidth != "number") {
                if (this.cacheWidth) {
                    pageWidth = this.cacheWidth;
                } else {
                    this.cacheWidth = pageWidth = this._getGhostDiv().offsetWidth;
                }
            }
            return pageWidth;
        },
        /**
         * 对本地存储简单封装
         */
        storage: {

            /**
             * 保存数据到本地存储
             * @param {String} key 数据的键
             * @param {HTMLElement} 数据的值
             * @return {Boolean} 是否成功
             */
            save: function(key, value) {
                if (!$B.support.storage()) {
                    return false;
                }

                try {
                    return localStorage.setItem(key, value);
                } catch (e) {
                    return false;
                }
            },

            /**
             * 本地存储中是否存在某个键，（不支持的浏览器均返回false）
             * @param {String} key 数据的键
             * @return {Boolean} 是否存在
             */
            exists: function (key) {
                if (!$B.support.storage()) {
                    return false;
                }
                for (var i=0; i<localStorage.length; i++){ if (localStorage.key(i) == key) { return true; } }; return false; //ignore jslint
            },

            /**
             * 从本地存储中移除
             * @param {String} key 数据的键
             * @return {Boolean} 是否成功
             */
            remove: function(key){
                if (!$B.support.storage()) {
                    return false;
                }

                if (!this.exists(key)) {
                    return true;
                }

                return localStorage.removeItem(key);
            }

        },

        
        /**
         * 设置textarea的高度自适应
         * 该做的不该做的都做了.此方法未经过测试不要直接调用就上线
         * @param {Object} textarea 控件,jq对象
         * @param {Object} options 参数,可选.
         * <pre>示例：<br>
         * <br>
         * M139.Dom.setTextAreaAdapte($("#textareaId), //textarea的jq对象
         * {
         *     width: "500px", //宽度
         *     maxrows:5, //可选,最大行数,超过行数出现滚动条,如果为<=0则表示一直自适应
         *     maxlength:200, //可选,可输入的最大字符串数量
         *     placeholder:'', //可选,未输入内容时的提示语
         *     defaultcolor:'#333', //可选,默认的字体颜色(非placeholder态),如果没传,则从textarea中读取css中的color
         *     defaultheight:"50px" //可选,textarea的默认高度
         * });
         * </pre>
         */
        setTextAreaAdaptive: function (textarea, options) {
            if (!textarea) return;

            var _this = this,
                mimics = _this.mimics,
                dom, div,
                maxlength,
                isIE = !!$.browser.msie;

            options = options || {};

            maxlength = options.maxlength || textarea.attr("maxlength") || Number.MAX_VALUE;
            var defaultheight = options.defaultheight || 0; //默认高度

            //#region 创建模拟元素
            //创建模拟的div
            dom = $("<div />").css({ 'position': 'absolute', 'display': 'none', 'word-wrap': 'break-word', 'white-space': 'pre-wrap' });
            textarea.css({ "overflow-y": "hidden", "overflow-x": "hidden", "resize": "none" });
            div = dom.appendTo(textarea.parent());

            //复制textarea的样式到div上
            var i = mimics.length;
            while (i--) {
                div.css(mimics[i].toString(), textarea.css(mimics[i].toString()));
            }
            //#endregion

            //要在div复制样式之后，否则height也会被复制过去，导致不能自适应高度
            if (!!defaultheight) {
                textarea.css ("height", defaultheight); //如果设定了默认高度
                defaultheight = parseInt(defaultheight, 10) || 0; //如 "79px"
            }

            //#region 绑定事件
            function changeSync() {
                var lineheight, lines,
                    maxheight, minheight,
                    textareaheight = textarea.height(),
                    divheight = div.height();

                lineheight = parseInt(div.css("padding-top"), 10) +
                                isIE ? parseInt(div.css("padding-bottom"), 10) : 0 + //IE加上bottom
                                (parseInt(div.css("line-height"), 10) || parseInt(div.css("font-size"), 10));

                if (textareaheight !== divheight && defaultheight < divheight) {
                    textarea.height(Math.max(divheight, lineheight));
                }

                if (divheight < defaultheight) {//textarea最小行高
                    textarea.height(defaultheight);
                }

                if (!!options.maxrows) {
                    lines = Math.floor(div.height() / lineheight); //粗略计算行数

                    if (lines > options.maxrows) { //超过了设置的最大行数,则出现滚动条
                        maxheight = options.maxrows * lineheight;
                        div.css({ "height": maxheight, "overflow-y": "auto" }); //css高度无效？？？
                        textarea.css({ "height": maxheight, "overflow-y": "auto" });

                        textarea.scrollTop(maxheight);
                        setTimeout(function () { textarea.height(maxheight); }, 0xf);
                    }
                }
            }

            textarea.bind("input keydown cut paste change blur", function (e) {
                if (_.indexOf([16, 17, 18, 20], e.keyCode) >= 0) return; //shift,ctrl,alt,TAB
                var text = textarea.val();
                if (text.length >= maxlength) {
                    e.stopPropagation();
                    return false;
                }

                if (e.type == "paste" && isIE) {
                    //IE不触发paste,延迟之后触发input,chrome自动会触发input事件
                    setTimeout(function () {
                        textarea.trigger("input");
                    }, 0xf);
                    return;
                }

                var str = $T.Html.encode(text).replace(/\r/g, "<br />").replace(/\n/g, "<br />");

                div.html(str);
                changeSync();
            });

            if (options.placeholder) {
                _this.setPlaceholder(textarea, { placeholder: options.placeholder, defaultcolor: options.defaultcolor });
            }
            //#endregion

            setTimeout(function () { textarea.trigger("change"); }, 250);
        },
        //用于将textarea的样式复制给div
        mimics: [
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'fontSize',
            'lineHeight',
            'fontFamily',
            'width',
            'fontWeight',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'borderTopStyle',
            'borderTopColor',
            'borderRightStyle',
            'borderRightColor',
            'borderBottomStyle',
            'borderBottomColor',
            'borderLeftStyle',
            'borderLeftColor'
        ],
        /**
         * 手工实现HTML5的placeholder属性
         * 只支持input和textarea
         */
        setPlaceholder: function (dom, options) {
            var _this = this;
            if (!dom) return;

            if (!_this.isSupportPlaceholder()) {
                var placeholder = options.placeholder,
                dom = $(dom), //转成jq对象
                color = "#ababab", //placeholder的颜色,局部存吧
                defaultcolor = options.defaultcolor || dom.css("color"); //控件的默认颜色

                if (!placeholder) return; //空格的话就不绑定了

                dom.bind("focus", function () {
                    var text = dom.val();
                    if ($(this).data("placeholder") && text === placeholder) { //通过标记位来识别是否在placeholder模式,而不是字符串长度
                        dom.val("").css("color", defaultcolor);
                    }

                }).bind("blur", function () {
                    var text = dom.val();
                    if (text.length === 0) {
                        dom.val(placeholder).css("color", color);
                        dom.data("placeholder", true); //标记:手工placeholder模式
                    } else {
                        dom.data("placeholder", false); //非placeholder模式,即允许用户输入跟placeholder一样的字符串
                    }
                });

                setTimeout(function () { dom.trigger("blur"); }, 0xff);
            } else {
                dom.attr("placeholder", options.placeholder);
                dom.css({ color: options.defaultcolor });
            }
        },
        /**
         * 是否支持placeholder属性
         */
        isSupportPlaceholder: function () {
            return 'placeholder' in document.createElement("input");
        }

    };
    window.$D = M139.Dom;
})(jQuery, M139);
﻿/**
 * @fileOverview 定义DOM操作相关的常用方法的静态类
 */

(function (jQuery, M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.JSON
    */
    M139.JSON = {
        /**
        *解析JSON字符串为对象，如果字符串为非标准JSON，则会抛异常
        */
        parse: function (text) {
            try {
                return jQuery.parseJSON(text);
            } catch (e) {
                throw "M139.JSON.parse Error";
            }
        },
        /**
        *解析一段非标准JSON字符串，返回一个对象，如果解析出错，则返回null
        */
        tryEval: function (text) {
            var obj = null;
            try {
                if (/^\s*\{/.test(text)) {
                    text = "(" + text + ")";
                }
                obj = eval(text);
            } catch (e) {

            }
            return obj;
        },
        /**
        *将对象序列为JSON字符串
        *@example
        M139.JSON.stringify({name:"Lily"});
        */
        stringify: function (value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
            } else {
                if (typeof space === "string") {
                    indent = space;
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw "M139.JSON.stringify Error";
            }
            return str("", { "": value });
        }
    }
    //JSON库
    function f(n) {
        return n < 10 ? "0" + n : n;
    }
    if (typeof Date.prototype.toJSON !== "function") {
        /**@inner*/
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };
        /**@inner*/
        function tojson(key) {
            return this.valueOf();
        }
        /**@inner*/
        Boolean.prototype.toJSON = tojson;
        /**@inner*/
        String.prototype.toJSON = tojson;
        /**@inner*/
        Number.prototype.toJSON = tojson;
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" }, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? "\"" + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap, partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                return isFinite(value) ? String(value) : "null";
            case "boolean":
            case "null":
                return String(value);
            case "object":
                if (!value) {
                    return "null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === "string") {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
        return v;
    }


    if(!window.JSON){
        JSON = {
            parse:function(text){
                return M139.JSON.parse(text);
            },
            stringify:function(obj){
                return M139.JSON.stringify(obj);
            }
        }
    }

})(jQuery, M139);
﻿/**
 * @fileOverview 定义时间日期操作相关的常用方法的静态类
 */

(function (M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Date
    */
    M139.Date =
    /**@lends M139.Date */
    {
        /**
        *解析文本为日期对象，目前只支持yyyy-MM-dd hh:mm:ss的写法，解析失败返回null
        *@param {String|Number} 要解析的时间文本,"yyyy-MM-dd hh:mm:ss"格式，或者是秒数
        *@returns {Date}
        *@example
        $Date.parse("2012-10-10 10:10:10");
        */
        parse: function (str) {
            if (/^\d{10}$/.test(str)) {
                return new Date(str * 1000);
            } else if (/^\d{13}$/.test(str)) {
                return new Date(str * 1);
            }

            str = str.trim();
            var reg = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var m = str.match(reg);
            if (m) {
                var year = m[1];
                var month = parseInt(m[2] - 1, 10);
                var day = parseInt(m[3], 10);
                var hour = parseInt(m[4], 10);
                var minutes = parseInt(m[5], 10);
                var seconds = parseInt(m[6], 10);
                return new Date(year, month, day, hour, minutes, seconds);
            } else {
                return null;
            }
        },
        /**
        *格式化时间文本
        *@param {Date} text 要格式化的文本
        *@param {String} date 时间对象
        *@returns {String}
        @example
        $Date.format("现在是yyyy年MM月dd日 hh点mm分ss秒，星期w",new Date());
        y 表示年份
        M 大写M表示月份
        d 表示几号
        h 表示小时
        m 表示分
        s 表示秒
        w 表示星期几
        */
        format: function (text, date) {
            /*
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(),    //day
                "h+": date.getHours(),   //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds(), //millisecond
                "w": "日一二三四五六".charAt(date.getDay())
            };
            text = text.replace(/y{4}/, date.getFullYear())
            .replace(/y{2}/, date.getFullYear().toString().substring(2))
            for (var k in o) {
                var reg = new RegExp(k);
                text = text.replace(reg, match);
            }
            function match(m) {
                return m.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length);
            }
            return text;
            */
            var reg = /yyyy|yy|M+|d+|h+|m+|s+|q+|S|w/g;
            text = text.replace(reg, function (pattern) {
                var result;
                switch (pattern) {
                    case "yyyy":
                        result = date.getFullYear();
                        break;
                    case "yy":
                        result = date.getFullYear().toString().substring(2);
                        break;
                    case "M":
                    case "MM":
                        result = date.getMonth() + 1;
                        break;
                    case "dd":
                    case "d":
                        result = date.getDate();
                        break;
                    case "hh":
                    case "h":
                        result = date.getHours();
                        break;
                    case "mm":
                    case "m":
                        result = date.getMinutes();
                        break;
                    case "ss":
                    case "s":
                        result = date.getSeconds();
                        break;
                    case "q":
                        result = Math.floor((date.getMonth() + 3) / 3);
                        break;
                    case "S":
                        result = date.getMilliseconds();
                        break;
                    case "w":
                        result = "日一二三四五六".charAt(date.getDay());
                        break;
                    default:
                        result = "";
                        break;
                }
                if (pattern.length == 2 && result.toString().length == 1) {
                    result = "0" + result;
                }
                return result;
            });
            return text;
        },
        /**
        *返回date2比date1大了几天（不是十分准确，可能有1天的偏差）
        *@param {Date} endDate 开始时间
        *@param {Date} endDate 结束时间
        *@returns {Number}
        */
        getDaysPass: function (startDate, endDate) {
            var t = endDate.getTime() - startDate.getTime();//相差毫秒
            var day = Math.round(t / 1000 / 60 / 60 / 24);
            if (day == 0 || day == 1) {
                day = startDate.getDate() == endDate.getDate() ? 0 : 1;
            }
            return day;
        },

        /**
        *判断两个日期是否同一天
        *@returns {Boolean}
        */
        isSameDay:function(date1,date2){
            return date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear();
        },

        /**
        *返回一个服务器时间（M39.HttpClient对象在与后台通讯的时候取得的Http头里的服务端时间）
        */
        getServerTime: function () {
            var d = new Date();
            var diffTime = (top.M139 && top.M139._ClientDiffTime_) || M139._ClientDiffTime_;
            if (diffTime) {
                //如果M139.HttpClient已通过ajax请求获取过服务器与客户端的时间差
                return new Date(d.getTime() - diffTime);
            }
            return d;
        },

        /**
        *比较时间，获得人性化的时间差描述：刚刚，几分钟前，几小时前
        @param {Date} date 要转化的时间
        @param {Date} now 可选参数，当前时间，默认取客户端时间
        *@returns {String}
        *@example
        var text = $Date.getFriendlyString(letter.sendDate);
        */
        getFriendlyString: function (date, now) {
            if (!date) return "";
            if (typeof date == "number") date = new Date(date * 1000);
            now = now || new Date();
            var result;
            //今天的邮件
            var t = now.getTime() - date.getTime(); 	//相差毫秒
            if (t < 0) {
                result = this.format("yyyy-M-dd", date);
            }
            else if (date.getYear() == now.getYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
                var minutes = Math.round(t / 1000 / 60);
                if (minutes == 0) {
                    result = "刚刚";
                } else if (minutes > 0 && minutes < 60) {
                    result = minutes + "分钟前";
                } else {
                    result = Math.floor(minutes / 60) + "小时前";
                }
            } else if (date.getYear() == new Date().getYear()) {
                result = this.format("M-dd(w)", date);
            } else {
                result = this.format("yyyy-M-dd(w)", date);
            }
            return result;
        },
        /**
        * 根据当前时间返回：凌晨、早上、中午、晚上、深夜
        */
        getHelloString: function (date) {
            date = date || new Date();
            var hour = date.getHours();
            var map = {
                "0": "凌晨",
                "1": "上午",
                "2": "中午",
                "3": "下午",
                "4": "晚上",
                "5": "深夜"
            };
            //0点-3点深夜 3点-6点凌晨 6点-11点上午 11点-13点中午……
            var hoursList = "555000111112233333344444";
            var index = hoursList.charAt(hour);
            return map[index];
        },
        /**
         *得到指定时间月份的天数
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getDaysOfMonth: function (date) {
            if (!date) date = new Date();
            var isLeapYear = this.isLeapYear(date.getFullYear());
            return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
        },
        /**
         *得到指定时间是否闰年
         *@param {Date|Number} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Boolean}
        */
        isLeapYear: function (date) {
            if (!date) date = new Date();
            if (date.getFullYear) date = date.getFullYear();
            return (date % 400 == 0 || (date % 4 == 0 && date % 100 != 0));
        },
        //获得星期几
        WEEKDAYS: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        /**
         *得到指定时间是星期几（中文）
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {String}
        */
        getChineseWeekDay: function (date) {
            if (!date) date = new Date();
            return this.WEEKDAYS[date.getDay()];
        },

        /**
         *获得指定时间月份的1号是星期几（日历用）
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getFirstWeekDayOfMonth:function(date){
            date = date ? new Date(date) : new Date();
            date.setDate(1);
            return date.getDay();
        },

        /**
         *获得指定月份一共有几个星期
         *@param {Date} date 可选参数，判断的时间，缺省为当前时间
         *@returns {Number}
        */
        getWeeksOfMonth:function(date){
            if (!date) date = new Date();
            var firstWeekDay = this.getFirstWeekDayOfMonth(date);
            var days = this.getDaysOfMonth(date);
            return Math.ceil((days + (6 - firstWeekDay)) / 7);
        },
        
        // 获取本周一的日期对象
        getThisMonday : function() {
			var nowDate = new Date();
			return new Date(nowDate.getTime() - (nowDate.getDay() - 1) * 86400000);
		},
        
        /**
         *获得距离本周一n天的日期对象
         *@param {n} 距离本周一的天数
         *@returns {Date}
         * example 获取本周天的日期对象:getWeekDateByDays(6)
         * 			
        */
        getWeekDateByDays : function(n){
        	if(!n){
        		n = 0;
        	}
			var weekFirstDay = this.getThisMonday();
			return new Date((weekFirstDay.getTime() / 1000 + n * 86400) * 1000);
        },
        
        /**
         *获得距离指定日期n天的日期对象
         *@param date 指定日期对象 
         *@param {n} 距离指定日期的天数
         *@returns {Date}
         * example 获取明天的日期对象:getDateByDays(new Date(), 1)
         * 			
        */
        getDateByDays : function(date ,n) {
        	if(!date){
        		date = new Date();
        	}
			return new Date(date.getTime() + n * 86400000);
		},
		/**
         *获得毫秒数对应的时间对象
         *@param ms {int} 毫秒数 
         *@returns {Object} {date ： date, hour : hour, minute : minute, second : second}
        */
		getTimeObj : function (ms) {
		   var ss = 1000;
		   var mi = ss * 60;
		   var hh = mi * 60;
		   var dd = hh * 24;
		   var day = parseInt(ms / dd);
		   var hour = parseInt((ms - day * dd) / hh);
		   var minute = parseInt((ms - day * dd - hour * hh) / mi);
		   var second = parseInt((ms - day * dd - hour * hh - minute * mi) / ss);
		   //var milliSecond = ms - day * dd - hour * hh - minute * mi - second * ss;
		   var strDay = day < 10 ? "0" + day : "" + day;
		   var strHour = hour < 10 ? "0" + hour : "" + hour;
		   var strMinute = minute < 10 ? "0" + minute : "" + minute;
		   var strSecond = second < 10 ? "0" + second : "" + second;
		   //var strMilliSecond = milliSecond < 10 ? "0" + milliSecond : "" + milliSecond;
		   //strMilliSecond = milliSecond < 100 ? "0" + strMilliSecond : "" + strMilliSecond;
		   var timeObj = {};
		   timeObj.date = strDay;
		   timeObj.hour = strHour;
		   timeObj.minute = strMinute;
		   timeObj.second = strSecond;
		   return timeObj;
		}
    }

    //兼容老版本接口
    Date.prototype.format = function(template){
        return M139.Date.format(template,this);
    }

    //定义缩写
    $Date = M139.Date;

})(M139);
﻿/**
 * @fileOverview 定义与浏览器相关的常用方法的静态类
 */

(function (jQuery, M139) {
    var $ = jQuery;
    var ua = navigator.userAgent;
    /**
    *定义与浏览器相关的常用方法的静态类，缩写为$B
    *@namespace
    *@name M139.Browser
    */
    M139.Browser =
    {
        /**即：navigator.userAgent,$B.ua
        * @field
        */
        ua: ua,
        /**
        *@namespace
        *@name M139.Browser.is
        */
        _is:
        /**@lends M139.Browser.is*/
        {
            /**是否IE浏览器
             * @field
             */
            ie: /MSIE/,

            /**是否火狐浏览器
             * @field
             */
            firefox: /firefox/i,

            /**是否是否谷歌浏览器
             * @field
             */
            chrome: /chrome/i,

            /**是否欧朋浏览器
             * @field
             */
            opera: /opera/i,

            /**是否苹果的Safari浏览器,如果是Chrome则输出false
             * @field
             */
            safari: /safari/i,

            /**是否Webkit内核浏览器
             * @field
             */
            webkit: /webkit/i,

            /**是否Gecko内核浏览器
             * @field
             */
            gecko: /gecko/i,

            /**是否iOS操作系统
             * @field
             */
            ios: /iPad|iPhone|iPod/,

            /**是否mac操作系统
             * @field
             */
            mac: /mac/i,

            /**是否安卓操作系统
             * @field
             */
            android: /Android/,

            /**是否Windows Phone操作系统
             * @field
             */
            windowsphone: /Windows Phone/,

            /**是否Windows操作系统
             * @field
             */
            windows: /Windows/,

            /**是否为手机
             * @field
             */
            phone: /mobile|phone/i,

            /**是否为Pad设备
             * @field
             */
            pad: /iPad/,

            /**是否为Linux操作系统
             * @field
             */
            linux: /Linux/
        },
        /**@namespace*/
        support:
        /**@lends M139.Browser.support*/
        {
            /**是否支持position:fixed*/
            cssFixed: function () {
                return !$B.is.ie || $B.getVersion() > 6;
            },

            /**
             * 是否支持本地存储
             */
            storage: function () {
                try {
                    return "undefined" !== typeof(window.localStorage) && null !== window.localStorage;
                } catch (ex) {
                    return false;
                }
            }
        },
        /**
        *获得获得版本
        */
        getVersion: function () {
            var version;
            if ($B.is.chrome) {
                var reg = /Chrome\D?([\d.]+)/;
                var m = ua.match(reg);
                if (m) version = parseInt(m[1]);
            } else if ($B.is.safari) {
                var reg = /version\D?([\d.]+)/i;
                var m = ua.match(reg);
                if (m) version = parseFloat(m[1]);
            }
            return version || $.browser.version;
        },
        /**
        *判断ua是否包含某个关键字,即： $B.ua.indexOf(keyword) > -1，可以一次判断多个值
        *@example
        $B.uaContains(keyword1,keyword2);
        */
        uaContains: function (keyword1, keyword2) {
            var result = false;
            for (var i = 0; i < arguments.length; i++) {
                result = result || $B.ua.indexOf(arguments[i]) > -1;
            }
            return result;
        },
        /**
        *@inner
        *初始化，给M139.Browser.is赋值，也可以传一个假的ua进行测试
        */
        init: function (uaString) {
            var is = $B.is = {};
            var _is = $B._is;
            var _ua = uaString || ua;
            for (var r in _is) {
                if (typeof _is[r] == "object") {
                    is[r] = _is[r].test(_ua);
                }
            }
            is.safari = is.safari && !is.chrome;
            if(window.ActiveXObject == undefined && window.ActiveXObject !== undefined){
                is.ie11 = true; //别把ie11当ie
            }
        }
    };
    window.$B = M139.Browser;
    $B.init();


    if(!window.console){
        console = {
            assert: function () {  },
            count: function () {  },
            debug: function () {  },
            dir: function () {  },
            dirxml: function () {  },
            error: function () {  },
            group: function () {  },
            groupCollapsed: function () {  },
            groupEnd: function () {  },
            info: function () {  },
            log: function () {  },
            markTimeline: function () {  },
            profile: function () {  },
            profileEnd: function () {  },
            time: function () {  },
            timeEnd: function () {  },
            timeStamp: function () {  },
            trace: function () {  },
            warn: function () {  }
        }
    }

})(jQuery, M139);
﻿/**
 * @fileOverview 定义配置依赖项.
 */
(function (jQuery, M139) {
    var $ = jQuery;

    M139.ConfigManager = Backbone.Model.extend(
     /**
        *@lends M139.ConfigManager.prototype
        */
    {
        /** 配置处理类，实例化后为$Config
        *@constructs M139.ConfigManager
        */
        initialize: function () {
            this._configs = {};
        },
        /**
        *批量添加配置数据
        *@param {String} configName 一组配置的名称
        *@param {Object} configSet 一组配置值，{key:value}的形式
        *@example
        $Config.registerConfig("SiteConfig",{
            "Site1":"http://images.139cm.com",
            "Site2":"http://www.baidu.com"
        });
        */
        registerConfig: function (configName, configSet) {
            var This = this;
            if (configSet instanceof Array) {   //数组
                this._configs[configName] = configSet;
            } else {
                $.each(configSet, function (key, value) {
                    This.setConfig(configName, key, value);
                });
                this.trigger("register", {
                    configName: configName,
                    configValue: configSet
                });
            }
        },
        /**
        *添加配置数据
        *@param {String} configName 一组配置的名称
        *@param {String} key 配置名
        *@param {String|Number} value 配置值，最好不要传对象，虽然没有禁止
        *@example
        $Config.setConfig("SiteConfig","Site1","http://images.139cm.com");
        */
        setConfig: function (configName, key, value) {
            var configSet = this._configs[configName];
            if (!configSet) {
                configSet = this._configs[configName] = {};
            }
            configSet[key] = value;
            /**配置更新事件
                * @name M139.ConfigManager#update
                * @event
                * @param {Object} e 事件参数
                * @param {String} e.configName 变动的配置集合名
                * @param {String} e.key 变动的配置键
                * @param {String|Number} e.value 变动的配置值
                * @example
                $Config.on("update",function(e){
                });
            */
            this.trigger("update", {
                configName: configName,
                key: key,
                value: value
            });
        },
        /**
        *读取配置数据
        *@param {String} configName 一组配置的名称
        *@param {String} key 配置名
        *@example
        $Config.getConfig("SiteConfig","Site1");
        */
        getConfig: function (configName, key) {
            if (arguments.length == 1) {
                return this._configs[configName];
            } else {
                return this._configs[configName] && this._configs[configName][key];
            }
        },
        /**
        *在控制台打印当前托管的所有配置值
        */
        showAll: function () {
            try {
                console.log(M139.JSON.stringify(this._configs, "", "    "));
            } catch (e) { }
        }
    });
    //定义缩写
    window.$Config = new M139.ConfigManager();

})(jQuery, M139);
﻿/**
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
﻿M139.HttpRouter = {
    /**
    * 服务器列表，服务器的路径规则，通过addServer
    */
    serverList: {
        "appsvr": { domain: "http://" + location.host, path: "/s?func={api}&sid={sid}" },
        "webapp": { domain: "http://" + location.host, path: "/RmWeb/mail?func={api}&sid={sid}" },
        "setting": { domain: "http://" + location.host, path: "/setting/s?func={api}&sid={sid}" },
        "addr": { domain: "http://" + location.host, path: "/addrsvr/{api}?sid={sid}&formattype=json" },
        "addr_p3_gw" : { domain: "http://" + location.host, path: "/addr_p3_gw/SyncUserInfo/addrlistservice_sync_get?func={api}&sid={sid}" },
        "weather": { domain: "http://" + location.host, path: "/mw2/weather/weather?func={api}&sid={sid}" },
        "positioncontent": { domain: "http://" + location.host, path: "/mw/mw/getUnifiedPositionContent?sid={sid}" },
        "mms": { domain: "http://" + location.host, path: "/sm/mms/mms?func={api}&sid={sid}" },
        "sms": { domain: "http://" + location.host, path: "/mw2/sms/sms?func={api}&sid={sid}" },
        "search": { domain: "http://" + location.host, path: "/bmail/s?func={api}&sid={sid}" },
        "card": { domain: "http://" + location.host, path: "/mw2/card/s?func={api}&sid={sid}" },
        "together": { domain: "http://" + location.host, path: "/together/s?func={api}&sid={sid}" },
        "disk": { domain: "http://" + location.host, path: "/mw2/disk/disk?func={api}&sid={sid}" },
        "file": { domain: "http://" + location.host, path: "/mw2/file/disk?func={api}&sid={sid}" }, // add by tkh 测试线以file/disk?func=调用彩云文件快递新接口
        "note": { domain: "http://" + location.host, path: "/mw2/file/mnote?func={api}&sid={sid}" },
		"evernote": {domain: "http://" + location.host, path: "/mw2/file/mnote?func={api}&sid={sid}"},
        "uec": { domain: "http://" + location.host, path: "/uec/uec/s?func={api}&sid={sid}" },
        "bill": { domain: "http://" + location.host, path: "/mw/mw/billsvr?func={api}&sid={sid}"}, //注意：测试线路径不一致
        "middleware": { domain: "http://" + location.host, path: "/middleware/s?func={api}&sid={sid}"},
        "calendar": { domain: "http://" + location.host, path: "/mw2/calendar/s?func={api}&sid={sid}" },
        "businessHall": { domain: "http://" + location.host, path: "/together/s?func={api}&sid={sid}" },//邮箱营业厅
	"billcharge": { domain: "http://" + location.host, path: "/mail_hall/info?func={api}&sid={sid}" },//邮箱账单        
        "groupmail": { domain: "http://" + location.host, path: "/mw2/groupmail/s?func={api}&sid={sid}" },//群邮件
	"nothing": {},
        "webdav": { domain: "http://" + location.host, path: "/addr_p3_gw/dav/addrlistservice_sync_webdav?func={api}&sid={sid}" }
        },
    /**
    * 接口列表，通过addRouter配置
    */
    apiList: {
        "mbox:getAllFolders": "appsvr"
    },
    addServer: function(key, data) {
        this.serverList[key] = data;
    },
    addRouter: function(server, list) {
        for (var i = 0; i < list.length; i++) {
            var name = list[i];
            this.apiList[name] = server;
        }
        return true;
        /*if(!this.apiList[server]){
        this.apiList[server]=[];//没有则初始化
        }
        var orignList=this.apiList[server];//取出原数据
        orignList.concat(apiList); //合并原数据与新数据。
        return this.routerList;*/
    },
    /*
    addUrl:function(key,data){
    if(data.server && data.path){
    var server=data.server;
    if(this.serverList[server]){
    data.path=$T.format(data.path,{server:this.serverList[server]});
    }
    }
    	
    urlList[key]=data;
    },*/
    getUrl: function(api) {
        
        var qs = {};
        
        if(api.indexOf('?') > 0) //处理如 uec:list?a=1&b=2 这样的情况
        {
            qs = $Url.getQueryObj(api); // 得到 {a:1, b:2} 对象
            api = api.split('?')[0];    // 得到 uec:list
        }
        
        var domainKey = this.apiList[api];
        if (!domainKey) {
            if (api.indexOf("&") > 0) { //容错，加了get参数后找不到接口的问题
                domainKey = this.apiList[api.split("&")[0]];
            }
        }
        var domain = this.serverList[domainKey].domain;
        var url = domain + this.serverList[domainKey].path;


        // mod by yuanhb start : append api params to result url.
        var result = $T.format(url,
        {
            sid: $T.Url.queryString("sid") || top.sid,
            api: api
        });
        if (api == "global:sequential2") {
            result = result.replace("global:sequential2","global:sequential");
        };
        if (result && qs) {
            result = $Url.makeUrl(result , qs);
        }

        if (!top.COMEFROM) {
            top.COMEFROM = $T.Url.queryString("comefrom");
        }
        if (top.COMEFROM) {
            result += "&comefrom=" + top.COMEFROM;
        }

        return result;
//        return $T.format(url, $.extend(
//        {
//            sid: $T.Url.queryString("sid") || top.sid,
//            api: api
//
//        }, qs) );
        // mod by yuanhb end
    },

    hostConfig_12:{
        "mw": {
            host:"mw.mail.10086.cn",
            proxy:"/proxy.htm"
        },
        "mw2": {
            host:"smsrebuild1.mail.10086.cn",
            proxy:"/proxy.htm"
        },
        "bill": {
            host:"mw.mail.10086.cn",
            proxy:"/bill/proxy.htm"
        },
        "sm":{
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "together": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "setting": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addrsvr": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addr_p3_gw": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "uec": {
            host: "uec.mail.10086.cn",
            proxy: "proxy.htm"
        },
        "g2": {
            host: "g2.mail.10086.cn",
            proxy:"/proxy.htm"
        },        
        "mail_hall": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "sharpapi": {
            host: "smsrebuild1.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "pns": {
            host: "pushmsg.mail.10086.cn",
            proxy: "pns/proxy.htm",
            keepPath: true
        }
    },
    hostConfig_1: {
        "mw": {
            host: "mw-test.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "mw2": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "bill": {
            host:"mw-test.mail.10086.cn",
            proxy:"/bill/proxy.htm"
        },
        "sm": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "together": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "setting": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath:true
        },
        "addrsvr": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "addr_p3_gw": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "uec": {
            host: "uec0.mail.10086.cn",
            proxy: "proxy.htm"
        },
        "g2": {
            host: "g3.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "g3": {
            host: "g3.mail.10086.cn",
            proxy: "/proxy.htm"
        },
        "mail_hall": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "sharpapi": {
            host: "smsrebuild0.mail.10086.cn",
            proxy: "/proxy.htm",
            keepPath: true
        },
        "pns": {
            host: "pushmsg0.mail.10086.cn",
            proxy: "pns/proxy.htm",
            keepPath: true
        }
    },
    /**
     *返回代理配置
     */
    getProxy: function (url) {
        if (document.domain != "10086.cn") {
            return null;
        }
        var proxyServerPath = M139.Text.Url.removeHost(url).replace(/\/+/g, "/").split("/")[1];
        var partId ;
        if (window.getCookie) {//避免无top窗口引用时取不到cookie
            partId = getCookie("cookiepartid");
        } else {
            partId = M139.Text.Cookie.get("cookiepartid");
        }

        //当灰度中帐号，与全网帐号在相同浏览器下，依次登录，灰度帐号会读取到全网的cookiepartid，这段代码，则根据url中的appmail3进行分区修正。
        if (partId === "12") {
			var betahost = false;
			if ("[object Function]" === Object.prototype.toString.call(window.getDomain)) {
				//如果当期是top
				betahost = window.getDomain("betadomain");
			}
			
			if (!betahost && "[object Function]" === Object.prototype.toString.call(top.getDomain)) {
				betahost = top.getDomain("betadomain");
			}
			
			if (!betahost) {
				//填个默认值
				betahost = "appmail3.mail.10086.cn";
			}

            if ("undefined" !== typeof (betahost) && betahost !== "") { //有配置才修正
                if (betahost === location.host) {
                    partId = "1";
                }
            } else {
				//如果始终都无法得到配置，未避免误修正，所以不处理
			}
        }

        var hostConfig = this["hostConfig_" + partId] || this.hostConfig_12;
        var item = hostConfig[proxyServerPath];
        if (proxyServerPath && item) {
            var newUrl = this.removeProxyPath(url, proxyServerPath, item.keepPath);

            return {
                url: newUrl,
                host: item.host,
                proxy: item.proxy
            };
        } else {
            //不需要使用代理
            return null;
        }
    },

    getNoProxyUrl: function (url) {
        var proxy = this.getProxy(url);
        if (proxy) {
            return "http://" + proxy.host + proxy.url;
        } else {
            return url;
        }
    },

    /**
     *移除掉路由前缀（因nginx配置很不统一）
     */
    removeProxyPath: function (url, proxyServerPath,keepPath) {
        url = M139.Text.Url.removeHost(url);
        if (keepPath) {
            return url;
        } else {
            return url.replace("/" + proxyServerPath, "");
        }
    },

    ProxyFrameMap:{},

    /**
     *等待代理页加载
     */
    proxyReady: function (url, callback) {
        var iframe = this.ProxyFrameMap[url];
        if (!iframe) {
            var html = '<iframe src="{0}" style="display:none"></iframe>'.format(url);
            this.ProxyFrameMap[url] = iframe = $(html).appendTo(document.body);
            //增加确保代理页加载成功的机制（默认重试3次）
            M139.Iframe.checkIframeHealth({
                iframe: iframe[0]
            });
        }
        if (M139.Iframe.isAccessAble(iframe[0])) {
            return callback(iframe[0].contentWindow);
        } else {
            M139.Iframe.domReady(iframe[0], function () {
                callback(iframe[0].contentWindow);
            });
        }
    }
};
/*
    var proxy = M139.HttpRouter.getProxy("http://" + location.host + "/g2");
    console.log(JSON.stringify(proxy));

    M139.Text.Url.removeHost("http://" + location.host + "/g2");

*/
﻿/**
 * @fileOverview 定义Iframe使用的封装
 * @inner
 */

(function (jQuery, Backbone, _, M139) {

    M139.namespace("M139.Iframe", Backbone.Model.extend(
    /**
    *@lends M139.Iframe.prototype
    */
    {
        /** 
        *定义Iframe使用的封装
        *@constructs M139.Iframe
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            if (!options || !options.name) {
                throw "Application实例缺少参数:name";
            }
        }
    }
    ));

    jQuery.extend(M139.Iframe,
    /**
    *@lends M139.Iframe
    */
    {
        /**
         *判断iframe是否可以使用
         *@param {HTMLElement} iframe iframe元素
         *@param {String} query 可选参数，检查iframe中存在的对象（一般情况下不用传）
         */
        isAccessAble: function (iframe,query) {
            var ok = false;
            try {
                var win = iframe.contentWindow;
                var doc = win.document;
                ok = Boolean(doc.body && document.domain == doc.domain && win.location.href.indexOf("http") > -1);
                if (ok && doc.readyState) {
                    if (doc.readyState == "complete") {
                        ok = true;
                    } else {
                        ok = false;
                    }
                }
                if (ok && query) {
                    ok = Boolean(win[query]);
                }
            } catch (e) { }
            return ok;
        },

        /**
         *判断iframe是否已加载完成，可用
         *@param {HTMLElement} iframe
         *@param {Function} callback确认可用后的回调
         *@param {Object} options高级查询参数，比如options.query函数检查window中的对象可用
         */
        domReady: function (iframe, callback, options) {
            var timer;
            options = options || {};
            M139.Timing.waitForReady(function(){
                var ok = M139.Iframe.isAccessAble(iframe, options.query);
                if (ok && timer) {
                    clearInterval(timer);
                }
                return ok;
            }, callback);
            if (options.checkIframeHealth) {
                timer = this.checkIframeHealth({
                    iframe: iframe
                });
            }
        },
        /**
         *老版本的markSureIframeReady：保证iframe能够正确加载,通常用在ajax代理的iframe
         *每3秒检查一次，如果不对，则替换src重新加载
        */
        checkIframeHealth:function (conf) {
            var iframe = conf.iframe;
            var retryTimes = conf.retryTimes || 3;
            var interval = conf.interval || 3000;
            var query = conf.query;
            var check = function () {
                return M139.Iframe.isAccessAble(iframe, conf.query);
            };
            var timer = setInterval(function () {

                if (M139.Dom.isRemove(iframe)) {
                    clearInterval(timer);
                    return;
                }

                retryTimes--;
                if (!check()) {
                    var url = iframe.src;
                    if (url.indexOf("?") == -1) {
                        url += "?";
                    }
                    url += "&" + Math.random();
                    iframe.src = url;
                } else {
                    clearInterval(timer);
                }
                if (retryTimes <= 0) {
                    clearInterval(timer);
                    if (!check()) {
                        throw "M139.Iframe.checkIframeHealth Fail:" + iframe.src;
                    }
                }
            }, interval);
            return timer;
        }
    });
    
    $Iframe = M139.Iframe;
})(jQuery, Backbone, _, M139);
﻿/**
* @fileOverview 定义RichMail的Http客户端类.
*/

(function (M139) {

    /**与RM有关的类库命名空间
    *@namespace
    *@name M139.RichMail
    */
    M139.core.namespace("M139.RichMail");
    M139.RichMail.RichMailHttpClient = M139.ExchangeHttpClient.extend(
    /**
    *@lends M139.RichMail.RichMailHttpClient.prototype
    */
{
    /** 与RM系统通讯的http客户端类，调用接口有两种方式，一种是提供报文，调用request，一种是以注册的形式添加方法
    *@constructs M139.RichMail.RichMailHttpClient
    *@extends M139.ExchangeHttpClient
    *@param {Object} options 初始化配置，参数继承M139.HttpClient的初始化参数
    *@example
    var rmClient = new M139.RichMail.RichMailHttpClient(
    {
    name:"RichMailHttpClient",
    router:"appsvr"
    }
    );
    */
    initialize: function (options) {
        M139.ExchangeHttpClient.prototype.initialize.apply(this, arguments);
        this.router = M139.HttpRouter;

        var _options = options || {};
        var onrouter = _options.onrouter || $.noop;

        onrouter.call(this, this.router);

        this.router.addRouter("appsvr", [
            "user:getInitData",
            "user:getInitDataConfig",
            "mbox:getAllFolders",
            "mbox:listMessages",
            //"mbox:searchMessages",
            "global:sequential",
            "mbox:setUserFlag",
            "mbox:getSearchResult",
            //"mbox:moveMessages",
            //"mbox:deleteMessages",
            "mbox:deleteFolders",
            //"mbox:updateMessagesStatus",
            "mbox:updateMessagesLabel",
            "mbox:updateMessagesAll",
            "mbox:setFolderPass",
            "mbox:updateFolders",
            
            "mbox:setSessionMode",
            "user:getWhiteBlackList",
            "user:setWhiteBlackList",
            "user:getSignatures",
            "user:signatures",
            "user:setFilter_New",
            "user:getFilter_New",
            "user:setFilter",
            "user:getFilter",
            "user:filterHistoryMail",
        //    "attach:listAttachments",
            "user:statMessages",
            "mbox:updateBillType"
        ]);
		this.router.addRouter("appsvr2", [
            "attach:listAttachments",
			"mbox:queryContactMessages",
			"attach:queryContactAttachments"
        ]);//add by zhangsx
        this.router.addRouter("webapp", [
                "mbox:moveMessages",
                "mbox:deleteMessages",
                "mbox:updateMessagesStatus",
                "mbox:readMessage",
                "mbox:readMessage&comefrom=5",
                "mbox:updateFolders2",
                "mbox:getMessageInfo",
                "mbox:readSessionMessage",
                "mbox:readSessionMessage&comefrom=5",
                "mbox:replyMessage",
                "mbox:forwardAttachs",
                "mbox:forwardMessage",
                "mbox:searchMessages",
                "mbox:sendMDN",
                "mbox:sendMDN&comefrom=5&categroyId=103000000",
                "mbox:mailFile",
                "mbox:mailClean",
                "user:setPOPAccount",
                "user:getPOPAccounts",
                "user:syncPOPAccount","user:syncPOPAccountAll",
                "mbox:mailMemo",
                "mbox:getDeliverStatus",
		        "mbox:compose",
                "mbox:compose&comefrom=5&categroyId=103000000",
                "mbox:compose&comefrom=5&categroyId=102000000",
                "mbox:compose&comefrom=5&categroyId=103000005",
                "mbox:compose&comefrom=5&categroyId=102000015",
                "mbox:compose&comefrom=5&categroyId=103000010",
                "mbox:compose&comefrom=5",
                "mbox:getComposeId",
                "upload:deleteTasks",
                "attach:refresh",
                "mbox:forwardMessages",
                "mbox:restoreDraft",
                "mbox:editMessage",
                "mbox:reportSpamMails",
                "mbox:recallMessage",
                "mbox:packMessages",
                "user:moveHOMail",
                "mbox:checkDomain",
                "user:setFilter_139",
                "user:getFilter_139",
                "user:filterHistoryMail139",
                "user:forwardVerify",
                "user:sortFilter_139",
                "user:getAttrs",
                "user:setAttrs",
                "global:sequential2",
                "mbox:setTaskMessages",
				"attach:listAttachments",
				"mbox:queryContactMessages",
				"attach:queryContactAttachments"
        ]);

        //todo add mw httpclient

        this.router.addRouter("setting", [         
            "user:getOnlineFriends",

            "user:getMainData", "user:setUserConfigInfo", "user:getInfoCenter","user:taskCount","user:getMyTask","user:taskAward",'user:taskWorshipEnvy','user:taskStar','user:taskBadge', "user:getMedals",
            "poperations:signInit","poperations:queryphiz","poperations:publishedsign","poperations:querysign","poperations:invitefriends","poperations:checkinviteadd",
            "user:getPersonal", "user:setMyApp", "user:sendPasswordAction", "user:updatePasswordAction", "user:checkAliasAction", "user:updateAliasAction",
            "meal:getMealInfo", "meal:setMealInfo", "mailUpdate:getMailUpdateInfo", "mailUpdate:setMailUpdateInfo",
            "mailPatter:setMailPatterInfo", "mailPatter:getMailPatterInfo", "mailPatter:getSMSCode", "user:setAddMeRule", "user:bindFeixinAction",
            "user:getLoginNotify", "user:setLoginNotify",
            "user:getMailNotify", "user:updateMailNotify", "user:addMailNotifyExcp", "user:modifyMailNotifyExcp", "user:delMailNotifyExcp",
            "user:mailToMe",
            "user:sendPasswordAction",
            "user:checkPhoneAction",
            "user:bindPhoneAction",
            "bill:setszjtBill",
            "user:loginHistory",
            "user:mailDeleteHistory",
            "user:popAgentHistory",
            "user:passwordModifyHistory",
            "user:SetDefaultAccount",
            "user:setDefaultSendAccount",
            "unified:getUnifiedPositionContent",
            "user:checkPassword","user:getQuestion","user:setPasswordProtect",
            "earthhour:earthHourInit",
            "earthhour:setStatus",
            "earthhour:getStencil",
            "earthhour:inviteFriends",
            "umc:getArtifact",
            "umc:mailCallUMC",
            "umc:updatePassport",

            "user:cancelMailboxAction",
            "info:getInfoSet",
            "addr:getVCard",
            "umc:rdirectCall",
            "umc:rdirectTo",
            "guide:getUserinfo",
            "guide:setUserinfo",
            "guide:setUserpic",
            "bill:getTypeList",
            "bill:openTrafficBill",
            "bill:clossTrafficBill",
            "bill:openBill",
            "bill:closeBill",
			"bill:batterypitcherBill",
			"bill:getBatterypitcherBill",
            "setting:examineShowStatus",
            "setting:examineUserStatus",
			"user:getImageCode",
            "setting:examinePwdStatus",
			"disk:getDiskAttConf",  //超大附件是否自动存网盘
			"disk:updateDiskAttConf",
			"healthy:getHealthyInfo",
            "healthy:setTrustAutoLogin",
            "healthy:setTrustForward",
            "healthy:oneClickUpdate",
            "healthy:getOneClickUpdateInfo",
            "healthy:getHealthyHistory",
            "healthy:updateLastTipsTime",
            "user:getCapModHist",
            "msg:getRemindMsg",
            "msg:delRemindMsg"
        ]);

        this.router.addRouter('together', ["user:getExDataSync", "user:getFetionC", "weibo:userinfo"
        ]);

        //todo add addr httpclient
        this.router.addRouter("addr", [
            "GetUserAddrJsonData",
            "QueryUserInfo", "ModUserInfo", "AddUserInfo", "DelContacts",
            "WhoAddMeByPage", "OneKeyAddWAM", "WhoWantAddMe", "AgreeOrRefuseAll","WMAGroupList","ModDealStatus",
            "GetUpdatedContactsNum","GetUpdatedContactsDetailInfo","QuerySaveAllUpdatedResult","SaveIncrementalUpdatedInfo","SaveAllUpdatedInfo","AddImageReport","NoPromptUpdate","SkipCurrent",
            "QueryContactsAndGroup",
            "ModContactsField","MergeContacts",
            "DelGroup","AddGroupList","DelGroupList","GetAudienceEmailList",
            "GetBatchOperHistoryRecord", "GetBatchOperStatus", "AutoMergeContacts",
            "QueryMergeResult",
            "GetColorCloudInfo",
            "GetFinshImportResult", "GetFinshImportList", "GetRemindBirdays", "SetRemindBirdays"
        ]);

        this.router.addRouter('weather', [
            "weather:getDefaultWeather", "weather:getArea", "weather:getWeather",
            "weather:setWeather"
        ]);

        this.router.addRouter('positioncontent', [
            "positioncontent:ad"
        ]);

        this.router.addRouter('card', [
            "card:birthdayRemind"
        ]);

        this.router.addRouter('mms', [
            "mms:mmsInitData"
        ]);

        this.router.addRouter('sms', [
            "sms:getSmsMainData",
            "sms:smsNotifyInit"
        ]);
        this.router.addRouter('ServiceAPI', [
            "RMSecretFolder"
        ]);

        this.router.addRouter('search', [
            "mbox:searchMessages",
            "mail:askAddFriendToMayKnow",
            "mail:systemCutMessage",
            "mail:askShareContact",
            "mail:shareContact"
        ]);

        this.router.addRouter('bill', [
            //"bill:getTypeList",
            "bill:setBill"
        ]);

        this.router.addRouter('disk', [
            "disk:fSharingInitData",
            "disk:getFile",
            "disk:getFiles",
            "disk:setFiles",
            "disk:getdiskallinfo",
            "disk:getdirfiles",
            "disk:renameFiles",
            "disk:renameDiskFile",
            "disk:renameDirectory",
            "disk:renameDiskAlbum",
            "disk:renameDiskMusicClass",
            "disk:saveAttach",
           // "disk:search",
            "disk:mailFileSend",
            //"disk:download",
            "disk:flashplay",
            "disk:shareCopyTo"
        ]);
        
		// add by tkh 文件快递彩云新接口
        this.router.addRouter('file', [
        	"file:fSharingInitData",
            "file:getFiles",
            "file:setFiles",
            "file:delFiles",
            "file:preDownload",
            "file:continueFiles",
            "file:renameFiles",
            "file:fastUpload",
			"file:resumeUpload",
            "file:breakPFile",
            "file:turnFile",
			"file:toDiskForCenter",
            "file:mailFileSend",
            "disk:delete",
            "disk:rename",
            "disk:getthumbnailimage",
            "disk:thumbnail",
            "disk:addDirectory",
            "disk:turnFile",
            "disk:move",
            "disk:init",
            "disk:createDirectory",
            "disk:getDirectorys",
            "disk:fileList",
			"disk:fileListPage",//分页取数据
            "disk:search", // 新旧版本彩云的搜索接口名称一样
            "disk:download",
            "disk:fastUpload",
            "disk:breakPFile",
            "disk:resumeUpload",
            "disk:normalUpload",
            "disk:setCover",
            "disk:resumeUpload",
            "disk:delDiskDirsAndFiles",
            "disk:shareCopyTo",
			"disk:copyContentCatalog",
            "disk:attachUpload",    //附件存彩云
            "disk:thumbnails", //获取缩略图
            "disk:getDiskAlbumList",
            "disk:getOutLinkList",
            "disk:delOutLink",
            "disk:getOutLink",
            "disk:backupMail", //邮件备份网盘
			"disk:index",
			"disk:isShareSiChuan",
			"file:downLoadInitNew",
			"file:fileBatDownload",
		    "disk:getContentInfosByType",
		    "disk:shareDetail",
            "disk:friendShareList",
            "disk:myShareList",
            "disk:deleteShare",
            "disk:delShare",
            "disk:cancelShare",
            "disk:share",
            "disk:getVirDirInfo",
            "disk:mgtVirDirInfo"
        ]);
        
        this.router.addRouter('billcharge', [
           "mailoffice:getTipsinfo"
        ]);

        this.router.addRouter('note', [
           "mnote:createNote",    //创建一条笔记
           "mnote:getNote",       //获取一条笔记
           "mnote:getNotes",      //获取所有笔记
           "mnote:deleteNote",    //删除笔记
           "mnote:updateNote",    //更新笔记
           "mnote:searchNote",    //搜索笔记
           "mnote:mailsToNote",   //邮件批量存笔记
           "mnote:uploadNote",    //获取附件上传地址
           "mnote:downloadNote",  //获取附件下载地址
           "mnote:thumbnailNote", //获取缩略图地址
           "mnote:nothing"        //ending
        ]);
		
		this.router.addRouter('evernote', [
            "evernote:createbyMnoteId",
            "evernote:oauth",
            "evernote:createOrReplace",
            "evernote:createNote"
        ]);
        
        this.router.addRouter('uec', [
           "uec:list",
           "uec:status",
           "uec:addFeedback"
        ]);
        this.router.addRouter('middleware',[
         // "user:getOnlineFriends"
        ]);

       this.router.addRouter('calendar',[
          "calendar:addLabel",
          "calendar:updateLabel",
          "calendar:deleteLabel",
          "calendar:shareLabel",
          "calendar:deleteLabelShare",
          "calendar:acceptShareLabel",
          "calendar:getUsersOfSharedLabel",
          "calendar:getLabelById",
          "calendar:getLabels",
          "calendar:initCalendar",
          "calendar:addCalendar",
          "calendar:updateCalendar",
          "calendar:delCalendar",
          "calendar:cancelInvitedInfo",
          "calendar:inviteSomeone",
          "calendar:updateInviteStatus",
          "calendar:shareCalendar",
          "calendar:getCalendarView",
          "calendar:getCalendarListView",
          "calendar:getCalendar",
          "calendar:getCalendarCount",
          "calendar:getMessageCount",
          "calendar:activeSyncCalendarList",
          "calendar:getNormalUploadUrl",
          "calendar:getDownloadUrl",
          "calendar:uploadFile",
          "calendar:activeSyncCalendarList",
          "calendar:uploadFile",
          "calendar:addMailCalendar",
          "calendar:updateMailCalendar",
          "calendar:getMailCalendar",
          "calendar:delMailCalendar",
          "calendar:getMessages",
          "calendar:updateBabyInfo",
          "calendar:getBabyInfo",
          "calendar:getLabelShareMessage",
          "calendar:getCalendarInviteMessage",
          "calendar:getCalendarShareMessage",
          "calendar:processShareLabelInfo",
          "calendar:delShareMsg",
          "calendar:acceptCalendarShare",
          "calendar:addBlackWhiteItem",
          "calendar:deBlackWhiteItem",
          "calendar:delBlackWhiteItem",
          "calendar:getBlackWhiteItem",
          "calendar:getBlackWhiteList",
          "calendar:getMessageCount",
          "calendar:getMessageList",
          "calendar:getMessageById",
          "calendar:delMessage",
          "calendar:setLabelUpdateNotify",
          "calendar:setCalendarRemind",
          "calendar:synCaiYun",
		  "calendar:addBirthdayCalendar",
          "calendar:getUserAddrJsonData",
          "calendar:cancelSubscribeLabel",
          "calendar:subscribeLabel",
          "calendar:searchPublicLabel",
          "calendar:setSubLabelUpdateNotify",
          "calendar:listTopLabels",
          "calendar:batchAddCalendar",
          "calendar:getCalendarList", // 获取日历下的所有活动,新增接口
          "calendar:getAllLabelTypes", // 日历广场中获取所有的分类列表
          "calendar:getLabelsByType", // 根据日历分类ID获取分类下的所有日历
          "calendar:copyCalendar", // 将"订阅日历"下的活动添加(复制)到"我的日历"
          "calendar:getPublishedLabelByOper", // 获取单个已发布的日历
          "calendar:getCalendarsByLabel", // 根据日历ID获取订阅日历下的所有活动
          "calendar:shareCalendar", //日历共享
          "calendar:cancelMailCalendars", //批量取消
          "calendar:getGroupCalendarList", //查询群组日历活动列表信息
          "calendar:addGroupLabel", //批量取消          
          "nothing"
        ]);
        //邮箱营业厅
        this.router.addRouter('businessHall', [
          "businessHall:queryDetailDiscountInfo",
          "businessHall:getUserConsumption",
          "businessHall:queryBillInfo",
          "businessHall:queryProductInfo",
          "businesshall:userStateQuery",
          "businesshall:sendSmsAuthCode",
          "businesshall:productOrder",
          "businesshall:queryBusinessInfo",
		  "together:getFetionFriends",
		  "together:sendMailToFetion"
        ]);
    },

    defaults: {
        name: "M139.RichMail.RichMailHttpClient",
        requestDataType: "ObjectToXML",
        responseDataType: "JSON2Object"
    },

    /**
    *继承自M139.ExchangeHttpClient.request方法， 增加了一些参数功能
    *@see M139.ExchangeHttpClient#request
    *@param {Object} options 配置参数
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
        //请求父类的方法
        return M139.ExchangeHttpClient.prototype.request.apply(this, arguments);
    },
    /**@inner*/
    onResponse: function (info) {
        var This = this;
        return M139.ExchangeHttpClient.prototype.onResponse.apply(this, arguments);
    }
});
    /**
    *实例化RichMailHttpClient，然后封装使用的过程，对常用的几个rm接口划分为Level1级别，其它划分为Level2级别
    *@namespace
    *@name M139.RichMail.API
    */
    M139.core.namespace("M139.RichMail.API",
    /**@lends M139.RichMail.API*/
{
    /**
    *读取文件夹列表数据
    *@param {Object} options 请求的参数
    *@param {Number} options.fid
    */
    getFolderList: function (callback) {
        this.call("mbox:getAllFolders", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    /**
    *读取指定文件夹邮件列表
    *@param {Object} options 请求的参数
    *@param {int} options.fid 文件夹ID
    *@param {String} options.order 排序字段，默认值为receiveDate
    *@param {int} options.desc 是否降序排序，默认值为1
    *@param {int} options.pageIndex 第几页 (这里也可以使用start、total字段，但是不推荐)
    *@param {int} options.pageSize 一页取几封邮件
    */
    getMailList: function (options, callback) {
        this.call("mbox:listMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    readMail: function (options, callback) {
        this.call("mbox:readMessage", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },

	/** 获取邮件列表数据
	*   作用：主要是不依赖邮件列表的数据获取
	*/
	getMessageInfo:function(ids,callback){
		var options = {ids:ids};
		this.call("mbox:getMessageInfo", options, function (e) {
	        callback && callback(e.responseData);
	    });
	},

    updateFolders: function (options, callback) {
        this.call("mbox:updateFolders", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    moveMessages: function (options, callback) {
        this.call("mbox:moveMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    deleteFolders: function (options, callback) {
        this.call("mbox:deleteFolders", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    readSessionMail: function (options, callback) {
        this.call("mbox:readSessionMessage", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setFolderPass: function (options, callback) {
        this.call("mbox:setFolderPass", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    getAttrs: function (options, callback) {
        this.call("user:getAttrs", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setAttrs: function (options, callback) {
        this.call("user:setAttrs", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setSessionModel: function (options, callback) {
        this.call("mbox:setSessionModel", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    getWhiteBlackList: function (options, callback) {
        this.call("user:getWhiteBlackList", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setWhiteBlackList: function (options, callback) {
        this.call("user:setWhiteBlackList", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getSignatures: function (callback) {
        this.call("user:getSignatures", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setSignatures: function (options, callback) {
        this.call("user:signatures", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setPOPAccount: function (options, callback) {
        this.call("user:setPOPAccount", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getPOPAccounts: function (options, callback) {
        this.call("user:getPOPAccounts", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    syncPOPAccount: function (options, callback) {
        this.call("user:syncPOPAccount", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    
    setFilter_New: function (options, callback) {
        this.call("user:setFilter_New", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getFilter_New: function (callback) {
		//增加分练规则的开关功能后，需要传递此tmpObj才能返回所有数据
		var tmpObj = {
			filterFlag: 0,
			extContentFlag: 1
		};
        this.call("user:getFilter_New", tmpObj, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setFilter: function (options, callback) {
        this.call("user:setFilter", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getFilter: function (callback) {
        this.call("user:getFilter", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    statMessages: function (options, callback) {
        this.call("user:statMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    filterHistoryMail: function (options, callback) {
        this.call("user:filterHistoryMail", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    call: function (api, data, callback, options) {
        var onfail = function(){};
        var client = new M139.RichMail.RichMailHttpClient(options||{});
        //扩展，造假数据模拟，彩云网盘官方共享用模拟数据上全网 
        if(options && options.mock){
            var client = M139.API.Mock.call({
                "api": api,
                "data" : data,
                "success": callback,
                "error": function(httpStatus, response) {
                    callback(httpStatus, response);
                }
            });
            return;
        }
        client.on("error", function (err) {
            onfail.call(client, err);
        });

        if (options) {
            if ($.isFunction(options)) {
                onfail = options;
                options = false;
            } else if ($.isFunction(options.error)) {
                onfail = options.error
            }
            if ($.isFunction(options.ontimeout)) {
                client.on("timeout", function (err) {
                    options.ontimeout.call(client, err);
                });
            }
        }

        var url = api.indexOf("/") > -1 ? api : client.router.getUrl(api);
        var method = "post";
        if (options && options.method) {
            method = options.method;
        }
        if(options && options.urlParam){
            url += options.urlParam;
        }
        return client.request({
            url: url,
            method: method,
            data: data,
            async: options && options.async,
            headers: options && options.headers,
            timeout: options && options.timeout,
            isSendClientLog: options && options.isSendClientLog
        }, function (e) {
            if (top.$App && top.$App.onHttpClientResponse) {
                top.$App.onHttpClientResponse(client, e);
            }
            if (callback) {
                callback(e);
            }
        });

    }
});

    $RM = M139.RichMail.API;
})(M139);

﻿/**
* @fileOverview 定时器作用非常大，但是滥用会造成性能问题，此模块封装与setInterval相关使用的问题
该模块还需要重构
timing调用参数太简单，应该可以定制运行几次，什么时候自动清除等
*/

(function () {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Timing
    */
    M139.Timing =
    /**@lends M139.Timing */
    {
        /**
        *等待，当Boolean(eval(query))返回true的时候，执行回调
        */
        waitForReady: function (query, callback) {
            var tryTimes = 0;
            var done = false;
            checkReady();
            if (!done) {
                var intervalId = this.setInterval("M139.Timing.waitForReady", checkReady, 300);
            }
            var self = this;
            function checkReady() {
                tryTimes++;
                try {
                    if($.isFunction(query)){
                        var result = query();
                    }else{
                        var result = eval(query);
                    }
                    if (result) {
                        done = true;
                        if (intervalId) {
                            self.clearInterval(intervalId);
                        }
                    }
                } catch (e) {}
                //对象尚不可用
                if (done || tryTimes > 100) {
                    if (intervalId) self.clearInterval(intervalId);
                    if (callback) {
                        callback();
                    }
                }
                //console.log(new Date().format("hh:mm:ss") + ";waitForReady:" + done + ",query:" + query);
            }
        },
        /**
        请使用 M139.Iframe.checkIframeHealth(options);
        */
        makeSureIframeReady: function (options) {
            return M139.Iframe.checkIframeHealth(options);
        },

        /**
        *在一些浏览器中，隐藏掉的元素滚动条会被重置，在读信、邮件列表的时候需要让元素保持滚动条的位置
        */
        watchElementScroll: function (dom) {
            //IE8以下没必要
            if ($.browser.msie && $.browser.version < 8) return;
            dom.lastScrollTop = dom.scrollTop;
            var hasHidden = false;
            var timer = this.setInterval("M139.Timing.watchElementScroll", function () {
                if (isRemove(dom)) {
                    M139.Timing.clearInterval(timer); //如果元素已被移除，则取消监控
                    return;
                }
                if (isShow(dom)) {
                    if (hasHidden) {
                        //重置高度
                        dom.scrollTop = dom.lastScrollTop;
                        hasHidden = false;
                    } else {
                        //记住当前滚动位置
                        dom.lastScrollTop = dom.scrollTop;
                    }
                } else {
                    hasHidden = true; //元素被隐藏过了
                }
            }, 500);
            function isShow(dom) {
                while (dom) {
                    if (dom.style && dom.style.display == "none") return false;
                    dom = dom.parentNode;
                }
                return true;
            }
            function isRemove(dom) {
                try {
                    while (dom) {
                        if (dom.tagName == "BODY") return false;
                        dom = dom.parentNode;
                    }
                } catch (e) {
                    return true;
                }
                return true;
            }
        },

        /**
        *设置iframe根据页面中的高度自动变高
        */
        watchIframeHeight: function (iframe,settime,isHideQuote) {
            //console.log(settime);
            var setTime = settime || 1000;
            var count = 0;
			var reduceHeight = isHideQuote ? 40 : 0;
			if(reduceHeight && ( ($B.is.ie && $B.getVersion() == 8) || $B.is.firefox )){
				reduceHeight = 30;
				setTime = 10;
			}
			
            var timer = this.setInterval(
                "M139.Timing.watchIframeHeight",
                function () {
                    if ($D.isRemove(iframe)) {
                        clear();
                    } else {
                        if ($D.isHide(iframe)) return;
                        checkResize();
                        count++;
                        if (count == 2) {
                            jQuery("img", iframe.contentWindow.document).bind("load", function () {
                                $(this).unbind("load", arguments.callee);
                                checkResize();
                            });
                            clear();//2次之后不再触发，只由图片加载触发
                        }
                    }
                },
                setTime
            );
            function checkResize(){
                var frmDoc = iframe.contentWindow.document;
                var frmBody = frmDoc.body;
                //console.log("frmBody.scrollHeight:" + frmBody.scrollHeight + ",iframe.offsetHeight:" + iframe.offsetHeight);
                if (frmBody.scrollHeight > iframe.offsetHeight) {
                    iframe.style.height = (frmBody.scrollHeight + 35 - reduceHeight).toString() + "px";
                    //frmBody.style.overflowX = "hidden";
                    if ($.browser.msie && $.browser.version < 7.0) {
                        //frmDoc.getElementsByTagName("html")[0].style.overflowX = "hidden";
                    }
                }
            }
            function clear() {
                M139.Timing.clearInterval(timer);
            }
        },
        /**监听文本框内容变化*/
        watchInputChange:function(input,callback,options){
            var oldValue = input.value;
            var timer = this.setInterval(
                "M139.Timing.watchInputChange",
                check,
                1000);
            function clear() {
                M139.Timing.clearInterval(timer);
            }
            $(input).keydown(check).keyup(check);;
            function check(e) {
                if (input.value !== oldValue) {
                    oldValue = input.value;
                    if ($.isFunction(callback)) callback.call(input, e);
                }
            }
        },

        /**
        *取代原生setInterval的使用，使同一类的func可以共享一个计时器，对于大量制造setInterval的业务可以使用，其它情况下不建议使用
        *name相同的timer将会共享一个setInterval,由于添加的时机不同，所以第一次执行func的时间不固定，但是总的周期是固定的
        *回调func的时候会使用try{}catch(e){} 因此不会产生异常
        */
        setInterval: function (name, func, interval) {
            var timer = this.timerMap[name];

            if (!timer) {
                timer = this.timerMap[name] = new M139.Timing.Timer(name, interval);
            }
            var id = timer.addHandler(func);
            return id;
        },
        clearInterval: function (id) {
            if (!id) return;
            var name = id.split("_")[0];
            var timer = this.timerMap[name];
            if (timer) {
                timer.removeHandler(id);
            }
        },
        /**
        *timer托管列表
        *@inner
        */
        timerMap: {}
    }
    /**
    *timer对象类
    *@inner
    */
    M139.Timing.Timer = function (name, interval) {
        this.name = name;
        this.interval = interval;
        var list = {};
        this.addHandler = function (func) {
            var id = name + "_" + Math.random();
            list[id] = func;
            return id;
        }
        this.removeHandler = function (id) {
            delete list[id];
        }
        this.timerId = setInterval(function () {
            for (var p in list) {
                try {
                    list[p]();
                } catch (e) { }
            }
        }, interval);
    }
    $Timing = M139.Timing;
})();
﻿/**
 * @fileOverview 定义ViewBase基类.
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**
   *@namespace
   */
    M139.View = {};

    M139.View.ViewBase = Backbone.View.extend(
    /**
    *@lends M139.View.ViewBase.prototype
    */
    {
        /**
        *所有View的基类,主要为了统一常用事件、方法的命名
        *@constructs M139.View.ViewBase
        *@require M139.Dom
        *@require M139.Logger
        *@param {Object} options 参数集合
        *@param {Object} options.events 是一个{key:function}集合，监听自定义事件
        *@param {String} options.hides 表示要隐藏的节点路径
        *@param {Object} options.replaceInnerText 是一个{key:function}集合，表示要替换的节点路径以及对应文本
        *@param {Object} options.replaceInnerHTML 是一个{key:function}集合，表示要替换的节点路径以及对应html
        *@example
        var view = new M139.View.ViewBase({
            events:{
                hide:function(){
                    alert("I'm on hide！");
                }
            }
        });
        */
        initialize: function (options) {
            if (!options) {
                options = {};
            }

            //监听事件
            if (options.events) {
                for (var e in options.events) {
                    this.on(e, options.events[e]);
                }
            }
            //设置初始化样式
            var style = options.style || this.style;
            if (style && this.el) {
                if (jQuery.browser.msie) {
                    this.el.style.cssText = style;
                } else {
                    this.$el.attr("style", style);
                }
            }

            if (options.width) {
                this.$el.width(options.width);
            }
            if (options.height) {
                this.$el.height(options.height);
            }

            /**
             *关联一个日志对象，日志的name关联此类的name，一般只在继承类里使用
             *@field
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({
                name: options.name || this.name
            });

            if (!this.id && !(this.el && this.el.id)) {
                this.id = this.getRandomId();
                if (this.el) {
                    this.el.id = this.id;
                }
            }

            M139.View.registerView(this.id, this);
        },

        name: "M139.View.ViewBase",

        /**
        *生成view的dom节点，具体由子类去实现，同时触发remove事件
        */
        render: function () {
            var This = this;

            if(this.rendered){
                return this;
            }

            this.rendered = true;

            var options = this.options;

            //要替换的innerText的节点
            if (options.replaceInnerText) {
                $.each(options.replaceInnerText, function (path, innerText) {
                    This.$(path).text(innerText);
                });
            }

            //要替换的innerHTML的节点
            if (options.replaceInnerHTML) {
                $.each(options.replaceInnerHTML, function (path, innerHTML) {
                    This.$(path).html(innerHTML);
                });
            }

            //要隐藏的节点
            if (options.hides) {
                this.$(options.hides).hide();
            }
            //要隐藏的节点
            if (options.shows) {
                this.$(options.shows).css("display", "");
            }

            /**
            *容器dom生成
            *@event 
            *@name M139.View.ViewBase#render
            */
            this.trigger("render");
            /**
            *假设对象调用render函数后随即添加到dom中，在下一个时间片触发print
            *@event 
            *@name M139.View.ViewBase#print
            */
            setTimeout(function () {
                This.trigger("print");
            }, 0);
            return this;
        },

        /**
        *移除view的dom，即：this.$el.remove()，同时触发remove事件
        */
        remove: function () {
            this.$el.remove();
            /**
             *表示view是否已被移除
             *@field
             *@type {Boolean}
             */
            this.isRemoved = true;
            /**
            *View容器被移除后产生的事件
            *@event 
            *@name M139.View.ViewBase#remove
            */
            this.trigger("remove");
            return this;
        },

        /**
        *显示view的dom，即：this.$el.show()，同时触发show事件
        */
        show: function () {
            this.$el.show();
            /**
            *调用show方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#show
            */
            this.trigger("show");
            return this;
        },

        /**
        *隐藏view的dom，即：this.$el.hide()，同时触发hide事件
        */
        hide: function () {
            this.$el.hide();
            /**
            *调用hide方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#hide
            */
            this.trigger("hide");
            return this;
        },

        /**
        *判断view是否隐藏掉了，即display:none
        *@param {Boolean} bubblingParent 此参数为true的话则判断节点所在父元素是否可见
        */
        isHide: function (bubblingParent) {
            return $D.isHide(this.el, bubblingParent);
        },

        /**
        *获得view的el的高度，即：this.$el.height()
        */
        getHeight: function () {
            return this.$el ? this.$el.height() : 0;
        },

        /**
        *获得view的el的宽度，即：this.$el.width()
        */
        getWidth: function () {
            return this.$el ? this.$el.width() : 0;
        },

        /**
        *设置view的el的宽度，即：this.$el.width(width)，同时触发resize事件
        */
        setWidth: function (width) {
            return this.setSize(width, null);
        },

        /**
        *设置view的el的高度，即：this.$el.height(height)，同时触发resize事件
        */
        setHeight: function (height) {
            return this.setSize(null, height);
        },

        /**
        *设置view的el的坐标，即left和top，同时触发move事件
        */
        setPosition: function (left, top) {
            if (this.$el) {
                this.$el.css({
                    left: left,
                    top: top
                });
                /**
                *调用setPosition方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#move
                */
                this.trigger("move");
            }
            return this;
        },

        /**
        *设置view的el的宽高，同时触发resize事件
        */
        setSize: function (width, height) {
            if (this.$el) {
                if (width || width === 0) {
                    this.$el.width(width);
                }
                if (height || height === 0) {
                    this.$el.height(height);
                }
                /**
                *调用setSize方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#resize
                */
                this.trigger("resize");
            }
            return this;
        },

        /**
        *希望子类在修改html内容的时候主动调用，会触发update事件
        */
        onUpdate: function () {
            /**
            *html内容变更后产生的事件
            *@event 
            *@name M139.View.ViewBase#update
            */
            this.trigger("update");
        },

        /**
        *获得view的容器dom对象
        */
        getEl: function () {
            return this.el;
        },

        /**
        *获得view的容器dom jq对象
        */
        get$El: function () {
            return this.$el;
        },

        /**
        *获得view的id
        */
        getId: function () {
            return this.el.id;
        },

        /**
        *随机产生一个view id
        */
        getRandomId: function () {
            return "view_" + Math.random();
        },

        /**
        *设置el的innerHTML内容,同时触发update事件
        */
        setHtml: function (html) {
            if (this.el) {
                this.el.innerHTML = html;
                this.onUpdate();
            }
        }

    });
    //扩展静态函数
    $.extend(M139.View,
    /**@lends M139.View*/
    {
        /**
        *根据view的id返回一个view的引用，常用于内联html
        *@param {String} id 继承自M139.View.ViewBase的对象的id
        *@example
        var html = "&lt;input value=\"按钮\" onclick=\"M139.View.getView('{id}').doSomething()\" /&gt;";
        */
        getView: function (id) {
            return this.AllViews[id] || null;
        },

        /**
        *全局的View容器，以后可能用Backbone容器替代
        */
        AllViews: {},

        /**
        *使用id注册全局View，便于在全局作用域调用
        *@param {String} id  继承自M139.View.ViewBase的对象的id
        *@param {M139.View.ViewBase} view 继承自M139.View.ViewBase的对象
        */
        registerView: function (id, view) {
            this.AllViews[id] = view;
        }
    });

})(jQuery, M139);
﻿/**
 * @fileOverview 定义ViewBase基类.
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**
   *@namespace
   */
    M139.View = {};

    M139.View.ViewBase = Backbone.View.extend(
    /**
    *@lends M139.View.ViewBase.prototype
    */
    {
        /**
        *所有View的基类,主要为了统一常用事件、方法的命名
        *@constructs M139.View.ViewBase
        *@require M139.Dom
        *@require M139.Logger
        *@param {Object} options 参数集合
        *@param {Object} options.events 是一个{key:function}集合，监听自定义事件
        *@param {String} options.hides 表示要隐藏的节点路径
        *@param {Object} options.replaceInnerText 是一个{key:function}集合，表示要替换的节点路径以及对应文本
        *@param {Object} options.replaceInnerHTML 是一个{key:function}集合，表示要替换的节点路径以及对应html
        *@example
        var view = new M139.View.ViewBase({
            events:{
                hide:function(){
                    alert("I'm on hide！");
                }
            }
        });
        */
        initialize: function (options) {
            if (!options) {
                options = {};
            }

            //监听事件
            if (options.events) {
                for (var e in options.events) {
                    this.on(e, options.events[e]);
                }
            }
            //设置初始化样式
            var style = options.style || this.style;
            if (style && this.el) {
                if (jQuery.browser.msie) {
                    this.el.style.cssText = style;
                } else {
                    this.$el.attr("style", style);
                }
            }

            if (options.width) {
                this.$el.width(options.width);
            }
            if (options.height) {
                this.$el.height(options.height);
            }

            /**
             *关联一个日志对象，日志的name关联此类的name，一般只在继承类里使用
             *@field
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({
                name: options.name || this.name
            });

            if (!this.id && !(this.el && this.el.id)) {
                this.id = this.getRandomId();
                if (this.el) {
                    this.el.id = this.id;
                }
            }

            M139.View.registerView(this.id, this);
        },

        name: "M139.View.ViewBase",

        /**
        *生成view的dom节点，具体由子类去实现，同时触发remove事件
        */
        render: function () {
            var This = this;

            if(this.rendered){
                return this;
            }

            this.rendered = true;

            var options = this.options;

            //要替换的innerText的节点
            if (options.replaceInnerText) {
                $.each(options.replaceInnerText, function (path, innerText) {
                    This.$(path).text(innerText);
                });
            }

            //要替换的innerHTML的节点
            if (options.replaceInnerHTML) {
                $.each(options.replaceInnerHTML, function (path, innerHTML) {
                    This.$(path).html(innerHTML);
                });
            }

            //要隐藏的节点
            if (options.hides) {
                this.$(options.hides).hide();
            }
            //要隐藏的节点
            if (options.shows) {
                this.$(options.shows).css("display", "");
            }

            /**
            *容器dom生成
            *@event 
            *@name M139.View.ViewBase#render
            */
            this.trigger("render");
            /**
            *假设对象调用render函数后随即添加到dom中，在下一个时间片触发print
            *@event 
            *@name M139.View.ViewBase#print
            */
            setTimeout(function () {
                This.trigger("print");
            }, 0);
            return this;
        },

        /**
        *移除view的dom，即：this.$el.remove()，同时触发remove事件
        */
        remove: function () {
            this.$el.remove();
            /**
             *表示view是否已被移除
             *@field
             *@type {Boolean}
             */
            this.isRemoved = true;
            /**
            *View容器被移除后产生的事件
            *@event 
            *@name M139.View.ViewBase#remove
            */
            this.trigger("remove");
            return this;
        },

        /**
        *显示view的dom，即：this.$el.show()，同时触发show事件
        */
        show: function () {
            this.$el.show();
            /**
            *调用show方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#show
            */
            this.trigger("show");
            return this;
        },

        /**
        *隐藏view的dom，即：this.$el.hide()，同时触发hide事件
        */
        hide: function () {
            this.$el.hide();
            /**
            *调用hide方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#hide
            */
            this.trigger("hide");
            return this;
        },

        /**
        *判断view是否隐藏掉了，即display:none
        *@param {Boolean} bubblingParent 此参数为true的话则判断节点所在父元素是否可见
        */
        isHide: function (bubblingParent) {
            return $D.isHide(this.el, bubblingParent);
        },

        /**
        *获得view的el的高度，即：this.$el.height()
        */
        getHeight: function () {
            return this.$el ? this.$el.height() : 0;
        },

        /**
        *获得view的el的宽度，即：this.$el.width()
        */
        getWidth: function () {
            return this.$el ? this.$el.width() : 0;
        },

        /**
        *设置view的el的宽度，即：this.$el.width(width)，同时触发resize事件
        */
        setWidth: function (width) {
            return this.setSize(width, null);
        },

        /**
        *设置view的el的高度，即：this.$el.height(height)，同时触发resize事件
        */
        setHeight: function (height) {
            return this.setSize(null, height);
        },

        /**
        *设置view的el的坐标，即left和top，同时触发move事件
        */
        setPosition: function (left, top) {
            if (this.$el) {
                this.$el.css({
                    left: left,
                    top: top
                });
                /**
                *调用setPosition方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#move
                */
                this.trigger("move");
            }
            return this;
        },

        /**
        *设置view的el的宽高，同时触发resize事件
        */
        setSize: function (width, height) {
            if (this.$el) {
                if (width || width === 0) {
                    this.$el.width(width);
                }
                if (height || height === 0) {
                    this.$el.height(height);
                }
                /**
                *调用setSize方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#resize
                */
                this.trigger("resize");
            }
            return this;
        },

        /**
        *希望子类在修改html内容的时候主动调用，会触发update事件
        */
        onUpdate: function () {
            /**
            *html内容变更后产生的事件
            *@event 
            *@name M139.View.ViewBase#update
            */
            this.trigger("update");
        },

        /**
        *获得view的容器dom对象
        */
        getEl: function () {
            return this.el;
        },

        /**
        *获得view的容器dom jq对象
        */
        get$El: function () {
            return this.$el;
        },

        /**
        *获得view的id
        */
        getId: function () {
            return this.el.id;
        },

        /**
        *随机产生一个view id
        */
        getRandomId: function () {
            return "view_" + Math.random();
        },

        /**
        *设置el的innerHTML内容,同时触发update事件
        */
        setHtml: function (html) {
            if (this.el) {
                this.el.innerHTML = html;
                this.onUpdate();
            }
        }

    });
    //扩展静态函数
    $.extend(M139.View,
    /**@lends M139.View*/
    {
        /**
        *根据view的id返回一个view的引用，常用于内联html
        *@param {String} id 继承自M139.View.ViewBase的对象的id
        *@example
        var html = "&lt;input value=\"按钮\" onclick=\"M139.View.getView('{id}').doSomething()\" /&gt;";
        */
        getView: function (id) {
            return this.AllViews[id] || null;
        },

        /**
        *全局的View容器，以后可能用Backbone容器替代
        */
        AllViews: {},

        /**
        *使用id注册全局View，便于在全局作用域调用
        *@param {String} id  继承自M139.View.ViewBase的对象的id
        *@param {M139.View.ViewBase} view 继承自M139.View.ViewBase的对象
        */
        registerView: function (id, view) {
            this.AllViews[id] = view;
        }
    });

})(jQuery, M139);
﻿/**
 * @fileOverview 向下兼容，老版本的一些配置变量的读写
 *包括UserData、FF、Utils
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var win;
    var vm = M139.namespace("M2012.MatrixVM", Backbone.Model.extend(
     /**
        *@lends M2012.MatrixVM.prototype
        */
    {
        /** 封装向下兼容对象实例，比如：UserData、FF、Utils等对象，使一些老的代码可以正常工作
        *@constructs M2012.MatrixVM
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize: function (options) {
            options = options || {};
            win = options.window || window;
        },
        start: function () {//运行入口
            this.createRequestByScript();
            this.createFloatingFrame();
            this.createPathConfig();
            this.createUtils();
            this.createLoadScript();
            this.createUserData();
            this.createGlobalVariable();
            this.createLinksShow();
            this.createModuleManager();
            this.createMailTool();
            this.createWaitPanel();
            this.createValidate();
            
        },

        /**创建老版本的FloatingFrame对象*/
        createFloatingFrame: function () {
            win.FF = window.FloatingFrame = FF;
            return FF;
        },
        /*创建resourcePath,siteConfig中的路径配置*/
        createPathConfig:function(){
            win.rmResourcePath = (top.getDomain("resource") || "") + "/rm/richmail";
            win.resourcePath = win.rmResourcePath.replace("richmail", "coremail");

            win.SiteConfig.ucDomain = getDomain("webmail");
            win.ucDomain = getDomain("webmail");
            win.SiteConfig.smsMiddleware = getDomain("rebuildDomain") + "/sms/";
            win.SiteConfig.mmsMiddleware = getDomain("rebuildDomain") + "/mms/";
            win.SiteConfig.largeAttachRebuildUrl = getDomain("rebuildDomain") + "/disk/";
            win.SiteConfig.disk = getDomain("rebuildDomain") + "/disk/netdisk";
            
            
        },
        createUtils:function(){
            //loadScript("m2011.utilscontrols.pack.js");
            
            win.Utils = {
                PageisTimeOut: function () {
                    return false;
                },
                waitForReady: function (query, callback) {
                    return M139.Timing.waitForReady(query, callback);
                },
                loadSkinCss: function (path, doc, prefix, dir) {
                    var version = "", skinFolder= "css", alt = "/";

                    //获取2.0皮肤映射的1.0值,给内嵌的老页面用
                    path = (top.$User.getSkinNameMatrix && top.$User.getSkinNameMatrix()) || 'skin_shibo';

                    if (/new_/.test(path)) {
                        skinFolder = "theme" + alt + path.match(/skin_(\w+)$/)[1];
                        path = path.replace("new_", "");
                    }

                    if (prefix) {
                        path = path.replace("skin", prefix + "_skin");
                    }

                    if (!doc) {
                        doc = document;
                    }

                    //加清皮肤样式缓存的版本号
                    if (top.SiteConfig && top.SiteConfig.skinCSSCacheVersion) {
                        version = "?v=" + top.SiteConfig.skinCSSCacheVersion;
                    }

                    var linkHref = top.rmResourcePath + alt + skinFolder + alt + path + ".css" + version;
                    if (dir) {
                        linkHref = dir + path + ".css" + version;
                    }

                    var links = doc.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        var l = links[i];

                        if (!l.href) {
                            l.href = linkHref + version;
                            return;
                        }
                    }
                },
                queryString: function (param, url) {
                    return $Url.queryString(param, url);
                },
                queryStringNon: function(param, url) {
                    for(var url = url || location.search, url = url.split(/&|\?/), e = null, c = 0; c < url.length; c++) {
                    var g = url[c].split("=");
                    if(g[0] == param) {
                    e = g[1];
                    break;
                     }
                     }
                     return e;
                },
                openControlDownload : function(removeUploadproxy) {
                    //var win = window.open(getDomain("webmail") + "/LargeAttachments/html/control139.htm");
                    //setTimeout(function() { win.focus(); }, 0);
                    top.$App.show("smallTool");
					//top.addBehavior("文件快递-客户端下载");
                },

                UI: {
                    selectSender: function (id, isAddPop, doc) {
                        var from = $Url.queryString("from");
                        if (typeof (doc) == "undefined")
                            doc = document;

                        if (typeof (isAddPop) == "undefined")
                            isAddPop = false;

                        var selFrom = doc.getElementById(id);
                        UserData = window.top.UserData;
                        var mailAccount = top.$User.getDefaultSender();

                        var trueName = top.$User.getTrueName();
                        var arr = top.$User.getAccountListArray();
                        if(mailAccount)addItem(mailAccount);
                        for (var i = 0; i < arr.length; i++) {
                            var mail = arr[i];
                            if (mailAccount != mail) addItem(mail);
                        }

                        //添加代收账号地址  
                        if (isAddPop) {
                            $(top.$App.getPopList()).each(function () {
                                for (var i = 0; i < selFrom.options.length; i++) {
                                    if (this == selFrom[i].value) return;
                                }
                                addItem(this.email);
                            })
                        }
                        selFrom.options.add(new Option("发信设置", "0"));

                        //发件人地址下拉框切换事件
                        var selFromOnChange = function (id) {
                            var selFrom = doc.getElementById(id);
                            if (selFrom.value == "0") {
                                selFrom[0].selected = true;
                                top.$App.show("account");
                                top.addBehavior("写信页_别名设置");
                            }
                            selFrom = null;
                        }

                        selFrom.onchange = function () { selFromOnChange(id) };

                        function addItem(addr) {
                            addr = addr.trim();
                            var text = trueName ? '"{0}"<{1}>'.format(trueName.replace(/"|\\/g, ""), addr) : addr; //发件人姓名替换双引号和末尾的斜杠
                            var item = new Option(text, addr);
                            selFrom.options.add(item);
                            item.innerHTML = item.innerHTML.replace(/\&amp\;#/ig, "&#");
                            if (item.value == from) item.selected = true;
                        }

                    }
                },
                parseSingleEmail: function (text) {
                    text = text.trim();
                    var result = {};
                    var reg = /^([\s\S]*?)<([^>]+)>$/;
                    if (text.indexOf("<") == -1) {
                        result.addr = text;
                        result.name = text.split("@")[0];
                        result.all = text;
                    } else {
                        var match = text.match(reg);
                        if (match) {
                            result.name = match[1].trim().replace(/^"|"$/g, "");
                            result.addr = match[2];
                            //姓名特殊处理,某些客户端发信,姓名会多带一些引号或斜杠
                            result.name = result.name.replace(/\\["']/g, "").replace(/^["']+|["']+$/g, "");
                            result.all = "\"" + result.name.replace(/"/g, "") + "\"<" + result.addr + ">";
                        } else {
                            result.addr = text;
                            result.name = text;
                            result.all = text;
                        }
                    }
                    if (result.addr) {
                        result.addr = result.addr.encode();
                    }
                    return result;

                },
                parseEmail : function (text){
				    var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
				    var regName=/^"([^"]+)"|^([^<]+)</;
				    var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
				    var matches=text.match(reg);
				    var result=[];
				    if(matches){
				        for(var i=0,len=matches.length;i<len;i++){
				            var item={};
				            item.all=matches[i];
				            var m=matches[i].match(regName);
				            if(m)item.name=m[1];
				            m=matches[i].match(regAddr);
				            if(m)item.addr=m[1];
				            if(item.addr){
				                item.account=item.addr.split("@")[0];
				                item.domain=item.addr.split("@")[1];
				                if(!item.name)item.name=item.account;
				                result.push(item);
				            }
				        }
				    }
				    return result;
				}
            };
            win.getXmlDoc = function (xml) {
                return M139.Text.Xml.parseXML(xml);
            }
            //解析xml报文 通讯录用到
            win.xml2json = function(xmlNode,xml2jsonConfig){
                if(typeof xmlNode =="string"){
                    try{
                        var xmldom=getXmlDoc(xmlNode);
                        xmlNode=xmldom.documentElement;
                    } catch (ex) {
                    }
                }
                var config=xml2jsonConfig[xmlNode.tagName];
                if(!config){
                    return document.all?xmlNode.text:xmlNode.textContent;
                }else if(config.type=="simple"){
                    return xml2json_SimpleObject(xmlNode);
                }else if(config.type=="rich"){
                    return xml2json_RichObject(xmlNode,config);
                }else if(config.type=="array"){
                    return xml2json_Array(xmlNode);
                }else{
                    return null;
                }
                function xml2json_RichObject(xmlNode,config){
                    var result={};
                    var arrayElement=config.arrayElement;
                    if(arrayElement){
                        var arrayList=result[arrayElement]=[];
                    }
                    for(var i=0,childs=xmlNode.childNodes,len=childs.length;i<len;i++){
                        var child=childs[i];
                        if(child.nodeType==1){
                            if(child.tagName==config.arrayElement){
                                arrayList.push(xml2json(child,xml2jsonConfig));
                            }else{
                                result[child.tagName]=xml2json(child,xml2jsonConfig);
                            }
                        }
                    }
                    return result;
                }
                function xml2json_SimpleObject(xmlNode){
                    var result={};
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result[child.tagName]=document.all?child.text:child.textContent;
                        }
                    }
                    return result;
                }
                function xml2json_Array(xmlNode){
                    var result=[];
                    for(var i=0,children=xmlNode.childNodes,len=children.length;i<len;i++){
                        var child=children[i];
                        if(child.nodeType==1){
                            result.push(xml2json(child,xml2jsonConfig));
                        }
                    }
                    return result;
                }
            }
            win.json2xml = function(obj) {
                var list = [];
                for (var p in obj) {
                    list.push("<");
                    list.push(p);
                    list.push(">");
                    list.push(encodeXML(obj[p]));
                    list.push("</");
                    list.push(p);
                    list.push(">");
                }
                return list.join("");
            }
            if (!String.format) {
                String.format = function (template,param) {
                    return M139.Text.Utils.format(template, param);
                }
            }
        },
        createLoadScript:function(){
            win.loadScriptM2011=function(key, _doc, charset, root) {
                var path = null;
                var scriptList = [
                    { "name": "jquery.js", "version": "20120302" },
                    { "name": "utils_controls.js", "version": "20121229" },
                    { "name": "framework.js", "version": "20121221" },
                    { "name": "common_option.js", "version": "20121123" },
                    { "name": "utils.js", "version": "20120302" },
                    { "name": "compose_2010_pack.js", "version": "20121227" },
                    { "name": "folderview.js", "version": "20121122" },
                    { "name": "welcome.js", "version": "20130104" }
                ];
                for (var i = 0; i < scriptList.length; i++) {
                    if (scriptList[i]["name"] == key) {
                        path = top.rmResourcePath + "/js/" + key + "?v=" + scriptList[i]["version"];
                        break;
                    }
                }
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                if (path == null) {
                    var _root = root || "/rm/richmail/js/";
                    path = getResourceHost() + _root + key;
                }

                if (path.indexOf("utils_controls.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", _doc, charset);
                } else if (path.indexOf("AddressBook.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.AddressBook.js", _doc);
                } else if (path.indexOf("RichInputBox.js") > -1) {
                    return top.loadScript(getResourceHost() + "/m2012/js/matrixvm/page/m2011.page.RichInputBox.js", _doc);
                }

                (_doc || document).write("<script charset=\"" + (charset || "gb2312") + "\" type=\"text/javascript\" src=\"" + path + "\"></" + "script>");
            }
            win.loadScripts = function (arr, _doc) {
                
                    for (var i = 0; i < arr.length; i++) {
                        win.loadScriptM2011(arr[i], _doc);
                    }
                
            }
            win.loadRes = function (w) {
                if (!w || !w.RES_FILES) return;
                function getResourceHost() {
                    return rmResourcePath.match(/^(http:\/\/)?([^\/]+)/i)[0];
                }
                var resList = w.RES_FILES;
                for (var i = 0; i < resList.length; i++) {
                    if (resList[i].js) {
                        var path = resList[i].js;
                        if (path.indexOf("utils_controls.js") > -1) {
                            top.loadScript(getResourceHost() + "/m2012/js/packs/m2011.utilscontrols.pack.js", w.document);
                        } else if (path.indexOf("jquery.js") > -1) { //群邮件继续使用旧版jquery，避免兼容问题
                            top.loadScript(rmResourcePath + "/js/jquery.js", w.document);
                        } else { //偷梁换柱，群邮件js文件映射到新版目录
                            path = path.replace("/groupmail/js/", "/groupmail/m2011.groupmail.");
                            top.loadScript(path.replace("/$base$", m2012ResourceDomain + "/m2012/js/service"), w.document, resList[i].charset || "gb2312");
                            //top.loadScript(path.replace("/$base$", getResourceHost() + "/rm"), w.document, resList[i].charset || "gb2312");
                        }
                    } else if (resList[i].css) {
                        var path = resList[i].css;
                        top.loadCSS(path.replace("/$base$", getResourceHost() + "/rm"),w.document);
                    }
                }
                if(w.location.href && w.location.href.indexOf('ComposeGroupmail') > -1){
                	// add by tkh 群邮件引入大附件model层m2012.ui.largeattach.model.js
	                try{
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/underscore.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/lib/backbone.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/packs/m139.core.pack.js', w.document, "uft-8");
		                top.loadScript(m2012ResourceDomain+'/m2012/js/ui/largeattach/m2012.ui.largeattach.model.js', w.document, "uft-8");
	                } catch (e) { }
                }
                w.RES_FILES = null;//清理
            }
        },
        createGlobalVariable: function () {
            var _this = this;
            win.coremailDomain = $App.getMailDomain();
            win.addrDomain = "/addrsvr";
            win.mailDomain = $App.getMailDomain();
            win.isRichmail = true;
            win.stylePath = "/m";
            win.wmsvrPath = "/s";
            win.wmsvrPath2 = "http://" + location.host + "/RmWeb";

            win.Main = {
                closeCurrentModule: function () {
                    $App.closeTab();
                }
            }
            win.Main.setReplyMMSData = function ($){
                if($){
                    top["replyMMSData"]={content:"string"==typeof $.content&&$.content||"",receivers:_.isArray($.receivers)&&$.receivers||[],subject:"string"==typeof $.subject&&$.subject||""};
                }
            }

            /*win.Utils={
                UI:{
                    selectSender: function () {
                        return "发件人";
                    }
                }
            }
            */
            win.behaviorClick = function (target, window) {
                top.M139.Logger.behaviorClick(target, window);
            }
            win.addBehavior = function (behaviorKey, thingId) {
                top.M139.Logger.logBehavior({
                    key: behaviorKey,
                    thingId: thingId
                });
            }
            win.addBehaviorExt = function (param) {
                if (param && param.actionId) {
                    top.M139.Logger.logBehavior({
                        thingId: param.thingId || 0,
                        actionId: param.actionId,
                        moduleId: param.moduleId || 0,
                        actionType: param.actionType,
                        pageId: 24
                    });
                }
            }
            win.ScriptErrorLog = function () {

            }
            win.MailTool = {
                getAccount: function (email) {
                    return $Email.getAccount(email);
                },
                getAddr: function (email) {
                    return $Email.getEmail(email);
                }
            }
            win.encodeXML = function (text) {
                return $Xml.encode(text);
            }
            win.FilePreview = {
                isRelease: function () { return true; },
                checkFile: function (fileName, fileSize) {
                    if (fileSize && fileSize > 1024 * 1024 * 20) {
                        return -1;
                    }
                    //var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|)$/i;
                    var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|)$/i; //临时屏蔽html文件的预览功能
                    var reg2 = /\.(?:rar|zip|7z)$/i;
                    if (reg.test(fileName)) {
                        return 1;
                    } else if (reg2.test(fileName)) {
                        return 2;
                    } else {
                        return -1;
                    }
                },
                getUrl: function (p) {
                    var previewUrl = "/m2012/html/onlinepreview/online_preview.html?fi={fileName}&mo={uid}&dl={downloadUrl}&sid={sid}&id={contextId}&rnd={rnd}&src={type}";
                    previewUrl += "&skin={skin}";
                    previewUrl += "&resourcePath={resourcePath}";
                    previewUrl += "&diskservice={diskService}";
                    previewUrl += "&filesize={fileSize}";
                    previewUrl += "&disk={disk}";
                    previewUrl = $T.Utils.format(previewUrl, {
                        uid: top.M139.Text.Mobile.remove86(top.uid),
                        sid: top.UserData.ssoSid,
                        rnd: Math.random(),
                        skin: window.top.UserConfig.skinPath,
                        resourcePath: encodeURIComponent(top.rmResourcePath),
                        diskService: encodeURIComponent(top.SiteConfig.diskInterface),
                        type: p.type || "",
                        fileName: encodeURIComponent(p.fileName),
                        downloadUrl: encodeURIComponent(p.downloadUrl),
                        contextId: p.contextId || "",
                        fileSize: p.fileSize || "",
                        disk: top.SiteConfig.disk
                    });
                    return previewUrl;

                }
            }; 
            win.GetDiskArgs=function() {
                return top.diskSelectorArgs;
            }
            win.OpenDisk=function(args) {
                //{sid:””, businessWindow:window, callback :function(){}, restype :1, selectMode :0, width :500,height:500}
                if (!args) { args = {}; }
                top.diskSelectorArgs = args;

                var url = SiteConfig["disk"] + "/html/selectdisk.html?sid=" + $App.getSid() + "&restype=" + (args.restype ? args.restype : 1);

                top.FF.open("彩云", url, 484, 405, true);


            }
            var self = this;
            win.GlobalEvent = {
                add: function (key, func) {
                    self.on(key, func);
                },
                broadcast: function (key, args) {
                    self.trigger(key, args);
                }
            }
            win.ReadMailInfo = {
                getDownloadAttachUrl: function (file) {
                    var temp = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
                    return top.wmsvrPath2 + temp.format(file.mid, file.fileOffSet, file.fileSize, encodeURIComponent(file.fileName), file.sid, file.type,file.encoding);
                }
            }

            if (_this.createContacts) _this.createContacts();
            
            win.reloadAddr = function() {
                $App.trigger("change:contact_maindata");
            };

            win.namedVarToXML = function (name, obj, prefix) {

                function getDataType (obj) {
                    return Object.prototype.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
                };
                function getVarType(obj, stringValue) {
                    if (obj == null) {
                        return "null";
                    }
                    var type = getDataType(obj);
                    if (type == "Number") {
                        var s = stringValue ? stringValue : obj.toString();
                        if (s.indexOf(".") == -1) {
                            if (obj >= -2 * 1024 * 1024 * 1024 & obj < 2 * 1024 * 1024 * 1024) {
                                return "int";
                            } else {
                                if (!isNaN(obj)) {
                                    return "long";
                                }
                            }
                        }
                        return "int";
                    } else {
                        return type.toLowerCase();
                    }
                }
                function tagXML(dataType, name, val) {
                    var s = "<" + dataType;
                    if (name) {
                        s += " name=\"" + textXML(name) + "\"";
                    }
                    if (val) {
                        s += ">" + val;
                        if (val.charAt(val.length - 1) == ">") {
                            s += "\n";
                        }
                        return s + "</" + dataType + ">";
                    } else {
                        return s + " />";
                    }
                }
                function textXML(s) {
                    s = s.replace(/[\x00-\x08\x0b\x0e-\x1f]/g, "");
                    return s;
                }

                if (obj == null) {
                    return prefix + tagXML("null", name);
                }
                //var type = obj.constructor;
                var type = getDataType(obj);
                if (type == "String") {
                    var xml = textXML(obj);
                    try {
                        xml = M139.Text.Xml.encode(xml);
                    } catch (e) { }
                    return prefix + tagXML("string", name, xml);
                } else {
                    if (type == "Object") {
                        if (obj.nodeType) {
                            top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                            return "";
                        }
                        var s = "";
                        for (var i in obj) {
                            s += namedVarToXML(i, obj[i], prefix + "  ");
                        }
                        return prefix + tagXML("object", name, s + prefix);
                    } else {
                        if (type == "Array") {
                            var s = "";
                            for (var i = 0; i < obj.length; i++) {
                                s += namedVarToXML(null, obj[i], prefix + "  ");
                            }
                            return prefix + tagXML("array", name, s + prefix);
                        } else {
                            if (type == "Boolean" || type == "Number") {
                                var s = obj.toString();
                                return prefix + tagXML(getVarType(obj, s), name, s);
                            } else {
                                if (type == "Date") {
                                    var s = "" + obj.getFullYear() + "-" + (obj.getMonth() + 1) + "-" + obj.getDate();
                                    if (obj.getHours() > 0 || obj.getMinutes() > 0 || obj.getSeconds() > 0) {
                                        s += " " + obj.getHours() + ":" + obj.getMinutes() + ":" + obj.getSeconds();
                                    }
                                    return prefix + tagXML(getVarType(obj, s), name, s);
                                } else {
                                    top.FloatingFrame.alert(UtilsMessage["UtilsInvalidError"].format(Object.inspect(obj)));
                                    return "";
                                }
                            }
                        }
                    }
                }

            }
            win.UtilsMessage = {
                AddcontactEmptyError: "分组名称不能为空。",
                AddcontactSpecialError: "组名中不能包含特殊字符。",
                AddcontactSuccess: "添加成功!",
                AddsendcontactsAddError: "添加失败",
                AddsendcontactsAddSuccess: "添加成功!",
                AddsendcontactsNotice: "正在添加联系人...",
                AddsendcontactsOneError: "请至少选中一行!",
                AddsendcontactsTeamError: "请输入组名",
                ChecksecretfolderpwdError: "密码错误",
                Folder_smsError: "短信验证码输入错误，请重新输入!",
                Folder_smsNoError: "您还未获取短信验证码，请点击上方的按钮获取。",
                Folder_smsNotice: "正在获取短信验证码",
                FoldermanageError: "排序操作失败！",
                ForwardEmptyError: "邮箱地址不能为空",
                ForwardOneError: "很抱歉，只能转发到一个邮箱地址。",
                ForwardRightError: "请输入正确的邮箱地址（例：example@139.com）",
                ForwardSelfError: "转发用户不能填写自己的邮箱地址",
                PopfolderFullError: "邮箱容量将满,请及时清理",
                PopfolderFulledError: "邮箱容量已满, 请清理过期邮件",
                UtilsDebugError: "调试器错误",
                UtilsInvalidError: "Passing invalid object: {0}",
                UtilsNoloadError: "数据未加载成功，可能的原因是登录超时了。",
                UtilsRequestError: "请求出错:",
                UtilsScreenError: "截屏功能仅能在IE浏览器下使用",
                UtilsScreenInstallConfirm: "使用截屏功能必须安装139邮箱控件,是否安装?",
                UtilsTimeoutError: " <b>登录超时，可能由于以下原因：</b><br/>1、您同时使用多个帐号或多次登录邮箱<br/>2、您的网络链接长时间断开<br/>3、当前页面闲置太久",
                UtilsUpdateConfirm: "您安装的上传控件已经不能使用,是否更新?",
                UtilsUpgradeConfirm: "当前的截屏控件需要升级才可继续使用",
                UtilsUploadConfirm: "上传文件必须安装139邮箱控件,是否安装?",
                vipNoPermissionNotice: "VIP{0}{2}为{0}元版{1}邮箱专属{2}。<br/>立即升级，重新登录后即可使用。"
            };

            win.frameworkMessage = {
                AddsendcontactsTeamError: "请输入新分组名称",
                EditorFaceError: "纯文本模式无法使用表情!",
                EditorImgError: "纯文本模式无法插入图片!",
                EditorWordsError: "请先选择要加入链接的文字。",
                FetionAliasError: "对不起，设置邮箱别名后才能绑定飞信，请先设置邮箱别名",
                FetionAlreadyError: "您已绑定飞信",
                FetionBindConfirm: "系统将自动绑定飞信服务，是否继续?",
                FetionBindFeiError: "绑定失败，请重试",
                FetionLoading: "正在加载中......",
                FetionLoading2Confirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.\r\n{0},继续登录飞信吗?",
                FetionLoadingConfirm: "您已成功绑定飞信，现在可以直接用邮箱使用飞信.继续登录飞信吗?",
                FetionLoginError: "您已经取消绑定飞信，请绑定飞信后登录",
                FetionNoOpenConfirm: "您的飞信服务还没有开通，现在是否注册？",
                FetionProofError: "获取凭证失败，请稍后再试",
                FetionTryLoading: "资源正在加载中，请稍后再试",
                FolderAddedError: "添加文件夹失败，请重试",
                FolderAlreadyError: "文件夹&nbsp;<b>{0}</b>&nbsp;已存在！",
                FolderCheckError: "已向服务器提交代收命令，请稍后检查您的代收文件夹。",
                FolderClearConfirm: "您确定要清空吗?",
                FolderCustomizeError: "自定义文件夹个数不能超过{0}个",
                FolderDelConfirm: "确定要删除该文件夹吗",
                FolderNameEmptyError: "文件夹名称不能为空",
                FolderNameOverError: "文件夹名字不能超过16个字母或者8个汉字！",
                FolderPopError: "POP代理正在执行中，请等待执行完毕",
                FolderSpecialError: "文件夹中不能包含特殊字符！",
                FolderWaiError: "正在为您代收邮件，请稍候......",
                GroupExists: "组名重复是否仍要添加？",
                LinksUnFunctionError: "该功能暂时无法使用",
                MailServerExistError: "对不起，文件夹名称已存在",
                MailServerLoginError: "对不起，登录超时，请重新登录。",
                MailboxAlreadyError: "您所选择的邮件已在当前文件夹中，请重新选择",
                MailboxBatchError: "您刚才有新邮件到达，请重新确认后再进行本项操作",
                MailboxDelConfirm: "系统提示：彻底删除此邮件后将无法取回，您确定要彻底删除吗？",
                MailboxDelsConfirm: "如果彻底删除，这{0}封邮件将无法找回，您确定吗？",
                MailboxExportMail: "仅支持导出200M以内的邮件",
                MailboxKeyError: "请输入关键字",
                MailboxMoveConfirm: "要转移的邮件包含已置顶邮件，转移后将不再置顶。您确定要转移吗？",
                MailboxSelError: "请选择邮件",
                MailboxSpamConfirm: "所选邮件将被移动到垃圾邮件夹。通过举报垃圾邮件，可以协助我们更有效的抵制垃圾邮件，感谢您！",
                MailboxTopError: "最多只能置顶10封邮件",
                MainConfigError: "配置文件未加载",
                MainSearchText: "邮件全文搜索...",
                MainWapSuccess: "139邮箱WAP访问地址已经发送到您的手机，请查收",
                Main_extDownConfirm: "尊敬的139用户，您好，请下载pushemail",
                ReadmailAttachSuccess: "附件：{0}保存成功，请到手机彩云我的文件柜查看。",
                ReadmailContentError: "请输入要回复的内容",
                ReadmailDelSuccess: "邮件已经删除!",
                ReadmailDiskError: "对不起，您尚未开通彩云服务。",
                ReadmailFilterError: "添加失败，您添加的过滤器数量已达到最大上限",
                ReadmailLoadError: "加载失败,请重试",
                ReadmailMailError: "请输入要回复的邮件地址",
                ReadmailReceiptConfirm: "对方要求发送已读回执,是否发送?<br />             <label for='chkShowReturnReceipt'>            <input id='chkShowReturnReceipt' onclick='window.chkShowReturnReceiptValue=this.checked' type='checkbox' />            以后都按本次操作            </label>",
                ReadmailReduktionSuccess: "操作成功，邮件已被还原到收件箱中。",
                ReadmailRejectionSuccess: "设置主题拒收成功",
                ReadmailReplySuccess: "回复成功",
                ReadmailRightMailError: "请输入正确的邮件地址:",
                ReadmailSelReceiveError: "请至少选择一个收件人",
                ReadmailTryAgainError: "服务器忙，请稍后重试",
                ReadmailWithdraw1Error: "撤回失败,邮件不存在",
                ReadmailWithdraw2Error: "撤回失败,此邮件不支持召回",
                ReadmailWithdraw3Error: "撤回失败,该邮件已超过撤回期限",
                SimpleframeSendConfirm: "确定不发送此明信片吗？",
                SysBusyTryAgainError: "系统繁忙，请稍后重试!",
                TablabelError: "Tab Init Error",
                TablabelExistError: "fTabLabelExist",
                TablabelNoTabError: "Tab 不存在",
                addContacting: "保存联系人中……",
                addFolderPageLoadError: "邮件地址格式有误，请重新填写！",
                addGroupTitle: "请输入新分组名称",
                addNotAllowed: "不支持添加自己为VIP联系人。",
                changeTagColorParamsError: "参数错误，改变标签颜色失败！",
                checkPswEnterPwdFormValid: "请输入密码！",
                checkPswNotOnlyNumFormValid: "密码不能是纯数字组合！",
                checkPswNotSeriesFormValid: "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA！",
                checkPswNotSpecialCharFormValid: "密码中包含不合法字符，可支持字母、数字、及_~@#$^符号！",
                checkPswPwdLengthFormValid: "密码须由6位至16位字符或数字组成！",
                checkSelectSongsError: "请选择歌曲再播放！",
                delConfirmMsg: "确定取消“VIP联系人”？<br>其邮件将同时取消“VIP邮件”标记。",
                delContactEventConfirm: "确定要删除该联系人？",
                editGroupListSuc: "{0}已加为VIP联系人，其邮件已自动标记为“VIP邮件”。",
                error_contactOverlimit: '保存联系人失败，联系人数量已达上限。你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactReachlimit: '保存联系人部分成功，联系人数量超出上限部分未保存，你可以<a href="javascript:(function(){top.FF.close();top.Links.show(\'addr\');})();">管理通讯录&gt;&gt;</a>',
                error_contactRepeat: "保存联系人失败，联系人已存在。",
                exportMailLongTime: "文件夹邮件较多，导出邮件可能需要较长的时间。",
                folderManageDelFolderlConfig: "确定要删除该文件夹吗？",
                folderManagePageClearFolderConfirm: "您确定要清空吗？",
                folderManageReNameTitle1: "重命名",
                folderManageReNameTitle2: "请输入文件夹名称",
                folderviewClearFolderFilled: "邮箱容量已满, 请清理过期邮件！",
                folderviewClearFolderFull: "邮箱容量将满,请及时清理！",
                folderviewDeleteFolderConfirm: "确定要删除该文件夹吗？",
                folderviewdelegateConfirm: "删除代收邮箱将同时删除此文件夹内所有的邮件，是否继续删除？",
                groupLimit: "分组联系人总数已达上限，不能添加。",
                markTagIsRepateError: '"{0}" 已经标记过  "{1}" 标签了',
                markTagNoSelectMailError: "请选择邮件",
                modContactError: "修改联系人失败，请稍后再试。",
                modContactSuccess: "修改联系人成功",
                modifySecretFolderPwdPageComparePwdFormValid: "两次密码输入不一致，请重新输入！",
                modifySecretFolderPwdPageEnterNewPwdFormValid: "请输入新密码！",
                modifySecretFolderPwdPageEnterOldPwdFormValid: "请输入旧密码！",
                modifySecretFolderPwdPageModifyError: "修改失败，请稍后再试",
                modifySecretFolderPwdPageOldPwdError: "旧密码错误！",
                modifySecretFolderPwdPageSetLockPwdSuccess: "安全锁密码修改成功！",
                opClear: "您已清空VIP联系人，其邮件同时取消“VIP邮件”标记。",
                opSuc: "操作成功。",
                operatingTagError: "操作失败，请稍后再试。",
                searchKeyWordIsEmptyError: "请输入要搜索的内容",
                searchPageFormatDateError: "日期格式有误！",
                secretFolderFolderNotFould: "找不到指定的文件夹",
                secretFolderPwdInvalid: "密码不正确或者密码不符合规则",
                secretFolderSetPageLockAreaFormValid: "请选择加锁范围！",
                secretFolderSetPageMaxFolderError: "设置安全锁的文件夹个数超出最大限制，最大只可以设置{0}个！",
                secretFolderSetPagePwdError: "密码错误！",
                secretFolderSetPagePwdFormValid: "两次密码输入不一致，请重新输入！",
                secretFolderSetPageSetError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockError: "设置失败，请稍后再试！",
                secretFolderSetPageSetLockSuccess: "安全锁设置成功！",
                showColorPickerParamsError: "参数错误，打开颜色盘失败！",
                sysBusy: "系统繁忙，操作失败。",
                sysError: "系统繁忙，请稍后再试!",
                tagManageDelFolderlConfig: "确定删除标签“{0}”吗？ 删除后相关邮件也将会移除此标签（邮件不会被删除）",
                tagManageReNameTitle1: "重命名",
                tagManageReNameTitle2: "请输入标签名称",
                tagMenuSelectError: "选择标签菜单或选择邮件出错，请稍后再试。",
                tagNameEmptyError: "标签名称不能为空！",
                tagNameOverError: "标签名字不能超过25个字母或汉字！",
                tagNameRepateError: "{0} 已经存在！",
                tagNameSpecialError: "标签名称中不能包含特殊字符！",
                tagOverflow: "很抱歉，每封邮件最多只能贴{0}张标签。",
                tearTagParamsError: "参数错误，撕掉标签操作失败！",
                userFolderPageBindDataClearEventConfirm: "您确定要清空吗？",
                vipContactsMax: "VIP联系人已达上限{0}个，不能添加。{1}",
                addVipSuc: "“{0}”已加为“VIP联系人”，其邮件已自动标记为“VIP邮件”。",
                cancelVipText: "确定取消“VIP联系人”？<br/>其邮件将同时取消“VIP邮件”标记。",
                waitPannelAddFolder: "正在添加文件夹...",
                waitPannelAddTagName: "正在添加标签...",
                waitPannelClearFolder: "正在清空文件夹...",
                waitPannelDelete: "正在删除...",
                waitPannelLoad: "数据加载中...",
                waitPannelModifyPwd: "正在修改安全锁密码...",
                waitPannelReName: "正在重命名文件夹...",
                waitPannelReTagName: "正在重命名标签...",
                waitPannelSetLockSuccess: "正在设置安全锁...",
                warn_contactEmailToolong: "电子邮箱地址太长了",
                warn_contactIllegalEmail: "电子邮箱地址格式不正确，请重新输入!",
                warn_contactMobileError: "手机号码格式不正确，请重新输入",
                warn_contactMobileToolong: "手机号码太长了",
                warn_contactNameToolong: "联系人姓名太长了",
                warn_contactNamenotfound: "请输入联系人姓名",
                zw: ""
            };
        },
        /**创建老版本的UserData对象*/
        createUserData: function () {
            win.UserData = {};

            try {
                userdata = $.extend({}, top.$App.getConfig("UserData"));
                $App.on("userAttrsLoad", function (args) {
                    win.trueName = $User.getTrueName();
                    if (win.UserData) { //可能userData尚未加载
                        win.UserData.userName = $User.getTrueName();
                    }

                    win.UserAttrs = $App.getConfig("UserAttrs");
                })
                $App.on("userDataLoad", function (args) {

                    win.UserData = $.extend({}, args);

                    win.uid = args.UID;
                    win.sid = $App.getSid();
                    win.UserData.ssoSid = win.sid;
                    win.UserData.ServerDateTime = new Date();//暂无服务器时间
                       
                    win.UserData.userNumber = win.uid;
                    if (win.trueName) {
                        win.UserData.userName = win.trueName;
                    }

                    var tempArr = [];
                    var list = win.UserData.uidList
                    for (var elem in list) {
                        if (list[elem].name) {
                            tempArr.push(list[elem].name.replace(/@.+/, ""));
                        }
                    }
                    win.UserData.uidList = tempArr;//替换回旧的uidList;

                    win.UserConfig = { "skinPath": "skin_shibo" };
                    
                    try {
                        //修复ps套餐特权的问题
                        var vip = top.$User.getServiceItem();
                        if (vip == "0016") {
                            args.vipInfo.MAIL_2000008 = "1";
                        } else if (vip == "0017") {
                            args.vipInfo.MAIL_2000008 = "2";
                        } else {
                            args.vipInfo.MAIL_2000008 = "0";
                        }
                        args.vipInfo.serviceitem = top.$User.getServiceItem();
                    } catch (e) { }


                });
                return userdata;
            } catch(e) {
            }

            if (top.UserData) {
                userdata = top.UserData;
            }

            win.UserData = userdata;//对UserData的写操作无法同步
            return win.UserData;
        },

        /**创建老版本的UserData对象*/
        createRequestByScript: function () {
            var _utils = {
                requestByScript: function(option, callback) {
                    try {
                        top.M139.core.utilCreateScriptTag.apply(top.M139.core, arguments);
                        return;
                    } catch (e) {
                    }
                    
                    var _src = top.getResourceHost() + "/m2012/js/packs/" + option.src;
                    top.Utils.requestByScript(option.id, _src, callback, option.charset)
                }
            };

            return _utils;
        },

        /**创建老版本的Links对象，实现Links.show*/
        createLinksShow: function () {
            /*win.Links = {
                show: function (name, params) {

                }
            }*/
            win.LinksConfig = win.LinkConfig; //兼容旧版
            win.Links = {

                old:{ //由于没有重构，要跳到1.0的
                    "migrate":"migrate", //一键搬家
                    "syncsetting":"syncsetting", //手机同步邮箱
                    "videomail":"videomail", //视频邮件
                    "invite":"invite", //邀请好友
                    "invitebymail":"invitebymail" //发邮件邀请好友
                },

                map:{ //创建links.show与$App.show的映射关系
                        "upgradeGuide": "mobile",
                        "partner": "mobile",
                        "uecLab":"uecLab",
                        //"setPrivate": "account",
                        "shequ139": "shequ",
                        "orderinfo": "mobile",
                        "mobileGame": "mobileGame",
                        "mnote": "note",
                        "shareAddr": "addrshare",
                        "shareAddrInput": "addrshareinput",
                        "dingyuezhongxin": "googSubscription", // update by tkh 云邮局的tabid统一改为：googSubscription
                        "urlReplace": "urlReplace",
                        "addrinputhome": "addrinputhome",
                        "addroutput": "addroutput",
                        "addr":"addrhome",
                        "addcalendar": "addcalendar",
			            "mobiSyncMail": "syncguide",
                        "syncGuide": "syncguide",
                        "addrImport": "addrImport",
                        "homemail": "googSubscription",
                        "addredit": "addrEdit",
                        "billmanager": "billManager",
                        "disk": "diskDev",
                        "mailnotify": "notice",
                        "tagsuser": "tags",
                        "accountManage": "account",
                        "antivirus": "spam_antivirusArea",
                        "baseData": "account",
                        "addMyCalendar": "addcalendar",
                        "popagent": "popmail", //06-24
                        "blacklist": "spam",
                        "optionindex": "account",
                        "password":"account_accountSafe",
                        "autoreply":"preference_replySet",
                        "autoforward":"preference_forwardSet",
                        "mailnotifyTips":"preference_onlinetips",
                        "filter":"type",
                        "changenumber":"account_accountSafe",
                        "folderall":"tags",
                        "folderpop":"popmail",
                        "inputAddr":"addrinputhome",
                        "inputAddrI":"addrMcloudImport",
                        "secretfolderpwd":"account_secSafe",
                        "addrWhoAddMe": "addrWhoAddMe",
                        "addrvipgroup":"addrvipgroup",
                        "setPrivacy": "setPrivate",
                        "notice":"notice",
                        "calendar_search": "calendar_search",
			"calendar_square":"calendar_square",
                        "calendar_manage":"calendar_manage"
                    },

                show: function (key, options) {
                    var map = this.map; //map放出来，方便判断
/*
if(SiteConfig.selfSearchRelease){
map["selfSearch"]="selfSearch";
}
*/
                    //urlreplace处理
                    //如：&urlReplace=/inner/reader/index?c=17302
                    if(options && /urlreplace/gi.test(options)) {
                        var getObj = window.LinkConfig[key];
                        var newUrl = ''; 
                        var param = '';
                        var urlReplaceObj = {};
                        if (options.indexOf("http://") == -1 && options.indexOf("https://") == -1) {
                            param = options.split('=')[0] + '=';
                            options = options.replace(param,'');
                            newUrl = getDomain(key) + options;
                        }
                        options = newUrl;
                        urlReplaceObj.group = getObj.group;
                        urlReplaceObj.title = getObj.title;
                        urlReplaceObj.url = options;
                        key = 'urlReplace';                       
                        window.LinkConfig[key] = urlReplaceObj;
                        options = null;
                    }

                    if (map[key]) {
                        $App.show(map[key], options);
                        return; 
                    }

                    if (options && options.indexOf('&') > -1) {
                        options = '?from=jumpto' + options;
                        var obj = $Url.getQueryObj(options);
                        //console.log(obj);
                        $App.jumpTo(key, obj);
                    } else {
                        //console.log(key);
                        $App.jumpTo(key);
                    }
                },
                showUrl: function (url, tabTitle) { //暂时跳到旧版读信

                    if (!_.isEmpty(url)) {
                        url = $.trim(url);
                    }

                    if (!_.isEmpty(tabTitle)) {
                        tabTitle = $.trim(tabTitle);
                    }

                    if (!_.isEmpty(url) && !_.isEmpty(tabTitle)) {
                        return $App.showUrl(url, tabTitle);
                    }

                    var jumpToKey = {
                        partid: top.$User.getPartid(),
                        source: 'jumpto',
                        mid: top.$App.getCurrMailMid()
                    };

                    $App.jumpTo('15', jumpToKey);
                }
            }
        },
        createMailTool: function () {
            $App.on("userAttrsLoad", function () {
                win.FM = { folderList: $App.getConfig("FolderList") };
            });
            
            win.MB = {
                show: function (fid) {
                    $App.showMailbox(fid);
                },
                showBillManager: function () {
                    $App.showMailbox(8);
                },                
                subscribeTab: function (key, isOpenFolder) { // add by tkh 是否打开'我的订阅'文件夹
                    if (key && $.inArray(key, ['myMag', 'myCollect', 'googSubscription'])>=0) {
                        $App.show(key);
                        return;
                    }
                    $App.showMailbox(9, isOpenFolder);
                }
            };
            win.CM = {
                show: function (options) {
                    // update by tkh 通过inputData传递参数到写信页，支持传递大文本。如邮件正文。
                    $App.show("compose",null,{inputData:options});
                },
                sendMail: function (sendMailInfo, categroy) {
                    var letter = {
                        to: sendMailInfo.to ? sendMailInfo.to.join(";") : "",
                        cc: sendMailInfo.cc ? sendMailInfo.cc.join(";") : "",
                        bcc: sendMailInfo.bcc ? sendMailInfo.bcc.join(";") : "",
                        showOneRcpt: (sendMailInfo.singleSend || sendMailInfo.showOneRcpt) ? 1 : 0,
                        isHtml: sendMailInfo.isHtml ? 1 : 0,
                        subject: sendMailInfo.subject,
                        content: sendMailInfo.content,
                        priority: sendMailInfo.priority || 3,
                        requestReadReceipt: sendMailInfo.sendReceipt ? 1 : 0,
                        saveSentCopy: sendMailInfo.saveToSendBox === false ? 0 : 1,
                        inlineResources: 0,
                        scheduleDate: 0,
                        normalizeRfc822: 0
                    };
                    var categroyList = {
                        compose: "103000000",
                        sms: "105000000",
                        contact: "109000000",
                        greetingCard: "102000000",
                        postCard: "101000000"
                    }
                    if (categroy == undefined) {
                        categroy = "compose";
                    }

                    //是否定时邮件
                    if (sendMailInfo.timeset && _.isDate(sendMailInfo.timeset)) {
                        letter.scheduleDate = parseInt(sendMailInfo.timeset.getTime() / 1000);
                    }
                    //设置发信帐号
                    (function getAccount(ac) {
                        //login|alias|number|fetion|default
                        if (!ac) ac = {};
                        if (_.isString(ac)) {
                            letter.account = ac;
                        } else if (_.isObject(ac)) {
                            ac.id = ac.id || "default";
                            var acSettings = {
                                "default": getDefaultId(),
                                "login": getLoginId(),
                                "alias": getAlisaId(),
                                "number": getNumberId(),
                                "fetion": getFetionId()
                            };
                            if (!top.$Email.isEmail(ac.id)) {
                                ac.id = acSettings[ac.id];
                            }
                            ac.name = (ac.name == null) ? getDefaultName() : ac.name;
                            letter.account = "\"{0}\"<{1}>".format(ac.name, ac.id);
                        }

                        function getDefaultId() {
                            return $User.getDefaultSender();
                        }
                        function getLoginId() {
                            return $User.getDefaultSender();
                        }
                        function getAlisaId() {
                            return $User.getAliasName();
                        }
                        function getFetionId() {
                            return $User.getDefaultSender();
                        }
                        function getNumberId() {
                            return $User.getUid() + "@" + mailDomain;
                        }
                        function getDefaultName() {
                            return $User.getTrueName();
                        }
                    })(sendMailInfo.account);
                    if (!M139.Text.Email.isEmailAddr(letter.account)) {
                        //return doError("ParamError", "account参数异常");
                    }
                    if (sendMailInfo.headers) {
                        letter.headers = {};
                        if (sendMailInfo.headers.subjectColor) {
                            //主题颜色
                            letter.headers["X-RM-FontColor"] = sendMailInfo.headers.subjectColor;
                        }
                        var sn = sendMailInfo.headers.smsNotify;
                        if (sn !== undefined) {
                            letter.headers["X-RM-SmsNotify"] = sn;
                        }
                    }
                    var requestXml = {
                        attrs: letter,
                        action: "deliver",
                        returnInfo: 1
                    };
                    if (sendMailInfo.loadingMsg) {
                        WaitPannel.show(sendMailInfo.loadingMsg);
                    }
                    var categroyId = categroyList[categroy];
                    if (!categroyId) {
                        categroyId = categroy;
                    }
                    top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=" + categroyId, requestXml, function (e) {
                        WaitPannel.hide();
                        var result = e.responseData;
                        if (sendMailInfo.callback) {
                            sendMailInfo.callback(result);
                            return;
                        }
                        if (result['code'] == 'S_OK') {
                            doSuccess(result['var']);
                        } else {
                            //后面要把所有错误类型整理出来
                            if (result["code"] == "FA_INVALID_DATE") {
                                doError("DateError", "定时发送的时间不能比当前的时间早", result["code"]);
                            } else {
                                doError("Unknown", "发送失败", result["code"]);
                            }
                        }
                    });
                    function doSuccess(mid) {
                        if (sendMailInfo.onsuccess) {
                            sendMailInfo.onsuccess({ mid: mid });
                        }
                    }
                    function doError(errorCode, errorMsg, code) {
                        if (sendMailInfo.onerror) {
                            sendMailInfo.onerror({ errorCode: errorCode, errorMsg: errorMsg, code: code });
                        }
                    }
                }
            }
        },
        createModuleManager: function() {
            win.MM = {
                show: function (name, params) {
                },
                activeModule:function(name){
                    top.$App.closeTab(name);
                },
				setTitle: function(title){
					top.$App.setTitle(title);
				},
                close: function (name, params) {
                    try {
                        top.$App.closeTab(name);
                        return;
                    } catch (ex) {
                    }

                    var _params = params || {};

                    if (_params.exec == "back") {
                        top.MM.goBack();
                    } else if (_params.exec == "closeAll") {
                        top.MM.closeAll();
                    } else {
                        top.MM.close(name);
                    }

                }
            };
            return win.MM;
        },

        /**创建老的加载中对象*/
        createWaitPanel: function () {
            win.WaitPannel = {
                show: function (msg, option) {
                    try {
                        top.M139.UI.TipMessage.show(msg, option);
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        if (option) {
                            if (option.delay) {
                                top.FF.alert(msg);
                                setTimeout(function(){
                                    top.FF.close();
                                }, option.delay);
                                return;
                            }
                        }

                        top.WaitPannel.show(msg);
                    }
                },
                hide: function () {
                    try {
                        top.M139.UI.TipMessage.hide();
                        return;
                    } catch (ex) {
                    }

                    if (top.WaitPannel) {
                        top.WaitPannel.hide();
                    }
                }
            }
            return win.WaitPannel;
        },
        createValidate: function() {
    win.Validate = {
        config: {
				//3位是考虑到短号集群网。
				"mobile":{
					message:"手机格式不正确，请输入3-20位数字",
					//regex:/^\d{3,20}$/
					regex:/^[\(\)\-\d]{3,20}$/
				},
				"email":{
					message:"邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
					regex:new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$","i")
				},
				"phone":{
					message:"电话号码格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"fax":{
					message:"传真号码话格式不正确，请输入3-30位数字、-",
					regex:/^[\-\d]{3,30}$/
				},
				"zipcode" :{
					message:"邮编格式不正确，请输入3-10位字母、数字、-或空格",
					regex:/^[\ \-\w]{3,10}$/
				},
				"otherim" :{
					message:"飞信号格式不正确，请输入6-10位数字",
					regex:/^\d{6,10}$/
				},
				"qq" :{
					message:"QQ格式不正确，请输入5-11位数字",
					regex:/^\d{5,11}$/
				}
        },
        test: function(key, value) {
            var obj = Validate.config[key];
            if(!obj) {
                throw "找不到的正则:" + key;
            }
            if(obj.regex.test(value)) {
                return true;
            } else {
                this.error = obj.message;
                return false;
            }
        },
        testBirthday: function(value) {

            var isDate = false;
            if(!value) return false;
            var r = value.match(/(\d{4})\-(\d{2})\-(\d{2})/);
            if(r) {
                try {
                    var t = [Number(r[1]), Number(r[2]) - 1, Number(r[3])];
                    var n = new Date();
                    if(t[0] > 0 && t[0] <= n.getFullYear() && t[1] > -1 && t[1] < 12 && t[2] > 0 && t[2] < 32) {
                        var d = new Date(t[0], t[1], t[2]);
                        if(d < n) {
                            isDate = (d.getFullYear() == t[0] && (d.getMonth()) == t[1] && d.getDate() == t[2]);
                        }
                    }
                } catch(ex) {}
            }
            return isDate;
        }
    }
}
    }));
    jQuery.extend(M2012.MatrixVM,
    /**@lends M2012.MatrixVM*/
    {
        /**在使用了老版本对象接口的情况下给予日志提示，描述使用新版本的方法*/
        tip: function (oldFunc, newWay) {

        }
    });
    //对话框组件
    var FF = {
        alert: function (msg, callback) {
            try {
                this.current = top.$Msg.alert(msg, { onclose: callback, isHtml: true, icon:"warn" });
                return this.current;
            } catch(e) {
            
            }
        
            if (top.FF && top.FF.alert) {top.FF.alert(msg)}
        },
        prompt: function (title, msg, defaultValue, callback, maxLength) {
            this.current = $Msg.prompt(msg, callback, {
                dialogTitle: title,
                defaultValue: defaultValue,
                maxLength: maxLength,
                isHtml: true
            });
            return this.current;
        },
        setHeight: function (height) {
            $Msg.getCurrent().setHeight(height);
            $Msg.getCurrent().resetHeight();
        },
        setWidth: function (height) {
            $Msg.getCurrent().setWidth(height);
        },
        close: function () {
            $Msg.getCurrent().close();
        },
        confirm: function (message, callback, cancelCallback, isYesAndNo) {
            var op = {
                icon:"warn",
                isHtml:true
            };
            if (isYesAndNo) {
                op.buttons = [" 是 ", " 否 "];
            }
            this.current = $Msg.confirm(message, callback, cancelCallback, op);
            return this.current;
        },
        show: function (html, title, width, height, fixSize, onclosed, eventHandlers) {
            this.current = $Msg.showHTML(html, {
                dialogTitle: title,
                width: width,
                height: height,
                onclick: onclosed
            });
            return this.current;
        },
        open: function (title, src, width, height, fixSize, miniIcon, hideIcon, hideTitle) {
            this.current = $Msg.open({
                url: src,
                dialogTitle: title,
                width: width,
                height: height,
                //onclick: onclosed,
                hideTitleBar: hideTitle
            });
            return this.current;
        },
        minimize: function () {
            $Msg.getCurrent().minisize();
        }
    };

})(jQuery, _, M139);

﻿
(function ($, _, M) {

var _base = {

    __getUrl:function(page, type){
        return "/sharpapi/addr/apiserver/" + page + "?sid=" + sid + (type ? "&APIType=" + type : "") + "&rnd=" + Math.random();
    },

    //添加联系人(单个)
    getAddContactsUrl: function() {
        return Contacts.__getUrl("AddContact.ashx");
    },
    //添加联系人(多个)
    getAddMultiContactsUrl: function() {
        return Contacts.__getUrl("AddMultiContacts.ashx");
    },
    //添加最近联系人(多个)
    getAddLastestContactsUrl: function() {
        return Contacts.__getUrl("AddLastContacts.ashx");
    },
    //自动保存联系人，附带添加最近联系人。
    getAutoSaveRecentContactsUrl: function(){
        return Contacts.__getUrl("AutosaveContact.ashx");
    },
    //取i联系整合接口
    getIAPIUrl: function(action) {//i联系
        return Contacts.__getUrl("iContactService.ashx", action);
    },
    addrInterfaceUrl: function(action){
        return Contacts.__getUrl("addrinterface.ashx", action);
    },
    getLoadLastContactsDataUrl: function() {
        return Contacts.addrInterfaceUrl("GetLCContacts");
    },
    getAPIUrl: function(action){
        return Contacts.addrInterfaceUrl(action);
    },

     //直呼型接口地址
    apiurl : function(action){
        //return top.addrDomain + "/" + action + "?sid=" + sid + "&r=" + Math.random();
        return "/addrsvr/" + action + "?sid=" + sid + "&r=" + Math.random();
    },
    
    MAX_VIP_COUNT: 10,
    
    MAX_CONTACT_LIMTE: 3000,
    getMaxContactLimit: function(){
        var limit = $User.getMaxContactLimit();
        if (limit < 3000) {
            limit = this.MAX_CONTACT_LIMTE;
        }
        return limit;
    },

    //初始化旧数据LinkManList
    init:function(){},

    //通讯录已加载
    isReady: false,
    waitingQueue: [],

    runWaiting: function() {
        $(this.waitingQueue).each(function() { this() });
        this.waitingQueue.length = 0;
    },

    ready: function(callback){
        if(this.isReady){
            callback();
        }else{
            this.waitingQueue.push(callback);
        }
    },


    createAddressPage : function(param) {
        var url = "/m2012/html/addrwin.html?";
        for (var p in param) {
            if(!/container|width|height|withName/.test(p)){
                url += "&" + p + "=" + param[p];
            }
        }
        if (param.withName) {
            url += "&useNameText=true&useAllEmailText=true";
        }
        param.container.innerHTML = "<iframe frameBorder='0' src='{0}' style='width:{1};height:{2}'></iframe>"
        .format(url, param.width || "100%", param.height || "100%");
    },
    
    addSinglVipContact: function(param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
        if(top.Contacts.IsPersonalEmail(param.serialId)){
            //top.FF.alert("不支持添加自己为VIP联系人。");
            top.M139.UI.TipMessage.show("不支持添加自己为VIP联系人。", { delay: 2000, className: 'msgYellow'});
            return false;
        }
        
        var vips = top.Contacts.data.vipDetails;
        var vipGroupId = "",vipCount =0,vipMaxCount = top.Contacts.MAX_VIP_COUNT; //因后端接口限制
        if(vips.isExist){
            vipGroupId =vips.vipGroupId;
            vipCount = vips.vipn ;
        }
        
        if(vipCount >= vipMaxCount){
            var a = '<a hidefocus="" style="text-decoration:none;" href="javascript:top.FF.close();top.Links.show(\'addrvipgroup\');" ><br/>管理VIP联系人</span></a>';
            var msg = vipMsg.vipContactsMax.format(vipMaxCount,a);
            top.FF.alert(msg);

            return false;
        }
        top.WaitPannel.show("正在保存...");
        var requestData = {
                    groupId : vipGroupId,
                    serialId: param.serialId,
                    groupType:1
        }
        
        //回调
        function callback(res){

            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(res.resultCode == 23){ //分组联系人已达上限
                    top.FF.alert(vipMsg.groupLimit);
                    return false;
                }
                
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.syserror);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = AddGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
			//var name = $T.Html.encode(param.name);
            var sucMsg = vipMsg.addVipSuc.replace('“{0}”', '');
            //top.FF.alert(sucMsg);
            top.M139.UI.TipMessage.show(sucMsg, { delay: 2000});
            
            top.BH('addvipsuccess');
            
            if(param.success) param.success();
            
            top.Contacts.updateCache("addVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function AddGroupList(){
			top.Contacts.AddGroupList(requestData,callback);
		}	
        AddGroupList();
    },
	
	delSinglVipContact : function (param){
		var self = this;
		var vipMsg = top.frameworkMessage;
		function cancelVip(){
			self.delSinglVipContact2(param);
		}
		top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip);
	},
    
    delSinglVipContact2 : function (param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
		
        top.WaitPannel.show("正在保存...");
        if(!top.Contacts.IsExitVipGroup){
            return false; //不存在vip联系人组
        }
        
        var vips = top.Contacts.data.vipDetails;
        var requestData = {
                    groupId : vips.vipGroupId,
                    serialId: param.serialId
        }
        //回调
        function callback(res){
            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.sysError);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = DelGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry; 
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
            //top.FF.alert(vipMsg.opSuc);
            top.M139.UI.TipMessage.show("取消成功", { delay: 2000 });
            if(param.success) param.success();
            
            top.Contacts.updateCache("delVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function DelGroupList(){
			top.Contacts.DelGroupList(requestData,callback);
		}
		DelGroupList();
    },

    addVIPContact: function (successCallback) {
		var self = this;
        var maxCount = this.MAX_VIP_COUNT;
        var contactsModel = top.M2012.Contacts.getModel();
        var tempVipArr = contactsModel.get("data").vip.contacts;
        var selItems = [];
        if(tempVipArr &&  tempVipArr instanceof Array){
            selItems = Array.prototype.slice.call(tempVipArr,0);
        }
        for (var i = 0; i < selItems.length; i++) {
            var c = contactsModel.getContactsById(selItems[i]);
            if (!c || !c.getFirstEmail()) {
                selItems.splice(i, 1);
                i--;
            } else {
                selItems[i] = {
                    name: c.name,
                    addr: c.getFirstEmail(),
                    serialId: c.SerialId,
                    value: contactsModel.getSendText(c.name, c.getFirstEmail())
                };
            }
        }

        

        var view = top.M2012.UI.Dialog.AddressBook.create({
            receiverText: "VIP联系人",
            showLastAndCloseContacts: false,
            showVIPGroup: false,
            showSelfAddr: false,
            getDetail: true,
            filter: "email",
            maxCount: maxCount,   //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
            items: selItems,
            isAddVip:true
        });
        view.on("select", function (e) {
            var ids = [];
            var list = e.value;
            for (var i = 0; i < list.length; i++) {
                ids.push(list[i].serialId);
            }
            //selectedCallback(ids);
			self.submitVipContact(ids, function(){ successCallback(ids); });
        });
        view.on("additemmax", function () {
            $Msg.alert("VIP联系人已达上限"+ maxCount +"个，不能添加。", {
                icon: "warn"
            });
        }); 
    },
	submitVipContact:function(ids,successCallback,options){ //type: "add" ,增加
		var self = this;
		selectedCallback(ids);
		//添加VIP联系人组件-submit执行函数
        function selectedCallback(vipList){
            var vipC = top.Contacts.getVipInfo();
            var groupId = vipC.vipGroupId;
            if( !vipC.hasContact && vipList.length == 0){
                return;
            }
            var serialIds = vipList.join(',');
			if(options && options.type == "add") serialIds = vipC.vipSerialIds + ',' + serialIds;
            var param = { groupId: groupId, groupType: 1, serialId: serialIds };

            top.Contacts.editGroupList(param, callBack);
            function callBack(result) {
                var vipPanelTips = top.frameworkMessage;
                if(result.ResultCode != '0'){
                    if(result.resultCode == '23'){
                        FF.alert(vipPanelTips.groupLimit);
                        return false;
                    }
                    //重试 -变量使用View.Retry来保存重试数据
                    var Obj = Retry;
                    if(Obj.retryTime>=3){
                        Obj.retryData = "";
                        Obj.retryFun = null;
                        Obj.retryTime = 0;
                        top.FF.alert(vipPanelTips.sysError);
                    }else{
                        Obj.retryData = vipList;
                        Obj.retryFun = selectedCallback;
                        top.FF.alert(vipPanelTips.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;top.jslog(\'VIpretyr\',Obj);var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                            var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                        });
                    }
                    return false;
                }
                var msg = vipPanelTips.opSuc + '<br>';
                if(vipList.length == 0){
                    msg += vipPanelTips.opClear;
                }else{
                    msg += vipPanelTips.editGroupListSuc.format('所选联系人');
                    top.addBehavior('成功添加VIP联系人');
                }
                top.Contacts.updateCache("editVipContacts", serialIds);
				
				if(options && options.notAlert){
					if (successCallback) {
						successCallback();
					}
				}else{
					top.FF.alert(msg, function(){
                        top.FF.close();
                        //js会阻塞提示框关闭, 所以设置延时
                        if (successCallback) {
                            setTimeout(function(){successCallback();}, 5); 
                        }
                    });
				}
				
                top.$App.trigger("change:contact_maindata");
            }
        }
	},

    /**
     *返回是否自动保存联系人判断
     */
    isAutoSaveContact:function(){
        var isAuto = top.$App.getUserCustomInfo(9);
        if (!isAuto || isAuto === '1') {
            return true;
        } else {
            return false;
        }
    },

    /**
     *收敛ajax请求接口
     */
    ajax: function (options) {
        if (/^\/+(mw|mw2|g2|addrsvr)\//.test(options.url)) {
            var conf = {
                headers: {},
                method: options.method,
                error: options.error,
                async: options.async,
                responseDataType: ""
            };

            if (typeof options.data == "object") {
                if (!options.contentType) {
                    options.contentType = "application/x-www-form-urlencoded"
                }
            }

            if (options.contentType) {
                conf.headers["Content-Type"] = options.contentType;
            }

            return top.M139.RichMail.API.call(options.url, options.data, function (e) {
                var isJson = options.dataType && options.dataType.toLowerCase() == "json";
                var result;
                if (isJson) {
                    result = e.responseData;
                } else {
                    result = e.responseText;
                }
                if (options.success) {
                    options.success(result);
                }
            }, conf);
        } else {
            return doJQAJAX();
        }
        function doJQAJAX() {
            return $.ajax(options);
        }
    },


    scriptReady: function(target, callback) {
        var _this = this;
        var _caller = _this.scriptReady.caller;

        M139.core.utilCreateScriptTag(
            {
                id: "contact_async_method",
                src: $App.getResourceHost() + "/m2012/js/packs/m2012_contacts_async.pack.js",
                charset: "utf-8"
            },
            function(){
                if ("string" === typeof target && _caller === _this[target]) {
                    window.console && console.log("[ERROR] Contacts." + target + "() not found");
                    return;
                }

                if ("function" === typeof target) target();
                if ("function" === typeof callback) callback();
            }
        );
    },

    data: {
        groups: null, //联系人组
        contacts: null, //联系人
        map: null, //组关系
        lastestContacts: null, //最近联系人
        userSerialId: null,
        birthdayContacts: null, //即将生日的好友，
        Vip: null //vip联系人信息
    },

    onchangeListeners: [],
    change: function(func) {
        this.onchangeListeners.push(func);
    },
    onchange: function(args) {
        $(this.onchangeListeners).each(function() {
            try {
                this(args);
            } catch (e) { }
        })
    },

    FROMTYPE: {
        MAIL: 0x10,  //电子邮件
        MOBILE: 0x20,//短彩信
        FAX: 0x40,   //传真

        NONE: 0,     //默认
        SMS: 1,      //发短信成功页
        CARD: 2,     //发贺卡成功页
        POST: 3,     //发明信片成功页
        EMAIL: 4,    //发邮件成功页
        MMS: 5,      //发彩信成功页
        FILE: 6      //发文件快递成功页
    },

    ConvertFrom : function(a){
        var F=this.FROMTYPE;
        var from = a & 0x0f; //取来源
        var type = a & 0xf0; //来类别
        var last = '1';
        var key = 'E';

        if(from == F.MMS){
            last = "2";
        }

        switch(type){
            case F.FAX: key='F'; break;
            case F.MAIL: key='E'; break;
            case F.MOBILE: key='M'; break;
        }

        return {'from': from, 'type': type, 'key': key, 'last': last};
    }
};



/* 新格式
Object
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsIndexMap: Object [新增]
    contactsMap: Object [新增]
    groupedContactsMap: Object [新增]
    groups: Array[22]
    groupsMap: Object
    lastestContacts: Array[50]
    map: Array[137]
    vip: Object [新增]
*/

/*  旧格式
Object
    ContactsMap: Array[603322342]
    TotalRecord: 2733
    Vip: Array[1]  [未迁移]
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsHasRecord: Object
    groups: Array[22]
    groupsMap: Object
    lastContactsDetail: Array[232]
    lastestContacts: Array[50]
    map: Array[137]
    strangerHasRecord: Object
    userSerialId: undefined
    vipDetails: Object
*/

$.extend(M2012.MatrixVM.prototype, {

    _addrDataNull: {
        ContactsMap: [],
        TotalRecord: 0,
        Vip: [],
        birthdayContacts: [],
        closeContacts: [],
        contacts: [],
        contactsHasRecord: {},
        groups: [],
        groupsMap: {},
        lastContactsDetail: [],
        lastestContacts: [],
        map: [],
        strangerHasRecord: {},
        userSerialId: "",
        vipDetails: {
            hasContact: false,
            isExist: false,
            vipContacts: [],
            vipEmails: [],
            vipGroupId: "",
            vipSerialIds: "",
            vipn: "0"
        }
    },

    createContacts: function(){

        var ci = M2012.Contacts.ContactsInfo;

        window.Contacts = {};
        window.ContactsInfo = ci;

        //联系人搜索
        window.ContactsInfo.prototype.search = function(keyword) {
            var text = (this.name + "," + this.emails + "," + this.mobiles + "," + this.faxes);
            if (this.Quanpin || this.Jianpin) text += "," + this.Quanpin + "," + this.Jianpin;
            //tofix: 下面的职务与公司名，在GetUserAddrJsonData接口并未返回，所以下面的条件永远不生效
            if(this.UserJob)text+=","+this.UserJob;
            if(this.CPName)text+=","+this.CPName;
            return text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
        }

        /**
         * 验证通讯录实体对象的数据合法性
         * @param uncheckEmpty boolean 不检查关键字段是否为空
         * @return object
         *  {success: boolean,
         *   msg: string,
         *   errorProperty: string
         *  }
         */
        window.ContactsInfo.prototype.validateDetails=function(uncheckEmpty){
            var T = this;
            if (!uncheckEmpty){
                if(!T.name || T.name.trim()==""){
                    return failResult("请输入姓名","name");
                }
                if(T.FamilyEmail)T.FamilyEmail=T.FamilyEmail.trim();
                if(T.MobilePhone)T.MobilePhone=T.MobilePhone.trim();
                if(T.OtherEmail)T.OtherEmail=T.OtherEmail.trim();
                if(T.OtherMobilePhone)T.OtherMobilePhone=T.OtherMobilePhone.trim();
                if(!T.FamilyEmail && !T.MobilePhone && !T.BusinessEmail && !T.BusinessMobile){
                    return failResult("电子邮箱和手机号码，请至少填写一项");
                }
            }
            

            if(T.AddGroupName){
                if(Contacts.getGroupByName(T.AddGroupName)){
                    return failResult("新建的组名已存在","AddGroupName");
                }else{
                    T.AddNewGroup="true";
                }
            }
            if(T.FamilyEmail){
                  var emaiLen = T.FamilyEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.FamilyEmail) ){
                    return failResult("电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
            if(T.BusinessEmail){
                  var emaiLen = T.BusinessEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.BusinessEmail) ){
                    return failResult("商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
              
            if(T.MobilePhone && !Validate.test("mobile",T.MobilePhone)){
                return failResult("手机号码格式不正确，请输入3-20位数字");
             }
             
             if(T.BusinessMobile && !Validate.test("mobile",T.BusinessMobile)){
                return failResult("商务手机格式不正确，请输入3-20位数字");
             }
            
             if(T.CPZipCode && !Validate.test("zipcode",T.CPZipCode)){
                  return failResult("公司邮编格式不正确，请输入3-10位字母、数字、-或空格");
             }
                
            //if(T.ZipCode && !Validate.test("zipcode",T.ZipCode)){
            //    return failResult("邮政邮编格式不正确，请输入3-10位字母、数字、-或空格");
            // }    
            if(T.FamilyPhone && !Validate.test("phone",T.FamilyPhone)){
                return failResult("常用固话格式不正确，请输入3-30位数字、-", "familyphone");
            }
            if(T.BusinessPhone && !Validate.test("phone",T.BusinessPhone)){
                return failResult("公司固话格式不正确，请输入3-30位数字、-");
            }
            //if(T.OtherPhone && !Validate.test("phone",T.OtherPhone)){
            //  return failResult("常用固话格式不正确，请输入3-30位数字、-");
            //}

            if(T.BusinessFax && !Validate.test("fax",T.BusinessFax)){
                return failResult("传真号码格式不正确，请输入3-30位数字、-");
            }

            if(T.BirDay && !Validate.testBirthday(T.BirDay)){
                return failResult("请输入正确的生日日期:"+T.BirDay,"BirDay");
            }

            if(T.OtherIm && !Validate.test("otherim",T.OtherIm)){
                return failResult("飞信号格式不正确，请输入6-10位数字");
            }

            return {success:true};
            function failResult(msg,property){
                return {
                    success:false,
                    msg:msg,
                    errorProperty:property||""
                };
            }
        };

        $.extend(window.Contacts, _base);
        
        var _this = this;
        _this.attacthContactMethod();

        $App.on("GlobalContactLoad", function (args) {
            _base.runWaiting();
        });

        $App.on("contactLoad", function (args) {
            _this.loadContactData();
        });

        $App.on("contactUpdate", function (args) {
            _this.loadContactData();
        });
    },

    loadContactData: function() {
        var _this = this;
        var _data = false;

        M139.Timing.waitForReady(
        function(){
            return _data;
        },
        function(){
            var temp = $.extend({}, _this._addrDataNull);
            $.extend(temp, _data);

            temp.ContactsMap = temp.contactsMap;
            
            (function(tmp){
                var _vip = tmp.vip;
                _vip.contacts = _vip.contacts || [];
                _vip.groupId = _vip.groupId || "";
                var _vipCount = _vip.contacts.length;

                var i = 0;
                var _vipEmails = [];
                var _vipContacts = [];

                for (i = 0; i < _vipCount; i++) {
                    var contact = tmp.contactsMap[_vip.contacts[i]];
                    if (contact) { _vipContacts.push(contact); }
                }

                for (i = 0; i < _vipContacts.length; i++) {
                    var _vipContact = _vipContacts[i];
                    var _vipContactEmails = [];
                    if(_vipContact.FamilyEmail) _vipContactEmails.push(_vipContact.FamilyEmail);
                    if(_vipContact.BusinessEmail) _vipContactEmails.push(_vipContact.BusinessEmail);
                    _vipEmails = _vipEmails.concat(_vipContactEmails);  //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
                }

                tmp.vipDetails = {
                    isExist      : _vip.groupId.length > 0,   //vip联系人分组是否存在
                    hasContact   : _vipCount > 0,   //
                    vipGroupId   : _vip.groupId || "vip",
                    vipContacts  : _vipContacts || "",
                    vipEmails    : _vipEmails || "",
                    vipSerialIds : _vip.contacts.join(",") || "", 
                    vipn         : _vipCount || 0
                }
            })(temp);

            window.Contacts.data = temp;
            window.Contacts.isReady = true;

            top.$App.trigger("GlobalContactLoad", temp);
        });

        $App.getModel("contacts").requireData(function(data){
            _data = data;
        });
    }

})
top.Retry={
	retryTime : 0,
	retryData : "",
	retryFun : null
} ; //home页全局变量，用来做重试操作使用。

})(jQuery, _, M139);

﻿
;

function AddrCrossAjax(_url, _data, _onResponse, _onError){

    var xhr = false;

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
        if (typeof xhr.withCredentials !== "boolean") {
            xhr = false;
        }
    }

    if (xhr) {
        xhr.open("POST", _url, true);
        xhr.withCredentials = true;
        if (xhr.setRequestHeader) {
            xhr.setRequestHeader('Content-Type', 'text/plain');
        }

        xhr.onreadystatechange = function(){
            if (this.readyState == 4){
                if (this.status == 200){
                    if (_onResponse) _onResponse(this.responseText);
                } else {
                    if (_onError) _onError(this.status);
                }
            }
        };
        xhr.send(_data);
        return;
    }

    //如果浏览器版本可能不允许 Cross-Origin Resource Sharing 协议则使用Iframe代理
    apiProxyReady(function(T){
        T.ajax.request(_url, {
            "method": "POST",
            "header": {"Content-Type":"application/xml"},
            "data": _data,
            "onfailure": function(xhr){
                if (_onError) _onError(xhr.status);
            },
            "onsuccess": function(xhr, res){
                if (_onResponse) _onResponse(res);
            }
        });
    });
}; // end function ajax

function doAPIrequest(param){

    var url=param.url;
    var request=param.request;
    var timeout=param.timeout||30000;
    var type=param.type||"post";
    var successHandler=param.successHandler;
    var callback=param.callback;
    var err=param.error;

    AddrCrossAjax(url, request, onResponse, err);

    function onResponse(response) {
        Contacts.hideLoading();
        if(param.responseEncode){
            response = param.responseEncode(response);
        }
        try{ //返回json
            var responseObj = eval("(" + response + ")");
            if( responseObj.ResultCode == 0){
                if(successHandler){
                    successHandler(responseObj);
                }
            }
        }catch(e){
            var doc=getXmlDoc(response);
            if(doc && doc.documentElement){
                var rc=doc.getElementsByTagName("ResultCode")[0];
                rc=rc||doc.getElementsByTagName("rc")[0];
                var msg=doc.getElementsByTagName("ResultMsg")[0];
                msg=msg||doc.getElementsByTagName("rm")[0];
                if(rc){
                    var text=rc.text||rc.textContent;
                    var message=msg.text||msg.textContent;
                    if(text=="0"){
                        if(successHandler)successHandler(doc,rc);
                    }else{
                        error(text,message,doc);
                    }
                }else{
                    error();
                }
            }else{
                error();
            }
        }
    }

    function error(resultCode,resultMessage, xdoc){
        if (err) {
            err();
            return;
        }

        var RC_CODE = {
            GroupExisted: 9,
            ContactOverLimit: 21,
            GroupOverLimit: 22,
            ContactInGroupOverLimit: 23,
            ContactExisted: 28,
            AddContactTooQuick: 32,
            InputContactTooQuick: 33
        };
        var result = { success: false, resultCode: -1, msg: "" };
        var rc = -1;

        if ( param.showLoading != false ) {
            Contacts.hideLoading();
        }

        if (typeof(resultCode) == "string"){
            result.resultCode = resultCode;
        }

        rc = parseInt(result.resultCode);

        switch(rc) {
            case RC_CODE.GroupExisted:
            case RC_CODE.GroupOverLimit:
            case RC_CODE.ContactInGroupOverLimit:
            case RC_CODE.AddContactTooQuick:
            case RC_CODE.InputContactTooQuick:
                result.msg=resultMessage;
                break;

            case RC_CODE.ContactOverLimit:
                result.msg="保存失败，联系人数量已达上限。你可以<br /><a href=\"javascript:(function(){top.FF.close();top.Links.show('addr');})();\">管理通讯录&gt;&gt;</a>" ;
                break;

            case RC_CODE.ContactExisted:
                rc = xdoc.getElementsByTagName("SerialId")[0];
                rc = rc.text||rc.textContent;
                result.SerialId = parseInt(rc);
                break;
            default:
                result.msg = YIBUMSG.ajax_othererror;
                break;
        }

        if(callback){
            callback(result);
        }
    }
};


function getXMLTest(doc){
    if(doc.xml)return doc.xml;
    var root=doc.documentElement||doc;
    var xml="<"+root.tagName+">";
    $(root.tagName+" > *",doc).each(function(){
        xml+="<"+this.tagName+">"+encodeXML(this.textContent)+"</"+this.tagName+">";
    });
    xml+="</"+root.tagName+">";
    return xml;
}
function replaceSimpleXML(xml){
    if(typeof xml!="string"){
        xml=getXMLTest(xml);
    }
    var rm=replaceMent;
    for(var p in rm){
        var reg=new RegExp("(</?)"+p+">","g");
        xml=xml.replace(reg,"$1"+rm[p]+">");
    }
    return xml;
}

function LastContactsInfo(param) {
    for(var p in param){
        this[p]=param[p];
    }
    var reg=/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/;
    var m=this.CreateTime.match(reg);
    this.CreateTime=new Date(m[1],m[2]-1,m[3],m[4],m[5],m[6]);
}

(function ($, _, M) {


String.prototype.bind=function(data){
    var result=this;
    for(var p in data){
        var reg=new RegExp("\\{"+p+"\\}","gi");
        result=result.replace(reg,data[p]);
    }
    return result;
}

var _syncMethods = {

    getContactsByMobile: function(mobile) {
        var result = [];
        if (!Contacts.data.contacts || mobile == '' || 'undefined' == typeof mobile) {
            return result;
        }

        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.mobiles.length; j++) {
                var m = c.mobiles[j];
                m = m.replace(/[^\d]+/g, "");//tofix:修正(86)+8686-86,等手机号
                if(m.length==13)m=m.replace(/^86/, "");
                if (m == mobile) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByMobile: function(mobile, useRepeat) {
        var contacts = Contacts.data.contacts;
        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        if (!contacts) return null;
        if (!window._mobileCache_) {
            _mobileCache_ = {};
            _repeatMobile_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    var m = c.mobiles[j];
                    if(m.length==13)m=m.replace(/^86/, "");
                    if (!_mobileCache_[m]) {
                        _mobileCache_[m] = c;
                    } else if (_mobileCache_[m].name != c.name) {
                        _repeatMobile_[m] = true;
                    }
                }
            }
            setTimeout(function() { _mobileCache_ = undefined; _repeatMobile_ = undefined; }, 0);
        }
        if (_repeatMobile_[mobile] && !useRepeat) {
            return null;
        } else {
            return _mobileCache_[mobile];
        }
    },
    //调用新版的函数
    getNameByAddr: function(addr, name) {
        arguments.callee.exists = false;
        var addrName = top.$App.getModel("contacts").getAddrNameByEmail(addr);
        addrName = top.M139.Text.Html.encode(addrName);
        if (addrName == top.M139.Text.Email.getAccount(addr)) {
            return top.M139.Text.Email.getEmail(addr);
        } else {
            return addrName;
        }
    },

    getGroupByName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupName==groupName){
                return g;
            }
        }
        return null;
    },

    getGroupById: function(groupId){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupId==groupId){
                return g;
            }
        }
        return null;
    },

    isExistsGroupName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            if(groups[i].GroupName==groupName){
                return true;
            }
        }
        return false;
    },

    //验证新增联系人数据
    validateAddContacts: function(obj){
        Contacts.validateAddContacts.error="";
        if(!obj.name || obj.name.trim()==""){
            Contacts.validateAddContacts.error="请输入联系人姓名";
            return false;
        }
        if(obj.name.trim().getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactNameToolong'];
            return false;
        }
        if(obj.email && !Validate.test("email",obj.email)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.email && obj.email.getByteCount()>60){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactEmailToolong'];
            return false;
        }
        if(obj.mobile && !Validate.test("mobile",obj.mobile)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.mobile && obj.mobile.getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactMobileToolong'];
            return false;
        }
        if(!obj.email && !obj.mobile){
            Contacts.validateAddContacts.error="电子邮箱和手机号码，请至少填写一项";
            return false;
        }
        if(obj.newGroup){
            if(Contacts.getGroupByName(obj.newGroup)!=null){
                Contacts.validateAddContacts.error="联系组\""+obj.newGroup+"\"已经存在!";
                return false;
            }
        }
        return true;
    },

    getContactsByGroupId: function (groupId, onlyId) {
        var model = top.M2012.Contacts.getModel();
        if (onlyId) {
            return model.getGroupMembersId(groupId);
        } else {
            return model.getGroupMembers(groupId);
        }
    },

    getContactsById: function(contactsId){
        return Contacts.data.ContactsMap[contactsId]||null;
    },

    getContactsGroupById: function(contactsId){
        var groups = [];
        var member = Contacts.data.groupMember;
        for(var key in member){
            if(member[key] && member[key].length > 0){
                var str = member[key].join(',');
                if(str.indexOf(contactsId) > -1){
                    groups.push(key);
                }
            }
        }

        return groups;
    },

    getVipInfo: function(){
        return Contacts.data.vipDetails||null;
    },

    //根据VIP联系人信息组装数据提供刷新VIP邮件使用
    setVipInfo: function(vips){
        if(!vips){return false;}
        var vipinfo = vips;
        var vipn =0,vips = "",isExist =false,hasContact=false,vipGroupId="",vipArr = [] , vipEmails = [];
        if(vipinfo.length > 0){
            isExist = true;
            vipGroupId = vipinfo.vipGroupId;
            vipn = vipinfo.vipn;
        }
        if(vipn > 0){
            hasContact = true;
            vips = vipinfo.vipSerialIds;
            var vipIdArray = vips.split(",");
    
            for(var i=0; i<vipIdArray.length;i++){
                var info = Contacts.data.ContactsMap[vipIdArray[i]];
                if(info){
                    vipArr.push(info);
                    vipEmails = vipEmails.concat(info.emails);
                }
            }
        }
        Contacts.data.vipDetails ={
                        isExist      : isExist,   //vip联系人分组是否存在
                        hasContact   : hasContact,   //
                        vipGroupId   : vipGroupId,
                        vipContacts  : vipArr,
                        vipEmails    : vipEmails,
                        vipSerialIds : vips,
                        vipn         : vipn
                    };
    },

    //根据email地址找到联系人
    getContactsByEmail: function(email){
        var result = [];
        if (!Contacts.data.contacts) return result;
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.emails.length; j++) {
                if (c.emails[j] == email) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByEmail: function(email,useRepeat) {//默认放弃有重复name的,除非useRepeat为true
        var contacts = Contacts.data.contacts;
        if (!contacts || !email) return null;
        email = email.toLowerCase();
        if (!window._emailCache_) {
            _emailCache_ = {};
            _repeatEmail_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.emails.length; j++) {
                    var e = c.emails[j].toLowerCase();
                    if (!_emailCache_[e]) {
                        _emailCache_[e] = c;
                    } else if (_emailCache_[e].name != c.name) {
                        _repeatEmail_[e] = true;
                    }
                }
            }
            setTimeout(function() { _emailCache_ = undefined; _repeatEmail_ = undefined; }, 0);
        }
        if (_repeatEmail_[email] && !useRepeat) {
            return null;
        } else {
            return _emailCache_[email];
        }
    },

    //是否存在的手机
    isExistMobile: function(mobile) {
        var contacts = Contacts.data.contacts;
        mobile = mobile.toString().trim().replace(/^86/,"");
        if (!contacts) return true;
        for (var i = 0, len = contacts.length; i < len; i++) {
            var info = contacts[i];
            if (
                (info.MobilePhone && info.MobilePhone.trim().replace(/^86/,"") == mobile)
                || (info.BusinessMobile && info.BusinessMobile.trim().replace(/^86/,"") == mobile)
                || (info.OtherMobilePhone && info.OtherMobilePhone.trim().replace(/^86/,"") == mobile)) {
                return true;
            }
        }
        return false;
    },

    //是否存在的邮箱
    isExistEmail: function(email){
        var contacts=Contacts.data.contacts;
        if(!contacts)return true;
        if(!email)return false;
        email=email.toLowerCase();
        for(var i=0,len=contacts.length;i<len;i++){
            var info=contacts[i];
            if(
                (info.FamilyEmail && info.FamilyEmail.toLowerCase()==email)
                ||(info.BusinessEmail && info.BusinessEmail.toLowerCase()==email)
                ||(info.OtherEmail && info.OtherEmail.toLowerCase()==email)){
                return true;
            }
        }
        return false;
    },

    getContactsCount: function() {
        return top.Contacts.data.TotalRecord;
    },

    QueryUserInfo: function(callback){

        var request="<QueryUserInfo><UserNumber>{0}</UserNumber></QueryUserInfo>".format($User.getUid());
        function successHandler(doc){
            var result={};
            var obj=doc.responseData;
            result.success=true;
            //result.msg= YIBUMSG.contactsaved;
            result.msg= "保存成功";//下版本修复
            if(obj.UserInfo){
                //result.info=new top.ContactsInfo(obj.UserInfo);
				 var helper = top.$App.getModel("contacts");
				 var fullInfo = helper.userInfoTranslate(obj.UserInfo[0]);
				result.info = new M2012.Contacts.ContactsInfo( fullInfo );
			}else{
                result.info=null;
            }
            if(callback){
                callback(result);
            }
        }
		 $RM.call("QueryUserInfo", request, function(a){
				successHandler(a);
			}, { error: function(){ alert("连接失败"); } });
		/*
        doAPIrequest({
            url:Contacts.apiurl("QueryUserInfo"),
            callback:callback,
            request:request,
            successHandler:successHandler,
            responseEncode:replaceSimpleXML
        });*/

    },

    /**
     * 将list添加到本地最近联系人缓存中。
     * @param {Array} list 必选参数，带属性AddrContent联系人数组。
     */
    addLastestContactsToCache: function(list) {
        var lastestContacts = Contacts.data.lastestContacts;
        if(!lastestContacts) return;
        $(list).each(function() {
            for (var i = 0; i < lastestContacts.length; i++) {
                if (lastestContacts[i] && lastestContacts[i].AddrContent == this.AddrContent) {
                    lastestContacts.splice(i, 1);
                    i--;
                }
            }
        });
        var arr = list.concat(lastestContacts);
        Contacts.data.lastestContacts = arr;
    },

    //邮件列表发件人浮层，加改手机使用。
    addContactsMobile: function(serialId, number, callback) {
        var info = Contacts.getContactsById(serialId);
        var request = "<AddContactsField><SerialId>{0}</SerialId><MobilePhone>{1}</MobilePhone></AddContactsField>".format(
            info.SerialId,
            encodeXML(number)
        );
        Contacts.execContactDetails(request, function(result) {
            if (result.success) {
                info.MobilePhone = number;
                info.mobiles[0] = number;
                if (callback) callback(result);
            } else {                
                if (callback) callback(result);
            }
        }, false);
    },

    //通讯录首页快速编辑使用，只更改其中几个字段时使用。
    //注意，该服务端接口必须填满所有字段，否则会清空
    ModContactsField: function (serialId, contactsDetails, isOver, callback, msg) {
        //TODO 暂时没想到好方法，在请求此方法时，YIBUMSG为空（未加载m2011.matrixvm.contacts.async.js)的情形,特加了个msg参数
        //关联文件：m2012.contacts.httpclient.js, 行700左右

        var properties;
        var feContact = contactsDetails;
        var orContact = this.getContactsById(serialId);

        var key = [ "AddrFirstName", "FamilyEmail", "MobilePhone", "BusinessEmail", "BusinessMobile" ];
        for (var i = key.length; i--; ) {
            properties = feContact[key[i]];
            if (properties) {
                orContact[key[i]] = properties;
            }

            if (typeof(properties) == "string" && properties.length == 0) {
                orContact[key[i]] = "";
            }
        }

        var buff = ["<ModContactsField>",
            "<UserNumber>", $User.getUid(), "</UserNumber>",
            "<SerialId>", serialId, "</SerialId>"];

        for (var m = key.length, i = 0; i < m; i++) {
            buff.push("<", key[i], ">", encodeXML(orContact[key[i]]), "</", key[i], ">");
        }

        buff.push("<OverWrite>", (isOver ? "1" : "0"),"</OverWrite>");
        buff.push("</ModContactsField>")

        var requestBody = buff.join('');
        var requestUrl = Contacts.addrInterfaceUrl("ModContactsField");

        function successHandler(doc) {
            var info = doc.responseData;

            var result = {};
            result.resultCode = info.ResultCode;
            result.msg = msg || YIBUMSG.contactsaved;
            result.ContactInfo = contactsDetails;
            result.SerialId = contactsDetails.SerialId;

            if (result.resultCode == '0'){
                Contacts.getContactsInfoById(serialId, function(_result){
                    Contacts.updateCache("EditContactsDetails", { 'info':_result.contactsInfo });
                    result.ContactInfo = _result.contactsInfo;
                    result.msg = msg || YIBUMSG.contactsaved;
                    result.success = true;

                    if (callback) callback(result);
                });
            }else{
                result.success = false;
                if (callback) callback(result);
            }
        }

        $RM.call("ModContactsField", requestBody, function(a){
            successHandler(a);
        }, { error: function(){ alert("连接失败"); } });

    },

    /*
    * 判断联系人是否是vip联系人-只需要判断serialId是否在vipgroup里面就行因为 vip组最多20人，这样循环最快
    *groupId 默认为vip组的id
    *serialId 联系人id
    *return BOOLEAN  返回联系人是否在某个组-默认查询vip组 -vip组ID固定(****)
    */
    IsVipUser: function(serialId){
        if(!serialId){
            return false;
        }
        var vipContacts = Contacts.data.vipDetails;
        if(!vipContacts.isExist){ //不存在vip联系人组
            return false;
        }
        if(!vipContacts.hasContact){
            return false; //VIP联系人为0
        }
    
        var vips = vipContacts.vipSerialIds;
        return vips.indexOf(serialId) > -1;
    },

    //从多个联系人中筛选出vip联系人
    /*
    *serialIdList ["3123","312321"]
    */
    FilterVip: function(serialIdList){
        var isVip = false;
        var vipList = [];
        if(!serialIdList){
            top.jslog("联系人sid组为空",serialIdList);
            return vipList;
        }
        for(var i=0;i<serialIdList.length;i++){
            isVip = top.Contacts.IsVipUser(serialIdList[i]);
            if(isVip){
                vipList.push(serialIdList[i]);
            }
        }
       return vipList;
    },

    //判断是否有vip联系人组
    IsExitVipGroup: function(){
        var vipgroup = Contacts.data.vipDetails;
        return vipgroup.length > 0 ;
    },

    //判断传入的sid是否是用户自己的 ()
    IsPersonalEmail: function(serialId){
		if(!serialId){return false;}
        //var info = top.Contacts.getContactsById(serialId);
        var info = top.Contacts.data.ContactsMap[serialId];
        var emails = info.emails;
        var personalEmails = $User.getAccountListArray();

        for(var i=0; i<emails.length; i++){
            for(var j=0;j<personalEmails.length;j++){
                if(personalEmails[j] ==emails[i]) {
                    return true; //break 只能退出当前for循环，没法退出最外层for循环，只能使用return 退出整个函数
                }
            }
        
        }
        return false;
    }

};

    //异步方法体的函数
    var _asyncMethods = {

        //#region //{ 联系人操作方法

        addContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addContacts", function(){_this.addContacts.apply(_this, arg)});
        }

        ,addContactsMuti: function(contacts, callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("addContactsMuti", function(){_this.addContactsMuti.apply(_this, arg)});
        }

        ,addContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,true);
        }

        ,editContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,false);
        }

        ,execContactDetails: function(contacts, callback, isAdd) {
            var _this = this, arg = arguments;
            _this.scriptReady("execContactDetails", function(){_this.execContactDetails.apply(_this, arg)});
        }

        ,deleteContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContacts", function(){_this.deleteContacts.apply(_this, arg)});
        }

        ,addLastestContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addLastestContacts", function(){_this.addLastestContacts.apply(_this, arg)});
        }

        //最近联系人详细数据
        ,getLastContactsDetail: function(callback,isClose){
            var _this = this, arg = arguments;
            _this.scriptReady("getLastContactsDetail", function(){_this.getLastContactsDetail.apply(_this, arg)});
        }

        ,getCloseContactsDetail: function(callback) {
            this.getLastContactsDetail(callback, true);
        }

        //异步查询联系人详细数据
        ,getContactsInfoById: function(id,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getContactsInfoById", function(){_this.getContactsInfoById.apply(_this, arg)});
        }

        //获取重复联系人列表
        ,getRepeatContacts: function(callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getRepeatContacts", function(){_this.getRepeatContacts.apply(_this, arg)});
        }

        //获取待更新联系人的人数
        ,getUpdatedContactsNumData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getUpdatedContactsNumData", function(){_this.getUpdatedContactsNumData.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 组操作方法

        ,addGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addGroup", function(){_this.addGroup.apply(_this, arg)});
        }

        ,changeGroupName: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("changeGroupName", function(){_this.changeGroupName.apply(_this, arg)});
        }

        ,deleteGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteGroup", function(){_this.deleteGroup.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 联系人分组 关联方法

        ,deleteContactsFromGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContactsFromGroup", function(){_this.deleteContactsFromGroup.apply(_this, arg)});
        }

        ,moveContactsToGroup: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("moveContactsToGroup", function(){_this.moveContactsToGroup.apply(_this, arg)});
        }

        ,copyContactsToGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("copyContactsToGroup", function(){_this.copyContactsToGroup.apply(_this, arg)});
        }

        /**
        * 给编辑分组联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        * param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        * param.groupType: 1 || ""
        * param.serialIds:联系人id串
        */
        ,editGroupList: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("editGroupList", function(){_this.editGroupList.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 用户自身资料操作方法

        //添加或编辑用户自身资料
        ,AddUserInfo: function(info,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("AddUserInfo", function(){_this.AddUserInfo.apply(_this, arg)});
        }

        //#endregion //}
        
        //#region //{ 用户相互关系相关方法

        ,getWhoWantAddMeData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoWantAddMeData", function(){_this.getWhoWantAddMeData.apply(_this, arg)});
        }

        ,agreeOrRefuseAll: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("agreeOrRefuseAll", function(){_this.agreeOrRefuseAll.apply(_this, arg)});
        }

        //#endregion //}
        
        //>
        //合并联系人
        //<
        ,MergeContacts: function(serialId,info,callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.MergeContacts.apply(Contacts,arg)});
        }
        //>
        //智能全自动合并联系人
        //<
        ,AutoMergeContacts: function(callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.AutoMergeContacts.apply(Contacts,arg)});
        }
        //>
        //<
        ,getAddrConfig: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getAddrConfig.apply(Contacts,arg)});
        }
        //>
        //删除最近联系记录
        //<
        ,DeleteLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.DeleteLastContactsInfo.apply(Contacts,arg)});
        }
        //>

        //删除最近联系记录
        //<
        ,EmptyLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.EmptyLastContactsInfo.apply(Contacts,arg)});
        }

        ,addContactsToCacheExec: function() {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.addContactsToCache.apply(Contacts,arg)});
        }

        //<9.28
        ,addLastestContactsExt: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execaddLastestContactsExt", function(){
                    Contacts.execaddLastestContactsExt.apply(Contacts, arg);
                });
            });
	        //Contacts.scriptReady(function(){Contacts.addLastestContactsExt.apply(Contacts,arg)});
        }

        ,getWhoAddMePageData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoAddMePageData", function(){_this.getWhoAddMePageData.apply(_this, arg)});
        }
        ,getWhoAddMeData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getWhoAddMeData.apply(Contacts,arg)});
        }

        ,getDealListData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getDealListData.apply(Contacts,arg)});
        }
        ,deleleteDealList: function(relationId, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.deleleteDealList.apply(Contacts,arg)});
        }

        //同步添加若干联系人（同自动保存联系人接口AutoSaveReceivers）
        ,syncAddContacts: function(obj, callback, groupid){
            var arg=arguments;
            Contacts.scriptReady(function(){Contacts.execSyncAddContacts.apply(Contacts,arg)});
        }



        //用户隐私设置
        ,savePrivacySettings: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execSavePrivacySettings", function(){
                    Contacts.execSavePrivacySettings.apply(Contacts, arg);
                });
            });
        }

        //获取用户隐私设置信息params 包括 请求参数 和回调函数
        ,getPrivacySettings: function(params) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execGetPrivacySettings", function(){
                    Contacts.execGetPrivacySettings.apply(Contacts, arg);
                });
            });
        }
        /**
         * 可能认识的人页面批量添加选择人员。
         * @param {String} request 必选参数，请求参数。
         */
        ,OneKeyAddWAM: function(request,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("OneKeyAddWAM", function(){_this.OneKeyAddWAM.apply(_this, arg)});
        }
        /**
         * 可能认识的人分组接口。
         * @param {String} request 必选参数，请求参数。
         */
        ,WMAGroupList: function(request,callback){
	       var _this = this, arg = arguments;
            _this.scriptReady("WMAGroupList", function(){_this.WMAGroupList.apply(_this, arg)});
        }

        ,modDealStatus: function(p, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.modDealStatus.apply(Contacts,arg)});
        }

        ,updateCache: function(type, param) {    
            var arg = arguments;
            Contacts.scriptReady(function() { Contacts.updateCache.apply(Contacts, arg) });
        }

        /**
         * 发信成功页自动保存联系人与记录最近联系人。
         * @param {Array } contacts 必选参数，包含主送、抄送、密送的所有收件人的逗号隔开数组行 1@a.c, 2@a.c。
         * @param {String} from 必选参数，E、E1之类的来源标识 详见FROMTYPE枚举。
         * @param {Object} panel 必选参数，生成已保存联系人列表的DOM对象。
         * @param {String} subject 必选参数，刚才发送的邮件的标题。
         * @return void
         */
        ,AutoSaveRecentContacts: function(contacts, from, panel, subject) {
	        var _this = this, arg = arguments;
            _this.scriptReady("AutoSaveRecentContacts", function(){_this.AutoSaveRecentContacts.apply(_this, arg)});
        }
        /**
        *发信页 查询所有收件人是否在是整组
        */
        ,IsAllContactsSameGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execIsAllContactsSameGroup", function(){
                    Contacts.execIsAllContactsSameGroup.apply(Contacts, arg);
                });
            });
        }


        /**
         *发信成功页另存为组
         */
        ,saveRecieverToGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execsaveRecieverToGroup", function(){
                    Contacts.execsaveRecieverToGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 发信成功页删除联系人。
         * @param {String} serialId 必选参数，联系人ID。
         * @return void
         */
        ,DelSavedContact: function(serialId, lst, ext){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execDelSavedContact", function(){
                    Contacts.execDelSavedContact.apply(Contacts, arg);
                });
            });
        }

        /**
         * 发信成功页修改联系人。
         * @param {String} serialId 必选参数，联系人ID。
         * @param {String} mobile 必选参数，修改后的手机号。
         * @param {String} name 必选参数，修改后的姓名。
         * @param {Object} lnk 必选参数，”修改“字样的A标签。
         * @param {Object} lstGroup 必选参数，组列表所在的UL标签。
         * @return void
         */
        ,ModSavedContact: function(serialId, mobile, name, lnk, pnl){
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execModSavedContact", function(){
                    Contacts.execModSavedContact.apply(Contacts, arg);
                });
            });
        }

        /**
         * 给自动保存联系人页快速添加组
         * @param {Object} btn
         * @param {Object} context
         */
        ,QuickAddGroup: function(btn, context){
           var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execQuickAddGroup", function(){
                    Contacts.execQuickAddGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 修改部分个人信息的接口
         * @param {Function} callback
         */
        ,ModUserInfoIncrement: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function() {
                if (Contacts.ModUserInfoIncrement.caller == null) {
                    Contacts.ModUserInfoIncrement.apply(Contacts,arg);
                }
            });
        }

        //禁用自动保存联系人后，发送成功出现的保存联系人页面
        ,createAddContactsPage: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execCreateAddContactsPage", function(){
                    Contacts.execCreateAddContactsPage.apply(Contacts, arg);
                });
            });
        }

        //给分组添加联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        /**
        *param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        *param.groupType: vip || ""
        *param.serialIds:联系人id串
        */
        ,AddGroupList: function(param,callback){
	        var _this = this, arg = arguments;
            _this.scriptReady("AddGroupList", function(){_this.AddGroupList.apply(_this, arg)});
        }



        //将联系人移除分组--取消vip联系人调用的此接口
        ,DelGroupList: function(param,callback){
			 var _this = this, arg = arguments;
            _this.scriptReady("DelGroupList", function(){_this.DelGroupList.apply(_this, arg)});
        }
        
        //获取“和通讯录”待更新联系人的人数
        , getColorCloudInfoData: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getColorCloudInfoData", function () { _this.getColorCloudInfoData.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportList: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportList", function () { _this.getFinishImportList.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportResult: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportResult", function () { _this.getFinishImportResult.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getRemindBirthdays: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getRemindBirdays", function () { _this.getRemindBirthdays.apply(_this, arg) });
        }

        /**
         * 设置生日提醒联系人的接口
         * 告知服务器，对应号码的联系人，已经设置生日提醒
         * @parm contactsNumbers {Array} 联系人号码数组，如[13800138000,13800138001]
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , setRemindBirthdays: function (contactsNumbers, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("setRemindBirdays", function () { _this.setRemindBirthdays.apply(_this, arg) });
        }

    };


/* 新格式
Object
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsIndexMap: Object [新增]
    contactsMap: Object [新增]
    groupedContactsMap: Object [新增]
    groups: Array[22]
    groupsMap: Object
    lastestContacts: Array[50]
    map: Array[137]
    vip: Object [新增]
*/

/*  旧格式
Object
    ContactsMap: Array[603322342]
    TotalRecord: 2733
    Vip: Array[1]  [未迁移]
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsHasRecord: Object
    groups: Array[22]
    groupsMap: Object
    lastContactsDetail: Array[232]
    lastestContacts: Array[50]
    map: Array[137]
    strangerHasRecord: Object
    userSerialId: undefined
    vipDetails: Object
*/

    $.extend(M2012.MatrixVM.prototype, {

        attacthContactMethod: function() {
            $.extend(window.Contacts, _syncMethods);
            $.extend(window.Contacts, _asyncMethods);
        }

    })

})(jQuery, _, M139);

﻿/*global Backbone: false */

/**
  * @fileOverview 定义通讯录数据实体类
  */

(function (jQuery,_,M139){
    var $ = jQuery;
    var inM2012 = false;
    /**通讯录数据实体
    *@constructs M2012.Contacts.ContactsInfo
    */
    function ContactsInfo(options) {
        for (var p in options) {
            this[p] = options[p] || "";
        }
        var emails = this.emails = [];
        var mobiles = this.mobiles = [];
        var faxes = this.faxes = [];
        if (!this.name) this.name = (this.AddrFirstName || "") + (this.AddrSecondName || "");
        this.lowerName = this.name.toLowerCase();
        if (this.FamilyEmail) emails.push(this.FamilyEmail);
        if (this.OtherEmail) emails.push(this.OtherEmail);
        if (this.BusinessEmail) emails.push(this.BusinessEmail);

        if (this.MobilePhone) mobiles.push(this.MobilePhone);
        if (this.OtherMobilePhone) mobiles.push(this.OtherMobilePhone);
        if (this.BusinessMobile) mobiles.push(this.BusinessMobile);

        if (this.OtherFax) faxes.push(this.OtherFax);
        if (this.FamilyFax) faxes.push(this.FamilyFax);
        if (this.BusinessFax) faxes.push(this.BusinessFax);
        if (!inM2012) {
            inM2012 = Boolean(top.$App);
        }
        if (inM2012) {
            this.fixPhoto();
        }
    }
    var defPhoto;
    var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];
    var baseUrl;
    ContactsInfo.prototype =
        /**
        *@lends M2012.Contacts.ContactsInfo.prototype
        */
    {
        getMobileSendText: function () {
            var n = this.getFirstMobile();
            n = n && n.replace(/\D/g, "");
            if (!n) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + n + ">";
        },
        getEmailSendText: function () {
            var e = this.getFirstEmail();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFaxSendText: function () {
            var e = this.getFirstFax();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFirstEmail: function () {
            if (this.emails && this.emails[0]) return this.emails[0];
            return "";
        },
        getFirstMobile: function () {
            if (this.mobiles && this.mobiles[0]) return this.mobiles[0];
            return "";
        },
        getFirstFax: function () {
            if (this.faxes && this.faxes[0]) return this.faxes[0];
            return "";
        },
        /**
         *模糊搜索
         */
        match: function (keyword) {
            return [
            this.name,
            this.BusinessEmail,
            this.BusinessFax,
            this.BusinessMobile,
            this.CPName,
            this.FamilyEmail,
            this.FamilyFax,
            this.FirstNameword,
            this.Jianpin,
            this.MobilePhone,
            this.OtherEmail,
            this.OtherFax,
            this.OtherMobilePhone,
            this.Quanpin,
            this.UserJob].join("").toLowerCase().indexOf(keyword) > -1;
        },
        fixPhoto: function () {
            if (this.ImagePath) return;
            if (!defPhoto) {
                defPhoto = $App.getResourcePath() + "/images/face.png";
				/*不再用g2的域名访问地址
                baseUrl = M139.Text.Url.makeUrl(getDomain("webmail") + "/addr/apiserver/httpimgload.ashx", {
                    sid: $App.getSid()
                });
				*/
				//
				function getPhotoUploadedAddr() {
						var tmpurl = location.host;
						var url2 = "";
						if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
							url2 = "http://image0.139cm.com";
						} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
							url2 = "http://images.139cm.com";
						} else if (tmpurl.indexOf("10086ts") > -1) {
							url2 = "http://g2.mail.10086ts.cn";
						}else if(tmpurl.indexOf("10086rd") > -1){
							url2 = "http://static.rd139cm.com";
						}
						return url2 ;
				}
				baseUrl = getPhotoUploadedAddr()
            }
            if (this.ImageUrl) {
                if (this.ImageUrl.indexOf("http://") == 0) {
                    return;
                }
                this.ImagePath = this.ImageUrl;
            //  var path = this.ImagePath.toLowerCase(); 不能转大小写
				var path = this.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    this.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
					this.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                this.ImageUrl = defPhoto;
                this.ImagePath = "/upload/photo/nopic.jpg";
            }
        }
    }
    M139.namespace("M2012.Contacts.ContactsInfo", ContactsInfo);



})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录数据管理模块
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var isFirstLoadQueryUserInfo = true;
    M139.namespace("M2012.Contacts.Model", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.prototype*/
    {

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model
        */
        initialize: function (options) {
            this.initEvents();
        },

        /**
         *@inner
         */
        getUserNumber: function () {
            return top.$User.getUid();
        },

        /**
         *加载通讯录数据
         */
        loadMainData: function (options, callback) {
            options = options || {};
            var This = this;
            this.isLoading = true;

            //options.testUrl = "/m2012/js/test/html/contactsData.js";//用测试数据
            if (options.testUrl) {
                //测试数据
                $.get(options.testUrl, function (responseText) {
                    This.onMainDataLoad(M139.JSON.tryEval(responseText), callback);
                });
            } else {
                var requestData = {
                    GetUserAddrJsonData: {
                        //UserNumber: this.getUserNumber()
                    }
                };
                M2012.Contacts.API.call("GetUserAddrJsonData", requestData,
                    function (e) {
                        This.isLoading = false;
                        if (e) {
                            if (e.responseData) {
                                if (e.responseData.ResultCode == "0") {
                                    This.onMainDataLoad(e.responseData, callback);
                                } else if (e.responseData.ResultCode == "216") {
                                    $App.trigger("change:sessionOut", {}, true);
                                } else {
                                    M139.Logger.getDefaultLogger().error('addrsvr response error', e.responseData);
                                }
                            } else {
                                M139.Logger.getDefaultLogger().error('addrsvr response invalid', e.responseText);
                            }
                        } else {
                            M139.Logger.getDefaultLogger().error('addrsvr response empty');
                        }
                    }
                );
            }
        },


        loadQueryUserInfo: function (callback) {
            if (SiteConfig.m2012NodeServerRelease && $App.isShowWelcomePage() && isFirstLoadQueryUserInfo) {
                //第一次加载读欢迎页内联json
                var data = getWelcomeInlinedJSON();
                if (data) {
                    setTimeout(function () {
                        inlinedCallback(data, true);
                    }, 0);
                } else {
                    $App.on("welcome_QueryUserInfo_load", function (data) {
                        inlinedCallback(data, true);
                    });
                }
            } else {
                var client = new M139.ExchangeHttpClient({
                    name: "ContactsLoadMainDataHttpClient",
                    responseDataType: "JSON2Object"
                });
                client.on("error", function(e) {
                    if (options && _.isFunction(options.error)) {
                        options.error(e);
                    }
                });
                var reqData = "<QueryUserInfo><UserNumber>" + $User.getUid() + "</UserNumber></QueryUserInfo>";
                client.request(
                {
                    method: "post",
                    url: "/addrsvr/QueryUserInfo?sid=" + $App.query.sid + "&formattype=json",
                    data: reqData
                }, callback);
            }
            isFirstLoadQueryUserInfo = false;
            function inlinedCallback(data, todoClone) {//TODO Clone
                if (todoClone) {
                    data = $App.deepCloneJSON(data);
                }
                callback({
                    responseData: data
                });
                inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
            }
            function getWelcomeInlinedJSON() {
                var json = null;
                try {
                    json = document.getElementById("welcome").contentWindow.inlinedQueryUserInfoJSON;
                } catch (e) { }
                return json;
            }
        },

        //获取个人资料
        getUserInfo: function (options, callback) {
            var self = this;            
            if (!top.$User) {
                return;
            }
            
            options = options || {};
            
            //options.refresh true  每次都刷新数据
            if(self.UserInfoData && !options.refresh){
                if (callback && typeof (callback) == "function") {
                    try {
                        callback(self.UserInfoData);
                        return;
                    } catch (ex) {}
                }
            }

            self.getUserInfoWaiting = true;
            this.loadQueryUserInfo(
                function (e) {
                    if (e && e.responseData) {
                        var code = e.responseData.ResultCode;
                        var data = {
                            "code": "S_FALSE", //这是取缓存验证用户失败时默认的返回code
                            "ResultCode": code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }
                            data = {
                                "code": "S_OK",
                                "var": self.userInfoTranslate(e.responseData["UserInfo"][0])
                            };
                        }
                        self.UserInfoData = data;
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                    self.getUserInfoWaiting = false;
                }
            );
        },
        contactRequest:function(apiName,options,callback){
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });
            if (!options) { options = {}; }
            options.UserNumber = top.$User.getUid();
            var reqData = {};
            reqData[apiName]= options

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/"+apiName+"?sid=" + top.$App.query.sid + "&formattype=json",
                    data: reqData
                },
                function (e) {
                    if (callback) {callback(e); }
                }
            );
        },
        //修改个人资料
        modifyUserInfo: function (userInfo, callback) {
			var self = this;
            this.contactRequest("ModUserInfo", userInfo, function (e) {
				self.UserInfoData = null;
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });
        },
        modifyGroup:function(options,callback){
            //<EditGroupList><UserNumber>8613590330157</UserNumber><GroupId>1171021884</GroupId><SerialId>1025214752</SerialId><GroupType>1</GroupType></EditGroupList>
            this.contactRequest("EditGroupList", options, function (e) {
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });

        },
        userInfoTranslate: function (UserInfo) {
            var map = {
                "a": "UserType",
                "b": "SourceType",
                "c": "AddrFirstName",
                "d": "AddrSecondName",
                "e": "AddrNickName",
                "f": "UserSex",
                "g": "CountryCode",
                "h": "ProvCode",
                "i": "AreaCode",
                "j": "CityCode",
                "k": "StreetCode",
                "l": "ZipCode",
                "m": "HomeAddress",
                "n": "MobilePhoneType",
                "o": "BirDay",
                "p": "MobilePhone",
                "q": "BusinessMobile",
                "r": "BusinessPhone",
                "s": "FamilyPhone",
                "t": "BusinessFax",
                "u": "FamilyFax",
                "v": "OtherPhone",
                "w": "OtherMobilePhone",
                "x": "OtherFax",
                "y": "FamilyEmail",
                "z": "BusinessEmail",
                "c2": "OtherEmail",
                "c3": "PersonalWeb",
                "c4": "CompanyWeb",
                "c5": "OtherWeb",
                "c6": "OICQ",
                "c7": "MSN",
                "c8": "OtherIm",
                "c9": "CPCountryCode",
                "d0": "CPProvCode",
                "d1": "CPAreaCode",
                "a0": "CPCityCode",
                "a1": "CPStreetCode",
                "a2": "CPZipCode",
                "a3": "CPAddress",
                "a4": "CPName",
                "a5": "CPDepartName",
                "a6": "Memo",
                "a7": "ContactCount",
                "a8": "ContactType",
                "a9": "ContactFlag",
                "b0": "SynFlag",
                "b1": "SynId",
                "b2": "RecordSeq",
                "b3": "FirstNameword",
                "b4": "CountMsg",
                "b5": "StartCode",
                "b6": "BloodCode",
                "b7": "StateCode",
                "b8": "ImageUrl",
                "b9": "SchoolName",
                "c0": "BokeUrl",
                "c1": "UserJob",
                "e1": "FamilyPhoneBrand",
                "e2": "BusinessPhoneBrand",
                "e3": "OtherPhoneBrand",
                "e4": "FamilyPhoneType",
                "e5": "BusinessPhoneType",
                "e6": "OtherPhoneType",
                "e7": "EduLevel",
                "e8": "Marriage",
                "e9": "NetAge",
                "e0": "Profession",
                "f1": "Income",
                "f2": "Interest",
                "f3": "MoConsume",
                "f4": "ExpMode",
                "f5": "ExpTime",
                "f6": "ContactMode",
                "f7": "Purpose",
                "f8": "Brief",
                "f9": "FavoEmail",
                "f0": "FavoBook",
                "g1": "FavoMusic",
                "g2": "FavoMovie",
                "g3": "FavoTv",
                "g4": "FavoSport",
                "g5": "FavoGame",
                "g6": "FavoPeople",
                "g7": "FavoWord",
                "g8": "Character",
                "g9": "MakeFriend",
                "ui": "UserInfo",
                "un": "UserNumber",
                "sd": "SerialId",
                "gd": "GroupId",
                "gp": "Group",
                "gi": "GroupInfo",
                "ct": "Contacts",
                "ci": "ContactsInfo",
                "gl": "GroupList",
                "li": "GroupListInfo",
                "tr": "TotalRecord",
                "rc": "ResultCode",
                "rm": "ResultMsg",
                "gn": "GroupName",
                "cn": "CntNum",
                "ri": "RepeatInfo",
                "lct": "LastContacts",
                "lctd": "LastContactsDetail",
                "lci": "LastContactsInfo",
                "cct": "CloseContacts",
                "cci": "CloseContactsInfo",
                "an": "AddrName",
                "at": "AddrType",
                "ac": "AddrContent",
                "us": "UserSerialId",
                "ai": "AddrId",
                "lid": "LastId",
                "ate": "AddrTitle",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "cf": "ComeFrom",
                "cte": "CreateTime",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "Bct": "BirthdayContacts",
                "bci": "BirthdayContactInfo"
            }
            var result = {};
            for (elem in UserInfo) {
                if (map[elem]) {
                    result[map[elem]] = UserInfo[elem];
                }
            }
            return result;
        },
        //获取隐私设置
        getPrivateSettings: function (callback) {
            if (!window.$User) {
                return;
            }

            var self = this;
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                responseDataType: "JSON2Object"
            });

            var reqData = "<GetPrivacySettings><UserNumber>" + $User.getUid() + "</UserNumber></GetPrivacySettings>";

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/GetPrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {

                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var code = respData.ResultCode;
                        var data = {
                            "code": "S_FALSE" //这是取缓存验证用户失败时默认的返回code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }

                            data = {
                                "code": "S_OK",
                                "var": {
                                    "addMeRule": respData.WhoAddMeSetting,
                                    "UserInfoSetting": respData.UserInfoSetting //这个是一个对象
                                }
                            };
                        }
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                }
            );
        },

        //更新隐私设置
        //注意：经测试，如果UserInfoSetting未传递所有值，则未传递的值默认设置为“仅好友可见”，值为0
        //建议暂不使用此接口设置数据
        /*
        options={
              UserNumber:8613800138000, //此字段可忽略，会自动添加
              WhoAddMeSetting:0,
              UserInfoSetting:{
                AddrFirstName:0,
                UserSex:0,
                BirDay:0,
                ImageUrl:0,
                FamilyEmail:0,
                MobilePhone:0,
                FamilyPhone:0,
                OtherIm:0,
                HomeAddress:0,
                CPName:0,
                UserJob:0,
                BusinessEmail:0,
                BusinessMobile:0,
                BusinessPhone:0,
                CPAddress:0,
                CPZipCode:0
              }
            }
        */
        updatePrivateSettings: function (options, callback) {
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });

            var UserNumber = $User.getUid();
            var reqData = { "UserNumber": UserNumber }; //默认加上号码
            reqData = { "SavePrivacySettings": $.extend(reqData, options) };

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/SavePrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {
                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var result = {
                            "code": (respData.ResultCode == "0" ? "S_OK" : respData.ResultCode) || "FS_UNKNOWN",
                            "var": {
                                "msg": respData.ResultMsg || ""
                            }
                        };

                        if (callback) {
                            callback(result);
                        }
                    }
                }
            );
        },
        /**
         *获取通讯录数据
         */
        requireData: function (callback) {
            var data = this.get("data");
            if (data) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (!this.isLoading) {
                    this.loadMainData();
                }
                this.on("maindataload", function (data) {
                    this.off("maindataload", arguments.callee);
                    if (callback) {
                        setTimeout(function () {
                            callback(data);
                        }, 0);
                    }
                });
            }
        },

        /**通讯是否已加载*/
        isLoaded: function () {
            return !!this.get("data");
        },

        /**
         *通讯录数据加载完成后处理数据
         *@inner
         */
        onMainDataLoad: function (json, callback) {
            json.Groups = json.Group || json.Groups;

            //后台不输出数组的时候容错
            if (!json.LastContacts) json.LastContacts = [];
            if (!json.CloseContacts) json.CloseContacts = [];
            if (!json.BirthdayContacts) json.BirthdayContacts = [];
            if (!json.Contacts) json.Contacts = [];
            if (!json.Groups) json.Groups = [];
            if (!json.GroupMember) json.GroupMember = {};
            if (!json.NoGroup) json.NoGroup = [];

            json.TotalRecord = parseInt(json.TotalRecord);
            json.TotalRecordGroup = parseInt(json.TotalRecordGroup);
            json.TotalRecordRelation = parseInt(json.TotalRecordRelation);
            json.userSerialId = json.UserSerialId;

            var exports = {
                TotalRecord: json.TotalRecord,
                TotalRecordGroup: json.TotalRecordGroup,
                TotalRecordRelation: json.TotalRecordRelation,
                noGroup: json.NoGroup
            };

            //分组
            this.createGroupData({
                data: json,
                exports: exports
            });

            //联系人
            this.createContactsData({
                data: json,
                exports: exports
            });

            //组关系
            this.createGroupMemberData({
                data: json,
                exports: exports
            });
            //处理最近、紧密联系人
            this.createLastAndCloseContactsData({
                data: json,
                exports: exports
            });

            //处理生日联系人
            this.createBirthdayContactsData({
                data: json,
                exports: exports
            });
            
            //处理VIP联系人
            this.createVIPContactsData({
                data: json,
                exports: exports
            });
            
            //处理用户个人资料  QueryUserInfo合并至GetUserAddrJsonData接口输出
            if(json["UserInfo"] && json["UserInfo"][0]){
                this.UserInfoData = {
                    "code": "S_OK",
                    "var": this.userInfoTranslate(json["UserInfo"][0])
                };
            }

            this.set("data", exports);
            this.trigger("maindataload", exports);
            if (callback) callback(exports);
        },

        /**
         *加载通讯录主干数据后处理分组数据
         *@inner
         */
        createGroupData: function (options) {
            if (options.append) {
                //添加新组后更新缓存
                var data = this.get("data");
                var groups = data.groups;
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                var newGroup = {
                    GroupId: options.append.groupId,
                    id: options.append.groupId,
                    GroupName: options.append.groupName,
                    name: options.append.groupName,
                    CntNum: 0,
                    count: 0
                };
                groups.push(newGroup);
                groupsMap[newGroup.id] = newGroup;
                groupMember[newGroup.id] = [];
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataGroups = data.Groups;
                var groups = new Array(dataGroups.length);
                var groupsMap = {};
                for (var i = 0, len = dataGroups.length; i < len; i++) {
                    var g = dataGroups[i];
                    groupsMap[g.gd] = groups[i] = {
                        GroupId: g.gd,
                        id: g.gd,
                        GroupName: g.gn,
                        name: g.gn,
                        CntNum: g.cn,
                        count: g.cn
                    };
                }
                exports.groups = groups;
                exports.groupsMap = groupsMap;
            }
        },

        /**
         *加载通讯录主干数据后处理联系人数据
         *@inner
         */
        createContactsData: function (options) {
            if (options.remove) {
                var data = this.get("data");
                var serialId = options.serialId;
                delete data.contactsMap[serialId];
                delete data.contactsIndexMap[serialId];
                var contacts = data.contacts;
                for (var i = contacts.length - 1; i >= 0; i--) {
                    if (contacts[i].SerialId == serialId) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                data.emailHash = null;//清除字段缓存
            } else if (options.append) {
                var data = this.get("data");
                var newContacts = options.append;
                var contacts = data.contacts;
                var contactsMap = data.contactsMap;
                var contactsIndexMap = data.contactsIndexMap;
                var nogroup = data.noGroup;
                for (var i = 0; i < newContacts.length; i++) {
                    var c = newContacts[i];
                    c.Quanpin = c.FullNameword || "";
                    c.Jianpin = c.FirstWord || "";

                    var info = new M2012.Contacts.ContactsInfo(c);
                    contacts[contacts.length] = info;
                    contactsMap[info.SerialId] = info;
                    contactsIndexMap[info.SerialId] = contacts.length;
                }
                data.emailHash = null;//清除字段缓存
                data.TotalRecord += newContacts.length;
            }else{
                var exports = options.exports;
                var data = options.data;
                var dataContacts = data.Contacts

                var contacts = new Array(dataContacts.length);
                var contactsMap = {};
                var contactsIndexMap = {};

                var csClass = M2012.Contacts.ContactsInfo;
                for (var i = 0, len = dataContacts.length; i < len; i++) {
                    var c = dataContacts[i];
                    var info = new csClass({
                        SerialId: c.sd,
                        AddrFirstName: c.c,
                        AddrSecondName: c.d,
                        MobilePhone: c.p,
                        BusinessMobile: c.q,
                        OtherMobilePhone: c.w,
                        FamilyEmail: (c.y || "").toLowerCase(),
                        BusinessEmail: (c.z || "").toLowerCase(),
                        OtherEmail: (c.c2 || "").toLowerCase(),
                        FirstNameword: (c.b3 || "").toLowerCase(),
                        FamilyFax: c.u,
                        BusinessFax: c.t,
                        OtherFax: c.x,
                        ImageUrl: c.b8,
                        Quanpin: (c.d2 || "").toLowerCase(),
                        Jianpin: (c.d3 || "").toLowerCase(),
                        CPName: c.a4,
                        UserJob: c.c1
                    });
                    contacts[i] = info;
                    contactsMap[c.sd] = info;
                    contactsIndexMap[c.sd] = i;
                }
                exports.contacts = contacts;
                exports.contactsMap = contactsMap;
                exports.contactsIndexMap = contactsIndexMap;
            }

            //刷新通讯录标签
            var addrtab = $App.getTabByName("addr");
            if (addrtab) {
                addrtab.isRendered = false;
            }
        },

        updateContactsData: function (options) {
            var data = this.get("data");
            var contactinfos = options.modification;
            var map = data.map || [];
            var contacts = data.contacts;
            var contactsMap = data.contactsMap;
            var groupsMap = data.groupsMap;

            var j, k, flag, groups = [];

            for (k = contactinfos.length; k--; ) {

                var info = new M2012.Contacts.ContactsInfo(contactinfos[k]);
                contactsMap[info.SerialId] = info;

                for (j = contacts.length; j--; ) {
                    if (contacts[j].SerialId == info.SerialId) {
                        contacts[j] = info;
                        break;
                    }
                }

                //删除现有map后重建关系
                groups.length = 0;
                for (j = map.length; j--; ) {
                    if (map[j].SerialId == info.SerialId) {
                        groups.push(map[j].GroupId);
                        map.splice(j, 1);
                    }
                }

                //先删除groups、groupsMap 的联系人数，注意groups是旧的组关系
                for (j = groups.length; j--; ) {
                    flag = groupsMap[groups[j]];
                    flag.count = parseInt(flag.count) - 1;
                    flag.CntNum = parseInt(flag.CntNum) - 1;
                }

                //重建map
                groups = info.GroupId.split(','); //groups有""的元素
                for (j = groups.length; j--; ) {
                    if (groups[j]) {
                        map.push({ SerialId: info.SerialId, GroupId: groups[j] });
                        flag = groupsMap[groups[j]];
                        flag.count = parseInt(flag.count) + 1;
                        flag.CntNum = parseInt(flag.CntNum) + 1;
                    }
                }

                //更新未分组
                for (j = data.noGroup.length; j--; ) {
                    if (data.noGroup[j] == info.SerialId) {
                        data.noGroup.splice(j, 1);
                        break;
                    }
                }

                if (groups.length == 0) {
                    data.noGroup.push(String(info.SerialId));
                    if (data.groupedContactsMap) {
                        delete data.groupedContactsMap[info.SerialId];
                    }
                } else {
                    if (data.groupedContactsMap) {
                        data.groupedContactsMap[info.SerialId] = 1;
                    }
                }

            }
            if(data.emailHash){//还要更新二级hash缓存
                if(info.emails && info.emails.length>0){
                    data.emailHash[info.emails[0]]=info;
                 }
            }
            groups.length = 0;
            groups = null;
        },


        /**
         *加载通讯录主干数据后处理联系人组关系数据
         *@inner
         */
        createGroupMemberData: function (options) {
            if (options.append) {
                //添加组关系缓存
                var appendItem = options.append;//格式为{SerialId:"",groups:[]}
                var groups = appendItem.GroupId;
                
                groups = groups.length == 0 ? [] : groups;
                groups = _.isString(groups) ? groups.split(",") : groups;

                var data = this.get("data");
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                if (groups.length == 0) {
                    //如果没分组，联系人id添加到noGroup
                    data.noGroup.push(appendItem.SerialId);
                } else {
                    _.each(groups, function (gid) {
                        var gm = groupMember[gid];
                        if (_.isUndefined(gm)) {
                            data.groupMember[gid] = [];
                            gm = data.groupMember[gid];
                        }

                        gm.push(appendItem.SerialId);
                        groupsMap[gid].CntNum = gm.length;
                    });
                }
            } else {
                var data = options.data;
                var exports = options.exports;
                var contactsMap = exports.contactsMap;
                var groupsMap = exports.groupsMap;
                var groupMember = data.GroupMember;
                for (var gid in groupMember) {
                    var group = groupsMap[gid];
                    if (!group) {
                        if(/^\d+$/.test(gid)){
                            delete groupsMap[gid];//删除组脏数据
                        }
                    } else {
                        var members = groupMember[gid];
                        for (var i = 0; i < members.length; i++) {
                            if (!contactsMap[members[i]]) {
                                members.splice(i, 1);//删除联系人脏数据
                                i--;
                            }
                        }
                        group.CntNum = members.length;
                    }
                }
                exports.groupMember = groupMember;
            }
        },

        /**
         *加载通讯录主干数据后处理最近联系人和紧密联系人数据
         *@inner
         */
        createLastAndCloseContactsData: function (options) {
            if (options.append) {
                var data = this.get("data");

                var lastestContacts = data.lastestContacts;
                if (!$.isArray(lastestContacts)) {
                    return;
                }

                var items = options.append || [];
                for (var i = 0; i < items.length; i++) {
                    var l = items[i];
                    lastestContacts.unshift(l);
                }
                var map = {};
                //排除重复
                for (var i = 0; i < lastestContacts.length; i++) {
                    var l = lastestContacts[i];
                    if (map[l.AddrContent]) {
                        lastestContacts.splice(i, 1);
                        i--;
                    } else {
                        map[l.AddrContent] = 1;
                    }
                }
                if (lastestContacts.length > 50) {
                    lastestContacts.length = 50;
                }
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataLastContacts = data.LastContacts;
                var dataCloseContacts = data.CloseContacts;
                var lastestContacts = [];
                var closeContacts = [];


                for (var i = 0, len = dataLastContacts.length; i < len; i++) {
                    var l = dataLastContacts[i];
                    if (typeof l.ac == "object") continue;//不懂？
                    lastestContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }

                for (var i = 0, len = dataCloseContacts.length; i < len; i++) {
                    var l = dataCloseContacts[i];
                    if (typeof l.ac == "object") continue;
                    closeContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }
                exports.lastestContacts = lastestContacts;
                exports.closeContacts = closeContacts;
            }
        },

        /**
         *加载通讯录主干数据后处理过生日的联系人数据
         *@inner
         */
        createBirthdayContactsData: function (options) {
            var exports = options.exports;
            var data = options.data;
            var dataBirContacts = data.BirthdayContacts;
            var birthdayContacts = new Array(dataBirContacts.length);
            for (var i = dataBirContacts.length - 1; i >= 0; i--) {
                var k = dataBirContacts[i];
                birthdayContacts[i] = {
                    SerialId: k.sd,
                    AddrName: k.an,
                    MobilePhone: k.p,
                    FamilyEmail: k.y,
                    BusinessEmail: k.z,
                    OtherEmail: k.c2,
                    BirDay: k.o
                };
            };
            exports.birthdayContacts = birthdayContacts;
        },

        /**
         *处理vip联系人数据
         *@inner
         */
        createVIPContactsData: function (options) {
            //"Vip":[{"vipg":"1158807544","vipc":"188722633,998324356","vipn":"2"}]
            var data = options.data;
            var exports = options.exports;
            var vipData = data.Vip && data.Vip[0];
            var vip = {};
            if (vipData) {
                try{
                    vip.groupId = vipData.vipg;
                    vip.contacts = vipData.vipc ? vipData.vipc.split(",") : [];
                } catch (e) {
                    //todo
                }
            }
            exports.vip = vip;
        },

        /**
         *根据联系人id获得对象
         *@param {String} cid 联系人id (SerialId)
         *@returns {M2012.Contacts.ContactsInfo} 返回联系人对象
         */
        getContactsById: function (cid) {
            return this.get("data").contactsMap[cid] || null;
        },
        /**
         *根据联系人id获取当前联系人的所有组
         *@param {String} cid 联系人id (SerialId)
         *@returns [] 返回联系人组
         */
        getContactsGroupById: function(cid){
            var groups = [];
            var member = this.get("data").groupMember;
            for(var key in member){
                if(member[key] && member[key].length > 0){
                    if(member[key].join(',').indexOf(cid) > -1){
                        groups.push(key);
                    }
                }
            }

            return groups;
        },
        /**
         *根据组id获得对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupById: function (gid) {
            return this.get("data").groupsMap[gid] || null;
        },

        /**
         *根据组名获得组对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupByName: function (groupName) {
            var groups = this.getGroupList();
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                if (g.name === groupName) {
                    return g;
                }
            }
            return null;
        },


        /**
         *获得联系人的分组id列表
         *@param {String} serialId 联系人id
         *@returns {Object} 返回组对象
         */
        getContactsGroupId: function (serialId) {
            var groupMember = this.get("data").groupMember;
            var groups = [];
            for (var gid in groupMember) {
                var members = groupMember[gid];
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i] === serialId) {
                        groups.push(gid);
                        break;
                    }
                }
            }
            return groups;
        },

        /**
         *返回一个联系组的克隆列表
         *@returns {Array} 返回数组
         */
        getGroupList: function () {
            var groups = this.get("data");
            if (groups) {
                groups = groups.groups;
            }

            if (groups && _.isFunction(groups.concat)) {
                groups = groups.concat();
            } else {
                groups = [];
            }

            return groups;
        },
        /**
         *返回一个分组共有多少联系人，数据接口输出的有可能不准确，可纠正
         *@param {String} gid 组id (groupId)
         *@returns {Number} 返回组联系人个数
         */
        getGroupMembersLength: function (gid) {
            var group = this.getGroupById(gid);
            if (!group) {
                throw "M2012.Contacts.Model.getGroupContactsLength:不存在联系人分组gid=" + gid;
            }
            return group.CntNum;
        },
        /**
         *返回一个联系组的所有联系人id
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[seriaId,seriaId,seriaId]
         */
        getGroupMembersId: function (gid, options) {
            var result = this.getGroupMembers(gid, options);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = result[i].SerialId;
            }
            return result;
        },
        /**
         *返回一个联系组的所有联系人列表
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        getGroupMembers: function (gid, options) {
            options = options || {};
            var filter = options.filter;                        
            var cData = this.get("data");
            var contactsMap = cData.contactsMap;
            var groupMember = cData.groupMember;
            var result = [];
            if (gid == this.getVIPGroupId()) {
                result = this.getVIPContacts();
            } else {
                var gm = groupMember[gid];
                if (gm) {
                    for (var i = 0, len = gm.length; i < len; i++) {
                        var cid = gm[i];
                        var c = contactsMap[cid];
                        if (c) {
                            result.push(c);
                        }
                    }
                }
            }
            if (options && options.filter) {
                result = this.filterContacts(result, { filter: options.filter, colate: options.colate });
            }
            return result;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            var data = this.get("data");
            var result = [];
            var vip = data && data.vip;
            var contactsMap = data && data.contactsMap;
            if (vip && vip.contacts) {
                var contacts = vip.contacts;
                for (var i = 0; i < contacts.length; i++) {
                    var c = contacts[i];
                    var item = contactsMap[c];
                    if (item) {//vip联系人有可能被删除了
                        result.push(item);
                    }
                }
            }
            return result;
        },
        /**
         *获得vip分组id
         */
        getVIPGroupId: function () {
            var id = "";
            var data = this.get("data");
            if (data && data.vip) {
                id = data.vip.groupId;
            }
            return id;
        },

        /**
         *筛选联系人
         *@param {Array} contacts 要筛选的联系人
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选属性：email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        filterContacts: function (contacts, options) {
            var filter = options.filter;
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (filter == "email" && c.getFirstEmail()) {
                    result.push(c);
                } else if (filter == "mobile" && c.getFirstMobile()) {
                    result.push(c);
                } else if (filter == "fax" && c.getFirstFax()) {
                    result.push(c);
                } else if (options.colate && c.getFirstEmail().indexOf(filter) > -1) {
                    result.push(c); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
            }
            return result;
        },

        /**
         *绑定一些事件
         *@inner
         */
        initEvents:function(){
            var self = this;
            var E = "dataForMatch_email", M = "dataForMatch_mobile", F = "dataForMatch_fax";

            //清除用来做索引的缓存
            self.on("update", function (e) {
                if (e.type == "AddSendContacts" || e.type == "AddContacts" || e.type == "EditContacts") {
                    if (self.has(E)) {
                        self.unset(E);
                    }

                    if (self.has(M)) {
                        self.unset(M);
                    }

                    if (self.has(F)) {
                        self.unset(F);
                    }
                }
            });

            //重新加载联系人数据时，也清理做索引的缓存
            self.on("maindataload", function () {
                if (self.has(E)) {
                    self.unset(E);
                }

                if (self.has(M)) {
                    self.unset(M);
                }

                if (self.has(F)) {
                    self.unset(F);
                }
            });
        },

        //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
        getDataForMatch: function (filter) {
            var dataKey = "dataForMatch_" + filter;
            var data = this.get(dataKey);
            if (!data) {
                var contacts = this.filterContacts(this.get("data").contacts, {
                    filter: filter
                });
                data = getOldLinkManList(contacts, filter);
                this.set(dataKey, data);
            }
            return data;
            function getOldLinkManList(contacts, filter) {
                var key;
                if (filter == "email") {
                    key = "emails";
                } else if (filter == "fax") {
                    key = "faxes";
                } else if (filter == "mobile") {
                    key = "mobiles";
                }
                var linkManList = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var c = contacts[i];
                    var addrs = c[key];
                    for (var j = 0; j < addrs.length; j++) {
                        var addr = addrs[j];
                        linkManList.push({
                            name: c.name,
                            lowerName: c.lowerName,
                            addr: addr,
                            id: c.SerialId,
                            quanpin: c.Quanpin,
                            jianpin: c.Jianpin
                        });
                    }
                }
                return linkManList;
            }
        },
        /**
         *根据输入匹配联系人
         *@inner
         */
        getInputMatch: function (options) {
            var contacts = this.getDataForMatch(options.filter);
            var keyword = options.keyword;
            var len = contacts.length;
            var matches = [];
            var matchTable = {};
            var attrToNumber = {
                "addr": "01",
                "name": "02",
                "quanpin": "03",
                "jianpin": "04"
            }
            var numberToAttr = {
                "01": "addr",
                "02": "name",
                "03": "quanpin",
                "04": "jianpin"
            }
            var SPLIT_CHAR = "0._.0";//匹配键的分隔符
            //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
            function pushMatch(attrName, index, arrIndex) {
                var matchKey = index + SPLIT_CHAR + attrName;
                if (index < 10) matchKey = "0" + matchKey;
                var arr = matchTable[matchKey];
                if (!arr) matchTable[matchKey] = arr = [];
                arr.push(arrIndex);
            }
            for (var i = 0; i < len; i++) {
                var item = contacts[i];
                //if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
                var minIndex = 10000;
                var minIndexAttr = null;
                var index = item.addr.indexOf(keyword);
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.addr;
                }
                if (index == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
                index = item.lowerName.indexOf(keyword && keyword.toLowerCase());// update by tkh 用户输入的关键字统一转换成小写
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.name;
                }
                if (minIndex == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }

                if (!/[^a-zA-Z]/.test(keyword)) {
                    if (item.quanpin && item.jianpin) {
                        index = item.quanpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.quanpin;
                        }
                        if (minIndex == 0) {
                            pushMatch(minIndexAttr, minIndex, i);
                            continue;
                        }
                        index = item.jianpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.jianpin;
                        }
                    }
                }
                if (minIndexAttr) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
            }

            var allMatchKeys = [];
            for (var p in matchTable) {
                allMatchKeys.push(p);
            }
            allMatchKeys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            var MAX_COUNT = options.maxLength || 30;
            for (var i = 0; i < allMatchKeys.length; i++) {
                var k = allMatchKeys[i];
                var arr = matchTable[k];
                //从key中获取matchAttr和matchIndex，后面用于着色加粗
                var matchAttr = getAttrNameFromKey(k);
                var matchIndex = getMatchIndexFromKey(k);
                for (var j = 0; j < arr.length; j++) {
                    var arrIndex = arr[j];
                    matches.push({
                        info: contacts[arrIndex],
                        matchAttr: matchAttr,
                        matchIndex: matchIndex
                    });
                    if (matches.length >= MAX_COUNT) break;
                }
            }
            //var matchKey = index + SPLIT_CHAR + attrName;
            function getAttrNameFromKey(key) {
                return numberToAttr[key.split(SPLIT_CHAR)[1]];
            }
            function getMatchIndexFromKey(key) {
                return parseInt(key.split(SPLIT_CHAR)[0], 10);
            }
            return matches;
        },

        /**搜索联系人：姓名、拼音、传真、职位等
         *@param {String} keyword 搜索关键字
         *@param {Object} options 搜索选项集
         *@param {Array} options.contacts 要搜索的联系人集（否则是全部联系人）
         */
        search: function (keyword, options) {
            options = options || {};
            if (options.contacts) {
                var contacts = options.contacts;
            } else {
                var contacts = this.get("data").contacts;
                if (options.filter) {
                    contacts = this.filterContacts(contacts, { filter: options.filter });
                }
            }
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (c.match(keyword)) {
                    result.push(c);
                }
            }
            return result;
        },
        /**
         *得到地址
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getAddr: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getEmail(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getNumber(text);
            }
            return "";
        },
        /**
         *得到名字
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getName: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getName(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getName(text);
            }
            return "";
        },

        /**
         *得到发送文本 "name"<addr>
         *@param {String} name 姓名
         *@param {String} addr 地址
         *@example
         var text = model.getSendText("李福拉","lifula@139.com");
         var text = model.getSendText("李福拉","15889394143");
         */
        getSendText: function (name, addr) {
            name = (name || "") && name.replace(/["\r\n]/g, " ");
            return "\"" + name + "\"<" + addr + ">";
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByEmail: function (email) {
            email = $Email.getEmailQuick(email);
            var item = this.getHashContacts()[email];
            if (item) {
                return [item];
            } else {
                return [];
            }
        },

        getHashContacts:function(){
            var data = this.get("data");
            if (!data) return {};
            if (!data.emailHash) {
                var contacts = data.contacts;
                var hash = {};
                if (contacts) {
                    for (var i = 0, len = contacts.length; i < len; i++) {
                        var c = contacts[i];
                        for (var j = 0; j < c.emails.length; j++) {
                            hash[c.emails[j]] = c;
                        }
                    }
                }
                data.emailHash = hash;
            }
            return data.emailHash || {};
        },

        /**
         *根据手机号获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByMobile: function (mobile) {
            var data = this.get("data");
            var result = [];
            if (!data || !data.contacts) return result;
            for (var i = 0, contacts = data.contacts, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    if (c.mobiles[j] == mobile) {
                        result.push(c);
                    }
                }
            }
            return result;
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {String} 返回联系人姓名，如果找不到，返回@前的账号部分
         */
        getAddrNameByEmail: function (email) {
            email = email.trim();
            var c = this.getContactsByEmail(email);
            if (c && c.length > 0) {
                return c[0].name;
            } else {
                var name = $Email.getNameQuick(email);
                if (name && name.replace(/['"\s]/g,"") != "") {
                    return name;
                } else {
                    name = email.replace(/<[^>]+>$/, "");
                    if (name && name.replace(/['"\s]/g, "") != "") {
                        return name;
                    } else {
                        return email;
                    }
                }
            }
        },

        /**
         *更新通讯录缓存数据
         */
        updateCache: function (options) {
            var type = options.type;
            switch (type) {
                case "AddGroup":
                    this.createGroupData({
                        append:options.data
                    });
                    break;
                case "DeleteContacts":
                    this.createContactsData({
                        remove:options.data
                    });
                    break;

                case "AddSendContacts":
                    //添加最近联系人
                    this.createLastAndCloseContactsData({
                        append: options.data.items
                    });
                    var newContacts = options.data.newContacts;
                    //添加新联系人
                    if (newContacts && newContacts.length > 0) {
                        this.createContactsData({
                            append:newContacts
                        });

                        for (var i = 0, m = newContacts.length; i < m; i++) {
                            this.createGroupMemberData({ append: newContacts[i] });
                        }
                    }

                    //if (c.GroupId) {
                    //    var groups = c.GroupId.split(','), group;
                    //    for (var j = groups.length; j--; ) {
                    //        group = data.groupMember[groups[j]];
                    //        if (group) {
                    //            group.push(info.SerialId);
                    //        }

                    //        group = data.groupsMap[groups[j]];
                    //        if (group) {
                    //            group.CntNum = Number(group.CntNum) + 1;
                    //            group.count = group.CntNum;
                    //        }
                    //    }
                    break;

                case "AddContacts":
                    this.createContactsData({
                        append: _.isArray(options.data) ? options.data : [options.data]
                    });
                    var data = _.isArray(options.data) ? options.data[0] : options.data;
                    if (data && data.GroupId) {
                        this.createGroupMemberData({
                            append: data
                        });
                    }
                    break;

                case "EditContacts":
                    this.updateContactsData({
                        modification: _.isArray(options.data) ? options.data : [options.data]
                    });
                    break;

            }

            /**服务端响应事件
            * @name M2012.Contacts.Model#update
            * @event
            * @param {Object} e 事件参数
            * @param {String} e.type 更新行为：AddGroup|AddContacts|EditGroup
            * @param {Object} e.data 更新的数据
            * @example
            model.on("update",function(e){
                console.log(e.type);
                console.log(e);
            });
            */
            this.trigger("update", options);

        },

        /**
         * 获取通讯录现有总条数
         * @param {Function} 回调函数，这是可等待数据加载成功后才给出的
         * @return {Number} 总条数，如果未加载到数据，则返回 -1
         */
        getContactsCount: function(callback) {

            if (callback) {
                M139.Timing.waitForReady('"undefined" !== typeof top.$App.getModel("contacts").get("data").contacts.length', function () {
                    callback(this.get("data").contacts.length);
                });
            }

            if (this.isLoaded()) {
                return this.get("data").contacts.length;
            } else {
                return -1;
            }
        }
    }));


    jQuery.extend(M2012.Contacts,
    /**@lends M2012.Contacts*/
    {
        /**返回一个M2012.Contacts.Model模块实例*/
        getModel: function () {

            if (window != window.top) {
                return top.M2012.Contacts.getModel();
            }

            if (!this.current) {
                this.current = new M2012.Contacts.Model();
            }
            return this.current;
        }

    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录的Http客户端类.
 */

  /*global Contacts: false */

(function (M139) {

    function _getUrl_(page, type) {
        return "/sharpapi/addr/apiserver/" + page + "?sid=" + $App.getSid() + (type ? "&APIType=" + type : "") + "&r=" + Math.random();
    }

    function addrInterfaceUrl (action) {
        return _getUrl_("addrinterface.ashx", action);
    }

    var namespace = "M2012.Contacts.HttpClient";
    M139.namespace(namespace, M139.ExchangeHttpClient.extend(
    /**
    *@lends M2012.Contacts.HttpClient.prototype
    */
    {
        /** 与通讯录通讯的http客户端类，调用接口有两种方式，一种是提供报文，调用request，一种是以注册的形式添加方法
        *@constructs M2012.Contacts.HttpClient
        *@extends M139.ExchangeHttpClient
        *@param {Object} options 初始化配置，参数继承M139.HttpClient的初始化参数
        *@example
        var contactsClient = new M2012.Contacts.HttpClient();
        */
        initialize: function (options) {
            M139.ExchangeHttpClient.prototype.initialize.apply(this, arguments);
            this.router = M139.HttpRouter;

            this.router.addRouter("addr", [
                "GetUserAddrJsonData", "QueryUserInfo", "ModUserInfo", "QueryContactsImageUrl","GetLastContactsDetail","AddUserInfo","WhoAddMe",
                "AddGroupList","DelGroupList","AddCAndGToGroup","EditGroupList","DelContacts","AddGroup","AddBatchContacts","GetDealList","ModDealStatus",
                "AgreeOrRefuseAll","QueryContactsInGroup","GetRepeatContacts","AddContacts","ModContacts","DelLastContacts","ModGroup","MoveGroupList",
                "MergeContacts","QueryMergeResult","DelLCContacts","ModContactsField",
                "GetNumWaitForCleaning", "QueryInfoWaitForCleaning", "OneKeyClean",
                "BatchQuery", "GetUncompletedContacts",
                "GetPrivacySettings", "SavePrivacySettings", 
                "GetRepeatContactsNew","AutoMergeContacts","QueryContactsAndGroup",
				"GetBatchImageUrl", "WhoAddMeByPage"
            ]);
            this.router.addRouter("addr_p3_gw", [
                "andAddr:readGroups", "andAddr:readGroupContacts", "andAddr:readContactDetail"
            ]);
            this.router.addRouter("webdav", [
                "wangyisync", "googlesync"
            ]);
        },

        defaults: {
            name: namespace,
            requestDataType: "ObjectToXML2",
            responseDataType: "JSON2Object"
        },

        /**
        *继承自M139.ExchangeHttpClient.request方法， 增加了一些参数功能
        *@see M139.ExchangeHttpClient#request
        *@param {Object} options 配置参数
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
            //请求父类的方法
            M139.ExchangeHttpClient.prototype.request.apply(this, arguments);
            return this;
        },
        /**@inner*/
        onResponse: function (info) {
            var This = this;
            M139.ExchangeHttpClient.prototype.onResponse.apply(this, arguments);
        }
    }));

    //提示语
    var YIBUMSG = {
        addfail: "添加失败",
        addsuccess: "联系人添加成功",
        addcontactfail: "联系人添加失败",
        addfailunknown: "添加失败,未知错误",
        addfailserver: "添加失败,服务器异常",
        editfail: "系统繁忙，请稍候再试",
        processing: "程序运行中,请稍候",
        ajax_othererror: "系统繁忙，请稍后再试",
        groupname_not_exists: "组名不能为空",
        group_alreadyexists: "组名已存在",
        groupadded: "添加组成功",
        groupmodified: "组修改成功",
        groupdeleted: "删除成功",
        contactdeleted: "删除成功",
        contactcopyed: "复制成功",
        contactmoved: "移动成功",
        groupsaved: "保存成功",
        contactreaded: "获取成功",
        contactsaved: "保存成功",
        saveing: "保存中……",
        memooverlimit: "您合并通讯录重复联系人资料，超过备注可显示的资料已发送到您的邮箱。",
        sysbusy: "系统繁忙，请稍候再试。",
        merging: "自动合并操作正在处理中，请不重复提交。",
        fail_commitmerge: "提交自动合并请求失败。",
        warn_contactexists: "通讯录已存在邮箱/手机相同的联系人",
        warn_emailRepeat: "该邮箱已存在，是否仍要保存？",
        warn_mobileRepeat: "该手机号已存在，是否仍要保存？",
        isAlwaysSave: "是否仍要保存？",
        sysUpdateing: "暂时无法处理该请求，请稍后再试",
		contactexisted: {
			"224": "手机号码已存在",
			"225": "商务手机已存在",
			"226": "电子邮箱已存在",
			"227": "商务邮箱已存在"
			},
		groupoverLimit:       "联系人分组已达上限",
		groupcontactsoverlimit: "保存失败，分组联系人总数已达上限5000"
    };

    var ERR_CONTACT_OVERLIMIT = "21";
    var ERR_CONTACT_GROUPEDLIMIT = "23";
    var ERR_CONTACT_REACHLIMIT = "24";
    var ERR_CONTACT_REPEAT = "28";
    var ERR_CONTACT_EDIT_EXIST_LIST = ["224", "225", "226", "227"];//编辑已存在联系人

    var ERROR_MESSAGE = {
        OVER_LIMIT: '保存失败，联系人数量已达上限3000。<a href="javascript:top.FF.close();top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>添加更多！',
        REACH_LIMIT: '保存联系人部分成功，联系人数量超出上限部分未保存，你可以<a href="javascript:top.FF.close();top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>添加更多！',
        REPEAT: '保存联系人失败，联系人已存在。',
        NAME_LENGTH_ERROR: "联系人姓名太长了",
        EMAIL_ERROR: "邮箱格式不正确。<br/>应如zhangsan@139.com，长度6-90位",
        MOBILE_LENGTH_ERROR: "手机号码格式不正确，请输入3-20位数字"
    };
    /**
    *实例化M2012.Contacts.HttpClient，然后封装使用的过程
    *@namespace 
    *@name M2012.Contacts.API
    */
    M139.core.namespace("M2012.Contacts.API",
    /**@lends M2012.Contacts.API*/
    {
        call: function (api, data, callback, options) {
            //var url = "/s?func=" + api + "&sid=" + $T.Url.queryString("sid") + "&rnd="+Math.random();
            options = options || {};
            var client = new M2012.Contacts.HttpClient({});
            var url = api.indexOf("/") > -1 ? api : client.router.getUrl(api);

            if (options.loadingMsg) {
                if (options.loadingMsg) {
                    top.M139.UI.TipMessage.show(options.loadingMsg);
                }
            }

            var scope = this;
            if (options && options.scope) {
                scope = options.scope;
            }

            client.on('error', function() {
                if (options.error) {
                    options.error.apply(client, arguments);
                } else {
                    callback.call(scope, { responseData: null, status: arguments[0].status, responseText: arguments[0].responseText });
                }
            });

            //注意处理异常
            var httpMethod = "post";
            if (options.httpMethod) {
                httpMethod = options.httpMethod;
            }
            client.request({
                url: url,
                method: httpMethod,
                data: data,
                requestDataType: options.requestDataType,
                responseDataType: options.responseDataType
            }, function (e) {
                if (options.loadingMsg) {
                    try{
                        top.M139.UI.TipMessage.hide();
                    } catch (e) { }
                }

                callback.call(scope, e);                
            });
        },



        //验证新增联系人数据 todo move
        validateAddContacts: function (obj) {
            var result = {};
            var error = "";
            if (!obj.name || obj.name.trim() == "") {
                error = "请输入联系人姓名";
            } else if (obj.name.trim().getByteCount() > 100) {
                error = ERROR_MESSAGE.NAME_LENGTH_ERROR;
            } else if (!obj.email && !obj.mobile) {
                error = "电子邮箱和手机号码，请至少填写一项";
            } else if (obj.email) {
                /*
                通用的E-MAIL正则表达式校验，长度6-90位（数据库字段长度为90）；
                */
				
                if (!M139.Text.Email.isEmail(obj.email)) {
                    error = ERROR_MESSAGE.EMAIL_ERROR;
                } else if (obj.email.length < 6 || obj.email.length > 90) {
                    error = ERROR_MESSAGE.EMAIL_ERROR;
                }
            }
            if (!error && obj.mobile) {
                /*
                手机号码：
                长度3-20位数字并支持“-”分隔符的输入。（数据保存到数据库中需要将“-”过滤掉）。
                */
                if (!/^\d([\d-])+\d$/.test(obj.mobile) || obj.mobile.replace(/\D/g, "").length > 20) {
                    error = ERROR_MESSAGE.MOBILE_LENGTH_ERROR;
                }
            }

            if(obj.newGroup){
                if (Contacts.getGroupByName(obj.newGroup)) {
                    delete obj.newGroup;
                }
            }

            result.error = error;
            return result;
        },

        //自动保存联系人
        /*
        xml=<AddLastContacts><AddContactsInfo><SerialId>0</SerialId><AddrName>kkkkkkk</AddrName><AddrType>E</AddrType><AddrContent>kkkkkkk@rd139c.om</AddrContent><AddrMobile></AddrMobile><AddrId>0</AddrId><AddrTitle>title</AddrTitle><ComeFrom>1</ComeFrom></AddContactsInfo>
<AddContactsInfo><SerialId>0</SerialId><AddrName>bbbbbb</AddrName><AddrType>E</AddrType><AddrContent>bbbbbb@rd139.com</AddrContent><AddrMobile></AddrMobile><AddrId>0</AddrId><AddrTitle>title</AddrTitle><ComeFrom>1</ComeFrom></AddContactsInfo></AddLastContacts>
        */
        /**
         *发送成功后添加最近联系人
         *@param {Object} options 参数集合
         *@param {String} options.type email|mobile|fax
         *@param {Array} options.list 添加的列表
         *@example
         M2012.Contacts.API.addSendContacts({
            type:"email",
            list:[
                '"李福拉"&ltlifula@139.com&gt;',
                '"帅哥"&lt;lifl@richinfo.cn&gt;'
            ]
         },function(e){
         
         });

         */
        addSendContacts: function (options, callback) {
            var This = this;
            var items = [];
            var type = options.type;
            var addr = options.list;
            var _subject = options.subject;
            var from = options.from || 0;

            if (type == "mobile") {
                $(addr).each(function (index, value) {
                    var list = [];

                    list = Contacts.getContactsByMobile(this.toString());
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "M", AddrContent: this.toString() });
                    } else {

                        var mobile = M139.Text.Mobile.getNumber(value);
                        mobile = M139.Text.Mobile.remove86(mobile);
                        items.push({
                            SerialId: "0",
                            AddrName: mobile,
                            AddrType: "M",
                            AddrContent: mobile,
                            AddrMobile: mobile,
                            AddrId: "0",
                            AddrTitle: "",
                            ComeFrom: from || "1"
                        });
                    }
                })
            } else if (type == "fax") {
                $(addr).each(function (index, value) {
                    var list = [];//todo Contacts.getContactsByFax(this.toString());
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "F", AddrContent: value });
                    } else {
                        items.push({ SerialId: "0", AddrName: value, AddrType: "F", AddrContent: value });
                    }
                })
            } else {
                $(addr).each(function (index, value) {
                    var list = [];

                    list = Contacts.getContactsByEmail(M139.Text.Email.getEmail(value));
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({
                            SerialId: info.SerialId,
                            AddrType: "E",
                            ComeFrom: from,
                            AddrTitle: _subject,
                            AddrName: M139.Text.Email.getName(value),
                            AddrContent: M139.Text.Email.getEmail(value)
                        });
                    } else {
                        items.push({
                            SerialId: "0",
                            AddrType: "E",
                            ComeFrom: from,
                            AddrTitle: _subject,
                            AddrName: M139.Text.Email.getName(value),
                            AddrContent: M139.Text.Email.getEmail(value)
                        });
                    }
                })
            }
            var requestData = {
                AddLastContacts: {
                    "AddContactsInfo": items
                }
            }
            //todo
            if (options.autoSave) {
                //自动保存联系人
                var requestUrl = _getUrl_("autosavecontact.ashx");
            } else {
                var requestUrl = _getUrl_("addlastcontacts.ashx");
            }
            this.call(requestUrl, requestData, function (e) {
                var result = {};
                var json = e.responseData;
                if (json) {
                    if (json.ResultCode == "0") {
                        result.success = true;
                        //保存了多个是返回数组
                        if (_.isArray(json.ContactsInfo)) {
                            result.list = json.ContactsInfo;
                        } else if (typeof json.ContactsInfo == "object") {
                            result.list = [json.ContactsInfo];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        This.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:items,
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        //todo
                        result.error = YIBUMSG.sysbusy;
                    }
                } else {
                    result.success = false;
                    result.error = "未知异常";
                }
            },
            {
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "XML2Object"
            });
        },

        /**
         *删除联系人
         *@param {Object} options 参数集合
         *@param {String} options.serialId 要删除的联系人id
         */
        deleteContacts: function (options, callback) {
            var This = this;
            var serialId = options.serialId;
            var requestBody = {
                DelContacts: {
                    SerialId: serialId
                }
            };

            var requestUrl = "/addrsvr/DelContacts?formattype=json&sid=" + $App.getSid();

            this.call(requestUrl, requestBody, function (e) {
                var json = e.responseData;
                var result = {};
                if (json) {
                    if (json.ResultCode == "0") {
                        result.success = true;
                        result.msg = YIBUMSG.contactdeleted;
                        This.updateCache({
                            type: "DeleteContacts",
                            data: {
                                serialId: serialId
                            }
                        });
                    } else {
                        result.success = false;
                        result.error = YIBUMSG.sysbusy;
                    }
                } else {
                    result.success = false;
                    result.error = YIBUMSG.sysbusy;
                }
                if (callback) {
                    callback(result);
                }
            }, {
                loadingMsg: "正在删除联系人..."
            });
        },

        /**
         *添加联系人
        */
        addContacts: function (info, callback, options) {
            var This = this;
            options = options || {};
            var result = {};

            var result = this.validateAddContacts(info);
            if (result.error) {
                result.success = false;
                if (callback) {
                    callback(result);
                }
                return;
            }

            var groupId = _.isArray(info.groupId) ? info.groupId.join(",") : info.groupId;
            var requestBody = {
                AddContacts: {
                    UserType: 1,
                    AddrFirstName: info.name,
                    MobilePhone: info.mobile,
                    FamilyEmail: info.email,
                    BusinessFax: info.fax,
                    GroupId: groupId,
                    AddGroupName: info.newGroup,
                    AddNewGroup: Boolean(info.newGroup),
                    DealStatus: info.DealStatus,
                    SecondUIN: info.SecondUIN
                }
            };

            var message = {loadingMsg:"正在添加联系人..."};
            var requestUrl = "/addrsvr/AddContacts?formattype=json&sid=" + $App.getSid();

            if (options.thingid) {
                requestUrl += "&thingid=" + options.thingid;
            }

            if(info.DealStatus && info.SecondUIN){
                message = {};
            }

            this.call(requestUrl, requestBody, function (e) {

                var addResult = e.responseData;
                if (addResult) {

                    //添加成功
                    if (addResult.ResultCode == "0") {
                        var contactinfos = addResult.ContactsInfo;

                        result.success = true;
                        result.msg = YIBUMSG.addsuccess;

                        if (contactinfos && contactinfos.length) {

                            for (var i = 0; i < contactinfos.length; i++) {
                                contactinfos[i].AddrFirstName = info.name;
                                contactinfos[i].MobilePhone = info.mobile;
                                contactinfos[i].FamilyEmail = info.email;
                                contactinfos[i].BusinessFax = info.fax;
                                contactinfos[i].GroupId = groupId;
                            }

                            This.updateCache({
                                type: "AddContacts",
                                data: contactinfos
                            });
                        }

                        result.contacts = contactinfos;

                        if (callback) {
                            callback(result);
                        }
                        //todo 更新积分？
                        /*
                        try {
                            GlobalEvent.broadcast("contacts_change");
                            if (top.postJiFen) {
                                top.postJiFen(72, 1);
                            }
                        } catch ( e ) { }
                        */
                    } else {

                        var msg = "";
                        switch (addResult.ResultCode) {
                            case ERR_CONTACT_OVERLIMIT:
                                msg = ERROR_MESSAGE['OVER_LIMIT'];
                                msg = msg.replace("3000", $User.getMaxContactLimit());
                                break;
                            case ERR_CONTACT_REACHLIMIT:msg = ERROR_MESSAGE['REACH_LIMIT'];break;
                            case ERR_CONTACT_REPEAT:msg = ERROR_MESSAGE['REPEAT'];break;
                            case ERR_CONTACT_GROUPEDLIMIT:msg = YIBUMSG.groupcontactsoverlimit;break;
                            default: 
                                msg = YIBUMSG.contactexisted[addResult.ResultCode];
                                if (!msg) { msg = YIBUMSG.addcontactfail; }
                                break;
                        }
                        result.success = false;
                        result.msg = msg;
                        result.error = msg;
                        if (callback) {
                            callback(result);
                        }
                    }
                } else {
                    result.success = false;
                    result.msg = YIBUMSG.addfailunknown;
                    result.error = result.msg;
                    if (callback) {
                        callback(result);
                    }
                }
            }, message);
        },

        //AutoSaveReceivers保存单个联系人 不加积分需求
        addBatchContactsNew: function(obj, callback) {
            var list = obj.sort ? obj:[obj];
			
            var validateResult = this.validateAddContacts(list[0]);
            if (validateResult.error) {
                validateResult.success = false;
                if (callback) {
                    callback(validateResult);
                }
                return;
            }

            var _list = $.map(list, function(i) {
                var item = { Name: i.name, SourceType: 2 };
                if (i.email) {
                    item.Email = i.email;
                }

                if (i.mobile) {
                    item.MobilePhone = i.mobile;
                }

                if (i.GroupId) {
                    item.GroupId = i.GroupId;
                }

                return item;
            });

            var requestBody = {
                AutoSaveReceivers: {
                    Count: 1,
                    ContactsInfo: _list
                }
            };

            var requestUrl = "/addrsvr/AutoSaveReceivers?formattype=json&sid=" + $App.getSid();

            var _this = this;
            _this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    var code = e.responseData.ResultCode;
                    if (code == "0") {
                        result.success = true;
                        
                        var ci = e.responseData.ContactsInfo;

                        if (_.isArray(ci)) {
                            for (var i=0; i<ci.length; i++) {
                                $.each(_list, function(index, item) {
                                    if (item.Email == ci[i].FamilyEmail) {
                                        ci[i].GroupId = item.GroupId;
                                        return false;
                                    }
                                });
                            }
                            result.list = ci;
                        } else if (typeof ci == "object") {
                            result.list = [ci];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        _this.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:[],
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        result.msg = YIBUMSG.addfailunknown
                        if (callback) {
                            callback(result);
                        }
                    }
                }
            });
        },

        /**
         *添加联系组
         *@param {String} groupName 添加的组名称
         *@param {Function} callback 操作结果回调函数
        */
        addGroup: function (groupName, callback) {
            var This = this;
            if(groupName==""){
                if(callback)callback({success:false,msg: YIBUMSG.groupname_not_exists});
                return;
            }
            var group = M2012.Contacts.getModel().getGroupByName(groupName);
            if(group){
                if(callback)callback({success:false,msg:YIBUMSG.group_alreadyexists});
                return;    
            }
            var requestBody = {
                AddGroup:{
                    GroupName:groupName
                }
            };
            //todo
            var requestUrl = "/addrsvr/AddGroup?formattype=json&sid=" + $App.getSid();
            this.call(requestUrl, requestBody, function (e) {
                var addResult = e.responseData;
                var result = {};
                if (addResult) {
                    var resultCode = addResult.ResultCode;
                    if (resultCode == "0") {
                        result.success = true;
                        result.msg = YIBUMSG.groupadded;
                        result.groupId = addResult.GroupInfo[0].GroupId;
                        result.groupName = groupName;
                        //更新缓存
                        This.updateCache({
                            type: "AddGroup",
                            data: result
                        });
                    } else {
                        if (resultCode == "9") {
                            result.error = YIBUMSG.group_alreadyexists;
                        } else {
                            result.error = YIBUMSG.addfailunknown;
                        }
                        result.success = false;
                    }
                } else {
                    result.success = false;
                    result.error = YIBUMSG.addfailunknown;
                }
                if(callback){
                    callback(result);
                }
            }, {
                loadingMsg: "正在添加分组..."
            });
        },

        /**
         *获得联系人详细资料
         *@param {String} serialId 联系人id
         *@param {Function} callback 回调函数
         *@example
         M2012.Contacts.API.getContactsDetail("602955467",function(result){
            alert(JSON.stringify(result));
         });
        */
        getContactsDetail: function (serialId, callback) {
            var This = this;
            var requestBody = {
                QueryContactsAndGroup: {
                    SerialId: serialId,
                    UserNumber: $User.getUid()
                }
            };
            //todo
            var requestUrl = "/addrsvr/QueryContactsAndGroup?sid=" + $App.getSid();
            this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    if (e.responseData.rc == "0") {
                        var info = e.responseData.ci;
                        //翻译简写属性
                        var c = M2012.Contacts.getModel().userInfoTranslate(info);
                        result.success = true;
                        result.data = c;
                    } else {
                        result.success = false;
                        //todo
                        result.error = e.responseData.rm || "未知异常";
                    }
                    
                }else{
                    result.success = false;
                    //todo
                    result.error = "未知异常";
                }
                if (callback) {
                    callback(result);
                }
                
            }, {
                responseDataType: "XML2Object"
            });
        },
        /*
        <?xml version="1.0" encoding="UTF-8"?><ModContactsResp><ResultCode>0</ResultCode><ResultMsg>Operate successful</ResultMsg><ContactsInfo><SerialId>160126039</SerialId><FirstNameword>Z</FirstNameword><FullNameword>zhanggangzuchang（jiangaojixitongweihugongchengshi)</FullNameword><FirstWord>zgzc（jgjxtwhgcs)</FirstWord></ContactsInfo></ModContactsResp>
        */
        /**
         *编辑联系人
         *@param {String} serialId 联系人id
         *@param {Object} info 编辑的字段集合：name，email，mobile，groupId
         *@param {Function} callback 回调函数
         *@example
         M2012.Contacts.API.editContacts("602955467",{
            name:"改个名",
            mobile:"15889394143"
         },function(result){
            alert(JSON.stringify(result));
         });
        */
        editContacts: function (serialId, info, callback) {
            var This = this;


            var result = this.validateAddContacts(info);
            if (result.error) {
                result.success = false;
                if (callback) {
                    callback(result);
                }
                return;
            }

            this.getContactsDetail(serialId, function (e) {
                if (!e.success) {
                    if (callback) {
                        callback(e);
                    }
                } else {
                    var c = e.data;
                    c.AddrFirstName = info.name;
                    c.FamilyEmail = info.email;
                    c.MobilePhone = info.mobile;
                    c.GroupId = _.isArray(info.groupId) ? info.groupId.join(",") : (info.groupId || "");
                    update(c);
                }
            });


            function update(c) {
                var requestBody = {
                    ModContacts: c
                };
                //todo
                var requestUrl = "/addrsvr/ModContacts?formattype=json&sid=" + $App.getSid();
                This.call(requestUrl, requestBody, function (e) {
                    var result = {};
                    if (e.responseData) {
                        var code = e.responseData.ResultCode;
                        if (code == "0") {
                            result.success = true;
                            result.msg = YIBUMSG.contactsaved;
                            result.data = e.responseData.ContactsInfo;

/*
result: Object
    data: Array[1]
        0: Object
            FirstNameword: "S"
            FirstWord: "sd"
            FullNameword: "shandong"
            SerialId: "1408641207"

c: Object
    AddrFirstName: "山东"
    ContactCount: "0"
    ContactFlag: "0"
    ContactType: "0"
    FamilyEmail: "test9167@139.com"
    FirstNameword: "S"
    GroupId: "1406706914,1406730786,1406748929"
    MobilePhone: ""
    RecordSeq: "591398532"
    SerialId: "1408641207"
    SourceType: "2"
    SynFlag: "0"
    SynId: "0"
    UserSex: "2"
    UserType: "1"
*/
                            if (Boolean(result.data.length)) {
                                c.FirstWord = result.data[0].FirstWord;
                                c.FirstNameword = result.data[0].FirstNameword;
                                c.FullNameword = result.data[0].FullNameword;
                            }

                            This.updateCache({
                                type: "EditContacts",
                                data: c
                            });
                            if(top.$App){//避免其它页面引用
                                top.$App.trigger("ContactsDataChange",{type:"EditContacts"});
                            }

                        } else {
                            result.success = false;
                            if (code == ERR_CONTACT_REPEAT) {
                                result.error = YIBUMSG.warn_contactexists;
                            }
                            else if ($.inArray(code, ERR_CONTACT_EDIT_EXIST_LIST) > -1) {
                                //编辑已存在联系人，继续提示用户是否保存
                                result.holdon = true;
                                result.resultCode = code;
                            }
                            else {
                                //todo
                                result.error = YIBUMSG.editfail || e.responseData.ResultMsg || "未知异常";
                            }
                        }
                    } else {
                        result.success = false;
                        //todo
                        result.error = "未知异常";
                    }

                    if (result.holdon) {
                        //var msg = result.resultCode == "226" ? YIBUMSG.warn_emailRepeat : YIBUMSG.warn_mobileRepeat;
                        var msg = YIBUMSG.contactexisted[result.resultCode] + "，" + YIBUMSG.isAlwaysSave;
                        top.$Msg.confirm(
                            msg,
                            function () {
                                top.Contacts.ModContactsField(c.SerialId, c, true, function (result) {
                                    if (result.resultCode == '0') {
                                        result.success = true;
                                        result.msg = YIBUMSG.contactsaved;
                                        result.data = result.ContactInfo;
                                    }
                                    else {
                                        //TODO 重复联系人编辑又失败了。
                                        result.error = YIBUMSG.editfail || e.responseData.ResultMsg || "未知异常";
                                    }
                                    callback && callback(result);
                                }, YIBUMSG.contactsaved);
                            },
                            function () {
                                //on calcel handler,do nothing
                            });
                        return false;
                    }

                    if (callback) {
                        callback(result);
                    }

                }, {
                    loadingMsg: "正在保存联系人..."
                });
            }

        },

        addBatchContacts: function(obj, callback) {
            var result = {}, list = obj.sort ? obj:[obj];

            for (var i = 0; i < list.length; i++) {
                var bool = this.validateAddContacts(list[i]);
                if (!bool) {
                    result.success = false;
                    result.errorIndex = i;
                    result.msg =  this.validateAddContacts.error;
                    if (callback) {
                        callback(result);
                    }
                    return;
                }
            }

            var _list = $.map(list, function(i) {
                var item = { Name: i.name, SourceType: 2 };
                if (i.email) {
                    item.Email = i.email;
                }

                if (i.mobile) {
                    item.MobilePhone = i.mobile;
                }

                if (i.GroupId) {
                    item.GroupId = i.GroupId;
                }

                return item;
            });

            var requestBody = {
                AutoSaveReceivers: {
                    Count: 1,
                    ContactsInfo: _list
                }
            };

            var requestUrl = "/addrsvr/AutoSaveReceivers?formattype=json&sid=" + $App.getSid();

            var _this = this;
            _this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    var code = e.responseData.ResultCode;
                    if (code == "0") {
                        result.success = true;
                        
                        var ci = e.responseData.ContactsInfo;

                        if (_.isArray(ci)) {
                            for (var i=0; i<ci.length; i++) {
                                $.each(_list, function(index, item) {
                                    if (item.Email == ci[i].FamilyEmail) {
                                        ci[i].GroupId = item.GroupId;
                                        return false;
                                    }
                                });
                            }
                            result.list = ci;
                        } else if (typeof ci == "object") {
                            result.list = [ci];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        _this.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:[],
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        result.msg = YIBUMSG.addfailunknown
                        if (callback) {
                            callback(result);
                        }
                    }
                }
            });
        },
        //url:http://addrsvr/QueryContactsImageUrl?sid=
        //post:<QueryContactsImageUrl><UserNumber>8615889394143</UserNumber><AddrInfo>手机号,别名</AddrInfo></QueryContactsImageUrl>
        /*response
        <QueryContactsImageUrlResp>
            <ResultCode>0</ResultCode>
            <ResultMsg>Operate successful</ResultMsg>
            <ImageInfo>
                <SerialId>802068819</SerialId>
                <ImageUrl>/upload/photo/861343087/8613430878413/20088181922924.jpg</ImageUrl>
            </ImageInfo>
            <ImageInfo>
                <SerialId>802068819</SerialId>
                <ImageUrl>/upload/photo/861343087/8613430878413/20088181922924.jpg</ImageUrl>
            </ImageInfo>
        </QueryContactsImageUrlResp>
        imgURL
        */
        /**
         *获得联系人头像
         *@param {Array} addrList 联系人的139别名、手机号
         *@param {Function} callback 回调函数
         */
        getContactsImage: function (addrList, callback) {
            var This = this;
            var cacheMap = This.contactsImageQueryCache;
            //先从缓存中找
            var key = addrList[0];
            var url = cacheMap[key];
            if (url !== undefined) {
                if (callback) {
                    callback(url);
                }
                return;
            }

            var requestData = {
                QueryContactsImageUrl: {
                    UserNumber: $User.getUid(),
                    AddrInfo: addrList.join(",")
                }
            };
            M2012.Contacts.API.call("QueryContactsImageUrl", requestData,
                function (e) {
                    if (e.responseData && e.responseData.ResultCode == "0") {
                        var url = "";
                        var json = e.responseData;
                        if (json.ImageInfo) {
                            if (!_.isArray(json.ImageInfo)) {
                                json.ImageInfo = [json.ImageInfo];
                            }
                            var list = json.ImageInfo;
                            var result = {};
                            for (var i = 0; i < list.length; i++) {
                                var item = list[i];
                                if (item.ImageUrl) {
                                    url = This.getContactsImageUrl(item.ImageUrl);
                                    break;
                                }
                            }
                        }
                        //查询结果要缓存起来
                        _.each(addrList, function (value) {
                            cacheMap[value] = url;
                        });
                        if (callback) {
                            callback(url);
                        }
                    }
                }
            );
        },
	    /**
         *直接通过调用后台的接口获取邮件地址的联系人头像(联系人是否在通讯录中存在由后台做判断)
         *@param {{addrInfo}, {info}} addrInfo ,Array里包含只包含有联系人的139别名、手机号信息
         *@param {Function} callback 回调函数
         */
        GetBatchImageUrl: function (addrInfo, callback) {
            var cacheMap = this.contactsImageQueryCache,
                key = addrInfo.addressInfo[0],
                url = cacheMap[key];

            //先从缓存中找
            if (url) {
                // 如果存在, 直接从缓存中获取, 否则保存
                _.isFunction(callback) && callback(url);
                return;
            }

            var param = {
                GetBatchImageUrl: {
                    ImageSrc : {
                        Name :  addrInfo.info.name,
                        Email : addrInfo.info.email
                    }
                }
            };

            M2012.Contacts.API.call("GetBatchImageUrl", param,
                function (response) {
                    var data = response.responseData;
                    if (!data || !data.ResultCode || data.ResultCode !== "0") {
                        // 无任何信息, 直接返回
                        console.error && data.ResultCode && console.error("errorCode: " + data.ResultCode);
                        return;
                    }

                    var url = "";
                    // 如果后台接口有返回, 则取返回值, 否则为空字符串
                    url = (data.ImageUrl) ? getDomain("resource") + data.ImageUrl[addrInfo.info.email] : url;

                    // 查询结果要缓存起来
                    _.each(addrInfo.addressInfo, function (value) {
                        cacheMap[value] = url;
                    });

                    _.isFunction(callback) && callback(url);
                }
            );
        },
        /**
         *缓存头像查询结果，避免反复查询
         */
        contactsImageQueryCache:{},
        /**
         *返回联系人头像url地址
         */
        getContactsImageUrl:function(path){
            var url = M139.Text.Url.makeUrl("/g2/addr/apiserver/httpimgload.ashx", {
                sid: $App.getSid(),
                path: path
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },


        /**
         * 通讯录只读类批量查询接口
         * @param {Object} options 参数
        */
        batchQuery: function (options) {
            var This = this;
            this.call("BatchQuery", options.requestData, function (e) {
                var result = e.responseData;
                if (e.status === 200 && result) {
                    if ($.isFunction(options.success)) options.success(result);
                } else {
                    if ($.isFunction(options.error)) options.error(result, e);
                }
            });
        },


        /**
         *更新缓存
         */
        updateCache: function (options) {
            var model = M2012.Contacts.getModel();
            model.updateCache(options);
        },

        //共享联系人
        shareContacts: function (options) {
            var This = this;

            var requestUrl = addrInterfaceUrl("ShareContacts");
            var requestData = {
                ShareContacts: {
                    "SendTo": options.sendto,
                    "SerialId": options.serialids
                }
            };

            This.call(requestUrl, requestData, function (e) {
                var result = e.responseData;

                if (!result || result.ResultCode != 0) {
                    if (options.error) options.error(result);
                    return;
                }

                if (options.success) options.success(result);
            },{
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "JSON2Object"
            });
        },

        //克隆其他邮箱联系人
        cloneContacts: function (options) {
            var requestUrl = addrInterfaceUrl("CloneContacts");
            this.call(requestUrl, options.params, function (e) {
                if (options.callback) options.callback(e);
            }, {
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "JSON2Object",
                error: options.error
            });
        },
        //异步查询联系人详细数据
        getContactsInfoById: function(id , callback){
            var result = {};
            var request = "<QueryContactsAndGroup><SerialId>{0}</SerialId><UserNumber>{1}</UserNumber></QueryContactsAndGroup>";
                request = request.format(id, $User.getUid());

            var error = function(e){
                 if(callback){
                    callback(e);
                 }
            };
                
            this.call('QueryContactsAndGroup', request, function(doc){
                var info = doc.responseData;

                if(info.ResultCode == "0"){
                        result.success=true;
                        result.msg= YIBUMSG.contactreaded;
                        result.contacts=[];

                    var helper = top.$App.getModel("contacts");

                    $.each(info.ContactsInfo, function() {
                        var fullInfo = helper.userInfoTranslate(this);
                        var contact = new M2012.Contacts.ContactsInfo( fullInfo );
                        result.contacts.push(contact);
                    });

                    result.contactsInfo = result.contacts[0];
                }else{
                    result.ResultCode = info.ResultCode;
                    result.success = false;
                    result.msg = YIBUMSG.sysbusy;
                    result.contacts =[];
                }

                if(callback){
                    callback(result);
                }
            }, {error: error});
        },
        //获取可能认识的人,接口
        getWhoAddMePageData: function(info, callback) {
            var _this = this;
            var userId = top.$User.getUid();
            var request = '<WhoAddMeByPage Page="{0}" Record="{1}" Relation="{3}" IsRand="{4}"><UserNumber>{2}</UserNumber></WhoAddMeByPage>';

            request = request.format(info.pageIndex, info.pageSize, userId, info.relation || 0, info.isRand || 0);

            var error = function() {
                M139.UI.TipMessage.hide();
                M139.UI.TipMessage.show("通讯录接口无法连接，请检查网络或稍候再试", { delay:2000 });
            };

            this.call('WhoAddMeByPage', request, function(response){
                var info = response.responseData;
                var result = {};
                result.success = true;
                result.msg = YIBUMSG.contactreaded;
                result.list = info.UserInfo;
                result.total = info.TotalRecord;

                if(callback){
                    callback(result);
                }

            }, {error: error});
        },
        modDealStatus: function(info, callback) {
            info.relationId = info.relationId.toString();

            var request = "<ModDealStatus><RelationId>{0}</RelationId><DealStatus>{1}</DealStatus><GroupId>{2}</GroupId><ReqMsg>{3}</ReqMsg><ReplyMsg>{4}</ReplyMsg><OperUserType>{5}</OperUserType><UserNumber>{6}</UserNumber>{7}</ModDealStatus>";
                request = request.format(info.relationId, info.dealStatus, info.groupId, info.reqMsg, info.replyMsg, info.operUserType, top.$User.getUid());
          
            this.call("ModDealStatus", request, function(response){
                var result = {};
                var info = response.responseData;

                result.info = info;
                result.success = true;
                result.msg = YIBUMSG.contactreaded;

                if (info.ResultCode != "0") {
                    result.success = false;
                    delete result.msg; //错误时去掉提示语，各页面自己提供.20130923
                }

                if (callback) {
                    callback(result);
                };
            }, { error: function() { alert("连接失败"); } });
        }
    });
})(M139);
﻿/**
 * @fileOverview 定义M2012.UserModel类.
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UserModel";
    M139.namespace(namespace, superClass.extend(
    /**
    *@lends M2012.UserModel.prototype
    */
    {
    /**
    *管理用户常用属性类
    *@constructs M2012.UserModel
    *@param {Object} options 参数集合
    *@example
    */
    initialize: function (options) {

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: namespace,

    /**
    *获得用户别名
    *@param {String} type 别名类型：common普通别名(默认)|fetion飞信别名
    *@returns {String}
    *@example
    $User.getAliasName("common");//返回lifula
    */
    getAliasName: function (type) {
        type = type || "common";
        var result = $.grep(this.getAccountList(), function (n, i) {
            return n.type == type;
        });
        return result.length > 0 ? result[0].name : "";
    },
    /**
    *设置默认帐号时获得用户帐号类型 1 普通别名别名 2 手机号 3 飞信别名
    *@param {String} type 别名类型：common普通别名|fetion飞信别名|mobile手机号|passid通行证
    *@returns {Int}
    *@example
    $User.getAccountType("common");//返回1
    */
    getDefaultAccountType: function (type) {
        return { "common": 1, "mobile": 2, "fetion": 3, "passid": 4 }[type];
    },
    /**
    *返回用户分区号： 返回1为灰度，返回12为全网（测试线返回21是全网）
    *@returns {String}
    */
    getPartId: function () {
        var id = this.get("partid");
        if (!id) {
            id = getCookie("cookiepartid") || "";
            this.get("partid", id);
        }
        return id;
    },
    isGrayUser: function () { //是否灰度用户
        return this.getPartId() == "1";
    },
    /**
    *请用getPartId，这里为了兼容
    *@returns {String}
    */
    getPartid: function () {
        return this.getPartId();
    },

    /**
    *取老版本的UserData，获取用户不变属性的时候用，获取动态属性禁用，外部禁用
    *@inner
    */
    getUserDataObj: function () {
        var ud = {
            userNumber: "",
            "ssoSid": top.sid,
            provCode: "1"
        }
        
        return ud;
        /*var ud = this.get("UserData");
        if (!ud) {
            ud = M139.JSON.tryEval(M139.Text.Cookie.get("UserData"));
            if (!ud) {
                $App.setSessionOut({
                    type: "CookieUserData"
                });
                throw this.logger.getThrow("Cookie中UserData为空");
            }
            this.get("UserData", ud);
        }
        return ud;*/
        
    },

    /**
    *获取用户设置的默认字体.系统默认字体为： {size : '2',family : '宋体',color : '#000000'}
    */
    getDefaultFont: function () {
        var fontsStr = this.tryGetObjectValue($App.getConfig("UserAttrsAll"), 'fonts', '2;宋体;#000000;1.5');
        var fontsObj = {};
        var temp = fontsStr.split(';');
        fontsObj.size = temp[0];
        fontsObj.family = temp[1].replace(/'/g, '');
        fontsObj.color = temp[2];
        fontsObj.lineHeight = temp[3] || 1.5;
        fontsObj.lineHeight = fontsObj.lineHeight == 1 ? 1.2 : fontsObj.lineHeight; //单倍设为1.2，有些浏览器单倍文字会被截半（遮挡住）

        var mapSize = {
            6: "一号",
            5: "二号",
            4: "三号",
            3: "四号",
            2: "五号",
            1: "六号"
        };
        fontsObj.sizeText = mapSize[fontsObj.size];
        
        var mapLineHeight = {
            1.2 : "单倍",
            1.5 : "1.5倍",
            2   : "2倍",
            2.5 : "2.5倍"
        };
        fontsObj.lineHeightText = mapLineHeight[fontsObj.lineHeight];
        
        return fontsObj;
    },
    
    /**
    *获取用户设置的皮肤，系统默认的皮肤为 normal add by tkh
    */
    getSkinName: function () {
        var skinPath = $Cookie.get("SkinPath2");
        if (!/^skin_\w+$/.test(skinPath) || HIDDEN_SKIN[skinPath]) {
            skinPath = "skin_lightblue";
        } else if (skinPath == 'skin_normal') {
            skinPath = $Cookie.get("cookiepartid") == 1 ? "skin_red" : "skin_lightblue";
        }
        return skinPath;
    },

    /**
    *获取2.0皮肤映射的1.0值,给内嵌的老页面用
    */
    getSkinNameMatrix: function () {
        var skin = this.getSkinName();
        //新老皮肤近似值映射
        var skinMatch = { 
            "skin_red": "skin_red",
            'skin_pink': "skin_pink",
            'skin_golf': "new_skin_golf",
            'skin_light': "skin_g1",
            'skin_star': "new_skin_startrek",
            'skin_cat': "new_skin_riches",
			'skin_mstar': 'skin_snow',
			'skin_sunset': 'skin_mZone',
			'skin_paint': 'skin_2010',
			'skin_mcloud': 'skin_shibo',
            'skin_lightblue': 'skin_shibo',
			'skin_sunflower': 'skin_mZone',
			'skin_rose': 'new_skin_rabbit',
			'skin_flowers': 'new_skin_spring',
			'skin_brocade': 'skin_love',
			'skin_newyear': 'new_skin_rabbit',
			'skin_dew': 'skin_green',
			'skin_cherry': 'skin_pink',
			'skin_warm': 'new_skin_rabbit',
			'skin_lithe': 'skin_blue',
			'skin_night': 'new_skin_riches',
			'skin_morning': 'new_skin_rabbit',
            'skin_spring': 'skin_green',
            'skin_summer': 'skin_blue',
            'skin_autumn': 'skin_xmas',
            'skin_winter': 'skin_love',
            'skin_child': 'skin_mZone',
            'skin_woman': 'skin_pink',
            'skin_bluesky': "skin_shibo",
            'skin_claritBamboo':"skin_grassGreen",
            'skin_claritBrown': "skin_brown",
            'skin_claritGreen': "skin_paleGreen",
            'skin_claritPurple': "skin_lavender",
            'skin_claritRed': "skin_pinks"
        };
        var path = skinMatch[skin] || "skin_shibo";
        return path;
    },

    /**
    *获取一个对象的属性值（有容错处理）
    @param {Object} obj 对象名
    @param {String} key 属性名
    @param {Mixed} defaultValue 默认值(不传的话，无数据返回"")
    */
    tryGetObjectValue: function (obj, key, defaultValue) {
        defaultValue = (defaultValue === undefined ? "" : defaultValue);
        var value = (obj && obj[key]) || defaultValue;
        return value;
    },

    /**
    *获取GetMaindata输出的UserData属性值
    *@inner
    @param {String} key 属性名
    @param {Mixed} defaultValue 默认值(不传的话，无数据返回"")
    */
    tryGetUDValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("UserData"), key, defaultValue);
    },

    /**
    *获取UserAttr属性值
    *@inner
    */
    tryGetUAttrValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("UserAttrs"), key, defaultValue);
    },

    /**
    *获取PersonalData属性值
    *@inner
    */
    tryGetPDataValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("PersonalData"), key, defaultValue);
    },

    /**
    *返回用户手机账号（带86）（原来的UserData.userNumber)
    *@returns {String}
    */
    getUid: function () {
        if ($App.getConfig && $App.getConfig("UserData")) {
            return $App.getConfig("UserData").UID;
        } else {
            return "";
        }
    },

    /**
    *返回用户手机账号（不带86）
    *@returns {String}
    */
    getShortUid: function () {
        return $T.Mobile.remove86(this.getUid());
    },
    /**
    * 读取是否已升级为移动通行证
    * @returns {void}
    */
    isUmcUserAsync: function (callback) {
        var data = $App.getConfig("UserData");
        var _callback = callback || new Function();
        
        if (typeof(data.isumcuser) != "undefined") {
            _callback(data.isumcuser);
            return;
        }
    
        M139.Timing.waitForReady(function(){
            try {
                var _data = $App.getConfig("UserData");
                if ( typeof(_data.isumcuser) != "undefined" ) {
                    return true;
                }
            } catch (ex) {
            }

            return false;
        }, function() {
            var _data2 = $App.getConfig("UserData");
            _callback(_data2.isumcuser);
        });
    },

    /**
    *是否是互联网账号
    */
    isInternetUser: function () {
        return this.getProvCode() === '83'
    },
    /*是否是中国移动用户*/
    isChinaMobileUser: function () {
        return this.getProvCode() <= 31 ? true : false;
    },

    /*是否非中国移动用户*/
    isNotChinaMobileUser: function () {
        return !this.isChinaMobileUser();
    },

    //判断涉及手机号的功能是否可用
    checkAvaibleForMobile: function (elList) {
        var self = this;
        if (this.isChinaMobileUser()) {//移动账号
            return true;
        } else {
            if (elList) { //点击后提示
                $(elList).unbind("click");
                if (typeof (elList) == "string") {
                    $(elList).live("click", function (e) {
                        self.showMobileLimitAlert();
                        e.stopPropagation();
                        e.preventDefault();
                    });
                } else {
                    $(elList).bind("click", function (e) {
                        self.showMobileLimitAlert();
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            } else { //立即提示
                self.showMobileLimitAlert();
            }
            return false;
        }
    },

    showMobileLimitAlert: function () {
        if (this.isInternetUser()) { //互联网账号
            $Msg.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。<a href='javascript:top.$App.show(\"account\",{anchor:\"accountAdmin\"}); $Msg.getCurrent().close();'>绑定手机账号</a>", { isHtml: true });
        } else {
            $Msg.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。");
        }
    },

    /**
    *返回用户省份编号
    *@returns {String}
    */
    getProvCode: function () {
        window.PROVCODE = M139.Text.Cookie.get("provCode");
        if (window.PROVCODE) {
            return window.PROVCODE;
        }else{
            return this.getUserDataObj().provCode + "";
        }
    },

    /**
    *返回用户地区编号（城市），如果数据不具备返回空
    *@returns {String}
    */
    getAreaCode: function () {
        //cookie中的userdata没有areaCode这个属性
        return this.tryGetUDValue("areaCode");
    },

    /**
    *获得用户账号列表 返回[{"name":"lifula@139.com","type":"common"},{"name":"15889394143@139.com","type":"mobile"},{"name":"719094764@139.com","type":"fetion"}]
    *@return {Array} 无数据返回null
    */
    getAccountList: function () {
        try {
            var data = $App.getConfig("UserData");
            if (!data || !data.uidList) {
                return [];
            }

            var map = {
                "0": "common",
                "1": "fetion",
                "2": "mobile",
                "3": "passid"
            };

            var sortvalue = {
                "0": 4,
                "1": 2,
                "2": 3,
                "3": 1
            };

            var accountList = [];
            var hasMobile = false;

            for (var i=0, l=data.uidList, m=l.length, n; i < m, n=l[i]; i++) {
                accountList.push({ sortid: sortvalue[n.type] || sortvalue["0"], name: n.name, type: map[n.type] || map["0"] });
                hasMobile = hasMobile || n.type == "2";
            }

            if (!hasMobile && data.provCode !== "83") {
                accountList.push({ sortid: sortvalue["2"], name: $App.getAccountWithLocalDomain($Mobile.remove86(data.UID)), type: map["2"] });
            }

            accountList.sort(function(a, b){ return b.sortid - a.sortid });

            return accountList;

        } catch (e) { }
        return [];
    },

    /**
    *获得用户账号列表 返回["lifula@139.com", "15889394143@139.com", "719094764@139.com"]
    *@return {Array} 无数据返回空数组
    */
    getAccountListArray: function () {
        var list = this.getAccountList();
        var account = [];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                //排除互联网账号的 号码@139.com 邮箱    最好是接口输出的时候就排除掉
                if (this.isInternetUser() && this.isInternetUserNumberEmail(list[i])) {
                    continue;
                }
                account.push(list[i].name);
            }
        }
        return account;
    },

    /**
    *判断互联网用户 号码@139.com 是否为假的手机号邮件地址
    *@param {String} email 号码@139.com
    *@return {Boolean} 无数据返回空数组
    */
    isInternetUserNumberEmail: function (email) {
        return M139.Text.Email.getAccount(email) == this.getShortUid();
    },

    /**
    *返回用户默认发信账号，异常返回:手机号@139.com
    *@returns {String}
    */
    getDefaultSender: function () {
        try {
            //todo
            return $App.getView("top").getDefaultSender();
        } catch (e) {
            if (!this.isInternetUser()) {
                return this.getShortUid() + "@" + $App.getMailDomain();
            } else {
                throw "$User.getDefaultSender()";
            }
        }
    },
    /**
    *设置默认发信账号
    *@returns {String}
    */
    setDefaultSender: function (account, type, callback) {
        //todo
        return $App.getView("top").setDefaultSender(account, type, callback);
    },

    /**
    *获取上一次登录时间，返回：2012-12-12 08:57:25，异常返回空字符
    *@returns {String}
    */
    getLastLoginDate: function () {
        return this.tryGetUDValue("lastLoginDate");
    },
    /**
    *获得用户登录使用的账号名（异常返回手机号，外网账号返回默认发信号）
    *@returns {String}
    */
    getLoginName: function () {
        var result = this.tryGetUDValue("loginName", this.getShortUid());
        if (/^8680/.test(result)) {
            result = M139.Text.Email.getAccount(this.getDefaultSender())
        }
        return result;
    },

    /**
    *获得用户手机卡类型（动感、神州行、全球通等），异常返回空字符
    *@returns {String}
    */
    getCardType: function () {
        return this.tryGetUDValue("cardType");
    },

    /**
    *获得用户套餐值(0010,0015,0016,0017)，异常返回空字符
    *@returns {String}
    */
    getServiceItem: function () {
        return this.tryGetUDValue("serviceItem");
    },

    /**
    *异步获取套餐数据
    *@param {Function} callback 回调函数
    */
    getMealData: function (callback) {
        var self = this;
        if (!this.isChinaMobileUser()) {//暂不请求套餐接口（后台会超时）
            return;
        }

        /*
        M139.RichMail.API.call("meal:getMealInfo", '', function (result) {
            if (result.responseData && result.responseData.code && result.responseData.code == 'S_OK') {
                var data = result.responseData["var"];
                if (self.packageName == '') {
                    self.packageName = data.serviceName;
                }
                callback && callback(data);
            } else {
                self.logger.error("getMealInfo returndata error", "[meal:getMealInfo]", result);
            }
        });
        */

        top.M139.Timing.waitForReady("$App.getConfig('mealInfo')", function () { 
            var data = $App.getConfig('mealInfo');
            if (self.packageName == '') {
                self.packageName = data.serviceName;
            }
            callback && callback(data);
        });
    },

    /**
    *获得用户套餐名（免费版、5元版、20元版等）
    *@returns {String}
    */
    getPackage: function () {
        return this.packageName;
    },
    packageName: '', //套餐名称

    /**
    *获得用户积分信息,不具备数据返回null
    *@returns {Object}
    */
    getUserIntegral: function () {
        return this.tryGetUDValue("mainUserIntegral", null);
    },
    /**
    *返回我的应用配置数据，不具备返回null
    *@returns {Object}
    */
    getMyApp: function () {
        return this.tryGetUDValue("myapp", null);
    },
    /**
    *返回我的应用ID
    *@returns {string}
    */
    getMyAppIdByKey: function(_key) {
        var apps = this.getMyApp();
		var result = $.grep(apps,function(val,n){
			return val.key == _key;
		});
		if(result && result[0]){return result[0].id}
		return null;
    },	
    /**
    *返回UserConfig用户配置参数表信息，不具备返回null
    *@returns {Object}
    */
    getUserConfig: function () {
        return this.tryGetUDValue("mainUserConfig", null);
    },
    /**
    *返回用户实验室信息，不具备返回null
    *@returns {Object}
    */
    getUecInfo: function () {
        return this.tryGetUDValue("uecInfo", null);
    },
    /**
    *返回uidList(用户账号列表)，不具备返回[]，不建议使用
    *@returns {Array}
    */
    getUidList: function () {
        return this.tryGetUDValue("uidList", []);
    },

    /**
    *套餐常量
    */
    levelEnum: {//用户等级
        free0010: "0010", //广东免费
        free0015: "0015", //非广东免费
        vip5: "0016", //5版
        vip20: "0017"//20版
    },

    /**
    * 【不推荐直接调用】获得用户套餐信息（最大发件个数、最大附件大小等）,不具备数据返回{}无属性对象
    * @returns {Object}
    */
    getVipInfo: function () {
        return this.tryGetUDValue("vipInfo", {});
    },

    /**
    * 传入键值，获取用户套餐配置值
    * @param {Number} _default 默认值
    * @returns {Number}
    */
    getCapacity: function (key, _default) {
        var map = {
            "diskfilesize": "DISK_1000001",
            "filesharecapacity": "DISK_1000002",
            "filesharesavedays": "DISK_1000003",

            "transcribetimelen": "MAIL_2000001",
            "mailgsendlimit": "MAIL_2000002",
            "maildaylimit": "MAIL_2000003",
            "addrstorenum": "MAIL_2000004",
            "maxannexsize": "MAIL_2000005",

            "vipidentity": "MAIL_2000006",
            "letterpaperid": "MAIL_2000007",
            "congracardid": "MAIL_2000008",
            "postcardid": "MAIL_2000009",
            "dermaid": "MAIL_2000010"
        };

        _default = typeof (_default) == "undefined" ? 0 : Number(_default);

        var max = _default;

        var vipinfo = this.getVipInfo();
        if (vipinfo[map[key]]) {
            max = parseInt(vipinfo[map[key]], 10);
        }

        if (isNaN(max)) {
            max = _default;
        }

        return max;
    },

    /**
    *返回发邮件最大收件人个数，无数据返回50
    *@returns {Number}
    */
    getMaxSend: function () {
        var max = 50;

        max = this.getCapacity("mailgsendlimit", max);

        // 兼容代码，服务端vipinfo返回失败时，不至出错。
        if (max < 50) {
            max = 50;
        }

        var serviceItem = $User.getServiceItem();
        if (max < 100 && serviceItem == this.levelEnum.vip5) {
            max = 100;
        } else {
            if (max < 100 && serviceItem == this.levelEnum.vip20) {
                max = 200;
            }
        }

        return max;
    },

    /**
    * 返回通讯录套餐联系人上限
    * @return {Number}
    */
    getMaxContactLimit: function () {
        var max = 3000;

        max = this.getCapacity("addrstorenum", max);

        if (max < 3000) {
            max = 3000;
        }

        var serviceItem = $User.getServiceItem();
        if (max < 3000 && serviceItem == this.levelEnum.vip5) {
            max = 6000;
        } else {
            if (max < 3000 && serviceItem == this.levelEnum.vip20) {
                max = 6000;
            }
        }

        //如果调用时，通讯录数据已加载，则该规则生效。
        //如果免费用户现有人数已超3000，则将上限放宽至4000
        var _model = $App.getModel("contacts");
        if (_model) {
            var _count = _model.getContactsCount();
            if (_count > 3000 && max < 4000) {
                max = 4000;
            }
        }

        return max;
    },

    /**
    *获得群邮件数据,无数据返回null
    *@returns {Object}
    */
    getGroupMailInfo: function () {
        return this.tryGetUDValue("groupMailInfo", null);
    },

    /**
    *返回用户发件人姓名，异常返回""
    *@returns {String}
    */
    getTrueName: function () {
        return this.tryGetUAttrValue("trueName", "");
    },
    getSendName: function () {
        var name = this.getTrueName() || this.getAliasName().replace(/@.+/, "") || this.getUid().replace(/^86/, "");
        return name;
    },
    /**
    *返回高级搜索是否开通 1|0，异常返回0
    *@returns {Number}
    */
    getFtsflag: function () {
        return this.tryGetUAttrValue("fts_flag", 0);
    },

    /**
    *返回默认每页显示邮件数，无数据返回默认值20
    *@returns {Number}
    */
    getDefaultPageSize: function () {
        return this.tryGetUAttrValue("defaultPageSize", 20);
    },
	
    /**
    *返回默认邮件列表密度
    *@returns {Number}
    */
    getPageStyle: function () {
		var val = $App.getCustomAttrs('pageStyle') || 1;
        return this.getPageStyleByKey(val);
    },	
	
    /**
    *返回默认邮件列表密度，无数据返回1(适中)
    *@returns {Number}
    */
    getPageStyleByKey: function (key) {
		var map = {
			'3':' td-small',
			'1':'',
			'2':' td-big'
		}
		return map[key] || '';
    },	
	
    /**
    *获取是否带原邮件回复:0或1，无数据返回默认值1
    *@returns {Number}
    */
    getReplyWithQuote: function () {
        return this.tryGetUAttrValue("replyWithQuote", 0);
    },

    /**
    *获得“邮件到达通知”配置数据，无数据返回null
    *@returns {Object}
    */
    getMailNotifyInfo: function () {
        return this.tryGetPDataValue("mailNotifyInfo", null);
    },
    /**
    *获得“邮箱伴侣”是否开通,这里返回字符串的"true"和"false" =_=
    *@returns {String}
    */
    getPartner: function () {
        return this.tryGetPDataValue("partner", "false");
    },

    /**
    *获得PushEmail是否开通,这里返回字符串的"true"和"false" =_=
    *@returns {String}
    */
    getPushemail: function () {
        return this.tryGetPDataValue("pushemail", "false");
    },

    /**
    *获得短彩信赠送、已发条数信息对象，无数据返回null
    *@returns {Object}
    */
    getSmsMMsInfo: function () {
        return $App.getConfig("PersonalData").smsMMsInfo || null
    },

    /**
    *获得自写彩信赠送条数，无数据返回""
    *@returns {String}
    */
    getPresentMmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "PresentMmsCount", "");
    },

    /**
    *获得自写短信赠送条数，无数据返回""
    *@returns {String}
    */
    getPresentSmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "PresentSmsCount", "");
    },

    /**
    *获得自写彩信已用条数，无数据返回""
    *@returns {String}
    */
    getUsedMmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "UsedMmsCount", "");
    },
    getFreeSmsCount: function () {
        var count = this.getPresentSmsCount() - this.getUsedSmsCount();
        return count >= 0 ? count : 0;
    },
    getFreeMmsCount: function () {
        var count = this.getPresentMmsCount() - this.getUsedMmsCount();
        return count >= 0 ? count : 0;
    },
    needMailPartner: function () {
        var provCode = top.$User.getProvCode();
        if (provCode == 1 || provCode == 10 || provCode == 7) {
            return this.getPartner() == "false";

        } else {
            return false;
        }

    },
    /**
    *获得自写短信已用条数，无数据返回""
    *@returns {String}
    */
    getUsedSmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "UsedSmsCount", "");
    },

    /**
    *获得用户的邮箱概要信息：已用空间、文件夹个数、未读邮件数
    *@returns {Object}
    */
    getMessageInfo: function () {
        return $App.getConfig("MessageInfo") || null;
    },

    /**
    *获得用户的邮箱概要信息：文件夹个数，无数据返回""
    *@returns {String}
    */
    getFolderCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "folderCount", "");
    },

    /**
    *获得用户的邮箱概要信息：获取邮箱容量，无数据返回""
    *@returns {String}
    */
    getLimitMessageSize: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "limitMessageSize", "");
    },

    /**
    *获得用户的邮箱概要信息：获取邮件总数，无数据返回""
    *@returns {String}
    */
    getMessageCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "messageCount", "");
    },

    /**
    *获得用户的邮箱概要信息：获取已用邮件容量，无数据返回""
    *@returns {String}
    */
    getMessageSize: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "messageSize", "");
    },

    /**
    *获得用户的邮箱概要信息：获取未读邮件总数，无数据返回""
    *@returns {String}
    */
    getUnreadMessageCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "unreadMessageCount", "");
    },



    /**
    *当前用户等级
    *@returns {string} 等级字符串
    */
    getUserLevel: function () {
        var serviceItem = this.getServiceItem();
        for (var e in this.levelEnum) {
            if (serviceItem && $.trim(serviceItem).toLowerCase() == $.trim(this.levelEnum[e]).toLowerCase()) {
                return serviceItem;
            }
        }
        //没有找到套餐定义，则返回免费用户
        return this.levelEnum.free0010;
    },
    getServerTime: function () {
        /*if ($App.getConfig("PersonalData")) {
        return $App.getConfig("PersonalData").serverDateTime;
        } else {
        return new Date();
        }*/
    },
    /**
    *得到等级字符
    *@param {string} type 标识如何组合vip字符
    *@returns {string} 等级字符串
    */
    getVipStr: function (type) {
        switch (type) {
            case "5,20":
                return this.levelEnum.vip5 + "," + this.levelEnum.vip20;
            case "20":
                return this.levelEnum.vip20;
            default:
                return this.levelEnum.free0010 + "," + this.levelEnum.free0015 + "," + this.levelEnum.vip5 + "," + this.levelEnum.vip20;
        }
    },

    /**
    *单元测试接口
    *@inner
    */
    unitTest: function () {
        for (var func in this) {
            if (func.indexOf("get") == 0 && _.isFunction(this[func])) {
                console.log(func + ":" + this[func]());
            }
        }
    }
}));

window.$User = new M2012.UserModel();
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义添加联系人对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.ContactsEditor";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.ContactsEditor.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.ContactsEditor
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.serialId 联系人id
        *@param {String} options.name 联系人姓名
        *@param {String} options.mobile 联系人手机号
        *@param {String} options.email 联系人邮件地址
        *@example
        */
        initialize: function (options) {
            options = options || {};
            this.options = options;
            this.filter = options.filter;

            this.contactsModel = M2012.Contacts.getModel();

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:[ '<div class="boxIframeText">',
 			'<p class="mt_10 Lbl_Tip" style="margin-left:25px; display:none;"></p>',
             '<ul class="form groupFenDiv">',
                 '<li class="formLine ErrorTipContainer" style="display:none">',
                    '<label class="label"></label>',
                    '<div class="element">',
						'<div class="red LblErrorTip">格式错误</div>',
                    '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">姓名：</label>',
                     '<div class="element">   ',
 						'<input maxlength="12" id="AddContacts_Name" type="text" class="iText" /> <span class="red">*</span>',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">邮箱：</label>',
                     '<div class="element">       ',
 						'<input maxlength="90" id="AddContacts_Email" type="text" class="iText" />',
                     '</div>',
                 '</li>',
 				'<li class="formLine">',
                     '<label class="label">手机：</label>',
                     '<div class="element">        ',
 						'<input maxlength="20" id="AddContacts_Mobile" type="text" class="iText" />',
                     '</div>',
                 '</li>',
 				'<li class="formLine">',
                     '<label class="label">分组：</label>',
                     '<div class="element">  ',
 						'<div class="groupFen">',
 							'<div class="groupFenList GroupContainer">',
 								//'<p><input type="checkbox" value="" class="mr_5"><label for="">同学</label></p>',
 							'</div>	',
 							'<div class="groupBtn">',
 								'<a href="javascript:;" class="BtnShowAddGroup">新建分组</a>',
                                '<div class="AddrGroupContainer" style="display:none">',
                                    '<input id="AddContacts_GroupName" maxlength="16" type="text" class="iText mr_5" value="" />',
                                    '<a hidefocus="1" href="javascript:;" class="btnMinOK mr_5 AddNewGroup" title="确定"></a>',
                                    '<a hidefocus="1" href="javascript:;" class="btnMincancel CancelAddGroup" title="取消"></a>',
                                '</div>',
 							'</div>',
 						'</div>	',
                     '</div>',
                 '</li>',
             '</ul>',
 			//'<p class="gray pb_10" style="margin-left:25px;">如需编辑联系人详细资料，请进入<a href="javascript:;">新建联系人</a></p>',
         '</div>'].join(""),
        
        //批量添加模版
        batchtemplate:[ '<div class="boxIframeText">',
            '<p class="mt_10 Lbl_Tip" style="margin-left:25px; display:none;"></p>',
             '<ul class="form groupFenDiv">',
                 '<li class="formLine ErrorTipContainer" style="display:none">',
                    '<label class="label"></label>',
                    '<div class="element">',
                        '<div class="red LblErrorTip">格式错误</div>',
                    '</div>',
                 '</li>',
                 '<li class="formLine"><div style="padding-left:50px">你即将添加{0}个联系人，重复的联系人不再保存。</div></li>',
                 '<li class="formLine">',
                     '<label class="label">分组：</label>',
                     '<div class="element">  ',
                        '<div class="groupFen">',
                            '<div class="groupFenList GroupContainer">',
                                //'<p><input type="checkbox" value="" class="mr_5"><label for="">同学</label></p>',
                            '</div> ',
                            '<div class="groupBtn">',
                                '<a href="javascript:;" class="BtnShowAddGroup">新建分组</a>',
                                '<div class="AddrGroupContainer" style="display:none">',
                                    '<input id="AddContacts_GroupName" maxlength="16" type="text" class="iText mr_5" value="" />',
                                    '<a hidefocus="1" href="javascript:;" class="btnMinOK mr_5 AddNewGroup" title="确定"></a>',
                                    '<a hidefocus="1" href="javascript:;" class="btnMincancel CancelAddGroup" title="取消"></a>',
                                '</div>',
                            '</div>',
                        '</div> ',
                     '</div>',
                 '</li>',
             '</ul>',
            //'<p class="gray pb_10" style="margin-left:25px;">如需编辑联系人详细资料，请进入<a href="javascript:;">新建联系人</a></p>',
         '</div>'].join(""),

        GroupItemTemplate:'<p><input id="{chkId}" type="checkbox" value="{groupId}" class="mr_5"><label for="{chkId}">{name}</label></p>',
        events:{
            "click .AddNewGroup": "onAddNewGroupClick",
            "click .BtnShowAddGroup": "onShowAddGroupClick",
            "click .CancelAddGroup": "onCancelAddGroupClick"
        },

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(e){
                This.onYesClick();
                e.cancel = true;
            },function(){
                This.onCancel();
            },{
                //width:"380px",
                buttons:["确定","取消"],
                dialogTitle:"添加联系人"
            });

            this.setElement(this.dialog.el);

            this.renderGroupList();
            this.renderContactsInfo();


            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**构建批量添加dom函数*/
        batchrender:function(){
            var This = this;
            var options = this.options;
            var html = $T.Utils.format(this.batchtemplate,[options.addContacts.length]);
            this.dialog = $Msg.showHTML(html,function(e){
                This.onBatchYesClick();
                e.cancel = true;
            },function(){
                This.onCancel();
            },{
                //width:"380px",
                buttons:["确定","取消"],
                dialogTitle:"批量添加联系人"
            });

            this.setElement(this.dialog.el);
            this.renderGroupList();
            this.renderContactsInfo();


            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**@inner*/
        renderGroupList:function(groups){
            var htmlCode = [];
            groups = groups || this.contactsModel.getGroupList();
            for(var i=0;i<groups.length;i++){
                var g = groups[i];
                htmlCode.push(M139.Text.Utils.format(this.GroupItemTemplate,{
                    groupId:g.id,
                    name: M139.Text.Html.encode(g.name),
                    chkId:"_groups_chk_" + g.id
                }));
            }
            this.$(".GroupContainer").append(htmlCode.join(""));
        },

        /**@inner*/
        renderContactsInfo:function(){
            var This = this;
            var options = this.options;
            var info = {};
            if(options.serialId){
                var contacts = this.contactsModel.getContactsById(options.serialId);
                if(contacts){
                    info.name = contacts.name;
                    info.mobile = contacts.getFirstMobile();
                    info.email = contacts.getFirstEmail();
                    var groups = this.contactsModel.getContactsGroupId(options.serialId);
                }
                this.dialog.setDialogTitle("编辑联系人");
            }else{
                info.name = options.name;
                info.email = options.email;
                info.mobile = options.mobile;
                if (info.email) {
                    this.setLabelTip("将<" + info.email + ">加到通讯录");
                }
            }
            this.$("#AddContacts_Name").val(info.name || "");
            this.$("#AddContacts_Email").val(info.email || "");
            this.$("#AddContacts_Mobile").val(info.mobile || "");
            if(groups){
                $(groups).each(function(index,groupId){
                    This.checkedGroup(groupId);
                });
            }
        },
        /**
         *设置对话框内容区第一行文本提示内容
         *@inner
         */
        setLabelTip:function(text){
            this.$(".Lbl_Tip").text(text);
        },

        /**
         *点击添加组
         *@inner
         */
        onAddNewGroupClick: function () {
            var This = this;
            var groupName = this.$("#AddContacts_GroupName").val().trim();
            M2012.Contacts.API.addGroup(groupName, function (result) {
                if(result.success){                    
                    This.appendGroup(result.groupName,result.groupId);
                } else {
                    This.showError(result.error || result.msg);
                }
            });
        },

        /**
         *红字显示异常信息
         *@inner
         */
        showError: function (msg) {
            this.$(".ErrorTipContainer").show();
            this.$(".LblErrorTip").html(msg);
        },

        /**
         *展开添加组
         *@inner
         */
        onShowAddGroupClick:function(){
            this.$(".AddrGroupContainer").show();
            this.$("#AddContacts_GroupName").val("").focus();
            this.$(".BtnShowAddGroup").hide();
        },

        /**
         *点击隐藏添加组
         *@inner
         */
        onCancelAddGroupClick:function(){
            this.hideAddGroup();
        },

        /**
         *隐藏添加组
         *@inner
         */
        hideAddGroup:function(){
            this.$(".AddrGroupContainer").hide();
            this.$(".BtnShowAddGroup").show();
        },

        /**
         *组选中
         *@inner
         */
        checkedGroup:function(groupId){
            this.$("#_groups_chk_"+groupId).attr("checked","checked");
        },

        /**
         *新建组成功后更新组的界面
         *@inner
         */
        appendGroup:function(groupName,groupId){
            var data = {
                name:groupName,
                id:groupId
            };

            this.renderGroupList([data]);
            this.checkedGroup(groupId);
            this.$("#AddContacts_GroupName").val("");
            this.$(".GroupContainer")[0].scrollTop = 10000;//滚动到最下面，看到新建的组
            this.hideAddGroup();
            this.trigger("addGroupSuccess", data);
        },

        /**
         *@inner
         */
        initEvent:function(e){
            var This = this;
            /*
			this.on('success',function(){
				var tabname = top.$App.getCurrentTab().name;
				(tabname === 'addrhome' || tabname === 'addr') && top.$App.show('addr'); //刷新通讯录
				if (top.$App.getTabByName("addr")) { top.$App.getTabByName("addr").isRendered = false; }
			});
            */
        },
        /**
         *@inner
         */
        onYesClick: function () {
            var This = this;
            var info = {};
            info.name = this.$("#AddContacts_Name").val();
            info.email = this.$("#AddContacts_Email").val();
            info.mobile = this.$("#AddContacts_Mobile").val();
            info.groupId = [];
            this.$("input:checkbox:checked").each(function () {
                info.groupId.push(this.value);
            });
            if (this.options.serialId) {
                //编辑联系人
                M2012.Contacts.API.editContacts(this.options.serialId, info, function (result) {
                    if (result.success) {
                        top.M139.UI.TipMessage.show("修改成功", { delay: 3000 });
                        This.onSuccess(result);
                    } else {
                        This.showError(result.error || result.msg);
                    }
                });
            } else {
                //添加联系人
                M2012.Contacts.API.addContacts(info, function (result) {
                    if (result.success) {
                        top.M139.UI.TipMessage.show("添加成功", { delay: 3000 });
                        This.onSuccess(result);
                    } else {
                        This.showError(result.error || result.msg);
                    }
                });
            }
        },

        /**
         * 批量添加确认点击
         */
        onBatchYesClick: function () {
            var callback;
            var This = this;
            var groupId = [];
            var info = This.options.addContacts;
            var alink = This.options.alink; //批量增加链接

            This.$("input:checkbox:checked").each(function () {
                groupId.push(this.value);
            });
            
            if (info.length > 0) {
                
                //添加groupId
                $.each(info,function(){
                    this.groupId = groupId;
                });

                callback = function(result){
                    if(result.success){
                        top.M139.UI.TipMessage.show("成功添加{0}个联系人".format(info.length), { delay: 3000 });
                        setTimeout(function(){
                            $App.trigger("change:contact_maindata"); //刷新通讯录
                        }, 2000);

                        if (alink) {
                            alink.hide();//成功添加后隐藏链接
                        }
                        This.onSuccess(result);
                    }else {
                        This.showError(result.error || result.msg);
                    }
                };
                
                if(info.length > 1){
                    Contacts.addContacts(info, callback);                    
                }else{
                    M2012.Contacts.API.addContacts(info[0], callback);
                }               
            }
        },

        /**
         *@inner
         */
        onSuccess: function (result) {
            this.dialog.close();
            this.trigger("success", result);
        },
        /**
         *@inner
         */
        onCancel:function(){
            this.trigger("cancel");
        }
    }));



 })(jQuery, _, M139);

/*
 $(function () {
     
     M2012.Contacts.getModel().requireData(function () {
         new M2012.UI.Dialog.ContactsEditor({
            serialId:"602955467"
         }).render();
     });
 })
 */
/** 
 * @fileOverview 定义联系人选项卡组件
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.ContactsCard";
    /**
    *@namespace
    *@name M2012.UI.Widget.ContactsCard
    */
    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Widget.ContactsCard.prototype*/
    {
        /** 定义联系人选项卡组件
        *@constructs M2012.UI.Widget.ContactsCard
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@inner
        */
        initialize: function (options) {
            var $el = jQuery(this.template);

            this.setElement($el);

            this.contactsModel = M2012.Contacts.getModel();

            this.model = new Backbone.Model();

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:[
        '<div class="tips contactTips" style="left:20px;top:400px;z-index:1023;display:none;">',
 	        '<div class="tips-text">',
 		        '<div class="imgInfo"><img class="imgLink FaceImage" rel="../images/ad/face.jpg" width="50" height="50" alt="">',
 			        '<dl>',
 				        '<dt><span class="Lbl_Name">{name}</span><a class="ml_5 Vip" style="display:none;" href="javascript:;"></a></dt>',
 				        '<dd class="gray Lbl_Email">{email}</dd>',
 				        '<dd class="gray Lbl_Mobile">{mobile}</dd>',
 			        '</dl>',
 		        '</div>',
 		        '<div class="sTipsBtn2 clearfix">',
 			        '<a hidefocus="1" href="javascript:;" class="Contacts">加到通讯录</a>',
                    '<a bh="contactscard_compose" hidefocus="1" href="javascript:;" class="SendEmail">发邮件</a>',
                    '<a bh="contactscard_sms" hidefocus="1" href="javascript:;" class="SendSMS">发短信</a>',
                    '<a hidefocus="1" href="javascript:;" class="more on ShowMore">更多<span class="morfont">&gt;</span></a>',
 		        '</div>',
 		        '<div class="menuPop shadow MoreMenu" style="left:335px;top:70px;display:none">',
                     '<ul>',
                         '<li><a bh="lianxikaclassify_onclick" hidefocus="1" class="LetterSort" href="javascript:;"><span>创建收信规则</span></a></li>',
                         //'<li><a bh="contactscard_tags" hidefocus="1" class="LetterTag" href="javascript:;"><span>设置标签</span></a></li>          ',
                         '<li><a bh="set_mail_arrive_notice" hidefocus="1" class="Notify" href="javascript:;"><span>设置邮件到达通知</span></a></li>',
                         //'<li><a bh="contactscard_reject" hidefocus="1" class="Reject" href="javascript:;"><span>拒收</span></a></li>',
                         //'<li style="display:none"><a bh="contactscard_invite" class="BtnInvite" hidefocus="1" href="javascript:;"><span>邀请</span></a></li>', //通讯录兼容标准版2.0-灰度线验收2013-3-29，屏蔽邀请入口
                         '<li><a bh="contactscard_letterhistory" hidefocus="1" class="LetterHistory" href="javascript:;"><span>往来邮件</span></a></li>',
                     '</ul>',
                 '</div>',
 	        '</div>',
             '<div class="tipsTop diamond"></div>',
         '</div>'].join(""),
        events:{
            "click .Contacts": "onContactsClick",
            "click .SendEmail": "onSendEmailClick",
            "click .SendSMS": "onSendSMSClick",
            "click .BtnInvite": "onInviteClick",
            "click .Reject": "onRejectClick",
            "click .LetterHistory": "onLetterHistoryClick",
            "click .LetterSort": "onLetterSortClick",
            "click .LetterTag": "onLetterTagClick",
            "click .Notify": "onNotifyClick",
            "click .Vip": "onVipClick",
            "click a:": "onButtonClick"
        },
        /**
         *@inner
         *构建dom函数
        */
        render:function(){
            var options = this.options;
            this.initEvent();

            this.$el.appendTo(document.body);

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *@inner
         *显示联系人卡片
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.dockElement 联系人卡片停靠的元素
         *@param {String} options.email 联系人的邮件地址（会自动搜索通讯录联系人）
         *@param {String} options.serialId 可选参数，联系人的id
         *@example
         var card = new M2012.UI.Widget.ContactsCard().render();
         card.show({
            dockElement:document.getElementById("myDiv")
            email:"lifula@139.com"
         });
         */
        show: function (options,isDelay) {
            var This = this;

            if (!options.email && !options.serialId) {
                return;
            }
            if (!options.dockElement || M139.Dom.isRemove($(options.dockElement)[0])) {
                return;
            }
            var jEl = $(options.dockElement);
            if (!jEl.attr("bindcard")) {
                //防止重复绑定
                jEl.attr("bindcard", "1").mouseleave(function () {
                    This.delayHide();
                });
            }
            //延迟显示
            if (isDelay) {
                clearTimeout(this.showTimer);
                this.showTimer = setTimeout(function () {
                    This.show(options);
                }, 500);
                return;
            }

            //绑定数据
            this.setAddrInfo(options);

            //弹出框定位
            var direction = M139.Dom.dockElement(options.dockElement, this.el, {
                margin: options.margin || 0,
                dx : options.dx,
                dy : options.dy
            });

            //改变箭头方向
            if (direction == "up") {
                this.$("div.tipsTop").addClass("tipsBottom").removeClass("tipsTop");
            } else {
                this.$("div.tipsBottom").addClass("tipsTop").removeClass("tipsBottom");
            }

            var overflowX = $(options.dockElement).offset().left + this.$el.width() - $(document.body).width();
            //处理溢出屏幕
            if (overflowX > 0) {
                this.$el.css("left", $(options.dockElement).offset().left - overflowX);
                this.$("div.tipsTop,div.tipsBottom").css("left",15 + overflowX);
            } else {
                this.$("div.tipsTop,div.tipsBottom").css("left", 15);
            }


            this.cancelHide();

            if (options.flag == 'groupMail') { // 专门针对群邮件中联系人卡片的显示图片
                this.renderGroupMailImage(options["groupMail"]);
            }else{
				// 保留原先的逻辑
                this.renderFaceImage();
                this.requestFaceImage();
            }

            try {
                BH("contactscard_show");
            } catch (e) { }

            return superClass.prototype.show.apply(this, arguments);
        },
        

        /**
         *获取联系人头像
         *@inner
         */
        requestFaceImage: function () {
            var This = this;
            var info = this.model.get("info");
            var addrInfo = [];
            if (info.mobile) {
                addrInfo.push(info.mobile);
            }
            if (info.email && M139.Text.Email.getDomain(info.email) == $App.getMailDomain()) {
                var account = M139.Text.Email.getAccount(info.email);
                if (account !== info.mobile) {
                    addrInfo.push(account);
                }
            }
            // 调用后端的批量接口获取图像数据
            M2012.Contacts.API.GetBatchImageUrl({
                addressInfo : addrInfo,
                info : info
            }, function (url) {
                var currentInfo = This.model.get("info");
                if (info.email === currentInfo.email) {//防串
                    This.renderFaceImage(url);
                }
            });
        },

        renderFaceImage: function (url) {
            var img = this.$(".FaceImage");
            if (url) {
                img.attr("src", url);
            } else {
                //默认头像
                img.attr("src", img.attr("rel"));
            }
        },

        renderGroupMailImage : function(param) {
            if (!param) {
                return;
            }

            var img = this.$(".FaceImage");
            if (param.imgUrl) {
                img.replaceWith('<img class="imgLink FaceImage" rel="../images/ad/face.jpg" src="' + param.imgUrl + '" width="50" height="50" alt="">');
            }else{
                // 必须加上FaceImage,保证img元素存在并被替换
                img.replaceWith('<i class="FaceImage group_detailBig">' + param.firstName + '</i>');
            }
        },
        /**
         *@inner
         */
        showMoreMenu:function(){
            var menu = this.$(".MoreMenu");
            menu.show();
            try {
                //这里会不存在？
                var overflowX = menu.offset().left + menu.width() - $(document.body).width();
                if (overflowX > 0) {
                    menu.css("left", 101);
                } else {
                    menu.css("left", 335);
                }
            } catch (e) {
                menu.css("left", 335);
            }
            var menuTop = this.$el.height() - 29;
            //计算溢出值
            var moreTop = this.$el.offset().top + menuTop + M139.Dom.getElementHeight(menu) - $(document.body).height();
            if (moreTop > 0) {
                menuTop -= moreTop;
            }
            menu.css("top", menuTop);
            BH("contactscard_more");
        },

        /**
         *初始化事件行为
         *@inner
         */
        initEvent:function(){
            var This = this;
            $(this.dockElement).mouseover(function(){
                This.show();
            });

            this.$("a.ShowMore").mouseenter(function () {
                This.showMoreMenu();
            }).click(function () {
                This.showMoreMenu();
            });
            this.$el.mouseleave(function () {
                This.$(".MoreMenu").hide();
                This.delayHide();
            });

            this.$el.mouseenter(function () {
                This.cancelHide();
            });

            this.model.on("change:info",function(){
                This.updateHTML();
            });
        },
        /**
         *延迟消失
         *@inner
         */
        delayHide:function(){
            var This = this;
            clearTimeout(this.showTimer);
            if (this.$el.css("display") != "none") {
                this.hideTimer = setTimeout(function () {
                    This.hide();
                }, 500);
            }
        },
        /**
         *取消延迟消失
         *@inner
         */
        cancelHide:function(){
            clearTimeout(this.hideTimer);
        },

        /**
         *@innner
         *更新界面
         */
        updateHTML:function(){
            var info = this.model.get("info");
            this.$(".Lbl_Name").text(info.name);
            this.$(".Lbl_Email").text(info.email||"");
            this.$(".Lbl_Mobile").text(info.mobile||"");
            
            this.isVip = 0; //不在通讯录内
            var contactsBtn = "加到通讯录";
            if(info.id){
                contactsBtn = "编辑";
                this.isVip = 2; //不是vip联系人
                var _vipc = top.Contacts.getVipInfo();
                var i = $.inArray(info.id, _vipc.vipSerialIds.split(','));
                if(i > -1) this.isVip = 1; //是vip联系人
            }
            this.updateVipIcon();
            this.$(".Contacts").text(contactsBtn);

            if (info.email && M139.Text.Email.getDomain(info.email) != $App.getMailDomain()) {
                this.$(".BtnInvite").parent().show();
            } else {
                this.$(".BtnInvite").parent().hide();
            }

        },
        
        updateVipIcon:function(){
            if(this.isVip == 1){
                this.$(".Vip").removeClass('user_gray_vip').addClass('user_vip')
                     .attr('bh','contactscard_delvip')
                     .attr('title','取消“VIP联系人”')
                     .show();
                
            }else if(this.isVip == 2){
                this.$(".Vip").removeClass('user_vip').addClass('user_gray_vip')
                     .attr('bh','contactscard_addvip')
                     .attr('title','添加“VIP联系人”，其邮件将同时标记为“VIP邮件”')
                     .show();
                
            }else{
                this.$(".Vip").hide();
            }
        },

        /**
         *@inner
         *从show参数获取联系人信息
         */
        setAddrInfo:function(options){
            var info = {};
            var addr = M139.Text.Email.getEmail(options.email);
            if(options.serialId){
                var c = this.contactsModel.getContactsById(options.SerialId);
            }else if(options.email){
                var name = M139.Text.Email.getName(options.email);
                var c = this.contactsModel.getContactsByEmail(addr);
                c = c && c[0];
                if (!c) {
                    info.name = name;
                    //info.email = addr;
                } 
            }
            if(c){
                info.name = c.name;
                //info.email = c.getFirstEmail();
                info.mobile = c.getFirstMobile();
                info.id = c.SerialId;
            }
            info.email = addr;
            this.model.set("info",info);//change:info 事件触发别的动作
        },

        /**
         *点击发邮件
         *@inner
         */
        onSendEmailClick: function () {
            var info = this.model.get("info");
            if (info.email) {
                var args = { receiver: M139.Text.Email.getSendText(info.name,info.email) }
            }
            $App.show("compose", null, {
                inputData:args
            });
            return false;
        },

        /**
         *点击发短信
         *@inner
         */
        onSendSMSClick: function () {
            var info = this.model.get("info");
            if (info.mobile) {
                var args = { mobile: M139.Text.Mobile.getSendText(info.name, info.mobile) }
            }
            $App.jumpTo("sms", args);
            return false;
        },

        /**
         *点击添加到通讯录、编辑联系人按钮
         *@inner
         */
        onContactsClick: function () {
            var info = this.model.get("info");
            if (info.id) {
                //编辑联系人
                new M2012.UI.Dialog.ContactsEditor({
                    serialId: info.id
                }).render();
                BH("contactscard_edit");
            } else {
                //添加联系人
                new M2012.UI.Dialog.ContactsEditor({
                    name: info.name,
                    email: info.email,
                    mobile: info.mobile
                }).render();
                BH("contactscard_add");
            }
            return false;
        },



        /**
         *点击邀请
         *@inner
         */
        onInviteClick: function () {
            var email = this.model.get("info").email;
            $App.jumpTo('invitebymail', {
                email: email
            });
            return false;
        },
        /**
         *点击拒收
         *@inner
         */
        onRejectClick: function () {
            $App.trigger("mailCommand", { command: "refuseMail", email: this.model.get("info").email });
            return false;
        },
        /**
         *点击往来邮件
         *@inner
         */
        onLetterHistoryClick:function(){
            $App.trigger("mailCommand", { command: "showTraffic", email: this.model.get("info").email });
            return false;
        },

        /**
         *点击邮件分类
         *@inner
         */
        onLetterSortClick: function () {
            $App.trigger("mailCommand", { command: "autoFilter", email: this.model.get("info").email,name: this.model.get("info").name});
            return false;
        },

        /**
         *点击设置标签
         *@inner
         */
        onLetterTagClick:function(){
            $App.trigger("mailCommand", { command: "autoFilterTag", email: this.model.get("info").email,name: this.model.get("info").name });
            return false;
        },
        /**
         *点击设置到达通知
         *@inner
         */
        onNotifyClick: function () {
            if (!$User.isChinaMobileUser()) {
                $User.showMobileLimitAlert();
                return;
            }
            $App.show("notice");
            return false;
        },
        /**
         *点击添加会删除vip联系人
         *@inner
         */
        onVipClick: function () {
            var This = this;
            var info = this.model.get('info');
            var param = {
                serialId : info.id,
                name : info.name,
                success : function(){
                    This.isVip = This.isVip == 1 ? 2 : 1;
                    This.updateVipIcon();

                    if (This.isVip == 1) {
                        $(top.$App.getCurrentTab().element).find("a.Vip").removeClass('user_gray_vip').addClass('user_vip');
                    } else {
                        $(top.$App.getCurrentTab().element).find("a.Vip").removeClass('user_vip').addClass('user_gray_vip');
                    }

                    $App.trigger("showMailbox", { comefrom: "commandCallback" });
                }
            };
            if(this.isVip == 1){
                top.Contacts.delSinglVipContact(param);
            }else if(this.isVip == 2){
                top.Contacts.addSinglVipContact(param);
            }
        },
        
        /**
         *@inner
         */
        onButtonClick: function (e) {
            var This = this;
            //除了点击更多按钮，其它都隐藏贺卡
            if (!$(e.target).hasClass("ShowMore")) {
                setTimeout(function () {
                    This.hide();
                }, 0);
            }
            M139.Logger.behaviorClick(e.target);//因为对话框很快被移除，无法冒泡，因此主动触发行为点击监控
            return false;
        }
    }));


    //静态函数
    jQuery.extend(M2012.UI.Widget.ContactsCard,
        /**@lends M2012.UI.Widget.ContactsCard*/
        {
            /**
             *显示联系人卡片
             *@param {Object} options 参数集合
             *@param {HTMLElement} options.dockElement 联系人卡片停靠的元素
             *@param {String} options.email 联系人的邮件地址（会自动搜索通讯录联系人）
             *@param {String} options.serialId 可选参数，联系人的id
             *@example
             M2012.UI.Widget.ContactsCard.show({
                dockElement:document.getElementById("myDiv")
                email:"lifula@139.com"
             });
             */
            show:function(options){
                this._create().show(options, true);
            },
            /**@inner*/
            _create: function () {
                if (!this.current) {
                    this.current = new M2012.UI.Widget.ContactsCard().render();
                }
                return this.current;
            }
        }
    );

 })(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件Model对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.Widget.Contacts.Model";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.Model.prototype*/
    {
        /** 弹出菜单组件
         *@constructs M2012.UI.Widget.Contacts.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@param {String} options.filter 过滤的数据类型:email|mobile|fax
         *@param {Boolean} options.selectMode 如果是对话框选择模式，则增加一些功能
         *@example
         var model = new M2012.UI.Widget.Contacts.Model({
             filter:"email"
         });
         */
        initialize: function (options) {
            options = options || {};

            if (top.$App) {
                this.contactsModel = window.top.$App.getModel("contacts");
            } else {
                this.contactsModel = M2012.Contacts.getModel();
            }

            this.filter = options.filter;
            this.colate = options.colate; //change by Aerojin 2014.06.09 过滤非本域用户

            if (options.selectMode) {
                this.selectedList = [];
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,

        dataReady: function (callback) {
            var This = this;
            this.contactsModel.requireData(function () {
                This.contactsData = This.contactsModel.get("data");
                callback();
            });
        },

        /**
         *重构收敛了添加选中联系人的方法
         */
        addSelectedItem: function (item) {
            //无filter，默认按serialId进行对比判同，在通讯录分组选择框中使用
            var compare = _.isUndefined(this.filter) ? item.serialId : item.addr;

            if(this.isSelectedItem(compare)){
                return false;
            }else{
                this.selectedList.push(item);
                return true;
            }
        },
        /**
         *获得组列表
         */
        getGroupList: function () {
            return this.contactsModel.getGroupList();
        },
        /**
         *获得读信联系人组id added by tj
         */
        getReadGroupId: function () {
            var groupList = this.getGroupList();
            for (var i = 0; i < groupList.length; i++) {
                if (groupList[i].name == "读信联系人") {
                    return groupList[i].id;
                }
            }
        },
        /**
         *获得组联系人
         */
        getGroupMembers: function (gid,options) {
            options = options || {};
            //change by Aerojin 2014.06.09 过滤非本域用户
            var contacts =  this.contactsModel.getGroupMembers(gid, {
                filter: this.filter || this.colate,
                colate: this.colate
            });
            if(options.getSendText){
                for(var i=0,len=contacts.length;i<len;i++){
                    if(this.filter == "email"){
                        contacts[i] = contacts[i].getEmailSendText();
                    }else if(this.filter == "mobile"){
                        contacts[i] = contacts[i].getMobileSendText();
                    } else if (this.filter == "fax") {
                        contacts[i] = contacts[i].getFaxSendText();
                    }
                }
            }
            return contacts;
        },


        /**
         * 获得最近联系人。先按内容与SerialId查找到联系人，然后再按条件获得联系方式，注意尽量保持原始的AddrContent
         */
        getLastestContacts: function (data) {
            var contacts = data || this.contactsData.lastestContacts;
            var result = [], ct;
            if (this.filter == "fax") {
                return result;//传真没实现最近紧密联系人
            }
            var addrType = this.filter == "email" ? "E" : "M";
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                var addrcontent = c.AddrContent;

                if (!/\d{5,}/.test(c.SerialId)) {
                    if (c.AddrType == "E") {
                        ct = this.contactsModel.getContactsByEmail(c.AddrContent)[0];
                    } else if (c.AddrType == "M") {
                        ct = this.contactsModel.getContactsByMobile(c.AddrContent)[0];
                    }
                } else {
                    ct = this.contactsData.contactsMap[c.SerialId];
                }

                if (ct) {
                    if (this.filter === "email" && c.AddrType !== "E") {
                        //条件是电邮，但是是通过手机号查找到的联系人，则取出第一电邮替代通讯方式
                        addrcontent = ct.getFirstEmail();
                        if (!addrcontent) {
                            ct = false;
                        }
                    } else if (this.filter === "mobile" && c.AddrType !== "M") {
                        addrcontent = ct.getFirstMobile();
                        if (!addrcontent) {
                            ct = false;
                        }
                    }
                }

                if (ct) {
                    result.push({
                        addr: addrcontent,
                        name: ct.name,
                        SerialId: ct.SerialId
                    });
                } else if (c.AddrType == addrType) {
                    var rndId = this.createLastContactsId();
                    this.lastContactsMap[rndId] = {
                        addr: c.AddrContent,
                        name: c.AddrName,
                        SerialId: rndId
                    };
                    result.push(this.lastContactsMap[rndId]);
                }
            }
            return result;
        },

        /**
         *生成一个假的联系人id，为了兼容一些不存在于通讯录中的最近联系人
         */
        createLastContactsId:function(){
            var rnd = parseInt(Math.random() * 100000000);
            return -rnd;
        },

        lastContactsMap: {},

        /**
         *获得紧密联系人
         */
        getCloseContacts: function () {
            var contacts = this.contactsData.closeContacts;
            return this.getLastestContacts(contacts);
        },
        /**
         *获得未分组联系人
         */
        getUngroupContacts: function (allContacts) {
            var contactsMap = this.contactsData.contactsMap;
            var noGroup = this.contactsData.noGroup;
            var result = [];
            //change by Aerojin 2014.06.18 过滤非本域用户
            for (var i = 0, len = noGroup.length; i < len; i++) {
                var c = contactsMap[noGroup[i]];
                if (this.colate && c && c.getFirstEmail().indexOf(this.colate) > -1) {
                    result.push(c);
                } else if (!this.colate && c) {
                    result.push(c);
                }
            }
            return result;
        },
        /**搜索联系人*/
        getSearchContacts: function () {
            var result = this.contactsModel.search(this.get("keyword"), {
                contacts: this.getContacts()
            });
            return result;
        },
        /**获得联系人*/
        getContacts: function () {
            var contacts = this.get("contacts");
            if (!contacts) {
                var contacts = this.contactsData.contacts;
                if (this.filter || this.colate) {
                    contacts = this.contactsModel.filterContacts(contacts, { filter: this.filter || this.colate, colate: this.colate }); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
                this.set("contacts", contacts);
            }
            return contacts;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            return this.contactsModel.getGroupMembers(this.contactsModel.getVIPGroupId(), { filter: this.filter });
        },
        /**获得vip分组id*/
        getVIPGroupId: function () {
            return this.contactsModel.getVIPGroupId();
        },
        getContactsById: function (cid) {
            if (cid > 0) {
                var item = this.contactsModel.getContactsById(cid);
                if (item) {
                    var email = item.getFirstEmail();
                    return {
                        //this.filter=undefined时,返回邮箱,以解决编辑/新建组手机号码为空的用户无法加入到组.--可能存在BUG--
                        addr: this.filter == "email" ? email : (item.getFirstMobile() || email),
                        name: item.name,
                        SerialId: item.SerialId
                    };
                } else {
                    return null;
                }
            } else {
                return this.lastContactsMap[cid];
            }
        },
        isSelectedItem:function(addr){
            var list = this.selectedList;
            for(var i=0,len = list.length;i<len;i++){
                if(list[i].addr == addr || list[i].SerialId == addr){
                    return true;
                }
            }
            return false;
        },
        getSendText:function(name,addr){
            return this.contactsModel.getSendText(name,addr);
        },

        /**清空最近联系人记录*/
        clearLastContacts: function (isClose) {
            var This = this;
            //todo 这是老的代码移植过来
            var param = {
                type: isClose ? "close" : "last"
            };
            var Msg = {
                warn_delclose: "确认清空所有紧密联系人记录？",
                warn_dellast: "确认清空所有最近联系人记录？"
            };
            top.$Msg.confirm(Msg['warn_del' + param.type], function () {
                top.addBehavior("19_9561_11清空最近/紧密", isClose ? "2" : "1");
                top.Contacts.EmptyLastContactsInfo(param, function (result) {
                    if (result.success) {
                        /**
                         *@event#M2012.UI.Widget.Contacts.Model
                         */
                        This.trigger("contactshistoryupdate");
                    } else {
                        top.$Msg.alert(result.msg);
                    }
                });
            }, {
                icon:"warn"
            });
        },

        /**清空紧密联系人记录*/
        clearCloseContacts:function(){
            this.clearLastContacts(true);
        },

        /**
         *重新加载通讯录数据
         */
        reloadContactsData: function () {
            this.contactsModel.loadMainData();
        }
    }));

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.Contacts.View";

    var GroupsId = {
        //所有联系人
        All: -1,
        //未分组
        Ungroup: -2,
        //最近联系人
        Lastest: -3,
        //紧密联系人
        Close: -4,
        Search: -5
    };

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Widget.Contacts.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.Widget.Contacts.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {Object} options.model model对象，为组件提供数据支持
         *@param {String} options.template 组件的html代码
         *@param {Boolean} options.showSelfAddr 是否显示发给自己，默认是true
         *@param {Boolean} options.showCreateAddr 是否显示添加联系人，默认是true 
         *@param {Boolean} options.showAddGroup 是否显示添加整组的图标，默认是true 
         *@param {Boolean} options.showLastAndCloseContacts 是否显示最近紧密联系人，默认是true 
         *@param {String} options.maxCount 最大添加个数
         *@example
         new M2012.UI.Widget.Contacts.View({
             container:document.getElementById("addrContainer"),
             filter:"email"
         }).render().on("select",function(e){
             if(e.isGroup){
                 alert(e.value.length);
             }else{
                 alert(e.value);
             }
         });
         */
        initialize: function (options) {
            var This = this;
            this.filter = options.filter;
            this.selectMode = options.selectMode;
            this.showCountElFlag = options.comefrom == 'compose_addrinput' ? 'none' : '';
            //change by Aerojin 2014.06.09 过滤非本域用户
            this.model = new M2012.UI.Widget.Contacts.Model({
                filter: this.filter,
                colate: options.colate,
                selectMode: this.selectMode
            });
            var el = $D.getHTMLElement(options.container);
            el.innerHTML = this.template;
            if(options.width !== "auto") {
            	el.style.width = "191px";
            }
            this.setElement(el);
            this.model.dataReady(function () {
                This.render();
                clearTimeout(timer);
            });

            //3秒后显示重试按钮
            var timer = setTimeout(function () {
                This.showRetryDiv();
            }, 3000);

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        retryCount: 0, //用户点击重新加载联系人的次数
        MemberFirstSize: 10, //分组里首次显示最多几个联系人
        MemberPageSize: 500,//分组里每次显示最多几个联系人，点更多加载更多
        template: ['<div class="AddrEmptyTip ta_c loadingerror" style="height:280px;padding:80px 0 0 0">',
        '<div class="LoadingImage" style="padding-top:50px;"><img src="/m2012/images/global/searchloading.gif" /></div>',
            '<div class="bodyerror RetryDiv" style="display:none">',
 		        '<img src="../images/global/smile.png" width="73" height="72">',
 		        '<p>没加载出来，再试一次吧。</p>',
 		        '<a class="btnTb BtnRetry" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	        '</div>',
 		'</div>',
        '<div class="ContentDiv tabContent p_relative" style="display:none;">',
 	    '<div class="searchContact">',
 	      '<input type="text" class="searchContactText">',
 	      '<a hidefocus="1" href="javascript:;" class="searchContactBtn"><i class="i_c-search"></i></a>',
 	    '</div>',
        '<div class="searchEnd-empty SearchEmptyTip" style="display:none">',
            '<a href="javascript:" class="delmailTipsClose BtnCloseSearchEmptyTip"><i class="i_u_close"></i></a>',
            '<p class="gray">查找结果：</p>',
            '<p>没有符合条件的联系人</p>',
        '</div>',
 	    '<div class="searchEnd" style="display:none">',
 		    '<ul class="contactList">',
            '<li data-groupId="-5"><a hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表"><i class="i_plusj"></i><span>搜索结果</span><var></var></a>',
            '<ul class="pb_5">',
               //'<li><a href="javascript:void(0)">18688959302</a></li>',
             '</ul>',
            '</li>',
            '</ul>',
 	    '</div>',
         '<ul class="contactList GroupList">',
           
         '</ul>',
         '<div class="contactListNew">',
		    '<a bh="compose_addressbook_createcontacts" hidefocus="1" class="AddNewContacts" href="javascript:;">+ 新建联系人</a>',
		 '</div>',
        '</div>'].join(""),
        GroupItemTemplate: [
            '<li data-groupId="{groupId}">',
             '<a title="{clearGroupTitle}" href="javascript:;" style="display:{showClearGroup}" class="i_r_yq2 i_dels ClearGroup"></a>',
             '<a bh="compose_addressbook_addgroupclick" hidefocus="1" style="display:{showAddGroup}" title="添加整组" href="javascript:;" class="i_r_yq2 AddGroup"></a>',
             '<a bh="{behavior}" hidefocus="1" class="GroupButton contactList_a" href="javascript:;" title="显示或隐藏成员列表">',
                 '<i class="i_plusj"></i>',
                 '<span>{groupName}</span>',
                 '<var style="display:{showCountEl}">({count})</var>',
                 '</a>',
             '<ul class="pb_5" style="display:none"></ul>',
           '</li>'].join(""),
        MemberItemTemplate: '<li style="display:{display}" class="ContactsItem" data-addr="{addr}" data-contactsId="{contactsId}"><a hidefocus="1" href="javascript:void(0)" title="{addrTitle}">{contactsName}</a></li>',
        //联系人容器dom
        GroupContainerPath: "ul.GroupList",
        events: {
            "click .GroupButton": "onGroupButtonClick",
            "click .LoadMoreMember": "onLoadMoreMemberClick",
            "click .ContactsItem": "onContactsItemClick",
            "click .searchContactBtn": "onClearSearchInput",
            "click .AddGroup": "onAddGroupClick",
            "click .SendToMySelf": "onSendToMySelfClick",
            "click .AddNewContacts": "onAddNewContactsClick",
            "click .BtnCloseSearchEmptyTip": "hideGroupEmptyTip",
            "click .BtnRetry": "onRetryClick",
            "click .ClearGroup": "onClearGroupClick"
        },
        /**构建dom函数*/
        render: function () {
            var options = this.options;

            this.clearSearchButton = this.$("a.searchContactBtn");

            this.$(".AddrEmptyTip").hide();

            this.renderGroupListView();

            this.initEvent();

            if (options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
            if (options.showCreateAddr === false) {
                this.$(".contactListNew").hide();
            }
            this.$("div.ContentDiv").show();
            this.render = function () {
                return this;
            }

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *加载联系组界面
         *@inner
         */
        renderGroupListView: function () {
            var groups = this.model.getGroupList();
            var htmlCode = ['<li class="SendToMySelf contactList_a"><a bh="compose_addressbook_sendself" hidefocus="1" href="javascript:void(0)">发给自己</a></li>'];
            var template = this.GroupItemTemplate;

            if (this.options.showLastAndCloseContacts !== false) {

                //最近联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Lastest,
                    groupName: "最近联系人",
                    clearGroupTitle:"清空最近联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getLastestContacts().length,
                    behavior: "compose_addressbook_lastcontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));

                //紧密联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: GroupsId.Close,
                    groupName: "紧密联系人",
                    clearGroupTitle: "清空紧密联系人记录",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getCloseContacts().length,
                    behavior: "compose_addressbook_closecontacts",
                    showAddGroup: "none",
                    showClearGroup: ""
                }));
            }
            //所有联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.All,
                groupName: "所有联系人",
                showCountEl: this.showCountElFlag,
                count: this.model.getContacts().length,
                behavior: "compose_addressbook_allcontacts",
                showAddGroup: "none",
                showClearGroup: "none"
            }));

            //未分组联系人
            htmlCode.push(M139.Text.format(template, {
                groupId: GroupsId.Ungroup,
                groupName: "未分组",
                showCountEl: this.showCountElFlag,
                count: this.model.getUngroupContacts().length,
                behavior: "compose_addressbook_ungroup",
                showAddGroup: "none",
                showClearGroup: "none"
            }));
            if (this.options.showVIPGroup !== false) {
                //vip联系人
                htmlCode.push(M139.Text.format(template, {
                    groupId: this.model.getVIPGroupId(),
                    groupName: "VIP联系人",
                    showCountEl: this.showCountElFlag,
                    count: this.model.getGroupMembers(this.model.getVIPGroupId()).length,
                    behavior: "compose_addressbook_vip",
                    showAddGroup: this.options.showAddGroup === false ? "none" : "",
                    showClearGroup: "none"
                }));
            }
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                var members = this.model.getGroupMembers(g.id).length;
                var showAddGroup = this.options.showAddGroup === false ? "none" : "";
                var h = null;

                //读信联系人特别处理上报
                if (g.name == "读信联系人") {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_readcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                else {
                    h = M139.Text.format(template, {
                        groupId: g.id,
                        groupName: M139.Text.Html.encode(M139.Text.Utils.getTextOverFlow(g.name, 6, true)),
                        showCountEl: this.showCountElFlag,
                        count: members,
                        behavior: "compose_addressbook_customcontacts",
                        showAddGroup: showAddGroup,
                        showClearGroup: "none"
                    });
                }
                htmlCode.push(h);
            }
            htmlCode = htmlCode.join("");
            this.$(this.GroupContainerPath)[0].innerHTML = htmlCode;

            if (this.options.showSelfAddr === false) {
                this.$(".SendToMySelf").hide();
            }
        },
        /**
         *初始化事件行为
         *@inner
         */
        initEvent: function () {
            var This = this;
            //切换展开组
            this.model.on("change:currentGroup", function (model, gid) {
                var oldGid = model.previous("currentGroup");
                if (oldGid != null) {
                    this.hideGroupMember(oldGid);
                }
                if (gid) {
                    this.showGroupMember(gid);
                }
            }, this);

            //最近紧密联系人记录清除后
            this.model.on("contactshistoryupdate", function () {
                This.updateView();
            });

            //监听搜索框输入
            var input = this.$("input")[0];
            M139.Timing.watchInputChange(input, function () {
                This.onSearchInputChange(input.value);
            });

            //选择模式下，选中的联系人左边列表要隐藏
            if (this.selectMode) {
                this.on("additem", function (e) {
                    var addr = [];
                    if (!e.isGroup) {
                        e.SerialId = e.serialId;
                        addr = [e];
                    } else {
                        addr = e.value;
                    }

                    if (This.filter) {
                        for (var i=0; i<addr.length; i++) {
                            if(addr[i].addr && addr[i].addr.length){
                                This.utilGetMemberElement(addr[i].addr).hide();
                            }else{
                                This.utilGetMemberElementById(addr[i].serialId).hide();
                            }
                        }
                    } else {
                        for (var i=0; i<addr.length; i++) {
                            This.utilGetMemberElementById(addr[i].serialId).hide();
                        }
                    }
                });
                this.on("removeitem", function (e) {
                    if (This.filter) {
                        if(e && e.addr.length){     
                            This.utilGetMemberElement(e.addr).show();
                        }else{
                            This.utilGetMemberElementById(e.serialId).hide();
                        }
                    } else {
                        This.utilGetMemberElementById(e.serialId).show();
                    }
                });
            }

            this.on("print", function () {
                this.model.set("currentGroup", GroupsId.Lastest);
            });

        },
        /**@inner*/
        showGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").show();
        },
        /**@inner*/
        hideGroupEmptyTip:function(){
            this.$(".SearchEmptyTip").hide();
        },

        /**
         *显示重试按钮
         *@inner
        */
        showRetryDiv: function () {
            var This = this;
            This.$(".LoadingImage").hide();
            This.$(".RetryDiv").show();

            if (This.retryCount > 1) {
                var total = -1, arrlength = -1, glength = -1, datstr = "hasdata";
                var cmodel = This.model.contactsModel || {};
                if (cmodel.get) {
                    var data = cmodel.get("data");
                    if (_.isUndefined(data)) {
                        datstr = "nodata";
                    } else {
                        total = data.TotalRecord;
                        if ($.isArray(data.Contacts)) {
                            arrlength = data.Contacts.length;
                        }
                        if ($.isArray(data.Groups)) {
                            glength = data.Groups.length;
                        }
                    }
                }

                This.logger.error($TextUtils.format('addrlist retry fail|filter={0}|mode={1}|retry={2}|data={3}|isLoading={4}|total={5}|contacts={6}|groups={7}',
                    [This.filter, This.selectMode, This.retryCount, datstr, cmodel.isLoading, total, arrlength, glength]));
            }
        },

        /**@inner*/
        renderMemberView: function (gid, mode) {
            var container = this.utilGetMemberContainer(gid);
            var containerInit = container.attr("init") || 0;
            if (mode == "init" && container.attr("init") == 1) {
                return;
            }

            //显示组成员
            var htmlCode = [];
            var template = this.MemberItemTemplate;
            var contacts;
            if (gid == GroupsId.All) {
                contacts = this.model.getContacts();
            } else if (gid == GroupsId.Lastest) {
                contacts = this.model.getLastestContacts();
            } else if (gid == GroupsId.Close) {
                contacts = this.model.getCloseContacts();
            } else if (gid == GroupsId.Ungroup) {
                contacts = this.model.getUngroupContacts();
            } else if (gid == GroupsId.Search) {
                contacts = this.model.getSearchContacts();
            } else {
                contacts = this.model.getGroupMembers(gid);
            }

            if (gid == GroupsId.Search && contacts.length == 0) {
                //显示搜索结果为空的提示
                this.showGroupEmptyTip();
                this.switchGroupMode();
            } else {
                this.hideGroupEmptyTip();
            }


            //一共几个联系人
            var total = contacts.length;
            //当前已显示几个
            var showCount = container.find("li[data-addr]").length;
            //一次追加几个
            var pageSize = containerInit == 1 ? this.MemberPageSize : this.MemberFirstSize;

            //分页显示的，每次显示10个，点击更多每次新显示10
            for (var i = showCount, len = Math.min(showCount + pageSize, total) ; i < len; i++) {
                var c = contacts[i];
                var addr = c.addr || this.getAddr(c);//最近联系人直接有addr属性，联系人对象需要获取
                var addrText = M139.Text.Html.encode(addr);

                if (!this.filter){
                    addr = c.SerialId;
                }

                var isDisplay = !(this.selectMode && this.model.isSelectedItem(addr))

                htmlCode.push(M139.Text.format(template, {
                    contactsId: c.SerialId,
                    contactsName: M139.Text.Html.encode(c.name),
                    addr: addrText,
                    addrTitle: addrText,
                    display: isDisplay ? "" : "none"
                }));
            }
            //如果还没显示完
            if (showCount + pageSize < total) {
                htmlCode.push('<li class="LoadMoreMember" data-groupId="'
                    + gid + '"><a hidefocus="1" href="javascript:;">更多<span class="f_SimSun">↓</span></a></li>');
            }
            htmlCode = htmlCode.join("");
            container.append(htmlCode);
            container.attr("init", 1);//表示已经加载过一次数据了
        },
        /**@inner*/
        onLoadMoreMemberClick: function (e) {
            $(M139.Dom.findParent(e.currentTarget, "li")).hide();
            var gid = this.utilGetClickGroupId(e);
            this.renderMemberView(gid);
        },


        /**@inner*/
        onClearSearchInput: function () {
            top.BH('compose_addressbook_search');
            var txt = this.$("input:text");
            if (this.$(".searchContact").hasClass("searchContact-on")) {
                txt.val("");
            }
            this.hideGroupEmptyTip();
            txt.focus();           
        },

        /**
         *搜索框输入值变化
         *@inner
         */
        onSearchInputChange: function (value) {
            if (value == "") {
                this.switchGroupMode();
                this.$(".searchContact").removeClass("searchContact-on");
            } else {
                this.renderSearchView(value);
                this.$(".searchContact").addClass("searchContact-on");
                this.trigger('BH_onSearch');
            }
        },

        /**
         *从搜索视图返回正常视图
         *@inner*/
        switchGroupMode: function () {
            this.$(".searchEnd").hide();
            this.$(".GroupList").show();
        },

        /**@inner*/
        renderSearchView: function (keyword) {
            this.$(".GroupList").hide();
            this.$(".searchEnd").show();
            this.$(".searchEnd li ul").html("").attr("init", 0);
            this.model.set("keyword", keyword);
            this.model.set("currentGroup", null);//否则不会触发change:currentGroup
            this.model.set("currentGroup", GroupsId.Search);
        },
        /**@inner*/
        onGroupButtonClick: function (e) {
            var gid = this.utilGetClickGroupId(e);
            var currentGid = this.model.get("currentGroup");
            if (currentGid == gid) {
                this.model.set("currentGroup", null);
            } else {
                this.model.set("currentGroup", gid);
            }
        },

        /**
         *点击发给自己
         *@inner
        */
        onSendToMySelfClick: function () {
            var name = top.$User.getTrueName();
            if(this.filter == "email"){
                var addr = top.$User.getDefaultSender();
            }else if(this.filter == "mobile"){
                var addr = top.$User.getShortUid();
            }
            var sendText = this.model.getSendText(name,addr);
            var result = {
                value:sendText,
                name:name,
                addr:addr
            };
            if (this.selectMode) {
				if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else {
				    var ok = this.model.addSelectedItem(result);
				    ok && this.trigger("additem", result);
                }
            } else {
                this.trigger("select", result);
            }
        },


        /**@inner*/
        showGroupMember: function (gid) {
            this.renderMemberView(gid, "init");
            //显示成员容器
            this.utilGetMemberContainer(gid).show();
            //折叠+变-
            this.utilGetGroupElement(gid).find("a.GroupButton i").addClass("i_minus");
        },
        /**@inner*/
        hideGroupMember: function (gid) {
            //隐藏成员容器
            this.utilGetMemberContainer(gid).hide();
            //折叠-变+
            this.utilGetGroupElement(gid).find("a.GroupButton i").removeClass("i_minus");
        },

        /**
         *点击选择联系人
         *@inner
         */
        onContactsItemClick: function (clickEvent) {
            var cid = M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-contactsId");
            var c = this.model.getContactsById(cid);
            var sendText = this.model.getSendText(c.name, c.addr);
            var result = {
                value:sendText,
                name:c.name,
                addr: c.addr,
                serialId: c.SerialId
            };
            if (this.selectMode) {
                if (this.model.selectedList.length >= this.options.maxCount) {
                    this.trigger("additemmax");
                } else if(this.options.isAddVip && top.Contacts.IsPersonalEmail(c.SerialId)){
						top.FF.alert("不支持添加自己为VIP联系人。");
				}else{
                    var ok = this.model.addSelectedItem(result);
                    ok && this.trigger("additem", result);
				}
            } else {
                this.trigger("select", result);
                //最近联系人
                if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -3) {
                    top.BH("compose_addressbook_lastitem");
                }
                //紧密联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -4) {
                    top.BH("compose_addressbook_closeitem");
                }
                //所有联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -1) {
                    top.BH("compose_addressbook_allitem");
                }
                //未分组
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == -2) {
                    top.BH("compose_addressbook_noitem");
                }
                //vip联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getVIPGroupId()) {
                    top.BH("compose_addressbook_vipitem");
                }
                //读信联系人
                else if ($(clickEvent.currentTarget).parent().parent().attr("data-groupid") == this.model.getReadGroupId()) {
                    top.BH("compose_addressbook_readitem");
                }
                else {
                    BH("compose_addressbook_itemclick");
                }
            }
        },

        /**
         *点击添加整组
         *@inner
         */
        onAddGroupClick: function (e) {
            var item;            
            var gid = this.utilGetClickGroupId(e);
            if (gid > 0) {
                if (this.selectMode) {
                    var list = this.model.getGroupMembers(gid).concat();
					var vipList=[];

                    for (var i = 0; i < list.length; i++) {
                        var c = list[i];
						if (this.filter == "email") {
                            var sendText = c.getEmailSendText();
                        } else if (this.filter == "mobile") {
                            var sendText = c.getMobileSendText();
                        }  
                        item = {
                            value:sendText,
                            name:c.name,
                            addr: this.getAddr(c),
                            serialId: c.SerialId,
                            SerialId: c.SerialId
                        };
                        list[i] = item;
						if (this.model.selectedList.length >= this.options.maxCount) {
							this.trigger("additemmax");
                            break;
                        } else if(this.options.isAddVip){ //vip联系人不能重复被选中-添加整组排重
							var selected = this.model.selectedList;
							var hasSelevted = false;
							for(var j=0; j< selected.length;j++){
								if(item.serialId == selected[j].serialId ||top.Contacts.IsPersonalEmail(item.serialId)){
									hasSelevted = true;
									break;
								}
							}
							if(!hasSelevted){
								var ok = this.model.addSelectedItem(item);
								ok && vipList.push(item);
							}
                        } else {
                            var ok = this.model.addSelectedItem(item);
                            if (!ok) {
                                list.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    this.trigger("additem", {
                        isGroup: true,
                        group: gid,
                        value: !this.options.isAddVip? list:vipList
                    });
                } else {
                    this.trigger("select", {
                        isGroup: true,
                        group: gid,
                        value: this.model.getGroupMembers(gid, {
                            getSendText: true
                        })
                    });
                }
                this.utilGetMemberContainer(gid).find("li").hide();
            }

            this.trigger("BH_onAddGroup");//增加行为ID
        },

        /**
         *点击添加联系人
         *@inner
         */
        onAddNewContactsClick: function () {
            var This = this;
            var topWin = M139.PageApplication.getTopAppWindow();
            var addView = new topWin.M2012.UI.Dialog.ContactsEditor().render();
            addView.on("success", function (result) {
                This.trigger('addContact', result);
                This.onAddContacts();
                //上报添加联系人成功行为
                BH("compose_linkmansuc");
            });

            addView.on('addGroupSuccess', function(result){                
                This.trigger('addGroup', result);
            });

            this.trigger('BH_onAddNewContacts');
        },

        /**
         *添加联系人成功时触发
         */
        onAddContacts: function () {
            this.updateView();
        },

        /**
         *由于数据变化 重绘通讯录界面
         */
        updateView:function(){
            //清除缓存数据
            this.model.set("contacts", null);
            this.renderGroupListView();
            this.model.set("currentGroup", null);
        },

        /**
         *点击重试，重新加载通讯录数据
         */
        onRetryClick: function () {
            var This = this;
            This.retryCount++;

            this.$(".LoadingImage").show();
            this.$(".RetryDiv").hide();
            setTimeout(function () {
                This.showRetryDiv();
            }, 5000);
            this.model.reloadContactsData();
        },

        /**
         *点击清空最近、紧密联系人
         */
        onClearGroupClick: function (e) {
            if ($(e.target).parent().attr('data-groupid') == -3) {
                top.BH("compose_addressbook_lastcancel");
            }
            if ($(e.target).parent().attr('data-groupid') == -4) {
                top.BH("compose_addressbook_closecancel");
            }
            var gid = this.utilGetClickGroupId(e);
            if (gid == GroupsId.Lastest) {
                this.model.clearLastContacts();
            } else if (gid == GroupsId.Close) {
                this.model.clearCloseContacts();
            }
        },

        /**
         *todo move to model
         *@inner
         */
        getAddr: function (c) {
            var addr = "";
            if (this.filter == "email") {
                addr = c.getFirstEmail();
            } else if (this.filter == "mobile") {
                addr = c.getFirstMobile();
            } else if (this.filter == "fax") {
                addr = c.getFirstFax();
            } else {
                addr = c.SerialId;
            }
            return addr;
        },

        /**
         *todo move to model
         *添加已选的部分联系人（对话框选择模式下有用）
         */
        addSelectedItems: function (selContacts) {
            var filter = this.filter;
            for (var i = 0; i < selContacts.length; i++) {
                var c = selContacts[i];
                if (typeof c == "object") {
                    var ok = this.model.addSelectedItem(c);
                    ok && this.trigger("additem", c);
                } else {
                    var addr = "";
                    var name = "";
                    if (filter == "email") {
                        addr = M139.Text.Email.getEmail(c);
                        name = M139.Text.Email.getName(c);
                        value = M139.Text.Email.getSendText(name, addr);
                    } else if (filter == "mobile") {
                        addr = M139.Text.Mobile.getMobile(c);
                        name = M139.Text.Mobile.getName(c);
                        value = M139.Text.Mobile.getSendText(name, addr);
                    }
                    if (addr) {
                        var item = {
                            name: name,
                            addr: addr,
                            value: value
                        };
                        var ok = this.model.addSelectedItem(item);
                        ok && this.trigger("additem", item);
                    }
                }
            }


        },
        removeSelectedAddr: function (param) {
            var list = this.model.selectedList;
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                var tmpCopareItem ="";
				tmpCopareItem = !this.options.isAddVip? item.addr :item.serialId;

                if (!this.filter) {
                    tmpCopareItem = item.serialId;
                }


				if (tmpCopareItem == param) {
                    list.splice(i, 1);
                    this.trigger("removeitem", item);
                    return;
                }
            }

        },

        /**
         *选择模式下获得选中的成员
         */
        getSelectedItems:function(){
            if(this.selectMode){
                var result = this.model.selectedList.concat();
                return result;
            }else{
                return null;
            }
        },

        /**@inner*/
        utilGetClickGroupId: function (clickEvent) {
            return M139.Dom.findParent(clickEvent.target, "li").getAttribute("data-groupId");
        },
        utilGetMemberElement: function (addr) {
            return this.$("li[data-addr='" + addr + "']");
        },

        /**@inner*/
        utilGetMemberElementById: function (serialId) {
            return this.$("li[data-contactsid='" + serialId + "']");
        },

        /**@inner*/
        utilGetGroupElement: function (gid) {
            return this.$("li[data-groupId='" + gid + "']");
        },
        /**@inner*/
        utilGetMemberContainer: function (gid) {
            return this.utilGetGroupElement(gid).find("ul");
        }

    }));
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录地址本对话框
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.AddressBook";

    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.Dialog.AddressBook.prototype*/
    {
       /** 定义通讯录地址本组件代码
        *@constructs M2012.UI.Dialog.AddressBook
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 地址本类型:email|mobile|fax|mixed
        *@param {String} options.receiverText 显示接收人标题（默认为"接收人")
        *@param {String} options.dialogTitle 对话框标题（默认为"从联系人添加");
        *@param {Boolean} options.getDetail 是否返回object类型的联系人数据
        *@param {Boolean} options.showLastAndCloseContacts 是否显示最近联系人、紧密联系人（默认值为true)
        *@param {Boolean} options.showVIPGroup 是否显示最近联系人、紧密联系人（默认值为true)
        *@example
        */
        initialize: function (options) {
            this.filter = options.filter;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template:['<div class="addFormContact">',
             '<table>',
                 '<tbody><tr>',
                     '<td width="193">联系人(<var class="Label_ContactsLength"></var>)</td>',
                     '<td width="36"></td>',
                     '<td width="195"><var class="Label_ReceiverText"></var></td>',
                 '</tr>',
                 '<tr>',
                     '<td>',
                     '<div class="addFcLeft p_relative AddressBookContainer">',
                     '</div>',
                     '</td>',
                     '<td class="ta_c"><i class="i_addjt"></i></td>',
                     '<td>',
                         '<div style="width:221px;" class="menuPop addFcRight">',
                             /*
                             '<a href="#" class="lia">',
                                 '<i class="i_del"></i>',
                                 '<span>18688959302 sdfsdffffffffffffffffffffffffffffffff</span>',
                             '</a>',
                             */
                         '</div>',
                     '</td>',
                 '</tr>',
             '</tbody></table>',
         '</div>'].join(""),

        /**构建dom函数*/
        render:function(){
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML(this.template,function(){
                This.onSelect();
            },function(){
                This.onCancel();
            },{
                width:"500px",
                buttons:["确定","取消"],
                dialogTitle:options.dialogTitle || "从联系人添加"
            });

            this.addressBook = new M2012.UI.Widget.Contacts.View({
                container: this.dialog.$(".AddressBookContainer")[0],
                showLastAndCloseContacts: options.showLastAndCloseContacts,
                showVIPGroup: options.showVIPGroup,
                showSelfAddr:options.showSelfAddr,
                maxCount: options.maxCount,
                selectMode:true,
                filter:this.filter,
				isAddVip:options.isAddVip,
                comefrom:options.comefrom
            }).render().on("additem", function (e) {
                if (e.isGroup) {
                    var list = e.value;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        This.onAddItem(item.name, item.addr,item.serialId);
                    }
                } else {
                    This.onAddItem(e.name, e.addr,e.serialId);
                }
            }).on("removeitem",function(e){
                This.onRemoveItem(e.addr,e.serialId);
            }).on("additemmax", function (e) {
                This.trigger("additemmax");
            });

            this.on("print",function(){
                //初始化组件的时候，有可能用户已经添加了部分联系人
                if(options.items){
                    this.addressBook.addSelectedItems(options.items);
                }
            });

            this.setElement(this.dialog.el);

            this.setTips({
                contactsLength:this.addressBook.model.getContacts().length,
                receiverText:options.receiverText || "接收人"
            });

            this.initEvent();

            return superClass.prototype.render.apply(this, arguments);
        },
        selectedTemplate: ['<a hidefocus="1" data-contactsid ="{serialId}"  data-addr="{addr}" href="javascript:;" class="lia">',
            '<i class="i_del"></i>',
            '<span>{sendText}</span>',
        '</a>'].join(""),
        initEvent:function(e){
            var This = this;
            this.$(".addFcRight").click(function(e){
                if(e.target.className == "i_del"){
                   
					var addr = e.target.parentNode.getAttribute("data-addr");
					if(This.options.isAddVip){
						addr = e.target.parentNode.getAttribute("data-contactsid");
					}
					This.addressBook.removeSelectedAddr(addr);
                }
            });
        },
        onAddItem:function(name,addr,serialId){
            var sendText = this.filter == "email" ? M139.Text.Email.getSendText(name,addr) :
                M139.Text.Mobile.getSendText(name,addr);
            var html = M139.Text.format(this.selectedTemplate,{
                addr:M139.Text.Html.encode(addr),
                sendText:M139.Text.Html.encode(sendText),
                serialId:M139.Text.Html.encode(serialId)
            });
            $(".addFcRight").append(html);
        },
        onRemoveItem:function(addr,serialId){
           if(!this.options.isAddVip){
				this.$("a[data-addr='"+addr+"']").remove();
			}else{
				this.$("a[data-contactsid='"+serialId+"']").remove();
			}
        },
        setTips:function(options){
            this.$(".Label_ContactsLength").html(options.contactsLength);
            this.$(".Label_ReceiverText").html(options.receiverText);
        },
        onSelect:function(){
            var items = this.addressBook.getSelectedItems();
            //默认返回的是["",""]，如果是getDetail返回[{},{}],可以有serialId等参数
            if (this.options.getDetail !== true) {
                for (var i = 0; i < items.length; i++) {
                    items[i] = items[i].value;
                }
            }
            this.trigger("select",{
                value:items
            });
        },
        onCancel:function(){
            this.trigger("cancel");
        }
    }));


     //扩展静态函数
    $.extend(M2012.UI.Dialog.AddressBook,
    /**@lends M2012.UI.Dialog.AddressBook*/
    {
        /**
        *创建实例
        *@param {Object} options 参数集
        *@example
        */
        create: function (options) {
            var view = new M2012.UI.Dialog.AddressBook(options).render();
            return view;
        }
    });
 })(jQuery,_,M139);
﻿﻿/**
 * @fileOverview 定义App类，用于建立页面编程模型指引，统一编程风格，你会看到各种资源都是通过注册、读取使用
 */

(function (jQuery, Backbone, M139) {

    var superClass = M139.Model.ModelBase;

    M139.namespace("M139.PageApplication", superClass.extend(
    /**
     *@lends M139.PageApplication.prototype
     */
    {
        /** 
        *App类，用于指导页面编程模型，统一编程风格
        *@constructs M139.PageApplication
        *@param {Object} options 初始化参数集
        *@param {String} options.name app的名称，用以记录日志、分配资源使用
        *@param {Window} options.window 初始化参数集
        *@example
        */
        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);

            options = options || {};

            var This = this;

            /**
            *app的对象实例的名称，当发生异常的时候易于定位
            *@filed
            *@type {Window}
            */
            this.name = options.name || this.name;

            /**
            *app的页面window对象
            *@filed
            *@type {Window}
            */
            this.win = options.window || window;

            //将第一个实例视作TopApp
            if (!M139.PageApplication.getTopApp()) {
                M139.PageApplication.registerTopApp(this);
            }

            /**
            *url参数集合,避免多个地方使用$Url.query()，所以一次性建立
            *@filed
            *@type {Object}
            *@example
            http://baidu.com/?a=1&b=2
            pageApp.query.a
            pageApp.query.b
            */
            this.query = M139.Text.Url.getQueryObj(this.win.location.href);

            /**
            *一个大的注册表，几乎所有配置都往里边写
            *@filed
            *@type {M139.ConfigManager}
            */
            //this.config = new M139.ConfigManager();
            this.config = $Config;
            this.config.on("update", function (e) {
                /**
                *配置发生变更时
                *@event
                */
                This.trigger("configupdate", e);
            });

            /**
            *外部转入此页面的数据(见inputDataToUrl方法)，与query不同，它可以保存大量的参数，通过setStorage和getStorage实现，storageId在url中传入
            *@filed
            *@type {Object}
            */
            this.inputData = null;
            if (this.query && this.query.inputData) {
                this.inputData = this.getStorage(this.query.inputData);
            }


            if (options.views) {
                this.registerView(options.views);
            }
        },

        /**
        *注册配置变量
        **/
        registerConfig: function (configName, configObj) {
            return this.config.registerConfig.apply(this.config, arguments);
        },

        /**
         *为单个配置赋值
         */
        setConfig: function (name, key, value) {
            return this.config.setConfig.apply(this.config, arguments);
        },

        /**
         *读取配置
         */
        getConfig: function () {
            return this.config.getConfig.apply(this.config, arguments);
        },


        /**
        *注册提示语
        *@param {Object} message 要注册的提示语集合
        *@example
        pageApp.registerMessage({
            "NoParamError":"请输入合法参数",
            "TooLong":"太长了"
        });
        **/
        registerMessages: function (messages) {
            this.config.registerConfig("Message", messages);
        },

        /**
        *获取提示语
        *@param {String} key 要读取的提示语key
        *@example
        pageApp.registerMessage({
            "NoParamError":"请输入合法参数"
        });
        var message = pageApp.getMessage("NoParamError");
        **/
        getMessage: function (key) {
            this.config.getConfig("Message", key);
        },

        /**
        *等待某些异步条件成熟后执行后执行操作(通常是数据加载等)，回调只执行一次
        *@param {String} somethingReady 条件，支持分隔符“&”、“|”和“,” 一次只能用一种条件分隔符
        *@param {Function} handler 执行回调
        *@example
        //当初始化数据加载、并且编辑器加载，执行回调一次
        pageApp.await(“initdataload & editorload”,function(){});

        //当初始化数据加载以及当编辑器加载的时候，各执行回调一次
        pageApp.await(“initdataload,editorload”,function(){});

        //当初始化数据加载 或者 编辑器加载的时候，执行回调一次
        pageApp.await(“initdataload | editorload”,function(){});


        setTimeout(function(){
            pageApp.makeReady("initdataload",{});
        },1000);

        setTimeout(function(){
            pageApp.makeReady("editorload",{});
        },2000);
        */
        await: function (somethingReady, handler) {
            if (typeof somethingReady != "string") {
                throw this.logger.getThrow("await参数非法，必须为字符串");
            } else if (!jQuery.isFunction(handler)) {
                throw this.logger.getThrow("await参数非法，必须为函数");
            }
            var type = 0;
            var map = {
                "|": 1,
                ",": 2,
                "&": 4
            };
            somethingReady.replace(/&|,|\|/g, function (c) {
                type ^= map[c];
            });

            if (type === map["|"] || type === map[","] || type === map["&"]) {
                //切割并去空格
                somethingReady = jQuery.map(somethingReady.split(/&|,|\|/), function (a) { return jQuery.trim(a) });

            } else if (type !== 0) {
                //多种操作符
                throw this.logger.getThrow("await参数非法，只能同时使用一种操作符");
            }
            this.on("somethingready", function (e) {
                var whatsReady = e.event;
                var data = e.data;
                if (jQuery.isArray(somethingReady)) {
                    var index = jQuery.inArray(whatsReady, somethingReady);
                    if (index > -1) {
                        if (type === map["|"]) {
                            this.off("somethingready", arguments.callee);
                            handler.call(this, data, whatsReady);
                        } else if (type === map[","]) {
                            somethingReady.splice(index, 1);
                            handler.call(this, data, whatsReady);
                        } else if (type === map["&"]) {
                            somethingReady.splice(index, 1);
                            if (somethingReady.length === 0) {
                                this.off("somethingready", arguments.callee);
                                handler.call(this, data);
                            }
                        }
                    }
                } else if (whatsReady === somethingReady) {
                    this.off("somethingready", arguments.callee);
                    handler.call(this, data);
                }
            });
        },

        /**
        *它是对于await的回应
        *@param {String} whatsReady 完成的条件名
        *@param data 时间数据
        */
        makeReady: function (whatsReady, data) {
            this.trigger("somethingready", { event: whatsReady, data: data });
        },

        /**得到邮箱顶层窗口对象*/
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },

        /**得到邮箱顶层窗口对象的PageApp实例对象*/
        getTopPageApp: function () {
            return M139.PageApplication.getTopApp();
        },

        /**读取寄存的数据*/
        getStorage: function (key) {
            var app = this.getTopPageApp();
            if (app != this) {
                return app.getStorage.apply(app, arguments);
            }
            var json = this.config.getConfig("_Storage_", key);
            try {
                json = M139.JSON.parse(json);
            } catch (e) {
                //throw this.logger.getThrow("getStorage M139.JSON.parse error");
                json = M139.JSON.tryEval(json);
            }
            return json;
        },

        /**将数据寄存，涉及到将数据序列化，有性能开销，因此只在跨窗口引用时候使用
        *@param object 要寄存的数据
        *@returns {String} 返回一个存储的id，在getStorage的时候使用
        *@example
        var storageId = pageApp.setStorage({name:"Lily",age:18});

        pageApp.getStorage(storageId);//读取

        */
        setStorage: function (object) {
            var app = this.getTopPageApp();
            if (app != this) {
                return app.setStorage.apply(app, arguments);
            }

            var key = Math.random();
            app.config.setConfig("_Storage_", key, M139.JSON.stringify(object));
            return key;
        },


        /**解决页面之间传递数据，该函数传入页面url与要传入的数据对象，返回一个格式化的url，里面带有暂存数据的id信息，子页面可以通过inputData属性取到
        *@param {String} url iframe的页面地址
        *@param {Object} data 要传入的数据
        *@example
        var url = "/compose.html";
        url = pageApp.inputDataToUrl(url,{mid:"xxxx"});
        var iframe = document.createElement("iframe");
        iframe.src = url;
        //将由iframe中的PageApp实例对象自动读取出数据
        */
        inputDataToUrl: function (url, data) {
            return M139.Text.Url.makeUrl(url, {
                inputData: this.setStorage(data)
            });
        },

        /**注册与通讯相关的方法，虽然看起来很傻，但是大家统一用这种方式，代码便于寻找，也便于区分其它代码，写出优雅的代码
        *@param {Object} clientList 注册与http请求相关的方法列表
        *@example
        pageApp.registerHttpClient({
            "reply":function(){
            
            },
            "forward":function(){
            
            },
            "replyAll":{
            
            }
        });
        */
        registerHttpClient: function (clientList) {
            this.config.registerConfig("HttpClient", clientList);
        },

        /**
        *得到发送请求的相关方法
        *@returns {Function} 返回http请求方法
        *@example
        pageApp.getHttpClient("forward")(mid);
        */
        getHttpClient: function (name) {
            return this.config.getConfig("HttpClient", name);
        },

        /**
        *注册并托管view
        *@param {String} name 注册view的名字
        *@param {Object} view 视图对象
        *@example
        //支持两种写法
        pageApp.registerView(name,view);
        pageApp.registerView({
            name:view
        });
        */
        registerView: function (name, view) {
            if (typeof arguments[0] == "object") {
                this.config.registerConfig("Views", arguments[0]);
            } else {
                this.config.setConfig("Views", name, view);
            }
        },
        /**获取view对象*/
        getView: function (name) {
            return this.config.getConfig("Views", name);
        },

        /**
        *注册并托管Model
        *@param {String} name 注册view的名字
        *@param {Object} model 视图对象
        *@example
        //支持两种写法
        pageApp.registerModel(name,model);
        pageApp.registerModel({
            name:model
        });
        */
        registerModel: function (name, model) {
            if (typeof arguments[0] == "object") {
                this.config.registerConfig("Models", arguments[0]);
            } else {
                this.config.setConfig("Models", name, model);
            }
        },
        /**获取托管的model对象*/
        getModel: function (name) {
            return this.config.getConfig("Models", name);
        }
    }));


    //扩展静态函数
    jQuery.extend(M139.PageApplication,
    /**@lends M139.PageApplication*/
    {
        /**
         *得到邮箱的顶层窗口对象，可以直接调用window.getTopAppWindow();
         *@returns {Window}
         */
        getTopAppWindow: function () {
            return window.top;//暂时简单实现
        },

        /**
        *注册顶层app对象
        *@inner
        */
        registerTopApp: function (app) {
            this.getTopAppWindow()._pageapp = app;
        },

        /**
        *返回顶层app对象
        */
        getTopApp: function () {
            var app = this.getTopAppWindow()._pageapp;
            return app;
        },

        /**
        *显示加载中效果
        */
        utilShowLoading: function () {

        },

        /**
        *隐藏加载中效果
        */
        utilHideLoading: function () {

        },

        /**注册全局配置*/
        registerGlobalConfig: function () {

        }
    });
    //全局简写
    window.getTopAppWindow = M139.PageApplication.getTopAppWindow;
    /*
    window.$App = new M139.PageApplication({
        window:window
    });
    */
})(jQuery, Backbone, M139);
﻿; (function (jQuery, Backbone, _, M139) {

    /**
     * 此类主要用于启动彩云版日历一些公共变量和通讯录相关的信息。
     * web版直接无视即可
    **/
    var superClass = M139.PageApplication;
    var _class = "M2012.Calendar.CaiyunMainApp";
    M139.namespace(_class, superClass.extend({
        name: _class,
        //默认的资源路径
        _defResource: "http://images.139cm.com",

        defaults: {
            name: _class
        },

        initialize: function (options) {
            superClass.prototype.initialize.apply(this, arguments);
            //  this.initData();
        },

        initData: function () {
            var self = this;
            // 赋值sid方便调用。
            window.sid = $T.Html.encode($Url.queryString('sid'));
            self.initConfigData();
        },

        initConfigData: function () {
            var self = this;
            this.initContactData();

            var loadCount = 0;
            //this.loadAttrs1(function (o) {//加载user:getInitData
            //    loadCount++;
            //    checkComplete(o);
            //    //等待getInitData成功之后才加载文件夹

            //});

            var attrsAll = {};
            function checkComplete(o) {
                self.loadLevel++;
                self.isUserAttrsLoad = true;
                self.trigger("userAttrsLoad", self.getConfig("UserAttrsAll"));
                //  self.checkUserDataComplete();
            }

            this.getMainData();

            if (window.MessageInfo) {
                this.registerConfig("MessageInfo", MessageInfo);
            }

            $App.on("userAttrChange", function (args) {
                var _original_callback = args && args.callback;
                args = $.extend(args, {
                    "callback": function () { //重新加载所有的用户数据
                        $App.getView("top").renderAccountList(self.getConfig("UserData")); //重新生成顶部导航

                        if (_original_callback) {
                            _original_callback();
                        }
                    }
                });

                self.reloadUserAttrs(args);
            });

        },

        /**
         * 初始化通讯录联系人信息
        **/
        initContactData: function (userNumber) {
            var self = this;
            var contacts = M2012.Contacts.getModel();
            this.registerModel("contacts", contacts);
            contacts.loadMainData({
                //testUrl:"/m2012/js/test/html/contactsData.js",//用测试数据
                //userNumber: $User.getUid()
            }, function (data) {
                self.registerConfig("ContactData", data);
                self.trigger("contactLoad", data);
            });

            contacts.on("update", function (options) {
                self.trigger("contactUpdate", options);
            });

            var vm = new M2012.MatrixVM();
            vm.start();
        },

        /**
         * 初始化个人信息
        **/
        initUserMainData: function (ud, callback) {
            var self = this;
            if (ud) {
                if (ud.UID == "8613632599010") { //测试桩代码
                    ud.UID = "8680000000000";
                }
                self.registerConfig("UserData", ud);
                self.trigger("userDataLoad", ud);
                if (callback) { callback(ud) }
            }
        },

        /**
         * 初始化通讯录联系人信息
        **/
        getMainData: function (callback) {
            var self = this;

            if (!$App.getConfig('UserData')) { //第一次
                self.initMainInfoData(callback);
            } else { //下一次
                M139.RichMail.API.call("user:getMainData", null, function (response) {
                    if (response.responseData && response.responseData.code == "S_OK") {
                        var ud = response.responseData["var"];
                        self.initUserMainData(ud, callback);
                    } else {
                        self.logger.error("getMainData data error", "[user:getMainData]", response)
                    }
                });
            }
        },

        /**
         * 初始化定义数据
        **/
        initMainInfoData: function (callback) {
            var self = this;
            this.loadMWGetInfoSet(function (response) {

                if (response.responseData && response.responseData.code == "S_OK") {
                    var data = response.responseData["var"];

                    //邮箱体检
                    if (data.healthyHistory) {
                        self.registerConfig("healthyHistory", data.healthyHistory);
                    } else {
                        self.logger.error("healthyHistory data error", "[info:getInfoSet]", response);
                    }

                    //用户的大量个人信息
                    if (data.userMainData) {
                        self.initUserMainData(data.userMainData, callback);
                    } else {
                        self.logger.error("userMainData data error", "[info:getInfoSet]", response);
                    }

                    //套餐信息
                    if (data.mealInfo) {
                        self.registerConfig("mealInfo", data.mealInfo);
                    } else {
                        self.logger.error("mealInfo data error", "[info:getInfoSet]", response);
                    }

                    //消息中心
                    if (data.infoCenter) {
                        self.registerConfig("infoCenter", data.infoCenter);
                    } else {
                        self.logger.error("infoCenter data error", "[info:getInfoSet]", response);
                    }


                    //到达通知，邮箱伴侣，短信赠送条数已发条数
                    if (data.userMobileSetting) {
                        self.registerConfig("PersonalData", data.userMobileSetting);
                        self.trigger("personalDataLoad", data.userMobileSetting);
                    } else {
                        self.logger.error("userMobileSetting data error", "[info:getInfoSet]", response);
                    }


                    //好友生日
                    if (data.birthdayRemind) {
                        self.registerConfig("birthdayRemind", data.birthdayRemind);
                    } else {
                        self.logger.error("birthdayRemind data error", "[info:getInfoSet]", response);
                    }
                    self.loadLevel++;
                    self.isInfoSetLoad = true;
                    self.trigger("infoSetLoad", data);
                    //  self.checkUserDataComplete();


                } else {
                    self.logger.error("info:getInfoSet", "[info:getInfoSet]", response)
                }

            });
        },

        loadMWGetInfoSet: function (callback) {
            M139.RichMail.API.call("info:getInfoSet", null, callback);
        },

        reloadUserAttrs: function (args) {
            var self = this;
            var loaded = 0;
            function loadComplate() {
                loaded++;
                if (loaded == 2) {
                    $App.trigger("userAttrsLoad", self.getConfig("UserAttrsAll"));
                    $App.trigger("userDataLoad", self.getConfig("UserData"));
                    if (args && $.isFunction(args.callback)) {
                        args.callback();
                    }
                }
            }
            //this.loadAttrs1(loadComplate, function (userattrs) {
            //    if (args && typeof (args.trueName) != "undefined") { //后台接口取不到最新的truename，直接改本地变量
            //        userattrs.trueName = args.trueName;
            //    }
            //});
            this.getMainData(loadComplate);
        },

        getResourcePath: function () {
            try {
                return top.domainList.global.rmResourcePath;
            } catch (ex) {
                try {
                    return top.rmResourcePath;
                } catch (ex1) {

                }
            }
            return this._defResource + "/m2012";
        },

        /**
        *获取邮件域名:139.com,rd139com,hmg1.rd139.com
        */
        getMailDomain: function () {
            return SiteConfig.mailDomain || "139.com";
        },

        /**
        * 使用本域邮件域名来组合成一个帐号
        * @param {String} account 邮件帐号，无邮件域
        */
        getAccountWithLocalDomain: function (account) {
            return account + "@" + $App.getMailDomain();
        },

        /**
        * 使用本域邮件域名来组合成一个帐号
        * @param {String} account 邮件帐号（完整，带邮件域）
        */
        isLocalDomainAccount: function (fullaccount) {
            return $Email.getDomain(fullaccount) === $App.getMailDomain();
        },

        //得到指定的标签页对象
        getTabByName: function (key) {
            return null;
        },
        getSid: function () {
            return window.sid;
        }

    }));



    (function () {
        /**
         * 异步加载js脚本
         * 此方法用来替换掉公共脚本程序代码中utilCreateScriptTag方法
         * 因为utilCreateScriptTag方法异步加载js，里面可能会出现top，需要替换掉
        **/
        top.M139.core.utilCreateScriptTag = function (args, onload) {
            args = args || {};
            //不从资源服务器中取js，因为跨域
            if (args.src.indexOf("http://") > -1) {
                args.src = args.src.replace(top.getDomain("resource"), "");
            }
            args.isResolve = true;
            top.loadScriptAsync(args, onload);
        }

        /**
         * 解决内嵌版本AJAX请求代理页面脚本跨域的问题
         * 由于代理页面引用了top.jQuery，导致跨域，所以此处需导向另一个代理页
        **/
        try {
            var partId = [1, 12];
            var pn = /smsrebuild\d/;
            for (var i = 0; i < partId.length; i++) {
                var config = top.M139.HttpRouter["hostConfig_" + partId[i]];
                if (!config)
                    continue;

                for (var key in config)
                    if (pn.test(config[key].host))
                        config[key].proxy = "/proxy1.htm";
            }
        } catch (e) { }

    })();

    /**
     *  弹出日历共享窗口
    **/
    top.$Evocation = {
        /*
        params:{
            type:1,                    
            to: 5,                      //是哪种类型的收件人    lastest | clostest | birthdayWeek | me | specified
            email: "13923797879@139.com",                  //收件人地址
            subject: "运营给您发来的邮件",
            content: "运营发来的邮件内容邮件内容邮件内容邮件内容邮件内容邮件内容邮件内容"
        },
        */
        create: function (params) {
            if (top.SiteConfig.evocation) {
                if (typeof params == "string") {
                    var params = params || "";
                    params = params.split('&');
                    var option = {}
                    for (var i = 0; i < params.length; i++) {
                        option[params[i].split('=')[0]] = params[i].split('=')[1]
                    }
                } else if (typeof params == "object") {
                    var option = params;
                }
                if (!top.EvocationPopWindow) {
                    top.M139.core.utilCreateScriptTag({
                        src: "/m2012/js/packs/evocation.pack.js"
                    }, function () {
                        top.EvocationPopWindow = new top.Evocation.Main.View(option);
                    });
                    return;
                }
                top.EvocationPopWindow = new top.Evocation.Main.View(option);
            }
        },

        changeSkin: function (skinName) {
            top.M139.core.utilCreateScriptTag({
                src: "/m2012/js/packs/m2012.changeskin.pack.js"
            }, function () {
                setTimeout(function () {
                    top.$App.trigger('EvochangeSkin', { skinName: skinName });
                }, 500)
            });

        },

       /**
        *  弹出订阅日历活动详情
        *  @param {Number} options.labelId //日历ID
        *  @param {Boolean} options.isOffical //是否是官方（后台）发布日历
        *  @param {Function} options.subscribe //订阅成功后的处理函数
        *  @param {Function} options.unsubscribe //订阅失败后的处理函数
       **/
        openSubsCalendar: function (options) {
            if (_.isUndefined(M2012.Calendar) || _.isUndefined(M2012.Calendar.View) ||
                _.isUndefined(M2012.Calendar.View.CalendarDetail)) {
                top.M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/calendar/cal_pop_subscribedetail.pack.js", charset: "utf-8" }, function () {
                    new M2012.Calendar.View.CalendarDetail(options);
                });
                return;
            }
            new M2012.Calendar.View.CalendarDetail(options);
        },

        openAndSubject: function (columnId) {
            columnId = columnId + '';
            top.$App.show('googSubscription');
            top.$App.show('mpostOnlineService', null, {
                key: columnId,
                inputData: {
                    columnId: columnId
                }
            });
            var postUrl = top.getDomain('image') + 'subscribe/inner/bis/subscribe?sid=' + top.sid;
            var postOption = '{comeFrom:503,columnId:' + columnId + '}';
            top.M139.RichMail.API.call(postUrl, postOption);
        }
    }

})(jQuery, Backbone, _, M139);

