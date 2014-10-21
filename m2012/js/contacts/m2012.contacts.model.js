/**
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