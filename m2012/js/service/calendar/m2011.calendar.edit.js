var calendarMessages = {
    //公共提示语
    common_DateError: "日期填写不正确",
    common_SysError: "系统繁忙，请稍候再试！",
    common_DataInProcess: "数据处理中，请稍候...",
    common_DataInLoading: "数据加载中，请稍候...",
    common_DataIsOld: "因系统升级，原设置的提醒时间格式与新系统不符，请重新修改后保存！",
    common_ValidImgTextError: "错误的图片验证码，请重新输入!",

    //提醒框部分的提示语
    emptyMobileText: "最多{0}个,号码之间以逗号隔开,支持向全国移动用户发送",
    emptyMobileMsg: "请输入好友手机号码",
    emptyEmailText: "最多{0}个,地址之间以逗号或分号隔开",
    emptyEmailMsg: "请输入好友邮件地址",
    mobileErrorMsg: "{0}不是中国移动手机号码，请检查输入！",
    emailErrorMsg: "{0}不是正确的邮件地址，请检查输入！",
    mobileExistsMsg: "号码{0}重复出现，请检查输入！",
    emailExistsMsg: "邮件地址{0}重复出现，请检查输入！",
    mobileGroupOverMsg: "很抱歉，您每次最多可同时发送{0}个号码，请您删除多余号码再试！",
    emailGroupOverMsg: "很抱歉，您每次最多可同时发送{0}封邮件，请您删除多余邮件地址再试！",
    smsConfirmMsg: "您的邮件到达通知处于开启状态，同时选择短信和邮件提醒，有可能会同时收到邮件通知短信和提醒短信！",
    validImgTextEmpty: "请输入验证码",
    txtVallidMsg: "请点击获取验证码",
    //编辑的公共提示
    inputWordTooLong: "您最多只能输入{0}个字！",
    validImgTextError: "错误的图片验证码，请重试！",
    confirmNotSendSMS: "开始时间已过，无法下发提醒通知，确定要添加日程？",
    errTimeMsg: "结束时间不能小于开始时间！",
    errWeekMsg: "请至少选择每周中的一天！",
    feeTips: "温馨提示：短信",
    feeMsg: "本月已发{0}条，按{1}元/条计费",
    meTips: "温馨提示：设置成功后将通过免费短信和邮件提醒自己。",

    //常规        
    cal_ContentNotEmpty: "日程内容不可为空！",
    cal_DefaultContent: "如：在一号会议室开会",
    cal_SuccussMsg: "成功添加提醒",

    //生日提醒
    birthday_NameEmpty: "请输入姓名",
    birthday_NameLengthMsg: "姓名最多允许输入20个字",
    birthday_DateEmpty: "请选择生日",


    //特殊日子
    specialday_NotSelectType: "请选择类别",
    specialday_SpecialDayDescEmpty: "请输入其它纪念日的描述信息",
    specialday_NoSelectSpecialDay: "请选择节日",
    specialday_EndDateError: "结束时间不能小于开始时间",
    specialday_NotFindSpecialDay: "没有找到相关的节日",

    //宝宝防疫
    baby_BabyNameEmpty: "请填写宝宝姓名！",
    baby_BirthdayEmpty: "请选择宝宝生日",
    baby_RemindInfoAdded: "成功添加提醒",
    baby_RemindInfoRemoved: "已取消提醒",
    baby_NeedSelectSmsOrEmail: "请至少选择一种提醒方式：短信或邮件",
    baby_DateError: "您所选择的日期不正确",
    baby_DateTimeIsNotValid: "提醒时间不能小于当前时间",
    baby_EditBabyInfoConfirmMsg: "变更宝宝生日，免疫接种时间将重新计算，原有添加的提醒内容将会被删除，您确定要修改吗？",
    baby_DelbyInfoConfirmMsg: "删除宝宝信息，原有添加的提醒内容将会被删除，您确定要删除吗？",

    //列表
    list_DataInLoading: "数据加载中...",
    list_NotSelectItem: "请选择事项。",
    list_ConfirmDelCalendar: "确定要删除此日程吗？",
    list_WorldCupIsOver: "世界杯赛程已过期，无法进行编辑！",
    list_CancelCalendarSuccess: "已取消提醒",
    //约会
    meet_DefaultContent: "如：约了小李一起看电影",
    meet_ContentNotEmpty: "日程内容不可为空！",
    meet_ContentTooLong: "日程内容不能超过{0}个字！",
    meet_SiteLong: "约会地点不能超过{0}个字！",
    //交费
    pay_NotSelectPayType: "请选择交费种类",
    pay_ContentTooLong: "备注不能超过{0}个字",
    pay_FeeEmpty: "请填写金额",
    pay_FeeMaxError: "金额不能大于{0}",
    pay_FeeError: "请输入正确的金额",
    pay_Content: "{0}，金额{1}元{2}",
    //赛事
    match_DefaultContent: "如：羽毛球 中国 ～ 美国",
    match_ContentEmpty: "请填写赛事内容",
    match_ContentTooLong: "赛事内容不能超过{0}个字",
    //星座运势
    astro_NotSelect: "请选择星座"
};

var tempXml = [];
tempXml.push("<Request>");
tempXml.push("<appids>{0}</appids>");
tempXml.push("<content>{1}</content>");
tempXml.push("<groupid>{2}</groupid>");
tempXml.push("<calendartype>{3}</calendartype>");
tempXml.push("<interval>{4}</interval>");
tempXml.push("<dateflag>{5}</dateflag>");
tempXml.push("<enddateflag>{6}</enddateflag>");
tempXml.push("<starttime>{7}</starttime>");
tempXml.push("<endtime>{8}</endtime>");
tempXml.push("<recmysms>{9}</recmysms>");
tempXml.push("<recmyemail>{10}</recmyemail>");
tempXml.push("<recmobile>{11}</recmobile>");
tempXml.push("<recemail>{12}</recemail>");
tempXml.push("<datedesc>{13}</datedesc>");
tempXml.push("<beforetype>{14}</beforetype>");
tempXml.push("<beforetime>{15}</beforetime>");
tempXml.push("<validimg>{16}</validimg>");
tempXml.push("<fee>{17}</fee>");
tempXml.push("<site>{18}</site>");
tempXml.push("<holidayid>{19}</holidayid>");
tempXml.push("<users>{20}</users>");
tempXml.push("<startdate>{21}</startdate>");
tempXml.push("<enddate>{22}</enddate>");
tempXml.push("</Request>");
var specialTempXmlString = tempXml.join("");


var babyConfig = [{ interval: "d", val: 0 },
        { interval: "m", val: 1 },
        { interval: "m", val: 2 },
        { interval: "m", val: 3 },
        { interval: "m", val: 4 },
        { interval: "m", val: 5 },
        { interval: "m", val: 6 },
        { interval: "m", val: 8 },
        { interval: "m", val: 18 },
        { interval: "y", val: 4 },
        { interval: "y", val: 7}];
var overConfig = [{ interval: "d", val: 0 },
        { interval: "m", val: 1 },
        { interval: "m", val: 2 },
        { interval: "m", val: 3 },
        { interval: "m", val: 4 },
        { interval: "m", val: 5 },
        { interval: "m", val: 6 },
        { interval: "m", val: 8 },
        { interval: "m", val: 24 },
        { interval: "y", val: 4 },
        { interval: "y", val: 7}];

var richinfo = richinfo ? richinfo : {}
richinfo.email = richinfo.email ? richinfo.email : {}
richinfo.email.calendar = richinfo.email.calendar ? richinfo.email.calendar : {}

function iereset(e, t) {
    var re = function() { document.getElementById(e).style.height = document.documentElement.clientHeight - 37 - (t ? t : 0) + 'px'; }
    window.onload = re;
    window.onresize = re;
}
//重新定位日期选择控件
function resetCalendarTop() {
    //    var divScrollHeight=$("#content").scrollTop();
    //    var offset=$("#__calendarForm").offset();
    //    var curTop=offset.top-divScrollHeight;
    //    $("#__calendarPanel")[0].style.top=curTop+"px";
    if (objSelector) {
        var objSelect = $(objSelector.popuControl);
        if (objSelect.length > 0) {
            $("#__calendarPanel")[0].style.top = $(objSelect).offset().top + $(objSelect).height() + 1 + "px";
        }
    }
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

//获取时间对应提示
function calendarGetTimeShow(h) {
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
//判断是否是邮件列表或是写信页过来的
function isFromMailPage() {
    var comefrom = Utils.queryString("comefrom");
    if (comefrom == "100" || comefrom == "101") {
        return true;
    }
    return false;
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
var _textMobile = "";
var _textMail = "";
var _LastFocusAddressBox = null;
function AddrCallbackMobile(addr) {
    var rightMobiles = objRichInputMobileBox.getRightNumbers().join("");
    if (rightMobiles == "" || rightMobiles == calendarMessages.emptyMobileText) {
        objRichInputMobileBox.setTipText = "";
        objRichInputMobileBox.insertItem(addr);
    } else if (String(rightMobiles).indexOf(addr) == -1) {
        objRichInputMobileBox.insertItem(addr);
    }
    try {
        Utils.focusTextBox(_LastFocusAddressBox);
    } catch (e) { }
}
function AddrCallbackEmail(addr) {
    $(_LastFocusAddressBox).removeClass("normal");
    var rightEmails = objRichInputEmailBox.getRightEmails().join("");
    if (rightEmails == "" || rightEmails == calendarMessages.emptyEmailText) {
        objRichInputEmailBox.setTipText = "";
        objRichInputEmailBox.insertItem(addr);
    } else if (String(rightEmails).indexOf(addr) == -1) {
        objRichInputEmailBox.insertItem(addr);
    }
    try {
        Utils.focusTextBox(_LastFocusAddressBox);
    } catch (e) { }
}

richinfo.email.calendar.commonUI = richinfo.email.calendar.commonUI ? richinfo.email.calendar.commonUI : {}
richinfo.email.calendar.commonUI.remindBox = richinfo.email.calendar.commonUI.remindBox ? richinfo.email.calendar.commonUI.remindBox : {}
var objRichInputMobileBox = null;
var objRichInputEmailBox = null;
//提醒我或好友相关功能
richinfo.email.calendar.commonUI.remindBox = function(type) {
    var me = this;

    if (isFromMailPage())//邮件列表(100)或写信页(101)的提醒
    {
        var mailType = Utils.queryString("comefrom");
        type = parseInt(mailType, 10);
    }
    me.type = (typeof (type) == "undefined") ? 0 : parseInt(type, 10);

    var currDateTime = new Date();
    me.sendSmsStartTime = currDateTime;
    me.sendSmsEndTime = currDateTime;
    me.isNeedValidImg = false; //是否需验证码
    me.validImgUrl = ""; //验证码地址
    var eventText = "事件";
    var timetips = "(下发提醒时间以当天上午8点为基准)";
    var friendstips = "提醒好友";
    switch (type) {
        case 1: eventText = "约会"; timetips = ""; break;
        case 2: eventText = "交费"; break;
        case 3: break;
        case 5: eventText = "赛事"; timetips = ""; break;
        case 6: eventText = "每年生日"; break;
        case 11: eventText = ""; timetips = "(每周一上午8点发)"; break;
        case 100: case 101: friendstips = "提醒收件人"; timetips = ""; break;
        default: timetips = ""; break;
    }
    this.$ = function(obj) {
        return $(".form " + obj);
    }
    //页面html
    this.drawHTML = function() {
        var htmlArray = [];
        htmlArray.push('<dt><i class="alert"></i>提醒</dt><dd>');
        htmlArray.push('<p>' + timetips + '</p>');
        htmlArray.push('<p id="oldStatusTr" style="display:none">提醒时间<span id="oldStatusMsg"></span><a href="javascript:" id="changeStatus" style="margin-left:10px">修改</a></p>');
        htmlArray.push('<p id="newStatusTr">在' + eventText + '前<select id="opAdvanc"></select>');
        htmlArray.push('<label>发送提醒通知</label></p>');
        htmlArray.push('<div class="panel" id="spanalert">');
        htmlArray.push('<table cellpadding="0" cellspacing="0">');
        //		htmlArray.push('<tr id="oldStatusTr1" style="display:none"><th>提醒时间</th><td><span id="oldStatusMsg"></span><a href="javascript:" id="changeStatus" style="margin-left:10px">修改</a></td></tr>');
        //		htmlArray.push('<tr id="newStatusTr1">');
        //		htmlArray.push( '<td>在'+eventText+'前</td>');
        //		htmlArray.push('<td><select id="opAdvanc">');
        //		htmlArray.push('</select>');
        //		if(me.type == 6){
        //		    htmlArray.push('<label>发送提醒通知或祝福</label></td>');
        //		}
        //		else{
        //		    htmlArray.push('<label>发送提醒通知</label></td>');
        //		}
        //		htmlArray.push('</tr>');
        htmlArray.push('<tr>');
        htmlArray.push('<th><input type="checkbox" id="chkme" checkbox/></th>');
        if (top.$User && top.$User.isChinaMobileUser()) {
            htmlArray.push('<td>提醒自己<label>(将通过免费短信和邮件提醒)</label></td>');
        } else {
            htmlArray.push('<td>提醒自己<label>(将通过邮件提醒)</label></td>');
        }
        
        htmlArray.push('</tr>');
        if (top.$User && top.$User.isChinaMobileUser()) {
            htmlArray.push('<tr>');
            htmlArray.push('<th><input type="checkbox" id="chkother"/></th>');
            htmlArray.push('<td>' + friendstips + '</td>');
            htmlArray.push('</tr>');
        }
        htmlArray.push('<tr id="otherTr" style="display:none">');
        htmlArray.push('<th></th>');
        htmlArray.push('<td>');
        htmlArray.push('<p><input type="checkbox" id="chkmsg"/><label for="chkmsg">发短信</label></p>');
        htmlArray.push('<div class="addrWrap" id="pmsg" style="display:none"><div id="txtmobile" class="addrBox"></div><span><i class="add" id="addmobileimg"></i><a href="javascript:;" id="addmobile">添加</a></span></div><div style="clear:both"></div>');
        htmlArray.push('<p class="help" id="phelp" style="display:none"></p>');
        htmlArray.push('<p><input type="checkbox" id="chkmail"/><label for="chkmail">发邮件</label></p>');
        htmlArray.push('<div class="addrWrap" id="pmail" style="display:none"><div id="txtemail" class="addrBox" ></div><span><i class="add" id="addemailimg"></i><a href="javascript:;" id="addemail">添加</a></span></div><div style="clear:both"></div>');
        htmlArray.push('</td>');
        htmlArray.push('</tr>');
        htmlArray.push('</table>');
        htmlArray.push('</div>');
        htmlArray.push('</dd>');
        htmlArray.push('<dt id="dtValidImg" style="display:none">验证码</dt>');
        htmlArray.push('<dd id="ddValidImg" class="code" style="display:none" >');
        htmlArray.push('<input  class="txt vcode" id="txtValidate" style="width:100px" value="' + calendarMessages.txtVallidMsg + '"/>');
        htmlArray.push('<span id="spImgCode" onclick="Utils.stopEvent();" style="display:block;width:auto;padding:5px 5px 2px;top:-72px">');
        htmlArray.push('<img id="imgValidate" style="border:1px solid #ccc;float:left" src="" alt="图片验证码"/>');
        htmlArray.push('<div style="margin:3px 0 0 178px;_margin-top:8px;width:240px;line-height:1.4">');
        htmlArray.push('<p>图中显示的图案是什么？将你认为正确答案前的<font style="color:#ff6600">字母或数字</font>填入框中（不分大小写）</p>');
        htmlArray.push('<p><a id="aValidate" href="javascript:;" style="color:#0040c5;">看不清，换一张</a></p>');
        htmlArray.push('</div>');
        htmlArray.push('</span>');
        htmlArray.push('<iframe class="bghack" style="display:none;width:340px;margin-top:19px;height:67px;" id="hackFrame"></iframe>');
        htmlArray.push('</dd>');
        document.write(htmlArray.join(""));
    }
    //绑定事件
    this.bindEvent = function() {
        if (me.type == 100)//读邮件的添加提醒功能,不能点击
        {
            me.$("#chkother").attr("disabled", true);
            me.$("#chkme").attr("disabled", true);
        }
        me.$("#chkother").click(function() {
            if ($(this).attr("checked")) {
                me.$("#otherTr").show();
                me.$("#chkmsg").attr("checked", true);
                me.$("#chkmail").attr("checked", true);
            }
            else {
                me.$("#chkmsg").attr("checked", false);
                me.$("#chkmail").attr("checked", false);
                me.$("#otherTr").hide();
            }
            me.showMobileInfo();
            me.showEmailInfo();
            me.checkToShowValidInfo();
        });
        //        me.$("#chkmemsg").click(function()
        //        {
        ////            me.showSmsConfirm();
        //            me.showFeeInfo();
        //            me.checkToShowValidInfo();
        //        });
        //        me.$("#chkmemail").click(function()
        //        {
        ////            me.showSmsConfirm();
        //            me.checkToShowValidInfo();
        //        });
        me.$("#chkme").click(function() {
            me.checkToShowValidInfo();
        });
        me.$("#opAdvanc").change(function() {
            //            me.showSmsConfirm();
        });
        me.$("#chkmsg").click(function() {
            me.showMobileInfo();
            me.checkToShowValidInfo();
        });
        me.$("#chkmail").click(function() {
            me.showEmailInfo();
            me.checkToShowValidInfo();
        });
        me.$("#opAdvanc").change(function() {
            me.setEventTime(me.eventStartTime, me.eventEndTime);
        });
        me.$("#txtValidate").focus(function() {
            if ($(this).val() == calendarMessages.txtVallidMsg) {
                $(this).val("");
            }
            me.showValidImage(0);
            $(document).click(function(e) {
                if (!(e.target.id == "txtValidate" || e.target.id == "spImgCode" || e.target.id == "aValidate")) {
                    me.hideValidImage();
                }
            });

        }).blur(function() {
            if ($(this).val() == "") {
                $(this).val(calendarMessages.txtVallidMsg);
            }
        });
        me.$("#aValidate").click(function() {
            me.refreshValidImage(me.validImgUrl);
            return false;
        });
        me.$("#addmobile").click(function() {
            $("#addrFrameemail").hide();
            _LastFocusAddressBox = me.$("#txtmobile")[0];
            var addrFrame = $("#addrFramemobile");
            if (addrFrame.length == 0) {
                var url = Utils.getAddrWinUrl() + "?type=mobile&callback=AddrCallbackMobile&useAllEmailText=true&useNameText=true";
                addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFramemobile' src='{0}'></iframe>"
                    .format(url));
                addrFrame.appendTo(document.body);
                $(document).click(function() { $("#addrFramemobile").hide(); });
            }
            var jLink = $(this);
            var offset = jLink.offset();
            var frametop = offset.top + jLink.height();
            var frameleft = offset.left - addrFrame.width() + jLink.width();
            var frameheight = $(addrFrame).height();
            //下面不够时，显示在上面
            if (frametop + frameheight > document.body.offsetHeight) {
                if (frameheight > frametop) {
                    frametop = 1;
                }
                else {
                    frametop = offset.top - frameheight;
                }
                frameleft = offset.left - addrFrame.width() - 20;
            }
            addrFrame.css({ top: frametop, left: frameleft });
            addrFrame.show();
            return false;
        });

        me.$("#addemail").click(function() {
            $("#addrFramemobile").hide();
            _LastFocusAddressBox = me.$("#txtemail")[0];
            var addrFrame = $("#addrFrameemail");
            if (addrFrame.length == 0) {
                var url = Utils.getAddrWinUrl() + "?type=email&callback=AddrCallbackEmail&useAllEmailText=true";
                addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFrameemail' src='{0}'></iframe>"
                    .format(url));
                addrFrame.appendTo(document.body);
                $(document).click(function() { $("#addrFrameemail").hide(); });
            }
            var jLink = $(this);
            var offset = jLink.offset();
            var frametop = offset.top + jLink.height();
            var frameleft = offset.left - addrFrame.width() + jLink.width();
            var frameheight = $(addrFrame).height();
            //下面不够时，显示在上面
            if (frametop + frameheight > document.body.offsetHeight) {
                if (frameheight > frametop) {
                    frametop = 1;
                }
                else {
                    frametop = offset.top - frameheight;
                }
                frameleft = offset.left - addrFrame.width() - 20;
            }
            addrFrame.css({ top: frametop, left: frameleft });
            //            if (offset.top > addrFrame.height() && document.body.offsetHeight-offset.top-jLink.height()<addrFrame.height())
            //            {
            //                frametop = offset.top - addrFrame.height();
            //            }
            //            addrFrame.css({ top: frametop, left: offset.left - addrFrame.width() + jLink.width() });
            addrFrame.show();
            return false;
        });
        $("#aRecent").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=1&rnd=" + Math.random();
            return false;
        });
        $("#aAgent").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=2&rnd=" + Math.random();
            return false;
        });
        $("#aHasDone").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=3&rnd=" + Math.random();
            return false;
        });
    }
    $(document).ready(function() {
        var param = {
            type: "mobile",
            container: document.getElementById("txtmobile"),
            autoDataSource: true,
            plugins: [RichInputBox.Plugin.AutoCompleteMobile]
        };
        objRichInputMobileBox = new RichInputBox(param);

        param = {
            container: document.getElementById("txtemail"),
            autoDataSource: true,
            plugins: [RichInputBox.Plugin.AutoComplete]
        };
        objRichInputEmailBox = new RichInputBox(param);
    });
    this.showMobileInfo = function() {
        if (me.$("#chkmsg").attr("checked")) {
            me.$("#pmsg").show();
            me.$("#txtmobile").show();
            me.$("#addmobileimg").show();
            me.$("#addmobile").show();
        }
        else {
            me.$("#pmsg").hide();
            me.$("#txtmobile").hide();
            me.$("#addmobileimg").hide();
            me.$("#addmobile").hide();
        }
        me.showFeeInfo();
    }
    this.showEmailInfo = function() {
        if (me.$("#chkmail").attr("checked")) {
            me.$("#pmail").show();
            me.$("#txtemail").show();
            me.$("#addemailimg").show();
            me.$("#addemail").show();
        }
        else {
            me.$("#pmail").hide();
            me.$("#txtemail").hide();
            me.$("#addemailimg").hide();
            me.$("#addemail").hide();
        }
    }
    this.showFeeInfo = function() {
        if (me.$("#chkmsg").attr("checked") == true) {
            if (me.isShowPhelp == true)
                me.$("#phelp").show();
        }
        else
            me.$("#phelp").hide();
    }
    //初始化提前时间
    this.initBeforeTime = function() {
        var htmlAdvance = "";
        //if(me.type!=2)
        //{
        htmlAdvance = "<option value='0'>5分钟</option>";
        htmlAdvance += "<option value='0'>15分钟</option>";
        htmlAdvance += "<option value='0'>30分钟</option>";
        htmlAdvance += "<option value='1'>1小时</option>";
        htmlAdvance += "<option value='1'>2小时</option>";
        htmlAdvance += "<option value='1'>3小时</option>";
        htmlAdvance += "<option value='1'>6小时</option>";
        htmlAdvance += "<option value='1'>12小时</option>";
        // }
        htmlAdvance += "<option value='2'>1天</option>";
        htmlAdvance += "<option value='2'>2天</option>";
        htmlAdvance += "<option value='2'>3天</option>";
        htmlAdvance += "<option value='2'>4天</option>";
        htmlAdvance += "<option value='2'>5天</option>";
        htmlAdvance += "<option value='2'>6天</option>";
        htmlAdvance += "<option value='2'>7天</option>";
        htmlAdvance += "<option value='2'>8天</option>";
        htmlAdvance += "<option value='2'>9天</option>";
        htmlAdvance += "<option value='2'>10天</option>";
        htmlAdvance += "<option value='2'>11天</option>";
        htmlAdvance += "<option value='2'>12天</option>";
        htmlAdvance += "<option value='2'>13天</option>";
        htmlAdvance += "<option value='2'>14天</option>";

        me.$("#opAdvanc").html(htmlAdvance);
    }
    this.initData = function(beforeType, beforeTime, recMySms, recMyEmail, recMobile, recEmail, freeInfo, sendCount, feeValue, groupLength, isNeedValidImg, validImgUrl, status, startDate, startTime) {
        if (freeInfo.length == 0) {
            if (top.UserData.provCode.toString() == "19")//江苏计费提醒特别
            {
                me.$("#phelp").text(String.format(calendarMessages.feeTips + calendarMessages.feeMsg, sendCount, "0.1"));
            }
            else {
                me.$("#phelp").text(String.format(calendarMessages.feeTips + calendarMessages.feeMsg, sendCount, feeValue));
            }
            //            me.isShowPhelp=false;
        }
        else {
            //            me.isShowPhelp=true;
            if (top.UserData.provCode.toString() == "19")//江苏计费提醒特别
            {
                me.$("#phelp").text(calendarMessages.feeTips + freeInfo.replace("0元/条", "0.1元/条")); //读短信配置各省套餐提示
            }
            else {
                me.$("#phelp").text(calendarMessages.feeTips + freeInfo);
            }
        }
        me.isShowPhelp = true;
        me.groupLength = groupLength;

        calendarMessages.emptyMobileText = String.format(calendarMessages.emptyMobileText, me.groupLength);
        calendarMessages.emptyEmailText = String.format(calendarMessages.emptyEmailText, me.groupLength);
        calendarMessages.mobileGroupOverMsg = String.format(calendarMessages.mobileGroupOverMsg, me.groupLength);
        calendarMessages.emailGroupOverMsg = String.format(calendarMessages.emailGroupOverMsg, me.groupLength);
        var recMySms = parseInt(recMySms, 10);
        var recMyEmail = parseInt(recMyEmail, 10);
        var count = me.$("#opAdvanc option").length;
        for (var i = 0; i < count; i++) {
            var itemBeforeTime = me.$("#opAdvanc").get(0).options[i].text.replace(/[^\d]/g, '');
            var itemBeforeType = me.$("#opAdvanc").get(0).options[i].value;
            if (itemBeforeType == beforeType && itemBeforeTime == beforeTime) {
                me.$("#opAdvanc").get(0).options[i].selected = true;
                break;
            }
        }

        $("#chkme").attr("checked", (recMySms == 1 || recMyEmail == 1) ? true : false);
        me.$("#otherTr").show();
        var chkother = false;
        if ($.trim(recMobile) != "") {
            chkother = true;
            me.$("#chkmsg").attr("checked", true);
            objRichInputMobileBox.insertItem(me.getRecMobileName(recMobile));
            if (me.isShowPhelp == true)
                me.$("#phelp").show();
        }
        else {
            objRichInputMobileBox.setTipText(calendarMessages.emptyMobileText);
        }

        if ($.trim(recEmail) != "") {
            chkother = true;
            me.$("#chkmail").attr("checked", true);
            objRichInputEmailBox.insertItem(recEmail.decode());
        }
        else {
            objRichInputEmailBox.setTipText(calendarMessages.emptyEmailText);
        }

        if (chkother && !isFromMailPage()) {
            me.$("#chkother").attr("checked", true);
            me.$("#otherTr").show();
        }
        else {
            if ($.browser.msie) {
                setTimeout(function() { me.$("#otherTr").hide(); }, 100);
            }
            else {
                me.$("#otherTr").hide();
            }
        }
        if (status == 2) {
            me.isOldUser = 1;
            me.changeStatus = 0;
            $("#oldStatusTr").show();
            $("#newStatusTr").hide();
            var oldStartDate = new Date(parseInt(startDate.replace("/Date(", "").replace(")/", "")));
            var strStartTime = String(startTime);
            var h = strStartTime.substr(0, strStartTime.length - 2);
            var m = strStartTime.substr(strStartTime.length - 2, 2);
            oldStartDate.setHours(h);
            oldStartDate.setMinutes(m);
            var week = "\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d".charAt(oldStartDate.getDay());

            $("#oldStatusMsg").text(oldStartDate.format("yyyy年MM月dd日hh时mm分") + " 星期" + week);
            $("#changeStatus").click(function() {
                me.changeStatus = 1;
                $("#oldStatusTr").hide();
                $("#newStatusTr").show();
            });
        }
        me.isNeedValidImg = isNeedValidImg;
        me.validImgUrl = validImgUrl;
        //判断是否显示验证码        
        me.refreshValidImage(me.validImgUrl);
        me.hideValidImage();
        me.checkToShowValidInfo();
        me.showMobileInfo();
        me.showEmailInfo();
    }

    //设置提醒事件的时间，用于计算是否要显示短信与邮件的开启状态提醒
    this.setEventTime = function(startDateTime, endDateTime) {
        var beforetype = me.$("#opAdvanc").val();
        var beforetime = me.$("#opAdvanc :selected").text().replace(/[^\d]/g, '');
        me.eventStartTime = startDateTime;
        me.eventEndTime = endDateTime;
        if (beforetype == 0)//分
        {
            me.sendSmsStartTime = new Date(Date.parse(startDateTime) - (parseInt(beforetime) * 60 * 1000));
            me.sendSmsEndTime = new Date(Date.parse(endDateTime) - (parseInt(beforetime) * 60 * 1000));
        }
        else if (beforetype == 1)//小时
        {
            me.sendSmsStartTime = new Date(Date.parse(startDateTime) - (parseInt(beforetime) * 60 * 60 * 1000));
            me.sendSmsEndTime = new Date(Date.parse(endDateTime) - (parseInt(beforetime) * 60 * 60 * 1000));
        }
        else //天
        {
            me.sendSmsStartTime = new Date(Date.parse(startDateTime) - (parseInt(beforetime) * 60 * 60 * 24 * 1000));
            me.sendSmsEndTime = new Date(Date.parse(endDateTime) - (parseInt(beforetime) * 60 * 60 * 24 * 1000));
        }
        //       me.showSmsConfirm();
    }
    //短信与邮件的开启状态提醒
    this.showSmsConfirm = function() {
        if (me.$("#chkmemail").attr("checked") == true && me.$("#chkmemsg").attr("checked") == true) {
            if (me.isShowSmsConfirm(me.sendSmsStartTime, me.sendSmsEndTime)) {
                me.$("#pSmsConfirm").show();
                me.$("#pSmsConfirm").text(calendarMessages.smsConfirmMsg);
            }
            else {
                me.$("#pSmsConfirm").hide();
                me.$("#pSmsConfirm").text("");
            }
        }
        else {
            me.$("#pSmsConfirm").hide();
            me.$("#pSmsConfirm").text("");
        }
    }
    //判断是否显示短信与邮件的开启状态提醒
    this.isShowSmsConfirm = function(sendStartTime, sendEndTime) {
        var isShow = false;
        if (top.UserData.MailNotify.notifyType != 0) {
            var configStartTime = top.UserData.MailNotify.startTime;
            var configEndTime = top.UserData.MailNotify.endTime;
            var starHours = sendStartTime.getHours();
            if (starHours >= configStartTime && starHours < configEndTime) {
                isShow = true;
            }
        }
        return isShow;
    }
    this.getRemindInfo = function() {
        var remindInfo = { state: 0, message: '', beforeType: 0, beforeTime: 0, recMySms: 0, recMyEmail: 0, recMobile: '', recEmail: '', validImgText: '' };
        //        if(me.$("#chkalert").attr("checked")==true)
        //        {            
        remindInfo.beforeType = me.$("#opAdvanc").val();
        remindInfo.beforeTime = me.$("#opAdvanc :selected").text().replace(/[^\d]/g, '');
        remindInfo.recMySms = me.$("#chkme").attr("checked")  ? 1 : 0;
        remindInfo.recMyEmail = me.$("#chkme").attr("checked")  ? 1 : 0;
        remindInfo.validImgText = me.$("#txtValidate").val();
        if (me.$("#chkother").attr("checked") == true) {
            if (me.$("#chkmsg").attr("checked") == true) {
                remindInfo.recMobile = me.getFormatMobile(objRichInputMobileBox.getRightNumbers().join(","));
            }

            if (me.$("#chkmail").attr("checked") == true) {
                var emails = objRichInputEmailBox.getRightEmails().join(",");
                remindInfo.recEmail = emails;
            }
        }
        //        }
        return remindInfo;
    }
    this.checkRemindInfo = function() {
        var checkResult = { result: true, message: '' };
        //        if(me.$("#chkalert").attr("checked")==true)
        //        {            
        if (me.checkMobile() == false || me.checkEmail() == false) {
            checkResult.result = false;
            checkResult.message = me.remindErrorMsg;
            return checkResult;
        }
        //需要验证码时
        if (String(me.isNeedValidImg).toLowerCase() == "true" && (me.$("#chkme").attr("checked") == true || me.$("#chkmsg").attr("checked") == true || me.$("#chkmail").attr("checked") == true)) {
            if ($.trim(me.$("#txtValidate").val()).length == 0 || $.trim(me.$("#txtValidate").val()) == calendarMessages.txtVallidMsg) {
                checkResult.result = false;
                me.$("#txtValidate").focus();
                checkResult.message = calendarMessages.validImgTextEmpty;
                return checkResult;
            }
        }
        if (me.isOldUser == 1 && me.changeStatus == 0) {
            checkResult.result = false;
            checkResult.message = calendarMessages.common_DataIsOld;
            return checkResult;
        }
        //        }
        return checkResult;
    }
    //检查手机号码个数以及号码是否是移动号码
    this.checkMobile = function() {
        if (me.$("#chkmsg").attr("checked") == true) {
            var errorMobile = $.trim(objRichInputMobileBox.getErrorText());
            var hasErrorMobile = errorMobile.length > 0 ? true : false;
            if (hasErrorMobile) {
                me.remindErrorMsg = String.format(calendarMessages.mobileErrorMsg, errorMobile);
                return false;
            }
            var mobileArray = objRichInputMobileBox.getRightNumbers();
            var inputMobiles = mobileArray.join(",");
            if (inputMobiles == "" || inputMobiles == calendarMessages.emptyMobileText) {
                me.remindErrorMsg = calendarMessages.emptyMobileMsg;
                return false;
            }
            else if (inputMobiles != calendarMessages.emptyMobileText) {
                var mobileLength = mobileArray.length;
                if (mobileLength == 0) {
                    me.remindErrorMsg = calendarMessages.emptyMobileMsg;
                    return false;
                }
                else if (mobileLength > me.groupLength) {
                    me.remindErrorMsg = calendarMessages.mobileGroupOverMsg;
                    return false;
                }
            }
        }
        return true;
    }
    this.checkEmail = function() {
        if (me.$("#chkmail").attr("checked") == true) {
            var errorEmail = $.trim(objRichInputEmailBox.getErrorText());
            var hasErrorEmail = errorEmail.length > 0 ? true : false;
            if (hasErrorEmail) {
                me.remindErrorMsg = String.format(calendarMessages.emailErrorMsg, errorEmail);
                return false;
            }
            var emailArray = objRichInputEmailBox.getRightEmails();
            var inputEmails = emailArray.join(",");
            if (inputEmails == "" || inputEmails == calendarMessages.emptyMobileText) {
                me.remindErrorMsg = calendarMessages.emptyEmailMsg;
                return false;
            }
            else if (inputEmails != calendarMessages.emptyEmailText) {
                var emailLength = emailArray.length;
                if (emailLength == 0) {
                    me.remindErrorMsg = calendarMessages.emptyEmailMsg;
                    return false;
                }
                else if (emailLength > me.groupLength) {
                    me.remindErrorMsg = calendarMessages.emailGroupOverMsg;
                    return false;
                }
            }
        }
        return true;
    }
    //重新格式化手机号码
    this.getFormatMobile = function(mobileStr) {
        var arrayList = new Array();
        var regMobile = new RegExp("(<)([\\w|\\+]+)(>)");
        var mobileList = $.trim(mobileStr).split(/,|，|;|；/);
        var mobileCount = mobileList.length;
        for (var i = 0; i < mobileCount; i++) {
            if ($.trim(mobileList[i]).length > 0) {
                var thismobile = $.trim(mobileList[i]);
                if (regMobile.test(thismobile))
                    thismobile = regMobile.exec(thismobile)[2];
                if ($.trim(thismobile).length == 11)
                    thismobile = "86" + thismobile;
                if (thismobile.length == 14 && thismobile.substr(0, 1) == "+")
                    thismobile = thismobile.replace("+", "");
                arrayList.push(thismobile);
            }
        }
        return arrayList.join(",");
    }
    //组装用户名和手机号码
    this.getRecName = function(usernumber) {
        var recName = this.getUserNameDecode(usernumber);
        if (usernumber.length == 13)
            usernumber = usernumber.substring(2, 13);
        return "\"" + recName + "\"" + "<" + usernumber + ">";
    }
    this.getUserNameDecode = function(usernumber) {
        var addrobj = top.Contacts.getSingleContactsByMobile(usernumber, true);
        if (addrobj != undefined && addrobj) {
            if (addrobj.name.length > 0) {
                return addrobj.name;
            }
        }
        return usernumber;
    }
    this.getRecMobileName = function(recNumber) {
        var recNumberWithName = "";
        var arrRec;
        if (!me.isEmpty(recNumber)) {
            if (recNumber.indexOf(",") != -1) {
                arrRec = recNumber.split(",");
                if (arrRec != undefined && arrRec.length > 0) {
                    for (var i = 0; i < arrRec.length; i++) {
                        if (!me.isEmpty(arrRec[i])) {
                            if (recNumberWithName.length == 0) {
                                recNumberWithName = me.getRecName(arrRec[i]);
                            }
                            else {
                                recNumberWithName = recNumberWithName + "," + me.getRecName(arrRec[i]);
                            }
                        }
                    }
                }
            }
            else {
                recNumberWithName = me.getRecName(recNumber);
            }
        }
        return recNumberWithName;
    }
    this.isEmpty = function(code) {
        if (typeof (code) == "undefined" || code == null || code.length == 0) return true;
        return false;
    }

    //验证码相关

    //刷新验证码图片
    this.refreshValidImage = function(imgUrl) {
        if ($.trim(imgUrl).length == 0)
            return;
        me.$("#txtValidate").val("");
        me.$("#dtValidImg").show();
        me.$("#ddValidImg").show();
        me.$("#imgValidate").attr("src", me.validImgUrl + Math.random());
    }

    //图片验证码栏的显示隐藏
    this.checkToShowValidInfo = function() {
        if (String(me.isNeedValidImg).toLowerCase() == "true" && ($("#chkme").attr("checked") == true || me.$("#chkmsg").attr("checked") == true || me.$("#chkmail").attr("checked") == true)) {
            me.$("#dtValidImg").show();
            me.$("#ddValidImg").show();
            me.refreshValidImage(me.validImgUrl);
        }
        else {
            me.$("#dtValidImg").hide();
            me.$("#ddValidImg").hide();
            me.hideValidImage();
        }
    }
    //只隐藏验证码图片
    this.hideValidImage = function() {
        if (me.$("#spImgCode").length > 0) {
            me.$("#spImgCode")[0].style.display = 'none';
            me.$("#hackFrame").hide();
        }
    }
    //只显示验证码图片刷新图片
    this.showValidImage = function(type) {
        if (type != 0)
            me.refreshValidImage(me.validImgUrl);
        if ($("#spImgCode").length > 0) {
            $("#spImgCode")[0].style.display = 'block';
            $("#hackFrame").show();
        }
    }
    me.drawHTML();
    me.initBeforeTime();
    me.bindEvent();
}

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
    document.write(String.format('<li><a href="/m2012/html/calendar/calendar_list.html?listtype=6&rnd={0}">生日提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/m2012/html/calendar/calendar_list.html?listtype=3&rnd={0}">特殊日子</a></li>', Math.random()));
    document.write(String.format('<li><a href="/m2012/html/calendar/calendar_list.html?listtype=1&rnd={0}">约会提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/m2012/html/calendar/calendar_list.html?listtype=2&rnd={0}">交费提醒</a></li>', Math.random()));
    document.write(String.format('<li><a href="/m2012/html/calendar/special/baby.html?listtype=8&comefrom=2&rnd={0}">宝宝防疫</a></li>', Math.random()));
    document.write(String.format('<li><a href="/m2012/html/calendar/calendar_list.html?listtype=5&rnd={0}">赛事提醒</a></li>', Math.random()));
    //	document.write(String.format('<li><a href="/calendar/list.html?listtype=11&rnd={0}">星座运势</a></li>',Math.random()));

    if (curPageName != "") {
        $(".category >li >a[href*='" + curPageName + "&']").parent().attr("class", "cur");
        $(".category >li >a[href*='" + curPageName + "&']").removeAttr("href");
    }
}

