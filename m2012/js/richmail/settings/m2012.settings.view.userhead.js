(function (jQuery, _, M139) {
    var $ = jQuery;
    var SWFID = "account_user_head_flashupload";
    var superClass = M139.View.ViewBase;
    
    if (typeof(parent.getDomain) !== "function") {
        return;
    }

    window.frmInfoOnLoad = function (obj){
        top.WaitPannel.hide();

        var isComplate = false;
        try {
            var doc = obj.contentWindow.document.body.innerHTML;
            if (doc) {
                isComplate = true;
            }
        } catch (e) {
            isComplate = false;
        }

        if (!isComplate) {
            return;
        }

        JSForFlashUpload.oncomplete(100, obj.contentWindow.document.body.innerHTML);
    };


    var baseUrl = parent.getDomain("webmail"); //2处要用，写头部

    M139.namespace('M2012.Settings.View.UserHead', superClass.extend(
        {
            imgUrl: baseUrl + "/addr/apiserver/httpimgload.ashx",
            /*
            *账户信息中的上传用户头像类
            *@constructs M2012.Settings.View.UserHead
            *@param {Object} options 初始化参数集
            *@example
            *var userHead = new M2012.Settings.View.UserHead(
                     {
                        container:$("#id"),      //触发上传事件的控件, flash的大小 = 控件大小
                        maxSize:1024*1024, //1M
                        success:function(responseText){},
                        error:function(errorCode, errorMsg){}
                     }
                *);
            */
            initialize: function (options) {
                var This = this;
                var obj = options.container;    //控件对象
                var success = options.success;  //成功时调用的方法
                var failure = options.error;    //失败时调用的方法
                var maxSize = options.maxSize;  //最大大小
                This.$el = obj;
                This.model = new Backbone.Model();

                //方法转换一下
                options = $.extend({}, {
                    oncomplete: function (taskId, responseText) {
                        var page = $(responseText);
                        var url = $("#oldImageUrl", page).val(); //获取返回页面中的图片地址
                        
                        var errCode = $("#errCode", page).val();

                        var errMsg = "";
                        switch(errCode){
                            case "1000":
                                errMsg = "上传成功";
                                break;
                            case "1002":
                                errMsg = "请上传gif、jpg、jpeg、bmp、png格式的图片";
                                break;
                            case "1003":
                                errMsg = "请选择您要上传的图片";
                                break;
                            case "1004":
                                errMsg = "请上传大小在1MB以内的图片";
                                break;
                            default:
                                errMsg = "请稍后再试。";
                                break;
                        }

                        var src = parent.$T.Url.makeUrl(This.imgUrl, {
                            sid: parent.$App.getSid(),
                            path: url
                        });
                        if (url) {
                            success(url);
                        }
                        else {
                            failure(204, errMsg); //204:无内容
                        }
                    },
                    onerror: function (taskId, errorCode, errorMsg) {
                        failure(errorCode, errorMsg);
                    }
                });

                if (maxSize) { //文件最大体积设置
                    options = $.extend(options, {
                        getMaxSize: function () {
                            return maxSize;
                        }
                    });
                }

                window.JSForFlashUpload = $.extend(JSForFlashUpload, options); //覆盖JSForFlashUpload的方法
                window.FlashForJS = FlashForJS;
                This.render();
                return superClass.prototype.initialize.apply(This, arguments);
            },
            render: function () {
                var size = {};
                var _this = this;
                var obj = _this.$el;
                if (obj) {
                    size = {
                        width: obj.width(),
                        height: obj.height()
                    };
                } else {
                    size = { width: 1, height: 1 }; //不传递参数时
                }

                var disableflash = $T.Cookie.get("flashUploadDisabled");
                if (disableflash) {
                     _this.resetCommonUpload();
                    return;
                }

                var url = "/m2012/flash/Richinfo_annex_upload.swf";
                var swfObj = new SWFObject(url, SWFID, size.width, size.height);
                swfObj.addParam("wmode", "transparent");
                var flashObj = $('<div style="position:absolute;z-index:9999;"></div>').html(swfObj.getHTML());

                _this.$el.before(flashObj);

                //自动检测一下flash是否可用，如果不可用，则转成普通上传
                setTimeout(function () {
                    var reset = false;
                    try {
                        if (!document.getElementById(SWFID).uploadAll) {
                            reset = true;
                        }
                    } catch (e) {
                        reset = true;
                    }
                    if (reset) _this.resetCommonUpload();
                }, 2400);

            },
            
            resetCommonUpload: function () {
                var _this = this;

                _this.$el.before([
                    '<div id="floatDiv" style="position:absolute">',
                        '<form enctype="multipart/form-data" id="fromAttach" method="post" action="" target="frmAttachTarget">',
                        '<input hideFocus style="filter:alpha(opacity=0);opacity:0;" type="file" name="uploadInput" id="uploadInput" />',
                        '</form><iframe id="frmAttachTarget" style="display: none" name="frmAttachTarget" onload="frmInfoOnLoad(this)"></iframe>',
                    '</div>'].join(''));

                setTimeout(function() {
                    _this.initCommonUpload();
                    _this.$el.find("#fromAttach").show();
                }, 0xff);

                $T.Cookie.set({name : 'flashUploadDisabled',value : '1'});
                $(document.getElementById(SWFID)).parent().remove();
            },

            initCommonUpload: function () {
                var btnAttach = document.getElementById("uploadInput");
                btnAttach.onchange = function () {
                    var input = this;
                    var fileName = input.value;
                    if(!fileName)return;
                    var form = document.forms["fromAttach"];

                    //检查文件是不是图片
                    if ( !/\.(?:jpg|jpeg|gif|png|bmp|webp)$/i.test(fileName) ) {
                        top.$Msg.alert("头像上传失败，请上传gif、jpg、jpeg、bmp、png格式的图片");
                        form.reset();
                        return;
                    }

                    form.action = JSForFlashUpload.getUploadUrl();
                    try {
                        form.submit();
                    } catch (e) {
                        $("#frmAttachTarget").attr("src", "/blank.htm").load(function () {
                            $(this).unbind("load", arguments.callee);
                            form.submit();
                        });
                    }

                    try {
                        parent.M139.UI.TipMessage.show("正在保存…");
                    } catch(ex) {}
                };

                var filecon = $("#floatDiv");
                $("#userImage").mousemove(function(e){
                    filecon.css({left:e.offsetX-30, top:e.offsetY})
                });

            }

        })
    );

    /* FLASH上传控件交互方法 */
    JSForFlashUpload = {
        getUploadUrl: function () {
            var url = baseUrl + "/addr/apiserver/uploadcontactimage.aspx";  //电子签名》头像
            url = parent.$T.Url.makeUrl(url, {
                sid: parent.$App.getSid(),
                funcid: "upload", //上传？
                rnd: Math.random()
            });
            return url;
        },
        onload: function (options) {
            options["filter"] = ["images图片(*.gif;*.jpg;*.jpeg;*.png;*.bmp)"];
            options["uploadFieldName"] = "fileUpload";
            return options;
        },
        onselect: function (xmlFileList, jsonFileList) {
            var maxSize = (this.getMaxSize && this.getMaxSize()) || 1024 * 1024; //大小
            for (var i = 0; i < jsonFileList.length; i++) {
                var file = jsonFileList[i];
                if (file.fileSize > maxSize) {
                    jsonFileList.splice(i, 1);
                    i--;
                }
                else {
                    jsonFileList = [file]; //选择多张图片时，只上传第一张
                    break;
                }
            }

            if (jsonFileList.length == 0) {
                var maxSize = (this.getMaxSize && this.getMaxSize()) || 1024 * 1024; //大小
                maxSize = parent.$T.Utils.getFileSizeText(maxSize);
                this.onerror(0, 0, "上传的图片最大为" + maxSize + "，请重新选择");
                return;
            }
            //延迟，自动上传，无需点击上传按钮
            window.uploadTimer = setTimeout(function () {
                var flash = document.getElementById("account_user_head_flashupload");
                flash.uploadAll();
            }, 256);

            try {
                parent.M139.UI.TipMessage.show("正在保存…");
            } catch(ex) {}

            return jsonFileList;
        },
        onprogress: function (taskId, sendedSize, uploadSpeed) {

        },
        oncomplete: function (taskId, responseText) {
            //处理返回值
        },
        onerror: function (taskId, errorCode, errorMsg) {
            //处理错误
        },
        onmouseover: function () {

        },
        onmouseout: function () {

        },
        onclick: function () {
            //初始化
            return true;
        }
    };

    var FlashForJS = {
        upload: function () {
            var flash = document.getElementById(SWFID);
            flash.uploadAll();
            ImportMailView.loadView.show();
        },
        cancel: function (taskId) {
            var flash = document.getElementById(SWFID);
            flash.cancel(taskId);
        }
    };

    jQuery.extend(M2012.Settings.View.UserHead, {
        create: function (options) {
            if (options && options.container) {
                var userHead = new M2012.Settings.View.UserHead(options);
                return userHead;
            } else {
                throw "M2012.Settings.View.UserHead参数非法";
            }
        }
    });
})(jQuery, _, M139);

