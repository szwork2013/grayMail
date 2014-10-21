/**
* @fileOverview 定义RichMail的Http客户端类.
*/

(function (M139) {

    /**与RM有关的类库命名空间
    *@namespace
    *@name M139.RichMail
    */
    M139.core.namespace("M139.RichMail");
    M139.RichMail.RichMailHttpClient = M139.ExchangeHttpClient.extend(
    /**
    *@lends M139.RichMail.RichMailHttpClient.prototype
    */
{
    /** 与RM系统通讯的http客户端类，调用接口有两种方式，一种是提供报文，调用request，一种是以注册的形式添加方法
    *@constructs M139.RichMail.RichMailHttpClient
    *@extends M139.ExchangeHttpClient
    *@param {Object} options 初始化配置，参数继承M139.HttpClient的初始化参数
    *@example
    var rmClient = new M139.RichMail.RichMailHttpClient(
    {
    name:"RichMailHttpClient",
    router:"appsvr"
    }
    );
    */
    initialize: function (options) {
        M139.ExchangeHttpClient.prototype.initialize.apply(this, arguments);
        this.router = M139.HttpRouter;

        var _options = options || {};
        var onrouter = _options.onrouter || $.noop;

        onrouter.call(this, this.router);

        this.router.addRouter("appsvr", [
            "user:getInitData",
            "user:getInitDataConfig",
            "mbox:getAllFolders",
            "mbox:listMessages",
            //"mbox:searchMessages",
            "global:sequential",
            "mbox:setUserFlag",
            "mbox:getSearchResult",
            //"mbox:moveMessages",
            //"mbox:deleteMessages",
            "mbox:deleteFolders",
            //"mbox:updateMessagesStatus",
            "mbox:updateMessagesLabel",
            "mbox:updateMessagesAll",
            "mbox:setFolderPass",
            "mbox:updateFolders",
            
            "mbox:setSessionMode",
            "user:getWhiteBlackList",
            "user:setWhiteBlackList",
            "user:getSignatures",
            "user:signatures",
            "user:setFilter_New",
            "user:getFilter_New",
            "user:setFilter",
            "user:getFilter",
            "user:filterHistoryMail",
        //    "attach:listAttachments",
            "user:statMessages",
            "mbox:updateBillType"
        ]);
		this.router.addRouter("appsvr2", [
            "attach:listAttachments",
			"mbox:queryContactMessages",
			"attach:queryContactAttachments"
        ]);//add by zhangsx
        this.router.addRouter("webapp", [
                "mbox:moveMessages",
                "mbox:deleteMessages",
                "mbox:updateMessagesStatus",
                "mbox:readMessage",
                "mbox:readMessage&comefrom=5",
                "mbox:updateFolders2",
                "mbox:getMessageInfo",
                "mbox:readSessionMessage",
                "mbox:readSessionMessage&comefrom=5",
                "mbox:replyMessage",
                "mbox:forwardAttachs",
                "mbox:forwardMessage",
                "mbox:searchMessages",
                "mbox:sendMDN",
                "mbox:sendMDN&comefrom=5&categroyId=103000000",
                "mbox:mailFile",
                "mbox:mailClean",
                "user:setPOPAccount",
                "user:getPOPAccounts",
                "user:syncPOPAccount","user:syncPOPAccountAll",
                "mbox:mailMemo",
                "mbox:getDeliverStatus",
		        "mbox:compose",
                "mbox:compose&comefrom=5&categroyId=103000000",
                "mbox:compose&comefrom=5&categroyId=102000000",
                "mbox:compose&comefrom=5&categroyId=103000005",
                "mbox:compose&comefrom=5&categroyId=102000015",
                "mbox:compose&comefrom=5&categroyId=103000010",
                "mbox:compose&comefrom=5",
                "mbox:getComposeId",
                "upload:deleteTasks",
                "attach:refresh",
                "mbox:forwardMessages",
                "mbox:restoreDraft",
                "mbox:editMessage",
                "mbox:reportSpamMails",
                "mbox:recallMessage",
                "mbox:packMessages",
                "user:moveHOMail",
                "mbox:checkDomain",
                "user:setFilter_139",
                "user:getFilter_139",
                "user:filterHistoryMail139",
                "user:forwardVerify",
                "user:sortFilter_139",
                "user:getAttrs",
                "user:setAttrs",
                "global:sequential2",
                "mbox:setTaskMessages",
				"attach:listAttachments",
				"mbox:queryContactMessages",
				"attach:queryContactAttachments"
        ]);

        //todo add mw httpclient

        this.router.addRouter("setting", [         
            "user:getOnlineFriends",

            "user:getMainData", "user:setUserConfigInfo", "user:getInfoCenter","user:taskCount","user:getMyTask","user:taskAward",'user:taskWorshipEnvy','user:taskStar','user:taskBadge', "user:getMedals",
            "poperations:signInit","poperations:queryphiz","poperations:publishedsign","poperations:querysign","poperations:invitefriends","poperations:checkinviteadd",
            "user:getPersonal", "user:setMyApp", "user:sendPasswordAction", "user:updatePasswordAction", "user:checkAliasAction", "user:updateAliasAction",
            "meal:getMealInfo", "meal:setMealInfo", "mailUpdate:getMailUpdateInfo", "mailUpdate:setMailUpdateInfo",
            "mailPatter:setMailPatterInfo", "mailPatter:getMailPatterInfo", "mailPatter:getSMSCode", "user:setAddMeRule", "user:bindFeixinAction",
            "user:getLoginNotify", "user:setLoginNotify",
            "user:getMailNotify", "user:updateMailNotify", "user:addMailNotifyExcp", "user:modifyMailNotifyExcp", "user:delMailNotifyExcp",
            "user:mailToMe",
            "user:sendPasswordAction",
            "user:checkPhoneAction",
            "user:bindPhoneAction",
            "bill:setszjtBill",
            "user:loginHistory",
            "user:mailDeleteHistory",
            "user:popAgentHistory",
            "user:passwordModifyHistory",
            "user:SetDefaultAccount",
            "user:setDefaultSendAccount",
            "unified:getUnifiedPositionContent",
            "user:checkPassword","user:getQuestion","user:setPasswordProtect",
            "earthhour:earthHourInit",
            "earthhour:setStatus",
            "earthhour:getStencil",
            "earthhour:inviteFriends",
            "umc:getArtifact",
            "umc:mailCallUMC",
            "umc:updatePassport",

            "user:cancelMailboxAction",
            "info:getInfoSet",
            "addr:getVCard",
            "umc:rdirectCall",
            "umc:rdirectTo",
            "guide:getUserinfo",
            "guide:setUserinfo",
            "guide:setUserpic",
            "bill:getTypeList",
            "bill:openTrafficBill",
            "bill:clossTrafficBill",
            "bill:openBill",
            "bill:closeBill",
			"bill:batterypitcherBill",
			"bill:getBatterypitcherBill",
            "setting:examineShowStatus",
            "setting:examineUserStatus",
			"user:getImageCode",
            "setting:examinePwdStatus",
			"disk:getDiskAttConf",  //超大附件是否自动存网盘
			"disk:updateDiskAttConf",
			"healthy:getHealthyInfo",
            "healthy:setTrustAutoLogin",
            "healthy:setTrustForward",
            "healthy:oneClickUpdate",
            "healthy:getOneClickUpdateInfo",
            "healthy:getHealthyHistory",
            "healthy:updateLastTipsTime",
            "user:getCapModHist",
            "msg:getRemindMsg",
            "msg:delRemindMsg"
        ]);

        this.router.addRouter('together', ["user:getExDataSync", "user:getFetionC", "weibo:userinfo"
        ]);

        //todo add addr httpclient
        this.router.addRouter("addr", [
            "GetUserAddrJsonData",
            "QueryUserInfo", "ModUserInfo", "AddUserInfo", "DelContacts",
            "WhoAddMeByPage", "OneKeyAddWAM", "WhoWantAddMe", "AgreeOrRefuseAll","WMAGroupList","ModDealStatus",
            "GetUpdatedContactsNum","GetUpdatedContactsDetailInfo","QuerySaveAllUpdatedResult","SaveIncrementalUpdatedInfo","SaveAllUpdatedInfo","AddImageReport","NoPromptUpdate","SkipCurrent",
            "QueryContactsAndGroup",
            "ModContactsField","MergeContacts",
            "DelGroup","AddGroupList","DelGroupList","GetAudienceEmailList",
            "GetBatchOperHistoryRecord", "GetBatchOperStatus", "AutoMergeContacts",
            "QueryMergeResult",
            "GetColorCloudInfo",
            "GetFinshImportResult", "GetFinshImportList", "GetRemindBirdays", "SetRemindBirdays"
        ]);

        this.router.addRouter('weather', [
            "weather:getDefaultWeather", "weather:getArea", "weather:getWeather",
            "weather:setWeather"
        ]);

        this.router.addRouter('positioncontent', [
            "positioncontent:ad"
        ]);

        this.router.addRouter('card', [
            "card:birthdayRemind"
        ]);

        this.router.addRouter('mms', [
            "mms:mmsInitData"
        ]);

        this.router.addRouter('sms', [
            "sms:getSmsMainData",
            "sms:smsNotifyInit"
        ]);
        this.router.addRouter('ServiceAPI', [
            "RMSecretFolder"
        ]);

        this.router.addRouter('search', [
            "mbox:searchMessages",
            "mail:askAddFriendToMayKnow",
            "mail:systemCutMessage",
            "mail:askShareContact",
            "mail:shareContact"
        ]);

        this.router.addRouter('bill', [
            //"bill:getTypeList",
            "bill:setBill"
        ]);

        this.router.addRouter('disk', [
            "disk:fSharingInitData",
            "disk:getFile",
            "disk:getFiles",
            "disk:setFiles",
            "disk:getdiskallinfo",
            "disk:getdirfiles",
            "disk:renameFiles",
            "disk:renameDiskFile",
            "disk:renameDirectory",
            "disk:renameDiskAlbum",
            "disk:renameDiskMusicClass",
            "disk:saveAttach",
           // "disk:search",
            "disk:mailFileSend",
            //"disk:download",
            "disk:flashplay",
            "disk:shareCopyTo"
        ]);
        
		// add by tkh 文件快递彩云新接口
        this.router.addRouter('file', [
        	"file:fSharingInitData",
            "file:getFiles",
            "file:setFiles",
            "file:delFiles",
            "file:preDownload",
            "file:continueFiles",
            "file:renameFiles",
            "file:fastUpload",
			"file:resumeUpload",
            "file:breakPFile",
            "file:turnFile",
			"file:toDiskForCenter",
            "file:mailFileSend",
            "disk:delete",
            "disk:rename",
            "disk:getthumbnailimage",
            "disk:thumbnail",
            "disk:addDirectory",
            "disk:turnFile",
            "disk:move",
            "disk:init",
            "disk:createDirectory",
            "disk:getDirectorys",
            "disk:fileList",
			"disk:fileListPage",//分页取数据
            "disk:search", // 新旧版本彩云的搜索接口名称一样
            "disk:download",
            "disk:fastUpload",
            "disk:breakPFile",
            "disk:resumeUpload",
            "disk:normalUpload",
            "disk:setCover",
            "disk:resumeUpload",
            "disk:delDiskDirsAndFiles",
            "disk:shareCopyTo",
			"disk:copyContentCatalog",
            "disk:attachUpload",    //附件存彩云
            "disk:thumbnails", //获取缩略图
            "disk:getDiskAlbumList",
            "disk:getOutLinkList",
            "disk:delOutLink",
            "disk:getOutLink",
            "disk:backupMail", //邮件备份网盘
			"disk:index",
			"disk:isShareSiChuan",
			"file:downLoadInitNew",
			"file:fileBatDownload",
		    "disk:getContentInfosByType",
		    "disk:shareDetail",
            "disk:friendShareList",
            "disk:myShareList",
            "disk:deleteShare",
            "disk:delShare",
            "disk:cancelShare",
            "disk:share",
            "disk:getVirDirInfo",
            "disk:mgtVirDirInfo"
        ]);
        
        this.router.addRouter('billcharge', [
           "mailoffice:getTipsinfo"
        ]);

        this.router.addRouter('note', [
           "mnote:createNote",    //创建一条笔记
           "mnote:getNote",       //获取一条笔记
           "mnote:getNotes",      //获取所有笔记
           "mnote:deleteNote",    //删除笔记
           "mnote:updateNote",    //更新笔记
           "mnote:searchNote",    //搜索笔记
           "mnote:mailsToNote",   //邮件批量存笔记
           "mnote:uploadNote",    //获取附件上传地址
           "mnote:downloadNote",  //获取附件下载地址
           "mnote:thumbnailNote", //获取缩略图地址
           "mnote:nothing"        //ending
        ]);
		
		this.router.addRouter('evernote', [
            "evernote:createbyMnoteId",
            "evernote:oauth",
            "evernote:createOrReplace",
            "evernote:createNote"
        ]);
        
        this.router.addRouter('uec', [
           "uec:list",
           "uec:status",
           "uec:addFeedback"
        ]);
        this.router.addRouter('middleware',[
         // "user:getOnlineFriends"
        ]);

       this.router.addRouter('calendar',[
          "calendar:addLabel",
          "calendar:updateLabel",
          "calendar:deleteLabel",
          "calendar:shareLabel",
          "calendar:deleteLabelShare",
          "calendar:acceptShareLabel",
          "calendar:getUsersOfSharedLabel",
          "calendar:getLabelById",
          "calendar:getLabels",
          "calendar:initCalendar",
          "calendar:addCalendar",
          "calendar:updateCalendar",
          "calendar:delCalendar",
          "calendar:cancelInvitedInfo",
          "calendar:inviteSomeone",
          "calendar:updateInviteStatus",
          "calendar:shareCalendar",
          "calendar:getCalendarView",
          "calendar:getCalendarListView",
          "calendar:getCalendar",
          "calendar:getCalendarCount",
          "calendar:getMessageCount",
          "calendar:activeSyncCalendarList",
          "calendar:getNormalUploadUrl",
          "calendar:getDownloadUrl",
          "calendar:uploadFile",
          "calendar:activeSyncCalendarList",
          "calendar:uploadFile",
          "calendar:addMailCalendar",
          "calendar:updateMailCalendar",
          "calendar:getMailCalendar",
          "calendar:delMailCalendar",
          "calendar:getMessages",
          "calendar:updateBabyInfo",
          "calendar:getBabyInfo",
          "calendar:getLabelShareMessage",
          "calendar:getCalendarInviteMessage",
          "calendar:getCalendarShareMessage",
          "calendar:processShareLabelInfo",
          "calendar:delShareMsg",
          "calendar:acceptCalendarShare",
          "calendar:addBlackWhiteItem",
          "calendar:deBlackWhiteItem",
          "calendar:delBlackWhiteItem",
          "calendar:getBlackWhiteItem",
          "calendar:getBlackWhiteList",
          "calendar:getMessageCount",
          "calendar:getMessageList",
          "calendar:getMessageById",
          "calendar:delMessage",
          "calendar:setLabelUpdateNotify",
          "calendar:setCalendarRemind",
          "calendar:synCaiYun",
		  "calendar:addBirthdayCalendar",
          "calendar:getUserAddrJsonData",
          "calendar:cancelSubscribeLabel",
          "calendar:subscribeLabel",
          "calendar:searchPublicLabel",
          "calendar:setSubLabelUpdateNotify",
          "calendar:listTopLabels",
          "calendar:batchAddCalendar",
          "calendar:getCalendarList", // 获取日历下的所有活动,新增接口
          "calendar:getAllLabelTypes", // 日历广场中获取所有的分类列表
          "calendar:getLabelsByType", // 根据日历分类ID获取分类下的所有日历
          "calendar:copyCalendar", // 将"订阅日历"下的活动添加(复制)到"我的日历"
          "calendar:getPublishedLabelByOper", // 获取单个已发布的日历
          "calendar:getCalendarsByLabel", // 根据日历ID获取订阅日历下的所有活动
          "calendar:shareCalendar", //日历共享
          "calendar:cancelMailCalendars", //批量取消
          "calendar:getGroupCalendarList", //查询群组日历活动列表信息
          "calendar:addGroupLabel", //批量取消          
          "nothing"
        ]);
        //邮箱营业厅
        this.router.addRouter('businessHall', [
          "businessHall:queryDetailDiscountInfo",
          "businessHall:getUserConsumption",
          "businessHall:queryBillInfo",
          "businessHall:queryProductInfo",
          "businesshall:userStateQuery",
          "businesshall:sendSmsAuthCode",
          "businesshall:productOrder",
          "businesshall:queryBusinessInfo",
		  "together:getFetionFriends",
		  "together:sendMailToFetion"
        ]);
    },

    defaults: {
        name: "M139.RichMail.RichMailHttpClient",
        requestDataType: "ObjectToXML",
        responseDataType: "JSON2Object"
    },

    /**
    *继承自M139.ExchangeHttpClient.request方法， 增加了一些参数功能
    *@see M139.ExchangeHttpClient#request
    *@param {Object} options 配置参数
    *@returns {M139.HttpClient} 返回对象自身
    *@example
    client.request(
    {
    method:"post",
    timeout:10000,
    data:{
    fid:1
    },
    api:"mbox:listMessage",
    headers:{
    "Content-Type":"text/javascript"
    }
    },
    function(e){
    console.log(e.status);//http返回码，200,404等
    console.log(e.isTimeout);//返回是否超时
    console.log(e.responseText);//http返回码，200,404等
    console.log(e.getHeaders());//返回的http头集合，使用函数因为默认处理http头会消耗性能
    }
    );
    */
    request: function (options, callback) {
        var This = this;
        //请求父类的方法
        return M139.ExchangeHttpClient.prototype.request.apply(this, arguments);
    },
    /**@inner*/
    onResponse: function (info) {
        var This = this;
        return M139.ExchangeHttpClient.prototype.onResponse.apply(this, arguments);
    }
});
    /**
    *实例化RichMailHttpClient，然后封装使用的过程，对常用的几个rm接口划分为Level1级别，其它划分为Level2级别
    *@namespace
    *@name M139.RichMail.API
    */
    M139.core.namespace("M139.RichMail.API",
    /**@lends M139.RichMail.API*/
{
    /**
    *读取文件夹列表数据
    *@param {Object} options 请求的参数
    *@param {Number} options.fid
    */
    getFolderList: function (callback) {
        this.call("mbox:getAllFolders", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    /**
    *读取指定文件夹邮件列表
    *@param {Object} options 请求的参数
    *@param {int} options.fid 文件夹ID
    *@param {String} options.order 排序字段，默认值为receiveDate
    *@param {int} options.desc 是否降序排序，默认值为1
    *@param {int} options.pageIndex 第几页 (这里也可以使用start、total字段，但是不推荐)
    *@param {int} options.pageSize 一页取几封邮件
    */
    getMailList: function (options, callback) {
        this.call("mbox:listMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    readMail: function (options, callback) {
        this.call("mbox:readMessage", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },

	/** 获取邮件列表数据
	*   作用：主要是不依赖邮件列表的数据获取
	*/
	getMessageInfo:function(ids,callback){
		var options = {ids:ids};
		this.call("mbox:getMessageInfo", options, function (e) {
	        callback && callback(e.responseData);
	    });
	},

    updateFolders: function (options, callback) {
        this.call("mbox:updateFolders", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    moveMessages: function (options, callback) {
        this.call("mbox:moveMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    deleteFolders: function (options, callback) {
        this.call("mbox:deleteFolders", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    readSessionMail: function (options, callback) {
        this.call("mbox:readSessionMessage", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setFolderPass: function (options, callback) {
        this.call("mbox:setFolderPass", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    getAttrs: function (options, callback) {
        this.call("user:getAttrs", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setAttrs: function (options, callback) {
        this.call("user:setAttrs", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setSessionModel: function (options, callback) {
        this.call("mbox:setSessionModel", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    getWhiteBlackList: function (options, callback) {
        this.call("user:getWhiteBlackList", options, function (e) {
            if (callback) {
                callback(e.responseData);

            }
        });
    },
    setWhiteBlackList: function (options, callback) {
        this.call("user:setWhiteBlackList", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getSignatures: function (callback) {
        this.call("user:getSignatures", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setSignatures: function (options, callback) {
        this.call("user:signatures", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setPOPAccount: function (options, callback) {
        this.call("user:setPOPAccount", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getPOPAccounts: function (options, callback) {
        this.call("user:getPOPAccounts", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    syncPOPAccount: function (options, callback) {
        this.call("user:syncPOPAccount", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    
    setFilter_New: function (options, callback) {
        this.call("user:setFilter_New", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getFilter_New: function (callback) {
		//增加分练规则的开关功能后，需要传递此tmpObj才能返回所有数据
		var tmpObj = {
			filterFlag: 0,
			extContentFlag: 1
		};
        this.call("user:getFilter_New", tmpObj, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    setFilter: function (options, callback) {
        this.call("user:setFilter", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    getFilter: function (callback) {
        this.call("user:getFilter", {}, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    statMessages: function (options, callback) {
        this.call("user:statMessages", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    filterHistoryMail: function (options, callback) {
        this.call("user:filterHistoryMail", options, function (e) {
            if (callback) {
                callback(e.responseData);
            }
        });
    },
    call: function (api, data, callback, options) {
        var onfail = function(){};
        var client = new M139.RichMail.RichMailHttpClient(options||{});
        //扩展，造假数据模拟，彩云网盘官方共享用模拟数据上全网 
        if(options && options.mock){
            var client = M139.API.Mock.call({
                "api": api,
                "data" : data,
                "success": callback,
                "error": function(httpStatus, response) {
                    callback(httpStatus, response);
                }
            });
            return;
        }
        client.on("error", function (err) {
            onfail.call(client, err);
        });

        if (options) {
            if ($.isFunction(options)) {
                onfail = options;
                options = false;
            } else if ($.isFunction(options.error)) {
                onfail = options.error
            }
            if ($.isFunction(options.ontimeout)) {
                client.on("timeout", function (err) {
                    options.ontimeout.call(client, err);
                });
            }
        }

        var url = api.indexOf("/") > -1 ? api : client.router.getUrl(api);
        var method = "post";
        if (options && options.method) {
            method = options.method;
        }
        if(options && options.urlParam){
            url += options.urlParam;
        }
        return client.request({
            url: url,
            method: method,
            data: data,
            async: options && options.async,
            headers: options && options.headers,
            timeout: options && options.timeout,
            isSendClientLog: options && options.isSendClientLog
        }, function (e) {
            if (top.$App && top.$App.onHttpClientResponse) {
                top.$App.onHttpClientResponse(client, e);
            }
            if (callback) {
                callback(e);
            }
        });

    }
});

    $RM = M139.RichMail.API;
})(M139);
