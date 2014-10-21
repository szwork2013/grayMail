; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.ValidateTip.Bottom";

    M139.namespace(_class, superClass.extend({

        defaults: {

            //目标元素
            //需要在其上显示提示信息的$(dom)
            target: null,

            //提示内容
            content: "",

            //提示框的默认宽度
            width: 80
        },

        //当前控件
        curentEl: null,


        /**
         *  消息弹出提醒控件
         *  @param {Object} args.target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} args.content  消息内容
         *  @param {Int} args.width 弹出框宽度
        **/
        initialize: function (args) {
            var self = this;

            if (!args)
                args = {};

            if (args.target)
                self.target = args.target;

            if (args.content)
                self.content = args.content;

            if (args.width && $.isNumeric(args.width))
                self.width = args.width;

            self.render();

            self.initEvents();
        },

        initEvents: function () {

            this.curentEl.bind('blur', function () {
                M2012.Calendar.View.ValidateTip.Bottom.hide();
            });
        },

        render: function () {

            var self = this;

            var html = $T.format(self.template, {
                cid: self.cid,
                content: self.content,
                width: self.width
            });

            self.curentEl = $(html).appendTo($(document.body));
        },

        /**
         * 更新提示内容
         */
        updateContent: function (content) {

            $('#' + this.cid + '_content').html(content);
        },

        setPositon: function (el) {

            var self = this;

            if (!el) return;

            var offset = $(el).offset();
            var left = offset.left - 10;

            var height = $(el).height(); //这里取当前控件高度而不是弹框高度
            
            var top = offset.top + height + 14;
            console.log('top:'+top+'left:'+left);
            self.curentEl.css({ left: left, top: top });
            
            self.curentEl.focus();
        },

        template: [
            "<div id=\"{cid}_wrap\" class=\"tips\" tabindex=\"0\" hidefocus=\"true\" style=\"position:absolute;outline:none;left:20px;top:-1000px;width:{width}px;display:'';z-index:9999;\">",
                "<div class=\"tips-text\"  id=\"{cid}_content\">{content}</div>",
                "<div class=\"tipsTop diamond\" style=\"left:10px\"></div>",
           "</div>"
        ].join("")
    }, {

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        /**
         *  消息弹出提醒控件 此方法供外部调用
         *  @param {Object} target 消息框弹出是参考的元素(DOM对象)
         *  @param {Sting} text  消息内容
         *  @param {Boolean} isAutoHide 是否自动消失
        **/
        show: function (text, target, isAutoHide) {
            var self = this;
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip.Bottom({});
            }

            var control = $Cal_Validate_Tip;
            //更新界面内容
            control.updateContent(text);
            //设置位置
            control.setPositon(target);
            if (isAutoHide) {
                setTimeout(function () {
                    M2012.Calendar.View.ValidateTip.Bottom.hide();
                }, 5000);//5s消失
            }
        },

        /**
         * 显示控件外观
         * 此方法供外部调用
         */
        hide: function () {
            if (!window.$Cal_Validate_Tip) {
                window.$Cal_Validate_Tip = new M2012.Calendar.View.ValidateTip.Bottom({});
            }
            window.$Cal_Validate_Tip.curentEl.css({ left: '-1000px' });
        }
    }));


})(jQuery, _, M139, window._top || window.top)