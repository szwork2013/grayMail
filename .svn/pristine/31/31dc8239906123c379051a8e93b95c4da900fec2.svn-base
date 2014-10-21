/**   
* @fileOverview 列表页工具栏邮件归档功能
*/

(function (jQuery, _, M139) {

/**
*@namespace 
*列表页工具栏邮件归档
*/
M139.namespace("M2012.FileMail.Model",Backbone.Model.extend({
	
    initialize: function(options){
    
    },
    
    defaults:{
	    fileMessageType:null,
	    fileMessageTypeVal:null,
	    fileFid:null,
	    fileFolderName:null,
	    totalNum:null,
	    totalNewNum:null,
	    monthArray:[1,2,3,6,12,24], //月份归档数据 单位：月
	    numArray:[10000,5000,1000,500] //封数归档数据 
	},
	
	tips:{
	    sucess:"有{0}封邮件归档到<b>{1}</b>文件夹里。",
	    fail:"抱歉！你选择的条件没有邮件被归档",
	    sucessItem:"{0}封邮件已成功归档到我的文件夹{1}",
	    sucessTitle:'邮件归档成功',
	    failTitle:'邮件归档失败',
	    sucessEmail:[
	        '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了邮件归档操作，{2}”。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p>',
            '<p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join(""),
	    failEmail:[
	        '<p style="font-weight:bold;letter-spacing:1px;line-height:26px">尊敬的{0}：</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">您在{1}执行了邮件归档操作失败。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px;">您可以手动选择要归档成功的邮件，移动到指定文件夹。</p>',
            '<p style="text-indent:2em;letter-spacing:1px;line-height:26px">感谢您使用中国移动139邮箱！</p><p style="text-indent:35em;letter-spacing:1px;line-height:26px">中国移动139邮箱</p>'].join('')
	},
	
	postFileMailData:function(callback){
	    var self = this;
	    var fileMessageType = self.get("fileMessageType"); 
	    var fileMessageTypeVal = self.get("fileMessageTypeVal");
	    var fileFid = self.get("fileFid");
	    var fileFolderName = self.get("fileFolderName");
        var startDate = "";
        var time = new Date();
        var endDate = 0;
        var olderNum = 0;
        
        //归档分类处理，时间归档和封数归档
        if (fileMessageType == 0) {
            var monthago = new Date();
            monthago.setMonth(monthago.getMonth() - fileMessageTypeVal);
            endDate = parseInt((monthago.getTime()) / 1000);
        }else{ 
            endDate = parseInt((time.getTime()) / 1000);
            olderNum = fileMessageTypeVal;
        }
        
	    var options = { 
            type: 2, //1、查询  2、即时归档
            archiveType: parseInt(fileMessageType), //0-按时间 1-按封数
            olderNum: parseInt(olderNum),
            srcFolderId: 1, //获取文件夹ID,目前只归档收件箱的
            desFolderId: fileFid,//目标文件夹ID
            startDate: 0,//邮件的开始时间
            endDate: endDate,
            keepNum: 0 //此文件夹至少保留的邮件数		
        };
            
        M139.RichMail.API.call("mbox:mailFile",options,function(result){
            if(callback){
                callback(result);
            }
        });
	    
	}
	
}));

})(jQuery, _, M139);