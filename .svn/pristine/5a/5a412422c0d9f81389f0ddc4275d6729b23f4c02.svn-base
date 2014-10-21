$(document).ready(function(){
    MailDetail.init();
    MailDetail.renderToolbar();
    //top.SimpleFrame.onResize();
    $(window).resize(function(){
        var Height = $(window).height() - $('.mail-scroll').offset().top;
        $(".mail-scroll").height(Height);
    })
    if ($(".attach div").height() > 80) {
        $(".attach div").height(80);
    }
    MailOperating.refreshMailsCount();
    //window.setTimeout("location.reload(true)",180000);	

    var gn = $("#gn").val();
    //var url=window.location.href+"/GroupMail/GroupOper/EditGroup.aspx?sid="+top.sid+"&gn="+gn
    var groupTitle = $(".from strong a");
    //var orignHref = groupTitle.attr("href");
    groupTitle.attr("href", "javascript:top.$App.show(\"groupMailEditGroup\",\"&gn="+gn+"\")")
});

function onModuleClose(){
    if (EditorManager.getHtmlToTextContent().trim() != '') {
        //关闭标签，未发送到内容将会丢失，是否关闭?
        return window.confirm(frameworkMessage.closeDetail);
    }
}

var MailDetail = {
    load: function(id){
        //获邮件内容        
        $.post2({
            url: "../GroupMailAPI/GetGroupMail.ashx",
            data: {
                sid: top.UserData.ssoSid,
                id: id
            },
            success: function(result){
                if (result.resultCode == 0) {
                    $(".mail-cont").empty().append(result.resultData.html);
                    $('.result-mail').hover(function(){
                        $(this).find(".s_complaint").show()
                    }, function(){
                        $(this).find(".s_complaint").hide()
                    });
                    if (result.resultData.verify == 'true') {
                        $(".verify").show();
                    }
                }
            }
        });
    },
    init: function(A){
        var Height = $(window).height() - $('.mail-scroll').offset().top;
        $(".mail-scroll").height(Height);
        //$("#quickeditor").hide();
        //初始化编辑器		
        var editor = EditorManager.create({
            container: document.getElementById("quickeditor"),
            hidToolBar: true,
            version: 2,
            height: 80
        });
        $("#reply").bind("click", MailDetail.quickReply);
        var url = "/GroupMail/GroupOper/GroupManager.aspx?sid=" + top.UserData.ssoSid;
        $("#setnotify").click(function(){
            top.$App.show("groupMailSetting");
        });
        this.TopicId = top.Utils.queryString("id", window.location.href);
        this.isReject = parseInt($("#reject").val());
        this.isGReject = parseInt($("#greject").val());
        this.isLogout = parseInt($("#glogout").val());
        if (this.isLogout) {
            $("#setnotify").hide();
            $("div.quickReply").hide();
        }
        this.MailFolder = top.Utils.queryString("mf", window.location.href);
        if (!this.isGReject) {
            $("#btReject").text("拒收此群");
            $("#alreadyReject").hide();
        }
        $("#btReject").bind("click", this.doGReject);
        
        //绑定插入表情按钮事件
        FaceBox.callBack = function(url){
            EditorManager.insertImage(url);
        }
        $("#showface,.face>i").bind('click', function(e){
            if (FaceBox.isShow) {
                FaceBox.hide()
            }
            else {
                $("#areaEditor").hide();
                $("#quickeditor").show();
                FaceBox.show(10, 30, this)
                e.preventDefault();
                e.stopPropagation();
            }
        });
        
        $('.result-mail').hover(function(){
            $(this).find(".s_complaint").show()
        }, function(){
            $(this).find(".s_complaint").hide()
        });
    },
    quickReply: function(){
        //回复主题       
        if (EditorManager.getHtmlToTextContent().trim() == '' && !EditorManager.getHtmlContent().match(/<img[^>]+?>/i)) {
            //请先输入回复内容。
            Tool.FF.alert(frameworkMessage.replyContent);
            return;
        }
        if ($("tr.verify").css("display") != 'none' && $("#txt_Auth_code").val() == '') {
            //请输入验证码。
            Tool.FF.alert(frameworkMessage.verifyCode);
            return;
        }
        $("#reply").unbind("click");
        top.WaitPannel.show("正在发送，请稍候...");
        $.post2({
            url: "../GroupMailAPI/SendGroupMail.ashx",
            data: {
                sid: top.UserData.ssoSid,
                id: MailDetail.TopicId,
                action: "reply",
                content: EditorManager.getHtmlContent(),
                code: $("#txt_Auth_code").val(),
                gn: $("#gn").val(),
                lTime: $("#lTime").val() //上次回复时间
            },
            success: function(result){
                if (result.resultCode == 0) {
                    EditorManager.setHtmlContent('');
                    $("#txt_Auth_code").val('');
                    $("#sp_imgValidate").hide();
                    if (result.resultData.needRefresh == 'true') {
                        MailDetail.load(MailDetail.TopicId);
                        return;
                    }
                    else {
                        var originatecount = parseInt($("div.result-mail:first-child>em>span").text());
                        $(".mail-cont").prepend(result.resultData.html);
                        $("div.result-mail:first-child>em>span").text(originatecount + 1 + "楼");
                        if (result.resultData.verify == 'true') {
                            $(".verify").show();
                        }
                    }
                }
                if (result.resultCode == 1) {
                    Tool.FF.alert(result.errorMsg);
                    $("#sp_imgValidate").show();
                    return;
                }
                
            },
            complete: function(){
                $("#reply").bind("click", MailDetail.quickReply);
                top.WaitPannel.hide();
                $('.result-mail').hover(function(){
                    $(this).find(".s_complaint").show()
                }, function(){
                    $(this).find(".s_complaint").hide()
                });
            }
            
        });
    },
    renderToolbar: function(){
        var div = $(".toolbar");
        div.append(Menu.createButton("返回", function(){
            top.Main.closeCurrentModule();
            top.Links.show("groupMail");
            Utils.stopEvent();
        }));
        if (!MailDetail.isLogout) {
            div.append(Menu.createButton("回复", function(){
                MailDetail.reply(MailDetail.TopicId, function(e){
                });
                Utils.stopEvent();
            }));
        }
        div.append(Menu.createButton("转发", function(){
            
            var subject = $('div.mailHeader>h1');

            if (subject.length > 0) {
                subject = subject[0].firstChild;
            }

            if (subject.nodeValue) {
                subject = subject.textContent || subject.nodeValue;
            }

            if (typeof(subject) === 'string') {
                subject = $.trim(subject);
            } else {
                subject = $.trim($('div.mailHeader>h1').text());
            }

            top.$App.show("compose", null, {
                inputData:
                    {
                        subject: "Fw:" + subject,
                        content: MailDetail.getContent(subject)
                    }
            });
            Utils.stopEvent();
        }))
        if (this.MailFolder != "delete") {
            div.append(Menu.createButton("删除", function(id){
                MailOperating['delete'](MailDetail.TopicId, function(e){
                    if (e) {
                        refreshGroupMailList();
                        top.Main.closeCurrentModule();
                    }
                });
                Utils.stopEvent();
                
		        // add by tkh 渲染左侧未读邮件数
		        top.$App.trigger("userAttrChange", {
		            callback: function () {
		                top.$App.trigger("reduceGroupMail", {});
		            }
		        });
                
            }))
        }
        if (this.MailFolder == "delete") {
            div.append(Menu.createButton("还原", function(){
                MailOperating.canceldelete(MailDetail.TopicId, function(e){
                    if (e) {
                        refreshGroupMailList();
                        top.Main.closeCurrentModule();
                    }
                });
                Utils.stopEvent();
            }));
        }
        div.append(Menu.createButton("彻底删除", function(){
            FloatingFrame.confirm("彻底删除此邮件后将无法取回，您确定要彻底删除吗？", function(){
                MailOperating.truncate(MailDetail.TopicId, function(e){
                    if (e) {
                        refreshGroupMailList();
                        top.Main.closeCurrentModule();
                        
                    }
                })
            })
            Utils.stopEvent();
        }));
        
        //添加上下页容器
        //this.pageBar = document.createElement("div");
        //this.pageBar.className = "pagebar";
        //this.pageBar.id = "pagebar";
        //div.append(this.pageBar);
        return div;
    },
    reply: function(){
        var gName = $("#gName").val();
        var gn = $("#gn").val();
        var subject = $("#subject").val();
        var url = top.ucDomain + '/GroupMail/GroupMail/ComposeGroupmail.aspx?action=reply&sid=' + top.UserData.ssoSid + '&id=' + MailDetail.TopicId + '&gn=' + gn + '&gName=' + encodeURIComponent(gName) + "&subject=" + encodeURIComponent(subject) + "&mf=" + this.MailFolder;
        top.CGM.show({
            url: url
        });
    },
    doGReject: function(){
        var url = "../GroupMailAPI/UserGroupSliderAction.ashx"
        if (!MailDetail.isGReject) {
            $.post2({
                url: url,
                data: {
                    sid: top.UserData.ssoSid,
                    gid: $("#gn").val(),
                    act: "rejected"
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        MailDetail.isGReject = true;
                        $("#btReject").text("启动收取");
                        $("#alreadyReject").show();
                    }
                }
            });
            
        }
        else {
            $.post2({
                url: url,
                data: {
                    sid: top.UserData.ssoSid,
                    gid: $("#gn").val(),
                    act: "received"
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        MailDetail.isGReject = false;
                        $("#btReject").text("拒收此群");
                        $("#alreadyReject").hide();
                    }
                }
            });
        }
    },
    getContent: function(subject){
        var resourcePath = window.top.resourcePath;
        var resourcePath = resourcePath.replace("coremail", "groupmail");
        var text = "href='" + resourcePath + "/css/transmit.css'";
        var templete = "<link rel=\'stylesheet\' type=\'text/css\' " + text + "/>\
		<div id=\'transmit\'>\
		<ul>\
	<li>--------以下是转发邮件信息--------</li>\
<li>发件人：" +
        $("tr.from>td>strong").text().trim() +
        "</li>\
<li>日期：" +
        $(".mailHeader>p.date").text().trim() +
        "</li>\
<li>主题：" +
        Utils.htmlEncode(subject) +
        "</li>\
</ul>";
        $.each($('div.result-mail'), function(i, n){
            templ = "<div class=\"result-mail mail-2\">\
<em><span>" + $(n).find('em>span').html().trim() + "</span></em>\
<h4><i class=\"i-group-4\"></i><strong>" +
            $(n).find('strong').text().trim() +
            "</strong><span>" +
            $(n).find('span:nth-child(2)').text().trim() +
            "</span><span>" +
            $(n).find('span:nth-child(3)').text().trim() +
            "</span> \
</h4><p><div>" +
            $(n).find('div:first').html().trim() +
            "</div></p>\
</div>";
            templete += templ.trim();
        });
        templete += "</div>";
        return templete;
    },
    Complaint: function(sender, floorid, ower){
        var content = "主题：" + $("#subject").val() + "\n\r内容：" + $("#floor_" + floorid).html();
        var data = {
            'gn': $("#gn").val(),
            'gtype': $("#gtype").val(),
            'tid': this.TopicId,
            'fid': floorid,
            'ower': ower,
            'content': content
        };
        MailDetail.sender=sender;
        MailDetail.floorid=floorid;
        Spam.Complaint('topic', data, this.complaintCallBack);
       
    },
    complaintCallBack:function(result)
    {
        if (result.resultCode == 0) {
            if (result && result.resultData.result == 'OK') {
                $(MailDetail.sender).replaceWith("<span>已举报，正在审核中</span>");
                if (MailDetail.floorid == 1) {
                    $(".topicComplaint").replaceWith("<span>已举报，正在审核中</span>");
                }
            }
        }       
    }
}
