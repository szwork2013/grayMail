/**
* @fileOverview 邮件列表和读信页加星标和取消星标
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 邮件列表和读信页加星标和取消星标
    */   
         
    M139.namespace('M2012.ChangeStar.View', superClass.extend({

        /**
        *@lends M2012.ChangeStar.View.prototype
        */

    el:"body",

    events: {
        //"hover [name=tag_starmail]": "hoverStar",
        "click [name=stardel]": "deleteStar",
        "click [name=list_starmail]":"clickStar",
        "click [name=read_starmail]":"clickStar"
    },
    
    initialize: function(){
       var self=this;
       this.model=new M2012.ChangeStar.Model();
      
       $App.on('markstar',function(args){
            var mid = args.mid;
            self.el = "#list_star_" + mid + ",#rsession_star_" + mid + ",#rsm_star_" + mid + ",#list_left_star_" + mid;   
            if (args.value == 1) {
                var stariconInTitle = $("#readmail_" + mid + " h2").find('[name=read_starmail]')[0];
                stariconInTitle && (stariconInTitle.className = "i_star_y");
                if ($App.isSessionMode()) { //会话模式，保持原来的星标
                    $("#readmail_" + mid + " h2").find('[name=read_starmail]')[0].className = "i_star_y";
                    self.addStar();
                } else {
                    //if ($("#readmail_" + mid + " [name=tag_starmail]").length == 0) { //避免重复
                    $("#readmail_" + mid + " h2").find('[name=read_starmail]')[0].className = "i_star_y";
                    BH("mailbox_markStar");
                    //}
                }

            } else {
                self.removeStar();
                $("#readmail_" + mid + " h2").find('[name=read_starmail]')[0].className = "i_star";
            }
       });

        //新会话邮件星标
        $App.off("changeCovStar").on("changeCovStar",function(args){
            if(args){
                var options = args.options,
                    callback = args.callback;
                self.model.UpdatStar(options,function(){
                    callback && callback();
                    appView.trigger("changeStar",{}); //同步刷新
                    appView.trigger('reloadFolder', { reload: true });
                })
            }
        });
       
       return superClass.prototype.initialize.apply(this, arguments);
       
    },
    hoverStar:function(sender){
        var target = sender.srcElement || sender.target;
        if ($(target).attr("name") != "tag_starmail") { //如果不是当前元素，冒泡到上级一直找到tagItem
            target = $(target).parents("[name=tag_starmail]");
        }
        if ($(target).hasClass("stardel-on")) {
            $(target).removeClass("stardel-on");
        } else {
            if ($(target).attr("name") == "tag_starmail") {
                $(target).addClass("stardel-on");
            }
        }
    },
    deleteStar: function (e) {
       
        M139.Event.stopEvent(e);
        var target = e.srcElement || e.target;
        
        var mid = $(target).parents("[mid]").attr("mid");
		var sessionId = $(target).parents("[sessionId]").attr("sessionId");

        if( $App.isSessionMode() && $App.getCurrentTab().group === "mailbox" && sessionId ){
            this.model.set({ 'ids': null, sessionIds:[Number(sessionId)], value: 0 });
        }else{
            this.model.set({ 'ids': [mid], sessionIds:null, value: 0 });
        }

		var callback = function(){
			$App.trigger("showMailbox", { comefrom: "commandCallback" });
			$App.trigger("refreshSplitView");//刷新分栏		
		};
		
        this.update(callback);
        $(target).parents("[name=tag_starmail]").remove();
		$("#readmail_" + mid + " [name=tag_starmail]").remove();
        //$App.trigger("mailboxDataChange");

    },
    //点击星标
    clickStar: function (e) {
        var self = this;
        var elem = $(e.currentTarget);
        var mid;
        var sessionId=elem.parents("[sessionId]").attr("sessionId");
        if (elem.attr("name") == "read_starmail") {
            mid = elem.parents("div[mid]").attr("mid");
            BH("readmail_star")
        } else {
            mid = elem.parents("tr").attr("mid");
            BH("mailbox_star2")
        }
        var flag = (elem.hasClass("i_star") || elem.hasClass("i_starM")) ? 1 : 0;
        this.starCommand(mid,sessionId,flag);
        /*
        var id = elem.attr("id");
        var ids = [];
        ids.push(mid);
        self.el = "#list_star_" + mid + ",#rsession_star_" + mid + ",#rsm_star_" + mid + ",#list_left_star_" + mid;
        self.model.set({'ids':ids,value:elem.hasClass("i_star_y") ? 0 : 1});
		var callback = function(){
			appView.trigger("changeStar"); //同步刷新
			appView.trigger('reloadFolder', { reload: true });
		};
        self.update(callback); */
    },
    starCommand:function(mid,sessionId,flag){
        var args = { type: "starFlag", value: flag };
        args.command = "mark";
        args.mids = [mid];
        args.mailtype ="";
        args.sessionIds=sessionId;
        $App.trigger("mailCommand", args);
    },
    //标记星标
    addStar:function(){
        var self = this;
        $(self.el).addClass("i_star_y");
        //$(self.el).attr("title",'取消星标');
        $(self.el).attr("val", 1);
        BH("mailbox_markStar");
    },
    
    //取消星标
    removeStar: function () {
        
        var self = this;
        $(self.el).removeClass("i_star_y");
        //$(self.el).attr("title",'标记星标');
        $(self.el).attr("val", 0);
        BH("mailbox_markStar");

        $App.trigger("changeStar") 
    
    },
    
    update:function (callback){
        var self=this;
        var action = self.model.get("value");
        self.model.UpdatStar(null, function(result){
            if (result > 0) {
	            action == 0 ? self.removeStar() : self.addStar() 
	        }
			callback && callback();
        });   
       
    }

}));


$(function(){
    var changestarview = new M2012.ChangeStar.View();
})

})(jQuery, _, M139);    