//生日提醒
richinfo.email.calendar.birthday = function() {
    var me = this;
    me.isNeedValidImg = false;
    me.validImgUrl = "";
    var itemArray = [];
    var objApi = new richinfo.email.calendar.commonApi();
    itemArray.push('<tr type="birthdayRow">');
    itemArray.push('<td class="t1">姓名</td>');
    itemArray.push('<td><input class="txt"  size="20" maxlength="20"/></td>');
    itemArray.push('<td class="t1">生日</td>');
    itemArray.push('<td>');
    itemArray.push('<div class="seleteDate">');
    itemArray.push('<ul>');
    itemArray.push('<li class="cur" isGreg="true">公 历</li>');
    itemArray.push('<li>农 历</li>');
    itemArray.push('</ul>');
    itemArray.push('<p><span class="date">');
    itemArray.push('<input type="text" class="txt normal" value="' + calendarMessages.birthday_DateEmpty + '" readonly/>');
    itemArray.push('<input type="text" style="display:none" class="txt normal" value="' + calendarMessages.birthday_DateEmpty + '" readonly/>');
    itemArray.push('<i class="drop"></i></span></p>');
    itemArray.push('</div>');
    itemArray.push('<a href="javascript:" title="删除" class="del" type="delItem">[删除]</a>');
    itemArray.push('</td>');
    itemArray.push('</tr>');
    itemArray.push('<tr class="note">');
    itemArray.push('<td class="t1">备注</td>');
    itemArray.push('<td colspan="3" class="t_btm"><input class="txt normal" size="80" maxlength="100"></td>');
    itemArray.push('</tr>;');
    var itemHtml = itemArray.join("");

    var addItemCount = 0;

    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        me.id = 0;

        $("#spanTitle").text("添加生日提醒");
    }
    else {
        me.id = id;
        $("#spanTitle").text("编辑生日提醒");
    }

    var listtype = 0;   //列表类 0所有,1约会,2交费...
    var paramlist = Utils.queryString("listtype");
    if (paramlist) {
        listtype = parseInt(paramlist);
    }
    //事件绑定
    this.bindEvent = function() {
        $("#hrefAddBirthday").click(function() {
            addItemCount++;
            $(itemHtml).insertBefore("#trAddBirthday");

            me.addBirthdayRowEvent();
            if (addItemCount == 4)
                $("#hrefAddBirthday").hide();
        });
        $("#btnSave").click(function() {
            me.saveData();
            stopBubble();
        });
        $("#btnCalcel").click(function() {
            me.goComefromPage();
        });
        $("#content").scroll(function() {
            resetCalendarTop();
        });
        document.onclick = function() {
            me.hideCalendarPanel();
        }
    }
    this.hideCalendarPanel = function() {
        if (objSelector) objSelector.hide();
    }
    //添加更多
    this.addBirthdayRowEvent = function() {
        $("a[type=delItem]").unbind("click").click(function() {
            $(this).parent().parent().next().remove();
            $(this).parent().parent().remove();
            $("#hrefAddBirthday").show();
            me.hideCalendarPanel();
            addItemCount--;
        });
        $("tr[type=birthdayRow]").find(".seleteDate ul li").unbind("click").click(function() {
            me.changeDateType(this);
        });
        $("tr[type=birthdayRow] .date input[type=text]").unbind("change").click(function()//点击文本框
        {
            if ($(this).val() == calendarMessages.birthday_DateEmpty)
                $(this).val("");
            var isGreg = $(this).parent().parent().parent().parent().find(".seleteDate ul li[isGreg=true]").attr("class") == "cur" ? true : false;
            if (isGreg) {
                showMyCalendar(this, me.calendarCallbackFunc, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            }
            else {
                showMyCalendar(this, me.calendarCallbackFunc, { returnType: 1, popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            }
            resetCalendarTop();
            stopBubble();
        }).blur(function() {
            if ($.trim($(this).val()) == "")
                $(this).val(calendarMessages.birthday_DateEmpty);
        }); ;
        $("tr[type=birthdayRow] .drop").unbind("click").click(function()//点击图标
        {
            var txtGreg = $(this).parent().find("input[type=text]")[0];
            var txtLun = $(this).parent().find("input[type=text]")[1];
            if ($(txtGreg).val() == calendarMessages.birthday_DateEmpty)
                $(txtGreg).val("");
            if ($(txtLun).val() == calendarMessages.birthday_DateEmpty)
                $(txtLun).val("");
            var isGreg = $(this).parent().parent().parent().find(" ul li[isGreg=true]").attr("class") == "cur" ? true : false;

            if (isGreg) {
                showMyCalendar(txtGreg, me.calendarCallbackFunc, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            }
            else {
                showMyCalendar(txtLun, me.calendarCallbackFunc, { returnType: 1, popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            }
            resetCalendarTop();
            stopBubble();
        });
    }
    this.calendarCallbackFunc = function(e) {
        $(e.dateControl).removeClass();
        $(e.dateControl).parent().find("input[type=text]").attr("realDate", e.dateControl.realDate);
    }
    //公历、农历切换
    this.changeDateType = function(obj) {
        $(obj).parent().find("li").removeClass("cur");
        $(obj).addClass("cur");
        var isGreg = $(obj).attr("isGreg");
        var gregBox = $(obj).parent().parent().find("input[type=text]:eq(0)");
        var lunBox = $(obj).parent().parent().find("input[type=text]:eq(1)");
        if (isGreg) {
            $(lunBox).hide();
            var dateStr = $(lunBox).attr("realDate") ? $(lunBox).attr("realDate") : $(lunBox).val();
            var result = objApi.checkDateStr(dateStr);
            $(gregBox).show();
            if (result) {
                var dt = new Date(result.year, result.month, result.date);
                $(gregBox).attr("realDate", dt.format("yyyy-MM-dd")).val(dt.format("yyyy-MM-dd")).removeClass();
            }
            else {
                $(gregBox).removeAttr("realDate").val(calendarMessages.birthday_DateEmpty).attr("class", "txt normal");
            }
        }
        else {
            $(gregBox).hide();

            var dateStr = $(gregBox).attr("realDate") ? $(gregBox).attr("realDate") : $(gregBox).val();
            var result = objApi.checkDateStr(dateStr);
            $(lunBox).show();
            if (result) {
                var dt = new Date(result.year, result.month, result.date);
                $(lunBox).attr("realDate", dt.format("yyyy-MM-dd")).val(objApi.getNLStrValueByDate(dt).returnNlStr).removeClass();
            }
            else {
                $(lunBox).removeAttr("realDate").val(calendarMessages.birthday_DateEmpty).attr("class", "txt normal");
            }
        }
    }
    //加载数据
    this.bindData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInLoading);
            $.ajax({
                method:"get",
                dataType:"json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: {
                    sid: window.top.UserData.ssoSid,
                    actionId: 0,
                    seqno: me.id,
                    sendtype: 6,
                    rnd: Math.random()
                },
                success: function (data) {
                    if (data.State == 0 && data.ResultCode == "True") {
                        top.WaitPannel.hide();
                        var dt = new Date();
                        dt.setHours(8);
                        dt.setMinutes(0);

                        if (me.id == 0)//新增时加载
                        {
                            var userName = Utils.queryString("userName");
                            var birthday = Utils.queryString("birthday");
                            if (typeof (userName) && userName != null && typeof (birthday) && birthday != null) {
                                $("#txtName0").val(userName);
                                $(".date input[type=text]").val(birthday).attr("realDate", birthday);
                                objCalendarRemind.initData(2, 1, 1, 1, '', '', data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            }
                            else {
                                $(".date input").val(calendarMessages.birthday_DateEmpty).attr("class", "txt normal");
                                objCalendarRemind.initData(1, 1, 1, 0, '', '', data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            }

                            objCalendarRemind.setEventTime(dt, dt);
                        }
                        else//编辑时加载
                        {
                            objCalendarRemind.initData(data.BeforeType, data.BeforeTime, data.RecMySms, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            objCalendarRemind.setEventTime(dt, dt);

                            var yuan = data.Content.indexOf("生日，");
                            if (yuan > -1) {
                                var cont = data.Content.substring(0, yuan);
                                $("#txtName0").val(cont);
                                cont = data.Content.substring(yuan + 3);
                                $("#txtMemo0").val(cont);
                            }
                            else {
                                $("#txtName0").val(data.Content.replace(/生日+$/, ""));
                                $("#txtMemo0").val("");
                            }
                            var birthdayDt = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));
                            var bitthdayStr = birthdayDt.format("yyyy-MM-dd");
                            $("#ulSeleteDate0 ul li").removeClass("cur");
                            if (data.CalendarType == 10)//公历
                            {
                                $("#ulSeleteDate0 ul li:eq(0)").attr("class", "cur");
                                $(".date input[type=text]:eq(0)").attr("realDate", bitthdayStr).val(bitthdayStr).removeClass().show();
                                $(".date input[type=text]:eq(1)").attr("realDate", bitthdayStr).hide();
                            }
                            else {
                                $("#ulSeleteDate0 ul li:eq(1)").attr("class", "cur");
                                $(".date input[type=text]:eq(1)").attr("realDate", bitthdayStr).val(objApi.getNLStrValueByDate(birthdayDt).returnNlStr).removeClass().show();
                                $(".date input[type=text]:eq(0)").attr("realDate", bitthdayStr).hide();
                            }
                        }
                        me.isNeedValidImg = data.IsNeedValidImg;
                        me.validImgUrl = data.ValidImgUrl;
                        $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(data.State, data.ResultCode, data.ResultMsg);
                    }
                    top.WaitPannel.hide();
                }
            });
        }
    }
    //保存数据
    this.saveData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            if (me.checkData() == false)
                return;
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $("#btnSave").attr("disabled", true);
            $("#pErrorMsg").hide();
            var info = objCalendarRemind.getRemindInfo();
            var xmlData = String.format(specialTempXmlString, '0', '', '0', '0', '6', '', '', '800', '800', info.recMySms, info.recMyEmail, info.recMobile, top.encodeXML(info.recEmail), '', info.beforeType, info.beforeTime, top.encodeXML(info.validImgText), '0', '', '0', me.usersXml.join(''), '', '');

            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionid: 1,
                    seqno: me.id,
                    sendtype: 6,
                    xml: xmlData,
                    rnd: Math.random
                },
                success: function(result) {
                    if (result.State == 0 && result.ResultCode == "True") {
                        me.goComefromPage();
                        try {
                            top.postJiFen(65, 1); //上报积分
                        } catch (e) { }
                    }
                    else {
                        if (result.IsNeedValidImg == "True" && result.ValidImgUrl.length > 0)
                            objCalendarRemind.refreshValidImage(result.ValidImgUrl);
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                    $("#btnSave").attr("disabled", false);
                    top.WaitPannel.hide();
                }
            });
        }
    }
    this.goComefromPage = function() {
        var comfrom = Utils.queryString("comefrom");
        if (comfrom == "1") {
            if (Utils.queryString("curDate"))
                window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate") + "&rnd=" + Math.random());
            else
                window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_view.html?rnd=" + Math.random());
        }
        else {
            window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString() + "&rnd=" + Math.random());
        }
    }
    this.checkData = function() {
        if (me.checkBirthdayData() == false)//检验生日输入栏
        {
            return false;
        }
        var remindCheck = objCalendarRemind.checkRemindInfo();
        if (remindCheck.result == false)//检验提醒输入栏
        {
            $("#lblErrorMsg").text(remindCheck.message);
            $("#pErrorMsg").show();
            return false;
        }
        if (me.isNeedValidImg == true && ($("#chkmsg").attr("checked") == true || $("#chkmemsg").attr("checked") == true)) {
            if ($("#txtValidate").val().trim() == "" || $("#txtValidate").val().trim() == calendarMessages.txtVallidMsg) {
                $("#lblErrorMsg").text(calendarMessages.validImgTextEmpty);
                $("#pErrorMsg").show();
                $("#txtValidate").focus();
                return false;
            }
        }
        return true;
    }
    //验证多个生日输入框
    this.checkBirthdayData = function() {
        var result = true;
        me.usersXml = [];
        var i = 0;
        $("tr[type=birthdayRow]").each(function() {
            var name = $(this).find("input:eq(0)");
            var gregTxt = $(this).find("input:eq(1)");
            var lunTxt = $(this).find("input:eq(2)");
            var isGreg = $(this).find("li[isGreg=true]").attr("class") == "cur" ? true : false;
            var isError = false;
            var focusElement = name;
            var calendarType = 10;
            var dateFlag = '';
            var dateDescript = '';
            var birthday = '';
            var memo = $(this).next().find("input:eq(0)");
            $(name).removeClass("err");
            var nameValue = $.trim($(name).val());
            var birthdayValue = isGreg == true ? $.trim($(gregTxt).val()) : $.trim($(lunTxt).val());
            //第一行必填，其它行可以不填
            if (i != 0 && nameValue == "" && (birthdayValue == "" || birthdayValue == calendarMessages.birthday_DateEmpty))
                return;
            if ($.trim($(name).val()) == "") {
                $("#lblErrorMsg").text(calendarMessages.birthday_NameEmpty);
                focusElement = name;
                isError = true;
            }
            else {
                if ($.trim($(name).val()).length > 20) {
                    $("#lblErrorMsg").text(calendarMessages.birthday_NameLengthMsg);
                    focusElement = name;
                    isError = true;
                }
                else {
                    var api = new richinfo.email.calendar.commonApi();
                    if (isGreg == true)//是公历
                    {
                        calendarType = 10;
                        $(gregTxt).removeClass("err");
                        if ($.trim($(gregTxt).val()) == "" || $.trim($(gregTxt).val()) == calendarMessages.birthday_DateEmpty) {
                            $("#lblErrorMsg").text(calendarMessages.birthday_DateEmpty);
                            focusElement = gregTxt;
                            isError = true;
                        }
                        else {
                            var gregVal = $(gregTxt).val();
                            if ($(gregTxt).attr("realDate"))
                                gregVal = $(gregTxt).attr("realDate");
                            var dt = api.checkDateStr(gregVal);
                            if (!dt) {
                                $("#lblErrorMsg").text(calendarMessages.common_DateError);
                                focusElement = gregTxt;
                                isError = true;
                            }
                            birthday = gregVal;
                            dateFlag = gregVal.split('-')[1] + gregVal.split('-')[2];
                            dateDescript = gregVal.replace('-', '年').replace('-', '月') + "日";
                        }
                    }
                    else//农历
                    {
                        calendarType = 20;
                        $(lunTxt).removeClass("err");
                        if ($.trim($(lunTxt).val()) == "" || $.trim($(gregTxt).val()) == calendarMessages.birthday_DateEmpty) {
                            $("#lblErrorMsg").text(calendarMessages.birthday_DateEmpty);
                            focusElement = lunTxt;
                            isError = true;
                        }
                        else {
                            var hasLunDate = false;
                            var lunVal = '';
                            if ($(lunTxt).attr("realDate")) {
                                hasLunDate = true;
                                lunVal = $(lunTxt).attr("realDate");
                            }
                            var dt = api.checkDateStr(lunVal);
                            if (!dt) {
                                $("#lblErrorMsg").text(calendarMessages.common_DateError);
                                focusElement = lunTxt;
                                isError = true;
                            }
                            birthday = lunVal;
                            var d = lunVal.split('-');
                            var lunNum = api.getNLStrValueByDate(new Date(lunVal.replace(/\-/g, "/"))).returnNlNum;
                            dateFlag = lunNum.substring(4, 8);
                            dateDescript = $(lunTxt).val();
                        }
                    }
                }
            }
            if (isError == true) {
                $(focusElement).select().focus();
                $(focusElement).addClass("err");
                $("#pErrorMsg").show();
                result = false;
                return false;
            }
            var curId = 0;
            if (i == 0)//第一个生日ID为当前ID
                curId = me.id;
            me.usersXml.push("<user>");
            me.usersXml.push("<id>" + String(curId) + "</id>");
            me.usersXml.push("<name>" + top.encodeXML($(name).val()) + "</name>");
            me.usersXml.push("<calendartype>" + String(calendarType) + "</calendartype>");
            me.usersXml.push("<dateflag>" + String(dateFlag) + "</dateflag>");
            me.usersXml.push("<birthday>" + birthday + "</birthday>");
            me.usersXml.push("<datedescript>" + top.encodeXML(dateDescript) + "</datedescript>");
            me.usersXml.push("<memo>" + top.encodeXML($(memo).val()) + "</memo>");
            me.usersXml.push("</user>");
            i++;
        });
        return result;
    }
    me.bindEvent();
    me.bindData();
    me.addBirthdayRowEvent();
}


