function tips(){
	this.init.apply(this,arguments);
};

tips.list = {};

tips.prototype = {
	options :{
		//tip里面的内容
		content   : '无内容',
		//tip的最小宽度
		width     : 220,
		maxHeight : 60,
		direction : 'deflaut',
		howShow   : true 
	},
	init : function(options,win){
		$.extend(this,this.options,options);
		this.win = win || window;
		this.elem = typeof this.id==="string" 
			? $(win.document.getElementById(this.id))
			: this.id;
		
		var elem = this.elem[0]
		if(!elem)
			return;
			
		if(elem&&(!('nodeName' in elem)))
			return;

		var url = top.resourcePath; 
		//生成tips里面的内容

		this.tipsContainer = $('<div style="height:auto;border:1px solid #e6d650;position:absolute;font-size:12px;margin-top:15px;zoom:1;"></div>')
			.hide()
			.css({
				width : (this.width || this.options.width) + 'px' 
			});
		this.tipsContainer = $(win.document.createElement('div'))
			.hide()
			.css({
				 'height'     : 'auto',
				 'border'     : '1px solid #e6d650',
				 'position'   : 'absolute',
				 'font-size'  : '12px',
				 'margin-top' : '15px',
				 'zoom'       : 1,
				 'width'      : (this.width || this.options.width) + 'px',
				 'z-index'    : 1000
			})
		win.document.body.appendChild(this.tipsContainer[0]);
		this.tipsContainer.html('<div style="border:1px solid #fff;padding:10px;background:#fefddf"><div style="position:absolute;left:12px;top:-6px;height:6px;width:9px;line-height:1px;font-size:1px;background:url('+url+'/images/arrow.gif) no-repeat;cursor:pointer;"></div><div style="position:absolute;background:url('+url+'/images/cls.gif) no-repeat 0 0;top:6px;right:7px;height:8px;width:7px;line-height:12px;cursor:pointer">&nbsp;</div><table height="'+this.maxHeight+'" border="0"><tr><td width="30" style="text-align:center;vertical-align:middle;"></td><td valign="top" style="padding-left:5px;line-height:16px;padding-top:10px;"></td></tr></table></div>');

		var divs = this.tipsContainer.find('div'),
			self = this;
		this.icoJ = divs.eq(1);
		this.icoC = divs.eq(2);

		this.imgSrc
			&&this.tipsContainer.find('td').eq(0).html('<img src="'+top.resourcePath+this.imgSrc +'" />');
		
		this.htmlContainer = this.tipsContainer.find('td').eq(1);
		this.htmlContainer.html(this.content);
		!this.howShow
			&&this.elem.bind('mouseover.tips',function(){self.show();});
		
		var behaviorKey = 'tips_' + [0,'功能提醒类','功能设置类','功能引导类'][self.data.type]; 		
		
		this.icoC.bind('click',function(){
			self.tipsContainer[0].parentNode.removeChild(self.tipsContainer[0]);
			self.request();
			self.unbind();
			
			behaviorKey = behaviorKey +'2';
			//功能提醒类 功能设置类 功能引导类
			top.addBehavior
				&&jQuery.isFunction(top.addBehavior)
				&&top.addBehavior(behaviorKey,2);
		});

		this.htmlContainer.bind('click.tips',function(e){
			var elem = e.target,
				name = e.target.nodeName.toLocaleLowerCase();
				if(name === 'a'){
					self.unbind();
					self.request();
				behaviorKey = behaviorKey +'1';
				top.addBehavior
					&&jQuery.isFunction(top.addBehavior)
					&&top.addBehavior(behaviorKey,1);					
					var resourcePath = top.resourcePath;
					if('operate' in self.data){
						var action = {
							'0' : function(){
								return;
							},
							'1' : function(){
								LinksConfig.mailnotifyTips.url =webmailDomain+LinksConfig.mailnotifyTips.url+'?stype=tips';
								Links.show("mailnotifyTips");
							},
							'2' : function(){
								LinksConfig.safeTips.url = webmailDomain+LinksConfig.safeTips.url+'?stype=tips';
								Links.show("safeTips");	
							},
							'3' : function(){
								Links.show("smtpsave");
								var win =document.getElementById('smtpsave').contentWindow
								var time = setInterval(function(){
									if(win.isReady === true){
										win.document.getElementById('r1').checked = true;
										clearTimeout(time);
									}
								},200);
							},
							'4' : function(){
								Links.show("autoSaveContact");
								var win =document.getElementById('autoSaveContact').contentWindow
								var time = setInterval(function(){
									if(win.isReady === true){
										win.document.getElementById('autoSave').checked = true;
										clearTimeout(time);
									}
								},200);
							},
							'5' : function(){
								LinksConfig.billdeliverTips.url = webmailDomain+ LinksConfig.billdeliverTips.url+'?stype=tips';

								Links.show("billdeliverTips");	
							}
						}
						action[self.data.operate]();
					}
				}		
		});
	
		this.howShow
			&&this.show();
	},

	//new tips({id:"header", data:{type:2,id:188}}, window).request()
	request : function(){
        var self = this;
        var api = "user:hitGuide";
        var mailid = self.data.id;
        var data = {
            seqId: mailid,
            type: 2
        };

        var options = {
            onrouter: function (router) {
                router.addRouter("setting", [api]);
            }
        };

        top.$RM.call(api, data, callback, options);

        function callback(result) {
            if (result && result.responseData) {
                result = result.responseData;
                if (result.code === "S_OK") {
                    delete tips.list[mailid];
                    var target = null;
                    $.each(top.AdLink.tips, function(i,o){
                        if(mailid===o.id){
                            target = i;
                            return false;
                        }
                    });
                    if(target!==null){
                        top.AdLink.tips.splice(target,1);
                    }
                    return true;
                }
            }
            return false;
        }
	},
	show : function(){	
	
	    if(this.showFlag != 1){
	        top.addBehavior("功能引导tips触发量");
	        this.showFlag = 1;
	    }
		var pos       = this.elem.offset(),
			left      = pos.left,
			elemWidth = this.elem[0].offsetWidth,
		   elemHeight = this.elem[0].offsetHeight,
			win       = this.win,
			direction = this.direction;
		
		if(pos.top > 0){ this.top = pos.top }
		if(pos.left > 0){ 
		this.left = pos.left 
		left = this.left;
		}
		
		
		if(elemHeight > 0){
		this.offsetHeight = elemHeight;
		};
		
		//根据浏览器 自己判断如何偏移
		if(direction==='deflaut'||(direction==='left'&&direction==='right')){
			if(this.left<20){
				left = 0;
				this.icoJ.css({marginLeft:this.left+'px'});
				
			}else{
				var dWidth = Math.min(win.document.body.clientWidth, win.document.documentElement.clientWidth),
					sWidth = dWidth -(left + elemWidth);
	
				if(sWidth>this.width+5){ 
					left = left -18;
					this.icoJ.css({marginLeft:18+'px'});
				}
				else{
					left = left - this.width + elemWidth + 5;//-18
					this.icoJ.css({marginLeft:this.width-5-elemWidth/2-18+'px'});//-30
				}
			}		
		}

		this.tipsContainer.css({
			top     : this.top  + this.offsetHeight -10 + 'px',
			left    : left + 'px',
			display :'block'
		});		
	},
	unbind : function(){
		this.elem.unbind('mouseover.tips');
		this.htmlContainer.unbind('click.tips');
		this.tipsContainer[0].parentNode
			&&this.tipsContainer[0].parentNode.removeChild(this.tipsContainer[0]);
	}
}

