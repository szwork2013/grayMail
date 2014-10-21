/**
 * @fileOverview 定义写信页App对象
 */
 (function(jQuery,Backbone,_,M139){
    var $ = jQuery;
    var superClass = M139.PageApplication;
    M139.namespace("M2012.Compose.Application", superClass.extend(
    /**@lends M2012.MainApplication.prototype*/
    {
        /** 
        *写信页App对象
        *@constructs M2012.Compose.Application
        *@extends M139.PageApplication
        *@param {Object} options 初始化参数集
        *@example
        */
        initialize:function(options){
            superClass.prototype.initialize.apply(this,arguments);
        },

        defaults:{
            /**@field*/
            name:"M2012.Compose.Application"
        },

        /**主函数入口*/
        run:function(){
            this.initViews();

            this.initEvents();
        },

        initViews:function(){
        	var composeModel = this.model = new M2012.Compose.Model();
        	var options = {model:composeModel};
            
			//addrInputView = new M2012.Compose.View.AddrInput(options);
            //subjectView = new M2012.Compose.View.Subject(options);

            uploadView = new M2012.Compose.View.Upload(options);
			
			ComposeModel = composeModel; //全局

            //htmlEditorView = new M2012.Compose.View.HtmlEditor(options);
            
			//senderView = new M2012.Compose.View.Sender(options);
            //signMenuView = new M2012.Compose.View.SignMenu(options);
            //timingView = new M2012.Compose.View.Timing(options);
            //addressBook = new M2012.Compose.View.AddressBook(options);
            mainView = new M2012.Compose.View.Main(options);
        },

        initEvents: function () {
            //this.startCheckContentLength();
        },

        /**
         *定时检测正文内容，如果过大就加载压缩类库
         */
        startCheckContentLength: function () {
        
        }
		
    }));
    window.guid = Math.random().toString(16).replace(".", "");//为每个窗口生成一个唯一数，避免重复提交发信请求
    $composeApp = new M2012.Compose.Application();
    $composeApp.run();
    //页面离开提示
	/*
    window.top.onbeforeunload=function(){
        try{
            var isEdited = mainView ? mainView.model.compare() : false;
            if(isEdited){
                return "未保存的内容将会丢失，确定要离开页面？";
            }
        }catch(e){}
    }*/
})(jQuery,Backbone,_,M139);