//只用于一次postshenglanr
window.sendFlage = false;

//用户提交短信发送方式:1为发送按钮发送,2为快捷健发送
window.SubmitStype = 1;

var $TextUtils = top.$TextUtils;
//时间
var resultDate = {
	year: 0, month: 0, day: 0, hour: 0, min: 0
}
//编码文本，并且转义单引号

// damn it! 基础方法String.prototype.encode处理了双引号（转换为&quot;）却不处理单引号，导致下面这段代码
// htmlEncode空格转换为&nbsp;，这并非对应那个空格键字符，导致后台识别不了，替换成了'?'，因此暂无更好的解决办法。
function escapeMsg( str, noBreak ){
	//var result = $TextUtils.htmlEncode( str );
	//return result.replace(/\'/g,"&acute;").replace(/\"/g,"&quot;");
	str = str.replace(/'/g,"\\'").replace(/"/g, '&#34;').replace(/&quot;/g, '&#34;');
	if(!noBreak) {
		str = str.replace(/\n/g, '\\n');
	}
	return str;
}

//将字符转化成时间格式
function DataParse(s) {
	var dateRex = /\b[1-2][0-9][0-9][0-9][-]\d{1,2}[-]\d{1,2}\b/;
	if (dateRex.test(s)) {
		var dateStr = s.match(dateRex)[0];
		try {
			var dateParts = dateStr.split("-");
			var year = dateParts[0] - 0;
			var month = dateParts[1] - 1;
			var day = dateParts[2] - 0;
			resultDate.year = year;
			resultDate.month = month;
			resultDate.day = day;
		}
		catch (ex) {
			return null;
		}
		var timeRex = /\b\d{1,2}[:]\d{1,2}\b/;
		if (timeRex.test(s)) {
			var timeStr = s.match(timeRex)[0];

			try {
				var timeParts = timeStr.split(":");
				var hour = timeParts[0] - 0;
				var min = timeParts[1] - 0;
				resultDate.hour = hour;
				resultDate.min = min;
			}
			catch (ex) {
			}
		}
	}
	else {
		return null;
	}
	return resultDate;
}
//添加Oss里运营所需的栏目
var arrOss = new Array();
//短信页面的当前页数用于翻页和下一页，上一页
var smsCurrentPage = 0;
//短信静态页节日状态
var smslistState = 0;
//短信锁的状态分别为加密码，短信类别ID，短信条数
var smsState = { smsDecrypt: 0, smsClassID: 0, smsCount: 0, actionInfo: 0, listType: "" };
//短信分类的html存储
var smsClassHtml = "";
//短信条数
var mobiles = "";
//标准标发短信superman.js
var SMSMessage =
{
	SmsServices: "/mw2/sms/sms",
	SetEmptyPasswordformValid: "密码不能为空",
	SetValidatePasswordLengthformValid: "请输入6位至16位字符或数字组成的密码",
	SetValidateNumformValid: "密码不能是纯数字组合",
	SetValidateFormatformValid: "密码中包含不合法字符，可支持字母、数字、及_~@#$^符号",
	SetValidateCharformValid: "密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA ",
	CreateClassNameformValid: "请输入分类名称! ",
	ClassNameExtError: "分类名称重复! ",
	DelClassNamePrompt: "删除后，分类中的短信记录不可恢复，确定删除吗？",
	LookupKeyError: " 请输入查询关键字!",
	ConfirmTreaError: "请选择要珍藏的短信!",
	DelMsmMessagePrompt: "你要删除所选择的短信记录吗?",
	DelMsmPrompt: "请选择要删除的短信!",
	DelMsmReMessageSuccess: "记录已被删除!",
	MsmRemovePrompt: "请选择要转移的短信!",
	MsmSaveTreasureSuccess: "短信已存到珍藏记录的[{0}]",
	MsmRemoveTypeSuccess: "选中的记录已移动到[{0}]",
	RecordDelSuccess: "记录已被删除!",
	DelLiverNumPrompt: "确定要撤销已设置的情侣号码吗？",
	BrowserSysError: "您使用的浏览器不支持复制功能，建议您尝试其他浏览器。",
	SendMsmCharLenformValid: "您最多只能输入{0}个字！",
	LoadDataMessage: "数据加载中…",
	SmsSignatureformValid: "签名名称和内容都不能为空！",
	SmsSignatureTitleValid: "每个签名标题不要超过32个字！",
	SmsSignatureLenformValid: "每个签名内容不要超过30个字！",
	SmsIdiographExist: "该签名标题已存在！",
	SmsSignatureLenSuccess: "保存成功",
	DelSmsSignatureSuccess: "删除成功",
	SmsSendPrompt: "可同时发给{0}人,以逗号“,”隔开,支持向全国移动用户发送",
	SmsSendMobilePromptError: "{0}不是中国移动手机号码！请检查输入！",
	SmsSendMobileNumberformValid: "很抱歉，您每次最多可同时发送{0}个号码，请您删除多余号码再试！",
	SmsSendInfoLenformValid: "温馨提示：请输入短信内容",
	SmsSelClassIDformValid: "温馨提示：请先选择分类",
	SmsTitlePrompt: "跳转中...",
	SmsLoadDataPrompt: "数据加载中...",
	SmsMobileQueryformError: "很抱歉，不支持非移动手机号码查询",
	SmsGetSendMsgError: "获取经典短信分类失败",
	SmsMobileFormatError: "请输入手机号码, 号码间以“,”分割",
	//SmsSendMsgLenfromValid:"短信内容不能为空",
	SmsSendMsgLenfromValid: "请填写短信内容",
	SmsSendUserLenfromValid: "很抱歉，您每次最多可同时发送{0}个号码，请您删除多余号码再试！",
	SmsSysTitlePrompt: "系统提示",
	SmsShareMessageError: "热门分享短信已被修改，修改后将不被记为投票",
	SmsNamefromValid: "请输入昵称",
	SmsInvitationSuccess: "短信邀请支持已发送",
	SmsMailInvitationSuccess: "邮件邀请支持已发送",
	SmsSendMsgError: "发送失败",
	SmsCopyInfoSuccess: "复制成功，请粘贴发送",
	SmsArgsError: "缺少参数",
	SmsCloseTa: "确定不发送此短信吗？现在离开已编辑短信内容不会被保存！",
	SmsLiveDelMessage: "请确认要删除的情侣短信！",
	SmsValidatePassword: "密码不正确请重新输入",
	SetValidateToLongMsg: "密码必须为6-30位",
	SetIdiographSuccess: "默认签名设置成功",
	SmsSendMsgUnknowError: "网络异常，请稍后再试",
	GreateThenFreeLimit: "超过每天允许发送的最大条数",
	Free6OnlyChinaMobile: "发送免费短信，接收人只能为移动用户，请重新选择！",
	PriceTips: "有{0}位联通或电信用户，每条与本地资费相同，不计入赠送条数",
	PriceTips1: "有{0}位联通或电信用户，每条与本地资费相同",
	GetValidateCode: "请点击获取验证码"/*,
	MoneyTipOpen: "已开启计费提醒 | 关闭",
	MoneyTipClose: "已关闭计费提醒 | 开启",
	MoneyTipOpenDesc: "您已经开启了计费提醒，免费赠送的短信发完后，即会提醒您。",
	MoneyTipCloseDesc: "您已经关闭了计费提醒，免费赠送发完后，不会提醒您。"*/
};

var PostXML =
{
	GetMainData_Xml: "\
<object>\
<int name=\"serialId\">{0}</int>\
<int name=\"dataType\">{1}</int>\
</object>",
	Send_Xml: "\
<object>\
<int name=\"doubleMsg\">{0}</int>\
<int name=\"submitType\">{1}</int>\
<string name=\"smsContent\">{2}</string>\
<string name=\"receiverNumber\">{3}</string>\
<string name=\"comeFrom\">{4}</string>\
<int name=\"sendType\">{5}</int>\
<int name=\"smsType\">{6}</int>\
<int name=\"serialId\">{7}</int>\
<int name=\"isShareSms\">{8}</int>\
<string name=\"sendTime\">{9}</string>\
<string name=\"validImg\">{10}</string>\
<int name=\"groupLength\">{11}</int>\
<int name=\"isSaveRecord\">{12}</int>\
</object>",
	Success_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<int name=\"pageSize\">{1}</int>\
<string name=\"mobiles\">{2}</string>\
</object>",
	UserRedict_Xml: "<null />",
	SaveBox_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<string name=\"smsIds\">{1}</string>\
<string name=\"sourceType\">{2}</string>\
<int name=\"searchDateType\">{3}</int>\
<string name=\"keyWord\">{4}</string>\
<int name=\"pageSize\">{5}</int>\
<int name=\"pageIndex\">{6}</int>\
<int name=\"destId\">{7}</int>\
<string name=\"content\">{8}</string>\
<int name=\"saveType\">{9}</int>\
<int name=\"classId\">{10}</int>\
<string name=\"className\">{11}</string>\
</object>",
	SmsSended_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<int name=\"currentIndex\">{1}</int>\
<int name=\"phoneNum\">{2}</int>\
<string name=\"deleSmsIds\">{3}</string>\
<string name=\"keyWord\">{4}</string>\
<string name=\"mobile\">{5}</string>\
<int name=\"pageSize\">{6}</int>\
<int name=\"pageIndex\">{7}</int>\
<int name=\"searchDateType\">{8}</int>\
</object>",
	SmsTiming_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<string name=\"deleSmsIds\">{1}</string>\
<string name=\"keyWord\">{2}</string>\
<string name=\"mobile\">{3}</string>\
<int name=\"pageIndex\">{4}</int>\
<int name=\"pageSize\">{5}</int>\
<int name=\"searchDateType\">{6}</int>\
</object>",
	LoveRoom_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<string name=\"deleSmsIds\">{1}</string>\
<string name=\"keyWord\">{2}</string>\
<int name=\"sex\">{3}</int>\
<string name=\"loveMobile\">{4}</string>\
<int name=\"pageIndex\">{5}</int>\
<int name=\"pageSize\">{6}</int>\
<int name=\"searchDateType\">{7}</int>\
<int name=\"searchType\">{8}</int>\
</object>",
	Config_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<int name=\"isSave\">{1}</int>\
<string name=\"npwd\">{2}</string>\
<string name=\"opwd\">{3}</string>\
</object>",
	SetIdiograph_Xml: "\
<object>\
<int name=\"actionId\">{0}</int>\
<int name=\"idiographId\">{1}</int>\
<string name=\"idiographName\">{2}</string>\
<string name=\"idiographContent\">{3}</string>\
</object>"
}

//显示短信记录已加锁标志
function ShowLock(isSetPwd) {
	if (isSetPwd == 1)
	{ $("#lock").show(); }
	else
	{ $("#lock").hide(); }
}

//标签页处理shenglan
function onModuleClose() {

	if (window.document.getElementById("txtContent")) {
		if ($("#txtContent").val().length > 0) {
			if (window.confirm(SMSMessage["SmsCloseTa"]))
				return true;
			else {
				top.MM.modules['sms'].close = false;

				return false;
			}
		}
	}
}

/**
* @fileOverview 定时发短信视图层.
*/

/*
(function (jQuery, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Sms.Timing.View', superClass.extend(
	...// 引起跨页面脚本变量引用的bug，未查明。
	);
*/

var $ = jQuery, M139 = top.M139;

// fix: 老版jQuery与新版backbone不搭配的问题 (xiaoyu)

if(jQuery.fn.on == undefined) {
	jQuery.fn.extend({
		on: function(){
		   this.bind.apply(this, arguments);
		},
		off: function(){
		   this.unbind.apply(this, arguments);
		}
	});
}

var TimingView = top.Backbone.View.extend({
	el: "body",
	template : ['',
		,'<div class="pl_20 pt_10">'
			,'<p class="pl_20 pb_10">请选择定时发送的时间：</p>'
			,'<div class="pl_20 clearfix">'
				,'<div class="dropDown dropDown-ydm" id="txtCalendar">'
					,'<div class="dropDownText fl">2013-07-24</div>'
					,'<a hidefocus="1" href="javascript:void(0)" class="i_ymd fl"></a>'
				,'</div>'
				,'<div class="dropDown dropDown-month" id="hourMenu">'
					,'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>'
					,'<div class="dropDownText" id="hourText">09</div>'
				,'</div>'
				,'<div class="ydmtext">时</div>'
					,'<div class="dropDown dropDown-month" id="miniuteMenu">'
						,'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>'
						,'<div class="dropDownText" id="miniuteText">56</div>'
					,'</div>'
				,'<div class="ydmtext">分</div>'
			,'</div>'
			,'<p id="dlgTipTime" class="pl_20 pb_10 mt_10">本短信将在 <strong class="c_ff6600"><span id="dateTip">2013-07-24</span><span id="timeTip"> 13:40</span></strong> 发送</p>'
			,'<p id="dlgNoteTip" class="pl_20 pb_10 mt_10" style="display:none;"><b>小提示：</b>定时短信时间最大支持到 <span style="color:navy">明年12月31日</span> 噢</p>'
		,'</div>'].join(""),
	name : "timing",
	initialize: function (options) {
		var self = this;
		this.$el = jQuery(this.template);
		this.el = this.$el[0];	// 曲线救国
		this.isScheduleDate = false;

		if(options && options.scheduleDate){
			this.scheduleDate = options.scheduleDate;
		}
	},
	// 渲染定时器控件 
	render : function(cb){
		this.callback = cb;
		this.isScheduleDate = true;
		this.show();
		this.createTimer();
		this.createCalander();
		this.initializeDate();
	},
	// 弹窗显示定时器弹出层 
	show : function(){
		var self = this;
		var dialog = top.$Msg.showHTML(this.template, function(e){
			//console.log(self.$(".YesButton").attr("disabled"));
			if(self.$(".YesButton").attr("disabled") == "disabled"){
				e.cancel = true;
				return ;
			} else {
				e.cancel = false;
			}
			self.isOK = true;
			self.callback();
		},function(){
			self.isScheduleDate = false;
		},{
			dialogTitle:'定时发送',
			buttons:['定时发送','取消']
		});

		dialog.onClose = function(){	// 无论点击哪个按钮都会触发
			self.isScheduleDate = self.isOK ? true : false;
		   // console.log(self.isScheduleDate, self.isOK);
		   self.hourMenu && self.hourMenu.remove();
		   self.miniuteMenu && self.miniuteMenu.remove();
		}
		self.setElement(dialog.el);
	},
	// 创建日历组件
	createCalander : function(){
		var self = this;
		var calendarPicker = this.calendarPicker = top.M2012.UI.Picker.Calendar.create({
			bindInput: self.$("#txtCalendar")[0],
			value: new Date(),
			stopPassDate: true
		});
		var jCalenderText = self.$("#txtCalendar > div:eq(0)");
		calendarPicker.on("select", function (e) {
			var calendar = e.value.format("yyyy-MM-dd");
			if(e.value.getFullYear()-(new Date()).getFullYear() > 1){
				self.$("#dlgTipTime").hide();
				self.$("#dlgNoteTip").show();
				self.$(".YesButton").attr("disabled", "disabled");
			} else {
				self.$("#dlgTipTime").show();
				self.$("#dlgNoteTip").hide();
				self.$("#dateTip").html(calendar + ' ');
				self.$(".YesButton").removeAttr("disabled");
			}
			jCalenderText.html(calendar);
		});
	},
	// 创建时间选择组件
	createTimer : function(){
		var self = this;
		var hourItems = self._getMenuItems(0, 23, 'hourText');
		top.M2012.UI.PopMenu.createWhenClick({
			target : self.$('#hourMenu')[0],
			width : 70,
			maxHeight : 170,
			items : hourItems,
			top : "200px",
			left : "200px",
			onItemClick : function(item){
				var time = self.$("#hourText").html()+ ':' + self.$("#miniuteText").html();
				self.$("#timeTip").html(time);
			}
		}, function(menu){
			self.hourMenu = $(menu.el);		// 曲线救国...
		});

		var miniuteItems = self._getMenuItems(0, 59, 'miniuteText');
		top.M2012.UI.PopMenu.createWhenClick({
			target : self.$("#miniuteMenu")[0],
			width : 70,
			maxHeight : 170,
			items : miniuteItems,
			top : "200px",
			left : "200px",
			onItemClick : function(item){
				var time = self.$("#hourText").html()+ ':' + self.$("#miniuteText").html();
				self.$("#timeTip").html(time);
			}
		}, function(menu){
			self.miniuteMenu = $(menu.el);		// 曲线救国...
		});
	},
	//得到设置的时间 
	_getDefiniteTime : function() {
		if (this.isScheduleDate) {
			var date = this.$("#txtCalendar > div:eq(0)").html();
			var time = this.$("#hourText").html()+ ':' + this.$("#miniuteText").html();
			return date + ' ' + time + ':00';
		} else {
			return 0;
		}
	},

	// 获得时/分菜单项
	_getMenuItems : function(begin, end, id){
		var self = this;
		var items = [];
		for(var i = begin;i <= end;i++){
			var text = '';
			if(i < 10){
				text = '0' + i;
			}else{
				text = i + '';
			}
			var item = {
				text : text,
				onClick : function() {
					self.$("#"+id).html(this.text);
					self.targetText = this.text;
					// todo 第二个popMenu从dom移除后，会将第一个popMenu的bindautohide属性置为'0'，导致第一个popMenu不响应全局单击事件
					// $("div.sTipsSetTime").attr('bindautohide', '1');
				}
			}
			items.push(item);
		}
		return items;
	},
	// 初始化定时时间
	initializeDate : function(){
		var self = this;
		// 初始化时间
		var now = self.scheduleDate;
		if(now){
			now = (typeof now === 'string') ? M139.Date.parse(now) : new Date(now * 1000);
		} else {
			now = new Date((new Date()).getTime() + 60 * 60 * 1000);	// 默认+1小时
		}

		var date = M139.Date.format("yyyy-MM-dd", now);
		var time = getFullTime(now.getHours())+ ':' + getFullTime(now.getMinutes());
		self.$("#txtCalendar > div:eq(0)").html(date);
		self.$("#hourText").html(getFullTime(now.getHours()));
		self.$("#miniuteText").html(getFullTime(now.getMinutes()));
		// 初始化提示语
		self.$("#dateTip").html(date+' ');
		self.$("#timeTip").html(time);

		function getFullTime(time){
			return time >= 10?time:('0'+time);
		}
	}
});


var ImportContactView = top.Backbone.View.extend({
	template : {
		fullfilled: ['<div class="mssok" style="padding:25px;">',
			'<p>导入完成，已成功导入 <strong class="c_009900">{0}</strong>',
			'个联系人<span>， <strong class="red">{1}</strong>',
			'条数据导入失败，请检查数据格式</span>。</p>',
			'<p class="mt_15">',
				'<span><a class="info_detail" href="javascript:void(0)">查看导入失败的数据</a></span>',
			'</p>',
			'<div class="msslostlist" style="display:none;max-height: 150px;_height:150px;overflow-x: hidden;overflow-y: auto;border:1px solid #D4D4D4;padding:5px;margin-top: 15px;">',
				'<ul style="line-height: 22px;"></ul>',
			'</div>',
		'</div>'].join("\r\n"),

		failedExcel: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
			'<dl class="norTipsContent">',
			'<dt class="norTipsLine">',
				'导入失败。您可以将 excel文件转换成 <span class="c_009900">txt格式或csv格式</span> 后，再次尝试。',
			'</dt>',
			'</dl>',
		'</div>'].join("\r\n"),

		failedCSV: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<dl class="norTipsContent">',
				'<dt class="norTipsLine">导入失败，请参考以下图例检查数据格式。</dt>',
				'<dd class="mt_5">',
					'<img src="/m2012/images/global/mssi1.jpg" width="286" height="73" />',
					/*'<p class="red mt_10">请用“，”号分隔姓名与手机号码。</p>',*/
				'</dd>',
				'</dl>',
			'</div>'].join("\r\n"),

		failedTxt: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<dl class="norTipsContent">',
				'<dt class="norTipsLine">导入失败，请参考以下图例检查数据格式。</dt>',
				'<dd class="mt_5">',
					'<img src="/m2012/images/global/mssi2.jpg" width="286" height="90" />',
					/*'<p class="red mt_10">请将姓名与手机号分两列排列。</p>',*/
				'</dd>',
				'</dl>',
			'</div>'].join("\r\n"),
		failedFormat: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<p>请选择 <strong class="c_009900">.txt, .csv, .xls, .xlsx</strong> 格式的文件。</p>',
			'</div>'].join("\r\n"),

		failedContent: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<p>解析错误，请检查文件内容格式是否正确，然后重试。</p>',
			'</div>'].join("\r\n"),

		waiting: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<p>网络不给力，正在上传上个文件，请稍候...</p>',
			'</div>'].join("\r\n"),

		batchImport: '<iframe id="iSmsImport" src="/m2012/html/sms/sms_import_contact.html" style="height:490px;width:100%;border:none;padding:0;"></iframe>',

		pluginWarn: ['<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
				'<p>:( Flash插件不可用，请尝试刷新、安装flash插件，或使用其他浏览器再试。</p>',
			'</div>'].join("\r\n")
	},

	isImporting : false, 	// 是否正在导入中

	initialize: function (options) {
	},

	checkFlash: function () {

		var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
		var hasFlash = true;

		if(isIE) {
			try{
				var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch(e) {
				hasFlash = false;
			}
		} else {
			//navigator.mimeTypes["application/x-shockwave-flash"];
			//if(flashEnabled) flashEnabled = flashEnabled.enabledPlugin;
			if(!navigator.plugins["Shockwave Flash"]) {
				hasFlash = false;
			}
		}
		return hasFlash;
	},

	render : function(cb){
		var flashEnabled = this.checkFlash();

		var template = flashEnabled ? this.template.batchImport : this.template.pluginWarn;

		var dialog = top.$Msg.showHTML(template, function(e){
		},function(){
		},{
			dialogTitle: flashEnabled ? '批量导入联系人' : '系统提示',
			buttons: flashEnabled ? [] : ['确定']
		});

		if(flashEnabled) dialog.el.style.width = "504px";

		dialog.onClose = function(){
		}

		this.dialog = dialog;
		this.setElement(dialog.el);
		return this;
	},

/*
	filterFiles: function (jsonFileList) {
		var file = jsonFileList[0];
		var maxLength = 1024 * 1024 * 5;
		if(file.fileSize > maxLength) {
			return [];
		}
		return jsonFileList;
	}
*/

	addContacts: function(list){
		if(!list || !list.length) return ;
		var item;

		for(var i=0, l=list.length; i<l; i++){
			item = list[i];
			window.mobilecontrol.insertItem('"'+item.recvName+'"<'+item.recvNumber+'>');
		}
	},

	showSuccessDlg : function(data){
		this.addContacts(data.table);
		var html = String.format(this.template.fullfilled, data.totalCount, data.failureCount);
		var dialog = top.$Msg.showHTML(html, function(e){
		},function(){
		},{
			dialogTitle:'导入完成',
			buttons:['确定']
		});

		this.setElement(dialog.el);
		if(data.failureTable.length > 0) {
			this.showFailureList(data.failureTable);
		} else {
			this.$("p span").hide();
		}
	},

	showFailureList: function(data){
		var lostList = this.$(".msslostlist");
		var list = [];

		for(var i=0,len=data.length; i<len; i++){
			if(data[i].failureData) {
				list.push(top.encodeXML(data[i].failureData));
			}
		}

		if(list.length > 0){
			lostList.children("ul").html("<li>" + list.join("</li>\r\n<li>") + "</li>");

			this.$(".info_detail").on("click", function(e){
				if(lostList.css("display") === "none"){
					lostList.show();
					this.innerHTML = "隐藏导入失败的数据";
				} else {
					lostList.hide();
					this.innerHTML = "查看导入失败的数据";
				}
			});
		} else {
			this.$("p span").hide();
		}
	},

	showWaitingDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.waiting, function(e){
		},{
			dialogTitle:'消息提示',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	},

	showFailFormatDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.failedFormat, function(e){
		},{
			dialogTitle:'错误提示',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	},

	showFailContentDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.failedContent, function(e){
		},{
			dialogTitle:'错误提示',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	},

	showFailExcelDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.failedExcel, function(e){
		},{
			dialogTitle:'导入失败',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	},

	showFailTxtDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.failedTxt, function(e){
		},{
			dialogTitle:'导入失败',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	},

	showFailCSVDlg: function(){
		var dialog = top.$Msg.showHTML(this.template.failedCSV, function(e){
		},{
			dialogTitle:'导入失败',
			buttons:['确定']
		});

		this.setElement(dialog.el);
	}
});










