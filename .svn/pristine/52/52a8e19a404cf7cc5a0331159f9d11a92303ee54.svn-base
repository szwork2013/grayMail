/**   
* @fileOverview 列表页工具栏清理邮件功能
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*列表页工具栏清理邮件
*/

M139.namespace("M2012.CleanMail.Model",Backbone.Model.extend({
		 
	/** 
	* @lends M2012.CleanMail.View.prototype
	*/
	
    defaults:{  
        cleanType:null,
        cleanTypeVal:null,
        totalNum:null   
    },
    
    tips:{
        sucessItem:['{0}封邮件已被删除。'].join(""),
        failItem:['您选择的条件没有邮件被删除，您可以手动删除邮件或稍后再试。'].join(''),
        checkClean:"您所选择的邮件将会被立即删除，是否立即执行邮件清理功能?",
	    sucessTitle:"邮件清理成功",
	    failTitle:"邮件清理失败",
	    
	    sucessEmail:[
	        '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了邮件清理操作，{2}封邮件被删除”。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p>',
            '<p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join(""),
	    
	    failEmail:[
	        '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了邮件清理操作失败。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px;">您可以手动删除邮件或稍后再试。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p>',
            '<p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join("")
	},
	    
	getDataSource:function(callback){
	    var self = this;
        var startDate = "";
        var time = new Date();
        var endDate = 0;
        var olderNum = 0;
        var cleanType = self.get("cleanType");
        var cleanTypeVal = self.get("cleanTypeVal");
        
        //清理邮件分类，时间清理和封数清理
        if (cleanType == 0) {
            var monthago = new Date();
            monthago.setMonth(monthago.getMonth() - cleanTypeVal);
            endDate = parseInt((monthago.getTime()) / 1000);
        }else{ 
            endDate = parseInt((time.getTime()) / 1000);
            olderNum = cleanTypeVal;
        }
        	
	    var options = { 
            type: 2, //1、查询  2、即时清理
            archiveType: parseInt(cleanType), //0-按时间 1-按封数
            olderNum: parseInt(olderNum),
            srcFolderId: 1, //欲清理的文件夹ID，目前只针对收件箱
            startDate: 0,//邮件的开始时间
            endDate: endDate,
            keepNum: 0 //此文件夹至少保留的邮件数		
        };
            
        M139.RichMail.API.call("mbox:mailClean",options,function(result){
            callback && callback(result);
        });
	}  
	
	
	 
    
}));

})(jQuery, _, M139);