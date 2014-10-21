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
