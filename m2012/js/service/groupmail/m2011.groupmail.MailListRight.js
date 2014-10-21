var Constants = {
    urls: {
        writeMail: "/GroupMail/GroupMail/ComposeGroupmail.aspx",
        groupManager: "/GroupMail/GroupOper/GroupManager.aspx",
        createGroup: "/GroupMail/GroupOper/CreateGroup.aspx",
        findGroup: "/GroupMail/GroupOper/FindGroup.aspx",
        getGroup: "/GroupMail/GroupMailAPI/getUserGroups.ashx",
        addUserGroup: "/GroupMail/GroupOper/AddUserGroup.aspx",
        appJoin: "/GroupMail/GroupOper/JoinPage.aspx",
        sliderAction: "/GroupMail/GroupMailAPI/UserGroupSliderAction.ashx",
        managerGroup: "/GroupMail/GroupOper/EditGroup.aspx",
        MailList: "/GroupMail/groupEmailList.htm"
    },
    msgs: {
        del: "删除群,此群所有邮件记录会被彻底删除，您确定删除本群吗?"
    }
}

if (typeof(top.CGM) === 'undefined') {
    top.M139.core.utilCreateScriptTag({id:"groupMail_scriptId", src:"/m2012/js/matrixvm/m2011.matrixvm.groupmail.js", charset:"utf-8"}, function() {});
}

function setMailOper(){
    var actions = [function(){
        var url = top.ucDomain + Constants.urls.writeMail + "?" +
        $.param({
            action: "write",
            sid: top.sid
        })

        top.CGM.show({
            url: url
        });
    } //写群邮件 
, Constants.urls.MailList + "?sid=" + top.sid + "&rn=" + Math.random()//所有群邮件
, Constants.urls.MailList + "?mf=delete&sid=" + top.sid + "&rn=" + Math.random()//已删除邮件
, Constants.urls.groupManager + "?sid=" + top.sid + "&rn=" + Math.random() //群邮件管理
, Constants.urls.createGroup + "?sid=" + top.sid + "&rn=" + Math.random() //创建群
, Constants.urls.findGroup + "?sid=" + top.sid + "&rn=" + Math.random()]; //查找群
    $("div.mail-oper a").each(function(index){
        $(this).click(function(e){
            var action = actions[index];
            if (action === null) {
                return;
            }
            if (typeof(action) == "string") {
                window.location.href = action;
            }
            else {
                action();
            }
            e.preventDefault();
        });
    });
    
    var mf = top.Utils.queryString("mf", window.location.href);
    $("div.mail-oper p").removeClass("current");
    if (mf == 'delete') {
        $("div.mail-oper p").eq(1).addClass("current")
    }
    else {
        $("div.mail-oper p").eq(0).addClass("current")
    }
    
}

function setTabAdd(){
    var liArray = $(".tab-add>li");
    //飞信群
    $(liArray[0]).click(function(){
        if (window.isloading) {
            Tool.FF.alert("数据读取中，请稍候操作");
            return;
        }
        liArray.removeClass("current");
        $(this).addClass("current");
        renderGroupList.render();
    });
    //自建群
    $(liArray[1]).click(function(){
        if (window.isloading) {
            Tool.FF.alert("数据读取中，请稍候操作");
            return;
        }
        liArray.removeClass("current");
        $(this).addClass("current");
        renderGroupList.render();
    });
    
}

function setSider(){
	$(".switch-bar>a").attr("href","javascript:")
    $(".switch-bar>a").click(function(){
        if ($(this).find("i").hasClass("arrow-l")) {
            $(this).find("i").removeClass("arrow-l").addClass("arrow-r");
            $(".mailList-sider").show();
            $(".switch-bar")[0].style.right = "196px";
            $(".mailList-wrapper")[0].style.marginRight = "215px";
        }
        else {
            $(this).find("i").removeClass("arrow-r").addClass("arrow-l");
            $(".mailList-sider").hide();
            $(".switch-bar")[0].style.right = "0px";
            $(".mailList-wrapper")[0].style.marginRight = "20px";
        }
    });
}

