
(function ($, _, M139) {

    var _class = "M2012.Disk.Share.Common";

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
        self.sortTypes = {// 排序类型
            FILE_NAME: 'fileName',
            UPLOAD_TIME: 'uploadTime', // 上传时间 CREATE_TIME
            FILE_SIZE: 'fileSize' // 大小
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

        self.TIPS = {
            PREVIEW_OVERSIZE: "该文件超出了在线预览支持的文件大小，请下载后查看",
            OPERATE_SUCCESS: "操作成功",
            OPERATE_ERROR: "操作失败，请稍后再试",
            SHARE_SUCCESS: "分享成功！你的好友将能看到您分享的文件！",
            SHARER_MAX: "共享人数已达到上限{0}人"
        };
    });

    M2012.Disk.Share.Common.prototype = {

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
        **/
        getFileIconClass: function (file) {

            if (file.shareObj == "dir") {
                var css = "i-f-sys";
                if (file.isSystem)
                    css = " i-f-system";
                return "i-file-smalIcion " + css;
            }
            return $T.Utils.getFileIcoClass2(0, file.shareObjName);
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
       *  获取多个共享接收人描述信息
       *  @param {Array}  args.items  //接收人号码集合    
      **/
        getShareNumbers: function (items) {
            if (!_.isArray(items) || items.length === 0)
                return [];

            var data = [];
            var self = this;

            return $.map(items, function (n) {
                var name = self.getContactName(n);
                return M139.Text.Mobile.getSendText(name, n);
            });
        },

        /**
         *  弹出分享好友窗口
         *  @param {Array}     args.shareDirIds     //要共享的文件夹id列表 
         *  @param {Array}     args.shareFileIds    //要共享的文件id列表 
         *  @param {Array}     args.recvUserNumbers //共享接收人列表 
         *  @param {Number}    args.dirType         //共享目录类型，默认是1      
         */
        showShareDialog: function (args) {

            args = args || {};
            var self = this;
            var maxCount = 20;
            var data = {
                recvUserNumbers: [],
                shareDirIds: [],
                shareFileIds: []
            };

            if (_.isArray(args.recvUserNumbers))
                data.recvUserNumbers = self.getShareNumbers(args.recvUserNumbers);

            if (_.isArray(args.shareDirIds))
                data.shareDirIds = args.shareDirIds;

            if (_.isArray(args.shareFileIds))
                data.shareFileIds = args.shareFileIds;

            if (_.isUndefined(args.dirType))
                data.dirType = args.dirType;

            //显示最大共享数(套餐升级)
            if (top.SiteConfig.comboUpgrade) {
                var info = window.parent.mainView.model.get("diskInfo");
                maxCount = info.shareNum ? info.shareNum : maxCount;               
            }
            top.M2012.UI.Dialog.AddressBook.create({
                filter: "mobile",
                dialogTitle: "分享给好友",
                showSelfAddr: false,
                maxCount: maxCount,
                items: data.recvUserNumbers
            }).on("select", function (e) {
                var selecteds = [];
                if (e && e.value && e.value.length > 0) {
                    selecteds = $.map(e.value, function (n) {
                        var mobile = M139.Text.Mobile.getMobile(n);
                        return M139.Text.Mobile.remove86(mobile);
                    });
                }

                //判断选择前后的联系人信息是否发生变化
                //如果没有变化则无需后续处理
                var hasChanged = (selecteds.length !== args.recvUserNumbers.length);
                if (!hasChanged)
                    hasChanged = _.difference(selecteds, args.recvUserNumbers).length > 0;

                if (!hasChanged)
                    return true;

                data.recvUserNumbers = (selecteds || []).concat();
                var options = {
                    success: function () {
                        top.M139.UI.TipMessage.show(self.TIPS.SHARE_SUCCESS, { delay: 3000 });
                        args.success && args.success();
                    },
                    error: function (code, msg) {
                        msg = msg || self.TIPS.OPERATE_ERROR;
                        top.$Msg.alert(msg);
                        args.error && args.error();
                    }
                };
                if (data.recvUserNumbers.length > 0) {
                    self.share($.extend(data, options));
                    return;
                }
                //没有接收人说明要取消共享
                self.cancelShare($.extend(options, {
                    dirIds: data.shareDirIds ? data.shareDirIds : [],
                    fileIds: data.shareFileIds ? data.shareFileIds : [],
                    success: function () {
                        top.M139.UI.TipMessage.show(self.TIPS.OPERATE_SUCCESS, { delay: 3000 });
                        args.success && args.success();
                    }
                }));
                return true;

            }).on("additemmax", function () {
                top.$Msg.alert($T.format(self.TIPS.SHARER_MAX, [maxCount]));
            });
        },

        /**
        *  从服务器获取数据
        *  @param {Array}     args.dirIds //选择的文件夹id列表 
        *  @param {Array}     args.fileIds //选择的文件id列表 
        *  @param {Function}  success //操作成功
        *  @param {Function}  error //操作失败
       **/
        cancelShare: function (args) {
            args = args || {};
            var self = this;
            var data = {
                dirIds: args.dirIds.join(","),
                fileIds: args.fileIds.join(",")
            };
            top.$RM.call("disk:cancelShare", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    args.success && args.success();
                    return;
                }
                var errCode = "";
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;
                args.error && args.error(errCode);

            }, function () {
                args.error && args.error();
            });
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
        },

        /**
      *  下载文件
      *  @param {Array}     args.directoryIds //选择的文件夹id列表 
      *  @param {Array}     args.fileIds   //选择的文件id列表 
      *  @param {Function}  success //操作成功
      *  @param {Function}  error //操作失败
     **/
        download: function (args) {
            var self = this;
            var data = {};
            if (_.isArray(args.directoryIds))
                data.directoryIds = args.directoryIds.join(",");

            if (_.isArray(args.fileIds))
                data.fileIds = args.fileIds.join(",");

            data.isFriendShare = args.isFriendShare || 0;
            data.path = args.path || self.sharePath;

            top.$RM.call("disk:download", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    var data = res.responseData["var"];
                    if (data && data.url)
                        args.success && args.success(data.url);
                    return;
                }
                var errCode = "";
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;

                args.error && args.error(errCode);

            }, function () {
                args.error && args.error();
            });
        },

        /**
         *  下载文件
         *  @param {Array}     args.shareDirIds    //要共享的文件夹id列表 
         *  @param {Array}     args.shareFileIds   //要共享的文件id列表 
         *  @param {Array}     args.recvUserNumbers   //共享接收人列表 
         *  @param {Number}    args.dirType       //共享目录类型，默认是1 
         *  @param {Function}  success //操作成功
         *  @param {Function}  error //操作失败
        **/
        share: function (args) {
            args = args || {};
            var self = this;
            var data = {};

            if (_.isArray(args.shareDirIds))
                data.shareDirIds = args.shareDirIds.join(",");

            if (_.isArray(args.shareFileIds))
                data.shareFileIds = args.shareFileIds.join(",");

            if (_.isArray(args.recvUserNumbers))
                data.recvUserNumbers = args.recvUserNumbers.join(",");

            top.$RM.call("disk:share", data, function (res) {
                if (res.responseData && res.responseData.code == 'S_OK') {
                    args.success && args.success();
                    return;
                }
                var errCode = "";
                var mssage = self.TIPS.OPERATE_ERROR;
                if (res.responseData && res.responseData.code)
                    errCode = res.responseData.code;
                if (res.responseData && res.responseData.summary)
                    mssage = res.responseData.summary;

                args.error && args.error(errCode, mssage);

            }, function () {
                var mssage = self.TIPS.OPERATE_ERROR;
                args.error && args.error("", mssage);
            });
        }


    };
})(jQuery, _, M139);