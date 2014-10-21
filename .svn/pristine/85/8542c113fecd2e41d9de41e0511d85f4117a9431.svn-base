(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Businessinfo.View", Backbone.Model.extend({
			initialize : function () {
				var options = {
					page : "businessinfo"
				};
				var personmodel = new M2012.Addr.Personinfo.Model(options);
				this.model = personmodel;
				this.txtCompany = $("#txtCompany");
				this.txtPosition = $("#txtPosition");
				this.txtMail = $("#txtMail");
				this.txtMobile = $("#txtMobile");
				this.txtPhone = $("#txtPhone");
				this.txtAddress = $("#txtAddress");
				this.txtPost = $("#txtPost");
				this.txtMainPage = $("#txtMainPage");

				this.btnSubmit = $("#btnSubmit");
				this.btnCancel = $("#btnCancel");
				this.gotoHome= $('#gotoHome');

				this.initEvent();

			},
			initEvent : function () {
				var self = this;
				self.btnSubmit.bind("click", function () {
					self.validate();
				});
				//提交验资失败后，重现回填资料，清楚失败提示
				self.txtCompany.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtCompany.parent().next().has("span").length){
							self.txtCompany.parent().next().html('');
						}
					});
				});
				self.txtPosition.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtPosition.parent().next().has("span").length){
							self.txtPosition.parent().next().html('');
						}
					});
				});
				self.txtMail.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dEmail").hide();
					});
				});
				self.txtMobile.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dMobile").hide();
					});
				});
				self.txtPhone.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dPhone").hide();
					});
				});
				self.txtAddress.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtAddress.parent().next().has("span").length){
							self.txtAddress.parent().next().html('');
						}
					});
				});
				self.txtPost.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dPost").hide();
					});
				});
				self.txtMainPage.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtMainPage.parent().next().has("span").length){
							self.txtMainPage.parent().next().html('');
						}
					});
				});

				self.btnCancel.bind("click", function () {
					self.back();
				    return false;
				});

				self.gotoHome.bind('click', function(){
					self.back();
				    return false;
				});
				
				self.render();
			},
			render : function () {
				var self = this;
				self.model.getDataSource(function (res) {
					self.txtCompany.val(res["CPName"]);
					self.txtPosition.val(res["UserJob"]);
					self.txtMail.val(res["BusinessEmail"]);
					self.txtMobile.val(res["BusinessMobile"]);
					self.txtPhone.val(res["BusinessPhone"]);
					self.txtAddress.val(res["CPAddress"]);
					self.txtPost.val(res["CPZipCode"]);
					self.txtMainPage.val(res["CompanyWeb"]);
				});
			},
			validate : function () {
				var self = this;
				var CPName = $.trim(this.txtCompany.val());
				var UserJob = $.trim(this.txtPosition.val());
				var BusinessEmail = $.trim(this.txtMail.val());
				var BusinessMobile = $.trim(this.txtMobile.val());
				var BusinessPhone = $.trim(this.txtPhone.val());
				var CPAddress = $.trim(this.txtAddress.val());
				var CPZipCode = $.trim(this.txtPost.val());
				var CompanyWeb = $.trim(this.txtMainPage.val());
				var patrn = /^\d*$/;
				var regPhone = /^[\(\)、\-\d]*$/;
				if(CPName.length > 25){
					this.txtCompany.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				if(UserJob.length > 12){
					this.txtPosition.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				//商务邮箱
				if (!$T.Email.isEmail(BusinessEmail) && BusinessEmail != "") {
					$("#dEmail").show();
					return false;
				}
				//商务手机
				if (!$T.Mobile.isMobile(BusinessMobile) && BusinessMobile != "") {
					$("#dMobile").show();
					return false;
				}
				//公司固话
				if (!regPhone.test(BusinessPhone) && BusinessPhone != "") {
					$("#dPhone").show();
					return false;
				}
				if(CPAddress.length > 50){
					this.txtAddress.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				//邮编
				if (!patrn.test(CPZipCode) && CPZipCode != "") {
					$("#dPost").show();
					return false;
				}
				if(CompanyWeb.length > 60){
					this.txtMainPage.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				var postData = {
					CPName : CPName,
					UserJob : UserJob,
					BusinessEmail : BusinessEmail,
					BusinessMobile : BusinessMobile,
					BusinessPhone : BusinessPhone,
					CPAddress : CPAddress,
					CPZipCode : CPZipCode,
					CompanyWeb : CompanyWeb
				};
				this.update(postData);
			},
			update : function (postData) {
				var self = this;
				self.model.updateUserInfo(postData, function (e) {
					if (e && e.ResultMsg == "Operate successful") {
						top.$Msg.alert(self.model.tipWords.SUCCESS, {
							icon : "ok"
						});
					} else {
						top.$Msg.alert(self.model.tipWords.FAILURE, {
							icon : "fail"
						});
					}
				});
			},
			back: function(){
				setTimeout(function() {
			        if(top.$Addr){                
						var master = top.$Addr;
						master.trigger(master.EVENTS.LOAD_MAIN);
					}else{
						top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
					}
			    }, 0xff);
			}
		}));
	new M2012.Addr.Businessinfo.View();
})(jQuery, Backbone, _, M139);
