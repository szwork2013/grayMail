
/* >>>>>Begin balloon.js */
/**
 * @author Administrator
 */
var Balloon = {
    show: function(text, direction, elem, width, offset) {
        var div = document.createElement("div");
        div.className = "FTUTip";
        var template = "<BLOCKQUOTE style='WIDTH: {width}px'>{text}</BLOCKQUOTE><BUTTON class='wsSmallCoolCloseButton' onclick='Balloon.close(this)'></BUTTON><DIV class='balloonArrow {direction}'></DIV></DIV>";

        var s = String.format(template, {
            text: text,
            direction: direction,
            width: width
        });

        div.innerHTML = s;

        var pos = Utils.findPosition(elem);
        document.body.appendChild(div);
        if (!offset) {
            offset = { x: 0, y: 0 };
        }

        switch (direction) {
            case "left":
                div.style.left = (pos[0] + Number(elem.offsetWidth) + offset["x"]) + "px";
                div.style.top = (pos[1] + offset["y"] - 15) + "px";
                break;
            case "right":
                div.style.left = (pos[0] - div.offsetWidth + offset["x"]) + "px";
                div.style.top = (pos[1] + offset["y"] - 15) + "px";
                break;
            case "top":
                div.style.left = pos[0] + "px";
                div.style.top = (pos[1] + elem.offsetHeight + 10 + offset["y"]) + "px";
                break;
            case "bottom":
                div.style.left = pos[0] + "px";
                div.style.top = (pos[1] - div.offsetHeight - 10 + offset["y"]) + "px";
                break;

        }



    },
    close: function(sender) {
        document.body.removeChild(sender.parentNode);
    }

};
var Tooltip={
	tip:null,
	register:function(target,win){
		if(!win){
			win=window;
		}
	    var title=target.title;
	    target.title="";
	    var div=win.$("<div style='display:none' class='tooltip'></div>");
	    div.html(title);
	    $(target).hover(showTip,hideTip);
	    $(target).click(hideTip);
	    function showTip(){
	        Tooltip.show(div,target,win);
	    }
	    function hideTip(){
	        Tooltip.hide(div);
	    }
	},
	show:function(div,target,win){
		if(!win){
			win=window;
		}
		div.appendTo(win.document.body);
	        var offset=win.$(target).offset();
	        div.show();
			var left=offset.left;
			var top=offset.top-div.height()-win.$(target).height();
			if(offset.top<300){
				top=offset.top+win.$(target).height();
			}
			if(offset.left>400){
				left=offset.left-div.width()
			}
	        div.css({
	            left:left,
	            top:top
	        });
	},
	hide: function(div){
		div.hide();
	},
	guide:function(target,text,win){
		if(!win){
			win=window;
		}
		var div=win.$("<div style='display:none' class='tooltip'></div>");
	    div.html(text);
		Tooltip.show(div,target,win);
	}
};

/* >>>>>End   balloon.js */


/* >>>>>Begin dragmanager.js */
/*本类实现对元素的拖放，通用代码,依赖于工具类Utils.js(为了兼容firefox的event)*/
	function DragManager(o,handleObj){
		this.onDragStart=null;
		this.onDragMove=null;
		this.onDragEnd=null;
		this.orignX=0;
		this.orignY=0;
		var min_x=0,min_y=0,
		max_x=$(document.body).width()-$(o).width(),
		max_y=$(document.body).height()-$(o).height();
		var manager=this;
		var offset=[];
		//o.attachEvent("onmousedown",drag_mouseDown);
		if(handleObj){
		    handleObj.onmousedown=drag_mouseDown;
		}else{
		    o.onmousedown=drag_mouseDown;
		}
		this.startDrag=function(e){
			var x,y;
			e=Utils.getEvent();
			if(window.event){
				x=event.clientX+document.body.scrollLeft;
				y=event.clientY+document.body.scrollTop;
			}else{
				x=e.pageX;
				y=e.pageY;
			}
	
	
			if (o.setCapture) {	//在窗口以外也能响应鼠标事件
				o.setCapture();
			}else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
			}
					
			var postion=Utils.findPosition(o);
			if(postion[0]==0){
				offset=[0,0];
			}else{
				offset=[x-postion[0],y-postion[1]];
			}

			//window.status=x+","+y;
			if(manager.onDragStart){
				manager.onDragStart({x:x,y:y});
			}
			Utils.addEvent(document,"onmousemove",drag_mouseMove);
			Utils.addEvent(document,"onmouseup",drag_mouseUp);
			Utils.stopEvent(e);//阻止事件泡冒
		}
		this.stopDrag=function(){
			if (o.releaseCapture){
				o.releaseCapture();
			}
			else if (window.captureEvents) {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}

			if(manager.onDragEnd){
				manager.onDragEnd();
			}
			
			Utils.removeEvent(document,"onmousemove",drag_mouseMove);
			Utils.removeEvent(document,"onmouseup",drag_mouseUp);

		}
		
		function drag_mouseMove(e){
			var newX,newY;
			if(window.event){
				newX=event.clientX+document.body.scrollLeft;
				newY=event.clientY+document.body.scrollTop;
			}else{
				newX=e.pageX;
				newY=e.pageY;
			}
			var _x=newX-offset[0];
			var _y=newY-offset[1];
			if(_x<0){
			    _x=0;
			}else if(_x>max_x){
			    _x=max_x;
			}
			if(_y<0){
			    _y=0;
			}else if(_y>max_y){
			    _y=max_y;
			}
			o.style.left = _x+"px";
			o.style.top = _y+"px";
			
			if(manager.onDragMove){
				manager.onDragMove({x:newX,y:newY});
			}
		}
		function drag_mouseDown(e){
			manager.startDrag(e);
		}
		function drag_mouseUp(e){
			manager.stopDrag(e);
		}
		//碰撞检测
		this.hitTest=function(o, l){
			function getOffset(o){
				for(var r = {l: o.offsetLeft, t: o.offsetTop, r: o.offsetWidth, b: o.offsetHeight};
				o = o.offsetParent; r.l += o.offsetLeft, r.t += o.offsetTop);
				return r.r += r.l, r.b += r.t, r;
			}
			for(var b, s, r = [], a = getOffset(o), j = isNaN(l.length), i = (j ? l = [l] : l).length; i;
			b = getOffset(l[--i]), (a.l == b.l || (a.l > b.l ? a.l <= b.r : b.l <= a.r))
			&& (a.t == b.t || (a.t > b.t ? a.t <= b.b : b.t <= a.b)) && (r[r.length] = l[i]));
			return j ? !!r.length : r;
		};
		
	};
/* >>>>>End   dragmanager.js */


