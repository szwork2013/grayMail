

(function ($, _, M139, top) {
    var master = window.$Cal,
        EVENTS = master.EVENTS;

    var entryView = "M2012.Calendar.View.MessageItem";
    M139.namespace(entryView, Backbone.View.extend({
        types: {
            INVITE: 1,
            SHARE: 2
        },
        initialize: function (options) {
            var _this = this,
                types = _this.types;

            options = options || {};
            //转换
            var args = {
                container: options.container,
                model: options.model,
                defaults: {
                    seqno: options.seqno,
                    refSeqno: options.refSeqno,
                    date: options.createTime,
                    title: options.message,
                    status: options.status,
                    type: options.type
                }
            };

            switch (options.type) {
                case types.INVITE:
                    //活动邀请消息
                    new M2012.Calendar.View.InviteMessage(args);
                    break;
                case types.SHARE:
                    //日历共享消息
                    new M2012.Calendar.View.ShareMessage(args);
                    break;
                default:
                    break;
            }
        }
    }));

    var baseView = "M2012.Calendar.View.BaseMessage";
    M139.namespace(baseView, Backbone.View.extend({
        itemTemplate: ['<div seqno="{seqno}" class="boxlist">',
                         '<a id="delete" class="i_sc" href="javascript:;">删除</a>',
                         '<div id="switch" class="boxlist-title">',
                             '<span class="gray fr">{date}</span>',
                             '<span id="title" rel="msgtext" class="{className}">{title}</span>',
                         '</div>',
                         '<div id="detail"></div>',
                         '<div id="statusbar" class="boxlist-bottom clearfix">',
                            '<div class="fl"></div>',
                            '<div class="fr pr_10"></div>',
                         '</div>',
                     '</div>'].join(""),
        detailTemplate: ['<div class="boxlist-text">',
                             '<h3>',
                                //日历共享有颜色显示,活动邀请没有
                                '{title}',
                             '</h3>',
                             '<table class="boxlist-text-tab">',
                                 '<tbody>',
                                    '{content}',
                                 '</tbody>',
                             '</table>',
                         '</div>'].join(""),
        blacklistTemplate: '<a href="javascript:void(0);" title="添加联系人至白名单后,将默认屏蔽来自该联系人的消息">添加联系人至黑名单</a>',
        whitelistTemplate: '<a href="javascript:void(0);" title="添加联系人至白名单后,将默认接受来自该联系人的日历共享、活动分享">添加联系人至白名单</a>',
        tipTemplate: '<span>{message}</span>', //已添加联系人至 黑/白 名单
        handlerTemplate: '<a type="accept" class="btnSure mr_10"><span>接受</span></a><a type="reject" class="btnNormal mr_10"><span>谢绝</span></a>',

        configs: {
            UNREAD: 0,

            UNHANDLER: 0, //未处理消息(即未接受/拒绝)
            ACCEPT: 1, //已接受
            REJECT: 2, //已谢绝

            types: {
                INVITE: 1,
                SHARE: 2
            },

            messages: {
                LOADING: '正在加载中...',
                DEFAULT_ERROR: '操作失败',
                SUCCESS: '操作成功',

                BLACK_LIST: '已添加联系人至黑名单',
                WHITE_LIST: '已添加联系人至白名单',

                DELETE_TITLE: '消息处理',
                DELETE_CONFIRM: '您确定删除这条消息？',
                DELETE_UNREAD_CONFIRM: '您尚未处理该条消息，删除后，将无法再处理'
            },

            codes: {
                OK: "S_OK",
                UNKNOW: "FS_UNKNOW",
                CANCEL: 200,
                UNKNOW_ERRORCODE: 999
            },

            apis: {
                "1": "updateInviteStatus",
                "2": "processShareLabelInfo"
            },

            actions: {
                ACCEPT: 0,
                REJECT: 1
            },

            rules: {
                BLACK_LIST: 2,
                WHITE_LIST: 1
            }
        },
        initialize: function (options) {
            var _this = this,
                status;

            options = options || { defaults: {} };
            status = options.defaults.status; //用来判断消息是否已读
            options.defaults.isUnread = status == _this.configs.UNREAD; //未读,一定未处理

            _this.options = options;
            _this.container = options.container;
            _this.parentModel = options.model;
            _this.model = new Backbone.Model(options.defaults);

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this,
                model = _this.model;

            var html = $T.format(_this.itemTemplate, {
                seqno: model.get("seqno"),
                date: model.get("date"),
                title: $T.Html.encode(model.get("title")),
                className: model.get("status") == _this.configs.UNREAD ? "fw_b" : ""
            });

            _this.$el = $(html);
            _this.container.append(_this.$el);

            //保存dom元素
            _this.deleteEl = $("#delete", _this.$el);
            _this.switchEl = $("#switch", _this.$el);
            _this.titleEl = $("#title", _this.$el);
            _this.detailEl = $("#detail", _this.$el);
            _this.statusbar = $("#statusbar", _this.$el);
            _this.leftbar = $(".fl", _this.statusbar);
            _this.rightbar = $(".fr", _this.statusbar);
        },
        initEvents: function () {
            var _this = this,
                loading = false,
                configs = _this.configs,
                messages = _this.configs.messages,
                codes = _this.configs.codes,
                seqno = _this.model.get("seqno");

            //展开消息,自动标记为已读
            _this.switchEl.on("click", function () {
                var isUnread = _this.model.get("isUnread"); //未读状态
                if (_this.opened) {
                    //已展开,则触发关闭操作
                    _this.trigger("event:close")
                } else {
                    if (_this.isloaded) {
                        //已加载,则直接显示对应的div即可
                        _this.trigger("event:show");
                    } else {
                        if (loading) return; //接口慢,等...

                        loading = true; //加载了,等待回调trigger事件来显示
                        top.M139.UI.TipMessage.show(messages.LOADING);
                        _this.readMessage(function (result) {
                            _this.isloaded = true; //已通过接口加载数据,标记一下

                            top.M139.UI.TipMessage.hide();
                            var code = result && result.code,
                                obj = (result && result["var"]) || {},
                                data = obj.calendar || obj.label || {}, //活动或者日历
                                isUnhandled,
                                status,//接受拒绝状态
                                refSeqno, //关联的日历ID或者活动ID
                                bwl, //black & white list
                                uin; //发起人的UIN,后台没返回邮箱地址

                            //状态码为未知,保存错误码errorCode
                            if (code == codes.UNKNOW) {
                                code = result && result.errorCode; //未知错误,把errorCode保存起来

                                if (code == codes.UNKNOW_ERRORCODE) { //返回未知错误 999
                                    top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                                    return;
                                }
                            }

                            //保存黑白名单状态
                            status = data['status']; //接受拒绝状态 , 点开了消息,状态要刷新
                            bwl = obj['blackWhiteType']; //黑白名单状态
                            uin = data['uin'];
                            refSeqno = data['seqno'];
                            isUnhandled = status == _this.configs.UNHANDLER; //调用了接口,则读取消息是否未处理,这个status表示是否处理,处理状态是接受还是拒绝

                            //保存状态码,触发显示事件
                            _this.model.set({
                                "code": code,
                                "bwl": bwl,
                                "uin": uin,
                                "status": status,
                                "refSeqno": refSeqno,
                                "isUnhandled": isUnhandled,
                                "isUnread": false
                            }); //状态,保存起来

                            _this.titleEl.removeClass("fw_b"); //去掉加粗,标记为已读

                            //data 已经处理过,值为 responseData["var"].calendar或者responseData["var"].label
                            _this.renderMessage(code, data);

                            _this.trigger("event:show");

                            if (isUnread) {
                                _this.parentModel.trigger("change:msgCount"); //刷新未读数量
                            }
                        });
                    }
                }
            });

            var time = new Date();
            _this.deleteEl.on("click", function () {
                var now = new Date();
                if (now.getTime() - time.getTime() < 500) return; //0.5秒内只能点一次
                time = now;

                /**
                 * 需求: 需要判断消息是否已经处理,如果未处理,则提示A,否则提示B
                 * 现状: 后台的getMessageList未返回消息是否已处理(后台不肯修改), 要想知道消息是否已处理,需要请求getMessageById来判断
                 * 实现: 如果是未读的消息,肯定未处理,提示A; 如果是已读的消息, 获取getMessageById来判断消息是否已接受或拒绝,分别提示A和B. 这已经是最优化的情况
                 * 吐槽: 就因为后台不肯加一个字段,前端的代码瞬间增加了几十行并且逻辑复杂还要请求多一次接口
                 */
                var isUnread = _this.model.get("isUnread"),
                    isUnhandled = _this.model.get("isUnhandled"),
                    tipMsg; //未读, 显示不同提示语

                if (isUnread) {
                    deleteConfirm(seqno, messages.DELETE_UNREAD_CONFIRM);
                } else {
                    //如果是已读,就只能通过getMessageById来获取消息是否已处理的操作了(后台不肯改)
                    if (typeof isUnhandled == 'undefined') {
                        _this.readMessage(function (data) {
                            var code = data && data.code;
                            if (code == _this.configs.codes.OK) {
                                //接口正常
                                var obj = data["var"] || {},
                                    detail = obj.calendar || obj.label || {},
                                    isUnhandled = detail.status == configs.UNREAD; //读取消息是否已经接受或者拒绝

                                _this.model.set("isUnhandled", isUnhandled);
                                tipMsg = isUnhandled ? messages.DELETE_UNREAD_CONFIRM : messages.DELETE_CONFIRM;

                                deleteConfirm(seqno, tipMsg);
                            } else {
                                //接口状态异常,code!="S_OK"
                                deleteConfirm(seqno, messages.DELETE_CONFIRM);
                            }
                        }, function () {
                            //接口错误了.不处理,直接弹出询问
                            deleteConfirm(seqno, messages.DELETE_CONFIRM);
                        });
                    } else {
                        //获取过接口,就直接处理了不再请求接口
                        tipMsg = isUnhandled ? messages.DELETE_UNREAD_CONFIRM : messages.DELETE_CONFIRM;

                        deleteConfirm(seqno, tipMsg);
                    }
                }
            });

            //消息的删除确认
            function deleteConfirm(seqno, tipMsg) {
                top.$Msg.confirm(tipMsg, function () {
                    _this.parentModel.delMessage(seqno, function (data) {
                        var code = data && data.code;
                        if (code == configs.codes.OK) {
                            _this.parentModel.trigger("event:refresh"); //重新渲染列表
                        } else {
                            _this.renderError();
                        }
                    }, function () {
                        _this.renderError();
                    });
                }, {
                    dialogTitle: messages.DELETE_TITLE,
                    icon: 'warn'
                });
            }

            _this.on("event:close", function () {
                _this.$el.removeClass("boxlist-open");
                _this.opened = false;
            }).on("event:show", function () {
                //显示分2种: 显示提示, 显示消息内容
                var code = _this.model.get("code"),
                    codes = _this.configs.codes;

                switch (code) {
                    case codes.OK:
                        _this.$el.addClass("boxlist-open");
                        break;
                    case codes.CANCEL:
                        //已经取消了,活动/日历详情区域显示提示语
                        _this.$el.addClass("boxlist-open");
                        _this.statusbar.addClass("hide");
                        break;
                    default:
                        break;
                }

                _this.opened = true;
            })
        },
        readMessage: function (callback, error) {
            var _this = this;
            var messageId = _this.model.get("seqno");

            //compatible
            callback = callback || $.noop;
            error = error || $.noop;

            _this.parentModel.getMessageById(messageId, function (result) {
                //触发回调,渲染视图
                callback(result);
            }, function () {
                top.M139.UI.TipMessage.show(_this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: 'msgRed' });
                error();
            })
        },
        /**
         @param type {Int} 接受的类型: 1是邀请活动,2是共享日历
         @param callback {Function} 接口请求成功后的回调(包括 code != "S_OK")
         */
        accept: function (type, callback) {
            //接受 邀请/共享
            var _this = this;
            var options = {
                actionType: _this.configs.actions.ACCEPT,
                seqNos: _this.model.get("refSeqno"), //消息seqno关联的活动/日历的ID: refSeqno
                refuseResion: ''
            };

            _this._callApi(type, options, callback);
        },
        /**
         @param type {Int} 拒绝的类型: 1是邀请活动,2是共享日历
         @param callback {Function} 接口请求成功后的回调(包括 code != "S_OK")
         */
        reject: function (type, callback) {
            //拒绝 邀请/共享
            var _this = this;
            var options = {
                actionType: _this.configs.actions.REJECT,
                seqNos: _this.model.get("refSeqno"),
                refuseResion: _this.model.get("reason") //拒绝原因,在调用接口之前先获取并set到model中, 后台又拼错了...
            };

            _this._callApi(type, options, callback);
        },
        _callApi: function (type, options, callback) {
            var _this = this,
                messages = _this.configs.messages,
                apis = _this.configs.apis,
                apiName = apis[type];

            if (apiName) {
                _this.parentModel[apiName](options, function (data) {
                    var code = data && data.code;
                    if (code == _this.configs.codes.OK) {
                        top.M139.UI.TipMessage.show(messages.SUCCESS, { delay: 3000 });
                    } else {
                        top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                    }

                    callback(code, data);
                }, function () {
                    top.M139.UI.TipMessage.show(messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                });
            } else {
                throw new Error("message type error");
            }
        },
        /**
         * @param options.type {Int} 类型 1：白名单, 2：黑名单
         * @param options.email {String} 用户的邮箱地址，多个用逗号隔开
         * @param options.uin {String} 可选,用户的UIN
         */
        addBlackWhiteItem: function (options, callback) {
            var _this = this;

            _this.parentModel.addBlackWhiteItem(options,
                function (data) {
                    var code = data && data.code;
                    if (code == _this.configs.codes.OK) {
                        callback();
                    } else {
                        _this.renderError();
                    }
                }, function () {
                    _this.renderError();
                });
        },
        renderError: function () {
            top.M139.UI.TipMessage.show(this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: 'msgRed' });
        },
        renderHandler: function () {
            var _this = this;

            //操作按钮
            _this.buttons = $(this.handlerTemplate);
            this.leftbar.html(_this.buttons);

            this.leftbar.find("[type='accept']").on("click", function () {
                _this.accept(_this.type, function (code, result) {
                    if (code == _this.configs.codes.OK) {
                        _this.renderLeftStatusBar(true);
                        _this.renderRightStatusBar(true);
                    }
                });
            });

            this.leftbar.find('[type="reject"]').on('click', function () {
                _this.model.set("reason", null); //清空上一次???

                new M2012.Calendar.View.RejectReason({
                    container: $(this),
                    onsubmit: function (data) {
                        if (data && data.reason) _this.model.set("reason", data.reason); //拒绝理由set到model中

                        _this.reject(_this.type, function (code, result) {
                            if (code == _this.configs.codes.OK) {
                                _this.renderLeftStatusBar(false);
                                _this.renderRightStatusBar(false);
                            }
                        });
                    }
                });
            });
        },
        /**
         * 状态栏右侧: 添加到黑白名单
         * 功能相同,统一写方法
         */
        renderRightStatusBar: function (isaccept) {
            var _this = this,
                model = _this.model,
                rules = _this.configs.rules,
                messages = _this.configs.messages,
                bwl = model.get("bwl"), //黑白名单状态, black white list
                uin = model.get("uin"); //发起人的uin

            //一些需要计算的变量
            var rightHtml = isaccept ? _this.whitelistTemplate : _this.blacklistTemplate, //右侧显示: 添加到黑/白名单
                blacklistAddedHtml = $T.format(_this.tipTemplate, { message: messages.BLACK_LIST }), //已添加到黑名单
                whitelistAddedHtml = $T.format(_this.tipTemplate, { message: messages.WHITE_LIST }), //已添加到白名单
                resultHtml = isaccept ? whitelistAddedHtml : blacklistAddedHtml, //根据状态,记录下操作结束后需要显示的内容
                type = isaccept ? rules.WHITE_LIST : rules.BLACK_LIST;

            if (bwl == rules.WHITE_LIST) {
                //接受了并且已经是白名单, 显示 "已添加联系人至白名单"
                rightHtml = whitelistAddedHtml;
            }

            if (bwl == rules.BLACK_LIST) {
                //接受了,并且已经是黑名单, 显示 "已添加联系人至黑名单"
                rightHtml = blacklistAddedHtml;
            }

            _this.rightbar.html(rightHtml);
            _this.rightbar.find("a").on("click", function () {
                //添加到黑白名单
                _this.addBlackWhiteItem({
                    type: type,
                    uin: uin
                }, function (data) {
                    _this.rightbar.html(resultHtml); //上面根据接受还是拒绝,显示的HTML
                });
            });
        },

        /**
         * 显示消息主体(差异化方法)
         */
        renderMessage: function (code, data) {
            //virtual function
        },
        /**
         * 渲染左侧接受拒绝按钮
         * 显示消息状态栏(差异化方法)
         */
        renderLeftStatusBar: function (isaccept) {
            //virtual function
        }
    }));

    var baseMsg = M2012.Calendar.View.BaseMessage;
    var inviteView = "M2012.Calendar.View.InviteMessage";
    M139.namespace(inviteView, baseMsg.extend({
        conflictTemplate: '<span class="ml_20"><a class="ml_10" href="javascript:void(0);" id="more" title="">您在该时段已有 {len} 个活动</a></span>',
        trTemplate: '<tr><td width="10%;">{name}：</td><td width="90%;">{content}</td></tr>',
        acceptTemplate: '<i class="i_ok_min mr_5"></i>已接受 <a id="setremind" href="javascript:void(0);" class="mr_10">设置提醒</a>',
        rejectTemplate: '<i class="i_ok_min mr_5"></i>已谢绝',

        type: 1, //1表是活动邀请
        messages: {
            CANCEL: '该活动已经被取消'
        },
        keys: {
            content: '内容',
            dateDescript: '时间',
            site: '地点'
        },
        renderMessage: function (code, data) {
            var _this = this,
                codes = _this.configs.codes,
                tr = [],
                errTr, detailHtml,
                title, content;

            if (code == codes.OK) {
                //拼接显示内容,时间,地点
                for (var key in _this.keys) {
                    if (data[key]) {
                        tr.push($T.format(_this.trTemplate, {
                            name: _this.keys[key],
                            content: $T.Html.encode(data[key])
                        }));
                    }
                }

                title = data['title'];
                content = tr.join('');

                //消息状态
                var status = data["status"],
                    isaccept = status == _this.configs.ACCEPT,
                    conflictList = data["conflictList"] || [];

                //mod, morelist里面没有htmlencode
                var htmlEncode = $T.Html.encode;
                $.each(conflictList, function (i, item) {
                    item.title = htmlEncode(item.title);
                });
                //end mod

                _this.model.set({ conflictList: conflictList }); //活动多了一个冲突的显示
                if (status == _this.configs.UNHANDLER) {
                    _this.renderHandler();
                } else {
                    _this.renderLeftStatusBar(isaccept);
                    _this.renderRightStatusBar(isaccept);
                }

                //显示冲突的活动列表(更多列表)
                _this.renderConflict();
            } else if (code == codes.CANCEL) {
                //活动已取消
                title = '';
                content = "<tr><td>" + _this.messages.CANCEL + "</td></tr>";
            } else {
                top.M139.UI.TipMessage.show(_this.configs.messages.DEFAULT_ERROR, { delay: 3000, className: "msgRed" });
                return;
            }

            detailHtml = $T.format(_this.detailTemplate, {
                title: $T.Html.encode(title),
                content: content
            });

            _this.handler = $(detailHtml); //存起来,方便处理完成之后remove
            _this.handler.appendTo(_this.detailEl);
            //_this.detail.html(detailHtml);
        },
        renderConflict: function (isShowMore) {
            var _this = this,
                conflictList = _this.model.get('conflictList') || [],
                len = conflictList.length,
                html;

            _this.leftbar.find("#more").parent().remove(); //如果有冲突的提示,就先删除

            if (len > 0) {
                html = $T.format(_this.conflictTemplate, { len: len });
                _this.more = $(html);
                _this.more.appendTo(_this.leftbar);
                var conflictEl = _this.leftbar.find("#more");

                conflictEl.on("click", function () {
                    var thisEl = $(this);
                    //查看冲突
                    M2012.Calendar.View.MoreList.show({
                        container: thisEl,
                        date: new Date(),
                        master: master,
                        labels: master.get("checklabels") || [],
                        types: master.get("includeTypes") || [],
                        data: conflictList,
                        onRemove: function (args) {
                            for (var i = 0, len = conflictList.length; i < len; i++) {
                                if (conflictList[i].seqno == args.seqNo) {
                                    conflictList.splice(i, 1); //移除已删除的数据
                                    break;
                                }
                            }
                            _this.model.set({ conflictList: conflictList }); //save
                            M2012.Calendar.View.MoreList.hide(); //隐藏更多

                            _this.renderConflict(true); //重复的条数也要刷新, 并重新显示更多
                        }
                    });
                });

                if (isShowMore) {
                    conflictEl.trigger('click');
                }
            }
        },
        renderLeftStatusBar: function (isaccept) {
            var _this = this,
                leftHtml = isaccept ? _this.acceptTemplate : _this.rejectTemplate; //左侧的显示: 已接受/已拒绝

            //如果是操作了接受拒绝,隐藏接受和拒绝按钮
            if (_this.buttons) _this.buttons.remove();

            if (_this.more) {
                //如果有活动冲突的链接.就在前面插入状态
                _this.more.before(leftHtml);
            } else {
                _this.leftbar.html(leftHtml);
            }

            _this.leftbar.find("#setremind").on("click", function () {
                console.log(EVENTS.EDIT_ACTIVITY, {
                    seqNo: _this.model.get('refSeqno'),
                    type: _this.configs.types.INVITE //1表示邀请
                }, _this.configs);

                master.trigger(EVENTS.EDIT_ACTIVITY, {
                    seqNo: _this.model.get('refSeqno'),
                    type: _this.configs.types.INVITE //1表示邀请
                });
            });
        }
    }));

    var shareView = "M2012.Calendar.View.ShareMessage";
    M139.namespace(shareView, baseMsg.extend({

        titleTemplate: '<span class="ad-tagt " style="background-color:{color};"></span>{title}',
        trTemplate: '<tr><td>此日历下共有 {len} 条活动，接受共享后此日历下的所有活动将同步至您的活动。</td></tr>',
        acceptTemplate: '<i class="i_ok_min mr_5"></i>已接收并添加到至您的活动中&nbsp;&nbsp;<a class="mr_10" href="javascript:void(0);">查看日历</a><span></span>',
        rejectTemplate: '<i class="i_ok_min mr_5"></i>已谢绝',

        type: 2, //2表示日历共享
        messages: {
            CANCEL: '该日历已经被取消'
        },
        renderMessage: function (code, data) {
            var _this = this,
                codes = _this.configs.codes,
                tr = [],
                errTr, detailHtml,
                title, content;

            if (code == codes.CANCEL) {
                //活动已取消
                title = '';
                content = _this.messages.CANCEL;
            } else {
                //拼接显示内容
                title = $T.format(_this.titleTemplate, {
                    color: data["color"],
                    title: $T.Html.encode(data["labelName"])
                });
                content = $T.format(_this.trTemplate, { len: data['calendarCount'] }); //条数

                //消息状态
                var status = data["status"],
                    isaccept = status == _this.configs.ACCEPT;
                if (status == _this.configs.UNHANDLER) {
                    _this.renderHandler();
                } else {
                    _this.renderLeftStatusBar(isaccept);
                    _this.renderRightStatusBar(isaccept);
                }
            }

            detailHtml = $T.format(_this.detailTemplate, {
                title: title,
                content: "<tr><td>" + content + "</td></tr>"
            });
            _this.detailEl.html(detailHtml);
        },
        renderLeftStatusBar: function (isaccept) {
            //查看,添加到黑白名单
            var _this = this,
                model = _this.model,
                leftHtml = isaccept ? _this.acceptTemplate : _this.rejectTemplate, //左侧的显示: 已接受/已拒绝
                labelId = model.get("refSeqno");

            if (isaccept) {
                master.trigger(EVENTS.LABEL_CHANGE); //通知左侧请求接口刷新数据
            }

            _this.leftbar.html(leftHtml);

            _this.leftbar.find("a").on("click", function () {
                //查看日历
                master.trigger(EVENTS.EDIT_LABEL, { labelId: labelId, isShared: true });
            });
        }
    }));

})(jQuery, _, M139, window._top || window.top);
