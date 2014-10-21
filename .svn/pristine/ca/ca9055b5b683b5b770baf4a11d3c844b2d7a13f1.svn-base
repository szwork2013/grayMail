
(function ($, _, M) {

var _base = {

    __getUrl:function(page, type){
        return "/sharpapi/addr/apiserver/" + page + "?sid=" + sid + (type ? "&APIType=" + type : "") + "&rnd=" + Math.random();
    },

    //添加联系人(单个)
    getAddContactsUrl: function() {
        return Contacts.__getUrl("AddContact.ashx");
    },
    //添加联系人(多个)
    getAddMultiContactsUrl: function() {
        return Contacts.__getUrl("AddMultiContacts.ashx");
    },
    //添加最近联系人(多个)
    getAddLastestContactsUrl: function() {
        return Contacts.__getUrl("AddLastContacts.ashx");
    },
    //自动保存联系人，附带添加最近联系人。
    getAutoSaveRecentContactsUrl: function(){
        return Contacts.__getUrl("AutosaveContact.ashx");
    },
    //取i联系整合接口
    getIAPIUrl: function(action) {//i联系
        return Contacts.__getUrl("iContactService.ashx", action);
    },
    addrInterfaceUrl: function(action){
        return Contacts.__getUrl("addrinterface.ashx", action);
    },
    getLoadLastContactsDataUrl: function() {
        return Contacts.addrInterfaceUrl("GetLCContacts");
    },
    getAPIUrl: function(action){
        return Contacts.addrInterfaceUrl(action);
    },

     //直呼型接口地址
    apiurl : function(action){
        //return top.addrDomain + "/" + action + "?sid=" + sid + "&r=" + Math.random();
        return "/addrsvr/" + action + "?sid=" + sid + "&r=" + Math.random();
    },
    
    MAX_VIP_COUNT: 10,
    
    MAX_CONTACT_LIMTE: 3000,
    getMaxContactLimit: function(){
        var limit = $User.getMaxContactLimit();
        if (limit < 3000) {
            limit = this.MAX_CONTACT_LIMTE;
        }
        return limit;
    },

    //初始化旧数据LinkManList
    init:function(){},

    //通讯录已加载
    isReady: false,
    waitingQueue: [],

    runWaiting: function() {
        $(this.waitingQueue).each(function() { this() });
        this.waitingQueue.length = 0;
    },

    ready: function(callback){
        if(this.isReady){
            callback();
        }else{
            this.waitingQueue.push(callback);
        }
    },


    createAddressPage : function(param) {
        var url = "/m2012/html/addrwin.html?";
        for (var p in param) {
            if(!/container|width|height|withName/.test(p)){
                url += "&" + p + "=" + param[p];
            }
        }
        if (param.withName) {
            url += "&useNameText=true&useAllEmailText=true";
        }
        param.container.innerHTML = "<iframe frameBorder='0' src='{0}' style='width:{1};height:{2}'></iframe>"
        .format(url, param.width || "100%", param.height || "100%");
    },
    
    addSinglVipContact: function(param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
        if(top.Contacts.IsPersonalEmail(param.serialId)){
            //top.FF.alert("不支持添加自己为VIP联系人。");
            top.M139.UI.TipMessage.show("不支持添加自己为VIP联系人。", { delay: 2000, className: 'msgYellow'});
            return false;
        }
        
        var vips = top.Contacts.data.vipDetails;
        var vipGroupId = "",vipCount =0,vipMaxCount = top.Contacts.MAX_VIP_COUNT; //因后端接口限制
        if(vips.isExist){
            vipGroupId =vips.vipGroupId;
            vipCount = vips.vipn ;
        }
        
        if(vipCount >= vipMaxCount){
            var a = '<a hidefocus="" style="text-decoration:none;" href="javascript:top.FF.close();top.Links.show(\'addrvipgroup\');" ><br/>管理VIP联系人</span></a>';
            var msg = vipMsg.vipContactsMax.format(vipMaxCount,a);
            top.FF.alert(msg);

            return false;
        }
        top.WaitPannel.show("正在保存...");
        var requestData = {
                    groupId : vipGroupId,
                    serialId: param.serialId,
                    groupType:1
        }
        
        //回调
        function callback(res){

            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(res.resultCode == 23){ //分组联系人已达上限
                    top.FF.alert(vipMsg.groupLimit);
                    return false;
                }
                
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.syserror);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = AddGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
			//var name = $T.Html.encode(param.name);
            var sucMsg = vipMsg.addVipSuc.replace('“{0}”', '');
            //top.FF.alert(sucMsg);
            top.M139.UI.TipMessage.show(sucMsg, { delay: 2000});
            
            top.BH('addvipsuccess');
            
            if(param.success) param.success();
            
            top.Contacts.updateCache("addVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function AddGroupList(){
			top.Contacts.AddGroupList(requestData,callback);
		}	
        AddGroupList();
    },
	
	delSinglVipContact : function (param){
		var self = this;
		var vipMsg = top.frameworkMessage;
		function cancelVip(){
			self.delSinglVipContact2(param);
		}
		top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip);
	},
    
    delSinglVipContact2 : function (param){
        if(!param.serialId){
            return false;
        }
        var vipMsg = top.frameworkMessage;
		
        top.WaitPannel.show("正在保存...");
        if(!top.Contacts.IsExitVipGroup){
            return false; //不存在vip联系人组
        }
        
        var vips = top.Contacts.data.vipDetails;
        var requestData = {
                    groupId : vips.vipGroupId,
                    serialId: param.serialId
        }
        //回调
        function callback(res){
            top.WaitPannel.hide();
            if(res.ResultCode != 0){
                if(Retry.retryTime >=3){
                    top.FF.alert(vipMsg.sysError);
                    Retry.retryData = "";
                    Retry.retryFun = null;
                    Retry.retryTime = 0;
                }else{ //重试3次
                    Retry.retryData = param;
                    Retry.retryFun = DelGroupList;
                    top.FF.alert(vipMsg.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                        var Obj = top.Retry; 
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                    });
                }
                return false;
            }
            
            //top.FF.alert(vipMsg.opSuc);
            top.M139.UI.TipMessage.show("取消成功", { delay: 2000 });
            if(param.success) param.success();
            
            top.Contacts.updateCache("delVipContacts",param.serialId);
            top.$App.trigger("change:contact_maindata");
            
        }
        
		function DelGroupList(){
			top.Contacts.DelGroupList(requestData,callback);
		}
		DelGroupList();
    },

    addVIPContact: function (successCallback) {
		var self = this;
        var maxCount = this.MAX_VIP_COUNT;
        var contactsModel = top.M2012.Contacts.getModel();
        var tempVipArr = contactsModel.get("data").vip.contacts;
        var selItems = [];
        if(tempVipArr &&  tempVipArr instanceof Array){
            selItems = Array.prototype.slice.call(tempVipArr,0);
        }
        for (var i = 0; i < selItems.length; i++) {
            var c = contactsModel.getContactsById(selItems[i]);
            if (!c || !c.getFirstEmail()) {
                selItems.splice(i, 1);
                i--;
            } else {
                selItems[i] = {
                    name: c.name,
                    addr: c.getFirstEmail(),
                    serialId: c.SerialId,
                    value: contactsModel.getSendText(c.name, c.getFirstEmail())
                };
            }
        }

        

        var view = top.M2012.UI.Dialog.AddressBook.create({
            receiverText: "VIP联系人",
            showLastAndCloseContacts: false,
            showVIPGroup: false,
            showSelfAddr: false,
            getDetail: true,
            filter: "email",
            maxCount: maxCount,   //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
            items: selItems,
            isAddVip:true
        });
        view.on("select", function (e) {
            var ids = [];
            var list = e.value;
            for (var i = 0; i < list.length; i++) {
                ids.push(list[i].serialId);
            }
            //selectedCallback(ids);
			self.submitVipContact(ids, function(){ successCallback(ids); });
        });
        view.on("additemmax", function () {
            $Msg.alert("VIP联系人已达上限"+ maxCount +"个，不能添加。", {
                icon: "warn"
            });
        }); 
    },
	submitVipContact:function(ids,successCallback,options){ //type: "add" ,增加
		var self = this;
		selectedCallback(ids);
		//添加VIP联系人组件-submit执行函数
        function selectedCallback(vipList){
            var vipC = top.Contacts.getVipInfo();
            var groupId = vipC.vipGroupId;
            if( !vipC.hasContact && vipList.length == 0){
                return;
            }
            var serialIds = vipList.join(',');
			if(options && options.type == "add") serialIds = vipC.vipSerialIds + ',' + serialIds;
            var param = { groupId: groupId, groupType: 1, serialId: serialIds };

            top.Contacts.editGroupList(param, callBack);
            function callBack(result) {
                var vipPanelTips = top.frameworkMessage;
                if(result.ResultCode != '0'){
                    if(result.resultCode == '23'){
                        FF.alert(vipPanelTips.groupLimit);
                        return false;
                    }
                    //重试 -变量使用View.Retry来保存重试数据
                    var Obj = Retry;
                    if(Obj.retryTime>=3){
                        Obj.retryData = "";
                        Obj.retryFun = null;
                        Obj.retryTime = 0;
                        top.FF.alert(vipPanelTips.sysError);
                    }else{
                        Obj.retryData = vipList;
                        Obj.retryFun = selectedCallback;
                        top.FF.alert(vipPanelTips.sysBusy + '<a hidefocus="" href="javascript:var Obj = top.Retry;top.jslog(\'VIpretyr\',Obj);var data = Obj.retryData;Obj.retryFun(data);Obj.retryTime++;top.FF.close();">重试</span></a>',function(){
                            var Obj = top.Retry;
                            Obj.retryData = "";
                            Obj.retryFun = null;
                            Obj.retryTime = 0;
                        });
                    }
                    return false;
                }
                var msg = vipPanelTips.opSuc + '<br>';
                if(vipList.length == 0){
                    msg += vipPanelTips.opClear;
                }else{
                    msg += vipPanelTips.editGroupListSuc.format('所选联系人');
                    top.addBehavior('成功添加VIP联系人');
                }
                top.Contacts.updateCache("editVipContacts", serialIds);
				
				if(options && options.notAlert){
					if (successCallback) {
						successCallback();
					}
				}else{
					top.FF.alert(msg, function(){
                        top.FF.close();
                        //js会阻塞提示框关闭, 所以设置延时
                        if (successCallback) {
                            setTimeout(function(){successCallback();}, 5); 
                        }
                    });
				}
				
                top.$App.trigger("change:contact_maindata");
            }
        }
	},

    /**
     *返回是否自动保存联系人判断
     */
    isAutoSaveContact:function(){
        var isAuto = top.$App.getUserCustomInfo(9);
        if (!isAuto || isAuto === '1') {
            return true;
        } else {
            return false;
        }
    },

    /**
     *收敛ajax请求接口
     */
    ajax: function (options) {
        if (/^\/+(mw|mw2|g2|addrsvr)\//.test(options.url)) {
            var conf = {
                headers: {},
                method: options.method,
                error: options.error,
                async: options.async,
                responseDataType: ""
            };

            if (typeof options.data == "object") {
                if (!options.contentType) {
                    options.contentType = "application/x-www-form-urlencoded"
                }
            }

            if (options.contentType) {
                conf.headers["Content-Type"] = options.contentType;
            }

            return top.M139.RichMail.API.call(options.url, options.data, function (e) {
                var isJson = options.dataType && options.dataType.toLowerCase() == "json";
                var result;
                if (isJson) {
                    result = e.responseData;
                } else {
                    result = e.responseText;
                }
                if (options.success) {
                    options.success(result);
                }
            }, conf);
        } else {
            return doJQAJAX();
        }
        function doJQAJAX() {
            return $.ajax(options);
        }
    },


    scriptReady: function(target, callback) {
        var _this = this;
        var _caller = _this.scriptReady.caller;

        M139.core.utilCreateScriptTag(
            {
                id: "contact_async_method",
                src: $App.getResourceHost() + "/m2012/js/packs/m2012_contacts_async.pack.js",
                charset: "utf-8"
            },
            function(){
                if ("string" === typeof target && _caller === _this[target]) {
                    window.console && console.log("[ERROR] Contacts." + target + "() not found");
                    return;
                }

                if ("function" === typeof target) target();
                if ("function" === typeof callback) callback();
            }
        );
    },

    data: {
        groups: null, //联系人组
        contacts: null, //联系人
        map: null, //组关系
        lastestContacts: null, //最近联系人
        userSerialId: null,
        birthdayContacts: null, //即将生日的好友，
        Vip: null //vip联系人信息
    },

    onchangeListeners: [],
    change: function(func) {
        this.onchangeListeners.push(func);
    },
    onchange: function(args) {
        $(this.onchangeListeners).each(function() {
            try {
                this(args);
            } catch (e) { }
        })
    },

    FROMTYPE: {
        MAIL: 0x10,  //电子邮件
        MOBILE: 0x20,//短彩信
        FAX: 0x40,   //传真

        NONE: 0,     //默认
        SMS: 1,      //发短信成功页
        CARD: 2,     //发贺卡成功页
        POST: 3,     //发明信片成功页
        EMAIL: 4,    //发邮件成功页
        MMS: 5,      //发彩信成功页
        FILE: 6      //发文件快递成功页
    },

    ConvertFrom : function(a){
        var F=this.FROMTYPE;
        var from = a & 0x0f; //取来源
        var type = a & 0xf0; //来类别
        var last = '1';
        var key = 'E';

        if(from == F.MMS){
            last = "2";
        }

        switch(type){
            case F.FAX: key='F'; break;
            case F.MAIL: key='E'; break;
            case F.MOBILE: key='M'; break;
        }

        return {'from': from, 'type': type, 'key': key, 'last': last};
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

    _addrDataNull: {
        ContactsMap: [],
        TotalRecord: 0,
        Vip: [],
        birthdayContacts: [],
        closeContacts: [],
        contacts: [],
        contactsHasRecord: {},
        groups: [],
        groupsMap: {},
        lastContactsDetail: [],
        lastestContacts: [],
        map: [],
        strangerHasRecord: {},
        userSerialId: "",
        vipDetails: {
            hasContact: false,
            isExist: false,
            vipContacts: [],
            vipEmails: [],
            vipGroupId: "",
            vipSerialIds: "",
            vipn: "0"
        }
    },

    createContacts: function(){

        var ci = M2012.Contacts.ContactsInfo;

        window.Contacts = {};
        window.ContactsInfo = ci;

        //联系人搜索
        window.ContactsInfo.prototype.search = function(keyword) {
            var text = (this.name + "," + this.emails + "," + this.mobiles + "," + this.faxes);
            if (this.Quanpin || this.Jianpin) text += "," + this.Quanpin + "," + this.Jianpin;
            //tofix: 下面的职务与公司名，在GetUserAddrJsonData接口并未返回，所以下面的条件永远不生效
            if(this.UserJob)text+=","+this.UserJob;
            if(this.CPName)text+=","+this.CPName;
            return text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
        }

        /**
         * 验证通讯录实体对象的数据合法性
         * @param uncheckEmpty boolean 不检查关键字段是否为空
         * @return object
         *  {success: boolean,
         *   msg: string,
         *   errorProperty: string
         *  }
         */
        window.ContactsInfo.prototype.validateDetails=function(uncheckEmpty){
            var T = this;
            if (!uncheckEmpty){
                if(!T.name || T.name.trim()==""){
                    return failResult("请输入姓名","name");
                }
                if(T.FamilyEmail)T.FamilyEmail=T.FamilyEmail.trim();
                if(T.MobilePhone)T.MobilePhone=T.MobilePhone.trim();
                if(T.OtherEmail)T.OtherEmail=T.OtherEmail.trim();
                if(T.OtherMobilePhone)T.OtherMobilePhone=T.OtherMobilePhone.trim();
                if(!T.FamilyEmail && !T.MobilePhone && !T.BusinessEmail && !T.BusinessMobile){
                    return failResult("电子邮箱和手机号码，请至少填写一项");
                }
            }
            

            if(T.AddGroupName){
                if(Contacts.getGroupByName(T.AddGroupName)){
                    return failResult("新建的组名已存在","AddGroupName");
                }else{
                    T.AddNewGroup="true";
                }
            }
            if(T.FamilyEmail){
                  var emaiLen = T.FamilyEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.FamilyEmail) ){
                    return failResult("电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
            if(T.BusinessEmail){
                  var emaiLen = T.BusinessEmail.length;
                  var lenCheck = (emaiLen >= 6 && emaiLen<= 90)
                  if(!lenCheck  ||!Validate.test("email",T.BusinessEmail) ){
                    return failResult("商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位");
                  }
             }
              
            if(T.MobilePhone && !Validate.test("mobile",T.MobilePhone)){
                return failResult("手机号码格式不正确，请输入3-20位数字");
             }
             
             if(T.BusinessMobile && !Validate.test("mobile",T.BusinessMobile)){
                return failResult("商务手机格式不正确，请输入3-20位数字");
             }
            
             if(T.CPZipCode && !Validate.test("zipcode",T.CPZipCode)){
                  return failResult("公司邮编格式不正确，请输入3-10位字母、数字、-或空格");
             }
                
            //if(T.ZipCode && !Validate.test("zipcode",T.ZipCode)){
            //    return failResult("邮政邮编格式不正确，请输入3-10位字母、数字、-或空格");
            // }    
            if(T.FamilyPhone && !Validate.test("phone",T.FamilyPhone)){
                return failResult("常用固话格式不正确，请输入3-30位数字、-", "familyphone");
            }
            if(T.BusinessPhone && !Validate.test("phone",T.BusinessPhone)){
                return failResult("公司固话格式不正确，请输入3-30位数字、-");
            }
            //if(T.OtherPhone && !Validate.test("phone",T.OtherPhone)){
            //  return failResult("常用固话格式不正确，请输入3-30位数字、-");
            //}

            if(T.BusinessFax && !Validate.test("fax",T.BusinessFax)){
                return failResult("传真号码格式不正确，请输入3-30位数字、-");
            }

            if(T.BirDay && !Validate.testBirthday(T.BirDay)){
                return failResult("请输入正确的生日日期:"+T.BirDay,"BirDay");
            }

            if(T.OtherIm && !Validate.test("otherim",T.OtherIm)){
                return failResult("飞信号格式不正确，请输入6-10位数字");
            }

            return {success:true};
            function failResult(msg,property){
                return {
                    success:false,
                    msg:msg,
                    errorProperty:property||""
                };
            }
        };

        $.extend(window.Contacts, _base);
        
        var _this = this;
        _this.attacthContactMethod();

        $App.on("GlobalContactLoad", function (args) {
            _base.runWaiting();
        });

        $App.on("contactLoad", function (args) {
            _this.loadContactData();
        });

        $App.on("contactUpdate", function (args) {
            _this.loadContactData();
        });
    },

    loadContactData: function() {
        var _this = this;
        var _data = false;

        M139.Timing.waitForReady(
        function(){
            return _data;
        },
        function(){
            var temp = $.extend({}, _this._addrDataNull);
            $.extend(temp, _data);

            temp.ContactsMap = temp.contactsMap;
            
            (function(tmp){
                var _vip = tmp.vip;
                _vip.contacts = _vip.contacts || [];
                _vip.groupId = _vip.groupId || "";
                var _vipCount = _vip.contacts.length;

                var i = 0;
                var _vipEmails = [];
                var _vipContacts = [];

                for (i = 0; i < _vipCount; i++) {
                    var contact = tmp.contactsMap[_vip.contacts[i]];
                    if (contact) { _vipContacts.push(contact); }
                }

                for (i = 0; i < _vipContacts.length; i++) {
                    var _vipContact = _vipContacts[i];
                    var _vipContactEmails = [];
                    if(_vipContact.FamilyEmail) _vipContactEmails.push(_vipContact.FamilyEmail);
                    if(_vipContact.BusinessEmail) _vipContactEmails.push(_vipContact.BusinessEmail);
                    _vipEmails = _vipEmails.concat(_vipContactEmails);  //VIP联系人增加至10个，搜索VIP联系人的“常用、商务”2个邮箱
                }

                tmp.vipDetails = {
                    isExist      : _vip.groupId.length > 0,   //vip联系人分组是否存在
                    hasContact   : _vipCount > 0,   //
                    vipGroupId   : _vip.groupId || "vip",
                    vipContacts  : _vipContacts || "",
                    vipEmails    : _vipEmails || "",
                    vipSerialIds : _vip.contacts.join(",") || "", 
                    vipn         : _vipCount || 0
                }
            })(temp);

            window.Contacts.data = temp;
            window.Contacts.isReady = true;

            top.$App.trigger("GlobalContactLoad", temp);
        });

        $App.getModel("contacts").requireData(function(data){
            _data = data;
        });
    }

})
top.Retry={
	retryTime : 0,
	retryData : "",
	retryFun : null
} ; //home页全局变量，用来做重试操作使用。

})(jQuery, _, M139);
