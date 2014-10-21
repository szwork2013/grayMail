/*global Backbone: false */

/**
  * @fileOverview 定义通讯录数据实体类
  */

(function (jQuery,_,M139){
    var $ = jQuery;
    var inM2012 = false;
    /**通讯录数据实体
    *@constructs M2012.Contacts.ContactsInfo
    */
    function ContactsInfo(options) {
        for (var p in options) {
            this[p] = options[p] || "";
        }
        var emails = this.emails = [];
        var mobiles = this.mobiles = [];
        var faxes = this.faxes = [];
        if (!this.name) this.name = (this.AddrFirstName || "") + (this.AddrSecondName || "");
        this.lowerName = this.name.toLowerCase();
        if (this.FamilyEmail) emails.push(this.FamilyEmail);
        if (this.OtherEmail) emails.push(this.OtherEmail);
        if (this.BusinessEmail) emails.push(this.BusinessEmail);

        if (this.MobilePhone) mobiles.push(this.MobilePhone);
        if (this.OtherMobilePhone) mobiles.push(this.OtherMobilePhone);
        if (this.BusinessMobile) mobiles.push(this.BusinessMobile);

        if (this.OtherFax) faxes.push(this.OtherFax);
        if (this.FamilyFax) faxes.push(this.FamilyFax);
        if (this.BusinessFax) faxes.push(this.BusinessFax);
        if (!inM2012) {
            inM2012 = Boolean(top.$App);
        }
        if (inM2012) {
            this.fixPhoto();
        }
    }
    var defPhoto;
    var sysImgPath = ["/upload/photo/system/nopic.jpg", "/upload/photo/nopic.jpg"];
    var baseUrl;
    ContactsInfo.prototype =
        /**
        *@lends M2012.Contacts.ContactsInfo.prototype
        */
    {
        getMobileSendText: function () {
            var n = this.getFirstMobile();
            n = n && n.replace(/\D/g, "");
            if (!n) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + n + ">";
        },
        getEmailSendText: function () {
            var e = this.getFirstEmail();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFaxSendText: function () {
            var e = this.getFirstFax();
            if (!e) return "";
            var name = this.name.replace(/"/g, "");
            return "\"" + name + "\"<" + e + ">";
        },
        getFirstEmail: function () {
            if (this.emails && this.emails[0]) return this.emails[0];
            return "";
        },
        getFirstMobile: function () {
            if (this.mobiles && this.mobiles[0]) return this.mobiles[0];
            return "";
        },
        getFirstFax: function () {
            if (this.faxes && this.faxes[0]) return this.faxes[0];
            return "";
        },
        /**
         *模糊搜索
         */
        match: function (keyword) {
            return [
            this.name,
            this.BusinessEmail,
            this.BusinessFax,
            this.BusinessMobile,
            this.CPName,
            this.FamilyEmail,
            this.FamilyFax,
            this.FirstNameword,
            this.Jianpin,
            this.MobilePhone,
            this.OtherEmail,
            this.OtherFax,
            this.OtherMobilePhone,
            this.Quanpin,
            this.UserJob].join("").toLowerCase().indexOf(keyword) > -1;
        },
        fixPhoto: function () {
            if (this.ImagePath) return;
            if (!defPhoto) {
                defPhoto = $App.getResourcePath() + "/images/face.png";
				/*不再用g2的域名访问地址
                baseUrl = M139.Text.Url.makeUrl(getDomain("webmail") + "/addr/apiserver/httpimgload.ashx", {
                    sid: $App.getSid()
                });
				*/
				//
				function getPhotoUploadedAddr() {
						var tmpurl = location.host;
						var url2 = "";
						if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
							url2 = "http://image0.139cm.com";
						} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
							url2 = "http://images.139cm.com";
						} else if (tmpurl.indexOf("10086ts") > -1) {
							url2 = "http://g2.mail.10086ts.cn";
						}else if(tmpurl.indexOf("10086rd") > -1){
							url2 = "http://static.rd139cm.com";
						}
						return url2 ;
				}
				baseUrl = getPhotoUploadedAddr()
            }
            if (this.ImageUrl) {
                if (this.ImageUrl.indexOf("http://") == 0) {
                    return;
                }
                this.ImagePath = this.ImageUrl;
            //  var path = this.ImagePath.toLowerCase(); 不能转大小写
				var path = this.ImagePath;
                if (path == sysImgPath[0] || path == sysImgPath[1] || path == "") {
                    this.ImageUrl = defPhoto;
                }else{
                //    this.ImageUrl = baseUrl + "&path=" + encodeURIComponent(path);不需要编码
					this.ImageUrl = baseUrl + path + "?rd=" + Math.random();
                }
            } else {
                this.ImageUrl = defPhoto;
                this.ImagePath = "/upload/photo/nopic.jpg";
            }
        }
    }
    M139.namespace("M2012.Contacts.ContactsInfo", ContactsInfo);



})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义通讯录数据管理模块
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var isFirstLoadQueryUserInfo = true;
    M139.namespace("M2012.Contacts.Model", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.prototype*/
    {

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model
        */
        initialize: function (options) {
            this.initEvents();
        },

        /**
         *@inner
         */
        getUserNumber: function () {
            return top.$User.getUid();
        },

        /**
         *加载通讯录数据
         */
        loadMainData: function (options, callback) {
            options = options || {};
            var This = this;
            this.isLoading = true;

            //options.testUrl = "/m2012/js/test/html/contactsData.js";//用测试数据
            if (options.testUrl) {
                //测试数据
                $.get(options.testUrl, function (responseText) {
                    This.onMainDataLoad(M139.JSON.tryEval(responseText), callback);
                });
            } else {
                var requestData = {
                    GetUserAddrJsonData: {
                        //UserNumber: this.getUserNumber()
                    }
                };
                M2012.Contacts.API.call("GetUserAddrJsonData", requestData,
                    function (e) {
                        This.isLoading = false;
                        if (e) {
                            if (e.responseData) {
                                if (e.responseData.ResultCode == "0") {
                                    This.onMainDataLoad(e.responseData, callback);
                                } else if (e.responseData.ResultCode == "216") {
                                    $App.trigger("change:sessionOut", {}, true);
                                } else {
                                    M139.Logger.getDefaultLogger().error('addrsvr response error', e.responseData);
                                }
                            } else {
                                M139.Logger.getDefaultLogger().error('addrsvr response invalid', e.responseText);
                            }
                        } else {
                            M139.Logger.getDefaultLogger().error('addrsvr response empty');
                        }
                    }
                );
            }
        },


        loadQueryUserInfo: function (callback) {
            if (SiteConfig.m2012NodeServerRelease && $App.isShowWelcomePage() && isFirstLoadQueryUserInfo) {
                //第一次加载读欢迎页内联json
                var data = getWelcomeInlinedJSON();
                if (data) {
                    setTimeout(function () {
                        inlinedCallback(data, true);
                    }, 0);
                } else {
                    $App.on("welcome_QueryUserInfo_load", function (data) {
                        inlinedCallback(data, true);
                    });
                }
            } else {
                var client = new M139.ExchangeHttpClient({
                    name: "ContactsLoadMainDataHttpClient",
                    responseDataType: "JSON2Object"
                });
                client.on("error", function(e) {
                    if (options && _.isFunction(options.error)) {
                        options.error(e);
                    }
                });
                var reqData = "<QueryUserInfo><UserNumber>" + $User.getUid() + "</UserNumber></QueryUserInfo>";
                client.request(
                {
                    method: "post",
                    url: "/addrsvr/QueryUserInfo?sid=" + $App.query.sid + "&formattype=json",
                    data: reqData
                }, callback);
            }
            isFirstLoadQueryUserInfo = false;
            function inlinedCallback(data, todoClone) {//TODO Clone
                if (todoClone) {
                    data = $App.deepCloneJSON(data);
                }
                callback({
                    responseData: data
                });
                inlinedCallback = new Function();//防止欢迎页和页面自己加载的调用2次回调
            }
            function getWelcomeInlinedJSON() {
                var json = null;
                try {
                    json = document.getElementById("welcome").contentWindow.inlinedQueryUserInfoJSON;
                } catch (e) { }
                return json;
            }
        },

        //获取个人资料
        getUserInfo: function (options, callback) {
            var self = this;            
            if (!top.$User) {
                return;
            }
            
            options = options || {};
            
            //options.refresh true  每次都刷新数据
            if(self.UserInfoData && !options.refresh){
                if (callback && typeof (callback) == "function") {
                    try {
                        callback(self.UserInfoData);
                        return;
                    } catch (ex) {}
                }
            }

            self.getUserInfoWaiting = true;
            this.loadQueryUserInfo(
                function (e) {
                    if (e && e.responseData) {
                        var code = e.responseData.ResultCode;
                        var data = {
                            "code": "S_FALSE", //这是取缓存验证用户失败时默认的返回code
                            "ResultCode": code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }
                            data = {
                                "code": "S_OK",
                                "var": self.userInfoTranslate(e.responseData["UserInfo"][0])
                            };
                        }
                        self.UserInfoData = data;
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                    self.getUserInfoWaiting = false;
                }
            );
        },
        contactRequest:function(apiName,options,callback){
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });
            if (!options) { options = {}; }
            options.UserNumber = top.$User.getUid();
            var reqData = {};
            reqData[apiName]= options

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/"+apiName+"?sid=" + top.$App.query.sid + "&formattype=json",
                    data: reqData
                },
                function (e) {
                    if (callback) {callback(e); }
                }
            );
        },
        //修改个人资料
        modifyUserInfo: function (userInfo, callback) {
			var self = this;
            this.contactRequest("ModUserInfo", userInfo, function (e) {
				self.UserInfoData = null;
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });
        },
        modifyGroup:function(options,callback){
            //<EditGroupList><UserNumber>8613590330157</UserNumber><GroupId>1171021884</GroupId><SerialId>1025214752</SerialId><GroupType>1</GroupType></EditGroupList>
            this.contactRequest("EditGroupList", options, function (e) {
                if (e && e.responseData) {
                    if (callback) {
                        callback(e.responseData);
                    }
                }
            });

        },
        userInfoTranslate: function (UserInfo) {
            var map = {
                "a": "UserType",
                "b": "SourceType",
                "c": "AddrFirstName",
                "d": "AddrSecondName",
                "e": "AddrNickName",
                "f": "UserSex",
                "g": "CountryCode",
                "h": "ProvCode",
                "i": "AreaCode",
                "j": "CityCode",
                "k": "StreetCode",
                "l": "ZipCode",
                "m": "HomeAddress",
                "n": "MobilePhoneType",
                "o": "BirDay",
                "p": "MobilePhone",
                "q": "BusinessMobile",
                "r": "BusinessPhone",
                "s": "FamilyPhone",
                "t": "BusinessFax",
                "u": "FamilyFax",
                "v": "OtherPhone",
                "w": "OtherMobilePhone",
                "x": "OtherFax",
                "y": "FamilyEmail",
                "z": "BusinessEmail",
                "c2": "OtherEmail",
                "c3": "PersonalWeb",
                "c4": "CompanyWeb",
                "c5": "OtherWeb",
                "c6": "OICQ",
                "c7": "MSN",
                "c8": "OtherIm",
                "c9": "CPCountryCode",
                "d0": "CPProvCode",
                "d1": "CPAreaCode",
                "a0": "CPCityCode",
                "a1": "CPStreetCode",
                "a2": "CPZipCode",
                "a3": "CPAddress",
                "a4": "CPName",
                "a5": "CPDepartName",
                "a6": "Memo",
                "a7": "ContactCount",
                "a8": "ContactType",
                "a9": "ContactFlag",
                "b0": "SynFlag",
                "b1": "SynId",
                "b2": "RecordSeq",
                "b3": "FirstNameword",
                "b4": "CountMsg",
                "b5": "StartCode",
                "b6": "BloodCode",
                "b7": "StateCode",
                "b8": "ImageUrl",
                "b9": "SchoolName",
                "c0": "BokeUrl",
                "c1": "UserJob",
                "e1": "FamilyPhoneBrand",
                "e2": "BusinessPhoneBrand",
                "e3": "OtherPhoneBrand",
                "e4": "FamilyPhoneType",
                "e5": "BusinessPhoneType",
                "e6": "OtherPhoneType",
                "e7": "EduLevel",
                "e8": "Marriage",
                "e9": "NetAge",
                "e0": "Profession",
                "f1": "Income",
                "f2": "Interest",
                "f3": "MoConsume",
                "f4": "ExpMode",
                "f5": "ExpTime",
                "f6": "ContactMode",
                "f7": "Purpose",
                "f8": "Brief",
                "f9": "FavoEmail",
                "f0": "FavoBook",
                "g1": "FavoMusic",
                "g2": "FavoMovie",
                "g3": "FavoTv",
                "g4": "FavoSport",
                "g5": "FavoGame",
                "g6": "FavoPeople",
                "g7": "FavoWord",
                "g8": "Character",
                "g9": "MakeFriend",
                "ui": "UserInfo",
                "un": "UserNumber",
                "sd": "SerialId",
                "gd": "GroupId",
                "gp": "Group",
                "gi": "GroupInfo",
                "ct": "Contacts",
                "ci": "ContactsInfo",
                "gl": "GroupList",
                "li": "GroupListInfo",
                "tr": "TotalRecord",
                "rc": "ResultCode",
                "rm": "ResultMsg",
                "gn": "GroupName",
                "cn": "CntNum",
                "ri": "RepeatInfo",
                "lct": "LastContacts",
                "lctd": "LastContactsDetail",
                "lci": "LastContactsInfo",
                "cct": "CloseContacts",
                "cci": "CloseContactsInfo",
                "an": "AddrName",
                "at": "AddrType",
                "ac": "AddrContent",
                "us": "UserSerialId",
                "ai": "AddrId",
                "lid": "LastId",
                "ate": "AddrTitle",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "cf": "ComeFrom",
                "cte": "CreateTime",
                "trg": "TotalRecordGroup",
                "trr": "TotalRecordRelation",
                "Bct": "BirthdayContacts",
                "bci": "BirthdayContactInfo"
            }
            var result = {};
            for (elem in UserInfo) {
                if (map[elem]) {
                    result[map[elem]] = UserInfo[elem];
                }
            }
            return result;
        },
        //获取隐私设置
        getPrivateSettings: function (callback) {
            if (!window.$User) {
                return;
            }

            var self = this;
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                responseDataType: "JSON2Object"
            });

            var reqData = "<GetPrivacySettings><UserNumber>" + $User.getUid() + "</UserNumber></GetPrivacySettings>";

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/GetPrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {

                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var code = respData.ResultCode;
                        var data = {
                            "code": "S_FALSE" //这是取缓存验证用户失败时默认的返回code
                        };
                        if (code == "0") {
                            //返回报文：QueryUserInfoResp={"ResultCode":"0","ResultMsg":"Operate successful","UserInfo":[{"un":"8613911111115","b":"19","c":"\u5f20","d":"\u4e09\u4e30","e":"2323","f":"1","h":"西藏","i":"拉萨市","k":"试试11","l":"518007","m":"长虹科技大厦的份上","n":"0","p":"13911111115","r":"13911111115","s":"0756626262","t":"435435341","v":"07552566251","y":"zhumy@rd139.com","c8":"1391111111","a2":"5180071","a3":"长虹大厦发送地方实得分","a4":"彩讯科技公司","b3":"Z","b8":"\/Upload\/Photo\/139111\/139111111\/13911111115\/20120808173757.gif","c1":"前端工程师","e7":"2","e8":"0","f2":"5522","f7":"game","f8":"8","g7":"111","g8":"111111111111111111"}]}
                            //var userInfo = self.userInfoTranslate(e.responseData["UserInfo"][0]);
                            //console.log(userInfo);
                            //if (callback) { callback(userInfo); }

                            data = {
                                "code": "S_OK",
                                "var": {
                                    "addMeRule": respData.WhoAddMeSetting,
                                    "UserInfoSetting": respData.UserInfoSetting //这个是一个对象
                                }
                            };
                        }
                        if (callback && typeof (callback) == "function") {
                            try {
                                callback(data);
                            } catch (ex) {
                                
                            }
                        }
                    }
                }
            );
        },

        //更新隐私设置
        //注意：经测试，如果UserInfoSetting未传递所有值，则未传递的值默认设置为“仅好友可见”，值为0
        //建议暂不使用此接口设置数据
        /*
        options={
              UserNumber:8613800138000, //此字段可忽略，会自动添加
              WhoAddMeSetting:0,
              UserInfoSetting:{
                AddrFirstName:0,
                UserSex:0,
                BirDay:0,
                ImageUrl:0,
                FamilyEmail:0,
                MobilePhone:0,
                FamilyPhone:0,
                OtherIm:0,
                HomeAddress:0,
                CPName:0,
                UserJob:0,
                BusinessEmail:0,
                BusinessMobile:0,
                BusinessPhone:0,
                CPAddress:0,
                CPZipCode:0
              }
            }
        */
        updatePrivateSettings: function (options, callback) {
            var client = new M139.ExchangeHttpClient({
                name: "ContactsLoadMainDataHttpClient",
                requestDataType: "ObjectToXML2",
                responseDataType: "JSON2Object"
            });

            var UserNumber = $User.getUid();
            var reqData = { "UserNumber": UserNumber }; //默认加上号码
            reqData = { "SavePrivacySettings": $.extend(reqData, options) };

            client.request(
                {
                    method: "post",
                    url: "/addrsvr/SavePrivacySettings?sid=" + $App.query.sid,
                    data: reqData
                },
                function (e) {
                    if (e && e.responseData) {
                        var respData = e.responseData;
                        var result = {
                            "code": (respData.ResultCode == "0" ? "S_OK" : respData.ResultCode) || "FS_UNKNOWN",
                            "var": {
                                "msg": respData.ResultMsg || ""
                            }
                        };

                        if (callback) {
                            callback(result);
                        }
                    }
                }
            );
        },
        /**
         *获取通讯录数据
         */
        requireData: function (callback) {
            var data = this.get("data");
            if (data) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (!this.isLoading) {
                    this.loadMainData();
                }
                this.on("maindataload", function (data) {
                    this.off("maindataload", arguments.callee);
                    if (callback) {
                        setTimeout(function () {
                            callback(data);
                        }, 0);
                    }
                });
            }
        },

        /**通讯是否已加载*/
        isLoaded: function () {
            return !!this.get("data");
        },

        /**
         *通讯录数据加载完成后处理数据
         *@inner
         */
        onMainDataLoad: function (json, callback) {
            json.Groups = json.Group || json.Groups;

            //后台不输出数组的时候容错
            if (!json.LastContacts) json.LastContacts = [];
            if (!json.CloseContacts) json.CloseContacts = [];
            if (!json.BirthdayContacts) json.BirthdayContacts = [];
            if (!json.Contacts) json.Contacts = [];
            if (!json.Groups) json.Groups = [];
            if (!json.GroupMember) json.GroupMember = {};
            if (!json.NoGroup) json.NoGroup = [];

            json.TotalRecord = parseInt(json.TotalRecord);
            json.TotalRecordGroup = parseInt(json.TotalRecordGroup);
            json.TotalRecordRelation = parseInt(json.TotalRecordRelation);
            json.userSerialId = json.UserSerialId;

            var exports = {
                TotalRecord: json.TotalRecord,
                TotalRecordGroup: json.TotalRecordGroup,
                TotalRecordRelation: json.TotalRecordRelation,
                noGroup: json.NoGroup
            };

            //分组
            this.createGroupData({
                data: json,
                exports: exports
            });

            //联系人
            this.createContactsData({
                data: json,
                exports: exports
            });

            //组关系
            this.createGroupMemberData({
                data: json,
                exports: exports
            });
            //处理最近、紧密联系人
            this.createLastAndCloseContactsData({
                data: json,
                exports: exports
            });

            //处理生日联系人
            this.createBirthdayContactsData({
                data: json,
                exports: exports
            });
            
            //处理VIP联系人
            this.createVIPContactsData({
                data: json,
                exports: exports
            });
            
            //处理用户个人资料  QueryUserInfo合并至GetUserAddrJsonData接口输出
            if(json["UserInfo"] && json["UserInfo"][0]){
                this.UserInfoData = {
                    "code": "S_OK",
                    "var": this.userInfoTranslate(json["UserInfo"][0])
                };
            }

            this.set("data", exports);
            this.trigger("maindataload", exports);
            if (callback) callback(exports);
        },

        /**
         *加载通讯录主干数据后处理分组数据
         *@inner
         */
        createGroupData: function (options) {
            if (options.append) {
                //添加新组后更新缓存
                var data = this.get("data");
                var groups = data.groups;
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                var newGroup = {
                    GroupId: options.append.groupId,
                    id: options.append.groupId,
                    GroupName: options.append.groupName,
                    name: options.append.groupName,
                    CntNum: 0,
                    count: 0
                };
                groups.push(newGroup);
                groupsMap[newGroup.id] = newGroup;
                groupMember[newGroup.id] = [];
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataGroups = data.Groups;
                var groups = new Array(dataGroups.length);
                var groupsMap = {};
                for (var i = 0, len = dataGroups.length; i < len; i++) {
                    var g = dataGroups[i];
                    groupsMap[g.gd] = groups[i] = {
                        GroupId: g.gd,
                        id: g.gd,
                        GroupName: g.gn,
                        name: g.gn,
                        CntNum: g.cn,
                        count: g.cn
                    };
                }
                exports.groups = groups;
                exports.groupsMap = groupsMap;
            }
        },

        /**
         *加载通讯录主干数据后处理联系人数据
         *@inner
         */
        createContactsData: function (options) {
            if (options.remove) {
                var data = this.get("data");
                var serialId = options.serialId;
                delete data.contactsMap[serialId];
                delete data.contactsIndexMap[serialId];
                var contacts = data.contacts;
                for (var i = contacts.length - 1; i >= 0; i--) {
                    if (contacts[i].SerialId == serialId) {
                        contacts.splice(i, 1);
                        break;
                    }
                }
                data.emailHash = null;//清除字段缓存
            } else if (options.append) {
                var data = this.get("data");
                var newContacts = options.append;
                var contacts = data.contacts;
                var contactsMap = data.contactsMap;
                var contactsIndexMap = data.contactsIndexMap;
                var nogroup = data.noGroup;
                for (var i = 0; i < newContacts.length; i++) {
                    var c = newContacts[i];
                    c.Quanpin = c.FullNameword || "";
                    c.Jianpin = c.FirstWord || "";

                    var info = new M2012.Contacts.ContactsInfo(c);
                    contacts[contacts.length] = info;
                    contactsMap[info.SerialId] = info;
                    contactsIndexMap[info.SerialId] = contacts.length;
                }
                data.emailHash = null;//清除字段缓存
                data.TotalRecord += newContacts.length;
            }else{
                var exports = options.exports;
                var data = options.data;
                var dataContacts = data.Contacts

                var contacts = new Array(dataContacts.length);
                var contactsMap = {};
                var contactsIndexMap = {};

                var csClass = M2012.Contacts.ContactsInfo;
                for (var i = 0, len = dataContacts.length; i < len; i++) {
                    var c = dataContacts[i];
                    var info = new csClass({
                        SerialId: c.sd,
                        AddrFirstName: c.c,
                        AddrSecondName: c.d,
                        MobilePhone: c.p,
                        BusinessMobile: c.q,
                        OtherMobilePhone: c.w,
                        FamilyEmail: (c.y || "").toLowerCase(),
                        BusinessEmail: (c.z || "").toLowerCase(),
                        OtherEmail: (c.c2 || "").toLowerCase(),
                        FirstNameword: (c.b3 || "").toLowerCase(),
                        FamilyFax: c.u,
                        BusinessFax: c.t,
                        OtherFax: c.x,
                        ImageUrl: c.b8,
                        Quanpin: (c.d2 || "").toLowerCase(),
                        Jianpin: (c.d3 || "").toLowerCase(),
                        CPName: c.a4,
                        UserJob: c.c1
                    });
                    contacts[i] = info;
                    contactsMap[c.sd] = info;
                    contactsIndexMap[c.sd] = i;
                }
                exports.contacts = contacts;
                exports.contactsMap = contactsMap;
                exports.contactsIndexMap = contactsIndexMap;
            }

            //刷新通讯录标签
            var addrtab = $App.getTabByName("addr");
            if (addrtab) {
                addrtab.isRendered = false;
            }
        },

        updateContactsData: function (options) {
            var data = this.get("data");
            var contactinfos = options.modification;
            var map = data.map || [];
            var contacts = data.contacts;
            var contactsMap = data.contactsMap;
            var groupsMap = data.groupsMap;

            var j, k, flag, groups = [];

            for (k = contactinfos.length; k--; ) {

                var info = new M2012.Contacts.ContactsInfo(contactinfos[k]);
                contactsMap[info.SerialId] = info;

                for (j = contacts.length; j--; ) {
                    if (contacts[j].SerialId == info.SerialId) {
                        contacts[j] = info;
                        break;
                    }
                }

                //删除现有map后重建关系
                groups.length = 0;
                for (j = map.length; j--; ) {
                    if (map[j].SerialId == info.SerialId) {
                        groups.push(map[j].GroupId);
                        map.splice(j, 1);
                    }
                }

                //先删除groups、groupsMap 的联系人数，注意groups是旧的组关系
                for (j = groups.length; j--; ) {
                    flag = groupsMap[groups[j]];
                    flag.count = parseInt(flag.count) - 1;
                    flag.CntNum = parseInt(flag.CntNum) - 1;
                }

                //重建map
                groups = info.GroupId.split(','); //groups有""的元素
                for (j = groups.length; j--; ) {
                    if (groups[j]) {
                        map.push({ SerialId: info.SerialId, GroupId: groups[j] });
                        flag = groupsMap[groups[j]];
                        flag.count = parseInt(flag.count) + 1;
                        flag.CntNum = parseInt(flag.CntNum) + 1;
                    }
                }

                //更新未分组
                for (j = data.noGroup.length; j--; ) {
                    if (data.noGroup[j] == info.SerialId) {
                        data.noGroup.splice(j, 1);
                        break;
                    }
                }

                if (groups.length == 0) {
                    data.noGroup.push(String(info.SerialId));
                    if (data.groupedContactsMap) {
                        delete data.groupedContactsMap[info.SerialId];
                    }
                } else {
                    if (data.groupedContactsMap) {
                        data.groupedContactsMap[info.SerialId] = 1;
                    }
                }

            }
            if(data.emailHash){//还要更新二级hash缓存
                if(info.emails && info.emails.length>0){
                    data.emailHash[info.emails[0]]=info;
                 }
            }
            groups.length = 0;
            groups = null;
        },


        /**
         *加载通讯录主干数据后处理联系人组关系数据
         *@inner
         */
        createGroupMemberData: function (options) {
            if (options.append) {
                //添加组关系缓存
                var appendItem = options.append;//格式为{SerialId:"",groups:[]}
                var groups = appendItem.GroupId;
                
                groups = groups.length == 0 ? [] : groups;
                groups = _.isString(groups) ? groups.split(",") : groups;

                var data = this.get("data");
                var groupsMap = data.groupsMap;
                var groupMember = data.groupMember;
                if (groups.length == 0) {
                    //如果没分组，联系人id添加到noGroup
                    data.noGroup.push(appendItem.SerialId);
                } else {
                    _.each(groups, function (gid) {
                        var gm = groupMember[gid];
                        if (_.isUndefined(gm)) {
                            data.groupMember[gid] = [];
                            gm = data.groupMember[gid];
                        }

                        gm.push(appendItem.SerialId);
                        groupsMap[gid].CntNum = gm.length;
                    });
                }
            } else {
                var data = options.data;
                var exports = options.exports;
                var contactsMap = exports.contactsMap;
                var groupsMap = exports.groupsMap;
                var groupMember = data.GroupMember;
                for (var gid in groupMember) {
                    var group = groupsMap[gid];
                    if (!group) {
                        if(/^\d+$/.test(gid)){
                            delete groupsMap[gid];//删除组脏数据
                        }
                    } else {
                        var members = groupMember[gid];
                        for (var i = 0; i < members.length; i++) {
                            if (!contactsMap[members[i]]) {
                                members.splice(i, 1);//删除联系人脏数据
                                i--;
                            }
                        }
                        group.CntNum = members.length;
                    }
                }
                exports.groupMember = groupMember;
            }
        },

        /**
         *加载通讯录主干数据后处理最近联系人和紧密联系人数据
         *@inner
         */
        createLastAndCloseContactsData: function (options) {
            if (options.append) {
                var data = this.get("data");

                var lastestContacts = data.lastestContacts;
                if (!$.isArray(lastestContacts)) {
                    return;
                }

                var items = options.append || [];
                for (var i = 0; i < items.length; i++) {
                    var l = items[i];
                    lastestContacts.unshift(l);
                }
                var map = {};
                //排除重复
                for (var i = 0; i < lastestContacts.length; i++) {
                    var l = lastestContacts[i];
                    if (map[l.AddrContent]) {
                        lastestContacts.splice(i, 1);
                        i--;
                    } else {
                        map[l.AddrContent] = 1;
                    }
                }
                if (lastestContacts.length > 50) {
                    lastestContacts.length = 50;
                }
            } else {
                var exports = options.exports;
                var data = options.data;
                var dataLastContacts = data.LastContacts;
                var dataCloseContacts = data.CloseContacts;
                var lastestContacts = [];
                var closeContacts = [];


                for (var i = 0, len = dataLastContacts.length; i < len; i++) {
                    var l = dataLastContacts[i];
                    if (typeof l.ac == "object") continue;//不懂？
                    lastestContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }

                for (var i = 0, len = dataCloseContacts.length; i < len; i++) {
                    var l = dataCloseContacts[i];
                    if (typeof l.ac == "object") continue;
                    closeContacts.push({
                        SerialId: l.sd,
                        AddrName: l.an,
                        AddrType: l.at,
                        AddrContent: l.ac
                    });
                }
                exports.lastestContacts = lastestContacts;
                exports.closeContacts = closeContacts;
            }
        },

        /**
         *加载通讯录主干数据后处理过生日的联系人数据
         *@inner
         */
        createBirthdayContactsData: function (options) {
            var exports = options.exports;
            var data = options.data;
            var dataBirContacts = data.BirthdayContacts;
            var birthdayContacts = new Array(dataBirContacts.length);
            for (var i = dataBirContacts.length - 1; i >= 0; i--) {
                var k = dataBirContacts[i];
                birthdayContacts[i] = {
                    SerialId: k.sd,
                    AddrName: k.an,
                    MobilePhone: k.p,
                    FamilyEmail: k.y,
                    BusinessEmail: k.z,
                    OtherEmail: k.c2,
                    BirDay: k.o
                };
            };
            exports.birthdayContacts = birthdayContacts;
        },

        /**
         *处理vip联系人数据
         *@inner
         */
        createVIPContactsData: function (options) {
            //"Vip":[{"vipg":"1158807544","vipc":"188722633,998324356","vipn":"2"}]
            var data = options.data;
            var exports = options.exports;
            var vipData = data.Vip && data.Vip[0];
            var vip = {};
            if (vipData) {
                try{
                    vip.groupId = vipData.vipg;
                    vip.contacts = vipData.vipc ? vipData.vipc.split(",") : [];
                } catch (e) {
                    //todo
                }
            }
            exports.vip = vip;
        },

        /**
         *根据联系人id获得对象
         *@param {String} cid 联系人id (SerialId)
         *@returns {M2012.Contacts.ContactsInfo} 返回联系人对象
         */
        getContactsById: function (cid) {
            return this.get("data").contactsMap[cid] || null;
        },
        /**
         *根据联系人id获取当前联系人的所有组
         *@param {String} cid 联系人id (SerialId)
         *@returns [] 返回联系人组
         */
        getContactsGroupById: function(cid){
            var groups = [];
            var member = this.get("data").groupMember;
            for(var key in member){
                if(member[key] && member[key].length > 0){
                    if(member[key].join(',').indexOf(cid) > -1){
                        groups.push(key);
                    }
                }
            }

            return groups;
        },
        /**
         *根据组id获得对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupById: function (gid) {
            return this.get("data").groupsMap[gid] || null;
        },

        /**
         *根据组名获得组对象
         *@param {String} gid 组id (groupId)
         *@returns {Object} 返回组对象
         */
        getGroupByName: function (groupName) {
            var groups = this.getGroupList();
            for (var i = 0, len = groups.length; i < len; i++) {
                var g = groups[i];
                if (g.name === groupName) {
                    return g;
                }
            }
            return null;
        },


        /**
         *获得联系人的分组id列表
         *@param {String} serialId 联系人id
         *@returns {Object} 返回组对象
         */
        getContactsGroupId: function (serialId) {
            var groupMember = this.get("data").groupMember;
            var groups = [];
            for (var gid in groupMember) {
                var members = groupMember[gid];
                for (var i = 0, len = members.length; i < len; i++) {
                    if (members[i] === serialId) {
                        groups.push(gid);
                        break;
                    }
                }
            }
            return groups;
        },

        /**
         *返回一个联系组的克隆列表
         *@returns {Array} 返回数组
         */
        getGroupList: function () {
            var groups = this.get("data");
            if (groups) {
                groups = groups.groups;
            }

            if (groups && _.isFunction(groups.concat)) {
                groups = groups.concat();
            } else {
                groups = [];
            }

            return groups;
        },
        /**
         *返回一个分组共有多少联系人，数据接口输出的有可能不准确，可纠正
         *@param {String} gid 组id (groupId)
         *@returns {Number} 返回组联系人个数
         */
        getGroupMembersLength: function (gid) {
            var group = this.getGroupById(gid);
            if (!group) {
                throw "M2012.Contacts.Model.getGroupContactsLength:不存在联系人分组gid=" + gid;
            }
            return group.CntNum;
        },
        /**
         *返回一个联系组的所有联系人id
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[seriaId,seriaId,seriaId]
         */
        getGroupMembersId: function (gid, options) {
            var result = this.getGroupMembers(gid, options);
            for (var i = 0, len = result.length; i < len; i++) {
                result[i] = result[i].SerialId;
            }
            return result;
        },
        /**
         *返回一个联系组的所有联系人列表
         *@param {String} gid 组id (groupId)
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选出有以下属性的联系人:email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        getGroupMembers: function (gid, options) {
            options = options || {};
            var filter = options.filter;                        
            var cData = this.get("data");
            var contactsMap = cData.contactsMap;
            var groupMember = cData.groupMember;
            var result = [];
            if (gid == this.getVIPGroupId()) {
                result = this.getVIPContacts();
            } else {
                var gm = groupMember[gid];
                if (gm) {
                    for (var i = 0, len = gm.length; i < len; i++) {
                        var cid = gm[i];
                        var c = contactsMap[cid];
                        if (c) {
                            result.push(c);
                        }
                    }
                }
            }
            if (options && options.filter) {
                result = this.filterContacts(result, { filter: options.filter, colate: options.colate });
            }
            return result;
        },
        /**获得vip联系人*/
        getVIPContacts: function () {
            var data = this.get("data");
            var result = [];
            var vip = data && data.vip;
            var contactsMap = data && data.contactsMap;
            if (vip && vip.contacts) {
                var contacts = vip.contacts;
                for (var i = 0; i < contacts.length; i++) {
                    var c = contacts[i];
                    var item = contactsMap[c];
                    if (item) {//vip联系人有可能被删除了
                        result.push(item);
                    }
                }
            }
            return result;
        },
        /**
         *获得vip分组id
         */
        getVIPGroupId: function () {
            var id = "";
            var data = this.get("data");
            if (data && data.vip) {
                id = data.vip.groupId;
            }
            return id;
        },

        /**
         *筛选联系人
         *@param {Array} contacts 要筛选的联系人
         *@param {Object} options 选项集
         *@param {String} options.filter 筛选属性：email|mobile|fax
         *@returns {Array} 返回组联系人id：[ContactsInfo,ContactsInfo,ContactsInfo]
         */
        filterContacts: function (contacts, options) {
            var filter = options.filter;
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (filter == "email" && c.getFirstEmail()) {
                    result.push(c);
                } else if (filter == "mobile" && c.getFirstMobile()) {
                    result.push(c);
                } else if (filter == "fax" && c.getFirstFax()) {
                    result.push(c);
                } else if (options.colate && c.getFirstEmail().indexOf(filter) > -1) {
                    result.push(c); //change by Aerojin 2014.06.09 过滤非本域用户
                }                
            }
            return result;
        },

        /**
         *绑定一些事件
         *@inner
         */
        initEvents:function(){
            var self = this;
            var E = "dataForMatch_email", M = "dataForMatch_mobile", F = "dataForMatch_fax";

            //清除用来做索引的缓存
            self.on("update", function (e) {
                if (e.type == "AddSendContacts" || e.type == "AddContacts" || e.type == "EditContacts") {
                    if (self.has(E)) {
                        self.unset(E);
                    }

                    if (self.has(M)) {
                        self.unset(M);
                    }

                    if (self.has(F)) {
                        self.unset(F);
                    }
                }
            });

            //重新加载联系人数据时，也清理做索引的缓存
            self.on("maindataload", function () {
                if (self.has(E)) {
                    self.unset(E);
                }

                if (self.has(M)) {
                    self.unset(M);
                }

                if (self.has(F)) {
                    self.unset(F);
                }
            });
        },

        //预先处理 合并最近联系人紧密联系人与常用联系人，排除重复
        getDataForMatch: function (filter) {
            var dataKey = "dataForMatch_" + filter;
            var data = this.get(dataKey);
            if (!data) {
                var contacts = this.filterContacts(this.get("data").contacts, {
                    filter: filter
                });
                data = getOldLinkManList(contacts, filter);
                this.set(dataKey, data);
            }
            return data;
            function getOldLinkManList(contacts, filter) {
                var key;
                if (filter == "email") {
                    key = "emails";
                } else if (filter == "fax") {
                    key = "faxes";
                } else if (filter == "mobile") {
                    key = "mobiles";
                }
                var linkManList = [];
                for (var i = 0, len = contacts.length; i < len; i++) {
                    var c = contacts[i];
                    var addrs = c[key];
                    for (var j = 0; j < addrs.length; j++) {
                        var addr = addrs[j];
                        linkManList.push({
                            name: c.name,
                            lowerName: c.lowerName,
                            addr: addr,
                            id: c.SerialId,
                            quanpin: c.Quanpin,
                            jianpin: c.Jianpin
                        });
                    }
                }
                return linkManList;
            }
        },
        /**
         *根据输入匹配联系人
         *@inner
         */
        getInputMatch: function (options) {
            var contacts = this.getDataForMatch(options.filter);
            var keyword = options.keyword;
            var len = contacts.length;
            var matches = [];
            var matchTable = {};
            var attrToNumber = {
                "addr": "01",
                "name": "02",
                "quanpin": "03",
                "jianpin": "04"
            }
            var numberToAttr = {
                "01": "addr",
                "02": "name",
                "03": "quanpin",
                "04": "jianpin"
            }
            var SPLIT_CHAR = "0._.0";//匹配键的分隔符
            //高性能哈希，匹配下标+匹配属性=key，value为匹配结果集合
            function pushMatch(attrName, index, arrIndex) {
                var matchKey = index + SPLIT_CHAR + attrName;
                if (index < 10) matchKey = "0" + matchKey;
                var arr = matchTable[matchKey];
                if (!arr) matchTable[matchKey] = arr = [];
                arr.push(arrIndex);
            }
            for (var i = 0; i < len; i++) {
                var item = contacts[i];
                //if (host.value.indexOf("<" + item.addr + ">") > 0) continue;
                var minIndex = 10000;
                var minIndexAttr = null;
                var index = item.addr.indexOf(keyword);
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.addr;
                }
                if (index == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
                index = item.lowerName.indexOf(keyword && keyword.toLowerCase());// update by tkh 用户输入的关键字统一转换成小写
                if (index != -1 && index < minIndex) {
                    minIndex = index;
                    minIndexAttr = attrToNumber.name;
                }
                if (minIndex == 0) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }

                if (!/[^a-zA-Z]/.test(keyword)) {
                    if (item.quanpin && item.jianpin) {
                        index = item.quanpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.quanpin;
                        }
                        if (minIndex == 0) {
                            pushMatch(minIndexAttr, minIndex, i);
                            continue;
                        }
                        index = item.jianpin.indexOf(keyword);
                        if (index != -1 && index < minIndex) {
                            minIndex = index;
                            minIndexAttr = attrToNumber.jianpin;
                        }
                    }
                }
                if (minIndexAttr) {
                    pushMatch(minIndexAttr, minIndex, i);
                    continue;
                }
            }

            var allMatchKeys = [];
            for (var p in matchTable) {
                allMatchKeys.push(p);
            }
            allMatchKeys.sort(function (a, b) {
                return a.localeCompare(b);
            });
            var MAX_COUNT = options.maxLength || 30;
            for (var i = 0; i < allMatchKeys.length; i++) {
                var k = allMatchKeys[i];
                var arr = matchTable[k];
                //从key中获取matchAttr和matchIndex，后面用于着色加粗
                var matchAttr = getAttrNameFromKey(k);
                var matchIndex = getMatchIndexFromKey(k);
                for (var j = 0; j < arr.length; j++) {
                    var arrIndex = arr[j];
                    matches.push({
                        info: contacts[arrIndex],
                        matchAttr: matchAttr,
                        matchIndex: matchIndex
                    });
                    if (matches.length >= MAX_COUNT) break;
                }
            }
            //var matchKey = index + SPLIT_CHAR + attrName;
            function getAttrNameFromKey(key) {
                return numberToAttr[key.split(SPLIT_CHAR)[1]];
            }
            function getMatchIndexFromKey(key) {
                return parseInt(key.split(SPLIT_CHAR)[0], 10);
            }
            return matches;
        },

        /**搜索联系人：姓名、拼音、传真、职位等
         *@param {String} keyword 搜索关键字
         *@param {Object} options 搜索选项集
         *@param {Array} options.contacts 要搜索的联系人集（否则是全部联系人）
         */
        search: function (keyword, options) {
            options = options || {};
            if (options.contacts) {
                var contacts = options.contacts;
            } else {
                var contacts = this.get("data").contacts;
                if (options.filter) {
                    contacts = this.filterContacts(contacts, { filter: options.filter });
                }
            }
            var result = [];
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                if (c.match(keyword)) {
                    result.push(c);
                }
            }
            return result;
        },
        /**
         *得到地址
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getAddr: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getEmail(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getNumber(text);
            }
            return "";
        },
        /**
         *得到名字
         *@param {String} text 要提取地址的文本
         *@param {String} addrType 要提取地址类型：email|mobile|fax
         */
        getName: function (text, addrType) {
            if (addrType == "email") {
                return M139.Text.Email.getName(text);
            } else if (addrType == "mobile") {
                return M139.Text.Mobile.getName(text);
            }
            return "";
        },

        /**
         *得到发送文本 "name"<addr>
         *@param {String} name 姓名
         *@param {String} addr 地址
         *@example
         var text = model.getSendText("李福拉","lifula@139.com");
         var text = model.getSendText("李福拉","15889394143");
         */
        getSendText: function (name, addr) {
            name = (name || "") && name.replace(/["\r\n]/g, " ");
            return "\"" + name + "\"<" + addr + ">";
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByEmail: function (email) {
            email = $Email.getEmailQuick(email);
            var item = this.getHashContacts()[email];
            if (item) {
                return [item];
            } else {
                return [];
            }
        },

        getHashContacts:function(){
            var data = this.get("data");
            if (!data) return {};
            if (!data.emailHash) {
                var contacts = data.contacts;
                var hash = {};
                if (contacts) {
                    for (var i = 0, len = contacts.length; i < len; i++) {
                        var c = contacts[i];
                        for (var j = 0; j < c.emails.length; j++) {
                            hash[c.emails[j]] = c;
                        }
                    }
                }
                data.emailHash = hash;
            }
            return data.emailHash || {};
        },

        /**
         *根据手机号获得联系人
         *@param {String} email 邮件地址
         *@returns {Array} 返回联系人数组
         */
        getContactsByMobile: function (mobile) {
            var data = this.get("data");
            var result = [];
            if (!data || !data.contacts) return result;
            for (var i = 0, contacts = data.contacts, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    if (c.mobiles[j] == mobile) {
                        result.push(c);
                    }
                }
            }
            return result;
        },

        /**
         *根据邮件地址获得联系人
         *@param {String} email 邮件地址
         *@returns {String} 返回联系人姓名，如果找不到，返回@前的账号部分
         */
        getAddrNameByEmail: function (email) {
            email = email.trim();
            var c = this.getContactsByEmail(email);
            if (c && c.length > 0) {
                return c[0].name;
            } else {
                var name = $Email.getNameQuick(email);
                if (name && name.replace(/['"\s]/g,"") != "") {
                    return name;
                } else {
                    name = email.replace(/<[^>]+>$/, "");
                    if (name && name.replace(/['"\s]/g, "") != "") {
                        return name;
                    } else {
                        return email;
                    }
                }
            }
        },

        /**
         *更新通讯录缓存数据
         */
        updateCache: function (options) {
            var type = options.type;
            switch (type) {
                case "AddGroup":
                    this.createGroupData({
                        append:options.data
                    });
                    break;
                case "DeleteContacts":
                    this.createContactsData({
                        remove:options.data
                    });
                    break;

                case "AddSendContacts":
                    //添加最近联系人
                    this.createLastAndCloseContactsData({
                        append: options.data.items
                    });
                    var newContacts = options.data.newContacts;
                    //添加新联系人
                    if (newContacts && newContacts.length > 0) {
                        this.createContactsData({
                            append:newContacts
                        });

                        for (var i = 0, m = newContacts.length; i < m; i++) {
                            this.createGroupMemberData({ append: newContacts[i] });
                        }
                    }

                    //if (c.GroupId) {
                    //    var groups = c.GroupId.split(','), group;
                    //    for (var j = groups.length; j--; ) {
                    //        group = data.groupMember[groups[j]];
                    //        if (group) {
                    //            group.push(info.SerialId);
                    //        }

                    //        group = data.groupsMap[groups[j]];
                    //        if (group) {
                    //            group.CntNum = Number(group.CntNum) + 1;
                    //            group.count = group.CntNum;
                    //        }
                    //    }
                    break;

                case "AddContacts":
                    this.createContactsData({
                        append: _.isArray(options.data) ? options.data : [options.data]
                    });
                    var data = _.isArray(options.data) ? options.data[0] : options.data;
                    if (data && data.GroupId) {
                        this.createGroupMemberData({
                            append: data
                        });
                    }
                    break;

                case "EditContacts":
                    this.updateContactsData({
                        modification: _.isArray(options.data) ? options.data : [options.data]
                    });
                    break;

            }

            /**服务端响应事件
            * @name M2012.Contacts.Model#update
            * @event
            * @param {Object} e 事件参数
            * @param {String} e.type 更新行为：AddGroup|AddContacts|EditGroup
            * @param {Object} e.data 更新的数据
            * @example
            model.on("update",function(e){
                console.log(e.type);
                console.log(e);
            });
            */
            this.trigger("update", options);

        },

        /**
         * 获取通讯录现有总条数
         * @param {Function} 回调函数，这是可等待数据加载成功后才给出的
         * @return {Number} 总条数，如果未加载到数据，则返回 -1
         */
        getContactsCount: function(callback) {

            if (callback) {
                M139.Timing.waitForReady('"undefined" !== typeof top.$App.getModel("contacts").get("data").contacts.length', function () {
                    callback(this.get("data").contacts.length);
                });
            }

            if (this.isLoaded()) {
                return this.get("data").contacts.length;
            } else {
                return -1;
            }
        }
    }));


    jQuery.extend(M2012.Contacts,
    /**@lends M2012.Contacts*/
    {
        /**返回一个M2012.Contacts.Model模块实例*/
        getModel: function () {

            if (window != window.top) {
                return top.M2012.Contacts.getModel();
            }

            if (!this.current) {
                this.current = new M2012.Contacts.Model();
            }
            return this.current;
        }

    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.InputSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.InputSuggest
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Function} options.onInput 捕获输入，该函数返回一个数组，表示要提示的项
        *@param {Function} options.onSelect 选择了其中一项（回车、或者鼠标点选）
        *@param {String} options.template 容器(提示菜单)的html模板
        *@param {String} options.itemTemplate
        *@param {String} options.itemPath
        *@param {String} options.itemInsertPath
        *@param {String} options.itemContentPath
        *@param {String} options.itemFocusClass
        *@example
        */
        initialize:function(options){
            options = _.defaults(options,DefaultStyle);

            var div = document.createElement("div");
            div.innerHTML = this.options.template;
            this.setElement(div.firstChild);

            this.onSelect = options.onSelect || this.onSelect;
            this.onInput = options.onInput || this.onInput;
            this.textbox = options.textbox;
            this.initEvent();

            superClass.prototype.initialize.apply(this,arguments);
        },

        /**@inner*/
        initEvent:function(){
            var options = this.options;
            var This = this;
            var jTb = jQuery(options.textbox);


            jTb.bind("keydown", function (e) {
                This.onTextBoxKeyDown(e);
            }).bind("change", function (e) {
                setTimeout(function () {
                    if (jTb.val() == "") {
                        This.hide();
                    }
                },10);
            });

            //由原本的监听keyup改为定时监控输入值
            M139.Timing.watchInputChange(options.textbox, function (e) {
                This.onTextBoxChange(e);
            });
            


            if (M139.Browser.is.ie) {
                //拖滚动条的时候阻止文本框失焦点
                this.$el.mousedown(function (e) {
                    jTb.attr("mode", "edit");
                    jTb.focus();
                }).mousemove(function () {
                    jTb.focus();
                });
            }else{
                jTb.bind("blur", function (e) {
                    This.hide();
                });
                this.$el.mousedown(function (e) {
                    //禁用默认事件，可以在鼠标拉滚动条的时候菜单不消失(ie除外)
                    M139.Event.stopEvent(e);
                });
            }
            $(document).click(function (e) {
                // e.target代表输入框
                // This.el代表自动提示层
                if (e.target != This.el) {
                    This.hide();
                }

                // 快捷创建日历弹出窗口中,出现自动补全提示框后如果直接用鼠标移动弹出窗口,操作停止后,应该直接出发textbox的blur方法
                // 否则点击取消按钮的话,会认为触发的是blur方法,导致窗口无法关闭
                // 如果鼠标点击的不是"点击参与人"的input也不是"点击参与人"所属的最外层DIV,就触发blur事件,暂时先这么处理
                if(!$(e.target).hasClass("addrText-input") && !$(e.target).hasClass("ItemContainer") && !$(e.target).hasClass("PlaceHold")) {
                    options.textbox && options.textbox.blur();
                }
            });
        },

        /**选中第几项（高亮),鼠标经过或者键盘选择*/
        selectItem:function(index){
            var item = typeof index == "number" ? this.getItem(index) : index;
            var last = this.getSelectedItem();
            if (last != null) this.utilBlurItem(last);
            this.utilFocusItem(item);

            var ele = item[0];
            this.utilScrollToElement(this.el,ele); //如果选中的项被遮挡的话则滚动滚动条
        },

        /**
         *获得需要滚动的元素
         *@inner
         */
        getScrollElement:function(){
            return this.el;
        },

        /**根据下标获得项*/
        getItem:function(index){
            return this.$el.find(this.options.itemPath+"[index='"+index+"']").eq(0);
        },

        /**获得当前提示的所有项*/
        getItems:function(){
            return this.$el.find(this.options.itemPath);
        },
        
        /**获得当前选中项*/
        getSelectedItem:function(){
            var sel = this.$el.find(this.options.itemPath+"[i_selected='1']");
            if(sel.length){
                return sel.eq(0);
            }else{
                return null;
            }
        },

        /**获得当前选中下标*/
        getSelectedIndex:function(){
            var item = this.getSelectedItem();
            if(item){
                return item.attr("index") * 1;
            }else{
                return -1;
            }
        },

        /**@inner*/
        onItemSelect:function(item){

            this.hide();

            var value = $(item).attr("data-value");
            if(jQuery.isFunction(this.onSelect)){
                this.onSelect(value);
            }

            this.textbox.value = value;

            this.textbox.setAttribute("mode", "");


            this.trigger("select",{value:value});
        },


        /**
         *显示提示列表,每次show默认会清除之前的item
         *@param {Array} list 提示数据项[{text:"",title:""}]
         */
        show:function(list){
            if (this.isShow) return;
            if (this.el.parentNode != document.body) {
                document.body.appendChild(this.el);
                //document.body.appendChild(bgIframe);
            }

            var This = this;
            
            this.clear();
            
            var options = this.options;
            for(var i=0,len = list.length;i<len;i++){
                var data = list[i];
                var item = jQuery(options.itemTemplate);
                item.attr("index",i);
                item.attr("data-value",data.value);
                item.find(options.itemContentPath).html(data.text);
                item.appendTo(this.$el.find(options.itemInsertPath));
                item.mousedown(onItemClick);
                item.mouseover(onItemMouseOver);
            }
            
            function onItemClick(){
                This.onItemSelect(this);
            }
            function onItemMouseOver(){
                This.selectItem(this.getAttribute("index")*1);
            }

            var offset = $(this.textbox).offset();
            var top = offset.top + $(this.textbox).height();
            var height = list.length > 8 ? "300px" : "auto";
            
            //会话邮件写信页
            if(/conversationcompose/i.test(window.location.href)){
                height = list.length > 5 ? "125px" : "auto";
            }

            this.$el.css({
                width: Math.max(this.textbox.offsetWidth, 400) + "px",
                height: height,
                overflowY: "auto",
                top: top,
                left: offset.left
            });

            //设置最高的建议浮层高度
            if (options.maxItem && options.maxItem > 0) {
                var maxLen = options.maxItem;
                var itemHeight = 24; //单个24px
                this.$el.css({
                    height: list.length > maxLen ? (itemHeight * maxLen) + "px" : "auto"
                });
            }

            this.selectItem(0); //显示的时候选中第一项
            this.isShow = true;
            superClass.prototype.show.apply(this,arguments);
        },

        /**隐藏菜单*/
        hide:function(){
            if (!this.isShow) return;
            this.el.style.display = "none";
            //bgIframe.style.display = "none";
            this.clear();
            this.isShow = false;
        },


        /**
         *修改选中项外观
         *@inner
         */
        utilFocusItem:function(item){
            item.attr("i_selected",1);
            item.css({
                backgroundColor: "#e8e8e8",//选中时候背景颜色,淡蓝色5D99CE
                color : "#666" // 字体颜色
            });
            //item.find("span").css("color", "white");
            item.find("span").css("color", "#666");
        },

        /**
         *修改失去焦点项外观
         *@inner
         */
        utilBlurItem:function(item){
            item.attr("i_selected",0);
            item.css({
                backgroundColor : "",
                color : ""
            });
            item.find("span").css("color", "");
        },

        /**
         *如果选中的项被遮挡的话则滚动滚动条
         *@inner
         */
        utilScrollToElement:function(container,element){
            var elementView = {
                top: this.getSelectedIndex() * $(element).height()
            };
            elementView.bottom = elementView.top + element.offsetHeight
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        },

        /**清除所有提示项*/
        clear:function(){
            var op = this.options;
            if(op.itemInsertPath){
                this.$el.find(op.itemInsertPath).html("");
            }else if(op.itemPath){
                this.$el.find(op.itemPath).remove();
            }
        },

        /**
         *监听到文本框值变化时触发，同时触发oninput
         *@inner
         */
        onTextBoxChange: function (evt) {
            var keys = M139.Event.KEYCODE;
            switch (evt && evt.keyCode) {
                //case keys.ENTER:
                case keys.UP:
                case keys.DOWN:
                case keys.LEFT:
                case keys.RIGHT: return;
            }
            this.hide();
            var items = this.onInput(this.options.textbox.value);

            if (items && items.length > 0) {
                this.show(items);
            }
        },

        /**
         *文本框键盘按下触发
         *@inner
         */
        onTextBoxKeyDown:function(evt){
            var This = this;
            var keys = M139.Event.KEYCODE;
            evt = evt || event;
            switch (evt.keyCode) {
                case keys.SPACE:
                case keys.TAB:
                case keys.ENTER: doEnter(); break;
                case keys.UP: doUp(); break;
                case keys.DOWN: doDown(); break;
                case keys.RIGHT:
                case keys.LEFT: this.hide(); break;
                default: return;
            }
            function doEnter() {
                var item = This.getSelectedItem();
                if (item != null) This.onItemSelect(item);
                if (evt.keyCode == keys.ENTER) {
                    M139.Event.stopEvent(evt);
                }
            }
            function doUp() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    index--;
                    index = index < 0 ? index + This.getItems().length : index;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
            function doDown() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    var len = This.getItems().length;
                    index = (index + 1) % len;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
        }
    }));

        var DefaultStyle = {
            template:['<div class="menuPop shadow" style="display:none;z-index:6024;padding:0;margin:0;">',
                '<ul></ul>',
        '</div>'].join(""),
        itemInsertPath:"ul",
        itemPath:"ul > li",
        itemTemplate:'<li style="width:100%;overflow:hidden;white-space:nowrap;"><a href="javascript:;"><span></span></a></li>',
        itemContentPath:"span:eq(0)"
    };
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M2012.UI.Suggest.InputSuggest;
    /***/
    M139.namespace("M2012.UI.Suggest.AddrSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.AddrSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.AddrSuggest
        *@extends M139.UI.Suggest.InputSuggest
        *@param {Object} options 初始化参数集
        *@param {String} options.filter 要筛选的通讯录数据类型
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Boolean} options.onlyAddr 返回的值是否不包含署名，默认是flase
        *@example
        */
        initialize:function(options){
            this.contactModel = M2012.Contacts.getModel();
            this.filter = options.filter;
            this.onlyAddr = options.onlyAddr;
            superClass.prototype.initialize.apply(this,arguments);
        },
        /**
         *返回输入匹配的联系人，为基类提供数据
         *@inner
         */
        onInput:function(value){
            var result = [];
            if (value != "") {
                value = value.toLowerCase();
                var items = this.contactModel.getInputMatch({
                    keyword: value,
                    filter: this.filter
                });

                var inputLength = value.length;
                for (var i = 0; i < items.length; i++) {
                    var matchInfo = items[i];
                    var obj = matchInfo.info;
                    var addrText = "";
                    if (matchInfo.matchAttr == "addr") {
                        matchText = obj.addr.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.addr.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + addrText + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else if (matchInfo.matchAttr == "name") {
                        matchText = obj.name.substring(matchInfo.matchIndex, matchInfo.matchIndex + inputLength);
                        addrText = obj.name.replace(matchText, "[b]" + matchText + "[/b]");
                        addrText = "\"" + addrText.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText).replace("[b]", "<span style='font-weight:bold'>").replace("[/b]", "</span>");
                    } else {
                        addrText = "\"" + obj.name.replace(/\"/g, "") + "\"<" + obj.addr + ">";
                        addrText = M139.Text.Html.encode(addrText);
                    }
                    var value = obj.addr;
                    if(!this.onlyAddr){
                        if(this.filter == "email"){
                            value = M139.Text.Email.getSendText(obj.name,obj.addr);
                        }else{
                            value = M139.Text.Mobile.getSendText(obj.name,obj.addr);
                        }
                    }
                    result.push({text:addrText,value:value,name:obj.name});
                }
            }
            return result;
        }
    }));

    jQuery.extend(M2012.UI.Suggest.AddrSuggest,
    /**@lends M2012.UI.AddrSuggest*/
    {
        /**
         *创建自动输入提示组件实例
         *@param {Object} options 参数集合
         *@param {HTMLElement} options.textbox 要捕获的文本框
         *@param {String} options.filter 要筛选的通讯录数据类型
         *@param {Number} options.maxItem 可选参数，一次最多显示几个，默认50个
         */
        create:function(options){
            var ui = new M2012.UI.Suggest.AddrSuggest(options);
            return ui;
        }
    });
})(jQuery,Backbone,_,M139);
﻿/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.RichInput.View";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.RichInput.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.RichInput.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {HTMLElement} options.container 组件的容器
         *@param {Number|Function} options.maxSend 最大接收人个数，默认为50
         *@param {Number} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
         *@param {String} options.limitMailDomain 限定输入的邮件域
         *@param {String} options.validateMsg 非法输入值的提示语
         *@example
         var richinputView = new M2012.UI.RichInput.View({
             container:document.getElementById("addrContainer"),
             type:"email",
             maxSend:200,
             sendIsUpTo:195
         }).render();
         */
        initialize: function (options) {

            M2012.UI.RichInput.instances.push(this);
            this.id = M2012.UI.RichInput.instances.length;
            
            M2012.UI.RichInput.DocumentView.create();

            // 控制接收人提示层的位置，默认是在接收人输入框的上方top，可以设置为下方bottom
            this.tipPlace = options.tipPlace || "top";
            var div = document.createElement("div");
            var templateData = {
                offset: "-28px",
                arrow: "tipsBottom",
                zIndex: parseInt(options.zIndex) || 3
            };
            if (this.tipPlace == "bottom") { // 提示层在接收人输入框的底部
                templateData = {
                    offset: "29px",
                    arrow: "tipsTop",
                    zIndex: parseInt(options.zIndex) || 3
                }
            }
            div.innerHTML = $T.format(this.template, templateData);
            if (options.hideBorder) {  //隐藏边框
                $(div).find('div.ItemContainer').css('border', 'none');
            }
            if (options.heightLime) {
                $(div).children().css({ 'overflow-y': 'auto', 'max-height': options.heightLime + 'px', '_height': 'expression(this.scrollHeight > 50 ? "' + options.heightLime + 'px" : "auto")' });
            }
            var el = div.firstChild;

            this.type = options.type;
            this.contactsModel = M2012.Contacts.getModel();

            this.model = new Backbone.Model();
             //ad wx产品运营中要扩展的方法
            this.change = options.change || function () {}; 
            this.errorfun = options.errorfun || null;
            
            this.setElement(el);
            this.jTextBox = this.$("input");
            this.textbox = this.jTextBox[0];
            this.textboxView = new M2012.UI.RichInput.TextBoxView({
                richInput:this,
                element:this.$("div.addrText")
            });
            //向下兼容
            this.jContainer = this.$el;
            this.container = this.el;

            this.jItemContainer = this.$(this.itemContainerPath);

            this.jAddrTipsContainer = this.$(this.addrTipsPath);
            
            this.jAddrDomainTipsContainer = this.$(this.addrDomainTipsPath);


            this.items = {};
            this.hashMap = {};
            var maxSend = options.maxSend || 50;
            if (!jQuery.isFunction(maxSend)) {
                maxSend = new Function("", "return " + maxSend);
            }
            this.maxSend = maxSend;
            this.sendIsUpTo = function () {
                return options.sendIsUpTo || (this.maxSend() - 5);
            };
            this.tool = M2012.UI.RichInput.Tool;



            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template: ['<div class="p_relative RichInputBox writeTable" style="z-index:{zIndex};">',
             '<div class="tips write-tips EmptyTips" style="left:0;top:{offset};display:none;">',
                 '<div class="tips-text EmptyTipsContent">',
                     //'请填写收件人',
                 '</div>',
                 '<div class="{arrow} diamond"></div>',
             '</div>',
             '<div class="ItemContainer writeTable-txt clearfix" unselectable="on" style="cursor: text;overflow-x:hidden">',
                 '<div class="PlaceHold" style="position:absolute;color: silver;display:none;left:3px;"></div>',
                 '<div class="addrText" style="margin-top: -3px;">',
                     '<input type="text" style="width:100%" class="addrText-input">',
                 '</div>',
             '</div>',
             '<div class="addnum" style="display:none"></div>',
             '<div class="pt_5 addrDomainCorrection" style="display:none"></div>',
         '</div>'].join(""),
        itemPath: ".addrBase",
        itemClass:"addrBase",
        itemContainerPath:"div.ItemContainer",
        addrTipsPath:"div.addnum",
        addrDomainTipsPath:"div.addrDomainCorrection",
        /**构建dom函数*/
        render: function () {

            var options = this.options;

            this.initEvent();

            //this.$el.appendTo(options.container);
            var container = $D.getHTMLElement(options.container);
            container.innerHTML = "";
            container.appendChild(this.el);
            
            M2012.UI.RichInput.Tool.unselectable(this.el.parentNode);
            M2012.UI.RichInput.Tool.unselectable(this.el);
            M2012.UI.RichInput.Tool.unselectable(this.el.firstChild);

            if (this.options.placeHolder) {
                this.setTipText(this.options.placeHolder);
            }

            //插件
            var plugins = options.plugins;
            for(var i=0;i<plugins.length;i++){
                new plugins[i](this);
            }

            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *初始化事件
         *@inner
         */
        initEvent: function () {
            var This = this;
           this.$el.keydown($.proxy(this,"onKeyDown"))
                .click($.proxy(this,"onClick"));
           this.$el.mousedown($.proxy(this, "onMouseDown"));
               
            this.model.on("change:placeHolder", function () {
                This.switchTipText();
            });

            this.$("div.PlaceHold").click(function () {
                This.textbox.select();
                This.textbox.focus();
                //return false;
            });

            this.textboxView.on("input", function () {
                This.switchTipText();
            });

            this.on("itemchange", function () {
                This.switchTipText();
            });

            this.jTextBox.keydown(function (e) {
                This.trigger("keydown", e);
            }).blur(function (e) {
                This.trigger("blur", e);
            });
        },

        /**
         *提示没有收件人
         *@param {String} msg 可选参数，默认是：请填写收件人
         */
        showEmptyTips:function(msg){
            msg = msg || "请填写收件人";
            var tips = this.$("div.EmptyTips");
            tips/*.css({
                left:"0",
                top:"-28px"
            })*/
            .show().find("div.EmptyTipsContent").text(msg);
            setTimeout(function(){
                tips.hide();
            }, 3000);
            M139.Dom.flashElement(this.el);
        },

        /**
         *提示接收人格式非法
         *@param {String} msg 可选参数，默认是：接收人输入错误
         */
        showErrorTips:function(msg){
            var item = this.getErrorItem();
            if(!item)return;

            msg = msg || "接收人输入错误";
            var tips = this.$("div.EmptyTips");
            tips.show().find("div.EmptyTipsContent").text(msg);

            var itemOffset = item.$el.offset();
            var richinputOffset = this.$el.offset();
            tips.css({
                left: itemOffset.left - richinputOffset.left + parseInt(item.$el.width()/2) - 16,
                top:itemOffset.top - richinputOffset.top + (this.tipPlace == "bottom" ? 25 : -32)
            });
            setTimeout(function(){
                tips.hide();
            },3000);
        },

        /**
         *获得输入的项
         *@inner
         *@returns {Array} 返回输入的dom,[dom,dom,dom]
         */
        getItems: function () {
            var result = [];
            var This = this;
            this.$(this.itemPath).each(function () {
                var itemId = this.getAttribute("rel");
                var item = This.items[itemId];
                if (item) result.push(item);
            });
            return result;
        },
        
        /** 得到收件人输入项 */
        getToInstancesItems: function(){
            var instances = M2012.UI.RichInput.instances;
            return instances[0].getValidationItems().distinct();
        },
                
        /**
         *todo 得到所有实例的输入项
         */
        getAllInstancesItems: function(){
            var instances = M2012.UI.RichInput.instances;
            var result = [];
            for(var i=0;i<instances.length;i++){
                result = result.concat(instances[i].getValidationItems());
            }
            result = result.distinct();
            return result;
        },
        /**
         *得到所有实例的输入对象（收件人、抄送、密送）
         */
        getInputBoxItems: function () {
            return this.getAllInstancesItems();
        },
		/**
         *得到所有实例的地址域名
         */
		getInputBoxItemsDomain: function (){
			var result = [];
			for(var p in this.items){
				var item = this.items[p];
				if(item && item.domain){
					result.push(item.domain);
				}
			}
			result = result.distinct();
			return result;
		},
        /**
         *判断是否重构输入
         *@inner
         */
        isRepeat: function (addr) {
            //取手机号码或者邮件地址作为key
            var hashKey = this.contactsModel.getAddr(addr, this.type);
            if (hashKey && this.hashMap[hashKey]) {
                //实现闪烁效果
                for(var p in this.items){
                    var item = this.items[p];
                    if(item && item.hashKey == hashKey){
                        M139.Dom.flashElement(item.el);
                        break;
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        /**
         *todo event
         *插入收件人之前
         *@inner
         */
        beforeInsertItem: function () {
            var This = this;
            var curItemsLen = this.getInputBoxItems().length;
            var addresseeTips = this.jAddrTipsContainer;
            if (curItemsLen >= this.maxSend()) {
                addresseeTips.html('不能再添加收件人！').show();
                //todo
                /*
                this.blinkBox(addresseeTips, 'xxxclass');
                this.hideBlinkBox(addresseeTips);
                */
                return false;
            }
            return true;
        },


        /**
         *插入成员
         *@param {String} addr 插入的地址
         *@param {Object} options 选项集合
         *@param {Boolean} options.isAfter 是否插入到文本框后方
         *@param {HTMLElement} options.element 插入到目标元素后方
         *@param {Boolean} options.isFocusItem 插入后是否显示为选中状态
         */
        insertItem: function (addr, options) {
            options = options || {};
            var isAfter = options.isAfter;
            var element = options.element;
            var isFocusItem = options.isFocusItem;
            var current = this;
            if (!element) {
                var focusText = !isAfter && !element;
                element = this.textboxView.$el;
            }
            //ad wx
            //if (current.change){ current.change(this.items);} // lichao修改 先注释掉这行代码,改变触发的位置,在onItemChange中触发
            var list = _.isArray(addr) ? addr : this.splitAddr(addr);
             
            var totalLength = this.getInputBoxItems().length;
            var breakSender = false;

            for (var i = 0; i < list.length; i++) {
                if (totalLength == this.maxSend()) {
                    //todo 移到别的地方会好一些
                    try {
                        if (jQuery.isFunction(this.options.onMaxSend)) {
                            this.options.onMaxSend();
                        } else {
                            //TODO 这一坨应该放在写信页调用的onMaxSend里
                            if (list.length == 1) {
                                if (this.noUpgradeTips) {
                                    var tipHTML = '接收人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人！';
                                } else {
                                    var tipHTML = '收件人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人，<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">升级邮箱</a>添加更多！';
                                }
                            } else {
                                var tipHTML = M139.Text.Utils.format('<span style="color: #F60;">{remain}</span>人未添加，最多添加<span style="color: #F60;">{maxSend}</span>人！', {
                                    remain: list.length - i,
                                    maxSend: this.maxSend()
                                });
                                //todo
                                if (top.$User.getServiceItem() != "0017" && !this.noUpgradeTips) {//非20元版用户
                                    tipHTML += '<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">升级邮箱</a>添加更多！'
                                }
                            }
                            this.showAddressTips({
                                html: tipHTML,
                                flash: true
                            });
                        }
                    } catch (e) { }
                    breakSender = true;
                    break;
                } else {
                    totalLength++;
                }
                var str = list[i].trim();
                if (str != "") {
                    if (options.testRepeat === false || !this.isRepeat(str)) {
                        //move to itemview
                        var item = new M2012.UI.RichInput.ItemView({
                            richInput:this,
                            text:str,
                            itemId:this.getNextItemId(),
                            type: this.type,
                            limitMailDomain : this.options.limitMailDomain,
                            errorMessage: this.options.validateMsg || "接收人格式非法，请双击修改"
                        }).render();
                        M2012.UI.RichInput.Tool.unselectable(item.el);
                        item.on("select",function(){
                            current.onItemSelected({
                                item:this
                            });
                        }).on("unselect",function(){
                            current.onItemUnSelected({
                                item:this
                            });
                        });
                        this.items[item.itemId] = item;
                        if(!item.error){
                            this.hashMap[item.hashKey] = true;
                        }
                        if (isAfter) {
                            element.after(item.$el);
                        } else {
                            element.before(item.$el);
                        }
                        if (isFocusItem) item.select();
                       
                    }
                }
            }
            this.onItemChange({
                breakSender: breakSender
            });
        },
        /**
         *todo event
         *插入收件人之后
         *@inner
         */
        onItemChange: function (options) {
            options = options || {};
            if (!options.breakSender) {
                var addresseeTips = this.jAddrTipsContainer;
                var itemLength = this.getInputBoxItems().length;
                var html = '';
                if (itemLength >= this.sendIsUpTo()) {
                    var remail = this.maxSend() - itemLength;
                    html = '还可添加<strong class="c_ff6600">' + remail + '</strong>人';
                    this.showAddressTips({ html: html });
                } else {
                    this.hideAddressTips();
                }
            }
            /**当收件人个数发生变化
            * @name M2012.UI.RichInput.View#itemchange
            * @event
            * @param {Object} e 事件参数
            * @example
            httpClient.on("itemchange",function(){
            });
            */
			
			
			//收件人人数大于3人时提示群发单显教育(只在写信页用)
			try{
				if( window.location.href.indexOf("html/compose.html") > -1){
					top.$App.off('insertItem');
					var toLength = this.getToInstancesItems().length;
					toLength >=3 && top.$App.trigger('insertItem',{totalLength:toLength}); 
				}
			}catch(e){}

            if (this.change){this.change(this.items);} // 李超新增,如果item改变,则触发change事件
            this.trigger("itemchange");
        },

        /**
         *地址栏下方的提示信息
         *@param {Object} options 参数集
         *@param {String} options.html 提示内容
         *@param {Boolean} options.flash 是否闪烁
         */
        showAddressTips: function (options) {
            var This = this;
            this.jAddrTipsContainer.html(options.html).show();
            if (options.flash) {
                M139.Dom.flashElement(this.jAddrTipsContainer);
            }
            clearTimeout(this.hideAddressTipsTimer);
            //5秒后提示自动消失
            this.hideAddressTipsTimer = setTimeout(function () {
                This.hideAddressTips();
            }, 5000);
        },
        hideAddressTips:function(){
            // add by tkh
            var associates = this.jAddrTipsContainer.find("a[rel='addrInfo']");
            if(associates.size() == 0){
                this.jAddrTipsContainer.hide();
            }
        },

        onItemSelected:function(e){
        
        },
        onItemUnSelected:function(e){
        
        },
        /**
         *得到文本框后一个成员
         *@inner
         */
        getTextBoxNextItem: function () {
            var node = this.textboxView.el.nextSibling;
            if (node) {
                var itemId = node.getAttribute("rel");
                if (itemId) {
                    return this.items[itemId];
                }
            } else {
                return null;
            }
        },
        /**
         *得到文本框前一个成员
         *@inner
         */
        getTextBoxPrevItem: function () {
            var node = this.textboxView.el.previousSibling;
            if (node) {
                var itemId = node.getAttribute("rel");
                if (itemId) {
                    return this.items[itemId];
                }
            } else {
                return null;
            }
        },
        /**
         *取消选择所有成员
         *@inner
        */
        unselectAllItems: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) {
                    item.unselect();
                }
            }
            this.lastClickItem = null;
        },
        /**
         *选择所有成员
         *@inner
        */
        selectAll: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) {
                    item.select();
                }
            }
        },

        /**
         *复制选中成员  todo 优化成原生的复制
         *@inner 
         */
        copy: function () {
            var This = this;
            var items = this.getSelectedItems();
            var list = [];
            for (var i = 0; i < items.length; i++) {
                list.push(items[i].allText);
            }
            M2012.UI.RichInput.Tool.Clipboard.setData(list);
            setTimeout(function () {
                M139.Dom.focusTextBox(This.textbox);
            }, 0);
        },
        /**
         *剪切选中成员  todo 优化成原生的剪切
         *@inner 
         */
        cut: function () {
            this.copy();
            var items = this.getSelectedItems();
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
            }
            if(this.inputAssociateView){
                this.inputAssociateView.render();// add by tkh
            }
        },
        /**
         *粘贴成员 todo 优化成原生的
         *@inner 
         */
        paste: function (e) {
            var This = this;
            setTimeout(function () {
                var text = This.textbox.value;
                if (/[;,；，]/.test(text) ||
                            (This.type == "email" && M139.Text.Email.isEmailAddr(text)) ||
                            (This.type == "mobile" && M139.Text.Mobile.isMobile(text))
                            ) {
                    This.createItemFromTextBox();
                }
            }, 0);
        },

        /**
         *获得选中的成员
         *@inner 
         */
        getSelectedItems: function () {
            var result = [];
            for (var p in this.items) {
                var item = this.items[p];
                if (item && item.selected) {
                    result.push(item);
                }
            }
            return result;
        },

        /**
         *清空输入项 
         */
        clear: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) item.remove();
            }
        },

        /**
         *移除选中的成员
         *@inner 
         */
        removeSelectedItems: function () {
            var items = this.getSelectedItems();
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
            }
        },

        /**
         *双击编辑联系人
         */
        editItem:function(itemView){
            var This = this;
            this.textboxView.setEditMode(itemView);
        },

        /**
         *@inner
         *分割多个联系人
         */
        splitAddr:function(addr){
            if(this.type == "email"){
                return M139.Text.Email.splitAddr(addr);
            }else if(this.type =="mobile"){
                return M139.Text.Mobile.splitAddr(addr);
            }
            return [];
        },


        /**
         *从文本框读取输入值，添加成员
         */
        createItemFromTextBox: function () {
            var textbox = this.textbox;
            var value = textbox.value.trim();
            if (value != "" && value != this.tipText) {
                //todo 优化event
                if (this.type == "email" && /^\d+$/.test(value)) {
                    value = value + "@" + ((top.$App && top.$App.getMailDomain()) || "139.com");
                }
                this.textboxView.setValue("");
                this.insertItem(value);
                if(this.inputAssociateView){
                    this.inputAssociateView.render();// add by tkh 
                }
                if(this.inputCorrectView){
                    this.inputCorrectView.render();//add by yly
                }
                this.focus();
            }
        },

        /**
         *移动文本框到
         *@inner
         */
        moveTextBoxTo: function (insertElement, isAfter) {
            if(!insertElement)return;
            if (isAfter) {
                insertElement.after(this.textboxView.el);
            } else {
                insertElement.before(this.textboxView.el);
            }
            window.focus();
            this.jTextBox.focus();
            //?? current.textbox.createTextRange().select();
        },

        /**
         *移动文本框到末尾
         *@inner
         */
        moveTextBoxToLast: function () {
            var el = this.textboxView.el;
            if (el.parentNode.lastChild != el) {
                el.parentNode.appendChild(el);
            }
            if ($.browser.msie) window.focus();
            //textbox.focus();
        },

        /**
         *移除成员数据
         *@inner
         */
        disposeItemData: function (item) {
            var items = this.items;
            delete items[item.itemId];

            //重新建立map，而不是直接删除key，因为有可能存在key相同的item
            this.hashMap = {};

            for (var id in items) {
                var item = items[id];
                if (!item.error) {
                    this.hashMap[item.hashKey] = true;
                }
            }

            this.onItemChange();
        },
        /**
         *根据鼠标移动的起始点和结束点，得到划选的成员
         *@inner
         */
        trySelect: function (p1, p2) {
            if (p1.y == p2.y && p1.x == p2.x) return;
            if (p1.y == p2.y) {
                if (p1.x < p2.x) {
                    var topPosition = p1;
                    var bottomPosition = p2;
                } else {
                    var topPosition = p2;
                    var bottomPosition = p1;
                }
            } else if (p1.y < p2.y) {
                var topPosition = p1;
                var bottomPosition = p2;
            } else {
                var topPosition = p2;
                var bottomPosition = p1;
            }
            var startElement;
            var elements = this.jContainer.find(this.itemPath);
            var itemHeight;
            for (var i = 0; i < elements.length; i++) {
                var element = elements.eq(i);
                var offset = element.offset();
                var x = offset.left + element.width();
                var y = offset.top + element.height();
                var selected = false;
                if (!itemHeight) itemHeight = element.height();
                if (!startElement) {
                    if ((topPosition.x < x && topPosition.y <= y) || (y - topPosition.y >= itemHeight)) {
                        startElement = element;
                        selected = true;
                    }
                } else if (bottomPosition.x > offset.left && bottomPosition.y > offset.top) {
                    selected = true;
                } else if (bottomPosition.y - offset.top > itemHeight) {
                    selected = true;
                }
                var itemObj = this.items[element.attr("rel")];
                if (selected) {
                    itemObj.select();
                } else {
                    itemObj.unselect();
                }
            }
        },
        //不记得是做什么的
        itemIdNumber: 0,
        /**
         *返回下一个子项的id
         *@inner
         */
        getNextItemId: function () {
            return this.itemIdNumber++;
        },
        /**
         *设置提示文本
         */
        setTipText: function (text) {
            this.model.set("placeHolder", text);
        },
        /**
         *显示默认文本
         */
        switchTipText: function () {
            if (this.textbox.value == "" && !this.hasItem()) {
                var text = this.model.get("placeHolder");
                this.$(".PlaceHold").show().text(text);
            } else {
                this.$(".PlaceHold").hide();
            }
        },
        /**
         *输入组件获得焦点
         */
        focus: function () {
            //if (document.all) {
            try {
                //当元素隐藏的时候focus会报错
                this.textbox.focus();
            } catch (e) { }
            //} else {
                //this.textbox.select(); //select焦点不会自动滚动到文本框
            //}
        },
        /**
         *返回组件是否有输入值
         *@returns {Boolean}
         */
        hasItem: function () {
            return this.getItems().length > 0;
        },

        /**
         *返回组件输入的所有地址
         */
        getAddrItems: function () {
            var items = this.getItems();
            var result = [];
            for (var i = 0; i < items.length; i++) {
                if (!items[i].error) {
                    result.push(items[i].addr);
                }
            }
            return result;
        },

        /**
         *返回组件输入的所有地址（正确的）
         */
        getValidationItems: function () {
            var items = this.getItems();
            var result = [];
            for (var i = 0; i < items.length; i++) {
                if (!items[i].error) {
                    result.push(items[i].allText);
                }
            }
            return result;
        },

        /**
         *返回第一个格式非法的输入文本
         *@returns {String}
         */
        getErrorText: function () {
            var item = this.getErrorItem();
            return item && item.allText;
        },
        /**
         *@inner
         */
        getErrorItem:function(){
            var items = this.getItems();
            for (var i = 0; i < items.length; i++) {
                if (items[i].error) {
                    return items[i];
                }
            }
            return null;
        },

        /**
         *键盘按下
         *@inner
         */
        onKeyDown: function (e) {
            if (e.target.tagName == "INPUT" && e.target.value != "") return;
            var current = this;
            var Keys = M139.Event.KEYCODE;
            switch (e.keyCode) {
                case Keys.BACKSPACE:
                    {
                        return KeyDown_Backspace.apply(this, arguments);
                    }
                case Keys.DELETE:
                    {
                        return KeyDown_Delete.apply(this, arguments);
                    }
                case Keys.A:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_A.apply(this, arguments);
                    }
                case Keys.C:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_C.apply(this, arguments);
                    }
                case Keys.X:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_X.apply(this, arguments);
                    }
                case Keys.V:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_V.apply(this, arguments);
                    }
                default:
                    break;
            }
            function KeyDown_Backspace(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].$el);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
                e.preventDefault();
            }
            function KeyDown_Delete(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].$el);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
            }
            function KeyDown_Ctrl_A(e) {
                current.selectAll();
                e.preventDefault();
            }
            function KeyDown_Ctrl_C(e) {
                return current.copy();
            }
            function KeyDown_Ctrl_X(e) {
                return current.cut();
            }
            function KeyDown_Ctrl_V(e) {
                return current.paste(e);
            }
        },
        /**
         *鼠标点击
         *@inner
         */
        onClick: function(e) {
            //点击控件空白地方（item、textbox以外）
            if (!jQuery(e.target).hasClass("ItemContainer")) return;
            if (this.getSelectedItems().length > 0) return; //鼠标划选时不触发
            var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
                richInputBox: this,
                x: e.clientX,
                y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
            });
            if (nearItem) {
                this.moveTextBoxTo(nearItem.element, nearItem.isAfter);
            }else{
                this.textbox.focus();
            }
        },

        getClickItem:function(e){
            var target = e.target;
            var itemEl = null;
            var jEl = $(target);
            var itemId = null;
            if (jEl.hasClass(this.itemClass)) {
                itemId = jEl.attr("rel");
            } else if (jEl.parent().hasClass(this.itemClass)) {
                itemId = jEl.parent().attr("rel");
            }
            return itemId;
        },


        /**
         *鼠标按下
         *@inner
         */
        onMouseDown: function(e) {
            var target = e.target;
            
            if (target.tagName == "INPUT" || target.className == "addnum" || target.parentNode.className == "addnum"
				|| target.className == "addrDomainCorrection" || target.parentNode.className == "addrDomainCorrection" || target.parentNode.parentNode.className == "addrDomainCorrection"
				) {
                return;
            }

            var itemId = this.getClickItem(e); 

            this.startPosition = {
                x: e.clientX,
                y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
            };
            if (itemId) {
                if (!e.ctrlKey && !e.shiftKey) {
                    M2012.UI.RichInput.Tool.dragEnable = true;
                    var clickItem = this.items[itemId];
                    var items = this.getSelectedItems();
                    if ($.inArray(clickItem, items) == -1) {
                        items.push(clickItem);
                    }
                    M2012.UI.RichInput.Tool.dragItems = items;

                    if ($.browser.msie) {
                        M2012.UI.RichInput.Tool.captureElement = e.target;
                        e.target.setCapture();
                    } else {
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    
                    this.unselectAllItems();
                    this.createItemFromTextBox();
                    this.moveTextBoxToLast();
                    this.selectArea = true;
                    this.focus();
                    
                    M139.Event.stopEvent(e);
                }
            } else if (target == this.el || jQuery.contains(this.el, target)) {
                this.unselectAllItems();
                this.createItemFromTextBox();
                this.moveTextBoxToLast();
                this.selectArea = true;
                this.focus();
            }
            
            M2012.UI.RichInput.Tool.currentRichInputBox = this;
        },
		showErrorDomain: function(errorDomain){
			var items = this.items;
			var item = '';
			for(var p in items){
				item = items[p];
				if(item.domain == errorDomain){
					item.trigger('errorDomain');
				}
			}
		},
		changItemDomain: function(errorDomain, domain){
			var items = this.items;
			var item = '';
			for(var p in items){
				item = items[p];
				if(item.domain == errorDomain){
					item.trigger('changeDomain',{errorDomain:errorDomain, domain:domain});
				}
			}
		}
    }));


    var instances = M2012.UI.RichInput.instances = [];
    M2012.UI.RichInput.getInstanceByContainer = function(element) {
        for (var i = 0; i < instances.length; i++) {
            var o = instances[i];
            if (o.container == element || o.jContainer == element) return o;
        }
        return null;
    }

    //工具类
    M2012.UI.RichInput.Tool = {
        getPageScrollTop: function () {
            return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        },
        //元素不可选中（禁用浏览器原生选中效果）
        unselectable: function (element) {
            if ($.browser.msie) {
                element.unselectable = "on";
            } else {
                element.style.MozUserSelect = "none";
                element.style.KhtmlUserSelect = "none";
            }
        },
        resizeContainer: function (element, autoHeight) {
        },
        //根据坐标获取最接近的item
        getNearlyElement: function (param) {
            var current = param.richInputBox;
            //得到当前坐标所在行的元素
            var jElements = current.jContainer.find(current.itemPath);
            var rowsElements = [];
            for (var i = 0; i < jElements.length; i++) {
                var jElement = jElements.eq(i);
                var _y = jElement.offset().top;
                if (param.y > _y && param.y < _y + jElement.height()) {
                    rowsElements.push(jElement);
                }
            }
            //获得插入点
            var overElemet;
            var isAfter = true;
            for (var i = 0; i < rowsElements.length; i++) {
                var jElement = rowsElements[i];
                var offset = jElement.offset();
                var _x = offset.left;
                if (param.x < _x + jElement.width() / 2) {
                    overElemet = jElement;
                    isAfter = false;
                    break;
                }
                overElemet = jElement;
            }
            if (overElemet) {
                return {
                    element: overElemet,
                    isAfter: isAfter
                }
            } else {
                return null;
            }
        },
        bindEvent: function (richInputBox, element, events) {
            for (var eventName in events) {
                var func = events[eventName];
                element.bind(eventName, (function (func) {
                    return (function (e) {
                        e.richInputBox = richInputBox;
                        return func.call(this, e);
                    })
                })(func));
            }
        },
        draw: function (p1, p2) {
            if (!window.drawDiv) {
                window.drawDiv = $("<div style='position:absolute;left:0px;top:0px;border:1px solid blue;'></div>")
                .appendTo(document.body);
            }
            var width = Math.abs(p1.x - p2.x);
            var height = Math.abs(p1.y - p2.y);
            drawDiv.width(width);
            drawDiv.height(height);
            drawDiv.css({
                left: Math.min(p1.x, p2.x),
                top: Math.min(p1.y, p2.y)
            });
        },
        //伪剪贴板对象
        Clipboard: {
            setData: function (arr) {
                var txtGhost = $("<input type='text' style='width:1px;height:1px;overflow:hidden;position:absolute;left:0px;top:0px;'/>").appendTo(document.body).val(arr.join(";")).select();
                setTimeout(function () {
                    txtGhost.remove();
                }, 0);
            }
        },
        hidDragEffect: function () {
            if (this.dragEffectDiv) this.dragEffectDiv.hide();
        },
        //拖拽的时候效果
        drawDragEffect: function (p) {
            if (!this.dragEffectDiv) {
                this.dragEffectDiv = $("<div style='position:absolute;\
                border:2px solid #444;width:7px;height:8px;z-index:5000;overflow:hidden;'></div>").appendTo(document.body);
            }
            this.dragEffectDiv.css({
                left: p.x + 4,
                top: p.y + 10,
                display: "block"
            });
        },
        hidDrawInsertFlag: function () {
            if (this.drawInsertFlagDiv) this.drawInsertFlagDiv.hide();
        },
        //插入效果（游标）
        drawInsertFlag: function (p) {
            if (!this.drawInsertFlagDiv) {
                this.drawInsertFlagDiv = $("<div style='position:absolute;\
                background-color:black;width:2px;background:black;height:15px;z-index:5000;overflow:hidden;border:0;'></div>").appendTo(document.body);
            }
            var hitRichInputBox;
            //ie9,10和火狐，拖拽的时候 mousemove e.target始终等于按下的那个元素，所以只能用坐标判断
            if (($B.is.ie && $B.getVersion() > 8) || $B.is.firefox) {
                for (var i = M2012.UI.RichInput.instances.length - 1; i >= 0; i--) {
                    var rich = M2012.UI.RichInput.instances[i];
                    if (!M139.Dom.isHide(rich.el,true) && p.y > rich.$el.offset().top) {
                        hitRichInputBox = rich;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
                    var rich = M2012.UI.RichInput.instances[i];
                    if (M2012.UI.RichInput.Tool.isContain(rich.container, p.target)) {
                        hitRichInputBox = rich;
                        break;
                    }
                }
            }
            if (hitRichInputBox) {
                var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
                    richInputBox: hitRichInputBox,
                    x: p.x,
                    y: p.y
                });
            }
            if (nearItem) {
                var offset = nearItem.element.offset();
                this.drawInsertFlagDiv.css({
                    left: offset.left + (nearItem.isAfter ? (nearItem.element.width() + 2) : -2),
                    top: offset.top + 4,
                    display: "block"
                });
                this.insertFlag = { element: nearItem.element, isAfter: nearItem.isAfter, richInputBox: hitRichInputBox };
            } else {
                this.insertFlag = { richInputBox: hitRichInputBox };
            }
        },
        isContain: function (pNode, cNode) {
            while (cNode) {
                if (pNode == cNode) return true;
                cNode = cNode.parentNode;
            }
            return false;
        },
        delay: function (key, func, interval) {
            if (!this.delayKeys) this.delayKeys = {};
            if (this.delayKeys[key]) {
                clearTimeout(this.delayKeys[key].timer);
            }
            this.delayKeys[key] = {};
            this.delayKeys[key].func = func;
            var This = this;
            this.delayKeys[key].timer = setTimeout(function () {
                This.delayKeys[key] = null;
                func();
            }, interval || 0);
        },
        fireDelay: function (key) {
            if (!this.delayKeys || !this.delayKeys[key]) return;
            this.delayKeys[key].func();
            clearTimeout(this.delayKeys[key].timer);
        },
        hideBlinkBox: function (tipObj, time) {
            if (typeof (time) != 'number') time = 5000;
            var This = this;
            if (This.keep) clearTimeout(This.keep);
            This.keep = setTimeout(function () {
                tipObj.hide();
            }, time);
        },
        blinkBox: function (obj, className) {
            var This = this;
            obj.addClass(className);
            var keep;
            var loop = setInterval(function () {
                if (keep) clearTimeout(keep);
                obj.addClass(className);
                keep = setTimeout(function () { obj.removeClass(className); }, 100);
            }, 200);
            setTimeout(function () {
                if (loop) clearInterval(loop);
            }, 1000);
        }
    }


    //暂放至此
    //数组扩展
    //去重
    Array.prototype.distinct = function(){
        var filtered= [];
        var obj = {};
        for(var i = 0;i<this.length;i++){
            if(!obj[this[i]]){
                obj[this[i]] = 1;
                filtered.push(this[i]);
            }
        }
        return filtered;
    };

    // 排序 
    Array.prototype.ASC = function(){
        return this.sort(function(a,b){
            if( a.localeCompare(b) > 0 ) return 1;
            else return -1;
        });
    }



    jQuery.extend(M2012.UI.RichInput,
    /**@lends M2012.UI.RichInput*/
    {
        /**
         *创建富收件人文本框实例
         *@param {Object} options 参数集合
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {HTMLElement} options.container 组件的容器
         *@param {Number} options.maxSend 最大接收人个数，默认为50
         *@param {Number} options.preventAssociate 是否屏蔽推荐收件人功能
         *@param {Number} options.preventCorrect 是否屏蔽域名纠错功能
         *@param {Number|Function} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
         */
        create:function(options){
            var plugins = [];
            plugins.push(M2012.UI.RichInput.Plugin.AddrSuggest);
            options.plugins = plugins;
            var view = new M2012.UI.RichInput.View(options);
            if(!options.preventAssociate && top.$App){
                view.inputAssociateView = new M2012.UI.Suggest.InputAssociate({richInputBox : view});// add by tkh 地址输入框联想组件
            }
			if(!options.preventCorrect && top.$App && M2012.UI.Suggest.InputCorrect){
				view.inputCorrectView = new M2012.UI.Suggest.InputCorrect({richInputBox : view});
			}
            if (options.noUpgradeTips) {
                view.noUpgradeTips = true;
            } else {
                view.noUpgradeTips = false;
            }
            return view;
        }
    });

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的扩管文本框对象
 */

