/**
* @fileOverview 定时器作用非常大，但是滥用会造成性能问题，此模块封装与setInterval相关使用的问题
该模块还需要重构
timing调用参数太简单，应该可以定制运行几次，什么时候自动清除等
*/

(function () {
    /**
    *定义DOM操作相关的常用方法的静态类，缩写为$D
    *@namespace
    *@name M139.Timing
    */
    M139.Timing =
    /**@lends M139.Timing */
    {
        /**
        *等待，当Boolean(eval(query))返回true的时候，执行回调
        */
        waitForReady: function (query, callback) {
            var tryTimes = 0;
            var done = false;
            checkReady();
            if (!done) {
                var intervalId = this.setInterval("M139.Timing.waitForReady", checkReady, 300);
            }
            var self = this;
            function checkReady() {
                tryTimes++;
                try {
                    if($.isFunction(query)){
                        var result = query();
                    }else{
                        var result = eval(query);
                    }
                    if (result) {
                        done = true;
                        if (intervalId) {
                            self.clearInterval(intervalId);
                        }
                    }
                } catch (e) {}
                //对象尚不可用
                if (done || tryTimes > 100) {
                    if (intervalId) self.clearInterval(intervalId);
                    if (callback) {
                        callback();
                    }
                }
                //console.log(new Date().format("hh:mm:ss") + ";waitForReady:" + done + ",query:" + query);
            }
        },
        /**
        请使用 M139.Iframe.checkIframeHealth(options);
        */
        makeSureIframeReady: function (options) {
            return M139.Iframe.checkIframeHealth(options);
        },

        /**
        *在一些浏览器中，隐藏掉的元素滚动条会被重置，在读信、邮件列表的时候需要让元素保持滚动条的位置
        */
        watchElementScroll: function (dom) {
            //IE8以下没必要
            if ($.browser.msie && $.browser.version < 8) return;
            dom.lastScrollTop = dom.scrollTop;
            var hasHidden = false;
            var timer = this.setInterval("M139.Timing.watchElementScroll", function () {
                if (isRemove(dom)) {
                    M139.Timing.clearInterval(timer); //如果元素已被移除，则取消监控
                    return;
                }
                if (isShow(dom)) {
                    if (hasHidden) {
                        //重置高度
                        dom.scrollTop = dom.lastScrollTop;
                        hasHidden = false;
                    } else {
                        //记住当前滚动位置
                        dom.lastScrollTop = dom.scrollTop;
                    }
                } else {
                    hasHidden = true; //元素被隐藏过了
                }
            }, 500);
            function isShow(dom) {
                while (dom) {
                    if (dom.style && dom.style.display == "none") return false;
                    dom = dom.parentNode;
                }
                return true;
            }
            function isRemove(dom) {
                try {
                    while (dom) {
                        if (dom.tagName == "BODY") return false;
                        dom = dom.parentNode;
                    }
                } catch (e) {
                    return true;
                }
                return true;
            }
        },

        /**
        *设置iframe根据页面中的高度自动变高
        */
        watchIframeHeight: function (iframe,settime,isHideQuote) {
            //console.log(settime);
            var setTime = settime || 1000;
            var count = 0;
			var reduceHeight = isHideQuote ? 40 : 0;
			if(reduceHeight && ( ($B.is.ie && $B.getVersion() == 8) || $B.is.firefox )){
				reduceHeight = 30;
				setTime = 10;
			}
			
            var timer = this.setInterval(
                "M139.Timing.watchIframeHeight",
                function () {
                    if ($D.isRemove(iframe)) {
                        clear();
                    } else {
                        if ($D.isHide(iframe)) return;
                        checkResize();
                        count++;
                        if (count == 2) {
                            jQuery("img", iframe.contentWindow.document).bind("load", function () {
                                $(this).unbind("load", arguments.callee);
                                checkResize();
                            });
                            clear();//2次之后不再触发，只由图片加载触发
                        }
                    }
                },
                setTime
            );
            function checkResize(){
                var frmDoc = iframe.contentWindow.document;
                var frmBody = frmDoc.body;
                //console.log("frmBody.scrollHeight:" + frmBody.scrollHeight + ",iframe.offsetHeight:" + iframe.offsetHeight);
                if (frmBody.scrollHeight > iframe.offsetHeight) {
                    iframe.style.height = (frmBody.scrollHeight + 35 - reduceHeight).toString() + "px";
                    //frmBody.style.overflowX = "hidden";
                    if ($.browser.msie && $.browser.version < 7.0) {
                        //frmDoc.getElementsByTagName("html")[0].style.overflowX = "hidden";
                    }
                }
            }
            function clear() {
                M139.Timing.clearInterval(timer);
            }
        },
        /**监听文本框内容变化*/
        watchInputChange:function(input,callback,options){
            var oldValue = input.value;
            var timer = this.setInterval(
                "M139.Timing.watchInputChange",
                check,
                1000);
            function clear() {
                M139.Timing.clearInterval(timer);
            }
            $(input).keydown(check).keyup(check);;
            function check(e) {
                if (input.value !== oldValue) {
                    oldValue = input.value;
                    if ($.isFunction(callback)) callback.call(input, e);
                }
            }
        },

        /**
        *取代原生setInterval的使用，使同一类的func可以共享一个计时器，对于大量制造setInterval的业务可以使用，其它情况下不建议使用
        *name相同的timer将会共享一个setInterval,由于添加的时机不同，所以第一次执行func的时间不固定，但是总的周期是固定的
        *回调func的时候会使用try{}catch(e){} 因此不会产生异常
        */
        setInterval: function (name, func, interval) {
            var timer = this.timerMap[name];

            if (!timer) {
                timer = this.timerMap[name] = new M139.Timing.Timer(name, interval);
            }
            var id = timer.addHandler(func);
            return id;
        },
        clearInterval: function (id) {
            if (!id) return;
            var name = id.split("_")[0];
            var timer = this.timerMap[name];
            if (timer) {
                timer.removeHandler(id);
            }
        },
        /**
        *timer托管列表
        *@inner
        */
        timerMap: {}
    }
    /**
    *timer对象类
    *@inner
    */
    M139.Timing.Timer = function (name, interval) {
        this.name = name;
        this.interval = interval;
        var list = {};
        this.addHandler = function (func) {
            var id = name + "_" + Math.random();
            list[id] = func;
            return id;
        }
        this.removeHandler = function (id) {
            delete list[id];
        }
        this.timerId = setInterval(function () {
            for (var p in list) {
                try {
                    list[p]();
                } catch (e) { }
            }
        }, interval);
    }
    $Timing = M139.Timing;
})();