/**
* @author wuxiang
* @fileOverview 
* @description 应用于滚动效果
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /**
    * @namespace 
    * 欢迎页运营广告
    */   
         
    M139.namespace('M2012.UI.Scroll', superClass.extend({

       /**
        *依附于哪个元素之内
        */
        wrap:'',
        
        /**
         * 根元素
         */
        ulEL:null,
        
        /**
         * 数据
         */
        ulMsg:{},
        
        /**
         * 间隔时间
         */
        intervalTime:15000,
        
        /**
         * 滚动速度
         */
        speed:40,
        
        initialize: function(){
		    return superClass.prototype.initialize.apply(this, arguments);
	    },
	  
	    init: function(obj){
	  	    this.ulEL  = 'ul_track_'+this.cid;
	  	    this.lis   = obj.lis;
	  	    this.order = obj.order;
	  	    this.speed = obj.speed||40;
	  	    this.intervalTime = obj.intervalTime||15000;
	  	    this.doc = obj.win?obj.win.document:window.document;
	  	    this.wrap  = $(obj.wrap,this.doc);
			this.wrap.html(this.getTemplate(this.ulEL,this.lis,this.order));
			this.containerSrcoll = $("#"+this.ulEL,this.doc);
	    },
		render:function(obj){
		   this.init(obj);
		   this.scrollMarquee();
		},
	    scrollMarquee:function(){
		    var length = this.containerSrcoll.find("li").length;
			if (length > 1) {
				var height = $(this.wrap).height();
				this.startmarquee(this.ulEL, height, this.speed, this.intervalTime, 1);  //15000
			}
	    },
  		startmarquee:function(id,lh,speed,delay,index){ 
			var t; 
			var stopFlag=false; //是否停止的标志位
			var o=this.doc.getElementById(id); 
			o.innerHTML+=o.innerHTML; 
			o.onmouseover = function () { stopFlag = true };
			o.onmouseout = function () { stopFlag = false };
			o.scrollTop = 0; 
			function start(){ 
				try{
					t=setInterval(scrolling,speed);
					if (stopFlag == false) {
					    o.scrollTop += 1;
					}
				}catch(e){
					
				}
			} 
			function scrolling(){
				try{
					if(o.scrollTop%lh!=0){ 
					    o.scrollTop += 1; 
					    if (o.scrollTop >= o.scrollHeight / 2) { o.scrollTop = 0; }
					}else{ 
					    clearInterval(t); 
					    setTimeout(start,delay); 
					} 
				}catch(e){}
			} 
			setTimeout(start,delay); 
       },
	   resetScroll:function(data){
		  this.wrap.html(this.getTemplate(this.ulEL,data,this.order));
		  this.scrollMarquee();
		},
		/**
		 * 模版
		 */
		getTemplate:function(id,data,order){
			order = order?order:[];
			var lis =[],len = order.length;
			var eachData = (len==0?data:order);
			_.each(eachData,function(v,k){
				if(len==0){
					lis.push(v);
				}else{
					if(data[v]){
						lis.push(data[v]);
					}
				}
			});
			return top.$T.Utils.format(this._template,{id:id,lis:lis.join('')});
		},
		_template: '<ul class="nessageReminding" id="{id}" style="overflow:hidden;">{lis}</ul>'
	}));
    
})(jQuery, _, M139);