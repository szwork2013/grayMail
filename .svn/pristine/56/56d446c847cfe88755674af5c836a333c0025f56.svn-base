(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;

    M139.namespace("M2012.Fileexpress.Cabinet.View.UploadFileList", Backbone.View.extend({
        el: "#fileList",

        getListContainer: function(){
            return $(this.listSelector);//每次重新获取一遍容器
        },

        getIconContainer: function(){
            return $(this.iconSelector);
        },

        itemTemplete: ['<tr class="item-upload" clientTaskno="{clientTaskno}" rel="uploadFile">',
                '<td class="wh1 t-check"><input type="checkbox" disabled = "disabled" fid=""></td>',
                '<td>',
					'<div class="fl p_relative">',
						'<i class="i-file-smalIcion i-f-{expandName}"></i>',
					'</div>',
                    '<a href="javascript:void(0)" class="attchName" title="">',
                        '<span class="nameContainer">',
                            '<em fid="" fsize="" name="fname">{fileName}</em>',
                            '<input type="text" fname="{fileName}" exname="{expandName}" value="{fileName}" maxlength="255" size="30" style="display:none;">',
                            '<em fid="" fsize="" name="fname">.{expandName}</em>',
                        '</span>',
                    '</a>',
                    '<div class="attachment">',
                        '{subTemplete}',
                    '</div>',
                '</td>',
                '<td class="wh4 gray" rel="uploadDate"></td>',
                '<td class="wh4 gray" rel="maxSaveTime"></td>',
                '<td class="wh5 gray">0</td>',
                '<td class="wh6 gray" rel="fileSize">{fileSize}</td>',
            '</tr>'].join(""),

        fileOperationTmplete: ['<span style="display: none;"><a href="javascript:void(0)" name="download" fid="{businessId}">下载</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="send" fid="{businessId}">发送</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="renew" fid="{businessId}">续期</a> <span>|</span> ',
            '<a href="javascript:void(0)" name="deleteUpload" fid="{businessId}" fname="{fileNameOrigin}">删除</a></span>'].join(""),

        fileSizeLimitTmplete: ['<i class="i_warn_min"></i>',
            '<span class="red">超过100M，无法上传！</span>',
            '<a href="javascript:void(0)" name="delete" fid="{businessId}" fname="{fileNameOrigin}">删除</a>',
            '<span class="gray">139邮箱小工具支持超大文件急速上传、断点续传！</span>',
            '<a href="javascript:void(0)" name="installTool">立即安装</a>'].join(""),

        errUploadTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">{errInfo}</span>',
            '<a href="javascript:void(0)" class="pl_10" name="againUpload">重试</a>',
            '<span class="line">|</span>',
            '<a href="javascript:void(0)" name="deleteEle" fid="" fname="">删除</a>'].join(""),

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
            '<span class="pt_5 gray">正在扫描文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描文件</span>'].join(""),

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

        emptyUploadSizeTemplete: ['<i class="i_warn_min"></i>',
            '<span class="red">不允许上传空文件，请重新选择。</span>',
            '<a href="javascript:void(0);" name="deleteEle" class="">删除</a>'].join(""),

        deleteBtnTemplete: ['<span class="btn-delete">',
                '<span>|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="delete" fid="{fileId}" fname="{fileOriginName}"> 删除</a>',
            '</span>'].join(""),

        itemIconTemplete: [ '<li class="listItem" rel="uploadFile">',
                '<p class="chackPbar">',
                    '<input fid="{fileId}" name="checkbox"  filetype="file" type="checkbox" class="checkView" style="display: none;" disabled = "disabled">',
                '</p>',
                '<a href="javascript:void(0);" class="viewPic">',
                    '<img src="../../images/module/FileExtract/default.jpg" style="width: 65px; height: 65px;">',
                '</a>',
                '<div class="viewIntroduce">',
                    '<p class="fileNameBar">',
                        '<span class="itemName">',
                            '<em>{fileName}</em>',
                        '</span>',
                        '<span class="itemSuffix">.{expandName}</span>',
                    '</p>',
                    '{subTemplete}',
                '</div>',
            '</li>'].join(""),

        flashLimitTipIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">超过100M上传失败！</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                    '</p>'].join(""),

        emptyUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                        '<i class="i_warn_min"></i>',
                                        '<span class="red">不能上传空文件</span>',
                                        '<a href="#" name="deleteEle">删除</a>',
                                      '</p>'].join(""),

        limitUploadSizeIconTemplete: ['<p class="gray" style="display:block!important;">',
                                    '<i class="i_warn_min"></i>',
                                    '<span class="red">超出套餐限制</span>',
                                    '<a href="#" name="deleteEle">删除</a>',
                                '</p>'].join(""),

        fileSizeBar: '<p class="gray" style="display: none;">{fileSize}</p>',

        fileOperationIconTmplete: ['<p style="display: none;">',
                '<a hidefocus="1" href="javascript:void(0)" name="download" fid="{businessId}">下载</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="send" fid="{businessId}">发送</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="renew" fid="{businessId}">续期</a><span class="line">|</span>',
                '<a hidefocus="1" href="javascript:void(0)" name="deleteUpload" fid="{businessId}" fname="{fileNameOrigin}">删除</a>',
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
                '<span class="red">上传失败！</span>',
                '<a href="javascript:void(0);">重试</a>',
                '<span class="line">|</span>',
                '<a href="javascript:void(0);" name="deleteEle">删除</a>',
            '</p>'].join(""),

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
            this.controler      = options.controler;
            this.model          = options.model;
            this.listSelector   = options.listSelector;
            this.iconSelector   = options.iconSelector;
            this.subModel       = options.subModel;
            this.scrollSelector = options.scrollSelector;
        },

        logger: new top.M139.Logger({name: "M2012.Fileexpress.Cabinet.View.UploadFileList"}),

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
            this.model.on('autoSaveDisk',function(){
				//self.isHasMy139(function(){
			        //var currentFile = self.model.get("currentFile");
					//console.log(currentFile)
				//});
            })
        },

        getListMode: function(){
            return mainView.model.get("listMode");// 列表模式：0 列表 1 图标
        },
		isHasMy139: function(callback){
			var self = this;
            self.model.getDirectorys(function(result){
	            if(result.responseData && result.responseData.code== 'S_OK'){
					var directorys = result.responseData['var'].directorys;
					if(directorys.length != 0){self.model.set('RootId',directorys[0].parentDirectoryId)}
					$.each(directorys,function(i,item){
						if(item.directoryName == '139邮箱'){
							self.model.set('my139Id',item.directoryId)
						}
					})
					if(self.model.get('my139Id')){
						var directoryId = self.model.get('my139Id');
						self.isHasMyAttach(directoryId)
					}else{
						var options ={};
							options.name = "139邮箱";
						self.createDir(function(result){
							if(result.responseData && result.responseData.code== 'S_OK'){							
								var directoryId = result.responseData['var'].directoryId;
								self.model.set('my139Id',directoryId)	
								self.isHasMyAttach(directoryId)
							}
	
						},options);
					}
					//console.log(self.model.directorys)
	                //self.model.setDirProperties(self.model.directorys);
	                callback && callback();
				}else{
					self.logger.error("getDirectorys returndata error", "[disk:getDirectorys]", result);
				}
            })
		},
		isHasMyAttach : function(directoryId){
			var self = this;
			self.model.getfiles(function(result){
	            if(result.responseData && result.responseData.code== 'S_OK'){
					var directorys = result.responseData['var'].files;
					$.each(directorys,function(i,item){
						if(item.name == '我的附件'){
							self.model.set('attachId',item.id);
						}
					})
					if(self.model.get('attachId')){
						self.saveToDisk();
					}else{
						var options ={};
							options.name = "我的附件";
							options.parentId = self.model.get('my139Id');
							
						self.createDir(function(result){
							if(result.responseData && result.responseData.code== 'S_OK'){							
								var directoryId = result.responseData['var'].directoryId;
								self.model.set('attachId',directoryId)	
								self.saveToDisk();
							}
	
						},options);
					}
					//console.log(self.model.directorys)
	                //self.model.setDirProperties(self.model.directorys);
	                //callback && callback();
				}else{
					self.logger.error("getfiles returndata error", "[disk:fileListPage]", result);
				}
				
			},directoryId)
			
		},
        //新建目录
        createDir: function (callback, options) {
            var self = this,options = options||{};
            self.model.callApi("disk:createDirectory", getData(), function (result) {
                callback && callback(result);
            });
            function getData(){
                if (!options.parentId) {
                    options.parentId = self.model.get("RootId");
                    options.dirType = '1';
                }
                return options;
            }
        },
       // 获取当前目录类型,提供给服务端的根目录type为1
        getDirTypeForServer: function(){
            var curDirType = this.get("curDirType");
            return curDirType == this.dirTypes.ROOT ? this.dirTypes.USER_DIR : curDirType;
        },
        saveToDisk : function(){
	        var self = this;
	        self.model.saveToDisk(function(response){
                if (response.responseData && response.responseData.code == "S_OK") {
						BH({key:'diskv2_cabinet_auto_savesuc'});                	
	                    var tipMsg = "存彩云网盘成功";
                    //if (This.options.comeFrom !== 'fileCenter' || top.Links !=="undefined") {// 文件提取中心是独立的页面，没办法打开彩云
                        //tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
					M139.UI.TipMessage.show(tipMsg,{delay : 5000}); 
                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
	            //        isHtml: true
	            //    });
                }else if(response.responseData.code == "-7"){
                	var html = response.responseData.summary;
	                //单文件超过大小
                    var vipInfo = top.UserData.vipInfo;
                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
                    }
	                top.FF.close();
	                top.$Msg.alert(html, {
	                    icon:"warn",
	                    isHtml: true
	                });
                }else if(response.responseData.code == "-4"){
                	var html = response.responseData.summary;
	                top.FF.close();
	                top.$Msg.alert(html, {
	                    icon:"warn",
	                    isHtml: true
	                });
                } else {
                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
                }
	        })
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
                        fileSize: top.M139.Text.Utils.getFileSizeText(file.size),
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
            this.controlScroll();
            this.bindCoperationEvent();
        },

        insertEle: function (elem) {
            var container = this.getContainer();

            container.prepend(elem);
            this.el.scrollTop = 0;
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
                currentItem = this.model.fileListEle[clientTaskno];

            currentItem.find(".attachment").html(this.md5LoadingTemplete);
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

            btnSwitchUploadEle.toggle(function(){//暂停
                var btn = $(this);

                btn.html("续传");
                /*if (btn.next().attr("class") == "btn-delete") {
                    btn.next().show();
                } else {
                    var deleteHtml = top.M139.Text.Utils.format(self.deleteBtnTemplete, {
                        fileId: currentFile.businessId,
                        fileOriginName: currentFile.name
                    });
                    btn.after(deleteHtml);
                }*/
                self.model.set("isStop", true);
                self.controler.onabort(clientTaskno);
            }, function(){//续传
                var btnTxtEle = $(this),
                    itemUploadEle = btnTxtEle.parents(".item-upload");

                btnTxtEle.html("暂停");
                self.model.set("isStop", false);
//                    .next().hide();

                //当前上传文件在上传队列中的索引
                var clientTaskno = itemUploadEle.attr("clientTaskno");

                self.controler.uploadHandle(function (options) {
                    self.error.call(self, options);
                }, null, clientTaskno);
            });
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

            currentItem.find("td[rel='uploadDate']").html(currentFile.fileInfo.createTime);
            currentItem.find("td[rel='maxSaveTime']").html(currentFile.fileInfo.remain);

            currentItem.find("input[type='checkbox']").attr({'fid': currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".nameContainer em").attr("fsize", currentFileSize)
                .attr("fid", currentFileBusinessId)
                .eq(0).html(self.model.getShortName(currentFileNameOrigin, 30))
                .next().attr("fname", currentFileName).attr("value", currentFileName);

            var successHtml = top.M139.Text.Utils.format(this.fileOperationTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            setTimeout(function(){
                currentItem.find(".attachment").html(successHtml);
				currentItem.find(".attchName").css("padding-top","6px");
            }, 1000);

            this.sucModelHandle();
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

            currentItem.find(".attachment").html(top.M139.Text.Utils.format(this.errUploadTemplete, {
                errInfo: currentFile.summary || "上传失败！"
            }));
            currentItem.find("input[type='checkbox']").attr("disabled", true);
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

            this.errModelHandle();
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
                currentItem = this.model.fileListEle[clientTaskno];

            currentItem.find(".progressBarWrap").html(this.md5LoadingTemplete);
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
            var currentFile = this.model.get("currentFile");//当前上传文件信息
            var clientTaskno = currentFile.clientTaskno;
            var currentItem = this.model.fileListEle[clientTaskno];
            var currentFileSize = currentFile.size;
            var currentFileNameOrigin = currentFile.name;
            var currentFileBusinessId = currentFile.businessId;
            var currentFileName = this.model.getFullName(currentFileNameOrigin);
            var progressTipEle = this.model.progressTipEle;

            currentItem.find(".state-upload").html("成功");
            currentItem.find(".progressBarWrap").remove();
            currentItem.find(".fileNameBar").after(top.M139.Text.Utils.format(this.fileSizeBar, {
                fileSize: top.M139.Text.Utils.getFileSizeText(currentFileSize)
            }));

            currentItem.find(".btn-switch-upload").hide();
            currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
            currentItem.find(".attachment").show();
            currentFile.thumbUrl && currentItem.find(".viewPic img").attr("src", currentFile.thumbUrl);

            currentItem.find("input[type='checkbox']").attr({"fid":currentFileBusinessId,'disabled':false});
            currentItem.find(".attchName").attr("title", currentFileNameOrigin);
            currentItem.find(".itemName em").text(currentFileName.substr(0,15));

            var successHtml = top.M139.Text.Utils.format(this.fileOperationIconTmplete, {
                businessId: currentFileBusinessId,
                fileNameOrigin: $T.Html.encode(currentFileNameOrigin)
            });

            currentItem.find(".viewIntroduce").append(successHtml);
            this.sucModelHandle();
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

            currentItem.find(".attachment").html(this.errUploadTemplete);
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
            this.errModelHandle();
        },

        //将上传失败文件的数据存储在fileList中
        errModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var businessId = currentFile.businessId;
            var newFile = currentFile.fileInfo;

            this.subModel.get("fileList").unshift(newFile);
            this.subModel.get("originalList").unshift(newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

        //将上传成功文件的数据存储在fileList中
        sucModelHandle: function(){
            var currentFile = this.model.get("currentFile");
            var newFile = currentFile.fileInfo;

            this.subModel.get("fileList").unshift(newFile);
            this.subModel.get("originalList").unshift(newFile);
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
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
        },

        //如果在列表底部上传文件，将滚动条移动到顶部
        controlScroll: function(){
            if (this.scrollSelector) {
                $(this.scrollSelector)[0].scrollTop = 0;
            }
        }
    }));
})(jQuery, Backbone, _, M139);
