var UploadLargeAttach = {
    enable:false,
    currentFile: null,
    isLargeAttach:false,
    //检测是否需要超大附件上传
    isShowLargeAttach: function (files,uploadType,callback) {

        var result = false;
        var is139 = true;
        var isBigAttach = false;
        var totalSize = 0;
        var iLargeSize =1024*1024*50;//邮箱最大的发送大小的大
        var aToEmail = [];
		var largeSize = 1024*1024*20;
		var flashSize = 1024*1024*10;//flash只支持100M
		var tipsType = false;
		if(!top.$App.isReadSessionMail()){
			aToEmail =_.union(addrInputView.toRichInput.getValidationItems(),addrInputView.ccRichInput.getValidationItems());
			$(aToEmail).each(function(i,str){
				if(str.indexOf('@139.com') == '-1'){
					is139 = false;
				}
			});
		}

		if(aToEmail.length == 0){
			is139 = false;
		}

        UploadLargeAttach.enable = false;
        UploadLargeAttach.isLargeAttach = false;
        $(files).each(function(i,file){
	      var filesSize = file.fileSize ||file.size;
	       totalSize += filesSize;
            if (filesSize > largeSize) {
	            isBigAttach = true;
            }
        })
        if((uploadType == 'ajax'&&!utool.checkSizeSafe(totalSize))||(uploadType == 'flash' &&utool.getSizeNow()>=iLargeSize)){
	        tipsType = true;
        }
        if (tipsType) {
            top.tipsBox = top.$Msg.confirm("附件总大小超过50M，可能会被对方邮箱拒收。<br>使用 <b title='超大附件以链接形式发送，文件在您的暂存柜内保存15天，续期后可以保留更久。'>超大附件<i class='i_wenhao'></i></b>发送，对方接收无障碍。", function () {
                UploadLargeAttach.enable = true;
		        UploadLargeAttach.isLargeAttach = true;
				BH({ key: "compose_send_largeAttach_50M" });
                callback();
            }, function () {
	            uploadManager.removeFile(files);
            }, {isHtml:true,icon:'i_warn',buttons:["是，使用超大附件!","不，取消上传"]});
            return true;
        }
		if(!is139&&isBigAttach){
            result = true;
            top.$Msg.confirm("附件已超过20M，可能会被对方邮箱拒收。<br>使用 <b title='超大附件以链接形式发送，文件在您的暂存柜内保存15天，续期后可以保留更久。'>超大附件<i class='i_wenhao'></i>&nbsp;</b>发送，对方接收无障碍。", function () {
                UploadLargeAttach.enable = true;
		        UploadLargeAttach.isLargeAttach = true;
				BH({ key: "compose_send_largeAttach_20M" });
                callback();
            }, function () {
                callback();
                //uploadManager.removeFile(file);
            }, {isHtml:true,icon:'i_warn',buttons:["是，使用超大附件","不，继续上传"]});
		}

        return result;
    },
    //超大附件请求预上传接口，并对上传接口的请求报文转换
    prepareUpload: function (file, callback) {

        /*
        POST http://rm.mail.10086ts.cn/mw2/file/disk?func=file:fastUpload&sid=xxx

        <object>
  <string name="fileName">测试环境hosts.txt</string>
  <int name="fileSize">908</int>
  <string name="fileMd5">2bfda476d9e76462a9a8f1ca4aff1c16</string>
</object>
        */
        var self = this;
        this.currentFile = file;
        file.isLargeAttach = true;

        function preUpload(md5Value) {
            var data = {
                fileName: file.fileName,
                fileSize: file.fileSize,
                fileMd5: md5Value
            }
            file.comeFrom = "cabinet";
            file.fileType = "keepFolder";
            M139.RichMail.API.call("file:fastUpload", data, function (result) {
                if (file.isCancel) { //md5过程中取消上传
                    uploadManager.removeFile(file);
                    uploadManager.autoUpload();
                    return;
                }
                if (result.responseData["code"] && result.responseData["code"] == "S_OK") {
                    var status = result.responseData["var"]["status"];
                    file.fileName = result.responseData["var"]["fileName"];//取预上传接口返回的文件名称，文件可能重名被自动改名，或单副本取文件原始名称，否则发送时无法匹配到文件
                    if (status == "0") {
                        var params = result.responseData["var"]["postParam"];
                        file.fileId = result.responseData["var"]["fileId"];
                        file.fileIdForSend = result.responseData["var"]["fileId"];
                        file.uploadUrl = result.responseData["var"]["url"];
                        self.uploadUrl = file.uploadUrl;
                        //params.fileObj = file.fileObj;
                        self.postParams = params;
                        callback(params);
                    } else if (status == "1") { //单副本，直接插入
                        
                        uploadManager.removeFile(file);
                        file.fileId = result.responseData["var"].fileId;
                        file.state = "complete";
			file.fileIdForSend = result.responseData["var"]["fileId"];
                        var fileCabinet = [self.transformFile(file)];
                        top.$App.trigger('obtainCabinetFiles', fileCabinet);
                        uploadManager.autoUpload();
                    }
                }

            });
        }
        if (file.md5) {    //flash上传已计算好md5
            preUpload(file.md5);
        } else {
            this.getFileMd5(preUpload);
        }
      
    },
    transformFile:function(file){
        return {
            comeFrom: "cabinet",
            fileId: file.fileIdForSend,
            fileName: file.fileName,
            fileSize: $T.Utils.getFileSizeText(file.fileSize),
            fileType: "keepFolder",
            state: "success"
        };
    },
    completeUpload: function (file) {
        if (file.isLargeAttach) {
            uploadManager.removeFile(file);
            //Arr_DiskAttach.push(file);//依赖，引自largeAttach.js
            //setNetLink(file);//依赖，引自largeAttach.js
            var fileCabinet = [this.transformFile(file)];
            top.$App.trigger('obtainCabinetFiles', fileCabinet);

        }
    },
    getFileMd5: function (callback) {
        this.timeBegin = new Date;
        this.uploading = true;

        var output = [],
            worker,
            file_id = 1;

        var md5WorkUrl =  "/m2012/js/ui/upload/calculator.worker.md5.js";

        worker = new Worker(md5WorkUrl);

        worker.addEventListener('message', this.handle_worker_event("md5_file_hash_" + file_id, callback));
        /*
        worker.addEventListener('message', function (event) {
            var progress = Math.floor(event.data.block.end * 100 / event.data.block.file_size);
            if (event.data.result) {
                callback(event.data.result);
            }
        });*/

        this.hash_file(this.currentFile.fileObj, worker);

        //document.getElementById('list').innerHTML = '<table class="table table-striped table-hover">' + output.join('') + '</table>' + document.getElementById('list').innerHTML;
    },
    hash_file: function (file, worker) {
        var i, buffer_size, block, threads, reader, blob;
        var self = this;

        var handle_load_block = function (event) {
            threads += 1;
            worker.postMessage({
                'message': event.target.result,
                'block': block
            });
        };

        var handle_hash_block = function (event) {
            threads -= 1;

            if (threads === 0) {
                if (block.end !== file.size) {
                    block.start += buffer_size;
                    block.end += buffer_size;

                    if (block.end > file.size) {
                        block.end = file.size;
                    }
                    reader = new FileReader();
                    reader.onload = handle_load_block;
                    blob = HTML5AJAXUpload.fileSlice(file, block.start, block.end);

                    reader.readAsArrayBuffer(blob);
                }
            }
        };
        buffer_size = 64 * 16 * 1024;
        block = {
            'file_size': file.size,
            'start': 0
        };

        block.end = buffer_size > file.size ? file.size : buffer_size;
        threads = 0;

        worker.addEventListener('message', handle_hash_block);
        reader = new FileReader();
        reader.onload = handle_load_block;
        blob = HTML5AJAXUpload.fileSlice(file, block.start, block.end);

        reader.readAsArrayBuffer(blob);
    },

    handle_worker_event: function (id, callback) {
        var self = this;
        return function (event) {
            if (event.data.result) {
                console.log(Math.round(((new Date).getTime() - self.timeBegin.getTime()) / 1000));
                callback && callback(event.data.result);
            } else {
	            self.currentFile.getMd5 = Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%";
				self.currentFile.updateUI();
                console.log(Math.floor(event.data.block.end * 100 / event.data.block.file_size) + "%");

            }
        };
    },
    responseConvert: function (response) {
        /*
        原始报文
        分块：
        <?xml version="1.0" encoding="utf-8"?><result><retcode>0</retcode><taskno>11201408041644582148</taskno><fileid>GFLF1121120140804164458214801192</fileid><timestamp>1407141898</timestamp><range>0-196607</range><middleret></middleret></result>
        
        上传完成：
        <?xml version="1.0" encoding="utf-8"?><result><retcode>0</retcode><taskno>11201408050941251093</taskno><fileid>GFLF1101120140805094125109301621</fileid><timestamp>1407202901</timestamp><range>10027008-10144767</range><middleret>{
    "code": "S_OK",
	"summary":"成功",
	"var":{
			"url":"",			
			"disk": {},
			"file": {}
		  }
}</middleret></result>
        */

        var isComplete = false;
        var result,reg;
        if (response.indexOf("S_OK") >= 0) {
            reg = /<fileid>(.+?)<\/fileid>/i;
            var ma = response.match(reg);
            var fileId = ma[1];
            result = '<script>document.domain=window.location.host.match(/[^.]+\.[^.]+$/)[0]; var return_obj={\'code\':\'S_OK\',\'var\':{"fileId":"'
                + fileId + '","fileName":"' + this.currentFile.fileName + '","fileSize":' + this.currentFile.fileSize + '}};</script>'
        } else {
            reg = /<fileid>(.+?)<\/fileid>.+<range>(.+?)<\/range>/i;
            var ma = response.match(reg);
            var fileId = ma[1];
            var offset = ma[2].split("-");
            result = '<script>document.domain=window.location.host.match(/[^.]+\.[^.]+$/)[0]; var return_obj={\'code\':\'S_OK\',\'var\':{"fileId":"'
                + fileId + '","sip":"webapp_ip25","offset":' + offset[0] + ',"length":' + (offset[1] - offset[0]) + '}};</script>'
        }
        return result;
        
    }

}