//Global variable
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
