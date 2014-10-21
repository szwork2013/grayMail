//debugger;
//document.getElementById("attachAndDisk").style.display = "none";
var table = $("#attachAndDisk"),tables = $(".newAttachAndDisk"),isAcceptance = location.host.indexOf("rd139cm.com") > -1 ? false:false;
tables.hide();
table.hide();
var mid = top.$App.getCurrMailMid();
var curMail = top.$("#readmail_" + mid);
var readremark = top.$("#readremark_" + mid);
var links = $("#attachItem a").attr("href");
var receiveFiles = $("#attachItem table");
var diskItem = $("#diskItem");
//全部下载流程重新处理
var curMailDownLoadall = curMail.find("a[bh='readmail_downloadall']");
if (curMailDownLoadall.length > 0) {
	curMailDownLoadall.click(function (event) {
		//debugger;
		event.stopPropagation();
		var headAttach = curMail.find("#headAttach");
		var self = this;
		if (headAttach.find("li[f='disk']").length > 0 || headAttach.find("li[f='attach']").length > 0) {
			top.$Msg.confirm(
				"仅支持普通附件全部下载，超大附件和网盘附件请单个下载。",
				function () {
				top.$("#downloadDisk").attr("src", $(self).attr("href"));
			},
				function () {
				//do nothins
			});
		}
		return false;
	});
} else {
	curMailDownLoadall = curMail.find("span.total");
}

function fillDiskTemplateWidthData(){
	if(diskItem.length > 0) {
		var cont = [];
		if (diskItem.length > 0) {
			var dataStrings = diskItem.find(".dataString");
			for (var a = 0; a < dataStrings.length; a++) {
				var dataStringsitem = dataStrings.eq(a);
				cont.push($.parseJSON(dataStringsitem.text()));
			}
		}
	//	console.log(cont);
		var html = getDiskHtml(cont);

		//渲染彩云网盘
		if (curMail.find("#headAttach").find("li").length > 0) {
			curMail.find("#headAttach").find("li").last().after($(html));
		} else {
			var contain = '<div class="rMList" id="headAttach" ><span class="rMl">附　件：</span><div class="rMr convattrlist"><div id="infoSta" style="{display}" class="attachmentAll attachmentAll_on clearfix"><span class="total f1">共{num}个附件</span><a href="javascript:void(0);" class="attachmentAll_right"><i class="g-down" id="listUp" style="display:none;"></i><i class="g-up" id="listDown"></i></a></div><ul class="attachmentAll_list">{0}</ul></div></div>';
			if (html) {
				contain = contain.replace("{0}", html).replace("{num}", cont.length);
				if (cont.length == 1) {
					contain = contain.replace("{display}", "display:none;");
				}
			//	curMail.append(contain);
				readremark.after(contain);
			}
		}
		if(curMailDownLoadall.length == 0){
			curMailDownLoadall = curMail.find("span.total");
		}
		btnInitEvent();
		if (curMail.find("#headAttach").find("li").length > 1) {
			curMail.find("#infoSta").show();
		//	curMail.find("#headAttach").children("span").addClass("mt_4");
		}else{
		//	curMail.find("#headAttach").children("span").removeClass("mt_4");
		}
		var number = curMail.find("#headAttach").find("li[f]").length;
		if (curMailDownLoadall.is("span")) {
			curMailDownLoadall.text("共" + number + "个附件");
		} else {
			curMailDownLoadall.parent("span").prev().text("共" + number + "个附件");
		}
	}
}

