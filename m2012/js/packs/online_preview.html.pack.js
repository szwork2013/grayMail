



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Ppt.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            var self = this;
            this.type = this.model.checkFileType(obj.fi); //是否是pdf文档   true 是  false 否
            self.model.set({ initData: obj });
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/mw2/opes/preview.do?sid=" + ssoSid;
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
            this.initEvents();
        },
        initEvents: function () {
            var self = this;
            this.resize();
            $("#toggleSide").live("click",function(){
	            var oClass = $(this).find("i");
				if(oClass.attr("class") == "hideSider"){
					oClass.removeClass("hideSider").addClass("showSider");
					$("#pdfSider").stop().animate({marginLeft:-220})
				}else{
					oClass.removeClass("showSider").addClass("hideSider");
					$("#pdfSider").stop().animate({marginLeft:0})				
				}
	            
            })
            this.model.on("change:currentPage", function () {//content 内容变换
                var dataSource = self.model.get("dataSource");
                var index = self.model.get("currentPage");
                var part = getCookie("cookiepartid");
                var obj = domainList[part];
                var url =  obj.rebuildDomain+"/opes/" + dataSource["navList"][index - 1]["detailPage"];
                if (self.type=="pdf") {//pdf文档
                    $($("#docIframe")[0].contentWindow.document.body).find("img").attr("src", url);                

                } else {//ppt
                    //$("#docIframe").attr("src", url);
                    $($("#docIframe")[0].contentWindow.document.body).find("img").attr("src", url);  
                }
            })
            this.model.on("change:currentPage", function () {//缩略图当前选中状态
                var index = self.model.get("currentPage");
                $("#pagerSelect option").eq(index - 1).attr("selected", true);
                var li = $("#pdfSiderInner li");
                li.removeClass("on");
                li.eq(index - 1).addClass("on");
            })
            this.model.on("change:currentPage", function () {//缩略图的滚动条位置
                var index = self.model.get("currentPage");
                var height = $("#pdfSiderInner li").height();
                height = height + 18;
                $("#pdfSider").scrollTop((index - 2) * height)
            })
            this.model.on("change:currentPage", function () {//缩略图上下翻页按钮的状态显示
                var currentPage = self.model.get("currentPage");
                var len = self.model.get("pptLen");
                $("#scrollDown").removeClass("unable");
                $("#scrollUp").removeClass("unable");
                if (currentPage == 1) {
                    $("#scrollUp").addClass("unable");
                }
                if (currentPage == len) {
                    $("#scrollDown").addClass("unable")
                }
            })
            this.scrollPpt();
        },
        scrollPpt: function () {
            var self = this;

            $("#pagerSelect").live("change", function () {
                var index = $(this).find("option:selected").index();
                self.model.set({ currentPage: index + 1 })
            })
            $("#pdfSiderInner li").live("click", function () {
                var li = $("#pdfSiderInner li");
                var index = li.index(this);
                self.model.set({ currentPage: index + 1 })
            })
            $("#scrollUp").live("click", function () {
                self.scrollUp();
                return false;
            })
            $("#scrollDown").live("click", function () {
                self.scrollDown();
                return false;
            })
            $("#playTool1").live("click",function(){
				$("#playTool1,#playTool2").hide();
				$("#stopPlay").show();
				var iFrame = document.getElementById('docIframe');
				//self.saveZoomRate = $(".zoomRate").width()/50;//保存当前比例，播放完后要还原
				self.launchFullScreen(iFrame);
				if(self.timer){clearInterval(self.timer);}
	            self.timer = setInterval(function(){
					self.scrollDown();
		        },7000)
	            return false;
            })
			$("#playTool2").live("click",function(){
				$("#playTool1,#playTool2").hide();
				$("#stopPlay").show();
				var iFrame = document.getElementById('docIframe');
				//self.saveZoomRate = $(".zoomRate").width()/50;//保存当前比例，播放完后要还原
				self.launchFullScreen(iFrame);
				self.model.set({ currentPage: 1 });
				if(self.timer){clearInterval(self.timer);}
	            self.timer = setInterval(function(){
					self.scrollDown();
		        },7000)
	            return false;
				
			})
			$("#stopPlay").live("click",function(){
				$("#playTool1,#playTool2").show();
				$("#stopPlay").hide();
				clearInterval(self.timer);
			})
            
            $(document).keydown(function (event) {
                var keycode = event.which || event.KeyCode;
                if (keycode == 38 || keycode == 37) {//up   
                    self.scrollUp();
                }
                if (keycode == 40 || keycode == 39) {//down  
                    self.scrollDown();
                }
                
            });
        },
        launchFullScreen: function(element) { 
		    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;  
			if (requestMethod) {
				flag = true;
		        //var num = this.model.get('fullscreenstatus')+1;
				//this.model.set({fullscreenstatus:num})
			    requestMethod.call(element);  
			} 
			/*else if (typeof window.ActiveXObject !== "undefined") {    
			    var wscript = new ActiveXObject("WScript.Shell");  
			    if (wscript !== null) {  
			        wscript.SendKeys("{F11}");  
			    }  
			}  
*/ 		    if(flag){
				if(M139.Browser.is.firefox){
					$($("#docIframe")[0].contentWindow.document.body).css({MozTransform :"scale(1)"});
				}else{
					$($("#docIframe")[0].contentWindow.document.body).css({zoom:'1'});
				}
				$(".zoomNow").html("100%");
				$(".zoomRate").css({width:'50px'});
				$(".zoomList li a").removeClass('on').eq(1).addClass('on');
				
		    }
		},  
        scrollUp: function () {
            var self = this;
            var currentPage = self.model.get("currentPage");
            $("#scrollDown").removeClass("unable");
            if (currentPage == 2) {
                $("#scrollUp").addClass("unable");
            }
            if (currentPage == 1) {
                return;
            }
            $("#pdfSider").scrollTop((currentPage - 2) * 172)
            self.model.set({ currentPage: currentPage - 1 })

        },
        scrollDown: function () {
            var self = this;
            var len = self.model.get("pptLen");
            var currentPage = self.model.get("currentPage");
            
            $("#scrollUp").removeClass("unable");
            if (currentPage == len - 1) {
                $("#scrollDown").addClass("unable");
                clearInterval(self.timer);
				$("#playTool1,#playTool2").show();
				$("#stopPlay").hide();
            }
            if (currentPage == len) {
                return
            }
            $("#pdfSider").scrollTop(currentPage * 172)
            self.model.set({ currentPage: currentPage + 1 })

        },
        createiframe: function (result) {
            var index = this.model.get("currentPage");
            var url = result["navList"][index - 1]["detailPage"];
            var iframe = document.createElement("iframe");
            iframe.id = "docIframe";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            var part = getCookie("cookiepartid");
            var obj = domainList[part];
            var domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			iframe.src = "javascript:void((function(){document.open();document.domain='"+ domain + "';document.close()})())";
            //iframe.src = obj.rebuildDomain + "/opes/" + url;
            return iframe;
        },
        getPdfImage: function (result) {//pdf转换成的图片
            var self = this;
            var index = this.model.get("currentPage");
            var image = result["navList"][index - 1]["detailPage"];
            var part = getCookie("cookiepartid");
            var obj = domainList[part];
            image = '<img style="width:780px" src="' + obj.rebuildDomain + "/opes/" + image + '" />';
            $(image).load(function () {
                $("#loadingStatus").remove();
                var contents = $("#attrIframe img");
                var width = contents.width();
                var height = contents.height();
                _width = -width / 2;
                _height = -height / 2;
                self.setImageLocation(contents, height);
            });
            return image
        },
        setImageLocation: function (obj, height) {
            var w = obj.width();
            var h = obj.height();
            _width = -w / 2;
            _height = -h / 2;
            var iframeW = $("#attrIframe").width();
            var iframeH = $("#attrIframe").height();
            if (iframeW > 780) {
                obj.css({ overflow: "hidden", top: "50%", position: "absolute", left: "50%", marginTop: _height + "px", marginLeft: _width + "px" });
            } else {
                obj.css({ position: "static", marginTop: 0, marginLeft: 0 });
            }
            if (iframeH > height) {
                obj.css({ top: "50%" });
            } else {
                obj.css({ top: 0, marginTop: 0 });
            }
        },
        frameOnload: function (result, obj) {
            var self = this;
            var index = this.model.get("currentPage");
            var part = getCookie("cookiepartid");
            var obj2 = domainList[part];
            var url = obj2.rebuildDomain + "/opes/" + result["navList"][index - 1]["detailPage"];
            var iframe = this.createiframe(result);
            
            $(iframe).load(function () {
	            
                //var contents = $($("#attrIframe iframe")[0].contentWindow);
                var Img = new Image();
                Img.src = url;
                var images = '<img class="photo" id="bigImage" src="' + url + '"/>';
                Img.onload = function() {
                    if ($($("#docIframe")[0].contentWindow.document.body).find("img")[0] == undefined) {
                        $($("#docIframe")[0].contentWindow.document.body).css({
                            background: "#ececec",
                            textAlign: "center"
                        }).append(images);
                        $("#loadingStatus").remove();
                    }
                    Img.onload = null;
                };                //var slideObj = contents.find("#SlideObj");
                //var width = slideObj.width();
               // var height = slideObj.height();
               // _width = -width / 2;
               // _height = -height / 2;
               // self.setImageLocation(slideObj, height);
                //var contents = $("#attrIframe iframe").contents.find("body");
                //contents.keydown(function (event) {
                  //  var keycode = event.which || event.KeyCode;
                  //  if (keycode == 38 || keycode == 37) {//up   
                  //      self.scrollUp();
                  //  }
                  //  if (keycode == 40 || keycode == 39) {//down  
                  //      self.scrollDown();
                   // }
                //})
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                var contents = $("#attrIframe iframe").contents();
                var obj1 = contents.find("#SlideObj");
                var obj2 = $("#attrIframe img");
                self.setImageLocation(obj1);
                self.setImageLocation(obj2);
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height();
            var width = $(window).width();
            var hasTips = $(".tipBox").length > 0 ? true : false;
            height = hasTips ? height - 102 : height - 70;
            $(".contentHeight").height(height);
            $("#docIframe,#attrIframe").height(height);
            $("#previewContent").css({ background: "none", height: "auto" ,marginTop:'60px' })
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
                }else {
                    self.template(result)
                    if (self.type=="pdf") {//pdf文档
                        var iframe = self.frameOnload(result, obj);
                        $("#attrIframe").append(iframe)
                    } else {//ppt
                        var iframe = self.frameOnload(result, obj);
                        //alert(typeof iframe)
                        //console.log(iframe)
                        $("#attrIframe").append(iframe);
                        //self.bindExitFullScreen();
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
        /*bindExitFullScreen:function(){
			var iFrame = document.getElementById('docIframe'),self = this;
			self.fullscreenstatus = 0;
  			iFrame.onwebkitfullscreenchange = function(){
	  			self.fullscreenstatus++;
				if(self.fullscreenstatus%2 == 0){
					if(M139.Browser.is.firefox){
						$($("#docIframe")[0].contentWindow.document.body).css({MozTransform :"scale("+self.saveZoomRate+")"});
					}else{
						$($("#docIframe")[0].contentWindow.document.body).css({zoom:self.saveZoomRate});
					}	                        
				}
			}
  
        },
*/        template: function (result) {
            var imgurl = result["navList"];
            var arrImg = [];
            var len = imgurl.length;
            this.model.set({ pptLen: len });
            var part = getCookie("cookiepartid");
            var obj1 = domainList[part];
            for (var i = 0; i < len; i++) {
                var current = i == 0 ? "on" : "";
                var obj = { image: obj1.rebuildDomain +"/opes/" + imgurl[i]["thumbnail"], current: current };
                arrImg.push(obj);
            }
            var tableArr = [{}]
            var str = $("#pptTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);
            this.getPage(imgurl);
            var str1 = $("#pptImageTemplate").val();
            var rp1 = new Repeater(str1);
            var html1 = rp1.DataBind(arrImg); //数据源绑定后即直接生成dom
            $("#pdfSiderInner").html(html1)
            if(this.type == "pdf"){
	            $("#playTools").hide();
	        } 
        },
        getPage: function (imgurl) {
            var len = imgurl.length;
            var arrPage = [];
            var str = $("#pptPageSelect").val();
            var rp = new Repeater(str);
            for (var i = 0; i < len; i++) {
                var obj = { totalPage: len, currentPage: imgurl[i]["index"] };
                arrPage.push(obj);
            }
            var currentPage = this.model.get("currentPage");
            var html = rp.DataBind(arrPage); //数据源绑定后即直接生成dom
            $("#pagerSelect").html(html)
        }
    }));

})(jQuery, _, M139);
﻿



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Rar.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj, dataSource, file) {
			$("#loadingStatus").show();
            if (!file) {
                file = {
                    arr: [decodeURIComponent(decodeURIComponent(obj.fi))]
                }
            }
            var self = this;
            self.model.set({ initData: obj })
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/mw2/opes/unzip.do?sid=" + ssoSid;
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
            if (file && file.fileType == "directory") {
                options.url = "/mw2/opes/open.do?sid=" + ssoSid;
                options.unzippath = file.unzippath;
                options.filename = file.fileName;
            }
            if (file && file.fileType == "unzip") {
                options.unzippath = file.unzippath;
                options.filename = file.fileName;
            }
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            if ($(document.body).attr("loaded") != "true") {//打开文件夹时不刷新头部
                this.mainView.appendHeaderHtml(obj);
            }
            this.getData(options, obj, file);
            $(document.body).attr("loaded", "true")
        },
        getMenuHtml: function (file) {
            var self = this;
            var a = '<a key="alink" title="{title}" unzippath="{unzippath}" href="javascript:;" name="menu">{text}</a><b> &gt; </b>';
            var span = '<span title="{title}" name="menu">{text}</span>';
            var arr = file.arr;
            var nav = self.model.get("nav");
            var len = arr.length;
            var html = "";
            var arrA = [];
            if (len < 2) {
                html = $T.Utils.format(span, { title: arr[0], text: M139.Text.Utils.getTextOverFlow(arr[0], 25, true) })
            } else {
                for (var i = 0; i < len - 1; i++) {
                    var unzippath = file.unzippath;
                    var text = $T.Utils.format(a, { title: arr[i], text: M139.Text.Utils.getTextOverFlow(arr[i], 25, true), unzippath: nav[i - 1] });
                    arrA.push(text)
                }
                span = $T.Utils.format(span, { title: arr[len - 1], text: M139.Text.Utils.getTextOverFlow(arr[len - 1], 25, true) });
                html = arrA.join("") + span;
            }
            return html;
        },
        initEvents: function () {
            var self = this;
            this.resize();
            $(".rar-items a[target=_self]").die().live("click", function () {
                var status = $("#jonMark").length;
                if (status > 0) {
                    return
                }
                /*if ($(this).attr("isImg") == "true") {
                    top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/m2012/images/global/loading_xs.gif" /></div>')
                }
*/              var text = $("#breadCrumbs *[name=menu]");
                var This = $(this);
                var thisText = This.attr("title");
                var unzippath = This.attr("unzippath");
                var num = This.attr("index");
                var israr = This.attr("israr");
                var download = This.attr("downloadurl");
                var isimg = This.attr("isimg");
                var len = text.length;
                var textArr = [];
                for (var i = 0; i < len; i++) {
                    textArr.push(text.eq(i).attr("title"))
                }
                var initData = self.model.get("initData")
                var dataSource = self.model.get("dataSource")
                textArr.push(thisText)
                var file = {
                    fileType: "directory",
                    fileName: thisText,
                    arr: textArr,
                    unzippath: unzippath,
                    israr: israr
                }
                if (israr == "true") {
                    file.fileType = "unzip";
                }
                if (isimg == "true") {
                    var ssoSid = self.model.get("sid");
                    var url = "/mw2/opes/thumbnails.do?sid=" + ssoSid;
                    var mobile = self.model.get("mobile");
                    var obj = self.model.get("initData")
                    var part = getCookie("cookiepartid");
                    var obj1 = domainList[part];
                    var options = {
                        account: '',
                        fileid: obj.id,
                        browsetype: 1,
                        filedownurl: obj1.rebuildDomain + "/opes/" + encodeURIComponent(download),
                        filename: thisText,
                        comefrom: obj.src,
                        sid: ssoSid,
                        url: url,
                        unzippath: unzippath
                    };
                    self.isLoad = false;
                    self.model.getData(options, function (result) {
                        if (result.code == "1" && !self.isLoad) {
                            var previewImg = [];
                            var thumbnails = result.thumbnails;
                            var len = thumbnails.length;
                            for (var i = 0; i < len; i++) {
                                var obj = {
                                    imgUrl: obj1.rebuildDomain + "/opes/" + thumbnails[i].thumbnailUrl,
                                    fileName: thumbnails[i].name,
                                    downLoad: obj1.rebuildDomain + "/opes/" + thumbnails[i].downloadUrl
                                }
                                previewImg.push(obj);
                            }
                            top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                            top.focusImagesView.render({ data: previewImg, index: parseInt(num) });
                            
                        }
                        else {
                        }
                        self.isLoad = true
                    });
                    return
                }
                self.render(initData, dataSource, file);
            });
            $('.rar-items').live('click',function(){
	            $('.rar-items').removeClass('rar-itemsCurrent');
	            $(this).addClass('rar-itemsCurrent');
            })
            self.jumpToFolder();
        },
        openScrollImg: function () {

        },
        jumpToFolder: function () {//跳转到相应的文件夹
            var self = this;
            $("#breadCrumbs *[key=alink]").die().live("click", function () {
                var text = $("#breadCrumbs *[name=menu]");
                var This = $(this);
                var index = text.index(this);
                var thisText = This.attr("title");
                var unzippath = This.attr("unzippath");
                var israr = /(?:\.rar|\.zip|\.7z)$/i.test(This.attr("title")); //如果是 rar zip 7z文件
                var len = text.length;
                var textArr = [];
                for (var i = 0; i < index + 1; i++) {
                    textArr.push(text.eq(i).attr("title"))
                }
                var initData = self.model.get("initData")
                var dataSource = self.model.get("dataSource")
                var file = {
                    fileType: "directory",
                    fileName: thisText,
                    arr: textArr,
                    unzippath: unzippath
                }
                if (index == 0 || israr) {
                    file.fileType = "unzip";
                }
                //console.log(file)
                self.render(initData, dataSource, file);
            });
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
                self.setHeight();
            });
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height();
            //var hasTips = $(".tipBox").length > 0 ? true : false;
            //height = hasTips ? height - 177 : height - 146;
            height = height - 90;
            $("#contentHeight").height(height);
            $("#previewContent").css({ background: "none", height: "auto",marginTop:"60px" })
        },
        getData: function (options, obj, file) {
            var self = this;
            this.isLoad = false;
            this.model.getData(options, function (result) {
                if (!self.isLoad) {
                    self.model.set({ dataSource: result })
                    if (result.code != "1") {
                        if (result.code == "FS_NOT_LOGIN") {
                            obj.display = "none";
                            obj.text = self.model.message.relogin;
                        }
                        var html = self.mainView.loadingErrorHtml(obj);
                        $("#loadingStatus").html(html);
                        return
                    }
                    else {
                        self.template(obj, result, file)
                        self.setHeight();
                        $("#loadingStatus").hide();
                        if (self.unzippath) {
                            $(".attr-select").remove();
                        }
                        self.initEvents();
                    }
                }
                self.isLoad = true;

            }, function (result1) {
                //console.log(result1)
                $("#previewContent").html('<div class="contentHeight"></div>');
                $("#loadingStatus").html(result1);
                var height = $(window).height();
                $(".contentHeight").height(height - 133);
                top.BH("preview_load_error");
            });
        },
        getListData: function (result, options, datasource) {
            this.imgNum = 0;
            //console.log(result)
            //console.log(options)
            //console.log(datasource)
            //console.log(1)
            var self = this;
            var len = result.length;
            var tableArr1 = [];
            var obj = {};
            var previewImg = [];
            var part = getCookie("cookiepartid");
            var obj1 = domainList[part];
            var unzippath = datasource.unzippath;
            for (var i = 0; i < len; i++) {
                var downloadurl = obj1.rebuildDomain + "/opes/" + result[i].downloadurl;
                var urlObj = {
                    fileName: result[i].name,
                    fileSize: result[i].size,
                    //downloadUrl: downloadurl,
                    type: options.src,
                    contextId: options.id

                };
                var openurl = self.model.getUrl(urlObj);
                openurl = $T.Url.makeUrl(openurl, {
                    unzippath: encodeURIComponent(unzippath),
                    //dl: encodeURIComponent(downloadurl) //将下载地址放在url最后，以保证预览成功率，不过可能下载和存彩云失败(IE)
                    dl: downloadurl //组件会自动encode
                });
                //openurl = openurl + "&unzippath=" + encodeURIComponent(unzippath);
                var filename = result[i].name;
                var filetype = result[i].type;
                var filesize = result[i].size;
                var file = "";
                var type = self.model.checkFile(filename); //附件是否可预览    1 可预览   2压缩包  -1不可预览
                var israr = /(?:\.rar|\.zip|\.7z)$/i.test(filename); //如果是 rar zip 7z文件
                var isimg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(filename);
                var index = "";
                var text = type == 1 ? "预览" : "打开";
                var previewDisplay = type == -1 ? "none" : "";
                var diskDisplay = options.src == "disk"? "none" : "";
                var target = "_blank";
                var cursor = "pointer";
                if (filetype == "directory") {
                    var display = "none";
                    target = "_self";
                    openurl = "javascript:;";
                    file = "folder";
                } else {
                    var num1 = filename.lastIndexOf(".");
                    var num2 = filename.length;
                    file = filename.substring(num1 + 1, num2); //后缀名  
                    var display = "";
                    if (israr || isimg) {
                        target = "_self";
                        openurl = "javascript:;";
                    } else {
                    }
                    if (type == -1) {
                        openurl = "javascript:;"
                        cursor = "default";
                        target = "";
                    }

                }
                if (isimg) {
                    var imgUrl = "";
                    var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                    imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                        sid: this.model.get("sid"),
                        mid: this.model.get("mid"),
                        size: result[i].size,
                        offset: 0,
                        name: filename,
                        type: "attach",
                        width: 72,
                        height: 72,
                        quality: 80
                    });
                    this.imgNum++;
                    index = this.imgNum - 1;
                    previewImg.push({
                        imgUrl: imgUrl,
                        fileName: filename,
                        downLoad: downloadurl
                    });
                };
                var downloadurlNet = obj1.rarPreviewSaveDisk + "/opes/" + result[i].downloadurl; //存彩云的下载地址
                obj = {
                    filename: filename,
                    filesize: filesize,
                    filetype: file,
                    downloadurl: downloadurl,
                    display: display,
                    openurl: openurl,
                    target: target,
                    unzippath: unzippath,
                    israr: israr,
                    isimg: isimg,
                    num: index,
                    cursor: cursor,
                    text: text,
                    previewDisplay: previewDisplay,
                    diskDisplay: diskDisplay,
                    downloadurlNet: downloadurlNet
                }
                tableArr1.push(obj);
            }
            self.previewImg = previewImg;
            return tableArr1
        },
        template: function (options, datasource, file) {
            var self = this;
            var nav = self.model.get("nav");
            nav.push(datasource.unzippath);
            self.model.set({ nav: nav })

            var result = datasource.files;
            var menu = [];
            var tableArr = [{
                filename: decodeURIComponent(options.fi)
            }];
            var str = $("#rarTemplate").val();
            var rp = new Repeater(str);
            rp.Functions = {
                getMenu: function () {
                    var html = self.getMenuHtml(file);
                    return html;
                }
            }
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);

            var str1 = $("#rarListTemplate").val();
            var rp1 = new Repeater(str1);
            var tableArr1 = this.getListData(result, options, datasource);
            var html1 = rp1.DataBind(tableArr1); //数据源绑定后即直接生成dom
            $("#rarWrapInner").html(html1)
        }
    }));

})(jQuery, _, M139);

