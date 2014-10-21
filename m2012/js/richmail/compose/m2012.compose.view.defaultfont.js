/**
 * @fileOverview 设置默认字体视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.DefaultFont', superClass.extend(
	/**
	 *@lends M2012.Compose.View.prototype
	 */
	{
		el : "body",
		name : "defaultFont",
		events:{
			"click #fontFamily": "showFamilyMenu",
			"click #fontSize": "showSizeMenu",
			"click #fontColor": "showColorMenu",
            "click #fontLineheight": "showLineheightMenu"
		},
		initialize : function(options) {
			this.familyMenuItems = [];
			this.initFamilyMenuItems();
			this.familyMenu = {};
			
			this.sizeMenuItems = [];
			this.initSizeMenuItems();
			this.sizeMenu = {};
			
			this.colorMenu = {};
			this.initColorMenu();
            
            this.lineheightMenuItems = [];
			this.initLineheightMenuItems();
			this.lineheightMenu = {};
            
			
			this.render();
			this.initEvents();
			
            top.BH('compose_setfont');
            
			return superClass.prototype.initialize.apply(this, arguments);
		},
		/**
		 * 初始化字体菜单
		 */
		initFamilyMenuItems : function(){
        	var fontFamilies = ["微软雅黑","宋体","黑体","楷体_GB2313","隶书","幼圆","Arial","Arial Narrow","Arial Black","Comic Sans MS","Courier","System","Times New Roman","Verdana"];
        	var familyMenuItems = [];
		    for(var i = 0;i < fontFamilies.length;i++){
		    	var text = fontFamilies[i];
		        var item = {
					text : text,
					onClick : function() {
						$("#fontFamily div.dropDownText").text(this.text);
		        		$("#previewFont").css({fontFamily:this.text});
		        		$("#previewFont").attr('fam', this.text);
					}
				};
				familyMenuItems.push(item);
		    }
		    this.familyMenuItems = familyMenuItems;
        },
        /**
		 * 初始化字号菜单
		 */
        initSizeMenuItems : function(){
        	var self = this;
        	var fontSizes = [1,2,3,4,5,6];
        	var sizeMenuItems = [];
		    for(var i = 0;i < fontSizes.length;i++){
		    	var value = fontSizes[i];
		    	var text = self.getSizeText(value);
		        var item = {
					text : text,
					value : value,
					onClick : function() {
						$("#fontSize div.dropDownText").text(self.getSizeText(this.value));
			    		$("#previewFont").css({fontSize: self.getPxSize(this.value)});
			    		$("#previewFont").attr('size', this.value);
					}
				};
				sizeMenuItems.push(item);
		    }
		    this.sizeMenuItems = sizeMenuItems;
        },
        /**
         * 初始化颜色菜单
         */
        initColorMenu : function(){
        	this.colorMenu = new M2012.UI.HTMLEditor.View.ColorMenu();
        },
        /**
		 * 初始化行距菜单
		 */
        initLineheightMenuItems : function(){
        	var self = this;
        	var fontLineheights = [1.2,1.5,2,2.5];
        	var lineheightMenuItems = [];
		    for(var i = 0;i < fontLineheights.length;i++){
		    	var value = fontLineheights[i];
		    	var text = self.getLineHeightText(value);
		        var item = {
					text : text,
					value : value,
					onClick : function() {
						$("#fontLineheight div.dropDownText").text(self.getLineHeightText(this.value));
			    		$("#previewFont").css({lineHeight: this.value*1});
			    		$("#previewFont").attr('lineHeight', this.value);
					}
				};
				lineheightMenuItems.push(item);
		    }
		    this.lineheightMenuItems = lineheightMenuItems;
        },
        render : function(){
        	var self = this;
        	renderColorMenu();
        	renderPreviewTable();
        	
  			function renderColorMenu(){
        		self.colorMenu.render();
	        	self.colorMenu.$el.appendTo(document.body);
        	};
			function renderPreviewTable(){
				var defaultFont = top.$User.getDefaultFont();
	        	$("#fontFamily div.dropDownText").text(defaultFont.family);
	        	$("#fontSize div.dropDownText").text(defaultFont.sizeText);
	        	$("#fontLineheight div.dropDownText").text(defaultFont.lineHeightText);
	        	$("#fontColor span.fontcolor-list-a")[0].style.backgroundColor = defaultFont.color;
	        	$("#previewFont").css({
				   fontFamily : defaultFont.family,
				   fontSize : self.getPxSize(defaultFont.size),
				   color : defaultFont.color,
                   lineHeight : defaultFont.lineHeight
				});
				$("#previewFont").attr({size: defaultFont.size, color: defaultFont.color, fam: defaultFont.family, lineHeight: defaultFont.lineHeight});
			};
        },
        /**@inner*/
		initEvents : function(){
        	var self = this;
        	self.colorMenu.on('select', function(color){
        		$("#fontColor span.fontcolor-list-a")[0].style.backgroundColor = color.value;
        		$("#previewFont").attr('color', color.value);
	        	$("#previewFont").css({color:color.value});
        	});
        	
        	$("div.boxIframeBtn a.btnSure").click(function(){
		    	var obj = self.getFontObj();
		    	var fonts = $T.format('{0};{1};{2};{3}', [obj.size,obj.family,obj.color,obj.lineHeight]);
		    	self.callApi({attrs: {fonts : fonts}}, function(result){
		    		if(result.responseData && result.responseData.code == 'S_OK'){
                        top.BH('compose_setfontsuc');
		            	top.M139.UI.TipMessage.show('默认字体设置成功', {delay : 1000});
		            	top.$App.trigger('setDefaultFonts', {size:obj.size, family:obj.family, color:obj.color, lineHeight:obj.lineHeight});
		            }else{
		            	top.M139.UI.TipMessage.show('默认字体设置失败', {delay : 1000});
		            	top.$App.trigger('cancelDefaultFonts');
		            }
		    	});
		    });
		    $("div.boxIframeBtn a.btnNormal").click(function() {
		        top.$App.trigger('cancelDefaultFonts');
		    });
        },
        /**@inner*/
        showFamilyMenu : function(){
            
        	var self = this;
        	var width = $("#fontFamily").css('width');
			self.familyMenu = M2012.UI.PopMenu.create({
				dockElement : $("#fontFamily")[0],
	            width : width,
	            items : self.familyMenuItems,
	            maxHeight : 95,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	                //alert("子项点击");
	            }
	        });
        },
        /**@inner*/
        showSizeMenu : function(){
        	var self = this;
        	var width = $("#fontSize").css('width');
			self.sizeMenu = M2012.UI.PopMenu.create({
				dockElement : $("#fontSize")[0],
	            width : width,
	            items : self.sizeMenuItems,
	            maxHeight : 70,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	                //alert("子项点击");
	            }
	        });
        },
        /**@inner*/
        showLineheightMenu : function(){
        	var self = this;
        	var width = $("#fontLineheight").css('width');
			self.lineheightMenu = M2012.UI.PopMenu.create({
				dockElement : $("#fontLineheight")[0],
	            width : width,
	            items : self.lineheightMenuItems,
	            maxHeight : 70,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	                //alert("子项点击");
	            }
	        });
        },
        /**@inner*/
        showColorMenu : function(){
        	var self = this;
        	self.colorMenu.$el.show();
        	if(self.lineheightMenu && self.lineheightMenu.$el){
                self.lineheightMenu.$el.remove();
            }
        	var target = $("#fontColor")[0];
        	var dockElement = self.colorMenu.$el[0];
			M139.Dom.dockElement(target, dockElement);
        	// 绑定全局事件单击隐藏
            M139.Dom.bindAutoHide({
                action: "click",
                element: dockElement,
                stopEvent: true,
                callback: function(data){
                	self.colorMenu.$el.hide();
	                M139.Dom.unBindAutoHide({ action: "click", element: dockElement});
                }
            });
            top.$Event.stopEvent(event);
        },
        /**@inner*/
        getSizeText : function(intSize){
        	var map = {
                6 : "一号",
                5 : "二号",
                4 : "三号",
                3 : "四号",
                2 : "五号",
                1 : "六号"
            };
            return map[intSize];
        },
        /**@inner*/
        getPxSize:function(fontSizeText){
            if (/\d+$/.test(fontSizeText)) {
                fontSizeText = ({
                    6: "xx-large",
                    5: "x-large",
                    4: "large",
                    3: "medium",
                    2: "small",
                    1: "x-small"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
        },
        /**@inner*/
        getLineHeightText : function(intLineHeight){
            var map = {
                1.2 : "单倍",
                1.5 : "1.5倍",
                2   : "2倍",
                2.5 : "2.5倍"
            };
            return map[intLineHeight];
        },
        /**@inner*/
        getFontObj : function(){
        	var obj = {};
        	var jPreviewFont = $("#previewFont");
	    	var size = jPreviewFont.attr('size');
	    	var family = jPreviewFont.attr('fam');
	    	var color = jPreviewFont.attr('color');
            var lineHeight = jPreviewFont.attr('lineHeight');
	    	obj.size = size;
	    	obj.family = family;
	    	obj.color = color;
            obj.lineHeight = lineHeight;
	    	return obj;
        },
        /**@inner*/
        callApi : function(data, callback){
        	top.M139.RichMail.API.call("user:setAttrs", data, function(result){
        		if(callback){
        			callback(result);
        		}
	        });
        }
	}));
    defaultFontView = new M2012.Compose.View.DefaultFont();
})(jQuery, _, M139);
