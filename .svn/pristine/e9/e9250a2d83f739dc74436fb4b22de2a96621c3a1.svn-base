M139.namespace("M2012.Folder.View", {
    AddFolder: Backbone.View.extend({
        el: ".boxIframeMain",
        template: ['<fieldset class="boxIframeText">',
               '<legend class="hide">新建文件夹并移动到</legend>',
               '<ul class="form">',
                 '<li class="formLine">',
                   '<label class="label">文件夹名称：</label>',
                   '<div class="element">',
                     '<div class="mb_5">',
                       '<input id="tb_foldername" type="" value="" class="iText">',
                     '</div>',
                    '<div class="mb_5" id="div_filterContact">',
                       '<input type="checkbox" id="chk_filter" value="" class="mr_5">',
                       '<label for="chk_filter">收取指定联系人邮件到该文件夹</label>',
                       '<input type="text" class="iText" placeholder="如sample@139.com" id="tb_address" style="display:none">',
                     '</div><div id="contactSelector" style="display:none">您可以选择通讯录中的联系人</div>',
                   '</div>',
                 '</li>',
               '</ul>',
             '</fieldset>'].join(""),
        events: {

        },
        initialize: function (options) {
            var self = this;
            console.log(options)
            this.model = options.model;
            options.email = "";
            if (options.email) {
                this.email = options.email; //有初始的邮件地址
            }
            if (options.comefrom) { this.comefrom = options.comefrom; }
            if (options.mid) {
                this.midForMove = options.mid;
            }
        },
        createContactSelector: function () {
            var self = this;
            if (!this.contactSelector) { //保持单例
                this.contactSelector = new M2012.UI.Widget.Contacts.View({
                    container: document.getElementById("contactSelector"),
                    showCreateAddr: false,
                    showSelfAddr: false,
                    showAddGroup:false,
                    filter: "email"
                }).render().on("select", function (e) {
                    if (e.isGroup) { //添加整组
                        //alert(JSON.stringify(e.value));

                    } else {
						//要求可以添加多个
                        var email = $Email.getEmail(e.value);
						var emailhad = $("#tb_address").val();
						var emailAtLast = "";
						if(!emailhad){
							emailAtLast = email;
						}else if(emailhad && emailhad.indexOf(email) > -1){
							emailAtLast = emailhad;
						}else{
							emailAtLast = emailhad + ";" + email;
						}
                        $("#tb_address").val(emailAtLast);
                    }
                });


            }
            setTimeout(function () {
                self.dialog.setMiddle();
            }, 100);
        },
        render: function () {
            var self = this;
            this.dialog = $Msg.showHTML(this.template, function (e) { self.addFolder(e) }, {
                dialogTitle: "新建文件夹",
                buttons: ["确定", "取消"]

            });
            this.el = this.dialog.el;

            $(this.el).find("#chk_filter").click(function () {

                if ($(this).attr("checked")) {
                    $(self.el).find("#tb_address").show();
                    $(self.el).find("#contactSelector").show();
                    self.createContactSelector();
                } else {
                    $(self.el).find("#tb_address").hide();
                    $(self.el).find("#contactSelector").hide();
                    self.dialog.setMiddle();
                }

            });

            if (this.email) {
                $(this.el).find("#chk_filter").attr("checked", true);
                $(self.el).find("#tb_address").show().val(this.email);
            }
            if (this.comefrom == "autoFilter") {
                $(this.el).find("#div_filterContact").hide();
            }

        },
        addFolder: function (e) {
            var self = this;
            var from = null;
			//标签与文件夹，发件人可以添加多个！
			function isAllEmail(str){
				var tmpArr = str.split(";");
				for(var i =0, t=tmpArr.length; i< t; i++){
					if(!$Email.getEmail(tmpArr[i])){
						return false;
						break;
					}
				}
				return true;
			}
            if ($(this.el).find("#chk_filter").attr("checked")) {
                from = $(this.el).find("#tb_address").val();
            //    from = $Email.getEmail(from);
                if (from == "" || !isAllEmail(from)) {
                    $Msg.alert("邮箱地址不正确，邮箱地址如果为多个，请用分号隔开。");
                    e.cancel = true;
                    return;
                }
            }
            var folderName = $("#tb_foldername").val();
            //var checkResult = this.model.checkFolderName(folderName);
            if (this.model.checkFolderName(folderName)) { //检查合法性
                this.model.addFolder(folderName, from, function (info) {


                    if (self.midForMove) { //添加成功后转移邮件到该文件夹
                        $App.trigger("mailCommand", { command: "move", fid: info.fid, mids: self.midForMove });
                    }

                    $App.trigger("addFolderComplete", {
                        comefrom: self.comefrom,
                        info: info, name: folderName
                    });
                    BH("left_addFolder_ok");

                });
            } else {

               e.cancel = true;
            
            }
        }

    })
});

