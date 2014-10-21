M139.namespace("M2012.Folder.View", {
    Unlock: Backbone.View.extend({
        el: ".boxIframeMain",
        template: ['<div class="mailunlock">',
 		  	'<p>该范围已设置安全锁，访问需要验证密码</p>',
 			'<div class="error" id="div_passError" style="display:none">安全锁密码有误</div>',
 			'<ul class="form">',
 				'<li class="formLine">',
 					'<label class="label">安全锁密码：</label>',
 					'<div class="element">',
 						'<input type="password" id="tb_password" value="" class="iText" style="width:180px;"> <a id="lock_forget" href="javascript:" class="ml_5">忘记密码</a>',
 					'</div>',
 				 '</li> ',
 			'</ul>		',
 		'</div>'].join(""),
        events: {

    },
    initialize: function (options) {
        var self = this;
        this.model = options.model;
        this.fid = options.fid;
        this.mid = options.mid;
    },
    render: function () {
        var self = this;
        var dialog = $Msg.showHTML(this.template, function () {
            return self.checkPassword();
        },
                {
                    name:"safeLock",
                    dialogTitle: "安全锁",
                    buttons: ["确定", "取消"]

                });
        if (dialog) {//避免多次点击的时候弹出多个框
            dialog.on("close", function (e) {

                var rel = 1;
                if (e.event) {
                    rel = $(e.event.target).attr("rel") || $(e.event.target).parents("[rel]").attr("rel");
                }
                if (rel == "0" && !self.model.get("passwordChecked")) { //点击确定，并且密码校验失败时，禁止关闭
                    e.cancel = true;
                }
            });
            this.dialog = dialog;
            this.el = dialog.el;
            $("#lock_forget").click(function () {
                top.appView.show('lockForget');
                self.dialog.close();
                return false;
            });
        }

        if (!$User.isChinaMobileUser()) {
            $("#lock_forget").hide();
        }

        /*
        $(this.el).find("#chk_filter").click(function () {
        $(self.el).find("#tb_address").show();
        });*/


    },
    checkPassword: function () {
        var self = this;
        //$App.getView("mailbox").model.set("folderPass", $("#tb_password").val());

        this.model.checkFolderPassword(self.fid, $("#tb_password").val(), function (result) {
            if (result) {
                self.model.set("passwordChecked", true);
                self.dialog.close();
                if (self.mid) { //刷新读信
                    $App.close();
                    setTimeout(function () {
                        $App.readMail(self.mid);
                    }, 200)
                } else {
                    $App.showMailbox(self.fid);
                }

            } else {
                $(self.el).find("#div_passError").show();
                $("#tb_password").focus(function () {
                    $(self.el).find("#div_passError").hide();
                });
            }
        });

        return false;


    }

})
});