var sharingSend = {
    //文件快递发送邮件人数
    mailReceiverCount: 400,
    //文件快递发送手机人数
    mobileReceiverCount: 200,
    //验证码地址
    validateUrl: "",
    /*文件发送方式
    *  mobile: 手机  email: 邮件
    */
    sendMode: null,
    //一次发送文件数，免费用户1次10个文件，5元用户1次20个文件，20元用户一次50个文件
    fileSendOnceMax: 50,
    files:[],
    urls: {
        //获取暂存柜文件信息
        getFilesUrl: function() {
            return fileSharing.resolveUrl("getFiles");
        },
        //获取发送到邮箱接口地址
        getSendMailUrl: function() {
            return fileSharing.resolveUrl("sendEmail");
        },
        //获取发送到手机接口地址
        getSendMobileUrl: function() {
            return fileSharing.resolveUrl("sendMobile");
        },
        getInitDataUrl: function() {
            return fileSharing.resolveUrl("fSharingInitData");
        }
    },
    messages: {
        Lodding: "加载中...",
        Uploding: "文件正在上传,请先取消任务",
        NotAllowSend: "文件上传中,请稍候再点击发送",
        SelectFile: "请选择要发送的文件",
        ServerException: "服务器繁忙，请稍候再试",
        IsAbortOpt: "您是否放弃当前操作？",
        MaxSendFile: "一次最多只能发送{0}个文件，请调整后重试。",
        MaxSendTimes: "文件{0}已经超出发送次数",
        MaxSendPeople: "您目前最多只能发给{0}个人<span style='display:{1}'>，立即<a href='javascript:top.$App.showOrderinfo();'>升级邮箱</a>可获得更多用户权益！</span>",
        NotAllowSendUnfinishedFile: "不能发送未上传完成的文件",
        InputVerifyCode: "请输入验证码",
        InputUserNumber: "请输入接收的手机号码",
        UserNumberError: "接收手机号码输入有误，请检查输入。",
        InputEmail: "请输入接收的邮件地址",
        EmailError: "请输入正确的邮件地址:{0}",
        UploadError: "上传失败,网络连接超时",
        UploadComplete: "正在完成上传...",
        UploadWaiting: "正在等待上传...",
        EmailTipText: "可同时发送给{0}个人，邮箱之间以分号“;”隔开",
        MobileTipText: "可同时发送给{0}人，手机号之间以分号“;”隔开",
        maxUploadTips: "(支持最大{0}的单个文件)"
    },

    //事件
    action: {
        pageLoad: function() {
            //邮件地址输入框
            window.riEmail = null;
            //手机号码输入框
            window.riMobile = null;

            //加载皮肤
            Utils.getUserDataFromCookie();
            Utils.loadSkinCss(null, document, "fileExp");

            //获取初始化信息
            sharingSend.server.getInitData(function () {
                if (!this) { return; }
                this.mailSendCount && (sharingSend.mailReceiverCount = parseInt(this.mailSendCount));
                this.mobileSendCount && (sharingSend.mobileReceiverCount = parseInt(this.mobileSendCount));
                this.validateUrl && (sharingSend.validateUrl = this.validateUrl);
                if (this.fileSendCount) {
                    sharingSend.fileSendOnceMax = this.fileSendCount;
                    sharingSend.messages.MaxSendFile = sharingSend.messages.MaxSendFile.format(this.fileSendCount);
                }
            });
            //初始化fileManager
            sharingSend.action.initFileMgr();
            //获取暂存柜基本信息
            sharingSend.server.getFiles(function() {
                window.FolderInfo = this;
            });
            if (window.FolderInfo && window.FolderInfo.flag != undefined) {
                top.showQuicklyShareMobileLimitTip = (window.FolderInfo.flag == 0);
            }
            sharingSend.messages.MaxSendFile = sharingSend.messages.MaxSendFile.format(sharingSend.fileSendOnceMax);
            $(function() {
                $(".fileExpMenubox").html('<span class="fileDeposit"><b></b><a id="aFileList" href="javascript:;">文件暂存柜</a></span>');
                //注册事件
                var clicks = {
                    btnUpload: function() {
                        sharingSend.action.showSelectMode();
                    },
                    aFileList: sharingSend.action.toFileList,
                    aEmailSend: sharingSend.action.sendMail,
                    aMobileSend: sharingSend.action.sendMobile,
                    aRefreshCode: sharingSend.action.refreshVerifycode
                };
                fileSharing.tool.registClicks(clicks);
                //设置验证码输入框事件
                $("#txtVerifycode").focus(function () {
                    this.value = "";
                    this.style.color = "black";
                    $("#imgVerifycode").parent().parent().show();
                    sharingSend.action.refreshVerifycode();
                    $(this).unbind("focus", arguments.callee);
                });
				var maxFileText = "1G";
                if (top.SiteConfig.comboUpgrade) {
                    maxFileText = (Math.floor(top.$User.getCapacity("maxannexsize") / 1024) || 4) + "G";//maxannexsize的单位默认是M
                }
				var tipsText = sharingSend.messages.maxUploadTips.format(maxFileText);
				window.FolderInfo.maxFileText = maxFileText;
                $('#fileSend_maxUploadTips').html(tipsText.toString());
                //启用ajax加载提示功能
                fileSharing.tool.startAjaxMsg();
                //呈现富文本输入框
                sharingSend.render.renderRichBox();
                //快速预览
                sharingSend.render.renderPreview();
                //根据发送类型切换页面
                sharingSend.action.switchSendMode();
                //初始化已添加文件列表
                sharingSend.action.initFileList();
                //设置邮件主题框事件
                sharingSend.action.setMailTitle();
                //解决ie下刷新输入框失去焦点问题
                sharingSend.action.refreshFocus();
                //显示快递文件小窍门提示语
                $("#tipControl").show();
            });
            //页面卸载时执行
            $(window).unload(function() {
                fileSharing.tool.tryCatch(function() {
                    window.fm.clearEventListener(onFileChange.functionKey);
                });
            });
            //添加行为日志
            fileSharing.tool.addBehavior({
                actionId: 10476, thingId: 0,
                moduleId: 11, actionType: 20
            });
        },
        //selectBox页面跳转到暂存柜
        toFileList: function() {
            var param = "&goid=9000";
            top.Links.show("diskDev", param, false);
        },

        onUploadSelect: function (e) {
            var files = e.files;
            $(files).each(function () {
                this.complete = true;
                this.state = "success";
            });
            sharingSend.tool.addFiles(files);
            if (e.autoSend) {
                //传完自动发送
                $("#aEmailSend,#aMobileSend").each(function () {
                    if (!top.M139.Dom.isHide(this, true)) {
                        $(this).click();
                    }
                });
            }
        },

        //关闭当前页面时处理
        moduleClose: function() {
            var bool = true;
            fileSharing.tool.tryCatch(function() {
                if (fm.getFiles().length > 0 ||
                    document.getElementById("txtEmailSend").value.indexOf("@") > 0 ||
                    /\d/.test(document.getElementById("txtMobileSend").value) ||
                    document.getElementById("txtContent").value.trim() != "") {
                    bool = window.confirm(sharingSend.messages.IsAbortOpt);
                    fileSharing.tool.tryCatch(function() {
                        if (bool) {
                            sharingUpload.action.stopUpload();
                        }
                    });
                }
            });
            return bool;
        },
        //刷新验证码
        refreshVerifycode: function () {
            var url = "";
            if (sharingSend.validateUrl) {
                url = sharingSend.validateUrl + "&rnd=" + Math.random();
            }
            $("#imgVerifycode").attr("src", url);
        },
        //设置邮件主题框事件
        setMailTitle: function() {
            $("#txtTitle").focus(function() {
                var value = $(this).attr("defaultvalue");
                if (this.value == value) {
                    this.value = "";
                }
            }).blur(function() {
                var value = $(this).attr("defaultvalue");
                if (this.value == "") {
                    this.value = value;
                }
            });
        },
        //发邮件
        sendMail: function() {
            //当有文件正在上传时不允许操作
            if (sharingSend.tool.isUploading()) {
                fileSharing.FF.alert(sharingSend.messages.NotAllowSend);
                return;
            }
            //获取用户输入的邮件信息
            var input = sharingSend.tool.getInputEmail();
            if (!input.success) {
                fileSharing.FF.alert(input.msg);
                return;
            }
            //获取要发送的文件
            var files = sharingSend.tool.getFiles();
            if (files.length == 0) {
                fileSharing.FF.alert(sharingSend.messages.SelectFile);
                return;
            }
            //文件不能超过fileSendOnceMax个
            if (files.length > sharingSend.fileSendOnceMax) {
                fileSharing.FF.alert(sharingSend.messages.MaxSendFile);
                return;
            }
            //未上传完成的文件不允许发送
            for (var i = 0, len = files.length; i < len; i++) {
                var f = files[i];
                if (f.fileType == "local" && !f.complete) {
                    alert(sharingSend.messages.NotAllowSendUnfinishedFile);
                    return;
                }
            }
            //检查每个文件是否超过最大发送次数
            var fileRemain = sharingSend.tool.checkRemainTimes(files, input.emails.length);
            if (!fileRemain.success) {
                fileSharing.FF.alert(fileRemain.msg);
                return;
            }
            //拼接xml数据
            var filesId = [];
            var netDiskFiles = [];
            var lastSendFiles = [];
            var urls = [];
			/*
            $(files).each(function() {
                if (this.fileType == "netDisk") {
                    netDiskFiles.push(this);
                } else if (this.isUrl) {
                    urls.push(this.fileName);
                } else {
                    filesId.push(this.uploadId || this.fileId);
                }
                lastSendFiles.push(this.fileName);
            });*/
			for (var j = 0, filesLen = files.length; j < filesLen; j++) {
				var fileItem = files[j];
				if (fileItem.fileType == "netDisk") {
                    netDiskFiles.push(fileItem);
                } else if (fileItem.isUrl) {
                    urls.push(fileItem.fileName);
                } else {
                    filesId.push(fileItem.uploadId || fileItem.fileId);
                }
                lastSendFiles.push(fileItem.fileName);
			};
            var xmlCode = '<Request>\
                    <Type>email</Type>\
                    <UserNumber>{UserNumber}</UserNumber>\
                    <Emails>{Emails}</Emails>\
                    <Title>{Title}</Title>\
                    <Content>{Content}</Content>\
                    {Fileid}\
                    {DiskFileRequest}\
                    {FileUrlRequest}\
                </Request>';
            var userNumber = top.UserData.userNumber || top.uid,
            accountEmail = top.$User.getDefaultSender(),
            senderName = top.UserData.userName || top.trueName;

            var obj = {
                UserNumber: encodeURIComponent(senderName ? Utils.htmlEncode('"{0}"<{1}>'.format(senderName, accountEmail)) : userNumber),
                Emails: encodeURIComponent(input.emails.toString()),
                Title: encodeURIComponent(input.title),
                Content: encodeURIComponent(input.content),
                Fileid: getSharingXml(),
                DiskFileRequest: getDiskXml(),
                FileUrlRequest: getUrlXml()
            };

            //请求服务器发送文件
            xmlCode = String.format(xmlCode, obj);
            sharingSend.server.sendMail(xmlCode, function () {
                var url = top.M139.Text.Url.getAbsoluteUrl("largeattach_success.html?sid={0}#email&emails={1}".format(top.$App.getSid(), input.emails), location.href);
                window.location.href = url;
                top._lastSendFiles = new top.Array().concat(lastSendFiles);
            });

            //获取来自快递的文件xml发送数据
            function getSharingXml() {
                if (filesId.length == 0) {
                    return "";
                }
                return "<Fileid>{0}</Fileid>".format(filesId.join(","));
            }
            //获取彩云文件xml发送数据
            function getDiskXml() {
                if (netDiskFiles.length == 0) {
                    return "";
                }
                var xml = '<DiskFiles>{0}</DiskFiles>';
                var fragment =
                '<File>\
                    <FileID>{0}</FileID>\
                    <FileName>{1}</FileName>\
                    <FileGUID>{2}</FileGUID>\
                    <FileSize>{3}</FileSize>\
                </File>';
                var xmlItem = "";
                for (var i = 0, len = netDiskFiles.length; i < len; i++) {
                    var f = netDiskFiles[i];
                    xmlItem += fragment.format(
                        f.fileId,
                        f.fileName,
                        f.fileGUID,
                        f.fileSize);
                }
                return xml.format(xmlItem);
            }
            //获取来自url的文件xml发送数据
            function getUrlXml() {
                if (urls.length == 0) {
                    return "";
                }
                var xml = '<FileUrlRequest><Files>{0}</Files></FileUrlRequest>';
                var fragment = '<FileURL>{0}</FileURL>';
                var xmlItem = "";
                for (var i = 0, len = urls.length; i < len; i++) {
                    xmlItem += fragment.format(urls[i]);
                }
                return xml.format(xmlItem);
            }
        },
        //发手机
        sendMobile: function() {
            //当有文件正在上传时不允许操作
            if (sharingSend.tool.isUploading()) {
                fileSharing.FF.alert(sharingSend.messages.NotAllowSend);
                return;
            }
            //获取并验证用户输入的手机号码信息
            var input = sharingSend.tool.getInputMobile();
            if (!input.success) {
                fileSharing.FF.alert(input.msg);
                return;
            }
            //获取要发送的文件
            var files = sharingSend.tool.getFiles();
            if (files.length == 0) {
                fileSharing.FF.alert(sharingSend.messages.SelectFile);
                return;
            }
            //文件不能超过fileSendOnceMax个
            if (files.length > sharingSend.fileSendOnceMax) {
                fileSharing.FF.alert(sharingSend.messages.MaxSendFile);
                return;
            }
            //未上传完成的文件不允许发送
            for (var i = 0, len = files.length; i < len; i++) {
                var f = files[i];
                if (f.fileType == "local" && !f.complete) {
                    alert(sharingSend.messages.NotAllowSendUnfinishedFile);
                    return;
                }
            }
            //检查每个文件是否还能继续发送
            var fileRemain = sharingSend.tool.checkRemainTimes(files, input.mobiles.length);
            if (!fileRemain.success) {
                fileSharing.FF.alert(fileRemain.msg);
                return;
            }
            //验证码验证
            var verifycode = $("#txtVerifycode").val().trim();
            var fixValue = $("#txtVerifycode").attr("fixValue");
            if (!verifycode || verifycode == fixValue) {
                alert(sharingSend.messages.InputVerifyCode);
                return;
            }
            //拼接xml数据
            var filesId = [];
            var netDiskFiles = [];
            var urls = [];
            var lastSendFiles = [];
            $(files).each(function() {
                if (this.isUrl) {
                    urls.push(this.fileName);
                } else if (this.fileType == "netDisk") {
                    netDiskFiles.push(this);
                } else {
                    filesId.push(this.uploadId || this.fileId);
                }
                lastSendFiles.push(this.fileName);
            });
            var xmlCode =
            '<Request>\
                <Type>mobile</Type>\
                <UserNumber>{UserNumber}</UserNumber>\
                <Mobiles>{Mobiles}</Mobiles>\
                {Fileid}\
                {DiskFileRequest}\
                {FileUrlRequest}\
            </Request>';
            var obj = {
                UserNumber: UserData.userNumber,
                Mobiles: input.mobiles,
                Fileid: getSharingXml(),
                DiskFileRequest: getDiskXml(),
                FileUrlRequest: getUrlXml()
            };
            //发送文件
            xmlCode = String.format(xmlCode, obj);
            sharingSend.server.sendMobile(xmlCode, verifycode, function() {
                top._lastSendFiles = new top.Array().concat(lastSendFiles);
                var url = top.M139.Text.Url.getAbsoluteUrl("largeattach_success.html#mobile&mobiles={0}&showMobileSizeTip=true",location.href);
                url = url.format(input.mobiles);
                window.location.href = url;
            }, function() {
                sharingSend.action.refreshVerifycode();
                $("#txtVerifycode").val("");
            });

            //获取来自快递的文件xml发送数据
            function getSharingXml() {
                if (filesId.length == 0) {
                    return "";
                }
                return "<Fileid>{0}</Fileid>".format(filesId.join(","));
            }
            //获取彩云文件xml发送数据
            function getDiskXml() {
                if (netDiskFiles.length == 0) {
                    return "";
                }
                var xml = '<DiskFiles>{0}</DiskFiles>';
                var fragment =
                '<File>\
                    <FileID>{0}</FileID>\
                    <FileName>{1}</FileName>\
                    <FileGUID>{2}</FileGUID>\
                    <FileSize>{3}</FileSize>\
                </File>';
                var xmlItem = "";
                for (var i = 0, len = netDiskFiles.length; i < len; i++) {
                    var f = netDiskFiles[i];
                    xmlItem += fragment.format(
                        f.fileId,
                        f.fileName,
                        f.fileGUID,
                        f.fileSize);
                }
                return xml.format(xmlItem);
            }

            //获取来自url的文件xml发送数据
            function getUrlXml() {
                if (urls.length == 0) {
                    return "";
                }
                var xml = '<FileUrlRequest><Files>{0}</Files></FileUrlRequest>';
                var fragment = '<FileURL>{0}</FileURL>';
                var xmlItem = "";
                for (var i = 0, len = urls.length; i < len; i++) {
                    xmlItem += fragment.format(urls[i]);
                }
                return xml.format(xmlItem);
            }
        },
        //切换页面发送类型
        switchSendMode: function() {
            if (location.href.indexOf("#email") > -1) {
                sharingSend.action.switchEmailSend();
            } else {
                sharingSend.action.switchMobileSend();
            }
            $("#liSwitchEmailSend>a").click(function() {
                sharingSend.action.switchEmailSend();
            });
            $("#liSwitchMobileSend>a").click(function () {
                if (top.$User.isChinaMobileUser()) {
                    sharingSend.action.switchMobileSend();
                } else {
                    //外网账号不可用
                    top.$User.checkAvaibleForMobile();
                }
            });
        },
        //切换到发邮件
        switchEmailSend: function() {
            if (sharingSend.sendMode != "email") {
                sharingSend.sendMode = "email";
                //切换样式
                $("#liSwitchMobileSend").removeClass("yt-current");
                $("#divMobileSend").removeClass("hover").hide();
                $("#liSwitchEmailSend").addClass("yt-current");
                $("#divEmailSend").addClass("hover").show();
                //加载通讯录
                var url = "/m2012/html/addrwin.html?type={1}&callback=addrCallback&useAllEmailText=true".format(fileSharing.getMailHtmlPath(), sharingSend.sendMode);
                document.getElementById("addrwin").src = url;
            }
            //焦点定位到输入框
            sharingSend.action.focusTextBox();
        },
        //切换到发手机
        switchMobileSend: function() {
            if (sharingSend.sendMode != "mobile") {
                sharingSend.sendMode = "mobile";
                //切换样式
                $("#liSwitchEmailSend").removeClass("yt-current");
                $("#divEmailSend").removeClass("hover").hide();
                $("#liSwitchMobileSend").addClass("yt-current");
                $("#divMobileSend").addClass("hover").show();
                //加载通讯录
                var url = "/m2012/html/addrwin.html?type={1}&callback=addrCallback&useNameText=true".format(fileSharing.getMailHtmlPath(), sharingSend.sendMode);
                document.getElementById("addrwin").src = url;
            }
            //焦点定位到输入框
            sharingSend.action.focusTextBox();
        },
        //焦点定位到输入框
        focusTextBox: function() {
            var t1 = $("txtContent").get(0);
            var t2 = $("txtMobileSend").get(0);
            fileSharing.tool.tryCatch(function() {
                t1.blur();
                Utils.focusTextBox(t1);
            });
            fileSharing.tool.tryCatch(function() {
                t2.blur();
                Utils.focusTextBox(t2);
            });
        },
        ////解决ie下刷新html造成的点击失效问题
        refreshFocus: function() {
            if (!document.all) {
                return;
            }
            var command = "xxx";
            $("#divFileList").mousedown(function(e) {
                if (e.target.tagName == "A") {
                    command = e.target.href;
                    e.target.mousedownTime = new Date();
                }
            }).mouseup(function(e) {
                var target = e.target;
                if (target.tagName == "A" && command == target.href && !target.mousedownTime) {
                    eval(command.replace("javascript:", ""));
                    command = "xxx";
                } else {
                    command = "xxx";
                }
            });
        },
        //初始化文件列表
        initFileList: function() {
            var files = fileSharing.tool.getFiles();
            //没有文件则弹出选择框
            if (!files || files.length == 0) {
                $("#btnUpload").click();
                return;
            }
            $(files).each(function () {
                this.state = "success";
                this.complete = true;
            });
            sharingSend.tool.addFiles(files);
        },
        //初始化fileManager
        initFileMgr: function() {
            onFileChange.functionKey = "win{0}".format(Math.random());
            //window.fm.whenFileAdd(onFileChange);
            //window.fm.whenFileRemove(onFileChange);
            //window.fm.whenFileStateChange(onFileChange);
            //window.fm.whenFileStateChange(sharingUpload.action.fileUploadSuccess);
        },

        showUploadDialog:function(){
            fileSharing.tool.showSelectBox({ type: "send",dialogTitle:"文件快递" }, function (view) {
                sharingSend.uploadWindow = view;
                view.on("select", sharingSend.action.onUploadSelect);
            });
        },
        /**
         *弹出三种模式选择框
         */
        showSelectMode: function () {
            var html = ['<div class="ta_c" style="height:125px;padding-top: 100px">',
            '<a href="javascript:void(0)" id="btn_largeattach_upload" class="btnSet" style="font-size: 14px;"><span>添加新文件</span></a>',
            '</div>',
            '<div class="ta_c" style="border-top:1px solid #eef1f5;padding:10px 0;">从 <a href="javascript:;" id="btn_largeattach_disk">彩云 </a>',
            '或 <a href="javascript:;" id="btn_largeattach_bigfile">暂存柜</a> 选择已有文件</div>'].join("");



            var uploadModeDialog = top.$Msg.showHTML(html, { dialogTitle: "文件快递" });
            uploadModeDialog.$el.find("#btn_largeattach_upload").click(function () {
                uploadModeDialog.close();
                sharingSend.action.showUploadDialog();
                return false;
            });

            uploadModeDialog.$el.find("#btn_largeattach_bigfile").click(function () {
                uploadModeDialog.close();
                var cabinetIFrame = top.$Msg.open({
                    dialogTitle: "暂存柜文件",
                    url: "storagecabinet.html?sid=" + top.$App.getSid(),
                    width: 400,
                    height: 353
                });
                // 注册事件监听 
                top.$App.on('obtainCabinetFiles', function (files) {
                    sharingSend.tool.addFiles(files);
                    cabinetIFrame.close();
                });
                cabinetIFrame.on("remove", function () {
                    top.$App.off('obtainCabinetFiles');
                });
                return false;
            });

            uploadModeDialog.$el.find("#btn_largeattach_disk").click(function () {
                uploadModeDialog.close();
                var diskIFrame = top.$Msg.open({
                    dialogTitle: "彩云文件",
                    url: "netdisk.html?sid=" + top.$App.getSid(),
                    width: 400,
                    height: 353
                });
                // 注册事件监听 
                top.$App.on('obtainDiskFiles', function (files) {
                    sharingSend.tool.addFiles(files);
                    diskIFrame.close();
                });

                diskIFrame.on("remove", function () {
                    top.$App.off('obtainDiskFiles');
                });
                return false;
            });

        }
    },
    render: {
        //呈现富文本输入框
        renderRichBox: function() {
            //邮件输入框
            window.riEmail = new RichInputBox({
                type: "email",
                autoHeight: true,
                autoDataSource: true,
                container: $("#richInputEmail").get(0)
            });
            window.riMobile = new RichInputBox({
                type: "mobile",
                autoHeight: true,
                autoDataSource: true,
                container: $("#richInputMobile").get(0)
            });
            riEmail.setTipText(sharingSend.messages.EmailTipText.format(sharingSend.mailReceiverCount));
            riMobile.setTipText(sharingSend.messages.MobileTipText.format(sharingSend.mobileReceiverCount));
        },
        //快速预览
        renderPreview: function() {
            $('.yt-preview').click(function() {
                return false;
            }).hover(function() {
                var img = $(this).next('img');
                if (!img.attr("src")) {
                    img.attr("src", fileSharing.getResourcePath() + img.attr("rel"));
                }
                img.fadeIn('normal');
            }, function() {
                $(this).next('img').fadeOut('normal');
            });
        }
    },
    server: {
        //获取暂存柜文件信息
        getFiles: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingSend.urls.getFilesUrl(),
                data: XmlUtility.parseJson2Xml({
                    actionId: 0
                }),
                async: false,
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback.call(this["var"]);
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //发送到邮箱
        sendMail: function(xmlStr, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            var url = sharingSend.urls.getSendMailUrl();
            $.postXml({
                url: url,
                data: XmlUtility.parseJson2Xml({
                    type: "1",
                    xmlStr: xmlStr
                }),
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback();
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //发送到手机
        sendMobile: function(xml, verifycode, sucesses, errors) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingSend.urls.getSendMobileUrl(),
                data: XmlUtility.parseJson2Xml({
                    type: "1",
                    sendType: "0",
                    verifycode: verifycode,
                    xmlStr: xml
                }),
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (sucesses) sucesses();
                    }
                    else {
                        fileSharing.FF.alert(this.summary);
                        if (errors) errors();
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //初始化信息，获取每次发送人数和验证码地址
        getInitData: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingSend.urls.getInitDataUrl(),
                async: false,
                success: function(result) {
                    if (callback) callback.call(this);
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        }
    },
    tool: {
        //获取输入的邮件信息
        getInputEmail: function() {
            var result = {};
            //判断输入的邮件地址是否有误
            var error = window.riEmail.getErrorText();
            if (error) {
                result.msg = sharingSend.messages.EmailError.format(error);
                result.success = false;
                return result;
            }
            //判断是否有输入正确邮件地址
            var emails = window.riEmail.getRightEmails();
            if (!emails || emails.length == 0) {
                result.msg = sharingSend.messages.InputEmail;
                result.success = false;
                return result;
            }
            //判断单次发送是否超过最大发送人数
            var maxTimes = sharingSend.mailReceiverCount;
            if (emails.length > maxTimes) {
                result.msg = sharingSend.messages.MaxSendPeople.format(maxTimes, this.getUpgradeCssTxt());
                result.success = false;
                return result;
            }
            for (var i = 0; i < emails.length; i++) {
                emails[i] = MailTool.getAddr(emails[i]);
            }
            result.success = true;
            result.emails = emails;
            result.title = $("#txtTitle").val().trim(); ;
            result.content = $("#txtContent").val();
            return result;
        },
        //获取输入的手机信息
        getInputMobile: function () {
            var result = {};
            //判断手机地址输入是否有误
            var error = window.riMobile.getErrorText();
            if (error) {
                result.msg = sharingSend.messages.UserNumberError;
                result.success = false;
                return result;
            }
            //获取输入的手机地址
            var mobiles = riMobile.getRightNumbers();
            if (mobiles.length == 0) {
                result.msg = sharingSend.messages.UserNumberError;
                result.success = false;
                return result;
            }
            for (var i = 0; i < mobiles.length; i++) {
                mobiles[i] = NumberTool.getNumber(mobiles[i]);
                mobiles[i] = NumberTool.add86(mobiles[i]);
            }
            //同时发送最多人数
            var maxTimes = sharingSend.mobileReceiverCount;
            if (mobiles.length > maxTimes) {
                result.msg = sharingSend.messages.MaxSendPeople.format(maxTimes, this.getUpgradeCssTxt());
                result.success = false;
                return result;
            }
            result.success = true;
            result.mobiles = mobiles;
            return result;
        },
        //检查每个文件的发送次是否超过最大发送次数
        //files: 当前要发送的文件列表
        //sendCount: 文件被发送的地址数
        checkRemainTimes: function(files, sendCount) {
            var result = {};
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                if (typeof file.remainTimes != "undefined") {
                    if (file.remainTimes < sendCount) {
                        result.success = false;
                        result.msg = sharingSend.messages.MaxSendTimes.format(file.fileName.shortName(25));
                        return result;
                    }
                }
            }
            result.success = true;
            return result;
        },
        //编码字符串
        encodeXML: function(s) {
            return s.toString().replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;");
        },
		//得到升级是否显示样式
        getUpgradeCssTxt: function(){
            return this.getVipVersion() == "20Version" ? "none" : "";//20元版套餐不显示升级
        },
        //得到用户套餐等级
        getVipVersion: function(){
            var vipVersion = "20Version";
            var vipItem = top.UserData.serviceItem;
            if(vipItem == "0010" || vipItem == "0015"){
                vipVersion = "freeVersion";
            }else if(vipItem == "0016"){
                vipVersion = "5Version";
            }else if(vipItem == "0017"){
                vipVersion = "20Version";
            }
            return vipVersion;
        },
        getFiles: function () {
            return sharingSend.files.concat();
        },
        addFiles: function (files) {
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                sharingSend.files.push(f);
            }
            onFileChange();
        },
        removeFile: function (fileId) {
            var files = sharingSend.files;
            for (var i = 0; i < files.length; i++) {
                if (files[i].fileId == fileId) {
                    files.splice(i, 1);
                    onFileChange();
                    return;
                }
            }
        },
        isUploading: function () {
            return Boolean(sharingSend.uploadWindow && sharingSend.uploadWindow.isUploading());
        }
    }
};
//通讯录点击回调函数
function addrCallback(addr) {
    if (sharingSend.sendMode == "email") {
        riEmail.insertItem(addr);
    } else {
        riMobile.insertItem(addr);
    }
}
//快递文件发生变化时触发
function onFileChange() {
    var html = new XmlUtility();
    var files = sharingSend.tool.getFiles();
    var filesArea = $("#divFileList");
    //清空文件列表内容
    filesArea.empty();
    if (files.length > 0) {
        filesArea.show();
    } else {
        filesArea.hide();
    }
    $.each(files, function() {
        //网络文件
        if (this.isUrl) {
            sharingSend.display.outside(html, this);
        }
        else if (this.fileType == "keepFolder" || this.fileType == "netDisk" || (this.state == "success" && this.complete)) {
            sharingSend.display.system(html, this);
        }
        else if (this.state == "progress") {
            sharingSend.display.progress(html, this);
        }
        else if (this.state == "unknownerror" || (this.state == "stopped" && this.errorMsg)) {
            sharingSend.display.error(html, this);
        }
        else if (this.state == "stopped") {
            sharingSend.display.stopped(html, this);
        }
        else if (this.state == "virus") {
            sharingSend.display.virus(html, this);
        }
        else if (this.state == "start") {
            sharingSend.display.start(html, this);
        }
        else {
            sharingSend.display.uploading(html, this);
        }
    });
    var htmlCode = html.join();
    if (window.bindUploadProxy) {
        htmlCode = htmlCode.replace(/javascript:/g, "javascript:proxyWindow.");
    }
    //设置文件列表展示区域样式
    var css = {};
    if (files.length > 5) {
        if (filesArea.attr("rel") != "scroll") {
            css["width"] = "90%";
            if ($.browser.msie && $.browser.version >= 7) {
                filesArea.css("max-height", "135px");
            } else {
                filesArea.css("cssText", "height:135px !important");
            }
            filesArea.css("overflow-y", "auto");
            filesArea.css("overflow-x", "hidden");
            filesArea.attr("rel", "scroll");
        }
    } else {
        if (filesArea.attr("rel") == "scroll") {
            if ($.browser.msie && $.browser.version == 7) {
                filesArea.css({ "max-height": "135px" });
            } else {
                filesArea.css("height", "auto");
            }
            filesArea.attr("rel", "");
        }
    }
    filesArea.css(css);
    filesArea.html(htmlCode);
}
//文件上传列表页面展示
sharingSend.display = {
    //来自网络文件
    outside: function(sb, f) {
        sb.append('<p title="{0}"><strong>{1}</strong>(网络文件) <a href="javascript:sharingSend.tool.removeFile(\'{2}\');">取消</a></p>'
        .format(f.fileName.encode(), f.fileName.shortName().encode(), f.fileId));

    },
    //来自邮件系统
    system: function(sb, f) {
        sb.append('<p title="{0}"><b class="fDo"></b><strong>{1}</strong>({2}) <a href="javascript:sharingSend.tool.removeFile(\'{3}\');">取消</a></p>'
        .format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize), f.fileId));
    },
    //上传中文件
    progress: function(sb, f) {
        //保证进度条不后退
        var theMaxProgress = 0;
        if (!window._tmpProgress) {
            window._tmpProgress = {};
        }
        theMaxProgress = Math.max(f.progress || 0, _tmpProgress[f.fileId] || 0);
        _tmpProgress[f.fileId] = theMaxProgress;
        var html = '<p title="{0}">{1}({2})</p><p style="width:100%"><span style="display:{7}">上传速度：{3}/秒&nbsp;&nbsp; 剩余时间：{4}</span>\
            <br /><span class="upGo" style="position:static;"><b style="width:{5};position:static;display:inline-block;"></b></span> \
            <br /><a href="javascript:sharingUpload.action.stopUpload(\'{6}\',false,true);" class="upGoBut">暂停</a><a href="javascript:sharingUpload.action.cancelUpload(\'{6}\');" class="upGoBut">删除</a></p>'
            .format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize),
                    fileSharing.tool.getFileSizeText(f.uploadSpeed), fileSharing.tool.getTimeText(f.remainTime * 1000),
                    fileSharing.tool.getProgressText(theMaxProgress || f.progress), f.fileId, f.uploadSpeed ? "" : "none");
        sb.append(html);
    },
    //上传出错
    error: function(sb, f) {
        if (window._tmpProgress) {
            _tmpProgress[f.fileId] = null;
        }
        var html = "";
        if (f.errCode != fsConfig.fileNameError) {
            html = '<p title="{0}"><strong>{1}</strong>({2}) {4}&nbsp;\
                <a href="javascript:sharingSend.tool.continuesUpload(\'{3}\');">重试</a>&nbsp;\
                <a href="javascript:sharingSend.tool.removeFile(\'{3}\');">取消</a></p>';
        } else {
            html = '<p title="{0}"><strong>{1}</strong>({2}) <span style="color:red">{4}</span>&nbsp;\
                <a href="javascript:sharingSend.tool.removeFile(\'{3}\');">取消</a></p>';
        }
        html = html.format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize),
               f.fileId, f.errorMsg || sharingSend.messages.UploadError);
        sb.append(html);
    },
    //上传已停止
    stopped: function(sb, f) {
        if (window._tmpProgress) {
            _tmpProgress[f.fileId] = null;
        }
        sb.append('<p title="{0}"><strong>{1}</strong>({2}) {3} <a href="javascript:sharingSend.tool.continuesUpload(\'{4}\');">继续</a>&nbsp;\
            <a href="javascript:sharingSend.tool.removeFile(\'{4}\');">删除</a></p>'.format(f.fileName.encode(), f.fileName.shortName().encode(),
           fileSharing.tool.getFileSizeText(f.fileSize), fileSharing.tool.getProgressText(f.progress), f.fileId));
    },
    //有病毒
    virus: function(sb, f) {
        if (window._tmpProgress) {
            _tmpProgress[f.fileId] = null;
        }
        sb.append('<p title="{0}"><strong>{1}</strong>({2}) 上传失败,发现病毒&nbsp;<a href="javascript:sharingSend.tool.removeFile(\'{3}\');">取消</a></p>'
          .format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize), f.fileId));
    },
    //启动上传
    start: function(sb, f) {
        sb.append('<p title="{0}"><strong>{1}</strong>({2}) <br><img src="{4}" />正在扫描本地文件&nbsp;<a href="javascript:sharingSend.tool.stopUpload(\'{3}\',true,true);">取消</a></p>'
          .format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize), f.fileId, fileSharing.getResourcePath() + "/images/uploading.gif"));
    },
    //上传中
    uploading: function(sb, f) {
        var msg = f.state == "success" ? sharingSend.messages.UploadComplete : sharingSend.messages.UploadWaiting;
        sb.append('<p title="{0}"><strong>{1}</strong>({2}) {4}&nbsp;<a href="javascript:sharingSend.tool.removeFile(\'{3}\');">取消</a></p>'
          .format(f.fileName.encode(), f.fileName.shortName().encode(), fileSharing.tool.getFileSizeText(f.fileSize), f.fileId, msg));
    }
}

//初始化页面
sharingSend.action.pageLoad();