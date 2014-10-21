﻿/**
 * @fileOverview 定义选择器组件（包括选择时间、日历等）
 */
 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.Picker.PickerBase",superClass.extend(
 /**
  *@lends M2012.UI.Picker.PickerBase.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.Picker.PickerBase
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {HTMLElement} options.container 可选参数，容器，表示该控件是静止的
    *@param {HTMLElement} options.bindInput 可选参数，挂载的文本框
    *@example
    */
    initialize: function (options) {
        options = options || {};
        var $el = jQuery(options.template||this.template);
        this.setElement($el);

        //绑定文本框获得焦点事件
        this.bindHostEvent();

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.Picker.PickerBase",

    render:function(){
        //使render只执行一次
        this.render = function(){
            return this;
        }
        this.$el.appendTo(this.options.container || document.body);
        
        return superClass.prototype.render.apply(this, arguments);
    },

    /**
     *@param {Object} options 参数集
     *@param {HTMLElement} options.dockElement 可选参数，根据什么元素定位（缺省是以文本框定位）
     *@param {Number} options.top 可选参数定位坐标
     *@param {Number} options.left 可选参数定位坐标
     */
    show:function(options){
        options = options || {};
        var dockElement = options.dockElement || this.options.bindInput;

        if(dockElement){
            var param= {
                margin:10
            };
            if(options.dx){param.dx=options.dx;param.dy=options.dy;}
            M139.Dom.dockElement(dockElement, this.el,param);
        }else if(options.x && options.y){
            this.$el.css({
                top:options.y,
                left:options.x
            });
        }
        this.$el.css("z-index","9999");
        return superClass.prototype.show.apply(this, arguments);
    },

    hide:function(){
        M2012.UI.PopMenu.unBindAutoHide({
            action:"click",
            element:this.el
        });
        return superClass.prototype.hide.apply(this, arguments);
    },

    /**
     *绑定文本框获得焦点后显示控件
     *@inner
     */
    bindHostEvent:function(){
        if(!this.options.bindInput){
            return;
        }
        var This = this;

        this.$el.click(function (e) {
            M139.Event.stopEvent(e);
        });

        $(this.options.bindInput).click(function(){
            This.render().show(This.options);

            M2012.UI.PopMenu.bindAutoHide({
                action:"click",
                element:This.el,
                stopEvent:true,
                callback:function(){
                    This.hide();
                }
            });
        });
    },

    /**子类中调用，当选择值发生变化后，主动调用onSelect，会触发select事件*/
    onSelect:function(value,index){
        if(value === undefined){
            if(this.getValue){
                value = this.getValue();
            }else if(this.getSelectedValue){
                value = this.getSelectedValue();
            }
        }
        /**选择值发生变更的时候触发
        * @name M2012.UI.Picker.PickerBase#select
        * @event
        * @param {Object} e 事件参数
        * @example
        picker.on("select",function(e){
            e.value
        });
        */
        this.trigger("select",{value:value,index:index});
    }
}
));


})(jQuery,_,M139);