(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Basicinfo.View", Backbone.Model.extend({
			initialize : function () {
				var options = {
					page : "basicinfo"
				};
				var personmodel = new M2012.Addr.Personinfo.Model(options);
				this.model = personmodel;
				this.txtTureName = $("#txtTureName");
				this.txtAppellation = $("#txtAppellation");
				this.radMen = $("#radMen");
				this.radWomen = $("#radWomen");
				this.radSecret = $("#radSecret");
				this.birthday = $("#birthday");
				this.StartCode = $("#StartCode");
				this.BloodCode = $("#BloodCode");
				this.Marriage = $("#Marriage");
				this.txtAddress = $("#txtAddress");
				this.likbtnSubmit = $("#likbtnSubmit");
				this.btnCancel = $("#btnCancel");
				this.gotoHome= $('#gotoHome');
				this.initEvent();

			},
			initEvent : function () {
				var self = this;
				self.likbtnSubmit.bind("click", function () {
					top.BH("addr_basicInfo_save");
					//判断
					if (self.txtTureName.val().length > 12) {
						self.txtTureName.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
						return false;
					}
					if (self.txtAppellation.val().length > 10) {
						self.txtAppellation.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
						return false;
					}
					if (self.txtAddress.val().length > 20) {
						self.txtAddress.after(self.model.judgmentContainer(self.model.tipWords.ERROR));
						return false;
					}
					self.update();
				});

				self.btnCancel.bind("click", function () {
					top.BH("addr_basicInfo_cancel");
					self.back();
				    return false;
				});

				self.gotoHome.click(function(){
					self.back();
					return false;
				});

				self.radioCheck();

				top.BH('addr_pageLoad_personal');
			},
			render : function () {
				var self = this;
				self.model.getDataSource(function (res) {

					self.txtTureName.val(res["AddrFirstName"]);
					self.txtAppellation.val(res["AddrNickName"]);
					switch (res["UserSex"]) {
					case '0':
						self.radMen.attr("checked", "checked");
						break;
					case '1':
						self.radWomen.attr("checked", "checked");
						break;
					case '2':
						self.radSecret.attr("checked", "checked");
						break;
					}

					self.model.set("UserSex", res["UserSex"]);
					self.BirDayMenu(res["BirDay"]);
					self.model.set("BirDay", res["BirDay"]);
					self.StartCodeMenu(res["StartCode"]);
					self.model.set("StartCode", res["StartCode"]);
					self.BloodCodeMenu(res["BloodCode"]);
					self.model.set("BloodCode", res["BloodCode"]);
					self.MarriageMenu(res["Marriage"]);
					self.model.set("Marriage", res["Marriage"]);
					self.txtAddress.val(res["StreetCode"]);
					self.model.set("StreetCode", res["StreetCode"]);

				})
			},
			radioCheck : function () {
				var $radio = $("input[name='sex']");
				$radio.click(function () {
					$(this).attr("checked", "checked").parent().siblings().children().removeAttr("checked");
				})
			},
			StartCodeMenu : function (defaultText) {
				var self = this;
				var menuItems = [{
						text : "--",
						value : ""
					}, {
						text : "白羊座",
						value : "白羊座"
					}, {
						text : "金牛座",
						value : "金牛座"
					}, {
						text : "双子座",
						value : "双子座"
					}, {
						text : "巨蟹座",
						value : "巨蟹座"
					}, {
						text : "狮子座",
						value : "狮子座"
					}, {
						text : "处女座",
						value : "处女座"
					}, {
						text : "天秤座",
						value : "天秤座"
					}, {
						text : "天蝎座",
						value : "天蝎座"
					}, {
						text : "射手座",
						value : "射手座"
					}, {
						text : "摩羯座",
						value : "摩羯座"
					}, {
						text : "水瓶座",
						value : "水瓶座"
					}, {
						text : "双鱼座",
						value : "双鱼座"
					}
				];
				var dropMenu = M2012.UI.DropMenu.create({
				    defaultText: defaultText || "--",
				    menuItems: menuItems,
				    container: self.StartCode
				}).on("change", function (e) {
				    self.model.set("StartCode", e.value);
				});
				dropMenu.$el.addClass("select_w");
			},
			BloodCodeMenu : function (defaul) {
				var self = this;
				var items = [{
						text : "-- ",
						value : ""
					}, {
						text : "A型 ",
						value : "A型"
					}, {
						text : "B型 ",
						value : "B型"
					}, {
						text : "AB型 ",
						value : "AB型"
					}, {
						text : "O型 ",
						value : "O型"
					}
				];
				var dropMenu2 = M2012.UI.DropMenu.create({
						defaultText : defaul || "--",
						menuItems : items,
						container : self.BloodCode
					}).on("change", function (e) {
						self.model.set("BloodCode", e.value);
					});
				dropMenu2.$el.addClass("select_w");

			},
			MarriageMenu : function (d) {
				var self = this;
				var itmes = [{
						text : "--",
						value : "0"
					}, {
						text : "已婚 ",
						value : "1"
					}, {
						text : "未婚 ",
						value : "2"
					}
				];
				var defaulttext = "";
				for (var i = 0, l = itmes.length; i < l; i++) {
					if (itmes[i].value == d) {
						defaulttext = itmes[i].text;
						break;
					}
				}
				var dropMenu2 = M2012.UI.DropMenu.create({
						defaultText : defaulttext || "--",
						menuItems : itmes,
						container : self.Marriage
					}).on("change", function (e) {
						self.model.set("Marriage", e.value);
					});
				dropMenu2.$el.addClass("select_w");
			},
			BirDayMenu : function (date) {
				var self = this;
				self.datePicker = new M2012.Settings.View.Birthday({
						container : self.birthday,
						date : date,
						orderby : "desc"
				});
			},
			update : function () {
				var self = this;
				
				var year = self.datePicker.year.text();
				var month = self.datePicker.month.text();
				var day = self.datePicker.day.text();
				month = parseInt(month) < 10 && month.length < 2 ? "0" + month : month;
				day = parseInt(day) < 10 && day.length < 2 ? "0" + day : day;
				//生日和现在时间判断
				var userDate = new Date(year, month - 1, day);
				if (userDate && userDate > new Date()) {
					top.$Msg.alert(self.model.messages.DATE_NOT_ALLOW);
					return false;
				}
				var birthday = year + '-' + month + '-' + day;
				var postData = {
					AddrFirstName : self.txtTureName.val(),
					AddrNickName : self.txtAppellation.val(),
					UserSex : $("input[name='sex'][checked]").val(),
					BirDay : birthday,
					StartCode : self.model.get("StartCode"),
					BloodCode : self.model.get("BloodCode"),
					Marriage : self.model.get("Marriage"),
					StreetCode : self.txtAddress.val()
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
	new M2012.Addr.Basicinfo.View().render();
})(jQuery, Backbone, _, M139);
