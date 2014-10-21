(function (jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Addr.Personinfo.Model", Backbone.Model.extend({
			defaults : {
				AddrFirstName : "", //用户姓名
				AddrNickName : "", //用户昵称
				UserSex : 0, //用户性别
				BirDay : "", //出生日期(YYYY-MM-DD)
				StartCode : '', //星座
				BloodCode : "", //血型
				Marriage : 0, //婚姻状况 0是不填，未婚为2
				StreetCode : '', //居住地

				FamilyEmail : '', //邮箱
				HomeAddress : '', //通讯地址
				ZipCode : '', //邮编
				MobilePhone : '', //手机
				FamilyPhone : '', //电话
				//	GetPrivacySettings:'',//飞信号码 GetPrivacySettings接口
				OtherIm : '', //飞信号
				OICQ : '', //QQ
				MSN : '', //MSN
				PersonalWeb : '', //个人主页

				CPName : '', //公司名称
				UserJob : '', //职务
				BusinessEmail : '', //商务邮箱
				BusinessMobile : '', //商务手机
				BusinessPhone : '', //公司固话
				CPAddress : '', //公司地址
				CPZipCode : '', //公司邮编
				CompanyWeb : '', //公司主页

				Character : '', //我的性格
				FavoPeople : '', //欣赏的人
				MakeFriend : '', //我想结交
				Brief : '', //我的简介
				FavoBook : '', //喜欢的书
				FavoMusic : '', //喜欢的音乐
				FavoMovie : '', //喜欢的电影
				FavoTv : '', //喜欢的电视
				FavoSport : '', //喜欢的运动
				FavoGame : '' //喜欢的游戏
			},
			cancelLink : "/m2012/html/addr/addr_index.html?sid=" + top.sid,
			tipWords : {
				SUCCESS : "个人资料保存成功。",
				FAILURE : "个人资料保存失败。",
				ERROR : "不符合规范，请检查修改!",
				PICUPLOADERROR :"图像格式不符合规范!"
			},
			messages : {
				DATE_NOT_ALLOW : "生日选择有误，请选择小于今天的日期",
				error_birthdayIllegal : "生日格式不正确",
				error_fEmailIllegal : "电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
				error_bEmailIllegal : "商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
				error_fMobileIllegal : "手机号码格式不正确，请输入3-20位数字",
				error_bMobileIllegal : "商务手机格式不正确，请输入3-20位数字",
				error_bMobileIllegal : "商务手机格式不正确，请输入3-20位数字",
				error_fPhoneIllegal : "常用固话格式不正确，请输入3-30位数字、-",
				error_bPhoneIllegal : "公司固话格式不正确，请输入3-30位数字、-",
				error_bZipCode : "公司邮编格式不正确，请输入3-10位字母、数字、-或空格",
				error_faxIllegal : "传真号码格式不正确，请输入3-30位数字、-",
				error_oicqIllegal : "QQ格式不正确，请输入5-11位数字", //后端会过滤，理论不会出现
				error_fetionIllegal : "飞信号格式不正确，请输入6-9位数字"
			},
			messagesMap : {
				"85" : "error_birthdayIllegal",
				"12820" : "error_fMobileIllegal",
				"12821" : "error_bMobileIllegal",
				"12823" : "error_fEmailIllegal",
				"12824" : "error_bEmailIllegal",
				"12826" : "error_fPhoneIllegal",
				"12827" : "error_bPhoneIllegal",
				"12828" : "error_fPhoneIllegal", //otherphone，常用固话
				"12829" : "error_faxIllegal", //familyfax,家庭传真
				"12830" : "error_faxIllegal", //businessfax,公司传真
				"12833" : "error_fetionIllegal",
				"12834" : "error_bZipCode",
				"12835" : "error_oicqIllegal"
			},
			messagechang: function(){
				var messagesMap = this.messagesMap;
				var messages = this.messages;
				for(var i in messagesMap){
					messagesMap[i] = messages[messagesMap[i]];
				}
			},
			initialize : function (options) {
				this.menuBar(options.page || "basicinfo");
				this.messagechang();
			//	console.log(this.messagesMap);
			},
			getDataSource : function (callback) {
				top.M2012.Contacts.getModel().getUserInfo({}, function (result) {
					var userInfo = {};
					if (result.code === 'S_OK') {
						userInfo = result['var'];
					} else {
						top.console.log("M2012.Contacts.getModel().getUserInfo 获取用户信息失败！result.code:" + result.code);
					}
				//	console.log(userInfo);
					callback && callback(userInfo);
				});

			},
			updateUserInfo : function (postData, callback) {
				var This = this;
				top.M2012.Contacts.getModel().modifyUserInfo(postData, function (result) {

					//console.log(result);
					callback && callback(result);
				});
			},
			getPhotoUploadUrl : function () { //获取上传地址，测试环境与生产环境不同，加了nginx代理
				var url = "/bmail/s?func=contact:uploadImage&sid=" + top.sid + "&serialId=0&type=1&callback=myPicture";
				if (document.domain == "10086.cn") {
					url = top.getDomain("rebuildDomain") + url;
				}
				return url;
			},
			//根据不同的页面，加粗其标题
			menuBar : function (page) {
				var array = [];				
				array.push('<li rel="basicinfo"><a href="addr_info_basic.html?sid={sid}">基本资料</a></li>');
				array.push('<li rel="contact"><a href="addr_info_contact.html?sid={sid}">联系方式</a></li>');
				array.push('<li rel="businessinfo"><a href="addr_info_business.html?sid={sid}">商务信息</a></li>');
				array.push('<li rel="personalcir"><a href="addr_info_intro.html?sid={sid}">个人情况</a></li>');
				array.push('<li rel="mypicture"><a href="addr_info_myphoto.html?sid={sid}">我的头像</a></li>');
				var str = $T.format(array.join(""), {
						sid : top.sid
					});
				$("#addr_nav ul").html(str);
				$("#addr_nav ul li[rel='" + page + "']").addClass("on");
			},
			judgmentContainer : function (text) {
				return txt = "<span class=\"warntip\" style=\"\"><i class=\"warn\"></i>"+text+"</span>"; 
			},
			displayPrompt : function (e) {
				if (e && (evalue = e.ResultCode) == "0") {
					top.BH("save_my_data_success");
					top.$Msg.alert(this.tipWords.SUCCESS, {
						icon : "ok"
					});
				} else {
					if (this.messagesMap[evalue]) {
						top.$Msg.alert(this.messagesMap[evalue], {
							icon : "fail"
						});
					}else{
						top.$Msg.alert(this.tipWords.FAILURE, {
							icon : "fail"
						});
					}

				}
			}
		}));
})(jQuery, Backbone, _, M139);
