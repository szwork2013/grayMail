/**
 * 邮箱助手提醒类
 * @example
 * M139.UI.TipActiveView.show();
 */
M139.core.namespace("M139.UI.TipActiveView", Backbone.View.extend({
    initialize: function (options) {
    }
}));
(function(jQuery,_,M139){
	jQuery.extend(M139.UI.TipActiveView,{
		locationHrefId  :34,	//从工具登录过来
		href:'https://chrome.google.com/webstore/search-extensions/139%E9%82%AE%E7%AE%B1%E5%8A%A9%E6%89%8B?hl=zh-CN',
		title:"尊敬的139邮箱用户",
		imgSrc:'mail-rb_chrome.jpg',
		show:function(){
	        if($BMTips.isUserOpen($BMTips.types['active'])){return;}
	  		 //判断是否为chrome内核,判断是否从首页跳过来
			var isChrome = top.$B.is.chrome;
	    	var isFromHasTool = $T.Url.queryString("id") == M139.UI.TipActiveView.locationHrefId;
	    	
			if (isChrome && !isFromHasTool) {//webkit浏览器并且非助手过来
			    var param = { href:M139.UI.TipActiveView.href,
							  remember:"top.$BMTips.remember('active');",
							  src:top.$App.getResourceHost()+"/m2012/images/global/"+M139.UI.TipActiveView.imgSrc
							};
				var content = top.$T.Utils.format(M139.UI.TipActiveView._template,param);
				$BTips.addTask({width:338,
								title:M139.UI.TipActiveView.title,
								content:content,
								bhShow:{actionId:104183,thingId:1,moduleId:19},
								bhClose:'助手tip关闭',
								timeout:15000
							   });
		 	}
		},
		_template:[ '<div class="imgInfo imgInfo-rb chrom-tips-rb">',
	                '<a target="_blank" bh="助手tip跳转" href="{href}"><img src="{src}"></a>',
	                 '<p class="topline">',
	                     '<a target="_blank" bh="助手tip跳转" href="{href}">139邮箱助手</a>全新上线，用插件武装你的浏览器！',
	                 '</p>',
	                 '<p class="mt_10 mb_5 clearfix">',
	                    '<a href="{href}" bh="助手tip跳转" target="_blank" class="fr">马上去试试<span class="f_st">&gt;&gt;</span></a> <a bh="助手tip不再提醒" href="javascript:{remember};void(0);" class="c_999 no_tips">不再提醒</a>',
	                 '</p>',
	             '</div>'].join("")
	})
})(jQuery,_,M139);