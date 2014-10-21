var Arr_DiskAttach = []; //彩云附件数组
var Arr_OutLink = [];


function removeLargeAttach(fileId) {
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var f = Arr_DiskAttach[i];
		if (f.fileId == fileId) {
			Arr_DiskAttach.splice(i, 1);
			renderLargeAttachList();
			break;
		}
	}
}

// 写信页插入彩云外链 (xiaoyu) 
function getOutLinkHtml(data, callback) {
	M139.RichMail.API.call("disk:getOutLink", data, callback);
}

function getFileItemById(fileId) {
	var i, item = null;
	for (i = Arr_OutLink.length - 1; i >= 0; --i) {
		item = Arr_OutLink[i];
		if (item.fileId == fileId) break;
	}
	return i >= 0 ? item : null;
}
/** 
*附件存彩云
*/
function composeSaveToDisk(fileId) {
    var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
        ids : fileId,
        fileName : '',
        type : 'move',
        comeFrom: 'largeAttach'
    });
    moveToDiskview.render().on("success", function () {
        //self.model.trigger('refresh');
    });

}

// update by tkh
function renderLargeAttachList() {
	//跟普通附件用到同一个容器，所以很难搞，必须排在普通附件前面 jContainer = $("#attachContainer")
	uploadManager.jContainer.find("li[rel='largeAttach']").remove();
	var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="{fileType}"><i class="{fileIconClass}"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})<span class="tiquma pl_5 black" style="display:none;">提取码：{tiquma}</span></span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" onclick="removeLargeAttach(\'{fileId}\')">删除</a></li>';
					//<a hideFocus="1" class = "{isShowSaveToDisk}" href="javascript:void(0)" data-id="{objId}" bh="composemail_savedisk" onclick="composeSaveToDisk(\'{fileId}\')">存彩云网盘</a></li>';
	var attachListHtml = "";
	var fileIds = [];
	var requestData = {
		linkType: 0,
		encrypt: 0,
		pubType: 1,
		fileIds: ""
	};
	var needToshowList = [];
	Arr_OutLink.length = 0;
	//去掉彩云网盘的，但是copy一份，展示的时候都要显示
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var item = Arr_DiskAttach[i];
		needToshowList.push(item);
		// change the below and to or
		if (item.fileType == "netDisk") {
		//	Arr_DiskAttach.splice(i, 1);
		//	i--; // tu...
			Arr_OutLink.push(item);
			fileIds.push(item.fileId);
		} 
	}
	for(var j =0, len=needToshowList.length; j < len; j++){
		var item = needToshowList[j];
		var shortName = utool.shortName(item.fileName),
			prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
			suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
		var fileIconClass = $T.Utils.getFileIcoClass(0, item.fileName);
		var fileClass = "";
			var isShowSaveToDisk= "";
		if(item["fileType"] == "netDisk"){
			fileClass = "i_cloudS";
				isShowSaveToDisk = 'hide';
		}else if(item["fileType"] == "keepFolder"){
			fileClass = "i_bigAttachmentS";
		}
		var data = {
			objId : item.fileId ? item.fileId : "",
			fileType : fileClass,
			fileIconClass: fileClass,
			prefix: prefix,
			suffix: suffix,
			fileSizeText: item.fileSize,
			fileId: item.fileId,
			isShowSaveToDisk:isShowSaveToDisk
		};
		attachListHtml += top.$T.Utils.format(itemTemp, data);
		//彩云网盘的数据
	}
	// 首次加载时不执行，否则初始化附件列表时会出现异常，导致信纸无法加载等问题
	if (fileIds.length > 0) {
		requestData.fileIds = fileIds.join(",");
		getOutLinkHtml(requestData, function(res) {
			var outLinkHtml = '<br><br><br><dl class="writeOk" style="color: #444;font: 12px/1.5 \'Microsoft YaHei\',Verdana; display: inline-block; padding:5px 0 5px 10px;">';
			var list, source;


			if (res.responseData && res.responseData["code"] == "S_ERROR") {
				// todo: 变为error
				top.M139.UI.TipMessage.show("获取文件链接失败", {className: "msgRed", delay:3000});
			} else {
				list = res.responseData["var"].linkBeans;
				for (var i = 0, l = list.length; i < l; i++) {
					item = list[i];
					source = getFileItemById(item.objID);
					if(source !== null) {
						source.linkUrl = item.linkUrl;	// 添加linkUrl属性
					}
					if(item.passwd){
						$("li[rel='largeAttach'][objid='"+ item.objID +"']").find(".tiquma").show().html("提取码："+item.passwd);
					}
				}	
			}
		});
	}

	if (attachListHtml) {
	//	uploadManager.jContainer.prepend(attachListHtml);
		uploadManager.jContainer.append(attachListHtml);
		uploadManager.jContainer.show();
	} else if (uploadManager.fileList.length == 0) {
		uploadManager.jContainer.hide();
	}
	
	// update by tkh
	var container = uploadManager.jContainer[0];
	container.style.display = container.innerHTML != '' ? '' : 'none';
	var parent = container.parentNode;
	parent.style.display = container.innerHTML != '' ? '' : 'none';
}

