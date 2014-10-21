

//Utils.setDomain();
//设域
document.domain = window.location.host.match(/([^.]+\.[^.:]+):?\d*$/)[1];
//获得资源路径
var resourcePath = window.top.resourcePath;
var supermanResourcePath = resourcePath.replace("coremail", "superman");
var htmlCode = "";
htmlCode += getLinkTag("");
htmlCode += getJsTag(resourcePath + "/js/utils.js");
htmlCode += getJsTag(resourcePath + "/js/controls.js");
document.write(htmlCode);

var mb = "/sms";
var mbs = top.SiteConfig.smsMiddleware + "sms";


function getJsTag(path, charset) {
    var html = "<script charset='gb2312' src='" + path + "' type='text/javascript'></" + "script>";
    if (charset)
        html = html.replace("gb2312", charset);
    return html;
}
function getLinkTag(path) {
    var text = "";
    if (path)
        text = "href='" + path + "'";
    return "<link rel='stylesheet' type='text/css' " + text + " />";
}
//加载js完成调用的方法

var Sys = {};
var initPage = function() {

    //浏览器版本确定
    var ua = navigator.userAgent.toLowerCase();
    if (window.ActiveXObject)
        Sys.ie = ua.match(/msie ([\d.]+)/)[1];

    Utils.loadSkinCss(null, document, "supersms");

    //发短信页面的下拉框事件
    $(".link").change(function() {
        var current = this.options[this.selectedIndex].text.split('/')[0];
        var href = $(this).attr("url") + current + ".html";
        window.location.href = href;
    });

    initSmsList(); //初使化短信		
    //短信列表页的页面跳转button
    $(".btnStrong").click(function() {
        var href = this.url + this.value + ".html";
        window.location.href = href;
    });


    //上面的标签
    $(".headTage").click(function() {
        $(this).toggleClass("current");
        //日志上报
        top.addBehaviorExt({
            actionId: 20017,
            thingId: 2,
            moduleId: 14
        });
    });
    //写入内容到短信内容框
    $(".sms-list li > p").click(function() {
        top.addBehaviorExt({
            actionId: 20015,
            thingId: 0,
            moduleId: 15
        });

        setCaret("txtContent");
        insertAtCaret("txtContent", $.trim($(this).html().decode()));
        try {
        }
        catch (e) {
            try {
                $(window.parent.document).find("#txtContent")[0].window.parent.setSelectionRange($(window.parent.document).find("#txtContent").val().length, $(window.parent.document).find("#txtContent").val().length);
                $(window.parent.document).find("#txtContent").focus();
            }
            catch (e) {
            }
        }
    });

    $(".dList").bind("mouseleave", function() {
        $('.dList').hide();
    })

    $("#btnFreeSms").click(function() {
        //日志上报
        top.addBehaviorExt({
            actionId: 20017,
            thingId: 1,
            moduleId: 14
        });
        window.parent.location.href = top.M139.HttpRouter.getNoProxyUrl("/mw2/sms/uploads/html/NewFreeSms/index.html");
    })
    if (window.parent.smsState.actionInfo != 1 && window.parent.smsState.actionInfo != 2) {
        //根据节日切换页面,不是最新，到时在加上修改样式
        if ($("#Festan").text().indexOf("hot") == -1) {
            if (window.parent.smslistState == 0) {
                window.parent.smslistState = 1;
                var sms = $("#Festan");
                if (sms.attr("parentid") != undefined && sms.attr("classid") != undefined) {
                    window.parent.document.getElementById("smslistframe").src = top.M139.HttpRouter.getNoProxyUrl("/mw2/sms/uploads/html/SmsList/smslist_" + sms.attr("parentid") + "_" + sms.attr("classid") + "_1.html");
                }
            }
        }
        else {
            if (window.parent.smslistState == 0) {
                window.parent.smslistState = 1;
                window.parent.document.getElementById("smslistframe").src = top.M139.HttpRouter.getNoProxyUrl("/mw2/sms/uploads/html/SmsList/smslist_new_1.html");
            }
        }
    }
    else
        if (window.parent.smsState.actionInfo == 1) {
        if (window.parent.smslistState == 0) {
            window.parent.smslistState = 1;
            window.parent.smsState.actionInfo = 2;

            var listType = "18_2_1";
            if (window.parent.smsState.listType != "") {
                listType = window.parent.smsState.listType;
            }
            window.parent.document.getElementById("smslistframe").src = top.M139.HttpRouter.getNoProxyUrl("/mw2/uploads/html/SmsList/smslist_" + listType + ".html");
        }
    }
    else
        if (window.parent.smsState.actionInfo == 2) {
        try {
            $(window.parent.document).find("#txtContent").val($(".sms-list li p").get(0).innerHTML.trim());
        }
        catch (e) { }
        window.parent.smsState.actionInfo = 3;
    }

    //切化最新，最热                    
    $(".headTage").each(function() {
        $(this).removeClass("current");
    });
    if (window.location.href.indexOf("hot") > 0)
        $(".hot").parent().addClass("current");
    else
        $(".new").parent().addClass("current");

    //alert(Utils.getCookie("isReadUser" + window.top.UserData.ssoSid));
    if (Utils.getCookie("isReadUser" + window.top.UserData.ssoSid) != "0")//红名单用户
    {
        //发短信
        $("#btnFreeSms").text("立即进入免费专区");
    }
    else//普通用户
    {
        $("#btnFreeSms").text("进入短信汇总页");
    }

    //如果是短信页面切换到短信页面
    if (window.location.href.indexOf("UserSMS.html") > 0) {
        $(".prov").hide();
        $(".next").hide();
        $(".link").hide();

        loadUsrSmsList(window.parent.smsState.smsClassID, 1)
        if (window.parent.smsState.smsCount == 0)
            $("#pNoSmsList").show();
    }
    else {
        window.parent.smsState.smsDecrypt = 0;
        window.parent.smsState.smsClassID = 0;
        window.parent.smsState.smsCount = 0

        //下拉框和分页同步 上一页和下一页的代码            
        var href = window.location.href;
        var currents = href.split('_');
        var index = parseInt(currents[currents.length - 1]);
        $(".link").each(function() {

            for (var i = 0; i < this.options.length; i++) {
                if (this.options[i].text.split('/')[0] == index)
                    this.options[i].selected = true;
            }
        });
    }
    //取消加锁
    $("#decrylink").click(function() {
        window.parent.location.href = "sms_setting.html";
    });

    $(".dList li").hover(function() {
        $(this).addClass("hover");
    }, function() {
        $(this).removeClass("hover");
    });

    $(".sms-list li").hover(function() {

        $(this).addClass("current");
    }, function() {
        $(this).removeClass("current");
    });

    $(document).keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });

    if (typeof ($(".shenglanpager").attr("class")) == "undefined") {
        var heig = 410 - 64;
        if (heig > 10)
            $(".adc-bd").height(heig);
    }
    else {
        var heig = 410 - 114;
        if (heig > 10)
            $(".adc-bd").height(heig);
    }
}

