/**
* @fileOverview 设置页-邮件设置公共数据模型
*/

(function(jQuery, _, M139) {
	/**
	*@namespace 
	*设置页-邮件设置公共模型类
	*/
	M139.namespace('M2012.Settings.Model', Backbone.Model.extend(
	/**
	*@lends M2012.Settings.Model.prototype
	*/
	{
		defaults: {
			auto_replay_content: null,
			preference_letters: 50,
			preference_reply: null,
			preference_reply_title: null,
			preference_receipt: null,
			smtpsavesend: null,
			auto_replay_status: null,
			auto_forward_status: null,
			auto_forward_addr: "****",
			auto_forward_bakup: 0,

			mailcontentdisplay: 0,
			mailsizedisplay: 0,
			auto_replay_starttime: null,
			auto_replay_endtime: null,

			flag: null,
			_custom_pageStyle: 1,
			list_layout: null,
			onlineTipsTypes: ['ad', 'online', 'login', 'mail'],
			popMailForDate: 0,
			//POP时按时间收取邮件,0默认收取全部，1表示收取100天以内的邮件
			popStatusChange: false,
			//POP按时间和按文件夹收取的选项是否有变化
			defalutText: null,
			popFolderStatus: null,

			forbid_del: null,		// 禁止客户端删信
			session_mode: null,		// 会话模式

			compose_autosave: null,	// 写信自动保存联系人到通讯录
			read_autosave: null,	// 写信自动保存联系人到通讯录

			unallow_pop3_change_mail_state: null,	// 客户端协议 是否改变未读邮件状态
			largeattach_autosave: null
		},

		callApi: M139.RichMail.API.call,

		messages: {
			defaultAutoReplayCon: "您的来信已收到，我会尽快回信。",
			serverBusy: "服务器繁忙，请稍后再试。",
			saved: "您的设置已保存",
			mailAddrError: "请输入正确的邮箱地址（例：example@139.com）",
			timeError: "自动回复的时间段结束时间必须大于起始时间",
			operateFailed: "操作失败",
			getSettingFailed: "获取设置失败",
			autoReplayNull: "自动回复的内容不能为空",
			forwardMailError: "转发用户不能填写自己的邮箱地址",
			forwardMailNull: "转发邮箱地址不能为空",
			autoReplyContentMax: "自动回复内容大小超过限制！"
		},

		initialize: function() {
			var self = this;
			var changedAttrs = this.changedAttrs = {};

			_.each(_.keys(this.defaults), function(key){
				changedAttrs[key] = false;
			});

			// 监控和记录变更的属性
			this.on("change", function(){
				var attrs = this.changedAttributes();
				_.each(_.keys(attrs), function(key){
					changedAttrs[key] = true;
				});
			});
		},

		/**
		*获取基本参数接口getAttrs的数据
		*/
		getPreference: function(callback) {
			$RM.getAttrs({attrIds: []}, callback);
		},

		/*
		* 序列化appsvr接口, 最多只支持合并10个接口
		* user:setAttrs
		* mbox:updateFolders
		* mbox:setUserFlag
		* mbox:getAllFolders
		*/
		saveData: function(callback) {
			var changedAttrs = this.changedAttrs;
			var billSub = this.getBillSubValue();
			var changedAttrNames = _.filter(_.keys(changedAttrs), function(key){
				return changedAttrs[key];
			});
			var preference_attrs = _.pick(this.attributes, [
				"preference_letters",
				"_custom_pageStyle",
				"preference_reply_title",
				"preference_reply",
				"preference_receipt",
				"mailsizedisplay",
				"mailcontentdisplay",
				"auto_replay_status",
				"auto_forward_status",
				"auto_replay_content",
				"auto_forward_addr",
				"auto_forward_bakup",
				"smtpsavesend",
				"auto_replay_starttime",
				"auto_replay_endtime",
				"list_layout"
			]);

			var allAttrs = _.pick(preference_attrs, changedAttrNames);

			var arr = [{
				func: "mbox:updateFolders",
				"var": billSub.optionsBill
			}, {
				func: "mbox:updateFolders",
				"var": billSub.optionsSubscribe
			}, {
				func: "mbox:updateFolders",
				"var": billSub.optionsAdver
			}];

			if(_.keys(allAttrs).length) {
				arr.push({
					func: "user:setAttrs",
					"var": {
						"attrs": allAttrs
						/*
						"attrs": _.pick(this.attributes, [
							"preference_letters",
							"_custom_pageStyle",
							"preference_reply_title",
							"preference_reply",
							"preference_receipt",
							"mailsizedisplay",
							"mailcontentdisplay",
							"auto_replay_status",
							"auto_forward_status",
							"auto_replay_content",
							"auto_forward_addr",
							"auto_forward_bakup",
							"smtpsavesend",
							"auto_replay_starttime",
							"auto_replay_endtime",
							"list_layout"
						])*/
					}
				});
			}

			if(changedAttrs["unallow_pop3_change_mail_state"]) {
				arr.push({
					func: "mbox:setUserFlag",
					"var": {type: 2, value: this.get("unallow_pop3_change_mail_state")}
				});
			}

			if(changedAttrs["forbid_del"]) {
				arr.push({
					func: "mbox:setUserFlag",
					"var": {type: 1, value: this.get("forbid_del")}
				});
			}

			if(changedAttrs["forbid_del"]) {
				arr.push({
					func: "mbox:setUserFlag",
					"var": {type: 0, value: this.get("popMailForDate")}
				});
			}

			arr.push({
				func: "mbox:getAllFolders",
				"var": {stats: 1, type: 0}
			});

			this.callApi("global:sequential", {
				items: arr
			}, function(res) {
				callback(res.responseData);
			});
		},

		//webapp接口，无法序列化，单独请求,设置文件夹是否可收取
		updateFolders: function(obj, callback) {
			this.callApi("mbox:updateFolders2", obj, function(res) {
				callback(res.responseData);
			});
		},

		/**
		*自动清理文件夹
		*组装自动清理文件夹接口的请求报文
		*/
		getBillSubValue: function() {
			var billValue = "";
			var subValue = "";
			var adverValue = "";
			var billObj = $("input[name=billKeepPeriod]");
			var subObj = $("input[name=subKeepPeriod]");
			var advObj = $("input[name='adverKeepPeriod']");
			for (var i = 0, billLen = billObj.length; i < billLen; i++) {
				if (billObj.eq(i).prop("checked")) {
					billValue = billObj.eq(i).attr("keepPeriod");
				}
			}
			for (var n = 0, subLen = subObj.length; n < subLen; n++) {
				if (subObj.eq(n).prop("checked")) {
					subValue = subObj.eq(n).attr("keepPeriod");
				}
			}
			for (var j = 0, advLen = advObj.length; j < advLen; j++) {
				if (advObj.eq(j).prop("checked")) {
					adverValue = advObj.eq(j).attr("keepPeriod");
				}
			}
			
			return {
				optionsBill: {fid: 8, type: 6, keepPeriod: billValue},		// 帐单
				optionsSubscribe: {fid: 9, type: 6, keepPeriod: subValue},	// 订阅
				optionsAdver: {fid: 11, type: 6, keepPeriod: adverValue}	// 广告
			};
		}
	}));

	//top.set_model = new M2012.Settings.Model();
})(jQuery, _, M139);

