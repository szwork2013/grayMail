
(function ($, M139) {

    var CalendarShare = {
        el: "#shareCalendarEmail",
        tfootId: "#shareCalendarFoot",
        name: "M2012.Calendar.View.ShareActivity",
        templates: {
            ADD_CALENDAR: [ //添加到我的日历按钮
                '<table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;  border-spacing:0; padding:0; margin:0;font-size:12px; width:464px;">',
                    '<tbody>',
                        '<tr>',
                            '<td colspan="2" height="15"></td>',
                        '</tr>',
                        '<tr>',
                            '<td colspan="2" height="20" style="border-top:1px dashed #dddcdc;"></td>',
                        '</tr>',
                        '<tr>',
                            '<td colspan="2">',
                                '<a href="javascript:void(0);" style="color:#fff; width:134px; height:28px; text-decoration:none; line-height:28px; text-align:center; background-color:#00b615; display:inline-block;">添加到"我的日历"</a>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>'
            ].join("")
        },
        inputIds: { //所有隐藏域的ID 和对应的字段
            "#shareCalendarTitle": "title",
            "#shareCalendarContent": "content",
            "#shareCalendarSite": "site",
            "#shareCalendarSendInterval": "sendInterval",
            "#shareCalendarAllDay": "allDay",
            "#shareCalendarDtStart": "dtStart",
            "#shareCalendarDtEnd": "dtEnd",
            "#shareCalendarCalendarType": "calendarType",
            "#shareCalendarWeek": "week"
        },
        STATUS: {
            NORMAL: 0, //普通未点击状态
            ADDING: 1 //正在添加活动
        },
        initialize: function () {
            var _this = this;
            var container = $(_this.el, document);

            //保存元素
            _this.elems = {
                table: container,
                tfoot: $(_this.tfootId, container)
            };
            _this.logger = new M139.Logger({ name: _this.name }); //日志上报用
            _this.callAPI = M139.RichMail.API.call;

            //渲染和绑定事件
            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;
            var $elems = _this.elems;
            var tfoot = $elems.tfoot;

            tfoot.css({ cssText: "" }); //去掉右对齐
            tfoot.html(_this.templates.ADD_CALENDAR); //修改页脚内容

            $elems.button = tfoot.find("a").eq(0); //添加到我的日历按钮
        },
        initEvents: function () {
            var _this = this;
            var $elems = _this.elems;
            var $table = $elems.table;
            var $btn = $elems.button;
            var ids = _this.inputIds;
            var status = _this.STATUS;

            var flag = status.NORMAL;
            $btn.click(function (e) {
                var obj = {};

                top.BH("calendar_email_clickshare"); //行为上报

                //各路提示
                if (flag === status.ADDING) {
                    top.$Msg.alert("正在添加活动,请稍候...");
                } else {
                    top.M139.UI.TipMessage.show("正在添加...");
                }

                //从input中获取数据
                for (var id in ids) {
                    var key = ids[id];
                    var dom = $(id, $table);
                    var value = dom.attr("title") || dom.val();
                    obj[key] = value;
                }

                flag = status.ADDING; //正在添加中的标记位
                _this.addCalendarAndRedirect(obj, function (fail) {
                    if (!!fail) {
                        top.M139.UI.TipMessage.show("添加失败", { delay: 2500, className: "msgRed" });
                    } else {
                        top.M139.UI.TipMessage.hide();
                    }
                    flag = status.NORMAL; //添加完成.普通标记位
                });
            });

            _this.logger.info("EMAIL_SHARE_ACTIVITY_LOADED", true); //加载完JS完成上报条日志.省的又没得查
        },
        isBeforeNow: function (dateStr) {
            //是不是比现在的时间更早
            dateStr = dateStr || ""; //容错

            var date = M139.Date.parse(dateStr);
            return new Date() - date > 0;
        },
        addCalendarAndRedirect: function (params, callback) {
            var _this = this;

            params = $.extend(params, {
                //按时间需求配置的参数,比现在早,就不提醒了
                enable: _this.isBeforeNow(params.dtStart) ? 0 : 1
            }, {
                //默认参数
                comeFrom: 0,
                labelId: 10,
                recMySms: 0,
                recMyEmail: 1,
                beforeTime: 15,
                beforeType: 0,
                recMobile: "",
                recEmail: "",
                validImg: ""
            });

            var apiName = "calendar:addCalendar";
            _this.callAPI(apiName, params, function (result) {
                var data = result && result.responseData;
                var fail = false;
                if (data && data.code == "S_OK") {
                    var calendarInfo = data["var"] || {};
                    var seqNo = calendarInfo.seqNo;
                    top.$App.show("addcalendar", "&seqno=" + seqNo); //addcalendar????????

                    
                } else {
                    //失败上报条日志.特殊字段用于统计
                    _this.logger.info([
                        "ADD_EMAIL_SHARE_ACTIVITY_FAIL",
                        M139.JSON.stringify(params),
                        (result && result.responseText) || ""
                    ].join("|"), true);

                    fail = true;
                }

                typeof callback == 'function' && callback(fail);
            });
        }
    };

    //运行
    CalendarShare.initialize();

})(jQuery, top.M139);