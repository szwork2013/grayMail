var calendarMessages = {
    //公共提示语
    common_DateError: "日期填写不正确",
    common_SysError: "系统繁忙，请稍候再试！",
    common_DataInProcess: "数据处理中，请稍候...",
    common_DataInLoading: "数据加载中，请稍候...",
    common_EndDateIsBeforeStartDate: "结束时间不能在开始时间前",

    feeTips: "温馨提示：短信",
    feeMsg: "本月已发{0}条，按{1}元/条计费",
    meTips: "温馨提示：设置成功后将通过免费短信和邮件提醒自己。",
    //视图
    view_ContentIsEmpty: "请输入提醒内容",
    view_ConfirmToDelete: "确定要删除此日程吗?",
    view_LoadDataErrorMsg: "数据加载异常,是否要重新加载?",

    //列表
    list_DataInLoading: "数据加载中...",
    list_NotSelectItem: "请选择事项。",
    list_ConfirmDelCalendar: "确定要删除此日程吗？",
    list_WorldCupIsOver: "世界杯赛程已过期，无法进行编辑！",
    list_CancelCalendarSuccess: "已取消提醒",
    list_DelCalendarSuccess: "已删除提醒",

    //世界杯
    game_WorldcupIsOver: "世界杯赛程已过期，无法进行编辑！",

    //宝宝防疫
    baby_EditBabyInfoTitle: "编辑宝宝防疫提醒",

    //亚运会
    game_YaYunIsOver: "亚运会赛程已过期，无法进行编辑！",
    list_YaYunIsOver: "亚运会赛程已过期，无法进行编辑！",

    //奥运会
    game_FISUIsOver: "奥运会赛程已过期，无法进行编辑！",
    list_FISUIsOver: "奥运会赛程已过期，无法进行编辑！"
};
var categoryHtml = '<ul >';

var arr_temp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
var now_temp = new Date(arr_temp[0], arr_temp[1], arr_temp[2]);
var now_temps = now_temp.getTime(); //当前日期

var over_temp = new Date("2012", "08", "14");
var over_temps = over_temp.getTime(); //下线日期
if (now_temps < over_temps) {
    categoryHtml = categoryHtml + '<li><a href="game/olympicgames2012/gameindex.html?{0}&{1}">奥运提醒</a></li>';
}
categoryHtml = categoryHtml +
			            '<li><a href="calendar_editcalendar.html?{0}&{1}">常规日程</a></li>' +
			            '<li><a href="special/birthday.html?{0}&{1}">生日提醒</a></li>' +
			            '<li><a href="special/specialday.html?{0}&{1}">特殊日子</a></li>' +
			            '<li><a href="special/meet.html?{0}&{1}">约会提醒</a></li>' +
			            '<li><a href="special/pay.html?{0}&{1}">交费提醒</a></li>' +
			            '<li><a href="special/baby.html?{0}&{1}">宝宝防疫</a></li>' +
			            '<li><a href="special/match.html?{0}&{1}">赛事提醒</a></li>' +
			        '</ul>';
var richinfo = richinfo ? richinfo : {}
richinfo.email = richinfo.email ? richinfo.email : {}
richinfo.email.calendar = richinfo.email.calendar ? richinfo.email.calendar : {}

var objApiForView = null;
var removedHrefObj = null;
var removedHrefObjAttr = null;
var removedHrefText = null;
function iereset(e, t) {
    var re = function() { document.getElementById(e).style.height = document.documentElement.clientHeight - 37 - (t ? t : 0) + 'px'; }
    window.onload = re;
    window.onresize = re;
}

function getEvent() {
    if (document.all) return window.event;
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
                 || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}
