/**
* @fileOverview 移动微博
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 移动微博
    */
         
    M139.namespace('M2012.Weibo.View', superClass.extend({

        /**
        *@lends M2012.Weibo.View.prototype
        */
        el:'#mobileWeibo',
        
        template:"微博<b style='font-weight:normal'>{0}</b>",
        
        initialize: function(){
		    this.model = new M2012.Weibo.Model();
		    this.initEvents();
		    return superClass.prototype.initialize.apply(this, arguments);
	    },
	    
	    initEvents: function(){
	    	var self = this;
	    },
	    
	    render: function(){
	
	        var self = this;
            var mobileWeibo = $(self.el);
            var shuokeCount = self.model.getWeiboCount();
            var temp = self.template;
            var style = '';
            var boldStyle = 'font-weight:bold';
            var html = '';

            if(shuokeCount<=0) {  
                html = $T.Utils.format(temp,['']);  
            } else if(shuokeCount<=99){
                style = boldStyle;
                html = $T.Utils.format(temp,['('+shuokeCount+')']);
            } else {
                style = boldStyle;
                html = $T.Utils.format(temp,['(99+)']);
            }

            mobileWeibo.attr("style",style).html(html);	          		         
            mobileWeibo.unbind('click');
            mobileWeibo.bind("click",function(){ //todo weibo.count
                shuokecount = 0;
                var sid = $App.getSid();
                var userName = self.model.get('data').weibo.username;
                var mobileWeiboTextDOM = document.getElementById('welcome').contentWindow.document.getElementById("shequ");
                
                if(mobileWeiboTextDOM){
                    $(mobileWeiboTextDOM).html("<a href='#'>微博</a>").show();
                }
                
                var url = self.model.get('url');
                url = $T.Utils.format(url,[sid,userName,Math.random()])
                window.LinkConfig.mobileWeibo = { url: url , site: "", title: "移动微博"};
                $App.show("mobileWeibo"); //显示欢迎页
                mobileWeibo.attr("style","").html($T.Utils.format(temp,['']));
            });
	    }
                   
}));

$(function(){
    var weiboView = new M2012.Weibo.View();
        weiboView.render();
})

    
    
})(jQuery, _, M139);    