//特殊日子
richinfo.email.calendar.specialday = function() {
    var me = this;
    me.isNeedValidImg = false;
    me.validImgUrl = '';
    me.specialDayDate = [];
    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        me.id = 0;
        $("#spanTitle").text("添加特殊日子提醒");
        $("#dropType").attr("value", "");
    }
    else {
        me.id = id;
        $("#spanTitle").text("编辑特殊日子提醒");
    }
    var listtype = 0;   //列表类 0所有,1约会,2交费...
    var paramlist = Utils.queryString("listtype");
    if (paramlist) {
        listtype = parseInt(paramlist);
    }
    me.bindEvent = function() {
        $("#dropType").change(function() {
            me.showItemInfo();
        });
        $("#btnSave").click(function() {
            me.saveData();
            stopBubble();
        });
        $("#btnCancel").click(function() {
            me.goComefromPage();
        });
        $(".seleteDate ul li").click(function() {
            $(this).parent().find("li").removeClass("cur");
            $(this).attr("class", "cur");

            var api = new richinfo.email.calendar.commonApi();
            var realStartDate = $("#txtStartDate").val();
            if ($("#txtStartDate").attr("realDate"))
                realStartDate = $("#txtStartDate").attr("realDate");

            if (this.id == "liGreg") {
                if (api.checkDateStr(realStartDate))
                    $("#txtStartDate").val(realStartDate);
            }
            else {
                if (api.checkDateStr(realStartDate)) {
                    var lunObj = api.getNLStrValueByDate(new Date(realStartDate.replace(/\-/g, "/")));
                    var lunNum = lunObj.returnNlNum;
                    var lunStr = lunObj.returnNlStr;
                    me.dateFlag = lunNum.substring(4, 8);
                    $("#txtStartDate").val(lunStr);
                }
            }
            me.showItemInfo();
        });
        $("#dropSpecialDay").change(function()//节日下拉列表
        {
            me.showItemInfo();
        });
        $("#txtStartDate").click(function() {
            me.showCalendar(this, this);
        });
        $("#dateSelectDrop").click(function() {
            me.showCalendar($("#txtStartDate")[0], this);
        });
        $("#dropStartDay").change(function() {
            me.showItemInfo();
        });
        $("#dropEndDay").change(function() {
            me.showItemInfo();
        });
        $("#txtOther").blur(function() {
            me.showItemInfo();
        });
        document.onclick = function() {
            if (objSelector) objSelector.hide();
        }
        $("#content").scroll(function() {
            resetCalendarTop();
        });
    }
    this.showCalendar = function(obj, pop) {
        if ($("#liGreg").attr("class") == "cur")//公历
            showMyCalendar(obj, me.callbackFunction, { popuControl: pop, date2StringPattern: 'yyyy-MM-dd' });
        else//农历
            showMyCalendar(obj, me.callbackFunction, { popuControl: pop, returnType: 1, date2StringPattern: 'yyyy-MM-dd' });
        stopBubble();
    }
    this.callbackFunction = function() {
        me.showItemInfo();
    }
    this.getSpecialDayInfo = function(id) {
        for (var i = 0; i < me.specialDayDate.length; i++) {
            if (me.specialDayDate[i].Id == id) {
                return me.specialDayDate[i];
            }
        }
        return "";
    }
    this.selectDate = function(obj) {
        if ($("#liGreg").attr("class") == "cur")//公历
            showMyCalendar(obj, null, { popuControl: obj, date2StringPattern: 'yyyy-MM-dd' });
        else//农历
            showMyCalendar(obj, null, { popuControl: obj, returnType: 1, date2StringPattern: 'yyyy-MM-dd' });
    }
    this.bindData = function() {
        var dayHtml = "";
        for (var i = 1; i <= 31; i++) {
            if (i < 10)
                dayHtml += String.format("<option value=\"{0}\">{1}</option>", "0" + String(i), "0" + String(i) + "日");
            else
                dayHtml += String.format("<option value=\"{0}\">{1}</option>", String(i), String(i) + "日");
        }
        $("#dropStartDay").html(dayHtml);
        $("#dropEndDay").html(dayHtml);
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInLoading);
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionid: 0,
                    seqno: me.id,
                    sendtype: 3,
                    rnd: Math.random
                },
                success: function(data) {
                    if (data.State == 0 && data.ResultCode == "True") {
                        var dt = new Date(data.ServerTime.replace(/\-/g, "/"));
                        var currDate = dt.getDate();
                        $("#dropStartDay").attr("value", currDate < 10 ? "0" + currDate : currDate);
                        $("#dropEndDay").attr("value", currDate < 10 ? "0" + currDate : currDate);
                        var dtStr = dt.format("yyyy-MM-dd");
                        $("#txtStartDate").val(dtStr).attr("realDate", dtStr);

                        dt.setHours(8);
                        dt.setMinutes(0);
                        objCalendarRemind.setEventTime(dt, dt);

                        me.isNeedValidImg = data.IsNeedValidImg;
                        me.specialDayDate = data.SepecialDay;
                        var dayHtml = "";
                        for (var i = 0; i < me.specialDayDate.length; i++) {
                            dayHtml += String.format("<option value=\"{0}\">{1}</option>", me.specialDayDate[i].Id, me.specialDayDate[i].Name);
                        }
                        dayHtml += "<option value=\"\">--请选择--</option>";
                        $("#dropSpecialDay").html(dayHtml);
                        if (me.id == 0)//新增时加载
                        {
                            objCalendarRemind.initData(2, 1, 1, 0, '', '', data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            setTimeout(function() { $("#dropSpecialDay").attr("value", ""); }, 10);
                            des = Utils.queryString("des");
                            if (des) {
                                $("#dropType").attr("value", "0");
                                setTimeout(function() {
                                    $("#dropSpecialDay option").each(function() {
                                        if ($.trim($(this).text()) == $.trim(Utils.queryString("des"))) {
                                            $("#dropSpecialDay").attr("value", $(this).val());
                                        }
                                    }); me.showItemInfo();
                                }, 100);
                            }
                        }
                        else//编辑时加载
                        {
                            objCalendarRemind.initData(data.BeforeType, data.BeforeTime, data.RecMySms, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            $("#dropType").attr("value", data.GroupId);
                            switch (data.GroupId) {
                                case "0": //节假日
                                    setTimeout(function() { $("#dropSpecialDay").attr("value", data.HolidayId); }, 1);
                                    break;
                                case "1": //结婚纪念日
                                case "3": //其它
                                    var startDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));
                                    var startDateStr = startDate.format("yyyy-MM-dd");
                                    $("#dateTypeUL li").removeClass("cur");
                                    if (data.CalendarType == 10)//公历
                                    {
                                        $("#liGreg").attr("class", "cur");
                                        $("#txtStartDate").val(startDateStr).attr("realDate", startDateStr);
                                    }
                                    else if (data.CalendarType == 20)//农历
                                    {
                                        $("#liLun").attr("class", "cur");
                                        var api = new richinfo.email.calendar.commonApi();
                                        var lunObj = api.getNLStrValueByDate(startDate);
                                        $("#txtStartDate").val(lunObj.returnNlStr).attr("realDate", startDateStr);
                                    }

                                    if (data.GroupId == "3")
                                        $("#txtOther").val(data.Content);
                                    break;
                                case "2": //女性例假
                                    $("#dropStartDay").attr("value", data.DateFlag);
                                    $("#dropEndDay").attr("value", data.EndDateFlag);
                                    break;
                            }
                            me.showItemInfo();
                        }

                        $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                        setTimeout(function() { me.showItemInfo(); }, 5);
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(data.State, data.ResultCode, data.ResultMsg);
                    }
                    top.WaitPannel.hide();
                }
            });
        }
    }
    this.showItemInfo = function() {
        var type = $("#dropType").val();
        me.hideAll();
        $(".dayInfo").show();
        switch (type) {
            case "":
                $(".dayInfo").hide();
                $("#dropSpecialDay").hide();
                $("#monthDT").hide();
                $("#monthDD").hide();
                $("#timeDT").hide();
                $("#timeDD").hide();
                setTimeout(function() { $("#dropSpecialDay").attr("value", ""); }, 10);
                break;
            case "0": //节假日
                $("#dropSpecialDay").show();
                $("#showText").show();
                if ($("#dropSpecialDay").val() == "") {
                    $(".dayInfo").hide();
                }
                else {
                    var info = me.getSpecialDayInfo($("#dropSpecialDay").val());
                    if (info && info.DateDescript) {
                        $("#spanDayInfo").html(info.Name.encode() + "：");
                        $("#showText").html(info.DateDescript.encode());
                    }
                }
                break;
            case "2": //例假               
                $("#monthDT").show();
                $("#monthDD").show();
                $("#spanDayInfo").html($("#dropType option:selected").text().encode() + "：");
                if ($("#dropStartDay option:selected").text() == $("#dropEndDay option:selected").text())
                    $("#showText").html("每月" + $("#dropStartDay option:selected").text().encode());
                else {
                    if (parseInt($("#dropEndDay").val(), 10) > parseInt($("#dropStartDay").val(), 10))
                        $("#showText").html("每月" + $("#dropStartDay option:selected").text().encode() + "到" + $("#dropEndDay option:selected").text().encode());
                    else
                        $("#showText").html("每月" + $("#dropStartDay option:selected").text().encode() + "到次月" + $("#dropEndDay option:selected").text().encode());
                }
                break;
            case "1": //结婚纪念日
            case "3": //其它
                var isGreg = $("#liGreg").attr("class") == "cur" ? true : false;
                var startDt = $("#txtStartDate").attr("realDate") ? $("#txtStartDate").attr("realDate") : $("#txtStartDate").val();

                var api = new richinfo.email.calendar.commonApi();
                var startFlag = api.checkDateStr(startDt);
                if (startFlag)//判断时间填写是否正确
                {
                    var realStartDt = new Date(startDt.replace(/\-/g, "/"));
                    if (isGreg) {
                        var dtArray = startDt.split('-');
                        if (type == "3" && $("#txtOther").val() != "") {
                            $("#spanDayInfo").html($("#txtOther").val().encode() + "：");
                            $("#showText").html("每年" + dtArray[1] + "月" + dtArray[2] + "日");
                        }
                        else {
                            $("#spanDayInfo").html($("#dropType option:selected").text() + "：");
                            $("#showText").html("每年" + dtArray[1] + "月" + dtArray[2] + "日");
                        }
                    }
                    else {
                        var lunObj = api.getNLStrValueByDate(realStartDt);
                        var lunNum = lunObj.returnNlNum;
                        var lunStr = lunObj.returnNlStr;
                        if (type == "3" && $("#txtOther").val() != "") {
                            $("#spanDayInfo").html($("#txtOther").val().encode() + "：")
                            $("#showText").html("每年农历" + lunStr.substring(5, lunStr.length).encode());
                        }
                        else {
                            $("#spanDayInfo").html($("#dropType option:selected").text().encode() + "：");
                            $("#showText").html("每年农历" + lunStr.substring(5, lunStr.length).encode());
                        }
                    }
                }
                else {
                    me.showErrorMsg(calendarMessages.common_DateError);
                    return false;
                }
                if (type == "3")
                    $("#span1").show();
                else
                    $("#span1").hide();
                $("#timeDT").show();
                $("#timeDD").show();
                break;
        }
    }
    this.hideAll = function() {
        $("#span1").hide();
        $("#dropSpecialDay").hide();
        $("#timeDT").hide();
        $("#timeDD").hide();
        $("#monthDT").hide();
        $("#monthDD").hide();
    }

    //验证数据及取数据
    this.checkData = function() {
        var type = $("#dropType").val();
        if (type == "") {
            me.showErrorMsg(calendarMessages.specialday_NotSelectType);
            return false;
        }

        me.groupId = type;
        me.dateDescript = $("#showText").html();

        switch (type) {
            case "0": //节日
                if ($("#dropSpecialDay").val() == "") {
                    me.showErrorMsg(calendarMessages.specialday_NoSelectSpecialDay);
                    $("#dropSpecialDay").focus();
                    return false;
                }
                else {
                    me.holidayId = $("#dropSpecialDay").val();
                    var info = me.getSpecialDayInfo($("#dropSpecialDay").val());
                    if (info != null) {
                        me.deteDescript = info.DateDescript;
                        me.calendarType = info.CalendarType;
                        me.dateFlag = info.DateFlag;
                        me.endDateFlag = info.DateFlag;
                        me.content = $("#dropSpecialDay option:selected").text();
                    }
                    else {
                        me.showErrorMsg(calendarMessages.specialday_NotFindSpecialDay);
                        return false;
                    }
                }
                break;
            case "1": //结婚纪念日
            case "3": //其它
                if (type == "3" && $.trim($("#txtOther").val()) == "") {
                    $("#txtOther").addClass("err");
                    me.showErrorMsg(calendarMessages.specialday_SpecialDayDescEmpty);
                    return false;
                }
                $("#txtOther").removeClass("err");
                $("#txtStartDate").removeClass("err");
                var isGreg = $("#liGreg").attr("class") == "cur" ? true : false;
                var startDt = $("#txtStartDate").attr("realDate") ? $("#txtStartDate").attr("realDate") : $("#txtStartDate").val();

                var api = new richinfo.email.calendar.commonApi();
                var startFlag = api.checkDateStr(startDt);
                if (startFlag)//判断时间填写是否正确
                {
                    var realStartDt = new Date(startDt.replace(/\-/g, "/"));

                    me.startDate = realStartDt.format("yyyy-MM-dd");
                    if (isGreg) {
                        me.calendatType = 10;
                        me.dateFlag = realStartDt.format("MMdd");
                        me.endDateFlag = me.dateFlag;
                    }
                    else {
                        var lunObj = api.getNLStrValueByDate(realStartDt);
                        var lunNum = lunObj.returnNlNum;
                        var lunStr = lunObj.returnNlStr;

                        me.calendarType = 20;
                        me.dateFlag = lunNum.substring(4, 8);
                        me.endDateFlag = me.dateFlag;
                    }
                }
                else {
                    $("#txtStartDate").addClass("err");
                    me.showErrorMsg(calendarMessages.common_DateError);
                    return false;
                }
                me.content = type == "3" ? $("#txtOther").val() : $("#dropType option:selected").text();
                break;
            case "2": //女性例假
                me.calendarType = 10;
                var startDay = $("#dropStartDay").val();
                var endDay = $("#dropEndDay").val();
                me.interval = 5;
                me.calendarType = 11;
                me.dateFlag = startDay;
                me.endDateFlag = endDay;
                me.content = $("#dropType option:selected").text();
                break;

        }

        var remindCheck = objCalendarRemind.checkRemindInfo();
        if (remindCheck.result == false)//检验提醒输入栏
        {
            me.showErrorMsg(remindCheck.message);
            return false;
        }
        return true;
    }
    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }
    this.goComefromPage = function() {
        var comfrom = Utils.queryString("comefrom");
        if (comfrom == "1") {
            if (Utils.queryString("curDate"))
                window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_view.html?rnd=" + Math.random() + "&curDate=" + Utils.queryString("curDate"));
            else
                window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_view.html?rnd=" + Math.random());
        }
        else {
            window.location.href = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString() + "&rnd=" + Math.random());
        }
    }
    //保存数据
    this.saveData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            me.dateDescript = '';
            me.content = '';
            me.calendarType = 10;
            me.interval = 6;
            me.dateFlag = "0";
            me.endDateFlag = "2359";
            me.holidayId = 0;
            me.groupId = 0;
            me.startDate = '';

            if (me.checkData() == false)
                return;
            $("#pErrorMsg").hide();
            $("#btnSave").attr("disabled", true);
            if ($("#dropType").val() == "0")
                holidayid = $("#dropSpecialDay").val();
            var info = objCalendarRemind.getRemindInfo();

            var xmlData = String.format(specialTempXmlString, '0', top.encodeXML(me.content), me.groupId, me.calendarType, me.interval, me.dateFlag, me.endDateFlag, '800', '800', info.recMySms, info.recMyEmail, info.recMobile, top.encodeXML(info.recEmail), top.encodeXML(me.dateDescript), info.beforeType, info.beforeTime, top.encodeXML(info.validImgText), '0', '', me.holidayId, "", me.startDate, '');
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionid: 1,
                    seqno: me.id,
                    sendtype: 3,
                    xml: xmlData,
                    rnd: Math.random
                },
                success: function(result) {
                    if (result.State == 0 && result.ResultCode == "True") {
                        me.goComefromPage();
                        try {
                            top.postJiFen(65, 1); //上报积分
                        } catch (e) { }
                    }
                    else {
                        if (result.IsNeedValidImg == "True" && result.ValidImgUrl.length > 0)
                            objCalendarRemind.refreshValidImage(result.ValidImgUrl);
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                    $("#btnSave").attr("disabled", false);
                    top.WaitPannel.hide();
                }
            });
        }
    }
    me.bindEvent();
    me.bindData();
}

