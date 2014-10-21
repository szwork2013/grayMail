; (function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.LargeAttachUploadTips";
    M139.namespace(namespace, superClass.extend(
    {
        template: '<a style="right:100px; bottom:100px;" href="javascript:void(0)" class="addFileBtn"><span class="lbl_jindu">添加文件</span></a>',
        dialog: null,

        //计数,用于判断失败和成功的文件是否是最小化后才发生的
        errorCount: 0,
        completeCount: 0,

        events: {
            "click" : "onClick"
        },
        /**
         *@params {options}
         *@params {options.dialog} 超大附件上传对话框
        */
        initialize: function (options) {
            var $el = $(this.template).appendTo(document.body);
            this.setElement($el);
            this.dialog = options.dialog;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            this.startWatch();
            var self = this;
            this.dialog.on("cancelminisize", function () {
                self.hideUploadingIconInTab();
                self.remove();
            });
            return superClass.prototype.render.apply(this, arguments);
        },

        onClick: function(){
            this.cancelMiniSize();
        },

        cancelMiniSize: function(){
            this.dialog.cancelMiniSize();
        },

        getDialogUploadWinObj: function(){
            return this.dialog.$el.find("iframe").get(0).contentWindow;
        },
        renderProgress: function (files) {
            var completeCount = 0;
            var errorCount = 0;
            var isStop = false;
            if (files && files.length > 0) {
                var totalSize = 0;
                var okSize = 0;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    totalSize += file.size;
                    if (file.state == "complete") {
                        okSize += file.size;
                        completeCount++;
                    } else if (file.state == "progress") {
                        okSize += file.sendSize || 0;
                    } else if (file.state == 'error') {
                        errorCount++;
                    } else if (file.state == 'stop') {
                        isStop = true;
                        break;
                    }
                }

                if (!isStop) {
                    if (completeCount > this.completeCount || errorCount > this.errorCount) {
                        if(this.isCurrentTab()){
                            this.cancelMiniSize();
                            return;
                        }
                    }
                    if (completeCount + errorCount == files.length) {
                        //render 无上传状态
                    }else{
                        var progress = parseInt(okSize / totalSize * 100);
                        progress = Math.min(99, progress);//最多只能显示99%;
                        progress += "%";
                        this.$el.find('.lbl_jindu').html('上传中<br/>' + progress);
                        this.$el.addClass('enLoading');
                        this.showUploadingIconInTab();
                        return;
                    }
                }
            }
            if (isStop) {
                this.$el.find('.lbl_jindu').html('已暂停');
            } else {
                this.$el.find('.lbl_jindu').html('添加文件');
            }
            this.$el.removeClass('enLoading');
            this.hideUploadingIconInTab();
        },


        /**
         *用户是否在当前标签
         */
        isCurrentTab: function(){
            return top.$App.getCurrentTab().name == frameElement.id;
        },

        /**
         *如果正在上传, 切到其它标签, 写信页的页签上显示↑图标
         */
        showUploadingIconInTab: function () {
            //不是当前标签页才显示↑图标
            if (!this.isCurrentTab()) {
                top.$App.getView("tabpage").tab.setStateIcon(frameElement.id, "uploading");
            } else {
                this.hideUploadingIconInTab();
            }
        },

        hideUploadingIconInTab: function(){
            top.$App.getView("tabpage").tab.setStateIcon(frameElement.id, "hide");
        },

        /**
         *因为大附件上传本身设计的很挫,想从model从取到列表文件数据基本不可能, 所以从界面中取数据
         */
        getFileListFromView: function () {
            var win = this.getDialogUploadWinObj();
            var result = [];
            var items = win.$("#attachList .UploadItem");
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                result.push({
                    state: $(item).attr("data-status"),
                    size: $(item).attr("data-size") * 1,
                    sendSize: $(item).attr("data-sendSize") * 1
                });
            }
            return result;
        },

        startWatch: function () {
            var self = this;
            var files = this.getFileListFromView();
            for (var i = 0; i < files.length; i++) {
                if (files[i].state == "complete") {
                    this.completeCount++;
                } else if (files[i].state == "error") {
                    this.errorCount++;
                }
            }

            var timer = setInterval(function () {
                if (M139.Dom.isRemove(self.el)) {
                    clearInterval(timer);
                } else {
                    var files = self.getFileListFromView();
                    self.renderProgress(files);
                }
            }, 500);
        }
    }));
})(jQuery, _, M139);