/* 停止事件冒泡 */
function stopBubble() {
    var evt = getEvent();
    if (evt && evt.stopPropagation) {
        evt.stopPropagation();
    }
    else {
        if (evt) {
            evt.cancelBubble = true;
        }
    }
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
        case 's': return new Date(Date.parse(dtTmp) + (1000 * number));
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}
function getStartAndEndTime(servTime) {
    var returnObj = new Object();
    var opDate = new Date();
    if (servTime)
        opDate = new Date(servTime.replace(/\-/g, "/"));

    var start = opDate.DateAdd("h", 1);
    var endDt = opDate.DateAdd("h", 2);
    returnObj.startDate = start.format("yyyy-MM-dd");
    returnObj.endDate = endDt.format("yyyy-MM-dd");
    returnObj.startTime = String(start.getHours()) + "30";
    returnObj.endTime = String(endDt.getHours()) + "30";
    return returnObj;
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
        document.write(String.format('<li><i class="ico_games"></i><a id="calendar_12" href="game/olympicgames2012/gameindex.html?listtype=12&comefrom=2&rnd={0}">奥运提醒</a></li>', Math.random()));
    }
    document.write(String.format('<li><a id="calendar_6" href="/m2012/html/calendar/calendar_list.html?listtype=6&rnd={0}">生日提醒</a></li>', Math.random()));
    document.write(String.format('<li><a id="calendar_3" href="/m2012/html/calendar/calendar_list.html?listtype=3&rnd={0}">特殊日子</a></li>', Math.random()));
    document.write(String.format('<li><a id="calendar_1" href="/m2012/html/calendar/calendar_list.html?listtype=1&rnd={0}">约会提醒</a></li>', Math.random()));
    document.write(String.format('<li><a id="calendar_2" href="/m2012/html/calendar/calendar_list.html?listtype=2&rnd={0}">交费提醒</a></li>', Math.random()));
    document.write(String.format('<li><a id="calendar_8" href="/m2012/html/calendar/special/baby.html?listtype=8&comefrom=2&rnd={0}">宝宝防疫</a></li>', Math.random()));
    document.write(String.format('<li><a id="calendar_5" href="/m2012/html/calendar/calendar_list.html?listtype=5&rnd={0}">赛事提醒</a></li>', Math.random()));
    if (curPageName != "") {
        removedHrefObj = $(".category >li >a[href*='" + curPageName + "&']");
        removedHrefObjAttr = removedHrefObj.attr("href");
        removedHrefText = removedHrefObj.html();
        removedHrefObj.parent().attr("class", "cur");
        removedHrefObj.removeAttr("href");

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
    top.WaitPannel.hide();
}
/******************************* 
返回日程视图控件 (y年,m+1月) 
*******************************/
richinfo.email.calendar.calendarView = function(y, m) {
    var me = this;
    objApiForView = new richinfo.email.calendar.commonApi();
    //农历只能显示1901至2050年，超过该范围就只显示公历
    this.beginYear = 1900;
    this.endYear = 2050;
    this.date = new Date(y, m, 1);
    this.year = y;
    this.month = m;
    this.enableHistday = true; //历史天是否可以选择
    var sDObj, lDObj, lY, lM, lD = 1, lL, lX = 0, tmp1, tmp2, tmp3;
    var cY, cM, cD; //年柱,月柱,日柱
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;
    sDObj = new Date(y, m, 1, 0, 0, 0, 0);    //当月一日日期
    this.length = objApiForView.solarDays(y, m);    //公历当月天数
    this.firstWeek = sDObj.getDay();    //公历当月1日星期几
    this.CY = objApiForView.cyclical(this.date.getFullYear() - 1900 + 36);
    var term2 = objApiForView.sTerm(y, 2); //立春日期
    //月柱 1900年1月小寒以前为 丙子月(60进制12)
    var firstNode = objApiForView.sTerm(y, m * 2) //返回当月「节」为几日开始
    cM = objApiForView.cyclical((y - 1900) * 12 + m + 12);
    //当月一日与 1900/1/1 相差天数
    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    var dayCyclical = Date.UTC(y, m, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    for (var i = 0; i < this.length; i++) {
        if (lD > lX) {
            sDObj = new Date(y, m, i + 1);    //当月一日日期
            lDObj = new objApiForView.Lunar(sDObj);     //农历
            lY = lDObj.year;           //农历年
            lM = lDObj.month;          //农历月
            lD = lDObj.day;            //农历日
            lL = lDObj.isLeap;         //农历是否闰月
            lX = lL ? objApiForView.leapDays(lY) : objApiForView.monthDays(lY, lM); //农历当月最后一天
            if (n == 0) firstLM = lM;
            lDPOS[n++] = i - lD + 1;
        }
        //依节气调整二月分的年柱, 以立春为界
        if (m == 1 && (i + 1) == term2) cY = objApiForView.cyclical(y - 1900 + 36);
        //依节气月柱, 以「节」为界
        if ((i + 1) == firstNode) cM = objApiForView.cyclical((y - 1900) * 12 + m + 13);
        //日柱
        cD = objApiForView.cyclical(dayCyclical + i);
        this[i] = new objApiForView.calElement(y, m + 1, i + 1, objApiForView.nStr1[(i + this.firstWeek) % 7], lY, lM, lD++, lL, objApiForView.cyclical(lDObj.yearCyl), objApiForView.cyclical(lDObj.monCyl), objApiForView.cyclical(lDObj.dayCyl++))
    }

    //节气
    tmp1 = objApiForView.sTerm(y, m * 2) - 1;
    tmp2 = objApiForView.sTerm(y, m * 2 + 1) - 1;
    this[tmp1].solarTerms = objApiForView.solarTerm[m * 2];
    this[tmp2].solarTerms = objApiForView.solarTerm[m * 2 + 1];

    if (m == 3) this[tmp1].color = 'red'; //清明颜色
    //阳历节日
    for (i in objApiForView.sFtv)
        if (objApiForView.sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
        if (Number(RegExp.$1) == (m + 1)) {
        this[Number(RegExp.$2) - 1].solarFestival += RegExp.$4 + ' '
        if (RegExp.$3 == '*') this[Number(RegExp.$2) - 1].color = 'red'
    }

    //月周节日
    for (i in objApiForView.wFtv)
        if (objApiForView.wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
        if (Number(RegExp.$1) == (m + 1)) {
        tmp1 = Number(RegExp.$2)
        tmp2 = Number(RegExp.$3)
        this[((this.firstWeek > tmp2) ? 7 : 0) + 7 * (tmp1 - 1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' '
    }

    //农历节日
    var lmf = this[0].lMonth; //当月第一天农历月份
    var lme = this[this.length - 1].lMonth; //当月最后一天农历月份
    for (i in objApiForView.lFtv) {
        if (objApiForView.lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
            tmp1 = Number(RegExp.$1); //农历节日月份
            tmp2 = Number(RegExp.$2); //农历节日当日
            if (tmp1 < lmf) continue;
            if (tmp1 > lme) break;
            for (var j = 0, len = this.length; j < len; j++) {
                if (tmp1 == this[j].lMonth && tmp2 == this[j].lDay) {
                    this[j].lunarFestival += RegExp.$4 + ' ';
                    if (RegExp.$3 == '*') { this[j].color = 'red'; }
                }
            }
        }
    }

    //今日
    if (y == objApiForView.tY && m == objApiForView.tM) this[objApiForView.tD - 1].isToday = true;
    //返回月日历数组
    this.getMonthViewDateArray = function(y, m) {
        var dateArray = new Array(42);
        var dayOfFirstDate = new Date(y, m, 1).getDay();
        var dateCountOfMonth = new Date(y, m + 1, 0).getDate();
        for (var i = 0; i < dateCountOfMonth; i++) {
            dateArray[i + dayOfFirstDate] = i + 1;
        }
        return dateArray;
    }

    this.checkSimpleForm = function() {
        if (parseInt($("#opSimpleStart").val()) > parseInt($("#opSimpleEnd").val())) {
            $("#lblErrorMsg").text(calendarMessages.common_EndDateIsBeforeStartDate);
            $("#append").css({ top: me.lastAppendTop - 26 });
            $("#opSimpleEnd").focus();
            $("#pErrorMsg").show();
            return false;
        }
        if ($.trim($("#txtContent").val()) == "") {
            $("#lblErrorMsg").text(calendarMessages.view_ContentIsEmpty);
            $("#txtContent").focus();
            $("#pErrorMsg").show();
            $("#append").css({ top: me.lastAppendTop - 26 });
            return false;
        }
        $("#lblErrorMsg").text("");
        $("#pErrorMsg").hide();
        return true;
    }

    this.getSimpleCal = function() {
        var templatexml = "<Request>\
        <id>{0}</id>\
        <content>{1}</content>\
        <stype>{2}</stype>\
        <calendartype>{3}</calendartype>\
        <interval>{4}</interval>\
        <dateflag>{5}</dateflag>\
        <enddateflag>{6}</enddateflag>\
        <starttime>{7}</starttime>\
        <endtime>{8}</endtime>\
        <recmysms>{9}</recmysms>\
        <recmyemail>{10}</recmyemail>\
        <recmobile>{11}</recmobile>\
        <recemail>{12}</recemail>\
        <datedesc>{13}</datedesc>\
        <beforetype>{14}</beforetype>\
        <beforetime>{15}</beforetime>\
        <validimg>{16}</validimg>\
        </Request>";
        var recmysms = 1;
        var recmyemail = 1;
        var datedesc = "";
        if ($("#opSimpleStart :selected").text() == $("#opSimpleEnd :selected").text()) {
            datedesc = me.currOperateData.format("yyyy年M月d日") + me.getTimeShow($("#opSimpleStart :selected").text());
        }
        else {
            datedesc = me.currOperateData.format("yyyy年M月d日") + me.getTimeShow($("#opSimpleStart :selected").text()) + "到" + me.getTimeShow($("#opSimpleEnd :selected").text());
        }
        var dateflag, dateflagend;

        //            if($("#chkmsg").attr("checked")==true){
        //                recmysms=1;
        //            }
        //            if($("#chkmail").attr("checked")==true){
        //                recmyemail=1;
        //            }
        var selectDate = $("#spanDate").attr("date");
        dateflag = selectDate;
        dateflagend = selectDate;

        me.add_Json = new Object();
        me.add_Json.SendType = 0;
        me.add_Json.Content = $("#txtContent").val();
        if (me.currOperateData >= me.ServerDateTime) {
            me.add_Json.RecMySMS = recmysms;
            me.add_Json.RecMyEmail = recmyemail;
        }
        else {
            me.add_Json.RecMySMS = 0;
            me.add_Json.RecMyEmail = 0;
        }
        me.add_Json.RecMobile = ""
        me.add_Json.RecEmail = "";
        me.add_Json.StartDateDt = me.currOperateData;
        me.add_Json.EndDateDt = me.currOperateData;
        me.add_Json.SendInterval = 0;
        me.add_Json.CalendarType = 10;
        var md = me.currOperateData.format("MMdd");
        me.add_Json.DateFlag = md;
        me.add_Json.EndDateFlag = md;
        me.add_Json.ShowStartDate = md;
        me.add_Json.Starttime = $("#opSimpleStart").val();
        me.add_Json.DateDescript = datedesc;
        me.add_Json.IsAll = 1;

        return String.format(templatexml, 0, top.encodeXML($("#txtContent").val()), -1, 10, 0, dateflag, dateflagend, $("#opSimpleStart").val(), $("#opSimpleEnd").val(), recmysms, recmyemail, "", "", top.encodeXML(datedesc), $("#opAdvanc").val(), $("#opAdvanc :selected").text().replace(/[^\d]/g, ''), "");
    }
    //获取时间对应提示
    this.getTimeShow = function(h) {
        var show = "";
        t = parseInt(h);
        if (t >= 0 && t < 6) {
            show = "凌晨";
        } else if (t >= 6 && t < 9) {
            show = "早上";
        } else if (t >= 9 && t < 12) {
            show = "上午";
        } else if (t == 12) {
            show = "中午";
        } else if (t > 12 && t < 18) {
            show = "下午";
        } else if (t >= 18 && t < 22) {
            show = "晚上";
        } else if (t >= 22 && t < 24) {
            show = "深夜";
        }
        return show + h;
    }

    this.initAdd = function() {
        //初始化时间
        var htmlSimple = "";
        for (var i = 0; i <= 23; i++) {
            htmlSimple += "<option value=" + i + "00>" + i + "：00</option><option value=" + i + "30>" + i + "：30</option>";
        }
        $("#opSimpleStart").append(htmlSimple);
        $("#opSimpleEnd").append(htmlSimple);
        var opDate = new Date();
        var opHour = opDate.getHours();
        var opMinutes = opDate.getMinutes();
        if (opMinutes < 30) {
            $("#opSimpleStart").attr("value", parseInt(opHour) + "30");
            if ((parseInt(opHour) + 1) < 24)
                $("#opSimpleEnd").attr("value", (parseInt(opHour) + 1) + "30");
            else
                $("#opSimpleEnd").attr("value", "2330");
        }
        else {
            if ((parseInt(opHour) + 1) < 24)
                $("#opSimpleStart").attr("value", (parseInt(opHour) + 1) + "00");
            else
                $("#opSimpleStart").attr("value", "2300");
            if ((parseInt(opHour) + 2) < 24)
                $("#opSimpleEnd").attr("value", parseInt(opHour) + 2 + "00");
            else
                $("#opSimpleEnd").attr("value", "2300");
        }

        //初始化提醒提前时间
        var htmlAdvance = "";
        htmlAdvance = "<option value='0'>5分钟</option>"
        htmlAdvance += "<option value='0' selected>15分钟</option>"
        htmlAdvance += "<option value='0'>30分钟</option>"
        htmlAdvance += "<option value='1'>1小时</option>"
        htmlAdvance += "<option value='1'>2小时</option>"
        htmlAdvance += "<option value='1'>3小时</option>"
        htmlAdvance += "<option value='1'>6小时</option>"
        htmlAdvance += "<option value='1'>12小时</option>"
        htmlAdvance += "<option value='2'>1天</option>"
        htmlAdvance += "<option value='2'>2天</option>"
        htmlAdvance += "<option value='2'>3天</option>"
        htmlAdvance += "<option value='2'>4天</option>"
        htmlAdvance += "<option value='2'>5天</option>"
        htmlAdvance += "<option value='2'>6天</option>"
        htmlAdvance += "<option value='2'>7天</option>"
        htmlAdvance += "<option value='2'>8天</option>"
        htmlAdvance += "<option value='2'>9天</option>"
        htmlAdvance += "<option value='2'>10天</option>"
        htmlAdvance += "<option value='2'>11天</option>"
        htmlAdvance += "<option value='2'>12天</option>"
        htmlAdvance += "<option value='2'>13天</option>"
        htmlAdvance += "<option value='2'>14天</option>"
        $("#opAdvanc").append(htmlAdvance);
    }
    //添加
    this.append = function(e, o) {
        $("#btnSave").attr("disabled", false);
        $("#lblErrorMsg").html("");
        $("#pErrorMsg").hide();
        $("#txtContent").val("");
        $("#spanDate").html(o.date.format("M月d日")).attr("date", o.date.format("yyyyMMdd"));
        me.selectedDate = o.date.format("yyyy-MM-dd");
        me.currOperateData = o.date;

        me.hideAllPop();
        me.initAddConent();
        var app = document.getElementById('append');
        e = e ? e : window.event;
        var x = e.pageX ? e.pageX : e.clientX;
        var y = e.pageY ? e.pageY : e.clientY;

        app.style.display = "block";
        var appendClassName = "dialog";
        var h = $("#append").height() + 13;
        if (y - h < 0) {
            appendClassName = "dialog auto";
        }
        else {
            appendClassName = "dialog";
            y -= h;
            if (x - 120 < 0) {
                appendClassName = "dialog auto";
            }
        }
        x = x - 120 < 0 ? 1 : x - 120;
        if (x + 420 > document.documentElement.clientWidth) {
            app.style.left = document.documentElement.clientWidth - 420 + 'px';
            appendClassName = "dialog auto";
        }
        else app.style.left = x + 'px';
        app.style.top = y + 'px';
        app.className = appendClassName;
        me.lastAppendTop = y;
        $("#opSimpleStart").unbind("change").change(function() {
            $("#opSimpleEnd").attr("value", parseInt(this.value, 10) >= 2300 ? "2330" : String(parseInt(this.value, 10) + 100));
        });
        stopBubble();
    }
    this.initAddConent = function() {
        $("#txtContent").val("");
        $("#opAdvanc option:eq(1)").attr("selected", true);
        $("#chkmsg").attr("checked", true);
        $("#trHelp").show();
        $("#chkmail").attr("checked", false);
        var times = getStartAndEndTime(me.ServerTime);
        $("#opSimpleStart").attr("value", times.startTime);
        $("#opSimpleEnd").attr("value", times.endTime);
    }
    //隐藏弹出层
    this.hideAllPop = function() {
        document.getElementById('addbyCategory').style.visibility = 'hidden';
        document.getElementById("detail").style.display = "none";
        document.getElementById("item").style.display = "none";
        document.getElementById('append').style.display = "none";
        if (objSelector) objSelector.hide();

    }

    //按分类添加日程
    this.addbyCategory = function() {
        if ($("#detail"))
            me.hideAllPop();
        document.getElementById('addbyCategory').style.visibility = 'visible';
        stopBubble();
    }

    this.bindEvent = function() {
        $("#closeAddDialog").click(function() { $("#append").hide(); });
        $("#closeAddDialog").click(function() { $("#item").hide(); });
        $(".optarea .drop:eq(0)").click(function() { me.addbyCategory(); });
        $("#item").click(function() { stopBubble(); })
        $("#item a:eq(0)").click(function() { me.goPrevPage() });
        $("#item a:eq(1)").click(function() { me.goNextPage() });
        $("#hideitem").click(function() { $("#item").hide(); });
        $(".addCalendar .btn").click(function() { window.location.href = "calendar_editcalendar.html?comefrom=1&rnd=" + Math.random() });
        $("#allCalendar").click(function () { window.location.href = '/m2012/html/calendar/calendar_list.html?rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        $("#sevendayt").click(function () { window.location.href = '/m2012/html/calendar/calendar_list.html?type=1&rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        $("#aRecent").click(function () { window.location.href = '/m2012/html/calendar/calendar_list.html?type=1&rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        $("#aAgent").click(function () { window.location.href = '/m2012/html/calendar/calendar_list.html?type=2&rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        $("#aHasDone").click(function () { window.location.href = '/m2012/html/calendar/calendar_list.html?type=3&rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        $("#goAddDetail").click(function() {
            var content = $("#txtContent").val();
            var beforetype = $("#opAdvanc").val();
            var beforetime = $("#opAdvanc :selected").text().replace(/[^\d]/g, '');
            window.location.href = "calendar_editcalendar.html?rnd=" + Math.random() + "&comefrom=1&cont=" + escape(content) + "&d=" + me.selectedDate + "&t1=" + $("#opSimpleStart").val() + "&t2=" + $("#opSimpleEnd").val() + "&type=" + beforetype + "&time=" + beforetime + "&sms=1&mail=1";
            if (window.event)
                window.event.returnValue = false;
        });
        $("#chkmsg").click(function() {
            if ($(this).attr("checked") == true)
                $("#trHelp").show();
            else
                $("#trHelp").hide();
        });
        $("#btnAddInView").click(function() {
            window.location.href = "calendar_editcalendar.html?comefrom=1&rnd=" + Math.random();
        });
        $("#currentDate").click(function() {
            showMyCalendar(this, me.gotoSomeDay, { date2StringPattern: 'yyyy年MM月', showSelectDayColor: false });
            stopBubble();
        });

        $("#goToday").click(function() {
            me.goToday();
        });
        $("#btnSave").click(function() {
            me.addSimple();
        });

        $("#opSimpleEnd").change(function() {
            $("#opSimpleStart").unbind("change");
        });
        window.onresize = me.resizeItemRows;
        document.onclick = function(e) {
            me.hideAllPop();
        }
        $(top.document.getElementById("calendar").contentWindow).unload(function() {
            if (typeof (top.UserData.CalendarViewJsonData) != "undefined") {
                top.UserData.CalendarViewJsonData = null;
            }
        });

       
    }

    this.resizeItemRows = function() {
        $(document).ready(function() {
            me.resizeRows(true);
        });
    }
    this.showdetail = function(src, isFromMore) {
        if (isFromMore)//点击更多列表页面中的查看详细
        {
            document.getElementById('addbyCategory').style.visibility = 'hidden';
            $("#detail").hide();
            $("#append").hide();
        }
        else {
            me.hideAllPop();
        }

        var detail = document.getElementById("detail");
        //设置事项信息
        if (src.RecordInfo.DateDescript == "")
            $("#spanDateDescript").html(src.date.format("yyyy-MM-dd"));
        else
            $("#spanDateDescript").html(src.RecordInfo.DateDescript.encode());

        me.currOperateData = src.RecordInfo.StartDateDt;

        if (src.RecordInfo.IsAll == 0) {
            $("#spanDetailContent").html("");
            var isTimeout = top.Utils.PageisTimeOut(true);
            if (!isTimeout) {
                top.WaitPannel.show(calendarMessages.common_DataInLoading);
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "/g2/calendar/List.ashx",
                    data: { sid: top.UserData.ssoSid, actionId: 3, seqNos: src.RecordInfo.SeqNo, sendType: src.RecordInfo.SendType, rnd: Math.random },
                    success: function(result) {
                        top.WaitPannel.hide();
                        if (result.State == 0 && result.ResultCode == "True") {
                            $("#spanDetailContent").html(result.Content.replace(/[\n|\s]/g, "").encode());
                        }
                        else {
                            richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                        }
                    }
                });
            }
        }
        else
            $("#spanDetailContent").html(src.RecordInfo.Content.replace(/[\n|\s]/g, "").encode());

        $("#closeViewDialog").click(function() { $("#detail").hide(); });
        //编辑

        if (src.RecordInfo.SendType == 7) {
            $("#editDetail").unbind("click").attr("disabled", true);
        }
        else {
            $("#editDetail").unbind("click").attr("disabled", false);
            $("#editDetail").click(function() { me.editItemRec(src.RecordInfo.SendType, src.RecordInfo.SeqNo); });
        }

        //删除
        $("#deleteDetail").unbind("click").attr("disabled", false);
        $("#deleteDetail").click(function() {
            top.FloatingFrame.confirm(calendarMessages.view_ConfirmToDelete, function() { me.deleteItemRec(src.RecordInfo.SendType, src.RecordInfo.SeqNo); });
        });
        var y = src.getBoundingClientRect().top;
        var x = src.getBoundingClientRect().left;
        var isAuto = 0;
        if (src.getBoundingClientRect().top - 177 < 0) {
            isAuto = 1;
            y = src.getBoundingClientRect().top + 20;
        }
        else {
            y = y - 177 - 10;
        }
        if (x + 420 > document.documentElement.clientWidth) {
            x = document.documentElement.clientWidth - 420;
            isAuto = 1;
        }
        else if (x - 120 < 0) {
            x = 1;
            isAuto = 1;
        }
        else {
            x = x - 80;
        }
        detail.style.top = y + 'px';
        detail.style.left = x + 'px';
        detail.className = isAuto == 0 ? "dialog detail" : "dialog detail auto";
        detail.style.display = 'block';
        $("#detail").show();
        stopBubble();
    }
    this.addSimple = function() {
        if (me.checkSimpleForm()) {
            var isTimeout = top.Utils.PageisTimeOut(true);
            if (!isTimeout) {
                top.WaitPannel.show(calendarMessages.common_DataInProcess);
                $("#btnSave").attr("disabled", true);
                $.ajax({
                    dataType: "json",
                    url: "/g2/calendar/EditCalendar.ashx",
                    data: {
                        sid: window.top.UserData.ssoSid,
                        actionId: 1,
                        xml: me.getSimpleCal(),
                        pagesize: 20,
                        rnd: Math.random()
                    },
                    success: function (result) {
                        $("#btnSave").attr("disabled", false);
                        if (result.State == 0 && result.ResultCode == "True") {
                            top.WaitPannel.hide();
                            var newJson = me.getNewJsonData(0, result.Table);
                            me.setCount(newJson)
                            me.bindMonthData(newJson.Table, true);
                            me.hideAllPop();
                            try {
                                top.postJiFen(65, 1); //添加日程提醒成功 上报积分
                            } catch (e) { }
                            return false;
                        }
                        else {
                            richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                        }
                    }
                });
            }
        }
    }
    //返回新的json数据
    this.getNewJsonData = function(type, seqno, p_sendType) {
        var isInSevenDay = me.isInSevenDay(me.currOperateData);
        if (type == 0)//添加
        {
            top.UserData.CalendarViewJsonData.AllCount = top.UserData.CalendarViewJsonData.AllCount + 1;
            if (isInSevenDay)
                top.UserData.CalendarViewJsonData.SevenCount = top.UserData.CalendarViewJsonData.SevenCount + 1;
            me.add_Json.SeqNo = seqno;
            if (top.UserData.CalendarViewJsonData.Table == "")
                top.UserData.CalendarViewJsonData.Table = new Array();

            top.UserData.CalendarViewJsonData.Table.push(me.add_Json);
        }
        else if (type == 1)//删除
        {
            top.UserData.CalendarViewJsonData.AllCount = top.UserData.CalendarViewJsonData.AllCount - 1;
            if (isInSevenDay && top.UserData.CalendarViewJsonData.SevenCount >= 1)
                top.UserData.CalendarViewJsonData.SevenCount = top.UserData.CalendarViewJsonData.SevenCount - 1;
            var length = top.UserData.CalendarViewJsonData.Table.length;
            for (var i = 0; i < length; i++) {
                if (typeof (top.UserData.CalendarViewJsonData.Table[i]) != "undefined" && top.UserData.CalendarViewJsonData.Table[i].SeqNo == seqno && top.UserData.CalendarViewJsonData.Table[i].SendType == p_sendType) {
                    top.UserData.CalendarViewJsonData.Table.splice(i, 1);
                    i--;
                }
            }
        }
        return top.UserData.CalendarViewJsonData;
    }
    //当前操作的是否是7天内的数据
    this.isInSevenDay = function(date) {
        var days = parseInt(date.format("yyyyMMdd"), 10) - parseInt(me.ServerDateTime.format("yyyyMMdd"), 10);
        if (days >= 0 && days <= 7) {
            return true;
        }
        return false;
    }
    this.editItemRec = function(sendType, seq_no) {
        var dateQueryString = "&curDate=" + me.date.format("yyyy/MM/dd");
        switch (sendType) {
            case 0: //常规
                window.location.href = 'calendar_editcalendar.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 1: //约会
                window.location.href = 'special/meet.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 2: //交费
                window.location.href = 'special/pay.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 3: //特殊日子
                window.location.href = 'special/specialday.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 5: //赛事
                window.location.href = 'special/match.html?comefrom=1&id=' + seq_no + dateQueryString + "&listtype=5&rnd=" + Math.random();
                break;
            case 6: //生日
                window.location.href = 'special/birthday.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 7: //世界杯
                top.FloatingFrame.alert(calendarMessages.game_WorldcupIsOver);
                break;
            case 8: //宝宝防疫
                top.FloatingFrame.open(calendarMessages.baby_EditBabyInfoTitle, "/m2012/html/calendar/special/babyset.html?seq_no=" + seq_no + "&type=2&comefrom=1&rnd" + Math.random(), 450);
                break;
            case 9: //亚运
                top.FloatingFrame.alert(calendarMessages.game_YaYunIsOver);
                break;
            case 11: //星座运势
                window.location.href = 'special/astro.html?comefrom=1&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                break;
            case 12: //大运
                var arr_temp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
                var now_temp = new Date(arr_temp[0], arr_temp[1], arr_temp[2]);
                var now_temps = now_temp.getTime(); //当前日期

                var over_temp = new Date("2012", "08", "14");
                var over_temps = over_temp.getTime(); //下线日期
                if (now_temps < over_temps) {
                    location.href = 'special/match.html?comefrom=1&listtype=12&id=' + seq_no + dateQueryString + "&rnd=" + Math.random();
                }
                else {
                    top.FloatingFrame.alert(calendarMessages.game_FISUIsOver);
                }
                break;
        }
    }
    //删除单条提醒内容
    this.deleteItemRec = function(sendType, seq_no) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            var postDate = { sid: top.UserData.ssoSid, curdate: me.date.format("yyyy-MM-dd"), actionId: 4, seqNos: seq_no, rnd: Math.random };
            if (sendType != 0)
                postDate = { sid: top.UserData.ssoSid, curdate: me.date.format("yyyy-MM-dd"), actionId: 4, seqNos2: seq_no, rnd: Math.random };
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $("#deleteDetail").attr("disabled", true);
            $("#editDetail").attr("disabled", true);
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/List.ashx",
                data: postDate,
                success: function(result) {
                    $("#deleteDetail").attr("disabled", false);
                    $("#editDetail").attr("disabled", false);
                    top.WaitPannel.hide();

                    if (result.State == 0 && result.ResultCode == "True") {
                        var newJson = me.getNewJsonData(1, seq_no, sendType);
                        me.setCount(newJson)
                        me.bindMonthData(newJson.Table, true);
                        $("#detail").hide();
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                }
            });
        }
    }
    this.setCount = function(result) {
        $("#allcount").text(result.AllCount);
        $("#sevencount").text(result.SevenCount);
        $("#spanCount1").text("全部日程(" + result.AllCount + ")");
        $("#spanCount2").text("最近7天日程(" + result.SevenCount + ")");

        //        $("#trHelp em:eq(0)").text(result.FreeCount);
        //        $("#trHelp em:eq(1)").text(result.SendCount);
        //        $("#trHelp em:eq(2)").text(result.FeeValue);
        ////        if(result.FreeInfo.length==0)
        ////        {
        ////            if (top.UserData.provCode.toString() == "19")//江苏计费提醒特别
        ////            {
        ////                $("#phelp").text(String.format(calendarMessages.feeTips+calendarMessages.feeMsg,result.SendCount,"0.1"));
        ////            }
        ////            else
        ////            { 
        ////                $("#phelp").text(String.format(calendarMessages.feeTips+calendarMessages.feeMsg,result.SendCount,result.FeeValue));
        ////            }
        ////        }
        ////        else
        ////        {
        ////            if (top.UserData.provCode.toString() == "19")//江苏计费提醒特别
        ////            {
        ////                $("#phelp").text(calendarMessages.feeTips+result.FreeInfo.replace("0元/条","0.1元/条"));
        ////            }
        ////            else
        ////            {
        ////                $("#phelp").text(calendarMessages.feeTips+result.FreeInfo);
        ////            }
        ////        }
        if (top.$User && !top.$User.isChinaMobileUser()) {
            calendarMessages.meTips = "温馨提示：设置成功后将通过邮件提醒自己。";
        }
        $("#phelp").text(calendarMessages.meTips);

        $("#day7").text(result.SevenCount);
    }
    //重新计算另外还有几条事项,false不需绑定事项，true需绑定事项
    this.resizeRows = function(reBind) {
        $(document).ready(function() {
            var e = document.getElementById('rows');
            if (document.documentElement.clientHeight > 103) {
                var h = document.documentElement.clientHeight - 73 - 6 - 24;
                e.style.height = h + 'px';
                e.style.visibility = "hidden";
            }
            if (!div) div = e.getElementsByTagName('div');
            var count = [];
            var lastRow = $("#calendar_grid6 >thead >tr >th:eq(0)");
            var isHide = 0;
            if (lastRow.length > 0 && lastRow[0].className == "null")//最后一行没有数据则隐藏
            {
                isHide = 1;
                $("#calendar_row6")[0].style.display = "none"; //需加这一行，否则firefox下有点问题
                $("#calendar_row6").children().hide();
            }
            else if (lastRow.length > 0) {
                $("#calendar_row6").show().children().show();
            }
            for (var i = 0, j = div.length, k = 0; i < j; i++) if (div[i].className == 'row') count[k++] = i;
            for (var i = 0, j = count.length, h = 100 / (j - isHide) + '%'; i < j; i++) { if (h < 25) h = 25; div[count[i]].style.height = h; }
            e.style.visibility = '';
            var divHeight = 30;
            if (div[0])
                divHeight = div[0].clientHeight - 24;
            var allowRows = 5;
            if (divHeight > 0) {
                allowRows = Math.round(divHeight / 18); //最大允许行数
            }
            if (allowRows == 0)
                allowRows = 1;

            if (reBind == true) {
                for (var rows = 1; rows <= 6; rows++)//循环6大行
                {
                    var dayHead = $("#calendar_grid" + String(rows) + " >thead >tr >th");

                    for (var i = 0; i < dayHead.length; i++)//循环每行的7列
                    {
                        var dayCells = $("#calendar_grid" + String(rows) + " >tbody >tr >td:nth-child(" + String(i + 1) + ")"); //取每一天的所有事项列表单元格

                        if (dayHead[i].date) {
                            if (dayHead[i].procArray && dayHead[i].procArray.length > 0)//判断当前列是否有事项
                            {
                                var recordCount = dayHead[i].procArray.length;
                                if (recordCount <= allowRows - 1)//全部显示
                                {
                                    for (var m = 0; m < 5; m++) {
                                        dayCells[m].date = dayHead[i].date; //日期
                                        dayCells[m].RecordInfo = null;
                                        if (dayCells[m].date < me.ServerDateTime)
                                            dayCells[m].className = "on";
                                        else
                                            dayCells[m].className = "";
                                        $(dayCells[m]).removeClass("more");

                                        if (m < recordCount) {
                                            var cont = dayHead[i].procArray[m].Content;
                                            var showTime = String(dayHead[i].procArray[m].Starttime);
                                            var hm = "";
                                            if (showTime == "0")
                                                hm = "0:00";
                                            if (showTime == "30")
                                                hm = "0:30";
                                            else if (showTime.length == 3 || showTime.length == 4) {
                                                hm = showTime.substr(0, showTime.length - 2) + ":" + showTime.substr(showTime.length - 2, 2);
                                            }

                                            var itemDetail = hm + " " + cont;
                                            if (dayHead[i].procArray[m].RecMySMS == "1")//设置了提醒
                                                dayCells[m].innerHTML = String.format('<p title="{0}">{0}<i class="alert" title="已设置提醒"></i></p>', itemDetail.replace(/[\n|\s]/g, "").encode().replace("\"", "\\\""));
                                            else
                                                dayCells[m].innerHTML = String.format('<p title="{0}">{0}</p>', itemDetail.replace(/[\n|\s]/g, "").encode().replace("\"", "\\\""));

                                            dayCells[m].RecordInfo = dayHead[i].procArray[m]; //事项信息                                   
                                            dayCells[m].onclick = function() { me.showdetail(this); }
                                        }
                                        else {
                                            dayCells[m].innerHTML = "";
                                            dayCells[m].onclick = function(e) { me.append(e, this); }
                                        }
                                    }
                                }
                                else//只显示部分
                                {
                                    for (var m = 0; m < 5; m++) {
                                        dayCells[m].date = dayHead[i].date; //日期
                                        if (dayCells[m].date < me.ServerDateTime)
                                            dayCells[m].className = "on";
                                        else
                                            dayCells[m].className = "";
                                        dayCells[m].innerHTML = "";
                                        dayCells[m].RecordInfo = null;
                                        $(dayCells[m]).removeClass("more");
                                        if (m < allowRows - 1) {
                                            var cont = dayHead[i].procArray[m].Content;
                                            var showTime = String(dayHead[i].procArray[m].Starttime);
                                            var hm = "";
                                            if (showTime == "0")
                                                hm = "0:00";
                                            if (showTime == "30")
                                                hm = "0:30";
                                            if (showTime.length == 3 || showTime.length == 4) {
                                                hm = showTime.substr(0, showTime.length - 2) + ":" + showTime.substr(showTime.length - 2, 2);
                                            }
                                            var itemDetail = hm + " " + cont;
                                            if (dayHead[i].procArray[m].RecMySMS == "1")//设置了提醒
                                                dayCells[m].innerHTML = String.format('<p title="{0}">{0}<i class="alert" title="已设置提醒"></i></p>', itemDetail.replace(/[\n|\s]/g, "").encode().replace("\"", "\\\""));
                                            else
                                                dayCells[m].innerHTML = String.format('<p title="{0}">{0}</p>', itemDetail.replace(/[\n|\s]/g, "").encode().replace("\"", "\\\""));
                                            dayCells[m].RecordInfo = dayHead[i].procArray[m]; //事项信息
                                            dayCells[m].onclick = function() { me.showdetail(this); }
                                        }
                                        else if (m == allowRows - 1) {
                                            var moreNum = recordCount - allowRows + 1;
                                            var showMoreHref = document.createElement("a"); //$(String.format("<a href=\"javascript:\" title=\"查看另外{0}条数据\">另外{0}条</a>",String(recordCount-allowRows+1)));
                                            showMoreHref.innerHTML = "另外" + String(moreNum) + "条"; //String.format("<a href=\"javascript:\" title=\"查看另外{0}条数据\">另外{0}条</a>",String(recordCount-allowRows+1));
                                            showMoreHref.title = "查看另外" + String(moreNum) + "条";
                                            $(showMoreHref).attr("href", "javascript:");
                                            showMoreHref.titleCell = dayHead[i];
                                            showMoreHref.onclick = function() { me.showMore(this.titleCell); stopBubble() };
                                            $(dayCells[m]).append(showMoreHref);
                                            dayCells[m].className = "more";
                                            dayCells[m].onclick = function(e) { me.append(e, this); }
                                        }
                                        else {
                                            dayCells[m].onclick = function(e) { me.append(e, this); }
                                        }
                                    }
                                }
                            }
                            else {
                                dayCells.each(function() { this.innerHTML = ""; this.date = dayHead[i].date; this.onclick = function(e) { if (this.date) { me.append(e, this); } } });
                            }
                        }
                    }
                }
            }
            top.WaitPannel.hide();
        });
    }
    var div = null;
    var itemPageIndex = 0;
    var itemAllPages = 0;
    var itemObj;
    //上一页
    this.goPrevPage = function() {
        if (itemPageIndex > 0) {
            itemPageIndex -= 1;
            me.setMoreDivInfo(itemObj, itemPageIndex);
        }
    }
    //下一页
    this.goNextPage = function() {
        if (itemPageIndex < itemAllPages - 1) {
            itemPageIndex += 1;
            me.setMoreDivInfo(itemObj, itemPageIndex);
        }
    }
    //另外X条
    this.showMore = function(obj) {
        me.lastMoreObj = obj;
        me.hideAllPop();
        var procCound = obj.procArray.length;
        var item = document.getElementById('item');
        me.setMoreDivInfo(obj, 0);
        var w = obj.offsetWidth;
        item.style.display = 'block';
        var ff = navigator.userAgent.indexOf("Firefox") > 0 ? -1 : 0;
        var top = obj.getBoundingClientRect().top + ff;
        var left = obj.getBoundingClientRect().left + ff;
        item.style.top = String(top) + 'px'
        item.style.left = String(left) + 'px';
        item.style.height = item.clientHeight + 'px';
        var y = navigator.userAgent.indexOf("MSIE") > 0 ? 88 : 11;

        if (($(item).offset().top + item.clientHeight) + y > $("#bottomDiv").offset().top) {
            item.style.top = String($("#bottomDiv").offset().top - item.clientHeight - y) + "px";
        }

        stopBubble();
    }
    //绑定指定页事项
    this.setMoreDivInfo = function(obj, pageIndex) {
        itemObj = obj;
        itemPageIndex = pageIndex;
        var procCound = obj.procArray.length;
        var pageSize = 5;
        var allPages = Math.ceil(procCound / pageSize);
        itemAllPages = allPages;
        var beginIndex = pageIndex * pageSize;
        $("#item div span").html(obj.date.format("M月d日") + " " + obj.NL);

        $("#item div label a").attr("class", "");
        if (pageIndex == 0)//第一页
        {
            $("#item div label a:eq(0)").attr("class", "disabled");
        }
        if (pageIndex == allPages - 1)//最后一页
        {
            $("#item div label a:eq(1)").attr("class", "disabled");
        }
        var classArray = ["a", "b", "c", "d", "e", "f"];
        var m = 0;
        $("#item p").remove();
        for (var i = beginIndex; i < (beginIndex + pageSize); i++) {
            if (obj.procArray[i]) {
                var p = document.createElement("p");
                p.className = classArray[m];
                p.onclick = function() { me.showdetail(this, true); }
                p.RecordInfo = obj.procArray[i];
                p.date = obj.date;
                var cont = obj.procArray[i].Content;
                var showTime = String(obj.procArray[i].Starttime);
                var hm = "";
                if (showTime == "0")
                    hm = "0:00";
                if (showTime == "30")
                    hm = "0:30";
                if (showTime.length == 3 || showTime.length == 4) {
                    hm = showTime.substr(0, showTime.length - 2) + ":" + showTime.substr(showTime.length - 2, 2);
                }
                var itemDetail = hm + " " + cont;

                if (obj.procArray[i].RecMySMS == "1")//设置了提醒
                    p.innerHTML = String.format("<span title=\"{0}\" style='width:100%;display:block'>{0}<i class=\"alert\" title=\"已设置提醒\"></i></span>", itemDetail.replace(/[\s|\n]/g, "").encode().replace("\"", "\\\""));
                else
                    p.innerHTML = String.format("<span title=\"{0}\" style='width:100%;display:block'>{0}</span>", itemDetail.replace(/[\s|\n]/g,"").encode().replace("\"", "\\\""));
                $("#item").append(p);
            }
            m++;
        }
        var isHist = false;
        if (obj.date < me.ServerDateTime)
            isHist = true;
        if (isHist == true)
            $("#item").attr("class", "item on");
        else
            $("#item").attr("class", "item");
    }

    //更新数据
    this.update = function() {
        curCal = this;
        var theadTh = $(".grid thead tr th");
        var today = top.UserData.ServerDateTime ? top.UserData.ServerDateTime : new Date();
        if (me.ServerDateTime)
            today = me.ServerDateTime;
        var dateArray = this.getMonthViewDateArray(this.date.getFullYear(), this.date.getMonth());
        me.dateArrayData = dateArray;
        var oCal = new richinfo.email.calendar.calendarView(this.date.getFullYear(), this.date.getMonth());
        if (today.format("yyyy-MM") == oCal.date.format("yyyy-MM"))//当前视图为当前月，设置今天按钮不可点击
        {
            $("#goToday").attr("disabled", "disabled");
        }
        else {
            $("#goToday").attr("disabled", "");
        }
        theadTh.empty();
        me.hideAllPop();
        $(".bg tr td").each(function() { this.className = ""; this.onclick = null; }); //清除背景,点击事件
        $(".grid >tbody >tr >td").each(function() { this.innerHTML = ""; this.onclick = null; }); //清除单元格文字，点击事件
        $("#currentDate").val(oCal.date.format("yyyy年MM月"));
        document.getElementById("currentDate").realDate = oCal.date.format("yyyy-MM-dd");
        $(document).ready(function() {
            $("#addbyCategory").html(categoryHtml.format("curDate=" + oCal.date.format("yyyy/MM/dd"), "comefrom=1&rnd=" + Math.random()));
        });

        //绑定视图日历
        for (var i = 0; i < 42; i++) {
            day = dateArray[i] || "";
            var bgTd = $("#calendar_row" + String(Math.ceil((i + 1) / 7)) + " .bg tr td:nth-child(" + String(Math.ceil(i % 7) + 1) + ")");
            if (dateArray[i] && parseInt(day) > 0) {
                var index = parseInt(day) - 1;
                var curDay = new Date(me.date.getFullYear(), me.date.getMonth(), day);
                var curDayStr = curDay.format("M月d日");
                var showStr = "";
                if (oCal.year > 1900 || oCal.year > 2050) {
                    theadTh[i].NL = "农历" + objApiForView.cDay(oCal[dateArray[i] - 1].lDay);
                    var nlDay = oCal[dateArray[i] - 1].lDay;
                    theadTh[i].NL_MonthDay = String(oCal[index].lMonth) + (nlDay < 10 ? "0" + nlDay : nlDay);
                    theadTh[i].NL_Day = oCal[dateArray[i] - 1].lDay;
                    if (oCal[index].lDay == 1)
                        theadTh[i].innerHTML = "<span>" + day + "</span>" + objApiForView.nStr1[oCal[index].lMonth] + '月' + (objApiForView.monthDays(oCal[index].lYear, oCal[index].lMonth) == 29 ? '小' : '大');
                    else
                        theadTh[i].innerHTML = "<span>" + day + "</span>" + objApiForView.cDay(oCal[dateArray[i] - 1].lDay);
                    var holidayStr = oCal[index].solarFestival;
                    if (oCal[index].lunarFestival != "")
                        holidayStr = oCal[index].lunarFestival;
                    if (holidayStr != "") {
                        theadTh[i].innerHTML = "<span>" + day + "</span><a href='special/specialday.html?des=" + $.trim(escape(holidayStr)) + "&curDate=" + me.date.format("yyyy/MM/dd") + "&rnd=" + Math.random() + "&comefrom=1' title='添加节日提醒'>" + holidayStr + "</a>";
                    }
                    var solarTerms = oCal[index].solarTerms;
                    if (solarTerms != "" && solarTerms == "清明") {
                        theadTh[i].solarTerms = "清明";
                        theadTh[i].innerHTML = "<span>" + day + "</span><a href='special/specialday.html?des=" + $.trim(escape("清明节")) + "&curDate=" + me.date.format("yyyy/MM/dd") + "&rnd=" + Math.random() + "&comefrom=1' title='添加节日提醒'>清明节</a>";
                    }
                    else {
                        theadTh[i].solarTerms = null;
                    }
                }
                else {
                    theadTh[i].innerHTML = '<span>' + day + '</span>';
                }
                theadTh[i].date = curDay;
                theadTh[i].className = "";

                if (curDay.format("yyyy-MM-dd") == today.format("yyyy-MM-dd"))//设置当天的样式
                {
                    bgTd.each(function() { this.date = curDay; this.className = "today"; this.onclick = function(e) { me.append(e, this); } });
                }
                else if (curDay < today)//历史日期样式
                {
                    bgTd.each(function() { this.date = curDay; this.onclick = function(e) { me.append(e, this); } });
                }
                else {
                    bgTd.each(function() { this.date = curDay; this.onclick = function(e) { me.append(e, this); } });
                }
            }
            else {
                theadTh[i].className = "null";
                bgTd.each(function() { this.className = "null"; this.onclick = null; });
            }
        }

        me.getMonthData();
    }
    this.getMonthData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInLoading);
            //取数据进行绑定              
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/List.ashx",
                data: { sid: top.UserData.ssoSid, pageIndex: 0, curdate: me.date.format("yyyy-MM-dd"), actionId: 5, typeId: 0, rnd: Math.random },
                success: function(result) {
                    if (result.State == 0 && result.ResultCode == "True") {
                        me.ServerTime = result.ServerTime;
                        me.ServerDateTime = new Date(result.ServerTime.split(" ")[0].replace(/\-/g, "/"));
                        top.UserData.CalendarViewJsonData = null;
                        top.UserData.CalendarViewJsonData = result;
                        me.setCount(result)
                        try {
                            me.bindMonthData(result.Table, true);
                        }
                        catch (e) {
                            top.WaitPannel.hide();
                            top.FloatingFrame.confirm(calendarMessages.view_LoadDataErrorMsg, function() { me.getMonthData(); });
                        }
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                }
            });
        }
    }
    this.bindMonthData = function(jsonData, needResize) {
        me.hideAllPop();
        top.WaitPannel.show(calendarMessages.common_DataInLoading);
        var theadTh = $(".grid thead tr th");
        var dateArray = me.dateArrayData;
        for (var index = 0; index < jsonData.length; index++) {
            if (typeof (jsonData[index].StartDateDt) == "undefined") {
                jsonData[index].StartDateDt = new Date(parseInt(jsonData[index].StartDate.replace("/Date(", "").replace(")/", "")));
                jsonData[index].EndDateDt = new Date(parseInt(jsonData[index].EndDate.replace("/Date(", "").replace(")/", "")));
            }
        }
        var curMonth = new Date(me.date.getFullYear(), me.date.getMonth(), 1);
        var nextMonth = new Date(me.date.getFullYear(), me.date.getMonth(), 1).DateAdd("m", 1);
        var monthDays = (nextMonth - curMonth) / (60 * 60 * 24 * 1000);
        var weekCount = 0;
        for (var i = 0; i < 42; i++) {
            day = dateArray[i] || "";
            theadTh[i].procArray = null;
            theadTh[i].date = null;
            var dayNum = parseInt(day);

            if (dateArray[i] && dayNum > 0) {
                var curDay = new Date(me.date.getFullYear(), me.date.getMonth(), day);
                var cur_MD = curDay.format("MMdd");
                var curNL_MonthDay = parseInt(theadTh[i].NL_MonthDay, 10);
                var curNL_Day = theadTh[i].NL_Day;
                var procArray = [];
                theadTh[i].date = curDay;
                theadTh[i].className = "";
                var m = i % 7;
                for (var index = 0; index < jsonData.length; index++) {
                    switch (jsonData[index].SendInterval) {
                        case 0: //不重复 
                        case 3: //每天
                            if (curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt) {
                                procArray.push(jsonData[index]);
                            }
                            break;

                        case 4: //每周
                            {
                                if (jsonData[index].DateFlag.charAt(m) == "1" && curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt) {
                                    procArray.push(jsonData[index]);
                                }
                            }
                            break;

                        case 5: //每月
                            if (jsonData[index].CalendarType == 11) {
                                if (jsonData[index].DateFlag == 99 && day == monthDays)//每月最后一天
                                {
                                    procArray.push(jsonData[index]);
                                }
                                else if (curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt && dayNum >= parseInt(jsonData[index].DateFlag, 10) && dayNum <= parseInt(jsonData[index].EndDateFlag, 10)) {
                                    procArray.push(jsonData[index]);
                                }
                            }
                            else if (jsonData[index].CalendarType == 21 && curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt && curNL_Day >= parseInt(jsonData[index].DateFlag, 10) && curNL_Day <= parseInt(jsonData[index].EndDateFlag, 10)) {
                                procArray.push(jsonData[index]);
                            }
                            break;

                        case 6: //每年
                            if (jsonData[index].CalendarType == 10 && curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt && cur_MD >= jsonData[index].DateFlag && cur_MD <= jsonData[index].EndDateFlag) {
                                procArray.push(jsonData[index]);
                            }
                            else if (jsonData[index].CalendarType == 20 && curDay >= jsonData[index].StartDateDt && curDay <= jsonData[index].EndDateDt && curNL_MonthDay >= parseInt(jsonData[index].DateFlag, 10) && curNL_MonthDay <= parseInt(jsonData[index].EndDateFlag, 10)) {
                                procArray.push(jsonData[index]);
                            }
                            else if (jsonData[index].CalendarType == 40) {
                                var month = jsonData[index].DateFlag.substring(0, 2);
                                var weekIndex = jsonData[index].DateFlag.substring(2, 3);
                                var weekDay = jsonData[index].DateFlag.substring(3, 4);
                                var curMonth = me.date.getMonth() + 1;

                                if (curMonth == month && curDay.getDay() + 1 == weekDay) {
                                    weekCount++;
                                    if (weekCount == weekIndex)
                                        procArray.push(jsonData[index]);
                                }
                            }
                            else if (jsonData[index].CalendarType == 50 && theadTh[i].solarTerms != null)//清明
                            {
                                procArray.push(jsonData[index]);
                            }
                            break;
                    }
                }

                //把当天事项绑定到列头属性上
                if (procArray.length > 0) {
                    theadTh[i].procArray = procArray;
                }
            }
            else {
                theadTh[i].className = "null";
            }
        }
        me.resizeRows(needResize);
    }

    //上一月
    this.goPrevMonth = function() {
        if (this.month == 0) {
            this.year--;
            this.month = 11;
        }
        else
            this.month--;
        this.date = new Date(this.year, this.month);
        this.update();
    }
    //下一月
    this.goNextMonth = function() {
        if (this.month == 11) {
            this.year++;
            this.month = 0;
        }
        else
            this.month++;
        this.date = new Date(this.year, this.month);
        this.update();
    }
    //跳转到今天
    this.goToday = function() {
        this.date = me.ServerDateTime;
        this.update();
        var objCurrentDate = document.getElementById("currentDate");
        if (objCurrentDate) {
            objCurrentDate.value = this.date.format("yyyy年MM月");
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();
        }
    }
    //跳转到某天
    this.gotoSomeDay = function(e) {
        var objCurrentDate = document.getElementById("currentDate");

        if (objCurrentDate) {
            objView.date = new Date(objCurrentDate.realDate.split('-')[0], objCurrentDate.realDate.split('-')[1] - 1, 1);
            objView.year = objView.date.getFullYear();
            objView.month = objView.date.getMonth();
        }
        objView.update();
    }
}


