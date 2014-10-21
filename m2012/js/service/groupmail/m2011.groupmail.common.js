/**
 * @author Administrator
 */
jQuery.extend({
    //Ajax提交Xml
    /*
     config.url ;        请求连接[not null]
     config.dataType ;   ajax输出类型，默认为json
     config.data :       xml数据
     config.success:     请求成功後[not null]
     config.error:       请求失败
     config.async:       是否异步，默认为true
     config.contentType: 请求数据类型
     config.complete :   请求完成
     */
    post2: function(config, jq){
        if (config == null) {
            return;
        }
        var errorAction = config["error"] || Tool.handleError;
        
        (jq || jQuery).ajax({
            type: "POST",
            contentType: config["contentType"] || "application/x-www-form-urlencoded",
            async: (config["async"] === null ? true : config["async"]),
            dataType: config["dataType"] || "json",
            url: config["url"].match(/\?/) ? config["url"] + "&rn=" + Math.random() : config["url"] + "?rn=" + Math.random(),
            data: config["data"],
            success: function(result){
                if (result != null && result.resultCode == 999) {
                    Tool.invalidAction(); //登录超时
                    return;
                }
                if (config["success"]) {
                    config["success"].apply(result, arguments)
                }
            },
            error: errorAction,
            complete: config["complete"]
        });
    }
});

var MailOperating = {
    read: function(id, callback){
        this.operaing(id, 'read', callback)
    },
    cancelread: function(id, callback){
        this.operaing(id, 'cancelread', callback)
    },
    reject: function(id, callback){
        this.operaing(id, 'reject', callback)
    },
    cancelreject: function(id, callback){
        this.operaing(id, 'cancelreject', callback)
    },
    'delete': function(id, callback){
        this.operaing(id, 'delete', callback)
    },
    canceldelete: function(id, callback){
        this.operaing(id, 'canceldelete', callback)
    },
    forward: function(id, callback){
        this.operaing(id, 'forward', callback)
    },
    important: function(id, callback){
        this.operaing(id, 'important', callback)
    },
    cancelimportant: function(id, callback){
        this.operaing(id, 'cancelimportant', callback)
    },
    truncate: function(id, callback){
        this.operaing(id, 'truncate', callback)
    },
    reply: function(id, callback){
        this.operaing(id, 'reply', callback)
    },
    operaing: function(id, opt, callback){
        $.post2({
            url: "/GroupMail/GroupMailAPI/MailOperaing.ashx",
            data: {
                sid: top.UserData.ssoSid,
                id: id,
                action: opt
            },
            success: function(result){
                if (result.resultCode == 0) {
                    callback(true);
                    refreshMailsCount();
                }
                else {
                    callback(false);
                }
            },
            error: function(result){
                callback(false);
            }
        });
    },
    refreshMailsCount: function(callback){
    	// update by tkh
    	top.$App.trigger("userAttrChange", {
            callback: function () {
                top.$App.trigger("reduceGroupMail", {});
            }
        });
    	
        // $.post2({
            // url: "/GroupMail/GroupMailAPI/GetMailCount.ashx",
            // data: {
                // sid: top.UserData.ssoSid
            // },
            // success: function(result){
                // if (result.resultCode == 0) {
                    // try {
                        // top.asynGroupMail({
                            // totalMail: result.resultData.totalTopics,
                            // unread: result.resultData.totalNewTopics
                        // });
                        // if (callback) {
                            // callback.call(this, result.resultData.totalTopics, result.resultData.totalNewTopics);
                        // }
                    // } 
                    // catch (e) {
                    // }
                // }
            // }
        // });
    }
};

//投诉异步处理
var Spam = {
    Complaint: function(action, data, callback){
        $.post2({
            url: "/GroupMail/GroupMailAPI/SpamOper.ashx",
            data: {
                sid: top.UserData.ssoSid,
                gn: data.gn,
                gtype: data.gtype,
                tid: data.tid,
                fid: data.fid,
                ower: data.ower,
                content: data.content,
                action: action
            },
            success: function(result){
                if (result.resultCode == 0) {
                    if (result && result.resultData.result == 'OK') {
                        Tool.FF.alert(frameworkMessage.spam_complaint);
                        setTimeout(function(){
                            try {                                
                                top.FloatingFrame.close();
                            } 
                            catch (e) {
                            }
                        }, 3000);
                        
                    }
                    if (callback) {
                        callback.call(this, result);
                    }
                }
                else if(result.resultCode==1){
					Tool.FF.alert(result.errorMsg);
					setTimeout(function(){
                            try {                                
                                top.FloatingFrame.close();
                            } 
                            catch (e) {
                            }
                        }, 3000);
                    if (callback) {
                        callback.call(this, result);
                    }
                }
            },
            error: function(result){
                if (callback) {
                    callback.call(this, result);
                }
            }
        });
    }
}

