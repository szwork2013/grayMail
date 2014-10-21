(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;

    M139.namespace("M2012.Disk.View.UploadFileList", Backbone.View.extend({
        el: "#fileList",

        getListContainer: function(){
            return $(this.listSelector);//每次重新获取一遍容器
        },

        getIconContainer: function(){
            return $(this.iconSelector);
        },

        itemTemplete: ['<tr class="item-upload" clientTaskno="{clientTaskno}" rel="uploadFile">',
                '<td class="wh1 t-check"><input type="checkbox" disabled = "disabled" fileid="" filetype="file"></td>',
                '<td>',
					'<div class="fl p_relative">',
						'<i class="i-file-smalIcion i-f-{expandName}"></i>',
					'</div>',
                    '<a href="javascript:void(0)" class="attchName" title="">',
                        '<span class="nameContainer">',
                            '<em fileid="" fsize="" name="fname">{fileName}</em>',
                            '<input type="text" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none;">',
                            '<em fileid="" fsize="" name="fname">.{expandName}</em>',
                        '</span>',
                    '</a>',
                    '<div class="attachment">',
                        '{subTemplete}',
                    '</div>',
                '</td>',
                '<td class="wh5 gray" rel="uploadDate"></td>',
                '<td class="wh6 gray" rel="fileSize">{fileSize}</td>',
            '</tr>'].join(""),

        fileOperationTmplete: ['<span style="display:none;"><a href="javascript:void(0)" name="download" fileid="{businessId}">下载</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="share" fileid="{businessId}">共享</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="send" fileid="{businessId}">发送</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="delete" fileid="{businessId}" fname="{fileNameOrigin}">删除</a></span>'].join(""),

        fileSizeLimitTmplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0)" name="deleteEle" fileid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0)" name="installTool">立即安装</a>'].join(""),

        errUploadTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">{errInfo}</span>',
            '<a href="javascript:void(0)" class="pl_10" name="againUpload">重试</a>',
            '<span class="line">|</span>',
            '<a href="javascript:void(0)" name="deleteEle" fileid="" fname="">删除</a>'].join(""),

        progressBarTemplete: ['<span class="progressBarDiv">',
            '<span class="progressBar"></span>',
            '<span class="progressBarCur">',
            '<span style="width: 0;"></span>',
            '</span>',
            '</span>',
            '<span class="state-upload gray" style="display: inline-block;width: 150px;"> 等待中({fileSize})</span>',
            '<a href="javascript:void(0);" class="btn-switch-upload pl_10" style="display: none;">暂停</a>'].join(""),

        stateUploadTemplete: '<span style="display: inline-block;width: 80px;">{speed}</span>&nbsp;&nbsp;{surplusTime}',

        md5LoadingTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">正在扫描本地文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描本地文件</span>'].join(""),

        commonUploadTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">正在上传本地文件</span>'].join(""),

        flashLimitTipTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0);" name="installTool">立即安装</a>'].join(""),

        limitUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超出当前套餐单文件大小{limitUploadSize}限制，上传失败，请升级邮箱获得更多权益。</span>',
            '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '<span> | </span>',
            '<a href="javascript:void(0);" name="upgradeMail">升级邮箱</a>'].join(""),

        limitMaxUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超出当前套餐单文件大小{limitUploadSize}限制，上传失败。</span>',
            '<a href="javascript:void(0);" name="deleteEle">删除</a>'].join(""),

        emptyUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">不允许上传空文件，请重新选择。</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>'].join(""),

        deleteBtnTemplete: ['<span class="btn-delete">',
                '<span>|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fileid="{fileId}" fname="{fileOriginName}"> 删除</a>',
            '</span>'].join(""),

        itemIconTemplete: [ '<li class="listItem" rel="uploadFile">',
                '<p class="chackPbar">',
                    '<input fileid="{fileId}" name="checkbox"  filetype="file" type="checkbox" class="checkView" style="display: none;" disabled = "disabled">',
                '</p>',
                '<a href="javascript:void(0);" class="viewPic">',
                    '<img src="../../images/module/FileExtract/default.png" filetype="file" fileid="{fileId}" name="fname" style="">',
                '</a>',
                '<div class="viewIntroduce">',
                    '<p class="fileNameBar">',
                        '<span class="itemName" name="nameContainer">',
                            '<a fileid="{fileId}" filetype="file" fsize="$filesize" href="javascript:void(0)" name="fname">{fileName}</a>',
                            '<input type="text" filetype="file" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none; width:100px; overflow: hidden;" />',
                        '</span>',
                        '<span class="itemSuffix">.{expandName}</span>',
                    '</p>',
                    '{subTemplete}',
                '</div>',
            '</li>'].join(""),

        flashLimitTipIconTemplete: ['<p class="gray">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">超过100M上传失败！</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        emptyUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">不能上传空文件</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        limitUploadSizeIconTemplete: ['<p class="gray">',
                                    '<i class="i_warn_min"></i>',
                                    '<span class="red">超出当前套餐单文件大小</span>',
                                '</p>'].join(""),

        fileSizeBar: '<p class="gray" style="display: block;"><span style="display: none;">{fileSize}</span></p>',

        fileOperationIconTmplete: ['<p style="display: none;" class="attachment">',
                '<a hidefocus="1" href="javascript:void(0)" name="download" fileid="{businessId}">下载</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="share" fileid="{businessId}">共享</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="send" fileid="{businessId}">发送</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fileid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '</p>'].join(""),

        progressBarIconTemplete: ['<div class="progressBarWrap">',
                                    '<span class="progressBarDiv viewtProgressBar">',
                                        '<span class="progressBar"></span>',
                                        '<span class="progressBarCur">',
                                            '<span class="progressCenter" style="width: 0%;"></span>',
                                        '</span>',
                                    '</span>',
                                    '<span class="gray" style="display: none;">等待中</span>',
                                '</div>'].join(""),

        errUploadIconTemplete: ['<p class="gray">',
                '<i class="i_warn_min"></i>',
                '<span class="red">{errInfo}</span>',
            '</p>'].join(""),

        errOperationTemplete: ['<p style="display: none;" class="attachment">',
                '<a href="javascript:void(0);">重试</a>',
                '<span class="line">|</span>',
                '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '</p>'
        ].join(""),

        progressTipTemplete: ['<div id="progressTip" class="tips netpictips pl_10" style="width:220px; top: 336px;left: 900px;">',
                '<a class="delmailTipsClose" href="javascript:void(0);">',
                    '<i class="i_u_close"></i>',
                '</a>',
                '<div class="tips-text">',
                    '<div class="imgInfo">',
                        '<dl class="attrchUp">',
                            '<dd>',
                                '速度：',
                                '<span id="speedEle">112k/s</span>',
                            '</dd>',
                            '<dd>',
                                '上传进度：',
                                '<span id="progressEle">42%</span>',
                                '<em class="gray" id="progressRatioEle">(43M/65M)</em>',
                            '</dd>',
                            '<dd class="mb_15">预计剩余时间：<span id="surplusTimeEle"></span></dd>',
                        '</dl>',
                    '</div>',
                '</div>',
                '<div class="tipsTop diamond"></div>',
            '</div>'].join(""),

        initialize: function (options) {
            this.controler          = options.controler;
            this.model              = options.model;
            this.listSelector       = options.listSelector;
            this.iconSelector       = options.iconSelector;
            this.subModel           = options.subModel;
            this.scrollSelector     = options.scrollSelector;
            this.isMcloud           = options.subModel.get("isMcloud");
            this.currentUploadType  = options.controler.currentUploadType;
        },

        render: function (options) {
            this.initEvents();
        },

        initEvents: function(){
            var self = this;

            //监听model层数据变化
            this.model.on("renderList", function (options) {
                !self.getListMode() ? self.renderList(options) : self.renderListIcon(options);
            });
            this.model.on("getFileMd5", function (options) {
                !self.getListMode() ? self.getFileMd5(options) : self.getFileMd5Icon(options);
            });
            this.model.on("loadstart", function (options) {
                !self.getListMode() ? self.loadstart(options) : self.loadstartIcon(options);
            });
            this.model.on("progress", function (options) {
                !self.getListMode() ? self.progress(options) : self.progressIcon(options);
            });
            this.model.on("md5Progress", function (options) {
                !self.getListMode() ? self.md5Progress(options) : self.md5ProgressIcon(options);
            });
            this.model.on("complete", function (options) {
                !self.getListMode() ? self.complete(options) : self.completeIcon(options);
            });
            this.model.on("cancel", function (options) {
                !self.getListMode() ? self.cancel(options) : self.cancelIcon(options);
            });
            this.model.on("error", function (options) {
                !self.getListMode() ? self.error(options) : self.errorIcon(options);
            });
        },

        getListMode: function(){
            return mainView.model.get("listMode");// 列表模式：0 列表 1 图标
        },

        //获取当前模式下的容器
        getContainer: function(){
            return !this.getListMode() ? this.getListContainer() : this.getIconContainer();
        },

        renderList: function (options) {
            var self = this;

            this.returnFirstPage();

            //等待视图模板
            var defaultTemplete = self.model.format(this.itemTemplete, {
                subTemplete: this.progressBarTemplete
            });

            this.createList({
                fileList: options.fileList,
                fileNameLen: 30,
                defaultTemplete: defaultTemplete
            });
        },

        //创建上传列表
        createList: function (options) {
            var self = this;
            var fileList = options.fileList;
            var div = $("<div></div>");
            var $item = "";
            var templete = "";
            var fileListNum = this.model.uploadFileNum = fileList.length;

            for (var i = 0; i < fileListNum; i++) {
                var file = fileList[i];

                if (file.state != 0) {
                    var data = {
                        fileName: $T.Html.encode(self.model.getShortName(file.name, options.fileNameLen)),
                        expandName: self.model.getExtendName(file.name),
                        fileSize: file.size ? top.M139.Text.Utils.getFileSizeText(file.size) : "",
                        clientTaskno: file.clientTaskno
                    };

                    templete = options.defaultTemplete;

                    $item = $(top.M139.Text.Utils.format(templete, data));
                    div.append($item);
                    this.model.fileListEle[file.clientTaskno] = $item;
                    this.model.set("needUploadFileNum", this.model.get("needUploadFileNum") + 1);
                }
            }

            if (div.children().length == 0) return;

            this.deleteEmptyContainer();
            this.insertEle(div.children());
            this.deleteExcessEle();
            this.bindCoperationEvent();
        },

        insertEle: function(elem){
            var self = this;
            var subModel = this.subModel;
            var container = this.getContainer();

            if (subModel) {
                var folderNum = subModel.getFolderNumByCurDir();

                /*if (folderNum > 0) {//当前目录下存在文件夹
                    var lastFolderEle = container.children().eq(folderNum - 1);
                    lastFolderEle.after(elem);
                    if (!self.getListMode()) {
                        self.el.scrollTop = lastFolderEle[0].offsetTop + lastFolderEle[0].offsetHeight;
                    } else {
                        self.el.scrollTop = lastFolderEle[0].offsetTop - 156;//由于图片视图li是浮动的，导致定位的父元素发生改变
                    }
                } else {
                    container.prepend(elem);
                    self.el.scrollTop = 0;
                }*/
                container.prepend(elem);
                self.el.scrollTop = 0;
            }
        },

        bindCoperationEvent: function(){
            var self = this;
            var container = !this.getListMode() ? this.getListContainer() : this.getIconContainer();

            container.click(function(e){
                self.operateHandle(e);
            });
        },

        operateHandle: function (e) {
            var target = e.target;

            if (target.tagName == "A") {
                var name = target.getAttribute("name");
                var $target = $(target);

                this.model.currentItem = !this.getListMode() ? $target.parents("tr") : $target.parents("li");
                this.command(name);
            }
        },

        command: function (name) {
            var self = this;
            var currentItem = self.model.currentItem;

            switch (name) {
                case "deleteEle":
                    currentItem.remove();
                    return;
                case "upgradeMail":
                    top.$App.showOrderinfo();
                    return;
                case "installTool":
                    window.open(self.model.installToolUrl);
                    return;
            }
        },

        getFileMd5: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno],
                templete = "";

            if (this.controler.currentUploadType == this.controler.uploadType.COMMON) { //普通上传
                templete = this.commonUploadTemplete;
            } else {
                templete = this.md5LoadingTemplete;
            }

            currentItem.find(".attachment").html(templete);
        },

        loadstart: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            currentItem.find(".attachment").html(progressBarHtml);

            var btnSwitchUploadEle = currentItem.find(".btn-switch-upload");
            btnSwitchUploadEle.show();
            bindStopUploadEvent();

            function bindStopUploadEvent(){
                btnSwitchUploadEle.bind("click", function(){
                    btnSwitchUploadEle.html("续传");
                    self.model.set("isStop", true);
                    self.controler.onabort(clientTaskno);
                    btnSwitchUploadEle.unbind("click");

                    // 由于彩云分布式无法支持暂停之后立即续传，需要将续传功能冻结 5s
                    setTimeout(function(){
                        bindResumeUploadEvent();
                    }, 5000);
                });
            }

            function bindResumeUploadEvent(){
                btnSwitchUploadEle.bind("click", function(){
                    var itemUploadEle = btnSwitchUploadEle.parents(".item-upload");

                    btnSwitchUploadEle.html("暂停");

                    //当前上传文件在上传队列中的索引
                    var clientTaskno = itemUploadEle.attr("clientTaskno");

                    self.controler.uploadHandle(function (options) {
                        self.error.call(self, options);
                    }, null, clientTaskno);

                    btnSwitchUploadEle.unbind("click");
                    bindStopUploadEvent();
                })
            }
        },

        //options: {clientTaskno, sendSize, totalSize, speed, surplusTime}
        progress: function(){
            var currentFile = this.model.get("currentFile");
            var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".state-upload").html(top.M139.Text.Utils.format(this.stateUploadTemplete, {
                speed: currentFile.speed,
                surplusTime: currentFile.surplusTime
            }));
        },

        md5Progress: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".attachment").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));
        },

        md5ProgressIcon: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".progressBarWrap").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));
        },

        complete: function(){
            var self = this;

            //普通上传存彩云，上传完文件之后需要刷新列表
            if (self.isMcloud == "1" && self.currentUploadType == self.controler.uploadType.COMMON) {
                self.subModel.trigger("refresh");
                return;
            }

            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();

            currentFile.fileInfo && currentItem.find("td[rel='uploadDate']").html(currentFile.fileInfo.createTime);
            currentFileSize && currentItem.find("td[rel='fileSize']").html(top.M139.Text.Utils.getFileSizeText(currentFileSize));

            currentItem.find("input[type='checkbox']").attr({'fileid':currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fileid", currentFileBusinessId)
                .eq(0).html(self.model.getShortName(currentFileNameOrigin, 30))
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            setTimeout(function(){
                currentItem.find(".attachment").html(successHtml).hide();
				currentItem.find(".attchName").css("padding-top","6px");
				
            }, 1000);

            this.completeModelHandle();
        },

        cancel: function (options) {

        },

        error: function(){
            var self = this;
            var currentFile = this.model.get("currentFile");
            var clientTaskno = currentFile.clientTaskno;
            var controler = this.controler;
            var currentItem = this.model.fileListEle[clientTaskno];
            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            var errHtml = top.M139.Text.Utils.format(this.errUploadTemplete, {
               errInfo: currentFile.summary || "上传失败！"
            });

            currentItem.find(".attachment").html(errHtml);
            currentItem.find("input[type='checkbox']").attr("disabled", true);
            currentItem.find("a[name='againUpload']").click(function(){//重传
                var btnTxtEle = $(this);
                var itemUploadEle = btnTxtEle.parents(".item-upload");
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                $(this).parent().html(progressBarHtml);//插入进度条dom
                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, function(){
                    self.model.trigger("getFileMd5");
                }, clientTaskno);
            });

            this.completeModelHandle();
        },

        renderListIcon: function (options) {
            var self = this;

            this.returnFirstPage();

            //等待视图模板
            var defaultTemplete = self.model.format(this.itemIconTemplete, {
                subTemplete: this.progressBarIconTemplete
            });

            this.createList({
                fileList: options.fileList,
                fileNameLen: 10,
                defaultTemplete: defaultTemplete
            });

//            this.showProgressTip();
        },

        showProgressTip: function(){
            var tipEle = $("#progressTip");

            if (tipEle.length == 0) {
                this.model.progressTipEle = $(this.progressTipTemplete);
                $("body").append(this.model.progressTipEle);
            }
        },

        getFileMd5Icon: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno],
                templete = "";

            if (this.controler.currentUploadType == this.controler.uploadType.COMMON) { //普通上传
                templete = this.commonUploadTemplete;
            } else {
                templete = this.md5LoadingTemplete;
            }

            currentItem.find(".progressBarWrap").html(templete);
        },

        loadstartIcon: function(){
            var self = this,
                currentFile = this.model.get("currentFile"),
                clientTaskno = currentFile.clientTaskno,
                currentItem = this.model.fileListEle[clientTaskno];

            var progressBarIconHtml = top.M139.Text.Utils.format(this.progressBarIconTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            currentItem.find(".progressBarWrap").after(progressBarIconHtml).remove();

            var btnSwitchUploadEle = currentItem.find(".btn-switch-upload");
            btnSwitchUploadEle.show();

            btnSwitchUploadEle.toggle(function(){//暂停
                $(this).html("续传");
                self.controler.onabort(clientTaskno);
            }, function(){//续传
                var btnTxtEle = $(this),
                    itemUploadEle = btnTxtEle.parents(".item-upload");

                btnTxtEle.html("暂停");

                //当前上传文件在上传队列中的索引
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });

            /*currentItem.hover(function(){
                var progressTipEle = self.model.progressTipEle;
                var currentFileOffset = currentItem.offset();

                progressTipEle.css({
                    left: currentFileOffset.left,
                    top: currentFileOffset.top + 170
                }).show();
                setTimeout(function(){
                    progressTipEle.hide();
                }, 3000);
            });*/
        },

        //options: {clientTaskno, sendSize, totalSize, speed, surplusTime}
        progressIcon: function(){
            var currentFile = this.model.get("currentFile");
            var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];
            var progressTipEle = this.model.progressTipEle;

            currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".progressBarWrap .gray").html(ratioSend);