var Common =
{
    getChkvalue: function() {
        var str = "";
        $("input[type=checkbox][id!=chkSelectAllUp]").each(function() {
            if ($(this).attr("checked") == true && $(this).val().toLowerCase() != "on") {
                str += $(this).val() + ",";
            }
        });
        return str;
    },
    //绑定分页
    bindPage: function(jqueryObj, currentPage, totalPage, prev, next, sltpager) {
        var pagehtml = "";
        var firstpage = true;
        jqueryObj.find("a:eq(0)").unbind("click");
        jqueryObj.find("a:eq(1)").unbind("click");
        jqueryObj.find("select").unbind("change");

        jqueryObj.find("a:eq(0)").hide();
        jqueryObj.find("a:eq(1)").hide();
        jqueryObj.find("span").hide();
        jqueryObj.find("select").hide();

        if (currentPage > 1)//上一页
        {
            jqueryObj.find("a:eq(0)").click(prev);
            jqueryObj.find("a:eq(0)").show();
        }
        else {
            firstpage = false;
        }
        if (currentPage < totalPage)//下一页
        {
            if (firstpage == true) {
                jqueryObj.find("span").show();
            }
            jqueryObj.find("a:eq(1)").click(next);
            jqueryObj.find("a:eq(1)").show();
        }
        jqueryObj.find("select").empty();

        for (var i = 1; i <= totalPage; i++) {
            var option = document.createElement("option");
            option.text = i.toString() + "/" + totalPage.toString();
            option.value = i.toString();
            jqueryObj.find("select")[0].options.add(option);
        }
        jqueryObj.find("select")[0].selectedIndex = currentPage - 1;

        jqueryObj.find("select").change(sltpager);
        jqueryObj.find("select").show();
        jqueryObj.show();
    }
};


