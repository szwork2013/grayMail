function floatTips(parentObj){
    parentObj.css({'position':'static'});  //解决IE浮层bug --
    var comTip = $('body').find('div.comTip');
    if(comTip && comTip.length>0){
        comTip.remove();
    }
    var This = this;
    this.parentObj = parentObj;
    var htmlCode = '';
    htmlCode += '<div class="comTip" style="display:none; z-index:9999;">'
             + '<span class="comTip_dir"><i class="b">◆</i><i class="o">◆</i></span>'
             + '</div>';
    this.jContainer = $(htmlCode).appendTo(parentObj);
    this.setContent = function(conHtml){
        This.jContainer.append(conHtml);
    }
    this.fadeIn = function(time){
        This.jContainer.fadeIn(time);
    }
    this.fadeOut = function(time){
        This.jContainer.fadeOut(time);
        if(This.keep)clearTimeout(This.keep);
        This.keep = setTimeout(function(){
            This.remove();
        },time);
    }
    this.remove = function(){
        This.jContainer.remove();
    }
}

floatTips.prototype.tips = function(content){
    var This = this;
    var parentObjH = This.parentObj.height();
    This.jContainer.css({'margin-top': -parentObjH-32});
    var comMes = '<span class="comMes">'+ content +'</span>';
    This.setContent(comMes);
    This.fadeIn(200);
    if(This.timeOut) clearTimeout(This.timeOut);
    This.timeOut = setTimeout(function(){
        This.fadeOut(200);
    },5000);
}

floatTips.prototype.confirm = function(btn,content,callback,noCallback){
    var This = this;
	var btnIdOffset = btn.offset();
    var parentObjH = This.parentObj.height();
	var isIE6 = (/msie\s*6.0/i).test(navigator.userAgent);
    var comMes = '<div class="comMes redialPop c_333">'
               + '<div class="redialPopMes">'+ content +'</div>'
               + '<div class="ta_c">'
               + '<a href="javascript:;" class="btnNm btnNm-h20 btnYes" style="left:0">'
               + '<i class="but_lIco"></i>'
               + '<span class="but_bg-x">发送</span>'
               + '<i class="but_rIco"></i>'
               + '</a>&nbsp;&nbsp;'
               + '<a href="javascript:;" class="btnNm btnNm-h20 btnNo" style="left:0;margin-right:0;">'
               + '<i class="but_lIco"></i>'
               + '<span class="but_bg-x">取消</span>'
               + '<i class="but_rIco"></i>'
               + '</a>'
               + '</div></div>';
	This.jContainer.css({'left':btnIdOffset.left});
    if(btnIdOffset.top < parentObjH){
        This.jContainer.find('.comTip_dir').addClass('comTip_dir2').removeClass('comTip_dir').html('<i class="b2">◆</i><i class="o2">◆</i>');
        This.jContainer.css({'top':btnIdOffset.top+btn.height()+5});
    }
    This.jContainer.addClass('redialPopBar');
	isIE6 && (comMes += '<iframe frameborder="0" style="position:absolute;z-index:-1;left:0;top:0;"></iframe>');
	This.setContent(comMes);
	isIE6 && This.jContainer.find("iframe").css({width: This.jContainer.width(), height: This.jContainer.height()});
    This.fadeIn(200);
	if (btnIdOffset.top > parentObjH) {
		//This.jContainer.css({'margin-top':-parentObjH-This.jContainer.height()-5});
		This.jContainer.css({"top": btnIdOffset.top - This.jContainer.height() - 5});
	}
    $(".btnNm", This.jContainer).click(function(){
        This.remove();
        try {
            if ($(this).hasClass("btnYes")) {
				if (callback) callback();
			} else if ($(this).hasClass("btnNo")) {
				if (noCallback) noCallback();
			}
			return false;
        } catch (e) { }
    });
    return false;
}

