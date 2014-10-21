/**
 * 提示消息类
 */
var Balloon = {
	/**
	 * 按目标元素指定的方向浮动消息框
	 * <pre><br>示例：<br>
	 * <br>Balloon.show(<br>
	 * <br>"消息内容",<br>
	 * <br>"right",<br>
	 * <br>100,<br>
	 * <br>{ x: 5, y: 10 }<br>
	 * <br>);<br>
	 * </pre>
	 * @param {string } text 可选参数，消息内容。
	 * @param {string} direction 必选参数，相对elem显示消息框的位置。如top,left,right,bottom。
	 * @param {Object} elem 必选参数，DOM对象。
	 * @param {int} width 必选参数，消息框宽度，整形。
	 * @param {Object} offset 可选参数，JSON对象，相对elem的偏移像素集合。如：{ x: 0, y: 0 }。
	 * @return {无返回值}
	 */
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
	/**
	 * 关闭浮动消息框，实际上是从document中移除浮动消息框。
	 * <pre>示例：<br>
	 * Balloon.close(this);
	 * </pre>
	 * @param {Object} sender 必选参数，事件触法对象，如：点击关闭的按扭&lt;BUTTON onclick='Balloon.close(this)'/&gt;
	 * @return {无返回值}
	 */
    close: function(sender) {
        document.body.removeChild(sender.parentNode);
    }

};

/**
 * 提示工具类
 */
var Tooltip={
	tip:null,
	/**
	 * 以注册方式使用提示工具。提示内容为目标DOM对象的title属性。
	 * <pre>示例：<br>
	 * Tooltip.register(document.getElementById("tool"),window);
	 * </pre>
	 * @param {Object} target 必选参数，要加提示的目标DOM对象
	 * @param {Object} win 可选参数，当前window对象
	 * @return {无返回值}
	 */
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
	/**
	 * 直接使用提示工具
	 * <pre>示例：
	 * Tooltip.guide(document.getElementById("tool"),"提示内容",window);
	 * </pre>
	 * @param {Object} target 必选参数，要加提示的目标DOM对象。
	 * @param {Object} text 可选参数，显示的提示内容。
	 * @param {Object} win 可选参数，当前window对象。
	 * @return {无返回值}
	 */
	guide:function(target,text,win){
		if(!win){
			win=window;
		}
		var div=win.$("<div style='display:none' class='tooltip'></div>");
	    div.html(text);
		Tooltip.show(div,target,win);
	}
};
