(function(jQuery, Backbone, M139) {
	var $ = jQuery;
	M139.namespace('M2012.Compose.View.UploadForm', Backbone.View.extend(
	/**
	*@lends M2012.Compose.View.UploadForm.prototype
	*/
	{
		el: "div",
		
		events: {
		},

		template: ['<form target="{target}" enctype="multipart/form-data" method="post" action="{action}">',
					'	<input style="font-size:24px; position:absolute; right: 0;height:24px;" type="file" name="{fieldName}" />',	// title trick
					'</form>'].join(""),

		/*
		* @options
		*	- [required] fieldName 文件上传域的name
		*	- [optional] uploadUrl 上传地址，默认为根地址
		*	- [optional] wrapper 父元素，form和iframe都会添加到该元素下
		*	- [optional] accepts 允许上传的文件类型，仅在文件选择对话框进行过滤选择
		*	- [required] onSelect 选择文件后的处理过程
		*	- [required] onUploadFrameLoad 请求返回数据，iframe触发onload事件处理
		*/
		initialize: function (options) {
			var uniqueId = M2012.Compose.View.UploadForm.UID++;
			options = options || {};
			// 不要让多实例共享iframe，绑定多次onload会重复处理
			this.frameId = options.frameId || ("_hideFrame_" + uniqueId);
			this.template = M139.Text.Utils.format(this.template, {
				target: this.frameId,
				fieldName: (options.fieldName || "file"),
				action: options.uploadUrl || "/"
			});
			function noop(){return true}

			this.accepts = options.accepts;
			this.onSelect = options.onSelect || noop;
			this.onUploadFrameLoad = options.onUploadFrameLoad || noop;
			this.wrapper = options.wrapper || document.body;
			var $el = $(this.template).appendTo( this.wrapper );
			this.setElement($el);	// make sure that the view have only one `input:file` element inside.
		},

		render: function(){
			this.resetAccepts();
			this.initEvents();
			//this.$el.hide();	// don't! if we want to click it.
			return this;
		},

		initEvents: function(){
			var This = this;
			this.$("input").on("change", function(){
				var form, jFrame, value;

				form = this.form;
				value = this.value;

				if(!(value && This.onSelect(value, $Url.getFileExtName(value)))) {
					form.reset();
					return ;
				}

				jFrame = This.getHideFrame();
				jFrame.one("load", function(){
					This.onUploadFrameLoad(this);
				});

				try {
					form.submit();
					form.reset();
				} catch(e) {
					jFrame.attr("src", "/m2012/html/blank.html").one("load", function() {
						form.submit();
						form.reset();
					});
				}
			})/*.on("click", function(){
				This.isUserClick = true;	// 用户手动点击了按钮（而非模拟点击）
			})*/;
		},

		/*
		* 指定上传文件选择对话框过滤的文件类型
		*/
		resetAccepts: function(accepts){
			var types = accepts || this.accepts;
			var mimes = M2012.Compose.View.UploadForm.mimeTypes;
			if(_.isArray(this.accepts)){
				types = _.map(types, function(key){
					return mimes[key];
				});
				types = _.unique(types).join(", ");
				this.$("input").attr("accept", types);
			}
		},

		getHideFrame: function(){
			var This = this;
			var id = "#"+this.frameId;
			var jFrame = $(this.wrapper).closest("body").find(id);
			if(jFrame.length == 0){
				// todo 使用id !!! 否则每次都会重复一个iframe
				jFrame = $('<iframe id="' + this.frameId + '" name="' + this.frameId + '" style="display:none"></iframe>').appendTo( this.wrapper );
			}
			return jFrame;
		}
	}, {
		UID: 0,
		mimeTypes: {
			"gif" : "image/gif",
			"jpg" : "image/jpeg",
			"bmp" : "image/bmp",
			"png" : "image/png",
			"txt" : "text/plain",
			"doc" : "application/msword",
			"docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"ppt" : "application/vnd.ms-powerpoint",
			"pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"xls" : "application/vnd.ms-excel",
			"xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"pdf" : "application/pdf",
			"mp3" : "audio/mpeg",
			"mp4" : "video/mp4",
			"zip" : "application/zip",
			"rar" : "application/octet-stream",
			"flv" : "flv-application/octet-stream"	// todo not supported ?
		}
	}));
})(jQuery, Backbone, M139);
