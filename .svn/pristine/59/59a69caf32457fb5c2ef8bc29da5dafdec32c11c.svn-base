var calendarMessages = {
    //公共提示语
    common_SysError: "系统繁忙，请稍候再试！",
    common_DataInProcess: "数据处理中，请稍候...",
    common_DataInLoading: "数据加载中，请稍候...",

    //列表
    game_DataInLoading: "数据加载中...",
    game_AddCalendarSuccess: "已添加提醒",
    game_CancelCalendarSuccess: "已取消提醒",
    game_DelCalendarSuccess: "已删除提醒",

    //亚运会
    yayun_WorldcupIsOver: "奥运会赛程已过期，无法进行编辑！"
};

var tempXml = [];
tempXml.push("<Request>");
tempXml.push("<groupid>{0}</groupid>");
tempXml.push("<calendartype>10</calendartype>");
tempXml.push("<interval>0</interval>");
tempXml.push("<recmysms>1</recmysms>");
tempXml.push("<recmyemail>1</recmyemail>");
tempXml.push("<recmobile></recmobile>");
tempXml.push("<recemail></recemail>");
tempXml.push("<beforetype>0</beforetype>");
tempXml.push("<beforetime>30</beforetime>");
tempXml.push("<apps>{1}</apps>");
tempXml.push("</Request>");
var gameTempXmlString = tempXml.join("");

var richinfo = richinfo ? richinfo : {}
richinfo.email = richinfo.email ? richinfo.email : {}
richinfo.email.calendar = richinfo.email.calendar ? richinfo.email.calendar : {}

function iereset(e, t) {
    var re = function() { document.getElementById(e).style.height = document.documentElement.clientHeight - 37 - (t ? t : 0) + 'px'; }
    window.onload = re;
    window.onresize = re;
}

String.format = function() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};
//日期计算
Date.prototype.DateAdd = function(strInterval, number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * number)); //秒
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * number)); //分
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * number)); //时
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * number)); //天
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * number)); //周
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); //季度
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); //月
        case 'y': return new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds()); //年
    }
}

richinfo.email.calendar.common = richinfo.email.calendar.common ? richinfo.email.calendar.common : {}
richinfo.email.calendar.common.alertErrorMsg = function(state, resultCode, resultMsg) {
    if (state == 2) {
        //登录超时                
        Utils.showTimeoutDialog();
    }
    else if (resultCode && resultCode.toLowerCase() == "false") {
        if (resultMsg && $.trim(resultMsg) != "")
            top.FloatingFrame.alert(resultMsg);
        else
            top.FloatingFrame.alert(calendarMessages.common_SysError);
    }
    else {
        top.FloatingFrame.alert(calendarMessages.common_SysError);
    }

}

richinfo.email.calendar.commonUI = richinfo.email.calendar.commonUI ? richinfo.email.calendar.commonUI : {}

//右侧功能列表
richinfo.email.calendar.commonUI.category = richinfo.email.calendar.commonUI.category ? richinfo.email.calendar.commonUI.category : {}
richinfo.email.calendar.commonUI.category.addCategory = function(curPageName, comefrom) {
    var arr_temp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
    var now_temp = new Date(arr_temp[0], arr_temp[1], arr_temp[2]);
    var now_temps = now_temp.getTime(); //当前日期

    var over_temp = new Date("2012", "08", "14");
    var over_temps = over_temp.getTime(); //下线日期
    if (now_temps < over_temps) {
        document.write(String.format('<li><i class="ico_games"></i><a href="/calendar/Game/olympicgames2012/gameindex.html?listtype=12&comefrom=2&rnd={0}">奥运提醒</a></li>', Math.random()));
    }
    document.write(String.format('<li><a href="/calendar/list.html?listtype=6&rnd={0}">生日提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/calendar/list.html?listtype=3&rnd={0}">特殊日子</a></li>', Math.random()));
    document.write(String.format('<li><a href="/calendar/list.html?listtype=1&rnd={0}">约会提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/calendar/list.html?listtype=2&rnd={0}">交费提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/calendar/Special/baby.html?listtype=8&comefrom=2&rnd={0}">宝宝防疫</a></li>', Math.random()));
    document.write(String.format('<li><a href="/calendar/list.html?listtype=5&rnd={0}">赛事提醒</a></li>', Math.random()));
    if (curPageName != "") {
        $(".category >li >a[href*='" + curPageName + "&']").parent().attr("class", "cur");
        $(".category >li >a[href*='" + curPageName + "&']").removeAttr("href");
    }
}

