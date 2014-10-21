
;

function AddrCrossAjax(_url, _data, _onResponse, _onError){

    var xhr = false;

    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
        if (typeof xhr.withCredentials !== "boolean") {
            xhr = false;
        }
    }

    if (xhr) {
        xhr.open("POST", _url, true);
        xhr.withCredentials = true;
        if (xhr.setRequestHeader) {
            xhr.setRequestHeader('Content-Type', 'text/plain');
        }

        xhr.onreadystatechange = function(){
            if (this.readyState == 4){
                if (this.status == 200){
                    if (_onResponse) _onResponse(this.responseText);
                } else {
                    if (_onError) _onError(this.status);
                }
            }
        };
        xhr.send(_data);
        return;
    }

    //如果浏览器版本可能不允许 Cross-Origin Resource Sharing 协议则使用Iframe代理
    apiProxyReady(function(T){
        T.ajax.request(_url, {
            "method": "POST",
            "header": {"Content-Type":"application/xml"},
            "data": _data,
            "onfailure": function(xhr){
                if (_onError) _onError(xhr.status);
            },
            "onsuccess": function(xhr, res){
                if (_onResponse) _onResponse(res);
            }
        });
    });
}; // end function ajax

function doAPIrequest(param){

    var url=param.url;
    var request=param.request;
    var timeout=param.timeout||30000;
    var type=param.type||"post";
    var successHandler=param.successHandler;
    var callback=param.callback;
    var err=param.error;

    AddrCrossAjax(url, request, onResponse, err);

    function onResponse(response) {
        Contacts.hideLoading();
        if(param.responseEncode){
            response = param.responseEncode(response);
        }
        try{ //返回json
            var responseObj = eval("(" + response + ")");
            if( responseObj.ResultCode == 0){
                if(successHandler){
                    successHandler(responseObj);
                }
            }
        }catch(e){
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
        }
    }

    function error(resultCode,resultMessage, xdoc){
        if (err) {
            err();
            return;
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
        var result = { success: false, resultCode: -1, msg: "" };
        var rc = -1;

        if ( param.showLoading != false ) {
            Contacts.hideLoading();
        }

        if (typeof(resultCode) == "string"){
            result.resultCode = resultCode;
        }

        rc = parseInt(result.resultCode);

        switch(rc) {
            case RC_CODE.GroupExisted:
            case RC_CODE.GroupOverLimit:
            case RC_CODE.ContactInGroupOverLimit:
            case RC_CODE.AddContactTooQuick:
            case RC_CODE.InputContactTooQuick:
                result.msg=resultMessage;
                break;

            case RC_CODE.ContactOverLimit:
                result.msg="保存失败，联系人数量已达上限。你可以<br /><a href=\"javascript:(function(){top.FF.close();top.Links.show('addr');})();\">管理通讯录&gt;&gt;</a>" ;
                break;

            case RC_CODE.ContactExisted:
                rc = xdoc.getElementsByTagName("SerialId")[0];
                rc = rc.text||rc.textContent;
                result.SerialId = parseInt(rc);
                break;
            default:
                result.msg = YIBUMSG.ajax_othererror;
                break;
        }

        if(callback){
            callback(result);
        }
    }
};


function getXMLTest(doc){
    if(doc.xml)return doc.xml;
    var root=doc.documentElement||doc;
    var xml="<"+root.tagName+">";
    $(root.tagName+" > *",doc).each(function(){
        xml+="<"+this.tagName+">"+encodeXML(this.textContent)+"</"+this.tagName+">";
    });
    xml+="</"+root.tagName+">";
    return xml;
}
function replaceSimpleXML(xml){
    if(typeof xml!="string"){
        xml=getXMLTest(xml);
    }
    var rm=replaceMent;
    for(var p in rm){
        var reg=new RegExp("(</?)"+p+">","g");
        xml=xml.replace(reg,"$1"+rm[p]+">");
    }
    return xml;
}

function LastContactsInfo(param) {
    for(var p in param){
        this[p]=param[p];
    }
    var reg=/^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)$/;
    var m=this.CreateTime.match(reg);
    this.CreateTime=new Date(m[1],m[2]-1,m[3],m[4],m[5],m[6]);
}

