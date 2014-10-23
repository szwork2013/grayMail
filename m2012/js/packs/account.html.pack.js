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
﻿/*global Backbone: false */

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
 * @fileOverview 定义HTML编辑器
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.Model
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.Model", {});


    M139.namespace("M2012.UI.HTMLEditor.Model.Editor", superClass.extend(
     /**
        *@lends M2012.UI.HTMLEditor.Model.Editor.prototype
        */
    {
        /** 编辑器基础类
        *@constructs M2012.UI.HTMLEditor.Model.Editor
        *@extends M139.Model.ModelBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.frame 必选参数，编辑区域的iframe对象
        *@param {HTMLElement} options.textArea 存放存文本内容的文本框对象（如果不使用纯文本模式，可以不传该参数）
        *@example
        */
        initialize: function (options) {
            var This = this;
            if (typeof options.frame != "object") {
                throw "缺少参数options.frame";
            }

            /**
            *编辑器是否加载完成进入可用状态
            *@field
            *@type {Boolean}
            */
            this.isReady = false

            /**
            *编辑器是否为html模式
            *@field
            *@type {Boolean}
            */
            this.isHtml = true;

            /**
            *编辑器iframe对象
            *@field
            *@type {HTMLIframe}
            */
            this.frame = options.frame;
            /**
            *编辑器iframe的jQuery对象
            *@field
            *@type {jQuery}
            */
            this.jFrame = $(this.frame);

            /**
            *编辑区iframe的window对象
            *@field
            *@type {Window}
            */
            this.editorWindow = null;

            /**
             *编辑区iframe的document对象
             *@field
             *@type {HTMLDocument}
            */
            this.editorDocument = null;

            /**
             *编辑区iframe的document的jQuery对象
             *@field
             *@type {jQuery}
            */
            this.jEditorDocument = null;

            /**
             *存放纯文本的文本框set
             *@field
             *@type {HTMLElement}
            */
            this.textArea = options.textArea || this.frame.ownerDocument.createElement("textarea");

            /**
             *存放纯文本文本框的jQuery对象
             *@field
             *@type {HTMLElement}
            */
            this.jTextArea = $(this.textArea);

            M139.Iframe.domReady(this.frame, function () {
                This.onReady();
            });

            return superClass.prototype.initialize.apply(this, arguments);
        },
        defaults: {
            name: "M2012.UI.HTMLEditor.Model.Editor",
            printerMode:"off" //格式刷状态
        },
        /**@inner*/
        onReady: function () {
            this.isReady = true;


            this.editorWindow = this.frame.contentWindow;
            this.editorDocument = this.frame.contentWindow.document;
            this.jEditorDocument = $(this.editorDocument);
            this.editorDocument.body._obj = this ;
            this.initEvents();

            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#ready
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("ready",function(e){});
            */
            this.trigger("ready");

        },

        /**
         *光标选择文字区域发生变化
         *@inner
         */
        onBookMarkChange: function () {
            if(this.get("printerMode") != "off"){
                var selectedFormat = this.getSelectedStyle();
                var formatForPrint = this.get("formatForPrint");
                if(!this.utilDeepEquals(selectedFormat,formatForPrint)){
                    
                    this.printFormat(formatForPrint);//格式化选中的内容
                }
            }

            /**光标选择区域发生变化
            * @name M2012.UI.HTMLEditor.Model.Editor#bookmarkchange
            * @event
            * @param {Object} e 事件参数
            * @example
            editor.on("bookmarkchange",function(e){});
            */
            this.trigger("bookmarkchange",{
                selectedStyle: this.getSelectedStyle()
            });

        },

        /**
         *判断2个对象的属性是否相等
         *@inner
         */
        utilDeepEquals:function(o1,o2){
            for(var p in o1){
                if(o1[p] !== o2[p]){
                    return false;
                }
            }
            return true;
        },

        /**@inner*/
        initEvents: function () {
            var This = this;
            //屏蔽可编辑区的脚本异常
            this.editorWindow.eval("window.onerror=function(){return true}");

            this.jEditorDocument.keydown(function (e) {
                var returnValue = This.onEditorFrameKeyDown(e);
                formatPrintOff(e);
                return returnValue;
            }).keyup(function (e) {
                This.onEditorFrameKeyUp(e);
            }).mousedown(function(e){
                This.onEditorFrameMouseDown(e);
            }).mouseup(function(e){
                This.onEditorFrameMouseUp(e);
            }).click(function () {
                This.onFocus();
            });

            this.jEditorDocument.find('body').on('paste',function(e){
                This.onPaste(e);
            });

            try {
                var edWin = this.editorWindow;
                M139.Event.GlobalEvent.on("click", function (e) {
                    if (e.window != edWin) {
                        if (This.focused) {
                            This.onBlur();
                        }
                    }
                });
                //编辑区iframe触发全局的鼠标键盘事件
                new M139.Event.GlobalEventManager({ window: this.editorWindow });

            } catch (e) {
                
            }

            $(document).on("keydown",formatPrintOff);
            var esc = M139.Event.KEYCODE.Esc;
            function formatPrintOff(e) {
                if (e.keyCode == esc) {
                    //退出格式刷
                    This.setFormatPrintOff();
                }
            }
            
            this.initWatchSelectChange();

            //ie下实现支持撤销
            this.initHistory();
        },

        /**
         *当获得焦点触发事件
         */
        onFocus: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("focus",function(e){});
            */
            this.trigger("focus");
            this.focused = true;
        },
        /**
         *当失去焦点触发事件
         */
        onBlur: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("blur",function(e){});
            */
            this.trigger("blur");
            this.focused = false;
        },
        /**
         *右键粘贴
         */
        onPaste: function (e) {
            /**
                * @name M2012.UI.HTMLEditor.Model.Editor#paste
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("paste",function(e){});
            */
            this.trigger("paste", e);
        },

        //实现监控选择区域变化
        //todo 实现方式要改，这个有时候会不触发
        /**@inner*/
        initWatchSelectChange:function(){
            var This = this;
            try{
                var selEl = this.getSelectedElement();
                var selCnt = this.getSelectedText();
                var selSelStyle = this.getSelectedStyle();
            }catch(e){}

            this.jEditorDocument.keydown(selChange).mouseup(selChange);
            this.on("afterexeccommand",selChange);
            function selChange(){
                var newSelEl = This.getSelectedElement();
                var newSelCnt = This.getSelectedText();
                var newSelStyle = This.getSelectedStyle();
                if(selEl !== newSelEl || selCnt !== newSelCnt || !This.utilDeepEquals(selSelStyle,newSelStyle)){
                    This.onBookMarkChange();
                }
                selEl = newSelEl;
                selCnt = newSelCnt;
                selSelStyle = newSelStyle;
            }
        },

        /**
         *在ie下实现手动的编辑记录（支持撤销和重做）
         *@inner
         */
        initHistory: function () {
            var This = this;
            //实现撤销功能
            var historyStack = [];
            var redoStack = [];
            var supportRedoMode = this.supportRedoMode = $B.is.ie;
            var history = this.history = {
                add: function () {
                    var len = historyStack.length;
                    var newHistory = {};
                    newHistory.html = This.editorDocument.body.innerHTML;
                    if (len === 0 || historyStack[len-1].html !== newHistory.html) {
                        if ($.browser.msie) {
                            newHistory.bookmark = This.getBookmarkData();
                        }
                        historyStack.push(newHistory);
                        if (historyStack.length > 11) {
                            historyStack.shift();
                        }
                        redoStack.length = 0;
                    }
                },
                undo: function () {
                    if (historyStack.length == 0) return;
                    history.add();
                    if (historyStack.length < 2) return;
                    redoStack.push(historyStack.pop());
                    var obj = historyStack[historyStack.length - 1];
                    this.goHistory(obj);
                },
                redo: function () {
                    if (redoStack.length == 0) return;
                    var obj = redoStack.pop();
                    this.goHistory(obj);
                    historyStack.push(obj);
                },
                goHistory: function (obj) {
                    //回退历史 ie
                    This.editorDocument.body.innerHTML = obj.html;
                    var range = This.editorDocument.body.createTextRange();
                    if ($B.is.ie) {
                        This.moveToBookmark(obj.bookmark);
                    }
                },
                //定时监控
                startWatch: function () {
                    This.historyTimer = setInterval(history.add, 3000);
                },
                init: function () {
                    if (this.hasInit) return;
                    this.hasInit = true;
                    //如果支持自定义的撤销
                    if (supportRedoMode) {
                        this.add();
                        this.startWatch();
                        This.on("beforeexeccommand", history.add);
                        This.on("afterexeccommand", history.add);
                    }
                }
            };


            //实现保存ie的bookmark
            if ($B.is.ie) {
                //fixed ie9ie10滚动的时候触发activate，恢复焦点造成的焦点老是跳的问题
                if ($B.is.ie && $B.getVersion() >= 9) {
                    this.jEditorDocument.on("mousedown", function () {
                        This.isMouseDown = true;
                    });
                    this.jEditorDocument.on("mouseup", function () {
                        This.isMouseDown = false;
                    });
                }
                this.jEditorDocument.on("beforedeactivate", function () {
                    //console.log("beforedeactivate");
                    This.saveBookMark();
                }).on('activate', function () {
                    //console.log("actived");
	//	$(this.editorDocument.body).on('focus', function () {
                    history.init();
                    if (This._keepBookmark) {
                        if ($B.is.ie && $B.getVersion() >= 9) {
                            if (This.isMouseDown) {
                                return;
                            }
                        }
                        //console.log("moved to bookmark");
                        This.moveToBookmark(This._keepBookmark);
                        This._keepBookmark = null;
                    }
                });
                setTimeout(function () {
                    history.init();
                }, 0);
            } else if($B.is.ie11) {
	            this.jEditorDocument.on("beforedeactivate", function () {
                    var selection = This.getSelection();
                    This.ie11BookMark = {
	                    node: selection.focusNode,
                        offset: selection.focusOffset
                    };
                });
            }
        },

        _keepBookmark: null,
        //保存光标选中的历史
        saveBookMark:function(){
            this._keepBookmark = this.getBookmarkData();
        },
        //根据历史记录设置光标
        moveToBookmark:function(bk){
            var doc = this.editorDocument;
            if (!bk || !bk.bookmark) return;
            var range = doc.body.createTextRange();
            var textLength = doc.body.innerHTML.length;
            range.moveToBookmark(bk.bookmark);
            var copy = range.duplicate();
            var startOffset = copy.moveStart("character", -textLength);
            var endOffset = copy.moveEnd("character", textLength);
            if (startOffset != bk.startOffset || endOffset != bk.endOffset) {
                range.moveStart("character", startOffset - bk.startOffset);
                range.moveEnd("character", endOffset - bk.endOffset);
            }
            try {
                range.select();
            } catch (e) { }
        },
        getBookmarkData:function () {
            var doc = this.editorDocument;
            var range;
            //return {};
            if(doc.selection) {
	            range = doc.selection.createRange();
            } else {
                //range = doc.createRange();	// 错，这个没有BookMark API
                //throw new Error("keep focus caret ERROR");
                range = doc.body.createTextRange();
            }
            var textLength = doc.body.innerHTML.length;
            var result = {};
            if (range.getBookmark) {//选中图片/表格,无法调用getBookmark
                result.bookmark = range.getBookmark();
                result.startOffset = range.moveStart("character", -textLength);
                result.endOffset = range.moveEnd("character", textLength);
            }
            return result;
        },

        /**@inner*/
        onEditorFrameKeyDown: function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 9) {//tab键
                var strTab = "&nbsp;&nbsp;&nbsp;&nbsp;";
                var sel = this.getSelection();
                var range = this.getRangeObject(sel);
                if ($.browser.msie) {//ie  
                    try {
                        range.pasteHTML(strTab);
                    } catch (e) { }
                } else {
                    var fragment = range.createContextualFragment(strTab);
                    var lastChild = fragment.lastChild; //获得DocumentFragment的末尾位置  
                    range.insertNode(fragment);
                    range.setEndAfter(lastChild);//设置末尾位置  
                    range.collapse(false);//合并范围至末尾  
                    sel.removeAllRanges();//清除range  
                    sel.addRange(range);//设置range  
                }
                M139.Event.stopEvent(e);
            } else if (code == 13 && !e.ctrlKey && !e.shiftKey) {
                //回车换行
                if ($.browser.msie) {
                    var sel = this.getSelection();
                    var range = this.getRangeObject(sel);
                    try {
                        var o = range.parentElement();
                        while (o) {
                            if (o.tagName == "P" && o == this.editorDocument.body.firstChild && this.editorDocument.body.childNodes.length == 1) {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            if (!/^(?:td|body|span|font|i|em|b)$/i.test(o.tagName)) {
                                break;
                            } else if (o.tagName == "TD" || o.tagName == "BODY") {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            o = o.parentNode;
                        }
                    } catch (e) { }
                }

            } 
            //撤销
            if (e.ctrlKey && this.supportRedoMode) {
                if (code == 90) {
                    this.undo();
                    M139.Event.stopEvent(e);
                } else if (code == 89) {
                    this.redo();
                    M139.Event.stopEvent(e);
                }
            }
            
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keydown
                * @event
                * @param {Object} e 事件参数
                * @example
                * todo: 坑。。。绑定事件还是处理事件，会引起误解
                editor.on("keydown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keydown", e);

            return e.returnValue;
        },
        onEditorFrameKeyUp:function(e){
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keyup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("keyup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keyup", e);
        },
        onEditorFrameMouseDown:function(e){
            /**抛出鼠标下按事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mousedown
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mousedown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mousedown", e);
        },
        onEditorFrameMouseUp:function(e){
            /**抛出鼠标松开事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mouseup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mouseup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mouseup", e);
        },

        /**不晓得干嘛用的，控件粘贴图片要做处理？*/
        replaceImage: function (fileName, uri) {
            this.editorWindow.focus();
            var imgs = this.editorDocument.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf("file:") >= 0 && unescape(imgs[i].src).indexOf(unescape(fileName)) > 0) {
                    imgs[i].src = uri;
                }
            }
        },

        focus:function(){
            try {
                this.editorWindow.focus();
            } catch (e) { }
        },

        //获取页面上选中的文字
        getSelectedText:function () {
            var win = this.editorWindow;
            if (win.getSelection) {
                return win.getSelection().toString();
            }else if(win.document.getSelection){
                return win.document.getSelection();
            }else if (win.document.selection){
                return win.document.selection.createRange().text;
            }
            return "";
        },

        /**
         *光标处插入图片
         *@param {String} uri 要插入的图片地址
         */
        insertImage: function (url) {
            var sel, range;

            this.editorWindow.focus();
            sel = this.getSelection();
            range = this.getRangeObject(sel);

            if ($B.is.ie && $B.getVersion() < 9) {  //IE678下outerHTML，pasteHTML，innerHTML方法插入图片，图片的路径会是绝对路径
                var html = M139.Text.Utils.format("&nbsp;&nbsp;<img crs='{0}' src='{0}' />",[url]);

                if (sel.type.toLowerCase() == 'control') {
                    range.item(0).outerHTML = html;
                } else {
                    try {
                        range.pasteHTML(html);
                    } catch (e) {
                        this.editorDocument.body.innerHTML = html + this.editorDocument.body.innerHTML;
                    }
                }
                $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                    this.src = url;
                    $(this).removeAttr('crs');
                });
            } else {
	            this.insertHTML("&nbsp;&nbsp;");
                this.execCommand("InsertImage", url);
            }

			// IE下默认会选择图片，不清除选区，插入会变成替换
			if ($B.is.ie) {
				range = this.getRangeObject();
				range.collapse(false); //合并范围至末尾
                sel.removeAllRanges && sel.removeAllRanges(); //清除range
                sel.addRange && sel.addRange(range);
			}

            $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                $(this).load(function () {
                    if (this.width > 520 && this.src.indexOf("attachId=") > 0) {
                        var orgWidth = this.width;
                        var orgHeight = this.height;
                        this.setAttribute("orgWidth", orgWidth);
                        this.setAttribute("orgHeight", orgHeight);
                        this.width = 520;
                    }
                });
            });
            this.trigger("insertImage", { url: url });
            
            // add by tkh 显示图片小工具
            var jEditorBody = $(this.editorDocument).find('body');
			top.$App.showImgEditor(jEditorBody);
        },

        /**
        *在光标处插入表格
        *@param {Object} options 初始化参数集
        *@param {Number} options.rows 表格的行数
        *@param {Number} options.cells 表格的列数
        *@param {Number} options.width 表格的宽度
        *@param {Number} options.height 表格的高度
        *@example
        */
        insertTable: function (options) {
            var rows = options.rows;
            var cells = options.cells;
            var htmlCode = "<table border='1' cellPadding='0' cellSpacing='0'>";
            //todo 高度和宽度没有实现
            for (var i = 0; i < rows; i++) {
                htmlCode += "<tr>";
                for (var j = 0; j < cells; j++) {
                    htmlCode += "<td style='min-width:50px;width:50px;' border='1'><div>&nbsp;</div></td>";
                }
                htmlCode += "</tr>";
            }
            htmlCode += "</table>&nbsp;";
            this.insertHTML(htmlCode);
        },

		execInsertHTML: function(html){
			var ie11bookmark, range, selection;

			this.editorDocument.body.focus();

			if($B.is.ie) {
				selection = this.getSelection();
				range = this.getRangeObject(selection);
				range.pasteHTML(html);
				return;
			}

			// 恢复IE11的光标位置
			else if($B.is.ie11){
				ie11bookmark = this.ie11BookMark;
				selection = this.getSelection();
				range = this.getRangeObject(selection);

				if(ie11bookmark){
					//console.log(ie11bookmark);
					range.setEnd(ie11bookmark.node, ie11bookmark.offset);
					range.collapse(false);
					selection.removeAllRanges(); //清除range
					selection.addRange(range);
				}
			}
			
			this.execCommand("insertHTML", html);
		},

		// 从当前光标位置分割父节点，直接指定的父节点为止
        splitOff: function() {
	        var This = this;
            //this.editorWindow.focus();
            $(this.editorDocument.body).focus();
           // setTimeout(function(){
            var selection = This.getSelection();
            var range = This.getRangeObject(selection);
            var docFrag, emptyNode;
            var ie11bookmark = This.ie11BookMark;

            if(ie11bookmark) {
                emptyNode = ie11bookmark.node;
            } else {
                emptyNode = range.startContainer || range.parentElement();
            }

            if(emptyNode == This.editorDocument.body) {
                return;
            }

            while(emptyNode.parentNode && emptyNode.parentNode !== This.editorDocument.body) {
                emptyNode = emptyNode.parentNode;
            }

            if($B.is.ie && $B.getVersion() < 9){
	            // moveEnd会将光标置于起始端，应该使用moveStart
	            // 其实只需要向上找到父元素为body的节点
	            range.moveStart("character", -emptyNode.innerHTML.length-1);
	            //range.moveToElementText(emptyNode);
	            //range.moveStart("character", -1);
	            range.select();
            } else {
	            range.collapse(false);
	            if($B.is.ie11 && ie11bookmark){
		            range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
		            range.setEnd(ie11bookmark.node, ie11bookmark.offset);
	            } else {
	                range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
                }
    	        selection.removeAllRanges(); //清除range
        	    selection.addRange(range);
            	//console.log("'"+range.toString()+"'");

	            //setTimeout(function(){
		            emptyNode = This.editorDocument.createElement("div");
		            emptyNode.innerHTML = "<br>&nbsp;<br>";
	                docFrag = range.extractContents();
	                docFrag.appendChild(emptyNode);
	           // }, 500);
        	}
        //}, 2000);

           //setTimeout(function(){
	           
            if($B.is.ie && $B.getVersion() < 9){
	            //var copy = range.duplicate();	// 被copy的range内容依然是活引用
	            //var text = range.text;
	            //range.text = "";
	            This.cut();
	            range.collapse(true);
	            range.select();
	            
	            //range.pasteHTML(copy.text);
	            range.pasteHTML("<div><br>&nbsp;&nbsp;</div>");
	            
	            range.moveStart("character", -100);
	            range.collapse(true);
	            range.select();
	            This.paste();
	            
	            range.moveEnd("character", 2);
	            range.collapse(false);
	            range.select();
	            //range.pasteHTML("<div>|MARK|</div>");
	            //console.log(range.text);
            } else {
                range.insertNode(docFrag);
                //range.insertNode(emptyNode);
                //$(this.editorDocument.body).prepend(docFrag);
                //this.execCommand("formatblock", "<div>");
                range.setEnd(emptyNode, 0);
                //range.setEndAfter(emptyNode); //设置末尾位置
                range.collapse(false);
                selection.removeAllRanges(); //清除range
                selection.addRange(range);
            }
            //}, 1000);
            //$(this.editorDocument.body).focus();
        },

        /**销毁对象，释放资源*/
        dispose: function () {
            //top.Debug.write("Editor Dispose");
            clearInterval(this.updateStateTimer);
            clearInterval(this.historyTimer);
        },

        /**得到选中区域对象*/
        getSelection: function () {
            var win = this.editorWindow;
            var userSelection;
            if (win.getSelection) {
                userSelection = win.getSelection();
            }
            else if (win.document.selection) {//Opera
                userSelection = win.document.selection;
            }
            return userSelection;
        },
        /**得到选中的范围对象*/
        getRangeObject: function (selection) {
            var selectionObject = selection || this.getSelection();
            if (selectionObject.createRange) {	// IE8 (xiaoyu)
                return selectionObject.createRange();
            } else if (selectionObject.getRangeAt && selectionObject.type == "Range") {
                return selectionObject.getRangeAt(0);
            } else if (this.editorDocument.createRange) {
                var range = this.editorDocument.createRange();
                try{
	                range.setStart(selectionObject.anchorNode||this.editorDocument.body, selectionObject.anchorOffset||0);
                	range.setEnd(selectionObject.focusNode||this.editorDocument.body, selectionObject.focusOffset||0);
                } catch(e){
	                console.log(selectionObject.anchorNode, selectionObject.focusNode);
                }
                return range;
            }
        },

        /*
         *特殊的元素类
        */
        StyleObjectElements: { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, embed: 1, object: 1, ol: 1, ul: 1 },

        /**
         *获得选中元素的类型
         *@inner
         *@returns {String} text|control|none
         */
        utilGetSelectedElementType: function (sel) {
            var type = "";
            if ($B.is.ie) {
                var ieType = this.editorDocument.selection.type;
                if (ieType == 'Text')
                    type = "text";
                if (ieType == 'Control')
                    type = "element";
                if (ieType == 'None')
                    type = "none";
            } else {
                type = "text";
                if (sel.rangeCount == 1) {
                    var range = sel.getRangeAt(0),
					    startContainer = range.startContainer;
                    if (startContainer == range.endContainer
					    && startContainer.nodeType == 1
					    && (range.endOffset - range.startOffset) == 1
					    && this.StyleObjectElements[startContainer.childNodes[range.startOffset].nodeName.toLowerCase()]) {
                        type = "element";
                    }
                }
            }
            return type;
        },
        /**
		 * [selectElementText 选中元素范围]
		 * @param {[type]} el [description]
		 */
		selectElementText: function ( el ){
			var doc = this.editorDocument;
			var selection = this.getSelection();	
			if(doc.getSelection){
				// range.selectNodeContent(el); // ?
				selection.selectAllChildren( el );
			}
			else if(doc.body.createTextRange){
				selection = doc.body.createTextRange();
				selection.moveToElementText( el );
				selection.select();
			}
			el.focus();
		},
        /**
         *获得选中的元素（不精确）
         */
        getSelectedElement: function () {
            var sel = this.getSelection();
            if (!sel) return null;
            var range = this.getRangeObject(sel);
            if (!range) return null;
            var node;
            //要理解getType(),getSelectedElement(),getRanges()
            var selectType = this.utilGetSelectedElementType(sel);
            switch (selectType) {
                case "element":
                    {
                        if ($.browser.msie) {
                            try {
                                node = sel.createRange().item(0);
                            }
                            catch (e) { }
                        }
                        else {
                            range = sel.getRangeAt(0);
                            node = range.startContainer.childNodes[range.startOffset];
                        }
                        break;
                    }
                case "text": //如果选择的开端是文本
                    {
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = sel.anchorNode || range.startContainer;
                                if (node && node.nodeType != 1) node = node.parentNode;
                            } else {
                                if (range.text.length > 0) range.collapse(true);
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
                default:
                    {
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = range.startContainer;
                                if (node && !node.tagName && node.parentNode) node = node.parentNode;
                            } else {
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
            }
            if (node && (node.ownerDocument != this.editorDocument)) {
                node = null;
            }

            //ie8，9 选择范围有bug（要忽略前面的空白)
            if (node && $B.is.ie && $B.getVersion() > 7) {
                var count = 0;
                var elCount = 0;
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (child.nodeType == 3 || child.tagName == "BR") {
                        count++;
                    } else {
                        elCount++;
                    }
                }
                if (count && elCount === 1 && node.lastChild.nodeType == 1) {
                    node = node.lastChild;
                }
            }

            return node;
        },

        /**
         *判断元素是否块元素
         */
        utilIsBlockElement:function(tagName){
            if (typeof tagName != "string") {
                tagName = tagName && tagName.tagName;
            }
            return /^(?:body|div|p|table|td|tr|ul|li|fieldset|legend)$/i.test(tagName);
        },

        /**
         *设置行距 todo 不大管用
         */
        setRowSpace: function (rowSpace) {
            this.editorWindow.focus();
            var This = this;
            rowSpace = rowSpace * 100 + "%";
            var selectedE = this.getSelection();
            var range = this.getRangeObject(selectedE);
            var startPE;
            var endPE;
            var rng;
            var allNodes = [];
            if ($B.is.ie && $B.getVersion() < 9) {
                rng = range.duplicate();
                range.collapse(false);
                startPE = range.parentElement();
                rng.collapse(false);
                endPE = rng.parentElement();
            } else {
                range = selectedE.getRangeAt(0);
                startPE = range.startContainer.parentNode;
                endPE = range.endContainer.parentNode;
            }
            if (!startPE || startPE.ownerDocument != this.editorDocument) {
                return;
            }
            try {
                var startDom = findBlockParent(startPE);
                makeStyle(startDom);
            } catch (e) { }
            try {
                var endDom = findBlockParent(endPE);
                if (startDom && endDom && startDom != endDom) {
                    //如果开始节点与结束节点不同，则遍历获取它们之间的节点
                    var allNodes = getMiddleNodes(startDom, endDom);
                    if (allNodes.length > 0) {
                        _.each(allNodes, function (item) {
                            makeStyle(item);
                        });
                    }
                    makeStyle(endDom);
                }
            } catch (e) { }
            function makeStyle(dom) {
                if (dom) {
                    $("*", dom).add(dom).css("line-height", rowSpace);
                }
            }
            function findBlockParent(el) {
                while (el) {
                    if (This.utilIsBlockElement(el)) {
                        return el;
                    }
                    el = el.parentNode;
                }
                return null;
            }
            //获得2个节点之间的节点
            function getMiddleNodes(startNode, endNode) {
                var all = [];
                var node = startDom.nextSibling;
                while (node) {
                    if (node == endNode || M139.Dom.containElement(node, endNode)) {
                        break;
                    } else {
                        all.push(node);
                        if (!node.nextSibling) {
                            node = node.parentNode;
                        } else {
                            node = node.nextSibling;
                        }
                    }
                }
                return all;
            }
        },

        /**
         *插入超链接
         */
        setLink: function (url) {
            this.editorWindow.focus();
            this.execCommand("CreateLink", url);
        },
        /**
        *插入签名
        */
        setSign: function (text) {
            var today = new Date();
            text = text.replace("$时间$", today.format("yyyy年MM月dd日 星期") + ["天", "一", "二", "三", "四", "五", "六"][today.getDay()]);
            if (this.isHtml) {
                var doc = this.editorDocument;
                text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
                if (!/<\/\w+>/.test(text)) {
                    text = text.replace(/\r?\n/g, "<br>");
                }
                var signContainer = doc.getElementById("signContainer");
                if (!signContainer || (signContainer.signLength && signContainer.signLength != signContainer.innerHTML.length)) {
                    if (signContainer) signContainer.id = null;
                    signContainer = doc.createElement("div");
                    signContainer.id = "signContainer";
                    var contentObj = doc.getElementById("content139") || doc.body;
                    var newLineDiv = doc.createElement("div");
                    var fonts = top.$User.getDefaultFont();
                    var style = {
                       fontFamily : fonts.family,
                       fontSize : this.getPxSize(fonts.size),
                       color : fonts.color,
                       lineHeight : fonts.lineHeight
                    };
                    $(newLineDiv).css(style);
                    newLineDiv.innerHTML = '<br><br><br>';
                    contentObj.appendChild(newLineDiv);						
                    contentObj.appendChild(signContainer);
                }
                signContainer.innerHTML = text;// + "<div>&nbsp;</div>";
                signContainer.signLength = signContainer.innerHTML.length;
            } else {
                this.textArea.value += "\r\n" + text;
            }
        },

        /**
        *todo 插入祝福语
        */
        setBlessings: function (text) {
            if (this.isHtml) {
                var doc = this.editorDocument;
                text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
                if (!/<\/\w+>/.test(text)) {
                    text = text.replace(/\r?\n/g, "<br>");
                }
                var blessingsContainer = doc.getElementById("blessingsContainer");
                if (!blessingsContainer || (blessingsContainer.signLength && blessingsContainer.signLength != blessingsContainer.innerHTML.length)) {
                    if (blessingsContainer) blessingsContainer.id = null;
                    blessingsContainer = doc.createElement("div");
                    blessingsContainer.id = "blessingsContainer";
                    var contentObj = doc.getElementById("content139") || doc.body;
                    var newLineDiv = doc.createElement("div");
                    newLineDiv.innerHTML = "<br>";
                    var signContainer = doc.getElementById("signContainer");
                    if (signContainer) {
                        contentObj.insertBefore(blessingsContainer, signContainer);
                        contentObj.insertBefore(newLineDiv, signContainer);
                    } else {
                        contentObj.appendChild(newLineDiv);
                        contentObj.appendChild(blessingsContainer);
                    }
                }
                blessingsContainer.innerHTML += "<div>" + text + "</div>";
                blessingsContainer.signLength = blessingsContainer.innerHTML.length;
            } else {
                this.contentPlainText.value += "\r\n" + text;
            }
        },

        /**添加引用内容（写信编辑器）*/
        addReplyContent: function (content) {
            // 在编辑器中文中添加6个空行 add by chenzhuo
			var sessionCon = top.$App.getSessionDataContent();
            var html = this.getHtmlContent() + sessionCon + "<div><br><br><br></div><div id='signContainer'></div><hr id='replySplit'/><div id='reply139content'>" + content + "</div>";
            this.setHtmlContent(html);
        },

        /**获得编辑器的html内容*/
        getHtmlContent: function () {
            var html = this.editorDocument.body.innerHTML;
            if ($B.is.webkit) {
                if (html.indexOf("<!--[if") > -1) {
                    //替换从office粘贴文本出现注释的bug
                    html = html.replace(/<!--\[if !\w+\]-->([\s\S]*?)<!--\[endif\]-->/g, "$1");
                }
            }
            return html;
        },

        /**设置html内容*/
        setHtmlContent: function (htmlCode) {
            var This = this;
            if (this.isReady) {
                setContent();
            } else {
                this.on("ready", setContent);
            }
            function setContent() {
                This.editorDocument.body.innerHTML = htmlCode;
                This.trigger("setcontent");
            }
        },

        //todo 使用公共代码实现
        /**
         *将html文本转化成普通文本
         */
        getHtmlToTextContent: function () {
            var body = this.editorDocument.body;
            var content = "";
            if (document.all) {
                content = body.innerText;
            } else {
                var tmp = body.innerHTML;
                tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
                var div = document.createElement("div");
                div.innerHTML = tmp;
                content = div.textContent;
            }
            return content;
        },

        //todo 使用公共代码实现
        /**
         *纯文本模式切换到编辑器模式，内容转换
         */
        getTextToHtmlContent: function () {
            var content = this.textArea.value;
            var div = document.createElement("div");
            if (document.all) {
                content = content.replace(/\r?\n/g, "<br>");
                content = content.replace(/ /g, "&nbsp;");
                div.innerHTML = content;
                return div.innerHTML;
            } else {
                div.appendChild(document.createTextNode(content));
                return div.innerHTML.replace(/\r?\n/g, "<br>");
            }
        },

        /**获得纯文本内容*/
        getTextContent: function () {
            return this.textArea.value;
        },

        //todo 封装成调用时不需要判断编辑器状态
        /**纯文本模式下设置内容*/
        setTextContent: function (text) {
            this.textArea.value = text;
        },

        /**
         *切换编辑器模式 html or 纯文本
        */
        switchEditor: function () {
            if (this.isHtml) {
                this.setTextContent(this.getHtmlToTextContent());
                this.jTextArea.show();
                this.jFrame.hide();
                this.isHtml = false;
            } else {
                this.setHtmlContent(this.getTextToHtmlContent());
                this.jFrame.show();
                this.jTextArea.hide();
                this.isHtml = true;
            }
        },

        /**设置、取消格式刷*/
        setFormatPrinter:function(){
            if(this.get("printerMode") == "off"){
                this.setFormatPrinterOn();
            }else{
                this.setFormatPrintOff();
            }
        },

        /**选中格式刷*/
        setFormatPrinterOn:function(keep){
            //保存当前格式
            this.set("formatForPrint",this.getSelectedStyle());

            this.set("printerMode", keep ? "keepOn" : "on");

            this._keepBookmark = null;//防止ie下movetobk的时候滚动
        },

        /**退出格式刷*/
        setFormatPrintOff:function(){
            this.set("printerMode","off");
        },

        /**
        * 格式化选中内容
        * execCommand具有切换的效果，因此在选区不同区域格式混杂的时候会有问题。
        * （比如用第一行的格式刷全文就会有问题）(xiaoyu)
        * 完善格式刷，先需对选区进行有选择的清除，再整体添加之前被清掉的格式。
        */
        printFormat: function (formatStyle) {
            if (this.formatLocked) return;

            var This = this;
            //如果是一次性刷子，退出格式刷状态
            var pMode = this.get("printerMode");
            if (pMode == "on") {//多次刷子是 = keepOn
                this.setFormatPrintOff();
            } else if (pMode == "off") {
                return;
            }


            //防止短期内多次触发而崩溃
            this.formatLocked = true;
            setTimeout(function () {
                This.formatLocked = false;
            }, 500);

			// 清除局部杂乱样式
			this.execCommand("removeFormat");

            var oldStyle = this.getSelectedStyle();

            if(oldStyle.isBold !== formatStyle.isBold){
                this.execCommand("bold",null,true);
            }

            if(oldStyle.isUnderLine !== formatStyle.isUnderLine){
                this.execCommand("underline",null,true);
            }

            if(oldStyle.isItalic !== formatStyle.isItalic){
                this.execCommand("italic",null,true);
            }

            if(oldStyle.isOrderedList !== formatStyle.isOrderedList){
                this.execCommand("insertorderedlist",null,true);
            }
            if(oldStyle.isUnorderedList !== formatStyle.isUnorderedList){
                this.execCommand("insertunorderedlist",null,true);
            }

            if(oldStyle.textAlign !== formatStyle.textAlign){
                this.execCommand("Justify" + formatStyle.textAlign,null,true);
            }
            
            if(oldStyle.color !== formatStyle.color){
                this.execCommand("ForeColor",formatStyle.color,true);
            }

            if(oldStyle.backgroundColor !== formatStyle.backgroundColor){
                this.setBackgroundColor(formatStyle.backgroundColor,true);
            }

            if(oldStyle.fontFamily !== formatStyle.fontFamily){
                this.execCommand("fontname",formatStyle.fontFamily,true);
            }


            //这个放最后，会触发afterexeccommand事件，更新ui状态
            if(oldStyle.fontSize !== formatStyle.fontSize){
                this.setFontSize(formatStyle.fontSize);
            }


        },

        /**
         *光标处插入html
         *@param {String} htmlCode 要插入的html
         */
        insertHTML: function (htmlCode) {
            this.editorWindow.focus();
            var sel = this.getSelection();
            var range = this.getRangeObject(sel);
            if (!$B.is.ie) {
                range.deleteContents();
                var fragment = range.createContextualFragment(htmlCode);
                var lastNode = fragment.lastChild;
                range.insertNode(fragment);
                range.setEndAfter(lastNode); //设置末尾位置  
                range.collapse(false); //合并范围至末尾  
                sel.removeAllRanges(); //清除range
                sel.addRange(range);
            } else if ($B.getVersion() >= 9) {
                //ie9
                range.deleteContents();
                var _div = this.editorWindow.document.createElement("div");
                _div.innerHTML = htmlCode;
                //var lastNode = _div.firstChild; //只插入了部分html
                var lastNode = _div;
                range.insertNode(_div);
                range.setEndAfter(lastNode); //设置末尾位置  
                range.collapse(false); //合并范围至末尾  
                sel.removeAllRanges(); //清除range
                sel.addRange(range);
            } else {
                if (sel.type.toLowerCase() == 'control') {
                    range.item(0).outerHTML = htmlCode;
                } else {
                    try {
                        range.pasteHTML(htmlCode);
                    } catch (e) {
                        this.editorDocument.body.innerHTML = htmlCode + this.editorDocument.body.innerHTML;
                    }
                }
            }
        },

        /**@inner 查询格式状态*/
        queryCommandState: function (command) {
            var state = false;
            try {
                state = this.editorDocument.queryCommandState(command);
            } catch (e) { }
            return state;
        },
        FontSizeList: {
            "6": "一号",
            "5": "二号",
            "4": "三号",
            "3": "四号",
            "2": "五号",
            "1": "六号",
            "32px": "一号",
            "24px": "二号",
            "18px": "三号",
            "16px": "四号",
            "13px": "五号",
            "10px": "六号",
            "12px": "六号"//chrome
        },
        /**获得光标当前所在位置的样式值：字体、颜色、对齐方式等*/
        getSelectedStyle: function () {
            var This = this;
            var element = this.getSelectedElement();
            if (!element || element.ownerDocument != this.editorDocument) {
                //有时候浏览器会返回编辑器以外的选中元素
                return null;
            } else {
	            var Dom = M139.Dom;
                var textAlign = Dom.getCurrentCSS(element, "text-align");
                var fontSize = Dom.getCurrentCSS(element, "font-size");
                var fontFamily = Dom.getCurrentCSS(element, "font-family");
                var color = Dom.getCurrentCSS(element, "color");
                var backgroundColor = Dom.getCurrentCSS(element, "background-color");
                var lineHeight = Dom.getCurrentCSS(element, "line-height");
                var result = {
                    isBold: this.queryCommandState("bold"),
                    isUnderLine: this.queryCommandState("underline"),
                    isItalic: this.queryCommandState("italic"),
                    isOrderedList: this.queryCommandState("insertorderedlist"),
                    isUnorderedList: this.queryCommandState("insertunorderedlist"),
                    isAlignLeft: textAlign == "left",
                    isAlignCenter: textAlign == "center",
                    isAlignRight: textAlign == "right",
                    textAlign:textAlign,
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    color:color,
                    backgroundColor:backgroundColor,
                    fontSizeText: getFontSizeText(fontSize),
                    lineHeight: parseInt(lineHeight)/parseInt(fontSize)
                };
                return result;
            }
            function getFontSizeText(fontSize) {
                return This.FontSizeList[fontSize] || fontSize;
            }
        },

        /**
         *根据字体名获得字号
         *@inner
         */
        utilGetFontSizeLevel: function (fontSizeName) {
            if (/^\d+$/.test(fontSizeName)) {
                return parseInt(fontSizeName);
            } else {
                var list = ["","xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
                return jQuery.inArray(fontSizeName, list) || 4;
            }
        },

        /**加大字号*/
        setFontSizeUp: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if (fontSize.indexOf("px") > -1) {
                var newSize = parseInt(fontSize) + 4 + "px";
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(fontSize + 1);//最大是1号字
            }
        },

        /**减少字号*/
        setFontSizeDown: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if(fontSize == 'medium'){fontSize = '16px';} //修复html编辑器对字体缩小在特定条件下失效的问题,暂用该方法
            if (fontSize.indexOf("px") > -1) {
                var newSize = Math.max(9, parseInt(fontSize) - 4) + "px";//不能小于9像素
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(Math.max(1, fontSize - 1));
            }
        },

        /**
         *剪切选中内容
         */
        cut: function () { this.execCommand("Cut") },
        /**
         *复制选中内容
         */
        copy: function () { this.execCommand("Copy") },
        /**
         *在光标处粘贴内容
         */
        paste: function () { this.execCommand("Paste") },
        /**
         *设置文字效果粗体
         */
        setBold: function () { this.execCommand("Bold") },
        /**
         *设置文字效果下划线
         */
        setUnderline: function () { this.execCommand("Underline") },
        /**
         *设置文字效果斜体字
         */
        setItalic: function () { this.execCommand("Italic") },
        /**
         *设置字体
         */
        setFontFamily: function (fontName) {
            if ($B.is.ie && $B.getVersion() < 9) {
                //this.jEditorDocument.find("font").attr("oldel", 1);
                var fontTags = this.editorDocument.getElementsByTagName("font");
                if (fontTags.length > 200) {
                    var moreBreak = true;
                }
                if (!moreBreak) { 
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        fontTags[i].setAttribute("oldel", "1");
                    }
                }
            }
            this.execCommand("fontname", fontName);
            if ($B.is.ie && $B.getVersion() < 9) {
                //解决从word复制内容到html编辑器里，有时字体无法修改的问题
                /*
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontFamily) {
                        this.style.fontFamily = "";
                    }
                });
                */
                if (!moreBreak) {
                    //jquery性能太差 重新优化
                    var fontTags = this.editorDocument.getElementsByTagName("font");
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        var font = fontTags[i];
                        if (!font.getAttribute("oldel")) {
                            var spanList = font.getElementsByTagName("span");
                            for (var j = 0, jLen = spanList.length; j < jLen; j++) {
                                var span = spanList[j];
                                if (span.style.fontFamily) {
                                    span.style.fontFamily = "";
                                }
                            }
                        }
                    }
                }
            }
        },
        // 标示已存在的font
        markFont: function(){
            this.jEditorDocument.find("font").attr("oldel", 1);
        },
        // 从word中复制到ie中的文本会有font标签，影响了文本字体大小，要去掉此属性 add by chenzhuo
        resetTextSizeForIe: function(){
            if (!$B.is.ie) {
                return;
            }

            var editorDocument = this.editorDocument;
            var fontElem = editorDocument.getElementsByTagName("font");
            var fontElemLen = fontElem.length;

            if (fontElemLen > 0) {
                for (var i = 0; i < fontElemLen; i++) {
                    var item = fontElem[i];
                    if (item.getAttribute("oldel") === null) { //新粘贴的文本
                        item.removeAttribute("size");
                    }
                }
            }
        },
        /**
         *设置字号
         */
        setFontSize: function (fontSize) {
            this.editorWindow.focus();
            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            var element = this.getSelectedElement();
            if (fontSize.toString().indexOf("px") > -1) {
	            //this.execCommand("FontSize", fontSize, true);
	            // size 1-7 分别对应 12 13 16 18 24 32 48
	            //var map = [12 13 16 18 24 32 48];
	           // var size = parseInt(fontSize, 10);
	           // for(var i=0,len=map.length;)
                this.execCommand("FontSize", 4, true);//这个只支持字号 不支持像素,所以要折腾2次
                element.style.fontSize = fontSize;
                this.trigger("afterexeccommand",{
                    command:"FontSize",
                    param:fontSize
                });
            }else{
                this.execCommand("FontSize", fontSize);
                if (element.style.fontSize) {
                    element.style.fontSize = "";
                }
            }

            if ($B.is.ie) {
                
                //解决从word复制内容到html编辑器里，有时字体大小无法修改的问题
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontSize) {
                        this.style.fontSize = "";
                    }
                });
            }

        },
        /**
         *设置默认字体 add by tkh  modif by yly
         * @param {Object} fonts {size : '2',family : '宋体',color : '#000000',lineHeight:'1.5'}
         */
        setDefaultFont : function (fonts){
            var self = this;
            var style = {
               fontFamily : fonts.family,
               fontSize : self.getPxSize(fonts.size),
               color : fonts.color,
               lineHeight : fonts.lineHeight
            };
            
            var indexObj = getIndexObj();
            var eleList = self.jEditorDocument.find('body').find("div:lt("+indexObj.index+")");
            if(eleList && eleList.length > 0){
                for(var i = 0;i < eleList.length;i++){
                    var ele = eleList[i];
                    $(ele).css(style);
                }
            }else{
                var jNewDivEle = $(self.editorDocument.createElement('div'));
                if(!$B.is.ie) {
                    jNewDivEle.append('<br>');
                }
                if(indexObj.jEle){
                    indexObj.jEle.before(jNewDivEle);
                }else{
                    self.jEditorDocument.find('body').append(jNewDivEle);
                }
                jNewDivEle.css(style);
            }
            
			function getIndexObj(){
				var children = self.jEditorDocument.find('body').children();
				var jSignContainer = self.jEditorDocument.find("#signContainer");
				if(jSignContainer.size() > 0){
					return {
						index : jSignContainer.index(),
						jEle : jSignContainer
					};
				}
				var jReplySplit = self.jEditorDocument.find("#replySplit");
				if(jReplySplit.size() > 0){
					return {
						index : jReplySplit.index(),
						jEle : jReplySplit
					};
				}
				return {
					index : children.size()
				};
			}
            
    	},
    	getPxSize : function(fontSizeText){
			if (/\d+$/.test(fontSizeText)) {
				if($B.is.chrome && fontSizeText == 1){
                	return "12px";
                }
                fontSizeText = ({
                    6: "32px",
                    5: "24px",
                    4: "18px",
                    3: "16px",
                    2: "13px",
                    1: "10px"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
		},
        /**
         *设置字体颜色
         */
        setForeColor: function (color) {
            this.editorWindow.focus();
            //if (M139.Browser.is.firefox && color.indexOf("rgb") > -1) {
            if (color.indexOf("rgb") > -1) {
                //兼容处理
                color = this.changeRGBColor(color);
            }

            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            this.execCommand("ForeColor", color);
            if ($B.is.ie) {
                //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                /*
                    用了很猥琐的做法   
                    从word复制的内容 字体标签是 <span lang="EN-US" style="color:red" >
                    html编辑器自己加的字体标签是 <font color="blue">
                    那么我就把应用字体颜色后的新增的font标签下的span标签的color干掉  就可以防止无法修改全部选中范围的字体颜色了
                */
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.color) {
                        this.style.color = "";
                    }
                });
            }
        },

        /**
         *rgb(1,1,1)格式转#010101格式
         */
        changeRGBColor:function(rgb){
            var m = rgb.replace(/\s/g,"").match(/rgb\((\d+),(\d+),(\d+)\)/i);
            if (m) {
                var r = (m[1] * 1).toString(16).replace(/^(.)$/, "0$1");
                var g = (m[2] * 1).toString(16).replace(/^(.)$/, "0$1");
                var b = (m[3] * 1).toString(16).replace(/^(.)$/, "0$1");
                return "#" + r + g + b;
            }
            return "";
        },

		preview: function() {
			var source = this.editorDocument.body.innerHTML;
			var html = '<iframe id="frm_preview" name="frm_preview" width="100%" height="100%" marginwidth="24" marginheight="24" frameborder="0" src="/m2012/html/preview_blank.htm"></iframe>';
			var height = $(window).height() - 100;

			top.$Msg.showHTML(html, {
				dialogTitle:'预览',
				buttons:['关闭'],
				width: "90%",
				height: height + "px"
			});

			//alert(top === parent);	// true
			document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			var preview_frm = parent.document.getElementById('frm_preview');

			$(preview_frm).on("load", function(){
				preview_frm.contentWindow.document.body.innerHTML = source;
			});
			//document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			//var win = window.open("about:blank", "_blank");
			//var win = window.open("/m2012/html/preview_blank.htm", "_blank");
			//console.log(win.document.body);
			//win.document.body.innerHTML = s;//source;
		},
		/**
		* 内容全选
		*/
		selectAll: function() { this.execCommand("selectAll"); },
		/**
		* 添加删除线
		*/
		strikeThrough: function() { this.execCommand("strikeThrough"); },
        /**
         *设置内容左对齐
         */
        setAlignLeft: function () { this.execCommand("JustifyLeft") },
        /**
         *设置内容居中对齐
         */
        setAlignCenter: function () { this.execCommand("JustifyCenter") },
        /**
         *设置内容右对齐
         */
        setAlignRight: function () { this.execCommand("JustifyRight") },
        /**
         *增加缩进
         */
        setIndent: function () { this.execCommand("Indent") },
        /**
         *减少缩进
         */
        setOutdent: function () { this.execCommand("Outdent") },
        /**
         *设置数字列表（ol）
         */
        insertOrderedList: function () { this.execCommand("Insertorderedlist") },
        /**
         *设置符号列表（ul）
         */
        insertUnorderedList: function () { this.execCommand("Insertunorderedlist") },

		/**
		* 上传后需要添加到附件列表，因此直接模拟上传附件行为
		*/
        _uploadFile: function(type, filterType) {
	        var isFlashUpload = supportUploadType.isSupportFlashUpload && document.getElementById("flashplayer");

	        if(isFlashUpload){
		        return ;
		    }
		    uploadManager.filterType = filterType;
	        uploadManager.callback = function(){
		        var list = this.fileList;
		        var item;
		        var fileSizeText;
		        var filterType;

		        for(var i=0, len=list.length; i < len; i++) {
			        item = list[i];
			        filterType = item.filterType;
			        if(filterType) {
				        if(filterType.test(item.fileName)) {
					        fileSizeText = item.fileType == "largeAttach" ? item.fileSize : $T.Utils.getFileSizeText(item.fileSize, { maxUnit: "K", comma: true });
				            upload_module.insertRichMediaFile(item.fileName, fileSizeText);
			            }
				        delete item.filterType; // 防止第二次上传后重复添加到正文
			        }
		        }
	        }
	        var fileInput = document.getElementById("uploadInput");
	        var acceptMimeTypes = {
		        "audio": "audio/mpeg",
		        "video": "video/mp4, flv-application/octet-stream",
		        "doc": "text/plain, application/vnd.ms-powerpoint, application/vnd.ms-excel, application/msword, application/pdf",
		        "image": "image/gif, image/jpeg, image/bmp, image/png"
	        };

	        $(fileInput).attr("accept", acceptMimeTypes[type]);

	        if(fileInput) {
		        $(fileInput).trigger("click", "fakeClick");
	        }
        },

        uploadInsertDocument: function() {
            this._uploadFile("doc", /\.(?:docx?|pptx?|xlsx?|pdf|txt)$/i);
        },

        uploadInsertAudio: function() {
            this._uploadFile("audio", /\.(?:mp3|m4a|wav)$/i);
        },

        uploadInsertVideo: function() {
            this._uploadFile("video", /\.(?:mp4|flv|f4v|m4v)$/i);
        },

        /**
         *清除文字格式
         */
        removeFormat: function () {
	        //this.execCommand("removeFormat");
			var doc = this.editorDocument;
			this.sourceBackup = doc.body.innerHTML;	// 支持一次撤销
			var contentNode = doc.getElementById("content139") || doc.body;
			var signContainer = doc.getElementById("signContainer");
			//var replyContainer = doc.getElementById("reply139content");

			if(signContainer){
				signContainer.parentNode.removeChild(signContainer);
			}
			//if(replyContainer){
			//	replyContainer.parentNode.removeChild(replyContainer);
			//}
			// note: 先removeChild，再获取innerHTML
			var source = contentNode.innerHTML;
			// ctrl+Z撤销（清除格式后需要这个恢复之前的备份内容）
			this.restoreSource = function (e) {
				if(e.ctrlKey){
					if(e.keyCode === 90 && this.hasOwnProperty("sourceBackup")){
						this.undo();
					}
				}
				return false;
			};
			this.on("keydown", this.restoreSource);
			source = source.replace(/(style)\s*=\s*(["']?)(?:[^\\>]|\\\2)*?\2/ig, "");
			//source = source.replace(/<[\w:-]+\s*style/ig, "");
			source = source.replace(/<\/?(?:h\d|li|dl|dd|dt|ol|ul|font|sub|sup|i|u|em|del|b|strike|strong)(\s+[^>]*)?>/ig, "");
			// remove comment (conditional tags)
			source = source.replace(/<!--\[if.*?-->.*?<!--\[endif\]-->/ig, "");
			// finally, remove all empty tags.
			//source = source.replace(/<([\w:-]+)[^>]*>\s*<\/\1>/ig, '');
			// remove all empty tags that with no 'src' property.
			source = source.replace(/<([\w:]+)(\s+(?!src)\w+\s*=\s*(["']?)(?:[^\\>]|\\\3)*?\3)?>\s*<\/\1>/ig, '');
			contentNode.innerHTML = source;
			if(signContainer) {
				var replySplit = doc.getElementById("replySplit");
				if(replySplit){
					contentNode.insertBefore(signContainer, replySplit);
				} else {
					contentNode.appendChild(signContainer);
				}
			}
			//if(replyContainer) {
			//	contentNode.appendChild(replyContainer);
			//}
		},
        /**
         *清除文字背景颜色
         */
        setBackgroundColor: function (color,isSilent) {
            if ($.browser.firefox) {
                this.execCommand("Bold");//为了生成一个span
                var elem = this.getSelectedElement();
                elem.style.backgroundColor = color;
                this.execCommand("Bold");//打扫卫生
            } else {
                if ($B.is.ie) {
                    this.jEditorDocument.find("font").attr("oldel", 1);
                }
                this.execCommand("BackColor", color);
                if ($B.is.ie) {
                    //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                    this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                        if (this.style.backgroundColor) {
                            this.style.backgroundColor = "";
                        }
                    });
                }
            }
        },

        /**
         *重做（取消撤销的操作）
         */
        redo: function () {
            if (this.supportRedoMode) {
                this.history.redo();
            } else {
	            this.execCommand("Redo");
            }
        },
        /**
         *撤销操作
         */
        undo: function () {
            if (this.supportRedoMode) {
                this.history.undo();
            } else {
	            // 清除格式后，支持一次性撤销（IE仍可多次）
	            if(this.sourceBackup != undefined){
		            this.editorDocument.body.innerHTML = this.sourceBackup;
		            this.sourceBackup = null;
		            delete this.sourceBackup;
		            this.editor.off("keydown", this.restoreSource);
	            } else {
	                this.execCommand("Undo");
                }
            }
        },
        /**
         *封装document.execCommand操作
         */
        execCommand: function (command, param, isSilent) {
            var self = this;

            if (!isSilent) {
                this.editorWindow.focus();
            }
            if(!isSilent){
                this.trigger("beforeexeccommand", { command: command, param: param });
            }

            //var sRange = this.getRangeObject();
            this.editorDocument.execCommand(command, false, param);
            this.styleCommand(command);

            //var eRange = this.getRangeObject();

            if (!isSilent && M139.Browser.is.ie && M139.Browser.getVersion() > 7) {
                this.editorWindow.focus();
            }

            if(!isSilent){
                this.trigger("afterexeccommand", { command: command, param: param });
            }
            
            //updateState();
        },

        // 一些文本操作之后的样式控制
        styleCommand: function (command) {
            var self = this;

            switch (command) {
                case "Indent":
                    // ie下BLOCKQUOTE元素会增加默认的顶部和底部外边距
                    if ($B.is.ie) {
                        setTimeout(function(){
	                        //note: IE11不支持createRange (xiaoyu)
							try{
								var range = self.getRangeObject();
								var sRangeContainer = range.parentElement().parentElement;

                                if (sRangeContainer.tagName == "BLOCKQUOTE") {
                                    sRangeContainer.style.marginTop = "0";
                                    sRangeContainer.style.marginBottom = "0";
                                }
                            }catch(e){ }
                        }, 100);
                    }
                    break;
            }
        }
    }
)
);

    //添加静态方法
    $.extend(M2012.UI.HTMLEditor.Model.Editor,
     /**
      *@lends M2012.UI.HTMLEditor.Model.Editor
      */
    {
        getDefaultFont: function () {
            var defaultFont = {};
            try {
                defaultFont = top.$User.getDefaultFont();
            } catch (e) {
            }
            return defaultFont;
        }
    });

})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义编辑器的弹出菜单
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    M139.namespace("M2012.UI.HTMLEditor.View.Menu", superClass.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.Menu.prototype
        */
        {
            /** 弹出菜单组件
            *@constructs M2012.UI.HTMLEditor.View.Menu
            *@extends M139.View.ViewBase
            *@param {Object} options 初始化参数集
            *@param {String} options.template 组件的html代码
            *@example
            */
            initialize: function (options) {
                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                return superClass.prototype.initialize.apply(this, arguments);
            },

            render: function () {
                var This = this;
                this.$el.appendTo(document.body);

                this.on("select", this.hide);

                this.render = function () {
                    return this;
                }
                
                return superClass.prototype.render.apply(this, arguments);
            },

            hide: function () {
                M2012.UI.PopMenu.unBindAutoHide({ action: "click", element: this.el});
                return superClass.prototype.hide.apply(this, arguments);
            },

            //#xxx转rgb
            getRGBColor: function (color) {
                if (/rgb/i.test(color)) {
                    return color.toLowerCase();
                } else if (color.indexOf("#") > -1) {
                    var m = color.match(/^\#(.)(.)(.)$/);
                    if (m) {
                        return M139.Text.Utils.format("rgb({r},{g},{b})", {
                            r: parseInt(m[1] + m[1], 16),
                            g: parseInt(m[2] + m[2], 16),
                            b: parseInt(m[3] + m[3], 16)
                        });
                    } else {
                        m = color.match(/^\#(..)(..)(..)$/);
                        if (m) {
                            return M139.Text.Utils.format("rgb({r},{g},{b})", {
                                r: parseInt(m[1], 16),
                                g: parseInt(m[2], 16),
                                b: parseInt(m[3], 16)
                            });
                        }
                    }
                }
                return color;
            },

            /**
             *显示菜单
             *@param {Object} options 参数集
             *@param {HTMLElement} options.dockElement 停靠的元素
             */
            show: function (options) {
                var This = this;
				var direction = this.editorView.options.editorBtnMenuDirection || "down";
                
                //会话邮件写信页特殊处理
				if(window.conversationPage){
					direction = "up";
                    //this.$el.find("div.font-type").css({ 'height':185,'overflow':'hidden', 'background':'white' });
                    this.$el.find("div.FontFamilyList,div.FontSizeList").css({ 'height':140, 'overflow-y':'scroll', 'position':'relative','background':'white' });
				}
                
				this.$el.css("z-index", 40000);
                this.dockElement = options.dockElement;
                //停靠在按钮旁边
                M139.Dom.dockElement(options.dockElement, this.el, {
                    direction: direction
                });
                //点击空白处自动消失
                M2012.UI.PopMenu.bindAutoHide({
                    action: "click",
                    element: this.el,
                    stopEvent: true,
                    callback: function () {
                        This.hide();
                    }
                });
                return superClass.prototype.show.apply(this, arguments);
            },
            
            /**
             *显示默认字体对话框
             *@param 
             */
            onChangeButtonClick: function () {
                this.hide();
                var fontIFrame = top.$Msg.open({
                    dialogTitle:"设置默认字体",
                    url:"defaultFont.htm?sid="+top.sid,
                    width:420,
                    height:248
                });
                
                var self = this;
                top.$App.on('setDefaultFonts', function(fonts){
                    self.editorView.editor.setDefaultFont(fonts);
                    if(top.$App){
                        top.$App.off('setDefaultFonts');
                        top.$App.trigger("userAttrChange", {callback: function () {}});
                    }
                    fontIFrame.close();
                });
                top.$App.on('cancelDefaultFonts', function(){
                    if(top.$App){
                        top.$App.off('cancelDefaultFonts');
                    }
                    fontIFrame.close();
                });
            }
        }
    ));

    M2012.UI.HTMLEditor.View.FaceFamilyMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontFamilyList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:260px;">',
         '<div class="fonttype-list FontFamilyList">',
             '<a rel="微软雅黑" style="font-family: 微软雅黑;" href="javascript:void(0)"><span class="cur"></span>微软雅黑</a>',
             '<a rel="宋体" style="font-family: 宋体;" href="javascript:void(0)"><span class="cur"></span>宋体</a>',
             '<a rel="黑体" style="font-family: 黑体;" href="javascript:void(0)"><span class="cur"></span>黑体</a>',
             '<a rel="楷体" style="font-family: 楷体;" href="javascript:void(0)"><span class="cur"></span>楷体</a>',
             '<a rel="隶书" style="font-family: 隶书;" href="javascript:void(0)"><span class="cur"></span>隶书</a>',
             '<a rel="幼圆" style="font-family: 幼圆;" href="javascript:void(0)"><span class="cur"></span>幼圆</a>',
             '<a rel="Arial" style="font-family: Arial;" href="javascript:void(0)"><span class="cur"></span>Arial</a>',
             '<a rel="Arial Narrow" style="font-family: Arial Narrow;" href="javascript:void(0)"><span class="cur"></span>Arial Narrow</a>',
             '<a rel="Arial Black" style="font-family: Arial Black;" href="javascript:void(0)"><span class="cur"></span>Arial Black</a>',
             '<a rel="Comic Sans MS" style="font-family: Comic Sans MS;" href="javascript:void(0)"><span class="cur"></span>Comic Sans MS</a>',
             '<a rel="Courier" style="font-family: Courier;" href="javascript:void(0)"><span class="cur"></span>Courier</a>',
             '<a rel="System" style="font-family: System;" href="javascript:void(0)"><span class="cur"></span>System</a>',
             '<a rel="Times New Roman" style="font-family: Times New Roman;" href="javascript:void(0)"><span class="cur"></span>Times New Roman</a>',
             '<a rel="Verdana" style="font-family: Verdana;" href="javascript:void(0)"><span class="cur"></span>Verdana</a>',
         '</div>',
         '<div class="font-type-btn" style="display:none;">',
             '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
             '默认:<span id="defaultFamily"></span>',
         '</div>',
        '</div>'].join(""),
        onSelect: function (e) {
            var value = e.target.style.fontFamily;
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.fontFamily) {
                style.fontFamily = style.fontFamily.replace(/'/g, "");//过滤掉多余的引号，如：'Arial Black' 
                this.$("a[rel='" + style.fontFamily + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            var defaultFamily = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().family;
            if (!defaultFamily) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultFamily').text(defaultFamily);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.FaceSizeMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontSizeList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:660px;">',
             '<div class="fonttype-list FontSizeList">',
                 '<a href="javascript:void(0)" rel="x-small"><span style="font-size:x-small;"><span class="cur"></span>六号</span></a>',
                 '<a href="javascript:void(0)" rel="small"><span style="font-size:small;"><span class="cur"></span>五号</span></a>',
                 '<a href="javascript:void(0)" rel="medium"><span style="font-size:medium;"><span class="cur"></span>四号</span></a>',
                 '<a href="javascript:void(0)" rel="large"><span style="font-size:large;"><span class="cur"></span>三号</span></a>',
                 '<a href="javascript:void(0)" rel="x-large"><span style="font-size:x-large;"><span class="cur"></span>二号</span></a>',
                 '<a href="javascript:void(0)" rel="xx-large"><span style="font-size:xx-large;"><span class="cur"></span>一号</span></a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultSize"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var target = M139.Dom.findParent(e.target, "a") || e.target;
            var map = {
                "xx-large": 6,
                "x-large": 5,
                "large": 4,
                "medium": 3,
                "small": 2,
                "x-small": 1
            };
            var value = map[target.getAttribute("rel")];
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        getPxSize:function(fontSizeText){
            if (/\d+$/.test(fontSizeText)) {
                fontSizeText = ({
                    6: "xx-large",
                    5: "x-large",
                    4: "large",
                    3: "medium",
                    2: "small",
                    1: "x-small"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont: function () {
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            var selectedFontSize = this.getPxSize(style.fontSize);
            this.$("a.on").removeClass("on");
            // style.fontSize IE8对选区设置新字号后会得到数字，而默认会得到像素值，chrome总是得到像素值
            if (style.fontSize) {
                this.$("a > span").each(function () {
	                // IE8 get text value such as "medium", chrome get pixel value
                    var menuValue = M139.Dom.getCurrentCSS(this, "font-size");
                    // fix: old IE不勾选默认字号
                    if(isNaN(parseInt(menuValue)) && this.innerText.indexOf(style.fontSizeText) != -1) {
	                    $(this.parentNode).addClass("on");
                    } else if (selectedFontSize == menuValue) {
                        $(this.parentNode).addClass("on");
                        return false;
                    } else if (style.fontSize == "12px" && parseInt(menuValue) < 12) {
                        //chrome有时候最小字体是12px
                        $(this.parentNode).addClass("on");
                        return false;
                    }
                });
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie && $B.getVersion() < 8) {
                this.$el.html(this.$el.html());
            }
            
            var defaultSize = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().sizeText;
            if (!defaultSize) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultSize').text(defaultSize);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.ColorMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click .ColorList a": "onSelect"
        },
        colors: ["0, 0, 0", "153, 51, 0", "51, 51, 0", "0, 51, 0", "0, 51, 102", "0, 0, 128", "51, 51, 153", "51, 51, 51", "128, 0, 0", "255, 102, 0", "128, 128, 0", "0, 128, 0", "0, 128, 128", "0, 0, 255", "102, 102, 153", "128, 128, 128", "255, 0, 0", "255, 153, 0", "153, 204, 0", "51, 153, 102", "51, 204, 204", "51, 102, 255", "128, 0, 128", "153, 153, 153", "255, 0, 255", "255, 204, 0", "255, 255, 0", "0, 255, 0", "0, 255, 255", "0, 204, 255", "153, 51, 102", "192, 192, 192", "255, 153, 204", "255, 204, 153", "255, 255, 153", "204, 255, 204", "204, 255, 255", "153, 204, 255", "204, 153, 255", "255, 255, 255"],
        //colors: ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "ff6600", "808000", "008000", "008080", "0000ff", "666699", "808080", "ff0000", "ff9900", "99cc00", "339966", "33cccc", "3366ff", "800080", "999999", "ff00ff", "ffcc00", "ffff00", "00ff00", "00ffff", "00ccff", "993366", "c0c0c0", "ff99cc", "ffcc99", "ffff99", "ccffcc", "ccffff", "99ccff", "cc99ff", "ffffff"],
        insertPath: ".fontcolor-list",
        template: ['<div class="menuPop shadow font-colorpop" style="left:820px;top:860px;">',
             '<div class="fontcolor-list ColorList">',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var value = (e.target.firstChild || e.target).style.backgroundColor;
            this.trigger("select", { value: value });
        },
        render: function () {
            var htmlCode = [];
            var colors = this.colors;
            var itemTemplate = '<a href="javascript:void(0)" rel="#color#"><span style="background-color:#color#"></span></a>';
            for (var i = 0; i < colors.length; i++) {
                var c = colors[i];
                htmlCode.push(itemTemplate.replace(/\#color\#/g, "rgb(" + c + ")"));
                //htmlCode.push(itemTemplate.replace(/\#color\#/g, "#" + c));
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onChangeButtonClick: function () {
            //todo 显示修改默认字体菜单
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var This = this;
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            var selColor = (this.options && this.options.isBackgroundColor) ? style.backgroundColor : style.color;
            if (selColor) {
                var rgb = this.getRGBColor(selColor);
                this.$("a[rel='" + rgb + "']").addClass("on");
            }
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.TableMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click td": "onSelect",
            "mouseover td > div": "onItemMouseOver"
        },
        Rows: 10,
        Cells: 10,
        insertPath: "table",
        template: ['<div class="menuPop shadow tabpop" style="left:620px;top:860px;">',
         '<p>请选择表格大小<label></label></p>',
         '<table></table>',
        '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var dom = e.target.firstChild || e.target;
            return {
                rows: dom.getAttribute("rowIndex") * 1 + 1,
                cells: dom.getAttribute("cellIndex") * 1 + 1
            };
        },
        //鼠标移过显示选中效果
        onItemMouseOver: function (e) {
            var sel = this.getSelectedValue(e);
            this.$("label").text(" " + sel.rows + "行" + sel.cells + "列");
            this.$("td").each(function () {
                if (this.cellIndex < sel.cells && this.parentNode.rowIndex < sel.rows) {
                    this.className = "on";
                } else {
                    this.className = "";
                }
            });
        },
        render: function () {
            var htmlCode = [];
            var rows = this.Rows;
            var cells = this.Cells;
            var htmlCode = [];
            for (var i = 0; i < rows; i++) {
                htmlCode.push("<tr>");
                for (var j = 0; j < cells; j++) {
                    htmlCode.push("<td><div rowIndex='" + i + "' cellIndex='" + j + "'></div></td>");
                }
                htmlCode.push("</tr>");
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.RowSpaceMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontLineHeightList a": "onSelect"
        },
        Rows: 10,
        Cells: 10,
        template: ['<div class="menuPop shadow font-type" style="left:820px;top:1060px;">',
             '<div class="fonttype-list FontLineHeightList">',
             '<a href="javascript:;" rel="1.2"><span class="cur"></span>单倍</a>',
             '<a href="javascript:;" rel="1.5"><span class="cur"></span>1.5倍</a>',
             '<a href="javascript:;" rel="2"><span class="cur"></span>2倍</a>',
             '<a href="javascript:;" rel="2.5"><span class="cur"></span>2.5倍</a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultLineHeight"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var val = e.target.getAttribute('rel');
            return val * 1;
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        
        /**
         藏默认行距菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },
        
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.lineHeight) {
                this.$("a[rel='" + style.lineHeight + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            
            var defaultLineHeight = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().lineHeightText;

            if (!defaultLineHeight) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultLineHeight').text(defaultLineHeight);
            }

            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.LinkMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnYes": "onSelect",
            "click": "onContainerClick",
            "click a.i_u_close": "hide",
            "click a.BtnTestLink": "onTestLinkClick",
            "click a.CloseButton": "onCloseButtonClick"
        },
        template: ['<div class="shadow linkpop" style="position: absolute;">',
             '<a href="javascript:;" title="关闭" class="i_u_close CloseButton"></a>',
             '<ul class="form">',
                 '<li class="formLine">',
                     '<label class="label">要显示的文字：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxText" value="">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">链接到：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxUrl" value="http://">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label"></label>',
                     '<div class="element"><a class="BtnTestLink" href="javascript:;" style="font-family:\'宋体\'">检测此链接&gt;&gt;</a>',
                     '<span class="lbl_linkTip" style="color:red;display:none">  链接格式非法</span>',
                     '</div>',
                 '</li>',
             '</ul>',
             '<p class="ta_r"><a href="javascript:void(0)" class="btnNormal vm BtnYes"><span>确 定</span></a></p>',
         '</div>'].join(""),
        onContainerClick: function (e) {
            //方式默认行为：点击空白自动关闭
            M139.Event.stopEvent(e);
        },
        onTestLinkClick:function(e){
            var value = this.getSelectedValue(e);
            var url = value.url.trim();
            if (url == "") {
                this.$(".TextBoxUrl").focus();
            } else if (this.testLink(url)) {
                window.open(url);
            }
        },
        testLink: function (url) {
            if (M139.Text.Url.isUrl(url)) {
                this.$(".lbl_linkTip").hide();
                return true;
            } else {
                this.$(".lbl_linkTip").show();
                return false;
            }
        },
        onCloseButtonClick:function(){
            this.hide();
        },
        render: function () {
            this.textInput = this.$(".TextBoxText");
            this.urlInput = this.$(".TextBoxUrl");
            var This = this;
            M139.Timing.watchInputChange(this.urlInput[0], function () {
                This.onUrlChange();
            });
            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onUrlChange:function(){
            var text = this.textInput.val();
            var url = this.urlInput.val();
            //如果文本内容为空，则同步url框的值，交互需求
            if (text == "" || url.indexOf(text) == 0) {
                if (url != "http://") {
                    this.textInput.val(url);
                }
            }
        },
        show: function () {
            var This = this;
            this.textInput.val(this.editorView.editor.getSelectedText());
            this.urlInput.val("http://");
            setTimeout(function () {
                This.urlInput.focus();
                This.urlInput.select();
            }, 10);
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        },
        onSelect: function (e) {
            var input = this.getSelectedValue(e);
            if (!this.testLink(input.url)) {
                return;
            }
            if (input.text.trim() == "") {
                input.text = value.url;
            }
            this.hide();
            this.trigger("select", {
                text: input.text,
                url: input.url
            });
        },
        getSelectedValue: function (e) {
            return {
                text: this.textInput.val(),
                url: this.urlInput.val()
            };
        }
    });

    //表情菜单
    M2012.UI.HTMLEditor.View.FaceMenu = M2012.UI.HTMLEditor.View.Menu.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.FaceMenu.prototype
        */
        {
            /** 表情菜单组件
            *@constructs M2012.UI.HTMLEditor.View.FaceMenu
            *@extends M2012.UI.HTMLEditor.View.Menu
            *@param {Object} options 初始化参数集
            *@param {String} options.basePath 可选参数：表情文件的根路径（缺省加载默认配置）
            *@param {Array} options.faces 可选参数：表情文件分类的配置（缺省加载默认配置）
            *@example
            new M2012.UI.HTMLEditor.View.FaceMenu({
                basePath: "/m2012/images/face",
                faces: [{
                    name: "豆豆",
                    folder: "doudou",//文件夹名称
                    thumb: "thumb.png",
                    count: 19,//表情个数
                    pageSize: 40,//一页显示几个
                    height: 20,//缩略图高度
                    thumbOffset: 30,
                    width: 20,//缩略图宽度
                    fileType: "gif",//表情图片文件类型
                    desc: ["假笑", "开心", "坏笑", "晴转阴","...."]//每个表情的描述文字
                }]
            }).render();
            */
            initialize: function (options) {
                options = options || {};

                this.basePath = options.basePath || FaceConfig.basePath;
                this.faces = options.faces || FaceConfig.faces;

                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                this.model = new Backbone.Model();
                return M2012.UI.HTMLEditor.View.Menu.prototype.initialize.apply(this, arguments);
            },
            events: {
                "click .HeaderItem": "onHeaderClick",
                "click .ThumbItem": "onThumbClick",
                "click .PrevPage": "onPrevPageClick",
                "click .NextPage": "onNextPageClick",
                "click .CloseButton": "onCloseClick"
            },
            headerTemplate: '<li class="HeaderItem" data-index="{index}"><a href="javascript:;"><span>{name}</span></a></li>',
            thumbTemplate: ['<div class="ab"><a class="ThumbItem" href="javascript:;" ',
                'index="{index}" ',
                'style="height:{height}px;width:{width}px;',
                'background-position: -{x}px -{y}px;',
                'background-image: url({thumb});',
                'background-repeat: no-repeat;margin:5px;border:0;" ',
                'data-url="{image}" ',
                'title="{alt}"></a></div>'].join(""),
            /*
            <div class="ab">
			<a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
			</div>
            */


            template: ['<div class="tips delmailTips smilepop" style="top:1600px;left:40px;">',
                 '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>',
                 '<div class="tips-text">',
                     '<div class="tab smilepopTab">',
                         '<div class="tabTitle">',
                             '<ul class="HeaderContainer">',
                             '</ul>',
                         '</div>',
                         '<div class="tabMain">',
                             '<div class="tabContent show">',
                                 '<div style="width:449px;height:225px" class="smilelist clearfix ContentContainer">',		
                                    /*
                                    <div class="ab">
						            <a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
						            </div>
                                     */
                                 '</div>',
                                 '<div class="pagediv clearfix" style="display:none">',//翻页暂时不需要了
                                     '<div class="pageDrop fr page-top mr_10">',
                                         '<span class="pagenum LabelPage"></span>',
                                         '<a class="PrevPage" href="javascript:;">上一页</a>',
                                         '<a class="NextPage" href="javascript:;">下一页</a>',
                                     '</div>',
                                 '</div>',
                             '</div>',
                         '</div>',
                     '</div>',
                 '</div>',
             '</div>'].join(""),
            render: function () {

                this.renderHeaders();

                this.initEvents();

                this.setHeader(0);

                return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
            },

            /**
             *绘制头部，即表情分类区
             *@inner
             */
            renderHeaders: function () {
                var list = this.faces;
                var htmlCode = [];
                for (var i = 0; i < list.length; i++) {
                    htmlCode.push(M139.Text.Utils.format(this.headerTemplate,
                    {
                        index: i,
                        name: list[i].name
                    }));
                }
                this.$(".HeaderContainer").html(htmlCode.join(""));
            },

            /**
             *绘制表情内容区
             *@inner
             */
            renderContent: function () {
                var pageIndex = this.model.get("pageindex");
                var headerIndex = this.model.get("header");
                var face = this.faces[headerIndex];
                var htmlCode = [
                '<div style="display:none;left:12px;top: 140px;" class="smilelistView">',
                    '<img class="PreviewImage" width="64" height="64" />',
                '</div>'];
                var startIndex = (pageIndex - 1) * face.pageSize;
                var endIndex = Math.min(face.count, startIndex + face.pageSize);
                for (var i = startIndex; i < endIndex; i++) {
                    var bgImage = this.basePath + "/" + face.folder + "/" + face.thumb;
                    var image = this.basePath + "/" + face.folder + "/" + i + "." + face.fileType;
                    htmlCode.push(M139.Text.Utils.format(this.thumbTemplate,
                    {
                        x: i * face.thumbOffset,
                        y: 0,
                        height: face.height,
                        width: face.width,
                        thumb: bgImage,
                        image: image,
                        alt: face.desc[i],
                        index: i
                    }));
                }
                this.$(".ContentContainer").html(htmlCode.join(""));
            },

            /**
             *绑定事件
             *@inner
             */
            initEvents: function () {
                var This = this;
                this.model.on("change:header", function (model, header) {
                    var face = This.faces[header];
                    model.set("pageindex", null, true);
                    model.set("pageindex", 1);
                    This.focusHeader();
                }).on("change:pageindex", function (model, pageIndex) {
                    This.renderContent();
                    This.updatePageBar();
                });

                this.$(".ContentContainer").mouseover(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewShow(e, e.target.getAttribute("index"));
                    }
                }).mouseout(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewHide(e);
                    }
                });
            },

            /**
             *设置当前表情
             *@inner
             */
            setHeader: function (index) {
                this.model.set("header", index);
            },

            /**
             *点击表情种类的时候
             *@inner
             */
            onHeaderClick: function (e) {
                var li = M139.Dom.findParent(e.target, "li");
                var index = li.getAttribute("data-index");
                this.setHeader(index);
            },

            /**
             *点击x关闭按钮
             *@inner
             */
            onCloseClick: function (e) {
                this.hide();
            },

            /**
             *鼠标悬浮的时候显示预览图片
             *@inner
             */
            onPreviewShow: function (e,index) {
                var url = e.target.getAttribute("data-url");
                var img = this.$("img.PreviewImage").attr("src", url);
                var div = img.parent().show();
                if (index % 14 > 6) {
                    div.css("left", 365);
                } else {
                    div.css("left", 12);
                }
            },

            /**
             *隐藏预览图片
             *@inner
             */
            onPreviewHide: function (e) {
                this.$("img.PreviewImage").parent().hide();
            },

            /**
             *当前标签获得焦点
             *@inner
             */
            focusHeader: function () {
                var index = this.model.get("header");
                this.$(".HeaderItem.on").removeClass("on");
                this.$(".HeaderItem").eq(index).addClass("on");
            },

            /**
             *更新分页信息
             *@inner
             */
            updatePageBar: function () {
                var header = this.model.get("header");
                var page = this.model.get("pageindex");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                var lblText = page + "/" + pageCount;
                this.$(".LabelPage").text(lblText);
                if (pageCount > 1) {
                    this.$(".PrevPage,.NextPage").show();
                } else {
                    this.$(".PrevPage,.NextPage").hide();
                }
            },

            /**
             *当用户点击表情
             *@inner
             */
            onThumbClick: function (e) {
                var url = e.target.getAttribute("data-url");
                //发送出去要加完整路径
                if (url.indexOf("http") == -1) {
                    url = "http://" + location.host + "/" + url;
                }
                this.onSelect({
                    url: url
                });
                return false;
            },

            /**
             *获得当前表情页数
             *@inner
             */
            getPageCount: function () {
                var header = this.model.get("header");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                return pageCount;
            },

            /**
             *点击上一页
             *@inner
             */
            onPrevPageClick: function () {
                var page = this.model.get("pageindex");
                if (page > 1) {
                    this.model.set("pageindex", page - 1);
                }
            },
            /**
             *点击下一页
             *@inner
             */
            onNextPageClick: function () {
                var page = this.model.get("pageindex");
                if (page < this.getPageCount()) {
                    this.model.set("pageindex", page + 1);
                }
            },
            /**
             *触发select事件
             */
            onSelect: function (e) {
                this.hide();
                this.trigger("select", {
                    url: e.url
                });
            }
        });

    var FaceConfig = {
        basePath: "/m2012/images/face",
        faces: [
        	{
                name: "生活",
                folder: "life",
                thumb: "thumb.png",
                count: 49,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["鄙视", "踹地板", "得意", "发呆", "奋斗", "睡觉", "委屈", "无聊", "想家", "许愿", "中彩票", "抓狂", "逛街", "开心", "可爱", "恋爱", "伤心", "郁闷", "被K", "迟到了", "加班", "盼发工资", "求美女", "失恋了", "遇见帅哥", "月光了", "健身", "开车兜风", "旅游", "约会", "爱护森林", "春节", "低碳生活", "光棍节", "国庆", "节约用水", "绿色出行", "七夕", "圣诞节", "万圣节", "中秋", "大哭", "愤怒", "开心", "流泪", "窃喜", "伤心", "爽", "郁闷"]
            },
            {
                //表情名称
                name: "豆豆",
                //文件夹名称
                folder: "doudou",
                thumb: "thumb.png",
                //表情个数
                count: 19,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["假笑", "开心", "坏笑", "晴转阴", "愁", "窘", "微笑", "傻笑", "抛媚眼", "装酷", "哭了", "爱慕", "调皮", "见钱眼开", "耍帅", "哈哈笑", "鼠眉鼠眼", "打盹", "生病了"]
            },
            {
                //表情名称
                name: "飞信",
                //文件夹名称
                folder: "fetion",
                thumb: "thumb.png",
                //表情个数
                count: 52,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["天使","生气","咬牙切齿","困惑","酷","大哭","尴尬","思考","惊呆","拳头","好主意","偷笑","惊讶","睡着了","悲伤","鄙视","微笑","生病了","大笑","沉思","眨眼","失望","天真","担心","困","吓到","饮料","生日蛋糕","猫脸","闹钟","下雨","咖啡","计算机","狗脸","红心","心碎","女生抱抱","男生抱抱","香吻","灯泡","酒杯","手机","月亮","音乐","礼物","彩虹","玫瑰","凋谢","星星","太阳","雨伞","蜗牛"]
            },
            {
                name: "YOYO",
                folder: "yoyo",
                thumb: "thumb.png",
                count: 24,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["撒娇", "惊奇", "眨眼", "无精打采", "乖乖", "俏皮", "淘气", "卡哇伊", "跳舞", "流汗", "打哈欠", "兴奋", "发呆", "帅气", "爱美", "大哭", "悟空", "色咪咪", "西瓜太郎", "兔女郎", "藐视", "疑问", "同情", "牛郎"]
            },
            {
                name: "信封脸",
                folder: "mailer",
                thumb: "thumb.png",
                count: 18,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["害羞", "色", "可爱", "鄙视", "哭", "闭嘴", "冷汗", "抓狂", "衰", "晕", "憨笑", "大骂", "鼓掌", "飞吻", "馋", "偷笑", "可怜", "流泪"]
            }
        ]
    };

    /** 
     解决在非当前窗口创建编辑器的问题
    */
    M2012.UI.HTMLEditor.View.Menu.setWindow = function (window) {
        $ = jQuery = window.jQuery;
        document = window.document;
    };
})(jQuery, _, M139);

﻿/**
 * @fileOverview HTML编辑器的界面
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.View
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.View", {});


    M139.namespace("M2012.UI.HTMLEditor.View.Editor", superClass.extend(
     /**
      *@lends M2012.UI.HTMLEditor.View.Editor.prototype
      */
    {
        /** HTML编辑器的界面
        *@constructs M2012.UI.HTMLEditor.View.Editor
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {String} options.toolbarPath_Common 常用按钮容器路径（第一排）
        *@param {String} options.buttons_Common 常用按钮
        *@param {String} options.toolbarPath_More 非常用按钮容器路径（第二排）
        *@param {String} options.buttons_More 非常用按钮
        *@param {String} options.showMoreButton 显示更多的切换按钮
        *@example
        */
        initialize: function (options) {

            if (options.buttons_Common && !this.options.toolBarPath_Common) {
                throw "缺少参数:options.toolBarPath_Common";
            }
            if (options.buttons_More && !this.options.toolBarPath_More) {
                throw "缺少参数:options.toolBarPath_More";
            }

            if(options.menus && _.isFunction(options.menus)){
                options.menus = options.menus();
            }

            var div = document.createElement("div");
            div.innerHTML = $T.format(options.template, { blankUrl: this.options.blankUrl });
            this.setElement(div.firstChild);

            this.menus = {};
            this.buttons = {};
            
            this.isShowSetDefaultFont = options.isShowSetDefaultFont;

            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**@inner*/
        render: function () {
            var This = this;

            /**
            *编辑器基础类
            *@filed
            *@type {M2012.UI.HTMLEditor.Model.Editor}
            */
            this.editor = new M2012.UI.HTMLEditor.Model.Editor({
                frame: this.$("iframe")[0]
            });




            this.editor.on("focus", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("focus",function(e){});
                */
                This.trigger("focus");
            });
            this.editor.on("blur", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("blur",function(e){});
                */
                This.trigger("blur");
            });

            this.toolBar_Common = this.$(this.options.toolBarPath_Common);
            
            if(this.options.isSessionMenu || this.options.isUserDefineBtnContaier){ //全局查找
                this.toolBar_Common = $(this.options.toolBarPath_Common);
            }

            this.toolBar_More = this.$(this.options.toolBarPath_More);

            //注册常用按钮（第一排）
            var buttons_Common = this.options.buttons_Common;
            if (buttons_Common) {
                for (var i = 0; i < buttons_Common.length; i++) {
                    var btn = buttons_Common[i];
                    this.registerButton(btn, true);
                }
            }
            //注册非常用按钮（第二排）
            var buttons_More = this.options.buttons_More;
            if (buttons_More) {
                for (var i = 0; i < buttons_More.length; i++) {
                    var btn = buttons_More[i];
                    this.registerButton(btn);
                }
            }


            //注册菜单
            var menus = this.options.menus;
            if (menus) {
                for (var i = 0; i < menus.length; i++) {
                    var menu = menus[i];
                    this.registerMenu(menu);
                }
            }

            if (this.options.showMoreButton) {
                this.$(this.options.showMoreButton).click(function () {
                    This.onShowMoreClick();
                });
            }

            this.initEvents();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 按钮名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {String} options.command 按钮绑定的指令
         *@param {String} options.menu 按钮绑定的菜单
         *@param {Function} options.callback 点击按钮后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
         *@param {Boolean} isCommonButton 是否常用按钮(放在第一排)
        */
        registerButton: function (options, isCommonButton) {
            var This = this;

            var toolBar = isCommonButton ? this.toolBar_Common : this.toolBar_More;
            var el = toolBar[0];
            if (options.isLine) {
                //添加分割线
                $D.appendHTML(el, options.template);
            } else {
                //添加按钮的dom元素
                $D.appendHTML(el, options.template);
                var btn = jQuery(el.lastChild).click(function (e) {
                    This.onButtonClick(this, e, options);
                }).bind("dblclick",function(e){
                    This.onButtonDblClick(this, e, options);
                });

                if (options.queryStateCallback) {
                    //当光标选择区域变化的时候，需要通知到按钮变更外观
                    this.editor.on("bookmarkchange", function (e) {
                        options.queryStateCallback({
                            selectedStyle: e.selectedStyle,
                            editor:this,
                            element: btn
                        });
                    });
                }
                if(options.init){
                    options.init({
                        editor:this.editor,
                        element:btn
                    });
                }
            }
            this.buttons[options.name] = options;

        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {Function} options.callback 点击菜单项后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
        */
        registerMenu: function (options) {
            var This = this;
            this.menus[options.name] = options;
        },

        initEvents: function () {
            var This = this;
            this.editor.on("afterexeccommand", function (e) {
                if (e.command == "ForeColor") {
                    This.$el.find("#ED_SetFontColor span").css("background-color", e.param);

                    // 写信弹出窗口新增,如果找不到元素,默认为evocationEidtBar
                    // fix: 选择颜色, 颜色条不会改变的问题
                    if (!This.$el.find("#ED_SetFontColor span").length ) {
                        $("#evocationEidtBar").find("#ED_SetFontColor span").css("background-color", e.param);
                    }
                } else if (e.command == "BackColor") {
                    This.$el.find("#ED_SetBackgroundColor span").css("background-color", e.param);
                }
            });

            //检测输入值是否超出最大长度限制
            if (this.options.maxLength) {
                this.editor.on("keydown", function () {
                    This.testInputLength();
                });
            }
            //显示默认文本
            if (this.options.placeHolder) {
                this.editor.on("ready", function () {
                    This.initPlaceHolder();
                    This.editor.on("keyup", function () {
                        This.showPlaceHolder();
                    });;
                });
            }
        },

        /**
         *初始化默认提示文本
         *@inner
         */
        initPlaceHolder: function () {
            var This = this;
            var el = this.$el.find(".PlaceHolder");
            el.html(this.options.placeHolder);
            el.click(function () {
                This.editor.focus();
            });
            this.showPlaceHolder();
            this.editor.on("setcontent", function () {
                This.showPlaceHolder();
            });
        },

        /**
         *显示默认提示文本
         *@inner
         */
        showPlaceHolder:function(){
            var el = this.$el.find(".PlaceHolder");
            var text = $(this.editor.editorDocument.body).text();
            if (text == "") {
                el.show();
            } else {
                el.hide();
            }
        },

        /**
         *在编辑器上方显示小提示，3秒消失
         */
        showErrorTips: function (msg) {
            clearTimeout(this.errorTipHideTimer);
            var el = this.$el.find(".ErrorTipContent").html(msg).parent();
            el.show();
            this.errorTipHideTimer = setTimeout(function () {
                el.hide();
            },3000);
        },

        /**
         *检测输入值是否超出最大长度限制
         *@inner
         */
        testInputLength: function () {
            var This = this;
            clearTimeout(this.testInputTimer);
            this.testInputTimer = setTimeout(function () {
                var content = This.editor.getHtmlContent();
                var length = M139.Text.Utils.getBytes(content);
                if (length > This.options.maxLength) {
                    This.showErrorTips(This.options.maxLengthErrorTip);
                    M139.Dom.flashElement(This.el);
                }
            }, 500);
        },

        /**
         *显示菜单
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名
         *@param {HTMLElement} options.dockElement 停靠的按钮元素
        */
        showMenu: function (options) {
            var This = this;
            this.editor.editorWindow.focus();
            var menu = this.menus[options.name];

            if ($.isFunction(menu.view)) {
                menu.view = menu.view();
                menu.view.on("select", function (e) {
                    menu.callback(This.editor, e);
                });
            }
            menu.view.editorView = this;
            menu.view.render().show(options);

            this.trigger("menushow", {
                name: name
            });
        },

        /**
         *双击按钮
         *@inner
         */
        onButtonDblClick:function(button, e, buttonOptions){
            if (buttonOptions.dblClick){
                buttonOptions.dblClick(this.editor);
            }
        },

        /**@inner*/
        onButtonClick: function (button, e, buttonOptions) {
            //点击色块，直接设置字体颜色，硬编码
            var target = M139.Dom.findParent(e.target, "span") || e.target;
            if (target.id == "ED_SetFontColor") {
                this.editor.setForeColor($(target).find("span").css("background-color"));
                return;
            } else if (target.id == "ED_SetBackgroundColor") {
                this.editor.setBackgroundColor($(target).find("span").css("background-color"));
                return;
            }
            if (buttonOptions.menu) {
                this.showMenu({
                    name: buttonOptions.menu,
                    dockElement: button
                });
            }
            if (buttonOptions.command) {
                this.editor[buttonOptions.command]();
            }


            var btn = M139.Dom.findParent(e.target,"a");
            var command = "";
            if(btn.id){
                command = btn.id.replace("ED_","");
            }

            this.trigger("buttonclick", {
                event: e,
                command:command,
                target: button,
                options: buttonOptions
            });
        },

        /**
         *点击显示更多按钮
         *@inner
         */
        onShowMoreClick: function () {
	        if(this.flashLoaded === undefined && typeof supportUploadType !== "undefined") {
		        var node = document.getElementById("flashplayer");
		        var isFlashUpload = !!(supportUploadType.isSupportFlashUpload && node);
		        if(isFlashUpload && this.$("#avflashupload").length == 0){
			        node = node.cloneNode(true);
			        node.setAttribute("id", "avflashupload");
			        this.$(".EditorBarMore").append($("<div></div>").css({
				        position: "absolute",
				        left: $("#ED_Video").position().left + 1 + "px",
				        top: "29px",
				        width: "45px",
				        height: "23px",
				        opacity: 0
			        }).append(node));
		        }
		        this.flashLoaded = isFlashUpload;
	        }
            this.toggleToolBar();
        },

        /**显示/隐藏第二排非常用按钮*/
        toggleToolBar: function () {
            var title = "";
            var editorBody = this.$(".eidt-body");

            if (this.$(".eidt-body").hasClass("eidt-body-full")) {
                title = "隐藏更多操作";
            	editorBody.removeClass("eidt-body-full");
                editorBody.css("height", "+=27");
        	} else {
	        	title = "更多操作";
            	editorBody.addClass("eidt-body-full");
                editorBody.css("height", "-=27");
            }
            this.$("a[bh='compose_editor_more']").attr("title", title);
        }
    })
    )


    var DefaultStyle = {
        //常用按钮容器
        toolBarPath_Common: "div.EditorBarCommon",
        //非常用按钮容器
        toolBarPath_More: "div.EditorBarMore",
        //更多按钮
        showMoreButton: "a.ShowMoreMenu",

        //会话邮件工具按钮  
        toolBarPath_Session: "div.tips-covfont .tips-text",

		//常用按钮集合（第一排）
		buttons_Common: [
			{
				name: "FontFamily",
				menu: "FontFamily_Menu",
				template: ['<a bh="compose_editor_fontfamily" title="设置字体" class="edit-btn" id="ED_FontFamily" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-ff">字体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体  此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontFamily.split(",")[0].replace(/'/g, ""));
					}
				}
			},
			{
				name: "FontSize",
				menu: "FontSize_Menu",
				template: ['<a bh="compose_editor_fontsize" title="设置字号" class="edit-btn" id="ED_FontSize" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-fsi">字号</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体 此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontSizeText);
					}
				}
			},
			{
				name: "Bold",
				command: "setBold",
				template: ['<a bh="compose_editor_bold" title="文字加粗" href="javascript:;" class="edit-btn" id="ED_Bold">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-b">粗体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isBold ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//加粗
			{
				name: "Italic",
				command: "setItalic",
				template: ['<a bh="compose_editor_italic" title="斜体字" href="javascript:;" class="edit-btn" id="ED_Italic">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-i">斜体</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isItalic ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//下划线
			{
				name: "UnderLine",
				command: "setUnderline",
				template: ['<a bh="compose_editor_underline" title="下划线" href="javascript:;" class="edit-btn" id="ED_UnderLine">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-ud">下划线</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnderLine ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "FontColor",
				menu: "FontColor_Menu",
				template: ['<a bh="compose_editor_color" title="文字颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_FontColor">',
		 						'<span class="edit-btn-rc" id="ED_SetFontColor">',
		 							'<b class="ico-edit ico-edit-color">文字颜色</b>',
		 							'<span class="ico-edit-color-span" style="background-color:rgb(255,0,0);"></span>',
		 						'</span>',
		 						'<span bh="compose_editor_color_select" class="ico-edit-color-xl"></span>',
		 					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "AlignLeft",
				command: "setAlignLeft",
				template: ['<a bh="compose_editor_align_left" title="左对齐" href="javascript:;" class="edit-btn" id="ED_AlignLeft">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alil">左对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignLeft ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignCenter",
				command: "setAlignCenter",
				template: ['<a bh="compose_editor_align_middle" title="居中对齐" href="javascript:;" class="edit-btn" id="ED_AlignCenter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-aliz" id="ED_AlignCenter">居中对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignCenter ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignRight",
				command: "setAlignRight",
				template: ['<a bh="compose_editor_align_right" title="右对齐" href="javascript:;" class="edit-btn" id="ED_AlignRight">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alir">右对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignRight ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "UnorderedList",
				command: "insertUnorderedList",
				template: ['<a bh="compose_editor_ul" title="插入项目编号" href="javascript:;" class="edit-btn" id="ED_UnorderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl">项目编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnorderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "OrderedList",
				command: "insertOrderedList",
				template: ['<a bh="compose_editor_ol" title="插入数字编号" href="javascript:;" class="edit-btn" id="ED_OrderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl2">数字编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isOrderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "Undo",
				command: "undo",
				template: ['<a bh="compose_editor_undo" title="撤消" href="javascript:;" class="edit-btn" id="ED_Undo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-cx">撤消</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "FormatPrinter",
				command: "setFormatPrinter",
				dblClick:function(editor){
					editor.setFormatPrinterOn(1);
				},
				template: ['<a bh="compose_editor_printer" title="格式刷" href="javascript:;" class="edit-btn" id="ED_FormatPrinter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-bush">格式刷</b>',
							'</span>',
							'</a>'].join(""),
				init: function (e) {
					e.editor.on("change:printerMode",function(){
						e.editor.get("printerMode") !="off" ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					});
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			/*{
				name: "InsertImage",
				menu: "InsertImage_Menu",
				template: ['<a bh="compose_editor_image" title="插入图片" href="javascript:;" class="edit-btn" id="ED_InsertImage">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-pic">图片</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				//啥事没做 外部通过buttonclick事件监听
				name: "ScreenShot",
				template: ['<a bh="compose_editor_screenshot" title="截屏" href="javascript:;" class="edit-btn" id="ED_ScreenShot">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-scr">截屏</b>',
							'</span>',
							'</a>'].join("")
			},*/
			{
				name: "Face",
				menu: "Face_Menu",
				template: ['<a bh="compose_editor_face" title="插入表情" href="javascript:;" class="edit-btn" id="ED_Face">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-smile">表情</b>',
							'</span>',
							'</a>'].join("")
			}/*,
			{
				name: "Preview",
				command: "preview",
				template: ['<a bh="compose_preview" title="预览" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-preview">预览</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "Template",
				command: "Template_Menu",
				template: ['<a bh="compose_insert_template" title="使用模板" href="javascript:;" class="edit-btn" id="ED_Template">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-table">模板</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

		//非常用按钮集合（第二排）
		buttons_More: [
			{
				name: "strikeThrough",
				command: "strikeThrough",
				template: ['<a bh="compose_strike" title="删除线" href="javascript:;" class="edit-btn" id="ED_Delete">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delLine">删除线</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "BackgroundColor",
				menu: "BackgroundColor_Menu",
				template: ['<a bh="compose_editor_bgcolor" title="背景颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_BackgroundColor">',
		 					'<span class="edit-btn-rc" id="ED_SetBackgroundColor">',
								'<b class="ico-edit ico-edit-color ico-editbg-color">背景颜色</b>',
								'<span class="ico-edit-color-span ico-editbg-color-span" style="background-color:rgb(192,192,192);"></span>',
							'</span>',
							'<span bh="compose_editor_bgcolor_select" class="ico-edit-color-xl"></span>',
							'</a>'].join("")
			},
			{
				name: "RemoveFormat",
				command: "removeFormat",
				template: ['<a bh="compose_remove_format" title="清除格式" href="javascript:;" class="edit-btn" id="ED_RemoveFormat">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delFormat">清除格式</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:80px;"></span>' },
			{
				name: "Outdent",
				command: "setOutdent",
				template: ['<a bh="compose_editor_indent" title="减少缩进" href="javascript:;" class="edit-btn" id="ED_Outdent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-jdsj">减少缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Indent",
				command: "setIndent",
				template: ['<a bh="compose_editor_outdent" title="增加缩进" href="javascript:;" class="edit-btn" id="ED_Indent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-addsj">增加缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "RowSpace",
				menu: "RowSpace_Menu",
				template: ['<a bh="compose_editor_lineheight" title="设置行距" href="javascript:;" class="edit-btn" id="ED_RowSpace">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-sxali">行距</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Table",
				menu: "Table_Menu",
				template: ['<a bh="compose_editor_table" title="插入表格" href="javascript:;" class="edit-btn" id="ED_Table">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-tab">表格</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:26px;"></span>' },
			{
				name: "Redo",
				command: "redo",
				template: ['<a bh="compose_editor_redo" title="恢复撤销的操作" href="javascript:;" class="edit-btn" id="ED_Redo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-hf">恢复</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "SelectAll",
				command: "selectAll",
				template: ['<a bh="compose_select_all" title="全选" href="javascript:;" class="edit-btn" id="ED_SelectAll">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-allSeled">全选</b>',
					'</span>',
					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom"></span>' },
			{
				name: "Link",
				menu: "Link_Menu",
				template: ['<a bh="compose_editor_link" title="插入链接" href="javascript:;" class="edit-btn" id="ED_Link">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-link">链接</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Voice",
				template: ['<a bh="compose_editor_voice" title="语音识别" href="javascript:;" class="edit-btn" id="ED_Voice">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-voice">语音</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "InsertVideo",
				command: "uploadInsertVideo",
				template: ['<a bh="compose_insert_video" title="将mp4/flv格式的视频文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Video">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-picture">视频</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "InsertAudio",
				command: "uploadInsertAudio",
				template: ['<a bh="compose_insert_audio" title="将mp3格式的音频文件插入邮件正文" href="javascript:;" class="edit-btn" id="ED_Audio">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-music">音乐</b>',
					'</span>',
					'</a>'].join("")
			}/*,
			{
				name: "InsertText",
				command: "uploadInsertDocument",
				template: ['<a bh="compose_insert_doc" title="支持word、xls、ppt、pdf格式的文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-text">文档</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

        //菜单集合
        menus: function () {
            return [
                //字体
                {
                    name: "FontFamily_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceFamilyMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontFamily(selectValue.value);
                    }
                },
                //字号
                {
                    name: "FontSize_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceSizeMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontSize(selectValue.value);
                    }
                },
                //字体颜色
                {
                    name: "FontColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu() },
                    callback: function (editor, selectValue) {
                        editor.setForeColor(selectValue.value);
                    }
                },
                //背景颜色
                {
                    name: "BackgroundColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu({ isBackgroundColor: true }) },
                    callback: function (editor, selectValue) {
                        editor.setBackgroundColor(selectValue.value);
                    }
                },
                //插入表格
                {
                    name: "Table_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.TableMenu() },
                    callback: function (editor, selectValue) {
                        editor.insertTable(selectValue.value);
                    }
                },
                //设置行距
                {
                    name: "RowSpace_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.RowSpaceMenu() },
                    callback: function (editor, selectValue) {
                        editor.setRowSpace(selectValue.value);
                    }
                },
                //插入链接
                {
                    name: "Link_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.LinkMenu() },
                    callback: function (editor, e) {
                        editor.editorWindow.focus();
                        if (e.text.trim() == "") {
                            $Msg.alert("请输入链接文本", { icon: "fail" });
                        } else {
                            if ($B.is.ie || $B.is.firefox) {
                                editor.insertHTML(M139.Text.Utils.format('<a href="{url}">{text}</a>', {
                                    url: e.url,
                                    text: M139.Text.Html.encode(e.text)
                                }));
                            } else {
                                editor.setLink(e.url);
                                if (editor.getSelectedText() != e.text) {
                                    try {
                                        var el = editor.getSelectedElement();
                                        $(el).text(e.text);
                                    } catch (e) { }
                                }
                            }
                        }
                    }
                },
                //插入表情
                {
                    name: "Face_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceMenu() },
                    callback: function (editor, e) {
                        editor.insertImage(e.url);
                    }
                }
            ]
        },

		//编辑器整体html结构
		template: ['<div class="editorWrap">',
			'<div class="tips write-tips ErrorTip" style="left: 0px; top: -32px; display:none;">',
				'<div class="tips-text ErrorTipContent" style=""></div>',
				'<div class="tipsBottom diamond" style=""></div>',
			'</div>',
			'<div style="position:absolute;width:100%;">',
				'<div class="PlaceHolder" unselectable="on" style="position: absolute;left: 10px;top: 35px;color:silver;z-index:50;font-size:16px;display:none;width:100%;"></div>',
			'</div>',
			'<div class="eidt-body"><!-- eidt-body-full 展开时加上 -->',
				'<div class="eidt-bar">',
					'<a bh="compose_editor_more" hidefocus="1" href="javascript:;" title="更多操作" class="pushon ShowMoreMenu"></a>',
					'<div class="EditorBarCommon eidt-bar-li"></div>',
					'<div class="EditorBarMore eidt-bar-li"></div>',
				'</div>',
				'<div class="eidt-content"><iframe hidefocus="1" src="{blankUrl}" frameborder="0" style="height:100%;border:0;width:100%;"></iframe></div>',
				//右下角的东东
				'<a hidefocus="1" style="display:none" href="javascript:void(0)" class="stationery"></a>',
			'</div>',
		'</div>'].join("")
    };


    /**
     *HTML编辑器命名空间
     *@namespace
     *@name M2012.UI.HTMLEditor
     */
    M139.namespace("M2012.UI.HTMLEditor", {});


    jQuery.extend(M2012.UI.HTMLEditor,
     /**
      *@lends M2012.UI.HTMLEditor
      */
    {
        /**
        *创建一个编辑器实例
        *@param {Object} options 参数集合
        *@param {HTMLElement} options.contaier 可选参数，父元素，默认是添加到body中
        *@param {String} options.blankUrl 编辑区空白页的地址
        *@param {Array} options.hideButton 不显示的编辑按钮
        *@param {Array} options.showButton 显示的编辑按钮
        *@param {Array} options.combineButton 会话模式显示的编辑按钮
        *@param {String} options.userDefined 自定义的常用按钮路径
        *@param {String} options.userDefinedToolBarContainer 自定义的编辑按钮容器
        *@param {String} options.editorBtnMenuDirection 编辑按钮菜单的方向 up/down
        *@param {String} options.editorBtnMenuHeight 编辑按钮菜单的高度
        *@param {Number} options.maxLength 限制最大输入值，超过的时候编辑器会提示
        *@returns {M2012.UI.HTMLEditor.View.Editor} 返回编辑器控件实例
        *@example
        var editorView = M2012.UI.HTMLEditor.create({
            contaier:document.getElementById("myDiv"),
            blankUrl:"html/editor_blank.htm"
        });

        editorView.editor.setHtmlContent("hello world");

        */
        create: function (options) {
	        var commonButtons = DefaultStyle.buttons_Common;
	        var moreButtons = DefaultStyle.buttons_More;
            if ($(options.contaier)[0].ownerDocument != document) {
                this.setWindow(window.parent);//解决在top窗口创建编辑器的问题
            }
            //要隐藏的按钮
            if (options.hideButton) {
                $(options.hideButton).each(function (index, menuName) {
	                var i, name;
                    for (i = 0; i < commonButtons.length; i++) {
                        name = commonButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            commonButtons.splice(i, 1);
                            i--;
                        }
                    }
                    for (i = 0; i < moreButtons.length; i++) {
                        name = moreButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            moreButtons.splice(i, 1);
                            i--;
                        }
                    }
                });
            } else if (options.showButton) {
                var showButtons = [];
                $(options.showButton).each(function (index, menuName) {
                    for (var i = 0; i < commonButtons.length; i++) {
                        var name = commonButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(commonButtons[i]);
                        }
                    }
                });
                commonButtons = showButtons;
                if(!options.showMoreButton){
                    DefaultStyle.buttons_More = null;
                }
            } else if (options.combineButton) {
                var showButtons = [];
                var combineButtons = commonButtons.concat( DefaultStyle.buttons_More );
                $(options.combineButton).each(function (index, menuName) {
                    for (var i = 0; i < combineButtons.length; i++) {
                        var name = combineButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(combineButtons[i]);
                        }
                    }
                });
                commonButtons = showButtons;
                DefaultStyle.toolBarPath_Common = DefaultStyle.toolBarPath_Session;
                DefaultStyle.buttons_More = null;
            }
            
            if(options.userDefinedToolBarContainer){
                DefaultStyle.toolBarPath_Common = options.userDefinedToolBarContainer;
            }

            var view = new M2012.UI.HTMLEditor.View.Editor({
                template: DefaultStyle.template,
                buttons_Common: commonButtons,
                toolBarPath_Common: DefaultStyle.toolBarPath_Common,
                buttons_More: DefaultStyle.buttons_More,
                toolBarPath_More: DefaultStyle.toolBarPath_More,
                menus: DefaultStyle.menus,
                showMoreButton: DefaultStyle.showMoreButton,
                blankUrl: options.blankUrl,
                maxLength: options.maxLength, //最大输入内容值
                maxLengthErrorTip: options.maxLengthErrorTip || "超过最大输入限制：" + options.maxLength + "字节",
                placeHolder: options.placeHolder,
                isSessionMenu: options.combineButton ? true : false,
                isUserDefineBtnContaier: options.userDefinedToolBarContainer ? true : false,
                editorBtnMenuDirection: options.editorBtnMenuDirection,
                isShowSetDefaultFont: options.isShowSetDefaultFont || false
            });
            view.render();
            options.contaier.html(view.$el);
            options.combineButton && $("a.ShowMoreMenu").hide();
            
            if(options.userDefinedToolBarContainer){
                view.$el.find('div.eidt-bar').remove();
            }

            return view;
        },
        /** 解决在非当前窗口创建编辑器的问题
        */
        setWindow: function (window) {
            jQuery = window.jQuery;
            document = window.document;
            M2012.UI.HTMLEditor.View.Menu.setWindow(window);
        }
    });

})(jQuery, _, M139);
(function(jQuery, Backbone, M139) {
	var $ = jQuery;
	M139.namespace('M2012.Compose.View.UploadForm', Backbone.View.extend(
	/**
	*@lends M2012.Compose.View.UploadForm.prototype
	*/
	{
		el: "div",
		
		events: {
		},

		template: ['<form target="{target}" enctype="multipart/form-data" method="post" action="{action}">',
					'	<input style="font-size:24px; position:absolute; right: 0;height:24px;" type="file" name="{fieldName}" />',	// title trick
					'</form>'].join(""),

		/*
		* @options
		*	- [required] fieldName 文件上传域的name
		*	- [optional] uploadUrl 上传地址，默认为根地址
		*	- [optional] wrapper 父元素，form和iframe都会添加到该元素下
		*	- [optional] accepts 允许上传的文件类型，仅在文件选择对话框进行过滤选择
		*	- [required] onSelect 选择文件后的处理过程
		*	- [required] onUploadFrameLoad 请求返回数据，iframe触发onload事件处理
		*/
		initialize: function (options) {
			var uniqueId = M2012.Compose.View.UploadForm.UID++;
			options = options || {};
			// 不要让多实例共享iframe，绑定多次onload会重复处理
			this.frameId = options.frameId || ("_hideFrame_" + uniqueId);
			this.template = M139.Text.Utils.format(this.template, {
				target: this.frameId,
				fieldName: (options.fieldName || "file"),
				action: options.uploadUrl || "/"
			});
			function noop(){return true}

			this.accepts = options.accepts;
			this.onSelect = options.onSelect || noop;
			this.onUploadFrameLoad = options.onUploadFrameLoad || noop;
			this.wrapper = options.wrapper || document.body;
			var $el = $(this.template).appendTo( this.wrapper );
			this.setElement($el);	// make sure that the view have only one `input:file` element inside.
		},

		render: function(){
			this.resetAccepts();
			this.initEvents();
			//this.$el.hide();	// don't! if we want to click it.
			return this;
		},

		initEvents: function(){
			var This = this;
			this.$("input").on("change", function(){
				var form, jFrame, value;

				form = this.form;
				value = this.value;

				if(!(value && This.onSelect(value, $Url.getFileExtName(value)))) {
					form.reset();
					return ;
				}

				jFrame = This.getHideFrame();
				jFrame.one("load", function(){
					This.onUploadFrameLoad(this);
				});

				try {
					form.submit();
					form.reset();
				} catch(e) {
					jFrame.attr("src", "/m2012/html/blank.html").one("load", function() {
						form.submit();
						form.reset();
					});
				}
			})/*.on("click", function(){
				This.isUserClick = true;	// 用户手动点击了按钮（而非模拟点击）
			})*/;
		},

		/*
		* 指定上传文件选择对话框过滤的文件类型
		*/
		resetAccepts: function(accepts){
			var types = accepts || this.accepts;
			var mimes = M2012.Compose.View.UploadForm.mimeTypes;
			if(_.isArray(this.accepts)){
				types = _.map(types, function(key){
					return mimes[key];
				});
				types = _.unique(types).join(", ");
				this.$("input").attr("accept", types);
			}
		},

		getHideFrame: function(){
			var This = this;
			var id = "#"+this.frameId;
			var jFrame = $(this.wrapper).closest("body").find(id);
			if(jFrame.length == 0){
				// todo 使用id !!! 否则每次都会重复一个iframe
				jFrame = $('<iframe id="' + this.frameId + '" name="' + this.frameId + '" style="display:none"></iframe>').appendTo( this.wrapper );
			}
			return jFrame;
		}
	}, {
		UID: 0,
		mimeTypes: {
			"gif" : "image/gif",
			"jpg" : "image/jpeg",
			"bmp" : "image/bmp",
			"png" : "image/png",
			"txt" : "text/plain",
			"doc" : "application/msword",
			"docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"ppt" : "application/vnd.ms-powerpoint",
			"pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"xls" : "application/vnd.ms-excel",
			"xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"pdf" : "application/pdf",
			"mp3" : "audio/mpeg",
			"mp4" : "video/mp4",
			"zip" : "application/zip",
			"rar" : "application/octet-stream",
			"flv" : "flv-application/octet-stream"	// todo not supported ?
		}
	}));
})(jQuery, Backbone, M139);

﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.Account', Backbone.Model.extend({
        defaults: {
            defaultAccount: "", //默认发件人帐号
            accounts: [],       //帐号列表
            userName: "",        //发件人姓名
            alias: "",          //别名
            fetionAlias: "",      //飞信别名

            isAliasSet: false    //是否已经设置过别名，设置过之后不能重新设
        },
        type: {
            bind: "1",
            unbind: "2"
        },
        accountType: {
            Mobile: "mobile",
            Alias: "common",
            Fetion: "fetion"
        },
        initialize: function () {

        },
        getUserData: function () {
            this.initData();
            return this.attributes;
        },
        initData: function () {
            var user = top.$User;
            if (user) {
                try {
                    var type = this.accountType;
                    var accounts = [];
                    var accountList = user.getAccountList() || [];           //获取帐号列表
                    var defaultAccount = user.getDefaultSender() || "";      //获取默认帐号
                    var alias = user.getAliasName() || "";                   //获取别名
                    var userName = user.getTrueName() || "";                 //获取发件人姓名
                    var fetionAlias = user.getAliasName(type.Fetion) || "";  //获取飞信别名
                    var typeMap = { common: 1, mobile: 2, fetion: 3 }
                    for (var index in accountList) {
                        var mail = accountList[index].name;
                        var accountType = accountList[index].type;
                        accountType = typeMap[accountType];
                        accounts.push({
                            text: mail,
                            myData: index,
                            type: accountType
                        });
                    }

                    this.set({
                        "defaultAccount": defaultAccount,
                        "userName": userName,
                        "alias": alias,
                        "fetionAlias": fetionAlias,
                        "accounts": accounts,

                        "isAliasSet": alias ? true : false //是否已经设置过别名
                    });
                }
                catch (e) {
                    e.cancel = true;
                }
            }
        },
        clientCheckAlias: function (alias) {
            var resultCode = 0;
            var userLevel = top.$User.getUserLevel();
            userLevel = userLevel == "0010" ? "0015" : userLevel; //兼容广东免费版用户 0010
            if (top.SiteConfig.moreAlias) {
                var obj = [
                { userLevel: "0015", text: "5" }, //免费版
                {userLevel: "0016", text: "4" }, //5元版
                {userLevel: "0017", text: "3"}//20元版
            ]
            } else {
                var obj = [
                { userLevel: "0015", text: "5" }, //免费版
                {userLevel: "0016", text: "5" }, //5元版
                {userLevel: "0017", text: "5"}//20元版
            ]
            };
            for (var i = 0; i < obj.length; i++) {
                if (userLevel == obj[i].userLevel) {
                    if ($.trim(alias) == "") {
                        resultCode = 0; //空是允许的
                    }
                    else if (/\s/.test(alias) ||                 //空格
                /[^A-Za-z0-9_\-\.]/.test(alias)) {  //其他字符
                        resultCode = 1;
                    }
                    else if (/^[^A-Za-z]\w*/.test(alias)) {
                        resultCode = 2; //开头非字母
                    }
                    else if (alias.length < parseInt(obj[i].text) || alias.length > 15) {
                        resultCode = 3;
                    }
                    var text = "别名帐号为" + obj[i].text + "-15个字符，以英文字母开头";
                }
            }
            var message = [
                    "您自定义的别名可以使用",
                    "别名支持字符范围：0~9,a~z,“.”,“_”,“-”",
                    "必须以英文字母开头",
                    text
            ];
            if(!parent.$User.isChinaMobileUser()){
            	message = [
                    "您自定义的邮箱帐号可以使用",
                    "邮箱帐号支持字符范围：0~9,a~z,“.”,“_”,“-”",
                    "必须以英文字母开头",
                    text
            	];
            }

            if (resultCode == 0) {
                return { code: "S_OK", msg: message[resultCode] };
            }
            else {
                return { code: "FA_FALSE", msg: message[resultCode] };
            }
        },
        serverCheckAlias: function (alias, callback) {
            var data = { "alias": alias };
            M139.RichMail.API.call("user:checkAliasAction", data, function (response) {
                callback(response.responseData);
            });
        },
        setDefaultAccount: function (account, type, callback) {
            parent.$User.setDefaultSender(account, type, callback);
            this.set("defaultAccount", account);
        },
        update: function (data, callback) {
            var _this = this;
            var isSet = this.get("isAliasSet");     //是否已经设置过别名
            // todo tkh
            //isSet = false;
            var alias = $.trim(this.get("alias"));
            var isNull = alias.length <= 0 ? true : false; //检查别名是否未填写
            M139.RichMail.API.call("user:updateAliasAction", data, function (response) {
                callback(response.responseData);
                //window.console && console.log(data, isSet, alias, response);
                //_this.setDefaultAccount( parent.$App.getAccountWithLocalDomain(alias) );
            });
        },
        fail: function(errObj) {
            this.set({"serverexception": errObj});
        }
    })
    );

})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Account', superClass.extend({
        DEFAULT_ALIAS_TIP: "例:bieming",
        template: {
            popUpdateUser: '<h3 class="nametipsico">现在升级邮箱可享有更多超短别名！</h3><p class="nametipsicop">升级还可享有其他VIP特权：<br>更大的彩云容量，更长的文件保存时间，更个性的专属皮肤……</p>',
            alias: '<span>{0}</span><span id="aliasTip" class="gray ml_10">(第二个邮箱地址)</span>',
            aliasDefaultTip: '(第二个邮箱地址，<span class="red">设置后不可修改</span>)',
            confirmAlias: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                                 '<dl class="norTipsContent">',
                                     '<dt class="norTipsLine">您要设置的别名是：{alias}</dt>',
                                     '<dd class="norTipsLine gray"> 别名只能设置一次，且之后无法修改。</dd>',
                                     '<dd class="norTipsLine gray"> 您确定要设置这个别名吗？</dd>',
                                 '</dl>',
                             '</div>'].join("")
        },
        messages: {
            unbindTip: "您将不能在邮箱聊飞信，是否解绑？",
            systemError: "系统繁忙，请稍后再试。",
            sessionTimeout: "登录超时，请重新登录",
            unknowError: "未知错误",

            ALIAS_OK: "您自定义的别名可以使用",
            ALIAS_HOLDEN: "系统已保留此别名，请设置其他别名",
            ALIAS_IS_SYSTEM_REMAIN:"系统已保留此别名，请设置其他别名",
            ALIAS_USED: "该别名已被别人占用",
            ALIAS_ACCEPT_SYMBOL: "支持字符签名：0~9,a~z,“.”,“_”，“-”",
            ALIAS_ACCEPT_CONTENT: "支持字符签名：0~9,a~z,“.”,“_”，“-”",
            ALIAS_RULE_1: "必须以英文字母开头",
            ALIAS_NOT_ALLOW: "您的输入有误，请重新输入。别名帐号为5-15个字符，以英文字母开头，支持字符范围：0~9,a~z,“.”,“_”,“-”。"
        },

        status: {
            SUCCESS: "S_OK",            //成功
            SESSION_TIMEOUT: "S_FALSE", //验证失败，检查SID和RMKEY
            SYS_ERROR: "999",           //系统错误
            UN_ACTIVE: "1",             //未开通飞信
            ALIAS_HAS_USED: "967",      //别名已被占用
            ALIAS_NOT_ALLOW: "3144",    //别名不符合规范
            ALIAS_SET_ERROR: "1999",    //别名设置失败
            ALIAS_LIMIT: "3124",        //别名个数限制
            FAILURE: "0",                //失败
            ALIAS_IS_SYSTEM_REMAIN: "ALIAS_IS_SYSTEM_REMAIN"//别名被占用
        },
        initialize: function () {
            this.model = new M2012.Settings.Model.Account();
            this.sender = $("#txtSenderName");
            this.divAlias = $("#aliasDiv");
            this.txtAlias = $("#txtAlias");
            this.userName = $("#txtUserName"); //账户信息>>姓名

            this.alterTipMessages();// add by tkh
            this.render();
        },
        // add by tkh 非移动用户提示：邮箱账号
        alterTipMessages : function(){
        	var self = this;
        	if(!parent.$User.isChinaMobileUser()){
        		self.divAlias.siblings('label').text('邮箱帐号：');
        		self.messages.ALIAS_OK = '您自定义的邮箱帐号可以使用';
        		self.messages.ALIAS_HOLDEN = '系统已保留此邮箱帐号，请设置其他邮箱帐号';
        		self.messages.ALIAS_USED = '该邮箱帐号已被别人占用';
        		self.messages.ALIAS_NOT_ALLOW = '您的输入有误，请重新输入。邮箱帐号为5-15个字符，以英文字母开头，支持字符范围：0~9,a~z,“.”,“_”,“-”。';
        		
        		self.template.confirmAlias = ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                                 '<dl class="norTipsContent">',
                                     '<dt class="norTipsLine">您要设置的邮箱帐号是：{alias}</dt>',
                                     '<dd class="norTipsLine gray"> 邮箱帐号只能设置一次，且之后无法修改。</dd>',
                                     '<dd class="norTipsLine gray"> 您确定要设置这个邮箱帐号吗？</dd>',
                                 '</dl>',
                             '</div>'].join("");
        	}
        },
        render: function () {
            var self = this;
            var model = self.model;
            //获取初始化数据
            var data = model.getUserData();
            var accountfield = $("#accountDiv");

			self.menuDefaultSender = M2012.UI.DropMenu.create({
                selectMode : true,
                width: "220px",
                container: accountfield,
                menuItems: data.accounts,
                defaultText: data.defaultAccount,
                hideInsteadOfRemove: true
            });
            self.menuDefaultSender.on("change", function (item, index) {
                model.setDefaultAccount(item.text, item.type, function (source) {
                    if (source.code != "S_OK") {
                        top.$Msg.alert("系统繁忙，请稍后再试");
                        return;
                    }
                    self.menuDefaultSender.menu.selectItem(index);
                    top.M139.UI.TipMessage.show("默认发信帐号设置成功", { delay: 2000 });
                });
            });
            
			// 初始化，勾选当前发信帐号
			self.menuDefaultSender.on("menuCreate", function(menu){
				_.each(data.accounts, function(item, index){
					if(item.text === data.defaultAccount){
						menu.selectItem(index);
					}
				});
			});

            //绑定发件人姓名控件
            self.sender.val(data.userName);
            self.sender.on("blur", function () {
                var userName = $.trim(self.sender.val());
                model.set("userName", userName);
            });

            //绑定别名
            if (data.alias) {
                var alias = data.alias;
                if (alias && !parent.$T.Email.isEmail(alias)) { //仅是别名，则加上邮箱后缀
                    alias = parent.$App.getAccountWithLocalDomain(alias);
                }
                var html = self.template.alias.replace("{0}", alias);
                self.divAlias.html(html);
            } else {
                self.txtAlias.on("blur", function () {
                    self.checkAlias(self);
                });
                self.txtAlias.on("focus", function () {
                    var alias = $.trim(self.txtAlias.val());
                    if (alias == "" || alias == self.DEFAULT_ALIAS_TIP) {
                        self.txtAlias.val("").removeClass("gray"); //清空内容和状态
                    }
                });
                self.divAlias.find("#aliasTip").html(self.template.aliasDefaultTip);
            }

            model.trigger("change:fetionAlias"); //显示飞信

            model.on("change:userName", function () { //记录一下值被修改的经过
                var userName = model.get("userName");
                self.sender.val(userName); //用于同步用户名
            });
        },
        checkAlias: function (self) {
            var model = self.model;
            var txtAlias = self.txtAlias;
            var status = self.status;
            var alias = txtAlias.val();
            model.set("alias", alias); //先设置，异步检查不可用时清空
            var aliasTip = $("#aliasTip");
            if (alias == "" || alias == self.DEFAULT_ALIAS_TIP) { //检验内容
                txtAlias.val(self.DEFAULT_ALIAS_TIP).addClass("gray");
                self.model.set("alias", "");

                aliasTip.removeClass("red").html(self.template.aliasDefaultTip);
                return false;
            } else {
                txtAlias.removeClass("gray");

                //客户端检查
                var clientResult = model.clientCheckAlias(alias);
                if (clientResult.code != self.status.SUCCESS) {
                    self.model.set("alias", "");
                    aliasTip.addClass("red").html(clientResult.msg);
                    return false;
                }

                //服务端检查
                model.serverCheckAlias(alias, function (result) {
                    var code = result.code;
                    if (code == status.SUCCESS) {
                        //别名可用。
                        model.set("alias", alias);

                        var msg = self.messages.ALIAS_OK;
                        aliasTip.removeClass("red").html(msg);
                    } else if (code == status.SESSION_TIMEOUT) {
                        top.M139.UI.TipMessage.show(self.messages.sessionTimeout, { delay: 3000 });
                    }
                    else {
                        var msg = result.msg || result["var"].msg || self.messages.systemError;
                        //self.showPopup(self.txtAlias, msg);
                        aliasTip.addClass("red").html(msg);
                    }
                });
                return true;
            }
        },

        setUserName: function (name) {
            this.model.set("userName", name); //供main调用，因为账户信息设置可以修改发件人姓名
        },
        showPopup: function (dom, tip) {
            var popup = M139.UI.Popup.create({
                name: "tip_alias_check",
                target: dom[0],
                icon: "i_fail",
                content: tip
            });
            popup.render();

            if (window.setAliasTimer) {
                clearTimeout(window.setAliasTimer);
            }
            window.setAliasTimer = setTimeout(function () {
                if (popup) {
                    try {
                        popup.close();
                    } catch (e) { }
                }
            }, 3000); //3s后隐藏
        },
        update: function (callback, alias) {
            //此方法给main方法调用，更新别名
            var This = this;
            var isFromAccountAdmin = alias?true:false;
            var model = This.model;
            var status = This.status;
            var messages = This.messages;
            var alias = alias || This.txtAlias.val();
            alias = alias == This.DEFAULT_ALIAS_TIP ? "" : alias; //默认提示语，清理为空

            //客户端预检查
            var clientResult = model.clientCheckAlias(alias);
            if (clientResult.code != This.status.SUCCESS) {
            	This._setFocus();// 设置页面焦点
                parent.$Msg.alert(clientResult.msg);
                return;
            }

            if (alias != "") {
                //服务端检查
                model.serverCheckAlias(alias, function (result) {
                    var code = result.code;

                    if (code == status.SUCCESS) {
                        updateAccount();

                    } else if (code == status.SESSION_TIMEOUT) {
                        top.M139.UI.TipMessage.show(This.messages.sessionTimeout, { delay: 3000 });
                    } else if (code == status.ALIAS_HAS_USED) {
                        // add by tkh别名被占用
                        parent.$Msg.alert(This.messages.ALIAS_USED);
                    } else {
                        var msg = result.msg || result["var"].msg || This.messages.systemError;
                        parent.$Msg.alert(msg);
                        This._setFocus();// 设置页面焦点
                    }
                });
            } else {
                updateAccount();
            }

            function updateAccount() {
                var data = { "alias": alias };
                This.model.update(data, function (result) {
                    var code = result.code;
                    var msg = "";
                    if (code == status.SUCCESS) {
                        if (callback && typeof (callback) == "function") {
                            callback(result);
                        }
                        return;
                    } else if (code == status.SESSION_TIMEOUT) {
                        //登录超时
                        msg = messages.sessionTimeout;

                        //直接弹出提示框
                        parent.$Msg.alert(msg);
                        return;
                    } else if (code == status.ALIAS_IS_SYSTEM_REMAIN) {
                        //别名被占用
                        msg = messages.ALIAS_IS_SYSTEM_REMAIN;

                        //直接弹出提示框
                        parent.$Msg.alert(msg);
                        return
                    } else if (code == status.ALIAS_SET_ERROR) {
                        //设置失败：如已设置过再次设置等
                    } else {
                        msg = messages.systemError;
                    }
                    var msg = result.msg || msg || messages.systemError;
                    //$(document).scrollTop(0); //设置滚动条
					This._setFocus(isFromAccountAdmin);// 设置页面焦点 add by tkh
                    parent.$Msg.alert(msg);
                });
            }
        },
        /*
         *设置页面焦点 add by tkh
         *@param isFromAccountAdmin 是否在账号管理里设置邮箱账号
         */
        _setFocus : function(isFromAccountAdmin){
        	var This = this;
        	//var anchor = $T.Url.queryString("anchor");
            if(isFromAccountAdmin){
            	$("#aliasAccount").focus();
            }else{
            	$(document).scrollTop(0);
            	if(This.txtAlias){
            		This.txtAlias.focus();
            	}
            }
        }
    })
    );

})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Birthday', superClass.extend({
        messages:{
            DATE_NOT_ALLOW:"生日选择不能超过今天，请重新选择"
        },
        options: {
            from: "1910",   //起始年份
            to: new Date().getFullYear(),     //结束年份
            orderby: "asc",
            check:true      //检查日期是否超过今天
        },
        templete: ['<div id="year_{rnd}"></div>',
                    '<div id="month_{rnd}"></div>',
                    '<div id="day_{rnd}"></div>']
                    .join(""),
        /*
            日期选择控件,目前长度是固定的
            options={
                container:$("#div"),
                date:"2012-10-30", //默认日期，目前仅支持此格式
                from:1990, //最小的年份
                to:2012,  //最大的年份
                type:"asc", //年份排序，升序(asc)还是倒序(desc)
                check:true
            }
        */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.$el = options.container || $(document);
            /*
            if (options.date) { //如果有初始时间，则保存初始时间，在初始化之后设置
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
                var m = options.date.match(reg);
                if (m && m.length == 4) {
                    options = $.extend(options, {
                        year: parseInt(m[1], 10),
                        month: parseInt(m[2], 10),
                        day: parseInt(m[3], 10)
                    });

                    this.model.set({
                        year: options.year,
                        month: options.month,
                        day: options.day
                    });
                }
            }
            */
            this.setDate(options.date, false);
            this.options = $.extend(this.options, options); //保存
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var This = this;
            var model = This.model;

            var rnd = Math.random().toString().replace(".", "");
            var html = $T.Utils.format(This.templete, { "rnd": rnd }); //替换ID
            This.$el.append(html); //添加到页面中

            This.year = $("#year_" + rnd, This.$el);
            This.month = $("#month_" + rnd, This.$el);
            This.day = $("#day_" + rnd, This.$el);

            //创建年，月，日的3个下拉框
            This._createYearMenu(model.get("year"));
            This._createMonthMenu(model.get("month"));
            This._createDayMenu(model.get("day"));

            model.on("change:year", function () {
                var year = model.get("year");
                This._onYearChange(year);
            });
            model.on("change:month", function () {
                var month = model.get("month");
                This._onMonthChange(month);
            });

            //触发,设置默认日期。先触发日期，最后触发月份
            //以解决日期不正确的问题（2012-02-31最后会被设置并显示2012-02-29）
            this.model.trigger("change:day");
            this.model.trigger("change:year");
            this.model.trigger("change:month");
        },
        setDate: function (date,isSet) {
            if (!date) return;
            isSet = isSet || false;

            var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            var m = date.match(reg);
            if (m && m.length == 4) {
                var This = this;
                var options = {
                    year: parseInt(m[1], 10),
                    month: parseInt(m[2], 10),
                    day: parseInt(m[3], 10)
                };

                This.model.set(options);

                return;
                if (isSet) {
                    try{
                        This.yearMenu.setText(options.year);
                        This.monthMenu.setText(options.month);
                        This.dayMenu.setText(options.day);
                    }
                    catch (e) { }
                }
            }
        },
        _createYearMenu: function (defaultYear) {
            var This = this;
            var options = This.options;
            var yearObj = [];

            for (var i = options.from; i <= options.to; i++) {
                var obj = {
                    text: i,
                    value: i
                };
                yearObj.push(obj);
            }

            if (options.orderby && options.orderby.toLowerCase() == "desc") {
                yearObj = yearObj.sort(function (a, b) {
                    return b.value - a.value; //倒序
                });
            }

            defaultYear = defaultYear || "年";
            This.yearMenu = new M2012.UI.DropMenu.create({
                container: This.year,
                defaultText: defaultYear, //默认显示“年”字
                menuItems: yearObj,
                customClass: "setyearPop"
            });
            This.yearMenu.on("change", function (item) {
                This.model.set("year", item.value);
				This.trigger("ymdchange");
            });

            This.year.find(".dropDown").addClass("dropDown-year"); //加上年的class
        },
        _createMonthMenu: function (defaultMonth) {
            var This = this;
            var options = This.options;
            var monthObj = [];

            for (var i = 1; i <= 12; i++) {
                monthObj.push({
                    text: i,
                    value: i
                });
            }
            defaultMonth = defaultMonth || "月";
            This.monthMenu = new M2012.UI.DropMenu.create({
                container: This.month,
                defaultText: defaultMonth,
                menuItems: monthObj,
                customClass: "setmonthPop"
            });
            This.monthMenu.on("change", function (item) {
                This.model.set("month", item.value);
				This.trigger("ymdchange");
            });

            This.month.find(".dropDown").addClass("dropDown-month");
        },
        _createDayMenu: function (maxDay, defaultDay) {
            maxDay = maxDay || 31; //默认31天
            var This = this;
            var options = This.options;
            var dayObj = [];

            for (var i = 1; i <= maxDay; i++) {
                dayObj.push({
                    text: i,
                    value: i
                });
            }
            var defaultDay = defaultDay || "日";
            This.dayMenu = new M2012.UI.DropMenu.create({
                container: This.day,
                defaultText: defaultDay,
                menuItems: dayObj,
                customClass: "setdayPop"
            });
            This.dayMenu.on("change", function (item) {
                This.model.set("day", item.value);
				This.trigger("ymdchange");
            });

            This.day.find(".dropDown").addClass("dropDown-day");
        },
        _onYearChange: function (year) {
            var This = this;
            //This.model.set("year", year);
            This.yearMenu.setText(year);
            var month = This.model.get("month");
            if (month) { //未设置月份时，不修改
                This._onMonthChange(month); //触发月份选择，由月份去触发日期选择判断
            }
        },
        _onMonthChange: function (month) {
            var This = this;
            //This.model.set("month", month);
            This.monthMenu.setText(month);
            var date = "{year}-{month}-01 00:00:00"; //为了兼容M139.Date.parse(str)方法
            var dateObj = {
                "year": This.model.get("year") || 2000, //取2000年为闰年，2月有29天
                "month": month || 1                     //取1月，在未设置任何日期之前，日部分可选择31天
            };

            date = $T.Utils.format(date, dateObj); //格式化
            var datetime = $Date.parse(date); //转换
            var maxDay = $Date.getDaysOfMonth(datetime); //获取该月的最大天数，如闰年2月有29天
            var day = This.model.get("day");
            if (day) { //未设置日期时，不做修改
                day = maxDay >= day ? day : maxDay; //判断天数是否大于最大天数，取有效值
                This.model.set("day", day); //设置保存为该月最大的天数
            }
            This._createDayMenu(maxDay, day);
        },
        
        //个位数前辍 0 
        numFix: "0000000000".split('').concat(",,,,,,,,,,,,,,,,,,,,,".split(",")),

        toLongDate: function(year, month, day){
            var longDate = $T.format("{year}-{month}-{day}", {
                "year": year,
                "month": this.numFix[month] + month,
                "day": this.numFix[day] + day
            });
            return longDate;
        },

        /**
            公共方法，获取设置的日期
        */
        getDate: function () {
            //默认返回"年-月-日"格式
            var This = this;

            var model = This.model;
            var checkDate = This.options.check;
            var strDate = null;

            if (model.has("year") && model.has("month") && model.has("day")) { //判断值
                
                var year = model.get("year"),
                    month = model.get("month"),
                    day = model.get("day");

                if (checkDate) {
                    var userDate = new Date(year, month - 1, day);
                    if (userDate && userDate < new Date()) {
                        
                    } else {
                        top.$Msg.alert(this.messages.DATE_NOT_ALLOW);
                        return strDate;
                    }
                }

                strDate = This.toLongDate(year, month, day);
            }

            return strDate
        }
    })
    );

    $.extend(M2012.Settings.View.Birthday, {
        //*
        create: function (options) {
            if (options && options.container) {
                var datePicker = new M2012.Settings.View.Birthday(options);
                return datePicker;
            } else {
                throw "M2012.Settings.View.Birthday参数不合法:"
                        + JSON.stringify(options);
            }
        }
        //*/
    });
})(jQuery, _, M139);
/**
    * @fileOverview 定义设置页账户Model层的文件.
*/