﻿



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
﻿



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Xls.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            var self = this;
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/mw2/opes/preview.do?sid=" + ssoSid;
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
            this.initEvents();

        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        initEvents: function () {
            var self = this;
            this.resize();
            this.sheetIndex = 0;
            this.leftWidth = 0;
			this.model.on("change:currentSheet",function(){
				var dataSource,index,part,obj,url
                  	dataSource = self.model.get("dataSource");
                    index = self.model.get("currentSheet");
		            part = getCookie("cookiepartid");
	                obj = domainList[part];
	                url =  obj.rebuildDomain+"/opes/" + dataSource["navList"][index - 1]["detailPage"];
                    $("#docIframe").attr("src", url);
                $("#exlTab .plane").find("a").removeClass("on");   
				$("#exlTab .plane").eq(index - 1).find("a").addClass("on");
                $("#more .list").find("a").removeClass("on");   
				$("#more .list").eq(index - 1).find("a").addClass("on");
			});
			//$("#exlTab .more").live('click',function(){
			//	$("#exlTab .more .moreList").toggle();
				
			//});
            $("#more").live("click", function (e) {//更多sheet
                var objParent = $(".moreList");
				var planeWidth = $('#exlTab').width()+41;
                if(planeWidth < 200){
	                $("#moreList").css({left:0})
                }else{
	                $("#moreList").css({right:0})
                }
				if(objParent.attr('isShow') == '1'){
					objParent.hide();
					objParent.attr('isShow','0');
					$("#more .aBtn").removeClass('on');
				}else{
					objParent.show();
					objParent.attr('isShow','1');
					$("#more .aBtn").addClass('on');
				}
				M139.Event.stopEvent(e)
            });
			$(document).live("click",function(){
                var objParent = $(".moreList");
				if(objParent.attr('isShow') == '1'){
					objParent.hide();
					objParent.attr('isShow','0');
					$("#more .aBtn").removeClass('on');
				}
			})
			this.setSheet();  
        },
        setSheet : function(){//点击sheet
	        var self = this;
            $("#exlTab .plane").live("click", function () {
                var li = $("#exlTab .plane");
                var index = li.index(this);
                if(self.model.get('currentSheet') !== index + 1){
					$(".zoomNow").html("100%");
					$(".zoomRate").css({width:50});
		            $("#rightTools .zoomOpt").each(function(){
			            $(this).removeClass('on');
		            });
                }
                self.model.set({ currentSheet: index + 1 });
            })
            $("#more .list").live("click", function () {
                var li = $("#more .list");
                var index = li.index(this);
                if(self.model.get('currentSheet') !== index + 1){
					$(".zoomNow").html("100%");
					$(".zoomRate").css({width:50});
		            $("#rightTools .zoomOpt").each(function(){
			            $(this).removeClass('on');
		            });
                }
                self.model.set({ currentSheet: index + 1 })
            })
	        
        },
        changeBtn: function(){//sheet左右按钮
        	var self = this;
        	changeState();
			$("#pre").live("click",function(){
				var iWidth = $(window).width()-300;
				var planeWidth = $('#exlTab').width()+41;
				if(planeWidth<iWidth){
					$('.more').css('left',planeWidth)
					return; 
				}
				$("#exlTab").find("li").eq(self.sheetIndex).hide();
				changeState();
				self.sheetIndex++;
			})
			$("#nxt").live("click",function(){
				self.sheetIndex--;
				$("#exlTab").find("li").eq(self.sheetIndex).show();
				changeState();
			})
	        function changeState(){
				var iWidth = $(window).width()-300;
				var planeWidth = $('#exlTab').width()+41;
				if(planeWidth>iWidth){
			        $('.more').css('left',iWidth+41)
					$("#pre").removeClass("none");
				}else{
			        $('.more').css('left',planeWidth)
					$("#pre").addClass("none");
				}
				if(self.sheetIndex <= 0){
					$("#nxt").addClass("none");
					self.sheetIndex = 0;
				}else{
					$("#nxt").removeClass("none");					
				}
	        }
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height()-100;
            //var hasTips = $(".tipBox").length > 0 ? true : false;
            //height = hasTips ? height - 90 : height - 85;
            $(".contentHeight").height(height);
            $("#previewContent").css({ background: "none", height: "auto" ,marginTop:"60px"})
        },
        createiframe: function (result) {
            var iframe = document.createElement("iframe");
            iframe.id = "docIframe";
            iframe.className = "contentHeight";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            iframe.name = 'frSheet';
            var part = getCookie("cookiepartid");
            var obj = domainList[part];
            iframe.src =obj.rebuildDomain + "/opes/" + result.navList[0].detailPage;
            return iframe;
        },
        frameOnload: function (result, obj) {
            var iframe = this.createiframe(result);
            $(iframe).load(function () {
                $("#loadingStatus").remove();
			    document.getElementById('docIframe').className = 'contentHeight rePaintFix';//解决360浏览器预览XLS没有正文，原因未知
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
	            
                self.setHeight();
				var iWidth = $(window).width()-300;
				if(iWidth<0){iWidth = 0}
	            $('#bexlTab').css('width',iWidth);
				self.changeBtn();
				self.setRange();
            });
			

            
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
                    self.template(result)
                    var iframe = self.frameOnload(result, obj);
                    $("#attrIframe").append(iframe)
                                        self.getSheetList(result)

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
            var str = $("#xlsTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);
        },
        getSheetList : function(result){//拼接SheetList
			var iWidth,i ,sLi,aSheetUrlArr,iLiNum,aSheetName,aLiArr = [],
			sList = '',aMoreLiArr = [],sMoreLi,sMoreLiList,part,sDomain,
			planeWidth;
			iWidth = $(window).width()-300;
            part = getCookie("cookiepartid");
            sDomain = domainList[part];
			sLi = '<li class="tab plane"><a href="javascript:void(0);">{sheetName}</a></li>';
			sMoreLi = '';
			sMoreLiList = '<li class="list"><a href="javascript:void(0);">{sheetName}</a></li>';
			iLiNum = result.navList.length;
	        aSheetName = _.map(result.navList,function(str){
		        return str.thumbnail;
	        });
	        for(i = 0;i < iLiNum ; i++){
				sList = $T.Utils.format(sLi,{sheetName : aSheetName[i]});
		        aLiArr.push(sList);
				sList = $T.Utils.format(sMoreLiList,{sheetName : aSheetName[i]});
		        aMoreLiArr.push(sList);
	        }
	        if(aMoreLiArr.length > 12){
		        $("#moreList").height("266").css("overflowY","scroll");
	        }
	        moreSheetList = aMoreLiArr.join("");
	        
	        $("#moreList").html(moreSheetList);
	        //sMoreLi = $T.Utils.format(sMoreLi,{moreSheetList : moreSheetList});
	        //aLiArr.push(sMoreLi);
	        
            sList = aLiArr.join("");
            //sList = sList+sList+sList+sList;
            $('#bexlTab').css('width',iWidth);
	        $('#exlTab').html(sList);
	        $('#exlTab li').eq(0).find('a').addClass('on');
			$('.more ul').hide().prev().removeClass('on').next().find('a').eq(0).addClass('on');
			this.changeBtn();
			this.setRange();
        },
        setRange : function(){//设置sheet更多按钮的位置
			var iWidth = $(window).width()-300;
			var planeWidth = $('#exlTab').width()+41;
			if(planeWidth < iWidth){
		        $('.more').css('left',planeWidth)
			}else{
				$("#pre").removeClass("none");
		        $('.more').css('left',iWidth+41)
			}
        }
    }));

})(jQuery, _, M139);
﻿
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Img.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            //this.model2 = new M2012.OnlinePreview.Focusimagesemail.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
	        this.model.set({ initData: obj })//保存地址栏的参数到model
            var self = this;
            var dl = decodeURIComponent(obj.dl);
            var obj = $Url.getQueryObj();
            this.mainView.appendHeaderHtml(obj);
            this.getAllAttach(obj);
            //$("#loadingStatus").remove();
        },
        getAllAttach : function(initData){
            var self = this;
            this.imgNum = 0;
            var comefrom = initData.comefrom;
            this.model.getAttach = comefrom == "compose" ? this.model.getAttachForCompose : this.model.getAttach; 
				
			if(comefrom == 'draftresend'){
				this.model.getAttach = this.model.getAttachForCompose;
			}
            this.model.getAttach(success,err)
            function success(dataSource) {
                var result = comefrom == "compose" ? dataSource : dataSource.attachments; 
				if(comefrom == 'draftresend'){
					result = dataSource;
				}

                var len = result.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    if (result[i].fileRealSize < 1024 * 1024 * 20) {
                        arr.push(result[i]);
                    }
                }
                var liFlag = self.getAttachList(arr, initData);
				var timer = setInterval(getImg, 500);
                
                function getImg(){
	                
	                if(liFlag){
		                
		                var filename = $("#headerBar img").attr("alt");
		                var imgCont = $("#attachList img[alt='"+filename+"']");
		                var num = "0";
		                if(imgCont.length){
			                num = imgCont.parent().parent().attr("index");
		                }
		                if (num != "" && num != "null" && num+"" != 'undefined') {
		                    top.focusImagesView = new M2012.OnlinePreview.Focusimagesemail.View();
		                    top.focusImagesView.compose = comefrom == "compose" ? true : false; 
		                    top.focusImagesView.render({ data: self.previewImg, num: parseInt(num) });

		                }
		                clearInterval(timer);
	                }

                }
                
            };
            function err(result){
	            var obj = self.model.get('initData');
				if(result.code == "FA_INVALID_SESSION" || result.code == "FS_NOT_LOGIN"){
	                obj.display = "none";
	                obj.text = self.model.message.relogin;
				}
                var html = self.mainView.loadingErrorHtml(obj);
                $("#loadingStatus").html(html);
                top.BH("preview_load_error");
                return
	            
            }
	        
        },
        getAttachList: function (result, initData) {//拼装其他附件列表，并输出html
	        this.arrListUrl = [];//附件Url
	        this.currentLi = 0;
            var self = this;
            var len = result.length;
            var list = '';
            var num = 0;
            var arr = [];
            var previewImg = [];
            for (var i = 0; i < len; i++) {
                var f = result[i];
                var filename = f.fileName;
                var data = self.getAttrImages(f, initData)
                this.arrListUrl.push(data.previewUrl);
                if (data["index"] != "null") {
                    previewImg.push({
                        imgUrl: data.imgUrl,
                        fileName: filename,
                        downLoad: data.downloadUrl,
                        num : data.index,
	                    previewUrl:data.previewUrl
                    });
                }
            }
            this.previewImg = previewImg;
            return 'ok';
        },
        getAttrImages: function (f, initData) {//从所有附件中筛选出图片附件
            var self = this;
            var comefrom = this.model.get("comefrom");
            var composeUrl = self.model.getPreViewUrlForCompose(f);
            var readmailUrl = self.model.getPreViewUrl(f, initData);
            var downloadUrl = f.type == "attach" ? readmailUrl : composeUrl;
            var obj = {
                fileName: encodeURIComponent(f.fileName),
                fileSize: f.fileSize,
                downloadUrl: encodeURIComponent(downloadUrl),
                type: initData.src,
                contextId: initData.id,
                comefrom: comefrom,
                composeId: initData.composeId

            }
            var previewUrl = self.model.getUrl(obj);
            var target = "_blank";
            var index = "null";
            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(f.fileName);
            if (isImg) {
                var imgUrl = "";
                var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                    sid: this.model.get("sid"),
                    mid: initData.id,
                    size: f.fileSize,
                    offset: f.fileOffSet,
                    name: f.fileName,
                    type: f.type,
                    width: 72,
                    height: 72,
                    quality: 80
                });
                this.imgNum++;
                index = this.imgNum - 1;
                previewUrl = "javascript:;";
                target = "_self";
                imgUrl = comefrom == "compose" ? imgUrl : imgUrl;
            };
            var dataSource = {
                previewUrl: previewUrl,
                target: target,
                index: index,
                imgUrl: imgUrl,
                downloadUrl: downloadUrl
            };
            return dataSource;
        },
        getData: function (options, obj) {
            var self = this;
            this.model.getImageAttach(options, function (result) {
				//console.log(result)
            })
        },
        template: function (result) {
            var tableArr = [{}];
            var str = $("#imgTemplate").val();

        }


    }));

})(jQuery, _, M139);
﻿



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Video.View', superClass.extend({

        /**
        *@lends M2012.Service.OnlinePreview.Video.View.prototype
        */
        initialize: function () {
            this.initEvents();
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            this.mainView.appendHeaderHtml(obj);
            this.getData();
        },
        initEvents: function () {
            var self = this;
            this.resize();
        },
        createiframe: function () {
			var frame_url = "video.html?sid=" + sid + "&embed=1";
			var jFrame = $('<iframe allowfullscreen mozallowfullscreen webkitallowfullscreen id="videoIframe" name="previewIframe" width="100%" frameborder="no"></iframe>')
			
	        frame_url += "&presentURL=" + urlParams.dl + "&mediaType=" + urlParams.mediaType;

            jFrame.load(function () {
                $("#loadingStatus").remove();
                $(".footerBar").hide();
            }).attr("src", frame_url).appendTo("#attrIframe");
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
            $(".contentHeight").height(height);
            $("#videoIframe").height(height);
            $("#previewContent").css({ background: "none", height: "auto",marginTop:"60px" })
        },
        getData: function (options, obj) {
            this.template();
            this.createiframe();
            this.setHeight();
        },
        template: function () {
            var tableArr = [{}];
            var str = $("#txtTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);

        }
    }));

})(jQuery, _, M139);

