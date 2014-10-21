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


﻿/**
* @fileOverview 动态消息展现
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /**
    * @namespace 
    * 欢迎页运营广告
    */

    M139.namespace('M2012.Welcome.DynamicInfo.View', superClass.extend({

        /**
        *@lends M2012.Welcome.DynamicInfo.View.prototype
        */
        el: '#lefttext',

        initialize: function (options) {
            this.model = options.model;
            this.dyinfoModel = options.model;

            this.birthModel = new M2012.Welcome.FriendBirthday.Model();
            this.scrollView = new top.M2012.UI.Scroll();
            window.$dyinfoView=this;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        adId: 1304,//广告id
        icons: { 10: 'i_wenj', 11: 'i_fshare', 13: 'i_maybe', 'mail': 'i_maildx', 'ad': "i_tjrn" },
        types: {
            11: {
                type: "diskDev", trimReg: "您的好友：<span>(.*)<\\/span>给您共享了<span>(\\d)<\\/span>",
                link: function () {
                    top.Links.show('diskDev', '&goid=12');
                }
            },
            13: {
                type: 'addrWhoAddMe', trimReg: "您可能认识：<span>(.+)</span>",
                link: function () {
                    top.appView.show('addrWhoAddMe');
                }
            }
        },
        birthUpdateTemplate: ['消息:&nbsp;<i class="i_dg"></i>',
                      '<span>&nbsp;您的好友&nbsp;@friend</span>',
                      '&nbsp;&nbsp;&nbsp;<a class="sendzf"  href="javascript:top.$App.dyinfoChanged = true;top.BH({actionId:102062, thingId:2,pageId:10011,actionType:20});top.Links.show(\'greetingcard\',\'&dyinfoBirthday=1\');">送祝福&gt;&gt;</a>'].join(""),
        
        birthTemplate: ['消息:&nbsp;<i class="i_dg"></i>',
                      '<span>@friends 等<b style="color:red;">@count</b>位好友即将过生日</span>',
                      '&nbsp;&nbsp;&nbsp;<a class="sendzf"  href="javascript:top.$App.dyinfoChanged = true;top.BH({actionId:102062, thingId:2,pageId:10011,actionType:20});top.Links.show(\'greetingcard\',\'&birthday=1\');">送祝福&gt;&gt;</a>'].join(""),
        vliHtml: '<li>{info}</li>',
        vContactUpdateHtml: "&nbsp;&nbsp;您有<b style='color:red;'>{count}</b>个联系人更新了资料&nbsp;&nbsp;&nbsp;<a href='javascript:{updateLink}'>立即更新>></a>",
        ulMsg: {},
        init: function () {
            this.isIE6 = $.browser.msie && $.browser.version == 6;
            this.isChrome = !!navigator.userAgent.toLowerCase().match(/(chrome)[ \/]([\w.]+)/);

        },
        render: function () {
            this.init();
            this.dyinfoModel.getDynamicData(this.model, this.showAllData);//获取动态消息
        },
        showAllData: function (birhUser, trimbirhUser) {
            if (trimbirhUser && trimbirhUser.length >= 0) {//处理生日的
                $dyinfoView.showBirth(birhUser, trimbirhUser);
            }
            $dyinfoView.showMailShareWhoAd();//处理其它的
        },
        /**
         * 
         */
        showMailShareWhoAd: function (isshow) {
            //邮件容量
            this.showMail();


            //联系人好友资料更新
            this.showContactUpdate();

            //共享文件
            this.showdynamicData(11);

            //可能认识的人
            this.showdynamicData(13);

            if (this.isEmpty(this.ulMsg)) {
                $("#testSmsnotify").show();
            } else {
                this.scrollView.render({ win: window, wrap: '#lefttext', lis: this.ulMsg, order: ["birth", "mail", "ContactUpdate", "11", "13", "ad"] });
            }
        },
        isEmpty: function (obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        /**
         *显示动态消息区消息 
         */
        showdynamicData: function (key) {
            var dyMsg = this.dyinfoModel.get("dyMsg");
            if (dyMsg && dyMsg[key]) {
                var icon = "消息:<i class=" + this.icons[key] + "></i>";
                var content = dyMsg[key].content;
                var totaluser = dyMsg[key].totaluser || 0;
                content = this.trimOverPart(totaluser, content, key);
                if (!content) return;
                content = content + "<a href='javascript:top.$App.dyinfoChanged = true;$dyinfoView.clickDyData(" + key + ");'>&nbsp;&nbsp;查看详情>></a>";
                var vhtml = top.$T.Utils.format(this.vliHtml, { info: icon + content, count: this.isIE6 ? 5 : 1 });//count解决ie7 9上显示不正确
                this.ulMsg[key] = vhtml;
            }
        },
        /**
         * birthuUsers []
         * birth []
         */
        showBirth: function (birthuUsers, birth) {
            if (birth.length == 0) {
                this.ulMsg['birth'] = '';
                return;
            }
            var vhtml = top.$T.Utils.format(this.vliHtml, { info: this.trimTemplate(birthuUsers, birth), count: 1 });
            this.ulMsg['birth'] = vhtml;
        },
        //去掉等字
        trimTemplate: function (lastBirthData, BirthData) {
            var template = this.birthUpdateTemplate;
            var showBirth = BirthData[0]
            for (var i = 1; i < BirthData.length; i++) {
                var dateOfShowBirth = showBirth.BirDay.slice(5); //去年年份
                var dateOfBirthData = BirthData[i].BirDay.slice(5); //去年年份
                if (dateOfBirthData < dateOfShowBirth) {
                    showBirth = BirthData[i];
                }
            }
            top.$App.set("dyInfoBirtherData", showBirth);
            var birther = showBirth.addrName;
            if (!birther) {
                birther = showBirth.AddrName;
            }
            var now = top.M139.Date.getServerTime();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (showBirth && showBirth.BirDay) {
                var birthDate = showBirth.BirDay;
                birthDate = birthDate.split('-');
            }
            //如果有元月过生日的，不用简单用月份相减了
            var nowYear = now.getFullYear();
            var future = new Date(nowYear, birthDate[1] - 1, birthDate[2]);
            if (future - now < 0) {
                nowYear++;
                future = new Date(nowYear, birthDate[1] - 1, birthDate[2]);
            }
            birther += this.getDateDif(now, future);

            template = template.replace(/@friend/, birther);
            return template;
        },
        getDateDif: function (now, future) { //过生日显示文字
            var dif = future - now;
            dif = dif / 1000 / 60 / 60 / 24;
            if (dif == 0) {
                return " 今天过生日"
            } else if (dif > 0) {
                return " 将在" + dif + "天后（" + (future.getMonth()+1) + "月" + future.getDate() +"日）过生日"
            }

        },
        /**
         *显示邮箱
         */
        showMail: function () {
            var info = this.mailSizeShow();
            var date = top.$Cookie.get('ckMail');
            if (date) {
                var now = new Date();
                var dif = this.DiffLong(date, now.format("yyyy-MM-dd"));
            } else {
                dif = 2;
            }
            if (info && info.isOverSize && dif >= 2) {//2 邮箱容量 
                var icon = "消息:<i class=" + this.icons['mail'] + "></i>";
                var content = icon + "您的邮箱容量即将达到上限：" + info.limitSize + "，<a href=\"javascript:top.BH({actionId:102062, thingId:3,pageId:10011,actionType:20});$dyinfoView.remember();top.Links.show('orderinfo');void(0);\">套餐升级</a>可增加邮箱容量";
                var vhtml = top.$T.Utils.format(this.vliHtml, { info: content, count: this.isChrome ? 0 : (this.isIE6 ? 4 : 2) });
                this.ulMsg["mail"] = vhtml;
            }
        },
        /**
         *邮件容量
         */
        mailSizeShow: function () {
            var info = { isOverSize: false };
            this.model.getMessageSize(function (obj) {
                var usedSize = obj.usedSize,
                    limitSize = obj.limitSize,
                      percent = 0,//使用的邮箱容量占总邮箱容量的百分比
                       realSize = 0;//邮箱实际容量,即1.2倍的limitMessageSize
                if (!(top.UserData.provCode == 1 || top.UserData.serviceItem == "0017")) {
                    realSize = limitSize / 1.2;
                    percent = Math.round(usedSize / realSize * 10000) / 100;//计算已经使用占总容量百分比
                    if (percent >= 80) {
                        info.isOverSize = true;
                        info.limitSize = top.M139.Text.Utils.getFileSizeText(realSize);
                    }
                }
            });
            return info;
        },
        /**
         *联系人更新
         */
        showContactUpdate: function () {
            var updateInfo = top.window.GetUserAddrDataResp.Welcome;
            if (updateInfo && updateInfo.length > 0) {
                top.dyinfoNeedUpdateLength = updateInfo[0].ucn;
            }
            var welcome, flag = false;
            if (top.dyinfoNeedUpdateLength > 0) {
                welcome = top.dyinfoNeedUpdateLength;
                var icon = "消息:<i class=" + this.icons['ad'] + "></i>";
                var content = icon + top.$T.Utils.format(this.vContactUpdateHtml, { count: welcome, updateLink: "$dyinfoView.clickContactUpdate();" });
                var vhtml = top.$T.Utils.format(this.vliHtml, { info: content, count: this.isIE6 ? 5 : this.isChrome ? 0 : 1 });
                this.ulMsg["ContactUpdate"] = vhtml;
            } else if (top.dyinfoNeedUpdateLength == 0) {
                this.ulMsg["ContactUpdate"] = '';
            }
            top.$App.dyinfoChanged1 = false;
            return flag;
        },
        /**
        *时间差
        */
        DiffLong: function (datestr1, datestr2) {
            var date1 = new Date(Date.parse(datestr1.replace(/-/g, "/")));
            var date2 = new Date(Date.parse(datestr2.replace(/-/g, "/")));
            var datetimeTemp;
            var isLater = true;
            if (date1.getTime() > date2.getTime()) {
                isLater = false;
                datetimeTemp = date1;
                date1 = date2;
                date2 = datetimeTemp;
            }
            difference = date2.getTime() - date1.getTime();
            thisdays = Math.floor(difference / (1000 * 60 * 60 * 24));
            difference = difference - thisdays * (1000 * 60 * 60 * 24);
            thishours = Math.floor(difference / (1000 * 60 * 60));
            var strRet = thisdays;
            return strRet;
        },/**
    *去掉操作的字符
	*/
        trimOverPart: function (totaluser, vhtml, key) {
            if (key == 13) {//可能认识的人
                var matchs = vhtml.match(this.types[key].trimReg);
                if (matchs && matchs.length > 1) {
                    vhtml = vhtml.replace(matchs[1], this.buildTrimStr(totaluser, matchs[1], 35, ",", key));
                    return vhtml;
                }

            } else if (key == 11) {//共享文件
                var matchs = vhtml.match(this.types[key].trimReg);
                var numstr;
                if (matchs && matchs.length == 3) {
                    var str = this.buildTrimStr(totaluser, matchs[1], 40, ",", key);
                    vhtml = vhtml.replace(matchs[1], str);
                    numstr = "<b style='color:red;'>" + matchs[2] + "</b>";

                    vhtml = vhtml.replace("<span>" + matchs[2] + "</span>", numstr);
                }
                return vhtml;
            }
            return "";
        },
        buildTrimStr: function (totaluser, str, len, sign, key) {
            var partName = "", names, allName, lastNames = [];
            //str = top.$T.Utils.htmlEncode(str);
            names = str.split(sign);
            totaluser = totaluser > names.length ? totaluser : names.length;
            for (var i = 0; i < names.length; i++) {
                lastNames.push(names[i]);
                if ($T.Utils.getBytes(lastNames.join(sign)) > len) {
                    lastNames.pop();
                }
            }
            allName = lastNames.join("、");
            var filtStr = str.replace(/"|'/g, "");
            var lenLast = lastNames.length, lenName = names.length;
            if (key == 11) {
                if (lenLast < lenName) {
                    allName = allName.replace("<span>", "<span style='margin:0px;'>");
                    if (lenLast == 0) {
                        allName = filtStr.substring(0, len) + "<b style='color:red;' title='" + filtStr.replace("<span>", "") + "'>" + names.length + "</b>位好友";
                    } else {
                        allName += "等<b style='color:red;' title='" + filtStr.replace("<span>", "") + "'>" + totaluser + "</b>位好友";
                    }
                }
            } else if (key == 13) {
                allName = allName.replace("<span>", "<span style='margin:0px;'>");
                if (totaluser > names.length) {
                    allName += "等<b style='color:red;' title='" + filtStr.replace("<span>", "") + "'>" + totaluser + "</b>位好友";
                } else {
                    allName += "<b style='color:red;' title='" + filtStr.replace("<span>", "") + "'>" + names.length + "</b>位好友";
                }

            }

            return allName;
        },
        clickDyData: function (key) {
            $dyinfoView.dyinfoModel.eraseDyData(key);
            $dyinfoView.ulMsg[key] = null;
            this.scrollView.resetScroll($dyinfoView.ulMsg);
            if ($dyinfoView.types[key]['link']) {
                $dyinfoView.types[key]['link']();
            }
        },
        /**
     *点击更新联系人
     */
        clickContactUpdate: function () {
            top.appView.show('updateContact');
            //添加跳转
            top.BH({ actionId: 103655 });
        },
        /**
         *记住点击邮箱
         */
        remember: function () {
            var date = new Date();
            var strDate = date.format("yyyy-MM-dd");
            $Cookie.set({ name: 'ckMail', value: strDate });
        }
    }));

})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.Main.View', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
            this.model = new M2012.Welcome.Model();
            //TODO
            //if (!top.$App.onUserDataComplete) {
            top.$App.onUserDataComplete = function (callback) {
                setTimeout(function () {
                    callback();
                },2000)
            }
            //}


            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
            this.bindWindowResize();
            this.bindBottomLink();
            this._BH();
            try{
                if (inlinedQueryUserInfoJSON.UserInfo[0] && inlinedQueryUserInfoJSON.UserInfo[0].b8) {
                    top.UserData.imgUrl = inlinedQueryUserInfoJSON.UserInfo[0].b8;

                }
            } catch (e) {
            }

            $('#volumeCapacity').hover(
                function(){
                    var pWidth = 164;
                    var vWidth = $('#volumeUsed').show().width();
                    var vleft = $('#volumeCapacity').position().left;
                    var differ = pWidth - vWidth;
                    if(differ>vleft){
                        $('#volumeUsed').css({
                            right:(differ-vleft+10)+'px'
                        });
                    }
                    var uLeft = $('#volumeUsed').position().left
                    $('#volumeUsed .tipsBottom').css({
                        'left':(vleft-uLeft + 5)+'px'
                    })
                },
                function(){$('#volumeUsed').hide()}
            );
        },

        _BH: function () {
            top.BH('welcome_load'); //欢迎页加载
            $('#otherUnRead a').click(function () {
                var fid = $(this).attr('fid');
                switch (fid) {
                    case "1":  //收件箱
                        top.BH('welcome_mailbox');
                    case "9":  //订阅邮件
                        top.BH('welcome_subscribe');
                }
            })

        },

        initSubView: function () {
            var self = this;
            this.userMainView = new M2012.Welcome.UserMain.View({ model: this.model });
            this.userMainView.render();
            
            top.M139.Timing.waitForReady("top.Contacts.data.map",function(){
                self.dynamicView = new M2012.Welcome.DynamicInfo.View({ model: self.model });
                self.dynamicView.render();
            });

            this.adView = new M2012.Welcome.AD.View({ model: this.model });
            this.adView.render();

            $("#btn_customTab").click(function () {
                new M2012.Welcome.CustomTab.View({model:self.model}).render();
            });

        },


        reloadProd: function () {
            this.dynamicView.dyinfoModel.getDynamicData(this.dynamicView.birthModel, this.dynamicView.showAllData);
        },

        render: function () {
            var self = this;

            this.initEvents();
            
            //top.$App.onUserDataComplete(function () {
            self.initSubView();
            //});


            this.userInfoRender();
            this.linkScore();
            this.telCharge();
            this.setVolume();
            this.msgBoxHot();
        },

        msgBoxHot:function(){
            var num = $('#unreadBox').find('var').text();
            var loginTime = top.M139.Text.Utils.getDateTimeFromCGUID(top.$Url.queryString('cguid'));
            var passtime = (new Date()) - loginTime;
            var lockNum = 0;
            $(top.$App.getFolders()).each(function(i,n){
                if(top.$App.getView("folder").model.isLock(n.fid)){
                    lockNum += top.$App.getFolderById(n.fid).stats.unreadMessageCount;
                }
            });
            num -=lockNum;
            if(passtime<10*1000 && num>0 ){
                top.$Evocation.msgBoxHot.show();
            }else{
                top.$Evocation.msgBoxHot.setStatus();
            }
        },

        setVolume:function(){
            var prov = top.$User.getProvCode();
            if(prov == 1){
                return;
            }
            var self = this;
            var mailCapacity = inlinedGetInfoSetJSON['var'].mailCapacity;
            var tSize = mailCapacity.totalSize * 1024;
            var uSize = mailCapacity.messageSize * 1024;
            if(mailCapacity.totalSize != 0){
                var percent = (100 * uSize / tSize).toFixed(2) + '%';
                var totalSize = self.getFileSizeText(tSize);
                var useSize = self.getFileSizeText(uSize);
                var text = '已使用(<b>'+useSize+'，'+percent+'</b>)';
                $('#volumeCapacity').text(totalSize);
                $('#volumeUsed').find('.tips-text').html(text);
            }            
        },

        getFileSizeText : function (fileSize, options) {
            var unit = "B";
            if (!options) {
                options = {};
            }
            if (options.byteChar) {
                unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
                if (options.maxUnit == "B")
                    options.maxUnit = unit;
            }
            var maxUnit = options.maxUnit || "G";
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

        //右上角查询话费 add by QZJ
        telCharge: function () {
            if (top.SiteConfig.closeTelCharge) { return;}
            var prv = top.$User.getProvCode();
            if(!top.SiteConfig.billAllowProvince[prv]){return ;}

            var self = this;
            var ul = $('#li_score').parent('ul');
            ul.children().eq(1).hide();
            var telCharge = ['<li class="">话费余额：',
                '<span class="callsInquiry">',
                    '<a id="chargeQuery" href="javascript:void(0);" class="btnNormal mr_10"><span>查询</span></a>',
                    '<span id="chargeFail" class="c_ff8157 hide" style="margin-right:5px">查询失败</span> ',
                    '<span id="chargeNum" class="mr_10 hide"><strong class="c_ff8157"></strong> 元</span>',
                    '<span id="chargeLoading" class="hide"><img src="../m2012/images/global/load.gif" width="16" height="16" style="vertical-align:middle; margin-right:5px"></span>',
                '</span>',
                '<a id="chargeDateil" href="javascript:;" class="c_457fbd">明细</a></li>'].join('');

            var telDOM = ul.append(telCharge).find('#telCharge');

            //余额查询
            $('#chargeQuery').click(function () {
                self._telChargeQuery();
            })

            self._telChargeQuery();


            //明细查询
            $('#chargeDateil').click(function () {
                top.BH('telChargequery');
                top.$App.show("googSubscription");
                top.$App.show("mpostOnlineService", null, {
                    title : '邮箱营业厅',
                    key : '38159',
                    inputData : {
                        urlParams : {
                            oct : 'main',
                            oac : 'index'   
                        },
                        key : '38159',
                        columnId : '38159',
                        columnName : '邮箱营业厅'
                    }
                });

                try{
                    top.M139.RichMail.API.call(top.getDomain('image') + "subscribe/inner/bis/subscribe?sid=" + top.sid, '{"comeFrom":503,"columnId":38159}'); //自动订阅
                } catch (e) {
                    console.log(e);
                }
            })
        },

        _telChargeQuery: function (callback) {
            $('#chargeLoading').removeClass('hide');
            $('#chargeQuery').addClass('hide');
            top.BH('telChargeHistory');
            var billCharge = top.$App.get('billCharge');
            if (billCharge && typeof billCharge.balance == 'string' && billCharge.balance!='null') {
                $('#chargeLoading').addClass('hide');
                $('#chargeNum').removeClass('hide').find('strong').text(billCharge.balance);
            } else {
                top.M139.RichMail.API.call("mailoffice:getTipsinfo", {}, function (result) {
                    $('#chargeLoading').addClass('hide'); 
                    var resp = result.responseData;
                    if (resp && resp.code === "S_OK" && typeof resp['var']['balance'] == 'string' && resp['var']['balance'] != 'null') {
                        setTimeout(function(){
                            top.$App.set({'billCharge': resp['var']});
                            top.$App.trigger({'billChargeLoad': resp['var']});
                            $('#chargeNum').removeClass('hide').find('strong').text(resp['var'].balance);
                        },0)
                    } else {
                        $('#chargeFail').removeClass('hide');
                        setTimeout(function () {
                            $('#chargeFail').addClass('hide');
                            $('#chargeQuery').removeClass('hide');
                        }, 2 * 1000);

                    }
                }, { method: "GET" });
            }
        },



        //右上角积分换大奖
        linkScore: function () {
            var dom = $('#scoreExchange');
            var url = 'http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=';
            var links = [
                { flag: '15&sid=' + top.sid, Class: 'i_make_money', name: '换好礼' },
                { flag: '16&sid=' + top.sid, Class: 'i_soff', name: '抽大奖' },
                { flag: '17&sid=' + top.sid, Class: 'i_present', name: '赢大礼' }];
            var item = links[parseInt(Math.random() * 100) % links.length];
            $('#scoreExchange')[0].href = url+item.flag;
        },

        //个人信息区tab
        userInfoRender: function(){
            var self = this;

            this.model.createTabs({
                tabs: "#ul_userinfo>li",
                currentClass: "current",
                contents: ".welcomeTabList",
                change: function (content, index) {
                    var name = self.model.get("userInfoTab")[index].name;
                    top.BH('wel_' + name);

                    if (name == "checkIn") {
                        if (self.model.get("stateLoad").checkIn) return;

                        var checkInIframe = '<iframe id="checkInIframe" scrolling="no" frameborder="no" width="100%" height="75" src="{url}"></iframe>';
                        $(content).html(M139.Text.Utils.format(checkInIframe, {url: self.model.get("checkInUrl") + top.sid}));
                        self.model.get("stateLoad").checkIn = true;
                    } else if (name == "weather") {
                        if (self.model.get("stateLoad").weather) return;

                        M139.core.utilCreateScriptTag({
                            id: "weatherWrap",
                            src: "/m2012/js/packs/welcome_weather.html.pack.js",
                            charset: "utf-8"
                        }, function(){
                            self.weatherView = new M2012.Welcome.Weather.View({model: self.model});
                            self.weatherView.render();
                        });
                        self.model.get("stateLoad").weather = true;
                    }
                }
            });

            var isFlipping = false;
            function flipAnimate(target, start, step) {
                isFlipping = true;
                var i = start;
                var count = 0;
                var timer = setInterval(function () {
                    if (count > 7) {
                        console.log("clearInterval:" + count);
                        isFlipping = false;
                        clearInterval(timer);
                        count = 0;
                    }
                    else {
                        target.className = "img_" + i;
                        i += step;
                    }
                    count++;
                }, 30);
              
            }

            var flipEl = $('<a href="javascript:top.addBehaviorExt({ actionId:8000 , thingId: 3264});top.$App.show(\'blueSky\')" id="imgBox" class="img_1"></a>');
            if (top.SiteConfig.showCornerPic) {
                $(".welcomeBox").append(flipEl);
            }
            flipEl.hover(function () {
                if (!isFlipping) {
                    console.log("over" + isFlipping);
                    flipAnimate(this, 0, 1);
                }
            }, function () {
                if (!isFlipping) {
                    console.log("out" + isFlipping);
                    flipAnimate(this, 8, -1);
                }
            });
            
        },
        
        bindWindowResize: function(){
            /////IE9以下浏览器当欢迎页窗口小于1000px时，侧边框隐藏
            //全部控制，不分浏览器了
            var self = this;
            if (true || $.browser.msie && $.browser.version < 9.0) {
                self.resizeEvent();
                $(window).bind("resize", function(){
                    self.resizeEvent();
                })
            }
        },
        
        resizeEvent: function () {
            var aside = $(".welcomeAside");
            var main = $(".welcomeMain");
            var list = $('.operations_title');
            var bodyWidth = $("body").width();

            if (bodyWidth > 830) {
                list.removeClass('operations_title1024');
                main.css({ "margin-right": "279px" })
                aside.show();
            } else if (bodyWidth > 770) {
                list.addClass('operations_title1024');
                aside.show();
                main.css({ "margin-right": "279px" })
            } else if (bodyWidth > 580) {
                list.removeClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "2px" });
            } else{
                list.addClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "20px" });
            }

            /*
            if (bodyWidth < 500) {
                list.addClass('operations_title1024');
                aside.hide();
                main.css({ "margin-right": "20px" });
            } else if (bodyWidth < 750) {
                list.addClass('operations_title1024');
                aside.show();
            } else {
                $('.operations_title').removeClass('operations_title1024');
                aside.show();
                main.css({ "margin-right": "279px" });
            }*/

        },

        bindBottomLink: function(){
            //跳去标准版1.0
            $("#btn_old").attr("href", "http://" + top.window.location.host
            + "/main.htm?func=global:execTemp&sid=" + top.$App.getSid()).click(function() {
                var MATRIX_10 = 10;
                top.M139.RichMail.API.call("user:setUserConfigInfo", {
                    configTag: "LoginVersion",
                    configValue: MATRIX_10,
                    type: "int"
                }, function (result) {});
            });

            //基础版
            var simpleStyleIndex="6";
            $("#btn_base").attr("href",getBaseUrl(simpleStyleIndex));

            function getBaseUrl(style) {
                //跳转url
                var url = "",
                //分区id
                    partId = "",
                //跳转基础版域名
                    loginDomain = "",
                //域
                    dm = document.domain;
                //rm只有基础版，不用判断

                loginDomain = top.domainList.global.mail || ''; //SiteConfig['loginDomain']||"";
                if (loginDomain) {
                    url = loginDomain + '/login/switchto.aspx?sid=' + top.$App.getSid() + '&v=3';
                }
                return url;
            }
        },
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);