(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页账户Model层
    */
    M139.namespace('M2012.Settings.Account.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Account.Model.prototype
    */
        {
        defaults: {
            defaultText: null,
            getTitle: [],
            Atitle: [],
            keyId: null,
            noSign: "不使用", //没有电子签名的时候显示的文字
            title: null,
            content: null,
            isDefault: 0,
            isAutoDate: 0,
            opType: null, //1 添加   2  修改   3 删除
            ImageUrl: null,
            newData: null,
            obj: null,
            num: 100,
            vcardCon: null, //接口里电子名片的content
            type: 0,
            signData: null,
            isMax: false//邮件签名是否达到最大个数3个
        },
        anchor: {
            sign: { id: "areaSign", url: "sign" },
            lock: { id: "areaSafeLock", url: "lock" },
            accountAdmin: { id: "accountAdminContainer", url: "accountAdmin" },
            basePersonalInfo: { id: "info_account", url: "basePersonalInfo" },
            userInfo: { id: "userInfo", url: "userInfo" }
        },
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        messages: {
            successEdit: "电子名片编辑成功",
            signMaxNum: "邮件签名数量已达上限",
            entryName: "请输入联系人姓名",
            mailNull: "请输入常用邮箱",
            mobileNull: "请输入常用手机",
            mailError: "常用邮箱地址格式不正确，请重新输入",
            mobileError: "手机号码格式不正确，请重新输入",
            phoneError: "请输入正确的电话号码",
            zipcodeError: "请输入正确的邮政编码",
            nameExsit: "该签名标题已经存在",
            editVcardError: "编辑电子名片失败，请重试",
            signTitleNull: "签名的标题不能为空",
            signContentNull: "签名的内容不能为空",
            signContentMax: "签名内容不超过5000个字符或者2500个汉字",
            noFolderToLock: "您没有可加锁的文件夹",
            cancelSsoOrder: "取消授权成功"
        },

        initialize: function (options) {
            if (options) {
                this.set({
                    originalUserInfo: options.originalUserInfo
                });
            }
        },
      loadResource: function (url, callback) {
            var elem = null;
            elem = document.createElement("script");
            elem.charset = "utf-8";
            elem.src = url;
            elem.defer = true;

            if (document.all) {
                elem.onreadystatechange = function () {
                    if (elem.readyState == "loaded" || elem.readyState == "complete") {
                        if (callback) callback();
                    }
                }
            } else {
                elem.onload = function () {
                    if (callback) callback();
                }
            }
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(elem);
        },
       /**
        *获取接口返回的邮件签名数据
        */
        getSignatures: function (callback) {
            $RM.getSignatures(function (result) {
                callback(result["var"]);
            });
        },
        /**
        *获取接口返回的邮件签名数据
        */
        setSignatures: function (callback) {
            var self = this;
            var options = {
                opType: this.get("opType"),
                id: this.get("keyId"),
                title: this.get("title"),
                content: this.get("content"),
                isHtml: 1,
                isDefault: this.get("isDefault"),
                isAutoDate: this.get("isAutoDate"),
                isSMTP: 0,
                type: this.get("type")
            }
            $RM.setSignatures(options, function (result) {
                callback(result);
                self.getSignatures(function (data) {
                    top.$App.registerConfig("SignList", data);
                });
            });
        },
        /**
        *获取接口返回的邮件签名数据
        */
        delSignatures: function (callback) {
            var options = {
                opType: 2,
                id: this.get("keyId")
            }
            $RM.setSignatures(options, function (result) {
                callback(result);
            });
        }
    })
    );

})(jQuery, _, M139);





