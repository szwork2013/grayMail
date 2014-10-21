/**
 * @fileOverview 定义通讯录富文本框的子项元素对象
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.RichInput.ItemView";
    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.RichInput.ItemView.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.RichInput.ItemView
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@example
         new M2012.UI.RichInput.ItemView({
             text:"lifula@139.com",
             richInput:richInput,
             itemId:richInput.getNextItemId(),
             errorMessage:"收件人格式不对"
         }).render();
         */
        initialize: function (options) {
            var $el = jQuery(options.template || this.template);

            this.setElement($el);

            var This = this;
            this.richInputBox = options.richInput;
            this.type = options.type;
            this.allText = options.text;

            if (this.type == "email" && /^\d+$/.test(this.allText)) {
                this.allText += "@139.com";
            }

            this.hashKey = this.addr = this.getAddr();
			this.account = $Email.getAccount(this.addr);
			this.domain = $Email.getDomain(this.addr);
            this.itemId = options.itemId;
            if (!this.addr) {
                this.error = true;
                this.errorMsg = options.errorMessage;
                this.$el.addClass(this.errorClass);
            }
            if(this.richInputBox.errorfun){
            	this.richInputBox.errorfun(this, this.allText);
            	if(this.error)this.$el.addClass(this.errorClass);
            }
            this.selected = false;

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        selectedClass: "addrSel",
        hoverClass: "addrHover",
        errorClass:"addrError",
		errorDomainClass:"addrDomainError",//给下面的div增加float:none;样式,兼容360,ie8,google浏览器(不然会有换行显示分号的问题)
        template: '<div style="margin-right:4px;cursor: default;max-width:99%;overflow:hidden;" class="addrBase" unselectable="on"><b></b><span style="float:none;"></span><span style="float:none;">;</span></div>',
        render: function () {
            var This = this;
            var title = this.error ? this.errorMsg : this.addr;
            var text = this.error ? this.allText : this.getName();

            //this.$el.text(text).attr("title", title).append("<span>;</span>");

            this.$el.attr("title", title);

            if (this.error) {
                this.$("b").text(this.allText);
            } else {
                if (this.allText.indexOf("<") > -1) {
                    this.$("b").text(text);
					if(this.type == 'email'){
						this.$("span:eq(0)").html("&lt" + this.account + "<span class='addrDomain'>@"+ this.domain + "</span>&gt");
					}else{
						this.$("span:eq(0)").text("<" + this.getAddr() + ">");
					}
                } else {
					if(this.type == 'email'){
						this.$("b").html(this.account + "<span class='addrDomain'>@" + this.domain + "</span>");
					}else{
						this.$("b").text(this.allText);
					}
                }
            }

            this.$el.attr("rel", this.itemId);


            this.initEvents();


            //设置最大宽度
            if ($B.is.ie && $B.getVersion() < 8) {
                var containerWdith = this.richInputBox.$el.width();
                setTimeout(function () {
                    var width = This.$el.width();
                    if (width > 200 && (width + 10) > containerWdith) {
                        This.$el.width(containerWdith - 10);
                    }
                }, 0);
            }


            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *初始化事件
         *@inner
         */
        initEvents:function(){

            this.$el.bind("click",$.proxy(this,"onClick"));
            this.$el.bind("mousedown",$.proxy(this,"onMouseDown"));
            this.$el.bind("dblclick",$.proxy(this,"onDblclick"));
            this.$el.bind("mouseenter", $.proxy(this, "onMouseEnter"));
            this.$el.bind("mouseleave", $.proxy(this, "onMouseLeave"));

            this.on("select",function(){
                this.$el.addClass(this.selectedClass);
                this.$el.removeClass(this.hoverClass);
            }).on("unselect",function(){
                this.$el.removeClass(this.selectedClass);
            }).on("errorDomain",function(){
				this.$el.attr("title", '该地址的域名可能不存在，请双击修改');
				this.$el.addClass(this.errorDomainClass);
			}).on("changeDomain",function(e){
				this.addr = this.addr.replace('@' + e.errorDomain,'@' + e.domain);
				this.allText = this.allText.replace('@' + e.errorDomain,'@' + e.domain);
				this.domain = e.domain;
				delete this.richInputBox.hashMap[this.hashKey];
				this.hashKey = this.addr;
				this.richInputBox.hashMap[this.hashKey] = this;
				this.$el.removeClass(this.errorDomainClass);
				this.$el.attr("title",this.addr);
				this.$el.find("span.addrDomain").html('@' + e.domain);
			});
        },
        /**
         *@inner
         */
        getAddr:function(){
            var addr = this.richInputBox.contactsModel.getAddr(this.allText, this.type);
            if (this.type == "email") {
                var domain = this.options.limitMailDomain;
                if (domain && $Email.getDomain(addr) !== domain) {
                    addr = "";
                }
            }
            return addr;
        },
        /**
         *@inner
         */
        getName:function(){
            var name = this.richInputBox.contactsModel.getName(this.allText,this.type);
            return name; 
        },

        /**
         *选中该成员
         */
        select: function() {
            var element = this.element;
            richInputBox = this.richInputBox;
            this.selected = true;
            //todo remove to parentview
            if ($.browser.msie) { 
                var jTextBox = richInputBox.jTextBox;
                //鼠标划选的时候多次触发 有性能问题，所以延迟
                M2012.UI.RichInput.Tool.delay("ItemFocus", function() {
                    richInputBox.focus();
                });
            } else if ($.browser.opera) {
                var scrollTop = richInputBox.container.parentNode.scrollTop;
                richInputBox.textbox.focus();
                richInputBox.container.parentNode.scrollTop = scrollTop;
            } else {
                richInputBox.focus();
            }
            this.trigger("select");
        },
        /**
         *取消选中状态
         */
        unselect: function() {
            this.selected = false;
            this.trigger("unselect");
        },
        /**
         *移除元素
         */
        remove: function() {
            //todo
            this.richInputBox.disposeItemData(this);
            return superClass.prototype.remove.apply(this,arguments);
        },

        /**
         *鼠标移入
         *@inner
         */
        onMouseEnter: function () {
            if (!this.$el.hasClass(this.selectedClass)) {
                this.$el.addClass(this.hoverClass);
            }
        },

        /**
         *鼠标移出
         *@inner
         */
        onMouseLeave: function () {
            this.$el.removeClass(this.hoverClass);
        },

        /**
         *双击执行编辑
         *@inner
         */
        onDblclick: function (e) {
            this.richInputBox.editItem(this);
        },
        /**
         *鼠标按下
         *@inner
         */
        onMouseDown: function(e) {
            var current = this.richInputBox;
            if (!e.shiftKey && !e.ctrlKey) {
                //todo move to parentview
                if (!this.selected) {
                    var selectItems = current.getSelectedItems();
                    for (var i = 0; i < selectItems.length; i++) {
                        selectItems[i].unselect();
                    }
                }
                this.select();
            }
            //$Event.stopEvent();
        },
        /**
         *鼠标点击
         *@inner
         */
        onClick: function(e) {
            this.el.focus();
            var current = this.richInputBox;
            if (!e.shiftKey && !e.ctrlKey) {
                current.unselectAllItems();
                this.select();
            } else if (e.shiftKey) {
                shiftSelectItem(this);
            } else if (e.ctrlKey) {
                this.selected ? this.unselect() : this.select();
            }
            current.lastClickItem = this;

            //按住shift选中
            function shiftSelectItem(item) {
                if (!current.lastClickItem || current.lastClickItem == item) return;
                var items = current.getItems();
                var a = $.inArray(current.lastClickItem, items);
                var b = $.inArray(item, items);
                var min = Math.min(a, b);
                var max = Math.max(a, b);
                $(items).each(function(index) {
                    if (index >= min && index <= max) {
                        this.select();
                    } else {
                        this.unselect();
                    }
                });
            }
        }
    }));
})(jQuery, _, M139);