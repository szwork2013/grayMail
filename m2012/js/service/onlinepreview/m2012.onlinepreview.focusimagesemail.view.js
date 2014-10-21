
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