(function ($, _, M) {


String.prototype.bind=function(data){
    var result=this;
    for(var p in data){
        var reg=new RegExp("\\{"+p+"\\}","gi");
        result=result.replace(reg,data[p]);
    }
    return result;
}

var _syncMethods = {

    getContactsByMobile: function(mobile) {
        var result = [];
        if (!Contacts.data.contacts || mobile == '' || 'undefined' == typeof mobile) {
            return result;
        }

        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.mobiles.length; j++) {
                var m = c.mobiles[j];
                m = m.replace(/[^\d]+/g, "");//tofix:修正(86)+8686-86,等手机号
                if(m.length==13)m=m.replace(/^86/, "");
                if (m == mobile) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByMobile: function(mobile, useRepeat) {
        var contacts = Contacts.data.contacts;
        if (mobile.length == 13) {
            mobile = mobile.replace(/^86/, "");
        }
        if (!contacts) return null;
        if (!window._mobileCache_) {
            _mobileCache_ = {};
            _repeatMobile_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.mobiles.length; j++) {
                    var m = c.mobiles[j];
                    if(m.length==13)m=m.replace(/^86/, "");
                    if (!_mobileCache_[m]) {
                        _mobileCache_[m] = c;
                    } else if (_mobileCache_[m].name != c.name) {
                        _repeatMobile_[m] = true;
                    }
                }
            }
            setTimeout(function() { _mobileCache_ = undefined; _repeatMobile_ = undefined; }, 0);
        }
        if (_repeatMobile_[mobile] && !useRepeat) {
            return null;
        } else {
            return _mobileCache_[mobile];
        }
    },
    //调用新版的函数
    getNameByAddr: function(addr, name) {
        arguments.callee.exists = false;
        var addrName = top.$App.getModel("contacts").getAddrNameByEmail(addr);
        addrName = top.M139.Text.Html.encode(addrName);
        if (addrName == top.M139.Text.Email.getAccount(addr)) {
            return top.M139.Text.Email.getEmail(addr);
        } else {
            return addrName;
        }
    },

    getGroupByName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupName==groupName){
                return g;
            }
        }
        return null;
    },

    getGroupById: function(groupId){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            var g=groups[i];
            if(g.GroupId==groupId){
                return g;
            }
        }
        return null;
    },

    isExistsGroupName: function(groupName){
        var groups=Contacts.data.groups;
        for(var i=0,len=groups.length;i<len;i++){
            if(groups[i].GroupName==groupName){
                return true;
            }
        }
        return false;
    },

    //验证新增联系人数据
    validateAddContacts: function(obj){
        Contacts.validateAddContacts.error="";
        if(!obj.name || obj.name.trim()==""){
            Contacts.validateAddContacts.error="请输入联系人姓名";
            return false;
        }
        if(obj.name.trim().getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactNameToolong'];
            return false;
        }
        if(obj.email && !Validate.test("email",obj.email)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.email && obj.email.getByteCount()>60){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactEmailToolong'];
            return false;
        }
        if(obj.mobile && !Validate.test("mobile",obj.mobile)){
            Contacts.validateAddContacts.error=Validate.error;
            return false;
        }
        if(obj.mobile && obj.mobile.getByteCount()>100){
            Contacts.validateAddContacts.error=frameworkMessage['warn_contactMobileToolong'];
            return false;
        }
        if(!obj.email && !obj.mobile){
            Contacts.validateAddContacts.error="电子邮箱和手机号码，请至少填写一项";
            return false;
        }
        if(obj.newGroup){
            if(Contacts.getGroupByName(obj.newGroup)!=null){
                Contacts.validateAddContacts.error="联系组\""+obj.newGroup+"\"已经存在!";
                return false;
            }
        }
        return true;
    },

    getContactsByGroupId: function (groupId, onlyId) {
        var model = top.M2012.Contacts.getModel();
        if (onlyId) {
            return model.getGroupMembersId(groupId);
        } else {
            return model.getGroupMembers(groupId);
        }
    },

    getContactsById: function(contactsId){
        return Contacts.data.ContactsMap[contactsId]||null;
    },

    getContactsGroupById: function(contactsId){
        var groups = [];
        var member = Contacts.data.groupMember;
        for(var key in member){
            if(member[key] && member[key].length > 0){
                var str = member[key].join(',');
                if(str.indexOf(contactsId) > -1){
                    groups.push(key);
                }
            }
        }

        return groups;
    },

    getVipInfo: function(){
        return Contacts.data.vipDetails||null;
    },

    //根据VIP联系人信息组装数据提供刷新VIP邮件使用
    setVipInfo: function(vips){
        if(!vips){return false;}
        var vipinfo = vips;
        var vipn =0,vips = "",isExist =false,hasContact=false,vipGroupId="",vipArr = [] , vipEmails = [];
        if(vipinfo.length > 0){
            isExist = true;
            vipGroupId = vipinfo.vipGroupId;
            vipn = vipinfo.vipn;
        }
        if(vipn > 0){
            hasContact = true;
            vips = vipinfo.vipSerialIds;
            var vipIdArray = vips.split(",");
    
            for(var i=0; i<vipIdArray.length;i++){
                var info = Contacts.data.ContactsMap[vipIdArray[i]];
                if(info){
                    vipArr.push(info);
                    vipEmails = vipEmails.concat(info.emails);
                }
            }
        }
        Contacts.data.vipDetails ={
                        isExist      : isExist,   //vip联系人分组是否存在
                        hasContact   : hasContact,   //
                        vipGroupId   : vipGroupId,
                        vipContacts  : vipArr,
                        vipEmails    : vipEmails,
                        vipSerialIds : vips,
                        vipn         : vipn
                    };
    },

    //根据email地址找到联系人
    getContactsByEmail: function(email){
        var result = [];
        if (!Contacts.data.contacts) return result;
        for (var i = 0, contacts = Contacts.data.contacts, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.emails.length; j++) {
                if (c.emails[j] == email) {
                    result.push(c);
                }
            }
        }
        return result;
    },

    getSingleContactsByEmail: function(email,useRepeat) {//默认放弃有重复name的,除非useRepeat为true
        var contacts = Contacts.data.contacts;
        if (!contacts || !email) return null;
        email = email.toLowerCase();
        if (!window._emailCache_) {
            _emailCache_ = {};
            _repeatEmail_ = {};
            for (var i = 0, len = contacts.length; i < len; i++) {
                var c = contacts[i];
                for (var j = 0; j < c.emails.length; j++) {
                    var e = c.emails[j].toLowerCase();
                    if (!_emailCache_[e]) {
                        _emailCache_[e] = c;
                    } else if (_emailCache_[e].name != c.name) {
                        _repeatEmail_[e] = true;
                    }
                }
            }
            setTimeout(function() { _emailCache_ = undefined; _repeatEmail_ = undefined; }, 0);
        }
        if (_repeatEmail_[email] && !useRepeat) {
            return null;
        } else {
            return _emailCache_[email];
        }
    },

    //是否存在的手机
    isExistMobile: function(mobile) {
        var contacts = Contacts.data.contacts;
        mobile = mobile.toString().trim().replace(/^86/,"");
        if (!contacts) return true;
        for (var i = 0, len = contacts.length; i < len; i++) {
            var info = contacts[i];
            if (
                (info.MobilePhone && info.MobilePhone.trim().replace(/^86/,"") == mobile)
                || (info.BusinessMobile && info.BusinessMobile.trim().replace(/^86/,"") == mobile)
                || (info.OtherMobilePhone && info.OtherMobilePhone.trim().replace(/^86/,"") == mobile)) {
                return true;
            }
        }
        return false;
    },

    //是否存在的邮箱
    isExistEmail: function(email){
        var contacts=Contacts.data.contacts;
        if(!contacts)return true;
        if(!email)return false;
        email=email.toLowerCase();
        for(var i=0,len=contacts.length;i<len;i++){
            var info=contacts[i];
            if(
                (info.FamilyEmail && info.FamilyEmail.toLowerCase()==email)
                ||(info.BusinessEmail && info.BusinessEmail.toLowerCase()==email)
                ||(info.OtherEmail && info.OtherEmail.toLowerCase()==email)){
                return true;
            }
        }
        return false;
    },

    getContactsCount: function() {
        return top.Contacts.data.TotalRecord;
    },

    QueryUserInfo: function(callback){

        var request="<QueryUserInfo><UserNumber>{0}</UserNumber></QueryUserInfo>".format($User.getUid());
        function successHandler(doc){
            var result={};
            var obj=doc.responseData;
            result.success=true;
            //result.msg= YIBUMSG.contactsaved;
            result.msg= "保存成功";//下版本修复
            if(obj.UserInfo){
                //result.info=new top.ContactsInfo(obj.UserInfo);
				 var helper = top.$App.getModel("contacts");
				 var fullInfo = helper.userInfoTranslate(obj.UserInfo[0]);
				result.info = new M2012.Contacts.ContactsInfo( fullInfo );
			}else{
                result.info=null;
            }
            if(callback){
                callback(result);
            }
        }
		 $RM.call("QueryUserInfo", request, function(a){
				successHandler(a);
			}, { error: function(){ alert("连接失败"); } });
		/*
        doAPIrequest({
            url:Contacts.apiurl("QueryUserInfo"),
            callback:callback,
            request:request,
            successHandler:successHandler,
            responseEncode:replaceSimpleXML
        });*/

    },

    /**
     * 将list添加到本地最近联系人缓存中。
     * @param {Array} list 必选参数，带属性AddrContent联系人数组。
     */
    addLastestContactsToCache: function(list) {
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
    },

    //邮件列表发件人浮层，加改手机使用。
    addContactsMobile: function(serialId, number, callback) {
        var info = Contacts.getContactsById(serialId);
        var request = "<AddContactsField><SerialId>{0}</SerialId><MobilePhone>{1}</MobilePhone></AddContactsField>".format(
            info.SerialId,
            encodeXML(number)
        );
        Contacts.execContactDetails(request, function(result) {
            if (result.success) {
                info.MobilePhone = number;
                info.mobiles[0] = number;
                if (callback) callback(result);
            } else {                
                if (callback) callback(result);
            }
        }, false);
    },

    //通讯录首页快速编辑使用，只更改其中几个字段时使用。
    //注意，该服务端接口必须填满所有字段，否则会清空
    ModContactsField: function (serialId, contactsDetails, isOver, callback, msg) {
        //TODO 暂时没想到好方法，在请求此方法时，YIBUMSG为空（未加载m2011.matrixvm.contacts.async.js)的情形,特加了个msg参数
        //关联文件：m2012.contacts.httpclient.js, 行700左右

        var properties;
        var feContact = contactsDetails;
        var orContact = this.getContactsById(serialId);

        var key = [ "AddrFirstName", "FamilyEmail", "MobilePhone", "BusinessEmail", "BusinessMobile" ];
        for (var i = key.length; i--; ) {
            properties = feContact[key[i]];
            if (properties) {
                orContact[key[i]] = properties;
            }

            if (typeof(properties) == "string" && properties.length == 0) {
                orContact[key[i]] = "";
            }
        }

        var buff = ["<ModContactsField>",
            "<UserNumber>", $User.getUid(), "</UserNumber>",
            "<SerialId>", serialId, "</SerialId>"];

        for (var m = key.length, i = 0; i < m; i++) {
            buff.push("<", key[i], ">", encodeXML(orContact[key[i]]), "</", key[i], ">");
        }

        buff.push("<OverWrite>", (isOver ? "1" : "0"),"</OverWrite>");
        buff.push("</ModContactsField>")

        var requestBody = buff.join('');
        var requestUrl = Contacts.addrInterfaceUrl("ModContactsField");

        function successHandler(doc) {
            var info = doc.responseData;

            var result = {};
            result.resultCode = info.ResultCode;
            result.msg = msg || YIBUMSG.contactsaved;
            result.ContactInfo = contactsDetails;
            result.SerialId = contactsDetails.SerialId;

            if (result.resultCode == '0'){
                Contacts.getContactsInfoById(serialId, function(_result){
                    Contacts.updateCache("EditContactsDetails", { 'info':_result.contactsInfo });
                    result.ContactInfo = _result.contactsInfo;
                    result.msg = msg || YIBUMSG.contactsaved;
                    result.success = true;

                    if (callback) callback(result);
                });
            }else{
                result.success = false;
                if (callback) callback(result);
            }
        }

        $RM.call("ModContactsField", requestBody, function(a){
            successHandler(a);
        }, { error: function(){ alert("连接失败"); } });

    },

    /*
    * 判断联系人是否是vip联系人-只需要判断serialId是否在vipgroup里面就行因为 vip组最多20人，这样循环最快
    *groupId 默认为vip组的id
    *serialId 联系人id
    *return BOOLEAN  返回联系人是否在某个组-默认查询vip组 -vip组ID固定(****)
    */
    IsVipUser: function(serialId){
        if(!serialId){
            return false;
        }
        var vipContacts = Contacts.data.vipDetails;
        if(!vipContacts.isExist){ //不存在vip联系人组
            return false;
        }
        if(!vipContacts.hasContact){
            return false; //VIP联系人为0
        }
    
        var vips = vipContacts.vipSerialIds;
        return vips.indexOf(serialId) > -1;
    },

    //从多个联系人中筛选出vip联系人
    /*
    *serialIdList ["3123","312321"]
    */
    FilterVip: function(serialIdList){
        var isVip = false;
        var vipList = [];
        if(!serialIdList){
            top.jslog("联系人sid组为空",serialIdList);
            return vipList;
        }
        for(var i=0;i<serialIdList.length;i++){
            isVip = top.Contacts.IsVipUser(serialIdList[i]);
            if(isVip){
                vipList.push(serialIdList[i]);
            }
        }
       return vipList;
    },

    //判断是否有vip联系人组
    IsExitVipGroup: function(){
        var vipgroup = Contacts.data.vipDetails;
        return vipgroup.length > 0 ;
    },

    //判断传入的sid是否是用户自己的 ()
    IsPersonalEmail: function(serialId){
		if(!serialId){return false;}
        //var info = top.Contacts.getContactsById(serialId);
        var info = top.Contacts.data.ContactsMap[serialId];
        var emails = info.emails;
        var personalEmails = $User.getAccountListArray();

        for(var i=0; i<emails.length; i++){
            for(var j=0;j<personalEmails.length;j++){
                if(personalEmails[j] ==emails[i]) {
                    return true; //break 只能退出当前for循环，没法退出最外层for循环，只能使用return 退出整个函数
                }
            }
        
        }
        return false;
    }

};

    //异步方法体的函数
    var _asyncMethods = {

        //#region //{ 联系人操作方法

        addContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addContacts", function(){_this.addContacts.apply(_this, arg)});
        }

        ,addContactsMuti: function(contacts, callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("addContactsMuti", function(){_this.addContactsMuti.apply(_this, arg)});
        }

        ,addContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,true);
        }

        ,editContactDetails: function(contacts,callback){
            return this.execContactDetails(contacts,callback,false);
        }

        ,execContactDetails: function(contacts, callback, isAdd) {
            var _this = this, arg = arguments;
            _this.scriptReady("execContactDetails", function(){_this.execContactDetails.apply(_this, arg)});
        }

        ,deleteContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContacts", function(){_this.deleteContacts.apply(_this, arg)});
        }

        ,addLastestContacts: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addLastestContacts", function(){_this.addLastestContacts.apply(_this, arg)});
        }

        //最近联系人详细数据
        ,getLastContactsDetail: function(callback,isClose){
            var _this = this, arg = arguments;
            _this.scriptReady("getLastContactsDetail", function(){_this.getLastContactsDetail.apply(_this, arg)});
        }

        ,getCloseContactsDetail: function(callback) {
            this.getLastContactsDetail(callback, true);
        }

        //异步查询联系人详细数据
        ,getContactsInfoById: function(id,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getContactsInfoById", function(){_this.getContactsInfoById.apply(_this, arg)});
        }

        //获取重复联系人列表
        ,getRepeatContacts: function(callback){
            var _this = this, arg = arguments;
            _this.scriptReady("getRepeatContacts", function(){_this.getRepeatContacts.apply(_this, arg)});
        }

        //获取待更新联系人的人数
        ,getUpdatedContactsNumData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getUpdatedContactsNumData", function(){_this.getUpdatedContactsNumData.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 组操作方法

        ,addGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("addGroup", function(){_this.addGroup.apply(_this, arg)});
        }

        ,changeGroupName: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("changeGroupName", function(){_this.changeGroupName.apply(_this, arg)});
        }

        ,deleteGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteGroup", function(){_this.deleteGroup.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 联系人分组 关联方法

        ,deleteContactsFromGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("deleteContactsFromGroup", function(){_this.deleteContactsFromGroup.apply(_this, arg)});
        }

        ,moveContactsToGroup: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("moveContactsToGroup", function(){_this.moveContactsToGroup.apply(_this, arg)});
        }

        ,copyContactsToGroup: function() {
            var _this = this, arg = arguments;
            _this.scriptReady("copyContactsToGroup", function(){_this.copyContactsToGroup.apply(_this, arg)});
        }

        /**
        * 给编辑分组联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        * param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        * param.groupType: 1 || ""
        * param.serialIds:联系人id串
        */
        ,editGroupList: function(){
            var _this = this, arg = arguments;
            _this.scriptReady("editGroupList", function(){_this.editGroupList.apply(_this, arg)});
        }

        //#endregion //}

        //#region //{ 用户自身资料操作方法

        //添加或编辑用户自身资料
        ,AddUserInfo: function(info,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("AddUserInfo", function(){_this.AddUserInfo.apply(_this, arg)});
        }

        //#endregion //}
        
        //#region //{ 用户相互关系相关方法

        ,getWhoWantAddMeData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoWantAddMeData", function(){_this.getWhoWantAddMeData.apply(_this, arg)});
        }

        ,agreeOrRefuseAll: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("agreeOrRefuseAll", function(){_this.agreeOrRefuseAll.apply(_this, arg)});
        }

        //#endregion //}
        
        //>
        //合并联系人
        //<
        ,MergeContacts: function(serialId,info,callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.MergeContacts.apply(Contacts,arg)});
        }
        //>
        //智能全自动合并联系人
        //<
        ,AutoMergeContacts: function(callback){
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.AutoMergeContacts.apply(Contacts,arg)});
        }
        //>
        //<
        ,getAddrConfig: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getAddrConfig.apply(Contacts,arg)});
        }
        //>
        //删除最近联系记录
        //<
        ,DeleteLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.DeleteLastContactsInfo.apply(Contacts,arg)});
        }
        //>

        //删除最近联系记录
        //<
        ,EmptyLastContactsInfo: function(param, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.EmptyLastContactsInfo.apply(Contacts,arg)});
        }

        ,addContactsToCacheExec: function() {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.addContactsToCache.apply(Contacts,arg)});
        }

        //<9.28
        ,addLastestContactsExt: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execaddLastestContactsExt", function(){
                    Contacts.execaddLastestContactsExt.apply(Contacts, arg);
                });
            });
	        //Contacts.scriptReady(function(){Contacts.addLastestContactsExt.apply(Contacts,arg)});
        }

        ,getWhoAddMePageData: function(callback) {
            var _this = this, arg = arguments;
            _this.scriptReady("getWhoAddMePageData", function(){_this.getWhoAddMePageData.apply(_this, arg)});
        }
        ,getWhoAddMeData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getWhoAddMeData.apply(Contacts,arg)});
        }

        ,getDealListData: function(callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.getDealListData.apply(Contacts,arg)});
        }
        ,deleleteDealList: function(relationId, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.deleleteDealList.apply(Contacts,arg)});
        }

        //同步添加若干联系人（同自动保存联系人接口AutoSaveReceivers）
        ,syncAddContacts: function(obj, callback, groupid){
            var arg=arguments;
            Contacts.scriptReady(function(){Contacts.execSyncAddContacts.apply(Contacts,arg)});
        }



        //用户隐私设置
        ,savePrivacySettings: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execSavePrivacySettings", function(){
                    Contacts.execSavePrivacySettings.apply(Contacts, arg);
                });
            });
        }

        //获取用户隐私设置信息params 包括 请求参数 和回调函数
        ,getPrivacySettings: function(params) {
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execGetPrivacySettings", function(){
                    Contacts.execGetPrivacySettings.apply(Contacts, arg);
                });
            });
        }
        /**
         * 可能认识的人页面批量添加选择人员。
         * @param {String} request 必选参数，请求参数。
         */
        ,OneKeyAddWAM: function(request,callback){
            var _this = this, arg = arguments;
            _this.scriptReady("OneKeyAddWAM", function(){_this.OneKeyAddWAM.apply(_this, arg)});
        }
        /**
         * 可能认识的人分组接口。
         * @param {String} request 必选参数，请求参数。
         */
        ,WMAGroupList: function(request,callback){
	       var _this = this, arg = arguments;
            _this.scriptReady("WMAGroupList", function(){_this.WMAGroupList.apply(_this, arg)});
        }

        ,modDealStatus: function(p, callback) {
        var arg=arguments;
        Contacts.scriptReady(function(){Contacts.modDealStatus.apply(Contacts,arg)});
        }

        ,updateCache: function(type, param) {    
            var arg = arguments;
            Contacts.scriptReady(function() { Contacts.updateCache.apply(Contacts, arg) });
        }

        /**
         * 发信成功页自动保存联系人与记录最近联系人。
         * @param {Array } contacts 必选参数，包含主送、抄送、密送的所有收件人的逗号隔开数组行 1@a.c, 2@a.c。
         * @param {String} from 必选参数，E、E1之类的来源标识 详见FROMTYPE枚举。
         * @param {Object} panel 必选参数，生成已保存联系人列表的DOM对象。
         * @param {String} subject 必选参数，刚才发送的邮件的标题。
         * @return void
         */
        ,AutoSaveRecentContacts: function(contacts, from, panel, subject) {
	        var _this = this, arg = arguments;
            _this.scriptReady("AutoSaveRecentContacts", function(){_this.AutoSaveRecentContacts.apply(_this, arg)});
        }
        /**
        *发信页 查询所有收件人是否在是整组
        */
        ,IsAllContactsSameGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execIsAllContactsSameGroup", function(){
                    Contacts.execIsAllContactsSameGroup.apply(Contacts, arg);
                });
            });
        }


        /**
         *发信成功页另存为组
         */
        ,saveRecieverToGroup: function(requestParam, callback){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execsaveRecieverToGroup", function(){
                    Contacts.execsaveRecieverToGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 发信成功页删除联系人。
         * @param {String} serialId 必选参数，联系人ID。
         * @return void
         */
        ,DelSavedContact: function(serialId, lst, ext){
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execDelSavedContact", function(){
                    Contacts.execDelSavedContact.apply(Contacts, arg);
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
        ,ModSavedContact: function(serialId, mobile, name, lnk, pnl){
            var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execModSavedContact", function(){
                    Contacts.execModSavedContact.apply(Contacts, arg);
                });
            });
        }

        /**
         * 给自动保存联系人页快速添加组
         * @param {Object} btn
         * @param {Object} context
         */
        ,QuickAddGroup: function(btn, context){
           var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execQuickAddGroup", function(){
                    Contacts.execQuickAddGroup.apply(Contacts, arg);
                });
            });
        }

        /**
         * 修改部分个人信息的接口
         * @param {Function} callback
         */
        ,ModUserInfoIncrement: function(callback) {
            var arg=arguments;
            Contacts.scriptReady(function() {
                if (Contacts.ModUserInfoIncrement.caller == null) {
                    Contacts.ModUserInfoIncrement.apply(Contacts,arg);
                }
            });
        }

        //禁用自动保存联系人后，发送成功出现的保存联系人页面
        ,createAddContactsPage: function(param) {
	        var arg=arguments;
            Contacts.scriptReady(function(){
                Utils.waitForReady("Contacts.execCreateAddContactsPage", function(){
                    Contacts.execCreateAddContactsPage.apply(Contacts, arg);
                });
            });
        }

        //给分组添加联系人--与之前的不同，主要是做vip联系人组添加了groupType（非必填）
        /**
        *param.groupId:分组ID-第一次添加vip联系人时，分组为存在-groupId为""
        *param.groupType: vip || ""
        *param.serialIds:联系人id串
        */
        ,AddGroupList: function(param,callback){
	        var _this = this, arg = arguments;
            _this.scriptReady("AddGroupList", function(){_this.AddGroupList.apply(_this, arg)});
        }



        //将联系人移除分组--取消vip联系人调用的此接口
        ,DelGroupList: function(param,callback){
			 var _this = this, arg = arguments;
            _this.scriptReady("DelGroupList", function(){_this.DelGroupList.apply(_this, arg)});
        }
        
        //获取“和通讯录”待更新联系人的人数
        , getColorCloudInfoData: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getColorCloudInfoData", function () { _this.getColorCloudInfoData.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportList: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportList", function () { _this.getFinishImportList.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm importId {Int} 导入单号，指某次导入联系人的单号
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getFinishImportResult: function (importId, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getFinishImportResult", function () { _this.getFinishImportResult.apply(_this, arg) });
        }

        /**
         * 获取联系人中可设置生日提醒联系人信息的接口
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , getRemindBirthdays: function (callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("getRemindBirdays", function () { _this.getRemindBirthdays.apply(_this, arg) });
        }

        /**
         * 设置生日提醒联系人的接口
         * 告知服务器，对应号码的联系人，已经设置生日提醒
         * @parm contactsNumbers {Array} 联系人号码数组，如[13800138000,13800138001]
         * @parm callback {Function} 成功时触发的回调方法
         * @parm onerror{Function} 失败时触发的回调方法
         */
        , setRemindBirthdays: function (contactsNumbers, callback, onerror) {
            var _this = this, arg = arguments;
            _this.scriptReady("setRemindBirdays", function () { _this.setRemindBirthdays.apply(_this, arg) });
        }

    };


/* 新格式
Object
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsIndexMap: Object [新增]
    contactsMap: Object [新增]
    groupedContactsMap: Object [新增]
    groups: Array[22]
    groupsMap: Object
    lastestContacts: Array[50]
    map: Array[137]
    vip: Object [新增]
*/

/*  旧格式
Object
    ContactsMap: Array[603322342]
    TotalRecord: 2733
    Vip: Array[1]  [未迁移]
    birthdayContacts: Array[0]
    closeContacts: Array[20]
    contacts: Array[2733]
    contactsHasRecord: Object
    groups: Array[22]
    groupsMap: Object
    lastContactsDetail: Array[232]
    lastestContacts: Array[50]
    map: Array[137]
    strangerHasRecord: Object
    userSerialId: undefined
    vipDetails: Object
*/

    $.extend(M2012.MatrixVM.prototype, {

        attacthContactMethod: function() {
            $.extend(window.Contacts, _syncMethods);
            $.extend(window.Contacts, _asyncMethods);
        }

    })

})(jQuery, _, M139);
