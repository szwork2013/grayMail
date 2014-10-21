
(function ($, _, M) {

var superClass = M.Model.ModelBase;
var _class = "M2012.Addr.Model.Import.Common";

function getDelay() {
    return Math.floor(Math.random() * 4500) + 1500;
}

/**
* 导入公共模型
*/
M.namespace(_class, M.Model.ModelBase.extend({

    name: _class,
    timer: false,

    initialize: function() {
        return superClass.prototype.initialize.apply(this, arguments);
    },

    eventHandler : function(result, options) {
        function onload() {
            options.success.call(options, { batchid: options.batchid });
            top.$App.off("contactLoad", onload);
        }

        function onerror() {
            if (_.isFunction(options.error)) {
                options.error.call(options, result);
            }
        }

        var _this = this;
        var batchOperId = options.batchid;
        _this.logger.debug("querystatus", result);

        if (result.status !== 200) {
            onerror();
            return;
        }

        var responseData = result.responseData;

        if (responseData.ResultCode == "0") {
            //0:完成1:处理中2:失败 3:超时失效 5 批次不存在 32769 处理中
            var status = responseData["LoadStatus"];
            var isCancel = false;

            if (_.isFunction(options.process)) {
                isCancel = options.process.call(options, status, responseData, batchOperId);
            }

            if (isCancel) {
                window.clearTimeout(_this.timer);
                return;
            }

            if (status === "0") {
                window.clearTimeout(_this.timer);

                top.$App.on("contactLoad", function () {
                    //重新点击导入按键时，原window已被删除，此时window对象应做判断，防止出现undefined
                    if (window) {
                        setTimeout(function () {
                            onload();
                        }, 2000);
                    }
                });
                top.$App.trigger("change:contact_maindata");
                
            } else if (status === "1" || status === "32769") {
                //使用setTimeout是为了做到第一个请求回来后，才延时下一个请求，而且每次请求的间隔都是随机的
                _this.timer = window.setTimeout(function() {
                    _this.getStatus({ batchid: options.batchid, callback: function(result) {
                        _this.eventHandler(result, options);
                    }});
                }, getDelay());

            } else {
                onerror();
            }
        } else {
            onerror();
        }
    },

    queryStatus: function(options) {
        var _this = this;
        _this.getStatus({batchid: options.batchid, callback: function(result) {
            _this.eventHandler(result, options);
        }});
    },


    getStatus: function(options) {
        var api = "/addrsvr/GetBatchOperStatus";
        var params = {
            sid: top.sid,
            formattype: "json",
            rnd: Math.random()
        };

        var url = top.$Url.makeUrl(api, params);
        var data = {
            GetBatchOperStatus: {
                BatchOperId: options.batchid
            }
        };

        top.M2012.Contacts.API.call(url, data, function(result){
             options.callback(result);
        });
    }

}));

})(jQuery, _, M139);

﻿if (ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].input;
    var PageMsg2 = ADDR_I18N[ADDR_I18N.LocalName].clone;
}

var maxLimit = top.Contacts.MAX_CONTACT_LIMTE;
if ($.isFunction(top.Contacts.getMaxContactLimit)) {
    maxLimit = top.Contacts.getMaxContactLimit();
}

var tipMaxLimit = maxLimit;
if (maxLimit == 3000 && top.Contacts.data.TotalRecord > maxLimit) {
    tipMaxLimit = 4000;
}

var FORM_SUBMITTING = false;