/* >>>>>Begin FloatingFrame.js */
function FloatingFrame(showGlass){
    var This=this;
    var htmlCode="";
    htmlCode+='<div class="winTip" style="z-index:1024;position:absolute;">';
    htmlCode+=  '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
    htmlCode+=      '<tr>';
    htmlCode+=          '<td class="wtTL">&nbsp;&nbsp;<span class="do"></span><b class="doN">#title#</b> <a href="javascript:;" class="clR CloseButton"></a></td>';
    htmlCode+=          '<td class="wtTC">&nbsp;</td>';
    htmlCode+=          '<td class="wtTR">&nbsp;</td>';
    htmlCode+=      '</tr>';
    htmlCode+=      '<tr>';
    htmlCode+=          '<td colspan="3" style="padding-right:2px;">';
    htmlCode+=              '<div class="winTipC">';
    htmlCode+=                  '<div class="wTipCont">';
    htmlCode+=                  '</div>';
    htmlCode+=              '</div>';
    htmlCode+=          '</td>';
    htmlCode+=      '</tr>';
    htmlCode+=  '</table>';
    htmlCode+='</div>';
      
    var jContainer=$(htmlCode).appendTo(document.body);
    var jTitle=jContainer.find("tr:eq(0)");
    var jContent=jContainer.find(".wTipCont");
    var behindIFrame=null;
    var tmpPoint;
    this.showGlass=(showGlass==false?false:true);
    if(!this.showGlass)behindIFrame=new BehindIFrame(jContainer[0]);
    this.jContainer=jContainer;
    this.jTitle=jTitle;
    this.jContent=jContent;
    this.closeButton=jContainer.find(".CloseButton");
    this.setTitle = function(text) {
        jContainer.find(".doN").text(text);
    };

    this.setContent = function(html) {
        this.jContent.html("");
        if (typeof (html) == "string") {
            this.jContent.html(html);
        } else if (typeof (html) == "object") {
            this.jContent.append(html);
        }
    };
    this.show = function() {
        jContainer.show();
        jContainer.css({ top: 0, left: 0 });
        //重设高度
        var top = ($(document.body).height() - jContainer.height()) / 2;
        var left = ($(document.body).width() - jContainer.width()) / 2;
        if (window != window.top) {
            try {
                var offset = $(frameElement).offset();
                top -= offset.top / 2;
                top -= offset.left / 2;
            } catch (e) { }
        }
        if (top < 0) top = 0;
        if (left < 0) left = 0;
        jContainer.css({ top: top, left: left });

        if (behindIFrame) behindIFrame.resetAndShow();
        if (this.showGlass) {
            Glass.show();
        }
    };
    this.hide = function() {
        Glass.hide();
        jContainer.hide();
        if (behindIFrame) behindIFrame.hide();
    };
    this.close = function() {
        this.hide();
        dispose();
    };

    init();
    var isMousedown=false;
    function init(){
        DM = new DragManager(jContainer[0], jTitle[0]);
    }
    function dispose(){
        jContainer.remove();
        if(behindIFrame)behindIFrame.remove();
    }
}
FloatingFrame.alert = function(message, callback) {
    if (window != window.top) return window.top.FloatingFrame.alert(message, callback);
    var ff = new FloatingFrame();
    message = message.replace(/(?:\\r)?\\n/g, "<br>");
    var htmlCode = "";
    htmlCode += '<ul>';
    htmlCode += '<li class="wTc"><b class="wcDot"></b><span class="wcDot1">' + message + '</span></li>';
    htmlCode += '<li class="wTcBut"><a href="javascript:;" class="but YesButton">确&nbsp;定</a></li>';
    htmlCode += '</ul>';
    ff.setTitle("系统提示");
    ff.setContent(htmlCode);
    setTimeout(function() {
        $(".YesButton", ff.jContainer).focus();
    }, 0);
    $(".CloseButton,.YesButton", ff.jContainer).click(
        function() {
            ff.close();
            try {
                if (callback) callback();
            } catch (e) { }
            return false;
        }
    );
    ff.show();
};
FloatingFrame.confirm = function(message, callback, cancelCallback, isYesAndNo) {
    if (window != window.top) return window.top.FloatingFrame.confirm(message, callback, cancelCallback, isYesAndNo);
    var ff = new FloatingFrame();
    var htmlCode = "";
    htmlCode += '<ul>';
    htmlCode += '<li class="wTc"><b class="wcDot"></b><span class="wcDot1">' + message + '</span></li>';
    if (isYesAndNo) {
        htmlCode += '<li class="wTcBut"><a href="javascript:;" class="but YesButton">是</a> <a href="javascript:;" class="but CancelButton">否</a></li>';
    } else {
        htmlCode += '<li class="wTcBut"><a href="javascript:;" class="but YesButton">确&nbsp;定</a> <a href="javascript:;" class="but CancelButton">取&nbsp;消</a></li>';
    }
    htmlCode += '</ul>';
    ff.setTitle("系统提示");
    ff.setContent(htmlCode);
    setTimeout(function() {
        $(".YesButton", ff.jContainer).focus();
    }, 0);
    $(".CloseButton,.YesButton,.CancelButton", ff.jContainer).click(
        function() {
            ff.close();
            try {
                if ($(this).hasClass("YesButton")) {
                    if (callback) callback();
                } else {
                    if (cancelCallback) cancelCallback(!$(this).hasClass("CancelButton"));
                }
            } catch (e) { }
            return false;
        }
    );
    ff.show();
};
FloatingFrame.prompt = function(title, message, defaultValue, callback, maxLength) {
    if (window != window.top) return window.top.FloatingFrame.prompt(title, message, defaultValue, callback, maxLength);
    try {
        if (callback && callback.constructor == Number) {
            maxLength = callback;
        }
        if (defaultValue.constructor == Function) {
            callback = defaultValue;
            defaultValue = "";
        }
    } catch (e) { }
    var ff = new FloatingFrame();
    var htmlCode = "";
    htmlCode += '<ul>';
    htmlCode += '<li class="wTc">' + message + '</li>';
    htmlCode += '<li class="wTcN"><input type="text" style="width:220px" class="inp" maxLength="{0}" /></li>';
    htmlCode += '<li class="wTcBut"><a href="javascript:;" class="but YesButton">确&nbsp;定</a> <a href="javascript:;" class="but CancelButton">取&nbsp;消</a></li>';
    htmlCode += '</ul>';
    htmlCode = htmlCode.format(maxLength ? maxLength : "");
    ff.setTitle(title);
    ff.setContent(htmlCode);
    setTimeout(function() {
        try {
            $(".inp", ff.jContainer).focus();
        } catch (e) { }
    }, 0);

    var $textbox = $("input", ff.jContainer);
    $textbox.val(defaultValue);
    $textbox.keypress(
        function(evt) {
            evt = evt || event;
            if (evt.keyCode == 13) {
                ff.jContainer.find(".YesButton").click();
            }
        }
    );
    $(".CloseButton,.YesButton,.CancelButton", ff.jContainer).click(
        function() {
            try {
                var text = ff.jContainer.find("input").val();
                ff.close();
                if ($(this).hasClass("YesButton") && callback) callback(text);
            } catch (e) { }
            return false;
        }
    );
    ff.show();
    $textbox[0].select();
};
//玻璃层
var Glass = {
    _glass: null,
    isShow: false,
    show: function() {
        if (!this._glass) {
            this._glass = $("<div style='width:100%;height:100%' class='glass'><{0}></{0}></div>".format(document.all ? "iframe" : "div")).appendTo(document.body);
            var body = $(document.body);
        }
        this._glass.show();
        this.isShow = true;
    },
    hide: function() {
        if (this._glass) this._glass.hide();
        this.isShow = false;
    }
};
//一个iframe,用来放置在浮动层的后面,可以挡住可恶的下拉框
function BehindIFrame(host){
    var jIframe=$(host.ownerDocument.createElement("iframe")).appendTo(host.ownerDocument.body);
    var jHost=$(host);
    jIframe.css({zIndex:"1023",display:"none",position:"absolute"});
    this.reset = function() {
        jIframe.css(
            {
                top: jHost.css("top"),
                left: jHost.css("left"),
                width: jHost.width(),
                height: jHost.height()
            }
        );
    };
    this.resetAndShow = function() {
        this.reset();
        jIframe.show();
    };
    this.hide = function() {
        jIframe.hide();
    };
    this.remove = function() {
        jIframe.remove();
    };
}
FloatingFrame.current=null;
FloatingFrame.show = function(html, title, width, height) {
    var ff = new FloatingFrame();
    FloatingFrame.current = ff;
    ff.setContent(html);
    $(".CloseButton")[0].focus();
    ff.setTitle(title || "");
    ff.jContainer.find(".CloseButton").click(
        function() {
            ff.close();
            return false;
        }
    );
    ff.show();
    if (width) {
        ff.jContainer.width(width + "px");
    }
    return ff;
};

