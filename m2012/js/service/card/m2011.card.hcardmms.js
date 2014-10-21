/***************************************************************
 *
 *程序启动
 *
***************************************************************/
$(function(){
	Utils.Timer.getStartTime();
	GCard.init();
	
	Utils.logReports({//进入彩信发贺卡页
		mouduleId: 14,
		action: 2391,
		thing: "mmsSendGreatCardPage"
	});
});

//公共提示语
var ShowMsg = {
    GetMMSInfoFail:		"获取赠送彩信使用情况失败，请稍后再试。",
    CardName:			"为您制作的贺卡",
    LoadFail:			"数据加载失败",
    GetSmsFailState:	"加载祝福语分类失败，请稍后再试。",
    GetSmsFail:			"加载祝福语分类失败，请稍后再试。",
    GetDataFailState:	"加载祝福语列表失败，请稍后再试。",
    GetDataError:		"加载祝福语列表失败，请稍后再试。",
    SendingCard:		"正在发送...",
    SystemBusy:			"彩信发送失败，请稍后再试。",
    NoCard:				"请选择要发送的贺卡！",
    NoRecNumber:		"请填写接收手机",
	NoRecBlessNumber:	"请选择接收祝福的好友",
    MaxSMSText:			"祝福语最多只能输入500个字！",
    NoCode:				"请输入验证码",
    WrongRecNumber:		"请正确填写接收手机号码:",
    MaxRecNumber:		"发送人数超过上限：{0}人",
    NoSendCard:			"确定不发送此贺卡吗？",
    SMSLength:			"您最多只能输入{0}个字！",
    LazyMaxRecNum:		"不能再选择收件人,一次最多只能发送10人",
    SameRecNum:			"不能添加已选择的重复联系人",
    UnicomNum:			"彩信贺卡暂时只能发送给移动用户，请重新添加！",
    HidTitle:			"隐藏主题",
    ChangeTitle:		"更改主题",
    HolidayFree:		"妇女节期间3月5日-3月8日彩信贺卡<span class='style12font-ff0000'>免费发送</span>", // "超出的条数，节日期间彩信贺卡<span class='style12font-ff0000'>免费发送</span>",
    HolidayFree1:		"妇女节期间3月5日-3月8日彩信贺卡免费发送。",//"节日期间彩信贺卡免费发送!"
	ComboUpgradeMsg: '，<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！'
};

var PromptMsg = "可同时发给{0}人，手机号以分号“;”隔开，可向全国移动用户发送",
	HolidayId = 0,
	ImageCode = "",
	InitStoreHouseId = 0,
	InitTitle = "",
	InitBlessing = "",
	CurrentStoreHouseId = 0,
	CurrentMaterialId = 0,
	CurrentTitle = "",
	CurrentPathUrl,
	MaxReceiverMobile = 200, //最大群发条数
	pageSize = 8,
	richInput = new Object(),
	//groupSendCount=0,//群发条数

	isBirthdayPage = false,
	birthdayData,
	br,

	CardInfo = {}, //上一张用户套餐可用的贺卡
	MaterialListHtml = {},
	NewHot = {//最新最热
		fresh: 0,
		hot: 1,
		all: 2
	},
	TopGroup = {//一级分类
		all: 0,
		holiday: 1,
		bless: 2,
		friend: 3,
		love: 4,
		birthday: 5
	};


//配置文件
var cardConfig = {
	cardHost: top.isRichmail ? top.SiteConfig.cardMiddleware : "http://" + location.host + "/",
	/*
	 * 获取接口URL
	 * @param {string} param 接口参数名称
	 * @return {string} url
	 */
	getInterfaceUrl: function (param) {
		//接口名称
	    var interFace= "/mw2/card/s?func=card:";
		return interFace + param + "&sid=" + top.$App.getSid();
	}
};

var PageUrl = {
	Success: "http://" + location.host + "/m2012/html/card/card_success.html?type=1&materId=" + CurrentMaterialId + "&rnd=" + Math.random(),
	CardResAddress: "http://images.139cm.com/cximages/card/", //素材地址 防止素材404添加初始化
	Error: "http://smsrebuild1.mail.10086.cn/card/error/systemTip4.html"
};

//浏览器检查
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