var currentPage = 1;
var cloumninfo = ""; //栏目信息

var initSmsList = function() {

    if (window.parent.smsClassHtml.length == 0 && window.parent.smsClassHtml == "") {
        var PostXML =
        {
            GetClass_Xml: "\
<object>\
<int name=\"type\">1</int>\
</object>"
        };
        var sid = window.top.UserData.ssoSid;
        var getUrl = mbs + "?func=sms:getSmsClass&sid=" + sid + "&rnd=" + Math.random();

        $.ajax({
            type: "post",
            contentType: "application/xml;charset:utf-8",
            url: getUrl,
            data: PostXML["GetClass_Xml"],
            dataType: "json",
            error: function(err) { },
            success: function(data) {
                if (data.code == "S_OK") {
                    var html = '<ul class="dList">';
                    var classid = 0;
                    $.each(data["var"].classInfo, function(i, item) {
                        classid = item.classId;
                        var text = item.className;
                        var value = item.classId;

                        if (text.length > 6)
                            text = text.substring(0, 6) + "...";
                        html += '<li>';
                        html += "<a href='#' classid='" + value + "'>" + text.encode() + "</a>";
                        html += "</li>";
                    });
                    html += "</ul>";
                    var smshtml = $("#sms").html();
                    smshtml += html;
                    $("#sms").html(smshtml);
                    window.parent.smsClassHtml = smshtml;
                    eventBind();
                } else {
                    top.FloatingFrame.alert(window.parent.SMSMessage["SmsGetSendMsgError"]);
                }
            }
        });
    }
    else
        $("#sms").html(window.parent.smsClassHtml);
    eventBind();
}

