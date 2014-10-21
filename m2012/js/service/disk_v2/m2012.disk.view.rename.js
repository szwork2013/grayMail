/**
 * @fileOverview 定义彩云文件重命名视图层.
 * @namespace
 * @describe 重命名包括了：列表视图中的重命名和缩略视图的重命名
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Rename', superClass.extend(
        /**
         *@lends M2012.Disk.View.Rename.prototype
         */
        {
            el:"body",
            name:"M2012.Disk.View.Rename",
            initialize:function (options) {
                this.model = options.model;
                return superClass.prototype.initialize.apply(this, arguments);
            },
            defaults : {
                isShowErrorTips : false
            },
            //渲染重命名视图
            render:function () {
                if (!this.model.get("listMode")) {//列表视图
                    this.fileListRenameRender();
                } else {//缩略图视图
                    this.fileThumbnailRenameRender();
                }
                this.bindEvent();

            },
            //列表模式，图标模式共用，响应重命名操作
            bindEvent: function(){
                var self = this;
                var inputTxtEle = $("#fileList input[type='text']:visible");
                inputTxtEle.bind("blur", function(e){
                    setTimeout(function(){
                        if($B.is.firefox && document.activeElement === inputTxtEle[0]){  //为兼容FF点击input时自动触发blur事件
                            return ;
                        }else{
                            if(!self.model.get("isShowErrorTips")){
                                self.renameHandle(inputTxtEle);
                            }
                        }

                    },100)
                });


                //重命名支持回车事件
                inputTxtEle.bind("keydown", enterHandle);
                $B.is.ie && $B.getVersion() == 6 && inputTxtEle.bind("keydown", enterHandle);

                function enterHandle (event) {
                    if (event.keyCode == M139.Event.KEYCODE.ENTER) {
                        var target = $(this);
                            self.renameHandle(target);
                    }
                }
            },
            renameHandle: function (target) {
                var self = this,
                    oldName = $.trim(target.attr('fname')),
                    newName = $.trim(target.val()),
                    listMode=self.model.get("listMode");
                if (oldName === newName) {
                    !listMode?self.hideRenameTable(target):self.hideThumbRename(target);
                    return;
                }
                var errorMsg = self.model.getErrorMsg(newName);

                if (errorMsg) {
                    self.model.set("isShowErrorTips", true);
                    top.$Msg.alert(errorMsg).on("close", function(args){
                        self.model.set("isShowErrorTips", false);
                        M139.Event.stopEvent(args.event);
                        setTimeout(function(){
                            target.focus();
                        }, 100);
                    });
                    return false;
//                    top.$Msg.alert(errorMsg);
//                    !listMode?self.hideRenameTable(target):self.hideThumbRename(target);
                } else {
                    var exName = $.trim(target.attr('exname'));// 拓展名
                    
                    var newFullName = newName + exName;
                    var options = {name: newFullName};

                    self.model.renameDirAndFile(function(result){
                        var responseData = result.responseData;

                        if (responseData && responseData.code == 'S_OK') {
                            top.M139.UI.TipMessage.show(self.model.tipWords.RENAME_SUC, {delay : 1000});
                            !listMode?setListRenameAbout(target):setThumbRenameAbout(target);
                            !listMode?self.hideRenameTable(target, newName):self.hideThumbRename(target, newName);
                        //    self.model.trigger("refresh");
                        } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                            self.model.confirmMcloudUpgrade();
                        } else {
                            var tipMsg = responseData && responseData.summary || self.model.tipWords.RENAME_ERR;
                            top.M139.UI.TipMessage.show(tipMsg, {delay : 1000});
                        //    self.model.trigger("refresh", null);
                            self.logger.error("renameFiles returnData error", "[disk:renameFiles]", result);
                        }
                    }, options);

                    function setListRenameAbout(target){
                        var selectedTrEle = target.parents("tr");
                        target.attr("fname", newFullName);
                        selectedTrEle.find("a[name=delete]").attr("fname", newFullName);
                        selectedTrEle.find(".attchName").attr("title", newFullName);
                    };

                    function setThumbRenameAbout(target){
                        var selectedLiEle = target.parents("li");
                        target.attr("fname", newFullName);
                        selectedLiEle.find("a[name=delete]").attr("fname", newFullName);
                        selectedLiEle.find(".viewPic img").attr("title", newFullName);
                    };
                }
            },
            fileListRenameRender:function () {
                var self = this;
                var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];

                $("#fileList input[type='checkbox']").each(function (i) {
                    var fid = $(this).attr('fileid');
                    if (selectedDirAndFileId == fid) {
                        var nameContainer = $(this).parents('tr').find('span[name="nameContainer"]');
                        nameContainer.find('em:eq(0)').hide();
                        //防止不合法重命名后再次重命名input表单显示的是不合法文件名的文本
                        //var oldname = nameContainer.find('em:eq(0)').html();
                        var fileObj = self.model.getFileById(fid); // update by tkh html()方法会对文件名进行编码
                        var oldname = self.model.getFileName(fileObj.name);
                        nameContainer.find('input').attr('value', oldname).show().focus().select();
                        return;
                    }
                });
            },
            fileThumbnailRenameRender:function () {
                var self = this;
                var selectedDirAndFileId = self.model.get('selectedDirAndFileIds')[0];
                $("#fileList input[type='checkbox']").each(function(i){
                    var fid = $(this).attr('fileid');
                    if(selectedDirAndFileId == fid){
                        var nameContainer = $(this).parents("li").find('span[name="nameContainer"]');
                        //防止不合法重命名后再次重命名input表单显示的是不合法文件名的文本
                        //var oldname = nameContainer.find("em").find('a').html();
                        var fileObj = self.model.getFileById(fid); // update by tkh html()方法会对文件名进行编码
                        var oldname = self.model.getFileName(fileObj.name);
                        nameContainer.find("a").hide().next("input").attr('value', oldname).show().select();
                        return;
                    }
                });
            },
            // 隐藏重命名input
            hideRenameTable : function(target, newName){
                var cutedName = this.model.getSelectedDirAndFileOverflowNames(newName);//注意该方法返回的是一个数组
                newName && target.prev("em").html(cutedName[0]);
                target.siblings('em').show();
                target.hide();
            },
            hideThumbRename : function(target, newName){
                var cutedName = this.model.getSelectedDirAndFileOverflowNames(newName);//注意该方法返回的是一个数组
                newName && target.prev("a").html(cutedName[0]);
                target.prev("a").show();
                target.hide();
            }

        }
    ));
})(jQuery, _, M139);
