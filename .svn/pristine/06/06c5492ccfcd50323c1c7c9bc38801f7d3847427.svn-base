/**
 * @author wuxiang 
 * @description 运营滚动效果
 * data为li中的数据,
 * defaultLines为默认展现的条数,
 * scrollLine每一次滚动的条数
 * speed 滚动的速度
 * timer 每一次滚动所花时间
 * var mutiScroll = new M2012.UI.MutiScroll({ data:['11111','222222','33333','222222','33333'],
 *                           parentEl:$("#accountList"),
 *                           defaultLines:2,
 *                           scrollLine:1,
 *                           speed:1300,
 *                           timer:1500
 *                         }); 
 * 更新滚动内容
 * mutiScroll.updateScroll({data:["aaaaa","bbbbb","ccccc"]});
 */
(function (jQuery, _, M139) {
	    var $ = jQuery;
	    var superClass = M139.View.ViewBase;
	    M139.namespace('M2012.UI.MutiScroll', superClass.extend({
	    	 data:[],
	    	 parentEl:null,
	    	 speed:1300,   //滚动的速度
	    	 timer:1500,   //多少次滚动一次
	    	 scrollLine:1, //每次滚动条数
			 defaultLines:1,//展现的条数
	    	 initialize :function(obj){
	    	  	this.data = obj.data||[];
	    	  	this.speed = obj.speed||1300;//卷动速度，数值越大，速度越慢（毫秒）
	    	  	this.timer = obj.timer||1500;//滚动的时间间隔（毫秒）
	    	  	this.parentEl = obj.parentEl;
	    	  	this.scrollLine  = obj.scrollLine||1;
				this.defaultLines = obj.defaultLines||1;
	    	  	this.init();
	         },
	         init:function(){
	        	 this._initPararent(this.data);
	        	 this._scroll();
	        	 this._initEvent();
	         },
			 _initPararent:function(data){
				 var Lis = [],len = data.length;
	        	 for(var i = 0;i<len;i++){
	        		 Lis.push( $T.Utils.format(this._templateLi,{info:data[i]}));
	     		 }
	        	 this.parentEl.html($T.Utils.format(this._templateUl,{id:this.cid,lis:Lis.join('')}));
				 //获取每一行的高度,展现的行数
				 var liHeight = this.parentEl.find("li:first").outerHeight();
				 this.parentEl.css({height:liHeight*this.defaultLines,overflow:'hidden'});
			 },
			 updateScroll:function(param){
			     if(param.data){
			     	this.data = param.data;
					this._initPararent(param.data);
					this._stop();
					this._scroll();
				 }
			 },
	         _scroll:function(){
	         	 if(this.data.length>this.defaultLines){
				 	this._start();
	         	 }
	         },
	         _scrollUp:function(){
			     var self = this;
			     var ulEl =  this.parentEl.eq(0).find("ul:first");
				 var scrollLine =  parseInt(this.scrollLine,10);
				 var lineH = this.parentEl.find("li:first").outerHeight();
				 var upHeight = 0-scrollLine*lineH;
				 var speed =parseInt(this.speed,10); 
	         	 if(this.timerID){
				    try{
							ulEl.animate({marginTop:upHeight},speed,function(){
									for(i=1;i<=scrollLine;i++){
										   ulEl.find("li:first").appendTo(ulEl);
									}
									ulEl.css({marginTop:0});
							});
						}catch(e){
						   self._stop();
						   self._scroll();
						}
					}
	         },
	         _stop:function(){
	         	 if(this.timerID){
                    clearInterval(this.timerID);
					this.timerID = null;
				}
	         },
	         _start:function(){
	         	var self = this;
	         	self.timerID=setInterval(function(){
                        		self._scrollUp();
                            },self.timer);
	         },
	         _initEvent:function(){
	         	 //鼠标事件绑定
	         	var self = this;
                this.parentEl.hover(function(){
				      self._stop();
                },function(){
                      self._scroll();
                }).mouseout();
	         },
	    	 _templateUl:'<ul id="ul_{id}" style="overflow:hidden;margin:0px;">{lis}</ul>',
	    	 _templateLi:'<li style="overflow:hidden;">{info}</li>'
	    }));
})(jQuery, _, M139);