; (function ($, _, M139, top) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Calendar.Model.MoreList";

    M139.namespace(_class, superClass.extend({

        name: _class,

        defaults: {
            //日期
            date: null,

            //小时
            hour: null,

            //标签
            labels: null,

            //特殊类型
            types: null,

            //缓存从服务器下载的数据
            cacheData: null
        },

        master: null,

        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.master)
                self.master = args.master;

            if (!args.date)
                self.set({ date: args.date });

            if (args.labels)
                self.set({ labels: args.labels });

            if (args.types)
                self.set({ types: args.types });

            superClass.prototype.initialize.apply(self, arguments);
        },


        /**
         *  查询服务器获取数据
         */
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var BIRTH = 1;
            var date = $Date.format("yyyy-MM-dd", self.get("date"));
            var specialTypes = self.get("types") || [];
            var _labels = self.master.get("checklabels") || [];
            var param = {
                includeLabels: "",
                includeTypes: ""
            };

            if (_.isArray(specialTypes) && !_.isEmpty(specialTypes)
                && _.every(specialTypes, function (i) { return i == BIRTH })) {

                param.includeTypes = specialTypes.join(",");

                //3. 标签只有一个，并且不是 我的日历 的系统标签ID，场景是左下方订阅日历，删除元素，适应后台接口
            } else if (_labels.length === 1 && _.indexOf(_labels, "10") < 0) {
                param.includeLabels = _labels.join(",");

                //4. 正常情况，则有两个参数向后传
            } else {
                param.includeLabels = _labels.join(",");
                param.includeTypes = specialTypes.join(",");
            }
            if (param.includeLabels == "") {
                delete param.includeLabels;
            }
            //特殊类型为空或0时无需传该参数至接口
            if (param.includeTypes == "" || param.includeTypes == "0") {
                delete param.includeTypes;
            }

            self.master.trigger(self.master.EVENTS.REQUIRE_API, {

                success: function (api) {
                    api.getCalendarView({
                        data: $.extend(param, {
                            startDate: date,
                            endDate: date,  //结束时间
                            // maxCount: 0
                            actionType: 2
                        }),
                        success: function (result) {
                            if (result.code == "S_OK") {
                                if (fnSuccess) {
                                    var data = self.filterData(result);
                                    //缓存数据
                                    self.set({ cacheData: data });
                                    fnSuccess(data);
                                }
                            } else {
                                fnError && fnError(result);
                            }
                        },
                        error: function (e) {
                            fnError && fnError(e);
                        }

                    });
                }
            });
        },

        /**
         * 判断是否在月视图
         */
        isMonthView: function () {
            var self = this;
            return !_.isNumber(self.get("hour"));
        },

        /**
         *  处理获取到的数据，按日期筛选合并数据
         */
        filterData: function (result) {

            var self = this;
            var capi = self.master.capi;

            //日程记录对照表
            var table = {};
            $.each(result["table"], function (key, item) {
                //增加开始时间和结束时间的 Date 类型实例
                table[key] = $.extend(item,
                {
                    beginDateTime: $Date.parse(item.dtStart),
                    scheduleId: item.seqNo,
                    title: item.title || '无标题'
                });
            });

            var date = $Date.format("yyyy-MM-dd", self.get("date"));
            var data = result["var"][date] || [];

            //根据 id 去查 result.table 里的记录，然后合并到每天的 info 数组里
            data['info'] = $.map(data['info'] || [], function (item, index) {
                return $.extend(table[item], { scheduleId: item.seqNo });
            });

            //排序数据
            var value = $.map(data["info"], function (item, index) {
                return $.extend({}, item, {
                    titleText: $T.Html.encode(item.title)
                });
            }).sort(function (a, b) {
                //去掉日期部分(或让日期部分一样)，只比较时间部分
                return (a.beginDateTime.getTime() % 86400000) - (b.beginDateTime.getTime() % 86400000);
            });

            //过滤指定时间内数据
            if (!self.isMonthView()) {
                var hour = self.get("hour");
                var startTime = hour + "";
                var endTime = "";

                //全天事件
                if (hour == 100) {
                    startTime = "800";
                    endTime = "2359";

                } else if (hour == 0) {
                    startTime = "0";
                }

                value = $.grep(value, function (item) {
                    if (hour == 100) {
                        return item.allDay == 1;                         
                    }
                    var itemTime = item.startTime + "";
                    if (itemTime.length > 2) {
                        itemTime = itemTime.substring(0, itemTime.length - 2);
                    }
                    return itemTime == startTime;
                });
            }
            return value;
        },

        getPageData: function (pageNo, pageSize) {
            var self = this;

            var data = self.get("cacheData");
            var isMsgMode = !!self.get("msgMode")
            var value = null;
            //获取第一页数据时前三条需要增加分隔符
            if (pageNo == 0) {

                var length = data.length - pageSize;
                value = [].concat(data.slice(0, 3))
                if (!isMsgMode) { //非日历消息中的更多情况,就加虚横线
                    value = value.concat([false]);          // +1
                }
                if (length <= 0) {
                    value = value.concat(data.slice(3));
                } else {
                    value = value.concat(data.slice(3, pageSize));
                }
            } else {
                var length = data.length - pageNo * pageSize;
                if (length <= 0) {
                    value = data.slice(pageNo * pageSize);
                } else {
                    value = data.slice(pageNo * pageSize, (pageNo + 1) * pageSize);
                }
            }
            return value;
        },

        /**
         * 日历消息专用
         */
        getTimeRangeStr: function () {
            var data = this.get("data") || [];
            var desc = '';
            var sortByStart, sortByEnd, date, startTime, endTime;

            //补位方法
            function padding(str, len) {
                if (str && str.length >= len) return str; //原本就足够长

                return (new Array(len + 1).join('0') + (str || '')).slice(-len);
            }

            //把 2014-08-26 转成 08月26日
            function toDate(str) {
                var arr = str && str.split('-');
                var date = ''

                if (arr && arr.length == 3) {
                    date = arr[1] + "月" + arr[2] + "日";
                }
                return date;
            }

            //把 530 转成 05:30
            function toTime(str) {
                str = padding(str, 4);
                return str.slice(0, 2) + ":" + str.slice(2, 4); //好变态
            }

            if (data.length > 0) {
                sortByStart = _.sortBy(data, function (item) {
                    return Number(item.startTime);
                });

                sortByEnd = _.sortBy(data, function (item) {
                    return Number(item.endTime);
                });

                date = toDate(data[0].startDate);
                startTime = toTime(sortByStart[0].startTime);
                endTime = toTime(sortByEnd[0].endTime);

                desc = date + startTime + '-' + endTime;
            }

            return desc;
        }

    }));

})(jQuery, _, M139, window._top || window.top)
﻿; (function ($, _, M139, top) {

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
﻿

(function ($, _, M139, top) {
    var className = "M2012.Calendar.View.RejectReason";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        templates: {
            MAIN: '<textarea class="iText box-area" name="rejectreason"></textarea>'
        },
        configs: {
            defaultTip: '谢绝原因（50个字）',
            defaultName: 'calendar_popup_reject_reason'
        },
        /**
         * 
         * @param options.container {Object} 点击时需要弹出本冒泡的对象(jQuery对象)
         * @param options.onsubmit {Function} 可选参数, 点击确定时的回调
         * @param options.oncancel {Function} 可选参数, 点击取消时的回调
         * @param options.maxLen {Int} 可选参数,最大输入长度,默认50
         */
        initialize: function (options) {
            if (options && options.container) {
                this.container = options.container || options.target;
                this.onsubmit = options.onsubmit || $.noop;
                this.oncancel = options.oncancel || $.noop;
                this.defaultTip = options.defaultTip || this.configs.defaultTip;
                this.maxLen = options.maxLen || 50;

                this.render();
                this.initEvents();
            } else {
                throw new Error('container is empty')
            }
        },
        render: function () {
            var _this = this;

            _this.popup = M139.UI.Popup.create({
                name: _this.configs.defaultName, //单显
                target: _this.container,
                content: _this.templates.MAIN,
                //direction: 'up', //默认向上显示
                autoHide: true, //自动隐藏
                buttons: [
                    { text: "确定", cssClass: "btnSure", click: function () { _this.submit(); } },
                    { text: "取消", click: function () { _this.cancel(); } }
                ],
                noClose: true //不要关闭按钮
            });
            _this.popup.render();
        },
        initEvents: function () {
            var textarea = this.popup.contentElement.find("textarea");
            var defaultText = this.defaultTip; //默认提示语

            this.textarea = textarea; //保存,方便在确定时使用
            textarea.on("focus", function () {
                var txt = textarea.val();
                if (txt == defaultText) {
                    textarea.removeClass("gray").val("");
                }
            }).on("blur", function () {
                var txt = textarea.val();
                if (txt.replace(/\s/gi, '') == '') {
                    textarea.addClass("gray").val(defaultText);
                }
            });

            try { M139.Dom.setTextBoxMaxLength(textarea, this.maxLen); } catch (e) { } //记得彩云有兼容问题

            textarea.trigger("blur");
        },
        submit: function () {
            var txt = this.textarea.val(),
                data = { reason: (txt == this.defaultTip ? '' : txt) }; //如果是默认的提示语就清空

            this.onsubmit(data);
            this.popup.close();
        },
        cancel: function () {
            this.oncancel();
            this.popup.close();
        }
    }));

})(jQuery, _, M139, (window._top || window.top));
﻿