//暂存柜处理
if (links) {
	var index = links.indexOf("sendid=");
	var groupId = links.substr(index + 7);
	top.$RM.call("file:downLoadInitNew", {
		"groupIds" : groupId
	}, function (res) {
		//debugger;
	//	console.log(res);
		if(res.responseData["code"] != "S_OK"){
		//	console.log("接口失败");
			fillDiskTemplateWidthData();
			return;
		}
		var data = res.responseData["var"]["fileList"];
		if(receiveFiles.length != data.length){
			var arr = [],flag = true;
			for(var i =0;i<receiveFiles.length;i++){
				arr.push(
					{
						fileName:$(receiveFiles[i]).find('span').html().replace(/<.*>$/,''),
						fileSize:'',
						sendId:'',
						fileFid:''	
					}
				)
			}
			for(var o = 0; o<arr.length;o++){
				flag = true;
				$.each(data,function(i){
					if(data[i].fileName == arr[o].fileName){
						flag = false;
					}
					
				})
				if(flag){
					data.push(arr[o]);
				}
				
			}
			
		}
		var html = getAttachHtml(data);
		//渲染暂存柜
		if (curMail.find("#headAttach").find("li").length > 0) {
			curMail.find("#headAttach").find("li").last().after($(html));
		} else {
			var contain = '<div class="rMList" id="headAttach" ><span class="rMl">附　件：</span><div class="rMr convattrlist"><div id="infoSta" style="{display}" class="attachmentAll attachmentAll_on clearfix"><span class="total f1">共{1}个附件</span><a href="javascript:void(0);" class="attachmentAll_right"><i class="g-down" id="listUp" style="display:none;"></i><i class="g-up" id="listDown"></i></a></div><ul class="attachmentAll_list">{0}</ul></div></div>';
			if (html) {
				contain = contain.replace("{0}", html).replace("{1}", data.length);
				if (data.length == 1) {
					contain = contain.replace("{display}", "display:none;");
				}
			//	curMail.append(contain);
				readremark.after(contain);
			}
		}
		fillDiskTemplateWidthData();
		btnInitEvent();
		// 重新渲染多少个文件
		var number = curMail.find("#headAttach").find("li[f]").length;
		if (curMailDownLoadall.is("span")) {
			curMailDownLoadall.text("共" + number + "个附件");
		} else {
			curMailDownLoadall.parent("span").prev().text("共" + number + "个附件");
		}
		if (number > 1) {
			curMail.find("#infoSta").show();
			curMail.find("#headAttach").children("span");//.addClass("mt_4");
		}else{
			curMail.find("#headAttach").children("span");//.removeClass("mt_4");
		}
		$(curMail).find("a[sendid][flag='down']").click(function () {
			//debugger;
			top.BH("readmail_down");
			var self = this;
			var sendid = $(this).attr("sendid");
			if ($(this).attr("down") != "1") {
				//处理下载
				top.$RM.call("file:fileBatDownload", {
					"groupId" : groupId,
					"sendIds" : sendid
				}, function (res) {
					//debugger;
					var imageUrl = res.responseData["imageUrl"];
					top.$("#downloadDisk").attr("src", imageUrl);
				});
			}
			$(this).attr("down", 1);
			window.setTimeout(function () {
				$(self).attr("down", "0")
			}, 5000);

		});
			var documentExts = "doc/docx/pdf/txt/htm/html/ppt/pptx/xls/xlsx/rar/zip/7z";// 可预览的文档拓展名
			var imageExts = "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe";// 图片类拓展名
			// 获取文件拓展名
		    function getExtname(fileName) {
				if (fileName) {
					var reg = /\.([^.]+)$/;
					var results = fileName.match(reg);
					return results ? results[1].toLowerCase() : "";
				} else {
					return "";
				}
			}
			function getPreviewType(fileName){
				var self = this;
				var ext = getExtname(fileName);
				if(!ext){
					return "";
				}
				if(documentExts.indexOf(ext) != -1){
					return 'DOCUMENT';
				}else if(imageExts.indexOf(ext) != -1){
					return 'IMAGE';
				}else{
					return "";
				}
			}
			function getResource() {
				var resourcePath = window.top.resourcePath;
				if (top.isRichmail) {//rm环境,返回rm变量
					resourcePath = window.top.rmResourcePath;
				}
				return resourcePath;
			}
			$(curMail).find("a[sendid][flag='prev']").each(function(){
				//debugger;
				var fileName = $(this).attr("fileName");
				var previewType = getPreviewType(fileName);
				var fsize = $(this).attr("fsize");
				if(!previewType || !isOverSize(fsize)){
				//	console.log('文件类型不支持预览！！');
				}else{
					//$(this).closest("span").show();
				}
				
				//判断附件的大小并提示
				function isOverSize(fileSize){
					if(!fileSize){
						return;
					}
					var transFileSize = 0;
					if(fileSize.indexOf("K") > -1){
						transFileSize = parseFloat(fileSize);
					}else if(fileSize.indexOf("M") > -1){
						transFileSize = parseFloat(fileSize) * 1024;
					}else if(fileSize.indexOf("G") > -1){
						transFileSize = parseFloat(fileSize) * 1024 * 1024;
					}
					
					if(transFileSize <= 1024 * 20){
						return true;
					}else{
						return false;
					}
				}
			});
		$(curMail).find("a[sendid][flag='prev']").click(function () {
			//debugger;
			top.BH("readmail_prev");
			var self = this;
			var sendid = $(this).attr("sendid");
			if(!sendid){
				return;
			}
			var fileName = $(this).attr("fileName");
			var fsize = $(this).attr("fsize");
			//判断附件的大小并提示
			function isOverSize(fileSize){
				if(!fileSize){
					return;
				}
				var transFileSize = 0;
				if(fileSize.indexOf("K") > -1){
					transFileSize = parseFloat(fileSize);
				}else if(fileSize.indexOf("M") > -1){
					transFileSize = parseFloat(fileSize) * 1024;
				}else if(fileSize.indexOf("G") > -1){
					transFileSize = parseFloat(fileSize) * 1024 * 1024;
				}
				
				if(transFileSize <= 1024 * 20){
					return true;
				}else{
					return false;
				}
			}
			/*
			
			*/
			if(!isOverSize(fsize)){
    		//	top.$Msg.alert('该文件超出了在线预览支持的文件大小，请下载后查看！');
    		//	return;
    		}
			if ($(this).attr("down") != "1") {
				//处理下载
				top.$RM.call("file:preDownload", {
					"fileIds" : sendid
				}, function (res) {
				//	debugger;
					var downloadUrl = res.responseData["imageUrl"];
					var previewType = getPreviewType(fileName);
					if(downloadUrl){
						if(previewType == "DOCUMENT"){
							// 预览文档  todo
							var PREVIEW_URL = '/m2012/html/onlinepreview/online_preview.html?src=disk&sid={0}&mo={1}&id={2}&dl={3}&fi={4}&skin={5}&resourcePath={6}&diskservice={7}&filesize={8}&disk={9}';
							var url = "http://" + top.location.host + PREVIEW_URL;
							url = top.M139.Text.Utils.format(url,{
								0:top.sid,
								1:top.uid,
								2:sendid,
								3:encodeURIComponent(downloadUrl),
								4:encodeURIComponent(fileName),
								5:top.UserConfig.skinPath,
								6:encodeURIComponent(getResource()),
								7:encodeURIComponent(top.SiteConfig.diskInterface),
								8:fsize,
								9:top.SiteConfig.disk
							});
		                    window.open(url);
						}else{
							var previewObj = {
		                        imgUrl: "",
		                        fileName : fileName,
		                        downLoad : downloadUrl,
		                        singlePreview : true
		                    };

							if (typeof (top.focusImagesView) != "undefined") {
								top.focusImagesView.render({ data: [previewObj], num : 0 });
							}else{
								top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
								top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
									top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
									top.focusImagesView.render({ data: [previewObj], num : 0});
								});
							}
						}
					}
				});
			}
			$(this).attr("down", 1);
			window.setTimeout(function () {
				$(self).attr("down", "0")
			}, 5000);

		});
		$(curMail).find("a[sendid][flag='save']").click(function () {
		//	debugger;
			var sendid = $(this).attr("sendid");
			var name = $(this).parent().attr("title");
			var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
					ids : sendid,
					fileName : name,
					comeFrom : 'largeAttach',
					type : "move",
					isForFileCenter : true,
					groupId : groupId,
					isreadmail:true
				});
			saveToDiskview.render().on("success", function () {
				
			});
		});
	});
}else{
	fillDiskTemplateWidthData();
}

