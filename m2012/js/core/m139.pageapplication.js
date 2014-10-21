﻿/**
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