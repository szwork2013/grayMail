﻿(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.FileExpress.Send.View.Main', superClass.extend(
		{
			el: "body",
			template: "",
			events: {
				"click #selectFile" : "selectFile"
			},
			initialize: function (options) {
				var self = this;
				self.model = options.model;
				this.initEvents();
				this.switchSendType();
				self.model.on("change:sendType", function () {
					self.switchSendType();
				});

                // 右键发送文件打开文件快递页面
                if (this.model.isLocal()) {
                    // 由于取不到顶层top.$User，暂时配置
                    top.$User = {
                        getMaxSend: function(){
                            return 50;
                        }
                    };

                    M139.core.utilCreateScriptTag({
                        id: "localSend",
                        src: "/m2012/js/service/fileexpress/m2012.fileexpress.send.view.sendmail.js",
                        charset: "utf-8"
                    }, function(){
                        self.localSendView = new M2012.FileExpress.Send.View.LocalSend({model: self.model, parent: self});
                        self.localSendView.render();
                    });
                }

				return superClass.prototype.initialize.apply(this, arguments);
			},
			//点击切换sendtype类型
			initEvents: function () {
				var self = this;
				$("#btn_sendmail").click(function () {
					self.model.set("sendType", "mail");
				});
				$("#btn_sendmobile").click(function () {
					self.model.set("sendType", "mobile");
				});
			},
			//显示开关
			switchSendType: function () {
				var sendType = this.model.get("sendType");
				if (sendType == "mail") {
					this.emailShow();
				} else if (sendType == "mobile") {
					this.mobileShow();
				}
			},
			//显示发送到手机
			emailShow: function () {
				$("#btn_sendmobile").parent().removeClass();
				$("#btn_sendmail").parent().addClass("on");
				$("#sendToMail").attr("class", "tabContent show");
				$("#sendToMobile").attr("class", "tabContent");
			},
			//显示发送到手机
			mobileShow: function () {
				$("#btn_sendmobile").parent().addClass("on");
				$("#btn_sendmail").parent().removeClass();
				$("#sendToMail").attr("class", "tabContent");
				$("#sendToMobile").attr("class", "tabContent show");
			},
			// add by tkh 选择文件弹出层
			selectFile : function(event){
				var self = this;
				var selectFileDialog = top.$Msg.open({
		            dialogTitle : "选择文件",
		            url : "selectfile/selectfile.html?sid="+top.sid,
		            width : 499,
		            height : 'auto'
		        });
		        top.$App.on('rebuildSelectFileDialog', function(obj){ // 选择文件弹窗根据页面内容调整高度
	            	selectFileDialog.jContainer.find('iframe').css(obj);
	            });
	            top.$App.on('obtainSelectedFiles', function(files){ // 从选择文件弹窗获取用户选择的文件（本地文件，暂存柜，彩云）
	            	//console.log(files);
	            	self.model.addFiles(files);
	            	self.fileListView.render();
		        	selectFileDialog.close();
	            });
	            selectFileDialog.on('remove', function(){
	            	top.$App.off('rebuildSelectFileDialog');
	            	top.$App.off('obtainSelectedFiles');
	            });

                    selectFileDialog.on("close", function (args) {
	                var doc = $(this.el).find("iframe")[0].contentWindow.document;
	                $("object", doc).remove();

	            })
			}
		})
	);

    var sendModel = new M2012.FileExpress.Send.Model();
	var options ={model:sendModel};

    var Main = new M2012.FileExpress.Send.View.Main(options);
    var fileListView = new M2012.FileExpress.Send.View.FileList(options);
    fileListView.render();
    Main.fileListView = fileListView;
	var SendMobileView = new M2012.FileExpress.Send.View.SendMobile(options);
    var SendMailView = new M2012.FileExpress.Send.View.SendMail(options);

})(jQuery, _, M139);

