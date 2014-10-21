; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var master = window.$Cal;
    var _class = "M2012.Calendar.View.MoreList";

    M139.namespace(_class, superClass.extend({

        name: _class,

        model: null,

        master: null,

        //分页控件
        pager: null,

        /**
         * 显示更多活动列表
         * @param {Date} args.date 指定日期
         * @param {Number} args.hour 指定时间
         * @param {Array} args.labes 标签类型
         * @param {Array} args.types 特殊类型
         * @param {Object} args.master 主控制器
         * @param {Function} args.onRemove 删除某条活动时的回调
         */
        initialize: function (args) {

            var self = this;

            args = args || {};

            if (args.master)
                self.master = args.master;

            //当前日期
            var date = args.date;
            if (!_.isDate(date)) {
                date = self.master.capi.getCurrentServerTime();
            }

            var hour = null;
            if (typeof args.hour != "undefined") {
                hour = args.hour;
            }

            superClass.prototype.initialize.apply(self, arguments);

            //创建视图模型对象
            self.model = new M2012.Calendar.Model.MoreList({
                master: self.master,
                date: date,
                hour: hour,
                labels: args.labels ? args.labels : null,
                types: args.types ? args.types : null,
                data: args.data
            });

            self.container = args.container;
            self.onRemove = args.onRemove;

            self.render();
        },

        initEvents: function () {

            var self = this;

            //点击上一页触发事件
            self.getElement("pageprev").click(function (e) {

                self.pager.prev.call(self);
            });

            //点击下一页触发事件
            self.getElement("pagenext").click(function (e) {

                self.pager.next.call(self);
            });

        },

        render: function () {
            var self = this;
            //把backbone本身创建的Div移除掉
            //因为本次视图不是添加在此div内
            self.$el.remove();
            var date = self.model.get("date");
            var hour = self.model.get("hour");
            var data = self.model.get("data");
            var key = M2012.Calendar.View.MoreList.getKey(date, hour);

            //获取当前日期详细信息以供界面展示          
            var dayInfo = (new M2012.Calendar.MonthInfo(date))[$Date.format("yyyy-MM-dd", date)];
            var container = $('#div_more_' + key);
            var day = self.container ? '' : dayInfo.day;
            var lunarTitle = self.container ? self.model.getTimeRangeStr() : dayInfo.lunarText;
            var totalClass = self.container ? 'hide' : '';
            var html = $T.format(self.template.ui, {
                cid: self.cid,
                day: day,
                lunarTitle: lunarTitle,
                totalClass: totalClass
            });

            if (self.container) {
                self.currentEl = $(html).css('left', '-1000px'); //飘出屏幕, 否则会看到闪动
                $(document.body).append(self.currentEl);
            } else {
                //先清空内部元素在创建浮出层
                container.empty();
                self.currentEl = $(html).appendTo(container);
                self.container = container;
            }

            //日视图下不显示日历信息
            if (!self.model.isMonthView()) {
                self.getElement("total").siblings().hide();
            }

            //修饰视图样式
            self.setViewStyle(dayInfo);
            self.initEvents();

            var waitEl = self.getElement("waitting");

            if (data) {
                self.model.set({
                    'cacheData': data,
                    'msgMode': true //日历消息中的更多模式
                });
                if (data.length > 0) {
                    //初始化分页控件
                    self.pager = new M2012.Calendar.MoreList.Pager({
                        recordCount: data.length,
                        render: self.renderPage
                    });
                    self.getElement("total").text($T.format("共{total}个活动", { total: data.length }));
                    //呈现页数据
                    self.renderPage();

                    setTimeout(function () {
                        M139.Dom.dockElement(self.container, self.currentEl, { direction: 'upDown' });
                    }, 0); //延迟,否则计算有点小问题
                }
                waitEl.addClass("hide");
            } else {
                //获取服务端数据并显示分页数据
                self.model.fetch(function (data) {
                    var data = data || [];
                    if (data.length > 0) {
                        //初始化分页控件
                        self.pager = new M2012.Calendar.MoreList.Pager({
                            recordCount: data.length,
                            render: self.renderPage
                        });
                        self.getElement("total").text($T.format("共{total}个活动", { total: data.length }));
                        //呈现页数据
                        self.renderPage();
                    }
                    waitEl.addClass("hide");
                }, function () {
                    waitEl.addClass("hide");
                });
            }
        },

        //显示分页数据
        renderPage: function () {
            var self = this;
            if (!self.pager)
                return;

            var container = self.getElement("ul").empty();
            //设置前一页的按钮样式
            var className = "disabledFirst";
            var pageEl = self.getElement("pageprev");
            if (self.pager.isFirst())
                pageEl.addClass(className);
            else {
                pageEl.removeClass(className);
            }
            //设置后一页的按钮样式
            className = "disabledLast";
            pageEl = self.getElement("pagenext");
            if (self.pager.isLast()) {
                pageEl.addClass(className);

            } else {
                pageEl.removeClass(className);
            }
            if (self.pager.isFirst()) {
                container.height("auto");
            }

            //设置分页页码描述信息
            var desc = $T.format("{pageNo}/{pageCount}", {
                pageNo: self.pager.recordCount == 0 ? 0 : self.pager.pageNo + 1,
                pageCount: self.pager.pageCount
            })
            self.getElement("pagedesc").text(desc);

            var data = self.model.getPageData(self.pager.pageNo, self.pager.pageSize);

            var html = [];
            $.map(data, function (item, index) {
                //产生一条分隔符虚线
                if (item === false) {
                    html.push("<li class='month_notes_separate'></li>");
                    return true;
                }
                //item= null时，填空的li以占位
                if (item === null) {
                    html.push("<li></li>");
                    return true;
                }
                //填充正常的数据项
                html.push($T.format(self.template.li, self.fixItemData(item)));
            });

            container.html(html.join(""));

            container.find("li[type]").click(function (event) {
                var me = $(this);
                var id = me.attr("scheduleId");
                var type = me.attr("type");

                self.master.trigger(self.master.EVENTS.VIEW_POP_ACTIVILY, {
                    seqNo: id,
                    type: type,
                    // event: event,
                    target: me,
                    //回调函数
                    callback: function (args) {
                        if (self.onRemove) { //内部传入了回调,就不再跳转了
                            self.onRemove(args);
                            return;
                        }

                        //刷新月视图
                        self.master.trigger(self.master.EVENTS.NAVIGATE, {
                            path: "mainview/refresh"
                        });
                    },
                    error: function (e) {
                        top.M139.UI.TipMessage.show('操作失败，请稍后再试！', {
                            delay: 2000,
                            className: "msgRed"
                        });
                    }
                });
            });

            //第一页数据加载后需要设定div高度，这样在翻页后高度才不会上下抖动
            if (self.pager.isFirst()) {
                window.setTimeout(function () {
                    container.height(container.height());
                }, 0xff);
            }
        },

        fixItemData: function (item) {

            var self = this;
            var capi = self.master.capi;
            var constant = self.master.CONST;

            //计算开始时间
            var start = capi.fixHourTime(item.startTime);
            var end = capi.fixHourTime(item.endTime);
            var begin = capi.isFullDayEvent(start, end) ? "" : start + " ";

            var isMsg = "none";
            var isBirth = "none";
            var txtColor = item.forecolor || "";
            var displayIcon = "";
            var title = item.titleText || item.title;

            if (item.enable == 1) {
                displayIcon = "clock";
            }

            //只有是被邀请的未处理的活动才显示消息ICON
            if (item.isInvitedCalendar && item.status == 0) {

                isMsg = 'block';
                if (item.specialType == constant.specialType.birth) {

                    title = item.titleText + "生日";
                    txtColor = constant.activilyTxtColor.blackColor;
                }
            }
                //该条是生日活动（这是创建者）
            else if (item.specialType == constant.specialType.birth) {

                displayIcon = "";
                isBirth = "block";
                title = item.titleText + "生日";
                txtColor = constant.activilyTxtColor.blackColor;
                // displayIcon = "99";

            } else if (item.operationFlag) {

                displayIcon = item.operationFlag;
                txtColor = constant.activilyTxtColor.blackColor;
            }

            var scheduleType = "";
            //自己的活动
            if (!item.isInvitedCalendar && !item.isSharedCalendar && !item.isSubCalendar) {
                scheduleType = constant.activityType.myself;

            } else if (item.isInvitedCalendar) {
                scheduleType = constant.activityType.invited;

            } else if (item.isSharedCalendar) {
                scheduleType = constant.activityType.shared;

            } else if (item.isSubCalendar) {
                scheduleType = constant.activityType.subscribed;
            }
            var className = "";
            var backColor = item.color || '#6699ff';
            if (item.color) {
                var className = self.master.CONST.activilyColors[item.color] || "";
                if (className) {
                    backColor = "";
                }
            }

            return {
                titleText: begin + title,
                date: $Date.format("yyyy-MM-dd", self.model.get("date")),
                isMsg: isMsg,
                isBirth: isBirth,
                txtColor: txtColor,
                className: className,
                icontype: displayIcon ? constant.activilyIconType[displayIcon] : "",
                scheduleType: scheduleType,
                color: backColor,
                scheduleId: item.scheduleId || item.seqNo || item.seqno
            };

        },

        /**
         *  获取页面元素对象
         *  针对那些以cid作为id的元素
         */
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id, self.currentEl);
        },

        /**
         * 设置视图样式
         */
        setViewStyle: function (dayInfo) {
            var self = this;
            if (!self.model.isMonthView()) {
                var event = M139.Event.getEvent();
                if (event) {
                    var offset = top.$App.getBodyHeight() - $(frameElement).offset().top - event.clientY - 300;
                    if (offset < 0) {
                        self.currentEl.css({ top: offset });
                    }
                }
                self.currentEl.css({ left: -self.currentEl.width() });
                return;
            }
            //增加行样式
            if (dayInfo.isFirstWeek) {//第一行
                self.currentEl.addClass("registerLayerTop");

            } else if (dayInfo.isLastWeek)//最后一行
                self.currentEl.addClass("registerLayerBtm");

            //增加列样式
            if (dayInfo.weekday == 0) { //第一列               
                self.currentEl.addClass("registerLayerLeft");

            } else if (dayInfo.weekday == 6) { //最后一列
                self.currentEl.addClass("registerLayerRight");
            }

            //修补：最后一列的非最后一行，要加多一个样式
            if (dayInfo.weekday == 6 && !dayInfo.isLastWeek)
                self.currentEl.addClass("registerlayerleftAuto");
        },

        hide: function () {
            this.currentEl.remove();
        },

        template: {
            ui: [
                '<div class="register_more" style="cursor: default;">',
                    '<p class="clearfix">',
                        '<span class="fr">',
                            '<em class="fl" id="{cid}_pagedesc">0/0</em>',
                            '<span>',
                                '<a href="javascript:" title="上一页" ',
                                 'class="prevPage disabledFirst" id="{cid}_pageprev" >',
                                '</a>',
                                '<a href="javascript:" title="下一页"',
                                    'class="nextPage disabledLast" ',
                                    'id="{cid}_pagenext" ></a>',
                            '</span>',
                        '</span>',
                        '<span class="adTagTile">',
                            '<b>{day}</b><span>{lunarTitle}</span><em id="{cid}_total" class="{totalClass}">(共0个活动)</em>',
                        '</span>',
                    '</p>',
                    '<div style="text-align:center" id="{cid}_waitting"><img src="../../images/global/load.gif" alt=""></div>',
                    '<ul id="{cid}_ul" class="notes show">',
                    '</ul>',
                '</div>'].join(""),

            li: [
                '<li type="{scheduleType}" scheduleId="{scheduleId}" class="{className}" style="background-color:{color};cursor: pointer; ">',
                    '<a type="{scheduleType}" href="javascript:void(0)" title="{titleText}" style="color:{txtColor}">',
                        '<i class="{icontype} IconPosion"></i>{titleText}',
                    '</a>',
                    '<a style="display:{isMsg};" class="noteMessage" href="javascript:;"><i class="i_message"></i></a>',
                '</li>'].join("")
        }

    }, {


        //缓存添加到页面的"更多活动"视图
        CacheViews: {},

        /**
         * 隐藏所有的更多活动浮层
         */
        hide: function (timeout) {
            var view = M2012.Calendar.View.MoreList;

            for (var key in view.CacheViews) {

                var id = "#div_more_" + key;
                $(id).hide().parent().css({ 'z-index': 1 }); //降低 parenNode 的 z-index
            }

            if (view.lastView) {
                view.lastView.hide();
                view.lastView = null;
            }
        },

        /**
         * 显示更多活动浮层
         * @param {Date} args.date 指定日期
         * @param {Number} args.hour 指定时间
         * @param {Array} args.labes 标签类型
         * @param {Array} args.types 特殊类型
         * @param {Object} args.master 主控制器
         * @param {Function} args.onRemove 删除某条活动时的回调(目前用于日历消息)
         */
        show: function (args) {

            var view = M2012.Calendar.View.MoreList;
            var key = view.getKey(args.date, args.hour);
            //先隐藏所有
            view.hide(500);
            if (!view.CacheViews[key]) {
                view.CacheViews[key] = true;
            }

            setTimeout(function () { //先触发document.click
                view.lastView = new M2012.Calendar.View.MoreList(args);
                //显示浮层
                $('#div_more_' + key).removeClass('hide')
                    .fadeIn(500)
                    .click(function (event) {
                        event.stopPropagation();

                    }).parent().css({ 'z-index': 2 }); //提升 parentNode 的 z-index

                //为什么这样绑定阻止冒泡?????? siht!!!
                view.lastView.currentEl.click(function (event) {
                    event.stopPropagation();
                });
            }, 100);
        },

        /**
         * 根据指定时间获取对应的元素KEY
        */
        getKey: function (date, hour) {
            var key = $Date.format("yyyy-MM-dd", date);
            if (_.isNumber(hour)) {
                key += "_" + hour;
            }
            return key;
        }

    }));

    $(function () {

        window.setTimeout(function () {
            var master = window.$Cal;
            master.on(master.EVENTS.HIDE_ACTIVITY_POPS, function () {
                var view = M2012.Calendar.View.MoreList;
                view.hide(500);
            });
        }, 10);

    });

    var view = M2012.Calendar.View.MoreList;

    //点击页面后隐藏所有的更多活动浮层
    $(document.body).click(function (e) {
        view.hide(500);
    });

    //分页控件
    M139.namespace("M2012.Calendar.MoreList.Pager", function (args) {

        var self = this;
        //当前页面
        self.pageNo = 0;
        //每页显示条数
        self.pageSize = 10;
        //页数
        self.pageCount = 0;

        args = args || {};

        //记录条数
        self.recordCount = 0;
        if (args.recordCount) {
            self.recordCount = args.recordCount;
        }

        //计算页数
        self.pageCount = (self.recordCount - self.recordCount % self.pageSize) / self.pageSize;
        if (self.recordCount % self.pageSize > 0) {
            self.pageCount += 1;
        }

        //呈现界面
        self.render = function () {
            //此处的this指向view
            args.render && args.render.call(this);
        };

        //上一页
        self.prev = function () {
            if (self.pageNo > 0) {
                //页面减1
                self.pageNo--;
                self.render.call(this);
            }
        }

        //下一页
        self.next = function () {
            if (self.pageNo < (self.pageCount - 1)) {
                //页面加1
                self.pageNo++;
                self.render.call(this);
            }
        }

        //是否第一页
        self.isFirst = function () {
            return self.pageNo == 0;
        }

        //是否最后一页
        self.isLast = function () {
            if (self.pageCount === 0)
                return true;
            if (self.pageNo === (self.pageCount - 1))
                return true;
            return false;
        }

    });

})(jQuery, _, M139, window._top || window.top);