
var YIBUMSG = {
    addfail: "添加失败",
    addsuccess: "联系人添加成功!",
    addcontactfail: "联系人添加失败!",
    addfailunknown: "添加失败,未知错误!",
    addfailserver: "添加失败,服务器异常!",
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
    warn_contactexists :  "通讯录已存在邮箱/手机相同的联系人",
	groupoverLimit:       "联系人分组已达上限",
	groupcontactsoverlimit: "保存失败，分组联系人总数已达上限5000",
    systemUpdateing: "暂时无法处理该请求，请稍后再试",
	contactexisted: {
        "224": "手机号码已存在",
        "225": "商务手机已存在",
        "226": "电子邮箱已存在",
        "227": "商务邮箱已存在"
    },

    error_editField:      "<br /><a href='javascript:{0}'>立即修改</a>联系人资料",
    error_birthdayIllegal:"生日格式不正确",
    error_fEmailIllegal:  "电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
    error_bEmailIllegal:  "商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
    error_fMobileIllegal: "手机号码格式不正确，请输入3-20位数字",
    error_bMobileIllegal: "商务手机格式不正确，请输入3-20位数字",
    error_bMobileIllegal: "商务手机格式不正确，请输入3-20位数字",
    error_fPhoneIllegal:  "常用固话格式不正确，请输入3-30位数字、-",
    error_bPhoneIllegal:  "公司固话格式不正确，请输入3-30位数字、-",
    error_bZipCode:       "公司邮编格式不正确，请输入3-10位字母、数字、-或空格",
    error_faxIllegal:     "传真号码格式不正确，请输入3-30位数字、-",
    error_oicqIllegal:    "QQ格式不正确，请输入5-10位数字", //后端会过滤，理论不会出现
    error_fetionIllegal:  "飞信号格式不正确，请输入3-30位数字、-"
};

var ajaxDoContact = {
    RC_CODE:{
        GroupExisted: 9,
        ContactOverLimit: 21,
        GroupOverLimit: 22,
        ContactInGroupOverLimit: 23,
        ContactExisted: 28,

        BusinessPhoneInvalid: 0x321b,
        OtherPhoneInvalid: 0x321c,
        BusinessFaxInvalid: 0x321e,

		MobileExisted: 0xe0,
		BusinessMobileExisted: 0xe1,
		FamilyEmailExisted: 0xe2,
		BusinessEmailExisted: 0xe3,
			
        AddContactTooQuick: 32,
        InputContactTooQuick: 33,

        SystemUpdateing: 2072
    },
    error:function(result, callback) {
        var resultCode = result.resultCode;
        var rc = parseInt(resultCode) || 99;
        switch(rc) {
        case ajaxDoContact.RC_CODE.GroupExisted:
            result.msg = YIBUMSG.group_alreadyexists;
            break;
        case ajaxDoContact.RC_CODE.GroupOverLimit:
            result.msg = YIBUMSG.groupoverLimit;
            break;
        case ajaxDoContact.RC_CODE.ContactInGroupOverLimit:
            result.msg = YIBUMSG.groupcontactsoverlimit;
            break;
        case ajaxDoContact.RC_CODE.AddContactTooQuick:
        case ajaxDoContact.RC_CODE.InputContactTooQuick:
            //result.msg = resultMessage;  //Todo
            break;

        case ajaxDoContact.RC_CODE.ContactOverLimit:
            var maxLimit = top.Contacts.getMaxContactLimit();
			var contactsCount = top.Contacts.getContactsCount();
			if( maxLimit == 3000 && contactsCount >3000){
				maxLimit = 4000;
			}
			var msg = "";
			if (maxLimit == 3000) {
			    msg = '保存失败，联系人数量已达上限{0}。<a href="javascript:top.FF.close();top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>添加更多！';
			}
			else {
			    msg = "保存失败，联系人数量已达上限{0}。你可以<br /><a href=\"javascript:(function(){ top.$App.show('addr'); top.FF.close(); })();\">管理通讯录&gt;&gt;</a>" ;
			} 
			result.msg =  msg.format(maxLimit);
            break;

        case ajaxDoContact.RC_CODE.ContactExisted:
            result.msg = YIBUMSG.warn_contactexists;
            break;
		case ajaxDoContact.RC_CODE.MobileExisted:
		case ajaxDoContact.RC_CODE.BusinessMobileExisted:
		case ajaxDoContact.RC_CODE.FamilyEmailExisted:
		case ajaxDoContact.RC_CODE.BusinessEmailExisted:
			result.msg = YIBUMSG.contactexisted[result.resultCode];
			//result.SerialId = result.SerialId || "";
			break;
        case ajaxDoContact.RC_CODE.SystemUpdateing:
            result.msg = YIBUMSG.systemUpdateing;
            break;
        default:
            result.msg = YIBUMSG.ajax_othererror;
            break;
        }

        if(callback) {
            callback(result);
        }
    }
}

if (typeof window.jslog == 'undefined') {
    var jslog = function(s){ if (top.console){ top.console.log(s); }};
}


//#region //{ 联系人属性

var ContactsInfoProperties=[
"SerialId",
"UserType",
"SourceType",
"AddrFirstName",
"AddrSecondName",
"AddrNickName",
"UserSex",
"CountryCode",
"ProvCode",
"AreaCode",
"CityCode",
"StreetCode",
"ZipCode",
"HomeAddress",
"MobilePhoneType",
"BirDay",
"MobilePhone",
"BusinessMobile",
"BusinessPhone",
"FamilyPhone",
"BusinessFax",
"FamilyFax",
"OtherPhone",
"OtherMobilePhone",
"OtherFax",
"FamilyEmail",
"BusinessEmail",
"OtherEmail",
"PersonalWeb",
"CompanyWeb",
"OtherWeb",
"OICQ",
"MSN",
"OtherIm",
"CPCountryCode",
"CPProvCode",
"CPAreaCode",
"CPCityCode",
"CPStreetCode",
"CPZipCode",
"CPAddress",
"CPName",
"CPDepartName",
"Memo",
"StartCode",
"BloodCode",
"StateCode",
"ImageUrl",
"SchoolName",
"BokeUrl",
"UserJob",
"GroupId",
"AddGroupId",
"AddGroupName",
"AddNewGroup",
"OverWrite",
"FavoWord"//5.29
];

//#endregion //} 联系人属性

//#region //{ 添加联系人

//添加联系人（多个时调AddMultiContacts[与导入相同，频率限制一致] | 单个时调AddContacts）
Contacts.addContacts = function(obj, callback) {
    if (top.Utils.PageisTimeOut(true)){
        return;
    }
    var result = {},
        isMuti = false,
        list = obj.sort ? obj:[obj];

    if (list.length > 1) isMuti = true;

    for (var i = 0; i < list.length; i++) {
        var bool = Contacts.validateAddContacts(list[i]);
        if (!bool) {
            result.success = false;
            result.errorIndex = i;
            result.msg = Contacts.validateAddContacts.error;
            if (callback) {
                callback(result);
            }
            return;
        }
    }
    if (isMuti && Contacts.addContactsMuti) {
        Contacts.addContactsMuti(obj, callback);
        return;
    }
    var requestBody = "<AddContacts>";
    $(list).each(function(index) {
        var itemXml = "<UserType>1</UserType>";
        itemXml += "<AddrFirstName>" + encodeXML(this.name) + "</AddrFirstName>";
        if (this.mobile) {
            itemXml += "<MobilePhone>" + encodeXML(this.mobile) + "</MobilePhone>";
        }
        if (this.email) {
            itemXml += "<FamilyEmail>" + encodeXML(this.email) + "</FamilyEmail>";
        }
        if (this.groupId) {
            itemXml += "<GroupId>" + this.groupId + "</GroupId>";
        }
        if (this.newGroup) {
            itemXml += "<AddGroupName>" + encodeXML(this.newGroup) + "</AddGroupName>";
            itemXml += "<AddNewGroup>true</AddNewGroup>";
        }
        if (isMuti) {
            itemXml = "<ContactsInfo><WebId>" + index + "</WebId>" + itemXml + "</ContactsInfo>";
        }
        requestBody += itemXml;
    });
    requestBody += "</AddContacts>";
    var requestUrl = isMuti ? Contacts.getAddMultiContactsUrl() : Contacts.getAddContactsUrl();
    if (obj.thingid){
        requestUrl += "&thingid=" + obj.thingid;
    }

    getProxyJQuery().ajax({
        url: requestUrl,
        type: "post",
        data: { xml: requestBody },
        success: function(response) {
            var doc = getXmlDoc(response);
            if (doc) {
                var addResult = xml2json(doc.documentElement, AddContactsRespConfig);
                //添加成功
                if (addResult && (addResult.ResultCode == "0" || (addResult.ContactsInfo && addResult.ContactsInfo[0] && addResult.ContactsInfo[0].ResultCode == "0"))) {
                    //如果添加了多个联系人,则重新下载数据更新缓存
                    if (isMuti) {
                        Contacts.loadMainData(function() {
                            Contacts.onchange();
                        });
                    } else {
                        Contacts.addContactsToCache(list[0], addResult);
                        Contacts.init("email", window);
                        setTimeout(function() { Contacts.onchange(); }, 0);
                    }
                    result.success = true;
                    result.msg = YIBUMSG.addsuccess;
                    result.contacts = addResult.ContactsInfo;
                    if (callback) {
                        callback(result);
                    }
                    try {
                        GlobalEvent.broadcast("contacts_change");
                        if (top.postJiFen) {
                            top.postJiFen(72, 1);
                        }
                    } catch ( e ) { }
                } else {
					var ERR_CONTACT_OVERLIMIT = "21";
					var ERR_CONTACT_REACHLIMIT = "24";
					var ERR_CONTACT_REPEAT = "28";
					var msg = "";
                    switch(addResult.ResultCode){
						case ERR_CONTACT_OVERLIMIT: 	msg = frameworkMessage['error_contactOverlimit']; break;
						case ERR_CONTACT_REACHLIMIT :   msg = frameworkMessage['error_contactReachlimit']; break;
						case ERR_CONTACT_REPEAT : 		msg = frameworkMessage['error_contactRepeat']; break;
                        case ajaxDoContact.RC_CODE.SystemUpdateing :       msg = YIBUMSG.systemUpdateing; break;
						default: 						msg = YIBUMSG.addcontactfail;break;
					}
					result.success = false;
                    result.msg = msg;
                    //if (addResult && addResult.ResultMsg) result.msg = addResult.ResultMsg;
                    if (callback) {
                        callback(result);
                    }
                }
            } else {
                result.success = false;
                result.msg = YIBUMSG.addfailunknown;
                if (callback) {
                    callback(result);
                }
            }
        },
        error: function() {
            result.success = false;
            result.msg = YIBUMSG.addfailserver;
            if (callback) {
                callback(result);
            }
        }
    });
}

//添加多个联系人（同步接口，无频率限制，同自动保存联系人添加调用）
Contacts.execSyncAddContacts = function(obj, callback, groupid) {
    if (top.Utils.PageisTimeOut(true)){
        return;
    }

    var result = {}, list = obj.sort ? obj:[obj];
    var isMuti = list.length > 1;

    for (var i = 0; i < list.length; i++) {
        var bool = Contacts.validateAddContacts(list[i]);
        if (!bool) {
            result.success = false;
            result.errorIndex = i;
            result.msg =  Contacts.validateAddContacts.error;
            if (callback) {
                callback(result);
            }
            return;
        }
    }

//<AutoSaveReceivers>
//    <Count>0</Count>
//    <ContactsInfo>
//        <Name></Name>
//        <Email></Email>
//        <MobilePhone></MobilePhone>
//        <SourceType>2</SourceType>
//    </ContactsInfo>
//</AutoSaveReceivers>

    var buff = ["<AutoSaveReceivers><Count>" + list.length + "</Count>"];
    $(list).each(function(index) {
        buff.push("<ContactsInfo><Name>");
        buff.push(encodeXML(this.name));
        buff.push("</Name>");
        if (this.email) {
            buff.push("<Email>" + encodeXML(this.email) + "</Email>");
        }
        if (this.mobile) {
            buff.push("<MobilePhone>" + encodeXML(this.mobile) + "</MobilePhone>");
        }
        buff.push("<SourceType>2</SourceType></ContactsInfo>");
    })
    buff = buff.join('') + "</AutoSaveReceivers>";

    var requestUrl = Contacts.addrInterfaceUrl("AutoSaveReceivers")+"&from=2";
    getProxyJQuery().ajax({
        url: requestUrl,
        type: "post",
        data: { xml: buff },
        success: function(response) {
            var doc = getXmlDoc(response);
            if (doc) {
                var addResult = xml2json(doc.documentElement, {
                    AutoSaveReceiversResp: { type: "rich", arrayElement:"ContactsInfo"},
                    ContactsInfo: {type:"simple"}
                });
                //添加成功
                if (addResult && (addResult.ResultCode == "0" || (addResult.ContactsInfo && addResult.ContactsInfo[0] && addResult.ContactsInfo[0].ResultCode == "0"))) {
                    buff = [];
                    $(addResult.ContactsInfo).each(function(){
                        buff.push(this.SerialId);
                    });
                    buff = buff.join(","); top.jslog(buff);

                    Contacts.loadMainData(function() {
                        Contacts.onchange();
                        var gid = groupid.split(",");
                        function addd(){
                            Contacts.copyContactsToGroup(gid.pop(), buff, function(){
                                if (gid.length) addd();
                            });
                        }
                        addd();
                        Contacts.init("email", window);
                        result.success = true;
                        result.msg = YIBUMSG.addsuccess;
                        result.contacts = addResult.ContactsInfo;
                        if (callback) {
                            callback(result);
                        }
                    });
                } else {
                    result.success = false;
                    result.msg = YIBUMSG.addcontactfail;
                    if (addResult && addResult.ResultMsg) result.msg = addResult.ResultMsg;
                    if (addResult && addResult.ResultCode) result.resultCode = addResult.ResultCode;                    
                    if (callback) {
                        callback(result);
                    }
                }
            } else {
                result.success = false;
                result.msg = YIBUMSG.addfailunknown
                if (callback) {
                    callback(result);
                }
            }
        },
        error: function() {
            result.success = false;
            result.msg = YIBUMSG.addfailserver;
            if (callback) {
                callback(result);
            }
        }
    });
}

//添加最近联系人
Contacts.addLastestContacts = function(contactsType, addr) {
    var itemTemplate = "<AddContactsInfo>\
    	<SerialId>{SerialId}</SerialId>\
		<AddrName>{AddrNameEncode}</AddrName>\
		<AddrType>{AddrType}</AddrType>\
    	<AddrContent>{AddrContent}</AddrContent>\
	</AddContactsInfo>";
    var items = [];

    if (contactsType == "mobile") {
        if (typeof addr == "string") {
            addr = addr.split(/[,;]/);
        }
        $(addr).each(function() {
            var list = Contacts.getContactsByMobile(this.toString());
            if (list.length > 0) {
                var info = list[0];
                items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "M", AddrContent: this.toString() });
            } else {
                items.push({ SerialId: "0", AddrName: this.toString(), AddrType: "M", AddrContent: this.toString() });
            }
        })
    } else if (contactsType == "fax") {
        if (typeof addr == "string") {
            addr = addr.split(/[,;]/);
        }
        $(addr).each(function() {
            var list = Contacts.getContactsByFax(this.toString());
            if (list.length > 0) {
                var info = list[0];
                items.push({ SerialId: info.SerialId, AddrName: info.name, AddrType: "F", AddrContent: this.toString() });
            } else {
                items.push({ SerialId: "0", AddrName: this.toString(), AddrType: "F", AddrContent: this.toString() });
            }
        })
    } else {
        addr = Utils.parseEmail(addr);
        $(addr).each(function() {
            var list = Contacts.getContactsByEmail(this.addr);
            if (list.length > 0) {
                var info = list[0];
                items.push({ SerialId: info.SerialId, AddrName: this.name, AddrType: "E", AddrContent: this.addr });
            } else {
                items.push({ SerialId: "0", AddrName: this.name, AddrType: "E", AddrContent: this.addr });
            }
        })
    }
    var requestBody = "";
    $(items).each(function() {
        this.AddrNameEncode = encodeXML(this.AddrName);
        requestBody += itemTemplate.bind(this);
    })
    requestBody = "<AddLastContacts>" + requestBody + "</AddLastContacts>";
    var requestUrl = Contacts.getAddLastestContactsUrl();
    getProxyJQuery().post(requestUrl, { xml: requestBody }, function(response) {
        var doc = getXmlDoc(response);
        if (doc) {
            var obj = xml2json(doc.documentElement, { AddLastContactsResp: { type: "simple"} });
            if (obj && obj.ResultCode == "0") {
                Contacts.addLastestContactsToCache(items);
                Contacts.init("email", window);
            }
        }
    });
}

