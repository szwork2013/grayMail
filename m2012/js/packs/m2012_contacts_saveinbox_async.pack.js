/**
 * @fileOverview 定义保存入信保存联系人
 */

(function ($, _, M139) {

    var queue = [];
    var addrqueue = [];
    var hasGroup = false;
    var GPNAME = '读信联系人';
    var sysmail = {'yn_edu@139.com':true,'2010expo@139.com':true,'xyr@139.com':true,'mail139010@139.com':true,'toupiao@139.com':true,'mail139@139.com':true,'homemail@139.com':true,'sd10086@139.com':true,'dg10086@139.com':true,'account@139.com':true,'gdcmail@139.com':true,'gd10086@139.com':true,'wh990027@139.com':true,'sxmail139@139.com':true,'hebei10086@139.com':true,'jmyd3g@139.com':true,'hbmc10086@139.com':true,'cmail@139.com':true,'myfetion@139.com':true,'xfyd_10086@139.com':true,'bizmail@139.com':true,'billmail@139.com':true,'990027@139.com':true,'hnmcc.com@139.com':true,'fj10086@139.com':true,'cmpayhb@139.com':true,'sjtv2010@139.com':true,'choujiang@139.com':true,'tuijian@139.com':true,'songli@139.com':true,'sh10086@139.com':true,'xz139@139.com':true,'jl10086@139.com':true,'tj10086@139.com':true,'gs10086@139.com':true,'xj10086@139.com':true,'hi10086@139.com':true,'he10086@139.com':true,'hl10086@139.com':true,'nx10086@139.com':true,'sd10086@139.com':true,'zj10086@139.com':true,'cq10086@139.com':true,'nm10086@139.com':true,'administrator@139.com':true,'hostmaster@139.com':true,'root@139.com':true,'webmaster@139.com':true,'postmaster@139.com':true,'abuse@139.com':true,'vip@139.com':true,'kefu@139.com':true,'tech@139.com':true,'mailtech@139.com':true,'admin@139.com':true,'Postmaster@139.com':true,'idea@139.com':true,'antispam@139.com':true,'mail139@139.com':true,'ued@139.com':true,'card10086@139.com':true,'dx@139.com':true,'uec@139.com':true,'dba@139.com':true,'join@139.com':true,'cmail@139.com':true,'gdcmail@139.com':true,'lstd@139.com':true,'service@139.com':true,'ilove10086@139.com':true,'suggestion@139.com':true,'idea@139.com':true,'subscribe@139.com':true};
    
    var enumfolder = M2012.Folder.Model.FolderModel.prototype.SysFolderId;
    var exceptfolder = [
        //广告
        enumfolder.advertise,
        //垃圾
        enumfolder.junk,
        //病毒
        enumfolder.virus,
        //帐单
        enumfolder.bill,
        //商讯
        enumfolder.business
    ];

    function forever(callback) {
        try {
            callback()
        } catch (ex) {
        }
    }

    function foreach(list, callback) {
        var m = list.length;
        var timer = setInterval(function () {
            if (m--) {
                forever(function() {
                    callback(list[m]);
                });
            } else {
                clearInterval(timer);
            }
        }, 0x20);
    }

    M139.namespace("M2012.Contacts.Model.SaveInputBoxContacts", Backbone.Model.extend(
    /**@lends M2012.Contacts.Model.SaveInputBoxContacts.prototype*/
    {
        handlertimer: 0,
        requesttimer: 0,
        isbusy: false,
        logger: M139.Logger.getDefaultLogger(),

        /**通讯录数据实体
        *@constructs M2012.Contacts.Model.SaveInputBoxContacts
        */
        initialize: function (options) {
            this.initEvents();
        },

        isExcept: function (mailinfo) {
            return $.inArray(mailinfo.fid, exceptfolder) > -1 || (mailinfo.flags && ( mailinfo.flags.subscriptionFlag || mailinfo.flags.billFlag));
        },

        /**
         *加载通讯录数据
         */
        initEvents: function (options, callback) {
            options = options || {};
            var _this = this;

            $App.on('app:mailreaded#savecontact', function(mailinfo) {
                if (_this.isExcept(mailinfo)) {
                    return _this.logger.debug('not save, mail from except folder', mailinfo);
                }
				if (top.$App.getUserCustomInfo("readAutoSave") != 2) {
					queue.push(mailinfo.mid);
					_this.start();
				}
            });

            var model = top.M2012.Contacts.getModel();
            model.unbind('contacts:group#deleted');
            model.bind('contacts:group#deleted', function(groupid) {
                if (groupid == hasGroup) {
                    _this.createGroup = function() {
                        _this.createGroup = function(){};
                        _this._createGroup();
                    };
                    hasGroup = false;
                }
            });
        },

        _createGroup: function () {
            var _this = this;
            M2012.Contacts.API.addGroup(GPNAME, function(rs) {
                _this.logger.debug('group created.', rs.groupId);
                if (rs.ResultCode == 22) {
                    hasGroup = 0;
                } else {
                    hasGroup = rs.groupId;
                }
                _this.start();
            });
        },

        createGroup: function () {
            var _this = this;
            _this.createGroup = function(){};
            _this._createGroup();
        },

        start: function () {
            var _this = this;
            var cmodel = M2012.Contacts.getModel();

            if (cmodel.getContactsCount() >= $User.getMaxContactLimit()) {
                _this.logger.error('not save, contact full now|' + cmodel.getContactsCount());
                return;
            }

            if (_this.handlertimer) {
                return;
            }

            if (hasGroup === false) {
                var group = cmodel.getGroupByName(GPNAME);
                if (group == null) {
                    return _this.createGroup();
                }

                hasGroup = group.GroupId;
            }

            _this.handlertimer = setInterval(function() {
				if (top.$App.getUserCustomInfo("readAutoSave") == 2) {
                    return;
                }
                if (queue.length) {
                    var mid = queue.shift();

                    var mailinfo = false;
                    //if ($App.print) {
                    //   mailinfo = $App.print[mid];
                    //}
                    var print = M139.PageApplication.getTopApp().print; 
                    if (print) {
                        mailinfo = print[mid];
                    }

                    if (mailinfo) {
                        if (!_.isUndefined(mailinfo.headers.fraudFlag) && mailinfo.headers.fraudFlag != '0') {
                            _this.logger.error('not save, mail maybe fraud|' + mid + '|' + mailinfo.headers.fraudFlag);
                            return; //邮件内容存在欺诈的内容时，不自动保存联系人
                        }

                        var E = $Email;
                        forever(function () {
                            var list = E.getMailListFromString(mailinfo.account);
                            var list2 = E.getMailListFromString(mailinfo.to);
                            var list3 = E.getMailListFromString(mailinfo.cc);
                            list = list.concat(list2).concat(list3);

                            foreach(list, function(i) {
                                var addr = E.getObjQuick(i);

                                if (sysmail[addr.email.toLowerCase()]) return;
                                var contact = cmodel.getContactsByEmail(addr.email);

                                if (!(contact && contact.length > 0)) {
                                    addr.GroupId = hasGroup;

                                    var account = E.getAccount(addr.email);
                                    if (account) {
                                        account = account.replace(/[^\d]/g, '');
                                        account = $Mobile.remove86(account);
                                        if ($Mobile.isMobile(account)) {
                                            addr.mobile = account;
                                        }
                                    }

                                    addrqueue.push(addr);
                                }
                            });
                        });

                    } else {
                        queue.push(mid);
                    }
                } else {
                    if (_this.handlertimer) clearInterval( _this.handlertimer ), _this.handlertimer = 0;
                }
            }, 0x30);


            //保存策略：每3秒检测一次，提交一批，每批最多10人的，提交连接只保持一个。3秒未返回则跳一轮
            _this.requesttimer = setInterval(function() {
                if (_this.isbusy || addrqueue.length == 0) {
                    return;
                }

                if (addrqueue.length == 1) {
                    _this.isbusy = true;
                    /*var addr = addrqueue.shift();
                    M2012.Contacts.API.addContacts({
                        name: addr.name,
                        email: addr.email,
                        groupId: hasGroup
                    }, function(rs) {
                        _this.logger.info('1#入信联系人保存完成', rs);
                        _this.isbusy = false;
                        BH({key: 'readmail_saveinboxcontact', ext1:1});

                        //刷新通讯录标签
                        var atab = $App.getTabByName("addr");
                        if (atab) {
                            atab.isRendered=false;
                        }
                    }, {});*/
                    var list = addrqueue.splice(0, 1);
                    M2012.Contacts.API.addBatchContactsNew(list, function (rs) {
                        _this.logger.info('1#NEW入信联系人保存完成', rs);
                        _this.isbusy = false;
                        BH({ key: 'readmail_saveinboxcontact', ext1: 1 });

                        //刷新通讯录标签
                        var atab = $App.getTabByName("addr");
                        if (atab) {
                            atab.isRendered = false;
                        }
                    });
                } else {
                    var count = 10;
                    var list = addrqueue.splice(0, count);

                    _this.isbusy = true;
                    M2012.Contacts.API.addBatchContacts(list, function(rs) {
                        _this.logger.info('2#入信联系人保存完成', rs);
                        _this.isbusy = false;
                        BH({key: 'readmail_saveinboxcontact', ext1:(rs.list ? rs.list.length : 0)});

                        //刷新通讯录标签
                        var atab = $App.getTabByName("addr");
                        if (atab) {
                            atab.isRendered=false;
                        }
                    });
                }
            }, 3000);
        }

    }));

    var model = new M2012.Contacts.Model.SaveInputBoxContacts();
    model.start();

})(jQuery, _, M139);
