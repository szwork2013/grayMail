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
	M139.namespace('M2012.Settings.Disk.View', superClass.extend(
	/**
	*@lends M2012.Settings.Disk.View.prototype
	*/
	{
		initialize: function(options) {
			this.model = options && options.model || new M2012.Settings.Model();
			this.submitSetView = new M2012.Settings.Submit.View({
				model: this.model,
				needPreferenceData: false
			}).render();

			this.largeattach_autosave_menu = M2012.UI.DropMenu.create({
				defaultText: "不自动保存至彩云网盘",
				menuItems: [{
					text: "自动保存至彩云网盘",
					value: 0
				}, {
					text: "不自动保存至彩云网盘",
					value: 1
				}],
				container: $("#largeAttachAutoSaveFlag"),
				width: "224px"
			});

			this.initEvents();
			return superClass.prototype.initialize.apply(this, arguments);
		},

		render: function() {
			this.getAutoSaveDisk();
			return superClass.prototype.render.apply(this, arguments);
		},

		initEvents: function() {
			var self = this,
				model = this.model;

			// 模型->视图同步
			model.on("change:largeattach_autosave", function(model, newVal, options){
				$("#largeAttachAutoSaveFlag").next().css("visibility", (newVal == 1) ? "hidden" : "visible");
				!options.passive && self.largeattach_autosave_menu.setSelectedValue(newVal);
			});

			// 视图->模型同步
			this.largeattach_autosave_menu.on("change", function(item){
				model.set("largeattach_autosave", parseInt(item.value), {passive: true});
			});

			this.submitSetView.on("before_submit", function(){
				self.setAutoSaveDisk();
			});
		},

		getAutoSaveDisk: function() {
			var model = this.model;
			top.$App.getDiskAttConf(function(data){
				if(data.code == "S_OK"){
					// todo silent ?
					model.set({"largeattach_autosave": data["var"].largerAttSave}/*, {silent: true}*/);
				} else {
					top.M139.UI.TipMessage.show(model.messages.getSettingFailed, {className: "msgRed", delay:"2000"});
				}
			});
		},

		setAutoSaveDisk: function() {
			var model = this.model;
			var largeattach_autosave = (model.get("largeattach_autosave") == "0");	// 0 自动保存

			if(largeattach_autosave) {
				BH("set_largeattach_autosave_disk");
			}
			top.$App.setDiskAttConf(largeattach_autosave, function(data){
				if(data.code !== "S_OK"){
					top.M139.UI.TipMessage.show(model.messages.getSettingFailed, {className: "msgRed", delay:"2000"});
				}
			});
		}
	}));
})(jQuery, _, M139);
