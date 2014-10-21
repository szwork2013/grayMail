$(document).ready(function(){
    gname = decodeURIComponent(Tool.getUrlParamValue(window.location.href, "gname"));
    topicid = top.Utils.queryString("id", window.location.href);
    MailFolder = top.Utils.queryString("mf", window.location.href);
    subject = decodeURIComponent(Tool.getUrlParamValue(window.location.href, "subject"));
    $("#groupName").text(gname);
    $("#check").bind("click", function(){
        var url = top.ucDomain + "/groupmail/groupmail/GroupmailDetail.aspx?sid=" + top.UserData.ssoSid + "&id=" + topicid + "&mf=" + MailFolder +"&rn="+Math.random();
        //阅读某封群邮件
        top.Main.closeCurrentModule();
        top.RGM.show({
			sid:top.UserData.ssoSid,
            id: topicid,//群邮件id
            url:url,//该iframe的地址
            title: subject          
        });
        
    });
    $("#write").bind("click", function(){
        top.Main.closeCurrentModule();
        var url = top.ucDomain + "/groupmail/groupmail/ComposeGroupmail.aspx?sid=" + top.UserData.ssoSid + "&action=write&rn="+Math.random();
        /*top.CGM.show({
            url: url
        });*/
        top.$App.showUrl(url, "群邮件");
    });
    $("#cancel").bind("click", function(){
        //window.location.href = "../groupEmailList.htm?sid=" + top.UserData.ssoSid;
        top.Main.closeCurrentModule();
        top.$App.show("groupMail");
    });
});
