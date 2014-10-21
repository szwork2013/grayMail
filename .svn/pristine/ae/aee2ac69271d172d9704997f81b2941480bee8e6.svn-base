

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
