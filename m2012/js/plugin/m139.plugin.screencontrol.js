(function () {
    M139.core.namespace("M139.Plugin.ScreenControl", {
    	/**
		 * 安装截屏控件是否成功
		 * <pre>示例：<br>
		 * <br>Utils.isScreenControlSetup(ture,true);
		 * </pre>
		 * @param {Boolean} showTip 可选参数，是否显示提示消息。
		 * @param {Boolean} cacheResult 是否使用父级窗口控件。
		 * @return{true|false}
		 */
		isScreenControlSetup : function(showTip, cacheResult, isShowDialog) {
		    if (isShowDialog) return showDialog();
		    if (top.isScreenControlSetup != undefined && cacheResult) {
		        return top.isScreenControlSetup;
		    }
		    //if (!$B.is.ie) {
		        //if (showTip) alert("截屏功能仅能在IE浏览器下使用");
		        //return false;
		    //}
			if (window.navigator.platform == "Win64") { //64位浏览器暂时不支持139小工具
		        if (showTip) alert("当前浏览器暂不支持安装139邮箱小工具");
		        return false;
		    }
            if(!$B.is.windows){ //非windows系统不支持139小工具
                if (showTip) alert("当前操作系统暂不支持安装139邮箱小工具");
                return false;
            }
            
		    var setup = false;
		    try {
		        if (window.ActiveXObject !== undefined) { //ie11下 window.ActiveXObject ==undefined   !==undefined
		            var obj = new ActiveXObject("ScreenSnapshotCtrl.ScreenSnapshot.1");
		            if (obj) setup = true;
		        } else if (navigator.mimeTypes) {
		            var mimetype = navigator.mimeTypes["application/x-richinfo-screensnaphot"];
		            if (mimetype && mimetype.enabledPlugin) {
		                setup = true;
		            }
		        }
		    } catch (e) {
		
		    }
		    if (!setup && showTip) {
		        //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		        showDialog();
		    } else if (setup && showTip && top.SiteConfig.screenControlVersion && document.all) {
		        var version = obj.GetVersion();
		        if (version < top.SiteConfig.screenControlVersion || (location.host.indexOf("10086") >= 0 && version == 16777477)) {
		            setup = false;
		            //___openWin("使用截屏功能必须安装139邮箱控件,是否安装?");
		            showDialog();
		        }
		    }
		    // todo
		    function showDialog() {
		        //var exeFileUrl = top.ucDomain + "/ControlUpdate/mail139_tool_setup.exe";
		        var exeFileUrl = top.LinkConfig.smallToolSetup.url;
		        var htmlCode = ['<div class="pl_15 pt_15 pr_15 pb_15">'
                                ,'<p class="c_666">安装139邮箱小工具后，您可以使用以下功能：</p>'
                                ,'<table class="mestip-tab"><tr>'
                                ,'<td width="40"><i class="mes-t-1"></i></td>'
                                ,'<td>上传<span class="c_009900 fw_b">2G </span>超大附件</td>'
                                ,'<td width="40"><i class="mes-t-2"></i></td>'
                                ,'<td>粘贴图片到正文<br>粘贴方式上传附件</td>'
                                ,'</tr><tr>'
                                ,'<td width="40"><i class="mes-t-4"></i></td>'
                                ,'<td>截屏</td>'
                                ,'<td width="40"><i class="mes-t-3"></i></td>'
                                ,'<td>鼠标右键快递文件</td>'
                                ,'</tr></table></div>'].join("");
		        top.$Msg.showHTML(htmlCode,
		        	function(){
		        		//M139.Plugin.ScreenControl.openControlDownload();
		        		top.$App.show("smallTool");
		        	},
		        	function(){
		        		window.open(exeFileUrl);
		        	},
		        	function(){
		        	},
		        	{
						dialogTitle:'139邮箱小工具安装提示',
				        buttons:['在线安装','下载安装','取消']
				    });
		    }
		    
		    delete obj;
		    top.isScreenControlSetup = setup;
		    return setup;
		},
		/**
		 * 打开使用控件下载的页面
		 * <pre>示例：<br>
		 * <br>Utils.openControlDownload(true);
		 * </pre>
		 * @param {Boolean} removeUploadproxy 可选参数，使用后是否移动窗口
		 */
		openControlDownload : function(removeUploadproxy) {
			// todo
			//top.ucDomain = 'http://' + location.host +  '/g2/';
			var urlDomain = '';
			if(top.ucDomain){
				urlDomain = top.ucDomain;
			}else{
				urlDomain = 'http://g2.mail.10086.cn';
			}
		    var win = window.open(urlDomain + "/LargeAttachments/html/control139.htm");
		    setTimeout(function() { win.focus(); }, 0);
		    //top.addBehavior("文件快递-客户端下载");
		    if (removeUploadproxy) {
		        removeUploadproxyWindow();
		    }
		},
		removeUploadproxyWindow : function(){
		    try{
		       // top.addBehavior("文件快递-客户端下载");
		        top.$("#uploadproxy").attr("src", "about:blank");
		        top.$("#uploadproxy").remove();
		    }catch(e){}
		}
    });
    
})();