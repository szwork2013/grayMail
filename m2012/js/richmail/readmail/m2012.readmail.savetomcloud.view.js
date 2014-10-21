/**
* @fileOverview 邮件附件存彩云
* @Code by Sukunwei
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 邮件附件存彩云
    */

        M139.namespace('M2012.ReadMail.SaveToMcloud.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.SaveToMcloud.View.prototype
        */

        el: "",
		
		/** 
		* 初始化
		*/
        initialize: function (options) {
            var self = this;
            this.model = new M2012.ReadMail.SaveToMcloud.Model();
			return superClass.prototype.initialize.apply(this, arguments);
        },
		
		/** 
		* 定义事件 
		*/
		initEvents:function(){
			var self = this;
			top.$App.on('saveToMcloud',function(options){
				self.saveMcloudEvent(options);
			});			
		},
		
		/** 
		* 存彩云事件
		*/
		saveMcloudEvent:function(options){
			var self = this;
			//附件存彩云是否冲突
		    //self.model.checkSaveConflict();
			if (!self.model.get('saveStatus')) {
			    $Msg.alert(self.model.tips.warn);
			    return;
			}
		    //保存中提示
			self.savingToMcloudTips();
			//更新配置
			self.model.set({
				downUrl:options.downUrl,
				fileSize:options.fileSize,
				fileName:options.fileName,
				isAll:options.isAll,
				saveStatus:false 
			});
			//存彩云
			self.callSaveToMcloud();
		},
		
		/** 
		* 日志记录
		*/
        logger: new M139.Logger({name: "M2012.ReadMail.SaveToMcloud"}),

        /** 
		* 正在保存彩云
		*/
		savingToMcloudTips:function(){
			M139.UI.TipMessage.show(this.model.tips.saveStatus); 
		},
		
		/** 
		* 存彩云成功 
		*/
		saveToMcloudSuccess:function(){			
			var text = this.model.tips.oneSaveSuccess,
				name = this.model.get('isAll') ? '附件' : this.model.get('fileName');
			this.model.set({ saveStatus: true }); //解锁
			top.mcloudSaving = true;
			$('#icon_mcloudSaving').remove();
			M139.UI.TipMessage.show($T.Utils.format(text,[name]), {
				delay: 3000
            });
			BH('readmail_savemcloudsuccess');
		},
		
		/** 
		* 存彩云失败提示
		*/
		saveToMcloudFail:function(){
			$Msg.alert(this.model.tips.saveFail);
			M139.UI.TipMessage.hide();
			this.model.set({ saveStatus: true });
			top.mcloudSaving = true;
			$('#icon_mcloudSaving').remove();
		},
   
		
		/** 
		* 附件存彩云请求
		*/
		callSaveToMcloud:function(){
			var self = this;
			self.model.saveToMcloudRequest(function(response){					
			    if (response && response.code == 'S_OK') {
					setTimeout(function(){
						self.checkSaveSuccess();				
					},3000);
				}else{
					self.saveToMcloudFail(); 
				}
			});
		},
        
		/** 
		* 判断存彩云是否成功
		* 由于是异步存储，只能是轮询请求中间件判断状态
		*/
		checkSaveSuccess: function(){
			var self = this;
			var checkTime = self.model.get('checkTime');
			var maxTimer = self.model.get('maxTime');
			var timeCounter = 0;
			var timer = setInterval(function(){
				timeCounter += checkTime;
				self.model.checkSaveSuccessRequest(function(response){
					if(response && response.code == 'S_OK'){
						self.saveToMcloudSuccess();
						clearInterval(timer);
					}else{
						console.log(response); 
					}
				});
				//超时判断
				if(timeCounter > maxTimer){
					clearInterval(timer);
					self.saveToMcloudFail();
				}
			},checkTime);
			
		},
        
		render: function () {
			
		}

    }));
    
	$(function(){
		top.saveMcloudView = new M2012.ReadMail.SaveToMcloud.View();
		top.saveMcloudView.initEvents();
	});
	
	
})(jQuery, _, M139);


