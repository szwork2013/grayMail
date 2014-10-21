/**
 * @fileOverview 定义输入自动提示组件
 */

(function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /***/
    M139.namespace("M2012.UI.Suggest.InputSuggest",superClass.extend(
    /**@lends M2012.UI.Suggest.InputSuggest.prototype */
    {
        /** 
        *输入自动提示组件
        *@constructs M2012.UI.Suggest.InputSuggest
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.textbox 捕获文本框
        *@param {Function} options.onInput 捕获输入，该函数返回一个数组，表示要提示的项
        *@param {Function} options.onSelect 选择了其中一项（回车、或者鼠标点选）
        *@param {String} options.template 容器(提示菜单)的html模板
        *@param {String} options.itemTemplate
        *@param {String} options.itemPath
        *@param {String} options.itemInsertPath
        *@param {String} options.itemContentPath
        *@param {String} options.itemFocusClass
        *@example
        */
        initialize:function(options){
            options = _.defaults(options,DefaultStyle);

            var div = document.createElement("div");
            div.innerHTML = this.options.template;
            this.setElement(div.firstChild);

            this.onSelect = options.onSelect || this.onSelect;
            this.onInput = options.onInput || this.onInput;
            this.textbox = options.textbox;
            this.initEvent();

            superClass.prototype.initialize.apply(this,arguments);
        },

        /**@inner*/
        initEvent:function(){
            var options = this.options;
            var This = this;
            var jTb = jQuery(options.textbox);


            jTb.bind("keydown", function (e) {
                This.onTextBoxKeyDown(e);
            }).bind("change", function (e) {
                setTimeout(function () {
                    if (jTb.val() == "") {
                        This.hide();
                    }
                },10);
            });

            //由原本的监听keyup改为定时监控输入值
            M139.Timing.watchInputChange(options.textbox, function (e) {
                This.onTextBoxChange(e);
            });
            


            if (M139.Browser.is.ie) {
                //拖滚动条的时候阻止文本框失焦点
                this.$el.mousedown(function (e) {
                    jTb.attr("mode", "edit");
                    jTb.focus();
                }).mousemove(function () {
                    jTb.focus();
                });
            }else{
                jTb.bind("blur", function (e) {
                    This.hide();
                });
                this.$el.mousedown(function (e) {
                    //禁用默认事件，可以在鼠标拉滚动条的时候菜单不消失(ie除外)
                    M139.Event.stopEvent(e);
                });
            }
            $(document).click(function (e) {
                // e.target代表输入框
                // This.el代表自动提示层
                if (e.target != This.el) {
                    This.hide();
                }

                // 快捷创建日历弹出窗口中,出现自动补全提示框后如果直接用鼠标移动弹出窗口,操作停止后,应该直接出发textbox的blur方法
                // 否则点击取消按钮的话,会认为触发的是blur方法,导致窗口无法关闭
                // 如果鼠标点击的不是"点击参与人"的input也不是"点击参与人"所属的最外层DIV,就触发blur事件,暂时先这么处理
                if(!$(e.target).hasClass("addrText-input") && !$(e.target).hasClass("ItemContainer") && !$(e.target).hasClass("PlaceHold")) {
                    options.textbox && options.textbox.blur();
                }
            });
        },

        /**选中第几项（高亮),鼠标经过或者键盘选择*/
        selectItem:function(index){
            var item = typeof index == "number" ? this.getItem(index) : index;
            var last = this.getSelectedItem();
            if (last != null) this.utilBlurItem(last);
            this.utilFocusItem(item);

            var ele = item[0];
            this.utilScrollToElement(this.el,ele); //如果选中的项被遮挡的话则滚动滚动条
        },

        /**
         *获得需要滚动的元素
         *@inner
         */
        getScrollElement:function(){
            return this.el;
        },

        /**根据下标获得项*/
        getItem:function(index){
            return this.$el.find(this.options.itemPath+"[index='"+index+"']").eq(0);
        },

        /**获得当前提示的所有项*/
        getItems:function(){
            return this.$el.find(this.options.itemPath);
        },
        
        /**获得当前选中项*/
        getSelectedItem:function(){
            var sel = this.$el.find(this.options.itemPath+"[i_selected='1']");
            if(sel.length){
                return sel.eq(0);
            }else{
                return null;
            }
        },

        /**获得当前选中下标*/
        getSelectedIndex:function(){
            var item = this.getSelectedItem();
            if(item){
                return item.attr("index") * 1;
            }else{
                return -1;
            }
        },

        /**@inner*/
        onItemSelect:function(item){

            this.hide();

            var value = $(item).attr("data-value");
            if(jQuery.isFunction(this.onSelect)){
                this.onSelect(value);
            }

            this.textbox.value = value;

            this.textbox.setAttribute("mode", "");


            this.trigger("select",{value:value});
        },


        /**
         *显示提示列表,每次show默认会清除之前的item
         *@param {Array} list 提示数据项[{text:"",title:""}]
         */
        show:function(list){
            if (this.isShow) return;
            if (this.el.parentNode != document.body) {
                document.body.appendChild(this.el);
                //document.body.appendChild(bgIframe);
            }

            var This = this;
            
            this.clear();
            
            var options = this.options;
            for(var i=0,len = list.length;i<len;i++){
                var data = list[i];
                var item = jQuery(options.itemTemplate);
                item.attr("index",i);
                item.attr("data-value",data.value);
                item.find(options.itemContentPath).html(data.text);
                item.appendTo(this.$el.find(options.itemInsertPath));
                item.mousedown(onItemClick);
                item.mouseover(onItemMouseOver);
            }
            
            function onItemClick(){
                This.onItemSelect(this);
            }
            function onItemMouseOver(){
                This.selectItem(this.getAttribute("index")*1);
            }

            var offset = $(this.textbox).offset();
            var top = offset.top + $(this.textbox).height();
            var height = list.length > 8 ? "300px" : "auto";
            
            //会话邮件写信页
            if(/conversationcompose/i.test(window.location.href)){
                height = list.length > 5 ? "125px" : "auto";
            }

            this.$el.css({
                width: Math.max(this.textbox.offsetWidth, 400) + "px",
                height: height,
                overflowY: "auto",
                top: top,
                left: offset.left
            });

            //设置最高的建议浮层高度
            if (options.maxItem && options.maxItem > 0) {
                var maxLen = options.maxItem;
                var itemHeight = 24; //单个24px
                this.$el.css({
                    height: list.length > maxLen ? (itemHeight * maxLen) + "px" : "auto"
                });
            }

            this.selectItem(0); //显示的时候选中第一项
            this.isShow = true;
            superClass.prototype.show.apply(this,arguments);
        },

        /**隐藏菜单*/
        hide:function(){
            if (!this.isShow) return;
            this.el.style.display = "none";
            //bgIframe.style.display = "none";
            this.clear();
            this.isShow = false;
        },


        /**
         *修改选中项外观
         *@inner
         */
        utilFocusItem:function(item){
            item.attr("i_selected",1);
            item.css({
                backgroundColor: "#e8e8e8",//选中时候背景颜色,淡蓝色5D99CE
                color : "#666" // 字体颜色
            });
            //item.find("span").css("color", "white");
            item.find("span").css("color", "#666");
        },

        /**
         *修改失去焦点项外观
         *@inner
         */
        utilBlurItem:function(item){
            item.attr("i_selected",0);
            item.css({
                backgroundColor : "",
                color : ""
            });
            item.find("span").css("color", "");
        },

        /**
         *如果选中的项被遮挡的话则滚动滚动条
         *@inner
         */
        utilScrollToElement:function(container,element){
            var elementView = {
                top: this.getSelectedIndex() * $(element).height()
            };
            elementView.bottom = elementView.top + element.offsetHeight
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        },

        /**清除所有提示项*/
        clear:function(){
            var op = this.options;
            if(op.itemInsertPath){
                this.$el.find(op.itemInsertPath).html("");
            }else if(op.itemPath){
                this.$el.find(op.itemPath).remove();
            }
        },

        /**
         *监听到文本框值变化时触发，同时触发oninput
         *@inner
         */
        onTextBoxChange: function (evt) {
            var keys = M139.Event.KEYCODE;
            switch (evt && evt.keyCode) {
                //case keys.ENTER:
                case keys.UP:
                case keys.DOWN:
                case keys.LEFT:
                case keys.RIGHT: return;
            }
            this.hide();
            var items = this.onInput(this.options.textbox.value);

            if (items && items.length > 0) {
                this.show(items);
            }
        },

        /**
         *文本框键盘按下触发
         *@inner
         */
        onTextBoxKeyDown:function(evt){
            var This = this;
            var keys = M139.Event.KEYCODE;
            evt = evt || event;
            switch (evt.keyCode) {
                case keys.SPACE:
                case keys.TAB:
                case keys.ENTER: doEnter(); break;
                case keys.UP: doUp(); break;
                case keys.DOWN: doDown(); break;
                case keys.RIGHT:
                case keys.LEFT: this.hide(); break;
                default: return;
            }
            function doEnter() {
                var item = This.getSelectedItem();
                if (item != null) This.onItemSelect(item);
                if (evt.keyCode == keys.ENTER) {
                    M139.Event.stopEvent(evt);
                }
            }
            function doUp() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    index--;
                    index = index < 0 ? index + This.getItems().length : index;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
            function doDown() {
                var index = This.getSelectedIndex();
                if (index >= 0) {
                    var len = This.getItems().length;
                    index = (index + 1) % len;
                    This.selectItem(index);
                }
                M139.Event.stopEvent(evt);
            }
        }
    }));

        var DefaultStyle = {
            template:['<div class="menuPop shadow" style="display:none;z-index:6024;padding:0;margin:0;">',
                '<ul></ul>',
        '</div>'].join(""),
        itemInsertPath:"ul",
        itemPath:"ul > li",
        itemTemplate:'<li style="width:100%;overflow:hidden;white-space:nowrap;"><a href="javascript:;"><span></span></a></li>',
        itemContentPath:"span:eq(0)"
    };
})(jQuery,Backbone,_,M139);