FloatingFrame.open = function(title, src, width, height, fixSize) {
    if (window != window.top) return window.top.FloatingFrame.open(title, src, width, height, fixSize);
    var ff = new FloatingFrame();
    FloatingFrame.current = ff;
    if (fixSize) {
        ff.jContent = ff.jContent.parent();
        ff.jContent.css("padding", "0px");
        ff.jContent.html("");
    }
    var html = String.format("<iframe src={0} frameBorder='0' scrolling=no style='width:100%;height:{2}px;'></iframe>",
			[src, width, height]);
    ff.setContent(html);
    $(".CloseButton")[0].focus();
    ff.setTitle(title || "");
    ff.jContainer.find(".CloseButton").click(
        function() {
            ff.close();
            return false;
        }
    );
    ff.show();
    if (width) {
        ff.jContainer.width(width + "px");
    }
    return ff;
};
FloatingFrame.setWidth = function(width) {
    try{
        FloatingFrame.current.jContainer.width(width);
    }catch(e){}
};
FloatingFrame.setHeight = function(height) {
    try{
        FloatingFrame.current.jContent.find("iframe").css("height", height);
    }catch(e){}
};
FloatingFrame.close = function() {
    FloatingFrame.current.close();
};
FloatingFrame.clearContainer = function() {
    FloatingFrame.current.jContainer.find("tr:eq(0)").remove();
    FloatingFrame.current.jContainer.find(".winTipC").css("border", "0px").css("margin", "0px").css("padding", "0px");
    FloatingFrame.current.jContainer.find(".wTipCont").css("margin", "0px").css("padding", "0px");

};



/* >>>>>End   FloatingFrame.js */


/* >>>>>Begin menu.js */
/**
 * @tiexg 下拉菜单组件
 */
Menu = {
    MENU: null,
    lastMenu: null,
    createContainer: function(isdom){
        var container = document.createElement("ul");
        return isdom?container:$(container);
    },
    highlightButton : function(liEle){
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
    createLiButton: function(text, className, callBack){
        var html = "<li class='" + className + "'>"
            + "<div class=\"btnToolbar\">"
            + "<span class=\"l\"></span><span class=\"m\"><i></i>"
            + Utils.htmlEncode(text)
            + "<i class=\"more\"></i></span><span class=\"r\"></span></div></li>";
        html = $(html);
        return Menu.highlightButton(html.click(callBack));
    },
    createMenu: function(data, styles) {
        MENU = this;
        if (!styles) {
            styles = {		//样式表
                cls : ""
            };
        }
        var container = document.createElement("li");
        if (data["name"]) {
            container.id = data["name"];
        }

		$(container).addClass("hasMenu").addClass(styles.cls)
		    .append("<div class=\"btnToolbar\"><span class=\"l\"></span><span class=\"m\"><i></i>"
		        + Utils.htmlEncode(data["text"])
		        + "<i class=\"more\"></i></span><span class=\"r\"></span></div>");
        //return container;
        var ul = document.createElement("ul");
        //ul.style.display = "none";
        ul.style.position = "absolute";
        ul.className = "menu";
        //注册下拉列表隐藏
        Tool.appendMenuHide(ul);
        
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
            } else {	//触发统一的itemClick
                (function(data, item) {
                    Utils.addEvent(li, "onclick", function() {
                        data["itemClick"](item["data"])
                    })
                })(data, item);
            }            
            Utils.addEvent(li, "onclick", this.hideMenu);
            
            Menu.highlightButton($(li));            
            /*
            Utils.addEvent(li, "onmouseover", function(e) {
                var target = e.srcElement || e.target;
            });
            Utils.addEvent(li, "onmouseout", function(e) {
                var target = e.srcElement || e.target;
            });*/
        }
        container.appendChild(ul);
        if (data["click"]) {
            Utils.addEvent(container.firstChild, "onclick", data["click"]);
            Utils.addEvent(container.firstChild.childNodes[2], "onclick", this.showMenu);
        } else {
            Utils.addEvent(container.firstChild, "onclick", this.showMenu);
            Utils.addEvent(container.firstChild.childNodes[2], "onclick", this.showMenu);
        }
        return Menu.highlightButton(container);
    },
    showMenu: function(e) {
        if (MENU.lastMenu) {
            MENU.lastMenu.style.display = "none";
        }
        var target = e.srcElement || e.target;
        var root = Utils.findParent(target, "li");
        var btn = root.childNodes[0];
        var f = root.childNodes[1];
        f.style.position = "absolute";
        f.style.display = "block";
        var px = 0; var py = 0;
        px = btn.parentNode.offsetLeft;//$(btn).offset().left;//btn.offsetLeft;
        py = btn.parentNode.offsetTop;//$(btn).offset().top;//btn.offsetTop;
        
        //f.style.left = 0 + "px";
        //f.style.top = (py + btn.offsetHeight).toString() + "px";

        MENU.lastMenu = f;
        Utils.stopEvent();
        Utils.addEvent(document, "onclick", MENU.docClick);
    },
    hideMenu: function(e, globalEvent) {
        if (e) {
            var target = e.srcElement || e.target;
            var u = Utils.findParent(target, "ul");
            u.style.display = "none";
        } else if (MENU.lastMenu) {
            MENU.lastMenu.style.display = "none";
        }
        MENU.lastMenu = null;
        if(globalEvent){
            Utils.stopEvent(globalEvent);
        }
        Utils.removeEvent(document, "onclick", MENU.docClick);
    },
    docClick: function() {
        MENU.hideMenu();
    }

}

/* >>>>>End   menu.js */


