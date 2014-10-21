(function(jQuery, _, M139) {

	M139.namespace("M2012.OnlinePreview.FocusImages.Model", Backbone.Model.extend({

		defaults: {
			currentImg: -1,	//当前的图片
			//imgNum: 5,	//默认显示5张缩略图
			imgOffsetWidth: 93,	//缩略图之间的距离
			loadImageStatus: 0 //从附件夹、彩云入口进来       >50张图片时  图片分批加载 每次加载50张
		},
		callApi: M139.RichMail.API.call,
		getImageAttach: function(obj, callback) { //获取图片附件列表
			var self = this;
			var index = this.get("loadImageStatus");
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
			this.callApi("attach:listAttachments", data, function(result) {
				result = result.responseData;
				if (result.code && result.code == 'S_OK') {
					callback && callback(obj, result["var"]);
				}
			});
		}
	}));

})(jQuery, _, M139);


﻿

(function(jQuery, _, M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;

	M139.namespace('M2012.OnlinePreview.FocusImages.View', Backbone.View.extend({

		id: "slideWrapper",
/*
		events: {
			"click #slideNavL" : "prev",
			"click #slideNavR" : "next",
			"click #viewRaw" : "viewRaw",
			"click #rotateLeft" : "rotateLeft",
			"click #rotateRight" : "rotateRight",
			"click .pictureClose" : "close"
		},
*/
		initialize: function(data) {
			//this.autoPlay = false;
			//this.fullScreen = false; //是否全屏状态
			this.moveStatus = false;
			this.rotateDeg = 0;
			this.rotateNum = 0;
			this.maxZoomX = 0.8;
			this.maxZoomY = 0.75;

			this.model = new M2012.OnlinePreview.FocusImages.Model();
			
			var jWin = $(window);
			var self = this;

			jWin.resize(function(){
				self.midLeft = jWin.width() / 2;
				self.maxPicWidth = jWin.width() * 0.8;
				self.maxPicHeight = jWin.height() - 160;
			});

			/*
			if(document.getElementById("imgSlideCSS") == null) {
				//$("head").append(link);	// IE8不识别document.head
				if($B.is.ie) {
					document.createStyleSheet( "/m2012/css/module/picture.css");
				} else {
					var link = document.createElement("link");
					link.id = "imgSlideCSS";
					link.rel = "stylesheet";
					link.type = "text/css";
					link.href = "/m2012/css/module/picture.css";
					document.getElementsByTagName("head")[0].appendChild(link);
				}
			}*/
			//return superClass.prototype.initialize.apply(this, arguments);
		},

		render: function(obj) {
			var index = obj.index;
			if(index === undefined){
				index = obj.num;	// todo: rename to 'index' or 'pos'
			}
			var len = obj["data"].length;

			//console.log(obj);
			this.images = obj["data"];
			this.imgLen = len;

			var allImages = this.images;
			for(var i=0; i<this.imgLen; i++) {
				curImg = allImages[i];
				if(curImg.thumbnailURL == undefined) {
					curImg.thumbnailURL = curImg.imgUrl;
				}
				if(curImg.bigthumbnailURL == undefined) {
					curImg.bigthumbnailURL = curImg.downLoad;
				}
				if(curImg.presentURL == undefined) {
					curImg.presentURL = curImg.downLoad;
				}
			}

			this.midLeft = $(window).width() / 2;
			this.maxPicWidth = this.midLeft * 1.6;
			this.maxPicHeight = $(window).height() - 160;

			this.$el.hide().
			css({width:"100%", height:"100%", position: "absolute", top: 0, right: 0, zIndex: 9999})
			.appendTo(document.body).find(".backgroundImg").empty();	// 预先清空上一次的大图，以免再一次触发onload事件

			top.BH("image_preview");

			this.insertHtml();	//插入弹出层

			if($B.is.ie && $B.getVersion() < 7){
				this.pngfix(this.el);
			}

			this.initEvents();

			this.$el.show();

			this.model.set({
				currentImg: index
			});

			top.BH("image_preview_load");
		},

		pngfix: function (wrapper){
			var els=wrapper.getElementsByTagName('*'),
				ip=/\.png/i,
				al="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='",
				i=els.length,
				uels=new Array(),
				c=0;
			while(i-->0){
				if(els[i].className.match(/unitPng/)){
					uels[c]=els[i];c++;
				}
			}

			if(uels.length==0)pfx(els);else pfx(uels);
			
			function pfx(els){
				i=els.length;
				while(i-->0){
					var el=els[i],es=el.style,elc=el.currentStyle,elb=elc.backgroundImage;
					if(el.src&&el.src.match(ip)&&!es.filter){
						es.height=el.height;
						es.width=el.width;
						es.filter=al+el.src+"',sizingMethod='crop')";
						el.src="/m2012/images/module/attr/clear.gif";
					}else{
						if(elb.match(ip)){
							var path=elb.split('"'),rep=(elc.backgroundRepeat=='no-repeat')?'crop':'scale',elkids=el.getElementsByTagName('*'),j=elkids.length;
							es.filter=al+path[1]+"',sizingMethod='"+rep+"')";
							es.height=el.clientHeight+'px';
							es.backgroundImage='none';
							if(j!=0){
								if(elc.position!="absolute")es.position='static';
								while(j-->0)if(!elkids[j].style.position)elkids[j].style.position="relative";
							}
						}
					}
				}
			};
		},

		insertHtml: function() { //获取数据构建弹出层html 
			var self = this;
			var thumbHtml = "";
			var imgs = this.images;
			var len = imgs.length;

			// todo 使用formatBatch
			for (var i = 0; i < len; i++) {
				thumbHtml += '<li><a href="javascript:;"><img src="' + imgs[i].thumbnailURL + '" alt="" title="" /></a></li>';
			}

			if(this.$el.is(":empty")) {
				this.$el.append(this.template());
				this.loadingImg = this.$("#loadingImg");
				this.nopicImg = this.$("#nopicImg");
				// 只初始化一次
				this.model.on("change:currentImg", function(model, currentImg){
					self.oncurrentImgChange(model, currentImg);
				});
			}

			this.$(".s_picBox ul").html(thumbHtml);
		},

		resizeImageWH: function(img) { //设置大图的宽高
			var zoomX = 1, zoomY = 1;
			var maxPicWidth = this.maxPicWidth;
			var maxPicHeight = this.maxPicHeight;
			var originalWidth = img.width;
			var originalHeight = img.height;

			if(img.width > maxPicWidth) {
				zoomX = maxPicWidth / img.width;
			}
			if(img.height > maxPicHeight) {
				zoomY = maxPicHeight / img.height;
			}

			//img.width = img.height = "auto";	// IE8下image的width变为0, why ?

			if(zoomX < 1 || zoomY < 1) {
				if(zoomX < zoomY){
					img.width = maxPicWidth;
					img.height = originalHeight * zoomX;
					img.style.marginTop = (maxPicHeight - zoomX * originalHeight) / 2 + "px";
				} else {
					img.width = originalWidth * zoomY;
					img.height = maxPicHeight;
					img.style.marginTop = "0px";
				}
			} else {
				img.style.marginTop = (maxPicHeight - originalHeight) / 2 + "px";
			}
		},

		loadBigImage: function(index) {

			var self = this;
			var img = new Image();	// 不太好，快速切换时不能很好利用资源...
			// 还是直接换src比较好
			var currImg = this.images[index];
			var imgWrapper = this.$(".backgroundImg");

			this.rotateDeg = 0;
			this.rotateNum = 0;

			if(!currImg) {
				return ;
			}

			var bigthumbnailURL = currImg.bigthumbnailURL;
			var presentURL = currImg.presentURL;

			imgWrapper.empty();

			$(img).error(function() {
			//img.onerror = function(){
				if(index != self.model.get("currentImg")){
					return ;
				}
				console.log("load error");
				self.loadingImg.hide();
				self.nopicImg.show();
			//};
			}).load(function() {
			//img.onload = function(){
				if(index != self.model.get("currentImg")){
					return ;
				}
				self.loadingImg.hide();
				self.resizeImageWH(img);

				$(img).appendTo(imgWrapper).css({
					"-webkit-transform" : "rotate(0deg)",
					"-o-transform" : "rotate(0deg)",
					"-moz-transform" : "rotate(0deg)",
					"transform" : "rotate(0deg)"
				});
				$("#imgDownload").attr("href", presentURL);
				if(/\/onlinepreview\//.test(location.href)){
					$("#viewRaw").attr("href", "image.htm?url=" + encodeURIComponent(presentURL));
				}else{
					$("#viewRaw").attr("href", "onlinepreview/image.htm?url=" + encodeURIComponent(presentURL));
				}
				//console.log("load callback success !");
			//}
			});

			this.loadingImg.show();
			this.nopicImg.hide();

			if( ! bigthumbnailURL ) {
				this.nopicImg.show();
			} else {
				img.src = bigthumbnailURL;
			}
		},

		initEvents: function() {	// 初始化事件
			var self = this;

			var linkPageUp = $("#linkPageUp");
			var linkPageDown = $("#linkPageDown");
			var thumbList = this.$(".pic_outer");
/*
			$("#viewRaw").click(function() {
				self.viewRaw();
			});
			*/
			$("#slideNavL").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				self.prev();
			});
			
			$("#slideNavR").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				self.next();
			});
			
			$("#rotateLeft").click(function() {
				self.rotateLeft();
			});
			
			$("#rotateRight").click(function() {
				self.rotateRight();
			});

			this.$(".pictureClose").click(function() {
				self.close();
			});

			// 是否重复添加了？
			this.$(".s_picBox ul img").error(function() {
				this.src = "/m2012/images/global/nopic.jpg";
			});

			if (this.images.length > 1) {
				thumbList.show();
				linkPageDown.show();
				linkPageUp.hide();

				$("#imgPlayPause, .ctrl_left").show();

				$("#imgPlayPause").click(function(){
					var jThis = $(this);
					if(jThis.hasClass("play")){
						jThis.removeClass("play").addClass("pause").attr("title", "暂停播放");
						self.autoPlay(true);
					} else {
						jThis.removeClass("pause").addClass("play").attr("title", "自动播放");
						self.autoPlay(false);
					}
				});

				linkPageUp.click(function(){
					linkPageUp.hide();
					linkPageDown.show();
					thumbList.slideDown();
				});

				linkPageDown.click(function(){
					linkPageDown.hide();
					linkPageUp.show();
					thumbList.slideUp();
				});
				
				thumbList.on("mousewheel", function(e) {
					var event = e.originalEvent;
					if(event.wheelDelta > 0 || event.detail < 0){
						self.next();
					} else {
						self.prev();
					}
				}).on("click", "li", function(e) {
					//var target = $(e.currentTarget);
					var index = $(this).index();
					//console.log(index);
					self.model.set("currentImg", index);
				});

			} else { //只显示单张图片，不能切换
				thumbList.hide();
				$("#linkPageUp, #linkPageDown, #imgPlayPause, .ctrl_left").hide();
			}

			$(document).on("keyup", {self: self}, self.onKeyUp);
		},

		oncurrentImgChange: function(model, currentImg) {

			var prevImg = model.previous("currentImg");
			var len = this.images.length;

			console.log("@currentImg changed to "+currentImg);
			this.$(".currentPage").html((currentImg+1) + " / " + len);
			//this.$(".sldPicName").html(this.images[currentImg].fileName);
			this.loadBigImage(currentImg);

			if(len > 1) {
				this.$(".s_picBox li:eq("+prevImg+")").removeClass("current");

				this.$(".s_picBox li:eq("+currentImg+")").addClass("current");

				this.$(".s_picBox ul").animate({
					marginLeft: this.midLeft - currentImg * 70 - 40 + "px"
				}, {
					queue: false,
					duration: 500
				});
			}

			if(this.navHided) {
				this.$("#slideNavL, #slideNavR").css("cursor", "pointer").find("a").show();
				this.navHided = false;
			}

			if(currentImg == 0) {
				this.$("#slideNavL").css("cursor", "default").find("a").hide();
				this.navHided = true;
			}
			if(currentImg == len - 1) {
				this.$("#slideNavR").css("cursor", "default").find("a").hide();
				this.navHided = true;
			}
			this.appendSmallImg();
		},

		rotateCommonFn: function(direction) { //旋转的共用方法

			var rotageIE = 0;

			if (direction == 1) {
				this.rotateNum++;
			} else {
				this.rotateNum--;
			}

			rotageIE = this.rotateNum % 4;

			if(rotageIE < 0) {
				rotageIE += 4;
			}

			// note 从rotate(360deg) 到 rotate(0) 也会有动画
			this.rotateDeg = this.rotateNum * 90;	// 0->-1		0->180

			var rotateDeg = "rotate(" + this.rotateDeg + "deg)";
			var bigImage = this.$(".backgroundImg img");

			// bug IE11下无效
			// IE9 滤镜旋转与CSS3旋转效果会叠加，要分开写
			if($B.is.ie && $B.getVersion() < 9) {
				bigImage.css("filter", "progid:DXImageTransform.Microsoft.BasicImage(Rotation:" + rotageIE + ")");
			} else {
				bigImage.css({
					"-webkit-transform": rotateDeg,
					"-moz-transform": rotateDeg,
					"-ms-transform": rotateDeg,
					"-o-transform": rotateDeg,
					"transform": rotateDeg
				});
			}
		},

		rotateRight: function() {	// 顺时针旋转
			this.rotateCommonFn(+1);
		},

		rotateLeft: function() {	// 逆时针旋转
			this.rotateCommonFn(-1);
		},

		appendSmallImg: function() { //分段加载图片 追加缩略图到页面中
			var self = this;
			var model = this.model;
			var currentImg = model.get("currentImg");
			var index = model.get("loadImageStatus");
			if (self.attachLen) { //是否从附件夹入口进来
				if (currentImg > (50 * index) + 25) {
					self.model.getImageAttach(function(result) {
						self.model.set({
							loadImageStatus: index + 1
						});
						var len = result.length;
						var previewImg = [];
						
						for (var i = 0; i < len; i++) {
							var json = result[i];
							var thumbnailURL = top.wmsvrPath2 + String.format("/mail?func=mbox:getThumbnail&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&encoding=1", {
								sid: top.sid,
								mid: json.mid,
								size: json.attachRealSize,
								offset: json.attachOffset,
								name: json.attachName,
								type: json.attachType
							});
							var presentURL = "/view.do?func=attach:download&mid={0}&offset={1}&size={2}&name={3}&encoding={6}&sid={4}&type={5}";
							presentURL = top.wmsvrPath2 + presentURL.format(json.mid, json.attachOffset, json.attachRealSize, encodeURIComponent(json.attachName), top.sid, json.attachType, json.encode);
							previewImg.push({
								fileName: json.attachName,
								thumbnailURL: thumbnailURL,
								bigthumbnailURL: presentURL,
								presentURL: presentURL
							});
						}

						console.log("append more " + previewImg.length + " images.");

						// append more images
						var fragment = document.createDocumentFragment();
						var clone = self.$(".s_picBox li:eq(0)")[0].cloneNode(true);
						$(clone).find("img").removeAttr("src");
						var li;
						for(var i=0, len = previewImg.length; i < len; i++) {
							li = clone.cloneNode(true);
							li.firstChild.firstChild.src = previewImg[i].fileName;
							fragment.appendChild(li);
						}
						// todo append()?
						self.$(".s_picBox ul")[0].appendChild(fragment);
					});
				}
			} else {
			}
		},

		/*
		* @todo 自动播放的逻辑，如果图片加载时间超过了定时周期，就会跳过一张图片
		* 改用加载成功后setTimeout更好！（但是否有出错中断的可能？）
		*/
		autoPlay: function(enable) { //自动播放点击事件
			var self = this;

			if (enable) {
				self.scrollTimer = setInterval(function() {
					self.next();
				}, 3000);
				setTimeout(function(){
					self.$("#linkPageUp").show();
					self.$("#linkPageDown").hide();
					self.$(".pic_outer").slideUp();
				}, 500);
			} else {
				clearInterval(self.scrollTimer);
				self.scrollTimer = null;
			}
		},

		/**
		* @inner
		* 上一张/下一张公用函数
		*/
		step: function(direction) {
			var model = this.model;
			var len = this.images.length;
			var currentImg = model.get("currentImg") + (direction > 0 ? +1 : -1);

			if(currentImg >= 0 && currentImg < len) {
				model.set("currentImg", currentImg);
			} else {	// todo trigger
			}

			return currentImg;
		},

		prev: function() {
			this.step(-1);
		},

		next: function() {
			var currentImg = this.step(+1);

			if(currentImg == this.images.length -1) {
				$("#imgPlayPause").removeClass("pause").addClass("play").attr("title", "自动播放");
				
				// 播放到最后一个的处理
				this.autoPlay(false);	// 1.清除计时器
			}
		},

		onKeyUp: function(event) {
			var keycode = event.which || event.KeyCode;

			event.preventDefault();

			switch(keycode)
			{
			case 27: this.close(); break;			// ESC, 退出

			case 33:
			case 37: this.next(); break;			// left, 下一张
			case 34:
			case 39: this.prev(); break;			// right, 上一张
			}
		},

		close: function() {
			// reset
			$("#imgPlayPause").removeClass("pause").addClass("play").attr("title", "自动播放");
			this.autoPlay(false);
			this.rotateDeg = 0;
			this.rotateNum = 0;

			this.model.set({"currentImg": -1}, {silent: true});
			$(document).off("keyup", this.onKeyUp);
			this.remove();
			// 重置
			this.$(".backgroundImg").empty();
		},

		template: function() {
            var html = [
				'  <div class="backgroundBlack"></div>',
				'  <div class="backgroundBox">',
				'<img id="loadingImg" src="/m2012/images/global/loading_xs.gif" style="position:absolute;top:50%;left:50%;" />',
				'<img id="nopicImg" src="/m2012/images/global/nopic.jpg" style="position:absolute;top:50%;left:50%;margin:-29px 0 0 -29px;" />',
				'	<div id="slideNavL" class="pictureBoxNav navLeft"><a href="javascript:;" class="pictureBox_left png24"></a></div>',
				'	<p class="backgroundImg"></p>',
				'	<div id="slideNavR" class="pictureBoxNav navRight"><a href="javascript:;" class="pictureBox_right png24"></a></div>',
				'  </div>',
				'  <div class="backgroundBox_scroll">',
				'	<div class="ctrl_box" style="text-align: center;">',
				'		<div class="ctrl_left">',
				'			<a href="javascript:;" id="linkPageDown" class="pageUp png24"></a><a id="linkPageUp" href="javascript:;" class="pageDown png24" style="display:none"></a>',
				'			<span class="currentPage">0 / 0</span>',
				'		</div>',
				//'		<span class="sldPicName" style="line-height: 40px; color: #CCC; font-size: 14px;"></span>',
				'		<div class="ctrl_right" style="float:none; text-align:center; position: static; padding-top: 6px;">',
				'			<a href="javascript:;" id="rotateRight" class="turnL png24" title="顺时针旋转"></a>',
				'			<a href="javascript:;" id="rotateLeft" class="turnR png24" title="逆时针旋转"></a>',
				'			<a href="javascript:;" id="viewRaw" class="zoom png24" title="查看原图" target="_blank"></a>',
				'			<a id="imgDownload" href="javascript:;" class="down png24" title="下载原图"></a>',
				'			<a id="imgPlayPause" href="javascript:;" class="play png24" title="自动播放"></a>',
				'		</div>',
				'	</div>',
				'	<div class="pic_outer">',
				'		<div class="s_picBox">',
				'			<ul class="clearfix"></ul>',
				'		</div>',
				'	</div>',
				'  </div>',
				'  <a href="javascript:;" class="pictureClose png24"></a>'
			].join("");
			return html;
		}
	}));

})(jQuery, _, M139);

