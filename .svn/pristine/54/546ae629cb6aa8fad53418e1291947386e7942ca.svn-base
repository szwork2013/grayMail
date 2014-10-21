/**
* @fileOverview 附件缩略图预览视图
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
    * @namespace 
    * 附件缩略图预览视图
    */

    M139.namespace('M2012.ReadMail.View.FilePreview', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.FilePreview.prototype
        */

        el: "",

        template: {
            thumbnails_li: ["<li>",
                            "<div class='imgInfo'>",
                                "{item}",
                                "<dl>",
                                    "<dt><span class='attrlist-title' title='{fileName}' >{fileName}</span>({fileSize})</dt>",
                                    "<dd><a href='{downLoad}' bh='readmail_download'>下载</a>{preView}<a href='javascript:;' data-id='{fileId}' bh='readmail_savedisk'>存彩云网盘</a></dd>",
                                "</dl>",
                            "</div>",
                        "</li>"],

            thumbnails: ["<div class='attrBody' {display} id='{id}'>",
                            "<div class='attrAll'>",
                                "<span class='fr attrall-title' id='select_attach' style='display:none'></span>",
            //"<span><strong>普通附件</strong>(共{num}个)</span> <a href='{downLoadAll}' bh='readmail_downloadall'>全部下载</a> <a href='javascript:;' id='allsavetodisk' bh='readmail_savediskall'>全部存彩云</a>",
                                "<span><strong>附件图片预览</strong>(共{num}个)</span>",
                            "</div>",
                            "<ul class='attrList'>",
                                "{liList}",
                            "</ul>",
                        "</div>"],

            notimgItem: ["<span class='imgLink attrico'>",
                            "<i class='{0}'></i>",
                        "</span>"],

            imgItem: ['<img index="{2}" class="imgLink" src="{0}" data-url="{0}" width="58" height="58" title="{1}"  rel="" />'],

            sessionAttach: [
 		                '<span class="rMl">附&#12288;件：</span>',
 		                '<div class="rMr convattrlist">',
 			            '<div id="infoSta" {displayall} class="attachmentAll attachmentAll_on clearfix"><span class="fl">共{num}个附件</span> <span ><a href="{downLoadAll}" class="allgetdown ml_10 fl" bh="{bh_downloadall}">全部下载</a><a href="javascript:;" id="allsavetodisk" style="display: none;" bh="{bh_savediskall}">全部存彩云网盘</a></span><a href="javascript:void(0);" class="attachmentAll_right"><i class="g-down" id="listUp" style="display:none;"></i><i class="g-up" id="listDown"></i></a></div>',
 			            '<ul class="attachmentAll_list">{data}</ul>',
 	                    '</div>'],

            conversationAttach: [
                        '<div class="covv-accessory">',
                            '<div {displayall}><span>共{num}个附件</span> <span ><a href="{downLoadAll}" bh="{bh_downloadall}">全部下载</a> | <a href="javascript:;" id="allsavetodisk" bh="{bh_savediskall}">全部存彩云网盘</a>{savemcloud}</span></div>',
                            '<ul class="attachmentAll_list">{data}</ul>',
                        '</div>'],                                                
			
			allMcloudLink: ' | <a href="javascript:;" id="readmail_allsavemcloud" bh="{0}">全部存彩云网盘</a>',
			
			mcloudLink: ' | <a href="javascript:;" data-mcloudid="{fileId}" bh="{bh_savemcloud}">存彩云网盘</a>',
			
			mcloudLinkImg: '<a href="javascript:;" data-mcloudid="{fileId}" bh="{bh_savemcloud}">存彩云网盘</a>',
			
			sessionLi: ['<li index="{index}" f="common"><i class="i_attachmentS" oldClass="i_file_16 {getFileIcoClass}"></i><span title="{fileName}" >{fileName}&nbsp;&nbsp;{fileSize}&nbsp;&nbsp;<a href="{downLoad}" bh="{bh_download}">下载</a>{preView} | <a href="javascript:;" data-id="{fileId}" bh="{bh_savedisk}">存彩云网盘</a></span></li>']

            //sessionLi: ['<li index="{index}"><i class="i_file_16 {getFileIcoClass}"></i><span title="{fileName}" >{fileName}&nbsp;&nbsp;{fileSize}&nbsp;&nbsp;<a href="{downLoad}" bh="readmail_download">下载</a>{preView} | <a href="javascript:;" data-id="{fileId}" bh="readmail_savedisk">存网盘</a></span></li>']


        },

        initialize: function () {
            this.model = new M2012.ReadMail.Normal.Model();
            if (!top.SiteConfig.colorCloudRelease) {
                console.log('彩云开关头没打开');
                this.template.mcloudLink = "";
                this.template.mcloudLinkImg = "";
                this.template.allMcloudLink = "";
            }
            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**
        * 打开附件
        */
        open: function (p) {
            var url = M2012.ReadMail.View.FilePreview.getUrl(p, this.model.get("currFid"));
            window.open(url);
        },

        /**
        * 附件格式验证
        */
        checkFile: function (fileName, fileSize) {
            if (fileSize && fileSize > 1024 * 1024 * 20) {
                return -1;
            }
            //var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|html|htm|jpg|jpeg|jpe|jfif|gif|png|bmp|tif|tiff|ico|)$/i;
            var reg = /\.(?:doc|docx|xls|xlsx|ppt|pptx|pdf|txt|jpg|jpeg|jpe|jfif|gif|png|bmp|ico|)$/i;
            var reg2 = /\.(?:rar|zip|7z)$/i;
            if (reg.test(fileName)) {
                return 1;
            } else if (reg2.test(fileName)) {
                return 2;
            } else {
                return -1;
            }
        },

        /**
        * 获取文件格式图标
        * size = 1 大图标 size = 0 小图标
        */
        getFileIcoClass: function (size, fileName) {
            return $T.Utils.getFileIcoClass(size, fileName);
        },

        /**
        * 是否解压文件
        */
        isRelease: function () {
            return true;
        },

        /** 是否支持图片预览 */
        isPreviewImg: function (fileName) {
            return /(?:\.jpg|\.gif|\.png|\.ico|\.jfif|\.bmp|\.jpeg|\.jpe)$/i.test(fileName);
        },

        /** 获取预览图片路径 */
        getImgUrl: function (f, mid) {
            var self = this;
            var urltemp = "&sid={sid}&mid={mid}&realsize={realsize}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
            var imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                sid: $App.getSid(),
                mid: mid,
                size: f.fileSize,
                realsize: f.fileRealSize,
                offset: f.fileOffSet,
                name: f.fileName,
                type: f.type,
                width: 58,
                height: 58,
                quality: 80
            });
            return imgUrl;
        },

        /** 
        *获取附件预览视图
        */
        getThumbnailsHtml: function (title, attach, mid) {

            var self = this;
            var thisTemplate = self.template.thumbnails.join('');
            var num = attach.length;
            var id = "attach_" + mid;
            //var display = num > 0 ? "" : "style='display:none'";
            var display = '';
            var attachHtml = [];
            var previewImg = [];
            var imgUrl = '';
            var thisLiTemplate = self.template.thumbnails_li.join('');
            var notimgtemp = self.template.notimgItem.join('');
            var imgtemp = self.template.imgItem.join('');
			var mcloudLink = self.template.mcloudLinkImg;
            var getDownloadAllUrl = self.getDownloadAllUrl(mid);
            var picNum = 0;
            for (var i = 0; i < num; i++) {
                var f = attach[i];
                //判断是否可预览图片格式
                var isImgFlag = false;
                var index = "";
                var isImg = self.isPreviewImg(f.fileName);
                if (isImg) {
                    isImgFlag = true;
                    index = 'index=\"' + (picNum) + '\"';
                    imgUrl = self.getImgUrl(f, mid);
                    /*
                    var urltemp = "&sid={sid}&mid={mid}&size={size}&offset={offset}&name={name}&type={type}&width={width}&height={height}&quality={quality}&encoding=1";
                    imgUrl = 'http://' + location.host + "/RmWeb/mail?func=mbox:getThumbnail" + $T.Utils.format(urltemp, {
                    sid: $App.getSid(),
                    mid: mid,
                    size: f.fileSize,
                    offset: f.fileOffSet,
                    name: f.fileName,
                    type: f.type,
                    width: 58,
                    height: 58,
                    quality: 80
                    });
                    */
                    picNum++;
                }
                //console.log(imgUrl);
                var itemCode = isImgFlag ? $T.Utils.format(imgtemp, [imgUrl, f.fileName, picNum - 1]) : $T.Utils.format(notimgtemp, [self.getFileIcoClass(1, f.fileName)]);

                var previewType = self.checkFile(f.fileName, f.fileRealSize); //0表示不支持，1表示普通预览文件，2表示压缩包
                var downloadUrl = M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid);
                var previewUrl = M2012.ReadMail.View.FilePreview.getUrl({
                    type: "email",
                    downloadUrl: downloadUrl,
                    contextId: mid,
                    fileName: encodeURIComponent(f.fileName),
                    fileSize: f.fileRealSize
                }, self.model.get("currFid"));

                var preViewTemp = "<a {3} href='{0}' target = '_self' bh='{2}'>{1}</a>";

                var preViewHtml = "";

                if (previewType == 1) {
                    preViewHtml = $T.Utils.format(preViewTemp, ['javascript:;', '预览', 'readmail_previewattach1',index]);
                }
                if (previewType == 2) {
                    preViewHtml = $T.Utils.format(preViewTemp, [previewUrl, '打开', 'readmail_previewattach2',index]);
                }

                var liformatData = {
                    index: picNum - 1,
                    item: itemCode,
                    fileId: f.fileId,
                    fileLink: 'javascript:;',
                    fileName: $T.Html.encode(f.fileName),
                    fileSize: $T.Utils.getFileSizeText(f.fileRealSize),
                    downLoad: M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid),
                    preView: preViewHtml,
                    //mcloudlink: $User.isChinaMobileUser() ? $T.Utils.format(mcloudLink,{fileId: f.fileId, bh_savemcloud: 'readmail_savemcloud'}) : '', //彩云入口
                    saveWebDisk: 'javascript:'
                };
				
		
				
                if (isImgFlag) {
                    /*previewImg.push({
                    imgUrl: imgUrl,
                    fileName: f.fileName,
                    downLoad: M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid)
                    });*/
                    attachHtml.push($T.Utils.format(thisLiTemplate, liformatData));
                }
            }

            //self.previewImg = previewImg; //附件预览用

            if (attachHtml.join('') == '') {
                return '';
            } else {
                var formatData = { display: display, id: id, num: picNum, liList: attachHtml.join(''), downLoadAll: getDownloadAllUrl };
                var thisCode = $T.Utils.format(thisTemplate, formatData);
                return thisCode || '';
            }
        },

        /** 
        *附件全部下载
        */
        getDownloadAllUrl: function (mid) {
            var temp = 'http://' + location.host + "/RmWeb/mail?func=mbox:autoPack&sid={0}&mid={1}&taskId={2}&format=zip";
            var url = $T.Utils.format(temp, [$App.getSid(), mid, Math.ceil(Math.random() * 10000)]);
            return url;
        },

        /** 
        *附件全部存彩云
        */
        getAllSaveToDiskUrl: function () {
            var self = this;
            var title = self.get("title");
            var mid = self.get("mid");
            var url = self.getDownloadAllUrl(mid);
            var reg = /[\\\/:*?"<>|]/g;
            var fileName = title.replace(reg, "_").substring(0, 80) + ".zip";
            self.saveToDiskRequest(url, fileName);
        },

        /**
        * 全部存彩云/彩云命名
        */
        getAllSaveToDiskName: function(fileName){
            var reg = /[\\\/:*?"<>|]/g;
            return (fileName || '附件').replace(reg, "_").substring(0, 80) + ".zip";
        },

        /** 
        *附件存彩云/彩云
        */
        saveToDiskRequest: function (options) {
            var saveToDiskview = new M2012.UI.Dialog.SaveToDisk({
                fileSize :options.fileSize,
                fileName: options.fileName || '附件.zip',
                downloadUrl: options.url || null,
                saveToMcloud:options.saveToMcloud || null,
				isreadmail:true

            });
			if(options.saveToMcloud){
				//存彩云
				saveToDiskview.repareSaveToMcloud().on("success", function () {
					//存彩云成功记日志
					if (options.packSave) { 
						BH("readmail_savediskall");
					} else {
						BH("readmail_savedisk");
					}
				});
			} else {
				saveToDiskview.render().on("success", function () {
					//存彩云成功记日志
					if (options.packSave) { 
						BH("readmail_savediskall");
					} else {
						BH("readmail_savedisk");
					}
				});			
			}

        },


        initEvents: function (dataSource, mid) {
            var self = this;
            var data = dataSource.attachments;
            var allFileSizeZip = 0;
            for(var i= 0,l=data.length; i<l; i++){
                allFileSizeZip +=parseInt(data[i].fileRealSize);
            }
            var attachList = $(this.el).find("ul");
            var allsavetodisk = $(this.el).find("#allsavetodisk");
            var allsavemcloud = $(this.el).find("#readmail_allsavemcloud");
            var downloadAllUrl = self.getDownloadAllUrl(mid);
            var fileName = self.getAllSaveToDiskName(dataSource.subject);




            //全部存彩云
            allsavetodisk.click(function () {
                self.saveToDiskRequest({
                    url:downloadAllUrl,
                    fileName:fileName,
                    fileSize :allFileSizeZip,
                    packSave:true
                });
            });

            //全部存彩云
            allsavemcloud.click(function () {

                if (top.mcloudSaving) {
                    $('#icon_mcloudSaving').remove();
                    var saving = '<span id="icon_mcloudSaving"><img src="../images/global/load.gif" class="mr_5 ml_5" alt="">正在保存</span>';
                    $(this).parent('div').append(saving);
                    top.mcloudSaving = false;
                }


                self.saveToDiskRequest({
                    url: downloadAllUrl,
                    fileName: fileName,
                    packSave: true,
                    saveToMcloud: true
                });

            });
            function getUnitData(fileid) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].fileId == fileid) {
                        return data[i];
                        break;
                    }
                }
            }

            attachList.find("a[data-id]!=''").click(function () {
                var fileid = $(this).attr('data-id');
                var url = M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(getUnitData(fileid), mid);
                self.saveToDiskRequest({
                    url:url, 
                    fileName:getUnitData(fileid).fileName,
                    fileSize:getUnitData(fileid).fileRealSize
                });

            });

            //附件存彩云
            attachList.find("a[data-mcloudid]!=''").click(function(){
                var fileid = $(this).attr('data-mcloudid');

                if (top.mcloudSaving) {
                    $('#icon_mcloudSaving').remove();
                    var saving = '<span id="icon_mcloudSaving"><img src="../images/global/load.gif" class="mr_5 ml_5" alt="">正在保存</span>';
                    $(this).parent('span').parent('li').append(saving);
                    top.mcloudSaving = false;
                }

                var url = M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(getUnitData(fileid), mid);
                self.saveToDiskRequest({
                    url:url, 
                    fileName:getUnitData(fileid).fileName,
                    saveToMcloud:true
                });
            });

            attachList.find("a[index]!='',img[index]!=''").click(function () {
                var num = $(this).attr("index");
                if (num != "") {
                    if (typeof (top.focusImagesView) != "undefined") {
                        top.focusImagesView.render({ data: self.previewImg, index: parseInt(num) });
                    }else {
                        top.M139.registerJS("M2012.OnlinePreview.FocusImages.View", "packs/focusimages.html.pack.js?v=20130603");
                        var timeout = ($.browser.msie && ($.browser.version == 6)) ? 350 : 50; //ie6 延迟加载
                        setTimeout(function () {
                            top.M139.requireJS(['M2012.OnlinePreview.FocusImages.View'], function () {
                                top.focusImagesView = new top.M2012.OnlinePreview.FocusImages.View();
                                top.focusImagesView.render({ data: self.previewImg, index: parseInt(num) });
                            });
                        }, timeout);
                    }
                }
            });

        },

        /**
        * 获取会话邮件附件
        */
        getConversationAttach: function (title, attach, mid) {
            this.isSessionMail = true;
            return this.getSessionAttach(title, attach, mid);
        },

        /**
        * 获取邮件附件
        */
        getSessionAttach: function (title, attach, mid) {
            var self = this;
            var isSessionMail = this.isSessionMail ? true : false;
            var thisTemplate = isSessionMail ? self.template.conversationAttach.join('') : self.template.sessionAttach.join('');
            var liTemplate = self.template.sessionLi.join('');
            var mcloudLink = self.template.mcloudLink;
            var allMcloudLink = self.template.allMcloudLink;
            var num = attach.length;
            var attachHtml = [];
            var previewImg = []; //预览图片
            var imgNum = 0;
            var display = num > 0 ? "" : "style='display:none'";
            var hrefTemplate = "<a href='{0}' title = '{2}' ><i class='{1}'></i>{2}</a>";
            if ($User.isChinaMobileUser()) {
                //liTemplate = $T.Utils.format(liTemplate, [mcloudLink]);
                top.mcloudSaving = true;
				//liTemplate = liTemplate + mcloudLink;
			}
			for (var i = 0; i < num; i++) {
                var f = attach[i];
                var previewType = self.checkFile(f.fileName, f.fileRealSize); //0表示不支持，1表示普通预览文件，2表示压缩包
                var downloadUrl = M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid);
                var previewUrl = M2012.ReadMail.View.FilePreview.getUrl({
                    type: "email",
                    downloadUrl: encodeURIComponent(downloadUrl),
                    contextId: mid,
                    fileName: encodeURIComponent(f.fileName),
                    fileSize: f.fileRealSize
                }, self.model.get("currFid"));
                var preViewTemp = "<a href='{0}' target = '{4}' bh='{2}' {3}>{1}</a>";
                var preViewHtml = "";
                var target = "_blank";
                var previewbh;
                if (previewType == 1) {
                    var index = '';
                    var href = previewUrl;
                    //if (self.isPreviewImg(f.fileName)) {
                       // imgNum++;
                       // index = 'index=\"' + (imgNum - 1) + '\"';
                       // href = 'javascript:;';
                       // target = "_self";
                   // }
                    previewbh = isSessionMail ? 'cov_preview' : 'readmail_previewattach1';
                    preViewHtml = " | " + $T.Utils.format(preViewTemp, [href, '预览', previewbh, index, target]);
                }
                if (previewType == 2) {
                    previewbh = isSessionMail ? 'cov_preview' : 'readmail_previewattach2';
                    preViewHtml = " | " + $T.Utils.format(preViewTemp, [previewUrl, '打开', previewbh, '', target]);
                }
                var liformatData = {
                    fileId: f.fileId,
                    fileLink: 'javascript:;',
                    getFileIcoClass: self.getFileIcoClass(0, f.fileName),
                    fileName: $T.Html.encode(f.fileName),
                    fileSize: $T.Utils.getFileSizeText(f.fileRealSize),
                    downLoad: M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid),
                    preView: preViewHtml,
                    saveWebDisk: 'javascript:;',
                    bh_savemcloud: isSessionMail ? 'cov_savetomcloud' : 'readmail_savemcloud',
                    bh_download: isSessionMail ? 'cov_download' : 'readmail_download',
                    bh_savedisk: isSessionMail ? 'cov_savetodisk' : 'readmail_savedisk'
                }

                //保存预览图片数组
                var isPreiviewImg = self.isPreviewImg(f.fileName);
                if (isPreiviewImg) {
                    previewImg.push({
                        imgUrl: self.getImgUrl(f, mid),
                        fileName: f.fileName,
                        downLoad: M2012.ReadMail.View.FilePreview.getDownloadAttachUrl(f, mid)
                    });
                }
                attachHtml.push($T.Utils.format(liTemplate, liformatData));
            }

            self.previewImg = previewImg;

            //会话邮件区分
            var bh_allsavemclound = 'readmail_savemcloud';
            if(allMcloudLink){
                if(isSessionMail){
                    bh_allsavemclound = 'cov_allsavetomcloud';
                }
                allMcloudLink = $T.Utils.format(allMcloudLink,[bh_allsavemclound]);
            }
            return $T.Utils.format(thisTemplate, {
                num: num,
				mt_4 : num > 1 ? 'mt_4' : '',
                downLoadAll: self.getDownloadAllUrl(mid),
                data: attachHtml.join(''),
                displayall: num > 1 ? '' : 'style="display:none"',
                bh_downloadall:isSessionMail ? 'cov_alldownload' : 'readmail_downloadall',
                bh_savediskall:isSessionMail ? 'cov_allsavetodisk' : 'readmail_savediskall'
                //savemcloud: allMcloudLink
            });
        }
    }, {
	    
        /**
        * 获取附件url
        * @param {object} p 附件属性
        */
        getUrl: function (p, fid) {
            var ucDomain = domainList[1].webmail;
            var ssoSid = $App.getSid();
            var skinPath = "skin_green";
            var rmResourcePath = domainList.global.rmResourcePath;
            var diskInterface = domainList.global.diskInterface;
            var disk = domainList.global.disk;
            var uid = $User.getUid() || null;
            var previewUrl = "/m2012/html/onlinepreview/online_preview.html?fi={fileName}&mo={uid}&dl={downloadUrl}&sid={sid}&id={contextId}&rnd={rnd}&src={type}&loginName={loginName}&fid={fid}&comefrom={comefrom}&composeId={composeId}";
            previewUrl += "&skin={skin}";
            previewUrl += "&resourcePath={resourcePath}";
            previewUrl += "&diskservice={diskService}";
            previewUrl += "&filesize={fileSize}";
            previewUrl += "&disk={disk}";
            previewUrl = $T.Utils.format(previewUrl, {
                uid: uid,
                sid: ssoSid,
                rnd: Math.random(),
                skin: skinPath,
                resourcePath: encodeURIComponent(rmResourcePath),
                diskService: encodeURIComponent(diskInterface),
                type: p.type || "attach",
                fileName: encodeURIComponent(p.fileName),
                downloadUrl: encodeURIComponent(p.downloadUrl),
                contextId: p.contextId || "",
                fileSize: p.fileSize || "",
                encoding: 1,
                disk: disk,
                loginName: $User.getLoginName(),
                fid: fid,
                comefrom: p.comefrom || "readmail",
                composeId: p.composeId || ""
            });
            return previewUrl;
        },

        /** 
        *附件单个下载
        */
        getDownloadAttachUrl: function (file, mid) {
            return this.getPreViewUrl({
                mid: mid,
                offset: file.fileOffSet,
                size: file.fileSize,
                name: file.fileName,
                type: file.type,
                encoding: file.encoding ? file.encoding : 1
            });
        },

	    // 静态方法 file参数和业务逻辑都与对象实例没有关联
        getPreViewUrl: function (file) {
            if (file) {
                var url = 'http://' + location.host + "/RmWeb/view.do";
                return M139.Text.Url.makeUrl(url, {
                    func: 'attach:download',
                    mid: file.mid,
                    offset: file.offset,
                    size: file.size,
                    sid: $App.getSid(),
                    type: file.attachType || file.type,
                    encoding: file.encode || file.encoding
                }) + '&name=' + encodeURIComponent(file.name);
            } else {
                return '';
            }
        }
	}));

})(jQuery, _, M139);

