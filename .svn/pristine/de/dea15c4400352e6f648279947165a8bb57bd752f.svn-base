/**
* @fileOverview 飞信同窗
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 飞信同窗
    */
         
    M139.namespace('M2012.Fetionspace.View', superClass.extend({

        /**
        *@lends M2012.Fetionspace.View.prototype
        */
        el:'#fetionSpace',
        
        template:"同窗<b style='font-weight:normal'>{0}</b>",
        
        initialize: function(){
		    this.model = new M2012.Fetionspace.Model();
		    this.initEvents();
		    return superClass.prototype.initialize.apply(this, arguments);
	    },
	    
	    initEvents: function(){
	    	
	    },
	    
	    render: function(){
	        var self = this;
            var factionSpace=$(self.el);
            var fesionSpaceCount = self.model.getFetionCount();
            var fetionCredential = self.model.getFetionCredential();
            var temp = self.template;
            var style = '';
            var boldStyle = 'font-weight:bold';
            var html = '';

            if(fesionSpaceCount<=0) {  
                html = $T.Utils.format(temp,['']);  
            } else if(fesionSpaceCount<=99){
                style = boldStyle;
                html = $T.Utils.format(temp,['('+fesionSpaceCount+')']);
            } else {
                style = boldStyle;
                html = $T.Utils.format(temp,['(99+)']);
            }

            factionSpace.attr("style",style).html(html);	          		         
            factionSpace.unbind('click');
            factionSpace.bind("click",function(){
            if(fetionCredential){
                fesionSpaceCount = 0;
                factionSpace.attr("style","").html($T.Utils.format(temp,['']));
                var url = self.model.get('url');
                url = $T.Utils.format(url,[$App.getSid(),fetionCredential,Math.random()]);
                window.LinkConfig.fetionSpace = { url: url , site: "", title: "飞信同窗"};
                $App.show("fetionSpace"); //显示欢迎页
                 
                 //修改首页面数据
                 /*
                 if(document.getElementById('welcome').contentWindow.document.getElementById("linkFetion")){
                    document.getElementById('welcome').contentWindow.document.getElementById("linkFetion").innerHTML="同窗";
                 }*/
                    
                }else{
                    $Msg.alert("正在加载中...");
                }

            });
		    
		    
	    }
                   
}));

var fetionspaceView = new M2012.Fetionspace.View();
    fetionspaceView.render();
    
    
})(jQuery, _, M139);    