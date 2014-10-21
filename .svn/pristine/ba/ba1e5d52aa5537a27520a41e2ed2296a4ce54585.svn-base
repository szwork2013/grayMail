(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace("M2012.GroupMail.View.Album", superClass.extend(
    {
        el: "#uploadList",
        name: "M2012.GroupMail.View.Album",
        logger: new top.M139.Logger({ name: "M2012.GroupMail.View.Album" }),
        template: [
            '<li class="groupSession_timeList_li<%= cls %>" id="<%-templateId%>">',
                '<div class="groupSession_name clearfix">',
                    '<strong><%-timePoint%></strong>',
                    '<span class="i_icoTime"></span>',
                    '<a href="javascript:;" data-tid="group_mail_contacts_click" title=<%-email%>><%-userName%></a>',
                    '<span name="count">上传了 <%-count%> 张图片</span>',
                '</div>',
                '<ul class="groupSession_pic clearfix">',
                    '<% _.each(photos, function(o, i) { %>',
                        '<li data-fileid=<%=o["imgId"]%>>',
                            '<a href="javascript:;">',
                                '<img src=<%-o["imgUrl"]%> width="80" height="80" alt="" title=<%-o["imgName"]%> data-userid="<%-userId%>" data-filesize="<%-o["imgSize"]%>">',
                                '<span class="" name="topleft"></span>',
                            '</a>',
                        '</li>',
                    '<% }); %>',
                '</ul>',
            '</li>'
        ].join(''),
        templateUploadHeader: [
            '<li class="groupSession_timeList_li groupSession_name_first" id="<%-templateId%>">',
                '<div class="groupSession_name clearfix">',
                    '<strong><%-timePoint%></strong>',
                    '<span class="i_icoTime"></span>',
                    '<a href="javascript:;" data-tid="group_mail_contacts_click" title=<%-email%>><%-userName%></a>',
                    '<span name="count">上传了 <%-count%> 张图片</span>',
                '</div>',
                '<ul class="groupSession_pic clearfix">',
                '</ul>',
            '</li>'
        ].join(""),
        events: {            
        },
        selectedIds: [],
        commonIds: [],
        uploadArr: [],
        initialize: function (options) {
            this.model = options.model;
            this.groupmailModel = options.groupmailModel;

            this.collection = new Backbone.Collection;

            this.initUI();
            this.initEvents();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initUI: function () {
            this.ui = {};
            this.ui.main = $('#groupAlbum');

            //工具栏
            this.ui.toolbar = $('#albumToolbar');
            this.ui.uploadBtn = $('#uploadBtn');
            this.ui.downloadBtn = $('#downloadBtn');
            this.ui.deleteBtn = $('#deleteBtn');
            this.ui.sendBtn = $('#sendBtn');
            this.ui.saveBtn = $('#saveBtn');

            this.ui.listDiv = $('.groupSession_time');
            //list           
            this.ui.listContainer = $('#uploadList');

            //无列表
            this.ui.noListContainer = $('.groupSessionNot');

        },
        initEvents: function () {
            var self = this,
                model = this.model;

            this.collection.on('add', function (e) {
                var template = _.template(self.template);
                var templateId = "li_" + new Date().getTime();
                var item = template({
                    cls: e.get('first') ? ' groupSession_name_first' : '',
                    timePoint: e.get('timePoint'),
                    email: e.get('email'),
                    userId: e.get('userId'),
                    userName: e.get('userName'),
                    count: e.get('count'),
                    photos: e.get('photos'),
                    templateId : templateId
                });

                !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = e.attributes);
                $(self.el).append(item);
            });

            this.collection.on('reset', function () {
                $(self.el).html('');
            });

            $('.groupSession_time').scroll(function () {
                if (self.model.get('point') <= self.model.get('pageCount')
                    && $(document).height() - $(this).scrollTop() - $(this).height() < 50) {
                    self.model.set('point', self.model.get('point') + 1);
                    self.loadMore(self.model.get('point'));
                }
                // 保存滚动条滚动的高度
                self.groupmailModel.get("cacheScrollTop")["groupAlbum_time"] = $("#groupAlbum_time").scrollTop();
            });

            //列表
            model.on(model.albumEvent['GET_ALBUM_LIST'], function (firstLoad) {
                self.model.getAlbumList(function (result) {
                    if (result && result.responseData) {
                        var resp = result.responseData;
                        if (resp['code'] === 'S_OK') {
                            var data = resp['var'];
                            if (data) {
                                if (data.length > 0) {
                                    //self.render(data);
                                    //控制上传遮罩层的隐藏和显示
                                    self.setUI();
                                    self.collection.reset();
                                    _.each(data, function (ele, index) {
                                        if (index == 0) {
                                            ele.first = true;
                                        }
                                        self.collection.add(ele);
                                    });
                                    self.eventHandler();
                                    self.addPreviewEvent();
                                } else {
                                    self.noAlbumHandler();
                                }
                            }

                            /*******切换标签页时的逻辑**************/
                            self.groupmailModel.get("dataSum")["groupAlbum"] = data.length || 0;
                            self.groupmailModel.trigger("showCurrentView");
                            self.groupmailModel.set("currentAlbumLoadComplete", true);

                            self.setUserData(result);
                            if (firstLoad) {
                                // 首次加载时, 初始化上传组件
                                var fileUpload = self.initFileUploader('uploadBtn');
                                self.fileUpload = fileUpload;
                                //setTimeout(function () {
                                //    fileUpload.dock('#uploadBtn');
                                //}, 100);
                                self.setContainerHeight();
                            }
                        } 
                        if (resp['summary'] == '服务端校验不通过') {
                            top.$App.setSessionOut();
                        }
                        
                    } else {
                        self.logger.error('getAlbumList return data error', '[album:getAlbumList]', result);
                    }
                }, { point: 1, groupNumber: self.groupmailModel.get('groupNumber') });
            });

            //群组切换，重新渲染群相册页面
            self.groupmailModel.on('change:groupNumber', function () {
                if (self.groupmailModel.get("currentView") != "groupAlbum") {
                    return;
                }
                self.resetSelectedPics();

                self.model.set('pageCount', 0);
                self.model.set('point', 1);
                
                self.ui.toolbar.find('a.btnNormal').addClass('groupAlbum_btnNo');
                self.model.trigger(self.model.albumEvent['GET_ALBUM_LIST']);
            });

            $(window).resize(function () {
                self.setContainerHeight();
                if (self.uploaderWhenListNil && !$('#btnNil').is(':hidden')) {
                    self.uploaderWhenListNil.dock('#btnNil');
                }
            });
        },
        resetSelectedPics: function () {
            var self = this;
            self.commonIds = [];
            self.model.set('commonIds', []);
            self.selectedIds = [];
            self.model.set('selectedIds', []);            
        },
        setContainerHeight: function () {            
            var otherH = 0;
            if (!$('#albumToolbar').is(':hidden')) {
                otherH = $('#groupAlbumTabs').outerHeight() + $('#albumToolbar').outerHeight() + 33;
            } else {
                //工具栏隐藏时高度为0，此时加上它本来的高度24px
                otherH = $('#groupAlbumTabs').outerHeight() + 57;
            }            
            $("#groupAlbum_time").height($(window).height() - otherH);
        },
        setUI: function () {
            var self = this;
            self.ui.noListContainer.hide();
            self.ui.main.show();
            self.ui.toolbar.show();
            if (self.fileUpload) {
                self.fileUpload.dock('#uploadBtn');
                self.fileUpload.isShow(true);
            }
            if (self.uploaderWhenListNil && self.uploaderWhenListNil.getMarginLeft() == '0px') {
                self.uploaderWhenListNil.isShow(false);
            }
            if (self.fileUpload && self.fileUpload.getMarginLeft() == '-999px') {
                self.fileUpload.isShow(true);
            }
        },
        setUserData: function (result) {
            var self = this;
            if (result.responseData['isOwner']) {
                //1为管理员
                var isOwner = result.responseData['isOwner'];
                if (isOwner == '1') {
                    self.model.set({ 'isAdmin': true });
                } else {
                    self.model.set({ 'isAdmin': false });
                }
            }
            if (result.responseData['curUserId']) {
                var curUserId = $.trim(result.responseData['curUserId']);
                if (curUserId != '') {
                    self.model.set({ 'curUserId': parseInt(curUserId) });
                }
            }
            if (result.responseData['curUserName']) {
                var curUserName = $.trim(result.responseData['curUserName']);
                if (curUserName) {
                    self.model.set({ 'curUserName': curUserName });
                }
            }
            if (result.responseData['email']) {
                var email = $.trim(result.responseData['email']);
                if (email) {
                    self.model.set({ 'curEmail': email });
                }
            }
            if (result.responseData['pageCount']) {
                var pageCount = result.responseData['pageCount'];
                if (pageCount) {
                    self.model.set({ 'pageCount': parseInt(pageCount) });
                }
            }
        },
        judgeExt: function (files) {
            var self = this,
                success = true;
            $.each(files, function (i, p) {
                var fileName = p.fileName;
                var ext = self.model.getExtName(fileName);
                if (ext == 'jpg' || ext == 'jpeg' || ext == 'gif'
                    || ext == 'png' || ext == 'jpe' || ext == 'bmp') {                    
                } else {
                    top.M139.UI.TipMessage.show('图片格式有误', { delay: 1000, className: 'msgRed' });
                    success = false;
                    return false;
                }
            });
            return success;
        },
        initFileUploader: function (bindElement) {
            var self = this;
            var totalLength = 0, i = 0;
            return new FileUpload({
                container: document.getElementById(bindElement),
                getUploadUrl: function () {
                    //地址上灰度和全网是必须适配
                    //现网可能要去掉mw2目录
                    var singleUrl = [
                        "http://" + window.location.host + '/mw2/groupmail/s?func=gom:uploadFile',
                        '&groupNumber=', self.groupmailModel.get('groupNumber'),
                        '&sid=', top.sid,
                        '&comefrom=1'
                    ].join('');
                    return self.model.get('isBatchUpload') ? (singleUrl + '&transId=' + self.model.get('batchTransId')) :
                        (singleUrl + '&transId=' + Math.random() + new Date().getTime());

                },
                onselect: function (files) {                    
                    if (files.length == 0) return;
                    if (!self.judgeExt(files)) {
                        this.reset();
                        return;
                    }
                    var me = this;
                    totalLength = files.length;

                    //添加新轴点
                    var timePoint = self.model.formatDate();
                    var prependHtml = _.template(self.templateUploadHeader,
                        {
                            timePoint: timePoint, userName: self.model.get('curUserName'),
                            userId: self.model.get('curUserId'), count: files.length,
                            email: self.model.get('curEmail'),
                            templateId: 'li_' + new Date().getTime()
                        });
                    self.ui.listContainer.prepend(prependHtml);

                    //改变一下原来列表第一个元素的样式
                    $('.groupSession_name_first').eq(1).removeClass(' groupSession_name_first');

                    if (files.length > 1) {
                        self.model.set('isBatchUpload', true);
                        self.model.set('batchTransId', Math.random() + '' + new Date().getTime());
                    } else {
                        self.model.set('isBatchUpload', false);
                        self.model.set('batchTransId', '0');
                    }

                    $(files).each(function (i, n) {
                        self.updateUI(n);
                    });
                    setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                        me.upload();
                    }, 10);
                },
                onprogress: function (fileInfo) {
                    self.updateUI(fileInfo);
                },
                oncomplete: function (fileInfo, responseText) {                    
                    try {
                        var responseData = eval('(' + responseText + ')');
                    } catch (ex) { self.logger.error('responseText exception'); }
                    var $pic = $('.groupSession_pic').first().find('li[taskid=' + fileInfo.taskId + ']');
                    var rslt = {},
                        fileId = 0,
                        thumUrl = '',
                        name = '',
                        size = 0;
                    if (responseData) {
                        var code = responseData['code'];
                        if (code === 'S_OK') {
                            rslt = responseData['var'];

                            fileId = rslt.fileId;
                            thumUrl = rslt.thumUrl;

                            name = fileInfo.fileName;
                            size = fileInfo.fileSize;

                            //设置DOM节点属性fileId
                            $pic.attr('data-fileid', fileId);
                            $pic.find('img').attr('data-fileid', fileId);

                            //设置缩略图src属性
                            $pic.find('img').attr('src', thumUrl)
                                            .attr('title', name)
                                            .attr('data-filesize', size);
                            $pic.find('.i_groupIco_bg').remove();
                            $pic.find('.i_groupIco_num').remove();
                            $pic.removeAttr('taskid');

                            self.updateUI(fileInfo);
                        } else if (code === 'PML10406010') {
                            self.uploadError($pic, '图片格式不符合要求', responseData['summary']);
                        } else if (code === 'PML10406012') { //超容量
                            self.uploadError($pic, '群组容量不足', responseData['summary']);
                        } else if (responseData['summary'] == '服务端校验不通过') {
                            top.$App.setSessionOut();
                        }
                    } else {
                        console.log("上传返回报文格式有误");
                    }

                    var picObj = {
                        imgId: fileId,
                        imgName: name,
                        imgSize: size,
                        imgUrl: thumUrl
                    };
                    self.uploadArr.push(picObj);
                                        
                    i++;
                    //最后一次
                    if (i == totalLength) {
                        //将轴点加到("uploadFileList")
                        var templateId = $(".groupSession_name_first").attr('id');
                        var item = {
                            count: totalLength,
                            email: self.model.get('curEmail'),
                            photos: self.uploadArr,
                            timePoint: '',
                            userId: self.model.get('curUserId'),
                            userName: self.model.get('curUserName')
                        };
                        !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = item);
                        self.addPreviewEvent();

                        self.eventHandler();
                        i = 0;
                        self.uploadArr = [];

                        //重置
                        this.reset();
                    }
                },
                logKey: 'group_mail_album_uploadPic'
            });
        },
        uploadError: function (target, errorStr, summary) {
            var self = this;
            top.M139.UI.TipMessage.show(errorStr, { delay: 1000, className: 'msgRed' });
            summary && self.logger.log(summary);
            target.find('img').attr('src', '../../images/201312/face_06.jpg');
            target.find('.i_groupIco_num').remove();
        },
        /**
         * 给图片绑定预览的事件
         * 只针对img元素
         */
       addPreviewEvent : function () {
           var that = this;
           $(that.el).find("li ul li").unbind("click").click(function(event) {
               if (event.target && event.target.tagName.toLowerCase() != 'img') {
                   // 如果点击的不是图片，直接返回
                   return;
               }
               top.BH && top.BH('group_mail_album_preview');

               // 图片在ul中的位置
               var picture_index = $(this).index(); // 图片在ul中的位置
               // 当前文件fileId
               var fileId = $(this).data("fileid");
               // ul在坐标轴中的位置, 从0开始
               var li_id = $(this).closest("ul").closest("li").attr("id");
               //var ul_index = $(this).closest("ul").closest("li").attr("id");

               // 从缓存当中获取该轴点下的所有缩略图信息
               var currentPhotoList = that.model.get("uploadFileList")[li_id].photos;
               // 从缓存当中获取该轴点下的所有原图地址信息
               var cacheDownloadUrlList = that.model.get("downloadUrlList")[li_id];

               // 从缓存当中获取下载图片信息, 如果存在直接返回数据
               if (cacheDownloadUrlList) {
                   // 直接从缓存中取数据, 直接预览
                   beginPreview(buildPreviewData(currentPhotoList, cacheDownloadUrlList), picture_index);
                   return;
               }

               // 如果不存在, 根据所有id调用批量接口获取图片数据, 并将请求后的数据放入缓存
               var fileIdArr = [];
               fileIdArr.push(fileId);
               $.each($(this).siblings(), function() {
                   fileIdArr.push($(this).data("fileid"));
               });

               that.model.batchPreDownload(function(response){
                   // 缓存起来
                   response && (that.model.get("downloadUrlList")[li_id] = response);
                   // 预览操作
                   beginPreview(buildPreviewData(currentPhotoList, response), picture_index);
               }, {
                   groupNumber : that.groupmailModel.get("groupNumber"),
                   fileId : fileIdArr.join(",")
               });

               /**
                * 通过imgID获取对应的大图地址
                * @param imgId
                * @param downloadUrlArr
                * @returns {*}
                */
               function getDownLoadUrlByImgId (imgId , downloadUrlArr) {
                   for (var a = 0; a < downloadUrlArr.length; a++) {
                       if (downloadUrlArr[a].imgId == imgId) {
                           return downloadUrlArr[a].downloadUrl;
                       }
                   }
                   return "";
               }

               /**
                * 构建预览数据
                * @param currentPhotoList 缓存中获取的缩列图数据列表
                * @param downloadList 获取下载地址(可能是缓存可能直接从接口获取)
                */
               function buildPreviewData(currentPhotoList, downloadList) {
                   var imgList = [];
                   for (var i = 0, len = currentPhotoList.length; i < len; i++) {
                       imgList.push({
                           bigthumbnailURL : getDownLoadUrlByImgId(currentPhotoList[i].imgId, downloadList), // 大图地址(下载地址)
                           fileName : currentPhotoList[i].imgName, // 文件名称
                           thumbnailURL : currentPhotoList[i].imgUrl, // 缩略图地址
                           presentURL : getDownLoadUrlByImgId(currentPhotoList[i].imgId, downloadList) // 下载图地址, 暂时设置为跟大图一样
                       });
                   }
                   return imgList;
               }

               /**
                * 开始预览图片
                * @imgList 图片列表
                * @index 当前图片索引
                */
               function beginPreview(imgList, index) {
                   if (!$.isEmptyObject(that.model.focusImagesView)) {
                       that.model.focusImagesView.render({ data: imgList, index : index });
                   }else{
                       top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=" + Math.random());
                       top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                           that.model.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                           that.model.focusImagesView.render({ data: imgList, index : index});
                       });
                   }
               }
           });
       },

        //上传UI变化
        updateUI: function (fileInfo) {
            var self = this;

            var ul = $(".groupSession_pic").first();
            switch (fileInfo.state) {
                case "waiting":
                    var targetStr = [
                            '<li taskid=', fileInfo.taskId, '>',
                                '<a href="javascript:;">',
                                    '<img src="../../images/201312/face_05.jpg" width="80" height="80" alt="" data-userid=', self.model.get("curUserId"),'>',
                                    '<span class="" name="topleft"></span>',
                                    '<span class="i_groupIco_bg"></span>',
                                    '<span class="i_groupIco_num">等待中</span>',
                                '</a>',
                            '</li>'
                    ].join('');
                    ul.append(targetStr);
                    console.log(fileInfo.fileName + "(等待上传...)");
                    break;
                case "uploading":
                    var target = ul.find("li[taskId=" + fileInfo.taskId + "]");
                    doProgress(fileInfo.percent, target);
                    console.log(fileInfo.fileName + "(" + fileInfo.percent + "%)");
                    break;
                case "complete":
                    console.log(fileInfo.fileName + "(完成)");
                    break;
            }

            //进度条
            function doProgress(progress, target) {
                if (progress < 100) {
                    setTimeout(function () {
                        doProgress();
                    }, 100);
                    setProgress(progress, target);
                    progress++;
                }
            }
            
            function setProgress(progress, target) {
                if (progress) {
                    target.find('.i_groupIco_num').html(progress + "%");
                    target.find('.i_groupIco_bg').css("width", (100 - progress) + "%");
                }
            }

        },

        eventHandler: function () {
            var self = this;
            // 图片悬浮
            $(self.el).find('li[data-fileid]').off("hover").on('hover', function (event) {
                if ($(this).hasClass("groupFocus")) return;

                if ($(this).find('img').attr('src').indexOf('../../images/201312/face_05.jpg') > -1 ||
                    $(this).find('img').attr('src').indexOf('../../images/201312/face_06.jpg') > -1) {
                    return;
                }

                if (event.type == 'mouseenter') {
                    $(this)
                        .addClass("groupHover")
                        .find("span").addClass("i_groupIco_ck");
                } else {
                    $(this)
                        .removeClass("groupHover")
                        .find("span").removeClass("i_groupIco_ck");
                }
            });

            // 选中操作
            $(".groupSession_pic").find("span[name='topleft']").off("click").on('click', function (event) {
                top.BH && top.BH('group_mail_album_select');
                if ($(this).next().next().html() == '等待中') return;
                var imgId = $(this).closest("li").data("fileid");
                var userId = $(this).prev().data("userid");
                if ($(this).hasClass("i_groupIco_ck")) {
                    $(this).closest("li").removeClass().addClass("groupFocus");
                    $(this).removeClass().addClass("i_groupIco_ok");
                    //加个判断，判断最近的userId是否和当前登录用户id相同， 相同时才加入数组中
                    if (!self.model.get('isAdmin')) {
                        if (parseInt(userId) == self.model.get("curUserId")) {
                            self.selectedIds.push(imgId);
                            self.model.set('selectedIds', self.selectedIds);
                            self.ui.toolbar.find('a.btnNormal').removeClass("groupAlbum_btnNo");
                        } else {
                            for (var i = 0; i < 4; i++) {
                                if (i != 1) {
                                    self.ui.toolbar.find('a.btnNormal').eq(i).removeClass("groupAlbum_btnNo");
                                }
                            }
                        }                         
                    } else {
                        self.selectedIds.push(imgId);
                        self.model.set('selectedIds', self.selectedIds);
                        self.ui.toolbar.find('a.btnNormal').removeClass("groupAlbum_btnNo");
                    }                    
                    self.commonIds.push(imgId);
                    self.model.set('commonIds', self.commonIds);
                } else {
                    $(this).closest("li").removeClass().addClass("groupHover");
                    $(this).removeClass().addClass("i_groupIco_ck");
                    self.selectedIds = _.reject(self.selectedIds, function (id) { return id == imgId; });
                    self.model.set('selectedIds', self.selectedIds);

                    self.commonIds = _.reject(self.commonIds, function (id) { return id == imgId; });
                    self.model.set('commonIds', self.commonIds);

                    if (self.commonIds.length == 0) {
                        self.ui.toolbar.find('a.btnNormal').addClass("groupAlbum_btnNo");
                    }
                }
            });

            //下载
            self.ui.downloadBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_download');

                self.model.downloadPics(function (result) {
                    if (result && result.downloadUrl) {
                        $('#albumDownloadFrame').attr('src', result.downloadUrl);
                    } else {
                        top.M139.UI.TipMessage.show(self.model.tipWords['DOWNLOAD_FAIL'], { delay: 1000, className: 'msgRed' });
                        self.logger.error('album download return data error', '[album:download]', result);
                    }
                }, {
                    groupNumber: self.groupmailModel.get('groupNumber'),
                    picArr: self.model.get('commonIds').toString()
                });
            });

            //删除
            /**只有上传者和管理员才有权限删除照片
             *如果同时选择了别人上传的和自己的上传的照片，点击删除只能删除自己的
             *如果只选择了别人上传的照片，则删除Button置灰不可点击
             */
            self.ui.deleteBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_delete');

                top.$Msg.confirm(self.model.tipWords['DELETE_CONFIRM'], function () {
                    self.model.deletePics(function (result) {
                        if (result && result.responseData && result.responseData.code == 'S_OK') {
                            //移除DOM节点
                            //1、选中了轴点内所有图时，移除整个轴点
                            //2、否则移除相应图片而不移除轴点
                            _.each(self.selectedIds, function (ele, index) {
                                var picLi = $(self.el).find('li[data-fileid=' + ele + ']');
                                picLi && picLi.remove();
                            });
                            
                            _.each($(self.el).find('li[id] ul'), function (element) {
                                if ($(element).children('li').length == 0) {
                                    $(element).closest('li[id]').remove();
                                } else {
                                    //改变上传图片数量
                                    $(element).prev().find('span[name="count"]').html("上传了 "
                                        + $(element).children('li').length + " 张图片");
                                }
                            });
                            self.commonIds = _.difference(self.commonIds, self.selectedIds);
                            self.model.set('commonIds', self.commonIds);
                            self.selectedIds = [];
                            self.model.set('selectedIds', []);
                            
                            if (self.commonIds.length == 0) {
                                self.ui.toolbar.find('a.btnNormal').addClass('groupAlbum_btnNo');
                            } else { //置灰删除键即可
                                self.grayDel();
                            }
                            top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_SUC'], { delay: 3000 });

                            //判断页面是否0相片，如果是，展示引导页
                            var timePointLi = self.ui.listContainer.children('li');
                            if (timePointLi.length == 0) {
                                self.groupmailModel.get("dataSum")["groupAlbum"] = 0;
                                self.noAlbumHandler();
                                return;
                            }

                            //如果删掉了第一个轴点，改变一下原第一个轴点下一个轴点的class
                            var firstLi = timePointLi.first();
                            if (!firstLi.hasClass('groupSession_name_first')) {
                                firstLi.addClass('groupSession_name_first');
                            }
                        } else {
                            top.M139.UI.TipMessage.show(self.model.tipWords['DELETE_FAIL'], { delay: 1000, className: 'msgRed' });
                            self.logger.error('album delete return data error', '[album:delete]', result);
                        }
                    }, {
                        groupNumber: self.groupmailModel.get('groupNumber'),
                        picArr: self.model.get('selectedIds').toString()
                    });
                }, null, null, { isHtml: true, dialogTitle: "删除图片", icon: "i_warn", buttons: ['删除', '取消'] });
            });

            //发送
            self.ui.sendBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_send');

                var htmlCode = '';
                var fileList = [];
                var itemTemp = '<li rel="largeAttach" objId="{objId}" filetype="i_cloudS"><i class="i_cloudS"></i>\
					<span class="ml_5">{prefix}<span class="gray">{suffix}</span></span>\
					<span class="gray ml_5">({fileSizeText})</span>\
					<a hideFocus="1" class="ml_5" href="javascript:void(0)" removeLargeAttach="{objId}">删除</a></li>';

                _.each(self.model.get('commonIds'), function (element, index) {
                    var $img = $(self.el).find('li[data-fileid=' + element + '] img');
                    var img = {
                        name: M139.Text.Utils.htmlEncode($img.attr('title')),
                        linkUrl: $img.attr('src'),
                        id: $img.parents('li').data('fileid'),
                        file: { fileSize: $img.data('filesize') }
                    };
                    fileList.push(img);

                    var shortName = getShortName(M139.Text.Utils.htmlEncode($img.attr('title'))),
                        prefix = shortName.substring(0, shortName.lastIndexOf('.') + 1),
                        suffix = shortName.substring(shortName.lastIndexOf('.') + 1, shortName.length);
                    var data = {
                        objId: $img.parents('li').data('fileid'),
                        prefix: prefix,
                        suffix: suffix,
                        fileSizeText: M139.Text.Utils.getFileSizeText($img.data('filesize')),
                        fileId: $img.parents('li').data('fileid')
                    };
                    htmlCode += top.$T.Utils.format(itemTemp, data);

                });
                top.$Evocation.create({
                    type: "compose", subject: "【139邮箱-群相册】" + fileList[0].name,
                    content: "", whereFrom: "disk", diskContent: htmlCode, diskContentJSON: fileList
                });

                function getShortName(fileName) {
                    if (fileName.length <= 30) return fileName;
                    var point = fileName.lastIndexOf(".");
                    if (point == -1 || fileName.length - point > 5) return fileName.substring(0, 28) + "…";
                    return fileName.replace(/^(.{26}).*(\.[^.]+)$/, "$1…$2");
                }
            });

            //存彩云
            self.ui.saveBtn.unbind("click").click(function (e) {                
                if ($(this).hasClass('groupAlbum_btnNo')) {
                    return;
                }
                top.BH && top.BH('group_mail_album_saveCaiyun');

                var arr = self.model.get('commonIds');
                if (arr.length > 0) {
                    self.model.saveCaiyunbatchPreDownload(function (result) {
                        if (result && result.responseData && result.responseData['code'] === 'S_OK') {
                            var data = result.responseData['var'];
                            if (data && $.isArray(data)) {
                                var attaches = [];
                                $.each(data, function (i, obj) {
                                    attaches.push({
                                        fileSize: obj['imgSize'],
                                        fileName: obj['imgName'],
                                        url: obj['downloadUrl']
                                    });
                                });
                                var saveToDiskview = new top.M2012.UI.Dialog.SaveToDisk({
                                    Attachinfos: attaches
                                });

                                saveToDiskview.render().on('success', function () {
                                    console.log('存彩云成功');
                                });
                            }
                        } else {
                            top.M139.UI.TipMessage.show('获取批量下载地址失败', { delay: 3000, className: 'msgRed' });
                        }

                    }, {
                        groupNumber: self.groupmailModel.get('groupNumber'),
                        fileId: self.model.get('commonIds').toString()
                    });
                } else {
                    top.M139.UI.TipMessage.show('未选中图片', { delay: 3000, className: 'msgYellow' });
                }
            });

            //点击显示联系人页卡
            $(self.el).find('a[data-tid="group_mail_contacts_click"]').off('click').click(function (e) {
                if (self.myContactsCard && !self.myContactsCard.isHide()) {
                    return;
                }
                var contactCardComp = new window.parent.M2012.UI.Widget.ContactsCard().render(),
                    target = e.target || e.srcElement,
                    email = $(target).attr('title');
                self.myContactsCard = contactCardComp;
                if (contactCardComp) {
                    contactCardComp.show({
                        dockElement: target,
                        email: email,
                        dx: 1,
                        dy: 120
                    });
                }
            });
        },
        render: function (result) {            
        },
        grayDel: function () {
            var self = this;
            self.ui.toolbar.find('a.btnNormal').eq(1).addClass("groupAlbum_btnNo");
        },
        noAlbumHandler: function () {
            var self = this;
            self.ui.main.hide();
            self.ui.noListContainer.height($(window).height() - $('#groupAlbumTabs').height() - 159);
            self.ui.noListContainer.show();

            //隐藏工具按钮
            self.ui.toolbar.hide();            
            self.fileUpload && self.fileUpload.isShow(false);
            if (self.uploaderWhenListNil) {
                if (self.uploaderWhenListNil.getMarginLeft() == '-999px') { 
                    self.uploaderWhenListNil.isShow(true);
                }
                return;
            }

            setTimeout(function () {
                var len = 0, index = 0;
                var uploaderWhenListNil = new FileUpload({
                    container: document.getElementById("btnNil"),
                    getUploadUrl: function () {
                        //地址上灰度和全网是必须适配
                        var singleUrl = [
                            "http://" + window.location.host + '/mw2/groupmail/s?func=gom:uploadFile',
                            '&groupNumber=', self.groupmailModel.get("groupNumber"),
                            '&sid=', top.sid,
                            '&comefrom=1'
                        ].join('');
                        return self.model.get('isBatchUpload') ? (singleUrl + '&transId=' + self.model.get('batchTransId')) :
                            (singleUrl + '&transId=' + Math.random() + new Date().getTime());

                    },
                    onselect: function (files) {
                        if (files.length == 0) return;
                        if (!self.judgeExt(files)) {
                            this.reset();
                            return;
                        }
                        var me = this;
                        len = files.length;

                        //添加新轴点                        
                        self.ui.listContainer.html('');
                        self.ui.noListContainer.hide();
                        self.ui.main.show();
                        self.ui.toolbar.show();
                        if (self.fileUpload) {
                            self.fileUpload.dock('#uploadBtn');
                            self.fileUpload.isShow(true);
                        }
                                                
                        var timePoint = self.model.formatDate();
                        var prependHtml = _.template(self.templateUploadHeader,
                            {
                                timePoint: timePoint, userName: self.model.get('curUserName'),
                                userId: self.model.get('curUserId'), count: files.length,
                                email: self.model.get('curEmail'),
                                templateId: 'li_' + new Date().getTime()
                            });
                        self.ui.listContainer.prepend(prependHtml);
                        

                        //改变一下原来列表第一个元素的样式
                        $(".groupSession_name_first").eq(1).removeClass(" groupSession_name_first");

                        if (files.length > 1) {
                            self.model.set('isBatchUpload', true);
                            self.model.set('batchTransId', Math.random() + '' + new Date().getTime());
                        } else {
                            self.model.set('isBatchUpload', false);
                            self.model.set('batchTransId', '0');
                        }

                        $(files).each(function (i, n) {
                            self.updateUI(n);
                        });
                        setTimeout(function () { //异步，等待onselect函数return后才能调用upload
                            me.upload();
                        }, 10);
                    },
                    onprogress: function (fileInfo) {
                        self.updateUI(fileInfo);
                    },
                    oncomplete: function (fileInfo, responseText) {
                        console.log("responseText: " + responseText);
                        try {
                            var responseData = eval("(" + responseText + ")");
                        } catch (ex) { console.log("responseText try catch"); }
                        var $pic = $(".groupSession_pic").first().find("li[taskid=" + fileInfo.taskId + "]");
                        var rslt = {},
                            fileId = 0,
                            thumUrl = '',
                            name = '',
                            size = 0;
                        if (responseData) {
                            var code = responseData['code'];
                            if (code === 'S_OK') {
                                rslt = responseData['var'];

                                fileId = rslt.fileId;
                                thumUrl = rslt.thumUrl;

                                name = fileInfo.fileName;
                                size = fileInfo.fileSize;

                                //设置DOM节点属性fileId
                                $pic.attr('data-fileid', fileId);
                                $pic.find('img').attr('data-fileid', fileId);

                                //设置缩略图src属性
                                $pic.find('img').attr('src', thumUrl)
                                                .attr('title', name)
                                                .attr('data-filesize', size);
                                $pic.find('.i_groupIco_bg').remove();
                                $pic.find('.i_groupIco_num').remove();
                                $pic.removeAttr('taskid');

                                self.updateUI(fileInfo);
                            } else if (code === 'PML10406010') {
                                self.uploadError($pic, '图片格式不符合要求', responseData['summary']);
                            } else if (code === 'PML10406012') { //超容量
                                self.uploadError($pic, '群组容量不足', responseData['summary']);
                            } else if (responseData['summary'] == '服务端校验不通过') {
                                top.$App.setSessionOut();
                            }
                        } else {
                            console.log("上传返回报文格式有误");
                        }

                        var picObj = {
                            imgId: fileId,
                            imgName: name,
                            imgSize: size,
                            imgUrl: thumUrl
                        };
                        self.uploadArr.push(picObj);

                        index++;
                        if (index == len) {
                            //将轴点加到("uploadFileList")
                            var templateId = $(".groupSession_name_first").attr('id');
                            var item = {
                                count: len,
                                email: self.model.get('curEmail'),
                                photos: self.uploadArr,
                                timePoint: '',
                                userId: self.model.get('curUserId'),
                                userName: self.model.get('curUserName')
                            };
                            !self.model.get("uploadFileList")[templateId] && (self.model.get("uploadFileList")[templateId] = item);
                            self.groupmailModel.get("dataSum")["groupAlbum"] = index;
                            self.addPreviewEvent();

                            self.eventHandler();
                            index = 0;
                            self.uploadArr = [];

                            //隐藏
                            this.isShow(false);

                            //重置
                            this.reset();
                        }
                    },
                    logKey: 'group_mail_album_uploadPic'
                });
                self.uploaderWhenListNil = uploaderWhenListNil;
            }, 1000);            
        },
        loadMore: function (num) {
            var self = this;
            if (num > self.model.get('pageCount')) {
                return;
            }
            self.model.getAlbumList(function (result) {
                if (result && result.responseData) {
                    if (result.responseData['var']) {
                        var data = result.responseData['var'];
                        if (data && $.isArray(data) && data.length > 0) {
                            _.each(data, function (element, index) {
                                self.collection.add(element);
                            });
                            self.addPreviewEvent();
                            self.eventHandler();
                        }
                    }
                }
            }, { groupNumber: self.groupmailModel.get('groupNumber'), point: num });
        }

    }));
})(jQuery, _, M139);