//追加彩云附件内容
function getDiskLinkHtml() {
	var html = '';
    if(Arr_DiskAttach.length > 0 || Arr_OutLink.length > 0) {
        var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
        var userName = $T.Html.encode(top.$User.getTrueName());
		var htmlTemplate = ['<table cellpadding="0" cellspacing="0" '
			,'style="border:1px solid #c6cace; border-radius:5px; background:#fff; font-size:12px;" width="700">'
			,'<tr><th bgcolor="#4a73b5" align="left" height="48" '
			,'style="border-top-left-radius:4px; border-top-right-radius:4px;">'
			,'<img src="{resourcePath}mail_logo.jpg" width="168" height="22" style="margin-left:15px;"></th></tr>'
			,'<tr><td style="padding:20px;"><h2 style="font-size:14px; margin:0;padding:0;">尊敬的用户：</h2></td></tr>'
			,'<tr><td style="padding:0 50px;"><p style="font-size:14px; margin:0; padding:0;">'
			,'<a style="color:#0066cc; font-weight:bold; text-decoration:none;">{userName}</a>给您发送了以下{count}个文件，共'
			,'<span>{totalSize}</span></p></td></tr>'
			,'<tr><td style="padding:0 50px 0px;">'
			,'<p style="font-size:14px;margin:0; padding:0;">部分文件将于 '
			,'<a style="color:#0066cc; text-decoration:none;">{exp}</a> 到期，请及时下载保存。</p></td></tr> '
			,'<tr><td style="padding:30px 50px 10px; font-size:14px;"><strong></strong><br>' //附言：
			,'<p style="margin:0 20px; padding:0;"></p></td></tr>' //文件已发送，请查收。//写信页没有附言，删除该处的文字
			,'<tr><td align="center"><a href="{downloadUrl}" style="display:inline-block; text-align:center;">'
			,'<img src="{resourcePath}enter_btn.png"></a></td></tr>'
			,'<tr><td align="center">'
			,'<div style="width:91%; border-radius:8px; margin:20px 0; border:1px solid #dfdfe2;background:#fcfcfc;">'
			,'<table cellpadding="0" cellspacing="0" width="100%">{itemHtml}{itemHtml2}</table></div></td></tr>' 
			,'<tr><td style=" padding:10px 20px;">'
			,'<p style="border-bottom:1px solid #dedede; margin:0 10px; padding:10px; font-size:14px; text-indent:10px; color:#666666;">'
			,'139邮箱将一如既往。热忱的为您服务！</p></td></tr>'
			,'<tr><td align="right" style=" padding:0 20px; font-size:12px; color:#a6a6a6;">中国移动139邮箱企业团队</td></tr>'
			,'<tr><td align="right" style=" padding:5px 20px 30px; margin-bottom:20px; font-size:12px; color:#a6a6a6;">'
			,'{date}</td></tr>'
			,'<tr><td height="5" bgcolor="#efefef" '
			,'style="border-bottom-left-radius:4px;border-bottom-right-radius:4px;"></td></tr>'
			,'</table>'
		].join('');
		var htmlNewTemplate = ['<table id="attachAndDisk" style="margin-top:25px; border-collapse:collapse; table-layout:fixed; width:95%; font-size: 12px; line-height:18px; font-family:\'Microsoft YaHei\',Verdana,\'Simsun\';">',
				'<thead>',
					'<tr>',
						'<th style="background-color:#e8e8e8; height:30px; padding:0 11px; text-align:left;"><img src="{resourcePath}attachmentIcon.png" alt="" title="" style="vertical-align:middle; margin-right:6px; border:0;" />来自139邮箱的文件</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<td style="border:1px solid #e8e8e8;">',
							'{itemHtml}',
						'</td>',
					'</tr>',
					'<tr>',
						'<td style="border:1px solid #e8e8e8;">',
							'{itemHtml2}',
						'</td>',
					'</tr>',
				'</tbody>',
			 '</table>'].join("");
		var today = new Date();
		var html = top.M139.Text.Utils.format(htmlNewTemplate,{
			resourcePath : resourcePath,
			userName : userName,
			count : Arr_DiskAttach.length,
			totalSize : getTotalSize(),
			exp : Arr_DiskAttach[0].exp,
			downloadUrl: Arr_DiskAttach[0].downloadUrl,
			itemHtml : getAttachmentItemHtml(),
			itemHtml2 : getNetDiskItemHtml(),
			date : today.format('yyyy年MM月dd日')
		});
	}
	return html;
}
function getTotalSize(){
	var totalSize = 0;
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		totalSize += Arr_DiskAttach[i].fileLength;
	}
	return $T.Utils.getFileSizeText(totalSize);
}
function getAttachmentItemHtml(){
	var filetypeobj = getFiletypeobj();
	var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
	var itemHtml = [
		'<td><dl style="margin:20px 40px;">',
		'<dt style="float:left;"><img src="{fileIconSrc}"></dt><dd>',
		'<span style="width:34%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
		'{fileName}</span>({fileSize})</dd><dd>{exp} 到期</dd></dl></td>'
	].join('');
	var tableContainer = ['<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="attachItem" class="newAttachItem">',
								'<thead>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>',
									'<tr>',
										'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-超大附件</strong><a href="{downloadUrl}" style="font-weight:normal;">进入下载页面</a></th>',
									'</tr>',
								'</thead>',
								'<tbody>',
								'{trs}',
								'</tbody>',
						'</table>'].join("");
					var itemHtmlNew = ['<tr>',
										'<td style="padding-left:30px; height:40px;">',
											'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
												'<tr class="cts">',
													'<td width="42"><img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
													'<td style="line-height:18px;">',
														'<span>{fileName}<span class="gray"></span></span>',
														'<span style="color:#999; margin-left:5px;">({fileSize})</span><span style="color:#999; margin-left:5px;">({exp}天后过期)</span>',
													'</td>',
												'</tr>',
											'</table>',
										'</td>',
									'</tr>',
									'<tr>',
										'<td style="height:10px;"></td>',
									'</tr>'].join("");
	var midHtml = [];
	if(Arr_DiskAttach.length ==0){
		return "";
	}
	var ind = 0;
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		var f = Arr_DiskAttach[i];
		if(f.fileType == "keepFolder"){
			ind++;
			var fileType = '', extName = f.fileName.match(/.\w+$/);
			if(extName){
				fileType = extName[0].replace('.','');
			}
			var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');
			midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
				fileIconSrc : fileIconSrc,
				fileName : f.fileName,
				fileSize : f.fileSize,
				exp : $Date.getDaysPass(new Date(),$Date.parse(f.exp))
			}));
		}
	}
	if(ind > 0){
		return top.M139.Text.Utils.format(tableContainer,{
				trs : midHtml.join(''),
				downloadUrl : Arr_DiskAttach[0]["downloadUrl"]
		});
	}else{
		return "";
	}
}
function getNetDiskItemHtml(){
	var filetypeobj = getFiletypeobj();
	var resourcePath = top.m2012ResourceDomain + '/m2012/images/module/readmail/';
	var itemHtml = [
		'<td><a href="{linkUrl}" target="_blank">123</a><dl style="margin:20px 40px;">',
		'<dt style="float:left;"><img src="{fileIconSrc}"></dt><dd>',
		'<span style="width:34%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">',
		'{fileName}</span>({fileSize})</dd><dd>{exp} 到期</dd></dl></td>'
	].join('');

	var tableContainer = ['',
			'<table style="border-collapse:collapse; table-layout:fixed; width:100%;" id="diskItem">',
				'<thead>',
					'<tr><td style="height:10px;"></td></tr>',
					'<tr>',
						'<th style=" text-align:left; padding-left:30px; height:35px;"><strong style="margin-right:12px;">139邮箱-彩云网盘</strong></th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'{trs}',
				'</tbody>',
			'</table>'].join("");

	var itemHtmlNew = ['',
			'<tr><td style="padding-left:30px; height:40px;">',
					'<table style="border-collapse:collapse; table-layout:fixed; width:100%;">',
						'<tr class="cts" dataString="{dataString}">',
							'<td width="42"><span class="dataString" style="display:none;">{dataString}</span>',
							'<img src="{fileIconSrc}" alt="" title="" style="vertical-align:middle; border:0;" /></td>',
							'<td style="line-height:18px;">',
								'<span>{fileName}<span class="gray"></span></span>',
								'<span style="color:#999; margin-left:5px;">({fileSize})</span><span class="gray ml_5"></span>',
								'<p style="padding:0; margin:0;"><span style="{display}">提取码：{tiquma}</span><a href="{linkUrl}">查看</a></p>',
							'</td>',
						'</tr>',
					'</table>',
				'</td>',
			'</tr>',
			'<tr><td style="height:10px;"></td></tr>'].join("");

	var midHtml = [];
	if(Arr_OutLink.length ==0){
		return "";
	}
	for (var i = 0; i < Arr_OutLink.length; i++) {
		var f = Arr_OutLink[i];
		var fileType = '', extName = f.fileName.match(/.\w+$/);
		if(extName){
			fileType = extName[0].replace('.','');
		}
		var fileIconSrc = resourcePath + (filetypeobj[fileType] || 'none.png');

		midHtml.push(top.M139.Text.Utils.format(itemHtmlNew,{
			fileIconSrc : fileIconSrc,
			fileName : f.fileName,
			fileSize : f.fileSize,
			exp : f.exp,
			linkUrl : f.linkUrl,
			display : f.passwd ? "" : "display:none;",
			tiquma : f.passwd ? f.passwd : "",
			dataString : M139.JSON.stringify(f)
		}));

	}
	if(Arr_OutLink.length > 0){
		return top.M139.Text.Utils.format(tableContainer,{
			trs : midHtml.join('')
		});
	}else{
		return "";
	}
}
function getFiletypeobj(){
	return {
        'xls'  : 'xls.png',
		'xlsx'  : 'xls.png',
		'doc'  : 'word.png',
		'docx' : 'word.png',
        'jpeg' : 'jpg.png',
		'jpg'  : 'jpg.png',
        'rar'  : 'zip.png',
		'zip'  : 'zip.png',
		'7z'   : 'zip.png',
        'txt'  : 'txt.png',
		'rtf'  : 'txt.png',
        'ppt'  : 'ppt.png',
		'pptx'  : 'ppt.png',
		'xml'  : 'xml.png',
        'wmv'  : 'wmv.png',
		'wma'  : 'wma.png',
		'wav'  : 'wav.png',
        'vsd'  : 'vsd.png',
		'vob'  : 'vob.png',
        'fla'  : 'swf.png',
		'swf'  : 'swf.png',
		'flv'  : 'swf.png',
        'sis'  : 'sis.png',
		'rm'   : 'rm.png',
		'rmvb' : 'rm.png',
        'psd'  : 'psd.png',
		'ppt'  : 'ppt.png',
        'png'  : 'png.png',
		'pdf'  : 'pdf.png',
		'mpg'  : 'mpg.png', 
        'mp4'  : 'mp3.png',
		'mpeg' : 'mp3.png',
		'mpg'  : 'mp3.png',
		'mp3'  : 'mp3.png',
        'java' : 'java.png',
		'iso'  : 'iso.png',
        'htm'  : 'html.png',
		'html' : 'html.png', 
		'asp'  : 'html.png',
		'jsp'  : 'html.png',
		'aspx' : 'html.png',
        'gif'  : 'gif.png', 
		'exe'  : 'exe.png', 
		'css'  : 'css.png',
        'chm'  : 'chm.png',
		'cab'  : 'cab.png',
		'bmp'  : 'bmp.png',
        'avi'  : 'ai.png',
        'asf'  : 'asf.png',
		'mov'  : 'rm.png',
		'JPG'  : 'jpg.png'
    };
}
function isExistNetDiskFile(fid) {
	for (var i = 0; i < Arr_DiskAttach.length; i++) {
		if (Arr_DiskAttach[i].fileId == fid) {
			return true;
		}
	}
	return false;
}

