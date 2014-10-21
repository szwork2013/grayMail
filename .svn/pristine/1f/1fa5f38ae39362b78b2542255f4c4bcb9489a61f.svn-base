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
