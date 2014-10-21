/**
 * @fileOverview 读信页往来邮件会话 create by zhangsixue
 */
(function (jQuery, _, M139) {

	M139.namespace("M2012.ReadMail.SessionContactsMailNew.Model", Backbone.Model.extend({
			defaults : {
				email : null, //往来邮件帐号
				mailListData : null,
				attachListData : null
			},
		//	
			/**
			 * 获取邮件列表数据
			 */
			getDefaultsAccount : function(){
				return top.$User.getDefaultSender();
			},
			searchContactsMail : function (callback) {
				var self = this;
				var keyword = this.get('email');
				var keywords = keyword + ";" + self.getDefaultsAccount();
			/*	换用新接口了
				var option = {
					fid : 0,
					recursive : 0,
					isSearch : 1,
					start : 1,
					total : 190,
					limit : 190,
					ignoreCase : 0,
					isFullSearch : 0
				};
				var _options = {
					condictions : [//往来邮件条件变更
						{
							field : "from",
							operator : "contains",
							value : keywords
						}, {
							field : "to",
							operator : "contains",
							value : keywords
						}
					]
				};
				option = $.extend(option, _options);
				this.set("searchContactsMailOptions", _options); //查看等多
				M139.RichMail.API.call("mbox:searchMessages", option, function (result) {
					callback && callback(result.responseData);
				});*/
				var option = {
						start : 1,
						total : 21,
						pairs :[keywords]
					};
				this.set("searchContactsMailOptions", option); //查看等多
				M139.RichMail.API.call("mbox:queryContactMessages", option, function (result) {
					callback && callback(result.responseData);
				});
			},

			/**
			 * 获取附件列表数据
			 */
			getAttachData : function (callback) {
				var self = this;
				var keyword = this.get('email');
				var keywords = keyword + ";" + self.getDefaultsAccount();
			//	var keywords = keyword;//在现网开发用，需要改为上面的地址，不然没有数据
			/* 换用新接口了
			var options = {
					start : 1,
					total : 190,
					order : 'receiveDate',
					desc : 1,
					stat : 1,
					isSearch : 1,
					filter : {
						relation : 1,
						from : keywords,
						to : keywords
					}
				};
				M139.RichMail.API.call("attach:listAttachments", options, function (result) {
					callback && callback(result.responseData);
				});*/
				var option = {
						start : 1,
						total : 20,
						pairs :[keywords]
					};
				M139.RichMail.API.call("attach:queryContactAttachments", option, function (result) {
					callback && callback(result.responseData);
				});
			}

		}));

})(jQuery, _, M139);
