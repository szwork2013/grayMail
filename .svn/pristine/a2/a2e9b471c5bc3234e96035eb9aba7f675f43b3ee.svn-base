/**
 * @fileOverview 定义通讯录地址本组件代码
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.RichInput.View";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.RichInput.View.prototype*/
    {
        /** 定义通讯录地址本组件代码
         *@constructs M2012.UI.RichInput.View
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {HTMLElement} options.container 组件的容器
         *@param {Number|Function} options.maxSend 最大接收人个数，默认为50
         *@param {Number} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
         *@param {String} options.limitMailDomain 限定输入的邮件域
         *@param {String} options.validateMsg 非法输入值的提示语
         *@example
         var richinputView = new M2012.UI.RichInput.View({
             container:document.getElementById("addrContainer"),
             type:"email",
             maxSend:200,
             sendIsUpTo:195
         }).render();
         */
        initialize: function (options) {

            M2012.UI.RichInput.instances.push(this);
            this.id = M2012.UI.RichInput.instances.length;
            
            M2012.UI.RichInput.DocumentView.create();

            // 控制接收人提示层的位置，默认是在接收人输入框的上方top，可以设置为下方bottom
            this.tipPlace = options.tipPlace || "top";
            var div = document.createElement("div");
            var templateData = {
                offset: "-28px",
                arrow: "tipsBottom",
                zIndex: parseInt(options.zIndex) || 3
            };
            if (this.tipPlace == "bottom") { // 提示层在接收人输入框的底部
                templateData = {
                    offset: "29px",
                    arrow: "tipsTop",
                    zIndex: parseInt(options.zIndex) || 3
                }
            }
            div.innerHTML = $T.format(this.template, templateData);
            if (options.hideBorder) {  //隐藏边框
                $(div).find('div.ItemContainer').css('border', 'none');
            }
            if (options.heightLime) {
                $(div).children().css({ 'overflow-y': 'auto', 'max-height': options.heightLime + 'px', '_height': 'expression(this.scrollHeight > 50 ? "' + options.heightLime + 'px" : "auto")' });
            }
            var el = div.firstChild;

            this.type = options.type;
            this.contactsModel = M2012.Contacts.getModel();

            this.model = new Backbone.Model();
             //ad wx产品运营中要扩展的方法
            this.change = options.change || function () {}; 
            this.errorfun = options.errorfun || null;
            
            this.setElement(el);
            this.jTextBox = this.$("input");
            this.textbox = this.jTextBox[0];
            this.textboxView = new M2012.UI.RichInput.TextBoxView({
                richInput:this,
                element:this.$("div.addrText")
            });
            //向下兼容
            this.jContainer = this.$el;
            this.container = this.el;

            this.jItemContainer = this.$(this.itemContainerPath);

            this.jAddrTipsContainer = this.$(this.addrTipsPath);
            
            this.jAddrDomainTipsContainer = this.$(this.addrDomainTipsPath);


            this.items = {};
            this.hashMap = {};
            var maxSend = options.maxSend || 50;
            if (!jQuery.isFunction(maxSend)) {
                maxSend = new Function("", "return " + maxSend);
            }
            this.maxSend = maxSend;
            this.sendIsUpTo = function () {
                return options.sendIsUpTo || (this.maxSend() - 5);
            };
            this.tool = M2012.UI.RichInput.Tool;



            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        template: ['<div class="p_relative RichInputBox writeTable" style="z-index:{zIndex};">',
             '<div class="tips write-tips EmptyTips" style="left:0;top:{offset};display:none;">',
                 '<div class="tips-text EmptyTipsContent">',
                     //'请填写收件人',
                 '</div>',
                 '<div class="{arrow} diamond"></div>',
             '</div>',
             '<div class="ItemContainer writeTable-txt clearfix" unselectable="on" style="cursor: text;overflow-x:hidden">',
                 '<div class="PlaceHold" style="position:absolute;color: silver;display:none;left:3px;"></div>',
                 '<div class="addrText" style="margin-top: -3px;">',
                     '<input type="text" style="width:100%" class="addrText-input">',
                 '</div>',
             '</div>',
             '<div class="addnum" style="display:none"></div>',
             '<div class="pt_5 addrDomainCorrection" style="display:none"></div>',
         '</div>'].join(""),
        itemPath: ".addrBase",
        itemClass:"addrBase",
        itemContainerPath:"div.ItemContainer",
        addrTipsPath:"div.addnum",
        addrDomainTipsPath:"div.addrDomainCorrection",
        /**构建dom函数*/
        render: function () {

            var options = this.options;

            this.initEvent();

            //this.$el.appendTo(options.container);
            var container = $D.getHTMLElement(options.container);
            container.innerHTML = "";
            container.appendChild(this.el);
            
            M2012.UI.RichInput.Tool.unselectable(this.el.parentNode);
            M2012.UI.RichInput.Tool.unselectable(this.el);
            M2012.UI.RichInput.Tool.unselectable(this.el.firstChild);

            if (this.options.placeHolder) {
                this.setTipText(this.options.placeHolder);
            }

            //插件
            var plugins = options.plugins;
            for(var i=0;i<plugins.length;i++){
                new plugins[i](this);
            }

            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *初始化事件
         *@inner
         */
        initEvent: function () {
            var This = this;
           this.$el.keydown($.proxy(this,"onKeyDown"))
                .click($.proxy(this,"onClick"));
           this.$el.mousedown($.proxy(this, "onMouseDown"));
               
            this.model.on("change:placeHolder", function () {
                This.switchTipText();
            });

            this.$("div.PlaceHold").click(function () {
                This.textbox.select();
                This.textbox.focus();
                //return false;
            });

            this.textboxView.on("input", function () {
                This.switchTipText();
            });

            this.on("itemchange", function () {
                This.switchTipText();
            });

            this.jTextBox.keydown(function (e) {
                This.trigger("keydown", e);
            }).blur(function (e) {
                This.trigger("blur", e);
            });
        },

        /**
         *提示没有收件人
         *@param {String} msg 可选参数，默认是：请填写收件人
         */
        showEmptyTips:function(msg){
            msg = msg || "请填写收件人";
            var tips = this.$("div.EmptyTips");
            tips/*.css({
                left:"0",
                top:"-28px"
            })*/
            .show().find("div.EmptyTipsContent").text(msg);
            setTimeout(function(){
                tips.hide();
            }, 3000);
            M139.Dom.flashElement(this.el);
        },

        /**
         *提示接收人格式非法
         *@param {String} msg 可选参数，默认是：接收人输入错误
         */
        showErrorTips:function(msg){
            var item = this.getErrorItem();
            if(!item)return;

            msg = msg || "接收人输入错误";
            var tips = this.$("div.EmptyTips");
            tips.show().find("div.EmptyTipsContent").text(msg);

            var itemOffset = item.$el.offset();
            var richinputOffset = this.$el.offset();
            tips.css({
                left: itemOffset.left - richinputOffset.left + parseInt(item.$el.width()/2) - 16,
                top:itemOffset.top - richinputOffset.top + (this.tipPlace == "bottom" ? 25 : -32)
            });
            setTimeout(function(){
                tips.hide();
            },3000);
        },

        /**
         *获得输入的项
         *@inner
         *@returns {Array} 返回输入的dom,[dom,dom,dom]
         */
        getItems: function () {
            var result = [];
            var This = this;
            this.$(this.itemPath).each(function () {
                var itemId = this.getAttribute("rel");
                var item = This.items[itemId];
                if (item) result.push(item);
            });
            return result;
        },
        
        /** 得到收件人输入项 */
        getToInstancesItems: function(){
            var instances = M2012.UI.RichInput.instances;
            return instances[0].getValidationItems().distinct();
        },
                
        /**
         *todo 得到所有实例的输入项
         */
        getAllInstancesItems: function(){
            var instances = M2012.UI.RichInput.instances;
            var result = [];
            for(var i=0;i<instances.length;i++){
                result = result.concat(instances[i].getValidationItems());
            }
            result = result.distinct();
            return result;
        },
        /**
         *得到所有实例的输入对象（收件人、抄送、密送）
         */
        getInputBoxItems: function () {
            return this.getAllInstancesItems();
        },
		/**
         *得到所有实例的地址域名
         */
		getInputBoxItemsDomain: function (){
			var result = [];
			for(var p in this.items){
				var item = this.items[p];
				if(item && item.domain){
					result.push(item.domain);
				}
			}
			result = result.distinct();
			return result;
		},
        /**
         *判断是否重构输入
         *@inner
         */
        isRepeat: function (addr) {
            //取手机号码或者邮件地址作为key
            var hashKey = this.contactsModel.getAddr(addr, this.type);
            if (hashKey && this.hashMap[hashKey]) {
                //实现闪烁效果
                for(var p in this.items){
                    var item = this.items[p];
                    if(item && item.hashKey == hashKey){
                        M139.Dom.flashElement(item.el);
                        break;
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        /**
         *todo event
         *插入收件人之前
         *@inner
         */
        beforeInsertItem: function () {
            var This = this;
            var curItemsLen = this.getInputBoxItems().length;
            var addresseeTips = this.jAddrTipsContainer;
            if (curItemsLen >= this.maxSend()) {
                addresseeTips.html('不能再添加收件人！').show();
                //todo
                /*
                this.blinkBox(addresseeTips, 'xxxclass');
                this.hideBlinkBox(addresseeTips);
                */
                return false;
            }
            return true;
        },


        /**
         *插入成员
         *@param {String} addr 插入的地址
         *@param {Object} options 选项集合
         *@param {Boolean} options.isAfter 是否插入到文本框后方
         *@param {HTMLElement} options.element 插入到目标元素后方
         *@param {Boolean} options.isFocusItem 插入后是否显示为选中状态
         */
        insertItem: function (addr, options) {
            options = options || {};
            var isAfter = options.isAfter;
            var element = options.element;
            var isFocusItem = options.isFocusItem;
            var current = this;
            if (!element) {
                var focusText = !isAfter && !element;
                element = this.textboxView.$el;
            }
            //ad wx
            //if (current.change){ current.change(this.items);} // lichao修改 先注释掉这行代码,改变触发的位置,在onItemChange中触发
            var list = _.isArray(addr) ? addr : this.splitAddr(addr);
             
            var totalLength = this.getInputBoxItems().length;
            var breakSender = false;

            for (var i = 0; i < list.length; i++) {
                if (totalLength == this.maxSend()) {
                    //todo 移到别的地方会好一些
                    try {
                        if (jQuery.isFunction(this.options.onMaxSend)) {
                            this.options.onMaxSend();
                        } else {
                            //TODO 这一坨应该放在写信页调用的onMaxSend里
                            if (list.length == 1) {
                                if (this.noUpgradeTips) {
                                    var tipHTML = '接收人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人！';
                                } else {
                                    var tipHTML = '收件人数已超过上限<span style="color: #F60;">' + this.maxSend() + '</span>人，<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">升级邮箱</a>添加更多！';
                                }
                            } else {
                                var tipHTML = M139.Text.Utils.format('<span style="color: #F60;">{remain}</span>人未添加，最多添加<span style="color: #F60;">{maxSend}</span>人！', {
                                    remain: list.length - i,
                                    maxSend: this.maxSend()
                                });
                                //todo
                                if (top.$User.getServiceItem() != "0017" && !this.noUpgradeTips) {//非20元版用户
                                    tipHTML += '<a href="javascript:;" onclick="top.$App.showOrderinfo()" style="color:#0344AE">升级邮箱</a>添加更多！'
                                }
                            }
                            this.showAddressTips({
                                html: tipHTML,
                                flash: true
                            });
                        }
                    } catch (e) { }
                    breakSender = true;
                    break;
                } else {
                    totalLength++;
                }
                var str = list[i].trim();
                if (str != "") {
                    if (options.testRepeat === false || !this.isRepeat(str)) {
                        //move to itemview
                        var item = new M2012.UI.RichInput.ItemView({
                            richInput:this,
                            text:str,
                            itemId:this.getNextItemId(),
                            type: this.type,
                            limitMailDomain : this.options.limitMailDomain,
                            errorMessage: this.options.validateMsg || "接收人格式非法，请双击修改"
                        }).render();
                        M2012.UI.RichInput.Tool.unselectable(item.el);
                        item.on("select",function(){
                            current.onItemSelected({
                                item:this
                            });
                        }).on("unselect",function(){
                            current.onItemUnSelected({
                                item:this
                            });
                        });
                        this.items[item.itemId] = item;
                        if(!item.error){
                            this.hashMap[item.hashKey] = true;
                        }
                        if (isAfter) {
                            element.after(item.$el);
                        } else {
                            element.before(item.$el);
                        }
                        if (isFocusItem) item.select();
                       
                    }
                }
            }
            this.onItemChange({
                breakSender: breakSender
            });
        },
        /**
         *todo event
         *插入收件人之后
         *@inner
         */
        onItemChange: function (options) {
            options = options || {};
            if (!options.breakSender) {
                var addresseeTips = this.jAddrTipsContainer;
                var itemLength = this.getInputBoxItems().length;
                var html = '';
                if (itemLength >= this.sendIsUpTo()) {
                    var remail = this.maxSend() - itemLength;
                    html = '还可添加<strong class="c_ff6600">' + remail + '</strong>人';
                    this.showAddressTips({ html: html });
                } else {
                    this.hideAddressTips();
                }
            }
            /**当收件人个数发生变化
            * @name M2012.UI.RichInput.View#itemchange
            * @event
            * @param {Object} e 事件参数
            * @example
            httpClient.on("itemchange",function(){
            });
            */
			
			
			//收件人人数大于3人时提示群发单显教育(只在写信页用)
			try{
				if( window.location.href.indexOf("html/compose.html") > -1){
					top.$App.off('insertItem');
					var toLength = this.getToInstancesItems().length;
					toLength >=3 && top.$App.trigger('insertItem',{totalLength:toLength}); 
				}
			}catch(e){}

            if (this.change){this.change(this.items);} // 李超新增,如果item改变,则触发change事件
            this.trigger("itemchange");
        },

        /**
         *地址栏下方的提示信息
         *@param {Object} options 参数集
         *@param {String} options.html 提示内容
         *@param {Boolean} options.flash 是否闪烁
         */
        showAddressTips: function (options) {
            var This = this;
            this.jAddrTipsContainer.html(options.html).show();
            if (options.flash) {
                M139.Dom.flashElement(this.jAddrTipsContainer);
            }
            clearTimeout(this.hideAddressTipsTimer);
            //5秒后提示自动消失
            this.hideAddressTipsTimer = setTimeout(function () {
                This.hideAddressTips();
            }, 5000);
        },
        hideAddressTips:function(){
            // add by tkh
            var associates = this.jAddrTipsContainer.find("a[rel='addrInfo']");
            if(associates.size() == 0){
                this.jAddrTipsContainer.hide();
            }
        },

        onItemSelected:function(e){
        
        },
        onItemUnSelected:function(e){
        
        },
        /**
         *得到文本框后一个成员
         *@inner
         */
        getTextBoxNextItem: function () {
            var node = this.textboxView.el.nextSibling;
            if (node) {
                var itemId = node.getAttribute("rel");
                if (itemId) {
                    return this.items[itemId];
                }
            } else {
                return null;
            }
        },
        /**
         *得到文本框前一个成员
         *@inner
         */
        getTextBoxPrevItem: function () {
            var node = this.textboxView.el.previousSibling;
            if (node) {
                var itemId = node.getAttribute("rel");
                if (itemId) {
                    return this.items[itemId];
                }
            } else {
                return null;
            }
        },
        /**
         *取消选择所有成员
         *@inner
        */
        unselectAllItems: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) {
                    item.unselect();
                }
            }
            this.lastClickItem = null;
        },
        /**
         *选择所有成员
         *@inner
        */
        selectAll: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) {
                    item.select();
                }
            }
        },

        /**
         *复制选中成员  todo 优化成原生的复制
         *@inner 
         */
        copy: function () {
            var This = this;
            var items = this.getSelectedItems();
            var list = [];
            for (var i = 0; i < items.length; i++) {
                list.push(items[i].allText);
            }
            M2012.UI.RichInput.Tool.Clipboard.setData(list);
            setTimeout(function () {
                M139.Dom.focusTextBox(This.textbox);
            }, 0);
        },
        /**
         *剪切选中成员  todo 优化成原生的剪切
         *@inner 
         */
        cut: function () {
            this.copy();
            var items = this.getSelectedItems();
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
            }
            if(this.inputAssociateView){
                this.inputAssociateView.render();// add by tkh
            }
        },
        /**
         *粘贴成员 todo 优化成原生的
         *@inner 
         */
        paste: function (e) {
            var This = this;
            setTimeout(function () {
                var text = This.textbox.value;
                if (/[;,；，]/.test(text) ||
                            (This.type == "email" && M139.Text.Email.isEmailAddr(text)) ||
                            (This.type == "mobile" && M139.Text.Mobile.isMobile(text))
                            ) {
                    This.createItemFromTextBox();
                }
            }, 0);
        },

        /**
         *获得选中的成员
         *@inner 
         */
        getSelectedItems: function () {
            var result = [];
            for (var p in this.items) {
                var item = this.items[p];
                if (item && item.selected) {
                    result.push(item);
                }
            }
            return result;
        },

        /**
         *清空输入项 
         */
        clear: function () {
            for (var p in this.items) {
                var item = this.items[p];
                if (item) item.remove();
            }
        },

        /**
         *移除选中的成员
         *@inner 
         */
        removeSelectedItems: function () {
            var items = this.getSelectedItems();
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
            }
        },

        /**
         *双击编辑联系人
         */
        editItem:function(itemView){
            var This = this;
            this.textboxView.setEditMode(itemView);
        },

        /**
         *@inner
         *分割多个联系人
         */
        splitAddr:function(addr){
            if(this.type == "email"){
                return M139.Text.Email.splitAddr(addr);
            }else if(this.type =="mobile"){
                return M139.Text.Mobile.splitAddr(addr);
            }
            return [];
        },


        /**
         *从文本框读取输入值，添加成员
         */
        createItemFromTextBox: function () {
            var textbox = this.textbox;
            var value = textbox.value.trim();
            if (value != "" && value != this.tipText) {
                //todo 优化event
                if (this.type == "email" && /^\d+$/.test(value)) {
                    value = value + "@" + ((top.$App && top.$App.getMailDomain()) || "139.com");
                }
                this.textboxView.setValue("");
                this.insertItem(value);
                if(this.inputAssociateView){
                    this.inputAssociateView.render();// add by tkh 
                }
                if(this.inputCorrectView){
                    this.inputCorrectView.render();//add by yly
                }
                this.focus();
            }
        },

        /**
         *移动文本框到
         *@inner
         */
        moveTextBoxTo: function (insertElement, isAfter) {
            if(!insertElement)return;
            if (isAfter) {
                insertElement.after(this.textboxView.el);
            } else {
                insertElement.before(this.textboxView.el);
            }
            window.focus();
            this.jTextBox.focus();
            //?? current.textbox.createTextRange().select();
        },

        /**
         *移动文本框到末尾
         *@inner
         */
        moveTextBoxToLast: function () {
            var el = this.textboxView.el;
            if (el.parentNode.lastChild != el) {
                el.parentNode.appendChild(el);
            }
            if ($.browser.msie) window.focus();
            //textbox.focus();
        },

        /**
         *移除成员数据
         *@inner
         */
        disposeItemData: function (item) {
            var items = this.items;
            delete items[item.itemId];

            //重新建立map，而不是直接删除key，因为有可能存在key相同的item
            this.hashMap = {};

            for (var id in items) {
                var item = items[id];
                if (!item.error) {
                    this.hashMap[item.hashKey] = true;
                }
            }

            this.onItemChange();
        },
        /**
         *根据鼠标移动的起始点和结束点，得到划选的成员
         *@inner
         */
        trySelect: function (p1, p2) {
            if (p1.y == p2.y && p1.x == p2.x) return;
            if (p1.y == p2.y) {
                if (p1.x < p2.x) {
                    var topPosition = p1;
                    var bottomPosition = p2;
                } else {
                    var topPosition = p2;
                    var bottomPosition = p1;
                }
            } else if (p1.y < p2.y) {
                var topPosition = p1;
                var bottomPosition = p2;
            } else {
                var topPosition = p2;
                var bottomPosition = p1;
            }
            var startElement;
            var elements = this.jContainer.find(this.itemPath);
            var itemHeight;
            for (var i = 0; i < elements.length; i++) {
                var element = elements.eq(i);
                var offset = element.offset();
                var x = offset.left + element.width();
                var y = offset.top + element.height();
                var selected = false;
                if (!itemHeight) itemHeight = element.height();
                if (!startElement) {
                    if ((topPosition.x < x && topPosition.y <= y) || (y - topPosition.y >= itemHeight)) {
                        startElement = element;
                        selected = true;
                    }
                } else if (bottomPosition.x > offset.left && bottomPosition.y > offset.top) {
                    selected = true;
                } else if (bottomPosition.y - offset.top > itemHeight) {
                    selected = true;
                }
                var itemObj = this.items[element.attr("rel")];
                if (selected) {
                    itemObj.select();
                } else {
                    itemObj.unselect();
                }
            }
        },
        //不记得是做什么的
        itemIdNumber: 0,
        /**
         *返回下一个子项的id
         *@inner
         */
        getNextItemId: function () {
            return this.itemIdNumber++;
        },
        /**
         *设置提示文本
         */
        setTipText: function (text) {
            this.model.set("placeHolder", text);
        },
        /**
         *显示默认文本
         */
        switchTipText: function () {
            if (this.textbox.value == "" && !this.hasItem()) {
                var text = this.model.get("placeHolder");
                this.$(".PlaceHold").show().text(text);
            } else {
                this.$(".PlaceHold").hide();
            }
        },
        /**
         *输入组件获得焦点
         */
        focus: function () {
            //if (document.all) {
            try {
                //当元素隐藏的时候focus会报错
                this.textbox.focus();
            } catch (e) { }
            //} else {
                //this.textbox.select(); //select焦点不会自动滚动到文本框
            //}
        },
        /**
         *返回组件是否有输入值
         *@returns {Boolean}
         */
        hasItem: function () {
            return this.getItems().length > 0;
        },

        /**
         *返回组件输入的所有地址
         */
        getAddrItems: function () {
            var items = this.getItems();
            var result = [];
            for (var i = 0; i < items.length; i++) {
                if (!items[i].error) {
                    result.push(items[i].addr);
                }
            }
            return result;
        },

        /**
         *返回组件输入的所有地址（正确的）
         */
        getValidationItems: function () {
            var items = this.getItems();
            var result = [];
            for (var i = 0; i < items.length; i++) {
                if (!items[i].error) {
                    result.push(items[i].allText);
                }
            }
            return result;
        },

        /**
         *返回第一个格式非法的输入文本
         *@returns {String}
         */
        getErrorText: function () {
            var item = this.getErrorItem();
            return item && item.allText;
        },
        /**
         *@inner
         */
        getErrorItem:function(){
            var items = this.getItems();
            for (var i = 0; i < items.length; i++) {
                if (items[i].error) {
                    return items[i];
                }
            }
            return null;
        },

        /**
         *键盘按下
         *@inner
         */
        onKeyDown: function (e) {
            if (e.target.tagName == "INPUT" && e.target.value != "") return;
            var current = this;
            var Keys = M139.Event.KEYCODE;
            switch (e.keyCode) {
                case Keys.BACKSPACE:
                    {
                        return KeyDown_Backspace.apply(this, arguments);
                    }
                case Keys.DELETE:
                    {
                        return KeyDown_Delete.apply(this, arguments);
                    }
                case Keys.A:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_A.apply(this, arguments);
                    }
                case Keys.C:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_C.apply(this, arguments);
                    }
                case Keys.X:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_X.apply(this, arguments);
                    }
                case Keys.V:
                    {
                        if (e.ctrlKey) return KeyDown_Ctrl_V.apply(this, arguments);
                    }
                default:
                    break;
            }
            function KeyDown_Backspace(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].$el);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
                e.preventDefault();
            }
            function KeyDown_Delete(e) {
                var selecteds = current.getSelectedItems();
                if (selecteds.length > 0) {
                    current.moveTextBoxTo(selecteds[0].$el);
                }
                current.removeSelectedItems();
                window.focus();
                current.jTextBox.focus();
            }
            function KeyDown_Ctrl_A(e) {
                current.selectAll();
                e.preventDefault();
            }
            function KeyDown_Ctrl_C(e) {
                return current.copy();
            }
            function KeyDown_Ctrl_X(e) {
                return current.cut();
            }
            function KeyDown_Ctrl_V(e) {
                return current.paste(e);
            }
        },
        /**
         *鼠标点击
         *@inner
         */
        onClick: function(e) {
            //点击控件空白地方（item、textbox以外）
            if (!jQuery(e.target).hasClass("ItemContainer")) return;
            if (this.getSelectedItems().length > 0) return; //鼠标划选时不触发
            var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
                richInputBox: this,
                x: e.clientX,
                y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
            });
            if (nearItem) {
                this.moveTextBoxTo(nearItem.element, nearItem.isAfter);
            }else{
                this.textbox.focus();
            }
        },

        getClickItem:function(e){
            var target = e.target;
            var itemEl = null;
            var jEl = $(target);
            var itemId = null;
            if (jEl.hasClass(this.itemClass)) {
                itemId = jEl.attr("rel");
            } else if (jEl.parent().hasClass(this.itemClass)) {
                itemId = jEl.parent().attr("rel");
            }
            return itemId;
        },


        /**
         *鼠标按下
         *@inner
         */
        onMouseDown: function(e) {
            var target = e.target;
            
            if (target.tagName == "INPUT" || target.className == "addnum" || target.parentNode.className == "addnum"
				|| target.className == "addrDomainCorrection" || target.parentNode.className == "addrDomainCorrection" || target.parentNode.parentNode.className == "addrDomainCorrection"
				) {
                return;
            }

            var itemId = this.getClickItem(e); 

            this.startPosition = {
                x: e.clientX,
                y: e.clientY + M2012.UI.RichInput.Tool.getPageScrollTop()
            };
            if (itemId) {
                if (!e.ctrlKey && !e.shiftKey) {
                    M2012.UI.RichInput.Tool.dragEnable = true;
                    var clickItem = this.items[itemId];
                    var items = this.getSelectedItems();
                    if ($.inArray(clickItem, items) == -1) {
                        items.push(clickItem);
                    }
                    M2012.UI.RichInput.Tool.dragItems = items;

                    if ($.browser.msie) {
                        M2012.UI.RichInput.Tool.captureElement = e.target;
                        e.target.setCapture();
                    } else {
                        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    
                    this.unselectAllItems();
                    this.createItemFromTextBox();
                    this.moveTextBoxToLast();
                    this.selectArea = true;
                    this.focus();
                    
                    M139.Event.stopEvent(e);
                }
            } else if (target == this.el || jQuery.contains(this.el, target)) {
                this.unselectAllItems();
                this.createItemFromTextBox();
                this.moveTextBoxToLast();
                this.selectArea = true;
                this.focus();
            }
            
            M2012.UI.RichInput.Tool.currentRichInputBox = this;
        },
		showErrorDomain: function(errorDomain){
			var items = this.items;
			var item = '';
			for(var p in items){
				item = items[p];
				if(item.domain == errorDomain){
					item.trigger('errorDomain');
				}
			}
		},
		changItemDomain: function(errorDomain, domain){
			var items = this.items;
			var item = '';
			for(var p in items){
				item = items[p];
				if(item.domain == errorDomain){
					item.trigger('changeDomain',{errorDomain:errorDomain, domain:domain});
				}
			}
		}
    }));


    var instances = M2012.UI.RichInput.instances = [];
    M2012.UI.RichInput.getInstanceByContainer = function(element) {
        for (var i = 0; i < instances.length; i++) {
            var o = instances[i];
            if (o.container == element || o.jContainer == element) return o;
        }
        return null;
    }

    //工具类
    M2012.UI.RichInput.Tool = {
        getPageScrollTop: function () {
            return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
        },
        //元素不可选中（禁用浏览器原生选中效果）
        unselectable: function (element) {
            if ($.browser.msie) {
                element.unselectable = "on";
            } else {
                element.style.MozUserSelect = "none";
                element.style.KhtmlUserSelect = "none";
            }
        },
        resizeContainer: function (element, autoHeight) {
        },
        //根据坐标获取最接近的item
        getNearlyElement: function (param) {
            var current = param.richInputBox;
            //得到当前坐标所在行的元素
            var jElements = current.jContainer.find(current.itemPath);
            var rowsElements = [];
            for (var i = 0; i < jElements.length; i++) {
                var jElement = jElements.eq(i);
                var _y = jElement.offset().top;
                if (param.y > _y && param.y < _y + jElement.height()) {
                    rowsElements.push(jElement);
                }
            }
            //获得插入点
            var overElemet;
            var isAfter = true;
            for (var i = 0; i < rowsElements.length; i++) {
                var jElement = rowsElements[i];
                var offset = jElement.offset();
                var _x = offset.left;
                if (param.x < _x + jElement.width() / 2) {
                    overElemet = jElement;
                    isAfter = false;
                    break;
                }
                overElemet = jElement;
            }
            if (overElemet) {
                return {
                    element: overElemet,
                    isAfter: isAfter
                }
            } else {
                return null;
            }
        },
        bindEvent: function (richInputBox, element, events) {
            for (var eventName in events) {
                var func = events[eventName];
                element.bind(eventName, (function (func) {
                    return (function (e) {
                        e.richInputBox = richInputBox;
                        return func.call(this, e);
                    })
                })(func));
            }
        },
        draw: function (p1, p2) {
            if (!window.drawDiv) {
                window.drawDiv = $("<div style='position:absolute;left:0px;top:0px;border:1px solid blue;'></div>")
                .appendTo(document.body);
            }
            var width = Math.abs(p1.x - p2.x);
            var height = Math.abs(p1.y - p2.y);
            drawDiv.width(width);
            drawDiv.height(height);
            drawDiv.css({
                left: Math.min(p1.x, p2.x),
                top: Math.min(p1.y, p2.y)
            });
        },
        //伪剪贴板对象
        Clipboard: {
            setData: function (arr) {
                var txtGhost = $("<input type='text' style='width:1px;height:1px;overflow:hidden;position:absolute;left:0px;top:0px;'/>").appendTo(document.body).val(arr.join(";")).select();
                setTimeout(function () {
                    txtGhost.remove();
                }, 0);
            }
        },
        hidDragEffect: function () {
            if (this.dragEffectDiv) this.dragEffectDiv.hide();
        },
        //拖拽的时候效果
        drawDragEffect: function (p) {
            if (!this.dragEffectDiv) {
                this.dragEffectDiv = $("<div style='position:absolute;\
                border:2px solid #444;width:7px;height:8px;z-index:5000;overflow:hidden;'></div>").appendTo(document.body);
            }
            this.dragEffectDiv.css({
                left: p.x + 4,
                top: p.y + 10,
                display: "block"
            });
        },
        hidDrawInsertFlag: function () {
            if (this.drawInsertFlagDiv) this.drawInsertFlagDiv.hide();
        },
        //插入效果（游标）
        drawInsertFlag: function (p) {
            if (!this.drawInsertFlagDiv) {
                this.drawInsertFlagDiv = $("<div style='position:absolute;\
                background-color:black;width:2px;background:black;height:15px;z-index:5000;overflow:hidden;border:0;'></div>").appendTo(document.body);
            }
            var hitRichInputBox;
            //ie9,10和火狐，拖拽的时候 mousemove e.target始终等于按下的那个元素，所以只能用坐标判断
            if (($B.is.ie && $B.getVersion() > 8) || $B.is.firefox) {
                for (var i = M2012.UI.RichInput.instances.length - 1; i >= 0; i--) {
                    var rich = M2012.UI.RichInput.instances[i];
                    if (!M139.Dom.isHide(rich.el,true) && p.y > rich.$el.offset().top) {
                        hitRichInputBox = rich;
                        break;
                    }
                }
            } else {
                for (var i = 0; i < M2012.UI.RichInput.instances.length; i++) {
                    var rich = M2012.UI.RichInput.instances[i];
                    if (M2012.UI.RichInput.Tool.isContain(rich.container, p.target)) {
                        hitRichInputBox = rich;
                        break;
                    }
                }
            }
            if (hitRichInputBox) {
                var nearItem = M2012.UI.RichInput.Tool.getNearlyElement({
                    richInputBox: hitRichInputBox,
                    x: p.x,
                    y: p.y
                });
            }
            if (nearItem) {
                var offset = nearItem.element.offset();
                this.drawInsertFlagDiv.css({
                    left: offset.left + (nearItem.isAfter ? (nearItem.element.width() + 2) : -2),
                    top: offset.top + 4,
                    display: "block"
                });
                this.insertFlag = { element: nearItem.element, isAfter: nearItem.isAfter, richInputBox: hitRichInputBox };
            } else {
                this.insertFlag = { richInputBox: hitRichInputBox };
            }
        },
        isContain: function (pNode, cNode) {
            while (cNode) {
                if (pNode == cNode) return true;
                cNode = cNode.parentNode;
            }
            return false;
        },
        delay: function (key, func, interval) {
            if (!this.delayKeys) this.delayKeys = {};
            if (this.delayKeys[key]) {
                clearTimeout(this.delayKeys[key].timer);
            }
            this.delayKeys[key] = {};
            this.delayKeys[key].func = func;
            var This = this;
            this.delayKeys[key].timer = setTimeout(function () {
                This.delayKeys[key] = null;
                func();
            }, interval || 0);
        },
        fireDelay: function (key) {
            if (!this.delayKeys || !this.delayKeys[key]) return;
            this.delayKeys[key].func();
            clearTimeout(this.delayKeys[key].timer);
        },
        hideBlinkBox: function (tipObj, time) {
            if (typeof (time) != 'number') time = 5000;
            var This = this;
            if (This.keep) clearTimeout(This.keep);
            This.keep = setTimeout(function () {
                tipObj.hide();
            }, time);
        },
        blinkBox: function (obj, className) {
            var This = this;
            obj.addClass(className);
            var keep;
            var loop = setInterval(function () {
                if (keep) clearTimeout(keep);
                obj.addClass(className);
                keep = setTimeout(function () { obj.removeClass(className); }, 100);
            }, 200);
            setTimeout(function () {
                if (loop) clearInterval(loop);
            }, 1000);
        }
    }


    //暂放至此
    //数组扩展
    //去重
    Array.prototype.distinct = function(){
        var filtered= [];
        var obj = {};
        for(var i = 0;i<this.length;i++){
            if(!obj[this[i]]){
                obj[this[i]] = 1;
                filtered.push(this[i]);
            }
        }
        return filtered;
    };

    // 排序 
    Array.prototype.ASC = function(){
        return this.sort(function(a,b){
            if( a.localeCompare(b) > 0 ) return 1;
            else return -1;
        });
    }



    jQuery.extend(M2012.UI.RichInput,
    /**@lends M2012.UI.RichInput*/
    {
        /**
         *创建富收件人文本框实例
         *@param {Object} options 参数集合
         *@param {String} options.type 地址本类型:email|mobile|fax|mixed
         *@param {HTMLElement} options.container 组件的容器
         *@param {Number} options.maxSend 最大接收人个数，默认为50
         *@param {Number} options.preventAssociate 是否屏蔽推荐收件人功能
         *@param {Number} options.preventCorrect 是否屏蔽域名纠错功能
         *@param {Number|Function} options.sendIsUpTo 达到多少个联系人后提示剩余个数（默认是maxSend-5)
         */
        create:function(options){
            var plugins = [];
            plugins.push(M2012.UI.RichInput.Plugin.AddrSuggest);
            options.plugins = plugins;
            var view = new M2012.UI.RichInput.View(options);
            if(!options.preventAssociate && top.$App){
                view.inputAssociateView = new M2012.UI.Suggest.InputAssociate({richInputBox : view});// add by tkh 地址输入框联想组件
            }
			if(!options.preventCorrect && top.$App && M2012.UI.Suggest.InputCorrect){
				view.inputCorrectView = new M2012.UI.Suggest.InputCorrect({richInputBox : view});
			}
            if (options.noUpgradeTips) {
                view.noUpgradeTips = true;
            } else {
                view.noUpgradeTips = false;
            }
            return view;
        }
    });

})(jQuery, _, M139);