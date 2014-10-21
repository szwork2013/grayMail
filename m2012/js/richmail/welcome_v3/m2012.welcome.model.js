
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