/**  
* 初始化对象以支持光标处插入内容  
*/
var setCaret = function(txtname) {
    if (!$.browser.msie) return;
    var initSetCaret = function() {
        var textObj = $(window.parent.document).find("#" + txtname);
        //textObj.caretPos = document.selection.createRange().duplicate();   
        var selectedObj = this.ownerDocument.selection.createRange()
        if (selectedObj.parentElement() == this) {
            textObj.caretPos = selectedObj;
        }
    };
    $(window.parent.document).find("#" + txtname)
        .click(initSetCaret)
        .select(initSetCaret)
        .keyup(initSetCaret);
}
/**  
* 在当前对象光标处插入指定的内容  
*/
var insertAtCaret = function(txtname, textFeildValue) {
    var text = $(window.parent.document).find("#" + txtname);
    var textObj = text.get(0);
    var prevContent = text.attr('prevContent'); //记录上一点击模版短信 ，模版短信点击替换 ---sunny 20120416
    if (prevContent && prevContent != '') {
        var reg = new RegExp(prevContent, "g");
        var regExec = reg.exec(textObj.value);
    }
    if (document.all && textObj.createTextRange && textObj.caretPos) {
        var caretPos = textObj.caretPos;
        if (caretPos == "null") {
            if (!regExec) textObj.value += textFeildValue;
            textObj.value = textObj.value.replace(reg, textFeildValue);
        }
        else {
            if (!regExec) caretPos.text += caretPos.text.charAt(caretPos.text.length - 1) == '' ? textFeildValue + '' : textFeildValue;
            textObj.value = textObj.value.replace(reg, textFeildValue);
        }

    }
    else if (textObj.setSelectionRange) {
        var rangeStart = textObj.selectionStart;
        var rangeEnd = textObj.selectionEnd;
        var tempStr1 = textObj.value.substring(0, rangeStart);
        var tempStr2 = textObj.value.substring(rangeEnd);
        if (!regExec) textObj.value = tempStr1 + textFeildValue + tempStr2;
        textObj.value = textObj.value.replace(reg, textFeildValue);
        textObj.focus();
        var len = textFeildValue.length;
        textObj.setSelectionRange(rangeStart + len, rangeStart + len);
        textObj.blur();
    }
    else {
        if (!regExec) textObj.value += textFeildValue;
        textObj.value = textObj.value.replace(reg, textFeildValue);
    }
    text.attr('prevContent', textFeildValue)
}