/**
    * @fileOverview 定义设置页账户View层的文件.
*/
/**
    *@namespace 
    *设置页账户View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Account.View', superClass.extend(//安全锁
    /**
    *@lends M2012.Settings.Account.View.prototype
    */
    {
    el: "#folderPassword",
    events: {
        "click #editLockArea": "editLockArea",
        "click #editPassword": "editPassword",
        "click #unLock": "unLock"
    },
    template: "",
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    initialize: function (options) {
        var self = this;


        this.model = new M2012.Settings.Account.Model(options);
        this.initEvents();
        return superClass.prototype.initialize.apply(this, arguments);
    },
    checkBillSub: function (customData) {
        var folders = this.getTop().$App.getFolders();
        var foldLen = folders.length;
        var bill = false;
        var sub = false;
        $.each(customData, function (i, e) {
            if (e.fid == 8) {
                bill = true;
            }
            if (e.fid == 9) {
                sub = true;
            }
        })
        for (var n = 0; n < foldLen; n++) {
            if (folders[n].fid == 8 && bill == false) { //订阅中心和帐单中心
                customData.push(folders[n]);
            }
            if (folders[n].fid == 9 && sub == false) { //订阅中心和帐单中心
                customData.push(folders[n]);
            }
        };
        return customData;
    },
    /**
    *获取我的文件夹的数据,把数据绑定到模板上，再加载到HTML中。
    */
    render: function (type, trTem, tdTem, table, tr) {
        var _top = this.getTop();
        if (!_top || !_top.$App) {
            return;
        }
    
        var self = this;
        var anchor = $T.Url.queryString("anchor");
        var data = _top.$App.getFolders(type).concat([]);
        if (type == "custom") {
            data = this.checkBillSub(data);
        }
        var objAnchor = self.model.anchor[anchor];
        //var pm=appView.tabpageView.model; //父view的model，即模块管理类
        //this.el=pm.getModule(pm.get("currentModule")).element;//显示容器
        var templateStr = $("#" + trTem).val();
        var templateTd = $("#" + tdTem).val();
        var rp = new Repeater(templateStr);
        var rpTd = new Repeater(templateTd);
        if (!data) {
            return;
        } else {
            var arrTdInfo = self.createJsonData(type, data);
            var html = rp.DataBind(arrTdInfo); //数据源绑定后即直接生成dom
            if (arrTdInfo.length > 0) {
                $("#setLock").show();
                $("#setLock").prev().hide();
                $("#" + table).remove();
                $("#safelockTab").append(html);
            }
            for (var i = 0; i < arrTdInfo.length; i++) {
                var infoTd = arrTdInfo[i]["folderInfo"];
                var htmlTd = rpTd.DataBind(infoTd);
                $("#safelockTab ." + tr).eq(i).html(htmlTd);
            }
        }
        if (anchor && objAnchor && anchor == objAnchor["url"]) {
            var i = 100, b = objAnchor["id"];
            var timer = setInterval(function () {
                var a = $("#" + b);
                a = a.offset().top + a.height();

                document.body.scrollTop = a;
                if (document.body.scrollTop === 0) {
                    document.documentElement.scrollTop = a;
                }

                if (i--) {
                    clearInterval(timer);
                }
            }, 100);
        }
		//add by zhangsixue 理应有数据此值为1，但是。。。
		var passFlag = _top.$App.getView("folder").model.get("passFlag");
		var passFlags = $.map(_top.$App.getFolders().concat([]),function(num){
			return num["folderPassFlag"];
		});
		//当所有文件夹未未加密但是总属性显示加密的情况下发生，兼容服务端BUG!!!
		if(passFlags.join("").indexOf("1") == -1 && passFlag == 1){
			$("#setLock").show();
			$("#setLock").prev().hide();
			$("#" + table).remove();
		}
        return superClass.prototype.render.apply(this, arguments);
    },
    /**
    *把数据经过整理，以达到输出成多行3列的表格形式。
    格式2行3列：
    [
    {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]},
    {folderInfo:[{name:"",email:""},{name:"",email:""},{name:"",email:""}]}
    ]
    */
    createJsonData: function (type, result) {
        var arrResponse = [];
        if (!result) {
            return;
        }
        else {
            var len = result.length;
            for (var n = 0; n < len; n++) {
                if (result[n].folderPassFlag == 1) {
                    arrResponse.push(result[n]);
                }
            }
            var num = 3;
            var arrTr = [];
            var arrTd = [];
            var arrTable = [];
            var arrData = [];
            var arrLen = arrResponse.length;
            var groups = Math.ceil(arrLen / num);
            var other = arrLen % num;
            for (var o = 0; o < arrLen; o++) {
                var name = pubName = arrResponse[o].name;
                if (type == "pop") {//如果是代收邮件
                    var name = pubName = arrResponse[o].email;
                    var foldername = arrResponse[o].name;
                    if (foldername.indexOf("@") > -1) {
                        var name = name.split("@")[1];
                        name = name.split(".")[0];
                        name = name + "邮箱";
                    } else {
                        name = foldername;
                    }
                }
                arrTr.push({
                    name: name,
                    mail: pubName
                })
            }
            if (other > 0) {//给多出来的单元格添加空数据
                for (var m = 0; m < num - other; m++) {
                    arrTr.push({
                        name: "",
                        mail: ""
                    })
                }
            }
            for (var i = 0; i < groups; i++) {
                var startNum = num * i;
                var endNum = num * (i + 1);
                arrTd.push({
                    folderInfo: arrTr.slice(startNum, endNum)
                });
            }
        }
        return arrTd;
    },
    /**
    *获取SID值
    */
    getSid: function () {
        var sid = $T.Url.queryString("sid");
        return sid;
    },
    /**
    *跳转到安全锁密码验证页面
    *type=edit表示是从修改加锁范围入口进来的。
    */
    editLockArea: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock.html?type=edit&sid=" + this.getSid();
    },
    /**
    *跳转到安全锁密码验证页面
    *type=editPassword表示是从修改安全锁密码入口进来的。
    */
    editPassword: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock_edit_password.html?type=editPassword&sid=" + this.getSid();
    },
    /**
    *跳转到安全锁密码验证页面
    *type=unlock表示是从关闭安全锁入口进来的。
    */
    unLock: function () {
        if (M139.Browser.is.ie) {
            window.event.returnValue = false;
        }
        window.location = "account_lock.html?type=unlock&sid=" + this.getSid();
    },
    /**
    *在无安全锁的状态下点击入口进入设置安全锁的页面，初始状态无需要验证安全锁
    */
    initEvents: function () {
        if (!top.$App) {
            return;
        }

        this.mailTips();
        var self = this;
        var custom = top.$App.getFolders("custom").concat([]);
        var folders = top.$App.getFolders("pop");
        folders=folders.concat(custom);
        $("#setSafeLock").click(function () {
            if (folders.length == 0) {
                top.$Msg.alert(
                                self.model.messages.noFolderToLock,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                return
            }
            var model = $("#setSafeLock").attr("name");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            window.location = "account_lock.html?type=normal&sid=" + self.getSid();
        });
    },
    /**
    *错误提示信息
    */
    mailTips: function () {
        $("#popTable .gray").live("mouseover", function () {
            //var html = $(this).html();
            var self = this;
            var html = $(this).html();
            var appendHtml = '<span class="formError" style="position:absolute; line-height: 16px; ">' + html + '</span>';
            setTimeout(function () {
                $("#popTable .gray").next().remove();
                $(self).parent().append(appendHtml);
            }, 250)
        })
        $("#popTable .gray").live("mouseout", function () {
            var self = this;
            setTimeout(function () {
                $(self).next().remove();
            }, 250)
        });

    }
}));

})(jQuery, _, M139);




