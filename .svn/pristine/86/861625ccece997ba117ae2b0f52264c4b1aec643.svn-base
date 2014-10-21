/**
 * @fileOverview 定义星期选择控件
 */

//{
//    week: [
//        { index: 7, checked: true, text: "周日" },
//        { index: 1, checked: true, text: "周一" },
//        { index: 2, checked: true, text: "周二" },
//        { index: 3, checked: true, text: "周三" },
//        { index: 4, checked: true, text: "周四" },
//        { index: 5, checked: true, text: "周五" },
//        { index: 6, checked: true, text: "周六" }
//    ]
//}

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Weekday", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Weekday.prototype
      */
    {
        /** 星期几选择组件
        *@constructs M2012.UI.Picker.Weekday
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {jQueryDOM} option.container 如果是静态控件，指定一个父容器
        *@example
        */
        initialize: function (option) {
            option = option || {};

            var _this = this;
            _this.model = new Backbone.Model();
            _this.container = option.container || $("body");
            _this.setElement(_this.container);
            _this.event();

            _this.model.set({range: (option.value || _this._default)});

            //return superClass.prototype.initialize.apply(this, arguments);
        },

        name: "M2012.UI.Picker.Weekday",

        _default: [1,2,3,4,5,6,7],
        _idx: [7,1,2,3,4,5,6],
        _chs: "日一二三四五六".split(''),
        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        template: _.template([
                        '<ul class="sundaysel">',
                            '<% _.each(week, function(day) { %>',
                                '<li data-day="<%= day.index %>" class="<%= day.checked ? \'on\' : \'\' %>"><a href="javascript:void(0)"><%= day.text %></a></li>',
                            '<% }); %>',
                        '</ul>'].join('')),

        data: function(value, onsuccess) {
            var _this = this;
            var idx = _this._idx.concat(), chs = _this._chs.concat();

            while(idx.length){ chs.push({index:idx.shift(), checked: true, text: "周" + chs.shift()}) }

            $.each(chs, function(i,n){
                n.checked = ($.inArray(n.index, value) > -1)
            });

            return { "week": chs};
        },

        event: function() {
            var _this = this;
            var container = _this.container;
            var model = _this.model;

            model.bind("change:range", function(model, range){
                _this.render(_this.data(range));
            });

            model.on("rended", function(){
                container.find(".sundaysel li").click(function(e) {
                    var bar = $(e.currentTarget); //li
                    var day = bar.data("day");

                    var value = [].concat(model.get("range"));
                    var index = $.inArray(day, value);

                    if (index > -1) {
                        if (value.length == 1) {
                            return; //保留最后一个
                        }

                        value.splice(index, 1);
                    } else {
                        value.push(day);
                    }

                    value.sort();
                    _this.trigger("select", value);
                    model.set({range: value});
                });
            });
        },

        render: function(data) {
            var _this = this;
            _this.container.html(_this.template(data));
            _this.model.trigger("rended");
        },

        getSelection: function() {
            return this.model.get('range');
        }
    }
    ));


    M139.namespace("M2012.UI.Picker.Week", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Week.prototype
      */
    {
        /** 星期几选择组件
        *@constructs M2012.UI.Picker.Week
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {jQueryDOM} option.container 如果是静态控件，指定一个父容器
        *@example
        */
        initialize: function (option) {
            option = option || {};

            if (option.value) {
                option.value = $.map(option.value.split(','), function(i){ return Number(i) });
            }

            var _this = this;
            _this.value = option.value || _this._default;
            _this.container = option.container || $("body");
            _this.render();
            _this.event();

            return superClass.prototype.initialize.apply(this, arguments);
        },

        name: "M2012.UI.Picker.Week",

        _default: [1,2,3,4,5,6,7],

        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        template: [
                //'<div class="element">',
                    '<div id="disc"></div>',
                    '<div id="weekfield"></div>'
                //,'</div>'
                ].join(''),

        event: function() {
            var _this = this;
            var discField = _this.container.find("#disc");

            _this.weekdayPicker.on("select", function(value){
                _this.value = value;
                discField.text(_this._getWeekRange(value));
            })
        },

        render: function() {
            var _this = this;
            var container = _this.container;

            container.html(_this.template);

            var field = container.find("#weekfield");
            _this.weekdayPicker = new M2012.UI.Picker.Weekday({
                container: field,
                value: _this.value
            });

            var discription = _this._getWeekRange(_this.value);
            container.find("#disc").text(discription);
        },

        getSelection: function() {
            var _this = this;
            var value = _this.value;
            var discription = _this._getWeekRange(value);

            return { "value": value.join(','), "discription": discription };
        },

        /**
         * @inner 转化成可读的日期格式
         * @param {Array} week
         */
        _getWeekRange: function(week) {
        
            var weekStr = week.join('');
            var weekDay = this._weekmsg;
            var result = "1234567";

            if (weekStr == result) { //每天
                result = weekDay[0];

            //表示有三个连续星期几
            } else if (weekStr.length >= 3 && result.indexOf(weekStr) > -1) {
                result = weekDay[week[0]] + "至" + weekDay[week[week.length - 1]];

            } else {
                result = [];
                for (var i = 0; i < week.length; i++) {
                    var index = week[i];
                    result.push(weekDay[index]);
                }
                result = result.join("，");
            }

            return result;
        }
    }
    ));

})(jQuery, _, M139);