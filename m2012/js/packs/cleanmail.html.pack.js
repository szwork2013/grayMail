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
﻿/**
* @fileOverview 列表页工具栏邮件清理功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 列表页工具栏邮件清理
    */   
         
    M139.namespace('M2012.CleanMail.View', superClass.extend({

    /**
    *@lends M2012.CleanMail.View.prototype
    */
    
        el:"",
        
        template:{
             list:['<fieldset class="boxIframeText">',
               '<dl class="form mailClear p_relative">',
                 '<dt class="formLine" style="padding-bottom:5px">清理邮件，为您的邮箱提速：</dt>',
                 '<dd class="formLine">',
                   '<div class="mb_5 clearfix">',
                     '<label class="label2" for="cleanbytime"><input type="radio" name="cleantype" id="cleanbytime" value="0" rel="3" checked="checked" />按时间清理</label>',
                     '<div class="dropDown p_relative">',
                       '<div id="cleanbytime_div">',
                         '<div class="dropDownA" href="javascript:void(0)" id="cleanbytime_ico"><i class="i_triangle_d"></i></div>',
                         '<div class="dropDownText" id="cleanbytime_select">三个月前邮件</div>',
                         '<div class="menuPop shadow" id="cleanbytime_menu" style="display:none;width:125px;left:-1px;top:23px;">',
                             '<ul>',
                                 '<li><a  href="javascript:;"><span class="text" rel="3">三个月前邮件</span></a></li>',
                                 '<li><a  href="javascript:;"><span class="text" rel="6">半年前的邮件</span></a></li>',
                                 '<li><a  href="javascript:;"><span class="text" rel="12">一年前的邮件</span></a></li>',
                                 '<li><a  href="javascript:;"><span class="text" rel="24">两年前的邮件</span></a></li>',
                                 '<li><a  href="javascript:;"><span class="text" rel="36">三年前的邮件</span></a></li>',
                             '</ul>',
                         '</div>    ',
                       '</div>',
                     '</div>',
                   '</div>',
                 '</dd>',
                 '<dd class="formLine">',
                   '<div class="mb_5 clearfix">',
                     '<label class="label2" for="cleanbynumber"><input type="radio" name="cleantype" id="cleanbynumber" value="1" rel="15000" />按封数清理</label>',
                     '<div class="dropDown p_relative" >',
                       '<div id="cleanbynumber_div" class="gray">',
                         '<div class="dropDownA" href="javascript:void(0)" id="cleanbynumber_ico"><i class="i_triangle_d"></i></div>',
                         '<div class="dropDownText" id="cleanbynumber_select">较旧的15000封</div>',
                         '<div class="menuPop shadow" id="cleanbynumber_menu" style="display:none;width:125px;left:-1px;top:23px;">',
                             '<ul>',
                               '<li><a  href="javascript:;"><span class="text" rel="15000">较旧的15000封</span></a></li>',
                               '<li><a  href="javascript:;"><span class="text" rel="10000">较旧的10000封</span></a></li>',
                               '<li><a  href="javascript:;"><span class="text" rel="8000">较旧的8000封</span></a></li>',
                               '<li><a  href="javascript:;"><span class="text" rel="5000">较旧的5000封</span></a></li>',
                             '</ul>',
                         '</div>',
                       '</div>',
                     '</div>',
                   '</div>',
                 '</dd>',
                 '<dd class="formLine" style="display:">符合条件的邮件将会立即删除</dd>',
               '</dl>',
             '</fieldset>',
             '<div class="boxIframeBtn">',
                '<span class="bibText"> </span>',
                '<span class="bibBtn">',
                    '<a href="javascript:;" class="btnSure" ><span>确 定</span></a>&nbsp;',
                    '<a href="javascript:;" class="btnNormal"><span>取 消</span></a>',
                '</span>',
             '</div>'
             ].join("")
        },     
        
        initialize: function(){   
            this.model =  new M2012.CleanMail.Model();   	
            return superClass.prototype.initialize.apply(this, arguments); 
        },    
        
        render:function(){
            var temp = this.template.list;
            $(this.el).html(temp);
            M139.UI.TipMessage.hide();
        },
       
        initEvents:function(){
            
            var self = this;
            self.render();
            
            $("#cleanbytime_div,#cleanbynumber_div").mouseleave(function(){
                $(this).find(".menuPop").hide();
            });
            
            $("#cleanbytime_ico,#cleanbytime_select").click(function(){
                if($("input[name='cleantype']:checked").val() == 0){
                    $("#cleanbytime_menu").show();
                }
            });
            
            $("#cleanbynumber_ico,#cleanbynumber_select").click(function(){
                if($("input[name='cleantype']:checked").val() == 1){
                    $("#cleanbynumber_menu").show();
                }  
            });
            
            $("input[name='cleantype']").click(function(){
                var cleanbynumber = $("#cleanbynumber_div");
                var cleanbytime = $("#cleanbytime_div");
                if($(this).val() == 0){
                    cleanbynumber.addClass("gray");
                    cleanbytime.removeClass("gray");
                }else{
                    cleanbytime.addClass("gray");
                    cleanbynumber.removeClass("gray");
                }
            });
            
            $("#cleanbytime_menu li").click(function(){
                var span = $(this).find(".text");
                var rel = span.attr("rel");
                var text= span.text();
                $("#cleanbytime").attr("rel",rel);
                $("#cleanbytime_select").html(text);
                $("#cleanbytime_menu").hide();
                
            })

            $("#cleanbynumber_menu li").click(function(){
                var span = $(this).find(".text");
                var rel = span.attr("rel");
                var text= span.text();
                $("#cleanbynumber").attr("rel",rel);
                $("#cleanbynumber_select").html(text);
                $("#cleanbynumber_menu").hide();
            })
            
            //确定
            $(self.el).find("a.btnSure").live('click',function(){
                self.checkClean();
            })
            
            //取消
            $(self.el).find("a.btnNormal").live('click',function(){
                self.closeDialog();
            })
             
        },

        /**
        * 关闭对话框
        */
        closeDialog:function(){
            this.model.get("dialog").close();
        }, 

        /**
        *清理操作二次确认 
        */
        checkClean: function(){
            var self = this;
            $Msg.confirm(
                    self.model.tips.checkClean,
                    function(){
                        self.doCleanMail();
                    },
                    {
                        buttons:["是","否"],
                        dialogTitle:'邮件清理'
                    }
            );
        },
    
        /**
        * 邮件清理提交
        * step: 1.统计 2.清理
        */
        doCleanMail: function() { 
            //top.addBehavior("点击邮件清理");
            var self = this;
            var radio = $(self.el).find('input:radio[name="cleantype"]:checked');
            var cleanType = radio.val(); 
            var cleanTypeVal = radio.attr("rel");
            self.model.set({
                cleanType:cleanType,
                cleanTypeVal:cleanTypeVal
            });
            self.closeDialog();
            M139.UI.TipMessage.showMiddleTip("邮件清理中，请稍后...");
            setTimeout(function(){
                self.model.getDataSource(function(data){
                    self.callBack(data);
                    M139.UI.TipMessage.hideMiddleTip();
                });            
            },1000);
        },
        
        /**
        * 邮件清理回调函数
        */
        callBack:function(data){
            var self = this;
            if(data.responseData["code"] && data.responseData["code"]=='S_OK' && data.responseData["var"]){
                var result = data.responseData["var"];
                var totalNum = result.totalNum;
                self.model.set({totalNum:totalNum});
                totalNum > 0 && self.cleanSucessDo();
                totalNum == 0 && self.cleanFailDo();
            }else{
                self.cleanFailDo();
            }
        },
    
        /**
        * 邮件清理成功操作
        */
        cleanSucessDo:function(){
            BH('mailbox_clean_ok');
            var total = this.model.get("totalNum");
            var html = $T.Utils.format(this.model.tips.sucessItem,[total]);
            $Msg.alert(html,{
                title:'邮件清理成功',
                dialogTitle:'邮件清理',
                icon:'ok', 
                isHtml:true
            });
            this.sendMail(true);
            $App.trigger("reloadFolder", { reload: true });
            appView.trigger("showMailbox");
        },

        /**
        * 邮件清理失败操作
        */
        cleanFailDo:function(){
            //top.addBehavior("清理邮件失败");
            this.closeDialog();       
            var html = this.model.tips.failItem;
            //console.log(html);
            $Msg.alert(html,{
                title:'邮件清理失败',
                dialogTitle:'邮件清理',
                icon:'fail', 
                isHtml:true
            });
            this.sendMail();
        },
        
        /**
        * 发送邮件 
        * @param {Bollean} ok true - 成功  false - 失败
        */
        sendMail:function(ok){
            var self = this;
            var t = self.model.tips;
            var userName = $App.getConfig("UserAttrs").trueName || $User.getLoginName();
            var sendDate = $Date.format("yyyy年MM月dd日 hh点mm分",$Date.getServerTime());
            if(ok){
                var sucess = $T.Utils.format(t.sucessEmail,[userName,sendDate,self.model.get("totalNum")]);            
                $App.mailToMe({
                    subject:'邮件清理成功',
                    content:sucess
                });
            }else{
                var fail = $T.Utils.format(t.failEmail,[userName,sendDate]);
                //console.log(fail); 
                $App.mailToMe({
                    subject:'邮件清理失败',
                    content:fail
                });           
            }
        }
        
        
}));
    
})(jQuery, _, M139);    