function GamePage() {
    var me = this;
    isLoading = false;
    actionid = 0;
    mobile = "";
    groupid = "";   //大类,比如田径的id
    allappid = "";    //可以全部添加/删除的appid列表

    this.load = function(_groupid) {
        isLoading = true;
        setTimeout(function() {
            if (isLoading)
                me.WaitPannel.show(calendarMessages.game_DataInLoading);
        }, 1000);

        me.groupid = _groupid;
        me.actionid = 0;
        me.getList("", "");
    };

    this.WaitPannel = {
        show: function(msg) {
            top.WaitPannel.show(msg);
            top.Glass.show();
        },
        hide: function() {
            top.WaitPannel.hide();
            top.Glass.hide();
        }
    };

    this.filter = function(s) {
        if (!s) return "";
        return s.replace(/[\n|\s]/g, "");
    };

    //获取比赛信息
    this.getApp = function(appid) {
        var appids = appid.split(",");
        me.appsXml = [];   //比赛信息
        var curGameTitle = String.format("奥运会{0}，", $("#aa>span:first").html());
        $("#gamelist tbody tr").each(function() {
            var curAppId = $(this).attr("app");
            for (var i = 0; i < appids.length; i++) {
                if (curAppId == appids[i]) {
                    var curAppTime = $(this).find("td:eq(0)").html();
                    var curAppName = $(this).find("td:eq(1)").html();
                    var curAppPlace = $(this).find("td:eq(2)").html();

                    curAppTime = curAppTime.trim();
                    var month = curAppTime.split("月")[0];
                    var day = curAppTime.replace(month + "月", "").split("日")[0];
                    var hour = curAppTime.split(" ")[1].split(":")[0];
                    var minute = curAppTime.split(" ")[1].split(":")[1];
                    var appTime = new Date(2012, parseInt(month) - 1, day, hour, minute, 0);

                    me.appsXml.push("<app>");
                    me.appsXml.push("<id>" + appids[i] + "</id>");
                    me.appsXml.push("<content>" + top.encodeXML(me.filter(curGameTitle + curAppName + "，在" + curAppPlace)) + "</content>");
                    me.appsXml.push("<dateflag>" + appTime.format("yyyyMMdd") + "</dateflag>");
                    me.appsXml.push("<starttime>" + appTime.format("hhmm") + "</starttime>");
                    me.appsXml.push("<datedescript>" + top.encodeXML("2012年" + curAppTime) + "</datedescript>");
                    me.appsXml.push("</app>");
                }
            }
        });
    };

    //添加
    this.addApp = function(appid) {
        var thingId = 0;
        if (!appid) return;
        thingId = (appid.indexOf(",") > -1) ? 1 : 2;
        //日志上报
        top.addBehaviorExt({
            actionId: 101761,
            thingId: thingId,
            moduleId: 20,
            pageId: 10571
        });
        me.actionid = 1
        me.getApp(appid);
        var xmlData = String.format(gameTempXmlString, me.groupid, me.appsXml.join(""));
        me.getList(appid, xmlData);
    };

    //删除
    this.delApp = function(appid) {
        var thingId = 0;
        if (!appid) return;
        thingId = (appid.indexOf(",") > -1) ? 4 : 3;
        //日志上报
        top.addBehaviorExt({
            actionId: 101761,
            thingId: thingId,
            moduleId: 20,
            pageId: 10571
        });
        me.actionid = 3;
        me.getList(appid, "");
    };

    this.bindList = function(result) {
        var serverTime = new Date(result.ServerTime.replace(/\-/g, "/")).DateAdd("n", 30); //服务器时间
        var addButton = '<a href="javascript:" appId="{0}" type="add">添加提醒</a>';
        var delButton = '<a href="javascript:" appId="{0}" type="del">取消提醒</a>';

        var allNum = $("#gamelist tbody tr").length; //全部防疫数量
        var recNum = 0; //添加提醒的数量
        var overNum = 0; //过期的数量
        var addCount = 0;
        me.allappid = ""; //可以全部添加/删除的appid列表

        if (result.AppInfo.length) {
            addCount = result.AppInfo.length;
        }
        $("#gamelist tbody tr").each(function() {
            var curAppId = $(this).attr("app");
            var curAppTime = $(this).find("td:eq(0)").html();
            if (curAppTime != "待定") {
                curAppTime = curAppTime.trim();
                var month = curAppTime.split("月")[0];
                var day = curAppTime.replace(month + "月", "").split("日")[0];
                var hour = curAppTime.split(" ")[1].split(":")[0];
                var minute = curAppTime.split(" ")[1].split(":")[1];
                var appTime = new Date(2012, parseInt(month) - 1, day, hour, minute, 0);

                //已过期
                if (appTime <= serverTime) {
                    overNum++;
                    $(this).attr("class", "on");
                    $(this).find("td:eq(3)").html("已过期");
                }
                else {
                    me.allappid += "," + curAppId;
                    $(this).attr("class", "");
                    $(this).find("td:eq(3)").html("").append(String.format(addButton, curAppId));
                    for (var i = 0; i < addCount; i++) {
                        //已经添加了提醒
                        if (curAppId == result.AppInfo[i].AppId) {
                            recNum++;
                            $(this).attr("class", "sp");
                            $(this).find("td:eq(3)").html("").append(String.format(delButton, curAppId));
                        }
                    }
                }
            }
            else {
                overNum++;
            }
        });
        if (me.allappid.length > 1) {
            me.allappid = me.allappid.substr(1);
        }
        if (allNum == overNum) {
            $("#btnForAll").hide(); //全部过期
        }
        else {
            if (recNum == allNum || (recNum == allNum - overNum)) {
                $("#btnForAll").val("取消整组提醒").unbind("click").click(function() {
                    top.FloatingFrame.confirm("确定要取消整组提醒吗？", function() {
                        me.delApp(me.allappid);
                    });
                });
            }
            else {
                $("#btnForAll").val("添加整组提醒").unbind("click").click(function() {
                    top.FloatingFrame.confirm("确定要添加整组提醒吗？", function() {
                        me.addApp(me.allappid);
                    });
                });
            }
        }
        //添加
        $("#gamelist a[type=add]").unbind("click").click(function() {
            me.addApp($(this).attr("appId"));
        });
        //删除
        $("#gamelist a[type=del]").unbind("click").click(function() {
            me.delApp($(this).attr("appId"));
        });
    };

    this.getList = function(appid, xmldata) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            if (me.actionid == 1) {
                me.WaitPannel.show(calendarMessages.game_AddCalendarSuccess);
            }
            else if (me.actionid == 3) {
                me.WaitPannel.show(calendarMessages.game_CancelCalendarSuccess);
            }
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/calendar/game/game.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionId: me.actionid,
                    groupId: me.groupid,
                    sendType: 12,
                    appId: appid,
                    xml: xmldata,
                    rnd: Math.random()
                },
                success: function(result) {
                    isLoading = false;
                    me.WaitPannel.hide();
                    if (result.State == 0) {
                        if (result.ResultCode == "True") {
                            top.document.getElementById("calendar").contentWindow.$("#spanCount1").text("全部日程(" + result.AllCount + ")");
                            top.document.getElementById("calendar").contentWindow.$("#spanCount2").text("最近7天日程(" + result.SevenCount + ")");
                            me.bindList(result);
                        }
                        else {
                            richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                        }
                    }
                    else {
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    };
}