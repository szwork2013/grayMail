;
(function ($, _, M) {

    function parseAddressData(text, domain, account) {

        var result = false;
        switch (domain) {
            case "@163.com": case "@yeah.net":
                result = parse163Addr(text, account);
                break;
            case "@21cn.com":
                result = parse21cnAddr(text, account);
                break;
            case "@tom.com":
                result = parsetomAddr(text, account);
                break;
            case "@sohu.com":
                result = parseSohuAddr(text, account);
                break;
            case "@126.com":
                return text;
                break;
        }

        if (result) {
            return titles139 + "\r\n" + result.join("\r\n");
        }
        return "";
    }

    var superClass = M.Model.ModelBase;
    var _class = "M2012.Addr.Model.Import.Clone";


    M.namespace(_class, M.Model.ModelBase.extend({

        name: _class,
        //@gmail.com暂时先屏蔽
        defaults: { domains: ["@163.com", "@126.com", "@yeah.net", "@sohu.com", "@21cn.com"] },
        EVENTS: {
            IMPORT: "clone:start",
            FETCH: "clone:fetch",
            FETCHED: "clone:fetched",
            FETCHFAIL: "clone:fetchfail",
            ADD: "clone:add",
            ADDED: "clone:added",
            ADDFAIL: "clone:addfail",
            RELOAD: "clone:reload",
            RELOADFAIL: "clone:statuserror"
        },

        initialize: function () {
            superClass.prototype.initialize.apply(this, arguments);

            var _this = this;
            _this.model = new M2012.Addr.Model.Import.Common();
            _this.bind('change:status', function (model, value, changes) {
                _this.logger.debug('status changing', arguments);
                if (value === 'import') {
                    model.fetch();
                }
            });
        },

        validate: function (attributes) {
            var errMsg = false;

            if (_.isEmpty(attributes.password)) {
                errMsg = { "field": "password", "tipid": "warn_passwordempty" };
            }

            if (_.isEmpty(attributes.account)) {
                errMsg = { "field": "account", "tipid": "warn_noaccount" };
            }

            if (errMsg) {
                return errMsg
            }
        },
        
        fetch: function() {
            var _this = this;
            var domain = _this.get('domain');

            if (domain == "@sohu.com" || domain == "@21cn.com") {
                var api = "/sharpapi/addr/matrix/banjia/getaddress.aspx";
                var params = {
                    sid: top.$App.getSid()
                };

                var url = top.$Url.makeUrl(api, params);

                var account = _this.get('account');

                var mailid = account + domain;

                var param = $.param({ mailID: mailid, password: _this.get('password') });

                _this.trigger(_this.EVENTS.FETCH);
                try {
                    top.$RM.call(url, param, function (e) {
                        _this.trigger(_this.EVENTS.FETCHED);
                        var response = $.trim(String(e.responseText));

                        if (_.isEmpty(response) || response == "FA_UNAUTHORIZED" || response == "FA_CLONE_ERROR") {
                            _this.logger.error("抓取其他邮箱失败|" + mailid);
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            return;
                        }

                        _this.logger.info("抓取其他邮箱成功", response.substring(0, 100));
                        _this.fetchBH(domain);
                        var contactData = parseAddressData(response, domain, mailid);

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.clone(contactData, mailid);

                    },
                    {
                        requestDataType: "Nothing",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        error: function (err) {
                            //404可能是服务端报错，或者会话过期
                            //500+是服务端错误
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            _this.logger.error('fetch failed|status=' + err.status, err.responseText);
                        }
                    });
                } catch (ex) {
                    _this.trigger(_this.EVENTS.FETCHFAIL);
                }
            }

            else if (domain == "@163.com" || domain == "@126.com" || domain == "@yeah.net") {
                var api = "wangyisync";
                var account = _this.get('account');
                var mailid = account + domain;
                var param = $.param({ account: mailid, password: _this.get('password') });

                _this.trigger(_this.EVENTS.FETCH);
                try {
                    top.M2012.Contacts.API.call(api, param, function (result) {
                        _this.trigger(_this.EVENTS.FETCHED);

                        if (!result) {
                            _this.logger.error("抓取其他邮箱失败|" + mailid);
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            return;
                        }

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.fetchBH(domain);
                        _this.trigger(_this.EVENTS.ADD);
                        var rs = result.responseData;
                        if (rs && rs.code == "S_OK") {
                            _this.trigger(_this.EVENTS.ADDED);
                            var _batchid = rs.CCBatchID;
                            _this.logger.info('clone success|batchid=' + _batchid);

                            _this.model.queryStatus({
                                batchid: _batchid,
                                success: function () {
                                    _this.trigger(_this.EVENTS.RELOAD);
                                    _this.set({ batchid: _batchid });
                                },
                                error: function (args) {
                                    _this.logger.error('clone fail|batchid=' + _batchid);
                                    _this.trigger(_this.EVENTS.RELOADFAIL, args);
                                    _this.set({ status: 'imported' }, { silent: true });
                                }
                            });
                        } else {
                            _this.trigger(_this.EVENTS.ADDFAIL, result);
                            _this.set({ status: 'imported' }, { silent: true });
                        }
                    },
                    {
                        httpMethod: "get",
                        error: function (err) {
                            _this.trigger(_this.EVENTS.FETCHFAIL, { code: 'ER_FETCH_FAIL', tipid: 'fail_other' });
                            _this.set({ status: 'importerror' }, { silent: true });
                            _this.logger.error('fetch failed|status=' + err.status, err.responseText);
                        }
                    });
                }
                catch (ex) {
                    _this.trigger(_this.EVENTS.FETCHFAIL);
                }
            }
        },

        clone: function (data, mailid) {
            var _this = this;
            function onload() {
                top.$App.off("contactLoad", onload);
            }

            _this.trigger(_this.EVENTS.ADD);
            top.M2012.Contacts.API.cloneContacts({
                params: {
                    CloneContacts: {
                        Account: mailid,
                        Merge: _this.get("repeatmodel"),
                        ContactData: data
                    }
                },
                callback: function (res) {
                    var rs = res.responseData;
                    if (rs && rs.code == "S_OK") {
                        _this.trigger(_this.EVENTS.ADDED);
                        var _batchid = rs.summary;
                        _this.logger.info('clone success|batchid=' + _batchid);

                        if (_this.get("status") == "cancel") {
                            return;
                        }

                        _this.model.queryStatus({
                            batchid: _batchid,
                            success: function () {
                                _this.trigger(_this.EVENTS.RELOAD);
                                _this.set({ batchid: _batchid });
                            },
                            error: function(args) {
                                _this.logger.error('clone fail|batchid=' + _batchid);
                                _this.trigger(_this.EVENTS.RELOADFAIL, args);
                                _this.set({ status: 'imported' }, { silent: true });
                            }
                        });
                    } else {
                        _this.trigger(_this.EVENTS.ADDFAIL, res);
                        _this.set({ status: 'imported' }, { silent: true });
                    }
                }
            });
        },

        fetchBH: function (domain) {
            switch (domain) {
                case "@163.com": top.BH("163fetch");
                    break;
                case "@126.com": top.BH("126fetch");
                    break;
                case "@yeah.net": top.BH("yeahfetch");
                    break;
                case "@gmail.com": top.BH("gmailfetch");
                    break;
                case "@21cn.com": top.BH("21cnfetch");
                    break;
                case "@sohu.com": top.BH("sohufetch");
                    break;
            }
        }

    }));

})(jQuery, _, M139);