//列表页
function ListPage() {
    var me = this;
    isLoading = false;
    pageindex = 1;
    pagesize = 20;
    actionid = 0;
    typeid = 0;
    mobile = "";
    seqnos = "";    //常规列表
    seqnos2 = "";   //
    listtype = 0;   //列表类 0所有,1约会,2交费...
    clickType = 0;
    document.onclick = function(e) {
        me.hideAllPop();
    }
    $(document).ready(function() {
        $("#addbyCategory").html(categoryHtml.format("rnd=" + Math.random(), "comefrom=2"));
    });
    this.hideAllPop = function() {
        document.getElementById('addbyCategory').style.visibility = 'hidden';
        //         $("#addbyCategory").hide();
    }
    //    $("#addbyCategory").click(function(){
    //         $("#addbyCategory").show();            
    //    });

    this.EditClick = function() {
        window.location.href = me.getEditHref(); if (window.event) window.event.returnValue = false;
    }

    this.load = function() {
        isLoading = true;
        setTimeout(function() {
            if (isLoading)
                top.WaitPannel.show(calendarMessages.list_DataInLoading);
        }, 1000);

        var paramtype = Utils.queryString("type");
        if (paramtype) {
            typeid = parseInt(paramtype);
        }
        var paramlist = Utils.queryString("listtype");
        if (paramlist) {
            listtype = parseInt(paramlist);
        }
        $("#aEdit").click(function() {
            me.EditClick();
        });
        $("#aEdit1").click(function() {
            me.EditClick();
        });
        $("#aEdit2").click(function() {
            me.EditClick();
        });
        $("#aEdit3").click(function() {
            me.EditClick();
        });
        $("#aEdit5").click(function() {
            me.EditClick();
        });
        $("#aEdit6").click(function() {
            me.EditClick();
        });
        $("#aEdit11").click(function() {
            me.EditClick();
        });
        $("#btnAddInList").click(function() {
            window.location.href = me.getEditHref(); if (window.event) window.event.returnValue = false;
        });
        me.getList();
    };

    this.getEditHref = function() {
        var edithref = "";
        switch (listtype) {
            case 1:
                edithref = "special/meet.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            case 2:
                edithref = "special/pay.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            case 3:
                edithref = "special/specialday.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            case 5:
                edithref = "special/match.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            case 6:
                edithref = "special/birthday.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            case 8:
                edithref = "special/baby.html?comefrom=2&rnd=" + Math.random();
                break;
            case 11:
                edithref = "special/astro.html?comefrom=2&listtype=" + listtype.toString() + "&rnd=" + Math.random();
                break;
            default:
                edithref = "calendar_editcalendar.html?comefrom=2&rnd=" + Math.random();
                break;
        }
        return edithref;
    }

    $("#all").click(function() {
        pageindex = 1;
        typeid = 0;
        clickType = 1;
        listtype = 0;
        me.getList();
        return false;
    });

    $("#allCalendar").click(function() {
        pageindex = 1;
        typeid = 0;
        clickType = 1;
        listtype = 0;
        me.getList();
        return false;
    });

    $("#aRecent").click(function() {
        pageindex = 1;
        typeid = 1;
        clickType = 1;
        listtype = 0;
        me.getList();
        return false;
    });

    $("#aAgent").click(function() {
        pageindex = 1;
        typeid = 2;
        clickType = 1;
        listtype = 0;
        me.getList();
        return false;
    });

    $("#aHasDone").click(function() {
        pageindex = 1;
        typeid = 3;
        clickType = 1;
        listtype = 0;
        me.getList();
        return false;
    });

    $("#chkSelectAll").click(function() {
        if ($("#chkSelectAll").html() == "全选") {
            $("[name='calItem']:checkbox").attr("checked", 'true');
            $("#chkSelectAll").html("不选");
        }
        else {
            $("[name='calItem']:checkbox").removeAttr("checked");
            $("#chkSelectAll").html("全选");
        }
    }
    );

    //获得已选择id列表
    this.checkSelect = function() {
        seqnos = "";
        seqnos2 = "";
        var strseqno = Common.getChkvalue(); //0_1,0_3,0_4,
        var arr = strseqno.split(",");
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].substring(0, arr[i].indexOf("_")) == "0") {
                seqnos = seqnos + arr[i].substring(arr[i].indexOf("_") + 1) + ",";
            }
            else {
                seqnos2 = seqnos2 + arr[i].substring(arr[i].indexOf("_") + 1) + ",";
            }
        }
        seqnos = seqnos.substring(0, seqnos.lastIndexOf(","));
        seqnos2 = seqnos2.substring(0, seqnos2.lastIndexOf(","));
    };
    $("#goView").click(function() { window.location.href = '/m2012/html/calendar/calendar_view.html'; if (window.event) window.event.returnValue = false; });
    //取消提醒
    $("#btnSMSCancel").click(function() {
        me.optType = 0;
        me.checkSelect();
        //未选择事项
        if (seqnos == "" && seqnos2 == "") {
            //            top.FloatingFrame.show(me.htmSelectTip, "系统提示", 400, 220);
            top.FloatingFrame.alert(calendarMessages.list_NotSelectItem);
        }
        else {
            actionid = 1;
            me.getList();
        }
        return false;
    });

    this.DelCalendar = function() {
        me.optType = 1;
        actionid = 2;
        me.getList();
        return false;
    };

    //删除日程
    $("#btnCalendarDel").click(function() {
        me.checkSelect();
        //未选择事项
        if (seqnos == "" && seqnos2 == "") {
            //            top.FloatingFrame.show(me.htmSelectTip, "系统提示", 400, 220);
            top.FloatingFrame.alert(calendarMessages.list_NotSelectItem);
        }
        else {
            //            top.FloatingFrame.show(me.htmDelTip, "系统提示", 400, 220);
            top.FloatingFrame.confirm(calendarMessages.list_ConfirmDelCalendar, function() {
                me.DelCalendar();
            });
        }
        return false;
    });

    this.delCal = function(stype, seq) {
        top.FloatingFrame.confirm(calendarMessages.list_ConfirmDelCalendar, function() {
            if (stype == "0") {
                seqnos = seq;
                seqnos2 = "";
            }
            else {
                seqnos = "";
                seqnos2 = seq;
            }
            me.DelCalendar();
        });
    };

    this.bindList = function(result) {
        var table = $("#tableCalendarList");
        $(table).hide();
        var html = "";
        var trClass = "";
        var tdChk = "";
        var tdTime = "";
        var tdTime2 = "";
        var mtime = "";
        var tdType = "";
        var tdContent = "";
        var tdSMS = "";
        var template = '<li{0}>\
                        <div class="bar">\
                            <input type="checkbox" name="calItem" value="{1}" />{2}\
                            <div class="status">{3}</div>\
                            <div class="tool"><a href="#" onclick="page.delCal({4},{5});return false;" title="删除"><i class="del"></i></a></div>\
                        </div>\
                        <div class="ctns">{6}{7}</div>\
                        </li>';
        $.each(result.Table, function(i, n) {
            if (n.Status == 3)//已办
                trClass = " class=\"on\"";
            tdChk = n.SendType + "_" + n.SeqNo;
            tdType = "<a href='/m2012/html/calendar/calendar_list.html?listtype=" + n.SendType + "'>";

            var href = ""; //跳转地址
            switch (n.SendType) {
                case 0:
                    href = "calendar_editcalendar.html?comefrom=2&id=" + n.SeqNo.toString();
                    tdType = "";
                    break;
                case 1:
                    href = "special/meet.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【约会】</a>";
                    break;
                case 2:
                    href = "special/pay.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【交费】</a>";
                    break;
                case 3:
                    href = "special/specialday.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【特殊日子】</a>";
                    break;
                case 5:
                    href = "special/match.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【赛事】</a>";
                    break;
                case 6:
                    href = "special/birthday.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【生日】</a>";
                    break;
                case 7:
                    href = "javascript:' isGame='1' seqNo='" + n.SeqNo.toString();
                    tdType = "<a href='/m2012/html/calendar/calendar_list.html?listtype=5'>【赛程】</a>";
                    break;
                case 8:
                    href = "javascript:;' onclick='top.FloatingFrame.open(calendarMessages.baby_EditBabyInfoTitle,\"/m2012/html/calendar/special/babyset.html?seq_no=" + n.SeqNo.toString() + "&type=2&comefrom=1&rnd=" + Math.random() + "\",450);return false;";
                    tdType = "<a href='special/baby.html?comefrom=2'>【宝宝防疫】</a>";
                    break;
                case 9:
                    href = "javascript:' isGame='9' seqNo='" + n.SeqNo.toString();
                    //href = "Game/gameindex.html?comefrom=2&id="+n.SeqNo.toString()+"&listtype="+listtype.toString();
                    tdType = "<a href='/m2012/html/calendar/calendar_list.html?listtype=5'>【亚运会】</a>";
                    break;
                case 11:
                    href = "special/astro.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=" + listtype.toString();
                    tdType = tdType + "【星座运势】</a>";
                    break;
                case 12:
                    var arr_temp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
                    var now_temp = new Date(arr_temp[0], arr_temp[1], arr_temp[2]);
                    var now_temps = now_temp.getTime(); //当前日期

                    var over_temp = new Date("2012", "08", "14");
                    var over_temps = over_temp.getTime(); //下线日期
                    if (now_temps < over_temps) {
                        //                        href = "Game/gameindex.html?comefrom=2&id="+n.SeqNo.toString()+"&listtype="+listtype.toString();
                        href = "special/match.html?comefrom=2&id=" + n.SeqNo.toString() + "&listtype=12";
                    }
                    else {
                        href = "javascript:' isGame='12' seqNo='" + n.SeqNo.toString();
                    }
                    tdType = "<a href='/m2012/html/calendar/calendar_list.html?listtype=5'>【奥运会】</a>";
                    break;
                default:
                    href = "calendar_editcalendar.html?comefrom=2&id=" + n.SeqNo.toString();
                    tdType = "";
                    break;
            }
            if (listtype > 0) {
                tdType = "";
            }

            tdTime = n.DateDescript.encode();
            if (n.SendType == 8) {
                tdTime2 = "<a href='" + href + "'>" + tdTime + "</a>";
                tdContent = "<a href='" + href + "'>" + n.Content.replace(/[\n|\s]/g, "").encode() + "</a>";
            }
            else {
                tdTime2 = "<a href='" + href + "&rnd=" + Math.random() + "'>" + tdTime + "</a>";
                tdContent = "<a href='" + href + "&rnd=" + Math.random() + "'>" + n.Content.replace(/[\n|\s]/g, "").encode() + "</a>";
            }

            mtime = "分钟";
            switch (n.BeforeType) {
                case 0:
                    mtime = "分钟";
                    break;
                case 1:
                    mtime = "小时";
                    break;
                case 2:
                    mtime = "天";
                    break;
                default:
                    break;
            }
            tdSMS = "<a href='" + href + "'><i class=\"alert\"></i><span>" + "提前" + n.BeforeTime.toString() + mtime + "发送提醒</span></a>";
            if (n.RecMyEmail == 1 || n.RecEmail.length > 0) {
                tdSMS = tdSMS + "<i class=\"alt-mail\" title=\"邮件提醒\"></i>";
                if (n.RecMySMS == 1 || n.RecMobile.length > 0) {
                    tdSMS = tdSMS + "<i class=\"alt-phone\" title=\"短信提醒\"></i>";
                }
            }
            else if (n.RecMySMS == 1 || n.RecMobile.length > 0) {
                tdSMS = tdSMS + "<i class=\"alt-phone\" title=\"短信提醒\"></i>";
            }
            else {
                tdSMS = "&nbsp;";
            }

            html = html + String.format(template, trClass, tdChk, tdTime2, tdSMS, n.SendType, n.SeqNo.toString(), tdType, tdContent);
        });
        if (html.length > 0) {
            $(table).html(html);
            $("a[isGame=1]").click(function() {
                top.FloatingFrame.alert(calendarMessages.list_WorldCupIsOver);
            });
            $("a[isGame=9]").click(function() {
                top.FloatingFrame.alert(calendarMessages.list_YaYunIsOver);
            });
            $("a[isGame=12]").click(function() {
                top.FloatingFrame.alert(calendarMessages.list_FISUIsOver);
            });
        }
        $(table).show();

        $("#tableCalendarList li").unbind("hover");
        $("#tableCalendarList li").hover(function() {
            $(this).addClass("hover").find(".tool").show();
        }, function() {
            $(this).removeClass("hover").find(".tool").hide();
        });
    };
    this.setLeftCont = function(type) {
        $(".tag li a").removeClass("cur");
        if (clickType > 0) {
            removedHrefText = null;
            $(".tag li a:eq(" + type + ")").addClass("cur");
            if (removedHrefObj && removedHrefObjAttr) {
                removedHrefObj.attr("href", removedHrefObjAttr).parent().removeClass("cur");
            }
        }
        else if (!removedHrefText) {
            $("#allCalendar").attr("class", "cur");
        }
        switch (type) {
            case 0:
                $("#leftCurCont").html('<i class=\"mycalendar\"></i><span>我的日程</span>');
                break;
            case 1:
                $("#leftCurCont").html('<i class=\"day7\"></i><span>最近7天日程</span>');
                break;
            case 2:
                $("#leftCurCont").html('<i class=\"undo\"></i><span>待办事项</span>');
                break;
            case 3:
                $("#leftCurCont").html('<i class=\"done\"></i><span>已办事项</span>');
                break;
            default:
                $("#leftCurCont").html('<i class=\"mycalendar\"></i><span>我的日程</span>');
                break;
        }
        if (removedHrefText)
            $("#leftCurCont").html('<i class=\"mycalendar\"></i><span>' + removedHrefText + '</span>');
    }
    //缺省文字修改
    this.DisplayEmpty = function(show) {
        $("#empty").hide();
        $("#empty1").hide();
        $("#empty2").hide();
        $("#empty3").hide();
        $("#empty5").hide();
        $("#empty6").hide();
        $("#empty11").hide();
        if (show) {
            switch (listtype) {
                case 1:
                    $("#empty1").show();
                    break;
                case 2:
                    $("#empty2").show();
                    break;
                case 3:
                    $("#empty3").show();
                    break;
                case 5:
                    $("#empty5").show();
                    break;
                case 6:
                    $("#empty6").show();
                    break;
                case 11:
                    $("#empty11").show();
                    break;
                default:
                    $("#empty").show();
                    break;
            }
        }
    }

    this.getList = function() {
        if (removedHrefText)
            $("#leftCurCont").html('<i class=\"mycalendar\"></i><span>' + removedHrefText + '</span>');
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/List.ashx",
                data: { sid: top.UserData.ssoSid, pageIndex: pageindex, pageSize: pagesize, actionId: actionid, typeId: typeid, seqNos: seqnos, seqNos2: seqnos2, sendtype: listtype, rnd: Math.random() },
                success: function(result) {
                    if (result.State == 0) {
                        var iscancel = false;
                        if (actionid == 2 || actionid == 1) {
                            if (result.ResultCode != undefined && result.ResultCode.toLowerCase() == "false") {
                                //                                top.FloatingFrame.show(me.htmSysTip, "系统提示", 400, 220);
                                top.FloatingFrame.alert(calendarMessages.common_SysError);
                                return false;
                            }
                            iscancel = true;
                            actionid = 0;
                            if (me.optType == 0)
                                top.WaitPannel.show(calendarMessages.list_CancelCalendarSuccess);
                            else
                                top.WaitPannel.show(calendarMessages.list_DelCalendarSuccess);
                            $("#chkSelectAll").html("全选");
                        }
                        me.setLeftCont(typeid);
                        //列表
                        $("#allcount").text(result.AllCount);
                        $("#sevencount").text(result.SevenCount);
                        $("#spanCount1").text("全部日程(" + result.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + result.SevenCount + ")");
                        if (result.PageCount == 0)//没有日程
                        {
                            me.DisplayEmpty(true);
                            $("#listtable").hide();
                        }
                        else {
                            me.DisplayEmpty(false);
                            $("#listtable").show();
                            if (pageindex > result.PageCount) {
                                pageindex = result.PageCount;
                                me.getList();
                            }
                            if (result.PageCount > 1) {
                                Common.bindPage($("#pager"), pageindex, result.PageCount,
                                    function() {
                                        pageindex--;
                                        me.getList();
                                    },
                                    function() {
                                        pageindex++;
                                        me.getList();
                                    },
                                    function() {
                                        pageindex = parseInt($(this).val());
                                        me.getList();
                                    });
                            }
                            else {
                                $("#pager").hide();
                            }
                            me.bindList(result);
                        }
                        if (iscancel) {
                            setTimeout(function() {
                                top.WaitPannel.hide();
                            }, 1000);
                        }
                        else {
                            isLoading = false;
                            top.WaitPannel.hide();
                        }
                    }
                    else {
                        isLoading = false;
                        top.WaitPannel.hide();
                        //top.FloatingFrame.alert("系统繁忙，请稍候再试!");
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }
};

