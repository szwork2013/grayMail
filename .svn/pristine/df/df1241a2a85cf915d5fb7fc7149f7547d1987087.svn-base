 (function(jQuery,_,M139){
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var namespace = "M2012.UI.Widget.VoiceInput";
    M139.namespace(namespace,superClass.extend(
    {
        initialize: function (opt) {
            $.extend(this.options, opt);
            if (this.options.autoClose == undefined) {
                this.options.autoClose = true;
            }
        },
        template:"",
        events: {},
        isSupportFlash: function () {
   
            if (navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                return true;
            } else {
                try {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");

                    return true;
                } catch (ex) {
                }
                return false;
            }
        },
        // 获取flash
        getFlashHtml: function (id, width, height, path) {
            var swfUrl = path;
            return ['<object codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"', ' width="' + width + '" height="' + height + '" id="' + id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">', '<param name="allowScriptAccess" value="always" />', '<param name="movie" value="' + swfUrl + '" />', '<param name="quality" value="high" /><param name="allowScriptAccess" value="always" />', '<param name="wmode" value="transparent" />', ' <embed src="' + swfUrl + '" quality="high" width="' + width + '" height="' + height + '" wmode="transparent"', ' type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer"', ' name="' + id + '"  >', '</embed>', '</object>'].join("");
        },
        getVoiceOption: function () {
            var result = {};
            if (this.options.grammarList) {
                result.grammarList = this.options.grammarList;
            }
            return result;
        },
        onComplete:function(args){
            var input=$(this.options.input);
            var text = decodeURIComponent(args.result).replace(/[，。！？]/ig, "");//替换标点
            if (input && input.is("input")) {
                input.val(input.val()+text);
                input.focus();
            } else {
                input.html(input.html()+text);
            }
            if (this.options.onComplete) {
                console.log("oncomplete:"+text);
                this.options.onComplete(text);
            }
            if (this.options.autoClose && text!="") {
                this.onCancel();
            }
        },
        onCancel: function (paramInstance) {
            var self = this;
      
            setTimeout(function () { //延时执行避免flash报错
                var instance = VoiceInput._instance;
                if (paramInstance && paramInstance.onCancel) {
                    instance = paramInstance;
                }
                if (instance.options.popup) {
                    instance.options.popup.close();
                }
            }, 100);

        },
        render: function () {
            var self = this;
            var html
            if (this.isSupportFlash()) {
                html = this.getFlashHtml("VoiceInput", 250, 150, "/m2012/flash/voice_input.swf?rnd="+top.sid);
            } else {
                html = "<div style=\"width:200px;height:55px;margin-top:20px;margin-bottom:20px\">您的浏览器未安装或禁用了flash插件，无法使用语音功能。</div>";
            }
            
            function createPopup() {
                for (var i = 0; i < VoiceInput._instanceList.length; i++) {
                    var instance = VoiceInput._instanceList[i];
                    if (instance != self) {
                        instance.onCancel(instance);
                    }
                }
                M139.UI.Popup.close();
                var popup = M139.UI.Popup.create({
                    target: $(self.options.button),
                    input: $(self.options.input),
                    autoHide:true,
                    content: html
                });
                self.options.popup = popup;
                popup.render();

                popup.on("close", function () {
                    //alert("close")
                });

                /*M139.Dom.bindAutoHide({
                    element: popup.contentElement,
                    callback:self.onCancel
                });*/
            }


            if (this.options.autoCreate) {
                VoiceInput.setCurrent(self);
                createPopup();
                BH("voiceinput_" + this.options.from);
            } else {
                $(this.options.button).click(function () {

                    VoiceInput.setCurrent(self);
                    createPopup();
                    BH("voiceinput_" + self.options.from);
                });
            }
           
           
        }
    }));
      
 
 })(jQuery, _, M139);
var VoiceInput={ 
    _instance: null,
    _instanceList:[],
    setCurrent: function (obj) {

        this._instance = obj;
    },
    create: function (options) { //工厂模式＋单例，创建一个popup实例
        if (!options.from) { options.from = "search" }
        this._instance = new M2012.UI.Widget.VoiceInput(options);
        this._instanceList.push(this._instance);
         this._instance.render();
         
         

         
         
         /*$GlobalEvent.on("click", function (e) {
             console.log(e.window);
             //e.event
         });*/
         return this._instance;
     },
     getVoiceOption: function () {
         return this._instance.getVoiceOption();
     },
     onComplete: function (args) {
         this._instance.onComplete(args);
     },
     onCancel: function () {
         this._instance.onCancel();
     },
     close: function (name) {
        this._instance.onCancel();
     },
     onInit: function (args) {
         
     }

 }
