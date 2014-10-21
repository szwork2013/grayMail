/**
 * @fileOverview 定义M2012.UserModel类.
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UserModel";
    M139.namespace(namespace, superClass.extend(
    /**
    *@lends M2012.UserModel.prototype
    */
    {
    /**
    *管理用户常用属性类
    *@constructs M2012.UserModel
    *@param {Object} options 参数集合
    *@example
    */
    initialize: function (options) {

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: namespace,

    /**
    *获得用户别名
    *@param {String} type 别名类型：common普通别名(默认)|fetion飞信别名
    *@returns {String}
    *@example
    $User.getAliasName("common");//返回lifula
    */
    getAliasName: function (type) {
        type = type || "common";
        var result = $.grep(this.getAccountList(), function (n, i) {
            return n.type == type;
        });
        return result.length > 0 ? result[0].name : "";
    },
    /**
    *设置默认帐号时获得用户帐号类型 1 普通别名别名 2 手机号 3 飞信别名
    *@param {String} type 别名类型：common普通别名|fetion飞信别名|mobile手机号|passid通行证
    *@returns {Int}
    *@example
    $User.getAccountType("common");//返回1
    */
    getDefaultAccountType: function (type) {
        return { "common": 1, "mobile": 2, "fetion": 3, "passid": 4 }[type];
    },
    /**
    *返回用户分区号： 返回1为灰度，返回12为全网（测试线返回21是全网）
    *@returns {String}
    */
    getPartId: function () {
        var id = this.get("partid");
        if (!id) {
            id = getCookie("cookiepartid") || "";
            this.get("partid", id);
        }
        return id;
    },
    isGrayUser: function () { //是否灰度用户
        return this.getPartId() == "1";
    },
    /**
    *请用getPartId，这里为了兼容
    *@returns {String}
    */
    getPartid: function () {
        return this.getPartId();
    },

    /**
    *取老版本的UserData，获取用户不变属性的时候用，获取动态属性禁用，外部禁用
    *@inner
    */
    getUserDataObj: function () {
        var ud = {
            userNumber: "",
            "ssoSid": top.sid,
            provCode: "1"
        }
        
        return ud;
        /*var ud = this.get("UserData");
        if (!ud) {
            ud = M139.JSON.tryEval(M139.Text.Cookie.get("UserData"));
            if (!ud) {
                $App.setSessionOut({
                    type: "CookieUserData"
                });
                throw this.logger.getThrow("Cookie中UserData为空");
            }
            this.get("UserData", ud);
        }
        return ud;*/
        
    },

    /**
    *获取用户设置的默认字体.系统默认字体为： {size : '2',family : '宋体',color : '#000000'}
    */
    getDefaultFont: function () {
        var fontsStr = this.tryGetObjectValue($App.getConfig("UserAttrsAll"), 'fonts', '2;宋体;#000000;1.5');
        var fontsObj = {};
        var temp = fontsStr.split(';');
        fontsObj.size = temp[0];
        fontsObj.family = temp[1].replace(/'/g, '');
        fontsObj.color = temp[2];
        fontsObj.lineHeight = temp[3] || 1.5;
        fontsObj.lineHeight = fontsObj.lineHeight == 1 ? 1.2 : fontsObj.lineHeight; //单倍设为1.2，有些浏览器单倍文字会被截半（遮挡住）

        var mapSize = {
            6: "一号",
            5: "二号",
            4: "三号",
            3: "四号",
            2: "五号",
            1: "六号"
        };
        fontsObj.sizeText = mapSize[fontsObj.size];
        
        var mapLineHeight = {
            1.2 : "单倍",
            1.5 : "1.5倍",
            2   : "2倍",
            2.5 : "2.5倍"
        };
        fontsObj.lineHeightText = mapLineHeight[fontsObj.lineHeight];
        
        return fontsObj;
    },
    
    /**
    *获取用户设置的皮肤，系统默认的皮肤为 normal add by tkh
    */
    getSkinName: function () {
        var skinPath = $Cookie.get("SkinPath2");
        if (!/^skin_\w+$/.test(skinPath) || HIDDEN_SKIN[skinPath]) {
            skinPath = "skin_lightblue";
        } else if (skinPath == 'skin_normal') {
            skinPath = $Cookie.get("cookiepartid") == 1 ? "skin_red" : "skin_lightblue";
        }
        return skinPath;
    },

    /**
    *获取2.0皮肤映射的1.0值,给内嵌的老页面用
    */
    getSkinNameMatrix: function () {
        var skin = this.getSkinName();
        //新老皮肤近似值映射
        var skinMatch = { 
            "skin_red": "skin_red",
            'skin_pink': "skin_pink",
            'skin_golf': "new_skin_golf",
            'skin_light': "skin_g1",
            'skin_star': "new_skin_startrek",
            'skin_cat': "new_skin_riches",
			'skin_mstar': 'skin_snow',
			'skin_sunset': 'skin_mZone',
			'skin_paint': 'skin_2010',
			'skin_mcloud': 'skin_shibo',
            'skin_lightblue': 'skin_shibo',
			'skin_sunflower': 'skin_mZone',
			'skin_rose': 'new_skin_rabbit',
			'skin_flowers': 'new_skin_spring',
			'skin_brocade': 'skin_love',
			'skin_newyear': 'new_skin_rabbit',
			'skin_dew': 'skin_green',
			'skin_cherry': 'skin_pink',
			'skin_warm': 'new_skin_rabbit',
			'skin_lithe': 'skin_blue',
			'skin_night': 'new_skin_riches',
			'skin_morning': 'new_skin_rabbit',
            'skin_spring': 'skin_green',
            'skin_summer': 'skin_blue',
            'skin_autumn': 'skin_xmas',
            'skin_winter': 'skin_love',
            'skin_child': 'skin_mZone',
            'skin_woman': 'skin_pink',
            'skin_bluesky': "skin_shibo",
            'skin_claritBamboo':"skin_grassGreen",
            'skin_claritBrown': "skin_brown",
            'skin_claritGreen': "skin_paleGreen",
            'skin_claritPurple': "skin_lavender",
            'skin_claritRed': "skin_pinks"
        };
        var path = skinMatch[skin] || "skin_shibo";
        return path;
    },

    /**
    *获取一个对象的属性值（有容错处理）
    @param {Object} obj 对象名
    @param {String} key 属性名
    @param {Mixed} defaultValue 默认值(不传的话，无数据返回"")
    */
    tryGetObjectValue: function (obj, key, defaultValue) {
        defaultValue = (defaultValue === undefined ? "" : defaultValue);
        var value = (obj && obj[key]) || defaultValue;
        return value;
    },

    /**
    *获取GetMaindata输出的UserData属性值
    *@inner
    @param {String} key 属性名
    @param {Mixed} defaultValue 默认值(不传的话，无数据返回"")
    */
    tryGetUDValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("UserData"), key, defaultValue);
    },

    /**
    *获取UserAttr属性值
    *@inner
    */
    tryGetUAttrValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("UserAttrs"), key, defaultValue);
    },

    /**
    *获取PersonalData属性值
    *@inner
    */
    tryGetPDataValue: function (key, defaultValue) {
        return this.tryGetObjectValue($App.getConfig("PersonalData"), key, defaultValue);
    },

    /**
    *返回用户手机账号（带86）（原来的UserData.userNumber)
    *@returns {String}
    */
    getUid: function () {
        if ($App.getConfig && $App.getConfig("UserData")) {
            return $App.getConfig("UserData").UID;
        } else {
            return "";
        }
    },

    /**
    *返回用户手机账号（不带86）
    *@returns {String}
    */
    getShortUid: function () {
        return $T.Mobile.remove86(this.getUid());
    },
    /**
    * 读取是否已升级为移动通行证
    * @returns {void}
    */
    isUmcUserAsync: function (callback) {
        var data = $App.getConfig("UserData");
        var _callback = callback || new Function();
        
        if (typeof(data.isumcuser) != "undefined") {
            _callback(data.isumcuser);
            return;
        }
    
        M139.Timing.waitForReady(function(){
            try {
                var _data = $App.getConfig("UserData");
                if ( typeof(_data.isumcuser) != "undefined" ) {
                    return true;
                }
            } catch (ex) {
            }

            return false;
        }, function() {
            var _data2 = $App.getConfig("UserData");
            _callback(_data2.isumcuser);
        });
    },

    /**
    *是否是互联网账号
    */
    isInternetUser: function () {
        return this.getProvCode() === '83'
    },
    /*是否是中国移动用户*/
    isChinaMobileUser: function () {
        return this.getProvCode() <= 31 ? true : false;
    },

    /*是否非中国移动用户*/
    isNotChinaMobileUser: function () {
        return !this.isChinaMobileUser();
    },

    //判断涉及手机号的功能是否可用
    checkAvaibleForMobile: function (elList) {
        var self = this;
        if (this.isChinaMobileUser()) {//移动账号
            return true;
        } else {
            if (elList) { //点击后提示
                $(elList).unbind("click");
                if (typeof (elList) == "string") {
                    $(elList).live("click", function (e) {
                        self.showMobileLimitAlert();
                        e.stopPropagation();
                        e.preventDefault();
                    });
                } else {
                    $(elList).bind("click", function (e) {
                        self.showMobileLimitAlert();
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            } else { //立即提示
                self.showMobileLimitAlert();
            }
            return false;
        }
    },

    showMobileLimitAlert: function () {
        if (this.isInternetUser()) { //互联网账号
            $Msg.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。<a href='javascript:top.$App.show(\"account\",{anchor:\"accountAdmin\"}); $Msg.getCurrent().close();'>绑定手机账号</a>", { isHtml: true });
        } else {
            $Msg.alert("尊敬的用户：您暂时无法使用本功能。如需使用完整功能，请使用中国移动手机开通139邮箱。");
        }
    },

    /**
    *返回用户省份编号
    *@returns {String}
    */
    getProvCode: function () {
        window.PROVCODE = M139.Text.Cookie.get("provCode");
        if (window.PROVCODE) {
            return window.PROVCODE;
        }else{
            return this.getUserDataObj().provCode + "";
        }
    },

    /**
    *返回用户地区编号（城市），如果数据不具备返回空
    *@returns {String}
    */
    getAreaCode: function () {
        //cookie中的userdata没有areaCode这个属性
        return this.tryGetUDValue("areaCode");
    },

    /**
    *获得用户账号列表 返回[{"name":"lifula@139.com","type":"common"},{"name":"15889394143@139.com","type":"mobile"},{"name":"719094764@139.com","type":"fetion"}]
    *@return {Array} 无数据返回null
    */
    getAccountList: function () {
        try {
            var data = $App.getConfig("UserData");
            if (!data || !data.uidList) {
                return [];
            }

            var map = {
                "0": "common",
                "1": "fetion",
                "2": "mobile",
                "3": "passid"
            };

            var sortvalue = {
                "0": 4,
                "1": 2,
                "2": 3,
                "3": 1
            };

            var accountList = [];
            var hasMobile = false;

            for (var i=0, l=data.uidList, m=l.length, n; i < m, n=l[i]; i++) {
                accountList.push({ sortid: sortvalue[n.type] || sortvalue["0"], name: n.name, type: map[n.type] || map["0"] });
                hasMobile = hasMobile || n.type == "2";
            }

            if (!hasMobile && data.provCode !== "83") {
                accountList.push({ sortid: sortvalue["2"], name: $App.getAccountWithLocalDomain($Mobile.remove86(data.UID)), type: map["2"] });
            }

            accountList.sort(function(a, b){ return b.sortid - a.sortid });

            return accountList;

        } catch (e) { }
        return [];
    },

    /**
    *获得用户账号列表 返回["lifula@139.com", "15889394143@139.com", "719094764@139.com"]
    *@return {Array} 无数据返回空数组
    */
    getAccountListArray: function () {
        var list = this.getAccountList();
        var account = [];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                //排除互联网账号的 号码@139.com 邮箱    最好是接口输出的时候就排除掉
                if (this.isInternetUser() && this.isInternetUserNumberEmail(list[i])) {
                    continue;
                }
                account.push(list[i].name);
            }
        }
        return account;
    },

    /**
    *判断互联网用户 号码@139.com 是否为假的手机号邮件地址
    *@param {String} email 号码@139.com
    *@return {Boolean} 无数据返回空数组
    */
    isInternetUserNumberEmail: function (email) {
        return M139.Text.Email.getAccount(email) == this.getShortUid();
    },

    /**
    *返回用户默认发信账号，异常返回:手机号@139.com
    *@returns {String}
    */
    getDefaultSender: function () {
        try {
            //todo
            return $App.getView("top").getDefaultSender();
        } catch (e) {
            if (!this.isInternetUser()) {
                return this.getShortUid() + "@" + $App.getMailDomain();
            } else {
                throw "$User.getDefaultSender()";
            }
        }
    },
    /**
    *设置默认发信账号
    *@returns {String}
    */
    setDefaultSender: function (account, type, callback) {
        //todo
        return $App.getView("top").setDefaultSender(account, type, callback);
    },

    /**
    *获取上一次登录时间，返回：2012-12-12 08:57:25，异常返回空字符
    *@returns {String}
    */
    getLastLoginDate: function () {
        return this.tryGetUDValue("lastLoginDate");
    },
    /**
    *获得用户登录使用的账号名（异常返回手机号，外网账号返回默认发信号）
    *@returns {String}
    */
    getLoginName: function () {
        var result = this.tryGetUDValue("loginName", this.getShortUid());
        if (/^8680/.test(result)) {
            result = M139.Text.Email.getAccount(this.getDefaultSender())
        }
        return result;
    },

    /**
    *获得用户手机卡类型（动感、神州行、全球通等），异常返回空字符
    *@returns {String}
    */
    getCardType: function () {
        return this.tryGetUDValue("cardType");
    },

    /**
    *获得用户套餐值(0010,0015,0016,0017)，异常返回空字符
    *@returns {String}
    */
    getServiceItem: function () {
        return this.tryGetUDValue("serviceItem");
    },

    /**
    *异步获取套餐数据
    *@param {Function} callback 回调函数
    */
    getMealData: function (callback) {
        var self = this;
        if (!this.isChinaMobileUser()) {//暂不请求套餐接口（后台会超时）
            return;
        }

        /*
        M139.RichMail.API.call("meal:getMealInfo", '', function (result) {
            if (result.responseData && result.responseData.code && result.responseData.code == 'S_OK') {
                var data = result.responseData["var"];
                if (self.packageName == '') {
                    self.packageName = data.serviceName;
                }
                callback && callback(data);
            } else {
                self.logger.error("getMealInfo returndata error", "[meal:getMealInfo]", result);
            }
        });
        */

        top.M139.Timing.waitForReady("$App.getConfig('mealInfo')", function () { 
            var data = $App.getConfig('mealInfo');
            if (self.packageName == '') {
                self.packageName = data.serviceName;
            }
            callback && callback(data);
        });
    },

    /**
    *获得用户套餐名（免费版、5元版、20元版等）
    *@returns {String}
    */
    getPackage: function () {
        return this.packageName;
    },
    packageName: '', //套餐名称

    /**
    *获得用户积分信息,不具备数据返回null
    *@returns {Object}
    */
    getUserIntegral: function () {
        return this.tryGetUDValue("mainUserIntegral", null);
    },
    /**
    *返回我的应用配置数据，不具备返回null
    *@returns {Object}
    */
    getMyApp: function () {
        return this.tryGetUDValue("myapp", null);
    },
    /**
    *返回我的应用ID
    *@returns {string}
    */
    getMyAppIdByKey: function(_key) {
        var apps = this.getMyApp();
		var result = $.grep(apps,function(val,n){
			return val.key == _key;
		});
		if(result && result[0]){return result[0].id}
		return null;
    },	
    /**
    *返回UserConfig用户配置参数表信息，不具备返回null
    *@returns {Object}
    */
    getUserConfig: function () {
        return this.tryGetUDValue("mainUserConfig", null);
    },
    /**
    *返回用户实验室信息，不具备返回null
    *@returns {Object}
    */
    getUecInfo: function () {
        return this.tryGetUDValue("uecInfo", null);
    },
    /**
    *返回uidList(用户账号列表)，不具备返回[]，不建议使用
    *@returns {Array}
    */
    getUidList: function () {
        return this.tryGetUDValue("uidList", []);
    },

    /**
    *套餐常量
    */
    levelEnum: {//用户等级
        free0010: "0010", //广东免费
        free0015: "0015", //非广东免费
        vip5: "0016", //5版
        vip20: "0017"//20版
    },

    /**
    * 【不推荐直接调用】获得用户套餐信息（最大发件个数、最大附件大小等）,不具备数据返回{}无属性对象
    * @returns {Object}
    */
    getVipInfo: function () {
        return this.tryGetUDValue("vipInfo", {});
    },

    /**
    * 传入键值，获取用户套餐配置值
    * @param {Number} _default 默认值
    * @returns {Number}
    */
    getCapacity: function (key, _default) {
        var map = {
            "diskfilesize": "DISK_1000001",
            "filesharecapacity": "DISK_1000002",
            "filesharesavedays": "DISK_1000003",

            "transcribetimelen": "MAIL_2000001",
            "mailgsendlimit": "MAIL_2000002",
            "maildaylimit": "MAIL_2000003",
            "addrstorenum": "MAIL_2000004",
            "maxannexsize": "MAIL_2000005",

            "vipidentity": "MAIL_2000006",
            "letterpaperid": "MAIL_2000007",
            "congracardid": "MAIL_2000008",
            "postcardid": "MAIL_2000009",
            "dermaid": "MAIL_2000010"
        };

        _default = typeof (_default) == "undefined" ? 0 : Number(_default);

        var max = _default;

        var vipinfo = this.getVipInfo();
        if (vipinfo[map[key]]) {
            max = parseInt(vipinfo[map[key]], 10);
        }

        if (isNaN(max)) {
            max = _default;
        }

        return max;
    },

    /**
    *返回发邮件最大收件人个数，无数据返回50
    *@returns {Number}
    */
    getMaxSend: function () {
        var max = 50;

        max = this.getCapacity("mailgsendlimit", max);

        // 兼容代码，服务端vipinfo返回失败时，不至出错。
        if (max < 50) {
            max = 50;
        }

        var serviceItem = $User.getServiceItem();
        if (max < 100 && serviceItem == this.levelEnum.vip5) {
            max = 100;
        } else {
            if (max < 100 && serviceItem == this.levelEnum.vip20) {
                max = 200;
            }
        }

        return max;
    },

    /**
    * 返回通讯录套餐联系人上限
    * @return {Number}
    */
    getMaxContactLimit: function () {
        var max = 3000;

        max = this.getCapacity("addrstorenum", max);

        if (max < 3000) {
            max = 3000;
        }

        var serviceItem = $User.getServiceItem();
        if (max < 3000 && serviceItem == this.levelEnum.vip5) {
            max = 6000;
        } else {
            if (max < 3000 && serviceItem == this.levelEnum.vip20) {
                max = 6000;
            }
        }

        //如果调用时，通讯录数据已加载，则该规则生效。
        //如果免费用户现有人数已超3000，则将上限放宽至4000
        var _model = $App.getModel("contacts");
        if (_model) {
            var _count = _model.getContactsCount();
            if (_count > 3000 && max < 4000) {
                max = 4000;
            }
        }

        return max;
    },

    /**
    *获得群邮件数据,无数据返回null
    *@returns {Object}
    */
    getGroupMailInfo: function () {
        return this.tryGetUDValue("groupMailInfo", null);
    },

    /**
    *返回用户发件人姓名，异常返回""
    *@returns {String}
    */
    getTrueName: function () {
        return this.tryGetUAttrValue("trueName", "");
    },
    getSendName: function () {
        var name = this.getTrueName() || this.getAliasName().replace(/@.+/, "") || this.getUid().replace(/^86/, "");
        return name;
    },
    /**
    *返回高级搜索是否开通 1|0，异常返回0
    *@returns {Number}
    */
    getFtsflag: function () {
        return this.tryGetUAttrValue("fts_flag", 0);
    },

    /**
    *返回默认每页显示邮件数，无数据返回默认值20
    *@returns {Number}
    */
    getDefaultPageSize: function () {
        return this.tryGetUAttrValue("defaultPageSize", 20);
    },
	
    /**
    *返回默认邮件列表密度
    *@returns {Number}
    */
    getPageStyle: function () {
		var val = $App.getCustomAttrs('pageStyle') || 1;
        return this.getPageStyleByKey(val);
    },	
	
    /**
    *返回默认邮件列表密度，无数据返回1(适中)
    *@returns {Number}
    */
    getPageStyleByKey: function (key) {
		var map = {
			'3':' td-small',
			'1':'',
			'2':' td-big'
		}
		return map[key] || '';
    },	
	
    /**
    *获取是否带原邮件回复:0或1，无数据返回默认值1
    *@returns {Number}
    */
    getReplyWithQuote: function () {
        return this.tryGetUAttrValue("replyWithQuote", 0);
    },

    /**
    *获得“邮件到达通知”配置数据，无数据返回null
    *@returns {Object}
    */
    getMailNotifyInfo: function () {
        return this.tryGetPDataValue("mailNotifyInfo", null);
    },
    /**
    *获得“邮箱伴侣”是否开通,这里返回字符串的"true"和"false" =_=
    *@returns {String}
    */
    getPartner: function () {
        return this.tryGetPDataValue("partner", "false");
    },

    /**
    *获得PushEmail是否开通,这里返回字符串的"true"和"false" =_=
    *@returns {String}
    */
    getPushemail: function () {
        return this.tryGetPDataValue("pushemail", "false");
    },

    /**
    *获得短彩信赠送、已发条数信息对象，无数据返回null
    *@returns {Object}
    */
    getSmsMMsInfo: function () {
        return $App.getConfig("PersonalData").smsMMsInfo || null
    },

    /**
    *获得自写彩信赠送条数，无数据返回""
    *@returns {String}
    */
    getPresentMmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "PresentMmsCount", "");
    },

    /**
    *获得自写短信赠送条数，无数据返回""
    *@returns {String}
    */
    getPresentSmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "PresentSmsCount", "");
    },

    /**
    *获得自写彩信已用条数，无数据返回""
    *@returns {String}
    */
    getUsedMmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "UsedMmsCount", "");
    },
    getFreeSmsCount: function () {
        var count = this.getPresentSmsCount() - this.getUsedSmsCount();
        return count >= 0 ? count : 0;
    },
    getFreeMmsCount: function () {
        var count = this.getPresentMmsCount() - this.getUsedMmsCount();
        return count >= 0 ? count : 0;
    },
    needMailPartner: function () {
        var provCode = top.$User.getProvCode();
        if (provCode == 1 || provCode == 10 || provCode == 7) {
            return this.getPartner() == "false";

        } else {
            return false;
        }

    },
    /**
    *获得自写短信已用条数，无数据返回""
    *@returns {String}
    */
    getUsedSmsCount: function () {
        return this.tryGetObjectValue(this.getSmsMMsInfo(), "UsedSmsCount", "");
    },

    /**
    *获得用户的邮箱概要信息：已用空间、文件夹个数、未读邮件数
    *@returns {Object}
    */
    getMessageInfo: function () {
        return $App.getConfig("MessageInfo") || null;
    },

    /**
    *获得用户的邮箱概要信息：文件夹个数，无数据返回""
    *@returns {String}
    */
    getFolderCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "folderCount", "");
    },

    /**
    *获得用户的邮箱概要信息：获取邮箱容量，无数据返回""
    *@returns {String}
    */
    getLimitMessageSize: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "limitMessageSize", "");
    },

    /**
    *获得用户的邮箱概要信息：获取邮件总数，无数据返回""
    *@returns {String}
    */
    getMessageCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "messageCount", "");
    },

    /**
    *获得用户的邮箱概要信息：获取已用邮件容量，无数据返回""
    *@returns {String}
    */
    getMessageSize: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "messageSize", "");
    },

    /**
    *获得用户的邮箱概要信息：获取未读邮件总数，无数据返回""
    *@returns {String}
    */
    getUnreadMessageCount: function () {
        return this.tryGetObjectValue(this.getMessageInfo(), "unreadMessageCount", "");
    },



    /**
    *当前用户等级
    *@returns {string} 等级字符串
    */
    getUserLevel: function () {
        var serviceItem = this.getServiceItem();
        for (var e in this.levelEnum) {
            if (serviceItem && $.trim(serviceItem).toLowerCase() == $.trim(this.levelEnum[e]).toLowerCase()) {
                return serviceItem;
            }
        }
        //没有找到套餐定义，则返回免费用户
        return this.levelEnum.free0010;
    },
    getServerTime: function () {
        /*if ($App.getConfig("PersonalData")) {
        return $App.getConfig("PersonalData").serverDateTime;
        } else {
        return new Date();
        }*/
    },
    /**
    *得到等级字符
    *@param {string} type 标识如何组合vip字符
    *@returns {string} 等级字符串
    */
    getVipStr: function (type) {
        switch (type) {
            case "5,20":
                return this.levelEnum.vip5 + "," + this.levelEnum.vip20;
            case "20":
                return this.levelEnum.vip20;
            default:
                return this.levelEnum.free0010 + "," + this.levelEnum.free0015 + "," + this.levelEnum.vip5 + "," + this.levelEnum.vip20;
        }
    },

    /**
    *单元测试接口
    *@inner
    */
    unitTest: function () {
        for (var func in this) {
            if (func.indexOf("get") == 0 && _.isFunction(this[func])) {
                console.log(func + ":" + this[func]());
            }
        }
    }
}));

window.$User = new M2012.UserModel();
})(jQuery, _, M139);