//宝宝防疫
richinfo.email.calendar.baby = function() {
    var me = this;
    me.appid = 0; //宝宝ID

    //加载数据
    this.initData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInLoading);
            $.ajax({
                method:"get",
                dataType:"json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: {
                    sid: window.top.UserData.ssoSid,
                    actionId: 0,
                    seqno: 0,
                    sendtype: 8,
                    rnd: Math.random()
                },
                success: function (result) {
                    if (result.State == 0 && result.ResultCode == "True") {
                        me.bindData(result);
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                    top.WaitPannel.hide();
                }
            });
        }
    }
    //保存宝宝数据
    this.saveData = function(type) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            var babyName = "";
            var birthday = "";
            if (me.appid == 0)//添加
            {
                babyName = $("#txtNameAdd").val();
                birthday = $("#txtBirthdayAdd").val();
                $("#txtNameAdd").removeClass("err");
                $("#txtBirthdayAdd").removeClass("err");
                if ($.trim(babyName) == "") {
                    $("#txtNameAdd").addClass("err").focus();
                    $("#lblBabyName").html(calendarMessages.baby_BabyNameEmpty);
                    $("#pBabyName").show();
                    return false;
                }
                if ($.trim(birthday) == "") {
                    $("#txtBirthdayAdd").addClass("err").focus();
                    $("#lblBabyName").html(calendarMessages.baby_BirthdayEmpty);
                    $("#pBabyName").show();
                    return false;
                }
            }
            else//编辑
            {
                babyName = $("#txtNameEdit").val();
                birthday = $("#txtBirthdayEdit").val();
                $("#txtNameEdit").removeClass("err");
                $("#txtBirthdayEdit").removeClass("err");
                if ($.trim(babyName) == "") {
                    $("#txtNameEdit").addClass("err").focus();
                    $("#lblBabyName").html(calendarMessages.baby_BabyNameEmpty);
                    $("#pBabyName").show();
                    return false;
                }
                if ($.trim(birthday) == "") {
                    $("#txtBirthdayEdit").addClass("err").focus();
                    $("#lblBabyName").html(calendarMessages.baby_BirthdayEmpty);
                    $("#pBabyName").show();
                    return false;
                }
            }

            var seqnosData = "";
            if (birthday != me.babyBirthday && type == 1)//只有当修改了生日时才提示及删除原来信息     
            {
                seqnosData = me.allSeqNos;
                top.FloatingFrame.confirm(calendarMessages.baby_EditBabyInfoConfirmMsg, function() {
                    me.saveBabyInfo(babyName, birthday, seqnosData);
                });
            }
            else {
                me.saveBabyInfo(babyName, birthday, "");
            }
        }
    }
    this.saveBabyInfo = function(babyName, birthday, seqnosData) {
        $("#btnSave").attr("disabled", true);
        $("#pBabyName").hide();
        top.WaitPannel.show(calendarMessages.common_DataInProcess);
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/g2/calendar/Special/SpecialEdit.ashx",
            data: { sid: top.UserData.ssoSid,
                actionid: 2,
                seqno: me.appid,
                sendtype: 8,
                allseqnos: seqnosData,
                babyname: babyName,
                birthday: birthday,
                rnd: Math.random
            },
            success: function(result) {
                if (result.State == 0 && result.ResultCode == "True") {
                    me.bindData(result);
                    try {
                        top.postJiFen(65, 1); //上报积分
                    } catch (e) { }
                }
                else {
                    richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                }
                $("#btnSave").attr("disabled", false);
                top.WaitPannel.hide();
            }
        });
    }
    this.delBabyInfo = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $.ajax(
             {
                 type: "post",
                 dataType: "json",
                 url: "/g2/calendar/Special/SpecialEdit.ashx",
                 data: { sid: top.UserData.ssoSid,
                     actionId: 4,
                     sendtype: 8,
                     seqNos: me.allSeqNos,
                     rnd: Math.random
                 },
                 success: function(result) {
                     if (result.State == 0 && result.ResultCode == "True") {
                         me.appid = 0;
                         $("#txtNameAdd").val("");
                         me.bindData(result);
                     }
                     else {
                         richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                     }
                     top.WaitPannel.hide();
                 }
             });
        }
    }
    //绑定数据
    this.bindData = function(result) {
        var serverTime = new Date(result.ServerTime.split(' ')[0].replace(/\-/g, "/"));
        var serverDateTime = new Date(result.ServerTime.replace(/\-/g, "/"));
        if (result.AppInfo.GroupInfo)//存在宝宝信息
        {
            me.appid = result.AppInfo.AppId;
            var addButton = '<span><i class="append"></i><a href="javascript:" curdt="{0}" seqno="{1}" groupId="{2}" type="add">添加提醒</a></span>';
            var editButton = '<span><i class="edit"></i><a href="javascript:" curdt="{0}" seqno="{1}" groupId="{2}" type="edit">编辑提醒</a></span>';
            var delButton = '<span><i class="del"></i><a href="javascript:" curdt="{0}"  seqno="{1}" groupId="{2}" type="del">删除提醒</a></span>';

            $("#editBirth").show();
            $("#infoTitle").show();
            me.appdate = new Date(result.AppInfo.AppDate.replace(/\-/g, "/"));
            $("#spanBirthday").html(me.appdate.format("yyyy年MM月dd日") + " 宝宝 " + result.AppInfo.AppName.encode() + " 生日");
            var dtBirthdayStr = me.appdate.format("yyyy-MM-dd");
            $("#txtBirthdayEdit").val(dtBirthdayStr).attr("realDate", dtBirthdayStr);
            $("#txtNameEdit").val(result.AppInfo.AppName);
            me.babyName = result.AppInfo.AppName;
            me.babyBirthday = dtBirthdayStr;
            $("#imgForAll").show();
            $("#hrefForAll").show();
            //防疫信息列表处理
            var allNum = $("#infoTable tbody tr").length; //全部防疫数量
            var recNum = 0; //添加提醒的数量
            var overNum = 0; //过期的数量
            me.allSeqNos = ''; //已添加提醒的seqno列表，用于全部取消          
            me.allGroupIds = ''; //未过期的防疫类别groupid列表，用于全部添加
            var days = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            $("#infoTable tbody tr").each(function(i, o) {
                var isAdd = false; //当前类别防疫是否添加了提醒
                var curGroupId = $(this).attr("groupId");
                $(this).removeClass("on");
                $(this).find("td:eq(0) p[type=remind]").removeClass("on");
                var curBabyDt = me.appdate.DateAdd(babyConfig[i].interval, babyConfig[i].val); //宝宝诞生时长
                var overDt = me.appdate.DateAdd(overConfig[i].interval, overConfig[i].val); //注射过期时间
                var curDefaultDt = curBabyDt; //当前防疫的注射时间
                var curSendDt = curBabyDt; //发送短信邮件时间
                var curDtStr = curBabyDt.format("yyyy年MM月dd日"); //防疫的注射时间      
                var addCount = result.AppInfo.GroupInfo.length;
                for (var index = 0; index < addCount; index++) {
                    if ($(this).attr("groupId") == result.AppInfo.GroupInfo[index].GroupId)//已经添加了提醒的
                    {
                        //取已经设置的时间
                        curDefaultDt = new Date(result.AppInfo.GroupInfo[index].StartDate.replace(/\-/g, "/"));
                        curDtStr = curDefaultDt.format("yyyy年MM月dd日");
                        $(this).find("td > p[type=injection] > label").html(curDtStr);
                        $(this).find("td:eq(0) p[type=remind]").html("");
                        me.allSeqNos += "," + result.AppInfo.GroupInfo[index].SeqNo;

                        isAdd = true;
                        //判断添加提醒的是否已过期
                        if (overDt.DateAdd("d", 1) <= serverTime)//已过期
                        {
                            overNum++;
                            $(this).attr("class", "on");
                            $(this).find("td:eq(1)").html("已过期");
                        }
                        else {
                            recNum++;
                            me.allGroupIds += "," + curGroupId;
                            $(this).find("td:eq(1)").html("").append(String.format(editButton, curDefaultDt.format("yyyy/MM/dd"), result.AppInfo.GroupInfo[index].SeqNo, curGroupId));
                            $(this).find("td:eq(1)").append(String.format(delButton, curDefaultDt.format("yyyy/MM/dd"), result.AppInfo.GroupInfo[index].SeqNo, curGroupId));
                        }

                        if (result.AppInfo.GroupInfo[index].RecMyEmail == 1 || result.AppInfo.GroupInfo[index].RecMySms == 1) {
                            var h = result.AppInfo.GroupInfo[index].StartTime.substr(0, result.AppInfo.GroupInfo[index].StartTime.length - 2);
                            var m = result.AppInfo.GroupInfo[index].StartTime.substr(result.AppInfo.GroupInfo[index].StartTime.length - 2, 2);
                            var sendDate = new Date(result.AppInfo.GroupInfo[index].StartDate.replace(/\-/g, "/")).DateAdd("d", result.AppInfo.GroupInfo[index].BeforeTime * -1).DateAdd("h", h).DateAdd("n", m);
                            if (sendDate < serverDateTime) {
                                $(this).find("td:eq(0) p[type=remind]").attr("class", "on");
                            }
                            //下发时间
                            $(this).find("td:eq(0) p[type=remind]").append($('<i class="alert"></i><label>提前' + days[result.AppInfo.GroupInfo[index].BeforeTime] + '天发送提醒</label>'));
                            if (result.AppInfo.GroupInfo[index].RecMyEmail == 1)
                                $(this).find("td:eq(0) p[type=remind]").append($('<i class="alt-mail" title="邮件通知"></i>'));
                            if (result.AppInfo.GroupInfo[index].RecMySms == 1)
                                $(this).find("td:eq(0) p[type=remind]").append($('<i class="alt-phone" title="短信通知"></i>'));
                        }
                        break;
                    }
                }
                if (!isAdd)//未添加了提醒的
                {
                    $(this).find("td:eq(0) p:last").html("");
                    $(this).find("td > p[type=injection] > label").html(curDtStr);
                    //判断未添加提醒的是否已过期 
                    if (overDt.DateAdd("d", 1) <= serverTime)//已过期
                    {
                        overNum++;
                        $(this).attr("class", "on");
                        $(this).find("td:eq(1)").html("已过期");
                    }
                    else {
                        me.allGroupIds += "," + curGroupId;
                        $(this).find("td:eq(1)").html("").html(String.format(addButton, curDefaultDt.format("yyyy/MM/dd"), 0, curGroupId));
                    }

                }
                $(this).find(".title span:eq(0)").html(curBabyDt.format("yyyy年MM月dd日"));
            });
            if (me.allSeqNos.length > 1) {
                me.allSeqNos = me.allSeqNos.substring(1, me.allSeqNos.length);
            }
            if (me.allGroupIds.length > 1) {
                me.allGroupIds = me.allGroupIds.substring(1, me.allGroupIds.length);
            }
            if (allNum != overNum)//没有全部过期
            {
                if (recNum == allNum || (recNum == allNum - overNum)) {
                    $("#hrefForAll").html("取消全部提醒").unbind("click").click(function() {
                        top.FloatingFrame.confirm("确定要取消全部提醒吗？", function() {
                            me.removeRecInfo(me.allSeqNos);
                        });
                    });
                }
                else {
                    $("#hrefForAll").html("添加全部提醒").unbind("click").click(function() {
                        me.openWindow(0, me.allGroupIds, '', "添加全部提醒", 1, 0);
                    });
                }
            }
            else//全部过期
            {
                $("#imgForAll").hide();
                $("#hrefForAll").hide();
            }

            //添加
            $("#infoTable a[type=add]").unbind("click").click(function() {
                me.openWindow(0, $(this).attr("groupId"), $(this).attr("curdt"), "添加宝宝防疫提醒", 0, 0);
            });
            //编辑
            $("#infoTable a[type=edit]").unbind("click").click(function() {
                me.openWindow($(this).attr('seqno'), $(this).attr("groupId"), $(this).attr("curdt"), "编辑宝宝防疫提醒", 0, 0);
            });
            //删除
            $("#infoTable a[type=del]").unbind("click").click(function() {
                me.removeRecInfo($(this).attr("seqno"));
            });

            $("#addBirth").hide();
            $("#editBirth").show();
            $("#setBirth").hide();
            $("#infoTable").show();
        }
        else//没有设置宝宝信息
        {
            var serverTimeStr = serverTime.format("yyyy-MM-dd");
            $("#txtBirthdayAdd").val(serverTimeStr).attr("realDate", serverTimeStr);
            $("#addBirth").show();
            $("#txtNameAdd").focus();
            $("#editBirth").hide();
            $("#setBirth").hide();
            $("#infoTitle").hide();
            $("#infoTable").hide();
        }
        $("#spanCount1").text("全部日程(" + result.AllCount + ")");
        $("#spanCount2").text("最近7天日程(" + result.SevenCount + ")");
        top.WaitPannel.hide();
    }
    //打开编辑窗口(type：0单条 1整组)
    this.openWindow = function(seq_no, groupId, curdt, title, type, comefrom) {
        top.FloatingFrame.open(title, "/m2012/html/calendar/special/babyset.html?seq_no=" + seq_no + "&groupId=" + groupId + "&curdt=" + curdt + "&appid=" + me.appid + "&type=" + type + "&birthday=" + me.appdate.format("yyyy-MM-dd") + "&comefrom=" + comefrom + "&rnd" + Math.random(), 450,135);
    }
    //删除提醒
    this.removeRecInfo = function(seqnos) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $.ajax(
             {
                 type: "post",
                 dataType: "json",
                 url: "/g2/calendar/Special/SpecialEdit.ashx",
                 data: { sid: top.UserData.ssoSid,
                     actionId: 3,
                     sendtype: 8,
                     seqNos: seqnos,
                     rnd: Math.random
                 },
                 success: function(result) {
                     if (result.State == 0 && result.ResultCode == "True") {
                         top.WaitPannel.show(calendarMessages.baby_RemindInfoRemoved);
                         me.bindData(result);
                     }
                     else {
                         richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                     }
                     top.WaitPannel.hide();
                 }
             });
        }
    }
    //绑定事件
    this.bindEvent = function() {
        $("#add").click(function() {
            me.saveData(0);
        });
        $("#btnSave").click(function() {
            me.saveData(1);
        });
        $("#hrefDel").click(function() {
            top.FloatingFrame.confirm(calendarMessages.baby_DelbyInfoConfirmMsg, function() {
                me.delBabyInfo();
            });
        });
        $("#hreftEdit").click(function() {
            $("#setBirth").show();
            $("#editBirth").hide();
            $("#txtBirthdayEdit").val(me.babyBirthday).attr("realDate", me.babyBirthday).removeClass("err");
            $("#txtNameEdit").val(me.babyName).removeClass("err");
        });
        $("#btnCancel").click(function() {
            $("#setBirth").hide();
            $("#editBirth").show();
            $("#pErrorMsg").hide();
        });
        $("#txtBirthdayEdit").click(function() {
            showMyCalendar(this, null, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            stopBubble();
        });
        $("#dropBirthdayEdit").click(function() {
            showMyCalendar($("#txtBirthdayEdit")[0], null, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            stopBubble();
        });

        $("#txtBirthdayAdd").click(function() {
            showMyCalendar(this, null, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            stopBubble();
        });
        $("#dropBirthdayAdd").click(function() {
            showMyCalendar($("#txtBirthdayAdd")[0], null, { popuControl: this, date2StringPattern: 'yyyy-MM-dd' });
            stopBubble();
        });
        $("#aRecent").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=1&rnd=" + Math.random();
            return false;
        });
        $("#aAgent").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=2&rnd=" + Math.random();
            return false;
        });
        $("#aHasDone").click(function() {
            window.location.href = "/m2012/html/calendar/calendar_list.html?type=3&rnd=" + Math.random();
            return false;
        });
        $("#goView").click(function () { window.location.href = '/m2012/html/calendar/calendar_view.html?rnd=' + Math.random(); if (window.event) window.event.returnValue = false; });
        document.onclick = function() {
            if (objSelector) objSelector.hide();
        }
        $("#content").scroll(function() {
            resetCalendarTop();
        });
    }

    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }

    this.initData();
    this.bindEvent();
}

//宝宝防疫设置
richinfo.email.calendar.babyset = function() {
    var me = this;
    getparam();
    var tempHtml = "";

    tempHtml = "";
    for (var i = 1; i <= 9; i++) {
        tempHtml += "<option value=" + String(i) + ">注射前" + String(i) + "天</option>";
    }
    $("#ddlBeforeDays").html(tempHtml);
    setTimeout(function() { $("#dropTime").attr("value", 800); $("#ddlBeforeDays").attr("value", 1); }, 1);

    if (Utils.queryString("type") == "1")//添加全部
    {
        $("#trTime").hide();
        top.$(".wTipCont iframe:eq(0)").css("height", 130);
    }
    else {
        tempHtml = "";
        //下发时间
        for (var i = 0; i <= 23; i++) {
            tempHtml += "<option value=" + i + "00>" + i + "：00</option><option value=" + i + "30>" + i + "：30</option>";
        }
        $("#dropTime").html(tempHtml);

        //月
        tempHtml = "";
        for (var i = 1; i <= 12; i++) {
            if (i < 10)
                tempHtml += String.format("<option value=\"{0}\">{0}</option>", "0" + String(i));
            else
                tempHtml += String.format("<option value=\"{0}\">{0}</option>", String(i));
        }
        $("#dropMonth").html(tempHtml);
        //日
        tempHtml = "";
        for (var i = 1; i <= 31; i++) {
            if (i < 10)
                tempHtml += String.format("<option value=\"{0}\">{0}</option>", "0" + String(i));
            else
                tempHtml += String.format("<option value=\"{0}\">{0}</option>", String(i));
        }
        $("#dropDay").html(tempHtml);
    }
    function bindEvent() {
        $("#btnSave").click(function() {
            saveData();
        });
        
        //取消按钮
        $("#btnCancel").click(function() {
            top.FloatingFrame.close();
        });
        $("#tmemsg").click(function() {
            if (this.checked)
                $("#phelp").show();
            else
                $("#phelp").hide();
            top.$(".wTipCont iframe:eq(0)").css("height", $("#babySetPanel").height() + 10);
        });
    }
    //加载数据
    function initData() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            top.WaitPannel.show(calendarMessages.common_DataInLoading);
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionid: 0,
                    seqno: me.seqno,
                    sendtype: 8,
                    rnd: Math.random
                },
                success: function(result) {
                    if (result.State == 0 && result.ResultCode == "True") {
                         
                        $("#phelp").text(calendarMessages.meTips);
                        $("#phelp").show();
                        if (me.seqno == 0) {
                            $("#tmemsg").attr("checked", true);
                        } else {
                            $("#tmemsg").attr("checked", result.RecMySms == 1 ? true : false);
                        }

                        if (top.$User.isNotChinaMobileUser()) { //非移动号码禁用发短信
                            $("#tmemsg").attr("checked", false).hide().next().hide();
                            
                            $("#tmemail").attr("checked", true)
                            $("#phelp").html("温馨提示：设置成功后将通过邮件提醒自己。");
                        }
                        if (Utils.queryString("type") == "2")//从其它页打开,从返回的json里取相关数据
                        {
                            me.groupId = result.GroupId;
                            me.appid = result.SpecialAppId;
                            for (var i = 0; i < result.AppInfo.GroupInfo.length; i++) {
                                if (me.groupId == result.AppInfo.GroupInfo[i].GroupId) {
                                    me.curdt = new Date(result.AppInfo.GroupInfo[i].StartDate.replace(/\-/g, "/")).format("yyyy/MM/dd");
                                    me.birthday = new Date(result.AppInfo.AppDate.replace(/\-/g, "/")).format("yyyy/MM/dd");
                                    break;
                                }
                            }
                        }
                        if (Utils.queryString("type") != "1")//是单条
                        {
                            tempHtml = "";
                            me.realServerDateTime = new Date(result.ServerTime.replace(/\-/g, "/"));
                            //年
                            var birthdayDt = new Date(me.birthday.replace(/\-/g, "/"));
                            var startDt = birthdayDt.DateAdd(babyConfig[me.groupId - 1].interval, babyConfig[me.groupId - 1].val);
                            var year = startDt.getFullYear();
                            for (var i = year - 1; i <= year + 3; i++) {
                                tempHtml += "<option value=" + String(i) + ">" + String(i) + "</option>";
                            }
                            $("#dropYear").html(tempHtml);
                            $("#tmemail").attr("checked", result.RecMyEmail == 1 ? true : false);
                            var curdt = new Date(me.curdt);
                            var now = new Date();
                            if (curdt < now && me.seqno == 0) {
                                curdt = now.DateAdd("d", 1);
                            }
                            var month = curdt.getMonth();
                            var day = curdt.getDate();
                            var hour = result.StartTime;
                            if (me.seqno == 0) {
                                hour = getStartAndEndTime(result.ServerTime).startTime;
                            }
                            setTimeout(function() {
                                $("#dropYear").attr("value", curdt.getFullYear());
                            }, 1);

                            $("#dropMonth").attr("value", month < 9 ? "0" + (month + 1) : (month + 1));
                            $("#dropDay").attr("value", day <= 9 ? "0" + day : day);
                            if (hour == "0")
                                hour = "000";
                            if (hour == "30")
                                hour = "030";
                            $("#dropTime").attr("value", hour);
                            $("#ddlBeforeDays").attr("value", result.BeforeTime);
                        }
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }
                    top.$(".wTipCont iframe:eq(0)").css("height", $("#babySetPanel").height() + 10);
                    top.WaitPannel.hide();
                }
            });
        }
    }
    //保存数据
    function saveData() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            debugger
            var recMySms = $("#tmemsg").attr("checked") == true ? 1 : 0;
            var recMyEmail = $("#tmemail").attr("checked") == true ? 1 : 0;
            var valid = true;
            var validMsg = "";
            if (recMySms == 0 && recMyEmail == 0) {
                validMsg = calendarMessages.baby_NeedSelectSmsOrEmail;
                valid = false;
            }
            var xmlData = "";
            if (Utils.queryString("type") != "1")//单条添加或编辑
            {
                var dateFlag = $("#dropYear").val() + $("#dropMonth").val() + $("#dropDay").val();
                var sendTime = $("#dropTime").val();
                var api = new richinfo.email.calendar.commonApi();
                var result = api.checkDateStr($("#dropYear").val() + "-" + $("#dropMonth").val() + "-" + $("#dropDay").val());
                if (valid && !result) {
                    validMsg = calendarMessages.baby_DateError;
                    valid = false;
                }
                if (valid) {
                    var dt = new Date(result.year, result.month, result.date);
                    var sendDateTime = dt.DateAdd("d", 0 - parseInt($("#ddlBeforeDays").val(), 10)).DateAdd("h", parseInt($("#dropTime").val(), 10) / 100);
                    if (sendDateTime <= me.realServerDateTime) {
                        validMsg = calendarMessages.baby_DateTimeIsNotValid;
                        valid = false;
                    }
                    if (valid) {
                        var startDate = dt.format("yyyy-MM-dd");
                        var dateDescript = dt.format("yyyy年MM月dd日");

                        xmlData = String.format(specialTempXmlString, me.appid, '', me.groupId, 10, 0, dateFlag, dateFlag, sendTime, sendTime, recMySms, recMyEmail, '', '', top.encodeXML(dateDescript), 2, $("#ddlBeforeDays").val(), '', '0', '', 0, "", startDate, startDate);
                    }
                }
            }
            else//添加全部
            {
                xmlData = String.format(specialTempXmlString, me.appid, '', me.groupId, 10, 0, "", "", 800, 800, recMySms, recMyEmail, '', '', '', 2, $("#ddlBeforeDays").val(), '', '0', '', 0, "", '', '');
            }

            if (valid == false) {
                $("#lblErrorMsg").text(validMsg);
                $("#pErrorMsg").show();
                top.$(".wTipCont iframe:eq(0)").css("height", $("#babySetPanel").height() + 10);
                return false;
            }
            $("#btnSave").unbind("click");
            top.$(".wTipCont iframe:eq(0)").css("height", $("#babySetPanel").height() + 10);
            top.WaitPannel.show(calendarMessages.common_DataInProcess);
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid,
                    actionid: 1,
                    seqno: me.seqno,
                    birthday: me.birthday,
                    sendtype: 8,
                    xml: xmlData,
                    rnd: Math.random
                },
                success: function(result) {
                    top.WaitPannel.hide();
                    if (result.State == 0 && result.ResultCode == "True") {
                        top.WaitPannel.hide();
                        if ($("#tmemsg").attr("checked") == true || $("#tmemail").attr("checked") == true) {
                            top.WaitPannel.show(calendarMessages.baby_RemindInfoAdded);
                            try {
                                top.postJiFen(65, 1); //添加日程提醒成功 上报积分
                            } catch (e) { }
                        } else top.WaitPannel.show(calendarMessages.baby_RemindInfoRemoved);
                        top.document.getElementById("calendar").contentWindow.getBindData();
                        top.FloatingFrame.close();
                    }
                    else {
                        richinfo.email.calendar.common.alertErrorMsg(result.State, result.ResultCode, result.ResultMsg);
                    }

                    $("#btnSave").click(function() { saveData(); });
                }
            });
        }
    }

    function getparam() {
        me.groupId = 0;
        me.seqno = 0;
        me.appid = 0;
        me.curdt = top.UserData.ServerDateTime.format("yyyy-MM-dd");
        me.birthday = me.curdt;
        //groupId(或列表)
        var groupId = Utils.queryString("groupId");
        if (groupId)
            me.groupId = groupId;

        //序号   
        var seqno = Utils.queryString("seq_no");
        if (seqno)
            me.seqno = seqno;

        //特色应用ID    
        var appid = Utils.queryString("appid");
        if (appid)
            me.appid = appid;

        //时间   
        var curdt = Utils.queryString("curdt");
        if (curdt)
            me.curdt = curdt;

        //生日
        var birthday = Utils.queryString("birthday");
        if (birthday)
            me.birthday = birthday;
    }
    bindEvent();
    initData();
}



