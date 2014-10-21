ContactsSelectList = {
    container: null,
    fill: function(container, title) {
        if (typeof container == "string") container = document.getElementById(container);
        container.innerHTML = '<fieldset>\
        <legend><span id="labelTitle">选择要共享的联系人</span></legend>\
        <dl class="checkContact">\
            <dt>您的139邮箱中，共有<strong class="numberStrong" id="labelCount"> - </strong>个联系人</dt>\
            <p class="search"><input id="txtKeyword2" type="text" title="查找联系人..." class="text"><button id="btnSearch2" type="button"></button></p>\
            <dd id="listContainer">\
            </dd>\
        </dl>\
        <p class="checkAction">选择：<a href="javascript:;" id="aSelectAll">全选</a> | <a href="javascript:;" id="aCancelAll">清空</a> |\
        <a href="javascript:;" id="aSelectOthers">反选</a></p>\
        </fieldset>';
        container = $("#listContainer")[0];
        this.container = container;
        var contacts = window.top.Contacts.data.contacts;
        var groups = window.top.Contacts.data.groups;
        container.innerHTML = "<dl class='current'><dt><label for='chkAll'><input type='checkbox' id='chkAll' />全部联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";
        $(container).hide();
        var dlAll = $(container).find("dl:eq(0)")[0];
        var ulAll = $(container).find("ul:eq(0)")[0];
        var tempRow = $("<li><label><input type='checkbox' /></label></li>")[0];
        for (var i = 0, len = contacts.length; i < len; i++) {
            var item = contacts[i];
            var row = tempRow.cloneNode(true);
            row.setAttribute("SerialId", item.SerialId);
            var email = item.getFirstEmail();
            email = email ? " <" + email + ">" : "";
            row.firstChild.appendChild(document.createTextNode(item.name + email));
            ulAll.appendChild(row);
        }

        document.getElementById("txtKeyword2").onkeypress = function(e){
            e = e || window.event;
            if(e.keyCode==13){
                ContactsSelectList.search();
            }
        };
        document.getElementById("btnSearch2").onclick = function(){
            ContactsSelectList.search();
        };
        
        //未分组
        var notInGroups = getContactsNotInGroup();
        if (notInGroups.count > 0) {
            var htmlCode = "<dl><dt><label for='chkNotInGroup'><input type='checkbox' id='chkNotInGroup' />未分组联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";
            var ulGroup = $(htmlCode).appendTo(container).find("ul:eq(0)")[0];
            var contactsMap = top.Contacts.data.ContactsMap;
            for (var sid in notInGroups.contactsMap) {
                var item = contactsMap[sid];
                if (!item) continue;
                var row = tempRow.cloneNode(true);
                row.setAttribute("SerialId", item.SerialId);
                var email = item.getFirstEmail();
                email = email ? " <" + email + ">" : "";
                row.firstChild.appendChild(document.createTextNode(item.name + email));
                ulGroup.appendChild(row);
            }
        }

        for (var i = 0, len = groups.length; i < len; i++) {
            var group = groups[i];
            var list = window.top.Contacts.getContactsByGroupId(group.GroupId);
            var htmlCode = "<dl><dt><label for='chkGroup{0}'><input type='checkbox' id='chkGroup{0}' />{1} </label><i class='switchButton' style='display:{2}'></i></dt><dd><ul></ul></dd></dl>".format(Utils.htmlEncode(group.GroupId), Utils.htmlEncode(group.GroupName), list.length == 0 ? "none" : "");
            var ulGroup = $(htmlCode).appendTo(container).find("ul:eq(0)")[0];

            for (var j = 0, jlen = list.length; j < jlen; j++) {
                var item = list[j];
                var row = tempRow.cloneNode(true);
                row.setAttribute("SerialId", item.SerialId);
                var email = item.getFirstEmail();
                email = email ? " <" + email + ">" : "";
                row.firstChild.appendChild(document.createTextNode(item.name + email));
                ulGroup.appendChild(row);
            }
        }
        $("#labelCount").text(top.Contacts.getContactsCount());
        if (title) $("#labelTitle").text(title);
        $(container).click(function(e) {
            var target = e.target;
            if (target.tagName == "LABEL") {
                if (target.firstChild.tagName == "INPUT" && !target.firstChild.id) {
                    target.firstChild.checked = !target.firstChild.checked;
                    return false;
                }
            }
        });
        $(container).show();
        this.bindEvent();
    },

    search: function() {
        var txt = document.getElementById("txtKeyword2");
        var keyword = txt.value.trim();
        if (keyword.length <1){
            this.fill(document.getElementById("ContactGroups"));
            return;
        }
        var arr=[];
        $(window.top.Contacts.data.contacts).each(function(){
            if(this.search(keyword)){
                arr.push(this);
            }
        });
        var container = $("#listContainer")[0];
        container.innerHTML = "<dl class='current'><dt><label for='chkAll'><input type='checkbox' id='chkAll' />全部联系人 </label><i class='switchButton'></i></dt><dd><ul></ul></dd></dl>";

        var dlAll = $(container).find("dl:eq(0)")[0];
        var ulAll = $(container).find("ul:eq(0)")[0];
        var tempRow = $("<li><label><input type='checkbox' /></label></li>")[0];

        var enableHigh = keyword.length > 0;
        var kw2 = "<b>"+keyword+"</b>";
        var reg = new RegExp(keyword, "ig");

        for (var i = 0, len = arr.length; i < len; i++) {
            var item = arr[i];
            var row = tempRow.cloneNode(true);
            row.setAttribute("SerialId", item.SerialId);
            var email = item.getFirstEmail();
            email = email ? " &lt;" + email + "&gt;" : "";
            var name = item.name;

            if (enableHigh){
                name = name.replace(reg, kw2)
                email = email.replace(reg, kw2);
            }
            
            var con = document.createElement("span");
            con.innerHTML = name + email;
            row.firstChild.appendChild(con);
            ulAll.appendChild(row);
        }
        this.bindEvent();
    },

    bindEvent: function() {
        $("i.switchButton").click(
            function() {
                var dl = $(this.parentNode.parentNode);
                if (dl.hasClass("current")) {
                    dl.removeClass("current");
                } else {
                    dl.addClass("current");
                }
            }
        );
        $("dt input:checkbox").click(
            function() {
                var value = this.checked ? true : null;
                $(this.parentNode.parentNode).next("dd").find("input:checkbox").attr("checked", value);
            }
        );
        $("#aSelectAll").click(function() {
            ContactsSelectList.selectAll();
        });
        $("#aSelectOthers").click(function() {
            ContactsSelectList.selectOthers();
        });
        $("#aCancelAll").click(function() {
            ContactsSelectList.cancelAll();
        });
    },
    selectAll: function() {
        $(this.container).find("dl input:checkbox").attr("checked", true);
    },
    selectOthers: function() {
        $(this.container).find("dl dd input:checkbox").each(function() {
            this.checked = !this.checked;
        });
    },
    cancelAll: function() {
        $(this.container).find("dl input:checkbox").attr("checked", null);
    },
    getSelectedContacts: function() {
        var hashTable = {};
        $(this.container).find("input:checked").each(function() {
            var serialId = this.parentNode.parentNode.getAttribute("SerialId");
            if (serialId) hashTable[serialId] = true;
        });
        var result = [];
        for (var p in hashTable) {
            result.push(p);
        }
        return result;
    }
}

