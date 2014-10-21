

(function (jQuery, _, M139, top) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    //#region MainView
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.View', superClass.extend({
        configData:{
            SUCC_TIP:"添加成功"
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.View();
         *
         *
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({}, options);
            _this.options = options;
            _this.model = new M2012.Calendar.Popup.BabyTemplet.Model(options);

            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this=this;
            var step1 = new M2012.Calendar.Popup.BabyTemplet.Step1.View({
                callback: function (data) { _this.step1Callback(data); }
            });
        },
        initEvents: function () {
            var _this = this;
            var model = this.model;

            model.on("change:step2", function () {
                new M2012.Calendar.Popup.BabyTemplet.Step2.View({
                    model: model,
                    callback: function (data) { _this.step2Callback(data); }
                });
            });
        },
        step1Callback: function (data) {
            var _this = this;
            var model = _this.model;
            if (data) {
                model.set("name", data.name);
                model.set("birthday", data.birthday);
                model.trigger("change:step2");
            }
        },
        step2Callback: function (data) {
            var _this = this;
            top.M139.UI.TipMessage.show(_this.configData.SUCC_TIP, { delay: 3000 });

            //TODO 迟早会在四大视图加上去的
            //M139.Calendar.trigger("reload");
        }
    }));
    //#endregion

    //#region Step1View
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.Step1.View', superClass.extend({
        template: {
            MAIN: ['<div class="repeattips-box">',
 					    '<p class="lightGray pt_20">0-7岁宝宝防疫接种提醒 , 帮您呵护宝宝健康成长...</p>',
 					    '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>宝宝姓名：</span>',
                            '<div class="fl">',
                                '<div id="{cid}_nameTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝姓名不能为空</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<div id="{cid}_maxTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝姓名不能超过{maxTitleLen}个字</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<input id="{cid}_name" type="text" name="" class="iText w228" />',
                            '</div>',
                        '</div>',
 					    '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>出生日期：</span>',
                            '<div id="{cid}_datepicker" class="dropDown w238">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div id="{cid}_dateTip" class="tips meet-tips hide">',
                                    '<div class="tips-text">宝宝防疫，只适合提供给1-7岁的宝宝做参考，您的宝宝已超过该岁数范围，请重新设置</div>',
                                    '<div class="tipsBottom diamond"></div>',
                                '</div>',
                                '<div id="{cid}_birthday" class="dropDownText">2014-1-31</div>',
                            '</div>',
                        '</div>',
                    '</div>'].join("")
        },
        configData:{
            MAX_TITLE_LEN: 20,
            dialogTitle: "宝宝防疫提醒"
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.Step1.View({
         *     name:"小宝宝",
         *     birthday: new Date(),
         *     callback:function(data){
         *         console.log(data); //{name:'小宝宝',birthday: Date}
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({ name: '', birthday: new Date(), callback: $.noop }, options);
            _this.options = options;
            _this.render();
            _this.initEvents();
        },
        render: function () {
            var _this = this,
                options = _this.options,
                dialog = _this.dialog;

            var html = $T.format(_this.template.MAIN, { cid: _this.cid, maxTitleLen: _this.configData.MAX_TITLE_LEN });
            _this.dialog = $Msg.showHTML(html, function (e) {
                e.cancel = true;
                _this.onNextClick(e);
            }, function () {
                //_this.onCancelClick(); //暂不需要取消的回调
            }, {
                dialogTitle: _this.configData.dialogTitle,
                buttons: ["下一步", "取消"],
                onClose: function (e) {
                    _this.datePicker && _this.datePicker.hide();
                }
            });

            //#region 填充数据
            if (options.name) {
                _this.findElement("name").val(options.name);
            }

            var birthday = options.birthday;
            _this.setBirthday(birthday);
            //#endregion
        },
        initEvents:function(){
            var _this = this,
                dialog = _this.dialog;

            _this.birthdayContainer = _this.findElement("datepicker");
            _this.dateTip = _this.findElement("dateTip");
            _this.nameTip = _this.findElement("nameTip");
            _this.maxTip = _this.findElement("maxTip");

            _this.birthdayContainer.unbind("click").bind("click", function () {
                var date = _this.options.birthday;
                _this.datePicker = new M2012.Calendar.CalendarView({
                    date2StringPattern: 'yyyy-MM-dd',
                    id: _this.cid + '_datepicker',
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDay(),
                    callback: function (date) {
                        var checkDate = new Date(date.getTime());
                        checkDate.setFullYear(checkDate.getFullYear() + 7); //最多可以设置7年的提醒
                        if (checkDate < new Date) {
                            _this.dateTip.removeClass("hide");
                            return;
                        }
                        _this.setBirthday(date);
                    }
                });
            });

            dialog.$el.unbind("click").bind("click", function () {
                _this.dateTip.addClass("hide");
                _this.nameTip.addClass("hide");
                _this.maxTip.addClass("hide");
            });

            _this.input = _this.findElement("name");
            _this.input.unbind("keyup").bind("keyup", function () {
                var text = $(this).val();
                if (text.length > _this.configData.MAX_TITLE_LEN) {
                    $(this).val(text.substr(0, _this.configData.MAX_TITLE_LEN));
                    _this.maxTip.removeClass("hide");

                    //定时隐藏
                    if (_this.timer) { clearTimeout(_this.timer); _this.timer = null; } //防止重复
                    _this.timer=setTimeout(function () {
                        _this.maxTip.addClass("hide");
                    },3000)
                }
            })

            _this.dateTip.css("margin-top", "-50px"); //修正一下位置
        },
        onNextClick: function (e) {
            var _this = this;
            var babyName = _this.findElement("name").val().replace(/\s/g,'');
            if (!!babyName) {
                e.cancel = false;
                _this.options.callback({ name: babyName, birthday: _this.options.birthday });
                _this.dialog.close();
            } else {
                _this.showEmptyTip();
            }
        },
        onCancelClick: function () {
            this.options.callback();
        },
        showEmptyTip: function () {
            var _this=this;
            var tip = _this.findElement("nameTip"); //#cid_nameTip
            tip.removeClass("hide");

            var txtInput = _this.findElement("name");
            txtInput.unbind("focus").bind("focus", function () {
                tip.addClass("hide");
                txtInput.unbind("focus");
            });
        },
        setBirthday: function (date) {
            var _this = this;
            if (date && $.type(date) == 'date') {
                _this.findElement("birthday").html(M139.Date.format("yyyy-MM-dd", date));
                _this.options.birthday = date;
            }
        },
        findElement: function (name) {
            var _this = this;
            var ctl = _this.dialog.$el.find("#" + _this.cid + "_" + name); //#cid_name
            return ctl;
        }
    }));
    //#endregion

    //#region Step2View
    M139.namespace('M2012.Calendar.Popup.BabyTemplet.Step2.View', superClass.extend({
        template:{
            MAIN: ['<div class="repeattips-box">',
                        '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>宝宝：</span>',
                            //name
                            '<span class="repeattipsCon">{name}</span>',
                            '<span>生日：</span>',
                            //birthday
                            '<span>{birthday}</span>',
                        '</div>',
                        '<div class="pt_10 repeattips-bottom clearfix">',
                            '<span>提醒：</span>',
                            '<div id="{cid}_beforeday" class="dropDown w108">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div class="dropDownText">提前一天</div>',
                            '</div>',
                            '<div id="{cid}_type" class="dropDown w108">',
                                '<a class="dropDownA" href="javascript:void(0);"><i class="i_triangle_d"></i></a>',
                                '<div class="dropDownText">免费短信提醒</div>',
                            '</div>',
                        '</div>',
                        '<p class="lightGray pt_20">国家规定0-7岁儿童的基础免疫接种项目,仅做参考，详情请咨询当地保健部门。</p>',
                        '<div class="boxIframeTableScroll mt_10">',
                            '<table class="boxIframeTable">',
                                '<thead>',
                                    '<tr>',
                                        '<th width="18">',
                                            //请至少勾选一项
                                            '<div id="{cid}_checkboxTip" style="left:16px;top:90px; _width:90px;" class="tips hide">',
						                        '<div class="tips-text">请至少勾选一项</div>',
						                        '<div class="tipsBottom  diamond"></div>',
					                        '</div>',
                                            '<input id="{cid}_selectall" type="checkbox">',
                                        '</th>',
                                        '<th width="88">时间</th>',
                                        '<th width="271 ">疫苗</th>',
                                    '</tr>',
                                '</thead>',
                                '<tbody>',
                                    //tbody
                                    '{tbody}',
                                '</tbody>',
                            '</table>',
                        '</div>',
                        '<div id="{cid}_captcha" class="pt_10 repeattips-bottom clearfix hide"></div>',
                    '</div>'].join(""),
            TR: ['<tr>',
 					'<td><input type="checkbox" data-index="{index}" class="item_checkbox {className}" {attrName}></td>',
 					'<td class="{className}">{nextDate}{nextTime}</td>',
 					'<td class="{className}">',
 						'<ul class="boxIframeTableList">',
 							'{desc}',
 						'</ul>',
 					'</td>',
 				'</tr>'].join("")
        },
        configData:{
            beforeTypes: [
                {
                    type: 1,
                    text: '提前一天'
                }
            ],
            remindTypes: [
                {
                    type: 1,
                    text: '免费短信提醒'
                }
            ],
            listType: {
                checkable: {
                    attrName: "",
                    className:"selectable"
                },
                uncheckable: {
                    attrName: "disabled",
                    className: "whiteGray"
                }
            },
            errorCode: {
                IDENTITY: 910,
                OVER_LIMIT:911
            },
            messages: {
                OVER_LIMIT: "您添加太频繁了，请稍后再试"
            },
            dialogTitle: '宝宝防疫提醒'
        },
        /**
         * 宝宝防疫模板
         * @example
         * new M2012.Calendar.Popup.BabyTemplet.Step2.View({
         *     model:model, //M2012.Calendar.Popup.BabyTemplet.Model
         *     callback:function(data){
         *         console.log(data); //{name:'小宝宝',birthday: Date}
         *     }
         * });
         */
        initialize: function (options) {
            var _this = this;
            options = $.extend({}, options);
            if (options.model) {
                _this.model = options.model;
                _this.callback = options.callback || $.noop;
                _this.selectItems = {};
                _this.render();
                _this.initEvents();
            } else {
                //参数错误，不显示弹窗
            }
        },
        render: function () {
            var _this = this;
            
            _this.dialog = $Msg.showHTML(_this.getHtml(), function (e) {
                _this.onSaveClick(e);
            }, function () {
                _this.closeControl();
            }, {
                dialogTitle: _this.configData.dialogTitle,
                buttons: ["保存", "取消"],
                width: "530px",
                onClose: function (e) {
                    _this.closeControl();
                }
            })
        },
        initEvents: function () {
            var _this = this,
                model = _this.model,
                dialog = _this.dialog;

            //提前时间下拉菜单
            dialog.dropmenuDays = _this.getElement("beforeday");
            var dayItems = [];
            var dayText="零一二三四五六七八九十"
            for (var i = 1; i < 11; i++) {
                dayItems.push({
                    text: "提前" + dayText.substr(i, 1) + "天",
                    beforeTime: i
                });
            }

            dialog.dropmenuDays.off("click").on("click", function () {
                _this.dayMenu=new M2012.Calendar.View.CalendarPopMenu().create({
                    width: dialog.dropmenuDays.width(), //去掉padding的2px 
                    items: dayItems,
                    dockElement: dialog.dropmenuDays,
                    onItemClick: function (data) {
                        //
                        _this.model.set("beforeTime", data.beforeTime);
                        dialog.dropmenuDays.find(".dropDownText").html(data.text);
                    }
                });
            });
            //end

            //提醒类型下拉
            dialog.dropmenuTypes = _this.getElement("type");
            dialog.dropmenuTypes.off("click").on("click", function () {
                _this.typeMenu = new M2012.Calendar.View.CalendarPopMenu().create({
                    width: dialog.dropmenuTypes.width(), //去掉padding的2px 
                    items: [
                        {
                            text: '免费邮件提醒',
                            config: {
                                recMyEmail: 1,
                                recMySms: 0
                            }
                        },
                        {
                            text: '免费短信提醒',
                            config: {
                                recMyEmail: 0,
                                recMySms: 1
                            }
                        }
                    ],
                    dockElement: dialog.dropmenuTypes,
                    onItemClick: function (data) {
                        var config = data.config;
                        for (var key in config) {
                            _this.model.set(key, config[key]);
                        }
                        dialog.dropmenuTypes.find(".dropDownText").html(data.text);
                    }
                });
            });
            //end


            //宝宝防疫 列表
            dialog.checkboxTip = _this.getElement("checkboxTip");
            dialog.selectAll = _this.getElement("selectall");

            dialog.checkbox = dialog.$el.find("input.selectable"); //可选择的checkbox
            dialog.selectAll.unbind("click").bind("click", function () {
                var checked = !!$(this).attr("checked");
                dialog.checkbox.attr("checked", checked);

                _this.selectItems = []; //清空选中的列表
                if (checked) {
                    //全选
                    _this.selectItems = _.clone(_this.itemsData);
                }
            });

            dialog.checkbox.unbind("click").bind("click", function () {
                var checked = $(this).attr("checked");
                var index = $(this).data('index');
                if (!!checked) {
                    _this.selectItems[index] = _this.itemsData[index];
                } else {
                    delete _this.selectItems[index];
                }
            });

            dialog.$el.unbind("click").bind("click", function () {
                dialog.checkboxTip.addClass("hide");
            });
            //end

            dialog.captchaContainer = _this.getElement("captcha");

            try {
                //至少看到标题栏，这样起码可以关掉弹窗
                setTimeout(function () {
                    var top = parseInt(dialog.$el.css("top"));
                    if (top < 0) {
                        dialog.$el.css("top", 5);
                    }
                }, 150);
            } catch (e) { }
        },
        getHtml:function(){
            var _this = this,
                model = _this.model,
                listType = _this.configData.listType,
                TR = _this.template.TR;

            var name = model.get("name");
            var birthday = model.get("birthday");
            var listData = model.get("listData");

            var listHtml = '';
            var dateNow = new Date();
            var itemsData = {};
            for (var i = 0, len = listData.length; i < len; i++) {
                var item = listData[i];

                //判断是否已经过期
                var tmpDate = new Date(birthday.getTime());
                tmpDate.setDate(tmpDate.getDate() + item.afterDays);
                tmpDate.setMonth(tmpDate.getMonth() + item.afterMonths);
                tmpDate.setFullYear(tmpDate.getFullYear() + item.afterYears);
                //end

                item.nextDate = tmpDate;
                var obj = listType.checkable;
                if (tmpDate <= dateNow) { //过去的时间，不给选
                    obj = listType.uncheckable;
                } else {
                    //可选择的,将数据保存下来,以便全选时直接赋值,减少遍历
                    itemsData[item.index] = $.extend({}, item);
                }

                listHtml += $T.format(TR, {
                    attrName: obj.attrName,
                    className: obj.className,
                    nextDate: M139.Date.format("yyyy年MM月dd日", item.nextDate),
                    index: item.index,
                    nextTime: item.timeTip || '',
                    desc: item.desc || ''
                });
            }
            _this.itemsData = itemsData;

            var html = $T.format(_this.template.MAIN, {
                cid: _this.cid,
                name: $T.Html.encode(name),
                birthday: M139.Date.format("yyyy-MM-dd", birthday),
                tbody: listHtml
            });
            return html;
        },
        onSaveClick: function (e) {
            e.cancel = true;

            var _this = this;
            if (_this.busy) return;

            _this.busy = true;
            if (_.keys(_this.selectItems).length > 0) {
                if (_this.validation) {
                    var code = _this.captcha && _this.captcha.getData();
                    if (code) {
                        _this.model.set("validImg", code); //有填写验证码
                    } else {
                        _this.captcha.show({ refresh: true });
                    }
                }
                _this.model.set("items", _this.selectItems);
                _this.model.addBabyData(function (data, json) {
                    //保存成功,显示Tip和刷新数据
                    _this.busy = false;

                    _this.callback(json);

                    // 添加行为日志
                    window.$Cal && window.$Cal.capi.addBehavior("calendar_addbabyact_success");
                    _this.dialog.close();
                }, function (code,json) {
                    //主要用于判断是否要显示验证码
                    _this.busy = false;

                    var errorCode = _this.configData.errorCode;
                    switch (code) {
                        case errorCode.IDENTITY:
                            if (!_this.captcha) {
                                _this.captcha = new M2012.Calendar.UI.Captcha.View({
                                    target: _this.dialog.captchaContainer
                                });
                                _this.validation = true;
                            } else {
                                _this.captcha.show();
                            }
                            break;
                        case errorCode.OVER_LIMIT:
                            $Msg.alert(_this.configData.messages.OVER_LIMIT);
                            break;
                        default:
                            break;
                    }
                })
            } else {
                //显示提示
                _this.dialog.checkboxTip.removeClass("hide");
            }
        },
        closeControl:function(){
            var _this = this;
            _this.dayMenu && _this.dayMenu.remove && _this.dayMenu.remove();
            _this.typeMenu && _this.typeMenu.remove && _this.typeMenu.remove();
        },
        getElement: function (name) {
            var _this = this,
                cid = _this.cid;
            var elem = _this.dialog.$el.find("#" + cid + "_" + name);
            return elem;
        }
    }));
    //#endregion

    window.$Cal.on("show:AddBaby", function () {
        new M2012.Calendar.Popup.BabyTemplet.View({
            master : window.$Cal
        });
    });

})(jQuery, _, M139, window._top || window.top);