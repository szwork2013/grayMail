EditorManager = {};
EditorManager.create = function(param){
    if (!param.container) 
        return;
    var editorUrl = "http://" + window.top.location.host + "/" + top.stylePath + "/editor.htm?";
    if (param.hidToolBar) {
        if (param.hidToolBar) 
            editorUrl += "&hidToolBar=true";
    }
    var htmlCode = "<iframe name='theEditorFrame' id='theEditorFrame' style='width:100%;height:100%' frameBorder='0' scrolling='no' src='" + editorUrl + "'></iframe>";
    if (param.width) {
        htmlCode = htmlCode.replace("width:100%", "width:" + param.width.toString().replace(/(\d+)$/, "$1px"));
    }
    if (param.height) {
        htmlCode = htmlCode.replace("height:100%", "height:" + param.height.toString().replace(/(\d+)$/, "$1px"));
    }
    param.container.innerHTML = htmlCode;
}
EditorManager.getHtmlContent = function(){
    return window.frames["theEditorFrame"].theEditorBox.getHtmlContent();
}
EditorManager.setHtmlContent = function(content){
    return window.frames["theEditorFrame"].theEditorBox.setHtmlContent(content);
}
EditorManager.insertImage = function(url){
    window.frames["theEditorFrame"].theEditorBox.insertImage(url);
}
EditorManager.toggleToolBar = function(){
    window.frames["theEditorFrame"].$("#toolbar").toggle();
    window.frames["theEditorFrame"].resizeAll();
}
EditorManager.getHtmlToTextContent = function(){
    return window.frames["theEditorFrame"].theEditorBox.getHtmlToTextContent();
}
EditorManager.onload = function(){

}