(function ($, _, M) {

    M139.namespace('M2012.Settings.Model.MailNotice', Backbone.Model.extend({

        logger: new M.Logger({ name: "setting.mailnotice.model" }),

        RANGE_LIMIT: 5,

        FROMTYPES: {
            NOCONTACT: 0, //不在通讯录
            CONTACT: 1, //在通讯录
            SOMEONE: 2 //指定的人（即例外情况）
        },

        getExceptLimit: function () {
            var exceptLimit = 50; //最多可添加的例外条数
            return exceptLimit;
        },

        initialize: function () {
            var _this = this;

            _this.on("fetch", _this.fetch);
            _this.on("save", _this.save);

            //主开关操作
            _this.on("majorenable_rendering", _this.onMajorSwitchRendering);
            _this.on("change:majorswitch", _this.onMajorSwitchChange);

            //主补发操作
            _this.on("majorsupply_rendering", _this.onMajorSupplyRendering);
            _this.on("change:majorsupply", _this.onMajorSupplyChange);
            
            // add by tkh 订阅邮件开关
            _this.on("mpostnotice_rendering", _this.onMpostNoticeRendering);
            _this.on("change:mpostnotice", _this.onMpostNoticeChange);

            //主接收方式
            _this.on("notifytype_rendering", _this.onNotifyTypeRendering);
            _this.on("noticetypechange", _this.onNoticeTypeChange);
            _this.on("noticeTypeChanged", _this.onNoticeTypeChanged);

            //主时段操作
            _this.on("majortimerange_rendering", _this.onMajorRangeListing);
            _this.on("TimeRangeExpanding", _this.onMajorRangeDetailing);
            _this.on("MajorRangeAdding", _this.onMajorRangeAdding);
            _this.on("MajorTimespanRemoving", _this.onMajorRangeRemoving);
            _this.on("MajorRangeModifing", _this.onMajorRangeModifing);

            //例外情况
            _this.on("exceptlist_rendering", _this.onExceptlistRendering);
            _this.on("exceptdetailrendering", _this.onExceptDetailRendering);
            _this.on("exceptmodifying", _this.onExceptModifying);
            _this.on("exceptdeleting", _this.onExceptRemoving);
            _this.on("exceptadding", _this.onExceptAdding);
            _this.on("exceptadded", _this.onExceptAdded);
            _this.on("emailadding", _this.onEmailSelecting);
        },

        //#region //{ 主开关与补发开关模块

        /**
        * 当呈现主开关时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorSwitchRendering: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalenable = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT) && i.enable;
            }).length >= 2;

            onrender(totalenable);
        },

        /**
        * 修改主开关时，更新数据源
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMajorSwitchChange: function (model, value) {
            model.logger.debug("onMajorSwitchChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.enable = value;
                }
            });

            model.set("mailNotify", data);
        },

        /**
        * 当呈现补发标志时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorSupplyRendering: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalsupply = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT);
            });

            from = true;
            $.each(totalsupply, function (n, i) {
                from = from && i.supply;
            });
            totalsupply = from;

            onrender(totalsupply);
        },

        /**
        * 修改补发标志时，更新数据源
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMajorSupplyChange: function (model, value) {
            model.logger.debug("onMajorSupplyChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.supply = value;
                }
            });

            model.set("mailNotify", data);
        },
        
        /**
        * 当呈现订阅邮件投递状态时，计算需要给出的数据
        * @author tkh
        * @param {Function} onrender 绘制回调函数
        */
        onMpostNoticeRendering : function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            var totalsupply = $.grep(data, function (i) {
                return (i.fromtype == from.NOCONTACT || i.fromtype == from.CONTACT);
            });

            from = true;
            $.each(totalsupply, function (n, i) {
                from = from && i.syncDy;
            });
            totalsupply = from;

            onrender(totalsupply);
        },
        
        /**
        * 修改订阅邮件投递状态时，更新数据源
        * @author tkh
        * @param {Object} model 本Model
        * @param {Object} value 新的值
        */
        onMpostNoticeChange : function (model, value) {
            model.logger.debug("onMpostNoticeChange", value, typeof value);
            var from = model.FROMTYPES;
            var data = model.get("mailNotify");

            $.each(data, function (i, n) {
                if (n.fromtype === from.CONTACT || n.fromtype === from.NOCONTACT) {
                    n.syncDy = value;
                }
            });

            model.set("mailNotify", data);
        },

        //#endregion //} 主开关与补发开关模块结束

        //#region //{ 主接收方式模块

        /**
        * 当呈现在主接收方式时，计算需要给出的数据
        * @param {Number} fromtype 需要给出邮件来源分类的编码
        * @param {Function} onrender 绘制回调函数
        */
        onNotifyTypeRendering: function (fromtype, onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            data = $.grep(data, function (i) {
                return i.fromtype == fromtype;
            });

            if (data.length > 0) {
                data = data[0];
                onrender(data.notifytype);
            }

            _this.onNoticeTypeChanged();
        },

        /**
        * 点击更换主接收方式时，更新数据源
        * @param {Object} args 参数表
        */
        onNoticeTypeChange: function (args) {
            var data = this.get("mailNotify");
            var from = this.FROMTYPES;

            for (var i = data.length; i--; ) {
                if (data[i].fromtype === args.type) {
                    data[i].notifytype = args.value;
                    break;
                }
            }

            this.logger.debug("noticeTypeChanged", args, data);
            this.trigger("noticeTypeChanged", data);
        },

        /**
        * 更换主接收方式后，通知视图开启或关闭时段
        * @param {Object} data 最新的数据
        */
        onNoticeTypeChanged: function () {
            var data = this.get("mailNotify");
            var from = this.FROMTYPES;

            var list = $.grep(data, function (i) {
                return i.fromtype === from.NOCONTACT || i.fromtype === from.CONTACT;
            });

            var every = true;
            $.each(list, function () {
                every = every && this.notifytype === 0;
            });

            this.trigger("noticeTypeClosed", every);
        },

        //#endregion //} 主接收方式模块结束

        //#region //{ 主时段操作模块

        /**
        * 当呈现主时段列表时，计算需要给出的数据
        * @param {Function} onrender 绘制回调函数
        */
        onMajorRangeListing: function (onrender) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");

            data = $.grep(data, function (i) {
                return i.fromtype == from.CONTACT;
            });

            if (data.length > 0) {
                data = data[0];

                var viewData = {
                    timerange: data.timerange,
                    lockdelete: data.timerange.length < 2,
                    lockadd: data.timerange.length >= _this.RANGE_LIMIT
                };

                onrender(viewData);
            }
        },

        /**
        * 当呈现某个主时段详情时，计算需要给出的数据
        * @param {Object} args 参数表
        */
        onMajorRangeDetailing: function (args) {
            var _this = this, data, from, row, tid;

            data = _this.get("mailNotify");
            from = _this.FROMTYPES;
            tid = args.tid;

            _this.logger.debug("onMajorRangeDetailing|tid=", tid);

            for (var i = data.length; i--; ) {
                for (var j = data[i].timerange.length; j--; ) {
                    if (data[i].timerange[j].tid === tid) {
                        row = $.extend({}, data[i].timerange[j]);
                        break;
                    }
                }
                if (row) { break; }
            }

            row.weekDiscription = _this._getWeekRange(row);
            row.timeDiscription = _this._getTime(row);

            data = row.weekday.split(",");
            row.weekday = $.map(data, function (i) { return Number(i); });

            if ($.isFunction(args.success)) {
                args.success(row);
            }
        },

        /**
        * 增加一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeAdding: function (args) {
            var _this, from, data, value, range, i, needlock;

            _this = this;
            needlock = false;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            value = args.value;

            _this.logger.debug("onMajorTimespanSaving", args);

            //取出（联系人与非联系人）的下标
            var targetIndex = [];
            for (i = data.length; i--; ) {
                if (data[i].fromtype === from.CONTACT || data[i].fromtype === from.NOCONTACT) {
                    targetIndex.push(i);
                }
            }

            //无数据时报异常
            if (targetIndex.length == 0) {
                if (args.success) args.success({ code: "ER_NODATA", "range": null, "needlock": needlock });
                return;
            }

            range = data[targetIndex[0]].timerange;
            //判断是否已达到最大时段数
            if (range.length + 1 >= _this.RANGE_LIMIT) {
                needlock = true;
            }

            //判断时段是否重复
            for (i = range.length; i--; ) {
                if (_this._rangecompare(range[i], value)) {
                    if (args.success) args.success({ code: "ER_EXISTS", "range": range[i], "needlock": needlock });
                    return;
                }
            }

            //添加时段
            for (i = targetIndex.length; i--; ) {
                var maxrangeid = _this._maxId($.map(data[targetIndex[i]].timerange, function (j) {
                    return _this._tid(j.tid).rangeindex;
                }));
                _this.logger.debug("maxrangeid", maxrangeid);

                range = {
                    "tid": _this._tid(data[targetIndex[i]].fromtype, targetIndex[i], maxrangeid + 1), //fromtype, notifyindex, rangeindex
                    "begin": value.begin,
                    "end": value.end,
                    "weekday": value.weekday
                };
                range.discription = _this.getTimeRange(range);

                data[targetIndex[i]].timerange.push(range);
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: "S_OK", "range": range, "needlock": needlock });
                }
            });
        },

        /**
        * 删除一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeRemoving: function (args) {
            var _this, from, data, tid, hasRange, needlock, canAdd;

            _this = this;
            from = _this.FROMTYPES;
            tid = _this._tid(args.tid);
            data = _this.get("mailNotify");

            _this.logger.debug("onMajorRangeRemoving", args);

            for (var i = data.length; i--; ) {
                if (data[i].fromtype == from.SOMEONE) {
                    continue;
                }

                for (var j = data[i].timerange.length; j--; ) {
                    if (tid.rangeindex == _this._tid(data[i].timerange[j].tid).rangeindex) {
                        data[i].timerange.splice(j, 1);
                        break;
                    }
                }
            }

            hasRange = $.grep(data, function (i) {
                return i.fromtype === from.CONTACT;
            })[0].timerange;

            needlock = false;
            if (hasRange.length < 2) {
                needlock = true;
            }

            canAdd = false;
            if (hasRange.length < _this.RANGE_LIMIT) {
                canAdd = true;
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: rs.code, "tid": args.tid, "needlock": needlock, "canAdd": canAdd });
                }
            }, true);
        },

        /**
        * 修改一个主时段
        * @param {Object} args 参数表
        */
        onMajorRangeModifing: function (args) {
            var _this, from, data, value, tid, range;

            _this = this;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            value = args.value;
            tid = _this._tid(value.tid);

            _this.logger.debug("onMajorRangeModifing", args);

            //取出（联系人与非联系人）的下标
            var targetIndex = [];
            for (i = data.length; i--; ) {
                if (data[i].fromtype === from.CONTACT || data[i].fromtype === from.NOCONTACT) {
                    targetIndex.push(i);
                }
            }

            //无数据时报异常
            if (targetIndex.length == 0) {
                if (args.success) args.success({ code: "ER_NODATA", "range": null });
                return;
            }

            range = data[targetIndex[0]].timerange;
            //判断是否已达到最大时段数
            if (range.length + 1 >= _this.RANGE_LIMIT) {
                needlock = true;
            }

            //判断时段是否重复
            for (i = range.length; i--; ) {
                if (_this._rangecompare(range[i], value) && range[i].tid != value.tid) {
                    if (args.success) args.success({ code: "ER_EXISTS", "range": range[i] });
                    return;
                }
            }

            //修改时段
            for (i = targetIndex.length; i--; ) {
                for (var j = data[targetIndex[i]].timerange.length; j--; ) {
                    if (tid.rangeindex == _this._tid(data[targetIndex[i]].timerange[j].tid).rangeindex) {
                        range = {
                            "tid": value.tid,
                            "begin": value.begin,
                            "end": value.end,
                            "weekday": value.weekday
                        };
                        range.discription = _this.getTimeRange(range);

                        data[targetIndex[i]].timerange[j] = range;
                        break;
                    }
                }
            }

            _this.trigger("save", function (rs) {
                if (args.success) {
                    args.success({ code: rs.code, "range": range });
                }
            });
        },

        //#endregion //} 主时段操作模块结束

        //#region //{ 例外情况操作模块

        /**
        * 当呈现例外情况列表时，计算需要给出的数据
        * @param {Function} args 参数表
        */
        onExceptlistRendering: function (args) {
            var _this = this;
            var from = _this.FROMTYPES;
            var data = _this.get("mailNotify");
            var pageIndex = _this.get("exceptPage");
            var PAGESIZE = 20;
            if (typeof (pageIndex) == "undefined") {
                pageIndex = 0;
            }

            data = $.grep(data, function (i) {
                return i.fromtype == from.SOMEONE;
            });

            var pagecount = Math.ceil(data.length * 1.0 / PAGESIZE);

            var pagecmd = args.pagecmd;

            if (pagecmd === "next") {
                pageIndex++;
                _this.set({ exceptPage: pageIndex });

            } else if (pagecmd === "last") {
                pageIndex = pagecount - 1;
                _this.set({ exceptPage: pageIndex });

            } else if (pagecmd === "first") {
                _this.set({ exceptPage: 0 });

            } else if (pagecmd === "current") {

            }

            if (pageIndex + 1 > pagecount) {
                //可能是删除例外情况，导致已经翻到最后一页时，页码超出总页数
                pageIndex = pagecount - 1;
            }

            var showmore = false;
            if (pageIndex + 1 < pagecount) {
                showmore = true;
            }

            var excepts = data.slice(0, (pageIndex + 1) * PAGESIZE);
            var viewdata = { "exceptlist": excepts, "pagecount": pagecount, "showmore": showmore };

            args.success(viewdata);
        },

        /**
        * 显示例外详细设置时，计算需要给出的数据
        * @param {Object} args 需要给出的参数
        */
        onExceptDetailRendering: function (args) {
            var _this, data, notifyid;

            _this = this;
            data = _this.get("mailNotify");
            notifyid = args.notifyid;

            _this.logger.debug("show except detail", args, data);

            var value = {};

            for (var i = data.length; i--; ) {
                if (data[i].notifyid === notifyid) {
                    $.extend(value, data[i]);
                }
            }

            var result = {
                "value": value
            };

            if ($.isFunction(args.success)) {
                args.success(result);
            }
        },

        /**
        * 添加邮件地址时，对比数据源是否已有该地址
        * @param {Object} args 需要给出的参数
        */
        onEmailSelecting: function (args) {
            var _this, from, data, list, existMap, i, repeatId;

            _this = this;
            from = _this.FROMTYPES;
            data = _this.get("mailNotify");
            list = args.emaillist;

            _this.logger.debug("onExceptSelecting", args, data);

            existMap = {};
            for (i = data.length; i--; ) {
                for (var j = data[i].emaillist.length; j--; ) {
                    existMap[data[i].emaillist[j]] = data[i].notifyid;
                }
            }

            repeatId = [];
            for (i = list.length; i--; ) {
                for (var j in existMap) {
                    if ($Email.compare(j, list[i])) {
                        repeatId.push(existMap[j]);
                    }
                }
            }

            for (i = list.length; i--; ) {
                for (var j in existMap) {
                    if (/^@.*/.test(list[i]) && list[i] == j) {
                        repeatId.push(existMap[j]);
                    }
                }
            }

            if (repeatId.length > 0) {
                if ($.isFunction(args.error)) {
                    args.error(repeatId);
                }
            } else {
                if ($.isFunction(args.success)) {
                    args.success(repeatId);
                }
            }
        },

        /**
        * 修改某个例外情况的详细设置
        * @param {Object} args 需要给出的参数
        */
        onExceptModifying: function (args) {
            var _this = this;
            var value = args.value;
            var data = _this.get("mailNotify");

            var param = $.extend({}, args.value);

            M.RichMail.API.call("user:modifyMailNotifyExcp", param, function (response) {
                _this.logger.debug("except notify saved", "model.mailnotice.js", 106, response);
                var rs = response.responseData;

                if (rs) {
                    if (rs.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", rs.summary);
                    } else if (rs.code === "S_OK") {
                        if ($.isFunction(args.success)) {
                            args.success({ "success": true, "code": rs.code });
                        }

                        for (var i = data.length; i--; ) {
                            if (data[i].notifyid == value.notifyid) {
                                data[i] = param;
                                break;
                            }
                        }

                        return;
                    }
                }

                if ($.isFunction(args.success)) {
                    args.success({ "success": false, "code": rs.code });
                }
            });
        },

        /**
        * 添加例外情况，并更新数据源
        * @param {Object} args 需要给出的参数
        */
        onExceptAdding: function (args) {
            var _this, data, value, from, tid, hasRange, limit, i, m;

            _this = this;
            data = this.get("mailNotify");
            from = this.FROMTYPES;
            limit = _this.getExceptLimit();
            value = args.value;
            m = 0;

            _this.logger.debug("onExceptAdding", args, data);

            for (var i = data.length; i--; ) {
                if (data[i].fromtype === from.SOMEONE) {
                    m++
                }
            }

            if (m + value.emaillist.length > limit) {
                //不可再添加
                if ($.isFunction(args.success)) {
                    args.success({ "success": false, "code": "ER_OVERFLOW" });
                    return;
                }
            }

            _this.trigger("save", function (rs) { });

            _this.on("fetchsuccess", function (rs) {
                if ($.isFunction(args.success)) {
                    args.success({ "success": true });
                }
            });

            var param = $.extend({}, args.value);
            param.timerange = [param.timerange];

            M.RichMail.API.call("user:addMailNotifyExcp", param, function (response) {
                _this.logger.debug("mailnotify saved", "model.mailnotice.js", 592, response);
                var rs = response.responseData;

                if (rs) {
                    if (rs.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", rs.summary);
                    } else if (rs.code === "S_OK") {
                        _this.trigger("fetch");
                    } else {
                        if ($.isFunction(args.success)) {
                            args.success({ "success": false, "code": rs.code });
                        }
                    }
                }
            });
        },

        /**
        * 添加例外情况后，计算出新添加的数据行
        * @param {Object} args 需要给出的参数
        */
        onExceptAdded: function (args) {
            var _this, data, value, from, i;

            _this = this;
            data = this.get("mailNotify");
            from = this.FROMTYPES;
            value = args.value;

            var hash = {};
            for (i = value.length; i--; ) {
                hash[value[i]] = true;
            }

            var list = $.grep(data, function (i, n) {
                return !!hash[i.emaillist[0]];
            });

            args.success(list);
        },

        /**
        * 删除例外设置时，更新数据源
        * @param {Object} args 需要给出的参数
        */
        onExceptRemoving: function (args) {
            var _this, data, notifyid;

            _this = this;
            data = _this.get("mailNotify");
            notifyid = args.notifyid;

            _this.logger.debug("onExceptRemoving", args, data);

            for (var i = data.length; i--; ) {
                if (data[i].notifyid === notifyid) {
                    data.splice(i, 1);
                    break;
                }
            }

            var param = { "notifyid": args.notifyid };

            _this.trigger("deleting");
            M.RichMail.API.call("user:delMailNotifyExcp", param, function (response) {
                _this.trigger("deleted");
                var rs = response.responseData;
                if (rs && rs.code === "S_OK") {
                    if ($.isFunction(args.success)) {
                        args.success(rs);
                    }
                    return;
                }

                if ($.isFunction(args.error)) {
                    args.error(rs);
                }
                _this.logger.error("remove mailnotify errored", "model.mailnotice.js", 565, response);
            });
        },

        //#endregion //} 例外模块结束

        //#region //{ 数据源操作模块

        /**
        * 格式化中间件数据
        * @param {Object} data
        * @param {Object} onread
        */
        readNotify: function (data, onread) {
            var _this = this;

            $.each(data, function (notifyindex, m) {
            	if(typeof m.syncDy === 'undefined'){ // add by tkh
            		m.syncDy = true;
            	}
            	
                $.each(m.timerange, function (rangeindex, n) {
                    n.discription = _this.getTimeRange(n);
                    n.tid = _this._tid(m.fromtype, notifyindex, rangeindex);
                })
            });

            _this.set("mailNotify", data);

            if ($.isFunction(onread)) {
                onread(data);
            }
        },

        /**
        * 从服务端拉取数据
        * @param {Object} evtHnd
        */
        fetch: function (evtHnd) {
            var _this = this;
            _this.trigger("fetching");

            M.RichMail.API.call("user:getMailNotify", {}, function (response) {
                _this.trigger("fetched");

                if (response.responseData) {
                    if (response.responseData.code === "S_OK") {
                        _this.readNotify(response.responseData["var"], function (rs) {
                            _this.trigger("fetchsuccess", rs);
                        })
                    } else {
                        _this.trigger("fetcherrored", response);
                        _this.logger.error("read mailnotify error", "model.mailnotice.js", 663, response);
                    }
                } else {
                    _this.trigger("fetcherrored", response);
                    _this.logger.error("read mailnotify failed", "model.mailnotice.js", 667, response);
                }
            }, function (error) {
                _this.trigger("fetcherrored", error);
                _this.logger.error("read mailnotify failed", "model.mailnotice.js", 671, error);
            });

            $RM.getAttrs({}, function (response) {
                if (response.code === "S_OK") {
                    response = response["var"];
                    if (response && response["_custom_SmsNotify"]) {
                        _this.set({ popnotify: Number(response["_custom_SmsNotify"]) });
                        _this.trigger("fetched:popnotify", response["_custom_SmsNotify"]);
                    }
                }
            });

        },

        save: function (callback, isdelete) {
            var _this, from, data, value, hasRange, needlock;
            _this = this;
            data = this.get("mailNotify");
            if (isdelete) {
                _this.trigger("deleting");
            } else {
                _this.trigger("saving", data);
            }

            M.RichMail.API.call("user:updateMailNotify", { "mailnotify": data }, function (response) {
                if (isdelete) {
                    _this.trigger("deleted");
                } else {
                    _this.trigger("saved", data);
                }
                _this.logger.debug("mailnotify saved", "model.mailnotice.js", 684, response);

                if (response.responseData) {
                    if (response.responseData.code === "S_FALSE") {
                        _this.trigger("sessiontimeout", response.responseData.summary);
                    }

                    if ($.isFunction(callback)) {
                        callback(response.responseData);
                    }
                    
                    // add by tkh 刷新顶层变量  
	                top.$App.initMainInfoData();
                }
            });

            var popnotify = _this.get("popnotify");
            if (typeof (popnotify) === "undefined") {
                popnotify = 0;
            }

            var param = {
                attrs: {
                    _custom_SmsNotify: Number(popnotify)
                }
            }

            $RM.setAttrs(param, function (response) {
                _this.logger.debug("popnotify saved", "model.mailnotice.js", 783, response);
            });
        },

        //#endregion //} 数据源同步模块

        //#region //{ 时段辅助模块

        _tid: function (tid) {
            if (arguments.length > 1) {
                return (function (fromtype, notifyindex, rangeindex) {
                    return ["tid", fromtype, notifyindex, rangeindex].join("_");
                }).apply(this, arguments);
            }

            tid = tid.split("_");
            return { "fromtype": parseInt(tid[1]), "notifyindex": parseInt(tid[2]), "rangeindex": parseInt(tid[3]) };
        },

        _maxId: function (array) {
            return array.sort(function (a, b) { return b - a })[0];
        },

        _rangecompare: function (range1, range2) {
            return range1.begin === range2.begin && range1.end === range2.end && range1.weekday === range2.weekday;
        },

        _weekmsg: ["每天", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],

        getTimeRange: function (timeRange) {
            return this._getWeekRange(timeRange) + "，" + this._getTime(timeRange); //每天，8:00~21:00
        },

        _getWeekRange: function (timeRange) {
            var weekDay = this._weekmsg;
            var result = "1234567";

            var week = timeRange.weekday || timeRange;

            var arrWeek = week.split(',');


            if (week && typeof (week) == "string") {
                week = week.replace(/[^\d]/g, "");

                if (week == result) { //每天
                    week = [];
                    result = weekDay[0];
                } else if (week.length >= 3 && result.indexOf(week) > -1) {
                    //表示有三个连续星期几
                    result = weekDay[arrWeek[0]] + "至" + weekDay[arrWeek[arrWeek.length - 1]];
                    week = "";
                } else {
                    result = [];
                    for (var i = 0; i < arrWeek.length; i++) {
                        var index = arrWeek[i];
                        result.push(weekDay[index]);
                    }
                    result = result.join("，");
                }
            }
            return result; //转化成可读的日期格式
        },

        _getTime: function (timeRange) {
            var desc = ":00 ~ " + timeRange.end + ":00";
            if (typeof (timeRange.begin) == "undefined") {
                desc = timeRange.start + desc;
            } else {
                desc = timeRange.begin + desc;
            }
            return desc;
        }

        //#endregion //} 时段辅助模块结束

    })
    )
})(jQuery, _, M139);