(function (jQuery, _, Backbone, M139) {
    var namespace = "M2012.UI.RichInput.TextBoxView";
    M139.namespace(namespace, Backbone.View.extend(
        /**@lends M2012.UI.RichInput.TextBoxView.prototype*/
        {
            /** 定义通讯录地址本组件代码
             *@constructs M2012.UI.RichInput.TextBoxView
             *@param {Object} options 初始化参数集
             *@param {HTMLElement} options.element 托管的文本框对象
             */
            initialize: function (options) {

                this.setElement(options.element);

                this.richInputBox = options.richInput;

                this.jTextBox = this.$("input");
                this.textbox = this.jTextBox[0];

                this.initEvent();
            },
            /**
             *初始化事件
             *@inner
             */
            initEvent: function () {
                this.jTextBox.click($.proxy(this, "onClick"))
                    .focus($.proxy(this, "onFocus"))
                    .blur($.proxy(this, "onBlur"))
                    .keydown($.proxy(this, "onKeyDown"))
                    .keydown($.proxy(this, "onKeyUp"))
                    .bind("paste", $.proxy(this, "onPaste"))
                    .bind("cut", $.proxy(this, "onCut"));
                var This = this;
                M139.Timing.watchInputChange(this.textbox, function (e) {
                    This.onChange(e);
                });
            },
            /**
             *文本框内容变更时
             *@inner
             */
            onChange: function (e) {
                // 先注释掉这段代码,点击输入框时会触发该事件//
                this.fixTextBoxWidth();
                this.trigger("input");
            },
            /**
             *文本框根据内容自适应宽度
             *@inner
             */
            fixTextBoxWidth: function () {
                var jText = this.jTextBox;
                var minWidth = 10;
                if (jText.val() == "") {
                    this.$el.width(minWidth);
                    return;
                }
                if ($B.is.ie && $B.getVersion() < 10) {
                    var width = jText[0].createTextRange().boundingWidth + 13;
                } else {
                    //计算宽度
                    var widthHelper = $("#widthHelper");
                    if (widthHelper.length == 0) {
                        widthHelper = $("<span style='position:absolute;left:0px;top:0px;visibility:hidden;'\
                    id='widthHelper'></span>").appendTo(document.body);
                        widthHelper.css({
                            fontSize: jText.css("font-size"),
                            fontFamily: jText.css("font-family"),
                            border: 0,
                            padding: 0
                        });
                    }
                    var width = widthHelper.text(jText.val().replace(/ /g, "1")).width() + 13;
                    //fixed IE10下文本框会出来一个x
                    if ($B.is.ie && $B.getVersion() >= 10) {
                        width += 20;
                    }
                }
                var maxWidth = this.richInputBox.$el.width() - 3;
                if (width > maxWidth) width = maxWidth;
                if (width < minWidth) width = minWidth;


                //设置最大宽度
                if ($B.is.ie && $B.getVersion() < 8) {
                    if (width > 200) {
                        var containerWdith = this.richInputBox.$el.width();
                        if (width + 10 > containerWdith) {
                            width = containerWdith - 10;
                        }
                    }
                }

                this.$el.width(width);
                jText.width(width);
            },

            setEditMode: function (itemView) {
                var jTextBox = this.jTextBox;
                jTextBox.attr("mode", "edit"); //防止自动触发blur
                setTimeout(function () {
                    jTextBox.attr("mode", "");
                }, 0);
                jTextBox.val(itemView.allText);
                itemView.$el.replaceWith(this.$el);
                itemView.remove();
                
                M139.Dom.selectTextBox(this.textbox);
                this.fixTextBoxWidth();
            },

            setValue:function(value){
                this.textbox.value = value;
                this.fixTextBoxWidth();
            },

            /**
             *粘贴
             *@inner
             */
            onPaste: function (e) {
                /*
                todo test
                if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
                    var This = this;
                    setTimeout(function() {
                        var text = This.value;
                        This.value = "";
                        This.value = text; //火狐下的文本框渲染bug
                    }, 0);
                }
                */
            },
            /**
             *剪切
             *@inner
             */
            onCut: function (e) {
                /*
                todo
                var current = e.richInputBox;
                RichInputBox.Plugin.AutoAssociateLinkMan(current);
                */
            },
            /**
             *获得焦点
             *@inner
             */
            onFocus: function (e) {
                this.richInputBox.trigger("focus");
                /*
                todo
                if(e && e.richInputBox){
                    var current = e.richInputBox;
                    RichInputBox.Plugin.AutoAssociateLinkMan(current);
                }
                */
               // add by tkh
               if(e && this.richInputBox.inputAssociateView){
                    this.richInputBox.inputAssociateView.render();// add by tkh
               }
               
               /*if(e && this.richInputBox.inputCorrectView){
                    this.richInputBox.inputCorrectView.render();// add by yly
               }*/
            },
            /**
             *失去焦点
             *@inner
             */
            onBlur: function (e) {
                var current = this.richInputBox;
                if (this.jTextBox.attr("mode") == "edit") {
                    this.jTextBox.attr("mode", "");
                    return;
                }
                current.createItemFromTextBox();
            },
            /**
             *点击
             *@inner
             */
            onClick: function (e) {
                if (e && e.richInputBox) e.richInputBox.clearTipText();
            },

            /**
             *按键松开
             *@inner
             */
            onKeyUp: function (e) {
                this.fixTextBoxWidth();
            },
            /**
             *键盘按下
             *@inner
             */
            onKeyDown: function (e) {
                var This = this;
                if (e.shiftKey || e.ctrlKey) return;
                var current = this.richInputBox;
                var Keys = M139.Event.KEYCODE;
                var textbox = this.textbox;
                this.fixTextBoxWidth();
                switch (e.keyCode) {
                    case Keys.BACKSPACE:
                        {
                            return KeyDown_Backspace.apply(this, arguments);
                        }
                    case Keys.DELETE:
                        {
                            return KeyDown_Delete.apply(this, arguments);
                        }
                    case Keys.SEMICOLON:
                    case Keys.COMMA:
                    case Keys.ENTER:
                        {
                            return KeyDown_Enter.apply(this, arguments);
                        }
                    case Keys.LEFT:
                        {
                            return KeyDown_Left.apply(this, arguments);
                        }
                    case Keys.RIGHT:
                        {
                            return KeyDown_Right.apply(this, arguments);
                        }
                    case Keys.UP: case Keys.Down:
                        {
                            e.isUp = e.keyCode == Keys.Up;
                            return KeyDown_Up_Down.apply(this, arguments);
                        }
                    case Keys.TAB:
                        {
                            return KeyDown_Tab.apply(this, arguments);
                        }
                }
                function KeyDown_Backspace(e) {
                    if (textbox.value == "") {
                        if (current.getSelectedItems().length > 0) return;
                        var item = current.getTextBoxPrevItem();
                        if (item) item.remove();
                        textbox.focus();
                    }
                }
                function KeyDown_Delete(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxNextItem();
                        if (item) item.remove();
                        textbox.focus();
                    }
                }
                function KeyDown_Enter(e) {
                    if (textbox.value.trim() != "") {
                        setTimeout(function () {
                            current.createItemFromTextBox();
                        }, 0);
                    }
                    return false;
                }
                function KeyDown_Left(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxPrevItem();
                        if (item) {
                            current.moveTextBoxTo(item.$el);
                            return false;
                        }
                    }
                }
                function KeyDown_Right(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxNextItem();
                        if (item) {
                            current.moveTextBoxTo(item.$el, true);
                            return false;
                        }
                    }
                }
                function KeyDown_Up_Down(e) {
                    if (textbox.value == "") {
                        var offset = current.textboxView.offset();
                        var nearItems = M2012.UI.RichInput.Tool.getNearlyElement({
                            x: offset.left,
                            y: offset.top + (e.isUp ? -5 : 20),
                            richInputBox: current
                        });
                        if (nearItems) current.moveTextBoxTo(nearItems.element, nearItems.isAfter);
                        return false;
                    }
                }
                function KeyDown_Tab(e) {
                    textbox.setAttribute("TabPress", "1");
                    setTimeout(function () {
                        textbox.setAttribute("TabPress", null);
                    }, 0);
                }
            }
        }));
})(jQuery, _, Backbone, M139);
﻿

