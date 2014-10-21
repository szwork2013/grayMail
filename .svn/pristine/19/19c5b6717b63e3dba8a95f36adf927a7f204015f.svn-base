(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.FileExpress.Send.View.SendMail', superClass.extend(
    {
        el: "body",
        template: "",
        events: {
    },
    name: 'M2012.FileExpress.Send.View.SendMail',
    files: [],
    initialize: function (options) {
        var self = this;
        self.model = options.model;
        self.initEvents();
        superClass.prototype.initialize.apply(this, arguments);
    },
    initEvents: function () {//todo 将视图中的事件绑定全部收敛到此
        var self = this;
        var inputArea = $("#tagarea2");
    //    inputArea.attr("maxlength", "500"); //todo 事件绑定不要使用设置属性的方式
    //    $("#mailtitle").attr("maxlength", "20");
        inputArea.bind("keyup", function () {
            self.numStatis();
        });
        $("#sendtomail").bind("click", function () {
			BH('fileexpress_sendToEmail');
            self.sendToMail();	
        });
        $("#sendcancelmail").bind("click", function () {
            var from = self.model.get("dataSource").from;
            console.log(self.model.get("dataSource"));
            var prev_page = (from === "cabinet" ? "cabinet.html" : "/m2012/html/disk_v2/disk.html");
            location.href = (prev_page + "?sid={0}").format(top.sid);
            /*if(from === "cabinet"){
	            top.$App.show("diskDev", {from: "cabinet"});
            } else {
	            top.$App.show("diskDev");
            }*/
        });
        self.maxMailToSend();
        self.showInputBox();
        self.boxAddToScreem();
        self.numStatis();
    },
    //填充顶部选择文件发送的显示
    maxMailToSend: function () {
        this.model.getDataMaxSend(function (res) {
            $("#maxMail").html(res.responseData.fileSendCount);
            $("#maxMobile").html(res.responseData.fileSendCount);
        })
    },
    //发送到邮箱  显示收件人
    showInputBox: function () {
        var self = this;
        self.view = M2012.UI.RichInput.create({
            container: document.getElementById("toContainer"),
            maxSend: top.$User.getMaxSend(),
            type: "email"
        }).render();
        $("#toContainer .PlaceHold").css("display", "block").html("输入对方移动手机号，就能给他发邮件");
    },
    //弹出框显示通讯录
    boxAddToScreem: function () {//todo 用英文命名
        var self = this;
        /*
        var alertFrame = $("#addrContainer"); //todo 限制查询范围 this.$()
        var style = { "position": "absolute", "z-index": "99999", "right": "0", "top": "0", "background": "#ffffff", "height": "auto", "border": "1px solid #ccc" };
        alertFrame.css(style);
        new M2012.UI.Widget.Contacts.View({
        container: alertFrame[0], //todo 重用 content
        showCreateAddr: false,
        showSelfAddr: false,
        showAddGroup: false,
        filter: "email"
        }).on("select", function (e) {
        var addr = e.isGroup ? e.value.join(";") : e.value;
        addMailToCurrentRichInput(addr).focus();
        });
        */
        $("#addbtn").click(function (event) {//todo 用自命名id
            //  alertFrame.show();
            //  event.stopPropagation();
            var view = top.M2012.UI.Dialog.AddressBook.create({
                filter: "email"
            });
            view.on("select", function (e) {
                addMailToCurrentRichInput(e.value.join(";")).focus();
            });
            function addMailToCurrentRichInput(addr) {
                self.view.insertItem(addr);
                return self.view;
            }
        });
        /*
        $("#addrContainer").click(function () {
        return false;
        });
        $(document).click(function () {
        alertFrame.hide(); //todo 重用变量定义为局部变量，减少查询
        });

        function addMailToCurrentRichInput(addr) {
        self.view.insertItem(addr);
        return self.view;
        }
        */
    },
    //发送到邮箱
    sendToMail: function () {
        //获取用户输入的邮件信息
        var self = this;
        function input() {//todo 将函数用括号包含起来(function(){..})(); 将校验单独提取出来一个函数 逻辑放在model层
            var result = {};
            //判断输入的邮件地址是否有误
            var error = self.view.getErrorText();
            if (error) {
                result.msg = "请输入正确的邮件地址:" + error; //todo 
                result.success = false;
                return result;
            }
            //判断是否有输入正确邮件地址
            var emails = self.view.getAddrItems(); //todo 公用提示
            if (!emails || emails.length == 0) {
                result.msg = "请输入接收的邮件地址.";
                result.success = false;
                return result;
            }

            for (var i = 0; i < emails.length; i++) {//todo 不用处理组件得到的emails,接口是否支持人名邮件地址(组件提供支持)
                emails[i] = M139.Text.Email.getEmail(emails[i]);
            }
            result.success = true;
            result.emails = emails;
            result.title = $("#mailtitle").val().trim(); //todo 自命名dom
            result.content = $("#tagarea2").val();
            return result;
        }
        var input = input();
        if (!input.success) {
            top.$Msg.alert(input.msg); //todo top.$Msg.alert()
            return;
        }
        //获取要发送的文件
        var filelist = self.model.get("dataSource").fileList;
        var data = _.toArray(filelist); //跨页传递
        var files = data.concat();
//		console.log(files);
//		return ;
        if (files.length == 0) {
            top.$Msg.alert("请选择要发送的文件!");
            return;
        }
        //文件不能超过X个
        if (files.length > self.model.maxsend) {
            var tmp_num = files.length - self.model.maxsend;
            top.$Msg.alert("一次最多可发送" + self.model.maxsend + "个文件，请删除" + tmp_num + "个文件");
            return false;
        }
		top.M139.UI.TipMessage.show("正在发送中...");
		$("#sendtomail").unbind("click");
        //拼接xml数据
        var filesId = [];
        var netDiskFiles = [];
        var lastSendFiles = [];
        var urls = [];
        for (var j = 0; j < files.length; j++) {
		
			if(files[j]["comeFrom"] != "disk"){
				//  filesId.push(files[j].fid || files[j]["businessId"] || files[j]["id"]); 去掉files[j]["id"],因为胃彩云，另外组件。
				filesId.push(files[j].fid || files[j]["businessId"]);
				lastSendFiles.push(files[j].fileName || files[j].filename || files[j].name);
			}
        }
        //todo 收敛通讯层
        //todo model 服务端使用json
        var xmlCode = ['<Request>',
                    '<Type>email</Type>',
                    '<UserNumber>{UserNumber}</UserNumber>',
                    '<Emails>{Emails}</Emails>',
                    '<Title>{Title}</Title>',
                    '<Content>{Content}</Content>',
                    '{Fileid}',
					'<DiskFiles>',
					'{DiskId}',
					'</DiskFiles>',
                	'</Request>'].join("");

        var userNumber = top.UserData.userNumber || top.uid, //todo 用新版方法
                accountEmail = top.$User.getDefaultSender(),
                senderName = top.UserData.userName || top.trueName;

        function getSharingXml() {
            if (filesId.length == 0) {
                return "";
            }
            return "<Fileid>{0}</Fileid>".format(filesId.join(","));
        }
		function getDiskXML(){
			var diskArray =[];
			for(var i =0; i<files.length; i++){
				if(files[i]["comeFrom"] == 'disk'){
					diskArray.push("<File><FileID>"+files[i]["id"]+"</FileID></File>");
				}
			}
			return diskArray.join('');
		}
        var obj = {
            UserNumber: encodeURIComponent(senderName ? $TextUtils.htmlEncode('"{0}"<{1}>'.format(senderName, accountEmail)) : userNumber),
            Emails: encodeURIComponent(input.emails.toString()),
            Title: encodeURIComponent(input.title),
            Content: encodeURIComponent(input.content),
            Fileid: getSharingXml(),
			DiskId: getDiskXML()
        };
        var url = "/mw2/file/disk?func=file:sendEmail&sid=" + top.$App.getSid() + "&rnd=" + Math.random();
        //发送到邮箱
        var client = new M139.ExchangeHttpClient({
            name: "SendMailMainDataHttpClient",
            requestDataType: "ObjectToXML",
            responseDataType: "JSON2Object"
        });
        var reqData = {
            type: "1",
            xmlStr: $T.format(xmlCode, obj)
        };
        client.request({
            method: "post",
            url: url,
            data: reqData
        }, function (e) {
			top.M139.UI.TipMessage.hide();
            if (e.responseData && e.responseData.code === "S_OK") {
                top.M139.UI.TipMessage.show("发送成功", { delay: 1000 });
                var url = "http://" + top.location.host + "/m2012/html/fileexpress/write_ok.html?sid=" + top.$App.getSid();
                var data2 = {
                    input2: input,
                    files2: files,
                    send: "email"
                };
                top._lastSendFiles = new top.Array().concat(lastSendFiles);
                var $sendApp = new M139.PageApplication({ name: 'a' });
                url = $sendApp.inputDataToUrl(url, data2);
                location.href = url;
            } else {
                top.$Msg.alert(e.responseData.summary);
            }
        });
        //请求服务器发送文件
    },
    //输入的时候字数统计
    numStatis: function () {//todo 重命名
        var num = $("#tagarea2").val().length;
        if ($("#tagarea2").val().length > 450) {
            $("#a500").css("color", "red");
        } else {
            $("#a500").attr("style", "");
        }
        $("#a500").html(num);

    },
    render: function () {
    }
}));
})(jQuery, _, M139);

