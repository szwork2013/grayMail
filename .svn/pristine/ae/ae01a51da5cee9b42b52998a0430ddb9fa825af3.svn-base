; (function () {
    var api = top.M139.RichMail.API;
    var labelInfo = {
        labelInitialMsg: $("#shareLabel", document),  // 初始包含"接收","取消"按钮的容器
        labelId: $("#shareLabel", document).attr("labelId"),  // 活动id
        operateNode: $("#shareLabel>tbody", document).children(":last"), // 被操作的节点, 直属于tbody下面的最后一个tr元素
        template: { // 包含接受，拒绝，取消的模板
            accept: [
                '<tr>',
                    '<td>您已成功接受，<a style="color:#1a75ca; text-decoration:none;" href="javascript:;">查看该日历</a></td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join(""),
            refuse: [
                '<tr>',
                    '<td>您已成功谢绝</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join(""),
            cancel: [
                '<tr>',
                    '<td>此日历已被取消</td>',
                    '<td style="text-align:right; line-height:24px;">',
                        '<a style="text-decoration:none; color:#799ecf;" href="javascript:;" onclick="top.$App && top.$App.show(' + "'calendar'" + ');top.BH(' + "'calendar_invite_view139_click'" + ');">来自139邮箱日历</a>',
                    '</td>',
                '</tr>'
            ].join("")
        }
    };

    // 修正labelId,如果labelId不存在(div元素上没有labelId属性),直接从超链接的href上获取
    /**
    try {
        if (!labelInfo.labelId) {
            var hrefEl = labelInfo.labelInitialMsg.find("a");
            if (hrefEl && hrefEl.length > 0) {
                var labelId = Number(top.$Url.queryString("labelId", hrefEl.get(0).href));
                if (labelId) {
                    labelInfo.labelId = labelId;
                }
            }
        }
    } catch (e) {

    }*/

    /**
     * 获取活动的初始状态
     * @param fnSuccess
     * @param fnError
     */
    function getLabelById(fnSuccess, fnError) {
        var param = {
            comeFrom: 0,
            labelId: labelInfo.labelId// 从页面带过来的活动ID
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:getLabelById", param, fnSuccess, fnError);
        }
    }

    /**
     * 拒绝或接受共享的日历
     * @param actionType // 0:接受； 1：拒绝
     * @param fnSuccess // 调用接口成功后所做的操作
     * @param fnError
     */
    function processLabel(params, fnSuccess, fnError) {
        var param = {
            comeFrom: 0,
            seqNos: labelInfo.labelId, // 从页面带过来的日历ID
            actionType: params.actionType,    //0:接受； 1：拒绝
            refuseResion: params.refuseResion || '',
            type: 'email'
        };

        if (api && typeof api.call === 'function') {
            api.call("calendar:processShareLabelInfo", param, fnSuccess, fnError);
        }
    }

    /**
     * 替换节点之后, 需要重新获取操作节点
     * @returns {*}
     */
    function getOperateNode() {
        return labelInfo.labelInitialMsg.find("tbody tr:last");
    }

    /**
     * 获取当前邀请活动的状态,根据不同的状态显示不同的展示界面
     */
    function getLabelStatus() {
        function accept() {
            // 替换成接收日历的模板
            labelInfo.operateNode.replaceWith(labelInfo.template.accept);

            // 替换节点之后, 重新通过getOperateNode方法获取操作节点
            getOperateNode().children(":first").find("a").unbind("click").click(function () {
                top.$App && top.$App.show("calendar_viewlabel", {
                    id: labelInfo.labelId,
                    isgroup: labelInfo.isGroup
                });
                return false; // 阻止超链接跳转
            }).css({ cursor: "pointer" });
        }

        function refuse() {
            // 替换成拒绝日历的模板
            labelInfo.operateNode.replaceWith(labelInfo.template.refuse);
        }

        function cancel() {
            // 替换成取消日历的模板
            labelInfo.operateNode.replaceWith(labelInfo.template.cancel);
        }

        /**
         * shareInfo,如果resultObj.operatorUin与数组元素对象的shareUin相等
         * 则该元素的status即为要获取的值
         * @param resultObj
         */
        function getStatus(resultObj) {
            var operatorUin = resultObj.operatorUin,
                shareInfoArr = [].slice.call(resultObj.shareInfo),
                status; // 默认值直接从返回值获取
            for (var i = 0; i < shareInfoArr.length; i++) {
                if (shareInfoArr[i].shareUin == operatorUin) {
                    status = shareInfoArr[i].status;
                    break;
                }
            }

            return status;
        }

        getLabelById(function (res) {
            var response = res.responseData;
            if (!response.code) {
                return;
            }

            if (response.code == 'S_OK') {
                // 只处理返回正确报文的情况
                var status = getStatus(response["var"]);
                if (status == 0) { // 未处理状态
                    labelInfo.labelInitialMsg.show();
                } else if (status == 1) { //接收
                    accept();
                } else if (status == 2) { //拒绝
                    // refuse();
                }
                return;
            }

            if (response.code == 'FS_UNKNOW') {
                // errorCode为2表示拒绝该日历, 为999表示共享者已经删除了该日历
                (response.errorCode == 2) ? refuse() : cancel();
            }
        }, function () {
            // call interface exception::
            labelInfo.labelInitialMsg.show(); // 调用接口发生异常时显示初始状态
        });
    }

    function initEvents() {
        labelInfo.operateNode.children(":first").find("a:eq(0)").unbind().click(function () {// "接收"邀请活动时的操作
            // todo 是否需要做延迟处理,防止用户重复点击??
            processLabel({ actionType: 0 }, function (response) {
                if (response.responseData.code == "S_OK") {
                    getLabelStatus();
                }
            }, function () {
                // Exception doNothing
            });
            return false;// 阻止超链接跳转
        });

        labelInfo.operateNode.children(":first").find("a:eq(1)").unbind().click(function () { // "谢绝"邀请活动时的操作
            // todo 是否需要做延迟处理,防止用户重复点击??
            new RefusePopup({
                target: $(this),
                onSubmit: function (reason) {
                    processLabel({ actionType: 1, refuseResion: reason }, function (response) {
                        if (response.responseData.code == "S_OK") {
                            getLabelStatus();
                        }
                    }, function () {
                        // Exception doNothing
                    });
                }
            });
            return false;// 阻止超链接跳转
        });

        // 点击""来自139邮箱日历"链接
        labelInfo.operateNode.children(":last").find("a").unbind().click(function () { // "来自139邮箱日历"
            top.$App && top.$App.show('calendar');
            top.BH && top.BH("calendar_invite_view139_click"); //行为上报
            return false;
        });
    }

    function init() {
        var labels = labelInfo.labelInitialMsg.parents("body").find("table #shareLabel");

        if (labels.length == 1) {
            // 只有一个，表示发送更新的邮件
            labelInfo.operateNode.find("a#from139").unbind().click(function () { // "来自139邮箱日历"
                top.$App && top.$App.show('calendar');
                top.BH && top.BH("calendar_invite_view139_click"); //行为上报
                return false;
            });
            return;
        }

        // 处理发送过来的共享日历邮件, 这里如果同名的table有两个的话就认为它是一般的共享邮件
        // 只处理第二个table
        labelInfo.labelInitialMsg = $(labels[1]);
        var href = labelInfo.labelInitialMsg.find("a").get(0).href;

        labelInfo.operateNode = $(labels[1]).find(">tbody").children(":last");
        labelInfo.labelId = Number(top.$Url.queryString("labelId", href));
        labelInfo.isGroup = Number(top.$Url.queryString('isGroup', href) || '');

        initEvents();
        // 初始化时就需要调用一次接口
        getLabelStatus();
    }

    init();
})();
