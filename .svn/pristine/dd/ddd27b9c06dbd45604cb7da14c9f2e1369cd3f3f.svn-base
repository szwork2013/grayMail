M139.namespace("M2012.Disk.View", {// todo 类的用途，从model继承
	Command: Backbone.View.extend({
		el: "",
		initialize: function(options) {
            this.model = options.model;

            var self = this;
            top.$App.unbind("diskCommand")
                .on("diskCommand", function (args) {//监听其他模块发起的菜单命令
                self.doCommand(args.command, args);
            });
		},
        doCommand: function (command, args) {
            var self = this,
                model = self.model,
                dataSend = args.data,
                isLineCommand = args.isLineCommand,
                commands = model.commands;

            var isSelected = this.isSelected(dataSend);

            switch (command) {
                case commands.UPLOAD:
                    //alert("上传文件");
                    break;
                case commands.CREATE_DIR:
                    model.trigger("createDir", dataSend);
                    break;
                case commands.DOWNLOAD:
                    if (isSelected) {
                        model.trigger("download", dataSend);
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.PLAY:
                    if (isSelected) {
                        model.trigger("play");
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;    
                case commands.SHARE:
                    if (isSelected) {
                        model.trigger("share");
                        self.model.sendLogger({file : 'diskv2_sharefile', dir : 'diskv2_sharefolder'});
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.SEND_TO_MAIL:
                    self.commandSend(dataSend, self.model.sendTypes["MAIL"], isLineCommand);
                    break;
                case commands.SEND_TO_PHONE:
                    self.commandSend(dataSend, self.model.sendTypes["MOBILE"]);
                    break;
                case commands.REMOVE:
                    self.commandRemove(dataSend);
                    break;
				case commands.DRAG:
                    self.commandDragMove(dataSend);
                    break;
                case commands.SET_COVER:
                    if (isSelected) {
                        self.commandSetCover(dataSend);
                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.POSTCARD:
                    if (isSelected) {
                        self.commandPsotcard(dataSend);
                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.RENAME:
                    if (isSelected) {
                        model.trigger("renameDirAndFile", dataSend);
                        model.sendLogger({file : 'diskv2_renamefile', dir : 'diskv2_renamefolder'});
                    } else {
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
                case commands.DELETE:
                    if (isSelected){
                        self.commandDelete(dataSend, args.filename);
                        self.model.sendLogger({file : 'diskv2_deletefile', dir : 'diskv2_deletefolder'});

                    }else{
                        top.$Msg.alert(model.tipWords.NO_FILE);
                    }
                    break;
				case "open":
					var fileids = self.model.get("selectedDirAndFileIds");
					if(fileids.length != 1){
						return;
					}
					var folder = $("em[fileid='"+ fileids[0] +"']");
					if(folder.length == 0){
						folder = $("img[fileid='"+ fileids[0] +"']");
					}
					folder[0].click();
            }
        },
        commandDelete: function (data, filename) {
            var self = this;
            var model = self.model;
//            var selectedDirAndFileLen = model.getSelectedDirAndFileOverflowNames(filename).length;
//            var selectedDirAndFileNames = model.getSelectedDirAndFileOverflowNames(filename).join(",");
            var tipContent;
            var selectedDirAndFileLen = model.get('selectedDirAndFileIds').length;
            var selectedFidLen = model.get('selectedFids').length;
            var selectedDirLen = model.get('selectedDirIds').length;
            var extName = $T.Url.getFileExtName(filename);
            if(filename){
                if(extName){
                    tipContent = model.tipWords.DELETE_FILE.format(1);
                }else{
                    tipContent = model.tipWords.DELETE_DIR.format(1);
                }
            }else if(selectedFidLen>0 && selectedDirLen>0){
                tipContent = model.tipWords.DELETE_FILEANDDIR.format(selectedDirLen, selectedFidLen);
            }else if(selectedFidLen>0){
                tipContent = model.tipWords.DELETE_FILE.format(selectedFidLen);
            }else if(selectedDirLen>0){
                tipContent = model.tipWords.DELETE_DIR.format(selectedDirLen);
            }
            top.$Msg.confirm(tipContent, function(){
                model.trigger("deleteDirsAndFiles", data);

            }, function(){
                //cancel
            }, {
                buttons: ["是", "否"]
            });
        },
        commandSetCover : function(data){
            var self = this;
            self.model.trigger("setCover", data);
        },
        commandPsotcard : function(){
            var self = this,
                model = self.model;
            self.model.trigger("postCard"); 
        },
        // isLineCommand 代表是否直接点击列表中的发送链接
        commandSend: function (data, type, isLineCommand) {
            if (!this.isSelected(data) && !isLineCommand) {
                top.$Msg.alert(this.model.tipWords.NO_FILE);
            } else if (this.isSelectedDir(data)) {
                top.$Msg.alert(this.model.tipWords.CANT_SEND_FOLDER);
            } else {
                this.sendFiles(type, data);
            }
        },
		commandDragMove: function(dataSend){
			//拖拽移动
			function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
			console.log(getData());
		},
        commandRemove: function (dataSend) {
        	var self = this;
            var isSelected = this.isSelected(dataSend);
            var model = this.model;

            if (isSelected) {
                var moveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                    fileName: model.getSelectedDirAndFileNames().join(","),
                    data : getData(),
                    type : 'diskFileMove'
                });
                moveToDiskview.render().on("success", function () {
                    self.model.trigger('refresh', null);
                });
            } else {
                top.$Msg.alert(model.tipWords.NO_FILE);
            }

            function getData(){
                var data = {
                    fileIds: model.get("selectedFids").join(","),
                    directoryIds: model.get("selectedDirIds").join(","),
                    srcDirType: model.getDirTypeForServer()
                };
                return data;
            }
        },
        
        sendFiles: function (type, data) {
	        var model = this.model;
            var fileList = [];

			var requestData = {
				linkType: 0,
				encrypt: 0,
				pubType: 1,
				fileIds: ""
			};

            if (data) {
                var fids = data.fileIds;
                requestData.fileIds = data.fileIds.join(",");
                for (var i = 0, len = fids.length; i < len; i++) {
                    var fileItem = model.getFileById(fids[i]);
                    fileList.push(fileItem);
                }
            } else {
                fileList = model.getSelectedFiles();
                requestData.fileIds = _.pluck(fileList, "id").join(",");
            }

            if(model.get("isMcloud") == "0"){
            	model.gotoSendPage({fileList : fileList, type: type});
            } else {
	            model.popupCompose(fileList, requestData);
            }
        },

        //是否选择了目录或者文件
        isSelected: function (data) {
            var value;

            if (data) {
                value = data.fileIds || data.directoryIds ? true : false;
            } else {
                value = this.getSelectedFileId() || this.getSelectedDirId() ? true : false;
            }

            return value;
        },
        isSelectedDir: function (data) {
            var value;

            if (data) {
                value = data.directoryId ? true : false;
            } else {
                value = this.getSelectedDirId() ? true : false;
            }

            return value;
        },
        getSelectedFileId: function(){
            return this.model.get("selectedFids").join(",");
        },
        getSelectedDirId: function(){
            return this.model.get("selectedDirIds").join(",");
        },
        getFileAndDirIds: function(){
            var ids = this.model.get("selectedFids").concat(this.model.get("selectedDirIds"));

            return ids.join(",");
        }
	})
});