//加载短信数据显示
var loadUsrSmsList = function(classid, currentpage) {
    var PostXML =
    {
        SaveBox_Xml: "\
<object>\
<int name=\"actionId\">0</int>\
<string name=\"smsIds\"></string>\
<string name=\"sourceType\"></string>\
<int name=\"searchDateType\"></int>\
<string name=\"keyWord\"></string>\
<int name=\"pageSize\">10</int>\
<int name=\"pageIndex\">" + currentpage + "</int>\
<int name=\"destId\">0</int>\
<string name=\"content\"></string>\
<int name=\"saveType\">-1</int>\
<int name=\"classId\">" + classid + "</int>\
<string name=\"className\"></string>\
</object>"
    }
    var getUrl1 = mbs + "?func=sms:setSmsBox&sid=" + window.top.UserData.ssoSid + "&rnd=" + Math.random();
    $.ajax(
         {
             type: "post", //使用post方法访问后台
             contentType: "application/xml;charset:utf-8",
             dataType: "json", //返回json格式的数据
             url: getUrl1,
             //                data: {actionId:5,destId:savebox.destId,classId:"-1",rnd:Math.random()},
             data: PostXML["SaveBox_Xml"],
             error: function(err) { top.FloatingFrame.alert(err.statusText); },
             success: function(data) {
                 var totalPage = 0;
                 if (data.code == "S_OK") {
                     totalPage = data["var"].pageCount;
                     window.parent.smsState.smsClassID = classid;
                     if (window.location.href.indexOf("UserSMS.html") <= 0) {
                         window.location.href = "UserSMS.html";
                         window.parent.smsState.smsCount = totalPage;
                         return;
                     }
                     //如果设置了加密码的没有解密的弹出验证框
                     if (data["var"].isSetPwd == 1 && data["var"].isDecrypt == 0) {
                         validatePassword(classid);
                     }
                     else {

                         window.parent.smsState.smsDecrypt = 1;
                         $(".add-lock").hide();
                         if (totalPage == 0) {
                             $(".sms-list").html("");
                             window.parent.smsState.smsCount = 0; //短信条数
                             $("#pNoSmsList").show();
                             $(".prov").hide();
                             $(".next").hide();
                             $(".link").hide();
                             $(".shenglanpager").hide();

                             var allheight = 0;
                             $(".cate").each(function() {
                                 allheight += $(this).height();
                             })
                             allheight += $(".hd").height();
                             var heig = 410 - allheight + 55;

                             if (heig > 10)
                                 $(".adc-bd").height(heig);

                             return;
                         }
                         else {

                             $("#pNoSmsList").hide();


                             initSelect(classid, totalPage, currentPage);
                             var strsms = "";
                             $.each(data["var"].table, function(i, item) {
                                 strsms += "<li><p>" + item.content.encode().replace('[发自139邮箱]', '') + "</p></li>";
                             });
                             $(".sms-list").html(strsms);
                             $(".sms-list li").hover(function() {
                                 $(this).addClass("current");
                             }, function() {
                                 $(this).removeClass("current");
                             });
                             //插入短信内容
                             $(".sms-list li > p").click(function() {

                                 top.addBehaviorExt({
                                     actionId: 20015,
                                     thingId: 0,
                                     moduleId: 15
                                 });

                                 //							var context = $(window.parent.document).find("#txtContent").val();
                                 //							if (context.length > 0 && context != "") 
                                 //								$(window.parent.document).find("#txtContent").val(context+ $.trim($(this).html().decode()));
                                 //							else 
                                 //								$(window.parent.document).find("#txtContent").val($.trim($(this).html().decode()));
                                 setCaret("txtContent");
                                 insertAtCaret("txtContent", $.trim($(this).html().decode()));
                                 //光标定
                                 try {
                                     //IE

                                 }
                                 catch (e) {
                                     try {
                                         //FireFox
                                         $(window.parent.document).find("#txtContent")[0].setSelectionRange($(window.parent.document).find("#txtContent").val().length, $(window.parent.document).find("#txtContent").val().length);
                                         $(window.parent.document).find("#txtContent").focus();
                                     }
                                     catch (e) {
                                     }
                                 }
                             });
                         }
                     }
                 }
                 else {
                     new window.parent.CommonPage().goErrorPage();
                 }
             }
         });
}

//初使化下拉框和第一页和上一页
var initSelect = function(classid, pagecount, currentpage) {




    if (pagecount == 1) {
        $(".prov").hide();
        $(".next").hide();
        $(".link").hide();
        $(".shenglanpager").hide();
        var allheight = 0;
        $(".cate").each(function() {
            allheight += $(this).height();
        })
        allheight += $(".hd").height();
        var heig = 410 - allheight + 55;
        if (heig > 10)
            $(".adc-bd").height(heig);
    }
    else {

        if (pagecount > 1) {
            var allheight = 0;
            $(".cate").each(function() {
                allheight += $(this).height();
            })
            allheight += $(".hd").height();
            var heig = 410 - allheight;
            if (heig > 10)
                $(".adc-bd").height(heig);

            if (currentpage == 1) {
                $(".next").show();
                $(".prov").hide();
            }
            else
                if (currentpage == pagecount) {
                $(".prov").show();
                $(".next").hide();
            }
            else {
                $(".prov").show();
                $(".next").show();
            }
            $(".link").show();
        }
        $(".shenglanpager").show();

        $(".next").unbind("click");
        $(".prov").unbind("click");
        $(".link").unbind("change");

        $(".next").bind("click", function() {
            if (window.currentPage < pagecount)
                window.currentPage++;
            else
                window.currentPage = pagecount;
            loadUsrSmsList(classid, currentPage);
            return false;
        });
        $(".prov").bind("click", function() {
            if (currentpage == 1)
                window.currentPage = 1;
            else
                window.currentPage--;
            loadUsrSmsList(classid, currentPage);
            return false;
        });
        var item = new Option(classid, i + "/" + pagecount + "页");

        $(".link").each(function() {
            this.options.length = 0;
            for (var i = 1; i <= pagecount; i++) {
                var text = i + '/' + pagecount + '页';
                var item = new Option(text, i);
                this.options.add(item);
            }
            for (var i = 0; i < pagecount; i++) {
                if (this.options[i].value == currentpage)
                    this.options[i].selected = true;
            }
        });
        $(".link").bind("change", function() {
            currentPage = $(this).val();
            loadUsrSmsList(classid, currentPage);
            return false;
        });
    }
}