function getAttachHtml(attach) {
	var thisTemplate = '<div class="rMList" id="headAttach" >{0}</div>';
	var litem = ['<li class="clearfix" index="" f="attach">',
		'<i class="{type} mr_5 mt_5 fl"></i>',
		'<span class="fl" title="{title}">{title}<span class="gray"></span>',
		'<span class="gray ml_10 {status}">({capacity}, {remainTime}后过期) </span>',
		'<span class="gray ml_10 {status2}">( {remainTime}) </span>',
		'<a bh="readmail_download" href="javascript:void(0);" class="{status}" sendid="{sendId}" flag="down" down="0">下载</a><span class="{status}" style="display:none;"> | <a bh="" href="javascript:void(0);" sendid="{filefid}" flag="prev" down="0" fileName="{title}" fsize="{capacity}">预览</a></span><span  > | <a bh="readmail_largeAttachSaveToDisk" href="javascript:void(0);" sendid="{sendId}" flag="save" down="0" fileName="{title}" >存彩云网盘</a></span>',
		'</span>',
		'</li>'].join("");
	var html = '';
	if (attach && attach.length > 0) {
		for (var t = 0; t < attach.length; t++) {
			var attachitem = attach[t],status='',status2 = 'hide';
			if(attachitem["remainTime"]){
				var remainTime = attachitem["remainTime"].split(/天|小时/);
				if(remainTime[1]){
					remainTime =  (++remainTime[0]) + "天";
				}else{
					remainTime =  remainTime[0] + "天";
				}
			}else{
				remainTime = '文件不存在或已过期';
				status = 'hide';
				status2 = ''
			}
			var ht = top.M139.Text.Utils.format(litem, {
					type : "i_bigAttachmentS",
					title : attachitem.fileName,
					capacity : attachitem.fileSize,
					sendId : attachitem.sendId,
					remainTime : remainTime,
					filefid : attachitem.fileFid,
					status : status,
					status2 : status2
				});
			html += ht;
		}
	}
	return html;
}
function getDiskHtml(disk) {
	var litem = ['<li class="clearfix isAcceptanceDisk" index="" f="disk">',
		'<i class="{type} mr_5 mt_5 fl"></i>',
		'<span class="fl" title="{title}">{title}<span class="gray"></span>',
		'<span class="gray ml_10">({capacity})<span class="tiquma pl_5 black" style="{display}">提取码：{tiquma}</span></span>',
		' <a target="_blank" href="{linkUrl}" bh="readmail_read">下载</a>',
		'</span>',
		'</li>'].join("");
	var data = '';
	var html = '';
	if (disk && disk.length > 0) {
		for (var t = 0; t < disk.length; t++) {
			var attachitem = disk[t];
			var linkUrl =isAcceptance?'javascript:void(0)':attachitem.linkUrl || attachitem.fileUrl;
			var ht = top.M139.Text.Utils.format(litem, {
					type : "i_cloudS",
					title : attachitem.fileName,
					capacity : top.M139.Text.Utils.getFileSizeText(attachitem.fileSize),
					linkUrl : linkUrl,
					display : attachitem.passwd ? "" : "display: none;",
					tiquma :　attachitem.passwd ? attachitem.passwd : ""
				});
			html += ht;
		}
	}
	
	return html;
}
//debugger;
function btnInitEvent(){
	var infoSta = top.$("#infoSta");
	var listUp = top.$("i[id='listUp']");
	var listUpH = top.$("i[id='listUp']:visible");
	var listDown = top.$("i[id='listDown']");
	var listDownH = top.$("i[id='listDown']:visible");
	
//	var infoStaCurrent = top.$("div[id='infoSta']");
	var infoStaCurrent = curMail.find("#infoSta");
	if (infoStaCurrent.next("ul").find("li").length > 20) {
		infoStaCurrent.next("ul").hide();
		listUp.show();
		listDown.hide();
	}
	
	top.$("div[id='infoSta']").unbind("click").bind("click", function () {
	//	debugger;
			top.BH("readmail_toggle");
			var self = this;
			if(top.$("i[id='listUp']:visible").length == 0){
				listDown.hide();
				$(self).next().slideUp();
				listUp.show();
			}else{
				listUp.hide();
				$(self).next().slideDown();
				listDown.show();
			}			
	});
	if(isAcceptance){
		top.$('.isAcceptanceDisk a').click(function(){
			top.M139.UI.TipMessage.show('该链接为华为彩云环境内网地址，无法访问!',{ delay:3000 });
			return false;
		})
	}
}
