



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Doc.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.initEvents();
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj, comefrom) {
            var self = this;
            console.log("doc")
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/mw2/opes/preview.do?sid=" + ssoSid;
            this.type = this.model.checkFileType(obj.fi); //是否是word文档  
            var dl = encodeURIComponent(obj.dl);
            var options = {
                account: '',
                fileid: obj.id,
                browsetype: 1,
                filedownurl: dl,
                filename: obj.fi,
                comefrom: obj.src,
                sid: ssoSid,
                url: url
            };
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            this.mainView.appendHeaderHtml(obj);
            this.getData(options, obj);
        },
        initEvents: function () {
            var self = this;
            this.resize();
			//$("#btnSure").live("click",function(){
			//	self()
			//});
        },
        createiframe: function (result) {
            var iframe = document.createElement("iframe");
            iframe.id = "docIframe";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            iframe.name = "previewIframe";
            var part = getCookie("cookiepartid");
            var obj = domainList[part];
            iframe.src =obj.rebuildDomain + "/opes/" + result.chgurl;
            return iframe;
        },
        frameOnload: function (result, obj) {
            var iframe = this.createiframe(result);
            $(iframe).load(function () {
                $("#loadingStatus").remove();
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height()-100;
            //var hasTips = $(".tipBox").length > 0 ? true : false;
            //height = hasTips ? height - 133 : height - 102;
            $(".contentHeight").height(height);
            //if (this.type=="doc") {
               $("#docIframe").height(height);
            //}
            $("#previewContent").css({ background: "none", height: "auto",marginTop:"60px" })
        },
        getData: function (options, obj) {
            var self = this;
            this.model.getData(options, function (result) {
                self.model.set({ dataSource: result })
                if (result.code != "2") {
	                if(result.code == "4"){
		                self.mainView.passwordIntBox(obj);
		                $(".iText").focus().val("");
		                $("#btnSure").live("click",function(){
			                if($(".iText").val() !=""){
				                options.filePsw = $(".iText").val();
				                $(".erro").html("请稍候……").show();
				                self.getData(options, obj);
			                }else{
				                $(".erro").html("请输入密码！").show();
			                }
		                })
	                }else if(result.code == "5"){
		                $(".iText").focus().val("");
						$(".erro").html("密码错误，请重新输入").show();
						
		            }else{
	                    if (result.code == "FS_NOT_LOGIN") {
	                        obj.display = "none";
	                        obj.text = self.model.message.relogin;
	                    }
	                    var html = self.mainView.loadingErrorHtml(obj);
	                    $("#loadingStatus").html(html);
	                    top.BH("preview_load_error");
	                    return      
	                }
                }
                else {
                    self.template(result);
                    if (self.type=="doc") {//word文档
                        var iframe = self.frameOnload(result, obj);
                        $("#attrIframe").append(iframe)
                    } else {//txt  html  htm
                        $("#attrIframe").html(result.chgcontent);
                        $('.txt-wrap').css({overflow:"auto"});
                        $(".footerBar").hide()
                    }
                    self.setHeight();
                    $("#loadingStatus").remove();
                    if (self.unzippath) {
                        $(".attr-select").remove();
                        $(".toolBarUl li:gt(2)").hide();
                    }
                }

            }, function (result1) {
                $("#previewContent").html('<div class="contentHeight"></div>');
                $("#loadingStatus").html(result1);
                var height = $(window).height();
                $(".contentHeight").height(height - 133);
                top.BH("preview_load_error");
            });
        },
        template: function (result) {
            var tableArr = [{}];
            var str = $("#txtTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);

        }
    }));

})(jQuery, _, M139);