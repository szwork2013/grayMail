
/**
* @fileOverview 短信提醒
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 短信提醒
    */

    M139.namespace('M2012.SmsNotifyFriends.View', superClass.extend({

        /**
        *@lends M2012.SmsNotifyFriends.View.prototype
        */
        el: 'body',

        template: {
          
        },

        initialize: function () {
            var self = this;
            this.model = new M2012.SmsNotifyFriends.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /** 用户短信套餐信息提示 */
        showSmsPackageInfo:function(){
        	var self = this;
        	var text = [];
        	self.model.getSmsPackageInfo(function(result){
        		if(result){
        			result.freeInfo && text.push(result.freeInfo);
        			result.limitInfo && text.push(result.limitInfo);
        		}
        		$('#tips').html(text.join(''));
        	})
        },
		
		/** 通讯录事件 */
		contactEvent:function(){
			
			var contactIco = $('#contactIco');
			contactIco.click(function(e){
				var contactView = top.M2012.UI.Dialog.AddressBook.create({
					filter: "mobile",
					items: []
				});
				contactView.on("select", function (e) {
					var value = eval('(' + JSON.stringify(e) + ')').value;
					var mobileArr = [];
					var mobile = '';
					$.each(value,function(i,val){
						val = val.replace('>"','>');
						mobile = top.$T.Mobile.getMobile(val);
						if(mobile!=''){mobileArr.push(mobile)}
					});
					var text = mobileArr.join(",");
					text!='' && $("#txtMobile").val(text);			
				})
				
			});
		
		},

		/** 显示邮箱伴侣推广 */
		showParnerInfo:function(){
			if(top.$User.getPartner() == 'false' && this.isCityForMailPartner()){
				$('#parnerInfo').show();
			}
		},

		// 只在广东、辽宁、贵州3省显示邮箱伴侣运营链接，其它省份去掉邮箱伴侣。
        isCityForMailPartner: function(){
            var provCode = top.$User.getProvCode();

            if (provCode == 1 || provCode == 7 || provCode == 10) {
                return true;
            } else {
                return false;
            }
        },

		/** 刷新验证码 */
		refreshValidateCode:function(){
			var validateUrl = this.model.get('validImgUrl') + Math.random();
    		$("#imgValidate").attr("src",validateUrl);
		},

        initEvents: function () {
        
            var self = this;
	        self.showSmsPackageInfo();
			self.contactEvent();
			self.showParnerInfo();


			//发件人别名、邮件接收人、短信内容
			var userName = $T.Url.queryString('un');
			var receiveEMail = $T.Url.queryString("re");
			var emailTitle = $T.Url.queryString("et");

			userName = (top.$User.getAliasName() || top.$User.getShortUid()) || userName; //优先取别名 > 手机号

			//组装输出邮件接收人
			var receiveEMailHtml = [];
			if(receiveEMail.indexOf(';')>-1){
				var mailArray = receiveEMail.split(";");
				for(var i = 0; i < mailArray.length; i++){
					receiveEMailHtml.push(top.$Email.getEmail(mailArray[i]) || mailArray[i])
				}
			}else{ 
				receiveEMail = top.$Email.getEmail(receiveEMail) || receiveEMail;
			}
			receiveEMail = receiveEMailHtml.join("; ") || receiveEMail;
			

			if (userName) { $("#txtUsername").val(userName); }
			if (receiveEMail) { $("#spReceiveEMail").html(top.$T.Html.encode(receiveEMail)) }
			if (emailTitle) { $("#spSubject").html("通过139邮箱发邮件“" + top.$T.Html.encode(emailTitle) + "”至您的邮箱，请查收！"); }

			//图片验证码
			var options = {
				actionId:0,
				mobile:"",
				userName:"",
				receiveEMail:"",
				emailTitle:"",
				validCode:""
			};
			self.model.getSmsNotifyData(options, function(result){
				if(result){
					result.validImg && self.model.set({validImgUrl:result.validImg});
				}
			});

			//验证码功能
			$("#tbValidate").focus(function(){
				var text = $(this).val();
				if(text == '请点击获取验证码'){
					$(this).val('');
					self.refreshValidateCode();
					var imgCodeArea = $('#imgCodeArea');
					imgCodeArea.show();
				}
			});

			//刷新验证码
			$('#refreshImg').click(function(){
				self.refreshValidateCode();
			});

			//取消按钮
			$('#btnCancel').click(function(){
				top.$App.close();
			});

		    //发送按钮
		    $("#btnSmsNotifyFriends").click(function(){
		        
		        if ($.trim($("#txtMobile").val()).length == 0) {
		            top.$Msg.alert("请输入接收方手机号码！");
		            return false;
		        }

		        var tbValidate = $("#tbValidate").val();
		        if (tbValidate == '请点击获取验证码' || tbValidate.length == 0) {
		            top.$Msg.alert("请输入验证码！");
		            return false;
		        }
		        
		        var options = {
					actionId:1,
					mobile:$("#txtMobile").val().replace(/;/g,","),
					userName:$("#txtUsername").val() || userName,
					receiveEMail:receiveEMail,
					emailTitle:emailTitle,
					validCode:$("#tbValidate").val()
				};

				self.model.getSmsNotifyData(options, function(result){
					if(result && result.summary){
						top.$Msg.alert(result.summary); //失败处理
					} 
				});
				
		    });

        }

        

    }));

    $(function () {
        new M2012.SmsNotifyFriends.View().initEvents();
	})

})(jQuery, _, M139);