var GCard = {
	isInitDataLoad: false,
	classPageData: {},

	//日封顶数
	maxDaySend: 1000,
	
	//月封顶
	maxMonthSend: 10000,
	
	/*
	 * 封装ajax请求
	 * @url {String} 请求地址
	 * @params {Object} 请求参数
	 * @callback {Function} 回调函数
	 */
	ajaxRequest: function(url, params, callback){
	    top.M139.RichMail.API.call(cardConfig.getInterfaceUrl(url), params, callback);
	},
	/*
	 * json字符串转json对象
	 * @str {String} json字符串
	 * return {Object} json对象
	 */
	strToJson: function(str){
		if (!str) {
			return {};
		}

		if (window.JSON && JSON.parse) {
			return JSON.parse(str);
		} else {
			return eval("(" + str + ")");
		}
	},
	//页面初始化
	init: function(){
		
		this.pageTimeOut();						//超时判断
		this.initData();						//加载初始化数据

		this.showReceivermodule();				//显示接收人模块
		this.initReceivers();					//设置初始化接收人
		this.bindEvent();
		this.setValidateAndSubject();			//设置验证码输入框和主题
		this.getTipInfo();						//获得彩信信息
		this.checkInputWord();					//检查字数
		this.loadBirthday();					//加载生日提醒
	},
	//事件绑定
	bindEvent: function(){
		var doc = document;
		function $id(id){
			return doc.getElementById(id);
		}

		var tbEditor = $("#tbEditor"),
			imgRnd = $id("imgRnd"),
			divCodeImg = $id("divCodeImg"),
			txtValidCode = $id("txtValidCode"),
			smsListBar = $id("divSmsListBar"),        //插入短信内容      
			iarrowDown = $id("iarrowDown"),           //懒人贺卡滚动标志
			//aShowSubject = $id("aShowSubject"),     //更改主题按钮
			btnBack = $id("btnBack"),                 //返回发贺卡页面按钮
			btnBack1 = $id("btnBack1"),
			btnSendMms1 = $id("btnSendMms1"),     //发彩信贺卡按钮
			btnSendMms = $id("btnSendMms"),     
			imgCodeBtn = $id("imgCode"),          //刷新验证码按钮     
			mmsTab = $id("mmsTab"),               //彩信贺卡tab
			smsTab = $id("smsTab"),               //祝福语tab
			smsClassSel = $id("sltSmsListBarClass"), //祝福语分类select
			liNew = $id("liNew").getElementsByTagName("a")[0], //最新链接
			liHot = $id("liHot").getElementsByTagName("a")[0]; //最热链接

		//点击验证码输入框事件
		$("#txtValidCode").focus(function(e) {
			e.stopPropagation();
            if (this.value == this.defaultValue) {
                this.value = "";
                $(this).removeClass("input-default");
            }
            $("#trValide").addClass("show-rnd-img");
            $("#spValidCode").show();
			//显示验证码
			if (!imgRnd.src) {
				GCard.refreshImgRndCode();
			}
            $(document).click(function(e) {
                var elem = e.target;
                while(elem && elem.id != "divValidate"){
	                elem = elem.parentNode;
	            }

	            if(!elem || e.target.id == "spanValidate") {
                    $(document).unbind("click");
                    $("#trValide").removeClass("show-rnd-img");
                    $("#spValidCode").hide();
                }
            });
        });

		//字数检查
		tbEditor.bind("propertychange", GCard.checkInputWord);
		tbEditor.bind("input", GCard.checkInputWord);
		tbEditor.attr("change", "false");
		tbEditor.change(function() {
			tbEditor.attr("change", "true");
		});

		//绑定点击分类显示素材
		this.bindEventChangeGroup();
		this.bindEventSmsList();
		
		//添加按钮(展示通讯录)
		$("#aAddrBook").click(function() {
			var addrFrame = $("#addrFrame");
			if (addrFrame.length == 0) {
				var url = "/m2012/html/addrwin.html?type=mobile&callback=AddrCallback&useNameText=true"
					.format(top.location.host,
						top.isRichmail ? '' : top.stylePath);

				addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:350px;width:170px;position:absolute;' id='addrFrame' src='" + url + "'></iframe>");
				addrFrame.appendTo(document.body);
				$(document).click(function() {
					$("#addrFrame").hide();
				});
			}
			var jLink = $(this);
			var offset = jLink.offset();
			addrFrame.css({ top: offset.top + jLink.height(), left: offset.left - addrFrame.width() + jLink.width() });
			addrFrame.show();
			return false;
		});

		Utils.addEvent(smsListBar, "onclick", function(e){
			e = e || window.event;
			var target = e.target || e.srcElement;

			if (target.tagName == "P") {
				var tbEditor = doc.getElementById("tbEditor"),
				editValue = tbEditor.value;

				tbEditor.value = editValue + GCard.html2Text(target);
				GCard.checkInputWord();

				Utils.logReports({
					mouduleId: 15,
					action: 20015,
					thing: "joinSms"
				});
			}
		})

		Utils.addEvent(iarrowDown, "onclick", this.arrowDown);
		//if(aShowSubject) $(aShowSubject).click(this.addSubjectHandler);
		
		//$(aShowSubject).click(this.addSubjectHandler);
		
		Utils.addEvent(btnBack, "onclick", this.changeSendMail);
		Utils.addEvent(btnBack1, "onclick", this.changeSendMail);
		
        Utils.addEvent(btnSendMms1, "onclick", function(){
			GCard.sendMms("1");
        });

		Utils.addEvent(btnSendMms, "onclick", function(){
			GCard.sendMms("2");
        })
		
		Utils.addEvent(imgCodeBtn, "onclick", function(){
			GCard.refreshImgRndCode();
			return false;
		});
		
		$(mmsTab).click(function(){
			GCard.changeTab(this, 0);
		});
		
		$(smsTab).click(function(){
			GCard.changeTab(this, 1);
		});
		
		Utils.addEvent(smsClassSel, "onchange", function(){
			GCard.loadSmsListBar(1);
		});

		liNew.setAttribute("param", NewHot.fresh + "," + TopGroup.all + "," + "0,1");
		liHot.setAttribute("param", NewHot.hot + "," + TopGroup.all + "," + "0,1");
	},

	/*
	 * 绑定分类单击事件
	 */
	bindEventChangeGroup: function(){
		var doc = document,
			wrap = doc.getElementById("divHCard"),
			materialLists = doc.getElementById("divContent");

		Utils.addEvent(wrap, "onclick", this.changeGroupHandler);
		Utils.addEvent(materialLists, "onclick", this.materialHandler);
	},

	/**
	 * 绑定模拟下拉菜单
	 * @param obj {Object} 模拟下拉菜单jquery对象
	 */
	bindDropMenu: function (obj) {
		var menu = obj.find(".selMenu"),
			btn = obj.find(".selPageLabel");

		btn.click(function (e){
			e.stopPropagation();
			$(this).next().show();
		});
		$(document).click(function(){
			menu.hide();
		});
	},
	/**
	 * 绑定短信分类模拟下拉菜单
	 * @param obj {Object} 模拟下拉菜单jquery对象
	 */
	bindSmsClassDropMenu: function (obj){
		this.bindDropMenu(obj);

		var menu = obj.find(".selMenu"),
			label = obj.find(".drop-down-text");

		menu.click(function (e){
			var target = e.target,
				tagName = target.tagName,
				value = target.getAttribute("value");

			if (tagName != "A") return;
			label.html(target.innerHTML);
			obj.attr("value", value);
			GCard.loadSmsListBar(1);
		})
	},

	/*
	 * 分类函数
	 */
	changeGroupHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("param"),
			tagName = target.tagName,
			arr = [];

		if(param){
			arr = param.split(",");
			GCard.changeGroup(parseInt(arr[0], 10), arr[1], arr[2], parseInt(arr[3], 10));
		}
		return false;
	},

	/*
	 * 显示点击素材函数
	 */
	materialHandler: function(e){
		e = e || event;
		var target = e.target || e.srcElement,
			param = target.getAttribute("info"),
			arr = [];

		if (param) {
			arr = param.split(",");
			GCard.storeHouseClick({
				id: parseInt(arr[0], 10),
				materid: arr[1],
				title: arr[2],
				scale: parseInt(arr[3], 10),
				path: arr[4],
				blessing: arr[5],
				combo: parseInt(arr[6], 10)
			});
		}
		return false;
	},
	bindEventSmsList: function(){
		$("#divMessage").click(function(e){
			var target = e.target,
				page = target.getAttribute("page");

			if (!page) return;
			GCard.loadSmsListBar(parseInt(page, 10));
		});
	},

	//超时判断
	pageTimeOut: function(){
		if(Utils.PageisTimeOut(true)){
			return false;
		}
	},
	
	//接收人输入框或者接收人显示
	showReceivermodule: function(){
		if (Utils.queryString("lazy")) {
			this.bindLazyManHtml();
		} else {
			//地址自动匹配
			var param = {
				container: document.getElementById("txtTo"),
				autoHeight: true,
				type: "mobile",
				plugins: [RichInputBox.Plugin.AutoCompleteMobile]
			}

			richInput = new RichInputBox(param);
			richInput.setTipText(PromptMsg);
		}
	},

	//初始化接收人
	initReceivers: function(){
		if (Utils.queryString("to") != null) {
			richInput.insertItem(Utils.queryString("to"));
		}
	},

	//设置验证码输入框和主题
	setValidateAndSubject: function(){
		var doc = document;
		doc.getElementById("txtSubject").value = "";
		doc.getElementById("spValidCode").style.display = "none";
		doc.getElementById("trControlValidCodeShow").style.display = "none";
	},

	//获得提示信息
	getTipInfo: function(){
		var param = {fromType: 1, actionType: 1},
			dataXml = namedVarToXML("", param, "");
		GCard.getTipInfoAjax(dataXml);
	},

	/**
	 * 获得提示信息初始化ajax
	 * @s {Object} 不同环境的$
	 * @data {String} 发送的请求数据
	 */
	getTipInfoAjax: function(data){
		var self = GCard;

	    top.M139.RichMail.API.call(
            Utils.getAddedSiteUrl("mmsInitData"),
            data,
            function (e) {
                var msg = e.responseData;
                if (msg.code == "S_OK") {
					if (Number(msg.groupNumHint)) {//获取群发条数
						MaxReceiverMobile = Number(msg.groupNumHint);
					}

					//组装发送人数超过上限的提示语
					ShowMsg.MaxRecNumber = ShowMsg.MaxRecNumber.replace("{0}", MaxReceiverMobile);
					if (top.SiteConfig.comboUpgrade && !self.is20Version()) {//非20元套餐
						ShowMsg.MaxRecNumber += ShowMsg.ComboUpgradeMsg;
					}

					self.getMaxDayMonthSend(msg.chargeHint);

                    var doc = document,
						validCodeNode = doc.getElementById("trControlValidCodeShow"),
						divMsg = doc.getElementById("divMsg"),
						mobile = $.trim(Utils.queryString("mobile"));

                    if (mobile && mobile.length > 0) {
                        richInput.insertItem(mobile);
                    } else {
                        richInput.setTipText(PromptMsg.replace("{0}", MaxReceiverMobile));
                    }

                    if (msg.validateUrl == "") {
                        validCodeNode.style.display = "none";
                    } else {
                        ImageCode = msg.validateUrl;
                        validCodeNode.style.display = "";
                    }
                  

                    divMsg.innerHTML = GCard.getPresentMmsInfo(msg);//添加彩信赠送提示语

                    function showPartnerTip() {
                        
                        if (top.$User.needMailPartner()) {
                            $("#divMsg").append("<div><a href='javascript:top.$App.show(\"mobile\")'>*开通邮箱伴侣</a>享受更多彩信优惠</div>");
                            top.BH("partner_guide3");
                        }
                         
                    }
                    showPartnerTip();
                } else {
					richInput.setTipText(PromptMsg.replace("{0}", MaxReceiverMobile));
				}
            },
			function () {
			    top.FloatingFrame.alert(ShowMsg.GetMMSInfoFail);
			}
		);
	},

	//加载初始化数据
	initData: function(){
		var isLog = Utils.queryString("isLog") || 0,//0=写日志上报，1=不写日志上报
			materialId = Utils.queryString("materialId") || 0,
			doc = document;

		if (materialId > 0) {
			doc.getElementById("btnBack").style.display = "";
			doc.getElementById("btnBack1").style.display = "";
		}

		var dataJson = {
				type: 1,
				isLog: isLog,
				materialId: materialId,
				pageSize: pageSize
		   },
		   dataXml = namedVarToXML("", dataJson, "");

		this.ajaxRequest("cardInitData", dataXml, this.initDataRes);
	},

	//加载初始化数据响应
	initDataRes: function (e) {
		var materialId = Utils.queryString("materialId") || 0;
		var msg = e.responseData;
		
		if (msg.code != "S_OK") {
			window.location.href = PageUrl.Error;
			return;
		}

		var msg = msg["var"];
		
		if (msg.address.length > 0) {//资源地址
			PageUrl.CardResAddress = msg.address;
		}
		HolidayId = msg.holidayId;//当前节日ID
		if (msg.groupJson) {//显示分类
			GCard.showGroup(msg.groupJson);
		}
			
		//显示素材
		var newHot = NewHot.hot,
			topGroupId = TopGroup.all,
			groupId = 0,
			currClassId = Utils.queryString("classid"),
			classPageData = GCard.classPageData;

		if (currClassId) {//设置分类(外部调用), 不清楚入口在哪里
			newHot = NewHot.all;
			topGroupId = groupId = currClassId;
			GCard.changeGroup(NewHot.all, currClassId, currClassId, 1);
		} else {
			if (classPageData.jsonData) {
				GCard.showList({
					jsonData: classPageData.jsonData,
					newHot: classPageData.newHot,
					topGroupId: classPageData.topGroupId,
					groupId: classPageData.groupId,
					scale: classPageData.scale
				});
			} else {
				GCard.showList({
					jsonData: msg.data,
					newHot: newHot,
					topGroupId: topGroupId,
					groupId: groupId,
					scale: 0
				});
			}
			GCard.isInitDataLoad = true;
			Utils.Timer.getPassTime();
		}
		if (newHot == NewHot.all) {//显示当前分类样式
			$(".divHCard ul li").removeClass("current");
			$("#divGroup li").removeClass("current");
			$("#liGroupId_" + topGroupId).addClass("current");
		}
		if (msg.data.retData.length > 0) {
			var index = GCard.listFindIndex(msg.data, materialId),
				defaultMaterial = msg.data.retData[index],
				doc = document,
				txtSubject = doc.getElementById("txtSubject"),
				tbEditor = doc.getElementById("tbEditor");
				
			if (classPageData.jsonData) {
				defaultMaterial = classPageData.jsonData.retData[0];
			};
			GCard.storeHouseClick({
				id: defaultMaterial.id,
				materid: defaultMaterial.materialId,
				title: escape(defaultMaterial.name),
				scale: defaultMaterial.scale,
				path: defaultMaterial.path,
				blessing: escape(defaultMaterial.blessing),
				combo: defaultMaterial.combo
			});
				
			if (defaultMaterial.materialId && materialId > 0 && defaultMaterial.materialId == materialId) {
				var subject = $.trim(Utils.queryString("subject")),
					cardContent = top._card_greetingcard_content;

				if (subject) {
					txtSubject.value = subject;
				}
				if (cardContent && $.trim(cardContent) != "") {
					tbEditor.value = cardContent;
					GCard.checkInputWord();
				}
			}

			InitStoreHouseId = defaultMaterial.id;
			CurrentMaterialId = defaultMaterial.materialId; //默认加载的贺卡ID
			InitTitle = txtSubject.value;
			InitBlessing = tbEditor.value;
		}
	},

	/*
	 * 素材显示
	 * @newHost {Number} 分类 0: 最新  1:最热  2:按分类
	 * @topGroupId {String} 一级分类 1:节日分类
	 * @groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 * @pageIndex {Number} 当前页数
	 */
	changeGroup: function(newHot, topGroupId, groupId, pageIndex) {
		$("#hdnNewHot").val(newHot);
		$("#hdnTopGroupId").val(topGroupId);
		$("#hdnGroupId").val(groupId);
		this.showChangeGroup(pageIndex);
	},

	//显示改变分类
	showChangeGroup: function(pageIndex) {
		this.pageTimeOut();

		var newHot = $("#hdnNewHot").val();
		var topGroupId = $("#hdnTopGroupId").val();
		var groupId = $("#hdnGroupId").val();
		var scale = 0; //$("#selScale").val();0:全部

		//显示当前分类样式
		$("#divHCard ul li").removeClass("current");
		$("#divGroup li").removeClass("current");
		if(newHot == NewHot.all){
			$("#liGroupId_" + topGroupId).addClass("current");
		}else if(newHot == NewHot.fresh){	
			$("#liNew").addClass("current");
		}else if(newHot == NewHot.hot){
			$("#liHot").addClass("current");
		}
		
		$("#ulChildGroupId_" + topGroupId).hide();//隐藏子分类

		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + scale + "_" + pageIndex,
			theNode = MaterialListHtml[nodeId];

		$("#ulTab_1 dl").removeClass("current");//更新素材样式
		$("#dlList_" + CurrentStoreHouseId).addClass("current");

		if (typeof theNode != "undefined" && nodeId != "divContent_2_5_5_0_1") {
			$("#divContent").html(theNode);
			this.bindDropMenu($("#divHCard .selPageBtn"));//翻页下拉菜单重新绑定事件
		} else {
			var dataJson = {
					type: 1,
					newHot: newHot,
					topGroupId: topGroupId, 
					groupId: groupId,
					scale: scale,
					pageIndex: pageIndex,
					pageSize: pageSize
				},
				dataXml = namedVarToXML("", dataJson, "");

			this.ajaxRequest("cardPageData", dataXml, function(e){
				var msg = e.responseData;
				if (msg.code == "S_OK") {
						var msg = msg["var"];

						if (GCard.isInitDataLoad) {
							GCard.showList({//显示素材
								jsonData: msg.data,
								newHot: newHot,
								topGroupId: topGroupId,
								groupId: groupId,
								scale: scale
							});
						} else {
							GCard.classPageData = {
								jsonData: msg.data,
								newHot: newHot,
								topGroupId: topGroupId,
								groupId: groupId,
								scale: scale
							};
						}

						if (msg.data.retData.length > 0 && Utils.queryString("classid") && Utils.queryString("classid") == groupId) {
							var defaultMaterial = msg.data.retData[0];

							if (GCard.isInitDataLoad) {
								GCard.storeHouseClick({
									id: defaultMaterial.id,
									materid: defaultMaterial.materialId,
									title: escape(defaultMaterial.name),
									scale: defaultMaterial.scale,
									path: defaultMaterial.path,
									blessing: escape(defaultMaterial.blessing),
									combo: defaultMaterial.combo
								});
								InitTitle = $("#txtSubject").val();
								InitBlessing = $("#tbEditor").val();
							}
								
							InitStoreHouseId = defaultMaterial.id;
							CurrentMaterialId = defaultMaterial.materialId; //默认加载的贺卡ID
						}
						if (isBirthdayPage && nodeId == "divContent_2_5_5_0_1") {
							var defaultMaterialBir = msg.data.retData[0];

							$("#txtSubject").val("");
							if (!GCard.isInitDataLoad) {return;};
							GCard.storeHouseClick({
								id: defaultMaterialBir.id,
								materid: defaultMaterialBir.materialId,
								title: escape(defaultMaterialBir.name),
								scale: defaultMaterialBir.scale,
								path: defaultMaterialBir.path,
								blessing: escape(defaultMaterialBir.blessing),
								combo: defaultMaterialBir.combo
							});
						}
					} else {
						window.location.href = PageUrl.Error;
					}
			});
		}
	},

	/*
	 * 显示素材列表
	 * @listInfo {Object} 所需信息(jsonData, newHot, topGroupId, groupId, scale)
	 *		jsonData {Object} 素材内容
	 *		newHot {Number} 分类 0:最新  1:最热  2:按分类
	 *		topGroupId {String} 一级分类 1:节日分类
	 *		groupId {String} 二级分类 如果topGroupId=1，groupId=0 选择全部节日，否则为节日ID
	 *		scale {String} 尺寸 
	 */
	showList: function(listInfo) {
		var doc = document, 
			vhtml = [],
			retData = listInfo.jsonData.retData;
			
		for(var i = 0, l = retData.length; i < l; i++){
			var vip = "",
				str = "",
				item = retData[i];

			str = '<dl id="dlList_{id}">\
						<dt>\
							<a href="javascript:;">\
								<img info="{id},{materialId},{name},{scale},{path},{blessing},{combo}" src="{thumbPath}" />\
							{vip}</a>\
						</dt>\
						<dd>{name1}<span>{scale1}</span></dd>\
					</dl>';
			str = String.format(str,{
				id: item.id,
				materialId: item.materialId,
				name: escape(item.name),
				scale: item.scale,
				path: item.path,
				blessing: escape(item.blessing),
				combo: item.combo,
				thumbPath: GCard.getFullUrl(item.thumbPath),
				vip: vip,
				name1: item.name,
				scale1: GCard.getScaleName(item.scale)
			});
			vhtml.push(str);
		}

		//处理图片中载两次代码
		var dom = doc.getElementById("ulTab_1");
		var temphtml = vhtml.join("");
		//为了防耻IE6两次
		if(Sys.ie){
			dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";
			//获取到请求下来的图片
			var wrapHtml = doc.createElement("div");
			wrapHtml.innerHTML = temphtml;
			var images = wrapHtml.getElementsByTagName("img");
			
			//等待图片加载完成
			var isComplete = true;
			var curinterval = window.setInterval(function(){
				for(var i = 0, l = images.length; i < l; i++){
					//如果还有未加载完成的，不能翻页
					if(!images[i].complete){
						isComplete = false;
						break;
					}
					isComplete = true;
				}
				if(isComplete){
					window.clearInterval(curinterval);
					GCard.showListHtml(dom, temphtml, listInfo);
				 }
			}, 10);
		}else{
			GCard.showListHtml(dom, temphtml, listInfo);
		}
	},

	/*
	 * 显示列表内容
	 * @html {String} 列表字符串
	 * @boxList {Object} 放图片列表的父容器
	 * @listInfo {Object} 列表信息
	 */
	showListHtml: function(boxList, html, listInfo){
		var newHot = listInfo.newHot,
			topGroupId = listInfo.topGroupId,
			groupId = listInfo.groupId,
			scale = listInfo.scale,
			jsonData = listInfo.jsonData,
			doc = document,
			ulPage = doc.getElementById("ulPage_1"),
			ulPageTop  = doc.getElementById("ulPageTop_1"),
			pageHtml = this.pageNav({
				newHot: newHot,
				topGroupId: topGroupId,
				groupId: groupId,
				pageIndex: jsonData.pageIndex,
				pageCount: jsonData.totalPage
			}),
			pageHtml_btm = this.pageNav({
				newHot: newHot,
				topGroupId: topGroupId,
				groupId: groupId,
				pageIndex: jsonData.pageIndex,
				pageCount: jsonData.totalPage,
				place: true
			});
					
		boxList.innerHTML = html;
		ulPage.innerHTML = pageHtml_btm;
		ulPageTop.innerHTML = pageHtml;
		this.bindDropMenu($("#divHCard .selPageBtn"));
		
		//单页时，隐藏翻页栏
		if(jsonData.totalPage < 2){
			ulPage.style.display = "none";
			ulPageTop.style.display = "none";
		}else{
			ulPage.style.display = "block";
			ulPageTop.style.display = "block";
		}

		//保存到本地
		var nodeId = "divContent_" + newHot + "_" + topGroupId + "_" + groupId + "_" + scale + "_" + jsonData.pageIndex,
			divCon = doc.getElementById("divContent");

		MaterialListHtml[nodeId] = divCon.innerHTML;//将翻页素材储存在MaterialListHtml中
	},

	//显示分类
	showGroup: function(jsonData){
		var vhtml = [],
			group = jsonData.group;
		
		for (var i = 0, l = group.length; i < l; i++) {
			var item = group[i],
				child = item.child;
				
			if (item.id == 1) {
				vhtml.push(String.format('<li id="liGroupId_{id}"  class="current">\
					<a href="javascript:;" param="{newHot},{topGroup},0,1">{name}</a>', 
					{
						id: item.id,
						newHot: NewHot.all,
						topGroup: TopGroup.holiday,
						name: item.name
					})
				);
				if (child.length > 0) {
					vhtml.push(String.format('<ul id="ulChildGroupId_{id}" class="sub-category" style="display:none">', 
						{id: item.id})
					);
					for (var j = 0, m = child.length; j < m; j++) {
						vhtml.push(String.format('<li><a href="javascript:;" param="{newHot},{id},{childId},1">{name}</a></li>', 
							{
								newHot: NewHot.all,
								id: item.id,
								childId: child[j].id,
								name: child[j].name
							})
						);
					}
					vhtml.push('</ul>');
				}
				vhtml.push('</li>'); 
			} else {
				vhtml.push(String.format('<li id="liGroupId_{id}">\
						<a href="javascript:;" param="{newHot},{id},{id},1">{name}</a>\
					</li>',
					{
						id: item.id,
						newHot: NewHot.all,
						name: item.name
					})
				);
			}
		}		
		$("#divGroup").html(vhtml.join(""));
		//显示或不显示子分类
		$("#divGroup li").hover(
			function(){
				$(this).find("ul").show();
			},
			function(){
				$(this).find("ul").hide();
			}
		);
		//子分类样式
		$("#divGroup li ul").find("li").hover(
			function(){
				$(this).addClass("on");
			},
			function(){
				$(this).removeClass("on");
			}
		); 
	},

	/**
	 * 翻页条
	 * navInfo {Object} 导航信息(newHot, topGroupId, groupId, pageIndex, pageCount, place)
	 *	 place {Boolean} 翻页条位置 上或者下 
	 */
	pageNav: function (navInfo) {
		var  newHot = navInfo.newHot,
			topGroupId = navInfo.topGroupId,
			groupId = navInfo.groupId,
			pageIndex = navInfo.pageIndex,
			pageCount = navInfo.pageCount,
			place = navInfo.place,
			prevClass = "previous",
			nextClass = "next",
			menuClass = (place === true) ? "selMenu ultop" : "selMenu",
			arrowIco = (place === true) ? "sjup" : "sjdown";

		pageIndex = parseInt(pageIndex, 10);
		pageCount = parseInt(pageCount, 10);
		if (pageIndex < 1) {
			pageIndex = 1;
		}
		if (pageIndex > pageCount) {
			pageIndex = pageCount;
		}
		if (pageIndex == 1) {
			prevClass = "previous-disabled";
		}
		if (pageIndex == pageCount) {
			nextClass = "next-disabled";
		}
		var prevIndex = pageIndex - 1,
			nextIndex = pageIndex + 1,
			pageStr = [];
		
		if (prevIndex >= 1) {
			pageStr.push(String.format('<li><a href="javascript:;" title="上一页"  param="{0},{1},{2},{3}">上一页</a></li>',
				[newHot, topGroupId, groupId, prevIndex]));
		}
		if (nextIndex <= pageCount) {
			pageStr.push(String.format('<li><a href="javascript:;" title="下一页"  param="{0},{1},{2},{3}">下一页</a></li>',
				[newHot, topGroupId, groupId, nextIndex]));
		}
		pageStr.push(String.format('<li class="selPageBtn ml_10"><a class="selPageLabel" href="javascript:;"><span>{0}/{1}页</span><i class="{2}"></i></a><ul class="{3}">', [pageIndex, pageCount, arrowIco, menuClass]));

		for (var i = 1; i <= pageCount; i++) {
			pageStr.push(String.format('<li><a param="{0},{1},{2},{3}" href="javascript:;">{3}/{4}页</a></li>',
				[newHot, topGroupId, groupId, i, pageCount]));
		}
		pageStr.push('</ul></li>');
		pageStr = pageStr.join("");
		return pageStr;
	},

	/**
	 * 显示左侧图片
	 * card {Object} 点击右侧贺卡图片的信息(id, materid, title, scale, path, blessing, combo)
	 */
	storeHouseClick: function(card) {
		Utils.logReports({
			mouduleId: 14,
			action: 10536,
			thing: "showGif"
		});

		var id = card.id,
			combo = card.combo;

		if (id == CurrentStoreHouseId) {
			return;
		}

		//点击的贺卡
		var cardNew = card;
		var vipInfo = (top.UserData.vipInfo && /^\d+$/.test(top.UserData.vipInfo.MAIL_2000009)) ? (top.UserData.vipInfo.MAIL_2000009 || "2") : "2"; //如果接口未返回vipInfo或者MAIL_2000009，默认使用2，全部贺卡都可以免费使用
		var currentUserCombo = parseInt(vipInfo, 10);

		if (currentUserCombo >= combo) {
			//用户套餐可用的
			CardInfo = card;
		} else {
			//用户套餐不可以发送对应的明信片
			var msg = 'VIP贺卡为5元版、20元版邮箱专属贺卡。立即升级，重新登录后即可使用。';
			/*
			switch (combo) {
				case 1:
					msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
				case 2:
					msg = UtilsMessage.vipNoPermissionNotice.format("20", "", "贺卡");
					break;
				default:
					msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");
					break;
			}
			*/

			top.FloatingFrame.confirm(msg, function() {
				GCard.showCard(CardInfo);
				top.$App.showOrderinfo();//单击确认,调整到套餐页
				top.addBehaviorExt({
					actionId: 102326,
					moduleId: 14
				});
			}, function() {
				GCard.showCard(CardInfo);//单击取消,返回到上一张可用的
			});
            /*todo
			(function() {
				top.$(".clR\\ CloseButton")[0].onclick = function() {
					GCard.showCard(CardInfo);
				}
			})();
            */
		}

		this.showCard(cardNew);
	},

	//显示当前贺卡
	showCard: function(card) {
		var preNamets = CurrentTitle;
		//更新当前值
		CurrentStoreHouseId = card.id;
		CurrentMaterialId = card.materid;
		CurrentTitle = unescape(card.title);
		CurrentPathUrl = this.getFullUrl(card.path);
		//更新样式
		$("#ulTab_1 dl").removeClass("current");
		$("#dlList_" + card.id).addClass("current");
		
		var doc = document,
			txtSubject = doc.getElementById("txtSubject"),
			txtSubjectValue = txtSubject.value,
			imgPreview = doc.getElementById("imgPreview"),
			tbEditor = doc.getElementById("tbEditor"),
			imgarea = doc.getElementById("imgarea");

		if (txtSubjectValue.length == 0 || txtSubjectValue == (this.setSubject() + "《" + preNamets + "》")) {//修改主题
			txtSubject.value = this.setSubject() + "《" + CurrentTitle + "》";
		}

		if (card.scale == 3) {
			imgarea.setAttribute("class", "");
		} else {
			imgarea.setAttribute("class", "small");
		}

		//显示图片
		imgPreview.src = CurrentPathUrl;
		imgPreview.style.display = "";

		//更改祝福语(赋值2次为了解决IE第一输入不触发onpropertychange事件问题
		tbEditor.value = unescape(card.blessing);
		tbEditor.value = unescape(card.blessing);
		tbEditor.setAttribute("text", card.blessing);
		tbEditor.setAttribute("text", card.blessing);

		//检查字数
		GCard.checkInputWord();
	},

	//获得经典短信分类
	loadSmsClass: function() {
		this.pageTimeOut();
		var smsClassNode = $("#sltSmsListBarClass"),
			pageLabel = smsClassNode.find(".drop-down-text"),
			menu = smsClassNode.find(".selMenu");

		if (menu.children().length > 0) return;

		this.ajaxRequest("getClassicSMS", null, function(e){
		    var data = e.responseData;

			if (data.code == "S_OK") {
				var data = data["var"],
					template = "",
					defaultValue = HolidayId > -1 ? "26_" + HolidayId : "26_0",
					defaultTxt = "";

				$.each(data.table, function(i, item) {
					var value = item.classId + "_" + item.subClassId,
						text = item.className;

					if (item.userNumber) {
						value = item.classId + "-" + item.userNumber;
					}
					if (item.subClassId > 0) {
						text = "-" + text;
					}
					if (value === defaultValue) {
						defaultTxt = text;
					}
					template += String.format('<li><a href="javascript:;" value="{0}">{1}</a></li>', [value, text.encode()]);
				});

				menu.html(template);
				pageLabel.html(defaultTxt);
				smsClassNode.attr("value", defaultValue);
				GCard.bindSmsClassDropMenu(smsClassNode);
				GCard.loadSmsListBar(1);
			}else{
				top.FloatingFrame.alert(ShowMsg.GetSmsFailState);
			}
		})
	},

	/*
	 * 加载经典短信列表
	 * @pageIndex {Number} 所翻页数
	 */
	loadSmsListBar: function(pageIndex) {
		this.pageTimeOut();

		var selectValue = $("#sltSmsListBarClass").attr("value"),
			url = "/mw2/card/uploads/Html/SmsListBar/SmsList_"+selectValue+"-"+pageIndex+".htm?rnd="+ Math.random(),
			param = {},
			reqType = "GET",
			conType = "application/json;charset:utf-8";

		if (selectValue.indexOf("-") > 0) {
			url = cardConfig.getInterfaceUrl("initSMSList");
			var splitValue = selectValue.split("-");
			param = {
				actionId: 0,
				classId: splitValue[0],
				pageSize: pageSize,
				pageIndex: pageIndex
			};
			reqType = "POST";
			conType = "application/xml;charset:utf-8";
			param = namedVarToXML("", param, "\r\n");
		}

		top.M139.RichMail.API.call(url, param,
            function (e) {
                var data = e.responseData;
		        var totalPage = 0,
                    dataList = null,
                    textHtml = [],//短信
                    pageHtml,//翻页
                    data = data["var"] ? data["var"] : data,
                    doc = document,
                    smsListBar = doc.getElementById("divSmsListBar"),
                    ulPage_2 = doc.getElementById("ulPage_2"),
                    ulPageTop_2 = doc.getElementById("ulPageTop_2"),
                    className = "";

		        smsListBar.innerHTML = "";
		        if (selectValue.indexOf("-") > 0) {
		            totalPage = data.pageCount;
		            dataList = data.table;
		        } else {
		            GCard.toLowers(data);
		            GCard.toLowers(data.tList);
		            totalPage = data.totalPage;
		            dataList = data.tList;
		        }

		        if (totalPage > 0) {
		            for (var i = 0, l = dataList.length; i < l; i++) {
		                className = (i % 2 == 0) ? "" : "line";
		                textHtml.push('<p class="' + className + '">' + dataList[i].content.encode() + '</p>');
		            }
		        }

		        textHtml = textHtml.join("");
		        pageHtmlTop = GCard.loadPageBar(pageIndex, totalPage);
		        pageHtml = GCard.loadPageBar(pageIndex, totalPage, true);
		        smsListBar.innerHTML = textHtml;
		        ulPage_2.innerHTML = pageHtml;
		        ulPageTop_2.innerHTML = pageHtmlTop;
		        GCard.bindDropMenu($("#divMessage .selPageBtn"));

		        if (totalPage < 2) {
		            ulPage_2.parentNode.style.display = "none";
		            ulPageTop_2.parentNode.style.display = "none";
		        } else {
		            ulPage_2.parentNode.style.display = "block";
		            ulPageTop_2.parentNode.style.display = "block";
		        }
		    },
			function (XmlHttpRequest, textStatus, errorThrown) {
			    top.FloatingFrame.alert(ShowMsg.GetDataError);
			}
		);
	},

	//加载祝福语翻页条
	loadPageBar: function(pageIndex, pageCount, place) {
		pageIndex = parseInt(pageIndex, 10);
		pageCount = parseInt(pageCount, 10);
		var prevClass = "previous";
		var nextClass = "next";
		var menuClass = (place === true) ? "selMenu ultop" : "selMenu";
		if (pageIndex < 1) pageIndex = 1;
		if (pageIndex > pageCount) pageIndex = pageCount;
		if (pageIndex == 1) prevClass = "previous-disabled";
		if (pageIndex == pageCount) nextClass = "next-disabled";
		var prevIndex = pageIndex - 1;
		var nextIndex = pageIndex + 1;
		var pageStr = "";
		if (prevIndex >= 1) {
			pageStr += '<li><a href="javascript:;" title="上一页" page="{0}">上一页</a></li>'.format(prevIndex);
		}
		if (nextIndex <= pageCount) {
			pageStr += '<li><a href="javascript:;"  title="下一页" page="{0}">下一页</a></li>'.format(nextIndex);
		}

		pageStr += '<li class="selPageBtn ml_10"><a class="selPageLabel" href="javascript:;"><span>{0}/{1}页</span><i class="sjdown"></i></a><ul class="{2}">'
			.format(pageIndex, pageCount, menuClass);
		for(var i=1; i<=pageCount; i++){
			pageStr += '<li><a page="{0}" href="javascript:;">{1}/{2}页</a></li>'
					.format(i, i, pageCount);
		}
		pageStr += '</ul></li>';  
		return pageStr;
	},

	//发送彩信
	sendMms: function(thingId) {
		this.pageTimeOut();
		
		if (!this.validate()) return;

		var doc = document,
			aSend = doc.getElementById("btnSendMms"),
			tbEditor = doc.getElementById("tbEditor"),
			txtSubject = doc.getElementById("txtSubject"),
			txtValidCode = doc.getElementById("txtValidCode"),
			sendHandler = aSend.onclick,
			storeHouseId = CurrentStoreHouseId,
			lotIndex = CurrentPathUrl.lastIndexOf("."),
			//ext = CurrentPathUrl.substring(lotIndex),
			mobilelist = this.getToMobile();
			dataStr = tbEditor.getAttribute("text"),
			cardTitle = txtSubject.value || this.setSubject(),
			validateValue = txtValidCode.value;

		aSend.onclick = null;

		if (escape(tbEditor.getAttribute("change")) == "true") {
			dataStr = escape(tbEditor.value);
		}

		if (validateValue == txtValidCode.defaultValue) {
			validateValue = "";
		}
		
		var dataJson = {
			receiverNumber: mobilelist,
			title: escape(cardTitle), 
			content: dataStr, 
			imageUrl: CurrentPathUrl.replace(PageUrl.CardResAddress, "/uploads/sys/"),
			materialId: storeHouseId,
			validate: validateValue,
			fromType: 1,
			actionId: 2
		},
			dataXml = namedVarToXML("", dataJson, "");

	

		GCard.getMmsPCardAjax(dataJson, sendHandler, mobilelist, storeHouseId);



		if (isBirthdayPage) {
			Utils.logReports({
				mouduleId: 14,
				action: 30160,
				thingId: thingId,
				thing: "sendBirthdayMms"
			});
		}
	},
	
	/**
	 * 获得发送彩信ajax
	 * @data {String} 发送的请求数据
	 * @sendHandler {Fun} 发送按钮绑定的处理器
	 * @mobilelist {String} 接收人列表
	 * @storeHouseId {String} 素材id
	 */
	getMmsPCardAjax: function (dataJson, sendHandler, mobilelist, storeHouseId) {
		var self = this;
	    var data = namedVarToXML("", dataJson, "");
	    top.M139.RichMail.API.call(Utils.getAddedSiteUrl("mmsPCard"), data,
			//top.WaitPannel.show(ShowMsg.SendingCard);todo
			function (e) {
			    var msg = e.responseData;
			    var doc = document,
					aSend = doc.getElementById("btnSendMms");

			    aSend.onclick = sendHandler;
			    top.WaitPannel.hide();

			    if (msg.code == "S_OK") {
			        top.$App.trigger("mms_send", {type:"greetingCard", count: dataJson.receiverNumber.split(",").length });

			        var re = mobilelist.replace(/(")([ \S\t]*?)("\s*<)/g, "");

			        re = re.replace(/<|>/g, "").replace(/[;；，]/g, ",");
			        top._greetingcard_re = re;//接收人
			        top._greetingcard_et = $("#txtSubject").val();
			        GCard.writeSuccessLog(storeHouseId);

			        Utils.logReports({
			            mouduleId: 14,
			            action: 221,
			            thing: "sendMmsCardSuccess"
			        });

			        setTimeout(function () { //延时，避免ie6出现aborted中断http请求
			            window.location.href = PageUrl.Success;
			        },500);
			    } else if (msg.code == "VALIDATE_ERR" || msg.code == "MMS_VALIDATE_INPT") {
			        var validCode = doc.getElementById("trControlValidCodeShow"),
						txtValidCode = doc.getElementById("txtValidCode");

			        validCode.style.display = "";
			        txtValidCode.value = txtValidCode.defaultValue;
			        ImageCode = msg.validateUrl;
			        GCard.refreshImgRndCode();
			        top.FloatingFrame.alert(msg.resultMsg.replace("\\r", ""));
			    } else if (msg.code == "MMS_CARD_5" || msg.code == "MMS_CARD_20") {
			        //不够套餐
			        var msg = UtilsMessage.vipNoPermissionNotice.format("5", "、20元版", "贺卡");

			        top.FloatingFrame.confirm(msg, function () {
			            //单击确认,调整到套餐页
			            top.Links.show('orderinfo');
			        }, function () { });
			    } else if (msg.code == "MMS_DAY_LIMIT" && top.SiteConfig.comboUpgrade) {
					self.tipMaxDayMonthSend();
				} else if (msg.code == "MMS_MONTH_LIMIT" && top.SiteConfig.comboUpgrade) {
					self.tipMaxDayMonthSend(true);
				} else {
					top.FloatingFrame.alert(msg.resultMsg || ShowMsg.SystemBusy);
			    }
			},
			function () {
			    top.WaitPannel.hide();
			    top.FloatingFrame.alert(ShowMsg.SystemBusy);
			}
		);
	},

	//加载生日提醒
	loadBirthday: function(){
	    if (Utils.queryString("birthday") || Utils.queryString("dyinfoBirthday")) {
			isBirthdayPage = true;
		}

	    if (Utils.queryString("dyinfoBirthday")) {
	        birthdayData = [top.$App.get("dyInfoBirtherData")];
	    }else if (Utils.queryString("singleBirthDay")) {
			if(top.SiteConfig.birthMail){
        	 	birthdayData = top.$App.get('birth').birdthMan;
			}else{
			    birthdayData = top.BirthRemind.birdthMan;
			}
		} else {
		    birthdayData =  top.$App.getModel("contacts").get("data").birthdayContacts||[];
		}
		if (birthdayData) {
			birthdayData = birthdayData.slice(0, 10);
		}

		if (!isBirthdayPage) {
			if (birthdayData && parseInt(birthdayData.length) > 0) {
				//生日提醒
				new ListByTemplate({
					"linkContainer":"tipsLink",
					"dataSource":birthdayData,
					explainMsg:"已发送祝福"
				});

				$("#tipsLink").click(function(){
					GCard.sentNumList();
					//日志上报
					Utils.logReports({
						mouduleId: 14,
						action: 30156,
						thing: "tipsLink"
					});
					return false;
				});

				$("#tipsLink").show();
				$("#trBirthday").hide();
			}
		} else {
			this.sentNumList();
		}
	},

	//贺卡发送列表
	sentNumList: function(){
		var dataJson = {
				op: "get"
			},
			dataXml = namedVarToXML("", dataJson, "");

		top.M139.RichMail.API.call(
            cardConfig.getInterfaceUrl("birthdayRemind"),
			dataXml,
			function(result){
				var names = "";
				if (result && result['responseData'] && result['responseData']['code'] == 'S_OK') {
				    result = result['responseData'];
				    if (result["var"]) {
				        $.each(result["var"].mobiles, function (index, item) {
				            names += item + "、";
				        });

				        if (names != "") {
				            names = names.substr(0, names.length - 1);
				        }
				    }
				}
				
				GCard.initBirthdayPage(names);
			},
			function(err){GCard.initBirthdayPage("");}
	   );
	},

	//绑定懒人贺卡HTML
	bindLazyManHtml: function() {
		var mobile = Utils.queryString("mobile");
		
		if(mobile != null && mobile != ""){
			var html = '';
			var objlist = mobile.split(',');

			$.each(objlist, function(i, item){
				var match = item.match(/(.+)<(.+)>/);

				if(match != null && match != ''){
					name = match[1].replace(/\"/g, "");
					email = match[2];
				}else{
					name = email = item;
				}
				
				html += String.format('<li  title="{email}">\
						<label for="chk_{index}">\
							<input type="checkbox" name="chk_{index}" value="{email}" id="chk_{index}" onclick="GCard.setLazyRecCount(this);" checked="checked"/>\
						{name}</label>\
					</li>',
					{
						email: email,
						index: i,
						name: Utils.htmlEncode(name)
					});
			});
			$("#lazycontactList").html(html);
		}
		this.setLazyRecCount();
		$("#txtTo").css("display", "none");
		$("#divLazyMan").css("display", "block");
		$("#trlazy").css("display", "");
		$("#alazy").css("display", "inline");
	},

	//懒人贺卡统计收件人
	setLazyRecCount: function(obj) {
		var len = $("#lazycontactList input:checkbox:checked").length;
		if (obj != null) {
			if (len > MaxReceiverMobile) {
				$(obj).attr("checked", false);
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display", "block");
			} else {
				$("#lazyErrMsg").css("display", "none");
				$("#emcheckall").text(len);
			}
		} else {
			//判断是否超过10个
			$("#lazyErrMsg").css("display", "none");
			if (len > MaxReceiverMobile) {
				$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
				$("#lazyErrMsg").css("display", "block");
			}
			else {
				$("#lazyErrMsg").css("display", "none");
				$("#emcheckall").text(len);
			}
		}
	},

	//获得每月赠送彩信信息
	getPresentMmsInfo: function(data){
		var s = data.chargeHint.replace(/class="style12font-ff0000"/g, "").replace(/限发/g, '限发<span>').replace(/条/g, '</span>条');
		        
		return "<p>"+s+"</p>";
	},

	//初始化主题内容
	setSubject: function() {
		var name = this.getUserName();

		if (isBirthdayPage) {
			return name + "给你送来了生日贺卡";
		} else {
			return name + ShowMsg.CardName;
		}
	},

	//获得用户名
	getUserName: function() {
	    return top.$User.getTrueName();
	},

	//查找
	listFindIndex: function(data, materialId) {
		var index = 0;
		if (materialId && materialId > 0) {
			for (var i = 0, l = data.retData.length; i < l; i++) {
				if (data.retData[i].materialId == materialId) {
					index = i;
					break;
				}
			}
		}
		return index;
	},

	//获得全路径URL
	getFullUrl: function(s) {
		if (s.indexOf(PageUrl.CardResAddress) == -1 && s.indexOf("http") == -1) {
			s = PageUrl.CardResAddress + s;
		}
		return s;
	},

	//获得尺寸大小
	getScaleName: function(scale) {
		var scaleName = "240*320";
		//1.小(128×128)，2.中(176×220)，3.大(240×320)
		switch (scale) {
			case 1: scaleName = "128×128"; break;
			case 2: scaleName = "176×220"; break;
			case 3: scaleName = "240×320"; break;
		}
		return scaleName;
	},

	//修改主题
	addSubjectHandler: function() {
		var txt = document.getElementById("txtSubject"),
			container = txt.parentNode.parentNode;

		if (container.style.display == "none") {
			container.style.display = "";
			this.innerHTML = ShowMsg.HidTitle;
			this.titleBak = this.title;
			this.title = "";
			Utils.focusTextBox(txt);
		} else {
			container.style.display = "none";
			this.innerHTML = ShowMsg.ChangeTitle;
			this.title = this.titleBak;
			_LastFocusAddressBox = document.getElementById("txtTo");
		}

		return false;
	},

	html2Text: function(obj) {
		var content = "";
		if (document.all) {
			content = obj.innerText;
		} else {
			var tmp = obj.innerHTML;
			tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
			var div = document.createElement("div");
			div.innerHTML = tmp;
			content = div.textContent;
		}
		return content;
	},

	//获得收件人邮箱中的手机号码，多个用逗号分割
	getToMobile: function() {
		var result = "";
		if (Utils.queryString("lazy")) {
			var mailReg = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
			var mailRegExt = /^<[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}>$/i;
			$("#lazycontactList input:checkbox:checked").each(function() {
				this.value = this.value.trim();
				var txt = this.value;
				if (Utils.isChinaMobileNumber(txt)) result += txt + ",";
			});
		} else if (isBirthdayPage) {
			var successMobiles = "";        //已发送生日提醒的列表 号码,日期;13760225650,2011-05-05
			var nodeList = br.getDataList("input[checked=true]");
			var arrBirthday;
			var mobile = "";
			var arr_DateBirthday;
			var arr_DateTemp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
			var birthday_temp;

			if (nodeList != null && nodeList.length > 0) {
				for (var i = 0; i < nodeList.length; i++) {
					arrBirthday = nodeList[i].split(',');
					//提醒邮件地址/号码
					mobile = arrBirthday[0];
					if (mobile.substring(0, 2) == "86") {
						mobile = mobile.substring(2);
					}
					result += mobile + ","; //发送彩信用
					successMobiles += mobile + ",";
					//提醒时间
					arr_DateBirthday = arrBirthday[1].split("-");
					//如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
					if (parseInt(arr_DateBirthday[1], 10) == 1 && parseInt(arr_DateBirthday[2], 10) < 11 && parseInt(arr_DateTemp[1], 10) == 12) {
						successMobiles += (parseInt(arr_DateTemp[0], 10) + 1).toString();
					}
					else {
						successMobiles += arr_DateTemp[0];
					}
					successMobiles += "-" + arr_DateBirthday[1] + "-" + arr_DateBirthday[2] + ";";
				}
			}
			top._greetingcard_bn = successMobiles.substr(0, successMobiles.length - 1); //保存已发送祝福时用
			nodeList = null;
		} else {
			var arrEmail = richInput.getRightNumbers();
			if (arrEmail.length > 0) {
				for (var i = 0; i < arrEmail.length; i++) {
					var email = NumberTool.getNumber(arrEmail[i]);
					if (Utils.isChinaMobileNumber(email)) {
						result += email + ",";
					}
				}
			}
		}
		if (result.length > 0) result = result.substr(0, result.length - 1);
		return result;
	},

	//判断页面是否被编辑
	checkUserEdit: function() {
		var tovalue = this.getToMobile();
		if ($.trim(tovalue) != "" && $.trim(tovalue) != PromptMsg) return true;
		if (InitStoreHouseId != CurrentStoreHouseId) return true;
		if ($.trim($("#txtSubject").val()) != InitTitle) return true;
		if ($.trim($("#tbEditor").val()) != InitBlessing) return true;
		if ($.trim(txtValidCode.value) != "" && $.trim(txtValidCode.value) != txtValidCode.defaultValue) return true;
		return false;
	},

	//成功写日志上报
	writeSuccessLog: function(id) {
		var type = 1;
		var receivers = 0;
		$(top._greetingcard_re.split(/[;,；，]/)).each(
				function() {
					if (this != "") receivers++;
				}
	   );

		var dataJson = {
			type: type,
			id: id,
			count: receivers
		},
			dataXml = namedVarToXML("", dataJson, "");

		top.M139.RichMail.API.call(cardConfig.getInterfaceUrl("successBehavior"), dataXml,
			function (data) {
			    //成功处理
			},
			function () {
			    //错误处理
			}
		);
	},

	//懒人贺卡滚动标志
	arrowDown: function() {
		var height = $("#lazycontactList").css("height");
		if (height == "auto") {
			$("#lazycontactList").css("height", "104px");
			$("#iarrowDown").attr("class", "arrowDown");
		}
		else {
			$("#lazycontactList").css("height", "auto");
			$("#iarrowDown").attr("class", "arrowUp");
		}
	},

	//初始化生日页面
	initBirthdayPage: function(sentList){
		$("#tipsLink").hide();
		$("#trBirthday").show();
		$("#trTool").hide();
		$("#trSubject").hide();
		$("#trReceive").hide();
		//生日提醒		
		br = new ListByTemplate({
			"listContainer":"friendList",
			"dataSource":birthdayData,
			"sentNumbers":sentList,
			"explainMsg":"已发送祝福"
		});
		isBirthdayPage = true;
		this.changeGroup(2, "5", "5", 1);
	},

	//刷新验证码图片
	refreshImgRndCode: function(){
		var imagecodeUrl = ImageCode;

		imagecodeUrl = imagecodeUrl.replace("clientid=3", "clientid=2")
			.replace("imagecode0", "imagecode");
		document.getElementById("imgRnd").src = imagecodeUrl + Math.random();
	},

	//检查字数
	checkInputWord: function(){
		var doc = document,
			smsLength = 500, //彩信输入文字最大个数
			tbEditor = doc.getElementById("tbEditor"),
			num = tbEditor.value.length, //输入内容文字个数
			textOther = doc.getElementById("pLetterCount").getElementsByTagName("em")[0];
		
		textOther.innerHTML = (smsLength - num) < 0 ? 0 : (smsLength - num); //显示可输入文字个数
		if(num > smsLength){
			//去掉该汉字
			tbEditor.value = $.trim(tbEditor.value).substring(0, smsLength);
			textOther.innerHTML = 0;
			//对象失去焦点，同时弹出(setTimeout是兼容IE检查超出规定字数粘贴的时候焦点blur不了的bug)
			setTimeout(function() {
			   tbEditor.blur();

				var isOpen = top.FloatingFrame.current && !top.FloatingFrame.current.isDisposed;
				if (!isOpen) {
					top.FloatingFrame.alert(ShowMsg.SMSLength.replace("{0}", smsLength));
				}
			}, 0);
		}
	},

	//验证输入数据
	validate: function() {
		var doc = document, 
			tbEditor = doc.getElementById("tbEditor"),
			validCode = doc.getElementById("trControlValidCodeShow"),
			txtValidCode = doc.getElementById("txtValidCode"),
			txtCodeValue = txtValidCode.value;

		if (CurrentPathUrl.length == 0) {
			top.FloatingFrame.alert(ShowMsg.NoCard);
			return false;
		}
		if (tbEditor.value.length > 500) {
			top.FloatingFrame.alert(ShowMsg.MaxSMSText, function() { tbEditor.focus(); });
			return false;
		}

		if (Utils.queryString("lazy")) {
			var objlist = $("#lazycontactList input:checkbox:checked");
			if (objlist.length == 0) {
				bindMobileTip(ShowMsg.NoRecNumber);
				return false;
			}
			if (objlist.length > MaxReceiverMobile) {
				bindMobileTip(ShowMsg.LazyMaxRecNum);
				return false;
			}
			var recnumberError = '';
			$(objlist).each(function(i, item) {
				if (!Utils.isChinaMobileNumber(this.value)) {
					recnumberError += this.value + ";";
				}
			});
			if (recnumberError != null && recnumberError != '') {
				bindMobileTip(ShowMsg.WrongRecNumber + recnumberError)
				return false;
			}
		} else if (isBirthdayPage) {
			var nodeList = br.getDataList("input[checked=true]");
			if (nodeList == null || nodeList.length < 1) {
				bindMobileTip(ShowMsg.NoRecBlessNumber);
				nodeList = null;
				return false;
			} else {
				nodeList = null;
			}
		} else {
			if (!richInput.hasItem()) {
				bindMobileTip(ShowMsg.NoRecNumber);
				return false;
			}
			if (!checkMobileData()) {
				bindMobileTip(ShowMsg.WrongRecNumber + checkMobileData.errorAddr);
				return false;
			}
			//计算收件人个数
			var Emails = richInput.getRightNumbers();
			if (Emails.length > MaxReceiverMobile) {
				bindMobileTip(ShowMsg.MaxRecNumber.replace("{0}", MaxReceiverMobile));
				return false;
			}
		}
		if (validCode.style.display != "none") {
			if ($.trim(txtCodeValue) == "" || txtCodeValue == txtValidCode.defaultValue) {
				var validTipTools = new this.TipTools({
					FT: $('.codearea').parent(),
					objErr: $("#txtValidCode"),
					msg: ShowMsg.NoCode
				});
				validTipTools.init();
				return false;
			}
		}
		return true;

		function bindMobileTip(msg){
			var mobileTipTools = new GCard.TipTools({
				FT: $('#txtTo'),
				objErr: $("#RichInputBoxID"),
				objFocus: $("#RichInputBoxID input"),
				msg: msg
			})
			mobileTipTools.init();
			window.scrollTo(0, 0);
		}
	},
	/**
	 * 校验提示工具
	 * @param {Object} o 包含参数如下
	 *				{Object} FT 绑定弹出层的容器
	 *				{Object} obj 校验内容容器
	 *				{String} msg 提示语
	 */
	TipTools: function(o){
		var This = this;
		this.FT = o.FT;
		this.objErr = o.objErr;
		this.objFocus = o.objFocus || this.objErr;
		this.msg = o.msg;
		this.FTErr = new floatTips(this.FT);
		this.stopAnimate = function(){
			this.FTErr.fadeOut(200);
			if(this.FTErr.timeOut){
				this.FTErr.fadeOut(200);
				clearTimeout(this.FTErr.timeOut);
			}
			$(this).unbind('focus');
		};
		this.init = function(){
			this.FTErr.tips(this.msg);
			RichInputBox.Tool.blinkBox(this.objErr, 'comErroTxt');
			this.objFocus.bind('focus', function(){
				This.stopAnimate();
			});
		};
	},
	//返回到邮件贺卡页面
	changeSendMail: function() {
		var url = "card_sendcard.html?isBack=1&isLog=1";
		if (Utils.queryString("lazy")) {
			url += "&lazy=" + Utils.queryString("lazy");
		}
		if(Utils.queryString("singleBirthDay")){
			url += "&singleBirthDay=" + Utils.queryString("singleBirthDay")+"&birthday="+Utils.queryString("birthday");
		}
		location.href = url;
		return false;
	},

	//切换经典短信和贺卡标签
	changeTab: function(obj, type) {
		$(".as-nav li").removeClass("current");
		$(obj).addClass("current");
		if (type == 0) {//贺卡
			$("#divMessage").hide();
			$("#divHCard").show();
		} else {
			$("#divMessage").show();
			$("#divHCard").hide();
			GCard.loadSmsClass();
		}
		return false;
	},

	/*
	 * 将数组或对象中首字母大写的键改成小写
	 * @param {Array || Object} param 必填: 为数组或者json对象
	 */
	toLowers: function(param){
		var delKeys = []; //定义数组，存储要删除的大写键
		var len = param.length || 1;

		for(var i = 0; i < len; i++){
			var obj = param[i] || param;
			
			for(var key in obj){
				//将大写键存储在delKeys数组中
				if((/[A-W]/).test(key.substr(0, 1))){
					delKeys.push(key);
				}
				
				var newKey = key.substr(0, 1).toLowerCase() + key.substring(1); //大写键转小写
				obj[newKey] = obj[key];
			}
			
			//清除大写键
			for(var j = 0, l = delKeys.length; j < l; j++){
				delete obj[delKeys[j]];
			}

			obj = null;
			delKeys = [];
		}
	},
	
	is20Version: function(){
		return top.$User.getServiceItem() == top.$User.getVipStr("20");
	},

	getMaxDayMonthSend: function (str) {
		if (str == "") return;

		var dayMatch = str.match(/每天限发(\d*)/),
			monthMatch = str.match(/每月限发(\d*)/);

		dayMatch && (this.maxDaySend = dayMatch[1]);
		monthMatch && (this.maxMonthSend = monthMatch[1]);
	},

	/**
	 * @param {Boolean} isMonth 必填 true 为月封顶
	 */
	tipMaxDayMonthSend: function (isMonth) {
		var self = this,
			txt = "发送彩信超过{0}封顶上限：{1}条{2}",
			txt1 = "，升级邮箱可提高每{0}发送上限。",
			day = "日",
			month = "月";

		if (isMonth) {
			txt1 = txt1.format(month);
			txt = txt.format(month, this.maxMonthSend, this.is20Version() ? "" : txt1);
		} else {
			txt1 = txt1.format(day);
			txt = txt.format(day, this.maxDaySend, this.is20Version() ? "" : txt1);
		}

		top.$Msg.confirm(txt, function(){
			!self.is20Version() && top.$App.showOrderinfo();

			var dialog = top.$Msg.getDialog(window);
			dialog && dialog.close();
		}, function(){
			//
		})
	}
};

