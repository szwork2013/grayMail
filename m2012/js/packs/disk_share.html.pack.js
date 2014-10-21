
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
﻿; (function ($, _, M139) {
    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.ShareRecive";

    M139.namespace(_class, superClass.extend({
        name: _class,
        common: null,
        defaults: {
            //当前视图页码
            pageIndex: 1,
            //页数
            pageCount: 0,
            //每页显示信息条数
            pageSize: 20,
            //访问的导航路径
            navs: null,
            //当前目录下所有共享数据
            cacheData: new Array(),
            //缓存数据索引，
            //主要用来将文件和类型对应起来
            //方便后续操作检索文件类型
            cacheIndexs: null,
            //选中的项
            checkData: new Array(),
            //当前目录的根目录
            curRootDir: null,
            //排序表达式
            sortExp: "",
            //共享人
            reciveNum: ""
        },

        EVENTS: {
            SHOW_TIPS: "share#tips:show"
        },

        TIPS: {
            FETCH_DATA_ERROR: "网络异常，请稍后重试",
            DATA_FETCHING: "数据加载中",
            OPERATE_ERROR: "操作失败，请稍后再试",
            SUBDIR_CANNOTDEL: "子目录下不能进行删除操作",
            MUST_CHECKFILE: "请至少选择一个文件或文件夹",
            DELETE_FILE: '删除操作无法恢复，您确定要删除{0}个文件吗？？', // 提示待刪除文件數量
            DELETE_DIR: '删除文件夹将同时删除其中的文件，您确定要删除{0}个文件夹吗？', // 提示待刪除文件數量
            DELETE_FILEANDDIR: '删除操作无法恢复，您确定要删除{0}个文件夹，{1}个文件吗？' // 提示待刪除文件數量
        },

        initialize: function (args) {
            var self = this;

            self.common = args.common;
            //从url中获取共享人信息
            self.set({
                reciveNum: $Url.queryString("RN") || ""
            });
        },

        /**
         * 初始化数据
         */
        initData: function (data) {
            var self = this;
            var count = 0;
            var index = 0;

            //对文件和文件夹分开处理，文件夹放到文件之上
            if (data && data.length > 0) {
                var dirs = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.DIR;
                });
                dirs.sort(function (first, second) {
                    var firFlag = self.common.isSystemFile(first) ? 1 : 0;
                    var secFlag = self.common.isSystemFile(second) ? 1 : 0;
                    return secFlag - firFlag;
                });
                var files = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.FILE;
                });
                data = dirs.concat(files);
            }

            self.set({ cacheData: data }, {
                silent: true
            });
            self.setCacheIndexs();

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

            var field = sort.split("-")[0];
            var isAsc = sort.split("-")[1] == "asc";

            var sortFunc = function (first, second) {
                switch (field) {
                    //名称                     
                    case "name":
                        compare = first.shareObjName.localeCompare(second.shareObjName);
                        break;
                        //类型
                    case "type":
                        var firExt = self.common.getFileExt(first.shareObjName);
                        var secExt = self.common.getFileExt(second.shareObjName);
                        compare = firExt.localeCompare(secExt);
                        break;
                        //时间
                    case "date":
                        compare = first.shareTime.localeCompare(second.shareTime);
                        break;
                        //大小
                    case "size":
                        var firSize = first.shareFileSize || 0;
                        var secSize = second.shareFileSize || 0;
                        compare = firSize - secSize;
                        break;
                }
                return compare * (isAsc ? 1 : -1);
            };

            //取出所有文件夹单独排序
            var dirs = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.DIR;
            });
            dirs.sort(sortFunc);

            //取出所有文件单独排序
            var files = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.FILE;
            });
            files.sort(sortFunc);

            self.set({
                cacheData: dirs.concat(files)
            }, { silent: true });
        },

        /**
         * 过滤出分页数据，并增加部分属性值
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

            //首先判断当前目录下是否是子目录，我们可以从导航信息中判断
            //子目录信息里由于没有共享人的信息
            //所以要取其父根目录的对应信息
            var shareDesc = "";
            var curRootDir = self.get("curRootDir");
            if (curRootDir) {
                shareDesc = self.getSharerName(curRootDir);
            }

            if (result && result.length > 0) {

                for (var i = 0; i < result.length; i++) {
                    var file = result[i];

                    //计算文件大小
                    file.size = "";
                    if (_.isNumber(file.shareFileSize)) {
                        file.size = self.common.getFileSizeText(file.shareFileSize);
                    }

                    file.name = file.shareObjName;
                    //是否系统文件(夹)
                    file.isSystem = self.common.isSystemFile(file) ? "1" : "";
                    file.hideClass = file.isSystem ? "hide" : "";

                    //获取文件类型图片
                    file.fileIcon = self.common.getFileIconClass(file);
                    //共享人
                    file.sharer = shareDesc ? shareDesc : self.getSharerName(file);
                }

                return result;
            }
        },

        /**
         *  获取共享人名称
         *  @param {Object}  file  //共享文件信息      
        **/
        getSharerName: function (file) {
            var self = this;

            if (!(file && file.sharer))
                return self.get("reciveNum");

            var name = self.common.getContactName(file.sharer);
            return name || file.sharer;
        },

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.dirId  //文件夹ID      
         *  @param {String}  args.path   //文件夹路径信息 
         *  @param {String}  args.dirName //文件夹路径信息 
        **/
        setNavigate: function (args) {
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

        //设置列表选中项

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.data  //文件夹ID      
         *  @param {String}  args.isChecked   //文件夹路径信息 
         *  @param {Boolean}  args.silent //数据更新时是否保持沉默
        **/
        setCheckedData: function (args) {
            var self = this;
            var checkeds = (self.get("checkData") || []).concat();

            var items = [];
            if (args.isChecked) {
                //将选择项合并到数组中
                items = _.union(checkeds, args.data);
            } else {
                //从选择列表中移除指定的选择项
                items = _.difference(checkeds, args.data);
            }

            var silent = false;
            if (_.isBoolean(args.silent))
                silent = args.silent;

            if (!_.isEqual(checkeds, items)) {
                self.set({ checkData: items }, { silent: silent });
            }

        },

        /**
         *  根据文件Id从数据列表中查找对应的文件信息
         *  @param {String}  id //共享信息内容ID 
        **/
        getShareObj: function (id) {
            var self = this;
            var data = self.get("cacheData");

            if (!data)
                return null;

            var objs = $.grep(data, function (n, i) {
                return n.shareObjId == id;
            });

            if (objs && objs.length > 0)
                return objs[0];
            return null;
        },

        /**
         *  获取选择的文件（夹）信息
        **/
        getCheckedFiles: function () {
            var self = this;
            var checks = self.get("checkData") || [];
            var indexs = self.get("cacheIndexs");

            if (checks.length == 0 || indexs.length == 0)
                return null;

            checks = checks.concat();

            var dirs = [];
            var files = [];

            $.each(checks, function (i, n) {
                var type = indexs[n];
                if (type == self.common.shareObjTypes.DIR)
                    dirs.push(n);
                else if (type == self.common.shareObjTypes.FILE)
                    files.push(n);
            });

            return {
                checkedDirIds: dirs,
                checkedFids: files
            };

        },

        /**
         * 获取拷贝到彩云的所有文件（夹）路径信息
        **/
        getCopyToFiles: function () {

            var self = this;
            var checks = self.getCheckedFiles();

            if (!checks) {
                return null;
            }

            var data = {};
            //获取所有已选择的文件夹路径
            if (checks.checkedDirIds.length > 0) {
                data.catalogInfos = [];
                $.each(checks.checkedDirIds, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.catalogInfos.push(obj.path);
                    }
                });
            }
            //获取所有已选择的文件路径
            if (checks.checkedFids.length > 0) {
                data.contentInfos = [];
                $.each(checks.checkedFids, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.contentInfos.push(obj.path);
                    }
                });
            }
            return data;
        },

        /**
         *  缓存数据索引，
         *  主要用来将文件和类型对应起来
         *  方便后续操作检索文件类型
        **/
        setCacheIndexs: function () {
            var self = this;
            var data = self.get("cacheData") || [];
            var indexs = null;

            if (data.length > 0) {
                indexs = {};
                $.each(data, function (i, n) {
                    if (n.shareObjId && n.shareObj) {
                        indexs[n.shareObjId] = n.shareObj;
                    }
                });
            }

            self.set({ cacheIndexs: indexs }, { silent: true });

        },

        /**
         *  从服务器获取数据
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var result = null;
            var options = {};
            //从导航信息中获取查询条件
            var navs = self.get("navs") || [];

            if (navs.length > 0) {
                var nav = navs[navs.length - 1];
                $.extend(options, {
                    directoryId: nav.dirId,
                    path: nav.path
                });
            }

            top.$RM.call("disk:friendShareList", options, function (res) {
                if (res && res.responseData && res.responseData.code == "S_OK") {
                    var data = res.responseData["var"];
                    if (data && data.shareList)
                        res = data.shareList;

                    self.initData(res);
                    fnSuccess && fnSuccess(res);
                    return;
                }

                self.initData(null);
                fnError && fnError();

            }, function (e) {
                self.initData(null);
                fnError && fnError();

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
            args = args || {};
            var self = this;
            var data = {
                directoryIds: args.directoryIds.join(","),
                fileIds: args.fileIds.join(","),
                isFriendShare: 1
            };
            data.path = self.getCurDirPath();
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
         * 获取当前文件夹的路径
         */
        getCurDirPath: function () {
            var self = this;
            var navs = self.get("navs");
            var deep = navs ? navs.length : 0;

            //此时是根目录
            if (deep == 0)
                return "";
            //获取当前路径对应文件夹信息
            var dir = navs[deep - 1];
            //当前目录为系统文件夹目录并是第一级时
            //文件夹的路径要特殊处理
            if (dir.isSystem && deep == 1)
                return self.common.sharePath;

            return dir.path;
        },

        /**
         *  从服务器获取数据
         *  @param {Array}     args.checkedDirIds //选择的文件夹id列表 
         *  @param {Array}     args.checkedFids //选择的文件id列表 
         *  @param {Function}  success //操作成功
         *  @param {Function}  error //操作失败
        **/
        delFiles: function (args) {
            args = args || {};
            var self = this;
            var data = {
                dirIds: args.checkedDirIds.join(","),
                fileIds: args.checkedFids.join(",")
            };
            top.$RM.call("disk:delShare", data, function (res) {
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

        }

    }));

})(jQuery, _, M139);