/**
* @fileOverview 
*/
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/**
	*@namespace 
	*设置页-通讯录
	*/
	M139.namespace('M2012.Settings.Addr.View', superClass.extend(
	/**
	*@lends M2012.Settings.Addr.View.prototype
	*/
	{
		initialize: function(options) {
			this.model = options && options.model || new M2012.Settings.Model();
			this.submitSetView = new M2012.Settings.Submit.View({
				model: this.model,
				needPreferenceData: false
			}).render();

			this.compose_autosave_menu = M2012.UI.DropMenu.create({
				defaultText: "自动保存联系人到通讯录",
				menuItems: [{
					text: "自动保存联系人到通讯录",
					value: 1
				}, {
					text: "不自动保存联系人到通讯录",
					value: 2
				}],
				container: $("#composeAutosaveFlag"),
				width: "224px"
			});

			this.read_autosave_menu = M2012.UI.DropMenu.create({
				defaultText: "自动保存联系人到通讯录",
				menuItems: [{
					text: "自动保存联系人到通讯录",
					value: 1
				}, {
					text: "不自动保存联系人到通讯录",
					value: 2
				}],
				container: $("#readAutosaveFlag"),
				width: "224px"
			});

			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},

		render: function() {
			var model = this.model;
			var status1 = top.$App.getUserCustomInfo(9);
			var status2 = top.$App.getUserCustomInfo("readAutoSave");

			// silent 不记录属性变化
			model.set({
				"compose_autosave": status1 || 1,
				"read_autosave": status2 || 1
			}/*, {silent: true}*/);

			return superClass.prototype.render.apply(this, arguments);
		},

		initEvents: function() {
			var self = this,
				model = this.model;

			// 模型->视图同步
			model.on("change:compose_autosave", function(model, newVal, options){
				//$("#composeAutosaveFlag").next().css("visibility", (newVal == 2) ? "hidden" : "visible");
				!options.passive && self.compose_autosave_menu.setSelectedValue(newVal);
			});

			model.on("change:read_autosave", function(model, newVal, options){
				$("#readAutosaveFlag").next().css("visibility", (newVal == 2) ? "hidden" : "visible");
				!options.passive && self.read_autosave_menu.setSelectedValue(newVal);
			});

			// 视图->模型同步
			this.compose_autosave_menu.on("change", function(item){
				//console.log("compose_autosave: "+parseInt(item.value));
				model.set("compose_autosave", parseInt(item.value), {passive: true});
			});

			this.read_autosave_menu.on("change", function(item){
				//console.log("read_autosave: "+parseInt(item.value));
				model.set("read_autosave", parseInt(item.value), {passive: true});
			});


			this.submitSetView.on("before_submit", function(){
				//self.setAutoSaveContacts();
			});
			this.submitSetView.on("save_ok", function(){
				//console.log("save_ok");
				self.setAutoSaveContacts();
			});
		},

		setAutoSaveContacts: function() {
			var model = this.model;
			var compose_autosave = model.get("compose_autosave") || 1;
			var read_autosave = model.get("read_autosave") || 1;
			var compose_autosave_prev = top.$App.getUserCustomInfo("9") | 0;
			var read_autosave_prev = top.$App.getUserCustomInfo("readAutoSave") | 0;

			top.$App.setUserCustomInfoNew({
				"9": compose_autosave,
				"readAutoSave": read_autosave
			});

			if(compose_autosave != compose_autosave_prev) {
				if(compose_autosave == 2) {
					top.BH("settings_nosave_sendmail_contacts_success");
				} else {
					top.BH("settings_save_sendmail_contacts_success");
				}
			}

			if(read_autosave != read_autosave_prev) {
				if(read_autosave == 2) {
					top.BH("set_preference_save_read_noauto_success");
				} else {
					top.BH("set_preference_save_read_auto_success");
				}
			}
		}
	}));
})(jQuery, _, M139);

