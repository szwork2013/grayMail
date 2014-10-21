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
﻿/**
* @fileOverview 列表页工具栏邮件归档功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 列表页工具栏历史邮件归档
    */   
         
    M139.namespace('M2012.FileMail.View', superClass.extend({

    /**
    *@lends M2012.FileMail.View.prototype
    */
    
    el:"body",

    initialize: function(){   
        this.model = new M2012.FileMail.Model();
        return superClass.prototype.initialize.apply(this, arguments);       
    },
    
    template:{
        list:[ 
        '<fieldset class="boxIframeText" style="margin-left:40px;">',
            '<legend class="hide">邮件归档</legend>',
            '<ul class="form mailGd p_relative">',
                '<li class="formLine">',
                '<label class="label">选择归档方式：</label>',
                '<div class="element">',
                 '<div class="mb_5 clearfix">',
                   '<label class="label2"><input type="radio" value="0" name="filemessage" rel="3"  id="filebytime" checked="checked" />按时间归档</label>',
                   '<div class="dropDown p_relative">',
                     '<div id="filebytime_div">',
                       '<div class="dropDownA" id="filebytime_con"><i class="i_triangle_d"></i></div>',
                       '<div class="dropDownText" id="filebytime_select" >3个月前的邮件</div>',
 				        '<div id="filebytime_menu" class="menuPop shadow" style="display:none;width:125px;left:-1px;top:23px;">',
 				            '<ul>',
 						    '{0}',     
 					        '</ul>',
 				        '</div>',
                     '</div>',
                   '</div>',
                 '</div>',
                 '<div class="mb_5 clearfix">',
               	    '<label class="label2"><input type="radio" name="filemessage" id="filebynumber" rel="10000" value="1" />按封数归档</label>',
                   '<div class="dropDown p_relative">',
                     '<div id="filebynumber_div" class="gray">',
                       '<div  class="dropDownA" id="filebynumber_con"><i class="i_triangle_d"></i></div>',
                       '<div class="dropDownText" id="filebynumber_select">较旧的10000封</div>',
 				      '<div id="filebynumber_menu" class="menuPop shadow" style="display:none;width:125px;left:-1px;top:23px;">',
                        '<ul>',
                        '{1}',
                        '</ul>',
 					    '</div>	',
                     '</div>',
                   '</div>',
                 '</div>',
               '</div>',
             '</li>',
             '<li class="formLine">',
               '<label class="label">邮件归档到：</label>',
                 '<div class="element">',
                     '<input type="text" id="filefoldername" class="iText"  maxlength="16" value="{2}" style="width:215px;" />',
                 '</div>',
 		            '<input type="hidden" name="filetype" id="filetype" />',
             '</li>',
           '</ul>',
         '</fieldset>',
         '<div class="boxIframeBtn"><span class="bibBtn"> <a class="btnSure" href="javascript:;"><span>确 定</span></a>&nbsp;<a class="btnNormal" href="javascript:;"><span>取 消</span></a> </span> </div>'
         ]
        
    
    },
   
    
    events:{
       'mouseleave  #filebytime_div'         : 'hideFileByTimeMenu',
       'click       #filebytime_select'      : 'showFileByTimeMenu',
       'click       #filebytime_con'         : 'showFileByTimeMenu',
       'mouseleave  #filebynumber_div'       : 'hideFileByNumMenu',
       'click       #filebynumber_select'    : 'showFileByNumMenu',
       'click       #filebynumber_con'       : 'showFileByNumMenu',
       'click       input[name=filemessage]' : 'selectType'
    },

    hideFileByTimeMenu:function(){
        if ($.browser.version != "7.0") {
            $("#filebytime_menu").hide();
        }; 
    },
    
    showFileByTimeMenu:function(){
        if($("#filebytime").attr("checked")){
            $("#filebytime_menu").show();
        }
    },
    
    hideFileByNumMenu:function(){
        $("#filebynumber_menu").hide();
    },
    
    showFileByNumMenu:function(){
        if($("#filebynumber").attr("checked")){
            $("#filebynumber_menu").show();
        }
    },
    
    /**
    * 选择归档类型
    */    
    selectType:function(){
        var self = this;
        var type = $(self.el).find("input[name='filemessage']:checked").val();
        var grayType = "";
        type == 0 ? type = 'time': type = 'number';
        type == 'time' ? grayType = 'number': grayType = 'time';
        $("#fileby"+type+"_div").removeClass("gray");
        $("#fileby"+grayType+"_div").addClass("gray");
        $("#filetype").val(type);
    },
    
    /**
    * 类型列表菜单选择
    * @param {number} type 0 - 日期类型  1 - 封数类型
    */
    selectFileByType:function(type){
        var self = this;
        type == 0 ? type = 'time' : type = 'number';
        $("#fileby"+type+"_menu li").click(function(){
		    var rel = $(this).find(".text").attr("rel");
            var text = $(this).find(".text").text();
		    M139.Event.stopEvent();
	        self.selectFileType(type,rel,text);	
	        $("#fileby"+type+"_menu").hide();
        });
    },
	
    /**
    * 邮件归档类型选择:按时间归档，按封数归档
    */
    selectFileType:function(type, val, title){
    
        if(type == 'time') {
            $("#filebytime_select").text(title);
            $("#filebytime").attr("rel", val);
            $("#filebytime_menu").hide();
            
        }else{
			$("#filebynumber_select").text(title);
            $("#filebynumber").attr("rel", val);
            $("#filebynumber_menu").hide();
        }   
        $("#filetype").val(type); 
    
    },
    
    render:function(){
        //top.addBehavior("点击历史邮件归档");  
        //归档文件夹名称
        var fileName = new Date();
        fileName = $Date.format("yyyy-MM",fileName).replace("-", ".");
        fileName = "归档[" + fileName + "]";
        
        
        var litemp = "<li><a href='javascript:;' ><span class='text' rel='{0}'>{1}</span></a></li>";
        
        //时间归档数据列表
        var dateList = [];
        var monthArray = this.model.get("monthArray");
        var text = "";
        var month = "";
        for(var i = 0; i< monthArray.length; i++){
            month = monthArray[i]; 
            month < 12 ? text = month + "个月前的邮件":text = (month/12) + "年前的邮件";
            dateList.push($T.Utils.format(litemp,[month,text]));
        }
        
        
        //封数归档数据列表       
        var numberList = [];
        var numArray = this.model.get("numArray");
        var text = "";
        var number = "";
        for(var i = 0; i< numArray.length; i++){
            number = numArray[i];
            text = "较旧的" + number + "封";
            numberList.push($T.Utils.format(litemp,[number,text]));
        }     
        
		var fileTemplate = this.template.list.join('');
		$(this.el).html($T.Utils.format(fileTemplate,[dateList.join(''),numberList.join(''),fileName])); 
        M139.UI.TipMessage.hide();
    },
    
    
    /**
    *  邮件归档保存
    *  step: 1.创建文件夹 2.移动邮件到新建文件夹 3.发送邮件
    **/
    saveFileMail: function() { 
        var self = this;
        var fileFolderName = $(self.el).find("#filefoldername").val(); 
        var radio = $(self.el).find('input:radio[name="filemessage"]:checked');
        var fileMessageType = radio.val(); 
        var fileMessageTypeVal = radio.attr("rel");
        var fileFid = ""; 
        
        if($App.getFolderByFolderName(fileFolderName)==undefined && !$App.checkFolderName(fileFolderName)){
            return; //验证不通过
        }
                
        self.model.set({
            fileFolderName:fileFolderName,
            fileMessageType:fileMessageType,
            fileMessageTypeVal:fileMessageTypeVal    
        });
        
        self.closeDialog();
        
        if($App.getFolderByFolderName(fileFolderName)){
		    fileFid = $App.getFolderByFolderName(fileFolderName).fid;
		    callFileMail(fileFid,self);
		}else{
		    $App.addFolder(fileFolderName,null,function(result){
                callFileMail(result.fid,self);
		    });
		}
		
		//callFileMail方便两次调用
		function callFileMail(fid,self){
            self.model.set({
                fileFid:fid   
            });
            M139.UI.TipMessage.showMiddleTip("邮件正在归档,请稍等...");
            setTimeout(function(){
                self.model.postFileMailData(function(result){
                    self.callBack(result);
                });
            },1000);
		}
    },
    
    /**
    * 归档操作回调函数
    * @param {object} data 回调数据
    */
    callBack:function(data){
        var self = this;
        if(data.responseData["code"] && data.responseData["code"]=='S_OK'){
            var result = data.responseData["var"];
            var totalNum = result.totalNum;
            var totalNewNum = result.totalNewNum;
            self.model.set({
                totalNum:totalNum,
                totalNewNum:totalNewNum
            });
            if (totalNum > 0) {
                self.fileMailSucess(totalNum,self.model.get("fileFolderName"));
            }else{
                self.fileMailFail();
            }
        }else{
            self.fileMailFail();
        }        
        M139.UI.TipMessage.hideMiddleTip();
    },
    
    /**
    * 归档成功操作
    * @param {number} totalnum 归档成功数
    * @param {string} folderName 归档文件夹 
    */
    fileMailSucess:function(totalnum,folderName){
        var self = this;
        self.closeDialog();
        var temp = $T.Utils.format(self.model.tips.sucess,[totalnum,folderName]);
        $Msg.alert(temp,
        {
            title:'邮件归档创建成功',
            dialogTitle:'邮件归档',
            icon:'ok', 
            isHtml:true,
            onClose:function(e){
                $App.showMailbox(self.model.get("fileFid")); //跳到归档文件夹
            }
        });
        self.sendMail(true);
        $App.trigger("reloadFolder", { reload: true });
        appView.trigger("showMailbox");
        BH('mailbox_archive_ok');
    },
    
    /**
    * 归档失败操作
    */
    fileMailFail:function(){
        var fid = this.model.get("fileFid");
        this.closeDialog();
        var temp = this.model.tips.fail;
        $Msg.alert(temp,{
            title:'邮件归档创建失败',
            dialogTitle:'邮件归档',
            icon:'fail', 
            isHtml:true
        });
        fid && this.deleteFolder(fid);
        this.sendMail();
        $App.trigger("reloadFolder", { reload: true });
    },
    
    /**
    * 发送邮件 
    * @param {Boolean} ok  ture - 成功  false - 失败 
    */
    sendMail:function(ok){
        var self = this;
        var userName = $App.getConfig("UserAttrs").trueName || $User.getLoginName();
        var sendDate = $Date.format("yyyy年MM月dd日 hh点mm分",$Date.getServerTime());
        var t = self.model.tips;
        if(ok){
            var item = $T.Utils.format(t.sucessItem,[self.model.get("totalNum"),self.model.get("fileFolderName")]);
            var sucess = $T.Utils.format(t.sucessEmail,[userName,sendDate,item]);            
            $App.mailToMe({
                subject:'邮件归档成功',
                content:sucess
            });            
        }else{
            var fail = $T.Utils.format(t.failEmail,[userName,sendDate]);
            //console.log(fail); 
            $App.mailToMe({
                subject:'邮件归档失败',
                content:sucess
            });                         
        }
        
    },
    
    /** 删除文件夹 归档失败时删除已创建的文件夹 **/
    deleteFolder:function(fid){
        var self = this;
        var options = {
            fid:fid,
            type:3,
            moveToFid:1
        };
        $RM.deleteFolders(options,function(){
            //$App.trigger("reloadFolder", { reload: true });          
        });
    },
    
    /**
    * 关闭对话框
    */
    closeDialog:function(){
        this.model.get("dialog").close();
    },
    
    initEvents:function(){
        var self = this;
        self.render();
        self.selectFileByType(0);
        self.selectFileByType(1);      
        //确定
        $(self.el).find("a.btnSure").live('click',function(){
            self.saveFileMail();
        })
        //取消
        $(self.el).find("a.btnNormal").live('click',function(){
            self.closeDialog();
        })	
    }
    
      
        
}));
   
})(jQuery, _, M139); 
