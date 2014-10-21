
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.UI.UploadImage.Menu.View', superClass.extend(
	/**
	 *@lends M2012.UI.UploadImage.Menu.View.prototype
	 */
	{
		initialize: function(options){
			this.wrapper = $(options.wrapper)[0];
			this.template = options.template;
			this.uploadImageMenus = M2012.UI.PopMenu.create({
				container: document.body,
				dockElement: this.wrapper,
				hideInsteadOfRemove: true,
				template: this.template,
				items:[]
			});
		},

		render: function(){
			/** 插入图片菜单按钮 **/
		
			//window.uploadImageMenus = uploadImageMenus;	// for debug
			var uploadImageMenus = this.uploadImageMenus;

			$(this.wrapper).css("position", "relative").on("click", function(e){
				var isHide = uploadImageMenus.isHide();
				e.stopPropagation();	// 必须，否则首次无法show
				if(isHide) {
					M139.Dom.dockElement(this, uploadImageMenus.el, {dx: -20});
					uploadImageMenus.show();
					M139.Dom.bindAutoHide({
						stopEvent: true,
						action: "click",
						element: uploadImageMenus.el,
						callback: function(){
							uploadImageMenus.hide();
						}
					});
				} else {
					uploadImageMenus.hide();
				}
			});

			return this;
		},

		/*
		* 添加本地上传菜单项，插入本地上传图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addLocalUploadMenuItem: function(id){
			var wrapper;
			var uploadImageMenus = this.uploadImageMenus;
			var element = document.getElementById(id || "aLocalFile");	// 模板中的元素id

			if(element == null) {
				return;
			}

			wrapper = $('<div class="FloatingDiv"></div>');
			wrapper.css({
				position: "absolute",
				top:0,
				left:0,
				width: "100%",
				height: "22px",
				opacity: 0,
				overflow: "hidden",
				padding: "0px",
				zIndex: 1024
			}).appendTo($(element).css("position", "relative"));

			new M2012.Compose.View.UploadForm({
				wrapper: wrapper,
				accepts: ["bmp", "png", "jpg", "jpeg", "gif"],
				uploadUrl: utool.getControlUploadUrl(true),
				onSelect: function(value, ext){
					BH("compose_editor_image_local");
					uploadImageMenus.hide();

					if (_.indexOf(this.accepts, ext) == -1) {
						$Msg.alert("只允许插入jpg, jpeg, gif, bmp, png格式的图片", {icon:"warn"});
						return false;
					}

					if(window.conversationPage && window.PageMid){
						top.$App.trigger('uploadImgStart_' + window.PageMid,{});				
					}
					return true;
				},
				onUploadFrameLoad: function (frame) {
					var imageUrl = utool.getControlUploadedAttachUrl(frame);
					imageUrl && htmlEditorView.editorView.editor.insertImage(imageUrl);
				}
			}).render();

			$(element).on("click", function(){});
		},

		/*
		* 添加网络图片上传菜单项，插入网络图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addInternetUploadMenuItem: function(id){
			var uploadImageMenus = this.uploadImageMenus;
			var element = document.getElementById(id || "aInternetFile");

			var internetMenu = new M2012.UI.UploadImage.InternetImageMenu();

			$(element).on("click", function(){
				BH({key: "compose_editor_image_net"});
				internetMenu.render().show({
					dockElement: document.getElementById("aInsertPic")
				});
				uploadImageMenus.hide();
			});
		},

		/*
		* 添加手机图片上传菜单项，插入手机图片到编辑器
		* @param id 和模板中的菜单项id要对应
		*/

		addMobileUploadMenuItem: function(id){
			
		}
	}));
})(jQuery, _, M139);

// 上传网络图片组件类
M2012.UI.UploadImage.InternetImageMenu = Backbone.View.extend({
	events: {
		"click a.YesButton": "onYesClick",
		"click .CloseButton": "onCloseClick"
	},
	initialize: function(options) {
		var $el = jQuery((options && options.template) || this.template);
		this.setElement($el);
	},
	template: ['<div class="tips delmailTips netpictips" style="z-index:9999;display:none;">', '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>', '<div class="tips-text">', '<div class="netpictipsdiv">', '<p>插入网络照片</p>', '<p>', '<input type="text" class="iText" value="http://">', '</p>', '<p class="ErrorTip" style="color:red;display:none">图片地址格式错误</p>', '<p style="color:#666">右键点击所选图片，进入“属性”对话框，即可获取图片地址</p>', '</div>', '<div class="delmailTipsBtn"><a href="javascript:void(0)" class="btnNormal vm YesButton"><span>确 定</span></a></div>', '</div>', '<div class="tipsTop diamond covtop"></div>', '</div>'].join(""),

	render: function() {
		this.$el.appendTo(document.body);
		return this;
	},

	onCloseClick: function(e) {
		this.$(".ErrorTip").hide();
		this.hide();
	},
	onYesClick: function(e) {
		var url = this.$("input:text").val().trim();
		if (!M139.Text.Url.isUrl(url)) {
			this.$(".ErrorTip").show();
			return;
		}

		this.$(".ErrorTip").hide();
		this.hide();

		htmlEditorView.editorView.editor.insertImage(url);
		return false;
	},
	show: function(options) {
		var self = this;
		var distance, docker = options.dockElement;

		if(docker.getBoundingClientRect){
			distance = this.$el.width() + docker.getBoundingClientRect().right - $(window).width();
			if(distance < 20) distance = 20;
			this.$el.find(".diamond").css("left", 10+distance+"px");
		}
		this.$el.show();
		this.$("input").val("http://").select();

		//停靠在按钮旁边
		console.log();
		M139.Dom.dockElement(docker, this.el, {dx: -distance, dy:10});

		M139.Dom.bindAutoHide({
			stopEvent: true,
			action: "click",
			element: this.el,
			callback: function() {
				self.hide();
			}
		});
	},
	hide: function() {
		this.$el.hide();
		M139.Dom.unBindAutoHide({element: this.el});
	}
});
