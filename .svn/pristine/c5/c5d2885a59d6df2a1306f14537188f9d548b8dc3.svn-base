/**
 * @fileOverview 定义范围选择组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Range", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Range.prototype
      */
    {
        /** 范围选择组件
        *@constructs M2012.UI.Picker.Range
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Boolean} options.isArea 是否选择范围（有2个游标）
        *@param {Number} options.minArea 当选择的是范围的时候，最小间隔是多少
        *@param {Number} options.width 标尺的宽度（默认是210）
        *@param {Array} options.items 步值
        *@param {Number} options.index 初始化下标
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@example
        var range1 = new M2012.UI.Picker.Range({
            container:document.getElementById("divContainer"),
            items:[{
                text:"不清理",
                value:0
            },{
                text:"7天",
                value:7
            },{
                text:"15天",
                value:15
            },
            {
                text:"30天",
                value:30
            }]
        });
        */
        initialize: function (options) {
            options = options || {};

            this.isArea = options.isArea;
            this.minArea = options.minArea || this.minArea;
            if(options.width){
                this.TotalWidth = options.width;
                
            }
            this.items = this.options.items;
            this.Step = Math.floor(this.TotalWidth / (options.items.length - 1));
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.Range",

        TotalWidth: 206,
        //Step: 12,
        minArea: 1,

        events:{
            "click": "onRulerClick" //点击标尺
        },

        template:['<div class="set-drop">',
            /*
            '<div style="left:68px;" class="sd-l"></div>',
            '<div style="left:136px;" class="sd-l"></div>',
            */
            '<div style="left:0px" class="sd-tag StartFlag"></div>',
            '<div style="left:136px" class="sd-tag EndFlag"></div>',
            /*
            '<span class="sd-text a1">不清理</span>',
            '<span class="sd-text a21">7天</span>',
            '<span class="sd-text a22">15天</span>',
            '<span class="sd-text a3">30天</span>',
            */
        '</div>'].join(""),

        /**
         *得到刻度的html
         *@inner
         */
        getTickHTML:function(){
            var htmlCode = "";
            var count = this.options.items.length - 2;
            for(var i=1;i<=count;i++){
                var left = this.Step * i;
                htmlCode += '<div style="left:' + left +'px;" class="sd-l"></div>';
            }
            return htmlCode;
        },

        getLabelHTML:function(){
            var items = this.options.items;
            var htmlCode = '<span class="sd-text a1">' + items[0].text +'</span>';
            var count = items.length;
            for(var i=1;i<count-1;i++){
                var item = items[i];
                var left = this.Step * i;
                htmlCode += '<span class="sd-text" style="left:' + left +'px">' + items[i].text +'</span>';
            }

            htmlCode += '<span class="sd-text a3">' + items[items.length-1].text +'</span>';
            return htmlCode;
            /*
            '<span class="sd-text a1">不清理</span>',
            '<span class="sd-text a21">7天</span>',
            '<span class="sd-text a22">15天</span>',
            '<span class="sd-text a3">30天</span>',
            */
        },

        /**构建dom函数*/
        render: function () {
            var This = this;

            /**
            *左边的游标
            *@field
            *@type {jQuery}
            */
            this.startFlag = this.$(".StartFlag");

            /**
            *右边的游标
            *@field
            *@type {jQuery}
            */
            this.endFlag = this.$(".EndFlag");

            //中间的选择区域元素
            this.selectAreaElement = this.$(".xxx");

            this.on("print", function () {
                $(this.getTickHTML()).prependTo(this.el);
                $(this.getLabelHTML()).appendTo(this.el);
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
                this.setStartValue(this.getIndexByValue(initValue.start));
                this.setEndValue(this.getIndexByValue(initValue.end));
            } else {
                this.setStartValue(this.getIndexByValue(initValue));
            }
        },


        getIndexByValue:function(value){
            var items = this.items;
            for(var i=0;i<items.length;i++){
                var item = items[i];
                if(item.value == value){
                    return i;
                }
            }
            return -1;
        },

        /**设置开始游标的值*/
        setStartValue: function (value) {
            value = value > 0 ? value : 0;

            this.startFlag.css("left", value * this.Step + "px");

            this.onSelect(this.items[value].value,value);
        },
        /**设置结束游标的值*/
        setEndValue: function (value) {
            this.endFlag.css("left", value * this.Step + "px");

            this.onSelect(this.items[value].value,value);
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

        /**获取最终选取的值
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