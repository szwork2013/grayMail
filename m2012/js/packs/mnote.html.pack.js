/** 
* 
*  Base64 encode / decode 
* 
*  @author haitao.tu 
*  @date   2010-04-26 
*  @email  tuhaitao@foxmail.com 
* 
*/  
   
function Base64() {  
   
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}  
/*
* 和笔记 Model
* 总括：
**注意事项：
*1：新建
*2: 删除     
*3: 保存
*4: 修改
*5: 搜索
*6: 邮件分享
*   -标题或内容为空也可以进行邮件分享。 
*7: 时间面板展开以及编辑组件等
*8: 数据格式,由于内嵌的和笔记要与移动和笔记数据与展示一致:需要转义的字符'\','"'等 
*/
M139.namespace("M2012.Note.Model", Backbone.Model.extend({
    initialize: function () { },
    callApi: M139.RichMail.API.call,
    defaults: {
        noteId: null,           //当前笔记id
        nextIndex: -1,          //笔记列表的下一个，用于删除当前笔记后显示下一条
        noteListData: null,     //列表数据本地缓存
        searchResult: null,     //搜索结果
        keyword: "",
        order: "createTime",    //当前排序字段
        desc: 1,                //排序顺序
        isEditing: null,        //是否正在编辑中，主要影响自动保存和关闭和笔记Tab页监听，提醒用户记事未保留操作
        titleBuffer: null,      //标题缓存  做修改前后文对比，主要影响自动保存
        contentBuffer: null,    //内容缓存  同上
        currentOperation: null, //当前操作类型  用作提示语
        autoSave: false,        //自动保存监听信息量 
		evernoteSave: null,
        isEvernoteBinding: 0,  //防止多操作
        showFirstNote: 0,       //显示第一条笔记
        isCreating:false
    },
    //弹窗提示，新旧版本需要适配
    showMsg: function (msg) {
        $Msg.alert(msg);
    },
    //隐藏顶部消息条
    hideMsg: function () {
        setTimeout(function () {
            M139.UI.TipMessage.hide();
        }, 2000);
    },
    //新建笔记 
    _createNote: function (options) {
        //参数需要title，content，attachmentDirId(空)
        var self = this;
        this.callApi("mnote:createNote", options.data, function (res) {
            top.noteCreating = false;
            var res = res.responseData;
            if (res && res["code"] == "S_OK") {                
                BH('note_save_ok');
                //新建笔记不会返回笔记id，得从更新的笔记列表中进行时间排序后获取
                self.set('created', true);
                self.set('showFirstNote', 0);
                self.trigger("reloadListData", {
                    reload: true,
                    isCreate:true,
                    callback : options.callback || function(){}
                });
            } else {
                BH('note_save_fail');
                self.showMsg("和笔记新建失败");
            }
            self.hideMsg();
        });
    },
    //获取笔记列表
    _getNoteList: function (callback) {
        var self = this;
        this.callApi("mnote:getNotes", {}, function (res) {
            var res = res.responseData
            if (res && res["code"] == "S_OK" && res['var']) {
                BH('note_getlist_ok');
                self.set("keyword", ""); //清空搜索关键字
                var list = res['var']['mnote']['normalList'];
                self.set("noteListData", list);
                var isCreated = self.get('created');
                if(isCreated){
                    var noteInfo = list.sort(function(a,b){return b.createTime - a.createTime;})[0];
                    self.set('created',false);
                    self.set({noteId:noteInfo.noteId,noteInfo:noteInfo});                    
                    $('#tb_title').one("click",function(){                
                        $(this).val('');   
                    });
                }
                self.sortData(false); //排序
                if (callback) {
                    callback(self.get("noteListData"));
                }
            } else if (res && /^9{2}/.test(res["error"])) { //若没有认证或注册跳转外网和笔记
                self.noSignDirect();
            }else{
                BH('note_getlist_fail');
            }
        });
    },
    //用于缓存已经打开过的笔记，让点击更快反应
    noteDatabase: {},
    //获取一条笔记内容
    _getNoteDetail: function (options) {
        M139.UI.TipMessage.show("和笔记读取中....");

        var data = {},
            self = this;
        /*
        if (this.noteDatabase[options.noteId]) {
            data = this.noteDatabase[options.noteId];
            options.callback && options.callback(data);
            return;
        }*/
        this.callApi("mnote:getNote", options, function (res) {
            var res = res.responseData;
            if (res && res["code"] == "S_OK") {
                BH('note_getnote_ok');
                data = res['var']['mnote'];
                self.noteDatabase[data.noteId] = data;
                options.callback && options.callback(data);
            } else {                
                BH('note_getnote_fail');
                self.showMsg(res['summary']);
            }
            M139.UI.TipMessage.hide();
        });
    },
    //修改一条笔记
    _saveNote: function (options) {
        var self = this;
        var noteId = this.get('noteId');
        if(!noteId){
            //如果没有笔记
            if(options.isMustCallback){
                options.callback = options.reviewEditArea;
            }
            M139.UI.TipMessage.show("和笔记新建中....");
            self._createNote(options);
            return;
        }
        M139.UI.TipMessage.show("和笔记保存中....");
        options.data.noteId = noteId
        var callback = options.reviewEditArea;

        this.callApi("mnote:updateNote", options.data, function (res) { //更新笔记
            var res = res.responseData;
            if (res && res["code"] == "S_OK") {
                BH('note_save_ok');
                //笔记已经修改，缓存数据删除
                self.noteDatabase[options.noteId] = null;
                M139.UI.TipMessage.show("和笔记保存成功");
                self.trigger("reloadListData", {
                    reload: true,
                    callback: function () {
                        callback && callback();
                    }
                });
            } else {
                BH('note_save_fail');
                self.showMsg("和笔记保存失败");
                self.model.set('isEvernoteBinding', 0);
            }
            M139.UI.TipMessage.hide();           
        });
    },
    //删除一条笔记
    _deleteNote: function () {
        var self = this;
        var noteId = self.get("noteId");
        M139.UI.TipMessage.show("正在删除中...");
        this.callApi("mnote:deleteNote", { noteIds: noteId }, function (res) {
            var res = res.responseData;
            if (res && res["code"] == "S_OK") {
                //本地缓存笔记删除
                self.noteDatabase[noteId] = null;
                self.trigger("reloadListData", {
                    reload: true,
                    callback: function () {
                        //显示下一篇笔记
                        var nextIndex = self.get('nextIndex');
                        if (nextIndex > -1) {
                            $('.notlist .notli').eq(nextIndex).trigger("click"); //jquery 的 trigger方法
                        } else {
                            self.trigger("clearNote");
                        }
                    }
                });
                M139.UI.TipMessage.show("删除成功");
            } else {
                self.showMsg("删除失败");
            }
            self.hideMsg();
        });
    },
    //搜索笔记
    _searchNote: function (keywords) {
        var self = this,
            keyword = $.trim(keywords);
        M139.UI.TipMessage.show("正在搜索中...");
        this.callApi("mnote:searchNote", { keyword: keyword }, function (res) {
            var res = res.responseData;
            if (res && res.code == "S_OK") {
                $('#tip_search').show();
                var sesult = res['var']['mnote'];
                if (sesult.length) {
                    self.set("searchResult", sesult);
                    self.trigger("reloadListData", { reload: false, isSearch: true });
                } else {
                    self.trigger('clearNote');
                    $('#div_notelist').addClass('notlist').html('<div class="notlistNo"><i class="i-smile"></i><p>没有找到相应的笔记</p></div>')
                }
            } else {
                self.showMsg('搜索失败');
            }
            M139.UI.TipMessage.hide();
        });
    },
    //将记事内容通过邮件发给好友
    sendNoteByMail: function (noteData) {
        if (top.$App && top.$App.show) {
            top.$App.show("compose", null, {
                inputData: noteData
            }); //重构版
        } else if (top.CM && top.CM.show) {
            top.CM.show({
                type: "compose",
                subject: noteData.subject,
                content: noteData.content
            }); //老版  兼容重构版
        }
    },
    validateEdit: function (data) { //输入验证
        var validata = data;
        var title = validata.title;
        var content = validata.content;
        if ($.trim(title) == "" || $.trim(title) == "无标题笔记") {
            if ($.trim(content) == "") {
                title = "无标题笔记";
                content = "   "; //空替换为空格
            } else if ($.trim(title) == "") {
                title = content.replace(/<.+?>/g, ' ').substring(0, 50);
            }
        } else {
            if (!$.trim(content)) {
                content = "  "; //空替换为空格
            }
        }
        validata.content = content.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, "\\n").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/"); //转义
        title = title.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, " ").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/");
        return validata;
    },
    //封装一个新旧版本判断的函数 
    noSignDirect: function () {
        if (top.FF) {
            var dialog = top.FF.confirm("使用和笔记需要移动微博账号，现在就注册移动微博？",
            function () {
                if (top.Links.show) {
                    top.Links.show('shequ139');
                }
            },
            function () {
                //click cancel,nothing to do 
            });
            /*dialog.on('close', function(){
                  closeTab();
            });*/
        }

        function closeTab() {
            if (top.$App) {
                top.$App.closeTab();   //调用之后，不能调Links 
            } else if (top.MM) {
                var m = top.MM.currentModule;
                if (m) top.MM.close(m.name);
            }
        }
    },
    //排序列表数据，reloadFlag表示排序结束后是否重新渲染界面
    sortData: function (reloadFlag) {
        var self = this;
        var data = this.get("noteListData");
        if (!data) {
            return
        }
        var order = this.get("order");
        var desc = this.get("desc");
        data = _sort(data);
        function _sort(data) {
            if (order == "createTime" && desc == 1) {
                return data.sort(function (a, b) { return b.createTime - a.createTime; })
            } else if (order == "createTime" && desc == 0) {
                return data.sort(function (a, b) { return a.createTime - b.createTime; })
            } else if (order == "updateTime" && desc == 1) {
                return data.sort(function (a, b) { return b.updateTime - a.updateTime; })
            } else if (order == "updateTime" && desc == 0) {
                return data.sort(function (a, b) { return a.updateTime - b.updateTime; })
            }
        }
        if (reloadFlag) {
            this.trigger("reloadListData", {
                reload: false
            });
        }
    },
	/*
    保存印象笔记
    先做普通保存，普通保存成功后，获取适当操作
     S_OK为成功,OAUTH_BINDING表示需要绑定,NOTE_REPEAT表示笔记重复
    */
    saveEvernote: function(data){
        var self = this;
        self._saveNote(data);
    },
    createbyMnoteId: function(){
        var noteid = this.get('noteId');
        var self = this;
        self.callApi("evernote:createbyMnoteId", {noteId: noteid}, function (res) {
            res.responseData && res.responseData["code"] && self.set('evernoteSave',res.responseData["code"]);
            self.trigger("evernoteSave");
        });
    },
    /*绑定印象笔记接口*/
    bindOauth: function(data){
        this.set('evernoteSave',data);
        this.trigger("evernoteSave");
    },
    /*新建或是覆盖印象笔记*/
    updateEvernote: function(iscreate){
        var currentNoteId = this.get("noteId"),
            self = this;
        if(currentNoteId){
            self.callApi("evernote:createOrReplace", {noteId: currentNoteId, isCreate: iscreate}, function (res) {
                if (res.responseData && res.responseData["code"] == "S_OK") {
                    M139.UI.TipMessage.show('操作成功，笔记内容已保存到印象笔记', {delay: 2000});
                    top.addBehaviorExt({ actionId: 106906, thingId: 4});
                }else if(res.responseData && res.responseData["code"] == "TOKEN_EXPIRED"){
                    self.bindOauth('TOKEN_EXPIRED');
                }else{
                    M139.UI.TipMessage.show('遇到异常，保存失败，请稍后重试', {delay: 2000, className: "msgRed"});
                }
            });
        }
    },
    //列表绑定自定义函数
    renderFunctions: {
        getTitle: function () {
            if(this.DataRow.type.toUpperCase() == "HTML"){
                return "欢迎使用和笔记";
            }
            var title = this.DataRow.title || "";
            return $T.Html.encode(title);
        },
        getSummary: function () {
            if(this.DataRow.type.toUpperCase() == "HTML"){
                return "欢迎使用139邮箱版和笔记 -- 中国移动";
            }
            var summary = this.DataRow.summary || ""
            return $T.Html.encode(summary);
        },
        getTime: function (t) {
            var date = new Date(Number(t));
            return $Date.format("yyyy-MM-dd ", date);
        }
    }
}) //end of extend
); //end of namespace
/***************************************************************************************************************************
*和笔记  右边编辑区域渲染
*
*注意事项：
*1：新建
*   1.需要判断编辑组件是否重置，因为之前渲染的Html欢迎页是不可编辑的。
*2: 删除     
*3: 保存
*4: 修改
*5: 自动保存
*   this.model.set("autoSave", false);   //自动保存监听停止
*   this.model.set("autoSave", true);    //自动保存监听开始
*     self.autoSaveStart();              //自动保存监听开始
*     self.autoSaveStop();               //自动保存监听停止
*
*   自动保存的情况
*  1:新建笔记，在空白笔记中有输入           
*   -当输入时，即标题和文本有变化则自动保存监听计时开始
*   -当输入时，即标题和文本有变化，但在之后的3分钟内又还原成原来标题和文本，自动保存监听停止。
*   -当输入时，标题和文本已经有变化，自动保存监听开始，点击其他记事开始切换时，自动保存监听停止。
*   -当输入时，自动监听开始时，保存之后，自动保存监听停止。
*   2:修改
*   3:删除
*   -点击删除之后，自动保存监听停止。在和笔记中优先影响自动保存监听。
*   4:保存
*   -点击保存之后，自动保存监听停止。在和笔记中优先影响自动保存监听。
*   5:邮件分享
*   -点击邮件分享之后，自动保存监听停止。
*6: 邮件分享
*   -标题或内容为空也可以进行邮件分享。 
*7: 时间面板展开以及编辑组件等
*   1)由于每一个注册的新用户的即使列表中都会默认有一个欢迎引导页面记事，这条记事是Html格式，不可编辑，不可保存，可删除。
*   而现在的和笔记暂时只支持纯文本，不支持Html以及文件附件保存。
*   因此，在对内容格式为html的记事，默认为引导欢迎记事，直接渲染iframe，隐藏编辑组件。
*
*
****************************************************************************************************************************
*/