var Common = {
	//日封顶
	maxDaySend: 1000,
	maxMonthSend: 10000,

	pageIndex: 1,//当前页数
	pageCount: 1,//页面总数
	records: 1,//页面数据个数

	// 冗余！
	regex: (top.SiteConfig && top.SiteConfig.SMSOpenRelease) ? top.UserData.regex : "^86(134|135|136|137|138|139|147|150|151|152|157|158|159|176|177|178|182|183|187|188|130|131|132|155|156|185|186|145|133|153|180|189|184|181)\\d{8}$",
	postXml: function(config, jq) {
		if (!config) {
			return;
		}
		config["startDate"] = new Date();
		var errors = config["error"] || Common.handleError;
		var async = typeof config["async"] == "undefined" ? true : config["async"];
		var ajaxParam = {
			type: "POST",
			contentType: "application/xml;charset=utf-8",
			async: async,
			url: config["url"],
			data: config["data"],
			timeout: 15000,
			complete: config["complete"],
			success: function(result) {
				if (async == true) {
					processData(result);
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				errors(xhr, textStatus, errorThrown, config);
			}
		};
		var query = (jq || jQuery);
		if (async == false) {
			var response = query.ajax(ajaxParam).responseText;
			processData(response);
		} else {
			query.ajax(ajaxParam);
		}

		//处理获取的数据
		function processData(result) {
			try {
				result = eval("(" + result + ")");
			} catch (ex) {
				result = null;
			}
			config["success"].apply(result, arguments);
		}
	},
	//ajax请求错误一般处理
	handleError: function (xhr, textStatus, errorThrown, config) {
		/*
		var logs = [];
		var endDate = new Date();
		logs.push("Sms_HttpRequest_Error：");
		try {
			logs.push("statusText=" + xhr.statusText);
			logs.push("status=" + xhr.status);
		} catch (e) { };
		logs.push("textStatus=" + textStatus);
		logs.push("errorThrown=" + errorThrown);
		logs.push("readyState=" + xhr.readyState);
		logs.push("startDate=" + config["startDate"].format("yyyyMMddhhmmss"));
		logs.push("endDate=" + endDate.format("yyyyMMddhhmmss"));
		logs.push("time=" + (endDate - config["startDate"]));
		logs.push("url=" + config["url"]);
		logs.push("data=" + config["data"]);
		try {
			//top.ScriptErrorLog.sendLog(logs.join("|"));
		} catch (ex) { }
		*/
		top.FF.alert(SMSMessage.SmsSendMsgUnknowError);
	},
	getQueryString: function(param) {
		var returnVal = null;
		var url = window.location.href;
		var index = url.indexOf("?");
		if (index != -1) {
			var str = url.substring(index + 1);
			var dex = str.indexOf(param);
			if (dex != -1) {
				var length = param.length;
				str = str.substring(dex + length);
				if (str != "") {
					if (str.substring(0, 1) == "=") {
						if (str.indexOf("&") != -1) {
							returnVal = str.substring(1, str.indexOf("&"));
						}
						else {
							returnVal = str.substring(1);
						}
					}
				}
			}
		}
		return returnVal;
	},
	openCalendar: function() {
		top.Links.show('calendar', "&from=superman", false);
	},

	getFullTime: function (time) {
		var matchValue = time.match(/(.*)(:[^:]*)$/);

		return matchValue ? matchValue[1] : "";
	},
	pwRegular: function(value) {
		var returnValue = true;
		var msg = "";
		if (value == "") {
			msg = SMSMessage["SetEmptyPasswordformValid"]; //"密码不允为空";
			returnValue = false;

			return [returnValue, msg];
		}
		if (value.length < 6) {
			msg = SMSMessage["SetValidatePasswordLengthformValid"]; //"请输入6位至16位字符或数字组成的密码";
			returnValue = false;

			return [returnValue, msg];
		}
		//深蓝
		if (value.length > 30) {
			msg = SMSMessage["SetValidateToLongMsg"]; //"请输入6位至30位字符或数字组成的密码";
			returnValue = false;

			return [returnValue, msg];
		}
		var chars = value.split('');
		if (!value.replace(/\d/g, '')) {
			msg = SMSMessage["SetValidateNumformValid"]; //"密码不能是纯数字组合";	

			returnValue = false;
			return [returnValue, msg];
		}
		if (value.replace(/[A-Za-z0-9_~@#$\^]/g, '') != "") {
			msg = SMSMessage["SetValidateFormatformValid"]; //"密码中包含不合法字符，可支持字母、数字、及_~@#$^符号";	

			returnValue = false;
			return [returnValue, msg];
		}
		var chEqual = true;
		var reg;
		if (chars[0] == '^') {
			reg = new RegExp('[\\' + chars[0] + ']', 'g')
		}
		else {
			reg = new RegExp('[' + chars[0] + ']', 'g')
		}
		if (value.replace(reg, '') == '') {
			msg = SMSMessage["SetValidateCharformValid"]; //"密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA";
			returnValue = false;
			return [returnValue, msg];
		}
		var arUC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		var arLC = 'abcdefghijklmnopqrstuvwxyz'
		var arUCR = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
		var arLCR = "zyxwvutsrqponmlkjihgfedcba";
		var arUN = new Array();
		var arLN = new Array();
		if (arUC.indexOf(value) >= 0 || arLC.indexOf(value) >= 0 || arUCR.indexOf(value) >= 0 || arLCR.indexOf(value) >= 0) {
			msg = SMSMessage["SetValidateCharformValid"]; //"密码不能是字符串联，如aaaaaa、ABCDEF、FEDCBA";
			returnValue = false;
			return [returnValue, msg];
		}
		return [returnValue, msg];
	},
	//短信记录发送
	recoreOpen: function(url, serialid, smsContent, more) {
		top.SmsContent = smsContent;
		var loc = String.format("/m2012/html/sms/{0}?sid={1}&serialid={2}&from=3&rnd={3}", url, window.top.UserData.ssoSid, serialid, Math.random());
		if(more) loc += more;
		window.location = loc;
	},

	//获取用户名-编码
	getUserName: function(usernumber) {
		var addrobj = top.Contacts.getSingleContactsByMobile(usernumber, true);
		if (addrobj != undefined && addrobj) {
			if (addrobj.name.length > 0) {
				return addrobj.name.encode();
			}
		}
		return usernumber.encode();
	},
	//获取用户名-解码
	getUserNameDecode: function(usernumber) {
		var addrobj = top.Contacts.getSingleContactsByMobile(usernumber, true);
		if (addrobj != undefined && addrobj) {
			if (addrobj.name.length > 0) {
				return addrobj.name;
			}
		}
		return usernumber;
	},
	//组装用户名和手机号码
	getRecName: function(usernumber) {
		var recName = Common.getUserNameDecode(usernumber);
		if (usernumber.length == 13)
			usernumber = usernumber.substring(2, 13);
		return "\"" + recName + "\"" + "<" + usernumber + ">";
	},
	getFormatMobile: function(mobileStr) {
		var arrayList = new Array();
		var regMobile = new RegExp("(<)([\\d|\\+]+)(>)");
		var mobileList = $.trim(mobileStr).split(/,|，|;|；/);
		var mobileCount = mobileList.length;
		for (var i = 0; i < mobileCount; i++) {
			if ($.trim(mobileList[i]).length > 0) {
				var thismobile = $.trim(mobileList[i]);
				if (regMobile.test(thismobile))
					arrayList.push(regMobile.exec(thismobile)[2]);
				else
					arrayList.push(thismobile);
			}
		}
		return arrayList.join(",");
	},
	showError: function(jqueryErrorObj, jqueryCssObj, errorText) {
		jqueryErrorObj.show();
		jqueryErrorObj.find("Strong").html(errorText);
		jqueryCssObj.addClass("show-tooltip");
		setTimeout(function() {
			jqueryErrorObj.fadeOut("slow", function() {
				jqueryCssObj.removeClass("show-tooltip");
			});
		}, 2000);
	},
	getParentWindow: function() {
		return top.$("iframe[id='sms']")[0].contentWindow;
	},
	isEmpty: function(code) {
		if (typeof (code) == "undefined" || code == null || code.length == 0) return true;
		return false;
	},
	getUrlPath: function() {
		var url = window.location.toString();
		if (url && (url.indexOf("?") != -1)) {
			url = url.substring(0, url.indexOf("?"));
		}
		var tmp;
		if (url && url.lastIndexOf("/")) {
			tmp = url.substring(0, url.lastIndexOf("/"));
		}
		return tmp;
	},
	addTitle: function(control) {
		$($($(control)[0].lastChild.firstChild)[0].nextSibling).addClass("on")
	},
	removeTitle: function(control) {
		$($($(control)[0].lastChild.firstChild)[0].nextSibling).removeClass("on");
	},
	editClassInfo: function(control) {

		$(control).parent().find("input").show()
		$(control).parent().find("span").hide();

		if ($(control).text() == "编辑") {

			$("#hiddenClassName").val($(control).parent()[0].title);
			$($(control).parent().find("input")[0]).val($(control).parent()[0].title);
			$(control).text("保存");

			$(".content").unbind("click");
			//shenglan 还要修改的事件
			$(".content").bind("click", function(e) {

				$("#divClassInfoSearch input[type=text]").each(function() {
					$(this).hide();
				});
				$("#divClassInfoSearch span").each(function() {
					$(this).show();
				});
				$(".li-edit").each(function() {
					$(this).text("编辑");
				});

			});

			//shenglan
			$(control).next().text("取消");
		}
		else {
			if ($(control).text() == "保存") {

				//shenglan

				$(control).next().text("删除");


				var classid = $(control).parent()[0].id;
				var classname = $.trim($($(control).parent().find("input")).val());
				var indexid = $(control).parent().attr("indexid");
				if (Common.isEmpty(classname)) {
					top.FloatingFrame.alert(SMSMessage["CreateClassNameformValid"]); //"请输入分类名称!"
					return;
				}
				var controls = $(control).parent().parent().find("li"); //$($($(control).parent().parent())[0]).find("span");

				if (controls) {
					for (i = 0; i < controls.length; i++) {
						if (controls[i]) {
							if (controls[i].title == classname && indexid != $(controls[i]).attr("indexid"))//&& (classname!=$("#hiddenClassName").val())
							{
								top.FloatingFrame.alert(SMSMessage["ClassNameExtError"]); //"分类名称重复!"
								return;
							}
						}
					}
				}
				var obj = new Marked();
				obj.pageIndex = Common.getCurrentPage();
				obj.pagesize = Common.getPageSize();
				obj.dateType = Common.getDateType();

				obj.keyword = Common.getKeyWord("savebox");
				var currentClass = $("#divClassInfoSearch").attr("classid");

				//alert(currentClass);
				obj.classid = classid;
				obj.destId = classid;

				// alert(classname);

				obj.editClass(classname, obj);

				//obj.getSms();
			}
		}

	},
	delClassInfo: function(control) {
		if ($.trim($(control).text()) == "取消") {
			$($(control).parent().find("input")[0]).hide();
			$(control).parent().find("span").show();
			$(control).prev().text("编辑");
		}
		else {
			//删除后，分类中的短信记录不可恢复。确定要删除该分类吗?"
			top.FloatingFrame.confirm(SMSMessage["DelClassNamePrompt"], function() {
				var classid = $(control).parent()[0].id;
				var obj = new Marked();
				obj.pageIndex = Common.getCurrentPage();
				obj.pagesize = Common.getPageSize();
				obj.dateType = Common.getDateType();
				obj.keyword = Common.getKeyWord("savebox");
				obj.classid = classid;
				obj.destId = classid;
				obj.delClass();
			});
		}
	},
	//检查通过SID获取用户信息为空处理
	errManage: function(result, type) {
		if (result.code == "S_TIMEOUT") {
			// window.location.href="/Error/systemTip4.html";
			top.Utils.showTimeoutDialog();
			return false;
		}
		return true;
	},

	//如果用户设置密码则调整到解码页
	checkSetting: function(result, type, path) {
		if (result.isSetPwd == 1 && result.isDecrypt == 0) {
			window.location = String.format("/m2012/html/sms/sms_setting.html?isShow=1&path=sms_Record.html&rnd={0}", Math.random());
			return false;
		}
		return true;
	},
	initPage: function(name) {
		BindControlEvent();  //绑定页面事件
		var obj = Common.getObj(name);
		obj.pagesize = Common.getPageSize();
		obj.getSms();
	},
	initCheckBox: function() {
		$("#chkSelectAllUp").attr("checked", false);
		$(".chkSelectAllDown").html("全选");
	},
	//搜索记录
	searchRecord: function(name) {
		var obj = Common.getObj(name);
		obj.pagesize = Common.getPageSize();
		obj.keyword = Common.getKeyWord(name).replace("[", "[[]").replace("_", "[_]").replace("%", "[%]");

		if (name.toLowerCase() == "timing") {
			obj.dateType = Common.getTimeDateType();
		}
		else {
			obj.dateType = Common.getDateType();
		}
		if (name.toLowerCase() == "sended") {
			obj.mobile = Common.getMobile();
		}
		if (name.toLowerCase() == "savebox") {
			obj.classid = Common.getClassInfo();
		}
		obj.getSms();
	},
	searchByDate: function(name) {
		Common.searchRecord(name);
	},
	searchByKeyWord: function(name) {
		//日志上报
		top.addBehaviorExt({
			actionId: 20010,
			thingId: 0,
			moduleId: 14
		});
		var keyWord = Common.getKeyWord(name);
		if (keyWord.length <= 0) {
			top.FloatingFrame.alert(SMSMessage["LookupKeyError"]); //"请输入查询关键字!"
			return false;
		}
		Common.searchRecord(name);
	},
	searchByClass: function(name) {
		Common.searchRecord(name);
	},
	searchBySource: function(name) {
		Common.searchRecord(name);
	},
	searchByMobile: function(name) {
		Common.searchRecord(name);
	},
	//获取当前页
	getCurrentPage: function() {
		var pageindex = $(".pager .countes").text();
		var pageindexArr = pageindex.split("/");
		return pageindexArr[0];
	},
	//获取每页显示条数
	//shenglan modify
	getPageSize: function() {
		var currObj = $(".showpagesize").get(0);
		return Common.getSelectedValue(currObj);
		//return 10;
	},
	//获取搜索日期类型
	getDateType: function() {
		//var dateTypeValue = $("#divDateType dt").text();
		//shenglan
		var dateTypeValue = $.trim($("#dlDateFilter").attr("timeInfo"));

		var dateType = 0;
		if (dateTypeValue.indexOf("时间") != -1 || dateTypeValue.indexOf("所有") != -1) {
			dateType = 0;
		}
		else if (dateTypeValue.indexOf("今天内发送") != -1) {
			dateType = 3;
		}
		else if (dateTypeValue.indexOf("一周内发送") != -1) {
			dateType = 2;
		}
		else if (dateTypeValue.indexOf("一月内发送") != -1) {
			dateType = 1;
		}
		return dateType;
	},
	getTimeDateType: function() {

		var dateTypeValue = $("#dlDateFilter").attr("timeinfo");
		var dateType = 0;
		if (dateTypeValue.indexOf("时间") != -1 || dateTypeValue.indexOf("所有") != -1) {
			dateType = 0;
		}
		else if (dateTypeValue.indexOf("今天内发送") != -1) {
			dateType = 3;
		}
		else if (dateTypeValue.indexOf("一周内发送") != -1) {
			dateType = 2;
		}
		else if (dateTypeValue.indexOf("一月内发送") != -1) {
			dateType = 1;
		}
		return dateType;
	},
	//shegnlan返回查询的关健字
	getKeyType: function(name) {
		switch (name) {
			case "sended":
				return "查找短信";
			case "timing":
				return "查找定时短信";
			case "savebox":
				return "查找珍藏短信";
		}
	}
	,
	//获取搜索关键字
	getKeyWord: function(name) {

		//shenglan  

		if ($.trim($("#txtSearch").val()).length > 0) {
			//查找往来记录
			if ($.trim($("#txtSearch").val()).indexOf(Common.getKeyType(name)) == -1) {
				return $.trim($("#txtSearch").val());
			}
		}
		return "";
	},
	//获取短信分类
	getClassInfo: function() {
		var classid = "";
		//classid = $("#divClassInfoSearch dt").attr("id");
		classid = $("#divClassInfoSearch").attr("classid");

		if (typeof (classid) == "undefined" || classid == null || classid.length == 0) {
			classid = "-1";
		}
		if (classid == "0") //所有记录
		{
			classid = "-2";
		}
		return classid;
	},
	//获取查询手机号码
	getMobile: function() {
		var mobile = $("#mobilePhone").val();
		if (mobile.indexOf("所有") != -1) {
			mobile = "";
		}
		else
			mobile = $("#mobilePhone").val();
		return mobile;
	},
	openRecord: function(type, filename) {
		Common.postXml({
			url: Common.getUrl("userredict"), //要发送的数据,
			data: PostXML["UserRedict_Xml"],
			success: function(result) {
				if (Common.errManage(result, "userredict") == true) {
					//shenglan 作的临时处理
					if (result["var"].isSetPwd == 1 && result["var"].isDecrypt == 0) {
						window.location = String.format("http://" + location.host + "/m2012/html/sms/sms_setting.html?isShow=1&path={0}&rnd={1}", filename, Math.random());
						return false;
					}
					else {
						if (filename.toLowerCase() == "sms_timinglist.html") {
							//日志上报
							top.addBehaviorExt({
								actionId: 20009,
								thingId: 0,
								moduleId: 14
							});
						}
						window.location = String.format("http://" + location.host + "/m2012/html/sms/{0}?rnd={1}", filename, Math.random());
					}
				}
			}
		});
	},

	//shegnlan 增加
	PageChange: function(bindpage) {
		$(".showpagesize").change(function() {

			var obj = $(this);
			$(".showpagesize").each(function() {
				for (var i = 0; i < this.options.length; i++) {
					if (this.options[i].text == obj.value)
						this.options[i].selected = true;
				}
			});
			bindpage;
		});
	},

	//shenglan 加载select分页
	loadSelectObj: function(pagecount, currentindex) {
		if ($(".selepage") != null) {
			$(".selepage").each(function() {
				this.options.length = 0;
				for (var i = 1; i <= pagecount; i++) {
					var text = i + '/' + pagecount;
					var varItem = new Option(text, i);
					this.options.add(varItem);
				}
				for (var i = 0; i < this.options.length; i++) {
					if (this.options[i].value == currentindex)
						this.options[i].selected = true;
				}
			});
		}
	},
	//shenglan 
	loadSelectPageSize: function(currentpagesize) {

		$(".showpagesize").each(function() {
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].text == currentpagesize)
					this.options[i].selected = true;
			}
		});
	},
	//shenglan pagesize 新增的页大小参数
	//绑定分页
	bindPage: function(jqueryObj, currentPage, totalPage, prev, next, obj) {

		//分页的下拉框绑定和事件
		var pagehtml
		if (totalPage > 1) {
			$(".pager").show();
			$(".btnDel").show();
			$(".selepage").show();

		}
		else {
			if (totalPage == 1) {
				$(".pager").show();
				$(".prev").hide();
				$(".next").hide();
				$(".selepage").hide();
				$(".btnDel").show();

			} else {
				$(".pager").hide();
				$(".btnDel").hide();
			}
		}
		//分页处理
		if (currentPage == 1) {
			$(".prev").hide();
		}
		else
			$(".prev").show();

		if (currentPage == totalPage)
			$(".nexts").hide();
		else
			$(".nexts").show();


		//上下页的分页             
		if (currentPage > totalPage) {

		}
		jqueryObj.find(".prev").unbind("click");
		jqueryObj.find(".nexts").unbind("click");
		if (currentPage < 2) {
		}
		else {
			jqueryObj.find(".prev").click(prev).click(function() {
				Common.bindPage(jqueryObj, parseInt(currentPage) - 1, totalPage, prev, next);
			});
		}
		if (currentPage >= totalPage) {

		}
		else {
			jqueryObj.find(".nexts").click(next).click(function() {
				Common.bindPage(jqueryObj, parseInt(currentPage) + 1, totalPage, prev, next);
			});
		}
	},
	showRecord: function(obj, result) {
		this.pageCount = result.pageCount;
		this.records = result.records;

		//显示数据条数
		$("#pagecount").text(result.records);
		if (result.records <= 0)
			$(".no-note").show();
		else
			$(".no-note").hide();
		if (result.pageCount == 0) {

			$(".btnDel").hide();
			$(".sms-share-2").show();
			$(".pager").hide();
			$(".rcd-table").hide();
			$(".btnSaveToBox").hide();
			$(".i-list").hide();

			//start添加设置往来记录自动保存链接 Henry 2010-01-13
			Common.postXml({
				url: Common.getUrl("config"), //要发送的数据,
				data: String.format(PostXML["Config_Xml"], 0, 0, "", ""),
				success: function(jdata) {
					if (Common.errManage(jdata, "config") == true) {
						if (jdata["var"].showSave == 0)
							$("#btnRecordSave").show();
					}
				}
			});
			//end添加设置往来记录自动保存链接
		}
		else {
			$(".btnSaveToBox").show();
			$(".i-list").show();
			$(".showpagesize").unbind("change");
			$(".selepage").unbind("change");
			if (result.pageCount >= 1) {
				Common.loadSelectObj(result.pageCount, obj.pageIndex);
				Common.loadSelectPageSize(obj.pagesize);
				//shenglan绑定分页
				$(".showpagesize").bind("change", function() {

					obj.pageIndex = 1;
					obj.pagesize = this.options[this.selectedIndex].text;
					obj.getSms();
				});
				if (result.pageCount > 1) {
					$(".selepage").bind("change", function() {
						var pageindex = $(this).val();
						obj.pageIndex = this.options[this.selectedIndex].value;
						obj.pagesize = parseInt(Common.getPageSize());
						obj.getSms();
					});
				}
				$(".rcd-table").show();
				obj.bindList(result);
				if (obj.pageIndex > result.pageCount) {
					obj.pageIndex = result.pageCount;
					obj.delsmsIds = "";
					obj.actionid = 0;
					obj.getSms();
				}
				Common.bindPage($(".pager"), obj.pageIndex, result.pageCount, function() {
					obj.pageIndex--;
					obj.getSms();
				}, function() {
					obj.pageIndex++;
					obj.getSms();
				}, obj);
			}

		}
	},
	getChkvalue: function() {

		var str = "";
		$("input[type=checkbox][id!=chkSelectAllUp]").each(function() {
			if ($(this).attr("checked") == true && $(this).val().toLowerCase != "on") {
				str += $(this).val() + ",";
			}
		});

		return str;
	},
	getCheckedNum: function(){
		var i = 0;

		$("input[type=checkbox][id!=chkSelectAllUp]").each(function() {
			if ($(this).attr("checked") == true && $(this).val().toLowerCase != "on") {
				i++;
			}
		});

		return i;
	},
	getCheckboxNum: function(){
		var i = 0;

		$("input[type=checkbox][id!=chkSelectAllUp]").each(function() {
			if ($(this).val().toLowerCase != "on") {
				i++;
			}
		});

		return i;
	},
	delSms: function(delstr, name) {

		var obj = Common.getObj(name);
		obj.pageIndex = Common.getCurrentPage();
		obj.pagesize = Common.getPageSize();
		//obj.dateType = Common.getDateType();
		obj.keyword = Common.getKeyWord(name);

		if (name.toLowerCase() == "timing") {
			obj.dateType = Common.getTimeDateType();
		}
		else {
			obj.dateType = Common.getDateType();
		}
		if (name.toLowerCase() == "savebox") {
			obj.classid = Common.getClassInfo();
		}
		if (name.toLowerCase() == "sended") {
			obj.mobile = Common.getMobile();
		}
		obj.delSms(delstr);
	},
	openSmsToBox: function(smsids, name) {
		if (typeof (smsids) == "undefined" || smsids == null || smsids.length == 0) {
			top.FloatingFrame.alert(SMSMessage["ConfirmTreaError"]); //"请选择要珍藏的短信!"
			return;
		}
		top.FloatingFrame.open("短信到珍藏夹", "/m2012/html/sms/sms_SaveSmsToBox.html?type=2&ids=" + smsids + "&name=" + name, 440, 260);
	},
	saveSmsToBox: function(savetype, destId, smsIds, smscontent, classname, name) {
		var obj = Common.getObj(name);
		obj.saveSmsToBox(savetype, destId, smsIds, smscontent, classname);
	},
	transSms: function(transtr, classid, classname) {
		var obj = new Marked();
		obj.pageIndex = Common.getCurrentPage();
		obj.pagesize = Common.getPageSize();
		obj.dateType = Common.getDateType();
		obj.keyword = Common.getKeyWord("savebox");
		obj.classid = Common.getClassInfo();
		obj.destId = classid;
		obj.transSms(transtr, classname);
	},
	getObj: function(name) {
		var obj;
		switch (name) {
			case "sended":
				obj = new SmsSended();
				break;
			case "timing":
				obj = new SmsTiming();
				break;
			case "savebox":
				obj = new Marked();
				break;
		}
		return obj;
	},
	getUrl: function(name) {
		if (name) {
			name = $.trim(name.toLowerCase());
		}
		var sid = "";
		var url = SMSMessage["SmsServices"];
		var func = "";
		switch (name) {
			case "timing":
				func = "smsTiming";
				break;
			case "sended":
				func = "getSmsSender";
				break;
			case "savebox":
				func = "setSmsBox";
				break;
			case "maindata":
				func = "getSmsMainData";
				break;
			case "loveroom":
				func = "smsLoveRoom";
				break;
			case "send":
				func = "sendSms";
				break;
			case "config":
				func = "setSmsConfig";
				break;
			case "userredict":
				func = "userRedict";
				break;
			case "setidiograph":
				func = "setSmsIdiograph";
				break;
			case "success":
				func = "success";
				break;
			default:
				break;
		}
		if (top.window == window) {
			sid = Common.getParentWindow().top.UserData.ssoSid;
		}
		else {
			sid = top.UserData.ssoSid;
		}
		if (!Common.isEmpty(url)) {
			url = url + "?func=sms:" + func + "&sid=" + sid + "&rnd=" + Math.random();
		}
		return url;
	},
	//shenglan的到下拉框的值
	getSelectedValue: function(controlid) {
		if (controlid != null) {
			for (var i = 0; i < controlid.options.length; i++) {
				if (controlid.options[i].selected == true)
					return controlid.options[i].text;
			}
		}
	},
	//正则表达式 替换括号,尖括号等
	toTxt: function(str) {
		var RexStr = /\<|\>|\"|\'|\&/g;
		str = str.replace(RexStr, function(MatchStr) {
			switch (MatchStr) {
				case "<":
					return "&lt;";
					break;
				case ">":
					return "&gt;";
					break;
				case "\"":
					return "&quot;";
					break;
				case "'":
					return "&#39;";
					break;
				case "&":
					return "&amp;";
					break;
				default:
					break;
			}
		});
		return str;
	},
	//shenglan 根据电话号码取的相应提示和显示语
	getMobileAndTitle: function(renumber, sendmsg) {

		var mobilestr = '';
		var title = '';
		var context = '';
		var contexttitle = '';
		var mobileName = Common.getUserName(renumber.substring(2));

		title = mobileName.decode();

		if (NumberTool.isChinaMobileNumber(mobileName)) {
			mobilestr = renumber.substring(2);
			title = mobilestr;
		}
		else {
			mobileName = mobileName.decode();
			if (mobileName.length > 5) {
				mobilestr = mobileName.substring(0, 5) + "...";
				mobilestr = Common.toTxt(mobilestr);
			}
			else {
				mobilestr = mobileName;
				title = mobilestr;
			}
		}
		context = sendmsg.encode().replace(/\n/g, "<br/>").replace('[发自139邮箱]', '');
		contexttitle = sendmsg.encode().replace('[发自139邮箱]', '');
		if (context.length > 70)
			context = context.substring(0, 70) + "...";

		return { "title": title, "mobilestr": mobilestr, "context": context, "contexttitle": contexttitle };
	}
	 ,
	getTemplate: function(name) {
		name = $.trim(name.toLowerCase());
		var template = "";
		switch (name) {
			case "timing":
				template = '<tr >\
							<td class="t-check">\
								<input  type="checkbox" value="{0}" /></td>\
							<td class="t-contact"title =\"给Ta发送短信\">{1}</td>\
							<td class="t-time">\
							   {2}</td>\
							<td class="t-content"title=\"转发此短信\">{3}\
								<p>\
									</p>\
							</td>\
							<td class="t-action">\
								 <ul>\
				<li id="send">{4}</li>\
				<li id="del">{5}</li>\
			 </ul>\
							</td>\
						</tr>';
				break;
			case "sended":
				template = ' <tr>\
							<td class="t-check">\
								<input  type="checkbox" value="{0}" />\
							</td>\
							<td class="t-status">\
								<i class="{1}" title=\"{2}\"></i>\
							</td>\
							<td class="t-contact" title =\"给Ta发送短信\">\
								{3}\
							</td>\
							<td class="t-time">\
								{4}\
							</td>\
							<td class="t-content" title=\"转发此短信\">{5}</td>\
							<td class="t-action">\
								<ul>\
									<li><a href="#" id="send">{6}</a></li>\
									<li><a href="#" id="del">{7}</a></li>\
									<li><a href="#" id="save">{8}</a></li>\
								</ul>\
							</td>\
						</tr>';
				break;
			case "savebox":
				template = '<tr>\
					<td class="t-check"><input type="checkbox" value="{0}" /></td>\
					<td class="t-time" title="{1}" >{2}</td>\
					<td class="t-time">{3}</td>\
					<td class="t-content" title=\"转发此短信\">{4}</td>\
					<td class="t-action">\
						<ul><li>{5}</li><li>{6}</li></ul>\
					</td>\
				</tr>';


				break;
			case "loveroom":
				template = '<tr>\
			<td id="checkbox"><input type="checkbox"></td>\
			<td id="ReceiveNumber"></td>\
			<td id="SendTime"></td>\
			<td id="SendMsg"></td>\
		</tr>';
				break;
			default:
				break;
		}
		return template;
	},
	getChangeDays: function() {
		var selDay = $("#sltDay")[0];
		var selectDay = $("#sltDay").selectedValues()[0];
		var date = new Date();
		date.setFullYear($("#sltYear").val());
		date.setDate(1);
		date.setMonth($("#sltMonth").val());
		date.setDate(0);
		var days = date.getDate();
		date.setDate(1);
		var weekDays = ["日 星期天", "日 星期一", "日 星期二", "日 星期三", "日 星期四", "日 星期五", "日 星期六"];
		var startWeekDay = date.getDay();
		selDay.options.length = 0;
		for (var i = 1; i <= days; i++) {
			var wd = (startWeekDay + i - 1) % 7;
			var opValue = i > 9 ? i : "0" + i;
			var op = new Option(i + weekDays[wd], opValue);
			if (wd == 0 || wd == 6) {
				op.style.color = "red";
			}
			selDay.options.add(op);
		}
		$("#sltDay").selectOptions(selectDay);
	},
	priceInfo: function(data) {
		var me = this;
		var container = $("#divPriceTips");
		var tr = $("#trPriceTips");
		container.find("span.close").click(function() {
			tr.attr("rel", "1").hide();
		});
		this.showTips = function(func) {
			var count = 0;
			if (func) count = func();
			if (!tr.attr("rel")) {
				if (count > 0) {
					var text = SMSMessage["PriceTips"];
					if (data) {
						if (data.totalFree == 0) {
							text = SMSMessage["PriceTips1"];
						}
					}
					container.find("span:eq(0)").html(text.format(count));
					tr.show();
				} else {
					tr.hide();
				}
			}
		}
	},
	getMaxDayMonthSend: function (str) {
		if (str == "") return;

		var dayMatch = str.match(/每天限发(\d*)/),
			monthMatch = str.match(/每月限发(\d*)/);

		dayMatch && (this.maxDaySend = dayMatch[1]);
		monthMatch && (this.maxMonthSend = monthMatch[1]);
		top.SmsMaxDaySend = this.maxDaySend;//提供给短信分批发送页面中使用
		top.SmsMaxMonthSend = this.maxMonthSend;
	},
	/**
	 * 日月封顶提示
	 * @param {Boolean} isMonth 必填 true 为月封顶
	 */
	tipMaxDayMonthSend: function (isMonth) {
		var self = this,
			txt = "发送短信超过{0}封顶上限：{1}条{2}",
			txt1 = "，升级邮箱可提高每{0}发送上限。",
			day = "日",
			month = "月";

		if (isMonth) {
			txt1 = txt1.format(month);
			txt = txt.format(month, top.SmsMaxMonthSend || this.maxMonthSend, this.is20Version() ? "" : txt1);
		} else {
			txt1 = txt1.format(day);
			txt = txt.format(day, top.SmsMaxDaySend || this.maxDaySend, this.is20Version() ? "" : txt1);
		}

		top.$Msg.confirm(txt, function(){
			!self.is20Version() && top.$App.showOrderinfo();
		}, function(){
			//
		})
	},
	//是否20元用户
	is20Version: function(){
		return top.$User.getServiceItem() == top.$User.getVipStr("20");
	}
};
String.format = function() {
	if (arguments.length == 0) return "";
	if (arguments.length == 1) return arguments[0];
	var newArgs = [];
	for (var i = 1; i < arguments.length; i++) {
		newArgs.push(arguments[i]);
	}
	return String.prototype.format.apply(arguments[0], newArgs)
}

