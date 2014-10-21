/**
 * @fileOverview 定义ViewBase基类.
 */

(function (jQuery, M139) {
    var $ = jQuery;
    /**
   *@namespace
   */
    M139.View = {};

    M139.View.ViewBase = Backbone.View.extend(
    /**
    *@lends M139.View.ViewBase.prototype
    */
    {
        /**
        *所有View的基类,主要为了统一常用事件、方法的命名
        *@constructs M139.View.ViewBase
        *@require M139.Dom
        *@require M139.Logger
        *@param {Object} options 参数集合
        *@param {Object} options.events 是一个{key:function}集合，监听自定义事件
        *@param {String} options.hides 表示要隐藏的节点路径
        *@param {Object} options.replaceInnerText 是一个{key:function}集合，表示要替换的节点路径以及对应文本
        *@param {Object} options.replaceInnerHTML 是一个{key:function}集合，表示要替换的节点路径以及对应html
        *@example
        var view = new M139.View.ViewBase({
            events:{
                hide:function(){
                    alert("I'm on hide！");
                }
            }
        });
        */
        initialize: function (options) {
            if (!options) {
                options = {};
            }

            //监听事件
            if (options.events) {
                for (var e in options.events) {
                    this.on(e, options.events[e]);
                }
            }
            //设置初始化样式
            var style = options.style || this.style;
            if (style && this.el) {
                if (jQuery.browser.msie) {
                    this.el.style.cssText = style;
                } else {
                    this.$el.attr("style", style);
                }
            }

            if (options.width) {
                this.$el.width(options.width);
            }
            if (options.height) {
                this.$el.height(options.height);
            }

            /**
             *关联一个日志对象，日志的name关联此类的name，一般只在继承类里使用
             *@field
             *@type {M139.Logger}
            */
            this.logger = new M139.Logger({
                name: options.name || this.name
            });

            if (!this.id && !(this.el && this.el.id)) {
                this.id = this.getRandomId();
                if (this.el) {
                    this.el.id = this.id;
                }
            }

            M139.View.registerView(this.id, this);
        },

        name: "M139.View.ViewBase",

        /**
        *生成view的dom节点，具体由子类去实现，同时触发remove事件
        */
        render: function () {
            var This = this;

            if(this.rendered){
                return this;
            }

            this.rendered = true;

            var options = this.options;

            //要替换的innerText的节点
            if (options.replaceInnerText) {
                $.each(options.replaceInnerText, function (path, innerText) {
                    This.$(path).text(innerText);
                });
            }

            //要替换的innerHTML的节点
            if (options.replaceInnerHTML) {
                $.each(options.replaceInnerHTML, function (path, innerHTML) {
                    This.$(path).html(innerHTML);
                });
            }

            //要隐藏的节点
            if (options.hides) {
                this.$(options.hides).hide();
            }
            //要隐藏的节点
            if (options.shows) {
                this.$(options.shows).css("display", "");
            }

            /**
            *容器dom生成
            *@event 
            *@name M139.View.ViewBase#render
            */
            this.trigger("render");
            /**
            *假设对象调用render函数后随即添加到dom中，在下一个时间片触发print
            *@event 
            *@name M139.View.ViewBase#print
            */
            setTimeout(function () {
                This.trigger("print");
            }, 0);
            return this;
        },

        /**
        *移除view的dom，即：this.$el.remove()，同时触发remove事件
        */
        remove: function () {
            this.$el.remove();
            /**
             *表示view是否已被移除
             *@field
             *@type {Boolean}
             */
            this.isRemoved = true;
            /**
            *View容器被移除后产生的事件
            *@event 
            *@name M139.View.ViewBase#remove
            */
            this.trigger("remove");
            return this;
        },

        /**
        *显示view的dom，即：this.$el.show()，同时触发show事件
        */
        show: function () {
            this.$el.show();
            /**
            *调用show方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#show
            */
            this.trigger("show");
            return this;
        },

        /**
        *隐藏view的dom，即：this.$el.hide()，同时触发hide事件
        */
        hide: function () {
            this.$el.hide();
            /**
            *调用hide方法后产生的事件
            *@event 
            *@name M139.View.ViewBase#hide
            */
            this.trigger("hide");
            return this;
        },

        /**
        *判断view是否隐藏掉了，即display:none
        *@param {Boolean} bubblingParent 此参数为true的话则判断节点所在父元素是否可见
        */
        isHide: function (bubblingParent) {
            return $D.isHide(this.el, bubblingParent);
        },

        /**
        *获得view的el的高度，即：this.$el.height()
        */
        getHeight: function () {
            return this.$el ? this.$el.height() : 0;
        },

        /**
        *获得view的el的宽度，即：this.$el.width()
        */
        getWidth: function () {
            return this.$el ? this.$el.width() : 0;
        },

        /**
        *设置view的el的宽度，即：this.$el.width(width)，同时触发resize事件
        */
        setWidth: function (width) {
            return this.setSize(width, null);
        },

        /**
        *设置view的el的高度，即：this.$el.height(height)，同时触发resize事件
        */
        setHeight: function (height) {
            return this.setSize(null, height);
        },

        /**
        *设置view的el的坐标，即left和top，同时触发move事件
        */
        setPosition: function (left, top) {
            if (this.$el) {
                this.$el.css({
                    left: left,
                    top: top
                });
                /**
                *调用setPosition方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#move
                */
                this.trigger("move");
            }
            return this;
        },

        /**
        *设置view的el的宽高，同时触发resize事件
        */
        setSize: function (width, height) {
            if (this.$el) {
                if (width || width === 0) {
                    this.$el.width(width);
                }
                if (height || height === 0) {
                    this.$el.height(height);
                }
                /**
                *调用setSize方法后产生的事件
                *@event 
                *@name M139.View.ViewBase#resize
                */
                this.trigger("resize");
            }
            return this;
        },

        /**
        *希望子类在修改html内容的时候主动调用，会触发update事件
        */
        onUpdate: function () {
            /**
            *html内容变更后产生的事件
            *@event 
            *@name M139.View.ViewBase#update
            */
            this.trigger("update");
        },

        /**
        *获得view的容器dom对象
        */
        getEl: function () {
            return this.el;
        },

        /**
        *获得view的容器dom jq对象
        */
        get$El: function () {
            return this.$el;
        },

        /**
        *获得view的id
        */
        getId: function () {
            return this.el.id;
        },

        /**
        *随机产生一个view id
        */
        getRandomId: function () {
            return "view_" + Math.random();
        },

        /**
        *设置el的innerHTML内容,同时触发update事件
        */
        setHtml: function (html) {
            if (this.el) {
                this.el.innerHTML = html;
                this.onUpdate();
            }
        }

    });
    //扩展静态函数
    $.extend(M139.View,
    /**@lends M139.View*/
    {
        /**
        *根据view的id返回一个view的引用，常用于内联html
        *@param {String} id 继承自M139.View.ViewBase的对象的id
        *@example
        var html = "&lt;input value=\"按钮\" onclick=\"M139.View.getView('{id}').doSomething()\" /&gt;";
        */
        getView: function (id) {
            return this.AllViews[id] || null;
        },

        /**
        *全局的View容器，以后可能用Backbone容器替代
        */
        AllViews: {},

        /**
        *使用id注册全局View，便于在全局作用域调用
        *@param {String} id  继承自M139.View.ViewBase的对象的id
        *@param {M139.View.ViewBase} view 继承自M139.View.ViewBase的对象
        */
        registerView: function (id, view) {
            this.AllViews[id] = view;
        }
    });

})(jQuery, M139);