﻿
; (function ($, _, M139) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.ShareRecive";

    M139.namespace(_class, superClass.extend({
        name: _class,

        model: null,

        common: null,

        initialize: function () {
            var self = this;

            self.common = new M2012.Disk.Share.Common();
            self.model = new M2012.Disk.Model.ShareRecive({
                common: self.common
            });

            $(window).resize(function () {
                self.adjustHeight();
            });

            //绑定事件监听
            self.initEvents();
            //呈现视图
            self.render();

            superClass.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;

            self.model.on("change", function () {

                //监测文件夹访问路径，实时改变导航信息
                if (self.model.hasChanged("navs")) {

                    self.setNavigate();
                    self.render();
                }
                    // 监控选择项的变化
                else if (self.model.hasChanged("checkData")) {

                    self.setCheckedUI();
                }
                    //监控排序字段的变化
                else if (self.model.hasChanged("sortExp")) {
                    self.setSortting();
                    //排序数据
                    self.model.sortData();
                    //重新向视图填充数据
                    self.fillData();
                }
                    //监听页码变化实现数据翻页加载
                else if (self.model.hasChanged("pageIndex")) {
                    self.fillData();
                }
            });


            //监控操作提示信息
            self.model.on(self.model.EVENTS.SHOW_TIPS, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

            //设置排序相关UI点击
            self.setSortUI();

            //下载
            $("#btnDown").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.download();
            });

            //存彩云
            $("#btnCopy").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.copyToDisk();

            });

            //删除
            $("#btnDelete").click(function (e) {
                var me = $(this);

                if (self.common.isLocked(me))
                    return;

                self.delFiles();
            });

            //点击导航切换视图
            $("#navContainer").click(function (e) {
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
                    self.model.setNavigate(data);
                }
            });

            //全选
            $("#cbSelectAll").click(function (e) {
                var me = this;
                var ids = [];
                //查找所有id
                $("#tblist").find("tr[data-shareid]").each(function () {
                    var row = $(this);
                    if (row.attr("system"))
                        return true;
                    ids.push($T.Html.decode(row.data("shareid")));
                });

                // 设置选中数据
                self.model.setCheckedData({
                    data: ids,
                    isChecked: me.checked
                });

            });

            //列表行点击事件
            $("#tblist").click(function (e) {
                //点击文件图标
                var el = $(e.target);
                var rowEl = el.closest("tr");
                var shareId = rowEl.data("shareid");
                shareId = shareId ? $T.Html.decode(shareId) : "";

                if (!shareId)
                    return;

                if (el.attr("sharetype")) {

                    //锁定元素防止短时间内重复点击
                    if (self.common.isLocked(el))
                        return;

                    var obj = self.model.getShareObj(shareId);
                    if (!obj)
                        return;

                    switch (el.attr("sharetype")) {
                        //文件夹
                        case self.common.shareObjTypes.DIR:
                            var isSystem = rowEl.attr("system");
                            self.model.setNavigate({
                                dirId: shareId,
                                path: obj.path,
                                isSystem: isSystem,
                                dirName: obj.shareObjName
                            });
                            break;
                            //文件
                        case self.common.shareObjTypes.FILE:
                            var file = {
                                thumbnailURL: obj.thumbnailUrl || "",
                                bigthumbnailURL: obj.bigThumbnailUrl || "",
                                presentURL: obj.presentURL || obj.presentLURL || obj.presentHURL,
                                name: obj.shareObjName,
                                id: obj.shareObjId,
                                size: obj.shareFileSize || 0,
                                path: self.model.getCurDirPath()
                            };
                            self.common.previewFile(file);
                            break;
                    }
                    return;
                }

                //如果点击了checkbox
                if (el.attr("type") === "checkbox") {
                    self.model.setCheckedData({
                        data: [shareId],
                        isChecked: el.get(0).checked,
                        silent: true
                    });
                }

            });
        },

        /**
         * 设置排序相关UI操作
        **/
        setSortUI: function () {
            var self = this;
            var sortMenus = $("#sortMenus");

            //页面点击后关闭排序选择面板
            $(document.body).bind("click", function () {
                sortMenus.addClass("hide");
            });

            //点击排序展示排序菜单
            $("#btnSort").click(function (e) {
                var me = $(this);
                var offset = me.offset();
                top.BH('caiyunSort');
                M139.Event.stopEvent(e);
                sortMenus.removeClass("hide").css({
                    top: offset.top + me.height() + 5,
                    left: offset.left + me.outerWidth() - sortMenus.outerWidth()
                });

            });

            //排序菜单
            sortMenus.find("li").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (me.hasClass("cur")) {
                    if (sort.indexOf("asc") > -1) {
                        sort = sort.replace("asc", "desc");
                    }
                    else {
                        sort = sort.replace("desc", "asc");
                    }
                }

                self.model.set({ sortExp: sort });
            });

            //表头点击排序
            $("#tbl_th").find("th").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (!sort)
                    return;

                if (me.attr("cur")) {
                    if (sort.indexOf("asc") > -1)
                        sort = sort.replace("asc", "desc");
                    else
                        sort = sort.replace("desc", "asc");
                }

                self.model.set({ sortExp: sort });
            });
        },

        /**
         * 设置排序箭头
       **/
        setSortting: function () {
            var self = this;
            var sort = self.model.get("sortExp");
            var spliter = sort.split("-");
            var field = spliter[0];
            var isAsc = spliter[1] == "asc";

            //设置排序菜单栏选择项
            $("#sortMenus").find("li").removeClass("cur")
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

            $("#tbl_th").find("th").removeAttr("cur")
                .find("span.t-arrow").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<span class=\"t-arrow\">{0}</span>";
                        html = $T.format(html, [isAsc ? "↑" : "↓"]);
                        //设为当前选择列并追加排序标示箭头
                        me.attr({
                            cur: 1,
                            sort: sort
                        }).append(html);
                        return false;
                    }
                });
        },

        /**
         * 设置选中项选中状态
        **/
        setCheckedUI: function () {
            var self = this;
            var data = self.model.get("checkData");
            data = data || [];

            $("#tblist").find("tr[data-shareid]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("shareid"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                }

            });

        },

        /**
        * 初始化分页控件值
       **/
        setPager: function () {
            var self = this;
            var container = $("#dv_pager");

            //清空之前创建的分页控件
            container.empty();

            //添加分页控件
            self.pager = M2012.UI.PageTurning.create({
                container: container,
                styleTemplate: 2,
                maxPageButtonShow: 5,
                pageSize: self.model.get("pageSize"),
                pageIndex: self.model.get("pageIndex"),
                pageCount: self.model.get("pageCount")
            }).unbind("pagechange").bind("pagechange", function (index) {
                top.BH("caiyunPageN");
                self.model.set({
                    pageIndex: index
                });
            });

        },

        /**
         * 设置导航路径信息
         */
        setNavigate: function () {
            var self = this;
            var html = $("#tplNavigation").html();
            var template = _.template(html);
            var data = self.model.get("navs");
            $("#navContainer").html(template(data));
        },

        /**
         * 页面高度自适应
         */
        adjustHeight: function () {
            var self = this;
            var container = $("#tbl_body");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = 'auto';
            container.height(bodyHeight - top);
        },

        /**
      * 呈现视图
      */
        render: function () {
            var self = this;

            //清空列表
            $("#tbl_th").removeClass("hide");
            $("#tbl_body").removeClass("hide");
            $("#dv_nofile").addClass("hide");
            $("#tblist").empty();

            //设置页面导航信息
            self.setNavigate();

            self.adjustHeight();

            //还原选中项的默认状态
            $("#cbSelectAll").removeAttr("checked");
            self.model.set({ checkData: [] }, { silent: true });

            //通知UI显示数据加载中
            self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                message: self.model.TIPS.DATA_FETCHING,
                params: { delay: 15000 }
            });

            self.model.fetch(function (data) {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);

                //没有数据时的显示
                if (!data || data.length === 0)
                    self.showNothing();

                self.setPager();
                self.fillData();

            }, function () {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);
                //没有数据时的显示
                self.showNothing();

                self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                    message: self.model.TIPS.FETCH_DATA_ERROR,
                    params: {
                        delay: 3000,
                        className: "msgRed"
                    }
                });
            });
        },

        /**
        * 设置导航路径信息
        */
        fillData: function () {
            var self = this;
            var data = self.model.filterData();
            var container = $("#tblist").empty();

            if (data && data.length > 0) {
                var html = $("#tplShareList").html();
                var template = _.template(html);
                container.html(template(data));

                //还原选中项状态
                $("#cbSelectAll").removeAttr("checked");
                self.setCheckedUI();
            }
        },

        /**
         * 下载
        **/
        download: function () {

            var self = this;
            var data = self.model.getCheckedFiles();

            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            top.BH("diskv2_download_package");

            self.common.download({
                directoryIds: data.checkedDirIds,
                fileIds: data.checkedFids,
                isFriendShare: 1,
                path: self.model.getCurDirPath(),
                success: function (url) {
                    $("#downloadFrame", window.parent.document).attr('src', url);
                },
                error: function () {
                    var tip = self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(tip, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
            });
        },

        /**
         * 存彩云网盘
        **/
        copyToDisk: function () {
            var self = this;
            var contents = self.model.getCopyToFiles();

            if (!contents) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            new top.M2012.UI.Dialog.SaveToDisk({
                data: contents,
                type: 'shareCopy'
            }).render();
        },

        /**
         * 删除文件
         */
        delFiles: function () {
            var self = this;
            var data = self.model.getCheckedFiles();

            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            //判断是否子目录，子目录下不允许删除
            var navs = self.model.get("navs");
            if (navs && navs.length > 0) {
                var mssage = self.model.TIPS.SUBDIR_CANNOTDEL;
                self.common.showTips(mssage);
                return;
            }

            var fileCount = data.checkedFids.length;
            var dirCount = data.checkedDirIds.length;

            //获取确认提示语
            var message = "";
            var TIPS = self.model.TIPS;
            if (fileCount > 0 && dirCount > 0) {
                message = $T.format(TIPS.DELETE_FILEANDDIR, [dirCount, fileCount]);

            } else if (fileCount > 0) {
                message = $T.format(TIPS.DELETE_FILE, [fileCount]);

            } else if (dirCount > 0) {
                message = $T.format(TIPS.DELETE_DIR, [dirCount]);
            }

            top.$Msg.confirm(message, function () {
                self.model.delFiles({
                    checkedDirIds: data.checkedDirIds,
                    checkedFids: data.checkedFids,
                    success: function () {
                        self.render();
                    },
                    error: function () {
                        var tip = self.model.TIPS.OPERATE_ERROR;
                        top.M139.UI.TipMessage.show(tip, {
                            delay: 3000,
                            className: "msgRed"
                        });
                    }
                });

            }, function () {

            }, {
                buttons: ["是", "否"]
            });

        },

        /**
         * 没有信息时的展示
         */
        showNothing: function () {

            $("#dv_nofile").removeClass("hide");
            $("#tbl_th").addClass("hide");
            $("#tbl_body").addClass("hide");
        }

    }));


})(jQuery, _, M139);

