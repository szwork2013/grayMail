var curFileId = 0;
var CurAllData;
var cgi_PicPreview;
var cgi_serverIp;
var userNumber;
var ssoid;

function PageInit() {
	CurAllData = DiskTool.getDiskWindow().ListPager.Filter.getAllData();
    curFileId = Utils.queryString("fileid", window.location.href);
    ssoId = Utils.queryString("sid", window.location.href);
    var fileName = "";
	var fileData = $.grep(CurAllData, function(i) {
        return i.fileid == curFileId;
    })[0];
    if (fileData != undefined) {
        fileName = fileData.filename || fileData.srcfilename;
    }
	userNumber = DiskTool.getDiskWindow().parent.DiskMainData.UserNumber;
    getPicPreviewUrl(curFileId, fileName, function(url) {
		$("#imgPreview").attr({ "src": url })
        .error(function() {
            this.src = "../images/pic_tuwrong.png";
        });
	});
    var rawUrl = getRawUrl(curFileId, fileName, ssoId, userNumber);
	var disposeName = fileName;
	//处理文件名过长
	if(disposeName.length > 30) {
		disposeName = disposeName.substr(0, 30) + "...";
	}
    $("#imgname").html(disposeName);
    $("#aPrev").click(GetPrevFileId);
    $("#aNext").click(GetNextFile);
    $("#aRaw").attr("href", rawUrl);
	$("#imgPreview").mousemove(function(e){
        var img = $(this);
        var offset = img.offset();
        var width = img.width();
        var offset = img.offset();
        var mouseX = e.pageX;
         if(mouseX <  (offset.left + width/2)){
	        if(img.attr("class")!="img-pre"){
	            img.attr("class","img-pre");
	        }
         }else{
	        if(img.attr("class")!="img-next"){
	            img.attr("class","img-next");
	        }
         }
    }).click(function(e){
        var img = $(this);
        if(img.attr("class") == "img-pre"){
            GetPrevFileId();
        } else {
            GetNextFile();
        }
        e.preventDefault();
    });
}
function getPicPreviewUrl(curFileId, fileName, callback) {
	$.postXml({
		url: DiskTool.resolveUrl('getpreview', true),
		data: XmlUtility.parseJson2Xml({
			fileid: curFileId,
			w: "500",
			h: "400"
		}),
		success: function(result) {
			var url = result['var'].url;
			if(callback) {
				callback(url);
			}
		}
	});
}
/*返回查看原图的URL*/
function getRawUrl(curFileId, fileName, ssoId){
    //return "/m2012/html/disk/disk_imgshow.html?fileid={0}&filename={1}&sid={2}&res={3}&jsRes={4}".format(curFileId, escape(fileName), ssoId, diskResource[0], diskResource[1]);
    return top.getDomain("rebuildDomain") + "/disk/netdisk/html/imgshow.html?fileid={0}&filename={1}&sid={2}&res={3}&jsRes={4}".format(curFileId, escape(fileName), ssoId, diskResource[0], diskResource[1]);
}
function GetNextFile(){
    var fileName = "";
    var extType = "";
    var isFindCur = false;
    var count = CurAllData.length;
    var nextFileId = "";
    for (var i = 0; i < count; i++) {
		var fileid = CurAllData[i].fileid || CurAllData[i].fileId;
        if (isFindCur) {//下一个
            extType = DiskTool.getExtType(DiskTool.getFileExtName(CurAllData[i].filename || CurAllData[i].srcfilename));
            if (extType && extType == "pic" && fileid != null) {
                nextFileId = fileid;
                fileName = CurAllData[i].filename || CurAllData[i].srcfilename;
                break;
            }
        }
        else if (fileid && fileid == curFileId) {
            isFindCur = true;
        }
    }
    if (nextFileId != "") {
        curFileId = nextFileId;
        getPicPreviewUrl(nextFileId, fileName, function(url) {
			$("#imgPreview").load(function() {
				var disposeName = fileName;
				//处理文件名过长
				if(disposeName.length > 30) {
					disposeName = disposeName.substr(0, 30) + "...";
				}
				$("#imgname").html(disposeName);
				$("#imgPreview").unbind("load");
			}).attr({ "src": url });
		});
        var rawUrl = getRawUrl(nextFileId, fileName, ssoId, userNumber);
        $("#aRaw").attr("href", rawUrl);
    } else {
        alert("这已经是最后一张图片");
    }
    return false;
}
function GetPrevFileId() {
    var fileName = "";
    var extType = "";
    var isFindCur = false;
    var count = CurAllData.length;
    var nextFileId = "";
    for (var i = count - 1; i > -1; i--) {
		var fileid = CurAllData[i].fileid || CurAllData[i].fileId;
        if (isFindCur) {//下一个
            extType = DiskTool.getExtType(DiskTool.getFileExtName(CurAllData[i].filename || CurAllData[i].srcfilename));
            if (extType && extType == "pic" && fileid != null) {
                nextFileId = fileid;
                fileName = CurAllData[i].filename || CurAllData[i].srcfilename;
                break;
            }
        } else if (fileid && fileid == curFileId) {
            isFindCur = true;
        }
    }
    if (nextFileId != "") {
        curFileId = nextFileId;
        getPicPreviewUrl(nextFileId, fileName, function(url) {
			$("#imgPreview").load(function() {
				var disposeName = fileName;
				//处理文件名过长
				if(disposeName.length > 30) {
					disposeName = disposeName.substr(0, 30) + "...";
				}
				$("#imgname").html(disposeName);
				$("#imgPreview").unbind("load");
			}).attr({ "src": url });
		});
        var rawUrl = getRawUrl(nextFileId, fileName, ssoId, userNumber);
        $("#aRaw").attr("href", rawUrl);
    } else {
        alert("这已经是第一张图片");
    }
    return false;
}
$().ready(PageInit);