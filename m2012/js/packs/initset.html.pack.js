(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.View.Birthday', superClass.extend({
        messages:{
            DATE_NOT_ALLOW:"生日选择不能超过今天，请重新选择"
        },
        options: {
            from: "1910",   //起始年份
            to: new Date().getFullYear(),     //结束年份
            orderby: "asc",
            check:true      //检查日期是否超过今天
        },
        templete: ['<div id="year_{rnd}"></div>',
                    '<div id="month_{rnd}"></div>',
                    '<div id="day_{rnd}"></div>']
                    .join(""),
        /*
            日期选择控件,目前长度是固定的
            options={
                container:$("#div"),
                date:"2012-10-30", //默认日期，目前仅支持此格式
                from:1990, //最小的年份
                to:2012,  //最大的年份
                type:"asc", //年份排序，升序(asc)还是倒序(desc)
                check:true
            }
        */
        initialize: function (options) {
            this.model = new Backbone.Model();
            this.$el = options.container || $(document);
            /*
            if (options.date) { //如果有初始时间，则保存初始时间，在初始化之后设置
                var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
                var m = options.date.match(reg);
                if (m && m.length == 4) {
                    options = $.extend(options, {
                        year: parseInt(m[1], 10),
                        month: parseInt(m[2], 10),
                        day: parseInt(m[3], 10)
                    });

                    this.model.set({
                        year: options.year,
                        month: options.month,
                        day: options.day
                    });
                }
            }
            */
            this.setDate(options.date, false);
            this.options = $.extend(this.options, options); //保存
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var This = this;
            var model = This.model;

            var rnd = Math.random().toString().replace(".", "");
            var html = $T.Utils.format(This.templete, { "rnd": rnd }); //替换ID
            This.$el.append(html); //添加到页面中

            This.year = $("#year_" + rnd, This.$el);
            This.month = $("#month_" + rnd, This.$el);
            This.day = $("#day_" + rnd, This.$el);

            //创建年，月，日的3个下拉框
            This._createYearMenu(model.get("year"));
            This._createMonthMenu(model.get("month"));
            This._createDayMenu(model.get("day"));

            model.on("change:year", function () {
                var year = model.get("year");
                This._onYearChange(year);
            });
            model.on("change:month", function () {
                var month = model.get("month");
                This._onMonthChange(month);
            });

            //触发,设置默认日期。先触发日期，最后触发月份
            //以解决日期不正确的问题（2012-02-31最后会被设置并显示2012-02-29）
            this.model.trigger("change:day");
            this.model.trigger("change:year");
            this.model.trigger("change:month");
        },
        setDate: function (date,isSet) {
            if (!date) return;
            isSet = isSet || false;

            var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
            var m = date.match(reg);
            if (m && m.length == 4) {
                var This = this;
                var options = {
                    year: parseInt(m[1], 10),
                    month: parseInt(m[2], 10),
                    day: parseInt(m[3], 10)
                };

                This.model.set(options);

                return;
                if (isSet) {
                    try{
                        This.yearMenu.setText(options.year);
                        This.monthMenu.setText(options.month);
                        This.dayMenu.setText(options.day);
                    }
                    catch (e) { }
                }
            }
        },
        _createYearMenu: function (defaultYear) {
            var This = this;
            var options = This.options;
            var yearObj = [];

            for (var i = options.from; i <= options.to; i++) {
                var obj = {
                    text: i,
                    value: i
                };
                yearObj.push(obj);
            }

            if (options.orderby && options.orderby.toLowerCase() == "desc") {
                yearObj = yearObj.sort(function (a, b) {
                    return b.value - a.value; //倒序
                });
            }

            defaultYear = defaultYear || "年";
            This.yearMenu = new M2012.UI.DropMenu.create({
                container: This.year,
                defaultText: defaultYear, //默认显示“年”字
                menuItems: yearObj,
                customClass: "setyearPop"
            });
            This.yearMenu.on("change", function (item) {
                This.model.set("year", item.value);
				This.trigger("ymdchange");
            });

            This.year.find(".dropDown").addClass("dropDown-year"); //加上年的class
        },
        _createMonthMenu: function (defaultMonth) {
            var This = this;
            var options = This.options;
            var monthObj = [];

            for (var i = 1; i <= 12; i++) {
                monthObj.push({
                    text: i,
                    value: i
                });
            }
            defaultMonth = defaultMonth || "月";
            This.monthMenu = new M2012.UI.DropMenu.create({
                container: This.month,
                defaultText: defaultMonth,
                menuItems: monthObj,
                customClass: "setmonthPop"
            });
            This.monthMenu.on("change", function (item) {
                This.model.set("month", item.value);
				This.trigger("ymdchange");
            });

            This.month.find(".dropDown").addClass("dropDown-month");
        },
        _createDayMenu: function (maxDay, defaultDay) {
            maxDay = maxDay || 31; //默认31天
            var This = this;
            var options = This.options;
            var dayObj = [];

            for (var i = 1; i <= maxDay; i++) {
                dayObj.push({
                    text: i,
                    value: i
                });
            }
            var defaultDay = defaultDay || "日";
            This.dayMenu = new M2012.UI.DropMenu.create({
                container: This.day,
                defaultText: defaultDay,
                menuItems: dayObj,
                customClass: "setdayPop"
            });
            This.dayMenu.on("change", function (item) {
                This.model.set("day", item.value);
				This.trigger("ymdchange");
            });

            This.day.find(".dropDown").addClass("dropDown-day");
        },
        _onYearChange: function (year) {
            var This = this;
            //This.model.set("year", year);
            This.yearMenu.setText(year);
            var month = This.model.get("month");
            if (month) { //未设置月份时，不修改
                This._onMonthChange(month); //触发月份选择，由月份去触发日期选择判断
            }
        },
        _onMonthChange: function (month) {
            var This = this;
            //This.model.set("month", month);
            This.monthMenu.setText(month);
            var date = "{year}-{month}-01 00:00:00"; //为了兼容M139.Date.parse(str)方法
            var dateObj = {
                "year": This.model.get("year") || 2000, //取2000年为闰年，2月有29天
                "month": month || 1                     //取1月，在未设置任何日期之前，日部分可选择31天
            };

            date = $T.Utils.format(date, dateObj); //格式化
            var datetime = $Date.parse(date); //转换
            var maxDay = $Date.getDaysOfMonth(datetime); //获取该月的最大天数，如闰年2月有29天
            var day = This.model.get("day");
            if (day) { //未设置日期时，不做修改
                day = maxDay >= day ? day : maxDay; //判断天数是否大于最大天数，取有效值
                This.model.set("day", day); //设置保存为该月最大的天数
            }
            This._createDayMenu(maxDay, day);
        },
        
        //个位数前辍 0 
        numFix: "0000000000".split('').concat(",,,,,,,,,,,,,,,,,,,,,".split(",")),

        toLongDate: function(year, month, day){
            var longDate = $T.format("{year}-{month}-{day}", {
                "year": year,
                "month": this.numFix[month] + month,
                "day": this.numFix[day] + day
            });
            return longDate;
        },

        /**
            公共方法，获取设置的日期
        */
        getDate: function () {
            //默认返回"年-月-日"格式
            var This = this;

            var model = This.model;
            var checkDate = This.options.check;
            var strDate = null;

            if (model.has("year") && model.has("month") && model.has("day")) { //判断值
                
                var year = model.get("year"),
                    month = model.get("month"),
                    day = model.get("day");

                if (checkDate) {
                    var userDate = new Date(year, month - 1, day);
                    if (userDate && userDate < new Date()) {
                        
                    } else {
                        top.$Msg.alert(this.messages.DATE_NOT_ALLOW);
                        return strDate;
                    }
                }

                strDate = This.toLongDate(year, month, day);
            }

            return strDate
        }
    })
    );

    $.extend(M2012.Settings.View.Birthday, {
        //*
        create: function (options) {
            if (options && options.container) {
                var datePicker = new M2012.Settings.View.Birthday(options);
                return datePicker;
            } else {
                throw "M2012.Settings.View.Birthday参数不合法:"
                        + JSON.stringify(options);
            }
        }
        //*/
    });
})(jQuery, _, M139);
/**
* @fileOverview 定义设置页基本参数的文件.
*/


    (function (jQuery, _, M139) {
        /**
        *@namespace 
        *设置页基本参数
        */
        M139.namespace('M2012.Settings.Initset.Model', Backbone.Model.extend(
        /**
        *@lends M2012.Settings.Initset.Model.prototype
        */
    {
    defaults: {
        sex: 0,
        configColumns: []
    },
    callApi: M139.RichMail.API.call,
    getUserinfo: function (callback) {
        this.callApi("guide:getUserinfo", {}, function (result) {
            if (callback) { callback(result.responseData); }
        });
    },
    getPhotoUploadUrl: function () { //获取上传地址，测试环境与生产环境不同，加了nginx代理
        var url = "/setting/s?func=guide:setUserpic&sid=" + sid;
        if (document.domain == "10086.cn") {
            url=top.getDomain("rebuildDomain")+url;
        }
        return url;
    },
    gotoMail: function () {
        location.href = domainList.global.mail+"/login/sso.aspx?sid="+sid;

    },
    serverCheckAlias: function (alias, callback) {
        var data = { "alias": alias };
        M139.RichMail.API.call("user:checkAliasAction", data, function (response) {
            callback(response.responseData);
        });
    },
    clientCheckStr: function (text) {
        var message = this.messages.cantEdit;
        var resultCode = 0;
        console.log($.trim(text)=="")
        if ($.trim(text) == "") {
            message = this.messages.aliasStrLength; //空是允许的
            resultCode = 0;
        }
        else if (/\s/.test(text) ||                 //空格
                /[^A-Za-z0-9_\-\.]/.test(text)) {  //其他字符
            message = this.messages.aliasStrRange;
            resultCode = 1;
        }
        else if (/^[^A-Za-z]\w*/.test(text)) {
            message = this.messages.aliasEnStart; //开头非字母
            resultCode = 2;
        }
        else if (text.length < 5 || text.length > 15) {
            message = this.messages.aliasStrLength;
            resultCode = 3;
        }
        if (resultCode == 0) {
            return { code: "S_OK", msg: message, resultCode: resultCode };
        }
        else {
            return { code: "FA_FALSE", msg: message, resultCode: resultCode };
        };
    },
    setUserinfo: function (options, callback) {
        this.callApi("guide:setUserinfo", options, function (result) {
            if (callback) { callback(result.responseData); }
        });
    },
    messages: {
        saveSuccess: "您的设置已保存",
        saveError: "服务器繁忙，请稍后再试",
        aliasCanUse: "保护我的手机隐私",
        aliasStrRange: "别名支持字符范围：0~9,a~z,“.”,“_”,“-”",
        aliasEnStart: "必须以英文字母开头",
        aliasStrLength: "别名帐号为5-15个字符，以英文字母开头",
        sendNameError: "让发件人知道我是谁",
        picFormatError: "头像上传失败，支持小于1M的jpg、jpeg、gif、bmp、png图片",
        cantEdit: "只能设置一次，保存后不能修改",
        defaultAlias: "例:bieming"
    }
}))
    })(jQuery, _, M139);
