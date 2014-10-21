/**
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