upload_module_common = {
    init: function (model) {
        var btnAttach = document.getElementById("uploadInput");
        btnAttach.onchange = function () {
            var input = this;
            var fileName = input.value;
            if(!fileName)return;
            var form = document.forms["fromAttach"];
            if (utool.checkFileExist(fileName)) {
                top.$Msg.alert(ComposeMessages.ExistFileName);
                form.reset();
                return;
            }

            (function post() {
                form.action = utool.getControlUploadUrl();
                try {
                    form.submit();
                    utool.logUpload(UploadLogs.CommonStart);
                    form.reset();
                } catch (e) {
                    $("#frmAttachTarget").attr("src", "/blank.htm").one("load", function () {
                        form.submit();
                        utool.logUpload(UploadLogs.CommonStart);
                        form.reset();
                    });
                }
                upload_module_common.showUploading(fileName);
            })();
        };
        btnAttach.onclick = function () {
        	BH({key : "compose_commonattach"});
        	
            upload_module.model.requestComposeId();
            if (uploadManager.isUploading()) {
                top.$Msg.alert(ComposeMessages.PleaseUploadSoon);
                return false;
            }
        };
    },
    //不知道进度
    showUploading: function (fileName) {
        uploadManager.uploadFile({
            fileName: fileName,
            uploadType: "common"
        });
    }
}