//获得收件人邮箱中的手机号码，多个用逗号分割
function GetToMobileList() {
    var arrEmail = richInput.getRightNumbers();
    var result = "";
    if (arrEmail.length > 0) {
        for (var i = 0; i < arrEmail.length; i++) {
            var email = NumberTool.getNumber(arrEmail[i]);
            if (Utils.isChinaMobileNumber(email)) {
                result += email + ",";
            }
        }
    }
    if (result.length > 0) result = result.substr(0, result.length - 1);
    return result;
}

//检查收件人手机合法性
function checkMobileData() {
    var error = richInput.getErrorText();
    if (error) {
        checkMobileData.errorAddr = error.encode();
        return false; ;
    }
    return true;
}

//供父级调用，确定是否关闭
function onModuleClose() {
    if (GCard.checkUserEdit()) {
        return confirm(ShowMsg.NoSendCard);
    }
    return true;
}

//通讯录 start
function AddrCallback(addr) {
    var isAdd = 0;

	if (!Utils.queryString("lazy")) {
		richInput.insertItem(addr);
		return;
	}

	var match = addr.match(/(.+)<(.+)>/);
	var name = match[1].replace(/\"/g, "");
	var email = match[2];
	$("#lazyErrMsg").css("display", "none");
	if (!Utils.isChinaMobileNumber(email)) {
		$("#spanErrMsg").html(ShowMsg.UnicomNum);
		$("#lazyErrMsg").css("display", "block");
		return;
	}
	//判断是否超过10个       
	var len = $("#lazycontactList input:checkbox:checked").length;
	if (len > MaxReceiverMobile || len == MaxReceiverMobile) {
		$("#spanErrMsg").html(ShowMsg.LazyMaxRecNum);
		$("#lazyErrMsg").css("display", "block");
		return false;
	}
	$("#lazycontactList input:checkbox").each(function(i, item) {
		if (this.value === email) {
			if ($(this).attr("checked") == false) {
				$(this).attr("checked", true);
				isAdd = 2;
			} else {
				isAdd = 1;
			}
			return false;
		} else {
			return;
		}
	});
	if (isAdd == 0) {
		var i = $("#lazycontactList input:checkbox").length;
		var strHtml = String.format('<li  title="{email}">\
				<label for="chk_{index}">\
					<input type="checkbox" name="chk_{index}" value="{email}" onclick="GCard.setLazyRecCount(this);" id="chk_{index}" checked="checked"/>\
				{name}</label>\
			</li>',
			{
				email: email,
				index: i,
				name: Utils.htmlEncode(name)
			});
		$("#lazycontactList").append(strHtml);
		GCard.setLazyRecCount();
	} else if (isAdd == 2) {
		GCard.setLazyRecCount();
	} else {
		$("#spanErrMsg").html(ShowMsg.SameRecNum);
		$("#lazyErrMsg").css("display", "block");
	}
};

(function(Utils){
	Utils.Timer = {
		startTime: {},
		getStartTime: function(){
			this.startTime = new Date;
		},
		getPassTime: function(){
			var passTime = (new Date - this.startTime) / 1000 + "s"; 
			try {
				if (console && console.log) {
					console.log(passTime);
				}
			} catch (ex) {};
		}
	};
})(Utils);