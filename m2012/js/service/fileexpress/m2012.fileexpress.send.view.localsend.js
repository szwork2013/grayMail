/*
 * 右键发送文件，在exe环境中运行的view
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.FileExpress.Send.View.LocalSend', superClass.extend({
        el: "body",
        template: "",
        events: {},
        name: 'M2012.FileExpress.Send.View.LocalSend',
        files: [],
        initialize: function (options) {
            var self = this;
            self.model = options.model;
            self.parent = options.parent;
            self.initEvents();

            superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents: function () {
            var self = this;

            this.bindExternalCallback();
        },
        // quickShare.exe控件回调js的接口
        bindExternalCallback: function(){
            var self = this;

            window.Request = function (xml) {
                debugger;
                if (!xml) return;
                var doc = self.model.getXmlDoc(xml);
                var commandId = doc.documentElement.getAttribute("id");
                switch (commandId) {
                    case "addfile":
                    {
                        var fileNodes = doc.getElementsByTagName("file");
                        var urlNodes = doc.getElementsByTagName("url");
                        var sendType = doc.getElementsByTagName("to");
                        /*if (sendType[0]) {
                            sendType = sendType[0].text;
                            if (sendType == "mail" && sharingSend.sendMode != "email") {
                                sharingSend.action.switchEmailSend();
                            } else if (sendType == "mobile" && sharingSend.sendMode != "mobile") {
                                sharingSend.action.switchMobileSend();
                            }
                        }*/
                        if (fileNodes.length == 0 && urlNodes.length == 0) return;
                        var files = [];
                        $(fileNodes).each(function() {
                            var f = {
                                filePath: this.text,
                                fileSize: parseInt(this.getAttribute("size")),
                                fileType: "local"
                            };
                            files.push(f);
                        });
                        $(urlNodes).each(function() {
                            var f = {
                                filePath: this.text,
                                fileSize: 0,
                                isUrl: true,
                                fileName: this.text,
                                fileType: "url",
                                state: "success"
                            };
                            files.push(f);
                        });
                        if (/*files.length + fm.getFiles().length > 10*/0) {
                            alert("一次最多只能发送10个文件，请调整后重试。");
                        } else {
                            // 调用控件上传

                            sharingUpload.action.openDialog(10, files);
                            if (!fm.isUploading()) {
                                sharingUpload.action.uploadFile();
                            }
                        }
                        break;
                    }
                    case "newfilemsg":
                    {
                        /*if (window.location.href.indexOf("send.htm") == -1) {
                            window.location.href = "send.htm";
                        }*/
                        break;
                    }
                }

                return "";
            }
        },
        render: function () {
            var self = this;

            if (window.FolderInfo && window.FolderInfo.flag != undefined) {
                top.showQuicklyShareMobileLimitTip = (window.FolderInfo.flag == 0);
                var request = '<command id="savestring"><stringid>showQuicklyShareMobileLimitTip</stringid><string>{0}</string></command>'.format(window.FolderInfo.flag == 0);
                self.model.tryCatch(function() {
                    external.Request(request);
                });
            }

            //改变窗体大小
            external.Request('<command id="changewndsize"><page>pagename</page><cx>750</cx><cy>500</cy></command>');

            this.initFileList();

            // 打开上传窗口
            this.parent.selectFile();
        },
        initFileList: function(){
            var self = this;
            var xmlCmd = '<command id="tellpagestatus"><page>WAIT_SEND_PAGE</page><status>success</status></command>';

            self.model.tryCatch(function() {
                window.external.Request(xmlCmd);
            });
        }
    }));
})(jQuery, _, M139);

