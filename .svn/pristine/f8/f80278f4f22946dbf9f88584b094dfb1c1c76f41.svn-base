/**
 * @fileOverview 定义翻页组件代码
 */

 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.PageTurning";
    M139.namespace(namespace,superClass.extend(
    /**@lends M2012.UI.PageTurning.prototype*/
    {
       /** 弹出菜单组件
        *@constructs M2012.UI.PageTurning
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {Number} options.pageCount 页数
        *@param {Number} options.pageIndex 初始化下标（第几页，从1开始）
        *@param {String} options.template 组件的html代码
        *@param {String} options.selectButtonTemplate 当有下拉按钮的时候，按钮的模板
        *@param {String} options.selectButtonInsertPath 下拉按钮插入的位置
        *@param {String} options.selectButtonPath 下拉按钮插入的位置
        *@param {String} options.nextButtonTemplate
        *@param {String} options.nextButtonInsertPath
        *@param {String} options.nextButtonPath
        *@param {String} options.prevButtonTemplate
        *@param {String} options.prevButtonInsertPath
        *@param {String} options.prevButtonPath
        *@param {String} options.pageNumberButtonTemplate
        *@param {String} options.pageNumberButtonInsertPath
        *@param {String} options.pageNumberButtonPath
        *@param {String} options.pageNumberContentPath
        *@param {String} options.maxPageButtonShow 一次最多显示几个1,2,3按钮
        *@example
        var pt = new M2012.UI.PageTurning({
            template:'&lt;div class="blacklist-page"&gt;&lt;/div>',
            pageNumberButtonTemplate:'&lt;a rel="number" href="javascript:;"&gt;&lt;/a&gt;',
            pageNumberButtonPath:"a[rel='number']",
            prevButtonTemplate:'&lt;a rel="prev" href="javascript:;"&gt;上一页&lt;/a&gt;',
            prevButtonPath:"a[rel='prev']",
            nextButtonTemplate:'&lt;a rel="next" href="javascript:;"&gt;下一页&lt;/a&gt;',
            nextButtonPath:"a[rel='next']",
            numberButtonFocusClass:"on"
        });
        */
        initialize: function (options) {
            var $el = jQuery(options.template);
            this.setElement($el);
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        /**构建dom函数*/
        render:function(){
            var options = this.options;
            this.renderChildren(options);
            this.initEvent();
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *创建内容html
         *@inner
         */
        renderChildren:function(options){
            this.options.pageIndex = options.pageIndex;
            this.options.pageCount = options.pageCount;

            //如果有下拉页码按钮
            if (options.selectButtonTemplate) {
                this.$el.append(options.selectButtonTemplate);
                this.$(options.pageLabelPath).text(options.pageIndex + "/" + options.pageCount);
            }

            var showPrev = options.pageIndex > 1;
            var btnPrev = $(options.prevButtonTemplate);
            //插入上一页按钮
            if(options.prevButtonTemplate){
                if(options.prevButtonInsertPath){
                    btnPrev.appendTo(this.$el.find(options.prevButtonInsertPath));
                }else{
                    btnPrev.appendTo(this.$el);
                }
            }
            //如果不显示，可以消失或者灰显
            if (!showPrev) {
                if (options.disablePrevButtonClass) {
                    btnPrev.addClass(options.disablePrevButtonClass);
                } else {
                    btnPrev.hide();
                }
            }

            //如果有页码按钮
            if (options.pageNumberButtonPath) {
                //插入页码按钮
                if(options.pageCount > 1){
                    if(options.pageNumberButtonTemplate){
                        var pageNumberContainer = options.pageNumberButtonInsertPath ? this.$el.find(options.pageNumberButtonInsertPath) : this.$el;
                        var startPage = 1;
                        var endPage = options.pageCount;

                        //优化每次显示最佳的目标页码按钮
                        if(options.maxPageButtonShow && options.maxPageButtonShow < options.pageCount){
                            startPage = Math.max(options.pageIndex-2,1);
                            startPage = Math.min(startPage,options.pageCount - options.maxPageButtonShow + 1);
                            endPage = Math.min(startPage + options.maxPageButtonShow - 1,options.pageCount);
                        }
                    
                        for(var i=startPage;i<=endPage;i++){
                            var numberButton = jQuery(options.pageNumberButtonTemplate).appendTo(pageNumberContainer);
                            if(options.pageNumberContentPath){
                                numberButton.find(options.pageNumberContentPath).text(i);
                            }else{
                                numberButton.text(i);
                            }
                            numberButton.attr("index",i);
                        }
                    }
                }

                //当前页码获得焦点
                if(options.numberButtonFocusClass){
                    this.$el.find("*[index='" + options.pageIndex + "']").addClass(options.numberButtonFocusClass);
                }
            }

            var showNext = options.pageCount > 1 && options.pageIndex < options.pageCount;
            var btnNext = $(options.nextButtonTemplate);
            //插入下一页按钮
            if(options.nextButtonTemplate){
                if(options.nextButtonInsertPath){
                    btnNext.appendTo(this.$el.find(options.nextButtonInsertPath));
                } else {
                    btnNext.appendTo(this.$el);
                }
            }
            if (!showNext) {
                if (options.disableNextButtonClass) {
                    btnNext.addClass(options.disableNextButtonClass);
                } else {
                    btnNext.hide();
                }
            }
        },
        /**
         *绑定事件
         *@inner
         */
        initEvent:function(){
            var This = this;
            var options = this.options;
            if(options.pageNumberButtonPath){
                this.$el.find(options.pageNumberButtonPath).click(function(){
                    var index = this.getAttribute("index") * 1;
                    This.onNumberButtonClick(index);
                });
            }

            if(options.prevButtonPath){
                this.$el.find(options.prevButtonPath).click(function(){
                    This.onPrevButtonClick();
                });
            }

            if(options.nextButtonPath){
                this.$el.find(options.nextButtonPath).click(function(){
                    This.onNextButtonClick();
                });
            }

            if (options.selectButtonPath) {
                this.$(options.selectButtonPath).click(function () {
                    This.onSelectPageClick();
                });
            }
        },

        /**
         *程序控制强制翻页
         *@param {Number} pageIndex 更新当前页码
         *@param {Number} pageCount 可选参数，更新页数，
         *@param {Boolean} isSilent 可选参数，是否静默（即不触发pagechange），默认值为false
         *@example
         var pt = M2012.UI.PageTurning.create({
            pageIndex:1
            pageCount:20,
            maxPageButtonShow:5,
            container:$("#ddd")
         });
         pt.on("pagechange",function(pageIndex){
            console.log("点击了第"+pageIndex+"页");
         });
         pt.update(2);//翻到第二页
         */
        update: function (pageIndex, pageCount, isSilent) {
            this.$el.html("");

            pageCount = typeof(pageCount) == "number" ? pageCount : this.options.pageCount;

            var newOp = _.defaults({
                pageIndex: pageIndex,
                pageCount: pageCount
            }, this.options);

            this.renderChildren(newOp);
            this.initEvent();

            if(arguments.length == 2 && _.isBoolean(arguments[1])){
                isSilent = arguments[1];
            }

            if (!isSilent) {
                /**
                *翻页事件
                *@event 
                *@name M2012.UI.PageTurning#pagechange
                *@param {Number} index 页码
                */
                this.trigger("pagechange", pageIndex);
            }
        },
        /**@inner*/
        onSelectPageClick: function () {
            var This = this;
            //显示下拉菜单
            var popup = M139.UI.Popup.create({
                    target: this.$(this.options.selectButtonPath),
                    width: 135,
                    buttons: [{
                        text: "确定",
                        cssClass: "btnNormal",
                        click: function () {
                            var index = popup.contentElement.find("input:text").val();
                            if (/^\d+$/.test(index)) {
                                if (index > 0 && index <= This.options.pageCount) {
                                    This.onNumberButtonClick(parseInt(index));
                                } else if (index > This.options.pageCount) {
                                    //大于最大页,默认跳转到最后一页
                                    This.onNumberButtonClick(This.options.pageCount);
                                } else {
                                    //小于0,跳转到第一页(只能等于0,不能输入小于0的)
                                    This.onNumberButtonClick(1);
                                }
                            }
                            popup.close();
                        }
                    }],
                    content: '<div style="padding-top:15px;">跳转到第 <input type="text" style="width:30px;"/> 页</div>'
                }
			);
            popup.render();
            popup.contentElement.find("input:text").keyup(function (e) {
                this.value = this.value.replace(/\D/g, "");
            }).focus();
            M139.Dom.bindAutoHide({
                element: popup.contentElement[0],
                stopEvent: true,
                callback: function () {
                    popup.contentElement.remove();
                }
            });
        },
        /**@inner*/
        onNumberButtonClick:function(index){
            this.update(index);
        },
        /**@inner*/
        onPrevButtonClick:function(){
            var index = this.options.pageIndex - 1;
            if (index > 0) {
                this.update(index);
            }
        },
        /**@inner*/
        onNextButtonClick:function(){
            var index = this.options.pageIndex + 1;
            if (index <= this.options.pageCount) {
                this.update(index);
            }
        }
    }));

    jQuery.extend(M2012.UI.PageTurning,
    /**@lends M2012.UI.PageTurning*/
    {
        /**
         *创建一个分页组件的工厂方法
         *@param {Object} options 参数集合
         *@param {Number} options.pageCount 页数
         *@param {Number} options.pageIndex 初始化下标（第几页，从1开始）
         *@param {String} options.maxPageButtonShow 一次最多显示几个1,2,3按钮
         *@param {Object} options.styleTemplate 可选参数，模板风格，默认是:M2012.UI.PageTurning.STYLE1
         *@example
         var pt = M2012.UI.PageTurning.create({
            pageIndex:1
            pageCount:20,
            maxPageButtonShow:5,
            container:$("#ddd")
         });
         pt.on("pagechange",function(pageIndex){
            console.log("点击了第"+pageIndex+"页");
         });
         */
        create: function (options) {
            var styleIndex = options.styleTemplate || 1;
            var style = this["STYLE_" + styleIndex];
            options = _.defaults(options,style);
            var pt = new M2012.UI.PageTurning(options);
            pt.render().$el.appendTo(options.container);
            return pt;
        },
        /**默认风格*/
        STYLE_1:{
            template:'<div class="blacklist-page"></div>',
            pageNumberButtonTemplate:'<a rel="number" href="javascript:;"></a>',
            pageNumberButtonPath:"a[rel='number']",
            prevButtonTemplate:'<a rel="prev" href="javascript:;">上一页</a>',
            prevButtonPath:"a[rel='prev']",
            nextButtonTemplate:'<a rel="next" href="javascript:;">下一页</a>',
            nextButtonPath:"a[rel='next']",
            numberButtonFocusClass:"on"
        },
        /**风格2:收件箱风格*/
        STYLE_2: {
            template: '<div class="toolBarPaging ml_10 fr"><div>',
            pageLabelPath: "a[rel='selector'] span",//显示页码的路径
            selectButtonTemplate: '<a rel="selector" href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
            prevButtonTemplate: '<a rel="prev" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
            nextButtonTemplate: '<a rel="next" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray -->
            prevButtonPath: "a[rel='prev']",
            nextButtonPath: "a[rel='next']",
            selectButtonPath: "a[rel='selector']",
            disablePrevButtonClass: "up-gray",
            disableNextButtonClass: "down-gray"
        }
    });

 })(jQuery,_,M139);