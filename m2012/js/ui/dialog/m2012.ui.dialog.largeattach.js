/**
 * @fileOverview 定义大附件上传，flash上传对话框
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.LargeAttach";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Dialog.LargeAttach.prototype*/
    {
        /** 定义大附件上传，flash上传对话框
         *@constructs M2012.UI.Dialog.LargeAttach
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.type 对话框模式（send/upload/continueUpload),默认为send
         *@example
         */
        initialize: function (options) {
            this.options = (options || {});
            if (!this.options.type) {
                this.options.type = "send";
            }
            this.model = new M2012.UI.LargeAttach.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: namespace,
        /**构建dom函数*/
        render: function () {
            var This = this;
            var options = this.options;

            this.dialog = $Msg.showHTML('<div id="divUploadView"></div>', function (e) {
                This.onSendClick(e);
            }, function (e) {
                This.onCancelClick(e);
            }, {
                width: 500,
                height: 335,
                dialogTitle: this.options.dialogTitle || "超大附件",
                buttons:["确 定","取 消"],
                showMiniSize:true
            });

            this.dialog.setButtonDisable(0, true); //按钮置灰

            this.renderBottomTip();

            this.setElement(this.dialog.el);
            this.renderUploadView();
            this.initEvents();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *添加续传任务
         */
        addContinueUpload:function(fileInfo){
            this.uploadView.addContinueUpload(fileInfo);
        },

        /**
         *加载上传组件
         *@inner
         */
        renderUploadView: function () {
            var uploadDiv = this.$("#divUploadView")[0];
            if(M139.Browser.is.ie && M139.Plugin.FastUpload.checkControlSetup() > 0){
                this.uploadView = new M2012.UI.LargeAttach.FastUploadView({
                    container: uploadDiv,
                    model: this.model
                }).render();
            } else {
                this.uploadView = new M2012.UI.LargeAttach.FlashView({
                    container: uploadDiv,
                    model: this.model
                }).render();
            }
        },

        /**
         *绑定事件
         *@inner
         */
        initEvents: function (e) {
            var This = this;
            this.uploadView.on("uploadprogress", function (e) {
                console.log("uploadprogress:" + JSON.stringify(e));
                This.onProgress(e);
            }).on("uploaded", function (e) {
                console.log("uploaded:" + e.success);
                This.onUploaded(e);
                This.updateBottomTip();
            });

            This.model.on("change:status", function (model, status) {
                This.updateBottomTip();
            }).on("change:autoSend", function (model, autoSend) {
                This.$("#chkLargeAttachAutoSend")[0].checked = autoSend;
            }).on("change:uploading", function (model, uploading) {

            });;

            this.dialog.on("minisize", function (e) {
                This.onMiniSize();
            }).on("close", function (e) {
                if (e.event) {
                    This.onCancelClick(e);
                }
            }).on("remove", function () {
                //要销毁控件
                This.uploadView.remove();
            });


            this.$("#chkLargeAttachAutoSend").click(function () {
                This.model.set("autoSend", this.checked);
            });
        },

        /**
         *最小化
         *@inner
         */
        onMiniSize: function () {
            this.showUploadingTip();
            this.showMinisizeAnimation();
            this.model.set("minisize",true);
        },

        /**
         *上传进度变化
         *@inner
         */
        onProgress:function(e){
            var status = e.status;
            if (status.isUploading === false && status.fileTotal > 0) {
                this.onComplete();
            }else if(this.model.get("fileCount") == this.model.get("successCount")){
                this.onComplete();
            }
            //todo
        },

        /**
         *上传完成？
         *@inner
         */
        onComplete: function () {
            //传完以后，如果当前已经最小化（或者勾选了完成自动发送），则自动完成对话框选择
            if (this.model.get("autoSend") || this.model.get("minisize")) {
                this.doSelect();
            } else {
                this.updateBottomTip();
            }
        },

        //那颗发送按钮的几种状态
        ButtonText:{
            AutoSend: "传完后，自动发送",
            Complete: "完成",
            CancelAutoSend: "取消自动发送"
        },

        
        /**
         *左下角内容
         */
        renderBottomTip: function () {
            var html = ['<label for="chkLargeAttachAutoSend">',
            '<input disabled id="chkLargeAttachAutoSend" type="checkbox"> 传完后，自动发送',
            '</label><span class="ErrorTip"></span>'];
            this.dialog.setBottomTip(html.join(""));
            //如果只是上传，不显示传完自动发送
            if (this.options.type != "send") {
                this.dialog.$el.find("#chkLargeAttachAutoSend").parent().hide();
            }
        },

        /**
         *左下角复选框状态
         */
        updateBottomTip: function () {
            var errorTip = "";
            var fileCount = this.model.get("fileCount");
            var failCount = this.model.get("failCount");
            try {
                //可能对话框已移除，会报错
                $("#chkLargeAttachAutoSend")[0].disabled = fileCount == 0;
                this.dialog.setButtonDisable(0, fileCount == 0);
                if (failCount > 0) {
                    errorTip += '&nbsp;&nbsp;&nbsp;&nbsp;<strong class="c_ff6600">' + failCount + ' </strong>个文件上传失败</span>';
                }
                this.$(".ErrorTip").html(errorTip);
            } catch (e) { }
        },

        /**
         *完成文件选择操作
         *@inner
         */
        doSelect: function () {
            var This = this;
            var uploadControl = this.uploadView;
            var fileCount = this.model.get("fileCount");
            var successfiles = uploadControl.getUploadedFileList();
            var autoSend = this.model.get("autoSend");
            var unSuccessCount = fileCount - successfiles.length;
            if (autoSend) {
                if (unSuccessCount > 0) {
                    var msg = "文件未全部上传成功，确定要发送吗？"
                    $Msg.confirm(msg, function () {
                        ok();
                    }, {
                        icon: "warn"
                    });
                } else {
                    ok();
                }
            } else {
                if (this.options.type == "send") {
                    if (unSuccessCount > 0) {
                        var msg = "文件未全部上传成功，确定添加吗？"
                        $Msg.confirm(msg, function () {
                            ok();
                        }, {
                            icon: "warn"
                        });
                    } else {
                        ok();
                    }
                } else {
                    ok();
                }
            }
            function ok() {
                This.trigger("select", {
                    files: successfiles,
                    autoSend: autoSend
                });
                This.dialog.close();
                if (This.uploadingTip) {
                    This.uploadingTip.remove();
                }
            }
        },

        /**
         *设置按钮文本
         *@inner
         */
        setButtonText: function (text) {
            this.dialog.setButtonText(0,text);
        },

        /**
         *完成一个文件上传
         *@inner
         */
        onUploaded: function (e) {
            var model = this.model;
            if (e.success) {
                model.set("successCount", model.get("successCount") + 1);
                if (model.get("fileCount") == 0) {
                    //文件上传太快，没有触发进度变化就触发了文件完成
                    model.set("fileCount", model.get("successCount"));
                }
            } else {
                model.set("failCount", model.get("failCount") + 1);
                if (model.get("fileCount") == 0) {
                    //文件上传太快，没有触发进度变化就触发了文件完成
                    model.set("fileCount", model.get("failCount"));
                }
                model.set("autoSend", false);
            }
            
            if (model.get("fileCount") == model.get("successCount") + model.get("failCount")) {
                model.set("uploading", false);
                this.onComplete();
            }
        },

        /**
         *显示最小化的动画
         *@inner
         */
        showMinisizeAnimation: function () {
            var This = this;
            var offset = this.$el.offset();
            var obj = {
                top: offset.top,
                left: offset.left,
                height: this.$el.height(),
                width: this.$el.width()
            };
            var div = $('<div style="border:3px silver solid;position:absolute;z-index:9999"></div>').css(obj);
            var offset = This.uploadingTip.$el.offset();
            div.appendTo(document.body).animate({
                left: offset.left,
                top: offset.top,
                height: 20,
                width: 220
            }, 500, function () {
                div.remove()
            });
        },


        cancelMiniSize:function(){
            this.dialog.cancelMiniSize();
            this.uploadingTip.hide();
            this.onCancelMiniSize();
        },


        onCancelMiniSize:function(){
            this.model.set("minisize",false);
        },

        /**
         *显示上传中置顶提示
         *@inner
         */
        showUploadingTip: function () {
            var This = this;
            if (!this.uploadingTip) {
                this.uploadingTip = new UploadingTipView({
                    model: this.model,
                    type: this.options.type
                }).render();
                this.uploadingTip.on("click", function () {
                    This.cancelMiniSize();
                });
            }
            this.uploadingTip.show();
        },
        /**
         *点击确定按钮
         *@inner
         */
        onSendClick: function (e) {
            var files;
            var autoSend = this.model.get("autoSend");
            if (this.model.get("uploading")) {//上传中
                this.dialog.minisize();
            } else {
                //完成上传了
                this.doSelect();
            }
            e.cancel = true;//取消对话框关闭
        },
        /**
         *点击取消按钮
         *@inner
         */
        onCancelClick: function (e) {
            var This = this;
            var fileCount = this.model.get("fileCount");
            var successCount = this.model.get("successCount");
            if (this.model.get("uploading")) {
                e.cancel = true;
                $Msg.confirm("附件正在上传中，关闭后将终止，是否关闭窗口？", function () {
                    This.dialog.close();
                }, {
                    icon:"warn"
                });
            } else if (fileCount > 0) {
                if (successCount > 0) {
                    e.cancel = true;
                    //上传的文件已保存在暂存柜中，是否取消添加到写信？
                    $Msg.confirm("已上传完的文件将添加到暂存柜", function () {
                        This.dialog.close();
                    }, {
                        icon: "warn"
                    });
                }
            }
        },

        isUploading: function () {
            return !!this.model.get("uploading");
        }
    }));

    //最小化上传窗口后现实的置顶提示 todo public
    var UploadingTipView = superClass.extend({
        initialize: function (options) {
            this.model = options.model;

            this.setElement($(this.template));

            return superClass.prototype.initialize.apply(this, arguments);
        },
        events: {
            "click .CancelAutoSendButton": "onCancelAutoSendButtonClick",
            "click .OpenAutoSendButton": "onOpenAutoSendButtonClick",
            "click":"onClick"
        },
        render: function () {
            this.$el.appendTo(document.body);

            this.initEvent();

            this.updateHTML();

            return superClass.prototype.render.apply(this, arguments);
        },
        template:['<span style="position:absolute;z-index:1024;top:10px;left: 480px;" class="msg">',
            '<img style="display:none" class="mr_5" src="/m2012/images/global/loading_xs.gif">',
            '<i style="display:none" class="FailIcon" class="i_file_16 i_m_xlsx mr_5"></i>',
            '<span class="MsgLabel">超大附件</span>',
            '<span style="display:none" class="CancelTip"> | 已开启自动发送 <a class="CancelAutoSendButton" href="javascript:;">取消</a></span>',
            '<span style="display:none" class="OpenTip"> | 自动发送未开启 <a class="OpenAutoSendButton" href="javascript:;">开启</a></span>',
            '</span>'
        ].join(""),
        initEvent: function (options) {
            var This = this;
            this.model.on("change:status", function () {
                This.updateHTML();
            }).on("change:autoSend", function () {
                This.updateHTML();
            }).on("change:failCount", function () {
                This.updateHTML();
            }).on("change:uploading", function () {
                This.updateHTML();
            });
        },

        /**
         *点击tip后自动消失，外部可以捕获隐藏事件
         *@inne
         */
        onClick: function (e) {
            if (e.target.tagName != "A") {//排除点击取消自动发送
                this.trigger("click");
            }
        },

        /**
         *点击取消自动发送
         *@inne
         */
        onCancelAutoSendButtonClick:function(){
            this.model.set("autoSend", false);
        },

        /**
         *点击开启自动发送
         *@inne
         */
        onOpenAutoSendButtonClick:function(){
            this.model.set("autoSend", true);
        },

        /**
         *更新tip内容
         *@inner
         */
        updateHTML: function () {
            var s = this.model.get("status");
            var autoSend = this.model.get("autoSend");
            var failCount = this.model.get("failCount");
            var fileCount = this.model.get("fileCount");
            var uploading = this.model.get("uploading");
            var lblMsg = "大附件上传";
            var errMsg = "";

            if (!uploading) {
                this.$("img").hide();//上传完，隐藏菊花图标
                lblMsg = '超大附件';
            } else {
                this.$("img").show();
                lblMsg = "附件上传中";
            }
            if (failCount > 0) {
                this.$el.addClass("msgRed");//有上传失败，tip显示为红色
                if (s.isUploading) {
                    this.$(".FailIcon").hide();
                } else {
                    this.$(".FailIcon").show();//上传完，并且有文件失败，显示失败图标
                }
                if (failCount == 1 && fileCount == 1) {
                    //todo 截断保留扩展名
                    //M139.Text.Utils.getTextOverFlow(s.failFiles[0].fileName, 10, true)
                    errMsg = "文件上传失败";
                } else {
                    errMsg = failCount + "个上传失败";
                }
                s.isUploading ? (lblMsg += "|" + errMsg) : (lblMsg = errMsg);
            } else {
                this.$el.removeClass("msgRed");
            }
            if (failCount > 0) {
                this.$(".OpenTip,.CancelTip").hide();
            } else {
                if (autoSend) {
                    this.$(".CancelTip").show();
                    this.$(".OpenTip").hide();
                } else if (fileCount == 0) {
                    this.$(".CancelTip").hide();
                    this.$(".OpenTip").hide();
                }else{
                    this.$(".CancelTip").hide();
                    this.$(".OpenTip").show();
                }
            }
            this.$(".MsgLabel").html(lblMsg);
            //不是发送模式，不显示自动发送
            if (this.options.type != "send") {
                this.$(".CancelTip").hide();
                this.$(".OpenTip").hide();
            }
        }
    });

})(jQuery, _, M139);