﻿/**   
* @fileOverview 普通模式读信
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *普通模式读信
    */

    M139.namespace("M2012.OnlinePreview.Focusimagesemail.Model", Backbone.Model.extend({

        defaults: {
            currentImg: 1, //当前的图片
            imgNum:5,//默认显示5张缩略图
            imgOffsetWidth:72,//缩略图之间的距离
            loadImageStatus: 0//从附件夹、彩云入口进来       >50张图片时  图片分批加载 每次加载50张
        },
        callApi: M139.RichMail.API.call,
        getImageAttach: function (callback) { //获取图片附件列表
            var self = this;
            var index = this.get("loadImageStatus")
            var data = {
                start: (index * 50) + 1,
                total: 50,
                order: 1,
                desc: 1,
                stat: 1,
                isSearch: 1,
                filter: {
                    attachType: 1
                }
            };
            this.callApi("attach:listAttachments", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
        getDiskDownloadImg: function (callback) {//获取彩云里的大图列表
            var self = this;
            var index = this.get("loadImageStatus")
            var data = {
                userNumber: top.UserData.userNumber,
                folderid: "",
                fileid: dataObj.fileid,
                downname: escape(dataObj.filename)
            };
            this.callApi("disk:download", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
        getImgUrl: function (f, mid) {
            var self = this;
            var urltemp = "&sid={sid}&mid={mid}&realsize={realsize}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
            var imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                sid: $App.getSid(),
                mid: mid,
                size: f.fileSize,
                realsize: f.fileRealSize,
                offset: f.fileOffSet,
                name: f.fileName,
                type: f.type,
                width: 58,
                height: 58,
                quality: 80
            });
            return imgUrl;
        },
        logger: function (options) {
            var url = options.src;
            var loghelper = M139.Logger || top.M139.Logger;
            loghelper.sendClientLog({
                level: options.level || "INFO",
                name: "RichMailHttpClient",
                url: url,
                errorMsg: options.msg || "NULL",
                responseText: options.responseText || ''
            });
        }



    }));

})(jQuery, _, M139);

