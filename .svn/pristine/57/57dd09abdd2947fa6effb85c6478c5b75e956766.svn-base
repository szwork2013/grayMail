(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Account.Main', superClass.extend({
        messages: {
            LOADING: "正在加载中...",
            LOAD_DATA_ERROR: "获取用户信息失败！",
            SAVE_IMAGE_SUCCESS: "您的头像已保存",
            SAVE_IMAGE_FAILURE: "头像上传失败，请重试",

            DEFAULT_ERROR_TIP: "系统繁忙，请稍后重试",
            SETTING_SAVED: "您的设置已保存",
            SETTING_SAVE_FAILURE: "设置保存失败"
        },
        initialize: function () {
            this.model = new M2012.Settings.Model.Account.Main();
            this.account = new M2012.Settings.View.Account();
			//上传图像类
			/*new m2012.imageUpload({
				preInsertDom : document.getElementById("info_image"),
				ImageId : document.getElementById("userImage")
			});*/

			// 头像上传的回调函数（后台返回脚本自动调用）
			var callbackName = "myPicture";
			window[callbackName] = function (data) {
				var url;
				if (data && data.code == "S_OK") {
					top.M2012.Contacts.getModel().UserInfoData = null;
					top.M2012.Contacts.getModel().getUserInfo();
					if (location.host.indexOf("10086ts") > -1) {
						url = "http://g2.mail.10086ts.cn";
					} else {
						url = top.getDomain("resource");
					}
					url += data.msg + '?rd='+ Math.random();
					$("#userImage, #mailSignView img").attr("src", url);
					top.$("#faceImg").attr("src", url);
				}
				top.M139.UI.TipMessage.show(data.code == "S_OK" ? "您的头像已保存" : data.msg, {delay : 2000});
			}

			var wrapper = $("#info_image").css("position", "relative").find(".FloatingDiv");

			var imageUploader = new M2012.Compose.View.UploadForm({
				wrapper: wrapper,
				frameId: "ifmReturnInfo",
				accepts: ["bmp", "png", "jpg", "jpeg", "gif"],
				uploadUrl: (function(){
					var url = "/bmail/s?func=contact:uploadImage&sid=" + top.sid + "&serialId=0&type=1&callback=" + callbackName;
					if (document.domain == "10086.cn") {
						url = top.getDomain("rebuildDomain") + url;
					}
					return url;
				})(),
				onSelect: function(value, ext){
					if (_.indexOf(this.accepts, ext) == -1) {
						top.$Msg.alert("图像格式不符合规范!", {icon:"warn"});
						return false;
					}
					return true;
				}
			}).render();

			imageUploader.$("input").click(function(){
				if(top.M139.Date.getDaysPass(M139.Date.getServerTime(), new Date(2014,5,10))>=0){
					top.$Msg.alert("系统维护，暂不支持上传头像");
					return false;
				}
			}).css({"margin":0, height:"50px"});

            this.init = false;

            /* 控件 */
            this.alias = $("#txtAlias");
            this.password = $("#changePassword");
            this.privacyAccountAll = $("#addMe :radio");
            this.privacy = $("#addMe :radio :checked"); //选中

            this.allInput = $("#info_account input");
            this.image = $("#userImage");
            this.userName = $("#info_userName");
            this.email = $("#info_email");
            this.mobile = $("#info_mobile");
            this.birthday = $("#info_birthday");
            this.moreInfo = $("#info_more");
            this.upload = null;
            this.datePicker = null;

            this.privacyName = $("#privacy_userName");
            this.privacyEmail = $("#privacy_email");
            this.privacyMobile = $("#privacy_mobile");
            this.privacyBirthday = $("#privacy_birthday");
            this.privacySetAll = $("#privacy_userName,#privacy_email,#privacy_mobile,#privacy_birthday");

            this.changeMobile = $("#changeMobile"); //更换绑定
            this.bindPhoneArea = $("#bindPhoneArea");
            this.submit = $("#btnSubmit");
            this.cancel = $("#btnCancel");

            this.passwordQuestionArea = $("#passwordQuestionArea");
            this.passwordEmailArea = $("#passwordEmailArea");
            this.passwordQuestionState = $("#passwordQuestionState");
            this.passwordEmailState = $("#passwordEmailState");
            this.passwordQuestion = $("#passwordQuestion");
            this.passwordEmail = $("#passwordEmail");

            this.pwdQueType = 'set_password_question';
            this.pwdEmailType = 'set_password_email';

            this.initEvents(); //初始化事件绑定
            this.render();
        },
        render: function () {
            var This = this;
            var model = This.model;
            var $User = top.$User;
            var userConfig = $User.getUserConfig();
            var isNotChinaMobileUser = $User.isNotChinaMobileUser();
            if(userConfig && isNotChinaMobileUser){
            //if(userConfig){ //测试用
                this.passwordQuestionArea.removeClass('hide');
                this.passwordEmailArea.removeClass('hide');
                var externalquestion = userConfig.externalquestion;
                var externalanswer = userConfig.externalanswer;
                var externalemail = userConfig.externalemail;
                if(externalquestion && externalquestion[1] != '' && externalquestion[1] != 0
                && externalanswer && externalanswer[1] != ''){
                    this.passwordQuestionState.html('已设置');
                    this.passwordQuestion.html('<span>重  置</span>');
                    this.pwdQueType = "reset_password_question";
                }
                if(externalemail && externalemail[1] != '' && externalemail[1] != 0){
                    this.passwordEmailState.html('已设置');
                    this.passwordEmail.html('<span>重  置</span>');
                    this.pwdEmailType = 'reset_password_email';
                }
            }

            //如果是互联网用户，则显示绑定
            This.bindPhoneArea.show();

            if (top.$User.getProvCode() == "83") {
                This.changeMobile.find("span").text("立即绑定手机 >>");
            } else {
                This.changeMobile.find("span").text("更换绑定手机 >>");
            }

            //parent.M139.UI.TipMessage.show(This.messages.LOADING);
            model.initData(function (result) {
                var code = result.code;
                if (code == "S_OK" || code == "S_PARTIAL") {
                    model.trigger("fetch:privacy");

                    /* 设置生日下拉框 */
                    var birthday = model.get("birthday");
                    This.datePicker.setDate(birthday);

                    //有通讯录数据来显示电子签名
                    var userInfo = This.model.get('originalUserInfo');
                    signatureView = new M2012.Settings.Sign.View({ userInfo: userInfo });
                    signatureView.render();

                    accountView = new M2012.Settings.Account.View({ userInfo: userInfo });
                    accountView.render("custom", "setUserTemplate", "setUserTdTemplate", "userTable", "userTr");
                    accountView.render("pop", "setPopTemplate", "setPopTdTemplate", "popTable", "popTr");

                    var imgUrl = userInfo.ImageUrl;
	                var baseUrl;
                   
                    if(imgUrl.indexOf("//") == -1) {
	                    if (location.host.indexOf("10086ts") > -1) {
							baseUrl = "http://g2.mail.10086ts.cn";
						} else {
							baseUrl = top.getDomain("resource");
						}
						imgUrl = baseUrl + imgUrl + '?rd='+ Math.random();
                    }
					$("#userImage").attr("src", imgUrl);
                } else {
                    parent.M139.UI.TipMessage.show(This.messages.LOAD_DATA_ERROR, { delay: 3000 });
                }
                This.init = true;
            });
			//初始化手机登陆设置
			(function(){
				var configID = top.$App.getConfig('UserData').mainUserConfig["checkloginway"] && top.$App.getConfig('UserData').mainUserConfig["checkloginway"][0];
				var buttonMobileLogin = $("input[type='radio'][name='configId']");
				buttonMobileLogin.click(function(){
					buttonMobileLogin.removeAttr("checked");
					$(this).attr("checked","checked");
				});
				if(!configID || configID == -1){
					buttonMobileLogin.eq(0).attr("checked","checked");
				}
				$.each(buttonMobileLogin,function(){
					var value = $(this).val();
					if(configID == value){
						$(this).attr("checked","checked");
						return;
					}
				});
			})();
        },
        initEvents: function () {
            var This = this;
            var model = This.model;

            /* 修改密码按钮点击 */
            This.password.on("click", function () {
                top.BH('set_modify_password'); //点击修改密码，上报

                var TO_UPDATE = 12;
                var TO_MOD_PWD = 12;
                var reqData = { optype: 12, rnd: Math.random() };
                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
 

                    if (!isumcuser) {
                        top.LinkConfig["password"] = { url: url, site: "", title: "修改密码" },
                        top.$App.show("password");
                    } else {
                        top.$Msg.open({ url: url, dialogTitle: "修改密码", width: 601, height: 432, hideTitleBar: true })
                    }
                });
            });

            /* 邮箱换号 */
            This.changeMobile.on("click", function () {

                var TO_UPDATE = 1;
                var TO_BIND_PHONE = 6;
                var TO_CHANG_PHONE = 9;

                var reqData = { optype: TO_CHANG_PHONE, rnd: Math.random() };

                if (top.$User.getProvCode() == "83") {
                    reqData.optype = TO_BIND_PHONE;
                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });
            });

            /* 设置或重置密保问题 */
            This.passwordQuestion.on("click", function () {
                top.BH(This.pwdQueType); //点击重置密保问题，上报

                var TO_UPDATE = 1;
                var TO_SET_ANSWER = 13;
                var TO_CHANG_ANSWER = 14;

                var reqData = { optype: TO_SET_ANSWER, rnd: Math.random() };

                var userConfig = top.$User.getUserConfig();
                if (userConfig) {

                    var q = userConfig.externalquestion;
                    if ( q && q[1] != '' && q[1] != 0 ) {
                        reqData.optype = TO_CHANG_ANSWER;
                    }
                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }
                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });
            });

            /* 设置或重置密保邮箱 */
            This.passwordEmail.on("click", function () {
                top.BH(This.pwdEmailType); //点击重置密保邮箱，上报

                var TO_UPDATE = 1;
                var TO_BIND_EMAIL = 4;
                var TO_CHANG_EMAIL = 8;

                var reqData = { optype: TO_BIND_EMAIL, rnd: Math.random() };

                var userConfig = top.$User.getUserConfig();
                if (userConfig) {

                    var e = userConfig.externalemail;
                    if ( e && e[1] != '' && e[1] != 0 ) {
                        reqData.optype = TO_CHANG_EMAIL;
                    }

                }

                var url = M139.HttpRouter.getUrl("umc:rdirectCall").replace("/setting/", "/mw2/setting/");

                top.$User.isUmcUserAsync(function(isumcuser){
                    if (!isumcuser) {
                        reqData.to = reqData.optype;
                        reqData.optype = TO_UPDATE;
                    }

                    url = $Url.makeUrl(url, reqData);
                    window.open(url);
                });

            });

            /* 账户隐私设置修改 */
            This.privacyAccountAll.on("click", function (e) {
                var val = $(this).filter(":checked").val();
                model.set("privacy", val);
            });

            /* 姓名，邮箱，手机设置 */
            This.allInput.on("blur", function () { //设置username，email，mobile
                var val = $(this).val();
                var key = $(this).attr("rel");
                This.model.set(key, val);
            });
            model.on("change:userName", function () {
                var userName = model.get("userName");
                This.onModelChange("userName", This.userName);
                This.account.model.set("userName", userName); //更新账户设置中的发件人姓名

                top.$App.getConfig("UserAttrs").trueName = userName;
            });
            This.account.model.on("change:userName", function () {
                var userName = This.account.model.get("userName");
                model.set("userName", userName);
            });
            model.on("change:email", function () {
                This.onModelChange("email", This.email);
            });
            model.on("change:mobile", function () {
                This.onModelChange("mobile", This.mobile);
            });

            /* 隐私设置，下拉列表 */
            This.privacySetAll.on("click", function () {
                This.showMenu($(this));
            });

            /* 账户信息隐私设置 */
            model.on("change:AddrFirstName", function () {
                This.setValue("AddrFirstName", This.privacyName);
            });
            model.on("change:FamilyEmail", function () {
                This.setValue("FamilyEmail", This.privacyEmail);
            });
            model.on("change:MobilePhone", function () {
                This.setValue("MobilePhone", This.privacyMobile);
            });
            model.on("change:BirDay", function () {
                This.setValue("BirDay", This.privacyBirthday);
            });

            model.on("change:serverexception", function (errObj) {
                top.$Msg.alert("获取数据失败");
            });


            model.on("fetch:privacy", function () {
                var value = model.get("privacy");
                This.privacyAccountAll.filter("[value=" + value + "]").attr("checked", "checked");
            });

            //显示默认的“所有人可见”
            This.showDefault(This.privacyName, 0);
            This.showDefault(This.privacyEmail, 0);
            This.showDefault(This.privacyMobile, 0);
            This.showDefault(This.privacyBirthday, 0);

            /* 生日下拉框 */
            This.birthday.html("");
            This.datePicker = new M2012.Settings.View.Birthday({
                container: This.birthday,
                orderby: "desc",
                check: true
            });

            /* 更多信息 */
            This.moreInfo.on("click", function () {
                if (parent.$User.checkAvaibleForMobile()) {
                    parent.$App.jumpTo('baseData');
                }
            });

            /* 保存按钮 */
            This.submit.on("click", function () {
                This.update();
            });
            /* 取消按钮 */
            This.cancel.on("click", function () {
                parent.$App.closeTab("account");
            });

        },
        onModelChange: function (key, dom) {
            var value = this.model.get(key) || "";
            dom.val(value);
        },
        setValue: function (key, dom) {
            var This = this;
            var model = This.model;
            var value = model.get(key);
            This.showDefault(dom, value);
            model.attributes.UserInfoSetting = model.attributes.UserInfoSetting || {};
            model.attributes.UserInfoSetting[key] = value;
        },
        showDefault: function (dom, ruleIndex) {
            ruleIndex = parseInt(ruleIndex, 10);
            if (ruleIndex < 0 || ruleIndex > 2) {
                ruleIndex = 0;
            }

            var selectText = ["仅好友可见", "所有人可见", "仅自己可见"];
            var selectData = {
                "text": ["仅好友可见", "所有人可见", "仅自己可见"],
                "class": ["i_see_best", "i_see_all", "i_see_self"]
            };

            var selected = '<i class="{class} mr_5"></i>{text}<i class="i_triangle_d ml_5"></i>';
            var defaultHtml = $T.Utils.format(selected, {//替换内容
                "text": selectData.text[ruleIndex],
                "class": selectData["class"][ruleIndex]
            });
            dom.html(defaultHtml);
        },
        showMenu: function (dom) {
            var This = this;
            var offset = dom.offset();
            /*
            现网情况：
            0：仅好友
            1：所有人
            2：仅自己
            */
            var privacyMenu = M2012.UI.PopMenu.create({
                //覆盖PopMenu的模版
                itemsTemplate: '<li><a href="javascript:;"></a></li>',
                itemsContentPath: 'a',
                //end
                items: [
                    {
                        html: '<i class="i_see_all mr_5"></i><span class="text">所有人可见</span>',
                        "value": 1
                    },
                    {
                        html: '<i class="i_see_best mr_5"></i><span class="text">仅好友可见</span>',
                        "value": 0
                    },
                    {
                        html: '<i class="i_see_self mr_5"></i><span class="text">仅自己可见</span>',
                        "value": 2
                    }
                ],
                left: offset.left,
                top: offset.top + dom.height(),
                onItemClick: function (item) {
                    var key = dom.attr("rel"); //关联HTML的自定义标签rel
                    var value = item.value;
                    This.model.set(key, value);
                }
            });

            privacyMenu.$el.addClass("seePop");
        },
        update: function () {
            var This = this;
			var value = $("input[name='configId']:checked").val();
            var message = This.messages;
            var birthday = This.datePicker.getDate();
            if (birthday === undefined) {
                return;
            }
            var SUCCESS = "S_OK";

            This.model.set("birthday", birthday);
            This.model.update(function (result) {
                if (!result || result.code != SUCCESS) {
                    var msg = message.SETTING_SAVE_FAILURE
                    if (result.msg && result.msg != "未知错误") {
                        msg += "，" + result.msg;
                    }

                    parent.$Msg.alert(msg, { onclose: function() {
                        if ("ER_EMAIL_INVALID" == result.code) {
                            This.email.focus();
                        } else if ("ER_MOBILE_INVALID" == result.code) {
                            This.mobile.focus();
                        }
                    }});

                    return;
                }
                parent.M139.UI.TipMessage.show(message.SETTING_SAVED, { delay: 3000 });
				//设置手机登陆设置
			
				M139.RichMail.API.call("user:setUserConfigInfo", { configTag: "CheckLoginWay", type: "int", configValue: parseInt(value) ,configType: 1},function(){
						parent.$App.trigger("userAttrChange", {
							trueName: This.model.get("userName"),
							callback: function () {
								This.account.render();
								// This.render();

								// add by tkh 刷新账号管理列表
								accountAdminView.reflush();
								if (typeof (signatureView) != "undefined" && signatureView.render) {
									signatureView.render();
								}

							}
						});
						
				});
            });
        }
    })
    );

    $(function () {
        accountSetting = new M2012.Settings.View.Account.Main();
        //得到url中useinfo的参数
        var userinfo = $T.Url.queryString('info');
        if($("#"+userinfo).length>0){
        	top.$PUtils.setIframeScrollTop($("#"+userinfo),window);
        }
    });
})(jQuery, _, M139);