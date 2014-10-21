M139.namespace("M2012.Mailbox.Model", {
ContextMenu : Backbone.Model.extend({
 initialize:function(options){
     this.mailboxModel = options.mailboxModel;
 },

 getFolderMenu:function(type,fid){
 	var data={
 	    1: [{ text: "打开", command: "open" }, 
            { isLine: true },
            { text: "查看未读", command: "viewUnread" }, { text: "收件箱全部标记为已读", command: "markAll" },
            { isLine: true },
            { text: "创建收信规则", command: "filter" }],
 	2:[ { text: '打开', command:"open" }],
 	3 : [
        { text: '打开', command:"open"},  //已发送
        { isLine: true },
        { text: '全部标记为已读',command:"markAll"},
        { text: '查看已回复邮件',command:"viewReply"}
 	],
 	4: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空已删除', command: "clear" }],
 	5: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空垃圾邮件', command: "clear" }],
 	6: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空病毒邮件', command: "clear" }],
 	10: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空归档邮件', command: "clear" }],
 	11: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空广告邮件', command: "clear" }],
	12: [{ text: '打开', command: "open" }, { isLine: true }, { text: "全部标记为已读", command: "markAll" }, { text: '清空商讯生活邮件', command: "clear" }],
 	8: [{ text: '打开', command: "open" }, { isLine: true }, { text: "查看未读", command: "viewUnread" }, { text: "全部标记为已读", command: "markAll" }],
 	9: [{ text: '打开', command: "open" }, { isLine: true }, { text: "查看未读", command: "viewUnread" }, { text: "全部标记为已读", command: "markAll" }],
 	myfolders: [{ text: "打开", command:"folderManage" }, //我的文件夹
            { isLine: true },
            { text: "展开二级目录", command: "unfold", type: "custom" },
            { text: "二级目录全部标记为已读", command: "markAll", type: "custom" },
            { isLine: true },
            { text: "创建收信规则", command: "filter" }],

    star: [{ text: '打开', command: "showStar" },  
        { isLine: true },
        { text: '全部标记为已读', command: "markAll",type:"star"},
        { text: '创建收信规则', command: "filter" }],
 	other: [{ text: "展开", command: "unfold", type: "other" }],
 	groupMail: [{ text: "打开", command: "jump", key: "groupMail" }],
 	attachlist: [{ text: "打开", command: "jump", key: "attachlist" }],
    custom : [
        { text: '展开', command:"unfold",type:"folder"},
        { isLine: true },
        { text: '全部标记为已读', command:"markAll"},
        { text: '创建收信规则', command:"filter"},
        { isLine: true },
        { text: '新建文件夹', command:"addFolder"},
        { text: '文件夹管理', command: "folderManage" },
         { isLine: true },
         { text: '在收件箱下显示', command: "inboxSub",type:1 }
    ],
    customSub: [
    { text: '展开', command: "unfold", type: "folder" },
    { isLine: true },
    { text: '全部标记为已读', command: "markAll" },
    { text: '创建分拣规则', command: "filter" },
    { isLine: true },
    { text: '新建文件夹', command: "addFolder" },
    { text: '文件夹管理', command: "folderManage" },
     { isLine: true },
     { text: '取消显示', command: "inboxSub", type: 0 }
    ],
    tag : [
        { text: '展开', command: "unfold", type: "tag" },
        { isLine: true },
        //{ text: '全部标记为已读', command: "markAll",type:"tag" },
        { text: '新建标签', command: "addTag" },
        { isLine: true },
        { text: '创建收信规则', command: "filter" },
        { text: '标签管理', command:"folderManage" }
    ],
    pop : [
        { text: '展开', command: "unfold", type: "pop" },
        { isLine: true },
        { text: '全部收取', command: "pop", visible: "father" },
        { text: '全部标记为已读', command:"markAll",type:"pop"}, 
        { isLine: true },
        { text: '新建代收邮件账户', command: "addPop" },
        { text: '其他邮箱管理', command:"folderManage" }
    ], popSub: [
        { text: '打开', command: "open", type: "pop" },
        { isLine: true },
        { text: "查看未读", command: "viewUnread" },
        { text: '收取邮件', command: "pop"},
        { text: '全部标记为已读', command: "markAll"},
        { isLine: true },
        { text: '新建代收邮件账户', command: "addPop" },
        { text: '其他邮箱管理', command: "folderManage" }
    ]
 	}
 	var result; 
 	if (type == "system") { //系统文件夹
 	    
 	    result = data[fid];
 	   
 	} else {

 	    result = data[type];
 	    result.args = { fid: Number(fid) }; //统一添加fid参数

 	    if (fid) { //特殊处理，在二级子文件夹，将菜单定义中父文件夹的展开统一改成打开
 	        
 	        if (type == "pop") {
 	            result = data["popSub"];//pop子目录与父目录菜单不一样，偷粱换柱
 	        }

 	        result[0] = { text: '打开', command: "open" };
 	    }
 	}
 	$(result).each(function (i, n) {
 	    n.args = { fid: Number(fid) }; //统一添加fid参数
 	   
 	})
 	
 	return result;
 	
 },
//获取邮件列表右键菜单 isSingle，是否单封邮件
 getMailMenu: function (fid, isSingle) {
    this.mailboxModel = $App.getMailboxView().model;
     var data = [];
     var currentFid = $App.getCurrentFid();
     if(currentFid === 7)return;
     if (isSingle) { //单封邮件
         data = [
             { text: '预览', command: "preview",bh2:"context_preview", items: [{html:"<b>读信预览</b>"} ]},
             { text: '新窗口打开', command: "newWindow", bh: "context_newWindow" },
             { isLine: true },
             { text: '回复发件人', command: 'reply', bh: "context_reply" },
             { text: '回复全部', command: 'reply',all:true, bh: "context_replyAll" },
             { isLine: true },
             //handleDifferentFolder(curFolderId,4),//delItem,
             //handleDifferentFolder(curFolderId,5),//spamItem,
             { text: '删除', command: "move", args: { fid: 4 }, bh: "context_delete" },
             { text: '举报', command: "spam", bh: "context_spam" },
             { isLine: true },
              { text: '标记为', items: this.mailboxModel.getMarkMenuItems(false,currentFid) , bh2: "context_mark"},
              { text: '标签', items: this.mailboxModel.getTagMenuItems(), bh2: "context_tag" },
             { text: '移动到', items: this.getMoveItem(), bh2: "context_move" }

         ];
     } else { //多封
         data = [
             { text: '删除', command: "move", args: { fid: 4 }, bh: "context_move" },
             { text: '举报', command: "spam", bh: "context_spam" },
             { isLine: true },
             { text: '标记为', items: this.mailboxModel.getMarkMenuItems(false,currentFid), bh2: "context_mark" },
             { text: '移动到', items: this.getMoveItem(), bh2: "context_move" }
         ];
     }
     //不显示举报入口
     if(!top.mailboxComplaintView.model.isShowComplaintBtn()){
        $.each(data, function (i, n) {
            if (n["command"] && n["command"] == "spam") {
                data.splice(i,1);
                return false;
            }
        });
     }

     //var currentFid = $App.getCurrentFid();
     if (currentFid == 5) { //特殊处理垃圾文件夹
         $.each(data, function (i, n) {
             if (n["command"] && n["command"] == "spam") {
                 data[i] = { text: '这不是垃圾邮件', command: "unSpam" };
             }
         });
     }
     if (currentFid == 4 || this.mailboxModel.get("isSearchMode")) { //特殊处理搜索视图，与已删除文件夹
         $.each(data, function (i, n) {
             if (n["text"] && n["text"] == "删除") {
                 data[i] = { text: '彻底删除', command: "delete", fid: currentFid};
             }
         });
     }
    var searchFolder =$App.getMailboxView().model.get("searchOptions") ;
    if(currentFid === 2 || (searchFolder && searchFolder.fid === 2)) {//特殊处理草稿箱
         $.each(data, function (i, n) {
             if (n["text"] && n["text"] === "移动到") {
                 data.splice(i,1);
             }
         });
     };
     
    return data;
 },

 //获取会话邮件列表右键菜单 isSingle，是否单封邮件
 getSessionMailMenu: function (fid, isSingle) {
     var data = [];
     if (isSingle) { //单封邮件
         data = [
             { text: '删除', command: "move", args: { fid: 4 }, bh: "context_delete" },
         //  { text: '举报', command: "spam", bh: "context_spam" },
         //  { isLine: true },
             { text: '标记为', items: this.mailboxModel.getMarkMenuItems() , bh2: "context_mark"},
         //  { text: '标签', items: this.mailboxModel.getTagMenuItems(), bh2: "context_tag" },
             { text: '移动到', items: this.getMoveItem(), bh2: "context_move" }
         ];
     } else { //多封
         data = [
             { text: '删除', command: "move", args: { fid: 4 }, bh: "context_delete" },
          //   { text: '举报', command: "spam", bh: "context_spam" },
          //   { isLine: true },
             { text: '标记为', items: this.mailboxModel.getMarkMenuItems(), bh2: "context_mark" },
             { text: '移动到', items: this.getMoveItem(), bh2: "context_move" }
         ];
     }
     //不显示举报入口
     /*
     if(!top.mailboxComplaintView.model.isShowComplaintBtn()){
        $.each(data, function (i, n) {
            if (n["command"] && n["command"] == "spam") {
                data.splice(i,1);
                return false;
            }
        });
     }*/

    return data;
 },

 getMoveItem:function(){
     var arr = this.mailboxModel.getFolderMenuItems("system");
     var customItems = this.mailboxModel.getFolderMenuItems("custom", { showCreate: true });
     if (customItems.length > 0) {
         arr.push({ isLine: true });
     }
     arr = arr.concat(customItems);
     /*var popItems = this.mailboxModel.getFolderMenuItems("pop");
     if (popItems.length > 0) {
         arr.push({ isLine: true });
     }
     arr = arr.concat(popItems);*/
     return arr;

 },
 readMail: function (mid,callback) {
     var data = {
         fid: 0,
         mid: mid,
         autoName: 1,                           //有些附件会没有文件名，此属性自动命名附件
         markRead: 0,                           //是否标记为已读   1：已读，0：不作操作保持原状
         returnHeaders:{Sender:"","X-RICHINFO":""},//为订阅平台增加参数
         filterStylesheets: 0,
         filterImages: 0,
         filterLinks: 0,
         keepWellFormed: 0,
         header:1,
         supportTNEF: 1,
         returnAntispamInfo: 1
     };
     $RM.readMail(data, function (result) {
         callback(result["var"]);
     });
 }

})
});
