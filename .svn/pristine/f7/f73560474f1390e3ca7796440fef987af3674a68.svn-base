var mb = "";
if (top.isRichmail) {
    mb = "/sms";
}
$(function() {
    changeBtn(0);
    $(".seedSmsList2 tr").mouseover(function() {
        $(this).removeClass();
        $(this).addClass("tab_Over");
    });
    $(".seedSmsList2 tr").mouseout(function() {
        $(this).removeClass();
        $(this).addClass("tab_Out");
    });

    var index = 0;
    var isMoving = false;
    $("#navLeft").click(function() {
        if (!isMoving && index > 0) {
            var oldLeft = parseInt($("#sdsNavMenu1 ul").css("margin-left"));
            var left = oldLeft + $("#sdsNavMenu1 ul li").eq(index - 1).width();
            isMoving = true;
            $("#sdsNavMenu1 ul").animate({ marginLeft: left }, "slow", function() { isMoving = false });
            index--;
            changeBtn(index);
        }
    });
    $("#navRight").click(function() {
        if (!isMoving && index < $("#sdsNavMenu1 ul li").length) {
            var oldLeft = parseInt($("#sdsNavMenu1 ul").css("margin-left"));
            var left = oldLeft - $("#sdsNavMenu1 ul li").eq(index).width();
            isMoving = true;
            $("#sdsNavMenu1 ul").animate({
                marginLeft: left
            }, "slow", function() {
                isMoving = false
            });
            index++;
            changeBtn(index);
        }
    });

    //2009-3-2
    var focusItem = $("#sdsNavMenu1 li.sdsNavMenuOn")[0];
    if (focusItem) {
        var containerWidth = $("#sdsNavMenu1").width();
        var itemWidth = $(focusItem).width();
        var offsetLeft = focusItem.offsetLeft;
        var realOffsetLeft = itemWidth + offsetLeft - containerWidth;
        if (realOffsetLeft > 0) {
            $("#sdsNavMenu1 ul").css("margin-left", -realOffsetLeft)
            index = Math.ceil(realOffsetLeft / itemWidth);
            changeBtn(index);
        }
    }

    var subIndex = 0;
    var subIsMoving = false;
    $("#linkLeft").click(function() {
        if (!subIsMoving && subIndex > 0) {
            var oldLeft = parseInt($("div.seedSmsListTitle1:eq(0)").css("margin-left"));
            var left = oldLeft + $("div.seedSmsListTitle1:eq(0) > a").eq(subIndex - 1).width() + 10;
            subIsMoving = true;
            $("div.seedSmsListTitle1:eq(0)").animate({ marginLeft: left }, "slow", function() { subIsMoving = false });
            subIndex--;
        }
    });
    $("#linkRight").click(function() {
        if (!subIsMoving && subIndex < $("div.seedSmsListTitle1:eq(0) > a").length) {
            var oldLeft = parseInt($("div.seedSmsListTitle1:eq(0)").css("margin-left"));
            var left = oldLeft - $("div.seedSmsListTitle1:eq(0) > a").eq(subIndex).width() - 10;
            if ($("div.seedSmsListTitle1:eq(0)").width() - 500 + left + $("div.seedSmsListTitle1:eq(0) > a").eq(index + 1).width() > 0) {
                subIsMoving = true;
                $("div.seedSmsListTitle1:eq(0)").animate({
                    marginLeft: left
                }, "slow", function() {
                    subIsMoving = false
                });
                subIndex++;
            }
        }
    });

    //2009-3-2
    var emptyNode = $("div.seedSmsListTitle1:eq(0) > a");
    if (emptyNode.length > 1 && emptyNode.eq(0).html() == "") emptyNode.eq(0).remove();
    var focusItem = $("div.seedSmsListTitle1:eq(0) > a.sstOn")[0];
    if (focusItem) {
        var containerWidth = 720;
        var itemWidth = $(focusItem).width();
        var offsetLeft = itemWidth;
        $(focusItem).prevAll().each(function() {
            if ($(this).width()) offsetLeft += $(this).width() + 10;
        });
        var realOffsetLeft = itemWidth + offsetLeft - containerWidth;
        if (realOffsetLeft > 0) {
            $("div.seedSmsListTitle1:eq(0)").css("margin-left", -realOffsetLeft)
            subIndex = Math.ceil(realOffsetLeft / itemWidth);
        }
    }

    //返回
    $(".seedSmsBack a").click(function() {
        top.SmsContent = "";
        if (Utils.getCookie("isReadUser" + window.top.UserData.ssoSid) != "0")//红名单用户提交到短信发送
        {
            //$("#smsid").val($(this).parent().parent().find("td input").val());
            //$("#smscontent").val($(this).parent().parent().find(".order1").text());
            //            $("form").submit();
            window.location.href = mb + "/smsmms/freesms/freesend.html";
        }
        else {
            //top.SmsContent = escape($(this).parent().parent().find(".order1 a").text());
            window.location.href = mb + "/smsmms/superman/send.htm?from={0}".format("2");
        }
    });

    //新增跳转shenglan
    $(".order1.fd a").click(function() {

        top.addBehaviorExt({
            actionId: 20015,
            thingId: 0,
            moduleId: 15
        });
        top.SmsContent = escape($(this).parent().parent().find(".order1 a").text());
        if (Utils.getCookie("isReadUser" + window.top.UserData.ssoSid) != "0")//红名单用户提交到短信发送
        {
            //		    $("#smsid").val($(this).parent().parent().find("td input").val());
            //            $("#smscontent").val($(this).parent().parent().find(".order1").text());
            //            $("form").submit();            
            window.location.href = mb + "/smsmms/freesms/freesend.html?smsid={0}".format($(this).parent().parent().find("td input").val());

        }
        else {
            //            top.SmsContent = escape($(this).parent().parent().find(".order1 a").text());
            window.location.href = mb + "/smsmms/superman/send.htm?from={0}".format("2");
        }
    });
    //修改一般用户的发送和红名单的发送
    $("input[name='btnSend']").click(function() {

        top.addBehaviorExt({
            actionId: 20015,
            thingId: 0,
            moduleId: 15
        });

        //红名单用户是提交到短信发送        
        top.SmsContent = escape($(this).parent().parent().find(".order1 a").text());
        if (Utils.getCookie("isReadUser" + window.top.UserData.ssoSid) != "0") {
            //            $("#smsid").val($(this).parent().parent().find("td input").val());
            //            $("#smscontent").val($(this).parent().parent().find(".order1").text());
            //            $("form").submit();
            window.location.href = mb + "/smsmms/freesms/freesend.html?smsid={0}".format($(this).parent().parent().find("td input").val());
        }
        else//一般用户到自写短信发送页
        {
            window.location.href = mb + "/smsmms/superman/send.htm?from={0}".format("2");
        }
    });
    //点击确定入分页
    //$(".btnStrong").click(function(){   

    //    GoUrl();
    //});    

    $(".link").change(function() {
        var current = this.options[this.selectedIndex].text.split('/')[0];
        var href = $(this).attr("url") + current + ".html";
        window.location.href = href;
    });
    //文本框的回车事件
    $("#txtPageCount").keypress(function() {

        if (event.keyCode == 13) {
            GoUrl();
            return false;
        }
    });

    //shenglan 上一页下一页分页
    $(".fcI").click(function() {
        //        var reg=/\d+/;
        //        var result=$("#pagecount").text().match(reg);    
        var current = parseInt($(this).attr("href").split('-')[1]);
        var href = $(".link").attr("url");
        //        if(current==0)
        //            current=1;
        //        else if(current>parseInt(result))
        //            current=current-1;
        href = href + current + ".html";
        window.location.href = href;
        return false;
    });


});

