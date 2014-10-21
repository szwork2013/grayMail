

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase,
        commonAPI = new M2012.Calendar.CommonAPI(),
        _class = "M2012.Calendar.View.DateTimePicker2";
    //不具公用性,暂时先叫DateTimePicker2
    M139.namespace(_class, superClass.extend({
        template: {
            MAIN: ['<div class="element">',
                        '<div id="{cid}_tips" data-type="tips" class="tips meet-tips" style="display:none;">',
                            '<div class="tips-text">开始时间不能晚于结束时间</div>',
                            '<div class="tipsBottom diamond" style="left:10px;"></div>',
                        '</div>',
                        '<div id="{cid}_date" class="dropDown fl" style="width:124px;">',//为了正确显示闰xx月，长度加大
                            //'<div class="dropDownA" href="javascript:void(0)">',
                            //    '<i class="i_triangle_d"></i>',
                            //'</div>',
                            '<div id="{cid}_date_text" class="dropDownText" style="text-align:center; padding-left: 0px;">{date}</div>',
                        '</div>',
                        '<div id="{cid}_time" class="fl" style="width:80px;">',
                            //'<div class="dropDownA" href="javascript:void(0)">',
                            //    '<i class="i_triangle_d"></i>',
                            //'</div>',
                            //'<div id="{cid}_time_text" class="dropDownText">{time}</div>',
                        '</div>',
                    '</div>'].join(""),

            TIPS: "开始时间不能晚于结束时间"
        },
        configs: {
            calendarTypes: {
                calendar: 10, //公历
                lunar: 20 //农历
            }
        },

        /**
         * 时间组件，只能选择一个时间
         * new M2012.Calendar.UI.DateTimePicker2.View({
         *     target:$("#id"),
         *     offset:1, //通过after计算后的第一个时间的选项11:15-->12:30
         *     date:new Date(2014,0,1), //2014-01-01 00:00:00 ,
         *     fullday:true, //全天，不显示时间
         *     lunar:true, //农历
         *     onSelected:function(item){
         *         console.log(item); //{date:"2014-01-02",time:"08:00",datetime:date} //date为一个Date对象
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;

            _this.options = options || {};
            _this.target = options.container || options.target;
            _this.offset = $.isNumeric(options.offset) ? options.offset : 0;
            _this.onSelected = options.onSelected;
            var date = options.date || new Date();

            _this.model = new Backbone.Model();
            _this.model.set({
                "date": date,
                "fullday": options.fullday || false,
                "lunar": options.lunar || false
            });

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                date: '',
                time: ''
            });

            _this.target.html(html);
        },
        initEvents: function () {
            var _this = this;
            var model = _this.model;
            var date = _this.model.get("date");
            var $container = _this.target;

            //一堆容器
            _this.dateContainer = $container.find(_this.getSelector("_date"));
            _this.dateText = $container.find(_this.getSelector("_date_text"));
            _this.timeContainer = $container.find(_this.getSelector("_time"));
            _this.timeText = $container.find(_this.getSelector("_time_text"));
            _this.tips = $container.find(_this.getSelector("_tips"));

            _this.dateContainer.bind("click", function () {
                _this.dateText.css({
                    "background-color": "#2757EC", //不调用新组件,不会用
                    "color": "#fff"
                });
            });

            $(document.body).click(function () {
                _this.dateText && _this.dateText.css({
                    "background-color": "",
                    "color": ""
                })
            });

            //日期选择
            _this.datePicker = new M2012.Calendar.CalendarView({
                date2StringPattern: 'yyyy-MM-dd',
                id: this.cid + '_date',
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDay(),
                callback: function (date) {
                    _this.onDateSelect(date);
                    $(document.body).trigger("click");
                }
            });

            //时间选择
            //var timeItems = _this.getTimeItems();
            //_this.timeContainer.on("click", function () {
            //    M2012.UI.PopMenu.create({
            //        maxHeight: 150,
            //        width: _this.timeContainer.width(), //去掉padding的2px
            //        items: timeItems.data,
            //        dockElement: _this.timeContainer,
            //        //customClass: "menuPop-sd",
            //        onItemClick: function (item) {
            //            _this.onTimeSelect(item);
            //        }
            //    });
            //});

            _this.timeSelector = new M2012.Calendar.View.TimeSelector({
                container: _this.timeContainer,
                onChange: function (data) {
                    _this.onTimeSelect(data);
                }
            });

            //#region 事件监听

            model.on("change:date", function () {
                var str = model.get("date");
                var isLunar = model.get("lunar");

                //计算农历
                var dateObj = model.get("dateObj");
                var tmp = new Date(dateObj.date.getTime());
                var obj = commonAPI.createDateObj(tmp);
                //保存农历的日期
                _this.model.set("lunarDate", {
                    isLeap: obj.isLeap,
                    year: obj.lYear,
                    month: obj.lMonth,
                    day: obj.lDay
                });

                if (isLunar) {
                    //显示农历字符串
                    //var lunarMonth = (obj.isLeap ? "闰" : "") + obj.cMonth; //是否闰月
                    //str = obj.lYear + "年" + lunarMonth + obj.cDay; //2013年腊月十五

                    //非常奇怪.突然又有了"闰"字
                    str = obj.lYear + "年" + obj.cMonth + obj.cDay; //2014年闰九月十五
                }
                _this.dateText.html(str);
            }).on("change:time", function () {
                var item = model.get("time");
                _this.timeText.html(item.text);
            }).on("change:lunar", function () {
                model.trigger("change:date");
            });

            if (_this.onSelected) {
                //有回调才监听
                model.on("onselect", function () {
                    _this.onSelected(_this.getData());
                });
            }

            //初始化
            var initDate = _this.getClosestDate(date);
            _this.onDateSelect(initDate.datetime, { silent: true });
            _this.timeSelector.setData({ hour: initDate.hour, minute: initDate.minute });
            setTimeout(function () {
                model.trigger("onselect"); //通知到主view
            }, 0xff);
            //#endregion
        },
        getSelector: function (id) {
            return "#" + this.cid + id;
        },
        getElement: function (id) {
            return this.target.find(this.getSelector(id));
        },
        getTimeItems: function () {
            var _this = this;

            var itemList = [], itemMap = {};
            var minutes = [0, 15, 30, 45]; //只可选择15分钟的间隔
            var len = minutes.length;
            for (var i = 0; i < 24; i++) {
                for (var j = 0; j < len; j++) {
                    var minute = minutes[j];
                    var text = _this.padding(i) + ":" + _this.padding(minute); //10:30
                    var item = {
                        text: text,
                        data: {
                            str: text.replace(":", ""), //1030 这样的字符串
                            hour: i,
                            minute: minute
                        }
                    };
                    itemMap[text] = item;
                    itemList.push(item);
                }
            }

            return {
                data: itemList,
                dataMap: itemMap //用来根据00:00获取到对应的对象
            };
        },
        getClosestDate: function (date) {
            /** 
             * 用来计算最近的一个可以选择的时间点
             * var date1=new Date(2013,11,25,12,01,00); //2013-12-25 12:01:00
             * getClosestTime(date1); //{date:"2013-12-25",time:"13:00",date:date1}
             *
             * var date2=new Date(2013,11,25,23,45,00); //2013-12-25 23:45:00
             * getClosestTime(date2); //{date:"2013-12-26",time:"00:30",date:date2}
             */
            var _this = this;
            date = date || new Date();

            var iMinute = (date.getMinutes() + 30) / 60; //默认往后计算30分钟
            var hour = date.getHours() + Math.ceil(iMinute);
            var minute = ((iMinute * 10) % 10) > 5 ? 0 : 30;
            if (_this.offset) minute += parseInt(_this.offset) * 30;
            date.setHours(hour);
            date.setMinutes(minute);

            var hour = _this.padding(date.getHours()),
                minute = _this.padding(date.getMinutes());

            return {
                date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                time: hour + ":" + minute,
                hour: hour,
                minute: minute,
                datetime: date
            };
        },
        padding: function (n, m) {
            //补位
            var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
            return new Array(len + 1).join("0") + n;
        },
        onDateSelect: function (date, options) {
            var model = this.model;
            model.set("dateObj", {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                date: new Date(date.getTime())
            });
            model.set("date", M139.Date.format("yyyy-MM-dd", date));

            if (!options || !(options.silent == true)) {
                model.trigger("onselect"); //触发选择回调
            }
        },
        onTimeSelect: function (item, options) {
            var model = this.model;
            model.set("time", item);

            if (!options || !(options.silent == true)) {
                model.trigger("onselect"); //触发选择回调
            }
        },
        setType: function (options) {
            //是否全天时间,目前在用的options.fullday:false
            var _this = this;
            options = options || {};

            if ($.type(options.fullday) == 'boolean') {
                if (options.fullday == true) {
                    _this.timeContainer.hide();
                } else {
                    _this.timeContainer.show();
                }
                _this.model.set("fullday", options.fullday);
            }

            if ($.type(options.lunar) == 'boolean') {
                _this.model.set("lunar", options.lunar);//会转向触发change:date事件
            }
        },
        getData: function () {
            var model = this.model;
            var calTypes = this.configs.calendarTypes;
            var datestr = model.get("date"),
                dateObj = model.get("dateObj"),
                time = model.get("time"),
                lunar=model.get("lunarDate");
            var calendarType = model.get("lunar") ? calTypes.lunar : calTypes.calendar; //农历还是公历
            var sdatetime = datestr + " " + time.text + ":00";
            
            return {
                calendarType: calendarType, //int,20
                date: datestr,//string,2013-12-31
                time: time.text.replace(":", ""),//string,1030
                datetime: M139.Date.parse(sdatetime), //Date,之前的时间不对
                lunar: lunar, //object:{year:xxx,month:xxx,day:xxx}
                sdatetime: sdatetime //s表示string  2013-12-31 03:34:00
            };
        },
        showTip: function () {
            var _this = this;
            _this.tips.show();

            setTimeout(function () {
                _this.hideTip();
            }, 3000);
        },
        hideTip: function () {
            this.tips.hide();
        }
    }));
})(jQuery, _, M139, window._top || window.top);