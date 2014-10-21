
/*
* 目前限制：进度条只可点击，不可拖动。
* 无音量调节API

要求支持的文件类型：
音频：mp3、wav、wma
视频：mp4、wmv、flv、avi

浏览器默认支持（未列出的表示不支持）：
chrome		mp3, wav, 		mp4
FF23		mp3, wav		mp4
FF18		wav				x
IE9,10		mp3				mp4
IE6-8		x				x
*/

function noop(){};
var con = {};
if(!window.console){
	con.error = con.info = con.assert = con.log = con.dir = noop;
	window.console = con;
}

(function(playerName, AVPlayerInstance, container) {

	container[playerName] = {
		instanceCount: 0,
		instances: {
			AUDIO:{},
			VIDEO:{}
		},
		type: "AUDIO",	// default media type

		mimeTypes: {
			".mp3": "audio/mpeg",	// audio/x-mpeg, chrome下失败
			".ogg": "audio/ogg",
			".wma": "audio/x-ms-wma",
			".wav": "audio/x-wav",

			".mp4": "video/mp4",
			".webm": "video/webm",
			".flv": "flv-application/octet-stream",
			".avi": "video/x-msvideo",
			".wmv": "video/x-ms-wmv"
		},

		settings: {
			autoplay: false,
			loop: false,
			preload: true,
			swfLocation: 'js/avplayer.swf',

			playPauseClass: '.play-pause',
			scrubberClass: '.scrubber',
			progressClass: '.progress',
			loaderClass: '.loaded',
			timeClass: '.time',
			durationClass: '.duration',
			playedClass: '.played',
			playCurClass: '.play-cursor',
			errorMessageClass: '.error-message',
			playingClass: '.playing',
			pauseClass: '.paused',
			loadingClass: '.loading',
			errorClass: '.error',

			hasFlash: (function() {
				if (navigator.plugins && navigator.plugins.length && navigator.plugins['Shockwave Flash']) {
					return true;
				} else if (navigator.mimeTypes && navigator.mimeTypes.length) {
					var mimeType = navigator.mimeTypes['application/x-shockwave-flash'];
					return mimeType && mimeType.enabledPlugin;
				} else {
					try {
						var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
						return true;
					} catch (e) {}
				}
				return false;
			})(),

			// The default event callbacks:
			trackEnded: function() {
			},
			flashError: function() {
			},
			loadError: function(errMsg) {
				console.log("UI:: loadError");
				if(this.type == "AUDIO"){
					this.wrapper.find(".p_pre").hide();
				}
				this.wrapper.find(this.settings.errorMessageClass).html(errMsg || "暂时无法连接").show();//html('Error loading: "' + this.src + '"');
				//this.wrapper.removeClass(this.settings.loadingClass.substr(1)).addClass(this.settings.errorClass.substr(1));
				this.element.style.display = "none";
			},
			load: function() {
				console.log("UI:: load");
				if(this.type == "AUDIO"){
					this.wrapper.find(".p_pre").hide();
				} else {
					//this.wrapper.find("video").hide();
					this.element.style.display = "none";
				}
				this.wrapper.find(this.settings.errorMessageClass).html('<img src="/m2012/images/global/loading_xs.gif" style="MARGIN-TOP: 10px"/>').show();
			},
			init: function() {
				this.wrapper.addClass(this.settings.loadingClass.substr(1));
			},
			loadStarted: function() {
				console.log("UI:: loadStarted");
				var m = Math.floor(this.duration / 60),
					s = Math.floor(this.duration % 60);
				if(this.type == "AUDIO"){
					this.wrapper.find(".p_pre").show();
				} else {
					//this.wrapper.find("video").show();
					this.element.style.display = "";
				}
				//if(!this.settings.usePlugin) this.element.style.display = "";
				this.wrapper.find(this.settings.errorMessageClass).hide();
				this.wrapper.removeClass(this.settings.loadingClass.substr(1))
					.find(this.settings.durationClass)
					.html((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
			},
			loadProgress: function(percent) {
				this.wrapper.find(this.settings.loaderClass).css("width", 100 * percent + '%');
			},
			playPause: function() {
				if (this.playing) this.settings.play.apply(this);
				else this.settings.pause.apply(this);
			},
			play: function() {
				//this.wrapper.addClass(this.settings.playingClass.substr(1));
				var playingClass = this.settings.playingClass;
				var pauseClass = this.settings.pauseClass;
				this.wrapper.find(pauseClass).removeClass(pauseClass.substr(1)).addClass(playingClass.substr(1)).attr("title", "暂停");
			},
			pause: function() {
				//this.wrapper.removeClass(this.settings.playingClass.substr(1));
				var playingClass = this.settings.playingClass;
				var pauseClass = this.settings.pauseClass;
				this.wrapper.find(playingClass).removeClass(playingClass.substr(1)).addClass(pauseClass.substr(1)).attr("title", "播放");
			},
			// 待优化...HTML5的播放时间是可以直接读取的，这里再计算显示，多余
			updatePlayhead: function(percent, currentTime) {
				var p = this.duration * percent || currentTime,
					m = Math.floor(p / 60),
					s = Math.floor(p % 60);
				this.wrapper.find(this.settings.progressClass).css("width", (100 * percent) + '%')
				.end().find(".p_pre_cur").css("left", (100 * percent) + '%')
				.end().find(this.settings.playedClass).html((m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s);
			}
		},

		getPlayerHTMLTemplate: function(src, width, height){
			var WMP7;
			var html = "";
			//var src = "res/1.mp3";
			//var src = "res/婚礼沙画-永恒之恋.avi";
			//var src = "res/05.avi";

			if(arguments.length < 3){
				width = height = 0;
			}

			// IE11下，ActiveXObject为undefined
			//if(window.ActiveXObject !== undefined) {
			if("ActiveXObject" in window) {
				WMP7 = new ActiveXObject("WMPlayer.OCX.7");
			} else if (window.GeckoActiveXObject) {
				WMP7 = new GeckoActiveXObject("WMPlayer.OCX.7");
			}

			// Windows Media Player 7 Code
			if ( WMP7 )
			{
				console.log("Media Player 7");
				html += '<OBJECT ID="Player'+this.instanceCount+'"';
				html += ' CLASSID=CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6';
				html += ' standby="Loading Microsoft Windows Media Player components..."';
				html += ' TYPE="application/x-oleobject" height="'+height+'" width="'+width+'">';
				html += '<PARAM NAME="url" VALUE="' + src + '">';
				html += '<PARAM NAME="AutoStart" VALUE="0">';
				html += '<PARAM NAME="ShowControls" VALUE="1">';
				html += '<PARAM NAME="uiMode" VALUE="none">';
				html += '</OBJECT>';
			}
			else	// Windows Media Player 6.4 Code
			{
				//if(/MSIE/i.test(navigator.userAgent)){
					console.log("Media Player 6.4");
					//IE Code
					html += '<OBJECT ID="Player'+this.instanceCount+'" ';
					html += 'CLASSID=CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95 ';
					html += 'CODEBASE=http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,4,5,715 ';
					html += 'standby="Loading Microsoft Windows Media Player components..." ';
					html += 'TYPE="application/x-oleobject" height="'+height+'" width="'+width+'">';
					html += '<PARAM NAME="FileName" VALUE="' + src + '">';
					html += '<PARAM NAME="AutoStart" VALUE="0">';
					html += '<PARAM NAME="ShowControls" VALUE="1">';
					//Netscape code
					html += '    <Embed type="application/x-mplayer2"';
					html += '        pluginspage="http://www.microsoft.com/windows/windowsmedia/"';
					html += '        filename="http://ncnetshow/station1.asx"';
					html += '        src="' + src + '"';
					html += '        Name=MediaPlayer';
					html += '        ShowControls=1';
					html += '        ShowDisplay=1';
					html += '        ShowStatusBar=1';
					html += '        width=290';
					html += '        height=320>';
					html += '    </embed>';
					html += '</OBJECT>';
				/*} else {
					// 其它浏览器
					html += '<OBJECT ID="Player'+this.instanceCount+'" ';
					html += ' CLASSID=CLSID:6BF52A52-394A-11D3-B153-00C04F79FAA6';
					html += ' standby="Loading Microsoft Windows Media Player components..."';
					html += ' TYPE="application/x-oleobject" width="286" height="225">';
					html += '<PARAM NAME="url" VALUE="http://ncnetshow/station1.asx">';
					html += '<PARAM NAME="AutoStart" VALUE="true">';
					html += '<PARAM NAME="ShowControls" VALUE="1">';
					html += '<PARAM NAME="uiMode" VALUE="mini">';
					//Netscape code
					html += '    <Embed type="application/x-mplayer2"';
					html += '        pluginspage="http://www.microsoft.com/windows/windowsmedia/"';
					html += '        filename="http://ncnetshow/station1.asx"';
					html += '        src="http://ncnetshow/station1.asx"';
					html += '        Name=MediaPlayer';
					html += '        ShowControls=1';
					html += '        ShowDisplay=1';
					html += '        ShowStatusBar=1';
					html += '        width=290';
					html += '        height=320>';
					html += '    </embed>';
					html += '</OBJECT>';
				}*/
			}
			return html;
		},

		// ### Contructor functions

		// `createAll()`
		// Creates multiple instances.  
		// If `elements` is not given, then automatically find any `<video>` and `<audio>` tags 
		// on the page and create instances for them.
		createAll: function(options, elements) {
			var i, len, element, instances = [];

			options = options || {};
			/**
			* 吐血...getElementsByTagName得到的元素集合会关联DOM树同步更新，
			* 使用插件播放时会移除audio/video标签，导致DOM更新，后续的遍历出现问题！
			*/

			if(!options.type && !elements){
				elements = $("audio").toArray();
				for (i = 0, len = elements.length; i < len; i++) {
					instances.push(this.newInstance(elements[i], options));
				}
				elements = $("video").toArray();
				for (i = 0, len = elements.length; i < len; i++) {
					instances.push(this.newInstance(elements[i], options));
				}
			} else {
				elements = elements || $(options.type).toArray();
				for (i = 0, len = elements.length; i < len; i++) {
					instances.push(this.newInstance(elements[i], options));
				}
			}
			
			return instances;
		},
		
		newInstance: function(element, options) {
			var s = this.helpers.clone(this.settings);
			var count = this.instanceCount++;

			// Check for `autoplay`, `loop` and `preload` attributes and write them into the settings.
			if (element.getAttribute('autoplay') != null) s.autoplay = true;
			if (element.getAttribute('loop') != null) s.loop = false;
			// todo: preload兼容是怎么一回事？
			// preload与play的关系还没有理清，这涉及预加载过程是否会调用问题
			// 还有loadProgress也应该提前触发并显示进度
			// getAttribute检测也有问题，它不能正确提取默认值，应该直接访问属性
			if (element.getAttribute('preload') == 'none') s.preload = false;
			else element.preload = "auto";

			// Merge the default settings with the user-defined `options`.
			if (options) this.helpers.merge(s, options);

			element.parentNode.setAttribute('id', 'player_wrapper' + count);

			// Return a new instance.
			var inst = new container[AVPlayerInstance](element, s);

			var ext = (options.fileName || inst.src).match(/\.\w+(?=$|\?|#)/);
			if(ext) ext = ext[0].toLowerCase();

			// 后期改进：不要预先在UI插入video/audio元素，IE11下会报错（虽然仍可以播放，影响调试分析）
			// firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=875385
			// element.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');// firefox -27的bug，结果为空。
			// /Firefox/i.test(navigator.userAgent) || 
			s.usePlugin = !(element.canPlayType && element.canPlayType(this.mimeTypes[ext]).replace(/no/, ''));

			console.log(ext, s.usePlugin ? " use plugin":"");

			inst.ext = ext;

			// Attach event callbacks to the new instance.
			if (s.usePlugin){
				// XP下mp4使用Flash播放（这样IE和firefox都可以播放了）
				// win7/8系统使用MediaPlayer（界面更统一）
				if(ext === ".flv" || ext === ".mp4" && /NT 5.1/i.test(navigator.userAgent)) {
					if(this.checkFlash(inst)){
						this.replaceWithFlashVideoPlayer(inst);
					}
				} else/* if(".wav.wma.wmv.avi.mp3.mp4".indexOf(ext) != -1)*/ {
					//if(/msie/i.test(navigator.userAgent)){	// IE11检测失效
					if("ActiveXObject" in window || "GeckoActiveXObject" in window) {
						this.attachEvents(inst.wrapper, inst);
						this.replaceWithMediaPlayer(inst);
					} else {
						this.hidePlayer(inst);
					}
				}
			} else {
				this.attachEvents(inst.wrapper, inst);	// HTML5播放
			}

			// Store the newly-created instance.
			this.instances[inst.type]['avplayer' + count] = inst;
			return inst;
		},

		hidePlayer: function(inst){
			var wrapper = inst.wrapper;
			wrapper.removeClass("pivBrower pivAudio").html("当前浏览器不支持在线播放，建议使用IE浏览器播放")
				.css({
					"background-color" : "transparent",
					"font-size": "14px",
					"color": "#666",
					"line-height": "64px",
					"text-align": "left"
				});
		},

		checkFlash: function(inst){
			if(this.settings.hasFlash) return true;
			inst.settings.loadError.call(inst, "请启用或安装Flash插件。");
			return false;
		},

		replaceWithFlashVideoPlayer: function(inst){
			var src = encodeURIComponent(inst.src);
			//var src = encodeURIComponent("/m2012/flash/test.flv");
			var html = '<object codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" id="Player'+this.instanceCount+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">\
				<param name="allowScriptAccess" value="always" />\
				<param name="movie" value="/m2012/flash/player.swf?movie='+src+'" />\
				<param name="quality" value="high" />\
				<param name="wmode" value="transparent" />\
				<embed src="/m2012/flash/player.swf?movie='+src+'" quality="high" width="100%" height="100%" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" name="flashPlayer" swLiveConnect="true" allowScriptAccess="always"></embed>\
			</object>';
			inst.wrapper.find(".viedesence").html(html).end().find(".audioplayer").remove();
		},

		replaceWithMediaPlayer: function(inst){
			var src;

			if(inst.type == "VIDEO"){
				src = this.getPlayerHTMLTemplate(inst.src, 600, 338);
			} else {
				src = this.getPlayerHTMLTemplate(inst.src);
			}

			//$(inst.element).remove();
			var fragment = document.createElement("div");
			var p = inst.element.parentNode;
			p.replaceChild(fragment, inst.element);
			//$(inst.element).replaceWith(fragment);
			inst.element = fragment;	// loadError时需要引用
			inst.duration = 0;	// 与HTML5不同，不使用百分比

			var obj = $(fragment);
			if(inst.type == "AUDIO") obj.hide();

			obj.html(src).attr("id", 'avplayer' + this.instanceCount);
			var pl = obj.children(0)[0];
			// pl.versionInfo 查看版本

			// issue: the $(pl).on("xxx", func) just don't work !
			if(pl.attachEvent){
				// see: http://msdn.microsoft.com/en-us/library/windows/desktop/dd564045(v=vs.85).aspx
				pl.attachEvent("PlayStateChange", function(e){
					console.log("PlayStateChange to "+pl.playState);
					// 重放时会有状态1，所以不能使用
					if(pl.playState == 8 && inst.playing){	// end auto pause
						inst.pause();
						inst.trackEnded();
					} else if(pl.playState == 10){
						//console.log("state 10, play again.");
						//inst.play();
					} else if(pl.playState == 3){// || pl.playState == 6){
						inst.duration = pl.currentMedia.duration;
						//console.log("got duration " + inst.duration);
					}
				});
				pl.attachEvent("error", function(e){
					// Store the most recent error item number.
					var max = pl.error.errorCount - 1;
					// Store the most recent error in an error item object.
					var errItem = pl.error.item(max);
					console.log("error: " + errItem.errorCode + " - " + errItem.errorDescription);
				});
				pl.attachEvent("CurrentMediaItemAvailable", function(e, data){
					console.log("Media Available! ", data);
				});
				pl.attachEvent("Buffering", function(start){
					if(start && !inst.loadTimer){
						console.log("Buffer start !!!");
					} else {
						console.log("Buffer ended !!!");
					}
				});
			} else {
				pl.addEventListener("PlayStateChange", function(e){
					console.log("PlayStateChange to "+pl.playState);
					// pl.playState == 1
					if(pl.playState == 8 && inst.playing){	// end auto pause
						inst.pause();
						inst.trackEnded();
					} else if(pl.playState == 10){
						//console.log("state 10, play again.");
						//inst.play();
					} else if(pl.playState == 3){// || pl.playState == 6){
						inst.duration = pl.currentMedia.duration;
						//console.log("got duration " + inst.duration);
					}
				}, false);
				pl.addEventListener("error", function(e){
					// Store the most recent error item number.
					var max = pl.error.errorCount - 1;
					// Store the most recent error in an error item object.
					var errItem = pl.error.item(max);
					console.log("error: " + errItem.errorCode + " - " + errItem.errorDescription);
				}, false);
				pl.addEventListener("CurrentMediaItemAvailable", function(e, data){
					console.log("Media Available! ", data);
				}, false);
				pl.addEventListener("Buffering", function(start){
					if(start && !inst.loadTimer){
						console.log("Buffer start !!!");
					} else {
						console.log("Buffer ended !!!");
					}
				}, false);
			}

			inst['updatePlayhead'] = function() {
				var percent;
				if(this.duration){
					percent = this.control.currentPosition / this.duration;
					console.log(this.control.currentPosition + " " + this.duration);
					this.settings.updatePlayhead.call(this, percent, 0);
				}
			};

			inst['skipTo'] = function(percent) {
				console.log("plugin::skiping to " + this.duration * percent);
				console.log("buffered : " + pl.network.bufferingProgress);
				// 插件未找到loadedPercent相关API
				//if (percent > this.loadedPercent) return ;
				this.control.currentPosition = this.duration * percent;
				this.updatePlayhead();
			};

			inst['load'] = function() {
				console.log("loading " + inst.src);
				inst.loadStartedCalled = true;	// ensure called only once when clicking the playPause button
				inst.control = pl.controls;
				if(inst.readyTimer){
					clearInterval(inst.readyTimer);
					inst.readyTimer = null;
				}

				inst.settings.load.apply(inst);

				// 不支持播放, duration==0行不通
				if(!pl.controls){// || pl.currentMedia.duration == 0) {
					console.log("no controls property");
					inst.loadError();
					return ;
				}

				/*if(".wmv.avi".indexOf(inst.ext) !== -1){
					setTimeout(function(){
						inst.autoplay = true;	// 无用...
						inst.play();
					}, 35);
				} else */if(!pl.settings.autoStart) {
					inst.autoplay = false;
					console.log("try pausing");
					inst.playing = false;
					inst.settings.pause.apply(inst);
				}

				inst.readyTimer = setInterval(function() {
					inst.control = pl.controls;
					if (pl.currentMedia.duration){
						clearInterval(inst.readyTimer);
						inst.readyTimer = null;
						inst.duration = pl.currentMedia.duration;
						inst.loadStarted();
						if(pl.settings.autoStart){
							console.log("autoStart, play will begin");
							inst.autoplay = true;
							inst.play();
						}
					}
				}, 900);
			};

			// 插件也无法播放则清空事件的数据处理
			inst['loadError'] = function() {
				// prevent click errors
				inst.wrapper.find(inst.settings.playPauseClass).off('click').on('click', function(e) {
					inst.settings.playPause.apply(inst);
				}).end().find(inst.settings.scrubberClass).off('click').on('click', function(e) {});
				this.settings.loadError.apply(this);
			};
			
			inst['init'] = function(v) {
				this.settings.init.apply(this);
			};
			
			inst['loadStarted'] = function() {
				this.updatePlayhead();
				this.settings.loadStarted.apply(this);
				console.log("loadStarted");
			};
			
			inst['loadProgress'] = function() {
				this.loadedPercent = pl.network.downloadProgress/100;
				console.log("loadProgress: " + this.loadedPercent);

				this.settings.loadProgress.call(this, this.loadedPercent/100);

				if(this.loadedPercent >= 1) {
					clearInterval(inst.loadTimer);
					inst.loadTimer = null;
				}
			};
			
			inst['playPause'] = function() {
				if(!this.loadStartedCalled){
					console.log("loading...");
					this.load();
					return ;
				}
				if (this.playing) this.pause();
				else this.play();
			};
			
			inst['play'] = function() {
				this.playing = true;
				this.control.play();
				console.log("play...");
				// 如果默认是暂停，duration在点击播放或者加载数秒之后后才能取到
				if(this.duration == 0){
					this.duration = pl.currentMedia.duration;
					console.log("update duration to "+this.duration);
				}
				this.settings.play.apply(this);
				//this.trackLoadProgress(this);
				var This = this;

				this.controlTimer = setInterval(function(){
					This.updatePlayhead();
				}, 500);
			};
			
			inst['pause'] = function() {
				this.playing = false;
				if(this.controlTimer){
					clearInterval(this.controlTimer);
					this.controlTimer = null;
				}
				this.control.pause();
				console.log("pause...");
				this.settings.pause.apply(this);
			};
			/*
			inst['trackEnded'] = function() {
			};
			*/
			inst['setVolume'] = function(v) {
			};

			inst.loadTimer = setInterval(function(){
				inst.loadProgress();
			}, 300);

			// todo: 如果WMP也有预加载API，就没必要使用统一入口，直接play
			inst.load();
		},

		// Attaches useful event callbacks to an instance.
		attachEvents: function(wrapper, inst) {

			if (!wrapper || !wrapper.length) return ;

			var scrubber = wrapper.find(inst.settings.scrubberClass);
			var cur = wrapper.find(inst.settings.playCurClass);
			var lasttimestamp = 0;

			//todo:放在初始化中，要保证计算的时候元素是可见的，否则得到0
			var scrubberWidth = parseInt(scrubber.css("width"));

			function leftPos(elem) {
				var curleft = 0;
				if (elem.offsetParent) {
					do {
						curleft += elem.offsetLeft;
					} while (elem = elem.offsetParent);
				}
				return curleft;
			};
			function dragHandler(e){
				//if(e.timeStamp - lasttimestamp < 200) return ;
				//lasttimestamp = e.timeStamp;
				var relativeLeft = e.clientX - 58;
				if(relativeLeft < 0 || relativeLeft > scrubberWidth){
					return false;
				}
				inst.skipTo(relativeLeft / scrubberWidth);
				return false;
			};


			wrapper.find(inst.settings.playPauseClass).on('click', function(e) {
				e.preventDefault();
				inst.playPause.apply(inst);
			});

			scrubber.on('click', function(e) {
				console.log(e.clientX + " - " + leftPos(this));
				var relativeLeft = e.clientX - leftPos(this);
				inst.skipTo(relativeLeft / scrubberWidth);
			});

			cur.on("mousedown", function(e){
				e.preventDefault();
				$(document).on("mousemove", dragHandler).one("mouseup", function(e){
					$(this).off("mousemove", dragHandler);
				});
			});

			// _If flash is being used, then the following handlers don't need to be registered._
			if (inst.settings.usePlugin) return ;

			// Start tracking the load progress of the track.
			container[playerName].events.trackLoadProgress(inst);

			$(inst.element).on('timeupdate', function(e) {
				inst.updatePlayhead.apply(inst);
			}).on('ended', function(e) {
				console.log("ended");
				inst.trackEnded.apply(inst);
			});

			$(inst.source).on('error', function(e) {
				// on error, cancel any load timers that are running.
				var error = inst.source.error;
				var errMsg;
				console.log("error: ", error);
				clearInterval(inst.readyTimer);
				if(inst.loadTimer){
					clearInterval(inst.loadTimer);
				}
				
				if(error)
				{
					switch(error.code)
					{
					case 2:		// MEDIA_ERR_NETWORK
						console.log("错误：MEDIA_ERR_NETWORK");
						errMsg = "暂时无法连接";
						inst.load();
						break;
					case 3:		// MEDIA_ERR_DECODE
						errMsg = "解码错误，无法播放";
						// container[playerName].replaceWithFlashVideoPlayer(inst);
						break;
					case 4:		// MEDIA_ERR_SRC_NOT_SUPPORTED
						errMsg = "不支持的媒体类型";
					}
				}
				if(error.code !== 2 && inst.ext === ".mp4"){
					container[playerName].replaceWithFlashVideoPlayer(inst);
					return ;
				}
				inst.settings.loadError.call(inst, errMsg);
			});
		},
		// ## Helper functions
		helpers: {
			// **Merge two objects, with `obj2` overwriting `obj1`**  
			// The merge is shallow, but that's all that is required for our purposes.
			merge: function(obj1, obj2) {
				for (attr in obj2) {
					if (obj1.hasOwnProperty(attr) || obj2.hasOwnProperty(attr)) {
						obj1[attr] = obj2[attr];
					}
				}
			},
			// **Clone a javascript object (recursively)**
			clone: function(obj) {
				if (obj == null || typeof(obj) !== 'object') return obj;
				var temp = new obj.constructor();
				for (var key in obj) temp[key] = arguments.callee(obj[key]);
				return temp;
			}
		},
		// ## Event-handling
		events: {
			trackLoadProgress: function(inst) {
				var readyTimer, inst = inst;

				console.log("try trackLoadProgress");
				inst.settings.load.apply(inst);
				// If `preload` has been set to `none`, then we don't want to start loading the track yet.
				if (!inst.settings.preload) return ;
				console.log("trackLoadProgress started");

				// Use timers here rather than the official `progress` event,
				// as Chrome has issues calling `progress` when loading media files from cache.
				readyTimer = setInterval(function() {
					if (inst.element.readyState > -1) {
						inst.init.apply(inst);
					}
					if (inst.element.readyState > 1) {
						if (inst.settings.autoplay) inst.play.apply(inst);
						clearInterval(readyTimer);
						// Once we have data, start tracking the load progress.
						inst.loadTimer = setInterval(function() {
							inst.loadProgress.apply(inst);
						}, 200);
					}
				}, 200);
				inst.readyTimer = readyTimer;
			}
		}
	};

	// ## The player class
	container[AVPlayerInstance] = function(element, settings) {
		this.element = element;
		this.type = element.tagName.toUpperCase();	// IE8的tagName竟然是小写？!
		this.wrapper = $(element).closest(settings.wrapperClass);
		this.source = element.getElementsByTagName('source')[0] || element;
		// First check the element directly for a src and if one is not found, look for a `<source>` element.
		this.src = $(element).attr("data-src") || this.source.getAttribute("data-src") || null;
		this.source.src = this.src;
		this.settings = settings;
		this.loadStartedCalled = false;
		this.loadedPercent = 0;
		this.duration = 1;
		this.playing = false;
	}

	container[AVPlayerInstance].prototype = {
		// API access events:
		// Each of these do what they need do and then call the matching methods defined in the settings object.
		// 目前还存在的问题：暂停后定时器没有取消，不必要的开销
		updatePlayhead: function() {
			var percent = this.element.currentTime / this.duration || 0;
			this.settings.updatePlayhead.call(this, percent, this.element.currentTime);
		},
		skipTo: function(percent) {
			console.log("skiping to " + percent);
			// todo
			//if (percent > this.loadedPercent) return;
			this.element.currentTime = this.duration * percent;
			this.updatePlayhead();
		},
		load: function(resource) {
			this.loadStartedCalled = false;
			this.source.setAttribute("src", resource);
			// The now outdated `load()` method is required for Safari 4
			this.element.load();
			this.src = resource;
			container[playerName].events.trackLoadProgress(this);
		},
		loadError: function() {
			this.settings.loadError.apply(this);
		},
		init: function() {
			this.settings.init.apply(this);
		},
		loadStarted: function() {
			// Wait until `element.duration` exists before setting up the player.
			var duration = this.element.duration;
			if (!duration/* || duration == Infinity*/) return false;

			// there's a issue, see : http://stackoverflow.com/questions/9629223/audio-duration-returns-infinity-on-safari-when-mp3-is-served-from-php
			// todo: 后期改为监听durationchange事件
			this.duration = this.element.duration | 0;	// 取整，以使loadedPercent可以到达1
			this.updatePlayhead();
			this.settings.loadStarted.apply(this);
			return true;
		},
		// todo: 使用progress事件更好，因为媒体会分时间段加载，这样可以避免不必要的计算
		loadProgress: function() {
			if (this.element.buffered != null && this.element.buffered.length) {
				// Ensure `loadStarted()` is only called once.
				if (!this.loadStartedCalled) {
					this.loadStartedCalled = this.loadStarted();
					//console.log(this.element.duration);
					//if(!this.loadStartedCalled) return ;
				}
				var durationLoaded = this.element.buffered.end(this.element.buffered.length - 1);
				this.loadedPercent = durationLoaded / this.duration || 0;	// duration为0时得到NaN
				console.log("loadProgress: " + durationLoaded);

				this.settings.loadProgress.call(this, this.loadedPercent);
			} else {
				console.log(this.element.buffered.length);
			}
			if (this.loadedPercent >= 1) {
				clearInterval(this.loadTimer);
				this.loadTimer = null;
			}
		},
		playPause: function() {
			if (this.playing) this.pause();
			else this.play();
		},
		play: function() {
			console.log("call:: play");
			// If the element hasn't started preloading, then start it now.  
			// Then set `preload` to `true`, so that any tracks loaded in subsequently are loaded straight away.
			if (!this.settings.preload) {
				this.settings.preload = true;
				this.element.setAttribute('preload', 'auto');
				// trackLoadProgress会无限期尝试触发loadProgress()->loadStarted()
				container[playerName].events.trackLoadProgress(this);
			} else {
				console.log("trigger loadProgress");
				this.loadedPercent = 1;	// todo: wrong ?
				this.loadStartedCalled = this.loadStarted();
				console.log(this.element.duration);
			}
			this.playing = true;
			this.element.play();
			this.settings.play.apply(this);
		},
		pause: function() {
			this.playing = false;
			this.element.pause();
			this.settings.pause.apply(this);
		},
		setVolume: function(v) {
			this.element.volume = v;
		},
		trackEnded: function(e) {
			console.log("trackEnded");
			this.skipTo.call(this, 0);
			if (!this.settings.loop) {
				console.log("end pausing.");
				this.pause.apply(this);
			}
			this.settings.trackEnded.apply(this);
		}
	}
	
})('AVPlayer', 'AVPlayerInstance', this);
