/**
* @fileOverview 发件人视图层.
*/
/**
*@namespace 
*/
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.Sender', superClass.extend({
		/**
        *@lends M2012.Compose.View.Sender.prototype
        */
		el: ".writePar",

		events: {
			"click .sendPsel": "showSenderTable" //选择发件人
		},
		initialize: function(options) {
			this.model = options.model;
			this.uidList = top.$User.getAccountList('showPopAccount'); // todo 确认tab_view中该方法是否支持传参数
			this.popList = top.$App.getPopList().concat();
			this.uidMails = []; //uidList 成员的name属性
			this.popMails = []; //popList 成员的email属性
			this.sender = '';
			this._loadSenderTable();
			return superClass.prototype.initialize.apply(this, arguments);
		},
		// 渲染发件人组件
		render: function(pageType, dataSet) {
			// 初始化发件人
			if (dataSet.account && pageType != this.model.pageTypes['FORWARD']) {
				var sender = dataSet.account.trim().replace(/^.+<|>$/g, "");

				var trueName = top.$User.getTrueName();
				if (trueName) {
					sender = this.getSendText(trueName, sender);
				}
				//还原邮箱
				if (M139.NoNeedToGetDefaultSender == 1) {
					sender = trueName == "" ? top.$User.getDefaultSender() : this.getSendText(trueName, top.$User.getDefaultSender());
				}
				if (M139.NoNeedToGetDefaultSender == 2) {
					sender = trueName == "" ? M139.NoNeedToGetDefaultSender2 : this.getSendText(trueName, M139.NoNeedToGetDefaultSender2);
				}
				this.chooseSender(sender);
			}
		},
		// 加载发件人选择框
		_loadSenderTable: function() {
			var self = this;
			M139.Timing.waitForReady("top.$User.getAccountList().length", function() {
				var defaultSender = top.$User.getDefaultSender();
				var trueName = top.$User.getTrueName();
				//add by zsx 代收邮箱邮件列表转发的邮件，取当前账户作为默认值
				var popMailList = _.pluck(top.$App.getPopList(), "email");
				var thisone = $T.Url.getQueryObj(location.href).userAccount;

				if ($.inArray(thisone, popMailList) > -1) {
					defaultSender = trueName == "" ? thisone : self.getSendText(trueName, thisone);
				} else if(trueName) {
					defaultSender = self.getSendText(trueName, defaultSender);
				}
				self.createSenderList();
				self.chooseSender(defaultSender);
			});
		},

		createSenderList: function() {
			var self = this;
			var trueName = top.$User.getTrueName();
			var uidList = top.$User.getAccountList();
			var popList = top.$App.getPopList().concat().sort(function(a, b) {
				return b.popId - a.popId;
			});

			var items = ['<ul class="personalSettings">'];

			items.push('<li><a hideFocus="1" href="javascript:void(0);"><span class="text gray">139邮箱：</span></a></li>');

			$.each(uidList, function(i, item) {
				var name = item['name'];
				self.uidMails.push(name);
				if (trueName) {
					name = M139.Text.Html.encode(self.getSendText(trueName, name));
				}
				items.push('<li><a hideFocus="1" href="javascript:void(0);" onclick="senderView.chooseSender(this);$(\'#senders\').hide();"><span class="text">' + name + '</span></a></li>');
			});

			items.push('<li class="line"></li>');
			items.push('<li><a hideFocus="1" href="javascript:void(0);"><span class="text gray">代收邮箱：</span></a></li>');

			$.each(popList, function(i, item) {
				var name = item['email'];
				self.popMails.push(name);
				if (trueName) {
					name = M139.Text.Html.encode(self.getSendText(trueName, name));
				}
				items.push('<li><a hideFocus="1" href="javascript:void(0);" onclick="senderView.chooseSender(this);$(\'#senders\').hide();"><span class="text">' + name + '</span></a></li>');
			});

			items.push('<li class="line"></li>');
			items.push('<li><a hideFocus="1" href="javascript:;" id="setAccount"><span class="text blue">发信设置</span></a></li>');
			items.push("</ul>");

			$("#setAccount").off("click");
			$("#senders").html(items.join("\r\n"));
			$("#setAccount").on("click", function(event) {
				if (top.$App.isNewWinCompose()) {
					top.$App.closeNewWinCompose(true);
				}
				$("#senders").hide();
				top.$App.show("account");
			});
		},

		// 选择发件人
		showSenderTable: function(event) {
			var jSenders = $("#senders");
			var current;

			BH({key: "compose_sendertriangle"});
			this.createSenderList();
			current = jSenders.find("li:eq(" + this.lastChooseIndex + ")");
			this.chooseSender(current[0]);
			current.addClass('selecteds').children(0).append('<i class="i_icok"></i>');
			jSenders.show();

			M139.Dom.bindAutoHide({
				action: "click",
				element: jSenders[0],
				stopEvent: true,
				callback: function() {
					jSenders.hide();
					M139.Dom.unBindAutoHide({
						action: "click",
						element: jSenders[0]
					});
				}
			});
			top.$Event.stopEvent(event);
		},

		// 选择发件人
		chooseSender: function(ele) {
			var index = -1,
				mail = "",
				html = "";

			//$("#senders li.selecteds").removeClass('selecteds').find("i").remove();

			if (typeof ele === 'string') {
				mail = ele;
			} else {
				mail = $(ele).text();
			}
			index = $.inArray($Email.getEmail(mail), this.uidMails.concat(this.popMails));
			index += (index < this.uidMails.length ? 1 : 3);
			this.lastChooseIndex = index;
			this.sender = mail;
			html = '<span>' + M139.Text.Html.encode(mail) + '</span><i class="i_triangle_d ml_5"></i>';
			$(".sendPsel").html(html);
			//$("#senders").hide();

			// 记录用户选择的账号类型
			var account = this.uidList.concat(this.popList)[index];
			$(".sendPsel").attr('type', (account && account.type) || 'pop');
		},
		getSender: function() {
			// 发件人加载失败，取默认发件人
			// 默认发件人获取失败就取shortUid:会从cookie中取usernumber
			if ($T.Email.isEmailAddr(this.sender)) {
				return this.sender;
			} else if ($T.Email.isEmailAddr(top.$User.getDefaultSender())) {
				return top.$User.getDefaultSender();
			} else {
				return (top.$User.getShortUid() + '@' + top.SiteConfig.mailDomain);
			}
		},
		/**
        * 格式化发件人地址
        * @param {String} name 署名
        * @param {String} email 邮件地址
        * @returns {String}
        * @example
        $Email.getSendText('李福拉','lifula@139.com');
        //返回"李福拉"&lt;lifula@139.com&gt;
        */
		getSendText: function(name, email) {
			if (typeof name != "string" || typeof email != "string") return "";
		// $Email区别	 name.replace(/[\s;,；，<>"]/g, " ")
			return '"' + name.replace(/"|\\/g, "") + '"<' + email.replace(/[\s;,；，<>"]/g, "") + '>';
		},
		// 上报用户行为:发件人类型
		addBehavior: function() {
			var accountType = this.$(".sendPsel").attr('type');
			if (accountType === 'common') {
				BH({key: "compose_send_aliasaccount"});
			} else if (accountType === 'mobile') {
				BH({key: "compose_send_mobileaccount"});
			} else if (accountType === 'pop') {
				BH({key: "compose_send_otheraccount"});
			} else {
				console.log('未知账号类型! accountType:' + accountType);
			}
		}
	}));
})(jQuery, _, M139);
