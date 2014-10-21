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
            addrInputView = new M2012.Compose.View.AddrInput(options);
            subjectView = new M2012.Compose.View.Subject(options);
            uploadView = new M2012.Compose.View.Upload(options);
            htmlEditorView = new M2012.Compose.View.HtmlEditor(options);
            senderView = new M2012.Compose.View.Sender(options);
            signMenuView = new M2012.Compose.View.SignMenu(options);
            littlesView = new M2012.Compose.View.Littles(options);
            timingView = new M2012.Compose.View.Timing(options);
            addressBook = new M2012.Compose.View.AddressBook(options);
            mainView = new M2012.Compose.View.Main(options);
			top.mainView = mainView;
        },

        initEvents: function () {
            this.startCheckContentLength();
        },

        /**
         *定时检测正文内容，如果过大就加载压缩类库
         */
        startCheckContentLength: function () {
            if (!top.SiteConfig.compressSendMailRelease) {
                return;
            }
            var self = this;
            if (this.model.isSupportCompressRequest()) {
                setTimeout(check, 5000);
                var checkContentLengthTimer = setInterval(check, 30000);
            }
            function check() {
                var count = htmlEditorView.getEditorContent().length;
                //每30秒检查一次 内容是否大概大于100kb, 小于2M（字节计算不准确）
                if (count > 80 * 1024 && count < 1600 * 1024) {
                    self.model.loadCompressLib();
                    clearInterval(checkContentLengthTimer);
                }
            }
        },

        /**
         *
         */
        getInputAddr:function(options){
        
        },

        /**
         *
         *@param {String} options.type 弹出框选择的联系人是添加到收件人、抄送、密送，to|cc|bcc
         */
        showAddressBookDialog:function(options){
        
        },

        /**
         *获得编辑器输入正文
         *@param {Object} options 参数集合
         *@param {String} options.type 读取类型：html|text|html_without_sign|html_widthout_quote
         */
        getEditorContent:function(options){
            
        }
    }));
    window.guid = Math.random().toString(16).replace(".", "");//为每个窗口生成一个唯一数，避免重复提交发信请求
    $composeApp = new M2012.Compose.Application();
    $composeApp.run();
})(jQuery,Backbone,_,M139);