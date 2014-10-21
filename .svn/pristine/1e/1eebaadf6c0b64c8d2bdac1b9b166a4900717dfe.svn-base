/**创建浮动的popup容器
 * icon支持的样式 i_ok对号，i_warn叹号 
 * @example
 * 			
 * var popup=M139.UI.Popup.create({
	target:document.getElementById("btn_popup"),
	icon:"i_ok",
	buttons:[{text:"确定",cssClass:"btnRed",click:function(){alert("ok");popup.close();}},
		{text:"取消",click:function(){alert("cancel");popup.close();}}
	],
	content:"hello"
	}
	);

	popup.render();
 */
M139.core.namespace("M139.UI.Popup", Backbone.View.extend({
    initialize: function (options) {

        this.target = options.target;//目标元素
        this.icon = null; //图标的样式名，
        this.buttons = null;//按钮集合，如[{text:"确定",click:function(){},class:"cssName"}]
        this.contentElement = null;//无素的el

        options.mainClass = options.mainClass || "tips delmailTips"; //顶层容器的样式
        options.containerClass = options.containerClass || "norTips"; //容器的样式
        options.contentClass = options.contentClass || "norTipsContent"; //内容的样式
        
        this.width = options.width;
        
        this.options = options;
    },
    render: function () {
        var self = this;
        var options = this.options;
        if (this.contentElement != null) { //避免重复调用
            return;
        }
        function getOffset() {
            var offset = $(self.target).offset();
            //console.log(offset);
            //console.log($(self.target).position());
            /*
			$(self.target).parents().each(function(){
				var t=$(this);
				if(t.css("position")=="absolute"){
					offset.top-=t.offset().top;
					offset.left-=t.offset().left;
				}
			});*/
            return offset;
        }
        function getHeight() {
            return self.height || $(self.contentElement).height()
        }

        function getWidth() {
            if (($.browser.msie && $.browser.version < 7) && !self.width) {
                self.width = 220;//IE6加默认宽度
            }
            return self.width || $(self.contentElement).width()
        }

        function getPosition(arrow) { //根据taget获取坐标
            var pos = getOffset();
            var height = $(self.target).height();

            try {
                $(self.contentElement).width(getWidth());//宽度自适应
            } catch (ex) { //避免iframe跨域报错

            }
            var left = pos.left;
            var x = parseInt(getOffset().left) + parseInt(getWidth());
            var w;
            if (x > $(window).width()) { //x座标超出屏幕区域,从右向左
                left = $(self.target).offset().left + $(self.target).width() - getWidth()-5; //重置内容栏的x坐标

                w = $(self.contentElement).width() - $(self.target).width() / 2 ;

            } else {
                w = $(self.target).width() / 2;
            }

            w -= 3;

            $(self.contentElement).find("[name=popup_arrow]").css("left", w + "px"); //重设箭头的x坐标		

            //return "top:"+(pos.top+height+10)+"px;left:"+(pos.left)+"px;width:235px;";	
            if (arrow == "down") { //向上指的箭头 down
                self.contentElement.css({
                    top: (pos.top + height + 10) + "px",
                    left: left + "px"
                });
            } else {//向下指的箭头 up
                /*self.contentElement.css({top:(pos.top+height-10-getHeight()-$(self.target).height())+"px",
					left:left+"px"});*/
                var t = ($(self.target).offset().top - getHeight()) - 10;

                self.contentElement.css({
                    top: t + "px",
                    left: left + "px"
                });
            }

        }

        function getArrowDirection() {//根据taget获取小箭头的方向
            // warning：此处需要先执行getOffset().top
            // ie11（默认ie9模式）下，首次执行getOffset()获取不到值
            console.log(getOffset())
            var y = getOffset().top + getHeight();
            if (y > $(window).height()) { //y座标超出屏幕区域

                //return "tipsBottom";
                return "up";
            } else {
                //return "tipsTop";
                return "down";
            }


        }
        function getIcon() { //获取图标的html
            if (self.options && self.options.icon) {
                return '<span class="norTipsIco"><i class="' + self.options.icon + '"></i></span>';
            } else {
                return "";
            }

        }
        function getButtons() {//获取按钮的html
            var b = options.buttons;
            if (b) {
                var result = ['<div name="buttons" class="delmailTipsBtn">'];
                for (var i = 0; i < b.length; i++) {
                    var className = b[i]["cssClass"] ? b[i]["cssClass"] : "btnNormal";
                    result = result.concat(['<a href="javascript:void(0)" class="', className, '"><span>', b[i]["text"], '</span></a>']);

                }
                result.push("</div>");
                return result.join("");
            } else {
                return "";
            }
            //return '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnRed"><span>删 除</span></a><a href="javascript:void(0)" class="btnNormal"><span>取 消</span></a></div>';
        }
        function getArrowPosition() {//获取小箭头x轴的坐标
            //var w=$(self.target).width();
            //return "left:"+(w/2)+"px";
        }

        var html = ['<div id="popup_', options.name, '" style="z-index:1001" class="',options.mainClass,'"> <a href="javascript:" class="delmailTipsClose" name="popup_close">',
            options.noClose ? '' : '<i class="i_u_close"></i>',
   '</a><div class="tips-text">',
     '<div class="', options.containerClass,
     '" style="', options.height ? "height:" + options.height : "px",
     '"> ', getIcon(),
       '<div class="', options.contentClass, '">',
       options.content,
       '</div>',
     '</div>',
     getButtons(),
   '</div>',
   '<div class="diamond" name="popup_arrow" style="', getArrowPosition(), '"></div>',
 '</div>'].join("");

        this.contentElement = $(html); //先创建dom，是获取dom的引用
        $(document.body).append(this.contentElement);
        //this.contentElement=$("#"+elementId);
        var direction = options.direction || getArrowDirection();
        var arrowClass = direction == "up" ? "tipsBottom" : "tipsTop";

        this.contentElement.find("[name=popup_arrow]").addClass(arrowClass);//必须要生成dom计算高度后才能知道箭头方向
        this.contentElement.find("[name=popup_close]").click(function (e) { //关闭按钮点击事件
            //加一个关闭按钮的回调，要怨就怨产品去
            if (options && options.closeClick) {
                if (typeof options.closeClick == 'function')
                    options.closeClick();
            }

            self.trigger("close", {event: e, source: "popup_close"});
            self.close();
        });
        getPosition(direction);//内容容器及箭头重定位
        $(this.options.buttons).each(function (idx) { //底部按钮集点击事件
            //var click=this["click"];
            self.contentElement.find("div[name=buttons] a").eq(idx).click(this["click"]);
        });
        if (options.autoHide) {
            $D.bindAutoHide({
                action: "click",
                stopEvent: true,
                element: this.contentElement.get(0),
                callback: function (data) {
                    self.trigger("close", data);
                    if (!data.cancel) {
                        self.close();
                    }
                }
            });
        }

    },
    close: function () { //关闭popup
        try {
            M139.Dom.fixIEFocus();
        } catch (ex) { }
        if (this.contentElement) {
            this.contentElement.remove();
        }
        this.contentElement = null;//释放指针
    }
}));

jQuery.extend(M139.UI.Popup,{ //扩展原型增加工厂方法
	popupList:{},
	create:function(options){ //工厂模式＋单例，创建一个popup实例
		var name=options.name || "tips"+Math.random();
		options.name = name;
		if(!this.popupList[name] || this.popupList[name].contentElement==null){ //是否创建过，每个name只创建一个实例
			this.popupList[name]=new M139.UI.Popup(options);
			this.currentPopup=this.popupList[name];
		}
		return this.popupList[name];
	},
	close:function(name){
		var instance=this.currentPopup;
		if(name){
			instance=this.popupList[name];
		}
        if(instance){
		   instance.close();
        }

	}
	  
});
