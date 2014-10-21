/**
* @fileOverview 定义新手上路的文件.
*/
/**
*@namespace 
*新手引导
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Initset.View_New', superClass.extend(
    /**
    *@lends SpamView.prototype
    */
        {
        initialize: function () {
            this.model = new M2012.Settings.Initset.Model_New();
			this.firstFlag = true;
			this.secondFlag = true;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var self = this;
			this.getUserinfo(function(){
				self.controlDialogShow();
			});
        //    this.getBirthday();
        //    this.initEvents();
            return superClass.prototype.render.apply(this, arguments);
        },
		htmlTemplate: {
			firstStep:['<div class="seltips-iframe">',
						'<div class="norTips"><span class="norTipsIco"><i class="i_ok"></i></span>',
							'<dl class="norTipsContent">',
								'<dt class="norTipsTitle">感谢您选择139邮箱！</dt>',
								'<dd class="norTipsLine gray">轻松两步让我们快速完成邮箱设置吧。</dd>',
							'</dl>',
						'</div>',
						'<div class="imgInfo"> <i class="imgLink i_1one"></i>',
							'<dl>',
								'<dt class="fz_14">第一步：设置邮箱别名帐号。</dt>',
								'<dd><P class="gray">可以用来登录邮箱，更有效保护个人隐私。</P>',
									'<div class="mt_20 mb_5">别名账号：<input id="mailAlias" type="text" value="例:zhangsan" class="iText gray" style="width: 111px;" /> @139.com </div>',
									'<p id="aliasTip" class="gray">以字母开头，5-15个字符。<span class="red">设置后不可修改删除</span></p>',
								'</dd>',
							'</dl>',
						'</div>',
						'<div class="ta_c pt_20">',
							'<a href="javascript:void(0)" id="firstStep" class="seltips-i-btn">下一步</a>',
						'</div>',
						'</div>'].join(""),
			secondStep: ['<div class="seltips-iframe">',
					'<div class="norTips"><span class="norTipsIco"><i class="i_ok"></i></span>',
						'<dl class="norTipsContent">',
							'<dt class="norTipsTitle">感谢您选择139邮箱！</dt>',
							'<dd class="norTipsLine gray">轻松两步让我们快速完成邮箱设置吧。</dd>',
						'</dl>',
					'</div>',
					'<div class="imgInfo"> <i class="imgLink i_2two"></i>',
						'<dl>',
							'<dt class="fz_14">第二步：完善个人资料设置。让邮箱更加好用。</dt>',
							'<dd><P class="gray">设置发信人姓名，让好友从众多联系人中快速认出你。</P>',
								'<div class="mt_20 mb_5">发件人姓名：<input type="text" id="sendName" value="例：张三" class="iText gray" /> </div>',
								'<p class="gray">设置生日，生日当天可收到意外惊喜和满满的祝福。</p>',
								'<div class="mt_5" id="info_birthday" style="height: 25px; margin-bottom: 5px;"><span class="fl">生日：</span>',
									/*'<div class="dropDown dropDown-year">',
										'<div class="dropDownA" href="javascript:void(0)"> <i class="i_triangle_d"></i>',
										'</div>',
										'<div class="dropDownText">1986</div>',
									'</div>',
									'<div class="dropDown dropDown-month">',
										'<div class="dropDownA" href="javascript:void(0)"> <i class="i_triangle_d"></i>',
										'</div>',
										'<div class="dropDownText">7</div>',
									'</div>',
									'<div class="dropDown dropDown-month">',
										'<div class="dropDownA" href="javascript:void(0)">',
											'<i class="i_triangle_d"></i>',
										'</div>',
										'<div class="dropDownText">7</div>',
									'</div>',*/
								'</div>',
								'<p class="red" id="birthdayTips" style="display: none;">生日选择不能超过今天，请重新选择</p>',
							'</dd>',
						'</dl>',
					'</div>',
					'<div class="ta_c pt_20">',
						'<a href="javascript:void(0)" id="secondStep" class="seltips-i-btn">下一步</a>',
					'</div>',
				'</div>'].join(""),
			thirdStep: ['<div class="seltips-iframe">',
					'<div class="norTips"><span class="norTipsIco"><i class="i_ok"></i></span>',
						'<dl class="norTipsContent">',
							'<dt class="norTipsTitle">感谢您选择139邮箱！</dt>',
							'<dd class="norTipsLine gray">立即进入邮箱体验吧。</dd>',
						'</dl>',
					'</div>',
					'<p class="fz_14 gray">最后，我们推荐您订阅云邮局优质服务与精品杂志，感受一站式生活体验！</p>',
					'<div class="seltips-i-app" id="initColumns">',
						'<span class="i_erweima"></span>',
	//					'<div class="imgInfo">',
	//		'<img class="imgLink" width="56" height="56" src="http://images.139cm.com/subscribe//upload/2013/12/04/266//images/ae81128c-ebf6-4aa8-a082-e42f0203f6a1.png">',			
	//						'<dl>',
	//							'<dt class="fz_14">',
	//								'<input type="checkbox" class="mr_5" />',			
	//								'<label for="">全国电影排期</label>',
	//							'</dt>',
	//							'<dd class="gray">电影爱好者的贴心助手</dd>',
	//						'</dl>',
	//					'</div>',
	//					'<div class="imgInfo">',
	//		'<img class="imgLink" width="56" height="56" src="http://images.139cm.com/subscribe//upload/2013/12/04/266//images/ae81128c-ebf6-4aa8-a082-e42f0203f6a1.png">',					
	//						'<dl>',
	//							'<dt class="fz_14">',
	//								'<input type="checkbox" class="mr_5" />',			
	//								'<label for="">全国电影排期</label>',
	//							'</dt>',
	//							'<dd class="gray">国内最新最热资讯</dd>',
	//						'</dl>',
	//					'</div>',
					'</div>',
					'<div class="ta_c pt_20">',
						'<a href="javascript:void(0)" id="thirdStep" class="seltips-i-btn">体验邮箱</a>',
					'</div>',
				'</div>'].join(""),
			fourthStep: [
                '<style type="text/css" media="screen">',
 		'.lottery_btnBox a{float: left;  width: 138px; height: 46px; padding-top: 136px; background: url(../images/201312/lottery.jpg) no-repeat 10px 7px; border: #fafafa solid 1px; font-size: 12px;  color:#999; text-align: center; margin-right: 20px; position: relative; *zoom:1;}',
 		'.lottery_btnBox a:hover{border-color:#dcdcdc; color:#999;}',
 		'.qiulingqu_ico{position:absolute; top:13px; right:-6px; width:53px; height: 27px; background: url(../images/201312/qiulingqu_24.png) no-repeat 0 0;_background: url(../images/201312/qiulingqu.png) no-repeat 0 0;}',
 	'</style>',
                '<div class="norTips">',
                 '<dl class="norTipsContent">',
                     '<dd class="norTipsLine">为欢迎您的到来，我们准备了开箱邮礼活动，不仅帮助您更好的使用邮箱，<br>还奉上丰厚好礼供主人您享用哦~</dd>',
                     '<dd class="fw_b" style="padding: 5px 0 17px;">试试点击宝箱，发现意想不到的惊喜！</dd>',
                     '<dd class="clearfix lottery_btnBox">',
                     	'<a style="background-position: -570px 7px;">',
                     		'<span style="color:#589db4" class="fw_b">常联系宝箱</span><br>',
                     		'邮件联系你我Ta',
                     	'</a>',
                     	'<a id="lotPassword" href="javascript:;" style="margin-right:0;background-position: -376px 7px;">',
                     		'<span style="color:#b0a632" class="fw_b">信息安全宝箱</span><br>',
                     		'设置密码保障信息安全',
                     		'<i class="qiulingqu_ico" style="right:0"></i>',
                     	'</a>',
                     	'<a style="background-position: -570px 7px;">',
                     		'<span style="color:#84a847" class="fw_b">心意传递宝箱</span><br>',
                     		'时刻贺卡传心意',
                     	'</a>',
                     '</dd>',
                 '</dl>',
                 '<p class="mt_5"><a id="l_football" href="javascript:$App.show(\'football\')">一键穿梭：带你走进足球的世界</a></p>',
             '</div>'].join("")
		},
		firstStep: function(){
			var self = this;
			this.firstStep = top.$Msg.showHTML(
				this.htmlTemplate.firstStep,
				{
					title : "温馨提示",
					width : 430
				}
			).on("close",function(){
			    self.changeShownewuserguide();
			    self.fourthStep();
			});
			BH('guide_success_popUp');
		},
		secondStep: function(){
			var self = this;
			this.secondStep = top.$Msg.showHTML(
				this.htmlTemplate.secondStep,
				{
					title : "温馨提示",
					width : 430
				}
			).on("close",function(){
			    self.changeShownewuserguide();
			    self.fourthStep();
			});
			BH('guide_success_popUp');
		},
		thirdStep: function(){
		    var self = this;
            
		    var htmlTemplate = this.htmlTemplate.thirdStep;
		    if (self.allowShowLottery()) {
		        htmlTemplate = htmlTemplate.replace(/体验邮箱/, "参与活动抽大奖");
		    }
			this.thirdStep = top.$Msg.showHTML(
				htmlTemplate,
				{
					title : "温馨提示",
					width : 430
				}
			).on("close",function(){
			    self.changeShownewuserguide();
			    self.fourthStep();
			});
			BH('guide_success_popUp');
		},
		fourthStep: function () {
		    var self = this;
		    if (self.closeNotByX) {
		        self.closeNotByX = false;
		        return;
		    }
		    var allowShowLottery = self.allowShowLottery();		   
		    if (allowShowLottery) {
		        top.addBehaviorExt({ actionId: 8000, thingId: 3729 });
		        M139.RichMail.API.call("setting:examinePwdStatus", '', function (res) {
		            res = res.responseData;
		            if (res && res.code == "S_OK") {
		                self.fourthStep = top.$Msg.showHTML(
                            self.htmlTemplate.fourthStep,
                            {
                                title: "尊敬的邮箱主人，我们已恭候多时啦！",
                                width: 520
                            });
                        //url地址设置，区分有没有设置密码的用户
		                //1：设置过密码，在邮箱内部新开Tab页面，然后请求资格审查接口。
		                //2：没设置过密码，浏览器新开窗口，然后请求资格审查接口
		                self.showLottery = res['var']['pwdStatus'];
		                var NoSetedUrl = "https://www.cmpassport.com/umc/firstuse/?from=3&appid=63&backurl=" +
		            encodeURIComponent(location.origin + location.pathname + '?sid=' + sid + '&id=51');
		                var setedUrl = "javascript:$App.show('lottery',{originID:3})";
		                if (self.showLottery == 1) {
		                    $('#lotPassword')[0].href = setedUrl;
		                } else if (self.showLottery == 2) {
		                    $('#lotPassword')[0].href = NoSetedUrl;
		                    $('#lotPassword')[0].target = "_blank";
		                }
		                //资格审查，用于给中间件记录一次抽奖
		                $('#lotPassword').click(function () {
		                    self.lotteryRecord(); 
		                    top.addBehaviorExt({ actionId: 8000, thingId: 3227 });
		                });
                        //关闭弹窗
		                $('#lotCompose,#lotCard,#lotPassword,#l_football').click(function () {
		                    self.fourthStep.close();
		                });
		            }

		        }, { method: "GET" });


		       

		    }
		},

		allowShowLottery: function () {
		    var self = this;
		    var deadTime = new Date(2014, 5, 31),
                validRegist = new Date(2014, 0, 1)
		    var now = top.M139.Date.getServerTime();
		    var registTime = $App.getConfig('UserData').registDate;
		    registTime = registTime ? $Date.parse(registTime) : new Date(2014, 5, 31);
		    var isCM = top.$User.isChinaMobileUser();  //是否移动用户
		    //1.活动有效期2014.6.30， 2. 用户是2014.1.1注册的, 3.开关打开,  4.是移动用户
		    if (SiteConfig.showLottery && now < deadTime && validRegist < registTime && isCM) {
		        return true;
		    } else {
		        return false;
		    }
		},

        //记录一次
		lotteryRecord: function () {
		    var optionStr = 'versionID=1&originID=3';
		    top.M139.RichMail.API.call("setting:examineShowStatus", optionStr, function (res) { });
		},
		controlDialogShow: function(){
			var self=  this;
		//	console.log(self.model.get("datasource"));
			//显示第一个框子，并实现逻辑判断
			this.firstStep();
			this.initAndcheckAlias();
			$("#firstStep").click(function () {
			    self.closeNotByX = true;  //标识，区分关闭窗口是通过 “下一步”还是“关闭按钮”
				if(!self.firstFlag){
					return ;//验证不通过的时候
				}
				self.firstStep.close();
				//判断别名，并设置别名
				self.setUserinfo("alias");
				//异步加载生日组件的js
				M139.core.utilCreateScriptTag({
                    id:"birthday",
                    src:"/m2012/js/richmail/settings/m2012.settings.view.birthday.js",
                    charset:"utf-8"
                },function(){
                    self.secondStep();
					self.initAndsetBirthday();
					$("#secondStep").click(function () {
					    self.closeNotByX = true;  //标识，区分关闭窗口是通过 “下一步”还是“关闭按钮”
						self.birthdayYanzheng();
						if(!self.secondFlag){
							return ;//验证不通过的时候
						}
						self.secondStep.close();
						//判断并设置
						self.setUserinfo("addressorName");
						self.thirdStep();
						self.initAndsetConfigColumns();
						$("#thirdStep").click(function () {
						    //判断并设置
						    if (self.allowShowLottery()) {
						        self.showLottery = true;
						    }
							self.setUserinfo("columnIds");
							
							self.thirdStep.close();
							self.changeShownewuserguide();
							//dosomething
						//	console.log("123321");
							//self.skipToMail();
						});
					});
                });
			});
		},
		changeShownewuserguide: function(){
			M139.RichMail.API.call("user:setUserConfigInfo", { configTag: "shownewuserguide", type: "int", configValue: 0},function(res){
			//	console.log(res);
			});
		},
        initAndsetConfigColumns: function () {//拼装订阅的html，input默认勾选。返回组装的html和id数组
			var tmp = ['<div class="imgInfo">',
							'<img class="imgLink" width="56" height="56" src="{imgUrl}">',		
							'<dl>',
								'<dt class="fz_14">',
									'<input type="checkbox" id="rss{id}" checked="checked" data-id="{id}" class="mr_5" />',			
									'<label for="rss{id}">{name}</label>',
								'</dt>',
								'<dd class="gray">{description}</dd>',
							'</dl>',
						'</div>'].join("");
			var data = this.model.get("datasource");
			var column = data.configColumns;
            var columnLen = column.length;
            var idArr = [];
            var htmlArr = [];
			column[0].description = '国内最新最热资讯';
			column[1].description = '电影爱好者的贴心助手';
			column[0].imgUrl = '/m2012/images/module/registerGuide/movies.png';
			column[1].imgUrl = '/m2012/images/module/registerGuide/news.png';
            for (var i = 0; i < columnLen; i++) {
                var id = column[i].id;
				var imgUrl = "http://images.139cm.com/subscribe//upload/2013/12/04/266//images/ae81128c-ebf6-4aa8-a082-e42f0203f6a1.png";
            //    var html = '<input checked type="checkbox" id="rss' + id + '" data-id="' + id + '"><label for="rss' + id + '">' + column[i].name + '</label>';
				var html = tmp.replace(/\{id\}/img, id).replace(/\{name\}/img, column[i].name).replace(/\{imgUrl\}/, column[i].imgUrl).replace("{description}",column[i].description);
                idArr.push(id);
                htmlArr.push(html);
            }
            var html2 = htmlArr.join("");
            var obj = {
                html: html2,
                idArr: idArr
            }
			$("#initColumns").append(html2);
		//    return obj;
        },
		getUserinfo: function (callback) {//获取接口返回的数据，把数据保存到model里，填充页面上的初始数据
            var self = this;
            this.model.getUserinfo(function (result) {
                if (result.code == "S_OK") {
                    var data = result["var"];
					self.model.set({datasource : data});
					callback && callback();
                };
            });
        },
        initAndsetBirthday: function () {//生日组件
            var self = this;
			var data = self.model.get("datasource");
            self.datePicker = new M2012.Settings.View.Birthday({
                container: $("#info_birthday"),
			//	date : data.birthday || $Date.format("yyyy-MM-dd",new Date()),
                orderby: "desc",
                check: true
            }).on("ymdchange",function(){
				self.birthdayYanzheng();
				if(!self.secondFlag){
					$("#birthdayTips").show();
				}else{
					$("#birthdayTips").hide();
				}
			});
			
        //    console.log(self.datePicker);
			this.sendName = $("#sendName");
			if(data.addressorName != ""){
				this.sendName.val(data.addressorName);
				this.sendName.removeClass("gray");
			}
			this.sendName.focus(function () {
				if($(this).val() == "例：张三"){
					$(this).val("");
				}
            });
        },
		birthdayYanzheng: function(){
			//生日提示
			var self = this;
			var year = self.datePicker.year.text();
			var month = self.datePicker.month.text();
			var day = self.datePicker.day.text();
			month = parseInt(month) < 10 && month.length < 2 ? "0" + month : month;
			day = parseInt(day) < 10 && day.length < 2 ? "0" + day : day;
			var birthday = year + month + day;
			birthday = birthday == "年月日" ? "" : birthday;
			if(!isNaN(birthday)){
				if(new Date(year,month - 1,day).getTime() > new Date().getTime()){
					self.secondFlag = false;
				}else{
					self.secondFlag = true;
				}
			}
		},
        skipToMail: function () {//跳过直接进入邮箱
			this.thirdStep.close();
		//	location.href = location.href;
        //    var self = this;
        //    this.skipStep.click(function () {
        //        self.model.gotoMail();
        //   })
        },
        checkData: function (obj) {//检查别名和发件人姓名格式
            var self = this;
			/*
			别名验证*/
			if(obj.yijizhuce && typeof obj.inputEl === "string"){
				$("#" + obj.tipsEl).addClass("red").html(obj.inputEl);
				self.firstFlag = false;
				return;
			}
			
            var text = obj.inputEl.val();
            var clientResult = self.model.clientCheckStr(text);
            var code = obj.type == "alias" ? clientResult.code != "S_OK" : clientResult.resultCode == 1;

            if (code) {
                $("#" + obj.tipsEl).addClass("red").html(clientResult.msg);
                self.firstFlag = false;
            } else {
                $("#" + obj.tipsEl).html(clientResult.msg);
                self.firstFlag = true;
            }
        },
        initAndcheckAlias: function () {//即时触发别名验证
            var self = this;
			var flag = false;
			this.mailAlias = $("#mailAlias");
			var data = self.model.get("datasource");
			if (data.alias != "") {
				this.mailAlias.val(data.alias);
				this.mailAlias.attr("disabled", true);
			//	this.mailAlias.prev().prev().css("background", "#ebebe4");
			} else {
				this.mailAlias.val(self.model.messages.defaultAlias).addClass("gray");
			}
            this.mailAlias.focus(function() {	
                var alias = $(this).val();
                if (alias == self.model.messages.defaultAlias) {
                    $(this).val("");
					self.firstFlag = false;
                }
                if ($(this).val() == "") {
                    $("#aliasTip").addClass("red").html(self.model.messages.aliasStrLength);
					self.firstFlag = false;
                }
            });

            this.mailAlias.keyup(function () {
                $(this).removeClass("gray");
                var obj = {
                    type: "alias",
                    tipsEl: "aliasTip",
                    inputEl: $(this)
                }
                self.checkData(obj);
            });

            this.mailAlias.blur(function () {
                var alias = self.mailAlias.val();
                if (alias == "") {
                    $(this).val(self.model.messages.defaultAlias);
                    $(this).addClass("gray");
                    return
                }
                self.model.serverCheckAlias(alias, function (result) {
                //    console.log(result)
				/*
				别名验证*/
				
					if(result.msg == "此别名已被注册，请重新输入！"){
						self.checkData({
							type: "alias",
							tipsEl: "aliasTip",
							inputEl: "此别名已被注册，请重新输入！",
							yijizhuce : true
						});
					}else{
						top.addBehaviorExt({ actionId: "105762"});
					}
				
                });
            });
        },
        setUserinfo: function (str) {//设置个人信息
            var self = this;
			var options = {};
			options.alias = this.mailAlias.val().trim();
			if(str == "alias"){
				//do nothing
				BH('guide_success_alians');
			}else if(str == "addressorName"){
				var year = self.datePicker.year.text();
				var month = self.datePicker.month.text();
				var day = self.datePicker.day.text();
				month = parseInt(month) < 10 && month.length < 2 ? "0" + month : month;
				day = parseInt(day) < 10 && day.length < 2 ? "0" + day : day;
				var birthday = year + month + day;
				birthday = birthday == "年月日" ? "" : birthday;
				
				options.addressorName = this.sendName.val() ? this.sendName.val() : " ";
				options.birthday = birthday;
				BH('guide_success_name');
				BH('guide_success_birthday');
			}else if(str == "columnIds"){
				options.columnIds = this.setColumns();
				BH('guide_success_subscribe');
			}
			/*
            var options = {
                alias: alias,
                addressorName: addressorName,
                birthday: birthday,
                sex: sex,
                columnIds: configColumns,
                imgUrl: imgUrl
            };*/
            this.model.setUserinfo(options, function (result) {

                if (result && result.code == "S_OK") {
                    if (str == "columnIds" && !self.showLottery) {
						setTimeout(function () {
							self.model.gotoMail();
						}, 1000);
					}
                } else {
                    $Msg.alert(self.model.messages.saveError);

                }
            });

        },
        setColumns: function () {
            var self = this;
            var arr = [];
            var configColumns = "";
            $("#initColumns").find("input[data-id]").each(function (i, n) {
                if ($(this).attr("checked")) {
                    arr.push($(this).attr("data-id"));
                }
            });
            configColumns = arr.join(",");
            return configColumns;
        }
    })
    );
    $(function () {
	//	var isShowFlag = top.$App.getConfig('UserData').mainUserConfig["shownewuserguide"] && top.$App.getConfig('UserData').mainUserConfig["shownewuserguide"][0];
		$App.on("infoSetLoad", function(data){
		//	console.log(data); 
			var isShowFlag = data["userMainData"]["mainUserConfig"]["shownewuserguide"] && data["userMainData"]["mainUserConfig"]["shownewuserguide"][0];
			if(isShowFlag == "1"){ //为1说明是新注册的用户
				new M2012.Settings.Initset.View_New().render();
			}
		});
		
    })
})(jQuery, _, M139);


