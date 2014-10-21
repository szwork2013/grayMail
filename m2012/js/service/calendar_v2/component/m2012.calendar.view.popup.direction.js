; (function ($, _, M139, top) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Calendar.View.Popup.Direction";

    var master = window.$Cal;

    /*
      弹出框
      1、识别方向
      2、鼠标点击元素处定位
    */
    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "body",

        defaults: {

            //目标元素 $(dom)
            srcElement: null,

            //目标元素位置和尺寸
            srcRect: null,

            //弹窗事件参数
            eventArgs: null,

            //弹出框对象
            popElement: null,

            //回调函数
            callback: null
        },

        /** 弹出框基类
         * @param {Object}   args.target   // 目标对象 与下面的 args.event至少有一个存在 (可选)
         * @param {Object}   args.event    // 事件源，如果该对象不为空，那么定位优先以鼠标定位 (可选)
         * @param {Object}   args.rect     // 目标对象的方位坐标，便于精确定位弹出层位置 (可选)
         * @param {Function} args.callback // 窗口向主页面传递信息的回调函数 (可选)
         */
        initialize: function (args) {

            args = args || {};

            var self = this;

            self.eventArgs = args.event || null;
            self.srcElement = args.target;
            self.srcRect = args.rect || null;

            //目标元素
            if (!self.srcElement) {
                self.srcElement = self.eventArgs ? self.eventArgs.target : null;
            }
            if (!self.srcElement)
                self.srcElement = $(document.body);

            //回调函数
            self.callback = function (options) {
                args.callback && args.callback(options);
            }

            var bclose = self._initEvents();
            if (bclose) {
                self.render();
            }
        },

        _initEvents: function () {

            var views = M2012.Calendar.View.Popup.Direction.viewsStack || [];
            var bclose = true;

            //检测同类型的弹出框是否可以关闭
            //只有其他框都能关闭才能展示新的窗口
            for (var i = 0; i < views.length; i++) {

                var view = views[i];

                //是否可以关闭当前窗口
                bclose = view.onClose();
                if (!bclose)
                    break;

                //当确认关闭后才关闭该视图
                views.splice(i, 1);
                i--;
                view.popElement.remove();
            }
            return bclose;
        },
        /*
         需要子类去实现的方法
         --begin------------
        */

        /** 
         * 设置弹出层内容区域内容
         * @param {Object}   el   //容器元素JQuery对象    
        **/
        setContent: function (el) {

            throw 'This method is not implemented: "setContent"';
        },

        /** 
        * 设置弹出层链接区域内容
        * @param {Object}   el   //容器元素JQuery对象    
       **/
        setLink: function (el) {

            //   throw 'This method is not implemented: "setLink"';
        },

        setShare: function (el) {
            //活动分享
        },

        /** 
         * 设置弹出层操作按钮区域内容
         * @param {Object}   el   //容器元素JQuery对象    
        **/
        setOptions: function (el) {

            throw 'This method is not implemented: "setOptions"';
        },

        //当框关闭时触发事件
        onClose: function () {
            return true;
        },
        /*
         需要子类去实现的方法
         --end------------
        */

        show: function () {

            var self = this;
            if (self.popElement) {
                self.popElement.show();
                self.setPosition();
            }
        },

        /**
         *  隐藏当前弹出层
         *  @param {Object} args.silent  //是否触发关闭窗口时的检测，为true标示不检测（可选）
         *  @param {Object} args.ignore  //是否忽略弹出层之上的层，为true标示不关注该窗口上的其他弹出层（可选）
         */
        hide: function (args) {
            args = args || {};

            var self = this;

            var shouldClose = true;

            if (!args.silent)
                shouldClose = self.onClose();

            if (!_.isBoolean(args.ignore))
                args.ignore = false;

            if (shouldClose) {
                //关闭缓存的该视图对象
                var views = M2012.Calendar.View.Popup.Direction.viewsStack;

                for (var i = 0; i < views.length; i++) {
                    if (views[i] == self) {

                        views.splice(i, 1);
                        i--;
                    }
                }

                //点击一下页面，用以隐藏弹出框中的下拉列表弹出层
                if (!args.ignore) {
                    $(document.body).click();
                }

                //如果存在定时器则应相应关闭
                if (self.intervalId) {
                    window.clearInterval(self.intervalId);
                }

                self.popElement.remove();
            }

            // 清除定时器
            M2012.Calendar.CommonAPI.clearTimeout();
            return shouldClose;
        },

        /*
         * 显示关闭按钮
        */
        showCloseBtn: function () {
            var self = this;
            self.popElement.find("a.i_u_close").show();
        },

        /*
         * 设置弹出框位置
        */
        setPosition: function () {
            var self = this;
            var useMousePos = false;

            var popRect = {
                height: self.popElement.height(),
                width: self.popElement.width()
            };

            //获取目标元素的坐标及尺寸
            var srcRect = $.extend({
                height: self.srcElement.height(),
                width: self.srcElement.width()
            }, self.srcElement.offset());

            //如果通过元素获取的位置为0，则看看参数有没有传递过来明确的坐标值
            if (self.srcRect) {
                $.extend(srcRect, self.srcRect);
            }

            //如果能获取到鼠标事件信息
            //则取当前鼠标点击处坐标
            if (self.eventArgs) {
                $.extend(srcRect, {
                    top: self.eventArgs.clientY,
                    left: self.eventArgs.clientX,
                    width: 0,
                    height: 0
                });
                useMousePos = true;
            }

            var docRect = {
                height: document.body.clientHeight,
                width: document.body.clientWidth
            };

            //计算弹出框离底部和顶部的高度
            //距离底部高度
            var dbh = docRect.height - (srcRect.top + srcRect.height + popRect.height);
            //距离顶部高度
            var dth = srcRect.top - popRect.height;
            //获取弹出框方向
            var tbflag = (dbh < 0 && dth > 0) ? 2 : 1;

            //计算弹出框离左边和右边的距离
            //离左边的宽度
            var dlw = srcRect.left + srcRect.width - popRect.width;
            //距离右边的宽度
            var drw = docRect.width - (srcRect.left + popRect.width);
            var lrflag = (dlw > 0 && drw < 0) ? 8 : 4;

            var position = null;
            var offsetX = 0;
            var offsetY = 0;
            switch (tbflag | lrflag) {
                case 5: //箭头上方向靠右边
                    position = {
                        className: "",
                        top: srcRect.top + srcRect.height,
                        left: srcRect.left
                    };
                    offsetX = -18;
                    offsetY = 8;
                    break;
                case 6: //箭头下方向靠右边
                    position = {
                        className: "form-addtag-new-lb",
                        top: srcRect.top - popRect.height,
                        left: srcRect.left
                    };
                    offsetX = -18;
                    offsetY = -8;
                    break;
                case 9: //箭头上方向靠左边
                    position = {
                        className: "form-addtag-new-rt",
                        top: srcRect.top + srcRect.height,
                        left: srcRect.left + (useMousePos ? srcRect.width : 34) - popRect.width//当不以鼠标作为参照物时改成30像素是为了使弹出框不能太靠左，箭头刚好指向日期
                    };
                    offsetX = 18;
                    offsetY = 8;
                    break;
                case 10: //箭头下方向靠左边
                    position = {
                        className: "form-addtag-new-rb",
                        top: srcRect.top - popRect.height,
                        left: srcRect.left + (useMousePos ? srcRect.width : 34) - popRect.width
                    };
                    offsetX = 18;
                    offsetY = -8;
                    break;
            }

            if (position.className) {
                self.popElement.addClass(position.className);
            }
            if (!useMousePos) {
                offsetX = 0;
                offsetY = 0;
            }

            self.popElement.css({
                left: position.left + offsetX + 'px',
                top: position.top + offsetY + 'px'
            });
        },

        /**
         *  实时调整弹出框的位置
         */
        adjustPosition: function () {
            var self = this;
            //获取目标元素的位置信息
            var offset = self.srcElement.offset();
            var offsetCurrent = null;
            var y = 0;
            var x = 0;

            var bodyEl = $(document.body);

            self.intervalId = window.setInterval(function () {
                //如果参考元素被删除或隐藏了，则需要同时移除当前弹出框
                //但如果同时整个页面被隐藏了，说明切换到别的模块了，此时不能移除弹出框
                if (!self.srcElement || self.srcElement.length == 0 ||
                   (self.srcElement.is(":hidden") && bodyEl.is(":visible"))) {
                    self.hide({ silent: true, ignore: true });
                    return;
                }

                //元素隐藏时无需求计算高度
                if (self.srcElement.is(":hidden"))
                    return;

                offsetCurrent = self.srcElement.offset();
                y = offsetCurrent.top - offset.top;
                x = offsetCurrent.left - offset.left;

                if (y != 0 || x != 0) {
                    var offsetEl = self.popElement.offset();
                    self.popElement.css({
                        left: (offsetEl.left + x) + 'px',
                        top: (offsetEl.top + y) + 'px'
                    });
                    offset = offsetCurrent;
                }
            }, 500);
        },

        render: function () {

            var self = this;
            var cid = self.cid;

            var html = $T.format(self.TEMPLATE, { cid: self.cid });
            self.popElement = $(html).appendTo(self.el).click(function (e) {
                if (self.stopEvent) {
                    M139.Event.stopEvent(e);
                }
            });
            //设置关闭按钮点击功能
            self.popElement.find("a.i_u_close").click(function (e) {
                self.hide({ silent: true });
            });

            //设置弹出框正文内容
            self.setContent(self.getElement("text_area"));

            //分享按钮,所有浮层都有,即使没有的,也可以在下面setLink中hide掉
            self.setShare(self.getElement("link_text"));

            //设置弹出框链接区域
            self.setLink(self.getElement("link_text"));

            //设置弹出框操作按钮
            self.setOptions(self.getElement("opt_button"));

            //定位弹出框位置
            self.setPosition();

            //实时调整弹出框位置
            self.adjustPosition();
            //存储该视图
            M2012.Calendar.View.Popup.Direction.viewsStack.push(self);

        },

        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        /**
         * 显示操作按钮的遮罩层
         */
        showMask: function () {
            this.getElement("mask").removeClass("hide");
        },

        /**
         * 隐藏操作按钮的遮罩层
         */
        hideMask: function () {
            this.getElement("mask").addClass("hide");
        },

        TEMPLATE:
            ['<div class="tips tips-shcdule form-addtag-tips form-addtag-new"  name="pop_cal_direction" style="top:100px;left:100px;" >',
                '<div class="tips-text">',
                    '<a href="javascript:void(0)" class="i_u_close" title="关闭" style="display:none;"></a>',
                    '<div id="{cid}_text_area" class="tips-text-div">',
                    '</div>',
                    '<div class="boxIframeBtn" style="position:relative;overflow:hidden;">',
                        '<div id="{cid}_mask" style="position:absolute; top:0px; height:40px; z-index:1000;" class="blackbanner hide"></div>',
                        '<span id="{cid}_link_text" class="bibText">',
                        '</span>',
                        '<span id="{cid}_opt_button" class="bibBtn">',
                        '</span>',
                    '</div>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
            '</div>'].join("")
    }, {

        //弹出框视图栈
        viewsStack: [],

        /*
         尝试关闭所弹出框
         返回true时标示可以关闭当前界面上所有弹出框
        */
        tryClose: function () {
            var views = M2012.Calendar.View.Popup.Direction.viewsStack;
            if (views.length == 0)
                return true;

            for (var i = 0; i < views.length; i++) {
                if (!views[i].onClose())
                    return false;
            }

            return true;
        }
    }));

    $(function () {

        window.setTimeout(function () {
            var master = window.$Cal;
            master.on(master.EVENTS.HIDE_ACTIVITY_POPS, function (args) {
                var views = M2012.Calendar.View.Popup.Direction.viewsStack;
                var silent = true;
                if (args && _.isBoolean(args.silent))
                    silent = args.silent;

                while (views.length > 0) {
                    if (!views[0].hide({ silent: silent }))
                        break;
                }
            });
        }, 10);

    });



})(jQuery, _, M139, window._top || window.top);