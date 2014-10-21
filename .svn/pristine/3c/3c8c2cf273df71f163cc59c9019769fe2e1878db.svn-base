;//合并文件的头部
﻿/**
 * @fileOverview 定义M139基础框架的文件.
 */

(function (jQuery, Backbone) {
    /**
       *@namespace 
       @inner
       *顶级命名空间
    */
    window.M139 = {};

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
                debugger
                if (/\.js($|\?)/.test(jsFile)) {
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
                var objScript = document.getElementById(scriptId);
                //是否移出脚本DOM(非IE9时处理)
                var isRemoveScriptDom = !document.all && true || false,
                browserVersion = ["msie 9.0", "chrome", "firefox"],
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
                    dataScript.id = scriptId;
                    if (charset) {
                        dataScript.charset = charset;
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
            return new RegExp("^8613[4-9][0-9]{8}$|^8615[012789][0-9]{8}$|^8618[2378][0-9]{8}$|^8614[7][0-9]{8}$");
        },
        /***
        *获得匹配移动手机号的正则(可能来自全局配置)
        *@returns {RegExp}
        **/
        getMobileRegex: function () {
            return new RegExp("^8613[0-9]{9}$|^8615[012356789][0-9]{8}$|^8618[02356789][0-9]{8}$|^8614[7][0-9]{8}$");
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
            //RFC 2822
            return new RegExp("^[a-z0-9\.!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$", "i");
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
            var r1 = /^(?:"[^"]*"\s?|[^<>;,，；"]*|'[^']*')<([^<>\s]+)>$/;
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
            email = $.trim(email);
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
            url = url || location.search;
            url = url.split(/&|\?/);
            var result = null;
            for (var i = 0; i < url.length; i++) {
                var keyValue = url[i];
                var part = keyValue.split("=");
                if (part[0] == key) {
                    result = part[1];
                    break;
                }
            }
            if (result) {
                try {
                    result = decodeURIComponent(result);
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
                        value = decodeURIComponent(value);
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
        */
        makeUrl: function (url, queryObj) {
            //if(url.replace("://","").indexOf("/") == -1)url += "/";
            if (url.indexOf("?") == -1) url += "?";
            if (!/\?$/.test(url)) url += "&";
            return url + this.urlEncodeObj(queryObj);
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
            return mapURL(baseUrl, relativeUrl);
            function mapURL(baseURL, href) {
                if (/^https?:/i.test(href)) { return href };
                var p1 = baseURL.replace(/^https?:\/\/|\?.*$E|\/$E/g, "").split("/");
                if (p1.length > 1 && /\w+\.\w+$E/.test(p1[p1.length - 1])) { p1.pop() }
                if (href.charAt(0) == "/") { return "http://" + p1[0] + href };
                if (!/^\.\.\//.test(href)) { return "http://" + p1.join("/") + "/" + href };
                var p2 = href.split("/");
                for (var i = 0; i < p2.length; i++) {
                    if (p2[i] == ".." && p1.length > 1) p1.pop();
                    else break;
                };
                p2.splice(0, i);
                return "http://" + p1.join("/") + "/" + p2.join("/").replace(/\.\.\//g, "");
            }
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
                    ax.loadXML(xml);
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
                        result.push("<" + elem + ">" + current + "</" + elem + ">\n");
                    } else if(_.isArray(current)){
                        for(var i=0;i<current.length;i++){
                            result.push("<" + elem + ">");
                            result.push(obj2xmlInner(current[i]));
                            result.push("</" + elem + ">\n");
                        }
                    } else if (typeof (current) == "object") { //数组或object
                        result.push("<" + elem + ">");
                        result.push(obj2xmlInner(current));
                        result.push("</" + elem + ">\n");

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
                                    if (!_.isArray(oldItem)) {
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
            var maxUnit = options.maxUnit || "G";
            if (unit != maxUnit && fileSize > 1024) {
                unit = "K";
                fileSize = fileSize / 1024;
                if (unit != maxUnit && fileSize > 1024) {
                    unit = "M";
                    fileSize = fileSize / 1024;
                    if (unit != maxUnit && fileSize > 1024) {
                        unit = "G";
                        fileSize = fileSize / 1024;
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
        /***
        *格式化字符串，提供数组和object两种方式
        *@example
        *$T.Utils.format("hello,{name}",{name:"kitty"})
        *$T.Utils.format("hello,{0}",["kitty"])
        *@returns {String}
        */
        format: function (str, arr) {
            var reg;
            if (_.isArray(arr)) {
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
        getXmlDoc : function(xml) {
		    if (document.all) {
		        var ax = this.createIEXMLObject();
		        ax.loadXML(xml);
		        return ax;
		    }
		    var parser = new DOMParser();
		    return parser.parseFromString(xml, "text/xml");
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
		 * 安装截屏控件是否成功
		 * <pre>示例：<br>
		 * <br>Utils.isScreenControlSetup(ture,true);
		 * </pre>
		 * @param {Boolean} showTip 可选参数，是否显示提示消息。
		 * @param {Boolean} cacheResult 是否使用父级窗口控件。
		 * @return{true|false}
		 */
		isScreenControlSetup : function(showTip, cacheResult, isShowDialog) {
		    if (isShowDialog) return showDialog();
		    if (top.isScreenControlSetup != undefined && cacheResult) {
		        return top.isScreenControlSetup;
		    }
		    //if (!$B.is.ie) {
		        //if (showTip) alert("截屏功能仅能在IE浏览器下使用");
		        //return false;
		    //}
		    var setup = false;
		    try {
		        if (window.ActiveXObject) {
		            var obj = new ActiveXObject("ScreenSnapshotCtrl.ScreenSnapshot.1");
		            if (obj) setup = true;
		        } else if (navigator.mimeTypes) {
		            var mimetype = navigator.mimeTypes["application/x-richinfo-mailtoolautoupdate"];
		            if (mimetype && mimetype.enabledPlugin) {
		                setup = true;
		            }
		        }
		    } catch (e) {
		
		    }
		    if (!setup && showTip) {
		        //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		        showDialog();
		    } else if (setup && showTip && top.SiteConfig.screenControlVersion && document.all) {
		        var version = obj.GetVersion();
		        if (version < top.SiteConfig.screenControlVersion || (location.host.indexOf("10086") >= 0 && version == 16777477)) {
		            setup = false;
		            //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		            showDialog();
		        }
		    }
		    // todo
		    function showDialog() {
		    	// todo top.ucDomain = upload_module.model.ucDomain;
		        var exeFileUrl = top.ucDomain + "/ControlUpdate/mail139_tool_setup.exe";
		        var htmlCode = "<p style='padding:10px 0 30px 10px;font-weight:bold;'>使用截屏功能必须安装139邮箱控件,是否安装?</p>";
		        //htmlCode = top.$T.format(htmlCode, [exeFileUrl]);
		        
		        // todo
		        //FF.show(htmlCode, "系统提示");
		        //top.$("#aInstallOnline").focus();
		        
		        $Msg.showHTML(htmlCode,
		        	function(){
		        		$T.Utils.openControlDownload();
		        	},
		        	function(){
		        		window.open(exeFileUrl);
		        	},
		        	function(){
		        	},
		        	{
						dialogTitle:'系统提示',
				        buttons:['在线安装','手动下载','取消']
				    });
		    }
		    
		    delete obj;
		    top.isScreenControlSetup = setup;
		    return setup;
		},
		/**
		 * 打开使用控件下载的页面
		 * <pre>示例：<br>
		 * <br>Utils.openControlDownload(true);
		 * </pre>
		 * @param {Boolean} removeUploadproxy 可选参数，使用后是否移动窗口
		 */
		openControlDownload : function(removeUploadproxy) {
			// todo top.ucDomain = upload_module.model.ucDomain;
		    var win = window.open(top.ucDomain + "/LargeAttachments/html/control139.htm");
		    setTimeout(function() { win.focus(); }, 0);
		    //top.addBehavior("文件快递-客户端下载");
		    if (removeUploadproxy) {
		        removeUploadproxyWindow();
		    }
		},
		removeUploadproxyWindow : function(){
		    try{
		       // top.addBehavior("文件快递-客户端下载");
		        top.$("#uploadproxy").attr("src", "about:blank");
		        top.$("#uploadproxy").remove();
		    }catch(e){}
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
        *@param {Date} options.expries 如果不设置，则默认为会话cookie
        *@returns {void}
        */
        set: function (options) {
            var name = options.name;
            var value = options.value;
            var path = options.path || "/";
            var domain = options.domain;
            var expries = options.expries;
            var str = name + "=" + escape(value) + "; ";
            str += "path=" + path + "; ";
            if (domain) str += "domain=" + domain + "; ";
            if (expries) str += "expires=" + expires.toGMTString() + "; ";
            document.cookie = str;
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
$TextUtils = M139.Text.Utils;
$Url = M139.Text.Url;

$T.format = M139.Text.Utils.format;
/**@inner*/
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};
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


})(jQuery);
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
            var xhr = this.xhr = this.utilCreateXHR();
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
                if (xhr.readyState == 4 && xhr.status != 0) {//abort()后xhr.status为0
                    clearTimeout(timer);
                    if (xhr.status == 304 || (xhr.status >= 200 && xhr.status < 300)) {
                        This.onResponse({
                            responseText: xhr.responseText,
                            status: xhr.status,
                            getHeaders: function () {
                                return This.utilGetHttpHeaders(xhr);
                            }
                        });
                    } else {
                        This.onError({
                            status: xhr.status,
                            responseText: xhr.responseText
                        });
                    }
                }
            }
            xhr.open(options.method || "get", options.url, true);

            var data = options.data;

            //如果到了这里data仍为object类型，则自动转化为urlencoded
            if (typeof data == "object") {
                data = [];
                for (var p in options.data) {
                    data.push(p + "=" + encodeURIComponent(options.data));
                }
                data = data.join("&");
                if (!options.headers) options.headers = {};
                if (!options.headers["Content-Type"]) {
                    options.headers["Content-Type"] = "application/x-www-form-urlencoded";
                }
            }

            this.utilSetHttpHeaders(options.headers, xhr);
            xhr.send(data);
            return this;
        },
        abort: function () {
            this.xhr.bort();
            this.onAbort();
            return this;
        },
        /**@static*/
        utilCreateXHR: function () {
            //return new XMLHttpRequest();

            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }else {
                var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
                for (var n = 0; n < MSXML.length; n++) {
                    try {
                        return new ActiveXObject(MSXML[n]);
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
        },
        /**
            *@inner
        */
        onError: function (e) {
            this.logger.error(["responseOnError", e.status, e.responseText]);
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
        }
    });
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
        *获得服务器当前时间,从httpheader里读取时间，再保持时间差(暂未实现)
        */
        getServerTime: function () {
            return new Date();
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
            if (!date) date = new Date();
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
		}
    }

    //兼容老版本接口
    Date.prototype.format = function(template){
        return M139.Date.format(template,this);
    }

    //定义缩写
    $Date = M139.Date;

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
            var position = $(elem).position();
            if (position.left >= bounds.left && position.top >= bounds.top
                && position.left + $(elem).width() <= bounds.right && position.top + $(elem).height() <= bounds.bottom) {
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
        *@param {HTMLElement} textbox 获得焦点的文本框
        *@param {Number} pointerAt 光标的位置 0:最前,1:选中所有文本,2:最后,默认为2
        */
        selectTextBox: function (textbox, pointerAt) {

        },

        /**
        *图片预加载
        *@param {Array} images 图片地址列表
        */
        preloadImages: function (images) {

        },
        //碰撞检测
        hitTest: function (o, l) {
        
            function getOffset(o, isPoint) {
                var w = isPoint ? 1 : o.offsetWidth; //是1个像素的点
                var h = isPoint ? 1 : o.offsetHeight;
                for (var r = { l: o.offsetLeft, t: o.offsetTop, r: w, b: h };
                    o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
                return r.r += r.l, r.b += r.t, r;
            }
            
            for (var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
            b = getOffset(l[--i], true), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
            && (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
            return j ? !!r.length : r;
            
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
            if (options.handleElement) {
                var handleObj = $(o).find(options.handleElement)[0] || $(options.handleElement);//支持绑定多个热区元素
            }
            o.orignX = 0;
            o.orignY = 0;
            var min_x = 0, min_y = 0,
            max_x = $(document.body).width() - $(o).width(),
            max_y = $(document.body).height() - $(o).height();
            var manager = o;
            var offset = [];
            
            if (handleObj) {
                $(handleObj).mousedown(function (e) { drag_mouseDown(e) });//支持绑定多个热区元素
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
                if (o.setCapture) {	//在窗口以外也能响应鼠标事件
                    o.setCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
                }

                var postion = $(o).position();
                if (postion.left == 0) {
                    offset = [0, 0];
                } else {
                    offset = [x - postion.left, y - postion.top];
                }

                //window.status=x+","+y;
                if (options.onDragStart) {
                    options.onDragStart({ x: x, y: y ,target:e.target});
                }
                $(document).bind("mousemove", drag_mouseMove).bind("mouseup", drag_mouseUp);
                M139.Event.stopEvent(e); //阻止事件泡冒
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

                $(document).unbind("mousemove", drag_mouseMove).unbind("mouseup", drag_mouseUp);

            }

            function drag_mouseMove(e) {
                if (options.bounds && !$D.inBounds(o, options.bounds)) { //边界
                    //return;
                }
                var newX, newY;
                if (window.event) {
                    newX = event.clientX + document.body.scrollLeft;
                    newY = event.clientY + document.body.scrollTop;
                } else {
                    newX = e.pageX;
                    newY = e.pageY;
                }
                var _x = newX - offset[0];
                var _y = newY - offset[1];
                if (_x < 0) {
                    _x = 0;
                } else if (_x > max_x) {
                    _x = max_x;
                }
                if (_y < 0) {
                    _y = 0;
                } else if (_y > max_y) {
                    _y = max_y;
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
            var action = options.action || "click";
            var showTime = new Date;
            if (action == "click") {
                if ($(options.element).attr("bindAutoHide") != "1") {//防止重复绑定
                    M139.Dom.unBindAutoHide(options);
                    $(options.element).attr("bindAutoHide", "1");
                    setTimeout(function () {
                        options.element.autoHideHandler = M139.Event.GlobalEvent.on("click", function (data) {
                            if (options.stopEvent) {
                                var target = data.event.target;
                                if (M139.Dom.containElement(options.element, target)) {
                                    return;
                                }
                            }
                            M139.Dom.unBindAutoHide(options);
                            if (new Date <= showTime) {
                                return;
                            }
                            if (_.isFunction(options.callback)) {
                                options.callback();
                            }
                        });
                    }, 0);
                }
            }
        },
        /**取消绑定点击空白自动消失
        *@param {Object} options 参数集合
        *@param {String} options.action 执行什么行为自动关闭菜单，可以是click|mouseout(注意这里是全局的)，默认是click
        *@param {HTMLElement} options.element 菜单元素节点
        */
        unBindAutoHide: function (options) {
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
            if("left" in elem){ //是坐标点
                pos=elem;
            }else{ //是dom元素
                pos = $(elem).offset();
            }
	    
	    var w=$(window).width();
        var h=$(window).height();
        var center={left:(w/2),top:(h/2)};//党中央的坐标
    
        if(pos.left<center.left && pos.top<center.top){
            return 2;//"UpLeft"左上，第二象限
        }else if(pos.left>center.left && pos.top<center.top){
            return 1;//"UpRight"右上，第一象限
        }else if(pos.left<center.left && pos.top>center.top){
            return 3;//"LeftDown"左下，第三象限
        }else if(pos.left>center.left && pos.top>center.top){
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
            var direction = options.direction || map[this.getQuadrant(targetElement)]["upDown"];
            dockToDirection(direction);
            return direction;//因为要根据定位改变样式，所以外面要知道方位（比如箭头位置）
            function dockToDirection(direction) {
                var jTarget = $(targetElement);
                var jDock = $(dockElement)
                var offset = jTarget.offset();
                var margin = options.margin || 0;//空隙
                var left = offset.left;
                var top = offset.top;
                var offset = {
                    "up": offset.top - jDock.height() - margin,
                    "down": offset.top + jTarget.height() + margin,
                    "left": offset.left - jDock.width() - margin,
                    "right": offset.left + jDock.width() + margin
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
                $(dockElement).css({
                    position : "absolute",
                    left: left + "px",
                    top: top + "px"
                });
            }

            return direction;
        }
    };
    window.$D = M139.Dom;
})(jQuery, M139);
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
            COMMA:188
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
            }).bind("keydown", function (e) {
                This.triggerEvent("mousemove", { window: win, event: e });
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
                while (win.parent) {
                    if (win.$GlobalEvent) {
                        item = win.$GlobalEvent;
                    }
                    if (win == win.top) break;
                    win = win.parent;
                }
            } catch (e) { }
            return item;
        },

        /**
         *重写了Backbone.Model的on方法，增加try{}catch(e){}
         *@param {String} eventName 监听事件名，现在支持click，mousemove，keydown
         *@param {Function} handler 处理回调，这里内部加了异常捕获，不会抛出异常（防止其它回调被中断）
         */
        on: function (eventName, handler) {
            var topObj = this.getTopManager();
            if(this !== topObj){
                return topObj.on.apply(topObj,arguments);
            }

            var This = this;
            var newHandler = function () {
                try {
                    handler.apply(this, arguments);
                } catch (e) {
                    //出错一次就会移除
                    //This.off(eventName, arguments.callee);
                }
            };
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
                    options.data = changeData.exchangeData(options.data);
                }
                //修改http头
                if (changeData.exchangeHeader) {
                    options.headers = changeData.exchangeHeader(options.headers || {});
                }
            }
            //请求父类的方法
            M139.HttpClient.prototype.request.apply(this, arguments);
            return this;
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
                if (info.responseData == null) {
                    //记录异常日志
                    this.logger.error(["exchangeerror", responseDataType, info.responseText]);
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
            M139.HttpClient.prototype.onResponse.apply(this, arguments);
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
        exchangeData: function (data) {
            return $T.Xml.obj2xml(data);
        },
        exchangeHeader: function (headers) {
            headers["Content-Type"] = "application/xml";
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
            headers["Content-Type"] = "application/xml";
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
})(M139);
﻿M139.HttpRouter = {
    /**
	 * 服务器列表，服务器的路径规则，通过addServer
	 */
    serverList: {
        "appsvr": { domain: "http://app.mail.10086rd.cn", path: "/s?func={api}&sid={sid}" },
        "webapp": { domain: "http://app.mail.10086rd.cn", path: "/RmWeb/mail?func={api}&sid={sid}" },
        "setting": { domain: "http://app.mail.10086rd.cn", path: "/setting/s?func={api}&sid={sid}" },
        "addr": { domain: "http://app.mail.10086rd.cn", path: "/addrsvr/{api}?sid={sid}&formattype=json" },
        "weather": { domain: "http://app.mail.10086rd.cn", path: "/mw/weather/weather?func={api}&sid={sid}" },
        "positioncontent": { domain: "http://app.mail.10086rd.cn", path: "/mw/mw/getUnifiedPositionContent?sid={sid}" },
        "mms": { domain: "http://app.mail.10086rd.cn", path: "/sm/mms/mms?func={api}&sid={sid}" },
        "sms": { domain: "http://app.mail.10086rd.cn", path: "/sm/sms/sms?func={api}&sid={sid}" },
        "search": { domain: "http://app.mail.10086rd.cn", path: "/bmail/s?func={api}&sid={sid}" },
        "card": { domain: "http://app.mail.10086rd.cn", path: "/mw/card/cardsvr?func={api}?sid={sid}" }

    },
    /**
     * 接口列表，通过addRouter配置
     */
    apiList: {
        "mbox:getAllFolders": "appsvr"
    },
    addServer: function (key, data) {
        this.serverList[key] = data;
    },
    addRouter: function (server, list) {
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
    getUrl: function (api) {
        var domainKey = this.apiList[api];
        var domain = this.serverList[domainKey].domain;
        var url = domain + this.serverList[domainKey].path;
        return $T.format(url, { sid: $T.Url.queryString("sid"), api: api });
    }
};
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
        /**判断iframe是否可以访问*/
        isAccessAble: function (htmlFrameElemet) {
            var result = false;
            try {
                var b = htmlFrameElemet.contentWindow.document.body;
                result = true;
            } catch (e) {

            }
            return result;
        },
        domReady:function(htmlFrameElemet,callback){
            M139.Timing.waitForReady(function(){
                return htmlFrameElemet.contentWindow.document.body;
            },callback);
        }
    });
    
    $Iframe = M139.Iframe;
})(jQuery, Backbone, _, M139);
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
            this.log("DEBUG", msg);
        },
        /**
        *记录info级别日志
        */
        info: function (msg) {
            this.log("INFO", msg);
        },
        /**
        *记录error级别日志，此级别以上日志上报到服务端
        */
        error: function (msg) {
            this.log("ERROR", msg);
        },
        /**
        *记录fatal级别日志，出现此类日志业务无法正常使用
        */
        fatal: function (msg) {
            this.log("FATAL", msg);
        },
        /**
        *常规的调用log
        */
        log: function (level, msg) {
            if (window.console) {
                console.log("[" + this.get("name") + "][" + level + "]" + msg);
            }
        },
        /**
        *得到异常提示语，在throw的时候用，如: throw this.logger.getThrow("出错了");
        *@example
        throw this.logger.getThrow("出错了");
        */
        getThrow: function (error) {
            return this.get("name") + ":" + error;
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
        getScriptErrorLogger: function () {
            if (!this.scriptErrorLogger) {
                this.scriptErrorLogger = new M139.Logger({ name: "ScriptError" });
            }
            return this.scriptErrorLogger;
        }
    });

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
            this.config = new M139.ConfigManager();

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

        },

        /**捕获客户端异常并上报日志，默认加载文件的时候就执行*/
        utilCatchScriptError: function (win) {
            win.onerror = window_onerror;
            function window_onerror(msg, fileName, lineNumber) {
                if (typeof msg != "string") return;
                var stack = [];

                var caller = arguments.callee.caller;
                var reg_getFunName = /function (\w*\([^(]*\))/;
                while (caller) {
                    var funCode = caller.toString();
                    var match = funCode.match(reg_getFunName);
                    stack.push((match && match[1]) || funCode);
                    caller = caller.caller;
                }
                var log = "ScriptError:files=" + fileName + ",lines=" + lineNumber + ",msg=" + msg;
                //M139.Logger.getScriptErrorLogger().error(log);
            }
        }
    });
    //默认捕获异常
    M139.PageApplication.utilCatchScriptError(window);
    //全局简写
    window.getTopAppWindow = M139.PageApplication.getTopAppWindow;
    /*
    window.$App = new M139.PageApplication({
        window:window
    });
    */
})(jQuery, Backbone, M139);
/**
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
    this.router.addRouter("appsvr", [
        "mbox:getAllFolders",
    	"mbox:listMessages",
    	//"mbox:searchMessages",
    	"global:sequential",
    	"mbox:moveMessages",
    	"mbox:deleteMessages",
        "mbox:deleteFolders",
    	"mbox:updateMessagesStatus",
    	"mbox:updateMessagesLabel",
        "mbox:updateMessagesAll",
    	"mbox:setFolderPass",
        "mbox:updateFolders",
    	"user:getAttrs",
    	"user:setAttrs",
    	"mbox:setSessionMode",
    	"user:getWhiteBlackList",
    	"user:setWhiteBlackList",
    	"user:getSignatures",
    	"user:signatures",
        "user:setFilter_New",
        "user:getFilter_New",
    	"user:filterHistoryMail",
    	"attach:listAttachments",
        "user:statMessages"
        ]);

    this.router.addRouter("webapp", [
            "mbox:readMessage",
            "mbox:readSessionMessage",
    		"mbox:replyMessage",
    		"mbox:forwardMessage",
    		"mbox:searchMessages",
    		"mbox:sendMDN&comefrom=5&categroyId=103000000",
            "mbox:mailFile",
            "mbox:mailClean",
            "user:setPOPAccount",
            "user:getPOPAccounts",
            "user:syncPOPAccount",
            "mbox:mailMemo",
            "mbox:getDeliverStatus",
            "mbox:compose&comefrom=5&categroyId=103000000",
            "mbox:getComposeId",
            "upload:deleteTasks",
            "attach:refresh",
            "mbox:forwardMessages",
            "mbox:restoreDraft",
            "mbox:editMessage"
    ]);

    //todo add mw httpclient

    this.router.addRouter("setting", [
        "user:getMainData", "user:getExDataSync", "user:setUserConfigInfo", "user:getInfoCenter", "user:getMedals",
        "user:getPersonal", "user:setMyApp", "user:sendPasswordAction", "user:updatePasswordAction", "user:checkAliasAction", "user:updateAliasAction",
        "user:getLoginNotify", "user:setLoginNotify", "mailUpdate:getMailUpdateInfo", "mailUpdate:setMailUpdateInfo",
        "mailPatter:setMailPatterInfo", "mailPatter:getMailPatterInfo", "user:setAddMeRule", "user:bindFeixinAction",
        "meal:getMealInfo", "meal:setMealInfo", "user:setLoginNotify",
        "user:mailToMe"
    ]);
    

    //todo add addr httpclient
    this.router.addRouter("addr", [
        "GetUserAddrJsonData","QueryUserInfo","ModUserInfo"
    ]);
    
    this.router.addRouter('weather',[
        "weather:getDefaultWeather", "weather:getArea", "weather:getWeather",
        "weather:setWeather"
    ]);
    
    this.router.addRouter('positioncontent',[
        "positioncontent:ad"
    ]);
    
    this.router.addRouter('card',[
        "card:birthdayRemind"
    ]);
    
    this.router.addRouter('mms',[
        "mms:mmsInitData"
    ]);
    
    this.router.addRouter('sms',[
        "sms:getSmsMainData"
    ]);
    this.router.addRouter('ServiceAPI', [
        "RMSecretFolder"
    ]);
    
    this.router.addRouter('search',[
        "mbox:searchMessages"
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
    M139.ExchangeHttpClient.prototype.request.apply(this, arguments);
    return this;
},
/**@inner*/
onResponse: function (info) {
    var This = this;
    M139.ExchangeHttpClient.prototype.onResponse.apply(this, arguments);
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
    this.call("user:getFilter_New", {}, function (e) {
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
call: function (api, options, callback) {
    //var url = "/s?func=" + api + "&sid=" + $T.Url.queryString("sid") + "&rnd="+Math.random();

    var client = new M139.RichMail.RichMailHttpClient({});
    var url = client.router.getUrl(api);
    //注意处理异常
    client.request({
        url: url,
        method: "post",
        data: options
    }, function (e) {
        callback(e);
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
                    if(_.isFunction(query)){
                        var result = query();
                    }else{
                        var result = eval(query);
                    }
                    if(result){
                        self.clearInterval(intervalId);
                        if(callback){
                            callback();
                        }
                    }
                } catch (e) {
                    //对象尚不可用
                    if (result || tryTimes > 2) {
                        done = true;
                        if (intervalId) self.clearInterval(intervalId);
                        callback();
                    }
                }
            }
        },
        /**
        *网络诸塞的情况下，iframe可能无法正常加载，这个函数可以确保iframe正常加载，通常用在代理页、编辑器内容页等
        *@param {Object} options 参数集合
        *@param {HTMLElement} options.iframe 要监护的iframe元素
        *@param {Number} options.retryTimes 可选参数，加载失败重试次数，默认3次
        *@param {String} options.query 可选参数，判断iframe的对象是否加载，比如iframe里的jQuery对象，默认判断document.domain
        *@example
        $Timing.makeSureIframeReady({
            iframe:document.getElementById("myIframe"),
            query:"jQuery"//该iframe中的全局对象
        });
        */
        makeSureIframeReady: function (options) {
            var iframe = options.iframe;
            var retryTimes = options.retryTimes || 3;
            var interval = options.interval || 3000;
            var query = options.query;
            var check = function () {
                try {
                    if (query) {
                        if (iframe.contentWindow[query]) {
                            return true;
                        }
                    } else if (iframe.contentWindow.document.domain == document.domain) {
                        return true;
                    }
                } catch (e) {
                    return false;
                }
            }
            var timer = this.setInterval("M139.Timing.makeSureIframeReady", function () {
                retryTimes--;
                if (!check()) {
                    var url = iframe.src;
                    if (url.indexOf("?") == -1) {
                        url += "?";
                    }
                    url += "&" + Math.random();
                    iframe.src = url;
                } else {
                    clear()
                }
                if (retryTimes <= 0) {
                    clear()
                    /*
                    if (!check()) {
                    console.log("retry iframe but not sure ready:" + iframe.src);
                    }
                    */
                }
            }, interval);
            function clear() {
                M139.Timing.clearInterval(timer);
            }
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
        watchIframeHeight: function (iframe) {
            var timer = this.setInterval(
                "M139.Timing.watchIframeHeight",
                function () {
                    if ($D.isRemove(iframe)) {
                        clear();
                    } else {
                        if ($D.isHide(iframe)) return;
                        var frmDoc = iframe.contentWindow.document;
                        var frmBody = frmDoc.body;
                        if (frmBody.scrollHeight > iframe.offsetHeight) {
                            iframe.style.height = (frmBody.scrollHeight + 30).toString() + "px";
                            frmBody.style.overflowX = "hidden";
                            if ($.browser.msie && $.browser.version < 7.0) {
                                frmDoc.getElementsByTagName("html")[0].style.overflowX = "hidden";
                            }
                        }
                    }
                },
                1000
            );
            function clear() {
                M139.Timing.clearInterval(timer);
            }
        },
        /**监听文本框内容变化*/
        watchInputChange:function(input,callback,options){
            var oldValue = input.value;
            var timer = this.setInterval(
                "M139.Timing.watchInputChange",
                function () {
                    if(input.value !== oldValue){
                        oldValue = input.value;
                        if(_.isFunction(callback))callback.call(input);
                    }
                },
                1000);
            function clear() {
                M139.Timing.clearInterval(timer);
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
 * @fileOverview 定义获取用户vip信息的工具类
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**定义获取用户vip信息的工具类缩写为$VipTool
    *@namespace
    *@inner
    */
    M139.VipTool =
    /**@lends M139.VipTool */
    {
    /**
    *@namespace
    */
    levelEnum: {//用户等级
        free0010: "0010",//广东免费
        free0015: "0015",//非广东免费
        vip5: "0016",//5版
        vip20: "0017"//20版
    },
    /**
     * 当前用户等级
     * @return {string} 等级字符串
     */
    getUserLevel: function(){
    	var serviceItem = top.$User.getServiceItem();
		for(var e in this.levelEnum){
			if(serviceItem && $.trim(serviceItem).toLowerCase() == $.trim(this.levelEnum[e]).toLowerCase()){
				return serviceItem;
			}
		}
		//没有找到套餐定义，则返回免费用户
        return this.levelEnum.free0010;
	},
	/**
	 * 得到等级字符
	 * @param {string} type 标识如何组合vip字符
	 * @return {string} 等级字符串
	 */
    getVipStr : function(type){
        switch (type) {
            case "5,20":
                return this.levelEnum.vip5 + "," + this.levelEnum.vip20;
            case "20":
                return this.levelEnum.vip20;
            default:
                return this.levelEnum.free0010 + "," +this.levelEnum.free0015 + "," +this.levelEnum.vip5 + "," + this.levelEnum.vip20;
        }
    }
};
//定义缩写
$VipTool = M139.VipTool;
})(top.jQuery,top.M139);

