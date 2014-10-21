/**
 * @fileOverview 定义时间选择范围组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.TimeRange", superClass.extend(
     /**
      *@lends M2012.UI.Picker.TimeRange.prototype
      */
    {
        /** 范围选择组件
        *@constructs M2012.UI.Picker.TimeRange
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Boolean} options.isArea 是只选择一个时间，还是选择一个时间区域
        *@param {Number} options.minArea 最小时间间隔（默认是1小时）
        *@param {Boolean} options.showMinutes 是否支持选分钟
        *@param {Object} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@example

        //绑定文本框，选择范围
        var timeRange = new M2012.UI.Picker.TimeRange({
            bindInput:document.getElementById("myInput"),
            isArea:true,
            value:{
                start:1,
                end:10
            }
        });

        //静态显示的控件
        var time2 = new M2012.UI.Picker.TimeRange({
            container:document.getElementById("divContainer"),
            value:10
        }).render();
        */
        initialize: function (options) {
            options = options || {};

            this.isArea = options.isArea;
            this.minArea = options.minArea || this.minArea;

            this.showMinutes = options.showMinutes;

            //选分钟 1像素=5分钟
            if(options.showMinutes){
                this.Step = 1;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.TimeRange",

        TotalWidth: 288,
        Step: 12,
        minArea: 1,

        events:{
            "click": "onRulerClick" //点击标尺
        },

        template:['<div style="position: absolute;background:white"><div class="tControl" style="width:287px;">	',
 	    '<ul class="tC-ul">',
 		    '<li style="left:0;"></li>',
 		    '<li style="left:24px;"></li>',
 		    '<li style="left:48px;"></li>',
 		    '<li style="left:72px;"></li>',
 		    '<li style="left:94px;"></li>',
 		    '<li style="left:120px;"></li>	',
 		    '<li style="left:144px;"></li>	',
 		    '<li style="left:168px;"></li>	',
 		    '<li style="left:192px;"></li>	',
 		    '<li style="left:216px;"></li>	',
 		    '<li style="left:240px;"></li>	',
 		    '<li style="left:264px;"></li>	',
 	    '</ul>',
 	    '<div class="tC-h">',
 	    '</div>',
 	    '<div class="tC-l"></div>',
 	    '<div class="tC-r"></div>',
 	    '<div class="tC-num" style="left:25px;margin-left:7px">',
                     '<em class="a1">15:00</em>',
                     '<span></span>',
          '</div>',
 	     '<div class="tC-width" style="width:50px;left:48px;margin-left:-7px"></div>',
 	     '<div class="tC-num" style="left:80px;margin-left:7px">',
                     '<em class="a2">15:00</em>',
                     '<span></span>',
          '</div>',
 	     '<div class="tc-text">',
 		    '<span class="a3">24:00</span><span class="a1">0:00</span><span class="a2">12:00</span>',
 	     '</div>',
      '</div></div>'].join(""),

        /**构建dom函数*/
        render: function () {
            var This = this;

            /**
            *左边的游标
            *@field
            *@type {jQuery}
            */
            this.startFlag = this.$(".tC-num:eq(0)");

            /**
            *右边的游标
            *@field
            *@type {jQuery}
            */
            this.endFlag = this.$(".tC-num:eq(1)");

            //中间的选择区域元素
            this.selectAreaElement = this.$(".tC-width");

            this.on("print", function () {
                this.initEvent();
            });

            return superClass.prototype.render.apply(this, arguments);
        },

        /**@inner*/
        initEvent: function () {
            var This = this;

            M139.Dom.setDragAble(this.startFlag[0], {
                lockY: 1,
                onDragMove: function () {
                    var startLeft = parseInt(This.startFlag.css("left"));
                    if (startLeft > This.TotalWidth) {
                        This.startFlag.css("left",This.TotalWidth);
                    }


                    if(This.isArea){
                        //结束时间不能与开始时间重叠
                        var endLeft = parseInt(This.endFlag.css("left"));
                        if(startLeft > endLeft - This.minArea * This.Step){
                            This.setStartValue(This.getEndValue() - 1);
                        }
                    }

                    This.setStartValue(This.getStartValue());
                },
                onDragEnd: function () {
                    This.setStartValue(This.getStartValue());
                }
            });

            if (this.isArea) {
                M139.Dom.setDragAble(this.endFlag[0], {
                    lockY: 1,
                    onDragMove: function () {
                        var endLeft = parseInt(This.endFlag.css("left"));
                        var startLeft = parseInt(This.startFlag.css("left"));
                        var minLeft = startLeft + (This.minArea * This.Step);

                        if (endLeft > This.TotalWidth) {
                            This.setEndValue(24);
                        } else if (endLeft < minLeft) {
                            //结束时间不能与开始时间重叠
                            This.setEndValue(This.getStartValue() + This.minArea);
                        }
                        This.setEndValue(This.getEndValue());
                    },
                    onDragEnd: function () {
                        This.setEndValue(This.getEndValue());
                    }
                });
            } else {
                this.startFlag.find(".a1").removeClass("a1");
                this.endFlag.hide();
                this.selectAreaElement.hide();
            }

            this.initValue();
        },

        /**@inner*/
        initValue: function () {
            var initValue = this.options.value;
            if (this.isArea) {
                this.setStartValue(initValue.start);
                this.setEndValue(initValue.end);
            } else {

                this.setStartValue();
            }
        },

        /**@inner*/
        updateArea:function(){
            //修改“范围”元素的宽度、坐标
            this.selectAreaElement.css({
                left: parseInt(this.startFlag.css("left")) + 20,
                width: (this.getEndValue() - this.getStartValue()) * this.Step + "px"
            });
        },

        /**@inner*/
        updateStartValueText: function (value) {
            if(this.showMinutes){
                //1像素=5分钟
                var text = Math.floor(value / 12) + ":" + (value % 12) * 5;
                //补0
                text = text.replace(/^(\d{1}):/,"0$1:").replace(/:(\d{1})$/,":0$1");
            }else{
                var text = value + ":00"
            }
            this.startFlag.find("em").text(text);
            this.updateArea();
        },
        /**@inner*/
        updateEndValueText: function (text) {
            this.endFlag.find("em").text(text + ":00");
            this.updateArea();
        },

        /**设置开始游标的值*/
        setStartValue: function (value) {
            value = value || 0;
            this.startFlag.css("left", value * this.Step + "px");
            this.updateStartValueText(value);

            this.onSelect();
        },
        /**设置结束游标的值*/
        setEndValue: function (value) {
            this.endFlag.css("left", value * this.Step + "px");
            this.updateEndValueText(value);

            this.onSelect();
        },

        /**
         *@inner
         *根据偏移的像素获得选取值
         */
        utilGetValueByPx: function (left) {
            var v = parseInt(left);
            v = Math.round(v / this.Step);
            return v;
        },

        /**获取开始游标的值
         *@returns {Number}
         */
        getStartValue: function () {
            var left = this.startFlag.css("left");
            var value = this.utilGetValueByPx(left);
            return value;
        },

        /**获取结束游标的值
         *@returns {Number}
         */
        getEndValue: function () {
            return this.utilGetValueByPx(this.endFlag.css("left"));
        },

        /**
         *@inner
         获取当前选取的值
         */
        getSelectedValue: function () {
            if (this.isArea) {
                var value = {
                    start: this.getStartValue(),
                    end: this.getEndValue()
                };
            } else {
                var value = this.getStartValue();
            }

            return value;
        },

        /**
         *获取最终选取的值
         */
        getValue:function(){
            var value = this.getSelectedValue();
            if(this.showMinutes){
                var h = Math.floor(value / 12);
                var m = (value % 12) * 5;
                var time = new Date();
                time.setMinutes(m);
                time.setHours(h);
                return time;
            }else{
                return value;
            }
        },

        /**
         *实现点击标尺后游标自动选过去
         *@inner*/
        onRulerClick:function(e){
            var x = e.pageX - this.$el.offset().left;
            var value = Math.max(0,x - 10);
            value = Math.min(value,this.TotalWidth);
            value = this.utilGetValueByPx(value);
            if(this.isArea){
                var sel = this.getSelectedValue();
                if(value <= sel.start){
                    this.setStartValue(value);
                }else if(value >= sel.end){
                    this.setEndValue(value);
                }else if(value - sel.start > sel.end - value){
                    this.setEndValue(value);
                }else{
                    this.setStartValue(value);
                }
            }else{
                this.setStartValue(value);
            }
        }
    }
    ));


})(jQuery, _, M139);