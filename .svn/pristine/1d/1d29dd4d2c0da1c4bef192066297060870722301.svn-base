/**
 * @fileOverview 定义彩云文件创建文件夹视图层.
 * @namespace
 * @describe 重命名包括了：列表视图中的创建文件夹和缩略视图的创建文件夹
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.CreateDir', superClass.extend(
        /**
         *@lends M2012.Disk.View.CreateDir.prototype
         */
        {
            el: "body",
            name: "M2012.Disk.View.CreateDir",
            initialize: function (options) {
                this.model = options.model;
                return superClass.prototype.initialize.apply(this, arguments);
            },
            templateItem: [
                '<tr>',
                    '<td class="wh1 t-check"><input fileid="" filetype="" type="checkbox"></td>',
                    '<td>',
                        '<p class="attchName" title="新建文件夹" style="cursor:pointer;">',
                            '<i class="i-file-smalIcion i-f-sys"></i>',
                            '<span name="nameContainer">',
                                '<em fileid="" fsize="" filetype="" name="fname" style="display:none;"></em>',
                                '<input type="text" fname="" exname="" value="新建文件夹" maxlength="255" size="30"></input>',
                                '<em fileid="" fsize="" filetype="" name="fname"></em>',
                            '</span>',
                        //    '<a href="javascript:;" class="btnMinOK ml_5" title="确定"></a>',
                        //    '<a href="javascript:;" class="btnMincancel ml_5" title="取消" name="btnMincancel"></a>',
                        '</p>',
                    //    '<div class="attachment" style="display:none;">',
                    //    '<a href="javascript:void(0)" name="download" fileid="">下载</a> <span> | </span> ',
                    //    '<a href="javascript:void(0)" name="share" fileid="">共享</a> <span> | </span> ',
                    //    '<a href="javascript:void(0)" name="delete" fileid="" fname=""> 删除</a>',
                    //    '</div>',
                    '</td>',
                    '<td class="uploadTime wh3 gray"></td>',
                    '<td class="wh6 gray"></td>',
                '</tr>'
            ].join(""),

            templateThumb:[
                '<li class="listItem">',
                    '<p class="chackPbar"><input fileid="" filetype="" type="checkbox" class="checkView" style="display:none;"/></p>',
                    '<a href="javascript:;" class="viewPic"><img filetype=""  fileid="" fsize="" name="fname" title="" src="../../images/module/FileExtract/norSys.png"></a>',
                    '<div class="AddrGroupContainer">',
                        '<input id="AddContacts_GroupName" value="新建文件夹" maxlength="255" size="30" type="text" class="iText mr_5" value="" style="width: 80px;">',
                    //    '<a href="javascript:;" class="btnMinOK mr_5" title="确定"></a>',
                    //    '<a href="javascript:;" class="btnMincancel" title="取消" name="btnMincancel"></a>',
                    '</div>',
                    '<div class="viewIntroduce" style="display:none;">',
                    '<p title="" style="height:24px; line-height: 24px; overflow: hidden;">',
                        '<span class="itemName" name="nameContainer">',
                            '<em><a fileid="" filetype="" fsize="" href="javascript:void(0)" name="fname"></a></em>',
                            '<input type="text" filetype="" filerefid="" fname="" exname="" value="" maxlength="50" size="30" style="display:none;"></input>',
                        '</span>',
                        '<span fileid="" fsize="" filetype="" name="fname" style="cursor:pointer"></span>',
                    '</p>',
                    '<p class="gray">0KB</p>',
                //    '<p style="display:none;">',
                //        '<a href="javascript:void(0)" name="download">下载</a><span class="line">|</span>',
                //        '<a href="javascript:void(0)" name="share" fileid="">共享</a><span class="line"> | </span>',
                //        '<a href="javascript:void(0)" name="send" fileid="">发送</a><span class="line"> | </span>',
                //        '<a href="javascript:void(0)" name="delete" fname="">删除</a>',
                //    '</p>',
                    '</div>',
                '</li>'
            ].join(""),
            defaults : {
                isShowErrorTips : false
            },

            //渲染重命名视图
            render : function () {
                if (!this.model.get("listMode")) {//列表视图
                    this.fileListCreateDirRender();
                } else {//缩略图视图
                    this.fileThumbnailCreateDirRender();
                }
            },

            //列表视图创建新文件夹
            fileListCreateDirRender: function(){
                var self = this,
                    model = self.model,
                    curPageIndex = model.get('pageIndex'),
                    curDirType = model.get("curDirType"),
                    fileItemPar = $("#fileList tbody"),
                    fileListItem =  fileItemPar.find('tr'),
                    isNoFile = self.isNoFile(fileItemPar),
                    itemAppend = $(this.templateItem),
                    inputTxtEle = itemAppend.find("input[type=text]");
                    isNoFile && fileListItem.remove();

                if (curDirType == model.dirTypes.ROOT && curPageIndex==1) {//根目录下在"我的音乐"目录后添加目录
                    var sysDirListNum = model.get("sysDirList").length;
                //    fileListItem.eq(sysDirListNum - 1).after(itemAppend);
					fileListItem.eq(1).after(itemAppend);
                } else {
                    isNoFile?fileItemPar.append(itemAppend):fileListItem.eq(0).before(itemAppend);
                }
                inputTxtEle.select();
                this.bindCreateDirEvent(itemAppend);
            },

            //缩略视图创建新文件夹
            fileThumbnailCreateDirRender: function(){
                var self = this,
                    model = self.model,
                    curPageIndex = model.get('pageIndex'),
                    listMode = model.get("listMode"),
                    curDirType = model.get("curDirType"),
                    fileItemPar = $("#fileList ul"),
                    fileThumbItem = fileItemPar.find('li'),
                    itemAppend = $(this.templateThumb),
                    folderIcon = itemAppend.find("img"),
                    inputTxtEle = itemAppend.find("input[type=text]"),
                    isNoFile = self.isNoFile(fileItemPar),
                    imagePath= model.getIconByType(curDirType);
                    isNoFile && fileThumbItem.remove();

                    if (curDirType == model.dirTypes.ROOT && curPageIndex==1) {//根目录下在"我的音乐"目录后添加目录
                        fileThumbItem.eq(1).after(itemAppend);
                    }else{
                        folderIcon.attr("src", imagePath);
                        isNoFile?fileItemPar.append(itemAppend):fileThumbItem.eq(0).before(itemAppend);
                    }
                    inputTxtEle.select();
                    this.bindCreateDirEvent(itemAppend);
            },

            bindCreateDirEvent: function (elemAdd) {
                var self = this;
                var inputTxtEle = elemAdd.find("input[type=text]:visible");
                /*var fn;
                fn = window.$GlobalEvent.on("click", function(args){
                    var target = $(args.event.target);
                    if(target.hasClass('btnMincancel')){
                        elemAdd.remove();
                        window.$GlobalEvent.off("click", fn);
                        return false;
                    } else if (inputTxtEle[0] === target[0]) {
                        return;
                    } else if(!self.model.get("isShowErrorTips")) {
                        if(self.createDirHandle(elemAdd)){
                            self.model.get('listMode') && self.createDirMouseHover(elemAdd);
                            window.$GlobalEvent.off("click", fn);
                            return false;
                        }

                    }
                });*/

                inputTxtEle.bind("blur", function(e){
                    setTimeout(function(){
                        if (elemAdd) {
							var newDirName = $.trim(elemAdd.find("input[type=text]").val());
							//失焦点取消
							if(newDirName == ""){
								elemAdd.remove();
								elemAdd = null;
							}
                            self.createDirHandle(elemAdd);
                            self.createDirMouseHover(elemAdd);
                        }
                    }, 500);
                });

                //新建文件夹命名支持回车事件
                inputTxtEle.bind('keydown', enterHandle);
                $B.is.ie && $B.getVersion() == 6 && inputTxtEle.bind('keypress', enterHandle);

                function enterHandle (event) {
                    if(event.keyCode == M139.Event.KEYCODE.ENTER){
						var newDirName = $.trim(elemAdd.find("input[type=text]").val());
						//回车闪烁
						if(newDirName == ""){
							M139.Dom.flashElement(inputTxtEle);
							return;
						}
                        self.createDirHandle(elemAdd);
                        self.createDirMouseHover(elemAdd);
                        $(this).unbind("blur");
                    }
                }

                elemAdd.find(".btnMincancel").click(function(){
                    elemAdd.remove();
                    elemAdd = null;
                })
            },

            createDirHandle: function (elemAdd) {
                var self = this,
                    model = self.model,
                    listMode = model.get("listMode"),
                    inputTxtEle = elemAdd.find("input[type=text]"),
                    inputCheckEle = elemAdd.find("input[type=checkbox]"),
                    newDirName = $.trim(inputTxtEle.val()),
                    errorMsg = model.getErrorMsg(newDirName);
                if (errorMsg) {
                    model.set("isShowErrorTips", true);
                    top.$Msg.alert(errorMsg).on("close", function(args){
                        model.set("isShowErrorTips", false);
                        M139.Event.stopEvent(args.event);
                        setTimeout(function(){//解决ie中会失去焦点，导致重复提示
                            inputTxtEle.focus();
                        }, 100);
                    });
                    return false;
                }

                var options = {name: newDirName};

                self.model.createDir(function (result) {
                    var responseData = result.responseData;
                    var error = responseData.summary;
                    if (responseData && responseData.code == "S_OK") {
                        var data = responseData["var"],
                            directoryId = data.directoryId,
                            createDirType = model.getDirTypeForServer(),
                            listMode = model.get('listMode'),
                            fileList = model.get("fileList");
                            model.trigger("refresh");
                        !listMode?setListCreateDir():setThumbCreatDir();
                        top.M139.UI.TipMessage.show(self.model.tipWords.CREATE_DIR_SUC, {delay: 1000});
                    } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                        self.model.confirmMcloudUpgrade();
                    } else {
                        self.logger.error("createDir returnData error", "[disk:createDirectory]", result);
                        self.model.trigger("refresh", null);//新建目录失败需要刷新列表
                        top.M139.UI.TipMessage.show(error, {delay: 1000});
                    }

                    //处理刷新完界面后显示当前模式的图标总是刷新为了列表模式
                    function setListCreateDir(){
                        inputTxtEle.prev().attr({"filetype": createDirType, "fileid":directoryId});
                        inputCheckEle.attr({"filetype":createDirType, "fileid":directoryId});
                        var nameContainer = elemAdd.find(".nameContainer");
                        nameContainer.find("em").attr("filetype", createDirType);
                        var attachEle = elemAdd.find(".attachment");
                        elemAdd.find(".uploadTime").html(data.createTime);
                        attachEle.find("a").attr("fileid", directoryId);
                        attachEle.find("a[name=delete]").attr("fname", newDirName);
                        elemAdd.find(".attchName").attr("title", newDirName);
                        self.hideRenameTable(inputTxtEle, newDirName);
                        self.styleOperateBtn(elemAdd);
                    };

                    function setThumbCreatDir(){
                        inputTxtEle.attr("fileid", directoryId);
                        inputCheckEle.attr({"fileid":directoryId, "filetype":createDirType});
                        var viewIntroduce = elemAdd.find(".viewIntroduce");
                        var titleP = viewIntroduce.find("p:eq(0)");
                        var thumbImg = elemAdd.find(".viewPic img");
                        titleP.attr("title", newDirName);
                        titleP.find("a").attr({"fileid":directoryId, "filetype":createDirType}).html(newDirName);   //文件名称
                        titleP.find("input").attr({"fileid":directoryId, "filetype":createDirType, "value": newDirName}); //重命名输入框
                        titleP.find("span:eq(1)").attr({"fileid":directoryId, "filetype":createDirType}); //文件扩展名
                        thumbImg.attr({"title": newDirName, "fileid":directoryId, "filetype":createDirType});
                        viewIntroduce.find("p:eq(1)").html("");     //文件夹无需显示大小
                        var operationP = viewIntroduce.find("p:eq(2)");
                        operationP.find("a").attr("fileid", directoryId);
                        operationP.find("a[name=delete]").attr("fname", newDirName);
                        elemAdd.find(".AddrGroupContainer").remove();   //移出新建文件夹标签
                        viewIntroduce.show();
                    };
                }, options);
                return true;
            },

            //隐藏重命名input
            hideRenameTable : function(target, newName){
                newName && target.prev("em").html(newName);
                target.siblings('em').show();
                target.hide();
            },

            //隐藏新建文件夹确认和取消按钮
            styleOperateBtn: function (target) {
                target.find(".btnMinOK").hide();
                target.find(".btnMincancel").hide();
                target.find(".attachment").show();
            },
            //新创建文件夹添加鼠标移入移出事件
            createDirMouseHover : function(elemAdd){
                var self = this;
                elemAdd .hover(function(){
                var target=$(this);
                target.addClass("listViewHover");
                target.find(".chackPbar input").show();
                self.showOperatesTable(target);
            },function(){
                var target=$(this);
                var isSelected=target.find(".chackPbar input").attr("checked");
                if(isSelected){
                    return;
                }else{
                    target.removeClass('listViewHover listViewChecked');
                    target.find("p.chackPbar").find('input').hide();
                    self.showSizeTable(target);
                }

                });
            },
            // 显示操作栏段落
            showOperatesTable : function(target){
                var jIntr = target.find('div.viewIntroduce');
                jIntr.find('p:eq(1)').hide();
                jIntr.find('p:eq(2)').show().find("a:eq(2)").hide().prev("span").hide();    //隐藏"发送"操作
            },
            // 显示文件大小段落
            showSizeTable : function(target){
                var jIntr = target.find('div.viewIntroduce');
                jIntr.find('p:eq(1)').show();
                jIntr.find('p:eq(2)').hide();
            },
            //判断该目录下是否有子目录或文件，根据判断结果来决定是否移出“暂无文件”item
            isNoFile : function (fileItemPar){
                var isNoFile = false;
                if(fileItemPar.hasClass("dir_no_file") || fileItemPar.children().length == 0){
                    isNoFile = true;
                    fileItemPar.removeClass('dir_no_file');
                    return isNoFile;
                }
                return isNoFile;
                }
            }
    ));
})(jQuery, _, M139);
