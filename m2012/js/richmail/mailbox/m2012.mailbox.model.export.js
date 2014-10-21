/**
 * 邮件导出
 * @author chengwei
 * update by sukunwei 
 */
M139.namespace("M2012.Mailbox.Model.Export", M139.Model.ModelBase.extend({
	name : "MailExport",
	initialize : function(options) {
		M139.Model.ModelBase.prototype.initialize.apply(this, arguments)
	},
	/**
	 * 导出邮件列表
	 * @param {Array} mids 邮件列表
	 * @param {Function} [callback] 回调函数
	 */
	exportMail : function(mids, callback) {
		if (mids && ( mids = $.isArray(mids) ? mids : [mids]).length) {

			// 添加路由信息
			var router = M139.HttpRouter, api = "mbox:downloadMessages";
			router.addRouter("webapp", [api]);
			
			//修复360请求两次bug,分两种情况：单个导出和多个导出
			if(mids.length > 1){
				
				// 组装请求报文
				var datagram = ['<object><array name="ids">'], length = mids.length;
				while (length--) {
					datagram.push('<string>' + mids[length] + '</string>');
				}
				datagram.push('</array></object>');
	
				// 发送表单请求
				this.ajaxForm({
					inputName : "ids",
					data : datagram.join(""),
					url : router.getUrl(api),
					formName : "exportMailForm",
					iframeName : "exportMailIframe"
				});
			
			}else{
					var exportUrl = router.getUrl(api) + '&mid=' + mids[0];
					window.open(exportUrl);
			}
			
			if ($.isFunction(callback)) {
				callback();
			}

		}
	},

	/**
	 * 导出文件夹
	 * @param {int} fid 
	 */
	exportFile:function(fid, callback){
		if(!fid){return}
		var fid = parseInt(fid,10);

		// 组装请求报文
		var datagram = '<object><int name="fid">' + fid + '</int></object>';
		// 提交表单
		this.ajaxForm({
			inputName : "fid",
			data : datagram,
			url : M139.HttpRouter.getUrl("mbox:packMessages"),
			formName : "exportMailForm",
			iframeName : "exportMailIframe"
		});

		if ($.isFunction(callback)) {
			callback();
		}
	},

	/**
	 * 构建表单请求
	 * @param {Object} options 配置对象
	 * @param {String} options.formName 表单名称
	 * @param {String} options.iframeName iframe名称
	 * @param {String} options.inputName 表单文本域名称
	 * @param {String} options.url 请求地址
	 * @param {String} options.data XML格式数据
	 */
	ajaxForm : function(options) {
		var doc = document, body = doc.body, form = doc.createElement("form"), o = options, input = createInput(o.inputName, o.data);

		form.name = o.formName;
		form.method = "post";
		form.action = o.url;
		if (form.encoding) {
			form.setAttribute("encoding", "multipart/form-data");
		}
		form.setAttribute("enctype", "multipart/form-data");
		if (!document.getElementById(o.iframeName)) {
			body.appendChild(createIframe(o.iframeName));
		}
		form.target = o.iframeName;
		form.appendChild(input);
		body.appendChild(form);
		form.submit();
		body.removeChild(form);

		top.M139.UI.TipMessage.hide();

		function createInput(name, value) {
			var input = document.createElement("input");
			input.value = value;
			input.name = name;
			input.type = "hidden";
			return input;
		}

		function createIframe(name) {
			var iframe;
			try {
				iframe = document.createElement('<iframe name="' + name + '"></iframe>');
			} catch (ex) {
				iframe = document.createElement("iframe");
				iframe.name = name;
			}
			iframe.id = name;
			iframe.style.display = "none";
			return iframe;
		}

	}
}));