(function (jQuery, _, Backbone, M139) {
    var namespace = "M2012.UI.RichInput.DocumentView";
    M139.namespace(namespace, Backbone.View.extend({
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.RichInput.DocumentView
         *@param {Object} options 初始化参数集
         *@param {HTMLElement} options.textbox 文本框对象
         *@example
         */
        initialize: function (options) {
            this.setElement(document.body);

            this.initEvent();
        },
        initEvent: function () {
            this.$el.mousemove($.proxy(this, "onMouseMove"))
                .mouseup($.proxy(this, "onMouseUp"))
                .mousedown($.proxy(this, "onMouseDown"));
        },
        onMouseMove: function (e) {
            var current = M2012.UI.RichInput.Tool.currentRichInputBox;
            if (!current) return;
            var p = {
                x: e.clientX,
                y: e.clientY + current.tool.getPageScrollTop(),
                target: e.target
            };
            if (current.tool.dragEnable) {
                current.tool.drawDragEffect(p);
                current.tool.delay("drawInsertFlag", function () {
                    current.tool.drawInsertFlag(p);
                }, 20);
                e.preventDefault();
                return;
            } else if (current.selectArea) {
                //M2012.UI.RichInput.Tool.draw(current.startPosition, p);
                current.trySelect(current.startPosition, p);
                e.preventDefault();
                return;
            }
        },
        onMouseDown: function (e) {
            var o = e.target;
            var current;
            while (o) {
                //todo 巧合编程
                if (o.className && o.className.indexOf("RichInputBox") > -1) {
                    current = M2012.UI.RichInput.getInstanceByContainer(o);
                    break;
                }
                o = o.parentNode;
            }
            M2012.UI.RichInput.Tool.currentRichInputBox = current;
            for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
                var item = M2012.UI.RichInput.instances[i];
                if (item != current) item.unselectAllItems();
            }
        },
        onMouseUp: function (e) {
            M2012.UI.RichInput.Tool.fireDelay("drawInsertFlag");
            var current = M2012.UI.RichInput.Tool.currentRichInputBox;
            if (!current) return;
            if (M2012.UI.RichInput.Tool.dragEnable) {
                var dragItems = M2012.UI.RichInput.Tool.dragItems;
                var insertFlag = M2012.UI.RichInput.Tool.insertFlag;
                if (insertFlag && dragItems && insertFlag.richInputBox) {
                    var insertCurrent = insertFlag.richInputBox;
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        insertCurrent.insertItem(moveItem.allText, {
                            isAfter: insertFlag.isAfter,
                            element: insertFlag.element,
                            isFocusItem: true,
                            testRepeat: moveItem.richInputBox == insertCurrent ? false : true //当前拖拽，不排重(手动remove)；多个实例拖拽，要排重
                        });
                        moveItem.remove();
                    }
                    for (var i = 0; i < dragItems.length; i++) {
                        var moveItem = dragItems[i];
                        moveItem.remove();
                    }
                }
            } else if (current.selectArea) {
                var endPosition = {
                    x: e.clientX,
                    y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
                };
                //M2012.UI.RichInput.Tool.draw(current.startPosition, endPosition);
                current.trySelect(current.startPosition, endPosition);
                if (current.getSelectedItems().length == 0) {
                    //todo
                    //Utils.focusTextBox(current.textbox);
                }
            } else {
                return;
            }
            if ($.browser.msie) {
                //this.releaseCapture();
                if (M2012.UI.RichInput.Tool.captureElement) {
                    M2012.UI.RichInput.Tool.captureElement.releaseCapture();
                    M2012.UI.RichInput.Tool.captureElement = null;
                }
            } else {
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            M2012.UI.RichInput.Tool.dragEnable = false;
            current.selectArea = false;
            M2012.UI.RichInput.Tool.dragItems = null;
            M2012.UI.RichInput.Tool.insertFlag = null;
            M2012.UI.RichInput.Tool.hidDragEffect();
            M2012.UI.RichInput.Tool.hidDrawInsertFlag();
            //M2012.UI.RichInput.Tool.currentRichInputBox = null;
        }
    }));

    var current;
    M2012.UI.RichInput.DocumentView.create = function () {
        if (!current) {
            current = new M2012.UI.RichInput.DocumentView();
        }
        return current;
    }
})(jQuery, _, Backbone, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的子项元素对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.RichInput.ItemView";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.RichInput.ItemView.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.RichInput.ItemView
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@example
         new M2012.UI.RichInput.ItemView({
             text:"lifula@139.com",
             richInput:richInput,
             itemId:richInput.getNextItemId(),
             errorMessage:"收件人格式不对"
         }).render();
         */
        initialize: function (options) {
            var $el = jQuery(options.template || this.template);

            this.setElement($el);

            var This = this;
            this.richInputBox = options.richInput;
            this.type = options.type;
            this.allText = options.text;

            if (this.type == "email" && /^\d+$/.test(this.allText)) {
                this.allText += "@139.com";
            }

            this.hashKey = this.addr = this.getAddr();
			this.account = $Email.getAccount(this.addr);
			this.domain = $Email.getDomain(this.addr);
            this.itemId = options.itemId;
            if (!this.addr) {
                this.error = true;
                this.errorMsg = options.errorMessage;
                this.$el.addClass(this.errorClass);
            }
            if(this.richInputBox.errorfun){
            	this.richInputBox.errorfun(this, this.allText);
            	if(this.error)this.$el.addClass(this.errorClass);
            }
            this.selected = false;

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        selectedClass: "addrSel",
        hoverClass: "addrHover",
        errorClass:"addrError",
		errorDomainClass:"addrDomainError",//给下面的div增加float:none;样式,兼容360,ie8,google浏览器(不然会有换行显示分号的问题)
        template: '<div style="margin-right:4px;cursor: default;max-width:99%;overflow:hidden;" class="addrBase" unselectable="on"><b></b><span style="float:none;"></span><span style="float:none;">;</span></div>',
        render: function () {
            var This = this;
            var title = this.error ? this.errorMsg : this.addr;
            var text = this.error ? this.allText : this.getName();

            //this.$el.text(text).attr("title", title).append("<span>;</span>");

            this.$el.attr("title", title);

            if (this.error) {
                this.$("b").text(this.allText);
            } else {
                if (this.allText.indexOf("<") > -1) {
                    this.$("b").text(text);
					if(this.type == 'email'){
						this.$("span:eq(0)").html("&lt" + this.account + "<span class='addrDomain'>@"+ this.domain + "</span>&gt");
					}else{
						this.$("span:eq(0)").text("<" + this.getAddr() + ">");
					}
                } else {
					if(this.type == 'email'){
						this.$("b").html(this.account + "<span class='addrDomain'>@" + this.domain + "</span>");
					}else{
						this.$("b").text(this.allText);
					}
                }
            }

            this.$el.attr("rel", this.itemId);


            this.initEvents();


            //设置最大宽度
            if ($B.is.ie && $B.getVersion() < 8) {
                var containerWdith = this.richInputBox.$el.width();
                setTimeout(function () {
                    var width = This.$el.width();
                    if (width > 200 && (width + 10) > containerWdith) {
                        This.$el.width(containerWdith - 10);
                    }
                }, 0);
            }


            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *初始化事件
         *@inner
         */
        initEvents:function(){

            this.$el.bind("click",$.proxy(this,"onClick"));
            this.$el.bind("mousedown",$.proxy(this,"onMouseDown"));
            this.$el.bind("dblclick",$.proxy(this,"onDblclick"));
            this.$el.bind("mouseenter", $.proxy(this, "onMouseEnter"));
            this.$el.bind("mouseleave", $.proxy(this, "onMouseLeave"));

            this.on("select",function(){
                this.$el.addClass(this.selectedClass);
                this.$el.removeClass(this.hoverClass);
            }).on("unselect",function(){
                this.$el.removeClass(this.selectedClass);
            }).on("errorDomain",function(){
				this.$el.attr("title", '该地址的域名可能不存在，请双击修改');
				this.$el.addClass(this.errorDomainClass);
			}).on("changeDomain",function(e){
				this.addr = this.addr.replace('@' + e.errorDomain,'@' + e.domain);
				this.allText = this.allText.replace('@' + e.errorDomain,'@' + e.domain);
				this.domain = e.domain;
				delete this.richInputBox.hashMap[this.hashKey];
				this.hashKey = this.addr;
				this.richInputBox.hashMap[this.hashKey] = this;
				this.$el.removeClass(this.errorDomainClass);
				this.$el.attr("title",this.addr);
				this.$el.find("span.addrDomain").html('@' + e.domain);
			});
        },
        /**
         *@inner
         */
        getAddr:function(){
            var addr = this.richInputBox.contactsModel.getAddr(this.allText, this.type);
            if (this.type == "email") {
                var domain = this.options.limitMailDomain;
                if (domain && $Email.getDomain(addr) !== domain) {
                    addr = "";
                }
            }
            return addr;
        },
        /**
         *@inner
         */
        getName:function(){
            var name = this.richInputBox.contactsModel.getName(this.allText,this.type);
            return name; 
        },

        /**
         *选中该成员
         */
        select: function() {
            var element = this.element;
            richInputBox = this.richInputBox;
            this.selected = true;
            //todo remove to parentview
            if ($.browser.msie) { 
                var jTextBox = richInputBox.jTextBox;
                //鼠标划选的时候多次触发 有性能问题，所以延迟
                M2012.UI.RichInput.Tool.delay("ItemFocus", function() {
                    richInputBox.focus();
                });
            } else if ($.browser.opera) {
                var scrollTop = richInputBox.container.parentNode.scrollTop;
                richInputBox.textbox.focus();
                richInputBox.container.parentNode.scrollTop = scrollTop;
            } else {
                richInputBox.focus();
            }
            this.trigger("select");
        },
        /**
         *取消选中状态
         */
        unselect: function() {
            this.selected = false;
            this.trigger("unselect");
        },
        /**
         *移除元素
         */
        remove: function() {
            //todo
            this.richInputBox.disposeItemData(this);
            return superClass.prototype.remove.apply(this,arguments);
        },

        /**
         *鼠标移入
         *@inner
         */
        onMouseEnter: function () {
            if (!this.$el.hasClass(this.selectedClass)) {
                this.$el.addClass(this.hoverClass);
            }
        },

        /**
         *鼠标移出
         *@inner
         */
        onMouseLeave: function () {
            this.$el.removeClass(this.hoverClass);
        },

        /**
         *双击执行编辑
         *@inner
         */
        onDblclick: function (e) {
            this.richInputBox.editItem(this);
        },
        /**
         *鼠标按下
         *@inner
         */
        onMouseDown: function(e) {
            var current = this.richInputBox;
            if (!e.shiftKey && !e.ctrlKey) {
                //todo move to parentview
                if (!this.selected) {
                    var selectItems = current.getSelectedItems();
                    for (var i = 0; i < selectItems.length; i++) {
                        selectItems[i].unselect();
                    }
                }
                this.select();
            }
            //$Event.stopEvent();
        },
        /**
         *鼠标点击
         *@inner
         */
        onClick: function(e) {
            this.el.focus();
            var current = this.richInputBox;
            if (!e.shiftKey && !e.ctrlKey) {
                current.unselectAllItems();
                this.select();
            } else if (e.shiftKey) {
                shiftSelectItem(this);
            } else if (e.ctrlKey) {
                this.selected ? this.unselect() : this.select();
            }
            current.lastClickItem = this;

            //按住shift选中
            function shiftSelectItem(item) {
                if (!current.lastClickItem || current.lastClickItem == item) return;
                var items = current.getItems();
                var a = $.inArray(current.lastClickItem, items);
                var b = $.inArray(item, items);
                var min = Math.min(a, b);
                var max = Math.max(a, b);
                $(items).each(function(index) {
                    if (index >= min && index <= max) {
                        this.select();
                    } else {
                        this.unselect();
                    }
                });
            }
        }
    }));
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义通讯录富文本框的插件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var namespace = "M2012.UI.RichInput.Plugin";
    M139.namespace(namespace, 
    /**@lends M2012.UI.RichInput.Plugin */
    {
		AddrSuggest:function(richInput,maxItem){
			M2012.Contacts.getModel().requireData(function () {
				new M2012.UI.Suggest.AddrSuggest({
					textbox:richInput.textbox,
					filter: richInput.type,
                    maxItem:maxItem
				}).on("select", function () {
				    richInput.createItemFromTextBox();
				});
			});
		}
	});
})(jQuery, _, M139);
﻿; (function ($, _, M139, top) {

    var supperClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.Contact";

    M139.namespace(_class, supperClass.extend({

        name: _class,
        master: null,
        defaults: {
            //是否显示"添加参与人主题"
            showTitle: true,
            //是否展示联系人输入区域
            canInvite: false,
            //是否有联系人信息
            hasContact: false,
            //是否显示状态列
            showStatus: false,
            //是否显示短信资费提示信息
            showFreeInfo: false,
            //短信套餐说明信息
            freeInfo: "",
            //是否仅仅是139邮箱联系人
            isOnly139: false,

            actionType: 0,
            emailNotify: 1,
            inviteAuth: 2,
            inviterUin: "",
            name: "",
            recEmail: "",
            recMobile: "",
            refuseResion: "",
            shareType: 2,
            shareUin: "",
            smsNotify: 0,
            status: 0
        },

        /**
         *  联系人信息实体
         *  @param {Object}  args.master //视图主控
        **/
        initialize: function (args) {
            var self = this;
            self.master = args.master || window.$Cal;

            self.initEvents();
            //用传入的参数初始化数据模型
            self.initData(args);

            supperClass.prototype.initialize.apply(self, arguments);
        },

        /**
      *  用传入的参数初始化数据模型
      *  @param {Object}  args //联系人相关信息
     **/
        initEvents: function () {
            var self = this;

            //监控显示资费提醒标示，用以下载资费提示信息
            self.on("change:showFreeInfo", function () {

                if (!self.get("showFreeInfo"))
                    return;

                self.initCalendar(function (args) {
                    var freeInfo = args && args.freeInfo ? args.freeInfo : "";
                    self.set({
                        freeInfo: freeInfo
                    });
                });
            });
        },

        /**
         *  用传入的参数初始化数据模型
         *  @param {Object}  args //联系人相关信息
        **/
        initData: function (args) {
            var self = this;

            if (_.isEmpty(args)) {
                return;
            }

            //对比每一个键值，键值和数据类型相同则更新
            for (var key in args) {
                if (!_.has(self.attributes, key)) {
                    continue;
                }
                if (typeof self.get(key) === typeof args[key]) {
                    var data = {};
                    data[key] = args[key];
                    self.set(data);
                }
            }
        },

        /**
         *  联系选择控件
         *  @param {String}  email //邮件地址
        **/
        isDefaultSender: function (email) {
            var self = this;
            var accounts = M2012.Calendar.Model.Contact.getCurrUserAccounts();
            return _.contains(accounts, email);
        },

        /**
         *  获取联系人实体信息
         *  @param {Object}  args //联系人
         */
        getContact: function (args) {
            var self = this;
            var data = $.extend(self.getObject(args), {
                master: self.master
            });
            return new M2012.Calendar.Model.Contact(data);
        },

        /**
         *  结合通讯录获取完善的联系人信息
         *  @param {Object or String}  obj //联系人信息或联系人邮件地址
        **/
        getObject: function (obj) {
            obj = obj || {};
            var self = this;
            var type = $.type(obj);

            switch (type) {
                //如果只传一个email地址过来则需要转化为对象
                case "string":
                    obj = {
                        email: $T.Email.getEmail(obj),
                        emailNotify: 1,
                        smsNotify: 0
                    };
                    break;
                case "object":
                    var domain = self.master.capi.getEmailDomain();
                    var email = obj.recEmail || 'undefined@' + domain;
                    obj.email = $T.Email.getEmail(email);
                    break;
            }

            if (!obj.email)
                return null;

            var contactInfo = self.getContactInfo(obj.email) || {};
            return {
                shareUin: obj.email,
                inviterUin: obj.email,
                recEmail: obj.email,
                smsNotify: obj.smsNotify || 0,
                emailNotify: obj.emailNotify || 0,
                // 新增,邀请活动的状态
                status: obj.status || 0,
                // 拒绝原因,用于拒绝别人邀请的活动(默认为空串)
                refuseResion: obj.refuseResion || "",
                recMobile: contactInfo.mobile || "",
                name: contactInfo.name || "",
                actionType: 0,
                shareType: 2,
                inviteAuth: 2
            };
        },

        /**
         *  过滤模型数据，返回指定的邀请信息
        **/
        filterData: function () {
            var self = this;
            var data = self.toJSON();

            return {
                actionType: data.actionType || 0,
                emailNotify: data.emailNotify || 0,
                inviteAuth: data.inviteAuth || 2,
                inviterUin: data.inviterUin || "",
                name: data.name || "",
                recEmail: data.recEmail || "",
                recMobile: data.recMobile || "",
                refuseResion: data.refuseResion || "",
                shareType: data.shareType || 2,
                shareUin: data.shareUin || "",
                smsNotify: data.smsNotify || 0,
                status: data.status || 0
            }
        },

        /**
         *  结合通讯录信息，通过邮件地址获取联系人信息
         *  @param {String}  email //邮件地址
         **/
        getContactInfo: function (email) {
            var _this = this;
            var mobile = "";
            var name = "";

            if (!window.ISOPEN_CAIYUN) { //TODO 先做邮箱内的
                var contactInfo = top.Contacts.getContactsByEmail(email);

                if (contactInfo && contactInfo.length > 0) {
                    mobile = contactInfo[0].MobilePhone;
                    name = contactInfo[0].AddrFirstName
                }

                // 产品要求,要么有手机号,要么就根据输入的邮件地址判断是否手机号
                // 这个最原始的添加日历页面中也是这样的逻辑,迁移过来先
                var domain = _this.master.capi.getEmailDomain();
                var userMobile = mobile || ($Email.getDomain(email) == domain ? $Email.getName(email) : "");
                userMobile = $Mobile.isChinaMobile(userMobile) ? userMobile : "";
            }
            return {
                mobile: userMobile,
                name: name
            };
        },

        /**
         * 根据邀请状态值获取状态信息
         * @param {Number} status   //邀请状态
        **/
        getStatusDesc: function (status) {
            switch (status) {
                case 0:
                    return "未回复";
                case 1:
                    return "已接受";
                case 2:
                    return "已谢绝";
                case 3:
                    return "已删除";
                default:
                    return "未回复";
            }
        },

        /**
         * 判断邮箱地址是否是139邮箱地址
         * @param {String} email //邮箱地址
        **/
        checkIs139Mail: function (email) {
            var self = this;

            if (!self.get("isOnly139"))
                return true;

            var domain = self.master.capi.getEmailDomain();
            return $Email.getDomain(email) == domain;
        },

        /**
         * 初始化日历,获取联系人控件中的短信赠送信息
         * @param {Function} fnSuccess   //执行成功后的处理函数
         * @param {Function} fnError     //执行失败后的处理函数
        **/
        initCalendar: function (fnSuccess, fnError) {
            var self = this;
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.initCalendar({
                        data: { comeFrom: 0 },
                        success: function (result) {
                            if (result.code == "S_OK") {
                                fnSuccess && fnSuccess(result["var"]);
                            } else {
                                var msg = "获取日历初始化信息失败 ";
                                fnError && fnError(msg);
                                self.logger.error(msg, result);
                            }
                        },
                        error: function (e) {
                            var msg = "获取日历初始化信息失败 ";
                            fnError && fnError(msg);
                            self.logger.error(msg);
                        }
                    });
                }

            });
        }

    }, {

        /**
         *  获取当前用户的所有账号信息
         */
        getCurrUserAccounts: function () {
            var accounts = [];

            //先获取用户的账号列表
            if (!window.ISOPEN_CAIYUN) {
                var mailList = top.$User.getAccountList() || [];
                accounts = _.map(mailList, function (item) {
                    return item.name;
                });
            }
            return accounts;
        }
    }));

    (function () {

        var base = Backbone.Collection;
        var current = "M2012.Calendar.Collection.Contact";

        M139.namespace(current, base.extend({

            name: current,

            /**
             *  联系人集合
             *  @param {Object}  master //日历视图主控
             **/
            initialize: function (args) {
                var self = this;

                args = args || {};
                self.master = args.master || window.$Cal;

                base.prototype.initialize.apply(self, arguments);
            },

            /**
             *  是否存在指定联系人
             *  @param {Sting}  email //联系人邮件地址
            **/
            isExist: function (email) {
                var self = this;
                var exist = false;

                email = $T.Email.getEmail(email);

                $.each(self.models, function (i, model) {
                    if (model.get("recEmail") === email) {
                        exist = true;
                        return false;
                    }
                });
                return exist;
            },

            /**
             *  获取所有联系人信息
             *  @return {Array}   //联系人信息集合
            **/
            toArray: function () {
                var self = this;
                var data = [];
                //需要将实体中的数据进行过滤，只返回后台需要的字段
                $.each(self.models, function (i, model) {
                    data.push(model.filterData());
                });
                return data;
            }


        }));

    })();


}(jQuery, _, M139, window._top || window.top));