M139.namespace("M2012.Note.View.EditView", Backbone.View.extend({
    el: "body",
    template: {
        repeat: _.template(['<dl class="form mailClear p_relative">',
            '<dt class="formLine"> 在印象笔记中，发现了相同的笔记。请选择保存方式：</dt>',
            '<dd class="formLine pl_20 mt_10 mb_20"><input type="radio" id="rdo_01" name="radio" checked value="">',
            '<label for="rdo_01">覆盖（原有对应的笔记将被覆盖）</label></dd>',
            '<dd class="formLine pl_20"><input type="radio" id="rdo_02" name="radio" value="">',
            '<label for="rdo_02">新建（原有对应的笔记保留，创建一个新的笔记）</label></dd></dl>',
            '<div class="boxIframeBtn"><span class="bibText"><a href="https://app.yinxiang.com/Login.action;" class="ml_15" target="_blank">进入印象笔记</a></span>',
            '<span class="bibBtn"> <a href="javascript:this.colorCloudNoteview.editView.updateEvernote();" class="btnSure"><span>确 定</span></a></span></div>'].join(''))
    },
    events: {
        "click #btn_create": "createNote",
        "click #btn_delete": "deleteNote",
        "click #btn_save": "saveNote",
        "click #btn_send": "sendNote",
        "click #btn_print": "printNote",
        "click #btn_remind": "remindNote",
        "click #btn_update": "reloadeNote",
		"click #btn_evernote": "saveEvernote"
    },
    initialize: function(options) {
        var self = this;
        self.model = options.model;
        self.initEvents();
        self.editorView = M2012.UI.HTMLEditor.create({
            contaier: $("#mnote_htmlEdiorContainer"),
            blankUrl: "editor_blank.htm?sid=" + top.sid,
            showButton: [ 
                "FontFamily",
                "FontSize",
                "Bold",
                "Italic",
                "UnderLine",
                "FontColor",
                "RemoveFormat",
                "FormatPrinter",
                "AlignCenter", 
                "Undo",
                "Redo",
                "SelectAll",
                "Preview"],
            showMoreButton:true
        });
        /**
        *绑定标题与内容输入框，进行自动保存设置
        * 
        *对比标题以及内容，若没有改动则不会进行自动保存，有改动则会计时1分钟进行保存一次。
        */
        self.editorView.editor.on("keyup", function() {
            var contentBuffer = self.model.get("contentBuffer");       
            var titleBuffer   = self.model.get("titleBuffer");
            var title         = $("#tb_title").val();
            var content       = self.editorView.editor.getHtmlContent();
            if((contentBuffer == content) && (titleBuffer == title)) {
                self.autoSaveStop(); //重置时间
                self.model.set("autoSave", false);
                return;
            } else {
                self.autoSaveStart();//触发自动保存
                self.model.set("autoSave", true);
                return;
            }
        });
        self.editorView.editor.on("focus", function () {
            $('#oderSet').hide();
        });
        
        $('#mnote_htmlEdiorContainer .eidt-body').height($(document.body).height() - 165);
    },
    initEvents:function(){
        var self = this;
        self.model.on("change:noteId", function(data) {
            self.render();
        });
        self.model.on("clearNote", function () {
            self.model.set('noteId', null);
            self.editorView.editor.setHtmlContent('');
            $('#tb_title').val('');
        });
        self.model.on("autoSave", function(msg) { //自动保存监听
            if(msg) {
                self.autoSaveStart();
            } else {
                self.autoSaveStop();
            }
        });
		self.model.on("evernoteSave", function(){
            switch(self.model.get('evernoteSave')){
                case 'OAUTH_BINDING':
				case 'TOKEN_EXPIRED':
                    self.renderBindOauthDialog();
                    break;
                case 'NOTE_REPEAT':
                    self.renderSelectRepeatDialog();
                    break;
                case 'S_OK':
                    M139.UI.TipMessage.show('操作成功，笔记内容已保存到印象笔记', {delay: 2000});
                    top.addBehaviorExt({ actionId: 106906, thingId: 4});
                    break;
                default:
                    break;
            }
        });

        //绑定标题与内容输入框，进行自动保存设置 
        //对比标题以及内容，若没有改动则不会进行自动保存，有改动则会计时1分钟进行保存一次。
        //标题区域
        $("#tb_title").bind({
            keyup: function() {
                var contentBuffer = self.model.get("contentBuffer");       
                var titleBuffer   = self.model.get("titleBuffer");
                var title         = $("#tb_title").val();
                var content       = self.editorView.editor.getHtmlContent();
                if((contentBuffer == content) && (titleBuffer == title)) {
                    self.autoSaveStop(); //重置时间
                    self.model.set("autoSave", false);
                    return;
                } else {
                    self.autoSaveStart();//触发自动保存
                    self.model.set("autoSave", true);
                    return;
                }
            }
        });
        //绑定时间栏展开/收起事件

        $("#toggleTime").click(function(e) { 
            BH('note_title_more');
            var self = $(this);
            var changePart   = $("#note_time");
            var changeAnchor = self.find("i");
            var isExtend     = (changeAnchor.attr("class")).indexOf("i_2tridd") > -1;
            if(isExtend) {
                M139.Text.Cookie.set({
                    name: "mnoteUserState",
                    value: 0
                }); //设置展开状态
                changePart.hide();
                changeAnchor.attr({
                    "class": "i_2trid",
                    "title": "展开"
                });
            } else {
                M139.Text.Cookie.set({
                    name: "mnoteUserState",
                    value: 1
                });
                changePart.show();
                changeAnchor.attr({
                    "class": "i_2tridd",
                    "title": "收起"
                });
            }
        });
        //初始化时间栏展开收起
        var toggleExpand = M139.Text.Cookie.get("mnoteUserState"); //0为收起，1为展开  
        if(toggleExpand && toggleExpand == 1) {
            $("#note_time").show();
            $("#toggleTime").find("i").attr({
                "class": "i_2tridd",
                "title": "收起"
            });
        };

        $('#div_notelist,#btn_create, #btn_send').click(function(){
            var isCreating = self.model.get('isCreating');

            var isEditing = self.model.get('isEditing');
            if(!isCreating && !isEditing){
                return;
            }
            self.saveNote();
            self.model.set({isCreating:false,isEditing:false});
            self.model.trigger("reloadListData", {
                reload: true
            });
        });

        $(document).click(function () {
            $('#oderSet').hide();
        });
    },
    reloadeNote:function(){
        BH('note_update');
        M139.UI.TipMessage.show("数据正在同步中...");
        this.model.set('showFirstNote',0) 
        this.model.trigger("reloadListData", {
            reload: true
        });
    },
    createNote:function(){
        BH('note_create');
        var self = this;
        if (top.noteCreating) {
            return;
        }
        top.noteCreating = true;
        self.model.set('createEmpty',1);
        data = {
            attachmentDirId: "",
            content: "",
            title: "无标题笔记"
        }
        self.model._createNote({
            data:data,
            callback:function(noteInfo){ 
                self.model.set("autoSave", false);     
                 //自动保存关闭  --- 重置计时器                  
                self.autoSaveStop();   
                self.model.set({
                    noteId:noteInfo.noteId,
                    noteInfo:noteInfo
                });
            }
        });
    },
    saveNote: function() {
        BH('note_save');
        var self = this;

        //防止用户一路狂点
        var cancelSave = self.model.get('cancelSave');
        if (cancelSave) {
            console.log('点得太快啦，歇一会儿吧！');
            return;
        }
        self.model.set('cancelSave', 1);
        setTimeout(function () {
            self.model.set('cancelSave', 0);
        }, 500);


        self.model.set("autoSave", false);    //保存完之后，重置自动保存
        var option = {
            data:{
                title: $.trim($("#tb_title").val()) || "无标题笔记",
                content: self.editorView.editor.getHtmlContent(),
                attachmentDirId:''
            },
            reviewEditArea: reviewEditArea
        }        
        function reviewEditArea(){
            var currentId = self.model.get("noteId");
            $("#tb_title").blur();
            $(".notli[noteId='" + currentId + "']").addClass("on").attr("locked", "true");
        }
        //option.data = self.model.validateEdit(option.data); //验证输入信息
        self.autoSaveStop();
        self.model._saveNote(option);
    },
    //自动保存开启
    autoSaveStart: function() { 
        var self = this;
        var intervalId = this.model.get("isEditing");
        if(!intervalId) {
            var autoId = setInterval(function() {
                if(self.model.get("autoSave")) {
                    self.model.set("currentOperation", "自动保存");
                    self.saveNote();
                }
            }, 1 * 60 * 1000);
            self.model.set("isEditing", autoId);
        }
    },
    //自动保存停止
    autoSaveStop: function() { 
        var intervalId = this.model.get("isEditing");
        if(intervalId) {
            clearInterval(intervalId);
        }
        this.model.set("isEditing", false);
    },
    deleteNote: function() {
        BH('note_delete')
        var self = this;
        self.autoSaveStop(); //关闭自动保存
        var currentNoteId = self.model.get("noteId");

        if(!currentNoteId) {
            $Msg.alert("请选择您要删除的笔记");
            return;
        }
        //删除确定   单实例
        var deleteConfirm  =  self.model.get("delteVar");
        if(!deleteConfirm){
                deleteConfirm = M139.UI.Popup.create({
                target: $("#btn_delete").parent().parent()[0],
                icon: "iueding_warn",
                width: "200",
                buttons: [{
                    text: "删除",
                    cssClass: "btnRed",
                    click: function() {
                        self.model.set("currentOperation", "删除");
                        self.model._deleteNote(); //重新取一次noteId
                        deleteConfirm.close();
                    }
                }, {
                    text: "取消",
                    click: function() {
                        deleteConfirm.close();
                    }
                }],
                content: "删除后，笔记不可恢复"
            });
            self.model.set("delteVar",deleteConfirm);
        }
       
        deleteConfirm.render();
    },
    //邮件分享
    sendNote: function() {
        BH('note_mail');
        this.model.set("autoSave", false);          //自动保存计时停止
        var title = $("#tb_title").val(),
            content = this.editorView.editor.getHtmlContent();
        if (!title && !content) {
            this.model.showMsg('请选择笔记！');
            return;
        }
        var data = {};
        data.subject = (title).replace(/\\/ig, ""); //邮件分享的content可以为空
        data.content = (content).replace(/\\/ig, "\\");
        this.model.sendNoteByMail(data);
    },
    //笔记打印
    printNote: function () {
        BH('note_print');
        var noteId = this.model.get('noteId');
        if (!noteId) {
            top.$Msg.alert('请选择要打印的笔记!')
            return;
        }
        window.open("/m2012/html/note/printnote.html?noteId=" + noteId);
    },
    //笔记添加提醒
    remindNote: function () {
        top.addBehaviorExt({ actionId: 104926, thingId: 0 });        
        var content = $("#tb_title").val();
        var currentNoteId = this.model.get("noteId");
        if (!currentNoteId) {
            top.$Msg.alert('请选择要添加的笔记！');
            return;
        }
        top.$Evocation.create({ content: content, type: "remind", title: "添加提醒" })
    },
	/*
    * 点击保存印象笔记
    * */
     saveEvernote: function(){
        var self = this;
		top.addBehaviorExt({ actionId: 106905, thingId: 11 });
         var option = {
             data:{
                 title: $.trim($("#tb_title").val()) || "无标题笔记",
                 content: self.editorView.editor.getHtmlContent(),
                 attachmentDirId:''
             },
             reviewEditArea: reviewEditArea,
             isMustCallback:true
         };

        /**
         *重新渲染记事列表页,即每次修改或新建成功之后会聚焦或高亮到该条记事
         */
        function reviewEditArea(){
            //self.renderData();
            var currentId = self.model.get("noteId");
            $("#tb_title").blur();
            $(".notli[noteId='" + currentId + "']").addClass("on").attr("locked", "true");
            self.model.createbyMnoteId();
        }
        this.model.saveEvernote(option);
    },
    updateEvernote: function(){
        var isCheck = $('#rdo_01').attr('checked') == 'checked' ? 1 : 0;
        top.addBehaviorExt({ actionId: 106906, thingId: (isCheck == 0 ? 2 : 3)});
        this.model.updateEvernote(isCheck);
        this.dialog.close();
    },
    render: function() {
        var noteInfo = this.model.get('noteInfo');          //当前记事内容对象
        if(!noteInfo){
            return;
        }
        var noteId = this.model.get('noteId');
        if(noteId != noteInfo.noteId){
            return;
        }
        this._renderData(noteInfo);
    },
    _renderData: function(noteInfo) {
        var content = noteInfo.content || '',               //右边编辑渲染内容
            title = noteInfo.title;                         //右边编辑渲染标题
        this.model.set("currentOperation", "记事读取");     //记录当前操作事件
        this.model.set("contentBuffer", content);           //缓存，以用作对比编辑  主要用于判断是否自动保存
        this.model.set("titleBuffer", title);        //同上
        if(noteInfo.noteType == "HTML")  //欢迎页
            content = this.welcomeHTML();
        this.editorView.editor.setHtmlContent(content);     //渲染正文
        //渲染标题及时间
        $("#tb_title").val(title);               
        $("#sp_createTime").html("创建时间:" + $Date.format("yyyy年MM月dd日 hh:mm:ss", new Date(Number(noteInfo.createTime))));
        $("#sp_updateTime").html("修改时间:" + $Date.format("yyyy年MM月dd日 hh:mm:ss", new Date(Number(noteInfo.updateTime)))).attr("title", "修改时间:" + $Date.format("yyyy年MM月dd日 hh:mm:ss", new Date(Number(noteInfo.updateTime))));
    },
    welcomeHTML:function(){
        return ['<!DOCTYPE HTML>',
         '<html>',
         '<head>',
            '<script type="text/javascript">',
         'document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];',
         'var contentHTML = window.parent.colorCloudNoteview.model.get("contentBuffer");',
         'document.write(contentHTML);',
         '</script>',
            '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
            '<meta charset="UTF-8">',
            '<title>欢迎使用139邮箱版和笔记 -- 中国移动</title>',
            '<meta name="description" content="和笔记">',
            '<meta name="author" content="Huawei">',
            '<meta name="keywords" content="和笔记,笔记,中国移动,彩云,mcloud,mobile note,note,notes,mobilenote,mnote">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<style>body,h1,h2,h3,h4,h5,h6,p,dl,dt,dd,ul,li,img{margin:0;padding:0;border:0;outline:0;font-family:"Microsoft YaHei", SimSun, "Segoe UI", Verdana, Arial, Sans-Serif;font-size:100%;color:#3E3E3E;word-break:break-all;}a{color:#3E3E3E;}.header,.use,.main,.download,.contact{border-bottom:1px dashed #737373; width:100%; margin-bottom:5px;padding-bottom: 5px;} .contact{border-bottom:0 none; }.header h1{ color:#fff; font-size:16px; background:#E9482B;padding:8px 20px;float: left;margin-bottom: 10px;text-align:center;} .header p{ padding-left:20px; font-size:12px;margin:10px 0 5px;line-height:1.5;clear:both;} h2{ font-size:15px; color:#C83920; line-height:22px; padding-left:20px;} .use ul,.main ul{ margin:5px auto 5px 20px; padding-left:20px; } .use ul,.main li{ font-size:12px;line-height:24px;} .main h3{ font-size:14px; padding-left:20px;} .download .client{margin-left:40px;}.download a{ display:inline-block; font-size:12px; margin:5px 20px 5px 0px; } .contact dl{ margin:0 0 0 40px;} .contact dt,.contact dd{font-size:11px; display:inline; } .contact dd{ margin-right:5px; } dd.noblank{ margin-right:0; } .contact p{font-size:11px; line-height:20px;padding-left:40px;}.red{color: #C83920;} </style>',
         '</head>',
         '<body>',
         '<div style="padding:10px">',
            '<div class="header">',
                '<h1> <b>欢迎使用139邮箱版和笔记！</b>',
                '</h1>',
                '<p>',
                    '和笔记是中国移动推出的一款云笔记产品，为用户提供文字、图片、音频、视频、地理位置等多种形式的记录，使用即享有16G免费存储空间。',
                '</p>',
            '</div>',
            '<div class="use">',
                '<h2> <b>在139邮箱中，您可以这样使用和笔记：</b>',
                '</h2>',
                '<ul>',
                    '<li>提取邮件中的重要事项，或者摘取“精品订阅”中您喜欢的内容，随时保存到和笔记；</li>',
                    '<li>看邮件时产生了想法和灵感，随手记录到邮箱版和笔记；</li>',
                    '<li>通过邮件，将笔记方便的分享给朋友。</li>',
                '</ul>',
            '</div>',
            '<div class="main">',
                '<h2>下载客户端</h2>',
                '<ul>',
                    '<li>',
                        '<a href="http://mnote.weibo.10086.cn/MobileNote.apk">android客户端</a>',
                    '</li>',
                    '<li>',
                        '<a href="http://mnote.weibo.10086.cn/MobileNote.exe">windows客户端</a>',
                    '</li>',
                    '<li>',
                        '<a href="https://itunes.apple.com/us/app/cai-yun-bi-ji/id577725854?ls=1&amp;mt=8">iphone/ipad客户端</a>',
                    '</li>',
                '</ul>',
            '</div>',
            '<div class="main">',
                '<h2>',
                    '<b>和笔记客户端的特色功能：</b>',
                '</h2>',
                '<ul>',
                    '<li>',
                        '<span class="red">4种记录终端</span>',
                        '你可以下载Android\Windows\iPhone三种客户端或登录网页版记录笔记；',
                    '</li>',
                    '<li>',
                        '<span class="red">多种形式记录</span>',
                        '您可以使用手机\电脑创建文字、图片、语音、视频、地理位置的笔记；',
                    '</li>',
                    '<li>',
                        '<span class="red">跨平台、多终端同步</span>',
                        '任何时间任何地点使用手机\电脑记录工作、生活、学习，帮您实现一端记录，多终端查看；',
                    '</li>',
                    '<li>',
                        '<span class="red">业界唯一免费短信提醒</span>',
                        '您可以对笔记设置传统的铃声提醒、震动提醒，还可以设置免费的短信提醒；',
                    '</li>',
                '</ul>',
            '</div>',

            '</div>',
         '</body>',
         '</html>'].join("");
    },
	/*弹出绑定印象笔记弹层*/
    renderBindOauthDialog: function(){
        var self = this;
        top.$App.showOauthDialog({func:function(){
            self.model.set('isEvernoteBinding',0);
            self.model.bindOauth();
        }});
    },
    renderSelectRepeatDialog: function(){
        var self = this;
        if(self.dialog){
            self.dialog.close();
            self.dialog = null;
        }
        self.dialog = $Msg.showHTML(self.template.repeat,{
            width: "385px",
            dialogTitle: "保存到印象笔记",
            onClose: function() {
                self.dialog = null;
            }
        });
    }


}) //end of extend
); //end of namespace
/**和笔记-- 记事列表
*  总括：
*  1:记事列表渲染
*  注：用repeater生成Dom并append的时候不能再进行渲染，因为记事标题或内容会出现script等Xss内容。
*  2:记事列表高亮事件
*  3:记事列表行点击事件
*/
M139.namespace("M2012.Note.View.ListView", Backbone.View.extend({
    el: "body",
    template: "",
    events: {
        "click .notli": "rowClick",
        "click #btn_search": "searchNote"
    },
    initialize: function(options) {
        this.model = options.model;
        this.initEvents();
    },
    initEvents:function(){
        var self = this;
        //加载记事列表数据
        self.model.on("reloadListData", function(args) {
            var reload = args.reload;
            self.render(reload, function() {
                if(args.callback) {
                   args.callback();
                }
            });
        });
        $('#tip_search a').click(function(){
            $(this).parent('#tip_search').hide();
            $('#tb_search').val('').trigger('blur');
            self.model.set({
              searchResult:null,
              showFirstNote:0
            });
            self.render(false);

        });

        //为搜索功能绑定键盘功能
        $("#tb_search").bind({
            keyup: function(e) {
                var _self = $(this);
                var key = e.keyCode;
                switch(key){
                    case 13:    //回车键   
                    self.model.searchNote($("#tb_search").val());
                    break;
                    case 18:    //Alt键 
                    break;
                    case 46:   //delete键
                    var val = _self.val();
                    if(val) _self.val(val.substring(0,val.length-1));  //模拟退格
                    break;
                    default:
                }
            }
        });

        //找到需要变化的li节点       
        function findParentList(obj) {
            var el = obj;
            var clz = el.attr("class");
            if(clz && clz.indexOf("notli") > -1 && clz.indexOf("notlititle") == -1) {
              return el;
            } else if(clz && clz.indexOf("notli") > -1 && clz.indexOf("notlititle") == -1) {
              return false;
            }
            el = el.parent();
            return arguments.callee(el);
        }
        //记事行的高亮效果
        $("#div_notelist").bind({
            mouseover: function(e) {
              var self = $(this);
              var target      = e.target;
              var collection  = self.find(".notli");
              var listDom     = findParentList($(target));
              var index       = collection.index(listDom);
              if(index > -1) {
                var isActived = (listDom.attr("locked") == "true");
                if(!isActived) {
                  listDom.addClass("hover");
                }
              }
            },
            mouseout: function(e) {
                var self = $(this);
                var target      = e.target;
                var collection  = self.find(".notli");
                var listDom     = findParentList($(target));
                var index       = collection.index(listDom);
                if(index > -1) {
                  var isActived = (listDom.attr("locked") == "true");
                  if(!isActived) {
                    listDom.removeClass("hover");
                  }
                }
            },
            click: function(e) {
                var _self = $(this);
                var target      = e.target;
                var collection  = _self.find(".notli");
                var listDom = findParentList($(target));
                var index = collection.index(listDom);
                if(index > -1) {
                    var isActived = (listDom.attr("locked") == "true");
                    if(!isActived) {
                        _self.find(".notli").removeClass("on").removeAttr("locked"); //重置
                        listDom.addClass("on").attr("locked", "true").removeClass('hover');
                    }
                }
            
                if (collection.length > 1) {
                    var nexindex = index == collection.length - 1 ? 0 : index;
                    self.model.set('nextIndex', nexindex);
                } else {
                    self.model.set('nextIndex', -1);
                }
            }
        });
    },
    //行点击事件
    rowClick: function(e) {
        BH('note_rowclick');
        var self = this;
        var target      = e.target || e.srcElement;
        var noteId      = $(target).attr("noteId") || $(target).parents("[noteId]").attr("noteId");
        var noteDetail    = this.model._getNoteDetail({noteId:noteId,callback:function(noteInfo){
            //编辑信息量，判断是否在编辑，用于判断自动保存
            var isEditing   = self.model.get("autoSave");   

            var setCollection = {       
                contentType: noteInfo['noteType'] || "TEXT", //设置内容类型 用于判断欢迎页面的HTML
                rowClick: true,           //重要  设置row点击事件 不与新建有冲突
                noteId: noteId,           //必须在noteId改变之前先赋值contentId
                noteInfo:noteInfo,
                autoSave: false
            }
            self.model.set(setCollection);
            self.model.trigger("autoSave", 0);
        }});
    },
    searchNote: function(e) {
        BH('note_search');
        var self = this;        
        var value = $("#tb_search").val();
        if($.trim(value) == ""){
          $("#tb_search").val('');
          return;
        } if (value == "搜索'和笔记'") {
            return
        }
        this.model._searchNote(value);
    },
    render: function(reload, callback) {
        var self = this;
        if(!reload) { //用本地数据刷新
          var data = this.model.get("searchResult");
          if(!data){
            data = this.model.get("noteListData");
            $('#tip_search').hide();
          }else{
            self.model.set('showFirstNote',0)
          }
          this.model.set("searchResult",null);
          dataBind(data);
          this.model.set("searchResult", null);
        } else {      //重新加载
            $('#tip_search').hide();
            this.model._getNoteList(function(dataSource) {
            dataBind(dataSource);            
            M139.UI.TipMessage.hide();
          });
        }
      /**
      *组装list Html进行渲染
      */
      function dataBind(dataSource) {
          var templateStr = $("#template_notelist").val();
          //排序是修改时间还是创建时间
          templateStr = templateStr.replace(/orderSet/, self.model.get("order"))
          var rp          = new Repeater(templateStr);
          var filterHtml  = ""; //过滤处理展示Html
          self.repeater   = rp;
          rp.model        = self.model;
          rp.view         = self;
          rp.Functions    = self.model.renderFunctions;
          var html        = rp.DataBind(dataSource); //数据源绑定后即直接生成dom             
          $("#div_notelist")[0].innerHTML = html;
          if(callback) {
              callback();
          }
          if (self.model.get('showFirstNote') == 0) {
              $('.notlist .notli').eq(0).trigger("click"); //jquery 的 trigger方法
              self.model.set({ 'showFirstNote': 1 });
          }
      }
    }
}) //end of extend
); //end of namespace
/*
*
*和笔记mainView
*总括：
*事件：1.记事列表区域和记事编辑区域大小自适应绑定 2.分割栏拖转事件绑定 3.排序选项下拉菜单绑定 
*渲染：所有输入框以及富文本输入框的 placeholder 采用label浮层处理，并将该label绑定当前表单聚焦事件。
*
*/

