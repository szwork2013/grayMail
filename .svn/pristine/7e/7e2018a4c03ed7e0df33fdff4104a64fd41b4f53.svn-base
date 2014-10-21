(function(jQuery, Backbone, _, M139) {
    var $ = jQuery;
	var superClass = M139.View.ViewBase;
    M139.namespace("M2012.UI.SelectFile.View.UploadFileList", superClass.extend(
    {
        el: "#attachList",

        templete: ['<div data-size="{realFileSize}" class="attaListLi item-upload UploadItem" clienttaskno="{clientTaskno}">',
					 	'<i class="i-file-smalIcion i-f-{expandName}" style="float: left;margin-left: 14px;margin-top: 4px;"></i>',
					 	'<div class="attaListLiText">',
							'<em class="attaListLi_box">',
								'<span class="attaListLi_info" title="{fileName}">{fileName}</span>',
								'<span class="attaListLi_pic"><span class="gray">.{expandName}</span><span class="gray">(0/{fileSize})</span></span>',
							'</em>',
					 	//	'<p>',
					 	//	        '{fileName}<span class="gray">.{expandName}</span><span class="item-file-size gray">(0/{fileSize})</span>',
					 	//	'</p>',
					 		'<div class="attachment1 loadTipsLeft">',
					 			'<span class="progressBarDiv"> <span class="progressBar"></span> <span class="progressBarCur"> <span style="width: 0;"></span> </span> </span> {ratioSend}',
					 		'</div>',
					 	'</div>',
					 	'<div class="attaListLiText2">',
					 		'<a class="btn-pause" href="javascript:void(0)">暂停</a>',
					 	'</div>',
					 '</div>'].join(""),
	
	    fileSizeLimitTmplete : [ '<div class="">',
								     '<i class="i_warn_min"></i>',
								     '<span class="red">文件超过100M，无法上传。</span><span class="gray" style="display: none;">使用139小工具，上传更大文件。</span>',
								 '</div>'].join(""),
	
	    errUploadTemplete : [ '<div class="">',
							     '<i class="i_warn_min"></i>',
							     '<span class="red">上传失败。</span><span class="gray" style="display: none;">使用139小工具，上传更大文件。</span>',
							 '</div>'].join(""),
		
	    progressBarTemplete : ['<span class="progressBarDiv">',
						            '<span class="progressBar"></span>',
						            '<span class="progressBarCur">',
						                '<span style="width: 0;"></span>',
						            '</span>',
						        '</span>',
						        '<span data-size="{realFileSize}" class="state-upload gray"> 等待中({fileSize})</span>'].join(""),

        stateUploadTemplete: '<span style="display: inline-block;width: 80px;">{speed}</span>&nbsp;&nbsp;{surplusTime}',

        md5LoadingTemplete : ['<img class="mr_5" style="vertical-align:middle;" src="../../images/global/load.gif">',
	        				 '<span class="gray">正在扫描本地文件</span>'].join(""),

        md5LoadingPercentTemplete: ['<img class="mt_5" src="../../images/global/load.gif">',
            '<span class="pt_5 gray">{md5Percent}正在扫描本地文件</span>'].join(""),

	    commandTemplate : '<a class="btn-{cssPath}" command="{command}" clienttaskno="{clientTaskno}" href="javascript:void(0)">{text}</a>',
	    
	    lineTemplate : '<span class="line">|</span>',
	    
	    commandTypes : {
	    	DELETE_FILE : 'deleteFile',
	    	PAUSE_UPLOAD : 'pauseUpload',
	    	CONTINUE_UPLOAD : 'continueUpload',
	    	SETUP_CONTROLER : 'setupControler'
	    },
	    
	    commands : {
	    	deleteFile : {cssPath : 'delete', command : 'deleteFile', text : '删除', clientTaskno : ''},
	    	pauseUpload : {cssPath : 'pause', command : 'pauseUpload', text : '暂停', clientTaskno : ''},
	    	continueUpload : {cssPath : 'continue', command : 'continueUpload', text : '续传', clientTaskno : ''},
	    	setupControler : {cssPath : 'setup', command : 'setupControler', text : '', clientTaskno : ''}
	    },		 
	
	    initialize: function(options){
	        this.controler = options.controler;
	        this.model = options.model;
	        this.selector = options.selector;
	        return superClass.prototype.initialize.apply(this, arguments);
	    },
	
	    render: function(options) {
	        this.initEvents();
	    },
	    
	    initEvents: function(){
	        var self = this;
	
	        //监听model层数据变化
	        this.model.on("renderList", function (options) {
	            self.renderList(options);
	        });
	        this.model.on("getFileMd5", function (options) {
	            self.getFileMd5(options);
	        });
	        this.model.on("loadstart", function (options) {
	            self.loadstart(options);
	        });
	        this.model.on("progress", function (options) {
	            self.progress(options);
	        });
            this.model.on("md5Progress", function (options) {
                self.md5Progress(options);
            });
	        this.model.on("complete", function (options) {
	            self.complete(options);
	        });
	        this.model.on("cancel", function (options) {
	            self.cancel(options);
	        });
	        this.model.on("error", function (options) {
	            self.error(options);
	        });
            this.model.on('autoSaveDisk',function(){
				self.isHasMy139(function(){
			        //var currentFile = self.model.get("currentFile");
					//console.log(currentFile)
				});
            })
	        self.bindCommandEvent();
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
        saveToDisk : function(){
	        var self = this;
	        //var tipMsg = "已后台保存，稍后查看";
			//top.M139.UI.TipMessage.show(tipMsg,{delay : 5000}); 
	        self.model.saveToDisk(function(response){
                if (response.responseData && response.responseData.code == "S_OK") {
						BH({key:'diskv2_cabinet_auto_savesuc'});                	
	                    
                    //if (This.options.comeFrom !== 'fileCenter' || top.Links !=="undefined") {// 文件提取中心是独立的页面，没办法打开彩云
                        //tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
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
	    // 事件委托绑定command事件
	    bindCommandEvent : function(){
	        var self = this;
	        var jContainer = self.getContainer();
	        jContainer.click(function(event) {
	            var target = event.target;
	            var tagName = target.tagName.toLowerCase();
	            var command = target.getAttribute('command');
	            if (tagName == "a" && command) {
	            	var clienttaskno = target.getAttribute('clienttaskno');
	                self.doCommand({
	                    command: command,
	                    clientTaskno: clienttaskno
	                });
	            }
	        });
	    },
	    
	    getContainer: function(){
	        return $(this.selector);
	    },
	    
	    doCommand : function(args){
	    	var self = this;
	    	var command = args.command;
	    	var clientTaskno = args.clientTaskno;
	    	var commandTypes = self.commandTypes;
	    	switch(command) {
	            case commandTypes['DELETE_FILE']:
	                self.deleteFile(clientTaskno);
	                break;
	            case commandTypes['PAUSE_UPLOAD']:
	                self.pauseUpload(clientTaskno);
	                break;
	            case commandTypes['CONTINUE_UPLOAD']:
	                self.continueUpload(clientTaskno);
	                break;
	            case commandTypes['SETUP_CONTROLER']:
	                self.setupControler();
	                break;
	            default : 
	            	console.log('系统不支持该命令！command:'+command);
	        }
	    },
	    deleteFile : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	    	currentItem.remove();
	    	
	    	// 将该文件从文件列表中删除 
	    	self.model.delFileUploadSuc(clientTaskno);
	    },
	    pauseUpload : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	    	var commandsHtml = self.getCommandsHtml([self.commandTypes['CONTINUE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
            self.model.set("isStop", true);
            self.controler.onabort(clientTaskno);

            currentItem.attr("data-status", "stop");
	    },
	    continueUpload : function(clientTaskno){
	    	var self = this;
	    	var currentItem = self.model.fileListEle[clientTaskno];
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
			self.controler.uploadHandle(self.errorHandle, null, clientTaskno);
	    },
	    setupControler : function(){
	    	top.Utils.openControlDownload();
	    },
	    renderList: function (options) {
	        var self = this;
	        var fileList = options.fileList;
	        var div = $("<div id=\"div_scrollcontainer\" style=\"overflow-x:hidden;overflow-y:auto;height:321px\"></div>");
	        for (var i = 0, len = fileList.length; i < len; i++) {
	            var file = fileList[i];

                if (file.state != 0) {
                    var $item = $(top.M139.Text.Utils.format(this.templete, {
                        fileName: $T.Html.encode(self.model.getFullName(file.name)),
                        expandName: self.model.getExtendName(file.name),
                        fileSize: top.M139.Text.Utils.getFileSizeText(file.size),
                        realFileSize: file.size,
                        clientTaskno: file.clientTaskno
                    }));

                    div.append($item);

                    this.model.fileListEle[file.clientTaskno] = $item; 
                    this.model.set("needUploadFileNum", this.model.get("needUploadFileNum") + 1);
                }
	        }
	        if ($("#div_scrollcontainer").length == 0) {
	            self.getContainer().append(div);
	        } else {
	            $("#div_scrollcontainer").append(div.children());
	        }
	        
            self.el.scrollTop = 0;
	    },
	
	    getFileMd5: function () {
	        var self = this,
	            currentFile = this.model.get("currentFile"),
	            clientTaskno = currentFile.clientTaskno,
	            currentItem = this.model.fileListEle[clientTaskno];
	
	        currentItem.find(".attachment1").html(this.md5LoadingTemplete);
	    },
	
	    loadstart: function () {
	        var self = this,
	            currentFile = this.model.get("currentFile"),
	            clientTaskno = currentFile.clientTaskno,
	            currentItem = this.model.fileListEle[clientTaskno];
	
	        var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
	            fileSize: top.M139.Text.Utils.getFileSizeText(currentFile.size),
	            realFileSize: currentFile.size
	        });
	        currentItem.find(".attachment1").html(progressBarHtml);
			
			var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
	    },
	
	    progress: function () {
	    	var self = this;
	    	
	    	var currentFile = this.model.get("currentFile");
	        var ratioSend = Math.round(currentFile.sendSize / currentFile.totalSize * 100) + "%";
	        var currentItem = this.model.fileListEle[currentFile.clientTaskno];
	        
	        var fileSizeStr = '(' + $T.Utils.getFileSizeText(currentFile.sendSize) + '/' + $T.Utils.getFileSizeText(currentFile.totalSize) + ')';
			currentItem.find(".item-file-size").html(fileSizeStr);
	        currentItem.find(".progressBarCur span").css({width: ratioSend});//上传进度显示
            currentItem.find(".state-upload").html(top.M139.Text.Utils.format(this.stateUploadTemplete, {
                speed: currentFile.speed,
                surplusTime: currentFile.surplusTime
            }));

	        if(!this.model.isShowPause){
	        	var commandsHtml = self.getCommandsHtml([self.commandTypes['PAUSE_UPLOAD']], currentFile.clientTaskno);
	        	currentItem.find(".attaListLiText2").html(commandsHtml);
	        	this.model.isShowPause = true;
	        }

	        currentItem.attr("data-status", "progress");
	        currentItem.attr("data-sendSize", currentFile.sendSize);
	    },

        md5Progress: function(){
            var currentFile = this.model.get("currentFile");
            var currentItem = this.model.fileListEle[currentFile.clientTaskno];

            currentItem.find(".attachment1").html(top.M139.Text.Utils.format(this.md5LoadingPercentTemplete, {
                md5Percent: currentFile.md5Percent
            }));

            currentItem.attr("data-status", "progress");
            currentItem.attr("data-sendSize", 0);
        },
	
	    complete: function () {
	    	var self = this;
	    	var currentFile = this.model.get("currentFile");//当前上传文件信息
	        var clientTaskno = currentFile.clientTaskno;
	        var currentItem = this.model.fileListEle[clientTaskno];
	        var currentFileSize = currentFile.size;
	        var currentFileNameOrigin = currentFile.name;
	        var currentFileBusinessId = currentFile.businessId;
	        var currentFileName = this.model.getFullName(currentFileNameOrigin);
	
			var fileSizeStr = '(' + $T.Utils.getFileSizeText(currentFileSize) + ')';
			currentItem.find(".item-file-size").html(fileSizeStr);
			
	        currentItem.find(".state-upload").html("成功");
	        currentItem.find(".progressBarCur span").css({"width": "100%"}); //单副本上传控件进度条显示
	        currentItem.find(".attachment1").show();
			var currentFileNameOriginArr = currentFileNameOrigin.split("."); currentFileNameOriginArr.pop();
			var currentFileNameOriginWithoutExt = currentFileNameOriginArr.join(".");
			currentItem.find(".attaListLi_info").html($T.Html.encode(currentFileNameOriginWithoutExt)).attr("title",currentFileNameOrigin);
			currentItem.find(".attaListLi_pic .gray").eq(1).text("("+top.M139.Text.Utils.getFileSizeText(currentFileSize)+")");
			var successHtml = '<span class="c_009900">上传成功</span>';
	        setTimeout(function(){
	            currentItem.find(".attachment1").html(successHtml);
	        }, 1000);
	        
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['DELETE_FILE']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);

	        this.completeModelHandle();

	        currentItem.attr("data-status", "complete");
	        currentItem.attr("data-size", currentFile.size);
	    },
	
	    cancel: function(){
	
	    },
	
	    error: function () {
	        var self = this;
	        var currentFile = this.model.get("currentFile");
	        var clientTaskno = currentFile.clientTaskno;
	        var controler = this.controler;
	        var currentItem = this.model.fileListEle[clientTaskno];
	        var progressBarHtml = top.M139.Text.Utils.format(this.progressBarTemplete, {
	            fileSize: top.M139.Text.Utils.getFileSizeText(currentFile)
	        });
	
	        currentItem.find(".attachment1").html(this.errUploadTemplete);
	        
	        var commandsHtml = self.getCommandsHtml([self.commandTypes['SETUP_CONTROLER'], self.commandTypes['DELETE_FILE']], clientTaskno);
	        currentItem.find(".attaListLiText2").html(commandsHtml);
	        
	        currentItem.find("a[name='againUpload']").click(function(){//重传
                $(this).parent().html(progressBarHtml);//插入进度条dom

                controler.uploadHandle(function(){
                    self.errorHandle(clientTaskno);
                });
            })
            .end().find("a[name='deleteEle']").click(function(){//删除文件
                currentItem.remove();
            });

	        this.completeModelHandle();

	        currentItem.attr("data-status", "error");
	    },

        completeModelHandle: function(){
            this.model.set("uploadedFileNum", this.model.get("uploadedFileNum") + 1);
        },

	    // 根据命令名称返回html片段
	    getCommandsHtml : function(commands, clientTaskno){
	    	if(!commands && !$.isArray(commands)){
	    		console.log('getCommandsHtml 参数必须为数组！commands :'+commands);
	    		return;
	    	}
	    	var self = this;
	    	var html = [];
	    	var len = commands.length;
	    	for(var i = 0;i < len;i++){
	    		var commandType = commands[i];
	    		self.commands[commandType].clientTaskno = clientTaskno;
	    		html.push($T.Utils.format(self.commandTemplate, self.commands[commandType]));
	    		if(i !== len - 1 && commandType != 'setupControler'){
	    			html.push(self.lineTemplate);
	    		}
	    	}
	    	return html.join('');
	    }
    }));
})(jQuery, Backbone, _, M139);