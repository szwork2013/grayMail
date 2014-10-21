(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Mypicture.View", Backbone.Model.extend({
			initialize : function () {
				var options = {
					page : "mypicture"
				};
				var personmodel = new M2012.Addr.Personinfo.Model(options);
				this.model = personmodel;

				this.form1 = $("#form1")[0];
				this.headpic = $("#headpic");
				this.fileInput = $("#fileInput");
				this.upiframe = $("#upiframe");
				this.gotoHome= $('#gotoHome');
				this.initEvent();

			},
			initEvent : function () {
				var self = this;
				self.form1.action = self.model.getPhotoUploadUrl();
				self.getPictureInfo();
				self.setPicture();
				self.headpic.css("display", "inline");

				self.gotoHome.bind('click', function(){
					self.back();
				    return false;
				});

				self.fileInput.bind("click", function() {
				    top.BH("addr_myPic_select");
				});
			},
			getPictureInfo : function () {
				var self = this;
				self.model.getDataSource(function (res) {
					if(res["ImageUrl"]){
						var url = getPhotoUploadedAddr() + res["ImageUrl"] + '?rd=' + Math.random();
						self.headpic.attr("src", url);
					}
				//	console.log(url);
				})
			},
			setPicture : function () {
				var self = this;
				
				self.fileInput.bind("change", function () {
					var fileName = $(this).val();
					if (!/\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName)) {
						top.$Msg.alert(self.model.tipWords.PICUPLOADERROR);
						self.form1.reset();
						return;
					}

					self.form1.submit();
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
	new M2012.Addr.Mypicture.View();
})(jQuery, Backbone, _, M139);

function getPhotoUploadedAddr() {
	var tmpurl = location.host;
	var url = "";
	//测试线地址
	if (tmpurl.indexOf("10086ts") > -1) {
		url = "http://g2.mail.10086ts.cn";
		return url;
	}
	//灰度地址
	if (tmpurl.indexOf("10086.") > -1 && top.$User.isGrayUser()) {
		return url = "http://image0.139cm.com";
	//全网地址
	} else if(tmpurl.indexOf("10086.") > -1 && !top.$User.isGrayUser()) {
		return url = "http://images.139cm.com";
	}
}
function myPicture(options) {
	var code = options.code || "";
	var msg = options.msg || "";
	if (code == "S_OK") {
		top.M2012.Contacts.getModel().UserInfoData = null;
	//	console.log(getPhotoUploadedAddr() + msg);
		$("#headpic").attr("src", getPhotoUploadedAddr() + msg + '?rd='+ Math.random());
		top.BH("upload_my_pic_success");
		top.$Msg.alert("头像上传成功", {
			icon : "ok"
		});
	} else {
		top.$Msg.alert(msg, {
			icon : "fail"
		});
	}
}