function getContactsNotInGroup() {
    var map = top.Contacts.data.map;
    var contactsMap = top.Contacts.data.ContactsMap;
    var addrsInGroup = {};
    var addrsNotInGroup = {};
    var addrsNotInGroupCount = 0;
    for (var i = 0, len = map.length; i < len; i++) {
        addrsInGroup[map[i].SerialId] = true;
    }
    for (var serialId in contactsMap) {
        if (!addrsInGroup[serialId]) {
            addrsNotInGroup[serialId] = true;
            addrsNotInGroupCount++;
        }
    }
    return {
        contactsMap: addrsNotInGroup,
        count: addrsNotInGroupCount
    }
}
﻿//Global variable
var gMaxSendEmail = 50;
var gMaxShareEmail = 10;
var gAddrmenuCreated = false;

if (ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].share;
}

//common function
function HandleDataFormat(data, arr, delimiter){
    if (data == null || typeof (data) == "undefined") data = "";
    if(data.length > 0){
        var arrData = data.split(arr);
        var tmpData = "";
        for(var i = 0; i < arrData.length;i++)
        {
            if ($.trim(arrData[i]).length > 0)
            {
                tmpData += $.trim(arrData[i]) + delimiter;
            }
        }
        data = tmpData.lastIndexOf(delimiter) > 0 ? tmpData.substring(0, tmpData.lastIndexOf(delimiter)) : tmpData;
    }
    return data;
}