//插入彩云链接 update by tkh
function setNetLink(files) {
	//top.addBehavior("写信页-点击上传附件",21);
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		if (f.fileType == "local" && !f.complete) {
			files.splice(i, 1);
			i--;
			continue;
		}
		var fid = f.fileId || f.fid;
		if (isExistNetDiskFile(fid)) {
			alert("文件\"" + f.fileName + "\"已经存在,请勿重复添加");
		} else {
			f.fileId = fid;
			f.fileLength = f.fileSize;
			f.fileSize = $T.Utils.getFileSizeText(f.fileSize);
			f.isDisk = true;
			if(Arr_DiskAttach.length == 0){
				Arr_DiskAttach.push(f);
			}else{
				for(var tt = Arr_DiskAttach.length -1; tt > -1; tt--){
					if(Arr_DiskAttach[tt].fileType == f.fileType){ //反向遍历，若存在，则添加到此位置
						Arr_DiskAttach.splice(tt+1, 0, f);
						break;
					}else if(tt == 0 && Arr_DiskAttach[tt].fileType == "netDisk"){ //如果到了最后一个，还全部是彩云网盘文件，则需要把暂存柜放在彩云前面
						Arr_DiskAttach.unshift(f);
					}else if(tt == 0){ //如果没有找到相同类型的，则添加到最后
						Arr_DiskAttach.push(f);
					}
				}
			}
		//	Arr_DiskAttach.push(f);
		}
	}
	if (files.length > 0) {
		renderLargeAttachList();
		// todo 自动发送提示用户填主题
		//utool.fillSubject(files[0].fileName);
	}
}
