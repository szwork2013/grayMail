///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
var HttpClient = require("../httpClient/httpClient");

var Router = require("../router/router");
var Toolkit = require("../toolkit/index");


var WelcomeModel = (function () {
    function WelcomeModel() {
    }
    //邮箱已使用容量/总容量
    WelcomeModel.prototype.getMessageSize = function (data) {
        var messageInfo = data.var.messageInfo;
        var limitSize = messageInfo.limitMessageSize || 0;
        var usedSize = messageInfo.messageSize || 0;
        var scale = 1024;
        return {
            limitSize: (!limitSize ? 0 : parseInt(limitSize + "")) * scale,
            usedSize: (!usedSize ? 0 : parseInt(usedSize + "")) * scale
        };
    };
    WelcomeModel.prototype.formatText = function (templateStr, obj) {
        var reg = /\{([\w]+)\}/g;
        return templateStr.replace(reg, function ($0, $1) {
            var value = obj[$1];
            if (value !== undefined) {
                return value;
            } else {
                return "";
            }
        });
    };
    WelcomeModel.prototype.getFileSizeText = function (fileSize, options) {
        var unit = "B";
        if (!options) {
            options = {};
        }
        if (options.byteChar) {
            unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
            if (options.maxUnit == "B")
                options.maxUnit = unit;
        }
        var maxUnit = options.maxUnit || "G";
        if (unit != maxUnit && fileSize >= 1024) {
            unit = "K";
            fileSize = fileSize / 1024;
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "M";
                fileSize = fileSize / 1024;

                //debugger
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "G";
                    fileSize = fileSize / 1024;
                }
            }
            fileSize = Math.ceil(fileSize * 100) / 100;
        }
        if (options.comma) {
            var reg = /(\d)(\d{3})($|\.)/;
            fileSize = fileSize.toString();
            while (reg.test(fileSize)) {
                fileSize = fileSize.replace(reg, "$1,$2$3");
            }
        }
        return fileSize + unit;
    };

    /**
    *未读邮件数量
    */
    WelcomeModel.prototype.getUnreadMailCount = function (data) {
        var unread = -1;
        try  {
            unread = data.var.messageInfo.unreadMessageCount;
        } catch (e) {
        }
        return unread;
    };

    WelcomeModel.prototype.getLastLoginDate = function (data) {
        var date = "";
        try  {
            date = data.var.userMainData.lastLoginDate;
        } catch (e) {
        }
        return date.slice(5,-3);
    };

    WelcomeModel.prototype.getUserIntegral = function (data) {
        var integral = {
            levelInt: "",
            integralLevel: "",
            integral: ""
        };
        try  {
            integral = data.var.userMainData.mainUserIntegral;
        } catch (e) {
        }
        return integral;
    };

    /**
    *获得用户头像
    */
    WelcomeModel.prototype.getUserImageUrl = function (data, sid, partId) {
        var headUrl = "/m2012/images/ad/face.jpg";
        try  {
            var info = data.UserInfo[0];
            var imgUrl = info.b8;
            if (imgUrl) {
	            if(/^https?:\/\//i.test(imgUrl)) {
		            headUrl = imgUrl;
                } else if(!/[<>]/.test(imgUrl)) {
                    headUrl = "http://" + this.getResourceDomain(partId) + imgUrl;
                }
            }
        } catch (e) {
        }
        return headUrl;
    };

    /**
    *获得用户昵称
    */
    WelcomeModel.prototype.getUserName = function (data) {
        var name = "";
        try  {
            var trueName = data.var.userAttrs.trueName;
            if (trueName) {
                name = trueName;
            } else {
                name = data.var.userAttrs.uid.split("@")[0];
            }
        } catch (e) {
        }
        return name;
    };

    WelcomeModel.prototype.getGreetingString = function () {
        var date = new Date();
        var hour = date.getHours();
        var greetings = {
            "0": ["夜深了，早些休息。", "人生最美，淡然一笑间。", "深夜还在忙碌的你，辛苦了。"],
            "1": ["守一份平淡，念一份简单。", "随缘自在，心境安然。", "清晨曙光初现，幸福在你身边。", "一日之计在于晨。"],
            "2": ["为了梦想奋斗吧!", "送你清新的问候，温馨的祝福。", "新一天你我共勉！", "用豁达的心去面对生活。"],
            "3": ["相信自己一定能行！", "安然于得失，淡然于成败。", "生命因磨炼而美丽。", "遇顺境处之淡然，遇逆境处之泰然。"],
            "4": ["停下来，享受这片刻的闲暇。", "才高而不自诩，位高而不自傲。", "视线离开电脑，闭目做个深呼吸。"],
            "5": ["简单的幸福无处不在。", "幸福是种心态，让理解相随！", "看看窗外，稍作休息。", "一杯清茶，细品人生。"],
            "6": ["一念放下，万般自在！", "操劳一天，放松下吧！", "家是温暖的港湾。", "人生如行路，选择就要坚持。"]
        };

        //0:0点-6点, 1:6点-8点, 2:8点-10点, 3:10点-12点, 4:12点-14点, 5:14点-18点, 6:18点-24点……
        var hoursList = "000000112233445555666666";
        var index = hoursList.charAt(hour);
        var sentensIndex = parseInt(Math.random() * 10 + "") % greetings[index].length;
        return greetings[index][sentensIndex];
    };

    WelcomeModel.prototype.getResourceDomain = function (partId) {
        return Router.getServerHost("images", partId || "12");
    };

    WelcomeModel.prototype.stringifySafe = function (obj) {
        return Toolkit.Json.stringifySafe(obj);
    };
    return WelcomeModel;
})();
exports.WelcomeModel = WelcomeModel;