(function ($, _, M139, top) {
    var master = window.$Cal,
        EVENTS = master.EVENTS;

    var entryView = "M2012.Calendar.View.MessageItem";
    M139.namespace(entryView, Backbone.View.extend({
        types: {
            INVITE: 1,
            SHARE: 2
        },
        initialize: function (options) {
            var _this = this,
                types = _this.types;

            options = options || {};
            //转换
            var args = {
                container: options.container,
                model: options.model,
                defaults: {
                    seqno: options.seqno,
                    refSeqno: options.refSeqno,
                    date: options.createTime,
                    title: options.message,
                    status: options.status,
                    type: options.type
                }
            };

            switch (options.type) {
                case types.INVITE:
                    //活动邀请消息
                    new M2012.Calendar.View.InviteMessage(args);
                    break;
                case types.SHARE:
                    //日历共享消息
                    new M2012.Calendar.View.ShareMessage(args);
                    break;
                default:
                    break;
            }
        }
    }));

    var baseView = "M2012.Calendar.View.BaseMessage";
    M139.namespace(baseView, Backbone.View.extend({
        itemTemplate: ['<div seqno="{seqno}" class="boxlist">',
                         '<a id="delete" class="i_sc" href="javascript:;">删除</a>',
                         '<div id="switch" class="boxlist-title">',
                             '<span class="gray fr">{date}</span>',
                             '<span id="title" rel="msgtext" class="{className}">{title}</span>',
                         '</div>',
                         '<div id="detail"></div>',
                         '<div id="statusbar" class="boxlist-bottom clearfix">',
                            '<div class="fl"></div>',
                            '<div class="fr pr_10"></div>',
                         '</div>',
                     '</div>'].join(""),
        detailTemplate: ['<div class="boxlist-text">',
                             '<h3>',
                                //日历共享有颜色显示,活动邀请没有
                                '{title}',
                             '</h3>',
                             '<table class="boxlist-text-tab">',
                                 '<tbody>',
                                    '{content}',
                                 '</tbody>',
                             '</table>',
                         '</div>'].join(""),
        blacklistTemplate: '<a href="javascript:void(0);" title="添加联系人至白名单后,将默认屏蔽来自该联系人的消息">添加联系人至黑名单</a>',
        whitelistTemplate: '<a href="javascript:void(0);" title="添加联系人至白名单后,将默认接受来自该联系人的日历共享、活动分享">添加联系人至白名单</a>',
        tipTemplate: '<span>{message}</span>', //已添加联系人至 黑/白 名单
        handlerTemplate: '<a type="accept" class="btnSure mr_10"><span>接受</span></a><a type="reject" class="btnNormal mr_10"><span>谢绝</span></a>',

        configs: {
            UNREAD: 0,

            UNHANDLER: 0, //未处理消息(即未接受/拒绝)
            ACCEPT: 1, //已接受
            REJECT: 2, //已谢绝

            types: {
                INVITE: 1,
                SHARE: 2
            },

            messages: {
                LOADING: '正在加载中...',
                DEFAULT_ERROR: '操作失败',
                SUCCESS: '操作成功',

                BLACK_LIST: '已添加联系人至黑名单',
                WHITE_LIST: '已添加联系人至白名单',

                DELETE_TITLE: '消息处理',
                DELETE_CONFIRM: '您确定删除这条消息？',
                DELETE_UNREAD_CONFIRM: '您尚未处理该条消息，删除后，将无法再处理'
            },

            codes: {
                OK: "S_OK",
                UNKNOW: "FS_UNKNOW",
                CANCEL: 200,
                UNKNOW_ERRORCODE: 999
            },

            apis: {
                "1": "updateInviteStatus",
                "2": "processShareLabelInfo"
            },

            actions: {
                ACCEPT: 0,
                REJECT: 1
            },

            rules: {
                BLACK_LIST: 2,
                WHITE_LIST: 1
            }
        },
        initialize: function (options) {
            var _this = this,
                status;

            options = options || { defaults: {} };
            status = options.defaults.status; //用来判断消息是否已读
            options.defaults.isUnread = status == _this.configs.UNREAD; //未读,一定未处理

            _this.options = options;
            _this.container = options.container;
            _this.parentModel = options.model;
            _this.model = new Backbone.Model(options.defaults);

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this,
                model = _this.model;

            var html = $T.format(_this.itemTemplate, {
                seqno: model.get("seqno"),
                date: model.get("date"),
                title: $T.Html.encode(model.get("title")),
                className: model.get("status") == _this.configs.UNREAD ? "fw_b" : ""
            });

            _this.$el = $(html);
            _this.container.append(_this.$el);

            //保存dom元素
            _this.deleteEl = $("#delete", _this.$el);
            _this.switchEl = $("#switch", _this.$el);
            _this.titleEl = $("#title", _this.$el);
            _this.detailEl = $("#detail", _this.$el);
            _this.statusbar = $("#statusbar", _this.$el);
            _this.leftbar = $(".fl", _this.statusbar);
            _this.rightbar = $(".fr", _this.statusbar);
        },
        initEvents: function () {
            var _this = this,
                loading = false,
                configs = _this.configs,
                messages = _this.configs.messages,
                codes = _this.configs.codes,
                seqno = _this.model.get("seqno");

            //展开消息,自动标记为已读
            _this.switchEl.on("click", function () {
                var isUnread = _this.model.get("isUnread"); //未读状态
                if (_this.opened) {
                    //已展开,则触发关闭操作
                    _this.trigger("event:close")
                } else {
                    if (_this.isloaded) {
                        //已加载,则直接显示对应的div即可
                        _this.trigger("event:show");
                    } else {
                        if (loading) return; //接口慢,等...

                        loading = true; //加载了,等待回调trigger事件来显示
                        top.M139.UI.TipMessage.show(messages.LOADING);
                        _this.readMessage(function (result) {
                            _this.isloaded = true; //已通过接口加载数据,标记一下

                            top.M139.UI.TipMessage.hide();
                            var code = result && result.code,
                                obj = (result && result["var"]) || {},
                                data = obj.calendar || obj.label || {}, //活动或者日历
                                isUnhandled,
                                status,//接受拒绝状态
                                refSeqno, //关联的日历ID或者活动ID
                                bwl, //black & white list
                                uin; //发起人的UIN,后台没返回邮箱地址

                            //状态码为未知,保存错误码errorCode
                            if (code == codes.UNKNOW) {
                                code = result && result.errorCode; //未知错误,把errorCode保存起来

                                if (code == codes.UNKNOW_ERRORCODE) { //返回未知错误 999
                                    top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                                    return;
                                }
                            }

                            //保存黑白名单状态
                            status = data['status']; //接受拒绝状态 , 点开了消息,状态要刷新
                            bwl = obj['blackWhiteType']; //黑白名单状态
                            uin = data['uin'];
                            refSeqno = data['seqno'];
                            isUnhandled = status == _this.configs.UNHANDLER; //调用了接口,则读取消息是否未处理,这个status表示是否处理,处理状态是接受还是拒绝

                            //保存状态码,触发显示事件
                            _this.model.set({
                                "code": code,
                                "bwl": bwl,
                                "uin": uin,
                                "status": status,
                                "refSeqno": refSeqno,
                                "isUnhandled": isUnhandled,
                                "isUnread": false
                            }); //状态,保存起来

                            _this.titleEl.removeClass("fw_b"); //去掉加粗,标记为已读

                            //data 已经处理过,值为 responseData["var"].calendar或者responseData["var"].label
                            _this.renderMessage(code, data);

                            _this.trigger("event:show");

                            if (isUnread) {
                                _this.parentModel.trigger("change:msgCount"); //刷新未读数量
                            }
                        });
                    }
                }
            });

            var time = new Date();
            _this.deleteEl.on("click", function () {
                var now = new Date();
                if (now.getTime() - time.getTime() < 500) return; //0.5秒内只能点一次
                time = now;

                /**
                 * 需求: 需要判断消息是否已经处理,如果未处理,则提示A,否则提示B
                 * 现状: 后台的getMessageList未返回消息是否已处理(后台不肯修改), 要想知道消息是否已处理,需要请求getMessageById来判断
                 * 实现: 如果是未读的消息,肯定未处理,提示A; 如果是已读的消息, 获取getMessageById来判断消息是否已接受或拒绝,分别提示A和B. 这已经是最优化的情况
                 * 吐槽: 就因为后台不肯加一个字段,前端的代码瞬间增加了几十行并且逻辑复杂还要请求多一次接口
                 */
                var isUnread = _this.model.get("isUnread"),
                    isUnhandled = _this.model.get("isUnhandled"),
                    tipMsg; //未读, 显示不同提示语

                if (isUnread) {
                    deleteConfirm(seqno, messages.DELETE_UNREAD_CONFIRM);
                } else {
                    //如果是已读,就只能通过getMessageById来获取消息是否已处理的操作了(后台不肯改)
                    if (typeof isUnhandled == 'undefined') {
                        _this.readMessage(function (data) {
                            var code = data && data.code;
                            if (code == _this.configs.codes.OK) {
                                //接口正常
                                var obj = data["var"] || {},
                                    detail = obj.calendar || obj.label || {},
                                    isUnhandled = detail.status == configs.UNREAD; //读取消息是否已经接受或者拒绝

                                _this.model.set("isUnhandled", isUnhandled);
                                tipMsg = isUnhandled ? messages.DELETE_UNREAD_CONFIRM : messages.DELETE_CONFIRM;

                                deleteConfirm(seqno, tipMsg);
                            } else {
                                //接口状态异常,code!="S_OK"
                                deleteConfirm(seqno, messages.DELETE_CONFIRM);
                            }
                        }, function () {
                            //接口错误了.不处理,直接弹出询问
                            deleteConfirm(seqno, messages.DELETE_CONFIRM);
                        });
                    } else {
                        //获取过接口,就直接处理了不再请求接口
                        tipMsg = isUnhandled ? messages.DELETE_UNREAD_CONFIRM : messages.DELETE_CONFIRM;

                        deleteConfirm(seqno, tipMsg);
                    }
                }
            });

            //消息的删除确认
            function deleteConfirm(seqno, tipMsg) {
                top.$Msg.confirm(tipMsg, function () {
                    _this.parentModel.delMessage(seqno, function (data) {
                        var code = data && data.code;
                        if (code == configs.codes.OK) {
                            _this.parentModel.trigger("event:refresh"); //重新渲染列表
                        } else {
                            _this.renderError();
                        }
                    }, function () {
                        _this.renderError();
                    });
                }, {
                    dialogTitle: messages.DELETE_TITLE,
                    icon: 'warn'
                });
            }

            _this.on("event:close", function () {
                _this.$el.removeClass("boxlist-open");
                _this.opened = false;
            }).on("event:show", function () {
                //显示分2种: 显示提示, 显示消息内容
                var code = _this.model.get("code"),
                    codes = _this.configs.codes;

                switch (code) {
                    case codes.OK:
                        _this.$el.addClass("boxlist-open");
                        break;
                    case codes.CANCEL:
                        //已经取消了,活动/日历详情区域显示提示语
                        _this.$el.addClass("boxlist-open");
                        _this.statusbar.addClass("hide");
                        break;
                    default:
                        break;
                }

                _this.opened = true;
            })
        },
        readMessage: function (callback, error) {
            var _this = this;
            var messageId = _this.model.get("seqno");

            //compatible
            callback = callback || $.noop;
            error = error || $.noop;

            _this.parentModel.getMessageById(messageId, function (result) {
                //触发回调,渲染视图
                callback(result);
            }, function () {
                top.M139.UI.TipMessage.show(_this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: 'msgRed' });
                error();
            })
        },
        /**
         @param type {Int} 接受的类型: 1是邀请活动,2是共享日历
         @param callback {Function} 接口请求成功后的回调(包括 code != "S_OK")
         */
        accept: function (type, callback) {
            //接受 邀请/共享
            var _this = this;
            var options = {
                actionType: _this.configs.actions.ACCEPT,
                seqNos: _this.model.get("refSeqno"), //消息seqno关联的活动/日历的ID: refSeqno
                refuseResion: ''
            };

            _this._callApi(type, options, callback);
        },
        /**
         @param type {Int} 拒绝的类型: 1是邀请活动,2是共享日历
         @param callback {Function} 接口请求成功后的回调(包括 code != "S_OK")
         */
        reject: function (type, callback) {
            //拒绝 邀请/共享
            var _this = this;
            var options = {
                actionType: _this.configs.actions.REJECT,
                seqNos: _this.model.get("refSeqno"),
                refuseResion: _this.model.get("reason") //拒绝原因,在调用接口之前先获取并set到model中, 后台又拼错了...
            };

            _this._callApi(type, options, callback);
        },
        _callApi: function (type, options, callback) {
            var _this = this,
                messages = _this.configs.messages,
                apis = _this.configs.apis,
                apiName = apis[type];

            if (apiName) {
                _this.parentModel[apiName](options, function (data) {
                    var code = data && data.code;
                    if (code == _this.configs.codes.OK) {
                        top.M139.UI.TipMessage.show(messages.SUCCESS, { delay: 3000 });
                    } else {
                        top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                    }

                    callback(code, data);
                }, function () {
                    top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                });
            } else {
                throw new Error("message type error");
            }
        },
        /**
         * @param options.type {Int} 类型 1：白名单, 2：黑名单
         * @param options.email {String} 用户的邮箱地址，多个用逗号隔开
         * @param options.uin {String} 可选,用户的UIN
         */
        addBlackWhiteItem: function (options, callback) {
            var _this = this;

            _this.parentModel.addBlackWhiteItem(options,
                function (data) {
                    var code = data && data.code;
                    if (code == _this.configs.codes.OK) {
                        callback();
                    } else {
                        _this.renderError();
                    }
                }, function () {
                    _this.renderError();
                });
        },
        renderError: function () {
            top.M139.UI.TipMessage.show(this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: 'msgRed' });
        },
        renderHandler: function () {
            var _this = this;

            //操作按钮
            _this.buttons = $(this.handlerTemplate);
            this.leftbar.html(_this.buttons);

            this.leftbar.find("[type='accept']").on("click", function () {
                _this.accept(_this.type, function (code, result) {
                    if (code == _this.configs.codes.OK) {
                        _this.renderLeftStatusBar(true);
                        _this.renderRightStatusBar(true);
                    }
                });
            });

            this.leftbar.find('[type="reject"]').on('click', function () {
                _this.model.set("reason", null); //清空上一次???

                new M2012.Calendar.View.RejectReason({
                    container: $(this),
                    onsubmit: function (data) {
                        if (data && data.reason) _this.model.set("reason", data.reason); //拒绝理由set到model中

                        _this.reject(_this.type, function (code, result) {
                            if (code == _this.configs.codes.OK) {
                                _this.renderLeftStatusBar(false);
                                _this.renderRightStatusBar(false);
                            }
                        });
                    }
                });
            });
        },
        /**
         * 状态栏右侧: 添加到黑白名单
         * 功能相同,统一写方法
         */
        renderRightStatusBar: function (isaccept) {
            var _this = this,
                model = _this.model,
                rules = _this.configs.rules,
                messages = _this.configs.messages,
                bwl = model.get("bwl"), //黑白名单状态, black white list
                uin = model.get("uin"); //发起人的uin

            //一些需要计算的变量
            var rightHtml = isaccept ? _this.whitelistTemplate : _this.blacklistTemplate, //右侧显示: 添加到黑/白名单
                blacklistAddedHtml = $T.format(_this.tipTemplate, { message: messages.BLACK_LIST }), //已添加到黑名单
                whitelistAddedHtml = $T.format(_this.tipTemplate, { message: messages.WHITE_LIST }), //已添加到白名单
                resultHtml = isaccept ? whitelistAddedHtml : blacklistAddedHtml, //根据状态,记录下操作结束后需要显示的内容
                type = isaccept ? rules.WHITE_LIST : rules.BLACK_LIST;

            if (bwl == rules.WHITE_LIST) {
                //接受了并且已经是白名单, 显示 "已添加联系人至白名单"
                rightHtml = whitelistAddedHtml;
            }

            if (bwl == rules.BLACK_LIST) {
                //接受了,并且已经是黑名单, 显示 "已添加联系人至黑名单"
                rightHtml = blacklistAddedHtml;
            }

            _this.rightbar.html(rightHtml);
            _this.rightbar.find("a").on("click", function () {
                //添加到黑白名单
                _this.addBlackWhiteItem({
                    type: type,
                    uin: uin
                }, function (data) {
                    _this.rightbar.html(resultHtml); //上面根据接受还是拒绝,显示的HTML
                });
            });
        },

        /**
         * 显示消息主体(差异化方法)
         */
        renderMessage: function (code, data) {
            //virtual function
        },
        /**
         * 渲染左侧接受拒绝按钮
         * 显示消息状态栏(差异化方法)
         */
        renderLeftStatusBar: function (isaccept) {
            //virtual function
        }
    }));

    var baseMsg = M2012.Calendar.View.BaseMessage;
    var inviteView = "M2012.Calendar.View.InviteMessage";
    M139.namespace(inviteView, baseMsg.extend({
        conflictTemplate: '<span class="ml_20"><a class="ml_10" href="javascript:void(0);" id="more" title="">您在该时段已有 {len} 个活动</a></span>',
        trTemplate: '<tr><td width="10%;">{name}：</td><td width="90%;">{content}</td></tr>',
        acceptTemplate: '<i class="i_ok_min mr_5"></i>已接受 <a id="setremind" href="javascript:void(0);" class="mr_10">设置提醒</a>',
        rejectTemplate: '<i class="i_ok_min mr_5"></i>已谢绝',

        type: 1, //1表是活动邀请
        messages: {
            CANCEL: '该活动已经被取消'
        },
        keys: {
            content: '内容',
            dateDescript: '时间',
            site: '地点'
        },
        renderMessage: function (code, data) {
            var _this = this,
                codes = _this.configs.codes,
                tr = [],
                errTr, detailHtml,
                title, content;

            if (code == codes.OK) {
                //拼接显示内容,时间,地点
                for (var key in _this.keys) {
                    if (data[key]) {
                        tr.push($T.format(_this.trTemplate, {
                            name: _this.keys[key],
                            content: $T.Html.encode(data[key])
                        }));
                    }
                }

                title = data['title'];
                content = tr.join('');

                //消息状态
                var status = data["status"],
                    isaccept = status == _this.configs.ACCEPT,
                    conflictList = data["conflictList"] || [];

                //mod, morelist里面没有htmlencode
                var htmlEncode = $T.Html.encode;
                $.each(conflictList, function (i, item) {
                    item.title = htmlEncode(item.title);
                });
                //end mod

                _this.model.set({ conflictList: conflictList }); //活动多了一个冲突的显示
                if (status == _this.configs.UNHANDLER) {
                    _this.renderHandler();
                } else {
                    _this.renderLeftStatusBar(isaccept);
                    _this.renderRightStatusBar(isaccept);
                }

                //显示冲突的活动列表(更多列表)
                _this.renderConflict();
            } else if (code == codes.CANCEL) {
                //活动已取消
                title = '';
                content = "<tr><td>" + _this.messages.CANCEL + "</td></tr>";
            } else {
                top.M139.UI.TipMessage.show(_this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                return;
            }

            detailHtml = $T.format(_this.detailTemplate, {
                title: $T.Html.encode(title),
                content: content
            });

            _this.handler = $(detailHtml); //存起来,方便处理完成之后remove
            _this.handler.appendTo(_this.detailEl);
            //_this.detail.html(detailHtml);
        },
        renderConflict: function (isShowMore) {
            var _this = this,
                conflictList = _this.model.get('conflictList') || [],
                len = conflictList.length,
                html;

            _this.leftbar.find("#more").parent().remove(); //如果有冲突的提示,就先删除

            if (len > 0) {
                html = $T.format(_this.conflictTemplate, { len: len });
                _this.more = $(html);
                _this.more.appendTo(_this.leftbar);
                var conflictEl = _this.leftbar.find("#more");

                conflictEl.on("click", function () {
                    var thisEl = $(this);
                    //查看冲突
                    M2012.Calendar.View.MoreList.show({
                        container: thisEl,
                        date: new Date(),
                        master: master,
                        labels: master.get("checklabels") || [],
                        types: master.get("includeTypes") || [],
                        data: conflictList,
                        onRemove: function (args) {
                            for (var i = 0, len = conflictList.length; i < len; i++) {
                                if (conflictList[i].seqno == args.seqNo) {
                                    conflictList.splice(i, 1); //移除已删除的数据
                                    break;
                                }
                            }
                            _this.model.set({ conflictList: conflictList }); //save
                            M2012.Calendar.View.MoreList.hide(); //隐藏更多

                            _this.renderConflict(true); //重复的条数也要刷新, 并重新显示更多
                        }
                    });
                });

                if (isShowMore) {
                    conflictEl.trigger('click');
                }
            }
        },
        renderLeftStatusBar: function (isaccept) {
            var _this = this,
                leftHtml = isaccept ? _this.acceptTemplate : _this.rejectTemplate; //左侧的显示: 已接受/已拒绝

            //如果是操作了接受拒绝,隐藏接受和拒绝按钮
            if (_this.buttons) _this.buttons.remove();

            if (_this.more) {
                //如果有活动冲突的链接.就在前面插入状态
                _this.more.before(leftHtml);
            } else {
                _this.leftbar.html(leftHtml);
            }

            _this.leftbar.find("#setremind").on("click", function () {
                console.log(EVENTS.EDIT_ACTIVITY, {
                    seqNo: _this.model.get('refSeqno'),
                    type: _this.configs.types.INVITE //1表示邀请
                }, _this.configs);

                master.trigger(EVENTS.EDIT_ACTIVITY, {
                    seqNo: _this.model.get('refSeqno'),
                    type: _this.configs.types.INVITE //1表示邀请
                });
            });
        }
    }));

    var shareView = "M2012.Calendar.View.ShareMessage";
    M139.namespace(shareView, baseMsg.extend({

        titleTemplate: '<span class="ad-tagt " style="background-color:{color};"></span>{title}',
        trTemplate: '<tr><td>此日历下共有 {len} 条活动，接受共享后此日历下的所有活动将同步至您的活动。</td></tr>',
        acceptTemplate: '<i class="i_ok_min mr_5"></i>已接收并添加到至您的活动中&nbsp;&nbsp;<a class="mr_10" href="javascript:void(0);">查看日历</a><span></span>',
        rejectTemplate: '<i class="i_ok_min mr_5"></i>已谢绝',

        type: 2, //2表示日历共享
        messages: {
            CANCEL: '该日历已经被取消'
        },
        renderMessage: function (code, data) {
            var _this = this,
                codes = _this.configs.codes,
                tr = [],
                errTr, detailHtml,
                title, content;

            if (code == codes.CANCEL) {
                //活动已取消
                title = '';
                content = _this.messages.CANCEL;
            } else {
                //拼接显示内容
                title = $T.format(_this.titleTemplate, {
                    color: data["color"],
                    title: $T.Html.encode(data["labelName"])
                });
                content = $T.format(_this.trTemplate, { len: data['calendarCount'] }); //条数

                //消息状态
                var status = data["status"],
                    isaccept = status == _this.configs.ACCEPT;
                if (status == _this.configs.UNHANDLER) {
                    _this.renderHandler();
                } else {
                    _this.renderLeftStatusBar(isaccept);
                    _this.renderRightStatusBar(isaccept);
                }
            }

            detailHtml = $T.format(_this.detailTemplate, {
                title: title,
                content: "<tr><td>" + content + "</td></tr>"
            });
            _this.detailEl.html(detailHtml);
        },
        renderLeftStatusBar: function (isaccept) {
            //查看,添加到黑白名单
            var _this = this,
                model = _this.model,
                leftHtml = isaccept ? _this.acceptTemplate : _this.rejectTemplate, //左侧的显示: 已接受/已拒绝
                labelId = model.get("refSeqno");

            if (isaccept) {
                master.trigger(EVENTS.LABEL_CHANGE); //通知左侧请求接口刷新数据
            }

            _this.leftbar.html(leftHtml);

            _this.leftbar.find("a").on("click", function () {
                //查看日历
                master.trigger(EVENTS.EDIT_LABEL, { labelId: labelId, isShared: true });
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);

﻿
(function ($, _, M139, top) {

    var className = "M2012.Calendar.Model.Message";
    M139.namespace(className, Backbone.Model.extend({
        name: className,
        defaults: {
            pageIndex: 1,
            pageSize: 10,
            type: 1
        },
        initialize: function () {
            this.API = M2012.Calendar.API;
        },
        getMessageList: function (options, success, error) {
            //compatible
            var pageIndex = this.get("pageIndex"),
                pageSize = this.get("pageSize"),
                type = this.get("type");
            options = $.extend(
                {
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    type: type
                }, options);

            this.API.getMessageList({
                data: options,
                success: success,
                error: error
            });
        },
        getMessageById: function (messageId, success, error) {
            messageId = messageId || 0;

            this.API.getMessageById({
                data: { messageId: messageId },
                success: success,
                error: error
            });
        },
        delMessage: function (seqno, success, error) {
            seqno = seqno || 0;

            this.API.delMessage({
                data: { seqno: seqno },
                success: success,
                error: error
            });
        },
        getMessageCount: function (type, success, error) {
            var data = { type: type };

            this.API.getMessageCount({
                data: data,
                success: success,
                error: error
            });
        },
        /**
         接受或者拒绝邀请
         @param options.actionType {Int} 操作类型：0：接受操作 1：拒绝操作
         @param options.seqNos {String} 邀请的活动id，多个用逗号隔开
         @param options.refuseResion {String} 非必须,如果是拒绝的操作，填写拒绝的原因
         */
        updateInviteStatus: function (options, success, error) {
            this.API.updateInviteStatus({
                data: options,
                success: success,
                error: error
            });
        },
        /**
         接受或者拒绝日历共享
         @param options.actionType {Int} 操作类型：0：接受操作 1：拒绝操作
         @param options.seqNos {String} 共享的日历id，多个用逗号隔开
         @param options.refuseResion {String} 非必须,如果是拒绝的操作，填写拒绝的原因
         */
        processShareLabelInfo: function (options, success, error) {
            this.API.processShareLabelInfo({
                data: options,
                success: success,
                error: error
            });
        },
        addBlackWhiteItem: function (options, success, error) {
            this.API.addBlackWhiteItem({
                data: options,
                success: success,
                error: error
            });
        }
    }));
})(jQuery, _, M139, window._top || window.top);
﻿
(function ($, _, M139, top) {

    var master = window.$Cal,
        EVENTS = master.EVENTS;
    var className = "M2012.Calendar.View.Message";

    M139.namespace(className, Backbone.View.extend({
        name: className,
        viewName: "message",
        templates: {
            MAIN: ['<div class="sd-content">',
                     '<div class="bgPadding">',
                        '<div class="createTop tabTitle">',
                            '<h2>日历消息<a id="goback" href="javascript:void(0);" class="back">&lt;&lt;返回</a></h2>',
                        '</div>',
                     '</div>',
                     '<div id="naviBar" class="bgMargin" style="">',
                         '<div class="tab setTab">',
                             '<div class="tabTitle">',
                                 '<ul id="tabs">',
                                     '<li id="lnkInvite" class="on">',
                                        '<a href="javascript:" hidefocus="1"><span>活动邀请</span></a>',
                                        '<em id="inviteUnreadNum" class="newboxNav_num hide"></em>',
                                     '</li>',
                                     '<li id="lnkShare" class="">',
                                        '<a href="javascript:" hidefocus="1"><span>日历共享</span></a>',
                                        '<em id="shareUnreadNum" class="newboxNav_num hide"></em>',
                                     '</li>',
                                 '</ul>',
                                 '<div id="pagerContainer"></div>',
                             '</div>',
                         '</div>',
                     '</div>',
                     '<div class="ad-list-div">',
                         '<div id="msgList" class="pl_10 pr_10 pt_10"></div>',
                     '</div>',
                     '<div class="mt_20"></div>',
                 '</div>'].join(""),
            NO_MSG: '<div class="noindexbody"><div class="empty_btn">暂无消息</div></div>'
        },
        msgTypes: {
            ALL: 0, //所有,用于获取未读数量
            INVITE: 1,
            SHARE: 2
        },
        messages: {
            LOADING: '正在加载中...',
            ERROR: '操作失败'
        },
        dataKeys: {
            "1": "inviteUnread",
            "2": "shareUnread"
        },
        status: {
            OK: "S_OK"
        },
        initialize: function (options) {
            var _this = this,
                TYPES = _this.msgTypes;

            _this.master = master;
            _this.model = new M2012.Calendar.Model.Message({ master: _this.master });

            _this.master.on(EVENTS.VIEW_CREATED, function (args) {
                if (args.name == _this.viewName) {
                    _this.render(args);
                    //触发显示,即VIEW_SHOW
                    if (typeof args.onshow === 'function') {
                        args.onshow();
                    }
                }
            }).on(EVENTS.VIEW_SHOW, function (args) {
                if (args && args.name == _this.viewName) {
                    if (!args.type) args.type = 1; //compatible

                    _this.model.set("currentType", null); //clear
                    _this.renderView(args);
                    _this.renderMsgCount(TYPES.ALL); //消息的未读数量
                    _this.hide = false; //显示状态,主要作用在下面else部分
                } else {
                    //在切换到其他页面时,就处理逻辑,切换回来时,就不会有一闪而过的旧数据
                    if (_this.hide === undefined || _this.hide) return;

                    if (!_this.hide) {
                        _this.clear();
                        _this.hide = true;
                    }
                }
            });
        },
        /**
         * 渲染日历消息的主视图
         */
        render: function (options) {
            var _this = this;

            _this.container = options.container;
            _this.container.html(_this.templates.MAIN);

            _this.goback = $("#goback", _this.container);
            _this.tabs = $("#tabs li", _this.container);
            _this.lnkInvite = $("#lnkInvite", _this.container);
            _this.lnkShare = $("#lnkShare", _this.container);
            _this.inviteUnread = $("#inviteUnreadNum", _this.container);
            _this.shareUnread = $("#shareUnreadNum", _this.container);
            _this.pager = $("#pagerContainer", _this.container);
            _this.content = $(".ad-list-div", _this.container);
            _this.msgList = $("#msgList", _this.container);

            _this.initEvents();
        },
        initEvents: function (options) {
            var _this = this,
                model = _this.model,
                TYPES = _this.msgTypes;

            //返回
            _this.goback.on('click', function () {
                _this.master.trigger(EVENTS.NAVIGATE, { path: "mainview" });
            });

            //点击邀请消息
            _this.lnkInvite.on("click", function () {
                var currentType = _this.model.get("currentType");
                if (currentType == TYPES.INVITE) return; //就是当前类型,暂时不刷新了

                _this.renderView({ type: TYPES.INVITE });
            });

            //点击共享消息
            _this.lnkShare.on('click', function () {
                var currentType = _this.model.get("currentType");
                if (currentType == TYPES.SHARE) return;

                _this.renderView({ type: TYPES.SHARE });
            });

            //未读的消息数量显示
            _this.model.on("change:inviteUnread", function () {
                var count = model.get("inviteUnread");
                if (count <= 0) {
                    _this.inviteUnread.html('').addClass("hide");
                } else {
                    count = count > 99 ? "99+" : count;
                    _this.inviteUnread.html(count);
                    _this.inviteUnread.removeClass("hide");
                }

                master.set({ msg_changed_flag: true }); //标记未读数量变更,返回后自动刷新
            }).on("change:shareUnread", function () {
                var count = model.get("shareUnread");
                if (count <= 0) {
                    _this.shareUnread.html('').addClass("hide");
                } else {
                    count = count > 99 ? "99+" : count;
                    _this.shareUnread.html(count);
                    _this.shareUnread.removeClass("hide");
                }

                master.set({ msg_changed_flag: true });
            }).on("change:currentType", function () {
                var type = model.get("currentType");

                _this.tabs.removeClass("on");
                if (type == TYPES.SHARE) {
                    _this.lnkShare.addClass("on"); //如果是共享
                } else {
                    _this.lnkInvite.addClass("on"); //否则默认邀请
                }
            }).on("change:msgCount", function () {
                var type = model.get("currentType");
                _this.renderMsgCount(TYPES.ALL); //未读数量变更
            }).on("event:refresh", function (data) {
                //删除消息时,重新渲染列表(主要是翻页逻辑)
                var type = model.get("currentType"),
                    pageIndex = model.get("pageIndex"),
                    pageSize = model.get("pageSize");
                _this.renderView({
                    type: type,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                });
            });

            //Auto resize
            var hGoback = $(".bgPadding", _this.container).height(),
                hTab = $("#naviBar", _this.container).height(),
                timer;
            $(window).on('resize', function () {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                timer = setTimeout(function () {
                    var hWin = $(window).height();
                    _this.content.height(hWin - hGoback - hTab); //如果计算不正确,就直接减掉80,除非UI调整
                }, 150);
            });

            $(window).trigger("resize");
        },
        /**
         * 渲染日历消息逻辑的主入口
         */
        renderView: function (options) {
            this.msgList.html(""); //清空旧的数据
            this.renderMsgList(options);
        },
        renderMsgCount: function (type) {
            var _this = this;
            //异步加载未读数量
            _this.model.getMessageCount(type, function (data) {
                var code = data && data.code,
                    obj = data && data["var"];

                if (code != _this.status.OK) return;

                _this.model.set({
                    inviteUnread: obj["inviteCount"] || 0,
                    shareUnread: obj["shareCount"] || 0
                });
            }, function (data) {
                _this.model.set(dataType, 0); //获取未读数错误,不影响功能,置零
            });
        },
        renderPager: function (pageIndex, pageSize, itemCount) {
            var _this = this,
                currentType = _this.model.get("currentType");
            var pages = Math.ceil(itemCount / pageSize);//总页数

            _this.pager.html(""); //清空

            //总条数＜每页最大数量 ,不需要分页
            if (pageSize >= itemCount) {
                return;
            }

            //需要分页
            var pager = M2012.UI.PageTurning.create({
                pageIndex: pageIndex,
                pageCount: pages,
                styleTemplate: 2,
                container: _this.pager
            });

            pager.on("pagechange", function (pageIndex) {
                _this.model.set({ pageIndex: pageIndex, pageSize: pageSize }); //记录页数,删除消息后可以渲染对应数据
                _this.renderView({ type: currentType, pageIndex: pageIndex });
            });
        },
        renderMsgList: function (options) {
            options = options || {};
            var _this = this,
                STATUS = _this.status,
                TYPES = _this.msgTypes,
                MESSAGES = _this.messages,
                currentType = _this.model.get("currentType"),
                type = options.type == TYPES.SHARE ? TYPES.SHARE : TYPES.INVITE; //非共享,统一显示邀请

            var params = {
                type: type,
                pageIndex: options.pageIndex || 1,
                pageSize: options.pageSize || 10
            };

            top.M139.UI.TipMessage.show(MESSAGES.LOADING);

            //加载消息列表
            _this.model.getMessageList(params, function (data) {
                var code = data && data.code,
                    obj = (data && data["var"]) || {},
                    items, count, unread, lastPage,
                    i, len, item;

                top.M139.UI.TipMessage.hide();

                //this.msgList.html(""); //接口返回再次清理.测试线接口太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太太慢了........
                if (code == STATUS.OK) {
                    items = obj.table || [];
                    count = obj.count || 0;
                    unread = obj.unreadCount || 0;

                    if (items && items.length > 0) {
                        //显示消息列表.对应功能由MessageItem内部处理
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            item.model = _this.model; //把model传递进去,有一些交互
                            item.container = _this.msgList;
                            new M2012.Calendar.View.MessageItem(item);
                        }
                    } else {
                        if (params.pageIndex > 1) {
                            //分页中某页数据删除完了,就判断跳转
                            lastPage = Math.ceil(count / params.pageSize);
                            _this.renderView({
                                type: params.type,
                                pageIndex: lastPage, //最后一页
                                pageSize: params.pageSize,
                                force: true
                            });
                        } else {
                            _this.msgList.html(_this.templates.NO_MSG);
                        }
                    }

                    _this.model.set("currentType", type); //记录当前打开的标签
                    _this.model.set(_this.dataKeys[type], unread); //刷新未读数

                    //渲染分页
                    if (currentType != type || options.force) {
                        _this.renderPager(params.pageIndex, params.pageSize, count);
                    }
                } else {
                    _this.errorTip();
                }
            }, function (data) {
                _this.errorTip();
            });
        },
        clear: function () {
            var _this = this;

            _this.model.set({ inviteUnread: 0, shareUnread: 0, currentType: _this.msgTypes.INVITE }); //消息数,标签页
            _this.pager.html(""); //分页
            _this.msgList.html(""); //消息列表
        },
        errorTip: function (msg) {
            top.M139.UI.TipMessage.show(this.messages.ERROR);
        }
    }));

    //initialize
    new M2012.Calendar.View.Message({ master: master });

})(jQuery, _, M139, window._top || window.top);
