/**
* @fileOverview 邮件举报功能
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 邮件举报功能
    */

        M139.namespace('M2012.MailComplaint.View', superClass.extend({

        /**
        *@lends M2012.MailComplaint.View.prototype
        */

        el: "",
		
        template: {
			complaint:[ '<dl class="norTipsContent">',
                     '<dt class="norTipsLine formLine"><strong>您举报的邮件将被移动到垃圾邮件文件夹</strong></dt>',
                     '<dd class="formLine gray">通过举报垃圾邮件，可以协助139邮箱更有效的抵制垃圾邮件。感谢您的支持！</dd>',
                     '<dd class="formLine"><input type="checkbox" id="checkbox"> 将发件人的历史邮件移入垃圾邮件文件夹</dd>',
                        '</dl>'].join(""),
			spam:[ '<dl class="norTipsContent">',
                     '<dt class="norTipsLine">拒收后，您将不再收到此地址的邮件</dt>',
                     '<dd>确定拒收此地址吗？</dd>',
                     '<dd class="txt_ellipsis mt_5" title="{1}"><strong>{0}</strong></dd>',
                     '<dd class="norTipsLine mt_10">',
                         '<input type="checkbox" id="checkbox" checked="checked" class="mr_5"><label for="chk_20">将发件人的历史邮件移入垃圾邮件文件夹</label>',
                     '</dd>',
                 '</dl>'].join(""),
			notRubbish:[ '<dl class="norTipsContent">',
                     '<dt class="norTipsLine"><strong>所选邮件将被移到收件箱</strong></dt>',
                     '<dd class="norTipsLine {0}">',
                         '<input type="checkbox" id="checkbox" checked="checked" class="mr_5"><label for="chk_20">把垃圾箱中该发件人的历史邮件全部转移到收件箱</label>',
                     '</dd>',
                 '</dl>'].join(""),
			complaintSuccess:'举报成功，邮件移动到垃圾文件夹。<a href="javascript:$App.showMailbox(5)">查看</a>',
			spamMailAndMoveSuccess:'拒收成功，{0}邮件移动到垃圾文件夹，并拒收发件人的邮件。<a href="javascript:$App.showMailbox(5)">查看</a>',
			spamMailSuccess:'拒收成功。',
			notRubbishSuccess:'邮件已移动到收件箱。'
        },
		
		/** 
		* 初始化 
		*/
        initialize: function (options) {
            var self = this;
            this.model = new M2012.MailComplaint.Model();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        
        /**定义事件*/
        initEvents: function () {
            var self = this;
            top.M139.Timing.waitForReady('$App.getConfig("UserData")', function () { 
                self.model.set({
                    myAccounts:$User.getAccountListArray() || []
                });
            });
        },
		
		/** 邮件举报操作 */
		mailComplaint:function(){
			var self = this;
            var showCheck = this.checkListSelect();
            if(showCheck){
                this.showComplaintPop();
            }
		},
		/** 拒收邮件 暂时只处理单封邮件与帐号 */
		spamMail:function(){
			this.showSpamMailPop();
		},
		
		/** 公用弹窗 */
		showPop:function(options){
			var dialog = $Msg.confirm(options.temp, 
				function(){
					var checkbox = $(dialog.el).find('#checkbox:checked');
					options.callBack(checkbox[0]);
				}, 
				null,
				{
                    dialogTitle: options.title,
					icon:"warn",
					isHtml:true
                });
		},
		
		/** 成功顶部提示 */
		showSuccessTips:function(options){
			var self = this;
			var temp = options.temp;
			var num = options.response > 1 ? '已将' + options.response + '封' : '';
			var text = $T.Utils.format(temp,[num]);
                
            this.model.showWarnTips(text);
                
			//$App.trigger("showMailbox",{hideTips:true});
			
			setTimeout(function(){
                var commandCallback = self.model.get('commandCallback');
                commandCallback && commandCallback();
			},200);
		},
		
		/** 邮件举报弹窗 */
		showComplaintPop:function(){
			var self = this;
			this.showPop({
				title:'邮件举报',
				temp:self.template.complaint,
				callBack:function(isCheck){
					M139.UI.TipMessage.show('邮件举报中...');
					self.model.callComplaintRequest({
						check:isCheck,
						ids:self.model.get('ids')
					},function(res){
						if(res.code == 'S_OK'){
                            var noAccountCount = self.model.get('noAccountCount') || 0;
							self.complaintSuccess(res['var'] + noAccountCount);
						}else{
							self.model.showFailTips();
						}
					});
				}
			});
		},
		
		/** 举报成功提示 */
		complaintSuccess:function(response){
			this.showSuccessTips({
				temp:this.template.complaintSuccess,
				response:response
			});
		},
		
		/** 邮件拒收弹窗 */
		showSpamMailPop:function(){
			var self = this;
			var from = this.model.get('from');
			var addr = $App.getAddrNameByEmail(from);
			var email = $Email.getEmail(from);
			var showname = $T.Html.encode(addr) + '&lt;' + $T.Html.encode(email) + '&gt;';
			self.showPop({
				title:'邮件拒收',
				temp:$T.Utils.format(self.template.spam,[showname,email]),
				callBack:function(isCheck){
					self.model.callSpamMailRequest({
						check:isCheck,
						list:[email]
					},function(res){
						if(res.code == 'S_OK'){
							self.spamMailSuccess(res['var'],isCheck);
						}else{
							self.model.showFailTips();
						}
					});
				}
			});

		},
		
		/** 拒收邮件成功 */
		spamMailSuccess:function(response,isCheck){
			var self = this;
            var temp = isCheck ? this.template.spamMailAndMoveSuccess : this.template.spamMailSuccess
			this.showSuccessTips({
				temp:temp,
				response:response
			});
		},
		
		/** 不是垃圾邮件操作 */
		notRubbishMail:function(){
			var self = this;
			var showCheck = this.checkListSelect();
            if(showCheck){
                self.showNotRubbishPop();
            }
		},
		
		/** 不是垃圾邮件弹窗 */
		showNotRubbishPop:function(){
			var self = this;
			self.showPop({
				title:'这不是垃圾邮件',
				temp:self.template.notRubbish,
				callBack:function(isCheck){
					self.model.callNotRubbishMailRequest(
						{
							check:isCheck
						},
						function(res){
							if(res.code == 'S_OK'){
                                self.notRubbishSuccess(res['var']);
                            }else{
                                self.model.showFailTips();
                            }
						}
					);
				}
			});
		},		
		
		/** 取消垃圾邮件成功 */
		notRubbishSuccess:function(res){
			this.showSuccessTips({
				temp:this.template.notRubbishSuccess,
				response:res
			});
		},
        
        checkListSelect:function(){
            return this.model.checkListSelect();
        },
        
        /** 是否拒收邮件入口 */
        isSpamMail:function(){
            return this.model.isSpamMail();
        },
        
        /** 是否允许拒收邮件地址 */
        isAllowRefuseEmailaddr:function(addr){
            return this.model.isAllowRefuseEmailaddr(addr);
        },

        render: function () {}

    }));

	//列表举报初始化
    $(function(){
        mailboxComplaintView = new M2012.MailComplaint.View();
    });
})(jQuery, _, M139);


