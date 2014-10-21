 
 //尽可能聚合顶层的对象;
var Pt = {

    sid: top.$App.getSid(),

    error: function(title, msg) {
        top.M139.Logger.getDefaultLogger().error("[" + title + "]" + msg);
    },

    alert: function() {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },

    confirm: function(){
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },

    open: function(){
        top.$Msg.open.apply(top.$Msg, arguments);
    },

    toPrivateCfg: function() {
        top.$App.show("setPrivate");
    },

    modStatus: function() {
        top.Contacts.modDealStatus.apply(top.Contacts, arguments);
    },
    
    getPage: function() {
        top.Contacts.getWhoWantAddMeData.apply(top.Contacts, arguments);
    },

    agreeAll: function() {
        top.Contacts.agreeOrRefuseAll.apply(top.Contacts, arguments);
    },
    
    param: function(key) {
        return top.$Url.queryString(key, location.href);
    },

    htmlEncode: function(str) {
        return top.$TextUtils.htmlEncode(str);
    },

    UcDomain: function(path) {
        return top.ucDomain + path;
    },

    callOldApi: function(option) {
        var api = "/g2/addr/apiserver/" + option.action;

        var data = option.data || {};

        var params = option.param || {};
        params.sid = this.sid;

        var _url = top.$Url.makeUrl(api, params);

        top.$RM.call(_url, {}, function(json) {
            json = json.responseData;

            if (json.ResultCode == 0) {
                $.isFunction(option.success) && option.success(json);
            } else {
                $.isFunction(option.error) && option.error(json);
            }

            $.isFunction(option.done) && option.done(json);
        });
    }
};
 
if (ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].whoaddme;
}
 
 //统计类
function Count_WhoAddMe(type){
    var action = 0, thing = 0;

    switch (type) {

    //同意对方的添加请求
    case "agree": 
        action = 9553;
        thing = 1;
        break;

    //忽略对方的添加请求
    case "forget":
        action = 9553;
        thing = 2;
        break;

    //全部同意所有人的添加请求
    case "agree_all":
        action = 9553;
        thing = 3;
        break;

    //全部忽略所有人的添加请求
    case "forget_all":
        action = 9553;
        thing = 4;
        break;
    }

    if (action > 0) {
        top.BH({actionId: action, thingId: thing, moduleId: 19, actionType: 10});
    }
}


var html_WhoWantAddMe1 = '<li>\
<a><img src="{7}" class="pic"/></a>\
<div class="ctn"><strong>{0}</strong><span>{1},是否同意({2})</span>\
<p>{3}</p>\
</div>\
<div class="funbox" id=\"divEmail{4}\">\
<a href="javascript:void(0);" onclick="javascript:ModDealStatus_Agree(\'{5}\');" behavior="addr_remind_agree" role="button" hidefocus="1" class="btn mr_10" style="margin-right:10px;"><em>同意</em></a>\
<a href="javascript:void(0);" onclick="javascript:ModDealStatus_Refuse(\'{6}\');" behavior="addr_remind_ignore" role="button" hidefocus="1" class="btn ml_10"><em>忽略</em></a>\
</div></li>';

var html_WhoWantAddMe2 = "<div class=\"no-data\">暂时未收到任何好友请求</div>";
var html_WhoWantAddMe3 = "{0}成功，<a href=\"javascript:void(0);\" onclick=\"javascript:top.CM.show({receiver:'{1}'});\">发邮件给他</a>";
var html_WhoWantAddMe4 = "已同意请求！<br /><a href=\"javascript:void(0);\" onclick=\"javascript:top.CM.show({receiver:'{0}'});\">发邮件给他</a>";


var dataMid, dataWhoWantAddMe, pageSize=100, pageIndex=1, isFirstLoad=true;
var p={relationId:"", userNumber:"", serialId:"", name:"", reqMsg:"", replyMsg:"", reqData:"", nextDealStatus:""};
function WhoWantAddMe_Callback(result)
{
    dataWhoWantAddMe = result;
    WhoWantAddMe_All();
}
function WhoWantAddMe_All()
{
    try{
        dataMid = dataWhoWantAddMe.list.concat();
    }catch(e){
        return;
    }
    var pageIndex=1;
    var record=dataMid.length;
    var pageCount = Math.ceil(record/pageSize);
    $("#divWhoWantAddMePage").html("");
    if(record > pageSize){
        PageTurnner.createStyle(pageCount, pageIndex, "divWhoWantAddMePage", WhoWantAddMe);
    }
    WhoWantAddMe(pageIndex);
    if(isFirstLoad)
    {
        var rid =  Pt.param("relationId");
        if(rid){
            var isHere = false;
            for (var i = 0; i < record; i++) {
                if(dataMid[i].RelationId == rid){
                    isHere = true;
                }
            }
            if(!isHere){
                top.FloatingFrame.alert(PageMsg['error_requsted']);
            }
            isFirstLoad = false; 
        }
    }
}
function WhoWantAddMe(pIndex)
{
    pageIndex = pIndex;
    var htmlCode = "";
    var record, pageMin=pageSize*(pageIndex-1), pageMax=pageSize*pageIndex;
    record = dataMid.length;
    if (record == 0) {
        $(".divWhoWantAddMeAllAgree").hide();
        $(".divWhoWantAddMeAllRefuse").hide();
        htmlCode = html_WhoWantAddMe2;
    } else {
        $(".divWhoWantAddMeAllAgree").show();
        $(".divWhoWantAddMeAllRefuse").show();
        for (var i = 0; i < record; i++) {
            if (record > pageSize) {
                if (i < pageMin) {
                    continue;
                }
                if (i >= pageMax) {
                    break;
                }
            }
            var relationId = dataMid[i].RelationId;
            var serialId = dataMid[i].SerialId;
            var name = dataMid[i].Name;
            var reqMsg = dataMid[i].ReqMsg;
            reqMsg = reqMsg.replace(/</g,"&lt;");
            reqMsg = reqMsg.replace(/>/g,"&gt;");
            var reqDate = dataMid[i].ReqDate;
            var actionMsg = "请求加你为联系人";

            if(serialId){
                actionMsg = "请求更新你的资料";
            }

            var photo = new top.M2012.Contacts.ContactsInfo(dataMid[i]).ImageUrl;


            htmlCode += html_WhoWantAddMe1.format(name, actionMsg, reqDate, reqMsg, relationId, relationId, relationId, photo);
        }
    }
    document.getElementById("divWhoWantAddMe").innerHTML = htmlCode;
}