//添加联系人到缓存中
Contacts.addContactsToCache = function(obj, info) {
    if (info.ContactsInfo && info.ContactsInfo[0]) {
        info.GroupId = info.ContactsInfo[0].GroupId;
        info.SerialId = info.ContactsInfo[0].SerialId;
        info.FirstNameword = info.ContactsInfo[0].FirstNameword;
        info.Quanpin = info.ContactsInfo[0].FullNameword;
        info.Jianpin = info.ContactsInfo[0].FirstWord;
    }
    if (obj.newGroup && info.GroupId) {
        var g = Contacts.addGroupToCache(obj.newGroup, info.GroupId);
        g.CntNum = "1";
        Contacts.addMapToCache(info.GroupId, info.SerialId);
    }
    if (obj.groupId) {
        $(obj.groupId.split(",")).each(function() {
            Contacts.addMapToCache(this, info.SerialId);
            var group = Contacts.getGroupById(this);
            group.CntNum = group.CntNum * 1 + 1;
        })
    }
    var contacts = Contacts.data.contacts;
    var item = {
        AddrFirstName: obj.name,
        MobilePhone: obj.mobile,
        FamilyEmail: obj.email,
        FirstNameword: info.FirstNameWord || info.FirstNameword,
        SerialId: info.SerialId,
        Quanpin: info.Quanpin,
        Jianpin: info.Jianpin,
        CPName: obj.CPName,
        UserJob: obj.UserJob
    };
    info = new ContactsInfo(item);
    Contacts.data.ContactsMap[info.SerialId] = info;
    contacts.push(info);
    Contacts.data.TotalRecord++;
    return info;
}

//#endregion //} 添加联系人

//#region 新增接口的联系人公共方法
/**
* @inner 内部方法
*/
Contacts._getSimpleData = function (func, data, callback, onerror) {
    if (typeof data == "object") {
        data = $T.Xml.obj2xml2(data);
    }
    $RM.call(func, data, function (doc) {
        var info = doc.responseData;
        try {
            if (info && info.ResultCode != "0") {
                Contacts._reportLog(func, doc.responseText);
            }
            callback && callback(info);
        } catch (e) {
            return;
        }
    }, {
        error: function () {
            var _this = this;
            Contacts.onconnectionfail && Contacts.onconnectionfail();
            onerror && onerror();
        }
    });
}

/**
 * @inner 通讯录接口错误时的日志上报
 * @parm api {String} 接口名称,如QueryUserInfo
 * @parm url {String} 请求的完整地址，不建议使用，如果不使用可通过api来自动监测url
 * @parm msg {String} 错误信息，为空时则默认为"Not Response S_OK"
 * @parm responseText {String} 接口返回的报文
 */
Contacts._reportLog = function (options) {
    try {
        if (!options || (!options.api && !options.url)) return; //api和url都不存在时直接返回
        var api = options.api,
            errorMsg = options.msg || "Not Response S_OK",
            responseText = options.responseText || "";
        var httpclient = new M139.RichMail.RichMailHttpClient({});
        var postUrl = options.url || httpclient.router.getUrl(api); //key错误时,有可能抛异常

        top.M139.Logger.sendClientLog({
            level: "ERROR",
            name: "RichMailHttpClient",
            url: postUrl,
            errorMsg: errorMsg,
            responseText: responseText
        });
    } catch (e) { }
};
//#endregion

///////////////添加组信息///////////////////////////////

Contacts.addGroupToCache = function (groupName, groupId) {
    var cData = top.M2012.Contacts.getModel().get("data");
    var groupMember = cData.groupMember;
    var groupsMap = cData.groupsMap;
    var groups=Contacts.data.groups;
    var g = {
        GroupName: groupName,
        GroupId: groupId,
        CntNum: 0
    };
    groups.push(g);
    groupMember[groupId] = [];
    groupsMap[groupId] = g;
    return g;
}


Contacts.addMapToCache=function(groupId,serialId){
    serialId = serialId.split(",");
    var cData = top.M2012.Contacts.getModel().get("data");
    var groupMember = cData.groupMember;
    var groupsMap = cData.groupsMap;
    if (!groupMember[groupId]) {
        groupMember[groupId] = [];
    }
    var gm = groupMember[groupId];
    var group = groupsMap[groupId];
    if (group) {
        $(serialId).each(function () {
            gm.push(this.toString());
        });
        group.CntNum = gm.length;
    }
}


Contacts.addLastestContactsToCache = function(list) {
    var lastestContacts = Contacts.data.lastestContacts;
    if(!lastestContacts) return;
    $(list).each(function() {
        for (var i = 0; i < lastestContacts.length; i++) {
            if (lastestContacts[i] && lastestContacts[i].AddrContent == this.AddrContent) {
                lastestContacts.splice(i, 1);
                i--;
            }
        }
    });
    var arr = list.concat(lastestContacts);
    Contacts.data.lastestContacts = arr;

    var closeContacts = Contacts.data.closeContacts;
    if (closeContacts.length == 0) {
        arr = closeContacts.concat(list);
        Contacts.data.closeContacts = arr;
    }
}

//9.28 溢出修改-exec
Contacts.execaddLastestContactsExt = function(param) {
    var itemTemplate = "<AddContactsInfo>\
    	<SerialId>{SerialId}</SerialId>\
		<AddrName>{AddrName}</AddrName>\
		<AddrType>{AddrType}</AddrType>\
    	<AddrContent>{AddrContent}</AddrContent>\
    	<AddrId>0</AddrId>\
		<AddrTitle>{AddrTitle}</AddrTitle>\
		<ComeFrom>{ComeFrom}</ComeFrom>\
	</AddContactsInfo>";

    //AddrContent: 包含主送、抄送、密送的所有收件人的逗号隔开数组行 1@a.c, 2@a.c
    //ComeFrom: E、E1之类的来源标识
    //AddrTitle: 刚才发送的邮件的标题
    if(param.AddrTitle)
	{
		param.AddrTitle=unescape(param.AddrTitle);
	}
    if (!param || !param.ComeFrom || !param.AddrContent || param.AddrTitle === undefined) {
        if (!param) param = { toString: function() { return "undefined" } };
        ScriptErrorLog.addLog("param:{0},param.ComeFrom:{1},param.AddrContent:{2},param.AddrTitle:{3}".format(
            param,
            param.ComeFrom,
            param.AddrContent,
            param.AddrTitle
        ));
        return;
    }
    if (!param.AddrType) {
        param.AddrType = param.ComeFrom.substring(0, 1);
    }
    if (param.AddrType != "E" && param.AddrType != "M" && param.AddrType != "F") {
        throw "参数传递错误!";
    }
    if (param.AddrType == "M") {
        param.AddrTitle = param.AddrTitle.substring(0, 20);
    }
    var request = "";
    var keys = {
        M: function(addr) {
            return Contacts.getContactsByMobile(addr)[0];
        },
        F: function(addr) {
            return Contacts.getContactsByFax(addr)[0];
        },
        E: function(addr) {
            return Contacts.getContactsByEmail(addr)[0];
        }
    }
    var items = [];
    if (param.AddrType == "E") {
        $(Utils.parseEmail(param.AddrContent)).each(function() {
            var c = keys[param.AddrType](this.addr);
            if (c) {
                param.SerialId = c.SerialId;
                param.AddrName = c.name;
            } else {
                param.SerialId = 0;
                param.AddrName = this.name;
            }
            var item = {};
            var cacheItem = {};
            for (var p in param) {
                try {
                    cacheItem[p] = param[p];
                    item[p] = encodeXML(param[p]);
                } catch (e) { }
            }
            item.AddrContent = this.addr;
            cacheItem.AddrContent = this.addr;
            request += String.format(itemTemplate, item);
            items.push(cacheItem);
        });
    } else {
        $(param.AddrContent.split(",")).each(function() {
            if (!this.toString()) return;
            var c = keys[param.AddrType](this.toString());
            if (c) {
                param.SerialId = c.SerialId;
                param.AddrName = c.name;
            } else {
                param.SerialId = 0;
                param.AddrName = this.toString();
            }
            var item = {};
            var cacheItem = {};
            for (var p in param) {
                try {
                    cacheItem[p] = param[p];
                    item[p] = encodeXML(param[p]);
                } catch (e) { }
            }
            item.AddrContent = this.toString();
            cacheItem.AddrContent = this.toString();
            request += String.format(itemTemplate, item);
            items.push(cacheItem);
        })
    }
    request = "<AddLastContacts>" + request + "</AddLastContacts>";
    var requestUrl = Contacts.getAddLastestContactsUrl();
    getProxyJQuery().post(requestUrl, { xml: request }, function(response) {
        var doc = getXmlDoc(response);
        if (doc) {
            var obj = xml2json(doc.documentElement, { AddLastContactsResp: { type: "simple"} });
            if (obj && obj.ResultCode == "0") {
                Contacts.addLastestContactsToCache(items);
                Contacts.init("email", window);
            }
        }
    });
}


Contacts.onconnectionfail = function() {
    M139.UI.TipMessage.hide();
    M139.UI.TipMessage.show("通讯录接口无法连接，请检查网络或稍候再试", { delay:2000 });
}

