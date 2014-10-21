/******************************* **************************************************************
 通讯录头像上传组件
 2014.08.04
 AeroJin 
 ***********************************************************************************************/
;
(function ($, _, M139) {
    M139.namespace("M2012.Addr.ImageUpload", function (options) {
        var _this = this;

        this.image = options.image;
        this.serialId = options.serialId || 0;
        this.callback = options.callback;
        this.upLoadFile = options.upLoadFile;
        this.funName = options.funName || 'myPicture';

        this.TIP = {
			PICUPLOAD_ERROR :"图像格式不符合规范!",
			SUCCESS : "您的头像已保存",
			FIAL : "您的头像保存失败"
        };

        this.init = function() {
            this.ui = {};
            this.ui.body = $('body');
            this.ui.file = this.upLoadFile;
            this.ui.parent = this.ui.file.parent();
            this.ui.form = $('<form id="frmUpload" name="frmUpload" method="post" enctype="multipart/form-data" action="" target="ifrmReturnInfo"></form>');
            this.ui.iframe = $('<iframe id="ifrmReturnInfo" name="ifrmReturnInfo" scrolling="no" height="0" width="0" frameborder="0" src="empty.html"></iframe>');

            this.ui.file.attr('name', 'fileUpload');
            this.ui.form.attr("action", this.getUploadUrl());
            this.ui.body.append(this.ui.form);
            this.ui.body.append(this.ui.iframe);
            this.regEvent();
        };

        this.regEvent = function() {
        	var _this = this;

        	window[this.funName] = function(result) {
        		var code = result.code || "";
				var msg = result.msg || "";
				
				if (code == "S_OK") {
					var url = '{0}?rd={1}'.format(msg, Math.random());	
					var imageUrl = (new top.M2012.Contacts.ContactsInfo({ImageUrl: url})).ImageUrl;
					
					if(_this.image){
						_this.image.attr('src', imageUrl);
					}

					if(_this.callback){
						_this.callback({imagePath: msg, imageUrl: imageUrl});
					}
					
					_this.ui.parent.append(_this.ui.file);
					top.M139.UI.TipMessage.show(_this.TIP.SUCCESS,{ delay : 2000});
				} else {
                    _this.ui.parent.append(_this.ui.file);
					top.M139.UI.TipMessage.show(msg,{ delay : 2000, className: 'msgYellow'});
				}
        	};

        	this.ui.file.change(function(){
        		var fileName = $(this).val();

        		if(_this.check(fileName)){
        			_this.ui.form.append(_this.ui.file);
        			_this.ui.form.submit();
        		}
        	});
        };

        this.check = function(fileName) {
        	if (!/\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName)) {
				top.M139.UI.TipMessage.show(this.TIP.PICUPLOAD_ERROR,{delay: 2000, className: 'msgYellow'});
				this.ui.form.reset();
				return false;
			}

			return true;
        };

        //获取上传地址，测试环境与生产环境不同
        this.getUploadUrl = function() {
        	if(!this.url){
	        	var domain = document.domain == "10086.cn" ? top.getDomain("rebuildDomain") : '';
	        	this.url = "{0}/bmail/s?func=contact:uploadImage&sid={1}&serialId={2}&type=1&callback={3}";
	        	this.url = this.url.format(domain, top.sid, this.serialId, this.funName);
	        }

			return this.url;
        };

        this.init();
    });
})(jQuery, _, M139);