//日志上报
var toos = {
    sendLog: function (logInfo) {
        var log = '<object><string name="version">m2012</string><array name="behaviors"><object>';
        //noencode
        for (var p in logInfo) {
            log += '<string name="' + p.toUpperCase() + '">' + logInfo[p] + '</string>';
        }
        log += '</object></array></object>';
        var url = (window.SiteConfig && SiteConfig.scriptLog) || "/mw2/weather/weather?func=user:monitorLogAction";
        url += "&rnd=" + Math.random();
        LightHttpClient.post({
            url: url,
            data: log
        });
    }
}
var LightHttpClient = {
    post: function (options) {
        var xhr = this.getXHR();
        xhr.open("post", options.url, true);
        xhr.send(options.data || null);
    },
    getXHR: function (options) {
        var win = (options && options.window) || window;
        if (win.XMLHttpRequest) {
            return new win.XMLHttpRequest();
        } else {
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP'];
            for (var n = 0; n < MSXML.length; n++) {
                try {
                    return new win.ActiveXObject(MSXML[n]);
                    break;
                }catch (e) {}
            }
        }
    }
};

var downFile = function() {
		var me = this;
		var item = {};
		//正在下载的文件列表
		var files = [];
		var fileListInit = {};
		var fileListInitForFileName = {}; //add by zsx
		var fileListInitfileFid = {}; //add by zsx ,存彩云的话要读取这个id，下载的时候上上面那个id
		var intervalId = null;
		//请求下载次数
		var errCount = 0;
		var groupId = "";
		var fileBatDownloadLimit = 500 * 1024 * 1024;

		this.msg = {
			NoSelectedFile: "您未选择任何文件",
			noResponse: "服务无响应！",
			selecteFileSizeTip: "文件总大小超过500M，请分批下载！"
		};
		this.urls = {
			//初始化数据
			getDownloadFilesNewUrl: function() {
				//return fileSharing.resolveUrl("downLoadInitNew");
				return fsConfig["ajaxurl"] + "func=file:downLoadInitNew&sid=" + fileSharing.tool.getUserInfo() + "&rnd=" + Math.random();
			},
			getDownloadFilesUrl: function() {
				return fileSharing.resolveUrl("downLoadFileInit");
			},
			//文件下载
			getDownloadUrl: function() {
				return fileSharing.resolveUrl("downLoadMd");
			},
			//存彩云和一键存彩云
			getUploadFileUrl: function() {
				// return fileSharing.resolveUrl("toDiskForCenter");
				return fsConfig.serverPath + "func=file:toDiskForCenter&sid=" + fileSharing.tool.getUserInfo() + "&rnd=" + Math.random();
			},
			//下载和一键下载
			getBatDownloadUrl: function() {
				// return fileSharing.resolveUrl("fileBatDownload");
				//  return fsConfig.serverPath +"func=file:fileBatDownload&sid=" + fileSharing.tool.getUserInfo() + "&rnd=" + Math.random();
				return fsConfig["ajaxurl"] + "func=file:fileBatDownload&sid=" + fileSharing.tool.getUserInfo() + "&rnd=" + Math.random();
			},
			getDiskUrl: function() {
				return "{0}&sid={1}&id={2}".format(this.getMailUrl(), Utils.queryString("sid"), "diskDev");
			},
			getMailUrl: function() {
				return "http://" + location.host + "/main.htm?func=global:execTemp";
			},
			getBehaviorUrl: function() {
				return me.tool.getUrl(me.tool.getNetSiteUrl() + "Behavior/BehaviorGather.ashx", true);
			}
		};
		this.action = {
			pageLoad: function() {
				var action = this;
				sendIds = Utils.queryString("sendid");
				if (!sendIds) {
					//window.location.href = me.urls.getDownloadErrorUrl();
					return;
				}
				me.tool.createUserData();
				me.tool.createResourceUrl();
				$(function() {
					me.render.renderList(sendIds);
					action.bindEvent();
					me.render.renderLoginPop(); //登录失败，显示登录窗口
					me.tool.addBehavior({
						actionId: 18021,
						moduleId: 25,
						thingId: 0
					});
				});
			},
			bindEvent: function() {
				var action = this;
				$("#uploadBtn").click(function() {

					me.action.alertToDisk(groupId, action.getSendId(), action.getSendFileName());
					//去掉旧版的
					//action.upload(groupId, action.getSendId(), me.render.turnDiskPage);
					me.tool.addBehavior({
						actionId: 103725,
						moduleId: 25,
						thingId: 1
					});
					return false;
				});
				$("#downloadBtn").click(function() {
					var self = this;
					if (!me.action.validateDownload()) return;
					top.BH('fileexpress_getFiles');
					// add by zsx 防止用户频繁做下载动作
					var isDown = $(self).attr("down");
					if (isDown == "0") {
						return;
					}
					$(self).addClass("hover");
					$(self).attr("down", "0");
					window.setTimeout(function() {
						$(self).attr("down", "1");
						$(self).removeClass("hover");
					}, 5000);
					action.download(groupId, action.getSendId());
					me.tool.addBehavior({
						actionId: 103724,
						moduleId: 25,
						thingId: 1
					});
				});
				$("#loginBtn").click(function() {
					me.tool.addBehavior({
						actionId: 103728,
						moduleId: 25,
						thingId: 1
					});
				});
				/*$("#registerBtn").click(function() {
					me.tool.addBehavior({
						actionId: 103727,
						moduleId: 25,
						thingId: 1
					});
				});
*/				//添加全选按钮
				$("#checkAll").click(function() {
					action.getSelectedFilesAll();
				});
				//如果取消所有的选择，那么全选按钮也不选
				setTimeout(function() {
					action.ifAllAreNotChecked();
				}, 1000);
			},
			//设置单文件下载次数
			setFileRemain: function(row, file) {
				if (typeof(row.data("remains")) != "number") {
					return;
				}
				if (typeof(file.remainDownloadTimes) != "number") {
					return;
				}
				if (row.data("remains") == file.remainDownloadTimes) {
					return;
				}
				row.find("#times").html(file.remainDownloadTimes);
				row.data("remains", file.remainDownloadTimes);
				for (var i = 0, len = files.length; i < len; i++) {
					if (files[i] == file.sendId) {
						files.splice(i, 1);
						break;
					}
				}
				//设置下载按钮的隐藏和显示
				var lblTimes = row.find("#times");
				var btnDown = row.find("#btnDownload");
				var lblMsg = row.find("#lblMsg");
				if (file.remainDownloadTimes > 0) {
					btnDown.show();
					lblMsg.hide();
				} else {
					//检查是否无文件可下载
					if (me.tool.isNoFileToDown()) {
						return;
					}
					btnDown.hide();
					lblMsg.show();
				}
			},
			//设置多文件下载次数
			setFilesRemain: function(sendId) {
				if (files.length > 0) {
					for (var i = 0, len = files.length; i < len; i++) {
						if (files[i] != sendId) {
							files.push(sendId);
						}
					}
				} else {
					files.push(sendId);
				}
				if (intervalId) return;
				errCount = 0;
				intervalId = window.setInterval(function() {
					//如果请求接连出错3次，那么就停止请求
					if (errCount >= 3) {
						window.clearInterval(intervalId);
						intervalId = null;
						return;
					}
					if (files.length == 0) {
						window.clearInterval(intervalId);
						intervalId = null;
						return;
					}
					me.server.getDownFileList(files.join(","), function(result) {
						//连续请求出错3次则停止请求
						if (!result) {
							errCount++;
							return;
						}
						//只要有一次请求成功就将错误计数清零
						errCount = 0;
						if (this && this.length > 0) {
							for (var i = 0, len = this.length; i < len; i++) {
								if (!item[this[i].sendId]) {
									continue;
								}
								//设置页面剩余下载次数显示
								me.action.setFileRemain(item[this[i].sendId], this[i]);
								window.clearInterval(intervalId);
							}
						}
					}, true);
				}, 5000);
			},
			download: function(groupId, sendId, callback) {
				if (!sendId) {
					top.$Msg.alert(me.msg.NoSelectedFile);;
					return;
				}
				var url = "";
				me.server.downloadSendFile3(groupId, sendId, function(ret) {
					
					var sysIsipad = document.ontouchstart || $B.is.ios || $B.is.phone || $B.is.android;
					sysIsipad = sysIsipad || /android/i.test(navigator.userAgent);
					var ret = eval("(" + ret + ")").imageUrl;
					if (ret && ret.length > 0) {
						url = ret;
						if (callback) callback(ret);
						//	alert(sysIsipad);
						if (sysIsipad) {
							location.href = url;
						} else {
							$("#downloadFrame").attr('src', url);
						}


					}
				});
				if (url) {
					//   me.action.setFilesRemain(sendId);
					window.open(url);
				}
			},
			alertToDisk: function(groupId, fid) {
				if (!fid) {
					top.$Msg.alert(me.msg.NoSelectedFile);
					return;
				}
				if (!Utils.queryString("sid")) {
					me.render.showLoginPop();
					return;
				}
				/*var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
					ids: fid,
					fileName: name,
					comeFrom: 'fileCenter',
					type: "move",
					isForFileCenter: true,
					groupId: groupId
				});
				saveToDiskview.render().on("fileCenterSaveSuccess", function() {
					$("#ucList input:checked").each(function() {
						$("#ucList input:checked").parent().next().next().find('.fileStatus').html('<i class="icoOk"></i>已由后台自动保存！ 稍后进入彩云网盘查看')
					});

				});
*/
				me.action.getDirectorys(function(result){
					if(result.responseData && result.responseData.code== 'S_OK'){							
						$("#ucList input:checked").each(function() {
							$("#ucList input:checked").parent().next().next().find('.fileStatus').html('<i class="icoOk"></i>已由后台自动保存！ 稍后进入彩云网盘查看')
						});
						var directoryId = result.responseData['var'].init.baseInfo.rootId;
			            var requestData = {
			                groupId: groupId,
			                dirId: directoryId,
			                sendIds: fid
			            };
						M139.RichMail.API.call("file:toDiskForCenter",requestData,function(res){})

					}
				})
			},
			//获取彩云信息(所有目录信息)
	        getDirectorys : function(callback) {
				M139.RichMail.API.call("disk:index", null, function(res) {
					if(callback) {
						callback(res);
					}
				});	
			},
			upload: function(groupId, sendIds, callback) {
				if (!sendIds) {
					fileSharing.FF.alert(me.msg.NoSelectedFile);
					return;
				}
				if (!Utils.queryString("sid")) {
					me.render.showLoginPop();
					return;
				}
				var url = "";
				me.server.uploadSendFile(groupId, sendIds, function() {
					callback && callback();
				});
				me.tool.addBehavior({
					actionId: 103726,
					moduleId: 25,
					thingId: 1
				});
			},
			getSelectedFiles: function() {
				var selectedFiles = {};

				$("#ucList input:checked").each(function() {
					var sendId = $(this).attr("rel");

					selectedFiles[sendId] = fileListInit[sendId];
				});

				return selectedFiles;
			},
			//add by zhangsixue
			getSelectedFileName: function() {
				var selectedFiles = {};
				$("#ucList input:checked").each(function() {
					var fileName = $(this).parent().next().find("b").text();
					selectedFiles[fileName.shortName(28)] = fileListInitForFileName[fileName.shortName(28)];

				});
				return selectedFiles;
			},
			//add by zhangsixue
			getSelectedfileFid: function() {
				var selectedFiles = {};

				$("#ucList input:checked").each(function() {
					var sendId = $(this).attr("relfileFid");

					selectedFiles[sendId] = fileListInit[sendId];
				});

				return selectedFiles;
			},
			//如果有一个未选，则全选按钮不被选中，如果选完，则全选按钮被选中！
			ifAllAreNotChecked: function() {
				$("#ucList input[type='checkbox']").each(function() {
					var self = $(this);
					self.click(function() {
						if (self.prop("checked") == false) {
							$("#checkAll").prop("checked", false);
							return;
						}
						var t = 0;
						$("#ucList input[type='checkbox']").each(function() {
							if ($(this).prop("checked") == true) {
								t++;
							}
						})
						if ($("#ucList input[type='checkbox']").length === t) {
							$("#checkAll").prop("checked", true);
						}
					});

				})
			},
			getSelectedFilesAll: function() {
				//如果为全选，则全不选 add by zsx
				if ($("#checkAll").prop("checked") == false) {
					$("#ucList input[type='checkbox']").each(function() {
						$(this).prop("checked", false);
					});
					return;
				}
				$("#ucList input[type='checkbox']").each(function() {
					$(this).prop("checked", true);
				});
			},
			getSelectedFilesNum: function() {
				var num = 0,
					selectedFiles = this.getSelectedFiles();

				for (var i in selectedFiles) {
					num++;
				}

				return num;
			},
			//得到选中文件的sendId
			getSendId: function() {
				var sendIds = "",
					selectedFiles = this.getSelectedFiles();

				for (var key in selectedFiles) {
					sendIds += key + ",";
				}

				return sendIds.slice(0, -1);
			},
			//得到选中文件的fileName
			getSendFileName: function() {
				var sendnames = "",
					selectedFiles = this.getSelectedFileName();

				for (var key in selectedFiles) {
					sendnames += key + ",";
				}

				return sendnames.slice(0, -1);
			},
			//得到选中文件的fileFid
			getfileFid: function() {
				var fileFids = "",
					selectedFiles = this.getSelectedfileFid();

				for (var key in selectedFiles) {
					fileFids += key + ",";
				}

				return fileFids.slice(0, -1);
			},
			getSelectedFilesSize: function() {
				var selectedFiles = this.getSelectedFiles(),
					selectedFilesSize = 0;

				for (var i in selectedFiles) {
					var file = selectedFiles[i];
					selectedFilesSize += me.tool.getByteSize(file.fileSize);
				}

				return selectedFilesSize;
			},
			validateDownload: function() {
				//选择多个文件总大小大于500M
				if (this.getSelectedFilesNum() > 1 && this.getSelectedFilesSize() > fileBatDownloadLimit) {
					top.$Msg.alert(me.msg.selecteFileSizeTip);
					return false;
				}

				return true;
			}
		};
		this.render = {
			showNoFile: function(){
				var htmlCode = '<dl class="fileNone">' +
						'<dt><img src="' + m2012ResourceDomain + '/m2012/images/module/largeattachments/fileNone.jpg"></dt>' +
						'<dd class="mt_10 mb_10">文件已过期或不存在</dd>' +
						'<dd class="gray">您可以联系发件人再次获取文件</dd>' +
					'</dl>';
					document.getElementById("textContent").innerHTML = htmlCode;
			},
			renderList: function(sendIds) {
				me.server.getDownFileListByGroupIds(sendIds, function(responseText) {
					var res = eval("(" + responseText + ")");
					var container = $("#ucList");

					if (res.code == fsConfig.isError || !res["var"]) {
						me.render.showNoFile();
						return;
					}
					
					var list = res["var"]["fileList"];

					groupId = list[0].groupId;
					/*var listTemplate = ['<tr>',
						'<td width="34" class="th1"><input type="checkbox" rel="{7}" relfileFid="{8}" checked="true" /></td>',
						'<td class="th2">', '<dl>',
						'<dt><i class="{3}" style="text-indent:-9999px;"></i></dt>',
						'<dd title="{0}"><b class="fileName">{1}</b><em>（{2}）</em></dd>',
						'<dd class="gray" style="display:none;">下载次数：<span id="times">{6}</span>次</dd>',
						'</dl>', '</td>', '<td class="th3"><span class="gray">{5}</span></td>',
						'<td class="th3"><a id="btnDownload" href="javascript:;">下载</a>',
						'<label id="lblMsg" style="line-height:16px; padding-left:20px; display:none;">下载次数已经超过最大限制</label>',
						'<em class="pd10">|</em><a id="btnUpload" href="javascript:;">存彩云网盘</a></td>',
						'</tr>'].join("");
*/				var listTemplate = ['<tr>',
					'<td width="34" class="ta_c"><input checked="true" type="checkbox" name="" rel="{7}" relfileFid="{8}" /></td>',
					'<td width="70"><img src="' + m2012ResourceDomain + '/m2012/images/module/largeattachments/big/{3}.png" alt="" title="" /></td>',
					'<td>',
					'	<div class="fileCon">',
					'		<p class="fileNane">{1} <span>({2})</span></p>',
					'		<p class="fileStatus">过期时间：{5}</p>',
					'	</div>',
					'</td>',
					'</tr>'].join("");
					$.each(list, function(i, n) {
						var f = this;

						fileListInit[f.sendId] = f;
						fileListInitForFileName[f.fileName.shortName(28)] = f;

						var fragment = $(
						listTemplate.format($T.Html.encode(f.fileName), f.fileName.shortName(28).encode(), f.fileSize, fileSharing.tool.getFileImageClass(f.fileName), f.fileExt, f.remainTime, f.remainDownloadTimes, f.sendId, f.fileFid)).data("remains", f.remainDownloadTimes);
						//将列表节点存储
						item[f.sendId] = fragment;
						//下载事件
						/*fragment.find("#btnDownload").click(function() {
							top.BH('fileexpress_getFiles');
							var btn = this;
							//防止短时间内多次点击下载
							var isDown = $(btn).attr("down");
							if (isDown == "0") {
								return;
							}
							$(btn).attr("down", "0");
							window.setTimeout(function() {
								$(btn).attr("down", "1")
							}, 5000);
							me.action.download(f.groupId, f.sendId);
							return false;
						});
*/						//存彩云事件
						/*fragment.find("#btnUpload").click(function() {
							var btn = this;
							//防止短时间内多次点击下载
							var isDown = $(btn).attr("down");
							if (isDown == "0") {
								return;
							}
							$(btn).attr("down", "0");
							window.setTimeout(function() {
								$(btn).attr("down", "1")
							}, 2000);
							//改为存彩云
							me.action.alertToDisk(f.groupId, f.sendId, f.fileName.shortName(28));
							//      me.action.upload(f.groupId, f.sendId, me.render.turnDiskPage);
							return false;
						});
						var elementId = parseInt(this.remainDownloadTimes) > 0 ? "#lblMsg" : "#btnDownload";
	*/					//   fragment.find(elementId).css({ "display": "none" });
						fragment.insertBefore("#liMessage");
					});
					$(".dList").find("li:last").prev().css("border-bottom", "");
					//检查是否有可下载的文件
					//  if (me.tool.isNoFileToDown()) {
					//      return;
					//  }
					//显示过期文件提示
					me.render.rendFileExpTip(list.length);
				});
			},
			showLoginPop: function() {
				var loginPopEle = $("#loginPop");
				var loginMarkEle = $("#backgroundBG");
				//loginPopEle.length ? loginPopEle.show() : LoginPopView.renderLoginPop();
				if (loginPopEle.length) {
					loginPopEle.show();
					loginMarkEle.show();
					LoginPopView.fixLoginPop();
					return;
				}
				LoginPopView.renderLoginPop();

			},
			renderLoginPop: function(isShowLoginPop) {
				formReturnUrl = me.tool.getFormReturnUrl();
				LoginPopView.init({
					actionUrl: fsConfig.loginUrl,
					successUrl: formReturnUrl,
					failUrl: formReturnUrl,
					loginToolbarId: "loginToolbar",
					loginBtnId: "loginBtn"
				});
			},
			turnDiskPage: function() {
				window.open(me.urls.getDiskUrl());
			},
			//呈现文件过期提醒
			rendFileExpTip: function(downCount) {
				var sendIds = Utils.queryString("sendid");
				sendIds = sendIds ? sendIds : "";
				var sendList = $.grep(sendIds.split(","), function(n, i) {
					return n.length > 0;
				});
				var fileExpCount = sendList.length - downCount;
				if (fileExpCount > 0) {
					$("#spanCount").html(fileExpCount);
					$("#liMessage").show();
				} else {
					$("#liMessage").hide();
				}
			}
		};
		this.server = {
			//根据groupid获取下载文件列表
			getDownFileListByGroupIds: function(sendIds, callback) {
				M139.Timing.waitForReady("frames['proxy']._ajax", function() {
					frames['proxy']._ajax.SendRequest("post", me.urls.getDownloadFilesNewUrl(), XmlUtility.parseJson2Xml({
						groupIds: sendIds
					}), callback);
				});
			},
			//获取下载文件列表
			getDownFileList: function(sendIds, callback, async) {
				async = async ? true : false;
				$.postXml({
					url: me.urls.getDownloadFilesUrl(),
					data: XmlUtility.parseJson2Xml({
						groupId: Utils.queryString("sendid"),
						sendIds: sendIds
					}),
					async: async,
					success: function(result) {
						var result = null;
						if (this.code == fsConfig.isOk) {
							result = this["var"].fileList;
						}
						if (callback) callback.call(result, result);
					},
					error: function(error) {
						if (callback) callback.call(null, null);
					}
				});
			},
			//下载
			downloadSendFile: function(groupId, sendId, callback) {
				$.postXml({
					url: me.urls.getBatDownloadUrl(),
					data: XmlUtility.parseJson2Xml({
						groupId: groupId,
						sendIds: sendId
					}),
					async: false,
					success: function(result) {
						if (this.code != fsConfig.isOk) {
							fileSharing.FF.alert(this.summary || me.msg.noResponse);
							return;
						}
						if (callback) {
							callback(this.imageUrl);
						}
					},
					error: function(error) {
						fileSharing.tool.handleError(error);
					}
				});
			},
			downloadSendFile3: function(groupId, sendId, callback) {
				M139.Timing.waitForReady("frames['proxy']._ajax", function() {
					frames['proxy']._ajax.SendRequest("post", me.urls.getBatDownloadUrl(), XmlUtility.parseJson2Xml({
						groupId: groupId,
						sendIds: sendId
					}), callback);
				});
			},
			//上传文件
			uploadSendFile: function(groupId, sendIds, callback) {
				$.postXml({
					url: me.urls.getUploadFileUrl(),
					data: XmlUtility.parseJson2Xml({
						//directoryId: "10",
						//comeFrom: "0",
						//bItemId: 0,
						//type: 0,
						groupId: groupId,
						sendIds: sendIds
					}),
					async: false,
					success: function(result) {
						if (this.code != fsConfig.isOk) {
							fileSharing.FF.alert(this.summary || me.msg.noResponse);
							return;
						}
						callback && callback();
						me.tool.addBehavior({
							actionId: 12,
							moduleId: 25,
							thingId: 5
						});
					},
					error: function(error) {
						fileSharing.tool.handleError(error);
					}
				});
			}
		};
		this.tool = {
			createUserData: function() {
				var str = Utils.getCookie("UserData");
				window.UserData = str ? eval("(" + str + ")") : {};
			},
			getFormReturnUrl: function() {
				var match = location.href.match(/^[^?]+\?[^?&]*/);
				return match ? match[0] : "";
			},
			isGrayNet: function() {
				return Utils.getCookie("cookiepartid") != "12";
			},
			getNetSiteUrl: function() {
				return this.isGrayNet() ? "http://g3.mail.10086.cn/" : "http://g2.mail.10086.cn/";
			},
			addBehavior: function(data) {
				var dataXml = "<reports><behavior id='{actionId}' extendID='{thingId}' mid='{moduleId}' index='8' pageId='' actionType='20' ext1='' ext2=''/></reports>";
				var formOption = {
					actionUrl: me.urls.getBehaviorUrl(),
					method: "post",
					inputName: "reports",
					data: String.format(dataXml, data)
				};
				this.createAjaxForm(formOption);
			},
			/*
        addBehavior: function(){
        var dataXml = "<reports><behavior id='{actionId}' extendID='{thingId}' mid='{moduleId}' index='8' pageId='' actionType='20' ext1='' ext2=''/></reports>";
        this.apiProxyReady(this.getNetSiteUrl(), function($){
        $.ajax({
        type: "post",
        url: me.urls.getBehaviorUrl(),
        data: {reports: dataXml},
        success: function(){},
        error: function(){}
        })
        }, "proxyFrame");
        },*/
			createAjaxForm: function(o) {
				var doc = document,
					div = doc.createElement("div"),
					ajaxFormEle = doc.getElementById("ajaxForm");

				if (!ajaxFormEle) {
					var formHtml = ['<form id="ajaxForm" target="targetFrame" action="{0}" method="{1}">', '<input type="hidden" name="{2}" />', '</form>', '<iframe id="targetFrame" name="targetFrame" style="display:none;"></iframe>'].join("");

					div.innerHTML = formHtml.format(o.actionUrl, o.method || "get", o.inputName || "input");
					doc.body.appendChild(div);
					var ajaxFormEle = doc.getElementById("ajaxForm");
				}
				var inputEle = ajaxFormEle.children[0];
				inputEle.value = o.data;
				ajaxForm.submit();
			},
			getUrl: function(url, isSid) {
				var newUrl = url;
				isSid && (newUrl += (url.indexOf("?") != -1 ? "&sid=" : "?sid=") + Utils.queryString("sid"));
				newUrl += (newUrl.indexOf("?") != -1 ? "&rnd=" : "?rnd=") + Math.random();
				return newUrl;
			},
			createResourceUrl: function() {
				top.resourcePath = fileSharing.getResourcePath();
			},
			//判断全部文件的剩余下载次数是否均为0 ,kill下载次数
			/*
        isNoFileToDown: function () {
        var isNoFile = true;
        for (var i in item) {
        if (item[i].data("remains") > 0) {
        isNoFile = false;
        return false;
        }
        }
        if (isNoFile) {
        window.location.href = me.urls.getDownloadErrorUrl();
        }
        return isNoFile;
        },
        */
			/*
        * 文件大小转换成字节 如：1000
        * @param {String} 文件大小 如：1M
        */
			getByteSize: function(size) {
				var convertor = {
					"G": 1024 * 1024 * 1024,
					"M": 1024 * 1024,
					"K": 1024,
					"B": 1
				};
				var newSize = "";

				try {
					var sizeObj = { //size = "100K"
						number: size.slice(0, size.length - 1),
						unit: size.slice(-1)
					};

					newSize = sizeObj.number * convertor[sizeObj.unit];
				} catch (ex) {
					newSize = 0;
				}

				return newSize;
			}
		};

	};
//执行脚本加载页面
new downFile().action.pageLoad();