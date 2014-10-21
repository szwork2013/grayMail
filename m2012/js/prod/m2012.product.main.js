/**
 * 全局产品运营主入口
 */
var ProductFuns = {


	//懒人贺卡弹出判断
    isNeedDisplay: function () {
        var isNeedDisplay = false;
        var sets = top.SiteConfig.lazyCard || []; 
        var test = top.$App && top.$App.query && top.$App.query.testServerTime ? top.$App.query.testServerTime : false;
        var today = new Date(M139.Date.getServerTime());
        if (test) {
            today = top.$Date.parse(test);
        }
        var setData = top.$App.getCustomAttrs("lazyCard") || "";

        setData = setData.replace(/\/>|\s*/g, "");


        // setData = setData.replace("");
        var begin = $PUtils.dateFormat(sets.begin),
            end = $PUtils.dateFormat(sets.end),
            key = sets.key;
        if (today >= begin && today <= end && setData.indexOf(key) < 0) {
            isNeedDisplay = true;
        }
        return { isNeedDisplay: isNeedDisplay, key: key }
    },
    //懒人贺卡入口
    loadLazyCard: function (key) {
        var self = this;
        if (key) { //从触点进入
            self.lazyCardResource(key, function (option) {
                self.popLazyCard(option);
            })
        } else {
            top.M139.Timing.waitForReady('$App.getConfig("UserAttrs")', function () {
                var display = self.isNeedDisplay();
                var isNeedDisplay = display.isNeedDisplay,
                    key = display.key;
                var contactReady = self.lazyCardContact();   //通讯录已经加载
                var allowUsers = top.UserData.vipType == "1";  //一般用户

                if (isNeedDisplay && key && contactReady && allowUsers) {
                    top.$App.setCustomAttrs("lazyCard", key, function (res) {
                        if (res['code'] == "S_OK") {
                            self.lazyCardResource(key, function (option) {
                                self.popLazyCard(option);
                            })
                        }
                    });
                }
            })
        }
    },
    //懒人贺卡需要的数据--通信录
    lazyCardContact: function () {
        var contact = top.$App.getModel("contacts");
        if (contact && contact.attributes && contact.attributes.data && contact.attributes.data.contacts && contact.attributes.data.contacts.length) {
            return true;
        } else {
            return false;
        }       
    },
    //懒人贺卡需要的数据--贺卡素材
    lazyCardResource: function (key, callback) {
        var typeStore = {  //param:[newHot, topGroupId, groupId, pageIndex]
            cj : {title: '春节',   param: [2,1,7,1]}, 
            yx : {title: '元宵', param: [2,1,8,1]}, 
            //fn: { title: '妇女', param: [2, 1, 3, 1] },
            yr: { title: '愚人', param: [2, 1, 9, 1] },
            //qm: { title: '清明', param: [2, 1, 31, 1] },
            //ld: { title: '劳动', param: [2, 1, 4, 1] },
            //qn: { title: '青年', param: [2, 1, 5, 1] },
            //mq: { title: '母亲', param: [2, 1, 10, 1] },
            dw: { title: '端午', param: [2, 1, 11, 1] },
            //et: { title: '儿童', param: [2, 1, 20, 1] },
            //fq: { title: '父亲', param: [2, 1, 21, 1] },
            //qx: { title: '七夕', param: [2, 1, 22, 1] },
            //jj: { title: '建军', param: [2, 1, 23, 1] },
            //zq: { title: '中秋', param: [2, 1, 27, 1] },
            //js: { title: '教师', param: [2, 1, 25, 1] },
            //gq: { title: '国庆', param: [2, 1, 26, 1] },
            //cy: { title: '重阳', param: [2, 1, 28, 1] },
            //ws: { title: '万圣', param: [2, 1, 34, 1] },
            //gg: { title: '光棍', param: [2, 1, 35, 1] },
            //ge: { title: '感恩', param: [2, 1, 29, 1] },
            //sd: { title: '圣诞', param: [2, 1, 37, 1] },
            //yd: { title: '元旦',   param: [2, 1, 6, 1] },
            nothing:{}
        };

        var type = key.slice(-2);
        //如果没有检索到
        if (!typeStore[type]) {
            return;
        }
        //日志上报
        //top.BH('欢迎页弹出发送贺卡邮件浮层_' + typeStore[type]['title']);
        var requestType = typeStore[type].param;
        var requestUrl = "/mw2/card/s?func=card:cardPageData&sid=" + top.sid,
            requsetData = ['<object>',
                '<int name="type">0</int>',
                '<int name="newHot">2</int>',
                '<string name="topGroupId">1</string>',
                '<string name="groupId">' + requestType[2] + '</string>',
                '<int name="pageIndex">1</int>',
                '<int name="pageSize">100</int>',
                '</object>'].join('');

        top.M139.RichMail.API.call(requestUrl, requsetData, function (rep) {
            if (rep.responseData && rep.responseData.code == "S_OK") {
                var cardList = rep.responseData['var']['data']['retData'];
                if (cardList.length) {
                    top.$lazycardList = {
                        type: typeStore[type]['title'],
                        dataList: cardList
                    }
                    var option = {
                        type: type
                    }
                    callback(option);
                }
            }
        });
    },
    //懒人贺卡弹出执行
    popLazyCard: function (option) {
        top.selfBir_mask = top.M2012.UI.DialogBase.showMask();
        var width = 680,
            height = 550;
        var url = "http://" + top.window.location.host + "/m2012/html/lazyCard/" + option.type + "/lazyCard.html";
        var iframe = ["<div id='lazycardWindow' style='width:"+width+"px; height:"+height+"px;overflow:hidden; z-index:999; position:absolute;left:50%;top:50%;margin-top: -"+height/2+"px;margin-left: -"+width/2+"px;'>",
            "<iframe allowTransparency='true' style='width:"+width+"px; height:"+height+"px; border:none;' frameborder='0' src='",
            url,
            "'></iframe>",
            "</div>"
        ].join("");
        top.lazycardWin = $('body').append(iframe).find('#lazycardWindow');
    },

    closeLazyCard: function () {
        top.lazycardWin.remove();
        top.selfBir_mask.hide();
    },

	showBirthwish: function () {
	    $App.getModel("contacts").requireData(function () { //等待通讯录加载
	        var url = "http://" + top.window.location.host + "/m2012/html/";
	        url += "birthdaywish.html";
	        var scheduleIFrame = top.$Msg.open({
	            hideTitleBar: true,
	            url: url,
	            width: 746,
	            height: 536
	        });;
	        top.$App.set('birthWishFrame', scheduleIFrame);//设置一顶层变量用于以后关闭弹出框
	        M139.PUtils.iframetransparent();  //把弹出框设置背景透明，无边框
	    });
	},
    

    //tips
	showOnlineTips: function () {

	    if (top.SiteConfig.loginOnlineTip) {
	        window.setTimeout(function () {
	            top.M139.UI.TipLoginView.show();
	        }, 3000); //延迟3秒后显示
	    }
	    if (top.SiteConfig.emailOnlineTip) top.M139.UI.TipMailView.show();
	    if (top.SiteConfig.userOnlineTip) {
	        window.setTimeout(function () {
	            top.M139.UI.TipOnlineView.show();
	        }, 1000 * 60 * 60); //1个小时显示
	    }
	    if (top.SiteConfig.plugOnlineTip) {
	        window.setTimeout(function () {
	            top.M139.UI.TipActiveView.show();
	        }, 1000 * 60); //1分钟显示
	    }


	},
	examineUserStatus: function (params, callback) {
	    this._callLotteryAPI("setting:examineShowStatus", params, callback);
	},
	_callLotteryAPI: function (api, params, callback) {
	    options = { method: "GET" };
	    callback = callback || $.noop;
	    params = ($Url.makeUrl("", params)).replace("?", ""); //GET模式，拼接url，并去掉问号

	    M139.RichMail.API.call(api, params, function (respData) {
	        if (respData) {
	            callback(respData.responseData);
	        } else {
	            callback();
	        }
	    }, options);
	},
    //运营tips   xxxyyy
	loadOperateTips: function () {
	    top.M139.Timing.waitForReady('NewAdLink', function () {
            var operatetipsview = new M2012.OperateTips.View();
            top.operatetipsview = operatetipsview; //方便测试
            operatetipsview.initEvents();

	    });
	},
    /**
     * ProductFuns.examineShowStatus({
     *     tid: 1000, //对应的日历活动id或者贺卡id
     *     originID:3, //来源，如1表示贺卡，2，表示写信，3表示日历
     *     versionID:1 //版本，如1表示标准版2.0
     * },function(data){
     *     //do something
     * }
     */
	examineShowStatus: function (params, callback) {
	    this._callLotteryAPI("setting:examineShowStatus", params, callback);
	},
    /**
     * ProductFuns.examineUserStatus({
     *     tid: 1000,   //对应的日历活动id或者贺卡id
     *     originID:3,  //来源，1：表示贺卡，2：表示写信，3：表示日历
     *     versionID:1, //版本，1：表示标准版2.0
     *     comefrom:1   //来源为日历时必选，1：创建日历，2：创建日历活动
     * },function(data){
     *     //do something
     * }
     */
	examineUserStatus: function (params, callback) {
	    this._callLotteryAPI("setting:examineUserStatus", params, callback);
	},
	_callLotteryAPI: function (api, params, callback) {
	    options = { method: "GET" };
	    callback = callback || $.noop;
	    params = ($Url.makeUrl("", params)).replace("?", ""); //GET模式，拼接url，并去掉问号

	    M139.RichMail.API.call(api, params, function (respData) {
	        if (respData) {
	            callback(respData.responseData);
	        } else {
	            callback();
	        }
	    }, options);
	}
};


 