﻿; (function ($, _, M139) {
    var superClass = M139.Model.ModelBase;
    var _class = "M2012.Disk.Model.ShareTo";

    M139.namespace(_class, superClass.extend({
        name: _class,
        common: null,
        defaults: {
            //当前视图页码
            pageIndex: 1,
            //页数
            pageCount: 0,
            //每页显示信息条数
            pageSize: 20,
            //访问的导航路径
            navs: null,
            //当前目录下所有共享数据
            cacheData: new Array(),
            //缓存数据索引，
            //主要用来将文件和类型对应起来
            //方便后续操作检索文件类型
            cacheIndexs: null,
            //选中的项
            checkData: new Array(),
            //当前目录的根目录
            curRootDir: null,

            //排序表达式
            sortExp: "",
            //共享给
            shareNum: ""
        },

        EVENTS: {
            SHOW_TIPS: "share#tips:show"
        },

        TIPS: {
            FETCH_DATA_ERROR: "网络异常，请稍后重试",
            DATA_FETCHING: "数据加载中",
            OPERATE_ERROR: "操作失败，请稍后再试",
            MUST_CHECKFILE: "请至少选择一个文件或文件夹",
            DELETE_FILE: '删除操作无法恢复，您确定要删除{0}个文件吗？？', // 提示待刪除文件數量
            DELETE_DIR: '删除文件夹将同时删除其中的文件，您确定要删除{0}个文件夹吗？', // 提示待刪除文件數量
            DELETE_FILEANDDIR: '删除操作无法恢复，您确定要删除{0}个文件夹，{1}个文件吗？', // 提示待刪除文件數量
            CANCEL_SHAREFILE: "确定要取消分享吗？取消后好友将无法下载该文件(夹)。",
            CANCEL_SHAREFILES: "确定要取消分享吗？取消后好友将无法下载这些文件(夹)。",
            SHARE_SUCCESS: "分享成功！你的好友将能看到您分享的文件！",
            SHARE_DESC: "{0}等{1}人",
            SHARER_MAX: "共享人数已达到上限{0}人",
            SUBDIR_CANNOTDEL: "子目录下不能进行取消分享操作"
        },

        initialize: function (args) {
            var self = this;

            self.common = args.common;
            //从url中获取共享人信息
            self.set({
                reciveNum: $Url.queryString("SN") || ""
            });
        },

        /**
         * 初始化数据
         */
        initData: function (data) {
            var self = this;
            var count = 0;
            var index = 0;

            //对文件和文件夹分开处理，文件夹放到文件之上
            if (data && data.length > 0) {
                var dirs = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.DIR;
                });
                dirs.sort(function (first, second) {
                    var firFlag = self.common.isSystemFile(first) ? 1 : 0;
                    var secFlag = self.common.isSystemFile(second) ? 1 : 0;
                    return firFlag - secFlag;
                });
                var files = $.grep(data, function (n, i) {
                    return n.shareObj == self.common.shareObjTypes.FILE;
                });
                data = dirs.concat(files);
            }


            self.set({ cacheData: data }, {
                silent: true
            });
            self.setCacheIndexs();



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
         * 对数据进行排序
        */
        sortData: function () {
            var self = this;
            var compare = 0;
            var data = self.get("cacheData");

            if (!(data && data.length > 0))
                return;

            var sort = self.get("sortExp");
            if (!sort)
                return;

            var field = sort.split("-")[0];
            var isAsc = sort.split("-")[1] == "asc";

            var sortFunc = function (first, second) {
                switch (field) {
                    //名称                     
                    case "name":
                        compare = first.shareObjName.localeCompare(second.shareObjName);
                        break;
                        //类型
                    case "type":
                        var firExt = self.common.getFileExt(first.shareObjName);
                        var secExt = self.common.getFileExt(second.shareObjName);
                        compare = firExt.localeCompare(secExt);
                        break;
                        //时间
                    case "date":
                        compare = first.shareTime.localeCompare(second.shareTime);
                        break;
                        //大小
                    case "size":
                        var firSize = first.shareFileSize || 0;
                        var secSize = second.shareFileSize || 0;
                        compare = firSize - secSize;
                        break;
                }
                return compare * (isAsc ? 1 : -1);
            };

            //取出所有文件夹单独排序
            var dirs = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.DIR;
            });
            dirs.sort(sortFunc);

            //取出所有文件单独排序
            var files = $.grep(data, function (n, i) {
                return n.shareObj == self.common.shareObjTypes.FILE;
            });
            files.sort(sortFunc);

            self.set({
                cacheData: dirs.concat(files)
            }, { silent: true });
        },

        /**
         * 过滤出分页数据，并增加部分属性值
        **/
        filterData: function () {
            var self = this;
            var data = self.get("cacheData");
            var index = self.get("pageIndex");
            var size = self.get("pageSize");
            var result = new Array();

            //获取分页数据
            if (data && data.length > 0) {
                var start = size * (index - 1);
                var end = size * index;
                result = data.slice(start, Math.min(end, data.length));
            }

            //首先判断当前目录下是否是子目录，我们可以从导航信息中判断
            //子目录信息里由于没有共享接收人的信息
            //所以要取其父根目录的对应信息
            var shareDesc = "";
            var curRootDir = self.get("curRootDir");
            if (curRootDir) {
                shareDesc = self.getShareFileDesc(curRootDir);
            }

            if (result && result.length > 0) {

                for (var i = 0; i < result.length; i++) {
                    var file = result[i];

                    //计算文件大小
                    file.size = "";
                    if (file.shareObj == self.common.shareObjTypes.FILE) {
                        file.size = self.common.getFileSizeText(file.shareFileSize);
                    }

                    file.name = file.shareObjName;
                    //是否系统文件(夹)
                    file.isSystem = self.common.isSystemFile(file) ? "1" : "";
                    file.hideClass = file.isSystem ? "hide" : "";

                    //获取文件类型图片
                    file.fileIcon = self.common.getFileIconClass(file);
                    //共享给
                    file.shareTo = shareDesc ? shareDesc : self.getShareFileDesc(file);
                    //是否可以编辑共享人标示，只有根目录下的文件和文件夹才允许编辑共享人
                    file.isCanEdit = shareDesc ? false : true;
                }

                return result;
            }
        },

        /**
         *  获取指定文件的共享接收人描述信息
         *  @param {Object}  args.file  //文件夹ID      
        **/
        getShareFileDesc: function (file) {
            var self = this;
            if (!(file && file.shareeList &&
                file.shareeList.length > 0))
                return self.get("shareNum");

            var share = file.shareeList[0];
            var name = self.common.getContactName(share);
            if (file.shareeList.length > 1) {
                var formats = [name, file.shareeList.length];
                return $T.format(self.TIPS.SHARE_DESC, formats);
            }
            return name;
        },

        /**
         *  获取多个共享接收人描述信息
         *  @param {Array}  args.items  //接收人号码集合    
        **/
        getSharesDesc: function (items) {
            if (!_.isArray(items) || items.length === 0)
                return [];

            var data = [];
            var self = this;

            return $.map(items, function (n) {
                var name = self.common.getContactName(n);
                return M139.Text.Mobile.getSendText(name, n);
            });
        },

        /**
         *  将当要访问的文件夹信息存贮在访问导航列表中
         *  @param {String}  args.dirId  //文件夹ID      
         *  @param {String}  args.path   //文件夹路径信息 
         *  @param {String}  args.dirName //文件夹路径信息 
        **/
        setNavigate: function (args) {
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
                    dirName: args.dirName
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

        //设置列表选中项

        /**
         *  设置选择项信息
         *  @param {String}  args.data  //文件夹ID      
         *  @param {String}  args.isChecked   //是否选中
         *  @param {Boolean}  args.silent //数据更新时是否保持沉默
        **/
        setCheckedData: function (args) {
            var self = this;
            var checkeds = (self.get("checkData") || []).concat();

            var items = [];
            if (args.isChecked) {
                //将选择项合并到数组中
                items = _.union(checkeds, args.data);
            } else {
                //从选择列表中移除指定的选择项
                items = _.difference(checkeds, args.data);
            }

            var silent = false;
            if (_.isBoolean(args.silent))
                silent = args.silent;

            if (!_.isEqual(checkeds, items)) {
                self.set({ checkData: items }, { silent: silent });
            }

        },

        /**
         *  根据文件Id从数据列表中查找对应的文件信息
         *  @param {String}  id //共享信息内容ID 
        **/
        getShareObj: function (id) {
            var self = this;
            var objs = $.grep(self.get("cacheData"), function (n, i) {
                return n.shareObjId == id;
            });

            if (objs && objs.length > 0)
                return objs[0];
            return null;
        },

        /**
         *  获取选择的文件（夹）信息
        **/
        getCheckedFiles: function () {
            var self = this;
            var checks = self.get("checkData") || [];
            var indexs = self.get("cacheIndexs");

            if (checks.length == 0 || indexs.length == 0)
                return null;

            checks = checks.concat();

            var dirs = [];
            var files = [];

            $.each(checks, function (i, n) {
                var type = indexs[n];
                if (type == self.common.shareObjTypes.DIR)
                    dirs.push(n);
                else if (type == self.common.shareObjTypes.FILE)
                    files.push(n);
            });

            return {
                checkedDirIds: dirs,
                checkedFids: files
            };

        },

        /**
         * 获取取消共享的所有文件（夹）路径信息
        **/
        getCheckedData: function () {

            var self = this;
            var checks = self.getCheckedFiles();

            if (!checks) {
                return null;
            }

            var data = {};
            //获取所有已选择的文件夹路径
            if (checks.checkedDirIds.length > 0) {
                data.catalogInfos = [];
                $.each(checks.checkedDirIds, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.catalogInfos.push(obj.path);
                    }
                });
            }
            //获取所有已选择的文件路径
            if (checks.checkedFids.length > 0) {
                data.contentInfos = [];
                $.each(checks.checkedFids, function (i, n) {
                    var obj = self.getShareObj(n);
                    if (obj && obj.path) {
                        data.contentInfos.push(obj.path);
                    }
                });
            }
            return data;
        },

        /**
      * 获取当前文件夹的路径
      */
        getCurDirPath: function () {
            var self = this;
            var navs = self.get("navs");
            var path = "";
            if (navs && navs.length > 0) {
                path = navs[navs.length - 1].path;
            }
            return path;
        },

        /**
         *  缓存数据索引，
         *  主要用来将文件和类型对应起来
         *  方便后续操作检索文件类型
        **/
        setCacheIndexs: function () {
            var self = this;
            var data = self.get("cacheData") || [];
            var indexs = null;

            if (data.length > 0) {
                indexs = {};
                $.each(data, function (i, n) {
                    if (n.shareObjId && n.shareObj) {
                        indexs[n.shareObjId] = n.shareObj;
                    }
                });
            }

            self.set({ cacheIndexs: indexs }, { silent: true });

        },

        /**
         *  从服务器获取数据
         *  @param {Function}  fnSuccess //数据访问成功后的处理函数   
         *  @param {Function}  fnError   //数据访问失败后的处理函数   
        **/
        fetch: function (fnSuccess, fnError) {
            var self = this;
            var result = null;
            var options = {};
            //从导航信息中获取查询条件
            var navs = self.get("navs") || [];

            if (navs.length > 0) {
                var nav = navs[navs.length - 1];
                $.extend(options, {
                    directoryId: nav.dirId,
                    path: nav.path
                });
            }

            top.$RM.call("disk:myShareList", options, function (res) {
                if (res && res.responseData && res.responseData.code == "S_OK") {
                    var data = res.responseData["var"];
                    if (data && data.shareList)
                        res = data.shareList;

                    self.initData(res);
                    fnSuccess && fnSuccess(res);
                    return;
                }

                self.initData(null);
                fnError && fnError();

            }, function (e) {
                self.initData(null);
                fnError && fnError();

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

        }

    }));

})(jQuery, _, M139);