M139.namespace("M2012.Note.View.Main", Backbone.View.extend({
    el: "",
    template: "",
    events: {
        //"click .mtitle":"subjectClick"
    },
    initialize: function () {
        var self = this;
        self.model = new M2012.Note.Model();
        self.initEvents();
    },
    initEvents: function () {
        var self = this;

		BH("note_page_load");

        //和笔记自适应绑定
        setTimeout(adaption, 100);
        $(window).resize(function () {
            adaption();
        });
        function adaption() {
            var totalWidth = $(document.body).width(),
                totalHeight = $(document.body).height(),
                rightEditArea = $('#mnote_htmlEdiorContainer .eidt-body');
            leftList = $('#div_notelist');
            if (rightEditArea) {
                rightEditArea.height(totalHeight - 140);
                leftList.height(totalHeight - 106)
            }
        };

        //关闭记事页 监听记事编辑
        if (top.$App) {
            top.$('#divTab li[tabid=mailbox_1]').show()
            top.$App.on("closeTab", function (args) {
                if (args.name && args.name.indexOf('note') > -1)
                    return oncloseBind(args);
            });
        } else {
            window.onModuleClose = function () {
                return oncloseBind();
            }
        }

        //关闭Tab标签时提示。
        function oncloseBind(args) {
            var isEditing = self.model.get("autoSave");
            if (isEditing) {
                self.model.trigger("autoSave", 0);  //重置TIME
                self.model.set("autoSave", false);
                var isClose = confirm("关闭笔记页，未保存的内容将会丢失，是否关闭？");
                if (!isClose) {
                    self.model.trigger("autoSave", 1); //触发自动保存
                    self.model.set("autoSave", true);
                    if (args) {
                        args.cancel = true;
                        return;
                    } else {
                        return false;
                    }
                } else {
                    return true
                }
            }
        }

        //初始化按钮状态
        $("#tb_search").bind({
            focus:function(){
                _self = $(this);
                var value = _self.attr('placeholder1');
                if (_self.hasClass('gray') && value == _self.val()) {
                    _self.removeClass('gray').val(''); 
                }
            },
            blur:function(){
                _self = $(this);
                if ($.trim(_self.val()) == "") {
                    var value = _self.attr('placeholder1');
                    _self.val(value).addClass('gray');
                }
            }
        })

        //排序点击事件
        $('#btn_order').click(function () {
            BH('note_sort');
            var html = self.getOrderHtml();
            $('#oderSet').html(html).show().find('li').click(function () {
                $('#oderSet i').prop('class','');
                var desc = self.model.get('desc') ? 0 : 1;
                var type = $(this).attr('type');
                $(this).find('i').addClass(self.descClass[desc]);
                self.model.set({ order: type, desc: desc });
                self.model.sortData(true);
            });
            return false;
        });
    },

    descClass:['i_c_upB', 'i_c_downB'],

    getOrderHtml: function () {
        var order = this.model.get("order"),
            desc = this.model.get("desc");
        var template = '<li class="cur" type="@type"><a href="javascript:;"><i class="@class"></i><span class="text">@text</span></a></li>';
        var item = ['createTime', 'updateTime'], descClass = this.descClass, text = { createTime: '创建时间', updateTime: '修改时间' };
        var i = 0; len = item.length, str = '';
        for (; i < len; i++) {
            var iClass = order == item[i] ? descClass[desc] : '';
            str += template.replace(/@text/, text[item[i]])
                .replace(/@class/, iClass)
                .replace(/@type/, item[i]);
        }
        return '<ul>' + str + '</ul>';
    },
    render: function (isRendered) {
        var self = this;
        this.listView = new M2012.Note.View.ListView({ model: this.model });
        this.listView.render(true);
        this.editView = new M2012.Note.View.EditView({ model: this.model });
        this.editView.render();
    }
}) //end of extend
); //end of namespace