/* >>>>>Begin PageTurnner.js */
//PageTurnner是一个不包含任何UI的逻辑对象
function PageTurnner(pageCount,pageIndex){
    var thePageTurnner=this;
    this.pageIndex=pageIndex;

    this.fristPage = function() {
        this.turnPage(1);
    };
    this.lastPage = function() {
        this.turnPage(pageCount);
    };
    this.nextPage = function() {
        this.turnPage(thePageTurnner.pageIndex + 1);
    };
    this.previousPage = function() {
        this.turnPage(thePageTurnner.pageIndex - 1);
    };
    this.turnPage = function(index) {
        if (index < 1 || index > pageCount || index == this.pageIndex) return;
        this.pageIndex = index;
        this.callPageChangeHandler(index);
    };
    this.pageChangeHandlers=[];
    this.addPageChangeListener = function(handler) {
        this.pageChangeHandlers.push(handler);
    };
    this.callPageChangeHandler = function(pageIndex) {
        for (var i = 0; i < this.pageChangeHandlers.length; i++) {
            this.pageChangeHandlers[i](pageIndex);
        }
    };
}
PageTurnner.createStyle = function(pageCount, pageIndex, containerId, callback) {
    var thePageTurnner = new PageTurnner(pageCount, pageIndex);
    var btnNext = createLink("下一页");
    var btnPrevious = createLink("上一页");
    var btnFrist = createLink("首页");
    var btnLast = createLink("末页");
    function createLink(text) {
        var a = document.createElement("a");
        a.innerHTML = text;
        a.href = "javascript:void(0)";
        return a;
    }
    btnFrist.onclick = function() { thePageTurnner.fristPage(); this.blur(); return false; };
    btnPrevious.onclick = function() { thePageTurnner.previousPage(); this.blur(); return false; };
    btnNext.onclick = function() { thePageTurnner.nextPage(); this.blur(); return false; };
    btnLast.onclick = function() { thePageTurnner.lastPage(); this.blur(); return false; };

    var select = document.createElement("select");
    for (var i = 1; i <= pageCount; i++) {
        var item = new Option(i.toString() + "/" + pageCount + "页", i);
        select.options.add(item);
        if (i == pageIndex) {
            item.selected = true;
        }
    }
    select.onchange = function() { thePageTurnner.turnPage(this.selectedIndex + 1); };
    thePageTurnner.addPageChangeListener(
        function(index) {
            select.options[index - 1].selected = true;
        }
    );
    setLinkDisabled(btnFrist, true);
    setLinkDisabled(btnPrevious, true);
    thePageTurnner.addPageChangeListener(disabledButton);
    thePageTurnner.addPageChangeListener(callback);
    var container;
    if (typeof (containerId) == "string") {
        container = document.getElementById(containerId);
    } else {
        container = containerId;
    }
    //container.appendChild(document.createTextNode("[ "));
    container.appendChild(btnPrevious);
    //container.appendChild(document.createTextNode(" | "));
    container.appendChild(btnNext);
    //container.appendChild(document.createTextNode(" ] "));
    container.appendChild(select);

    disabledButton(pageIndex);
    function disabledButton(index) {
        setLinkDisabled(btnFrist, false);
        setLinkDisabled(btnPrevious, false);
        setLinkDisabled(btnNext, false);
        setLinkDisabled(btnLast, false);
        if (index == 1) {
            setLinkDisabled(btnFrist, true);
            setLinkDisabled(btnPrevious, true);
        }
        if (index == pageCount) {
            setLinkDisabled(btnNext, true);
            setLinkDisabled(btnLast, true);
        }
    }
    function setLinkDisabled(link, value) {
        if (value) {
            //link.style.color="silver";
            link.style.display = "none";
        } else {
            //link.style.color="";
            link.style.display = "";
        }
    }
};
/* >>>>>End   PageTurnner.js */


/* >>>>>Begin poptip.js */
/**
 * @tiexg PopTip,用于右下角弹出式的提醒
 */
var PopTip={
	element:null,
	show:function(title,text){
		PopTip.isClosed=false;
		if(!this.element){
			this.element=document.createElement("div");
			this.element.id="popTip";
			this.element.className="popTip";
			this.element.style.position="absolute";
			this.element.style.right="1px";
			this.element.style.bottom="0px";
			this.element.style.display="none";

			document.body.appendChild(this.element);
		}
		this.element.innerHTML=this.getHtml(title,text);
		var tip=this;
		var	maxY=0;
		var offsetY=0;
		var intervalId=window.setInterval(anmiate,100);
		function anmiate(){
			if (PopTip.isClosed) {	//在弹出的过程中点了关闭
				tip.element.style.display = "none";
				PopTip.isClosed=false;
				window.clearInterval(intervalId);
			}
			else {
				tip.element.style.display = "block";
				maxY = tip.element.offsetHeight;
				if (offsetY <= maxY + 1) {
					tip.element.style.bottom = (-maxY + offsetY).toString() + "px";
				}
				else {
					window.clearInterval(intervalId);
					offsetY = 0;
					if(!tip.isOver){
						tip.timerClose=setTimeout(tip.close,5000);
					}
					
				}
				var m = 30 * (maxY - offsetY) / maxY;//缓冲系数
				offsetY += m < 2 ? 2 : m; //偏移量,要注意极限值,否则无法停下来.
			}
			
		}
		
	},
	timerClose:0,
	isClosed:false,
	isOver:false,
	close:function(){
		var t=PopTip;
		t.element.style.bottom=(-t.element.offsetHeight).toString()+"px";
		t.element.style.display="none";
		t.isClosed=true;
	},
	mouseMove:function(){
		isOver=true;
		//alert(PopTip.timerClose);
		clearTimeout(PopTip.timerClose);
	},
	mouseOut:function(){
		isOver=false;
		this.timerClose=setTimeout(PopTip.close,5000);
	},
	getHtml:function(title,text){
		var s="<div class=\"newTip\" onmousemove=\"PopTip.mouseMove()\" onmouseout=\"PopTip.mouseOut()\"><ul><li><span class=\"doN\">{title}</span> <a href=\"javascript:;\" hidefocus=\"1\" class=\"clR\" onclick=\"PopTip.close();return false;\"></a></li></ul><span class=\"nTc\">{text}</span></div>";
		return String.format(s,{title:title,text:text});
	}
};

/* >>>>>End   poptip.js */


/* >>>>>Begin Repeater.js */
/**
 * @author tiexg
 * Repeater，实现类似于asp.net的数据绑定，模板列机制。
 */
