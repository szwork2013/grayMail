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