//所有的绑定分页的绑定代码
function BindControlEvent() {
	//shenglan 绑定分页

	$("#aFileUpload").click(function() {
		top.Links.show('quicklyShare');
	});
	//全选复选框
	$("#chkSelectAllUp").click(function() {

		var checked = this.checked;
		$("#tableSmsList input:checkbox").attr("checked", checked ? "checked" : null);
		if (checked) {
			$(".chkSelectAllDown").html("不选");
		}
		else {
			$(".chkSelectAllDown").html("全选");
		}
	});

	//全选 

	$(".chkSelectAllDown").unbind("click");
	$(".chkSelectAllDown").bind("click", function() {

		if ($.trim($(".chkSelectAllDown").html()) == "全选") {
			$(".chkSelectAllDown").html("不选");
			$("#tableSmsList input:checkbox").attr("checked", true ? "checked" : null);
			return;
		}
		if ($.trim($(".chkSelectAllDown").html()) == "不选") {
			$(".chkSelectAllDown").html("全选");
			$("#tableSmsList input:checkbox").attr("checked", false ? "checked" : null);
			return;
		}
	});
	if (top.Utils.PageisTimeOut(true)) {
		//top.Utils.showTimeoutDialog(); 
		return false;
	}
}

function jsonToDateTime(dateTime) {
	var d = new Date(parseInt(dateTime.replace("/Date(", "").replace(")/", "")));
	var mm = d.getMinutes();
	var formatmm = mm;
	if (mm < 10)
		formatmm = "0" + mm;
	return (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + formatmm;
}

jQuery.fn.getUrlPath = function() {
	var url = window.location.toString();
	var tmp;
	/*if (url && url.lastIndexOf("/")) {
	tmp = url.substring(0, url.lastIndexOf("/"));
	}*/
	if (url && url.indexOf(".htm")) {
		tmp = url.substring(0, url.indexOf(".htm"));
	}
	if (tmp && tmp.lastIndexOf("/")) {
		tmp = tmp.substring(0, tmp.lastIndexOf("/"));
	}
	return tmp;
}

//定时短信记录处理
function SmsTiming() {
	this.pageIndex = 1;
	this.pagesize = 10
	this.actionid = 0;
	this.delsmsIds = "";
	this.mobile = "";
	this.keyword = "";
	this.template = "";
	this.dateType = 0;
	var smsTiming = this;
	this.delSms = function(delstr) {
		this.delsmsIds = delstr;
		if (this.delsmsIds.indexOf(",") != -1) {
			this.delsmsIds = this.delsmsIds.substring(0, this.delsmsIds.lastIndexOf(","));
		}
		if (this.delsmsIds.length > 0) {
			//"你要删除所选择的短信记录吗?"
			top.FloatingFrame.confirm(SMSMessage["DelMsmMessagePrompt"], function() {
				smsTiming.actionid = 2;
				smsTiming.getSms();
			});
		}
		else {
			top.FloatingFrame.alert(SMSMessage["DelMsmPrompt"]); //"请选择要删除的短信!"
		}
	};
	this.bindList = function(result) {

		if (result.records == 0)
			$(".btnDel").hide();
		else
			$(".btnDel").show();
		var table = $("#tableSmsList");
		$(table).hide();
		var html = "";
		var del = "";
		var send = "";
		var mobilehref = "";
		var contenthref = "";
		var template = Common.getTemplate("timing");
		var tableHtml = '<tbody>\
				<tr>\
					<th class="t-check chkSelectAllDown">全选</th>\
					<th class="t-contact">联系人</th>\
					<th class="t-time">创建时间</th>\
					<th class="t-content">短信内容</th>\
					<th class="t-action">操作</th>\
				</tr>';

		var results;

		$.each(result.table, function(i, n) {
			results = Common.getMobileAndTitle(n.recUserNumber, n.sendMsg);
			mobilehref = "<a title=" + escapeMsg(results.title) + " href=sms_send.html?mobile=" + n.recUserNumber + ">" + results.mobilestr + "</a>";
			del = "<a  href=\"javascript:;\"; onclick=\"javascript:Common.delSms('" + n.serialId + "','timing');\">删除</a>";
			send = "<a href =\"javascript:;\" onclick=\"javascript:Common.recoreOpen('sms_send.html','" + n.groupId + "','" + escapeMsg(n.sendMsg.replace('[发自139邮箱]', '')) + "','&scheduleDate="+n.sendTime.replace(".0", "")+"');return false;\">修改</a>";
			contenthref = "<a href =\"javascript:;\" title=\"" + escapeMsg(results.contexttitle, true) + "\" onclick=\"javascript:Common.recoreOpen('sms_send.html','-1','" + escapeMsg(n.sendMsg.replace('[发自139邮箱]', '')) + "');return false;\">" + results.context + "</a>";
			html = html + String.format(template, n.serialId, mobilehref, Common.getFullTime(n.createTime), contenthref, del, send);
		});

		html += "</tbody>";
		if (html.length > 0) {
			tableHtml += html;
			$(table).html(tableHtml);
			$("#tableSmsList input[type='checkbox']").click(function() {
				if ($(this).attr("checked") == true) {
					$(this).parent().parent().addClass("t-checked");
				}
				else {
					$(this).parent().parent().removeClass("t-checked");
				}
			});
		}
		$(table).show();
		BindControlEvent();
	};
	this.getSms = function() {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("timing"),
			data: String.format(PostXML["SmsTiming_Xml"], smsTiming.actionid, smsTiming.delsmsIds, top.encodeXML(smsTiming.keyword), smsTiming.mobile, smsTiming.pageIndex, smsTiming.pagesize, smsTiming.dateType),
			success: function(result) {
				$("#dfs").css("visibility", "inherit");
				if (Common.errManage(result, "timing") == true) {
					if (result.code == "S_OK") {
						ShowLock(result["var"].isSetPwd);
						if (smsTiming.actionid == 2) {
							smsTiming.actionid = 0;
							top.FloatingFrame.alert(SMSMessage["DelMsmReMessageSuccess"], Common.initCheckBox()); //"记录已被删除!"
						}
						if (Common.checkSetting(result["var"], "timing", "") == true) {
							Common.showRecord(smsTiming, result["var"]);
						}
					}
				}
			}
		});
	}
};
//往来记录处理
function SmsSended() {
	this.pageIndex = 1;
	this.pagesize = 10;
	this.actionid = 0;
	this.delsmsIds = "";
	this.mobile = "";
	this.keyword = "";
	this.template = "";
	this.dateType = 0;
	var sended = this;
	this.delSms = function(delstr) {

		this.delsmsIds = delstr;
		if (this.delsmsIds.indexOf(",") != -1) {
			this.delsmsIds = this.delsmsIds.substring(0, this.delsmsIds.lastIndexOf(","));
		}
		if (this.delsmsIds.length > 0) {
			//"你要删除所选择的短信记录吗?"
			top.FloatingFrame.confirm(SMSMessage["DelMsmMessagePrompt"], function() {
				sended.actionid = 2;
				//sended.pageIndex = 1;

				//当前页为最后一页，并且全选，删除之后将跳转到前一页
				if (Common.pageIndex == Common.pageCount && (Common.getCheckedNum() == Common.getCheckboxNum())){
					sended.pageIndex = Common.pageIndex - 1;
				} else {
					sended.pageIndex = Common.pageIndex;
				}

				sended.getSms();
			});
		}
		else {
			top.FloatingFrame.alert(SMSMessage["DelMsmPrompt"]); //"请选择要删除的短信!"
		}
	};
	this.bindList = function(result) {
		var table = $("#tableSmsList");
		table.hide();
		var html = "";
		var del = "";
		var send = "";
		var mobilehref = "";
		var recnumber = "";

		//增加总的数据量shenglan
		// $("#pagecount").text(result.Records);

		var template = Common.getTemplate("sended");

		html += '<tbody>\
			<tr>\
				<th class="t-check chkSelectAllDown">全选</th>\
				<th class="t-status">状态</th>\
				<th class="t-contact">联系人</th>\
				<th class="t-time">\发送时间</th>\
				<th class="t-content">短信内容</th>\
				<th class="t-action">操作</th>\
			</tr>';
		//列表修改shenglan

		var recnumber = '';

		$.each(result.table, function(i, n) {
			var status = "";
			var title = "";
			if (n.sendStatus == 1) {
				if (n.comeFrom == 6) {
					status = "i-sms-right";
					title = "已接收";
					recnumber = n.userNumber;
				}
				else {
					status = "i-sms-left";
					title = "发送成功";
					recnumber = n.recUserNumber;
				}
			}
			else if (n.sendStatus == 2) {
				if (n.comeFrom == 6) {
					recnumber = n.userNumber;
				}
				else {
					recnumber = n.recUserNumber;
				}
				status = "i-sms-fail";
				title = "发送失败";
			}
			else if (n.sendStatus == 0) {
				if (n.comeFrom == 6) {
					recnumber = n.userNumber;
				}
				else {
					recnumber = n.recUserNumber;
				}
				
				if(n.comeFrom == 3){
					status = "i_alarm";
					title = "定时短信";
				} else {
					status = "i-sms-write";
					title = "发送中";
				}
			}
			//shenglan       
			var result = Common.getMobileAndTitle(recnumber, n.sendMsg);
			mobilehref = "<a title='" + escapeMsg(result.title) + "' href=sms_send.html?mobile=" + recnumber + ">" + result.mobilestr + "</a>";

			send = "<a href =\"javascript:void(0);\" onclick=\"javascript:Common.recoreOpen('sms_send.html','-1','" + escapeMsg(n.sendMsg.replace('[发自139邮箱]', '')) + "');return false;\">发送</a>";
			contenthref = "<a href =\"javascript:void(0);\" title=\"" + escapeMsg(result.contexttitle, true) + "\" onclick=\"javascript:Common.recoreOpen('sms_send.html','-1','" + escapeMsg(n.sendMsg.replace('[发自139邮箱]', '')) + "');return false;\">" + result.context + "</a>";

			del = "<a  href=\"javascript:;\"; onclick=\"javascript:Common.delSms('" + n.serialId + "','sended');\">删除</a>";
			html = html + String.format(template, n.serialId, status, title, mobilehref, Common.getFullTime(n.createTime), contenthref, send, del, "<a  href='javascript:void(0)' onclick=\"javascript:Common.openSmsToBox('" + n.serialId + "','sended');\">珍藏</a>");
		});
		html += "</tbody>";
		if (html.length > 0) {
			$("#tableSmsList").html(html);

			$("#tableSmsList input[type='checkbox']").click(function() {

				if ($(this).attr("checked") == true) {
					$(this).parent().parent().addClass("t-checked");
				}
				else {
					$(this).parent().parent().removeClass("t-checked");
				}

			});

		}

		$("#tableSmsList").show();
		BindControlEvent();

	};

	//取的更多的电话号码shenglan
	this.getPhone = function(activeid, currentindex) {
		var phonenum = 10; //电话号码的个数
		//actionId=8取用户好友电话号码actionID=9是第一次加载
		Common.postXml({
			url: Common.getUrl("sended"),
			data: String.format(PostXML["SmsSended_Xml"], activeid, currentindex, phonenum, "", "", "", sended.pagesize, sended.pageIndex, ""),
			success: function(result) {
				if (result.code == "S_OK") {
					if (currentindex <= result["var"].pageCount) {
						if (currentindex == result["var"].pageCount)
							$("#queryUsr").hide();
						else
							$("#queryUsr").show();
						var html = $("#outHeight").html();
						$.each(result["var"].table, function(i, n) {
							html += "<li class='phones' phone='" + n.recUserNumber + "'>" + Common.getUserName(n.recUserNumber.substring(2)) + "</li>";
						});

						$("#outHeight").html(html);

						$(".phones").hover(function() {
							$(this).addClass("hover");
						}, function() {
							$(this).removeClass("hover");
						});

						$(".phones").click(function() {
							$(".phones").each(function() {
								$(this).removeClass("current");
							});
							$("#aAll").removeClass("current");

							$(this).addClass("current");
							$("#mobilePhone").val($(this).attr("phone"));

							Common.searchByMobile("sended");
						});
					}
					else {
						$("#queryUsr").hide();
					}
				}
			}
		});
	};

	this.getSms = function() {
		if (top.Utils.PageisTimeOut(true))
			return;
		var sended = this;
		Common.postXml({
			url: Common.getUrl("sended"),
			data: String.format(PostXML["SmsSended_Xml"], sended.actionid, 1, 10, sended.delsmsIds, top.encodeXML(sended.keyword), sended.mobile, sended.pagesize, sended.pageIndex, sended.dateType),
			success: function(result) {
				$("#wljl").css("visibility", "inherit");
				if (Common.errManage(result, "sended") == true) {
					if (result.code == "S_OK") {
						Common.pageIndex = sended.pageIndex;

						ShowLock(result["var"].isSetPwd);
						if (sended.actionid == 2) {
							sended.actionid = 0;
							top.FloatingFrame.alert(SMSMessage["DelMsmReMessageSuccess"], Common.initCheckBox()); //"记录已被删除!"
						}
						//shenglan注册的重要
						if (Common.checkSetting(result["var"], "sended", "") == true) {
							Common.showRecord(sended, result["var"]);
						}
					}
				}
			}
		});
	}
};

