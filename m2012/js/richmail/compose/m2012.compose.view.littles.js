/**
* @fileOverview 截屏，插入表情以及底部复选框等功能视图层.
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Littles', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "#moreOptions",
        name : "littles",
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
        	this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        // 渲染复选框 
        render : function(pageType, dataSet){
        	if(pageType == "draft"){
		        $("#chkSaveToSentBox").attr('checked', Boolean(dataSet.saveSentCopy));
		    }
		    if(dataSet.priority == 1) {
		        $("#chkUrgent").attr('checked', true);
		    }
		    if(dataSet.requestReadReceipt == 1) {
		        $("#chkReceipt").attr('checked', true);
		    }
		    if(dataSet.replyNotify == 1){
		    	$("#replyNotify").attr('checked', true);
		    }
        },
		initEvents : function (){
			var self = this;
			$("#showMoreOptions").toggle(function(){
				BH({key : "compose_moreoper"});
				
				$(this).attr('class','i_2trid');
				$("#moreOptions").show();
				self.model.adjustEditorHeight(-self.model.containerHeight['moreOptions']);
				//$("#htmlEdiorContainer div.eidt-body").css("height", "-="+self.model.containerHeight['moreOptions']);
			},function(){
				$(this).attr('class','i_2tridd');
				$("#moreOptions").hide();
				self.model.adjustEditorHeight(self.model.containerHeight['moreOptions']);
				//$("#htmlEdiorContainer div.eidt-body").css("height", "+="+self.model.containerHeight['moreOptions']);
			});
        	
        	$("#chkUrgent").bind('click', function(event){
        		BH({key : "compose_moreoper_urgent"});
        	});
        	$("#chkReceipt").bind('click', function(event){
        		BH({key : "compose_moreoper_receipt"});
        	});
        	$("#chkSaveToSentBox").bind('click', function(event){
        		BH({key : "compose_moreoper_savetosendbox"});
        	});
        }
    }));
})(jQuery, _, M139);