/**
* @fileOverview 定义新手上路的文件.
*/
/**
*@namespace 
*新手上路
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Settings.Initset.View', superClass.extend(
    /**
    *@lends SpamView.prototype
    */
        {
        initialize: function () {
            this.model = new M2012.Settings.Initset.Model();
            this.birthday = $("#getBirthday"); //生日
            this.btnSave = $("#btnSave"); //保存并进入邮件
            this.mailAlias = $("#mailAlias"); //别名
            this.sendName = $("#sendName"); //发件人姓名
            this.skipStep = $("#skipStep"); //直接进入邮箱
            this.initSex = $("#initSex"); //性别
            this.ininImg = $("#ininImg"); //头像
            this.rssRead = $("#rssRead"); //订阅
            this.photoart = $("#photoart");
            this.successTips = $("#successTips");
            this.upPhoto = document.forms["upphoto"];
            this.birthWarning = $("#birthWarning");
            this.initColumns = $("#initColumns");
            this.loadImages = $("#loadImages");
            this.httpimgload = "/g2/addr/apiserver/httpimgload.ashx?sid=";
            this.datePicker = null;
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function () {
            var self = this;
            this.getUserinfo();
            this.getBirthday();
            this.initEvents();
            return superClass.prototype.render.apply(this, arguments);
        },
        getColumnData: function (column) {//拼装订阅的html，input默认勾选。返回组装的html和id数组
            var columnLen = column.length;
            var idArr = [];
            var htmlArr = [];
            for (var i = 0; i < columnLen; i++) {
                var id = column[i].id;
                var html = '<input checked type="checkbox" id="rss' + id + '" data-id="' + id + '"><label for="rss' + id + '">' + column[i].name + '</label>';
                idArr.push(id);
                htmlArr.push(html);
            }
            html = htmlArr.join("");
            var obj = {
                html: html,
                idArr: idArr
            }
            return obj;
        },
        setFace: function () {
            var self = this;
            this.photoart.change(function () {
                var fileName = $(this).val();
                //检查文件是不是图片
                if (!/\.(?:jpg|jpeg|gif|png|bmp)$/i.test(fileName)) {
                    top.$Msg.alert(self.model.messages.picFormatError);
                    self.upPhoto.reset();
                    return;
                }
                upphoto.submit();
            });
        },
        getUserinfo: function () {//获取接口返回的数据，把数据保存到model里，填充页面上的初始数据
            var self = this;
            this.model.getUserinfo(function (result) {
                if (result.code == "S_OK") {
                    var data = result["var"];
                    var src = data.imgUrl;
                    var birthday = data.birthday;
                    var dropDownText = self.birthday.find(".dropDownText");
                    var column = data.configColumns;
                    var columnData = self.getColumnData(column);
                    var year = "", month = "", day = "";
                    src = self.httpimgload + sid + "&path=" + $T.Html.encode(src);
                    src = M139.HttpRouter.getNoProxyUrl(src);
                    self.mailAlias.val(data.alias);

                    if (data.alias != "") {
                        self.mailAlias.attr("disabled", true);
                        self.mailAlias.prev().prev().css("background", "#ebebe4");
                    } else {
                        self.mailAlias.val(self.model.messages.defaultAlias).addClass("gray");
                    }

                    self.ininImg.attr("src", src);
                    self.sendName.val(data.addressorName);
                    self.initSex.find("input[data-sex=" + data.sex + "]").attr("checked", true);
                    self.upPhoto.action = self.model.getPhotoUploadUrl();//"/setting/s?func=guide:setUserpic&sid=" + sid;

                    if (data.birthday != "") {
                        var initBirth = birthday.split("-");
                        year = initBirth[0];
                        month = initBirth[1];
                        day = initBirth[2];
                        var json = {
                            "0": year,
                            "1": month,
                            "2": day
                        };
                        dropDownText.each(function (i, obj) {
                            dropDownText.eq(i).text(json[i]);
                        });
                    }

                    self.rssRead.after(columnData.html);
                    self.model.set({
                        sex: data.sex,
                        configColumns: columnData.idArr.join(","),
                        imgUrl: data.imgUrl
                    });

                };
            });
        },
        getBirthday: function () {//生日组件
            var self = this;
            self.datePicker = new M2012.Settings.View.Birthday({
                container: self.birthday,
                orderby: "desc",
                check: true
            });
            console.log(self.datePicker)
        },
        saveData: function () {//保存后进入邮箱
            var self = this;
            this.btnSave.click(function () {
                var status = $(this).hasClass("i_gray_btn");
                if (!status) {
                    self.setUserinfo();
                }
            })
        },
        skipToMail: function () {//跳过直接进入邮箱
            var self = this;
            this.skipStep.click(function () {
                self.model.gotoMail();
            })
        },
        checkData: function (obj) {//检查别名和发件人姓名格式
            var self = this;
            var text = obj.inputEl.val();
            var clientResult = self.model.clientCheckStr(text);
            var code = obj.type == "alias" ? clientResult.code != "S_OK" : clientResult.resultCode == 1;

            if (code) {
                $("#" + obj.tipsEl).addClass("red").html(clientResult.msg);
                this.btnSave.addClass("i_gray_btn");
            } else {
                $("#" + obj.tipsEl).html(clientResult.msg);
                this.btnSave.removeClass("i_gray_btn");
            }
        },
        checkAlias: function () {//即时触发别名验证
            var self = this;
			this.mailAlias.addClass("gray");//默认为灰
            this.mailAlias.focus(function () {
				
                var alias = $(this).val();
                if (alias == self.model.messages.defaultAlias) {
                    $(this).val("");
                }
                if ($(this).val() == "") {
                    $("#aliasTip").addClass("red").html(self.model.messages.aliasStrLength);
                }
            });

            this.mailAlias.keyup(function () {
                $(this).removeClass("gray");
                var obj = {
                    type: "alias",
                    tipsEl: "aliasTip",
                    inputEl: $(this)
                }
                self.checkData(obj);
            });

            this.mailAlias.blur(function () {
                var alias = self.mailAlias.val();
                if (alias == "") {
                    $(this).val(self.model.messages.defaultAlias);
                    $(this).addClass("gray");
                    return
                }
                self.model.serverCheckAlias(alias, function (result) {
                    console.log(result)
                });
            });
        },
        checkSendName: function () {//即时触发发件人姓名验证
            var self = this;
            this.sendName.keyup(function () {
                var obj = {
                    type: "sendname",
                    tipsEl: "sendNameTip",
                    inputEl: $(this)
                }
                self.checkData(obj);
            });
        },
        setUserinfo: function () {//设置个人信息
            var self = this;
            var year = self.datePicker.year.text();
            var month = self.datePicker.month.text();
            var day = self.datePicker.day.text();
            month = parseInt(month) < 10 && month.length < 2 ? "0" + month : month;
            day = parseInt(day) < 10 && day.length < 2 ? "0" + day : day;
            var birthday = year + month + day;
            birthday = birthday == "年月日" ? "" : birthday;
            var sex = this.model.get("sex");
            var configColumns = this.setColumns();
            var alias = this.mailAlias.val();
            var addressorName = this.sendName.val();
            var imgUrl = "";

            if (birthday.length != 8 && birthday != "") {//正确的日期格式：20120314
                self.birthWarning.removeClass("hide");
                return;
            }
            alias = alias.trim(); //去除别名前后空格
            var options = {
                alias: alias,
                addressorName: addressorName,
                birthday: birthday,
                sex: sex,
                columnIds: configColumns,
                imgUrl: imgUrl
            };
            this.model.setUserinfo(options, function (result) {

                if (result.code == "S_OK") {
                    self.successTips.removeClass("hide");
                    setTimeout(function () {
                        self.model.gotoMail();
                    }, 1000);
                } else {
                    $Msg.alert(self.model.messages.saveError);

                }
            });

        },
        setUserInfoCallback: function () {
            var self = this;
            $(self.upPhoto).change(function () {
                var imgUrl = self.model.get("imgUrl");
                self.loadImages.removeClass("hide");
                var setTime = setTimeout(function () {
                    self.model.getUserinfo(function (result) {
                        if (result.code == "S_OK") {
                            var data = result["var"];
                            var src = data.imgUrl;
                            if (src != imgUrl) {
                                clearInterval();
                                src = self.httpimgload + sid + "&path=" + $T.Html.encode(src);
                                src = M139.HttpRouter.getNoProxyUrl(src);
                                self.ininImg.attr("src", src);
                                self.loadImages.addClass("hide");
                            } else {
                                $Msg.alert(self.model.messages.picFormatError);
                                self.loadImages.addClass("hide");
                                self.upPhoto.reset();
                            }
                        } else {
                            $Msg.alert(self.model.messages.picFormatError);
                            self.loadImages.addClass("hide");
                            self.upPhoto.reset();
                        }
                    })
                }, 3000);

            })
        },
        setColumns: function () {
            var self = this;
            var arr = [];
            var configColumns = "";
            this.initColumns.find("input[data-id]").each(function (i, n) {
                if ($(this).attr("checked")) {
                    arr.push($(this).attr("data-id"));
                }
            });
            configColumns = arr.join(",");
            return configColumns;
        },
        setSex: function () {//选择性别
            var self = this;
            var json = {
                secrit: 0,
                woman: 1,
                man: 2
            };
            self.initSex.find("input[data-sex]").click(function () {
                var sex = $(this).attr("data-sex");
                self.model.set({ sex: sex })
            });
        },
        initEvents: function () {
            this.saveData();
            this.skipToMail();
            this.checkAlias();
            //this.checkSendName();
            this.setFace();
            this.setSex();
            this.setUserInfoCallback();
        }
    })
    );
    $(function () {
        initsetView = new M2012.Settings.Initset.View();
        initsetView.render();
    })
})(jQuery, _, M139);