﻿
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.OnlinePreview.Focusimagesemail.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function (data) {
            this.picWidth = null;
            this.autoPlayStatus = false;
            this.isRotate = false; //默认为非旋转状态 用于计算图片宽高时的判断todo水平垂直
            this.picHeight = null;
            this.bigImg = null;
            this.imageSize = 0; //图片缩放，默认为原始大小
            this.fullScreen = false; //是否全屏状态
            this.moveStatus = false;
            this.rotateNum = 0;
            this.rotateNumIE = 0;
            this.rotateDeg = 0;
            this.smallImgDisplay = false;
            this.model = new M2012.OnlinePreview.Focusimagesemail.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            this.model.set({ currentImg: obj.num });
            var self = this;
            this.images = obj["data"];
            this.imgCurNum = Math.floor(($(window).width() - 120)/70);//屏幕能容纳的图片数量
            
            var len = this.images.length;//图片总数
            this.imgLen = len;

            var imgList = {};
            var num = obj.num;
            try {
                this.bigImg = this.images[num].downLoad;
                this.bigName = this.images[num].fileName;
            } catch (e) { };
            self.insertHtml(len, num, obj); //
            self.imageLoadedSuccess(); //判断大图是否加载
            self.setCurrentSmallImg(len, num); //获取当前显示的缩略图
            self.imageRotate(); //图片旋转
            self.initEvents(obj);
            self.eventKeyCode(obj);
            top.BH("image_preview_load");
            $("#loadingStatus").remove();

        },
        smallImageLoadError: function () {
            $(".full-screen-img").error(function () {
                $(this).attr("src", "/m2012/images/global/nopic.jpg");
            })
        },
        getSmallImage: function (len, num, data) {
            var images = this.images;
            var self = this;
            var display = "";
            var hideClass = "";
            var li = "";
            for (var i = 0; i < len; i++) {
                var className = "";
                if (i == num) {
                    className = "on"
                }            
                li += '<li class="' + className + '"><a href="javascript:;"><img width="72" height="72" src="' + images[i].imgUrl + '" alt=""/></a></li>';
                if (images[i].imgUrl == "") {
                    display = "none";
                    this.smallImgDisplay = true;
                } else {
                    this.smallImgDisplay = false;
                    display = "";
                }
            }
            if (len == 1) {
                hideClass = "hide";
            }
            var obj = {
                li: li,
                display: display,
                hideClass: hideClass
            }
            return obj;
        },
        insertHtml: function (len, num, data) {//获取数据
            var self = this;
            var images = this.images;
            var obj = this.getSmallImage(len, num, data);
            var li = obj.li;
            var display = obj.display;
            var template = $("#imgTemplate").val();
            var html = $T.Utils.format(template, {
                imgList: li,
                bigImage: self.bigImg,
                fileName: images[num].fileName,
                currentImg: this.model.get("currentImg") + 1,
                imgNum: this.imgLen,
                smallImgDisplay: display,
                hideClass: obj.hideClass
            });
            $("#previewContent").append(html);
            $("#focusImages").focus();
            //this.smallImageLoadError();
            self.fullScreenView(data); //全屏状态
        },
        normalScreenView: function () {//切换到普通状态
            var self = this;
            $("#normalScreen").click(function () {
                //var id = $("#focusImages");
                self.fullScreen = false;
                $("#fullScreenMode").addClass("hide");
                //$("#focusImages").removeClass("hide");
            });
        },
        fullScreenView: function (data) {//切换到全屏状态
            var self = this;
            $("#fullScreen").click(function () {
                self.imageSize = 0;
                var currentImg = self.model.get("currentImg");
                //var id = $("#fullScreenMode");
                self.fullScreen = true;
                //$("#jonMark img").remove();
                //$("#focusImages").addClass("hide");
                $("#fullScreenMode").removeClass("hide").find("img").attr("src", self.images[currentImg].downLoad);
                self.smallImageLoadError();
                $("#fullScreenMode").find("h3").html(self.images[currentImg].fileName);
                $("#fullScreenMode").find("img").css({ width: self.picWidth, height: self.picHeight, marginLeft: -self.picWidth / 2, marginTop: -self.picHeight / 2 });


                self.normalScreenView();
                self.imgDrag(); //鼠标拖动
            });
        },
        setImageWH: function (img, images) {//设置大图的宽高
            var self = this;
            $("#picContent img").remove();
            $("#picContent").append(images);
            //$("#picName").html(self.bigName);
            self.picWidth = img.width;
            self.picHeight = img.height;
            self.getBigImageWH(self.picWidth, self.picHeight, 0, function (w, h) {
                if (w == "auto" && h == "auto") {
                    w = self.picWidth;
                    h = self.picHeight;
                    var percent = parseInt(h) / self.picHeight;
                }
                if (w == "auto" && h != "auto") {
                    var percent = parseInt(h) / self.picHeight;
                    w = self.picWidth * percent;
                }
                if (w != "auto" && h == "auto") {
                    var percent = parseInt(w) / self.picWidth;
                    h = self.picHeight * percent;
                }
                var marginLeft = -parseInt(w) / 2;
                var marginTop = -(self.picHeight * percent) / 2;
                if ($B.is.ie) {
                    if (self.rotateNumIE % 2 != 0) {
                        marginTop = -parseInt(w) / 2;
                        marginLeft = -(self.picHeight * percent) / 2;
                    }
                }
                w = Math.ceil(w);
                self.picHeight = Math.ceil(self.picHeight);
                $("#bigImage").css({ width: w, height: self.picHeight * percent, top: "50%", left: "50%", position: "absolute", marginTop: marginTop + "px", marginLeft: marginLeft + "px" })
            });
        },
        imgLoad: function (url, callback) {//判断图片是否加载完成
            var self = this;
            //var html = '<img class="photo" src="/m2012/images/global/loading_xs.gif"/>'; //loading状态
            var img = new Image();
            img.src = url;
            var images = '<img class="photo" id="bigImage" src="' + img.src + '"/>';
            $("#picContent img").remove();
            $(images).error(function () {
                try {
                    //图片加载失败的时候,上报一条日志.方便定位.因为是GET模式,所以无法知道错误码
                    //事实上也会返回200.只是content-type不是image
                    self.model.logger({
                        src: $(this).attr("src"),
                        level: "ERROR",
                        msg: "图片加载失败"
                    });
                } catch (e) { }

                img.width = 58;
                img.height = 58;
                images = '<img class="photo" id ="bigImage" src="/m2012/images/global/nopic.jpg"/>';
                self.setImageWH(img, images);
            })
            if (img.complete) {
                callback(img.width, img.height);
            } else {
                img.onload = function () {
                    callback(img.width, img.height);
                    img.onload = null;
                };
            };
        },
        imageLoadedSuccess: function () {//图片加载成功后的操作
            var self = this;
            //var html = '<img class="photo" src="/m2012/images/global/loading_xs.gif"/>'; //loading状态
            this.isRotate = true;
            self.rotateNum = 0;
            self.rotateNumIE = 0;
            //$("#picShow img").replaceWith($(html));
            self.setCssStyle();
            self.imgLoad(self.bigImg, function (width, height) {
                var images = '<img class="photo" id="bigImage" src="' + self.bigImg + '"/>';
                var obj = {
                    width: width,//原图大小
                    height: height//原图大小
                }
                $("#imgDownload").attr("href", self.bigImg);
                self.setImageWH(obj, images);
            });
        },
        setCurrentSmallImg: function (len, num) {//设置当前缩略图的位置
            var max = this.imgCurNum;
            var num1 = parseInt(max / 2);
            var num2 = Math.ceil(max / 2);
            var boxW = this.model.get("imgOffsetWidth");
            var smallPicLlist = $("#smallPicLlist ul");
            var ulWidth = boxW*len;
            smallPicLlist.width(ulWidth);
            if(ulWidth< $(window).width()){
	            
            }
            if (num == 0) {
                $(".pictureBox_left").addClass("disable");
            }
            if (num == len - 1) {
                $(".pictureBox_right").addClass("disable");
            }
            /*if (len > max) {
                if (num > num1) {
                    if (num < len - num1) {
                        left = -(num - num1) * boxW;
                    } else {
                        left = -(num - num1 - (num2 - (len - num))) * boxW;
                    }
                }
            }
           this.marginLeft = left; //设置初始的margin-left
           smallPicLlist.animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
*/
			this.setMarginLeft();
        },
        getBigImageWH: function (picWidth, picHeight, num, callback) {
	        var self = this;
            var picShowHeight = self.picShowHeight; //大图的容器高度
            var picShowWidth = self.picShowWidth; //大图的容器宽度
            var imgWidth = "auto";
            var imgHeight = "auto";
            var imgObj = $("#bigImage"); 
            if (picWidth >= picShowWidth && picHeight <= picShowHeight) {//图片宽度大于外层容器时  图片宽度=外层容器
                imgWidth = picShowWidth + "px";
            }
            if (picWidth <= picShowWidth && picHeight >= picShowHeight) {//图片高度大于外层容器时  图片高度=外高容器
                imgHeight = picShowHeight + "px";
            }
            if (picWidth >= picShowWidth && picHeight >= picShowHeight) {
                if (picWidth > picHeight) {
                    imgWidth = picShowWidth  + "px";
                } else {
                    imgHeight = picShowHeight + "px";
                }
            }
            var w = imgWidth;
            var h = imgHeight;
            if (num % 2 != 0) {
                w = imgHeight;
                h = imgWidth;
            }
            if (!this.isRotate) {//非旋转状态下，计算图片宽高
                if (w = h = "auto") {//不满足以上判断，设置图片的大小为原始大小
                    w = picWidth + "px";
                };
            };
           if (callback) { callback(w, h) }
        },
        setCssStyle: function () {
	        var self = this;
            var picConsoleWrap = $(".backgroundBox_scroll "); //缩略图
            var picShow = $("#picContent"); //大图显示的区域
            var picConsoleHeight = picConsoleWrap.height(); //缩略图的高度
            var bodyHeight = $("body").height(); //body的高度
            var bodyWidth = $("body").width(); //body的宽度
            var picShowHeight = picShow.height(); //大图的实际高度
            var picShowWidth = bodyWidth-300; //大图的实际宽度
            var showBigPicHeight = bodyHeight - picConsoleHeight  - 65; //大图可显示的最大高度
            self.picShowWidth = picShowWidth;
            self.picShowHeight = showBigPicHeight;
            
            //picShow.css({ height: picShowHeight + "px", width: picShowWidth + "px" })
            $("#picContent").css({height:self.picShowHeight})
        },
        imageRotate: function () {//图片旋转
            var rotate = 0;
            var self = this;
            $("#bigImage").attr("style", "-webkit-transform:rotate(0deg);-o-transform:rotate(0deg);-moz-transform:rotate(0deg);")
            $("#rotateRight").click(function () {//顺时针旋转
                self.rotateCommonFn("right");
            });
            $("#rotateLeft").click(function () {//逆时针旋转
                self.rotateCommonFn("left");
            });
        },
        rotateCommonFn: function (status) {//旋转的共用方法
            var self = this;
            var width = self.picWidth;
            var height = self.picHeight;
            self.isRotate = true; //标记为旋转状态
            if (status == "right") {
                self.rotateNumIE = self.rotateNumIE == 4 ? 0 : self.rotateNumIE; //转完一圈回到初始状态
                self.rotateNum++;
                self.rotateNumIE++;
            } else {
                self.rotateNumIE = self.rotateNumIE == 0 ? 4 : self.rotateNumIE; //转完一圈回到初始状态
                self.rotateNum--;
                self.rotateNumIE--;
            }
            if (self.rotateNumIE % 2 != 0) {
                width = self.picHeight;
                height = self.picWidth;
            }
            self.rotateDeg = self.rotateNum * 90;
            var rotateDeg = "rotate(" + self.rotateDeg + "deg)";
            //$("#bigImage").attr("style", "-webkit-transform:" + rotateDeg + ";-o-transform:" + rotateDeg + ";-moz-transform:" + rotateDeg + ";filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=" + self.rotateNumIE + ")")
            $("#bigImage").attr("style", "-ms-transform:" + rotateDeg + ";-webkit-transform:" + rotateDeg + ";-o-transform:" + rotateDeg + ";-moz-transform:" + rotateDeg + ";filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=" + self.rotateNumIE + ")")
            self.setCssStyle();
            self.getBigImageWH(width, height, self.rotateNumIE, function (w, h) {
                if (w == "auto" && h == "auto") {
                    w = self.picWidth;
                    h = self.picHeight;
                    var percent = parseInt(h) / self.picHeight;
                }
                if (w == "auto" && h != "auto") {
                    var percent = parseInt(h) / self.picHeight;
                    w = self.picWidth * percent;
                }
                if (w != "auto" && h == "auto") {
                    var percent = parseInt(w) / self.picWidth;
                    h = self.picHeight * percent;
                }
                var marginLeft = -parseInt(w) / 2;
                var marginTop = -(self.picHeight * percent) / 2;
                if ($B.is.ie) {
                    if (self.rotateNumIE % 2 != 0) {
                        marginTop = -parseInt(w) / 2;
                        marginLeft = -(self.picHeight * percent) / 2;
                    }
                }
                w = Math.ceil(w);
                self.picHeight = Math.ceil(self.picHeight);
                $("#bigImage").css({ width: w, height: self.picHeight * percent, top: "50%", left: "50%", position: "absolute", marginTop: marginTop + "px", marginLeft: marginLeft + "px" })
            });

        },
        resize: function () {//不同分辨率下的图片宽高设置
	            var self = this;
                //this.isRotate = false;
	            this.imgCurNum = Math.floor(($(window).width() - 120)/70);//屏幕能容纳的图片数量
                var width = self.picHeight;
                var height = self.picWidth;
                if (self.rotateNumIE % 2 == 0) {
                    width = self.picWidth;
                    height = self.picHeight;
                }
                self.setCssStyle();

                self.getBigImageWH(width, height, self.rotateNumIE, function (w, h) {
	            var picShowHeight = self.picShowHeight; //大图的容器高度
	            var picShowWidth = self.picShowWidth; //大图的容器宽度
				if(w != "auto"){w = parseInt(w);};
				if(h != "auto"){h = parseInt(h);};
				var percent = 1;
               if (w == "auto" && h == "auto") {
                    w = self.picWidth;
                    h = self.picHeight;
                    percent = parseInt(h) / self.picHeight;
                }
                if (w == "auto" && h != "auto") {
                     percent = parseInt(h) / self.picHeight;
                    w = self.picWidth * percent;
                }
                if (w != "auto" && h == "auto") {
                     percent = parseInt(w) / self.picWidth;
                    h = self.picHeight * percent;
                }
                if (w != "auto" && h != "auto") {
		            if (w >= picShowWidth && h <= picShowHeight) {//图片宽度大于外层容器时  图片宽度=外层容器
						percent = picShowWidth / self.picWidth;
		                w = picShowWidth + "px";
						h = self.picHeight * percent;
		            }
		            if (w <= picShowWidth && h >= picShowHeight) {//图片高度大于外层容器时  图片高度=外高容器
						percent = picShowHeight / self.picHeight;
		                w = self.picWidth * percent;
						h = picShowHeight + "px";
		            }
		            if (w >= picShowWidth && h >= picShowHeight) {
			            
		                if (w > h) {
							percent = picShowWidth / self.picWidth;
			                w = picShowWidth + "px";
							h = self.picHeight * percent;

		                } else {
							percent = picShowHeight / self.picHeight;
			                h = picShowHeight + "px";
							w = self.picWidth * percent;
		                }
		            }
                }   
                var marginLeft = -parseInt(w) / 2;
                var marginTop = -parseInt(h) / 2;
                if ($B.is.ie) {
                    if (self.rotateNumIE % 2 != 0) {
                        marginTop = -parseInt(w) / 2;
                        marginLeft = -(self.picHeight * percent) / 2;
                    }
                }
                $("#bigImage").css({ width: w, height: h , top: "50%", left: "50%", position: "absolute", marginTop: marginTop + "px", marginLeft: marginLeft + "px" })
                });
        },
        initEvents: function (data) {//初始化事件
            var self = this;
			 if (!data["data"][0].singlePreview) {
                //this.mousemoveout();
                this.imageScroll(data);
                this.autoPlay(data);
				var contentWidth = $("#smallPicLlist").width();
				var picTotalWidth = $("#smallPicLlist ul").width();
				if(picTotalWidth>contentWidth){
					$("#smallPicLlist ul").css({marginLeft:"0"})
				}
            } else {//只显示单张图片，不能切换
                $("#picConsoleWrap").find(".scrollLeft,.scrollRight,.spa-line:first").addClass("hide");
                //$("#picForward,#picNext").remove();
                //$("#picBoxTips").addClass("hide");
            }
            this.mouseWheel(); //鼠标滚轮事件
            this.model.on("change:currentImg", function () {
                self.appendSmallImg();
            })
            $("#fullScreenMode").click(function (e) {
                var target = e.target;
                var id = target.id;
                var obj = [
                    { key: "picBox" },
                    { key: "smallPicBoxWrap" },
                    { key: "picConsoleWrap" },
                    { key: "fullScreenImage" },
                    { key: "fullScreenConsole" }
                ]
                var arr = [];
                for (var i = 0; i < obj.length; i++) {
                    var parent = $(target).parents("#" + obj[i].key);
                    if (parent.length > 0 || id == obj[i].key) {
                        arr.push(i)
                    }
                }
                if (arr.length > 0) {
                } else {
                    self.close();
                }
            });
            
			$("#slideDown").toggle(function(){
				$("#bottomCont").slideUp();
				$(this).removeClass("pageUp").addClass("pageDown");
				//$("#picContent").css({height:self.picShowHeight})
				setTimeout(function(){	self.resize();},500)
			},function(){
				$("#bottomCont").slideDown();
				$(this).removeClass("pageDown").addClass("pageUp");
				setTimeout(function(){	self.resize();},500)
			});
			if(self.compose){
				$("#slideDown").hide();
				$("#bottomCont").hide();
			}
			$(window).resize(function(){
				self.resize();
			})



        },
        appendSmallImg: function () {//分段加载图片 追加缩略图到页面中
            var self = this;
            var currentImg = self.model.get("currentImg");
            var index = self.model.get("loadImageStatus");
            if (self.attachLen) {//是否从附件夹入口进来
                if (currentImg > (50 * index) + 25) {
                    self.model.getImageAttach(function (result) {
                        self.model.set({ loadImageStatus: index + 1 });
                        var len = result.length;
                        var previewImg = [];
                        for (var i = 0; i < len; i++) {
                            var json = result[i];
                            var imgUrl = top.wmsvrPath2 + String.format("/mail?func=mbox:getThumbnail&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&encoding=1", {
                                sid: top.sid,
                                mid: json.mid,
                                size: json.attachRealSize,
                                offset: json.attachOffset,
                                name: json.attachName,
                                type: json.attachType

                            })
                            var temp = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
                            temp = top.wmsvrPath2 + temp.format(json.mid, json.attachOffset, json.attachRealSize, encodeURIComponent(json.attachName), top.sid, json.attachType, json.encode);
                            previewImg.push({
                                imgUrl: imgUrl,
                                fileName: json.attachName,
                                downLoad: temp
                            })
                        }
                        var datasource = {
                            data: previewImg
                        }
                        self.images = self.images.concat(previewImg);
                        var obj = self.getSmallImage(len, currentImg, datasource);
                        $("#smallPicLlist").append(obj.li)
                    })
                }
            }
        },
        /*mousemoveout: function () {//大图上的鼠标移动事件，移到大图的左侧和右侧，出现对应的上一张和下一张按钮
            var self = this;
            $("#picShow").mousemove(function (e) {//class todo name
                var currentImg = self.model.get("currentImg");
                var This = $(this);
                var width = This.width();
                var _x = e.clientX;
                var left = This.offset().left;
                if (_x > left && _x < left + width / 2) {
                    var title = currentImg == 0 ? "已是第一张" : "上一张";
                    $(this).attr("title", title);
                } else {
                    var title = currentImg == self.imgLen - 1 ? "已是最后一张" : "下一张";
                    $(this).attr("title", title);
                }
            })
        },*/
        scrollToLeft: function (obj, data, This) {//向左滚动
            var self = this;
            var currentImg = self.model.get("currentImg");
            var left = 0;
            if (currentImg > 0) {
                $("#picContent img").remove();
                /*if (obj.num1 <= obj.len-1 - currentImg) {
                    if (currentImg >= obj.num1) {
                       left += obj.imgwidth;
                       if(left>0){left=0}
                       $("#smallPicLlist ul").animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
						this.marginLeft = left;
                    }
                    if(currentImg <= obj.num1 && left != 0){
                       left += obj.imgwidth;
                       if(left>0){left=0}
                       $("#smallPicLlist ul").animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
						this.marginLeft = left;
                    }
                }*/
                //if(currentImg>obj.num1&&(obj.len-1 - currentImg)<obj.num2){
	                //left = -(currentImg-obj.num1-1)*obj.imgwidth;
                    //$("#smallPicLlist ul").animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
                //}
                $("#currentImgNum").text(currentImg)
                $("#smallPicLlist li").removeClass("on");
                $("#smallPicLlist li").eq(currentImg - 1).addClass("on");
                self.bigImg = this.images[currentImg - 1].downLoad;
                self.bigName = this.images[currentImg - 1].fileName;
                self.imageLoadedSuccess();
                self.marginLeft = left;
                currentImg--;
                self.model.set({ currentImg: currentImg });
                self.setMarginLeft(); 
            }
        },
        scrollToRight: function (obj, data) {//向右滚动
            var self = this;
            var currentImg = self.model.get("currentImg");
            var left = self.marginLeft;
            if (currentImg < this.imgLen - 1) {
                /*if ( obj.len-1 - currentImg>=obj.num1) {
                    if (currentImg >= obj.num1) {
                        left -= obj.imgwidth;
                        $("#smallPicLlist ul").animate({ marginLeft: left + "px" }, { queue: false, duration: 500 })
			            self.marginLeft = left;
                    }
                }
                
*/ 	        $("#picContent img").remove();
                $("#currentImgNum").text(currentImg + 2)
                $("#smallPicLlist li").removeClass("on");
                $("#smallPicLlist li").eq(currentImg + 1).addClass("on");
                self.bigImg = this.images[currentImg + 1].downLoad;
                self.bigName = this.images[currentImg + 1].fileName;
                self.imageLoadedSuccess();
                self.marginLeft = left;
                currentImg++;
                self.model.set({ currentImg: currentImg });
                self.setMarginLeft();
            }
        },
        imageScroll: function (data) {//图片滚动事件 包括向左滚、向右滚、点击缩略图滚动
            var self = this;
            var max = this.imgCurNum;
            var num1 = parseInt(max / 2);
            var num2 = Math.ceil(max / 2);
            var obj = {
                imgwidth: this.model.get("imgOffsetWidth"),
                num1: num1,//中间偏左的那个
                num2: num2,//中间偏右的那个
                len: this.imgLen
            }
            $(".pictureBox_left").die().live("click", function () {//左边的图片滚动按钮
                self.scrollToLeft(obj, data);


            })
            $(".pictureBox_right").die().live("click", function () {//右边的图片滚动按钮
                self.scrollToRight(obj, data);
            })
            $("#smallPicLlist li").die().live("click", function () {//点击缩略图展现对应的大图
                var currentImg = self.model.get("currentImg");
                var This = $(this);
                var index = This.index();
                if (currentImg == index) {
                    return
                }
                /*if (currentImg < obj.len) {
                    $(".pictureBox_right").removeClass("disable ");
                }
                if (currentImg == 0) {
                    $(".pictureBox_left").addClass("disable ");
                }
*/                self.model.set({ currentImg: index });
                //var left = self.clickSmallImage(index, obj, max);
                //self.marginLeft = left;
                self.bigImg = self.images[index].downLoad;
                self.bigName = self.images[index].fileName;
                $("#currentImgNum").text(index + 1)
                self.imageLoadedSuccess();
                $("#smallPicLlist li").removeClass("on");
                $("#smallPicLlist li").eq(index).addClass("on");
                self.setMarginLeft();
            })

        },
        setMarginLeft : function(){
            var self = this;
            var currentImg = self.model.get("currentImg");
            var max = self.imgCurNum;
            var num1 = parseInt(max / 2);
            var num2 = Math.ceil(max / 2);
            var iNum = 0;
            var obj = {
                imgwidth: self.model.get("imgOffsetWidth"),
                num1: num1,//中间偏左的那个
                num2: num2,//中间偏右的那个
                len: self.imgLen
            }
            if (0<currentImg < obj.len-1) {
                $(".pictureBox_right").removeClass("disable ");
                $(".pictureBox_left").removeClass("disable");
            }
            if (currentImg == 0) {
                $(".pictureBox_left").addClass("disable ");
                $(".pictureBox_right").removeClass("disable ");

            }
            if (currentImg == obj.len - 1) {
                $(".pictureBox_right").addClass("disable");
                $(".pictureBox_left").removeClass("disable");
            }
            var filename = this.images[currentImg].fileName;
            var h1Template = '<h1><img alt="'+filename+'" src="../../images/module/networkDisk/images/big/img.png" class="typePic">'+filename+'</h1>';
			$("#headerBar h1").html(h1Template)
	        if(self.imgLen < max){
		        return;
	        }
            if(currentImg>obj.num2-1 ){
                iNum = currentImg - obj.num2 +1;
            }
            if(obj.num2 > obj.len - currentImg){
				iNum = obj.len - max;
            }
            
            if(currentImg<obj.num2-1){
                iNum = 0;
            }
            $("#smallPicLlist ul").animate({ marginLeft: -iNum*obj.imgwidth + "px" }, { queue: false, duration: 500 })
        },
        clickSmallImage: function (index, obj, max) {
            var self = this;
            var currentImg = self.model.get("currentImg");
            if (index > 0) {//大于第一个
                $(".pictureBox_left").removeClass("disable");
            }
            if (index < obj.len - 1) {//小于最后一个
                $(".pictureBox_right").removeClass("disable");
            }
            if (index == obj.len - 1) {//最后一个
                $(".pictureBox_right").addClass("disable");
            }
            if (index == 0) {//第一个
                $(".pictureBox_left").addClass("disable");
            }
            if (index > obj.len - obj.num2) {
                var left = -(obj.len - obj.num2 - 2) * obj.imgwidth;
                return left
            }
            if (currentImg < index) {//选中的缩略图在当前缩略图右侧
                var left = (index - currentImg) * obj.imgwidth;
                if (index < max) {//最前五个
                    left = self.marginLeft
                    if (index > obj.num1) {
                        left = self.marginLeft + (index - obj.num1) * obj.imgwidth;
                    }
                }
                if (currentImg > obj.len - max) {//最后五个
                    left = self.marginLeft - (obj.len - currentImg - obj.num2) * obj.imgwidth;
                    if (currentImg > obj.len - obj.num2) {
                        left = self.marginLeft
                    }
                } else {
                    left = self.marginLeft - left;
                }
                return left;
            }
            if (currentImg > index) {//选中的缩略图在当前缩略图左侧
                var left = (currentImg - index) * obj.imgwidth;
                if (index > obj.len - max - 1) {//最后五个
                    left = self.marginLeft
                    if (index < obj.len - obj.num2) {
                        left = self.marginLeft + (obj.len - index - obj.num2) * obj.imgwidth;
                        if (currentImg == obj.len - obj.num2 - 1) {
                            left = self.marginLeft + obj.imgwidth;
                        }
                    }
                    return left;
                }
                if (currentImg < max - 1) {//最前五个
                    left = self.marginLeft + (currentImg - obj.num1) * obj.imgwidth;
                    if (currentImg < obj.num1) {
                        left = self.marginLeft
                    }
                } else {
                    left = left + self.marginLeft;
                }
                return left;
            }
        },
        autoPlay: function (data) {//自动播放点击事件
            var self = this;
            /*$("#autoPlay").die().live("click", function () {//
                var This = $(this);
                if (self.autoPlayStatus == false) {
                    self.autoPlayStatus = true;
                    self.autoTime(data, This);
                    return
                } 
            });
	        $("#stopPlay").die().live("click",function(){
	            var This = $(this);
				if(self.autoPlayStatus = true){
	                self.autoPlayStatus = false;
	                clearInterval(self.scrollTime);
	            }   
	        })
*/            $("#palyBtn").die().live("click", function () {//
            
                var This = $(this);
                if (self.autoPlayStatus == false) {
                    self.autoPlayStatus = true;
                    This.attr("title","暂停播放");
                    This.addClass("pause").removeClass("play")
                    self.autoTime(data, This);
                    
                    return
                }else{
                    This.attr("title","自动播放").addClass("play").removeClass("pause");
	                self.autoPlayStatus = false;
	                clearInterval(self.scrollTime);
	            } 
            });

        },
        autoTime: function (data, This) {//自动播放计时器
            var self = this;
            var smallPic = $("#smallPicLlist");
            var smallPicLi = smallPic.find("li");
            var len = this.imgLen;
            self.scrollTime = setInterval(function () {
                var currentImg = self.model.get("currentImg");
                if (currentImg == len - 1) {//播放到最后一个，清除计时器
                    $(".scrollRight i").addClass("unable");
                    clearInterval(self.scrollTime);
                    This.attr("title","自动播放").addClass("play").removeClass("pause");
                    self.autoPlayStatus = false;
	                //self.setMarginLeft();
                    return
                }
                currentImg++;
                self.model.set({ currentImg: currentImg });
                smallPicLi.removeClass("on");
                smallPicLi.eq(currentImg).addClass("on");
                self.bigImg = self.images[currentImg].downLoad;
                self.bigName = self.images[currentImg].fileName;
                $("#currentImgNum").text(currentImg + 1)
                self.imageLoadedSuccess();
                self.setMarginLeft();
            }, 4000);
        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        imageZoomin: function () {//鼠标滚轮放大图片
            if (this.imageSize < 20) {
                this.imageSize++;
                width = this.picWidth * (1 + this.imageSize / 10);
                height = this.picHeight * (1 + this.imageSize / 10);
                $("#fullScreenMode img").css({ width: width, height: height, marginLeft: -width / 2, marginTop: -height / 2 });
            }
        },
        imageZoomout: function () {//鼠标滚轮缩小图片
            if (this.imageSize > -9) {
                this.imageSize--;
                width = this.picWidth * (1 + this.imageSize / 10);
                height = this.picHeight * (1 + this.imageSize / 10);
                $("#fullScreenMode img").css({ width: width, height: height, marginLeft: -width / 2, marginTop: -height / 2 });
            }
        },
        mouseWheel: function () {//鼠标滚轮事件  放大缩小图片 10%-300%
            var self = this;
            $("#fullScreenImage").die().live("mousewheel", function (event, delta) {

                if (delta > 0) {

                    self.imageZoomin();
                }
                if (delta < 0) {
                    self.imageZoomout();
                }
            });
        },
        onKeyUp: function (event) {
            var self = event.data.self;
            var obj = event.data.obj;
            var data = event.data.data;
            var keycode = event.which || event.KeyCode;
            if (keycode == 27) {//ESC键  退出幻灯片

                if ($("#focusImages").hasClass("hide")) {
                    var id = $("#fullScreenMode");
                } else {
                    var id = $("#focusImages");
                };
                self.close();
            }
            if (keycode == 38) {//up   放大
                if (self.fullScreen) {
                    self.imageZoomin();
                } else {
                    self.scrollToLeft(obj, data);
                }
            }
            if (keycode == 40) {//down  缩小
                if (self.fullScreen) {
                    self.imageZoomout();
                } else {
                    self.scrollToRight(obj, data);
                }
            }
            if (keycode == 37 || keycode == 33) {// left PageUp  向左滚动
                $("#fullScreenMode img").css({ width: "auto", height: "auto" });
                self.imageSize = 0;
                self.fullScreenKeyLR();
                self.scrollToLeft(obj, data);
            }
            if (keycode == 39 || keycode == 34) {// right pageDown 向右滚动
                $("#fullScreenMode img").css({ width: "auto", height: "auto" });
                self.imageSize = 0;
                self.fullScreenKeyLR();
                self.scrollToRight(obj, data);
            }
            event.preventDefault();
        },
        eventKeyCode: function (data) {//键盘事件
            var smallPic = $("#smallPicLlist");
            var self = this;
            var max = this.model.get("imgNum");
            var obj = {
                smallPic: smallPic,
                smallPicLi: smallPic.find("li"),
                imgwidth: this.model.get("imgOffsetWidth"),
                num1: parseInt(max / 2),
                num2: Math.ceil(max / 2),
                len: this.imgLen
            }
            $(document).bind("keyup", { self: self, obj: obj, data: data }, top.focusImagesView.onKeyUp)
        },
        onMouseDown: function (dragEvent) {//图片拖动效果 按下鼠标
            var self = this;
            self.mouseX = dragEvent.clientX;
            self.mouseY = dragEvent.clientY;
            var imgLeft = $("#fullScreenImage").css("marginLeft");
            var imgTop = $("#fullScreenImage").css("marginTop");
            self.imgLeft = parseInt(imgLeft.replace("px", ""));
            self.imgTop = parseInt(imgTop.replace("px", ""));
            self.moveStatus = true;
            $(document).bind("mousemove", { self: self }, top.focusImagesView.onMouseMove);
            $(document).bind("mouseup", { self: self }, top.focusImagesView.onMouseUp);
            dragEvent.preventDefault();
        },
        onMouseMove: function (dragEvent) {//图片拖动效果 鼠标移动
            var self = dragEvent.data.self;
            var _x = dragEvent.clientX;
            var _y = dragEvent.clientY;
            var left = _x - self.mouseX;
            var top = _y - self.mouseY;
            left = self.imgLeft + left;
            top = self.imgTop + top;
            if (self.moveStatus == true) {
                $("#fullScreenImage").css({ marginLeft: left, marginTop: top });
                dragEvent.preventDefault();

            }
        },
        onMouseUp: function (dragEvent) {//图片拖动效果 松开鼠标
            var self = dragEvent.data.self;
            $("#fullScreenMode").unbind("mousemove", top.focusImagesView.onMouseMove);
            $("#fullScreenMode").unbind("mouseup", top.focusImagesView.onMouseUp);
            self.moveStatus = false;
        },
        imgDrag: function () {
            var self = this;
            $("#fullScreenImage").bind("mousedown", top.focusImagesView.onMouseDown)


        },
        fullScreenKeyLR: function () {//  全屏状态下使用左右方向键
            var self = this;
            if (self.fullScreen == true) {
                //var fullid = $("#fullScreenMode");
                //var normalid = $("#focusImages");
                self.fullScreen = false;
                $("#fullScreenMode").addClass("hide");
                //$("#focusImages").removeClass("hide");
            }

        },
        close: function () {
            this.autoPlayStatus = false;
            clearInterval(this.scrollTime);
            self.fullScreen = false;
            $("#fullScreenMode").addClass("hide");
            //$("#focusImages").removeClass("hide");
            //$(document).unbind("keyup", top.focusImagesView.onKeyUp);
            //this.remove();
        }
    }));



})(jQuery, _, M139);
﻿/**   
* @fileOverview 普通模式读信
*/
(function (jQuery, _, M139) {

    $User = {
        getUid: function () {
            var mo = $T.Url.queryString("mo");
            mo = M139.Text.Mobile.add86(mo)
            return mo;
        }
    }
    /**
    *@namespace 
    *在线预览MODEL层
    */

    M139.namespace("M2012.Service.OnlinePreview.Model", Backbone.Model.extend({

        defaults: {
            initData: null,
            isLoad: false, //是否已加载，resize时不再加载
            hasTips: true,
            dataSource: null,
            sid: $T.Url.queryString("sid"),
            mobile: $T.Url.queryString("mo"),
            loginName: $T.Url.queryString("loginName"),
            mid: $T.Url.queryString("mid"),
            nav: [],
            currentPage: 1,
            pptLen: 0,
            opes: $T.Url.getAbsoluteUrl("/mw2/opes/"),
            unzippath: $T.Url.queryString("unzippath"),
            comefrom: $T.Url.queryString("comefrom"),
            timeout: false,//附件加载超时
            currentSheet : 1
        },
        message: {
            relogin: "您已经退出邮箱，请重新<a href='http://mail.10086.cn' target='_blank'>登录</a>"
        },
        callApi: M139.RichMail.API.call,
        timeOut: function (data) {
            var self = this;
            var num = 0;
            var filedownurl = data.filedownurl;
            var t = setInterval(function () {
                num++;
                if (self.get("timeout")) {
                    clearInterval(t);
                }
                if (num > 180) {
                    var obj = {
                        dl: filedownurl
                    }
                    var mainView = new M2012.Service.OnlinePreview.View();
                    var html = mainView.loadingErrorHtml(obj);
                    $("#loadingStatus").html(html);
                    clearInterval(t);
                }

                //日志上报
                self.timeoutLogger({
                    url: data.url,
                    num: num,
                    filename: data.filename
                })

            }, 1000)
        },
        timeoutLogger: function (options) {
            //每一分钟整上报一次记录
            var self = this;
            var num = options.num;
            if (num % 60 == 0) {
                self.logger({
                    url: options.url,
                    msg: "OVER_" + num + "S_NO_RESPONSE",
                    filename: decodeURIComponent(options.filename)
                })
            }
        },
        getData: function (options, callback, callback1) {
            var self = this;
            var src = options.url; //"/mw/opes/preview.do?";
            var filedownurl = decodeURIComponent(options.filedownurl);
            var filename = options.filename;
            var filePsw = options.filePsw || "" ;
            try {
                filename = decodeURIComponent(filename);
                filename = encodeURIComponent(filename);
            } catch (e) {
                filename = encodeURIComponent(filename);
            }
            var data = {
                url: options.url,
                account: '',
                fileid: options.fileid,
                browsetype: options.browsetype,
                filedownurl: filedownurl,
                filename: filename,
                unzipPath: options.unzippath,
                comefrom: options.comefrom,
                sid: options.sid,
                longHTTP: "true",
                filePsw : filePsw 
            };
            self.timeOut(data);
            this.callApi(src, data, function (result) {
                self.set({ timeout: true });
                self.logger({
                    url: options.url,
                    responseText: result.responseText,
                    code: (result.responseData && result.responseData.code) || '',
                    filename: filename
                });
                callback(result.responseData);
            }, {
	            
                error: function () {
                    if (callback1) {
                        var obj = {
                            dl: filedownurl
                        }
                        var mainView = new M2012.Service.OnlinePreview.View();
                        var html = mainView.loadingErrorHtml(obj);
                        callback1(html);
                    }
                    self.logger({
                        level: "ERROR",
                        url: options.url,
                        msg: "ONLINE_PREVIEW_ERROR",
                        responseText: '',
                        code: "-1",
                        filename: decodeURIComponent(options.filename)
                    });
                }
            })
        },


        /**
        * 附件格式验证
        */
        checkFile: function (fileName) {
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|mp4|flv|m4v|f4v)$/i;
            var reg2 = /\.(?:rar|zip|7z)$/i;

            if (reg.test(fileName)) {
                return 1;
            } else if (reg2.test(fileName)) {
                return 2;
            } else {
                return -1;
            }
        },
        checkFileType: function (filename) {//验证返回具体的后缀名
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2); //后缀名  
            file = file.toLowerCase();
            switch (file) {
                case "ppt":
                case "pptx":
                    return "ppt";
                case "txt":
                //case "html":
                //case "htm":
                    return "txt";
                case "rar":
                case "zip":
                case "7z":
                    return "rar";
                case "xls":
                case "xlsx":
                    return "xls";
                case "doc":
                case "docx":
                    return "doc";
                case "pdf":
                    return "pdf";
                case "jpg":
                case "jpeg":
                case "jpe":
                case "jfif":
                case "gif":
                case "png":
                case "bmp":
                case "ico":
                	return "img";
                case "mp4":
                case "flv":
                case "f4v":
                case "m4v":
                	return "video";
            }
            return file;
        },
        getPreViewUrl: function (file, initData) {//附件的下载地址
            var ssoSid = this.get("sid");
            var url = 'http://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:download',
                mid: initData.id,
                offset: file.fileOffSet,
                size: file.fileSize,
                sid: ssoSid,
                type: file.attachType || file.type,
                encoding: file.encode || file.encoding
            }) + '&name=' + encodeURIComponent(file.fileName);

        },
        getPreViewUrlForCompose: function (file) {//写信附件的下载地址
            var ssoSid = this.get("sid");
            var url = 'http://' + location.host + "/RmWeb/view.do";
            return M139.Text.Url.makeUrl(url, {
                func: 'attach:getAttach',
                fileName: file.fileName,
                fileId: file.fileId,
                sid: ssoSid
            });

        },
        getAttachImageUrl : function(fileId, fileName, fullUrl) { //写信页图片地址
        	var sid = this.get("sid");
		    var url = "/RmWeb/view.do?func=attach:getAttach&sid="+sid+"&fileId="+fileId + "&fileName=" + encodeURIComponent(fileName);
		    if(fullUrl)url = "http://" + location.host + url;
		    return url;
		},
        /**
        * 获取其他附件url
        * @param {object} p 附件属性
        */
        getUrl: function (p) {
            var ucDomain = domainList[1].webmail;
            var uid = this.get("mobile");
            var loginName = this.get("loginName");
            var ssoSid = this.get("sid");
            var skinPath = "skin_green";
            var rmResourcePath = location.host + "/m2012";
            var diskInterface = domainList.global.diskInterface;
            var disk = domainList.global.disk;

            var params = {
                fi: encodeURIComponent(p.fileName),
                mo: uid,
                sid: ssoSid,
                id: p.contextId || "",
                src: p.type || "attach",
                loginName: loginName,
                comefrom: p.comefrom || "readmail",
                composeId: p.composeId || "",
                skin: skinPath,
                resourcePath: encodeURIComponent(rmResourcePath),
                diskservice: encodeURIComponent(diskInterface),
                filesize: p.fileSize || "",
                encoding: 1,
                disk: disk,
                rnd: Math.random()
            }
            if (p.downloadUrl) $.extend(params, { dl: p.downloadUrl });
            var previewUrl = $T.Url.makeUrl("/m2012/html/onlinepreview/online_preview.html", params);
            return previewUrl;
        },
        getAttach: function (callback,error) {//读信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                fid: initData.fid,
                mid: initData.id,
                autoName: 1, //有些附件会没有文件名，此属性自动命名附件
                markRead: 1,
                returnHeaders: { Sender: "", "X-RICHINFO": "" }, //为订阅平台增加参数
                filterStylesheets: 0,
                filterImages: 0,
                filterLinks: 0,
                keepWellFormed: 0,
                header: 1,
                supportTNEF: 1,
                returnAntispamInfo: 1
            };
            $RM.readMail(data, function (result) {
                if (result && result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }else{
	                if(error){
		                error(result)
	                }
                }
            });
        },
        getAttachForCompose: function (callback) { //写信页获取所有附件列表
            var self = this;
            var initData = this.get('initData');
            var data = {
                id: initData.composeId
            };
            
            this.callApi("attach:refresh", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
        logger: function (options) {
            var url = [
                "http://" + location.host + "/" + (options.url || location.href || ""),
                "code=" + (options.code || ''), //手工拼接字段code，用于运维统计成功率
                "filename=" + (options.filename || '') //记录filename方便查找日志
            ].join("|");
            M139.Logger.sendClientLog({
                level: options.level || "INFO",
                name: "RichMailHttpClient",
                url: url,
                errorMsg: options.msg || "NULL",
                responseText: options.responseText || ''
            });
        }
    }));

})(jQuery, _, M139);

