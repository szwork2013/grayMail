function ReadGroupMail(){
	var moduleName="";
	var groupMailId;
	var frameUrl;
	this.init = function() { };
	this.getHtml = function() {
	    var frmId = moduleName;
	    return "<iframe id=\"" + frmId + "\" name=\"" + frmId + "\" src='" + frameUrl + "' style='width:100%;height:600px;' frameBorder='0'></iframe>";
	}
	this.show = function (param) {
	    /*param={
          Uncaught TypeError: Cannot call method 'show' of undefined
          id: data.id,//群邮件id
          url: url,//该iframe的地址
          title: data.subject
      }*/
	    if (Utils.PageisTimeOut(true)) {
            return;
        }
	
	
	    groupMailId = param.id;
	    moduleName = "groupMail_" + param.id;
	    frameUrl = param.url;
	    var title = param.title || "群邮件";
	    if ($App.getTabByName(moduleName)) {
	        $App.show(moduleName);
	        /*try{
	            //刷新邮件
	            if (MM.modules[moduleName].container.src != param.url) {
	                MM.modules[moduleName].container.src = param.url;
	            }
	        }catch(e){}
	        MM.activeModule(moduleName);*/
	    } else {
	        /*var module = MM.createModule({
	            name: moduleName,
	            title: title,
	            type: "groupMail"
	        });
	        module.element.module = module;
	        var frameView = new FrameView({
	            parent: $App.getView("tabpage"),
	            param: param
	        });
	        this.showPage({ name: moduleName, view: frameView });*/
	        $App.showUrl(frameUrl,title);
	    }
	}
	this.onClose = function() {
	    try {
	        var oncancel = this.container.contentWindow.onModuleClose();
	        if (oncancel !== false) {
	            this.container.isClosed = true;
	        }
	        return oncancel;
	    } catch (e) { }
	}

	this.onShow = function(isLoaded) {
	    var This = this;
	    setTimeout(function() { This.onResize(); }, 0);
	    try {
	        //实现刷新
	        if (this.container.isClosed) {
	            this.container.src = this.container.src.replace(/(?:&rnd=[^&]+)?$/, "&rnd=" + Math.random());
	            this.container.isClosed = false;
	        }
	        this.container.contentWindow.onModuleShow();
	    } catch (e) { }
	}
	this.onResize = function() {
	    try {
	        $(this.container).height($(document.body).height() - 75);
	    } catch (e) { }
	}
	this.setTitle=function(frm,moduleName){
		/*
		if(frm.parentNode.style.display!="none"){
			MM.setTitle(dataTag.title,moduleName);
		}*/
	}
	this.closeGroupMail = function(id) {
	    if (id) {
	        var moduleName = "groupMail_" + id;
	        Main.closeCurrentModule(moduleName);
	    } else {
	        Main.closeCurrentModule();
	    }
	}
}
//群邮件 写信
CGM = {
    moduleName: "composeGroupMail",
    moduleCount: 0,
    getHtml: function() {
        var url = this.param.url;
        var frameName = "composeGroupMail_" + Math.random();
        var frame = $("<iframe style='width:100%;height:560px' id='{0}' name='{0}' frameborder='0'></iframe>".format(frameName))[0];
        setTimeout(function() { frame.src = url; }, 0);
        return frame;
    },
    param: null,
    show: function(param) {
        if (Utils.PageisTimeOut(true)) {
            return;
        }
    
        /*this.param = param;
        if (MM.exist(this.moduleName)) {
            MM.showModule(this.moduleName);
            MM.activeModule(this.moduleName);
        } else {
            var module = MM.createModule({
                name: this.moduleName + (this.moduleCount++),
                title: param.title || "写群邮件",
                type: "composeGroupMail"
            });
        }*/
        if (param && param.url) {
            $App.show("groupMailWrite", "&urlReplace=" + param.url);
        } else {
            $App.show("groupMailWrite");
        }
    },
    onClose: function() {
        try {
            return this.container.contentWindow.onModuleClose();
        } catch (e) { }
    },
    onShow: function() {
        try {
            this.container.contentWindow.onModuleShow();
        } catch (e) { }
        try {
            this.onResize();
        } catch (e) { }
    },
    onResize: function() {
        $(this.container).height($(document.body).height() - 75);
    }
}

top.RGM = new ReadGroupMail();