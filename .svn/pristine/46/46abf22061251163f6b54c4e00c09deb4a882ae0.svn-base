
(function ($, _, M) {

    var superClass = M.View.ViewBase;
    var _class = "M2012.Addr.View.Import.Clone";
    if (window.ADDR_I18N) {
        var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].clone;
    }

    M.namespace(_class, M.View.ViewBase.extend({

        name: _class,

        el: "#pnlclone",

        TIP: {
            EMAIL: '请输入邮箱帐号',
            PASSWORD: '请输入邮箱密码'
        },

        logger: new M139.Logger({ name: _class }),

        initialize: function () {
            this.model = new M2012.Addr.Model.Import.Clone();
            this.initEvents();
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvents: function () {
            var _this = this;

            _this.on("print", function () {
                _this.logger.debug("printing..."); //启动

                var title = _this.model.defaults.domains;
                var items = [];
                for (var i = 0; i < title.length; i++) {
                    items.push({ text: title[i], value: title[i] });
                }

                _this.logger.debug("init domain list", title);

                var defaultText = items[0].text;
                _this.model.set({ domain: defaultText }, { silent: true });

                var obj = $("#domainlist");
                var dropMenu = M2012.UI.DropMenu.create({
                    "defaultText": defaultText,
                    "menuItems": items,
                    "container": obj,
                    "width": "120px"
                });

                dropMenu.on("change", function (item) {
                    _this.model.set({ domain: item.value }, { silent: true });
                    _this.logger.debug("domain selected", _this.model.get("domain"), item);
                });
            });

            _this.$("#btnClone").click(function (e) {
                if(_this.check()){
                    var frm = document.frmClone;
                    var account = frm.account.value;
                    var pwd = frm.password.value;
                    var repeatmodel = $(frm.repeatmodel).filter(':checked').val();
                    _this.model.set({ status: 'import', account: account, password: pwd, repeatmodel: repeatmodel });
                    top.BH('addr_importClone_clone');
                }
            });

            _this.$('#account,#password').focus(function(){
                $('#tipWrap').hide();
            });

            _this.$("#goBack").click(function(){
                _this.back(_this);
            });

            _this.$("#btnCancel").click(function() { 
                _this.cancel(_this); 
                top.BH('addr_importClone_cancel');
            });

            _this.model.bind("error", function (model, err) {
                if (err) {
                    var msg = PageMsg[err.tipid];
                    if (_.isEmpty(msg)) {
                        msg = PageMsg["fail_other"];
                    }

                    top.$Msg.alert(msg, { onclose: function () {
                        if (err.field) {
                            $("#" + err.field).focus();
                        }
                    }, icon: "warn"
                    });
                    this.logger.debug("has error." + err);
                }
            });

            _this.model.bind("change:batchid", function (model) {
                //导入成功页跳转
                top.BH('addr_importClone_success');                
                window.location.href = ["http://", top.location.host, "/m2012/html/addr/addr_importresult.html?sid=", top.sid, "&bid=", model.get("batchid"), "&from=importClone"].join("");                
            });

            var EVENT = _this.model.EVENTS;
            _this.model.bind(EVENT.FETCH , function () {
                top.M139.UI.TipMessage.show("正在抓取……");
                _this.processing = true;
            });

            _this.model.bind(EVENT.FETCHFAIL , function (err) {
                top.M139.UI.TipMessage.show("抓取失败", { delay: 3000 });
                if (_this.dialog) { _this.dialog.close() }
                if (err && err.tipid)
                    top.$Msg.alert(PageMsg[err.tipid]);
                else
                    top.$Msg.alert("未知错误");
                _this.processing = false;
            });

            _this.model.bind(EVENT.ADD , function () {
                top.M139.UI.TipMessage.show("正在导入……");
            });

            _this.model.bind(EVENT.ADDED , function () {
                top.M139.UI.TipMessage.show("已导入，正在刷新联系人……");
            });

            _this.model.bind(EVENT.ADDFAIL, function (res) {
                top.M139.UI.TipMessage.show("导入失败", { delay: 5000 });
                if (_this.dialog) { _this.dialog.close() }

                var FF = top.FloatingFrame;
                var msg = "导入失败";
                var rs = res.responseData;
                if (rs) {
                    //if (!_.isEmpty(rs.summary)) {
                    //    msg = rs.summary;
                    //}
                    if (rs.code == "ER_OVER_LIMIT") {
                        //msg = rs.summary; 
                        //与导入本地联系人同步 
                        var contactsNumLimit = top.Contacts.getMaxContactLimit();
                        if (contactsNumLimit == 3000) {
                            msg = "联系人数量已达上限3000，<a href='javascript:void(0);' onclick='top.$App.showOrderinfo()' style='color:#0344AE'>升级邮箱</a>添加更多！";
                        }
                        else {
                            msg = "联系人数量已达上限{0}".format(contactsNumLimit);
                        }
                    } else if (rs.code == "ER_NOT_ENOUGH") {
                        msg = rs.summary;
                    } else if (rs.errorCode == "105") { msg = "SID为空"; }
                    else if (rs.errorCode == "106") { msg = "SID失效"; }
                    else if (rs.errorCode == "800") { msg = "参数缺失"; }
                    else if (rs.errorCode == "801") { msg = "用户名密码错误"; }
                    else if (rs.errorCode == "802") { msg = "请求处理中"; }
                    else if (rs.errorCode == "803") { msg = "网络暂时无应答"; }
                    else if (rs.summary && $.trim(rs.summary) != "") { msg = rs.summary; }
                }

                //top.$Msg.alert(msg);
                FF.alert(msg);
                _this.processing = false;
            });

            _this.model.bind(EVENT.RELOAD, function () {
                top.M139.UI.TipMessage.show("导入完成", { delay: 3000 });
                _this.processing = false;
            });

            $(window).on('unload', function() {
                if (_this.dialog) { _this.dialog.close() }
            });

            $(document.frmClone.repeatmodel).click(function(){
                if($(this).val() == "1"){
                    top.BH('addr_importClone_ignore');
                }else{
                    top.BH('addr_importClone_replace');
                }
            });

            top.BH('addr_pageLoad_import');
        },

        check: function(){
            var returnValue = true;         
            var frm = document.frmClone;
            var account = $.trim(frm.account.value);
            var pwd = $.trim(frm.password.value);

            if(!account.length){
                this.showTip(this.TIP.EMAIL, $(frm.account));
                returnValue = false;
            }

            if(returnValue && !pwd.length){
                this.showTip(this.TIP.PASSWORD, $(frm.password));
                returnValue = false;
            }

            return returnValue;
        },
        showTip: function(text, dom){
            var height = 30;
            var offset = dom.offset();
            var sTop = offset.top - height;

            $('#tipContent').text(text);
            $('#tipWrap').show().css({left: offset.left, top: sTop});
        },

        back: function () {
            //返回
            setTimeout(function () {
                if(top.$Addr){                
                    var master = top.$Addr;
                    master.trigger(master.EVENTS.LOAD_MAIN);
                }else{
					top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
				}
            }, 0xff);
            return false;
        },

        cancel: function (_this) {
            if (_this.processing) {
                _this.dialog = top.$Msg.confirm(PageMsg['warn_whencancel'], function () {
                    _this.model.set({ status: "cancel" }, { silent: true });
                    _this.back();
                    top.M139.UI.TipMessage.show("导入取消", { delay: 3000 });
                    _this.dialog = false;
                }, null, null, { isHtml: true });
            } else {
                _this.back();
            }
            return false;
        }

    }));

    $(function () { new M2012.Addr.View.Import.Clone(); });

})(jQuery, _, M139);
