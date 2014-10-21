var sharingFileDisk = {
    urls: {
        //获取暂存柜信息
        getFilesUrl: function() {
            return fileSharing.resolveUrl("getFiles");
        },
        //续期
        getRenewFilesUrl: function() {
            return fileSharing.resolveUrl("continueFiles");
        },
        //删除
        getDeleteFileUrl: function() {
            return fileSharing.resolveUrl("delFiles");
        },
        //设置提醒方式
        getSetRemindUrl: function() {
            return fileSharing.resolveUrl("setFiles");
        },
        //文件下载
        getDownloadFileUrl: function() {
            return fileSharing.resolveUrl("preDownload");
        },
        getVirtualExeUrl: function() {
            return fileSharing.resolveUrl("getVirtualExe");
        }
    },
    messages: {
        NoKeyword: "请输入搜索关键字!",
        Keyword30Length: "搜索关键字不应超过30个字符，请调整后重试。",
        SettingChanged: "保存成功",
        ServerTooBusy: "服务器繁忙,请稍候再试",
        NoControl: "添加超大附件，需先安装139邮箱小工具。您确定现在就要安装吗？",
        TooManyFilesForUpload: "一次最多上传10个文件，请调整后重试。",
        TooManyFilesForSend: "一次最多只能发送{0}个文件，请调整后重试。",
        FileSizeError: "文件过大。单次上传的文件最大为1G",
        SpacesNotEnough: "暂存柜剩余空间不够",
        ExistFileName: "已有同名文件。请您重命名后再上传",
        NoSelectedFile: "您未选择任何文件",
        ExceedMobileFileSize: "选择的文件不能大于5M",
        RenewSuccessed: "续期成功",
        DeletedSuccessed: "删除成功",
        NotSuccessedFile: "您要发送的文件中包含未上传完毕文件，请上传完成后再发送",
        CannotSend: "您选中了可发送次数为零的文件，无法发送，请重新选择！"
    },
    //查询条件
    filter: {
        keyword: "",
        pageIndex: 0,
        pageSize: 10
    },
    //存储列表中已选择的文件
    selectedFiles: [],
    fileSendCount: 50,
    action: {
        //页面加载
        pageLoad: function() {
            //暂存柜信息
            window.FolderInfo = null;
            //暂存柜文件列表
            window.fileList = null;
            Utils.getUserDataFromCookie();
            //加载皮肤
            Utils.loadSkinCss(null, document, "netdisk");

            $(function() {
                //启用ajax加载提示功能
                fileSharing.tool.startAjaxMsg();

                //监测页面高度防止出现滚动条
                window.setInterval(function() {
                    sharingFileDisk.tool.resizeWindow();
                }, 3000);
                //加载小广告
                sharingFileDisk.action.loadToolAd();

                //注册click事件
                var clicks = {
                    "aToDisk": function() { top.Links.show("diskDev", null, false); },
                    "aToShare": function() { location.href = location.href; },
                    "aToAttach": sharingFileDisk.action.toAttach,
                    "aUploadFile": function () { sharingFileDisk.action.showSelectBox() },
                    "aUploadFile2": function () { sharingFileDisk.action.showSelectBox() },
                    "aDownloadFile": sharingFileDisk.action.downloadFiles,
                    "aDownloadFile2": sharingFileDisk.action.downloadFiles,
                    "aSendEmail": sharingFileDisk.action.sendEmail,
                    "aSendEmail2": sharingFileDisk.action.sendEmail,
                    "aSendMobile": sharingFileDisk.action.sendMobile,
                    "aSendMobile2": sharingFileDisk.action.sendMobile,
                    "aSaveToDisk": sharingFileDisk.action.saveToDisk,
                    "aSaveToDisk2": sharingFileDisk.action.saveToDisk,
                    "aRenew": sharingFileDisk.action.renewSelectedFiles,
                    "aRenew2": sharingFileDisk.action.renewSelectedFiles,
                    "aDelete": sharingFileDisk.action.deleteSelectedFiles,
                    "aDelete2": sharingFileDisk.action.deleteSelectedFiles,
                    "thSelectAll": sharingFileDisk.action.selectAll,
                    "thSelectAll2": sharingFileDisk.action.selectAll,
                    "btnSearch": sharingFileDisk.action.searchBtnClick,
                    "aChangeRemind": sharingFileDisk.action.showRemindSetting,
                    "btnRemindSettingYes": sharingFileDisk.action.setRemind,
                    "btnRemindSettingCancel": function() { $("#divRemindSetting").hide(); },
                    "aOpenControlDownload": sharingFileDisk.action.controlDownload
                };
                fileSharing.tool.registClicks(clicks);

                //排序
                $("#tabTableHeader th[rel]").click(function() {
                    sharingFileDisk.action.sortFile(this);
                });
                //处理使在ie下enter触发搜索
                if (document.all) {
                    $(document.body).keydown(function(e) {
                        if (e.keyCode == 13) {
                            $("#btnSearch").focus();
                        }
                    });
                }
                //搜索框
                $("#txtSearch").keyup(function(e) {
                    if (e.keyCode == 13) {
                        sharingFileDisk.action.searchFile();
                    }
                }).focus(function() {
                    if (this.value == this.getAttribute("defaultValue")) {
                        this.value = "";
                    }
                }).blur(function() {
                    if (this.value == "") {
                        this.value = this.getAttribute("defaultValue");
                    }
                });

                //邮箱小工具下载
                if (document.all && !isLocal()) {
                    $("#divDownloadTip").show();
                }
                //刷新列表
                sharingFileDisk.action.refresh();


                if (!top.$User.isChinaMobileUser()) {
                    //非移动用户设置提醒方式不能选短信
                    $("#chkMobileTip").attr("disabled", "disabled").parent().click(function () {
                        top.$User.checkAvaibleForMobile();
                    });
                }
            });
        },

        //加载广告
        loadToolAd: function () {
            fileSharing.tool.tryCatch(function() {
                //广告代码
                var adLength = top.AdLink[1280].length;
                if (adLength > 0) {
                    var adRandon = Math.floor(Math.random() * 100) % adLength;
                    $("#liToolAd").html(top.AdLink[1280][adRandon].text);
                }
                //虚拟盘推广广告
                if (top.AdLink[1281]) {
                    $("#adVdTool").html(top.AdLink[1281][0].text);
                    var url = "javascript:void(0);";
                    //获取虚拟盘下载地址
                    sharingFileDisk.action.getDownLoadVdUrl(function() {
                        if (this && this.url) {
                            var localUrl = top.getDomain("diskInterface");
                            var reg = new RegExp("/spaceinterface", "i");
                            localUrl = localUrl.replace(reg, "");
                            url = localUrl + this.url;
                        }
                    });
                    $("#aVirtualDiskDownload").attr({ target: "_blank", href: url });
                }
                $("#aVirtualDiskDownload").click(function () {
                    var path = SiteConfig.disk;
                    window.open("{0}/wp.html".format(path), "virtualDiskHome");
                });
            });
        },
        //获取虚拟彩云下载地址
        getDownLoadVdUrl: function(callback) {
            var data = { chnnl: "3", frm: "10348", winBit: "32" };
            var isWin64 = navigator.platform && navigator.platform.indexOf("64") > -1;
            data.winBit = isWin64 ? "64" : "32";
            sharingFileDisk.server.getDownLoadVdUrl(data, callback);
        },

        //转至我的附件
        toAttach: function() {
            var url = "/m2012/html/mailattach/mailattach_attachlist.html?sid={2}";
            url = url.format(
                top.window.location.host,
                top.window.isRichmail ? "" : "/m",
                fileSharing.tool.getUserInfo()
            );
            window.location.href = url;
        },

        //列表头排序
        sortFile: function(header) {
            var sortOrder = header.getAttribute("order");
            var sortName = header.getAttribute("rel");
            var sortFunc = null;

            sortOrder = parseInt(sortOrder ? sortOrder : 1);
            //设置其他表头的排序规则为1(降序)
            var headers = $(header).parent().find("th[rel]");
            $.each(headers, function() {
                if (this != header) {
                    this.setAttribute("order", 1);
                }
                this.innerHTML = this.innerHTML.replace(/[↓|↑]$/, "");
            });
            header.innerHTML += sortOrder > 0 ? "↑" : "↓";
            //排序规则
            var sortRules = {
                fileName: function(a, b) { return a.fileName.localeCompare(b.fileName) * sortOrder; },
                fileSize: function(a, b) { return (a.fileSize - b.fileSize) * sortOrder; },
                expiryDate: function(a, b) { return (a.expiryDate - b.expiryDate) * sortOrder; },
                downloadTimes: function(a, b) { return (a.downloadTimes - b.downloadTimes) * sortOrder; },
                state: function(a, b) { return (a.state - b.state) * sortOrder; },
                remainTimes: function(a, b) { return (b.sendCount - a.sendCount) * sortOrder; }
            };
            $.each(sortRules, function(n, f) {
                if (sortName == n) {
                    sortFunc = f;
                    return false;
                }
            });
            if (sortFunc) {
                window.fileList.sort(sortFunc);
                sharingFileDisk.filter.pageIndex = 0;
                sharingFileDisk.render.renderFileList();
                header.setAttribute("order", -sortOrder);
            }
        },

        //下载
        downloadFiles: function () {
            var fileIds = sharingFileDisk.selectedFiles;
            if (!fileIds.length) {
                fileSharing.FF.alert(sharingFileDisk.messages.NoSelectedFile);
                return;
            }
            sharingFileDisk.action.downloadFile(fileIds.join(","));
            fileSharing.tool.addBehavior({
                actionId: 103723,
                thingId: 1,
                moduleId: 25,
                actionType: 20
            });
        },

        //发送文件
        sendFiles: function () {
            var files = fileSharing.tool.getSelectedFiles(true);
            if (files.length == 0) {
                fileSharing.FF.alert(sharingFileDisk.messages.NoSelectedFile);
                return false;
            }
            if (files.length > sharingFileDisk.fileSendCount) {
                fileSharing.FF.alert(sharingFileDisk.messages.TooManyFilesForSend);
                return false;
            }
            for (var i = 0, len = files.length; i < len; i++) {
                var file = files[i];
                if (file.state != "0") {
                    fileSharing.FF.alert(sharingFileDisk.messages.NotSuccessedFile);
                    return false;
                }
            }
            fileSharing.tool.keepFiles(files);
            return true;
        },
        //发送文件到邮箱
        sendEmail: function() {
            if (sharingFileDisk.action.sendFiles()) {
                top.Links.show("quicklyShare", "&type=email");
            }
        },
        //发送文件到手机
        sendMobile: function () {
            if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭发送文件到手机
                return;
            }
            if (sharingFileDisk.action.sendFiles()) {
                top.Links.show("quicklyShare", "&type=mobile");
            }
        },
        //存彩云
        saveToDisk: function() {
            var files = fileSharing.tool.getSelectedFiles(true);
            if (files.length == 0) {
                fileSharing.FF.alert(sharingFileDisk.messages.NoSelectedFile);
                return;
            }
            fileSharing.tool.addBehavior({
                actionId: 103623,
                thingId: 2,
                moduleId: 11,
                actionType: 20
            });
            var url = "/m2012/html/disk/disk_dialogsavesharefile.html?sharefileid={0}&sharefilename={1}&sid={2}&rd={3}";
            var fileIds = $.map(files, function(f) { return f.fid }).join(",");
            var fileNames = $.map(files, function(f) { return escape(f.fileName.replace(",", "")); }).join(",");
            url = url.format(fileIds,
                            fileNames,
                            fileSharing.tool.getUserInfo(),
                            Math.random());
            fileSharing.FF.open('暂存柜文件移动到彩云', url, 395, 360, true);
        },
        //续期选中文件
        renewSelectedFiles: function() {
            //添加行为日志
            fileSharing.tool.addBehavior({
                actionId: 2101,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            //获取选中的文件id列表
            var fileIds = fileSharing.tool.getSelectedFiles();
            if (fileIds.length == 0) {
                fileSharing.FF.alert(sharingFileDisk.messages.NoSelectedFile);
                return;
            }
            sharingFileDisk.action.renewFile(fileIds);
        },
        //续期文件
        renewFile: function(fileIds) {
            //添加行为日志
            fileSharing.tool.addBehavior({
                actionId: 2101,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            sharingFileDisk.server.renewFile(fileIds, function(isSuccess) {
                if (isSuccess) {
                    fileSharing.FF.alert(sharingFileDisk.messages.RenewSuccessed);
                }
                sharingFileDisk.action.refresh();
            });
        },

        // 下载文件
        downloadFile: function(fileId) {
            var downloadUrl = "";
            sharingFileDisk.server.downloadFile(fileId, function() {
                if (this) {
                    downloadUrl = this;
                }
            });
            if (downloadUrl) {
                window.open(downloadUrl);
            }
        },

        //刷新文件列表
        refresh: function () {
            sharingFileDisk.selectedFiles = [];//清空移动到彩云前所选择的文件
            sharingFileDisk.server.getMainData(function() {
                sharingFileDisk.filter.keyword = "";
                sharingFileDisk.filter.pageIndex = 0;
                window.FolderInfo = this;
                fileSharing.tool.tryCatch(function() {
                    var parent = top.jQuery("iframe[id='quicklyShare']")[0].contentWindow;
                    parent.FolderInfo = window.FolderInfo;
                });
                //暂存柜文件列表
                if (this.fileList) {
                    window.fileList = this.fileList;
                }
                $("#btnSearch").addClass("butSo").removeClass("butClose").attr("title", "搜索文件");
                //展示暂存柜信息
                sharingFileDisk.render.renderFolderInfo();
                //展示文件列表
                sharingFileDisk.render.renderFileList();
            });
        },

        //切换页码
        turnPage: function(index) {
            sharingFileDisk.filter.pageIndex = index;
            sharingFileDisk.render.renderFileList();
        },

        //改变行选中样式
        setRowStyle: function(chkbox) {
            var className = chkbox.checked ? "t-checked" : "";
            chkbox.parentNode.parentNode.className = className;
        },

        //全选/不选
        selectAll: function () {
            var thSelectAll = $("#thSelectAll,#thSelectAll2");
            var selectedFiles = sharingFileDisk.selectedFiles;
            thSelectAll.each(function () {
                if (typeof (this.checked) == "undefined") {
                    this.checked = false;
                }
                this.checked = !this.checked;
            });
            var checked = thSelectAll.get(0).checked;
            thSelectAll.html(checked ? "不选" : "全选");
            $("#tabFileList input:checkbox").each(function () {
                var fid = this.getAttribute("rel");
                if (!this.disabled) {
                    this.checked = checked;
                    checked ? sharingFileDisk.tool.addSelectedFile(fid) : selectedFiles.splice(selectedFiles.indexOf(fid), 1);
                    sharingFileDisk.action.setRowStyle(this);
                }
            });
            try {
                console.log("选中文件：" + sharingFileDisk.selectedFiles);
            } catch (ex) { }
        },

        //重置全选/不选
        //setCheckAll: 是否重置为全选
        resetSelectAll: function (setCheckAll) {
            if (typeof setCheckAll == "undefined" && !$("#thSelectAll")[0].checked) {
                setCheckAll = true;
            }
            var thSelectAll = $("#thSelectAll,#thSelectAll2");
            thSelectAll.html(setCheckAll ? "全选" : "不选");
            thSelectAll[0].checked = !setCheckAll;
        },

        //点击查询按钮查询
        searchBtnClick: function() {
            var btnSearch = $("#btnSearch");
            if (btnSearch.hasClass("butSo")) {
                sharingFileDisk.action.searchFile();
                return;
            }
            //取消搜索
            $("#txtSearch").val("").focus().blur();
            sharingFileDisk.filter.keyword = "";
            sharingFileDisk.render.renderFileList();
            btnSearch.addClass("butSo").removeClass("butClose").attr("title", "搜索文件");
        },

        //文件搜索
        searchFile: function() {
            var txtSearch = $("#txtSearch");
            var keyword = txtSearch.val().trim();
            var defValue = txtSearch.attr("defaultValue");
            if (keyword == "" || keyword == defValue) {
                txtSearch.blur();
                fileSharing.FF.alert(sharingFileDisk.messages.NoKeyword);
                return;
            }
            if (keyword.length > 30) {
                fileSharing.FF.alert(sharingFileDisk.messages.Keyword30Length);
                return;
            }
            sharingFileDisk.filter.keyword = keyword;
            sharingFileDisk.filter.pageIndex = 0;
            sharingFileDisk.render.renderFileList();
            $("#btnSearch").addClass("butClose").removeClass("butSo").attr("title", "取消搜索");
        },

        //显示提醒方式设置区域
        showRemindSetting: function() {
            $("#chkEmailTip")[0].checked = FolderInfo.emailRemind == 1;
            $("#chkMobileTip")[0].checked = FolderInfo.mobileRemind == 1;
            $("#divRemindSetting").show();
        },

        //设置提醒方式
        setRemind: function() {
            var thingId = 0;
            var emailRemind = $("#chkEmailTip")[0].checked ? 1 : 0;
            var mobileRemind = $("#chkMobileTip")[0].checked ? 1 : 0;
            //上报行为日志
            if (emailRemind == 1) {
                thingId = 1;
            }
            if (mobileRemind == 1) {
                thingId = 2;
            }
            fileSharing.tool.addBehavior({
                actionId: 10472,
                thingId: thingId,
                moduleId: 11,
                actionType: 20
            });
            //请求服务器设置提醒方式
            sharingFileDisk.server.setRemind(emailRemind, mobileRemind, function() {
                window.FolderInfo.emailRemind = emailRemind;
                window.FolderInfo.mobileRemind = mobileRemind;
                $("#divRemindSetting").hide();
                $("#divSaveSuccess").show()
                setTimeout(function() { $("#divSaveSuccess").hide(); }, 3000);
            });
        },
        showSelectBox: function (file) {
            if (file) {
                var mode = { type: "continueUpload", dialogTitle: "上传文件" };
            }else{
                var mode = { type: "upload", dialogTitle: "上传文件" };
            }
            fileSharing.tool.showSelectBox(mode, function (view) {
                view.dialog.on("remove", function () {
                    sharingFileDisk.action.refresh();
                });
                if (mode.type == "continueUpload") {
                    view.addContinueUpload({
                        fileName: file.fileName,
                        fileSize: file.fileSize,
                        fileId: file.fileId,
                        storageId: file.storageId
                    });
                }
            });
        },
        //续传
        continueUpload: function (file) {
            //添加行为日志
            fileSharing.tool.addBehavior({
                actionId: 10471,
                thingId: 0,
                moduleId: 11,
                actionType: 20
            });
            this.showSelectBox(file);
        },
        //删除选中的文件
        deleteSelectedFiles: function() {
            var files = fileSharing.tool.getSelectedFiles();
            if (files.length == 0) {
                fileSharing.FF.alert(sharingFileDisk.messages.NoSelectedFile);
                return;
            }
            var msg = "文件删除后接收方将无法下载，您确认删除这 {0} 个文件吗？".format(files.length);
            fileSharing.FF.confirm(msg, function() {
                sharingFileDisk.action.deleteFile(files.join(","));
            });
        },

        //删除文件
        deleteFile: function(fileIds) {
            sharingFileDisk.server.deleteFile(fileIds, function() {
                fileSharing.FF.alert(sharingFileDisk.messages.DeletedSuccessed);
                sharingFileDisk.action.refresh();
            });
        },

        //控件下载
        controlDownload: function() {
            if (!window.ucDomain) {
                window.ucDomain = "http://" + location.host;
            }
            Utils.openControlDownload();
            return false;
        }
    },
    render: {
        //展示文件列表
        renderFileList: function(param) {
            param = param || {};
            var container = $("#tabFileList");
            var dvNoInfo = $("#dvNoInfo");
            container.hide();
            dvNoInfo.hide();

            //文件列表
            var showFileList = param.fileList || window.fileList;
            var allFilesCount = showFileList.length;
            showFileList = showFileList.concat();
            //根据查询字符串过滤文件
            if (sharingFileDisk.filter.keyword) {
                var key = sharingFileDisk.filter.keyword.toLowerCase();
                showFileList = $.grep(showFileList, function(n, i) {
                    return n.fileName.toLowerCase().indexOf(key) >= 0;
                });
            }
            allFilesCount = showFileList.length;
            //展示分页
            var pageCount = Math.ceil(showFileList.length / sharingFileDisk.filter.pageSize);
            while (sharingFileDisk.filter.pageIndex > 0 && sharingFileDisk.filter.pageIndex * sharingFileDisk.filter.pageSize >= showFileList.length) {
                sharingFileDisk.filter.pageIndex--;
            }
            sharingFileDisk.render.renderPageIndex(pageCount);
            //截取当前页数据
            if (showFileList.length > sharingFileDisk.filter.pageSize) {
                var start = sharingFileDisk.filter.pageSize * sharingFileDisk.filter.pageIndex;
                showFileList = showFileList.splice(start, sharingFileDisk.filter.pageSize);
            }
            var rowHtml =
                '<tr>\
					<td rel="check" class="t-check"><input type="checkbox" /></td>\
					<td rel="type" class="t-type"><i class="exe"></i></td>\
					<td rel="name" class="t-name">\
					    <p>\
						    <a class="fcI" href="javascript:;" style="display:none" rel="continue" >续传</a>\
                            <a class="fcI" href="javascript:;" rel="download">下载</a>\
                            <a class="fcI" href="javascript:;" rel="saveToDisk">移动到彩云</a>\
						    <a class="fcI" href="javascript:;" title="延长文件的有效期"  rel="renew">续期</a>\
                            <a class="fcI" href="javascript:;"  rel="rename"  title="重命名文件" >重命名</a>\
						    <a class="fcI" href="javascript:;"  rel="delete" title="删除文件">删除</a>\
					    </p>\
					</td>\
					<td rel="size" class="t-size"></td>\
                    <td rel="down" class="t-size" style="width: 60px"></td>\
                    <td rel="state" class="t-size" style="width: 60px"></td>\
                    <td rel="date" class="t-size"></td>\
				</tr>';
            //桌面程序则取消操作
            if (window.isLocal()) {
                rowHtml = rowHtml.replace(/<a[^>]+>(?:下载|续期|重命名)<\/a>/ig, "");
            }
            var template = $(rowHtml);
            var tBody = $("<tbody></tbody>");
            var selectedFiles = sharingFileDisk.selectedFiles;
            var selectedCurrentFilesNum = 0;
            $.each(showFileList, function () {
                var file = this;
                var fragment = template.clone();
                fragment.attr("fileId", this.fileId);
                fragment.find("input:checkbox").attr("rel", this.fileId);
                fragment.find("i.exe").removeClass().addClass(fileSharing.tool.getFileImageClass(this.fileName));
                fragment.find("td[rel='name']").attr("title", this.fileName.encode()).prepend(this.fileName.encode());
                //fragment.find("td[rel='fast']").html(this.remainTimes.toString());
                fragment.find("td[rel='size']").html(fileSharing.tool.getFileSizeText(this.fileSize));
                fragment.find("td[rel='down']").html(this.downloadTimes.toString());
                fragment.find("td[rel='state']").html(this.state == 0 ? "完成" : "暂停");
                fragment.find("td[rel='date']").attr("title", "有效期至:" + sharingFileDisk.tool.getDateText(this.expiryDate)).html(this.remain);
                for (var i = 0, l = selectedFiles.length; i < l; i++) {//如果文件被选择过，勾选
                    if (file.fid === selectedFiles[i]) {
                        fragment.find("input:checkbox").attr("checked", true);
                        selectedCurrentFilesNum++;
                    }
                }
                //行热点事件
                fragment.hover(function () { this.className = "t-checked"; }, function () {
                    var chkBox = $(this).find(":checkbox")[0];
                    if (!chkBox || !chkBox.checked) {
                        this.className = "";
                    }
                });
                //行单击事件
                fragment.click(function () {
                    var checkBox = $(this).find(":checkbox"),
						checkBoxDom = checkBox[0],
						selectedFiles = sharingFileDisk.selectedFiles,
						fid = checkBoxDom.getAttribute("rel");

                    if (checkBox.length > 0 && !checkBoxDom.disabled) {
                        checkBoxDom.checked = !checkBoxDom.checked;
                        sharingFileDisk.action.setRowStyle(checkBoxDom);
                        //存储或者删除选中的文件
                        if (checkBoxDom.checked) {
                            selectedFiles.push(fid);
                        } else {
                            selectedFiles.splice(selectedFiles.indexOf(fid), 1);
                        }
                        //重置全选/不选
                        var resetAll = false;
                        $("#tabFileList input:checkbox").each(function () {
                            if (!this.checked && !this.disabled) {
                                resetAll = true;
                                return false;
                            }
                        });
                        sharingFileDisk.action.resetSelectAll(resetAll);
                    }
                });
                //行选择框单击事件
                fragment.find(":checkbox").click(function(e) {
                    var checkBox = $(this).get(0);
                    checkBox.checked = !checkBox.checked;
                    $(this).parent().parent().click();
                    e.stopPropagation();
                });
                //描点出发事件集合
                var anchorActions = {
                    "continue": function () {
                        sharingFileDisk.action.continueUpload(file);
                    },
                    "renew": function() {
                        sharingFileDisk.action.renewFile(file.fileId);
                    },
                    "delete": function() {
                        var message = "确定要删除文件\"{0}\"?";
                        message = message.format(file.fileName.shortName(20));
                        fileSharing.FF.confirm(message, function() {
                            sharingFileDisk.action.deleteFile(file.fileId);
                        });
                    },
                    "rename": function() {
                        var url = "/m2012/html/largeattach/largeattach_dialogfileproperty.html?fileId={0}&sid={1}&rd={2}&mode=disk";
                        url = url.format(file.fileId, fileSharing.tool.getUserInfo(), Math.random());
                        fileSharing.FF.open("文件属性", url, 450, 222, true);
                    },
                    "download": function() {
                        sharingFileDisk.action.downloadFile(file.fileId);
                    },
                    "saveToDisk": function() {
                        fileSharing.tool.addBehavior({
                            actionId: 10473,
                            thingId: 2,
                            moduleId: 11,
                            actionType: 20
                        });
                        var url = "/m2012/html/disk/disk_dialogsavesharefile.html?sharefileid={0}&sharefilename={1}&sid={2}&rd={3}";
                        url = url.format(
                            file.fileId,
                            escape(file.fileName),
                            fileSharing.tool.getUserInfo(),
                            Math.random());
                        fileSharing.FF.open('暂存柜文件移动到彩云', url, 395, 360, true);
                    }
                };
                //行中锚点点击事件
                fragment.find("td>p>a.fcI").click(function(e) {
                    var rel = $(this).attr("rel");
                    if (rel && anchorActions[rel]) {
                        anchorActions[rel]();
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                //文件上传不完整
                if (this.state != 0) {
                    fragment.find("p>a").each(function() {
                        var rel = $(this).attr("rel");
                        if (rel == "continue" && window.isLocal()) {
                            this.style.display = "none";
                        } else if (rel == "continue" || rel == "delete" || rel == "renew") {
                            this.style.display = "";
                        } else {
                            this.style.display = "none";
                        }
                    });
                    fragment.find("td,a").removeClass("fcI").addClass("fe");
                }
                tBody.append(fragment);
            });
            //重置全选/不选
            $("#thSelectAll")[0].checked = (selectedCurrentFilesNum == sharingFileDisk.filter.pageSize);
            sharingFileDisk.action.resetSelectAll();

            $("#tabFileList>tbody").remove();
            //列表无数据
            if (showFileList.length == 0) {
                dvNoInfo.html("<div style='border:1px solid #ccc;background-color:#fffee9;text-align:center;\
                    font-size:14px;font-weight:700;line-height:70px;'>{0}</div>".format(sharingFileDisk.filter.keyword ? "没有搜索到文件" : "暂无文件"));
                dvNoInfo.show();
                //文件统计数置零
                $("#spanFileCount").html("0");
            } else {
                $("#spanFileCount").html(allFilesCount);
                container.append(tBody);
                container.show();
            }
        },
        //呈现分页页码
        renderPageIndex: function(pageCount) {
            var container = $("#divPageBar,#divPageBar2");
            var pageIndex = sharingFileDisk.filter.pageIndex;
            if (pageCount == 0) {
                container.hide();
                return;
            }
            container.show();
            container.empty();
            //添加下拉列表选项
            var optHtml = "";
            for (var i = 0; i < pageCount; i++) {
                optHtml += "<option value='{0}' {1}>{2}/{3}页</option>".format(i, pageIndex == i ? 'selected="selected"' : "", i + 1, pageCount);
            }

            var fragment = $('<div><a href="javascript:void(0);" id="aGoPrev">上一页</a>\
                              <a href="javascript:void(0);" id="aGoNext">下一页</a>\
                              <select id="ddlPager">{0}</select></div>'.format(optHtml));
            fragment.find("#aGoPrev").click(function(e) {
                sharingFileDisk.action.turnPage(pageIndex - 1);
                e.preventDefault();
            });
            fragment.find("#aGoNext").click(function(e) {
                sharingFileDisk.action.turnPage(pageIndex + 1);
                e.preventDefault();
            });
            fragment.find("#ddlPager").change(function() {
                sharingFileDisk.action.turnPage(parseInt(this.value));
            });
            if (pageIndex == 0) {
                fragment.find("#aGoPrev").remove();
            }
            if (pageIndex >= (pageCount - 1)) {
                fragment.find("#aGoNext").remove();
            }
            var fragment1 = fragment.clone(true);
            fragment1.find("#ddlPager")[0].selectedIndex = pageIndex;
            fragment.appendTo("#divPageBar");
            fragment1.appendTo("#divPageBar2");
        },

        //展示暂存柜信息
        renderFolderInfo: function() {
            if (!window.FolderInfo) {
                return;
            }
            var data = window.FolderInfo;
            if (data.usedSize > data.folderSize) {
                data.usedSize = data.folderSize;
            }
            var orderConfig = { oderInfo: false, keepDay: false };
            var remainSize = data.folderSize - data.usedSize;
            var usedPercent = Math.ceil(data.usedSize / data.folderSize * 100);
            usedPercent = usedPercent > 100 ? 100 : usedPercent;
            $("#divFolderMessage").empty().append(
                '<h2>我的暂存柜信息({6})</h2> \
                <div class="progress">\
                    <div style="width: {0}%;" class="pg-bg"></div>\
                    <span>{0}%</span>\
                </div>\
				<p>容  量：<span>{1}&nbsp;{2}</span></p>\
                <p>剩  余：<span>{3}</span></p>\
                <p>存放期：<span>{4}天&nbsp;{5}</span></p>'.format(
                usedPercent,
                fileSharing.tool.getFileSizeText(data.folderSize),
                sharingFileDisk.tool.getVolumeTips(usedPercent, orderConfig),
                remainSize == 0 ? 0 : fileSharing.tool.getFileSizeText(remainSize),
                data.keepDays,
                sharingFileDisk.tool.getKeepDayTips(orderConfig),
                data.fileList.length
            ));
            //免费版、5元版容量超过80%时出现套餐升级引导
            if (orderConfig.oderInfo) {
                var aShowOrderTips = $("#aShowOrderTips");
                var dvOrderTips = $("#dvOrderTips");
                dvOrderTips.find("span:eq(0)").text(fileSharing.tool.getFileSizeText(data.folderSize));
                sharingFileDisk.tool.showTips(aShowOrderTips, dvOrderTips, function() {
                    //添加行为日志
                    fileSharing.tool.addBehavior({
                        actionId: 102322,
                        thingId: 0,
                        moduleId: 11,
                        actionType: 20
                    });
                });
            }
            //增加期限
            if (orderConfig.keepDay) {
                var aAddKeepDay = $("#aAddKeepDay");
                var dvAddKeepDay = $("#dvAddKeepDay");
                sharingFileDisk.tool.showTips(aAddKeepDay, dvAddKeepDay, function() {
                    //添加行为日志
                    fileSharing.tool.addBehavior({
                        actionId: 102323,
                        thingId: 0,
                        moduleId: 11,
                        actionType: 20
                    });
                });
            }
            if (data.fileList.length > 0) {
                $("#spanFileCount").html(data.fileList.length);
            }
        }

    },
    server: {
        //获取暂存柜信息
        //actionId:  0: 获取暂存柜配置信息、文件列表
        //           1: 获取暂存柜配置信息
        //           2: 获取暂存柜文件列表信息
        getMainData: function(callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingFileDisk.urls.getFilesUrl(),
                data: XmlUtility.parseJson2Xml({
                    actionId: 0
                }),
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        var data = this["var"];
                        data.fileSendCount = parseInt(data.fileSendCount);
                        sharingFileDisk.fileSendCount = data.fileSendCount;
                        sharingFileDisk.messages.TooManyFilesForSend = sharingFileDisk.messages.TooManyFilesForSend.format(data.fileSendCount);
                        data.usedSize = parseFloat(data.usedSize);
                        data.wapFiles = parseFloat(data.wapFiles);
                        data.wapFileSize = parseFloat(data.wapFileSize);
                        $(data.fileList).each(function() {
                            this.expiryDate = fileSharing.tool.parseDate(this.expiryDate);
                            this.fileSize = parseInt(this.fileSize);
                            this.sendCount = parseInt(this.sendCount);
                            this.downloadTimes = parseInt(this.downloadTimes);
                            //this.remainTimes = Math.max(0, data.fileSendCount - this.sendCount);
                            this.fileId = this.fid;
                        });
                        if (callback) { callback.call(data); }
                    }
                    else { fileSharing.FF.alert(this.summary); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //文件续期
        renewFile: function(fileIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingFileDisk.urls.getRenewFilesUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileIds: fileIds.toString()
                }),
                success: function(result) {
                    var isSuccess = false;
                    if (this.code != fsConfig.isOk) {
                        fileSharing.FF.alert(this.summary);
                    } else {
                        isSuccess = true;
                    }
                    if (callback) { callback(isSuccess); }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //删除文件
        deleteFile: function(fileIds, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingFileDisk.urls.getDeleteFileUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileIds: fileIds
                }),
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback();
                    } else {
                        fileSharing.FF.alert(this.summary);
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //设置提醒方式
        setRemind: function(emailRemind, mobileRemind, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingFileDisk.urls.getSetRemindUrl(),
                data: XmlUtility.parseJson2Xml({
                    mobileRemind: mobileRemind,
                    emailRemind: emailRemind
                }),
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback();
                    } else {
                        fileSharing.FF.alert(this.summary);
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },

        //下载
        downloadFile: function(fileId, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            $.postXml({
                url: sharingFileDisk.urls.getDownloadFileUrl(),
                data: XmlUtility.parseJson2Xml({
                    fileIds: fileId
                }),
                async: false,
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback.call(this.imageUrl);
                    } else {
                        fileSharing.FF.alert(this.summary);
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        },
        //获取虚拟盘下载地址
        getDownLoadVdUrl: function(data, callback) {
            /*界面超时处理*/
            if (Utils.PageisTimeOut(true)) {
                return;
            }
            var url = sharingFileDisk.urls.getVirtualExeUrl();
            var data = XmlUtility.parseJson2Xml(data);
            $.postXml({
                url: url,
                data: data,
                async: false,
                success: function(result) {
                    if (this.code == fsConfig.isOk) {
                        if (callback) callback.call(this["var"]);
                    }
                },
                error: function(error) {
                    fileSharing.tool.handleError(error);
                }
            });
        }
    },
    tool: {
		is20Version: function(){
			return top.$User.getServiceItem() == top.$User.getVipStr("20");
		},
        //重设窗体尺寸大小
        resizeWindow: function() {
            fileSharing.tool.tryCatch(function() {
                var winHeight = $(document.body).height();
                var toolBarHeight = $("div.fileExpToolBar").height();
                var tableHeadHeight = $("#tabTableHeader").height();
                $("#divFileList").height(winHeight - toolBarHeight - tableHeadHeight - 5);
            });
        },
        //获取关键字过滤后的文件列表
        getFilterFiles: function(files, keyword) {
            var retValue = [];
            var key = keyword.toLowerCase();
            $.each(files, function() {
                if (this.fileName.toLowerCase().indexOf(key) >= 0) {
                    retValue.push(this);
                }
            })
            return retValue;
        },
        //时间转换成字符串
        getDateText: function(date) {
            return "{0}年{1}月{2}日 {3}时{4}分".format(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes());
        },
        //获取扩大容量提示信息
        getVolumeTips: function(usedPercent, orderConfig) {
            var volumeTips = "";
            if (usedPercent >= 80 && !this.is20Version()) {
                volumeTips = '<a id="aShowOrderTips" href="javascript:void(0)" style="color: Blue;">扩大容量</a>';
                orderConfig.oderInfo = true;
            }
            return volumeTips;
        },
        //获取增加期限提示信息
        getKeepDayTips: function(orderConfig) {
            var keepDayTips = "";
            if (top.UserData.vipInfo && top.UserData.vipInfo.serviceitem != "0016" && top.UserData.vipInfo.serviceitem != "0017") {
                keepDayTips = '<a id="aAddKeepDay" href="javascript:void(0);" style="color: Blue;">增加期限</a>';
                orderConfig.keepDay = true;
            }
            return keepDayTips;
        },
        showTips: function(target, tips, clickHandler) {
            var attrKey = "isOnTips";
            target.hover(function(e) {
                tips.css({ top: (target.offset().top + target.height()) + "px", right: "40px", padding: "6px" });
                tips.show();
            }, function(e) {
                window.setTimeout(function() {
                    if (!target.attr(attrKey)) {
                        tips.hide();
                    }
                }, 100);
            });
            tips.hover(function(e) {
                target.attr(attrKey, "1");
            }, function(e) {
                target.attr(attrKey, "");
                tips.hide();
            });
            tips.find("a").click(function(e) {
                if (clickHandler) {
                    clickHandler();
                }
                top.$App.showOrderinfo();
                target.attr(attrKey, "");
                tips.hide();
                return false;
            });
        },
		addSelectedFile: function (fid) {
			var selectedFiles = sharingFileDisk.selectedFiles;

			for (var i = 0, l = selectedFiles.length; i < l; i++) {
				if (selectedFiles[i] == fid) return;
			}
			selectedFiles.push(fid);
		}
    }
};

//提供给外部页面调用的接口
var Action = {
    refresh: function() {
        sharingFileDisk.action.refresh();
    }
};

//页面加载
sharingFileDisk.action.pageLoad();