function MeetPage() {
    var me = this;
    var smsLength = 200;
    var seqno = 0;
    var serverDate; //= new Date();
    var DateServer;
    var calendarData;
    var content = "";
    var calendartype = "10";
    var dateflag = "0";
    var enddateflag = "0";
    var starttime;
    var endtime;
    var recmysms = 0;
    var recmyemail = 0;
    var recmobile = "";
    var recemail = "";
    var datedesc = "";
    var beforetype = "";
    var beforetime = "";
    var validimg = "";
    var interval = "";
    var caltype = "";
    var textContent = calendarMessages.meet_DefaultContent;
    var groupLength = 2;
    var isNeedImg = false;
    var isAllDay = false;
    var site = "";
    var siteLength = 100;
    var listtype = 0;   //列表类 0所有,1约会,2交费...
    var paramlist = Utils.queryString("listtype");
    if (paramlist) {
        listtype = parseInt(paramlist);
    }

    var objlunar = new richinfo.email.calendar.commonUI.lunarBox("divLunarContent");
    top.WaitPannel.hide();
    $("#HiddCalValue").val("0");

    $(document).click(function() {
        $("#__calendarPanel").hide();
    });

    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        id = 0;
        $("#aTitle").text("添加约会提醒");
    }
    else {
        $("#aTitle").text("编辑约会提醒");
    }

    this.getData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid, actionId: 0, seqno: id, sendtype: 1, rnd: Math.random() },
                success: function(data) {
                    if (data.State == 0) {
                        calendarData = data;
                        $("#txtContent").text(textContent);
                        $("#txtContent").blur();
                        $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                        groupLength = data.GroupLength;
                        serverDate = data.ServerTime;
                        DateServer = serverDate.split(" ")[0];
                        objlunar.initData(id, data);
                        var dateSelectedStart = new Date();
                        var dateSelectedEnd = new Date();
                        if (id == 0) {
                            obj.initData(0, 15, 1, 0, "", "", data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            var curHour = parseInt(serverDate.split(" ")[1].split(":")[0], 10);
                            dateSelectedStart.setHours(curHour + 1);
                            dateSelectedStart.setMinutes(0);
                            dateSelectedEnd.setHours(curHour + 2);
                            dateSelectedEnd.setMinutes(0);
                        }
                        else {
                            serverDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));

                            if (data.Content != null) {
                                $("#txtContent").removeClass("normal");
                                $("#txtContent").val(data.Content);
                                me.isContentChange = true;
                            }
                            if (data.Site != null) {
                                $("#txtSite").val(data.Site);
                            }
                            //(beforeType,beforeTime,recMySms,recMyEmail,recMobile,recEmail,freeCount,sendCount,fee,groupLength)
                            obj.initData(data.BeforeType, data.BeforeTime, data.RecMySms, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            dateSelectedStart.setHours(String(data.StartTime).substr(0, String(data.StartTime).length - 2));
                            dateSelectedStart.setMinutes(String(data.StartTime).substr(String(data.StartTime).length - 2, 2));
                            dateSelectedEnd.setHours(String(data.EndTime).substr(0, String(data.EndTime).length - 2));
                            dateSelectedEnd.setMinutes(String(data.EndTime).substr(String(data.EndTime).length - 2, 2));
                        }
                        obj.setEventTime(dateSelectedStart, dateSelectedEnd);
                        $("#helpCount").show();
                    }
                    else {
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //编辑或是添加日程
    MeetPage.prototype.getCalendar = function() {
        recmysms = 0;
        recmyemail = 0;
        recmobile = "";
        recemail = "";

        if ($.trim($("#txtContent").val()) == textContent && !me.isContentChange) {
            content = "";
        } else {
            content = $("#txtContent").val().trim();
        }

        var info = obj.getRemindInfo();
        beforetype = info.beforeType;
        beforetime = info.beforeTime;
        recmysms = info.recMySms;
        recmyemail = info.recMyEmail;
        recmobile = info.recMobile;
        recemail = info.recEmail;
        validimg = info.validImgText;

        site = $("#txtSite").val().trim();
        me.sendSmsStartTime = 0;
        me.sendSmsEndTime = 2359;

        var lunar = objlunar.getData();
        isAllday = lunar.isAllday;
        calendartype = lunar.calendartype;
        interval = lunar.interval;
        dateflag = lunar.dateflag;
        enddateflag = lunar.enddateflag;
        starttime = lunar.starttime;
        endtime = lunar.endtime;
        datedesc = lunar.datedesc;

        var dateSelectedStart = new Date();
        dateSelectedStart.setHours(String(starttime).substr(0, String(starttime).length - 2));
        dateSelectedStart.setMinutes(String(starttime).substr(String(starttime).length - 2, 2));

        var dateSelectedEnd = new Date();
        dateSelectedEnd.setHours(String(endtime).substr(0, String(endtime).length - 2));
        dateSelectedEnd.setMinutes(String(endtime).substr(String(endtime).length - 2, 2));

        obj.setEventTime(dateSelectedStart, dateSelectedEnd)

        return String.format(specialTempXmlString, "", top.encodeXML(content), 0, calendartype, interval, dateflag, enddateflag, starttime, endtime, recmysms, recmyemail, recmobile, top.encodeXML(recemail), datedesc, beforetype, beforetime, top.encodeXML(validimg), "0", top.encodeXML(site), "0", "", "", "");
    }
    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }
    //日程验证
    MeetPage.prototype.checkCalendar = function() {
        if (content == null || content == "") {
            me.showErrorMsg(calendarMessages.meet_ContentNotEmpty);
            $("#txtContent").addClass("err").focus();
            return false;
        }
        if (content.length > smsLength) {
            me.showErrorMsg(String.format(calendarMessages.meet_ContentTooLong, smsLength));
            $("#txtContent").addClass("err").focus();
            return false;
        }

        if (site != null && site.length > siteLength) {
            me.showErrorMsg(String.format(calendarMessages.meet_SiteLong, siteLength));
            $("#txtSite").addClass("err").focus();
            return false;
        }

        var lunar = objlunar.checkData(isAllDay, interval, dateflag, enddateflag, starttime, endtime);
        if (!lunar.result) {
            me.showErrorMsg(lunar.message);
            return false;
        }

        var remindCheck = obj.checkRemindInfo();
        if (remindCheck.result == false)//检验提醒输入栏
        {
            me.showErrorMsg(remindCheck.message);
            return false;
        }

        return true;
    }

    //保存
    MeetPage.prototype.saveCalendar = function(xml) {
        if (!me.checkCalendar()) {
            return;
        }
        if ($("#slRept").val() == "0") {
            var arrdatesvr = DateServer.split(" ")[0].split("-");
            var tempdatesvr = arrdatesvr[0] + arrdatesvr[1] + arrdatesvr[2];
            var arrdatestart = $("#txtGregStart").val().split("-");
            var tempdateflag = arrdatestart[0] + arrdatestart[1] + arrdatestart[2];
            if ((recmysms == 1 || recmyemail == 1 || recmobile.length > 0 || recemail.length > 0) && (tempdatesvr > tempdateflag || (tempdatesvr == tempdateflag && $("#chkallday").attr("checked") == true))) {
                top.FloatingFrame.confirm(calendarMessages.confirmNotSendSMS, function() {
                    me.saveMeet(xml);
                });
            }
            else {
                me.saveMeet(xml);
            }
        }
        else {
            me.saveMeet(xml);
        }
    }

    this.saveMeet = function(xml) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $("#btnSave").attr("disabled", true);
            $("#pErrorMsg").hide();
            $.ajax({
                dataType:"json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: {
                    sid: window.top.UserData.ssoSid,
                    actionId: 1,
                    seqno: id,
                    sendtype: 1,
                    xml: xml,
                    rnd: Math.random()
                },
                success: function (data) {
                    $("#btnSave").val("保存");
                    if (data.State == 0) {
                        if (data.ResultCode == "True") {
                            var UrlPage = "/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString() + "&rnd=" + Math.random();
                            if (Utils.queryString("comefrom") == "1") {
                                if (Utils.queryString("curDate"))
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate") + "&rnd=" + Math.random();
                                else
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?rnd=" + Math.random();
                            }
                            window.location.href = top.M139.Text.Url.getAbsoluteUrl(UrlPage);
                            return false;
                        }
                        else {
                            if (data.IsNeedValidImg == "True" && data.ValidImgUrl.length > 0)
                                obj.refreshValidImage(data.ValidImgUrl);
                            top.FloatingFrame.alert(data.ResultMsg);
                            $("#btnSave").attr("disabled", false);
                        }
                    }
                    else if (data.State == 2) {
                        $("#btnSave").attr("disabled", false);
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //日程内容输入框数字检测
    MeetPage.prototype.checkInputWord = function() {
        var contentval = $("#txtContent").attr("value");
        var num = 0;
        if (contentval.trim() != textContent || me.isContentChange == true) {
            num = contentval.length;
            //当没有\r时表示不是ie，则换行符是\n，字数应该加上换行符数
            var enternum = 0; //换行符数
            if (contentval.indexOf("\r") < 0) {
                enternum = (contentval.split("\n")).length - 1;
            }
            num = num + enternum;
        }
        if (num > smsLength) {
            var smsLengthend = smsLength;
            //当用户使用ff，chrome时，计算前面有效的字数（相当于在ie下的10000个字）
            if (smsLength > enternum) {
                if (enternum > 0) {
                    var contentlastval = contentval.substr(smsLength - enternum);
                    var enternumlast = (contentlastval.split("\n")).length - 1;
                    smsLengthend = smsLength - enternum + enternumlast;
                }
            }
            $("#txtContent").attr("value", $.trim($("#txtContent").attr("value")).substring(0, smsLengthend));
            me.showErrorMsg(String.format(calendarMessages.inputWordTooLong, smsLength));
            $("#txtContent").addClass("err").focus();
            num = smsLength;
        }
        $("#helpCount em:eq(0)").text(num);
        if (smsLength - num > 0)
            $("#helpCount em:eq(1)").text(smsLength - num);
        else
            $("#helpCount em:eq(1)").text(0);
    }
    //字数检查
    //    if ($.browser.msie)
    //        $("#txtContent").bind("propertychange", me.checkInputWord);
    //    else{
    var insObj = null;
    var timer = setInterval(function() {
        if ($("#txtContent").val() != insObj || me.isContentChange == true) {
            me.checkInputWord();
            insObj = $("#txtContent").val();
        }
    }, 100);
    //    }
    //保存
    $("#btnSave").click(function() {

        me.saveCalendar(me.getCalendar());
        return false;
    });
    $("#content").scroll(function() {
        resetCalendarTop();
    });
    var comefrom = Utils.queryString("comefrom");
    var gotopage = "calendar_view.html?1=1";
    if (Utils.queryString("curDate"))
        gotopage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate");
    $("#btnCancel").click(function() {
        if (comefrom && comefrom == 2) {
            gotopage = "/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString();
        }
        window.location.href =  gotopage + "&rnd=" + Math.random();
        return false;
    });

    $("#txtContent").focus(function() {
        if ($.trim($(this).val()) == textContent && !me.isContentChange) {
            $(this).val("");
            $(this).removeClass("normal");
        }
        me.isContentChange = true;
    }).blur(function() {
        if ($.trim($(this).val()).length == 0) {
            $(this).val(textContent);
            $(this).addClass("normal");
            me.isContentChange = false;
        }
    });
    $("#txtContent").change(function() {
        me.isContentChange = true;
    });
};

function PayPage() {
    var me = this;
    var smsLength = 100;
    var seqno = 0;
    var serverDate; //= new Date();

    var calendarData;
    var content = "";
    var calendartype = "10";
    var dateflag = "0";
    var enddateflag = "0";
    var starttime;
    var endtime;
    var recmysms = 0;
    var recmyemail = 0;
    var recmobile = "";
    var recemail = "";
    var datedesc = "";
    var beforetype = "";
    var beforetime = "";
    var validimg = "";
    var interval = "";
    var caltype = "";
    var textContent = "";
    var groupLength = 2;
    var isNeedImg = false;

    var groupID = 0; //交费类别
    var fee = 0;
    var feeMax = 100000000000; //不能大于1千亿
    var listtype = 0;   //列表类 0所有,1约会,2交费...
    var paramlist = Utils.queryString("listtype");
    if (paramlist) {
        listtype = parseInt(paramlist);
    }

    top.WaitPannel.hide();

    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        id = 0;
        $("#aTitle").text("添加交费提醒");
    }
    else {
        $("#aTitle").text("编辑交费提醒");
    }

    //日期选项初始化
    var htmlGregDay = ""; //公历
    $("#sltDay").empty();
    for (var i = 1; i <= 31; i++) {
        var k = "01";
        k = i;
        if (i < 10) {
            k = "0" + i;
        }
        htmlGregDay += "<option value=" + k + ">" + i + "日</option>";
    }
    htmlGregDay += "<option value=99>最后一天</option>";
    $("#sltDay").append(htmlGregDay);

    this.DisplayContent = function() {
        if ($("#sltPayType").val() == "7" || $("#sltPayType").val() == "99") {
            $("#spanContent").show();
        }
        else {
            $("#spanContent").hide();
        }
    }

    //    $("#sltPayType").change(function(){
    //        me.DisplayContent();
    //    });
    this.getData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid, actionId: 0, seqno: id, sendtype: 2, rnd: Math.random() },
                success: function(data) {
                    if (data.State == 0) {
                        calendarData = data;
                        $("#txtContent").val(textContent);
                        $("#txtContent").blur();
                        $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                        groupLength = data.GroupLength;
                        serverDate = data.ServerTime;

                        var dateSelectedStart = new Date();
                        var dateSelectedEnd = new Date();
                        var htmlPayType = ""; //交费类别
                        if (data.GroupTable != "") {
                            for (var index = 0; index < data.GroupTable.length; index++) {
                                if (data.GroupId != null && data.GroupTable[index].TypeID == data.GroupId) {
                                    htmlPayType += "<option value=" + data.GroupTable[index].TypeID + " selected>" + data.GroupTable[index].TypeName + "</option>";
                                }
                                else {
                                    htmlPayType += "<option value=" + data.GroupTable[index].TypeID + " >" + data.GroupTable[index].TypeName + "</option>";
                                }
                            }
                            $("#sltPayType").append(htmlPayType);
                        }
                        if (id == 0) {
                            obj.initData(2, 1, 1, 0, "", "", data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl); //默认提前1天，选中发短信
                            var curHour = parseInt(serverDate.split(" ")[1].split(":")[0], 10);
                            dateSelectedStart.setHours(curHour + 1);
                            dateSelectedStart.setMinutes(0);
                            dateSelectedEnd.setHours(curHour + 2);
                            dateSelectedEnd.setMinutes(0);
                            $("#sltDay").attr("value", serverDate.split(" ")[0].split("-")[2]);
                        }
                        else {
                            me.DisplayContent();
                            serverDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));
                            if (data.Content != null) {
                                $("#txtContent").removeClass("normal");
                                var yuan = data.Content.indexOf("元");
                                if (yuan > -1) {
                                    var cont = data.Content.substring(yuan + 2);
                                    $("#txtContent").val(cont);
                                }
                            }
                            if (data.Fee != null) {
                                if (data.Fee.toString().indexOf(".") > -1 || data.Content.indexOf(".00元") > -1) {
                                    $("#txtFee").val(parseFloat(data.Fee).toFixed(2));
                                }
                                else {
                                    $("#txtFee").val(data.Fee);
                                }
                            }
                            if (data.DateFlag != null) {
                                $("#sltDay").attr("value", data.DateFlag);
                            }
                            //(beforeType,beforeTime,recMySms,recMyEmail,recMobile,recEmail,freeCount,sendCount,fee,groupLength)
                            obj.initData(data.BeforeType, data.BeforeTime, data.RecMySms, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            dateSelectedStart.setHours(String(data.StartTime).substr(0, String(data.StartTime).length - 2));
                            dateSelectedStart.setMinutes(String(data.StartTime).substr(String(data.StartTime).length - 2, 2));
                            dateSelectedEnd.setHours(String(data.EndTime).substr(0, String(data.EndTime).length - 2));
                            dateSelectedEnd.setMinutes(String(data.EndTime).substr(String(data.EndTime).length - 2, 2));
                        }
                        obj.setEventTime(dateSelectedStart, dateSelectedEnd);
                        $("#helpCount").show();
                    }
                    else {
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //编辑或是添加日程
    PayPage.prototype.getCalendar = function() {
        recmysms = 0;
        recmyemail = 0;
        recmobile = "";
        recemail = "";

        groupID = $("#sltPayType").val();

        var feeval = $("#txtFee").val().trim();
        if (feeval.indexOf(".") > -1) {
            fee = parseFloat(feeval).toFixed(2);
        }
        else if (feeval == "") {
            fee = 0;
        }
        else {
            fee = parseInt(feeval);
        }
        //       if(groupID == "7" || groupID == "99")
        //       {            
        //            content = $("#txtContent").val().trim();
        //       }
        //       else
        //       {
        //            content = "";
        //       }
        content = $("#txtContent").val().trim();
        if (content != "") {
            content = "，" + content;
        }
        content = String.format(calendarMessages.pay_Content, $("#sltPayType").find("option:selected").text(), fee, content);

        var info = obj.getRemindInfo();
        beforetype = info.beforeType;
        beforetime = info.beforeTime;
        recmysms = info.recMySms;
        recmyemail = info.recMyEmail;
        recmobile = info.recMobile;
        recemail = info.recEmail;

        validimg = $("#txtValidate").val().trim();
        me.sendSmsStartTime = 0;
        me.sendSmsEndTime = 2359;

        calendartype = 11;
        interval = 5;
        dateflag = $("#sltDay option:selected").val();
        enddateflag = dateflag;
        starttime = "800";
        endtime = starttime;
        if (dateflag == "99") {
            datedesc = "每月最后一天";
        }
        else {
            datedesc = "每月" + dateflag + "日";
        }

        var dateSelectedStart = new Date();
        dateSelectedStart.setHours(String(starttime).substr(0, String(starttime).length - 2));
        dateSelectedStart.setMinutes(String(starttime).substr(String(starttime).length - 2, 2));

        var dateSelectedEnd = new Date();
        dateSelectedEnd.setHours(String(endtime).substr(0, String(endtime).length - 2));
        dateSelectedEnd.setMinutes(String(endtime).substr(String(endtime).length - 2, 2));

        obj.setEventTime(dateSelectedStart, dateSelectedEnd)

        return String.format(specialTempXmlString, 0, top.encodeXML(content), groupID, calendartype, interval, dateflag, enddateflag, starttime, endtime, recmysms, recmyemail, recmobile, top.encodeXML(recemail), top.encodeXML(datedesc), beforetype, beforetime, top.encodeXML(validimg), fee, "", "0", "", "", "");
    }

    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }
    //日程验证
    PayPage.prototype.checkCalendar = function() {
        if (groupID == 0) {
            me.showErrorMsg(calendarMessages.pay_NotSelectPayType);
            $("#sltPayType").addClass("err").focus();
            return false;
        }
        if ($("#txtContent").val().length > smsLength) {
            me.showErrorMsg(String.format(calendarMessages.pay_ContentTooLong, smsLength));
            $("#txtContent").addClass("err").focus();
            return false;
        }

        if ($("#txtFee").val().trim() != "") {
            var reg = /^-?\d+\.{0,}\d{0,}$/
            if (!reg.test($("#txtFee").val().trim())) {
                me.showErrorMsg(calendarMessages.pay_FeeError);
                $("#txtFee").addClass("err").focus();
                return false;
            }
        }
        var feeVal = parseFloat(fee);
        if (isNaN(feeVal)) {
            me.showErrorMsg(calendarMessages.pay_FeeError);
            $("#txtFee").addClass("err").focus();
            return false;
        }
        else if (feeVal > feeMax) {
            me.showErrorMsg(String.format(calendarMessages.pay_FeeMaxError, feeMax));
            $("#txtFee").addClass("err").focus();
            return false;
        }

        var remindCheck = obj.checkRemindInfo();
        if (remindCheck.result == false)//检验提醒输入栏
        {
            me.showErrorMsg(remindCheck.message);
            return false;
        }

        return true;

    }
    //保存
    PayPage.prototype.saveCalendar = function(xml) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            if (!me.checkCalendar()) {
                return;
            }
            $("#btnSave").attr("disabled", true);
            $("#pErrorMsg").hide();
            $.ajax({
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: {
                    sid: window.top.UserData.ssoSid,
                    actionId: 1,
                    seqno: id,
                    sendtype: 2,
                    xml: xml,
                    rnd: Math.random()
                },
                success: function (data) {
                    $("#btnSave").val("保存");
                    if (data.State == 0) {
                        if (data.ResultCode == "True") {
                            var UrlPage = "/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString() + "&rnd=" + Math.random();
                            if (Utils.queryString("comefrom") == "1") {
                                if (Utils.queryString("curDate"))
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate") + "&rnd=" + Math.random();
                                else
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?rnd=" + Math.random();
                            }
                            window.location.href = top.M139.Text.Url.getAbsoluteUrl(UrlPage);
                            return false;
                        }
                        else {
                            if (data.IsNeedValidImg == "True" && data.ValidImgUrl.length > 0)
                                obj.refreshValidImage(data.ValidImgUrl);
                            top.FloatingFrame.alert(data.ResultMsg);
                            $("#btnSave").attr("disabled", false);
                        }
                    }
                    else if (data.State == 2) {
                        $("#btnSave").attr("disabled", false);
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //保存
    $("#btnSave").click(function() {
        me.saveCalendar(me.getCalendar());
        return false;
    });

    var comefrom = Utils.queryString("comefrom");
    var gotopage = "calendar_view.html?1=1";
    if (Utils.queryString("curDate"))
        gotopage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate");
    $("#btnCancel").click(function() {
        if (comefrom && comefrom == 2) {
            gotopage = "/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString();
        }
        window.location.href = gotopage + "&rnd=" + Math.random();
        return false;
    });
};

function MatchPage() {
    var me = this;
    var smsLength = 200;
    var seqno = 0;
    var serverDate; //= new Date();
    var DateServer;
    var calendarData;
    var content = "";
    var calendartype = "10";
    var dateflag = "0";
    var enddateflag = "0";
    var starttime;
    var endtime;
    var recmysms = 0;
    var recmyemail = 0;
    var recmobile = "";
    var recemail = "";
    var datedesc = "";
    var beforetype = "";
    var beforetime = "";
    var validimg = "";
    var interval = "";
    var caltype = "";
    var textContent = calendarMessages.match_DefaultContent;
    var groupLength = 2;
    var isNeedImg = false;

    var groupid = "0";
    var appid = "";

    var listtype = 5;   //列表类 0所有,1约会,2交费...
    var paramlist = Utils.queryString("listtype");
    if (paramlist) {
        listtype = parseInt(paramlist);
    }

    top.WaitPannel.hide();
    $("#HiddCalValue").val("0");

    $(document).click(function() {
        $("#__calendarPanel").hide();
    });

    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        id = 0;
        $("#aTitle").text("添加赛事提醒");
    }
    else {
        $("#aTitle").text("编辑赛事提醒");
    }

    //时间选项初始化
    var htmlTime = "";
    for (var i = 0; i <= 23; i++) {
        htmlTime += "<option value=" + i + "00>" + i + "：00</option><option value=" + i + "30>" + i + "：30</option>";
    }
    $("#opGregStart").append(htmlTime);
    $("#opLunStart").append(htmlTime);


    ////文本框公历转农历
    this.lunar = function(beginDate) {
        var objApi = new richinfo.email.calendar.commonApi();
        $("#txtLunStart").val(objApi.getNLStrValueByDate(new Date(beginDate.replace("-", "/").replace("-", "/"))).returnNlStr);
    }
    ////初始化日期文本框
    this.initTextDate = function(beginDate) {
        var gregStart = document.getElementById("txtGregStart");
        var lunStart = document.getElementById("txtLunStart");
        gregStart.value = beginDate;
        gregStart.realDate = beginDate;
        lunStart.realDate = beginDate;
        me.lunar(beginDate);
    }

    //
    this.setDate = function(control) {
        me.lastControl = control;
        if ($("#HiddCalValue").val() == "1") {
            showMyCalendar(control, me.calendarCallbackFunc, { returnType: 1, date2StringPattern: 'yyyy-MM-dd' });
        }
        else {
            showMyCalendar(control, me.calendarCallbackFunc, { date2StringPattern: 'yyyy-MM-dd' });
        }
    }
    this.calendarCallbackFunc = function(e) {
        if (me.lastControl.id == "txtLunStart") {
            var gregStart = $("#txtGregStart")[0];
            gregStart.realDate = e.dateControl.realDate;
            $("#txtGregStart").val(e.dateControl.realDate);
        }
        else if (me.lastControl.id == "txtGregStart") {
            var lunStart = $("#txtLunStart")[0];
            lunStart.realDate = e.dateControl.realDate;
            $("#txtLunStart").val(e.dateControl.realDate);
        }
    }
    ////获取时间对应提示
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
    //公历/农历处理
    $("#txtGregStart").click(function() {
        me.setDate($("#txtGregStart")[0]);
        Utils.stopEvent();
    });
    $("#pGreg .drop:eq(0)").click(function() {
        me.setDate($("#txtGregStart")[0]);
        Utils.stopEvent();
    });
    $("#txtLunStart").click(function() {
        me.setDate($("#txtLunStart")[0]);
        Utils.stopEvent();
    });
    $("#pLun .drop:eq(0)").click(function() {
        me.setDate($("#txtLunStart")[0]);
        Utils.stopEvent();
    });
    $("#content").scroll(function() {
        resetCalendarTop();
    });
    //公历/农历标签选择    
    $(".seleteDate li").click(function() {
        $(".seleteDate li").removeClass("cur");
        $(this).addClass("cur");
        switch ($("li", ".seleteDate").index(this)) {
            case 0: //公历
                $("#HiddCalValue").val("0");
                $("#pLun").hide();
                $("#pGreg").show();
                var gregStart = document.getElementById("txtGregStart");
                gregStart.realDate = $("#txtLunStart").attr("realDate");

                $("#opGregStart").unbind("change");
                $("#opGregStart").attr("value", $("#opLunStart").val());
                break;
            case 1: //农历
                $("#HiddCalValue").val("1");
                $("#pLun").show();
                $("#pGreg").hide();
                var lunStart = document.getElementById("txtLunStart");
                lunStart.realDate = $("#txtGregStart").val();

                me.lunar($("#txtGregStart").val());
                $("#opLunStart").unbind("change");
                $("#opLunStart").attr("value", $("#opGregStart").val());
                break;
        }
    });
    this.getData = function() {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: { sid: top.UserData.ssoSid, actionId: 0, seqno: id, sendtype: listtype, rnd: Math.random() },
                success: function(data) {
                    if (data.State == 0) {
                        calendarData = data;
                        $("#txtContent").val(textContent);
                        $("#txtContent").blur();
                        $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                        $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                        groupLength = data.GroupLength;
                        serverDate = data.ServerTime;
                        DateServer = serverDate.split(" ")[0];

                        var dateSelectedStart = new Date();
                        var dateSelectedEnd = new Date();
                        if (id == 0) {
                            var startAndEndDateTime = getStartAndEndTime(String(serverDate)).startTime;
                            var hourminute = parseInt(startAndEndDateTime, 10);
                            if (hourminute == 2300) {
                                startAndEndDateTime = "000";
                            }
                            else if (hourminute == 2330) {
                                startAndEndDateTime = "030";
                            }
                            else {
                                startAndEndDateTime = hourminute + 100;
                            }
                            setTimeout(function() { $("#opGregStart").attr("value", startAndEndDateTime); $("#opLunStart").attr("value", $("#opGregStart").val()); }, 10);

                            me.initTextDate(serverDate.split(" ")[0], serverDate.split(" ")[0]);
                            obj.initData(1, 1, 1, 0, "", "", data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            var curHour = parseInt(serverDate.split(" ")[1].split(":")[0], 10);
                            dateSelectedStart.setHours(curHour + 1);
                            dateSelectedStart.setMinutes(0);
                            dateSelectedEnd.setHours(curHour + 2);
                            dateSelectedEnd.setMinutes(0);
                        }
                        else {
                            serverDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));

                            if (data.Content != null) {
                                $("#txtContent").removeClass("normal");
                                $("#txtContent").val(data.Content.replace(/[\s|\n]/g, ""));
                                me.isContentChange = true;
                            }
                            var hourStr = data.StartTime;
                            if (hourStr == "0")
                                hourStr = "000";
                            if (hourStr == "30")
                                hourStr = "030";
                            //大运会的编辑
                            var hourStr2 = hourStr.toString();
                            var minutevalue = hourStr2.toString().substring(hourStr2.length - 2, hourStr2.length);
                            if (listtype != 5) {
                                if (minutevalue != "00" && minutevalue != "30") {
                                    var hourvalue = hourStr2.substring(0, hourStr2.length - 2);
                                    var htmlotherTime = "<option value=" + hourvalue + minutevalue + " selected>" + hourvalue + "：" + minutevalue + "</option>";
                                    $("#opGregStart").append(htmlotherTime);
                                    $("#opLunStart").append(htmlotherTime);
                                }

                                groupid = data.GroupId;
                                appid = data.SpecialAppId;

                                $("#opGregStart").attr("disabled", "disabled");
                                $("#opLunStart").attr("disabled", "disabled");
                                $("#txtGregStart").attr("disabled", "disabled");
                                $("#pGreg .drop:eq(0)").unbind("click");
                                $("#txtLunStart").attr("disabled", "disabled");
                                $("#pLun .drop:eq(0)").unbind("click");
                            }

                            $("#opGregStart").attr("value", hourStr);
                            $("#opLunStart").attr("value", hourStr);
                            var startDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));
                            var startDay = startDate.getDate();
                            var startMonth = startDate.getMonth() + 1;
                            var startYear = startDate.getFullYear();
                            if (startDay < 10) { startDay = "0" + startDay; }
                            if (startMonth < 10) { startMonth = "0" + startMonth; }
                            startDate = startYear + "-" + startMonth + "-" + startDay;
                            me.initTextDate(startDate);
                            if (data.CalendarType == 20 || data.CalendarType == 21) {
                                $(".seleteDate li:eq(1)").click();
                            }

                            //(beforeType,beforeTime,recMySms,recMyEmail,recMobile,recEmail,freeCount,sendCount,fee,groupLength)
                            obj.initData(data.BeforeType, data.BeforeTime, data.RecMySms, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsNeedValidImg, data.ValidImgUrl);
                            dateSelectedStart.setHours(String(data.StartTime).substr(0, String(data.StartTime).length - 2));
                            dateSelectedStart.setMinutes(String(data.StartTime).substr(String(data.StartTime).length - 2, 2));
                            dateSelectedEnd.setHours(String(data.EndTime).substr(0, String(data.EndTime).length - 2));
                            dateSelectedEnd.setMinutes(String(data.EndTime).substr(String(data.EndTime).length - 2, 2));
                        }
                        obj.setEventTime(dateSelectedStart, dateSelectedEnd);
                        $("#helpCount").show();
                    }
                    else {
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //编辑或是添加日程
    MatchPage.prototype.getCalendar = function() {
        recmysms = 0;
        recmyemail = 0;
        recmobile = "";
        recemail = "";

        if ($.trim($("#txtContent").val()) == textContent && !me.isContentChange) {
            content = "";
        } else {
            content = $("#txtContent").val().trim();
        }

        var info = obj.getRemindInfo();
        beforetype = info.beforeType;
        beforetime = info.beforeTime;
        recmysms = info.recMySms;
        recmyemail = info.recMyEmail;
        recmobile = info.recMobile;
        recemail = info.recEmail;

        validimg = $("#txtValidate").val().trim();
        me.sendSmsStartTime = 0;
        me.sendSmsEndTime = 2359;
        calendartype = "10";
        if ($("#HiddCalValue").val() == "1") {
            var LunStartDate = $("#txtLunStart").val();
            startDescStr = LunStartDate + me.getTimeShow($("#opLunStart :selected").text());
            datedesc = "农历" + startDescStr;
            calendartype = "20";
            starttime = $("#opLunStart").val();
            endtime = starttime;
        }
        else {
            var gregStarDateArray = $("#txtGregStart").val().split("-");
            startDescStr = gregStarDateArray[0] + "年" + parseInt(gregStarDateArray[1], 10) + "月" + parseInt(gregStarDateArray[2], 10) + "日" + me.getTimeShow($("#opGregStart :selected").text());
            datedesc = startDescStr;
            starttime = $("#opGregStart").val();
            endtime = starttime;
        }
        interval = "0";
        begin = $("#txtGregStart").val().split("-");
        dateflag = begin[0] + begin[1] + begin[2];
        enddateflag = dateflag;

        var dateSelectedStart = new Date();
        dateSelectedStart.setHours(String(starttime).substr(0, String(starttime).length - 2));
        dateSelectedStart.setMinutes(String(starttime).substr(String(starttime).length - 2, 2));

        var dateSelectedEnd = new Date();
        dateSelectedEnd.setHours(String(endtime).substr(0, String(endtime).length - 2));
        dateSelectedEnd.setMinutes(String(endtime).substr(String(endtime).length - 2, 2));

        obj.setEventTime(dateSelectedStart, dateSelectedEnd)

        return String.format(specialTempXmlString, appid, top.encodeXML(content), groupid, calendartype, interval, dateflag, enddateflag, starttime, endtime, recmysms, recmyemail, recmobile, top.encodeXML(recemail), top.encodeXML(datedesc), beforetype, beforetime, top.encodeXML(validimg), "0", "", "0", "", "", "");
    }
    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }
    //日程验证
    MatchPage.prototype.checkCalendar = function() {
        if (content == null || content == "") {
            me.showErrorMsg(calendarMessages.match_ContentEmpty);
            $("#txtContent").addClass("err").focus();
            return false;
        }
        if (content.length > smsLength) {
            me.showErrorMsg(String.format(calendarMessages.match_ContentTooLong, smsLength));
            $("#txtContent").addClass("err").focus();
            return false;
        }

        var remindCheck = obj.checkRemindInfo();
        if (remindCheck.result == false)//检验提醒输入栏
        {
            me.showErrorMsg(remindCheck.message);
            return false;
        }
        return true;
    }

    //保存
    MatchPage.prototype.saveCalendar = function(xml) {
        if (!me.checkCalendar()) {
            return;
        }
        var arrdatesvr = DateServer.split(" ")[0].split("-");
        var tempdatesvr = arrdatesvr[0] + arrdatesvr[1] + arrdatesvr[2];
        var arrdatestart = $("#txtGregStart").val().split("-");
        var tempdateflag = arrdatestart[0] + arrdatestart[1] + arrdatestart[2];
        if ((recmysms == 1 || recmyemail == 1 || recmobile.length > 0 || recemail.length > 0) && tempdatesvr > tempdateflag) {
            top.FloatingFrame.confirm(calendarMessages.confirmNotSendSMS, function() {
                me.saveMatch(xml);
            });
        }
        else {
            me.saveMatch(xml);
        }
    }

    this.saveMatch = function(xml) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            $("#btnSave").attr("disabled", true);
            $("#pErrorMsg").hide();
            $.ajax({
                dataType:"json",
                url: "/g2/calendar/Special/SpecialEdit.ashx",
                data: {
                    sid: window.top.UserData.ssoSid,
                    actionId: 1,
                    seqno: id,
                    sendtype: listtype,
                    xml: xml,
                    rnd: Math.random()
                },
                success: function (data) {
                    $("#btnSave").val("保存");
                    if (data.State == 0) {
                        if (data.ResultCode == "True") {
                            var UrlPage = "/m2012/html/calendar/calendar_list.html?listtype=5&rnd=" + Math.random();
                            if (Utils.queryString("comefrom") == "1") {
                                if (Utils.queryString("curDate"))
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate") + "&rnd=" + Math.random();
                                else
                                    UrlPage = "/m2012/html/calendar/calendar_view.html?rnd=" + Math.random();
                            }
                            window.location.href = top.M139.Text.Url.getAbsoluteUrl(UrlPage);
                            return false;
                        }
                        else {
                            if (data.IsNeedValidImg == "True" && data.ValidImgUrl.length > 0)
                                obj.refreshValidImage(data.ValidImgUrl);
                            top.FloatingFrame.alert(data.ResultMsg);
                            $("#btnSave").attr("disabled", false);
                        }
                    }
                    else if (data.State == 2) {
                        $("#btnSave").attr("disabled", false);
                        Utils.showTimeoutDialog();
                    }
                }
            });
        }
    }

    //保存
    $("#btnSave").click(function() {
        me.saveCalendar(me.getCalendar());
        return false;
    });

    var comefrom = Utils.queryString("comefrom");
    var gotopage = "calendar_view.html?1=1";
    if (Utils.queryString("curDate"))
        gotopage = "calendar_view.html?curDate=" + Utils.queryString("curDate");
    $("#btnCancel").click(function() {
        if (comefrom && comefrom == 2) {
            gotopage = "/m2012/html/calendar/calendar_list.html?listtype=" + listtype.toString();
        }
        window.location.href = gotopage + "&rnd=" + Math.random();
        return false;
    });

    $("#txtContent").focus(function() {
        if ($.trim($(this).val()) == textContent && !me.isContentChange) {
            $(this).val("");
            $(this).removeClass("normal");
        }
    }).blur(function() {
        if ($.trim($(this).val()).length == 0) {
            $(this).val(textContent);
            $(this).addClass("normal");
            me.isContentChange = false;
        }
    });
    $("#txtContent").change(function() {
        me.isContentChange = true;
    });
};

function CommonPage() {
    var me = this;
    var validateUrl;
    var smsLength = 70;


    CommonPage.prototype.getUrlPath = function() {
        var url = window.location.toString();
        if (url && (url.indexOf("?") != -1)) {
            url = url.substring(0, url.indexOf("?"));
        }
        var tmp;
        if (url && url.lastIndexOf("/")) {
            tmp = url.substring(0, url.lastIndexOf("/"));
        }
        return tmp;
    }

};

richinfo.email.calendar.commonUI = richinfo.email.calendar.commonUI ? richinfo.email.calendar.commonUI : {}
richinfo.email.calendar.commonUI.lunarBox = richinfo.email.calendar.commonUI.lunarBox ? richinfo.email.calendar.commonUI.lunarBox : {}

richinfo.email.calendar.commonUI.lunarBox = function(container_id, type) {
    var me = this;
    me.container_id = "#" + container_id;
    me.reChangeGregEnd = true;
    me.reChangeLunEnd = true;
    me.type = (typeof (type) == "undefined") ? 0 : parseInt(type, 10);
    this.$ = function(obj) {
        return $(me.container_id + " " + obj);
    }
    //页面html
    this.drawHTML = function() {
        //div初始化
        var htmlArray = [];
        htmlArray.push('<div class="seleteDate">');
        htmlArray.push('<ul><li class="cur" id="liGreg">公 历</li><li id="liLun">农 历</li></ul>');
        htmlArray.push('<p id="pGreg">');
        htmlArray.push('<span class="date"><input  id="txtGregStart" readonly/><i class="drop"></i></span>');
        htmlArray.push('<select id="opGregMonthStart" style="display:none"></select>');
        htmlArray.push('<select id="opGregDayStart" style="display:none"></select>');
        htmlArray.push('<select id="opGregStart" style="width:67px;"></select>');
        htmlArray.push('<label id="lblGreg"> 到 </label>');
        htmlArray.push('<span class="date"><input id="txtGregEnd" readonly/><i class="drop"></i></span>');
        htmlArray.push('<select id="opGregMonthEnd" style="display:none"></select>');
        htmlArray.push('<select id="opGregDayEnd" style="display:none"></select>');
        htmlArray.push('<select id="opGregEnd" style="width:67px;"></select>');
        htmlArray.push('</p>');
        htmlArray.push('<p id="pLun" style="display:none" class="lunar">');
        htmlArray.push('<span class="date"><input  id="txtLunStart" style="width:113px" readonly/><i class="drop"></i></span>');
        htmlArray.push('<select id="opLunMonthStart" style="display:none"></select>');
        htmlArray.push('<select id="opLunDayStart" style="display:none"></select>');
        htmlArray.push('<select id="opLunStart" style="width:67px;"></select>');
        htmlArray.push('<label id="lblLun"> 到 </label>');
        htmlArray.push('<span class="date"><input id="txtLunEnd" style="width:113px" readonly/><i class="drop"></i></span>');
        htmlArray.push('<select id="opLunMonthEnd" style="display:none"></select>');
        htmlArray.push('<select id="opLunDayEnd" style="display:none"></select>');
        htmlArray.push('<select id="opLunEnd" style="width:67px;"></select>');
        htmlArray.push('</p>');
        htmlArray.push('</div>');
        htmlArray.push('<table cellpadding="0" cellspacing="0">');
        htmlArray.push('<tr id="liAllDay">');
        htmlArray.push('<th>全天事件</th>');
        htmlArray.push('<td><input id="chkallday" type="checkbox">（持续一整天的事项，下发提醒时间以当天上午8点为基准）</td>');
        htmlArray.push('</tr>');
        htmlArray.push('<tr>');
        htmlArray.push('<th>重复事件</th>');
        htmlArray.push('<td>');
        htmlArray.push('<p><select id="slRept"><option value="0">不重复</option><option value="3">每天</option><option value="4">每周</option><option value="5">每月</option><option value="6">每年</option></select><label class="rtime" id="lshowTip" style="display:none"></label></p>');
        htmlArray.push('<p id="pDay" style="display:none">');
        htmlArray.push('<span><input type="checkbox" name="week" id="mon" value="一"><label for="mon">一</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="tue" value="二"><label for="tue">二</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="wed" value="三"><label for="wed">三</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="thu" value="四"><label for="thu">四</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="fri" value="五"><label for="fri">五</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="sat" value="六"><label for="sat">六</label></span>');
        htmlArray.push('<span><input type="checkbox" name="week" id="sun" value="日"><label for="sun">日</label></span>');
        htmlArray.push('</p>');
        htmlArray.push('</td>');
        htmlArray.push('</tr>');
        htmlArray.push('</table>');
        $(me.container_id).html(htmlArray.join(""));
        //时间选项初始化
        var htmlTime = "";
        for (var i = 0; i <= 23; i++) {
            htmlTime += "<option value=" + i + "00>" + i + "：00</option><option value=" + i + "30>" + i + "：30</option>";
        }
        $("#opGregStart").append(htmlTime);
        $("#opGregEnd").append(htmlTime);
        $("#opLunStart").append(htmlTime);
        $("#opLunEnd").append(htmlTime);
        //日期选项初始化
        var htmlGregDay = ""; //公历
        $("#opGregDayStart").empty();
        $("#opGregDayEnd").empty();
        for (var i = 1; i <= 31; i++) {
            var k = "01";
            k = i;
            if (i < 10) {
                k = "0" + i;
            }
            htmlGregDay += "<option value=" + k + ">" + i + "日</option>";
        }
        $("#opGregDayStart").append(htmlGregDay);
        $("#opGregDayEnd").append(htmlGregDay);

        var htmlLunDay = ""; //农历
        $("#opLunDayStart").empty();
        $("#opLunDayEnd").empty();
        for (var i = 1; i <= 30; i++) {
            var lunshow = "";
            switch (i) {
                case 1:
                    lunshow = "初一";
                    break;
                case 2:
                    lunshow = "初二";
                    break;
                case 3:
                    lunshow = "初三";
                    break;
                case 4:
                    lunshow = "初四";
                    break;
                case 5:
                    lunshow = "初五";
                    break;
                case 6:
                    lunshow = "初六";
                    break;
                case 7:
                    lunshow = "初七";
                    break;
                case 8:
                    lunshow = "初八";
                    break;
                case 9:
                    lunshow = "初九";
                    break;
                case 10:
                    lunshow = "初十";
                    break;
                case 11:
                    lunshow = "十一";
                    break;
                case 12:
                    lunshow = "十二";
                    break;
                case 13:
                    lunshow = "十三";
                    break;
                case 14:
                    lunshow = "十四";
                    break;
                case 15:
                    lunshow = "十五";
                    break;
                case 16:
                    lunshow = "十六";
                    break;
                case 17:
                    lunshow = "十七";
                    break;
                case 18:
                    lunshow = "十八";
                    break;
                case 19:
                    lunshow = "十九";
                    break;
                case 20:
                    lunshow = "二十";
                    break;
                case 21:
                    lunshow = "廿一";
                    break;
                case 22:
                    lunshow = "廿二";
                    break;
                case 23:
                    lunshow = "廿三";
                    break;
                case 24:
                    lunshow = "廿四";
                    break;
                case 25:
                    lunshow = "廿五";
                    break;
                case 26:
                    lunshow = "廿六";
                    break;
                case 27:
                    lunshow = "廿七";
                    break;
                case 28:
                    lunshow = "廿八";
                    break;
                case 29:
                    lunshow = "廿九";
                    break;
                case 30:
                    lunshow = "三十";
                    break;
            }
            var k = "01";
            k = i;
            if (i < 10) {
                k = "0" + i;
            }
            htmlLunDay += "<option value=" + k + ">" + lunshow + "</option>";
        }
        $("#opLunDayStart").append(htmlLunDay);
        $("#opLunDayEnd").append(htmlLunDay);
        //月份选项初始化        
        var htmlGregMonth = ""; //公历
        for (var i = 1; i <= 12; i++) {
            var k = "01";
            k = i;
            if (i < 10) {
                k = "0" + i;
            }
            htmlGregMonth += "<option value=" + k + ">" + i + "月</option>";
        }
        $("#opGregMonthStart").append(htmlGregMonth);
        $("#opGregMonthEnd").append(htmlGregMonth);

        var htmlLunMonth = ""; //农历
        for (var i = 1; i <= 12; i++) {
            switch (i) {
                case 1:
                    lunshow = "一";
                    break;
                case 2:
                    lunshow = "二";
                    break;
                case 3:
                    lunshow = "三";
                    break;
                case 4:
                    lunshow = "四";
                    break;
                case 5:
                    lunshow = "五";
                    break;
                case 6:
                    lunshow = "六";
                    break;
                case 7:
                    lunshow = "七";
                    break;
                case 8:
                    lunshow = "八";
                    break;
                case 9:
                    lunshow = "九";
                    break;
                case 10:
                    lunshow = "十";
                    break;
                case 11:
                    lunshow = "十一";
                    break;
                case 12:
                    lunshow = "十二";
                    break;
            }
            var k = "01";
            k = i;
            if (i < 10) {
                k = "0" + i;
            }
            htmlLunMonth += "<option value=" + k + ">" + lunshow + "月</option>";
        }
        $("#opLunMonthStart").append(htmlLunMonth);
        $("#opLunMonthEnd").append(htmlLunMonth);
    }
    //公用方法    
    ////日下拉列表显示隐藏
    this.setDayControl = function(show) {
        if (show) {
            if ($("#HiddCalValue").val() == "1") {
                $("#opLunDayStart").show();
                $("#opLunDayEnd").show();
                $("#pGreg").hide();
                $("#pLun").show();
            } else {
                $("#opGregDayStart").show();
                $("#opGregDayEnd").show();
                $("#pGreg").show();
                $("#pLun").hide();
            }
        } else {
            if ($("#HiddCalValue").val() == "1") {
                $("#opLunDayStart").hide();
                $("#opLunDayEnd").hide();
                $("#pGreg").hide();
                $("#pLun").show();
            } else {
                $("#opGregDayStart").hide();
                $("#opGregDayEnd").hide();
                $("#pGreg").show();
                $("#pLun").hide();
            }
        }
        if ($("#slRept").val() == "0" || $("#slRept").val() == "5" || $("#slRept").val() == "6") {
            $("#lblGreg").show();
            $("#lblLun").show();
        }
        if ($("#chkallday").attr("checked") == true && ($("#slRept").val() == "3" || $("#slRept").val() == "4")) {
            $("#pGreg").hide();
            $("#pLun").hide();
        }
    }
    ////月下拉列表显示隐藏
    this.setMonthControl = function(show) {
        if (show) {
            if ($("#HiddCalValue").val() != "1") {
                $("#opGregMonthStart").show();
                $("#opGregMonthEnd").show();
            } else {
                $("#opLunMonthStart").show();
                $("#opLunMonthEnd").show();
            }
        } else {
            if ($("#HiddCalValue").val() != "1") {
                $("#opGregMonthStart").hide();
                $("#opGregMonthEnd").hide();
            } else {
                $("#opLunMonthStart").hide();
                $("#opLunMonthEnd").hide();
            }
        }
    }
    ////日期控件显示隐藏
    this.setDateControl = function(show) {
        if (show) {
            $("#pGreg .date").each(function() {
                $(this).show();
            });
            $("#pLun .date").each(function() {
                $(this).show();
            });
        } else {
            $("#pGreg .date").each(function() {
                $(this).hide();
            });
            $("#pLun .date").each(function() {
                $(this).hide();
            });
        }
    }
    ////时间控件显示隐藏
    this.setHourControl = function(show) {
        if (show) {
            $("#opGregStart").show();
            $("#opGregEnd").show();
            $("#opLunStart").show();
            $("#opLunEnd").show();
            $("#lblGreg").show();
            $("#lblLun").show();
            if ($("#HiddCalValue").val() == "1") {
                $("#pGreg").hide();
                $("#pLun").show();
            }
            else {
                $("#pGreg").show();
                $("#pLun").hide();
            }
        } else {
            $("#opGregStart").hide();
            $("#opGregEnd").hide();
            $("#opLunStart").hide();
            $("#opLunEnd").hide();
            if (!($("#slRept").val() == "0" || $("#slRept").val() == "5" || $("#slRept").val() == "6")) {
                $("#lblGreg").hide();
                $("#lblLun").hide();
                $("#pGreg").hide();
                $("#pLun").hide();
            }
            var startday = "";
            var endday = "";
            if ($("#HiddCalValue").val() == "1") {
                startday = new Date($("#txtLunStart").attr("realDate").replace(/\-/g, "/"));
                endday = new Date($("#txtLunEnd").attr("realDate").replace(/\-/g, "/"));
                if (startday > endday) {
                    $("#txtLunEnd").val($("#txtLunStart").val()).attr("realDate", $("#txtLunStart").val());
                }
            }
            else {
                startday = new Date($("#txtGregStart").val().replace(/\-/g, "/"));
                endday = new Date($("#txtGregEnd").val().replace(/\-/g, "/"));
                if (startday > endday) {
                    $("#txtGregEnd").val($("#txtGregStart").val()).attr("realDate", $("#txtGregStart").val());
                }
            }
        }
    }
    //
    this.setDate = function(control) {
        me.lastControl = control;
        if ($("#HiddCalValue").val() == "1") {
            showMyCalendar(control, me.calendarCallbackFunc, { returnType: 1, date2StringPattern: 'yyyy-MM-dd' });
        }
        else {
            showMyCalendar(control, me.calendarCallbackFunc, { date2StringPattern: 'yyyy-MM-dd' });
        }
        resetCalendarTop();
    }
    this.calendarCallbackFunc = function(e) {
        var flag = 0; //0表示以开始时间为准,1表示以结束时间为准
        if (me.lastControl.id == "txtLunStart") {
            var gregStart = $("#txtGregStart")[0];
            gregStart.realDate = e.dateControl.realDate;
            $("#txtGregStart").val(e.dateControl.realDate);
        }
        else if (me.lastControl.id == "txtLunEnd") {
            var gregEnd = $("#txtGregEnd")[0];
            gregEnd.realDate = e.dateControl.realDate;
            $("#txtGregEnd").val(e.dateControl.realDate);
            me.reChangeLunEnd = false;
            flag = 1;
        }
        else if (me.lastControl.id == "txtGregStart") {
            var lunStart = $("#txtLunStart")[0];
            lunStart.realDate = e.dateControl.realDate;
            $("#txtLunStart").val(e.dateControl.realDate);
        }
        else if (me.lastControl.id == "txtGregEnd") {
            var lunEnd = $("#txtLunEnd")[0];
            lunEnd.realDate = e.dateControl.realDate;
            $("#txtLunEnd").val(e.dateControl.realDate);
            me.reChangeGregEnd = false;
            flag = 1;
        }
        var startDate = new Date($("#txtGregStart").val().replace(/\-/g, "/"));
        var endDate = new Date($("#txtGregEnd").attr("realDate").replace(/\-/g, "/"));
        var objApi = new richinfo.email.calendar.commonApi();
        if (flag == 0) {
            if (startDate > endDate) {
                $("#txtGregEnd").val($("#txtGregStart").val()).attr("realDate", $("#txtGregStart").val());
                $("#txtLunEnd").val(objApi.getNLStrValueByDate(startDate).returnNlStr).attr("realDate", $("#txtGregStart").val());
            }
        }
        else {
            if (startDate > endDate) {
                $("#txtGregStart").val($("#txtGregEnd").val()).attr("realDate", $("#txtGregEnd").val());
                $("#txtLunStart").val(objApi.getNLStrValueByDate(endDate).returnNlStr).attr("realDate", $("#txtGregEnd").val());
            }
        }
    }
    ////获取周
    this.getWeekShow = function() {
        var week = "";
        $("#pDay input[type=checkbox]").each(function() {
            if ($(this).attr("checked") == true) {
                if (week.length == 0) {
                    week = $(this).val();
                } else {
                    week += "、" + $(this).val();
                }
            }
        });
        return week;
    }
    ////获取时间对应提示
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
    ////根据设置的日期，时间显示时间提示
    ////caltype 0:公历 1:农历
    this.showTimeTip = function() {
        var caltype = $("#HiddCalValue").val();
        var rptype = $("#slRept").val();
        showtip = "";
        var startDateDesc = "";
        var endDateDesc = "";
        $("#lblGreg").show();
        $("#lblLun").show();
        switch (rptype) {
            case "3": //每天
                if ($("#chkallday").attr("checked") == true) {
                    $("#lblGreg").hide();
                    $("#lblLun").hide();
                    showtip = $("#slRept :selected").text();
                }
                else {
                    if (caltype == "0") {
                        startDateDesc = me.getTimeShow($("#opGregStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opGregEnd :selected").text());
                    } else if (caltype == "1") {
                        startDateDesc = me.getTimeShow($("#opLunStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opLunEnd :selected").text());
                    }
                    if (startDateDesc == endDateDesc)
                        showtip = $("#slRept :selected").text() + startDateDesc;
                    else
                        showtip = $("#slRept :selected").text() + startDateDesc + "到" + endDateDesc;
                }
                break;
            case "4": //每周
                var week = me.getWeekShow();
                if (week.length == 0) {
                    if ($("#chkallday").attr("checked") == true) {
                        $("#lblGreg").hide();
                        $("#lblLun").hide();
                    }
                    $("#lshowTip").hide();
                } else {
                    if ($("#chkallday").attr("checked") == true) {
                        $("#lblGreg").hide();
                        $("#lblLun").hide();
                        showtip = $("#slRept :selected").text() + me.getWeekShow();
                    }
                    else {
                        if (caltype == "0") {
                            startDateDesc = me.getTimeShow($("#opGregStart :selected").text());
                            endDateDesc = me.getTimeShow($("#opGregEnd :selected").text());
                        } else if (caltype == "1") {
                            startDateDesc = me.getTimeShow($("#opLunStart :selected").text());
                            endDateDesc = me.getTimeShow($("#opLunEnd :selected").text());
                        }
                        if (startDateDesc == endDateDesc)
                            showtip = $("#slRept :selected").text() + me.getWeekShow() + startDateDesc;
                        else
                            showtip = $("#slRept :selected").text() + me.getWeekShow() + startDateDesc + "到" + endDateDesc;
                    }

                    $("#lshowTip").show();
                }
                break;
            case "5": //每月
                var startDayDesc = "";
                var endDayDesc = "";
                if ($("#chkallday").attr("checked") == true) {
                    if (caltype == "0") {
                        startDayDesc = $("#opGregDayStart :selected").text();
                        endDayDesc = $("#opGregDayEnd :selected").text();
                        if (startDayDesc == endDayDesc) {
                            showtip = $("#slRept :selected").text() + startDayDesc;
                        }
                        else {
                            showtip = $("#slRept :selected").text() + startDayDesc + "到" + endDayDesc;
                        }
                    } else if (caltype == "1") {
                        startDayDesc = $("#opLunDayStart :selected").text();
                        endDayDesc = $("#opLunDayEnd :selected").text();
                        if (startDayDesc == endDayDesc) {
                            showtip = "农历" + $("#slRept :selected").text() + startDayDesc;
                        }
                        else {
                            showtip = "农历" + $("#slRept :selected").text() + startDayDesc + "到" + endDayDesc;
                        }
                    }
                }
                else {
                    if (caltype == "0") {
                        startDayDesc = $("#opGregDayStart :selected").text();
                        endDayDesc = $("#opGregDayEnd :selected").text();
                        startDateDesc = me.getTimeShow($("#opGregStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opGregEnd :selected").text());
                        if (startDayDesc == endDayDesc && startDateDesc == endDateDesc) {
                            showtip = $("#slRept :selected").text() + startDayDesc + startDateDesc;
                        }
                        else
                            showtip = $("#slRept :selected").text() + startDayDesc + startDateDesc + "到" + endDayDesc + endDateDesc;
                    } else if (caltype == "1") {
                        startDayDesc = $("#opLunDayStart :selected").text();
                        endDayDesc = $("#opLunDayEnd :selected").text();
                        startDateDesc = me.getTimeShow($("#opLunStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opLunEnd :selected").text());
                        if (startDayDesc == endDayDesc && startDateDesc == endDateDesc)
                            showtip = "农历" + $("#slRept :selected").text() + startDayDesc + startDateDesc;
                        else
                            showtip = "农历" + $("#slRept :selected").text() + startDayDesc + startDateDesc + "到" + endDayDesc + endDateDesc;
                    }
                }
                $("#lshowTip").show();
                break;
            case "6": //每年
                var startMonthDesc = "";
                var endMonthDesc = "";
                if ($("#chkallday").attr("checked") == true) {
                    if (caltype == "0") {
                        startMonthDesc = $("#opGregMonthStart :selected").text() + $("#opGregDayStart :selected").text();
                        endMonthDesc = $("#opGregMonthEnd :selected").text() + $("#opGregDayEnd :selected").text();
                        if (startMonthDesc == endMonthDesc) {
                            showtip = $("#slRept :selected").text() + startMonthDesc;
                        }
                        else {
                            showtip = $("#slRept :selected").text() + startMonthDesc + "到" + endMonthDesc;
                        }
                    } else if (caltype == "1") {
                        startMonthDesc = $("#opLunMonthStart :selected").text() + $("#opLunDayStart :selected").text();
                        endMonthDesc = $("#opLunMonthEnd :selected").text() + $("#opLunDayEnd :selected").text();
                        if (startMonthDesc == endMonthDesc) {
                            showtip = "农历" + $("#slRept :selected").text() + startMonthDesc;
                        }
                        else {
                            showtip = "农历" + $("#slRept :selected").text() + startMonthDesc + "到" + endMonthDesc;
                        }
                    }
                }
                else {
                    if (caltype == "0") {
                        startMonthDesc = $("#opGregMonthStart :selected").text() + $("#opGregDayStart :selected").text();
                        endMonthDesc = $("#opGregMonthEnd :selected").text() + $("#opGregDayEnd :selected").text();
                        startDateDesc = me.getTimeShow($("#opGregStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opGregEnd :selected").text());
                        if (startMonthDesc == endMonthDesc && startDateDesc == endDateDesc)
                            showtip = $("#slRept :selected").text() + startMonthDesc + startDateDesc;
                        else
                            showtip = $("#slRept :selected").text() + startMonthDesc + startDateDesc + "到" + endMonthDesc + endDateDesc;
                    } else if (caltype == "1") {
                        startMonthDesc = $("#opLunMonthStart :selected").text() + $("#opLunDayStart :selected").text();
                        endMonthDesc = $("#opLunMonthEnd :selected").text() + $("#opLunDayEnd :selected").text();
                        startDateDesc = me.getTimeShow($("#opLunStart :selected").text());
                        endDateDesc = me.getTimeShow($("#opLunEnd :selected").text());
                        if (startMonthDesc == endMonthDesc && startDateDesc == endDateDesc)
                            showtip = "农历" + $("#slRept :selected").text() + startMonthDesc + startDateDesc;
                        else
                            showtip = "农历" + $("#slRept :selected").text() + startMonthDesc + startDateDesc + "到" + endMonthDesc + endDateDesc;
                    }
                }
                $("#lshowTip").show();
                break;
        }
        $("#lshowTip").html(showtip);
    }
    ////日/月等控件显示隐藏
    this.InitControlShowHide = function(eventType) {
        switch (eventType) {
            case 0:
                $("#pDay").hide();
                $("#lshowTip").hide();
                me.setDayControl(false);
                me.setDateControl(true);
                me.setMonthControl(false);
                break;
            case 3:
                $("#pDay").hide();
                $("#lshowTip").show();
                me.setDateControl(false);
                me.setDayControl(false);
                me.setMonthControl(false);
                me.showTimeTip();
                break;
            case 4:
                $("#pDay").show();
                $("#lshowTip").hide();
                me.setDateControl(false);
                me.setDayControl(false);
                me.setMonthControl(false);
                me.showTimeTip();
                break;
            case 5:
                $("#pDay").hide();
                me.setDateControl(false);
                me.setMonthControl(false);
                me.setDayControl(true);
                me.showTimeTip();
                break;
            case 6: //每年
                $("#pDay").hide();
                me.setDateControl(false);
                me.setMonthControl(true);
                me.setDayControl(true);
                me.showTimeTip();
                this.monthChange($("#opGregMonthStart")[0]);
                this.monthChange($("#opGregMonthEnd")[0]);
                this.monthChange($("#opLunMonthStart")[0]);
                this.monthChange($("#opLunMonthEnd")[0]);
                break;
        }
    }
    ////公历转农历或是农历转公历处理
    this.transform = function(type) {
        var eventSelect = parseInt($("#slRept ").val());
        me.InitControlShowHide(eventSelect);
        if (eventSelect == 5)//每月
        {
            $("#pDay").hide();
            me.setDateControl(false);
            me.setMonthControl(false);
            me.setDayControl(true);
            me.showTimeTip();
            if (type == 1) {
                if (parseInt($("#opGregDayStart").val()) == 31) {
                    $("#opLunDayStart").attr("value", "30");
                } else {
                    $("#opLunDayStart").attr("value", $("#opGregDayStart").val());
                }
                if (parseInt($("#opGregDayEnd").val()) == 31) {
                    $("#opLunDayEnd").attr("value", "30");
                } else {
                    $("#opLunDayEnd").attr("value", $("#opGregDayEnd").val());
                }
            } else {
                $("#opGregDayStart").attr("value", $("#opLunDayStart").val());
                $("#opGregDayEnd").attr("value", $("#opLunDayEnd").val());
            }
        }
        if (eventSelect == 6)//每年
        {
            $("#pDay").hide();
            me.setMonthControl(true);
            me.setDayControl(true);
            me.showTimeTip();
            if (type == 1) {
                if (parseInt($("#opGregDayStart").val()) == 31) {
                    $("#opLunDayStart").attr("value", "30");
                } else {
                    $("#opLunDayStart").attr("value", $("#opGregDayStart").val());
                }
                if (parseInt($("#opGregDayEnd").val()) == 31) {
                    $("#opLunDayEnd").attr("value", "30");
                } else {
                    $("#opLunDayEnd").attr("value", $("#opGregDayEnd").val());
                }
            } else {
                $("#opGregDayStart").attr("value", $("#opLunDayStart").val());
                $("#opGregDayEnd").attr("value", $("#opLunDayEnd").val());
                $("#opGregMonthStart").attr("value", $("#opLunMonthStart").val());
                $("#opGregMonthEnd").attr("value", $("#opLunMonthEnd").val());
            }
        }
    }
    this.gregStartChange = function() {
        if ($("#chkallday").attr("checked") != "true") {
            $("#opLunStart").attr("value", $("#opGregStart").val());
            var m = $("#opGregStart").val().substr($("#opGregStart").val().length - 2, 2);
            var h = $("#opGregStart").val().substr(0, $("#opGregStart").val().length - 2);
            var startTime = new Date($("#txtGregStart").val().replace(/\-/g, "/")).DateAdd("h", h).DateAdd("n", m);
            var endTime = startTime.DateAdd("h", 1);
            var endDateString = endTime.format("yyyy-MM-dd");
            var mi = endTime.getMinutes();
            if (mi == 0) {
                $("#opGregEnd").attr("value", String(endTime.getHours()) + "00");
            }
            else {
                $("#opGregEnd").attr("value", String(endTime.getHours()) + "30");
            }
            if (me.reChangeGregEnd == true) {
                $("#txtGregEnd").val(endDateString).attr("realDate", endDateString);
                $("#txtLunEnd").val(endDateString).attr("realDate", endDateString);
            }
            $("#opLunEnd").attr("value", $("#opGregEnd").val());
            me.showTimeTip();
        }
    }
    this.lunStartChange = function() {
        if ($("#chkallday").attr("checked") != "true") {
            $("#opGregStart").attr("value", $("#opLunStart").val());
            var m = $("#opLunStart").val().substr($("#opLunStart").val().length - 2, 2);
            var h = $("#opLunStart").val().substr(0, $("#opLunStart").val().length - 2);
            var endTime = new Date($("#txtLunStart").attr("realDate").replace(/\-/g, "/")).DateAdd("h", h).DateAdd("n", m).DateAdd("h", 1);
            var endDateString = endTime.format("yyyy-MM-dd");
            var mi = endTime.getMinutes();
            if (mi == 0) {
                $("#opLunEnd").attr("value", String(endTime.getHours()) + "00");
            }
            else {
                $("#opLunEnd").attr("value", String(endTime.getHours()) + "30");
            }
            if (me.reChangeLunEnd == true) {
                var objApi = new richinfo.email.calendar.commonApi();
                $("#txtGregEnd").val(endDateString).attr("realDate", endDateString);
                $("#txtLunEnd").val(objApi.getNLStrValueByDate(endTime).returnNlStr).attr("realDate", endDateString);
            }
            $("#opGregEnd").attr("value", $("#opLunEnd").val());
            me.showTimeTip();
        }
    }
    ////选择月，日下拉列表联动
    this.monthChange = function(control) {
        //me.initDayDropList();
        var selectValue = $(control).val();
        var dayType = 0;
        //var selectDayValue = serverDate.split(" ")[0].split("-")[2];
        if (selectValue == "01" || selectValue == "03" || selectValue == "05" || selectValue == "07" || selectValue == "08" || selectValue == "10" || selectValue == "12") {
            dayType = 0;
        }
        if (selectValue == "04" || selectValue == "06" || selectValue == "09" || selectValue == "11") {
            dayType = 1
        }
        if (selectValue == "02") {
            dayType = 2;
        }
        var controlId = control.id;
        switch (controlId) {
            case "opGregMonthStart": case "opLunMonthStart":
                var gregDayStart = $("#opGregDayStart").val();
                //先移除，以免重复添加
                $("#opGregDayStart option[value='29']").remove();
                $("#opGregDayStart option[value='30']").remove();
                $("#opGregDayStart option[value='31']").remove();
                $("<option value='29'>29日</option>").appendTo("#opGregDayStart");
                if (dayType != 2) {
                    $("<option value='30'>30日</option>").appendTo("#opGregDayStart");
                    if (dayType != 1) {
                        $("<option value='31'>31日</option>").appendTo("#opGregDayStart");
                    }
                }
                $("#opGregDayStart").attr("value", gregDayStart);

                var lunDayStart = $("#opLunDayStart").val();
                $("#opLunDayStart option[value='30']").remove();
                if (dayType == 0) {
                    $("<option value='30'>三十</option>").appendTo("#opLunDayStart");
                }
                $("#opLunDayStart").attr("value", lunDayStart);
                break;
            case "opGregMonthEnd": case "opLunMonthEnd":
                var gregDayEnd = $("#opGregDayEnd").val();
                $("#opGregDayEnd option[value='29']").remove();
                $("#opGregDayEnd option[value='30']").remove();
                $("#opGregDayEnd option[value='31']").remove();
                $("<option value='29'>29日</option>").appendTo("#opGregDayEnd");
                if (dayType != 2) {
                    $("<option value='30'>30日</option>").appendTo("#opGregDayEnd");
                    if (dayType != 1) {
                        $("<option value='31'>31日</option>").appendTo("#opGregDayEnd");
                    }
                }
                $("#opGregDayEnd").attr("value", gregDayEnd);

                var lunDayEnd = $("#opLunDayEnd").val();
                $("#opLunDayEnd option[value='30']").remove();
                if (dayType == 0) {
                    $("<option value='30'>三十</option>").appendTo("#opLunDayEnd");
                }
                $("#opLunDayEnd").attr("value", lunDayEnd);
                break;
        }
    }
    ////时间列表选中
    this.initTime = function(begintime, endtime) {
        $("#opGregStart").attr("value", begintime);
        $("#opGregEnd").attr("value", endtime);
        $("#opLunStart").attr("value", begintime)
        $("#opLunEnd").attr("value", endtime);
    }
    ////日列表选中
    this.initDay = function(begindate, enddate) {
        $("#opGregDayStart").attr("value", begindate)
        $("#opGregDayEnd").attr("value", enddate)
        $("#opLunDayStart").attr("value", begindate)
        $("#opLunDayEnd").attr("value", enddate)
    }
    ////月列表选中
    this.initMonth = function(begindate, enddate) {
        $("#opGregMonthStart").attr("value", begindate)
        $("#opGregMonthEnd").attr("value", enddate);
        $("#opLunMonthStart").attr("value", begindate)
        $("#opLunMonthEnd").attr("value", enddate);
    }
    ////文本框公历转农历
    this.lunar = function(beginDate, endDate) {
        var objApi = new richinfo.email.calendar.commonApi();
        $("#txtLunStart").val(objApi.getNLStrValueByDate(new Date(beginDate.replace("-", "/").replace("-", "/"))).returnNlStr)
        $("#txtLunEnd").val(objApi.getNLStrValueByDate(new Date(endDate.replace("-", "/").replace("-", "/"))).returnNlStr)
    }
    ////初始化日期文本框
    this.initTextDate = function(beginDate, endDate) {
        var gregStart = document.getElementById("txtGregStart");
        var gregEnd = document.getElementById("txtGregEnd");
        var lunStart = document.getElementById("txtLunStart");
        var lunEnd = document.getElementById("txtLunEnd");
        gregStart.value = beginDate;
        gregStart.realDate = beginDate;
        lunStart.realDate = beginDate;
        gregEnd.value = endDate;
        gregEnd.realDate = endDate;
        lunEnd.realDate = endDate;
        me.lunar(beginDate, endDate);
    }
    ////初始化周
    this.initWeek = function(selectWeek) {
        if (selectWeek.substring(0, 1) == "1") {
            $("#sun").attr("checked", true);
        }
        if (selectWeek.substring(1, 2) == "1") {
            $("#mon").attr("checked", true);
        }
        if (selectWeek.substring(2, 3) == "1") {
            $("#tue").attr("checked", true);
        }
        if (selectWeek.substring(3, 4) == "1") {
            $("#wed").attr("checked", true);
        }
        if (selectWeek.substring(4, 5) == "1") {
            $("#thu").attr("checked", true);
        }
        if (selectWeek.substring(5, 6) == "1") {
            $("#fri").attr("checked", true);
        }
        if (selectWeek.substring(6, 7) == "1") {
            $("#sat").attr("checked", true);
        }
    }

    ////根据用户输入初始华所有下拉列表和文本框
    this.InitControlYMD = function(id, data, eventType) {
        serverDate = data.ServerTime;
        if (id == 0) {
            var objDt = getStartAndEndTime(serverDate);
            me.initTime(objDt.startTime, objDt.endTime);
            me.initTextDate(objDt.startDate, objDt.endDate);
            me.initDay(serverDate.split(" ")[0].split("-")[2], serverDate.split(" ")[0].split("-")[2]);
            me.initMonth(serverDate.split(" ")[0].split("-")[1], serverDate.split(" ")[0].split("-")[1]);
        }
        else {
            var startDate = new Date(parseInt(data.StartDate.replace("/Date(", "").replace(")/", "")));
            var endDate = new Date(parseInt(data.EndDate.replace("/Date(", "").replace(")/", "")));
            var startDay = startDate.getDate();
            var endDay = endDate.getDate();
            var startMonth = startDate.getMonth() + 1;
            var endMonth = endDate.getMonth() + 1;
            var startYear = startDate.getFullYear();
            var endYear = endDate.getFullYear();
            if (startDay < 10) { startDay = "0" + startDay; }
            if (endDay < 10) { endDay = "0" + endDay; }
            if (startMonth < 10) { startMonth = "0" + startMonth; }
            if (endMonth < 10) { endMonth = "0" + endMonth; }
            startDate = startYear + "-" + startMonth + "-" + startDay;
            endDate = endYear + "-" + endMonth + "-" + endDay;
            serverDate = startDate;
            var initstart = String(data.StartTime);
            var initend = String(data.EndTime);
            if (initstart.length < 3)
                initstart = "0" + data.StartTime;
            if (initend.length < 3)
                initend = "0" + data.EndTime;
            if (data.StartTime == 0)
                initstart = "000";
            if (data.EndTime == 0 || data.EndTime == 2359)
                initend = "000";
            me.curData = data;
            me.initTime(initstart, initend);
            me.initTextDate(startDate, endDate);
            me.initDay(startDay, endDay);
            me.initMonth(startMonth, endMonth);
            switch (eventType) {
                case 0:

                case 3:
                    break;
                case 4:
                    me.initWeek(data.DateFlag);
                    break;
                case 5:
                    me.initDay(data.DateFlag, data.EndDateFlag);
                    break;
                case 6:
                    me.initDay(data.DateFlag.substring(2), data.EndDateFlag.substring(2));
                    me.initMonth(data.DateFlag.substring(0, 2), data.EndDateFlag.substring(0, 2));
                    break;
            }
            if (data.CalendarType == 20 || data.CalendarType == 21) {
                $(".seleteDate li:eq(1)").click();
            }
        }
    }
    ////获取选中的周几,格式：0000001
    this.getWeekValue = function() {
        var week = "";
        if ($("#sun").attr("checked") == true) {
            week = "1";
        } else { week = "0"; }
        if ($("#mon").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        if ($("#tue").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        if ($("#wed").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        if ($("#thu").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        if ($("#fri").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        if ($("#sat").attr("checked") == true) {
            week += "1";
        } else { week += "0"; }
        return week;
    }
    this.monthDayChange = function(type) {
        if ($("#slRept").val() == 5)//每月
        {
            var startDay = parseInt($("#opGregDayStart").val(), 10);
            var endDay = parseInt($("#opGregDayEnd").val(), 10);
            if (type == 1)//以开始时间为准
            {
                if (startDay > endDay) {
                    $("#opGregDayEnd").val($("#opGregDayStart").val());
                }
            }
            else//以结束时间为准
            {
                if (startDay > startDay) {
                    $("#opGregDayStart").val($("#opGregDayEnd").val());
                }
            }
        }
        else if ($("#slRept").val() == 6)//每年
        {
            var startMd = parseInt($("#opGregMonthStart").val() + $("#opGregDayStart").val(), 10);
            var endMd = parseInt($("#opGregMonthEnd").val() + $("#opGregDayEnd").val(), 10);
            if (type == 1)//以开始时间为准
            {
                if (startMd > endMd) {
                    $("#opGregMonthEnd").val($("#opGregMonthStart").val());
                    $("#opGregDayEnd").val($("#opGregDayStart").val());
                }
            }
            else//以结束时间为准
            {
                if (startMd > endMd) {
                    $("#opGregMonthStart").val($("#opGregMonthEnd").val());
                    $("#opGregDayStart").val($("#opGregDayEnd").val());
                }
            }
        }
        //农历等于公历的
        $("#opLunMonthStart").val($("#opGregMonthStart").val());
        $("#opLunMonthEnd").val($("#opGregMonthEnd").val());
        $("#opLunDayStart").val($("#opGregDayStart").val());
        $("#opLunDayEnd").val($("#opGregDayEnd").val());
    }
    //绑定事件
    this.bindEvent = function() {
        ////公历/农历标签选择
        $(".seleteDate li").click(function() {
            $(".seleteDate li").removeClass("cur");
            $(this).addClass("cur");
            switch ($("li", ".seleteDate").index(this)) {
                case 0: //公历
                    $("#HiddCalValue").val("0");
                    $("#pLun").hide();
                    $("#pGreg").show();
                    var gregStart = document.getElementById("txtGregStart");
                    gregStart.realDate = $("#txtLunStart").attr("realDate");
                    var gregEnd = document.getElementById("txtGregEnd");
                    gregEnd.realDate = $("#txtLunEnd").attr("realDate");

                    me.transform(0);
                    $("#opGregStart").unbind("change");
                    $("#opGregStart").change(function() {
                        me.gregStartChange();
                    });
                    $("#opGregStart").attr("value", $("#opLunStart").val());
                    $("#opGregEnd").attr("value", $("#opLunEnd").val());

                    break;
                case 1: //农历
                    $("#HiddCalValue").val("1");
                    $("#pLun").show();
                    $("#pGreg").hide();
                    var lunStart = document.getElementById("txtLunStart");
                    lunStart.realDate = $("#txtGregStart").val();
                    var lunEnd = document.getElementById("txtLunEnd");
                    lunEnd.realDate = $("#txtGregEnd").val();
                    me.transform(1);
                    me.lunar($("#txtGregStart").val(), $("#txtGregEnd").val());
                    $("#opLunStart").unbind("change");
                    $("#opLunStart").change(function() {
                        me.lunStartChange();
                    });
                    $("#opLunStart").attr("value", $("#opGregStart").val());
                    $("#opLunEnd").attr("value", $("#opGregEnd").val());
                    break;
            }
            if ($("#chkallday").attr("checked") == true) {
                me.setHourControl(false);
            }
            else {
                me.setHourControl(true);
            }
        });
        ////全天
        $("#chkallday").click(function() {
            if (this.checked) {
                me.setHourControl(false);
                //              $("#slRept").attr("disabled",true); 
                //              $("#slRept").attr("value",0)
            } else {
                me.setHourControl(true);
                if (Utils.queryString("id") && me.curData && me.curData.EndTime == 2359)//全天
                {
                    var objStartAndEnd = getStartAndEndTime(me.curData.ServerTime);
                    initstart = objStartAndEnd.startTime;
                    initend = objStartAndEnd.endTime;
                    me.initTime(initstart, initend);
                }
                //              $("#slRept").attr("disabled",false);
            }
        });
        ////重复事件
        $("#slRept").change(function() {
            me.InitControlShowHide(parseInt($("#slRept ").val()));
        });
        ////时间选择变化
        $("#opGregStart").change(function() {
            me.gregStartChange();
        });
        $("#opGregEnd").change(function() {
            $("#opLunEnd").attr("value", $(this).val());
            $("#opGregStart").unbind("change");
            me.showTimeTip();
        });
        $("#opLunStart").change(function() {
            me.lunStartChange();
        });
        $("#opLunEnd").change(function() {
            $("#opGregEnd").attr("value", $(this).val());
            $("#opLunStart").unbind("change");
            me.showTimeTip();
        });
        ////日选择变化
        $("#opGregDayStart").change(function() {
            if ($("#slRept").val() != 0) {
                $("#opLunDayStart").attr("value", $(this).val());
                me.monthDayChange(1);
                me.showTimeTip();
            }
        });
        $("#opGregDayEnd").change(function() {
            if ($("#slRept").val() != 0) {
                $("#opLunDayEnd").attr("value", $(this).val());
                me.monthDayChange(2);
                me.showTimeTip();
            }
        });
        $("#opLunDayStart").change(function() {
            if ($("#slRept").val() != 0) {
                $("#opGregDayStart").attr("value", $(this).val());
                me.monthDayChange(1);
                me.showTimeTip();
            }
        });
        $("#opLunDayEnd").change(function() {
            if ($("#slRept").val() != 0) {
                $("#opGregDayEnd").attr("value", $(this).val());
                me.monthDayChange(2);
                me.showTimeTip();
            }
        });
        ////月选择变化
        $("#opGregMonthStart").change(function() {
            if ($("#slRept").val() != 0) {
                me.monthChange(this);
                $("#opLunMonthStart").attr("value", $(this).val());
                me.monthDayChange(1);
                me.showTimeTip();
            }
        });
        $("#opGregMonthEnd").change(function() {
            if ($("#slRept").val() != 0) {
                me.monthChange(this);
                $("#opLunMonthEnd").attr("value", $(this).val());
                me.monthDayChange(2);
                me.showTimeTip();
            }
        });
        $("#opLunMonthStart").change(function() {
            if ($("#slRept").val() != 0) {
                me.monthChange(this);
                $("#opGregMonthStart").attr("value", $(this).val());
                me.monthDayChange(1);
                me.showTimeTip();
            }
        });
        $("#opLunMonthEnd").change(function() {
            if ($("#slRept").val() != 0) {
                me.monthChange(this);
                $("#opGregMonthEnd").attr("value", $(this).val());
                me.monthDayChange(2);
                me.showTimeTip();
            }
        });
        ////公历/农历处理
        $("#txtGregStart").click(function() {
            me.setDate($("#txtGregStart")[0]);
            Utils.stopEvent();
        });
        $("#pGreg .drop:eq(0)").click(function() {
            me.setDate($("#txtGregStart")[0]);
            Utils.stopEvent();
        });
        $("#txtGregEnd").click(function() {
            me.setDate($("#txtGregEnd")[0]);
            Utils.stopEvent();
        });
        $("#pGreg .drop:eq(1)").click(function() {
            me.setDate($("#txtGregEnd")[0]);
            Utils.stopEvent();
        });
        $("#txtLunStart").click(function() {
            me.setDate($("#txtLunStart")[0]);
            Utils.stopEvent();
        });
        $("#pLun .drop:eq(0)").click(function() {
            me.setDate($("#txtLunStart")[0]);
            Utils.stopEvent();
        });
        $("#txtLunEnd").click(function() {
            me.setDate($("#txtLunEnd")[0]);
            Utils.stopEvent();
        });
        $("#pLun .drop:eq(1)").click(function() {
            me.setDate($("#txtLunEnd")[0]);
            Utils.stopEvent();
        });
        ////每周处理
        $("input[type=checkbox]").each(function() {
            $(this).click(function() {
                me.showTimeTip();
            });
        });
    }
    //初始化
    this.initData = function(id, data) {
        if (id == 0) {
            me.InitControlYMD(id, data, 0);
            $("#slRept").get(0).options[0].selected = true;
            $("#chkallday").attr("checked", false);
            $("#chkallday").attr("disabled", false);
            $("#chkallday")[0].style.cursor = "default";
        }
        else {
            if (data.EndTime == 2359) {
                $("#chkallday").attr("checked", true);
                $("#chkallday")[0].style.cursor = "default";
                //                $("#slRept").attr("disabled",true);
                $("#liAllDay").addClass("disabled");
            }
            me.InitControlYMD(id, data, parseInt(data.SendInterval, 10));

            if (data.SendInterval != null) {
                $("#slRept").attr("value", data.SendInterval);
                me.InitControlShowHide(parseInt(data.SendInterval, 10));
            }
        }
        if ($("#chkallday").attr("checked") == true) {
            me.setHourControl(false);
        } else {
            me.setHourControl(true);
        }
    }
    //校验
    this.checkData = function(isAllDay, interval, dateflag, enddateflag, starttime, endtime) {
        var checkResult = { result: true, message: "" };
        var errTimeMsg = calendarMessages.errTimeMsg;
        var errWeekMsg = calendarMessages.errWeekMsg;

        if (!isAllDay) {
            if (interval == "0") {
                if (parseInt(dateflag, 10) > parseInt(enddateflag, 10)) {
                    checkResult.result = false;
                    checkResult.message = errTimeMsg;
                    return checkResult;
                }
                if ($("#chkallday").attr("checked") == true) {
                } else {
                    if (parseInt(dateflag, 10) == parseInt(enddateflag, 10)) {
                        if (parseInt(starttime) > parseInt(endtime)) {
                            checkResult.result = false;
                            checkResult.message = errTimeMsg;
                            return checkResult;
                        }
                    }
                }
            }
            if (interval == "3" || interval == "4") {
                if (parseInt(starttime) > parseInt(endtime)) {
                    checkResult.result = false;
                    checkResult.message = errTimeMsg;
                    return checkResult;
                }
                if (interval == "4") {
                    if (me.getWeekValue() == "0000000") {
                        checkResult.result = false;
                        checkResult.message = errWeekMsg;
                        return checkResult;
                    }
                }
            }
            if (interval == "5" || interval == "6") {
                if (parseInt(dateflag, 10) > parseInt(enddateflag, 10)) {
                    checkResult.result = false;
                    checkResult.message = errTimeMsg;
                    return checkResult;
                } else if (parseInt(dateflag, 10) == parseInt(enddateflag, 10)) {
                    if (parseInt(starttime) > parseInt(endtime)) {
                        checkResult.result = false;
                        checkResult.message = errTimeMsg;
                        return checkResult;
                    }
                }
            }
        }
        else {
            if (parseInt(dateflag, 10) > parseInt(enddateflag, 10)) {
                checkResult.result = false;
                checkResult.message = errTimeMsg;
                return checkResult;
            }
        }
        return checkResult;
    }
    //取值
    this.getData = function() {
        var info = { state: 0, message: "", isAllday: false, calendartype: "10", interval: '0', dateflag: "0", enddateflag: "0", starttime: "0", endtime: "100", datedesc: "" };
        info.interval = $("#slRept").val();
        info.datedesc = $("#lshowTip").html();
        var caltype = $("#HiddCalValue").val();
        var startDescStr = "";
        var endDescStr = "";
        var begin = [];
        var end = [];
        switch (info.interval) {
            case "0": //不重复
                if ($("#chkallday").attr("checked") == true) {
                    if ($("#HiddCalValue").val() == "1") {
                        var LunStartDate = $("#txtLunStart").val();
                        var LunEndDate = $("#txtLunEnd").val();
                        if (LunStartDate != LunEndDate)
                            info.datedesc = "农历" + LunStartDate + "到" + LunEndDate;
                        else
                            info.datedesc = "农历" + LunStartDate;
                        info.calendartype = "20";
                    }
                    else {
                        var gregStarDateArray = $("#txtGregStart").val().split("-");
                        var gregEndDateArray = $("#txtGregEnd").val().split("-");
                        startDescStr = gregStarDateArray[0] + "年" + parseInt(gregStarDateArray[1], 10) + "月" + parseInt(gregStarDateArray[2], 10) + "日";
                        endDescStr = gregEndDateArray[0] + "年" + parseInt(gregEndDateArray[1], 10) + "月" + parseInt(gregEndDateArray[2], 10) + "日";
                        if (startDescStr != endDescStr)
                            info.datedesc = startDescStr + "到" + endDescStr;
                        else
                            info.datedesc = startDescStr;
                    }
                } else {
                    if (caltype == "0") {
                        info.starttime = $("#opGregStart").val();
                        info.endtime = $("#opGregEnd").val();
                    }
                    else if (caltype == "1") {
                        info.starttime = $("#opLunStart").val();
                        info.endtime = $("#opLunEnd").val();
                        info.calendartype = "20";
                    }

                    if ($("#HiddCalValue").val() == "1") {
                        var LunStartDate = $("#txtLunStart").val();
                        var LunEndDate = $("#txtLunEnd").val();

                        startDescStr = LunStartDate + me.getTimeShow($("#opGregStart :selected").text());
                        if (LunStartDate == LunEndDate) {
                            if ($("#opGregStart :selected").text() == $("#opGregEnd :selected").text()) {
                                endDescStr = startDescStr;
                            }
                            else {
                                endDescStr = me.getTimeShow($("#opGregEnd :selected").text());
                            }
                        }
                        else {
                            endDescStr = LunEndDate + me.getTimeShow($("#opGregEnd :selected").text());
                        }
                        if (startDescStr != endDescStr)
                            info.datedesc = "农历" + startDescStr + "到" + endDescStr;
                        else
                            info.datedesc = "农历" + startDescStr;

                    }
                    else {
                        var gregStarDateArray = $("#txtGregStart").val().split("-");
                        var gregEndDateArray = $("#txtGregEnd").val().split("-");

                        startDescStr = gregStarDateArray[0] + "年" + parseInt(gregStarDateArray[1], 10) + "月" + parseInt(gregStarDateArray[2], 10) + "日" + me.getTimeShow($("#opGregStart :selected").text());
                        if ($("#txtGregStart").val() == $("#txtGregEnd").val()) {
                            if ($("#opGregStart :selected").text() == $("#opGregEnd :selected").text()) {
                                endDescStr = startDescStr;
                            }
                            else {
                                endDescStr = me.getTimeShow($("#opGregEnd :selected").text());
                            }
                        }
                        else {
                            endDescStr = gregEndDateArray[0] + "年" + parseInt(gregEndDateArray[1], 10) + "月" + parseInt(gregEndDateArray[2], 10) + "日" + me.getTimeShow($("#opGregEnd :selected").text());
                        }
                        if (startDescStr != endDescStr)
                            info.datedesc = startDescStr + "到" + endDescStr;
                        else
                            info.datedesc = startDescStr;
                    }
                }
                begin = $("#txtGregStart").val().split("-");
                end = $("#txtGregEnd").val().split("-")
                info.dateflag = begin[0] + begin[1] + begin[2];
                info.enddateflag = end[0] + end[1] + end[2];
                break;
            case "3": //每天
                info.calendartype = "10";
                if (caltype == "0") {
                    info.starttime = $("#opGregStart").val();
                    info.endtime = $("#opGregEnd").val();
                    begin = $("#txtGregStart").val().split("-");
                    end = $("#txtGregEnd").val().split("-")
                    info.dateflag = begin[1] + begin[2];
                    info.enddateflag = end[1] + end[2];
                }
                else if (caltype == "1") {
                    info.starttime = $("#opLunStart").val();
                    info.endtime = $("#opLunEnd").val();
                    begin = $("#txtLunStart").val().split("-");
                    end = $("#txtLunEnd").val().split("-")
                    info.dateflag = begin[1] + begin[2];
                    info.enddateflag = end[1] + end[2];
                }
                break;
            case "4": //每周
                info.calendartype = "30";
                if (caltype == "0") {
                    info.starttime = $("#opGregStart").val();
                    info.endtime = $("#opGregEnd").val();
                }
                else if (caltype == "1") {
                    info.starttime = $("#opLunStart").val();
                    info.endtime = $("#opLunEnd").val();
                }
                info.dateflag = me.getWeekValue();
                info.enddateflag = me.getWeekValue();
                break;
            case "5": //每月
                if (caltype == "0") {
                    info.starttime = $("#opGregStart").val();
                    info.endtime = $("#opGregEnd").val();
                    info.dateflag = $("#opGregDayStart").val();
                    info.enddateflag = $("#opGregDayEnd").val();
                    info.calendartype = "11";
                }
                else if (caltype == "1") {
                    info.starttime = $("#opLunStart").val();
                    info.endtime = $("#opLunEnd").val()
                    info.dateflag = $("#opLunDayStart").val();
                    info.enddateflag = $("#opLunDayEnd").val();
                    info.calendartype = "21";
                }
                break;
            case "6": //每年
                if (caltype == "0") {
                    info.starttime = $("#opGregStart").val();
                    info.endtime = $("#opGregEnd").val();
                    info.dateflag = $("#opGregMonthStart").val() + $("#opGregDayStart").val();
                    info.enddateflag = $("#opGregMonthEnd").val() + $("#opGregDayEnd").val();
                    info.calendartype = "10";
                }
                else if (caltype == "1") {
                    info.starttime = $("#opLunStart").val();
                    info.endtime = $("#opLunEnd").val()
                    info.dateflag = $("#opLunMonthStart").val() + $("#opLunDayStart").val();
                    info.enddateflag = $("#opLunMonthEnd").val() + $("#opLunDayEnd").val();
                    info.calendartype = "20";
                }
                break;
        }

        if ($("#chkallday").attr("checked") == true) {
            info.starttime = "800";
            info.endtime = "2359";
            info.isAllDay = true;
        }
        return info;
    }
    me.drawHTML();
    me.bindEvent();
}


//常规添加
function SetCalPage() {
    var me = this;
    var smsLength = 200;
    var seqno = 0;
    var serverDate; //= new Date();
    var DateServer;
    var calendarData;
    var content = "";
    var calendartype = "10";
    var dateflag = "0";
    var enddateflag = "0";
    var starttime;
    var endtime;
    var recmysms = 0;
    var recmyemail = 0;
    var recmobile = "";
    var recemail = "";
    var datedesc = "";
    var beforetype = "";
    var beforetime = "";
    var validimg = "";
    var interval = "";
    var caltype = "";
    var textContent = calendarMessages.cal_DefaultContent;
    var groupLength = 2;
    var isNeedImg = false;
    var isAllDay = false;
    var objlunar = new richinfo.email.calendar.commonUI.lunarBox("divLunarContent");
    top.WaitPannel.hide();

    if (isFromMailPage())//邮件列表(100)或写信页(101)的提醒
    {
        top.FF.setWidth(610);
        $("#content").css({ height: "440px", overflow: "auto", margin: "10px 0", padding: "0", width: "598px", "*width": "605px" });
        $("html").css({ padding: 0 });
        $(".form dd").css({ width: "518px" });
        $(".alert").hide();
        $("#txtContent").focus();
    }
    $("#HiddCalValue").val("0");
    var templeXml = "<Request>\
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

    var id = Utils.queryString("id");
    if (typeof (id) == "undifined" || id == null) {
        id = 0;
        $("#aTitle").text("添加日程");
    }
    else {
        $("#aTitle").text("编辑日程");
    }
    $(document).click(function() {
        $("#__calendarPanel").hide();
    });

    //编辑或是添加日程
    SetCalPage.prototype.getCalendar = function() {
        recmysms = 0;
        recmyemail = 0;
        recmobile = "";
        recemail = "";

        var info = objCalendarRemind.getRemindInfo();
        recmysms = info.recMySms;
        recmyemail = info.recMyEmail;
        var mailType = Utils.queryString("comefrom");
        if (mailType != 100) {
            recmobile = info.recMobile;
            recemail = info.recEmail;
        }
        beforetype = info.beforeType;
        beforetime = info.beforeTime;
        validimg = info.validImgText;

        if ($.trim($("#txtContent").val()) == textContent && !me.isContentChange) {
            content = "";
        } else {
            content = $("#txtContent").val().trim();
        }

        me.sendSmsStartTime = 0;
        me.sendSmsEndTime = 2359;
        var lunar = objlunar.getData();
        isAllday = lunar.isAllday;
        calendartype = lunar.calendartype;
        interval = lunar.interval;
        dateflag = lunar.dateflag;
        enddateflag = lunar.enddateflag;
        starttime = lunar.starttime;
        endtime = lunar.endtime;
        datedesc = lunar.datedesc;

        var dateSelectedStart = new Date();
        dateSelectedStart.setHours(String(starttime).substr(0, String(starttime).length - 2));
        dateSelectedStart.setMinutes(String(starttime).substr(String(starttime).length - 2, 2));

        var dateSelectedEnd = new Date();
        dateSelectedEnd.setHours(String(endtime).substr(0, String(endtime).length - 2));
        dateSelectedEnd.setMinutes(String(endtime).substr(String(endtime).length - 2, 2));

        objCalendarRemind.setEventTime(dateSelectedStart, dateSelectedEnd);

        return String.format(templeXml, id, top.encodeXML(content), 0, calendartype, interval, dateflag, enddateflag, starttime, endtime, recmysms, recmyemail, recmobile, top.encodeXML(recemail), top.encodeXML(datedesc), beforetype, beforetime, validimg);
    }

    this.showErrorMsg = function(msg) {
        $("#lblErrorMsg").text(msg.encode());
        $("#pErrorMsg").show();
    }
    //日程验证
    SetCalPage.prototype.checkCalendar = function() {
        if (content == null || content == "") {
            me.showErrorMsg(calendarMessages.cal_ContentNotEmpty);
            $("#txtContent").addClass("err").focus();
            return false;
        }
        var lunar = objlunar.checkData(isAllDay, interval, dateflag, enddateflag, starttime, endtime);
        if (!lunar.result) {
            me.showErrorMsg(lunar.message);
            return false;
        }
        var remindResult = objCalendarRemind.checkRemindInfo();
        if (remindResult.result == false) {
            me.showErrorMsg(remindResult.message);
            return false;
        }
        return true;

    }

    //保存
    SetCalPage.prototype.saveCalendar = function(xml) {
        var isTimeout = top.Utils.PageisTimeOut(true);
        if (!isTimeout) {
            if (!me.checkCalendar()) {
                return;
            }

            if ($("#slRept").val() == "0") {
                var arrdatesvr = DateServer.split(" ")[0].split("-");
                var tempdatesvr = arrdatesvr[0] + arrdatesvr[1] + arrdatesvr[2];
                var arrdatestart = $("#txtGregStart").val().split("-");
                var tempdateflag = arrdatestart[0] + arrdatestart[1] + arrdatestart[2];
                if ((recmysms == 1 || recmyemail == 1 || recmobile.length > 0 || recemail.length > 0) && (tempdatesvr > tempdateflag || (tempdatesvr == tempdateflag && $("#chkallday").attr("checked") == true))) {
                    top.FloatingFrame.confirm(calendarMessages.confirmNotSendSMS, function() {
                        me.saveSetCal(xml);
                    });
                }
                else {
                    me.saveSetCal(xml);
                }
            }
            else {
                me.saveSetCal(xml);
            }
        }
    }

    this.saveSetCal = function(xml) {
        $("#btnSave").attr("disabled", true);
        $("#pErrorMsg").hide();
        var comeFrom = Utils.queryString("comefrom");
        $.ajax({
            dataType: "json",
            url: "/g2/calendar/EditCalendar.ashx",
            data: {
                sid: window.top.UserData.ssoSid,
                actionId: 1,
                xml: xml,
                comefrom: comeFrom,
                rnd: Math.random()
            },
            success: function (data) {
                $("#btnSave").val("保存");
	            if(window.isCheckin){
	            	top.BH({key : "checkin_addcalendarSuc"});
	            }
                if (data.State == 0 && data.ResultCode == "True") {
                    if (isFromMailPage()) {
                        top.WaitPannel.show(calendarMessages.cal_SuccussMsg);
                        top.calendar_mailInfo = null;
                        window.setTimeout(function () { top.WaitPannel.hide(); top.FloatingFrame.close(); }, 500);
                    }
                    else {
                        var UrlPage = "/m2012/html/calendar/calendar_list.html?rnd=" + Math.random();
                        if (comeFrom == "1") {
                            if (Utils.queryString("curDate"))
                                UrlPage = "/m2012/html/calendar/calendar_view.html?curDate=" + Utils.queryString("curDate") + "&rnd=" + Math.random();
                            else
                                UrlPage = "/m2012/html/calendar/calendar_view.html?rnd=" + Math.random();
                        }
                        window.location.href = top.M139.Text.Url.getAbsoluteUrl(UrlPage);
                    }
                    if ($('#aTitle').text().indexOf('添加') > -1) {
                        try {
                            top.postJiFen(65, 1); //添加日程提醒成功 上报积分
                        } catch (e) { }
                    }
                    return false;
                }
                else {
                    if (data.IsShowValidImg == "True" && data.ValidateUrl.length > 0)
                        objCalendarRemind.refreshValidImage(data.ValidateUrl);
                    richinfo.email.calendar.common.alertErrorMsg(data.State, data.ResultCode, data.ResultMsg);
                    $("#btnSave").attr("disabled", false);
                }
            }
        });
    }



    $("#aRecent").click(function() {
        window.location.href = new CommonPage().getUrlPath() + "/calendar_list.html?type=1&rnd=" + Math.random();
        return false;
    });
    $("#aAgent").click(function() {
        window.location.href = new CommonPage().getUrlPath() + "/calendar_list.html?type=2&rnd=" + Math.random();
        return false;
    });
    $("#aHasDone").click(function() {
        window.location.href = new CommonPage().getUrlPath() + "/calendar_list.html?type=3&rnd=" + Math.random();
        return false;
    });
    var comefrom = Utils.queryString("comefrom");
    var gotopage = "calendar_view.html?1=1";
    if (Utils.queryString("curDate"))
        gotopage = "calendar_view.html?curDate=" + Utils.queryString("curDate");
    $("#aMain").click(function() {
        if (comefrom && comefrom == 2) {
            gotopage = "/m2012/html/calendar/calendar_list.html?1=1";
        }
        window.location.href = new CommonPage().getUrlPath() + "/" + gotopage + "&rnd=" + Math.random();
        return false;
    });
    $("#btnCancel").click(function() {
        if (isFromMailPage()) {
            top.calendar_mailInfo = null;
            top.FloatingFrame.close();
            return false;
        }
        else if (comefrom && comefrom == 2) {
            gotopage = "/m2012/html/calendar/calendar_list.html?1=1";
        }
        window.location.href =  gotopage + "&rnd=" + Math.random();
        return false;
    });

    $("#aGame").click(function() {
        if (comefrom && comefrom == 2) {
            gotopage = "comefrom=2&";
        }
        window.location.href = new CommonPage().getUrlPath() + "/game/GameList.html?" + gotopage + "&rnd=" + Math.random();
        return false;
    });
    $("#content").scroll(function() {
        resetCalendarTop();
    });
    $("#txtContent").focus(function() {
        if ($.trim($(this).val()) == textContent && !me.isContentChange) {
            $(this).val("");
            $(this).removeClass("normal");
        }
        me.isContentChange = true;
    }).blur(function() {
        if ($.trim($(this).val()).length == 0) {
            $(this).val(textContent);
            $(this).addClass("normal");
            me.isContentChange = false;
        }
    });
    $("#txtContent").change(function() {
        me.isContentChange = true;
    });
    var isTimeout = top.Utils.PageisTimeOut(true);
    if (!isTimeout) {
        $.ajax({
            method:"get",
            dataType:"json",
            url: "/g2/calendar/EditCalendar.ashx",
            data: {
                sid: window.top.UserData.ssoSid,
                actionId: 0,
                id: id,
                rnd: Math.random()
            },
            success: function (data) {
                if (data.State == 0)//&&data.ResultCode=="True")
                {
                    serverDate = data.ServerTime;
                    DateServer = serverDate.split(" ")[0];
                    calendarData = data;
                    if (isFromMailPage()) {
                        $("#txtContent").text(top.calendar_mailInfo.title).removeClass("normal");
                    }
                    else {
                        $("#txtContent").text(textContent);
                    }
                    $("#txtContent").blur();

                    $("#spanCount1").text("全部日程(" + data.AllCount + ")");
                    $("#spanCount2").text("最近7天日程(" + data.SevenCount + ")");
                    groupLength = data.GroupLength;
                    objlunar.initData(id, data);
                    var dateSelectedStart = new Date();
                    var dateSelectedEnd = new Date();

                    if (id == 0) {
                        var day = Utils.queryString("d");
                        var curHour = parseInt(serverDate.split(" ")[1].split(":")[0], 10);
                        dateSelectedStart.setHours(curHour + 1);
                        dateSelectedStart.setMinutes(0);
                        dateSelectedEnd.setHours(curHour + 2);
                        dateSelectedEnd.setMinutes(0);
                        //处理简约添加传过来的参数                    
                        if (day) {
                            var cont = Utils.queryString("cont");
                            var beforetype = Utils.queryString("type");
                            var beforetime = Utils.queryString("time");
                            var begin = Utils.queryString("t1");
                            var end = Utils.queryString("t2");
                            var sms = Utils.queryString("sms");
                            var mail = Utils.queryString("mail");
                            if (cont && cont != "") {
                                $("#txtContent").text(unescape(cont));
                                $("#txtContent").removeClass("normal");
                                me.isContentChange = true;
                            }
                            objCalendarRemind.initData(beforetype, beforetime, sms, mail, '', '', data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsShowValidImg, data.ValidateUrl);

                            if (begin && end)
                                objlunar.initTime(begin, end);
                            objlunar.initDay(day.split('-')[2], day.split('-')[2]);
                            objlunar.initMonth(day.split('-')[1], day.split('-')[1]);
                            objlunar.initTextDate(day, day);
                        }
                        else {
                            var recEmail = '';
                            var recMobile = '';
                            if (isFromMailPage()) {
                                recEmail = top.calendar_mailInfo.email;
                                recMobile = top.calendar_mailInfo.mobile;
                            }
                            objCalendarRemind.initData(0, 15, 1, 0, recMobile, recEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsShowValidImg, data.ValidateUrl);

                            if (Utils.queryString("source") == "InfoZone")//运营推广
                            {
                                $("#txtContent").removeClass("normal");
                                var rept = Utils.queryString("rept");
                                var remind = Utils.queryString("remind");
                                if (rept && rept != "0")//重复类型
                                {
                                    $("#slRept").val(rept).change();
                                }
                                if (remind == "1")//需要提醒好友
                                {
                                    $("#chkother").attr("checked", true).click().attr("checked", true);
                                }
                            }
                        }
                    }
                    else {
                        objCalendarRemind.initData(data.BeforeType, data.BeforeTime, data.RecMySMS, data.RecMyEmail, data.RecMobile, data.RecEmail, data.FreeInfo, data.SendCount, data.FeeValue, data.GroupLength, data.IsShowValidImg, data.ValidateUrl, data.Status, data.StartDate, data.StartTime);
                        dateSelectedStart.setHours(String(data.StartTime).substr(0, String(data.StartTime).length - 2));
                        dateSelectedStart.setMinutes(String(data.StartTime).substr(String(data.StartTime).length - 2, 2));
                        dateSelectedEnd.setHours(String(data.EndTime).substr(0, String(data.EndTime).length - 2));
                        dateSelectedEnd.setMinutes(String(data.EndTime).substr(String(data.EndTime).length - 2, 2));

                        if (data.Content != null) {
                            $("#txtContent").removeClass("normal");
                            $("#txtContent").val(data.Content);
                            me.isContentChange = true;
                        }
                    }
                    objCalendarRemind.setEventTime(dateSelectedStart, dateSelectedEnd);
                    $("#helpCount").show();
                }
                else {
                    richinfo.email.calendar.common.alertErrorMsg(data.State, data.ResultCode, data.ResultMsg);
                }
            }
        });
    }
    //保存
    $("#btnSave").click(function() {
        me.saveCalendar(me.getCalendar());
        return false;
    });

    //日程内容输入框数字检测
    SetCalPage.prototype.checkInputWord = function() {
        var contentval = $("#txtContent").attr("value");
        var num = 0;
        if (contentval && contentval.trim() != textContent || me.isContentChange == true) {
            num = contentval.length;
            //当没有\r时表示不是ie，则换行符是\n，字数应该加上换行符数
            var enternum = 0; //换行符数
            if (contentval.indexOf("\r") < 0) {
                enternum = (contentval.split("\n")).length - 1;
            }
            num = num + enternum;
        }
        if (num > smsLength) {
            var smsLengthend = smsLength;
            //当用户使用ff，chrome时，计算前面有效的字数（相当于在ie下的10000个字）
            if (smsLength > enternum) {
                if (enternum > 0) {
                    var contentlastval = contentval.substr(smsLength - enternum);
                    var enternumlast = (contentlastval.split("\n")).length - 1;
                    smsLengthend = smsLength - enternum + enternumlast;
                }
            }
            $("#txtContent").attr("value", $.trim($("#txtContent").attr("value")).substring(0, smsLengthend));
            me.showErrorMsg(String.format(calendarMessages.inputWordTooLong, smsLength));
            num = smsLength;
        }
        //$("#helpCount em:eq(0)").text(num);     
        if (smsLength - num > 0)
            $("#helpCount em:eq(0)").text(smsLength - num);
        else
            $("#helpCount em:eq(0)").text(0);
    }

    //字数检查
    //    if ($.browser.msie)
    //        $("#txtContent").bind("propertychange", me.checkInputWord);
    //    else
    //    {
    var insObj = null;
    var timer = setInterval(function() {
        if ($("#txtContent").val() != insObj || me.isContentChange == true) {
            me.checkInputWord();
            insObj = $("#txtContent").val();
        }
    }, 100);
    //    }
}

function checkInputMobile() {
    if (!$(inputMobiles).hasClass("input-default") && $.trim($(inputMobiles).val()).length > 0) {
        var mobileVal = $(inputMobiles).val();
        mobileVal = $.trim(mobileVal);
        var regex = /，/gi;
        mobileVal = mobileVal.replace(regex, ",");
        regex = /;/gi;
        mobileVal = mobileVal.replace(regex, ",");
        regex = /；/gi;
        mobileVal = mobileVal.replace(regex, ",");
        mobileVal = $.trim(mobileVal, ",");
        var mobileList = mobileVal.split(",");
        var mbolieLength = 0;
        for (var i = 0; i < mobileList.length; i++) {
            if ($.trim(mobileList[i]).length > 0) {
                mbolieLength++;
            }
        }
        if (mbolieLength > mobileNum) {
            oldVal = getMoblieByLen(mobileList, mobileNum);
            $(inputMobiles).val(oldVal);
            //top.FloatingFrame.alert("您最多可同时发送给<span class=\"notice_font\">"+mobileNum+"</span>人，请不要超出限制，谢谢！",function()
            //new CommonPage().showError($("#divMobileError"), $("#txtMobile").parent().parent().parent(), "您最多可同时发送给<span class=\"notice_font\">"+mobileNum+"</span>人，请不要超出限制，谢谢！");
            setTimeout(function() {
                This.satrt();
            }
            );
        }
        else {
            oldVal = $(inputMobiles).val();
            This.satrt();
        }
    }
    else {
        This.satrt();
    }

    this.satrt = function() {
        if (checkTimer) {
            clearTimeout(checkTimer);
        }
        checkTimer = setTimeout(checkInputMobile, interval);
    }
}