$(function () { //main函数入口
    colorCloudNoteview = new M2012.Note.View.Main();
    colorCloudNoteview.render();
});
﻿/**
 * @fileOverview 定义HTML编辑器
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.Model.ModelBase;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.Model
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.Model", {});


    M139.namespace("M2012.UI.HTMLEditor.Model.Editor", superClass.extend(
     /**
        *@lends M2012.UI.HTMLEditor.Model.Editor.prototype
        */
    {
        /** 编辑器基础类
        *@constructs M2012.UI.HTMLEditor.Model.Editor
        *@extends M139.Model.ModelBase
        *@param {Object} options 初始化参数集
        *@param {HTMLElement} options.frame 必选参数，编辑区域的iframe对象
        *@param {HTMLElement} options.textArea 存放存文本内容的文本框对象（如果不使用纯文本模式，可以不传该参数）
        *@example
        */
        initialize: function (options) {
            var This = this;
            if (typeof options.frame != "object") {
                throw "缺少参数options.frame";
            }

            /**
            *编辑器是否加载完成进入可用状态
            *@field
            *@type {Boolean}
            */
            this.isReady = false

            /**
            *编辑器是否为html模式
            *@field
            *@type {Boolean}
            */
            this.isHtml = true;

            /**
            *编辑器iframe对象
            *@field
            *@type {HTMLIframe}
            */
            this.frame = options.frame;
            /**
            *编辑器iframe的jQuery对象
            *@field
            *@type {jQuery}
            */
            this.jFrame = $(this.frame);

            /**
            *编辑区iframe的window对象
            *@field
            *@type {Window}
            */
            this.editorWindow = null;

            /**
             *编辑区iframe的document对象
             *@field
             *@type {HTMLDocument}
            */
            this.editorDocument = null;

            /**
             *编辑区iframe的document的jQuery对象
             *@field
             *@type {jQuery}
            */
            this.jEditorDocument = null;

            /**
             *存放纯文本的文本框set
             *@field
             *@type {HTMLElement}
            */
            this.textArea = options.textArea || this.frame.ownerDocument.createElement("textarea");

            /**
             *存放纯文本文本框的jQuery对象
             *@field
             *@type {HTMLElement}
            */
            this.jTextArea = $(this.textArea);

            M139.Iframe.domReady(this.frame, function () {
                This.onReady();
            });

            return superClass.prototype.initialize.apply(this, arguments);
        },
        defaults: {
            name: "M2012.UI.HTMLEditor.Model.Editor",
            printerMode:"off" //格式刷状态
        },
        /**@inner*/
        onReady: function () {
            this.isReady = true;


            this.editorWindow = this.frame.contentWindow;
            this.editorDocument = this.frame.contentWindow.document;
            this.jEditorDocument = $(this.editorDocument);
            this.editorDocument.body._obj = this ;
            this.initEvents();

            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#ready
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("ready",function(e){});
            */
            this.trigger("ready");

        },

        /**
         *光标选择文字区域发生变化
         *@inner
         */
        onBookMarkChange: function () {
            if(this.get("printerMode") != "off"){
                var selectedFormat = this.getSelectedStyle();
                var formatForPrint = this.get("formatForPrint");
                if(!this.utilDeepEquals(selectedFormat,formatForPrint)){
                    
                    this.printFormat(formatForPrint);//格式化选中的内容
                }
            }

            /**光标选择区域发生变化
            * @name M2012.UI.HTMLEditor.Model.Editor#bookmarkchange
            * @event
            * @param {Object} e 事件参数
            * @example
            editor.on("bookmarkchange",function(e){});
            */
            this.trigger("bookmarkchange",{
                selectedStyle: this.getSelectedStyle()
            });

        },

        /**
         *判断2个对象的属性是否相等
         *@inner
         */
        utilDeepEquals:function(o1,o2){
            for(var p in o1){
                if(o1[p] !== o2[p]){
                    return false;
                }
            }
            return true;
        },

        /**@inner*/
        initEvents: function () {
            var This = this;
            //屏蔽可编辑区的脚本异常
            this.editorWindow.eval("window.onerror=function(){return true}");

            this.jEditorDocument.keydown(function (e) {
                var returnValue = This.onEditorFrameKeyDown(e);
                formatPrintOff(e);
                return returnValue;
            }).keyup(function (e) {
                This.onEditorFrameKeyUp(e);
            }).mousedown(function(e){
                This.onEditorFrameMouseDown(e);
            }).mouseup(function(e){
                This.onEditorFrameMouseUp(e);
            }).click(function () {
                This.onFocus();
            });

            this.jEditorDocument.find('body').on('paste',function(e){
                This.onPaste(e);
            });

            try {
                var edWin = this.editorWindow;
                M139.Event.GlobalEvent.on("click", function (e) {
                    if (e.window != edWin) {
                        if (This.focused) {
                            This.onBlur();
                        }
                    }
                });
                //编辑区iframe触发全局的鼠标键盘事件
                new M139.Event.GlobalEventManager({ window: this.editorWindow });

            } catch (e) {
                
            }

            $(document).on("keydown",formatPrintOff);
            var esc = M139.Event.KEYCODE.Esc;
            function formatPrintOff(e) {
                if (e.keyCode == esc) {
                    //退出格式刷
                    This.setFormatPrintOff();
                }
            }
            
            this.initWatchSelectChange();

            //ie下实现支持撤销
            this.initHistory();
        },

        /**
         *当获得焦点触发事件
         */
        onFocus: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("focus",function(e){});
            */
            this.trigger("focus");
            this.focused = true;
        },
        /**
         *当失去焦点触发事件
         */
        onBlur: function () {
            /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.Model.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("blur",function(e){});
            */
            this.trigger("blur");
            this.focused = false;
        },
        /**
         *右键粘贴
         */
        onPaste: function (e) {
            /**
                * @name M2012.UI.HTMLEditor.Model.Editor#paste
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("paste",function(e){});
            */
            this.trigger("paste", e);
        },

        //实现监控选择区域变化
        //todo 实现方式要改，这个有时候会不触发
        /**@inner*/
        initWatchSelectChange:function(){
            var This = this;
            try{
                var selEl = this.getSelectedElement();
                var selCnt = this.getSelectedText();
                var selSelStyle = this.getSelectedStyle();
            }catch(e){}

            this.jEditorDocument.keydown(selChange).mouseup(selChange);
            this.on("afterexeccommand",selChange);
            function selChange(){
                var newSelEl = This.getSelectedElement();
                var newSelCnt = This.getSelectedText();
                var newSelStyle = This.getSelectedStyle();
                if(selEl !== newSelEl || selCnt !== newSelCnt || !This.utilDeepEquals(selSelStyle,newSelStyle)){
                    This.onBookMarkChange();
                }
                selEl = newSelEl;
                selCnt = newSelCnt;
                selSelStyle = newSelStyle;
            }
        },

        /**
         *在ie下实现手动的编辑记录（支持撤销和重做）
         *@inner
         */
        initHistory: function () {
            var This = this;
            //实现撤销功能
            var historyStack = [];
            var redoStack = [];
            var supportRedoMode = this.supportRedoMode = $B.is.ie;
            var history = this.history = {
                add: function () {
                    var len = historyStack.length;
                    var newHistory = {};
                    newHistory.html = This.editorDocument.body.innerHTML;
                    if (len === 0 || historyStack[len-1].html !== newHistory.html) {
                        if ($.browser.msie) {
                            newHistory.bookmark = This.getBookmarkData();
                        }
                        historyStack.push(newHistory);
                        if (historyStack.length > 11) {
                            historyStack.shift();
                        }
                        redoStack.length = 0;
                    }
                },
                undo: function () {
                    if (historyStack.length == 0) return;
                    history.add();
                    if (historyStack.length < 2) return;
                    redoStack.push(historyStack.pop());
                    var obj = historyStack[historyStack.length - 1];
                    this.goHistory(obj);
                },
                redo: function () {
                    if (redoStack.length == 0) return;
                    var obj = redoStack.pop();
                    this.goHistory(obj);
                    historyStack.push(obj);
                },
                goHistory: function (obj) {
                    //回退历史 ie
                    This.editorDocument.body.innerHTML = obj.html;
                    var range = This.editorDocument.body.createTextRange();
                    if ($B.is.ie) {
                        This.moveToBookmark(obj.bookmark);
                    }
                },
                //定时监控
                startWatch: function () {
                    This.historyTimer = setInterval(history.add, 3000);
                },
                init: function () {
                    if (this.hasInit) return;
                    this.hasInit = true;
                    //如果支持自定义的撤销
                    if (supportRedoMode) {
                        this.add();
                        this.startWatch();
                        This.on("beforeexeccommand", history.add);
                        This.on("afterexeccommand", history.add);
                    }
                }
            };


            //实现保存ie的bookmark
            if ($B.is.ie) {
                //fixed ie9ie10滚动的时候触发activate，恢复焦点造成的焦点老是跳的问题
                if ($B.is.ie && $B.getVersion() >= 9) {
                    this.jEditorDocument.on("mousedown", function () {
                        This.isMouseDown = true;
                    });
                    this.jEditorDocument.on("mouseup", function () {
                        This.isMouseDown = false;
                    });
                }
                this.jEditorDocument.on("beforedeactivate", function () {
                    //console.log("beforedeactivate");
                    This.saveBookMark();
                }).on('activate', function () {
                    //console.log("actived");
	//	$(this.editorDocument.body).on('focus', function () {
                    history.init();
                    if (This._keepBookmark) {
                        if ($B.is.ie && $B.getVersion() >= 9) {
                            if (This.isMouseDown) {
                                return;
                            }
                        }
                        //console.log("moved to bookmark");
                        This.moveToBookmark(This._keepBookmark);
                        This._keepBookmark = null;
                    }
                });
                setTimeout(function () {
                    history.init();
                }, 0);
            } else if($B.is.ie11) {
	            this.jEditorDocument.on("beforedeactivate", function () {
                    var selection = This.getSelection();
                    This.ie11BookMark = {
	                    node: selection.focusNode,
                        offset: selection.focusOffset
                    };
                });
            }
        },

        _keepBookmark: null,
        //保存光标选中的历史
        saveBookMark:function(){
            this._keepBookmark = this.getBookmarkData();
        },
        //根据历史记录设置光标
        moveToBookmark:function(bk){
            var doc = this.editorDocument;
            if (!bk || !bk.bookmark) return;
            var range = doc.body.createTextRange();
            var textLength = doc.body.innerHTML.length;
            range.moveToBookmark(bk.bookmark);
            var copy = range.duplicate();
            var startOffset = copy.moveStart("character", -textLength);
            var endOffset = copy.moveEnd("character", textLength);
            if (startOffset != bk.startOffset || endOffset != bk.endOffset) {
                range.moveStart("character", startOffset - bk.startOffset);
                range.moveEnd("character", endOffset - bk.endOffset);
            }
            try {
                range.select();
            } catch (e) { }
        },
        getBookmarkData:function () {
            var doc = this.editorDocument;
            var range;
            //return {};
            if(doc.selection) {
	            range = doc.selection.createRange();
            } else {
                //range = doc.createRange();	// 错，这个没有BookMark API
                //throw new Error("keep focus caret ERROR");
                range = doc.body.createTextRange();
            }
            var textLength = doc.body.innerHTML.length;
            var result = {};
            if (range.getBookmark) {//选中图片/表格,无法调用getBookmark
                result.bookmark = range.getBookmark();
                result.startOffset = range.moveStart("character", -textLength);
                result.endOffset = range.moveEnd("character", textLength);
            }
            return result;
        },

        /**@inner*/
        onEditorFrameKeyDown: function (e) {
            var code = e.charCode || e.keyCode;
            if (code == 9) {//tab键
                var strTab = "&nbsp;&nbsp;&nbsp;&nbsp;";
                var sel = this.getSelection();
                var range = this.getRangeObject(sel);
                if ($.browser.msie) {//ie  
                    try {
                        range.pasteHTML(strTab);
                    } catch (e) { }
                } else {
                    var fragment = range.createContextualFragment(strTab);
                    var lastChild = fragment.lastChild; //获得DocumentFragment的末尾位置  
                    range.insertNode(fragment);
                    range.setEndAfter(lastChild);//设置末尾位置  
                    range.collapse(false);//合并范围至末尾  
                    sel.removeAllRanges();//清除range  
                    sel.addRange(range);//设置range  
                }
                M139.Event.stopEvent(e);
            } else if (code == 13 && !e.ctrlKey && !e.shiftKey) {
                //回车换行
                if ($.browser.msie) {
                    var sel = this.getSelection();
                    var range = this.getRangeObject(sel);
                    try {
                        var o = range.parentElement();
                        while (o) {
                            if (o.tagName == "P" && o == this.editorDocument.body.firstChild && this.editorDocument.body.childNodes.length == 1) {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            if (!/^(?:td|body|span|font|i|em|b)$/i.test(o.tagName)) {
                                break;
                            } else if (o.tagName == "TD" || o.tagName == "BODY") {
                                this.execCommand("formatblock", "<div>");
                                break;
                            }
                            o = o.parentNode;
                        }
                    } catch (e) { }
                }

            } 
            //撤销
            if (e.ctrlKey && this.supportRedoMode) {
                if (code == 90) {
                    this.undo();
                    M139.Event.stopEvent(e);
                } else if (code == 89) {
                    this.redo();
                    M139.Event.stopEvent(e);
                }
            }
            
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keydown
                * @event
                * @param {Object} e 事件参数
                * @example
                * todo: 坑。。。绑定事件还是处理事件，会引起误解
                editor.on("keydown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keydown", e);

            return e.returnValue;
        },
        onEditorFrameKeyUp:function(e){
            /**抛出键盘事件
                * @name M2012.UI.HTMLEditor.Model.Editor#keyup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("keyup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("keyup", e);
        },
        onEditorFrameMouseDown:function(e){
            /**抛出鼠标下按事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mousedown
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mousedown",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mousedown", e);
        },
        onEditorFrameMouseUp:function(e){
            /**抛出鼠标松开事件
                * @name M2012.UI.HTMLEditor.Model.Editor#mouseup
                * @event
                * @param {Object} e 事件参数
                * @example
                editor.on("mouseup",function(e){
                    console.log(e.keyCode);
                });
            */
            this.trigger("mouseup", e);
        },

        /**不晓得干嘛用的，控件粘贴图片要做处理？*/
        replaceImage: function (fileName, uri) {
            this.editorWindow.focus();
            var imgs = this.editorDocument.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf("file:") >= 0 && unescape(imgs[i].src).indexOf(unescape(fileName)) > 0) {
                    imgs[i].src = uri;
                }
            }
        },

        focus:function(){
            try {
                this.editorWindow.focus();
            } catch (e) { }
        },

        //获取页面上选中的文字
        getSelectedText:function () {
            var win = this.editorWindow;
            if (win.getSelection) {
                return win.getSelection().toString();
            }else if(win.document.getSelection){
                return win.document.getSelection();
            }else if (win.document.selection){
                return win.document.selection.createRange().text;
            }
            return "";
        },

        /**
         *光标处插入图片
         *@param {String} uri 要插入的图片地址
         */
        insertImage: function (url) {
            var sel, range;

            this.editorWindow.focus();
            sel = this.getSelection();
            range = this.getRangeObject(sel);

            if ($B.is.ie && $B.getVersion() < 9) {  //IE678下outerHTML，pasteHTML，innerHTML方法插入图片，图片的路径会是绝对路径
                var html = M139.Text.Utils.format("&nbsp;&nbsp;<img crs='{0}' src='{0}' />",[url]);

                if (sel.type.toLowerCase() == 'control') {
                    range.item(0).outerHTML = html;
                } else {
                    try {
                        range.pasteHTML(html);
                    } catch (e) {
                        this.editorDocument.body.innerHTML = html + this.editorDocument.body.innerHTML;
                    }
                }
                $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                    this.src = url;
                    $(this).removeAttr('crs');
                });
            } else {
	            this.insertHTML("&nbsp;&nbsp;");
                this.execCommand("InsertImage", url);
            }

			// IE下默认会选择图片，不清除选区，插入会变成替换
			if ($B.is.ie) {
				range = this.getRangeObject();
				range.collapse(false); //合并范围至末尾
                sel.removeAllRanges && sel.removeAllRanges(); //清除range
                sel.addRange && sel.addRange(range);
			}

            $(M139.Text.Utils.format("img[crs='{0}']",[url]), this.editorDocument).each(function () {
                $(this).load(function () {
                    if (this.width > 520 && this.src.indexOf("attachId=") > 0) {
                        var orgWidth = this.width;
                        var orgHeight = this.height;
                        this.setAttribute("orgWidth", orgWidth);
                        this.setAttribute("orgHeight", orgHeight);
                        this.width = 520;
                    }
                });
            });
            this.trigger("insertImage", { url: url });
            
            // add by tkh 显示图片小工具
            var jEditorBody = $(this.editorDocument).find('body');
			top.$App.showImgEditor(jEditorBody);
        },

        /**
        *在光标处插入表格
        *@param {Object} options 初始化参数集
        *@param {Number} options.rows 表格的行数
        *@param {Number} options.cells 表格的列数
        *@param {Number} options.width 表格的宽度
        *@param {Number} options.height 表格的高度
        *@example
        */
        insertTable: function (options) {
            var rows = options.rows;
            var cells = options.cells;
            var htmlCode = "<table border='1' cellPadding='0' cellSpacing='0'>";
            //todo 高度和宽度没有实现
            for (var i = 0; i < rows; i++) {
                htmlCode += "<tr>";
                for (var j = 0; j < cells; j++) {
                    htmlCode += "<td style='min-width:50px;width:50px;' border='1'><div>&nbsp;</div></td>";
                }
                htmlCode += "</tr>";
            }
            htmlCode += "</table>&nbsp;";
            this.insertHTML(htmlCode);
        },

		execInsertHTML: function(html){
			var ie11bookmark, range, selection;

			this.editorDocument.body.focus();

			if($B.is.ie) {
				selection = this.getSelection();
				range = this.getRangeObject(selection);
				range.pasteHTML(html);
				return;
			}

			// 恢复IE11的光标位置
			else if($B.is.ie11){
				ie11bookmark = this.ie11BookMark;
				selection = this.getSelection();
				range = this.getRangeObject(selection);

				if(ie11bookmark){
					//console.log(ie11bookmark);
					range.setEnd(ie11bookmark.node, ie11bookmark.offset);
					range.collapse(false);
					selection.removeAllRanges(); //清除range
					selection.addRange(range);
				}
			}
			
			this.execCommand("insertHTML", html);
		},

		// 从当前光标位置分割父节点，直接指定的父节点为止
        splitOff: function() {
	        var This = this;
            //this.editorWindow.focus();
            $(this.editorDocument.body).focus();
           // setTimeout(function(){
            var selection = This.getSelection();
            var range = This.getRangeObject(selection);
            var docFrag, emptyNode;
            var ie11bookmark = This.ie11BookMark;

            if(ie11bookmark) {
                emptyNode = ie11bookmark.node;
            } else {
                emptyNode = range.startContainer || range.parentElement();
            }

            if(emptyNode == This.editorDocument.body) {
                return;
            }

            while(emptyNode.parentNode && emptyNode.parentNode !== This.editorDocument.body) {
                emptyNode = emptyNode.parentNode;
            }

            if($B.is.ie && $B.getVersion() < 9){
	            // moveEnd会将光标置于起始端，应该使用moveStart
	            // 其实只需要向上找到父元素为body的节点
	            range.moveStart("character", -emptyNode.innerHTML.length-1);
	            //range.moveToElementText(emptyNode);
	            //range.moveStart("character", -1);
	            range.select();
            } else {
	            range.collapse(false);
	            if($B.is.ie11 && ie11bookmark){
		            range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
		            range.setEnd(ie11bookmark.node, ie11bookmark.offset);
	            } else {
	                range.setStartBefore(emptyNode || This.editorDocument.body.firstChild);
                }
    	        selection.removeAllRanges(); //清除range
        	    selection.addRange(range);
            	//console.log("'"+range.toString()+"'");

	            //setTimeout(function(){
		            emptyNode = This.editorDocument.createElement("div");
		            emptyNode.innerHTML = "<br>&nbsp;<br>";
	                docFrag = range.extractContents();
	                docFrag.appendChild(emptyNode);
	           // }, 500);
        	}
        //}, 2000);

           //setTimeout(function(){
	           
            if($B.is.ie && $B.getVersion() < 9){
	            //var copy = range.duplicate();	// 被copy的range内容依然是活引用
	            //var text = range.text;
	            //range.text = "";
	            This.cut();
	            range.collapse(true);
	            range.select();
	            
	            //range.pasteHTML(copy.text);
	            range.pasteHTML("<div><br>&nbsp;&nbsp;</div>");
	            
	            range.moveStart("character", -100);
	            range.collapse(true);
	            range.select();
	            This.paste();
	            
	            range.moveEnd("character", 2);
	            range.collapse(false);
	            range.select();
	            //range.pasteHTML("<div>|MARK|</div>");
	            //console.log(range.text);
            } else {
                range.insertNode(docFrag);
                //range.insertNode(emptyNode);
                //$(this.editorDocument.body).prepend(docFrag);
                //this.execCommand("formatblock", "<div>");
                range.setEnd(emptyNode, 0);
                //range.setEndAfter(emptyNode); //设置末尾位置
                range.collapse(false);
                selection.removeAllRanges(); //清除range
                selection.addRange(range);
            }
            //}, 1000);
            //$(this.editorDocument.body).focus();
        },

        /**销毁对象，释放资源*/
        dispose: function () {
            //top.Debug.write("Editor Dispose");
            clearInterval(this.updateStateTimer);
            clearInterval(this.historyTimer);
        },

        /**得到选中区域对象*/
        getSelection: function () {
            var win = this.editorWindow;
            var userSelection;
            if (win.getSelection) {
                userSelection = win.getSelection();
            }
            else if (win.document.selection) {//Opera
                userSelection = win.document.selection;
            }
            return userSelection;
        },
        /**得到选中的范围对象*/
        getRangeObject: function (selection) {
            var selectionObject = selection || this.getSelection();
            if (selectionObject.createRange) {	// IE8 (xiaoyu)
                return selectionObject.createRange();
            } else if (selectionObject.getRangeAt && selectionObject.type == "Range") {
                return selectionObject.getRangeAt(0);
            } else if (this.editorDocument.createRange) {
                var range = this.editorDocument.createRange();
                try{
	                range.setStart(selectionObject.anchorNode||this.editorDocument.body, selectionObject.anchorOffset||0);
                	range.setEnd(selectionObject.focusNode||this.editorDocument.body, selectionObject.focusOffset||0);
                } catch(e){
	                console.log(selectionObject.anchorNode, selectionObject.focusNode);
                }
                return range;
            }
        },

        /*
         *特殊的元素类
        */
        StyleObjectElements: { img: 1, hr: 1, li: 1, table: 1, tr: 1, td: 1, embed: 1, object: 1, ol: 1, ul: 1 },

        /**
         *获得选中元素的类型
         *@inner
         *@returns {String} text|control|none
         */
        utilGetSelectedElementType: function (sel) {
            var type = "";
            if ($B.is.ie) {
                var ieType = this.editorDocument.selection.type;
                if (ieType == 'Text')
                    type = "text";
                if (ieType == 'Control')
                    type = "element";
                if (ieType == 'None')
                    type = "none";
            } else {
                type = "text";
                if (sel.rangeCount == 1) {
                    var range = sel.getRangeAt(0),
					    startContainer = range.startContainer;
                    if (startContainer == range.endContainer
					    && startContainer.nodeType == 1
					    && (range.endOffset - range.startOffset) == 1
					    && this.StyleObjectElements[startContainer.childNodes[range.startOffset].nodeName.toLowerCase()]) {
                        type = "element";
                    }
                }
            }
            return type;
        },
        /**
		 * [selectElementText 选中元素范围]
		 * @param {[type]} el [description]
		 */
		selectElementText: function ( el ){
			var doc = this.editorDocument;
			var selection = this.getSelection();	
			if(doc.getSelection){
				// range.selectNodeContent(el); // ?
				selection.selectAllChildren( el );
			}
			else if(doc.body.createTextRange){
				selection = doc.body.createTextRange();
				selection.moveToElementText( el );
				selection.select();
			}
			el.focus();
		},
        /**
         *获得选中的元素（不精确）
         */
        getSelectedElement: function () {
            var sel = this.getSelection();
            if (!sel) return null;
            var range = this.getRangeObject(sel);
            if (!range) return null;
            var node;
            //要理解getType(),getSelectedElement(),getRanges()
            var selectType = this.utilGetSelectedElementType(sel);
            switch (selectType) {
                case "element":
                    {
                        if ($.browser.msie) {
                            try {
                                node = sel.createRange().item(0);
                            }
                            catch (e) { }
                        }
                        else {
                            range = sel.getRangeAt(0);
                            node = range.startContainer.childNodes[range.startOffset];
                        }
                        break;
                    }
                case "text": //如果选择的开端是文本
                    {
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = sel.anchorNode || range.startContainer;
                                if (node && node.nodeType != 1) node = node.parentNode;
                            } else {
                                if (range.text.length > 0) range.collapse(true);
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
                default:
                    {
                        if ($B.is.ie) {
                            if ($B.getVersion() >= 9) {
                                node = range.startContainer;
                                if (node && !node.tagName && node.parentNode) node = node.parentNode;
                            } else {
                                node = range.parentElement();
                            }
                        }
                        else {
                            node = sel.anchorNode;
                            if (node && node.nodeType != 1) node = node.parentNode;
                        }
                        break;
                    }
            }
            if (node && (node.ownerDocument != this.editorDocument)) {
                node = null;
            }

            //ie8，9 选择范围有bug（要忽略前面的空白)
            if (node && $B.is.ie && $B.getVersion() > 7) {
                var count = 0;
                var elCount = 0;
                for (var i = 0; i < node.childNodes.length; i++) {
                    var child = node.childNodes[i];
                    if (child.nodeType == 3 || child.tagName == "BR") {
                        count++;
                    } else {
                        elCount++;
                    }
                }
                if (count && elCount === 1 && node.lastChild.nodeType == 1) {
                    node = node.lastChild;
                }
            }

            return node;
        },

        /**
         *判断元素是否块元素
         */
        utilIsBlockElement:function(tagName){
            if (typeof tagName != "string") {
                tagName = tagName && tagName.tagName;
            }
            return /^(?:body|div|p|table|td|tr|ul|li|fieldset|legend)$/i.test(tagName);
        },

        /**
         *设置行距 todo 不大管用
         */
        setRowSpace: function (rowSpace) {
            this.editorWindow.focus();
            var This = this;
            rowSpace = rowSpace * 100 + "%";
            var selectedE = this.getSelection();
            var range = this.getRangeObject(selectedE);
            var startPE;
            var endPE;
            var rng;
            var allNodes = [];
            if ($B.is.ie && $B.getVersion() < 9) {
                rng = range.duplicate();
                range.collapse(false);
                startPE = range.parentElement();
                rng.collapse(false);
                endPE = rng.parentElement();
            } else {
                range = selectedE.getRangeAt(0);
                startPE = range.startContainer.parentNode;
                endPE = range.endContainer.parentNode;
            }
            if (!startPE || startPE.ownerDocument != this.editorDocument) {
                return;
            }
            try {
                var startDom = findBlockParent(startPE);
                makeStyle(startDom);
            } catch (e) { }
            try {
                var endDom = findBlockParent(endPE);
                if (startDom && endDom && startDom != endDom) {
                    //如果开始节点与结束节点不同，则遍历获取它们之间的节点
                    var allNodes = getMiddleNodes(startDom, endDom);
                    if (allNodes.length > 0) {
                        _.each(allNodes, function (item) {
                            makeStyle(item);
                        });
                    }
                    makeStyle(endDom);
                }
            } catch (e) { }
            function makeStyle(dom) {
                if (dom) {
                    $("*", dom).add(dom).css("line-height", rowSpace);
                }
            }
            function findBlockParent(el) {
                while (el) {
                    if (This.utilIsBlockElement(el)) {
                        return el;
                    }
                    el = el.parentNode;
                }
                return null;
            }
            //获得2个节点之间的节点
            function getMiddleNodes(startNode, endNode) {
                var all = [];
                var node = startDom.nextSibling;
                while (node) {
                    if (node == endNode || M139.Dom.containElement(node, endNode)) {
                        break;
                    } else {
                        all.push(node);
                        if (!node.nextSibling) {
                            node = node.parentNode;
                        } else {
                            node = node.nextSibling;
                        }
                    }
                }
                return all;
            }
        },

        /**
         *插入超链接
         */
        setLink: function (url) {
            this.editorWindow.focus();
            this.execCommand("CreateLink", url);
        },
        /**
        *插入签名
        */
        setSign: function (text) {
            var today = new Date();
            text = text.replace("$时间$", today.format("yyyy年MM月dd日 星期") + ["天", "一", "二", "三", "四", "五", "六"][today.getDay()]);
            if (this.isHtml) {
                var doc = this.editorDocument;
                text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
                if (!/<\/\w+>/.test(text)) {
                    text = text.replace(/\r?\n/g, "<br>");
                }
                var signContainer = doc.getElementById("signContainer");
                if (!signContainer || (signContainer.signLength && signContainer.signLength != signContainer.innerHTML.length)) {
                    if (signContainer) signContainer.id = null;
                    signContainer = doc.createElement("div");
                    signContainer.id = "signContainer";
                    var contentObj = doc.getElementById("content139") || doc.body;
                    var newLineDiv = doc.createElement("div");
                    var fonts = top.$User.getDefaultFont();
                    var style = {
                       fontFamily : fonts.family,
                       fontSize : this.getPxSize(fonts.size),
                       color : fonts.color,
                       lineHeight : fonts.lineHeight
                    };
                    $(newLineDiv).css(style);
                    newLineDiv.innerHTML = '<br><br><br>';
                    contentObj.appendChild(newLineDiv);						
                    contentObj.appendChild(signContainer);
                }
                signContainer.innerHTML = text;// + "<div>&nbsp;</div>";
                signContainer.signLength = signContainer.innerHTML.length;
            } else {
                this.textArea.value += "\r\n" + text;
            }
        },

        /**
        *todo 插入祝福语
        */
        setBlessings: function (text) {
            if (this.isHtml) {
                var doc = this.editorDocument;
                text = text.replace(/^\s*<p>|<\/p>\s*$/i, "");
                if (!/<\/\w+>/.test(text)) {
                    text = text.replace(/\r?\n/g, "<br>");
                }
                var blessingsContainer = doc.getElementById("blessingsContainer");
                if (!blessingsContainer || (blessingsContainer.signLength && blessingsContainer.signLength != blessingsContainer.innerHTML.length)) {
                    if (blessingsContainer) blessingsContainer.id = null;
                    blessingsContainer = doc.createElement("div");
                    blessingsContainer.id = "blessingsContainer";
                    var contentObj = doc.getElementById("content139") || doc.body;
                    var newLineDiv = doc.createElement("div");
                    newLineDiv.innerHTML = "<br>";
                    var signContainer = doc.getElementById("signContainer");
                    if (signContainer) {
                        contentObj.insertBefore(blessingsContainer, signContainer);
                        contentObj.insertBefore(newLineDiv, signContainer);
                    } else {
                        contentObj.appendChild(newLineDiv);
                        contentObj.appendChild(blessingsContainer);
                    }
                }
                blessingsContainer.innerHTML += "<div>" + text + "</div>";
                blessingsContainer.signLength = blessingsContainer.innerHTML.length;
            } else {
                this.contentPlainText.value += "\r\n" + text;
            }
        },

        /**添加引用内容（写信编辑器）*/
        addReplyContent: function (content) {
            // 在编辑器中文中添加6个空行 add by chenzhuo
			var sessionCon = top.$App.getSessionDataContent();
            var html = this.getHtmlContent() + sessionCon + "<div><br><br><br></div><div id='signContainer'></div><hr id='replySplit'/><div id='reply139content'>" + content + "</div>";
            this.setHtmlContent(html);
        },

        /**获得编辑器的html内容*/
        getHtmlContent: function () {
            var html = this.editorDocument.body.innerHTML;
            if ($B.is.webkit) {
                if (html.indexOf("<!--[if") > -1) {
                    //替换从office粘贴文本出现注释的bug
                    html = html.replace(/<!--\[if !\w+\]-->([\s\S]*?)<!--\[endif\]-->/g, "$1");
                }
            }
            return html;
        },

        /**设置html内容*/
        setHtmlContent: function (htmlCode) {
            var This = this;
            if (this.isReady) {
                setContent();
            } else {
                this.on("ready", setContent);
            }
            function setContent() {
                This.editorDocument.body.innerHTML = htmlCode;
                This.trigger("setcontent");
            }
        },

        //todo 使用公共代码实现
        /**
         *将html文本转化成普通文本
         */
        getHtmlToTextContent: function () {
            var body = this.editorDocument.body;
            var content = "";
            if (document.all) {
                content = body.innerText;
            } else {
                var tmp = body.innerHTML;
                tmp = tmp.replace(/<br\s?\/?>/ig, "\n");
                var div = document.createElement("div");
                div.innerHTML = tmp;
                content = div.textContent;
            }
            return content;
        },

        //todo 使用公共代码实现
        /**
         *纯文本模式切换到编辑器模式，内容转换
         */
        getTextToHtmlContent: function () {
            var content = this.textArea.value;
            var div = document.createElement("div");
            if (document.all) {
                content = content.replace(/\r?\n/g, "<br>");
                content = content.replace(/ /g, "&nbsp;");
                div.innerHTML = content;
                return div.innerHTML;
            } else {
                div.appendChild(document.createTextNode(content));
                return div.innerHTML.replace(/\r?\n/g, "<br>");
            }
        },

        /**获得纯文本内容*/
        getTextContent: function () {
            return this.textArea.value;
        },

        //todo 封装成调用时不需要判断编辑器状态
        /**纯文本模式下设置内容*/
        setTextContent: function (text) {
            this.textArea.value = text;
        },

        /**
         *切换编辑器模式 html or 纯文本
        */
        switchEditor: function () {
            if (this.isHtml) {
                this.setTextContent(this.getHtmlToTextContent());
                this.jTextArea.show();
                this.jFrame.hide();
                this.isHtml = false;
            } else {
                this.setHtmlContent(this.getTextToHtmlContent());
                this.jFrame.show();
                this.jTextArea.hide();
                this.isHtml = true;
            }
        },

        /**设置、取消格式刷*/
        setFormatPrinter:function(){
            if(this.get("printerMode") == "off"){
                this.setFormatPrinterOn();
            }else{
                this.setFormatPrintOff();
            }
        },

        /**选中格式刷*/
        setFormatPrinterOn:function(keep){
            //保存当前格式
            this.set("formatForPrint",this.getSelectedStyle());

            this.set("printerMode", keep ? "keepOn" : "on");

            this._keepBookmark = null;//防止ie下movetobk的时候滚动
        },

        /**退出格式刷*/
        setFormatPrintOff:function(){
            this.set("printerMode","off");
        },

        /**
        * 格式化选中内容
        * execCommand具有切换的效果，因此在选区不同区域格式混杂的时候会有问题。
        * （比如用第一行的格式刷全文就会有问题）(xiaoyu)
        * 完善格式刷，先需对选区进行有选择的清除，再整体添加之前被清掉的格式。
        */
        printFormat: function (formatStyle) {
            if (this.formatLocked) return;

            var This = this;
            //如果是一次性刷子，退出格式刷状态
            var pMode = this.get("printerMode");
            if (pMode == "on") {//多次刷子是 = keepOn
                this.setFormatPrintOff();
            } else if (pMode == "off") {
                return;
            }


            //防止短期内多次触发而崩溃
            this.formatLocked = true;
            setTimeout(function () {
                This.formatLocked = false;
            }, 500);

			// 清除局部杂乱样式
			this.execCommand("removeFormat");

            var oldStyle = this.getSelectedStyle();

            if(oldStyle.isBold !== formatStyle.isBold){
                this.execCommand("bold",null,true);
            }

            if(oldStyle.isUnderLine !== formatStyle.isUnderLine){
                this.execCommand("underline",null,true);
            }

            if(oldStyle.isItalic !== formatStyle.isItalic){
                this.execCommand("italic",null,true);
            }

            if(oldStyle.isOrderedList !== formatStyle.isOrderedList){
                this.execCommand("insertorderedlist",null,true);
            }
            if(oldStyle.isUnorderedList !== formatStyle.isUnorderedList){
                this.execCommand("insertunorderedlist",null,true);
            }

            if(oldStyle.textAlign !== formatStyle.textAlign){
                this.execCommand("Justify" + formatStyle.textAlign,null,true);
            }
            
            if(oldStyle.color !== formatStyle.color){
                this.execCommand("ForeColor",formatStyle.color,true);
            }

            if(oldStyle.backgroundColor !== formatStyle.backgroundColor){
                this.setBackgroundColor(formatStyle.backgroundColor,true);
            }

            if(oldStyle.fontFamily !== formatStyle.fontFamily){
                this.execCommand("fontname",formatStyle.fontFamily,true);
            }


            //这个放最后，会触发afterexeccommand事件，更新ui状态
            if(oldStyle.fontSize !== formatStyle.fontSize){
                this.setFontSize(formatStyle.fontSize);
            }


        },

        /**
         *光标处插入html
         *@param {String} htmlCode 要插入的html
         */
        insertHTML: function (htmlCode) {
            this.editorWindow.focus();
            var sel = this.getSelection();
            var range = this.getRangeObject(sel);
            if (!$B.is.ie) {
                range.deleteContents();
                var fragment = range.createContextualFragment(htmlCode);
                var lastNode = fragment.lastChild;
                range.insertNode(fragment);
                range.setEndAfter(lastNode); //设置末尾位置  
                range.collapse(false); //合并范围至末尾  
                sel.removeAllRanges(); //清除range
                sel.addRange(range);
            } else if ($B.getVersion() >= 9) {
                //ie9
                range.deleteContents();
                var _div = this.editorWindow.document.createElement("div");
                _div.innerHTML = htmlCode;
                //var lastNode = _div.firstChild; //只插入了部分html
                var lastNode = _div;
                range.insertNode(_div);
                range.setEndAfter(lastNode); //设置末尾位置  
                range.collapse(false); //合并范围至末尾  
                sel.removeAllRanges(); //清除range
                sel.addRange(range);
            } else {
                if (sel.type.toLowerCase() == 'control') {
                    range.item(0).outerHTML = htmlCode;
                } else {
                    try {
                        range.pasteHTML(htmlCode);
                    } catch (e) {
                        this.editorDocument.body.innerHTML = htmlCode + this.editorDocument.body.innerHTML;
                    }
                }
            }
        },

        /**@inner 查询格式状态*/
        queryCommandState: function (command) {
            var state = false;
            try {
                state = this.editorDocument.queryCommandState(command);
            } catch (e) { }
            return state;
        },
        FontSizeList: {
            "6": "一号",
            "5": "二号",
            "4": "三号",
            "3": "四号",
            "2": "五号",
            "1": "六号",
            "32px": "一号",
            "24px": "二号",
            "18px": "三号",
            "16px": "四号",
            "13px": "五号",
            "10px": "六号",
            "12px": "六号"//chrome
        },
        /**获得光标当前所在位置的样式值：字体、颜色、对齐方式等*/
        getSelectedStyle: function () {
            var This = this;
            var element = this.getSelectedElement();
            if (!element || element.ownerDocument != this.editorDocument) {
                //有时候浏览器会返回编辑器以外的选中元素
                return null;
            } else {
	            var Dom = M139.Dom;
                var textAlign = Dom.getCurrentCSS(element, "text-align");
                var fontSize = Dom.getCurrentCSS(element, "font-size");
                var fontFamily = Dom.getCurrentCSS(element, "font-family");
                var color = Dom.getCurrentCSS(element, "color");
                var backgroundColor = Dom.getCurrentCSS(element, "background-color");
                var lineHeight = Dom.getCurrentCSS(element, "line-height");
                var result = {
                    isBold: this.queryCommandState("bold"),
                    isUnderLine: this.queryCommandState("underline"),
                    isItalic: this.queryCommandState("italic"),
                    isOrderedList: this.queryCommandState("insertorderedlist"),
                    isUnorderedList: this.queryCommandState("insertunorderedlist"),
                    isAlignLeft: textAlign == "left",
                    isAlignCenter: textAlign == "center",
                    isAlignRight: textAlign == "right",
                    textAlign:textAlign,
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    color:color,
                    backgroundColor:backgroundColor,
                    fontSizeText: getFontSizeText(fontSize),
                    lineHeight: parseInt(lineHeight)/parseInt(fontSize)
                };
                return result;
            }
            function getFontSizeText(fontSize) {
                return This.FontSizeList[fontSize] || fontSize;
            }
        },

        /**
         *根据字体名获得字号
         *@inner
         */
        utilGetFontSizeLevel: function (fontSizeName) {
            if (/^\d+$/.test(fontSizeName)) {
                return parseInt(fontSizeName);
            } else {
                var list = ["","xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large"];
                return jQuery.inArray(fontSizeName, list) || 4;
            }
        },

        /**加大字号*/
        setFontSizeUp: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if (fontSize.indexOf("px") > -1) {
                var newSize = parseInt(fontSize) + 4 + "px";
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(fontSize + 1);//最大是1号字
            }
        },

        /**减少字号*/
        setFontSizeDown: function () {
            this.editorWindow.focus();
            var element = this.getSelectedElement();
            var fontSize = M139.Dom.getCurrentCSS(element, "font-size");
            if(fontSize == 'medium'){fontSize = '16px';} //修复html编辑器对字体缩小在特定条件下失效的问题,暂用该方法
            if (fontSize.indexOf("px") > -1) {
                var newSize = Math.max(9, parseInt(fontSize) - 4) + "px";//不能小于9像素
                this.setFontSize(newSize);//这个只支持字号 不支持像素
                element = this.getSelectedElement();
                element.style.fontSize = newSize;
            } else {
                var fontSize = this.utilGetFontSizeLevel(fontSize);
                this.setFontSize(Math.max(1, fontSize - 1));
            }
        },

        /**
         *剪切选中内容
         */
        cut: function () { this.execCommand("Cut") },
        /**
         *复制选中内容
         */
        copy: function () { this.execCommand("Copy") },
        /**
         *在光标处粘贴内容
         */
        paste: function () { this.execCommand("Paste") },
        /**
         *设置文字效果粗体
         */
        setBold: function () { this.execCommand("Bold") },
        /**
         *设置文字效果下划线
         */
        setUnderline: function () { this.execCommand("Underline") },
        /**
         *设置文字效果斜体字
         */
        setItalic: function () { this.execCommand("Italic") },
        /**
         *设置字体
         */
        setFontFamily: function (fontName) {
            if ($B.is.ie && $B.getVersion() < 9) {
                //this.jEditorDocument.find("font").attr("oldel", 1);
                var fontTags = this.editorDocument.getElementsByTagName("font");
                if (fontTags.length > 200) {
                    var moreBreak = true;
                }
                if (!moreBreak) { 
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        fontTags[i].setAttribute("oldel", "1");
                    }
                }
            }
            this.execCommand("fontname", fontName);
            if ($B.is.ie && $B.getVersion() < 9) {
                //解决从word复制内容到html编辑器里，有时字体无法修改的问题
                /*
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontFamily) {
                        this.style.fontFamily = "";
                    }
                });
                */
                if (!moreBreak) {
                    //jquery性能太差 重新优化
                    var fontTags = this.editorDocument.getElementsByTagName("font");
                    for (var i = 0, len = fontTags.length; i < len; i++) {
                        var font = fontTags[i];
                        if (!font.getAttribute("oldel")) {
                            var spanList = font.getElementsByTagName("span");
                            for (var j = 0, jLen = spanList.length; j < jLen; j++) {
                                var span = spanList[j];
                                if (span.style.fontFamily) {
                                    span.style.fontFamily = "";
                                }
                            }
                        }
                    }
                }
            }
        },
        // 标示已存在的font
        markFont: function(){
            this.jEditorDocument.find("font").attr("oldel", 1);
        },
        // 从word中复制到ie中的文本会有font标签，影响了文本字体大小，要去掉此属性 add by chenzhuo
        resetTextSizeForIe: function(){
            if (!$B.is.ie) {
                return;
            }

            var editorDocument = this.editorDocument;
            var fontElem = editorDocument.getElementsByTagName("font");
            var fontElemLen = fontElem.length;

            if (fontElemLen > 0) {
                for (var i = 0; i < fontElemLen; i++) {
                    var item = fontElem[i];
                    if (item.getAttribute("oldel") === null) { //新粘贴的文本
                        item.removeAttribute("size");
                    }
                }
            }
        },
        /**
         *设置字号
         */
        setFontSize: function (fontSize) {
            this.editorWindow.focus();
            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            var element = this.getSelectedElement();
            if (fontSize.toString().indexOf("px") > -1) {
	            //this.execCommand("FontSize", fontSize, true);
	            // size 1-7 分别对应 12 13 16 18 24 32 48
	            //var map = [12 13 16 18 24 32 48];
	           // var size = parseInt(fontSize, 10);
	           // for(var i=0,len=map.length;)
                this.execCommand("FontSize", 4, true);//这个只支持字号 不支持像素,所以要折腾2次
                element.style.fontSize = fontSize;
                this.trigger("afterexeccommand",{
                    command:"FontSize",
                    param:fontSize
                });
            }else{
                this.execCommand("FontSize", fontSize);
                if (element.style.fontSize) {
                    element.style.fontSize = "";
                }
            }

            if ($B.is.ie) {
                
                //解决从word复制内容到html编辑器里，有时字体大小无法修改的问题
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.fontSize) {
                        this.style.fontSize = "";
                    }
                });
            }

        },
        /**
         *设置默认字体 add by tkh  modif by yly
         * @param {Object} fonts {size : '2',family : '宋体',color : '#000000',lineHeight:'1.5'}
         */
        setDefaultFont : function (fonts){
            var self = this;
            var style = {
               fontFamily : fonts.family,
               fontSize : self.getPxSize(fonts.size),
               color : fonts.color,
               lineHeight : fonts.lineHeight
            };
            
            var indexObj = getIndexObj();
            var eleList = self.jEditorDocument.find('body').find("div:lt("+indexObj.index+")");
            if(eleList && eleList.length > 0){
                for(var i = 0;i < eleList.length;i++){
                    var ele = eleList[i];
                    $(ele).css(style);
                }
            }else{
                var jNewDivEle = $(self.editorDocument.createElement('div'));
                if(!$B.is.ie) {
                    jNewDivEle.append('<br>');
                }
                if(indexObj.jEle){
                    indexObj.jEle.before(jNewDivEle);
                }else{
                    self.jEditorDocument.find('body').append(jNewDivEle);
                }
                jNewDivEle.css(style);
            }
            
			function getIndexObj(){
				var children = self.jEditorDocument.find('body').children();
				var jSignContainer = self.jEditorDocument.find("#signContainer");
				if(jSignContainer.size() > 0){
					return {
						index : jSignContainer.index(),
						jEle : jSignContainer
					};
				}
				var jReplySplit = self.jEditorDocument.find("#replySplit");
				if(jReplySplit.size() > 0){
					return {
						index : jReplySplit.index(),
						jEle : jReplySplit
					};
				}
				return {
					index : children.size()
				};
			}
            
    	},
    	getPxSize : function(fontSizeText){
			if (/\d+$/.test(fontSizeText)) {
				if($B.is.chrome && fontSizeText == 1){
                	return "12px";
                }
                fontSizeText = ({
                    6: "32px",
                    5: "24px",
                    4: "18px",
                    3: "16px",
                    2: "13px",
                    1: "10px"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
		},
        /**
         *设置字体颜色
         */
        setForeColor: function (color) {
            this.editorWindow.focus();
            //if (M139.Browser.is.firefox && color.indexOf("rgb") > -1) {
            if (color.indexOf("rgb") > -1) {
                //兼容处理
                color = this.changeRGBColor(color);
            }

            if ($B.is.ie) {
                this.jEditorDocument.find("font").attr("oldel", 1);
            }
            this.execCommand("ForeColor", color);
            if ($B.is.ie) {
                //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                /*
                    用了很猥琐的做法   
                    从word复制的内容 字体标签是 <span lang="EN-US" style="color:red" >
                    html编辑器自己加的字体标签是 <font color="blue">
                    那么我就把应用字体颜色后的新增的font标签下的span标签的color干掉  就可以防止无法修改全部选中范围的字体颜色了
                */
                this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                    if (this.style.color) {
                        this.style.color = "";
                    }
                });
            }
        },

        /**
         *rgb(1,1,1)格式转#010101格式
         */
        changeRGBColor:function(rgb){
            var m = rgb.replace(/\s/g,"").match(/rgb\((\d+),(\d+),(\d+)\)/i);
            if (m) {
                var r = (m[1] * 1).toString(16).replace(/^(.)$/, "0$1");
                var g = (m[2] * 1).toString(16).replace(/^(.)$/, "0$1");
                var b = (m[3] * 1).toString(16).replace(/^(.)$/, "0$1");
                return "#" + r + g + b;
            }
            return "";
        },

		preview: function() {
			var source = this.editorDocument.body.innerHTML;
			var html = '<iframe id="frm_preview" name="frm_preview" width="100%" height="100%" marginwidth="24" marginheight="24" frameborder="0" src="/m2012/html/preview_blank.htm"></iframe>';
			var height = $(window).height() - 100;

			top.$Msg.showHTML(html, {
				dialogTitle:'预览',
				buttons:['关闭'],
				width: "90%",
				height: height + "px"
			});

			//alert(top === parent);	// true
			document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			var preview_frm = parent.document.getElementById('frm_preview');

			$(preview_frm).on("load", function(){
				preview_frm.contentWindow.document.body.innerHTML = source;
			});
			//document.domain = window.location.host.match(/[^.]+\.[^.]+$/)[0];
			//var win = window.open("about:blank", "_blank");
			//var win = window.open("/m2012/html/preview_blank.htm", "_blank");
			//console.log(win.document.body);
			//win.document.body.innerHTML = s;//source;
		},
		/**
		* 内容全选
		*/
		selectAll: function() { this.execCommand("selectAll"); },
		/**
		* 添加删除线
		*/
		strikeThrough: function() { this.execCommand("strikeThrough"); },
        /**
         *设置内容左对齐
         */
        setAlignLeft: function () { this.execCommand("JustifyLeft") },
        /**
         *设置内容居中对齐
         */
        setAlignCenter: function () { this.execCommand("JustifyCenter") },
        /**
         *设置内容右对齐
         */
        setAlignRight: function () { this.execCommand("JustifyRight") },
        /**
         *增加缩进
         */
        setIndent: function () { this.execCommand("Indent") },
        /**
         *减少缩进
         */
        setOutdent: function () { this.execCommand("Outdent") },
        /**
         *设置数字列表（ol）
         */
        insertOrderedList: function () { this.execCommand("Insertorderedlist") },
        /**
         *设置符号列表（ul）
         */
        insertUnorderedList: function () { this.execCommand("Insertunorderedlist") },

		/**
		* 上传后需要添加到附件列表，因此直接模拟上传附件行为
		*/
        _uploadFile: function(type, filterType) {
	        var isFlashUpload = supportUploadType.isSupportFlashUpload && document.getElementById("flashplayer");

	        if(isFlashUpload){
		        return ;
		    }
		    uploadManager.filterType = filterType;
	        uploadManager.callback = function(){
		        var list = this.fileList;
		        var item;
		        var fileSizeText;
		        var filterType;

		        for(var i=0, len=list.length; i < len; i++) {
			        item = list[i];
			        filterType = item.filterType;
			        if(filterType) {
				        if(filterType.test(item.fileName)) {
					        fileSizeText = item.fileType == "largeAttach" ? item.fileSize : $T.Utils.getFileSizeText(item.fileSize, { maxUnit: "K", comma: true });
				            upload_module.insertRichMediaFile(item.fileName, fileSizeText);
			            }
				        delete item.filterType; // 防止第二次上传后重复添加到正文
			        }
		        }
	        }
	        var fileInput = document.getElementById("uploadInput");
	        var acceptMimeTypes = {
		        "audio": "audio/mpeg",
		        "video": "video/mp4, flv-application/octet-stream",
		        "doc": "text/plain, application/vnd.ms-powerpoint, application/vnd.ms-excel, application/msword, application/pdf",
		        "image": "image/gif, image/jpeg, image/bmp, image/png"
	        };

	        $(fileInput).attr("accept", acceptMimeTypes[type]);

	        if(fileInput) {
		        $(fileInput).trigger("click", "fakeClick");
	        }
        },

        uploadInsertDocument: function() {
            this._uploadFile("doc", /\.(?:docx?|pptx?|xlsx?|pdf|txt)$/i);
        },

        uploadInsertAudio: function() {
            this._uploadFile("audio", /\.(?:mp3|m4a|wav)$/i);
        },

        uploadInsertVideo: function() {
            this._uploadFile("video", /\.(?:mp4|flv|f4v|m4v)$/i);
        },

        /**
         *清除文字格式
         */
        removeFormat: function () {
	        //this.execCommand("removeFormat");
			var doc = this.editorDocument;
			this.sourceBackup = doc.body.innerHTML;	// 支持一次撤销
			var contentNode = doc.getElementById("content139") || doc.body;
			var signContainer = doc.getElementById("signContainer");
			//var replyContainer = doc.getElementById("reply139content");

			if(signContainer){
				signContainer.parentNode.removeChild(signContainer);
			}
			//if(replyContainer){
			//	replyContainer.parentNode.removeChild(replyContainer);
			//}
			// note: 先removeChild，再获取innerHTML
			var source = contentNode.innerHTML;
			// ctrl+Z撤销（清除格式后需要这个恢复之前的备份内容）
			this.restoreSource = function (e) {
				if(e.ctrlKey){
					if(e.keyCode === 90 && this.hasOwnProperty("sourceBackup")){
						this.undo();
					}
				}
				return false;
			};
			this.on("keydown", this.restoreSource);
			source = source.replace(/(style)\s*=\s*(["']?)(?:[^\\>]|\\\2)*?\2/ig, "");
			//source = source.replace(/<[\w:-]+\s*style/ig, "");
			source = source.replace(/<\/?(?:h\d|li|dl|dd|dt|ol|ul|font|sub|sup|i|u|em|del|b|strike|strong)(\s+[^>]*)?>/ig, "");
			// remove comment (conditional tags)
			source = source.replace(/<!--\[if.*?-->.*?<!--\[endif\]-->/ig, "");
			// finally, remove all empty tags.
			//source = source.replace(/<([\w:-]+)[^>]*>\s*<\/\1>/ig, '');
			// remove all empty tags that with no 'src' property.
			source = source.replace(/<([\w:]+)(\s+(?!src)\w+\s*=\s*(["']?)(?:[^\\>]|\\\3)*?\3)?>\s*<\/\1>/ig, '');
			contentNode.innerHTML = source;
			if(signContainer) {
				var replySplit = doc.getElementById("replySplit");
				if(replySplit){
					contentNode.insertBefore(signContainer, replySplit);
				} else {
					contentNode.appendChild(signContainer);
				}
			}
			//if(replyContainer) {
			//	contentNode.appendChild(replyContainer);
			//}
		},
        /**
         *清除文字背景颜色
         */
        setBackgroundColor: function (color,isSilent) {
            if ($.browser.firefox) {
                this.execCommand("Bold");//为了生成一个span
                var elem = this.getSelectedElement();
                elem.style.backgroundColor = color;
                this.execCommand("Bold");//打扫卫生
            } else {
                if ($B.is.ie) {
                    this.jEditorDocument.find("font").attr("oldel", 1);
                }
                this.execCommand("BackColor", color);
                if ($B.is.ie) {
                    //解决从word复制内容到html编辑器里，有时字体颜色无法修改的问题
                    this.jEditorDocument.find("font:not([oldel])").find("span").each(function () {
                        if (this.style.backgroundColor) {
                            this.style.backgroundColor = "";
                        }
                    });
                }
            }
        },

        /**
         *重做（取消撤销的操作）
         */
        redo: function () {
            if (this.supportRedoMode) {
                this.history.redo();
            } else {
	            this.execCommand("Redo");
            }
        },
        /**
         *撤销操作
         */
        undo: function () {
            if (this.supportRedoMode) {
                this.history.undo();
            } else {
	            // 清除格式后，支持一次性撤销（IE仍可多次）
	            if(this.sourceBackup != undefined){
		            this.editorDocument.body.innerHTML = this.sourceBackup;
		            this.sourceBackup = null;
		            delete this.sourceBackup;
		            this.editor.off("keydown", this.restoreSource);
	            } else {
	                this.execCommand("Undo");
                }
            }
        },
        /**
         *封装document.execCommand操作
         */
        execCommand: function (command, param, isSilent) {
            var self = this;

            if (!isSilent) {
                this.editorWindow.focus();
            }
            if(!isSilent){
                this.trigger("beforeexeccommand", { command: command, param: param });
            }

            //var sRange = this.getRangeObject();
            this.editorDocument.execCommand(command, false, param);
            this.styleCommand(command);

            //var eRange = this.getRangeObject();

            if (!isSilent && M139.Browser.is.ie && M139.Browser.getVersion() > 7) {
                this.editorWindow.focus();
            }

            if(!isSilent){
                this.trigger("afterexeccommand", { command: command, param: param });
            }
            
            //updateState();
        },

        // 一些文本操作之后的样式控制
        styleCommand: function (command) {
            var self = this;

            switch (command) {
                case "Indent":
                    // ie下BLOCKQUOTE元素会增加默认的顶部和底部外边距
                    if ($B.is.ie) {
                        setTimeout(function(){
	                        //note: IE11不支持createRange (xiaoyu)
							try{
								var range = self.getRangeObject();
								var sRangeContainer = range.parentElement().parentElement;

                                if (sRangeContainer.tagName == "BLOCKQUOTE") {
                                    sRangeContainer.style.marginTop = "0";
                                    sRangeContainer.style.marginBottom = "0";
                                }
                            }catch(e){ }
                        }, 100);
                    }
                    break;
            }
        }
    }
)
);

    //添加静态方法
    $.extend(M2012.UI.HTMLEditor.Model.Editor,
     /**
      *@lends M2012.UI.HTMLEditor.Model.Editor
      */
    {
        getDefaultFont: function () {
            var defaultFont = {};
            try {
                defaultFont = top.$User.getDefaultFont();
            } catch (e) {
            }
            return defaultFont;
        }
    });

})(jQuery, _, M139);

﻿/**
 * @fileOverview 定义编辑器的弹出菜单
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    M139.namespace("M2012.UI.HTMLEditor.View.Menu", superClass.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.Menu.prototype
        */
        {
            /** 弹出菜单组件
            *@constructs M2012.UI.HTMLEditor.View.Menu
            *@extends M139.View.ViewBase
            *@param {Object} options 初始化参数集
            *@param {String} options.template 组件的html代码
            *@example
            */
            initialize: function (options) {
                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                return superClass.prototype.initialize.apply(this, arguments);
            },

            render: function () {
                var This = this;
                this.$el.appendTo(document.body);

                this.on("select", this.hide);

                this.render = function () {
                    return this;
                }
                
                return superClass.prototype.render.apply(this, arguments);
            },

            hide: function () {
                M2012.UI.PopMenu.unBindAutoHide({ action: "click", element: this.el});
                return superClass.prototype.hide.apply(this, arguments);
            },

            //#xxx转rgb
            getRGBColor: function (color) {
                if (/rgb/i.test(color)) {
                    return color.toLowerCase();
                } else if (color.indexOf("#") > -1) {
                    var m = color.match(/^\#(.)(.)(.)$/);
                    if (m) {
                        return M139.Text.Utils.format("rgb({r},{g},{b})", {
                            r: parseInt(m[1] + m[1], 16),
                            g: parseInt(m[2] + m[2], 16),
                            b: parseInt(m[3] + m[3], 16)
                        });
                    } else {
                        m = color.match(/^\#(..)(..)(..)$/);
                        if (m) {
                            return M139.Text.Utils.format("rgb({r},{g},{b})", {
                                r: parseInt(m[1], 16),
                                g: parseInt(m[2], 16),
                                b: parseInt(m[3], 16)
                            });
                        }
                    }
                }
                return color;
            },

            /**
             *显示菜单
             *@param {Object} options 参数集
             *@param {HTMLElement} options.dockElement 停靠的元素
             */
            show: function (options) {
                var This = this;
				var direction = this.editorView.options.editorBtnMenuDirection || "down";
                
                //会话邮件写信页特殊处理
				if(window.conversationPage){
					direction = "up";
                    //this.$el.find("div.font-type").css({ 'height':185,'overflow':'hidden', 'background':'white' });
                    this.$el.find("div.FontFamilyList,div.FontSizeList").css({ 'height':140, 'overflow-y':'scroll', 'position':'relative','background':'white' });
				}
                
				this.$el.css("z-index", 40000);
                this.dockElement = options.dockElement;
                //停靠在按钮旁边
                M139.Dom.dockElement(options.dockElement, this.el, {
                    direction: direction
                });
                //点击空白处自动消失
                M2012.UI.PopMenu.bindAutoHide({
                    action: "click",
                    element: this.el,
                    stopEvent: true,
                    callback: function () {
                        This.hide();
                    }
                });
                return superClass.prototype.show.apply(this, arguments);
            },
            
            /**
             *显示默认字体对话框
             *@param 
             */
            onChangeButtonClick: function () {
                this.hide();
                var fontIFrame = top.$Msg.open({
                    dialogTitle:"设置默认字体",
                    url:"defaultFont.htm?sid="+top.sid,
                    width:420,
                    height:248
                });
                
                var self = this;
                top.$App.on('setDefaultFonts', function(fonts){
                    self.editorView.editor.setDefaultFont(fonts);
                    if(top.$App){
                        top.$App.off('setDefaultFonts');
                        top.$App.trigger("userAttrChange", {callback: function () {}});
                    }
                    fontIFrame.close();
                });
                top.$App.on('cancelDefaultFonts', function(){
                    if(top.$App){
                        top.$App.off('cancelDefaultFonts');
                    }
                    fontIFrame.close();
                });
            }
        }
    ));

    M2012.UI.HTMLEditor.View.FaceFamilyMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontFamilyList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:260px;">',
         '<div class="fonttype-list FontFamilyList">',
             '<a rel="微软雅黑" style="font-family: 微软雅黑;" href="javascript:void(0)"><span class="cur"></span>微软雅黑</a>',
             '<a rel="宋体" style="font-family: 宋体;" href="javascript:void(0)"><span class="cur"></span>宋体</a>',
             '<a rel="黑体" style="font-family: 黑体;" href="javascript:void(0)"><span class="cur"></span>黑体</a>',
             '<a rel="楷体" style="font-family: 楷体;" href="javascript:void(0)"><span class="cur"></span>楷体</a>',
             '<a rel="隶书" style="font-family: 隶书;" href="javascript:void(0)"><span class="cur"></span>隶书</a>',
             '<a rel="幼圆" style="font-family: 幼圆;" href="javascript:void(0)"><span class="cur"></span>幼圆</a>',
             '<a rel="Arial" style="font-family: Arial;" href="javascript:void(0)"><span class="cur"></span>Arial</a>',
             '<a rel="Arial Narrow" style="font-family: Arial Narrow;" href="javascript:void(0)"><span class="cur"></span>Arial Narrow</a>',
             '<a rel="Arial Black" style="font-family: Arial Black;" href="javascript:void(0)"><span class="cur"></span>Arial Black</a>',
             '<a rel="Comic Sans MS" style="font-family: Comic Sans MS;" href="javascript:void(0)"><span class="cur"></span>Comic Sans MS</a>',
             '<a rel="Courier" style="font-family: Courier;" href="javascript:void(0)"><span class="cur"></span>Courier</a>',
             '<a rel="System" style="font-family: System;" href="javascript:void(0)"><span class="cur"></span>System</a>',
             '<a rel="Times New Roman" style="font-family: Times New Roman;" href="javascript:void(0)"><span class="cur"></span>Times New Roman</a>',
             '<a rel="Verdana" style="font-family: Verdana;" href="javascript:void(0)"><span class="cur"></span>Verdana</a>',
         '</div>',
         '<div class="font-type-btn" style="display:none;">',
             '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
             '默认:<span id="defaultFamily"></span>',
         '</div>',
        '</div>'].join(""),
        onSelect: function (e) {
            var value = e.target.style.fontFamily;
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.fontFamily) {
                style.fontFamily = style.fontFamily.replace(/'/g, "");//过滤掉多余的引号，如：'Arial Black' 
                this.$("a[rel='" + style.fontFamily + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            var defaultFamily = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().family;
            if (!defaultFamily) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultFamily').text(defaultFamily);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.FaceSizeMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontSizeList a": "onSelect"
        },
        template: ['<div class="menuPop shadow font-type" style="left:600px;top:660px;">',
             '<div class="fonttype-list FontSizeList">',
                 '<a href="javascript:void(0)" rel="x-small"><span style="font-size:x-small;"><span class="cur"></span>六号</span></a>',
                 '<a href="javascript:void(0)" rel="small"><span style="font-size:small;"><span class="cur"></span>五号</span></a>',
                 '<a href="javascript:void(0)" rel="medium"><span style="font-size:medium;"><span class="cur"></span>四号</span></a>',
                 '<a href="javascript:void(0)" rel="large"><span style="font-size:large;"><span class="cur"></span>三号</span></a>',
                 '<a href="javascript:void(0)" rel="x-large"><span style="font-size:x-large;"><span class="cur"></span>二号</span></a>',
                 '<a href="javascript:void(0)" rel="xx-large"><span style="font-size:xx-large;"><span class="cur"></span>一号</span></a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultSize"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var target = M139.Dom.findParent(e.target, "a") || e.target;
            var map = {
                "xx-large": 6,
                "x-large": 5,
                "large": 4,
                "medium": 3,
                "small": 2,
                "x-small": 1
            };
            var value = map[target.getAttribute("rel")];
            this.trigger("select", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        getPxSize:function(fontSizeText){
            if (/\d+$/.test(fontSizeText)) {
                fontSizeText = ({
                    6: "xx-large",
                    5: "x-large",
                    4: "large",
                    3: "medium",
                    2: "small",
                    1: "x-small"
                })[fontSizeText] || fontSizeText;
            }
            return fontSizeText;
        },

        /**
         藏默认字体菜单
         *@inner
        */
        hideDefaultFont: function () {
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },

        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            var selectedFontSize = this.getPxSize(style.fontSize);
            this.$("a.on").removeClass("on");
            // style.fontSize IE8对选区设置新字号后会得到数字，而默认会得到像素值，chrome总是得到像素值
            if (style.fontSize) {
                this.$("a > span").each(function () {
	                // IE8 get text value such as "medium", chrome get pixel value
                    var menuValue = M139.Dom.getCurrentCSS(this, "font-size");
                    // fix: old IE不勾选默认字号
                    if(isNaN(parseInt(menuValue)) && this.innerText.indexOf(style.fontSizeText) != -1) {
	                    $(this.parentNode).addClass("on");
                    } else if (selectedFontSize == menuValue) {
                        $(this.parentNode).addClass("on");
                        return false;
                    } else if (style.fontSize == "12px" && parseInt(menuValue) < 12) {
                        //chrome有时候最小字体是12px
                        $(this.parentNode).addClass("on");
                        return false;
                    }
                });
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie && $B.getVersion() < 8) {
                this.$el.html(this.$el.html());
            }
            
            var defaultSize = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().sizeText;
            if (!defaultSize) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultSize').text(defaultSize);
            }
            
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.ColorMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click .ColorList a": "onSelect"
        },
        colors: ["0, 0, 0", "153, 51, 0", "51, 51, 0", "0, 51, 0", "0, 51, 102", "0, 0, 128", "51, 51, 153", "51, 51, 51", "128, 0, 0", "255, 102, 0", "128, 128, 0", "0, 128, 0", "0, 128, 128", "0, 0, 255", "102, 102, 153", "128, 128, 128", "255, 0, 0", "255, 153, 0", "153, 204, 0", "51, 153, 102", "51, 204, 204", "51, 102, 255", "128, 0, 128", "153, 153, 153", "255, 0, 255", "255, 204, 0", "255, 255, 0", "0, 255, 0", "0, 255, 255", "0, 204, 255", "153, 51, 102", "192, 192, 192", "255, 153, 204", "255, 204, 153", "255, 255, 153", "204, 255, 204", "204, 255, 255", "153, 204, 255", "204, 153, 255", "255, 255, 255"],
        //colors: ["000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333", "800000", "ff6600", "808000", "008000", "008080", "0000ff", "666699", "808080", "ff0000", "ff9900", "99cc00", "339966", "33cccc", "3366ff", "800080", "999999", "ff00ff", "ffcc00", "ffff00", "00ff00", "00ffff", "00ccff", "993366", "c0c0c0", "ff99cc", "ffcc99", "ffff99", "ccffcc", "ccffff", "99ccff", "cc99ff", "ffffff"],
        insertPath: ".fontcolor-list",
        template: ['<div class="menuPop shadow font-colorpop" style="left:820px;top:860px;">',
             '<div class="fontcolor-list ColorList">',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            var value = (e.target.firstChild || e.target).style.backgroundColor;
            this.trigger("select", { value: value });
        },
        render: function () {
            var htmlCode = [];
            var colors = this.colors;
            var itemTemplate = '<a href="javascript:void(0)" rel="#color#"><span style="background-color:#color#"></span></a>';
            for (var i = 0; i < colors.length; i++) {
                var c = colors[i];
                htmlCode.push(itemTemplate.replace(/\#color\#/g, "rgb(" + c + ")"));
                //htmlCode.push(itemTemplate.replace(/\#color\#/g, "#" + c));
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onChangeButtonClick: function () {
            //todo 显示修改默认字体菜单
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        show: function () {
            var This = this;
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            var selColor = (this.options && this.options.isBackgroundColor) ? style.backgroundColor : style.color;
            if (selColor) {
                var rgb = this.getRGBColor(selColor);
                this.$("a[rel='" + rgb + "']").addClass("on");
            }
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.TableMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click td": "onSelect",
            "mouseover td > div": "onItemMouseOver"
        },
        Rows: 10,
        Cells: 10,
        insertPath: "table",
        template: ['<div class="menuPop shadow tabpop" style="left:620px;top:860px;">',
         '<p>请选择表格大小<label></label></p>',
         '<table></table>',
        '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var dom = e.target.firstChild || e.target;
            return {
                rows: dom.getAttribute("rowIndex") * 1 + 1,
                cells: dom.getAttribute("cellIndex") * 1 + 1
            };
        },
        //鼠标移过显示选中效果
        onItemMouseOver: function (e) {
            var sel = this.getSelectedValue(e);
            this.$("label").text(" " + sel.rows + "行" + sel.cells + "列");
            this.$("td").each(function () {
                if (this.cellIndex < sel.cells && this.parentNode.rowIndex < sel.rows) {
                    this.className = "on";
                } else {
                    this.className = "";
                }
            });
        },
        render: function () {
            var htmlCode = [];
            var rows = this.Rows;
            var cells = this.Cells;
            var htmlCode = [];
            for (var i = 0; i < rows; i++) {
                htmlCode.push("<tr>");
                for (var j = 0; j < cells; j++) {
                    htmlCode.push("<td><div rowIndex='" + i + "' cellIndex='" + j + "'></div></td>");
                }
                htmlCode.push("</tr>");
            }
            this.$(this.insertPath).html(htmlCode.join(""));

            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.RowSpaceMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnChangeDefault": "onChangeButtonClick",
            "click .FontLineHeightList a": "onSelect"
        },
        Rows: 10,
        Cells: 10,
        template: ['<div class="menuPop shadow font-type" style="left:820px;top:1060px;">',
             '<div class="fonttype-list FontLineHeightList">',
             '<a href="javascript:;" rel="1.2"><span class="cur"></span>单倍</a>',
             '<a href="javascript:;" rel="1.5"><span class="cur"></span>1.5倍</a>',
             '<a href="javascript:;" rel="2"><span class="cur"></span>2倍</a>',
             '<a href="javascript:;" rel="2.5"><span class="cur"></span>2.5倍</a>',
             '</div>',
             '<div class="font-type-btn" style="display:none;">',
                 '<a href="javascript:void(0)" title="修改" class="font-a BtnChangeDefault"><i class="i_setn"></i></a>',
                 '默认:<span id="defaultLineHeight"></span>',
             '</div>',
         '</div>'].join(""),
        onSelect: function (e) {
            this.trigger("select", {
                value: this.getSelectedValue(e)
            });
        },
        getSelectedValue: function (e) {
            var val = e.target.getAttribute('rel');
            return val * 1;
        },
        onDefaultValueChange: function (value) {
            this.trigger("defaultvaluechange", { value: value });
        },
        onChangeButtonClick: function () {
            return M2012.UI.HTMLEditor.View.Menu.prototype.onChangeButtonClick.apply(this, arguments);
        },
        
        /**
         藏默认行距菜单
         *@inner
        */
        hideDefaultFont:function(){
            this.$el.find(".font-type-btn").hide();
        },
        
        /**
         显示默认字体菜单
         *@inner
        */
        showDefaultFont:function(){
            this.$el.find(".font-type-btn").show();
        },
        
        show: function () {
            var style = this.editorView.editor.getSelectedStyle();
            this.$("a.on").removeClass("on");
            if (style.lineHeight) {
                this.$("a[rel='" + style.lineHeight + "']").addClass("on");
            }
            //ie bug 会显示多个打勾
            if ($B.is.ie) {
                this.$el.html(this.$el.html());
            }
            
            var defaultLineHeight = M2012.UI.HTMLEditor.Model.Editor.getDefaultFont().lineHeightText;

            if (!defaultLineHeight) {
                this.hideDefaultFont();
            }else if(this.editorView.isShowSetDefaultFont){
                this.showDefaultFont();
                this.$('#defaultLineHeight').text(defaultLineHeight);
            }

            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        }
    });

    M2012.UI.HTMLEditor.View.LinkMenu = M2012.UI.HTMLEditor.View.Menu.extend({
        events: {
            "click a.BtnYes": "onSelect",
            "click": "onContainerClick",
            "click a.i_u_close": "hide",
            "click a.BtnTestLink": "onTestLinkClick",
            "click a.CloseButton": "onCloseButtonClick"
        },
        template: ['<div class="shadow linkpop" style="position: absolute;">',
             '<a href="javascript:;" title="关闭" class="i_u_close CloseButton"></a>',
             '<ul class="form">',
                 '<li class="formLine">',
                     '<label class="label">要显示的文字：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxText" value="">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label">链接到：</label>',
                     '<div class="element"><input type="text" class="iText inShadow TextBoxUrl" value="http://">',
                     '</div>',
                 '</li>',
                 '<li class="formLine">',
                     '<label class="label"></label>',
                     '<div class="element"><a class="BtnTestLink" href="javascript:;" style="font-family:\'宋体\'">检测此链接&gt;&gt;</a>',
                     '<span class="lbl_linkTip" style="color:red;display:none">  链接格式非法</span>',
                     '</div>',
                 '</li>',
             '</ul>',
             '<p class="ta_r"><a href="javascript:void(0)" class="btnNormal vm BtnYes"><span>确 定</span></a></p>',
         '</div>'].join(""),
        onContainerClick: function (e) {
            //方式默认行为：点击空白自动关闭
            M139.Event.stopEvent(e);
        },
        onTestLinkClick:function(e){
            var value = this.getSelectedValue(e);
            var url = value.url.trim();
            if (url == "") {
                this.$(".TextBoxUrl").focus();
            } else if (this.testLink(url)) {
                window.open(url);
            }
        },
        testLink: function (url) {
            if (M139.Text.Url.isUrl(url)) {
                this.$(".lbl_linkTip").hide();
                return true;
            } else {
                this.$(".lbl_linkTip").show();
                return false;
            }
        },
        onCloseButtonClick:function(){
            this.hide();
        },
        render: function () {
            this.textInput = this.$(".TextBoxText");
            this.urlInput = this.$(".TextBoxUrl");
            var This = this;
            M139.Timing.watchInputChange(this.urlInput[0], function () {
                This.onUrlChange();
            });
            return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
        },
        onUrlChange:function(){
            var text = this.textInput.val();
            var url = this.urlInput.val();
            //如果文本内容为空，则同步url框的值，交互需求
            if (text == "" || url.indexOf(text) == 0) {
                if (url != "http://") {
                    this.textInput.val(url);
                }
            }
        },
        show: function () {
            var This = this;
            this.textInput.val(this.editorView.editor.getSelectedText());
            this.urlInput.val("http://");
            setTimeout(function () {
                This.urlInput.focus();
                This.urlInput.select();
            }, 10);
            return M2012.UI.HTMLEditor.View.Menu.prototype.show.apply(this, arguments);
        },
        onSelect: function (e) {
            var input = this.getSelectedValue(e);
            if (!this.testLink(input.url)) {
                return;
            }
            if (input.text.trim() == "") {
                input.text = value.url;
            }
            this.hide();
            this.trigger("select", {
                text: input.text,
                url: input.url
            });
        },
        getSelectedValue: function (e) {
            return {
                text: this.textInput.val(),
                url: this.urlInput.val()
            };
        }
    });

    //表情菜单
    M2012.UI.HTMLEditor.View.FaceMenu = M2012.UI.HTMLEditor.View.Menu.extend(
        /**
        *@lends M2012.UI.HTMLEditor.View.FaceMenu.prototype
        */
        {
            /** 表情菜单组件
            *@constructs M2012.UI.HTMLEditor.View.FaceMenu
            *@extends M2012.UI.HTMLEditor.View.Menu
            *@param {Object} options 初始化参数集
            *@param {String} options.basePath 可选参数：表情文件的根路径（缺省加载默认配置）
            *@param {Array} options.faces 可选参数：表情文件分类的配置（缺省加载默认配置）
            *@example
            new M2012.UI.HTMLEditor.View.FaceMenu({
                basePath: "/m2012/images/face",
                faces: [{
                    name: "豆豆",
                    folder: "doudou",//文件夹名称
                    thumb: "thumb.png",
                    count: 19,//表情个数
                    pageSize: 40,//一页显示几个
                    height: 20,//缩略图高度
                    thumbOffset: 30,
                    width: 20,//缩略图宽度
                    fileType: "gif",//表情图片文件类型
                    desc: ["假笑", "开心", "坏笑", "晴转阴","...."]//每个表情的描述文字
                }]
            }).render();
            */
            initialize: function (options) {
                options = options || {};

                this.basePath = options.basePath || FaceConfig.basePath;
                this.faces = options.faces || FaceConfig.faces;

                var $el = jQuery((options && options.template) || this.template);
                this.setElement($el);
                this.model = new Backbone.Model();
                return M2012.UI.HTMLEditor.View.Menu.prototype.initialize.apply(this, arguments);
            },
            events: {
                "click .HeaderItem": "onHeaderClick",
                "click .ThumbItem": "onThumbClick",
                "click .PrevPage": "onPrevPageClick",
                "click .NextPage": "onNextPageClick",
                "click .CloseButton": "onCloseClick"
            },
            headerTemplate: '<li class="HeaderItem" data-index="{index}"><a href="javascript:;"><span>{name}</span></a></li>',
            thumbTemplate: ['<div class="ab"><a class="ThumbItem" href="javascript:;" ',
                'index="{index}" ',
                'style="height:{height}px;width:{width}px;',
                'background-position: -{x}px -{y}px;',
                'background-image: url({thumb});',
                'background-repeat: no-repeat;margin:5px;border:0;" ',
                'data-url="{image}" ',
                'title="{alt}"></a></div>'].join(""),
            /*
            <div class="ab">
			<a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
			</div>
            */


            template: ['<div class="tips delmailTips smilepop" style="top:1600px;left:40px;">',
                 '<a class="delmailTipsClose CloseButton" href="javascript:;"><i class="i_u_close"></i></a>',
                 '<div class="tips-text">',
                     '<div class="tab smilepopTab">',
                         '<div class="tabTitle">',
                             '<ul class="HeaderContainer">',
                             '</ul>',
                         '</div>',
                         '<div class="tabMain">',
                             '<div class="tabContent show">',
                                 '<div style="width:449px;height:225px" class="smilelist clearfix ContentContainer">',		
                                    /*
                                    <div class="ab">
						            <a class="ThumbItem" href="javascript:;" style="height:20px;width:20px;background-position: -0px -0px;background-image: url(http://rm.mail.10086ts.cn/m2012/images/face/doudou/thumb.png);background-repeat: no-repeat;margin:5px;border:0;"  title="假笑"></a>
						            </div>
                                     */
                                 '</div>',
                                 '<div class="pagediv clearfix" style="display:none">',//翻页暂时不需要了
                                     '<div class="pageDrop fr page-top mr_10">',
                                         '<span class="pagenum LabelPage"></span>',
                                         '<a class="PrevPage" href="javascript:;">上一页</a>',
                                         '<a class="NextPage" href="javascript:;">下一页</a>',
                                     '</div>',
                                 '</div>',
                             '</div>',
                         '</div>',
                     '</div>',
                 '</div>',
             '</div>'].join(""),
            render: function () {

                this.renderHeaders();

                this.initEvents();

                this.setHeader(0);

                return M2012.UI.HTMLEditor.View.Menu.prototype.render.apply(this, arguments);
            },

            /**
             *绘制头部，即表情分类区
             *@inner
             */
            renderHeaders: function () {
                var list = this.faces;
                var htmlCode = [];
                for (var i = 0; i < list.length; i++) {
                    htmlCode.push(M139.Text.Utils.format(this.headerTemplate,
                    {
                        index: i,
                        name: list[i].name
                    }));
                }
                this.$(".HeaderContainer").html(htmlCode.join(""));
            },

            /**
             *绘制表情内容区
             *@inner
             */
            renderContent: function () {
                var pageIndex = this.model.get("pageindex");
                var headerIndex = this.model.get("header");
                var face = this.faces[headerIndex];
                var htmlCode = [
                '<div style="display:none;left:12px;top: 140px;" class="smilelistView">',
                    '<img class="PreviewImage" width="64" height="64" />',
                '</div>'];
                var startIndex = (pageIndex - 1) * face.pageSize;
                var endIndex = Math.min(face.count, startIndex + face.pageSize);
                for (var i = startIndex; i < endIndex; i++) {
                    var bgImage = this.basePath + "/" + face.folder + "/" + face.thumb;
                    var image = this.basePath + "/" + face.folder + "/" + i + "." + face.fileType;
                    htmlCode.push(M139.Text.Utils.format(this.thumbTemplate,
                    {
                        x: i * face.thumbOffset,
                        y: 0,
                        height: face.height,
                        width: face.width,
                        thumb: bgImage,
                        image: image,
                        alt: face.desc[i],
                        index: i
                    }));
                }
                this.$(".ContentContainer").html(htmlCode.join(""));
            },

            /**
             *绑定事件
             *@inner
             */
            initEvents: function () {
                var This = this;
                this.model.on("change:header", function (model, header) {
                    var face = This.faces[header];
                    model.set("pageindex", null, true);
                    model.set("pageindex", 1);
                    This.focusHeader();
                }).on("change:pageindex", function (model, pageIndex) {
                    This.renderContent();
                    This.updatePageBar();
                });

                this.$(".ContentContainer").mouseover(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewShow(e, e.target.getAttribute("index"));
                    }
                }).mouseout(function (e) {
                    if (e.target.tagName == "A") {
                        This.onPreviewHide(e);
                    }
                });
            },

            /**
             *设置当前表情
             *@inner
             */
            setHeader: function (index) {
                this.model.set("header", index);
            },

            /**
             *点击表情种类的时候
             *@inner
             */
            onHeaderClick: function (e) {
                var li = M139.Dom.findParent(e.target, "li");
                var index = li.getAttribute("data-index");
                this.setHeader(index);
            },

            /**
             *点击x关闭按钮
             *@inner
             */
            onCloseClick: function (e) {
                this.hide();
            },

            /**
             *鼠标悬浮的时候显示预览图片
             *@inner
             */
            onPreviewShow: function (e,index) {
                var url = e.target.getAttribute("data-url");
                var img = this.$("img.PreviewImage").attr("src", url);
                var div = img.parent().show();
                if (index % 14 > 6) {
                    div.css("left", 365);
                } else {
                    div.css("left", 12);
                }
            },

            /**
             *隐藏预览图片
             *@inner
             */
            onPreviewHide: function (e) {
                this.$("img.PreviewImage").parent().hide();
            },

            /**
             *当前标签获得焦点
             *@inner
             */
            focusHeader: function () {
                var index = this.model.get("header");
                this.$(".HeaderItem.on").removeClass("on");
                this.$(".HeaderItem").eq(index).addClass("on");
            },

            /**
             *更新分页信息
             *@inner
             */
            updatePageBar: function () {
                var header = this.model.get("header");
                var page = this.model.get("pageindex");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                var lblText = page + "/" + pageCount;
                this.$(".LabelPage").text(lblText);
                if (pageCount > 1) {
                    this.$(".PrevPage,.NextPage").show();
                } else {
                    this.$(".PrevPage,.NextPage").hide();
                }
            },

            /**
             *当用户点击表情
             *@inner
             */
            onThumbClick: function (e) {
                var url = e.target.getAttribute("data-url");
                //发送出去要加完整路径
                if (url.indexOf("http") == -1) {
                    url = "http://" + location.host + "/" + url;
                }
                this.onSelect({
                    url: url
                });
                return false;
            },

            /**
             *获得当前表情页数
             *@inner
             */
            getPageCount: function () {
                var header = this.model.get("header");
                var face = this.faces[header];
                var pageCount = Math.ceil(face.count / face.pageSize);
                return pageCount;
            },

            /**
             *点击上一页
             *@inner
             */
            onPrevPageClick: function () {
                var page = this.model.get("pageindex");
                if (page > 1) {
                    this.model.set("pageindex", page - 1);
                }
            },
            /**
             *点击下一页
             *@inner
             */
            onNextPageClick: function () {
                var page = this.model.get("pageindex");
                if (page < this.getPageCount()) {
                    this.model.set("pageindex", page + 1);
                }
            },
            /**
             *触发select事件
             */
            onSelect: function (e) {
                this.hide();
                this.trigger("select", {
                    url: e.url
                });
            }
        });

    var FaceConfig = {
        basePath: "/m2012/images/face",
        faces: [
        	{
                name: "生活",
                folder: "life",
                thumb: "thumb.png",
                count: 49,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["鄙视", "踹地板", "得意", "发呆", "奋斗", "睡觉", "委屈", "无聊", "想家", "许愿", "中彩票", "抓狂", "逛街", "开心", "可爱", "恋爱", "伤心", "郁闷", "被K", "迟到了", "加班", "盼发工资", "求美女", "失恋了", "遇见帅哥", "月光了", "健身", "开车兜风", "旅游", "约会", "爱护森林", "春节", "低碳生活", "光棍节", "国庆", "节约用水", "绿色出行", "七夕", "圣诞节", "万圣节", "中秋", "大哭", "愤怒", "开心", "流泪", "窃喜", "伤心", "爽", "郁闷"]
            },
            {
                //表情名称
                name: "豆豆",
                //文件夹名称
                folder: "doudou",
                thumb: "thumb.png",
                //表情个数
                count: 19,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["假笑", "开心", "坏笑", "晴转阴", "愁", "窘", "微笑", "傻笑", "抛媚眼", "装酷", "哭了", "爱慕", "调皮", "见钱眼开", "耍帅", "哈哈笑", "鼠眉鼠眼", "打盹", "生病了"]
            },
            {
                //表情名称
                name: "飞信",
                //文件夹名称
                folder: "fetion",
                thumb: "thumb.png",
                //表情个数
                count: 52,
                //一页显示几个
                pageSize: 84,
                //缩略图高度
                height: 20,
                thumbOffset: 30,
                //缩略图宽度
                width: 20,
                fileType: "gif",
                //每个表情的描述文字
                desc: ["天使","生气","咬牙切齿","困惑","酷","大哭","尴尬","思考","惊呆","拳头","好主意","偷笑","惊讶","睡着了","悲伤","鄙视","微笑","生病了","大笑","沉思","眨眼","失望","天真","担心","困","吓到","饮料","生日蛋糕","猫脸","闹钟","下雨","咖啡","计算机","狗脸","红心","心碎","女生抱抱","男生抱抱","香吻","灯泡","酒杯","手机","月亮","音乐","礼物","彩虹","玫瑰","凋谢","星星","太阳","雨伞","蜗牛"]
            },
            {
                name: "YOYO",
                folder: "yoyo",
                thumb: "thumb.png",
                count: 24,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["撒娇", "惊奇", "眨眼", "无精打采", "乖乖", "俏皮", "淘气", "卡哇伊", "跳舞", "流汗", "打哈欠", "兴奋", "发呆", "帅气", "爱美", "大哭", "悟空", "色咪咪", "西瓜太郎", "兔女郎", "藐视", "疑问", "同情", "牛郎"]
            },
            {
                name: "信封脸",
                folder: "mailer",
                thumb: "thumb.png",
                count: 18,
                pageSize: 84,
                height: 20,
                thumbOffset: 30,
                width: 20,
                fileType: "gif",
                desc: ["害羞", "色", "可爱", "鄙视", "哭", "闭嘴", "冷汗", "抓狂", "衰", "晕", "憨笑", "大骂", "鼓掌", "飞吻", "馋", "偷笑", "可怜", "流泪"]
            }
        ]
    };

    /** 
     解决在非当前窗口创建编辑器的问题
    */
    M2012.UI.HTMLEditor.View.Menu.setWindow = function (window) {
        $ = jQuery = window.jQuery;
        document = window.document;
    };
})(jQuery, _, M139);

﻿/**
 * @fileOverview HTML编辑器的界面
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var document = window.document;

    /**
     *@namespace
     *@name M2012.UI.HTMLEditor.View
     *@inner
     */
    M139.namespace("M2012.UI.HTMLEditor.View", {});


    M139.namespace("M2012.UI.HTMLEditor.View.Editor", superClass.extend(
     /**
      *@lends M2012.UI.HTMLEditor.View.Editor.prototype
      */
    {
        /** HTML编辑器的界面
        *@constructs M2012.UI.HTMLEditor.View.Editor
        *@extends M139.View.ViewBase
        *@param {Object} options 初始化参数集
        *@param {String} options.template 组件的html代码
        *@param {String} options.toolbarPath_Common 常用按钮容器路径（第一排）
        *@param {String} options.buttons_Common 常用按钮
        *@param {String} options.toolbarPath_More 非常用按钮容器路径（第二排）
        *@param {String} options.buttons_More 非常用按钮
        *@param {String} options.showMoreButton 显示更多的切换按钮
        *@example
        */
        initialize: function (options) {

            if (options.buttons_Common && !this.options.toolBarPath_Common) {
                throw "缺少参数:options.toolBarPath_Common";
            }
            if (options.buttons_More && !this.options.toolBarPath_More) {
                throw "缺少参数:options.toolBarPath_More";
            }

            if(options.menus && _.isFunction(options.menus)){
                options.menus = options.menus();
            }

            var div = document.createElement("div");
            div.innerHTML = $T.format(options.template, { blankUrl: this.options.blankUrl });
            this.setElement(div.firstChild);

            this.menus = {};
            this.buttons = {};
            
            this.isShowSetDefaultFont = options.isShowSetDefaultFont;

            return superClass.prototype.initialize.apply(this, arguments);
        },

        /**@inner*/
        render: function () {
            var This = this;

            /**
            *编辑器基础类
            *@filed
            *@type {M2012.UI.HTMLEditor.Model.Editor}
            */
            this.editor = new M2012.UI.HTMLEditor.Model.Editor({
                frame: this.$("iframe")[0]
            });




            this.editor.on("focus", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#focus
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("focus",function(e){});
                */
                This.trigger("focus");
            });
            this.editor.on("blur", function () {
                /**编辑器加载完成(主要是空白页需要网络加载)
                * @name M2012.UI.HTMLEditor.View.Editor#blur
                * @event
                * @param {Object} e 事件参数
                * @example
                editorView.on("blur",function(e){});
                */
                This.trigger("blur");
            });

            this.toolBar_Common = this.$(this.options.toolBarPath_Common);
            
            if(this.options.isSessionMenu || this.options.isUserDefineBtnContaier){ //全局查找
                this.toolBar_Common = $(this.options.toolBarPath_Common);
            }

            this.toolBar_More = this.$(this.options.toolBarPath_More);

            //注册常用按钮（第一排）
            var buttons_Common = this.options.buttons_Common;
            if (buttons_Common) {
                for (var i = 0; i < buttons_Common.length; i++) {
                    var btn = buttons_Common[i];
                    this.registerButton(btn, true);
                }
            }
            //注册非常用按钮（第二排）
            var buttons_More = this.options.buttons_More;
            if (buttons_More) {
                for (var i = 0; i < buttons_More.length; i++) {
                    var btn = buttons_More[i];
                    this.registerButton(btn);
                }
            }


            //注册菜单
            var menus = this.options.menus;
            if (menus) {
                for (var i = 0; i < menus.length; i++) {
                    var menu = menus[i];
                    this.registerMenu(menu);
                }
            }

            if (this.options.showMoreButton) {
                this.$(this.options.showMoreButton).click(function () {
                    This.onShowMoreClick();
                });
            }

            this.initEvents();

            return superClass.prototype.render.apply(this, arguments);
        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 按钮名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {String} options.command 按钮绑定的指令
         *@param {String} options.menu 按钮绑定的菜单
         *@param {Function} options.callback 点击按钮后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
         *@param {Boolean} isCommonButton 是否常用按钮(放在第一排)
        */
        registerButton: function (options, isCommonButton) {
            var This = this;

            var toolBar = isCommonButton ? this.toolBar_Common : this.toolBar_More;
            var el = toolBar[0];
            if (options.isLine) {
                //添加分割线
                $D.appendHTML(el, options.template);
            } else {
                //添加按钮的dom元素
                $D.appendHTML(el, options.template);
                var btn = jQuery(el.lastChild).click(function (e) {
                    This.onButtonClick(this, e, options);
                }).bind("dblclick",function(e){
                    This.onButtonDblClick(this, e, options);
                });

                if (options.queryStateCallback) {
                    //当光标选择区域变化的时候，需要通知到按钮变更外观
                    this.editor.on("bookmarkchange", function (e) {
                        options.queryStateCallback({
                            selectedStyle: e.selectedStyle,
                            editor:this,
                            element: btn
                        });
                    });
                }
                if(options.init){
                    options.init({
                        editor:this.editor,
                        element:btn
                    });
                }
            }
            this.buttons[options.name] = options;

        },

        /**
         *注册按钮
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名称，作为键值
         *@param {String} options.template 按钮的html代码
         *@param {Function} options.callback 点击菜单项后的回调
         *@param {Function} options.queryStateCallback 查询状态回调（比如当前选中的文字颜色对此按钮的表现有影响）
        */
        registerMenu: function (options) {
            var This = this;
            this.menus[options.name] = options;
        },

        initEvents: function () {
            var This = this;
            this.editor.on("afterexeccommand", function (e) {
                if (e.command == "ForeColor") {
                    This.$el.find("#ED_SetFontColor span").css("background-color", e.param);

                    // 写信弹出窗口新增,如果找不到元素,默认为evocationEidtBar
                    // fix: 选择颜色, 颜色条不会改变的问题
                    if (!This.$el.find("#ED_SetFontColor span").length ) {
                        $("#evocationEidtBar").find("#ED_SetFontColor span").css("background-color", e.param);
                    }
                } else if (e.command == "BackColor") {
                    This.$el.find("#ED_SetBackgroundColor span").css("background-color", e.param);
                }
            });

            //检测输入值是否超出最大长度限制
            if (this.options.maxLength) {
                this.editor.on("keydown", function () {
                    This.testInputLength();
                });
            }
            //显示默认文本
            if (this.options.placeHolder) {
                this.editor.on("ready", function () {
                    This.initPlaceHolder();
                    This.editor.on("keyup", function () {
                        This.showPlaceHolder();
                    });;
                });
            }
        },

        /**
         *初始化默认提示文本
         *@inner
         */
        initPlaceHolder: function () {
            var This = this;
            var el = this.$el.find(".PlaceHolder");
            el.html(this.options.placeHolder);
            el.click(function () {
                This.editor.focus();
            });
            this.showPlaceHolder();
            this.editor.on("setcontent", function () {
                This.showPlaceHolder();
            });
        },

        /**
         *显示默认提示文本
         *@inner
         */
        showPlaceHolder:function(){
            var el = this.$el.find(".PlaceHolder");
            var text = $(this.editor.editorDocument.body).text();
            if (text == "") {
                el.show();
            } else {
                el.hide();
            }
        },

        /**
         *在编辑器上方显示小提示，3秒消失
         */
        showErrorTips: function (msg) {
            clearTimeout(this.errorTipHideTimer);
            var el = this.$el.find(".ErrorTipContent").html(msg).parent();
            el.show();
            this.errorTipHideTimer = setTimeout(function () {
                el.hide();
            },3000);
        },

        /**
         *检测输入值是否超出最大长度限制
         *@inner
         */
        testInputLength: function () {
            var This = this;
            clearTimeout(this.testInputTimer);
            this.testInputTimer = setTimeout(function () {
                var content = This.editor.getHtmlContent();
                var length = M139.Text.Utils.getBytes(content);
                if (length > This.options.maxLength) {
                    This.showErrorTips(This.options.maxLengthErrorTip);
                    M139.Dom.flashElement(This.el);
                }
            }, 500);
        },

        /**
         *显示菜单
         *@param {Object} options 配置参数集
         *@param {String} options.name 菜单名
         *@param {HTMLElement} options.dockElement 停靠的按钮元素
        */
        showMenu: function (options) {
            var This = this;
            this.editor.editorWindow.focus();
            var menu = this.menus[options.name];

            if ($.isFunction(menu.view)) {
                menu.view = menu.view();
                menu.view.on("select", function (e) {
                    menu.callback(This.editor, e);
                });
            }
            menu.view.editorView = this;
            menu.view.render().show(options);

            this.trigger("menushow", {
                name: name
            });
        },

        /**
         *双击按钮
         *@inner
         */
        onButtonDblClick:function(button, e, buttonOptions){
            if (buttonOptions.dblClick){
                buttonOptions.dblClick(this.editor);
            }
        },

        /**@inner*/
        onButtonClick: function (button, e, buttonOptions) {
            //点击色块，直接设置字体颜色，硬编码
            var target = M139.Dom.findParent(e.target, "span") || e.target;
            if (target.id == "ED_SetFontColor") {
                this.editor.setForeColor($(target).find("span").css("background-color"));
                return;
            } else if (target.id == "ED_SetBackgroundColor") {
                this.editor.setBackgroundColor($(target).find("span").css("background-color"));
                return;
            }
            if (buttonOptions.menu) {
                this.showMenu({
                    name: buttonOptions.menu,
                    dockElement: button
                });
            }
            if (buttonOptions.command) {
                this.editor[buttonOptions.command]();
            }


            var btn = M139.Dom.findParent(e.target,"a");
            var command = "";
            if(btn.id){
                command = btn.id.replace("ED_","");
            }

            this.trigger("buttonclick", {
                event: e,
                command:command,
                target: button,
                options: buttonOptions
            });
        },

        /**
         *点击显示更多按钮
         *@inner
         */
        onShowMoreClick: function () {
	        if(this.flashLoaded === undefined) {
		        var node = document.getElementById("flashplayer");
		        var isFlashUpload = !!(supportUploadType.isSupportFlashUpload && node);
		        if(isFlashUpload && this.$("#avflashupload").length == 0){
			        node = node.cloneNode(true);
			        node.setAttribute("id", "avflashupload");
			        this.$(".EditorBarMore").append($("<div></div>").css({
				        position: "absolute",
				        left: $("#ED_Video").position().left + 1 + "px",
				        top: "29px",
				        width: "45px",
				        height: "23px",
				        opacity: 0
			        }).append(node));
		        }
		        this.flashLoaded = isFlashUpload;
	        }
            this.toggleToolBar();
        },

        /**显示/隐藏第二排非常用按钮*/
        toggleToolBar: function () {
            var title = "";
            var editorBody = this.$(".eidt-body");

            if (this.$(".eidt-body").hasClass("eidt-body-full")) {
                title = "隐藏更多操作";
            	editorBody.removeClass("eidt-body-full");
                editorBody.css("height", "+=27");
        	} else {
	        	title = "更多操作";
            	editorBody.addClass("eidt-body-full");
                editorBody.css("height", "-=27");
            }
            this.$("a[bh='compose_editor_more']").attr("title", title);
        }
    })
    )


    var DefaultStyle = {
        //常用按钮容器
        toolBarPath_Common: "div.EditorBarCommon",
        //非常用按钮容器
        toolBarPath_More: "div.EditorBarMore",
        //更多按钮
        showMoreButton: "a.ShowMoreMenu",

        //会话邮件工具按钮  
        toolBarPath_Session: "div.tips-covfont .tips-text",

		//常用按钮集合（第一排）
		buttons_Common: [
			{
				name: "FontFamily",
				menu: "FontFamily_Menu",
				template: ['<a bh="compose_editor_fontfamily" title="设置字体" class="edit-btn" id="ED_FontFamily" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-ff">字体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体  此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontFamily.split(",")[0].replace(/'/g, ""));
					}
				}
			},
			{
				name: "FontSize",
				menu: "FontSize_Menu",
				template: ['<a bh="compose_editor_fontsize" title="设置字号" class="edit-btn" id="ED_FontSize" href="javascript:;">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-fsi">字号</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//显示选中文字的字体 此功能暂时屏蔽
						//e.element.find("span").text(e.selectedStyle.fontSizeText);
					}
				}
			},
			{
				name: "Bold",
				command: "setBold",
				template: ['<a bh="compose_editor_bold" title="文字加粗" href="javascript:;" class="edit-btn" id="ED_Bold">',
								'<span class="edit-btn-rc">',
									'<b class="ico-edit ico-edit-b">粗体</b>',
								'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isBold ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//加粗
			{
				name: "Italic",
				command: "setItalic",
				template: ['<a bh="compose_editor_italic" title="斜体字" href="javascript:;" class="edit-btn" id="ED_Italic">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-i">斜体</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isItalic ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			//下划线
			{
				name: "UnderLine",
				command: "setUnderline",
				template: ['<a bh="compose_editor_underline" title="下划线" href="javascript:;" class="edit-btn" id="ED_UnderLine">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-ud">下划线</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnderLine ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "FontColor",
				menu: "FontColor_Menu",
				template: ['<a bh="compose_editor_color" title="文字颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_FontColor">',
		 						'<span class="edit-btn-rc" id="ED_SetFontColor">',
		 							'<b class="ico-edit ico-edit-color">文字颜色</b>',
		 							'<span class="ico-edit-color-span" style="background-color:rgb(255,0,0);"></span>',
		 						'</span>',
		 						'<span bh="compose_editor_color_select" class="ico-edit-color-xl"></span>',
		 					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "AlignLeft",
				command: "setAlignLeft",
				template: ['<a bh="compose_editor_align_left" title="左对齐" href="javascript:;" class="edit-btn" id="ED_AlignLeft">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alil">左对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignLeft ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignCenter",
				command: "setAlignCenter",
				template: ['<a bh="compose_editor_align_middle" title="居中对齐" href="javascript:;" class="edit-btn" id="ED_AlignCenter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-aliz" id="ED_AlignCenter">居中对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignCenter ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "AlignRight",
				command: "setAlignRight",
				template: ['<a bh="compose_editor_align_right" title="右对齐" href="javascript:;" class="edit-btn" id="ED_AlignRight">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-alir">右对齐</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isAlignRight ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "UnorderedList",
				command: "insertUnorderedList",
				template: ['<a bh="compose_editor_ul" title="插入项目编号" href="javascript:;" class="edit-btn" id="ED_UnorderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl">项目编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isUnorderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{
				name: "OrderedList",
				command: "insertOrderedList",
				template: ['<a bh="compose_editor_ol" title="插入数字编号" href="javascript:;" class="edit-btn" id="ED_OrderedList">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-xl2">数字编号</b>',
							'</span>',
							'</a>'].join(""),
				queryStateCallback: function (e) {
					if (e.selectedStyle) {
						//选中加上edit-btn-on
						e.selectedStyle.isOrderedList ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					}
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			{
				name: "Undo",
				command: "undo",
				template: ['<a bh="compose_editor_undo" title="撤消" href="javascript:;" class="edit-btn" id="ED_Undo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-cx">撤消</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "FormatPrinter",
				command: "setFormatPrinter",
				dblClick:function(editor){
					editor.setFormatPrinterOn(1);
				},
				template: ['<a bh="compose_editor_printer" title="格式刷" href="javascript:;" class="edit-btn" id="ED_FormatPrinter">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-bush">格式刷</b>',
							'</span>',
							'</a>'].join(""),
				init: function (e) {
					e.editor.on("change:printerMode",function(){
						e.editor.get("printerMode") !="off" ? e.element.addClass("edit-btn-on") : e.element.removeClass("edit-btn-on");
					});
				}
			},
			{ isLine: 1, template: '<span class="line"></span>' },
			/*{
				name: "InsertImage",
				menu: "InsertImage_Menu",
				template: ['<a bh="compose_editor_image" title="插入图片" href="javascript:;" class="edit-btn" id="ED_InsertImage">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-pic">图片</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				//啥事没做 外部通过buttonclick事件监听
				name: "ScreenShot",
				template: ['<a bh="compose_editor_screenshot" title="截屏" href="javascript:;" class="edit-btn" id="ED_ScreenShot">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-scr">截屏</b>',
							'</span>',
							'</a>'].join("")
			},*/
			{
				name: "Face",
				menu: "Face_Menu",
				template: ['<a bh="compose_editor_face" title="插入表情" href="javascript:;" class="edit-btn" id="ED_Face">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-smile">表情</b>',
							'</span>',
							'</a>'].join("")
			}/*,
			{
				name: "Preview",
				command: "preview",
				template: ['<a bh="compose_preview" title="预览" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-preview">预览</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "Template",
				command: "Template_Menu",
				template: ['<a bh="compose_insert_template" title="使用模板" href="javascript:;" class="edit-btn" id="ED_Template">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-table">模板</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

		//非常用按钮集合（第二排）
		buttons_More: [
			{
				name: "strikeThrough",
				command: "strikeThrough",
				template: ['<a bh="compose_strike" title="删除线" href="javascript:;" class="edit-btn" id="ED_Delete">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delLine">删除线</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "BackgroundColor",
				menu: "BackgroundColor_Menu",
				template: ['<a bh="compose_editor_bgcolor" title="背景颜色" hideFocus="1" href="javascript:;" class="edit-btn editor-btn-select p_relative " id="ED_BackgroundColor">',
		 					'<span class="edit-btn-rc" id="ED_SetBackgroundColor">',
								'<b class="ico-edit ico-edit-color ico-editbg-color">背景颜色</b>',
								'<span class="ico-edit-color-span ico-editbg-color-span" style="background-color:rgb(192,192,192);"></span>',
							'</span>',
							'<span bh="compose_editor_bgcolor_select" class="ico-edit-color-xl"></span>',
							'</a>'].join("")
			},
			{
				name: "RemoveFormat",
				command: "removeFormat",
				template: ['<a bh="compose_remove_format" title="清除格式" href="javascript:;" class="edit-btn" id="ED_RemoveFormat">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-delFormat">清除格式</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:80px;"></span>' },
			{
				name: "Outdent",
				command: "setOutdent",
				template: ['<a bh="compose_editor_indent" title="减少缩进" href="javascript:;" class="edit-btn" id="ED_Outdent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-jdsj">减少缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Indent",
				command: "setIndent",
				template: ['<a bh="compose_editor_outdent" title="增加缩进" href="javascript:;" class="edit-btn" id="ED_Indent">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-addsj">增加缩进</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "RowSpace",
				menu: "RowSpace_Menu",
				template: ['<a bh="compose_editor_lineheight" title="设置行距" href="javascript:;" class="edit-btn" id="ED_RowSpace">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-sxali">行距</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Table",
				menu: "Table_Menu",
				template: ['<a bh="compose_editor_table" title="插入表格" href="javascript:;" class="edit-btn" id="ED_Table">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-tab">表格</b>',
							'</span>',
							'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom" style="margin-left:26px;"></span>' },
			{
				name: "Redo",
				command: "redo",
				template: ['<a bh="compose_editor_redo" title="恢复撤销的操作" href="javascript:;" class="edit-btn" id="ED_Redo">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-hf">恢复</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "SelectAll",
				command: "selectAll",
				template: ['<a bh="compose_select_all" title="全选" href="javascript:;" class="edit-btn" id="ED_SelectAll">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-allSeled">全选</b>',
					'</span>',
					'</a>'].join("")
			},
			{ isLine: 1, template: '<span class="line lineBottom"></span>' },
			{
				name: "Link",
				menu: "Link_Menu",
				template: ['<a bh="compose_editor_link" title="插入链接" href="javascript:;" class="edit-btn" id="ED_Link">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-link">链接</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "Voice",
				template: ['<a bh="compose_editor_voice" title="语音识别" href="javascript:;" class="edit-btn" id="ED_Voice">',
							'<span class="edit-btn-rc">',
								'<b class="ico-edit ico-edit-voice">语音</b>',
							'</span>',
							'</a>'].join("")
			},
			{
				name: "InsertVideo",
				command: "uploadInsertVideo",
				template: ['<a bh="compose_insert_video" title="将mp4/flv格式的视频文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Video">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-picture">视频</b>',
					'</span>',
					'</a>'].join("")
			},
			{
				name: "InsertAudio",
				command: "uploadInsertAudio",
				template: ['<a bh="compose_insert_audio" title="将mp3格式的音频文件插入邮件正文" href="javascript:;" class="edit-btn" id="ED_Audio">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-music">音乐</b>',
					'</span>',
					'</a>'].join("")
			}/*,
			{
				name: "InsertText",
				command: "uploadInsertDocument",
				template: ['<a bh="compose_insert_doc" title="支持word、xls、ppt、pdf格式的文件插入到邮件正文" href="javascript:;" class="edit-btn" id="ED_Preview">',
					'<span class="edit-btn-rc">',
						'<b class="ico-edit ico-edit-text">文档</b>',
					'</span>',
					'</a>'].join("")
			}*/
		],

        //菜单集合
        menus: function () {
            return [
                //字体
                {
                    name: "FontFamily_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceFamilyMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontFamily(selectValue.value);
                    }
                },
                //字号
                {
                    name: "FontSize_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceSizeMenu() },
                    callback: function (editor, selectValue) {
                        editor.setFontSize(selectValue.value);
                    }
                },
                //字体颜色
                {
                    name: "FontColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu() },
                    callback: function (editor, selectValue) {
                        editor.setForeColor(selectValue.value);
                    }
                },
                //背景颜色
                {
                    name: "BackgroundColor_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ColorMenu({ isBackgroundColor: true }) },
                    callback: function (editor, selectValue) {
                        editor.setBackgroundColor(selectValue.value);
                    }
                },
                //插入表格
                {
                    name: "Table_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.TableMenu() },
                    callback: function (editor, selectValue) {
                        editor.insertTable(selectValue.value);
                    }
                },
                //设置行距
                {
                    name: "RowSpace_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.RowSpaceMenu() },
                    callback: function (editor, selectValue) {
                        editor.setRowSpace(selectValue.value);
                    }
                },
                //插入链接
                {
                    name: "Link_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.LinkMenu() },
                    callback: function (editor, e) {
                        editor.editorWindow.focus();
                        if (e.text.trim() == "") {
                            $Msg.alert("请输入链接文本", { icon: "fail" });
                        } else {
                            if ($B.is.ie || $B.is.firefox) {
                                editor.insertHTML(M139.Text.Utils.format('<a href="{url}">{text}</a>', {
                                    url: e.url,
                                    text: M139.Text.Html.encode(e.text)
                                }));
                            } else {
                                editor.setLink(e.url);
                                if (editor.getSelectedText() != e.text) {
                                    try {
                                        var el = editor.getSelectedElement();
                                        $(el).text(e.text);
                                    } catch (e) { }
                                }
                            }
                        }
                    }
                },
                //插入图片
                {
                    name: "InsertImage_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.ImageMenu() },
                    callback: function (editor, e) {
                        editor.insertImage(e.url);
                    }
                },
                //插入表情
                {
                    name: "Face_Menu",
                    view: function () { return new M2012.UI.HTMLEditor.View.FaceMenu() },
                    callback: function (editor, e) {
                        editor.insertImage(e.url);
                    }
                }
            ]
        },

		//编辑器整体html结构
		template: ['<div class="editorWrap">',
			'<div class="tips write-tips ErrorTip" style="left: 0px; top: -32px; display:none;">',
				'<div class="tips-text ErrorTipContent" style=""></div>',
				'<div class="tipsBottom diamond" style=""></div>',
			'</div>',
			'<div style="position:absolute;width:100%;">',
				'<div class="PlaceHolder" unselectable="on" style="position: absolute;left: 10px;top: 35px;color:silver;z-index:50;font-size:16px;display:none;width:100%;"></div>',
			'</div>',
			'<div class="eidt-body"><!-- eidt-body-full 展开时加上 -->',
				'<div class="eidt-bar">',
					'<a bh="compose_editor_more" hidefocus="1" href="javascript:;" title="更多操作" class="pushon ShowMoreMenu"></a>',
					'<div class="EditorBarCommon eidt-bar-li"></div>',
					'<div class="EditorBarMore eidt-bar-li"></div>',
				'</div>',
				'<div class="eidt-content"><iframe hidefocus="1" src="{blankUrl}" frameborder="0" style="height:100%;border:0;width:100%;"></iframe></div>',
				//右下角的东东
				'<a hidefocus="1" style="display:none" href="javascript:void(0)" class="stationery"></a>',
			'</div>',
		'</div>'].join("")
    };


    /**
     *HTML编辑器命名空间
     *@namespace
     *@name M2012.UI.HTMLEditor
     */
    M139.namespace("M2012.UI.HTMLEditor", {});


    jQuery.extend(M2012.UI.HTMLEditor,
     /**
      *@lends M2012.UI.HTMLEditor
      */
    {
        /**
        *创建一个编辑器实例
        *@param {Object} options 参数集合
        *@param {HTMLElement} options.contaier 可选参数，父元素，默认是添加到body中
        *@param {String} options.blankUrl 编辑区空白页的地址
        *@param {Array} options.hideButton 不显示的编辑按钮
        *@param {Array} options.showButton 显示的编辑按钮
        *@param {Array} options.combineButton 会话模式显示的编辑按钮
        *@param {String} options.userDefined 自定义的常用按钮路径
        *@param {String} options.userDefinedToolBarContainer 自定义的编辑按钮容器
        *@param {String} options.editorBtnMenuDirection 编辑按钮菜单的方向 up/down
        *@param {String} options.editorBtnMenuHeight 编辑按钮菜单的高度
        *@param {Number} options.maxLength 限制最大输入值，超过的时候编辑器会提示
        *@returns {M2012.UI.HTMLEditor.View.Editor} 返回编辑器控件实例
        *@example
        var editorView = M2012.UI.HTMLEditor.create({
            contaier:document.getElementById("myDiv"),
            blankUrl:"html/editor_blank.htm"
        });

        editorView.editor.setHtmlContent("hello world");

        */
        create: function (options) {
            if ($(options.contaier)[0].ownerDocument != document) {
                this.setWindow(window.parent);//解决在top窗口创建编辑器的问题
            }
            //要隐藏的按钮
            if (options.hideButton) {
                $(options.hideButton).each(function (index,menuName) {
                    for (var i = 0; i < DefaultStyle.buttons_Common.length; i++) {
                        var name = DefaultStyle.buttons_Common[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            DefaultStyle.buttons_Common.splice(i, 1);
                            i--;
                        }
                    }
                });
            } else if (options.showButton) {
                var showButtons = [];
                $(options.showButton).each(function (index, menuName) {
                    for (var i = 0; i < DefaultStyle.buttons_Common.length; i++) {
                        var name = DefaultStyle.buttons_Common[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(DefaultStyle.buttons_Common[i]);
                        }
                    }
                });
                DefaultStyle.buttons_Common = showButtons;
                if(!options.showMoreButton){
                    DefaultStyle.buttons_More = null;
                }
            } else if (options.combineButton) {
                var showButtons = [];
                var combineButtons = DefaultStyle.buttons_Common.concat( DefaultStyle.buttons_More );
                $(options.combineButton).each(function (index, menuName) {
                    for (var i = 0; i < combineButtons.length; i++) {
                        var name = combineButtons[i].name;
                        if (name == menuName || name == menuName + "_Menu") {
                            showButtons.push(combineButtons[i]);
                        }
                    }
                });
                DefaultStyle.buttons_Common = showButtons;
                DefaultStyle.toolBarPath_Common = DefaultStyle.toolBarPath_Session;
                DefaultStyle.buttons_More = null;
            }
            
            if(options.userDefinedToolBarContainer){
                DefaultStyle.toolBarPath_Common = options.userDefinedToolBarContainer;
            }

            var view = new M2012.UI.HTMLEditor.View.Editor({
                template: DefaultStyle.template,
                buttons_Common: DefaultStyle.buttons_Common,
                toolBarPath_Common: DefaultStyle.toolBarPath_Common,
                buttons_More: DefaultStyle.buttons_More,
                toolBarPath_More: DefaultStyle.toolBarPath_More,
                menus: DefaultStyle.menus,
                showMoreButton: DefaultStyle.showMoreButton,
                blankUrl: options.blankUrl,
                maxLength: options.maxLength, //最大输入内容值
                maxLengthErrorTip: options.maxLengthErrorTip || "超过最大输入限制：" + options.maxLength + "字节",
                placeHolder: options.placeHolder,
                isSessionMenu: options.combineButton ? true : false,
                isUserDefineBtnContaier: options.userDefinedToolBarContainer ? true : false,
                editorBtnMenuDirection: options.editorBtnMenuDirection,
                isShowSetDefaultFont: options.isShowSetDefaultFont || false
            });
            view.render();
            options.contaier.html(view.$el);
            options.combineButton && $("a.ShowMoreMenu").hide();
            
            if(options.userDefinedToolBarContainer){
                view.$el.find('div.eidt-bar').remove();
            }

            return view;
        },
        /** 解决在非当前窗口创建编辑器的问题
        */
        setWindow: function (window) {
            jQuery = window.jQuery;
            document = window.document;
            M2012.UI.HTMLEditor.View.Menu.setWindow(window);
        }
    });

})(jQuery, _, M139);