/**
 * 基础model对象，提供常用的公用方法
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.Model.ModelBase;
    var _baseModelClass = "M2012.Addr.Model.Import.File.Base";

    M.namespace(_baseModelClass, M.Model.ModelBase.extend({

        name : _baseModelClass,

        defaults : {

        },

        initialize : function() {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        getSid : function() {
            return (top.$App ? top.$App.getSid() : top.sid );
        },

        getHost : function() {
            var addrhost = "";
            var addrDomain = window.top.addrDomain;
            if (addrDomain.indexOf(location.protocol) > -1) {
                addrhost = addrDomain;
            } else {
                addrhost = M139.HttpRouter.getNoProxyUrl("/addrsvr");
                if (addrhost.indexOf(location.protocol) < 0) {
                    addrhost = top.location.protocol + "//" + top.location.host + addrhost;
                }
            }
            return addrhost;
        },

        getDelay : function() {
            //1.5-10秒随机
            return Math.floor(Math.random() * 4500) + 1500;
        },

        doRequest : function(args) {
            var urlParams = {
                sid : this.getSid(),
                formattype : "json",
                rnd : Math.random()
            };
            var requestUrl = top.$Url.makeUrl(this.getHost() + "/" + args.api, urlParams);

            var requestData = args.data;

            var onresponse = function(e) {
                if ($.isFunction(args.onresponse)) {
                    e = e || {};

                    if (e.responseData) {
                        e = e.responseData;
                    }

                    args.onresponse(e);
                }
            };

            if (top.M2012) {
                top.M2012.Contacts.API.call(requestUrl, requestData, onresponse);
            } else {
                top.doAPIrequest({
                    url : requestUrl,
                    request : requestData,
                    successHandler : onresponse,
                    error : onresponse
                });
            }
        },

        error : function(code) {
            var FF = top.FloatingFrame;
            var ER_PARAM_INVALID = "32770";
            var ER_FILE_INVALID = "32771";
            var ER_SESSION_NOTFOUND = "216";

            if (code === ER_PARAM_INVALID || code === ER_FILE_INVALID) {
                FF.alert(PageMsg2['iptIFailMes']);
                if (window.ImportAction) {
                    window.ImportAction.resetForm();
                }
                // $("#btnInputFile").removeClass('btnDisabled');
                return;
            }

            if (code === ER_SESSION_NOTFOUND) {
                if (top.$App) {
                    top.$App.showSessionOutDialog();
                } else {
                    top.Utils.showTimeoutDialog();
                }
                return;
            }

            FF.alert(PageMsg2['iptIFailMes']);
            if (window.ImportAction) {
                window.ImportAction.resetForm();
            }
            // $("#btnInputFile").removeClass('btnDisabled');
            window.console && console.log('导入失败', code);
        },

        fetch : function(options) {
            var _this = this;
        }
    }));

    /**
     * 导入本地文件联系人
     */
    var _importActionClass = "M2012.Addr.Model.Import.File.ImportAction";
    M.namespace(_importActionClass, M.Model.ModelBase.extend({
        name : _importActionClass,
        defaults : {
            "BatchOperId" : null,
            "ResultCode" : null,
            "ResultMsg" : null
        },

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);

            this._baseModel = new M2012.Addr.Model.Import.File.Base();
            this._commonModel = new M2012.Addr.Model.Import.Common();

            this.set("cancelImport", false);
            FORM_SUBMITTING = false;
        },

        /**
         * 查询导入任务状态
         */
        queryImportTask : function() {
            var model = this;
            var batchOperId = model.get("BatchOperId");
            var sid = model._baseModel.getSid();
            model._commonModel.queryStatus({
                batchid : batchOperId,
                process : function(args) {
                    if (model.get("cancelImport")) {
                        top.WaitPannel.hide();
                        FORM_SUBMITTING = false;
                        return false;
                    }

                    var toConfirm = (args == "10008");
                    if (toConfirm) {
                        var isCancel = model.askContinue();
                        return true;
                    } else {
                        return false;
                    }
                },
                success : function() {
                    top.BH("addr_import_formatfile");
                    top.WaitPannel.hide();
                    model.resetForm();
                    FORM_SUBMITTING = false;

                    if (model.get("cancelImport")) {
                        return;
                    }

                    //导入成功页跳转
                    var urlParams = {
                        sid : sid,
                        bid : batchOperId,
                        from : "importFile"
                    };
                    var api = "http://" + top.location.host + "/m2012/html/addr/addr_importresult.html";
                    var resultPageUrl = top.$Url.makeUrl(api, urlParams);
                    window.location.href = resultPageUrl;
                },
                error : function(args) {
                    top.WaitPannel.hide();
                    FORM_SUBMITTING = false;
                    if (model.get("cancelImport")) {
                        return;
                    }

                    if (args.responseData.ResultCode == "0") {
                        model._baseModel.error(args.responseData.LoadStatus);
                    } else {
                        model._baseModel.error(args.responseData.ResultCode);
                    }
                }
            });
        },

        resetForm : function() {
            $("#importFileContactsForm")[0].reset();
            $("#newImportGroup").hide();
        },

        /**
         * 询问用户是否继续导入
         */
        askContinue : function() {
            var model = this;
            var batchOperId = model.get("BatchOperId");

            var FF = top.FloatingFrame;
            FF.confirm(PageMsg["warn_notenough"].format(tipMaxLimit), function() {
                top.WaitPannel.show(PageMsg['info_importing']);

                var requestData = {
                    SetBatchContFlg : {
                        BatchOperId : batchOperId,
                        IsContinue : true
                    }
                };

                model._baseModel.doRequest({
                    api : "SetBatchContFlg",
                    data : requestData,
                    onresponse : function(result) {
                        if (result.ResultCode == undefined) {
                            return;
                        }

                        if (result.ResultCode == "800") {
                            if (model.timer) {
                                clearTimeout(model.timer);
                            }
                            FF.alert(PageMsg["error_timeout"]);
                            model.resetForm();
                            FORM_SUBMITTING = false;
                            top.WaitPannel.hide();
                            // $("#btnInputFile").removeClass('btnDisabled');
                            return;
                        }

                        model._commonModel.timer = window.setTimeout(function() {
                            model.queryImportTask();
                        }, model._baseModel.getDelay());
                    }
                });
            }, function() {
                model.resetForm();
                FORM_SUBMITTING = false;
                top.WaitPannel.hide();
            }, 1);
        }
    }));
})(jQuery, _, M139);