//跳转
function GoUrl() {
    var currentpage = $("#txtPageCount").val();

    if (currentpage.length == 0 && currentpage == "") {
        top.FloatingFrame.alert("请输入要跳转的页面？");
        return;
    }
    var reg = /\d+/;
    var result = $("#pagecount").text().match(reg);

    if (parseInt(result) <= parseInt(currentpage))
        currentpage = parseInt(result);
    if (parseInt(currentpage) <= 0)
        currentpage = 1;
    var href = $(".btnStrong").attr("url");
    href = href + currentpage + ".html";
    if (href.indexOf("hot") != -1) {
        if (currentpage == 1) {
            window.location.href = "index.html";
            return;
        }
    }
    window.location.href = href;

}


function changeBtn(scrollIndex) {
    var box = $("#sdsNavMenu1")[0];
    if (scrollIndex == 0) {
        $("#navLeft").removeClass();
        $("#navLeft").addClass("navLeft");
    }
    else {
        $("#navLeft").removeClass();
        $("#navLeft").addClass("navLeftS");
    }
    if (box.scrollWidth - 700 < box.scrollLeft) {
        $("#navRight").removeClass();
        $("#navRight").addClass("navRight");
    }
    else {
        $("#navRight").removeClass();
        $("#navRight").addClass("navRightS");
    }
}