function setTips(){
	if(!top.AdLink){
		return
	}
	var data = top.AdLink.tips;	
	if(!data)
		return;
	if(Object.prototype.toString.call(data)!=="[object Array]"){
		return;
	}
	var	reg  =/([^\/]*?\.[a-z]+)\?.*$/i;	
			
	setInterval(function(){
		var iframes = document.body.getElementsByTagName('iframe');				

		//首页的比较特殊 单独拿出来判断
		$.each(top.AdLink.tips,function(i,obj){
			if($.trim(obj.pageurl)==="main.htm"){
				var id = obj.id;
				if(id in tips.list&&window['caiXunTip'+id]){
					window['caiXunTip'+id].show();
				}else{
					tips.list[id] = 1
					var elem = document.getElementById($.trim(obj.elementid));
					if(elem){
						window['caiXunTip'+id] = new tips({
							imgSrc    : obj.imageurl,
							id        : $.trim(obj.elementid),
							content   : obj.content,
							data      : obj
						},window);
					}
				}								
			}			 
		});

		$.each(iframes,function(i,iframe){
			//判断他的父元素是不是隐藏的 如果隐藏的 就不会计算位置了 计算了也找不到位置的
			if(iframe.parentNode.style.display === 'none'){
				return;	
			}					
			var urls = reg.exec(iframe.src);
			if(!urls)
				return;
			
			var name = urls[1];
			$.each(data,function(i,obj){
				if($.trim(obj.pageurl) === $.trim(name)){						
					var win = iframe.contentWindow,
						id  = obj.id;
					
					if(!(tips.list[id])||(id in tips.list&&!win['caiXunTip'+id])){
						tips.list[id] = 1;
						(function(win,obj){		
							var time = setInterval(function(){						
								if(win.document&&win.document.getElementById(obj.elementid)&&win.jQuery){
									win['caiXunTip'+id] = new tips({
										imgSrc    : obj.imageurl,
										id        : obj.elementid,
										content   : obj.content,
										data      : obj
									},win);
									clearTimeout(time);				
								}																										
							},500);	  
						})(iframe.contentWindow,obj);
					}else{
						if(tips.list[id]&&win['caiXunTip'+id]){
							win['caiXunTip'+id].show();
						}
					}						
				 }
			});
		});
	},1000);
}
