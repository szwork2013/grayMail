
function noop(){}

var con = {};

if(!window.console){
	con.error = con.info = con.assert = con.log = con.dir = noop;
	window.console = con;
}

(function(container){

	var mimeTypes = {
		".mp3": "audio/mpeg",
		".ogg": "audio/ogg",
		".wma": "audio/x-ms-wma",
		".wav": "audio/x-wav",
		".m4a": "audio/x-m4a",

		".mp4": "video/mp4",
		".webm": "video/webm",
		".flv": "flv-application/octet-stream",
		".avi": "video/x-msvideo",
		".wmv": "video/x-ms-wmv"
	};

	var defaultSettings = {

		settings: {
			autoplay: false,
			loop: false
			//,preload: null
		},

		ui: {
			playPauseClass: '.play-pause',
			scrubberClass: '.scrubber',
			progressClass: '.progress',
			loadedClass: '.loaded',
			timeClass: '.time',
			durationClass: '.duration',
			playedClass: '.played',
			playCurClass: '.play-cursor',
			errorMessageClass: '.error-message',
			playingClass: '.playing',
			pauseClass: '.paused',
			loadingClass: '.loading',
			errorClass: '.error'
		},

		callbacks: {
			onInit: function() {
			},
			onLoad: function() {
			},
			onPlay: function() {
			},
			onPause: function() {
			},
			onLoadStarted: function() {
			},
			onTrackEnded: function() {
			},
			onLoadProgress: function(percent) {
			},
			onLoadError: function(errMsg) {
			},
			onUpdatePlayhead: function(percent, currentTime) {
			}
		}
	};

	var hasFlash = (function() {
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
	})();

	function merge(obj1, obj2) {
		for (attr in obj2) {
			if (obj1.hasOwnProperty(attr) || obj2.hasOwnProperty(attr)) {
				obj1[attr] = obj2[attr];
			}
		}
	}

	// **Clone a javascript object (recursively)**
	function clone(obj) {
		if (obj == null || typeof(obj) !== 'object') return obj;
		var temp = new obj.constructor();
		for (var key in obj) temp[key] = arguments.callee(obj[key]);
		return temp;
	}

	var AVPlayer = function(element, settings) {
		var property, defaultProperty, key;

		for(var i in defaultSettings){
			defaultProperty = defaultSettings[i];
			property = settings[i];
			if(typeof defaultProperty == "object"){
				this[i] = {};
				for(key in defaultProperty) {
					this[i][key] = property[key] || defaultProperty[key];
				}
			} else {
				this[i] = property || defaultProperty;
			}
		}

		if(element === null) {
			if(typeof Audio === "object"){	// 不准确，可以不是window的属性
				element = new Audio();
			}
		} else {
			this.element = element;
		}
		this.type = element.tagName.toUpperCase();	// IE8的tagName竟然是小写？!
		this.wrapper = $(element).closest(settings.ui.wrapperClass);
		this.source = element.getElementsByTagName('source')[0] || element;

		// todo 如果预先设置了src，在各种preload条件下如何使用？不够通用
		// First check the element directly for a src and if one is not found, look for a `<source>` element.
		this.src = this.element.getAttribute("data-src") || this.source.getAttribute("data-src") || null;
		if(this.src) this.source.src = this.src;

		this.loadStartedCalled = false;
		this.loadedPercent = 0;
		this.duration = 1;
		this.playing = false;

		// get the preload settings
		this.settings.preload = this.element.preload;
		// set the autoplay property
		this.element.autoplay = this.settings.autoplay;

		this.element.id = this.type + "_player_" + AVPlayer._instCount;
		AVPlayer.instances[this.element.id] = this;
		AVPlayer._instCount++;

		if(this.src) {
			var ext = (this.src).match(/\.\w+(?=$|\?|#)/);
			if(ext) ext = ext[0].toLowerCase();
			console.log(ext);
			this.usePlugin = !(element.canPlayType && element.canPlayType(mimeTypes[ext]).replace(/no/, ''));
		}
		
		this.attachEvents();
	};

	AVPlayer.instances = [];
	AVPlayer._instCount = 0;

	// todo
	// _extend(AVPlayer.prototype, {});

	AVPlayer.prototype = {
		
		// Attaches useful event callbacks to an instance.
		attachEvents: function() {

			var self = this;
			var wrapper = this.wrapper;

			if (!wrapper || !wrapper.length) {
				console.log("DOM not OK ?");
				return ;
			}

			var scrubber = wrapper.find(this.ui.scrubberClass);
			var cur = wrapper.find(this.ui.playCurClass);
			var lasttimestamp = 0;
			var leftDistance = 0;

			// todo:放在初始化中，要保证计算的时候元素是可见的，否则得到0
			self.scrubberWidth = parseInt(scrubber.css("width"));

			function leftPos(elem) {
				var curleft = 0;
				if (elem.offsetParent) {
					do {
						curleft += elem.offsetLeft;
					} while (elem = elem.offsetParent);
				}
				return curleft;
			};

			// todo: throttle
			function dragHandler(e){
				var relativeLeft = e.clientX - leftDistance;
				if(relativeLeft < 0 || relativeLeft > self.scrubberWidth){
					return false;
				}
				// todo 这里数据驱动界面进度，在低端的旧浏览器下可能有性能问题
				//if(e.timeStamp - lasttimestamp > 300) {
				//	lasttimestamp = e.timeStamp;
					self.skipTo(relativeLeft / self.scrubberWidth);
				//}
				return false;
			}

			wrapper.find(this.ui.playPauseClass).on('click', function(e) {
				e.preventDefault();
				if(self.src){
					self.playPause();
				}
			});

			scrubber.on('click', function(e) {
				console.log(e.clientX + " - " + leftPos(this));
				var relativeLeft = e.clientX - leftPos(this);
				self.skipTo(relativeLeft / self.scrubberWidth);
			});

			cur.on("mousedown", function(e){
				e.preventDefault();
				leftDistance = leftPos(scrubber[0]);
				$(document).on("mousemove", dragHandler).one("mouseup", function(e){
					var relativeLeft = e.clientX - leftDistance;
					self.skipTo(relativeLeft / self.scrubberWidth);
					$(this).off("mousemove", dragHandler);
				});
			});

			// _If flash is being used, then the following handlers don't need to be registered._
			if (this.usePlugin) {
				replaceWithFlashPlayer(this);
				return ;
			}
			// todo 如果实现HTML5与Flash任意切换，需要一个标志记录是否添加过以下事件

			// Start tracking the load progress of the track.
			// todo 判断preload还是autoplay，或者...
			// audio|video.preload="auto|metadata|none"
			if(this.settings.autoplay || this.settings.preload == "auto") {
				this.src && this.trackLoadProgress();
			}

			$(this.element).on('timeupdate', function(e) {
				self.updatePlayhead();
			}).on('ended', function(e) {
				console.log("ended");
				self.trackEnded();
			}).on('durationchange', function(e){
				console.log("duration changed to " + this.duration);
				//self.duration = self.element.duration;
				//self.loadStarted();	// todo 这未调用play，导致UI不同步
				self.play();
			}).on('waiting', function(e){
				if(!self.src) {
					return ;
				}
				console.log("wait, loading...");
				if(self.loadedPercent*self.duration < self.element.currentTime) {
					self.callbacks.onLoad.call(self);
				}
			}).on('canplay', function(e){
				if(!self.src) {
					return ;
				}
				console.log("ok, canplay !");
				// todo ...???
				self.callbacks.onLoadStarted.call(self);
			})/*.on("volumechange", function(e){
				console.log("EVENTS: volume changed");
			}).on('canplaythrough', function(e){
				// 此时检查buffered，并未缓冲100%, 是什么意思？
				// canplaythrough在chrome下，seek时才可能触发
				console.log("====== canplaythrough ======= ");
				self.stopLoadProgress();
			})*/;

			$(this.source).on('error', function(e) {
				// on error, cancel any load timers that are running.
				var error = self.source.error;
				var errMsg = "unknown";
				console.log("error: ", error);
				clearInterval(self.readyTimer);
				delete self.readyTimer;
				if(self.loadTimer){
					self.stopLoadProgress();
				}
				
				if(error)
				{
					switch(error.code)
					{
					case 1:		// MEDIA_ERR_ABORTED
						errMsg = "媒体异常中断";
					case 2:		// MEDIA_ERR_NETWORK
						console.log("错误：MEDIA_ERR_NETWORK");
						errMsg = "网络异常";
						//self.load(self.src);
						break;
					case 3:		// MEDIA_ERR_DECODE
						errMsg = "解码错误，无法播放";
						break;
					case 4:		// MEDIA_ERR_SRC_NOT_SUPPORTED
						errMsg = "不支持的媒体格式";
					}
				}

				if(!self.src){
					errMsg = "无媒体文件";
				}

				//if(error.code == 2){
				//	self.play();		// 播放的时候下载视频导致中断，重新播放会从0开始
				//} else {
					self.loadError(errMsg);
				//}
				//if(error.code == 3){
				//	replaceWithFlashPlayer(self);
				//}
			});
		},

		updatePlayhead: function() {
			var currentTime = this.element.currentTime;
			var percent = currentTime / this.duration || 0;
			this.callbacks.onUpdatePlayhead.call(this, percent, currentTime);
		},
		skipTo: function(percent) {
			console.log("skiping to " + percent);
			// todo
			//if (percent > this.loadedPercent) return;
			// this.lastSeekPoint = percent;	// 记录，可实现重复播放
			this.element.currentTime = this.duration * percent;
			console.log(this.element.currentTime + " " + this.duration * percent);
			this.updatePlayhead();
		},
		load: function(resource, extension) {
			var ext = extension;
			this.loadStartedCalled = false;
			this.src = resource;

			if(extension == undefined) {
				extension = (resource).match(/\.\w+(?=$|\?|#)/);
				if(extension) ext = extension[0].toLowerCase();
			}
			this.usePlugin = !(this.element.canPlayType && this.element.canPlayType(mimeTypes[ext]).replace(/no/, ''));
			console.log(ext, this.usePlugin ? "usePlugin" : "use H5");

			if(this.loadTimer){
				this.stopLoadProgress();
			}

			// todo
			if(this.usePlugin){
				replaceWithFlashPlayer(this);
				//this.trackLoadProgress();
				//this.load(resource);
				//this.play();
				return ;
			}
			
			this.source.setAttribute("src", resource);
			// The now outdated `load()` method is required for Safari 4
			this.element.load();
			this.trackLoadProgress();
		},
		trackLoadProgress: function() {
			var readyTimer, inst = this;

			console.log("try trackLoadProgress");
			inst.callbacks.onLoad.apply(this);	// todo	do we need this type of callbacks?
			// If `preload` has been set to `none`, then we don't want to start loading the track yet.
			if (inst.settings.autoplay == false && inst.settings.preload=="none" || inst.readyTimer || inst.loadTimer) {
				console.log(inst.settings.preload, inst.readyTimer, inst.loadTimer);
				return ;
			}
			console.log("trackLoadProgress started");

			// Use timers here rather than the official `progress` event,
			// as Chrome has issues calling `progress` when loading media files from cache.
			readyTimer = setInterval(function() {
				if (inst.element.readyState > 0) {
					inst.init();
				}
				if (inst.element.readyState > 1) {
					if (inst.settings.autoplay && inst.src) {
						console.log("trackLoadProgress:: autoplay");
						inst.play();
					}
					clearInterval(readyTimer);
					delete inst.readyTimer;

					// Once we have data, start tracking the load progress.
					// todo 在未设置src时是否不需要启动计时器？
					if(inst.src) {
						console.log("start load Timer.");
						inst.loadTimer = setInterval(function() {
							inst.loadProgress();
						}, 200);
					}
				}
			}, 200);
			inst.readyTimer = readyTimer;
		},
		loadError: function(errMsg) {
			this.callbacks.onLoadError.call(this, errMsg);
		},
		init: function() {
			this.callbacks.onInit.apply(this);
		},
		loadStarted: function() {
			// Wait until `element.duration` exists before setting up the player.
			var duration = this.element.duration;
			if (!duration/* || duration == Infinity*/) return false;

			// there's a issue, see : http://stackoverflow.com/questions/9629223/audio-duration-returns-infinity-on-safari-when-mp3-is-served-from-php
			// todo: 后期改为监听durationchange事件
			this.duration = this.element.duration;// | 0;	// 取整，以使loadedPercent可以到达1
			this.updatePlayhead();
			this.callbacks.onLoadStarted.apply(this);
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
				//console.log("loadProgress: " + durationLoaded);

				this.callbacks.onLoadProgress.call(this, this.loadedPercent);
			} else {
				console.log(this.element.buffered.length);
			}
			if (this.loadedPercent >= 1 || (this.duration - durationLoaded < 1)) {
				this.stopLoadProgress();
			}
		},
		stopLoadProgress: function(){
			console.log("OK, loadTimer stopped. ^^");
			clearInterval(this.loadTimer);
			this.loadTimer = null;
			delete this.loadTimer;
		},
		playPause: function() {
			if (this.playing) this.pause();
			else this.play();
		},
		play: function() {
			console.log("call:: play");
			// If the element hasn't started preloading, then start it now.  
			// Then set `preload` to `true`, so that any tracks loaded in subsequently are loaded straight away.
			// todo preload == "none" or != "auto"
			if (this.settings.preload != "auto") {
				this.settings.preload = "auto";	// todo do we need to ?
				this.element.setAttribute('preload', 'auto');
				this.trackLoadProgress();	// todo 如果直接更改了src，再来调，可能因为上一首还在load阶段，此时不会加载下一首？
			} else {
				//console.log("trigger loadProgress");
				this.loadedPercent = 1;	// todo: wrong ?
				this.loadStartedCalled = this.loadStarted();
				console.log(this.element.duration);
			}
			
			if(this.src && !this.usePlugin) {
				this.element.play();
				this.playing = true;
				var lastVolume = this.lastVolume;
				$(this.element).stop(true).animate({volume: lastVolume}, 2000);
				this.callbacks.onPlay.apply(this);
			}
		},
		pause: function(immediate) {
			this.playing = false;
			
			if(this.type == "AUDIO" && !immediate) {
				var self = this;
				$(this.element).stop(true).animate({volume: 0}, 1200, function(){
					self.element.pause();
				});
			} else {
				this.element.pause();
			}
			this.callbacks.onPause.apply(this);
		},
		setVolume: function(v) {
			$(this.element).stop(true);		// 正在音量渐变过程中设置音量，需要停止渐变
			this.element.volume = v;
			this.lastVolume = v;
		},
		trackEnded: function(e) {
			console.log("trackEnded");
			if(this.duration && this.element.readyState > 0){	// 当HAVE_NOTHING的时候，调用会出错
				this.skipTo(0);	// todo: remove
			}
			if (this.settings.loop) {
				//this.skipTo(0);
				this.play();
			} else {
				console.log("end pausing.");
				this.pause(true);
			}
			this.callbacks.onTrackEnded.apply(this);
		}
	}

	AVPlayer.hasFlash = hasFlash;

	//container.AVPlayer = AVPlayer;	// IE6 iframe刷新出错？
	window.AVPlayer = AVPlayer;
})(this);



// 扩展: Flash播放支持
//var fn = this.AVPlayer.prototype;

function replaceWithFlashPlayer(inst){

	if(AVPlayer.hasFlash == false) {
		top.$Alert("请启用或安装Flash插件后，刷新浏览器重试 :)");
		return ;
	}

	console.log("use Flash Plugin");
	// todo 更好的办法，直接替换或覆盖prototype, 避免每个实例复制
	
	flashPlay(inst);	// 顺序很重要

	if(inst.type === "AUDIO") {
		injectFlashAudio(inst);
	} else {
		injectFlashVideo(inst);
	}
};

function checkReadyAndRun(inst) {
	//console.dir(inst.element);
	// todo how to detect the readystate of an <object> element (dynamic inserted) ?
	var count = 0;
	var timer = setInterval(function(){
		if(inst.element.load){
			inst.load();
			//inst.loadStarted();
			clearInterval(timer);
		}
		if(count++ > 50){
			clearInterval(timer);
			inst.loadError("Flash加载失败！");
		}
	}, 50);
}

function injectFlashVideo(inst){
	//var src = encodeURIComponent(inst.src);
	var id = inst.element.id;
	var rand = +new Date + Math.random();

	swfobject.embedSWF("/m2012/flash/Player2.swf", id, "100%", "100%", "9.0.0", "expressInstall.swf", {playerInstance: "player", type: "video", datetime:rand}, {allowScriptAccess: "always", wmode: "opaque", allowFullScreen: "true"}, {}, function(){
		console.log("SWF ready");
		inst.swfReady = true;
		
		var id = inst.element.id;
		// todo
		var swf = document.getElementById(id) || inst.wrapper.find("object")[0];
		inst.element = swf.length > 1 ? swf[swf.length - 1] : swf;
		checkReadyAndRun(inst);
	});
};

function injectFlashAudio(inst){
	//var src = encodeURIComponent(inst.src);
	var id = inst.element.id;
	var rand = +new Date + Math.random();

	swfobject.embedSWF("/m2012/flash/Player2.swf", id, "0", "0", "9.0.0", "expressInstall.swf", {playerInstance: "player", datetime:rand}, {allowScriptAccess: "always", wmode: "transparent"}, {}, function(){
		console.log("SWF ready");
		inst.swfReady = true;
		
		var id = inst.element.id;
		// todo
		var swf = document.getElementById(id) || inst.wrapper.find("object")[0];
		inst.element = swf.length > 1 ? swf[swf.length - 1] : swf;
		checkReadyAndRun(inst);
	});
}

function flashPlay(inst){

	inst['swfReady'] = false;

	inst['init'] = function(resource) {
		console.log("flash init");
		
		this.element.init(this.src || resource);
	};
	inst['load'] = function(resource) {
		if(resource) {
			this.src = resource;
			this.loadStartedCalled = false;
		}

		if (this.swfReady) {
			console.log("flash load " + this.src);
			this.element.load(this.src);
		} else {
			console.log("flash not ready !!!");
		}

		// todo 无用的代码？HTML5的loadTimer会不会串到Flash播放过程？
		if(this.loadTimer){	// 切换另一首，如果上一首还未加载完
			this.stopLoadProgress();
		}

		//this.trackLoadProgress();
	};
	inst['loadProgress'] = function(percent, duration) {
		//console.log("flash loadProgress: " + percent + " " + duration);
		this.loadedPercent = percent;
		this.duration = duration;
		if(!this.loadStartedCalled) {
			//this.loadStarted();	// wrong !这是由Flash主动触发的
		}
		this.callbacks.onLoadProgress.call(this, percent);
		if (this.loadedPercent >= 1) {
			console.log("flash load completed");
			this.stopLoadProgress();
		}
	};
	//inst['stopLoadProgress'] = function() {
	//	this.element.stopLoadProgress();
	//};
	inst['skipTo'] = function(percent) {
		if (percent > this.loadedPercent) {
			this.callbacks.onLoad.call(this);
			//return;
		}
		//this.updatePlayhead();	// todo
		percent *= this.duration;
		console.log("Flash:: skipTo " + percent);
		this.element.skipTo(percent|0);
		//this.updatePlayhead();	// seek需要时间，应该让Flash完成seek后回调
	};
	inst['updatePlayhead'] = function() {
		var currentTime = this.element.getCurrentTime();
		//console.log(currentTime + " " + this.duration);
		var percent = currentTime / this.duration;
		// todo bug (duration default to 1)
		if(percent > 1) { percent = 0; }
		this.callbacks.onUpdatePlayhead.call(this, percent, currentTime);
	};
	inst['play'] = function() {
		// If the audio hasn't started preloading, then start it now.  
		// Then set `preload` to `true`, so that any tracks loaded in subsequently are loaded straight away.
		if (this.settings.preload != "auto") {
			this.settings.preload = "auto";
			console.log("play::call->load " + this.src);
			this.load();
		}
		//console.log("try calling flash:: play ", this.swfReady);
		//if(this.swfReady == false || this.playing) {	// bug: 调多次会出现多个音轨
		//	console.log("not ready, returned.");
		//	return ;
		//}
		console.log("flash:: play");
		this.playing = true;
		// IE doesn't allow a method named `play()` to be exposed through `ExternalInterface`, so lets go with `pplay()`.  
		// <http://dev.nuclearrooster.com/2008/07/27/externalinterfaceaddcallback-can-cause-ie-js-errors-with-certain-keyworkds/>
		this.element.pplay();
		this.startTimer();
		this.callbacks.onPlay.call(this);
	};

	inst['pause'] = function() {
		this.playing = false;
		console.log("flash:: pause");
		// Use `ppause()` for consistency with `pplay()`, even though it isn't really required.
		this.element.ppause();
		this.stopTimer();
		this.callbacks.onPause.call(this);
	};
	inst['setVolume'] = function(v) {
		this.element.setVolume(v);
	};
	inst['loadStarted'] = function() {
		console.log("!!!! flash loadStarted");
		//console.log("!!!! flash loadStarted, " + JSON.stringify(this.settings));
		// Load the mp3 specified by the audio element into the swf.
		this.swfReady = true;
		this.loadStartedCalled = true;
		this.callbacks.onLoadStarted.call(this);

		this.startTimer();
		//if (this.settings.preload == "auto") {
			//this.init();
		//	this.load();
		//}
		// todo 应该将配置参数传递给Flash
		if (this.settings.autoplay) {
			this.play();
		}
	};

	inst['startTimer'] = function(){
		this.stopTimer();
		this.update_timer = setInterval(function(){
			// todo bug (can remove now ? )
			if(!inst.durationGeted && inst.duration > 1){
				inst.durationGeted = true;
				inst.callbacks.onLoadStarted.call(inst);
			}
			inst.updatePlayhead();
		}, 250);
	};

	inst['stopTimer'] = function(){
		if(this.update_timer){
			clearInterval(this.update_timer);
			this.update_timer = null;
		}
	};

	// todo 与Flash的处理逻辑未分清
	// todo 结束后的进度置零与否应该分离到UI逻辑中。
	inst['trackEnded'] = function(e) {
		console.log("trackEnded");
		if(this.duration){
		//	this.skipTo(0);	// todo: remove
		}
		if (this.settings.loop) {
			//this.skipTo(0);
			this.play();
		} else {
			console.log("end pausing.");
			this.pause();
		}
		this.stopTimer();
		this.callbacks.onTrackEnded.call(this);
	};
};
