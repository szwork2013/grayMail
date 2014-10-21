(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
    M139.namespace("M2012.Fileexpress.Cabinet.Model.Upload", Backbone.Model.extend({
        defaults: {
            currentFile: {
                clientTaskno: "",
                name: "",
                size: "",
                fileMd5: "",
                state: "uploading",
                sendSize: "",
                totalSize: "",
                speed: "",
                surplusTime: "",
                responseText: "",
                isContinueUpload: "",
                fileInfo: {},
                summary: "",
                isMcloud: "0"//是否存彩云： 1 是；0 否
            },
            curConditionType: "",//当前被使用的环境，分为文件快递和彩云,值：file, disk
            isStop: false,
            continueUploadCount: 0,
            isTipFilterFile: false,
            needUploadFileNum: 0,
            uploadedFileNum: 0,
            RootId:null,
            attachId:null,
            my139Id:null
        },

        logger : new top.M139.Logger({
            name : "M2012.Fileexpress.Cabinet.Model.Upload"
        }),

        monitorIntervalId: null,

        name: "M2012.Fileexpress.Cabinet.Model.Upload",

        callApi : M139.RichMail.API.call,

        randomNumbers: {},

        fileListEle: {},//上传列表dom引用

        fileUploadSuc: [],//上传成功文件
        
		dirTypes : {// 文件类型
            ROOT: 0,//根目录 此值是前端定义，用以将根目录和其他目录进行区分，服务端定义为1
            USER_DIR : 1, // 自定义文件夹
            FILE : 'file', // 文件
            DIRECTORY : 'directory'// 文件
        },
        
        maxUploadSize: 1024 * 1024 * 1024,

        limitFlashUploadSize: 100 * 1024 * 1024,//flash上传单文件最大100M

        installToolUrl: "/m2012/controlupdate/mail139_tool_setup.exe",

        commonUploadResultUrl: "http://" + location.host + "/m2012/html/disk_v2/uploadresult.html",

        //根据套餐显示超大附件最大上传文件大小
        resetMaxUploadSize: function(){
            if (this.get("curConditionType") == "file") {//文件快递上传单文件大小
                this.maxUploadSize = (top.$User && top.$User.getCapacity("maxannexsize") || (4 * 1024)) * 1024 * 1024;
            } else {//彩云上传单文件大小
                this.maxUploadSize = (top.$User && top.$User.getCapacity("diskfilesize") || 1024) * 1024 * 1024;
            }
        },

        params: {
            DISPERSED_SERVER_CODE: {
                "SUC_UPLOAD": "0"//上传分布式成功
            },
            MIDDLE_SERVER_CODE: {
                "S_OK"  : "上传文件成功！",
                "S_ERR" : "上传失败！"
            }
        },

        msg: {
            NOUPLOAD:"unable to compute",
            UPLOADFAIL:"There was an error attempting to upload the file!",
            UPLOADCANCEL:"The upload has been canceled by ther user or ther browser dropped the connection.",
            SOURCE_FILE_DELETED: "对不起，源文件不存在，无法继续上传！"
        },

        installActivexTemplete: ['<div class="tips delmailTips netpictips" id="setupToolContainer" style="width:304px;">',
            '<a hidefocus="1" class="delmailTipsClose" href="javascript:void(0)" id="closeSetupTool"><i class="i_u_close"></i></a>',
            '<div class="tips-text">',
            '<div class="imgInfo">',
            '<a hidefocus="1" class="imgLink imgAttch" href="javascript:void(0)" title="图片"><img src="/m2012/images/module/FileExtract/attrch.png"></a>',
            '<dl class="attrchUp"> ',
            '<dt><strong>支持极速上传，大文件上传更加稳定！</strong></dt>',
            '<dd><span class="mr_10"><i class="i_done mr_5"></i>高速秒传</span> <span><i class="i_done mr_5"></i>上传<span id="maxUploadSize">超</span>大文件</span></dd>',
            '<dd><span class="mr_10"><i class="i_done mr_5"></i>断点续传</span> <span><i class="i_done mr_5"></i>显示上传进度</span></dd>',
            '<dd class="mb_15"><a hidefocus="1" href="/m2012/controlupdate/mail139_tool_setup.exe" target="_blank" class="btnSetG"><span>安装139邮箱小工具</span></a></dd>',
            '</dl>',
            '</div>',
            '</div>',
            '<div class="tipsTop diamond"></div>',
            '</div>'].join(""),

        /**
         *上传模型公共代码
         *@constructs M2012.Compose.Model.StorageCabinet
         *@param {Object} options 初始化参数集
         *@example
         */
        initialize : function (options) {
            this.setConditionType(options.type);
            this.resetMaxUploadSize();
        },

        setConditionType: function (type) {
            this.set("curConditionType", type ? type : "file");
        },

        getUploadInterface: function(){
            return this.get("curConditionType") + ":fastUpload";
        },

        getResumeInterface: function(){
            return this.get("curConditionType") + ":resumeUpload";
        },

        getCommonUploadInterface: function(){
            return this.get("curConditionType") + ":normalUpload";
        },

        getUploadKey: function (file, callback, reqData) {
            var self = this;
            var curConditionType = self.get("curConditionType");

            var data = {
                fileName: file.name,
                fileSize: file.size,
                fileMd5: file.fileMd5
            };

            //彩云上传需要多加2个参数
            if (reqData) {
                data.directoryId = reqData.directoryId;
                data.dirType = reqData.dirType;
                data.thumbnailSize = "65*65";//返回缩略图的尺寸
            }

            data = top.$Xml.obj2xml(data);

            var result = {};
            var uploadInterfaceName = this.getUploadInterface();
            self.postXml(uploadInterfaceName, data, function (e) {
                var response = e.responseData;

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.status = val.status;
                        result.urlUpload = val.url;
                        result.businessId = val.fileId;
                        result.isMcloud = val.isMcloud || "0";//是否存彩云

                        var fileInfo = val.file;
                        result.fileInfo = fileInfo;//将上传文件的相关信息存储起来(文件快递或者彩云)
                        result.name = fileInfo.fileName || fileInfo.name || file.name;//上传重复文件，需要取服务端的新文件名
                        if (fileInfo.file) {
                            result.thumbUrl = curConditionType == "file" ? fileInfo.thumbnailImage : fileInfo.file.thumbnailUrl;//单副本文件，获取缩略图
                        }
                        result.dataUpload = val["postParam"];
                        result.isMcloud == "1" && result.dataUpload && (result.uploadTaskID = result.dataUpload.UploadtaskID);//存彩云，获取断点信息的时候需要参数uploadTaskID
                        result.dataUpload.ranges = "";//已经上传的文件片段，第一次上传rang为空
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(uploadInterfaceName + " illegality json|" + e.responseText, "[" + uploadInterfaceName + "]", e.responseText);
                    }
                } else {
                    result.success = false;
                    result.summary = response && response.summary;
                    result.response = response;
                    self.logger.error(uploadInterfaceName + " returndata error|" + e.responseText, "[" + uploadInterfaceName + "]", e.responseText);
                }

                callback && callback(result);
            }, function (e) {
                result.success = false;
                callback && callback(result);
                self.logger.error(uploadInterfaceName + " ajax error|" + e, "[" + uploadInterfaceName + "]", e);
            });
        },
		//获取彩云信息(所有目录信息)
        getDirectorys : function(callback) {
			var self = this;
            self.callApi("disk:getDirectorys", null, function(res) {
				if(callback) {
					callback(res);
				}
			});
		},
		//存彩云
		saveToDisk : function(callback){
			var self = this;
			//debugger;
	        var currentFile = _.last(self.fileUploadSuc);
	        var dir = this.dirTypes;
            var requestData = {
                directoryId: self.get("attachId"),
                shareFileId: currentFile.businessId,
                comeFrom: '0',//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.USER_DIR
            };
			self.callApi("file:turnFile",requestData,function(res){
				if(callback) {
					callback(res);
				}
			})

		},
		//获取网盘目录下的文件及目录
		getfiles : function(callback,directoryId){
			var self = this,options ={};
			if(directoryId){
				options.directoryId = directoryId;
	            self.callApi("disk:fileListPage", options, function(res) {
					if(callback) {
						callback(res);
					}
				});
			}
		},
        //新建目录
        createDir: function (callback, options) {
            var self = this;
            self.callApi("disk:createDirectory", getData(), function (result) {
                callback && callback(result);
            });
            function getData(){
                if (!options.parentId) {
                    options.parentId = self.get("RootId");
                    options.dirType = self.getDirTypeForServer();
                }
                return options;
            }
        },

        //获取断点上传地址和断点位置
        /*
         * @fileid {String} 必填 彩云id
         * @uploadTaskID {String} 选填 彩云id
         */
        getBreakpointKey: function (fileid, uploadTaskID, callback) {
            var self = this;
            var data = {
                fileId: fileid,
                uploadTaskID: uploadTaskID
            };
            var curConditionType = self.get("curConditionType");

            data = top.$Xml.obj2xml(data);

            var resumeInterfaceName = this.getResumeInterface();
            this.postXml(resumeInterfaceName, data, function (e) {
                var response = e.responseData;
                var result = {};

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.status = val.status;
                        result.urlUpload = val.url;
                        result.businessId = val.fileId;
                        result.isMcloud = val.isMcloud || "0";//是否存彩云

                        var fileInfo = val.file;
                        result.fileInfo = fileInfo;//将上传文件的相关信息存储起来
                        result.name = fileInfo.fileName || fileInfo.name || self.get("currentFile").name;//上传重复文件，需要取服务端的新文件名

                        result.dataUpload = val["postParam"];
                        result.isMcloud == "1" && result.dataUpload && (result.uploadTaskID = result.dataUpload.UploadtaskID);//存彩云，获取断点信息的时候需要参数uploadTaskID
                        result.dataUpload.ranges = val.ranges;

                        if (self.monitorIntervalId) {//网络断开又恢复正常了
                            clearInterval(self.monitorIntervalId);
                            self.monitorIntervalId = null;
                        }
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(resumeInterfaceName + " illegality json|" + e.responseText, "[" + resumeInterfaceName + "]", e.responseText);
                    }
                } else {
                    result.success = false;
                    self.logger.error(resumeInterfaceName + " returndata error|" + e.responseText, "[" + resumeInterfaceName + "]", e.responseText);
                }

                callback && callback(result);
            }, function (e) {
                self.logger.error(resumeInterfaceName + " ajax error|" + e, "[" + resumeInterfaceName + "]", e);
            });
        },

        getCommonUploadKey: function (file, callback, reqData) {
            var self = this;
            var curConditionType = self.get("curConditionType");

            var data = {
                fileName: file.name,
                returnUrl: this.commonUploadResultUrl
            };

            //彩云上传需要多加2个参数
            if (reqData) {
                data.directoryId = reqData.directoryId;
                data.dirType = reqData.dirType;
                data.thumbnailSize = "65*65";//返回缩略图的尺寸
            }

            data = top.$Xml.obj2xml(data);

            var result = {};
            var uploadInterfaceName = this.getCommonUploadInterface();
            self.postXml(uploadInterfaceName, data, function (e) {
                var response = e.responseData;

                result.success = false;
                if (response && response.code == "S_OK") {
                    result.message = response.summary;
                    try {
                        var val = response["var"];
                        result.success = true;
                        result.urlUpload = val.url;
                        result.uploadCode = val.uploadCode;
                        result.isMcloud = val.isMcloud || "0";

//                        var fileInfo = val[curConditionType];
//                        result[curConditionType + "Info"] = fileInfo;//将上传文件的相关信息存储起来(文件快递或者彩云)
//                        result.name = (curConditionType == "file" ? fileInfo.fileName : fileInfo.name) || file.name;//上传重复文件，需要取服务端的新文件名
                        result.name = file.name;
                    } catch (ex) {
                        result.success = false;
                        self.logger.error(uploadInterfaceName + " illegality json|" + ex, "[" + uploadInterfaceName + "]", ex);
                    }
                } else {
                    result.success = false;
                    result.summary = response.summary;
                    self.logger.error(uploadInterfaceName + " returndata error|" + response, "[" + uploadInterfaceName + "]", response);
                }

                callback && callback(result);
            }, function (e) {
                result.success = false;
                callback && callback(result);
                self.logger.error(uploadInterfaceName + " ajax error|" + e, "[" + uploadInterfaceName + "]", e);
            });
        },

        //组装上传需要的post数据
        packageData: function (file) {
            var dataUpload = file.dataUpload || {};

            dataUpload.urlUpload = file.urlUpload;
            dataUpload.businessId = file.businessId;
            dataUpload.isMcloud = file.isMcloud;

            file.uploadCode && (dataUpload.uploadCode = file.uploadCode);

            return dataUpload;
        },

        //上传完成触发
        completeHandle: function (clientTaskno, responseText, sucHandle, errHandle, uploadApp) {
            console.log("上传完成分布式返回报文：" + responseText);

            var self = this;
            var errMsg = this.params.MIDDLE_SERVER_CODE["S_ERR"];
            var sucMsg = this.params.MIDDLE_SERVER_CODE["S_OK"];
            var retcode = "";
            var responseData = "";
            var middleret = "";
            var middleretJson = {};

            //上传文件存在单副本，不用再上传了
            if (responseText === true) {
                this.fileUploadSuc.push(jQuery.extend(true, {}, this.get("currentFile")));
                console.log("上传成功文件：");
                console.log(this.fileUploadSuc);
                sucHandle();
                this.behaviorUploadSuc(uploadApp);
                return;
            }

            //普通上传
            if (responseText.indexOf("http://") == 0) {
                responseData = responseText;

                if (self.get("currentFile").isMcloud == "1") {//存彩云，通过uploadRet是否有值，判断文件是否上传成功
                    retcode = M139.Text.Url.queryString("uploadRet", responseText);
                    validateUpload(true);
                    return;
                }

                retcode = M139.Text.Url.queryString("retcode", responseText);
                middleret = M139.Text.Url.queryString("middleret", responseText);
                try {
                    middleret = middleret.replace(/\+/g, "%20");//java中会将空格转换成+，所以解码前要先对+做正确的编码
                    middleret = unescape(middleret);
                } catch (ex) {
                    errUploadHandle(true);
                    return;
                }
                validateUpload(true);

                return;
            }

            //html5,flash或控件上传
            responseData = top.$Xml.xml2object(responseText);
            if (!responseData) {
                errHandle(errMsg);
                return;
            }

            retcode = responseData.retcode;
            middleret = responseData.middleret;
            validateUpload();

            function validateUpload(isCommonUpload){
                var curConditionType = self.get("curConditionType");

                //存彩云
                if (self.get("currentFile").isMcloud == "1") {
                    if (isCommonUpload) {//普通上传
                        if (retcode && retcode != "") {//上传成功
                            sucHandle();
                            //上传成功之后做记录
                            self.set("needUploadFileNum", 1);
                            self.set("uploadedFileNum", 1);
                            self.behaviorUploadSuc(uploadApp);
                        } else {
                            errUploadHandle(true);
                        }
                        return;
                    }

                    retcode = responseData.resultCode;
                    if (retcode == 0) {//存彩云成功
                        self.fileUploadSuc.push(jQuery.extend(true, {}, self.get("currentFile")));
                        try {
                            self.get("currentFile").fileInfo.file.fileSize = self.get("currentFile").fileInfo.file.rawSize = self.get("currentFile").size;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                        sucHandle();
                        self.behaviorUploadSuc(uploadApp);
                    } else {
                        console.log("上传分布式失败! retcode: " + retcode);
                        self.logger.error("upload mcloud returndata error|[pcUploadFile]|上传彩云失败! retcode:" + retcode, "[pcUploadFile]", responseData);
                        errUploadHandle(isCommonUpload);
                    }

                    return;
                }

                if (retcode != self.params.DISPERSED_SERVER_CODE.SUC_UPLOAD) {//上传分布式失败
                    console.log("上传分布式失败! retcode: " + retcode);
                    self.logger.error("upload distributed returndata error|[fastuploadsvr.fcg]|上传分布式失败! retcode:" + retcode, "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                    return;
                }

                //上传分布式成功
                //继续判断middleret 为中间件返回的json 来判断是否入库中间件服务器
                if (!middleret) {
                    errUploadHandle(isCommonUpload);
                    console.log("入库失败! middleret: " + middleret);
                    self.logger.error(curConditionType + " upload middleret returndata error|[fastuploadsvr.fcg]|入库失败! middleret为空", "[fastuploadsvr.fcg]", responseData);
                    return;
                }

                try {
                    middleretJson = eval("(" + middleret + ")");
                } catch (ex) {
                    self.logger.error(curConditionType + "upload middleret json illegality|[fastuploadsvr.fcg]|middleret格式非法", "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                    return;
                }

                if (middleretJson.code == "S_OK") {
                    self.fileUploadSuc.push(jQuery.extend(true, {}, self.get("currentFile")));
                    console.log("上传成功文件：");
                    console.log(self.fileUploadSuc);

                    var middleretJsonVar = middleretJson["var"];
                    console.log(middleretJson);

                    //普通上传，将上传文件信息存储起来
                    if (isCommonUpload) {
                        try {
                            self.get("currentFile").fileInfo = middleretJsonVar.file;
                            self.get("currentFile").size = middleretJsonVar.file.file.fileSize;
                            self.get("currentFile").businessId = middleretJsonVar.file.id;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                    }

                    if (curConditionType == "disk") {
                        try {
                            self.get("currentFile").fileInfo.file.fileSize = self.get("currentFile").fileInfo.file.rawSize;
                        } catch (ex) {
                            console.log("中间件返回上传文件的数据结构有问题！");
                        }
                    }

                    self.get("currentFile").thumbUrl = middleretJsonVar.url;
                    sucHandle();
                    self.behaviorUploadSuc(uploadApp);
                } else {
                    self.logger.error(curConditionType + " upload middleret returndata error|[fastuploadsvr.fcg]|S_ERR", "[fastuploadsvr.fcg]", responseData);
                    errUploadHandle(isCommonUpload);
                }
            }

            function errUploadHandle (isCommonUpload) {
                self.get("currentFile").summary = middleretJson["summary"] || errMsg;
                if (isCommonUpload) {
                    self.get("currentFile").fileInfo = {
                        uploadState: "false"
                    };
                }

                errHandle(errMsg);
            }
        },

        behaviorUploadSuc: function (uploadApp) {
            var curConditionType = this.get("curConditionType");

            if (uploadApp.currentUploadType == uploadApp.uploadType.HTML5) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_html5_uploadsuc"}) : BH({key : "diskv2_uploadhtml5_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.CONTROL) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_activex_uploadsuc"}) : BH({key : "diskv2_uploadactivex_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.FLASH) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_flash_uploadsuc"}) : BH({key : "diskv2_uploadflash_suc"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.COMMON) {
                BH({key : "diskv2_uploadcommon_suc"});
            }
        },

        //上传点击行为统计
        uploadClickBehavior: function (uploadApp) {
            var curConditionType = this.get("curConditionType");

            if (uploadApp.currentUploadType == uploadApp.uploadType.HTML5) {
                curConditionType == "file" ? BH({key : "fileexpress_cabinet_html5_upload_click"}) : BH({key : "diskv2_uploadhtml5_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.CONTROL) {
                curConditionType != "file" && BH({key : "diskv2_uploadactivex_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.FLASH) {
                curConditionType != "file" && BH({key : "diskv2_uploadflash_click"});
            } else if(uploadApp.currentUploadType == uploadApp.uploadType.COMMON) {
                BH({key : "diskv2_uploadcommon_click"});
            }
        },

        //控件上报错误日志
        errLogByActivex: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by activex|[fastuploadsvr.fcg]|" + logText);
        },

        //flash上报错误日志
        errLogByFlash: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by flash|I/O Error|" + logText, "I/O Error", logText);
        },

        //html5上传错误日志
        errLogByHtml5: function (logText) {
            var self = this;
            self.logger.error(self.get("curConditionType") + " upload by html5|Uploading Error|" + logText, "Uploading Error", logText);
        },

        //上传队列文件是否已经上传完成
        isUploading: function(){
            return this.get("needUploadFileNum") != this.get("uploadedFileNum");
        },

        postXml:function (url, data, successCallback, errorCallback) {
            this.callApi(url, data, function (e) {
                successCallback && successCallback(e);
            }, {
                headers:{"Content-Type":"text/xml"},
                error:function () {
                    errorCallback && errorCallback();
                }
            })
        },

        /*
         * 根据筛选规则，将符合规则的文件state设置为1，不符合的设为0,供上传组件使用
         * 添加字段error具体描述不能上传的原因，渲染界面的时候使用
         * @param {Object} fileList 用户选择的文件列表
         * @param {String} uploadType 当前上传的方式
         */
        filterFile: function (fileList, uploadType) {
            var isValid = true;

            for (var i = 0, len = fileList.length; i < len; i++) {
                var file = fileList[i];

                if ((/&/.test(file.name))) { //文件名中含有非法字符
                    file.state = 0;
                    file.error = "invalidFileName";
                    this.set("isTipFilterFile", true);
                    isValid = false;
                } else if (uploadType != "common") {
                    //是否超过套餐上传单文件大小限制
                    if (file.size == 0) {
                        isValid = false;
                        file.state = 0;
                        file.error = "emptyUploadSize";
                        this.set("isTipFilterFile", true);
                    } else if (file.size > this.maxUploadSize) {
                        isValid = false;
                        file.state = 0;
                        file.error = "limitUploadSize";

                        if (this.get("curConditionType") == "disk" && this.is20Version()) {
                            file.error = "limitMaxUploadSize";
                        }
                        this.set("isTipFilterFile", true);
                    } else if (uploadType == "flash" && (file.size > this.limitFlashUploadSize)) {//是否超过flash上传文件大小限制
                        isValid = false;
                        file.state = 0;
                        file.error = "limitFlashUploadSize";
                        this.set("isTipFilterFile", true);
                    } else {
                        file.state = 1;
                    }
                }

                if (file.clientTaskno == undefined || (file.clientTaskno == 0)) {//没有值，由脚本生产clientTaskno
                    file.clientTaskno = this.getClientTaskno();
                }
            }

            this.get("isTipFilterFile") && this.tipFilterFile(fileList);

            return isValid;
        },

        tipFilterFile: function (fileList) {
            var self = this;
            var emptyFileHtml = '<p>{fileNames} 为空文件，请重新选择！</p>';
            var invalidFileNameHtml = '<p>上传文件名不能有以下特殊字符 \/:*?"<>|&</p>';
            var limitFlashUploadSizeHtml = '{fileNames} 超过100M，无法上传！139邮箱小工具支持超大文件急速上传、断点续传！<a href="' + self.installToolUrl + '" target="_blank">立即安装</a>';
            var limitUploadSizeHtml = '文件单个上传大小已超过套餐限制{maxUploadSize}{upgradeTip}</p>';
            var upgradeTipHtml = '，请立即<a href="javascript:top.$App.showOrderinfo();" style="text-decoration: underline;">升级邮箱</a>！';
            var choseOther = '，请重新选择。';
            var emptyFileNames = [];
            var limitFlashUploadSizeFileNames = [];
            var limitUploadSizeFileNames = [];
            var invalidFileNames = [];
            var tipHtml = "";

            for (var i = 0, len = fileList.length; i < len; i++) {
                var file = fileList[i];

                if (file.error == "invalidFileName") {
                    invalidFileNames.push(file.name);
                } else if (file.error == "emptyUploadSize") {
                    emptyFileNames.push(file.name);
                } else if (file.error == "limitUploadSize" || file.error == "limitMaxUploadSize") {
                    limitUploadSizeFileNames.push(file.name);
                } else if (file.error == "limitFlashUploadSize") {
                    limitFlashUploadSizeFileNames.push(file.name);
                }
            }

            if (invalidFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(invalidFileNameHtml, {fileNames: invalidFileNames.join(",")});
            }
            if (emptyFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(emptyFileHtml, {fileNames: emptyFileNames.join(",")});
            }
            if (limitFlashUploadSizeFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(limitFlashUploadSizeHtml, {fileNames: limitFlashUploadSizeFileNames.join(",")});
            }
            if (limitUploadSizeFileNames.length > 0) {
                tipHtml += M139.Text.Utils.format(limitUploadSizeHtml, {
                    fileNames: limitUploadSizeFileNames.join(","),
                    maxUploadSize: M139.Text.Utils.getFileSizeText(self.maxUploadSize),
                    upgradeTip: self.isVipVersion() ? choseOther : upgradeTipHtml
                });
            }

            top.$Msg.alert(tipHtml, {isHtml: true});
            this.set("isTipFilterFile", false);
        },

        //获取文件随机标示
        getClientTaskno: function() {
            var rnd = parseInt(Math.random() * 100000000);
            var randomNumbers = this.randomNumbers;

            if (randomNumbers[rnd]) {
                return arguments.callee();
            } else {
                randomNumbers[rnd] = true;
                return rnd;
            }
        },

        delFileUploadSuc: function (clientTaskno) {
            var fileUploadSuc = this.fileUploadSuc;

            for (var i = 0, len = fileUploadSuc.length; i < len; i++) {
                var file = fileUploadSuc[i];

                if (file.clientTaskno == clientTaskno) {
                    fileUploadSuc.splice(i, 1);
                    i--;
                }
            }
        },

        getTimestamp:function (timeStr) {
            return this.parseDate(timeStr).getTime() / 1000;
        },

        //将时间字符串转换为时间
        parseDate:function (str) {
            str = str.trim();
            var result = null;
            var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
            var m = str.match(reg);
            if (m) {
                result = new Date(m[1], (m[2] - 1), m[3], m[4], m[5], m[6]);
            }
            return result;
        },

        transformTime: function (second) {
            var now = new Date;

            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(second);
            return $Date.format("hh:mm:ss", now);
        },

        getFullName: function (fileNameOrigin) {// 不带拓展名
            var point = fileNameOrigin.lastIndexOf(".");
            if(point == -1){
                return fileNameOrigin;
            }else{
                return fileNameOrigin.substring(0, point);
            }
        },

        getExtendName: function (fileNameOrigin) {// 仅返回拓展名
            if(fileNameOrigin.indexOf('.') == -1){
                return '';
            }

            var length = fileNameOrigin.split(".").length;
            return fileNameOrigin.split(".")[length-1].toLowerCase();
        },

        //替换模板中的{**}，如果没有指定被替换，就保持不便，主要用在模板之前的组装合并
        format: function (str, arr) {
            var reg;
            if ($.isArray(arr)) {
                reg = /\{([\d]+)\}/g;
            } else {
                reg = /\{([\w]+)\}/g;
            }
            return str.replace(reg,function($0,$1){
                var value = arr[$1];
                if(value !== undefined){
                    return value;
                }else{
                    return $0;
                }
            });
        },

        getShortName : function(name, max){// 带拓展名
            var point = name.lastIndexOf(".");
            if(point != -1){
                name = name.substring(0, point);
            }
            if(name.length > max){
                return name.substring(0, max) + "…";
            }else{
                return name;
            }
        },

        is20Version: function() {
            return top.$User.getServiceItem() == top.$User.getVipStr("20");
        },

        isVipVersion:function() {
            var serviceItem = top.$User.getServiceItem();
            return '0016,0017'.indexOf(serviceItem)>-1;
        },

        showInstallActivex: function (options) {
		//	debugger;
			var htmlUpdate = ['<div class="autoTips" style="width: auto; border:0;">',
									'<div class="norTips clearfix" style="border:0">',
										'<span class="norTipsIco"><img src="/m2012/images/module/networkDisk/tool.png" /></span>',
										'<dl class="norTipsContent">',
											'<dt class="norTipsLine mt_10 fz_14">升级您的139邮箱小工具，支持更快捷、更稳定的文件上传。</dt>',
											'<dd class="norTipsLine mt_20"><a id="update139" href="/m2012/controlupdate/mail139_tool_setup.exe" class="btnSure" onclick="update.close()"><span>升级139邮箱小工具</span></a></dd>',
										'</dl>',
									'</div>',
								'</div>'].join("");
			var htmlInstall = ['<div class="autoTips" style="width: auto; border:0;">',
								'<div class="norTips clearfix" style="border:0">',
									'<span class="norTipsIco"><img src="/m2012/images/module/networkDisk/tool.png" /></span>',
									'<dl class="norTipsContent">',
										'<dt class="norTipsLine mt_10 fz_14">安装您的139邮箱小工具，支持更快捷、更稳定的文件上传。</dt>',
										'<dd class="norTipsLine mt_20"><a id="install139" href="/m2012/controlupdate/mail139_tool_setup.exe" class="btnSure"><span>安装139邮箱小工具</span></a></dd>',
									'</dl>',
								'</div>',
							'</div>'].join("");
			options = options || {};
			
			if(options.isInstall){
				var install = top.$Msg.showHTML(htmlInstall,{dialogTitle:"安装139邮箱小工具"});
				top.$("#install139").click(function(){
					install.close();
				});
			}else{
				var update = top.$Msg.showHTML(htmlUpdate,{dialogTitle:"升级139邮箱小工具"});
				top.$("#update139").click(function(){
					update.close();
				});
				
			}
			
			/*
            var elem = $("#setupToolContainer");

            if (elem.length > 0) {
                elem.show();
            } else {
				elem = $(this.installActivexTemplete).appendTo(top.document.body);
				elem.find("#closeSetupTool").click(function(){
					elem.hide();
				});

                var btnOffset = $btn.offset();
                elem.css({
                    left: btnOffset.left-6,
                    top: btnOffset.top + 25 + 106
                });
            }
			*/
        }
    }));
})(jQuery, Backbone, _, M139);