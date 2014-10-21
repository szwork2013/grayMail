/**
 * @fileOverview 定义通讯录的Http客户端类.
 */

  /*global Contacts: false */

(function (M139) {

    function _getUrl_(page, type) {
        return "/sharpapi/addr/apiserver/" + page + "?sid=" + $App.getSid() + (type ? "&APIType=" + type : "") + "&r=" + Math.random();
    }

    function addrInterfaceUrl (action) {
        return _getUrl_("addrinterface.ashx", action);
    }

    var namespace = "M2012.Contacts.HttpClient";
    M139.namespace(namespace, M139.ExchangeHttpClient.extend(
    /**
    *@lends M2012.Contacts.HttpClient.prototype
    */
    {
        /** 与通讯录通讯的http客户端类，调用接口有两种方式，一种是提供报文，调用request，一种是以注册的形式添加方法
        *@constructs M2012.Contacts.HttpClient
        *@extends M139.ExchangeHttpClient
        *@param {Object} options 初始化配置，参数继承M139.HttpClient的初始化参数
        *@example
        var contactsClient = new M2012.Contacts.HttpClient();
        */
        initialize: function (options) {
            M139.ExchangeHttpClient.prototype.initialize.apply(this, arguments);
            this.router = M139.HttpRouter;

            this.router.addRouter("addr", [
                "GetUserAddrJsonData", "QueryUserInfo", "ModUserInfo", "QueryContactsImageUrl","GetLastContactsDetail","AddUserInfo","WhoAddMe",
                "AddGroupList","DelGroupList","AddCAndGToGroup","EditGroupList","DelContacts","AddGroup","AddBatchContacts","GetDealList","ModDealStatus",
                "AgreeOrRefuseAll","QueryContactsInGroup","GetRepeatContacts","AddContacts","ModContacts","DelLastContacts","ModGroup","MoveGroupList",
                "MergeContacts","QueryMergeResult","DelLCContacts","ModContactsField",
                "GetNumWaitForCleaning", "QueryInfoWaitForCleaning", "OneKeyClean",
                "BatchQuery", "GetUncompletedContacts",
                "GetPrivacySettings", "SavePrivacySettings", 
                "GetRepeatContactsNew","AutoMergeContacts","QueryContactsAndGroup",
				"GetBatchImageUrl", "WhoAddMeByPage"
            ]);
            this.router.addRouter("addr_p3_gw", [
                "andAddr:readGroups", "andAddr:readGroupContacts", "andAddr:readContactDetail"
            ]);
            this.router.addRouter("webdav", [
                "wangyisync", "googlesync"
            ]);
        },

        defaults: {
            name: namespace,
            requestDataType: "ObjectToXML2",
            responseDataType: "JSON2Object"
        },

        /**
        *继承自M139.ExchangeHttpClient.request方法， 增加了一些参数功能
        *@see M139.ExchangeHttpClient#request
        *@param {Object} options 配置参数
        *@returns {M139.HttpClient} 返回对象自身
        *@example
        client.request(
            {
                method:"post",
                timeout:10000,
                data:{
                    fid:1
                },
                api:"mbox:listMessage",
                    headers:{
                    "Content-Type":"text/javascript"
                }
            },
            function(e){
                console.log(e.status);//http返回码，200,404等
                console.log(e.isTimeout);//返回是否超时
                console.log(e.responseText);//http返回码，200,404等
                console.log(e.getHeaders());//返回的http头集合，使用函数因为默认处理http头会消耗性能
            }
        );
        */
        request: function (options, callback) {
            var This = this;
            //请求父类的方法
            M139.ExchangeHttpClient.prototype.request.apply(this, arguments);
            return this;
        },
        /**@inner*/
        onResponse: function (info) {
            var This = this;
            M139.ExchangeHttpClient.prototype.onResponse.apply(this, arguments);
        }
    }));

    //提示语
    var YIBUMSG = {
        addfail: "添加失败",
        addsuccess: "联系人添加成功",
        addcontactfail: "联系人添加失败",
        addfailunknown: "添加失败,未知错误",
        addfailserver: "添加失败,服务器异常",
        editfail: "系统繁忙，请稍候再试",
        processing: "程序运行中,请稍候",
        ajax_othererror: "系统繁忙，请稍后再试",
        groupname_not_exists: "组名不能为空",
        group_alreadyexists: "组名已存在",
        groupadded: "添加组成功",
        groupmodified: "组修改成功",
        groupdeleted: "删除成功",
        contactdeleted: "删除成功",
        contactcopyed: "复制成功",
        contactmoved: "移动成功",
        groupsaved: "保存成功",
        contactreaded: "获取成功",
        contactsaved: "保存成功",
        saveing: "保存中……",
        memooverlimit: "您合并通讯录重复联系人资料，超过备注可显示的资料已发送到您的邮箱。",
        sysbusy: "系统繁忙，请稍候再试。",
        merging: "自动合并操作正在处理中，请不重复提交。",
        fail_commitmerge: "提交自动合并请求失败。",
        warn_contactexists: "通讯录已存在邮箱/手机相同的联系人",
        warn_emailRepeat: "该邮箱已存在，是否仍要保存？",
        warn_mobileRepeat: "该手机号已存在，是否仍要保存？",
        isAlwaysSave: "是否仍要保存？",
        sysUpdateing: "暂时无法处理该请求，请稍后再试",
		contactexisted: {
			"224": "手机号码已存在",
			"225": "商务手机已存在",
			"226": "电子邮箱已存在",
			"227": "商务邮箱已存在"
			},
		groupoverLimit:       "联系人分组已达上限",
		groupcontactsoverlimit: "保存失败，分组联系人总数已达上限5000"
    };

    var ERR_CONTACT_OVERLIMIT = "21";
    var ERR_CONTACT_GROUPEDLIMIT = "23";
    var ERR_CONTACT_REACHLIMIT = "24";
    var ERR_CONTACT_REPEAT = "28";
    var ERR_CONTACT_EDIT_EXIST_LIST = ["224", "225", "226", "227"];//编辑已存在联系人

    var ERROR_MESSAGE = {
        OVER_LIMIT: '保存失败，联系人数量已达上限3000。<a href="javascript:top.FF.close();top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>添加更多！',
        REACH_LIMIT: '保存联系人部分成功，联系人数量超出上限部分未保存，你可以<a href="javascript:top.FF.close();top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>添加更多！',
        REPEAT: '保存联系人失败，联系人已存在。',
        NAME_LENGTH_ERROR: "联系人姓名太长了",
        EMAIL_ERROR: "邮箱格式不正确。<br/>应如zhangsan@139.com，长度6-90位",
        MOBILE_LENGTH_ERROR: "手机号码格式不正确，请输入3-20位数字"
    };
    /**
    *实例化M2012.Contacts.HttpClient，然后封装使用的过程
    *@namespace 
    *@name M2012.Contacts.API
    */
    M139.core.namespace("M2012.Contacts.API",
    /**@lends M2012.Contacts.API*/
    {
        call: function (api, data, callback, options) {
            //var url = "/s?func=" + api + "&sid=" + $T.Url.queryString("sid") + "&rnd="+Math.random();
            options = options || {};
            var client = new M2012.Contacts.HttpClient({});
            var url = api.indexOf("/") > -1 ? api : client.router.getUrl(api);

            if (options.loadingMsg) {
                if (options.loadingMsg) {
                    top.M139.UI.TipMessage.show(options.loadingMsg);
                }
            }

            var scope = this;
            if (options && options.scope) {
                scope = options.scope;
            }

            client.on('error', function() {
                if (options.error) {
                    options.error.apply(client, arguments);
                } else {
                    callback.call(scope, { responseData: null, status: arguments[0].status, responseText: arguments[0].responseText });
                }
            });

            //注意处理异常
            var httpMethod = "post";
            if (options.httpMethod) {
                httpMethod = options.httpMethod;
            }
            client.request({
                url: url,
                method: httpMethod,
                data: data,
                requestDataType: options.requestDataType,
                responseDataType: options.responseDataType
            }, function (e) {
                if (options.loadingMsg) {
                    try{
                        top.M139.UI.TipMessage.hide();
                    } catch (e) { }
                }

                callback.call(scope, e);                
            });
        },



        //验证新增联系人数据 todo move
        validateAddContacts: function (obj) {
            var result = {};
            var error = "";
            if (!obj.name || obj.name.trim() == "") {
                error = "请输入联系人姓名";
            } else if (obj.name.trim().getByteCount() > 100) {
                error = ERROR_MESSAGE.NAME_LENGTH_ERROR;
            } else if (!obj.email && !obj.mobile) {
                error = "电子邮箱和手机号码，请至少填写一项";
            } else if (obj.email) {
                /*
                通用的E-MAIL正则表达式校验，长度6-90位（数据库字段长度为90）；
                */
				
                if (!M139.Text.Email.isEmail(obj.email)) {
                    error = ERROR_MESSAGE.EMAIL_ERROR;
                } else if (obj.email.length < 6 || obj.email.length > 90) {
                    error = ERROR_MESSAGE.EMAIL_ERROR;
                }
            }
            if (!error && obj.mobile) {
                /*
                手机号码：
                长度3-20位数字并支持“-”分隔符的输入。（数据保存到数据库中需要将“-”过滤掉）。
                */
                if (!/^\d([\d-])+\d$/.test(obj.mobile) || obj.mobile.replace(/\D/g, "").length > 20) {
                    error = ERROR_MESSAGE.MOBILE_LENGTH_ERROR;
                }
            }

            if(obj.newGroup){
                if (Contacts.getGroupByName(obj.newGroup)) {
                    delete obj.newGroup;
                }
            }

            result.error = error;
            return result;
        },

        //自动保存联系人
        /*
        xml=<AddLastContacts><AddContactsInfo><SerialId>0</SerialId><AddrName>kkkkkkk</AddrName><AddrType>E</AddrType><AddrContent>kkkkkkk@rd139c.om</AddrContent><AddrMobile></AddrMobile><AddrId>0</AddrId><AddrTitle>title</AddrTitle><ComeFrom>1</ComeFrom></AddContactsInfo>
<AddContactsInfo><SerialId>0</SerialId><AddrName>bbbbbb</AddrName><AddrType>E</AddrType><AddrContent>bbbbbb@rd139.com</AddrContent><AddrMobile></AddrMobile><AddrId>0</AddrId><AddrTitle>title</AddrTitle><ComeFrom>1</ComeFrom></AddContactsInfo></AddLastContacts>
        */
        /**
         *发送成功后添加最近联系人
         *@param {Object} options 参数集合
         *@param {String} options.type email|mobile|fax
         *@param {Array} options.list 添加的列表
         *@example
         M2012.Contacts.API.addSendContacts({
            type:"email",
            list:[
                '"李福拉"&ltlifula@139.com&gt;',
                '"帅哥"&lt;lifl@richinfo.cn&gt;'
            ]
         },function(e){
         
         });

         */
        addSendContacts: function (options, callback) {
            var This = this;
            var items = [];
            var type = options.type;
            var addr = options.list;
            var _subject = options.subject;
            var from = options.from || 0;

            if (type == "mobile") {
                $(addr).each(function (index, value) {
                    var list = [];

                    list = Contacts.getContactsByMobile(this.toString());
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "M", AddrContent: this.toString() });
                    } else {

                        var mobile = M139.Text.Mobile.getNumber(value);
                        mobile = M139.Text.Mobile.remove86(mobile);
                        items.push({
                            SerialId: "0",
                            AddrName: mobile,
                            AddrType: "M",
                            AddrContent: mobile,
                            AddrMobile: mobile,
                            AddrId: "0",
                            AddrTitle: "",
                            ComeFrom: from || "1"
                        });
                    }
                })
            } else if (type == "fax") {
                $(addr).each(function (index, value) {
                    var list = [];//todo Contacts.getContactsByFax(this.toString());
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "F", AddrContent: value });
                    } else {
                        items.push({ SerialId: "0", AddrName: value, AddrType: "F", AddrContent: value });
                    }
                })
            } else {
                $(addr).each(function (index, value) {
                    var list = [];

                    list = Contacts.getContactsByEmail(M139.Text.Email.getEmail(value));
                    if (list.length > 0) {
                        var info = list[0];
                        items.push({
                            SerialId: info.SerialId,
                            AddrType: "E",
                            ComeFrom: from,
                            AddrTitle: _subject,
                            AddrName: M139.Text.Email.getName(value),
                            AddrContent: M139.Text.Email.getEmail(value)
                        });
                    } else {
                        items.push({
                            SerialId: "0",
                            AddrType: "E",
                            ComeFrom: from,
                            AddrTitle: _subject,
                            AddrName: M139.Text.Email.getName(value),
                            AddrContent: M139.Text.Email.getEmail(value)
                        });
                    }
                })
            }
            var requestData = {
                AddLastContacts: {
                    "AddContactsInfo": items
                }
            }
            //todo
            if (options.autoSave) {
                //自动保存联系人
                var requestUrl = _getUrl_("autosavecontact.ashx");
            } else {
                var requestUrl = _getUrl_("addlastcontacts.ashx");
            }
            this.call(requestUrl, requestData, function (e) {
                var result = {};
                var json = e.responseData;
                if (json) {
                    if (json.ResultCode == "0") {
                        result.success = true;
                        //保存了多个是返回数组
                        if (_.isArray(json.ContactsInfo)) {
                            result.list = json.ContactsInfo;
                        } else if (typeof json.ContactsInfo == "object") {
                            result.list = [json.ContactsInfo];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        This.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:items,
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        //todo
                        result.error = YIBUMSG.sysbusy;
                    }
                } else {
                    result.success = false;
                    result.error = "未知异常";
                }
            },
            {
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "XML2Object"
            });
        },

        /**
         *删除联系人
         *@param {Object} options 参数集合
         *@param {String} options.serialId 要删除的联系人id
         */
        deleteContacts: function (options, callback) {
            var This = this;
            var serialId = options.serialId;
            var requestBody = {
                DelContacts: {
                    SerialId: serialId
                }
            };

            var requestUrl = "/addrsvr/DelContacts?formattype=json&sid=" + $App.getSid();

            this.call(requestUrl, requestBody, function (e) {
                var json = e.responseData;
                var result = {};
                if (json) {
                    if (json.ResultCode == "0") {
                        result.success = true;
                        result.msg = YIBUMSG.contactdeleted;
                        This.updateCache({
                            type: "DeleteContacts",
                            data: {
                                serialId: serialId
                            }
                        });
                    } else {
                        result.success = false;
                        result.error = YIBUMSG.sysbusy;
                    }
                } else {
                    result.success = false;
                    result.error = YIBUMSG.sysbusy;
                }
                if (callback) {
                    callback(result);
                }
            }, {
                loadingMsg: "正在删除联系人..."
            });
        },

        /**
         *添加联系人
        */
        addContacts: function (info, callback, options) {
            var This = this;
            options = options || {};
            var result = {};

            var result = this.validateAddContacts(info);
            if (result.error) {
                result.success = false;
                if (callback) {
                    callback(result);
                }
                return;
            }

            var groupId = _.isArray(info.groupId) ? info.groupId.join(",") : info.groupId;
            var requestBody = {
                AddContacts: {
                    UserType: 1,
                    AddrFirstName: info.name,
                    MobilePhone: info.mobile,
                    FamilyEmail: info.email,
                    BusinessFax: info.fax,
                    GroupId: groupId,
                    AddGroupName: info.newGroup,
                    AddNewGroup: Boolean(info.newGroup),
                    DealStatus: info.DealStatus,
                    SecondUIN: info.SecondUIN
                }
            };

            var message = {loadingMsg:"正在添加联系人..."};
            var requestUrl = "/addrsvr/AddContacts?formattype=json&sid=" + $App.getSid();

            if (options.thingid) {
                requestUrl += "&thingid=" + options.thingid;
            }

            if(info.DealStatus && info.SecondUIN){
                message = {};
            }

            this.call(requestUrl, requestBody, function (e) {

                var addResult = e.responseData;
                if (addResult) {

                    //添加成功
                    if (addResult.ResultCode == "0") {
                        var contactinfos = addResult.ContactsInfo;

                        result.success = true;
                        result.msg = YIBUMSG.addsuccess;

                        if (contactinfos && contactinfos.length) {

                            for (var i = 0; i < contactinfos.length; i++) {
                                contactinfos[i].AddrFirstName = info.name;
                                contactinfos[i].MobilePhone = info.mobile;
                                contactinfos[i].FamilyEmail = info.email;
                                contactinfos[i].BusinessFax = info.fax;
                                contactinfos[i].GroupId = groupId;
                            }

                            This.updateCache({
                                type: "AddContacts",
                                data: contactinfos
                            });
                        }

                        result.contacts = contactinfos;

                        if (callback) {
                            callback(result);
                        }
                        //todo 更新积分？
                        /*
                        try {
                            GlobalEvent.broadcast("contacts_change");
                            if (top.postJiFen) {
                                top.postJiFen(72, 1);
                            }
                        } catch ( e ) { }
                        */
                    } else {

                        var msg = "";
                        switch (addResult.ResultCode) {
                            case ERR_CONTACT_OVERLIMIT:
                                msg = ERROR_MESSAGE['OVER_LIMIT'];
                                msg = msg.replace("3000", $User.getMaxContactLimit());
                                break;
                            case ERR_CONTACT_REACHLIMIT:msg = ERROR_MESSAGE['REACH_LIMIT'];break;
                            case ERR_CONTACT_REPEAT:msg = ERROR_MESSAGE['REPEAT'];break;
                            case ERR_CONTACT_GROUPEDLIMIT:msg = YIBUMSG.groupcontactsoverlimit;break;
                            default: 
                                msg = YIBUMSG.contactexisted[addResult.ResultCode];
                                if (!msg) { msg = YIBUMSG.addcontactfail; }
                                break;
                        }
                        result.success = false;
                        result.msg = msg;
                        result.error = msg;
                        if (callback) {
                            callback(result);
                        }
                    }
                } else {
                    result.success = false;
                    result.msg = YIBUMSG.addfailunknown;
                    result.error = result.msg;
                    if (callback) {
                        callback(result);
                    }
                }
            }, message);
        },

        //AutoSaveReceivers保存单个联系人 不加积分需求
        addBatchContactsNew: function(obj, callback) {
            var list = obj.sort ? obj:[obj];
			
            var validateResult = this.validateAddContacts(list[0]);
            if (validateResult.error) {
                validateResult.success = false;
                if (callback) {
                    callback(validateResult);
                }
                return;
            }

            var _list = $.map(list, function(i) {
                var item = { Name: i.name, SourceType: 2 };
                if (i.email) {
                    item.Email = i.email;
                }

                if (i.mobile) {
                    item.MobilePhone = i.mobile;
                }

                if (i.GroupId) {
                    item.GroupId = i.GroupId;
                }

                return item;
            });

            var requestBody = {
                AutoSaveReceivers: {
                    Count: 1,
                    ContactsInfo: _list
                }
            };

            var requestUrl = "/addrsvr/AutoSaveReceivers?formattype=json&sid=" + $App.getSid();

            var _this = this;
            _this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    var code = e.responseData.ResultCode;
                    if (code == "0") {
                        result.success = true;
                        
                        var ci = e.responseData.ContactsInfo;

                        if (_.isArray(ci)) {
                            for (var i=0; i<ci.length; i++) {
                                $.each(_list, function(index, item) {
                                    if (item.Email == ci[i].FamilyEmail) {
                                        ci[i].GroupId = item.GroupId;
                                        return false;
                                    }
                                });
                            }
                            result.list = ci;
                        } else if (typeof ci == "object") {
                            result.list = [ci];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        _this.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:[],
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        result.msg = YIBUMSG.addfailunknown
                        if (callback) {
                            callback(result);
                        }
                    }
                }
            });
        },

        /**
         *添加联系组
         *@param {String} groupName 添加的组名称
         *@param {Function} callback 操作结果回调函数
        */
        addGroup: function (groupName, callback) {
            var This = this;
            if(groupName==""){
                if(callback)callback({success:false,msg: YIBUMSG.groupname_not_exists});
                return;
            }
            var group = M2012.Contacts.getModel().getGroupByName(groupName);
            if(group){
                if(callback)callback({success:false,msg:YIBUMSG.group_alreadyexists});
                return;    
            }
            var requestBody = {
                AddGroup:{
                    GroupName:groupName
                }
            };
            //todo
            var requestUrl = "/addrsvr/AddGroup?formattype=json&sid=" + $App.getSid();
            this.call(requestUrl, requestBody, function (e) {
                var addResult = e.responseData;
                var result = {};
                if (addResult) {
                    var resultCode = addResult.ResultCode;
                    if (resultCode == "0") {
                        result.success = true;
                        result.msg = YIBUMSG.groupadded;
                        result.groupId = addResult.GroupInfo[0].GroupId;
                        result.groupName = groupName;
                        //更新缓存
                        This.updateCache({
                            type: "AddGroup",
                            data: result
                        });
                    } else {
                        if (resultCode == "9") {
                            result.error = YIBUMSG.group_alreadyexists;
                        } else {
                            result.error = YIBUMSG.addfailunknown;
                        }
                        result.success = false;
                    }
                } else {
                    result.success = false;
                    result.error = YIBUMSG.addfailunknown;
                }
                if(callback){
                    callback(result);
                }
            }, {
                loadingMsg: "正在添加分组..."
            });
        },

        /**
         *获得联系人详细资料
         *@param {String} serialId 联系人id
         *@param {Function} callback 回调函数
         *@example
         M2012.Contacts.API.getContactsDetail("602955467",function(result){
            alert(JSON.stringify(result));
         });
        */
        getContactsDetail: function (serialId, callback) {
            var This = this;
            var requestBody = {
                QueryContactsAndGroup: {
                    SerialId: serialId,
                    UserNumber: $User.getUid()
                }
            };
            //todo
            var requestUrl = "/addrsvr/QueryContactsAndGroup?sid=" + $App.getSid();
            this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    if (e.responseData.rc == "0") {
                        var info = e.responseData.ci;
                        //翻译简写属性
                        var c = M2012.Contacts.getModel().userInfoTranslate(info);
                        result.success = true;
                        result.data = c;
                    } else {
                        result.success = false;
                        //todo
                        result.error = e.responseData.rm || "未知异常";
                    }
                    
                }else{
                    result.success = false;
                    //todo
                    result.error = "未知异常";
                }
                if (callback) {
                    callback(result);
                }
                
            }, {
                responseDataType: "XML2Object"
            });
        },
        /*
        <?xml version="1.0" encoding="UTF-8"?><ModContactsResp><ResultCode>0</ResultCode><ResultMsg>Operate successful</ResultMsg><ContactsInfo><SerialId>160126039</SerialId><FirstNameword>Z</FirstNameword><FullNameword>zhanggangzuchang（jiangaojixitongweihugongchengshi)</FullNameword><FirstWord>zgzc（jgjxtwhgcs)</FirstWord></ContactsInfo></ModContactsResp>
        */
        /**
         *编辑联系人
         *@param {String} serialId 联系人id
         *@param {Object} info 编辑的字段集合：name，email，mobile，groupId
         *@param {Function} callback 回调函数
         *@example
         M2012.Contacts.API.editContacts("602955467",{
            name:"改个名",
            mobile:"15889394143"
         },function(result){
            alert(JSON.stringify(result));
         });
        */
        editContacts: function (serialId, info, callback) {
            var This = this;


            var result = this.validateAddContacts(info);
            if (result.error) {
                result.success = false;
                if (callback) {
                    callback(result);
                }
                return;
            }

            this.getContactsDetail(serialId, function (e) {
                if (!e.success) {
                    if (callback) {
                        callback(e);
                    }
                } else {
                    var c = e.data;
                    c.AddrFirstName = info.name;
                    c.FamilyEmail = info.email;
                    c.MobilePhone = info.mobile;
                    c.GroupId = _.isArray(info.groupId) ? info.groupId.join(",") : (info.groupId || "");
                    update(c);
                }
            });


            function update(c) {
                var requestBody = {
                    ModContacts: c
                };
                //todo
                var requestUrl = "/addrsvr/ModContacts?formattype=json&sid=" + $App.getSid();
                This.call(requestUrl, requestBody, function (e) {
                    var result = {};
                    if (e.responseData) {
                        var code = e.responseData.ResultCode;
                        if (code == "0") {
                            result.success = true;
                            result.msg = YIBUMSG.contactsaved;
                            result.data = e.responseData.ContactsInfo;

/*
result: Object
    data: Array[1]
        0: Object
            FirstNameword: "S"
            FirstWord: "sd"
            FullNameword: "shandong"
            SerialId: "1408641207"

c: Object
    AddrFirstName: "山东"
    ContactCount: "0"
    ContactFlag: "0"
    ContactType: "0"
    FamilyEmail: "test9167@139.com"
    FirstNameword: "S"
    GroupId: "1406706914,1406730786,1406748929"
    MobilePhone: ""
    RecordSeq: "591398532"
    SerialId: "1408641207"
    SourceType: "2"
    SynFlag: "0"
    SynId: "0"
    UserSex: "2"
    UserType: "1"
*/
                            if (Boolean(result.data.length)) {
                                c.FirstWord = result.data[0].FirstWord;
                                c.FirstNameword = result.data[0].FirstNameword;
                                c.FullNameword = result.data[0].FullNameword;
                            }

                            This.updateCache({
                                type: "EditContacts",
                                data: c
                            });
                            if(top.$App){//避免其它页面引用
                                top.$App.trigger("ContactsDataChange",{type:"EditContacts"});
                            }

                        } else {
                            result.success = false;
                            if (code == ERR_CONTACT_REPEAT) {
                                result.error = YIBUMSG.warn_contactexists;
                            }
                            else if ($.inArray(code, ERR_CONTACT_EDIT_EXIST_LIST) > -1) {
                                //编辑已存在联系人，继续提示用户是否保存
                                result.holdon = true;
                                result.resultCode = code;
                            }
                            else {
                                //todo
                                result.error = YIBUMSG.editfail || e.responseData.ResultMsg || "未知异常";
                            }
                        }
                    } else {
                        result.success = false;
                        //todo
                        result.error = "未知异常";
                    }

                    if (result.holdon) {
                        //var msg = result.resultCode == "226" ? YIBUMSG.warn_emailRepeat : YIBUMSG.warn_mobileRepeat;
                        var msg = YIBUMSG.contactexisted[result.resultCode] + "，" + YIBUMSG.isAlwaysSave;
                        top.$Msg.confirm(
                            msg,
                            function () {
                                top.Contacts.ModContactsField(c.SerialId, c, true, function (result) {
                                    if (result.resultCode == '0') {
                                        result.success = true;
                                        result.msg = YIBUMSG.contactsaved;
                                        result.data = result.ContactInfo;
                                    }
                                    else {
                                        //TODO 重复联系人编辑又失败了。
                                        result.error = YIBUMSG.editfail || e.responseData.ResultMsg || "未知异常";
                                    }
                                    callback && callback(result);
                                }, YIBUMSG.contactsaved);
                            },
                            function () {
                                //on calcel handler,do nothing
                            });
                        return false;
                    }

                    if (callback) {
                        callback(result);
                    }

                }, {
                    loadingMsg: "正在保存联系人..."
                });
            }

        },

        addBatchContacts: function(obj, callback) {
            var result = {}, list = obj.sort ? obj:[obj];

            for (var i = 0; i < list.length; i++) {
                var bool = this.validateAddContacts(list[i]);
                if (!bool) {
                    result.success = false;
                    result.errorIndex = i;
                    result.msg =  this.validateAddContacts.error;
                    if (callback) {
                        callback(result);
                    }
                    return;
                }
            }

            var _list = $.map(list, function(i) {
                var item = { Name: i.name, SourceType: 2 };
                if (i.email) {
                    item.Email = i.email;
                }

                if (i.mobile) {
                    item.MobilePhone = i.mobile;
                }

                if (i.GroupId) {
                    item.GroupId = i.GroupId;
                }

                return item;
            });

            var requestBody = {
                AutoSaveReceivers: {
                    Count: 1,
                    ContactsInfo: _list
                }
            };

            var requestUrl = "/addrsvr/AutoSaveReceivers?formattype=json&sid=" + $App.getSid();

            var _this = this;
            _this.call(requestUrl, requestBody, function (e) {
                var result = {};
                if (e.responseData) {
                    var code = e.responseData.ResultCode;
                    if (code == "0") {
                        result.success = true;
                        
                        var ci = e.responseData.ContactsInfo;

                        if (_.isArray(ci)) {
                            for (var i=0; i<ci.length; i++) {
                                $.each(_list, function(index, item) {
                                    if (item.Email == ci[i].FamilyEmail) {
                                        ci[i].GroupId = item.GroupId;
                                        return false;
                                    }
                                });
                            }
                            result.list = ci;
                        } else if (typeof ci == "object") {
                            result.list = [ci];
                        } else {
                            result.list = [];
                        }
                        if (callback) {
                            callback(result);
                        }
                        //更新缓存
                        _this.updateCache({
                            type:"AddSendContacts",
                            data:{
                                items:[],
                                newContacts:result.list
                            }
                        });
                    } else {
                        result.success = false;
                        result.msg = YIBUMSG.addfailunknown
                        if (callback) {
                            callback(result);
                        }
                    }
                }
            });
        },
        //url:http://addrsvr/QueryContactsImageUrl?sid=
        //post:<QueryContactsImageUrl><UserNumber>8615889394143</UserNumber><AddrInfo>手机号,别名</AddrInfo></QueryContactsImageUrl>
        /*response
        <QueryContactsImageUrlResp>
            <ResultCode>0</ResultCode>
            <ResultMsg>Operate successful</ResultMsg>
            <ImageInfo>
                <SerialId>802068819</SerialId>
                <ImageUrl>/upload/photo/861343087/8613430878413/20088181922924.jpg</ImageUrl>
            </ImageInfo>
            <ImageInfo>
                <SerialId>802068819</SerialId>
                <ImageUrl>/upload/photo/861343087/8613430878413/20088181922924.jpg</ImageUrl>
            </ImageInfo>
        </QueryContactsImageUrlResp>
        imgURL
        */
        /**
         *获得联系人头像
         *@param {Array} addrList 联系人的139别名、手机号
         *@param {Function} callback 回调函数
         */
        getContactsImage: function (addrList, callback) {
            var This = this;
            var cacheMap = This.contactsImageQueryCache;
            //先从缓存中找
            var key = addrList[0];
            var url = cacheMap[key];
            if (url !== undefined) {
                if (callback) {
                    callback(url);
                }
                return;
            }

            var requestData = {
                QueryContactsImageUrl: {
                    UserNumber: $User.getUid(),
                    AddrInfo: addrList.join(",")
                }
            };
            M2012.Contacts.API.call("QueryContactsImageUrl", requestData,
                function (e) {
                    if (e.responseData && e.responseData.ResultCode == "0") {
                        var url = "";
                        var json = e.responseData;
                        if (json.ImageInfo) {
                            if (!_.isArray(json.ImageInfo)) {
                                json.ImageInfo = [json.ImageInfo];
                            }
                            var list = json.ImageInfo;
                            var result = {};
                            for (var i = 0; i < list.length; i++) {
                                var item = list[i];
                                if (item.ImageUrl) {
                                    url = This.getContactsImageUrl(item.ImageUrl);
                                    break;
                                }
                            }
                        }
                        //查询结果要缓存起来
                        _.each(addrList, function (value) {
                            cacheMap[value] = url;
                        });
                        if (callback) {
                            callback(url);
                        }
                    }
                }
            );
        },
	    /**
         *直接通过调用后台的接口获取邮件地址的联系人头像(联系人是否在通讯录中存在由后台做判断)
         *@param {{addrInfo}, {info}} addrInfo ,Array里包含只包含有联系人的139别名、手机号信息
         *@param {Function} callback 回调函数
         */
        GetBatchImageUrl: function (addrInfo, callback) {
            var cacheMap = this.contactsImageQueryCache,
                key = addrInfo.addressInfo[0],
                url = cacheMap[key];

            //先从缓存中找
            if (url) {
                // 如果存在, 直接从缓存中获取, 否则保存
                _.isFunction(callback) && callback(url);
                return;
            }

            var param = {
                GetBatchImageUrl: {
                    ImageSrc : {
                        Name :  addrInfo.info.name,
                        Email : addrInfo.info.email
                    }
                }
            };

            M2012.Contacts.API.call("GetBatchImageUrl", param,
                function (response) {
                    var data = response.responseData;
                    if (!data || !data.ResultCode || data.ResultCode !== "0") {
                        // 无任何信息, 直接返回
                        console.error && data.ResultCode && console.error("errorCode: " + data.ResultCode);
                        return;
                    }

                    var url = "";
                    // 如果后台接口有返回, 则取返回值, 否则为空字符串
                    url = (data.ImageUrl) ? getDomain("resource") + data.ImageUrl[addrInfo.info.email] : url;

                    // 查询结果要缓存起来
                    _.each(addrInfo.addressInfo, function (value) {
                        cacheMap[value] = url;
                    });

                    _.isFunction(callback) && callback(url);
                }
            );
        },
        /**
         *缓存头像查询结果，避免反复查询
         */
        contactsImageQueryCache:{},
        /**
         *返回联系人头像url地址
         */
        getContactsImageUrl:function(path){
            var url = M139.Text.Url.makeUrl("/g2/addr/apiserver/httpimgload.ashx", {
                sid: $App.getSid(),
                path: path
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },


        /**
         * 通讯录只读类批量查询接口
         * @param {Object} options 参数
        */
        batchQuery: function (options) {
            var This = this;
            this.call("BatchQuery", options.requestData, function (e) {
                var result = e.responseData;
                if (e.status === 200 && result) {
                    if ($.isFunction(options.success)) options.success(result);
                } else {
                    if ($.isFunction(options.error)) options.error(result, e);
                }
            });
        },


        /**
         *更新缓存
         */
        updateCache: function (options) {
            var model = M2012.Contacts.getModel();
            model.updateCache(options);
        },

        //共享联系人
        shareContacts: function (options) {
            var This = this;

            var requestUrl = addrInterfaceUrl("ShareContacts");
            var requestData = {
                ShareContacts: {
                    "SendTo": options.sendto,
                    "SerialId": options.serialids
                }
            };

            This.call(requestUrl, requestData, function (e) {
                var result = e.responseData;

                if (!result || result.ResultCode != 0) {
                    if (options.error) options.error(result);
                    return;
                }

                if (options.success) options.success(result);
            },{
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "JSON2Object"
            });
        },

        //克隆其他邮箱联系人
        cloneContacts: function (options) {
            var requestUrl = addrInterfaceUrl("CloneContacts");
            this.call(requestUrl, options.params, function (e) {
                if (options.callback) options.callback(e);
            }, {
                requestDataType: "ObjectToXML2_URL",
                responseDataType: "JSON2Object",
                error: options.error
            });
        },
        //异步查询联系人详细数据
        getContactsInfoById: function(id , callback){
            var result = {};
            var request = "<QueryContactsAndGroup><SerialId>{0}</SerialId><UserNumber>{1}</UserNumber></QueryContactsAndGroup>";
                request = request.format(id, $User.getUid());

            var error = function(e){
                 if(callback){
                    callback(e);
                 }
            };
                
            this.call('QueryContactsAndGroup', request, function(doc){
                var info = doc.responseData;

                if(info.ResultCode == "0"){
                        result.success=true;
                        result.msg= YIBUMSG.contactreaded;
                        result.contacts=[];

                    var helper = top.$App.getModel("contacts");

                    $.each(info.ContactsInfo, function() {
                        var fullInfo = helper.userInfoTranslate(this);
                        var contact = new M2012.Contacts.ContactsInfo( fullInfo );
                        result.contacts.push(contact);
                    });

                    result.contactsInfo = result.contacts[0];
                }else{
                    result.ResultCode = info.ResultCode;
                    result.success = false;
                    result.msg = YIBUMSG.sysbusy;
                    result.contacts =[];
                }

                if(callback){
                    callback(result);
                }
            }, {error: error});
        },
        //获取可能认识的人,接口
        getWhoAddMePageData: function(info, callback) {
            var _this = this;
            var userId = top.$User.getUid();
            var request = '<WhoAddMeByPage Page="{0}" Record="{1}" Relation="{3}" IsRand="{4}"><UserNumber>{2}</UserNumber></WhoAddMeByPage>';

            request = request.format(info.pageIndex, info.pageSize, userId, info.relation || 0, info.isRand || 0);

            var error = function() {
                M139.UI.TipMessage.hide();
                M139.UI.TipMessage.show("通讯录接口无法连接，请检查网络或稍候再试", { delay:2000 });
            };

            this.call('WhoAddMeByPage', request, function(response){
                var info = response.responseData;
                var result = {};
                result.success = true;
                result.msg = YIBUMSG.contactreaded;
                result.list = info.UserInfo;
                result.total = info.TotalRecord;

                if(callback){
                    callback(result);
                }

            }, {error: error});
        },
        modDealStatus: function(info, callback) {
            info.relationId = info.relationId.toString();

            var request = "<ModDealStatus><RelationId>{0}</RelationId><DealStatus>{1}</DealStatus><GroupId>{2}</GroupId><ReqMsg>{3}</ReqMsg><ReplyMsg>{4}</ReplyMsg><OperUserType>{5}</OperUserType><UserNumber>{6}</UserNumber>{7}</ModDealStatus>";
                request = request.format(info.relationId, info.dealStatus, info.groupId, info.reqMsg, info.replyMsg, info.operUserType, top.$User.getUid());
          
            this.call("ModDealStatus", request, function(response){
                var result = {};
                var info = response.responseData;

                result.info = info;
                result.success = true;
                result.msg = YIBUMSG.contactreaded;

                if (info.ResultCode != "0") {
                    result.success = false;
                    delete result.msg; //错误时去掉提示语，各页面自己提供.20130923
                }

                if (callback) {
                    callback(result);
                };
            }, { error: function() { alert("连接失败"); } });
        }
    });
})(M139);