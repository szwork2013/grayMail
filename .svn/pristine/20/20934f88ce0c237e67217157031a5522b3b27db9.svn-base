/**   
* @fileOverview 普通模式读信
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *普通模式读信
    */

    M139.namespace("M2012.OnlinePreview.Focusimagesemail.Model", Backbone.Model.extend({

        defaults: {
            currentImg: 1, //当前的图片
            imgNum:5,//默认显示5张缩略图
            imgOffsetWidth:72,//缩略图之间的距离
            loadImageStatus: 0//从附件夹、彩云入口进来       >50张图片时  图片分批加载 每次加载50张
        },
        callApi: M139.RichMail.API.call,
        getImageAttach: function (callback) { //获取图片附件列表
            var self = this;
            var index = this.get("loadImageStatus")
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
            this.callApi("attach:listAttachments", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
        getDiskDownloadImg: function (callback) {//获取彩云里的大图列表
            var self = this;
            var index = this.get("loadImageStatus")
            var data = {
                userNumber: top.UserData.userNumber,
                folderid: "",
                fileid: dataObj.fileid,
                downname: escape(dataObj.filename)
            };
            this.callApi("disk:download", data, function (result) {
                result = result.responseData;
                if (result.code && result.code == 'S_OK') {
                    callback && callback(result["var"]);
                }
            })
        },
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
        logger: function (options) {
            var url = options.src;
            var loghelper = M139.Logger || top.M139.Logger;
            loghelper.sendClientLog({
                level: options.level || "INFO",
                name: "RichMailHttpClient",
                url: url,
                errorMsg: options.msg || "NULL",
                responseText: options.responseText || ''
            });
        }



    }));

})(jQuery, _, M139);
