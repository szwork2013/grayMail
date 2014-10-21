/**
 * 右下角弹出tips
 * @example
 * $PopTip.show({title:'xxx',content:'xxxx'});
 */
M139.core.namespace("M139.UI.PopTip", Backbone.View.extend({
    initialize: function (options) {
		this.isClosed = true;
		this.isOver = false;
		this.timerClose = 0;
		this.createContainer();
    },
	createContainer:function(){
	  if(typeof this.contentElement==='undefined'){
		   this.contentElement = document.createElement("div");
		   this.contentElement.style.cssText ="position:absolute;right:1px;bottom:0px;display:none;zIndex:9999;";
		   this.contentElement.className = "popTip";
		   this.contentElement.id = "popTip";
		   this.contentElement.onmouseout=this.mouseOut;
		   document.body.appendChild(this.contentElement);
		}
	},
    show: function (params) {
        var self = this,
		    content = params.content||'标题',
			text = params.text||""; 
			timeout = params.timeout||20000;//tips消失时间2秒
		
		this.contentElement.innerHTML=self._getContent(content,text);
        if (this.contentElement != null) { //避免重复调用
            return;
        }
		var tip=this;
		var	maxY=0;
		var offsetY=0;
		var intervalId=window.setInterval(anmiate,100);
		function anmiate(){
			if (this.isClosed) {//在弹出的过程中点了关闭
				tip.element.style.display = "none";
				this.isClosed=false;
				window.clearInterval(intervalId);
			}
			else {
				tip.element.style.display = "block";
				maxY = tip.element.offsetHeight;
				if (offsetY <= maxY + 1) {
					tip.element.style.bottom = (-maxY + offsetY).toString() + "px";
				}
				else {
					window.clearInterval(intervalId);
					offsetY = 0;
					if(!tip.isOver){
						tip.timerClose=setTimeout(tip.close,timeout);
					}
					
				}
				//30第一次上升30px,后面按百分比上升
				var m = 30 * (maxY - offsetY) / maxY;//缓冲系数
                //上升的高度，最小一次上升2px，最大为30px
				offsetY += m < 2 ? 2 : m;//偏移量,要注意极限值,否则无法停下来.
			}
			
		}
       
	},
	close:function(){
		this.element.style.bottom=(-this.element.offsetHeight).toString()+"px";
		this.element.style.display="none";
		this.isClosed=true;
	},
	mouseMove:function(){
	   if(this.timerClose!=0){
			this.isOver=true;
			clearTimeout(this.timerClose);
		}
	},
	mouseOut:function(el){
	     if(!$.browser.msie){
		    event = el;
		 }
		 var elSrcClass = $(event.srcElement).attr('class');//ie
		 var elFromeTag = event.fromeElement?event.fromeElement.tagName:'undefined';
		 var elToClass = event.toElement?event.toElement.tagName:'undefined';
		 var elRelatetName = event.relatedTarget?event.relatedTarget.tagName:'IFRAME';
		 var currentClass = $(event.currentTarget).attr('class');//ff
		 
		 //IE处理
		 if($.browser.msie){
			if(elToClass=='undefined'||(elToClass=='IFRAME'&&(elSrcClass=='pop-rbBar'||'pop-rb_mes mail-rb_mes'==elSrcClass||elFromeTag=='undefined'))){
			   this.isOver=false;
			   this.timerClose=setTimeout(this.close,5000);
			}
		 }else{//W3C
		   if(((elSrcClass=='pop-rbBar'||'pop-rb_mes mail-rb_mes'==elSrcClass||currentClass=='popTip')||event.target.tagName=='H2')&&('IFRAME'==elRelatetName)){
				this.isOver=false;
				this.timerClose=setTimeout(this.close,5000);
			}
		 }
	},
	/**
	 * 滚动标题配置
	 */
    rollTitleCfg:{
        "orgTitle": document.title,//原document title
        "mailTitle": "",//新邮件标题
        "printSpeed": 420,//打印速度
        "rollSpeed":200,//滚动间隔
        "strIndex": 0,//下标
        "timeHandler": null,
        "run": 1,//是否运行提示
        "isBindEvent":0
    },
	/**
	 *浏览器标题重置
	 */
	allDocOnClick:function(){
        PopTip.reSetRollCfg();//重置配置
        PopTip.cancelDocClickEvent();//unbind document click event
	},
	/**
	 * 重置滚动配置
	 */
    reSetRollCfg: function(){
        PopTip.rollTitleCfg.run = PopTip.rollTitleCfg.strIndex =0;
        PopTip.rollTitleCfg.timeHandler = null;
        document.title = this.rollTitleCfg.orgTitle;//恢复文档标题
    },
	/**
	 * 运行窗口的标题滚动提示
	 */
    runRollTitle:function (){
		if(this.rollTitleCfg.timeHandler)
		{
			clearTimeout(this.rollTitleCfg.timeHandler);
		}
        if (!this.rollTitleCfg.run) {
			this.rollTitleCfg.run=1;
			return;
		}
        var msg=this.rollTitleCfg.mailTitle;//新邮件标题
        document.title=msg.substring(this.rollTitleCfg.strIndex,msg.length)+" "+msg;//重写标题产生滚动
        this.rollTitleCfg.strIndex++;
		if(this.rollTitleCfg.strIndex>msg.length){this.rollTitleCfg.strIndex=0;}//打印完则重置打印位置
        this.rollTitleCfg.timeHandler = setTimeout("this.runRollTitle()", this.rollTitleCfg.printSpeed);//延迟递归
    },
    /**
     * 播放提示声音
     */
    playTipSound:function(){
        $(document.body).append('<embed id="tipSound" src="'+top.rmResourcePath+'/images/receiveMail.wav" pluginspage="http://www.microsoft.com/isapi/redir.dll?prd=windows&amp;sbp=mediaplayer&amp;ar=media&amp;sba=plugin&amp;" type="audio/x-wav" border="0" width="0px" height="0px" hidden="true" showcontrols="false" showaudiocontrols="false" showstatusbar="false" autostart="true" loop="false" enablecontextmenu="false"></embed>');
        setTimeout(function(){//播放完成移除元素
            $("#tipSound").remove();
        }, 1200);
    },
   _getContent:function(title,text){
		var s="<div class=\"pop-rbBar\"   ><!--style临时测式加-->\
			<h2><a href=\"javascript:;\" id='closeLink' class=\"pop-rb_close\" title=\"点击关闭\" hidefocus=\"1\" onclick=\"$PopTip.close();return false;\"></a><font>{title}</font></h2>\
			<div class=\"pop-rb_mes mail-rb_mes\">{text}</div>\
		</div>";
		return String.format(s,{title:title,text:text});
   }
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.PopTip,{
		show:function(params){
			  if(!$PopTip.instance){
					$PopTip.instance = new M139.UI.PopTip();
			   }
			  $PopTip.instance.show(params);
			},
		hide:function(){
			if($PopTip.instance)$PopTip.instance.close();
		},
		instance:null
	})
	//定义缩写
    window.$PopTip = M139.UI.PopTip;
})(jQuery,_,M139);