



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