function Marked() {
	this.pageIndex = 1;
	this.pagesize = 20;
	this.actionid = 0;
	this.delsmsIds = "";
	this.mobile = "";
	this.keyword = "";
	this.template = "";
	this.classid = "-1";
	this.dateType = 0;
	this.destId = 0;
	this.sourcetype = "";
	var savebox = this;
	this.delSms = function(delstr) {
		this.delsmsIds = delstr;
		if (this.delsmsIds.indexOf(",") != -1) {
			this.delsmsIds = this.delsmsIds.substring(0, this.delsmsIds.lastIndexOf(","));
		}
		if (this.delsmsIds.length > 0) {
			//"你要删除所选择的短信记录吗?"
			top.FloatingFrame.confirm(SMSMessage["DelMsmMessagePrompt"], function() {
				savebox.actionid = 2;
				savebox.getSms();
			});
		}
		else {
			top.FloatingFrame.alert(SMSMessage["DelMsmPrompt"]); //"请选择要删除的短信!"
		}
	};
	this.transSms = function(transtr, classname) {
		this.delsmsIds = transtr;
		if (this.delsmsIds.indexOf(",") != -1) {
			this.delsmsIds = this.delsmsIds.substring(0, this.delsmsIds.lastIndexOf(","));
		}
		if (this.delsmsIds.length > 0) {
			savebox.actionid = 3;
			savebox.getSms(classname);
		}
		else {
			top.FloatingFrame.alert(SMSMessage["MsmRemovePrompt"]); //"请选择要转移的短信!"
		}
	};
	this.delClass = function() {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("savebox"),
			data: String.format(PostXML["SaveBox_Xml"], 5, "", "", "", "", savebox.pagesize, savebox.pageIndex, savebox.destId, "", -1, -1, ""),
			success: function(result) {
				if (Common.errManage(result, "savebox") == true) {
					if (result.code == "S_OK") {
						top.FloatingFrame.alert(result.summary);
						if (Common.checkSetting(result["var"], "savebox", "") == true) {
							Common.showRecord(savebox, result["var"]);
							savebox.bindClass(result["var"]);
						}
					}
				}
			}
		});
	};
	this.editClass = function(classname, obj) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("savebox"),
			data: String.format(PostXML["SaveBox_Xml"], 4, "", "", "", "", savebox.pagesize, savebox.pageIndex, savebox.destId, "", -1, savebox.classid, top.encodeXML(classname)),
			success: function(result) {
				if (Common.errManage(result, "savebox") == true) {
					top.FloatingFrame.alert(result.summary);
					if (Common.checkSetting(result["var"], "savebox", "") == true) {
						savebox.bindClass(result["var"]);
					}
					obj.getSms();
				}
			}
		});
	};
	this.bindClass = function(result) {
		//shenglan 6月修改
		var htmltrans = "";
		var htmlsearch = "";
		var obj = []

		$.each(result.classInfo, function(i, item) {
			if (item.spNumber != "0613990") {
				obj.push(new Option(item.className.encode(), item.classId));
			}
			var classname = item.className;
			if (classname.length > 6) {
				classname = classname.substring(0, 6).encode() + "...";
			}
			if (item.spNumber == "0613990") {
				htmlsearch = htmlsearch + String.format("<li indexid=\"{0}\" id=\"{1}\" title=\"{2}\"><span id=\"spclassinfo\" onclick=\"javascript:transSearch(this);\" classid={3} class=\"li-cate\">{4}</span>", i, item.classId, item.className.encode(), item.classId, classname);
			}
			else {
				htmlsearch = htmlsearch + String.format("<li  indexid=\"{0}\" id=\"{1}\" title=\"{2}\"><input type=\"text\" maxlength=\"16\"  class=\"li-cate\"  style=\"display:none\" value=\"{3}\"></input><span  onclick=\"javascript:transSearch(this);\" classid={4} class=\"li-cate\">{5}</span><a class=\"li-edit\"  onclick=\"javascript:Common.editClassInfo(this)\" style=\"display:none\" >编辑</a><a  class=\"li-delete\"  style=\"display:none\"  onclick=\"javascript:Common.delClassInfo(this)\">删除</a></li>", i, item.classId, item.className.encode(), item.className.encode(), item.classId, classname);
			}
		});
		if (obj.length > 0) {
			//写入类别
			$(".ulDownList").each(function() {

				$(this).html("");
				var html = "";
				for (var i = 0; i < obj.length; i++) {
					html += String.format("<li classid=\"{0}\" classname=\"{1}\" ><a href=\"javascript:;\">{2}</a></li>", obj[i].value, obj[i].text, obj[i].text);
				}
				$(this).html(html);
			});
			$(".ulDownList li").unbind("click").bind("click", function() {
				$(".sent-locker").hide();
				transSms(this);
			});
		}
		if (htmlsearch.length > 0) {
			htmlsearch = String.format("<li id=\"{0}\" class=\"li-cate\" title=\"{1}\"><span id=\"spclassinfo\" classid=\"0\"  onclick=\"javascript:transSearch(this);\" class=\"li-cate\">{2}</span>", 0, "所有", "所有") + htmlsearch;
			$("#divClassInfoSearch").html(htmlsearch);
			$("#divClassInfoSearch li").hover(function() {
				$(this).addClass("hover");
			}, function(e) {
				$(this).removeClass("hover");
			});
			$("#divClassInfoSearch li").hover(function() {
				$(this).find(".li-edit").show();
				$(this).find(".li-delete").show();
			}, function(e) {
				if ($(this).find(".li-edit").text() == "保存") {
				}
				else {
					$(this).find(".li-edit").hide();
					$(this).find(".li-delete").hide();
					$(this).find("input").hide();
					$(this).find("span").show();
				}
			});
		}
		//shenglan end
	};
	this.bindSmsToBox = function() {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("savebox"), //要发送的数据,
			data: String.format(PostXML["SaveBox_Xml"], 6, "", "", "", "", savebox.pagesize, savebox.pageIndex, 0, "", -1, -1, ""),
			success: function(result) {
				if (Common.errManage(result, "savebox") == true) {
					if (result.code == "S_OK") {
						var html = "";
						var classinfos = "";
						$.each(result["var"].classInfo, function(i, item) {
							if (item.spNumber != "0613990") {
								if (classinfos.length > 0) {
									classinfos = classinfos + "," + item.className;
								}
								else {
									classinfos = item.className;
								}
								html = html + String.format("<li><label for=\"my-radio{0}\"><input type=\"radio\" id=\"my-radio{0}\" name=\"rbclassinfo\" value=\"{1}\" />{2}</label></li>", i, item.classId, item.className.encode());
							}
						});
						if (result["var"].classInfo.length <= 8) {
							html = html + "<li><input  for=\"my-radio9\" type=\"radio\" value=\"-1\" id=\"my-radio9\" name=\"rbclassinfo\"/>\
									<input class=\"text input-default\" maxlength=\"16\" id=\"txtClassName\" onfocus=\"javascipt:removeCss(this);\" onblur=\"javascipt:addCss(this);\" type=\"text\" value=\"新建分类\" /><div id=\"divContentError\" class=\"tooltip warn-tooltip\">\
								<div class=\"bd\">\
									<p><strong>新建分类名称</strong></p>\
									<div class=\"pointer\">\
										<span class=\"pt-bd\"></span></div>\
									<i class=\"i-warn\"></i></div>\
							</div></li>";
						}
						$("#txtClassInfo").val(classinfos);
						$(".save-to-favorite ul").html(html);
					}
				}
			}
		});
	};
	this.bindList = function(result) {
		var tableheader = "<tr>\
							<th class=\"t-check chkSelectAllDown \">\
								全选</th>\
							<th class=\"t-time\">\
								短信分类</th>\
							<th class=\"t-time\">\
								珍藏时间</th>\
							<th class=\"t-content\">\
								短信内容</th>\
							<th class=\"t-action\">\
								操作</th>\
						</tr>";
		var table = $("#tableSmsList");
		$(table).hide();
		var html = "";
		var del = "";
		var send = "";
		var mobilehref = "";
		var contenthref = "";
		var template = Common.getTemplate("savebox");
		html += tableheader;
		var classname = '';
		var results;
		$.each(result.table, function(i, n) {
			results = Common.getMobileAndTitle("", n.content);
			if (n.className.encode().length > 5)
				classname = n.className.encode().substring(0, 5) + "...";
			else
				classname = n.className.encode();
			send = "<a href =\"javascript:void(0);\" onclick=\"javascript:Common.recoreOpen('sms_send.html','-1','" + escapeMsg(n.content.replace('[发自139邮箱]', '')) + "');return false;\">发送</a>";
			del = "<a  href=\"javascript:;\"; onclick=\"javascript:Common.delSms('" + n.seqNo + "','savebox');\">删除</a>";
			contenthref = "<a href =\"javascript:void(0);\" title='" + escapeMsg(results.contexttitle, true) + "' onclick=\"javascript:Common.recoreOpen('sms_send.html','-1','" + escapeMsg(n.content.replace('[发自139邮箱]', '')) + "');return false;\">" + results.context + "</a>";
			html = html + String.format(template, n.seqNo, n.className.encode(), classname, Common.getFullTime(n.createTime), contenthref, send, del);
		});
		if (html.length > 0) {
			$(table).html(html);
			$("#tableSmsList input[type='checkbox']").click(function() {
				if ($(this).attr("checked") == true) {
					$(this).parent().parent().addClass("t-checked");
				}
				else {
					$(this).parent().parent().removeClass("t-checked");
				}
			});
		}
		$(table).show();
		BindControlEvent();
	};
	this.saveSmsToBox = function(savetype, destid, smsids, smscontent, classname) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("savebox"),
			data: String.format(PostXML["SaveBox_Xml"], 1, smsids, "", "", "", savebox.pagesize, savebox.pageIndex, destid, top.encodeXML(smscontent), savetype, "", top.encodeXML(classname)),
			success: function(result) {
				if (Common.errManage(result, "savebox") == true) {
					if (result.code == "S_OK") {

						alert("短信已存到珍藏记录的[" + classname + "]");
					}
					else {
						alert(result.summary);
					}
					top.FloatingFrame.close();
				}
			}
		});
	};
	this.getSms = function(classname) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("savebox"),
			data: String.format(PostXML["SaveBox_Xml"], savebox.actionid, savebox.delsmsIds, savebox.sourcetype, savebox.dateType, top.encodeXML(savebox.keyword), savebox.pagesize, savebox.pageIndex, savebox.destId, "", -1, savebox.classid, classname),
			success: function(result) {
				$("#zcjl").css("visibility", "inherit");
				if (Common.errManage(result, "savebox") == true) {
					if (result.code == "S_OK") {
						ShowLock(result["var"].isSetPwd);
						if (savebox.actionid == 3) {
							var msg = String.format(SMSMessage["MsmRemoveTypeSuccess"], classname.encode());
							savebox.actionid = 0;
							top.FloatingFrame.alert(msg, Common.initCheckBox());
							$(".ddl-link dl").removeClass("show-drowpdownlist");
						}
						if (savebox.actionid == 2) {
							savebox.actionid = 0;
							top.FloatingFrame.alert(SMSMessage["RecordDelSuccess"], Common.initCheckBox()); //"记录已被删除!"
						}
						//shenglan 重要
						if (Common.checkSetting(result["var"], "savebox", "") == true) {
							Common.showRecord(savebox, result["var"]);
							if (Common.isEmpty(savebox.classid) || savebox.classid == "-1") {
								savebox.bindClass(result["var"]);
							}
						}
					}
				}
			}
		});
	}
};
function Love() {
	this.pageIndex = 1;
	this.pagesize = 10;
	this.actionid = 0;
	this.delsmsIds = "";
	this.keyword = "";
	this.lovemobile = "";
	this.smstype = "";
	this.sex = 0;
	this.dateType = 0;
	var love = this;
	this.loveManage = function(state) {
		this.dataType = window.dataType;
		this.smstype = 0;
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], love.actionid, love.delsmsIds, love.keyword, 0, "", love.pageIndex, love.pagesize, window.dataType, love.smstype),
			success: function(result) {
				love.callback(result, state);
			}
		});
	};
	this.callback = function(result, state) {
		var idoc = top.$("iframe[id='sms']")[0].contentWindow.document;

		if (result.code == "S_OK") {
			if (this.actionid == 5) {

				if (result["var"].loveMan.length > 0) {
					var name = "";
					idoc.getElementById("spaddcontent").style.display = "none";
					idoc.getElementById("actionType").innerHTML = "撤销";
					idoc.getElementById("spanlove").innerHTML = result["var"].loveMan;
					idoc.getElementById("spanlove").style.display = "";
					idoc.getElementById("siderInfo").style.display = "";
					idoc.getElementById("siderInfoLover").style.display = "none";
					if (result["var"].pageCount == 0) {
						$(idoc).find(".sms-list-null").show();
						$(idoc).find("#divLoveList").hide();
					}
					else {
						$(idoc).find(".sms-list-null").hide();
						$(idoc).find("#divLoveList").show();
					}
				}
				else {
					if (result["var"].pageCount != 0) {
						$(idoc).find(".sms-list-null").hide();
						$(idoc).find("#spaddcontent").hide();
						$(idoc).find("#siderInfoLover").show();
						$(idoc).find("#divLoveList").show();
						idoc.getElementById("actionAdd").innerHTML = "立即添加";
					}
					else {
						$(idoc).find(".sms-list-null").hide();
						$(idoc).find("#siderInfoLover").hide();
						$(idoc).find("#spaddcontent").show();
						$(idoc).find("#divLoveList").hide();
					}
					idoc.getElementById("spanlove").style.display = "none";
					idoc.getElementById("siderInfo").style.display = "none";
				}
				if (state == 1) {
					if (top.FloatingFrame != undefined) {
						top.FloatingFrame.close();
					}
				}
			}
			if (this.actionid == 1) {
				$(".sms-list-null").hide();
				if (result["var"].pageCount > 0) {
					$(".sms-list-null").hide();
					$("#spaddcontent").hide();
					$("#siderInfoLover").show()
					idoc.getElementById("actionAdd").innerHTML = "立即添加";
				}
				else {
					$("#siderInfoLover").hide();
					$("#spaddcontent").show();
					$(".hd1").show();
				}
				idoc.getElementById("spanlove").style.display = "none";
				idoc.getElementById("siderInfo").style.display = "none";
				top.FloatingFrame.alert(result.summary);
			}
		}
	};
	this.addLoveMan = function(lovemobile, sex) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], 2, "", "", sex, lovemobile, 1, 10, "", 0),
			success: function(result) {
				if (result.code == "S_OK") {
					if (result["var"].isShowSex == 0) {
						alert(result.summary);
					}
					else {
						alert(result.summary);
						love.loveManConfig(1);
					}
				} else {
					alert(result.summary);
				}
			}
		});
	};
	this.SetSex = function(sex) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], 4, "", "", sex, "", love.pageIndex, love.pagesize, "", 0),
			success: function(result) {
				if (result.code == "S_OK") {
					alert(result.summary);
					love.loveManConfig(1); ;
				}
			}
		});
	}
	this.delLoveMan = function() {
		//"确定要撤销已设置的情侣号码吗？"
		top.FloatingFrame.confirm(SMSMessage["DelLiverNumPrompt"], function() {
			love.actionid = 1;
			love.lovemobile = "";
			love.loveManage(0);
		});
	}
	this.loveManConfig = function(state) {
		this.actionid = 5;
		this.loveManage(state);
	}
};

//用户配置类
function Config() {
	var config = this;
	//type=1 是否设置了密码;

	this.showConfig = function() {
		Common.postXml({
			url: Common.getUrl("config"),
			data: String.format(PostXML["Config_Xml"], 0, 0, "", ""),
			success: function(result) {
				if (Common.errManage(result, "config") == true) {
					//密码设置初始化 false没有设置密码
					ShowLock(result["var"].showFlag);
					if (result["var"].showFlag == 0) {
						var opt = {
							"label1": "设置安全锁密码：", //第一个密码框标签
							"txtPaswordID": "txtEncryptPwdN", //第一个密码框ID
							"repeatlabel": "再次输入新密码：", //第一个密码框标签
							"txtrepeatPaswordID": "txtEncryptPwdO", //第一个密码框ID            
							"pwdTdLeft": 130,
							"width": 450
						};
						var ob = { "container": document.getElementById("regPassword") };
						Password.bindUI(ob, opt);

						$("#divEncryptDetail").show();
						$("#Navigationbar li:eq(0)").show();
						$("#Navigationbar li:eq(3)").show();
						//shenglan菜单引藏                       
						$("#divDecryptDetail").hide();
						//直接进入短信保存页
						if ($("#hidtset").attr("value") == "1") {
							$("#divEncrypt .rcd-hd li").removeClass("current");
							$("#divEncrypt .rcd-hd li:last-child").addClass("current");
							$("#divEncryptSave").show();
							$("#divEncryptDetail").hide();
						}
					}
					else {
						$("#divEncryptDetail").hide();
						$("#divDecryptDetail").show();
						$("#Navigationbar li:eq(1)").show();
						$("#Navigationbar li:eq(3)").show();
						$("#Navigationbar li:eq(2)").show();
						//直接进入短信保存页
						if ($("#hidtset").attr("value") == "1") {
							$("#divDecrypt .rcd-hd li").removeClass("current");
							$("#divDecrypt .rcd-hd li:last-child").addClass("current");
							$("#divDecryptDetail").hide();
							$("#divChangePassword").hide();
							$("#divDecryptSave").show();
						}
					}
					//短信保存初始化
					$("#divDecrypt input[type=radio]").each(function(i) {
						if (parseInt($(this)[0].value) == result["var"].showSave) {
							$(this).attr("checked", true);
						}
					});
					$("#divEncryptSave input[type=radio]").each(function(i) {
						if (parseInt($(this)[0].value) == result["var"].showSave) {
							$(this).attr("checked", true);
						}
					});
				}
			}
		});
	};
	this.ConfigManage = function(type, issave, npwd, opwd) {
		if (top.Utils.PageisTimeOut(true))
			return;
		Common.postXml({
			url: Common.getUrl("config"), //
			data: String.format(PostXML["Config_Xml"], type, issave, npwd, opwd),
			success: function(result) {
				if (Common.errManage(result, "config") == true) {
					config.resultManage(result, type);
				}
			}
		});
	};
	this.ecrypt = function(npwd, opwd) {
		this.ConfigManage(1, "", npwd, opwd);
	};
	this.decrypt = function(pwd, dectype) {
		this.ConfigManage(dectype, "", unescape(pwd), "");
	};
	this.saveConfig = function(isSave) {
		this.ConfigManage(3, isSave, "", "");
	};
	this.updatePwd = function(npwd, opwd) {
		this.ConfigManage(4, "", npwd, opwd);
	};
	this.editNote = function(isNote) {
		this.ConfigManage(6, isNote, "", "");
	};
	this.resultManage = function(result, type) {
		if (type == 6) {
			return;
		}
		if (type == 2 || type == 5) {
			if (result.code != "S_OK") {
				top.FloatingFrame.alert(result.summary);
			}
			else {
				var path = Common.getQueryString("path");
				if (Common.isEmpty(path)) {
					path = "sms_Record.html";
				}
				window.location = top.M139.Text.Url.getAbsoluteUrl(String.format("/m2012/html/sms/{0}?rnd={1}", path, Math.random()));
			}
		}
		else {
			if (type == 1) {
				if (result.code != "S_OK") {
					top.FloatingFrame.alert(result.summary);
				}
				else {
					top.FloatingFrame.alert(result.summary, function() {
						//设置加锁密码成功，点确定后，进入“短信记录-往来记录”页面 Henry 2010-01-13
						window.location = top.M139.Text.Url.getAbsoluteUrl(String.format("/m2012/html/sms/sms_Record.html?rnd={0}", Math.random()));
					});
				}
			}
			else {
				top.FloatingFrame.alert(result.summary);
			}
		}
	}
};

function CreateInputMobileChecker(inputMobiles, mobileNum, interval) {
	var This = this;
	var checkTimer;
	var oldVal = "";

	function getMoblieByLen(mobileList, len) {
		var mobileVal = "";
		if (mobileList.length == 0) {
			return mobileVal;
		}
		var mbolieLength = 0;
		for (var i = 0; i < mobileList.length; i++) {
			if ($.trim(mobileList[i]).length > 0) {
				mobileVal += mobileList[i] + ",";
				mbolieLength++;
				if (mbolieLength >= len) {
					mobileVal = $.trim(mobileVal, ",");
					break;
				}
			}
		}
		return mobileVal;
	}

	function checkInputMobile() {
		if (!$(inputMobiles).hasClass("input-default") && $.trim($(inputMobiles).val()).length > 0) {
			var mobileVal = $(inputMobiles).val();
			mobileVal = $.trim(mobileVal);
			var regex = /，/gi;
			mobileVal = mobileVal.replace(regex, ",");
			regex = /;/gi;
			mobileVal = mobileVal.replace(regex, ",");
			regex = /；/gi;
			mobileVal = mobileVal.replace(regex, ",");
			mobileVal = $.trim(mobileVal, ",");
			var mobileList = mobileVal.split(",");
			var mbolieLength = 0;
			for (var i = 0; i < mobileList.length; i++) {
				if ($.trim(mobileList[i]).length > 0) {
					mbolieLength++;
				}
			}
			if (mbolieLength > mobileNum) {
				oldVal = getMoblieByLen(mobileList, mobileNum);
				$(inputMobiles).val(oldVal);
				new CommonPage().showError($("#divMobileError"), $("#txtMobile").parent().parent().parent(), "您最多可同时发送给<span class=\"notice_font\">" + mobileNum + "</span>人，请不要超出限制，谢谢！");
				setTimeout(function() {
					This.satrt();
				}
					);
			}
			else {
				oldVal = $(inputMobiles).val();
				This.satrt();
			}
		}
		else {
			This.satrt();
		}
	}

	this.satrt = function() {
		if (checkTimer) {
			clearTimeout(checkTimer);
		}
		checkTimer = setTimeout(checkInputMobile, interval);
	}
}

