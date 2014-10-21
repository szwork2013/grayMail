(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.FileExpress.Send.View.SendMobile', superClass.extend(
    {
        el: "body",
        template: "",
        events: {
    },
    validateUrl: "",
    callApi: M139.RichMail.API.call,
    verifycode: "",
    files: [],
    initialize: function (options) {
        var self = this;
        self.model = options.model;
        self.initEvents();
        superClass.prototype.initialize.apply(this, arguments);
    },
    initEvents: function () {
        var self = this;
        self.maxMailToSend();
        self.showInputBox();
        //self.refreshImgRndCode();
        self.boxAddToScreem();
        //刷新验证码（点击刷新按钮和验证码）
        //$("#imgRnd").click(function () { self.refreshImgRndCode(); });
        //$("#aRefreshCode").click(function () { self.refreshImgRndCode(); });
        //点击按钮，发送到手机
        $("#sendtomobile").bind("click", function () {
			BH('fileexpress_sendToMobile');
            self.sendToMobile();
        });
        $("#sendcancelmobile").bind("click", function () {
            var from = self.model.get("dataSource").from;
            var prev_page = (from === "cabinet" ? "cabinet.html" : "/m2012/html/disk_v2/disk.html");
            location.href = (prev_page + "?sid={0}").format(top.sid);
            /*if(from === "cabinet"){
	            top.$App.show("diskDev", {from: "cabinet"});
            } else {
	            top.$App.show("diskDev");
            }*/
        });
    },
    //填充顶部选择文件发送的显示
    maxMailToSend: function () {
        this.model.getDataMaxSend(function (res) {
            $("#maxMail").html(res.responseData.fileSendCount);
            $("#maxMobile").html(res.responseData.fileSendCount);
        })
    },
    //发送到手机  显示手机号
    showInputBox: function () {
        var self = this;
        self.view2 = M2012.UI.RichInput.create({
            container: document.getElementById("toContainer2"),
            maxSend: top.$User.getMaxSend(),
            type: "mobile"
        }).render();
    },
    //弹出框显示通讯录
    boxAddToScreem: function () {//todo 用英文命名
        var self = this;
        /*
        var alertFrame = $("#addrContainer2"); //todo 限制查询范围 this.$()
        var style = { "position": "absolute", "z-index": "99999", "right": "0", "top": "0", "background": "#ffffff", "height": "auto", "border": "1px solid #ccc" };
        alertFrame.css(style);
        new M2012.UI.Widget.Contacts.View({
            container: alertFrame[0], //todo 重用 content
            showCreateAddr: false,
            showSelfAddr: false,
            showAddGroup: false,
            filter: "mobile"
        }).on("select", function (e) {
            var addr = e.isGroup ? e.value.join(";") : e.value;
            addMailToCurrentRichInput(addr).focus();
        });
        */
        $("#addbtn2").click(function (event) {//todo 用自命名id
          //  alertFrame.show();
          //  event.stopPropagation();

            var view = top.M2012.UI.Dialog.AddressBook.create({
                filter: "mobile"
                //  items: items
            });
            view.on("select", function (e) {
                addMailToCurrentRichInput2(e.value.join(";")).focus();
            });
            function addMailToCurrentRichInput2(addr) {
                self.view2.insertItem(addr);
                return self.view2;
            }
        });
        /*
        $("#addrContainer2").click(function () {
            return false;
        });
        $(document).click(function () {
            alertFrame.hide(); //todo 重用变量定义为局部变量，减少查询
        });

        function addMailToCurrentRichInput(addr) {
            self.view2.insertItem(addr);
            return self.view2;
        }
        */
    },
    //获取验证码，刷新，并填充
    refreshImgRndCode: function (callback) {
        var self = this;
        self.callApi("file:fSharingInitData", {}, function (res) {
            if (callback) {
                callback(res);
            }
            self.validateUrl = res.responseData.validateUrl.toString();
            url = self.validateUrl + "&rnd=" + Math.random();
            $("#imgRnd").attr("src", url);
        });
    },
    //发送到手机
    sendToMobile: function () {
        var self = this;
        //input获取要发送的手机号码
        function input() {
            var result = {};
            var error = self.view2.getErrorText();
            if (error) {
                result.msg = "接收手机号码输入有误，请检查输入。";
                result.success = false;
                return result;
            }
            var mobiles = self.view2.getAddrItems();
            if (mobiles.length == 0) {
                result.msg = "请输入接收的手机号码。";
                result.success = false;
                return result;
            }
            /*
            //获取输入的验证码
            self.verifycode = $("#yanzhengma").val().trim();
            if (self.verifycode == "") {
                result.msg = "请输入验证码。";
                result.success = false;
                return result;
            }
            */
            for (var i = 0; i < mobiles.length; i++) {
				//只能移动用户发送！
				if(!$Mobile.isChinaMobile(mobiles[i])){
					result.msg = "手机号码不正确，请输入中国移动的手机号码！";
					result.success = false;
					return result;
				}
                mobiles[i] = M139.Text.Mobile.getNumber(mobiles[i]);
                mobiles[i] = M139.Text.Mobile.add86(mobiles[i]);
            }
            result.success = true;
            result.mobiles = mobiles;
            return result;
        }
        var input = input();
        if (!input.success) {
            top.$Msg.alert(input.msg);
            return;
        }
        //files获取要发送的文件
        var filelist = self.model.get("dataSource").fileList;
        var data = _.toArray(filelist); //跨页传递
        var files = data.concat();
        if (files.length == 0) {
            top.$Msg.alert("请选择要发送的文件");
            return;
        }
        //文件不能超过X个
        if (files.length > self.model.maxsend) {
            var tmp_num = files.length - self.model.maxsend;
            top.$Msg.alert("一次最多可发送" + self.model.maxsend + "个文件，请删除" + tmp_num + "个文件");
            return false;
        }
		top.M139.UI.TipMessage.show("正在发送中...");
		$("#sendtomobile").unbind("click");
        //拼接xml数据
        var filesId = [];
        var netDiskFiles = [];
        var urls = [];
        var lastSendFiles = [];
        for (var j = 0; j < files.length; j++) {
			if(files[j]["comeFrom"] != "disk"){
			//	filesId.push(files[j].fid || files[j]["businessId"] || files[j]["id"]);
				filesId.push(files[j].fid || files[j]["businessId"]);
				lastSendFiles.push(files[j].fileName || files[j].filename || files[j].name);
			}
        }
        var xmlCode = ['<Request>',
            '<Type>mobile</Type>',
            '<UserNumber>{UserNumber}</UserNumber>',
            '<Mobiles>{Mobiles}</Mobiles>',
            '{Fileid}',
			'<DiskFiles>',
			'{DiskId}',
			'</DiskFiles>',
            '</Request>'].join("");
        function getSharingXml() {
            if (filesId.length == 0) {
                return "";
            }
            return "<Fileid>{0}</Fileid>".format(filesId.join(","));
        }
		function getDiskXML(){
			var diskString = '';
			for(var i =0; i<files.length; i++){
				if(files[i]["comeFrom"] == 'disk'){
					diskString +="<File><FileID>"+files[i]["id"]+"</FileID></File>";
				}
			}
			return diskString;
		}
        var obj = {
            UserNumber: top.UserData.userNumber,
            Mobiles: input.mobiles,
            Fileid: getSharingXml(),
			DiskId: getDiskXML()
        };
        var url = "/mw2/file/disk?func=file:sendMobile&sid=" + top.$App.getSid() + "&rnd=" + Math.random();
        //发送到手机
        var client = new M139.ExchangeHttpClient({
            name: "SendMobileMainDataHttpClient",
            requestDataType: "ObjectToXML",
            responseDataType: "JSON2Object"
        });
        var reqData = {
            type: "1",
            sendType: "0",
          //  verifycode: self.verifycode,
            xmlStr: $T.format(xmlCode, obj)
        };
        client.request({
            method: "post",
            url: url,
            data: reqData
        }, function (e) {
			top.M139.UI.TipMessage.hide();
            if (e.responseData.code === "S_OK") {
                top.M139.UI.TipMessage.show("发送成功", { delay: 1000 });
                var url = "http://" + top.location.host + "/m2012/html/fileexpress/write_ok.html?sid=" + top.$App.getSid();
                var data2 = {
                    input2: input,
                    files2: files,
                    send: "mobile"
                };
                top._lastSendFiles = new top.Array().concat(lastSendFiles);
                var $sendApp = new M139.PageApplication({ name: 'fdsfdsfds' });
                url = $sendApp.inputDataToUrl(url, data2);
                location.href = url;
            } else {
                top.$Msg.alert(e.responseData.summary);
                //self.refreshImgRndCode();
            }
        });
    },
    render: function () {
    }
}));
})(jQuery, _, M139);