/**
* @fileOverview 
*/
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/**
	*@namespace 
	*设置页提交数据更改
	*/
	M139.namespace('M2012.Settings.Submit.View', superClass.extend(
	/**
	*@lends M2012.Settings.Submit.View.prototype
	*/
	{
		tagName: "div",

		className: "setBtn fixed-bottom",

		//model: new M2012.Settings.Model(),

		events: {
			"click #setBtnSave": "onSaveBtnClick",
			"click #setBtnCancel": "onCancelBtnClick"
		},

		initialize: function(options) {
			var model = this.model = options && options.model || new M2012.Settings.Model();

			this.$el.css("left", "0").append([
				//'&emsp;<a id="setBtnReset" href="javascript:;" class="fr def">还原默认设置</a>',
				'&emsp;<a id="setBtnSave" href="javascript:;" class="btnSetG"><span>保 存</span></a>',
				'&emsp;<a id="setBtnCancel" href="javascript:;" class="btnSet"><span>取 消</span></a>'
			].join("")).appendTo(document.body);

			if(options.needPreferenceData) {
				model.getPreference(function(dataSource) {
					if (dataSource["code"] != "S_OK") {
						top.$Msg.alert(self.messages.serverBusy);
					} else {
						model.set(dataSource["var"], {silent: true});
					}
					model.trigger("data-ready", dataSource["var"]);
				});
			}

			return superClass.prototype.initialize.apply(this, arguments);
		},

		render: function(){
			return this;
		},

		onSaveBtnClick: function(e){
			this.trigger("before_submit");
			this.saveData();
			this.trigger("after_submit");
		},

		onCancelBtnClick: function(e){
			top.$App.close();
		},

		/**
		*保存数据的操作
		*/
		saveData: function() {
			var self = this;
			var model = this.model;
			model.saveData(function(data) {
				if (data["code"] == "S_OK") {
					self.trigger("save_ok", data);
					top.M139.UI.TipMessage.show(model.messages.saved, {delay: 2000});

					//重新加载两个接口的userattrs数据，并通知邮件列表刷新
					//top.$App.trigger('reloadFolder', {reload: true});

					//top.$App.trigger("userAttrChange", {callback: function(){}});
					top.BH("set_preference_save_success");
				} else {
					top.$Msg.alert(model.messages.operateFailed);
				}
			});
		}
	}));
})(jQuery, _, M139);