function CommonPage() {
	var me = this;
	var validateUrl;
	var smsLength = 70;

	//初始化
	CommonPage.prototype.init = function() {
		if (typeof (me.smsLength) != "undefined")
			smsLength = me.smsLength;
	}

	//复制文本
	CommonPage.prototype.copyToClipboard = function(txt) {
		me.init();
		if (window.clipboardData) {
			window.clipboardData.setData("Text", txt);
		}
		else
			if (navigator.userAgent.indexOf("Opera") != -1) {
			window.location = txt;
		}
		else
			if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch (e) {
				top.FloatingFrame.alert(SMSMessage["BrowserSysError"]); //"你使用的FF浏览器,复制功能被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'"
			}
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip)
				return;
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans)
				return;
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			var copytext = txt;
			str.data = copytext;
			trans.setTransferData("text/unicode", str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			if (!clip)
				return false;
			clip.setData(trans, null, clipid.kGlobalClipboard);
		}
	}

	//显示验证码
	CommonPage.prototype.showValidate = function(url) {
		me.init();
		if ($("#trValide").html() != null) {
			if ($("#trValide").hasClass("show-rnd-code")) {
				$("#txtValidate").val(SMSMessage.GetValidateCode);
				$("#txtValidate").addClass("input-default");
				return;
			}
		}
		else
			if ($("#divValidate:visible").html() != null) {
			$("#txtValidate").val(SMSMessage.GetValidateCode);
			$("#txtValidate").addClass("input-default");
			return;
		}
		validateUrl = url;
		me.refreshValidate(url);
		$("#trValide").addClass("show-rnd-code");
		$("#divValidate").show();
		$("#txtValidate").val(SMSMessage.GetValidateCode);
		$("#txtValidate").focus(function() {
			// e.stopPropagation();	// why ?
			if ($(this).val() == SMSMessage.GetValidateCode) {
				$(this).val("");
				$(this).removeClass("input-default");
			}
			$("#trValide").addClass("show-rnd-img");
			$("#divValidateLayer").show();
			$(document).click(function(e) {
				var elem = e.target;
				while(elem && elem.id != "divValidate"){
					elem = elem.parentNode;
				}
				if(!elem || e.target.id == "spanValidate") {
					$(document).unbind("click");
					$("#trValide").removeClass("show-rnd-img");
					$("#divValidateLayer").hide();
				}
			});
		});
		$("#txtValidate").blur(function() {
			if (!$(this).val()) {
				$(this).val(SMSMessage.GetValidateCode);
			}
		});
		$("#aValidate").click(function() {
			me.refreshValidate(url);
			$("#txtValidate").val('');
			return false;
		});
	}

	//显示错误提示
	CommonPage.prototype.showError = function(jqueryErrorObj, jqueryCssObj, errorText) {
		me.init();
		jqueryErrorObj.show();
		jqueryErrorObj.find("Strong").html(errorText);
		jqueryCssObj.addClass("show-tooltip");
		setTimeout(function() {
			jqueryErrorObj.fadeOut("slow", function() {
				jqueryCssObj.removeClass("show-tooltip");
			});
		}, 2000);
	}

	//检查短信字数
	CommonPage.prototype.checkInputWord = function(smsSize, flag, obj) {
		me.init();
		var num = $("#txtContent").attr("value").length;
		$("#pLetterCount em:eq(0)").text(smsLength - num);
		$("#divMoneyTip em:eq(0)").text(num > 350 ? 350 : num);
		var sumNum = (num > 350 ? 350 : num);
		var add = 1;
		if (sumNum % smsSize == 0) {
			add = 0;
		}
		//shenglan
		var mobileList = "";
		if (obj != null) {
			var items = obj.getItems();
			if (items.length > 0) {
				var regMobile = new RegExp(Common.regex);
				var list = $.grep(items, function(n) {
					return n.error ? regMobile.test(me.getFormatMobile(n.allText)) : true;
				});
				mobileList = $.trim(list.join(';')).split(/,|,|;|；/);
			}
		}
		else
			mobileList = $.trim($("#txtMobile").val()).split(/,|,|;|；/);
		var reccount = 0;

		for (i = 0; i < mobileList.length; i++) {
			if (mobileList[i].length > 0) {
				reccount++;
			}
		}
		var mobileCount = reccount; //mobileList.length;
		$("#divMoneyTip em:eq(1)").text(((sumNum / smsSize | 0) + add) * mobileCount);
		$("#pLetterCount em:eq(1)").text($("#divMoneyTip em:eq(1)").text());
		if (num > smsLength) {
			//去掉该汉字
			$("#txtContent").attr("value", $.trim($("#txtContent").attr("value")).substring(0, smsLength));
			if ($("#pLetterCount em:eq(0)").length > 0)
				$("#pLetterCount em:eq(0)").text(0);
			//对象失去焦点，同时弹出(setTimeout是兼容IE检查超出规定字数粘贴的时候焦点blur不了的bug)
			setTimeout(function() {
				$("#txtContent").blur();
				//再去掉一次，防止输入太快前面去的不干净
				$("#txtContent").attr("value", $.trim($("#txtContent").attr("value")).substring(0, smsLength));
				if (flag) {
					var tdObj = $('#trSMSContent').find('td').eq(0).css({ 'position': 'relative' });
					var FTover = new floatTips(tdObj);
					FTover.tips(String.format(SMSMessage["SendMsmCharLenformValid"], smsLength));
					var blinkobj = $('#txtContent').parent();
					RichInputBox.Tool.blinkBox(blinkobj, 'comErroTxt');
					$('#txtContent').bind('focus', function() {
						if (FTover.timeOut) {
							FTover.fadeOut(200);
							clearTimeout(FTover.timeOut);
						}
						$('txtContent').unbind('focus');
					});
				}
				else
					top.FloatingFrame.alert(String.format(SMSMessage["SendMsmCharLenformValid"], smsLength));
			}, 0);
		}
	}

	//绑定分页
	CommonPage.prototype.bindPager = function(jqueryObj, currentPage, totalPage, prev, next) {
		me.init();
		new Common.loadSelectObj(totalPage, currentPage);

		if (totalPage > 1) {
			$(".pager").show();
		}
		else {
			$(".pager").hide();
		}
		//分页处理
		if (currentPage == 1) {
			$(".prev").hide();
		}
		else
			$(".prev").show();

		if (currentPage == totalPage)
			$(".nexts").hide();
		else
			$(".nexts").show();

		$(".nexts").unbind("click");
		$(".prev").unbind("click");

		if (currentPage != 1) {

			$(".prev").bind("click", prev).bind("click", function() {
				me.bindPager(jqueryObj, parseInt(currentPage) - 1, totalPage, prev, next);
			});
		}
		if (currentPage < totalPage) {
			$(".nexts").bind("click", next).bind("click", function() {
				me.bindPager(jqueryObj, parseInt(currentPage) + 1, totalPage, prev, next);
			});
		}
	}

	//获取不重复的手机号码
	CommonPage.prototype.getNoRepeatMobile = function(mobilestr) {
		var result = new Array();
		var mobiles = mobilestr.split(/,|，|;|；/);
		for (i = 0; i < mobiles.length; i++) {
			var isRepeat = false;
			for (j = 0; j < result.length; j++) {
				if (mobiles[i] == result[j].value) {
					isRepeat = true;
					break;
				}
			}
			if (!isRepeat) {
				result.push({
					index: result.length,
					value: mobiles[i]
				});
			}
		}
		var arr = new Array(result.length);
		for (i = 0; i < result.length; i++) {
			arr[i] = result[i].value;
		}
		return arr.join(",");
	}

	//重新格式化手机号码
	CommonPage.prototype.getFormatMobile = function(mobileStr) {
		me.init();
		var arrayList = new Array();
		var regMobile = new RegExp("(<)([\\d|\\+]+)(>)");
		var mobileList = $.trim(mobileStr).split(/,|，|;|；/);
		var mobileCount = mobileList.length;
		for (var i = 0; i < mobileCount; i++) {
			if ($.trim(mobileList[i]).length > 0) {
				var thismobile = $.trim(mobileList[i]);
				if (regMobile.test(thismobile))
					thismobile = regMobile.exec(thismobile)[2];
				if ($.trim(thismobile).length == 11)
					thismobile = "86" + thismobile;
				if (thismobile.length == 14 && thismobile.substr(0, 1) == "+")
					thismobile = thismobile.replace("+", "");
				arrayList.push(thismobile);
			}
		}
		return arrayList.join(",");
	}

	//获取无姓名的手机号码
	CommonPage.prototype.getNoNameMobile = function(mobileStr) {
		me.init();
		var arrayList = new Array();
		var regMobile = new RegExp("(<)([\\w|\\+]+)(>)");
		var mobileList = $.trim(mobileStr).split(/,|，|;|；/);
		var mobileCount = mobileList.length;
		for (var i = 0; i < mobileCount; i++) {
			if ($.trim(mobileList[i]).length > 0) {
				var thismobile = $.trim(mobileList[i]);
				if (regMobile.test(thismobile))
					thismobile = regMobile.exec(thismobile)[2];
				arrayList.push(thismobile);
			}
		}
		return arrayList.join(",");
	}

	//得到带86的手机号码
	CommonPage.prototype.get86Mobile = function(thismobile) {
		me.init();
		var reg = /(<)([\w|\+]+)(>)/;
		var re = new RegExp(reg);
		if (re.test(thismobile)) {
			var c = re.exec(thismobile);
			thismobile = c[2];
		}
		if ($.trim(thismobile).length == 11) {
			thismobile = "86" + thismobile;
		}
		if (thismobile.length == 14 && thismobile.substr(0, 1) == "+") {
			thismobile = thismobile.replace("+", "");
		}
		return thismobile;
	}

	CommonPage.prototype.getNumber = function(text) {
		var mobile = "";
		if (/(?:86)?\d{11}|/.test(text)) {
			if (text.indexOf("<") == -1) {
				mobile = text;
			} else {
				var reg = /<(\d+)>$/;
				var match = text.match(reg);
				if (match) {
					mobile = match[1];
				}
			}
		}
		if (mobile.length == 11) {
			mobile = "86" + mobile;
		}
		return mobile;
	}


	//刷新验证码
	CommonPage.prototype.refreshValidate = function(url) {
		me.init();
		if ($.trim(url).length == 0)
			return;
		validateUrl = url;
		$("#imgValidate").attr("src", validateUrl + Math.random());
		$("#txtValidate").val();
		$("#txtValidate").focus();
	}

	//跳转到超时错误页
	CommonPage.prototype.goErrorPage = function() {
		me.init();
		if (top.Utils.PageisTimeOut(true))
			return;
		return false;
	}
}

