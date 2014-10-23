/**
 * 查看活动相关的通知邮件时需加载的JS
 * 活动包括: 邀请的活动, 自己创建的活动，共享的活动，订阅的活动
 * 订阅邮件的聚合邮件也在此JS中处理
 * 收到来自从写信页过来的会议邀请读信
 */
var meetingInviteObj = (function () {
    var api = top.M139.RichMail.API;
    var calendarInfo = {
        calendarInitialMsg: $("#meetingInviteOp", document),  // 初始包含"接收","取消"按钮的容器
        calendarId: $("#meetingInviteOp", document).attr("calendarid"),  // 活动id
        operateNode : $("#meetingInviteOp>tbody", document).children(":last"), // 被操作的节点, 直属于tbody下面的最后一个tr元素
        template : { // 包含接受，拒绝，取消的模板
            accept : [
                '<tr>',
                   '<td height="50" colspan="3" style="font-size:12px;border-top:1px solid #e8e8e8; text-align:center; color:#444;">',
                        '您已成功接受，<a href="javascript:;" style="color: rgb(26, 117, 202); text-decoration: none; cursor: pointer;">去日历查看该活动</a>',
                   '</td>',
                '</tr>'
            ].join(""),
            refuse : [
                '<tr>',
                    '<td>您已成功谢绝</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join(""),
            cancel : [
                '<tr>',
                    '<td>此活动已被取消</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join("")
        }
    };

    // 修正calendarid,如果calendarid不存在(div元素上没有calendarid属性),直接从超链接的href上获取
    try {
        if (!calendarInfo.calendarId) {
            var hrefEl = calendarInfo.calendarInitialMsg.find("a");

            if (hrefEl && hrefEl.length > 0) {

                var hrefVal = hrefEl.get(1);
                //处理没有添加附件的情况
                if (!hrefVal){
                    hrefVal = hrefEl.get(0);
                }

                var calendarId = Number(top.$Url.queryString("calendarId", hrefVal.href));

                if (calendarId) {
                    calendarInfo.calendarId = calendarId;
                }
            }
        }
    } catch (e) {

    }

    /**
     * 获取活动的初始状态
     * @param fnSuccess
     * @param fnError
     * @param calendarId 活动ID
     * @param type 活动类型
     */
    function getCalendar(fnSuccess, fnError, calendarId, type) {
        var param = {
            comeFrom: 0,
            seqNo: calendarId ? calendarId : calendarInfo.calendarId,// 从页面带过来的活动ID
            type: type || 1
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:getCalendar", param, fnSuccess, fnError);
        }
    }

    /**
     * 拒绝或接受邀请的活动
     * @param actionType // 0:接受； 1：拒绝
     * @param fnSuccess // 调用接口成功后所做的操作
     * @param fnError
     */
    function operateCalendar(actionType, fnSuccess, fnError) {
        var param = {
            comeFrom: 0,
            seqNos: calendarInfo.calendarId, // 从页面带过来的活动ID
            actionType: actionType,    //0:接受； 1：拒绝
            refuseResion: ''
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:updateInviteStatus", param, fnSuccess, fnError);
        }
    }

    /**
     * 替换节点之后, 需要重新获取操作节点
     * @returns {*}
     */
    function getOperateNode() {
        return calendarInfo.calendarInitialMsg.find("tr:last");
    }

    /**
     * 获取当前邀请活动的状态,根据不同的状态显示不同的展示界面
     */
    function getCalendarStatus() {
        function accept() {

            // 替换成接收活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.accept);

            // 替换节点之后, 重新通过getOperateNode方法获取操作节点
            getOperateNode().children(":first").find("a").unbind("click").click(function () {
                top.$App && top.$App.show("calendar_act_view", {
                    id: calendarInfo.calendarId,
                    type: 1
                });
                return false; // 阻止超链接跳转
            }).css({ cursor: "pointer" });
        }

        function refuse() {
            // 替换成拒绝活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.refuse);
        }

        function cancel() {
            // 替换成取消活动的模板
            calendarInfo.operateNode.replaceWith(calendarInfo.template.cancel);
        }
        /**
         * 遍历inviteInfo数组,如果resultObj.operatorUin与数组元素对象的inviterUin相等
         * 则该元素的status即为要获取的值
         * @param resultObj
         */
        function getStatus(resultObj) {
            var operatorUin = resultObj.operatorUin,
                inviteInfoArr = [].slice.call(resultObj.inviteInfo),
                status; // 默认值直接从返回值获取
            for (var i = 0; i < inviteInfoArr.length; i++) {
                if (inviteInfoArr[i].inviterUin == operatorUin) {
                    status = inviteInfoArr[i].status;
                    break;
                }
            }

            return status;
        }

        getCalendar(function (res) {
            var response = res.responseData;
            if (!response.code) {
                return;
            }

            if (response.code == 'S_OK') {
                // 只处理返回正确报文的情况
                var status = getStatus(response["var"]);
                if (status == 0) { // 未处理状态
                    calendarInfo.calendarInitialMsg.show();
                } else if (status == 1) { //接收
                    accept();
                } else if (status == 2) { //拒绝
                    refuse();
                }
                return;
            }

            if (response.code == 'FS_UNKNOW') {
                // 活动已经被邀请者删除,则表示该活动已经取消, 这里如果返回错误的返回码，就认为该活动已经取消
                cancel();
            }
        }, function () {
            // call interface exception::
            calendarInfo.calendarInitialMsg.show(); // 调用接口发生异常时显示初始状态
        });
    }

    function initEvents() {
        calendarInfo.operateNode.children(":first").find("a:eq(0)").unbind().click(function () {// "接收"邀请活动时的操作
            // todo 是否需要做延迟处理,防止用户重复点击??
            top.BH && top.BH({key:"readmail_add_calendar"});
            operateCalendar(0, function (response) {
                if (response.responseData.code == "S_OK") {
                    
                    getCalendarStatus();
                }
            }, function () {
                // Exception doNothing
            });
            return false;// 阻止超链接跳转
        });
      
       
    }

    function init() {
        var calendars = calendarInfo.calendarInitialMsg.parents("body").find("table #meetingInviteOp"),
            firstCalendar = calendars.get(0),// 先拿到第一个table元素, 可能有多个(比如说聚合邮件)
            aLink = $(firstCalendar).find("a"); // 查看table元素中的所有超链接元素

        initEvents();
        // 初始化时就需要调用一次接口
        getCalendarStatus();
        return;


    }

    return {
        work: init
    };
})();


