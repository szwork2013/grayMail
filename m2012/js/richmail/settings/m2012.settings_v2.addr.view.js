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
