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