function Repeater(obj){	
	this.HtmlTemplate=null;
	this.HeaderTemplate=null;
	this.FooterTemplate=null;
	this.ItemTemplate;
	this.ItemTemplateOrign;
	this.SeparateTemplate;
	this.Functions=null;
	this.DataSource=null;
	this.ItemContainer;
	this.ItemDataBound=null;
	this.RenderMode=0;	//0，同步渲染，界面一次性组装，1.异步渲染，50毫秒生成一行
	this.RenderCallback=null;
	this.Element;	
	RP=this;
	this.Instance=null;
	this.getValueByName=null; //根据字段名取值函数，参数为字段名,某一行的数据
	this.DataRow=null;	//当前行数据
	if (typeof(obj) != undefined) {
		if (typeof(obj) == "string") {
			this.Element = document.getElementById(obj);
		}
		else {
			this.Element = obj;
		}
		//n=findChild(obj,"name","item");
		

	}

	this.DataBind = function() {
	     
	    if (this.DataSource.length == 0) {
	        return;
	    }
	    if (this.HtmlTemplate == null) {
	        this.HtmlTemplate = this.Element.innerHTML;
	    }
	    //this.ItemTemplate=this.HtmlTemplate.match(/(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/ig)[0];
	    var re = /(<!--item\s+start-->)([\r\n\w\W]+)(<!--item\s+end-->)/i;
	    //re.exec(this.HtmlTemplate);
	    var match = this.HtmlTemplate.match(re);
	    this.ItemTemplateOrign = match[0];
	    this.ItemTemplate = match[2];

	    reg1 = /\$\w+\s?/ig;
	    reg2 = /\@(\w+)\s?\((.*?)\)/ig;
	    var result = new Array();
	    var thisObj = this;
	    for (var i = 0; i < this.DataSource.length; i++) {
	        var dataRow = this.DataSource[i];
	        dataRow["index"] = i; 	//追加索引
	        this.DataRow = dataRow; //设置当前行数据
	        var row = this.ItemTemplate;

	        row = row.replace(reg2, function($0, $1, $2) { //替换函数
	            var name = $1.trim();
	            var paramList = $2.split(",");
	            var param = new Array();
	            
	             
	            for (var i = 0; i < paramList.length; i++) {
	               var keyValue = dataRow[paramList[i]];
	               if(typeof(thisObj.getValueByName)=="function")
                   {
                        keyValue=thisObj.getValueByName(paramList[i],dataRow);
                   }
	                param.push(keyValue);
	            }
	            if (RP.Functions[name]) {
	                //return RP.Functions[name](param);
	                var context = RP;
	                if (RP.Instance) {
	                    RP.Instance.DataRow = dataRow;
	                    context = RP.Instance;
	                }
	                
	                return RP.Functions[name].apply(context, param)
	            }


	        });
	        row = row.replace(reg1, function($0) { //替换变量
	            m = $0.substr(1).trim();
	            return dataRow[m];

	        });

	        var itemArgs = {	//事件参数
	            index: i,
	            data: dataRow,
	            html: row
	        };
	        if (this.ItemDataBound) {	//是否设置了行绑定事件
	            var itemRet = this.ItemDataBound(itemArgs);
	            if (itemRet) {
	                row = itemRet;
	            }
	        }
	        result.push(row);
	    }
	    this.Render(result);



	};

	this.Render = function(result) {
	    if (!this.RenderCallback) {
	        var str = result.join("");
	        var html = "";
	        if (this.HtmlTemplate) {
	            html = this.HtmlTemplate.replace(this.ItemTemplateOrign, str);
	        } else {
	            html = this.ItemTemplate.replace(this.ItemTemplateOrign, str);
	        }
	        if (this.HeaderTemplate)
	            html = this.HeaderTemplate + html;
	        if (this.FooterTemplate) {
	            html = html + this.FooterTemplate;
	        }
	        this.Element.innerHTML = html;
	    } else {
	        var n = 0;
	        var el = this.Element;
	        var rowObj = null;
	        var args = { index: 0, element: el, html: "", rowCount: result.length };
	        var intervalId = setInterval(function() {
	            if (n < result.length) {
	                //el.innerHTML=RP.HtmlTemplate.replace(RP.ItemTemplate,result[0]);
	                args.index = n;
	                args.element = el;
	                args.html = result[n];
	                RP.RenderCallback(args);
	                n++;
	            } else {
	                clearInterval(intervalId);
	            }
	        }, 50);
	    }
	}

		
}


String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };
Object.extend = function(A, $) {
    for (var _ in $) {
        A[_] = $[_];
    }
    return A;
};
//Object.extend(Repeater.prototype,DataList)
/**
 * @author tiexg
 * DataList控件，依赖于Repeater
 */
function DataList(obj){
	this.Layout=1;	// 0为使用div布局方式, 1为使用table布局方式。
	this.RepeatColumns=5;
	this.ItemTemplate;
	this.id="table_list";
	this.Style_Cell;
	var rp=new Repeater(obj);

	var DL=this;
	this.DataSource=null;
	this.Functions=null;
	this.DataRow;	//当前行数据


	var table=document.createElement("table");
	var tr;
	rp.RenderCallback = function(arg) {

	    var td = document.createElement("td");
	    td.innerHTML = arg.html;
	    if (DL.Style_Cell) {
	        td.className = DL.Style_Cell;
	    }

	    if (arg.index == 0) {	//第一个数据
	        var table = document.createElement("table");
	        var tbody = document.createElement("tbody");
	        tr = document.createElement("tr");
	        table.appendChild(tbody);
	        tbody.appendChild(tr);
	        rp.Element.appendChild(table);
	        table.id = DL.id;
	        tr.appendChild(td);
	    } else if (arg.index == arg.rowCount - 1) {	//最后一个数据
	        tr.appendChild(td);
	    } else if (arg.index % DL.RepeatColumns == 0) {	//换行
	        tbody = tr.parentNode;
	        tr = document.createElement("tr");
	        tbody.appendChild(tr);
	        tr.appendChild(td);
	    } else {
	        tr.appendChild(td);
	    }


	};
	this.DataBind = function() {
	    var arr = new Array();
	    //arr.push("<table>");
	    arr.push("<!--item start-->");
	    arr.push(this.ItemTemplate);
	    arr.push("<!--item end-->");
	    //arr.push("</table>");
	    rp.HtmlTemplate = arr.join("");

	    rp.DataSource = this.DataSource;
	    rp.Functions = DL.Functions;
	    rp.Instance = DL;
	    rp.DataBind();

	};
	
	
}


/* >>>>>End   Repeater.js */


