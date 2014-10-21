if (ADDR_I18N) {
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