Contacts.updateCache = function(type, param) {
    var properties = ["SerialId", "AddrFirstName", "AddrSecondName", "MobilePhone",
        "BusinessMobile", "OtherMobilePhone", "FamilyEmail", "BusinessEmail",
        "OtherFax", "BusinessFax", "FamilyFax", "OtherEmail", "FirstNameword", "ImageUrl", "CPName", "UserJob"];
    switch (type) {
        case "ChangeGroupName":
            {
                changeGroupName(param.groupId, param.groupName);
                break;
            }
        case "AddGroup":
            {
                Contacts.addGroupToCache(param.groupName, param.groupId);
                break;
            }
        case "DeleteGroup":
            {
                deleteGroup(param.groupId, param.isDeleteContacts);
                break;
            }
        case "DeleteContacts":
            {
                deleteContacts(param.serialId);
                break;
            }
        case "DeleteLastContacts":
            {
                deleteLastContacts(param);
                break;
            }
        case "DelLCContacts":
            {
                delLCContacts(param);
                break;
            }
        case "DeleteContactsFromGroup":
            {
                deleteContactsFromGroup(param.groupId, param.serialId);
                break;
            }
        case "CopyContactsToGroup":
            {
                copyContactsToGroup(param.groupId, param.serialId);
                break;
            }
        case "MoveContactsToGroup":
            {
                moveContactsToGroup(param.serialId, param.oldGroupId, param.newGroupId);
                break;
            }
        case "EditGroup":
            {
                editGroup(param);
                break;
            }
        case "AddContactsDetails":
            {
                addContactsDetails(param.info);
                break;
            }
        case "EditContactsDetails":
            {
                editContactsDetails(param.info);
                break;
            }
        case "MergeContacts":
            {
                deleteContacts(param.serialId);
                addContactsDetails(param.info);
                break;
            }
		case "addMoreContacts":
			{ //一次添加多个联系人时，更新联系人
				addMoreContactsDetails(param.contacts);
				break;
			}
		case "addVipContacts" :
			{//添加vip联系人param为添加的vip联系人sid串
				
				addVips(param);
				break;
			}
		case "delVipContacts" :
			{//删除vip联系人param为添加的vip联系人sid串
				
				delVips(param);
				break;
			}
		case "editVipContacts":
			{
				editVips(param);
				break;
			}
			
    }

	function addVips(serialIds){
		if(!serialIds){
			return false;
		}
		//如果存在vip联系人组，则只需要更新本地数据，否则第一次创建则需要请求后端获取数据
		var vipInfo = Contacts.data.vipDetails;
		if(vipInfo.isExist){
			var newSid = "",vipgId = vipInfo.vipGroupId;
			if(vipInfo.vipn > 0){
				newSid = vipInfo.vipSerialIds + "," + serialIds ;
			}else{
				newSid = serialIds;
			}

			var vipArr = vipInfo.vipContacts;
			var vipEmails = vipInfo.vipEmails;
			var info = Contacts.data.ContactsMap[serialIds];
				vipArr.push(info);
				vipEmails = vipEmails.concat(info.emails);
			Contacts.data.vipDetails ={
						isExist      : true,   //vip联系人分组是否存在
						hasContact   : true,   //
						vipGroupId   : vipgId,
						vipContacts  : vipArr,
						vipEmails    : vipEmails,
						vipSerialIds : newSid,
						vipn         : newSid.split(",").length || 0
					};
		}else{
			$App.trigger("change:contact_maindata")
		}	
	}
	
	function delVips(serialIds){
	    if(!serialIds){
			return false;
		}
		var vipInfo = Contacts.data.vipDetails;
		if(vipInfo.isExist){
			var oldSid = vipInfo.vipSerialIds,vipGroupId = vipInfo.vipGroupId;
			if(!oldSid){
				return false;
			}
				oldSid = oldSid.split(",");
			var delSid = serialIds.split(","); //删除-取消的sid
			for(var i=0; i<delSid.length;i++){
				oldSid.splice($.inArray(delSid[i],oldSid),1);
			}
			var oldSidLen =  oldSid.length;

			var vipArr=[],vipEmails=[];
			for(var i=0; i<oldSid.length; i++){
				var info = Contacts.data.ContactsMap[oldSid[i]];
				vipArr.push(info);
				vipEmails = vipEmails.concat(info.emails);
			}
			Contacts.data.vipDetails ={
						isExist      : true,   //vip联系人分组是否存在
						hasContact   : oldSidLen > 0,   //
						vipGroupId   : vipGroupId,
						vipContacts  : vipArr,
						vipEmails    : vipEmails,
						vipSerialIds : oldSid.join(",") || "",
						vipn         : oldSidLen
					};
		}
		
	}
    
	function editVips(serialIds){
		//如果存在vip联系人组，则只需要更新本地数据，否则第一次创建则需要请求后端获取数据
		var vipInfo = Contacts.data.vipDetails;
		if(vipInfo.isExist){
            var vipId = vipInfo.vipSerialIds || '';
            var oldIdArray = vipId.trim().length > 0 ? vipId.split(',') : [];
			var vipIdArray = !serialIds ? [] : serialIds.split(",");			

            vipIdArray = _.union(vipIdArray, oldIdArray);
            var strSerialIds = vipIdArray.join(',');            
            var newVipLegnth = vipIdArray.length;

			var vipArr=[],vipEmails=[];
			for(var i=0; i<newVipLegnth; i++){                
				var info = Contacts.data.ContactsMap[vipIdArray[i]];
                if(info){
    				vipArr.push(info);
    				vipEmails = vipEmails.concat(info.emails);
                }
			}

			Contacts.data.vipDetails ={
						isExist      : true,   //vip联系人分组是否存在
						hasContact   : newVipLegnth >0,   //
						vipGroupId   : vipInfo.vipGroupId,
						vipContacts  : vipArr,
						vipEmails    : vipEmails,
						vipSerialIds : strSerialIds || "",
						vipn         : newVipLegnth
					};
		}else{
			$App.trigger("change:contact_maindata")
		}	
	}
	
	function changeGroupName(groupId, groupName) {
        if (!groupId) throw "缺少参数:groupId";
        var g = Contacts.getGroupById(groupId);
        if (g) {
            g.GroupName = groupName;
        } else {
            throw "错误的组id";
        }
    }
    function deleteGroup(groupId, isDeleteContacts) {
        var groups = Contacts.data.groups, i;
        if (isDeleteContacts) {
            var contacts = Contacts.getContactsByGroupId(groupId, true);
            deleteContacts(contacts.toString());
        }
        for (i = 0, len = groups.length; i < len; i++) {
            if (groups[i].GroupId == groupId) {
                groups.splice(i, 1);
                break;
            }
        }

        var model = top.M2012.Contacts.getModel();
        var cData = model.get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;
        delete groupMember[groupId];
        delete groupsMap[groupId];
        updateNoGroup();
        model.trigger('contacts:group#deleted', groupId);
    }
    //清空本地所有最近/紧密联系人记录
    function delLCContacts(isCloseContacts){
        if (isCloseContacts) {
            Contacts.data.closeContacts.length = 0;
            Contacts.data.contactsHasRecord = {};
        } else {
            Contacts.data.lastestContacts.length = 0;
            Contacts.data.lastContactsDetail.length = 0;
        }
    }

    function deleteLastContacts(param) {

//    param= {
//                info: {
//                       email: "xxx@xxx.com",
//                       fax: "",
//                       mobile: "",
//                       name: "xxx",
//                       serialId: "405485",
//                       type: "last" } }

//      Contact.data.strangerHasRecord;
//      Contact.data.lastestContacts

        var i, item,
            _type = param.info.type,
            _email = param.info.email,
            _record = Contacts.data.strangerHasRecord,
            _last = [];

        switch(_type) {
            case "last":_last = Contacts.data.lastestContacts; break;
            case "close":_last = Contacts.data.closeContacts; break;
        }

        delete _record[_email];
        for (i = 0; i < _last.length; i++) {
            item = _last[i];
            if (item.AddrContent == _email) {
                _last.splice(i, 1);
                i--;
                //Contacts.data.TotalRecord--; //最近联系人记录应该没算联系人总数吧。
            }
        }
    }

    function deleteContacts(serialId) {
        var reg = new RegExp("^(?:" + serialId.replace(/,/g, "|") + ")$");
        var contacts = Contacts.data.contacts;
        var cData = top.M2012.Contacts.getModel().get("data");
        var ContactsMap = Contacts.data.ContactsMap;

        $(serialId.split(",")).each(function() {
            delete ContactsMap[this.toString()];
        });

        var i, item;
        for (i = 0; i < contacts.length; i++) {
            item = contacts[i];
            if (reg.test(item.SerialId)) {
                contacts.splice(i, 1);
                i--;
                Contacts.data.TotalRecord--;
                cData.TotalRecord--;
            }
        }
        
        var groupMember = cData.groupMember;
        for (var gid in groupMember) {
            deleteContactsFromGroup(gid, serialId, true); //删除联系人时，静默，避免重复请求GetUserAddrJsonData
        }
        updateNoGroup();
    }
    function deleteContactsFromGroup(groupId, serialId, isSilent) {
        var reg = new RegExp("^(?:" + serialId.replace(/,/g, "|") + ")$");
        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;
        var gm = groupMember[groupId];
        for (var len = gm.length, i = len - 1; i >= 0; i--) {
            if (reg.test(gm[i])) {
                gm.splice(i, 1);
                //break;
            }
        }
        groupsMap[groupId].CntNum = gm.length;
        if (!isSilent) {
            $App.trigger("change:contact_maindata");
            updateNoGroup();
        }
    }
    function copyContactsToGroup(groupId, serialId, isSilent) {
        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;
        $(serialId.split(",")).each(function () {
            var id = this.toString();
            for (var gid in groupMember) {
                if(gid == groupId){
                    var gm = groupMember[gid]; //分组中的serialId数组
                    for (var i = 0, len = gm.length; i < len; i++) {
                        if (gm[i] === id) {
                            return;//联系人已在目标组
                        }
                    }
                }
            }
            groupMember[groupId] = groupMember[groupId] || [];
            groupMember[groupId].push(id);
            groupsMap[groupId].CntNum = groupMember[groupId].length;
        });
        if (!isSilent) {
            $App.trigger("change:contact_maindata");
            updateNoGroup();
        }
    }
    function moveContactsToGroup(serialId, oldGroupId, newGroupId) {
        copyContactsToGroup(newGroupId, serialId, true);
        deleteContactsFromGroup(oldGroupId, serialId, true);
        $App.trigger("change:contact_maindata");
        updateNoGroup();
    }
    function editGroup(param) {
        if (param.isCreateGroup) {
            var g = Contacts.addGroupToCache(param.groupName, param.groupId);
            g.CntNum = 0;
        } else {
            g = Contacts.getGroupById(param.groupId);
            g.GroupName = param.groupName;
            clearGroupContacts(param.groupId);
            g.CntNum = 0;
        }
        if (param.serialId) {
            Contacts.addMapToCache(param.groupId, param.serialId);
            g.CntNum = param.serialId.split(",").length;
        }
        function clearGroupContacts(gid) {
            var cData = top.M2012.Contacts.getModel().get("data");
            var groupMember = cData.groupMember;
            var groupsMap = cData.groupsMap;
            if (groupMember[gid]) {
                groupMember[gid].length = 0;
                groupsMap[gid].CntNum = 0;
            }
        }
    }

    //添加联系人更新缓存
    function addContactsDetails(info) {        
        //先在联系人组中增加新的联系人
        var obj = {};
        $(properties).each(function() {
            var p = info[this];
            if (p) obj[this] = p.toString();
        });
        obj.Quanpin = info.FullNameword;
        obj.Jianpin = info.FirstWord;
        var c = new top.ContactsInfo(obj);
        Contacts.data.ContactsMap[c.SerialId] = c;
        Contacts.data.contacts.unshift(c);
        Contacts.data.TotalRecord++;


        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;

        //更新相应的组关系与每组联系人数
        var groupId = [];
        if (info.AddGroupId) {
            var newGroup = {
                GroupName: info.AddGroupName,
                GroupId: info.AddGroupId,
                CntNum: 1
            };
            Contacts.data.groups.push(newGroup);
            groupsMap[info.AddGroupId] = newGroup;
            groupMember[info.AddGroupId] = [info.SerialId];
        }
        
        if (info.GroupId) groupId = info.GroupId.toString().split(",");
        $(groupId).each(function() {
            var gid = this.toString();
            if (!groupMember[gid]) groupMember[gid] = [];
            groupMember[gid].push(info.SerialId);
            if (groupsMap[gid]) {
                groupsMap[gid].CntNum = groupMember[gid].length;
            }
        });


        //完成上述操作后，同步操作即可在缓存中得到最新的联系人数据
        //但是前端无法解决正确的排序问题，所以异步刷新全量数据
        $App.trigger("change:contact_maindata");
        updateNoGroup();
    }
    //更新多个新建联系人缓存
    function addMoreContactsDetails(contactsInfo) {
        var groupId = [];
        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;
        for(var i = 0; i<contactsInfo.length; i++){
			var info = contactsInfo[i];
			if (info.GroupId) groupId = info.GroupId.toString().split(",");
			if (info.AddGroupId) {
				groupId.push(info.AddGroupId);
				Contacts.data.groups.push({
					GroupName: info.AddGroupName,
					GroupId: info.AddGroupId,
					CntNum: 0
				});
			}
			$(groupId).each(function () {
			    var gid = this.toString();
			    if (!groupMember[gid]) {
			        groupMember[gid] = [];
			    }
			    groupMember[gid].push(info.SerialId);
			    if (groupsMap[gid]) {
			        groupsMap[gid].CntNum = groupMember[gid].length;
			    }
			});
			var obj = {};
			$(properties).each(function() {
				var p = info[this];
				if (p) obj[this] = p.toString();
			});
			obj.Quanpin = info.FullNameword;
			obj.Jianpin = info.FirstWord;
			var c = new top.ContactsInfo(obj);
			Contacts.data.ContactsMap[c.SerialId] = c;

			var fnw = info.FirstNameword.toLowerCase(),ccs = Contacts.data.contacts, k=ccs.length;
			if (fnw === "数") {
				fnw = info.AddrFirstName.substring(0,1);
			}
			if (k==0) {
				Contacts.data.contacts.push(c);
			} else if ( (fnw < ccs[0].FirstNameword && ccs[0].FirstNameword !== "数")
				|| (ccs[0].FirstNameword === "数" && fnw < info.AddrFirstName.substring(0,1)) ) {
				Contacts.data.contacts.unshift(c);
			} else if (fnw > ccs[k-1].FirstNameword) {
				Contacts.data.contacts.push(c);
			} else {
				while(k--) { if (ccs[k].FirstNameword == fnw)break; }
				Contacts.data.contacts.splice(k,0,c);
			}
			Contacts.data.TotalRecord++;
		
		}
        $App.trigger("change:contact_maindata");
        updateNoGroup();
    }
    //编辑联系人更新缓存
    function editContactsDetails(info) {
        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var groupsMap = cData.groupsMap;
        var groupId = [];

        //先清除旧的组关系，再增加新的
        for (var gid in groupMember) {
            var gm = groupMember[gid];
            for (var i = 0, len = gm.length; i < len; i++) {
                if (gm[i] === info.SerialId) {
                    gm.splice(i, 1);
                    break;
                }
            }
            if (groupsMap[gid]) {
                groupsMap[gid].CntNum = gm.length;
            }
        }
        
        if (info.GroupId) groupId = info.GroupId.toString().split(",");
        if (info.AddGroupId) {
            var newGroup = {
                GroupName: info.AddGroupName,
                GroupId: info.AddGroupId,
                CntNum: 0
            };
            groupId.push(info.AddGroupId);
            Contacts.data.groups.push(newGroup);
            groupsMap[info.AddGroupId] = newGroup;
            groupMember[info.AddGroupId] = [info.SerialId];
        }

        $(groupId).each(function() {
            var gid = this.toString();
            if (!groupMember[gid]) groupMember[gid] = [];
            groupMember[gid].push(info.SerialId);
            if (groupsMap[gid]) {
                groupsMap[gid].CntNum = groupMember[gid].length;
            }
        });

        var c = new top.ContactsInfo(info);
        Contacts.data.ContactsMap[info.SerialId] = c;

        for (var i=Contacts.data.contacts.length; i--; ) {
            if (Contacts.data.contacts[i].SerialId == info.SerialId) {
                Contacts.data.contacts[i] = c;
                break;
            }
        }

        $App.trigger("change:contact_maindata");
        updateNoGroup();
    }

    /**
     *更新未分组的缓存
     */
    function updateNoGroup() {
        var cData = top.M2012.Contacts.getModel().get("data");
        var groupMember = cData.groupMember;
        var noGroup = cData.noGroup;
        var contactsMap = cData.contactsMap;
        var grouped = {};
        noGroup.length = 0;
        for (var gid in groupMember) {
            var gm = groupMember[gid];
            for (var i = 0, len = gm.length; i < len; i++) {
                grouped[gm[i]] = 1;
            }
        }
        for (var cid in contactsMap) {
            if (!(cid in grouped)) {
                noGroup.push(cid);
            }
        }        
    }
}
//deprecated
function doContactsAjax(param){
    /*if(!Contacts.allowChangeView()){
        alert(YIBUMSG.processing);
        return;
    }*/
    var url=param.url;
    var request=param.request;
    var timeout=param.timeout||30000;
    var type=param.type||"post";
    var successHandler=param.successHandler;
    var callback=param.callback;
    ajax();
    if(param.showLoading!=false)Contacts.showLoading();

    function ajax(){
        getProxyJQuery().ajax({
            data:{xml:request},
            url:url,
            type:type,
            success:function(response){
                top.M139.UI.TipMessage.hide();
                if(param.responseEncode){
                    response=param.responseEncode(response);
                }
                var doc=getXmlDoc(response);
                if(doc && doc.documentElement){
                    var rc=doc.getElementsByTagName("ResultCode")[0];
                    rc=rc||doc.getElementsByTagName("rc")[0];
                    var msg=doc.getElementsByTagName("ResultMsg")[0];
                    msg=msg||doc.getElementsByTagName("rm")[0];
                    if(rc){
                        var text=rc.text||rc.textContent;
                        var message=msg.text||msg.textContent;
                        if(text=="0"){
                            if(successHandler)successHandler(doc,rc);
                        }else{
                            error(text,message,doc);
                        }
                    }else{
                        error();
                    }
                }else{
                    error();
                }

            },
            error:error,
            timeout:timeout
        });
    }
    
    var RC_CODE = {
        GroupExisted: 9,
        ContactOverLimit: 21,
        GroupOverLimit: 22,
        ContactInGroupOverLimit: 23,
        ContactExisted: 28,
        AddContactTooQuick: 32,
        InputContactTooQuick: 33
    };
    
    function error(resultCode,resultMessage, xdoc){
        if(param.showLoading!=false)top.M139.UI.TipMessage.hide();;
        var result={};
        result.success=false;
        if(typeof(resultCode)=="string"){
            result.resultCode=resultCode;
        }
        var rc = parseInt(result.resultCode);
        switch(rc) {
            case RC_CODE.GroupExisted:  	result.msg = YIBUMSG.group_alreadyexists; break;
            case RC_CODE.GroupOverLimit:	result.msg = YIBUMSG.groupoverLimit; break;
            case RC_CODE.ContactInGroupOverLimit:result.msg = YIBUMSG.groupcontactsoverlimit ; break;
            case RC_CODE.AddContactTooQuick:
            case RC_CODE.InputContactTooQuick:
                result.msg=resultMessage;
                break;

            case RC_CODE.ContactOverLimit:
                
				var maxLimit = top.Contacts.getMaxContactLimit();
				var contactsCount = top.Contacts.getContactsCount();
				if( maxLimit == 3000 && contactsCount >3000){
					maxLimit = 4000;
				}
				var msg = "保存失败，联系人数量已达上限{0}。你可以<br /><a href=\"javascript:(function(){ top.FF.close();var d = document.getElementById('addr'); d= d.contentDocument || d.contentWindow.document;  var b = d.createElement('a');b.href = 'addr_index.html?1=1';d.body.appendChild(b);b.click();})();\">管理通讯录&gt;&gt;</a>" ;
				result.msg =  msg.format(maxLimit);
				break;

            case RC_CODE.ContactExisted:
                rc = xdoc.getElementsByTagName("SerialId")[0];
                rc = rc.text||rc.textContent;
                result.SerialId = parseInt(rc);
                result.msg = YIBUMSG.warn_contactexists;
                break;
            default:
                result.msg = YIBUMSG.ajax_othererror;
                break;
        }

        if(callback){
            callback(result);
        }
    }
}

