var FrameView = Backbone.View.extend({
    initialize: function (options) {
        this.parentView = options.parent;
        this.model = new FrameModel();
        this.param = options.param;//页面参数（如果有的话）
        this.url = options.url;//如果传递url直接打开，可以不需要配置
        this.html = options.html;//如果传递html直接可以不通过iframe创建标签页
        this.title = options.title;//如果传递url直接打开，可以不需要配置
        this.inputData = options.inputData;
        var self = this;
        $(window).resize(function () {
            self.onResize();
        });

    },
    render: function (isRendered) {//isRendered:表示是否显示过，用于强制刷新
        var self = this;
        var pm = this.parentView.model; //父view的model，即模块管理类
        var currentModule = pm.get("currentModule");//当前模块
        var config = this.model.getLink(pm);//获取链接配置

        var errorTip = ['<div class="bodyerror ErrorTips" style="display:none">',
 		    '<img src="../images/global/smile.png" width="73" height="72">',
 		    '<p>没加载出来，再试一次吧</p>',
 		    '<a class="btnTb" href="javascript:"><span class="p_relative">重新加载</span></a>',
 	    '</div><div class="gtips NoCompleteTips" style="display:none">',
            '<span class="ml_5">由于网络原因，当前页面未完全加载，是否<a class="Retry" style="text-decoration: underline;" href="javascript:">重新加载</a>？</span>',
            '<a href="javascript:" class="i_u_close Close"></a>',
        '</div>'].join("");


        if (config) { //有配置
            //this.el=pm.getModule(currentModule).element;//显示容器
            this.parentView.setTitle(pm.getModule(currentModule).title || config.title); //设置标题 

            if ($(this.el).html() == "" || !isRendered || config.refresh) {   //没有创建过，或需要强制刷新时才重新加载
                var prefix = config.url.indexOf("?") >= 0 ? "&" : "?";//是问号还是&符号
                var url = config.url ;
                if (!config.clearSid) { //有不需要sid的情况
                    url = url + prefix + "sid=" + sid;
                }
                if (config.categroyId) {
                    url += '&categroyId=' + config.categroyId;
                }
                if (config.site) {
                    url = getDomain(config.site) + "/" + url;
                }
                if (this.param) {
                    if (typeof (this.param) == "string") {
                        if (this.param.indexOf("urlReplace") >= 0) {
                            url = this.param.match("urlReplace=(.+)")[1];
                            var m_domain = config.url.match(/http:\/\/.+?\//);
                            if (m_domain) {
                                url = m_domain + url;
                            }
                        } else {
                            url = url + this.param
                        }
                    } else {
                        url = M139.Text.Url.makeUrl(url, this.param);
                    }
                }

                if (this.inputData) {
                    url = $App.inputDataToUrl(url, this.inputData);
                }

                var id = currentModule;
                if (config.tab) {
                    id = config.tab;
                }
                $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" id=\"" + id + "\" src=\"" + url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
            }
        } else if (this.url) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html("<iframe scrolling=\"auto\" class=\"main-iframe\" name=\"ifbg\" frameborder=\"no\" width=\"100%\" src=\"" + this.url + "\" allowtransparency=\"true\"></iframe>" + errorTip);
        } else if (this.html) {
            this.parentView.setTitle(this.title); //设置标题
            $(this.el).html(this.html);
        }
        this.onResize();

        if (!isRendered) {
            setTimeout(function () {
                self.watchIframeStatus(pm.getModule(currentModule));
            }, 0);
        }
    },
    /**
     * 获取工具栏，此函数由tabpageView自动调用。
     */
    onResize: function () {

        if (this.el) {
            try {
                var iframe = this.el.childNodes[0];
                var currentModule = $App.getCurrentTab && $App.getCurrentTab() && $App.getCurrentTab().name;
                // 切换到其他模块会触发欢迎页iframe高度的改变
                // 欢迎页iframe高度变化会影响$App.getBodyHeight()取值
                if (iframe.id == 'welcome' && currentModule != 'welcome') {
                    return;
                }
                $iframe = $(iframe);
                var height = $(document.body).height() - $("#div_main").offset().top;
                $iframe.height(height - 4);//减去多余4像素
                //console.log(iframe.id)
                if ($.browser.msie && $.browser.version < 8) {
                    // 针对ie67的优化
                    
                    var idAttr = iframe.id; // add by tkh 与网盘一样，云邮局的页签不需要设置宽度
                    if ((idAttr && idAttr.indexOf('mpostOnlineService') !== -1) ||
                        idAttr === 'googSubscription' ||
                        idAttr == "diskDev" ||
                        idAttr == "calendar" || idAttr == "createCalendar" || idAttr == "addcalendar" || idAttr.toLowerCase().indexOf("calendar_") > -1 ||
                        idAttr == "addr" ||
                        idAttr === 'jpdy_topic_1'||
                        idAttr == "billCharge") {
                        return; 
                    }
                    
                    if ($App.isNewWinCompose()) {
                        // 不操作
                    } else {
                        $iframe.width($(document.body).width() - 214);
                    }
                }

            } catch (e) { }
        }
    },

    getIframe: function(){
        return this.el.firstChild || null;
    },

    /**
     *设置标题栏左侧图标状态
     *@param status {string} loading|error|hide
     */
    setTabStatus: function (status) {
        //console.log("setTabStatus:" + status);
        var iframe = this.getIframe();
        if (iframe.id) {
            $App.getView("tabpage").tab.setStateIcon(iframe.id, status);
        }
        
        this.model.set("tabStatus", status);
    },

    getTabStatus: function(){
        return this.model.get("tabStatus");
    },

    /**
     *根据iframe的状态显示如loading图标
     */
    watchIframeStatus: function (module) {
        if (!SiteConfig.labelIframeLoadingRelease) {
            return;
        }
        if ($B.is.ie && $B.getVersion() < 9) {
            return;
        }
        var self = this;
        var iframe = this.getIframe();
        if (!iframe || iframe.id == "welcome") return;
        setTimeout(function () {
            checkFinish("settimeout");//防止类似ie11超快加载，来不及捕获onload
        }, 100);
        setTimeout(function () {
            if (self.getTabStatus()=="error") {
                module.isRendered = false;
            }
        }, 10000);
        var win = iframe.contentWindow;
        iframe.onload = function () {//bind load会触发2次
            checkFinish("onload");
        };
        if (isLocalPage()) {
            $Timing.waitForReady(function () {
                return win.document.domain === document.domain
            }, function () {
                $(win.document).ready(checkFinish);
            });
        }
        function isLocalPage() {
            //要确保非本域iframe 不检查同域（如飞信，微博等）
            var url = iframe.src;
            if (/^\/|http:\/\/(appmail\d+|rm|app|smsrebuild\d+|subscribe\d+|html5)\.mail\./.test(url) && url.indexOf('/m2012') > -1) {
                if (url.indexOf("inner/reader/index") >= 0 || url.indexOf("voiceMail") >= 0) {//云邮局的页面没加domain，特殊处理下
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }
        function checkFinish(type) {
            var notCompleteTimer;
            if (isLocalPage()) {
                //定制的页面要检查对象可用而不是脚本有可访问性
                if ($Iframe.isAccessAble(iframe)) {
                    //html页中的健康检查代码
                    if (win.LoadStatusCheck) {
                        notCompleteTimer = setTimeout(showNotCompleteTip, 3000);
                        $Timing.waitForReady(function () {
                            return win.LoadStatusCheck.isComplete() && self.checkIframeHealth(iframe);
                        }, function () {
                            clearTimeout(notCompleteTimer);
                            showOK();
                        });
                    } else {
                        if (self.checkIframeHealth(iframe)) {
                            showOK();
                        } else {
                            setTimeout(function () {
                                if (self.checkIframeHealth(iframe)) {
                                    showOK();
                                } else {
                                    showNotCompleteTip();
                                }
                            }, 3000);
                        }
                    }
                } else {
                    if (type == "onload") {
                        showError();
                    }
                }
            } else {
                //非同域名无法检测页面完成性
                showOK();
            }
        }
        function showOK() {
            self.setTabStatus("hide");
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
            iframe.style.visibility = "";
        }
        function showError() {
            self.setTabStatus("error");
            $(self.el).find("div.ErrorTips").show().find("a").click(function () {
                $(this).unbind("click");
                reload();
            });
            iframe.style.visibility = "hidden";
            $App.trigger("httperror", {
                loadResourceError: true
            });
        }
        function showNotCompleteTip(){
            self.setTabStatus("error");
            var container = $(self.el).find("div.NoCompleteTips").show();
            container.find("a.Retry").click(function () {
                $(this).unbind("click");
                reload();
            });
            container.find("a.Close").click(function () {
                container.hide();
            });
            iframe.style.visibility = "";
            $App.trigger("httperror", {
                loadResourceError: true
            });
            if (self.iframeErrorLog) {
                M139.Logger.sendClientLog(self.iframeErrorLog);
            }
        }
        function reload() {
            iframe.src = iframe.src;
            $(self.el).find("div.ErrorTips,div.NoCompleteTips").hide();
        }
    },
    /**
     *检测iframe里的js和css加载正常
     */
    checkIframeHealth: function (iframe) {
        var self = this;
        var result = true;
        //高级浏览器才支持script onload,在index.html中loadScript的时候加的
        if (($B.is.ie && $B.getVersion() >= 9) || !!window.FormData) {
            (function () {
                var scripts = iframe.contentWindow.document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; i++) {
                    var js = scripts[i];
                    if (js.getAttribute("jsonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "JSLoadError", url: js.src };
                        return;
                    }
                }
                //windows下的safari，以及低版本的chrome和firefox不支持 css文件的onload事件，会产生误判 
                if (($B.is.chrome && $B.getVersion() < 25) || ($B.is.safari) || ($B.is.firefox && $B.getVersion() < 25)) {
                    return;
                }
                var links = iframe.contentWindow.document.getElementsByTagName("link");
                for (var i = 0; i < links.length; i++) {
                    var css = links[i];
                    if (css.parentNode && css.parentNode.tagName !== "HEAD") continue;
                    if (css.getAttribute("cssonload") === "0") {
                        result = false;
                        self.iframeErrorLog = { level: "ERROR", name: "CSSLoadError", url: css.href };
                        return;
                    }
                }
            })();
        }
        return result;
    }
});