/* @fileOverview 定义设置签名View层的文件.
*/
/**
*@namespace 
*设置签名View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.Sign.View', superClass.extend(//邮件签名
    /**
    *@lends M2012.Settings.Sign.View.prototype
    */
        {
        getTop: function () {
            return M139.PageApplication.getTopAppWindow();
        },
        vcardHtml: null,
        initialize: function (option) {
            var self = this;
            this.norTipsContent = $("#norTipsContent");
            this.icoImg = $("#norTipsIco img");
            this.txtUserName = $("#txtUserName");
            this.txtEmail = $("#txtEmail");
            this.txtMobile = $("#txtMobile");
            this.txtRemarks = $("#txtRemarks");
            this.mailSignView = $("#mailSignView");
            this.httpimgload = "/g2/addr/apiserver/httpimgload.ashx?sid=";
            this.model = new M2012.Settings.Account.Model({ originalUserInfo: option.userInfo });
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
            this.ifDel();
            this.addSign();
            this.editSign();
        },
        frmInfoOnLoad : function (obj) {},
        accountSetView: function (data) {
            if (typeof (accountSetting) != "undefined") {
                accountSetting.model.set({
                    userName: $T.Html.decode(data.AddrFirstName),
                    email: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    image: data.ImageUrl,
                    ImageUrl: data.ImageUrl
                })
            }
        },
        getVcardCon: function (callback) {
            var self = this;

            data = self.model.get("originalUserInfo");
            if (data) {
                var result = [
                        { key: $T.Html.encode(data.AddrFirstName) },
                        { key: $T.Html.encode(data.FavoWord) },
                        { key: $T.Html.encode(data.UserJob) },
                        { key: $T.Html.encode(data.CPName) },
                        { key: $T.Html.encode(data.CPAddress) },
                        { key: data.FamilyEmail },
                        { key: data.MobilePhone },
                        { key: data.OtherPhone },
                        { key: data.BusinessFax },
                        { key: $T.Html.encode(data.CPZipCode) }
                    ]
                var arr = [
                        { key: "vcardTitle", type: "" },
                        { key: "vcardSubject", type: "" },
                        { key: "vcardJob", type: "职务:" },
                        { key: "vcardCompany", type: "公司:" },
                        { key: "vcardAddr", type: "地址:" },
                        { key: "vcardMail", type: "邮箱:" },
                        { key: "vcardMobile", type: "手机:" },
                        { key: "vcardPhone", type: "电话:" },
                        { key: "vcardFax", type: "传真:" },
                        { key: "vcardZipCode", type: "邮编:" }
                    ]

                if (data.ImageUrl) {
                    var url, link;
                    if(data.ImageUrl.indexOf("//") == -1){
                        link = self.checkDomain(top.getDomain('resource'));
                        url = link + $T.Html.encode(data.ImageUrl);
                    } else {
	                    url = $T.Html.encode(data.ImageUrl);
                    }
                    url = M139.HttpRouter.getNoProxyUrl(url);
                } else {
                    url = top.$App.getResourceHost() + "/m2012/images/ad/face.jpg";
                }

                self.icoImg.attr("src", url);

                var len = result.length;
                var listArr = [];
                for (var i = 0; i < len; i++) {
                    if (result[i].key && result[i].key != undefined) {
                        var html = "<p class='norTipsLine'>" + arr[i].type + result[i].key + "</p>";
                        listArr.push(html)
                    }
                }
                var text = listArr.join("");
                text = text.replace("<br>*年*月*日 星期*", "<br>$时间$");
                self.vcardHtml = text;
                if (callback) {
                    callback(text)
                }
            }
        },
        /**
        *获取邮件签名列表数据。
        */
        render: function () {
            var self = this;
            self.statusIsDefault = false;
            self.getSignData();
            self.getVcardData();
            top.BH("account_load");
            return superClass.prototype.render.apply(self, arguments);
        },
        has: false, //是否有电子名片
        /**
        *默认签名的index值，初始值null
        */
        isDefaultIndex: null,
        /**
        *组装JSON数组，获取签名的title、content、id。
        */
        initSign: function (dataSource) {
            var newData = dataSource; //保存原始的数据到newData
            var self = this;
            var titleArr = [];
            var idArr = [];
            var contentArr = [];
            var result = {};
            var len = dataSource.length;
            var status = false;
            for (var m = 0; m < len; m++) {
                if (dataSource[m].title == "我的电子名片") {
                    var data = dataSource.splice(m, 1);
                    dataSource.unshift(data[0]);
                }
            }
            for (var o = 0; o < newData.length; o++) {
                var title = newData[o].title;
                var type = newData[o].type;
                var newDefault = newData[o].isDefault;
                titleArr.push({ html: title, myData: o, type: type });
                if (type == 1) {
                    this.has = true;
                }
                if (newDefault == 1) {
                    this.statusIsDefault = true;
                    this.isDefaultIndex = o;
                }
            }
            self.model.set({ newData: newData })
            if (len == 0) {
                $("#mailSignView").hide();
                self.model.set({ "defaultText": self.initText() });
            }
            for (var i = 0; i < len; i++) {
                var id = dataSource[i].id;
                var content = dataSource[i].content;
                var con = content.replace(/&lt;/g, "<");
                con = con.replace(/&gt;/g, ">");
                con = con.replace(/&quot;/g, '"');
                con = con.replace("<br>$时间$", "<br>*年*月*日 星期*")
                con = $T.Html.decode(con);
                dataSource[i].content = con;

                idArr.push({ id: id, myData: i + 1 });
                contentArr.push({ con: con, myData: i });
            }
            if (!this.has) {
                titleArr.unshift({ html: "我的电子名片", myData: 0, type: 1 });
            }
            if (titleArr.length > 3) {//最多只能设置3个签名+一个电子名片 
                this.model.set({ "isMax": true });
            } else {
                this.model.set({ "isMax": false });
            }
            if (this.statusIsDefault) {//如果有默认签名
                var n = this.isDefaultIndex;
                $("#mailSignView").show();
                $("#btnEditSign").attr("index", n)
                if (dataSource[n].title == "我的电子名片") {
                    self.getVcardCon(function (text) {
                        if (dataSource[n].isAutoDate == 1) {
                            text = text + "<p class='norTipsLine'>*年*月*日 星期*</p>"
                        }
                        self.norTipsContent.html(text).prev().show();
                        self.mailSignView.find("#btnIfDel").hide();
                    });
                } else {
                    var datacon = dataSource[n].content;
                    datacon = datacon.replace("<script>", "");
                    datacon = datacon.replace("/<script>", "");
                    self.norTipsContent.html(datacon).prev().hide();
                    self.mailSignView.find("#btnIfDel").show();
                }
                self.model.set({ "keyId": dataSource[n].id, "defaultText": dataSource[n].title, "content": dataSource[n].content, "isAutoDate": dataSource[n].isAutoDate }); //初始状态的签名，保存起来，当点击“不使用”的时候取出来进行修改
            } else {//没有默认签名的情况下
                $("#mailSignView").hide();
                self.model.set({ "defaultText": self.initText() });
            }
            titleArr.unshift({ html: this.initText(), myData: -2 }, { isLine: true })
            self.showMenu(titleArr, contentArr, idArr, dataSource);
        },
        getOptions: function (obj) {
            var src = obj("#faceImg").attr("src");
            var title = obj("#vcardTitle").val();
            var subject = obj("#vcardSubject textarea").val();
            var job = obj("#vcardJob").val();
            var company = obj("#vcardCompany").val();
            var addr = obj("#vcardAddr").val();
            var mail = obj("#vcardMail").val();
            var mobile = obj("#vcardMobile").val();
            var phone = obj("#vcardPhone").val();
            var fax = obj("#vcardFax").val();
            var zipcode = obj("#vcardZipCode").val();
            
            src = decodeURIComponent(src);
            if(src.indexOf("?") > 0){
	            src = src.substr(0, src.indexOf("?"));
            }

            var options = {
                ImageUrl: src.indexOf("&path=") > 0 ? $T.Html.decode(src.split("path=")[1]) : src,
                AddrFirstName: title,
                FavoWord: subject,
                UserJob: job,
                CPName: company,
                CPAddress: addr,
                FamilyEmail: mail,
                MobilePhone: mobile,
                OtherPhone: phone,
                BusinessFax: fax,
                CPZipCode: $T.Html.encode(zipcode)
            }
            return options;
        },
        checkData: function (parentObj, e) {
            var objTitle = parentObj("#vcardTitle");
            var objMail = parentObj("#vcardMail");
            var objMobile = parentObj("#vcardMobile");
            var objPhone = parentObj("#vcardPhone");
            var objFax = parentObj("#vcardFax");
            var objZipcode = parentObj("#vcardZipCode");
            var title = objTitle.val();
            var mail = objMail.val();
            var mobile = objMobile.val();
            var phone = objPhone.val();
            var fax = objFax.val();
            var zipcode = objZipcode.val();
            var self = this;
            var ex = /1\d{10}|((0(\d{3}|\d{2}))-)?\d{7,8}(-\d*)?/;
            var ifPhone = ex.test(phone);
            var ifFax = ex.test(fax);
            var arr = [
                { text: self.model.messages.entryName, id: objTitle, status: title == "" },
                { text: self.model.messages.mailNull, id: objMail, status: mail == "" },
                { text: self.model.messages.mobileNull, id: objMobile, status: mobile == "" },
                { text: self.model.messages.mailError, id: objMail, status: !$Email.isEmail(mail) },
                { text: self.model.messages.mobileError, id: objMobile, status: !$Mobile.isMobile(mobile) },
                { text: self.model.messages.phoneError, id: objPhone, status: phone != "" && !ifPhone },
                { text: self.model.messages.phoneError, id: objFax, status: fax != "" && !ifFax },
                { text: self.model.messages.zipcodeError, id: objZipcode, status: zipcode != "" && isNaN(zipcode) }
            ];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].status) {
                    self.alertWindow(arr[i].text, arr[i].id);
                    e.cancel = true;
                    return false
                }
            };
            return true
        },
        checkDomain: function (url) {
            if (url.indexOf("/g2/") > -1) {
                if (/cookiepartid=1(;|$)/.test(document.cookie)) {
                    url = url.replace("/g2/", "/g3/");
                }
            }
            return url;
        },
        getVcardData: function (callback) {
            var self = this;

            (function (data) {
                var tableArr = [{
                    title: data.AddrFirstName,
                    job: data.UserJob,
                    company: data.CPName,
                    addr: data.CPAddress,
                    mail: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    phone: data.OtherPhone,
                    fax: data.BusinessFax,
                    zipcode: data.CPZipCode
                }]
                tableArr[0].subject = "<textarea class='accountTextare'>" + data.FavoWord + "</textarea>";
                var arr = [
                    { value: data.FavoWord, key: "简介", type: "subject" },
                    { value: data.UserJob, key: "职务", type: "job" },
                    { value: data.CPName, key: "公司", type: "company" },
                    { value: data.CPAddress, key: "地址", type: "addr" },
                    { value: data.FamilyEmail, key: "邮箱", type: "mail" },
                    { value: data.MobilePhone, key: "手机", type: "mobile" },
                    { value: data.OtherPhone, key: "电话", type: "phone" },
                    { value: data.BusinessFax, key: "传真", type: "fax" },
                    { value: data.CPZipCode, key: "邮编", type: "zipcode" }
                ]
                var len = arr.length;
                var htmlArr = [];
                for (var i = 0; i < len; i++) {
                    if (arr[i].value != undefined) {
                        var html = '<tr><td width="40">' + arr[i].key + '：</td><td>' + arr[i].value + '</td></tr>';
                        htmlArr.push(html)
                    } else {
                        var type = arr[i]["type"];
                        tableArr[0][type] = String(tableArr[0][type]).replace("undefined", "");
                    }
                }
                var text = htmlArr.join("");
                var con = self.getVcardHtml(data, text);
                self.model.set({ "vcardCon": con })
                if (callback) { callback() }
            })(self.model.get("originalUserInfo"));
        },
        editVcardEvent: function (e, data, text) {
            var self = this;
            var parentObj = parent.$;
            if (!self.checkData(parentObj, e)) {
                return
            }

            var options = self.getOptions(parentObj);
            self.model.set({ originalUserInfo: options })
            var con = self.getVcardHtml(data, text);
            var defaultStatus = parentObj("#defaultSign").attr("checked") ? 1 : 0;

            if (parentObj("#addDate").attr("checked")) {
                var dateStatus = 1;
                con1 = con + "<br>$时间$";
            } else {
                var dateStatus = 0;
                con1 = con;
            }
            M2012.Contacts.getModel().modifyUserInfo(options, function (result) {
                if (result.ResultCode == 0) {
                    self.getVcardCon(function (text) {
                        self.model.set({
                            opType: 3,
                            title: "我的电子名片",
                            content: con1,
                            isDefault: defaultStatus,
                            isAutoDate: dateStatus,
                            type: 1
                        })
                        self.model.setSignatures(function (dataSource) {
                            //self.render();
                        })
                        top.M139.UI.TipMessage.show(self.model.messages.successEdit, { delay: 2000 });
                        self.accountSetView(options);
                    });
                } else {
                    self.alertWindow(self.model.messages.editVcardError);
                }
            })
        },
        openVcard: function () {
            var self = this;
            var sid = $T.Url.queryString("sid");
            (function (data) {
                var url = "/m2012/images/ad/face.jpg"; //默认图片
                var link = top.getDomain('resource');
                link = self.checkDomain(link);
                if (data.ImageUrl && data.ImageUrl.indexOf("//") == -1) {
                    url = link + $T.Html.encode(data.ImageUrl);
                    url = M139.HttpRouter.getNoProxyUrl(url);
                }
                var tableArr = [{
                    src: url,
                    title: $T.Html.encode(data.AddrFirstName),
                    job: $T.Html.encode(data.UserJob),
                    company: $T.Html.encode(data.CPName),
                    addr: $T.Html.encode(data.CPAddress),
                    mail: data.FamilyEmail,
                    mobile: data.MobilePhone,
                    phone: data.OtherPhone,
                    fax: data.BusinessFax,
                    zipcode: data.CPZipCode
                }]
                var gray = !data.FavoWord ? "gray" : "";
                var favoword = !data.FavoWord ? "个性签名" : data.FavoWord;
                tableArr[0].subject = "<textarea class='accountTextare " + gray + "'>" + favoword + "</textarea>";
                var arr = [
                    { value: data.FavoWord, key: "简介", type: "subject" },
                    { value: data.UserJob, key: "职务", type: "job" },
                    { value: data.CPName, key: "公司", type: "company" },
                    { value: data.CPAddress, key: "地址", type: "addr" },
                    { value: data.FamilyEmail, key: "邮箱", type: "mail" },
                    { value: data.MobilePhone, key: "手机", type: "mobile" },
                    { value: data.OtherPhone, key: "电话", type: "phone" },
                    { value: data.BusinessFax, key: "传真", type: "fax" },
                    { value: data.CPZipCode, key: "邮编", type: "zipcode" }
                ]
                var len = arr.length;
                var htmlArr = [];
                for (var i = 0; i < len; i++) {
                    if (arr[i].value != undefined) {
                        var html = '<tr><td width="40">' + arr[i].key + '：</td><td>' + arr[i].value + '</td></tr>';
                        htmlArr.push(html)
                    } else {
                        var type = arr[i]["type"];
                        tableArr[0][type] = String(tableArr[0][type]).replace("undefined", "");
                    }
                }
                var text = htmlArr.join("");
                var str = $("#vcardHtml").val();
                var rp1 = new Repeater(str);
                var html1 = rp1.DataBind(tableArr); //数据源绑定后即直接生成dom
                var dialog = self.getTop().$Msg.showHTML(
                    html1,
                    function (e) {
                        self.editVcardEvent(e, data, text);
                    },{
                        dialogTitle: "编辑电子名片",
                        isHtml: true,
                        buttons: ["确 定", "取 消"]
                    }
                );
                
                dialog.$el.find(".accountTextare").focus(function () {
                    var This = $(this);
                    if (This.hasClass("gray")) {
                        This.val("").removeClass("gray");
                    }
                })
                self.getAutoDate(dialog.$el);
                self.model.getSignatures(function (re) {
                    re = self.model.get("newData");
                    var index = $("#btnEditSign").attr("index");
                    var obj = {
                        title: re[index]["title"],
                        con: re[index]["content"],
                        isDefault: re[index]["isDefault"],
                        isAutoDate: re[index]["isAutoDate"]
                    };
                    if (obj.isAutoDate == 1 || obj["con"].indexOf("<br>*年*月*日 星期*") > -1) {
                        dialog.$el.find("#addDate").attr("checked", true);
                        dialog.$el.find("#showNewDate").show();
                    } else {
                        dialog.$el.find("#addDate").removeAttr("checked");
                    };
                });

				// 上传修改头像
				dialog.$el.find("#faceImgSpan").click(function(e){
					$("#info_image input:file")[0].click();
				});
            })(self.model.get("originalUserInfo"));
        },
        setImgUrl: function (url, imgObj) {
            imgObj.attr("src", url)
        },

        /**
        *是否显示时间。
        */
        getAutoDate: function (obj) {
            var self = this;
            obj.find("#addDate").click(function () {
                var content = obj.find("#htmlEdiorContainer iframe").contents().find("body");
                var text = "<br>*年*月*日 星期*";
                if ($(this).attr("checked")) {
                    self.model.set({ "isAutoDate": 1 });
                    obj.find("#showNewDate").show();
                } else {
                    self.model.set({ "isAutoDate": 0 });
                    obj.find("#showNewDate").hide();
                }
            });
        },
        getSignData: function () {
            var self = this;
            this.model.getSignatures(function (result) {
                self.model.set({ "signData": result })
                self.initSign(result);
            })
        },
        ifAddSign: function (data, callback) {
            var self = this;
            var tips = self.model.messages.signContentMax;
            var name = "新建签名";
            var obj = {
                title: "",
                con: '<span style="color:gray">' + tips + '</span>',
                isDefault: "",
                isAutoDate: ""
            }
            var objCon = obj.con;
            self.model.set({
                keyId: -1,
                opType: 1
            })
            var json = {
                objCon: objCon,
                name: name,
                obj: obj,
                data: data,
                callback: callback
            }
            self.getDialog(json);
        },
        ifEditSign: function (data, callback) {
            data = this.model.get("newData")
            var self = this;
            var name = "编辑签名";
            var index = $("#btnEditSign").attr("index");
            var obj = {
                title: data[index]["title"],
                con: data[index]["content"],
                isDefault: data[index]["isDefault"],
                isAutoDate: data[index]["isAutoDate"]
            }
            self.model.set({
                opType: 3
            })
            data.splice(index, 1)
            var objCon = obj.con;
        //    objCon = objCon.replace(/&lt;/g, "<");
        //    objCon = objCon.replace(/&gt;/g, ">");
		objCon = objCon.replace(/&/g,"&amp;"); //add by zsx 反转义
            objCon = objCon.replace("<br>*年*月*日 星期*", "");
            var json = {
                objCon: objCon,
                name: name,
                obj: obj,
                data: data,
                callback: callback
            }
            self.getDialog(json);
        },
        //检查签名的标题和内容是否合法
        checkSignData: function (val, signLen, con, json, e) {
            var self = this;
            for (var i = 0; i < signLen; i++) {
                if (json["data"][i].title == val || val == "我的电子名片" || val == "不使用") {
                    self.alertWindow(self.model.messages.nameExsit);
                    e.cancel = true;
                    return false;
                }
            }
            var arr = [
                { text: self.model.messages.signTitleNull, status: val == "" },
                { text: self.model.messages.signContentNull, status: con == "" },
                { text: self.model.messages.signContentMax, status: M139.Text.Utils.getBytes(con) > 5000 }
            ];
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].status) {
                    self.alertWindow(arr[i].text);
                    e.cancel = true;
                    return false
                }
            };
            return true
        },
        getDialog: function (json) {
            var self = this;
            var dialog = self.getTop().$Msg.showHTML(
                    self.getSignHtml(json.obj),
                    function (e) {
                        var parentObj = parent.$;
                        var val = parentObj("#signTitle").val();
                        val = val.replace(/(^\s*)|(\s*$)/g, "");
                        val = val.replace(/</g, "&lt;");
                        val = val.replace(/>/g, "&gt;");
                        var signLen = json["data"].length;
                        var con = parentObj("#htmlEdiorContainer iframe").contents().find("body").html();
                        //con = $T.Html.decode(con); 去掉解码，edit by zsx
						con = con.replace(/&lt;iframe/ig,'&lt').replace(/&lt;\/iframe&gt;/ig,'&lt;&gt;').replace(/onload|onerror/,'');
                        var status = self.checkSignData(val, signLen, con, json, e);
                        if (!status) {
                            return
                        }
                        var defaultStatus = parentObj("#defaultSign").attr("checked") ? 1 : 0;
                        if (parentObj("#addDate").attr("checked")) {
                            var dateStatus = 1;
                            con1 = con + "<br>$时间$"
                        } else {
                            var dateStatus = 0;
                            con1 = con;
                        }
                        self.model.set({
                            title: $T.Html.decode(val),
                            content: con1,
                            isDefault: defaultStatus,
                            isAutoDate: dateStatus,
                            type: 0
                        })
                        self.model.setSignatures(function (dataSource) {
                            if (dataSource["code"] == "S_OK") {
                                json["callback"]();
                            }
                        });
                    },
                    function (e) {
                        self.render();
                    },
                    {
                        dialogTitle: json.name,
                        isHtml: true,
                        buttons: ["确 定", "取 消"]
                    }
                );
            self.getAutoDate(dialog.$el);
            var editor = dialog.$el.find("#htmlEdiorContainer");
            var tips=self.model.messages.signContentMax;
            var editorView = M2012.UI.HTMLEditor.create({
                contaier: editor,
                maxLength: 5000,
                placeHolder: tips,
                maxLengthErrorTip: tips,
                blankUrl: "/m2012/html/editor_blank.htm"
            });
            editor.find("#ED_Bold").after(editor.find("#ED_Italic"))
            editor.find(".eidt-body").css({ "height": "180px" })
            editor.find(".eidt-body-full").css({ "padding-top": "30px" })
            editor.find(".edit-btn,.eidt-bar .eidt-bar-li .line,.eidt-bar .pushon").css({ "display": "none" })
            editor.find("#ED_Bold,#ED_FontFamily,#ED_FontSize,#ED_FontColor,#ED_Italic").css({ "display": "inline-block" })
            editorView.editor.setHtmlContent($T.Html.decode(json.objCon));
            if (json["obj"].isAutoDate == 1 || json["obj"]["con"].indexOf("<br>*年*月*日 星期*") > -1) {
                dialog.$el.find("#addDate").attr("checked", true);
                dialog.$el.find("#showNewDate").show();
            } else {
                dialog.$el.find("#addDate").removeAttr("checked");
            }
            editorView.on("focus", function () {
                var obj = editor.find("iframe").contents().find("body");
                console.log(obj.attr("contenteditable"))
                if (obj.text() == tips) {
                    obj.html("");
                }
            })
            editorView.on("blur", function () {
                var obj = editor.find("iframe").contents().find("body");
                if (obj.text() == "") {
                    obj.html('<span style="color:gray">' + tips + '</span>');
                }
            })
        },
        openSign: function (This, callback) {
            var self = this;
            self.model.getSignatures(function (data) {
                if (This.attr("index")) {
                    self.ifEditSign(data, callback);
                }
                else {
                    self.ifAddSign(data, callback);
                }

            })
        },
        /**
        *无任何签名时显示的文字。
        */
        initText: function () {
            var text = this.model.get("noSign");
            return text;
        },
        /**
        *点击下拉事件，获取签名列表。
        */
        showMenu: function (title, content, idArr, dataSource) {
            var self = this;
            var list = [];
            //console.log(title);
            //id.click(function () {
            self.getMenu(title, content, idArr, dataSource);
            //})
        },
        /**
        *下拉菜单内签名数据的组装和显示。
        */
        getMenu: function (title, content, idArr, dataSource) {
            var self = this;
            self.getVcardCon();
            var dropMenu = M2012.UI.DropMenu.create({
                defaultText: self.model.get("defaultText"),
                //selectedIndex:1,
                menuItems: title,
                container: $("#dropDown")
            });
            dropMenu.$el.css({ "width": "150px" });
            this.dropDownText = $("#dropDown .dropDownText");
            var val = this.dropDownText.text();
            dropMenu.on("change", function (item) {
                var text = item.html;
                var type = item.type;
                var num = item.myData;
                if (text == val) {
                    return
                }
                var isDefault = 1;
                var opType = 3;
                var keyId = "";
                var con = self.model.get("vcardCon");
                var tit = text;
                var isAutoDate = 0
                var t = 1;
                if (text == self.initText()) {
                    isDefault = 0;
                    keyId = self.model.get("keyId");
                    con = self.model.get("content");
                    tit = self.model.get("defaultText");
                    t = self.model.get("type");

                } else if (text == "我的电子名片") {
                    if (!self.has) {
                        opType = 1;
                        keyId = -1;
                    } else {
                        keyId = idArr[num]["id"];
                        isAutoDate = dataSource[num]["isAutoDate"];
                    }
                } else {
                    con = dataSource[num]["content"];
                    con = con.replace("<br>*年*月*日 星期*", "<br>$时间$")
                    tit = $T.Html.decode(text);
                    t = 0;
                    keyId = idArr[num]["id"];
                    isAutoDate = dataSource[num]["isAutoDate"];
                }
                self.model.set({
                    "isDefault": isDefault,
                    "opType": opType,
                    "keyId": keyId,
                    "content": con,
                    "title": tit,
                    "isAutoDate": isAutoDate,
                    "type": t
                })
                self.model.setSignatures(function (dataSource) {
                    self.render()
                })
            });
        },
        /**
        *删除邮件签名。
        */
        delSign: function () {
            var self = this;
            this.model.delSignatures(function (dataSource) {
                if (dataSource["code"] == "S_OK") {
                    self.model.set({ "defaultText": self.initText(), "isDefault": 0 });
                    self.statusIsDefault = false;
                    self.render();
                }
            })
        },
        /**
        *点击事件，是否删除。
        */
        ifDel: function () {
            var self = this;
            $("#btnIfDel").click(function () {
                var popup = M139.UI.Popup.create({
                            target: document.getElementById("btnIfDel"),
                            icon: "i_warn",
                            width: "200",
                            buttons: [{ text: "确定", cssClass: "btnSure", click: function () { self.delSign(); popup.close(); } },
        		                { text: "取消", click: function () { popup.close(); } }
        	                ],
                            content: "确定删除签名吗"
                        }
	                );

                popup.render();

            })
        },
        alertWindow: function (text, obj) {
            this.getTop().$Msg.alert(
                        text,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn",
                            onClose: function (e) {
                                if (obj) {
                                    obj.focus();
                                }
                            }
                        }
                    );
        },
        /**
        *添加邮件签名的弹出层。
        */
        addSign: function () {
            var self = this;
            $("#btnAddSign").click(function () {
                var This = $(this);
                if (self.model.get("isMax") == true) {
                    var text = self.model.messages.signMaxNum;
                    self.alertWindow(text);
                    return;
                }
                self.openSign(This, function () {
                    self.render();
                    top.BH("set_add_sign_save_success");
                });
            })
        },
        /**
        *编辑签名的弹出层，分为二种情况  编辑签名和编辑电子名片。
        */
        editSign: function () {
            var self = this;
            $("#btnEditSign").unbind();
            $("#btnEditSign").click(function () {
                var This = $(this);
                var sid = $T.Url.queryString("sid");
                var myInfo = $("#norTipsIco");
                if ($("#norTipsIco:hidden").length == 0) {
                    try {
                        self.openVcard();
                    } catch (e) { };
                    return;
                };
                var index = $(this).attr("index");
                self.openSign(This, function () {
                    self.render();
                });
            })
        },
        getSignHtml: function (obj) {
            var html = [
                '<link href="/m2012/css/module/editer.css" type="text/css" rel="stylesheet" />',
                '<style></style>',
                '<div class="acccount-edit">',
                '<input id="signTitle" type="text" maxlength="20" value="' + obj.title + '" class="iText mb_10">',
                '<div id="htmlEdiorContainer">',
                '</div>',
                '</div>',
                '<div class="editcardPop-foot">',
                '<label class="mr_10" for="defaultSign"><input id="defaultSign" checked type="checkbox" value="" class="mr_5">设为默认邮件签名</label>',
                '<label for="addDate"><input id="addDate" type="checkbox" value="" class="mr_5">添加写信日期<span style="display:none;" id="showNewDate"  class="gray">(*年*月*日 星期*)</span></label>',
                '</div>'].join("");
            return html;
        },
        getVcardHtml: function (obj, text) {
            var self = this;
            var link = self.httpimgload;
            link = self.checkDomain(link);
            var url = link + $T.Url.queryString("sid") + "&path=" + encodeURIComponent(obj.ImageUrl);
            url = M139.HttpRouter.getNoProxyUrl(url);

            var html = ['<table>',
            '<tbody>',
            '<tr>',
            '<td style="color:#b1b1b1;">-----------------------------------------------------</td>',
            '</tr>',
            '<tr>',
            '</tr>',
            '</tbody>',
            '</table>',
            '<table border="0" style="font-family:宋体;font-size:12px;border:1px solid #b5cbdd;-webkit-border-radius:5px;line-height:21px;background-color:#f8fcff;">',
            '<tbody>',
            '<tr>',
            '<td style="vertical-align:top;padding:5px;"><img rel="signImg" width="96" height="96" src="',
            url,
            '"></td>',
            '<td style="padding:5px;">',
            '<table style="font-size:12px;line-height:19px;">',
            '<tbody>',
            '<tr>',
            '<td colspan="2"><strong id="dzmp_unm" style="font-size:14px;">',
            $T.Html.encode(obj.AddrFirstName),
            '</strong></td>',
            '</tr>',
            '<tr>',
            '<td colspan="2" style="padding-bottom:5px;">',
            $T.Html.encode(obj.FavoWord),
            '</td>',
            '</tr>',
            $T.Html.encode(text),
            '</tbody>',
            '</table>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>'].join("");
            return html;
        }
    })
        );

})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义账号管理所需公共代码
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.AccountAdmin', Backbone.Model.extend({
        accountTypes: {
            NO_ALIAS_ACCOUNT: 'noAliasAccount', // 没有邮箱账号
            NO_MOBILE_ACCOUNT: 'noMobileAccount', // 没有手机账号
            HAS_ALL_ACCOUNT: 'hasAllAccount'// 两种账号都有
        },
        accountType: '',
        defaultMobileValue: '支持移动、联通、电信手机', // 手机号码输入框默认值
        defaultAliasValue: '例:bieming', // 手机号码输入框默认值
        SENDMSG_INTERVAL: 60,
        tipMessage: {
            SEND_PASSWORDSUC: '短信验证码已发送至您的手机：{0}',
            SEND_PASSWORDFAI: '获取短信验证码失败！',
            MOBILE_FORMATERROR: '请输入合法的手机号码！',
            MOBILE_LENGTHRROR: '请输入11位手机号码！',
            MOBILE_AVAILABLE: '该手机号码可用！',
            MOBILE_INVAILABLE: '该手机号码不可用！',
            LACK_MOBILE: '请输入您的手机号码！',
            LACK_PASSWORD: '请输入您的邮箱密码！',
            LACK_CHECKCODE: '请输入您的短信验证码！',
            CHECKCODE_FORMATERROR: '请输入合法的短信验证码！',
            BIND_MOBILEFAI: '手机号码绑定失败！',
            ERROR_PASSWORD: '您的密码输入有误，请重新输入！',
            MOBILE_EXIST: '该手机号码已注册139邮箱，请更换号码重新绑定！',

            MSG_SEND_FAILURE: "系统繁忙，请稍后再试",
            MSG_SENT: "验证码已发送",
            MSG_WAIT_TEXT: "秒后可重新获取",
            MSG_DEFAULT_TEXT: "获取短信验证码",
            MSG_RESEND_TEXT: "重新获取短信验证码",

            ACCOUNT_TEXT: "邮箱帐号"
        },
        responseCode: {
            FA_NEWPHONE_REGISTTED: "FA_NEWPHONE_REGISTTED",
            FA_OLDPHONE_CHANGING: "FA_OLDPHONE_CHANGING",
            FA_OLDPHONE_TOLIMITED: "FA_OLDPHONE_TOLIMITED",
            FA_NEWPHONE_TOLIMITED: "FA_NEWPHONE_TOLIMITED",
            FA_NEWPHONE_CHANGING: "FA_NEWPHONE_CHANGING",
            FA_OLDPHONE_EMPTY: "FA_OLDPHONE_EMPTY",
            FA_NEWPHONE_EMPTY: "FA_NEWPHONE_EMPTY",
            S_6: "-6",
            S_9: "9",
            S_OK: "S_OK",
            S_ERROR: "ERROR",
            FA_PWD_ERROR: "FA_PWD_ERROR",
            FA_PWD_EMPTY: "FA_PWD_EMPTY",
            FA_IS_NOT_PHONE: "FA_IS_NOT_PHONE",
            FA_SEND_ERROR: "FA_SEND_ERROR",
            FA_Frequency_Limited: "FA_Frequency_Limited",
            FA_SMS_EMPTY: "FA_SMS_EMPTY",
            FA_PWD_EXPIRE: "FA_PWD_EXPIRE",
            FA_SMS_OVERFLOW: "FA_SMS_OVERFLOW",
            FA_SMS_UNPASS: "FA_SMS_UNPASS",
            FA_CHANGE_FAIL: "FA_CHANGE_FAIL"
        },
        responseMsg: {
            FA_NEWPHONE_REGISTTED: '此号码已注册139邮箱，不能进行绑定',
            //S_3020 : '老号码正在进行的换号号码不能进行换号',
            FA_OLDPHONE_CHANGING: '正在为您绑定手机号码，绑定成功后您将收到短信通知，请注意查收。',
            FA_OLDPHONE_TOLIMITED: '老号码换号次数达到当月上限',
            FA_NEWPHONE_TOLIMITED: '该号码绑定次数达到当月上限',
            FA_NEWPHONE_CHANGING: '该号码正在进行绑定',
            FA_OLDPHONE_EMPTY: '旧手机号码不能为空',
            FA_NEWPHONE_EMPTY: '手机号码不能为空',
            S_6: '别名或手机号码不存在，请重新输入',
            S_9: '非中国移动手机号码',
            S_OK: '绑定手机号码成功',
            //S_ERROR : '业务ID不存在，非法登陆',
            S_ERROR: '请先获取短信验证码，并输入正确的验证码',
            FA_PWD_ERROR: '密码错误，请重新输入',
            FA_PWD_EMPTY: '密码不能为空，请输入密码',
            FA_IS_NOT_PHONE: '请输入11位的手机号码',

            FA_SEND_ERROR: '短信验证码发送错误',
            FA_Frequency_Limited: '发送频率受限制',
            FA_SMS_EMPTY: '请输入短信验证码',
            FA_PWD_EXPIRE: '短信验证码已超过30分钟，请重新获取',
            FA_SMS_OVERFLOW: '短信验证码输错三次，请重新获取',
            FA_SMS_UNPASS: '短信验证码输入错误，请重新输入',

            FA_CHANGE_FAIL: '绑定失败，请稍后再试'
        },
        callApi: M139.RichMail.API.call,
        verifyNumberData: {// 验证号码是否可用的请求报文格式
            newNumber: '',
            password: ''
        },
        changeNumberData: {// 绑定手机号码的请求报文格式
            transId: '',
            smsValidateCode: '',
            checkServiceItem: '0015'
        },
        initialize: function () {
            this.accountList = [];
            this.accountType = '';
            this.initData();
        },
        initData: function () {
            var self = this;
            var user = parent.$User;
            if (user.isChinaMobileUser()) {
                self.tipMessage.ACCOUNT_TEXT = "别名帐号";
            }
            if (user) {
                try {
                    var accountList = [];
                    var accounts = user.getAccountList() || [];
                    var hasAliasAccount = false, hasMobileAccount = false;
                    for (var i = 0, aLen = accounts.length; i < aLen; i++) {
                        var account = accounts[i];
                        if (account.type == 'fetion') {
                            account.index = 0;
                            account.text = '飞信帐号';
                        }
                        if (account.type == 'passid') {
                            account.index = 3;
                            account.text = '通行证帐号';
                        };
                        if (account.type == 'mobile') {
                            account.index = 1;
                            account.text = '手机帐号';
                            hasMobileAccount = true;
                        }
                        if (account.type == 'common') {
                            account.index = 2;
                            account.text = self.tipMessage['ACCOUNT_TEXT'];
                            hasAliasAccount = true;
                        }
                        accountList.push(account);
                    }
                    self.accountList = accountList;
                    if (!hasAliasAccount) {
                        self.accountType = self.accountTypes['NO_ALIAS_ACCOUNT'];
                    } else if (!hasMobileAccount) {
                        self.accountType = self.accountTypes['NO_MOBILE_ACCOUNT'];
                    } else {
                        self.accountType = self.accountTypes['HAS_ALL_ACCOUNT'];
                    }
                } catch (e) {
                    e.cancel = true;
                }
            }
        },
        /** 验证手机号码
        *@param {Object} options 初始化参数集
        *@param {String} options.oldNumber 邮箱别名
        *@param {String} options.newNumber 新手机
        *@param {String} options.passwordType 1（原密码）或2（短信密码）
        *@param {String} options.password 密码
        *@param {String} options.verfiyCode 图片验证码 
        *@param {Function} callback 回调
        */
        verifyNumber: function (options, callback) {
            this.callApi("user:checkPhoneAction", options, function (response) {
                console.log(response);
                if (callback) {
                    callback(response.responseData);
                }
            });
        },
        /** 绑定手机号码
        *@param {Object} options 初始化参数集
        *@param {String} options.transId 事物ID
        *@param {String} options.checkServiceItem 业务ID(0010/0015/0016/0017)
        *@param {String} options.smsValidateCode 短信验证码
        *@param {Function} callback 回调
        */
        bindMobile: function (options, callback) {
            this.callApi("user:bindPhoneAction", options, function (response) {
                console.log(response);
                //response.responseData = {code : 'S_OK'};
                if (callback) {
                    callback(response.responseData);
                }
            });
        },
        fail: function (errObj) {
            this.set({ "serverexception": errObj });
        }
    })
  );

})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义账号管理视图层
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.AccountAdmin', superClass.extend({
        initialize: function () {
            this.model = new M2012.Settings.Model.AccountAdmin();
            this.accountModel = new M2012.Settings.Model.Account();
            this.alterTipMessages();
            this.render();
        },
        alterTipMessages: function () {
            var self = this;
            if (parent.$User.isChinaMobileUser()) {
                $("#applyAlias p.mb_5").html('<a href="javascript:void(0)" class="btnNormal"><span>申请别名帐号</span></a><span class="c_999">（使用别名帐号发邮件，保护手机号码隐私）</span>');
                $("#aliasAccount").siblings('label').text('别名帐号：');
                $("#setOnlyOneTime").text('别名帐号仅能设置一次，不可修改。');

            }
        },
        render: function () {
            var self = this;
            M139.Timing.waitForReady("top.$User.getAccountList().length", function () {
                self.model.initData();
                var accountType = self.model.accountType;
                // 根据用户拥有的账号类型呈现不同的UI
                function renderAccountList(id) {
                    //$("#"+id).show().siblings('li').hide();
                    if (id == 'noAliasAccount') {
                        $("#noAliasAccount").show();
                        $("#noMobileAccount").hide();
                        $("#hasAllAccount").hide();
                    } else if (id == 'noMobileAccount') {
                        $("#noMobileAccount").show();
                        $("#noAliasAccount").hide();
                        $("#hasAllAccount").hide();
                    } else {
                        $("#hasAllAccount").show();
                        $("#noMobileAccount").hide();
                        $("#noAliasAccount").hide();
                    }
                    $("#" + id + " tr:eq(0)").siblings().remove();
                    $("#" + id + " tr:eq(0)").after(self.getAccountsHtml());
                }
                switch (accountType) {
                    case 'noAliasAccount':
                        renderAccountList('noAliasAccount');
                        $("#applyAlias").prev('tr').find('td').addClass('bNone');
                        break;
                    case 'noMobileAccount':
                        renderAccountList('noMobileAccount');
                        break;
                    case 'hasAllAccount':
                        renderAccountList('hasAllAccount');
                        break;
                    default:
                        console.log('账号类型异常！accountType:' + accountType);
                        break;
                }
                // 为不同的UI界面绑定事件
                self.initEvents(accountType);
            });
        },
        initEvents: function (accountType) {
            var self = this;
            self._bindEventForPublic();
            if (accountType == 'hasAllAccount') {
            } else if (accountType == 'noMobileAccount') {
                self._bindEventForNoMobile();
            } else if (accountType == 'noAliasAccount') {
                self._bindEventForNoAlias();
            }
        },
        // 刷新界面 供顶部添加别名或者换号成功后调用 M2012.Settings.View.Account.Main
        reflush : function(){
            var self = this;
            self.model.initData();
            $("#hasAllAccount tr:gt(0)").remove();
            self.render();
        },
        showUpdateUser: function (target) {
            var popup = M139.UI.Popup.create({
                target: target,
                icon: "i_warn",
                //width: 300,
                buttons: [{
                    text: "立即查看详情", click: function () {
                        popup.close();
                    }
                },
                    { text: "取消", click: function () { popup.close(); } }
                ],
                content: accountSetting.account.template.popUpdateUser
            });
            popup.render();
            var btnNormal = popup.contentElement.find(".btnNormal:first");
            btnNormal.attr("href", "/m2012/html/set/feature_meal_guide/index.html?sid=" + top.$App.getSid());
            btnNormal.attr("target", "_blank");
        },
        getNewDate: function (str) {
            try {
                str = str.split('-');
                var date = new Date();
                date.setUTCFullYear(str[0], str[1] - 1, str[2].slice(0, 2));
                date.setUTCHours(0, 0, 0, 0);
                return date;
            } catch (e) {
                return new Date();
            }
        },
        getLogoutUrl: function () {
            var userdata = top.$App.getConfig('UserData');
            var registDate = top.$App.getConfig("UserData").registDate;

            var daysCount = top.$Date.getDaysPass(this.getNewDate(registDate), new Date());
            var mailsCount = top.$User.getMessageInfo().messageCount;
            var addrsCount = top.Contacts.getContactsCount();
            var mailType = top.$User.getServiceItem();
            var uid = $T.Mobile.remove86(top.uid);
            var domain = top.$App.getMailDomain();
            var accountList = top.$User.getAccountList();
            var sid = top.$App.getSid();
            var len = accountList.length;
            var accountArray = [];
            for (var i = 0; i < len; i++) {
                if (accountList[i].type != "mobile") {
                    accountArray.push(accountList[i].name);
                }
            }
            var aliasAddr = accountArray.join(",");
            var url = $T.Url.makeUrl("/m2012/html/set/feature_meal_cancellation.html", {
                daysCount: daysCount,
                mailsCount: mailsCount,
                addrsCount: addrsCount || 0,
                mailAddr: uid + "@" + domain,
                aliasAddr: aliasAddr,
                mailType: mailType,
                uid: uid,
                sid: sid
            });
            return url;
        },
        getUserLevelObj: function () {
            var userLevel = top.$User.getUserLevel();
            var accountList = top.$User.getAccountList();
            var len = accountList.length;
            var accountArr = [];
            for (var i = 0; i < len; i++) {
                if (accountList[i].type == "common") {
                    accountArr.push(i)
                }
            }
            var commonLen = accountArr.length;
            var obj = {
                userLevel: userLevel,
                commonLen: commonLen
            }
            return obj;
        },
        // 公共类型绑定事件
        _bindEventForPublic: function () {
            var self = this;
            $("#mailType").text(top.$User.getPackage());
            if (!top.SiteConfig.newLogoff) {
                $("#logoutLi").hide();
            }
            $("#logoutMailbox").attr("href", self.getLogoutUrl());
            var useObj = self.getUserLevelObj();
            if (useObj.commonLen > 0) {
                $("#applyAlias").hide();
            }
            $("#applyAlias a.btnNormal").bind('click', function (event) {
                var useObj = self.getUserLevelObj();
                var userLevel = useObj.userLevel;
                var commonLen = useObj.commonLen;
                if ((userLevel == "0017" && commonLen > 3)) {
                    $("#applyAlias").hide();
                }
                userLevel = userLevel == "0010" ? "0015" : userLevel;
                if (top.SiteConfig.moreAlias) {
                    var obj = [
                { userLevel: "0015", text: "5-15" },
                { userLevel: "0016", text: "4-15" },
                { userLevel: "0017", text: "3-15" }
            ]
                } else {
                    var obj = [
                { userLevel: "0015", text: "5-15" },
                { userLevel: "0016", text: "5-15" },
                { userLevel: "0017", text: "5-15" }
            ]
                }
                var This = $(this);
                if ((userLevel == "0015" && commonLen > 0) || (userLevel == "0016" && commonLen > 1)) {
                    if ($(".delmailTips").length < 1) {
                    //    self.showUpdateUser(This);
                    }
                    return
                }
                var jInputAlias = $("#inputAlias");
                if (jInputAlias.is(':visible')) {
                    return;
                }
                for (var i = 0; i < obj.length; i++) {
                    if (userLevel == obj[i].userLevel) {
                        $("#stringNum").text(obj[i].text);
                    }
                }
                jInputAlias.show();

                BH({ key: "set_account_accountadmin_replyalias" });
            });
            $("#inputAlias > a.i_u_close").bind('click', function (event) {
                $("#inputAlias").hide().find(".red").html("");
                $("#aliasAccount").val("例:bieming");
            });
            // 绑定确定按钮单击事件
            $("#confirmApplyAlias").bind('click', function (event) {
                self.applyAlias();
            });
            // 绑定键盘松开事件
            $("#aliasAccount").keyup(function (event) {
                var status = "keyup";
                self.applyAlias(status);
            });
            // 绑定取消按钮单击事件
            $("#cancelApplyAlias").bind('click', function (event) {
                $("#inputAlias").hide().find(".red").html("");
                $("#aliasAccount").val("例:bieming");
            });
            // 绑定邮箱账号输入框焦点事件
            $("#aliasAccount").blur(function () {
                var status = "blur";
                var text = $(this).val();
                if (!text) {
                    text = self.model.defaultAliasValue;
                }
                self.applyAlias(status);
                $(this).val(text);
            }).focus(function () {
                var text = $(this).val();
                if (text == self.model.defaultAliasValue) {
                    $(this).val('');
                }
            });
        },
        // 为无手机账号UI类型绑定事件
        _bindEventForNoMobile: function () {
            var self = this;
            $("#bindMobile a").bind('click', function (event) {
                var jInputMobile = $("#inputMobile");
                if (jInputMobile.parent('td').is(':visible')) {
                    return;
                }
                jInputMobile.parent('td').show();
                jInputMobile.show();

                BH({ key: "set_account_accountadmin_bindmobile" });
            });
            $("#inputMobile > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#waitBind > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#sucBind > a.i_u_close").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            $("#sucBind a.btnNormal ").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
            // 绑定手机号码输入框焦点事件
            $("#mobile").blur(function () {
                var text = $(this).val();
                if (!text) {
                    text = self.model.defaultMobileValue;
                }
                $(this).val(text);
            }).focus(function () {
                var text = $(this).val();
                if (text == self.model.defaultMobileValue) {
                    $(this).val('');
                }
            });
            // 获取验证码
            $("#obtainCheckCode").bind('click', function (event) {
                self.obtainCheckCode();
            });
            // 绑定确定按钮单击事件
            $("#confirmBindMobile").bind('click', function (event) {
                self.bindMobile();
            });
            // 绑定取消按钮单击事件
            $("#cancelBindMobile").bind('click', function (event) {
                $("#inputMobile").parent('td').hide();
            });
        },
        // 为无邮箱账号UI类型绑定事件
        _bindEventForNoAlias: function () {
            var self = this;
            // 邮箱账号申请成功单击确定
            $("#confirmApplyAliasSuc").bind('click', function () {
                //$("#applyAliasSuc").hide();
            });
        },
        // todo 调接口获取验证码
        obtainCheckCode : function(){
            var self = this;
            var jPassword = $("#accountPassword");
            var jMobile = $("#mobile");
            var span = $("#obtainCheckCode > span");
            var mobileNum = $.trim(jMobile.val());
            function validate(){
                if(!jPassword.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_PASSWORD']);
                    //jPassword.focus();
                    return false;
                }
                if(!mobileNum || mobileNum == self.model.defaultMobileValue){
                    parent.$Msg.alert(self.model.tipMessage['LACK_MOBILE']);
                    jMobile.focus();
                    return false;
                }
                if (!(/[^\d]/.test(jMobile.val())) && jMobile.val().length != 11) {
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_LENGTHRROR']);
                    jMobile.select();
                    return false;
                }
                if(!$Mobile.isMobile(mobileNum)){
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_FORMATERROR']);
                    jMobile.select();
                    return false;
                }
                return true;
            }
            if(!validate()){
                return;
            }
            // 服务端校验手机号码是否可用,可用服务端将下发验证码
            self.model.verifyNumber(self.getVerifyNumberData(), function(result){
                if (result && result.code == self.model.responseCode['S_OK']) {
                    // 保存事物ID
                    self.model.changeNumberData['transId'] = result['var']['transId'];
                    self.showCountDown(span);
                    var num = self.getMobileWithStar(mobileNum);
                    parent.$Msg.alert($T.Utils.format(self.model.tipMessage['SEND_PASSWORDSUC'], [num]));
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_REGISTTED']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_REGISTTED']);
                }else if(result.code == self.model.responseCode['FA_OLDPHONE_CHANGING']){
                    parent.$Msg.alert(self.model.responseMsg['FA_OLDPHONE_CHANGING']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_TOLIMITED']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_TOLIMITED']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_CHANGING']){ 
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_CHANGING']);
                }else if(result.code == self.model.responseCode['FA_NEWPHONE_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_NEWPHONE_EMPTY']);
                }else if(result.code == self.model.responseCode['S_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                }else if(result.code == self.model.responseCode['FA_PWD_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_EMPTY']);
                }else if(result.code == self.model.responseCode['FA_PWD_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_ERROR']);
                }else if(result.code == self.model.responseCode['FA_IS_NOT_PHONE']){
                    parent.$Msg.alert(self.model.responseMsg['FA_IS_NOT_PHONE']);
                }else if(result.code == self.model.responseCode['FA_SEND_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SEND_ERROR']);
                }else if(result.code == self.model.responseCode['FA_Frequency_Limited']){
                    parent.$Msg.alert(self.model.responseMsg['FA_Frequency_Limited']);
                }else{
                    parent.$Msg.alert(self.model.tipMessage['SEND_PASSWORDFAI']);
                }
            });
        },
        // 绑定手机号码
        bindMobile : function(){
            var self = this;
            var jPassword = $("#accountPassword");
            var jMobile = $("#mobile");
            var jCheckCode = $("#checkCode");
            function validate(){
                if(!jPassword.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_PASSWORD']);
                    //jPassword.focus();
                    return false;
                }
                if(!$.trim(jMobile.val()) || $.trim(jMobile.val()) == self.model.defaultMobileValue){
                    parent.$Msg.alert(self.model.tipMessage['LACK_MOBILE']);
                    jMobile.select();
                    return false;
                }
                if (!(/[^\d]/.test(jMobile.val())) && jMobile.val().length != 11) {
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_LENGTHRROR']);
                    jMobile.select();
                    return false;
                }
                if(!$Mobile.isMobile($.trim(jMobile.val()))){
                    parent.$Msg.alert(self.model.tipMessage['MOBILE_FORMATERROR']);
                    jMobile.select();
                    return false;
                }
                if(!jCheckCode.val()){
                    parent.$Msg.alert(self.model.tipMessage['LACK_CHECKCODE']);
                    return false;
                }
                if(/\s/.test($.trim(jCheckCode.val()))){
                    parent.$Msg.alert(self.model.tipMessage['CHECKCODE_FORMATERROR']);
                    return false;
                }
                return true;
            }
            if(!validate()){
                return;
            }
            var data = self.model.changeNumberData;
            if(!data['transId']){
                parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                return;
            }

            data['smsValidateCode'] = $.trim(jCheckCode.val());
            self.disabledButton('confirmBindMobile', 3000);
            self.model.bindMobile(data, function(result){
                if(result && result.code == self.model.responseCode['S_OK']){
                    BH({key : "set_account_accountadmin_bindmobile_success"});

                    $("#inputMobile").hide();
                    $("#waitBindTip").html(self.getMobileWithStar($.trim(jMobile.val())));
                    $("#waitBind").show();
                    
                    $("#bindMobile").hide();
                    $("#bindMobile").prev('tr').find('td').removeClass('bNone');

                    // 刷新数据
                    parent.$App.trigger("userAttrChange", {
                        callback: function () {
                            accountSetting.account.render();
                        }
                    });
                }else if(result.code == self.model.responseCode['S_ERROR']){
                    parent.$Msg.alert(self.model.responseMsg['S_ERROR']);
                }else if(result.code == self.model.responseCode['FA_SMS_EMPTY']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_EMPTY']);
                }else if(result.code == self.model.responseCode['FA_PWD_EXPIRE']){
                    parent.$Msg.alert(self.model.responseMsg['FA_PWD_EXPIRE']);
                }else if(result.code == self.model.responseCode['FA_SMS_UNPASS']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_UNPASS']);
                }else if(result.code == self.model.responseCode['FA_SMS_OVERFLOW']){
                    parent.$Msg.alert(self.model.responseMsg['FA_SMS_OVERFLOW']);
                }else{
                    $("#waitBind").hide();
                    $("#waitBind").parent('td').hide();
                    parent.$Msg.alert(self.model.tipMessage['BIND_MOBILEFAI']);
                }
            });
        },
        checkAlias: function (alias) {
            var model = this.accountModel;
            var errorAlias = $("#inputAlias .red");
            //服务端检查
            model.serverCheckAlias(alias, function (result) {
                var code = result.code;
                console.log(code)
                if (code == "S_OK") {
                    //别名可用。
                    model.set("alias", alias);
                    errorAlias.html("");
                } else if (code == "S_FALSE") {
                    top.M139.UI.TipMessage.show("登录超时，请重新登录", { delay: 3000 });
                }
                else {
                    var msg = result.msg || result["var"].msg;
                    errorAlias.html(msg);
                }
            });
        },
        addAlias: function (alias, callback) {
            var self = this;
            // 调接口申请邮箱账号(设置别名)
            accountSetting.account.update(function (result) {
                var SUCCESS = "S_OK";
                if (!result || result.code != SUCCESS) {
                    parent.$Msg.alert(self.model.tipMessage.ACCOUNT_TEXT+'设置失败！');
                    return;
                } else {
                    BH({ key: "set_account_accountadmin_replyalias_success" });

                    $("#inputAlias").hide();
                    var aliasAccount = alias + '@' + top.$App.getMailDomain();
                    //年终”邮”福利,百万豪礼过大年活动 显示 add By QZJ
                    self.showYearLottory();
                    top.M139.UI.TipMessage.show("别名 " + aliasAccount + " 添加成功", { delay: 2000 });
                    // 账号列表新增邮箱账号
                    var account = { name: aliasAccount, type: 'common', text: self.model.tipMessage['ACCOUNT_TEXT'] };
                    $("#applyAlias").siblings("table:visible").find("tr:first").after(self.getAccountHtml(account));
                    // 重新渲染顶部别名区域
                    var html = accountSetting.account.template.alias.replace("{0}", aliasAccount);
                    accountSetting.account.divAlias.html(html);

                    // 刷新数据
                    parent.$App.trigger("userAttrChange", {
                        callback: function () {
                            accountSetting.account.render();
                        }
                    });
                    if (callback) { callback() }
                }
            }, alias);
        },

        showYearLottory: function () {
            var postionId = 'web_064',
                validTime = new Date(2013, 11, 30),
                now = top.M139.Date.getServerTime() || new Date(),
                isCM = top.$User.isChinaMobileUser();  //是否移动用户
            if (top.SiteConfig.yearLottery && validTime > now && isCM) {
                top.M139.RichMail.API.call("unified:getUnifiedPositionContent", { positionCodes: postionId }, function (response) {
                    if (response.responseData && response.responseData.code && response.responseData.code == "S_OK") {
                        var htmlContent = response.responseData["var"];
                        var showHtml = '';
                        //链接地址参数
                        hrefLink = [
                            '&sid=' + top.sid,
                            '&rnd=' + Math.random().toFixed(8),
                            '&originID=' + '0',
                            '&tid=' + Math.random().toFixed(8),
                            '&versionID=0',
                            'v=2'
                        ].join('');


                        //获取展示的html
                        if (htmlContent[postionId] && htmlContent[postionId][0].content && htmlContent[postionId][0].content.length > 50) {
                            showHtml = htmlContent[postionId][0].content;
                        } else {
                            //如果统一位置未返回内容
                            var html = ['<div class="boxIframe_box">',
                                '<div>',
                                '<div class="boxIframe_box_fl">',
                                '<strong class="boxIframe_box_h">别名设置成功</strong><br>',
                                '<span class="boxIframe_box_sp">恭喜您获得一次抽奖机会！  </span>',
                                '</div>',
                                '<div class="boxIframe_box_div"><a class="boxIframe_box_btn" target="_blank" id="LotteryLink" href="' + hrefLink + '">点击抽奖</a></div>',
                                '<div class="boxIframe_box_clear"></div>',
                                '</div>',
                                '<p class="boxIframe_box_info">（抽奖机会不累计，离开此页面视为自动放弃本次抽奖）</p>',
                                '<div class="boxIframe_box_height"></div>',
                                '<p class="boxIframe_box_p">2013岁末100万感恩回馈，凡于活动期间登录139邮箱，每使用发邮件、发贺卡、别名设置功能，即可获得一次抽奖机会，使用越多，抽奖机会越多，中奖率超高！</p>',
                                '</div>'].join("");
                        }

                        var popL = top.$Msg.showHTML(showHtml, {
                            dialogTitle: "系统提示",
                            height: 170,
                            width: 390
                        });
                        
                        top.$('#LotteryLink').attr('href', "javascript:top.$App.show('lottery', '" + hrefLink + "')").click(function () {
                            popL.close()
                        })
                    }
                });
            }

        },
        // 申请邮箱账号
        applyAlias: function (status, callback) {
            var self = this;
            var aliasAccount = $("#aliasAccount");
            var errorAlias = $("#inputAlias .red");
            var alias = aliasAccount.val();
            if (alias == "" || alias == self.model.defaultAliasValue) {
                errorAlias.html("请输入" + self.model.tipMessage.ACCOUNT_TEXT + "!")
                return;
            }
            var clientResult = accountSetting.account.model.clientCheckAlias(alias);
            if (clientResult.code != 'S_OK') {
                if (!status) {
                    aliasAccount.select();
                    aliasAccount.focus();
                }
                errorAlias.html(clientResult.msg)
                return;
            }
            else {
                errorAlias.html("")
            }
            if (status) {//blur和keyup事件验证别名   不进行到设置别名这一步
                return
            }
            this.addAlias(alias, callback)
        },
        // 拼装账号列表html段
        getAccountsHtml: function () {
            var self = this;
            var accountList = self.model.accountList;
            var html = [];

            for (var i = 0, aLen = accountList.length; i < aLen; i++) {
                var account = accountList[i];
                html.push(self.getAccountHtml(account));
            }

            return html.join('');
        },
        /**
        * 单独拼装某一个账号的html段 
        * @param account {name : 'zhumy@rd139.com',type : 'common',text : '邮箱账号'}
        * return String 
        */
        getAccountHtml: function (account) {
            if (!account) {
                return '';
            }

            return ['<tr><td class="td1">',
            account.name,
            '</td><td class="td2">',
            account.text,
            '</td></tr>'].join('');
        },
        changeMobile : function(){
            $("#changeMobile").click();
        },
        // 获取验证手机号码请求数据
        getVerifyNumberData : function(){
            var self = this;
            var data = self.model.verifyNumberData;
            data['newNumber'] = $.trim($("#mobile").val());
            data['password'] = $("#accountPassword").val();
            return data;
        },
        // 将部分数字替换为*号
        getMobileWithStar : function(mobile){
            if(!mobile){
                return '';
            }
            return mobile.substr(0, 3)+'****'+mobile.substring(7, 11);
        },
        // 将某按钮失效一段时间再恢复
        disabledButton : function(id, time){
            $("#"+id).attr("disabled", true);
            setTimeout(function () {
                $("#"+id).attr("disabled", null);
            }, time);
        },
        showCountDown: function (dom, time) {
            var self = this;
            if (!dom) return;
            if (!time) {
                time = self.model.SENDMSG_INTERVAL || 60;
                $("#obtainCheckCode").off("click");
                dom.addClass("gray");
            }
            if (self.timer) clearTimeout(self.timer);
            var messages = self.model.tipMessage;
            if (time > 0) {
                dom.html(time + messages.MSG_WAIT_TEXT);
                var next = time - 1;
                next = next || -1;
                self.timer = setTimeout(function () {
                    self.showCountDown(dom, next);
                }, 1000);
            } else {
                dom.removeClass("gray").html(messages.MSG_RESEND_TEXT);
                // 重新绑定单击事件
                $("#obtainCheckCode").bind('click', function(event){
                    self.obtainCheckCode();
                });
            }
        }
    })
);

    $(function () {
        accountAdminView = new M2012.Settings.View.AccountAdmin();
        var anchor = $T.Url.queryString("anchor");
        if (anchor == 'accountAdmin') {
            if ($("#noAliasAccount").is(":visible")) {
                $("#applyAlias").click();
            } else if ($("#noMobileAccount").is(":visible")) {
                $("#bindMobile a.btnNormal").click();
            }
        }
    });
})(jQuery, _, M139);
﻿/**
 * @fileOverview 设置》账户页主方法
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    M139.namespace('M2012.Settings.Model.Account.Main', Backbone.Model.extend({
        defaults: {
            ImageUrl: "",   //头像地址，更新完头像后要更新这个
            userName: "",
            email: "",
            mobile: "",
            birthday: "",

            /* 以下为隐私设置 */
            //  0，询问；1，总是同意；2，总是忽略
            privacy: 0,     //帐号隐私
            AddrFirstName: 0,
            FamilyEmail: 0,
            MobilePhone: 0,
            BirDay: 0
        },
        status: {
            updateSuccess: "0",
            usernameError: "24577",
            emailError: "81",
            phoneError: "80",

            SUCCESS: "S_OK",
            PARTIAL: "S_PARTIAL",
            FAILURE: "FS_FAILURE"
        },
        resultMsg: {
            /* 通讯录接口返回的错误信息 */
            userName: "fail to modify the real name for cmail user",
            email: "the field value is not email format",
            phone: "the field value is not mobile format",

            userNameTip: "发件人姓名有误",
            emailTip: "邮件地址有误",
            phoneTip: "手机号码有误",
            ERR_EMAIL: "邮箱格式不正确，应如：zhangsan@139.com",
            ERR_MOBILE: "手机号码有误",
            unknownError:"未知错误"
        },
        /** 账户设置页
         *@constructs M2012.Settings.Model.Account.Main
        */
        initialize: function () {
            var _this = this;
        },
        htmlDecode: function (text) {
            return parent.$T.Xml.decode(text);
        },
        htmlEncode: function (text) {
            return parent.$T.Xml.encode(text);
        },
        /**
        *更新用户头像信息,初始化完成后执行回调
        */
        initData: function (callback) {
            var This = this;
            var htmlDecode = This.htmlDecode;
            var status = This.status;

            /* 默认报文 */
            var respData = {
                "code": status.FAILURE,
                "var": {}
            };
            /* 先获取账户信息 */
            top.M2012.Contacts.getModel().getUserInfo(null, function (result) { //null参数是无用的。但接口如此
                var code = result.code;
                var data = result["var"];
                if (code == status.SUCCESS) {
                    This.set({
                        ImageUrl: data.ImageUrl,
                        userName: htmlDecode(data.AddrFirstName || ""),   //用户名
                        email: htmlDecode(data.FamilyEmail || ""),        //用户邮箱
                        mobile: htmlDecode(data.MobilePhone || ""),       //手机
                        birthday: data.BirDay           //生日
                    });

                    This.set({ originalUserInfo: data });

                    /* 获取用户隐私设置 */
                    top.M2012.Contacts.getModel().getPrivateSettings(function (result) {
                        
                        if (result.code == status.SUCCESS) {
                            var data = result["var"];
                            var userSettings = data.UserInfoSetting;

                            var whoAddMe = Number(data.addMeRule);

                            if (whoAddMe < 0) {
                                whoAddMe = 1; //小于零是后台未读取到值，要显示缺省值 1 总是同意
                            }

                            This.set({
                                "privacy": whoAddMe,                            //账户隐私
                                "AddrFirstName": userSettings.AddrFirstName,    //姓名隐私设置
                                "FamilyEmail": userSettings.FamilyEmail,        //邮件隐私设置
                                "MobilePhone": userSettings.MobilePhone,        //手机
                                "BirDay": userSettings.BirDay,                  //生日
                                "UserInfoSetting": userSettings                 //此处仅保存用户设置，在更新时从这里取内容
                            });

                            respData.code = status.SUCCESS;
                            if (callback && typeof (callback) == "function") {
                                callback(respData);
                            }
                        }
                        else {
                            if (callback && typeof (callback) == "function") {
                                respData.code = status.PARTIAL; //部分成功
                                callback(respData);
                            }
                        }
                    });
                } else {
                    //获取失败，不处理,或者后期的日志上报
                    callback(respData);
                }
            });
        },
        /**
        *更新用户隐私设置
        */
        updatePrivacy: function (callback) {
            /* 更新隐私设置 */
            var This = this;
            var rule = parseInt(This.get("privacy")) || 0;
            var userSettings = This.get("UserInfoSetting");
            var privacyData = {
        //        "WhoAddMeSetting": rule, 帐户安全中帐号隐私需要隐藏
                "UserInfoSetting": userSettings
            };

            top.M2012.Contacts.getModel().updatePrivateSettings(privacyData, function (result) {
                callback(result);
            });
        },
        /**
        *更新用户账户信息
        */
        updateUserInfo: function (postData, callback) {
            var This = this;

            //检查邮箱和手机是否符合规范
            var checkResult = { code: "FA_ERROR", msg: null };
            var ErrMsgs = This.resultMsg,
                email = This.get("email"),
                mobile = This.get("mobile");
            if (email && !top.$Email.isEmail(email)) {
                checkResult.code = "ER_EMAIL_INVALID";
                checkResult.msg = ErrMsgs.ERR_EMAIL;
                callback(checkResult);
                return;
            }
            if (mobile && !top.$Mobile.isMobile(mobile)) {
                checkResult.code = "ER_MOBILE_INVALID";
                checkResult.msg = ErrMsgs.ERR_MOBILE;
                callback(checkResult);
                return;
            }
            //检查邮箱和手机是否符合规范 end

            var status = This.status;
            var htmlEncode = This.htmlEncode;
            var data = {
                "code": status.FAILURE,
                "var": {}
            };
            /* 更新账户信息 */
            if (!postData) {
                //未提供默认的提交数据，则提交所有数据
                var birthday = This.get("birthday");
                postData = {
                //    "ImageUrl": This.get("ImageUrl"),上传的时候已经设置好图片
                    "AddrFirstName": This.get("userName"),
                    "FamilyEmail": htmlEncode(This.get("email")),
                    "MobilePhone": htmlEncode(This.get("mobile"))
                };
                if (birthday) {
                    postData["BirDay"] = birthday;
                }
            }

            top.ModUserInfoResp = undefined; //先清空返回值,获取返回值后的eval会重新赋值
            top.M2012.Contacts.getModel().modifyUserInfo(postData, function (result) {
                var respData = top.ModUserInfoResp;
                var resultMsg=This.resultMsg;
                if (respData && respData.ResultCode) {
                    if (respData.ResultCode == status.updateSuccess) {
                        data.code = status.SUCCESS;

                    } else if (respData.ResultCode == status.usernameError || respData.resultMsg == resultMsg.userName) {
                        data.msg = resultMsg.userNameTip;
                    }
                    else if (respData.ResultCode == status.emailError || respData.resultMsg == resultMsg.email) {
                        data.msg = resultMsg.emailTip;
                    }
                    else if (respData.ResultCode == status.phoneError || respData.resultMsg == resultMsg.phone) {
                        data.msg = resultMsg.phoneTip;
                    }
                    else {
                        data.msg = resultMsg.unknownError;
                    }
                } else {
                    data.msg = resultMsg.unknownError;
                }
                callback(data);
            });
        },
        update: function (callback) {
            var This = this;
            var status = This.status;
            This.updateUserInfo(null, function (result) {
                if (result.code == status.SUCCESS) {
                    This.updatePrivacy(function (result) {
                        callback(result);
                    });
                }
                else {
                    callback(result);
                }
            });
        }
    })
    );
})(jQuery, _, M139);
﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Account.Main', superClass.extend({
        messages: {
            LOADING: "正在加载中...",
            LOAD_DATA_ERROR: "获取用户信息失败！",
            SAVE_IMAGE_SUCCESS: "您的头像已保存",
            SAVE_IMAGE_FAILURE: "头像上传失败，请重试",

            DEFAULT_ERROR_TIP: "系统繁忙，请稍后重试",
            SETTING_SAVED: "您的设置已保存",
            SETTING_SAVE_FAILURE: "设置保存失败"
        },
        initialize: function () {
            this.model = new M2012.Settings.Model.Account.Main();
            this.account = new M2012.Settings.View.Account();
			//上传图像类
			/*new m2012.imageUpload({
				preInsertDom : document.getElementById("info_image"),
				ImageId : document.getElementById("userImage")
			});*/

			// 头像上传的回调函数（后台返回脚本自动调用）
			var callbackName = "myPicture";
			window[callbackName] = function (data) {
				var url;
				if (data && data.code == "S_OK") {
					top.M2012.Contacts.getModel().UserInfoData = null;
					top.M2012.Contacts.getModel().getUserInfo();
					if (location.host.indexOf("10086ts") > -1) {
						url = "http://g2.mail.10086ts.cn";
					} else {
						url = top.getDomain("resource");
					}
					url += data.msg + '?rd='+ Math.random();
					$("#userImage, #mailSignView img").attr("src", url);
					top.$("#faceImg").attr("src", url);
				}
				top.M139.UI.TipMessage.show(data.code == "S_OK" ? "您的头像已保存" : data.msg, {delay : 2000});
			}

			var wrapper = $("#info_image").css("position", "relative").find(".FloatingDiv");

			var imageUploader = new M2012.Compose.View.UploadForm({
				wrapper: wrapper,
				frameId: "ifmReturnInfo",
				accepts: ["bmp", "png", "jpg", "jpeg", "gif"],
				uploadUrl: (function(){
					var url = "/bmail/s?func=contact:uploadImage&sid=" + top.sid + "&serialId=0&type=1&callback=" + callbackName;
					if (document.domain == "10086.cn") {
						url = top.getDomain("rebuildDomain") + url;
					}
					return url;
				})(),
				onSelect: function(value, ext){
					if (_.indexOf(this.accepts, ext) == -1) {
						top.$Msg.alert("图像格式不符合规范!", {icon:"warn"});
						return false;
					}
					return true;
				}
			}).render();

			imageUploader.$("input").click(function(){
				if(top.M139.Date.getDaysPass(M139.Date.getServerTime(), new Date(2014,5,10))>=0){
					top.$Msg.alert("系统维护，暂不支持上传头像");
					return false;
				}
			}).css({"margin":0, height:"50px"});

            this.init = false;

            /* 控件 */
            this.alias = $("#txtAlias");
            this.password = $("#changePassword");
            this.privacyAccountAll = $("#addMe :radio");
            this.privacy = $("#addMe :radio :checked"); //选中

            this.allInput = $("#info_account input");
            this.image = $("#userImage");
            this.userName = $("#info_userName");
            this.email = $("#info_email");
            this.mobile = $("#info_mobile");
            this.birthday = $("#info_birthday");
            this.moreInfo = $("#info_more");
            this.upload = null;
            this.datePicker = null;

            this.privacyName = $("#privacy_userName");
            this.privacyEmail = $("#privacy_email");
            this.privacyMobile = $("#privacy_mobile");
            this.privacyBirthday = $("#privacy_birthday");
            this.privacySetAll = $("#privacy_userName,#privacy_email,#privacy_mobile,#privacy_birthday");

            this.changeMobile = $("#changeMobile"); //更换绑定
            this.bindPhoneArea = $("#bindPhoneArea");
            this.submit = $("#btnSubmit");
            this.cancel = $("#btnCancel");

            this.passwordQuestionArea = $("#passwordQuestionArea");
            this.passwordEmailArea = $("#passwordEmailArea");
            this.passwordQuestionState = $("#passwordQuestionState");
            this.passwordEmailState = $("#passwordEmailState");
            this.passwordQuestion = $("#passwordQuestion");
            this.passwordEmail = $("#passwordEmail");

            this.pwdQueType = 'set_password_question';
            this.pwdEmailType = 'set_password_email';

            this.initEvents(); //初始化事件绑定
            this.render();
        },
        render: function () {
            var This = this;
            var model = This.model;
            var $User = top.$User;
            var userConfig = $User.getUserConfig();
            var isNotChinaMobileUser = $User.isNotChinaMobileUser();
            if(userConfig && isNotChinaMobileUser){
            //if(userConfig){ //测试用
                this.passwordQuestionArea.removeClass('hide');
                this.passwordEmailArea.removeClass('hide');
                var externalquestion = userConfig.externalquestion;
                var externalanswer = userConfig.externalanswer;
                var externalemail = userConfig.externalemail;
                if(externalquestion && externalquestion[1] != '' && externalquestion[1] != 0
                && externalanswer && externalanswer[1] != ''){
                    this.passwordQuestionState.html('已设置');
                    this.passwordQuestion.html('<span>重  置</span>');
                    this.pwdQueType = "reset_password_question";
                }
                if(externalemail && externalemail[1] != '' && externalemail[1] != 0){
                    this.passwordEmailState.html('已设置');
                    this.passwordEmail.html('<span>重  置</span>');
                    this.pwdEmailType = 'reset_password_email';
                }
            }

            //如果是互联网用户，则显示绑定
            This.bindPhoneArea.show();

            if (top.$User.getProvCode() == "83") {
                This.changeMobile.find("span").text("立即绑定手机 >>");
            } else {
                This.changeMobile.find("span").text("更换绑定手机 >>");
            }

            //parent.M139.UI.TipMessage.show(This.messages.LOADING);
            model.initData(function (result) {
                var code = result.code;
                if (code == "S_OK" || code == "S_PARTIAL") {
                    model.trigger("fetch:privacy");

                    /* 设置生日下拉框 */
                    var birthday = model.get("birthday");
                    This.datePicker.setDate(birthday);

                    //有通讯录数据来显示电子签名
                    var userInfo = This.model.get('originalUserInfo');
                    signatureView = new M2012.Settings.Sign.View({ userInfo: userInfo });
                    signatureView.render();

                    accountView = new M2012.Settings.Account.View({ userInfo: userInfo });
                    accountView.render("custom", "setUserTemplate", "setUserTdTemplate", "userTable", "userTr");
                    accountView.render("pop", "setPopTemplate", "setPopTdTemplate", "popTable", "popTr");

                    var imgUrl = userInfo.ImageUrl;
	                var baseUrl;
                   
                    if(imgUrl.indexOf("//") == -1) {
	                    if (location.host.indexOf("10086ts") > -1) {
							baseUrl = "http://g2.mail.10086ts.cn";
						} else {
							baseUrl = top.getDomain("resource");
						}
						imgUrl = baseUrl + imgUrl + '?rd='+ Math.random();
                    }
					$("#userImage").attr("src", imgUrl);
                } else {
                    parent.M139.UI.TipMessage.show(This.messages.LOAD_DATA_ERROR, { delay: 3000 });
                }
                This.init = true;
            });
			//初始化手机登陆设置
			(function(){
				var configID = top.$App.getConfig('UserData').mainUserConfig["checkloginway"] && top.$App.getConfig('UserData').mainUserConfig["checkloginway"][0];
				var buttonMobileLogin = $("input[type='radio'][name='configId']");
				buttonMobileLogin.click(function(){
					buttonMobileLogin.removeAttr("checked");
					$(this).attr("checked","checked");
				});
				if(!configID || configID == -1){
					buttonMobileLogin.eq(0).attr("checked","checked");
				}
				$.each(buttonMobileLogin,function(){
					var value = $(this).val();
					if(configID == value){
						$(this).attr("checked","checked");
						return;
					}
				});
			})();
        },
        initEvents: function () {
            var This = this;
            var model = This.model;

            /* 修改密码按钮点击 */
            This.password.on("click", function () {
                top.BH('set_modify_password'); //点击修改密码，上报

                var TO_UPDATE = 12;
                var TO_MOD_PWD = 12;
                var reqData = { optype: 12, rnd: Math.random() };
                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
 

                    if (!isumcuser) {
                        top.LinkConfig["password"] = { url: url, site: "", title: "修改密码" },
                        top.$App.show("password");
                    } else {
                        top.$Msg.open({ url: url, dialogTitle: "修改密码", width: 601, height: 432, hideTitleBar: true })
                    }
                });
            });

            /* 邮箱换号 */
            This.changeMobile.on("click", function () {

                var TO_UPDATE = 1;
                var TO_BIND_PHONE = 6;
                var TO_CHANG_PHONE = 9;

                var reqData = { optype: TO_CHANG_PHONE, rnd: Math.random() };

                if (top.$User.getProvCode() == "83") {
                    reqData.optype = TO_BIND_PHONE;
                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });
            });

            /* 设置或重置密保问题 */
            This.passwordQuestion.on("click", function () {
                top.BH(This.pwdQueType); //点击重置密保问题，上报

                var TO_UPDATE = 1;
                var TO_SET_ANSWER = 13;
                var TO_CHANG_ANSWER = 14;

                var reqData = { optype: TO_SET_ANSWER, rnd: Math.random() };

                var userConfig = top.$User.getUserConfig();
                if (userConfig) {

                    var q = userConfig.externalquestion;
                    if ( q && q[1] != '' && q[1] != 0 ) {
                        reqData.optype = TO_CHANG_ANSWER;
                    }
                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }
                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });
            });

            /* 设置或重置密保邮箱 */
            This.passwordEmail.on("click", function () {
                top.BH(This.pwdEmailType); //点击重置密保邮箱，上报

                var TO_UPDATE = 1;
                var TO_BIND_EMAIL = 4;
                var TO_CHANG_EMAIL = 8;

                var reqData = { optype: TO_BIND_EMAIL, rnd: Math.random() };

                var userConfig = top.$User.getUserConfig();
                if (userConfig) {

                    var e = userConfig.externalemail;
                    if ( e && e[1] != '' && e[1] != 0 ) {
                        reqData.optype = TO_CHANG_EMAIL;
                    }

                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });

            });

            /* 账户隐私设置修改 */
            This.privacyAccountAll.on("click", function (e) {
                var val = $(this).filter(":checked").val();
                model.set("privacy", val);
            });

            /* 姓名，邮箱，手机设置 */
            This.allInput.on("blur", function () { //设置username，email，mobile
                var val = $(this).val();
                var key = $(this).attr("rel");
                This.model.set(key, val);
            });
            model.on("change:userName", function () {
                var userName = model.get("userName");
                This.onModelChange("userName", This.userName);
                This.account.model.set("userName", userName); //更新账户设置中的发件人姓名

                top.$App.getConfig("UserAttrs").trueName = userName;
            });
            This.account.model.on("change:userName", function () {
                var userName = This.account.model.get("userName");
                model.set("userName", userName);
            });
            model.on("change:email", function () {
                This.onModelChange("email", This.email);
            });
            model.on("change:mobile", function () {
                This.onModelChange("mobile", This.mobile);
            });

            /* 隐私设置，下拉列表 */
            This.privacySetAll.on("click", function () {
                This.showMenu($(this));
            });

            /* 账户信息隐私设置 */
            model.on("change:AddrFirstName", function () {
                This.setValue("AddrFirstName", This.privacyName);
            });
            model.on("change:FamilyEmail", function () {
                This.setValue("FamilyEmail", This.privacyEmail);
            });
            model.on("change:MobilePhone", function () {
                This.setValue("MobilePhone", This.privacyMobile);
            });
            model.on("change:BirDay", function () {
                This.setValue("BirDay", This.privacyBirthday);
            });

            model.on("change:serverexception", function (errObj) {
                top.$Msg.alert("获取数据失败");
            });


            model.on("fetch:privacy", function () {
                var value = model.get("privacy");
                This.privacyAccountAll.filter("[value=" + value + "]").attr("checked", "checked");
            });

            //显示默认的“所有人可见”
            This.showDefault(This.privacyName, 0);
            This.showDefault(This.privacyEmail, 0);
            This.showDefault(This.privacyMobile, 0);
            This.showDefault(This.privacyBirthday, 0);

            /* 生日下拉框 */
            This.birthday.html("");
            This.datePicker = new M2012.Settings.View.Birthday({
                container: This.birthday,
                orderby: "desc",
                check: true
            });

            /* 更多信息 */
            This.moreInfo.on("click", function () {
                if (parent.$User.checkAvaibleForMobile()) {
                    parent.$App.jumpTo('baseData');
                }
            });

            /* 保存按钮 */
            This.submit.on("click", function () {
                This.update();
            });
            /* 取消按钮 */
            This.cancel.on("click", function () {
                parent.$App.closeTab("account");
            });

        },
        onModelChange: function (key, dom) {
            var value = this.model.get(key) || "";
            dom.val(value);
        },
        setValue: function (key, dom) {
            var This = this;
            var model = This.model;
            var value = model.get(key);
            This.showDefault(dom, value);
            model.attributes.UserInfoSetting = model.attributes.UserInfoSetting || {};
            model.attributes.UserInfoSetting[key] = value;
        },
        showDefault: function (dom, ruleIndex) {
            ruleIndex = parseInt(ruleIndex, 10);
            if (ruleIndex < 0 || ruleIndex > 2) {
                ruleIndex = 0;
            }

            var selectText = ["仅好友可见", "所有人可见", "仅自己可见"];
            var selectData = {
                "text": ["仅好友可见", "所有人可见", "仅自己可见"],
                "class": ["i_see_best", "i_see_all", "i_see_self"]
            };

            var selected = '<i class="{class} mr_5"></i>{text}<i class="i_triangle_d ml_5"></i>';
            var defaultHtml = $T.Utils.format(selected, {//替换内容
                "text": selectData.text[ruleIndex],
                "class": selectData["class"][ruleIndex]
            });
            dom.html(defaultHtml);
        },
        showMenu: function (dom) {
            var This = this;
            var offset = dom.offset();
            /*
            现网情况：
            0：仅好友
            1：所有人
            2：仅自己
            */
            var privacyMenu = M2012.UI.PopMenu.create({
                //覆盖PopMenu的模版
                itemsTemplate: '<li><a href="javascript:;"></a></li>',
                itemsContentPath: 'a',
                //end
                items: [
                    {
                        html: '<i class="i_see_all mr_5"></i><span class="text">所有人可见</span>',
                        "value": 1
                    },
                    {
                        html: '<i class="i_see_best mr_5"></i><span class="text">仅好友可见</span>',
                        "value": 0
                    },
                    {
                        html: '<i class="i_see_self mr_5"></i><span class="text">仅自己可见</span>',
                        "value": 2
                    }
                ],
                left: offset.left,
                top: offset.top + dom.height(),
                onItemClick: function (item) {
                    var key = dom.attr("rel"); //关联HTML的自定义标签rel
                    var value = item.value;
                    This.model.set(key, value);
                }
            });

            privacyMenu.$el.addClass("seePop");
        },
        update: function () {
            var This = this;
			var value = $("input[name='configId']:checked").val();
            var message = This.messages;
            var birthday = This.datePicker.getDate();
            if (birthday === undefined) {
                return;
            }
            var SUCCESS = "S_OK";

            This.model.set("birthday", birthday);
            This.model.update(function (result) {
                if (!result || result.code != SUCCESS) {
                    var msg = message.SETTING_SAVE_FAILURE
                    if (result.msg && result.msg != "未知错误") {
                        msg += "，" + result.msg;
                    }

                    parent.$Msg.alert(msg, { onclose: function() {
                        if ("ER_EMAIL_INVALID" == result.code) {
                            This.email.focus();
                        } else if ("ER_MOBILE_INVALID" == result.code) {
                            This.mobile.focus();
                        }
                    }});

                    return;
                }
                parent.M139.UI.TipMessage.show(message.SETTING_SAVED, { delay: 3000 });
				//设置手机登陆设置
			
				M139.RichMail.API.call("user:setUserConfigInfo", { configTag: "CheckLoginWay", type: "int", configValue: parseInt(value) ,configType: 1},function(){
						parent.$App.trigger("userAttrChange", {
							trueName: This.model.get("userName"),
							callback: function () {
								This.account.render();
								// This.render();

								// add by tkh 刷新账号管理列表
								accountAdminView.reflush();
								if (typeof (signatureView) != "undefined" && signatureView.render) {
									signatureView.render();
								}

							}
						});
						
				});
            });
        }
    })
    );

    $(function () {
        accountSetting = new M2012.Settings.View.Account.Main();
        //得到url中useinfo的参数
        var userinfo = $T.Url.queryString('info');
        if($("#"+userinfo).length>0){
        	top.$PUtils.setIframeScrollTop($("#"+userinfo),window);
        }
    });
})(jQuery, _, M139);
/* @fileOverview 定义设置第三方授权View层的文件.
*/
/**
*@namespace 
*设置第三方授权View层
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    M139.namespace('M2012.Settings.SsoLogin.View', superClass.extend(
    /**
    *@lends M2012.Settings.SsoLogin.View.prototype
    */
        {
        initialize: function () {
            this.model = new M2012.Settings.Account.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
        },
        ssoLogin: function () {
            if (top.SiteConfig.ssoLogin) {
                this.getSsoLogin();
            }
        },
        getSsoUrl: function (type, obj) {
            var mobile = top.$App.getConfig("UserData").UID;
            mobile = top.$Mobile.remove86(mobile);
            var options = {
                opertype: "1",
                account: mobile,
                sid: top.sid,
                comefrom: "",
                timestamp: +new Date(),
                key: ""
            }
            if (type == "get") {
                options.comefrom = "Authorize";
            } else {
                options.comefrom = obj.clientid;
                options.opertype = "0";
            }
            var md5 = options.timestamp + options.opertype + options.account + options.sid + options.comefrom;
            md5 = hex_md5(md5);
            options.key = md5.toUpperCase();
            var url = top.SiteConfig.ssoInterface + "/GetOrCancelUserOrder";
            url = M139.Text.Url.makeUrl(url, options);
            return url;
        },
        getSsoLogin: function () {
            var self = this;
            var url = this.getSsoUrl("get");
            self.model.loadResource(url, function () {
                if (typeof (getSsoLogin) != "undefined" && getSsoLogin.code == "S_OK") {
                    if (getSsoLogin["var"]) {
                        var data = getSsoLogin["var"];
                        if (data.length > 0) {
                            $("#ssoLogin").removeClass("hide");
                            self.getTemplate(data);
                            self.submitSsoLogin();
                        } 
                    }
                } 
            });
        },
        setSsoLogin: function (obj) {
            var self = this;
            var url = this.getSsoUrl("set", obj);
            var tr = $("#ssoLogin tr").length;
            self.model.loadResource(url, function () {
                if (typeof (setSsoLogin) != "undefined" && setSsoLogin.code == "S_OK") {
                    console.log(setSsoLogin)
                    top.M139.UI.TipMessage.show(self.model.messages.cancelSsoOrder, { delay: 2000 });
                    if (tr < 3) {
                        $("#ssoLogin").remove();
                    } else {
                        $(obj.target).parents("tr").remove();
                    }
                }
            });
        },
        submitSsoLogin: function () {
            var self = this;
            $("#ssoLogin").click(function (e) {
                var target = e.target;
                var type = $(target).attr("clientid");
                var obj = {
                    target: target,
                    clientid: type

                }
                if (type) {
                    self.setSsoLogin(obj);
                }
            });
        },
        render: function () {
            this.ssoLogin();
            return superClass.prototype.render.apply(this, arguments);
        },
        getTemplate: function (data) {
            var len = data.length;
            var arr = [];
            for (var i = 0; i < len; i++) {
                var html = ['<tr>',
                '<td class="td1">' + data[i].clientname + '</td>',
                '<td>',
                '<a clientid="' + data[i].clientid + '" href="javascript:;" title="取消授权">取消授权</a>',
                '</td>',
                '</tr>'].join("");
                arr.push(html);
            }
            var template = arr.join("");
            $("#ssoLogin tr:first").siblings().remove();
            $("#ssoLogin tr:first").after(template);
        }
    })
        );

    ssoLoginView = new M2012.Settings.SsoLogin.View();
    ssoLoginView.render();
})(jQuery, _, M139);


