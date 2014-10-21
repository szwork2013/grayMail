/**
 * @fileOverview 定义日历控件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Calendar", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Calendar.prototype
      */
    {
        /** 日历选择组件
        *@constructs M2012.UI.Picker.Calendar
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@param {Boolean} options.stopPassDate 是否禁选过去时间，默认是false
        *@example
        */
        initialize: function (options) {
            options = options || {};

            this.stopPassDate = options.stopPassDate;

            if (options.value) {
                if (this.stopPassDate) {
                    var now = new Date;
                    this.value = now > options.value ? now : options.value;
                } else {
                    this.value = options.value;
                }
            } else {
                this.value = new Date;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.Calendar",
        template:['<div class="dayControl" style="position:absolute;z-index:9999;background-color:white">',
             '<div class="dayControlTitle">',
                 '<a href="javascript:;" class="upYear UpMonth"></a>',
                 '<a href="javascript:;" class="upMonth UpYear"></a>',
                 '<span class="MonthLabel"></span>',
                 '<a href="javascript:;" class="downYear DownYear"></a>',
                 '<a href="javascript:;" class="downMonth DownMonth"></a>',
             '</div>',
             '<div class="dayControlNo"></div>',
             '<table>',
                 '<thead>',
                 '<tr>',
                     '<th>日</th>',
                     '<th>一</th>',
                     '<th>二</th>',
                     '<th>三</th>',
                     '<th>四</th>',
                     '<th>五</th>',
                     '<th>六</th>',
                 '</tr>',
                 '</thead>',
                 '<tbody>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),
        events:{
            "click a.UpYear": "onPrevYearClick",
            "click a.DownYear":"onNextYearClick",
            "click a.UpMonth":"onPrevMonthClick",
            "click a.DownMonth":"onNextMonthClick",
            "click td":"onDateClick"
        },
        render:function(){
            this.updateContent(this.value);
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *@inner
         */
        onPrevYearClick: function () {
            if (this.stopPassDate) {
                var prevYear = new Date(this.curValue);
                prevYear.setFullYear(prevYear.getFullYear() - 1);
                if (this.compareMonth(new Date,prevYear) > 0) {
                    return;
                }
            }
            this.curValue.setFullYear(this.curValue.getFullYear() - 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextYearClick:function(){
            this.curValue.setFullYear(this.curValue.getFullYear() + 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onPrevMonthClick: function () {
            if (this.stopPassDate && this.isCurrentMonth(this.curValue)) {
                //禁选过去月
                return;
            }

            this.curValue.setDate(0);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextMonthClick:function(){
            this.curValue.setDate(32);
            this.updateContent(this.curValue);
        },

        /**
         *日期变更后刷新html
         *@inner
         */
        updateContent: function (date) {
            this.$("tbody").html(this.getCalendarHTML(date));
            this.$(".MonthLabel").text(date.format("yyyy-MM"));
            this.curValue = new Date(date);
            this.focusSelectedCell(date);
        },


        /**
         *让选中的日期单元格高亮
         *@inner
         */
        focusSelectedCell:function(){
            this.$("td.on").removeClass("on");
            var date = this.value.getDate();
            this.$("td[rel='" + date + "']").addClass("on");
        },

        /**@inner*/
        onDateClick:function(e){
            var td = e.target;
            var date = td.innerHTML;
            
            if(/\d+/.test(date)){
                var selDate = new Date(this.curValue);
                selDate.setDate(date);

                if (this.stopPassDate) {
                    var now = new Date();
                    if (!M139.Date.isSameDay(now, selDate) && now > selDate) {
                        return;
                    }
                }

                this.value = selDate;
                this.focusSelectedCell();
                this.onSelect(selDate);
                this.hide();
            }
        },

        //是否过去的月份
        compareMonth:function(date1,date2){
            if (date1.getFullYear() > date2.getFullYear()) {
                return 1;
            } else if (date1.getFullYear() < date2.getFullYear()) {
                return -1;
            } else {
                return date1.getMonth() - date2.getMonth();
            }
        },

        //是否本月
        isCurrentMonth: function (date) {
            var now = new Date();
            return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
        },

        /**根据日期获得日期区域的html内容*/
        getCalendarHTML:function(date){
            var days = M139.Date.getDaysOfMonth(date);
            var firstMonthDay = M139.Date.getFirstWeekDayOfMonth(date);
            var htmlCode = [];
            var cellsCount = days + firstMonthDay ;

            //是否禁选过去时间
            var stopPassDate = this.stopPassDate;
            var passMonth = this.compareMonth(new Date(),date);
            var today = new Date().getDate();

            htmlCode.push("<tr>");
 
            for(var i=1,j=1;i<=cellsCount;i++,j++){
                if(i>firstMonthDay && j<=days){
                    htmlCode.push("<td rel='" + j + "' " + getColor(j) + ">" + j + "</td>");
                }else{
                    htmlCode.push("<td></td>");
                    j--;
                }
                if(i%7 == 0 || i==cellsCount){
                    htmlCode.push("</tr>");
                }
            }
            function getColor(date) {
                if (!stopPassDate) return "";
                var disableColor = 'style="color:silver;"';
                if (passMonth > 0) {
                    return disableColor;
                } else if (passMonth < 0) {
                    return "";
                }else{
                    return date < today ? disableColor : "";
                }
            }
            return htmlCode.join("");
        }
    }
    ));

    jQuery.extend(M2012.UI.Picker.Calendar , {
        create : function(options){
            var calendar = new M2012.UI.Picker.Calendar(options);
            return calendar;
        }
    });

})(jQuery, _, M139);