/**
 * @fileOverview 写信编辑器上方上传工具栏视图层.
 * @namespace
 */
(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;
	M139.namespace('M2012.Compose.View.Upload', superClass.extend(
	/**
	 *@lends M2012.Compose.View.Upload.prototype
	 */
	{
		el : "#composeUploadBar",
		name : "composeUpload",
		events : {
			"click #attachmentSwitchIcon": "showUploadMenu"
		},
		initialize : function(options) {
			this.model = options.model;
			var uploadTip = $("#divUploadTip");
			if(uploadTip.length == 0){
				uploadTip = $('<span id="divUploadTip" class="msg msgWhite ta_l" style="display:none;"></span>')
					.css("z-index", 128).appendTo(document.body);
			}
			this.initEvents();
			this.initializeUploadMenuList();
			return superClass.prototype.initialize.apply(this, arguments);
		},

		// 渲染附件附件列表
		render: function(dataSet){
			if (dataSet && dataSet.attachments) {
				this.model.composeAttachs = dataSet.attachments.concat();
			}
			uploadManager.refresh();
		},
		initEvents : function(){
			var self = this;

			var uploadPicMenu = new M2012.UI.UploadImage.Menu.View({
				template: ['<div class="menuPop shadow picpop" style="z-index:999;width:' + (top.$App.isReadSessionMail() ? "80":"133") + 'px;display:none;">',
						'<a id="aLocalFile" class="LocalFile" href="javascript:;">本地图片</a>',
						'<a id="aInternetFile" class="InternetFile" href="javascript:;">网络图片</a>',
						// 验收环境或会话邮件隐藏此菜单项
						(location.href.indexOf("rd139cm") > 0 || top.$App.isReadSessionMail()) ? '' : '<a id="aMobilePic" href="javascript:;">从手机上传图片<i class="i_newsL"></i></a>',
						//'<a class="NetDiskFile" href="javascript:;">从彩云选取</a>',
					'</div>'].join(""),
				wrapper: document.getElementById("aInsertPic")
			}).render();
			uploadPicMenu.addLocalUploadMenuItem();
			uploadPicMenu.addInternetUploadMenuItem();
			uploadPicMenu.addMobileUploadMenuItem();

			/* 插入文档到编辑器 */

			/*虚拟进度条，实现太烂了..*/
			//new VirtualProgress({"step-duration": 3000}).addStep({progress:0.3, estimate:5000});

			var dlg;
			var progressElement;
			var startTime;
			var progressTimer, importFailTimer;
			var totalProgress;
			var randomTotalTime;
			var cancelInsert = false;
			var randRate;

			function initProgress(){
				startTime = +new Date();
				progressTimer = importFailTimer = null;
				totalProgress = 0;
				cancelInsert = false;
				randomTotalTime = (Math.random() * 20 + 40);	// 40s - 60s
				randRate = parseInt(Math.random() * 10 + 30);
			}

			// 上传，到30%
			function progress1(){
				var percent;
				//percent = parseInt((+new Date() - startTime)/randomTotalTime);

				totalProgress = parseInt((+new Date() - startTime)/randomTotalTime);
				if(totalProgress < 30) {
					percent = parseInt(Math.sqrt((200-totalProgress)*totalProgress)*0.6);
					//console.log(totalProgress, percent);
					progressElement.text(percent + "%");
					progressTimer = setTimeout(progress1, parseInt(Math.random() * 100 + 50));
				}
			}

			// 插入文档，预计5s到80%
			function progress2(){
				var percent;
				var p = (+new Date()-startTime)/5000;
				if(p < 1) {
					percent = randRate + parseInt((0.5 - Math.cos( p * Math.PI ) / 2)*40);
					//console.log(percent);
					progressElement.text(percent + "%");
					progressTimer = setTimeout(progress2, parseInt(Math.random() * 150 + 50));
				} else {
					//console.log("进入progress3");
					progressTimer = setTimeout(progress3, 300);
				}
			}

			function progress3() {
				randRate = parseInt(progressElement.text()) + parseInt(Math.random()*4);
				if(randRate < 97){
					progressElement.text(randRate + "%");
					progressTimer = setTimeout(progress3, 3000);
				}
			}

			element = document.getElementById("aInsertDoc");

			if(element) {
				wrapper = $('<div class="FloatingDiv"></div>');
				wrapper.css({
					position: "absolute",
					top:0,
					left:0,
					width: "72px",
					height: "20px",
					opacity: 0,
					overflow: "hidden",
					padding: "0px",
					"z-index": 1024
				}).appendTo($(element).css("position", "relative"));

				new M2012.Compose.View.UploadForm({
					wrapper: wrapper,
					uploadUrl: utool.getControlUploadUrl(true),
					accepts: ["doc", "docx", "xls", "xlsx", "txt"],
					onSelect: function(value, ext){
						if (_.indexOf(this.accepts, ext) == -1) {
							$Msg.alert("只允许插入" + this.accepts.join(", ") + "格式的文档", {icon:"warn"});
							return false;
						}

						(function(){
							var html = ['<div class="clearfix">',
								'<div style="text-align:center;padding:58px; padding-top:85px;">',
									'<img src="http://rescdn.qqmail.com/zh_CN/htmledition/images/ico_loading2104474.gif" style=""vertical-align: middle;>',
									'<span style="margin-left:10px;line-height: 32px;height: 32px;display: inline-block;zoom: 1;*display:block;">正在导入…<span class="docUploadPercent" style="display: inline;">0%</span></span>',
								'</div>',
							'</div>'].join("\r\n");

							dlg = top.$Msg.showHTML(html, {
								dialogTitle: "导入文档",
								width: 420,
								height: 220,
								buttons: [],
								onBeforeClose: function(){	// 手动关闭才会触发
									cancelInsert = true;
								},
								onClose: function(data) {
									clearTimeout(importFailTimer);
									clearTimeout(progressTimer);
								}
							});
							
							setTimeout(function(){
								progressElement = dlg.$el.find(".docUploadPercent");
								// progress.start();
								initProgress();
								importFailTimer = setTimeout(function(){
									top.M139.UI.TipMessage.show("导入文档失败", {delay:3000, className: "msgRed"});
									dlg.close();
								}, 60 * 1000);
								progress1();
							}, 0);
						})();

						return true;
					},
					onUploadFrameLoad: function (frame) {
						var model = self.model;

						try{
							var doc = frame.contentWindow.document;
							var responseText = doc.body.innerHTML || doc.documentElement.innerHTML;
							var returnObj = model.getReturnObj(responseText);

							if(!returnObj || !returnObj.fileId) {
								top.M139.UI.TipMessage.show("上传文件失败，请稍后再试", {delay:3000, className: "msgRed"});
								dlg.close();
								return ;
							}

							//console.log("进入progress2");
							//console.log(progressElement.text());
							clearTimeout(progressTimer);
							progress2();

							if(cancelInsert === false){
								self.getPreviewDoc(returnObj, function(html, code){
									clearTimeout(progressTimer);
									clearTimeout(importFailTimer);
									//console.log("OK, end at " + progressElement.text());
									if(html){
										progressElement.text("100%");
									}
									
									setTimeout(function(){
										var message = "";

										dlg.close();

										if(code == "4") {	// 文档加密
											message = "文档已加密，无法导入";
										} else if(html == ""){
											message = "导入文档失败";
										}
										if(html == "" || code == "4") {
											top.M139.UI.TipMessage.show(message, {delay:3000, className: "msgRed"});
											return ;
										}

										try{
											html = html.replace(/(<table.*?)(border="0")/ig, '$1border="1"');
											var div = document.createElement("div");
											div.innerHTML = html;
											var editor = htmlEditorView.editorView.editor;
											var styles = div.getElementsByTagName("style");
											var frag = document.createDocumentFragment();
											var editorBody = editor.editorDocument.body;
											var len = styles.length;
											while(styles[0]){	// believe what you see
												frag.appendChild(styles[0]);
											}
											if(len > 0){
												editorBody.insertBefore(frag, editorBody.firstChild);
											}
											html = div.innerHTML;
											if(!$B.is.ie && !$B.is.ie11){
												editor.execInsertHTML(html);
											} else {
												editor.splitOff();
												editor.insertHTML(html);
											}
											top.M139.UI.TipMessage.show("导入文档成功", {delay:3000});
										} catch(e) {
											top.M139.UI.TipMessage.show("导入文档失败", {delay:3000, className: "msgRed"});
										}
									}, 200);
								});
							}
						}catch(e){
							console.log(e.stack);
						}
					}
				}).render();

				$(element).on("click", function(){
					BH({key: "compose_import_doc"});
					self.hideUploadTip();
				}).mouseenter(function() {
					var options = {host: this, text: "将 word, excel, txt 文档导入到邮件正文"};
					self.showUploadTip(options);
				}).mouseleave(function() {
					self.hideUploadTip();
				});
			}

			/* 截屏上传 */

			$("#aScreenShot").on("click", function(){
				htmlEditorView.captureScreen();
			});

			$("#divUploadTip").on("mouseenter", function(e){
				clearTimeout(self.hideTimer);
			}).on("mouseleave", function(e){
				$(this).hide();
			});

			// 上传附件鼠标悬浮事件
			//if (!supportUploadType.isSupportFlashUpload && !window.conversationPage) {
			if(!window.conversationPage) {
				$("#floatDiv").mouseenter(function() {
					var options = {host: this, text: utool.getUploadTipMessage()};
					self.showUploadTip(options);
				}).mouseleave(function() {
					self.hideUploadTip();
				});
			}

			/* 超大附件和彩云网盘附件 */

			$("#aLargeAttach").click(function(event){
				self.showLargeAttachDialog();
				return false;
			}).mouseenter(function() {
				var options = {host: this, text: self.model.tipWords['UPLOAD_LARGEATTACH']};
				self.showUploadTip(options);
			}).mouseleave(function() {
				self.hideUploadTip();
			});
	        	$("#toAttachment").click(function(event){
        	    
	        	    //return false;
	        	});

			$("#caiyunDisk").click(function(event){
				if (top.$App.getCurrentTab().name.indexOf('compose_') > -1) {
					top.BH("compose_largeattach_disk");
				} else {
					top.BH('cMail_compose_uploadDisk');
				}
				
				self.showDiskDialog();
				top.$("li[tabid^='compose'] a").click(function(){
					if(top.dirid){
						top.dirid = "";
					}
				});
				return false;
			}).mouseenter(function(){
				var options = {host: this, text: "从彩云网盘选择文件发送"};
				self.showUploadTip(options); 
			}).mouseleave(function() {
				self.hideUploadTip();
			});

			$("#aMobilePic").click(function(e) {

				if(top.$App.isReadSessionMail()){
					return ;
				}

				if(window.mobileUploadTimer === undefined) {
					window.mobileUploadTimer = null;
				}

				$("#guideUpload").hide();

				var timeoutTimer = null;
				var dlg;
				var curFileId = "";
				var startTime;
				var html2 = ['<div class="mobileUpload clearfix">',
					'<img src="../images/201312/img_phone_02.jpg" class="mobileUpload-img2" />',
					'<p class="mobileUpload-introduction"></p>',
					'<span class="progressBarDiv">',
					'	<span class="progressBar"></span>',
					'	<span class="progressBarCur">',
					//'		<span style="width: 0%;-webkit-transition:width 2s ease;-moz-transition:width 2s ease;transition:width 2s ease;"></span>',
					'		<span style="width: 0%;"></span>',
					'	</span>',
					'</span>',
					'</div>'].join("\r\n");

				function showDlg() {

					var html = ['<div class="mobileUpload clearfix">',
						'<img src="../images/201312/img_phone_01.jpg" class="mobileUpload-img1" />',
						'<p class="mobileUpload-info">请查收短信，点击链接登录139邮箱，选择要上传的图片</p>',
						'<p class="mobileUpload-introduction">支持android、ios手机操作系统<a href="http://help.mail.10086.cn/statichtml/1/Content/3198.html" target="_blank">帮助</a></p>',
						'</div>'].join("\r\n");

					dlg = top.$Msg.showHTML(html, {
						dialogTitle: "从手机上传图片",
						width: 360,
						height: 235,
						buttons: [],
						onClose: function(data) {
							over();
						}
					});
				}

				function doInsert(file){
					over();
					self.insertImages([file.fileId]);
					upload_module.uploadedPics.push(file.fileName);
				}

				function detectAtInterval() {
					mobileUploadTimer = setTimeout(function(){
						refreshAttach2(function(file){
							//var newFileIds = _.pluck(uploadManager.fileList, "fileId");
							//var diffIds = _.difference(newFileIds, self.fileIds);

							//if(diffIds.length > 0){
							//	self.insertImages(diffIds);
							//}
							//detectAtInterval();

							if(file) {
								curFileId = file.fileId;

								//console.log(curFileId);
								if(file.status == 0) {		// 已上传完成
									if(!dlg.isClosed){	// note: undefined == false => false
										var bar = dlg.$el.find(".progressBarCur span");
										if(bar.length > 0){
											bar.stop(true, false).animate({"width": "100%"}, 1000, function(){
												doInsert(file);
											});
										} else {
											doInsert(file);
										}
									} else {
										self.insertImages([file.fileId]);
										// 记住，以防下次刷新再次插入正文
										upload_module.uploadedPics.push(file.fileName);
									}
								} else if(file.status == 1) {	// 上传中
									if(!dlg.progressing) {
										over();
										//setTimeout(function(){
										dlg = top.$Msg.showHTML(html2, {
											dialogTitle: "从手机上传图片",
											width: 360,
											height: 235,
											buttons: [],
											onClose: function(data) {
												var offset, offset2;
												var target = $("#attachContainer").find("li:last span:first");
												//var target = $("#attachContainer").find('[fileId="' + curFileId + '"]');
												//var target = $("#attachContainer").find('[fileId]');

												var dlgOutLine = $('<div style="position:absolute;display:none;z-index:9999;border:4px solid #666;background:transparent;"></div>').appendTo(top.document.body);

												offset = dlg.$el.offset();
												
												dlgOutLine.css({
													top: offset.top + "px",
													left: offset.left + "px",
													width: dlg.$el.width() + "px",
													height: dlg.$el.height() + "px"
												});

												// todo && curFileId
												if(curFileId && target.length > 0) {
													offset = target.offset();
													offset2 = top.$("[id^=compose]").offset();
													offset.top += offset2.top;
													offset.left += offset2.left;

													dlgOutLine.fadeIn(200).animate({
														top: offset.top + "px",
														left: offset.left - 10 + "px",
														width: target.width() + 80 + "px",
														height: "8px",
														opacity: 0.5
													}, 600, function(){
														$(this).fadeOut(function(){
															$(this).remove();
														});
													});
												}
												over();
											}
										});
										//}, 50);
										dlg.isClosed = false;
										dlg.progressing = true;
										startTime = +new Date();
									} else {
										// 计算进度
										//dlg.$el.find(".progressBarCur span").css("width", file.fileCurSize/file.fileRealSize * 100 + "%");
										//dlg.$el.find(".progressBarCur span").css("width", (100 - 300000 / (+new Date() - startTime)) + "%");
										dlg.$el.find(".progressBarCur span").stop(true, false).animate({"width": 100 - 100 / Math.sqrt((+new Date() - startTime)/1000) + "%"}, 3000);
									}
								}
							}

							detectAtInterval();
						});
					}, 3000);
				}

				//刷新附件iframe,可以取消普通上传
				function refreshAttach2(callback) {
					M139.RichMail.API.call("attach:refresh", {id : upload_module.model.composeId, type: 1}, function (result) {
						var i, j, len1, len2, found;
						var outFile, sfile, cfile, files, fileList;

						upload_module.model.composeAttachs = files = result.responseData["var"];
						fileList = uploadManager.fileList;

						for(i=0, len1=files.length; i<len1; i++){
							sfile = files[i];
							found = false;
							for(j=0, len2=fileList.length; j<len2; j++){
								cfile = fileList[j];
								if(cfile.fileId == sfile.fileId){
									//found = true;
									cfile.insertImage = sfile.insertImage;
									cfile.replaceImage = sfile.replaceImage;  //后台返回的附件数据没有replaceImage值，在这里加上，不然会显示内联附件列表
								}
							}
							for(j=0,len2=upload_module.uploadedPics.length; j<len2; j++){
								if(upload_module.uploadedPics[j] == sfile.fileName){
									found = true;
								}
							}
							if(found === false && /\.(?:gif|bmp|jpe?g|png|ico|tiff)$/.test(sfile.fileName)) {
								// todo 坑爹，fileList每次刷新都是重新构建的，无法寄存状态
								// 这个必须仅在第一次出现的时候标记一次，不然每刷新列表一次都会插入正文。
								if(sfile.clientType == 2) {	// 从酷版上传
									outFile = sfile;
								}
								//console.log("found new file: "+outFile);
							}
						}
						uploadManager.refresh(function(){
							callback(outFile);
						});
					});
				}
				//window.refreshAttach2 = refreshAttach2;

				upload_module.uploadedPics = [];
				for(var i=0; i<upload_module.model.composeAttachs.length; i++) {
					upload_module.uploadedPics.push(upload_module.model.composeAttachs[i].fileName);
				}

				function over() {
					console.log("dlg, timeout is over !!!");
					dlg.remove();
					dlg.isClosed = true;
					// todo 不清除了，内存泄漏？
					//clearTimeout(mobileUploadTimer);
					clearTimeout(timeoutTimer);
				}

				// 超时失败提示
				timeoutTimer = setTimeout(function() {
					var html;

					// todo 如果正在显示上传进度对话框，则直接返回
					if(dlg.isClosed !== true && !dlg.progressing) {
						html = ['<dl class="norTipsContent">',
							'<dt class="norTipsLine">未检测到上传成功的手机图片，已取消此操作。</dt>',
							'<dd class="norTipsLine gray">手机短信将无法进行图片上传，点击短信连接将登陆139酷版邮箱。</dd>',
						'</dl>'].join("\r\n");

						over();

						top.$Msg.confirm(html, {
							isHtml: true,
							icon: "i_warn",

							buttons: ["关闭"],
							dialogTitle: "从手机上传图片"
						});
					}
				}, 60 * 10 * 1000);

				showDlg();

				upload_module.model.requestComposeId();

				self.sendSysSms(function(data){
					if(data.code === "S_OK") {
						if(mobileUploadTimer){
							clearTimeout(mobileUploadTimer);
						}
						detectAtInterval();	// 发送成功，开始检测上传
					} else if(data.code === "WAPSEND_LIMIT"){
						over();
						top.$Msg.confirm("操作过于频繁，请稍后再试。", {
							icon: "i_warn",
							buttons: ["确定"],
							dialogTitle: "从手机上传图片"
						});
						clearTimeout(timeoutTimer);
					} else {
						over();
						top.$Msg.alert("网络异常，请稍后再试");
						clearTimeout(timeoutTimer);
					}
				});

				BH({key: "compose_mobile_upload_pic"});

				self.fileIds = _.pluck(uploadManager.fileList, "fileId");
			});


			top.$App.off('obtainCabinetFiles');
			top.$App.on('obtainCabinetFiles', function(files){
				var fileObjs = self.model.transformFileList(files);
				setNetLink(fileObjs);
				top.selectFileDialog3 && top.selectFileDialog3.close();
			});
		},

		sendSysSms: function(callback) {

			var url = "/mw2/sms/sms?func=sms:sendSysSms&sid=" + top.$App.getSid() + "&rnd=" + Math.random();
			var cnum = (top.$User.getAliasName("mobile") + "/" + top.$User.getAliasName("common")).replace(/@[^\/]*/g, "");
			//var url = "sms:sendSysSms";
			var postData = ['<object>',
				'<int name="type">1</int>',
				'<int name="attr">',
				[htmlEditorView.model.composeId, top.$App.getSid(), (new Date).getTime()].join("/"),
				"," + cnum,
				'</int>',
				'</object>'].join('');

			M139.RichMail.API.call(url, postData, function (result) {
				callback(result.responseData || {});
			});
		},

		insertImages: function(fileIds) {
			setTimeout(function(){
				top.WaitPannel.hide();
			}, 3000);

			BH({key: "compose_mobile_insert_pic"});

			if(!fileIds || fileIds.length === 0) {
				top.WaitPannel.show("未获取到图片，请稍后再试^^", {className: "msgRed"});
			} else {
				//console.log(fileIds);
				_.each(fileIds, function(fileId) {
					var file = utool.getFileById(fileId);
					var previewUrl = decodeURIComponent(file.getDownloadUrl());
					console.log("insert: " + previewUrl);
					htmlEditorView.editorView.editor.insertImage(previewUrl);
				});
				top.WaitPannel.show("上传成功");
			}
		},

		getPreviewDoc: function(info, callback){
			var account, info, url, downloadUrl;

			account = (top.$User.getAliasName("mobile")).replace(/@[^\/]*/g, "");
			url = "/mw2/opes/addOfficeToEmail.do?sid=" + top.sid + "&cguid=" + $TextUtils.getCGUID();
			downloadUrl = "http://"+location.host + this.model.getAttachUrl(info.fileId, info.fileName, false);

			var postData = {
				account: account,
				composeId: this.model.composeId,
				fileid: info.fileId,
				filename: encodeURIComponent(info.fileName),
				filedownurl: downloadUrl,
				fileSize: info.fileSize | 0,
				sid: top.sid,
				comefrom: "email",
				browsetype: 1,	// 文件转换方式, 1为html
				longHTTP: true
			};
			M139.RichMail.API.call(url, postData, function(result){
				var data = null,
					html = "";

				if(result) {
					data = result.responseData;
				}

				if(data && data.resultCode == "S_OK") {
					pages = data.fileContent;
					for(var i=0, len=pages.length; i < len; i++){
						page = pages[i];
						html += "<h3>" + page.fileName + "</h3>";
						html += page.content + "<br />";
					}
				}
				callback(html, data.code);
			});
		},

		// 选择彩云网盘弹出层
		showDiskDialog : function(){
			var self = this;

			if (top.selectFileDialog2) {
				top.selectFileDialog2.cancelMiniSize();
				return;
			}

			var selectFileDialog2 = top.selectFileDialog2 = top.$Msg.open({
				dialogTitle: "从彩云网盘选择",
				url: "selectfile/disk_write.html?sid=" + top.sid,
				width: 520,
				height: 468
			//  showMiniSize: true
			});


			selectFileDialog2.on("remove", function () {
				top.selectFileDialog2 = null;
			});

			top.$App.on('obtainSelectedFiles', function(files){ // 从选择文件弹窗获取用户选择的文件（本地文件，暂存柜，彩云）
				var fileObjs = self.model.transformFileList(files);
				//console.log(JSON.stringify(fileObjs));
				setNetLink(fileObjs);
				selectFileDialog2.close();
			});
			selectFileDialog2.on('remove', function(){
				top.$App.off('obtainSelectedFiles');
			});
		},
		showAttachmentDialog : function(){
		    var self = this;
		    self.model.requestComposeId();
			var selectFileDialog4 = top.selectFileDialog4 = top.$Msg.open({
			    dialogTitle: "从附件夹中选择",
			    url: "selectfile/attachment_write.html?sid=" +top.sid + "&"+"composeId="+self.model["composeId"],
			    width: 520,
			    height: 415
			//    showMiniSize: true
			});
			selectFileDialog4.on("remove", function () {
			    top.selectFileDialog4 = null;
			});

            top.$App.on('obtainAttachFiles', function(list){ 
                //var fileObjs = self.model.transformFileList(files);
                //console.log(JSON.stringify(fileObjs));
            	//setNetLink(fileObjs);
		        var newList = uploadManager.fileList ||[];
            	//for(var i = 0,len = files.length ; i<len ; i++){
	            	//uploadManager.fileList.push('UploadFileItem':files[i])
            	//}
			    for (var i = 0; i < list.length; i++) {
			        var fileInfo = list[i];
			        var file = new UploadFileItem({
			            type: "Common",
			            fileName: fileInfo.fileName || fileInfo.name,
			            fileId: fileInfo.id || fileInfo.fileId,
			            fileSize: fileInfo.fileSize || fileInfo.size || 0,
			            insertImage: fileInfo.insertImage,
			            replaceImage: fileInfo.replaceImage,
			            isComplete: true
			        });
			        newList.push(file);
					self.model.composeAttachs.push({
	                        fileId: fileInfo.id || fileInfo.fileId,
				            fileName: fileInfo.fileName || fileInfo.name,
				            fileSize: fileInfo.fileSize || fileInfo.size || 0,
							insertImage: fileInfo.insertImage,
							replaceImage: fileInfo.replaceImage
	                    });
			    }
			    //刷界面
			    //this.render({ type: "refresh" });




				uploadManager.render({ type: "add" })

            	selectFileDialog4.close();
            });
            selectFileDialog4.on('remove', function(){
            	top.$App.off('obtainAttachFiles');
            });
		},
        showLargeAttachDialog : function(){
            var self = this;
            BH({key : "compose_largeattach"});
            if(top.SiteConfig.isQuicklyShare){
				M139.RichMail.API.call("disk:init", null, function(res) {
					if(!res || !res.responseData) return ;
					res = res.responseData;
					if(res.code == "S_OK"){
						top.isMcloud = (res["var"].isMcloud != "0");
					}
				});
				self.selectFile();
			}else{
				self.createLargeAttachComponet();
			}
		},

		// 创建上传大附件组件
		createLargeAttachComponet : function(){
			var self = this;
			new M2012.UI.LargeAttach.Model().requireUpload({},function(view){
				self.uploadDialog = view;
				//选文件后的回调
				view.on("select", function (e) {
					//console.log(e);
					//e.files是文件列表, e.autoSend是指用户点击了，上传完自动发信
					if(e && e.files){
						BH({key : "compose_largeattachsuc"});
						
						var files = e.files;
						setNetLink(files);
						// 上传完成后自动发送邮件
						if(e.autoSend){
							mainView.toSendMail();
						}
					}
				});
			});
		},

		initializeUploadMenuList: function(){
			var self = this;
			self.uploadMenuList = [{
                text:"从邮件附件中选择",
                onClick:function(){
                    self.showAttachmentDialog();
                }
			},{
                text:"从网盘中选择",
                onClick:function(){
                    self.showDiskDialog();
                }
		        }];
		},

		showUploadMenu : function(){
			//BH({key : ""});
			
			var self = this;
			self.uploadMenu = M2012.UI.PopMenu.create({
				dockElement : $("#attachmentSwitchIcon")[0],
	            width : 130,
	            items : self.uploadMenuList,
	            dx: -77,
	            dy: 3,
	            onItemClick : function(item){
	                //alert("子项点击");
	            }
	        });
		},
		// 选择文件弹出层
		selectFile : function(){
			var self = this;

			if (window.selectFileDialog) {
				window.selectFileDialog.cancelMiniSize();
				return;
			}

			var selectFileDialog = window.selectFileDialog = top.$Msg.open({
				dialogTitle: "添加超大附件",
				url: "selectfile/largeAttach.html?sid=" + top.sid,
				width: 520,
				height: 401,
				showMiniSize: true
			});
			top.selectFileDialog001 = selectFileDialog;
			setTimeout(function(){
				window.selectFileDialog.setMiddle();
			},500);
			if (!M2012.UI.Widget.LargeAttachUploadTips) {
				M139.core.utilCreateScriptTag({
					id: "m2012.ui.widget.largeattachuploadtips",
					src: "/m2012/js/ui/widget/m2012.ui.widget.largeattachuploadtips.js",
					charset: "utf-8"
				});
			}

			selectFileDialog.on("minisize", function () {
				//最小化动画
				var offset = this.$el.offset();
				var obj = {
					top: offset.top,
					left: offset.left,
					height: this.$el.height(),
					width: this.$el.width()
				};
				var div = $('<div style="border:3px silver solid;position:absolute;z-index:9999"></div>').css(obj);
				div.appendTo(document.body).animate({
					left: $(document.body).width() - 200,
					top: $(document.body).height() - 200,
					height: 100,
					width: 100
				}, 300, function () {
					div.remove();
					var ball = new M2012.UI.Widget.LargeAttachUploadTips({
						dialog: selectFileDialog
					});
					ball.render();
				});

				top.BH("compose_largeattach_minisize");
			});

			selectFileDialog.on("remove", function () {
				window.selectFileDialog = null;
			});

			selectFileDialog.on("close", function (args) {
				//console.log($(this.el).html());
				var win = $(this.el).find("iframe")[0].contentWindow;
				var uploadModel = win.selectFileView.UploadApp.model;
				var isUploading = uploadModel.isUploading();

				if (isUploading) {
					if (window.confirm(win.selectFileView.model.tipWords["UPLOADING"])) {
						args.cancle = false;
					} else {
						removeFlash();
						args.cancel = true;
					}
				} else {
					removeFlash();
					args.cancel = false;
				}

				function removeFlash(){
					$("object", win.document).remove();
				}
			});
			top.$App.on('rebuildSelectFileDialog', function(obj){ // 选择文件弹窗根据页面内容调整高度
				selectFileDialog.jContainer.find('iframe').css(obj);
			});
			top.$App.on('obtainSelectedFiles', function(files){ // 从选择文件弹窗获取用户选择的文件（本地文件，暂存柜，彩云）
				var fileObjs = self.model.transformFileList(files);
				//console.log(JSON.stringify(fileObjs));
				setNetLink(fileObjs);
				if(top.autoSendMail){
					top.mainView.toSendMail();
				}
				top.autoSendMail = false;
				selectFileDialog.close();
			});
			selectFileDialog.on('remove', function(){
				top.$App.off('rebuildSelectFileDialog');
				top.$App.off('obtainSelectedFiles');
			});
		},
		/*
		 * 显示上传附件鼠标悬浮提示语
		 * @param options {host : document.getElementById("realUploadButton"), text : '添加小于50M的附件，可使用 Ctrl+V 粘贴附件和图片'}
		 */
		showUploadTip : function(options){
			if(!options){
				options = {host: $("#realUploadButton")[0], text: utool.getUploadTipMessage()};
			}
			if(window.conversationPage){return;}
			clearTimeout(this.hideTimer);
			var uploadTip = $("#divUploadTip").html(options.text);
			M139.Dom.dockElement(options.host, uploadTip[0]);
			uploadTip.show();
		},

		hideUploadTip : function(){
			var uploadTip = $("#divUploadTip");
			clearTimeout(this.hideTimer);
			this.hideTimer = setTimeout(function(){
				uploadTip.hide();
			}, 200);
		}
	}));
})(jQuery, _, M139);
