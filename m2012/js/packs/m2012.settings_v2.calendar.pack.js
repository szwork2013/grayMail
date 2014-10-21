/**
* @fileOverview 
*/
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/**
	* @namespace 
	* 设置页-日历
	*/
	M139.namespace('M2012.Settings.Calendar.View', superClass.extend(
	/**
	* @lends M2012.Settings.Calendar.View.prototype
	*/
	{
		el: "body",

		events: {
			"change .cbxSelectAll": "toggleSelectAll",
			"click .delItem": "delBlackWhiteItem",
			"click #btnAddBlack": "showInput",
			"click #btnAddWhite": "showInput",
			"click #addBtnOK": "onAddItemClick",
			"click .myListItem a": "onDelItemClick",
			"click #blackRemoveSelected": "delSelected",
			"click #whiteRemoveSelected": "delSelected",
			"click #addBtnCancel": "onCancel",
			"click #viewerClose": "onCancel",
			"keydown #addInput": "onInputOK"
		},

		initialize: function(options) {
			this.itemTemplate = ['<tr class="myListItem" data-uin="{uin}">', 
				'	<th width="85%"><input type="checkbox" class="checkbox" /><label>{name} &lt;{email}&gt;</label></th>', 
				'	<td><a class="delItem" href="javascript:;">删 除</a></td>', 
				'</tr>'].join("\n");

			return superClass.prototype.initialize.apply(this, arguments);
		},

		render: function() {
			this.updateBlackWhiteList(0, true);
			$("#addViewer").hide();
			return superClass.prototype.render.apply(this, arguments);
		},

		toggleSelectAll: function(e) {
			var element = $(e.currentTarget);
			var checked = element.prop("checked");
			element.closest("table").find("input:checkbox").prop("checked", checked);
		},

		addItem: function(email, type){
			var self = this;
			var postData = {"comeFrom": 0, "type": type, "email": $TextUtils.htmlEncode(email)};

			M139.RichMail.API.call("calendar:addBlackWhiteItem", postData, function(result){
				var data = result.responseData;
				var successlist, errorlist;
				if(data.code == "S_OK") {
					successlist = data["var"].success;
					errorlist = data["var"].error;
					if(successlist.length){
						self.updateBlackWhiteList(type, true);
					}
					if(errorlist.length){
						self.showErrorList(errorlist);
					}
					return;
				}
				top.M139.UI.TipMessage.show("添加失败", {className: "msgRed", delay:"2000"});
			});
		},

		delItems: function(uin, type, callback){
			if(_.isArray(uin)){
				uin = uin.join(",");
			}
			M139.RichMail.API.call("calendar:delBlackWhiteItem", {"comeFrom": 0, "uin": uin}, function(result){
				var data = result.responseData;
				if(data.code == "S_OK"){
					callback();
				} else {
					top.M139.UI.TipMessage.show("删除失败", {className: "msgRed", delay:"2000"});
				}
			});
		},

		onAddItemClick: function(e) {
			var text = $("#addInput").val();
			var emailUtils = $T.Email;
			var list;
			var domain = (top.SiteConfig && top.SiteConfig.mailDomain) || "139.com";

			if(text.trim() == "") {
				M139.Dom.flashElement("#addInput");
				return;
			}

			// split and filter ( only locale email address are valid ).
			list = _.filter(text.split(/[\s,，;；]+/gi), function(item){
				return emailUtils.getDomain(item) === domain && emailUtils.isEmail(item);
			});

			if(list.length) {
				this.addItem(list.join(","), this.addType);
				// hide Input box, and reset the error tips.
				$("#addViewer").find(".errorTips").css("visibility", "hidden").end().hide();
			} else {
				$("#addViewer .errorTips").css("visibility", "visible");
				$("#addInput").one("keydown", function(){
					$("#addViewer .errorTips").css("visibility", "hidden");
				});
			}
		},

		onInputOK: function(e){
			if(e.keyCode !== 13){	// Enter
				return;
			}
			this.onAddItemClick(e);
		},

		onDelItemClick: function(e) {
			var row = $(e.target).closest("tr");
			var type = row.closest("table").attr("id") == "blackList" ? 0 : 1;
			this.delItems(row.attr("data-uin"), type, function(){
				var siblings = row.siblings();
				if(siblings.length <= 1){
					siblings.hide();
				}
				row.remove();
			});
		},

		onCancel: function(e) {
			$("#addViewer").find(".errorTips").css("visibility", "hidden").end().hide();
		},

		showInput: function(e) {
			var element = $(e.currentTarget);
			var offset = element.offset();
			$("#addViewer").css({
				top: offset.top + 32 + "px",
				left: offset.left + "px"
			}).show();
			$("#addInput").val("").focus();
			this.addType = (element.attr("id") === "btnAddBlack" ? 0 : 1);
		},

		delSelected: function(e) {
			var element = $(e.currentTarget);
			var type = (element.attr("id") === "blackRemoveSelected" ? 0 : 1);
			var rows = element.closest("table").find(".myListItem input:checked").closest("tr");
			var uin = rows.map(function(item){
				return $(this).attr("data-uin");
			}).toArray();

			if(uin.length === 0){
				this.showSelectTips(element.offset());
				return;
			}

			this.delItems(uin, type, function(){
				var siblings = element.closest("tr").siblings();
				if(siblings.length == rows.length){	// delete all
					element.closest("tr").hide();
				}
				rows.remove();
			});
		},

		showSelectTips: function(pos){
			var tips = $("#selTips");
			tips.css({"top": pos.top + 24 + "px", "left": pos.left - 72 + "px"}).show();
			setTimeout(function () { tips.hide() }, 1500);
		},

		getBlackWhiteList: function(callback) {
			M139.RichMail.API.call("calendar:getBlackWhiteList", {comeFrom: 0}, function(result){
				var data = result.responseData;
				if(data.code == "S_OK") {
					callback(data["var"]);
				} else {
					top.M139.UI.TipMessage.show("暂未获取到数据，请稍后再试", {className: "msgRed", delay:"2000"});
					callback(null);
				}
			});
		},

		updateBlackWhiteList: function(type, both){
			var tpl = this.itemTemplate;
			this.getBlackWhiteList(function(data){
				if(data === null) return;
				function addList(type){
					var items = type == 0 ? data.black : data.white;
					var container = type == 0 ? $("#blackList") : $("#whiteList");
					var html = "";
					_.each(items, function(item){
						item.name = $TextUtils.htmlEncode(item.name);
						item.email = $TextUtils.htmlEncode(item.email);
					});
					html = $TextUtils.formatBatch(tpl, items).join("");
					container.find("tr.myListItem").remove().end().prepend(html);
					if(items.length > 0){
						container.find("tr:last").show();
					} else {
						container.find("tr:last").hide();
					}
				}
				if(both) {
					addList(1 - type);
				}
				addList(type);
			});
		},

		showErrorList: function(list){
			var listHtml, html;
			var template = {
				MAIN: ['<div style="padding:25px;width: 428px;">',
						'<p>以下邮箱地址未注册</p>',
						'<div style="border:1px solid #e3e3e3;margin-top: 10px;">',
						'<div style="background-color:#f9f9f9;text-align: left;padding-left: 10px; height: 27px;line-height: 27px;">邮箱地址</div>{errorList}</div>',
					'</div>'].join(""),
				ERROR_ITEM: '<div style="height: 27px;padding-left: 10px;border-top: 1px solid #e3e3e3;line-height: 27px;overflow:hidden; white-space:nowrap; text-overflow:ellipsis;_width:395px;">{email}</div>'
			};
			
			_.each(list, function(item){
				item.email = $TextUtils.htmlEncode(item.email);
			});

			listHtml = $TextUtils.formatBatch(template.ERROR_ITEM, list).join("");
			html = $TextUtils.format(template.MAIN, {errorList: listHtml});
			top.$Msg.showHTML(html, {width: "480px", buttons: ["确定"]});
		}
	}));
})(jQuery, _, M139);