function ModDealStatus_Agree(relationId)
{
    GetValueByRelationId(relationId);
    if(p.serialId){
        p.nextDealStatus = 4;
    }else{
        p.nextDealStatus = 1;
    }
    var q={relationId:p.relationId, dealStatus:p.nextDealStatus, groupId:"", reqMsg:"", replyMsg:"", operUserType:"1"};
    Pt.modStatus(q, function(result){
        if(result.success){
            UpdateValueByRelationId(p.relationId);
            var domain = top.coremailDomain||top.mailDomain;
            var email = p.userNumber.replace(/^86/,"")+ "@" + domain;
            if(p.serialId){
                $("#divEmail"+p.relationId).html(html_WhoWantAddMe3.format("更新", email));
            }else{
                $("#divEmail"+p.relationId).html(html_WhoWantAddMe4.format(email));
            }

            if(top.$Addr){                
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MODULE, {
                    key: 'events:contacts',
                    actionKey: '110',
                    contactId: p.relationId
                });                
            }
            
            Count_WhoAddMe("agree");
        }
    });
}

function ModDealStatus_Refuse(relationId)
{
    GetValueByRelationId(relationId);
    if(p.serialId){
        p.nextDealStatus = 6;
    }else{
        p.nextDealStatus = 3;
    }
    ModDealStatus_Refuse2("", "", relationId);
}

function ModDealStatus_Refuse2(replyMsg, groupId, relationId)
{
    var q={relationId:p.relationId, dealStatus:p.nextDealStatus, groupId:groupId, reqMsg:"", replyMsg:replyMsg, operUserType:"1"};
    Pt.modStatus(q, function(result){
        if(result.success){
            UpdateValueByRelationId(p.relationId, p.nextDealStatus);
            Count_WhoAddMe("forget");

            $("#divEmail" + relationId).parent().fadeOut(1200,function(){
                this.parentNode.removeChild(this);
            });
        }
    });
}
function GetValueByRelationId(relationId)
{
    for(var i=0; i<dataMid.length; i++){
        if(relationId == dataMid[i].RelationId){
            p.relationId = relationId;
            p.userNumber = dataMid[i].UserNumber;
            p.serialId = dataMid[i].SerialId;
            p.name = dataMid[i].Name;
            p.reqMsg = dataMid[i].ReqMsg;
            p.reqDate = dataMid[i].ReqDate;
            break;
        }
    }
}
function UpdateValueByRelationId(relationId)
{
    for(var i=0; i<dataWhoWantAddMe.list.length; i++){
        if(relationId == dataWhoWantAddMe.list[i].RelationId){
            dataWhoWantAddMe.list.splice(i,1);//删除数组元素
            break;
        }
    }
    for(var j=0; j<dataMid.length; j++){
        if(relationId == dataMid[j].RelationId){
            dataMid.splice(i,1);//删除数组元素
            break;
        }
    }
}
$(function()
{

    if(dataWhoWantAddMe == null){
        Pt.getPage(WhoWantAddMe_Callback);
    }

    $(".divWhoWantAddMeAllRefuse").click(function () {
        Pt.confirm(PageMsg['warn_reject'], function () {
            Pt.agreeAll(0, function (result) {
                if (result.success) {
                    Pt.getPage(WhoWantAddMe_Callback);
                }
            });
            Count_WhoAddMe("forget_all");
        });
        top.BH('addr_remind_allIgnore');
    });
    
    $(".divWhoWantAddMeAllAgree").click(function () {
        Pt.confirm(PageMsg['warn_agree'], function () {
            Pt.agreeAll(1, function (result) {
                if (result.success) {
                    Pt.getPage(WhoWantAddMe_Callback);
                }
            });
            Count_WhoAddMe("agree_all");
        });

        top.BH('addr_remind_allAgree');
    });
    
    $("#lnkPrivate").click(function(){
        //Pt.toPrivateCfg();
        setTimeout(function() {
            if(top.$Addr){                
                var master = top.$Addr;
                master.trigger(master.EVENTS.REDIRECT, { key: 'addr_setprivacy' });
            }
        }, 0xff);
    });

    $("#lnkMaybeknown").click(function(){
        setTimeout(function() {
            if(top.$Addr){
                var master = top.$Addr;
                master.trigger(master.EVENTS.REDIRECT, { key: 'addr_whoaddme' });
            }
        }, 0xff);
        /*
        window.location.replace("addr_maybeknown.html");*/
    });

    top.BH('addr_pageLoad_remind');
});