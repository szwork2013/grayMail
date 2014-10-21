(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Contact.View", Backbone.Model.extend({
			initialize : function () {
				var options = {
					page : "contact"
				};
				var personmodel = new M2012.Addr.Personinfo.Model(options);
				this.model = personmodel;
				this.txtMail = $("#txtMail");
				this.txtAddress = $("#txtAddress");
				this.txtPost = $("#txtPost");
				this.txtMobile = $("#txtMobile");
				this.txtPhone = $("#txtPhone");
				this.txtFetion = $("#txtFetion");
				this.txtQQ = $("#txtQQ");
				this.txtMSN = $("#txtMSN");
				this.txtMainPage = $("#txtMainPage");
				this.btnSubmit = $("#btnSubmit");
				this.btnCancel = $("#btnCancel");
				this.gotoHome= $('#gotoHome');
				this.initEvent();

			},
			initEvent : function () {
				var self = this;
				self.btnSubmit.bind("click", function () {
					//判断
					var patrn = /^\d*$/;
					var regPhone = /^[\(\)、\-\d]*$/; //电话号正则
					var email = $.trim(self.txtMail.val());
					var Address = $.trim(self.txtAddress.val());
					var post = $.trim(self.txtPost.val());
					var mobile = $.trim(self.txtMobile.val());
					var phone = $.trim(self.txtPhone.val());
					var fetion = $.trim(self.txtFetion.val());
					var qq = $.trim(self.txtQQ.val());
					var MSN = $.trim(self.txtMSN.val());
					var MainPage = $.trim(self.txtMainPage.val());
					if (!$T.Email.isEmail(email) && email != "") {
						$("#dEmail").show();
						return false;
					}
					if(Address.length > 40){
						if(!self.txtAddress.parent().next().has("span").length){
							self.txtAddress.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
						}
						return false;
					}
					if (!patrn.test(post) && post != "") {
						$("#dPost").show();
						return false;
					}
					if (!$T.Mobile.isMobile(mobile) && mobile != "") {
						$("#dMobile").show();
						return false;
					}
					if (!regPhone.test(phone) && phone != "") {
						$("#dPhone").show();
						return false;
					}
					if(fetion.length > 20){
						if(!self.txtFetion.parent().next().has("span").length){
							self.txtFetion.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
						}
						return false;
					}
					if(!patrn.test(qq) && qq !=""){
						if(!self.txtQQ.parent().next().has("span").length){
							self.txtQQ.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
						}
						return false;
					}
					if(MSN.length > 50){
						if(!self.txtMSN.parent().next().has("span").length){
							self.txtMSN.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
						}
						return false;
					}
					if(MainPage.length > 50){
						if(!self.txtMainPage.parent().next().has("span").length){
							self.txtMainPage.parent().next().html(self.model.judgmentContainer(self.model.tipWords.ERROR));
						}
						return false;
					}
					var postData = {
						FamilyEmail : email,
						HomeAddress : Address,
						ZipCode : post,
						MobilePhone : mobile,
						FamilyPhone : phone,
						OtherIm : fetion,
						OICQ : qq,
						MSN : MSN,
						PersonalWeb : MainPage
					};
					self.update(postData);
				});

				self.btnCancel.bind("click", function () {
					self.back();
				    return false;
				});

				self.gotoHome.bind('click', function(){
					self.back();
				    return false;
				});
				
				//提交验资失败后，重现回填资料，清楚失败提示
				self.txtMail.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dEmail").hide();
					})
				});
				self.txtPost.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dPost").hide();
					})
				});
				self.txtMobile.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dMobile").hide();
					})
				});
				self.txtPhone.bind("focus",function(){
					$(document).bind("keydown",function(){
						$("#dPhone").hide();
					})
				});
				self.txtAddress.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtAddress.parent().next().has("span").length){
							self.txtAddress.parent().next().html('');
						}
					})
				});
				self.txtFetion.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtFetion.parent().next().has("span").length){
							self.txtFetion.parent().next().html('');
						}
					})
				});
				self.txtQQ.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtQQ.parent().next().has("span").length){
							self.txtQQ.parent().next().html('');
						}
					})
				});
				self.txtMSN.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtMSN.parent().next().has("span").length){
							self.txtMSN.parent().next().html('');
						}
					})
				});
				self.txtMainPage.bind("focus",function(){
					$(document).bind("keydown",function(){
						if(self.txtMainPage.parent().next().has("span").length){
							self.txtMainPage.parent().next().html('');
						}
					})
				})
			},
			render : function () {
				var self = this;
				self.model.getDataSource(function (res) {
					self.txtMail.val(res["FamilyEmail"]);
					self.txtAddress.val(res["HomeAddress"]);
					self.txtPost.val(res["ZipCode"]);
					self.txtMobile.val(res["MobilePhone"]);
					self.txtPhone.val(res["FamilyPhone"]);
					self.txtFetion.val(res["OtherIm"]);
					self.txtQQ.val(res["OICQ"]);
					self.txtMSN.val(res["MSN"]);
					self.txtMainPage.val(res["PersonalWeb"]);
				})
			},
			update : function (postData) {
				var self = this;
				self.model.updateUserInfo(postData, function (e) {
					self.model.displayPrompt(e);
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
	new M2012.Addr.Contact.View().render();
})(jQuery, Backbone, _, M139);