function SendPage() {
	var me = this;
	var isLoading = false;
	var currentPageHotShareSmsBar = 1;
	var currentPageSmsListBar = 1;
	var isLoadShareSmsBar = false;
	var isLoadSmsListBar = false;
	var isSearchHotShareSmsBar = false;
	var isNeedLoadShareSms = false;
	var currentFocus = null;
	var validateUrl = "";
	var smsLength = 350;
	var isNote = true;
	var sendLoadData = null;
	var tooltiptextMobile = "可同时发给{0}人,以逗号“,”隔开,支持向移动、联通、电信用户发送！";
	var tooltiptextSearchMobile = "搜索好友...";
	var mobileErrorMsg = "格式错误，格式：13500001111";
	var numberAllOthers = "很抱歉，暂不支持向非移动号码发送短信";
	var htmlNotice = "";
	var templeIdiograph = "";
	var mobilecontrol = null; //手机号码输入组件
	//主要信息是否加载出错
	window.isMainDataLoadError = false;

	this.textAreaElem = document.getElementById("txtContent");

	//初始化
	SendPage.prototype.init = function() {
		if (typeof (me.currentPageHotShareSmsBar) != "undefined")
			currentPageHotShareSmsBar = me.currentPageHotShareSmsBar;
		if (typeof (me.isLoadShareSmsBar) != "undefined")
			isLoadShareSmsBar = me.isLoadShareSmsBar;
		if (typeof (me.currentPageSmsListBar) != "undefined")
			currentPageSmsListBar = me.currentPageSmsListBar;
		if (typeof (me.isLoadSmsListBar) != "undefined")
			isLoadSmsListBar = me.isLoadSmsListBar;
		if (typeof (me.currentFocus) != "undefined")
			currentFocus = me.currentFocus;
		if (typeof (me.validateUrl) != "undefined")
			validateUrl = me.validateUrl;
		if (typeof (me.smsLength) != "undefined")
			smsLength = me.smsLength;
		if (typeof (me.isNote) != "undefined")
			isNote = me.isNote;
		if (typeof (me.sendLoadData) != "undefined")
			sendLoadData = me.sendLoadData;
		if (typeof (me.tooltiptextMobile) != "undefined")
			tooltiptextMobile = me.tooltiptextMobile;
		if (typeof (me.tooltiptextSearchMobile) != "undefined")
			tooltiptextSearchMobile = me.tooltiptextSearchMobile;
		if (typeof (me.mobileErrorMsg) != "undefined")
			mobileErrorMsg = me.mobileErrorMsg;
		if (typeof (me.numberAllOthers) != "undefined")
			numberAllOthers = me.numberAllOthers;
		if (typeof (me.htmlNotice) != "undefined")
			htmlNotice = me.htmlNotice;
		if (typeof (me.templeIdiograph) != "undefined")
			templeIdiograph = me.templeIdiograph;
		if (typeof (me.mobilecontrol) != "undefined")
			mobilecontrol = me.mobilecontrol;

	};

	SendPage.prototype.bindEvent = function(){//add by chenzhuo
		//短信内容输入框绑定事件
		var $textArea = $(this.textAreaElem);

		top.isDoYourselfSms = false;
		$textArea.bind("keydown", function(){//用户只要有按键行为，均认为是自写短信
			top.isDoYourselfSms = true;
		});
	};
	//     
	//短信分享——业务融合  
	SendPage.prototype.LoadShareData = function() {
		var shareMsgId = Utils.getCookie("shareMsgId"); //数据库取值的id
		if (shareMsgId != "") {

			var api = "user:getShareData";
			var data = {
				id: shareMsgId
			};

			var options = {
				onrouter: function (router) {
					router.addRouter("setting", [api]);
				}
			};

			top.$RM.call(api, data, callback, options);
		}

		function callback(result) {
			if (result && result.responseData) {
				result = result.responseData;
				if (result.code === "S_OK") {
					result = result['var'] || {};
					$("#txtContent").insertAtCaret(result.content);
					return true;
				}
			}
			return false;
		}
	}
	SendPage.prototype.getMoibleAndSms = function() {
		var mobilecontrol = this.mobilecontrol;
		var mobiles = [];
		var mails = mobilecontrol.getRightEmails();
		for(var i = 0;i<mails.length;i++){
			mobiles.push(top.$T.Mobile.getNumber(mails[i]));
		}
		var textValue = $("#txtContent").val();
		
		//组装成string
		var data = "mobile="+mobiles.join(",")+"&smscontent="+textValue;
		var sendtime;//定时时间的保存
		if($("#cbxSetTime").attr("checked")){
			sendtime = String.format("{0}-{1}-{2} {3}:{4}:00", $("#sltYear").selectedValues(), $("#sltMonth").selectedValues(), $("#sltDay").selectedValues(), $("#sltHour").selectedValues(), $("#sltMinute").selectedValues());
			data +="&sendDate="+sendtime;
		}
		return "data="+encodeURIComponent(data);
	}

	SendPage.prototype.addBehaviorAndSendSms = function() {
		var thingId_Birthday = 1;
		if (this.id == "btnSmsSendFooter") {
			thingId_Birthday = 2;
		}
		//日志上报
		top.addBehaviorExt({
			actionId: isBirthdayPage ? 30159 : 100366,
			thingId: thingId_Birthday,
			moduleId: 14
		});
		//收信人号码集合，供发送成功页面调用
		window.top.SmsMobileNumberkind = {
			postData: "",
			all: new top.Array(),
			sendData: null
		};
		$("#txtMobile").val("");
		if (isBirthdayPage) {
			var emaillist = [];
			var successMobiles = "";        //已发送生日提醒的列表 号码,日期;13760225650,2011-05-05
			var nodeList = br ? br.getDataList("input[checked=true]") : [];
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
					emaillist.push(mobile); //发送短彩用
					successMobiles += mobile + ",";
					//提醒时间
					arr_DateBirthday = arrBirthday[1].split("-");
					//如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
					if (parseInt(arr_DateBirthday[1]) == 1 && parseInt(arr_DateBirthday[2]) < 11 && parseInt(arr_DateTemp[1]) == 12) {
						successMobiles += (parseInt(arr_DateTemp[0]) + 1).toString();
					}
					else {
						successMobiles += arr_DateTemp[0];
					}
					successMobiles += "-" + arr_DateBirthday[1] + "-" + arr_DateBirthday[2] + ";";
				}

				//保存已发送祝福时用 兼容Web1.0
				top.M139.Text.Cookie.set({
					name: "sucMobiles" + top.UserData.ssoSid,
					value: successMobiles.substr(0, successMobiles.length - 1),
					domain: document.domain
				});
			}
			$("#txtMobile").val(emaillist.join(","));
			nodeList = null;
		}
		else {
			me.SetInputMobileNumbers();
		}
		me.SendSms();
	};

	//设置发送的手机号码
	SendPage.prototype.SetInputMobileNumbers = function () {
		//收信人号码集合，供发送成功页面调用
		if (!window.top.SmsMobileNumberkind) {
			window.top.SmsMobileNumberkind = {
				postData: "",
				all: new top.Array(),
				sendData: null
			};
		};
		var mobiles = objRichInputMobileBox.getItems();
		if (mobiles && mobiles.length > 0) {
			var texts = $.map(mobiles, function(m) {
				return m.allText;
			});
			$("#txtMobile").val(texts.join(";"));
		}
	}

	//加载
	SendPage.prototype.load = function() {
		me.init();
		me.bindEvent();
		//日志上报
		top.addBehaviorExt({
			actionId: 19002,
			thingId: 0,
			moduleId: 14
		});
		var inputTime = Utils.queryString("sendDate");
		if (inputTime) {
			smsState.actionInfo = 1;
			var listType = Utils.queryString("listType");
			if (listType) {
				smsState.listType = listType;
			}
		}
		
		//shenglan
		if (top.Utils.PageisTimeOut(true))
			return;
		$("#txtContent").setCaret();
		$("#txtfocus").focus();
		if (window != window.top) {
			//shenglan
			AddressBook.createTelStyle($("#divLinkManSearch")[0], function(addr) {
				me.mobilecontrol.insertItem(addr);
				me.checkInputWord();
			}, true, false);
			//添加整组记录行为日志
			(function() {
				function addGroupBehavior() {
					var dt = $(this);
					if (dt.attr("isGroupBehavior")) {
						dt.unbind("click", addGroupBehavior);
						return;
					}
					setTimeout(function() {
						var dd = dt.next("dd");
						if (dd.html()) {
							dd.find("a[title='添加整组到接收人']").click(function(e) {
								top.addBehaviorExt({
									actionId: 101881,
									thingId: 0,
									moduleId: 14
								});
							});
							dt.attr("isGroupBehavior", "true");
						}
					}, 500);
				};
				$("dt[rel='addrGroup']").bind("click", addGroupBehavior);
			})();
			/* setTimeout(function() {
			   
			$("dd[gid]", $("#divLinkManSearch")[0]).bind(click)

			}, 2000);*/

			$(".addressList .tab .li1").click();
		}
		//shenglns
		var param = {
			type: "mobile",
			container: document.getElementById("txtMobiles"),
			autoHeight: true,
			autoDataSource: true
		};
		objRichInputMobileBox = new RichInputBox(param);
		objRichInputMobileBox.onresize = function() {
			var list = objRichInputMobileBox.getRightEmails();
			var count = list.length;
			var smsSize = 70;
			if ($("input[name='smstype']:eq(0)").attr("checked")) {
				if ($("#txtContent").attr("value").length > 70)
					smsSize = 67;
			}
			me.checkInputWord(smsSize, count, me.mobilecontrol);
		}
		window.mobilecontrol = me.mobilecontrol = objRichInputMobileBox;

		//处理内容运营的需求
		try {
			if (Utils.queryString("type") == "yyextend") {
				var yyContent = Utils.queryString("smscontent")
				$("#txtContent").val(unescape(yyContent));
			}
		}
		catch (e) { }
		//处理往来记录/定时记录/珍藏记录
		var composeText = Utils.queryString("composeText");
		if (composeText && top[composeText]) {
			$("#txtContent").val(top[composeText]);
		} else {
			var weblink = $().getParmByUrl("weblinkcontent");
			if (typeof ($().getParmByUrl("from")) != "undefined" && ($().getParmByUrl("from") == "2" || $().getParmByUrl("from") == "3")) {
				if (top.SmsContent != null && top.SmsContent != undefined && typeof (weblink) != "undefined") {
					$("#txtContent").val(unescape(top.SmsContent + unescape(weblink)));
				}
				else {
					if (top.SmsContent != null) {
						$("#txtContent").val(unescape(top.SmsContent));
					}
				}
				top.SmsContent = null;
			}
			else {
				var content = Utils.queryString("Content");
				if (typeof (weblink) != "undefined" && typeof (content) != "undefined") {
					$("#txtContent").val(content + unescape(weblink));
				}
				else if (typeof (content) != "undefined") {
					$("#txtContent").val(content);
				}
			}
		}
		if (typeof ($().getParmByUrl("ShareSmsMobile")) != "undefined") {
			$("#txtSearchMobile").val($().getParmByUrl("ShareSmsMobile"));
			$("#txtSearchMobile").removeClass("input-default");
		}
		if (typeof ($().getParmByUrl("serialid")) != "undefined")
			$("#hidSerialId").val($().getParmByUrl("serialid"));
		if (typeof ($().getParmByUrl("settime")) != "undefined") {
			$("#cbxSetTime").attr("checked", true);
			$(this).parent().parent().addClass("show-timer");
			$(".time-st").addClass("show-timer");
			$(".time-st .date-select").css({
				display: "inline"
			});
			$(".time-st .time-select").css({
				display: "inline"
			});
			var d = new Date(parseInt($().getParmByUrl("settime").replace("/Date(", "").replace(")/", "")));
			//start动态年份__Henry 2010-01-11
			$("#sltYear").empty();
			$("#sltYear").append("<option value=\"" + d.getYear() + "\">" + d.getYear() + "</option>");
			$("#sltYear").append("<option value=\"" + (parseInt(d.getYear(), 10) + 1) + "\">" + (parseInt(d.getYear(), 10) + 1) + "</option>");
			//end动态年份
			$("#sltYear").selectOptions(d.getYear() + "");
			$("#sltMonth").selectOptions((d.getMonth() + 1) + "");
			$("#sltDay").selectOptions(d.getDate() + "");
			$("#sltHour").selectOptions(d.getHours() + "");
			var inputTimes = Utils.queryString("sendDate");
			if (!inputTimes) {
				$("#sltMinute").selectOptions(d.getMinutes() + "");
			}
		}

		me.LoadShareData(); //加载短信分享--业务融合
		var content = "";
		var contenttemple = "";
		var currentTabIndex = 2;
		isLoading = true;

		setTimeout(function() {
			if (isLoading)
				top.WaitPannel.show(SMSMessage["SmsLoadDataPrompt"]); //top.WaitPannel.show("数据加载中...");
		}, 1000);
		setTimeout(function() {
			if (isLoading)
				top.$("#contextWaitPannel").html("数据加载中... 太久没响应? 试试<a href=\"javascript:top.document.getElementById('sms').contentWindow.location.reload()\">刷新</a>");
		}, 15000);
		Common.postXml({
			url: Common.getUrl("maindata"),
			data: String.format(PostXML["GetMainData_Xml"], $("#hidSerialId").val(), 0),
			async: false,
			success: function(data) {

				if (data.code == "S_OK") {
					window.isMainDataLoaded = true;
					sendLoadData = data["var"];

					me.idiographList = sendLoadData.idiographList;

					Common.getMaxDayMonthSend(sendLoadData.limitInfo);//提取日月封顶值

					//显示易网号码及资费提示
					//去掉重复的易网号码
					objRichInputMobileBox.change = function() {
						var priceInfo = new Common.priceInfo(sendLoadData);
						var hash = {};
						var number = "";
						var page = new CommonPage();
						$(".error", document.getElementById("txtMobiles")).each(function() {
							number = "";
							if ($(this).html()) {
								number = page.getNumber($(this).html().decode());
							}
							if (!number) { return false };
							if (!hash[number]) {
								hash[number] = this;
							} else {
								$(this).parent().remove();
							}
						});
						//显示易网号码及资费提示
						priceInfo.showTips(function() {
							var count = 0;
							var reg = new RegExp(Common.regex);
							var num = 0;
							for (var key in hash) {
								if (reg.test(key)) {
									num = key.substring(0, 2) == "86" ? key.substring(2, key.length) : key;
									$(hash[key]).css({ color: "#0000ff" }).parent().attr("title", num);
									count++;
								}
							};
							return count;
						});
					}

					//如果设置了加密码的没有解密的弹出验证框
					ShowLock(sendLoadData.isSetPwd);

					$("#doubleEnable").hide();
					top.SendMail = 0;
					top.SendState = 0;
					//end
					//shenglan 新的确定用户的 start        
					objRichInputMobileBox.setTipText(tooltiptextMobile.format(sendLoadData.groupLength));
					me.mobilecontrol = objRichInputMobileBox;
					//url传过来的值
					(function() {
						var inputMobile = Utils.queryString("mobile");
						if (inputMobile) {
							inputMobile = inputMobile.split(",");
							for (var i = 0; i < inputMobile.length; i++) {
								var singleNumber = inputMobile[i];
								if (singleNumber.indexOf("<") != -1) {
									inputMobile[i] = singleNumber;
								} else if (singleNumber) {
									singleNumber = Common.getRecName(singleNumber);
									inputMobile[i] = singleNumber;
								}
							}
							inputMobile = inputMobile.join(",");
							if (inputMobile) {
								//shenglan
								if (me.mobilecontrol) {
									me.mobilecontrol.insertItem(inputMobile.decode());
								}
							}
						}
					})();
					//shenglan end 2010-09-10
					//短信签名
					var html = "";
					if (sendLoadData.idiographList.length > 0) {
						html = html + '<li class="more-act"><i class="i-checked"></i>取消签名</li>';
					}
					var defaultcontent = $("#txtContent").val();
					$.each(sendLoadData.idiographList, function(i, item) {
						if (item.orderno == 1) {
							html += templeIdiograph.format("<i class='i-checked'></i>" + item.name.encode()).replace(/<li>/i, "<li class='checked'>");
							if (defaultcontent.length > 0) {
								if (typeof ($().getParmByUrl("from")) != "undefined" && $().getParmByUrl("from") == "2") {
									$("#txtContent").val(defaultcontent + "【{0}】".format(item.content));
								}
							}
							else {
								$("#txtContent").insertAtCaret("【{0}】".format(item.content));
							}
						} else {
							html += templeIdiograph.format("<i class='i-checked'></i>" + item.name.encode());
						}
					});
					html = html + '<li class="more-act"><i class="i-checked"></i>管理签名</li>';
					$("#dlIdiograph ul").html(html);
					$("#dlIdiograph ul li").hover(function() {
						$(this).addClass("hover");
					}, function() {
						$(this).removeClass("hover");
					});
					$("#dlIdiograph ul li").click(function() {
						var elements = $("#dlIdiograph ul li");
						var selectIndex = elements.index(this);
						if (selectIndex == elements.length - 1) {
							//日志上报
							top.addBehaviorExt({
								actionId: 2158,
								thingId: 1,
								moduleId: 14
							});
							$("#container").hide();
							top.WaitPannel.show(SMSMessage["SmsTitlePrompt"]); //top.WaitPannel.show("跳转中...");
							var params = me.getMoibleAndSms();
							window.location.href = "sms_Idiograph.html?"+params;
							return false;
						}
						else if (selectIndex == 0) {
							elements.removeClass("checked");
							me.SetIdiograph(-1);
						}
						else {
							elements.removeClass("checked").eq(selectIndex).addClass("checked");
							//日志上报
							top.addBehaviorExt({
								actionId: 2158,
								thingId: 2,
								moduleId: 14
							});
							me.deleteIdiographFromeTextArea();
							$("#txtContent").insertAtCaret("【{0}】".format(sendLoadData.idiographList[selectIndex - 1].content)); //因前面有个取消默认签名，所以selectIndex要减1
							$("#dlIdiograph").removeClass("show-drowpdownlist");
							$(document).unbind("mouseup", arguments.callee);
							me.SetIdiograph(sendLoadData.idiographList[selectIndex - 1].serialid);
						}
					});

					if ($("#hidSerialId").val() != "-1") {
						$("#cbxSetTime").attr("checked", true);
						$("#doubleEnable").hide();
						$(this).parent().parent().addClass("show-timer");
						$(".time-st").addClass("show-timer");
						$(".time-st .date-select").css({
							display: "inline"
						});
						$(".time-st .time-select").css({
							display: "inline"
						});
						//处理修改定时短信，接收号码处理
						var recNumber = sendLoadData.recNumber;
						var recNumberWithName = "";
						var arrRec;
						if (!Common.isEmpty(recNumber)) {
							if (recNumber.indexOf(",") != -1) {
								arrRec = recNumber.split(",");
								if (arrRec != undefined && arrRec.length > 0) {
									for (var i = 0; i < arrRec.length; i++) {
										if (!Common.isEmpty(arrRec[i])) {
											if (recNumberWithName.length == 0) {
												recNumberWithName = Common.getRecName(arrRec[i]);
											}
											else {
												recNumberWithName = recNumberWithName + "," + Common.getRecName(arrRec[i]);
											}
										}
									}
								}
							}
							else {
								recNumberWithName = Common.getRecName(recNumber);
							}
							//shenglan
							objRichInputMobileBox.insertItem(recNumberWithName.decode());
						}

					}
					//选择方式
					$("input[name='smstype']").click(me.checkSmsCount);

					var smstypeindex = 0;
					if (sendLoadData.isTime) {
						if (sendLoadData.smsType == 2)
							smstypeindex = 1;
					}
					$("input[name='smstype']:eq(" + smstypeindex + ")").click();

					var sysd = DataParse(sendLoadData.sysDateTime);
					$("#sltYear").empty();
					$("#sltYear").append("<option value=\"" + sysd.year + "\">" + sysd.year + "</option>");
					$("#sltYear").append("<option value=\"" + (parseInt(sysd.year, 10) + 1).toString() + "\">" + (parseInt(sysd.year, 10) + 1).toString() + "</option>");
					//end动态年份
					var d = DataParse(sendLoadData.now);
					$("#sltYear option[text=" + d.year + "]").attr("selected", true);
					$("#sltMonth option[text=" + (d.month + 1) + "]").attr("selected", true);
					var selectDay = d.day;
					if (selectDay && selectDay.toString().length == 1) selectDay = "0" + selectDay;
					$("#sltDay option[value=" + selectDay + "]").attr("selected", true);
					$("#sltHour option[text=" + d.hour + "]").attr("selected", true);
					var inputTimes = Utils.queryString("sendDate");

					if (!inputTimes)
						$("#sltMinute option[text=" + d.min + "]").attr("selected", true);
					$("#sltMonth").change();
					//验证码
					if (sendLoadData.isShowValidImg) {
						new CommonPage().showValidate(sendLoadData.validateUrl);
						validateUrl = sendLoadData.validateUrl;
					}
					//启动手机号码检查器
					new CreateInputMobileChecker("#txtMobile", sendLoadData.groupLength, 300).satrt();
					//提示

					if ($.trim($("#txtMobile").val()).length == 0)
						$("#txtMobile").val(tooltiptextMobile.format(sendLoadData.groupLength));
					if (top.UserData.provCode.toString() == "19")//江苏计费提醒特别
					{
						$("#divMoneyTip").html(htmlNotice.format(sendLoadData.freeInfo.replace("0.0元/条", "0.1元/条")));
					}
					else {
						$("#divMoneyTip").html(htmlNotice.format(sendLoadData.freeInfo));
					}

					$("#spanLimit").html(sendLoadData.limitInfo);
					
					//TODO 设置是否是红名单的cookie值 保存红名单状态到cookie中，免费短信中读取（兼容Web1.0）
					top.M139.Text.Cookie.set({
						name: "isReadUser" + top.UserData.ssoSid,
						value: sendLoadData.isRedUser,
						domain: document.domain
					});
					if (sendLoadData.isRedUser == 1) {
						$("#pRedUserTip").show();
						$("#btnFreeSms").css({
							display: "block"
						});
					}
					//浙江六元套餐
					if (sendLoadData.isLimit == 1) {
						$("#trChooseType").show();
						$("#hidIsLimit").val("1");
						$(".time-st").hide();
						(function() {
							$("input[name='choosetype']").change(function() {
								setFreeTips(this.value);
							});
							function setFreeTips(val) {
								var info = tooltiptextMobile.format(sendLoadData.groupLength);
								if (val == 3) {
									var msg = info.substring(0, info.lastIndexOf(","));
									info = msg ? msg + "！" : info;
								}
								me.mobilecontrol.setTipText(info);
								if (me.mobilecontrol.getItems().length > 0) {
									me.mobilecontrol.clearTipText();
								}
							}
							setFreeTips($("input[name='choosetype']").get(0).value);
						})();
					}
					else {
						$("#hidIsLimit").val("0");
						$("#trChooseType").hide()
						$(".time-st").show();
					}
					//邮箱伴侣(仅广东和辽宁开通邮箱伴侣)
					if (sendLoadData.isUserPartner == 0 && sendLoadData.isSetPartner == 0 && (top.UserData.provCode == 1 || top.UserData.provCode == 7) && sendLoadData.userFreeCount < 1) {
						top.FloatingFrame.open("免费条数已超出", String.format("/m2012/html/sms/sms_showpartner.html?sid={0}&Money={1}&rnd={2}", window.top.UserData.ssoSid, sendLoadData.money, Math.random()), 480, 325);
					}
					showPartnerTip(sendLoadData);
				}
				else {
					top.FloatingFrame.alert(SMSMessage["SmsSendMsgUnknowError"]);
				}
				isLoading = false;
				$("#container").show();
				top.WaitPannel.hide();

				me.checkInputWord();
				var inputTime = Utils.queryString("sendDate");
				if (inputTime) {
					//2010-10-09%09:00
					var d = DataParse(inputTime);
					if (d != null) {
						//year:0,month:0,day:0,hour:0,min:0       
						$("#sltYear option[text=" + d.year + "]").attr("selected", true);
						$("#sltMonth option[text=" + (d.month + 1) + "]").attr("selected", true);
						$("#sltDay option[text=" + d.day + "]").attr("selected", true);
						$("#sltHour option[text=" + d.hour + "]").attr("selected", true);
						$("#sltMinute option[text=00]").attr("selected", true);

						//$("#cbxSetTime").attr("checked", true);
						$(this).parent().parent().addClass("show-timer");
						$(".time-st").addClass("show-timer");
						$(".time-st .date-select").css({
							display: "inline"
						});
						$(".time-st .time-select").css({
							display: "inline"
						});
						smsState.actionInfo = 1;
						var listType = Utils.queryString("listType");
						if (listType) {
							smsState.listType = listType;
						}
					}
				}
			}
		});

		function showPartnerTip(data) {
			if (top.$User.needMailPartner() && isCityForMailPartner()) {
				$("#divMoneyTip").append("<div><a href='javascript:top.$App.show(\"mobile\")'>*开通邮箱伴侣</a>享受更多短信优惠</div>");
				top.BH("partner_guide2");
			}
		}

		// 只在广东、辽宁、贵州3省显示邮箱伴侣运营链接，其它省份去掉邮箱伴侣。
		function isCityForMailPartner(){
			var provCode = top.$User.getProvCode();

			if (provCode == 1 || provCode == 7 || provCode == 10) {
				return true;
			} else {
				return false;
			}
		}

		//事件-----
		//字数检查
		var insObj = null;
		var timer = setInterval(function() {
			if ($("#txtContent").val() != insObj) {
				me.checkInputWord();
				insObj = $("#txtContent").val();
			}
		}, 100);
		var insObj1 = null;
		var timer1 = setInterval(function() {
			if ($("#txtMobile").val() != insObj1) {
				me.checkInputWord();
				insObj1 = $("#txtMobile").val();
			}
		}, 100);

		//shenglan  20100925
		$("#txtMobiles").blur(function() {
			if ($.trim($("#txtMobiles input").val()).length == 0) {
				$("#txtMobiles input").val(tooltiptextMobile.format(sendLoadData.groupLength));
				//shenglan
				objRichInputMobileBox.setTipText(tooltiptextMobile.format(sendLoadData.groupLength));
			}
		}).focus(function() {
			if ($.trim($("#txtMobiles input").val()) == tooltiptextMobile.format(sendLoadData.groupLength)) {
				$("#txtMobiles input").val("");
			}
		});

		//接收手机输入框
		$("#txtMobile").focus(function() {
			if ($.trim($(this).val()) == tooltiptextMobile.format(sendLoadData.groupLength)) {
				$(this).val("");
				$(this).removeClass("input-default");
			}
			$(this).parent().parent().parent().addClass("show-input-tip");
		}).blur(function() {
			if ($.trim($(this).val()).length == 0) {
				$(this).val(tooltiptextMobile.format(sendLoadData.groupLength));
				$(this).addClass("input-default");
			}
			$(this).parent().parent().parent().removeClass("show-input-tip");

			var result = new Array();
			var mobilestr = $.trim($("#txtMobile").val());
			var mobiles = mobilestr.split(/,|，|;|；/);
			for (i = 0; i < mobiles.length; i++) {
				var isRepeat = false;
				for (j = 0; j < result.length; j++) {
					if (new CommonPage().getFormatMobile(mobiles[i]) == new CommonPage().getFormatMobile(result[j].value)) {
						isRepeat = true;
						break;
					}
				}
				if (!isRepeat) {
					result.push({
						index: result.length,
						value: mobiles[i]
					});
				}
			}
			var arr = new Array(result.length);
			for (i = 0; i < result.length; i++) {
				arr[i] = result[i].value;
			}
			$("#txtMobile").val(arr.join(","));
		});
		//选择年份
		$("#sltYear").change(function() {
			Common.getChangeDays();
		});
		//选择月份
		$("#sltMonth").change(function() {
			Common.getChangeDays();
		});

		//选择短信类型的tooltip
		$("input[name='smstype']").click(function(event) {
			me.checkInputWord();
		});

		//短信签名
		$("#dlIdiograph dt").click(function() {
			$("#dlIdiograph").addClass("show-drowpdownlist");
			$(document).bind("mouseup", function() {
				$("#dlIdiograph").removeClass("show-drowpdownlist");
				$(document).unbind("mouseup", arguments.callee);
			});
		});
		//文件快递
		$("#aFileUpload").click(function() {
			top.Links.show('quicklyShare');
		});
		//接收手机输入框焦点
		//shenglan
		$($("input[setvaluehandler]")[0]).focus(function() {
			$(".as-nav li:eq(0)").click();
		});
		//短信内容输入框焦点
		$("#txtContent").focus(function() {
			$(".as-nav li:eq(1)").click();
		});
		//右侧Bar切换
		$(".as-nav li").click(function() {
			$(".as-nav").contents().removeClass("current");
			$(this).addClass("current");
			switch ($("li", ".as-nav").index(this)) {
				case 0:
					$(".addressListContent1").show();
					$(".addressListContent2").hide();
					$(".addressListContent3").hide();

					//日志上报
					top.addBehaviorExt({
						actionId: 2156,
						thingId: 0,
						moduleId: 14
					});
					break;
				case 1:
					currentTabIndex = 1;
					$(".addressListContent1").hide();
					$(".addressListContent2").show();
					$(".addressListContent3").hide();

					//日志上报
					top.addBehaviorExt({
						actionId: 2168,
						thingId: 0,
						moduleId: 14
					});
					break;
			}
		});
		
		//发送修改 shenglan
		$(".btnSmsSend").click(function(){
			me.addBehaviorAndSendSms();
		});

		//实现ctrl+enter 发送短信
		$(document).keypress(function(e) {
			if (e.ctrlKey && e.which == 13 || e.which == 10) {
				me.SetInputMobileNumbers();
				//确认用户的发送短信的方式
				window.SubmitStype = 2;
				me.SendSms();
				document.body.focus();
			}
		});

		me.timingView = new TimingView();
		var scheduleDate = window.location.href.match(/scheduleDate=([^&=]+)/);
		if(scheduleDate) {
			scheduleDate = scheduleDate[1];
			scheduleDate = scheduleDate.replace("%20", " ");
			me.timingView.scheduleDate = scheduleDate;
		}

		// 定时发送按钮绑定事件
		$("#btnSetTimeHeader, #btnSetTimeFooter").bind('click', function(event){
			me.timingView.render(function(){
				me.addBehaviorAndSendSms();
			});
			top.$Event.stopEvent(event);
		});

		// 短信批量导入联系人
		window.importSmsContactDlg = new ImportContactView();

		$("#btnImportSmsContact").click(function(){
			importSmsContactDlg.render();
			top.addBehaviorExt({
				actionId: 104640,
				thingId: 1
			});
		});

		SendPage.prototype.SetIdiograph = function(id) {
			var me = this;
			var actionId = 5;
			if (id > 0) {
				actionId = 4;
			}
			Common.postXml({
				url: Common.getUrl("setidiograph"),
				data: String.format(PostXML["SetIdiograph_Xml"], actionId, id, "", ""),
				success: function(data) {
					if (data.code == "S_OK") {
						id == -1 && me.deleteIdiographFromeTextArea();//取消签名
						top.WaitPannel.show(data.summary);
						setTimeout(function() {
							top.WaitPannel.hide();
						}, 1000);
					}
					else
						top.FloatingFrame.alert(data.summary);
				}
			});
		}

		SendPage.prototype.SendSms = function() {
			if (top.Utils.PageisTimeOut(true)) {
				return;
			}
			var txtMobile = $("#txtMobile");
			//验证手机号是否为空
			if (!$.trim(txtMobile.val())) {
				txtMobile.focus();
				var FTMobileErr = new floatTips($('#trReceive').find('td').eq(0));
				FTMobileErr.tips(SMSMessage.SmsMobileFormatError);
				var objMobileErr = $('div.RichInputBoxLayout').eq(0);
				RichInputBox.Tool.blinkBox(objMobileErr, 'comErroTxt');
				var focusBox = function() {
					FTMobileErr.fadeOut(200);
					if (FTMobileErr.timeOut) {
						FTMobileErr.fadeOut(200);
						clearTimeout(FTMobileErr.timeOut);
					}
					$('#RichInputBoxID input').unbind('focus', focusBox);
				};
				$('#RichInputBoxID input').bind('focus', focusBox);
				return;
			}
			//验证手机号码格式
			var regMobile = new RegExp(Common.regex);
			var mobileList = $.trim(txtMobile.val()).split(/,|，|;|；/);
			var mobiles = [];
			var common = new CommonPage();
			for (var i = 0, len = mobileList.length; i < len; i++) {
				var mobile = common.getFormatMobile(mobileList[i]);
				if (!regMobile.test(mobile)) {
					var FTMobileErr = new floatTips($('#trReceive').find('td').eq(0));
					FTMobileErr.tips(mobileErrorMsg);
					var objMobileErr = $('div.RichInputBoxLayout').eq(0);
					RichInputBox.Tool.blinkBox(objMobileErr, 'comErroTxt');
					var focusBox = function() {
						FTMobileErr.fadeOut(200);
						if (FTMobileErr.timeOut) {
							FTMobileErr.fadeOut(200);
							clearTimeout(FTMobileErr.timeOut);
						}
						$('#RichInputBoxID input').unbind('focus', focusBox);
					};
					$('#RichInputBoxID input').bind('focus', focusBox);
					return;
				}
				mobiles.push(mobile);
			}
			txtMobile.val(mobiles.join(";"));

			//验证短信内容是否为空
			if ($.trim($("#txtContent").val()).length == 0) {
				var tdObj = $('tr.sms-content').find('td').eq(0).css({ 'position': 'relative' });
				var FT = new floatTips(tdObj);
				FT.tips(SMSMessage["SmsSendMsgLenfromValid"]);
				var obj = $('#txtContent').parent();
				RichInputBox.Tool.blinkBox(obj, 'comErroTxt');
				var focusBox = function() {
					if (FT.timeOut) {
						FT.fadeOut(200);
						clearTimeout(FT.timeOut);
					}
					$('txtContent').unbind('focus', focusBox);
				};
				$('#txtContent').bind('focus', focusBox);
				return;
			}

			//判断接收人数是否超过发送人数限制
			if (mobiles.length > sendLoadData.groupLength) {
				var items = objRichInputMobileBox.getItems();
				for (var i = 0, len = items.length; i < len; i++) {
					if (items[i].allText) {
						window.top.SmsMobileNumberkind.all.push(items[i].allText);
					}
				}
				window.top.SmsMobileNumberkind.sendData = sendLoadData;
			}

			//判断赠送条数是否用完
			if ($("#HiddisNote").val() != "1" && $("#hidIsLimit").val() != "1" && sendLoadData.totalFree > 0) {
				var priceCounts = parseInt($("#pLetterCount em:eq(1)").text());
				var otherCounts = $(".error").length;
				var curSendCount = 0;
				//本次总计费条数
				priceCounts = isNaN(priceCounts) ? 0 : priceCounts;
				//本次发送给移动接收人的短信总计费条数
				curSendCount = (priceCounts / mobiles.length) * (mobiles.length - otherCounts);
				if (sendLoadData.userFreeCount < curSendCount) {
					var msg = ['超出免费条数发送的短信将以0.1元/条计费<br>',
					'<div id="divOpenPartner" style="display:none">想获得更多的自写短信优惠赠送吗？',
					'<a id="aSMSOpenPartner" href="javascript:void(0)">邮箱伴侣优惠无限</a></div>'].join("");

					var lastMonth = top.M139.Text.Cookie.get("suspend_smsPriceNotice");

					if((lastMonth|0) == new Date().getMonth()){
						setNoticeAndSendSms(false);
						return ;
					} else {
						top.M139.Text.Cookie.set({
							name:"suspend_smsPriceNotice",
							value: "",
							domain: document.domain,
							expires: new Date(0)
						});
					}

					var dialog = top.$Msg.confirm(msg, function () {
						setNoticeAndSendSms(dialog.$el.find("input:checkbox")[0].checked);
					},
					{
						title:"赠送的免费短信已经发完",
						icon: "warn",
						buttons: ["发 送", "取 消"],
						isHtml:true
					});
					dialog.$el.find("#aSMSOpenPartner").click(function (e) {
						top.$App.show("mobile");
						e.preventDefault();
						dialog.close();
					});
					if (top.UserData.provCode == 1 || top.UserData.provCode == 7){
						dialog.$el.find("#divOpenPartner").show();
					}
					//复选框
					dialog.setBottomTip('<label for="cbxNotice"><input id="cbxNotice" type="checkbox"> 本月不再提醒</label>');
					return ;
				}
			}
			//短信类别
			var smstype = 1;
			if ($("#hidIsLimit").val() == "1") {
				if ($("input[name='choosetype']:eq(0)").attr("checked"))
					smstype = 3;
				if ($("input[name='choosetype']:eq(1)").attr("checked"))
					smstype = 2;
			}
			//发送免费短信
			if (smstype == 3) {
				//新需求20120905
				//免费短信不能发易网号码
				var free6ErrorTips = "";
				if ($(".error").length > 0) {
					free6ErrorTips = SMSMessage.Free6OnlyChinaMobile;
				}
				//是否超过免费条数判断
				if (!free6ErrorTips) {
					var curSendCount = parseInt($("#pLetterCount em:eq(1)").text());
					curSendCount = isNaN(curSendCount) ? 0 : curSendCount;
					if (sendLoadData.userFreeCount < curSendCount) {
						free6ErrorTips = SMSMessage.GreateThenFreeLimit;
					}
				}
				if (free6ErrorTips) {
					var FTMobileErr = new floatTips($('#trReceive').find('td').eq(0));
					FTMobileErr.tips(free6ErrorTips);
					var objMobileErr = $('div.RichInputBoxLayout').eq(0);
					RichInputBox.Tool.blinkBox(objMobileErr, 'comErroTxt');
					var focusBox = function() {
						FTMobileErr.fadeOut(200);
						if (FTMobileErr.timeOut) {
							FTMobileErr.fadeOut(200);
							clearTimeout(FTMobileErr.timeOut);
						}
						$('#RichInputBoxID input').unbind('focus', focusBox);
					}
					$('#RichInputBoxID input').bind('focus', focusBox);
					return;
				}
			}
			me.setNoticeAndSendSms(false);
		}

		//彩字发送
		$(".btnFlashMms").click(function() {
			if (top.Utils.PageisTimeOut(true))
				return;
			$(document).ready(function() {
				//日志上报
				top.addBehaviorExt({
					actionId: 2356,
					thingId: 0,
					moduleId: 14
				});
			});
			var mobile = "";
			//if ($.trim($("#txtMobile").val()) != tooltiptextMobile.format(sendLoadData.groupLength))
				//mobile = $.trim($("#txtMobile").val());

			var mobiles = objRichInputMobileBox.getItems();
			if (mobiles && mobiles.length > 0) {
				var texts = $.map(mobiles, function (m) {
					return m.allText;
				});
				mobile=texts.join(";");
			}

			var flashmmscontent = $("#txtContent").val();
			if (flashmmscontent.length > 70)
				flashmmscontent = flashmmscontent.substr(0, 70);

			top.$App.show("mms", "&urlReplace=mms/mmsSend.html?mobile={0}&Content={1}".format(escape(mobile), escape(flashmmscontent))); //新彩字
		});
		//免费专区
		$("#btnFreeSms").click(function() {
			mb = "";
			if (top.isRichmail) {
				mb = "/sms";
			}
			window.location.href = mb + "/Uploads/Html/FreeSms/index.html?sid=" + window.top.UserData.ssoSid + "&rnd=" + Math.random();
			//return false;
		});

		//from139 show-from-139
		if (top.UserData.provCode == "1" || top.UserData.provCode == "2") {
			$("#dtFrom139").show();
			$("#dtFrom139").hover(function() {
				$(this).parent().addClass("show-from-139");
			}, function() {
				$(this).parent().removeClass("show-from-139");
			});
		}
		else {
			$("#divSign").removeClass("sign-select");
			$("#divSign").addClass("sign-select2");
		}
	};

	//删除签名
	SendPage.prototype.deleteIdiographFromeTextArea = function(){
		var idiographList = this.idiographList;

		for (var i = 0, len = idiographList.length; i < len; i++) {
			SmsList.Util.deleteTextFromTextarea(this.textAreaElem, "【" + idiographList[i].content + "】");
		}
	};

	//设置并发送
	SendPage.prototype.setNoticeAndSendSms = function(hideNotice) {
		me.init();

		var config = new Config();

		if (hideNotice) {
			top.M139.Text.Cookie.set({
				name: "suspend_smsPriceNotice",
				value: new Date().getMonth(),
				domain: document.domain,
				expires: new Date(+new Date() + 31*24*3600000)
			});

		   // config.editNote( $("#HiddisNote").val() );
		}

		//send
		$(".btnSmsSend").attr("disabled", true);
		$(".btnSmsSend").find('span').text("发送中...");

		var smsId = $("#hidSerialId").val();
		var isSmsId = 0;
		if (smsId < 0)
			if ($("#hidSmsContent").val() == $("#txtContent").val()) {
			isSmsId = 2;
			smsId = $("#hidSmsId").val();
		} else {
			if ($("#hidShareSmsContent").val() == $("#txtContent").val()) {
				isSmsId = 1;
				smsId = $("#hidShareSmsId").val();
			}
		}
		var sendtime = "";
		var comefrom = 104;

		if (this.timingView && this.timingView.isScheduleDate) {
			comefrom = 3;
			// String.format("{0}-{1}-{2} {3}:{4}:00", ...);
			sendtime = this.timingView._getDefiniteTime();
			//console.log(sendtime);
		}
		//短信发送类型
		var sendtype = 1;

		if ($("input[name='smstype']:eq(0)").attr("checked"))
			sendtype = 0;
		if ($("#txtContent").attr("value").length > 70)
			sendtype = 1;
		if ($("input[name='smstype']:eq(1)").attr("checked"))
			sendtype = 2;

		//短信类别
		var smstype = 1;
		if ($("#hidIsLimit").val() == "1") {
			if ($("input[name='choosetype']:eq(0)").attr("checked"))
				smstype = 3;
			if ($("input[name='choosetype']:eq(1)").attr("checked"))
				smstype = 2;
		}
		var code = top.encodeXML($("#txtValidate").val());
		if (code == SMSMessage.GetValidateCode)
			code = "";

		//shegnlan modify20101130 双通道
		var doubmsg = $("#cbxSendMsg").attr("checked") ? 1 : 0;
		//shenglan 只post一次数据
		//window.sendFlage=false;                 
		if (!window.sendFlage) {
			window.sendFlage = true;
			var saveRecord = $("#smsRecordAutoSave").attr("checked") ? 1 : 0;
			var postUrl = Common.getUrl("send");
			var sendContent = top.encodeXML($("#txtContent").val()).replace(/\n/ig, "\r\n");	// IOS换行显示
			var postData = String.format(PostXML["Send_Xml"], doubmsg, window.SubmitStype, sendContent, new CommonPage().getFormatMobile($("#txtMobile").val()), comefrom, sendtype, smstype, smsId, isSmsId, sendtime, code, sendLoadData.groupLength, saveRecord);
			window.top.SmsMobileNumberkind.postData = postData;
			//分批发送
			if (window.top.SmsMobileNumberkind.all.length > 0) {
				var sharesmsusernumber = "";
				if (!$("#cbxSetTime").attr("checked") && $("#hidShareSmsId").val().length > 0 && $("#hidShareSmsContent").val() == $("#txtContent").val())
					sharesmsusernumber = "&ShareSmsUsernumber={0}&ShareSmsId={1}".format($("#hidShareSmsUsernumber").val(), $("#hidShareSmsId").val());
				var timeSms = "";
				if (comefrom == 3) {
					timeSms = "&timeSms=1"
				}
				var card = Utils.queryString("vCard");
				card = card ? card : "";
				top.SmsContent = $("#txtContent").val();
				if(top.SmsContent.length > 0){
					//fix: 发送到IOS上不显示换行的问题 (xiaoyu)
					top.SmsContent = top.SmsContent.replace(/\n/ig, "\r\n");
				}
				window.location.href = "http://" + location.host + "/m2012/html/sms/sms_sendbatch.html?sid={0}&vcard={1}{2}{3}&saveRecord={4}".format(top.UserData.ssoSid, card, sharesmsusernumber, timeSms, saveRecord);
				return;
			}
			Common.postXml({
				url: postUrl,
				data: postData,
				success: function(data) {
					$(".btnSmsSend").attr("disabled", false);
					//$(".btnSmsSend").val("发送");
					$(".btnSmsSend").find('span').text("发送");
					if (data.code != "S_TIMEOUT") {
						if (data.code == "S_OK") {
							var sharesmsusernumber = "";
							if (!$("#cbxSetTime").attr("checked") && $("#hidShareSmsId").val().length > 0 && $("#hidShareSmsContent").val() == $("#txtContent").val())
								sharesmsusernumber = "&ShareSmsUsernumber={0}&ShareSmsId={1}".format($("#hidShareSmsUsernumber").val(), $("#hidShareSmsId").val());
							var timeSms = "";
							if (comefrom == 3) {
								timeSms = "&timeSms=1"
							}
							else {
								//更新首页条数
								//top.GlobalEvent.broadcast("sms_send", -parseInt($("#divMoneyTip em:eq(1)").html()));
								top.$App.trigger("sms_send", { count: parseInt($("#divMoneyTip em:eq(1)").html()) });
							}
							//发送电子名片成功行为上报
							var vCard = Utils.queryString("vCard");
							if (vCard) {
								if (vCard == 'myVcard') top.addBehavior("我的电子名片页-短信发送成功");
								else if (vCard == 'contactVcard') top.addBehavior("联系人的电子名片页-短信发送成功");
							}
							//跳转到成功页
							top.SmsContent = $("#txtContent").val();
							if(top.SmsContent.length > 0){
								//fix: 发送到IOS上不显示换行的问题 (xiaoyu)
								top.SmsContent = top.SmsContent.replace(/\n/ig, "\r\n");
							}
							window.location.href = "http://" + location.host + "/m2012/html/sms/sms_Success.html?sid={0}&mobiles={1}{2}{3}&saveRecord={4}".format(window.top.UserData.ssoSid, new CommonPage().getNoNameMobile($("#txtMobile").val()), sharesmsusernumber, timeSms, saveRecord);
							return false;
						}
						else {
							//如果缓存过期重新加载短信发送页面shenglan mobile20101118
							data["var"] = data["var"] ? data["var"] : {};
							data["var"].cacheExist = typeof (data["var"].cacheExist) != "undefined" ? data["var"].cacheExist : "";
							data["var"].validateUrl = typeof (data["var"].validateUrl) != "undefined" ? data["var"].validateUrl : "";
							if (data["var"] && data["var"].cacheExist && data["var"].cacheExist == 1) {
								window.location.reload();
							}
							else {
								if (data.summary == "错误的图片验证码，请重试！" || data.summary == "请输入验证码" || data["var"].validateUrl.length > 1) {
									new CommonPage().showValidate(data["var"].validateUrl);
								}
								window.sendFlage = false;
								new CommonPage().refreshValidate(data["var"].validateUrl);
								//日月封顶提示
								if (top.SiteConfig.comboUpgrade) {
									if (data.code ==  "SMS_DATE_LIMIT") {//日封顶
										Common.tipMaxDayMonthSend();
										return;
									} else if (data.code == "SMS_MONTH_LIMIT") {//月封顶
										Common.tipMaxDayMonthSend(true);
										return;
									}
								}
								if (isBirthdayPage && data.code == "SMS_SEND_RECEIVER_BLANK") {
									top.FloatingFrame.alert("请选择接收祝福的好友");
								}
								else { //提示
									var FT, obj, input;
									if (data.summary == '错误的图片验证码，请重试！') {
										FT = new floatTips($('#trValide').find('td').eq(0));
										obj = $('#txtValidate');
										input = $('#txtValidate');
									} else {
										FT = new floatTips($('#trReceive').find('td').eq(0));
										obj = $('#txtMobiles').find('div.RichInputBoxLayout').eq(0);
										input = $('#RichInputBoxID input');
									}
									if (data.summary == '请输入接收人。') {
										FT.tips('请填写接收手机'); //修改提示语！！！！！
									} else {
										FT.tips(data.summary);
									}
									RichInputBox.Tool.blinkBox(obj, 'comErroTxt');
									input.bind('focus', function() {
										FT.fadeOut(200);
										if (FT.timeOut) {
											FT.fadeOut(200);
											clearTimeout(FT.timeOut);
										}
									});
								}
							}
						}
					} else {
						window.sendFlage = false;
						new CommonPage().goErrorPage();
					}
				}
			});
		}
	}

	//检查字数
	SendPage.prototype.checkInputWord = function() {
		me.init();
		var commonPage = new CommonPage();
		commonPage.smsLength = 350;
		var smsSize = 70;
		if ($("input[name='smstype']:eq(0)").attr("checked")) {
			if ($("#txtContent").attr("value").length > 70)
				smsSize = 67;
		}
		if (isBirthdayPage) {
			if ((typeof BirthdayCheckWord) == 'function') {
				BirthdayCheckWord();
			}
		}
		else {
			commonPage.checkInputWord(smsSize, 1, me.mobilecontrol);
		}
	}
}