window.onFileContactsImported = function(result) {
    if (result.ResultCode === "0") {
        // TODO setTimeout?
        window.ImportAction = new M2012.Addr.Model.Import.File.ImportAction();
        var importAction = window.ImportAction;
        importAction.set("BatchOperId", result.BatchOperId);
        importAction.set("ResultCode", result.ResultCode);
        importAction.set("ResultMsg", result.ResultMsg);
        importAction.queryImportTask();
        return;
    }

    top.WaitPannel.hide();
    var baseClass = new M2012.Addr.Model.Import.File.Base();
    baseClass.error(result.ResultCode);
    FORM_SUBMITTING = false;
};


/**
 * 导出联系人到本地文件向导
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.ExportGuide";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#exportFileExplanation",

        initialize : function() {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        events : {
            "click li" : "clickNav",
            "click #btnDownloadTemplate" : "dowmloadTemplateFile"
        },

        /**
         * 切换向导tab页签
         * @param {Object} ev
         */
        clickNav : function(ev) {
            var $target = $(ev.target);
            $target.closest("ul").find("li").removeClass("on");
            $target.closest("li").addClass("on");

            $("div.export-guide-detail").addClass("force-hide");
            var showId = $target.closest("li").attr("id").substring(1);
            $("#" + showId).removeClass("force-hide");
        },

        /**
         * 下载模板文件
         */
        dowmloadTemplateFile : function() {
            window.open(top.getDomain("webmail") + "/addr/matrix/input/txl-address.csv");
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.ExportGuide();
    });

})(jQuery, _, M139);