var Tool = {
    handleError: function(XMLHttpRequest, textStatus, errorThrown){
        //alert("网络繁忙，请求失败，请重试！");
    },
    invalidAction: function(){
        window.location.href = "/Error/systemTip4.html";
    },
    FF: top.FloatingFrame,
    getHost: function(url){
        var host = "";
        if (!url) {
            url = window.location.href;
        }
        var match = url.match(/http:\/\/[^\/]+(?=\/)/g);
        if (match != null && match.length > 0) {
            host = match[0];
        }
        return host;
    },
    getUrlParamValue: function(url, param){
        var reg = new RegExp("(^|&|\\?|\\s)" + param + "\\s*=\\s*([^&]*?)(\\s|&|$)", "i");
        var match = reg.exec(url);
        if (match) {
            return match[2].replace(/[\x0f]/g, ";");
        }
        return "";
    },
    replace: function(str, oldStr, newStr){
        return str.replace(new RegExp(oldStr, 'g'), newStr);
    },
    execWithoutException: function(run, handleCatch){
        /*
         if(run){
         try {
         run();
         }
         catch(e){
         if(handleCatch){
         handleCatch(e);
         }
         }
         }*/
        //todo 测试不捕捉异常
        if (run) {
            run();
        }
    },
    arrayRemove: function(array, from, to){
        var rest = array.slice((to || from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    },
    indexOfArray: function(array, elt, from){
        var len = array.length;
        
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; from++) {
            if (from in array && array[from] === elt) {
                return from;
            }
        }
        return -1;
    },
    isEmptyArray: function(){
        var isEmpty = true;
        for (var i = 0; i < arguments.length; i++) {
            var arr = arguments[i];
            isEmpty = (arr == null || arr.length == 0);
            if (!isEmpty) {
                break;
            }
        }
        return isEmpty;
    },
    appendMenuHide: function(element){
        /*if (!top[hideMenuKey]) {
         top[hideMenuKey] = [];
         }
         top[hideMenuKey].push(element);*/
    },
    readMail: function(){
        var readUrl = "";
        var moduleName = "";
        
        var MM = top.MM;
        var RM = top.RM;
        var $ = top.$;
        
        this.init = function(){
        }
        this.getHtml = function(){
            this.module.refresh = true;
            var frmId = "frm" + moduleName;
            return "<iframe id=\"" + frmId + "\" name=\"" + frmId +
            "\" onload=\"RM.setTitle(this,'" +
            moduleName.replace(/\n/g, "\\n") +
            "')\" src='" +
            readUrl +
            "' style='width:100%;height:600px;' frameBorder='0'></iframe>";
        }
        this.show = function(url, title){
            url = url.replace(/&amp;/ig, "&");
            if (!/\//.test(url)) {
                url = "/coremail/fcg/ldmsapp?funcid=readlett&sid=" + sid + "&mid=" + url + "&fid=1&ord=0&desc=1";
            }
            readUrl = url;
            moduleName = "mail_" + Utils.queryString("mid", url);
            if (MM.exist(moduleName)) {
                MM.showModule(moduleName);
                MM.activeModule(moduleName);
                this.setTitle(document.getElementById("frm" + moduleName), moduleName);
            }
            else {
                var module = MM.createModule({
                    name: moduleName,
                    title: title,
                    type: "mail"
                });
                module.element.module = module;
            }
            
        }
        
        this.reload = function(){ //刷新
            var frame = this.container;
            frame.contentWindow.location.reload();
        }
        this.onClose = function(){
            this.module.refresh = true;
        }
        
        this.onShow = function(isLoaded){
            if (isLoaded) {
                if (this.module.refresh) {
                    this.module.refresh = false;
                    this.reload();
                }
            }
            setTimeout(function(){
                RM.onResize();
            }, 0);
        }
        this.onResize = function(){
            try {
                $(this.container).height($(document.body).height() - $(this.container).offset().top);
            } 
            catch (e) {
            }
        }
        
        this.setTitle = function(frm, moduleName){
            try {
                var dataTag = frm.contentWindow.document.getElementById("subject");
                
                if (this.module.title == "读邮件") {
                    top.FM.refresh();//重新加载文件夹分类，刷新计数
                    top.MB.easeAll();//清除所有邮件列表缓存
                }
                
                if (frm.parentNode.style.display != "none") {
                    MM.setTitle(dataTag.title, moduleName);
                }
            } 
            catch (e) {
            }
        }
        this.receipt = function(send){
            var param = getForm(FloatingFrame.current.jContent[0]);
            var save = document.getElementById("setasthistime").checked ? 1 : 0;
            
            if (save == "1") {
                param["setasthistime"] = 1;
            }
            if (send) {
                param["allow.x"] = 1;
                param["SendReceipt"] = 1;
            }
            else {
                param["deny.x"] = "1";
                param["SendReceipt"] = 1;
            }
            $.post("/cgi/ldmsapp", param, function(){
                FloatingFrame.close();
            })
        }
        this.updateCache = function(){ //清除所有已打开邮件的缓存
            for (elem in MM.modules) {
                var module = MM.modules[elem];
                if (module.type == "mail") {
                    if (module.close == true) {
                        MM.deleteModule(module.name);
                    }
                    else {
                        module.refresh = true;
                    }
                }
            }
        }
    }
    
}

//刷新群邮件列表列表
function refreshGroupMailList(){
    if (parent.frames['groupMail'] || parent.document.getElementById('groupMail')) {
        var win = parent.frames['groupMail'] || parent.document.getElementById('groupMail').contentWindow;
        if (win.MB) {
            win.MB.run();
        }else{
        	// add by tkh
        	top.$App.trigger('reflushGroupMailList',{});
        }
    }
}

function Behavior(actionId, thingId, moduleId){
    var obj = {
        thingId: (typeof(thingId) == 'undefined') ? 0 : thingId,
        actionId: actionId,
        moduleId: (typeof(moduleId) == 'undefined') ? 14 : moduleId
    }
    try {
        if (top.addBehaviorExt) 
            top.addBehaviorExt(obj)
    } 
    catch (e) {
    }
}

var frameworkMessage = {
    truncateMail: "彻底删除此邮件后将无法取回，您确定要彻底删除吗？ ",
    selectMail: "请选择邮件",
    closeWrite: "关闭写信页，未发送到内容将会丢失，是否关闭?",
    deleteGroup: "删除群,此群所有邮件记录会被彻底删除，您确定删除本群吗?",
    closeDetail: "关闭标签，未发送到内容将会丢失，是否关闭?",
    chooseGroup: "请选择一个群。",
    uploadError: "上传文件出错，请稍后再试。",
    groupMailTitle: "请输入群邮件主题。",
    groupMailContent: "请输入群邮件内容。",
    verifyCode: "请输入验证码",
    dataLoading: "数据读取中，请稍候操作",
    replyContent: "请先输入回复内容。",
    optFail: "操作失败",
    startTime: "开始时间必须小于结束时间",
    optSucess: "操作成功",
    joinGroup: "你不能再申请加入群，你最多只能加入{0}个群",
    m_joinMaxGroup: "你不能再加入群，你最多只能加入{0}个群",
    m_mobileError: "您输入的手机号码存在非移动手机号",
    m_mobileNull: "手机号不能为空",
    m_ps_select: "请先选择操作项",
    m_ps_del_select: "请先选择删除项",
    m_ps_ok_select: "您确定要同意加入选择的成员吗?",
    m_ps_re_select: "您确定要拒绝加入选择的成员吗?",
    m_ps_del_select: "您确定要删除选择的成员吗?",
    m_des_200: "群简介长度不能超过200个字符",
    m_logout_group: "您确定要退出本群吗?",
    app_text_len: "申请内容长度不能超过20个字符",
    attachUplpading: "附件上传中，请稍候。",
    spam_complaint: "提交成功，系统将尽快审核。感谢您的配合。",
	spam_write:"请勿发送包含色情、暴力、反动、违法犯罪、侵权等非法信息，否则139邮箱将取消您发送群邮件的权限"
}


/* >>>>>Begin menu.js */
/**
 * @tiexg 下拉菜单组件
 */
Menu = {
    MENU: null,
    lastMenu: null,
    highlightButton: function(liEle){
        var jqObj = $(liEle);
        var toolbar = $(".toolbar");
        return jqObj.hover(function(e){
            toolbar.find("li").removeClass("current");
            jqObj.addClass("current");
            //e.stopPropagation();
        }, function(e){
            toolbar.find("li").removeClass("current");
            //e.stopPropagation();
        });
    },
    createButton: function(text, callBack){
        var html = "<button>" +
        Utils.htmlEncode(text) +
        "</button>"
        html = $(html);
        return html.click(callBack);
    },
    createMenu: function(data){
        MENU = this;
        container = data["container"];
        var btn = document.createElement("button");
        $(btn).html("" +
        Utils.htmlEncode(data["text"]) +
        "<i class=\"more\"></i>");
        var ul = document.createElement("ul");
        if (data["id"]) {
            ul.id = data["id"];
        }
        ul.style.display = "none";
        //ul.style.position = "absolute";
        ul.className = "menu";
        //注册下拉列表隐藏
        //Tool.appendMenuHide(ul);
        container.append(btn);
        for (var i = 0; i < data["items"].length; i++) {
            var item = data["items"][i];
            var li = document.createElement("li");
            if (data["width"]) {
                li.style.width = data["width"];
            }
            li.innerHTML = item.text;
            ul.appendChild(li);
            if (item.click) {
                Utils.addEvent(li, "onclick", item.click);
            }
            else { //触发统一的itemClick
                (function(data, item){
                    Utils.addEvent(li, "onclick", function(){
                        data["itemClick"](item["data"])
                    })
                })(data, item);
            }
            Utils.addEvent(li, "onclick", this.hideMenu);
            
            Menu.highlightButton($(li));
        }
        container.append(ul);
        
        if (data["click"]) {
            Utils.addEvent(btn, "onclick", data["click"]);
            Utils.addEvent(btn, "onclick", this.showMenu(ul));
        }
        else {
            Utils.addEvent(btn, "onclick", this.showMenu(ul));
        }
    },
    showMenu: function(ul){
        return function(e){
            if (MENU.lastMenu) {
                MENU.lastMenu.style.display = "none";
            }
            $(".toolbar").each(function(i){
                this.style.zIndex = 0
            });
            var target = e.srcElement || e.target;
            target = Utils.findParent(target, "button")
            if ($(target).parent()[0]) 
                $(target).parent()[0].style.zIndex = 999;
            
            //计算按钮下面剩余空间高度
            
            var vheight = $(document).height() - ($(target).offset().top + $(target).height());
            var ulheight = $(ul).height();
            if (vheight > ulheight + 10) {
                ul.style.left = $(target).offset().left + "px";
                ul.style.top = target.offsetTop + $(target).outerHeight() + "px";
                
            }
            else {
                ul.style.left = $(target).offset().left + "px";
                ul.style.top = -($(ul).height()) + "px";
            }
            ul.style.display = '';
            
            MENU.lastMenu = ul;
            Utils.stopEvent();
            Utils.addEvent(document, "onclick", MENU.docClick);
        }
    },
    hideMenu: function(e, globalEvent){
        if (e) {
            var target = e.srcElement || e.target;
            var u = Utils.findParent(target, "ul");
            u.style.display = "none";
        }
        else 
            if (MENU.lastMenu) {
                MENU.lastMenu.style.display = "none";
            }
        MENU.lastMenu = null;
        if (globalEvent) {
            Utils.stopEvent(globalEvent);
        }
        Utils.removeEvent(document, "onclick", MENU.docClick);
    },
    docClick: function(){
        MENU.hideMenu();
    }
    
}

/* >>>>>End   menu.js */

/* >>>>>End   menu.js */
/* 不带图标的简朴风按钮组件
 * {
 *  id:"按钮元素id"，
 * 	text:"按钮文本"，
 *  title:"按钮提示文本"，
 *  click: Functon 按钮点击
 *  menu：Array 子菜单
 *       [
 *         {
 *            text:
 *            title:
 *            click:
 *            data:
 *         }
 *       ]
 *  itemClick:Function 默认的全局子菜单点击
 * }
 * */
SimpleMenuButton = {
	create:function(conf){
		SimpleMenuButton.init();
		var li = document.createElement("li");
		//按钮右边加间隔
		if(conf.rightSpace){
			li.className = "mr_10";			
		}
		if(conf.css){
			li.style.marginLeft="10px"	
		}
		if(conf.title)li.title = conf.title;
		if(conf.id)li.id = conf.id;
		var htmlCode = ['<a class="pageStyle" href="javascript:;" hidefocus="1" onclick="return false"><i class="l_border"></i><em>' + conf.text +'</em><i class="r_border"></i>'];
		
		//如果是下拉菜单，添加一个下拉箭头
		if(conf.menu){
			if(conf.click){
				//左右模式，又有按钮点击直接操作，又有下拉菜单,dom结构稍有不同
				htmlCode = ['<a hidefocus="1" onclick="return false"><i class="l_border"></i><span class="mr_15"><em class="sub">' + conf.text + '</em></span><i class="r_border"></i>'];
				if ($.browser.msie && $.browser.version == 8) {
				    htmlCode = ['<a hidefocus="1" onclick="return false"><i class="l_border"></i><span class="mr_15"><em class="sub" style="top:-2px;top:0px">' + conf.text + '</em></span><i class="r_border"></i>'];
				}
				htmlCode.push('<span class="lr_ctrl_line">|<i class="dot_ddl" ></i></span>');
			}else{
                htmlCode = ['<a class="pageStyle" href="javascript:;" hidefocus="1" onclick="return false"><i class="l_border"></i><em class="sub">' + conf.text +'</em><i class="r_border"></i>'];
                htmlCode.push('<i class="dot_ddl tool-jt"></i>');
			}
		}
		htmlCode.push('</a>');
		
		var menuClickList = {};
		if(conf.menu){
			var num=0;
			$.each(conf.menu,function(i,o){
				o.isLine&&num++;
			});
			//减去分割线的个数.....
			if(conf.menu.length-num>10){
				//菜单项大于10个加滚动条样式
			    htmlCode.push('<ul class="toolBar_listMenu toolBar_listMenu_Hscroll" style="display:none">');
			}else{
			    htmlCode.push('<ul class="toolBar_listMenu" style="display:none">');
			}
			//如果数量众多。可以考虑显示后再添加菜单项
			for(var i=0;i<conf.menu.length;i++){
				var item = conf.menu[i];
				menuClickList[i] = item.click;//保存点击函数列表
				if(item.isLine){
				    htmlCode.push('<li class="line"><span></span></li>');//分隔线
				}else{
					var theText = (item.text && item.text.encode()) || item.html;
					htmlCode.push('<li><a title="' + (item.title||"") + '" href="javascript:;" onclick="return false" hidefocus="1"><span data="' + (item.data||"") +'" rel="' + i +'">' + theText + '</span></a></li>');
				}
			}
			htmlCode.push('</ul>');
		}
		li.innerHTML = htmlCode.join("");
		$(li).click(function(e){
			var el = e.target;
			if(el.tagName == "SPAN"){
				var index = el.getAttribute("rel");
				if(index && menuClickList[index]){
					menuClickList[index]();
				}else if(conf.itemClick){
					conf.itemClick(el.getAttribute("data"));
				}
			}
		});
		
		var jLink = $(li).find("a:eq(0)");
		jLink.mousedown(function(){
			jLink.addClass("select");
		}).mouseup(function(){
			if(conf.menu && SimpleMenuButton.currentMenu && SimpleMenuButton.currentMenu.css("display")!="none"){
				return;
			}
			jLink.removeClass("select");
		}).click(conf.click);
		if(conf.menu){
			//左右模式
			if(conf.click){
				$(li).find("span.lr_ctrl_line").click(function(e){
					SimpleMenuButton.hideMenu();
					SimpleMenuButton.currentMenu = $(li).find("ul");
					SimpleMenuButton.showMenu();
					Utils.stopEvent(e);
				});
			}else{
				$(li).find("a:eq(0)").click(function(e){
					SimpleMenuButton.hideMenu();
					SimpleMenuButton.currentMenu = $(li).find("ul");
					SimpleMenuButton.showMenu();
					Utils.stopEvent(e);
				});
			}
		}
		return li;
	},
	init:function(){
		GlobalDomEvent.on("click",SimpleMenuButton.hideMenu);
		Utils.addEvent(document, "onclick", SimpleMenuButton.hideMenu);
		SimpleMenuButton.init = new Function();//只执行一次
	},
	showMenu:function(){
		try{
            SimpleMenuButton.currentMenu.show();
            SimpleMenuButton.currentMenu.css("visibility","");
            SimpleMenuButton.currentMenu.parent().find("a:eq(0)").addClass("select");
		}catch(e){}
	},
	hideMenu:function(){
		if(SimpleMenuButton.currentMenu){
			try{
                SimpleMenuButton.currentMenu.parent().find("a:eq(0)").removeClass("select");
                SimpleMenuButton.currentMenu.css("visibility","hidden");
                SimpleMenuButton.currentMenu.hide();
			}catch(e){}
		}
	},
	changeButtonText:function(li,text){
		//修改li的文本节点，同时不影响其它节点
		li.firstChild.childNodes[1].innerHTML = text;
	},
	currentMenu:null
};

if (!window.Utils) {
    window.Utils = {};
    Utils.loadSkinCss = function (path, doc, prefix, dir) {
        var isNewSkin = false;

        path = "skin_shibo";


        if (prefix) {
            path = path.replace("skin", prefix + "_skin");
        }
        if (!doc) {
            doc = document;
        }

        //加清皮肤样式缓存的版本号
        var version = "";
        if (top.SiteConfig && top.SiteConfig.skinCSSCacheVersion) {
            version = "?v=" + top.SiteConfig.skinCSSCacheVersion;
        }

        if (path.indexOf("new_") > -1) {//判断是新皮肤，则启用新路径
            isNewSkin = true;
            path = path.replace(/new_/gi, "");
            if (prefix == "player") {//网盘硬编码，清空网盘皮肤路径。从新皮肤目录请求样式文件
                dir = "";
            }
        }
        //alert("Path:"+path);
        var linkHref = top.rmResourcePath + "/css/" + path + ".css", skinFolder = "";
        if (isNewSkin) {//得到新皮肤文件夹，并替换路径
            skinFolder = path.replace(/\S*skin_(\S+)/gi, "$1");
            linkHref = linkHref.replace(/css/, "theme/" + skinFolder);
        }
        //alert("linkHref:"+linkHref);
        if (doc == top.document) {
            if (!window.cssTag) {
                document.write('<link id="skinLink" rel="stylesheet" type="text/css" href="{0}" />'.format(linkHref + version));
                window.cssTag = document.getElementById("skinLink");
            } else {
                window.cssTag.href = linkHref + version;
            }
        } else {

            var links = doc.getElementsByTagName("link");
            for (var i = 0; i < links.length; i++) {
                var l = links[i];
                if (l.getAttribute("skinnew"))
                    l.href = top.rmResourcePath + "/theme/" + path.replace("skin_", "") + "/skin.css" + version;
                else if (!l.href) {
                    if (dir)
                        l.href = dir + path + ".css";
                    else
                        l.href = linkHref + version;
                }
                else {
                    if (l.href.match(/skin_\w+.css(?:\?v=\d+)?$/)) {
                        var tempHref = l.href.replace(/skin_\w+/, path);
                        if (tempHref.indexOf(".css") == -1)
                            tempHref = tempHref + ".css";
                        //alert("tempHref_be:"+tempHref);
                        tempHref = tempHref.replace(/theme\/\S+\//gi, "theme/" + path.replace("skin_", "") + "/");//得到第后一次使用的皮肤路径
                        if (isNewSkin)//新皮肤路径
                        {
                            tempHref = tempHref.replace(/\/css\//, "/theme/" + skinFolder + "/");
                            if (doc.location.href.toLowerCase().indexOf("musicplayer") > -1)//播放器皮肤替换成新路径
                            {
                                tempHref = tempHref.replace(/newnetdisk3/gi, "coremail");
                            }
                        }
                        else//旧皮肤路径
                        {
                            tempHref = tempHref.replace(/\/theme\/\S+\//gi, "/css/");
                            if (doc.location.href.toLowerCase().indexOf("musicplayer") > -1)//播放器替换成旧皮肤
                            {
                                tempHref = tempHref.replace(/\/coremail\/\S+\//gi, "/newnetdisk3/css/");
                            }
                        }
                        //alert("tempHref_af:" + tempHref);
                        l.href = tempHref;
                    }
                }
            }
        }
    }


}

