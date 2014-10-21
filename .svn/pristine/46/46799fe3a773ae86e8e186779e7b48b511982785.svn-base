﻿/**
 * @fileOverview 定义DOM操作相关的常用方法的静态类
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Dom
    *@requires jQuery
    */
    M139.Dom = {
        /**
        *判断view是否隐藏掉了，即display:none
        *@param {HTMLElement} element 判断的元素
        *@param {Boolean} bubblingParent 此参数为true的话则判断节点所在父元素是否可见
        */
        isHide: function (element, bubblingParent) {
            //todo is(":visible",ele)


            var result = false;
            if (element) {
                if (bubblingParent) {
                    while (element) {
                        if (element.style && element.style.display == "none") {
                            result = true;
                            break;
                        }
                        element = element.parentNode;
                    }
                } else {
                    result = element.style.display == "none";
                }
            }
            return result;
        },
        /***
         * 判断元素是否在指定的矩形区域内
         * @example:$D.inBounds("#div_main",{left:0,top:30,right:1240,bottom:800});
         */
        inBounds: function (elem, bounds) {
            if (elem.top && elem.left) {
                var position = elem;
            } else {
                var position = $(elem).position();
            }
            if (position.left >= bounds.left && position.top >= bounds.top
                && position.left  <= bounds.right && position.top  <= bounds.bottom) {
                return true;
            } else {
                return false;
            }
        },
        /**
        *判断element是否在某容器里，如果container等于element，返回true
        *@param {HTMLElement} container 容器
        *@param {HTMLElement} element 子元素
        */
        containElement: function (container, element) {
            return jQuery.contains(container, element);
            /*
            while (element && element.parentNode) {
                if (container === element) {
                    return true;
                }
                element = element.parentNode;
            }
            return false;
            */
        },
        /**
        *得到目标元素的父元素
        *@param {HTMLElement} target 目标元素
        *@param {String} parentTagName 父元素的标签
        */
        findParent: function (target, parentTagName) {
            parentTagName = parentTagName.toUpperCase();
            while (target) {
                if (target.tagName == parentTagName) {
                    return target;
                }
                target = target.parentNode;
            }
            return null;
        },
        /**
        *判断元素是否已被移除
        *@param {HTMLElement} element 判断的元素
        */
        isRemove: function (element) {
            try {
                while (element) {
                    if (element.tagName == "BODY") return false;
                    element = element.parentNode;
                }
            } catch (e) {
                return true;
            }
            return true;
        },
        /**
        *与input.focus()的区别是，这里捕获异常，并且获得焦点后光标默认在文本最后
        *@param {HTMLElement} objTextBox 获得焦点的文本框
        *@param {Object} options 扩展参数集合
        *@param {Number} options.pointerAt 光标的位置 0:最前,1:选中所有文本,2:最后,默认为2
        */
        selectTextBox: function (objTextBox, options) {
            options = options || {};
            var pointerAt = options.pointerAt === undefined ? 2 : options.pointerAt;
            try {
                if (pointerAt == 2) {
                    if (document.all) {
                            var r = objTextBox.createTextRange();
                            r.moveStart("character", objTextBox.value.length);
                            r.collapse(true);
                            r.select();
                    } else {
                        objTextBox.setSelectionRange(objTextBox.value.length, objTextBox.value.length);
                        objTextBox.focus();
                    }
                } else if (pointerAt == 1) {
                    objTextBox.select();
                } else {
                    objTextBox.focus();
                }
            } catch (e) { }
        },

        ZINDEX:5000,

        /**
         *获得从10000开始，自增的下一个zIndex
         */
        getNextZIndex:function(){
            return this.ZINDEX += 10;
        },

        /**
        *图片预加载
        *@param {Array} images 图片地址列表
        */
        preloadImages: function (images) {

        },
         //碰撞检测
        hitTest: function (o, l) {
        
            //console.log($(o).offset());
            //console.log(o);

            var r1 = $(o).offset();
            r1.width = o.offsetWidth; r1.height = o.offsetHeight;

            var r2 = $(l).offset();
            r2.width = l.offsetWidth; r2.height = l.offsetHeight;

           //判断一个点是否在矩形区域内
            function inRect(point,rect){
                return (point.left >= rect.left && point.top >= rect.top
                && point.left <= rect.left+rect.width && point.top <= rect.top+rect.height)
            }
            //判断两个矩形是否有交焦，以一个矩形2为参照，矩形1的四个顶点只要有一个落在矩形2内，则说明两矩形有相交，互为参照共要判断8次
            if (inRect({ left: r1.left, top: r1.top }, r2) || inRect({ left: r1.left+r1.width, top: r1.top }, r2)
                || inRect({ left: r1.left, top: r1.top + r1.height }, r2) || inRect({ left: r1.left + r1.width, top: r1.top + r1.height }, r2)
                || inRect({ left: r2.left, top: r2.top }, r1) || inRect({ left: r2.left + r2.width, top: r2.top }, r1)
                || inRect({ left: r2.left, top: r2.top + r2.height }, r1) || inRect({ left: r2.left + r2.width, top: r2.top + r2.height }, r1)) {
                
                return true;
            } else {
                return false;
            }
            /*function getOffset(o, isPoint) {
                var w = isPoint ? 1 : o.offsetWidth; //是1个像素的点
                var h = isPoint ? 1 : o.offsetHeight;
                for (var r = { l: o.offsetLeft, t: o.offsetTop, r: w, b: h };
                    o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop)
                return r.r += r.l, r.b += r.t, r;
            }
            
            for (var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
            b = getOffset(l[--i], true), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
            && (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
            return j ? !!r.length : r;
            */
            
        },

        /**
        *设置对象可拖拽
        *@param {HTMLElement} o 拖拽移动的对象
        *@param {Object} options 选项集合参数
        *@param {String} options.handleElement 拖拽的热区元素的路径，如: .titleBar
        *@param {Function} options.onDragStart 拖拽开始的回调
        *@param {Function} options.onDragMove 拖拽移动的回调
        *@param {Function} options.onDragEnd 拖拽结束的回调
        *@example
        $D.setDragAble(myDiv,{
            handleElement:".titleBar",
            onDragStart:function(e){
                //
            },
            onDragMove:function(e){
                //
            },
            onDragEnd:function(e){
                //
            }
        });
        */
        setDragAble: function (o, options) {
            options = options || {};
            var handleElement = options.handleElement;
            if (handleElement) {
                if (typeof (handleElement) == "string") {
                    var handleObj = $(o).find(handleElement);
                } else if (typeof (handleElement) == "object") {
                    //支持绑定多个热区元素
                    var handleObj = this.isJQueryObj(handleElement) ? handleElement : $(handleElement);
                }
            }
            o.orignX = 0;
            o.orignY = 0;
            var jObj = $(o);
            var min_x = 0, min_y = 0;
            var max_x, max_y;
            
            var manager = o;
            var offset = [];

            if (handleObj) {
                handleObj.mousedown(function (e) { drag_mouseDown(e) });//支持绑定多个热区元素
            } else {
                o.onmousedown = drag_mouseDown;
            }
            o.startDrag = function (e) {
                var x, y;
                e = M139.Event.getEvent();
                if (window.event) {
                    x = event.clientX + document.body.scrollLeft;
                    y = event.clientY + document.body.scrollTop;

                } else {
                    x = e.pageX;
                    y = e.pageY;
                }

                var postion = $(o).position();
                if (postion.left <= 0) {
                    offset = [0, 0];
                    
                } else {
                    offset = [x - postion.left, y - postion.top];
                }

                //window.status=x+","+y;
                var isStart = true; //拖动是否开始
                if (options.onDragStart) {
                    startResult = options.onDragStart({ x: x, y: y, target: (e.target || e.srcElement) });
                    if (startResult == false) { //在onDragStart返回false，可以
                        isStart = false;
                    }
                }
                if (isStart) { //确定拖动开始（某些dom元素上如文本框不能启动拖动）
                    if (o.setCapture) {	//在窗口以外也能响应鼠标事件
                        o.setCapture();
                    } else if (window.captureEvents) {
                        window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    $(document).bind("mousemove", drag_mouseMove);//.bind("mouseup", drag_mouseUp);
                    $GlobalEvent.on("mouseup", function (e) {
                        drag_mouseUp(e);
                    })
                   M139.Event.stopEvent(e); //阻止事件泡冒
                }
            }
            o.stopDrag = function () {
                if (o.releaseCapture) {
                    o.releaseCapture();
                }
                else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }

                if (options.onDragEnd) {
                    options.onDragEnd();
                }
                $GlobalEvent.off("mouseup");
                $(document).unbind("mousemove", drag_mouseMove).unbind("mouseup", drag_mouseUp);

            }

            function drag_mouseMove(e) {
                var newX, newY;
                if (window.event) {
					//chrome没有document.documentElement.scrollTop；有document.body.scrollTop(chrome执行到这个地方也有window.event)
                    newX = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
                    newY = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
                    
                } else {
                    newX = e.pageX;
                    newY = e.pageY;
                }

                if (options.bounds) { //控制拖拽边界
                    var bounds = {
                        left: options.bounds[0],
                        top: options.bounds[1],
                        right: options.bounds[2],
                        bottom: options.bounds[3]
                    }
                    var inBounds = $D.inBounds({ left: newX, top: newY }, bounds);
                    if (!inBounds) {
                        //manager.stopDrag(e);
                        return;
                    }

                }

                var _x = newX- offset[0];
                var _y = newY - offset[1];

                if (_x < 0) {
                    _x = 0;
                } else if (_x > getMax_X()) {
                    _x = getMax_X();
                }
                if (_y < 0) {
                    _y = 0;
                } else if (_y > getMax_Y()) {
                    _y = getMax_Y();
                }
                if (options.orignOffset) {
                    _x = _x + options.orignOffset.x;
                    _y = _y + options.orignOffset.y;
                }
                o.style.position = "absolute";
                if (!options.lockX) {
                    o.style.left = _x + "px";
                }
                if (!options.lockY) {
                    o.style.top = _y + "px";
                }

                if (options.onDragMove) {
                    options.onDragMove({ x: newX, y: newY,target:e.target});
                }
            }
            function drag_mouseDown(e) {
                manager.startDrag(e);
            }
            function drag_mouseUp(e) {
                manager.stopDrag(e);
            }

            function getMax_X() {
                if (!max_x){
                    max_x = $(document.body).width() - jObj.width();
                }
                return max_x;
            }
            function getMax_Y() {
                if (!max_y) {
                    max_y = $(document.body).height() - jObj.height();
                }
                return max_y;
            }
        },
        /**
         *获得元素的实际样式值  todo jQuery.curCss
         */
        getCurrentCSS:function(element,cssName){
            if (element.currentStyle) {
                return element.currentStyle[cssName.replace(/-[a-z]/, function(m) { return m.replace("-", "").toUpperCase() })];
            } else {
                return element.ownerDocument.defaultView.getComputedStyle(element, '').getPropertyValue(cssName);
            }
        },
        /**
        *让弹出菜单自动消失的一个工具函数，目前只支持点击其它区域自动关闭菜单，鼠标移出的话需要另外扩展
        *@param {Object} options 参数集合
        *@param {String} options.action 执行什么行为自动关闭菜单，可以是click|mouseout(注意这里是全局的)，默认是click
        *@param {Function} options.callback 可选参数，譬如：点击菜单以外的地区触发的回调
        *@param {HTMLElement} options.element 菜单元素节点
        *@param {Boolean} options.stopEvent 当action为click的时候，是否点击菜单自身不触发关闭菜单动作
        *@example
        var menu = createSomeMenu();
        M2012.UI.PopMenu.bindAutoHide({
            action:"click",
            element:menu.el,
            callback:function(){
                menu.remove();
            }
        });
        */
        bindAutoHide: function (options) {
            if (!options.element) {
                console.log("M139.Dom.bindAutoHide(),缺少element参数");
                return;
            }
            var action = options.action || "click";
            var showTime = new Date;
            if (action == "click") {
                if ($(options.element).attr("bindAutoHide") != "1") {//防止重复绑定
                    M139.Dom.unBindAutoHide(options);
                    $(options.element).attr("bindAutoHide", "1");
                    setTimeout(function () {
                        var evtHost = M139.Event.GlobalEvent;
                        if (top.M139) {
                            evtHost = top.M139.Event.GlobalEvent;
                        }

                        options.element.autoHideHandler = evtHost.on("click", function (data) {
                            try{
                                if (options.stopEvent) {
                                    var target = data.event.target;
                                    if (M139.Dom.containElement(options.element, target)) {
                                        return;
                                    }
                                }
                                if (new Date <= showTime) {
                                    return;
                                }
                                if ($.isFunction(options.callback)) {
                                    options.callback(data);
                                    options.callback = null;
                                }
                                evtHost.off("click", arguments.callee);//todo 有些时候移除不掉？
                            } catch (e) { }
                        },false);
                    }, 0);
                }
            }
        },
        /**
         *获取html对象的高度，与jQuery.height()不同的是会增加padding的计算
         */
        getElementHeight:function(el){
            var $el = $(el);
            var paddingTop = parseInt($el.css("padding-top")) || 0;
            var paddingBottom = parseInt($el.css("padding-bottom")) || 0;
            return $el.height() + paddingTop + paddingBottom;
        },

        /**取消绑定点击空白自动消失
        *@param {Object} options 参数集合
        *@param {String} options.action 执行什么行为自动关闭菜单，可以是click|mouseout(注意这里是全局的)，默认是click
        *@param {HTMLElement} options.element 菜单元素节点
        */
        unBindAutoHide: function (options) {
            if (!options.element) return;
            $(options.element).attr("bindAutoHide", "0");
            if (options.element.autoHideHandler) {
                M139.Event.GlobalEvent.off(options.action, options.element.autoHideHandler);
                options.element.autoHideHandler = null;
            }
        },
        /**工具函数，根据坐标，判断一个dom元素或一个点在屏幕中所处的方位（象限）
        *example
        $D.getDirection(documentElementById("div1"))
        $D.getDirection({left:100,top:100})
        */
        getQuadrant: function (elem) {
            var pos;
            var win = window;
            if ("left" in elem) { //是坐标点
                pos = elem;
            } else { //是dom元素
                pos = $(elem).offset();
                win = $(elem)[0].ownerDocument;
            }

            var w = $(win).width();
            var h = $(win).height();
            var center = { left: (w / 2), top: (h / 2) };//党中央的坐标

            if (pos.left <= center.left && pos.top <= center.top) {
                return 2;//"UpLeft"左上，第二象限
            } else if (pos.left >= center.left && pos.top <= center.top) {
                return 1;//"UpRight"右上，第一象限
            } else if (pos.left <= center.left && pos.top >= center.top) {
                return 3;//"LeftDown"左下，第三象限
            } else if (pos.left >= center.left && pos.top >= center.top) {
                return 4;// "RightDown" 右下，第四象限
            }

        },

        /**
         *将元素根据坐标停靠在目标元素边,比如弹出菜单(默认定位在正下方,可优化)
         *@param {HTMLElement} targetElement 目标元素（固定）
         *@param {HTMLElement} dockElement 要定位的元素
         *@param {Object} options 预留选项
         *@param {String} options.direction 方向 取值范围 auto:四个方向自适应,leftRight:左右自适应,upDown：上下自适应（默认值）,up:固定向上，down:固定向下,left:固定向左,right:固定向右
         *@param {Number} options.margin 空白边距，默认为0
         @example
         $D.dockElement($("#div1")[0],$("#div2")[0],{direction:"auto",margin:10})
         */
        dockElement: function (targetElement, dockElement, options) {
            options = options || {};
            var map = { //定义map是为了防止多条件排列组合产生大量if分支
                1: { //处于第一象限
                    auto: "leftDown",//左下
                    leftRight: "left", //向左
                    upDown: "down" //向下
                },
                2: { //处于第二象限
                    auto: "rightDown",
                    leftRight: "right",
                    upDown: "down"
                },
                3: { //处于第三象限
                    auto: "rightUp",
                    leftRight: "right",
                    upDown: "up"
                },
                4: { //处于第四象限
                    auto: "leftUp",
                    leftRight: "left",
                    upDown: "up"
                }
            };
            var direction;
            if (!options.direction) { //设置默认值
                options.direction = "upDown";
            }

            if (options.direction == "auto" || options.direction == "leftRight" || options.direction == "upDown") {
                var direction = map[this.getQuadrant(targetElement)][options.direction];
            } else { //指定单个方向
                direction = options.direction;
            }
            dockToDirection(direction);
            return direction;//因为要根据定位改变样式，所以外面要知道方位（比如箭头位置）
            function dockToDirection(direction) {
                var jTarget = $(targetElement);
                var jDock = $(dockElement);
                var offset = jTarget.offset();
                var margin = options.margin || 0;//空隙
                var left = offset.left;
                var top = offset.top;
                var offset = {
                    "up": offset.top - M139.Dom.getElementHeight(jDock) - margin,
                    "down": offset.top + jTarget.height() + margin,
                    "left": offset.left - jDock.width() - margin,
                    "right": offset.left + jTarget.width() + margin
                };
                switch (direction) {
                    case "up":
                        top = offset["up"];
                        break;
                    case "down":
                        top = offset["down"];
                        break;
                    case "left":
                        left = offset["left"];
                        break;
                    case "right":
                        left = offset["right"];
                        break;
                    case "leftUp":
                        left = offset["left"];
                        top = offset["up"];
                        break;
                    case "leftDown":
                        left = offset["left"];
                        top = offset["down"];
                        break;
                    case "rightUp":
                        left = offset["right"];
                        top = offset["up"];
                        break;
                    case "rightDown":
                        left = offset["right"];
                        top = offset["down"];
                        break;
                }
                
                left += options.dx|0;
                top += options.dy|0;
                
				// bugfix: 最终的位置是相对jDock的offsetParent计算出来的
				// 因此，jTarget的offset的计算也要相对于jDock的offsetParent
                var parentOffset = jDock.offsetParent().offset();
                left -= parentOffset.left;
                top -= parentOffset.top;

                jDock.css({
                    position : "absolute",
                    left: left + "px",
                    top: top + "px"
                });
            }

            return direction;
        },
        /**
         *当一个html元素里面有多个节点的时候，使用innerText会覆盖掉其它子元素，此函数可以只设置子文本节点的文字
         *@example
         &lt;a&gt;&lt;i /&gt;text&lt;/a&gt;
         M139.Dom.setTextNode(obj,"hehe");
         &lt;a&gt;&lt;i /&gt;text&lt;/a&gt;
         */
        setTextNode: function (el, text) {
            el = this.isHTMLElement(el) ? el : el[0];
            for (var i = 0; i < el.childNodes.length; i++) {
                if (el.childNodes[i].nodeType == 3) {//文本节点
                    el.childNodes[i].nodeValue = text;
                    break;
                }
            }
        },
        /**
         *判断是否原生的html元素，非jq托管对象
         */
        isHTMLElement: function (el) {
            return Boolean(el && el.getAttribute);
        },
        /**
         *使元素闪烁，通常用在文本框上，比如提示用户文本框需要填值，联系人重复等
         */
        flashElement: function (element, options) {
            var heightLineColor = "#FE9";
            var jEl = $(element);
            if (!/INPUT|TEXTAREA/.test(jEl[0].tagName)) {
                jEl = jEl.find("*").add(jEl);
            }
            var count = 0;
            var timer = setInterval(function () {
                count++;
                if (count % 2 == 1) {
                    jEl.css("background-color", heightLineColor);
                } else {
                    jEl.css("background-color", "");
                }
                if (count > 5) {
                    clearInterval(timer);
                }
            }, 100);
        },

        /**
         * 文本框获得焦点并定位光标到末尾
         * <pre>示例：<br>
         * <br>Utils.focusTextBox(document.getElementById("text"));
         * </pre>
         * @param {Object} objTextBox 必选参数，文档框对象。
         * @return{无返回值}
         */
        focusTextBox: function(objTextBox){
            try{
                if(document.all){
                    var r =objTextBox.createTextRange();
                    r.moveStart("character",objTextBox.value.length);
                    r.collapse(true);
                    r.select();
                }else{
                    objTextBox.setSelectionRange(objTextBox.value.length,objTextBox.value.length);
                    objTextBox.focus();
                }
            }catch(e){}
        },
        /**
         *修复因移除带文本框的浮层而使光标丢失的问题
         */
        fixIEFocus: function (bFocus) {
            //修复光标丢失问题
            if (bFocus || M139.Browser.is.ie) {
                try {
                    if (!top.ghostInput) {
                        top.ghostInput = top.$('<input type="text" style="height:1px;wdith:1px;position:absolute;left:0px;top:0px;"/>').appendTo(top.document.body);
                    }
                    top.ghostInput.focus().blur();
                } catch (e) { }
            }
        },

        /**
         *将原来的dom元素拆除，在原来的节点位置重新生成一个，目的是为了解除原来的事件绑定
         *@param {Object} obj 目标元素，jq对象或者HtmlElement对象
         */
        rebuildDom: function (obj) {
            try{
                if (this.isJQueryObj(obj)) {
                    obj.each(function () {
                        var node = this.cloneNode(true);
                        $(this).replaceWith(node);
                    });
                } else {
                    var node = obj.cloneNode(true);
                    $(obj).replaceWith(node);
                }
            } catch (e) { }
        },

        /**
         *判断一个对象是否为jQuery对象实例
         */
        isJQueryObj:function(obj){
            return Boolean(obj instanceof jQuery || (obj && obj.jquery));
        },

        /**
         *设置文本框输入长度，向下兼容
         */
        setTextBoxMaxLength: function (textbox, maxLength) {
            var jq = $(textbox);

            // 360浏览器选择文档ie11 + 文本ie7模式会抛出异常
            try {
                jq.attr("maxLength", maxLength);
            } catch (e) {}
            
            var _ks = M139.Event.KEYCODE;
            var _cks = [_ks.BACKSPACE, _ks.DELETE, _ks.UP, _ks.DOWN, _ks.LEFT, _ks.RIGHT];
            if ($B.is.ie && $B.getVersion() <=9) {
                //限制描述的文字
                jq.keydown(function (e) {
                    if (this.value.length >= maxLength) {
                        if (_.indexOf(_cks, e.keyCode) == -1) {
                            return false;
                        }
                    }
                }).bind("paste", function () {
                    if (this.value.length >= maxLength) {
                        return false;
                    }
                });
            }
        },

        appendHTML:function(el,html){
            if (el.insertAdjacentHTML) {
                el.insertAdjacentHTML("beforeEnd", html);
            } else {
                $(el).append(html);
            }
        },

        getHTMLElement: function(el){
            if (typeof (el) === "string") {
                return $(el)[0];
            } else if (this.isJQueryObj(el)) {
                return el[0];
            } else {
                return el;
            }
        },
        _getGhostDiv: function () {
            var self = this;
            if (!this._ghostDiv) {
                var html = "<div style='position:absolute;width:100%;height:100%;left:0px;top:0px;visibility: hidden;'></div>";
                this.appendHTML(document.body, html);
                var div = this._ghostDiv = document.body.lastChild;
                $(window).resize(function () {
                    delete self.cacheHeight;
                    delete self.cacheWidth;
                });
            }
            return this._ghostDiv;
        },
        getWinHeight:function(){
            var pageHeight = window.innerHeight; 
            if (typeof pageHeight != "number") {
                if (this.cacheHeight) {
                    pageHeight = this.cacheHeight;
                } else {
                    this.cacheHeight = pageHeight = this._getGhostDiv().offsetHeight;
                }
            }
            return pageHeight;
        },
        getWinWidth: function () {
            var pageWidth = window.innerWidth;
            if (typeof pageWidth != "number") {
                if (this.cacheWidth) {
                    pageWidth = this.cacheWidth;
                } else {
                    this.cacheWidth = pageWidth = this._getGhostDiv().offsetWidth;
                }
            }
            return pageWidth;
        },
        /**
         * 对本地存储简单封装
         */
        storage: {

            /**
             * 保存数据到本地存储
             * @param {String} key 数据的键
             * @param {HTMLElement} 数据的值
             * @return {Boolean} 是否成功
             */
            save: function(key, value) {
                if (!$B.support.storage()) {
                    return false;
                }

                try {
                    return localStorage.setItem(key, value);
                } catch (e) {
                    return false;
                }
            },

            /**
             * 本地存储中是否存在某个键，（不支持的浏览器均返回false）
             * @param {String} key 数据的键
             * @return {Boolean} 是否存在
             */
            exists: function (key) {
                if (!$B.support.storage()) {
                    return false;
                }
                for (var i=0; i<localStorage.length; i++){ if (localStorage.key(i) == key) { return true; } }; return false; //ignore jslint
            },

            /**
             * 从本地存储中移除
             * @param {String} key 数据的键
             * @return {Boolean} 是否成功
             */
            remove: function(key){
                if (!$B.support.storage()) {
                    return false;
                }

                if (!this.exists(key)) {
                    return true;
                }

                return localStorage.removeItem(key);
            }

        },

        
        /**
         * 设置textarea的高度自适应
         * 该做的不该做的都做了.此方法未经过测试不要直接调用就上线
         * @param {Object} textarea 控件,jq对象
         * @param {Object} options 参数,可选.
         * <pre>示例：<br>
         * <br>
         * M139.Dom.setTextAreaAdapte($("#textareaId), //textarea的jq对象
         * {
         *     width: "500px", //宽度
         *     maxrows:5, //可选,最大行数,超过行数出现滚动条,如果为<=0则表示一直自适应
         *     maxlength:200, //可选,可输入的最大字符串数量
         *     placeholder:'', //可选,未输入内容时的提示语
         *     defaultcolor:'#333', //可选,默认的字体颜色(非placeholder态),如果没传,则从textarea中读取css中的color
         *     defaultheight:"50px" //可选,textarea的默认高度
         * });
         * </pre>
         */
        setTextAreaAdaptive: function (textarea, options) {
            if (!textarea) return;

            var _this = this,
                mimics = _this.mimics,
                dom, div,
                maxlength,
                isIE = !!$.browser.msie;

            options = options || {};

            maxlength = options.maxlength || textarea.attr("maxlength") || Number.MAX_VALUE;
            var defaultheight = options.defaultheight || 0; //默认高度

            //#region 创建模拟元素
            //创建模拟的div
            dom = $("<div />").css({ 'position': 'absolute', 'display': 'none', 'word-wrap': 'break-word', 'white-space': 'pre-wrap' });
            textarea.css({ "overflow-y": "hidden", "overflow-x": "hidden", "resize": "none" });
            div = dom.appendTo(textarea.parent());

            //复制textarea的样式到div上
            var i = mimics.length;
            while (i--) {
                div.css(mimics[i].toString(), textarea.css(mimics[i].toString()));
            }
            //#endregion

            //要在div复制样式之后，否则height也会被复制过去，导致不能自适应高度
            if (!!defaultheight) {
                textarea.css ("height", defaultheight); //如果设定了默认高度
                defaultheight = parseInt(defaultheight, 10) || 0; //如 "79px"
            }

            //#region 绑定事件
            function changeSync() {
                var lineheight, lines,
                    maxheight, minheight,
                    textareaheight = textarea.height(),
                    divheight = div.height();

                lineheight = parseInt(div.css("padding-top"), 10) +
                                isIE ? parseInt(div.css("padding-bottom"), 10) : 0 + //IE加上bottom
                                (parseInt(div.css("line-height"), 10) || parseInt(div.css("font-size"), 10));

                if (textareaheight !== divheight && defaultheight < divheight) {
                    textarea.height(Math.max(divheight, lineheight));
                }

                if (divheight < defaultheight) {//textarea最小行高
                    textarea.height(defaultheight);
                }

                if (!!options.maxrows) {
                    lines = Math.floor(div.height() / lineheight); //粗略计算行数

                    if (lines > options.maxrows) { //超过了设置的最大行数,则出现滚动条
                        maxheight = options.maxrows * lineheight;
                        div.css({ "height": maxheight, "overflow-y": "auto" }); //css高度无效？？？
                        textarea.css({ "height": maxheight, "overflow-y": "auto" });

                        textarea.scrollTop(maxheight);
                        setTimeout(function () { textarea.height(maxheight); }, 0xf);
                    }
                }
            }

            textarea.bind("input keydown cut paste change blur", function (e) {
                if (_.indexOf([16, 17, 18, 20], e.keyCode) >= 0) return; //shift,ctrl,alt,TAB
                var text = textarea.val();
                if (text.length >= maxlength) {
                    e.stopPropagation();
                    return false;
                }

                if (e.type == "paste" && isIE) {
                    //IE不触发paste,延迟之后触发input,chrome自动会触发input事件
                    setTimeout(function () {
                        textarea.trigger("input");
                    }, 0xf);
                    return;
                }

                var str = $T.Html.encode(text).replace(/\r/g, "<br />").replace(/\n/g, "<br />");

                div.html(str);
                changeSync();
            });

            if (options.placeholder) {
                _this.setPlaceholder(textarea, { placeholder: options.placeholder, defaultcolor: options.defaultcolor });
            }
            //#endregion

            setTimeout(function () { textarea.trigger("change"); }, 250);
        },
        //用于将textarea的样式复制给div
        mimics: [
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'fontSize',
            'lineHeight',
            'fontFamily',
            'width',
            'fontWeight',
            'border-top-width',
            'border-right-width',
            'border-bottom-width',
            'border-left-width',
            'borderTopStyle',
            'borderTopColor',
            'borderRightStyle',
            'borderRightColor',
            'borderBottomStyle',
            'borderBottomColor',
            'borderLeftStyle',
            'borderLeftColor'
        ],
        /**
         * 手工实现HTML5的placeholder属性
         * 只支持input和textarea
         */
        setPlaceholder: function (dom, options) {
            var _this = this;
            if (!dom) return;

            if (!_this.isSupportPlaceholder()) {
                var placeholder = options.placeholder,
                dom = $(dom), //转成jq对象
                color = "#ababab", //placeholder的颜色,局部存吧
                defaultcolor = options.defaultcolor || dom.css("color"); //控件的默认颜色

                if (!placeholder) return; //空格的话就不绑定了

                dom.bind("focus", function () {
                    var text = dom.val();
                    if ($(this).data("placeholder") && text === placeholder) { //通过标记位来识别是否在placeholder模式,而不是字符串长度
                        dom.val("").css("color", defaultcolor);
                    }

                }).bind("blur", function () {
                    var text = dom.val();
                    if (text.length === 0) {
                        dom.val(placeholder).css("color", color);
                        dom.data("placeholder", true); //标记:手工placeholder模式
                    } else {
                        dom.data("placeholder", false); //非placeholder模式,即允许用户输入跟placeholder一样的字符串
                    }
                });

                setTimeout(function () { dom.trigger("blur"); }, 0xff);
            } else {
                dom.attr("placeholder", options.placeholder);
                dom.css({ color: options.defaultcolor });
            }
        },
        /**
         * 是否支持placeholder属性
         */
        isSupportPlaceholder: function () {
            return 'placeholder' in document.createElement("input");
        }

    };
    window.$D = M139.Dom;
})(jQuery, M139);