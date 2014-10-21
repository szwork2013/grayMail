(function ($, _, M139) {

    var _class = "M2012.Disk.Common";

    M139.namespace(_class, function () {
        var self = this;
        // 预览支持的文件大小
        self.previewSize = 1024 * 1024 * 20;
        // 可预览的文档拓展名
        self.documentExts = "doc/docx/xls/xls/ppt/pdf/txt/htm/html/pptx/xlsx/rar/zip/7z";
        // 图片类拓展名
        self.imageExts = "jpg/gif/png/ico/jfif/tiff/tif/bmp/jpeg/jpe";
        self.audioExts = "/mp3/wav/ogg/wma/m4a/";
        self.videoExts = "/avi/flv/mp4/rm/rmvb/wmv/3gp/mov/webm/mpg/mpeg/asf/mkv/";
        self.previewUrl = "/m2012/html/onlinepreview/online_preview.html?src=disk";

        self.sendTypes = {// 发送类型
            MAIL: 'mail', // 邮件
            MOBILE: 'mobile' // 手机
        };
        self.previewTypes = {// 预览类型
            IMAGE: 'image', // 图片，当前页面弹出遮罩层预览
            DOCUMENT: 'document', // 文档，新窗口预览
            AUDIO: 'audio',	// 音频
            VIDEO: 'video'		// 视频
        };
        self.dirTypes = {// 文件类型
            ROOT: 0,//根目录 此值是前端定义，用以将根目录和其他目录进行区分，服务端定义为1
            USER_DIR: 1, // 自定义文件夹
            FILE: 'file', // 文件
            DIRECTORY: 'directory', // 文件
            ALBUM: 3, // 我的相册
            MUSIC: 4 // 我的音乐
        };
        self.dirFlag = {//是否系统文件夹
            SYS_DIR: "0",//系统目录
            NO_SYS_DIR: "1"//非系统目录
        };
        self.shareTypes = {// 分享类型
            SINGLE: 'single', // 单击文件列表超链接分享的是单个文件
            BATCH: 'batch' // 单击工具栏命令按钮分享的是批量选中的文件
        };
        self.dirLevelLimit = {   //新建文件夹创建级数限制
            USER_DIR: 4,   //自定义文件夹总共可以出现五级，允许新建到第四级
            SYS_DIR: 2     //系统文件夹下到第二级，包含第二级
        };
        self.sysDirIds = {
            ALBUM_ID: 20,
            MUSIC_ID: 30
        };
        self.fileClass = {
            IMAGE: 'viewPic',
            //	DOCUMENT : 'viewPicN'
            DOCUMENT: 'viewPic'
        };
        //分享对象类型
        self.shareObjTypes = {
            //文件夹
            DIR: "dir",
            //文件
            FILE: "file"
        };
        //可以预览的图片类型
        self.imageTypes = "|jpg|gif|png|ico|jfif|tiff|tif|bmp|jprg|jpe|";
        //官方文件夹标示
        self.systemFilePath = "00019700101000000001/1111VP0Q24Dg00019700101000000503";
        self.sharePath = "00019700101000000001";
        self.fileExtract = "../../images/module/FileExtract/";

        self.TIPS = {
            PREVIEW_OVERSIZE: "该文件超出了在线预览支持的文件大小，请下载后查看",
            OPERATE_SUCCESS: "操作成功",
            OPERATE_ERROR: "操作失败，请稍后再试",
            SHARE_SUCCESS: "分享成功！你的好友将能看到您分享的文件！",
            SHARER_MAX: "共享人数已达到上限{0}人"
        };

        //列表视图展示模式
        self.LIST_VIEW_TYPE = {
            LIST: 1,
            THUMB: 2,
            TIMELINE: 3
        };
    });

    //添加属性、方法
    M2012.Disk.Common.prototype = {

        /**
         * 获取资源路径名称
         */
        getResource: function () {
            var resourcePath = window.top.resourcePath;
            if (top.isRichmail) {//rm环境,返回rm变量
                resourcePath = window.top.rmResourcePath;
            }
            return resourcePath;
        },

        /**
         *  从服务器获取数据
         *  @param {Object}  file //文件信息   
         *  @param {Number}  file.size //图标类型 1: 大图标 0:小图标
         *  @param {Boolean}  file.isSystem //是否系统文件夹
         *  @param {String}  file.name //文件(夹)名称
        **/
        getFileIconClass: function (file) {
            if (file.isDir) {
                var css = "i-f-sys";
                if (file.isSystem)
                    css = " i-f-system";
                return "i-file-smalIcion " + css;
            }
            return $T.Utils.getFileIcoClass2(file.size, file.name);
        },

        getThumbImage: function (file) {
            var self = this;

            if (file.isDir) {
                return self.fileExtract + "norSys.png";
            }
            var extName = $T.Url.getFileExtName(file.name);
            return self.fileExtract + self.getThumbImageName(extName);
        },

        // 根据文件名获取文件缩略图名称（非图片）
        getThumbImageName: function (extName) {
            var doc = 'doc/docx',
                html = 'htm/html',
                ppt = 'ppt/pptx',
                xls = 'xls/xlsx',
                rar = 'rar/zip/7z',
                music = 'mp3/wma/wav/mod/m4a',
				vedio = 'mp4,wmv,flv,rmvb,3gp,avi,mpg,mkv,asf,mov,rm',
                other = 'pdf/ai/cd/dvd/psd/fla/swf/txt';

            if (extName == "") {
                return 'default.png';
            }
            if ("eml".indexOf(extName) != -1) {
                return 'eml.png';
            }
            if (doc.indexOf(extName) != -1) {
                return 'doc.png';
            }
            if (html.indexOf(extName) != -1) {
                return 'html.png';
            }
            if (ppt.indexOf(extName) != -1) {
                return 'ppt.png';
            }
            if (xls.indexOf(extName) != -1) {
                return 'xls.png';
            }
            if (rar.indexOf(extName) != -1) {
                return 'rar.png';
            }
            if (extName && music.indexOf(extName.toLowerCase()) != -1) {
                return 'music.png';
            }
            if (extName && vedio.indexOf(extName.toLowerCase()) != -1) {
                return 'rmvb.png';
            }
            if (other.indexOf(extName) != -1) {
                return extName + '.png';
            }
            if ("exe".indexOf(extName) != -1) {
                return 'exe.png';
            }
            return 'jpg.png';
        },

        /**
         *  获取文件大小带单位的描述信息
         *  @param {Number}  fileSize //文件字节大小     
        **/
        getFileSizeText: function (fileSize) {
            if (!_.isNumber(fileSize))
                return "";
            return $T.Utils.getFileSizeText(fileSize);
        },

        /**
         *  获取文件的扩展名
         *  @param {String}  fileName //文件名    
        **/
        getFileExt: function (fileName) {
            if (fileName) {
                var reg = /\.([^.]+)$/;
                var m = fileName.match(reg);
                return m ? m[1] : "";
            }
            return "";
        },

        getShortName: function (name, maxLength, isDir) {
            if (!name)
                return "";
            if (name.length < maxLength)
                return name;

            var dot = name.lastIndexOf(".");
           
            //如果是文件夹或文件没有后缀名
            //则直接返回截取值
            if (isDir || dot < 0) {
                return name.substring(0, maxLength) + "…";
            }

            var part = name.substring(0, dot);
            var ext = name.substring(dot);
         
            if (part.length > maxLength)
                part = part.substring(0, maxLength) + "…";

            return part + ext;
        },

        /**
         *  判断文件是否是图片
         *  @param {String}  fileName //文件名    
        **/
        isFileImage: function (fileName) {
            var self = this;
            var ext = self.getFileExt(fileName).toLowerCase();

            ext = $T.format("|{0}|", [ext]);
            return self.imageTypes.indexOf(ext) > -1;
        },

        /**
         * 判断文件是否超过预览支持的最大尺寸
         * @param {Object}  size //文件字节大小   
        **/
        isOverSize: function (size) {
            if (!size)
                return false;
            return size > this.previewSize;
        },

        /**
         * 文件预览
         * @param {Object}  file //文件    
         * @param {String}  file.name //文件名称 
         * @param {Number}  file.size //文件大小(可选)
         * @param {String}  file.path //文件路径信息
         * @param {String}  file.thumbnailURL //图片缩略小图(图片格式文件需要)
         * @param {String}  file.bigthumbnailURL //图片缩略大图(图片格式文件需要)
        **/
        previewFile: function (file) {
            if (!file)
                return;
            var self = this;
            var type = self.getPreviewType(file.name);

            //音乐
            if (type === self.previewTypes.AUDIO) {
                self.addToAudioPlayer(file);
                return;
            }
            //视频
            if (type === self.previewTypes.VIDEO) {
                self.playVideo(file);
                return;
            }
            //判断文件是否太大
            if (self.isOverSize(file.size)) {
                console.log('sorry, 文件太大不支持预览！！');
                top.$Msg.alert(self.TIPS.PREVIEW_OVERSIZE);
                return;
            }
            //图片和文档需要先获取其下载地址
            self.download({
                fileIds: [file.id],
                isFriendShare: 1,
                path: file.path || self.sharePath,
                success: function (url) {
                    if (!url) return;
                    if (type === self.previewTypes.IMAGE) {
                        file.presentURL = url;
                        file.fileName = file.name;
                        self.previewImage(file);
                        return;
                    }
                    if (type === self.previewTypes.DOCUMENT) {
                        file.downloadUrl = url;
                        self.previewDocument(file);
                    }
                }
            });

        },

        /**
         * 获取文件预览类型
         * @param {String}  fileName //文件名称   
        **/
        getPreviewType: function (fileName) {
            var self = this;
            var ext = self.getFileExt(fileName);
            if (self.documentExts.indexOf(ext) != -1) {
                return self.previewTypes.DOCUMENT;
            } else if (self.imageExts.indexOf(ext) != -1) {
                return self.previewTypes.IMAGE;
            } else if (self.videoExts.indexOf("/" + ext + "/") != -1) {
                return self.previewTypes.VIDEO;
            } else if (self.audioExts.indexOf("/" + ext + "/") != -1) {
                return self.previewTypes.AUDIO;
            }
            return "";
        },


        /**
         * 文档预览
         * @param {Object}  file //文件
         * @param {String}  file.id //文件id  
         * @param {String}  file.name //文件名称  
         * @param {String}  file.downloadUrl //文件下载地址         
         * @param {String}  file.size //文件大小
         */
        previewDocument: function (file) {
            var self = this;
            var url = $T.Url.makeUrl(self.previewUrl, {
                sid: top.sid,
                id: file.id,
                dl: file.downloadUrl,
                fi: file.name,
                skin: top.UserConfig.skinPath,
                resourcePath: self.getResource(),
                diskservice: top.SiteConfig.diskInterface || "",
                filesize: file.size,
                disk: top.SiteConfig.disk
            });
            window.open(url);
        },

        /**
		* 添加当前目录内歌曲到音乐播放器
        * @param {Object}  file //文件
		*/
        addToAudioPlayer: function (file) {
            if (!file)
                return;
            var data = {
                id: file.id,
                url: file.presentURL || file.presentURL,
                text: file.name
            }
            top.MusicBox.addMusic(file.id, [data]);
            top.MusicBox.show();
        },

        /**
         * 播放视频文件
         * @param {Object}  file //文件对象
         */
        playVideo: function (file) {
            if (!file) return;
            var url = "/m2012/html/onlinepreview/video.html?sid=" + top.sid;
            var presentURL = "";
            presentURL = file.presentURL || file.presentLURL || file.presentHURL || file.presentURL || file.presentLURL || file.presentHURL;
            url += "&id=" + file.id;
            url += "&name=" + encodeURIComponent(file.name);
            //  url += "&curDirType=" + this.model.get("curDirType");
            url += "&presentURL=" + encodeURIComponent(presentURL);
            top.addBehavior("disk_video_play");
            console.log("play video");
            window.open(url, "_blank");
        },

        /**
		 * 图片单击事件，打开图片预览层
		 * 并添加当前目录内的图片到幻灯片列表
         * @param {Object}  file //文件    
		**/
        previewImage: function (file) {
            if (!file)
                return;
            if (!file.thumbnailURL || !file.bigthumbnailURL)
                return;
            // file.
            var data = [file];

            if (!_.isUndefined(top.focusImagesView)) {
                top.focusImagesView.render({ data: data, index: 0 });
                return;
            }

            var key = "M2012.OnlinePreview.FocusImages.View";
            top.M139.registerJS(key, "packs/focusimages.html.pack.js?v=" + Math.random());
            top.M139.requireJS([key], function () {
                top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                top.focusImagesView.render({ data: data, index: 0 });
            });

        },

        /**
         * 获取联系人名字
         * @param {Number}  mobile  //联系人手机号码
        **/
        getContactName: function (mobile) {
            mobile = mobile || "";
            mobile = $Mobile.remove86(mobile);
            var contact = top.Contacts.getSingleContactsByMobile(mobile, true);
            if (contact)
                return contact.AddrFirstName;
            return mobile;
        },

        /**
         * 是否是系统文件夹
        * @param {Object}  file      //文件信息对象
       **/
        isSystemFile: function (file) {
            var self = this;
            if (!file)
                return false;

            if (file.name === "云享四川")
                return true;

            if (file.path === self.systemFilePath)
                return true;

            return false;
        },

        /**
        * 判断元素是否被锁定
        * @param {Object}  el  //页面DOM元素 jQuery对象  
        * @param {Number}  timeout //解锁时间，默认1000ms
       **/
        isLocked: function (el, timeout) {
            var self = this;
            var attr = el.attr("locked") || "";

            if (attr.length > 0)
                return true;

            timeout = timeout || 1000;
            el.attr("locked", "1");
            window.setTimeout(function () {
                el.removeAttr("locked");
            }, timeout);
            return false;
        },

        /**
         * 页面顶部显示提示信息条
        **/
        showTips: function (mssage, delay) {
            if (!top.$diskTips) {
                var html = "<span style=\"position: absolute; display:none; z-index: 9999; top: 0px; left: 45%; display: block; opacity: 1;\" class=\"msg msgYellow\"></span>";
                top.$diskTips = $(html).appendTo(top.window.document.body);
            }
            if (!_.isNumber(delay))
                delay = 2500;

            if (top.diskTipTimeouter)
                top.window.clearTimeout(top.diskTipTimeouter);

            //显示tip
            top.$diskTips.text(mssage).css({ top: 15 }).show()
                .animate({ top: 0 }, 200, function () {
                    top.diskTipTimeouter = top.window.setTimeout(function () {
                        top.$diskTips.fadeOut("fast");
                    }, delay);
                });
        }

    };
})(jQuery, _, M139);
﻿(function ($, _, M139) {

    var _class = "M2012.Disk.CommApi";

    M139.namespace(_class, function () { });

    //添加属性、方法
    M2012.Disk.CommApi.prototype = {

        callApi: function (api, options, fnSuccess, fnError) {
            top.$RM.call(api, options, function (res) {
                if (res && res.responseData) {
                    if (res.responseData.code == "S_OK") {
                        var data = res.responseData["var"];
                        fnSuccess && fnSuccess(data);
                    } else {
                        fnError && fnError(res.responseData);
                    }
                    return;
                }
                fnError && fnError();

            }, function (e) {
                fnError && fnError(e);
            });
        },

        /**
        * 管理回收站文件信息
        * @param {Number}    options.dirType //目录类型: 1为普通类型 3 相册类型 4音乐类型。
        * @param {String}    options.directoryIds //待操作目录ID，多个的时候用“,”隔开。
        * @param {Number}    options.fileIds //待操作文件ID，多个的时候用“,”隔开
        * @param {Function}  fnSuccess //数据访问成功后的处理函数   
        * @param {Function}  fnError   //数据访问失败后的处理函数   
       **/
        delFiles: function (options, fnSuccess, fnError) {
            this.callApi("disk:delete", options, fnSuccess, fnError);            
        },

        /**
         * 获取回收站列表信息
         * @param {Number}    options.toPage //需要跳转到的页码，默认第1页，当小于1时，pageSize忽略，返回全部列表。
         * @param {Number}    options.pageSize //每页显示记录数 ，默认获取30条记录。
         * @param {Number}    options.sortDirection //文件的排序方向。默认按正序。1：正序 0：反序
         * @param {Number}    options.contentSortType //排序类型
         * @param {Function}  fnSuccess //数据访问成功后的处理函数   
         * @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        getVirDirInfo: function (options, fnSuccess, fnError) {
            this.callApi("disk:getVirDirInfo", options, fnSuccess, fnError);
        },

        /**
         * 管理回收站文件信息
         * @param {Number}    options.opr //操作类型 1：还原 2：逻辑删除 3：清空回收站。
         * @param {String}    options.directoryIds //待操作目录ID，多个的时候用“,”隔开。
         * @param {Number}    options.fileIds //待操作文件ID，多个的时候用“,”隔开
         * @param {Function}  fnSuccess //数据访问成功后的处理函数   
         * @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        mgtVirDirInfo: function (options, fnSuccess, fnError) {
            this.callApi("disk:mgtVirDirInfo", options, fnSuccess, fnError);
        }
    };
})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.ViewManager";

    M139.namespace(_class, superClass.extend({

        name: _class,

        el: "#outArticle",

        logger: new M139.Logger({ name: _class }),

        viewMaps: {
            doc: { url: "/disk/disk_doc_async.html.pack.js", type: "module" },
            pic: { url: "/disk/disk_pic_async.html.pack.js", type: "module" },
            music: { url: "/disk/disk_music_async.html.pack.js", type: "module" },
            vedio: { url: "/disk/disk_vedio_async.html.pack.js", type: "module" },
            sharerec: { url: "/disk/disk_recived_async.html.pack.js", type: "module" },
            shareto: { url: "/disk/disk_shared_async.html.pack.js", type: "module" },
            recycle: { url: "/disk/disk_recycle_async.html.pack.js", type: "module" }
        },

        master: null,

        cacheViews: null,

        /**
         * 构造方法
        **/
        initialize: function (args) {
            var self = this;
            self.master = args.master;
            self.cacheViews = {};
            self.initEvents();

            return superClass.prototype.initialize.apply(self, arguments);
        },

        /**
         * 初始化事件
        **/
        initEvents: function () {
            var self = this;
            var master = self.master;

            //注册路由事件，页面视图跳转都是通过该事件完成
            //@param {String} args.path //视图跳转地址, 例：main/index 标示主视图的index模块视图
            master.on(master.EVENTS.NAVIGATE, function (args) {
                if (!args || !args.path)
                    return;

                var path = args.path.toLowerCase();
                var matchs = path.match(/^([^/]+)\/([^/]+)$/);
                if (!matchs || !matchs[1] || !matchs[2])
                    return;
                //视图类型
                var type = matchs[1];
                //视图名称
                var view = matchs[2];

                //如果是主视图
                if (type === "main") {
                    self.show(view, args);
                }
            });
        },

        /**
         *  显示视图
         *  @param {String} name //视图名称
         *  @param {Object} args //视图显示相关参数
        **/
        show: function (name, args) {
            if (!name)
                return;

            var self = this;
            var master = self.master;
            var view = self.cacheViews[name];

            //首先从缓存里取当前视图
            //缓存中没有找到则需要异步创建新的视图
            if (_.isUndefined(view)) {
                self.createViewAsync(name, args);
                return;
            }

            //显示已经缓存的视图
            self.showCacheView(name);
            //触发视图显示事件
            master.trigger(master.EVENTS.VIEW_SHOW, {
                //视图名称
                name: name,
                //当前视图的容器
                container: view.container,
                //该参数标示此视图已经缓存过
                cache: true,
                //携带参数
                args: args
            });
        },

        /**
         *  创建新视图
         *  @param {String} name //视图名称
         *  @param {Object} args //视图携带参数
        **/
        createView: function (name, args) {
            var self = this;
            var master = self.master;
            var EVENTS = master.EVENTS;

            //为该模块创建一个DIV区域
            var html = $T.format(self.template.main, {
                cid: self.cid, name: name
            });
            var container = $(html).appendTo(self.$el);

            //缓存当前视图
            self.cacheViews[name] = {
                name: name,
                container: container
            };

            //显示已经缓存的视图
            self.showCacheView(name);
            //触发视图创建事件
            master.trigger(EVENTS.VIEW_CREATED, {
                name: name,
                container: container,
                args: args,
                onshow: function () {
                    master.trigger(EVENTS.VIEW_SHOW, {
                        name: name,
                        cache: false,
                        container: container,
                        args: args
                    });
                }
            });
        },

        /**
        *  异步创建视图
        *  @param {String} name //视图名称
       **/
        createViewAsync: function (name, args) {
            var self = this;
            var map = self.viewMaps[name];

            if (_.isUndefined(map))
                return;

            M139.core.utilCreateScriptTag({
                id: "disk_" + name + "_pack",
                src: top.getDomain('resource') + '/m2012/js/packs' + map.url + '?sid=' + top.sid,
                charset: "utf-8"
            }, function () {

                self.createView(name, args);
            });
        },

        /**
         *  显示已经缓存的视图，隐藏其他视图
         *  @param {String} name //视图名称
        **/
        showCacheView: function (name) {
            var self = this;
            var view = null;
            for (var key in self.cacheViews) {
                view = self.cacheViews[key];
                if (view.name === name) {
                    view.container.show();
                    continue;
                }
                view.container.hide();
            }
        },

        template: {
            main: '<div class="outArticle" id="{cid}_{name}" style="height: 100%;"></div>'
            // main: '<div class="outArticleMain" id="{cid}_{name}" style="height: 100%;"></div>'
        }

    }));



})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var _super = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.Master";

    M139.namespace(_class, _super.extend({

        name: _class,
        defaults: {
            //列表视图展示方式
            // 1：列表 2：缩略图 3：时间轴
            list_view_type: 2
        },
        EVENTS: {
            VIEW_CREATED: "disk#view_created",
            VIEW_SHOW: "disk#view_show",
            NAVIGATE: "disk#navigate",
            MAINVIEW_SHOW: "disk#mainview_show",
            INIT: "disk#init",
            CHANGE: "disk#change",
            TIP_SHOW: "tip#show",
            TIP_HIDE: "tip#hide"
        },

        //视图管理对象
        viewMgr: null,
        //常用处理方法
        common: null,

        initialize: function (args) {
            var self = this;
            //初始化视图管理对象
            self.viewMgr = new M2012.Disk.View.ViewManager({ master: self });
            self.common = new M2012.Disk.Common();
            self.commApi = new M2012.Disk.CommApi();
            self.initEvents();
            return _super.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;
            //首先创建并加载主视图
            self.on(self.EVENTS.MAINVIEW_SHOW, function (args) {
                self.viewMgr.createView("main");
            });
            //顶部显示提示信息
            self.on(self.EVENTS.TIP_SHOW, function (args) {
                if (!args)
                    return;

                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });
            //顶部提示信息隐藏
            self.on(self.EVENTS.TIP_HIDE, function (args) {
                top.M139.UI.TipMessage.hide();
            });


        }
    }));

    $(function () {
        window.$Disk = new M2012.Disk.Model.Master();
    });

})(jQuery, _, M139);
﻿
﻿; (function ($, _, M139) {

    var _super = M139.View.ViewBase;
    var _class = "M2012.Disk.View.NavigateBar";

    M139.namespace(_class, _super.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),
        //视图模型数据
        model: null,
        //视图主控
        master: null,
        //当前控件父容器
        container: null,

        /**
         *  面包屑效果导航
         *  @param {Object} args.master //视图主控
         *  @param {Object} args.container //控件父容器
         *  @param {Object} args.master //视图主控
        **/
        initialize: function (args) {
            var self = this;

            _super.prototype.initialize.apply(self, arguments);

            args = args || {};
            self.master = args.master || window.$Disk;
            self.container = args.container;
            self.model = new M2012.Disk.Model.NavigateBar({
                master: master
            });
            self.initEvents();
            self.render();
            return
        },

        initEvents: function () {
            var self = this;

            //初始化数据
            self.on("init", function (args) {
                self.model.setNavigate(args);
            });

            self.model.on("change", function () {

                if (self.model.hasChanged("navs")) {
                    self.render();
                }
            });
        },

        render: function () {
            var self = this;
            var html = self.template;
            var template = _.template(html);
            var data = self.model.get("navs");
            self.container.html(template(data));
        },

        template: [
            '<a href="javascript:;">全部文件</a>',
            '<% _.each(obj, function(i){ %>',
            '<span class="f_st">&nbsp;&gt;&nbsp;</span>',
            '<a href="javascript:;" data-path="<%=_.escape(i.path)%>" data-system="<%=i.isSystem%>" data-dirid="<%=_.escape(i.dirId)%>">',
                '<%=_.escape(i.dirName)%>',
            '</a>',
            '<% }) %>'
        ].join("")

    }));

    (function () {

        var base = M139.Model.ModelBase;
        var current = "M2012.Disk.Model.NavigateBar";

        M139.namespace(current, base.extend({

            name: current,

            master: null,

            defaults: {
                //访问的导航路径
                navs: null
            },

            /**
              *  构造函数
              *  @param {Object} args.master     //日历视图主控
              *  @param {Date} args.date         //指定的时间(可选)
             **/
            initialize: function (args) {
                var self = this;
            },


            /**
             *  将当要访问的文件夹信息存贮在访问导航列表中
             *  @param {String}  args.dirId  //文件夹ID      
             *  @param {String}  args.path   //文件夹路径信息 
             *  @param {String}  args.dirName //文件夹路径信息 
             *  @param {Number}  args.isSystem //是否系统文件夹 1:是，0：否
            **/
            setNavigate: function (args) {
                var self = this;
                var navs = [];
                var value = self.get("navs") || [];

                if (args) {
                    //此处先查询下目前的导航信息，如果已经存在该目录
                    //说明导航可能是回到上级目录，所以需要去掉当前目录的子目录
                    $.each(value, function (i, n) {
                        if (n.dirId == args.dirId)
                            return false;
                        navs.push(n);
                    });
                    //加入当前目录
                    navs.push({
                        dirId: args.dirId,
                        path: args.path,
                        dirName: args.dirName,
                        isSystem: args.isSystem || 0
                    });
                }

                //只有导航信息发生变化后才去重设对象值
                if (!_.isEqual(navs, value)) {
                    self.set({ navs: navs });
                }
            }

        }));

    })();

})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.listTemplate";

    M139.namespace(_class, superClass.extend({
        name: _class,
        defaults: {
            //当前视图页码
            pageIndex: 1,
            //页数
            pageCount: 0,
            //每页显示信息条数
            pageSize: 30,
            //访问的导航路径
            navs: null,
            //当前目录下所有共享数据
            cacheData: new Array(),
            //hash缓存数据便于快速查找
            cacheHash: null,
            //选中的项
            checkData: new Array(),
            //当前目录的根目录
            curRootDir: null,
            //排序表达式
            sortExp: "date-desc"
        },

        logger: new M139.Logger({ name: _class }),

        master: null,

        EVENTS: {

        },

        TIPS: {
            FETCH_DATA_ERROR: "网络异常，请稍后重试",
            DATA_FETCHING: "数据加载中",
            OPERATE_ERROR: "操作失败，请稍后再试",
            MUST_CHECKFILE: "请至少选择一个文件或文件夹",
            RESTORE_SUCCESS: "还原成功",
            DEL_CONFIRM: "确认彻底删除文件（夹）？删除后，文件将无法恢复",
            DEL_SUCCESS: "删除成功",
            CLEAR_CONFIRM: "确认清空回收站？清空后，文件将无法恢复。",
            CLEAR_SUCCESS: "清空回收站成功",
            RECYCLE_NOTIFY: "回收站不占用网盘容量，保留60天后将自动删除。"
        },

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;
        },

        /**
         * 初始化数据
         */
        initData: function (data) {
            var self = this;
            var count = 0;
            var index = 0;

            self.set({ cacheData: data }, {
                silent: true
            });

            //对数据进行一次排序
            //默认按时排列
            self.sortData();

            if (data && data.length > 0) {
                var total = data.length;
                var size = self.get("pageSize");
                count = (function () {
                    var val = total % size;
                    if (val == 0) return total / size;
                    return (total - val) / size + 1;
                })();
                index = 1;
            }

            self.set({
                pageIndex: index,
                pageCount: count
            }, { silent: true });

        },

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.dirId  //文件夹ID      
         *  @param {String}  args.path   //文件夹路径信息 
         *  @param {String}  args.dirName //文件夹路径信息 
         *  @param {Number}  args.isSystem //是否系统文件夹 1:是，0：否
        **/
        setNavigation: function (args) {
            var self = this;
            var navs = [];
            var value = self.get("navs") || [];
            var hasDir = false;

            if (args) {
                //此处先查询下目前的导航信息，如果已经存在该目录
                //说明导航可能是回到上级目录，所以需要去掉当前目录的子目录
                $.each(value, function (i, n) {
                    if (n.dirId == args.dirId)
                        return false;
                    navs.push(n);
                });
                //加入当前目录
                navs.push({
                    dirId: args.dirId,
                    path: args.path,
                    dirName: args.dirName,
                    isSystem: args.isSystem || 0
                });

                //存储根目录
                if (!self.get("curRootDir")) {
                    self.set({
                        curRootDir: self.getShareObj(args.dirId)
                    }, { silent: true });
                }
            } else {
                //参数为空说明我们要回到根目录
                //所以此时相应的要清除根目录信息
                self.set({ curRootDir: null }, { silent: true });
            }

            //只有导航信息发生变化后才去重设对象值
            if (!_.isEqual(navs, value)) {
                self.set({ navs: navs });
            }
        },

        /**
         * 对数据进行排序
        */
        sortData: function () {
            var self = this;
            var compare = 0;
            var data = self.get("cacheData");

            if (!data || data.length == 0)
                return;

            var sort = self.get("sortExp");
            if (!sort)
                return;

            var params = {
                field: sort.split("-")[0],
                isAsc: sort.split("-")[1] == "asc"
            };



            //取出所有文件夹单独排序
            var dirs = $.grep(data, function (n, i) {
                return n.isDir === true;
            });

            dirs.sort(function (first, second) {
                return self.sortFunc.call(params, first, second);
            });

            //取出所有文件单独排序
            var files = $.grep(data, function (n, i) {
                return n.isDir === false;
            });
            files.sort(function (first, second) {
                return self.sortFunc.call(params, first, second);
            });

            self.set({
                cacheData: dirs.concat(files)
            }, { silent: true });
        },

        //设置列表选中项

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.data  //文件夹ID      
         *  @param {String}  args.isChecked   //文件夹路径信息 
         *  @param {Boolean}  args.silent //数据更新时是否保持沉默
        **/
        setCheckedData: function (args) {
            var self = this;
            var checks = (self.get("checkData") || []).concat();

            var items = [];
            if (args.isChecked) {
                //将选择项合并到数组中
                items = _.union(checks, args.data);
            } else {
                //从选择列表中移除指定的选择项
                items = _.difference(checks, args.data);
            }

            var silent = false;
            if (_.isBoolean(args.silent))
                silent = args.silent;

            if (!_.isEqual(checks, items)) {
                self.set({ checkData: items }, { silent: silent });
            }
        },

        /**
         * 获取已经选择的项数据
        **/
        getCheckedData: function () {
            var self = this;
            var checks = self.get("checkData") || [];
            var hash = self.get("cacheHash");

            if (!checks.length || !hash) {
                return null;
            }

            var dirs = [];
            var files = [];

            $.each(checks, function (i, n) {
                var data = hash[n];
                if (!data)
                    return true;

                if (data.isDir)
                    dirs.push(n);
                else
                    files.push(n);
            });

            return {
                checkedDirIds: dirs,
                checkedFids: files
            };
        },


        /**
         * 过滤出分页数据，并对数据做转换
        **/
        filterData: function () {
            var self = this;
            var data = self.get("cacheData");
            var index = self.get("pageIndex");
            var size = self.get("pageSize");
            var result = new Array();

            if (data && data.length > 0) {
                data = data.concat();
                var start = size * (index - 1);
                var end = size * index;
                result = data.slice(start, Math.min(end, data.length));
            }

            //对数据进行转换
            if (result && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    self.parseData(result[i]);
                }
            }
            return result;
        },

        /**
         * @virtual 转换数据以便填充数据到页面模板
         *  此方法一般需要子类去重写
         *  @param {Object}  data //要转换的数据项
        **/
        parseData: function (data) {

        },

        /**
        * @virtual 排序方法
        *  此方法一般需要子类去重写
        *  @param {Object}  first //要排序的数据
        *  @param {Object}  second //要排序的数据
        **/
        sortFunc: function (first, second) {
            return 0;
        }

    }));

})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.listTemplate";

    M139.namespace(_class, superClass.extend({

        name: _class,

        logger: new M139.Logger({ name: _class }),
        //视图数据模型
        model: null,
        //视图控制器
        master: null,
        //当前视图的父容器
        container: null,
        //排序数据
        sortData: null,

        initialize: function (args) {
            var self = this;

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;
                    self.model = new M2012.Disk.Model.Recycle({
                        master: self.master
                    });
                    self.initEvents();
                    // self.render();
                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                    }
                    $(window).resize(function () {
                        self.adjustHeight();
                    });
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过args.name来判断是不是切换到了当前视图
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.render();
                }
            });
            return superClass.prototype.initialize.apply(self, arguments);
        },

        /**
         * 初始化事件        
        **/
        initEvents: function () {
            var self = this;

            self.master.on("change:list_view_type", function () {
                self.setViewSwitchUI();
                self.fillData();
            });
            //排序方式发生变化时重新设置排序标示
            self.model.on("change:sortExp", function () {
                self.setSortUI();
                //排序数据
                self.model.sortData();
                //重新向视图填充数据
                self.fillData();
            });
            //页码发生变化时重新设置排序标示
            self.model.on("change:pageIndex", function () {
                //重新向视图填充数据
                self.fillData();
            });
            //导航信息发生变化后重新显示导航信息
            self.model.on("change:navs", function () {
                self.setNavigation();
            });

            //选择项发生变化后重新初始化选择项
            self.model.on("change:checkData", function () {
                self.setCheckedUI();
            });
        },

        /**
         * 初始页面数据  
         * @param {Boolean}  args.notip  //是否忽略加载信息提示
        **/
        initData: function (args) {
            var self = this;
            var master = self.master;
            var notip = false;

            args = args || {};
            if (_.isBoolean(args.notip))
                notip = args.notip;

            //通知UI显示数据加载中
            if (!notip)
                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.DATA_FETCHING,
                    params: { delay: 15000 }
                });

            self.model.fetch(function (data) {
                //重新获取数据后选择项需要清空
                self.model.set({ checkData: null });
                //关闭数据加载提示
                if (!notip)
                    master.trigger(master.EVENTS.TIP_HIDE);

                self.setPager();
                self.fillData();

            }, function () {
                //关闭数据加载提示     
                if (!notip)
                    master.trigger(master.EVENTS.TIP_HIDE);
                //需要重新设置下页数
                self.setPager();
                //没有数据时的显示
                self.showEmpty();

                master.trigger(master.EVENTS.TIP_SHOW, {
                    message: self.model.TIPS.FETCH_DATA_ERROR,
                    params: {
                        delay: 3000,
                        className: "msgRed"
                    }
                });
            });

        },

        adjustHeight: function () {
            var self = this;
            var container = self.getElement("divbody");
            var bodyHeight = $("body").height();
            var top = container.offset().top;          
            container.height(bodyHeight - top);

            var right = "14px";
            //出现滚动条时去掉与右边的间距
            if (container[0].scrollHeight > container[0].offsetHeight) {
                right = "0px"
            }
            container[0].style.marginRight = right;
        },

        /**
         * 设置列表页操作按钮 
         * @param {Object}  container  //内容设置区域父容器jQuery对象
        **/
        setContextMenu: function (container) {

            //  throw 'This method is not implemented: "setOptButtons"';
        },


        /**
         * 设置列表页操作按钮 
         * @param {Object}  container  //内容设置区域父容器jQuery对象
        **/
        setOptButtons: function (container) {

            //  throw 'This method is not implemented: "setOptButtons"';
        },

        /**
         * 设置分页控件
        **/
        setPager: function () {
            var self = this;
            var container = self.getElement("pager");

            //清空之前创建的分页控件
            container.empty();
            //添加分页控件
            self.pager = M2012.UI.PageTurning.create({
                container: container,
                styleTemplate: 2,
                maxPageButtonShow: 5,
                pageSize: self.model.get("pageSize") || 0,
                pageIndex: self.model.get("pageIndex") || 0,
                pageCount: self.model.get("pageCount") || 0
            }).unbind("pagechange").bind("pagechange", function (index) {
                top.BH("caiyunPageN");
                self.model.set({
                    pageIndex: index
                });
            });
        },

        /**
         * 设置导航
        **/
        setNavigation: function (container) {
            var self = this;
            var html = self._template.nav;
            var template = _.template(html);
            var data = self.model.get("navs") || [];

            if (!container) {
                container = self.getElement("navContainer");
            }
            container.html(template(data));
        },

        /**
         * 设置导航
        **/
        setViewSwitchUI: function () {
            var self = this;
            var switchEl = self.getElement("switchmode");
            var type = self.master.get("list_view_type");
            switchEl.find("i").each(function (e) {
                var cssName = this.className;
                if (cssName.indexOf("_checked") < 0)
                    cssName += "_checked";
                var mode = $(this).data("mode");
                if (type == mode)
                    cssName = this.className.replace("_checked", "");
                this.className = cssName;
            });
        },

        /**
         * 设置选中项选中状态
        **/
        setCheckedUI: function () {
            var self = this;
            var data = self.model.get("checkData");
            data = data || [];

            self.getElement("tabody").find("tr[data-id]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("id"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                }
            });
            self.getElement("listview").find("li[data-id]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("id"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                    if (ckb[0].checked) {
                        ckb.show();
                        row.addClass("listViewHover").addClass("listViewChecked");
                    } else {
                        ckb.hide();
                        row.removeClass("listViewHover").removeClass("listViewChecked");
                    }
                }
            });
        },

        /**
         * 设置表头
         * @param {Object}  container   //内容设置区域父容器jQuery对象
        **/
        setTabHeader: function (container) {

            // throw 'This method is not implemented: "setTabHeader"';
        },

        /**
         * 设置列表内容呈现
         * @param {Object}  container   //内容设置区域父容器jQuery对象
         * @param {Object}  data   //当前页视图数据
        **/
        setTabContent: function (container, data) {

            // throw 'This method is not implemented: "setTabContent"';
        },

        /**
        * 设置缩略图列表内容呈现
        * @param {Object}  container   //内容设置区域父容器jQuery对象
        * @param {Object}  data   //当前页视图数据
       **/
        setThumbContent: function (container, data) {

            // throw 'This method is not implemented: "setThumbContent"';
        },

        /**
         * 设置无内容时的信息提示
         * @param {Object}  container   //内容设置区域父容器jQuery对象
        **/
        setEmptyTips: function (container) {

            //  throw 'This method is not implemented: "setEmptyTips"';
        },

        /**
         * 设置排序菜单相关UI
        **/
        setSortMenu: function () {
            var self = this;
            //如果存在排序数据则初始化排序菜单
            if (!self.sortData)
                return;

            var data = [];
            for (var i in self.sortData) {
                data.push({
                    key: i,
                    name: self.sortData[i]
                });
            }
            var template = _.template(self._template.sort);
            self.getElement("sortMenus").html(template(data));
        },

        /**
         * 排序后重新设置表头和排序下拉菜单选中项
        **/
        setSortUI: function () {
            var self = this;
            var sort = self.model.get("sortExp");
            var aExp = sort.split("-");
            var field = aExp[0];
            var isAsc = aExp[1] == "asc";
            //设置排序菜单栏选择项            
            self.getElement("sortMenus").find("li").removeClass("cur")
                .find("em").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<em class=\"downRinking\">{0}</em>";
                        html = $T.format(html, [isAsc ? "↑" : "↓"]);
                        //设为当前选择列并追加排序标示箭头
                        me.addClass("cur").attr({
                            sort: sort
                        }).find("span").append(html);
                        return false;
                    }
                });

            //设置列表头排序选择项
            self.getElement("tabheadrow").find("th").removeAttr("cur")
                .find("i").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<i class=\"{0}\"></i>";
                        html = $T.format(html, [isAsc ? "i_th1" : "i_th0"]);
                        //设为当前选择列并追加排序标示箭头
                        me.attr({ cur: 1, sort: sort }).append(html);
                        return false;
                    }
                });
        },

        /**
         * 呈现数据
        **/
        render: function () {
            var self = this;

            if (!self.container)
                return;

            var html = $T.format(self._template.main, { cid: self.cid });
            self.container.html(html);
            //设置右键菜单
            self.setContextMenu(self.container);
            //设置页面操作按钮
            self.setOptButtons(self.getElement("options"));

            //初始化排序菜单项
            self.setSortMenu();

            //设置分页控件
            self.setPager();
            //设置列表视图切换控件
            self.setViewSwitchUI();

            //设置导航信息显示
            self.setNavigation();

            //设置表头内容
            self.setTabHeader(self.getElement("tabheadrow"));

            //设置无数据时的提示信息
            self.setEmptyTips(self.getElement("emptytips"));

            self.setSortUI();

            //初始化页面元素事件
            self.initPageEvents();

            self.adjustHeight();

            //初始化页面数据
            self.initData();
        },

        fillData: function () {
            var self = this;
            var data = self.model.filterData();

            //没有数据时的显示
            if (!data || data.length === 0) {
                self.showEmpty();
                return;
            }

            var type = self.master.get("list_view_type");
            var common = self.master.common;
            //设置列表内容
            if (type == common.LIST_VIEW_TYPE.LIST) {
                self.getElement("tabcontent").show();
                self.getElement("divheader").show();
                self.getElement("listview").hide();
                var container = self.getElement("tabody");
                self.setTabContent(container, data);
            } else if (type == common.LIST_VIEW_TYPE.THUMB) {
                var container = self.getElement("listview").show();
                self.getElement("divheader").hide();
                self.getElement("tabcontent").hide();
                self.setThumbContent(container, data);
            }
            self.adjustHeight();
            //重置选择项
            self.getElement("ckball").removeAttr("checked");
            self.setCheckedUI();
        },

        /**
         * 初始化页面元素事件
         **/
        initPageEvents: function () {
            var self = this;
            //点击切换列表视图
            self.getElement("switchmode").unbind().click(function (e) {
                if (e.target.tagName.toLowerCase() == "i") {
                    var mode = $(e.target).data("mode");
                    self.master.set({
                        list_view_type: mode
                    });
                    console.log(self.master.get("list_view_type"));
                }
            });

            //点击导航切换视图
            self.getElement("navContainer").click(function (e) {
                var el = $(e.target);
                if (el.get(0).tagName.toLowerCase() === "a") {
                    var dirId = el.data("dirid");
                    var path = el.data("path");
                    var isSystem = el.data("system");
                    var dirName = el.text();
                    var data = null;
                    if (dirId && path && name)
                        data = {
                            dirId: $T.Html.decode(dirId),
                            path: $T.Html.decode(path),
                            dirName: $T.Html.decode(dirName),
                            isSystem: isSystem
                        };
                    self.model.setNavigation(data);
                }
            });

            //排序点击相关
            var sortMenusEl = self.getElement("sortMenus");
            //页面点击后关闭排序选择面板
            $(document.body).bind("click", function () {
                sortMenusEl.addClass("hide");
            });

            //点击排序展示排序菜单
            self.getElement("btnSort").click(function (e) {
                var me = $(this);
                var offset = me.offset();
                top.BH('caiyunSort');
                M139.Event.stopEvent(e);
                sortMenusEl.removeClass("hide").css({
                    top: offset.top + me.height() + 5,
                    left: offset.left + me.outerWidth() - sortMenusEl.outerWidth()
                });
            });

            //排序触发事件
            var sortFunc = function (e) {
                var me = $(this);
                var sort = me.attr("sort");
                if (!sort)
                    return;

                if (me.hasClass("cur") || me.attr("cur")) {
                    var args = ["asc", "desc"];
                    if (sort.indexOf("desc") > -1)
                        args = args.reverse();

                    sort = String.prototype.replace.apply(sort, args);
                }
                self.model.set({ sortExp: sort });
            };
            //排序菜单点击排序
            sortMenusEl.find("li").click(sortFunc);
            //表头点击排序
            self.getElement("tabheadrow").find("th").click(sortFunc);

            //全选
            self.getElement("ckball").click(function (e) {
                var me = this;
                var ids = [];
                //查找所有id
                self.getElement("tabody").find("tr[data-id]").each(function () {
                    var row = $(this);
                    if (row.attr("system"))
                        return true;
                    ids.push($T.Html.decode(row.data("id")));
                });

                // 设置选中数据
                self.model.setCheckedData({
                    data: ids,
                    isChecked: me.checked
                });

            });
        },

        /**
         * 无数据时的显示  
        **/
        showEmpty: function () {
            var self = this;
            self.getElement("divheader").hide();
            self.getElement("divbody").hide();
            self.getElement("empty").show();
        },

        /**
         * 获取页面元素jQuery对象
         * @param {String} id  //id为{cid}_id 格式的中的id部分
        **/
        getElement: function (id) {
            var self = this;
            id = $T.format("#{cid}_{id}", {
                cid: self.cid,
                id: id
            });
            return $(id);
        },

        _template: {
            main: [
              '<div id="{cid}_container">',
                  '<div id="{cid}_sortMenus" class="menuPop menuPops shadow hide" bindautohide="1">',
                  '</div>',
                  '<div class="toolBar bgMargin border-btm">',
                      '<ul class="toolBarUl" id="{cid}_options">',
                          '<!--操作按钮-->',
                      '</ul>',
                      '<div>',                          
                           '<span class="">',
                              '<span class="viewTipPic fr mr_10 ml_10" id="{cid}_switchmode">',
                                  '<a href="javascript:void(0)" class="mr_5"><i class="i_view"  data-mode="1" ></i></a>',
                                  '<a href="javascript:void(0)"><i class="i_list"  data-mode="2"></i></a>',
                              '</span>',
                          '</span>',
                          '<div id="{cid}_pager" class="">',
                              '<!--翻页控件-->',
                          '</div>',
                      '</div>',
                      '<a href="javascript:void(0)" class="diskSortTitle pagenum" style="float: right;" id="{cid}_btnSort">',
                          '<span class="pagenumtext">排序</span>',
                      '</a>',
                  '</div>',

                  '<div class="inboxHeader bgMargin">',
                      '<span id="{cid}_navContainer">',
                          '<!--导航-->',
                      '</span>',
                  '</div>',
                   '<div  id="{cid}_empty" style="margin-top:128px;line-height:22px; display:none;">',
                      '<div id="{cid}_emptytips" class="imgInfo addr-imgInfo ta_c">',
                          '<!--无信息提示-->',
                      '</div>',
                  '</div>',
                  '<div class="diskTableList onScollTable" id="{cid}_divheader">',
                      '<table cellspacing="0"  cellpadding="0" class="listHead newShareTable" id="{cid}_tabheader">',
                          '<thead>',
                              '<tr id="{cid}_tabheadrow">',
                                  '<th class="t-check wh1" style="text-align: left; padding-left: 8px; vertical-align: middle;">',
                                      '<input type="checkbox" id="{cid}_ckball" />',
                                  '</th>',
                                  '<!--表头-->',
                              '</tr>',
                          '</thead>',
                      '</table>',
                  '</div>',
                  '<div class="appendixList p_relative" style="margin-top: 0px; overflow-y: auto; overflow-x: hidden;" id="{cid}_divbody">',
                      '<table cellspacing="0"  cellpadding="0" class="tbl-list listHead newShareTable" id="{cid}_tabcontent">',
                          '<tbody id="{cid}_tabody">',
                              '<!--表格-->',
                          '</tbody>',
                      '</table>',
                      '<div id="{cid}_listview" style="margin-top:14px"><div>',
                  '</div>',

              '</div>'
            ].join(""),

            sort: [
                '<ul>',
                    '<% _.each(obj, function(i){ %>',
                    '<li sort="<%=i.key%>-desc"><a href="javascript:void(0);"><i class="i_b_right"></i><span class="text">按<%=i.name%></span></a></li>',
                    '<% }) %>',
                 '</ul>'
            ].join(""),

            nav: [
                '<a href="javascript:;">全部文件</a>',
                '<% _.each(obj, function(i){ %>',
                '<span class="f_st">&nbsp;&gt;&nbsp;</span>',
                '<a href="javascript:;" data-path="<%=_.escape(i.path)%>" data-system="<%=i.isSystem%>" data-dirid="<%=_.escape(i.dirId)%>"><%=_.escape(i.dirName)%></a>',
                '<% }) %>'
            ].join("")
        }

    }));

})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.Main";

    M139.namespace(_class, superClass.extend({
        name: _class,
        defaults: {

        },

        logger: new M139.Logger({ name: _class }),

        master: null,

        EVENTS: {

        },

        TIPS: {

        },

        /**
         *  详细活动编辑
         *  @param {Object} args.master //视图主控
        */
        initialize: function (args) {
            var self = this;
            args = args || {};
            self.master = args.master;

            self.initEvents();
        },

        /**
         *  添加监听事件
         */
        initEvents: function () {
            var self = this;
        }

    }));

})(jQuery, _, M139);
﻿; (function ($, _, M139) {

    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.Main";

    M139.namespace(_class, superClass.extend({

        name: _class,
        //当前视图名称
        viewName: "main",

        logger: new M139.Logger({ name: _class }),
        //视图主控
        master: null,
        //视图对应数据模型
        model: null,
        //当前视图父容器
        container: null,

        initialize: function (args) {
            var self = this;

            superClass.prototype.initialize.apply(self, arguments);
            self.master = args.master;
            self.initEvents();

            //注册页面创建事件
            //视图首次创建时触发
            self.master.bind(self.master.EVENTS.VIEW_CREATED, function (args) {
                if (args.name === self.viewName) {
                    self.master.unbind(self.master.EVENTS.VIEW_CREATED, arguments.callee);
                    self.container = args.container;

                    if ($.isFunction(args.onshow)) {
                        args.onshow();
                        $(window).resize(function () {
                            self.adjustHeight();
                        });
                    }
                }
            });

            //注册视图展示时触发事件
            //每次切换视图时都会触发，所以需要通过args.name来判断是不是切换到了当前视图
            self.master.bind(self.master.EVENTS.VIEW_SHOW, function (args) {
                if (args.name === self.viewName) {
                    self.container.empty();
                    self.model = new M2012.Disk.Model.Main({
                        master: self.master
                    });
                    self.initEvents();
                    self.render();
                    // 初始化页面数据
                    self.initData();
                }
            });
        },

        initEvents: function () {

        },

        initData: function () {

        },
        render: function () {
            var self = this;
            self.master.trigger(self.master.EVENTS.NAVIGATE, {
                path: "main/recycle"
            });
        },

        adjustHeight: function () { }

    }));

    $(function () {
        var master = window.$Disk;
        new M2012.Disk.View.Main({ master: master });
        //显示主视图
        master.trigger(master.EVENTS.MAINVIEW_SHOW);
    });

})(jQuery, _, M139);
