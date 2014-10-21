(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Fileexpress.Success.View', superClass.extend(
    {
        el: "",
        initialize: function (options) {
            this.model = options.model;
            this.stati();            
            this.switchSend();
            this.autoSaveContacts();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);            
        },
		shengji : function(){
		    var url = "/m2012/html/set/feature_meal_guide/index.html?sid="+top.$App.getSid();
		    window.open(url);
		},
		showMailBox: function(){
			var url = "send.html?sid={0}".format(top.sid);
			location.href = url;
		},
		showCompose: function(){
			location.href = "cabinet.html?sid={0}".format(top.sid);
		},
        initEvents: function () {
            var self =this;
            $("#showMailBox").bind("click",function(){self.showMailBox();});
            $("#showCompose").bind("click",function(){self.showCompose();});
			
			if(top.$User.getServiceItem() == top.$User.getVipStr("20")){
				$("#shengji").hide();
				return;
			}
            $("#shengji").bind("click",function(){self.shengji();});
        },
        //填充文件大小和数量
        stati : function(){
            var info ="已发送{0}个文件，共{1}。"
            $("#stati").html(info.format(this.model.getNumOfFile(),this.model.getTotalFileSize()));
        },
        // 自动添加联系人[若为email，若为mobile...]
        autoSaveContacts: function () {
            var send = this.model.get("dataSource").send;
            if(send == "email"){
                var list = this.model.getListMailArray();
            }else{
                var list = this.model.getListMobileArray();
            }
            new M2012.UI.Widget.ContactsAutoSave({
                    container: document.getElementById("divSaveSendContacts"),
                    type: send,
                    list: list
            }).render();
        },
        //发短信提醒如果发送的为邮件
        tixingMail : function(email){
            var list = this.model.getListMailArray();
            var p ="<p style='padding-bottom: 5px;'>已发送给：</p>";
            for(var i=0;i<list.length;i++){
                p += "<p style='padding:5px 0 5px 15px'>"+list[i]+"&nbsp;&nbsp;<a style=\"display:\" href=\"javascript:sendSMS('"+list[i]+"');\">发送短信通知</a></p>";
            }
            sendSMS = function(email){
                if (top.$User.isChinaMobileUser()) {
                    if (top._lastSendFiles) {
                        var content = "你好,我给你的{0}发送了文件:\"{1}\",赶紧去收吧。".format(email, top._lastSendFiles.join("\",\""));
                    } else {
                        var content = "";
                    }
                    var current = top.$App.getCurrentTab().name;
                    top.Links.show("sms", "&content=" + window.escape(content));
                    top.$App.close(current);
                } else {
                    top.$User.checkAvaibleForMobile();
                }
            }
            $("#tixing").html(p);
        },
        //发短信提醒如果发送的为短信
        tixingMobile : function(){
            var list = this.model.getListMobileArray();
            var p ="<p style='padding-bottom: 5px;'>已发送给：</p>";
            for(var i=0;i<list.length;i++){
                p += "<p>"+list[i]+"</p>";
            }
            $("#tixing").html(p);
        },
        //上面两种方法的交换
        switchSend : function(){
            if(this.model.get("dataSource").send == "email"){
                this.tixingMail();
            }else{
                this.tixingMobile();
            }
        }
    }));
	var successModel = new M2012.FileExpress.Success.Model();
	var options ={model:successModel};
	new M2012.Fileexpress.Success.View(options);
})(jQuery, _, M139);

