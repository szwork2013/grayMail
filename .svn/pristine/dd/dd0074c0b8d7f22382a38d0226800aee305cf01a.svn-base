
var audioTpl = '<div class="pivAudio" style="display:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;">\
	<div class="audioplayer">\
		<audio src="" preload="auto"></audio>\
		<div class="play_pre">\
			<div class="p_pre audiop_error"></div>\
			<div class="p_pre">\
				<div class="p_pre_g">\
					<div class="p_pre_bg">\
						<div class="p_pre_b" style="width:0;"></div>\
						<div class="p_pre_l" style="width:0;"></div>\
					</div>\
				</div>\
				<div class="p_pre_cur" style="left:0;"></div>\
			</div>\
		</div>\
		<div class="p_btn">\
			<a href="javascript:void(0)" class="p_play" title="播放"></a>\
		</div>\
		<div class="p_time">\
			<span class="played">00:00</span>/<span class="duration">00:00</span>\
		</div>\
	</div>\
</div>';

var videoTpl = '<div class="pivBrower" style="display:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;">\
	<div class="viedesence">\
		<video src="" height="338" width="600"></video>\
		<p class="error-message"></p>\
	</div>\
	<div class="audioplayer">\
		<div class="play_pre">\
			<div class="p_pre">\
				<div class="p_pre_g">\
					<div class="p_pre_bg">\
						<div class="p_pre_b" style="width:0;"></div>\
						<div class="p_pre_l" style="width:0;"></div>\
					</div>\
				</div>\
				<div class="p_pre_cur" style="left:0;"></div>\
			</div>\
		</div>\
		<div class="p_btn">\
			<a href="javascript:void(0)" class="p_play" title="播放"></a>\
		</div>\
		<div class="p_time">\
			<span class="played">00:00</span>/<span class="duration">00:00</span>\
		</div>\
	</div>\
</div>';

function createPlayer(element, fileName, isVideo){
	AVPlayer.newInstance(element, {
		wrapperClass: isVideo ? ".pivBrower" : ".pivAudio",
		playPauseClass: '.p_play, .p_stop',
		scrubberClass: '.p_pre_g',
		progressClass: '.p_pre_b',
		loaderClass: '.p_pre_l',
		timeClass: '.p_time',
		durationClass: '.duration',
		playCurClass: '.p_pre_cur',
		playedClass: '.played',
		errorMessageClass: isVideo ? '.error-message' : '.audiop_error',
		playingClass: '.p_stop',
		pauseClass: '.p_play',
		loadingClass: '.loading',
		errorClass: '.error',
		fileName: fileName,
		type: isVideo ? "video" : "audio"
	});
}

function getAttaObjByName(src){
	console.log(src);
	var attachments = letterInfo.attachments;
	for(var i=0,l=attachments.length; i<l; i++){
		if(attachments[i].fileName === src){
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

var players = $(doc).find(".player_box");
var rVideo = /\.(?:avi|wmv|mp4|flv)($|\?)/i;
var jFrame = top.$("#mid_"+letterInfo.omid);
var initialHeight = parseInt(jFrame.css("height"));

players.each(function(){
	$(this).find(".ptitle").show();
});

function resizeReadMailViewHeight(){
	setTimeout(function(){
		jFrame.css("height", Math.max(initialHeight, document.body.clientHeight)+"px");
	}, 0);
}

players.each(function(i){
	var wrapper = $(this);
	//var src = wrapper.find(".insert_player").remove().html();
	//src = src.substring(4, src.length-3);
	wrapper.find(".insert_player").remove();
	var src = wrapper.find(".ptitle p")[0].firstChild.nodeValue;
	if(src){
		src = src.substring(src.indexOf("：")+1);
	}
	var isVideo = rVideo.test(src);
	var attaFile = getAttaObjByName(src);
	var resURL = getAttaURL(attaFile) + "&range=1";
	//console.log("resURL: "+resURL);
	wrapper.append(isVideo ? videoTpl : audioTpl);
	wrapper.find(isVideo ? "video" : "audio").attr("data-src", resURL);
	if(attaFile){
		wrapper.find(".psize").html(top.$TextUtils.getFileSizeText(attaFile.fileRealSize));
	}
	wrapper.data("video", isVideo ? "1" : "0");
	wrapper.data("filename", src);
});

$(".attach_media_switch").show().on("click", function(i){
	var jThis = $(this);
	if(this.collapsed == undefined){
		//this.collapsed = true;	// 初始化默认值为折叠状态
		// 播放器初始化涉及到尺寸计算，必须先显示
		this.collapsed = false;
		jThis.html('收起 <i class="i_2tridd"></i>');
		var box = jThis.closest(".player_box");
		var isVideo = box.data("video") == "1";
		box.find(".ptitle").next().show();
		createPlayer(box.find(isVideo ? "video" : "audio")[0], box.data("filename"), isVideo);
		resizeReadMailViewHeight();
		top.addBehavior(isVideo ? "readmail_play_video" : "readmail_play_audio");
		return ;
	}

	if(this.collapsed){
		this.collapsed = false;
		jThis.html('收起 <i class="i_2tridd"></i>');
		jThis.closest(".ptitle").next().show();
		var isVideo = jThis.closest(".player_box").data("video") == "1";
	} else {
		this.collapsed = true;
		jThis.html('展开 <i class="i_2trid"></i>');
		jThis.closest(".ptitle").next().hide();
	}
	resizeReadMailViewHeight();
});