function validatePassword(classid) {
    $("#pNoSmsList").hide();
    $(".add-lock").show();
    //提交验证用户密码
    $("#decrybtm").click(function() {
        if ($("#txtpassword").val().length == 0) {
            top.FloatingFrame.alert(window.parent.SMSMessage["SetEmptyPasswordformValid"]);
            $("#txtpassword").focus();
            return;
        }
        else {
            var password = escape($("#txtpassword").val());
            var getUrl2 = mbs + "?func=sms:setSmsConfig&sid=" + window.top.UserData.ssoSid + "&rnd=" + Math.random();

            $.ajax({
                type: "post", //使用post方法访问后台
                contentType: "application/xml;charset:utf-8",
                dataType: "json", //返回json格式的数据
                url: getUrl2,
                //data: String.format(PostXML["Config_Xml"], 2, "", password, ""),
                data: "\<object>\<int name=\"actionId\">2</int>\<int name=\"isSave\">1</int>\<string name=\"npwd\">" + password + "</string>\<string name=\"opwd\"></string>\</object>",
                error: function(err) { top.FloatingFrame.alert(err.statusText); },
                success: function(result) {
                    if (result.code == "S_OK") {
                        $(".add-lock").hide();
                        window.parent.smsState.smsDecrypt = 1;
                        loadUsrSmsList(classid, 1);
                    }
                    else {
                        top.FloatingFrame.alert(result.summary);
                    }
                }
            });
        }
    });
}

//返回连接的字符串
var ReStrURL = function(str) {
    switch (str) {
        case "new": //最新
            return SmsList.ConstVar.urlPath + "new_1.html";
        case "birthday": //生日为动态信息专区
            return SmsList.ConstVar.urlPath + "18_2_1.html";
        case "Festan": //节假日和周末专区
            var sms = $("#Festan");
            return window.location.href = SmsList.ConstVar.urlPath + sms.attr("parentid") + "_" + sms.attr("classid") + "_1.html";
    }
}



//绑定事件
var eventBind = function() {
    $(".dList li").hover(function() {
        $(this).addClass("hover");
    }, function() {
        $(this).removeClass("hover");
    });
    //短信的鼠标移动
    $(".coluLink").hover(function(e) {
        if ($(this).next()) {
            $(".dList").hide();
            $("#DivShim").hide();
            $(this).next().outerHeight() >= 200 ? $(this).next().height(200) : $(this).next().outerHeight();
            if (Sys.ie != "7.0" && Sys.ie != "6.0") {
                $(this).next().css({
                    "position": "absolute",
                    "top": $(this).offset().top - $(this).outerHeight(),
                    "left": SmsList.Util.GetPageX(this) >= 140 ? (SmsList.Util.GetPageX(this) - $(this).next().width() + $(this).width()) : SmsList.Util.GetPageX(this)
                }).show();
            }
            else {
                $(this).next().css({
                    "position": "absolute",
                    "top": $(this).offset().top - $(this).outerHeight(),
                    "left": SmsList.Util.GetPageX(this) >= 140 ? (SmsList.Util.GetPageX(this) - $(this).next().width() + $(this).width()) : SmsList.Util.GetPageX(this)
                }).show();

                if ($(this).next().attr("class")) {
                    $("#DivShim").attr("zIndex", -1).css({
                        "position": "absolute",
                        "top": $(this).next().offset().top,
                        "left": SmsList.Util.GetPageX(this) >= 140 ? (SmsList.Util.GetPageX(this) - $(this).next().width() + $(this).width()) : SmsList.Util.GetPageX(this),
                        "width": $(this).next().width(),
                        "height": $(this).next().height()
                    }).show();
                }
            }
        }
    }, function(e) {

    });
    $(".coluLink").click(function() {
        var tId = 0;
        //日志上报
        switch ($(this).attr("innerText")) {
            case "泡MM专用":
                tId = 1;
                break;
            case "实用信息":
                tId = 4;
                break;
            case "节日祝福":
                tId = 6;
                break;
            case "红段子":
                tId = 7;
                break;
            case "短信记录":
                tId = 8;
                break;
            default:
                tId = 0;
                break;
        }
        //日志上报
        top.addBehaviorExt({
            actionId: 20011,
            thingId: tId,
            moduleId: 14
        });
    });

    $(".dList").hover(function(e) {
    }, function(e) {
        $(this).hide();
        $("#DivShim").hide();
    });

    //加载用户短信类别事件
    $("#sms li >a").click(function() {
        var aId = 2152;
        var tId = 0;
        //日志上报
        switch ($(this).attr("innerText")) {
            case "我的事务秘书":
                tId = 1;
                break;
            case "我的短信日志":
                tId = 2;
                break;
            case "极品爆笑珍藏":
                tId = 3;
                break;
            case "恋爱传情物语":
                tId = 4;
                break;
            case "经典节日祝福":
                aId = 2154;
                tId = 0;
                break;
            default:
                tId = 0;
                break;
        }
        //日志上报
        top.addBehaviorExt({
            actionId: aId,
            thingId: tId,
            moduleId: 14
        });
        loadUsrSmsList($(this).attr("classid"), 1);
        return false;
    });
}


