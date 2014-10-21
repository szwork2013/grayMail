﻿/**
 * 右下角弹出tips
 * @example taskList = [{},{}];
 * $PopTip.show({title:'xxx',content:'xxxx'});
 */
M139.core.namespace("M139.UI.BottomTip", Backbone.View.extend({
    initialize: function (options) {
		this.isClosed = true;
		this.isOver = false;
		this.timerClose = 0;
		this.taskList = [];
		this.createContainer();
		this.initEvents();
    },
	createContainer:function(){
	  if(typeof this.contentElement==='undefined'){
		   this.contentElement = document.createElement("div");
		   this.contentElement.style.cssText ="position:absolute;right:1px;bottom:0px;display:none;z-index:9999;";
		   this.contentElement.id = "remindTip";
		   document.body.appendChild(this.contentElement);
		   $("#remindTip").bind('mouseout',this.mouseOut);
		   $("#remindTip").bind('mousemove',this.mouseMove);
		   $("#remindTip").bind('click',this.clickHander);
		}
	},
	initEvents:function(){
			this.on('show',this.show);
	},
	/**
	 * 显示tips
	 * @param {Object} params 
	 */
    show: function () {
    	var param,self = $BTips.instance;
		if(arguments.length>0){
			params = arguments[0];
		}else{
			params = self.taskList.splice(0,1)[0];
		}
		if(!params) return;
		var content = params.content||'内容',
			title = params.title||"标题",
			timeout = params.timeout||20000,//tips消失时间2秒20000
			width   = params.width||340,    //tips宽度
			bhClose = params.bhClose,	    //关闭统计
			bhShow  = params.bhShow;        //展现统计
		self.contentElement.innerHTML=self._getContent(title,content,width,bhClose);
		self.isClosed = false;
        self.onclick = params.onclick || function(){};

		var	maxY=0;
		var offsetY=0;
		var intervalId=window.setInterval(anmiate,30);//100抖动效果比较明显，改成30
		function anmiate(){
			if (self.isClosed) {//在弹出的过程中点了关闭
				self.contentElement.style.display = "none";
				window.clearInterval(intervalId);
			}
			else {
				self.contentElement.style.display = "block";
				maxY = self.contentElement.offsetHeight;
				if (offsetY <= maxY + 1) {
					self.contentElement.style.bottom = (-maxY + offsetY).toString() + "px";
				}
				else {
					window.clearInterval(intervalId);
					offsetY = 0;
					if(!self.isOver){
						self.timerClose=setTimeout(self.close,timeout);
					}
					
				}
				//30第一次上升30px,后面按百分比上升
				var m = 30 * (maxY - offsetY) / maxY;//缓冲系数
                //上升的高度，最小一次上升2px，最大为30px
				offsetY += m < 2 ? 2 : m;//偏移量,要注意极限值,否则无法停下来.
			}
			
		}
      //统计行为
	  if(bhShow)top.BH(bhShow); 
	},
	/**
	 * 更新tips
	 * @param {Object} title
	 * @param {Object} content
	 */
	updateContent:function(title,content){
		this.contentElement.innerHTML = this._getContent(title,content);
	},
	close:function(){
		var el =  $BTips.instance.contentElement;
		el.style.bottom=(-el.offsetHeight).toString()+"px";
		el.style.display="none";
		$BTips.instance.isClosed=true;
		$BTips.instance.trigger('show');
	},
	clickHander:function(event){
		var target = event.target;
		do{
			if(target.tagName==='A'){
				$BTips.instance.isOver=false;
				setTimeout($BTips.instance.close,5000);
				break;
			}
			target = target.parentNode;
		}while(target.id!=='remindTip');

        if ($BTips.instance.onclick) {
            $BTips.instance.onclick(event, $BTips.instance);
        }
	},
	mouseMove:function(){
	   if($BTips.instance.timerClose!=0){
			$BTips.instance.isOver=true;
			clearTimeout($BTips.instance.timerClose);
		}
	},
	mouseOut:function(event){
	     if(!event.toElement||event.toElement.tagName==='IFRAME'){
	     	$BTips.instance.isOver=false;
			$BTips.instance.timerClose=setTimeout($BTips.instance.close,5000);
	     }
	},
   _getContent:function(title,content,width,bhClose){
		var s="<div class=\"boxIframe\" style=\"width:{width}px;\">"+
			    "<div class=\"boxIframeTitle\"><h2><span>{title}</span></h2><a class=\"i_t_close\" bh=\"{bhClose}\" id=\"tipCloseLink\" href=\"javascript:{href}void(0);\"></a></div>"+
			    "<div class=\"boxIframeMain\">"+
			        "<div class=\"boxIframeText\">{content}</div>"+
			    "</div>"+
			"</div>"
		return top.$T.Utils.format(s,{width:width,title:title,content:content,bhClose:bhClose,href:"top.$BTips.instance.close();"});
   }
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.BottomTip,{

        timer: false,
        interval: 333,

		show:function(params){
			 $BTips.instance.show(params);
			},
		hide:function(){
			if($BTips.instance)$BTips.instance.close();
		},
		updateContent:function(title,content){
			if($BTips.instance)$BTips.instance.updateContent(title,content);
		},
		/**
		 * 添加任务
		 */
		addTask:function(params){
            var This = this;
            $BTips.instance.taskList.push(params);

            if (!This.timer) {
                This.timer = setInterval(function() {
                    if ($BTips.instance.isClosed) {
                        $BTips.instance.show();
                    }

                    if (!$BTips.instance.taskList.length) {
                        clearInterval(This.timer);
                        This.timer = false;
                    }

                }, This.interval);
            }
		},
		/**
		 * 删除任务
		 */
		removeTask:function(){
			$BTips.instance.taskList.splice(0,1);
		},
		instance:new M139.UI.BottomTip()
	})
	//定义缩写
    window.$BTips = M139.UI.BottomTip;
})(jQuery,_,M139);