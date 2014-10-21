(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.AD.View', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
            this.model = options.model;
            var self = this;
            this.model.on("change:welcomeTab", function () {
                self.initTabState();
            });
        },
        initEvents: function () {
          
        },
        initTabState:function(){
            var tabs = $("#ul_recommand>li");
            for (var i = 0; i < this.model.get("tabState").length; i++) {
                var tab = this.model.get("tabState")[i];
                if (!this.model.getTabVisible(tab.name)) {
                    if (tabs.eq(i).hasClass("current")) { //当前页卡被隐藏时自动切换到第1个页卡
                        tabs.eq(0).trigger("click");
                    }
                    tabs.eq(i).hide();
                } else {
                    tabs.eq(i).show();
                }
            }
        },
        provinceName:function() {
            return top.SiteConfig.billAllowProvince[top.$User.getProvCode()];
        },
        renderTab: function () {
            var self = this;
            //邮箱推荐区tab
            this.model.createTabs({
                tabs: "#ul_recommand>li",
                currentClass: "current",
                contents: ".operationsInfo",
                change: function (content, index) {
                    var name = self.model.get("tabState")[index].name;
                    top.BH('welcometab_'+name);
                    if (self.model.get("stateLoad")[name]) return;
                    if (name == "userCenter") {
                        var userContenterIframe = '<iframe id="userCenterIframe" scrolling="no" frameborder="no" width="100%" height="222" src="{url}"></iframe>';
                        $(content).html(M139.Text.Utils.format(userContenterIframe, {url: self.model.get("userCenterTabUrl") + top.sid}));
                    }else if(name == "mmarket"){
                        var mmarketIframe = '<iframe id="mmarketIframe" scrolling="no" frameborder="no" width="100%" height="220" src="{url}"></iframe>';
                        $(content).html(M139.Text.Utils.format(mmarketIframe, {url: self.model.get("mmarketTabUrl")}));
                    } else if (name == "subscribe" || name == "uecLab" || name == "business") {
                        $(content).html(self.model.getAdContent(name));
                    } else if (name == "billCharge") {
                        var billChargeIframe = '<iframe id="billChargeIframe" scrolling="no" frameborder="no" width="100%" height="220" src="{url}"></iframe>';
                        url = self.model.get("billChargeTabUrl");
                        url = url.replace(/province/, self.provinceName() +"index") + top.sid; //针对不同省份取不同地址
                        $(content).html(M139.Text.Utils.format(billChargeIframe, { url: url }));
                    }
                    self.model.get("stateLoad")[name] = true;

                    // 渲染在统一位置静态资源文件中缺少的广告位
                    self.lackPositionCodeRender(content, name);
                }
            });
        },

        adRender: {
            //邮箱推荐
            recommand: function (provinceName) {
                var self = this;
                /*
                这块后台已组装
                var recommandContent = self.model.getAdContent("recommand");
                if (!recommandContent) return;
                $("#J_auto").prepend(recommandContent);
                */
                if (provinceName) {
                    $('#li_recommand_bill').show();
                }
                // 轮显图
                self.model.createTabs({
                    tabs:"#p_scrollTab>a",
                    currentClass:"current",
                    contents:"#ul_scrollImg>li",
                    autoScroll:true,
                    change:function (content, index) {
                        content.attr("style", "display:list-item");
                    }
                });
            },
            //活动中心
            activityPic: function(){
                var self = this;
                $("#activityCenterInfo").prepend(self.model.getAdContent("activityPic"));
            },
            activityText: function(){
                var self = this;
                $("#activityCenterInfo").append(self.model.getAdContent("activityText"));
            },
            //底部链接
            bottomLink: function(){
                var self = this;
                $("#bottomLink").html(self.model.getAdContent("bottomLink"));
            },
            //动态信息（读书）
            messageAd: function(){
                var self = this;
                var adText = self.model.getAdContent("messageAd");
                var vhtml = top.$T.Utils.format('<li>{info}</li>', {info:adText});
                $("#lefttext>ul").append(vhtml);
            },
            gotoAction:function(){
                var self = this;
                var content = self.model.getAdContent("gotoAction");
                var defaultContent = '<a id="gotoAction" href="javascript:top.$App.show(\'myTask\');" class="c_457fbd integration">精彩不停：任务赚积分&gt;&gt;</a>'
                content = content?content:defaultContent;
                $("#gotoAction").replaceWith(content);    
            },
            indexTopAd:function(){
                var self = this;
                top.$("#indexTopAd").html(self.model.getAdContent("indexTopAd"));                
            },
            mailApp:function(){
                var self = this;
                var content = self.model.getAdContent("mailApp");
                if(content){
                    top.$App.set('cloudMailAppContent',content);
                    top.$App.trigger('showCloudMailApp',{content:content});
                }
            }
        },

        render : function(){
            var self = this;
            this.renderTab();

            //self.initTabState();
            var welcome_tab = self.takeBillCharge(top.$App.getCustomAttrs("welcome_tab"));
            self.model.set("welcomeTab", welcome_tab);
		        
            //加载统一位置数据
            this.model.loadAdContent(function (result) {
                // 广告渲染
                self.adRender.model = self.model;
                self.adRender.recommand(self.provinceName());
                self.adRender.activityPic();
                self.adRender.activityText();
                self.adRender.bottomLink();
                self.adRender.messageAd();
                self.adRender.gotoAction();
                self.adRender.indexTopAd();
                self.adRender.mailApp();

                // 渲染在统一位置静态资源文件中缺少的广告位
                self.lackPositionCodeRender();

                window.top.WELCOME_LOADED = true;
            });

            // 加载原有的统一位置广告（内容只剩下tips）
            top.SiteConfig["unifiedPositionStatic"] && this.model.loadNewAdContent();

            this.initEvents();
        },
        //广东用户要默认添加邮箱营业厅，最多选4项，要去掉多余的
        takeBillCharge: function (welcome_tab) {
            if (top.SiteConfig.billAllowProvince[top.$User.getProvCode()] && welcome_tab.indexOf('billCharge') == -1) {
                if (welcome_tab) {
                    welcome_tab += 'billCharge,'
                    var deleteItm = ["uecLab", "business"],
                        i = 0;
                    while (welcome_tab.split(',').length > 5 && i<10) {
                        welcome_tab = welcome_tab.replace(deleteItm[i] + ",", "");
                        i++;
                    }
                    return welcome_tab
                } else {
                    return "recommand,userCenter,uecLab,billCharge,"
                }
            } else {
                return welcome_tab;
            }
        },

        // 如果在统一位置静态资源文件中缺少某些广告位，则需要从默认广告位中获取
        lackPositionCodeRender: function (wrap, name) {
            var self = this;

            if (self.model.get("defaultAdContent")) return;

            var lackPositionCode = self.model.get("lackPositionCode");
            if (lackPositionCode.length > 0) {
                self.model.getDefaultDataForUnifiedPositionContent(function(){
                    // 按需加载的广告模块
                    if (wrap) {
                        $(wrap).html(self.model.getAdContent(name));
                        return;
                    }

                    for (var i = 0, len = lackPositionCode.length; i < len; i++) {
                        self.adRender[lackPositionCode[i]]();
                    }
                });
            }
        }
    }));
})(jQuery, _, M139);