﻿
; (function ($, _, M139) {
    var superClass = M139.View.ViewBase;
    var _class = "M2012.Disk.View.ShareTo";

    M139.namespace(_class, superClass.extend({
        name: _class,

        model: null,

        common: null,

        initialize: function () {
            var self = this;

            self.common = new M2012.Disk.Share.Common();
            self.model = new M2012.Disk.Model.ShareTo({
                common: self.common
            });

            $(window).resize(function () {
                self.adjustHeight();
            });

            //绑定事件监听
            self.initEvents();
            //呈现视图
            self.render();

            superClass.prototype.initialize.apply(self, arguments);
        },

        initEvents: function () {
            var self = this;

            self.model.on("change", function () {

                //监测文件夹访问路径，实时改变导航信息
                if (self.model.hasChanged("navs")) {
                    self.render();
                }
                    // 监控选择项的变化
                else if (self.model.hasChanged("checkData")) {

                    self.setCheckedUI();
                }
                    //监控排序字段的变化
                else if (self.model.hasChanged("sortExp")) {
                    self.setSortting();
                    //排序数据
                    self.model.sortData();
                    //重新向视图填充数据
                    self.fillData();
                }
                    //监听页码变化实现数据翻页加载
                else if (self.model.hasChanged("pageIndex")) {
                    self.fillData();
                }
            });


            //监控操作提示信息
            self.model.on(self.model.EVENTS.SHOW_TIPS, function (args) {
                if (!args) {
                    top.M139.UI.TipMessage.hide();
                    return;
                }
                var params = args.params || {};
                top.M139.UI.TipMessage.show(args.message, params);
            });

            //设置排序相关UI点击
            self.setSortUI();

            //下载
            $("#btnDown").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.download();
            });

            //取消分享
            $("#btnCancel").click(function (e) {
                var me = $(this);
                if (self.common.isLocked(me))
                    return;

                self.cancelShare();

            });

            //点击导航切换视图
            $("#navContainer").click(function (e) {
                var el = $(e.target);
                if (el.get(0).tagName.toLowerCase() === "a") {
                    var dirId = el.data("dirid");
                    var path = el.data("path");
                    var dirName = el.text();
                    var data = null;
                    if (dirId && path && name)
                        data = {
                            dirId: $T.Html.decode(dirId),
                            path: $T.Html.decode(path),
                            dirName: $T.Html.decode(dirName)
                        };
                    self.model.setNavigate(data);
                }
            });

            //全选
            $("#cbSelectAll").click(function (e) {
                var me = this;
                var ids = [];
                //查找所有id
                $("#tblist").find("tr[data-shareid]").each(function () {
                    var row = $(this);
                    if (row.attr("system"))
                        return true;
                    ids.push($T.Html.decode(row.data("shareid")));
                });

                // 设置选中数据
                self.model.setCheckedData({
                    data: ids,
                    isChecked: me.checked
                });

            });

            //列表行点击事件
            $("#tblist").click(function (e) {
                //点击文件图标
                var el = $(e.target);
                var rowEl = el.closest("tr");
                var shareId = rowEl.data("shareid");
                shareId = shareId ? $T.Html.decode(shareId) : "";

                if (!shareId)
                    return;

                if (el.attr("sharetype")) {

                    //锁定元素防止短时间内重复点击
                    if (self.common.isLocked(el))
                        return;

                    var obj = self.model.getShareObj(shareId);
                    if (!obj)
                        return;

                    switch (el.attr("sharetype")) {
                        //文件夹
                        case self.common.shareObjTypes.DIR:
                            self.model.setNavigate({
                                dirId: shareId,
                                path: obj.path,
                                dirName: obj.shareObjName
                            });
                            break;
                            //文件
                        case self.common.shareObjTypes.FILE:
                            var file = {
                                thumbnailURL: obj.thumbnailUrl || "",
                                bigthumbnailURL: obj.bigThumbnailUrl || "",
                                presentURL: obj.presentURL || "",
                                name: obj.shareObjName,
                                id: obj.shareObjId,
                                size: obj.shareFileSize || 0,
                                path: self.model.getCurDirPath()
                            };
                            self.common.previewFile(file);
                            break;
                    }
                    return;
                }

                //如果点击了checkbox
                if (el.attr("type") === "checkbox") {
                    self.model.setCheckedData({
                        data: [shareId],
                        isChecked: el.get(0).checked,
                        silent: true
                    });

                    return;
                }
                //编辑共享接收人
                if (el.attr("iscanedit") === "true") {
                    self.shareEdit(shareId);
                    return;
                }

            });
        },

        /**
         * 设置排序相关UI操作
        **/
        setSortUI: function () {
            var self = this;
            var sortMenus = $("#sortMenus");

            //页面点击后关闭排序选择面板
            $(document.body).bind("click", function () {
                sortMenus.addClass("hide");
            });

            //点击排序展示排序菜单
            $("#btnSort").click(function (e) {
                var me = $(this);
                var offset = me.offset();
                top.BH('caiyunSort');
                M139.Event.stopEvent(e);
                sortMenus.removeClass("hide").css({
                    top: offset.top + me.height() + 5,
                    left: offset.left + me.outerWidth() - sortMenus.outerWidth()
                });

            });

            //排序菜单
            sortMenus.find("li").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (me.hasClass("cur")) {
                    if (sort.indexOf("asc") > -1)
                        sort = sort.replace("asc", "desc");
                    else
                        sort = sort.replace("desc", "asc");
                }

                self.model.set({ sortExp: sort });
            });

            //表头点击排序
            $("#tbl_th").find("th").click(function (e) {
                var me = $(this);
                var sort = me.attr("sort");

                if (!sort)
                    return;

                if (me.attr("cur")) {
                    if (sort.indexOf("asc") > -1)
                        sort = sort.replace("asc", "desc");
                    else
                        sort = sort.replace("desc", "asc");
                }

                self.model.set({ sortExp: sort });
            });
        },

        /**
         * 设置排序箭头
       **/
        setSortting: function () {
            var self = this;
            var sort = self.model.get("sortExp");
            var spliter = sort.split("-");
            var field = spliter[0];
            var isAsc = spliter[1] == "asc";

            //设置排序菜单栏选择项
            $("#sortMenus").find("li").removeClass("cur")
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

            $("#tbl_th").find("th").removeAttr("cur")
                .find("span.t-arrow").remove().end().each(function () {
                    var me = $(this);
                    var cursort = me.attr("sort");
                    if (cursort && cursort.indexOf(field) > -1) {
                        var html = "<span class=\"t-arrow\">{0}</span>";
                        html = $T.format(html, [isAsc ? "↑" : "↓"]);
                        //设为当前选择列并追加排序标示箭头
                        me.attr({
                            cur: 1,
                            sort: sort
                        }).append(html);
                        return false;
                    }
                });
        },

        /**
         * 设置选中项选中状态
        **/
        setCheckedUI: function () {
            var self = this;
            var data = self.model.get("checkData");
            data = data || [];

            $("#tblist").find("tr[data-shareid]").each(function () {
                var row = $(this);
                if (row.attr("system"))
                    return true;

                var id = $T.Html.decode(row.data("shareid"));
                var ckb = row.find("input[type='checkbox']");
                if (ckb && ckb.length > 0) {
                    ckb[0].checked = _.contains(data, id);
                }

            });

        },

        /**
        * 初始化分页控件值
       **/
        setPager: function () {
            var self = this;
            var container = $("#dv_pager");

            //清空之前创建的分页控件
            container.empty();

            //添加分页控件
            self.pager = M2012.UI.PageTurning.create({
                container: container,
                styleTemplate: 2,
                maxPageButtonShow: 5,
                pageSize: self.model.get("pageSize"),
                pageIndex: self.model.get("pageIndex"),
                pageCount: self.model.get("pageCount")
            }).unbind("pagechange").bind("pagechange", function (index) {
                top.BH("caiyunPageN");
                self.model.set({
                    pageIndex: index
                });
            });

        },

        /**
         * 设置导航路径信息
         */
        setNavigate: function () {
            var self = this;
            var html = $("#tplNavigation").html();
            var template = _.template(html);
            var data = self.model.get("navs");
            $("#navContainer").html(template(data));
        },

        /**
      * 页面高度自适应
      */
        adjustHeight: function () {
            var self = this;
            var container = $("#tbl_body");
            var bodyHeight = $("body").height();
            var top = container.offset().top;
            container[0].style.overflowY = "auto";
            container.height(bodyHeight - top);
        },

        /**
      * 呈现视图
      */
        render: function () {
            var self = this;

            //清空列表
            $("#tbl_th").removeClass("hide");
            $("#tbl_body").removeClass("hide");
            $("#dv_nofile").addClass("hide");
            $("#tblist").empty();


            //通知UI显示数据加载中
            self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                message: self.model.TIPS.DATA_FETCHING,
                params: { delay: 15000 }
            });

            //设置页面导航信息
            self.setNavigate();

            self.adjustHeight();

            //还原选中项的默认状态
            $("#cbSelectAll").removeAttr("checked");
            self.model.set({ checkData: [] }, { silent: true });


            self.model.fetch(function (data) {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);

                //没有数据时的显示
                if (!data || data.length === 0)
                    self.showNothing();

                self.setPager();
                self.fillData();

            }, function () {
                //关闭数据加载提示
                self.model.trigger(self.model.EVENTS.SHOW_TIPS);
                //没有数据时的显示
                self.showNothing();

                self.model.trigger(self.model.EVENTS.SHOW_TIPS, {
                    message: self.model.TIPS.FETCH_DATA_ERROR,
                    params: {
                        delay: 3000,
                        className: "msgRed"
                    }
                });
            });
        },

        /**
        * 设置导航路径信息
        */
        fillData: function () {
            var self = this;
            var data = self.model.filterData();
            var container = $("#tblist").empty();

            if (data && data.length > 0) {
                var html = $("#tplShareList").html();
                var template = _.template(html);
                container.html(template(data));

                //还原选中项状态
                $("#cbSelectAll").removeAttr("checked");
                self.setCheckedUI();
            }
        },

        /**
         * 下载
        **/
        download: function () {

            var self = this;
            var data = self.model.getCheckedFiles();

            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            top.BH("diskv2_download_package");

            self.common.download({
                directoryIds: data.checkedDirIds,
                fileIds: data.checkedFids,
                isFriendShare: 1,
                path: self.model.getCurDirPath(),
                success: function (url) {
                    $("#downloadFrame", window.parent.document).attr('src', url);
                },
                error: function () {
                    var tip = self.model.TIPS.OPERATE_ERROR;
                    top.M139.UI.TipMessage.show(tip, {
                        delay: 3000,
                        className: "msgRed"
                    });
                }
            });

        },

        /**
         * 删除文件
         */
        cancelShare: function () {
            var self = this;
            var data = self.model.getCheckedFiles();
            if (!data) {
                var mssage = self.model.TIPS.MUST_CHECKFILE;
                self.common.showTips(mssage);
                return;
            }

            //判断是否子目录，子目录下不允许删除
            var navs = self.model.get("navs");
            if (navs && navs.length > 0) {
                var mssage = self.model.TIPS.SUBDIR_CANNOTDEL;
                self.common.showTips(mssage);
                return;
            }

            //获取确认提示语          
            var TIPS = self.model.TIPS;
            var message = TIPS.CANCEL_SHAREFILE;
            if ((data.checkedDirIds.length + data.checkedFids.length) > 1) {
                message = TIPS.CANCEL_SHAREFILES;
            }
            top.$Msg.confirm(message, function () {
                self.model.cancelShare({
                    dirIds: data.checkedDirIds,
                    fileIds: data.checkedFids,
                    success: function () {
                        self.render();
                    },
                    error: function () {
                        var tip = self.model.TIPS.OPERATE_ERROR;
                        top.M139.UI.TipMessage.show(tip, {
                            delay: 3000,
                            className: "msgRed"
                        });
                    }
                });

            }, function () {

            }, {
                buttons: ["是", "否"]
            });

        },

        /**
         * 编辑共享接收人
         **/
        shareEdit: function (id) {
            var self = this;
            var items = [];
            var obj = self.model.getShareObj(id);
            var maxCount = 20;
            var data = {};

            if (!obj)
                return;

            if (obj.shareObj == self.common.shareObjTypes.DIR) {
                data.shareDirIds = [id];
            }
            if (obj.shareObj == self.common.shareObjTypes.FILE)
                data.shareFileIds = [id];

            data.recvUserNumbers = [];
            if (_.isArray(obj.shareeList))
                data.recvUserNumbers = obj.shareeList;

            self.common.showShareDialog($.extend(data, {
                success: function () {
                    window.setTimeout(function () {
                        self.render();
                    }, 3000);
                }
            }));
        },

        /**
         * 没有信息时的展示
         */
        showNothing: function () {

            $("#dv_nofile").removeClass("hide");
            $("#tbl_th").addClass("hide");
            $("#tbl_body").addClass("hide");
        }

    }));

})(jQuery, _, M139);

