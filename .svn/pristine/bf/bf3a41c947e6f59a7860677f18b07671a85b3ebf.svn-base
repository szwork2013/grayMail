;
(function ($, _, M139, top) {
    var _super = M139.View.ViewBase,
        _class = "M2012.Calendar.View.CalendarDetail";

    M139.namespace(_class, _super.extend({
        name: _class,
        LEFT_SIDEBAR_WIDTH: 170,  // 用于订阅日历详情
        template: {
            MAIN: [
                '<div id="{cid}_outer" class="tips delmailTips createWindow" style="width:600px;z-index:5001;position: absolute;">',
                    '<a id="{cid}_delmailTipsClose" href="javascript:void(0)"><i class="i_u_close"></i></a>',
                    '<div class="tips-text">',
                        '<div class="norTips" style="padding : 24px;">',
                            '<div class="createWindowInfo">',//images\module\calendar_reminder
                                 '<div class="clearfix">',
                                     //'<a href="#"><img title="" alt="aaa" src="../../images/module/calendar2.0/pic_01.jpg"></a>',
                                     '<div class="createWindowNmae" id="{cid}_subscribeInfo">',
                                         '<h2 id="{cid}_labelName">订阅活动</h2>',
                                         '<div class="clearfix">',
                                             '<em id="{cid}_publishInfo">',
                                                  '<span>发布</span> | 人 ',
                                                  '<span>订阅</span>',
                                             '</em>',
                                             '<span class="starFive" >',
                                                 '<span class="starbg"></span>',
                                                 '<span id="{cid}_level" class="starNum"></span>',
                                             '</span>',
                                         '</div>',
                                         /**
                                         '<div class="timeToRemind" id="{cid}_remaind_sms" style="display:none">',
								            '<input type="checkbox" id="{cid}_check_sms" checked><label for="{cid}_check_sms">免费短信提醒</label>',
								            '<p>前一天12：00下发提醒</p>',
							            '</div>',*/
                                         '<div class="timeToRemindOne" id="{cid}_remaind_sms" style="display:none">',
                                             '<div class="fl mt_3">',
                                                 '<input type="checkbox" id="{cid}_check_sms"><label for="{cid}_check_sms">设置提醒</label>',
                                             '</div>',
                                             '<div style="width:80px;display:none;" class="dropDown-ymtime ml_10" id="{cid}_remind_type"></div>',
                                             '<div class="dropDown-ymtime mt_5" style="display:none;" id="{cid}_remind_time"></div>',
                                             '<div class="dropDown-ymtime mt_5" id="{cid}_time" style="margin-left:7px;display:none;"></div>',
                                         '</div>',
                                     '</div>',
                                 '</div>',
                                 '<p>该日历有以下活动，你可以订阅整个日历。</p>',
                                 '<table class="createTableList mt_10" role="grid">',
                                    '<thead>',
                                        '<tr>',
                                            '<th>时间</th>',
                                            '<th>活动</th>',
                                        '</tr>',
                                    '</thead>',
                                 '</table>',
                                 '<div class="createWindowScroll createWindow_scroll" id="{cid}_contentArea">',
                                     '<table class="createTableList" role=grid>',
                                         '<tbody></tbody>',
                                         '<tfoot style="display:none;"><tr><td colspan="2"></td></tr></tfoot>',
                                     '</table>',
                                 '</div>',
                            '</div>',
                        '</div>',
                        '<div class="delmailTipsBtn" style="asdasdoverflow:hidden;">',
                            '<div style="TOP: -35px; RIGHT: 20px;display:none;" class="tips" id="{cid}_tips">',
                                '<div class="tips-text"><i class="i_ok_min"></i><span></span></div>', //订阅成功
                                '<div class="tipsBottom diamond"></div>',
                            '</div>',
                            '<div id="{cid}_btn_mask" style="position:absolute; top:0px; height:30px; top:10px; z-index:1000;" class="blackbanner hide"></div>',
                            '<a class="btnSetG" role=button href="javascript:;" id="{cid}_btn_subscribe"><span>订 阅</span></a>',
                            '<a class="btnSetG" role=button href="javascript:;" id="{cid}_btn_save" style="display:none;"><span>保 存</span></a>',
                            '<a class="btnSet" role=button href="javascript:;" id="{cid}_btn_unSubscribe" style="display:none;"><span>退 订</span></a>',
                            '<a class="btnSet" role=button href="javascript:;" id="{cid}_btn_cancel"><span>取 消</span></a>',
                        '</div>',
                    '</div>',
                '</div>'].join(""),
            DETAIL: ['<tr>',
                            '<td colSpan="2">',
                                '<div class="createTableBox">',
                                    '<div class="createTableTop clearfix">',
                                        '<div class="createTableOne"><i class="i-cHide"></i>{timePeriod}</div>',
                                        '<div class="createTablTwo">{title}</div>',
                                    '</div>',
                                    '<ul class="createTableCon hide">',
                                        '<li class="clearfix" style="display : {isShowContent}">',
                                            '<span>内容：</span>',
                                            '<div class="createTableInfo" style="word-wrap:break-word; word-break:break-all;">{content}</div>',
                                        '</li>',
                                        '<li style="display : {isShowSite}">',
                                            '<span>地点：</span>',
                                            '<div class="createTableInfo">{site}</div>',
                                        '</li>',
                                        '<li class="createTableNo" style="display : {isShowNo}">无更多信息 </li>',
                                    '</ul>',
                                '</div>',
                            '</td>',
                        '</tr>'
            ].join(""),
            ELEMENTS: '<tr><td class="tbBg" colSpan="2">{calendarTime}</td></tr>',//2014年01月17日,
            LIMIT_SECONDS: 3000, // "订阅"或"退订"提示信息在间隔时间后消失
            PAGE_SIZE: 20
        },
        logger: new top.M139.Logger({
            name: "M2012.Calendar.View.CalendarDetail"
        }),
        initialize: function (options) {
            options = options || {};
            var that = this;

            this.model = new M2012.Calendar.Model.CalendarDetail(options);

            this.labelId = Number(options.labelId) || 0; // 日历ID
            this.count = 0; // 计数器，用于记录已经填充的数据条数
            this.pageIndex = 2; // 默认值,默认从第二页开始,如果有多页的话
            this.containerHeight = $(top.document.body).height();
            this.wrap = options.wrap || top.window.document.body;
            this.subscribeFn = options.subscribe || $.noop; //订阅成功的回调
            this.unsubscribeFn = options.unsubscribe || $.noop; //退订成功后的回调
            this.createDetailWindow();

            this.defineElement();
            this.setPosition();// 设置弹出窗口的位置
            this.fillSubscribeInfo(); // 填充弹出窗口顶部的订阅信息
            //this.setPosition();// 设置弹出窗口的位置
            this.showMask();
            this.initEvent(); // 给tfoot绑定事件

            // 设置this.$el,绑定事件
            this.$el = this.outerEl;

            // 初始值,从第一页开始查询
            this.getCalendarsByLabel({
                pageIndex: 1,
                //includeLabels: this.labelId,
                labelId: this.labelId,
                //startDate : this.model.getFormatServerTime(),
                pageSize: this.template.PAGE_SIZE
            });
            $(top.window).resize(function () {
                that.setPosition();
            });

            var remindTypeElement = that.getElement("remind_type"),
                timeElement = that.getElement("remind_time"),
                timeSelectorElement = that.getElement("time"),
                typeItems = [{text : '邮件', value : '01'}, {text : '免费短信', value : '10'}];

            // 创建一个选择时间间隔的下拉菜单
            that.typeComp = new M2012.Calendar.View.CalendarDropMenu().create({
                container: remindTypeElement,
                menuItems: typeItems,
                selectedIndex: 0,
                width: 80,
                maxHeight: 50
            });

            // 设置默认值,提醒方式为邮件提醒
            that.model.set({
                remindType: "01"
            }, {silent: true});

            that.typeComp.on("change", function (item) {
                that.model.set({
                    remindType: item.value
                }, {silent: true});
            });

            var timeItems = [{
                data : {
                    beforeType : 2,
                    beforeTime : 0
                },
                text : '同一天',
                value : '0-2'
            },{
                data : {
                    beforeType : 2,
                    beforeTime : 1
                },
                text : '前一天',
                value : '1-2'
            }, {
                data : {
                    beforeType : 2,
                    beforeTime : 2
                },
                text : '前二天',
                value : '2-2'
            }, {
                data : {
                    beforeType : 2,
                    beforeTime : 3
                },
                text : '前三天',
                value : '3-2'
            }];

            that.timeComp = new M2012.Calendar.View.CalendarDropMenu().create({
                container: timeElement,
                menuItems: timeItems,
                selectedIndex: 1, // 默认选中"前一天"
                width: 75,
                maxHeight: 100
            });

            // 设置默认值, 间隔为同一天
            // beforeType : 提前类型(0分, 1时, 2天, 3周, 4月 )
            that.model.set({
                time: "0-2"
            }, {silent: true});

            that.timeComp.on("change", function (item) {
                that.model.set({time : item.data.beforeTime + "-" + item.data.beforeType}, {silent: true});
            });

            // 创建新的时间选择控件
            that.timer = new M2012.Calendar.View.TimeSelector({
                container: timeSelectorElement,
                time: '0800',
                onChange: function (data) {
                    that.model.set({
                        timeSelector: data.time || ""
                    }, {silent: true});
                }
            });
            // 是否是订阅的公共日历
            that.model.set("isPublish", !!options.isOffical);
        },
        /**
         * 填充表格数据
         * @param detail
         */
        render: function (detail) {
            var that = this,
                data = detail["var"] ? detail["var"].table : {},
                arr = [],
                allCount = detail["var"] ? detail["var"].count : 0,
                calendars = _.groupBy(data, 'startDate'); //按活动的startDate属性进行分组

            // 遍历
            if (calendars && data) {
                for (var calendar in calendars) {
                    if (calendars.hasOwnProperty(calendar)) {
                        var dateListArr = [].slice.call(calendars[calendar]); // 每天的活动
                        // 添加活动信息
                        arr.push($T.format(that.template.ELEMENTS, { calendarTime: calendar }));
                        if (that.old_startDate && that.old_startDate === calendar) {
                            // 如果本页的活动属于上一页最后一条记录(时间)的活动,则不重复创建记录,直接在之前的记录基础上添加
                            arr = [];
                        }

                        if (dateListArr instanceof Array) {
                            for (var i = 0, len = dateListArr.length; i < len; i++) {
                                var calendarInfo = dateListArr[i];
                                // 添加活动详情信息
                                calendarInfo && arr.push($T.format(that.template.DETAIL, that.isShowElement(calendarInfo)));
                                that.count++;
                            }
                        }
                    }

                    // 保存当前页最后一条记录的startDate
                    // 判断点击下一页的活动是否属于上一页最后一条记录(时间)的活动
                    that.old_startDate = calendar;
                }
            }

            // 记录条数超过当页显示条数并且不超过总条数时才会显示tfoot
            // 刚好总条数等于20
            //(that.count !== allCount && that.count + 1 > that.template.PAGE_SIZE) && (((that.count <= allCount) ? that.footTdEl.html("显示更多内容") : that.footTdEl.html("以显示全部内容")) && that.footEl.show());
            //(allCount > that.template.PAGE_SIZE) && (((that.count <= allCount) ? that.footTdEl.html("显示更多内容") : that.footTdEl.html("以显示全部内容")) && that.footEl.show());

            that.showFootContent(allCount);
            $(arr.join("")).appendTo($(that.bodyEl));
        },

        /**
         * 渲染表格foot
         */
        showFootContent: function (allCount) {
            var that = this;

            if (allCount > that.template.PAGE_SIZE) { //超过一页
                if (that.count < allCount) { // 没有查找到最后
                    that.footTdEl.html("显示更多内容");
                    that.footEl.css("cursor", "pointer");
                } else if (that.count === allCount) {
                    that.footTdEl.html("已经显示全部内容");
                    that.footEl.unbind("click").css("cursor", "default");
                }

                that.footEl.show(); // 防止重复绑定
            }
        },
        getCalendarsByLabel: function (data) {
            var that = this;

            that.model.getCalendarsByLabel(data,
                function (detail, text) {
                    that.render(detail);
                    that.bindEvent();
                }, function () {
                    console.log('fnError');
                });
        },
        /**
         * 初始化时就可以绑定
         */
        initEvent: function () {
            var that = this;

            that.unSubscribeBtnEl.click(function () {
                that.unSubscribe();
            });

            that.subscribeBtnEl.click(function () {
                that.subscribe({
                    needNotify : true  // 是否需要通知主控做一些事情(后台发布的订阅日历只需要"保存"), 用来区分
                });
            });

            that.getElement("delmailTipsClose").click(function () {
                that.cancel();
            });

            that.saveBtnEl.click(function (e) {
                that.subscribe();
            });

            that.cancelBtnEl.click(function () {
                that.cancel();
            });

            that.footEl.bind("click", function (e) {
                that.getCalendarsByLabel({
                    pageIndex: that.pageIndex++,
                    //startDate : that.model.getFormatServerTime(),
                    pageSize: that.template.PAGE_SIZE
                });
            });

            that.smsCheckboxEl.click(function() {
                // 复选框按钮绑定事件
                that.model.set("enable", $(this).is(":checked"));
            });

            that.model.on("change", function () {
                if (that.model.hasChanged("enable")) {
                    var enable = that.model.get("enable");

                    // 设置提醒按钮是否选中
                    that.smsCheckboxEl.attr("checked", enable);

                    // 如果enable为true时, 显示设置条件
                    enable ? that.remindSms.children().show() : that.remindSms.children().not(":first").hide();
                }

                if (that.model.hasChanged("isPublish")) {
                    var isPublish = that.model.get("isPublish");
                    // 是否显示设置提醒时间
                    isPublish && that.remindSms.show();
                }

                if (that.model.hasChanged("remindType")) {
                    var remindValue = that.model.get("remindType");
                    // 是短信提醒还是邮件提醒, 01 : 邮件提醒  10: 免费短信提醒
                    that.typeComp && that.typeComp.setSelectedValue(remindValue);
                }

                if (that.model.hasChanged("timeSelector")) {
                    // 设置提醒时间控件的内容
                    var timeSelector = that.model.get("timeSelector");
                    that.timer && that.timer.setData({
                        time : timeSelector
                    });
                }

                if (that.model.hasChanged("time")) {
                    var time = that.model.get("time");
                    that.timeComp && that.timeComp.setSelectedValue(time);
                }

                if (that.model.hasChanged("isShowSaveBtn")) {
                    var isShowSaveBtn = that.model.get("isShowSaveBtn");
                    if (isShowSaveBtn) {
                        // 如果是"已经订阅的后台发布日历", 则显示保存按钮, 隐藏取消按钮
                        that.saveBtnEl.show();
                        that.unSubscribeBtnEl.show();
                        that.cancelBtnEl.hide();
                        that.subscribeBtnEl.hide();
                    }else{
                        // "还未订阅的日历"
                        that.saveBtnEl.hide();
                        that.unSubscribeBtnEl.hide();
                        that.subscribeBtnEl.show();
                        that.cancelBtnEl.show();
                    }
                }
            });
        },
        /**
         * 给整个td绑定点击事件,提供伸缩的功能
         * 在成功回调之后才绑定
         */
        bindEvent: function () {
            var that = this,
                recordsEl = this.outerEl.find("table tbody tr td").not(".tbBg");
            recordsEl.unbind("click").bind("click", function (e) {
                that.toggleDetailContent(e);
            });
        },

        /**
         * 根据title,content的值判断如何显示详情,当title,content都为空时,显示"无更多信息"
         * @param calendar
         * @returns {{content: (*|html.content|obj.content|content|objItem.content|data.content), site: (*|obj.site|window.LinkConfig.mobileWeibo.site|data.account.site|data.sign.site|data.editLockPass.site), title: (*|obj.title|title|html.title|jQuery.title|template.title), isShowContent: string, isShowSite: string, isShowNo: string}}
         */
        isShowElement: function (calendar) {
            return {
                content: calendar.content,
                site: calendar.site,
                title: calendar.title,
                timePeriod: this.model.getTimePeriod(calendar.startTime, calendar.endTime),
                isShowContent: !!calendar.content ? "" : "none",
                isShowSite: !!calendar.site ? "" : "none",
                isShowNo: !(!!calendar.content || !!calendar.site) ? "" : "none"// 只有content,site都为空时才显示
            };
        },
        getElement: function (id) {
            var that = this;
            id = $T.format("#{cid}_{id}", {
                cid: that.cid,
                id: id
            });
            return $(id, top.document);
        },
        defineElement: function () {
            this.outerEl = this.getElement("outer");
            this.unSubscribeBtnEl = this.getElement("btn_unSubscribe");
            this.subscribeBtnEl = this.getElement("btn_subscribe");
            this.saveBtnEl = this.getElement("btn_save");
            this.cancelBtnEl = this.getElement("btn_cancel");
            this.smsCheckboxEl = this.getElement("check_sms");
            this.btn_mask = this.getElement("btn_mask");
            //  this.btn_mask.height(this.btn_mask.parent().height());
            // 内容显示区域
            this.contentAreaEl = this.outerEl.find("#" + this.cid + "_contentArea");

            this.tipsEl = this.outerEl.find("#" + this.cid + "_tips");
            this.bodyEl = this.contentAreaEl.find("table tbody"); // 不能在outerEl查找,在360和搜狗浏览器下会查找出多个元素
            this.footEl = this.contentAreaEl.find("table tfoot"); // 不能在outerEl查找,在360和搜狗浏览器下会查找出多个元素
            this.footTdEl = this.footEl.find("td");

            // 页面顶部的订阅信息节点
            this.publishInfoEl = this.outerEl.find("#" + this.cid + "_publishInfo");
            this.labelNameEl = this.outerEl.find("#" + this.cid + "_labelName");
            this.levelEl = this.outerEl.find("#" + this.cid + "_level");
            this.remindSms = this.outerEl.find("#" + this.cid + "_remaind_sms");

            // 操作失败时的提示信息
            this.fnFailure = function () {
                top.M139.UI.TipMessage.show("操作失败，请重试", {
                    delay: 3000,
                    className: "msgRed"
                });
            };
        },
        showMask: function () { // 显示遮罩层
            var zIndex = this.outerEl.css("z-index") - 1;
            this.mask = top.M2012.UI.DialogBase.showMask({
                zIndex: zIndex
            });
            //this.outerEl.css("visibility", "");
        },
        hideMask: function () { // 隐藏遮罩层
            this.mask && this.mask.hide();
        },
        adjustContentHeight: function () { // 调整内容区域的高度(cid_contentArea)
            if (this.outerEl.height() > this.containerHeight) { // 如果窗口的高度都超过了容器的高度,则按比例调整内容区域的高度
                var height = this.contentAreaEl.height() * (this.containerHeight / this.outerEl.height());
                this.contentAreaEl.height(Math.floor(height));
            }
        },
        createDetailWindow: function () { // 创建显示详情的整体弹出窗
            var that = this,
                template = $T.format(that.template.MAIN, {
                    cid: that.cid
                });

            $(template).appendTo(this.wrap);
        },
        fillSubscribeInfo: function () { // 调用后台接口获取顶部订阅信息并填充
            var that = this;

            // 如果调用接口报异常(官方发布的公开日历), 直接取默认值
            that.model.getPublishedLabelByOper({ comeFrom: 0, seqNo: that.labelId },
                function (detail, text) {
                    var data = detail["var"];
                    if (data) {
                        // 填充订阅活动弹出窗顶部订阅信息
                        that.labelNameEl.text(data.labelName || '订阅活动');
                        that.publishInfoEl.html(data.author + " <span>发布</span> | " + (data.totalSubCount || 0) + "人 <span>订阅</span>");
                        that.levelEl.css("width", (data.activity || 0) * 15);

                        // 填充订阅信息, 如果未订阅, 显示默认后台配置的订阅信息
                        that.model.getLabelById({ labelId: that.labelId },
                            function (response) {
                                if (response["code"] === 'FS_UNKNOW') {
                                    that.model.set({
                                        enable : (parseInt(data.enable) == 1),
                                        remindType : parseInt(data.recMyEmail) ? "01" : "10",
                                        time : data.beforeTime + "-" + data.beforeType,
                                        timeSelector : (data.sendMsgTime || "08:00").replace(":", ""),
                                        isShowSaveBtn : false,
                                        color : data.color // 颜色值, 订阅时需作为参数传递
                                    });

                                    return;
                                }

                                if (response["code"] === 'S_OK') {
                                    /**
                                    var result = (response && response["var"]) || {};
                                    that.model.set({
                                        enable : (parseInt(result.enable) == 1),
                                        remindType : parseInt(result.recMyEmail) ? "01" : "10",
                                        time : result.beforeTime + "-" + result.beforeType,
                                        timeSelector : (result.sendMsgTime || "08:00").replace(":", ""), // 默认为0800
                                        isShowSaveBtn : !!result.isSubscribed && !!that.model.get("isPublish"),
                                        color : result.color // 颜色值, 订阅时需作为参数传递
                                    });*/
                                    var result = (response && response["var"]) || {};
                                    var remindType;

                                    // 如果接口中返回的recMyEmail或recMySms都为0, 则前端给它一个默认值(邮件提醒)
                                    if (parseInt(result.recMyEmail) + parseInt(result.recMySms)) {
                                        // 正常的逻辑
                                        remindType = parseInt(result.recMyEmail) ? "01" : "10";
                                    } else {
                                        // 返回值都为0时的逻辑
                                        remindType = "01";
                                    }

                                    that.model.set({
                                        enable: (parseInt(result.enable) == 1),
                                        remindType: remindType,
                                        time: result.beforeTime + "-" + (result.beforeType || 2), // beforeType默认为2, 防止可能为0的情况出现
                                        timeSelector: (result.sendMsgTime || "08:00").replace(":", ""), // 默认为0800
                                        isShowSaveBtn: !!result.isSubscribed && !!that.model.get("isPublish"),
                                        color: result.color // 颜色值, 订阅时需作为参数传递
                                    });
                                }
                            });
                    }
                }, function () {
                    console.log('fnError');
                }
            );
        },
        setPosition: function () { // 计算弹出窗口的显示位置("居中显示")
            this.adjustContentHeight();
            var clientHeight = top.document.body.clientHeight;
            var clientWidth = top.document.body.clientWidth - this.LEFT_SIDEBAR_WIDTH;
            var selfSize = this.model.getElementSize(this.outerEl);

            this.outerEl.css({
                top: clientHeight / 2 - selfSize.height / 2,
                left: clientWidth / 2 - selfSize.width / 2
            });

        },
        /**
         * 点击"订阅"按钮则按钮变成"退订"
         * 点击"退订"按钮则按钮变成"订阅"
         */
        subscribe: function (param) {
            var that = this;
            // 调用后台接口
            var obj = {
                comeFrom: 0,
                color: that.model.get("color"),
                labelId: that.labelId
            };

            // 后台发布的公共日历需要增加提醒信息设置
            if (that.model.get("isPublish")) {
                $.extend(obj, {
                    enable : that.smsCheckboxEl.is(":checked") ? 1 : 0,
                    beforeType : parseInt(that.model.get("time").split("-")[1]), // 提前类型(0分, 1时, 2天, 3周, 4月 )
                    beforeTime : parseInt(that.model.get("time").split("-")[0]),
                    recMySms : that.model.get("remindType") == "10" ? 1 : 0,
                    recMyEmail : that.model.get("remindType") == "01" ? 1 : 0,
                    sendMsgTime : that.model.transformTime(that.model.get("timeSelector"))
                });
            }

            //显示操作按钮遮罩层
            that.btn_mask.removeClass("hide");
            // 记录操作日志
            that.recordOperateLog();

            that.model.subcribeLabel(obj,
                function (response) {
                    if (response["code"] === "FS_UNKNOW") {
                        that.fnFailure();
                        //隐藏操作按钮遮罩层
                        that.btn_mask.addClass("hide");
                        return;
                    }

                    // 如果点击的是"订阅"按钮, 则要更新左侧的订阅日历列表
                    // 如果点击的是"保存"按钮, 则不需要更新, needNotify用来区分这个
                    if (param && param.needNotify) {
                        _.isFunction(that.subscribeFn) && that.subscribeFn(response);
                        top.M139.UI.TipMessage.show("订阅成功", { delay: 3000 });
                    }

                    // 隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                    top.M139.UI.TipMessage.show("保存成功", { delay: 3000 });
                    that.cancel();
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }
            );
        },
        recordOperateLog : function () {
            var that = this;
            that.model.get("remindType") == "10" ? top.BH("calendar_square_smsremind") :
                top.BH("calendar_square_emailremind");
        },
        /**
         * 退订操作
         */
        unSubscribe: function () {
            var that = this;
            var obj = {
                comeFrom: 0,
                labelId: this.labelId
            };

            //显示操作按钮遮罩层
            that.btn_mask.removeClass("hide");

            that.model.unSubscribeLabel(obj,
                function (response) {
                    if (response["code"] == "FS_UNKNOW") {
                        // 如果出现异常, 重新刷新界面
                        //that.master.trigger(that.master.EVENTS.NAVIGATE, { path: "view/update" });
                        return;
                    }

                    _.isFunction(that.unsubscribeFn) && that.unsubscribeFn(response);
                    //  that.showTips();
                    top.M139.UI.TipMessage.show("退订成功", { delay: 3000 });
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                    that.cancel();

                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }, function () {
                    that.fnFailure();
                    //隐藏操作按钮遮罩层
                    that.btn_mask.addClass("hide");
                }
            );
        },
        cancel: function () {
            this.outerEl.remove();
            this.hideMask();
        },
        validate: function (element) {
            var target = element.target || event.srcElement,
                value = $(target).val();
            // 只需要验证长度
            this.setModel(value, false, true);
            $(target).val(value.substr(0, 30));
        },

        setModel: function (value, isValidateNotEmpty, isValidateLength) {

        },
        wrapParam: function () { // 封装需要传递的参数

        },
        /**
         * 做两件事情
         * 1: 展示或隐藏详细内容 2: 改变图标
         * @param e 图标元素
         */
        toggleDetailContent: function (e) {
            var target = e.srcElement || e.target,
                $tableBox = $(target).closest(".createTableBox"),
                $ul = $tableBox.find("ul"),
                $img = $tableBox.find("i"); // TODO 或许有更好的办法
            $ul.hasClass("hide") ? $ul.removeClass("hide") : $ul.addClass("hide");
            $img.hasClass("i-cShow") ? $img.removeClass("i-cShow").addClass("i-cHide") : $img.removeClass("i-cHide").addClass("i-cShow");
        }
    }));

})(jQuery, _, M139, window._top || window.top);