﻿
(function (jQuery, _, M139) {

    M139.namespace("M2012.Welcome.Model", Backbone.Model.extend({

        defaults: {
            birthdayData: null,
            data: null,
            welcomeTab:"",//欢迎页推荐tab定制，改变时trigger刷新
            tabState:[ //邮箱推荐定义，数组顺序表示标签顺序
                {name: "recommand" },
                //{name: "subscribe"},
                {name: "userCenter"},
                {name: "uecLab"},
                {name: "business"},
                { name: "mmarket" },
                { name: "billCharge" }
            ],
            userInfoTab: [ //个人信息区tab
                {name: "userInfo"},
                //{name: "checkIn"},
                {name: "weather"}
            ],
            positionCode:{
                recommand       : "web_050",
                subscribe       : "web_051",
                uecLab          : "web_052",
                business        : "web_053",
                mmarket         : "web_054",
                activityPic     : "web_055",
                activityText    : "web_056",
                messageAd       : "web_057",
                bottomLink      : "web_060",
                gotoAction      : "web_074",
                indexTopAd      : "web_078",
                mailApp         : "web_088"
            },
            newPositionCode: {
                tips            : "web_061"
            },
            lackPositionCode: [], // 存储统一位置静态化文件中缺少的广告位
            stateLoad: {//描述各个选项卡内容加载状态，点击一次之后，再点击不再重复渲染dom
                subscribe   : false,
                userCenter  : false,
                uecLab      : false,
                business    : false,
                mmarket     : false,
                checkIn     : false,
                weather     : false
            },
            actionMoreUrl       : "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&sid=",//活动区
            userCenterTabUrl    : "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=8&sid=",//用户中心标签页地址
            billChargeTabUrl    :  top.SiteConfig.billChargeWelcomeUrl,
            mmarketTabUrl       : "http://mm.10086.cn/mm/139frame.html",//应用商城标签页地址
            //checkInUrl        : "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201306B1&flag=2&sid=",//签到地址
            checkInUrl          : "http://zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201306B1&flag=6&sid= ",//新签到地址
            isBirthdayLinkExist : false //生日提醒链接是否存在
        },
        logger: new top.M139.Logger({ name: "welcome.model" }),
        dynamicInfoTypes: {
            11: {
                type: "diskDev", trimReg: "</span>", link: function () {
                    top.Links.show('diskDev', '&goid=12');
                }
            },
            13: {
                type: 'addrWhoAddMe', trimReg: "您可能认识：<span>(.+)</span>", link: function () {
                    top.appView.show('addWhoAddMe');
                }
            }
        },
        initialize: function (options) {
            this.isIE6 = $.browser.msie && $.browser.version == 6;
            this.isChrome = !!navigator.userAgent.toLowerCase().match(/(chrome)[ \/]([\w.]+)/);
        },
        onUserAttrsLoad:function(callback){
            if (top.$App.isUserAttrsLoad) {
                callback();
            } else {
                top.$App.on("userAttrsLoad", callback);
            }
        },
        onInfoSetLoad: function (callback) {
            if (top.$App.isInfoSetLoad) {
                callback();
            } else {
                top.$App.on("infoSetLoad", callback);
            }
        },
        loadAttrs:function(callback){
            var self = this;
            top.M139.RichMail.API.call("user:getInitData", null, function (response) {
                if (response.responseData.code == "S_OK") {
                    var data = response.responseData["var"];
                    top.console.log(data.messageInfo.unreadMessageCount);
                    $C.messageInfo = data.messageInfo;
                    callback && callback();
                    //setTimeout(callback,1000);
                }
            });
        },
	
        messageInfo:null,
	
        getMessageInfo: function(){	   
            return  top.$User.getMessageInfo();
        },

        //邮箱已使用容量/总容量
        getMessageSize: function (callback) {
            var messageInfo = this.getMessageInfo() || {};
            var limitSize = messageInfo.limitMessageSize || "",
                usedSize = messageInfo.messageSize || "",
                scale = 1,
                partid = top.$User.getPartid() || "12";
            if (partid == "1" || partid == "12" || partid == "21") {
                scale = 1024;
            }
            callback && callback({
                limitSize: (!limitSize ? 0 : parseInt(limitSize)) * scale,//容错，为空字符串默认值0，否则转换成数值类型
                usedSize: (!usedSize ? 0 : parseInt(usedSize)) * scale
            });
        },

        //是否显示等级积分
        /*
        isShowLevel: function(callback){
            var level = "";
            var integral = top.$User.getUserIntegral();
            if(integral && integral.integralLevel){
                level = integral.integralLevel;
            }		
            callback && callback(level);		
        },
	    */
        /*动态信息专区model部分*/
        getDynamicData: function(birthModel,callback){
            var self = this;
            var options = {};

            if (top.$App.dyinfoChanged) { //更新可能认识的人，好友共享，暂存柜
                M139.RichMail.API.call("info:getInfoSet", null, function (response) {
                    if (response.responseData && response.responseData.code == "S_OK") {
                        var data = response.responseData["var"];
                        if (data.infoCenter) {
                            top.$App.registerConfig('infoCenter', data.infoCenter);
                            self.handDynamic(data.infoCenter, birthModel, callback);
                            top.$App.dyinfoChanged = false;
                        }
                    }
                });
            } else {
                this.onInfoSetLoad( function () {
                    var data = top.$App.getConfig('infoCenter');
                    console.log('infoCenter load');
                    self.handDynamic(data, birthModel, callback);
                });
            }
        },
        handDynamic:function(dyData,birthModel,callback){
            var _self = this;
            var dyMsg = this.buildDynamicData(dyData);
            _self.set('dyMsg', dyMsg);


            var data = window.inlineBirthContactsInfo && inlineBirthContactsInfo.BirthdayContactInfo || [];

            if (!top.$App.get('isGetContact')) {
                birthModel.composeUserName(data);
                data = birthModel.htmlEnCodeBirth(data);
                top.$App.set('isGetContact', true);
            }
            top.M139.Timing.waitForReady("top.window.GetUserAddrDataResp", function(){
	            if (data.length == 0) {//没有过生日的人，避免请求
	                callback([], []);
	                return;
	            };
	            birthModel.getCardRemind(function (carddata) {
	                var birhUser = birthModel.removeRemBirthMan(carddata.mobiles, data);
	                //top.$App.getModel("contacts").get("data").birthdayContacts = birhUser;
	                var trimbirhUser = birthModel.buildBirthUser(birhUser, $("#lefttext").width());
	                callback(trimbirhUser, birhUser);
	            });
            });
/*
            //top.M139.Timing.waitForReady('top.$App.getConfig("ContactData")&&top.Contacts.data.map', function () {
            top.$App.getModel("contacts").requireData(function (cdata) {
                setTimeout(function () { //延时等待Contacts.data.map组装耗时
                    var data = cdata.birthdayContacts || [];
                    if (!top.$App.get('isGetContact')) {
                        birthModel.composeUserName(data);
                        data = birthModel.htmlEnCodeBirth(data);
                        top.$App.set('isGetContact', true);
                    }
                    if (data.length == 0) {//没有过生日的人，避免请求
                        callback([], []);
                        return;
                    };
                    birthModel.getCardRemind(function (carddata) {
                        var birhUser = birthModel.removeRemBirthMan(carddata.mobiles, data);
                        top.$App.getModel("contacts").get("data").birthdayContacts = birhUser;
                        var trimbirhUser = birthModel.buildBirthUser(birhUser, $("#lefttext").width());
                        callback(trimbirhUser, birhUser);
                    });
                }, 500);
            });*/
        },
        getCardRemind:function(callback){
            var data = top.$App.getConfig('birthdayRemind');
            callback && callback(data);
        },
        /**
         *组装数据
         */
        buildDynamicData:function(data){
            if(!data) return;
            var dyMsg = {};
            for (var type in this.dynamicInfoTypes) {//暂存柜，好友共享，可能认识的人
                for(var j=0;j<data.length;j++){
                    if(data[j].id&&data[j].id==type){
                        dyMsg[type]=data[j]; 
                        break;
                    }
                }
            }
            return dyMsg;
        },
        /**
        *点击后，进行删除与上报行为
        */
        eraseDyData:function(key){
            var _self = this;
   	  
            //上报行为统计
            switch(key){
                case 11: 
                    top.BH({actionId:102062, thingId:4,pageId:10011,actionType:20}); 
                    break;
                case 13: 
                    top.BH({actionId:102062, thingId:5,pageId:10011,actionType:20}); 
                    break;
			 
            }
		
            var dyMsg = this.get('dyMsg');
            var seqno = dyMsg[key].seqno;
            var locationtype = dyMsg[key].locationtype;
            var msgseqno = dyMsg[key].msgseqno;
            if(!seqno) return;
            var initUrl = "/setting/s?func=user:delDynamicData&sid="+top.$App.getSid()+ "&seqno="+seqno+"&msgseqno="+msgseqno+"&locationtype="+locationtype+"&rnd="+Math.random();
            M139.RichMail.API.call(initUrl,{},function (res) {
                if(!(res.responseData&&res.responseData.code ==='S_OK')){
                    _self.logger.error("dyinfo:delDynamicData data error", "[user:delDynamicData]", res)
                }
            });
        },

        removeRemBirthMan:function(mobiles, birthData){
            var lastBirthData = [],
            	strMobiles = mobiles.join(',');

            _.each(birthData, function(item){
                item.AddrName = item.AddrName;
                if(item.MobilePhone) {
	                if(strMobiles.indexOf(item.MobilePhone.replace(/^86/,'')) === -1) {
		                lastBirthData.push(item);
	                }
                }
            });
            return lastBirthData;
        },

        //哪些需要显示
        buildBirthUser:function(birhMans,actualLen){
            var newObject = birhMans || [];
            var birthAdds = [],max_ch_count = (82/580)*actualLen-34;
            var trueName,groupName,showName;
            for(var i =0;i<newObject.length;i++){
                trueName = newObject[i].AddrName;
                groupName = newObject[i].groupName;
                if(!groupName){
                    showName = trueName;
                }else{
                    showName = trueName+"("+groupName+")";
                }
                birthAdds.push(showName);
                if(this.isCHOverFlow(birthAdds.join(''),max_ch_count)){
                    birthAdds.pop();
                }
            }
            return birthAdds;
        },
        //筛选名称与别名与组
        composeUserName:function(birhMans){
			var item,
				mobile,
				name,
				email,
				AddrName,
				Info,
				groupName,
				fullGroupName,
				trueName;

			// 小心坑，不要缓存length~
            for (var i = 0; i < birhMans.length; i++) {
	            item = birhMans[i];
                if (item.MobilePhone) {
                    mobile = item.MobilePhone.replace(/^86/, "");
                } else {
	                mobile = "";
                }
                
                email =  item.FamilyEmail;
                AddrName = item.AddrName;
                Info = top.Contacts.getContactsByMobile(mobile)[0];
                if(!Info){
                    Info = top.Contacts.getContactsByEmail(email)[0];
                }

                name = Info ? Info.name : "";	//name是对方设置的
                
                if(name||AddrName){
                    if(name && name!=mobile){
                        trueName = name;
                    }else{//取他自己设置的姓名与别名
                        trueName = AddrName;
                    }
                    groupName = this.fetchGNameByMobile(mobile);
                    item.fullGroupName = groupName;
                    if(top.$T.Utils.getBytes(groupName)>20){
                        item.fullGroupName = groupName.substring(0,10)+'...';;
                    }else{
                        item.fullGroupName = groupName;
                    }
                    if(top.$T.Utils.getBytes(groupName)>8){
                        item.groupName = groupName.substring(0,4)+'...';
                    }else{
                        item.groupName= groupName;
                    }
                    //原有的数据
                    item.addrName = item.AddrName;
                    //为了再贺卡中显示正确
                    item.AddrName = trueName;
                    if(!trueName){
                        birhMans.splice(i,1);
                        --i;
                    }
                }else{
                    birhMans.splice(i,1);
                    --i;
                }
            }
        },
        fetchGNameByMobile:function(mobileNumber){
            var gName = '';
            var _contacts = top.$App.getModel("contacts").getContactsByMobile(mobileNumber);
            //取到这些联系人所在的所有组名 
            var _groupNames = $.map(_contacts, //循环每个手机号里的SerialId
                 function (i) {
                     return $.map($.grep(top.Contacts.data.map,
                     function (j) { return j.SerialId == i.SerialId }),//查询在group中是否找到相应的SerialId
                     function (k) {
                         var group = top.$App.getModel("contacts").getGroupById(k.GroupId);
                         if (group) {
                             return group.GroupName;
                         }
                     
                     });
                 });//找到之后返回数组中
            if (_groupNames[0]) {
                if (top.$T.Utils.getBytes(_groupNames[0]) > 20) {
                    gName = _groupNames[0].substring(0, 10) + '...';
                } else {
                    gName = _groupNames[0]
                }
            }
            return gName;
        },
        //长度控制
        isCHOverFlow:function(str,len){
            return top.$T.Utils.getBytes(str)>len;
        },
        //避免将&-->再次转码
        htmlEnCodeBirth:function(users){
	        var Utils = top.$T.Utils;
            _.each(users, function(item){
                if (!item.isEncode) {
                    item.AddrName = Utils.htmlEncode(item.AddrName);
                    //item.addrName = Utils.htmlEncode(item.addrName);
                    //item.groupName = Utils.htmlEncode(item.groupName);
                    //item.fullGroupName = Utils.htmlEncode(item.fullGroupName);
                    item.isEncode = true;
                }
            });
            return users;
        },

        getAdContent: function (code) {
            // 地区的静态化资源中无数据就从默认静态资源中取数据
            var defaultAdContent = this.get("defaultAdContent");
            var adContent = this.get("AdContent") || defaultAdContent;
            var p = this.get("positionCode");
            var result;

            // 将静态化资源中不含有的广告位编码存放到 lackPositionCode 队列中
            var lackPositionCode = this.get("lackPositionCode");
            var codeNum = p[code] || code;

            // 如果上来静态资源加载成功或者默认资源加载成功，取adContent数据；
            // 如果adContent中没有对应的广告位，则判断默认资源是否加载完成，完成取默认数据，
            // 还没有加载完成，则存储到lackPositionCode队列中，等待默认广告数据加载完成之后再取对应广告位数据
            result = adContent[codeNum] || (defaultAdContent ? defaultAdContent[codeNum] : lackPositionCode.push(code));

            if (result && result[0]) {

                // 将静态化资源中的sid标示位进行替换成用户的sid
                return result[0].content.replace(/\$ADSSOSessionKey\$/g, top.sid);
            }
        },

		loadAdContent: function(callback){
            var self = this;
            var $User = top.$User;

            // 接入统一位置静态化数据
            if (top.SiteConfig["unifiedPositionStatic"]) {

                // 目录规则 省分编码/省分编码+地区编码.js
                var provCode = $User.getProvCode();
                var cityCode = $User.getAreaCode();
                var positionFileName = provCode + "_" + cityCode + ".js";
                var positionUrl = top.SiteConfig["unifiedPositionUrl"] + "/" + provCode + "/" + positionFileName + "?sid=" + top.sid;
                var unifiedPositionContent;

                //用于退出邮件后的链接追加
                var _href = top.$('#logout').attr('href');
                top.$('#logout').attr('href', _href + encodeURIComponent('?code=' + provCode + "_" + cityCode));

                M139.core.utilCreateScriptTag({
                    id: "unifiedPositionContent",
                    src: positionUrl,
                    charset: "utf-8"
                }, function(){
                    top.$App.trigger('change_074');
                    unifiedPositionContent = window["UnifiedPositionContent"];
                    //web_050静态变动态(nodejs后台输出)
                    if (unifiedPositionContent && window.inlineUnifiedPositionContent && inlineUnifiedPositionContent["var"]["web_050"]) {
                        unifiedPositionContent["web_050"] = inlineUnifiedPositionContent["var"]["web_050"];
                    }
                    //web_055静态变动态(nodejs后台输出)
                    if (unifiedPositionContent && window.inlineUnifiedPositionContent && inlineUnifiedPositionContent["var"]["web_055"]) {
                        unifiedPositionContent["web_055"] = inlineUnifiedPositionContent["var"]["web_055"];
                    }

                    if (unifiedPositionContent) {
                        self.set("AdContent", unifiedPositionContent);
                        callback && callback(unifiedPositionContent);
                    } else {

                        // 加载静态化资源失败 404 时，获取默认广告位数据
                        self.getDefaultDataForUnifiedPositionContent(callback);
                        self.logger.error("defaultDataForUnifiedPositionContentFail 404", "[defaultDataForUnifiedPositionContentFail 404]");
                    }
                });

                return;
            }

            var optionsCodeDate = [];
            var positionCode = self.get("positionCode");

            for (var i in positionCode) optionsCodeDate.push(positionCode[i]);

            var options = {
//                positionCodes:'web_050,web_051,web_052,web_053,web_054,web_055,web_056,web_057,web_060'
                positionCodes: optionsCodeDate.join(",")
            };
            top.M139.RichMail.API.call("unified:getUnifiedPositionContent", options, function (response) {
                if (response.responseData.code && response.responseData.code == "S_OK") {
                    self.set("AdContent", response.responseData["var"]);
                    callback && callback(response.responseData["var"]);
                }else{
                    self.logger.error("positioncontent returndata error", "[unified:getUnifiedPositionContent]", response)
                }
            });
        },
        // 获取统一位置默认数据
        getDefaultDataForUnifiedPositionContent: function (callback) {
            var self = this;

            // 加载静态化位置失败，则获取默认位置数据
            var defaultDataUrl = "/m2012/js/richmail/welcome_v3/m2012.welcome.defaultDataForUnifiedPositionContent.js";

            M139.core.utilCreateScriptTag({
                id: "defaultDataForUnifiedPositionContent",
                src: defaultDataUrl,
                charset: "utf-8"
            }, function(){
                var data = window["defaultDataForUnifiedPositionContent"];

                if (data) {
                    self.set("defaultAdContent", data);
                    callback && callback(data);
                } else {
                    self.logger.error("defaultDataForUnifiedPositionContentFail 404", "[defaultDataForUnifiedPositionContentFail 404]");
                }
            });
        },

        loadNewAdContent: function(callback){
	        var self = this;
		
            setTimeout(function () {
                top.NewAdLink = window.inlineUnifiedPositionContent["var"];
            }, 0);
	
        },
        getTabVisible:function(key){
            var tabState = this.get("tabState");
            var welcomeTab = this.get("welcomeTab");//top.$App.getCustomAttrs("welcome_tab");
            if (welcomeTab.trim() == "" || welcomeTab.split(",").length>5) { //用户未设置过或存量用户大于四项，默认显示前四项，应用商城默认不显示
                if (key == "mmarket") return false;
                if (key == "billCharge" && !top.SiteConfig.billAllowProvince[top.$User.getProvCode()]) {
                    return false;
                }
                return true;
            } else {
                return welcomeTab.indexOf(key) >= 0;
            }
        },
        setTabData: function (data) {
            this.set("welcomeTab", data);
            top.$App.setCustomAttrs("welcome_tab",data);
        },
		/*创建标签页切换*/
        createTabs: function (options) {
            var scrollCount = 1;
            var intervalId=-1;
            function changeTab(target) {
                var idx = $(options.tabs).index(target);
                $(options.tabs).removeClass(options.currentClass);
                $(target).addClass(options.currentClass);
                $(options.contents).hide();
                var current = $(options.contents).eq(idx);
                current.show();
                if (options.change) {
                    options.change(current, idx);
                }
            }
            function createScrollInterval() {
                clearInterval(intervalId);
                intervalId = setInterval(function () {
                    currentIndex = scrollCount % $(options.tabs).length;
                    changeTab($(options.tabs).eq(currentIndex));
                    scrollCount++;
                }, 6000);
            }
            $(options["tabs"]).click(function () {
                if (options.autoScroll) {//当用户点击时，重置自动播放的scroll计数
                    scrollCount = $(options.tabs).index($(this)) + 1;
                    createScrollInterval();
                }
                changeTab($(this));
            });
            if (options.autoScroll) {
                $(options.contents).eq(0).show();//初始化显示第一张图
                createScrollInterval();
            }
        },
        /**
         * 取默认城市天气ajax
         */
        reqDefaultWeather: function(callback){
            var self = this;
            top.M139.RichMail.API.call("weather:getDefaultWeather", null, function (response) {
                if (response.responseData && response.responseData.code == "S_OK") {
                    callback && callback(response.responseData["var"]);
                } else {
                    self.logger.error("weather returndata error", "[weather:getDefaultWeather]", response);
                }
            });

            /*top.M139.Timing.waitForReady("top.$App.getConfig('weatherInfo')", function () {
                var data = top.$App.getConfig('weatherInfo');
                callback && callback(data);
            });*/
        },
        /*
         * 取指定城市天气ajax
         * @param {String/Number} weatherCode 城市code
         */
        reqCityWeather: function(weatherCode,callback){
            var self = this;
            var options = {weatherCode:weatherCode};
            top.M139.RichMail.API.call("weather:getWeather", options, function (response) {
                if (response.responseData.code == "S_OK") {
                    callback && callback(response.responseData["var"]);
                }else{
                    self.logger.error("weather returndata error", "[weather:getDefaultWeather]", response);
                }
            });
        },
        /*
         * 设置用户默认城市天气
         * @param {String/Number} weatherCode 必选项 城市code
         */
        reqSetWeather: function(weatherCode,callback){
            var self = this;
            var options = {weatherCode:weatherCode};
            top.M139.RichMail.API.call("weather:setWeather", options, function (response) {
                if (response.responseData.code == "S_OK") {
                    callback && callback(response.responseData["var"]);
                }else{
                    self.logger.error("weather returndata error", "[weather:setWeather]", response);
                }
            });
        },
        //取省份城市数据
        reqAreas: function(callback){
            var self = this;
            top.M139.RichMail.API.call("weather:getArea", null, function (response) {
                if (response.responseData.code == "S_OK") {
                    self.set({areas:response.responseData["areas"]});
                    callback && callback(response.responseData["areas"]);
                }else{
                    self.logger.error("weather returndata error", "[weather:getArea]", response);
                }
            });
        },
        //查询所在省份的城市
        queryProvince: function (provinceCode) {
            var areas = this.get('areas');
            if(areas!=null){
                for (var i = 0, l = areas.length; i < l; i++) {
                    var province = areas[i];
                    if(province.areaCode == provinceCode) {
                        return province.children;
                    }
                }
            }
        },
        //得到当前时间
        getCurrentDate: function(){
            return top.M139.Date.getServerTime() || new Date();
        },
        //得到明天的月天
        getNextMonthDate: function(currentDate){
            currentDate.setDate(currentDate.getDate() + 1);
            return top.$Date.format("MM月dd日",currentDate);
        },

        getFetionC: function (callback) {
            top.M139.RichMail.API.call("user:getFetionC", null, function (response) {
                if (response.status == "200") {
                    callback && callback(response.responseData);
                } else {
                }
            });
        }

    }));

})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.UserMain.View', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
        },
        initialize: function (options) {
            this.model = options.model;
            this.initEvents();
        },
        initEvents : function(){
            var self = this;
            //G3通话链接跳转
            $("#g3Btn").click(function (e) {
                var json = getCkey();
                json.a = "g3";
                top.$App.show("G3Phone", json);
                e.preventDefault();
            });

            $("#shequLink").click(function(){
                top.$App.show("shequ", getCkey());
            });

            $("#linkFetion").click(function(){
                self.showFetion();
            });
            
            top.$App.on('showFetion',function(){
                self.showFetion();
            });

            function getCkey(){
                var g3PhoneModel = new top.M2012.G3.Model();
                g3PhoneModel.getParam();
                return g3PhoneModel.get("param");
            }
        },
        renderFetion: function(){
            var fetionElemInTop = top.$("#fetionElemTop");
            var fetionElemOffsetInWelcome = $("#fetionElem").show().offset();
            $("#fetionElem").hide();
            var fetionElemOffsetInWelcomeTopValue = fetionElemOffsetInWelcome.top;
            var fetionElemTopValueInTop = fetionElemOffsetInWelcomeTopValue + 28;

            if (fetionElemInTop.length == 0) return;
            //重新定位顶层飞信元素的位置
            fetionElemInTop.css({
                left: fetionElemOffsetInWelcome.left - 6 ,
                top: fetionElemTopValueInTop - 31
            });

            //如果当前标签页为欢迎页，显示飞信，否则隐藏
            top.$App.getCurrentTab().name == "welcome" ? fetionElemInTop.show() : fetionElemInTop.hide();

            $(window).scroll(function(){
                //飞信图标随滚动条的滚动而移动
                var scrollHeight = $(document).scrollTop();

                fetionElemInTop.css({top: fetionElemTopValueInTop - scrollHeight - 31});
                scrollHeight > fetionElemOffsetInWelcomeTopValue ? fetionElemInTop.hide() : fetionElemInTop.show();
            });

            $(window).bind("resize", function(){
                fetionElemOffsetInWelcome = $("#fetionElem").show().offset();
                $("#fetionElem").hide();
                fetionElemOffsetInWelcomeTopValue = fetionElemOffsetInWelcome.top;
                fetionElemTopValueInTop = fetionElemOffsetInWelcomeTopValue + 28;

                //重新定位顶层飞信元素的位置
                fetionElemInTop.css({
                    left: fetionElemOffsetInWelcome.left - 6,
                    top: fetionElemTopValueInTop - 31
                });
            })
        },
        //打开飞信窗口
        showFetion: function () {
            var self = this;
            if(top.$App.getConfig('ckey')){
                top.$App.show("fetion", { c: top.$App.getConfig('ckey') });
            }else{
                self.model.getFetionC(function (result) {
                    var ckey = "";
                    if (result && result["ckey"] && result["ckey"]["c"]) {
                        ckey = result["ckey"]["c"];
                    }
                    top.$App.registerConfig('ckey',ckey);
                    top.$App.show("fetion", { c: ckey });
                    self.changeLinkConfig('fetion',{ c: ckey });
                });
            }
        },

        changeLinkConfig:function(linkkey,obj){
            var url = top.LinkConfig[linkkey].url;
            url = top.$T.Url.makeUrl(url,obj);
            top.LinkConfig[linkkey].url = url;
        },

        render: function () {
            this.renderFetion();
		},
		// 初始化模型层数据
		getDataSource : function(callback){
		
		}
    }));
})(jQuery, _, M139);


﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Welcome.CustomTab.View', superClass.extend(
    {
        el: "body",
        template: ['<div class="boxIframeText" style="position:relative;">',
             '<ul class="diywelcome clearfix" id="ul_customTab">',
                 '<li class="gray"><input type="checkbox" checked="checked" rel="recommand" disabled="disabled"><label for="">邮箱推荐(默认)</label></li>',
                 '<li><input id="userCenterItem" type="checkbox" rel="userCenter"><label for="userCenterItem">用户中心</label></li>',
                 '<li><input id="laboratoryItem" type="checkbox" rel="uecLab"><label for="laboratoryItem">实验室</label></li>',
                 '<li><input type="checkbox" checked="checked" rel="business" id="business"><label for="business">精品业务</label></li>',
                 '<li><input id="mmarket" type="checkbox" rel="mmarket"><label for="mmarket">应用商城</label></li>',
                 '<li class="gray" style="display:none"><input id="billCharge" type="checkbox" rel="billCharge" disabled="disabled"><label for="billCharge">邮箱营业厅</label></li>',
             '</ul>',
             '<p id="tipTabSet" style="position:absolute; left:16px;bottom:-29px;color:#333;">{0}</p>',
         '</div>'].join(""),
        msg: {
            MAXADD: "最多可添加4项，添加满时，需取消一项再添加另一项",
            MINADD: "最少需添加2项推荐内容"
        },
        events: {
            "click input": "changeSetting"
        },
        initialize: function (options) {
            this.model = options.model;
        },
        changeSetting:function(){
            var ableInput = this.$("#ul_customTab input");
            var noCheckedInput = ableInput.not(":checked");
            var checkedInputLen = ableInput.filter(":checked").length;
            var tipTabSet = this.$("#tipTabSet");
            var color = {
                mark: "red",
                normal: "#333"
            };
            var tipHtml = "";
            var colorValue = "";
            var isDisabled = false;

            if (checkedInputLen < 2) {
                colorValue = color["mark"];
                tipHtml = this.msg.MINADD;
            } else if (checkedInputLen > 4) {
                colorValue = color["mark"];
                tipHtml = this.msg.MAXADD;
                isDisabled = true;
            } else {
                colorValue = color["normal"];
                tipHtml = this.msg.MAXADD;
            }
            tipTabSet.html(tipHtml).css({"color": colorValue});
            $.each(noCheckedInput, function(){
                this.disabled = isDisabled;
            });
        },
        render: function () {
            var self = this;

            this.dialog = top.$Msg.showHTML(this.template.format(this.msg.MAXADD), function (e) {
                self.okHandler(e);
            }, function (e) {
                //self.cancelHandler();
            }, {
                dialogTitle: "定制推荐的内容",
                width: 540,
                buttons: ["确定", "取消"]
            });

            if (top.SiteConfig.billAllowProvince[top.$User.getProvCode()]) {
                top.$('input#billCharge').parent().show();
            }
            this.setElement(this.dialog.el);
            this.initTabOptions();
            return superClass.prototype.render.apply(this, arguments);
        },
        initTabOptions: function () {
            var self = this;
            this.$("#ul_customTab input").each(function (i,n) {
                var tabName = $(this).attr("rel");
                $(this).attr("checked",self.model.getTabVisible(tabName));
               
            })
            
        },
        okHandler: function (e) {
            var self = this;
            var result = "";
            
            var ableInput = this.$("#ul_customTab input");
            var ableInputLen = ableInput.filter(":checked").length;

            if (ableInputLen < 2 || ableInputLen > 4) {//除了默认项 添加少于1项,多于3项提示
                e.cancel = true;
                this.flickerAnimate();
                return;
            }
            
            ableInput.each(function (i, n) {
                var tabName = $(this).attr("rel");
                if ($(this).attr("checked")) {
                    result += tabName + ",";
                }
            });
            if (result != "") {
                this.model.setTabData(result);
            }
            
            BH("welcome_tabSet_okBtn");
        },
        
        flickerAnimate: function(){
            var self = this;
            var i = 3;//闪烁3次

            var toggleTip = function(){
                self.$("#tipTabSet").toggle();
            };
            var timer = setInterval(function(){
                if (!i--) {
                    clearInterval(timer);
                    return;
                }

                toggleTip();
                setTimeout(function(){
                    toggleTip();
                }, 50);
            }, 150);
        }
        
       
    })); 
})(jQuery, _, M139);