/* >>>>>Begin UI.AutoCompleteMenu.js */
function AutoCompleteMenu(/*文本框*/host, /*输入回调*/inputCallback, /*子项选中回调*/itemClickHandler) {
    var This = this;
    var key = {
        up: 38,
        down: 40,
        enter: 13,
        space: 32,
        tab: 9,
        left: 37,
        right: 39
    };
    var isShow = false;
    var doc = host.ownerDocument;
    var itemFocusColor = "#3399FE";
    var menuCSSText = "position:absolute;z-index:101;display:none;border:1px solid #99ba9f;height:200px;overflow:auto;overflow-x:hidden;background:white";
    var itemCSSText = "width:100%;line-height:20px;text-indent:3px;cursor:pointer;display:block;";
    var bgIframe = doc.createElement("iframe");
    with (bgIframe.style) {
        position = "absolute";
        zIndex = 100;
        display = "none";
    }
    var items = [];
    var container = doc.createElement("div");
    container.onclick = function(e) {
        Utils.stopEvent(e);
    }
    container.onmousedown = function(e) {
        Utils.stopEvent(e);
    }
    if (document.all) {
        $(document).click(hide);
    }
    function clear() {
        items.length = 0;
        container.innerHTML = "";
    }
    this.addItem = function(value, title) {
        if (typeof value == "object") {
            var span = value;
        } else {
            var span = doc.createElement("span");
            span.value = value;
            span.innerHTML = title;
        }
        if (document.all) {
            span.style.cssText = itemCSSText;
        } else {
            span.setAttribute("style", itemCSSText);
        }

        span.onmousedown = function() {
            itemClickHandler(this);
            hide();
        }
        span.onmouseover = function() { selectItem(this); }
        span.menu = this;
        span.selected = false;
        items.push(span);
        container.appendChild(span);
    }
    function getSelectedItem() {
        var index = getSelectedIndex();
        if (index >= 0) return items[index];
        return null;
    }
    function getSelectedIndex() {
        for (var i = 0; i < items.length; i++) {
            if (items[i].selected) return i;
        }
        return -1;
    }
    //设置选中行
    function selectItem(item) {
        var last = getSelectedItem();
        if (last != null) blurItem(last);
        item.selected = true;
        item.style.backgroundColor = itemFocusColor;
        item.style.color = "white";
        menuScroll(item, container); //如果选中的项被遮挡的话则滚动滚动条
        function menuScroll(element, container) {
            var elementView = {
                //top:      element.offsetTop,这样写ff居然跟ie的值不一样
                top: getSelectedIndex() * element.offsetHeight,
                bottom: element.offsetTop + element.offsetHeight
            };
            var containerView = {
                top: container.scrollTop,
                bottom: container.scrollTop + container.offsetHeight
            };
            if (containerView.top > elementView.top) {
                container.scrollTop -= containerView.top - elementView.top;

            } else if (containerView.bottom < elementView.bottom) {
                container.scrollTop += elementView.bottom - containerView.bottom;
            }
        }
    }
    //子项失去焦点
    function blurItem(item) {
        item.selected = false;
        item.style.backgroundColor = "";
        item.style.color = "";
    }
    function show() {
        if (isShow) return;
        if (container.parentNode != doc.body) {
            doc.body.appendChild(container);
            doc.body.appendChild(bgIframe);
        }
        with (container.style) {
            Utils.offsetHost(host, container);
            display = "block";
            width = Math.max(host.offsetWidth,300) + "px";
            if (items.length < 7) {
                height = items[0].offsetHeight * items.length + 10 + "px";
            } else {
                height = items[0].offsetHeight * 7 + "px";
            }
        }
        with (bgIframe.style) {
            left = container.style.left;
            top = container.style.top;
            width = container.offsetWidth;
            height = container.offsetHeight;
            if (document.all) display = "";
        }
        selectItem(items[0]); //显示的时候选中第一项
        isShow = true;
    }
    function hide() {
        if (!isShow) return;
        container.style.display = "none";
        bgIframe.style.display = "none";
        clear();
        isShow = false;
    }
    if (document.all) {
        container.style.cssText = menuCSSText;
        host.attachEvent("onkeyup", host_onkeyup);
        host.attachEvent("onblur", host_onblur);
        host.attachEvent("onkeydown", host_onkeydown);
    } else {
        container.setAttribute("style", menuCSSText);
        host.addEventListener("keyup", host_onkeyup, true);
        host.addEventListener("blur", host_onblur, true);
        host.addEventListener("keydown", host_onkeydown, true);
    }
    function host_onkeyup(evt) {
        switch ((evt || event).keyCode) {
            case key.enter:
            case key.tab:
            case key.up:
            case key.down:
            case key.left:
            case key.right: return;
        }
        hide();
        inputCallback(This, evt || event);
        if (items.length > 0) show();
    }
    function host_onblur() {
        if (!document.all) hide();
    }
    function host_onkeydown(evt) {
        evt = evt || event;
        switch (evt.keyCode) {
            case key.space:
            case key.enter: doEnter(); break;
            case key.up: doUp(); break;
            case key.down: doDown(); break;
            case key.right:
            case key.left: hide(); break;
            default: return;
        }
        function doEnter() {
            var item = getSelectedItem();
            if (item != null) item.onmousedown();
            if (evt.keyCode == key.enter) {
                Utils.stopEvent(evt);
            }
        }
        function doUp() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index--;
                index = index < 0 ? index + items.length : index;
                selectItem(items[index]);
            }
        }
        function doDown() {
            var index = getSelectedIndex();
            if (index >= 0) {
                index = (index + 1) % items.length;
                selectItem(items[index]);
            }
        }
    }
}
AutoCompleteMenu.createAddrMenu_compose = function(host, userAllEmailText) {
    top.Contacts.ready(function() {
        var contacts = top.Contacts.data.contacts;
        var lastContacts = top.Contacts.data.lastestContacts;
        var allEmails = [];
        for (var i = 0, len = lastContacts.length; i < len; i++) {
            var c = lastContacts[i];
            if (c.AddrType != "E") continue;
            var email = c.AddrContent.toLowerCase();
            var item = {
                email: email,
                name: c.AddrName,
                lowerName: c.AddrName.toLowerCase(),
                rank: 1
            };
            allEmails.push(item);
        }
        var closeContacts = top.Contacts.data.closeContacts;
        if (closeContacts) {
            for (var i = 0, len = closeContacts.length; i < len; i++) {
                var c = closeContacts[i];
                if (c.AddrType != "E") continue;
                var email = c.AddrContent.toLowerCase();
                var item = {
                    email: email,
                    name: c.AddrName,
                    lowerName: c.AddrName.toLowerCase(),
                    rank: 0
                };
                allEmails.push(item);
            }
        }
        for (var i = 0, len = contacts.length; i < len; i++) {
            var c = contacts[i];
            for (var j = 0; j < c.emails.length; j++) {
                var email = c.emails[j].toLowerCase();
                var item = {
                    name: c.name,
                    lowerName: c.name.toLowerCase(),
                    email: email,
                    rank: 2
                }
                allEmails.push(item);
            }
            
        }
        var getMailReg = /^([^@]+)@(.+)$/
        var getInput = /(?:[;,]|^)\s*([^;,\s]+)$/;
        if (typeof userAllEmailText == "undefined") {
            userAllEmailText = true;
        }
        function autoLinkMan(menu, event) {
            var match = host.value.match(getInput);
            var hostValue = (host.getText && host.getText()) || host.value;
            if (!match) return false;
            var txt = match[1];
            if (txt == "") return false;
            //            try {
            //                if (event.keyCode!=8 && new RegExp(UserData.regex).test("86" + txt)) {
            //                    host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + txt + "@139.com;");
            //                    return;
            //                }
            //            } catch (e) { }
            var inputText = txt.toLowerCase();
            var emailItems = allEmails;
            var matchItems = [];
            for (var i = 0, len = emailItems.length; i < len; i++) {
                var item = emailItems[i];
                var testEmail = userAllEmailText ? ("<" + item.email + ">") : item.email + ";";
                if (hostValue.indexOf(testEmail) >= 0) continue;
                var nameMatchIndex = item.lowerName.indexOf(inputText);
                var emailMatchIndex = item.email.indexOf(inputText);
                if (nameMatchIndex == -1 && emailMatchIndex == -1) continue;
                var matchIndex = nameMatchIndex;
                var matchType = "name";
                if (nameMatchIndex == -1 || (emailMatchIndex >= 0 && emailMatchIndex < nameMatchIndex)) {
                    matchIndex = emailMatchIndex;
                    matchType = "email";
                }
                var matchItem = {
                    name: item.name,
                    email: item.email,
                    rank: item.rank,
                    matchIndex: matchIndex,
                    matchType: matchType
                };
                matchItems.push(matchItem);
            }
            //            matchItems.sort(function(a, b) {
            //                var n = a.email.localeCompare(b.email);
            //                if (n == 0) return a.name.localeCompare(b.name);
            //                return n;
            //            });
            //排重
            for (var i = 1; i < matchItems.length; i++) {
                var _a = matchItems[i];
                var _b = matchItems[i - 1];
                if (_a.name == _b.name && _a.email == _b.email) {
                    matchItems.splice(i, 1);
                    i--;
                }
            }
            matchItems.sort(function(a, b) {
                var matchIndex = a.matchIndex - b.matchIndex;
                if (matchIndex != 0) return matchIndex;
                return a.rank - b.rank;
            });

            for (var i = 0, len = (matchItems.length > 50 ? 50 : matchItems.length); i < len; i++) {
                var item = matchItems[i];
                var itemName = item.name;
                var itemEmail = item.email;
                var matchIndex = item.matchIndex;
                var allText = "\"" + itemName + "\"<" + itemEmail + ">";
                if (item.matchType == "name") {
                    var richText = "\"" +
                itemName.substring(0, matchIndex) + "[b]"
                + itemName.substring(matchIndex, inputText.length + matchIndex) + "[/b]"
                + itemName.substring(matchIndex + inputText.length) + "\"<" + itemEmail + ">";
                } else {
                    var richText = "\"" + itemName + "\"<" +
                itemEmail.substring(0, matchIndex) + "[b]"
                + itemEmail.substring(matchIndex, inputText.length + matchIndex) + "[/b]"
                + itemEmail.substring(matchIndex + inputText.length) + ">";
                }
                richText = Utils.htmlEncode(richText).replace("[b]", "<b>").replace("[/b]", "</b>");
                if (userAllEmailText) {
                    menu.addItem(allText, richText);
                } else {
                    menu.addItem(item.email, richText);
                }
            }
            if (new RegExp(UserData.regex).test("86" + txt)) {
                var mail139 = txt + "@139.com";
                menu.addItem(mail139, mail139);
            }
        }
        function linkManItemClickHandler(item) {
            host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ";");
        }
        $(host).keydown(function(e) {
            if (e.keyCode == 8 && !e.ctrlKey && !e.shiftKey) {
                var p = getTextBoxPos(this);
                if (!p || p.start != p.end || p.start == 0 || p.start < this.value.length) return;
                var lastValue = this.value;
                var deleteChar = lastValue.charAt(p.start - 1);
                if (deleteChar == ";" || deleteChar == ",") {
                    var leftText = lastValue.substring(0, p.start);
                    var rightText = lastValue.substring(p.start, lastValue.length);
                    var cutLeft = leftText.replace(/(^|[;,])[^;,]+[;,]$/, "$1$1");
                    this.value = cutLeft + rightText;
                }
            }
        });
        new AutoCompleteMenu(host, autoLinkMan, linkManItemClickHandler);
    });
}

