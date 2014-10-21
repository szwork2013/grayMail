/**
* @fileOverview 设置真实姓名视图层.
*/
/**
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.SetTruename', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
		template : ['<div class="imgInfo imgInfo-rb">',
						 '<a class="imgLink" href="javascript:void(0)" title="图片"><i class="i_warn"></i></a>',
						 '<dl>',
							 '<dt><strong>您还没有设置发件人姓名，现在设置吧！</strong></dt>',
							 '<dd class="gray">让对方轻松识别是您的邮件，请输入您的姓名</dd>',
							 '<dd class="pt_10">我的姓名：<input type="text" class="iText gray" id="composeTruename" maxlength="12" value="如：销售部-张飞" style="width:150px"/></dd>',
							 '<dd class="pt_10"><span id="composeTruenameTip" class="red"></span></dd>',
						 '</dl>',
					'</div>'].join(""),
        name : "setTruename",
        tipMessage : {
        	empty : '请填写发件人姓名',
        	format : '发件人姓名只能包括文字、数字、空格和下划线'
        },
        initialize: function (options) {
        	//this.model = options.model;
        	this.options = options || {callback : function(){}};
        	this.callback = this.options.callback;
        	this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render : function(){
        	var self = this;
        	self.dialog = top.$Msg.showHTML(
                self.template,
                function(e){
                	e.cancel = true;
                	self.confirmCallback(e);
                },
                function(e){
                	self.dialog.close();
                },
                {   
                    onClose:function(e){
                    },
                    width:370,
                    buttons:['保存并发送','取消'],
                    dialogTitle:'系统提示'
                }
            );
            self.dialog.on('close', function(e){
            	self.dialog.off('close');
            	self.callback();
            });
            
            top.$App.setUserCustomInfo('20', '1');
            self.$el = $(self.template);
            self.$name = $("#composeTruename");
        	self.$tip = $("#composeTruenameTip");
        	//self.$name.val(top.$Mobile.remove86(top.$User.getUid())).select();
			self.$name.focus(function(){
				$(this).hasClass('gray') && $(this).removeClass('gray').val('');
			});
        },
        /*inner*/
        confirmCallback : function(e){
        	var self = this;
			//top.addBehaviorExt({actionId:100345, thingId:1,actionType:10});
			if(!self.checkTruename()){
				return;
			}
			var trueName = $.trim(self.$name.val());
			if (self.busy) {
                return;
            }
			//self.callApi({senderName : trueName}, function(result){
			self.callApi({AddrFirstName : trueName}, function(result){
				if(result.ResultCode && result.ResultCode == '0'){
					top.$App.trigger("userAttrChange", {
                        trueName: trueName,
                        callback: function () {
                        }
                    });
					self.dialog.close();
					top.BH('compose_settruenamesuccess');
	            }else if(result.ResultCode == '24577'){
	            	self.$tip.text("发件人姓名有误，请重新输入。");
	            }else{
	            	self.$tip.text("发件人姓名更新失败");
	            }
	            self.busy = false;
			});
			self.busy = true;
        },
        /*inner*/
		checkTruename : function(){
			var self = this;
			var reg = /^(\s*[_a-zA-Z0-9\u4e00-\u9fa5\u0800-\u4e00\uac00-\ud7ff]+\s*)+$/;
			var trueName = $.trim(self.$name.val());
			if(self.$name.hasClass('gray')){
				self.$name.removeClass('gray').val('');
				self.$tip.text(self.tipMessage.empty);
				return false;
			}
			if(!trueName){
				self.$tip.text(self.tipMessage.empty);
				return false;
			}
			if(!reg.test(trueName)){
				self.$tip.text(self.tipMessage.format);
				return false;
			}
			return true;
		},
		/**@inner*/
        callApi : function(data, callback){
            top.M2012.Contacts.getModel().modifyUserInfo(data, function (result) {
                if(callback){
                    callback(result);
                }
            });
        }
    }));
})(top.jQuery, _, M139);