var WelcomePage = (function () {
    function WelcomePage(options) {
        this.options = options;
        this.data = {
            rmInitDataConfig: undefined,
            mwInfoSet: undefined,
            addrQueryUserInfo: undefined,
            mwUnifiedPositionContent: undefined,
            birthContactsInfo: undefined
        };
        this.model = new WelcomeModel();
        this.request = options.request;
        this.response = options.response;
    }
    WelcomePage.prototype.fetch = function (callback) {
        var self = this;
        var client = new HttpClient.HttpClient({
            cookies: this.request.cookies,
            sid: this.getSid(),
            clientIP: this.request.header('X-Forwarded-For') || this.request.ip
        });
        client.getInitDataConfig(function (err, resData) {
            self.data.rmInitDataConfig = resData;
            checkReady();
        });
        client.getInfoSet(function (err, resData) {
            self.data.mwInfoSet = resData;
            checkReady();
        });
        client.getQueryUserInfo(function (err, resData) {
            self.data.addrQueryUserInfo = resData;
            checkReady();
        });
        client.getUnifiedPositionContent(function (err, resData) {
            self.data.mwUnifiedPositionContent = resData;
            checkReady();
        });
        client.getBirthContactsInfo(function (err, resData) {
            self.data.birthContactsInfo = resData;
            checkReady();
        });

        /*
        client.getArtifact(function (resData) {
        self.data.mwGetArtifact = resData;
        checkReady();
        });
        */
        function checkReady() {
            for (var p in self.data) {
                if (self.data[p] === undefined) {
                    return false;
                }
            }
            callback();
        }
    };

    WelcomePage.prototype.render = function () {
        var _this = this;
        var res = this.response;
        this.fetch(function () {
            res.set('Cache-Control', 'private');
            res.render("welcome.ejs", {
                sid: _this.getSid(),
                model: _this.model,
                data: _this.data,
                //昵称
                userName: _this.model.getUserName(_this.data.rmInitDataConfig),
                //祝福语
                greetingString: _this.model.getGreetingString(),
                //头像
                userImageUrl: _this.model.getUserImageUrl(_this.data.addrQueryUserInfo, _this.getSid(), _this.request.cookies.cookiepartid),
                //最后登录时间
                lastLoginDate: _this.model.getLastLoginDate(_this.data.mwInfoSet),
                mainUserIntegral: _this.model.getUserIntegral(_this.data.mwInfoSet),
                showUnreadFolders: _this.getShowUnreadFolders()
            });
        });
    };

    WelcomePage.prototype.getShowUnreadFolders = function () {
        //账单是否已割接到收件箱
        var billGejieRelease = false;
        var data = [];

        /*[
        { fid: 1, name: "收件箱" },
        { fid: 8, name: "账单中心" },
        { fid: 9, name: "我的订阅" }];*/
        var list = [1, 8, 9];
        try  {
            if ("newBillCount" in this.data.rmInitDataConfig) {
                billGejieRelease = true;
            }
            if (billGejieRelease) {
                list = [1];
            }
            var folders = this.data.rmInitDataConfig.var.folderList;
            for (var i = 0; i < folders.length; i++) {
                var folder = folders[i];
                if (list.indexOf(folder.fid) > -1) {
                    data.push(folder);
                }
            }
            if (billGejieRelease) {
                data.push({
                    "fid": 8,
                    "name": "服务邮件",
                    "type": 1,
                    "parentId": 0,
                    "folderPassFlag": 0,
                    "location": 8,
                    "folderColor": 0,
                    "reserve": 0,
                    "keepPeriod": 7,
                    "pop3Flag": 1,
                    "hideFlag": 1,
                    "vipFlag": 0,
                    "stats": {
                        "messageCount": this.data.rmInitDataConfig.totalBillCount,
                        "messageSize": 0,
                        "unreadMessageCount": this.data.rmInitDataConfig.newBillCount,
                        "unreadMessageSize": 0,
                        "attachmentNum": 0
                    }
                });
                data.push({
                    "fid": 9,
                    "name": "订阅邮件",
                    "type": 1,
                    "parentId": 0,
                    "folderPassFlag": 0,
                    "location": 9,
                    "folderColor": 0,
                    "reserve": 0,
                    "keepPeriod": 7,
                    "pop3Flag": 1,
                    "hideFlag": 1,
                    "vipFlag": 0,
                    "stats": {
                        "messageCount": this.data.rmInitDataConfig.totalSubscriptionCount,
                        "messageSize": 0,
                        "unreadMessageCount": this.data.rmInitDataConfig.newSubscriptionCount,
                        "unreadMessageSize": 0,
                        "attachmentNum": 0
                    }
                });
            }
        } catch (e) {
        }
        return data;
    };

    //TODO 移到公共
    WelcomePage.prototype.getSid = function () {
        return this.request.query.sid;
    };
    return WelcomePage;
})();
exports.WelcomePage = WelcomePage;
