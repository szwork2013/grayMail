/**
* 读信页富媒体标记检测与初始化
* Added by xiaoyu / 2014.6.9
*/

function getAttaObjByName(src){
	var attachments = letterInfo.attachments;
	for(var i=0,l=attachments.length; i<l; i++){
		if(attachments[i].fileName.toLowerCase() === src){
			return attachments[i];
		}
	}
	return null;
}

function getAttaURL(attaFile){
	if(attaFile == null) return "";
	var url = top.ReadMailInfo.getDownloadAttachUrl({
		mid: letterInfo.omid,
		fileOffSet: attaFile.fileOffSet,
		fileSize: attaFile.fileSize,
		fileName: attaFile.fileName.replace(reg, "_"),
		sid: top.UserData.ssoSid,
		type: "attach",
		encoding: attaFile.encoding
	});
	return url || "";
}

var rVideo = /^\.(?:mp4|m4v|flv|avi|wmv|rmvb|mkv|mov)($|\?)/i;
var rAudio = /^\.(?:mp3|m4a|wma|wav|ogg)($|\?)/i;

~function(){

	$(".inserted_Mark").show().each(function(i){
		var wrapper = $(this);
		var nameContainer = wrapper.find(".name_container");
		//var fileNameNoExt = nameContainer.attr("title");
		var fullName = (wrapper.find("i:first").text() || "").replace(/[<>"]/g, function($0){
			return {">":"&gt;", "<":"&lt;", '"':"&quot;"}[$0];
		});

		var ext = nameContainer.next().text();
		var previewUrl = "";

		var attaFile = getAttaObjByName(fullName.toLowerCase());
		var resURL = getAttaURL(attaFile) + "&range=1";
		var mid = letterInfo.omid;
		var downloadUrl;

		if(attaFile == null) return ;

		downloadUrl = top.M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(attaFile, mid);
			
		wrapper.find(".pctrl a").attr("onclick", "");

		/*if(rVideo.test(ext)) {	// 视频
			previewUrl = "/m2012/html/onlinepreview/video.html?sid=" + top.sid;
			previewUrl += "&id=" + attaFile.fileId;
			
			previewUrl += "&name=" + encodeURIComponent(attaFile.fileName);
			previewUrl += "&presentURL=" + encodeURIComponent(resURL);

			wrapper.find(".pctrl a").html("播放").attr({"href" : previewUrl, "target" : "_blank"});
		} else */
		if(rAudio.test(ext)) {	// 音乐
			wrapper.find(".pctrl").html('<a href="' + downloadUrl + '">下载</a> | <a href="javascript:;">播放</a>');
			wrapper.find(".pctrl a").eq(1).on("click", function(e){
				e.stopPropagation();
				top.BH({key: "readmail_preview_audio"});
				top.MusicBox.addMusic(attaFile.fileId, [{
					id: attaFile.fileId,
					url: resURL,
					text: attaFile.fileName
				}]);
				top.MusicBox.show();
				return false;
			});
		} else {	// 文档/图片/视频
			var item = top._.defaults({}, {
					type: "email",
                    downloadUrl: encodeURIComponent(downloadUrl),
                    contextId: mid,
                    fileName: encodeURIComponent(attaFile.fileName),
                    fileSize: attaFile.fileRealSize
                });
			//console.log(downloadUrl);
			previewUrl = top.M2012.ReadMail.View.FilePreview.getUrl(item, null);//attaFile.fileId);
			if(rVideo.test(ext)) {
				previewUrl += "&mediaType=" + ext.substr(1);
				wrapper.find(".pctrl").html('<a href="' + downloadUrl + '">下载</a> | <a href="' + previewUrl + '" onclick="top.BH({key:\'readmail_preview_video\'})" target="_blank">播放</a>');
			} else {
				wrapper.find(".pctrl").html('<a href="' + downloadUrl + '">下载</a> | <a href="' + previewUrl + '" onclick="top.BH({key:\'readmail_preview_doc\'})" target="_blank">预览</a>');
			}
		}
	}).show();
}();