﻿/**
* @namespace 
* 欢迎页
* BirthdayModel
*/

M139.namespace("M2012.Welcome.FriendBirthday.Model",Backbone.Model.extend({

    defaults:{
        birthdayData:null,
        data: null,
	    isBirthdayLinkExist: false //生日提醒链接是否存在
	},
	getCardRemind:function(callback){
        var self = this;
        var options = {op:'get'};
        top.M139.RichMail.API.call("card:birthdayRemind", options, function (response) {
            if (response.responseData && response.responseData.code == "S_OK") {
                callback && callback(response.responseData["var"]);
            } else {
                callback({"mobiles":[]});
                self.logger.error("welcome.card:birthdayRemind data error", "[card:birthdayRemind]", response)
            }
        });
	},
	removeRemBirthMan:function(mobiles,birthData){
	    var mobile,lastBirthData = [],strMobiles = mobiles.join(',');
		$.each(birthData,function(index,item){
			  item.AddrName = item.AddrName;
			  mobile = item.MobilePhone?item.MobilePhone:"";
			  if(strMobiles.indexOf(mobile.replace(/^86/,''))<=-1){
			    lastBirthData.push(item);
			  }
		});
	   return lastBirthData;
	},
	
	//哪些需要显示
	buildBirthUser:function(birhMans,actualLen){
	  var newObject = jQuery.extend(true, [], birhMans);
	  var birthAdds = [],max_ch_count = (82/580)*actualLen-34;
	  var trueName,groupName,showName;
	  for(var i =0;i<newObject.length;i++){
		  trueName = newObject[i].AddrName;
		  groupName = newObject[i].groupName;
		  if(!groupName){
		    showName = trueName;
		  }else{
		   showName = trueName+"("+groupName+")";
		  }
		  birthAdds.push(showName);
	     if(this.isCHOverFlow(birthAdds.join(''),max_ch_count)){
		     birthAdds.pop();
	     }
	}
    return birthAdds;
   },
   //筛选名称与别名与组
	composeUserName:function(birhMans){
		 for(var i =0;i<birhMans.length;i++){//
			 var mobile = birhMans[i].MobilePhone.replace(/^86/,"");
			 var email =  birhMans[i].FamilyEmail;
			 var AddrName = birhMans[i].AddrName;
			 var Info = top.Contacts.getContactsByMobile(mobile)[0],groupName,fullGroupName,trueName;
			 if(!Info){
			   Info = top.Contacts.getContactsByEmail(email)[0]
			 }

			 var name = Info?Info.name:"";//name是对方设置的
			if(name||AddrName){
			    if(name!=mobile){
				  trueName = name;
				}else{//取他自己设置的姓名与别名
				  trueName = AddrName;
				}
				groupName = this.fetchGNameByMobile(mobile);
				birhMans[i].fullGroupName = groupName;
				if(top.$T.Utils.getBytes(groupName)>20){
				  birhMans[i].fullGroupName = groupName.substring(0,10)+'...';;
				}else{
				  birhMans[i].fullGroupName = groupName;
				}
				if(top.$T.Utils.getBytes(groupName)>8){
				 birhMans[i].groupName = groupName.substring(0,4)+'...';
				}else{
				 birhMans[i].groupName= groupName;
				}
			    //原有的数据
				birhMans[i].addrName = birhMans[i].AddrName;
				//为了再贺卡中显示正确
				birhMans[i].AddrName = trueName;
				if(!trueName){
				 birhMans.splice(i,1);
				 --i;
				}				
			}else{
				birhMans.splice(i,1);
				--i;
			}
		}
	},
	fetchGNameByMobile:function(mobileNumber){
	    var gName = '';
	    var _contacts = top.$App.getModel("contacts").getContactsByMobile(mobileNumber);
	    //取到这些联系人所在的所有组名 
	    var _groupNames = $.map(_contacts, //循环每个手机号里的SerialId
             function (i) {
                 return $.map($.grep(top.Contacts.data.map,
                 function (j) { return j.SerialId == i.SerialId }),//查询在group中是否找到相应的SerialId
                 function (k) {
                     var group = top.$App.getModel("contacts").getGroupById(k.GroupId);
                     if (group) {
                         return group.GroupName;
                     }
                     
                 });
             });//找到之后返回数组中
	    if (_groupNames[0]) {
	        if (top.$T.Utils.getBytes(_groupNames[0]) > 20) {
	            gName = _groupNames[0].substring(0, 10) + '...';
	        } else {
	            gName = _groupNames[0]
	        }
	    }
	    return gName;
    },
	//长度控制
   isCHOverFlow:function(str,len){
		return top.$T.Utils.getBytes(str)>len;
   },
   //避免将&-->再次转码
   htmlEnCodeBirth:function(users){
		$.each(users,function(index,item){
		    if (!users[index].isEncode) {
		        users[index].AddrName = top.$T.Utils.htmlEncode(item.AddrName);
		        users[index].addrName = top.$T.Utils.htmlEncode(item.addrName);
		        users[index].groupName = top.$T.Utils.htmlEncode(item.groupName);
		        users[index].fullGroupName = top.$T.Utils.htmlEncode(item.fullGroupName);
		        users[index].isEncode = true;
		    }
		});
		return users;
   }
}));