function IdiographPage() {
	var me = this;
	var htmlIdiographHeader = "";
	var templeIdiographItem = "";
	var htmlEditIdiograph = "";
	var htmlDeleteIdiograph = "";

	this.userIdiograph = {}; // 用户设置的签名

	//初始化
	IdiographPage.prototype.init = function() {
		if (typeof (me.htmlIdiographHeader) != "undefined")
			htmlIdiographHeader = me.htmlIdiographHeader;
		if (typeof (me.templeIdiographItem) != "undefined")
			templeIdiographItem = me.templeIdiographItem;
		if (typeof (me.htmlEditIdiograph) != "undefined")
			htmlEditIdiograph = me.htmlEditIdiograph;
		if (typeof (me.htmlDeleteIdiograph) != "undefined")
			htmlDeleteIdiograph = me.htmlDeleteIdiograph;
	}
	//加载
	IdiographPage.prototype.load = function() {
		me.init();
		me.loadIdiograph();
		$("#btnAddIdiograph").click(function () {
			var msg = ['<table cellpadding="0">',
			'<tr>',
				'<th style="width:80px;text-align:right;padding-top: 10px;">签名标题：</th>',
				'<td style="padding-top: 10px;"><span><input style="width:250px" id="txtTitle" type="text" maxlength="32" /></span></td>',
			'</tr>',
			'<tr>',
				'<th style="width:80px;text-align:right;">签名内容：</th>',
				'<td>',
				'<div><textarea style="width:250px;height:150px;margin-top:10px" id="txtContent"></textarea></div>',
				'</td>',
			'</tr>',
			'</table>'].join("");
			var dialog = top.$Msg.showHTML(msg, function () {
				saveIdiograph(0, dialog.$el.find("#txtTitle").val(), dialog.$el.find("#txtContent").val());
			}, {
				dialogTitle: "添加短信签名",
				buttons: ["确 定", "取 消"],
				width: 350,
				height:200
			});
		});
		//加上前一个页面的内容 wx
		var params = Utils.queryString("data");
		$(".back").attr('href',"");

		$(".back").bind('click',function(){
			window.location.href = "sms_send.html?type=yyextend&"+params;
			return false;
		});
	   
	}
	//加载短信签名
	IdiographPage.prototype.loadIdiograph = function() {
		me.init();
		top.WaitPannel.hide();
		top.WaitPannel.show(SMSMessage["SmsLoadDataPrompt"]);
		Common.postXml({
			url: Common.getUrl("setidiograph"),
			data: String.format(PostXML["SetIdiograph_Xml"], 0, 0, "", ""),
			success: function(data) {
				if (data.code == "S_OK") {
					ShowLock(data["var"].isSetPwd);
					//短信签名
					var html = "";
					me.userIdiograph = data["var"].table;

					$.each(me.userIdiograph, function(i, item) {
						html = html + templeIdiographItem.format(item.serialId, item.name.encode(), item.content.encode());
					});
					html = htmlIdiographHeader + html;
					$("#tbIdiograph").html(html);
					$("#tbIdiograph .t-action-edit").click(function() {
						var index = $("tr", "#tbIdiograph").index($(this).parent().parent().parent().parent()) - 1;
						var title = data["var"].table[index].name;
						var content = data["var"].table[index].content;
						var msg = ['<table cellpadding="0">',
						'<tr>',
							'<th style="width:80px;text-align:right;padding-top: 10px;">签名标题：</th>',
							'<td style="padding-top: 10px;"><span><input style="width:250px" id="txtTitle" type="text" maxlength="32" /></span></td>',
						'</tr>',
						'<tr>',
							'<th style="width:80px;text-align:right;">签名内容：</th>',
							'<td>',
							'<div><textarea style="width:250px;height:150px;margin-top:10px" id="txtContent"></textarea></div>',
							'</td>',
						'</tr>',
						'</table>'].join("");
						var dialog = top.$Msg.showHTML(msg, function () {
							saveIdiograph(data["var"].table[index].serialId, dialog.$el.find("#txtTitle").val(), dialog.$el.find("#txtContent").val());
						}, {
							dialogTitle: "编辑短信签名",
							buttons: ["确 定", "取 消"],
							width: 350,
							height: 200
						});
						dialog.$el.find("#txtTitle").val(title);
						dialog.$el.find("#txtContent").val(content);
					});
					$("#tbIdiograph .t-action-del").click(function () {
						var id = $(this).parent().parent().parent().parent().attr("id");
						top.$Msg.confirm("您确定要删除此条短信签名吗？", function () {
							deleteIdiograph(id);
						}, {
							icon:"warn"
						});
					});
				}
				else
					top.FloatingFrame.alert(data.summary);

				$("#container").show();
				top.WaitPannel.hide();
			}
		});
	}

	//保存短信签名
	IdiographPage.prototype.saveIdiograph = function(id, title, content) {
		me.init();
		if ($.trim(title).length == 0 || $.trim(content).length == 0) {
			setTimeout(function() { top.FloatingFrame.alert(SMSMessage["SmsSignatureformValid"]); }, 0);
			return false;
		}
		if ($.trim(title).length > 32) {
			setTimeout(function() { top.FloatingFrame.alert(SMSMessage["SmsSignatureTitleValid"]); }, 0);
			return false;
		}
		if ($.trim(content).length > 30) {
			setTimeout(function() { top.FloatingFrame.alert(SMSMessage["SmsSignatureLenformValid"]); }, 0);
			return false;
		}
		if (me.isRepeatTitle(title)) {
			setTimeout(function() { top.FloatingFrame.alert(SMSMessage["SmsIdiographExist"]); }, 0);
			return false;
		}
		var actionId = 1;
		if (id > 0) {
			actionId = 2;
		}
		Common.postXml({
			url: Common.getUrl("setidiograph"),
			data: String.format(PostXML["SetIdiograph_Xml"], actionId, id, Common.toTxt(title), Common.toTxt(content)),
			success: function(data) {
				if (data.code == "S_OK") {
					top.FloatingFrame.alert(SMSMessage["SmsSignatureLenSuccess"]);
					me.loadIdiograph();
				}
				else
					top.FloatingFrame.alert(data.summary);
			}
		});
	}

	// 用户是否输入了重复的签名标题
	IdiographPage.prototype.isRepeatTitle = function (title) {
		var userIdiograph = this.userIdiograph;

		for (var i = 0, len = userIdiograph.length; i < len; i++) {
			var item = userIdiograph[i];
			if (item.name == title) {
				return true;
			}
		}

		return false;
	}

	//删除短信签名
	IdiographPage.prototype.deleteIdiograph = function(id) {
		if (top.Utils.PageisTimeOut(true))
			return;
		me.init();
		Common.postXml({
			url: Common.getUrl("setidiograph"),
			data: String.format(PostXML["SetIdiograph_Xml"], 3, id, "", ""),
			success: function(data) {
				if (data.code == "S_OK") {
					me.loadIdiograph();
				}
				else
					top.FloatingFrame.alert(data.summary);
			}
		});
	}
}

//shenglan 特加入情侣短信的时间类别
window.dataType = 0;

