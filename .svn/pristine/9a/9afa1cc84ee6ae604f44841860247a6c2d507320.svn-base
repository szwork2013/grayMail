﻿/**
 * @fileOverview 定义DOM事件相关的常用方法的静态类
 */

(function (jQuery, Backbone, M139) {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$Event
    *@namespace
    *@name M139.Event
    */
    M139.Event = {
        /**
        *老版本的代码，根据dom处理参数的上下文找到event参数，兼容多浏览器
        *@example
        document.onclick = function(e){
            e = M139.Event.getEvent(e);//或者 M139.Event.getEvent()
        }
        */
        getEvent: function (A) {
            var evt = A || window.event;
            if (!evt) {
                var arr = [], C = this.getEvent.caller;
                while (C) {
                    evt = C.arguments[0];
                    if (evt && (evt.constructor.target || evt.srcElement)) {
                        break;
                    }
                    var B = false;
                    for (var D = 0; D < arr.length; D++) {
                        if (C == arr[D]) {
                            B = true;
                            break;
                        }
                    }
                    if (B) {
                        break;
                    } else {
                        arr.push(C);
                    }
                    C = C.caller;
                }
            }
            return evt;
        },

        /**
        *同时取消事件冒泡，以及默认行为，即：stopPropagation和preventDefault，兼容IE
        *@example
        document.onclick = function(e){
            M139.Event.stopEvent(e);
        }
        */
        stopEvent: function (e) {
            if (!e) {
                e = this.getEvent();
            }
            if (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }
        },

        /**
         *keycode常量，会根据浏览器做兼容
         *@filed
         */
        KEYCODE: {//浏览器版本不一样 keyCode会不一样
            A:65,
            C:67,
            X:88,
            V:86,
            UP: 38,
            DOWN: 40,
            ENTER: 13,
            SPACE: 32,
            TAB: 9,
            LEFT: 37,
            RIGHT: 39,
            DELETE:46,
            BACKSPACE:8,
            //分号
            SEMICOLON: ($.browser.mozilla || $.browser.opera) ? 59 : 186,
            //逗号
            COMMA: 188,
            Esc:27
        }

    };

    M139.Event.GlobalEventManager = Backbone.Model.extend(
    /**@lends M139.Event.GlobalEventManager.prototype*/
    {
        /**
        *全窗口dom鼠标键盘事件帮助类,可以一次监听所有窗口的鼠标、键盘事件（前提是该窗口引用了此文件）
        *@constructs M139.Event.GlobalEventManager
        *@example
        $GlobalEvent.on("click",function(e){
            e.window;
            e.event
        });
        */
        initialize: function (options) {
            var This = this;
            options = options || {};
            var win = options.window || window;

            jQuery(win.document).bind("click", function (e) {
                This.triggerEvent("click", { window: win, event: e });
            }).bind("mousemove", function (e) {
                This.triggerEvent("mousemove", { window: win, event: e });
            }).bind("mouseup", function (e) {
                This.triggerEvent("mouseup", { window: win, event: e });
            }).bind("keydown", function (e) {
                This.triggerEvent("keydown", { window: win, event: e });
            });
        },

        /**@inner*/
        triggerEvent: function (eventName, eventData) {
            try {
                var g =  this.getTopManager();
                g.trigger(eventName, eventData);
            } catch (e) { }
        },

        /**@inner*/
        getTopManager: function () {
            var item = this;
            var win = this.get("window")|| window;;
            try {
                //while (win.parent) {
                //    if (win.$GlobalEvent) {
                //        item = win.$GlobalEvent;
                //    }
                //    if (win == win.top) break;
                //    win = win.parent;
                //}

                for (var i = 0; i < 0xFF; i++) {
                    if (win.parent) {
                        if (win.$GlobalEvent) {
                            item = win.$GlobalEvent;
                        }

                        if (win == win.top) {
                            break;
                        }

                        win = win.parent;
                    }
                }

            } catch (e) { }
            return item;
        },

        /**
         *重写了Backbone.Model的on方法，增加try{}catch(e){}
         *@param {String} eventName 监听事件名，现在支持click，mousemove，keydown
         *@param {Function} handler 处理回调，这里内部加了异常捕获，不会抛出异常（防止其它回调被中断）
         */
        on: function (eventName, handler, catchError) {
            var topObj = this.getTopManager();
            if(this !== topObj){
                return topObj.on.apply(topObj,arguments);
            }
            if (catchError !== false) {
                var This = this;
                var newHandler = function () {
                    try {
                        handler.apply(this, arguments);
                    } catch (e) {
                        //出错一次就会移除
                        //This.off(eventName, arguments.callee);
                    }
                };
            } else {
                newHandler = handler;
            }
            Backbone.Model.prototype.on.apply(this, [eventName, newHandler]);
            return newHandler;
        },
        off: function (eventName, handler) {
            var topObj = this.getTopManager();
            if (this !== topObj) {
                return topObj.off.apply(topObj, arguments);
            }
            return Backbone.Model.prototype.off.apply(this, arguments);
        }

    });

    //定义缩写
    window.$Event = M139.Event;
    window.$GlobalEvent = M139.Event.GlobalEvent = new M139.Event.GlobalEventManager();


})(jQuery, Backbone, M139);