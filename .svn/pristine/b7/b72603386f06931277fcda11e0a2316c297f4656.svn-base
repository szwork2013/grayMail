// create by  zhangsixue 飞信好友列表和组视图
(function (jQuery, Backbone, _, M139) {
	var superClass = M139.View.ViewBase;
	M139.namespace("M2012.ReadMail.Fetion.Group", superClass.extend({
			initialize : function (options) {
				var self  = this;
				self.model = options.model;
				var el = $D.getHTMLElement(options.container);
				el.innerHTML = self.buildGroupAndContacts(self.model.dataSource);
				self.setElement(el);
				self.render();
				self.initEvents();
				return superClass.prototype.initialize.apply(this, arguments);
			},
			templateGrop : '<a href="javascript:;" class="groupName" style="display: block;"><i class="i_downDot i_rightDot"></i>{Group} ({number}) </a>',
			templateItem : '<li friendFetionNo="{friendFetionNo}">\
								<a href="javascript:;" class="add_addr">添加</a>\
								<a href="javascript:;" class="add_addr add_addrh c_999">已添加</a>\
								<a class="MemName" href="javascript:;">{MemberName}</a>\
							</li>',
			render : function () {
			},
			events : {
				"click li[friendFetionNo]" : "onContactsItemClick",
				"click .groupName" : "onGroupNameClick"
			},
			initEvents : function () {
				$("li[friendFetionNo]").mouseenter(function () {
					var _this = $(this);
					_this.addClass("li-add");
				}).mouseleave(function () {
					var _this = $(this);
					_this.removeClass("li-add");
				});
			},
			onContactsItemClick : function (event) {
				if(this.model.isGreatThan20()){
					M139.Dom.flashElement(document.getElementById("forFlash"));//弹窗改为闪烁
				//	top.$Msg.alert(this.model.tipWords.MAX_20_CONTACTS);
					$("#forFlash").css("color","red");
					setTimeout(function(){
						$("#forFlash").css("color","");
					}, 600);
					return;
				}
				var cid = $(event.target).closest("li").attr("friendFetionNo");
				var c = this.model.getContactsById(cid);
				$("li[friendFetionNo='" + cid + "']").addClass("li-addh").addClass("check");
				this.model.addSelectedItem(c);
				this.trigger("select", c);
				this.model.setTheNumChoosed();
			},
			onGroupNameClick: function(event){
				var _this = $(event.currentTarget);
				_this.next("ul").toggle();
				_this.find("i").toggleClass("i_rightDot");
			},
			buildGroupAndContacts : function (data) {
				var self = this;
				var html = "";
				if(data.length == 0){
					html = '<p class="ta_c c_999">您的飞信通讯录中暂时没有好友</p>';
					return html;
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var groupHtml = self.templateGrop.replace("{Group}", data[i].groupName).replace("{number}",data[i].groupMembers.length);
					var members = data[i]["groupMembers"];
					var membersHtml = "<ul class=\"second_menuFeiBar\" style=\"display: none;\">";
					for (var j = 0, m = members.length; j < m; j++) {
						var friendName = members[j].friendName == "" ? members[j].friendFetionNo : members[j].friendName;
						membersHtml += self.templateItem.replace("{MemberName}", friendName).replace("{friendFetionNo}", members[j].friendFetionNo);
					}
					html += "<li>" + groupHtml + membersHtml + "</ul></li>";
				}
				return html;
			}
		}));
})(jQuery, Backbone, _, M139);
