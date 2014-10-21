/**
 * 弹出菜单类
 * <pre>示例：<br>
 * <br>PopMenu("mnueCss");
 * </pre>
 * @param {Object} containerClass 必选参数，样式名
 * @return {无返回值}
 */
function PopMenu(containerClass){
    Utils.stopEvent();
    var theMenu=this;
    var container=document.createElement("div");
    this.container=container;
    container.id="popMenu";
    container.className=containerClass||"popMenu";

    with(container.style){
        display="none";zIndex=999;lineHeight="20px";border="1px solid #F7E5B5";backgroundColor="#FFFDF6";padding="5px 15px";
    }
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
        Utils.stopEvent();
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
 