function GetNoNameEmail( strEmail ){
	strEmail.replace(/\s/gi, "");
	var pos1 = strEmail.lastIndexOf("<");
	var pos2 = strEmail.lastIndexOf(">");
	if (pos1>=0 && pos2>=0 && pos2 > pos1){
        return strEmail.substring(pos1+1, pos2);
	}
	else{
		return strEmail;
	}
}

var mailDomain = (function(){
    var _domain = "139.com";

    if (top.mailDomain) {
        _domain = top.mailDomain;
    }

    try { _domain = top.$App.getMailDomain() }
    catch (e) {}

    return _domain;
})();

function fixdomain(account) {
    return account + "@" + mailDomain;
}

function getAccountList() {
    var accounts = [];

    try {
        accounts = top.UserData.uidList.concat(top.uid.replace(/^86/, ''));
    } catch(e) {
        try {
            accounts = topl$User.getAccountListArray(); //带@139.com
        } catch(e) {
            var uid = (top.$User ? top.$User.getUid() : top.UserData.userNumber);
            uid = uid.replace(/^86/, '');
            accounts = [uid];
        }
    }

    for(var tmp={},i=accounts.length-1; i>-1; i--)
        tmp[accounts[i]] ? accounts.splice(i,1) : tmp[accounts[i]]=true;

    if ( accounts[0].indexOf("@") < 0 ) {
        for(i=accounts.length; i--; ) {
            accounts[i] = fixdomain(accounts[i]);
        }
    }

    window.console && console.log(accounts);
    return accounts;
}

//检查是否是用户的邮箱
function IsMyselfEmail(emails){
    var accounts = getAccountList();
    var sendList = emails.split(/[;,]/);
    for(var i = 0; i < sendList.length; i++){
        if ($.inArray(GetNoNameEmail(sendList[i]), accounts) > -1) return true;
    }

    return false;
}
//检查收件人地址合法性
function CheckEmail(obj){
    var mailReg=/^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var mailRegExt=/<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>/i;
    var result=true;
    $("#" + obj).each(
        function(){
            if(!result)return;
            this.value=$.trim(this.value);
            var txt=this.value;
            var arr=txt.split(/[;,]/);
            for(var i=0;i<arr.length;i++){
                if($.trim(arr[i])=="")continue;
                var tmpEmail = arr[i];
                arr[i]=arr[i].replace(/"[^"]*"/g,"");
                arr[i]=arr[i].replace(/</g,"").replace(/>/g,"");

                if((mailReg.test($.trim(arr[i])) || mailRegExt.test(arr[i])) && $.trim(arr[i].split('@')[1]) == mailDomain){

                }else{
                    result=false;
                    CheckEmail.errorAddr=tmpEmail;
                    return;
                }
            }
        }
    );
    return result;
}

