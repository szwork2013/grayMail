/**
 * @fileOverview 定义文件快递（超大附件）模型
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;
    var namespace = "M2012.UI.LargeAttach.Model";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.LargeAttach.Model.prototype*/
    {
        /** 定义文件快递（超大附件）模型
         *@constructs M2012.UI.LargeAttach.Model
         *@extends M139.Model.ModelBase
         *@param {Object} options 初始化参数集
         *@example
         
         */
        initialize: function (options) {
			this.resetMaxUploadSize();
        },
        defaults:{
            uploading: false,
            failCount: 0,
            successCount: 0,
            fileCount:0,
            autoSend:false,
            status:null
        },
        getSid: function () {
            return top.$App.getSid();
        },
        MaxUploadSize: 1024 * 1024 * 1024,
        getUserNumber: function () {
            return top.$User.getUid();
        },
		resetMaxUploadSize: function(){
            //根据套餐显示超大附件最大上传文件大小
            if (top.SiteConfig.comboUpgrade) {
                this.MaxUploadSize = (top.$User.getCapacity("maxannexsize") || 4 * 1024) * 1024 * 1024;
            }
        },
        //todo flash调用请求上传地址URL，flash里使用的，要用完整路径
        serverPath:"http://" +  location.host +"/mw2/disk/disk",
        getFlashUploadUrl:function(name) {
            var url = M139.Text.Url.makeUrl(this.serverPath, {
                "func": "disk:fUploadCheck",
                "sid": this.getSid(),
                "rnd": Math.random()
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },
        //flash调用,上传到分布式存储url
        getPreUploadUrl: function (name) {
            var url = M139.Text.Url.makeUrl(this.serverPath, {
                "func": "disk:preUpload",
                "sid": this.getSid(),
                "rnd": Math.random()
            });
            return M139.HttpRouter.getNoProxyUrl(url);
        },
        /**
         *加载大附件上传相关程序
         */
        requireUpload: function (options,callback) {
            if (top.M2012.UI.Dialog.LargeAttach) {
                doCallback();
            } else {
                top.M139.UI.TipMessage.show("正在加载上传组件...");
                top.M139.core.utilCreateScriptTag({
                    src: "m2012.ui.largeattach.pack.js"
                }, function () {
                    top.M139.UI.TipMessage.hide();
                    doCallback();
                });
            }
            function doCallback() {
                if (window.largeAttachDialog) {
                    //已存在，取消最小化
                    window.largeAttachDialog.cancelMiniSize();
                } else {
                    if (top.largeAttachDialog) {
                        $Msg.alert("超大附件正在上传中，无法同时进行多个上传任务", {
                            icon: "warn"
                        });
                        return;
                    } else {
                        var view = top.largeAttachDialog = window.largeAttachDialog = new top.M2012.UI.Dialog.LargeAttach();
                        view.render();
                        view.dialog.on("remove", function () {
                            top.largeAttachDialog = window.largeAttachDialog = null;
                        });
                        callback(view);
                    }
                }
            }
        }
    }));
})(jQuery, _, M139);