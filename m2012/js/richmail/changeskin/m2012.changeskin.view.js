/**
* @fileOverview 信纸视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.ChangeSkin.View', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "M2012.ChangeSkin.View",
        template: [ '<ul class="skinList">',
        			'<!--item start-->',
					 '<li name="$name">',
					     '<a href="javascript:void(0)" bh="$name">',
						     '<i class="@getClass()"></i>',
						 	 '<img src="$thumbnail">',
						 	 '<br><span>$text</span><i></i>',
					     '</a>',
					 '</li>',
					 '<!--item end-->',
					 '</ul>'].join(""),
		logger : new top.M139.Logger({
			name : "M2012.ChangeSkin.View"
		}),			 
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
		render : function(index){
			var self = this;
			self.repeater = new Repeater(self.template);
			self.repeater.Functions = self.model.renderFunctions;

			BH("skin_page_load");
			renderFreeSkins();
			renderVipSkins();
			
			self.chooseSkin(top.$User.getSkinName());
            function renderFreeSkins(){// 渲染免费皮肤
            	var freeSkins = self.model.getFreeSkins();
	            var freeHtml = self.repeater.DataBind(freeSkins);
	            $("#freeSkins").append(freeHtml);
            };
            function renderVipSkins(){//  渲染付费皮肤
            	 var vipSkins = self.model.getVipSkins();
	             var vipHtml = self.repeater.DataBind(vipSkins);
	             $("#vipSkins").append(vipHtml);
            };
		},
        initEvents : function (){
        	var self = this;
        	$("ul.skinList li").click(function(event){
        		var skinName = $(this).attr('name');
        		self.changeSkin(skinName);
        	});
        	
        	self.model.on("change:curSkinName", function(){
				self.chooseSkin();
				
				var skinName = self.model.get('curSkinName');
				top.$App.trigger('loadSkin', {skinName : skinName});
        	});

        	top.$App.on('EvochangeSkin', function (skinName) {
        	    self.changeSkin(skinName.skinName);
        	})
        },

        changeSkin:function(skinName){
            var self = this;
            if (skinName === top.$User.getSkinName()) {
                return;
            }

            self.model.set('curSkinName', skinName);

            var skinObj = self.model.getSkinByName(skinName);
            if ($.isEmptyObject(skinObj)) return;
            if (!self.model.isPermission(skinObj)) {
                var skinLevel = skinObj.level;
                self.model.showTipWords(skinLevel);
            } else {
                var options = { value: skinName };
                self.model.setSkin(options);
            }
        },
        // 为当前用户使用的皮肤添加选中样式
		chooseSkin : function(skinName){
			var self = this;
			$("ul.skinList li").find('a').removeClass('on');
			$("ul.skinList li").find('i').removeClass('check');
			
			var skinName = skinName || self.model.get('curSkinName');
			var selector = "ul.skinList li[name='"+skinName+"']";
			$(selector).find('a').addClass('on');
			$(selector).find('i').addClass('check');
		}
    }));
    changeSkinModel = new M2012.ChangeSkin.Model();
    changeSkinView = new M2012.ChangeSkin.View({model : changeSkinModel});
    changeSkinView.render();
    changeSkinView.initEvents();
})(jQuery, _, M139);