/**
 * 页面跳转
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.AppNav";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "body",

        initialize : function() {
            return superClass.prototype.initialize.apply(this, arguments);
        },

        events : {
            "click .to-addr-home" : "toAddrHome"
        },

        /**
         * 返回到通讯录首页
         * @param {Object} ev
         */
        toAddrHome : function(ev) {
            var view = this;
            if (FORM_SUBMITTING) {
                var msg = PageMsg2['warn_whencancel'];
                // var msg = 'testmsg';
                top.$Msg.confirm(msg, function() {
                    view.backToAddrHone();
                }, null, null, {
                    isHtml : true
                });
            } else {
                view.backToAddrHone();
            }

            top.BH('addr_importFile_cancel');
            return false;
        },

        backToAddrHone : function() {
            if (window.ImportAction) {
                window.ImportAction.set("cancelImport", true);
            }

            //返回
            setTimeout(function() {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
        },

        toImportFileHome : function(ev) {
            setTimeout(function() {
                window.location.assign("addr_import_file.html?sid=" + top.$App.getSid());
            }, 0xff);
            return false;
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.AppNav();
    });

})(jQuery, _, M139);

/**
 * 导入本地文件表单
 * @param {Object} $
 * @param {Object} _
 * @param {Object} M
 */
(function($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.File.ImportForm";

    M.namespace(_class, M.View.ViewBase.extend({

        name : _class,

        el : "#importFileContactsForm",

        logger : new M139.Logger({ name: _class }),

        initialize : function() {
            superClass.prototype.initialize.apply(this, arguments);
            this.renderGroups();
        },

        events : {
            "change #selectImportGroup" : "changeImportGroup",
            "click #submitContacts" : "importContacts",
            "click #newImportGroup" : "inputNewGroupName",
            "click #File1": "fileChange",
            "click input[name='groupBy']": "groupBy",
            "click input[name='repeat']": 'repeatType'
        },

        /**
         * 初始化组列表
         */
        renderGroups : function() {
            var selGroup, item;

            selGroup = document.getElementById("selectImportGroup");
            selGroup.options.length = 0;
            item = new Option("所有联系人", "1");
            selGroup.options.add(item);

            // 判断租的数量是否超过上限
            if (this.isGroupAddable()) {
                item = new Option("新建组...", "2");
                selGroup.options.add(item);
            }

            // 添加现有组
            var groups = top.Contacts.data.groups;
            if (groups) {
                item = $.map(groups, function(i) {
                    return new Option(i.GroupName, i.GroupId);
                });

                $.each(item, function(n, i) {
                    selGroup.options.add(i);
                });
            }

            selGroup.selectedIndex = 0;
        },

        /**
         * 改变导入组名
         * @param {Object} ev
         */
        changeImportGroup : function(ev) {
            var $el = $(ev.target);
            if (this.isCreateNewGroup()) {
                $("#newImportGroup").show().focus();
                top.BH('addr_importFile_newGroup');
            } else {
                $("#newImportGroup").hide();
            }
            $("input[name=groupBy]").eq(1).prop("checked", true);
        },

        inputNewGroupName : function() {
            $("input[name=groupBy]").eq(1).prop("checked", true);
        },
        fileChange: function(){
            this.hideTip();
            top.BH('addr_importFile_selectFile');
        },
        groupBy: function(ev){
            if($(ev.target).val() == "0"){
                top.BH('addr_importFile_reserveGroup');
            }else{
                top.BH('addr_importFile_assignGroup');
            }
        },
        repeatType: function(ev){            
           if($(ev.target).val() == "1"){
                top.BH('addr_importFile_skip');
            }else{
                top.BH('addr_importFile_replace');
            } 
        },

        /**
         * 提交“导入”本地文件
         * @param {Object} ev
         */
        importContacts : function(ev) {
            this.logger.debug("import file contacts submitted");

            if (FORM_SUBMITTING) {
                return;
            }

            if (!this.validateForm()) {
                return false;
            }

            top.WaitPannel.show(PageMsg['info_importing']);

            var repeatType = $("input[name=repeat]:checked").val();
            var groupBy = $("input[name=groupBy]:checked").val();
            var $selectGroup = $('#selectImportGroup');
            var groupName = null;
            var groupType = null;

            // 指定分组
            if (groupBy == 1) {
                //保留原分组
                var Original = 0;
                //不处理分组
                var Ignore = 1;
                //归入新分组
                var NewGroup = 2;
                //指定现有组
                var Specify = 3;

                if (this.isCreateNewGroup()) {// 创建新组
                    groupType = NewGroup;
                    groupName = $("#newImportGroup").val();
                } else if (this.isSelectAllContacts()) {// 所有联系人
                    groupType = Ignore;
                } else {// 指定组
                    groupType = Specify;
                    // groupName = $("#selectImportGroup").val();
                    groupName = $("#selectImportGroup").find("option:selected").text();
                }
            } else {
                groupType = Original;
            }

            var baseModel = new M2012.Addr.Model.Import.File.Base();
            var addrhost = baseModel.getHost();
            var sid = baseModel.getSid();
            var urlParams = {
                complete : "parent.onFileContactsImported",
                sid : sid,
                rnd : Math.random()
            };
            var action = top.$Url.makeUrl(addrhost + "/AddFileContacts", urlParams);

            var form = this.el;

            if (null != groupName) {
                form.GroupName.value = groupName;
            }
            form.GroupType.value = groupType;
            form.repeat.value = repeatType;
            form.action = action;

            form.submit();
            FORM_SUBMITTING = true;

            top.BH('addr_importFile_import');
        },

        validateForm : function() {
            var Contacts = top.Contacts;
            var FF = top.FloatingFrame;
            //判断联系人的总数是否达到上限 getMaxContactLimit 联系人上限人数2012.06.25
            if (Contacts.getContactsCount() >= tipMaxLimit) {
                if (tipMaxLimit == 3000) {
                    FF.alert(PageMsg['error_overlimit'].format(tipMaxLimit));
                }
                else {
                    FF.alert("联系人数量已达上限{0}".format(tipMaxLimit));
                }
                return false;
            }

            // 判断文件是否存在
            var fileValue = document.getElementById("File1").value;
            if (fileValue.length == 0) {
                this.showTip(PageMsg['warn_nofile'], $('#File1'));
                return false;
            }

            // 判断文件后缀名是否为vcf或者csv
            var ext = fileValue.match(/\.(.+)/i)[1] || "";
            ext = ext.toLowerCase();
            if (!/(vcf)|(csv)/.test(ext)) {
                FF.alert(PageMsg['warn_unknownType']);
                return false;
            }

            // 新建组时，判断新建组名是否存在
            var newGroup = $("#selGroup").val() == "2";
            var newImportGroup = $("#newImportGroup").val();
            if (this.isCreateNewGroup() && newImportGroup == "") {
                FF.alert(PageMsg['warn_nogroupname'], function() {
                    $("#newImportGroup").focus();
                });
                return false;
            }

            return true;
        },

        isCreateNewGroup : function() {
            return this.isGroupAddable() && $('#selectImportGroup')[0].selectedIndex == 1;
        },

        isSelectAllContacts : function() {
            return $('#selectImportGroup')[0].selectedIndex == 0;
        },

        isGroupAddable : function() {
            var groups = top.Contacts.data.groups;
            var groupsNum = 0;
            if (groups) {
                groupsNum = groups.length;
            }
            var groupsNumLimit = 50;
            return groupsNum < groupsNumLimit;
        },
        showTip: function(text, dom){
            var height = 28;
            var offset = dom.offset();
            var sTop = offset.top - height;

            $('#tipContent').text(text);
            $('#tipWrap').show().css({left: offset.left, top: sTop});
        },
        hideTip: function(){
            $('#tipWrap').hide();
        }
    }));

    $(function() {
        new M2012.Addr.View.Import.File.ImportForm();
    });

})(jQuery, _, M139);

