/**
 * @fileOverview 彩云网盘附件夹页面模型层
 */
(function(jQuery, Backbone, _, M139) {
	var $ = jQuery;
	M139.namespace("M2012.Mailattach.Model", Backbone.Model.extend({
		defaults : {
			pageSize : 30,	//每页显示文件数
			pageIndex : 1,	//当前页
			attachTotal: 0, // 总附件数
			fileList : [],	// 当前分页文件列表
			cacheList: [],	// 分页总缓存
			selectedList: [],
			sortType : '', // 排序类型
			sortIndex : -1 // 当前排序状态  1 升序 -1 降序
		},

		name : 'M2012.Attach.Model',
		callApi : M139.RichMail.API.call,
		
		initialize : function(options) {
		},

		listAttaches: function() {
			this.callApi("mbox:forwardAttachs", {
				attachments: attachments
			}, callback);
		},

		forwardAttach: function(attachments, callback) {
			//var rid = Math.random();
			this.callApi("mbox:forwardAttachs", {
				attachments: attachments
			}, callback);
		},

		// 获取总页数
		getPageCount : function() {
			var messageCount = this.get('attachTotal');
			var result = Math.ceil(messageCount / this.get("pageSize"));
			if(result <= 0) {
				result = 1;
			};//最小页数为1
			return result;
		},

		// 添加惟一键，映射列表数据。
		cacheData: function(result){
			var item;
			var list = result["var"];
			for(var i=0,len=list.length; i<len; i++){
				item = list[i];
				item.uid = item.mid + "_" + item.attachOffset;
			}
			this.set({
				"fileList": list,
				"attachTotal": (result["total"] | 0)
			});
			this.mergeToCache();
		},

		addToList: function(uid){
			var list = this.get("selectedList");
			if(typeof uid === "string"){
				if($.inArray(uid, list) === -1){
					list.push(uid);
				}
				// $.isArray(uid)居然不可靠，跨页面了？
			} else if(uid.length){
				for(var i=0, len=uid.length; i<len; i++){
					if($.inArray(uid[i], list) === -1){
						list.push(uid[i]);
					}
				}
			}
		},

		removeFromList: function(uid){
			var list = this.get("selectedList");
			if(typeof uid === "string"){
				index = $.inArray(uid, list);
				if(index !== -1){
					list.splice(index, 1);
				}
			} else if(uid.length){
				for(var i=0, len=uid.length; i<len; i++){
					index = $.inArray(uid[i], list);
					if(index !== -1){
						list.splice(index, 1);
					}
				}
			}
		},

		getItemById: function(uid){
			if(!uid){
				return null;
			}
			var list = this.get('cacheList');
			
			for(var i=0,len=list.length; i<len; i++) {
				if(list[i].uid == uid){
					return list[i];
				}
			}
			return null;
		},

		// todo: 优化
		mergeToCache: function(uid){
			var cacheList = this.get('cacheList');
			var list = this.get('fileList');
			var addList = [];
			var ret;
			
			for(var i=0,len=list.length; i<len; i++) {
				uid = list[i].uid;
				ret = _.find(cacheList, function(item){
						return item.uid == uid;
					});
				if(!ret) {
					addList.push(list[i]);
				}
			}

			this.set('cacheList', cacheList.concat(addList));
		}
	}));
})(jQuery, Backbone, _, M139);

