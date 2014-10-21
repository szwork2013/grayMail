

(function () {

    M139.core.namespace("M139.Plugin.FastUpload", {
        quickVersion: "v1.0.7.6",
        quickMinVersion: "v1.0.7.5",
        leastVersion:196872,//需要升级的版本 todo 跟上面那个变量作用重复了？
        /**
         *是否已安装快速上传组件
         *@returns {Number} 返回0表示未安装，返回-1表示已安装但是版本太低，返回1表示可以使用
         */
        checkControlSetup: function () {
            var setup = 0;
            var version = this.getVersion();
            //todo config
            if (version) {
                if (version < this.leastVersion) {
                    setup = -1;
                } else {
                    setup = 1;
                }
            }
            this.isControlSetup = function () {
                return setup;
            };
            return setup;
        },

        /**
         *获得控件版本，没安装或者控件不可用时返回0
         */
        getVersion: function () {
            var version = 0;
            try {
                var obj = new ActiveXObject("Cxdndctrl.Upload");
                version = obj.getversion();
            } catch (e) {

            }
            return version;
        },

        /**
         *获取创建控件所需要的html元素
         *@param {Object} options 参数集合
         *@param {String} controlId 指定控件的id
         *@param {String} globalHandler 一个全局的对象名，控件会调用此对象的回调
         */
        getUploadControlHtml: function (options) {
            var htmlCode = 
                '<script language="javascript" type="text/javascript" for="{controlId}" event="onstart(fileId)">\
                    {globalHandler}.onUploadStart(fileId);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onprogress(fileId, progress, uploadsize, times)">\
                    {globalHandler}.onUploadProgress(fileId, progress, uploadsize, times);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onstop(fileId, result, fileIdOfServer)">\
                    {globalHandler}.onUploadStop(fileId, result, fileIdOfServer);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onlog(logText)">\
                    {globalHandler}.onLog(logText);\
                </script>\
                <script language="javascript" type="text/javascript" for="{controlId}" event="onprepare(fileId, fileIdOfServer)">\
                    {globalHandler}.onPrepare(fileId, fileIdOfServer);\
                </script>';
            if (document.all) {
                htmlCode += '<object id="{controlId}" classid="CLSID:0CEFA82D-A26D-491C-BAF7-604441B409FD"></object>';
            } else {
                //用innerHTML方式创建的控件貌似无法创建成功，需要用document.write
                htmlCode += '<embed id="{controlId}" type="application/x-richinfo-cxdnd3"></embed>';
            }
            htmlCode = M139.Text.Utils.format(htmlCode, {
                controlId: options.controlId,
                globalHandler: options.globalHandler
            });
            return htmlCode;
        },
        /**
         *传给控件的上传指令, 大部分参数从服务端获取
         */
        UploadCommand: "<parameters><id>{id}</id><comefrom>10</comefrom><key>{key}</key><serveraddress>{server}</serveraddress>\
        <commandport>{commandPort}</commandport><dataport>{dataPort}</dataport><filename>{filePath}</filename><filesize>{fileSize}</filesize><ssoid>{sid}</ssoid>\
        <userlevel>0</userlevel><usernumber>{userNumber}</usernumber><flowtype>0</flowtype><taskno>{taskNumber}</taskno>\
        <resumetransmit>{resumetransmit}</resumetransmit><commandcgi>{commandCGI}</commandcgi><datacgi>{dataCGI}</datacgi><browsertype>{browserType}</browsertype>\
        <fileid>{fileId}</fileid><ver>{version}</ver></parameters>",

        /**
         *初始化ActiveX上传控件
         */
        createControl: function (options) {
            var div = document.createElement("div");
            div.style.display = "none";
            div.innerHTML = this.getUploadControlHtml(options);
            (options.container || document.body).appendChild(div);
            
            var c = document.getElementById(options.controlId);
            try{
                c.setuserid($User.getUid());
            } catch (e) {
                throw "M139.Plugin.FastUpload.createControl:setuserid";
            }

            return c;
        },

        /**
         *利用快速上传组件上传文件
         */
        uploadFile: function (control, options) {
            //console.log("uploadFile:" + JSON.stringify(options));
            //设置服务器时间
            if (options.date) {
                try{
                    var serverTime = M139.Date.parse(options.date).getTime() / 1000;
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:options.serverTime";
                }
                control.setservertime(serverTime);
            }
            //todo
            var result = null;
            var controlVersion = control.getversion();
            //低版本不支持http代理服务器
            if (controlVersion < 196864) {
                try{
                    result = control.upload(
                        options.fileId,
                        10,
                        options.key,
                        options.domain,
                        parseInt(options.dataPort),
                        parseInt(options.uploadPort),
                        0,
                        "",
                        0,
                        "",
                        "",
                        options.filePath,
                        options.fileSize,
                        options.sid,
                        0, //userlevel
                        options.userNumber, //usernumber
                        0, //flowtype
                        options.taskno, //taskno
                        true);
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:control.upload";
                }
            } else {
                var browserType = 200;
                if (M139.Browser.is.ie) {
                    browserType = 0;
                } else if (M139.Browser.is.firefox) {
                    browserType = M139.Browser.getVersion() <= 3.6 ? 150 : 151;
                }
                var myparams = "";
                if (options.status && options.status == "118" && options.storageId && options.storageId.length == 32) {
                    //该文件已上传完成 todo
                    //sharingUpload.action.onUploadStop(file.fileId, 0, file.storageId);
                    control.removetaskbyid(file.fileId);
                    return;
                }

                var commandParam = {
                    id: options.fileId,
                    key: options.key,
                    server: options.domain,
                    commandPort: options.dataPort,//这2个端口命名反了
                    dataPort: options.uploadPort,
                    filePath: M139.Text.Xml.encode(options.filePath),
                    fileSize: options.fileSize,
                    sid: $App.getSid(),
                    userNumber: $User.getUid(),
                    taskNumber: options.taskno,
                    commandCGI: options.commandCgi,
                    dataCGI: options.dataCgi,
                    browserType: browserType,
                    fileId: options.storageId || "",
                    version: controlVersion >= 196867 ? 2 : 1
                };

                if (options.status && options.status == "114") {
                    //重新上传
                    commandParam.resumetransmit = 0;
                    console.log("重新上传");
                } else if (typeof options.status != "undefined" && options.status == "0" && options.storageId && options.storageId.length == 32) {
                    //继传
                    commandParam.resumetransmit = 1;
                    console.log("续传");
                } else {
                    //新上传
                    commandParam.resumetransmit = 0;
                    console.log("新上传");
                }
                commandParam = M139.Text.Utils.format(this.UploadCommand, commandParam);
                try {
                    console.log(commandParam);
                    result = control.uploadex(commandParam);//成功返回0?
                } catch (e) {
                    throw "M139.Plugin.FastUpload.uploadFile Error At:control.uploadex";
                }
            }
            return result;
        },


        /**
         *停止上传
         */
        stopUpload: function (control, fileId, options) {
            try{
                control.stop(fileId);
                if (options && options.isDelete && options.storageId) {
                    console.log("call c++ removetaskbyfileid");
                    control.removetaskbyfileid(options.storageId);
                }
            } catch (e) {
                throw "M139.Plugin.FastUpload.stopUpload:control.stop";
            }
        },


        /**
         *通过组件打开windows文件选择框
         *@param {Object} control 控件实例
         *@param {Object} options 参数集合
         *@param {String} options.filter 选择文件扩展名显示，比如*.mp3
         *@param {String} options.dialogTitle 最多选择几个文件
         *@param {Number} options.maxLength 最多选择几个文件
         *@returns {Array} 返回选择的文件列表
         */
        openWindowFileDialog: function (control,options) {
            var filter = options.filter || "*.*";
            var dialogTitle = options.dialogTitle || "请选择文件";
            var selectFiles = [];
            //var maxLength = options.maxLength || 50;
            try{
                var result = control.getopenfilename(filter, dialogTitle);
            } catch (e) {
                throw "M139.Plugin.FastUpload.openWindowFileDialog Error At:control.getopenfilename";
            }
            if (result) {
                var count = control.getfilecount();
                for (var i = 0; i < count; i++) {
                    var filePath = control.getfilename(i);
                    var fileSize = control.getfilesize(i);
                    var fileName = M139.Text.Url.getFileName(filePath);
                    selectFiles.push({
                        filePath: filePath,
                        fileSize: fileSize,
                        fileName: fileName
                    });
                }
            }
            return selectFiles;
        }


    });


})();