﻿

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone

    M139.namespace('M2012.Service.OnlinePreview.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.initData = null;
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            $("body").focus();
            $("#previewContent").css({ background: "#ececec", height: "1900px" })
            var self = this;
            var obj = $Url.getQueryObj();		

            self.model.set({ initData: obj })//保存地址栏的参数到model
            if (obj.comefrom && obj.comefrom == "compose") {//从标准的写信页入口进来
                self.model.set({ comefrom: obj.comefrom });
                self.getAllAttachForCompose(obj);
                
                //return
            }
            if (obj.comefrom && obj.comefrom == "draftresend") {//回复 全部回复  草稿箱 再次发送 入口进来
                $(".btnLi:gt(2)").remove();
            }
            if (obj.src == "email") {
                self.getAllAttach(obj);
            }else{
	            $(".btnLi:gt(2)").remove();//彩云和附件夹的入口进来没有其它附件
            }
            obj.fi = decodeURIComponent(obj.fi);
            self.checkFileTypeToRender(obj);
            this.initEvents();
        },
        doPrint: function () {//打印iframe里面的内容
            $("#print").click(function () {
                var type = $(this).attr("filetype");
                if (type == "doc" || type == "ppt") {
                    $("#attrIframe iframe")[0].contentWindow.print();
                }
                else {
                    window.print();
                }
            })
        },
        appendHeaderHtml: function (obj) {//进入页面初始状态下的页面展现，只展现头部 

            var str = $("#topTemplate").val();
            var rp = new Repeater(str);
            var filename = obj.fi;
            var filesize = obj.fileRealSize;
            try {
                filename = decodeURIComponent(filename);
            } catch (e) { }
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2); //后缀名  
            var filetype = this.model.checkFileType(filename); //是否是压缩包文档   true 是  false 否
            var dl = decodeURIComponent(obj.dl);
            var downloadurlNet = dl;
            var part = getCookie("cookiepartid");
            var obj1 = domainList[part];
            if (this.unzippath) {
                downloadurlNet = dl.replace("http://smsrebuild0.mail.10086.cn", "");
                downloadurlNet = obj1.rarPreviewSaveDisk + downloadurlNet; //存彩云的下载地址
            }
            rp.Functions = {
                getPrint: function () {
                    var html = filetype == "rar" ? '' : '  <a filetype="' + filetype + '" id="print" class="btnTb" href="javascript:;">打印</a>  ';
                    return html;
                },
                getSaveDisk: function () {
                    //console.log(downloadurlNet)
                    var html = obj.src == "disk" ? '' : '  <a fi="' + filename + '" class="btnTb" fs="' + filesize + '" dl="' + downloadurlNet + '" id="saveNet" href="javascript:;">存彩云网盘</a>';
                    return html;
                }
            }
            try {
                filename = decodeURIComponent(filename);
                //filename = $T.Html.encode(filename);
            } catch (e) { 
            }
            var attrDisplay = obj.src == "disk" || obj.comefrom == "attach" ? "none" : "";
            var tableArr = [
                {
                    filename: filename,
                    filesize: M139.Text.Utils.getFileSizeText(obj.filesize),
                    href: dl,
                    display: "none",
                    attrDisplay: attrDisplay,
                    filetype: file,
                    fileImg:filetype+'.png'
                }
            ]
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#headerBar").html(html)
            if ((obj.comefrom && obj.comefrom == "draftresend") ||obj.src == "disk" ) {//回复 全部回复  草稿箱 再次发送 入口进来
                $(".btnLi:gt(2)").remove();//草稿箱，彩云和附件夹的入口进来隐藏附件列表
            }
        },
        passwordIntBox :function(obj){
            var str = $("#passwordInput").val();
            var rp = new Repeater(str);
            var filename = obj.fi;
            var num1 = filename.lastIndexOf(".");
            var num2 = filename.length;
            var file = filename.substring(num1 + 1, num2); //后缀名 
            try {
                filename = decodeURIComponent(filename);
                filename = decodeURIComponent(filename);
            } catch (e) { }
            if(filename.length>16){
	            filename = filename.slice(0,13)+"…."+file;
            }
            var tableArr = [ {filename: filename}]
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#passBox").show().html(html).css({zIndex:9999,position:"absolute",left:"50%",top:"50%",marginLeft:"-181px",marginTop:"-74px"});
			var o = document.getElementById('passBox');
            $D.setDragAble(o,{
	            handleElement:".boxIframeTitle"
            });
            $(".i_t_close,.btnNormal").click(function(){
	            $("#passBox").hide();
	            $('.loading-pop').html("此文档已加密！")
            });
            function GetBytes(str){
			    var len = str.length;
			    var bytes = len;
			    for(var i=0; i<len; i++){
			        if (str.charCodeAt(i) > 255) bytes++;
			    }
			    return bytes;
			}
	        
        },
        checkFileTypeToRender: function (obj, comefrom) {//根据文件类型的不同，展现不同的UI 
            var type = this.model.checkFileType(obj.fi);
            var self = this;
            switch (type) {
                case "ppt":
                case "pdf":
                    var pptView = new M2012.Service.OnlinePreview.Ppt.View();
                    pptView.render(obj);
                    break
                case "html":
                case "doc":
                case "txt":
                    var docView = new M2012.Service.OnlinePreview.Doc.View();
                    docView.render(obj);
                    break
                case "rar":
                	top.loadCSS(["module/picture.css"], document)
                    var rarView = new M2012.Service.OnlinePreview.Rar.View();
                    rarView.render(obj);
                    break
                case "xls":
                    var xlsView = new M2012.Service.OnlinePreview.Xls.View();
                    xlsView.render(obj);
                    break
                case "img":
                    var imgView = new M2012.Service.OnlinePreview.Img.View();
                    imgView.render(obj);
                    break
                case "video":
                    new M2012.Service.OnlinePreview.Video.View().render(obj);
                    break
            }

        },
        /** 
        *附件存彩云
        */
        saveToDiskRequest: function (url, fileName, packSave, fileSize) {
            var saveToDiskview = new M2012.UI.Dialog.SaveToDisk({
                fileName: fileName,
                fileSize: fileSize,
                downloadUrl: url
            });
            saveToDiskview.render().on("success", function () {
                //存彩云成功记日志
                if (packSave) {
                    BH("readmail_savediskall");
                } else {
                    BH("readmail_savedisk");
                }
            });
        },
        getAttachList: function (result, initData) {//拼装其他附件列表，并输出html
            //console.log(result)
            //console.log(result.length)
	        this.arrListUrl = [];//附件Url
	        this.currentLi = 0;
            var self = this;
            var len = result.length;
            var filterLen = 0;
            var list = '';
            var num = 0;
            var arr = [];
            var filterList = [];
            var previewImg = [];
            var liNum = '<li class="hd">可预览共 {num} 个附件</li>'
            var li = '<li class="{on}" index="{index}"><a href="{url}" class="attachLnk"><img src="../../images/module/networkDisk/images/medium/{filetype}.png" alt="{filename}">{filename}</a></li>';
            for (var i = 0; i < len; i++) {
                var f = result[i];
                var filename = f.fileName;
	            var type = self.model.checkFile(filename);
                if (type != -1) {
	                filterList.push(result[i])
                }
			}
			filterLen = filterList.length;
            for (var i = 0; i < filterLen; i++) {
                var f = filterList[i];
                var filename = f.fileName;
                var curOn = ""; 
                var num1 = filename.lastIndexOf(".");
                var num2 = filename.length;
                var filetype = this.model.checkFileType(filename) //后缀名  
                
                var data = self.getAttrImages(f, initData)
                
                if (data["index"] != "null") {
                    previewImg.push({
                        imgUrl: data.imgUrl,
                        fileName: filename,
                        downLoad: data.downloadUrl
                    });
                }
	            if(filename == $(".typePic").attr("alt")){
	                curOn = "on";
	                this.currentLi = i+1;
	            }
                num++;
                list = $T.Utils.format(li, { on: curOn,url: data.previewUrl, target: data.target, filetype: filetype, filename: filename, index:data.index });
                arr.push(list);
                this.arrListUrl.push(data.previewUrl);

            }
            if (arr.length < 2) {
                $(".btnLi:gt(2)").remove();
            }
            if (arr.length > 10) {
                $("#attachList").css({ height: "393px", overflowY: "scroll" });
            }
            liNum = $T.Utils.format(liNum,{num: num});
            arr.unshift(liNum);
            self.previewImg = previewImg;
            list = arr.join("");
            $("#attachList").html(list);
			if(this.currentLi <=1){
				$("#leftBtn a").addClass("disable");
			}
			if(this.currentLi >=this.arrListUrl.length ){
				$("#rightBtn a").addClass("disable");					
			}
        },
        getAllAttachForCompose: function (initData) {//得到邮件里所有附件的列表   写信页的入口
            var self = this;
            this.imgNum = 0;
            this.model.getAttachForCompose(function (dataSource) {
                var len = dataSource.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    if (dataSource[i].fileRealSize < 1024 * 1024 * 20) {
                        arr.push(dataSource[i]);
                    }
                }
                self.getAttachList(arr, initData);
            })
        },
        getAllAttach: function (initData) {//得到邮件里所有附件的列表
            var self = this;
            this.imgNum = 0;
            this.model.getAttach(function (dataSource) {
                var result = dataSource["attachments"];
                var len = result.length;
                var arr = [];
                for (var i = 0; i < len; i++) {
                    if (result[i].fileRealSize < 1024 * 1024 * 20) {
                        arr.push(result[i]);
                    }
                }
                self.getAttachList(arr, initData);
            })
        },
        getAttrImages: function (f, initData) {//从所有附件中筛选出图片附件
            var self = this;
            var comefrom = this.model.get("comefrom");
            var composeUrl = self.model.getPreViewUrlForCompose(f);
            var readmailUrl = self.model.getPreViewUrl(f, initData);
            var downloadUrl = comefrom == "compose" ? composeUrl : readmailUrl;
            var obj = {
                fileName: encodeURIComponent(f.fileName),
                fileSize: f.fileSize,
                downloadUrl: encodeURIComponent(downloadUrl),
                type: initData.src,
                contextId: initData.id,
                comefrom: comefrom,
                composeId: initData.composeId

            }
            var previewUrl = self.model.getUrl(obj);
            var target = "_blank";
            var index = "null";
            var isImg = /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(f.fileName);
            if (isImg) {
                var imgUrl = "";
                var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                    sid: this.model.get("sid"),
                    mid: initData.id,
                    size: f.fileSize,
                    offset: f.fileOffSet,
                    name: f.fileName,
                    type: f.type,
                    width: 72,
                    height: 72,
                    quality: 80
                });
                this.imgNum++;
                index = this.imgNum - 1;
                //previewUrl = "javascript:;";
                target = "_self";
                imgUrl = comefrom == "compose" ? imgUrl : imgUrl;
            };
            var dataSource = {
                previewUrl: previewUrl,
                target: target,
                index: index,
                imgUrl: imgUrl,
                downloadUrl: downloadUrl
            };

            return dataSource;
        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        initEvents: function () {//初始化事件
            var self = this;
            this.doPrint();
            $("#saveNet").die().live("click", function () {//存彩云
                var btnElem = $(this);
                var dl = btnElem.attr("dl");
                var fi = btnElem.attr("fi");
                var fs = btnElem.attr("fs");
                self.saveToDiskRequest(dl, fi, true, fs);
            });
            $("#allAttr").live("click", function () {//其他附件列表的入口，点击异步加载
                //$("#pagerSelect").hide();
                var objParent = $(".sliderUl");
                objParent.show();
                var options = {
                    action: "click",
                    element: objParent[0],
                    stopEvent: true,
                    callback: function () {
                        objParent.attr("bindAutoHide", "0");
                        objParent.hide();
                        if (!$("#focusImages")) {
                            $("#pagerSelect").show();
                        }
                    }
                }
                self.bindAutoHide(options);
            });
            //$("#attachList li").live("click", function () {//点击其他附件列表新窗口打开该附件
               // var num = $(this).attr("index");
              //  if (num != "" && num != "null") {
                    //var status = $("#jonMark").length;
                    //if (status > 0) {
                       // return
                    //}
                    //top.$("body").append('<div class="jon-mark" id="jonMark" style="z-index:9999"><img style="position:absolute;top:50%;left:50%" src="/m2012/images/global/load.gif" /></div>')
                   // top.focusImagesView = new M2012.OnlinePreview.Focusimagesemail.View();
                    //top.focusImagesView.render({ data: self.previewImg, num: parseInt(num) });

              //  }
           // });
            //$("#attachList li").live("mouseover", function () {//其他附件列表mouseover mouseout
                //$(this).addClass("on");
            //});
            //$("#attachList li").live("mouseout", function () {
               // $(this).removeClass("on");
           // });
           	$("#leftBtn").live("click",function(){ //切换上一个附件
	           	var iTemp = self.currentLi -1;
	           	if(iTemp < 1 ){
		           	return;
	           	}
	           	goToUrl(iTemp);
           	})
           	$("#rightBtn").live("click",function(){//切换下一个附件
	           	var iTemp = self.currentLi +1;
	           	if(self.arrListUrl.length<iTemp){
		           	return;
	           	}
	           	goToUrl(iTemp);
           	})
            $("#refreshPage,#refreshPage2").live("click", function () {//加载失败时重试
                var href = location.href;
                location.href = href;
            });

            $("#rightTools .zoomOpt").live("click",function(){//select选择比例放大
           

	            var scale = $(this).html(),
	            	iZoomScale = parseInt(scale)/100;
	            	
	            $("#rightTools .zoomOpt").each(function(){
		            $(this).removeClass('on');
	            });
				$(this).addClass('on');
				if(M139.Browser.is.firefox){
					$($("#docIframe")[0].contentWindow.document.body).css({MozTransform :"scale("+iZoomScale+")"});
				}else{
					$($("#docIframe")[0].contentWindow.document.body).css({zoom:iZoomScale});
				}	                        
				$(".zoomNow").html(scale);
				$(".zoomRate").css({width:parseInt(scale)/2})
	            
            });

            $(".zoomM").live("click",function(e){//页面缩小
	            var oEvent = M139.Event.getEvent(e),
	                sClassName = oEvent.target.className;
	            changeZoom(sClassName);
            });
            $(".zoomA").live("click",function(e){ //页面放大
	            var oEvent = M139.Event.getEvent(e),
	                sClassName = oEvent.target.className;
	            changeZoom(sClassName);
	            });
			$(".zoomRange").live('click',function(e){//点击滑动条页面放大
				var oEvent = M139.Event.getEvent(e),
					newZoom = oEvent.clientX - $(this).offset().left;
				if(newZoom<5) return;
				toZoom(newZoom);
			});
			$(".zoomBtn").live('mousedown',function(e){//拖动滑动条页面放大
				M139.Event.stopEvent(e);
				var oEvent=M139.Event.getEvent(e),
					oBox = $(".zoomBox2"),
					disX=oEvent.clientX-$(this).offset().left,
					iParentLeft = $(".zoomRange").offset().left;
				oBox.bind('mousemove',fnMove);
				oBox.bind('mouseup',fnUp);
				$(document).bind('mouseup',fnUp)
				$($("#docIframe")[0].contentWindow.document).bind('mouseup',fnUp)
				function fnMove(ev){
					var oEvent=M139.Event.getEvent(ev),
					    L = oEvent.clientX+disX-iParentLeft;
					L < 5 ? L = 5:L=L;
					L > 100 ? L = 100:L=L;
					toZoom(L);
				};
				function fnUp(){
					$(oBox).unbind();
					return false;
				};
			});
			function changeZoom(sClassName){ //点击放大缩小按样式判断执行
	            var oldZoom = parseInt($(".zoomRate").css("width")),newZoom;
				if(sClassName == 'zoomM'){
					newZoom = oldZoom -5;
				}else{
					newZoom = oldZoom +5;			
				};
	            if( newZoom >= 5 && newZoom <=100){
		            if(newZoom%5 !=0){newZoom = Math.round(newZoom/10)*10;}
		            toZoom(newZoom); 
	            };
			};
			function toZoom(newZoom){ //执行view变化
				$(".zoomRate").css({width:newZoom})
				var iScale = parseInt(newZoom)/50;
				if(M139.Browser.is.firefox){
					$($("#docIframe")[0].contentWindow.document.body).css({MozTransform :"scale("+iScale+")"});
				}else{
					$($("#docIframe")[0].contentWindow.document.body).css({zoom:iScale});
				}	            
				$(".zoomNow").html(newZoom*2+"%");	
	            $("#rightTools .zoomOpt").each(function(){
		            $(this).removeClass('on');
	            });
			};
			function goToUrl(index){//跳转附件
				var index = index-1;
				var temp = 'http://' + location.host + self.arrListUrl[index];
				location.href = temp;
			};
        },
        loadingErrorHtml: function (obj) {//加载失败的提示
            var url = decodeURIComponent(obj.dl);
            var text = obj.text ? obj.text : "请检查您的网络，还可以：<br><br>1、<a id='refreshPage2' href='javascript:' >重试</a> 或 <a id='refreshPage2' href='"+url+"' >下载</a> 至本地查看。<br>2、清除浏览器缓存后再次预览。 ";
            var html = ['<div class="bg-cover"></div><!--bg-cover-->',
                '<div class="load-fail-pop">',
                '<em><i class="i-fail-ico"></i></em>',
                '<h4>加载失败</h4>',
                '<p>' + text + '</p>',
                '<div style="display:' + obj.display + '"><a id="refreshPage" href="javascript:;" class="nor-btn mr_10">重试</a><a href="' + url + '" class="nor-btn">下载</a></div>',
                '</div>'].join("");
            return html;
        }
    }));
    var onlinePreviewView = new M2012.Service.OnlinePreview.View();
    onlinePreviewView.render();
})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义树目录组件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.TreeView.MainView";
    M139.namespace(namespace, superClass.extend(
     /**
      *@lends M2012.UI.TreeView.MainView".prototype
      */
    {
        /** 树目录组件
        *@constructs M2012.UI.TreeView.MainView
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {Array} options.treeViewContainer 定义树视图的容器路径
        *@param {Array} options.nodeTemplate 定义子节点的html结构
        *@param {Array} options.nodeLabel 定义子节点的标题路径
        *@param {Array} options.nodeLabelIcon 定义子节点的图标元素路径
        *@param {Array} options.nodeSwitchButton 定义子节点的展开状态开关元素
        *@param {Array} options.nodes 定义子节点数据源
        *@example
        */
        initialize: function (options) {
            if (options.el) {
                var $el = $(options.el);
                $el.html(options.template);
            } else {
                var $el = jQuery(options.template);
            }

            this.model = new Backbone.Model();
            this.nodes = options.nodes;


            this.setElement($el);

            return superClass.prototype.initialize.apply(this, arguments);
        },

        defaults: {
            name: namespace
        },
        
        render: function () {
            var options = this.options;
            this.treeViewContainer = this.$(options.treeViewContainer);
            

            this.initEvent();
            this.renderNodes();
			this.updatePathTip();
            return superClass.prototype.render.apply(this, arguments);
        },

        initEvent:function(){
            this.model.on("change:selectedNode", function (model,node) {
                var lastNode = model.previous("selectedNode");
              	var curNode = model.get("selectedNode");
                if (lastNode) {
                    lastNode.unselect();
                }
                if(curNode){
	                var curNodeEl = curNode.$el;
	                curNodeEl[0].scrollIntoView();
		            var textEl = $(model.get("selectedNode").$el).find("span").eq(0);

	                textEl.css({
	                    color: "white",
	                    background: "rgb(50,119,222)"
	                });

                }
				
                this.updatePathTip();

            },this);
            
        },
        getSelectPath:function(){
            var node = this.model.get("selectedNode");
            var path = [];
            while (node) {
				if(node.text == "彩云网盘"){
					node.text = "全部文件";
				}
				var nodeId = node.tag.directoryId;
				var nodeText = node.text;
				nodeText = M139.Text.Utils.getTextOverFlow(nodeText, 5, false);//夹断文件夹名;
                path.unshift('<a href="javascript:void(0);" nodeid="'+ nodeId +'">'+ nodeText +'</a>');
				//path.unshift(nodeText);
                node = node.parentNode;
            }
            return path;
        },

        /**
         *上面显示选中的路径
         */
        updatePathTip:function(){
			//debugger;
			var This = this;
           var path = this.getSelectPath();
		// 移动到顶部   
        //   for (var i = 0; i < path.length; i++) {
        //       path[i] = M139.Text.Utils.getTextOverFlow(path[i], 5, false);//夹断文件夹名
        //   }
			var newPath = [];
			var length = path.length;
			if(length > 5){
				newPath = [path[0], path[1], '...', path[length-2], path[length-1]];
			}else{
				newPath = path;
			}
           this.$(".attrsavediskP").html("" + newPath.join(" > "));
            //this.$(".attrsavediskP").text("保存至：彩云网盘");
			this.$(".attrsavediskP a").unbind("click").bind("click",function(){
				var thisid = $(this).attr("nodeid");
				This.options.selectedId = thisid;
				//This.renderNodes();
				This.onNodeSelected(This.containers[thisid]);
			});
        },
		containers:{},
        onNodeSelected:function(node){
            this.model.set("selectedNode", node);
			this.updatePathTip();
        },
        renderNodes: function () {
            var This = this;
            var options = this.options;
		//	debugger;
            var nodesLen = this.nodes.length;
            for (var i = 0; i < nodesLen; i++) {
                var item = this.nodes[i];
                var node = new M2012.UI.TreeView.NodeView({
                    tree: this,
                    depth:0,
                    text: item.text,
                    tag: item.tag,
                    childNodes : item.childNodes,
                    template: options.nodeTemplate,
                    label: options.nodeLabel,
                    labelIcon: "a > i:eq(1)",
                    switchButton: "a > i:eq(0)",
                    childContainer: options.nodeChildContainer,
                    container: this.treeViewContainer,
                    selectedId : options.selectedId, // add by tkh
                    containers : This.containers
                });
                node.render();

                
				if(This.containers[item.directoryId] != 'undefined'){
					This.containers[item.directoryId] = node ;
				}
				// add by tkh 默认选中元素
				if(options.selectedId){
					if(options.selectedId == item.tag.directoryId){
						node.select();
					}
				}else{
					if (node.tag.directoryId === 10) {
	                    node.select();//选中根元素
	                }
				}
            }
        }
    }));
    var DefalutStyle = {
        template: [
 			'<p class="attrsavediskP">',//电影存盘<span class="fsongt">&gt;</span>港台电影
 			'</p>',
 			'<div class="attrsavedisk">',
 			'<ul>',
 			'</ul>',
 			'</div>'].join(""),
        nodeTemplate:['<li>',
            '<a href="javascript:;" class="on txtd"><i class="i_plus"></i><i class="i_wjj"></i><span>text</span></a>',
            '<ul></ul>',
        '</li>'].join(""),
        nodeLabel: "a:eq(0)",
        nodeLabelIcon: "a > i:eq(1)",
        nodeSwitchButton: "a > i:eq(0)",
        nodeChildContainer: "ul",
        treeViewContainer: ".attrsavedisk > ul"
    };

    jQuery.extend(M2012.UI.TreeView, {
        create: function (options) {
            options = _.defaults(options, DefalutStyle);
            return new M2012.UI.TreeView.MainView(options);
        }
    });
})(jQuery, _, M139);
﻿/**
 * @fileOverview 定义树组件的节点视图
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.TreeView.NodeView";
    M139.namespace(namespace, superClass.extend(
     /**
      *@lends M2012.UI.TreeView.NodeView".prototype
      */
    {
        /** 树组件的节点视图
        *@constructs M2012.UI.TreeView.NodeView
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {String} options.childContainer 子节点容器路径
        *@param {String} options.label 标题元素
        *@param {String} options.labelIcon 图标元素
        *@example
        */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.tree = options.tree;
            this.tag = options.tag;
            this.depth = options.depth;
            var opened = options.opened === true;
            if (!options.parentNode) {
                opened = true;//根节点默认展开
            }
            this.model.set("opened", opened);

            var $el = jQuery(options.template);
            this.setElement($el);

            this.parentNode = options.parentNode;

            return superClass.prototype.initialize.apply(this, arguments);
        },

        defaults: {
            name: namespace
        },

        render: function () {
            var options = this.options;
            if(options.container){
                this.$el.appendTo(options.container);
            }else{
                this.$el.appendTo(this.parentNode.childContainer);
            }

            this.label = this.$(options.label);
            if(options.text !== '彩云网盘'){
	            this.label.css('paddingLeft',this.depth*22+10+"px")
            }
            this.labelIcon = this.$(options.labelIcon);

            this.switchButton = this.$(options.switchButton);

            this.childContainer = this.$(options.childContainer);
            this.childNodes = options.childNodes;
            
            this.setText(options.text);

            this.childContainer = this.$(options.childContainer);


            this.bindEvent();


            this.renderChildNodes();
            this.renderSwitchStatus();

            if (!this.childNodes || this.childNodes.length == 0) {
                this.switchButton.css("visibility", "hidden");
            }
            

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *初始化绑定事件
         *@inner
         */
        bindEvent: function () {
            var This = this;

            this.label.click(function (e) {
                This.onLabelClick(e);
            });
            this.model.on("change:opened", function () {
                This.renderSwitchStatus();
            }).on("change:selected", function () {
                This.renderSelectedMode();
            });;



            this.label.dblclick(function (e) {
                This.toggleNode();
            });
            this.switchButton.click(function (e) {
                This.toggleNode();
            });
        },

        toggleNode:function(){
            this.model.set("opened", !this.model.get("opened"));
        },

        onLabelClick: function (e) {
            this.select();
        },

        select:function(){
            this.model.set("selected", true);
		//	debugger;
			var thisSelectId = this.tag && this.tag.directoryId;
			top.$App && top.$App.setCustomAttrs("diskSelectId",thisSelectId);
            this.tree.onNodeSelected(this);
			
        },

        unselect:function(){
            this.model.set("selected", false);
        },

        /**
         *组装子节点界面
         *@inner
         */
        renderChildNodes: function () {
            var options = this.options;
            var childNodes = this.childNodes;
            if (childNodes) {
                for (var i = 0; i < childNodes.length; i++) {
                    var info = childNodes[i];
                    var node = new M2012.UI.TreeView.NodeView({
                        parentNode:this,
                        tree: this.tree,
                        text: info.text,
                        tag: info.tag,
                        depth: this.depth + 1,
                        label: options.label,
                        template: options.template,
                        label: options.label,
                        labelIcon: "a > i:eq(1)",
                        switchButton: "a > i:eq(0)",
                        childContainer: options.childContainer,
                        childNodes: info.childNodes,
                        parentNode: this,
                        containers : options.containers,
                        selectedId : options.selectedId
                    });
                    
                    node.render();
					if(options.containers[info.tag.directoryId] != 'undefined'){
						options.containers[info.tag.directoryId] = node ;
					}
                    // add by tkh 
                    if(options.selectedId == info.tag.directoryId){
	                    var parentNode = node.parentNode;
	                    while(parentNode){
		                    parentNode.model.set("opened", true);
		                    parentNode = parentNode.parentNode;
	                    }
						node.select();
					}
                }
            }
        },
        /**
         *设置节点的文本标题
         */
        setText: function (text) {
            this.text = text;
            this.label.find("span").text(text);
            //this.labelIcon[0].className = this.model.getLabelIcon(text);
        },

        renderSwitchStatus: function () {
            if (this.model.get("opened")) {
                this.label.addClass("on");
                this.childContainer.show();
            } else {
                this.label.removeClass("on");
                this.childContainer.hide();
            }
        },
        renderSelectedMode: function () {
            var selected = this.model.get("selected");
            var textEl = this.label.find("span");
            if (selected) {
                textEl.css({
                    color: "white",
                    background: "rgb(50,119,222)"
                });
            } else {
                textEl.css({
                    color: "",
                    background: ""
                });
            }
        }
    }))

})(jQuery, _, M139);
﻿//http://smsrebuild0.mail.10086.cn/disk/disk?func=disk:saveAttach&sid=MTM1MzI4NzA1NTAwMTU0ODU0MzYxNAAA000001&rnd=0.2288308567367494
/*
<?xml version="1.0" encoding="utf-8" ?>
<object>
    <string  name="filename">PAD%u7248%u79BB%u7EBF%u4E2D%u5FC3%u6D4B%u8BD5%u7528%u4F8B%28CTC%29.xls</string>
    <string  name="usernumber">8615889394143</string>
    <string  name="directoryid">117321768</string>存到最新上传实际上是20
    <string  name="ComeFrom">0</string>
    <int name="BItemId">0</int>
    <string  name="url">http://appmail3.mail.10086.cn/RmWeb/view.do?func=attach:download&amp;mid=058b00000b92645b0000000a&amp;offset=392686&amp;size=83378&amp;name=PAD%E7%89%88%E7%A6%BB%E7%BA%BF%E4%B8%AD%E5%BF%83%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B(CTC).xls&amp;encoding=1&amp;sid=MTM1MzI4NzA1NTAwMTU0ODU0MzYxNAAA000001&amp;type=attach</string>
    <string  name="cookieValue"></string>
    <string  name="type">attach</string>
</object>
{
    "code": "S_OK",
	"summary":"附件转存彩云成功！"
}
*/
/**
 * @fileOverview 定义存附件到彩云对话框
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Dialog.SaveToDisk";

    /*
    var acceptMaxFileLength = 80; //字节
var acceptPhotoExtend = "bmp,gif,ico,jpg,jpeg,png,tif,tiff,";
var acceptMusicExtend = "mid,wma,wav,mp3,cda,";
var PhotoExtendAlert = "“{0}”不是图片格式文件,请重新选择";
var MusicExtendAlert = "“{0}”不是音乐格式文件,请重新选择";
var MusicExtendTips = "（支持上传mp3,wma,wav,mid等格式的音乐文件）";
var PhotoExtendTips = "（支持上传jpg,png,gif,bmp等格式的图片文件）";
var FileNotSelectAlert = "请先选择你要上传的文件";
var DirectoryRootName = "彩云";
var FileHadExist = "文件“{0}”已存在，是否将彩云中的该文件替换？";
var FileNameIsEmpty = "文件的文件名不能为空！";
var FileNameLength = "文件“{0}”名称大于{1}字符，不能上传";
var BanLvTips = "单个文件最大{0}";
var NotBanLvTips = "单个文件最大{0}  <a title='升级套餐,您可以上传更大单个文件.' href='#'>(上传更大单个文件!)</a>";
var UploadResultPage = top.SiteConfig.disk + "/html/uploadresult.html";
var InstallControlTips = "安装139邮箱小工具上传更稳定，速度更快，并支持选择多个文件和断点续传。<a href=\"{0}\" target=\"_blank\">立即安装</a>";
var UpdateControlTips = "系统检测到“139邮箱小工具”有更新版本，要升级后才能正常使用。<a href=\"{0}\" target=\"_blank\">立即升级</a>";
var EnforceUpdateTips = "检测到“139邮箱小工具”有新版本，需要升级才能继续。";
 var fileName = "";
    var url = "";
    var attachinfos = [];
    if (top.NETDISKATTACHMENT) {
        var netdiskattachment = top.NETDISKATTACHMENT;
        if(isArray(netdiskattachment)){
            attachinfos = netdiskattachment;
        }else{
            if (netdiskattachment.fileName) {
                fileName = netdiskattachment.fileName;
            }
            if (netdiskattachment.url) {
                url = netdiskattachment.url;
            }
            attachinfos = [{
                attachname : fileName,
                attachurl : url
            }];
        }
    } else {
        attachinfos = [{
            attachname : escape(Utils.queryString("filename")),
            attachurl : decodeURIComponent(Utils.queryString("tourl"))
        }];
    }
    if (DirectoryTree.selComefrom == 2) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckMusic(fileName)) {
                return;
            }
        }
    } else if (DirectoryTree.selComefrom == 1) {
        for(var i=0;i<attachinfos.length;i++){
            fileName = unescape(attachinfos[i].attachname);
            if (!CheckAlbum(fileName)) {
                return;
            }
        }
    }
    */

    //特殊的文件夹id
    var DIRID = {
        //我的相册
        PHOTO: 20,
        //我的音乐
        MUSIC: 30
    };
    var AcceptPhotoExtend = "bmp,gif,ico,jpg,jpeg,png,tif,tiff".split(",");
    var AcceptMusicExtend = "mid,wma,wav,mp3,cda".split(",");
    var PhotoExtendAlert = "“{0}”不是图片格式文件,请重新选择";
    var MusicExtendAlert = "“{0}”不是音乐格式文件,请重新选择";

    M139.namespace(namespace, superClass.extend(
    /**@lends M2012.UI.Dialog.SaveToDisk.prototype*/
    {
        /** 定义存附件到彩云对话框
         *@constructs M2012.UI.Dialog.SaveToDisk
         *@extends M139.View.ViewBase
         *@param {Object} options 初始化参数集
         *@param {String} options.fileName 附件名
         *@param {String} options.downloadUrl 附件下载地址
         * 
         *@param {String} options.ids 文件ID 多个id用逗号隔开 
         *@param {String} options.type 组件类型 'save' 保存附件至彩云 'move' 移动文件至彩云
		 *@param {String} options.isreadmail 是否是读信页存网盘
         *@example
         */
        initialize: function (options) {
            this.model = new Backbone.Model();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        templateBtn : '<a id="createFolder" class="btnGreenBd btn MB_But_0 YesButton btnGray" rel="0" href="javascript:void(0)" style=""><span>新建文件夹</span></a>',
        templateNewFolder : [ '<li><span class="on">',
							     '<i class="i_plus"></i>',
							     '<i class="i_wjj"></i>',
							     '<input type="text" value="新建文件夹" style="height:11px;width:80px;" class="iText ml_5" value="" maxlength="255">',
							     '<a href="javascript:;" class="btnMinOK ml_5" title="确定"></a>',
							     '<a href="javascript:;" class="btnMincancel ml_5" title="取消"></a>',
							 '</span></li>'].join(""),
        tipWords: {
            Empty: "文件夹名称不能为空",
            MaxLength: "最大长度不能超过255字",
            InvalidChar: "不能有以下特殊字符 \\/:*?\"<>|&",
            RepeatDirName: "文件夹名称不能重复",
            Exception: "创建文件夹失败，请稍后再试。",
            Level: "文件夹层级不能超过5层",
            NotSys: "不能与系统文件夹重名"
        },
        dialogTitle: {
            save: "附件存彩云网盘",
            move: "附件存彩云网盘",
            diskFileMove: "移动",
            shareCopy: "复制到"
        },
        rootName: '彩云网盘',
        maxLengthName: 255,
        name: namespace,
        /**构建dom函数*/
        requestInitData2: function (callback) {
            var This = this;
            top.M139.UI.TipMessage.show("正在打开彩云网盘...");
            M139.RichMail.API.call("disk:getDirectorys", "", function (response) {// update by tkh 调用新接口
                top.M139.UI.TipMessage.hide();
                if (response.responseData.code == "S_OK") {
                    callback && callback();
                } else {
                    top.$Msg.alert("加载失败，请稍后重试", { ico: "warn" });
                    return;
                }
            });

        },
        render: function () {
            var This = this;
            //	This.requestInitData2(function(){
            var options = This.options;
            var dialogTitle = This.dialogTitle[options.type] || This.dialogTitle['save'];

				This.dialog = $Msg.showHTML("", function (e) {
					This.onYesClick(e);
				}, function (e) {
					This.onCancelClick(e);
				}, {
					width: 500,
					buttons: ["确定", "取消"],
					dialogTitle: dialogTitle
				});
				
				// add by tkh
				This.createBtnStatus = true;// 新建按钮是否可点击
				This.jContainer = This.dialog.$el;
				This.jContainer.find('.BottomTip').html(This.templateBtn);// 添加新建按钮
				This.initFolderEvent();// 初始化新建文件夹事件

            This.setElement(This.dialog.el);

            This.initEvent();

            return superClass.prototype.render.apply(This, arguments);
            //	});
        },

        // add by tkh新建文件夹输入框绑定事件
        initFolderEvent : function(){
        	var self = this,pl= 0;
        	this.jCreateFolderBtn = this.jContainer.find("#createFolder");
			this.jCreateFolderBtn.unbind('click').bind('click', function(event){
				if(!self.createBtnStatus){
					return;
				}
				self.disableCreateFolderBtn();
				self.jSelectFolder = self.treeView.model.get("selectedNode").$el;
				pl = parseInt($(self.jSelectFolder.find('a')[0]).css('paddingLeft')) + 18 ;
				$(self.jSelectFolder.find('ul')[0]).show().prepend(self.templateNewFolder);
				$(self.jSelectFolder.find('ul')[0]).find('span').eq(0).css('paddingLeft',pl+'px')
				$(self.jSelectFolder.find('a')[0]).addClass('on');
				$(self.jSelectFolder.find('i')[0]).show();
				bindEvents();
			});
        	
        	function bindEvents(){
        		var jInput = self.jSelectFolder.find("input");
        		// jInput.blur(function(event){
        			// var target = $(event.target);
	        		// $(this).parent('span').parent('li').remove();
	        		// ableCreateFolderBtn();
	        	// }).focus(function(){
	        		// var text = $(this).val();
	        		// if(text == '新建文件夹'){
	        			// $(this).val('');
	        		// }
	        	// });
	        	if($B.is.ie && $B.getVersion() == 6){
					jInput.bind('keydown', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					}).bind('keypress', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					});
				}else{
					jInput.bind('keydown', function(event){
						clearInput($(this));
						
						if(event.keyCode == M139.Event.KEYCODE.ENTER){
							self.jSelectFolder.find("a.btnMinOK").click();
						}
					});
				}
	        	function clearInput(jInput){
	        		var text = jInput.val();
	        		if(text == '新建文件夹'){
	        			jInput.val('');
	        		}
	        	}
	        	
	        	jInput.focus();
	        	
	        	self.jSelectFolder.find("a.btnMinOK").click(function(event){
	        		var name = $.trim(jInput.val());
	        		var msg = self.getErrorMsg(name);
	        		if(!msg){
	        			var dirId = getSelectedDirid();
	        			var options = {parentId : dirId, name : name, dirType : getSelectedDirType()};
	        			self.requestCreateFolder(options);
	        		}else{
	        			top.$Msg.alert(msg);
	        		}
	        	});
	        	self.jSelectFolder.find("a.btnMincancel").click(function(event){
	        		$(this).parent('span').parent('li').remove();
	        		self.ableCreateFolderBtn();
	        	});
        	};
        	
        	// 获取当前选中目录的ID
        	function getSelectedDirid(){
        		var dir = self.treeView.model.get("selectedNode").tag;
    			var dirId = String(dir.directoryId || dir.parentDirectoryId);
	            if (dir.parentDirectoryId == DIRID.PHOTO) {
	                dirId = dir.parentDirectoryId;
	            }else if(dir.parentDirectoryId == DIRID.MUSIC){
	                dirId = dir.parentDirectoryId;
	            }
	            return dirId;
        	};
        	
        	// 获取当前选中目录的dirType
        	function getSelectedDirType(){
        		var dir = self.treeView.model.get("selectedNode").tag;
            	return dir.dirType;
        	};
        },
        // add by tkh新建文件夹按钮不可用
        disableCreateFolderBtn: function () {
            var self = this;
            self.createBtnStatus = false;
            self.jCreateFolderBtn.addClass('btnGray');
        },
        // add by tkh激活新建文件夹按钮
        ableCreateFolderBtn: function () {
            var self = this;
            self.createBtnStatus = true;
            self.jCreateFolderBtn.removeClass('btnGray');
        },
        // add by tkh验证文件夹名称
        getErrorMsg: function (name) {
            var self = this;
            if (!name) {
                return self.tipWords.Empty;
            }
            //查看长度
            if (name.length > self.maxLengthName) {
                return self.tipWords.MaxLength;
            }
            if (!self.isRightName(name)) {
                return self.tipWords.InvalidChar;
            }
            return;
        },
        // add by tkh判断文件夹是否正确
        isRightName: function (name) {
            var reg = /[*|:"<>?\\/&]/;
            return !reg.test(name);
        },
        // add by tkh 移动文件至彩云
        requestMoveToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var bItemId = 0;
            var comeFrom =This.options.comeFrom || "0";
            if (dir.parentDirectoryId == DIRID.PHOTO) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            } else if (dir.parentDirectoryId == DIRID.MUSIC) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            }
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                comeFrom = "1";
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                comeFrom = "2";
            }

            var requestData = {
                directoryId: dirId,
                shareFileId: this.options.ids,
                comeFrom: comeFrom,//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.dirType
            };
            var names = this.options.fileName;
            M139.UI.TipMessage.show("已后台保存，稍后查看",{delay : 5000});
            M139.RichMail.API.call("file:turnFile", requestData, function (response) {
                M139.UI.TipMessage.hide();
                if (response.responseData && response.responseData.code == "S_OK") {
                	if(This.options.comeFrom === 'fileCenter'){ // todo 日志上报
                        BH({key:'diskv2_fileCenter_savesuc'});
                	}else{
                        BH({key:'diskv2_cabinet_savesuc'});
                	}
                	
                //    This.onSaveRequestLoad(response.responseData);
					This.dialog.close();
                    //var tipMsg = "存彩云网盘成功";
                    //if (This.options.comeFrom !== 'largeAttach'&&(This.options.comeFrom !== 'fileCenter' ||top.Links !=="undefined")) {// 文件提取中心是独立的页面，没办法打开彩云
                    //    tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    //}
                    //var tipMsgStr = tipMsg.format(dirId);
					//M139.UI.TipMessage.show(tipMsgStr,{delay : 5000}); 
                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
	            //        isHtml: true
	            //    });
                }else if(response.responseData.code == "-7"){
                	var html = response.responseData.summary;
	                //单文件超过大小
                    var vipInfo = top.UserData.vipInfo;
                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
                    }
                    top.FF.close();
                    top.$Msg.alert(html, {
                        icon: "warn",
                        isHtml: true
                    });
                } else if (response.responseData.code == "-4") {
                    var html = response.responseData.summary;
                    top.FF.close();
                    top.$Msg.alert(html, {
                        icon: "warn",
                        isHtml: true
                    });
                } else {
                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
                }
            });
        },
        // add by zsx 提取中心的存彩云不是一样的
        requestMoveToDiskForFileCenter: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var bItemId = 0;
            var comeFrom = "0";
            if (dir.parentDirectoryId == DIRID.PHOTO) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            } else if (dir.parentDirectoryId == DIRID.MUSIC) {
                dirId = dir.parentDirectoryId;
                bItemId = dir.directoryId;
            }
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                comeFrom = "1";
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                comeFrom = "2";
            }

            var requestData = {
                groupId: this.options.groupId,
                dirId: dirId,
                sendIds: this.options.ids,
                //     comeFrom: comeFrom,//comeFrom 来源  0为普通目录 1为相册 2为音乐
                //bItemId: bItemId,
                type: dir.dirType
            };
            var names = this.options.fileName;
			if(This.options.comeFrom == 'fileCenter'){
				This.trigger("fileCenterSaveSuccess");
				M139.RichMail.API.call("file:toDiskForCenter", requestData,function(){});
				This.dialog.close();
			}else{
	            M139.UI.TipMessage.show("已后台保存，稍后查看",{delay : 5000});
	            M139.RichMail.API.call("file:toDiskForCenter", requestData, function (response) {
	                M139.UI.TipMessage.hide();
	                if (response.responseData && response.responseData.code == "S_OK") {
		                
	                	if(This.options.comeFrom === 'fileCenter'){ // todo 日志上报
	                		//This.onSaveRequestLoad(response.responseData);
	                	}else{
	                		// diskv2_cabinet_savesuc
	                	}
	                	
	                	
	                   
						This.dialog.close();
						
						//return;
	                   // var tipMsg = "存彩云网盘成功";
	                    //if (This.options.comeFrom !== 'largeAttach'&&(This.options.comeFrom !== 'fileCenter' ||top.Links !=="undefined")) {// 文件提取中心是独立的页面，没办法打开彩云
	                    //    tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
	                    //}
						//var tipMsgStr = tipMsg.format(dirId);
						//M139.UI.TipMessage.show(tipMsgStr,{delay : 5000});    
	                //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names), dirId), {
		            //        isHtml: true
		            //    });
	                }else if(response.responseData.code == "-7"){
	                	var html = response.responseData.summary;
		                //单文件超过大小
	                    var vipInfo = top.UserData.vipInfo;
	                    if (vipInfo && vipInfo.serviceitem != "0016" && vipInfo.serviceitem != "0017") {
	                        html += '&nbsp;<a href="javascript:;" style="text-decoration: underline;" onclick="var topWin = top; topWin.FF.close();topWin.$App.show(\'mobile\');return false;">上传更大单个文件</a>';
	                    }
		                top.FF.close();
		                top.$Msg.alert(html, {
		                    icon:"warn",
		                    isHtml: true
		                });
	                }else if(response.responseData.code == "-4"){
	                	var html = response.responseData.summary;
		                top.FF.close();
		                top.$Msg.alert(html, {
		                    icon:"warn",
		                    isHtml: true
		                });
	                } else {
	                    top.$Msg.alert("保存失败，请稍后重试", { ico: "warn" });
	                }
	            });
			}

        },
        //add by cezo 彩云文件/文件夹移动
        requestDiskFileMove: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var data = this.options.data;
            var requestData = {
                fileIds: data.fileIds,
                directoryIds: data.directoryIds,
                srcDirType: data.srcDirType,
                toDirectoryId: dirId,
                toDirType: dir.dirType
            };

            M139.UI.TipMessage.show("正在移动...");
            M139.RichMail.API.call("disk:move", requestData, function (response) {
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    This.onSaveRequestLoad(response.responseData);
                } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                    This.confirmMcloudUpgrade();
                } else {
                    var error = response.responseData.summary;
                    top.$Msg.alert(error, { ico: "warn" });
                }
            });
        },

        //接入彩云提示
        confirmMcloudUpgrade: function () {
            $Msg.confirm(
                "尊敬的用户，彩云正在进行系统升级，暂时无法进行该操作，请稍后再试!",
                function () { },
                function () { },
                {
                    buttons: ["确定"]
                }
            ).setDialogTitle("彩云系统升级");
        },

        /** 存彩云同时存彩云，存彩云不提示 */
        repareSaveToMcloud: function () {
            var self = this;
            var options = this.options;
            if (options && options.saveToMcloud) {
                this.saveToMcloud = true;
            }

            this.initMcloudEvent();
            return superClass.prototype.render.apply(this, arguments);
        },
        //add by xx 共享管理 复制到 彩云
        requestCopyToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var data = this.options.data;
            var fromDiskType = dir.dirType;
            var toDirType = 0;
            if (fromDiskType == 1) {   //因为旧版共享管理定义文件类型和重构彩云不一样，需要转化下
                toDirType = 0;
            } else if (fromDiskType == 3) {
                toDirType = 1;
            } else if (fromDiskType == 4) {
                toDirType = 2;
            }
            var requestData = {
                fileIds: data.fileIds,
                directoryIds: data.directoryIds,
                toDirId: dirId,
                toDirType: toDirType,
                path: data.path
            };
            var requestData = {
            };
            if (_.isArray(data)) {
                requestData[data[0]] = data[1];
            } else {
                requestData["catalogInfos"] = data.catalogInfos ? data.catalogInfos.join(",") : "";
                requestData["contentInfos"] = data.contentInfos ? data.contentInfos.join(",") : "";
            }
            requestData["newCatalogID"] = dirId;

            M139.UI.TipMessage.show("正在复制...");
            /*rewrite this*/
            M139.RichMail.API.call("disk:copyContentCatalog", requestData, function (response) {
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    This.onSaveRequestLoad(response.responseData);
                } else {
                    top.$Msg.alert("复制失败，请稍后重试", { ico: "warn" });
                }
            });
        },
        // add by tkh 新建文件夹
        requestCreateFolder: function (options) {
            var self = this;
            var requestData = {
                parentId: options.parentId,
                name: options.name,
                dirType: options.dirType
            };

            M139.UI.TipMessage.show("正在新建文件夹...");
            M139.RichMail.API.call("disk:createDirectory", requestData, function (response) { // update by tkh 调新接口
                M139.UI.TipMessage.hide();
                var responseData = response.responseData;

                if (responseData && responseData.code == "S_OK") {
                    var dirid = responseData['var']['directoryId'];
                    self.selectedId = dirid;
                    self.trigger('print', dirid);// 重新生成文件夹树状结构，并选中新创建的文件夹
                    // 新建文件夹按钮可用
                    self.ableCreateFolderBtn();
                } else if (responseData && responseData.code == "JOIN_MCLOUD") {//正在接入彩云
                    self.confirmMcloudUpgrade();
                } else {
                    var error = responseData.summary;
                    $Msg.alert(error, { ico: "warn" });
                }
            });
        },

        requestInitData: function () {
            var This = this;
            !this.saveToMcloud && M139.UI.TipMessage.show("正在打开彩云网盘...");
            M139.RichMail.API.call("disk:getDirectorys", "", function (response) {// update by tkh 调用新接口
                M139.UI.TipMessage.hide();
                if (response.responseData.code == "S_OK") {
                    This.onInitDataLoad(response.responseData["var"]['directorys']);
                } else {
                    $Msg.alert("加载失败，请稍后重试", { ico: "warn" });
                }
            });

        },
        /*
        Attachinfos 对象（多个附件对象）
        attachname 附件名
        attachurl 附件下载路径
        usernumber 手机号 
        directoryid 保存目录id
        comeFrom 来源  0为普通目录 1为相册 2为音乐
        bItemId 专辑或相册id，当comefrom为 1或2时，该值有用
        数据库彩云普通目录，相册、音乐专辑是三张表
        为相册或音乐专辑的话 bItemId 就是相册或专辑ID
        为普通目录的话，bItemId 无效
        */
        requestSaveToDisk: function (dir) {
            var This = this;
            var dirId = String(dir.directoryId || dir.parentDirectoryId);
            var requestData = { netFiles: [] };
            var Attachinfos = this.options.Attachinfos;
            var names = [];
            var item;

            if (Attachinfos) {
                for (var i = Attachinfos.length - 1; i >= 0; --i) {
                    item = Attachinfos[i];
                    item.directoryId = dirId;
                    item.dirType = dir.dirType;
                    names.push(item.fileName);
                }
                requestData.netFiles = Attachinfos;
            } else {
                requestData.netFiles.push({
                    url: this.options.downloadUrl,
                    directoryId: dirId,
                    dirType: dir.dirType,
                    fileName: this.options.fileName,
                    fileSize: this.options.fileSize
                });
            }

            !this.saveToMcloud && M139.UI.TipMessage.show("正在保存至彩云网盘...");
            M139.RichMail.API.call("disk:attachUpload", requestData, function (response) {
                M139.UI.TipMessage.hide();
                if (response.responseData && response.responseData.code == "S_OK") {
                    BH({ key: 'diskv2_other_savesuc' });
                    This.onSaveRequestLoad(response.responseData);
                    This.dialog.close();
                    var tipMsg = "存彩云网盘成功";
                    if (This.options.comeFrom !== 'fileCenter' && top.Links != undefined ) {// 文件提取中心是独立的页面，没办法打开彩云
                        tipMsg += "，<a href='javascript:;' onclick='top.Links.show(\"diskDev\",\"&id={0}\",true);top.FF.close();return false;'>去查看</a>";
                    }
                    var tipMsgStr = tipMsg.format(dirId);
                    M139.UI.TipMessage.show(tipMsgStr, { delay: 5000 });
                    //    top.$Msg.alert(tipMsg.format(top.$T.Utils.htmlEncode(names.join(",")), dirId), {
                    //        isHtml: true
                    //    });

                } else {
                    var error = response.responseData.summary;
                    !this.saveToMcloud && $Msg.alert(error, { ico: "warn" });
                }
            });
        },

        onInitDataLoad: function (json) {
            if (json) {
                this.model.set("data", json);
                json[0] && this.model.set("rootId", json[0]["parentDirectoryId"]);//确定彩云的根目录id
            }
            this.trigger("initdataload");
        },

        onSaveRequestLoad: function (json) {
            if (json && json.code == "S_OK") {
                this.onSaveSuccess();
            }
        },

        /**
         *将后台输出的恶心的数据组装成树数据
         */
        getTreeNodeData: function () {
            var self = this;
            var data = this.model.get("data");
            var nodeMap = {};
            var rootLevelNodes = [];
            var allDirs = [].concat(data);
            var rootId = self.model.get("rootId");

            //添加彩云根目录 add by chenzhuo
            allDirs.unshift({
                directoryId: rootId,
                directoryName: self.rootName,
                dirType: 1,
                parentDirectoryId: 0
            });
            //var allDirs = [].concat(data.sysdirs, data.dirs, data.photodirs, data.musicdirs);// update by tkh 调用新接口

            var newDirs = [];
            for (var i = 0, len = allDirs.length; i < len; i++) {
                var dir = allDirs[i];

                newDirs.push({
                    directoryId: dir.directoryId,
                    parentDirectoryId: dir.parentDirectoryId,
                    text: dir.directoryName,
                    tag: dir,
                    childNodes: []
                })
            }

            rootLevelNodes.push(this.getNodeTreeData(newDirs));
            return rootLevelNodes;
        },

        //add by chenzhuo 生成目录树形结构(数据)
        getNodeTreeData: function (directories) {
            var root = {};//根目录

            for (var i = 0, len = directories.length; i < len; i++) {
                var dir = directories[i];

                for (var j = 0; j < len; j++) {
                    var item = directories[j];

                    if (dir.parentDirectoryId == item.directoryId) {
                        item.childNodes.push(dir);
                        break;
                    }

                    j == len - 1 && (root = dir);
                }
            }

            return root;
        },

        // update by tkh 新增属性selectedId
        renderTree: function () {
            var self = this;
            var nodes = this.getTreeNodeData();
            var newnodes = nodes;
            //如果是读信页
            //	debugger;
            if (self.options.isreadmail) {
                var firstTrees = nodes[0]["childNodes"];
                $.each(firstTrees, function () {
                    if (this["text"] == "139邮箱") {
                        //	newnodes = [this];
                        self.model.set("rootId", this["directoryId"]);
                        return false;
                    }
                });
            }
            var selectedId = self.selectedId || self.model.get("rootId");
			var topselectedId = '';
            if(top.resetDiskSelect){//定义在index.html页面
			   top.resetDiskSelect = false;
	           top.$App && top.$App.setCustomAttrs("diskSelectId",'');//取消网盘之前选择的目录
            }else{
	           topselectedId = top.$App && top.$App.getCustomAttrs("diskSelectId"); 
            }
            if (self.options.isreadmail && topselectedId) {
                selectedId = self.selectedId || topselectedId || self.model.get("rootId");
            }
            this.treeView = M2012.UI.TreeView.create({
                el: this.dialog.$(".boxIframeText"),
                nodes: newnodes,
                selectedId: selectedId
            }).render();
        },

        /** 存彩云附件同时存彩云 */
        autoSaveToDisk: function () {
            var nodes = this.getTreeNodeData();
            var dir = nodes[0].tag;
            this.requestSaveToDisk(dir);
        },

        initEvent: function (e) {
            this.on("initdataload", function () {
                this.renderTree();
            }).on("print", function () {
                this.requestInitData();
            }).on("success", function (e) {
                M139.UI.TipMessage.show("保存成功", {
                    delay: 5000
                });
                this.dialog.close();
            });
        },


        //附件存彩云不同时存彩云了
        initMcloudEvent: function (e) {

            var downUrl = this.options.downloadUrl;
            var fileName = this.options.fileName;
            console.log(downUrl);
            $App.trigger("saveToMcloud", {
                downUrl: downUrl,
                fileName: fileName || '全部附件.zip',
                fileSize: top.M139.Text.Url.queryString('size', downUrl) || '1'
            });
            /*
			var self = this;
            this.on("initdataload", function () {
                this.autoSaveToDisk();
            }).on("print", function () {
                this.requestInitData();
            }).on("success", function (e) {
                M139.UI.TipMessage.show("存彩云同时存彩云成功", {
                    delay: 3000
                });
				console.log('存彩云同时存彩云成功');
				var downUrl = this.options.downloadUrl;
				var fileName = this.options.fileName;
				console.log(downUrl);
				$App.trigger("saveToMcloud",{
					downUrl:downUrl,
					fileName: fileName || '全部附件.zip',
					fileSize:top.M139.Text.Url.queryString('size', downUrl) || '1'
				});
            });*/
        },

        onSaveSuccess: function () {
            this.trigger("success");
        },

        /**
         *检查文件是否可以保存
         * 彩云文件移动规则：
         * （1）相册下的文件可以移动到自定义目录、彩云根目录等但不能移动到音乐目录
         * （2）音乐下的文件可以移动到自定义目录、彩云根目录等但不能移动到相册目录
         * （3）相册和音乐下的目录不能移动
         * （4）自定义及彩云根目录的文件，是图片格式的可以移动到相册目录，是音乐格式的可以移动到音乐目录
         * （5）自定义目录可以在自定义目录之间移动，但是不能移动到相册和音乐目录
         * author：xiaoyingxiang
         * check :jiangzixiang
         *@inner
         */
        checkFile: function (dir) {
            var fileName = this.options.fileName;
            var extName = M139.Text.Url.getFileExtName(fileName);
            var error = "";
            //保存到“我的相册”、“我的音乐”要检查文件扩展名
            if (dir.directoryId == DIRID.PHOTO || dir.parentDirectoryId == DIRID.PHOTO) {
                if ($.inArray(extName, AcceptPhotoExtend) == -1) {
                    error = PhotoExtendAlert.format(M139.Text.Url.getOverflowFileName(fileName, 15));
                }
            } else if (dir.directoryId == DIRID.MUSIC || dir.parentDirectoryId == DIRID.MUSIC) {
                if ($.inArray(extName, AcceptMusicExtend) == -1) {
                    error = MusicExtendAlert.format(M139.Text.Url.getOverflowFileName(fileName, 15));
                }
            }
            if (error) {
                $Msg.alert(error, {
                    icon: "warn"
                });
                return false
            } else {
                return true;
            }
        },

        onYesClick: function (e) {
            var dir = this.treeView.model.get("selectedNode").tag;
            e.cancel = true;//取消对话框关闭
            if (this.checkFile(dir)) {
                var type = this.options.type;
                var isForFileCenter = this.options.isForFileCenter;
                if (isForFileCenter) {
                    this.requestMoveToDiskForFileCenter(dir);
                    return;
                }
                if (type === 'move') {
                    this.requestMoveToDisk(dir);
                } else if (type === "diskFileMove") {
                    this.requestDiskFileMove(dir);
                } else if (type === "shareCopy") {
                    this.requestCopyToDisk(dir);
                } else {
                    this.requestSaveToDisk(dir);
                }
            }
        },
        onCancelClick: function () {
            this.trigger("cancel");
        }
    }));
})(jQuery, _, M139);
﻿
(function ($) {

    var types = ['DOMMouseScroll', 'mousewheel'];

    if ($.event.fixHooks) {
        for (var i = types.length; i; ) {
            $.event.fixHooks[types[--i]] = $.event.mouseHooks;
        }
    }

    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = types.length; i; ) {
                    this.addEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = types.length; i; ) {
                    this.removeEventListener(types[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },

        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event, args = [].slice.call(arguments, 1), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if (orgEvent.wheelDelta) { delta = orgEvent.wheelDelta / 120; }
        if (orgEvent.detail) { delta = -orgEvent.detail / 3; }

        // New school multidimensional scroll (touchpads) deltas
        deltaY = delta;

        // Gecko
        if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaY = 0;
            deltaX = -1 * delta;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) { deltaY = orgEvent.wheelDeltaY / 120; }
        if (orgEvent.wheelDeltaX !== undefined) { deltaX = -1 * orgEvent.wheelDeltaX / 120; }

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

})(jQuery);