window["getGroupType"] = function(){
    return $(".tab-add>li:eq(0)").hasClass("current") ? "fetionGroup" : "139Group";
}

function reloadCenterMailList(gn){
    if (gn == null) {
        gn = "";
    }
    gn = gn + "";
    if (gn != window["cacheGN"]) {
        window["cacheGN"] = gn;
        MB.pageIndex = 1;
        MB.run();
    }
}

var renderGroupList = {
    load: function(callback, refresh){
        if (!window["cacheGroupList"] || refresh) {
            window.isloading = true;
            $.post2({
                url: Constants.urls.getGroup,
                data: {
                    sid: top.sid,
                    mf: top.Utils.queryString("mf", window.location.href)
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        window["cacheGroupList"] = result.resultData;
                        if (callback) {
                            callback();
                        }
                        if (result.resultData.MaxGroupCount <= result.resultData.CreatedCount) {
                            $("div.mail-oper p")[3].style.display = 'none';
                            
                        }
                    }
                },
                complete: function(){
                    window.isloading = false;
                }
            });
        }
    },
    render: function(list){
        if (!list) {
            var dataName = window["getGroupType"]();
            list = window["cacheGroupList"][dataName];
        }
        if (Tool.isEmptyArray(list.openList, list.refuseList, list.nomemberList, list.cancelList, list.exitList)) {
            $(".mailList-sider>.no-note").show();
            $(".group-list").hide();
            MB.showNoGroup();
            return;
        }
        $(".mailList-sider>.no-note").hide();
        
        var groupList = $("#groups");
        groupList.empty();
        renderGroupList.renderNormal(list.openList, groupList, list); //普通群
        renderGroupList.renderNoMember(list.nomemberList, groupList, list); //无成员      
        renderGroupList.renderRejected(list.refuseList, groupList, list); //已拒收
        renderGroupList.renderQuited(list.exitList, groupList, list); //已退出
        renderGroupList.renderUnregister(list.cancelList, groupList, list); //已注销     
        groupList.show();
        MB.run();
    },
    onResize: function(){
        var vheight = $(window).height() - $(".group-list").offset().top - $(".point-msg").height();
        $(".group-list").height(vheight);
        if ($(".group-list").get()[0].scrollHeight > $(".group-list").height()) {
            $("div.group-list>div>p>i").addClass("no-g");
            $("div.group-list>div>p>strong").addClass("no-g");
            $("div.group-list>div>p>span").addClass("no-g");
        }
    },
    renderNormal: function(normalList, groupList, list){
        if (Tool.isEmptyArray(normalList)) {
            return;
        }
        var offString = "关闭新邮件提示";
        var onString = "开启新邮件提示";
        var container = $("<div class=\"mail-oper group-list\"></div>");
        $.each(normalList, function(){
            var data = this;
            var template = $("<div class=\"group-box\"><p><i class=\"i-group\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
            data.groupName +
            "&#13群号码：" +
            data.groupNumber +
            "\">" +
            data.groupName +
            "</a>" +
            renderGroupList.renderCount(data) +
            "<a href=\"javascript:void(0)\" class=\"func\" style=\"display:none\">管理</a></p>" +
            "<ul style='display:none'>" +
            "     <li><a href=\"#\">写群邮件</a></li>" +
            "     <li><a href=\"#\">拒收此群邮件</a></li>" +
            "     <li><a href=\"#\"></a></li>" +
            "</ul></div>").data("data", data);
            renderGroupList.__bindCommonEvent(template, groupList);
            
            var li = template.find("li");
            //写群邮件
            $(li[0]).find("a").click(function(e){
                var url = top.ucDomain + Constants.urls.writeMail + "?action=write&sid=" + top.UserData.ssoSid + "&gn=" + data.groupNumber + "&amp;gt=" + (window["getGroupType"]() == "fetionGroup" ? 1 : 0);
                top.CGM.show({
                    url: url
                });
                e.preventDefault();
            });
            //拒收此群邮件
            $(li[1]).find("a").click(function(e){
                Behavior(10703, 1);
                renderGroupList.Actions.rejected(top.UserData.ssoSid, data.groupNumber, function(){
                    //同步客户端数据
                    var index = Tool.indexOfArray(normalList, data);
                    data.notifyState = 0;
                    list.refuseList.push(data);
                    Tool.arrayRemove(normalList, index);
                    
                    //同步界面
                    renderGroupList.render(list);
                    MB.run();
                });
                e.preventDefault();
            });
            //关闭新邮件提示
            var liNotify = $(li[2]);
            liNotify.find("a").html(data.notifyState == 1 ? offString : onString).click(function(e){
                var tempEle = $(this);
                if (tempEle.html() == offString) {
                    renderGroupList.Actions.alertoff(top.UserData.ssoSid, data.groupNumber, function(){
                        Behavior(10703, 2);
                        tempEle.html(onString);
                    });
                }
                else {
                    renderGroupList.Actions.alerton(top.UserData.ssoSid, data.groupNumber, function(){
                        tempEle.html(offString);
                    });
                }
                e.preventDefault();
            });
            container.append(template);
        });
        groupList.append(container);
    },
    renderNoMember: function(noMember, groupList, list){
        if (Tool.isEmptyArray(noMember)) {
            return
        }
        var container = $("<div class=\"mail-oper no-col-wrap nobor nocolor\"></div>");
        container.append("<h3>无成员的群</h3>");
        $.each(noMember, function(){
            var data = this;
            var html = "";
            if (data.IsNoInvite) {
                html = "<div class=\"group-box\">" +
                "<p><i class=\"i-group\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
                data.groupName +
                "&#13群号码：" +
                data.groupNumber +
                "\">" +
                data.groupName +
                "</a>" +
                renderGroupList.renderCount(data) +
                "<a href=\"javascript:void(0)\" class=\"func mg_t_0\" style=\"display:none\">管理</a></p>" +
                "<ul style='display:none'>" +
                "<li><span>无邀请成员</span><a href=\"#\">立即邀请</a></li>" +
                "</ul></div>";
            }
            else {
                html = "<div class=\"group-box\">" +
                "<p><i class=\"i-group\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
                data.groupName +
                "&#13群号码：" +
                data.groupNumber +
                "\">" +
                data.groupName +
                "</a>" +
                renderGroupList.renderCount(data) +
                "<a href=\"javascript:void(0)\" class=\"func mg_t_0\" style=\"display:none\">管理</a></p>" +
                "<ul style='display:none'>" +
                "<li><span>等待被邀请人加入</span></li>" +
                "<li><a href=\"#\">继续邀请</a></li>" +
                "</ul></div>";
            }
            var template = $(html).data("data", data);
            renderGroupList.__bindCommonEvent(template, groupList);
            var li = template.find("ul>li");
            //立即邀请
            $(li[0]).find("a").click(function(e){
                window.location.href = Constants.urls.addUserGroup + "?" +
                $.param({
                    sid: top.UserData.ssoSid,
                    gn: data.groupNumber
                });
                e.preventDefault();
            });
            //继续邀请
            $(li[1]).find("a").click(function(e){
                window.location.href = Constants.urls.addUserGroup + "?" +
                $.param({
                    sid: top.UserData.ssoSid,
                    gn: data.groupNumber
                });
                e.preventDefault();
            });
            container.append(template);
        });
        groupList.append(container);
    },
    renderRejected: function(rejected, groupList, list){
        if (Tool.isEmptyArray(rejected)) {
            return;
        }
        var container = $("<div class=\"mail-oper no-col-wrap nobor nocolor\"></div>");
        container.append("<h3>已拒收的群</h3>");
        $.each(rejected, function(){
            var data = this;
            var template = $("<div class=\"group-box\">" +
            "<p><i class=\"i-group\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
            data.groupName +
            "&#13群号码：" +
            data.groupNumber +
            "\">" +
            data.groupName +
            "</a>" +
            renderGroupList.renderCount(data) +
            "<a href=\"javascript:void(0)\" class=\"func mg_t_0\" style=\"display:none\">管理</a></p>" +
            "<ul style='display:none'>" +
            "<li><span>已拒收</span><a href=\"#\">启动收取</a></li></ul></div>").data("data", data);
            renderGroupList.__bindCommonEvent(template, groupList);
            
            var li = template.find("ul>li");
            //启动收取
            $(li[0]).find("a").click(function(e){
                renderGroupList.Actions.received(top.UserData.ssoSid, data.groupNumber, function(){
                    //同步客户端数据
                    var index = Tool.indexOfArray(rejected, data);
                    data.notifyState = 1;
                    list.openList.push(data);
                    Tool.arrayRemove(rejected, index);
                    
                    //同步界面
                    renderGroupList.render(list);
                    MB.run();
                });
                e.preventDefault();
            });
            container.append(template);
        });
        groupList.append(container);
    },
    renderQuited: function(quited, groupList, list){
        if (Tool.isEmptyArray(quited)) {
            return;
        }
        var container = $("<div class=\"mail-oper no-col-wrap nobor nocolor\"></div>");
        container.append("<h3>已退出的群</h3>");
        $.each(quited, function(){
            var data = this;
            var template = $("<div class=\"group-box\">" +
            "<p><i class=\"i-group\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
            data.groupName +
            "&#13群号码：" +
            data.groupNumber +
            "\">" +
            data.groupName +
            "</a>" +
            renderGroupList.renderCount(data) +
            "<a href=\"javascript:void(0)\" class=\"func mg_t_0\" style=\"display:none\">管理</a></p>" +
            "<ul style='display:none'>" +
            "<li><a href=\"#\">删除</a></li>" +
            "<li><a href=\"#\">申请加入</a></li>" +
            "</ul></div>").data("data", data);
            renderGroupList.__bindCommonEvent(template, groupList);
            var li = template.find("ul>li");
            //删除
            $(li[0]).find("a").click(function(e){
                Tool.FF.confirm(Constants.msgs.del, function(){
                    renderGroupList.Actions.del(top.UserData.ssoSid, data.groupNumber, function(){
                        Tool.arrayRemove(quited, Tool.indexOfArray(quited, data));
                        //同步界面
                        renderGroupList.render(list);
                    });
                });
                
                e.preventDefault();
            });
            //申请加入
            $(li[1]).find("a").click(function(e){
                var url = "http://" + location.host + Constants.urls.appJoin + "?" +
                $.param({
                    sid: top.UserData.ssoSid,
                    gn: data.groupNumber
                });
                top.FloatingFrame.open("申请加入群", url, 420, 320, true, false, false, false);
                e.preventDefault();
            });
            container.append(template);
        });
        groupList.append(container);
    },
    renderUnregister: function(unregister, groupList, list){
        if (Tool.isEmptyArray(unregister)) {
            return;
        }
        var container = $("<div class=\"mail-oper no-col-wrap nobor nocolor\"></div>");
        container.append("<h3>已注销的群</h3>");
        $.each(unregister, function(){
            var data = this;
            var template = $("<div class=\"group-box\">" +
            "<p><i class=\"i-group-2\"></i><a href=\"javascript:void(0)\" class='t' title=\"群名称：" +
            data.groupName +
            "&#13群号码：" +
            data.groupNumber +
            "\">" +
            data.groupName +
            "</a>" +
            renderGroupList.renderCount(data) +
            "<a href=\"javascript:void(0)\" class=\"func mg_t_0\">删除</a></p>" +
            "</div>").data("data", data);
            
            renderGroupList.__bindCommonEvent(template, groupList);
            //删除
            template.find("a.func").unbind("click")
            
            template.find("a.func").click(function(e){
                Tool.FF.confirm(Constants.msgs.del, function(){
                    renderGroupList.Actions.del(top.UserData.ssoSid, data.groupNumber, function(){
                        Tool.arrayRemove(unregister, Tool.indexOfArray(unregister, data));
                        //同步界面
                        renderGroupList.render(list);
                    });
                });
                
                e.preventDefault();
            });
            
            container.append(template);
        });
        groupList.append(container);
    },
    Actions: {
        rejected: function(sid, groupId, successCallback){
            renderGroupList.Actions.__commonAction("rejected", sid, groupId, renderGroupList.Actions.__commonSuccessCallback(successCallback));
        },
        received: function(sid, groupId, successCallback){
            renderGroupList.Actions.__commonAction("received", sid, groupId, renderGroupList.Actions.__commonSuccessCallback(successCallback));
        },
        alertoff: function(sid, groupId, successCallback){
            renderGroupList.Actions.__commonAction("alertoff", sid, groupId, renderGroupList.Actions.__commonSuccessCallback(successCallback));
        },
        alerton: function(sid, groupId, successCallback){
            renderGroupList.Actions.__commonAction("alerton", sid, groupId, renderGroupList.Actions.__commonSuccessCallback(successCallback));
        },
        del: function(sid, groupId, successCallback){
            renderGroupList.Actions.__commonAction("del", sid, groupId, renderGroupList.Actions.__commonSuccessCallback(successCallback));
        },
        __commonAction: function(act, sid, groupId, callback){
            var gtype = (window["getGroupType"]() == "fetionGroup" ? 1 : 0)
            $.post2({
                url: Constants.urls.sliderAction,
                data: {
                    sid: top.UserData.ssoSid,
                    act: act,
                    gid: groupId,
                    mf: top.Utils.queryString("mf", window.location.href),
                    gtype: gtype
                },
                success: function(result){
                    if (result.resultCode == 0) {
                        if (callback) {
                            callback(result);
                        }
                    }
                    else {
                        Tool.FF.alert(result.errorMsg);
                    }
                }
            });
        },
        __commomReloadCallback: function(result){
            window["cacheGroupList"] = result.resultData;
            renderGroupList.render();
        },
        __commonSuccessCallback: function(successCallback){
            return function(result){
                if (result.resultData == true) {
                    if (successCallback) {
                        successCallback();
                    }
                }
                else {
                    Tool.FF.alert(result.resultData);
                }
            }
        }
    },
    __bindCommonEvent: function(div, groupList){
        var data = div.data("data");
        if (data.adminState == 1 || data.adminState == 2) {
            div.find("a.func").show().click(function(e){
                window.location.href = Constants.urls.managerGroup + "?" +
                $.param({
                    sid: top.UserData.ssoSid,
                    gn: data.groupNumber
                });
                e.preventDefault();
                Utils.stopEvent();
            });
        }
        div.find("p").click(function(e){
            var ishide = div.hasClass("curr");
            groupList.find("div").removeClass("curr");
            groupList.find("ul").hide()
            if (!ishide) {
                div.addClass("curr");
                div.find("ul").show();
            }
            else {
                div.find("ul").hide();
            }
            
            reloadCenterMailList(data.groupNumber);
            e.preventDefault();
        });
    },
    readMail: function(gn){
        var count = parseInt($("#newmailcount_" + gn).text()) - 1;
        if (count < 0) {
            count = 0;
        }
        if (count == 0) {
            $("#newmailstrong_" + gn).hide();
        }
        $("#newmailcount_" + gn).text(count);
        $("#newmailcount_" + gn).attr("title", count + "个新主题/回复");
    },
    renderCount: function(data){
        if (data.newTopicCount > 0) {
            return "<strong id='newmailstrong_" + data.groupNumber + "'>(<span id='newmailcount_" + data.groupNumber + "' title='" + data.newTopicCount + "个新主题/回复'>" + data.newTopicCount + "</span>)</strong>"
        }
        else {
            return "";
        }
    },
    reset: function(){
        setMailOper();
        setSider();
        //setTabAdd();
        var groupList = $(".group-list");
        groupList.empty();
        renderGroupList.load(renderGroupList.render, true);
    }
}

$(function(){
    setMailOper();
    setSider();
    //setTabAdd();
    var groupList = $(".group-list");
    groupList.empty();
    renderGroupList.load(renderGroupList.render);
    
});