AutoCompleteMenu.createAddrMenu = function(host, userAllEmailText) {
    if (window.PageStateTypes) {
        AutoCompleteMenu.createAddrMenu_compose(host, userAllEmailText);
        return;
    }
    if (typeof userAllEmailText == "undefined") {
        userAllEmailText = true;
    }
    var getMailReg = /^([^@]+)@(.+)$/
    var getInput = /(?:[;,]|^)\s*([^;,\s]+)$/;
    var allLinkMan = [];
    if (!top.LinkManList) return;
    GroupList = top.GroupList;
    LinkManList = top.LinkManList;
    LastLinkList = top.LastLinkList;
    CloseLinkList = top.CloseLinkList;
    if (window.LastLinkList) {
        allLinkMan = LastLinkList.concat(LinkManList);
    } else {
        allLinkMan = LinkManList;
    }
    if (window.CloseLinkList) {
        allLinkMan = allLinkMan.concat(CloseLinkList);
    }

    function autoLinkMan(menu) {
        var match = host.value.match(getInput);
        if (!match) return false;
        var txt = match[1];
        if (txt == "") return false;
        try {
            if (new RegExp(UserData.regex).test("86" + txt)) {
                host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + txt + "@139.com;");
                return;
            }
        } catch (e) { }
        var tmp_arr = [];
        var count = 0;
        for (var i = 0, j = allLinkMan.length; i < j; i++) {
            try {
                var obj = allLinkMan[i];
                if (!obj.title) {
                    obj.title = "\"" + obj.name + "\"<" + obj.addr + ">";
                    var match = obj.addr.match(getMailReg);
                    if (match) {
                        obj.mailID = match[1];
                        obj.mailDomain = match[2];
                    }
                }
                if (host.value.indexOf(obj.title) >= 0) continue;
                var title = "";
                if (txt.indexOf("@") > 0 && obj.addr.indexOf(txt) >= 0) {//如果用户输入了@,则按整个邮件地址mailID@domain.com去搜索
                    title = obj.title.replace(txt, "[b]" + txt + "[/b]");
                } else if (obj.name.indexOf(txt) >= 0) {//如果没有输入@,则先搜索好友名称部分,即["好友名称"<mailID@domain.com>]
                    title = "\"" + obj.name.replace(txt, "[b]" + txt + "[/b]") + "\"<" + obj.addr + ">";
                } else if (obj.mailID.indexOf(txt) == 0) {//如果名称没有匹配,再搜索邮件地址的mailID部分
                    title = "\"" + obj.name + "\"<" + obj.mailID.replace(txt, "[b]" + txt + "[/b]") + "@" + obj.mailDomain + ">";
                }
                if (title != "") {
                    if (!isRepeat(tmp_arr, obj)) {
                        tmp_arr.push(obj);
                        var _value = userAllEmailText == true ? obj.title : obj.addr;
                        menu.addItem(_value, Utils.htmlEncode(title).replace(/\[/g, "<").replace(/\]/g, ">"));
                        count++;
                    }
                }
                if (count >= 50) break;
            } catch (e) { }
        }
    }
    function isRepeat(arr, item) {
        for (var i = arr.length - 1; i >= 0; i--) {
            if (item.id && item.id == arr[i].id) return true;
        }
        return false;
    }
    function linkManItemClickHandler(item) {
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ";");
    }
    init();
    function init() {
        if (window.LinkManList) {
            new AutoCompleteMenu(host, autoLinkMan, linkManItemClickHandler);
        } else {
            setTimeout(init, 1000);
        }
    }
}

function getTextBoxPos(textBox) {
    var start = 0;
    var end = 0;
    if (typeof (textBox.selectionStart) == "number") {
        start = textBox.selectionStart;
        end = textBox.selectionEnd;
    }
    else if (document.selection) {
        textBox.focus();
        var workRange = document.selection.createRange();
        var selectLen = workRange.text.length;
        if (selectLen > 0) return null;
        textBox.select();
        var allRange = document.selection.createRange();
        workRange.setEndPoint("StartToStart", allRange);
        var len = workRange.text.length;
        workRange.collapse(false);
        workRange.select();
        start = len;
        end = start + selectLen;
    }
    return { start: start, end: end };
}
AutoCompleteMenu.createPostfix = function(host) {
    new AutoCompleteMenu(
		host,
		function(menu) {
		    var arr = ["@sina.com", "@sohu.com", "@21cn.com", "@tom.com", "@yahoo.com.cn", "@yahoo.cn"];
		    var txt = host.value;
		    if ($.trim(txt) == "") return;
		    var match = txt.match(/\w+(@[\w.]*)/);
		    for (var i = 0; i < arr.length; i++) {
		        if (match) {
		            if (arr[i].indexOf(match[1]) == 0 && arr[i] != match[1]) {
		                var value = txt.match(/^([^@]*)@/)[1];
		                menu.addItem(value + arr[i], value + arr[i]);
		            }
		        } else {
		            menu.addItem(txt + arr[i], txt + arr[i]);
		        }
		    }
		},
		function(item) {
		    host.value = item.value;
		}
	)
}
/* 包装一个使用实例,可以根据输入提示手机号码 */
AutoCompleteMenu.createPhoneNumberMenuFromLinkManList = function(host) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = LinkManList.length; i < j; i++) {
            if (!LinkManList[i].addr) continue;
            var num = LinkManList[i].addr.toString();
            var pname = LinkManList[i].name;
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "(" + pname + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

/* 包装一个使用实例,可以根据输入提示手机号码 */
AutoCompleteMenu.createPhoneNumberMenuForSearchByMobile = function(host) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = LinkManList.length; i < j; i++) {
            if (!LinkManList[i].addr) continue;
            var num = LinkManList[i].addr.toString();
            var pname = LinkManList[i].name;
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (pname) str = "(" + pname + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value);
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

