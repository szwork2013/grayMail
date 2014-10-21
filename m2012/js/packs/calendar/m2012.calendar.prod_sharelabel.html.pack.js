
/**
 * 拒绝原因
 * @param target {HTMLElement} 需要弹窗的对象,会将html模板添加到对象后面
 * @param onSubmit {Function} 点击确定时的回调,会传入谢绝原因字符串
 * 
 * examples:
 * new RefusePopup({
 *     target:document.getElementById(''),
 *     onSubmit:function(reason){
 *         alert(reason);
 *     }
 * });
 */
; (function ($) {
    function RefusePopup(options) {
        var _this = this;
        _this.options = options;
        _this.callback = options.onSubmit || $.noop;
        _this.all = $("a", document);
        _this.target = $(options.target);
        _this.$el = $(_this.template);
        _this.textarea = _this.$el.find('textarea');
        _this.submit = _this.$el.find('#submit');
        _this.cancel = _this.$el.find('#cancel');

        _this.target.after(_this.$el);

        //计算偏移
        var offset = _this.target.offset();
        var currentTop = offset.top - _this.$el.height() - 10; //稍微偏上
        _this.$el.css('top', currentTop);

        //事件绑定
        bindEvents();

        //关闭浮层
        function closePopup() {
            _this.$el.remove();
        }

        function bindEvents() {
            //页面内点击隐藏浮层
            $(document.body).on('click', function (e) {
                closePopup();
            });

            //在浮层内点击取消事件冒泡
            _this.$el.on('click', function (e) {
                e.stopPropagation(); //阻止冒泡
            });

            //点击确定,回调
            _this.submit.on('click', function (e) {
                var reason = _this.textarea.val();
                reason = reason == _this.placeholderText ? '' : reason; //去掉默认的placeholder
                _this.callback(reason);
                closePopup();
            });

            //点击取消
            _this.cancel.on('click', function () {
                closePopup();
            });

            //给按钮绑定事件
            _this.all.on('click', function () {
                closePopup();
            });

            //设置最大输入长度
            try { top.M139.Dom.setTextBoxMaxLength(_this.textarea, _this.maxLength); } catch (e) { }

            //placeholder
            if (isSupportPlaceholder()) {
                _this.textarea.attr('placeholder', _this.placeholderText).css('color', _this.normalColor);
            } else {
                _this.textarea.on('focus', function (e) {
                    var input = $(this);
                    var text = input.val();
                    if (text == _this.placeholderText) {
                        input.val('').css('color', _this.normalColor);
                    }
                }).on('blur', function (e) {
                    var input = $(this);
                    var text = input.val();

                    if (text.replace(/\s/gi, '') == '') {
                        input.val(_this.placeholderText).css('color', _this.placeholderColor);
                    }
                });

                setTimeout(function () {
                    _this.textarea.trigger('blur');
                }, 0xff);
            }
        }

        function isSupportPlaceholder() {
            return 'placeholder' in document.createElement('input');
        }
    }

    RefusePopup.prototype.placeholderText = '谢绝原因（50个字）';
    RefusePopup.prototype.maxLength = 50; //最大输入长度
    RefusePopup.prototype.normalColor = '#000';
    RefusePopup.prototype.placeholderColor = '#999';
    RefusePopup.prototype.template = ['<div style="z-index: 1001; width: 342px; top: -155px; left: 53px; position:absolute;background: #FEFEFE;border:1px solid #cecece;padding:3px 6px; color:#666; -moz-box-shadow:0 0 5px #cecece; -webkit-box-shadow:0 0 5px #cecece; box-shadow:0 0 5px #cecece; -moz-border-radius:3px; -webkit-border-radius:3px; border-radius:3px; padding:0; margin:0;">',
                     '<div style=" margin:0; padding:0;">',
                         '<div style="padding:10px 10px 5px 10px; margin:0; background-color:#fafafa; -moz-border-radius:3px 3px 0 0; -webkit-border-radius:3px 3px 0 0;  border-radius:3px 3px 0 0;">',
                             '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                 '<div style="overflow:hidden;zoom:1; margin:0; padding:0;">',
                                     '<textarea style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';border:1px solid #c5c5c5;border-top-color:#c6c6c6;border-right-color:#dadada;border-bottom-color:#dadada;padding:4px 5px;height:15px; width: 310px;height: 70px;margin: 8px 0; resize:none; overflow:auto; color:#999;">',
                                         '',
                                     '</textarea>',
                                 '</div>',
                             '</div>',
                         '</div>',
                         '<div style="border-top:1px solid #e8e8e8;text-align:right;height:24px;background-color:#fff;position:relative;padding:6px; margin:0; -moz-border-radius:0 0 3px 3px; -webkit-border-radius:0 0 3px 3px; border-radius:0 0 3px 3px;">',
                             '<a id="submit" href="javascript:void(0)" style="height:24px; line-height:24px; color:#fff; background:#00BE16;  background: -moz-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#00C417), to(#00B615));  background: linear-gradient(#00C417 0%,#00B615 100%); display:inline-block;cursor:pointer;padding:0 0 0 12px; margin:0; overflow:hidden;vertical-align:middle; _background:#00BE16; text-decoration:none;">',
                                 '<span style=" font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\'; height:24px; line-height:24px; color:#fff; display:inline-block;padding:0 12px 0 0; margin:0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '确 定',
                                 '</span>',
                             '</a>',
                             '<a id="cancel" style="height:22px; line-height:22px; border:1px solid #e2e2e2; color:#666 !important; background:#F9F9F9; background: -moz-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4)); background: -webkit-gradient(linear, 0 0, 0 100%, from(#FFFFFF), to(#F4F4F4));  background: linear-gradient(#FFFFFF 0%,#F4F4F4 100%); display:inline-block;cursor:pointer;height:22px;padding:0 0 0 12px;overflow:hidden;vertical-align:middle; margin:0 0 0 5px; text-decoration:none;"',
                             'href="javascript:void(0)">',
                                 '<span style="font:12px/1.5 \'Microsoft YaHei\',Verdana,\'Simsun\';  display:inline-block;line-height:24px;padding:0 12px 0 0;overflow:visible;text-align:center;vertical-align:top;white-space:nowrap;">',
                                     '取 消',
                                 '</span>',
                             '</a>',
                         '</div>',
                     '</div>',
                 '</div>'].join("");

    window.RefusePopup = RefusePopup; //污染window
})(window.jQuery || top.jQuery)

﻿; (function () {
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