/*************************** 共享通讯录 *******************************/
//发送共享通讯录
function CheckSendShare(){
    var sIds = ContactsSelectList.getSelectedContacts();
    var toEmails = $.trim($("#SendTo").val());
    
    toEmails = HandleDataFormat(toEmails, /[,;]/, ",");
    
    if(sIds.length == 0){
        top.FloatingFrame.alert(PageMsg['warn_noneselect']);
        return false;
    }
    if(toEmails.length == 0 || toEmails == PageMsg['warn_need139email']){
        top.FloatingFrame.alert(PageMsg['warn_need139email'],function(){$("#SendTo").focus();});
        return false;
    }
    if(!CheckEmail("SendTo")){
        top.FloatingFrame.alert(PageMsg['warn_139mailIllegal'],function(){$("#SendTo").focus();});
        return false;
    }
    if(IsMyselfEmail(toEmails)){
        top.FloatingFrame.alert(PageMsg['warn_shareToSelf'],function(){$("#SendTo").focus();});
        return false;
    }
    if(toEmails.split(',').length > gMaxShareEmail){
        top.FloatingFrame.alert(PageMsg['warn_dailyLimit'].replace("$maxshare$", gMaxShareEmail),function(){$("#SendTo").focus();});
        return false;
    }
    $("#SerialIds").val(sIds);
    return true;
}
//发送请求共享通讯录
function CheckSendRequest(){
    var toEmails = $.trim($("#RequestTo").val());
    
    toEmails = HandleDataFormat(toEmails,/[,;]/,",");
    
    if(toEmails.length == 0 || toEmails == PageMsg['warn_need139email']){
        top.FloatingFrame.alert(PageMsg['warn_need139email'],function(){$("#RequestTo").focus();});
        return false;
    }
    if(!CheckEmail("RequestTo")){
        top.FloatingFrame.alert(PageMsg['warn_139mailIllegal'],function(){$("#RequestTo").focus();});
        return false;
    }
    if(IsMyselfEmail(toEmails)){
        top.FloatingFrame.alert(PageMsg['warn_reqShareSelf'],function(){$("#RequestTo").focus();});
        return false;
    }
    if(toEmails.split(',').length > gMaxSendEmail){
        top.FloatingFrame.alert(PageMsg['warn_emailLimit'].replace("$maxsend$", gMaxSendEmail),function(){$("#RequestTo").focus();});
        return false;
    }
    return true;
}
//获取通讯录赋值焦点
function getFocusTextBox(){
    if(document.getElementById("shareTo").style.display != "none") 
        return document.getElementById("SendTo");
    else 
        return document.getElementById("RequestTo");
}

function sendShareMail(ShareTo) {
    if (!ShareTo) {
        top.WaitPannel.hide();
        top.$Msg.alert(PageMsg["error_notarget"]);
        return;
    }

    var data = {
        "userName": top.trueName || top.uid,
        "receiverEmails": ShareTo
    };

    top.$RM.call("mail:shareContact", data, function() {
        top.WaitPannel.hide();
        window.location.href = window.location.href.replace("_home", "_success");
    });
}

function reqShareMail(RequestTo) {
    var data = {
        "userName": top.trueName || top.uid,
        "receiverEmails": RequestTo
    };

    top.WaitPannel.show();
    top.$RM.call("mail:askShareContact", data, function(rs) {
        top.WaitPannel.hide();
        if (rs && rs.responseData && rs.responseData.code == "S_OK") {
            window.location.href = window.location.href.replace("_home", "_reqsuccess");
        } else {
            top.$Msg.alert(rs.responseData.summary);
        }
    });
}

