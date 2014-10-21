; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Day";

    M139.namespace(_class, superClass.extend({

        name: _class,

        master: null,

        model: null,

        viewName: "day",

        //视图容器
        container: null,

        //当前视图
        currentEl: null,

        messages: {
            LOADING: "正在加载中..."
        },

        initialize: function (args) {

            var self = this;

            if (!args)
                args = {};

            self.master = args.master;

            self.master.on(self.master.EVENTS.VIEW_CREATED, function (data) {
                if (self.viewName === data.name) {
                    //渲染
                    self.container = data.container;
                    self.container.height($(document.body).height() - $("#pnlNaviBar").height());
                    self.container.css({
                        "overflow-y": "scroll",
                        "overflow-x": "hidden",
                        "position": "relative"
                    });
                    self.model = new M2012.Calendar.Model.Day({
                        master: self.master
                    });

                    self.initEvents();
                    self.render();
                    self.fillData();

                    if (_.isFunction(data.onshow)) {
                        data.onshow();
                    }

                }
            }).on(self.master.EVENTS.VIEW_SHOW, function (data) {
                if (data && data.args && !data.args.silent && data.args.subview == self.viewName) {
                    self.fillData();
                }
            });

            //删除backbone自己创建的div
            self.$el.remove();
        },

        initEvents: function () {

            var self = this;

            self.master.on("change:year change:month change:day change:checklabels change:includeTypes", function (model, value) {
                //判断是否是当前视图
                if (self.master.get("view_location").view == self.viewName) {
                    if (self.timer) {
                        window.clearTimeout(self.timer);
                    }
                    //延迟一下,可以缓解多个值变更时触发多次,造成请求多次的问题
                    self.timer = window.setTimeout(function () {
                        self.fillData();
                    }, 0xff);
                }
            });
        },

        render: function () {

            var self = this;

            self.$el.remove();
            //清空上次的日视图
            self.container.empty();

            self.currentEl = $($T.format(self.template.rows, {
                cid: self.cid
            })).appendTo(self.container);

            // 点击日视图添加活动
            self.container.find("tr[bind]>td").click(function (e) {
                var target = $(this);
                //如果在很短时间内元素已经被点击过则不让继续点击
                if (self.hasLocked(target)) {
                    return;
                }

                //如果是在订阅日历下面点击,直接返回
                var flag = self.master.get("view_filter_flag"); //subscribe
                if (flag === "subscribe") return;
                //end

                var date = new Date(
                    Number(self.master.get("year")),
                    Number(self.master.get("month")) - 1,
                    Number(self.master.get("day")));
                //当前时间
                var hour = target.parent().attr("bind");
                var time = null;
                var isFullDayEvent = false;

                if (hour == "100")
                    isFullDayEvent = true;
                else {
                    time = hour + "00";
                }
                //弹出添加窗口
                self.master.trigger(self.master.EVENTS.ADD_POP_ACTIVILY, {
                    //触发源和事件源
                    //用于定位弹出框位置
                    target: target,
                    event: e,
                    //标签
                    //指定日期
                    date: date,
                    //时分
                    time: time,
                    //是否全天事件
                    isFullDayEvent: isFullDayEvent,
                    //主控制器
                    master: self.master,
                    //保存成功后的回调处理
                    callback: function () {
                        //刷新日视图
                        self.master.trigger(self.master.EVENTS.NAVIGATE, {
                            path: "mainview/refresh"
                        });
                    }
                });

            });
        },

        fillData: function () {

            var self = this;
            //var divWaiting = self.getElement("divWaiting");

            //divWaiting.removeClass("hide");
            top.M139.UI.TipMessage.show(self.messages.LOADING);
            // 先清除所有的活动
            self.container.find("div[cmd='showactivily']").remove();

            self.model.getData(function (result) {

                var data = result || {};
                var rows = self.currentEl.find('tr[bind]');

                $.each(rows, function (i, n) {
                    var row = $(n);
                    var hour = row.attr("bind");
                    var rowData = data[hour] || [];                
                    self.setRowData(row, rowData, hour);
                });

                //查看详情
                self.container.find("div[cmd='showactivily']").click(function (e) {
                    M139.Event.stopEvent(e);
                    var target = $(this);

                    //点击频率限制
                    if (self.hasLocked(target)) {
                        return;
                    }

                    //先尝试关闭所有弹出框
                    if (!M2012.Calendar.View.Popup.Direction.tryClose()) {
                        return;
                    }

                    var type = target.attr("type");
                    var seqNo = target.attr("seqNo");

                    //查看活动详情
                    self.master.trigger(self.master.EVENTS.VIEW_POP_ACTIVILY, {
                        seqNo: seqNo,
                        type: type,
                        event: e,
                        target: target,
                        // rect: srcRect,
                        //回调函数
                        callback: function (args) {
                            //刷新日视图
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
                //隐藏加载提示
                //divWaiting.addClass("hide");
                top.M139.UI.TipMessage.hide();
            }, function (e) {

                //divWaiting.addClass("hide");
                top.M139.UI.TipMessage.hide();
                //隐藏加载中提示
                waitEl.addClass("hide");

                if (e && e.code == "FS_SESSION_ERROR") {
                    //会话过期
                    top.$App.trigger("change:sessionOut", {}, true);
                }

                top.M139.UI.TipMessage.show("操作失败，请稍后再试", {
                    delay: 5000, className: "msgRed"
                });

                self.logger.error('获取日活动信息失败: getCalendarView', e);
            });
        },

        /**
         * 锁定元素不让其重复点击
         */
        hasLocked: function (target) {
            var key = "locked";
            var flag = target.attr(key);
            if (flag == "1") {
                return true;
            }
            target.attr(key, "1");
            window.setTimeout(function () {
                target.attr(key, "");
            }, 1500);

            return false;
        },

        /**
         *  填充行信息
         */
        setRowData: function (row, val, hour) {
            var self = this;
            var currHour = self.model.getCurrentHour();
            var currDate = $Date.format("yyyy-MM-dd", new Date(
                self.master.get("year"),
                self.master.get("month") - 1,
                self.master.get("day"))
            );

            var cells = row.find("td");

            for (var i = 0; i < cells.length; i++) {
                var cell = $(cells[i]);

                if (val) {
                    self.setCellData(cell, val, hour, i);
                } else {
                    cell.attr('name', hour + "_" + i).html("");
                }

                if (currDate == currHour.curDateStr) {

                    if (hour && hour == currHour.hour) {
                        var html = $T.format(self.template.cell, {
                            width: row.width(),
                            topMargin: self.getMarkTop(currHour.min)
                        });
                        cell.prepend($(html));
                        cell.css({ display: 'block', _position: 'relative' });
                    }
                }
            }
        },

        /**
         *  填充列信息
         */
        setCellData: function (cell, val, hour, week) {

            var self = this;
            //最多显示活动数
            var consant = self.master.CONST;
            var count = consant.dayViewConf.maxCount;
            var length = val.length;
            var hasMore = length > count;

            length = hasMore ? count : length;

            var width = parseInt(cell.css("width"));
            var currHour = self.model.getCurrentHour();
            var html = [];
            var fragment = "";

            //IE11循环时第二个有数据的行数取不到td的宽度，奇怪死了
            if (!self.scheduleTotalWith) {
                self.scheduleTotalWith = width;
            } else {
                width = self.scheduleTotalWith;
            }

            //单元格右侧留出部分空白以保证有地方可以点击添加活动
            // if (hasMore) {
            width -= self.master.CONST.dayViewConf.moreCalWidth;
            // }

            //自动调节 每个日程之间的宽度
            //减1是为了每个活动元素都有一个border，而width值的计算没有计算border值，这样多个元素的宽度叠加之后就会超出格子总宽度
            var perWidth = parseInt(width / length);
            //16 = 14+2是文字后的小ICON如：生日，球赛...(兼容IE6样式问题);  2是每个活动加了边框
            var perWidthChild = perWidth - 16;
            for (var i = 0, len = length; i < len ; i++) {

                var backColor = val[i].color;
                var txtColor ="";

                $.extend(val[i], {
                    perWidth: perWidth + 'px',
                    perWidthChild: perWidthChild + 'px',
                    leftPos: perWidth * i + 'px',
                    height: parseInt(self.getHeight(val[i].sTime, val[i].eTime, val[i].allDay == 1)) + 'px',
                    topMargin: self.getTMargin(val[i].sTime),
                    time: hour,
                    curweek: week,
                    index: i,
                    title: (function () {
                        var title = val[i].title || "";

                        if (val[i].specialType == consant.specialType.birth) {
                            title = title + '生日';
                            txtColor = consant.activilyTxtColor.blackColor;

                        } else if (val[i].operationFlag) {
                            txtColor = consant.activilyTxtColor.blackColor;

                        } else {
                           // txtColor = consant.activilyTxtColor.unSystem;
                        }

                        return title;
                    })()
                });

                //获取活动类型
                var type = consant.activityType.myself;

                if (val[i].isInvitedCalendar) {
                    type = consant.activityType.invited;

                } else if (val[i].isSharedCalendar) {
                    type = consant.activityType.shared;

                } else if (val[i].isSubCalendar) {
                    type = consant.activityType.subscribed;
                }
                if (backColor) {
                    var className = self.master.CONST.activilyColors[val[i].color] || "";
                    if (className)
                        backColor = "";
                }
                html.push($T.format(self.template.activily, $.extend(val[i], {
                    txtColor: txtColor,
                    backColor: backColor,
                    className: className,
                    iconType: this.getActivilyIcon(val[i]),
                    scheduleMsg: (val[i].status == 0) ? self.template.invited : "",
                    scheduleType: type,
                    seqNo: val[i].seqNo
                })));
            }

            //是否展现更多的提醒
            var date = new Date(self.master.get("year"), self.master.get("month") - 1, self.master.get("day"));
            var dateKey = M2012.Calendar.View.MoreList.getKey(date, parseInt(hour));

            cell.html($T.format("<div class='day-table-div'>{0}</div>", [html.join("")]));

            if (hasMore) {
                var fragment = $T.format(self.template.more, {
                    cid: self.cid,
                    dateKey: dateKey,
                    count: val.length - length
                });
                cell.append(fragment);
                cell.find("a[name='view-activily-more']").click(function (e) {
                    M139.Event.stopEvent(e);
                    var me = $(this);

                    M2012.Calendar.View.MoreList.show({
                        date: date,
                        hour: parseInt(hour),
                        master: self.master,
                        labels: self.master.get("checklabels"),
                        types: self.master.get("includeTypes")
                    });

                });
            }
        },

        /**
        * 获取活动的标记图标
        */
        getActivilyIcon: function (data) {

            var constant = this.master.CONST;

            if (data.enable == 1) {
                return constant.activilyIconType.clock;
            } else if (data.operationFlag) {
                icontype = constant.activilyIconType[data.operationFlag];
            }
        },

        /**
      * 获取高度，当日程跨小时，根据开始时间与结束时间计算高度
      */
        getHeight: function (sTime, eTime, isAllDay) {

            var self = this;
            var capi = self.master.capi;
            var lineHeight = self.master.CONST.dayViewConf.lineHeight;

            var height = lineHeight;

            if (isAllDay) {
                //全天事件的高度
                height = lineHeight * 2;
            }
            else if (eTime === sTime) {
                //如果时间差为0,则默认为10px;

                height = lineHeight; //显示为30分钟的活动
            }
            else {
                //下面处理非全天事件

                //有几个半个时间 *20px 10:00--11:00()
                var sHour = self.model.getHour(sTime);
                var eHour = self.model.getHour(eTime);
                var sMinType = capi.getMinType(sTime);
                var eMinType = capi.getMinType(eTime);

                var difLineHeight = (eHour - sHour - 1) * 2;

                if (sMinType === 0 || sMinType === 1) {
                    difLineHeight += 2;
                } else {
                    difLineHeight += 1;
                }

                if (eMinType === 3) {
                    difLineHeight += 2;
                } else if (eMinType === 0 || eMinType === 2) {
                    difLineHeight += 1;
                }

                height = difLineHeight * lineHeight;
            }

            //最小显示半小时，否则元素可能显示不全
            return height < lineHeight ? lineHeight : height;
        },

        /**
         * 获取当前活动距离顶部的高度
         */
        getMarkTop: function (min) {
            var value = (2 * min * 21) / 60;

            if ($.browser.msie && $.browser.version == 6) {
                value -= 20;
            }

            return value;
        },

        /**
         * 超半小时，样式类型
         */
        getTMargin: function (time) {

            var self = this;
            var capi = self.master.capi;

            var type = capi.getMinType(time);
            return ['0px', '0px', '21px', '21px'][type];
        },

        getElement: function (id) {

            var self = this;

            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });

            return $(id);
        },

        template: {
            rows: [
                 //'<div id="{cid}_divWaiting" class="hide">',
                 //   '<div class="bg-cover"></div>',
                 //   '<div class="noflashtips inboxloading loading-pop" id="">',
                 //   '<!--[if lte ie 7]><i></i><![endif]-->',
                 //       '<img src="../../images/global/load.gif" alt="" style="vertical-align:middle">正在载入中，请稍候......',
                 //   '</div>',
                 //'</div>',
                '<div id="day-table-wrap"  onselectstart="return false;" style="-moz-user-select:none;">',
                     '<div id="weekHead">',
                         '<table class="day-table">',
                             '<thead>',
                                 '<tr bind="100">',
                                     '<th style="border-top:1px solid #dddddd">全天</th>',
                                     '<td style="border-top:1px solid #dddddd"></td>',
                                 '</tr>',
                             '</thead>',
                         '</table>',
                     '</div>',
                     '<div class="ad-list-div" id="{cid}_divList">',
                         '<!--[if lt ie 8]>',
                             '<div style=\'+zoom:1;\'>',
                         '<![endif]-->',
                         '<table class="day-table">',
                             '<tbody>',
                                 '<tr bind="00">',
                                     '<th>00:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="01">',
                                     '<th>01:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="02">',
                                     '<th>02:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="03">',
                                     '<th>03:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="04">',
                                     '<th>04:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="05">',
                                     '<th>05:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="06">',
                                     '<th>06:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="07">',
                                     '<th>07:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="08" id="moveHere">',
                                     '<th>08:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="09">',
                                     '<th>09:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="10">',
                                     '<th>10:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="11">',
                                     '<th>11:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="12">',
                                     '<th>12:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="13">',
                                     '<th>13:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="14">',
                                     '<th>14:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="15">',
                                     '<th>15:00</th>',
                                     '<td>',
                                         '<!--',
                                         '半高时class ="day-table-mtd"',
                                         '全高时class ="day-table-td"',
                                         '半高时在下面时需要 "加上margin-top:21px;"',
                                         '-->',
                                     '</td>',
                                 '</tr>',
                                 '<tr bind="16">',
                                     '<th>16:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="17">',
                                     '<th>17:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="18">',
                                     '<th>18:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="19">',
                                     '<th>19:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="20">',
                                     '<th>20:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="21">',
                                     '<th>21:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="22">',
                                     '<th>22:00</th>',
                                     '<td></td>',
                                 '</tr>',
                                 '<tr bind="23">',
                                     '<th>23:00</th>',
                                     '<td></td>',
                                 '</tr>',
                             '</tbody>',
                         '</table>',
                         '<!--[if lt ie 8]>',
                             '</div>',
                         '<![endif]-->',
                     '</div>',
                 '</div>'].join(""),

            cell: '<div class="nowTime" style="border-bottom:1px solid red;height:0px;width:{width}px;margin-top:{topMargin}px;position:absolute;z-index:3;"></div>',
            more: [
                '<div class="p-relative" style="width: 34px; float: right; z-index: 1; margin-top: -39px;text-align: right;">',
                    '<a href="javascript:void(0);" name="view-activily-more" class="grN" title="查看更多" data-cmd="showmore">{count}</a>',
                    '<div class="j_div_more hide" id="div_more_{dateKey}" style="text-align: left;"></div>',
                 '</div>'
            ].join(""),

            activily: [
                '<div name="{time}_{curweek}_{index}"  title="{title}" class="day-table-td" style="width:{perWidth};left:{leftPos};margin-top:{topMargin};height:{height};z-index:1;">',
                    '<div name="{time}_{curweek}_{index}" seqno="{seqNo}"  cmd="showactivily" type="{scheduleType}" class="tb-ad-tag {className}" style="background-color:{backColor}; width:{perWidthChild};color:{txtColor};height:{height};line-height:{height};overflow:hidden;cursor: pointer;">',
                        '<span style="height:{height};line-height:{height};">{title}</span><i class="{iconType} IconPosion ml_10"></i>{scheduleMsg}',
                    '</div>',
                '</div>'].join(""),

            invited: '<a href="javascript:;"><i class="i_message" style="top:2px;right:10px" name="msgIcon"></i></a>'
        }

    }));

    $(function () {
        var dayView = new M2012.Calendar.View.Day({ master: window.$Cal });
    });

})(jQuery, _, M139, window._top || window.top)