//[FIXED]
Contacts.addGroup=function(groupName,callback){
    var _groupName=groupName.trim();
    if(_groupName==""){
        if(callback)callback({success:false,msg: YIBUMSG.groupname_not_exists});
        return;
    }
    var group=Contacts.getGroupByName(_groupName);
    if(group){
        if(callback)callback({success:false,msg:YIBUMSG.group_alreadyexists});
        return;    
    }
    var request="<AddGroup><UserNumber>{0}</UserNumber><GroupName>{1}</GroupName></AddGroup>".format($User.getUid(),encodeXML(_groupName));
    function successHandler(doc){
        var result={};

        var info = doc.responseData;
        result.ResultCode = info.ResultCode;
        result.success=true;
        result.msg= YIBUMSG.groupadded;
        result.groupId= info.GroupInfo && info.GroupInfo.length > 0 ?info.GroupInfo[0].GroupId : 0;
        if(result.ResultCode == ajaxDoContact.RC_CODE.SystemUpdateing){
            top.$Msg.alert(YIBUMSG.systemUpdateing);            
        }else{
            //更新缓存
            Contacts.updateCache("AddGroup",{'groupName':_groupName,'groupId':result.groupId});
            Contacts.onchange();
            if(callback){
                callback(result);
            }
        }
    }
    $RM.call("AddGroup", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//[FIXED]
Contacts.changeGroupName=function(groupId,groupName,callback){
    groupName=groupName.trim();
    if(groupName==""){
        if(callback)callback({success:false,msg: YIBUMSG.groupname_not_exists});
        return;
    }
    var group=Contacts.getGroupByName(groupName);
    if(group && group.GroupId!=groupId){
        if(callback)callback({success:false,msg: YIBUMSG.group_alreadyexists});
        return;    
    }
    var request="<ModGroup><GroupId>{0}</GroupId><GroupName>{1}</GroupName></ModGroup>".format(groupId,encodeXML(groupName));
    function successHandler(doc){
        var result={};
        //var info=xml2json(doc.documentElement,{ModGroupResp:{type:"rich"},GroupInfo:{type:"simple"}});
        var info = doc.reponseData || {};
        result.success=true;
        result.msg= YIBUMSG.groupmodified;
        //更新缓存
        Contacts.updateCache("ChangeGroupName",{groupId:groupId,groupName:groupName});
        Contacts.onchange();

        if(callback){
            callback(result);
        }        
    }
     $RM.call("ModGroup", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url:Contacts.addrInterfaceUrl("ModGroup"),
    //     callback:callback,
    //     request:request,
    //     successHandler:successHandler
    // });
}


Contacts.deleteGroup=function(groupId,callback,isDeleteContacts){
    var request="<DelGroup><UserNumber>{0}</UserNumber><GroupId>{1}</GroupId><DelContact>{2}</DelContact></DelGroup>".format($User.getUid(),groupId,isDeleteContacts?"true":"false");
     var result={};
	function successHandler(doc){
		var info =doc.responseData;        
		result.success=true;
        result.msg= YIBUMSG.groupdeleted;

        //更新缓存
        Contacts.updateCache("DeleteGroup",{groupId:groupId,isDeleteContacts:isDeleteContacts});
        Contacts.onchange();

        if(callback){
            callback(result);
        }
    }
	$RM.call("DelGroup", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}


Contacts.deleteContacts=function(serialId,callback){
    serialId=serialId.toString();

    var result={};
    function successHandler(doc){
        var info= doc.responseData;

        if (info.ResultCode == "0") {
            result.success=true;
            result.msg= YIBUMSG.contactdeleted;
            Contacts.updateCache("DeleteContacts",{serialId:serialId});
            Contacts.onchange();

            if(callback){
                callback(result);
            }
        } else {
            result.ResultCode = info.ResultCode;
            result.success = false;
            result.msg = YIBUMSG.sysbusy;

            ajaxDoContact.error(result,callback);
        }
    }
    var request= ["<DelContacts>",
        "<UserNumber>", $User.getUid(), "</UserNumber>",
        "<SerialId>", serialId,"</SerialId></DelContacts>"].join("");

    $RM.call("DelContacts", request, function(a){
        successHandler(a);
    }, { error: function(){ Contacts.onconnectionfail(); } });
}


Contacts.deleteContactsFromGroup=function(groupId,serialId,callback){
    serialId=serialId.toString();
    var request="<DelGroupList><UserNumber>{0}</UserNumber><GroupId>{1}</GroupId><SerialId>{2}</SerialId></DelGroupList>"
        .format($User.getUid(), groupId, serialId);
    var result={};
    function successHandler(doc){
        var info = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactdeleted;
        Contacts.updateCache("DeleteContactsFromGroup",{groupId:groupId,serialId:serialId});
        Contacts.onchange();

        if(callback){
            callback(result);
        }
    }
    $RM.call("DelGroupList", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//AddGroupList-11.01修改过文档-添加了groupType字段，但是此字段不是必填，所有这个老接口么有修改。
//[FIXED]
Contacts.copyContactsToGroup=function(groupId,serialId,callback){
    serialId=serialId.toString();
    var request="<AddGroupList><GroupId>{0}</GroupId><SerialId>{1}</SerialId><UserNumber>{2}</UserNumber></AddGroupList>".format(groupId,serialId,top.$User.getUid());
    var result={};
    function successHandler(doc){
        //var info=xml2json(doc.documentElement,{AddGroupListResp:{type:"simple"}});
        var info = doc.responseData;
        
        result.msg= YIBUMSG.contactcopyed;
        Contacts.updateCache("CopyContactsToGroup",{groupId:groupId,serialId:serialId});
        Contacts.onchange();
        if(callback){
            if(info.ResultCode!=0){
				result.success=false;
				result.resultCode =info.ResultCode;
				ajaxDoContact.error(result,callback);
			}else{
				result.success=true;
				callback(result);
			}
        }
    }
    $RM.call("AddGroupList", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url:Contacts.addrInterfaceUrl("AddGroupList"),
    //     callback:callback,
    //     request:request,
    //     successHandler:successHandler
    // });
}

//[FIXED]
Contacts.moveContactsToGroup=function(serialId,oldGroupId,newGroupId,callback){
    serialId=serialId.toString();
    var request="<MoveGroupList><UserNumber>{0}</UserNumber><SerialId>{1}</SerialId><OldGroupId>{2}</OldGroupId><NewGroupId>{3}</NewGroupId></MoveGroupList>".format($User.getUid(), serialId,oldGroupId,newGroupId);
    var result={};
    function successHandler(doc){
        var info = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactmoved;
        Contacts.updateCache("MoveContactsToGroup",{serialId:serialId,oldGroupId:oldGroupId,newGroupId:newGroupId});
        Contacts.onchange();

        if(callback){
            callback(result);
        }
    }

    $RM.call("MoveGroupList", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//[FIXED]
Contacts.getContactsInfoById=function(id,callback){
    id=id.toString();
    var request="<QueryContactsAndGroup><SerialId>{0}</SerialId><UserNumber>{1}</UserNumber></QueryContactsAndGroup>"
        .format(id, $User.getUid());
    var result={};
    function successHandler(doc){
        var info = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactreaded;
        result.contacts=[];

        var helper = top.$App.getModel("contacts");

        $.each(info.ContactsInfo, function() {
            var fullInfo = helper.userInfoTranslate(this);
            var contact = new M2012.Contacts.ContactsInfo( fullInfo );
            result.contacts.push(contact);
        });

        result.contactsInfo=result.contacts[0];
        if(callback){
            callback(result);
        }
    }

    $RM.call("QueryContactsAndGroup", request, function(a){
        successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//[FIXED]
Contacts.addContactsMuti = function(contacts, callback) {
    var request = "<AddBatchContacts>";
    request += "<UserNumber>" + top.$User.getUid() + "</UserNumber>";
    $(contacts).each(function(index) {
        var itemXml = "<ContactsInfo><UserType>1</UserType>";
        itemXml += "<AddrFirstName>" + encodeXML(this.name) + "</AddrFirstName>";
        if (this.mobile) {
            itemXml += "<MobilePhone>" + encodeXML(this.mobile) + "</MobilePhone>";
        }
        if (this.email) {
            itemXml += "<FamilyEmail>" + encodeXML(this.email) + "</FamilyEmail>";
        }
        if (this.groupId) {
            itemXml += "<GroupId>" + this.groupId + "</GroupId>";
        }
        if (this.newGroup) {
            itemXml += "<AddGroupName>" + encodeXML(this.newGroup) + "</AddGroupName>";
            itemXml += "<AddNewGroup>true</AddNewGroup>";
        }
        itemXml += "<WebId>" + index + "</WebId></ContactsInfo>";
        request += itemXml;
    });
    request += "<ImportType>1</ImportType></AddBatchContacts>";
    var url = Contacts.addrInterfaceUrl("AddBatchContacts");
    var result = {};
    var delay = 200+50*contacts.length;
    var resultlength = contacts.length;
    function failResult(msg, propertyName) {
        result.success = false;
        result.msg = msg;
        result.errorProperty = propertyName;
        if (callback) callback(result);
    }
    function successHandler(doc) {
        var info = doc.responseData || {};
        result.success = true;
        result.msg = YIBUMSG.contactreaded;

        if (callback) {
            callback(result);
        }

        //Todo
        if (top.postJiFen) {
            top.postJiFen(72, resultlength);
        }
    }
    $RM.call("AddBatchContacts", request, function(a){
            successHandler(a);
    }, { error: failResult});
}


/*
* biz:发送邮件
* 1)通讯录首页 selectBox 触发 2)通讯录首页 点击联系人Row触发  3)通讯录首页 联系人Row hover的功能卡中发送邮件触发
* 
*/
Contacts.execContactDetails = function(contacts, callback, isAdd) {
    var request = contacts, result = {};
     var apiType = "";
    if (!isAdd && contacts.ImageUrl && !/\d+/.test(contacts.ImageUrl)) {
        contacts.ImageUrl = "";
    }

    if (/nopic/.test(contacts.ImageUrl) || /nopic/.test(contacts.ImagePath)) {
         contacts.ImageUrl = "";
    }

    //防止imageurl带有?, 后台会检测xxs, 需要重置ImageUrl,
    if(contacts.ImageUrl && contacts.ImageUrl.indexOf('?') > -1){
        contacts.ImageUrl = contacts.ImageUrl.substring(0, contacts.ImageUrl.indexOf('?'));
    }

    apiType = isAdd ? "AddContacts" : "ModContacts";
    if (typeof contacts != "string") {  
        //标记为已校验过，则不再重复校验
        if ( !contacts.validated ) {
            var validateResult = contacts.validateDetails();
            if (!validateResult.success) {
                return failResult(validateResult.msg, validateResult.errorProperty);
            }
        }
        contacts.AddrFirstName = contacts.name;
        contacts.AddrSecondName = "";
        request = "<" + apiType + ">";
        for (var i = 0; i < ContactsInfoProperties.length; i++) {
            var p = ContactsInfoProperties[i];
            if (CIPManger[p]) {
                request += CIPManger[p]({ info: contacts, isAdd: isAdd, value: contacts[p], propertyName: p });
            } else {
                request += CIPManger.Default({ info: contacts, isAdd: isAdd, value: contacts[p], propertyName: p });
            }
        }
         request += "</" + apiType + ">";
    }else{//触发：通讯录首页 selectBox，传过来的可能是XML的字符串
    }
    request = "<"+apiType+"><UserNumber>"+top.$User.getUid()+"</UserNumber>"+request.substring(request.indexOf(">")+1);//重要，插入UserNumber

    function failResult(msg, propertyName) {
        var result = {};
        result.success = false;
        result.msg = msg;
        result.errorProperty = propertyName;
        if (callback) callback(result);
    }

    function successHandler(doc) {

        var info = doc.responseData;
        var result = {};
        var groupId = '';
        result.resultCode = info.ResultCode;
        info = ((info.ContactsInfo && info.ContactsInfo.length > 0)? info.ContactsInfo[0] :info ) || contacts; //报文不一致
        groupId = info ? info.GroupId : undefined;
        if(result.resultCode == 0){
            result.success = true;
            result.msg = YIBUMSG.contactsaved;
            if (isAdd) result.SerialId = info.SerialId;

            if (typeof contacts != "string") {
                if(contacts.SerialId  == -1 || contacts.SerialId.length <= 0){
                    contacts.SerialId = info.SerialId;
                }

                if(!contacts.AddGroupId || $.trim(contacts.AddGroupId).length == 0){
                    contacts.AddGroupId = groupId;
                }

                //合并简单属性到 info 上。然后在updateCache中插入，顶层缓存
                for (var i in contacts) {
                    if (typeof(contacts[i]) === "string") {                            
                            info[i] =  contacts[i];
                    }
                }

                if (isAdd) {
                    Contacts.updateCache("AddContactsDetails", { info: info });
                } else {                
                    Contacts.updateCache("EditContactsDetails", { info: info });
                    //top.BH({actionId: 9551, thingId: "0", moduleId: 19, actionType: 10});
                }

                result.addGroupId = groupId;
                result.serialId = info.SerialId;                
                result.newGroupId = info.GroupId;
                result.newGroupName = contacts.AddGroupName;

                
            }

            if (callback) {callback(result)};
        }else{
             result.SerialId = info.SerialId || 0;
             result.success = false;
             ajaxDoContact.error(result,callback);
        }

    }

    var url = Contacts.addrInterfaceUrl(apiType);

    $RM.call(apiType, request, function(a){
            successHandler(a);
    }, { error: failResult});
}

//[FIXED] Todo
Contacts.getRepeatContacts=function(callback){
    var request="<GetRepeatContacts><UserNumber>{0}</UserNumber></GetRepeatContacts>".format(top.$User.getUid());
    var result={};
    function successHandler(doc){
        //var info=xml2json(doc.documentElement,{GetRepeatContactsResp:{type:"rich",arrayElement:"ri"}});
        var info = doc.responseData;
        if(callback){
            result.success=true;
            result.list=[];
            $(info.RepeatInfo).each(function(){
                result.list.push(this.sd.split(","));
            });
            callback(result);
        }
    }
    $RM.call("GetRepeatContacts", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//[FIXED]
/*
*  由于后台数据格式变化，中间数据封装可省略
*
*/
Contacts.getLastContactsDetail=function(callback,isClose){
    var request="<GetLastContactsDetail><Type>{0}</Type><UserNumber>{1}</UserNumber></GetLastContactsDetail>".format(isClose?"close":"last",top.$User.getUid());
    function successHandler(doc){
        var result={};
        var info  = doc.responseData;  
        result.success=true;
        result.msg= YIBUMSG.contactreaded;
        var items= info.LastContactsInfo || [];
        result.list = items;
        if(items.length > 0) {
            var list = [];
            for(var i = 0; i < items.length; i++) {
                list[i] = new LastContactsInfo(items[i]);
            };
            result.list = list;
            list = null;
        }
        
         if(callback){
            callback(result);
        }
        
    }

    $RM.call("GetLastContactsDetail", request, function(a){
        successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//存在死循环-直接提到contacts.js
//[FIXED] Todo
Contacts.execQueryUserInfo=function(callback){
    var request="<QueryUserInfo><UserNumber>{0}</UserNumber></QueryUserInfo>".format($User.getUid());
    function successHandler(doc){
        var result={};
        //var obj=xml2json(doc.documentElement,{QueryUserInfoResp:{type:"rich"},UserInfo:{type:"simple"}});
        var obj = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactsaved;
        if(obj.UserInfo){
            result.info= new top.M2012.Contacts.ContactsInfo(obj.UserInfo);
        }else{
            result.info=null;
        }
        if(callback){                                  
            callback(result);
        }
    }

    $RM.call("QueryUserInfo", requestBody, function(a){
            successHandler(a);
        }, { error: function(){ alert("连接失败"); } });
}

//添加个人信息--本人
Contacts.AddUserInfo=function(info,callback){
    if(info.name){
        info.AddrFirstName=info.name;
        info.AddrSecondName="";
    }
    var xml="<AddUserInfo><SourceType>2</SourceType>\
<AddrFirstName></AddrFirstName>\
<AddrSecondName></AddrSecondName>\
<AddrNickName></AddrNickName>\
<FavoWord></FavoWord>\
<UserSex>0</UserSex>\
<CountryCode></CountryCode>\
<ProvCode></ProvCode>\
<AreaCode></AreaCode>\
<CityCode></CityCode>\
<StreetCode></StreetCode>\
<ZipCode></ZipCode>\
<HomeAddress></HomeAddress>\
<MobilePhoneType>0</MobilePhoneType>\
<BirDay></BirDay>\
<MobilePhone></MobilePhone>\
<BusinessMobile></BusinessMobile>\
<BusinessPhone></BusinessPhone>\
<FamilyPhone></FamilyPhone>\
<BusinessFax></BusinessFax>\
<FamilyFax></FamilyFax>\
<OtherPhone></OtherPhone>\
<OtherMobilePhone></OtherMobilePhone>\
<OtherFax></OtherFax>\
<FamilyEmail></FamilyEmail>\
<BusinessEmail></BusinessEmail>\
<OtherEmail></OtherEmail>\
<PersonalWeb></PersonalWeb>\
<CompanyWeb></CompanyWeb>\
<OtherWeb></OtherWeb>\
<OICQ></OICQ>\
<MSN></MSN>\
<OtherIm></OtherIm>\
<CPCountryCode></CPCountryCode>\
<CPProvCode></CPProvCode>\
<CPAreaCode></CPAreaCode>\
<CPCityCode></CPCityCode>\
<CPStreetCode></CPStreetCode>\
<CPZipCode></CPZipCode>\
<CPAddress></CPAddress>\
<CPName></CPName>\
<CPDepartName></CPDepartName>\
<Memo></Memo>\
<FirstNameword></FirstNameword>\
<StartCode></StartCode>\
<BloodCode></BloodCode>\
<StateCode></StateCode>\
<ImageUrl></ImageUrl>\
<SchoolName></SchoolName>\
<BokeUrl></BokeUrl>\
<UserJob></UserJob>\
<FamilyPhoneBrand></FamilyPhoneBrand>\
<BusinessPhoneBrand></BusinessPhoneBrand>\
<OtherPhoneBrand></OtherPhoneBrand>\
<FamilyPhoneType></FamilyPhoneType>\
<BusinessPhoneType></BusinessPhoneType>\
<OtherPhoneType></OtherPhoneType>\
<UserNumber>{0}</UserNumber>\
</AddUserInfo>";
    var doc=getXmlDoc(xml);
    var request;
    
    for(var p in info){
        var node=doc.getElementsByTagName(p);
        if(node && node[0]){
            if(document.all){
                node[0].text=info[p];
            }else{
                node[0].textContent=info[p];
            }
        }
    }
    if(document.all){
        request=doc.xml;
    }else{
        request=getXMLTest(doc);
    }    
    request=request.format(top.$User.getUid());
    function successHandler(doc){
        var result={};
        var info = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactsaved;

        if(callback){
            callback(result);
        }
    }

 $RM.call("AddUserInfo", request, function(a){
            successHandler(a);
        }, { error: function(){ alert("连接失败"); } });
}

//修改个人资料 全量保存
//[FIXED] Todo
Contacts.ModUserInfo=function(info,callback){
    if(info.name){
        info.AddrFirstName=info.name;
        info.AddrSecondName="";
    }
    var xml="<ModUserInfo><SourceType>2</SourceType>\
<AddrFirstName></AddrFirstName>\
<AddrSecondName></AddrSecondName>\
<AddrNickName></AddrNickName>\
<FavoWord></FavoWord>\
<UserSex>0</UserSex>\
<CountryCode></CountryCode>\
<ProvCode></ProvCode>\
<AreaCode></AreaCode>\
<CityCode></CityCode>\
<StreetCode></StreetCode>\
<ZipCode></ZipCode>\
<HomeAddress></HomeAddress>\
<MobilePhoneType>0</MobilePhoneType>\
<BirDay></BirDay>\
<MobilePhone></MobilePhone>\
<BusinessMobile></BusinessMobile>\
<BusinessPhone></BusinessPhone>\
<FamilyPhone></FamilyPhone>\
<BusinessFax></BusinessFax>\
<FamilyFax></FamilyFax>\
<OtherPhone></OtherPhone>\
<OtherMobilePhone></OtherMobilePhone>\
<OtherFax></OtherFax>\
<FamilyEmail></FamilyEmail>\
<BusinessEmail></BusinessEmail>\
<OtherEmail></OtherEmail>\
<PersonalWeb></PersonalWeb>\
<CompanyWeb></CompanyWeb>\
<OtherWeb></OtherWeb>\
<OICQ></OICQ>\
<MSN></MSN>\
<OtherIm></OtherIm>\
<CPCountryCode></CPCountryCode>\
<CPProvCode></CPProvCode>\
<CPAreaCode></CPAreaCode>\
<CPCityCode></CPCityCode>\
<CPStreetCode></CPStreetCode>\
<CPZipCode></CPZipCode>\
<CPAddress></CPAddress>\
<CPName></CPName>\
<CPDepartName></CPDepartName>\
<Memo></Memo>\
<FirstNameword></FirstNameword>\
<StartCode></StartCode>\
<BloodCode></BloodCode>\
<StateCode></StateCode>\
<ImageUrl></ImageUrl>\
<SchoolName></SchoolName>\
<BokeUrl></BokeUrl>\
<UserJob></UserJob>\
<FamilyPhoneBrand></FamilyPhoneBrand>\
<BusinessPhoneBrand></BusinessPhoneBrand>\
<OtherPhoneBrand></OtherPhoneBrand>\
<FamilyPhoneType></FamilyPhoneType>\
<BusinessPhoneType></BusinessPhoneType>\
<OtherPhoneType></OtherPhoneType>\
</ModUserInfo>";
    var doc=getXmlDoc(xml), request;
    
    for(var p in info){
        var node=doc.getElementsByTagName(p);
        if(node && node[0]){
            if(document.all){
                node[0].text=info[p];
            }else{
                node[0].textContent=info[p];
            }
        }
    }
    if(document.all){
        request=doc.xml;
    }else{
        request=getXMLTest(doc);
    }
    function successHandler(doc){
        var result={};
        var info = doc.responseData;
        result.success=true;
        result.msg= YIBUMSG.contactsaved;

        if(callback){
            callback(result);
        }
    }

    $RM.call("ModUserInfo", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url:Contacts.addrInterfaceUrl("ModUserInfo"),
    //     callback:callback,
    //     request:request,
    //     successHandler:successHandler
    // });
}

//保存个人资料 --增量保存字段xmlRequest 
//[FIXED] Todo
Contacts.ModUserInfoIncrement = function(xmlRequest,callback){
	function successHandler(doc){
		var result={};
        var info = doc.responseData;
			result.success=true;
			result.msg= YIBUMSG.contactsaved;
		if(callback){
			callback(result);
		}
    }
    $RM.call("ModUserInfo", xmlRequest, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url:Contacts.addrInterfaceUrl("ModUserInfo"),
    //     callback:callback,
    //     request:xmlRequest,
    //     successHandler:successHandler
    // });
}

/**
 * 单组合并联系人。
 * @param {String } serialId 必选参数，包含需求合并的原有联系人，逗号分隔 2346555,65688899。
 * @param {String} info 必选参数，合并后，新生成的目标联系人。
 * @param {Function} callback 可选参数，成功的回调。
 * @return void
 */
Contacts.MergeContacts = function(serialId,info,callback){
    serialId = serialId.toString();
    info.AddrFirstName=info.name;
    var addContactsXML="";

    //防止imageurl带有?, 后台会检测xxs, 需要重置ImageUrl,
    if(info.ImageUrl && info.ImageUrl.indexOf('?') > -1){
        info.ImageUrl = info.ImageUrl.substring(0, info.ImageUrl.indexOf('?'));
    }

    for(var i=0;i<ContactsInfoProperties.length;i++){
        var p=ContactsInfoProperties[i];
        if(CIPManger[p]){
            addContactsXML+=CIPManger[p]({info:info,isAdd:true,value:info[p],propertyName:p});
        }else{
            addContactsXML+=CIPManger.Default({info:info,isAdd:true,value:info[p],propertyName:p});
        }
    }
	var request="<MergeContacts><SerialId>{0}</SerialId><AddContacts>{1}</AddContacts><UserNumber>{2}</UserNumber></MergeContacts>";
	if(Contacts.FilterVip(serialId.split(",")).length > 0 && !info.GroupId){ //存在vip联系人且没有存在组请求数据里加上VIP组id ,有组的情况下，在CIPManger能添加VIP组id
		
		request="<MergeContacts><SerialId>{0}</SerialId><AddContacts>{1}<GroupId>{2}</GroupId><UserNumber>{3}</AddContacts></MergeContacts>";
		request=request.format(serialId.toString(),addContactsXML,Contacts.data.vip.groupId,top.$User.getUid());
	}else{
		request=request.format(serialId.toString(),addContactsXML,top.$User.getUid());
	}
	
	if(Contacts.FilterVip(serialId.split(",")).length > 0 && info.GroupId && !Contacts.IsVipUser(info.SerialId)){
		request = request.replace("</GroupId>", "," + Contacts.data.vip.groupId + "</GroupId>");
	}

    var successHandler = function(doc) {
        var msgMap = {
            "0"    : YIBUMSG.contactsaved,
            "85"   : YIBUMSG.error_birthdayIllegal,
            "12820": YIBUMSG.error_fMobileIllegal,
            "12821": YIBUMSG.error_bMobileIllegal,
            "12823": YIBUMSG.error_fEmailIllegal,
            "12824": YIBUMSG.error_bEmailIllegal,
            "12826": YIBUMSG.error_fPhoneIllegal,
            "12827": YIBUMSG.error_bPhoneIllegal,
            "12828": YIBUMSG.error_fPhoneIllegal, //otherphone，常用固话
            "12829": YIBUMSG.error_faxIllegal,   //familyfax,家庭传真
            "12830": YIBUMSG.error_faxIllegal,   //businessfax,公司传真
            "12833": YIBUMSG.error_fetionIllegal,
            "12834": YIBUMSG.error_bZipCode,
            "12835": YIBUMSG.error_oicqIllegal,
            "2072": YIBUMSG.systemUpdateing
        };

        var dataMap = {
            "85"   : info["BirDay"],
            "12820": info["MobilePhone"],
            "12821": info["BusinessMobile"],
            "12823": info["FamilyEmail"],
            "12824": info["BusinessEmail"],
            "12826": info["OtherPhone"],
            "12827": info["BusinessPhone"],
            "12828": info["OtherPhone"],
            "12829": info["FamilyFax"],
            "12830": info["BusinessFax"],
            "12833": info["OtherIm"],
            "12834": info["CPZipCode"],
            "12835": info["OICQ"]
        }

        var obj = doc.responseData;
        var _code = obj.ResultCode;

        var result = {};
        result.success = false;
        result.msg = msgMap[_code];
        result.extMsg = YIBUMSG.error_editField; //取消“立即修改”，仅需屏蔽这一行代码
        result.field = dataMap[_code]; //将错误的内容查询出来

        

        if (obj.ContactsInfo) {
            var contactInfo = obj.ContactsInfo && obj.ContactsInfo[0];
            info.SerialId = contactInfo.SerialId;
            info.AddGroupId = contactInfo.GroupId;
            Contacts.updateCache("MergeContacts",{serialId:serialId,info:info});
        }

        if (_code == "0") {
            result.success = true;
        }
        
        if (callback) {
            callback(result);
        }
                
    };

    $RM.call("MergeContacts", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
}

//[FIXED]
Contacts.AutoMergeContacts=function(callback, type){

    //下发合并信息邮件
    var oninfolosted = function(contacts) {
        var f = function(obj, _buff) {
            for(prop in obj) {
                var attr = obj[prop];
                if (attr && typeof(attr)=='string' && attr.length>0 && attr.trim().length>0 && prop!='SerialId'){
                    _buff.push("\r\n");
                    _buff.push(attr);
                }
            }
            _buff.push("\r\n");
        };

        var m = contacts.length, c=contacts, buff=[];
        while(m--)f(c[m], buff);

        var data = {
            "userName": top.trueName || top.uid,
            "message": buff.join(''),
            "mergerTime": (new Date()).format("yyyy年MM月dd日 hh:mm")
        };

        top.WaitPannel.show();
        top.$RM.call("mail:systemCutMessage", data, function() {
            top.WaitPannel.hide();
            FF.alert(YIBUMSG.memooverlimit);
        });
    };

    //提交自动合并请求后
    var oncommited = function(){
        var timer = false, limitTimer=false, TIMEOUTLIMIT = 180000,
            url = top.Contacts.apiurl("QueryMergeResult");

            //开始不断查询某个接口的状态
        var _rep = function (_limitTimer){
            jslog("开始执行周期性查询合并结果时，收到的总超时计时器=" + _limitTimer);
            
            function successHandler(R){
                    var D = getXmlDoc(R);
                    var O = R.responseData;
                    jslog("查询合并结果页时，总超时计时器=" + _limitTimer);
                    onquerying(O, timer, _limitTimer);
            }
            var request="<QueryMergeResult><UserNumber>{0}</UserNumber></QueryMergeResult>".format($User.getUid());
            top.Contacts.isLoading=false;
            $RM.call("QueryMergeResult", request, function(a){
				successHandler(a);
            }, { error: function(){ alert("连接失败"); } });
         
            var delay = Math.floor(Math.random()*8500)+1500;
            timer = setTimeout(function(){_rep(_limitTimer);}, delay);
            jslog("run once more " + delay + " ms latter...");
        };
        limitTimer = setTimeout(function(){
            if (timer){
                clearTimeout(timer);
                top.M139.UI.TipMessage.hide();
                timer = false;
                jslog("超时" + TIMEOUTLIMIT + "结束");
            }
        }, TIMEOUTLIMIT);
        jslog("提交自动合并请求时，总超时计时器=" + limitTimer);
        _rep(limitTimer);
    };

    //正在查询结果接口
    var onquerying = function(rs, timer, limittimer){
        jslog(rs);
        jslog("查询合并结果返回时，收到的总超时计时器=" + limittimer);
        //成功
        if (rs.ResultCode=="0"){
            clearTimeout(timer);
            clearTimeout(limittimer);
            top.M139.UI.TipMessage.hide();
            var overcount = 0;
            if (rs.ContactsInfo && rs.ContactsInfo.length > 0){
                //还有其他数据，即需要发信通知用户。
                overcount = rs.ContactsInfo.length;
                setTimeout(function(){oninfolosted(rs.ContactsInfo)},0);
            }
            if (callback) {
                callback({success:true, msg:YIBUMSG.contactsaved, overflow:overcount,SuccNumber:rs.SuccNumber});
            }

        } else if (rs.ResultCode == "27"){
            //处理中
            return ;
        }
    };  
        type = type ? type : '';
    var request = '<AutoMergeContacts><UserNumber>{0}</UserNumber><Type>{1}</Type></AutoMergeContacts>';
        request = request.format(top.$User.getUid(), type);

	$RM.call("AutoMergeContacts",  request, function(a) {

            var rs = a.responseData;
            var rc = parseInt(rs.ResultCode);   
            switch(rc) {
                case 0:
                    top.M139.UI.TipMessage.show('正在合并……', {});
                    oncommited();
                    break;
                case 26:
                    FF.alert(YIBUMSG.sysbusy);
                    break;
                case 27:
                    FF.alert(YIBUMSG.merging);
                    break;
                default:
                    FF.alert(YIBUMSG.fail_commitmerge);
            }
    }, { error: function(){ FF.alert("连接失败"); } });
};


Contacts.getAddrConfig = function(callback) {
    if (callback) callback({ success: false, msg: "该接口不再支持" });
};


Contacts.DeleteLastContactsInfo = function(param, callback) {
    var request = "<DelLastContacts><UserNumber>"+top.$User.getUid()+"</UserNumber><SerialId>{0}</SerialId>\
    <Mobile>{1}</Mobile>\
    <Fax>{2}</Fax>\
    <Email>{3}</Email>\
    <Type>{4}</Type><LastId>{5}</LastId></DelLastContacts>";

    $(["mobile", "fax", "email"]).each(function() {
        var p = this.toString();
        var value = param[p];
        if (!value) {
            param[p] = "";
        } else if (typeof (value) == "string") {
            param[p] = checkData(p, value) ? value : "";
        } else {
            for (var i = 0; i < value.length; i++) {
                if (!checkData(p, value[i])) {
                    value.splice(i, 1);
                    i--;
                }
            }
            param[p] = value.join(",");
        }
    });
    function checkData(type, addr) {
        if (type == "email") {
		var addrLen = addr.length;
		if(addrLen >=6 && addrLen <= 90){
			return top.Validate.test("email", addr);
		}else{
			return false;
		}
	    
        } else {
            return /^\d+$/.test(addr);
        }
    }
    param.serialId = param.serialId || "";
    request = request.format(param.serialId, param.mobile, param.fax, param.email, param.type, param.lastId);
    function successHandler(doc) {
        var result = {};
        var info = doc.responseData || {};
        result.success = true;
        result.msg = YIBUMSG.contactdeleted;

        Contacts.updateCache("DeleteLastContacts",{serialId:param.serialId,info:param});

        if (callback) {
            callback(result);
        }
    }
    $RM.call("DelLastContacts", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });

};


//[FIXED]
Contacts.EmptyLastContactsInfo = function(param, callback) {
    var request = "<DelLCContacts><UserNumber>"
        + top.$User.getUid() + "</UserNumber><Type>" + param.type + "</Type></DelLCContacts>";

    function successHandler(doc) {
        var result = {};
        var info = doc.responseData || {};
        result.success = true;
        result.msg = YIBUMSG.contactdeleted;

        Contacts.updateCache("DelLCContacts", param.type == 'close');

        if (callback) {
            callback(result);
        }
    }
    $RM.call("DelLCContacts", request, function(a){
            successHandler(a);
    }, {
        error: function () {
            //$Msg.alert("连接失败"); 
        }
    });
};
//[FIXED] Todo
Contacts.getWhoAddMePageData = function(callback, page, record) {    
    var _this = this;
    var request = '<WhoAddMeByPage Page="{0}" Record="{1}" Relation="{3}"><UserNumber>{2}</UserNumber></WhoAddMeByPage>'.format(page,record,top.$User.getUid(), 0);
    $RM.call("WhoAddMeByPage", request, onsuccess, { error: onerror });

    function onsuccess(response){
        var info = response.responseData;
        var result = {};
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.list = info.UserInfo;
        result.total = info.TotalRecord;

        //fix: 刚加载通讯录首页完，就快速跳进子页面，回调到这处已释放的代码时，不处理。
        try {
            callback(result);
        } catch(e) {
        }
    }
    function onerror(){
        _this.onconnectionfail();
    }
};
//[FIXED] Todo
Contacts.getWhoAddMeData = function(callback) {
    var request = "<WhoAddMe><UserNumber>{0}</UserNumber></WhoAddMe>".format(top.$User.getUid());
    var result = {};
    function successHandler(doc) {
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.list = info.UserInfo;
        result.total = info.TotalRecord;
        if (callback) callback(result);
    }
    $RM.call("WhoAddMe", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
};

//[FIXED]
Contacts.getWhoWantAddMeData = function(callback) {
    var request = "<WhoWantAddMe><UserNumber>{0}</UserNumber></WhoWantAddMe>".format(top.$User.getUid());
    var result = {};
    function successHandler(doc) {
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.list = info.UserInfo;
        if (callback) callback(result);
    }
    $RM.call("WhoWantAddMe", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
};

/**
*一键添加可能认识的人
*/
Contacts.OneKeyAddWAM = function(request, callback){
    $RM.call("OneKeyAddWAM", request, function(rs){
        callback(rs);
    }, { error: function(){ alert("连接失败"); } });
};

/**
*一键添加可能认识的分组接口
*/
Contacts.WMAGroupList = function(request,callback){
    $RM.call("WMAGroupList", request, function(rs){
        callback(rs);
    }, { error: function(){ alert("连接失败"); } });
};


//获取待更新人数
Contacts.getUpdatedContactsNumData = function(callback) {
    var request = "<GetUpdatedContactsNum><UserNumber>{0}</UserNumber></GetUpdatedContactsNum>".format($User.getUid());

    var _this = this;

    $RM.call("GetUpdatedContactsNum", request, function(doc){
        var info = doc.responseData;

        //fix: 刚加载通讯录首页完，就快速跳进子页面，回调到这处已释放的代码时，不处理。
        try {
            callback(info);
        } catch(e) {
        }

    }, { error: function(){
        _this.onconnectionfail();
    } });

};

//获取用户隐私设置信息
//Todo
Contacts.execGetPrivacySettings = function(params){
	var request = params.requestData;
	var callback = params.callback;
	function successHandler(json) {
        try {
            callback(json);
        } catch(e) {
        }
    }
	function error (xhr){
	    ScriptErrorLog.addLog&&ScriptErrorLog.addLog("获取用户隐私 error", xhr);
	}
	
	if (Utils.isRelease&&Utils.isRelease("addr_apisvr_v3")) {

        AddrCrossAjax(Contacts.apiurl("GetPrivacySettings"), request, successHandler, error);
        return;
    }

    Contacts.ajax({
		url:Contacts.apiurl("GetPrivacySettings"),
		data:request,
        success: successHandler,
        error: error
    });
     
}

//用户隐私设置
//Todo
Contacts.execSavePrivacySettings = function(params){
	var request = params.requestData;
	var callback = params.callback;
	function successHandler(json) {
        try {            
            callback(json);            
        } catch(e) {
            return;
        }
    }
	function error (xhr){
	    ScriptErrorLog.addLog("设置用户隐私 error",xhr);
	}
	
	if (Utils.isRelease&&Utils.isRelease("addr_apisvr_v3")) {
        AddrCrossAjax(Contacts.apiurl("SavePrivacySettings"), request, successHandler, error);
        return;
    }

    Contacts.ajax({
		url:Contacts.apiurl("SavePrivacySettings"),
		data:request,
        success: successHandler,
        error: error
    });
}

/**
 * 发信成功页自动保存联系人与记录最近联系人。
 * @param {Array } contacts 必选参数，包含主送、抄送、密送的所有收件人的逗号隔开数组行 1@a.c, 2@a.c。
 * @param {String} from 必选参数，E、E1之类的来源标识 详见FROMTYPE枚举。
 * @param {Object} panel 必选参数，生成已保存联系人列表的DOM对象。
 * @param {String} subject 必选参数，刚才发送的邮件的标题。
 * @return void
 */
Contacts.AutoSaveRecentContacts = function(contacts, from, panel, subject) {

    if (!contacts || contacts.length==0 || !from || !panel || !subject ) {
        ScriptErrorLog.addLog("param:{0},param.ComeFrom:{1},param.AddrContent:{2},param.AddrTitle:{3}".format(
            contacts, from, panel, subject));
        jslog("自动保存联系人函数接收参数异常" + contacts + from + panel + subject);
        return;
    }

    var _FT = Contacts.FROMTYPE;
    if (isNaN(from)){
        jslog("自动保存联系人来源类型异常" + from);
        throw "传入参数 from 类型错误!";
    }


    var fromObj = Contacts.ConvertFrom(from);
    if (fromObj.type == _FT.EMAIL && subject.length > 20) {
        jslog("自动保存联系人：邮件标题超长，已截取20字|" + subject);
        subject = subject.substring(0, 20);
    }

    //根据不同的信息读取现有联系人数据
    var _keys = {};
    _keys['E'] = function(addr){return Contacts.getContactsByEmail(addr)[0]};
    _keys['M'] = function(addr){return Contacts.getContactsByMobile(addr)[0]};
    _keys['F'] = function(addr){return Contacts.getContactsByFax(addr)[0]};
 
    var _item = {
        SerialId: 0,
        AddrName: '',
        AddrType: fromObj.key,
        AddrContent: '',
        AddrMobile: "",
        AddrId: 0,
        AddrTitle: encodeXML(subject),
        ComeFrom: fromObj.last
    };

    //保存最近联系人报文模板
    var _itemTemplate = [
        '<AddContactsInfo>',
            '<SerialId>{SerialId}</SerialId>',
            '<AddrName>{AddrName}</AddrName>',
            '<AddrType>{AddrType}</AddrType>',
            '<AddrContent>{AddrContent}</AddrContent>',
            '<AddrMobile>{AddrMobile}</AddrMobile>',  //注意添加最近联系人原定报文并无此节，需在服务端做兼容处理
            '<AddrId>0</AddrId>',
            '<AddrTitle>{AddrTitle}</AddrTitle>',
            '<ComeFrom>{ComeFrom}</ComeFrom>',
        '</AddContactsInfo>' ].join('');

    //已保存联系人列表模板
    var _listTemplate = [
        '<div style="margin:0pt;padding:0pt;position:static;" class="successContent">',
            '<fieldset style="margin:0;width:560px" id="fsSaveToAddr">',
            '<p><i></i>以下联系人已保存到通讯录</p>',
            '<ol>$rows$</ol>',
            '</fieldset>',
        '</div>'].join('');

    var _rowTemplate = Contacts._autosaveRowTemplate;

    var waiting = function(_p){
        _p.innerHTML = '<center><div class="loadings"><img src="'+top.rmResourcePath+'/images/loading2.gif" />&nbsp;正在保存联系人...</div></center>';
    };

    var _buff = [], _stranger = [], sole = {};
    if (fromObj.type == _FT.MAIL) {
        
        //兼容旧项目只传单个email
        if (typeof contacts == "string") {
            contacts = Utils.parseEmail(contacts);
        }

        //当收件人有多个重复时['a@b.c', '"路人甲"<a@b.c>', '"a"<a@b.c>']将去掉重复的
        //过滤出有效的唯一的电邮地址，并转成contactinfo实例

        for (var i = contacts.length - 1, k=contacts[i]; i >= 0; k=contacts[--i]){
            var eml = Utils.parseSingleEmail(k);
            if (eml && sole[eml.addr] === undefined){
                _buff.push(eml);
                sole[eml.addr] = eml;
            }
        }
        contacts = _buff;
        _buff=[];
        sole = [];

        
        
        //检测给的联系人是否已保存，否则将serialid置零。
        for (var i = contacts.length - 1, k=contacts[i]; i >= 0; k=contacts[--i]){
            var c = _keys[fromObj.key](k.addr);

            if (c) {
                _item.SerialId = c.SerialId;
                _item.AddrName = encodeXML(c.name);
                _item.AddrContent = encodeXML(k.addr);

                if (c.mobiles.length!=0 ){
                    if (c.OtherMobilePhone){
                        _item.AddrMobile = c.OtherMobilePhone;
                    }
                    if (c.BusinessMobile){
                        _item.AddrMobile = c.BusinessMobile;
                    }
                    if (c.MobilePhone){
                        _item.AddrMobile = c.MobilePhone;
                    }
                } else {
                    var __mobile = M139.Text.Mobile.getNumber(k.addr);
                    if (M139.Text.Mobile.isChinaMobile(__mobile)) {
                        _item.AddrMobile = __mobile;
                    }
                }
            } else {
                _item.SerialId = 0;
                _item.AddrName = encodeXML(k.name);
                _item.AddrContent = encodeXML(k.addr);

                _item.AddrMobile = "";
                var __mobile = M139.Text.Mobile.getNumber(k.addr);
                if (M139.Text.Mobile.isChinaMobile(__mobile)) {
                    var sameMobile = Contacts.getContactsByMobile(__mobile);
                    if (sameMobile.length == 0){
                        _item.AddrMobile = __mobile;  //该处修正手机号已存在通讯录时无法保存的情况。
                    }
                }

                var temp = {};
                for(var j in _item) temp[j] = _item[j];

               _stranger.push(temp);
            }

            sole.push({
                AddrContent: _item.AddrContent,
                AddrName: _item.AddrName,
                AddrType: _item.AddrType,
                SerialId: _item.SerialId
            });
            _buff.push(String.format(_itemTemplate, _item));
        };

        //没有陌生地址
        if (_stranger.length == 0){
            //只加最近联系人，不自动保存联系人。
        } else {
            waiting(panel);
        }

    } else if (fromObj.type == _FT.MOBILE) {
        if (typeof contacts == "string") {
            contacts = contacts.split(",");
        }

        sole = [];
        for (var i = contacts.length - 1, k=contacts[i]; i >= 0; k=contacts[--i]){
            k = $Mobile.remove86(k);
            var c = _keys[fromObj.key](k);
            _item.AddrName = encodeXML(k);
            _item.AddrMobile = k;
            _item.AddrContent = k;
            _item.AddrType = _item.AddrType;
            if (c) {
                _item.SerialId = c.SerialId;
            } else {
                _item.SerialId = 0;
                var temp = {};
                for(var j in _item) temp[j] = _item[j];
               _stranger.push(temp);
            }
            _buff.push(String.format(_itemTemplate, _item));
            sole.push({
                AddrContent: _item.AddrContent,
                AddrName: _item.AddrName,
                AddrType: _item.AddrType,
                SerialId: _item.SerialId
            });
        };

        //没有陌生地址
        if (_stranger.length == 0){
            //只加最近联系人，不自动保存联系人。
        } else {
            panel.mobiles = contacts;
            waiting(panel);
        }
    }

    _buff = "<AddLastContacts>" + _buff.join("\n") + "</AddLastContacts>";
    jslog("自动保存联系人：拼装请求报文：\n" + _buff);

    var requestUrl = Contacts.getAutoSaveRecentContactsUrl();
    jslog("自动保存联系人：取得接口url:" + requestUrl);

    var onError = function(errCode){
        var ERR_CONTACT_OVERLIMIT="21";
		var ERR_CONTACT_REACHLIMIT="24";
		var msg = "保存联系人失败。";
        switch(errCode){
            case ERR_CONTACT_OVERLIMIT: msg = frameworkMessage['error_contactOverlimit']; break;
            case ERR_CONTACT_REACHLIMIT : msg = frameworkMessage['error_contactReachlimit']; break;
        }
        $(panel).html('<div class="loadings">自动'+msg+'</div>');
    };

    var onCalled = function(response) {
        if (doc) {
            var obj = response.responseData;
			if (obj && obj.ResultCode == "0") {
                _stranger = obj.ContactsInfo;

                var cache = [], buff=[], last=[];
                for(var i=0; i<_stranger.length; i++) {
                    var __item = _stranger[i];
                    __item.from = fromObj.from;
                    if (_stranger[i].FamilyEmail.length==0 && _stranger[i].MobilePhone.length>0){
                        __item.MobilePhone2=_stranger[i].MobilePhone;
                    } else {
                        __item.MobilePhone2="";
                    }

                    __item.AddrFirstName = Utils.htmlEncode(_stranger[i].AddrFirstName);
                    cache.push("<li>"+String.format(_rowTemplate, __item)+"</li>");

                    __item.name = _stranger[i].AddrFirstName;
                    __item.mobile = _stranger[i].MobilePhone;
                    __item.email = _stranger[i].FamilyEmail;
                    buff.push(__item);
                    last.push({
                        AddrContent: fromObj.type==Contacts.FROMTYPE.MAIL?
                            _stranger[i].FamilyEmail : _stranger[i].MobilePhone,
                        AddrName:_stranger[i].AddrFirstName,
                        AddrType:fromObj.key,
                        SerialId:_stranger[i].SerialId
                    });
                }

                if (_stranger.length > 1){
                    Contacts.loadMainData(function() {Contacts.onchange()});
                } else if (buff.length>0) {
                    Contacts.addContactsToCacheExec(buff[0], obj);
                }

                if (_stranger.length > 0) {
                    cache = _listTemplate.replace("$rows$", cache.join(''));
                    $(panel).html(cache);
                } else {
					last = [].concat(sole);
				}

                Contacts.addLastestContactsToCache(last);
                Contacts.init("email", top);
            } else {
                onError(obj.ResultCode);
            }
        }
    }
	$RM.call(requestUrl, _buff, function(doc){
        var info = doc.responseData;

        //fix: 刚加载通讯录首页完，就快速跳进子页面，回调到这处已释放的代码时，不处理。
        try {
            onCalled(info);
        } catch(e) {
            return;
        }

    }, { error: function(){
        onError();
    } });
}

/***
* 发信成功页 手动保存联系人页面
*/
Contacts.execCreateAddContactsPage = function(param){
	if (param.type == "email") {
        var emails = param.emails;
        if (typeof emails == "string") {
            emails = Utils.parseEmail(emails);
        }
        param.container.emails = emails;
        for (var i = 0; i < emails.length; i++) {
            if (Contacts.isExistEmail(emails[i].addr)) {
                emails.splice(i, 1);
                i--;
            }
        }
        if (emails.length == 0) return; //没有陌生地址

        var url = top.wmsvrPath2+"/addsendcontacts.htm#type=email";
        var htmlCode = "<iframe id='saveStrangerFrame' onload='this.contentWindow.$(\"input:text:eq(0)\").focus()' frameBorder='0' style='width:607px;display:none' scroll='no' src='{0}'></iframe>".format(url);
        $(param.container).html(htmlCode);
    } else if (param.type == "mobile") {
        if (typeof param.mobiles == "string") param.mobiles = param.mobiles.split(",");
        var mobiles = param.container.mobiles = param.mobiles;
        for (var i = 0; i < mobiles.length; i++) {
            if (Contacts.isExistMobile(mobiles[i])) {
                mobiles.splice(i, 1);
                i--;
            }
        }
        if (mobiles.length == 0) return;

        var url = top.wmsvrPath2+"/addsendcontacts.htm#type=mobile";
        var htmlCode = "<iframe onload='this.contentWindow.$(\"input:text:eq(0)\").focus()' frameBorder='0' style='width:607px;display:none' scroll='no' src='{0}'></iframe>".format(url);
        $(param.container).html(htmlCode);
    }
}

/**
 * 发信成功页删除联系人。
 * @param {String} serialId 必选参数，联系人ID。
 * @return void
 */
Contacts.execDelSavedContact = function(serialId, lst, ext){
    FF.confirm(frameworkMessage.delContactEventConfirm,function PressYes(){
        top.addBehavior("自动保存联系人-删除", ext);
        var index = -1;
        lst.each(function(i){
             if(this.innerHTML.indexOf('del('+serialId) > -1){
                 index = i;return false;
             }
            return true;
        });
        Contacts.deleteContacts(serialId.toString(), function(){
            var div = $(lst[index]).next()[0];
            if (div && div.tagName=='DIV'){$(lst[index]).next().remove()};
            $(lst[index]).remove();
        });
    });
}

/**
 * 发信成功页修改联系人。
 * @param {String} serialId 必选参数，联系人ID。
 * @param {String} mobile 必选参数，修改后的手机号。
 * @param {String} name 必选参数，修改后的姓名。
 * @param {Object} lnk 必选参数，”修改“字样的A标签。
 * @param {Object} lstGroup 必选参数，组列表所在的UL标签。
 * @return void
 */
Contacts.execModSavedContact = function(serialId, mobile, name, lnk, pnl){
    pnl.isbusy = false;
    if (lnk.innerHTML == "取消修改"){
        try {
            lnk.innerHTML = "修改";
        }catch(ex){
            lnk.innerText = "修改";
        }
        lnk.hide();
        return;
    }

    var _email = lnk.parentNode.getElementsByTagName('SPAN')[0].innerHTML;
    var _main = pnl.main.clone(true);

    //todo: 这块生成联系人组列表，性能不佳待改进。
    function initGroups(_serialId,lst){
        try{
            var groups = window.top.Contacts.data.groups;

            //取到该联系人所有关系。
            var relations = "," + top.M2012.Contacts.getModel().getContactsGroupId(_serialId).join(",");

            function hasGroup(gid){
                return relations.indexOf(","+gid+",")>-1;
            };

            var groupObj = lst;
            if(groupObj && groups && groups.length > 0) {
                //var htmlCode = "<li><label for=\"Chk_0\"><input type=\"checkbox\" value=\"-1\" id=\"Chk_0\" checked=\"checked\">未分组<span>(默认保存到此分组)</span><\/label><\/li>";
                var htmlCode = "<li><span>默认保存到“未分组”</span><\/li>"
                for(var i = 0; i < groups.length; i++){
                    htmlCode += "<li><label for='Chk_" + groups[i].GroupId + "'>";
                    htmlCode += "<input id='Chk_" + groups[i].GroupId + "' value='"
                     + groups[i].GroupId + "' type='checkbox' " 
                     + (hasGroup(groups[i].GroupId)?"checked=checked":"") + " />"
                     + Utils.htmlEncode(groups[i].GroupName) + "</label></li>";
                }
                lst.html(htmlCode);
            }
        }catch(e){}
    }

    function GetGroupId(lstGroup){
        var groupId = "";
        contactsGroups = window.top.Contacts.data.groups;
        if(contactsGroups) {
            lstGroup = lstGroup[0].getElementsByTagName('INPUT');
            for (var i = lstGroup.length - 1, k=lstGroup[i]; i >= 0; k=lstGroup[--i]){
                if (k.checked) groupId += "," + k.value; 
            }
            if(groupId.length > 0)groupId=groupId.substring(1);
        }
        return groupId;
    }

    function SaveContact(groupId){
        if (pnl.isbusy) return;
        pnl.isbusy = true;
        var name=_main.name.val(),
            email=_main.email.val(),
            newGroup=_main.ngName.val();
		var mobile = _main.mobile.val();
			mobile = mobile.replace(/-/g,"");//替换掉手机号中输入的--
        var requestBody=
            "<ModContacts>" +
                "<SerialId>" + serialId + "</SerialId>" +
                "<UserType>1</UserType>" +
                "<AddrFirstName>" + encodeXML(name) + "</AddrFirstName>" +
                "<MobilePhone>" + encodeXML(mobile) + "</MobilePhone>" +
                "<FamilyEmail>" + encodeXML(email) + "</FamilyEmail>" +
                (groupId.length>0?"<GroupId>" + groupId + "</GroupId>":"") +
                "<OverWrite>1</OverWrite>"+
            "</ModContacts>";
		
        jslog('组装修改联系人报文：'+requestBody)
        var requestUrl = Contacts.addrInterfaceUrl("ModContacts");
        jslog(requestUrl);

        Contacts.ajax({
            url: requestUrl,
            type: "post",
            data: { xml: requestBody },
            success: function(response) {
                jslog('修改联系人返回：'+response)
                var doc = getXmlDoc(response);
                if (doc) {
                    var result = xml2json(doc.documentElement, {ModContactsResp: {type: "rich",arrayElement: 'ContactsInfo'}, ContactsInfo:{type:"rich"}});
                    if (result && (result.ResultCode == "0")) {
                        pnl.isbusy = false;
                        top.WaitPannel.hide();

                        //记录修改联系人的组信息。
                        $('table input :checkbox:checked').each(function(){
                            if ($(this).parent()[0].tagName != "TH") {
                                $(this).parent().parent().remove();
                            }
                        });
                        var par = { info: {
                            FamilyEmail: email,
                            AddrFirstName: Utils.htmlEncode(name),
                            SerialId: serialId,
                            FirstNameword: result.ContactsInfo[0].FirstNameword,
                            FullNameword: result.ContactsInfo[0].FullNameword,
                            FirstWord: result.ContactsInfo[0].FirstWord,
                            MobilePhone: Utils.htmlEncode(mobile),
                            MobilePhone2:"",
                            GroupId: groupId,
                            from: lnk.ext
                        }};
                        jslog("修改成功的联系人");
                        jslog(par);

                        //提示成功
                        top.FloatingFrame.alert(frameworkMessage.modContactSuccess);

                        //刷新UI
                        if (email.length==0){
                            par.info.MobilePhone2=mobile;
                        }
                        var _rowTemplate = Contacts._autosaveRowTemplate;
                        var _html = String.format(_rowTemplate, par.info);

                        //避免 名字中带 ' 时出错
                        if (name.indexOf("'")>-1){
                            _html = _html.replace("'" + par.info.AddrFirstName + "',this,pnl)", "'" + par.info.AddrFirstName.replace(/(&#39;)|\'/g, "\\'") + "',this,pnl)");
                        }
                        if (mobile.indexOf("'")>-1){
                            _html = _html.replace( ",'"+par.info.MobilePhone+"',", ",'" + par.info.MobilePhone.replace(/(&#39;)|\'/g, "\\'") + "',");
                        }
                        $(lnk.parentNode).html(_html);
                        lnk.hide();

                        //前面有转义，在插入缓存时，要用未转义的
                        par.info.AddrFirstName = name;
                        Contacts.updateCache('EditContactsDetails',par);

                    } else {
						top.WaitPannel.hide();
                        FF.alert(frameworkMessage.modContactError);
                    }
                }
            },
            error: function() {
                pnl.isbusy = false;
                top.WaitPannel.hide();
                FF.alert(frameworkMessage.modContactError);
            }
        });

    }

    _main.html(pnl.mainHTML);
    var _lblName = _main[0].getElementsByTagName('P')[0];
    _lblName.innerHTML += "："+ Utils.htmlEncode(name);
    _main.insertAfter($(lnk.parentNode));
    _main.show();

    _main.name = _main.find("#txtName");
    _main.email = _main.find("#txtEmail");
    _main.mobile = _main.find("#txtMobile");
    _main.ngName = _main.find("#NewGroupName");
    _main.ngChk = _main.find("#chkNew");
    _main.group = _main.find("#GroupsContainer");

    //如果_email为空的话，只有可能发生在手机相关的发送成功页。(缺陷[fixed]：填写了电邮保存后再点开就变成电邮不可更改了)
    //则可以据此判断：该修改发生在手机相关的发送成功页。
    //将界面上的手机号栏禁用，去掉电邮必填字样。
    if (_email.length==0 || pnl[''+serialId]){
        _main.email.removeAttr('disabled');
        var lblStar=_main.email.next();
        _main.mobile.attr('disabled','disabled');
        lblStar.insertAfter(_main.mobile);
        pnl[''+serialId] = true;
    }

    $(lnk).html("取消修改");
    _main.name.val(name);
    _main.email.val(_email);
    _main.mobile.val(mobile);
    _main.ngName.val(frameworkMessage.addGroupTitle);
    _main.ngChk.removeAttr('checked');
    initGroups(serialId, _main.group);

    lnk.hide = function () {
        _main.remove();
    };

    var tip = frameworkMessage.addGroupTitle;
    _main.ngName.focus(function(){
        if(this.value==tip){
            this.value = "";
            _main.ngChk.attr('checked','checked');
        } else {
            this.select();
        }
    });

    _main.ngName.blur(function(){
        if (this.value.length==0){
           this.value = tip;
           _main.ngChk.removeAttr('checked');
        }
    });
   _main.mobile.change(function(){ //过滤手机号码中的分隔符“-”
      $(this).val($(this).val().replace(/\D/g, ""));
    });
    _main.ngChk.change(function(){
        if (this.checked){
            _main.ngChk.select();
        }
    });

    //保存按钮
    _main.find("#btnSave").click(function() {
        var F=false,
            name=_main.name.val(),
            mobile=_main.mobile.val(),
            email=_main.email.val();

        var M = frameworkMessage;
        if (name.length==""){
            FF.alert(M["warn_contactNamenotfound"],function(){_main.name.focus()});
            return F;
        }
        if (name.getByteCount() > 100){//姓名长度与通讯录保持一致12 2012.08.29 怎么是byteCount?
            FF.alert(M["warn_contactNameToolong"],function(){_main.name.focus()});
            return F;
        }
        if (email.getByteCount() > 90){//已经在页面显示maxLenggh=90
            FF.alert(M["warn_contactEmailToolong"],function(){_main.email.focus()});
            return F;
        }
        if (email.length>0 && !MailTool.checkEmail(email)){
            FF.alert(M["warn_contactIllegalEmail"],function(){_main.email.focus()});
            return F;
        }
        if (mobile.getByteCount() > 100){
            FF.alert(M["warn_contactMobileToolong"],function(){_main.mobile.focus()});
            return F;
        }
		
		var patrn= /^\d{3,20}$/;
		if (mobile && !patrn.test(mobile.replace(/-/g,""))){ //手机号3-20位，去除中间的-号
			 FF.alert(M["warn_contactMobileError"],function(){_main.mobile.focus()});
            return F;
		}
        
		var isNewGroup = _main.ngChk.attr('checked');
        var group = $.trim(_main.ngName.val());
        top.WaitPannel.show(frameworkMessage.addContacting);
        
        if(group == "" || group==frameworkMessage.addGroupTitle){
           var groupId = GetGroupId(_main.group); 
           SaveContact(groupId);
        }else{
             var isStillGroup = true;
            if (Contacts.isExistsGroupName(group)){
                isStillGroup = false;
                FF.confirm(frameworkMessage.GroupExists, function(){
                    isStillGroup = true;
                });
            }
            if (isStillGroup){
                top.Contacts.addGroup($.trim($("#NewGroupName").val()),function(result){
                    if(result.success){
                        _main.group.append("<li><label for='Chk_" + result.groupId + "'><input id='Chk_" + result.groupId + "' value='" + result.groupId + "' type='checkbox' checked='checked' />" + Utils.htmlEncode($.trim(pnl.ngName.val())) + "</label></li>");
                        _main.gnName.val(frameworkMessage.addGroupTitle);
                        //下面写修改联系人逻辑
                        var groupId = GetGroupId(pnl.group); 
                        SaveContact(groupId);
                    }else{
                        return false;
                    }
                });
            }
        }
        }
    );
}

/**
 * 给自动保存联系人页快速添加组
 * @param {Object} btn
 * @param {Object} context
 */
Contacts.execQuickAddGroup = function(btn, context){
    var p = btn.parentNode;
    var txtGName = context.createElement('INPUT');
    var btnOk = context.createElement('A');
    var btnCancel = context.createElement('A');

    var tip = frameworkMessage.addGroupTitle;
    txtGName.value = tip;
    txtGName.maxLength=16;
    txtGName.className = "text gp def";
    
    btnOk.href = "javascript:void(0)";
    btnCancel.href = "javascript:void(0)";
    btnOk.innerHTML = "添加";
    btnCancel.innerHTML = "取消";

    txtGName.onfocus = function(){
        if(this.value==tip){
            this.value = "";
            this.className = "text gp";
        } else {
            this.select();
        }
    };
    txtGName.onblur = function(){
        if (this.value.length==0){
           this.value = tip;
           this.className = "text def gp";
        }
    };
    btnOk.onclick = function(){
        var gpName = txtGName.value;
        if (gpName.length>0 && gpName != tip) {
            Contacts.addGroup(gpName,function(result){
                if(result.success){
                    var _td = btnOk.parentNode;
                    var _tr = _td.parentNode;
                    var tb = _td.offsetParent;
                    var tr = tb.rows[_tr.rowIndex-1];
                    var lst = tr.getElementsByTagName('UL')[0];
                    var li = context.createElement('LI');
                    li.innerHTML = "<label for='Chk_" + result.groupId + "'><input id='Chk_" + result.groupId + "' value='" + result.groupId + "' type='checkbox' checked='checked' />" + Utils.htmlEncode(gpName) + "</label>";
                    lst.appendChild(li);
                    lst.scrollTop=lst.scrollHeight;
                    btnCancel.onclick();
                }else{
                    FF.alert(result.msg);
                }
            });
        }
    };
    btnCancel.onclick = function(){
        p.removeChild(txtGName);
        p.removeChild(btnOk);
        p.removeChild(btnCancel);
        btn.style.display = "inline";
    };

    btn.style.display = "none";
    p.appendChild(txtGName);
    p.appendChild(btnOk);
    p.appendChild(btnCancel);
}


/**
*发信成功页判断所有收件人是一个整组
*/
//[FIXED]
Contacts.execIsAllContactsSameGroup = function(requestParam, callback){
	var request = "<QueryContactsInGroup><UserNumber>{0}</UserNumber><SerialId>{1}</SerialId></QueryContactsInGroup>".format(requestParam.UserNumber,encodeXML(requestParam.SerialId));
	function successHandler(doc) {
        //var info = top.xml2json(doc.documentElement, {QueryContactsInGroupResp:{ type: "rich"} });
        var info = doc.responseData;
        //fix: 刚加载通讯录首页完，就快速跳进子页面，回调到这处已释放的代码时，不处理。
        try {
            callback(info);
        } catch(e) {
            return;
        }
    }

    function error (xhr){//执行错误函数的时候给前端给予反馈
		ScriptErrorLog.addLog("另存为组错误",xhr);
	}

    $RM.call("QueryContactsInGroup", request, function(a){
            successHandler(a);
    }, { error: error});
}

//写信成功页另存为组
//[FIXED] Todo
Contacts.execsaveRecieverToGroup = function(requestParam, callback){
	var request = "<AddCAndGToGroup><AddrType>{0}</AddrType>\
<UserNumber>{1}</UserNumber><NewGroupName>{2}</NewGroupName>\
<GroupId>{3}</GroupId><NewContactsAddr>{4}</NewContactsAddr>\
<SerialId>{5}</SerialId><SourceType>{6}</SourceType>\
<UserType>{7}</UserType></AddCAndGToGroup>".format(requestParam.AddrType,requestParam.UserNumber,encodeXML(requestParam.NewGroupName),requestParam.GroupId,encodeXML(requestParam.NewContactsAddr),requestParam.SerialId,requestParam.SourceType,requestParam.UserType);	  
    function successHandler(doc) {
        //var info = top.xml2json(doc.documentElement, {AddCAndGToGroupResp:{ type: "rich",arrayElement: "ContactsInfo"},ContactsInfo:{type:"rich"} });
        var info = doc.responseData;
        try {
            callback(info);
        } catch(e) {
            return;
        }
    }

    function error (xhr){
	    ScriptErrorLog.addLog("另存为组错误",xhr);
	}
    $RM.call("AddCAndGToGroup", request, function(a){
            successHandler(a);
    }, { error: error});
}

//给分组添加联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
/**
*param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
*param.groupType: vip || ""
*param.serialIds:联系人id串   
//[FIXED]
*/
Contacts.AddGroupList = function(param,callback){
	if(param.groupId =="vip"){
		param.groupId ="";
	}
	var request = "<AddGroupList><UserNumber>{0}</UserNumber><GroupId>{1}</GroupId><SerialId>{2}</SerialId><GroupType>{3}</GroupType></AddGroupList>".format(top.$User.getUid(),param.groupId,param.serialId,param.groupType);

    function successHandler(result) {
        try {
            callback(result);
        } catch(e) {
            return;
        }
    }
    $RM.call("AddGroupList", request, function(a){
          var result = a.responseData;
		if(result.ResultCode !=0){
			result.resultCode = result.ResultCode;
			ajaxDoContact.error(result,callback)
		}else{
			successHandler(result);
		} 
    }, { error: function(){ alert("连接失败"); } });
}

/**
 * 修改联系人分组-批量导入联系人到分组中 -做vip联系人是扩展了groupType(非必填字段)
 * @param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
 * @param.groupType: vip || ""
 * @param.serialIds:联系人id串
 */
Contacts.editGroupList = function(param, callback){

    var uid = top.$User.getUid();
    var groupId = param.groupId || "";
    var groupType = param.groupType || "";
    var groupname = param.groupName || "";
    var serialIds = param.serialId || "";
	if(groupId == "vip")groupId =""; //防止第一次添加vip联系人时，没有把groupId设为null，而是“vip”
    var request = [
        "<EditGroupList>",
            "<UserNumber>", uid, "</UserNumber>",
            "<GroupType>", groupType, "</GroupType>",
            "<GroupId>", groupId, "</GroupId>",
            "<GroupName>", groupname, "</GroupName>",
            "<SerialId>", serialIds, "</SerialId>",
        "</EditGroupList>"
    ].join('');

    var _this = this;
    $RM.call("EditGroupList", request, function(a){
		var result = a.responseData;
		if(result.ResultCode !== "0"){
			result.resultCode = result.ResultCode;
			ajaxDoContact.error(result,callback)
		}else{
			$App.trigger("change:contact_maindata");
			callback(result);
		} 
    }, { error: function(){ _this.onconnectionfail(); } });

}



//将联系人移除分组
Contacts.DelGroupList = function (param, callback) {
    var request = "<DelGroupList><UserNumber>{0}</UserNumber><GroupId>{1}</GroupId><SerialId>{2}</SerialId></DelGroupList>".format(top.$User.getUid(), param.groupId, param.serialId);

    function successHandler(doc) {
        //var result = top.xml2json(doc.documentElement, {DelGroupListResp:{ type: "simple"} });
        var result = doc.responseData;
        try {
            callback(result);
        } catch (e) {
            return;
        }
    }

    $RM.call("DelGroupList", request, function (a) {
        successHandler(a);
    }, { error:function () {
        alert("连接失败");
    } });
};

Contacts.getDealListData = function (callback) {
    var request = "<GetDealList></GetDealList>";
    var result = {};

    function successHandler(doc) {
        //var info = xml2json(doc.documentElement, { GetDealListResp: { type: "rich", arrayElement: "UserInfo" }, UserInfo: { type: "simple"} });
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.list = info.UserInfo;
        if (callback) callback(result);
    }

    $RM.call("GetDealList", request, function (a) {
        successHandler(a);
    }, { error:function () {
        alert("连接失败");
    } });
};
//[FIXED]
Contacts.deleleteDealList = function (relationId, callback) {
    relationId = relationId.toString();
    var request = "<DelDealList><RelationId>{0}</RelationId></DelDealList>".format(relationId);
    var result = {};

    function successHandler(doc) {
        //var info = xml2json(doc.documentElement, { DelDealListResp: { type: "simple" } });
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.info = info;
        
        if (callback) callback(result);
    }

    $RM.call("DelDealList", request, function (a) {
        successHandler(a);
    }, { error:function () {
        alert("连接失败");
    } });
    // doContactsAjax({
    //     url: Contacts.addrInterfaceUrl("DelDealList"),
    //     callback: callback,
    //     request: request,
    //     successHandler: successHandler
    // });
};
//[FIXED]
Contacts.modDealStatus = function(p, callback) {
    p.relationId = p.relationId.toString();
    var request = "<ModDealStatus><RelationId>{0}</RelationId><DealStatus>{1}</DealStatus><GroupId>{2}</GroupId><ReqMsg>{3}</ReqMsg><ReplyMsg>{4}</ReplyMsg><OperUserType>{5}</OperUserType><UserNumber>{6}</UserNumber>{7}</ModDealStatus>".format(p.relationId, p.dealStatus, p.groupId, p.reqMsg, p.replyMsg, p.operUserType, top.$User.getUid(),p.name?"<name>"+p.name+"</name>":"");
    var result = {};
    function successHandler(doc) {
        //var info = xml2json(doc.documentElement, { ModDealStatusResp: { type: "simple"} });
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.info = info;
        if (info.ResultCode != "0") {
            result.success = false;
            delete result.msg; //错误时去掉提示语，各页面自己提供.20130923
            Contacts._reportLog("ModDealStatus", doc.responseText);
        }

        if (callback) callback(result);
    }
    $RM.call("ModDealStatus", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url: Contacts.addrInterfaceUrl("ModDealStatus"),
    //     callback: callback,
    //     request: request,
    //     successHandler: successHandler
    // });
}
//[FIXED]
Contacts.agreeOrRefuseAll = function(operType, callback) {
    var request = "<AgreeOrRefuseAll><UserNumber>{0}</UserNumber><OperType>{1}</OperType></AgreeOrRefuseAll>".format($User.getUid(), operType);
    var result = {};
    function successHandler(doc) {
        //var info = xml2json(doc.documentElement, { AgreeOrRefuseAllResp: { type: "simple"} });
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.info = info;

        if (callback) callback(result);
    }
    $RM.call("AgreeOrRefuseAll", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url: Contacts.addrInterfaceUrl("AgreeOrRefuseAll"),
    //     callback: callback,
    //     request: request,
    //     successHandler: successHandler
    // });
}
//[FIXED]
Contacts.wamBatchReq = function(p, callback) {
    p.relationId = p.relationId.toString();
    var request = "<WamBatchReq><RelationId>{0}</RelationId><DealStatus>{1}</DealStatus><GroupId>{2}</GroupId><ReqMsg>{3}</ReqMsg><ReplyMsg>{4}</ReplyMsg><OperUserType>{5}</OperUserType></WamBatchReq>".format(p.relationId, p.dealStatus, p.groupId, p.reqMsg, p.replyMsg, p.operUserType);
    var result = {};
    function successHandler(doc) {
        //var info = xml2json(doc.documentElement, { WamBatchReqResp: { type: "simple"} });
        var info = doc.responseData;
        result.success = true;
        result.msg = YIBUMSG.contactreaded;
        result.info = info;

        if (callback) callback(result);
    }
    $RM.call("WamBatchReq", request, function(a){
            successHandler(a);
    }, { error: function(){ alert("连接失败"); } });
    // doContactsAjax({
    //     url: Contacts.addrInterfaceUrl("WamBatchReq"),
    //     callback: callback,
    //     request: request,
    //     successHandler: successHandler
    // });
}

/**
* 获取“和通讯录”状态信息
* @parm callback {Function} 成功时触发的回调方法
* @parm onerror {Function} 失败时触发的回调方法
*/
Contacts.getColorCloudInfoData = function (callback, onerror) {
    var funcName = "GetColorCloudInfo";
    var data = {
        GetColorCloudInfo: {
            UserNumber: top.$User.getUid()
        }
    };

    Contacts._getSimpleData(funcName, data, callback, onerror);
}

/**
 * 获取已导入的联系人列表信息
 * @parm importId {Int} 导入单号，指某次导入联系人的单号
 * @parm callback {Function} 成功时触发的回调方法
 * @parm onerror{Function} 失败时触发的回调方法
 */
Contacts.getFinishImportList = function (importId, callback, onerror) {
    var funcName = "GetFinshImportList";
    var data = {
        GetFinshImportList: {
            UserNumber: top.$User.getUid(),
            ImportId: importId
        }
    };

    Contacts._getSimpleData(funcName, data, callback, onerror);
};

/**
 * 获取未导入的联系人原因
 * @parm importId {Int} 导入单号，指某次导入联系人的单号
 * @parm callback {Function} 成功时触发的回调方法
 * @parm onerror{Function} 失败时触发的回调方法
 */
Contacts.getFinishImportResult = function (importId, callback, onerror) {
    var funcName = "GetFinshImportResult";
    var data = {
        GetFinshImportResult: {
            UserNumber: top.$User.getUid(),
            ImportId: importId
        }
    };

    Contacts._getSimpleData(funcName, data, callback, onerror);
};

/**
 * 获取联系人中可设置生日提醒联系人信息的接口
 * @parm callback {Function} 成功时触发的回调方法
 * @parm onerror{Function} 失败时触发的回调方法
 */
Contacts.getRemindBirthdays = function (callback, onerror) {
    var funcName = "GetRemindBirdays";
    var data = {
        GetRemindBirdays: {
            UserNumber: top.$User.getUid()
        }
    };

    Contacts._getSimpleData(funcName, data, callback, onerror);
};

/**
 * 设置生日提醒联系人的接口
 * 告知服务器，对应号码的联系人，已经设置生日提醒
 * @parm contactsNumbers {Array} 联系人号码数组，如[13800138000,13800138001]
 * @parm callback {Function} 成功时触发的回调方法
 * @parm onerror{Function} 失败时触发的回调方法
 */
Contacts.setRemindBirthdays = function (contactsNumbers, callback, onerror) {
    var funcName = "SetRemindBirdays";
    var numbers = ContactArray("ContactNumber", contactsNumbers);
    var data = ["<SetRemindBirdays>",
                    "<UserNumber>",
                    top.$User.getUid(),
                    "</UserNumber>",
                    numbers,
                "</SetRemindBirdays>"].join("");

    Contacts._getSimpleData(funcName, data, callback, onerror);

    /** 
     * 将内容转换成XML格式 //TODO，待优化，最好由$T.Xml.obj2xml2支持
     * @parm key {String} 键值，如ContactNumber
     * @parm arr {Array} 需要转换的数组，如[1，2]
     * @returns {String} 返回内容，如<ContactNumber>1</ContactNumber><ContactNumber>2</ContactNumber>
     */
    function ContactArray(key, arr) {
        var xml = "";
        var template = "<SetContacts><{key}>{val}</{key}></SetContacts>";
        $.each(arr, function (i, item) {
            xml += top.$T.format(template, {
                key: key,
                val: item
            });
        });
        return xml;
    }
};

Contacts.checkSysUpdate = function(info){
    var code = 0;

    if(top.SiteConfig.addrSysUpdate){
        info = info || {};
        if(info.resultCode){
            code = info.resultCode;
        }

        if(info.ResultCode){
            code = info.ResultCode;
        }

        if(code == ajaxDoContact.RC_CODE.SystemUpdateing){
            top.$Msg.alert(YIBUMSG.systemUpdateing);
            return false;
        }
    }

    return true;
};

//[FIXED-ADD]  拼装请求参数
/*保留功能
* reason:由于一直沿用现网通讯录接口，请求参数需要进行XML组装
*
*/
 var CIPManger = {
        SerialId: function(param) {
            if(param.isAdd) {
                return "";
            } else {
                return "<SerialId>" + param.value + "</SerialId>";
            }
        },
        UserType: function() {
            return "<UserType>1</UserType>";
        },
        AddrFirstName: function(param) {
            return "<AddrFirstName>" + encodeXML(param.value.trim()) + "</AddrFirstName>";
        },
        AddrSecondName: function() {
            return "<AddrSecondName></AddrSecondName>";
        },
        AddNewGroup: function(param) {
            if(param.info.AddGroupName) {
                return "<AddNewGroup>true</AddNewGroup>";
            } else {
                return "";
            }
        },
        AddGroupName: function(param) {
            if(param.value) {
                return "<AddGroupName>" + encodeXML(param.value.trim()) + "</AddGroupName>";
            } else {
                return "";
            }
        },
        Default: function(param) {
            if(param.isAdd && !param.value) {
                return "";
            } else {
                if(param.propertyName == "ImageUrl") {
                    if(param.value && !/\d/.test(param.value)) {
                        param.value = "";
                    }
                }
                if(param.propertyName == "GroupId") { //判断是否是VIP联系人
                    if(Contacts.IsVipUser(param.info.SerialId)) {
						var vipGroupId = Contacts.data.vipDetails.vipGroupId;
                        if(param.value == "") {
                            param.value =vipGroupId;
                        } else {
                            param.value += "," + vipGroupId;
                        }
                    }
                }
                return "<{0}>{1}</{0}>".format(param.propertyName, param.value ? encodeXML(param.value.trim()) : "");
            }
        }

}


