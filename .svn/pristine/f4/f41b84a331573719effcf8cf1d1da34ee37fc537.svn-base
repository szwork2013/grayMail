//初始化
window.onload = function() {
	//设定访问中间件的iframe的代理src
	$("#iframeserver").attr("src", DiskConf.proxyInterIp + "proxy.htm");
	Utils.waitForReady("document.getElementById('iframeserver').contentWindow.$.ajax", function() {
		InitFileInfo();
	});
}
function InitFileInfo() {
    fid = Utils.queryString("fid");
	document.getElementById("iframeserver").contentWindow.$.ajax({//获取文件信息
		type: "POST",
		contentType: "text/xml",
		dataType: "text",
        url: DiskTool.resolveUrl("weibofile", false, true),
		data: XmlUtility.parseJson2Xml({
            fid: fid
        }),
		success: function(result){
			try {
				var data = eval("(" + result + ")");
			} catch (ex) {
				var data = {
					code: "S_Error",
					summary: "请求服务器出错"
				};
			}
            if(data.code != "S_OK") {
                alert(data.summary);
            } else {
				var fileObj = data['var'];
                $("#aDownload").click(function(e){
					download(fileObj);
                    e.preventDefault();
                });
                $("#spanFileName,#spanFileName2").html(fileObj.srcfilename);
                $("#spanUserName").html(fileObj.usernumber);
                $("#spanFileSize").html(DiskTool.getFileSizeText(fileObj.filesize));
                //扩展名
                var ext = DiskTool.getFileExtName(fileObj.srcfilename);    
                var imageCss = DiskTool.getFileImageClass(ext);  
                $("#iFileClass").addClass(imageCss);        
            }                    
        },
        error: function(error){
            alert(error);
        }
	});
}
function download(fileObj) { 
    //下载逻辑
	var downWin = window.open();
	var getDownUrl = DiskTool.resolveUrl("pickUpDown", false, true);
    document.getElementById("iframeserver").contentWindow.$.ajax({
		type: "POST",
		contentType: "text/xml",
		dataType: "text",
        url : getDownUrl,
        data: XmlUtility.parseJson2Xml({                   
            fileid: fileObj.fileid.toString(),
			folderid: "",
			downname: escape(fileObj.srcfilename)
        }),
        success: function(msg){
			try {
				var data = eval("(" + msg + ")");
			} catch (ex) {
				var data = {
					code: "S_Error",
					summary: "请求服务器出错"
				};
			}
			if(data.code == "S_OK") {
				downWin.location.href = data['var'].url;
			}
		},
        error: function(error){
            alert(error);
        }
    });            
}