function LoverPage() {
	var me = this;
	var currentPageLoverSms = 1;
	var currentTypeLoverSms = 0;
	var tooltiptextSearch = "查找情侣短信";
	var templeLoveSmsTa = "";
	var templeLoveSmsMe = "";
	var htmlDeleteLoveSms = "";
	var currentFocus = null;

	//初始化
	LoverPage.prototype.init = function() {
		if (typeof (me.currentPageLoverSms) != "undefined")
			currentPageLoverSms = me.currentPageLoverSms;
		if (typeof (me.currentTypeLoverSms) != "undefined")
			currentTypeLoverSms = me.currentTypeLoverSms;
		if (typeof (me.tooltiptextSearch) != "undefined")
			tooltiptextSearch = me.tooltiptextSearch;
		if (typeof (me.templeLoveSmsTa) != "undefined")
			templeLoveSmsTa = me.templeLoveSmsTa;
		if (typeof (me.templeLoveSmsMe) != "undefined")
			templeLoveSmsMe = me.templeLoveSmsMe;
		if (typeof (me.htmlDeleteLoveSms) != "undefined")
			htmlDeleteLoveSms = me.htmlDeleteLoveSms;
		if (typeof (me.currentFocus) != "undefined")
			currentFocus = me.currentFocus;
	}

	//加载
	LoverPage.prototype.load = function() {
		me.init();
		//加载-----
		top.WaitPannel.hide();
		top.WaitPannel.show(SMSMessage["SmsLoadDataPrompt"]);
		if (top.Utils.PageisTimeOut(true))
			return;

		$(".showpagesize").change(function() {
			var obj;
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].selected == true) {
					obj = this.options[i].text;
				}
			}
			$(".showpagesize").each(function() {

				for (var i = 0; i < this.options.length; i++) {
					if (this.options[i].text == obj)
						this.options[i].selected = true;
				}
			});
			me.loadLoverSms(1);
		});

		$(".selepage").change(function() {

			var pageindex = $(this).val();
			opageIndex = parseInt(pageindex);
			currentPageLoverSms = opageIndex;
			me.loadLoverSms(currentPageLoverSms);
		});
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], 5, "", "", 0, "", currentPageLoverSms, Common.getPageSize(), currentTypeLoverSms, 0),
			success: function(data) {
				$("#container").show();
				top.WaitPannel.hide();
				if (data.code != "S_OK") {
					top.FloatingFrame.alert(data.summary);
					return;
				}
				var html = "";
				if (data["var"].isSetPwd == 1 && data["var"].isDecrypt == 0) {
					window.location = "sms_setting.html?isShow=1&path=sms_lover.html&rnd=" + Math.random();
					return false;
				}
				ShowLock(data["var"].isSetPwd);
				//shenglan当记录数据为0时隐藏相应UI
				if (data["var"].pageCount == 0) {
					$(".record").hide();
					$(".btnDel").hide();
					$("#pagecount").html("0");
					$(".pager").hide();
					$("#divLoveList").hide();
					$(".rcd-table").hide();
					if (data["var"].loveMan == "") {
						$(".sms-list-null").hide();
						$(".hd1").show();
						$("#spaddcontent").show();
					}
					else {
						$("#siderInfo").show();
						$("#spanlove").text(data["var"].loveMan);
						$("#actionType").text("撤销");
						$(".sms-list-null").show();
						$(".hd1").hide();
					}
					$(".record-hd").show();
					return;
				}
				if (data["var"].pageCount == 1)
					$(".selepage").hide();
				$("#pagecount").text(data["var"].records);
				if (data["var"].loveMan == "") {
					$("#siderInfoLover").show();
					$("#spaddcontent").hide();
				}
				else {
					$("#siderInfo").show();
					$("#spanlove").text(data["var"].loveMan);
					$("#actionType").text("撤销");
				}

				//绑定分页
				$(".pager").show();
				$(".rcd-table").show();
				$(".btnDel").show();
				new CommonPage().bindPager($(".pager"), currentPageLoverSms, data["var"].pageCount, function() {
					if (currentPageLoverSms == 1)
						currentPageLoverSms = 1;
					else
						currentPageLoverSms--;
					me.loadLoverSms();
				}, function() {
					if (currentPageLoverSms == data["var"].pageCount)
						currentPageLoverSms = data["var"].pageCount;
					else
						currentPageLoverSms++;
					me.loadLoverSms();
				});
				$.each(data["var"].table, function(i, item) {
					if (item.sex == 2) {
						html = html + String.format(templeLoveSmsTa, Common.getFullTime(item.createTime), item.content.replace('[发自139邮箱]', '').encode().replace(/\n/g, "<br/>"), i, item.seqNo);
					} else {
						html = html + String.format(templeLoveSmsMe, Common.getFullTime(item.createTime), item.content.replace('[发自139邮箱]', '').encode().replace(/\n/g, "<br/>"), i, item.seqNo);
					}
				});
				;
				$("#divLoveList").html(html);
				$("#divLoveList").show();
				$(".sms-list-null").hide();
				$(".record").show();

				//发、删、珍藏
				$(".t-action a").click(function() {
					var index = $(this).parent().attr("id").replace("divLoveSms_", "");
					switch ($(this).text()) {
						case "发送":
							window.location.href = String.format("sms_send.html?sid={0}&Content={1}&rnd={2}", window.top.UserData.ssoSid, escape(data["var"].table[index].content.replace('[发自139邮箱]', '')), Math.random());
							return false;
						case "删除":
							top.$Msg.confirm("您确定要删除此条短信记录吗？", function () {
								deleteLoveSms(data["var"].table[index].seqNo);
							}, { icon: "warn" });
							break;
						case "珍藏":
							top.SmsContent = data["var"].table[index].content;
							top.FloatingFrame.open("短信存到珍藏记录", String.format("/m2012/html/sms/sms_SaveSmsToBox.html?sid={0}&type=1&rnd={1}", window.top.UserData.ssoSid, Math.random()), 440, 280);
							break;
					}
				});

				//回车搜索
				$(document).keydown(function(event) {
					if (event.which == 13 && currentFocus != null && currentFocus.attr("id") == "txtSearch" && !$("#txtSearch").hasClass("input-default")) {
						if ($.trim($("#txtSearch").val()).length == 0)
							top.FloatingFrame.alert(SMSMessage["LookupKeyError"]); //top.FloatingFrame.alert("请输入查询关键字!");
						else
							me.loadLoverSms();
					}
				});
			}
		});

		//事件-----
		$("#aFileUpload").click(function() {
			top.Links.show('quicklyShare');
		});
		//选择时间段
		$("#dlDateFilter dt").click(function() {
			$("#dlDateFilter").addClass("show-drowpdownlist");
			$(document).bind("mouseup", function() {
				$("#dlDateFilter").removeClass("show-drowpdownlist");
				$(document).unbind("mouseup", arguments.callee);
			});
		});
		$("#dlDateFilter dd ul li").hover(function() {
			$(this).addClass("hover");
		}, function() {
			$(this).removeClass("hover");
		});
		//shenglan
		$("#dlDateFilter dd ul li").click(function() {

			//样式增加shenglan
			$("#dlDateFilter dd ul li").removeClass("current");
			$(this).addClass("current");
			var dateTypeNew = $(this).text();
			$("#dlDateFilter").attr("timeinfo", dateTypeNew);
			var index = $("#dlDateFilter ul li").index(this);
			pageindex: currentPageLoverSms = 1;
			switch ($("li", "#dlDateFilter dd ul").index($(this))) {
				case 0:
					currentTypeLoverSms = 0;
					break;
				case 1:
					currentTypeLoverSms = 3;
					break;
				case 2:
					currentTypeLoverSms = 2;
					break;
				case 3:
					currentTypeLoverSms = 1;
					break;
				default:
					currentTypeLoverSms = 0;
					break;
			}
			window.dataType = currentTypeLoverSms;
			me.loadLoverSms();
		});

		//搜索输入框
		$("#txtSearch").focus(function() {
			currentFocus = $(this);
			if ($.trim($(this).val()) == tooltiptextSearch) {
				$(this).val("");
				$(this).removeClass("input-default");
			}
		}).blur(function() {
			currentFocus = null;
			if ($.trim($(this).val()).length == 0) {
				$(this).val(tooltiptextSearch);
				$(this).addClass("input-default");
			}
		});
		//搜索按钮
		$("#btnSearchByKeyWord").click(function() {
			me.loadLoverSms();
			$(document).ready(function() {
				//日志上报
				top.addBehaviorExt({
					actionId: 20010,
					thingId: 0,
					moduleId: 14
				});
			});
		});
	  
	}

	//加载情侣短信列表
	LoverPage.prototype.loadLoverSms = function(currentindex) {
		if (top.Utils.PageisTimeOut(true))
			return;
		me.init();

		if (typeof (currentindex) != 'undefined')
			currentPageLoverSms = currentindex;

		var loveKeyword = "";
		if ($.trim($("#txtSearch").val()).length > 0 && !$("#txtSearch").hasClass("input-default")) {
			loveKeyword = $.trim($("#txtSearch").val());
		}
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], "", "", top.encodeXML(loveKeyword), 0, "", currentPageLoverSms, Common.getPageSize(), currentTypeLoverSms, 0),
			success: function(data) {
				$("#divLoveList").html("");
				var html = "";
				if (data["var"].pageCount == 0) {
					$("#pagecount").html("0");
					$(".pager").hide();
					$("#divLoveList").hide();
					$(".rcd-table").hide();
					$(".record").hide();
					$(".btnDel").hide();
					if (data["var"].loveMan == "") {
						$("#spaddcontent").show();
						$(".sms-list-null").hide();
						$("#siderInfoLover").hide();
					}
					else {
						$(".sms-list-null").show();
						$("#siderInfoLover").hide();
						$("#spaddcontent").hide();
					}
					$(".record-hd").show();
					return;
				}
				else {
					$("#pagecount").html(data["var"].records);
					if (data["var"].pageCount == 1)
						$(".selepage").hide();
					else
						$(".selepage").show();

					$(".hd1").show();

					if (data["var"].loveMan == "") {
						$("#siderInfoLover").show();
						$("#spaddcontent").hide();
					}
					else {
						$("#spaddcontent").hide();
					}

					//绑定分页
					new CommonPage().bindPager($(".pager"), currentPageLoverSms, data["var"].pageCount, function() {
						if (currentPageLoverSms == 1)
							currentPageLoverSms = 1;
						else
							currentPageLoverSms--;
						me.loadLoverSms();
					}, function() {
						if (currentPageLoverSms == data["var"].pageCount)
							currentPageLoverSms = data["var"].pageCount;
						else
							currentPageLoverSms++;
						me.loadLoverSms();
					});

					$(".record").show();
					$(".pager").show();
					$(".showpagesize").show();

					$.each(data["var"].table, function(i, item) {

						if (item.sex == 2)
							html = html + String.format(templeLoveSmsTa, Common.getFullTime(item.createTime), item.content.replace('[发自139邮箱]', '').encode().replace(/\n/g, "<br/>"), i, item.seqNo);
						else
							html = html + String.format(templeLoveSmsMe, Common.getFullTime(item.createTime), item.content.replace('[发自139邮箱]', '').encode().replace(/\n/g, "<br/>"), i, item.seqNo);
					});

					$("#divLoveList").html(html);
					$("#divLoveList").show();
					$(".sms-list-null").hide();

					$(".chkSelectAllDown").text("全选");

					//发、删、珍藏
					$(".t-action a").click(function() {
						var index = $(this).parent().attr("id").replace("divLoveSms_", "");
						switch ($(this).text()) {
							case "发送":
								window.location.href = String.format("sms_send.html?sid={0}&Content={1}&rnd={2}", window.top.UserData.ssoSid, escape(data["var"].table[index].content.replace('[发自139邮箱]', '')), Math.random());
								return false;
							case "删除":
								top.$Msg.confirm("您确定要删除此条短信记录吗？", function () {
									deleteLoveSms(data["var"].table[index].seqNo);
								}, { icon: "warn" });
								break;
							case "珍藏":
								top.SmsContent = data["var"].table[index].content;
								top.FloatingFrame.open("短信到珍藏夹", String.format("/m2012/html/sms/sms_SaveSmsToBox.html?sid={1}&type=1&rnd={2}", window.top.UserData.ssoSid, Math.random()), 440, 280);
								break;
						}
					});
				}
			}
		});
	}

	//删除情侣短信
	LoverPage.prototype.deleteLoveSms = function(id) {
		if (top.Utils.PageisTimeOut(true))
			return;
		me.init();
		Common.postXml({
			url: Common.getUrl("loveroom"),
			data: String.format(PostXML["LoveRoom_Xml"], 3, id, "", 0, "", 1, 10, "", 0),
			success: function(data) {
				if (data.code == "S_OK") {
					top.FloatingFrame.alert(SMSMessage["DelSmsSignatureSuccess"]); //top.FloatingFrame.alert("删除成功");
					me.loadLoverSms();
				}
				else
					top.FloatingFrame.alert(data.summary);
			}
		});
	}
}

//工具类js shenglan20100927
SmsList = {};
SmsList.Util = {
	//的到样式值
	getStyle: function(elem, name) {
		if (elem.style[name])
			return elem.style[name];
		else if (elem.currentStyle)
			return elem.currentStyle[name];
		else if (document.defaultView && document.defaultView.getComputedStyle) {
			name = name.replace(/(A-Z)/g, "-$1");
			name = name.toLowerCase();

			var s = document.defaultView.getComputedStyle(elem, " ");
			return s && s.getPropertyValue(name);
		} else
			return null;
	},
	//相对于整个文档的X和Y值
	GetPageX: function(elem) {
		return elem.offsetParent ? elem.offsetLeft + SmsList.Util.GetPageX(elem.offsetParent) : elem.offsetLeft;
	},
	GetPageY: function(elem) {
		return elem.offsetParent ? elem.offsetTop + SmsList.Util.GetPageY(elem.offsetParent) : elem.offsetTop;
	},
	//找出相对于父原素的x,y值
	GetParentX: function(elem) {
		return elem.parentNode == elem.offsetParent ?
			elem.offsetLeft : SmsList.Util.GetPageX(elem) - SmsList.Util.GetPageY(elem.parentNode);
	},
	GetParentY: function(elem) {
		return elem.parentNode == elem.offsetParent ?
			elem.offsetTop : SmsList.Util.GetPageY(elem) - SmsList.Util.GetPageY(elem.parentNode);
	},
	//全局的设置元素的位置
	SetX: function(elem, pos) {
		elem.style.left = pos + "px";
	},
	SetY: function(elem, pos) {
		elem.style.top = pos + "px";
	},
	//的到高度
	GetHeight: function(elem) {
		return parseInt(SmsList.Util.getStyle(elem, 'height'));
	},
	//的到宽度
	GetWidht: function(elem) {
		return parseInt(SmsList.Util.getStyle(elem, 'width'));
	},
	//元素隐藏也能的到高度和宽度
	fullHeight: function(elem) {
		if (SmsList.Util.getStyle(elem, 'display') != 'none')
			return elem.offsetHeight || SmsList.Util.GetHeight(elem);
		var old = resetCSS(elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		var h = elem.clientHeight || SmsList.Util.GetHeight(elem);
		SmsList.Util.resetCSS(elem, old);
		return h;
	},
	fullWidth: function(elem) {
		if (SmsList.Util.getStyle(elem, 'display') != 'none')
			return elem.offsetWidth || SmsList.Util.GetWidth(elem);
		var old = SmsList.Util.resetCSS(elem, {
			display: '',
			visibility: 'hidden',
			position: 'absolute'
		});
		var w = elem.clientWidth || SmsList.Util.GetWidth(elem);
		SmsList.Util.restoreCSS(elem, old);
		return w;
	},
	resetCSS: function(elem, prop) {
		var old = {};
		for (var i in prop) {
			old[i] = elem.style[i];
			elem.style[i] = prop[i];
		}
		return old;
	},
	restoreCSS: function(elem, prop) {
		for (var i in prop) {
			elem.style[i] = prop[i];
		}
	},
	pageHeight: function() {
		return document.body.scrollHeight;
	},
	pageWith: function() {
		return document.body.scrollWidth;
	},
	deleteTextFromTextarea: function (elem, text) {
		var value = elem.value;
		elem.value = value.replace(new RegExp(text.replace(/[\\\$\^\.\?\*\+\(\)\[\]\{\}]/g, "\\$&")), "");
	}
};

//end shenglan

jQuery.fn.getParmByUrl = function(o) {
	var url = window.location.toString();
	var tmp;
	if (url && url.indexOf("?")) {
		var arr = url.split("?");
		var parms = arr[1];
		if (parms && parms.indexOf("&")) {
			var parmList = parms.split("&");
			jQuery.each(parmList, function(key, val) {
				if (val && val.indexOf("=")) {
					var parmarr = val.split("=");
					if (o) {
						if (typeof (o) == "string" && o == parmarr[0]) {
							tmp = parmarr[1] == null ? '' : parmarr[1];
						}
					}
					else {
						tmp = parms;
					}
				}
			});
		}
	}
	return tmp;
}

jQuery.extend({
	/**  
	* 清除当前选择内容  
	*/
	unselectContents: function() {
		if (window.getSelection)
			window.getSelection().removeAllRanges();
		else if (document.selection)
			document.selection.empty();
	}
});
jQuery.fn.extend({
	/**  
	* 选中内容  
	*/
	selectContents: function() {
		$(this).each(function(i) {
			var node = this;
			var selection, range, doc, win;
			if ((doc = node.ownerDocument) &&
				(win = doc.defaultView) &&
				typeof win.getSelection != 'undefined' &&
				typeof doc.createRange != 'undefined' &&
				(selection = window.getSelection()) &&
				typeof selection.removeAllRanges != 'undefined') {
				range = doc.createRange();
				range.selectNode(node);
				if (i == 0) {
					selection.removeAllRanges();
				}
				selection.addRange(range);
			}
			else if (document.body &&
					 typeof document.body.createTextRange != 'undefined' &&
					 (range = document.body.createTextRange())) {
				range.moveToElementText(node);
				range.select();
			}
		});
	},
	/**  
	* 初始化对象以支持光标处插入内容  
	*/
	setCaret: function() {
		if (!$.browser.msie) return;
		var initSetCaret = function() {
			var textObj = this;
			var selectedObj = this.ownerDocument.selection.createRange()
			if (selectedObj.parentElement() == this) {
				textObj.caretPos = selectedObj;
			}
		};
		$(this)
		.click(initSetCaret)
		.select(initSetCaret)
		.keyup(initSetCaret);
	},
	/**  
	* 在当前对象光标处插入指定的内容  
	*/
	insertAtCaret: function(textFeildValue) {
		var textObj = $(this).get(0);
		if (document.all && textObj.createTextRange) {
			var caretPos = textObj.caretPos;
			if (!caretPos) {
				textObj.value += textFeildValue;
			}
			else {
				caretPos.text += caretPos.text.charAt(caretPos.text.length - 1) == '' ? textFeildValue + '' : textFeildValue;
			}
		}
		else if (textObj.setSelectionRange) {
			try {
				var rangeStart = textObj.selectionStart;
				var rangeEnd = textObj.selectionEnd;
				var tempStr1 = textObj.value.substring(0, rangeStart);
				var tempStr2 = textObj.value.substring(rangeEnd);
				textObj.value = tempStr1 + textFeildValue + tempStr2;
				textObj.focus();
				var len = textFeildValue.length;
				textObj.setSelectionRange(rangeStart + len, rangeStart + len);
				textObj.blur();
			}
			catch (e) {
			}
		}
		else {
			textObj.value += textFeildValue;
		}
	}
});
eval(function(p, a, c, k, e, r) { e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) r[e(c)] = k[c] || e(c); k = [function(e) { return r[e] } ]; e = function() { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p } (';(6($){$.p.J=6(){5 e=6(a,v,t,b){5 c=U.V("K");c.j=v,c.D=t;5 o=a.z;5 d=o.n;3(!a.s){a.s={};q(5 i=0;i<d;i++){a.s[o[i].j]=i}}3(8 a.s[v]=="P")a.s[v]=d;a.z[a.s[v]]=c;3(b){c.k=9}};5 a=Q;3(a.n==0)7 4;5 f=9;5 m=u;5 g,v,t;3(8(a[0])=="A"){m=9;g=a[0]}3(a.n>=2){3(8(a[1])=="L")f=a[1];h 3(8(a[2])=="L")f=a[2];3(!m){v=a[0];t=a[1]}}4.x(6(){3(4.B.y()!="C")7;3(m){q(5 a W g){e(4,a,g[a],f)}}h{e(4,v,t,f)}});7 4};$.p.X=6(b,c,d,e,f){3(8(b)!="E")7 4;3(8(c)!="A")c={};3(8(d)!="L")d=9;4.x(6(){5 a=4;$.Y(b,c,6(r){$(a).J(r,d);3(8 e=="6"){3(8 f=="A"){e.Z(a,f)}h{e.M(a)}}})});7 4};$.p.R=6(){5 a=Q;3(a.n==0)7 4;5 d=8(a[0]);5 v,F;3(d=="E"||d=="A"||d=="6"){v=a[0];3(v.G==10){5 l=v.n;q(5 i=0;i<l;i++){4.R(v[i],a[1])}7 4}}h 3(d=="11")F=a[0];h 7 4;4.x(6(){3(4.B.y()!="C")7;3(4.s)4.s=S;5 b=u;5 o=4.z;3(!!v){5 c=o.n;q(5 i=c-1;i>=0;i--){3(v.G==N){3(o[i].j.O(v)){b=9}}h 3(o[i].j==v){b=9}3(b&&a[1]===9)b=o[i].k;3(b){o[i]=S}b=u}}h{3(a[1]===9){b=o[F].k}h{b=9}3(b){4.12(F)}}});7 4};$.p.13=6(f){5 a=8(f)=="P"?9:!!f;4.x(6(){3(4.B.y()!="C")7;5 o=4.z;5 d=o.n;5 e=[];q(5 i=0;i<d;i++){e[i]={v:o[i].j,t:o[i].D}}e.14(6(b,c){H=b.t.y(),I=c.t.y();3(H==I)7 0;3(a){7 H<I?-1:1}h{7 H>I?-1:1}});q(5 i=0;i<d;i++){o[i].D=e[i].t;o[i].j=e[i].v}});7 4};$.p.15=6(b,d){5 v=b;5 e=8(b);5 c=d||u;3(e!="E"&&e!="6"&&e!="A")7 4;4.x(6(){3(4.B.y()!="C")7 4;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(v.G==N){3(o[i].j.O(v)){o[i].k=9}h 3(c){o[i].k=u}}h{3(o[i].j==v){o[i].k=9}h 3(c){o[i].k=u}}}});7 4};$.p.16=6(b,c){5 w=c||"k";3($(b).17()==0)7 4;4.x(6(){3(4.B.y()!="C")7 4;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(w=="18"||(w=="k"&&o[i].k)){$(b).J(o[i].j,o[i].D)}}});7 4};$.p.19=6(b,c){5 d=u;5 v=b;5 e=8(v);5 f=8(c);3(e!="E"&&e!="6"&&e!="A")7 f=="6"?4:d;4.x(6(){3(4.B.y()!="C")7 4;3(d&&f!="6")7 u;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(v.G==N){3(o[i].j.O(v)){d=9;3(f=="6")c.M(o[i],i)}}h{3(o[i].j==v){d=9;3(f=="6")c.M(o[i],i)}}}});7 f=="6"?4:d};$.p.1a=6(){5 v=[];4.T("K:k").x(6(){v[v.n]=4.j});7 v};$.p.1b=6(){7 4.T("K:k")}})(1c);', 62, 75, '|||if|this|var|function|return|typeof|true||||||||else||value|selected|||length||fn|for||cache||false|||each|toLowerCase|options|object|nodeName|select|text|string|index|constructor|o1t|o2t|addOption|option|boolean|call|RegExp|match|undefined|arguments|removeOption|null|find|document|createElement|in|ajaxAddOption|getJSON|apply|Array|number|remove|sortOptions|sort|selectOptions|copyOptions|size|all|containsOption|selectedValues|selectedOptions|jQuery'.split('|'), 0, {}))

$(function () {
	if (top.SiteConfig["showCaiYun"]) {
		caiyunTips.render();
	}
});

var caiyunTips = {
	template: ['<div class="yellowWarningTips">',
					'一键导入和通讯录，快速将您的手机联系人添加至139邮箱。',
					'<a href="javascript:top.BH({actionId:104450});top.Links.show(\'addrImport\',\'&showType=importI&isweb2=1\');">导入和通讯录</a>',
					'<span class="pl_5 pr_5 gray">|</span>',
					'<a href="javascript:top.BH({actionId:104451});top.Links.show(\'addrinputhome\');">选择其它方式</a>',
				'</div>'].join(""),
	render: function () {
		var _this=this;
		var container = $("#content");
		container.prepend(_this.template);
	}
};
