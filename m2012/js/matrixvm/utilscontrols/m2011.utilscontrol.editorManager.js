/**
 * 在线编辑器类
 */
EditorManager = {};
/**
 * 创建编辑器
 * <pre>示例：<br>
 * <br>EditorManager.create(param);
 * </pre>
 * @param {Object} param 必选参数，创建编辑的属性集合参数。
 * @return {无返回值}
 */
EditorManager.create = function(param) {
    if (!param.container) return;
    var editorUrl = "";
    editorUrl ="http://"+ top.location.host;
    if (param.version == 2) {
        editorUrl += "/m2012/html/oldeditor/editor2.0.htm?";
    } else {
        editorUrl += "/m2012/html/oldeditor/editor.htm?";
    }
    try{
        editorUrl += "sid=" + top.$App.getSid();
    } catch (e) { }
    if (param.hidToolBar) {
        editorUrl += "&hidToolBar=true";
    }
    if (param.onload) {
        this.onload = param.onload;
    }
    if (param.imageButtonOnClick) {
        window["_imageButtonOnClick"] = param.imageButtonOnClick;
        editorUrl += "&imageButtonOnClick=_imageButtonOnClick";
    }
    if (param.screenShotButtonOnClick) {
        window["_screenShotButtonOnClick"] = param.screenShotButtonOnClick;
        editorUrl += "&screenShotButtonOnClick=_screenShotButtonOnClick";
    }
    if (param.showFace) {
        editorUrl += "&showFace=true";
    }
    if(param.onload){
        this.onload = param.onload;
    }
    var htmlCode = "<iframe name='theEditorFrame' id='theEditorFrame' style='width:100%;height:100%' frameBorder='0' scrolling='no' src='" + editorUrl + "'></iframe>";
    if (param.width) {
        htmlCode = htmlCode.replace("width:100%", "width:" + param.width.toString().replace(/(\d+)$/, "$1px"));
    }
    if (param.height) {
        htmlCode = htmlCode.replace("height:100%", "height:" + param.height.toString().replace(/(\d+)$/, "$1px"));
    }
    param.container.innerHTML = htmlCode;
    EditorManager.param = param;
}
/**
 * 得到编辑器html格式的内容
 * <pre>示例：<br>
 * <br>EditorManager.getHtmlContent();
 * </pre>
 * @return {string}
 */
EditorManager.getHtmlContent = function() {
    return window.frames["theEditorFrame"].theEditorBox.getHtmlContent();
}
/**
 * 写入编辑器内容
 * <pre>示例：<br>
 * <br>EditorManager.setHtmlContent();
 * </pre>
 * @param {string} content 可选参数，写入内容。
 * @return {string}
 */
EditorManager.setHtmlContent = function(content) {
   if(window.frames["theEditorFrame"].theEditorBox&&window.frames["theEditorFrame"].theEditorBox.setHtmlContent){
       return window.frames["theEditorFrame"].theEditorBox.setHtmlContent(content);
	}
}
/**
 * 写入编辑器图片地址
 * @param {string} url 必选参数，图片链接地址。
 * @return {无返回值}
 */
EditorManager.insertImage = function(url) {
    window.frames["theEditorFrame"].theEditorBox.insertImage(url);
}
/**
 * 重置编辑器
 * <pre>示例：<br>
 * <br>EditorManager.toggleToolBar();
 * </pre>
 * @return{无返回值}
 */
EditorManager.toggleToolBar = function() {
    var win = window.frames["theEditorFrame"];
    if (win.toggleToolBar) {
        win.toggleToolBar();
    } else {
        win.$("#toolbar").toggle();
    }
    win.resizeAll();
}
EditorManager.getHtmlToTextContent = function() {
    return window.frames["theEditorFrame"].theEditorBox.getHtmlToTextContent();
}
/**
 * 设置编辑器高度
 * <pre>示例：<br>
 * <br>EditorManager.setHeight(800);
 * </pre>
 * @param {Object} height 必选参数
 * @return {无返回值}
 */
EditorManager.setHeight = function(height) {
    height = height.toString().replace(/(?:px)?$/, "px");
    var container = EditorManager.param.container;
    var iframe = container.getElementsByTagName("iframe")[0];
    container.style.heigth = height;
    iframe.style.height = height;
    try {
        iframe.contentWindow.resizeAll();
    } catch (e) { }
}
EditorManager.onload=function(){}