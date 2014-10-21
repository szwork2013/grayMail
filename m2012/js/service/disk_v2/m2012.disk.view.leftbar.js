/**
 * @fileOverview 彩云工具栏视图层.
 * @namespace
 */
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Disk.View.Leftbar', superClass.extend(
	/**
	 *@lends M2012.Disk.View.prototype
	 */
	{
	    el: "body",
	    name: "M2012.Disk.View.Leftbar",
	    template: ['<div class="uploadDiv" style="position:relative;">',
						'<!-- <a href="#" class="greenBtn uploadBtn" role="button"><i class="icon i-upload"></i>上传</a> -->',
						'<a href="javascript:;" role="button" hidefocus class="btn btnGreen" style="border: none;"><span><i class="icon i-upload"></i>上传</span></a>',
						'<div id="floatLoadDiv" style=" top:8px; left:28px; width: 142px; height: 29px;">',
							'<form style="" enctype="multipart/form-data" id="fromUpload" method="post" action="" target="frmUploadTarget">',
								'<input style="height: 29px;" type="file" name="uploadInput" id="uploadFileInput"/>',
								'<input style="display:none;height: 20px;" type="button" name="uploadInput"/>',
							'</form>',
							'<iframe id="frmUploadTarget" style="display: none" name="frmUploadTarget"></iframe>',
							'<div id="flashContainer"></div>',
						'</div>',
					'</div>',
                    '<div id="scrollDiv" class="networkDisk-folderScroll sweb" style="height:300px;">',
		    '<div class="folder-wraper">',
                 '<div class="folder-wraper-inner">',
					'<ul class="listMenu" role="tree" style="border-top:0;">',
						'<li class="on"><a href="javascript:void(0);" id="all"><i class="icon all-file"></i>全部文件</a></li>',
						'<li style=""><a href="javascript:void(0)" id="document1" bh="disk3_left_doc"><i class="icon i-doc"></i>文档</a></li>',
						'<li style=""><a href="javascript:void(0)" id="images" bh="disk3_left_img"><i class="icon i-img"></i>图片</a></li>',
						'<li style=""><a href="javascript:void(0)" id="music" bh="disk3_left_mus"><i class="icon i-mic"></i>音乐</a></li>',
						'<li style=""><a href="javascript:void(0)" id="vedio" class="borderBtm" style="border-bottom:0;" bh="disk3_left_vid"><i class="icon i-mov"></i>视频</a></li>',
						'<li style="display: none;"><a href="javascript:void(0)" id="linksManage" class="borderTop"><i class="icon i-link"></i>管理分享邮件</a></li>',
					'</ul>',
					'<ul class="listMenu" role="tree">',
						'<li><a href="javascript:void(0)" id="friendsShare" bh="friendShare"><i class="icon i-share"></i>收到的分享</a></li>',
						'<li><a href="javascript:void(0)" id="myShare" bh="myShare"><i class="icon i-myShare"></i>分享给好友</a></li>',
						'<li><a href="javascript:void(0)" id="officeshare" bh="officialsharing"><i class="icon i-c139"></i>官方共享</a></li>',
					'</ul>',
					'<ul class="listMenu" role="tree">',
						'<li><a href="javascript:void(0)" id="attachment" bh="diskv2_attachfolder_load"><i class="icon i-clamp"></i>附件夹</a></li>',
						'<li><a href="javascript:void(0)" id="cabinet"><i class="icon i-tank"></i>暂存柜</a></li>',		
					'</ul>',
                    '<ul class="listMenu noLineBottom" role="tree">',
						'<li class="p_relative">',
                            '<a href="javascript:void(0)" id="recycle"><i class="icon i-recycle"></i>回收站</a>',
                        '</li>',
					'</ul>',
                    '</div>',
                    '</div>',
					'<div class="downloadDisk" id="downloadDisk">',
						'<div class="diskUseAmount" id="capacityTemplate">',
							'<span class="progressBarDiv viewtProgressBar">',
								'<span class="progressBar"></span>',
								'<span class="progressBarCur" role="progressbar">',
									'<span class="progressCenter" style="width: 0%;"></span>',
								'</span>',
							'</span>',
							'<p>网盘容量：0M/0G<a href="javascript:void(0)" onclick="top.$App.showOrderinfo()" id="upgrade" class="ml_10">升级</a></p>',
						'</div>',
						'<div class="diskpOtherTool">',
							'<a href="javascript:top.$App.show(\'pcClientSetup\');" id="pcClient" bh="disk3_pcclient" style="margin-right:60px;">',
								'<i class="icon i-pc"></i>',
								'<span>PC客户端</span>',
							'</a>',
							'<a href="javascript:top.$App.show(\'smallTool\');" id="smallTools" bh="disk3_tools">',
								'<i class="icon i-tool"></i>',
								'<span>小工具</span>',
							'</a>',
							'<span class="i-addrDot" id="tipsForTools" style="display: none;"></span>',
                                           	'</div>',
					  '</div>',
					'</div>'].join(""),
	    recycleTip: [
         '<div class="newGroupTips" style="display:none;">',
             '<div class="inner">',
                 '<i class="icon-light mr_10"></i>',
                 '<p>在这里找回删除的文件</p>',
             '</div>',
             '<i href="javascript:" class="i_u_close" style="cursor:pointer;"></i>',
             '<i class="arrow-left-tips"></i>',
         '</div>'
	    ].join(""),
	    events: {
	        //左侧
	        "click #uploadFileInput": "uploadFileInput",
	        "click #all": "showAll",
	        "click #document1": "showDocument",
	        "click #images": "showImages",
	        "click #music": "showMusic",
	        "click #vedio": "showVedio",
	        "click #linksManage": "showLinksManage",
	        "click #friendsShare": "showFriendsShare",
	        "click #myShare": "showMyShare",
	        "click #attachment": "showAttachment",
	        "click #cabinet": "showCabinet",
	        "click #recycle": "showRecycle",
	        "click #officeshare": "officeshare"
	    },
	    render: function () {
	        var self = this;
	        $("#inAside").html(this.template);
	        //右侧框架定位
	        self.onResize();
	        $(window).resize(function () {
	            self.onResize();
	        });
	        if(location.host.indexOf("rd139cm.com") > -1 ){//验收环境隐藏官方共享
		        $('#officeshare').parent().hide();
	        }
	    },
	    initialize: function (options) {
	        var self = this;
	        this.render();
	        this.model = options.model;
	        this.initURL();//搜索的时候展示不同的内页
	        if (!this.isHTML5() && !this.isUploadControlSetup()) {
	            $("#tipsForTools").show();
	        }
	        self.initEvents();
	        return superClass.prototype.initialize.apply(this, arguments);
	    },
	    initEvents: function () {
	        var self = this;
	        //绑定事件用于显示文件删除后可以在回收站找到提示
	        self.model.on("showRecycleTips", function () {
	            self.showRecycleTips();
	        });

	    },
	    initURL: function () {
	        var from = $T.Url.queryString("from");
	        var keyword = $T.Url.queryString("keyword");
	        switch (from) {
	            case "officialsharing":
	                this.officeshare();
	                break;
	            case "attachment":
	                this.showAttachment(keyword);
	                this.model.set("break", true);
	                break;
	            case "cabinet":
	                this.showCabinet(keyword);
	                this.model.set("break", true);
	                break;
	            case "recycle":
	                this.showRecycle(keyword);
	                this.model.set("break", true);
	                break;
	            default:
	                //	this.showAll();
	                this.model.set("break", false);
	                break;
	        }
	    },
	    onResize: function () {
	        try {
	            $iframe = $("#netRightFrame");
	            $iframe.height($(top.document.body).height() - 47 - 29 - 12); //减去多余4像素
	            if ($.browser.msie && $.browser.version < 8) {
	                $iframe.width($(top.document.body).width());
	            } else {
	                $iframe.width($(document.body).width() - 200);
	            }
	            //计算左侧滚动条的高度
	            var scrollEl = $("#scrollDiv");
	            var height = $(document.body).height() - scrollEl.offset().top;
	            scrollEl.height(height);

	        } catch (e) { }
	    },
	    showRecycleTips: function () {
	        var self = this;
	        if (top.$App.getUserCustomInfo("disk_used_recycle") == "1")
	            return;

	        //首先将左侧滚动条滚动到底部
	        var scrollEl = $("#scrollDiv");
	        scrollEl[0].scrollTop = scrollEl[0].scrollHeight;

	        var tipsEl = $(self.recycleTip).appendTo(document.body);
	        tipsEl.css({
	            top: $("#recycle").offset().top
	        }).show().find(".i_u_close").click(function (e) {
	            tipsEl.fadeOut();
	        });

	        //5秒钟后自动消失
	        window.setTimeout(function () {
	            tipsEl.fadeOut();
	        }, 5000);

	        //设置标示下次不展示
	        top.$App.setUserCustomInfoNew({
	            disk_used_recycle: "1"
	        });
	    },
	    showDifferentDoc: function () {
	        var self = this;
	        $("#createDir").hide();//关闭顶部操作按钮控制
	        //$("#share").show();//关闭顶部操作按钮控制
	        $("#rename").hide();//关闭顶部操作按钮控制
	        $("#remove").hide();
	        if (top.secondSSS) {
	            top.secondSSS = false;
	        }
	        self.model.set("selectedFids", []);
	        self.model.set("selectedDirIds", []);
	        self.model.set("selectedDirAndFileIds", []);
	        top.M139.UI.TipMessage.show("正在加载中...");
	        //	if(self.model.set('currentShowType') == 1 && self.model.get('listMode') == 3){
	        //		self.model.set('listMode',2);
	        //	}
	        //	self.showAll();//如果是来自右上角搜索，清除搜索的影响
	        this.model.getFileListByType(function (result) {
	            $(".inboxHeader.bgMargin").hide();
	            if (result.responseData && result.responseData.code == 'S_OK') {
	                top.M139.UI.TipMessage.hide();
	                console.log(result);
	                self.model.diskAllInfo = result.responseData['var'];
	                self.model.set('fileList', self.model.diskAllInfo.files);
	                self.model.set('totalSize', self.model.diskAllInfo.totalCount);
	                //	self.model.set('searchStatus', -self.model.get('searchStatus'));
	                self.model.trigger("createPager");

	                self.model.trigger("renderFileList");
	                self.toggeleFrame2();
	            } else {
	                top.M139.UI.TipMessage.show("加载失败", { delay: 1000 });
	                self.logger.error("getContentInfosByType returndata error", "[disk:getContentInfosByType]", result);
	            }
	        });
	    },
	    uploadFileInput: function () {
	        var netRigthFrame = $("#netRightFrame").attr("src");
	        if ((netRigthFrame == "" || netRigthFrame.indexOf("cabinet.html") > -1) && this.model.get("currentShowType") == 0) {  //彩云网盘和暂存柜的时候正常处理，其他页面跳到彩云网盘
	            return;
	        } else {
	            if ($("#navContainer:visible").length == 0) {
	                this.showAll();
	            }
	            /*
                    $("#disk-main").show();
                    $("#iframe-main").hide();
                    var allFiles = $("#navContainer").find("a");
                    if(allFiles.length !=0){
                        if(allFiles.eq(0).text() == "全部文件"){
                            allFiles.eq(0).click();
                            return;
                        }
                    }
                */
	        }
	    },
	    //如果是右上角搜索，再点击文档类型，则先刷新所有，再按照类型搜索，否则不用刷新所有
	    showAll: function (e) {
	        BH("disk3_getAll");
	        var self = this;
	        this.toggeleFrame2();
	        $("ul.listMenu li").removeClass("on");
	        $("#all").closest("li").addClass("on");
	        top.firstEnterNet = false;
	        this.model.set("isImagesMode", false);
	        this.model.set('currentShowType', 0); //关闭文档类型显示顶部操作按钮
	        self.model.set('curDirId', "-1");
	        self.model.set('curDirId', self.model.getRootDir());
	        $("#createDir").show();//关闭顶部操作按钮控制
	        $(".inboxHeader.bgMargin").show();
	        $("#rename").show();//关闭顶部操作按钮控制
	        $("#remove").show();//关闭顶部操作按钮控制
	        $('#download').find('a').addClass("ml_6");
			this.model.trigger("refresh");
	        return;
	        var allFiles = $("#navContainer").find("a");
	        if (allFiles.length != 0) {
	            if (allFiles.eq(0).text() == "全部文件") {
	                allFiles.eq(0).click();
	                return;
	            }
	        }
	        //	$("#all").closest("li").addClass("on").siblings().removeClass();
	        var location1 = location.href;
	        //	var url = $("#netRightFrame").attr("src");
	        var index = location1.indexOf("from");
	        if (index != -1) {
	            location1 = location1.slice(0, index - 1);
	        }
	        //	if(url.indexOf("cabinet.html") > -1 || url.indexOf("mailattach_attachlist.html") > -1){
	        //		
	        //	}
	        location.href = location1;
	    },
	    ifIsUploading: function () {
	        var cancel = true;
	        var uploadModel = mainView && mainView.uploadModel;
	        var isUploading = uploadModel && uploadModel.isUploading();
	        if (isUploading) {
	            if (window.confirm("切换栏目，当前正在上传的文件会失败，是否关闭？")) {
	                cancel = true;
	            } else {
	                cancel = false;
	            }
	        }
	        return cancel;
	    },
	    showDocument: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set("isImagesMode", false);
	        this.model.set('currentShowType', 4);//关闭顶部操作按钮控制
	        this.model.set('pageIndex', 1);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showImages: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        if (e) {
	            var target = $(e.target).closest("li");
	            $("ul.listMenu li").removeClass("on");
	            target.addClass("on");
	        }
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 1);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", true);
	        this.model.set('listMode', 2, { silent: true }); //图片的话，默认为时间轴模式
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showMusic: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 2);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", false);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    showVedio: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        var target = $(e.target).closest("li");
	        $("ul.listMenu li").removeClass("on");
	        target.addClass("on");
	        $('#download').find('a').removeClass("ml_6");
	        this.model.set('currentShowType', 3);
	        this.model.set('pageIndex', 1);
	        this.model.set("isImagesMode", false);
	        this.showDifferentDoc();
	        //	this.toggeleFrame2();
	    },
	    //隐藏掉主框架，显示内部小框架
	    //每次切换的时候，要重新创建上传按钮，但是切换到暂存柜，则按照暂存柜的方式创建，其他的按照彩云网盘的创建
	    toggeleFrame: function (flag) {
	        $("#disk-main").hide();
	        $("#iframe-main").show();
	        if (top.toolbarView && !flag && $T.Url.queryString("from") !== "attachment") {
	            top.toolbarView.createBtnUpload();
	        }
	    },
	    toggeleFrame2: function () {
	        $("#disk-main").show();
	        $("#iframe-main").hide();
	        if (top.toolbarView) {
	            top.toolbarView.createBtnUpload();
	        }
	    },
	    showLinksManage: function (e) {
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        $("ul.listMenu li").removeClass("on");
	        $("#linksManage").closest("li").addClass("on");
	        $("#netRightFrame").attr("src", "http://www.baidu.com/index.php"); //减去多余4像素
	    },
	    showFriendsShare: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").attr("src","/m2012/html/disk/disk_friend-share.html?sid="+top.sid); //减去多余4像素
	        $("ul.listMenu li").removeClass("on");
	        $("#friendsShare").closest("li").addClass("on");
	        //$("#netRightFrame").attr("src", "/m2012/html/disk/disk_share_friend.html?sid=" + top.sid);
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/disk_share_recive.html?sid=" + top.sid);
	    },
	    showMyShare: function (e) {
	        if (!this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").attr("src","/m2012/html/disk/disk_my-share.html?sid="+top.sid); //减去多余4像素
	        $("ul.listMenu li").removeClass("on");
	        $("#myShare").closest("li").addClass("on");
	        //$("#netRightFrame").attr("src", "/m2012/html/disk/disk_share_my.html?sid=" + top.sid); //减去多余4像素
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/disk_share_to.html?sid=" + top.sid); //减去多余4像素
	        //	var myshare = $("#netRightFrame")[0].contentWindow;
	        //	M139.Timing.waitForReady('myshare',function(){
	        //		myshare.document.getElementById("myShare").click();
	        //	})

	        //	setTimeout(function(){
	        //		$("#netRightFrame")[0].contentWindow.document.getElementById("myShare").click();
	        //	}, 0);
	    },
	    showAttachment: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame();
	        $("ul.listMenu li").removeClass("on");
	        $("#attachment").closest("li").addClass("on");
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        var url = "/m2012/html/mailattach/mailattach_attachlist.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url); //减去多余4像素
	    },
	    officeshare: function () {
	        this.toggeleFrame();
	        $("ul.listMenu li").removeClass("on");
	        $("#officeshare").closest("li").addClass("on");
	        $("#netRightFrame").attr("src", "/m2012/html/disk_v2/officialsharing.html?sid=" + top.sid); //减去多余4像素
	    },
	    showCabinet: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame(true);
	        $("ul.listMenu li").removeClass("on");
	        $("#cabinet").closest("li").addClass("on");
	        //	var target = $(e.target).closest("li");
	        //	target.addClass("on").siblings().removeClass();
	        //	$("#netRightFrame").height($("#netRightFrame").height() - 30);
	        var url = "/m2012/html/fileexpress/cabinet.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url);
	    },
	    showRecycle: function (key) {
	        if (typeof key != "string" && !this.ifIsUploading()) {
	            return;
	        }
	        this.toggeleFrame(true);
	        $("ul.listMenu li").removeClass("on");
	        $("#recycle").closest("li").addClass("on");
	        var url = "/m2012/html/disk_v2/disk_index.html?sid=" + top.sid;
	        if (key && typeof (key) == "string") {
	            url = url + "&keyword=" + key;
	        }
	        $("#netRightFrame").attr("src", url);
	        top.BH("disk_recycle_enter");
	    },
	    isUploadControlSetup: function () {
	        var setup = false;

	        if (window.ActiveXObject) {//ie
	            try {
	                if (new ActiveXObject("Cxdndctrl.Upload")) {
	                    setup = true;
	                }
	            } catch (ex) {
	                try {
	                    if (new ActiveXObject("ExCxdndCtrl.ExUpload")) {
	                        setup = true;
	                    }
	                } catch (e) {
	                    console.log(ex);
	                    console.log('创建ActiveXObject("Cxdndctrl.Upload")及ActiveXObject("ExCxdndCtrl.ExUpload")对象失败！');
	                }
	            }
	        } else if (navigator.plugins) {//firefox chrome
	            var mimetype = navigator.mimeTypes["application/x-richinfo-cxdnd3"];

	            setup = (mimetype && mimetype.enabledPlugin) ? true : false;
	        }

	        if (UploadFacadeConfig.isCloseControl) {
	            setup = false;
	        }

	        return setup;
	    },
	    isHTML5: function () {
	        return window.File && window.FileList && window.FileReader && window.Blob && window.FormData && window.Worker && "withCredentials" in (new XMLHttpRequest);
	    }
	}));
})(jQuery, _, M139);
