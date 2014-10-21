//添加到命名空间中
//？？文件夹名称格式验证
M139.namespace("M2012.Folder.Model", {
    FolderModel: Backbone.Model.extend({
        /* rm后台文件夹定义
        case 1: // 收件箱
        case 2: // 草稿箱
        case 3: // 已发送
        case 4: // 已删除
        case 5: // 垃圾邮件
        case 6: // 病毒文件夹
        case 7: //  purge_box文件夹 
        case 8: // 我的帐单
        case 9: // 我的订阅
        case 10: // 归档邮件
        case 11: // 广告文件夹
        case 12: // 保留1
        */

        SysFolderId: {  //文件夹id定义
            inbox: 1,
            draft: 2,
            sent: 3,
            deleted: 4,
            junk: 5,
            virus: 6,
            delBack: 7,
            bill: 8,
            archive: 10,
            subscribe: 9,
            advertise: 11,
            business: 12 //商讯生活
        },
        foldertype: {
            system: 1, //系统文件夹
            manager: 2, //管理文件夹 
            custom: 3, //用户文件夹
            tag: 5, //标签文件夹,
            pop: -3//代收文件夹，rm返回的type和自定义文件夹相同，为了与之区分开，定义为-3
        },
        specialtagNames:{
            important:"重要任务",
            urgent:"紧急任务"
        },
        callApi: M139.RichMail.API.call,

        logger : new top.M139.Logger({
			name : "M2012.Folder.Model.FolderModel"
		}),
        //初始化
        initialize: function () {

        },
        //定义默认值
        defaults: {
            //文件夹默认的折叠状态
            unfoldCustom: false,
            unfoldTag: false,
            unfoldPop: false,
            unreadStarCount: 0,
            totalStarCount: 0
        },
          //清除自己的数据
        clear: function () {
            this.destroy();
        },
        getTop: function () {
            var topWindow = M139.PageApplication.getTopAppWindow();
            return topWindow;
        },
        getStarObj: function () {
            var unreadStarCount = this.get("unreadStarCount");
            var result = {
                count: unreadStarCount > 0 ? "<var class='fw_b'>(" + unreadStarCount + ")</var>" : "",
                style: unreadStarCount > 0 ? "" : "",
                title: unreadStarCount > 0 ? $T.Utils.format("{0}封未读邮件", [unreadStarCount]):'星标邮件'
            }
            return result;
        },

        getTaskObj: function () {
            var count = this.get("todoTaskCount");
            var totalCount = this.get("totalTaskCount");
            var style1 = count > 0 ? "" : "display:none;";
            //var style2 = count > 0 ? "font-weight: bold;" : "";
            var result = {
                count: count > 0 ? "<var class='fw_b'>(" + count + ")</var>" : "",
                style: style1, // + style2,
                title: count > 0 ? $T.Utils.format("{0}封任务邮件", [count]) : "待办任务"
            };
            return result;
        },
        getBillObj: function () {
            var newBillCount = this.get("newBillCount");
            var result = {
                count: newBillCount > 0 ? "<var class='fw_b'>(" + newBillCount + ")</var>" : "",
                style: newBillCount > 0 ? "" : "",
                title: newBillCount > 0 ? ($T.Utils.format("{0}封未读邮件", [newBillCount])) : "服务邮件"
            }
            return result;
        },
        getSubscribeObj: function () {
            var newCount = this.get("newSubscriptionCount");
            var result = {
                count: newCount > 0 ? "<var class='fw_b'>(" + newCount + ")</var>" : "",
                style: newCount > 0 ? "" : "",
                title: newCount > 0 ? $T.Utils.format("{0}封未读邮件", [newCount]) : "订阅邮件"
            }
            return result;
        },
        setPopFolders: function () {
            var self = this;
            function clearCustomFolder(fid) {
                self.customFolders=$.grep(self.customFolders, function (n, i) {
                    if (n.fid == fid) {
                        return false;
                    } else {
                        return true;
                    }
                })
            }
            this.pop = _.filter(this.folders, function (item) { //代收文件夹的type不是3，需要通过代收账号关联fid来获取
                
                var popItem = self.getPopItem(item.fid);
                
                if (popItem != null) {
                    if (!item.encoded) {
                        item.encoded = true;//防止执行两次转义
                        item.name = $TextUtils.htmlEncode(item.name);//xss
                    }
                    clearCustomFolder(item.fid);//清道夫
                    item.popId = popItem.popId;
                    item.email = popItem.email;
                    return true;
                }
                //return item.type === self.foldertype.pop; 
            });
        },
        //3个类型的文件夹，系统，自定义，和标签，分别存放。
        //外部取数据时，先调用fetchFolderList 然后再取这3个属性来分别获取数据。
        _resetFolders: function (allFolders) {
            this.folders = allFolders; //加个替身
            var self = this;
            this.customFolders = _.filter(allFolders, function (item) {
                //type=3且不是代收文件夹的
                return (item.type === self.foldertype.custom && !self.isPopFolder(item.fid));
            });
            this.customFolders.sort(function (a, b) {
                return a.location - b.location;
            });
            this.systemFolders = _.filter(allFolders, function (item) {
                if (item.fid == 7) {
                    //item.name = "邮件备份"
                    return false;
                }else if (item.fid == 8) {
                    //item.name = "账单中心"
                    return false;
                } else if (item.fid == 9) {
                    //item.name = "我的订阅"
                    return false;
                } else if (item.fid == 12) { //商讯生活
                    item.name = "商讯生活";
                }
                return item.type === self.foldertype.system || item.type === 2;
            }); //包含type=2的管理文件夹
            this.tags = _.filter(allFolders, function (item) { return item.type === self.foldertype.tag; });
            this.setPopFolders();

            this.trigger('change:folders');
        },

        //获取文件夹列表 ,默认获取全部文件夹，传入type可限定自定义，代收和标签，type 取值参见FOLDERTYPE定义:
        fetchFolderList: function (type, callback, reload) {
            this.trigger('Process');

            if (!callback || !(_.isFunction(callback))) {
                throw new Error('fetchFolderList 第2个参数必须是函数');
            }
            if (!type || _.isNaN(type)) {
                throw new Error('fetchFolderList 第1个参数必须是number 类型的数字');
            }

            if (!reload && (this.folders && this.folders.length !== 0)) {
                callback(this._GetDataByType(type));
                return;
            }

            var self = this;
            console.warn("isFirstLoad:" + this.get("isFirstLoad"));
            if (this.get("isFirstLoad")) { //首次加载节约getAllFolders
                var initData = $App.getConfig("InitData");
                var data = {
                    responseData: {
                        code: "S_OK",
                        "unreadMessageCount": initData["var"].messageInfo["unreadMessageCount"],
                        "unreadStarCount": initData.unreadStarCount,
                        "totalStarCount": initData.totalStarCount,
                        "todoTaskCount": initData.todoTaskCount,
                        "totalTaskCount": initData.totalTaskCount,
                        "totalBillCount": initData.totalBillCount,
                        "newBillCount": initData.newBillCount,
                        "totalSubscriptionCount": initData.totalSubscriptionCount,
                        "newSubscriptionCount": initData.newSubscriptionCount,
                        "var": initData["var"].folderList

                    }
                }
                self.setFoldersData(data);
                self.trigger('ProcessCompleted');
                callback(self._GetDataByType(type));
            } else {
                this.callApi("mbox:getAllFolders", {command:1, visiblePurgeBoxFlag: 1}, function (res) {
                    self.setFoldersData(res);
                    self.trigger('ProcessCompleted');
                    callback(self._GetDataByType(type));
                });
            }
 
        },
        
        setFoldersData: function (res) { //存储文件夹数据到本地变量中
            this.set("unreadMessageCount", res.responseData["unreadMessageCount"]); //保存当前邮件数，用于检查新邮件
            this.set("unreadStarCount", res.responseData["unreadStarCount"]); //未读星标
            this.set("totalStarCount", res.responseData["totalStarCount"]);
            this.set("todoTaskCount", res.responseData["todoTaskCount"] || 0 ); //任务邮件
            this.set("totalTaskCount", res.responseData["totalTaskCount"] || 0);



            this.set("totalBillCount", res.responseData["totalBillCount"] || 0);
            this.set("newBillCount", res.responseData["newBillCount"] || 0);
            this.set("totalSubscriptionCount", res.responseData["totalSubscriptionCount"] || 0);
            this.set("newSubscriptionCount", res.responseData["newSubscriptionCount"] || 0);
			//add by zhangsixue 当所有文件夹未未加密但是总属性显示加密的情况下使用到此属性，兼容服务端BUG!!!
			this.set("passFlag",res.responseData["passFlag"] || 0);
            this.allFolders = res.responseData['var'];
            this._resetFolders(this.allFolders);
        },
        _GetDataByType: function (type) {
            switch (type) {
                case this.foldertype.system: return this.systemFolders;
                case this.foldertype.tag: return this.tags;
                case this.foldertype.custom: return this.customFolders;
                case this.foldertype.pop: return this.pop;
                    //全部文件夹，排除标签
                default: return (this.systemFolders.concat(this.customFolders)).concat(this.pop); //
                    //return this.allFolders;
            }

        },
        /***
        * 获取文件夹，此函数必须要等文件夹加载后才可调用。默认无参数返回全部文件夹，1.system系统文件夹 2.custom 自定义文件夹  3.tag 标签文件夹　4.pop 代收文件夹
        */
        getFolders: function (type) {
            var i_type = this.foldertype[type]
            return this._GetDataByType(i_type);
        },
        /***
        * 根据文件夹id获取文件夹类型
        */
        getFolderType: function (fid) {
            var f = this.getFolderById(fid);
            if (fid == 7 || fid == 8 || fid == 9 || fid == 11 || fid == 12) { return this.foldertype.system }
            
            var type = f.type;

            if (type == this.foldertype.custom) {
                return this.isPopFolder(fid) ? this.foldertype.pop : this.foldertype.custom;
            } else {
                return type;
            }

        },
        //获取邮件数量
        getMailCount: function (type) {
            var list = this.getFolders(type);
            var stats = { 'messageCount': 0, 'messageSize': 0, 'unreadMessageCount': 0, 'unreadMessageSize': 0, 'attachmentNum': 0 }

            $(list).each(function (i, n) {
                stats["messageCount"] += n.stats["messageCount"];
                stats["messageSize"] += n.stats["messageSize"];
                stats["unreadMessageCount"] += n.stats["unreadMessageCount"];
                stats["unreadMessageSize"] += n.stats["unreadMessageSize"];
                stats["attachmentNum"] += n.stats["attachmentNum"];
            });
            return stats;
        },
        isPopFolder: function (fid) {
            return this.getPopItem(fid) != null;
        },
        getPopItem: function (fid) {
            var popItem = null;
            try {
                var app = this.getTop().$App;
                if (app && app.getPopList) { //QQ浏览器异步代码可能比同步代码先执行，造成这里initApi还未执行到，引起getPopList未定义
                    var popList = app.getPopList();
                    $(popList).each(function (idx) {
                        if (this.fid == fid) {
                            popItem = this;
                        }
                    });
                }
            } catch (ex) { }
            return popItem;

        },
        //是否是标签文件夹
        isTagFolder: function (fid) {
            var found = false;
            $(this.tags).each(function (idx) {
                if (this.fid == fid) {
                    found = true;
                }
            });
            return found;
        },
        //根据id获取文件夹
        getFolderById: function (fid) {
            if (!fid || _.isNaN(fid)) {
                //throw new Error('getFolderById：传入number类型的参数');
                fid = 1;
            }
            return _.find(this.folders, function (item) { return item.fid === fid; });
        },

        /**
        *根据文件夹名称获取文件夹
        */
        getFolderByFolderName: function (folderName) {
            if (!folderName || !(_.isString(folderName))) {
                throw new Error('folderName：传入string类型的参数');
            }
            return _.find(this.folders, function (item) {
                return item.name === folderName;
            });
        },
        getTagByTagName: function (tagName) {
            if (!tagName || !(_.isString(tagName))) {
                throw new Error('folderName：传入string类型的参数');
            }
            return _.find(this.tags, function (item) {
                return item.name === tagName;
            });
        },
        messages: {
            forderNameNull: "文件夹名称不能为空",
            forderSpecialStringError: "文件夹中不能包含特殊字符！",
            forderNameOverError: "文件夹名字不能超过16个字母或者8个汉字！",
            folderExist: "文件夹&nbsp;<b>{0}</b>&nbsp;已存在！",
            unvalidRule: '抱歉，您所设置的规则无效，请返回重新设置！',
            clearFolder: '是否清空文件夹?',
            delFolder: '确定要删除该文件夹吗？',
            delTags: '确定要删除该标签吗？',
            folderLocked: '文件夹被加锁，请先<a id="unlockFolder" href="javascript:;" hidefocus="true">解锁</a>',
            notClearFolder: '文件夹不为空，请先清空文件夹',
            mailAddrError: '请输入完整的Email地址，如zhangsan@example.com',
			mailAddrError2: '邮箱地址不正确，邮箱地址如果为多个，请用分号隔开。',
            folderCreateSuccess: '文件夹新建成功',
            folderCreateFail: '文件夹新建失败',
            tagCreateSuccess: '标签新建成功',
            tagCreateFail: '标签新建失败',
            renameFolderSuccess: '文件夹重命名成功',
            renameFolderFail: '文件夹重命名失败',
            renameTagSuccess: '标签重命名成功',
            renameTagFail: '标签重命名失败',
            deleteFolderSuccess: '文件夹删除成功',
            deleteFolderFail: '文件夹删除失败',
            deleteTagSuccess: '标签删除成功',
            deleteTagFail: '标签删除失败',
            moreThan100: '你要创建的收信规则已达到100个的上限，请删除不必要的收信规则后再试',
            clearSuccess: '文件夹清空成功'
        },
        alertWindow: function (text, obj) {
            var self = this;
            var dialog = this.getTop().$Msg.alert(
                    text,
                    {
                        dialogTitle: "系统提示",
                        icon: "warn",
                        isHtml: true,
                        onClose: function (e) {
                            if (obj && obj["id"]) {
                                obj["id"].focus();
                            }
                            if (obj && obj["status"] && obj["status"] == "rename") {
                                obj["id"].select().focus();
                            }
                        }
                    }
                );
            if (obj && obj.unlock) {
                dialog.$el.find("#unlockFolder").click(function (e) {
                    top.$App.show('accountLock', { type: 'unlock' });
                    dialog.close();
                    e.preventDefault();
                })
            }
        },
        checkTagName: function (tagName, skipCount) {//验证标签名称，此函数和checkFolderName流程不一样，返回提示语

            if (tagName == "") {
                return "标签名称不能为空";
            }
            var regex = /^[^\\\/*$"'<>|\^\&\!\%]+$/; /**/
            if (!tagName.match(regex)) {
                return "标签名称中不能包含特殊字符";
            }
            var len = $T.Utils.getBytes(tagName)
            if (len > 16) {
                return "标签名称不能超过16个字母或8个汉字"
            }
            if (!skipCount && this.tags.length >= 50) {
                return "最多可以新建50个标签"

            }
            var result = $.grep(this.tags, function (n, i) {
                return n.name.trim() == tagName.trim();
            });
            if (result.length > 0) {
                return "标签 " + tagName + " 已存在";
            }
            return "";

        },
        //验证文件夹名称
        checkFolderName: function (folderName, obj) {
            var self = this;

            var regex = /^[^\\\/*$"'<>|\^\&\!\%]+$/; /**/
            if (folderName == "") {
                this.alertWindow(self.messages.forderNameNull, obj);
                return false;
            }
            if (!folderName.match(regex)) {
                this.alertWindow(self.messages.forderSpecialStringError, obj);
                return false;
            }
            if (folderName == "我的账单" || folderName == "我的订阅") {
                this.alertWindow($T.Utils.format(self.messages.folderExist, [folderName]), obj);
                return false;
            }
            var len = $T.Utils.getBytes(folderName);
            if (len > 16) {
                this.alertWindow(self.messages.forderNameOverError, obj);
                return false;
            }
            if (this.systemFolders.length + this.customFolders.length >= 100) {
                if (obj && obj.status == "rename") {
                    return true;
                } else {
                    this.alertWindow("最多可以新建100个文件夹", obj);
                    return false;
                }

            }
            try {
                for (var i = 0; i < self.allFolders.length; i++) {
                    if (self.allFolders[i]["name"].trim() == folderName.trim() && self.allFolders[i]["type"] != 5) {//文件夹可以标签重名
                        this.alertWindow($T.Utils.format(self.messages.folderExist, [folderName]), obj);
                        return false;
                    }
                }

            }
            catch (ex) {
                //alert(ex);
            }

            return true;
        },
        checkFolderPassword: function (fid, password, callback) {

            var self = this;


            var options = {
                fid: fid, //rm必须要传这个加密文件夹的fid，否则不工作，
                order: "date",
                desc: 1,
                start: 1,
                total: 1,
                folderPass: password
            }

            this.callApi("mbox:listMessages", options, function (result) {
                var isSuccess = result.responseData["code"] == "S_OK";
                callback(isSuccess);
            });
        },

        //返回ture为未锁
        isLock: function (fid) {
            if (!fid || _.isNaN(fid)) {
                throw new Error('传入number类型的参数');
            }
            var f = this.getFolderById(fid);
            if (f) {
                return f.folderPassFlag ? true : false;
            } else {
                return false;
            }
            //return _.find(this.folders, function (item) { return item.fid === fid; }).folderPassFlag === 0;
        },


        //私有函数 每次view中操作一个folder时候，使用这个方法来取到当前操作的dom对应的folder的id
        _getCurrentOpItem: function (eventTag, prefix) {
            return _.find(this.allFolders, function (item) {
                return parseInt(eventTag.target.id.replace(prefix, '')) === item.fid;
            });
        },

        //私有，用来获取新建立tag时，获取最新的tag颜色。
        _getNewColor: function () {
            var temp = [];
            _.each(this.tags, function (num) { temp.push(num.folderColor); });
            var max = _.max(this.tags, function (item) { return item.folderColor; }).folderColor;
            return _.difference(max + 2, temp)[0];
        },

        //私有，获取文件夹的排序number，用于排序的
        _getMaxFolderLocationId: function () {
            //folder的类型是3
            var self = this;
            if (_.find(this.customFolders, function (item) { return item.type === self.foldertype.custom; })) {
                return _.max(this.customFolders, function (item) { return item.location; }).location;
            }
            //原来的编号顺序是从10001开始，这里沿用
            return 10001;
        },

        //私有，建立标签的时候用到
        _getMaxTagLocationId: function () {
            //tag 类型是5
            var self = this;
            if (_.find(this.tags, function (item) { return item.type === self.foldertype.tag; })) {
                return _.max(this.tags, function (item) { return item.location; }).location;
            }
            //原来的编号是从30002开始这里沿用
            return 30002;
        },

        //这里传递时object对象，
        deleteFolder: function (folderId, folderType, moveToInbox) {
            if (!folderId || _.isNaN(folderId)) {
                throw new Error('deleteFolder 第1个参数必须是 string 类型的密码');
            }
            var self = this;
            var moveToFid = moveToInbox ? 1 : 4; //判断是移到收件箱还是已删除    1 收件箱   4  已删除
            this.trigger('Process');
            this.callApi("global:sequential", { items: [
                { func: "mbox:deleteFolders", "var": { fid: folderId, type: folderType, moveToFid: moveToFid} },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                //if(){

                //}
                self._resetFolders(self.allFolders);
                var Foldertext = self.messages.deleteFolderSuccess;
                var Tagtext = self.messages.deleteTagSuccess;
                if ($App.getFolderById(folderId).type == 3) {
                    top.M139.UI.TipMessage.show(Foldertext, { delay: 2000 });
                } else {
                    top.M139.UI.TipMessage.show(Tagtext, { delay: 2000 });
                }
                self.getTop().appView.trigger('reloadFolder', { reload: true, comefrom: "deleteFolder", fid: folderId });
            });
        },
        /** 
        给文件夹或标签自动加上过滤器        
        fid：文件夹或标签id
        dealHistory是否对历史邮件进行处理( 0: 只对即时邮处理，   1:只对历史邮件处理，  2: 对即时邮件和历史邮件都进行处理)
        */
        addFilterToFolderTag: function (fid, email, dealHistory,callback) {
            if (dealHistory == undefined) { dealHistory = 0; }

            var folderType = this.getFolderType(fid); //获取文件夹类型
            var dealType;
            var postItems = {
                opType: "add", name: "cx", ignoreCase: 1, conditionsRelation: 1, rulePiority: 1, filterId: -1,
                fromType: 1, dealType: -1, forwardBakup: 1, from: email, sortId: 1,onOff:0,fromRelation:0,
                folderId: 0 //只对收件箱处理
            }

            if (folderType == this.foldertype.tag) { //标签
                postItems["dealType"] = 5; //5表示标签
                postItems["attachLabel"] = fid;
                postItems["dealHistoryMail"] = dealHistory; //是否对历史邮件进行处理    
                //postItems["from"] = email;

            } else {
                postItems["dealType"] = 2; //2表示文件夹
                postItems["moveToFolder"] = fid;
                postItems["dealHistoryMail"] = dealHistory;
                //postItems["from"] = email;
            }
            //folder
            this.callApi("user:setFilter_139", {
                items: [postItems]

            }, function (res) {
                callback(res.responseData);
                /*if (res.data.responseData.code && res.data.responseData.code === 'S_OK') {
                    M139.UI.TipMessage.show("邮件分类规则创建成功", { delay: 3000 });
                    if (dealHistory) {
                    $App.trigger("reloadFolder");
                    $App.trigger("showMailbox");
                    }
                }else{
                    M139.UI.TipMessage.show("遇到异常，规则创建失败，请重试", { className:"msgRed",delay: 3000 });

                }*/
            });



        },
        //添加文件夹
        addFolder: function (folderName, from, callback) {
            //alert(this._getMaxFolderLocationId());
            var self = this;
            this.maxSortId = '';
            this.trigger('Process');
            this.callApi("global:sequential", { items: [
                { func: "mbox:createUserFolder", "var": { items: [{ name: folderName, type: this.foldertype.custom, parentId: 0, pop3Flag: 0, folderPassFlag: 0, location: (this._getMaxFolderLocationId() + 1)}]} },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                var code = res.responseData['code'];
                if (code == "S_OK") {
                    self._resetFolders(self.allFolders);
                    top.appView.trigger('reloadFolder', { reload: true });
                    top.M139.UI.TipMessage.show(self.messages.folderCreateSuccess, { delay: 2000 });
                } else {
                    self.alertWindow(self.messages.folderCreateFail);
                    return
                }
                setTimeout(function () {//新增文件夹时，根据自定义文件夹的pop3Flag状态设置是否可以POP  延时请求
                    var popFlag = top.$App.checkCustomFolderPopFlag();
                    popFlag = popFlag ? 1 : 0;
                    var obj = { pop3Flag: popFlag, type: 4, fid: top.$App.getFolderByFolderName(folderName).fid }
                    self.callApi("mbox:updateFolders2", obj, function (res) {
                        top.appView.trigger('reloadFolder', { reload: true });
                    });
                }, 1000);
                var len = self.allFolders.length;
                for (var i = 0; i < len; i++) {
                    if (self.allFolders[i].name == folderName) {
                        var forderId = self.allFolders[i].fid;
                        break;
                    }
                }
                if (from) { //添加文件夹时同时添加过滤器
                    self.callApi("user:getFilter_139", {filterFlag: 0,reqFrom: 0}, function (e) {
                        var max = 0;
                        $.each(e["responseData"]["var"], function (i, o) {
                            max = Math.max(max, o.sortId);
                        });
                        self.callApi("user:setFilter_139", { items: [
                { opType: "add", ignoreCase: 1, forwardBakup: 1, name: "cx", fromType: 1, forwardBakup: 1, dealHistoryMail: 0, conditionsRelation: 1, dealType: 2, moveToFolder: forderId, from: from, filterId: -1, sortId: max + 1 ,onOff:0}
                    ]
                        }, function (e) {
                        });
                    });
                }

                if (callback) {
                    callback(self.getFolderByFolderName(folderName));
                }
            });
        },

        /**
        * 批量添加文件夹
        * @param  {Array}  folderName  文件夹数组
        */
        addFolders: function (folderName, callback) {
            var self = this;
            var folderItem = [];
            for (var i = 0; i < folderName.length; i++) {
                folderItem.push({ func: "mbox:createUserFolder", "var": { items: [{ name: folderName[i], type: this.foldertype.custom, parentId: 0, pop3Flag: 0, folderPassFlag: 0, location: (this._getMaxFolderLocationId() + (1 + i))}]} });
            }
            folderItem.push({ func: "mbox:getAllFolders", "var": { stats: 1, type: 0} });
            this.callApi("global:sequential", { items: folderItem }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                if (callback) { callback(res.responseData['var']) }
            });
        },


        //这个是给文件夹改名
        renameFolder: function (folderId, newName) {
            if (!folderId || !(_.isNumber(folderId))) {
                throw new Error('renameFolder 第1个参数必须是 number 类型的文件id');
            }
            if (!newName || !(_.isString(newName))) {
                throw new Error('renameFolder 第2个参数必须是 string 类型的文件名称');
            }
            var self = this;
            this.trigger('Process');
            this.callApi("global:sequential", { items: [
                { func: "mbox:updateFolders", "var": { items: [{ fid: folderId, name: newName, type: this.foldertype.system, folderPassFlag: 0}]} },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                var code = res.responseData['code'];
                if (code == "S_OK") {
                    self._resetFolders(self.allFolders);
                    top.appView.trigger('reloadFolder', { reload: true });
                    if ($App.getFolderById(folderId).type == 3) {
                        top.M139.UI.TipMessage.show(self.messages.renameFolderSuccess, { delay: 2000 });
                    } else {
                        top.M139.UI.TipMessage.show(self.messages.renameTagSuccess, { delay: 2000 });
                    }

                } else {
                    if ($App.getFolderById(folderId).type == 3) {
                        self.alertWindow(self.messages.renameFolderFail);
                    } else {
                        self.alertWindow(self.messages.renameTagFail);
                    }
                }
            });
        },
        //获取文件夹默认折叠状态 0 总是折叠 1 有未读是展开(默认) 2 总是展开
        getUnfoldStatus: function (type) {
            var unfoldStatus = $App.getCustomAttrs("unfold");
            if (unfoldStatus == "") {
				return 0;
				/* if (type == "tag" || type == "custom") { //标签默认折叠
                    return 0
                }
                else {
                    return 1;
                }
				*/
            }
            var map = { "custom": 0, "tag": 1, "pop": 2 };
            return Number(unfoldStatus.substr(map[type], 1));

        },
        //设置文件夹默认折叠状态 0 总是折叠 1 有未读是展开(默认) 2 总是展开
        setUnfoldStatus: function (type, val, callback) {
            var unfoldStatus = $App.getCustomAttrs("unfold").split("");
            if (unfoldStatus.length == 0) {
                unfoldStatus = [1, 1, 1]; //初始化
            }
            var map = { "custom": 0, "tag": 1, "pop": 2 };
            unfoldStatus[map[type]] = val;
            $App.setCustomAttrs("unfold", unfoldStatus.join(""), callback)
        },
        //文件夹是显示还是隐藏
        changeFolderStatus: function (folderId, hideFlag) {
            if (!folderId || !(_.isNumber(folderId))) {
                throw new Error('folderId 第1个参数必须是 number 类型的文件id');
            }
            var self = this;
            this.trigger('Process');
            this.callApi("global:sequential", { items: [
                { func: "mbox:updateFolders", "var": { items: [{ fid: folderId, hideFlag: hideFlag, type: 7}]} },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);

                self.getTop().appView.trigger('reloadFolder', { reload: true });


            });
        },


        //清空文件夹数据

        clearFolder: function (folderId, callback) {
            if (!folderId || !(_.isNumber(folderId))) {
                throw new Error('clearFolder 第1个参数必须是 number 类型的文件id');
            }
            var self = this;
            this.trigger('Process');

            var paramUpdate = { func: "mbox:updateMessagesAll", "var": { fid: folderId, newFid: 4, type: "move"} };
            if (folderId == 4) {//已删除文件夹，清空表示彻底删除
                paramUpdate = { func: "mbox:updateMessagesAll", "var": { fid: folderId, type: "delete"} }
            }
            this.callApi("global:sequential", { items: [
                paramUpdate,
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                top.M139.UI.TipMessage.show(self.messages.clearSuccess, { delay: 2000 });
                if (callback) { callback() };
            });
        },

        //过滤文件夹
        filterFolder: function (args, callback) {
            var self = this;
            this.trigger('Process');
            self.callApi("user:getFilter_139", {filterFlag: 0,reqFrom: 0}, function (e) {
                var max = 0;
                var data = e["responseData"]["var"];
                $.each(data, function (i, o) {
                    max = Math.max(max, o.sortId);
                });
                args[0].sortId = max + 1;
                if (callback && callback(data)) {
                } else { 
                    return false
                }
                self.callApi("global:sequential2", { items: [
                { func: "user:setFilter_139", "var": { items: args} }
            ]
                }, function (res) {
                    self.callApi("mbox:getAllFolders", { stats: 1, type: 0},function(res) {
                        self.allFolders = res.responseData['var'];
                        self._resetFolders(self.allFolders);
                        self.getTop().appView.trigger('reloadFolder', { reload: true });
                    }) 
                    
                });
            });
            /*
            this.callApi("user:setFilter_New", { items: args }, function (res) {
            self.trigger('ProcessCompleted');
            self.trigger('change:folders');
            self.getTop().appView.trigger('reloadFolder', true);
            });*/
        },
        /*重新排序文件夹的位置（location）
        算法思路：将所有的文件夹fid放入一个数组中，将拖动起始位置到结束的两个fid对调，然后将所有文件夹重新洗牌。
        重新洗牌就是这个算法的全部，使用序列化接口调用mbox:updateFolders，从10001开始重新写入每个文件夹的location
        */
        resetPosition: function (sourceIndex, targetIndex, callback) {
            var self = this;
            //var sourceFolder = this.getFolderById(sourceFid);
            //var targetFolder = this.getFolderById(targetFid);
            var fidList = []; //复制一个fid数组
            $(this.customFolders).each(function (i, n) {
                fidList.push(n.fid);
            });

            //var sourceIndex=1;var targetIndex=4;
            console.log("原始fidList:" + fidList);
            console.log(sourceIndex + "---" + targetIndex);
            var sourceFid = fidList.splice(sourceIndex, 1); //移除源fid
            if (sourceIndex > targetIndex) { //还原因上一步splice引起的索引变化
                targetIndex += 1
            }
            fidList.splice(targetIndex, 0, sourceFid[0]); //插入新位置
            console.log("排序后fidList：" + fidList);



            var postItems = [];
            var startPosition = 10001
            $(fidList).each(function (i, n) {

                postItems.push({
                    func: "mbox:updateFolders",
                    "var": {
                        items: { fid: n, type: 2, location: startPosition + i * 10 }
                    }
                });

            });
            postItems.push({ func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }); //增加刷新文件夹指令
            console.log(postItems);
            this.callApi("global:sequential", {
                items: postItems
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);

                self.getTop().appView.trigger('reloadFolder', { reload: true });
                if (callback) { callback(res.responseData['var']); }
            });


        },
		//标签
		resetPosition2: function(sourceIndex, targetIndex, callback){
			var self = this;
            var fidList = []; //复制一个fid数组
            $(this.tags).each(function (i, n) {
                fidList.push(n.fid);
            });
			
			console.log("原始fidList2:" + fidList);
            console.log(sourceIndex + "---" + targetIndex);
            var sourceFid = fidList.splice(sourceIndex, 1); //移除源fid
            if (sourceIndex > targetIndex) { //还原因上一步splice引起的索引变化
                targetIndex += 1
            }
            fidList.splice(targetIndex, 0, sourceFid[0]); //插入新位置
            console.log("排序后fidList2：" + fidList);
			
			var postItems = [];
            var startPosition = 30001;
            $(fidList).each(function (i, n) {

                postItems.push({
                    func: "mbox:updateFolders",
                    "var": {
                        items: { fid: n, type: 2, location: startPosition + i * 10 }
                    }
                });

            });
            postItems.push({ func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }); //增加刷新文件夹指令
            console.log(postItems);
            this.callApi("global:sequential", {
                items: postItems
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);

                self.getTop().appView.trigger('reloadFolder', { reload: true });
                if (callback) { callback(res.responseData['var']); }
            });
		},
		getInboxSub:function(){
		    var v = $App.getCustomAttrs("inboxSub");
		    if (v) {

		        this.set("inboxSub", v.split(","));
		         
		        return this.get("inboxSub");
		    }
		    return [];
		},
		setInboxSub: function (fid, show) {
		    var arr = this.get("inboxSub");
		    if (!arr) { arr = []; }

		    if (show) { //添加
		        arr.push(fid);
		        BH("show_inboxSub_on");
		    } else {
		        $(arr).each(function (i, n) {
		            if (n == fid) {
		                arr.splice(i, 1);
		            }
		        });
		        BH("show_inboxSub_off");
		    }

		    //this.set("inboxSub", arr);
		    $App.setCustomAttrs("inboxSub", arr.join(","), function () {
		        $App.trigger("reloadFolder", { reload: true });
		    });

		},
        /***
        * 获取预设的tag颜色表
        */
        getAllColor: function () {
            //定义颜色表
            return ["#FF0000", "#FF9900", "#C19A00", "#00A301", "#009898", "#CCCC99", "#FF6633", "#CC6666", "#AD33AD", "#9900FF", "#99CC66", "#66CCCC", "#3399FF", "#2B8787", "#855C85", "#6699FF", "#3385D6", "#335CAD", "#5F27B3", "#262ED7", "#D5D2C0", "#B5BFCA", "#999999", "#666666", "#333333", "#729C3B", "#58A8B4", "#5883BF", "#6D72BA", "#E3A325", "#DA8A22", "#B34731", "#BB4C91", "#995AAE", "#CC0000", "#FCD468", "#FF9966", "#CC99CC", "#CC9999", "#AD855C"]
        },
        /***
        * 获取标签的RGB颜色值
        */
        getColor: function (i) {
            var arr = this.getAllColor();
            //做容错处理，防止数组越界
            if (typeof (i) != "undefined") {
                i = i % arr.length;
                if (i < 0)
                    i = 0;
                else if (i >= arr.length) {
                    i = arr.length - 1;
                }
                return arr[i]
            }
            return arr;
        },
        //给tag改变颜色
        changeFolderColor: function (folderId, colorId) {
            if (!folderId || !(_.isNumber(folderId))) {
                throw new Error('changeFolderColor 第1个参数必须是 number 类型的文件id');
            }
            //alert('fid:' + fid + '  colorId:' + colorId);
            //修改颜色:
            var self = this;
            this.trigger('Process');
            this.callApi("global:sequential", { items: [
                { func: "mbox:updateFolders", "var": { items: [{ fid: folderId, type: this.foldertype.tag, folderColor: colorId}]} },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                //self.trigger('change:folders');
            });
        },
        createSpecialTag: function () {
            var isCreated = $App.getCustomAttrs("specialTag");
            if (!isCreated) {
                $App.setCustomAttrs("specialTag", 1);
                if (this.tags.length < 50) {
                    var arr = [{ name: this.specialtagNames["important"], color: 12 }, { name: this.specialtagNames["urgent"], color: 0 }];
                    for (var i = 0; i < arr.length; i++) {
                        if (!this.getTagByTagName(arr[i].name)) {
                            this.addTag(arr[i].name, arr[i].color);
                        }
                    }
                }
            }
        },
        //添加一个tag
        addTag: function (fname, color, from, callback) {
            if (!fname || !(_.isString(fname))) {
                throw new Error('addTag 第2个参数必须是 number 类型的颜色id');
            }
            var self = this;
            this.trigger('Process');
            if (color == undefined) {
                color = this._getNewColor();
            }

            
            var locationId = (this._getMaxTagLocationId() + 50);
            //特殊处理紧急重要标签
            if (fname == this.specialtagNames["important"]) {
                locationId = 30000;
            } else if (fname == this.specialtagNames["urgent"]) {
                locationId = 30001;
            }

            this.callApi("global:sequential", { items: [
                { func: "mbox:createUserFolder", "var": { items: [{ location: locationId, name: fname, parentId: 0, pop3Flag: 0, folderPassFlag: 0, folderColor: color, type: 5 }] } },
                { func: "mbox:getAllFolders", "var": { stats: 1, type: 0} }
            ]
            }, function (res) {
                self.allFolders = res.responseData['var'];
                self._resetFolders(self.allFolders);

                if (from) { //是同时添加过滤器
                    var folder = self.getFolderByFolderName(fname); //根据名称获取刚刚添加的标签文件夹 todo folder and tagname maybe confiction
                    if (folder) { //容错
                        var labelId = folder.fid;
                        self.callApi("user:getFilter_139", {filterFlag: 0,reqFrom: 0}, function (e) {
                            var max = 0;
                            $.each(e["responseData"]["var"], function (i, o) {
                                max = Math.max(max, o.sortId);
                            });
                            self.callApi("user:setFilter_139", { items: [
		                { opType: "add", ignoreCase: 1, forwardBakup: 1, name: "cx", fromType: 1, dealType: 5, conditionsRelation: 1, attachLabel: labelId, from: from, filterId: -1, sortId: max + 1,onOff:0 }
                        ]
                            }, function (res) {
                            });
                        });
                    }

                }
                var text = self.messages.tagCreateSuccess;
                M139.UI.TipMessage.show(text, { delay: 3000 });

                self.getTop().appView.trigger('reloadFolder', { reload: true });
                if (callback) { callback(self.getTagByTagName(fname)); }
            });
        },
        /***
        * 根据id获取标签
        */
        getTagsById: function (tagIds) {
            /*var result = $.grep(this.tags, function (n, i) {
            var result = $.inArray(n.fid, tagIds);
            return result >= 0;
            })*/
            var result = [];
            for (var i = 0; i < tagIds.length; i++) {
                var tagId = tagIds[i];
                var row = $.grep(this.tags, function (n, i) {
                    return n.fid == tagId;
                });
                if (row.length > 0) {
                    result.push(row[0]);
                }
            }
            return result;
        },
        //获取文件夹下拉菜单
        getFolderDropItems: function (options) {
            function getFolderItems(key) {
                var folderList = $App.getFolders(key);
                var itemsFolder = [];
                $(folderList).each(function (idx, folderItem) {
                    var text = folderItem["name"];
                    var lock = folderItem.folderPassFlag;
                    var item = { text: text, data: folderItem["fid"], lock: lock };
                    if(lock && lock == 1){
                        text += '<i class="i_lock ml_5 mb_5"></i>';
                        item = { html: text, data: folderItem["fid"], lock: lock };
                    }
                    itemsFolder.push(item);
                });
                return itemsFolder;
            }
            var firstItem = [];
            if (options && options.showAll) {//显示全部文件夹
                firstItem = [{ text: "全部文件夹", data: 0 }, { isLine: true}];
            }
            var folderMain = firstItem.concat(getFolderItems("system"));
            var folderCustom = getFolderItems("custom");
            var folderPop = getFolderItems("pop");

            folderCustom[0] && folderMain.push({ isLine: true });
			folderMain = folderMain.concat(folderCustom);
			folderPop[0] && folderMain.push({ isLine: true });
            folderMain = folderMain.concat(folderPop);

            if (options && options.showAdd) {//显示添加文件夹
                folderMain = folderMain.concat([{ isLine: true }, { text: "添加文件夹...", data: -2}]);
            }
            return folderMain;
        },
        //获取标签下拉items
        getTagItem: function (options) {
            var tagList = $App.getFolders("tag");
            var itemsTag = [];
            if (options && options.showNoLimit) {
                itemsTag = [{ html: "不限", labelId: -1}];
            }

            $(tagList).each(function (idx, folderItem) {
                var isSpecial = (folderItem["name"] == "重要任务");
                var color = $App.getTagColor(folderItem["folderColor"]);
                var tagItemHtml = ['<span class="text"><span class="tagMin',  isSpecial ? " tagJJ" : "", '" style="border-color:', color, '"><span class="tagBody" style="background-color:',
            color, ';border-color:', color,
            , '">', isSpecial ? ' <i class="i_jj"></i>' : "", '</span></span><span class="tagText">',
            folderItem["name"], '</span></span>'].join("");
                //tagItemHtml="<b>"+folderItem["name"]+"</b>"
                itemsTag.push({
                    html: tagItemHtml, command: "tag",
                    labelId: folderItem["fid"]
                });
            });

            if (options && options.showAdd) {
                itemsTag = itemsTag.concat([{ html: "新建标签...", labelId: -2}]);
            }
            return itemsTag;
        },
        renderFunctions: {
            getMailCount: function () {
                var count = this.DataRow["stats"]["unreadMessageCount"]; //新邮件数
                return count > 0 ? "<var class='fw_b'>(" + count + ")</var>" : ""; //大于0才显示

            },
            getTitle: function () {
                var d = this.DataRow;
                return d.stats.unreadMessageCount > 0 ? $T.Utils.format("{0}封未读邮件", [d.stats.unreadMessageCount]) : $T.Utils.format("{0}", [d.name]);
            },
            getStyle: function () {
                return this.DataRow["stats"]["unreadMessageCount"] > 0 ? "" : "";
			},
            getSpecialTag:function(type){
                var isSpecial = (this.DataRow["name"] == "重要任务")
                if (isSpecial) {
                    return type == 1 ? " tagJJ" : "<i class=\"i_jj\"></i>";
                } else {
                    return "";
                } 
            },
            getEmail: function () {
                var row = this.DataRow;
                var fid = row["fid"];
                var popList = $App.getPopList();
                var result = $.grep(popList, function (item, i) {
                    if (item.fid == fid) {
                        row["email"] = item["email"];
                        return true;
                    } else {
                        return false;
                    }
                })
                //grep返回值为数组，另外后台可能有脏数据，多个代收账号有可能共用同一个文件夹
                if (result && result.length > 0) {
                    return result[0]["email"];
                } else { //出错了，没找到
                    return row["name"];
                }
            },
            getLock: function () {
                if (this.DataRow["folderPassFlag"]) {
                    return "<i class=\"i_lock mr_5\"></i>";
                } else {
                    return "";
                }
            },
            getColor: function () {
                var color = Number(this.DataRow["folderColor"]);
                return this.model.getColor(color);

            },
            maxLength: function (field, len) {
                return $T.Utils.getTextOverFlow2(field, Number(len), true);
            }

        }

    })
});

/**
* @fileOverview 定义设置页基本参数的文件.
*/
(function (jQuery, _, M139) {
    /**
    *@namespace 
    *设置页基本参数
    */
    M139.namespace('M2012.Settings.Pop.Model', Backbone.Model.extend(
    /**
    *@lends M2012.Settings.Pop.Model.prototype
    */
    {
    defaults: {
        folder: null, //保存初始状态下的文件夹名字 用于和修改后的文件夹名进行对比
        num: 0,
        server: null,
        port: 110,
        username: "",
        password: null,
        timeout: 90,
        isSSL: 0,
        leaveOnServer: 1,
        folderName: null,
        opType: null, //check  验证 
        id: null,
        fid: null,
        popType: 0,
        obj: null, //修改设置时用来还原初始数据
        autoReceive: 1, //add by zhangsixue 0为手动 1为自动.
        flag: 0 // 代收邮件范围0 全部,1 7天内,2 30天内.

    },
    callApi: M139.RichMail.API.call,
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    /**
    *主流邮箱信息
    */
    mainstreamMail: [
            { mail: "163.com" },
            { mail: "126.com" },
            { mail: "yeah.net" },
            { mail: "139.com" },
            { mail: "sohu.com", pop: "Pop3.sohu.com" },
            { mail: "tom.com" },
            { mail: "189.com" },
            { mail: "gmail.com" },
            { mail: "sina.com.cn" },
            { mail: "sina.cn" },
            { mail: "sina.com" },
            { mail: "hotmail.com" },
            { mail: "sougou.com" },
            { mail: "qq.com" },
            { mail: "yahoo.com" },
            { mail: "yahoo.cn", pop: "Pop.mail.yahoo.cn", imap: "imap.mail.yahoo.cn" },
            { mail: "yahoo.com.cn", pop: "Pop.mail.yahoo.com.cn", imap: "imap.mail.yahoo.com" },
            { mail: "eyou.com" },
            { mail: "263.com" },
            { mail: "263.net", pop: "263.net" },
            { mail: "263.net.cn", pop: "263.net.cn" },
            { mail: "wo.com.cn" }

        ],
    //支持迁移通讯录的邮箱 add by zhangsixue
    contactCanBeImport: ["163.com", "126.com", "yeah.net", "21cn.com", "yahoo.com.cn", "yahoo.cn"],
    isContactCanBeImport: function (pop) {
        if ($.inArray(pop, this.contactCanBeImport) > -1) {
            return true;
        }
        return false;
    },
    /**
    *是否主流邮箱的判断
    */
    isMainstream: function (pop) {
        var len = this.mainstreamMail.length;
        for (var i = 0; i < len; i++) {
            var mail = this.mainstreamMail[i]["mail"];
            if (pop == mail) {
                return true;
            }
        }
    },
    /**
    *邮件代收提示文字
    */
    messages: {
        usernameError: "格式错误，如：test@example.com",
        portError: "端口为正整数",
        usernameNull: "代收邮件帐号不能为空，请重新输入",
        passwordNull: "密码不能为空",
        popNull: "不能为空",
        delPOPSuccess: "{0}代收邮箱已删除",
        delPOPFail: "代收邮箱删除失败，请重试",
        portNull: "端口不能为空",
        loadingText: '<div class="loadingtext"><img class="mr_5" src="/m2012/images/global/loading.gif" width="16" height="16" />正在验证代收邮箱帐户...</div>',
        btnGray: '<a href="javascript:void(0)" id="btn_first_step" class="btnNormal btngray"><span>确 定</span></a>',
        btnGrayAndPrevStep: '<a href="javascript:void(0)" id="btn_sure" class="btnNormal btngray"><span>确 定</span></a> <a href="javascript:void(0)" class="btnNormal" id="prevStep"><span>上一步</span></a>',
        usernameAndPasswordNotMatch: "验证失败，邮箱地址和密码<strong>不匹配",
        maybeDueTo: '<strong>验证失败</strong>，原因可能是：<br>1.邮箱地址和密码不匹配；<br>2.pop地址不正确或端口打不开；<br>3.需要在代收邮箱的设置中手动开启POP功能。',
        autoForwardText: '建议您在要代收的邮箱设置“自动转发”，<br>把邮件转发到139邮箱。',
        getMailHtml: '<img src="/m2012/images/global/loading.gif" width="16" height="16" /> 收取中{0}/{1}',
        waitForReceive: '等待收取',
        getingMailHtml: '<a href="javascript:;">收取</a>',
        lockedFolder: '您要删除的是加锁文件夹，请解除加锁后再进行删除',
        getCode: '获取短信验证码',
        reGetCode: '60秒后可重新获取',
        maxsMailsNum: '代收邮箱不能超过8个',
        mailAddrExist: '代收邮箱地址已经存在'
    },
    createFolderName: function (usernameVal) {//有重复代收文件夹名字时在后面自动加上数字   xx   xx1   xx2  xx3
        var folderName = top.$Email.getDomain(usernameVal);
        folderName = folderName.split(".")[0];
        folderName = folderName + "邮箱";
        var data = top.$App.getFolders("pop");
        var len = data.length;
        var arrFolder = [];
        for (var i = 0; i < len; i++) {
            arrFolder.push(data[i].name);
        }
        arrFolder.sort();
        for (var i = 0; i < len; i++) {
            if (arrFolder[i] == folderName) {
                var arr = folderName.match(/\D|\d*/g);
                console.log(arr)
                var arrLen = arr.length;
                var num = arr[arrLen - 2];
                var m = isNaN(num) ? 0 : parseInt(num);
                var n = m + 1;
                if (isNaN(num)) {
                    arr[arrLen - 1] = 1;
                } else {
                    arr[arrLen - 2] = n;
                }
                folderName = arr.join("");

            }
        }
        return folderName
    },
    /**
    *邮件代收提示框
    */
    getTips: function (text) {
        var html = ['<div class="tips yellowtips" style="left:214px;top:0px;">',
            '<div class="tips-text">',
            text,
            '</div>',
            '<div class="tipsLeft diamond"></div>',
            '</div>'].join("");
        return html;
    },
    /**
    *端口格式不对的判断和提示
    */
    portIsError: function (This, portVal, btn) {
        var isNum = /^\d+$/.test(portVal);
        if (!isNum) {
            var text = this.messages.portError;
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    /**
    *邮箱地址格式不对的判断和提示
    */
    usernameIsError: function (This, usernameVal, btn) {
        if (!$Email.isEmail(usernameVal)) {
            var text = this.messages.usernameError;
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    /**
    *输入框为空的判断和提示
    */
    inputIsNull: function (This, val, text, btn) {
        if (val == "") {
            This.after(this.getTips(text));
            btn.addClass("btngray");
            return
        }
    },
    getPOPAccounts: function (callback) {
        var self = this;
        var options = {
            status: 1
        };
        $RM.getPOPAccounts(options, function (result) {
            callback(result);
        });
    },
    // add by zhangsixue 根据id回调账户
    getPOPAccountsById: function (options, callback) {
        $RM.getPOPAccounts(options, function (result) {
            callback(result);
        });
    },
    /**
    *获取代收文件夹的数据
    */
    setPOPAccount: function (callback) {
        var self = this;
        var options = {
            item: {
                opType: this.get("opType"),
                popType: this.get("popType"),
                server: this.get("server"),
                port: this.get("port"),
                username: this.get("username"),
                password: this.get("password"),
                timeout: this.get("timeout"),
                isSSL: this.get("isSSL"),
                folderName: this.get("folderName"),
                fid: 0,
                id: -1,
                isAutoPOP: this.get("autoReceive"),
                leaveOnServer: 1,
                flag: this.get("flag")
            },
            updateDelegatedSend: true,
            autoCreate: true
        }
        $RM.setPOPAccount(options, function (result) {
            callback(result);
        });
    },
    refreshPopList: function (options, type, result) {
        if (result["code"] == "S_OK") {
            var self = this;
            var popId = result["var"]["popId"] || options.id;
            var obj = {
                email: (options["item"] && options["item"]["username"]) ? options["item"]["username"] : "",
                fid: "",
                location: "",
                popId: popId
            }
            self.getPopList(obj, type, function (data) {
                top.$App.registerConfig("PopList", data);
            });
        }
    },
    getPopList: function (obj, type, callback) {
        var self = this;
        self.getPOPAccounts(function (datasource) {
            var popList = top.$App.getConfig("PopList");
            var len = popList.length;
            var max = 0;
            var fid;
            if (type == "add") {
                $.each(popList, function (i, o) {
                    max = Math.max(max, o.location)
                });
                max = max + 200;
                $.each(datasource, function (i, o) {
                    if (obj.popId == o.id) {
                        fid = o.fid;
                    }
                });
                obj.fid = fid;
                obj.location = max;
                popList.push(obj)
            }
            if (type == "set") {
                $.each(popList, function (i, o) {
                    if (obj.popId == o.popId) {
                        popList[i].email = obj.email;
                    }
                });
            }
            if (type == "del") {
                $.each(popList, function (i, o) {
                    if (obj.popId == o.popId) {
                        popList.splice(o, 1)
                    }
                });
            }
            callback(popList)
        })
    },
    /**
    *收取代收邮件
    */
    syncPOPAccount: function (options, callback) {
        var self = this;
        $RM.syncPOPAccount(options, function (result) {
            callback(result);
            self.getTop().appView.trigger('reloadFolder', { reload: true });
        });
    },
    /**
    *修改代收邮件
    */
    modPOPAccount: function (options, callback) {
        var self = this;
        $RM.setPOPAccount(options, function (result) {
            callback(result);
            self.refreshPopList(options, "set", result);
        });
    },
    searchMessages: function (options, callback) {
        var self = this;
        this.callApi("global:sequential", { items: [
                { func: "mbox:searchMessages", "var": options },
                { func: "mbox:getSearchResult", "var": {} }
            ]
        }, function (res) {
            callback(res.responseData);
        });
    },
    //删除文件夹，将邮件移动到收件箱
    moveMessages: function (options, callback) {
        var self = this;
        $RM.moveMessages(options, function (result) {
            callback(result);
        });
    },
    /**
    *删除代收邮件
    */
    delPOPAccount: function (options, callback) {
        var self = this;
        $RM.setPOPAccount(options, function (result) {
            self.getTop().appView.trigger('reloadFolder', { reload: true });
            callback(result);
            self.refreshPopList(options, "del", result);
        });
    },
    /**
    *验证失败时显示的信息 首页和第三步验证都要用到
    */
    getThirdStepHtml: function (obj) {
        var popChecked = "";
        var imapChecked = "";
        var popText = "";
        var port = "";
        var sslChecked = "";
        var popType = this.get("popType");
        var isSSL = this.get("isSSL");
        var auto = obj.autoReceive == 1 ? "checked ='checked'" : '';
        sslChecked = isSSL == 1 ? "checked" : "";
        if (popType == 1) {
            imapChecked = "checked";
            popText = "IMAP：";
            port = isSSL == 1 ? 993 : 143;
        } else {
            popChecked = "checked";
            popText = "POP：";
            port = isSSL == 1 ? 995 : 110;
        }
        var html = ['<li class="formLine">',
            '<label class="label">要代收的邮箱：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popUsername" value="" class="iText">	',
            '</div>',
            '</li>',
            '<li class="formLine ">',
            '<label class="label">邮箱密码：</label>',
            '<div class="element p_relative">',
            '<input type="password" id="popPassword" value="" class="iText">		',
            '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label" >代收方式：</label>',
            '<div class="element">',
            '<label for="pop" class="mr_10" id="popSelect"><input type="radio" name="server" id="pop" value="" ' + popChecked + ' class="mr_5" />POP</label> <label for="imap" id="imapSelect"><input class="mr_5" name="server"' + imapChecked + ' type="radio" id="imap" value="" />IMAP</label>',
            '</div>',
            '</li>',
            '<li class="formLine formLinebot">',
            '<label class="label" id="popText">' + popText + '</label>',
            '<div class="element p_relative">',
            '<input type="text"  id="popPop" value="' + obj.server + '" class="iText">',
            '</div>',
            '</li>	',
            '<li class="formLine">',
            '<label class="label">端口：</label>',
            '<div class="element p_relative">',
            '<input type="text" id="popPort" value="' + port + '" class="iText">',
            '</div>',
            '</li>	',
            '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet" ' + auto + ' class="mr_5"><label for="checkboxGet" class="mr_10">自动收取</label>',
                '</div>',
            '</li>',
            '<li class="formLine">',
            '<label class="label"></label>',
            '<div class="element">',
            '<div class="gray">标准端口号为110</div>',
            '<div><label hidefocus=true for="isSsl"><input type="checkbox"' + sslChecked + ' id="isSsl" class="mr_5" value="">此服务器要求加密连接(SSL)</label></div>',
            '<a class="btnNormal btngray" href="javascript:void(0)" id="btn_third_step"><span>确 定</span></a>	',
            '</div>',
            '</li>'].join("");
        return html;
    },
    getFolderName: function () {

    },
    /**
    *添加代收邮件成功HTML edit by zhangsixue
    */
    addSuccessHtml: function (username, folderName, inPutContacts) {
        var html = ['<div class="setWrap">	', '<div class="setArea">	',
            '<h2><i class="i_ok mr_5"></i><span class="c355c91"> ' + username + ' 设置成功</span></h2>',
            '<ul class="form setForm">',
            '<li class="formLine">',
            '<label class="label">收取邮件：</label>',
            '<div class="element ">',
            '<input maxlength="16" type="text" id="folderName" class="iText" value="' + folderName + '" style="width:100px;"> 文件夹',
            '</div>',
            '</li>',
            '<li class="formLine">',
                    '<label class="label">收取范围：</label>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" checked="checked" value="0"  id="allMail">',
                         '<label for="allMail">全部邮件</label>',
                    '</div>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" value="2" id="oneMonth">',
                         '<label for="oneMonth">最近一个月</label>',
                    '</div>',
                    '<div class="element ">',
                        '<input type="radio" name="range1" value="1" id="seven">',
                        '<label for="seven">最近七天</label>',
                   '</div>',
                '</li>',
                inPutContacts,
            '</ul>',
            '</div>',
            '</div>', '</div>',
            '<div class="setBtn">',
            '<span class="pl_20"><a href="javascript:void(0)" class="btnSetG" id="saveAndReceive"><span style="_width:100px;">保存并收取邮件</span></a></span>'].join("");
        return html;
    },
    //如果是163.com     126.com    yeah.net    sohu.com    21cn.com    yahoo.com.cn    yahoo.cn    ，则添加提示导入通讯录。 add by zhangsixue
    inputContacts: function () {
        var html = ['<li class="formLine">',
                    '<label class="label">导入通讯录：</label>',
                    '<div class="element ">',
                        '<input type="checkbox" name="checkbox" value="1" id="friend" checked="checked">',
                         '<label for="friend">导入联系人</label><span class="gray ml_20">保存至代收邮箱命名的新联系人分组</span>',
                    '</div>',
                '</li>'].join("");
        return html;
    },
    /**
    *修改文件夹命名
    */
    updateFolders: function (options, callback) {
        $RM.updateFolders(options, function (result) {
            callback(result);
        });
    }
})
);
})(jQuery, _, M139);

/**
* @fileOverview 定义设置页代收邮件的文件.
*/
/**
*@namespace 
*设置页代收邮件
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Pop.View.Home', superClass.extend(
    /**
    *@lends M2012.Settings.Pop.View.Home.prototype
    */
	
    {
    initialize: function () {
        var sid = $T.Url.queryString("sid");
        $("#goBack").attr("href", function () {
            return "pop.html?sid=" + sid;
        });
        this.model = new M2012.Settings.Pop.Model();
        this.initEvents();
        this.type = $T.Url.queryString("type"); // successAndReceive   添加成功后跳转到首页并自动收取邮件
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTop: function () {
        return M139.PageApplication.getTopAppWindow();
    },
    /**
    *获取代收文件夹的数据,把数据绑定到模板上，再加载到HTML中。
    */
    render: function () {
        var self = this;
        var result = [];
        var templateStr = $("#popMailTemplate").val();
		//接口合并后，$App.getFolders("pop")和$App.getPopList()中的数据顺序不一致，转换为一致
		function changeOrder(getFolders, getPopList){
			var tmpFolders = {};
			var tmpFoldersOrder = [];
			if(!getFolders || !getPopList){
				return;
			}
			for(var i = 0; i< getFolders.length; i++){
				tmpFolders[getFolders[i]["email"]] = getFolders[i];
			}
			for(var j =0; j<getPopList.length; j++){
				tmpFoldersOrder.push(tmpFolders[getPopList[j]["email"]] || null);
			}
			return tmpFoldersOrder;
		}
        var rp = new Repeater(templateStr);
        this.model.getPOPAccounts(function (datasource) {
            var source = datasource["var"];
			top.publicKey = datasource["publicKey"];
            var popLen = source.length;
            //var data = self.getTop().$App.getFolders("pop");
			var data = changeOrder(top.$App.getFolders("pop"),top.$App.getPopList());
            var len = data.length;
            var folderLen = data.length;
            for (var i = 0; i < len; i++) {
				if(data[i]){
					var name = data[i].email;
					var foldername = data[i].name;
					var size = $T.Utils.getFileSizeText(data[i].stats.messageSize * 1024, {
						maxUnit: "G"
					});
					if (data[i].stats.messageSize == "0") {
						size = "0K";
					}
					result.push({
						email: data[i].email,
						name: foldername,
						unreadMessageCount: data[i].stats.unreadMessageCount,
						messageCount: data[i].stats.messageCount,
						messageSize: size,
						fid: data[i].fid,
						folderPassFlag: data[i].folderPassFlag,
						id: data[i].popId,
						num: i
					})
				}   
            }
            var html = rp.DataBind(result); //数据源绑定后即直接生成dom
            if (source.length == 0) {
                $("#popNoData").show();
                $("#popHasData").hide();
            } else {
                $("#popHasData").show().html(html);

            }
            // 此代码会导致页面刷新的时候，最后一个代收账户自动代收 edit by zhangsixue
            if (popLen > 0) {
                var num = popLen - 1;
                var fid = source[num]["fid"];
                var This = $("#getPopMail_" + fid);
                var options = {
                    id: source[num]["id"]
                }
                if (self.type && self.type == "successAndReceive") {
                    self.freshMail(This, num, options);
                    self.type = ""; //防止删除正在代收的邮箱后，会自动代收下一个邮箱的邮件
                }
            }

            top.BH("pop_load");

        })
        return superClass.prototype.render.apply(this, arguments);
    },
    /**
    *事件处理
    */
    initEvents: function () {
        this.showEditLayer();
        this.hideEditLayer();
        this.addPopMail();
        this.deletePopMail();
        this.editFolderName();
        this.getPopMail();
        //收取所有代收
        this.getPopMailAll();
        //代收记录查询 add by zhangsixue
        $("#getRecords").live("click", function () {
            BH({ key: 'set_pop_queryatmanage' });
            top.$App.show('selfSearch', { type: 2 });
        })
        //    this.getPopMailAll();
    },
    popTime: null,
    /**
    *收取代收邮件 每秒刷新一次
    */
    freshMail: function (This, num, options) {
        var self = this;
        self.model.syncPOPAccount(options, function (dataSource) {
            self.model.getPOPAccounts(function (result) {
            //    var status = result["var"][num]["status"];
							// add by zsx
				if (result["var"][num]) {
					var status = result["var"][num]["status"];
				} else {
					var status = {};
				}
				if(!status){
					console.log(dataSource);
					return false;
				}
                var totalMail = status["messageCount"];
                var receiveMail = status["receivedMessageCount"];
                var html = self.model.messages.getMailHtml;
                html = $T.Utils.format(html, [receiveMail, totalMail]);
                This.html(html);
                self.popTime = setInterval(function () {
                    self.setIntervalPop(This, num, function (text, re) {
                        if (top.$App) {
                            var data = top.$App.getFolders("pop");
                        } else {
                            var data = [];
                        }
                        var len = data.length;
                        This.html(text);
                        for (var i = 0; i < len; i++) {
									// add by zsx
									if (result["var"][num]) {
										var t = result["var"][num]["fid"];
									} else {
										var t = 0;
									}
                            if (data[i].fid == t) {
                                var size = $T.Utils.getFileSizeText(data[i].stats.messageSize * 1024, {
                                    maxUnit: "G"
                                });
                                if (data[i].stats.messageSize == "0") {
                                    size = "0K";
                                }
                                $("#messageCount_" + data[i]["fid"]).html('<span class="c_ff6600">' + data[i]["stats"]["unreadMessageCount"] + '</span>/' + data[i]["stats"]["messageCount"] + '　占用:' + size);
                            }
                        }
                    });
                }, "3000");
            });

        })
    },
    getPopMail: function () {
        var self = this;
        $(".getPopMail").live("click", function () {
            var This = $(this);
            var num = This.parent().attr("num");
            var options = {
                id: This.parent().attr("popId")
            }
            self.freshMail(This, num, options);

        })
    },

    //同步所有的邮件 add by zhangsixue
    getPopMailAll: function () {
        var self = this;
        $("#getAll").live("click", function () {
            self.model.getPOPAccounts(function (result) {
                var length = result["var"].length;
                for (var i = 0; i < length; i++) {
                    var This = $("[num=" + i + "]").find("span").eq(0);
                    var options = {
                        id: result["var"][i]["id"]
                    }
                    self.freshMail(This, i, options);
                }
            });
            BH({ key: 'set_pop_getallatmanage' }); //代收邮件管理页收取全部的人数
        })
    },
    /*
    getPopMailAll: function () {
    var self = this;
    $("#getAll").live("click", function () {
    self.model.getPOPAccounts(function (result) {
    var length = result["var"].length;
    var list = new Array(length);
                
    var ThisArr = [];
    var optionsArr = [];
    for (var j = 0; j < length; j++) {
    list[j] = j;
    ThisArr.push($("[num=" + j + "]").find("a").eq(0));
    optionsArr.push({
    id: result["var"][j]["id"]
    });
    }
    console.log(list.length);
    function ReceivePop() {
    setTimeout(function () {
    popId = list.shift();
    console.log(list.length);
    This = ThisArr.shift();
    options = optionsArr.shift();
    self.freshMail(This, popId, options)
    if (list.length > 0) {
    ReceivePop();
    }
    }, 3000);
    }
    ReceivePop();

    });

    });
    },
    */
    /**
    *收取代收邮件 每次刷新时要显示的界面 收取完成后取消计时器
    */
    setIntervalPop: function (This, num, callback) {
        if (top.$App) {
            top.$App.trigger('reloadFolder', { reload: true });
        }
        var self = this;
        this.model.getPOPAccounts(function (result) {
            if (result["code"] != "S_OK") {
                This.html(self.model.messages.getingMailHtml);
                clearInterval(self.popTime);
                return;
            }
			// add by zsx
            if (result["var"][num]) {
                var status = result["var"][num]["status"];
            } else {
                var status = {};
            }
			if(!status){
				clearInterval(self.popTime);
				return false;
			}
            var totalMail = status["messageCount"];
            var receiveMail = status["receivedMessageCount"];
            var html = self.model.messages.getMailHtml;
            html = $T.Utils.format(html, [receiveMail, totalMail]);
            callback(html, result);
            if (status["code"] && status["code"] == "RUNNING" && status["messageCount"] != 0 && top.$App) {
            } else {
                This.html(self.model.messages.getingMailHtml);
                clearInterval(self.popTime);
            }
        })
    },
    /**
    *鼠标事件 触发修改文件夹名字
    */
    editFolderName: function () {
        var self = this;
		//优化效果，去除无效滑动效果
        $(".folderName").live("mouseover", function () {
			var current = this;
			self.timer2 = setTimeout(function(){
				var name = $(current).text();
				$(".folderInput").hide();
				$(".folderName").show();
				$(current).hide();
				$(current).next().show();
				$(current).next().find("input").val(name);
				self.model.set({ "folder": name });
			},180);
        }).live("mouseout",function(){
			clearTimeout(self.timer2);
		});
        $(".folderNameInput").live("mouseout", function () {
            var This = $(this);
            var val = This.val();
            var obj = {
                id: null,
                status: "rename"
            }
            var text = val == "" ? self.model.get("folder") : val;
            $(".folderName").show();
            $(".folderNameInput").blur();
            This.parent().prev().html($TextUtils.htmlEncode(text)).show();
            This.parent().hide();
            if (text != self.model.get("folder")) {
                if (!self.getTop().$App.checkFolderName(val, obj)) {
                    This.parent().prev().html(self.model.get("folder"));
                    return
                }
                self.updateFolders(text, This);
            }
        })
    },
    callApi: M139.RichMail.API.call,
    /**
    *修改文件夹命名
    */
    updateFolders: function (text, This) {
        var self = this;
        var fid = This.attr("id").split("_")[1];
        var options = {
            fid: fid,
            type: 1,
            name: text
        }
        this.model.updateFolders(options, function (result) {
            if (result["code"] == "S_OK") {
                top.M139.UI.TipMessage.show("文件夹名称修改成功", { delay: 2000 });
                self.getTop().appView.trigger('reloadFolder', { reload: true });
                self.render();
            }

        });
    },
    /**
    *删除代收邮件
    */
    deletePopMail: function () {
        var self = this;
        $(".popDelete").live("click", function () {
            var This = $(this);
            var email = This.attr("email");
            var popup = M139.UI.Popup.create({
                target: This,
                icon: "i_warn",
                width: "342",
                buttons: [{ text: "确定", cssClass: "btnSure", click: function () { self.deleteFolders(This, email); clearInterval(self.popTime); popup.close(); } },
		                { text: "取消", click: function () { popup.close(); } }
	                ],
                content: '<p class="norTipsLine">删除"' + email + '"</p><p><label><input type="radio" checked id="moveMail" name="delete" class="mr_5" value="">邮件和文件夹都删除</label></p><p><label><input name="delete" type="radio" class="mr_5" value="">只删除文件夹，将邮件移动到“收件箱”中</label></p>'
            });

            popup.render();
        })
    },
    /**
    *修改代收邮件设置
    */
    modPOPAccount: function (obj, callback) {
        var self = this;
        var password = $("#popPassword").val();
        $("#sslEvent").bind("click", function () {
            var popPort = $("#popPort");
            if ($("#popSSL").attr("checked")) {
                if (obj.popType == 1) {
                    popPort.val(993);
                } else {
                    popPort.val(995);
                }
            } else {
                if (obj.popType == 1) {
                    popPort.val(143);
                } else {
                    popPort.val(110);
                }
            }
        })
        $("#btnOk" + obj.fid).bind("click", function () {
            $("#sslEvent").after(self.model.messages.loadingText);
            $("#yellowtips").hide();
            var server = $("#popServer").val();
            var id = $("#popServer").val();
            var port = $("#popPort").val();
            var username = $("#popMail").val();
            var isSSL = $("#popSSL").attr("checked");
            var isaoto = $("#checkboxGet2").attr("checked") == "checked" ? 1 : 0; //add by zhangsixue
            var options = {
                item: {
                    opType: "mod",
                    id: obj.id,
                    server: server,
                    port: port,
                    popType: obj.popType,
                    username: username,
                    leaveOnServer: obj.leaveOnServer,
                    timeout: obj.timeout,
                    fid: obj.fid,
                    folderName: obj.folderName,
                    isSSL: 0,
                    isAutoPOP: isaoto,
                    flag: self.model.get("flag")
                }
            };
            var modPassword = $("#popPassword").val();
			
            if (password != modPassword) {
            	if(top.publicKey){
            		var key2	= new RSAKeyPair("10001", '', top.publicKey); 
            //    options.password = modPassword; 改为加密传输，上面为产生密码，下面为加密。
					options.password = encryptedString(key2, modPassword);
            	}else{
            		options.password = modPassword;
            	}
            }
            if (isSSL) {
                options.isSSL = 1;
            }
            self.model.modPOPAccount(options, function (result) {
                if (result["code"] == "S_OK") {
                    $("#popmailTips .content-text").html(self.modSuccessHtml());
                    setTimeout('$("#popmailTips").parent().parent().remove()', 2000);
                    $(".loadingtext").remove();
                    top.$App.trigger("userAttrChange", { callback: function () {
                        top.$App.trigger('reloadFolder', { reload: true });
                        callback();
                    }
                   });

                } else {
                    $(".loadingtext").remove();
                    $("#yellowtips").show();
                }

            });
            return
        });
    },
    /**
    *删除代收邮件
    */
    deleteFolders: function (This, email) {
        var self = this;
        var fid = This.attr("id").split("_")[1];
        var folderPass = This.attr("folderpassflag");
        if (folderPass == 1) {
            self.getTop().$Msg.alert(
                        self.model.messages.lockedFolder,
                        {
                            dialogTitle: "系统提示",
                            icon: "warn"
                        }
                    );
            return;
        }
        var type = $("#moveMail").attr("checked") ? "delete" : "deleteWithoutFolder";
        var options = {
            id: This.parent().attr("popId"),
            opType: "delete"
        }
        var data = {
            fid: fid,
            recursive: 0,
            ignoreCase: 0,
            isSearch: 1,
            isFullSearch: 0,
            start: 1,
            total: 1,
            limit: 10000
        };
        if (type == "deleteWithoutFolder") {
            this.model.searchMessages(data, function (result) {
                if (result["code"] == "S_OK") {
                    var moveData = {
                        ids: result["var"]["mid"],
                        newFid: 1
                    }
                    self.model.moveMessages(moveData, function () {
                        top.$App.trigger("userAttrChange", { callback: function () {
                            top.$App.trigger('reloadFolder', { reload: true });
                        }
                        })
                    })
                } else {
                    top.$Msg.alert(
                                self.model.messages.delPOPFail,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                    return
                };
            })
        } else {
        }
        this.model.delPOPAccount(options, function (dataSource) {
            if (dataSource["code"] == "S_OK") {
                var text = $T.Utils.format(self.model.messages.delPOPSuccess, [email]);
                top.M139.UI.TipMessage.show(text, { delay: 2000 });
                var obj = $("#popTr_" + fid);
                //  console.log(obj.siblings().length)
                //  self.render();
                //  只能移除此行，不能刷新页面，不然其他的代收会延迟,应该是移除当前行，并判断是否为最后一行。
                obj.remove();
                self.model.getPOPAccounts(function (datasource) {
                    var source = datasource["var"];
                    var popLen = source.length;
                    var data = self.getTop().$App.getFolders("pop");
                    var len = data.length;
                    var folderLen = data.length;
                    if (source.length == 0) {
                        $("#popNoData").show();
                        $("#popHasData").hide();
                    }
                });
                clearInterval(self.popTime)

            }

        })
    },
    /**
    *显示修改代收邮件的界面，并获取该条代收邮件的信息填充进HTML页面
    */
    showEditLayer: function () {
        var self = this;
        $("#popHasData").find(".popEdit").live("click", function () {
            if ($("#popmailTips").length > 0) {
                $("#popmailTips").parent().parent().remove()
            }
            var This = $(this);
            var index = This.parent().attr("num");
            self.model.getPOPAccounts(function (datasource) {
                var data = datasource["var"][index];
                var obj = {
                    username: data["username"],
                    port: data["port"],
                    isSSL: data["isSSL"],
                    server: data["server"],
                    popType: data["popType"],
                    checked: "",
                    id: data["id"],
                    fid: data["fid"],
                    leaveOnServer: data["leaveOnServer"],
                    timeout: data["timeout"],
                    folderName: data["folderName"],
                    popText: "",
                    isAuto: "" //add by zhangsixue
                }
                obj.isAuto = data["isAutoPOP"] === 1 ? "checked = 'checked'" : "";
                obj.checked = data["isSSL"] == 1 ? "checked" : "";
                obj.popText = data["popType"] == 1 ? "IMAP" : "POP";
                This.parent().parent().after(self.editHtml(obj))
                self.modPOPAccount(obj, function () {
                    self.render();
                });
            })
        })
    },
    /**
    *代收邮件首页点击修改设置链接的浮层状态
    */
    hideEditLayer: function () {
        $("#popHasData .i_u_close,#btnCancel").live("click", function () {
            $("#popmailTips").parent().remove();
        })
    },
    /**
    *添加代收邮件按钮点击事件
    */
    addPopMail: function () {
        var self = this;
        $("#btn_addpop1,#btn_addpop2").live("click", function () {
            var pop = top.$App.getFolders("pop");
            if (pop.length >= 8) {//代收邮件个数最多8个
                self.getTop().$Msg.alert(
                                self.model.messages.maxsMailsNum,
                                {
                                    dialogTitle: "系统提示",
                                    icon: "warn"
                                }
                            );
                return
            }
            var sid = $T.Url.queryString("sid");
            if (M139.Browser.is.ie) {
                window.event.returnValue = false;
            }
            window.location = "add_pop.html?sid=" + sid;
            $("#popUsername").focus();
        })
    },
    modSuccessHtml: function () {
        var html = ['<div class="collection-ok">',
        '<i class="i_ok_min mr_5"></i><strong>修改设置成功</strong>',
        '</div>'].join("");
        return html;
    },
    /**
    *代收首页 修改代收设置的浮层HTML
    */
    editHtml: function (obj) {
        var html = ['<tr>',
                        '<td colspan="4">',
                        '<div class="tips cillection-tips" id="popmailTips">',
                                '<div class="tips-text">',
                                    '<div class="content-text">',
                                             '<ul class="form form-collection">',
                                                    '<li class="formLine">',
                                                        '<label class="label">要代收的邮箱：</label>',
                                                        '<div class="element">',
                                                                '<input id="popMail" type="text" class="iText" value="' + obj.username + '" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">邮箱密码：</label>',
                                                        '<div class="element">		',
                                                                    '<input id="popPassword" type="password" class="iText" value="**********" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">邮件接收服务' + obj.popText + '：</label>',
                                                        '<div class="element">',
                                                                    '<input id="popServer" disabled type="text" class="iText" value="' + obj.server + '" />',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                                                        '<label class="label">端口：</label>',
                                                        '<div class="element">		',
                                                                    '<div><input id="popPort" type="text" class="iText" value="' + obj.port + '" /><span class="gray ml_10"></span></div>',
                                                                    '<div class="gray">标准端口号为110</div>',
                                                                    '<div><label for="popSSL" id="sslEvent"><input id="popSSL" type="checkbox" ' + obj.checked + ' value="" class="mr_5" />此服务器要求加密连接(SSL)</label></div>',
                                                        '</div>',
                                                    '</li>	',
                                                    '<li class="formLine">',
                '<label class="label">收取设置：</label>',
                '<div class="element">',
                   '<input type="checkbox" value="1" id="checkboxGet2" ' + obj.isAuto + ' class="mr_5"><label for="checkboxGet2" class="mr_10">自动收取</label>',
                '</div>',
           '</li>',
                                                '</ul>	',
                                                '<div class="collection-ok hide"><!-- 修改成功 -->',
                                                    '<i class="i_ok_min mr_5"></i><strong>修改设置成功</strong><br />',
                                                    '2秒后该区域收起',
                                                '</div>',
                                        '</div>',
                                        '<div class="tips-btn">',
                                            '<a href="javascript:void(0)" class="btnNormal " id="btnOk' + obj.fid + '"><span>确 定</span></a>	<a href="javascript:void(0)" class="btnNormal " id="btnCancel"><span>取 消</span></a>',
                                        '</div>',
                                        '<div id="yellowtips" class="tips yellowtips" style="left:457px;top:25px;display:none;">',
                                        '<div class="tips-text">',
                                            '<strong>验证失败</strong>',
                                            '原因可能是：<br />',
                                            '1.邮箱地址和密码不匹配；<br />',
                                            '2.pop地址不正确或端口打不开；<br />',
                                            '3.需在要代收邮箱的设置中手动开启POP功能。',
                                        '</div>',
                                        '<div class="tipsLeft diamond"></div>',
                                    '</div>',
                                '</div>',
                                '<a class="i_u_close" href="javascript:void(0)"></a>',
                                '<div class="tipsTop diamond"></div>',
                            '</div>',
                        '</td>',
                    '</tr>'].join("");
        return html;
    }
})
    );
popHomeView = new M2012.Settings.Pop.View.Home();
popHomeView.render();
})(jQuery, _, M139);



