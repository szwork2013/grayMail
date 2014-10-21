
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Fetionim.View', superClass.extend({
        //高度
        height: 46,
        //是否注册了飞信区域行为点击事件，默认为false，注册后为true，保证只注册一次
        fetionClickEventAdded: false,
        //是否取得凭证
        isLogin: false,
        /**
        * 初始化飞信Bar
        */
        initialize: function () {
            this.initEvents();
            var self = this;
            $App.on("FetionBinded", function () {
                self.login();
            });
            $App.on("FetionUnBinded", function () {
                self.logout();
            });
        },
        render: function (call) {
            var self = this;

            var regex = getDomain("rebuildDomain").match(/\/+(.*)\//);
            if (regex.length > 0) {
                //站点标记
                this.LOGIN_SITE_TAG = regex[1] || null;
            }

            //获取凭证站点
            var LOGIN_SITE = top.domainList[$User.getPartid()]["webmail"] || null;

            //皮肤
            this.SKIN = "skin_4";
            //缓存SSOID
            this.SSO_SID = top.$App.getSid();
            //延迟加载web飞信延迟加载时间，先从UserData中取值，如果没有取到就给默认值15秒
            this.fetionDelayTime = 10000;
            //加载飞信Bar脚本主机，测试环境和现网不同
            this.fetionBarHost = LOGIN_SITE.indexOf("mail.10086.cn") > -1
                ? "http://webim.feixin.10086.cn/webimbar/" : "http://221.179.173.100/WebIMBardebug/";
            //加载飞信BarUrl
            //0:飞信站点url
            //1:第三方网页对应的域，这里使用的是LOGIN_SITE_TAG
            //2:第三方对应的tag，这里使用的是LOGIN_SITE_TAG
            //3:随机数，防止浏览器缓存
            this.getfetionBarUrl = "{0}initializev2.aspx?domain={1}&tag={2}&skin={3}&_={4}"
                .format(this.fetionBarHost, "gateway.139.com", this.LOGIN_SITE_TAG, this.SKIN, Math.random());

            //存放飞信绑定信息，邮.net站点
            window.fetion = {};
            //接入飞信Bar参数设置
            window.fxbar_settings = {
                //第三方对应的tag，不能为空
                tag: "139youxiang",
                //第三方网页对应的域
                domain: "mail.10086.cn",
                //编码
                charset: "utf-8",
                //飞信Bar宽度
                //width:300,
                height: this.height,
                //飞信Bar默认是否展开
                autoExpand: false,
                //飞信Bar定位
                pos: {
                    left: "0px",
                    bottom: "0px"
                },

                //飞信Bar样式，6是139邮箱的。
                layout: 8,
                skin: "skin_4",
                permission: 1,
                containerId: "fetionContainerId",
                /**
                * 获取凭证
                * @param {function} callback 获取凭证回调方法 
                */
                preLogin: function (callback) {
                    var api = 'user:getFetionLoginInfo';
                    var data = {};
                    var options = {
                        onrouter: function (router) {
                            router.addRouter('together', [api]);
                        },
                        error: function () {
                            if (callback) callback(500);
                        }
                    };

                    $RM.call(api, data, success, options);

                    function success(result) {
                        //200  一切正常，顺利获取到凭证以及凭证的域
                        //301  获取凭证失败
                        //302  未绑定飞信
                        //500  未知错误
                        var SUCCEED = 200, FAIL = 301, UNBIND = 302, ERROR = 500;

                        if (result && result.responseData) {
                            result = result.responseData;
                            if (result.code === "S_OK") {

                                result = result['var'];
                                if (Number(result.isBind) === 1 || Number(result.isBind) === -1) {
                                    var ssic = decodeURIComponent(result.credential);
                                    if (callback) {
                                        callback(ssic ? SUCCEED : FAIL, ssic, "gateway.139.com");
                                        self.isLogin = true; //得到凭证并登录成功，修改标记
                                        self.addEventForLogged(); //注册登录后的事件
                                    }
                                    return;
                                } else if (Number(result.isBind) === 0) {
                                    if (callback) {
                                        callback(UNBIND);
                                    }
                                    return;
                                }
                            }
                        }

                        if (callback) {
                            callback(ERROR);
                        }
                    }
                },

                /**
                * 绑定方法
                * @param {function} callback 绑定方法
                */
                bindFetion: function (callback) {
                    var api = 'user:bindFetion';
                    var data = {};
                    var options = {
                        onrouter: function (router) {
                            router.addRouter('together', [api]);
                        }
                    };

                    $RM.call(api, data, success, options);

                    function success(result) {
                        //200  一切正常，绑定成功
                        //404  用户未开通飞信
                        //500  绑定发生错误
                        var SUCCEED = 200, NONE = 404, ERROR = 500;
                        var OK = 0, NOTFOUND = 1, HASEXISTS = 2, flag;

                        if (!$.isFunction(callback)) {
                            return;
                        }

                        if (result && result.responseData) {
                            result = result.responseData;
                            if (result.code === "S_OK") {
                                result = result["var"];

                                flag = Number(result.bindFlag);
                                if (OK === flag) {
                                    callback(SUCCEED);
                                } else if (NOTFOUND === flag) {
                                    callback(NONE, "用户未开通飞信");
                                } else if (HASEXISTS === flag) {
                                    callback(SUCCEED);
                                } else {
                                    callback(ERROR, "帐号绑定失败");
                                }
                                return;
                            }
                        }

                        callback(ERROR, "帐号绑定失败");
                    }
                }
            };

            //延时3秒加载飞信
            window.setTimeout(function () {
                M139.core.utilCreateScriptTag({
                    id: "getfetionBar",
                    src: self.getfetionBarUrl,
                    charset: "utf-8"
                },
                 function () {
                     self.show();
                     $(".i_funtion").hide();
                 });
                var setFlashHide = setInterval(function () {
                    var div=$("#fetion_ajaxproxy");
                    var status = div.attr("status");
                    if (!status) {
                        div.hide().attr("status", 1);
                    } else {
                        clearInterval(setFlashHide);
                    }
                }, 1000);
            }, self.fetionDelayTime);

            //加载飞信Bar脚本
            if (call) { call() }
        },
        /**
        * 退出飞信
        */
        logout: function () {
            try {
                //调用退出飞信Bar方法
                top.fetion$.fxbar.logic.quit();
                //退出成功，修改标记
                this.isLogin = false;
            } catch (e) { }
        },
        login: function () {
            try {
                //调用退出飞信Bar方法
                top.fetion$.fxbar.logic.login();
                //退出成功，修改标记
                this.isLogin = true;
            } catch (e) { }
        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        /**
        * 增加事件，用于行为登录后上报统计
        */
        addEventForLogged: function () {
            //添加doument点击事件，使飞信面板隐藏
            $(document).click(function () {
                if (fetion$ && fetion$.mainWindow) {
                    fetion$.mainWindow.collapse();
                }
            });
        },
        initEvents: function () {
            //当前标签如果不是欢迎页，隐藏飞信，否则显示
            $App.on("showTab", function(e){
                var welcomeIframe = document.getElementById("welcome");
                var winWelcome = welcomeIframe.contentWindow;//欢迎页重载会导致window改变
                var fetionElemInTop = $("#fetionElemTop");

                try {
                    if (e.name == "googSubscription") {
                        top.addBehaviorExt({ actionId: 104808 });
                        console.log("上报云邮局日志");
                    }
                    if (e.name == "welcome") {
                        if (!winWelcome.$) return;//欢迎页重载时，不计算位置

                        var fetionElemInWelcome = winWelcome.$("#fetionElem");
                        //当欢迎页重载的时候，如果飞信还未出来，则不计算位置
                        if (fetionElemInWelcome.length == 0) return;

                        if ($.browser.msie) {//为ie设置滚动条
                            winWelcome.document.documentElement.scrollTop = 0;
                        } else {
                            winWelcome.document.body.scrollTop = 0;
                        }

                        //重新计算飞信的位置，防止上次计算不准确
                        var fetionElemOffsetInWelcome = fetionElemInWelcome.show().offset();
                        fetionElemInWelcome.hide();
                        var fetionElemOffsetInWelcomeTopValue = fetionElemOffsetInWelcome.top;
                        var fetionElemTopValueInTop = fetionElemOffsetInWelcomeTopValue + 28;

                        fetionElemInTop.css({
                            left: fetionElemOffsetInWelcome.left - 6,
                            top: fetionElemTopValueInTop -31
                        });

                        fetionElemInTop.show();
                    } else {
                        fetionElemInTop.hide();
                    }
                } catch (ex) {
                    //
                }
            });
        },
        show: function () {
            var self = this;
            $("#fetionContainerId").mouseover(function (e) {
                e.preventDefault();
                self.bindAutoHide({
                    action: "click",
                    element: $(this)[0],
                    stopEvent: true,
                    callback: function () {
                        $("#fetionContainerId").attr("bindautohide", 0);
                        fetion$.fxbar.ui.toggle(0)
                    }
                });
            });
            return superClass.prototype.show.apply(this, arguments);
        }
    })
    );

})(jQuery, _, M139);

