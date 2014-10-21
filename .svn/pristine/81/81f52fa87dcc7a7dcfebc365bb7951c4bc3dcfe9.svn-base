(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Personalcir.View", Backbone.Model.extend({
			initialize : function () {
				var options = {
					page : "personalcir"
				};
				var personmodel = new M2012.Addr.Personinfo.Model(options);
				this.model = personmodel;

				this.txtMettle = $("#txtMettle");
				this.txtAppreciation = $("#txtAppreciation");
				this.txtContact = $("#txtContact");
				this.txtResume = $("#txtResume");

				this.txtBook = $("#txtBook");
				this.txtMusic = $("#txtMusic");
				this.txtMovie = $("#txtMovie");
				this.txtTV = $("#txtTV");
				this.txtSports = $("#txtSports");
				this.txtGame = $("#txtGame");

				this.btnSubmit = $("#btnSubmit");
				this.btnCancel = $("#btnCancel");
				this.gotoHome= $('#gotoHome');
				this.more = $("#more");
				this.initEvent();

			},
			initEvent : function () {
				var self = this;
				if(self.txtMettle.val().length > 50){
					self.txtMettle.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				if(self.txtAppreciation.val().length > 100){
					self.txtAppreciation.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				if(self.txtContact.val().length > 100){
					self.txtContact.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
					return false;
				}
				//控制textarea输入的长度
				self.bindEvent(self.txtResume, 256);
				self.bindEvent(self.txtBook, 100);
				self.bindEvent(self.txtMusic, 100);
				self.bindEvent(self.txtMovie, 100);
				self.bindEvent(self.txtTV, 100);
				self.bindEvent(self.txtSports, 100);
				self.bindEvent(self.txtGame, 100);
				self.more.bind("click", function () {
					$(this).parent().parent().hide().nextAll().show();
				});
				self.btnSubmit.bind("click", function () {
					self.update();
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

					self.txtMettle.val(res["Character"]);
					self.txtAppreciation.val(res["FavoPeople"]);
					self.txtContact.val(res["MakeFriend"]);
					self.txtResume.val(res["Brief"]);

					self.txtBook.val(res["FavoBook"]);
					self.txtMusic.val(res["FavoMusic"]);
					self.txtMovie.val(res["FavoMovie"]);
					self.txtTV.val(res["FavoTv"]);
					self.txtSports.val(res["FavoSport"]);
					self.txtGame.val(res["FavoGame"]);
				})
			},
			subChars : function (containter, num) {
				var val = containter.val();
				var len = val.length;
				if (len > num) {
					containter.val(val.substring(0, num));
					return false;
				}
			},
			bindEvent : function (containter, num) {
				var self = this;
				containter.bind("keypress", function () {
					//setInterval(self.subChars(containter, num), 0);
					if(containter.val().length >= num){
						return false;
					}
					
				});
				containter[0].onpaste = function(){
					//setInterval(self.subChars(containter, num), 0);
					var now = containter.val();
					if(!window.clipboardData){
						window.clipboardData ={
							getData: function(){return ''},
							setData: function(){return ''}
						};
					}
					var clip = window.clipboardData.getData("Text");
					if(clip.length > num - now.length){
						var subStr = clip.substr(0, num - now.length);
						window.clipboardData.setData("Text", subStr); 
					}
				}
				
			},
			update : function () {
				var self = this;
				var Character = $.trim(self.txtMettle.val());
				var FavoPeople = $.trim(self.txtAppreciation.val());
				var MakeFriend = $.trim(self.txtContact.val());
				var Brief = $.trim(self.txtResume.val());

				var FavoBook = $.trim(self.txtBook.val());
				var FavoMusic = $.trim(self.txtMusic.val());
				var FavoMovie = $.trim(self.txtMovie.val());
				var FavoTv = $.trim(self.txtTV.val());
				var FavoSport = $.trim(self.txtSports.val());
				var FavoGame = $.trim(self.txtGame.val());

				var postData = {
					Character : Character,
					FavoPeople : FavoPeople,
					MakeFriend : MakeFriend,
					Brief : Brief,
					FavoBook : FavoBook,
					FavoMusic : FavoMusic,
					FavoMovie : FavoMovie,
					FavoTv : FavoTv,
					FavoSport : FavoSport,
					FavoGame : FavoGame
				};
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
	new M2012.Addr.Personalcir.View();
})(jQuery, Backbone, _, M139);
