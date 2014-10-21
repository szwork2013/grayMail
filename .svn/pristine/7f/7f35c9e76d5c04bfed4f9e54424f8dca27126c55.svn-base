/*
*  新浪微博帐号绑定页面JS 
*/
var sinaBindPage = {
    Messages:{
        UnbindConfirm  :"取消绑定后将无法直接将文件发布到新浪微博中，您确定取消绑定吗？",
        SuccessTips    :"如果您需要彻底解除绑定，还需要到新浪微博中取消授权。",
		SystemError    :"系统错误，请稍候再试!"
    },
    /*页面初始化*/
    init:function(){
		$("#iframeserver").attr("src", DiskConf.proxyInterIp + "proxy.htm");
        this.Sid = Utils.queryString("sid");
        this.btnUnBind = $("#aUnBind");
        this.ipDisable = $("#ipDisable");
        //解除绑定
        $(this.btnUnBind).click(function(){
			sinaBindPage.unBindState();
        });
		Utils.waitForReady("document.getElementById('iframeserver').contentWindow.$.ajax", function() {
			sinaBindPage.getBindState();
		});
    },
    unBindState:function(){
        var This=this;
        DiskTool.FF.confirm(sinaBindPage.Messages.UnbindConfirm, function(){
			var ajaxObj = sinaBindPage.getAjaxObj();
            ajaxObj({
                type: "POST",
				contentType: "text/xml",
				dataType: "text",
				url : sinaBindPage.getPostUrl('weibocancelbinding'),
                success: function(result){
					try {
						var data = eval("(" + result + ")");
					} catch (ex) {
						var data = {
							code: "S_Error",
							summary: "请求服务器出错"
						};
					}
                    if(data.code == "S_OK") {
                        This.btnUnBind.hide();
                        This.ipDisable.show();
                    } else {
                        This.btnUnBind.show();
                        This.ipDisable.hide();
                    }             
                },
                error: function(error){
                    DiskTool.FF.alert(sinaBindPage.Messages.SystemError);
                }
            });
        });
    },
    /*获取用户绑定状态*/
    getBindState:function(){
        var This=this;
		var ajaxObj = sinaBindPage.getAjaxObj();
        ajaxObj({
			type: "POST",
			contentType: "text/xml",
			dataType: "text",
			url : sinaBindPage.getPostUrl('weiboisbinding', false, true),
			success: function(result){
				try {
					var data = eval("(" + result + ")");
				} catch (ex) {
					var data = {
						code: "S_Error",
						summary: "请求服务器出错"
					};
				}
				//1表示绑定，0表示未绑定
				if(data.isbinding == 0) {
					This.btnUnBind.hide();
					This.ipDisable.show();
				} else {
					This.btnUnBind.show();
					This.ipDisable.hide();
				}                    
			},
			error: function(error){
				DiskTool.FF.alert(This.Messages.SystemError);
			}
		});
      
    },
	/*组合URL*/
	getPostUrl: function(commName) {
		var pUrl = DiskTool.resolveUrl(commName);
		pUrl += "&sid=" + Utils.queryString("sid") + "&rnd="+ Math.random();
		return pUrl;
	},
	/*返回ajax对象*/
	getAjaxObj: function() {
		if(top.isRichmail) {//RM下请求为跨域
			return document.getElementById('iframeserver').contentWindow.$.ajax;
		} else {
			return $.ajax;
		}
	}
};