﻿
; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Contact";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //当前控件的父容器jQuery对象
        container: null,

        model: null,

        //联系人集合
        contacts: null,

        //联系人最大选择数
        maxCount: 20,
        //控件宽度
        width: 458,
        /**
	     * 联系人选择控件
		 * @param {Object}  args.master //日历视图主控 (可选)
		 * @param {jQuery Object}  args.container  //控件所在容器
		 * @param {Number} args.width   //控件宽度 (可选)
         * @param {Number} args.maxCount  //可选联系人个数(可选)         
         * @param {Number} args.showFreeInfo  //是否显示短信套餐信息(可选)，默认为true
         * @param {Number} args.showTitle  //是否显示添加联系人标头(可选)， 默认为true
         * @param {Number} args.isOnly139  //是否仅能输入139邮箱地址(可选)，默认为false      
         * @param {Number} args.placeHolder  //输入框默认提示语(可选)    
		**/
        initialize: function (args) {
            var self = this;
            superClass.prototype.initialize.apply(self, arguments);

            args = args || {};
            self.container = args.container || $(document.body);
            self.master = args.master || window.$Cal;

            if (_.isNumber(args.width))
                self.width = args.width;

            if (_.isNumber(args.maxCount))
                self.maxCount = args.maxCount;

            if (args.placeHolder) {
                self.TIPS.PLACEHOLDER = args.placeHolder;
            }

            //给视图绑定数据模型
            self.model = new M2012.Calendar.Model.Contact({
                master: self.master
            });
            //给视图指定一个数据集合
            self.contacts = new M2012.Calendar.Collection.Contact();

            self.render();
            self.initEvents();
            self.initControls(args);
        },

        TIPS: {
            PLACEHOLDER: '请输入邮箱地址，多个地址以逗号“，”隔开',
            MSG_INVITE_MAX: '邀请人数已达到上限{count}人',
            EMAIL_EXIST: '该好友已被邀请过',
            EMAILS_EXIST: '以下好友已被邀请过:<br />{emails}',
            NOT_ALLOW_ADD_MYSELF: "暂不支持添加自己",
            SMS_ONLY_CHINA_MOBILE: "暂只支持向移动手机号及移动手机邮箱发送短信通知",
            ONLY_139_DOMAIN: "输入的邮箱地址必须是139邮箱地址"
        },

        initControls: function (args) {
            var self = this;
            //是否显示标题   
            if (_.isBoolean(args.showTitle)) {
                self.model.set({ showTitle: args.showTitle });
                //如果不显示标题则需要展示联系人添加区域
                if (!args.showTitle)
                    self.model.set({ canInvite: true });
            }
            //是否仅显示139邮箱联系人
            if (_.isBoolean(args.isOnly139)) {
                self.model.set({
                    isOnly139: args.isOnly139
                });
            }        
            //是否显示短信资费提示信息,默认显示
            var showFreeInfo = true;
            if (_.isBoolean(args.showFreeInfo))
                showFreeInfo = args.showFreeInfo;

            self.model.set({ showFreeInfo: showFreeInfo });
        },

        /**
		 *  初始化页面的监听事件
		**/
        initEvents: function () {
            var self = this;

            //监控Model数据变化
            self.model.on("change", function () {
                //是否展示联系人输入区域
                if (self.model.hasChanged("showTitle")) {
                    if (self.model.get("showTitle")) {
                        self.getElement("toggle").removeClass("hide");
                        self.getElement("inviteArea").addClass("tips").addClass("boxContact");
                        return;
                    }
                    self.getElement("toggle").addClass("hide");
                    self.getElement("inviteArea").removeClass("tips").removeClass("boxContact");
                    self.getElement("sms_freeInfo").find("p").css("padding-top", "10px");
                }
                    //是否显示联系人控件区域
                else if (self.model.hasChanged("canInvite")) {
                    if (self.model.get("canInvite")) {
                        self.getElement("toggle").find("span").text("-");
                        self.getElement("inviteArea").removeClass("hide");
                        return;
                    }
                    self.getElement("toggle").find("span").text("+");
                    self.getElement("inviteArea").addClass("hide");
                }
                    //是否显示联系人列表
                else if (self.model.hasChanged("hasContact")) {

                    if (self.model.get("hasContact")) {
                        self.getElement("list_container").removeClass("hide");
                        return;
                    }
                    self.getElement("list_container").addClass("hide");
                }
                    //短信套餐信息
                else if (self.model.hasChanged("freeInfo")) {

                    var value = self.model.get("freeInfo");
                    value = $T.Html.encode(value);
                    self.getElement("msg_info").html(value);
                }
                    //是否显示短信资费信息
                else if (self.model.hasChanged("showFreeInfo")) {

                    if (self.model.get("showFreeInfo")) {
                        self.getElement("sms_freeInfo").removeClass("hide");
                        return;
                    }
                    self.getElement("sms_freeInfo").addClass("hide");
                }
                    //是否显示邀请状态列信息
                else if (self.model.hasChanged("showStatus")) {

                    var container = self.getElement("list_container");
                    if (self.model.get("showStatus")) {
                        container.find("th.td6").removeClass("hide");
                        container.find("td.td6").removeClass("hide");
                        return;
                    }
                    container.find("th.td6").addClass("hide");
                    container.find("td.td6").addClass("hide");
                }
            });

            //监听新增联系人信息
            self.contacts.on("add", function (model, collection, args) {

                self.renderRow(model);
                //显示联系人列表
                self.model.set({ hasContact: true });

                //是否通知调用方
                var notify = true;
                if (args && _.isBoolean(args.notify))
                    notify = args.notify;

                if (notify)
                    self.notifyChanged();

                //监听删除联系人信息
            }).on("remove", function (model) {
                var express = "tr[mid='{0}']";
                express = $T.format(express, [model.cid]);
                self.getElement("tbody").find(express).remove();

                //如果联系人为空需要隐藏联系人列表
                if (self.contacts.length === 0)
                    self.model.set({ hasContact: false });

                self.notifyChanged();

                //监听更新联系人信息
            }).on("reset", function (model) {
                self.notifyChanged();
            });
        },

        /**
         *  数据变化后通知调用方        
         **/
        notifyChanged: function () {
            var self = this;
            var data = self.contacts.toArray();
            self.trigger("change", data);
        },

        /**
         *  呈现联系人信息数据行
         * @param {Object} model //联系人信息
         **/
        renderRow: function (model) {
            var self = this;
            var value = model.toJSON();

            if (!value)
                return;

            var data = {
                mid: model.cid,
                email: value.recEmail,
                name: $T.Html.encode(value.name) || value.recEmail,
                showStatus: self.model.get("showStatus") ? "" : "hide",
                statusDesc: self.model.getStatusDesc(value.status),
                checkEmail: (value.emailNotify == 1) ? "checked" : "",
                checkSms: (value.smsNotify == 1) ? "checked" : "",
                showReason: value.refuseResion ? "" : "hide",
                refuseResion: $T.Html.encode(value.refuseResion),
                smsDesc: value.recMobile ? "" : self.TIPS.SMS_ONLY_CHINA_MOBILE,
                smsEnable: value.recMobile ? "" : "disabled"
            };

            var row = $($T.format(self.template.item, data));
            self.getElement("tbody").append(row);
        },

        /**
		 *  呈现视图内容
		**/
        render: function () {
            var self = this;
            var html = $T.format(self.template.main, {
                cid: self.cid,
                width: self.width
            });
            self.$el.remove();
            self.container.append(html);

            //选择联系人按钮定位
            self.container.find("div.addPeople > a").css({
                left: self.width - 30
            });

            //自动联想邀请人,在m2012.ui.richinput.view.js中调用
            self.addrInputEl = M2012.UI.RichInput.create({
                container: self.getElement("input").get(0),
                preventAssociate: true,
                placeHolder: self.TIPS.PLACEHOLDER,
                type: "email",
                maxSend: function () {
                    return self.maxCount - self.contacts.length;
                },
                //联系人超过最大限制时弹出提示信息
                onMaxSend: function () {
                    var html = self.TIPS.MSG_INVITE_MAX;
                    html = $T.format(html, { count: self.maxCount });
                    self.addrInputEl.showAddressTips({
                        html: html
                    });
                },
                errorfun: function (obj, text) {
                    var email = $T.Email.getEmail(text);
                    if (!$Email.isEmailAddr(email))
                        return;

                    //邮箱地址转小写
                    email = email.toLowerCase();

                    //已经存在
                    if (self.contacts.isExist(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.EMAIL_EXIST;
                        return;
                    }

                    if (!self.model.checkIs139Mail(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.ONLY_139_DOMAIN;
                        return;
                    }
                    //是否是本人
                    if (self.model.isDefaultSender(email)) {
                        obj.error = true;
                        obj.errorMsg = self.TIPS.NOT_ALLOW_ADD_MYSELF;
                        return;
                    }
                    //自动添加,setTimeout是因为清除email时，richinput还没执行完,
                    setTimeout(function () {
                        self.addContact(email);
                        self.addrInputEl.clear();
                    }, 100);
                }
            }).render();

            //显示/隐藏联系人区域
            self.getElement("toggle").click(function () {
                self.model.set({
                    canInvite: !self.model.get("canInvite")
                });
            });

            //弹出通讯录联系人选择框
            self.getElement("add_contact").click(function () {
                top.M2012.UI.Dialog.AddressBook.create({
                    filter: "email",
                    showSelfAddr: false,
                    maxCount: self.maxCount

                }).on("select", function (e) {
                    if (e && e.value && e.value.length > 0) {
                        $.each(e.value, function (i, n) {
                            var email = $T.Email.getEmail(n);
                            if (!$Email.isEmailAddr(email))
                                return true;

                            //邮箱地址转小写
                            email = email.toLowerCase();

                            //判断已经存在
                            if (self.contacts.isExist(email))
                                return true;

                            if (!self.model.checkIs139Mail(email))
                                return true;

                            if (self.model.isDefaultSender(email))
                                return true;

                            if (!self.addContact(email))
                                return false;

                            return true;
                        });
                    }

                }).on("additemmax", function () {
                    top.$Msg.alert($T.format(self.TIPS.MSG_INVITE_MAX, {
                        count: self.maxCount
                    }));

                });
            });

            //点击表格区域时的处理
            self.getElement("list_container").click(function (e) {
                var targetEl = $(e.target);
                var tagName = targetEl[0].tagName.toLowerCase();

                //点击了删除链接
                if (tagName === "a") {
                    var mid = targetEl.attr("mid");
                    if (mid) {
                        var model = self.contacts.get(mid);
                        model && self.contacts.remove(model);
                        return;
                    }
                    //邀请拒绝状态按钮点击
                    //如果有拒绝理由则显示相应提示
                    if (targetEl.attr("refuseResion")) {
                        self.showRefuseInfo(targetEl);
                    }
                }
                    //点击了提醒方式设置
                else if (tagName === "input") {
                    var mid = targetEl.attr("mid");
                    if (mid) {
                        var model = self.contacts.get(mid);
                        if (!model)
                            return;

                        var key = targetEl.attr("id").split("_")[1];
                        var data = {};
                        data[key] = targetEl[0].checked ? 1 : 0;
                        model.set(data);
                        self.contacts.reset(self.contacts.models);
                    }
                }
            });
        },

        /**
        *  添加联系人信息到集合
        *  @param {String}  email //是否显示联系人状态信息
        *  @param {Object}  options //新增设置选项, options.notify标示数据改变后是否通知调用方        
       **/
        addContact: function (email, options) {
            var self = this;
            if (self.contacts.length == self.maxCount) {
                top.$Msg.alert($T.format(self.TIPS.MSG_INVITE_MAX, {
                    count: self.maxCount
                }));
                return false;
            }
            var data = self.model.getContact(email);
            self.contacts.add(data, options);
            return true;
        },

        /**
         *  设置控件信息
         *  @param {Boolean}  args.showStatus //是否显示联系人状态信息
         *  @param {Array}  args.inviteInfo //联系人信息列表
        **/
        setData: function (args) {
            var self = this;
            if (!args)
                return;

            //显示邀请状态列表
            if (_.isBoolean(args.showStatus)) {
                self.model.set({ showStatus: args.showStatus });
            }

            //邀请信息
            if (_.isArray(args.contacts)) {
                $.each(args.contacts, function (i, n) {
                    self.addContact(n, {
                        notify: false
                    });
                });
                //设置是否有联系人
                if (self.contacts.length > 0) {
                    self.model.set({ canInvite: true });
                }
            }
        },

        /**
         * 获取已选择的联系人信息
        **/
        getData: function () {
            var self = this;
            return self.contacts.toArray();
        },

        /**
         * 点击查看拒绝详情图标,则弹出详情提示信息框
         * @param {jQuery Object}  el //目标元素
         **/
        showRefuseInfo: function (el) {
            var self = this;
            if (self.popTip) {
                self.popTip.close();
                self.popTip = null;
            }
            self.popTip = M139.UI.Popup.create({
                name: "tips_reject_reason",
                target: el,
                width: 150,
                closeClick: function () {
                    self.popTip = null;
                },
                direction: "up",
                content: $T.format(self.template.refuseResion, {
                    reason: el.attr("refuseResion")
                }) //这里可能存在二次转码
            });
            self.popTip.render();
        },

        /**
		 *  获取id以{cid}开头的html元素
		 *  @return {jQuery Object}   
		**/
        getElement: function (id) {
            var self = this;
            return $($T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            }));
        },

        /**
		 * HTML模版
		**/
        template: {
            main: ['<a href="javascript:void(0);" id="{cid}_toggle"><span class="widtac10">+</span> 添加其他参与人</a>',
					'<div id="{cid}_inviteArea" class="tips boxContact hide" style="position:relative;width:{width}px;">',
						//添加联系人
						'<div class="tips-text">',
							'<div class="tips-text-div">',
								'<fieldset>',
									'<ul style="border:0px;">',
										'<li>',
											'<div class="clearfix">',
												'<div class="addPeople" style="width:{width}px;">',
													'<div id="{cid}_input"></div>',
													'<a id="{cid}_add_contact" href="javascript:void(0);" style="z-index: 4;"></a>',
												'</div>',
											'</div>',
											 // 展开的联系人列表
											'<div id="{cid}_list_container" class="addPeopleMain hide">',
												'<table class="meetformtab" style="width:{width}px;">',
													'<thead>',
														'<tr>',
															'<th>参与人</th>',
															'<th class="td4">通知方式</th>',
															'<th class="td6 hide">状态</th>',
															'<th class="td5">操作</th>',
														'</tr>',
													'</thead>',
													'<tbody id="{cid}_tbody">',
													'</tbody>',
												'</table>',
											'</div>',
										'</li>',
										'<li id="{cid}_sms_freeInfo"  class="hide" >',
											'<p style="color: #999;">使用短信通知参与人，会产生短信费用。</p>',
											'<span id="{cid}_msg_info" style="color: #999;">本月赠30条，余30条，超出按0.1元/条计费。每天限发250条，每月限发2500条</span>',
										'</li>',
									'</ul>',
								'</fieldset>',
							'</div>',
						'</div>',
						'<div class="tipsTop diamond" style="left:35px;"></div>',
					'</div>'].join(""),

            item: ['<tr mid="{mid}">',
                        '<td style="word-break:break-all;" title="{email}">{name}</td>',
                        '<td class="td4">',
                            '<input id="{mid}_emailNotify" type="checkbox" mid="{mid}" {checkEmail} /><label for="{mid}_emailNotify" class="mr_10 ml_5">邮件</label>',
                            '<input id="{mid}_smsNotify" type="checkbox" mid="{mid}"   {checkSms} {smsEnable} title="{smsDesc}" /><label for="{mid}_smsNotify" title="{smsDesc}" class="ml_5">短信</label>',
                        '</td>',
                        '<td class="td6 {showStatus}">',
							'{statusDesc}<a href="javascript:void(0);" class="i_warn_min warnTips {showReason}" refuseResion="{refuseResion}"></a>',
						'</td>',
                        '<td class="td5"><a href="javascript:void(0);" mid="{mid}">删除</a></td>',
                    '</tr>'].join(""),
            refuseResion: '<p class="mr_5 mt_10" style="word-wrap:break-word; word-break:break-all;">{reason}</p>'
        }

    }));

}(jQuery, _, M139, window._top || window.top));
