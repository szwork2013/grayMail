/**
* @fileOverview 写信视图层.
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Main', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "compose",
        events: {
         
      
           
            
        },

        initialize: function (options) {
            this.model = options.model;
          
            //this.loadData();
            return superClass.prototype.initialize.apply(this, arguments);
        },
		
		
		/**
		 * 组装邮件信息 
		 */
		buildMailInfo : function(action, callback){
			if (this.model.composeId) {
	            this.model.mailInfo['id'] = this.model.composeId;
	        }
	        if (this.model.messageId) {
	            this.model.mailInfo['messageId'] = this.model.messageId;
	        }
	        if(this.model.draftId){
	        	this.model.mailInfo['mid'] = this.model.draftId;
	        }
			var txtSubject = $("#txtSubject");
			this.model.mailInfo['account'] = M139.Text.Html.decode(senderView.getSender());
			this.model.mailInfo['to'] = addrInputView.toRichInput.getValidationItems().join(',');
			this.model.mailInfo['cc'] = addrInputView.ccRichInput.getValidationItems().join(',');
			this.model.mailInfo['bcc'] = addrInputView.bccRichInput.getValidationItems().join(',');
			
			this.model.mailInfo['showOneRcpt'] = $("#aAllToOne").attr('showOneRcpt')?$("#aAllToOne").attr('showOneRcpt'):0;
			this.model.mailInfo['subject'] = txtSubject.val();
            
            // 设置签名图片地址, 电子名片服务器不能访问,暂时替换,等后台更改了可删除
            var remoteAttachment = this.model.handlerSignImags();

            var letterContent = htmlEditorView.getEditorContent();
            this.model.mailInfo['content'] = letterContent;

			this.model.mailInfo['priority'] = $("#chkUrgent")[0].checked ? 1 : 3;
			this.model.mailInfo['requestReadReceipt'] = $("#chkReceipt")[0].checked ? 1 : 0;
			this.model.mailInfo['saveSentCopy'] = $("#chkSaveToSentBox")[0].checked ? 1 : 0;
			this.model.mailInfo['inlineResources'] = 1;
			this.model.mailInfo['scheduleDate'] = timingView.getScheduleDate();
			this.model.mailInfo['normalizeRfc822'] = 0;

			if(remoteAttachment.length > 0){
				this.model.mailInfo['remoteAttachment'] = remoteAttachment;
			}else{
				delete this.model.mailInfo['remoteAttachment'];
			}
			this.model.fixBase64FileSize();//为了适应mbox:compose接口，在回复和转发时fileSize是base64后的值
			// 设置附件
			this.model.mailInfo['attachments'] = this.model.composeAttachs;

			//设置主题色值
			var headerValue = txtSubject.attr('headerValue');
	        if(txtSubject.attr('headerValue')){
	            this.model.mailInfo['headers'] = {
	                "X-RM-FontColor": headerValue
	            }
	        }else{
	        	delete this.model.mailInfo['headers'];
	        }
    		if (Arr_DiskAttach.length > 0 && action == this.model.actionTypes['DELIVER']) {
    			this.resolveLargeAttachs(action, callback);
		    }else{
		    	this.callComposeApi(action, callback);
		    }
		},
		// 将下载大附件的html代码添加到文件正文
		resolveLargeAttachs : function(action, callback){
			var self = this;
			// 调服务端接口获取大附件的下载地址
			self.model.mailFileSend(Arr_DiskAttach, function(result){
				if(result.responseData && result.responseData.code == 'S_OK'){
					var fileList = result.responseData['var']['fileList'];
    				var urlCount = 0;
    				for(var j = 0,len = fileList.length;j < len;j++){
    					var mailFile = fileList[j];
    					for (var i = 0,diskLen = Arr_DiskAttach.length;i < diskLen; i++) {
                            var diskFile = Arr_DiskAttach[i];
                            if ((mailFile.fileId === diskFile.fileId || mailFile.fileName == diskFile.fileName) && !diskFile.getIt) {
                                diskFile.getIt = true;
                                diskFile.downloadUrl = mailFile.url;
                                diskFile.exp = mailFile.exp;
                                urlCount++;
                                break;
                            }
                        }
    				}
	                if (urlCount == Arr_DiskAttach.length) {
	                	self.model.mailInfo['content'] += getDiskLinkHtml();
						debugger;
	                } else {
	                    console.log('获取大附件下载地址有误！！');
	                }
				}else{
					console.log('获取大附件下载地址失败！！');
				}
			});
		}

       
        
      
		
       
     
    
        
    }));
})(jQuery, _, M139);

