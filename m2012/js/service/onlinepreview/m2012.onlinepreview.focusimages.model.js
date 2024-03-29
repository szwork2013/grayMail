﻿(function(jQuery, _, M139) {

	M139.namespace("M2012.OnlinePreview.FocusImages.Model", Backbone.Model.extend({

		defaults: {
			currentImg: -1,	//当前的图片
			//imgNum: 5,	//默认显示5张缩略图
			imgOffsetWidth: 93,	//缩略图之间的距离
			loadImageStatus: 0 //从附件夹、彩云入口进来       >50张图片时  图片分批加载 每次加载50张
		},
		callApi: M139.RichMail.API.call,
		getImageAttach: function(obj, callback) { //获取图片附件列表
			var self = this;
			var index = this.get("loadImageStatus");
			var data = {
				start: (index * 50) + 1,
				total: 50,
				order: 1,
				desc: 1,
				stat: 1,
				isSearch: 1,
				filter: {
					attachType: 1
				}
			};
			this.callApi("attach:listAttachments", data, function(result) {
				result = result.responseData;
				if (result.code && result.code == 'S_OK') {
					callback && callback(obj, result["var"]);
				}
			});
		}
	}));

})(jQuery, _, M139);