//绑定共享页面事件
function BindShareButton(){

    $("#aBack").click(function(){
        setTimeout(function() {
            if(top.$Addr){ 
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);
    });
    
    //.attr("href", top.location.href.replace("index", "addr/addr_index"));

    $("#share").click(function(){
        $("#requestShare").hide();
        $("#share").addClass("current");
        $("#request").removeClass("current");
        $("#shareTo").show();
    });
    $("#request").click(function(){
        $("#shareTo").hide();
        $("#request").addClass("current");
        $("#share").removeClass("current");
        $("#requestShare").show();
    });

    var btnSend = $("#SendTo");
    btnSend.keypress(function(e){
        if(e.keyCode==13){
            $("#btnSendShare").click();
        }
    });
    btnSend.focus(function(){
        if($.trim(btnSend.val()) == PageMsg['warn_need139email'])
            btnSend.val("");
    });

    btnSend.blur(function(){
        if(btnSend.val() == "")
            btnSend.val(PageMsg['warn_need139email']);
    });

    $("#btnSendShare").click(function(){
        if(CheckSendShare()) {
            var sendto = $("#SendTo").val();
            var serialid = $("#SerialIds").val();

            top.WaitPannel.show();
            top.M2012.Contacts.API.shareContacts({
                sendto: sendto,
                serialids: serialid,
                success: function(result) {
                    sendShareMail(result.ShareTo.join(','));
                },
                error: function(result) {
                    top.WaitPannel.hide();
                    if (result && result.ResultMsg) {
                        top.FF.alert(result.ResultMsg);
                    } else {
                        top.FF.alert(PageMsg["error_system"]);
                    }
                }
            });
        }
    });

    var btnRequest = $("#RequestTo");

    btnRequest.keypress(function(e){
        if(e.keyCode==13){
            if(CheckSendRequest())
                $("#btnSendRequest").trigger($.Event("click"));
        }
    });
    btnRequest.focus(function(){
        if($.trim(btnRequest.val()) == PageMsg['warn_need139email'])
            btnRequest.val("");
    });
    btnRequest.blur(function(){
        if(btnRequest.val() == "")
            btnRequest.val(PageMsg['warn_need139email']);
    });

    $("#btnSendRequest").click(function(){
        if(CheckSendRequest()) {
            var RequestTo = $("#RequestTo").val();
            reqShareMail(RequestTo);
        }
    });

    $("#Sendaddress").click(function(){
        ShowAddress(this);
        return false;
    });
    $("#Requestaddress").click(function(){
        ShowAddress(this);
        return false;
    });
}


function AddrCallback(addr) {
    var tbox = getFocusTextBox();
    if (tbox.title == tbox.value) {
        tbox.value = GetNoNameEmail(addr);
        return;
    }

    if (! /[,，；;]$/.test(tbox.value) ) {
        tbox.value += ",";
    }

    tbox.value += GetNoNameEmail(addr);
}

//显示通讯录
function ShowAddress(sender){
 
    var addrFrame = $("#addrFrame");
    if (addrFrame.length == 0) {
        var url = "?type=email&callback=AddrCallback&useNameText=true&";
        url = top.location.href.replace("index.html?", "addrwin.html" + url);
        
        addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:310px;width:170px;position:absolute;' id='addrFrame' src='"+url+"'></iframe>");

        $(sender).after(addrFrame);
        $(document).click(function() {
            $("#addrFrame").remove();
        });
    }

    var offset = $(sender).offset();

    addrFrame.css({ left: offset.left-50 });
    if (sender.id == "Sendaddress") {
        addrFrame.css({ bottom: 19 });
    } else {
        addrFrame.css({ top: 0 });
    }

    addrFrame.show();

    if(!window.gAddrmenuCreated){
        gAddrmenuCreated=true;
        $("#SendTo").attr("title",PageMsg['warn_need139email']);
        $("#RequestTo").attr("title",PageMsg['warn_need139email']);
    }

    return false;
}
//初始化共享页面
function InitShare(){
    BindShareButton();
    
    if(Utils.queryString("email"))
        $("#SendTo").val(Utils.queryString("email"));
    if($("#SendTo").val() == "")
        $("#SendTo").val(PageMsg['warn_need139email']);
    if($("#RequestTo").val() == "")
        $("#RequestTo").val(PageMsg['warn_need139email']);
    if((Utils.queryString("type") && Utils.queryString("type").toLowerCase() == "request" && $.trim($("#type").val()) == "")
        || $.trim($("#type").val()).toLowerCase() == "request"){
        $("#shareTo").hide();
        $("#request").addClass("current");
        $("#share").removeClass("current");
        $("#requestShare").show();
    }
    ContactsSelectList.fill(document.getElementById("ContactGroups"));

    var truename = top.trueName || top.uid;
    $("#Subject").text(PageMsg['info_sharesubject'].replace("$truename$", truename));
    $("#RequestSubject").text(PageMsg['info_reqsubject'].replace("$truename$", truename));

    //成功加载共享通讯录页面
    top.addBehaviorExt({actionId:30186,thingId:0,moduleId:14});
}

/**************** 导入到通讯录 ******************/
//构造分组下拉框
function DropDownListItem(obj,optionsArray,val) { 
    if (obj){
        obj.length = 0; 
        obj.options[obj.length] = new Option("全部联系人", ""); 
        obj.options[obj.length] = new Option("新建组", "-1"); 
        if(optionsArray && optionsArray.length > 0 && obj.options != null){
            var selectIndex = -1;
            for (var i = 0; i < optionsArray.length; i++) { 
                obj.options[obj.length] = new Option(optionsArray[i].GroupName, optionsArray[i].GroupName); 
                if(val && obj.options[i].value == val) 
                    selectIndex = i;
            }
            if(selectIndex == -1){
                obj.options[0].selected = true;
            }else{
                obj.options[selectIndex].selected = true;
            }
        }
    }
}
//选中全部
function CheckAll() {
    $(".checkContact").find("input:checkbox").attr("checked","checked");
}
//取消选中全部
function CheckCancel(){
    $(".checkContact").find("input:checkbox").removeAttr("checked");
}
//反选
function CheckToggle(){
    $(".checkContact").find("input:checkbox").each(function(){
        this.checked = !this.checked;
    });
}
//设置共享者
function SetSharer(email){
    if(email){
        var fName = "";
	    email=Utils.htmlDecode(email);
	    var m=email.match(/"(.+?)"\W+<(\w+([.-]?\w)*@\w+([.-]?\w)*\.\w+([.-]?\w)*)>/i);
	    if(m){
		    fName=m[1];
	    }else{
		    fName=email;
	    }
        $("#friend").html(Utils.htmlEncode(fName));
    }
}
//初始化导入页面
function InitInput(){
    try{var GroupsList = window.top.Contacts.data.groups;}catch(e){}
    //设置联系人组
    DropDownListItem(document.getElementById("Groups"),GroupsList,"");
    
    SetSharer(Utils.queryString("email"));

    $("#aBack").attr("href", "/addr/matrix/home.htm");
    if (top.$App) {
        $("#aBack").attr("href", top.location.href.replace("/index.", "/addr/addr_index."));
    }

    $("#all").click(function(){
        CheckAll();
        return false;
    });
    $("#empty").click(function(){
        CheckCancel();
        return false;
    });
    $("#toggle").click(function(){
        CheckToggle();
        return false;
    });
    $("#Groups").change(function(){
        if($("#Groups").val() == "-1")
            $("#NewGroupName").show();
        else
            $("#NewGroupName").hide();
    });
    $("#InputSubmit").click(function(){
        return CheckInput();
    });
}
//检查导入
function CheckInput(){
    if($("#Groups").val() == "-1" && $.trim($("#NewGroupName").val()).length == 0){
        top.FF.alert(PageMsg['warn_nogroupname'],function(){$("#NewGroupName").focus();});
        return false;
    }
    return true;
}

function getMobileRegex(){
    var _regex = "/^\d{11}$/";

    try { _regex = top.UserData.regex }
    catch (e) {}

    try { _regex = top.$Mobile.getChinaMobileRegex() }
    catch (e) {}
    
    return _regex;
}

function add139com(obj, isMore)
{
    var regex = getMobileRegex();

    var regNumber = new RegExp(regex);
    var valNumber = obj.value.replace(/;/g,",").replace(/；/g,",").replace(/，/g,",");

    if(valNumber.indexOf(",")==-1){
        if(regNumber.test("86"+obj.value)){
            if(isMore){
                obj.value = fixdomain(obj.value) + ",";
            }
            else{
                obj.value= fixdomain(obj.value);
            }
        }
    }else{
        var match=valNumber.match(/[,，；;]([^;，；,]+)$/);
        if(match && regNumber.test("86"+match[1])){
            if(isMore){
                obj.value= fixdomain(valNumber) + ",";
            }
            else{
                obj.value= fixdomain(valNumber);
            }
        }
    }
}