/* 包装一个使用实例,可以根据输入提示手机号码 */
AutoCompleteMenu.createPhoneNumberMenu = function(/*文本框*/host, /*手机号码数组:Array*/numbers) {
    var regMatchPhoneNumber = /(?:^|[;,])\s*(\d+)$/;
    function textChanged(menu) {
        var match = host.value.match(regMatchPhoneNumber);
        var inputNumber = "";
        if (match) {
            inputNumber = match[1];
        } else {
            return false;
        }
        var matchedCount = 0;
        for (var i = 0, j = numbers.length; i < j; i++) {
            if (!numbers[i].number) continue;
            var num = numbers[i].number.toString();
            if (host.value.indexOf(num) >= 0) continue;
            if (num.indexOf(inputNumber) == 0) {
                var str = num.replace(inputNumber, "<span style='color:Red'>" + inputNumber + "</span>")
                if (numbers[i].name) str = "(" + numbers[i].name + ")" + str;
                menu.addItem(num, str);
                matchedCount++;
            }
            if (matchedCount >= 50) break;
        }
        return !(matchedCount == 0);
    }
    function itemClick(item) {
        host.value = host.value.replace(/([;,]|^)\s*([^;,\s]+)$/, "$1" + item.value + ",");
    }
    new AutoCompleteMenu(host, textChanged, itemClick);
}

/* >>>>>End   UI.AutoCompleteMenu.js */


/* >>>>>Begin waitpannel.js */
/**
 * 显示正在加载中.......
 */
var WaitPannel=new Object();
WaitPannel.show = function(msg) {
    div = document.getElementById("contextWaitPannel");
    if (!div) {
        div = document.createElement("div");
        div.id = "contextWaitPannel";
        div.className = "loadingInfo";
        div.style.position = "absolute";
        if (!msg) {
            msg = "加载中，请稍候........";
        }
        div.innerHTML = msg.encode();
        div.style.left = document.body.clientWidth / 2 - 20;
        div.style.top = document.body.clientHeight / 2 - 30;
        document.body.appendChild(div);
    }

    div.style.left = document.body.clientWidth / 2 - 20;
    div.style.top = document.body.clientHeight / 2 - 30;
    //div.display="block";
};

WaitPannel.hide = function() {
    div = document.getElementById("contextWaitPannel");
    if (div) {
        document.body.removeChild(div);
        //div.style.display="none";
    }


};

/* >>>>>End   waitpannel.js */


/* >>>>>Begin popmenu.js */
//PopMenu是一个独立的对象
function PopMenu(containerClass){
    Utils.stopEvent();
    var theMenu=this;
    var container=document.createElement("div");
    this.container=container;
    container.id="editorSelect";
    container.className=containerClass||"editorSelect";
    container.style.display="none";
    var documentClick=null;
    this.show = function(host) {
        if (PopMenu.current) PopMenu.current.hide();
        PopMenu.current = theMenu;
        document.body.appendChild(container);
        var offset = $(host).offset();
        container.style.left = offset.left + "px";
        container.style.top = offset.top + $(host).height() + "px";
        container.style.display = "block";
        container.style.position = "absolute";
        documentClick = function() {
            $(this).unbind("click", arguments.callee);
            if (PopMenu.current) PopMenu.current.hide();
        };
        $(document).click(documentClick);
    };
    container.onclick = function(e) {
        Utils.stopEvent();
    };
    this.hide = function() {
        if (!PopMenu.current) return;
        if (container.parentNode) container.parentNode.removeChild(container);
        if (theMenu.onHide) theMenu.onHide();
        $(document).unbind("click", documentClick);
        PopMenu.current = null;
    };
    this.addItem = function(title, clickHandler) {
        var item;
        if (typeof (title) == "string") {
            item = document.createElement("a");
            item.innerHTML = title;
        } else {
            item = title;
        }
        item.href = "javascript:void(0)";
        item.onclick = function(evt) {
            if (clickHandler) clickHandler(this);
            theMenu.hide();
        };
        container.appendChild(item);
    };
    this.setContent = function(obj) {
        if (typeof obj == "string") {
            container.innerHTML = obj;
        } else {
            container.innerHTML = "";
            container.appendChild(obj);
        }
    };
} 
 
/* >>>>>End   popmenu.js */


/* >>>>>Begin tabpage.js */
function TabPage(container,list,callback){
	TheTab=this;
	this.TabList=list;
	this.Container=container;
	this.SelectedIndex=0;	//当前选中项索引
	this.OnTabChange=callback;	//选中tab回调事件
	this.tabControl=null;		//tab栏的容器
	this.tabContent=null;		//内容栏的容器
	this.contentList=new Object();	//内容栏的缓存列表
	if(this.tabControl==null){	
		this.tabControl=document.createElement("div");
		this.Container.appendChild(this.tabControl);
		this.tabContent=document.createElement("div");
		this.Container.appendChild(this.tabContent);
		this.tabContent.className="tab_content";
	}
	
	//设置tab页的内容，可以传字符串也可以传dom element，实现了对内容节点的缓存
	this.SetPageContent = function(content) {
	    var key = this.SelectedIndex;
	    if (this.tabContent.childNodes.length > 0) {	//先删除原节点
	        this.tabContent.removeChild(this.tabContent.childNodes[0]);
	    }

	    if (this.contentList[key]) {	//本tab页已打开过
	        this.tabContent.appendChild(this.contentList[key]);
	    }
	    else {	//本tab页第一次加载
	        var c = document.createElement("div");
	        this.tabContent.appendChild(c);
	        if (typeof (content) == "string") {
	            c.innerHTML = content;
	        } else {
	            c.appendChild(content);
	        }
	        this.contentList[key] = c;
	    }


	};
	//创建和重新显示tab栏
	this.RenderTab = function(isInit) {
	    var idx = 0;
	    for (elem in this.TabList) {
	        obj = this.TabList[elem];
	        var tab;
	        if (isInit) {	//首次调用时创建tab
	            tab = document.createElement("div");
	            tab.style.display = "inline";
	            tab.innerHTML = obj;
	            this.tabControl.appendChild(tab);
	        } else {
	            tab = this.tabControl.childNodes[idx];
	        }
	        if (this.SelectedIndex == idx) {
	            tab.className = "tab_on";
	        } else {
	            tab.className = "tab";
	        }
	        (function() {
	            var i = idx;
	            tab.onclick = function() {
	                TheTab.ChangeTab(i);
	            };
	        })();
	        idx++;

	    }
	};
	//切换tab栏
	this.ChangeTab = function(targetIndex) {
	    this.SelectedIndex = targetIndex;
	    this.RenderTab(false);
	    this.OnTabChange(targetIndex);
	};
	
	this.RenderTab(true);
	this.ChangeTab(0);
	
}

/* >>>>>End   tabpage.js */
