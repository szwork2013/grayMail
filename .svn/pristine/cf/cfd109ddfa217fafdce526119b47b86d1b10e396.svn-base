(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Birthday', superClass.extend({
        messages:{
            DATE_NOT_ALLOW:"生日选择不能超过今天，请重新选择"
        },
        options: {
            from: "1910",   //起始年份
            to: new Date().getFullYear(),     //结束年份
            orderby: "asc",
            check:true      //检查日期是否超过今天
        },
        templete: ['<div id="year_{rnd}"></div>',
                    '<div id="month_{rnd}"></div>',
                    '<div id="day_{rnd}"></div>']
                    .join(""),
        /*
            日期选择控件,目前长度是固定的
            options={
                container:$("#div"),
                date:"2012-10-30", //默认日期，目前仅支持此格式
                from:1990, //最小的年份
                to:2012,  //最大的年份
                type:"asc", //年份排序，升序(asc)还是倒序(desc)
                check:true
            }
        */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.$el = options.container || $(document);
            /*
            if (options.date) { //如果有初始时间，则保存初始时间，在初始化之后设置
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
                var m = options.date.match(reg);
                if (m && m.length == 4) {
                    options = $.extend(options, {
                        year: parseInt(m[1], 10),
                        month: parseInt(m[2], 10),
                        day: parseInt(m[3], 10)
                    });

                    this.model.set({
                        year: options.year,
                        month: options.month,
                        day: options.day
                    });
                }
            }
            */
            this.setDate(options.date, false);
            this.options = $.extend(this.options, options); //保存
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var This = this;
            var model = This.model;

            var rnd = Math.random().toString().replace(".", "");
            var html = $T.Utils.format(This.templete, { "rnd": rnd }); //替换ID
            This.$el.append(html); //添加到页面中

            This.year = $("#year_" + rnd, This.$el);
            This.month = $("#month_" + rnd, This.$el);
            This.day = $("#day_" + rnd, This.$el);

            //创建年，月，日的3个下拉框
            This._createYearMenu(model.get("year"));
            This._createMonthMenu(model.get("month"));
            This._createDayMenu(model.get("day"));

            model.on("change:year", function () {
                var year = model.get("year");
                This._onYearChange(year);
            });
            model.on("change:month", function () {
                var month = model.get("month");
                This._onMonthChange(month);
            });

            //触发,设置默认日期。先触发日期，最后触发月份
            //以解决日期不正确的问题（2012-02-31最后会被设置并显示2012-02-29）
            this.model.trigger("change:day");
            this.model.trigger("change:year");
            this.model.trigger("change:month");
        },
        setDate: function (date,isSet) {
            if (!date) return;
            isSet = isSet || false;

            var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            var m = date.match(reg);
            if (m && m.length == 4) {
                var This = this;
                var options = {
                    year: parseInt(m[1], 10),
                    month: parseInt(m[2], 10),
                    day: parseInt(m[3], 10)
                };

                This.model.set(options);

                return;
                if (isSet) {
                    try{
                        This.yearMenu.setText(options.year);
                        This.monthMenu.setText(options.month);
                        This.dayMenu.setText(options.day);
                    }
                    catch (e) { }
                }
            }
        },
        _createYearMenu: function (defaultYear) {
            var This = this;
            var options = This.options;
            var yearObj = [];

            for (var i = options.from; i <= options.to; i++) {
                var obj = {
                    text: i,
                    value: i
                };
                yearObj.push(obj);
            }

            if (options.orderby && options.orderby.toLowerCase() == "desc") {
                yearObj = yearObj.sort(function (a, b) {
                    return b.value - a.value; //倒序
                });
            }

            defaultYear = defaultYear || "年";
            This.yearMenu = new M2012.UI.DropMenu.create({
                container: This.year,
                defaultText: defaultYear, //默认显示“年”字
                menuItems: yearObj,
                customClass: "setyearPop"
            });
            This.yearMenu.on("change", function (item) {
                This.model.set("year", item.value);
				This.trigger("ymdchange");
            });

            This.year.find(".dropDown").addClass("dropDown-year"); //加上年的class
        },
        _createMonthMenu: function (defaultMonth) {
            var This = this;
            var options = This.options;
            var monthObj = [];

            for (var i = 1; i <= 12; i++) {
                monthObj.push({
                    text: i,
                    value: i
                });
            }
            defaultMonth = defaultMonth || "月";
            This.monthMenu = new M2012.UI.DropMenu.create({
                container: This.month,
                defaultText: defaultMonth,
                menuItems: monthObj,
                customClass: "setmonthPop"
            });
            This.monthMenu.on("change", function (item) {
                This.model.set("month", item.value);
				This.trigger("ymdchange");
            });

            This.month.find(".dropDown").addClass("dropDown-month");
        },
        _createDayMenu: function (maxDay, defaultDay) {
            maxDay = maxDay || 31; //默认31天
            var This = this;
            var options = This.options;
            var dayObj = [];

            for (var i = 1; i <= maxDay; i++) {
                dayObj.push({
                    text: i,
                    value: i
                });
            }
            var defaultDay = defaultDay || "日";
            This.dayMenu = new M2012.UI.DropMenu.create({
                container: This.day,
                defaultText: defaultDay,
                menuItems: dayObj,
                customClass: "setdayPop"
            });
            This.dayMenu.on("change", function (item) {
                This.model.set("day", item.value);
				This.trigger("ymdchange");
            });

            This.day.find(".dropDown").addClass("dropDown-day");
        },
        _onYearChange: function (year) {
            var This = this;
            //This.model.set("year", year);
            This.yearMenu.setText(year);
            var month = This.model.get("month");
            if (month) { //未设置月份时，不修改
                This._onMonthChange(month); //触发月份选择，由月份去触发日期选择判断
            }
        },
        _onMonthChange: function (month) {
            var This = this;
            //This.model.set("month", month);
            This.monthMenu.setText(month);
            var date = "{year}-{month}-01 00:00:00"; //为了兼容M139.Date.parse(str)方法
            var dateObj = {
                "year": This.model.get("year") || 2000, //取2000年为闰年，2月有29天
                "month": month || 1                     //取1月，在未设置任何日期之前，日部分可选择31天
            };

            date = $T.Utils.format(date, dateObj); //格式化
            var datetime = $Date.parse(date); //转换
            var maxDay = $Date.getDaysOfMonth(datetime); //获取该月的最大天数，如闰年2月有29天
            var day = This.model.get("day");
            if (day) { //未设置日期时，不做修改
                day = maxDay >= day ? day : maxDay; //判断天数是否大于最大天数，取有效值
                This.model.set("day", day); //设置保存为该月最大的天数
            }
            This._createDayMenu(maxDay, day);
        },
        
        //个位数前辍 0 
        numFix: "0000000000".split('').concat(",,,,,,,,,,,,,,,,,,,,,".split(",")),

        toLongDate: function(year, month, day){
            var longDate = $T.format("{year}-{month}-{day}", {
                "year": year,
                "month": this.numFix[month] + month,
                "day": this.numFix[day] + day
            });
            return longDate;
        },

        /**
            公共方法，获取设置的日期
        */
        getDate: function () {
            //默认返回"年-月-日"格式
            var This = this;

            var model = This.model;
            var checkDate = This.options.check;
            var strDate = null;

            if (model.has("year") && model.has("month") && model.has("day")) { //判断值
                
                var year = model.get("year"),
                    month = model.get("month"),
                    day = model.get("day");

                if (checkDate) {
                    var userDate = new Date(year, month - 1, day);
                    if (userDate && userDate < new Date()) {
                        
                    } else {
                        top.$Msg.alert(this.messages.DATE_NOT_ALLOW);
                        return strDate;
                    }
                }

                strDate = This.toLongDate(year, month, day);
            }

            return strDate
        }
    })
    );

    $.extend(M2012.Settings.View.Birthday, {
        //*
        create: function (options) {
            if (options && options.container) {
                var datePicker = new M2012.Settings.View.Birthday(options);
                return datePicker;
            } else {
                throw "M2012.Settings.View.Birthday参数不合法:"
                        + JSON.stringify(options);
            }
        }
        //*/
    });
})(jQuery, _, M139);