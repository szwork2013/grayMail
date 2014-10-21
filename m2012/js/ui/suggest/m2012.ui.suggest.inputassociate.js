/**
 * @fileOverview 定义输入自动联想发件人组件
 */

(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	/***/
	M139.namespace("M2012.UI.Suggest.InputAssociate", superClass.extend(
	/**@lends M2012.UI.Suggest.InputAssociate.prototype */
	{
		/**
		 *输入自动联想发件人组件
		 *@constructs M2012.UI.Suggest.InputAssociate
		 *@extends M139.View.ViewBase
		 *@param {Object} options 初始化参数集
		 *@param {M2012.UI.RichInput.View} options.richInputBox 地址输入框组件
		 *@example
		 */
		initialize : function(options) {
			if(!options || !options.richInputBox) {
				console.log('创建自动联想发件人组件需要传入地址输入框组件实例！');
			}
			this.richInputBox = options.richInputBox;
			this.jContainer = options.richInputBox.jAddrTipsContainer;
			this.contactsModel = options.richInputBox.contactsModel;
			this.response = {
				isSuccess : true,
				requestEmail : '',
				emailList : []
			};
			this.responseCache = [];
			// 缓存响应结果
			this.emailsStr = '';
			// 请求参数：EmailList
			this.emailsStrCache = [];
			// 缓存请求参数：EmailList
			this.isWaiting = false;
			// 联想地址上限
			this.maxAddrs = 5;
			
			superClass.prototype.initialize.apply(this, arguments);
		},
		render : function() {
			var self = this;
			if(self.timeout){
				clearTimeout(self.timeout);
			}
			self.timeout = setTimeout(function() {
				var emails = self.richInputBox.getInputBoxItems();
				emails = emails.ASC();
				self.emailsStr = self.getEmailsStr(emails);
				var response = self.getResponse(self.emailsStr);
				if(response && response.isSuccess) {
					self.callback(response);
				} else if(emails.length > 0 && emails.length <= 20) {//多于20人不再联想
					self.emailsStrCache.push(self.emailsStr);
					if(!self.isWaiting) {
						self.emailsStr = self.emailsStrCache.pop();
						self.isWaiting = true;
						var request = "<GetAudienceEmailList><UserNumber>{0}</UserNumber><EmailList>{1}</EmailList></GetAudienceEmailList>";
						request = request.format(top.$User.getUid(), self.emailsStr);
						$RM.call("GetAudienceEmailList", request, function(response){
							self.successHandler(response.responseData);
						}, {error: self.error });
					}
				} else {
					if(self.jContainer.html().indexOf('您是否在找') > -1){
						self.jContainer.hide();
					}
				}
			}, 50);
		},
		/**
		 *根据请求参数requestEmail获得缓存中保存的响应
		 *@param requestEmail 请求参数
		 *@inner
		 */
		getResponse : function(requestEmail) {
			if(!requestEmail) {
				return;
			}
			var self = this;
			var responses = self.responseCache;
			for(var i = 0, rLen = responses.length; i < rLen; i++) {
				var response = responses[i];
				if(response.requestEmail == requestEmail) {
					return response;
				}
			}
		},
		/**
		 *根据请求地址输入框组件返回的邮件地址列表获取请求参数
		 *@param emails 邮件地址列表
		 *@inner
		 */
		getEmailsStr : function(emails){
			if(!emails){
				return '';
			}
			var tempArray = [];
			for(var i = 0;i < emails.length;i++){
				tempArray.push($T.Email.getEmail(emails[i]));
			}
			return tempArray.join(',');
		},
		/**
		 *请求接口成功后回调改函数
		 *@param responseObj 响应数据对象
		 *@inner
		 */
		successHandler : function(responseObj) {
			var self = this;
			self.isWaiting = false;
			// todo 测试数据
			// responseObj.EmailList = [{"Serialid":"980802114","Email":"346788382@qq.com"},{"Serialid":"1019969704","Email":"tongkaihong@163.com"},{"Serialid":"974791953","Email":"tongkaihong@richinfo.cn"}];
			if(responseObj && responseObj.EmailList) {
				self.response.isSuccess = true;
				self.response.requestEmail = self.emailsStr;
				self.response.emailList = responseObj.EmailList;
				self.responseCache.push(self.response);
				self.callback(self.response);
			}
		},
		/**
		 *请求接口成功后回调函数将调用该函数
		 *@param response 组装后的响应数据对象
		 *@inner
		 */
		callback : function(response) {
			var self = this;
			if(response.isSuccess) {
				var contactArr = response.emailList;
				var len = contactArr.length > self.maxAddrs ? self.maxAddrs : contactArr.length;
				if(len > 0) {
					var html = '您是否在找：';
					for(var i = 0; i < len; i++) {
						var contact = contactArr[i];
						if(i > 0){
							html += ',';
						}
						html += self.getContactHtml(contact);
					}
					var instances = M2012.UI.RichInput.instances;
		            for(var i=0;i<instances.length;i++){
		            	instances[i].jAddrTipsContainer.hide();
		            }
					self.jContainer.html(html).show();
					
					self.jContainer.unbind('click').bind('click', function(event) {
						var jEle = $(event.target);
						if(jEle[0].nodeName.toLowerCase() == 'a'){
							var rel = jEle.attr("rel");
							if(rel == "addrInfo") {
								self.richInputBox.insertItem(jEle.attr('title'));
								self.richInputBox.focus();
								// todo 行为统计
								//top.addBehavior('写信页-点击推荐的联系人');
								jEle.remove();
								var associates = self.jContainer.find("a[rel='addrInfo']");
					        	if(associates.size() == 0){
					        		self.jContainer.hide();
					        	}
							}
						}
					});
				} else {
					self.jContainer.hide();
				}
			}
		},
		/**
		 *请求接口失败后的回调函数
		 *@inner
		 */
		error : function() {
			this.isWaiting = false;
		},
		/**
		 *组装联想结果html
		 *@inner
		 */
		getContactHtml : function(contact) {
			var self = this;
			var serialid = contact.Serialid;
			var addr = contact.Email;
			var name = _getName();
			var nameLen = name.length;
			var addrText = name;
			if(nameLen > 12) {
				addrText = name.substring(0, 9) + "...";
			}
			var title = '"' + name.replace(/\"/g, '') + '"<' + addr + '>';
			var html = '<a href="javascript:;" hidefocus="1" title="' + $T.Html.encode(title) + '" rel="addrInfo">' + $T.Html.encode(addrText) + '</a>';
			return html;

			function _getName() {
				var contactById = self.contactsModel.getContactsById(serialid);
				var name = (contactById && contactById.name) ? contactById.name : '';
				if(!name) {
					// var lastLinkList = top.LastLinkList, linkMan = {};
					// for(var i = 0; i < lastLinkList.length; i++) {
						// linkMan = lastLinkList[i];
						// if(linkMan.addr == addr) {
							// name = linkMan.name;
							// break;
						// }
					// }
					//if(!name) {
						var contactByEmail = self.contactsModel.getContactsByEmail(addr);
						if(contactByEmail && contactByEmail.length > 0) {
							name = contactByEmail[0].name;
						}
					//}
				}
				return name ? name : addr.split('@')[0];
			}
		}
	}));
})(jQuery, Backbone, _, M139);
