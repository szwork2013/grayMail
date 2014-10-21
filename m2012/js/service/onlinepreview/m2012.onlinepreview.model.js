/**   
* @fileOverview 普通模式读信
*/
(function (jQuery, _, M139) {

    $User = {
        getUid: function () {
            var mo = $T.Url.queryString("mo");
            mo = M139.Text.Mobile.add86(mo)
            return mo;
        }
    }
    /**
    *@namespace 
    *在线预览MODEL层
    */

    M139.namespace("M2012.Service.OnlinePreview.Model", Backbone.Model.extend({

        defaults: {
            initData: null,
            isLoad: false, //是否已加载，resize时不再加载
            hasTips: true,
            dataSource: null,
            sid: $T.Url.queryString("sid"),
            mobile: $T.Url.queryString("mo"),
            loginName: $T.Url.queryString("loginName"),
            mid: $T.Url.queryString("mid"),
            nav: [],
            currentPage: 1,
            pptLen: 0,
            opes: $T.Url.getAbsoluteUrl("/mw2/opes/"),
            unzippath: $T.Url.queryString("unzippath"),
            comefrom: $T.Url.queryString("comefrom"),
            timeout: false,//附件加载超时
            currentSheet : 1
        },
        message: {
            relogin: "您已经退出邮箱，请重新<a href='http://mail.10086.cn' target='_blank'>登录</a>"
        },
        callApi: M139.RichMail.API.call,
        timeOut: function (data) {
            var self = this;
            var num = 0;
            var filedownurl = data.filedownurl;
            var t = setInterval(function () {
                num++;
                if (self.get("timeout")) {
                    clearInterval(t);
                }
                if (num > 180) {
                    var obj = {
                        dl: filedownurl
                    }
                    var mainView = new M2012.Service.OnlinePreview.View();
                    var html = mainView.loadingErrorHtml(obj);
                    $("#loadingStatus").html(html);
                    clearInterval(t);
                }

                //日志上报
                self.timeoutLogger({
                    url: data.url,
                    num: num,
                    filename: data.filename
                })

            }, 1000)
        },
        timeoutLogger: function (options) {
            //每一分钟整上报一次记录
            var self = this;
            var num = options.num;
            if (num % 60 == 0) {
                self.logger({
                    url: options.url,
                    msg: "OVER_" + num + "S_NO_RESPONSE",
                    filename: decodeURIComponent(options.filename)
                })
            }
        },
        getData: function (options, callback, callback1) {
            var self = this;
            var src = options.url; //"/mw/opes/preview.do?";
            var filedownurl = decodeURIComponent(options.filedownurl);
            var filename = options.filename;
            var filePsw = options.filePsw || "" ;
            try {
                filename = decodeURIComponent(filename);
                filename = encodeURIComponent(filename);
            } catch (e) {
                filename = encodeURIComponent(filename);
            }
            var data = {
                url: options.url,
                account: '',
                fileid: options.fileid,
                browsetype: options.browsetype,
                filedownurl: filedownurl,
                filename: filename,
                unzipPath: options.unzippath,
                comefrom: options.comefrom,
                sid: options.sid,
                longHTTP: "true",
                filePsw : filePsw 
            };
            self.timeOut(data);
            this.callApi(src, data, function (result) {
                self.set({ timeout: true });
                self.logger({
                    url: options.url,
                    responseText: result.responseText,
                    code: (result.responseData && result.responseData.code) || '',
                    filename: filename
                });
                callback(result.responseData);
            }, {
	            
                error: function () {
                    if (callback1) {
                        var obj = {
                            dl: filedownurl
                        }
                        var mainView = new M2012.Service.OnlinePreview.View();
                        var html = mainView.loadingErrorHtml(obj);
                        callback1(html);
                    }
                    self.logger({
                        level: "ERROR",
                        url: options.url,
                        msg: "ONLINE_PREVIEW_ERROR",
                        responseText: '',
                        code: "-1",
                        filename: decodeURIComponent(options.filename)
                    });
                }
            })
        },


        /**
        * 附件格式验证
        */
        checkFile: function (fileName) {
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|mp4|flv|m4v|f4v)$/i;
            var reg2 = /\.(?:rar|zip|7z)$/i;

            if (reg.test(fileName)) {
                return 1;
            } else if (reg2.test(fileName)) {
                return 2;
            } else {
                return -1;
            }
        },
        checkFileType: function (filename) {//验证返回具体的后缀名
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2); //后缀名  
            file = file.toLowerCase();
            switch (file) {
                case "ppt":
                case "pptx":
                    return "ppt";
                case "txt":
                //case "html":
                //case "htm":
                    return "txt";
                case "rar":
                case "zip":
                case "7z":
                    return "rar";
                case "xls":
                case "xlsx":
                    return "xls";
                case "doc":
                case "docx":
                    return "doc";
                case "pdf":
                    return "pdf";
                case "jpg":
                case "jpeg":
                case "jpe":
                case "jfif":
                case "gif":
                case "png":
                case "bmp":
                case "ico":
                	return "img";
                case "mp4":
                case "flv":
                case "f4v":
                case "m4v":
                	return "video";
            }
            return file;
        },
        getPreViewUrl: function (file, initData) {//附件的下载地址
            var ssoSid = this.get("sid");
            var url = 'http://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:download',
                mid: initData.id,
                offset: file.fileOffSet,
                size: file.fileSize,
                sid: ssoSid,
                type: file.attachType || file.type,
                encoding: file.encode || file.encoding
            }) + '&name=' + encodeURIComponent(file.fileName);

        },
        getPreViewUrlForCompose: function (file) {//写信附件的下载地址
            var ssoSid = this.get("sid");
            var url = 'http://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:getAttach',
                fileName: file.fileName,
                fileId: file.fileId,
                sid: ssoSid
            });

        },
        getAttachImageUrl : function(fileId, fileName, fullUrl) { //写信页图片地址
        	var sid = this.get("sid");
		    var url = "/RmWeb/view.do?func=attach:getAttach&sid="+sid+"&fileId="+fileId + "&fileName=" + encodeURIComponent(fileName);
		    if(fullUrl)url = "http://" + location.host + url;
		    return url;
		},
        /**
        * 获取其他附件url
        * @param {object} p 附件属性
        */
        getUrl: function (p) {
            var ucDomain = domainList[1].webmail;
            var uid = this.get("mobile");
            var loginName = this.get("loginName");
            var ssoSid = this.get("sid");
            var skinPath = "skin_green";
            var rmResourcePath = location.host + "/m2012";
            var diskInterface = domainList.global.diskInterface;
            var disk = domainList.global.disk;

            var params = {
                fi: encodeURIComponent(p.fileName),
                mo: uid,
                sid: ssoSid,
                id: p.contextId || "",
                src: p.type || "attach",
                loginName: loginName,
                comefrom: p.comefrom || "readmail",
                composeId: p.composeId || "",
                skin: skinPath,
                resourcePath: encodeURIComponent(rmResourcePath),
                diskservice: encodeURIComponent(diskInterface),
                filesize: p.fileSize || "",
                encoding: 1,
                disk: disk,
                rnd: Math.random()
            }
            if (p.downloadUrl) $.extend(params, { dl: p.downloadUrl });
            var previewUrl = $T.Url.makeUrl("/m2012/html/onlinepreview/online_preview.html", params);
            return previewUrl;
        },
        getAttach: function (callback,error) {//读信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                fid: initData.fid,
                mid: initData.id,
                autoName: 1, //有些附件会没有文件名，此属性自动命名附件
                markRead: 1,
                returnHeaders: { Sender: "", "X-RICHINFO": "" }, //为订阅平台增加参数
                filterStylesheets: 0,
                filterImages: 0,
                filterLinks: 0,
                keepWellFormed: 0,
                header: 1,
                supportTNEF: 1,
                returnAntispamInfo: 1
            };
            $RM.readMail(data, function (result) {
                if (result && result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }else{
	                if(error){
		                error(result)
	                }
                }
            });
        },
        getAttachForCompose: function (callback) { //写信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                id: initData.composeId
            };
            
            this.callApi("attach:refresh", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
        logger: function (options) {
            var url = [
                "http://" + location.host + "/" + (options.url || location.href || ""),
                "code=" + (options.code || ''), //手工拼接字段code，用于运维统计成功率
                "filename=" + (options.filename || '') //记录filename方便查找日志
            ].join("|");
            M139.Logger.sendClientLog({
                level: options.level || "INFO",
                name: "RichMailHttpClient",
                url: url,
                errorMsg: options.msg || "NULL",
                responseText: options.responseText || ''
            });
        }
    }));

})(jQuery, _, M139);
