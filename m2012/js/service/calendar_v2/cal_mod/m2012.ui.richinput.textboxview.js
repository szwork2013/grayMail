/**
 * @fileOverview 定义通讯录富文本框的扩管文本框对象
 */

(function (jQuery, _, Backbone, M139) {
    var namespace = "M2012.UI.RichInput.TextBoxView";
    M139.namespace(namespace, Backbone.View.extend(
        /**@lends M2012.UI.RichInput.TextBoxView.prototype*/
        {
            /** 定义通讯录地址本组件代码
             *@constructs M2012.UI.RichInput.TextBoxView
             *@param {Object} options 初始化参数集
             *@param {HTMLElement} options.element 托管的文本框对象
             */
            initialize: function (options) {

                this.setElement(options.element);

                this.richInputBox = options.richInput;

                this.jTextBox = this.$("input");
                this.textbox = this.jTextBox[0];

                this.initEvent();
            },
            /**
             *初始化事件
             *@inner
             */
            initEvent: function () {
                this.jTextBox.click($.proxy(this, "onClick"))
                    .focus($.proxy(this, "onFocus"))
                    .blur($.proxy(this, "onBlur"))
                    .keydown($.proxy(this, "onKeyDown"))
                    .keydown($.proxy(this, "onKeyUp"))
                    .bind("paste", $.proxy(this, "onPaste"))
                    .bind("cut", $.proxy(this, "onCut"));
                var This = this;
                M139.Timing.watchInputChange(this.textbox, function (e) {
                    This.onChange(e);
                });
            },
            /**
             *文本框内容变更时
             *@inner
             */
            onChange: function (e) {
                // 先注释掉这段代码,点击输入框时会触发该事件//
                this.fixTextBoxWidth();
                this.trigger("input");
            },
            /**
             *文本框根据内容自适应宽度
             *@inner
             */
            fixTextBoxWidth: function () {
                var jText = this.jTextBox;
                var minWidth = 10;
                if (jText.val() == "") {
                    this.$el.width(minWidth);
                    return;
                }
                if ($B.is.ie && $B.getVersion() < 10) {
                    var width = jText[0].createTextRange().boundingWidth + 13;
                } else {
                    //计算宽度
                    var widthHelper = $("#widthHelper");
                    if (widthHelper.length == 0) {
                        widthHelper = $("<span style='position:absolute;left:0px;top:0px;visibility:hidden;'\
                    id='widthHelper'></span>").appendTo(document.body);
                        widthHelper.css({
                            fontSize: jText.css("font-size"),
                            fontFamily: jText.css("font-family"),
                            border: 0,
                            padding: 0
                        });
                    }
                    var width = widthHelper.text(jText.val().replace(/ /g, "1")).width() + 13;
                    //fixed IE10下文本框会出来一个x
                    if ($B.is.ie && $B.getVersion() >= 10) {
                        width += 20;
                    }
                }
                var maxWidth = this.richInputBox.$el.width() - 3;
                if (width > maxWidth) width = maxWidth;
                if (width < minWidth) width = minWidth;


                //设置最大宽度
                if ($B.is.ie && $B.getVersion() < 8) {
                    if (width > 200) {
                        var containerWdith = this.richInputBox.$el.width();
                        if (width + 10 > containerWdith) {
                            width = containerWdith - 10;
                        }
                    }
                }

                this.$el.width(width);
                jText.width(width);
            },

            setEditMode: function (itemView) {
                var jTextBox = this.jTextBox;
                jTextBox.attr("mode", "edit"); //防止自动触发blur
                setTimeout(function () {
                    jTextBox.attr("mode", "");
                }, 0);
                jTextBox.val(itemView.allText);
                itemView.$el.replaceWith(this.$el);
                itemView.remove();
                
                M139.Dom.selectTextBox(this.textbox);
                this.fixTextBoxWidth();
            },

            setValue:function(value){
                this.textbox.value = value;
                this.fixTextBoxWidth();
            },

            /**
             *粘贴
             *@inner
             */
            onPaste: function (e) {
                /*
                todo test
                if (window.navigator.userAgent.indexOf("Firefox") >= 0) {
                    var This = this;
                    setTimeout(function() {
                        var text = This.value;
                        This.value = "";
                        This.value = text; //火狐下的文本框渲染bug
                    }, 0);
                }
                */
            },
            /**
             *剪切
             *@inner
             */
            onCut: function (e) {
                /*
                todo
                var current = e.richInputBox;
                RichInputBox.Plugin.AutoAssociateLinkMan(current);
                */
            },
            /**
             *获得焦点
             *@inner
             */
            onFocus: function (e) {
                this.richInputBox.trigger("focus");
                /*
                todo
                if(e && e.richInputBox){
                    var current = e.richInputBox;
                    RichInputBox.Plugin.AutoAssociateLinkMan(current);
                }
                */
               // add by tkh
               if(e && this.richInputBox.inputAssociateView){
                    this.richInputBox.inputAssociateView.render();// add by tkh
               }
               
               /*if(e && this.richInputBox.inputCorrectView){
                    this.richInputBox.inputCorrectView.render();// add by yly
               }*/
            },
            /**
             *失去焦点
             *@inner
             */
            onBlur: function (e) {
                var current = this.richInputBox;
                if (this.jTextBox.attr("mode") == "edit") {
                    this.jTextBox.attr("mode", "");
                    return;
                }
                current.createItemFromTextBox();
            },
            /**
             *点击
             *@inner
             */
            onClick: function (e) {
                if (e && e.richInputBox) e.richInputBox.clearTipText();
            },

            /**
             *按键松开
             *@inner
             */
            onKeyUp: function (e) {
                this.fixTextBoxWidth();
            },
            /**
             *键盘按下
             *@inner
             */
            onKeyDown: function (e) {
                var This = this;
                if (e.shiftKey || e.ctrlKey) return;
                var current = this.richInputBox;
                var Keys = M139.Event.KEYCODE;
                var textbox = this.textbox;
                this.fixTextBoxWidth();
                switch (e.keyCode) {
                    case Keys.BACKSPACE:
                        {
                            return KeyDown_Backspace.apply(this, arguments);
                        }
                    case Keys.DELETE:
                        {
                            return KeyDown_Delete.apply(this, arguments);
                        }
                    case Keys.SEMICOLON:
                    case Keys.COMMA:
                    case Keys.ENTER:
                        {
                            return KeyDown_Enter.apply(this, arguments);
                        }
                    case Keys.LEFT:
                        {
                            return KeyDown_Left.apply(this, arguments);
                        }
                    case Keys.RIGHT:
                        {
                            return KeyDown_Right.apply(this, arguments);
                        }
                    case Keys.UP: case Keys.Down:
                        {
                            e.isUp = e.keyCode == Keys.Up;
                            return KeyDown_Up_Down.apply(this, arguments);
                        }
                    case Keys.TAB:
                        {
                            return KeyDown_Tab.apply(this, arguments);
                        }
                }
                function KeyDown_Backspace(e) {
                    if (textbox.value == "") {
                        if (current.getSelectedItems().length > 0) return;
                        var item = current.getTextBoxPrevItem();
                        if (item) item.remove();
                        textbox.focus();
                    }
                }
                function KeyDown_Delete(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxNextItem();
                        if (item) item.remove();
                        textbox.focus();
                    }
                }
                function KeyDown_Enter(e) {
                    if (textbox.value.trim() != "") {
                        setTimeout(function () {
                            current.createItemFromTextBox();
                        }, 0);
                    }
                    return false;
                }
                function KeyDown_Left(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxPrevItem();
                        if (item) {
                            current.moveTextBoxTo(item.$el);
                            return false;
                        }
                    }
                }
                function KeyDown_Right(e) {
                    if (textbox.value == "") {
                        var item = current.getTextBoxNextItem();
                        if (item) {
                            current.moveTextBoxTo(item.$el, true);
                            return false;
                        }
                    }
                }
                function KeyDown_Up_Down(e) {
                    if (textbox.value == "") {
                        var offset = current.textboxView.offset();
                        var nearItems = M2012.UI.RichInput.Tool.getNearlyElement({
                            x: offset.left,
                            y: offset.top + (e.isUp ? -5 : 20),
                            richInputBox: current
                        });
                        if (nearItems) current.moveTextBoxTo(nearItems.element, nearItems.isAfter);
                        return false;
                    }
                }
                function KeyDown_Tab(e) {
                    textbox.setAttribute("TabPress", "1");
                    setTimeout(function () {
                        textbox.setAttribute("TabPress", null);
                    }, 0);
                }
            }
        }));
})(jQuery, _, Backbone, M139);