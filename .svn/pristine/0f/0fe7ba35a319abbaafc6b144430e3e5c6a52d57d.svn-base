/**
* @author wuxiang
* @fileOverview 
* @example new M2012.UI.HoriScroll({parentEl:$('#accountList'),defaultMCount:2,data:[""],test:true,});
* @description 应用于滚动效果
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    /**
    * @namespace 
    * 欢迎页运营广告
    */   
         
    M139.namespace('M2012.UI.HoriScroll', superClass.extend({
	    parentEl:null,//容器
		UlEl    :null,//最外层UL
		data    :[],  //数据
		movePos :0,   //移动的位置
		isIE6   :true,//ie6不做滚动处理
		widthLi :50,  //li的宽度
		defaultLis:4, //默认能装下多少个LI
		defaultMCount:1,//每次移动多少个
 		initialize :function(obj){
			        	this.data = obj.data;
						this.parentEl = obj.parentEl;
						this.defaultMCount = obj.defaultMCount||1;
		    	  		this.init();
	         },
	    init:function(){
		 
		    this.isIE6 = $.browser.msie&&$.browser.version == 6; //不支持滚动

	    	if(this.test){
				this.testData();
			}
			this._initParent();
			this.initEvent();
	    	
	    },
		initEvent:function(){
		  	var _this = this;
		  	this.parentEl.find(".slideBtn-prev").bind('click',function(){
		     	_this.moveLeft();
		  	});
		  	this.parentEl.find(".slideBtn-next").bind('click',function(){
				_this.moveRight();
		 	 });
		},
		moveLeft:function(){
	      	if (this.movePos == 0) return;
		  	this.movePos-=this.defaultMCount;
		  	this.move(this.movePos);
		},
		moveRight:function(){
		    if (this.movePos + this.defaultLis >= this.data.length) return;
			this.movePos+=this.defaultMCount;
			this.move(this.movePos);	
		},
		move:function(movePos){
		    var _this = this;
			if (this.isIE6) {
				this.UlEl.css('margin-left',-(movePos * _this.widthLi));
			} else {
				this.UlEl.animate({
					'margin-left': -(movePos * _this.widthLi)
				}, "slow");
			}
			this.movePos = movePos;	
		},
		_initParent:function(){
		  	if(this.parentEl.length>0){
				this.parentEl.html(top.$T.Utils.format(this._template,{id:this.cid,lis:this.data.join('')}));
		  	}
		  	this.UlEl = this.parentEl.find("#UL_"+this.cid);
		  	var liEl = this.UlEl.find("li:first");
		  	this.widthLi = parseInt(liEl.css('width'))+parseInt(liEl.css('margin-right'));
		  	this.defaultLis = this.getLiCount(this.widthLi,this.parentEl.outerWidth());
		},
		getLiCount:function(widthLi,contain_width){
		    var liCount = 0;
			for(var i=1;i<=this.data.length;i++){
		         if(contain_width<widthLi*i){
				    liCount = i-1;
				    break;
				 }
		   	}
		  	return liCount;
		},
	    testData:function(){
	    	var x = "<li class='on'><a href='' class='item-bg'><i class='item-ico1'></i></a><a href='' class='item-info-name'>使用绿色账单</a></li>";
	    	for(var i=0;i<8;i++){
	    		this.data.push(x);
	    	}
	    },
       _template:['<div class="slide-item" id="hs_{id}">',
                  '<div class="slide-item-con">',
					'<ul class="slide-item-ul m_clearfix" id="UL_{id}">{lis}</ul>',
                  '</div>',
                  '<a href="javascript:void(0);" title="上一页" class="slideBtn-prev"><i></i></a>',
                  '<a href="javascript:void(0);" title="下一页" class="slideBtn-next"><i></i></a>',
               '</div>'].join('')
		}));
    
})(jQuery, _, M139);