//工具类js shenglan20100927





SmsList = {};


//脚本中可能用的常量
SmsList.ConstVar = {
    urlPath: top.M139.HttpRouter.getNoProxyUrl("/mw2/sms/uploads/html/SmsList/smslist_")
}


SmsList.Util = {
    //的到样式值
    getStyle: function(elem, name) {
        if (elem.style[name])
            return elem.style[name];
        else
            if (elem.currentStyle)
            return elem.currentStyle[name];
        else
            if (document.defaultView && document.defaultView.getComputedStyle) {
            name = name.replace(/(A-Z)/g, "-$1");
            name = name.toLowerCase();

            var s = document.defaultView.getComputedStyle(elem, " ");
            return s && s.getPropertyValue(name);
        }
        else
            return null;
    },
    //相对于整个文档的X和Y值
    GetPageX: function(elem) {
        return elem.offsetParent ? elem.offsetLeft + SmsList.Util.GetPageX(elem.offsetParent) : elem.offsetLeft;
    },
    GetPageY: function(elem) {
        return elem.offsetParent ? elem.offsetTop + SmsList.Util.GetPageY(elem.offsetParent) : elem.offsetTop;
    },
    //找出相对于父原素的x,y值
    GetParentX: function(elem) {
        return elem.parentNode == elem.offsetParent ? elem.offsetLeft : SmsList.Util.GetPageX(elem) - SmsList.Util.GetPageY(elem.parentNode);
    },
    GetParentY: function(elem) {
        return elem.parentNode == elem.offsetParent ? elem.offsetTop : SmsList.Util.GetPageY(elem) - SmsList.Util.GetPageY(elem.parentNode);
    },
    //全局的设置元素的位置
    SetX: function(elem, pos) {
        elem.style.left = pos + "px";
    },
    SetY: function(elem, pos) {
        elem.style.top = pos + "px";
    },
    //的到高度
    GetHeight: function(elem) {
        return parseInt(SmsList.Util.getStyle(elem, 'height'));
    },
    //的到宽度
    GetWidht: function(elem) {
        return parseInt(SmsList.Util.getStyle(elem, 'width'));
    },
    //元素隐藏也能的到高度和宽度
    fullHeight: function(elem) {
        if (SmsList.Util.getStyle(elem, 'display') != 'none')
            return elem.offsetHeight || SmsList.Util.GetHeight(elem);


        var old = resetCSS(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });

        var h = elem.clientHeight || SmsList.Util.GetHeight(elem);

        SmsList.Util.resetCSS(elem, old);

        return h;
    },
    fullWidth: function(elem) {
        if (SmsList.Util.getStyle(elem, 'display') != 'none')
            return elem.offsetWidth || SmsList.Util.GetWidth(elem);
        var old = SmsList.Util.resetCSS(elem, {
            display: '',
            visibility: 'hidden',
            position: 'absolute'
        });

        var w = elem.clientWidth || SmsList.Util.GetWidth(elem);

        SmsList.Util.restoreCSS(elem, old);
        return w;
    },
    resetCSS: function(elem, prop) {
        var old = {};
        for (var i in prop) {
            old[i] = elem.style[i];
            elem.style[i] = prop[i];
        }
        return old;
    },
    restoreCSS: function(elem, prop) {
        for (var i in prop) {
            elem.style[i] = prop[i];
        }
    },
    pageHeight: function() {
        return document.body.scrollHeight;
    },
    pageWith: function() {
        return document.body.scrollWidth;
    }
}

//end shenglan
top.loadScript("jquery.js", document);
parent.Utils.addEvent(window, "onload", initPage);
//loadScript(resourcePath+"/js/jquery.js",initPage);