//            progressTipEle.find("speedEle").html(currentFile.speed);
//            progressTipEle.find("progressEle").html(ratioSend);
//            progressTipEle.find("progressRatioEle").html("(" + currentFile.sendSize + "/" + currentFile.totalSize + ")");
//            progressTipEle.find("surplusTimeEle").html(currentFile.surplusTime);
        },

        completeIcon: function(){
            var self = this;

            //普通上传存彩云，上传完文件之后需要刷新列表
            if (self.isMcloud == "1" && self.currentUploadType == self.controler.uploadType.COMMON) {
                self.subModel.trigger("refresh");
                return;
            }

            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);
            var progressTipEle = this.model.progressTipEle;
            var imgEle = currentItem.find(".viewPic img");

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".progressBarWrap").remove();
            currentItem.find(".fileNameBar").after(top.M139.Text.Utils.format(this.fileSizeBar, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFileSize)
            }));
            currentItem.find(".chackPbar input").attr("fileid", currentFileBusinessId);
            currentItem.find(".itemName em").html(self.model.getShortName(currentFileNameOrigin, 10));

            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();
			var ext = currentFile.fileInfo.name.split(".").pop();
            if (currentFile.thumbUrl) {
                imgEle.attr("src", currentFile.thumbUrl);
            } else if (currentFile.fileInfo.file && ext) {
                imgEle.attr("src", '../../images/module/FileExtract/' + ext + '.png');
                imgEle.parent().attr("class", "viewPic");
				imgEle.error(function(){
					this.src = '../../images/module/FileExtract/default.png';
				});
            }
            imgEle.attr("fileid", currentFileBusinessId);

            currentItem.find("input[type='checkbox']").attr({"fileid":currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fileid", currentFileBusinessId)
                .eq(0).html(currentFileName)
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationIconTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

        //    currentItem.find(".viewIntroduce").append(successHtml);
            this.completeModelHandle();
//            progressTipEle.unbind("hover");
        },

        cancelIcon: function (options) {

        },

        errorIcon: function(){
            var self = this;
            var currentFile = this.model.get("currentFile");
            var clientTaskno = currentFile.clientTaskno;
            var controler = this.controler;
            var currentItem = this.model.fileListEle[clientTaskno];
            var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size)
            });
            var errHtml = top.M139.Text.Utils.format(this.errUploadIconTemplete, {
                errInfo: currentFile.summary || "上传失败！"
            });

            currentItem.find(".progressBarWrap").before(errHtml + self.errOperationTemplete)
                .remove();
            currentItem.find("a[name='againUpload']").click(function(){//重传
                var btnTxtEle = $(this);
                var itemUploadEle = btnTxtEle.parents(".item-upload");
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                $(this).parent().html(progressBarHtml);//插入进度条dom
                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });
                /*.end().find("a[name='deleteEle']").click(function(){//删除文件
                    currentItem.remove();
                });*/
            this.completeModelHandle();
        },

        //将上传成功或者失败文件的数据存储在fileList中
        completeModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo || {};
            var folderNum = this.subModel.getFolderNumByCurDir();

            this.subModel.get("fileList").splice(folderNum, 0, newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

        errModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo || {};
            var folderNum = this.subModel.getFolderNumByCurDir();

            this.subModel.get("fileList").splice(folderNum, 0, newFile);
        },

        //如果当前不在第一页，回到第一页
        returnFirstPage: function(){
            if (this.subModel && this.subModel.get("pageIndex") > 1) {
                this.subModel.set("pageIndex", 1);
            }
        },

        //上传文件时删除超过当前页的文件
        deleteExcessEle: function(){
            var container = this.getContainer();
            var uploadFileNum = this.model.uploadFileNum;
            var children = container.children();
            var childrenLen = children.length;

            if (childrenLen > this.subModel.get("pageSize")) {
                for (var i = 30; i < childrenLen; i++) children.eq(i).remove();
            }

            //重新生成分页按钮
            this.subModel && this.subModel.trigger("createPager");
        },

        //删除空容器
        deleteEmptyContainer: function(){
            if (this.subModel) {
                var fileItem = this.subModel.get("fileList");
                fileItem.length == 0 && this.getContainer().html("");
            }
        }
    }));
})(jQuery, Backbone, _, M139);
