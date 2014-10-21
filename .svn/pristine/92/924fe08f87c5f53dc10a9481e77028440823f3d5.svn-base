; (function (jQuery, Backbone, _, M139) {

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
