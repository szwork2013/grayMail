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


