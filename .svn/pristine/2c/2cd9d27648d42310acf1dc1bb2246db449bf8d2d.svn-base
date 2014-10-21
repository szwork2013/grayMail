/**
* @Author: anchen
* @Date:   2014-09-18 15:30:43
* @Last Modified by:   anchen
* @Last Modified time: 2014-09-19 11:54:29
*/
;(function(jQuery,Backbone,_,M139) {
    var $ = jQuery;
    M139.namespace('M2012.activityInvite.Model',Backbone.Model.extend({

        /**
         *@lends M2012.activityInvite.Model.prototype
         */
        defaults: {
            labelId: 10,
            //日历类型
            // 10：公历 20：农历
            calendarType: 10,
            //日程是否启用提醒
            //0：否  1：是
            enable: 1,
            //提醒提前时间,默认到点提醒
            beforeTime: 0,
            //提醒提前类别
            //0分, 1时, 2天, 3周,4月
            beforeType: 0,
            //重复类型
            //0不重复, 3天, 4周,5月,6年
            sendInterval: 0,
            //用户输入的验证码
            validImg: "",
            //会议主题
            title: "",
            //会议地点
            site: "",
            //邀请信息
            inviteInfo: '',
            //会议详情
            content: "",
            //开始时间 (默认为当前时间半小时后)
            dtStart: '',
            //结束时间
            dtEnd: '',
            //大附件链接
            fileLink: "",//'<a href="javascript:">这是大附件的链接！</a>',
            //写信中的会议邀请
            source: 1,

            //是否是短信提醒   0：否 1：是
            remindBySms: 0,
            //是否是邮件提醒   0：否   1：是
            recMyEmail: 0,
            //活动提醒接收的手机号
            recMobile: "",
            //活动提醒接收的邮箱地点
            recEmail: "",
            //特殊类型
            specialType: 0,
            //是否有结束时间信息
            useEndTime: false,

            week: "",
            //全天事件
            //0：否 1：是
            allDay: 0
        },

        EVENTS: {
            VALIDATE_FAILED: 'activity#validate:failed'
        },

        TIPS: {
            OPERATE_ERROR: "操作失败，请稍后再试",
            OPERATE_SUCCESS: "操作成功",
            DATA_LOADING: "正在加载中...",
            MAX_LENGTH: "不能超过{0}个字符",
            TITLE_ERROR: "请输入主题",
            RECIVER_NOT: "请选择联系人",
            RECEIVER_ERROR: "联系人输入错误"
        },

        initialize: function() {
            var self = this;
            self.initEvents();
        },

        initEvents: function() {
            var self = this;
            self.on("invalid", function (model, error) {
                if (error && _.isObject(error)) {
                    for (var key in error) {
                        var targetEl = '';
                        switch(key){
                            case 'title':targetEl = "activityTitle";
                                break;
                            //验证地点
                            case "site": targetEl = "activityAddr";
                                break;
                            //验证会议详情
                            case "content":targetEl = "activityContent";
                                break;
                        }
                        self.trigger(self.EVENTS.VALIDATE_FAILED, {
                            target: targetEl,
                            message: error[key]
                        });
                        break;
                    }
                }
            });
        },
        //获取处理后的数据
        getData: function() {
            var self = this;
            //计算开始、结束时间
            var title = self.get("title");
            var startTime = self.get("dtStart");
            var endTime = self.get("dtEnd");
            if ($Date.parse(startTime) - $Date.parse(endTime) > 0) {//结束时间大于开始时间
                endTime = startTime;
            }
            return {
                labelId: self.get("labelId"),
                calendarType: self.get("calendarType"),
                beforeTime: self.get("beforeTime"),
                beforeType: self.get("beforeType"),
                sendInterval: self.get("sendInterval"),
                week: self.get("sendInterval") == 4 ? self.get("week") : "",
                recMySms: self.get("remindBySms"),//是否有短信提醒
                title: self.get("title"),
                site: self.get("site"),
                content: self.get("content"),
                dtStart: startTime,
                dtEnd: endTime,
                allDay: self.get("allDay"),
                recMobile: self.get("recMobile"),
                recEmail: self.get("recEmail"),
                enable: self.get("enable"),
                specialType: self.get("specialType"),
                validImg: self.get("validImg"),
                fileLink: "<![CDATA[" + self.get("fileLink") + "]]>",
                source: self.get("source"),
                inviteInfo:self.get("inviteInfo")

            };
        },
        /**
         * 验证数据的有效性
         **/
        validate: function (attrs, args) {
            var self = this;
            var data = attrs;

            args = args || {};
            //判断是否需要验证
            if (!args.validate) {
                return;
            }

            //如果存在target，那说明我们只针对具体字段做校验
            if (args && args.target) {
                var key = args.target;
                var obj = {};
                obj[key] = attrs[key];
                data = obj;
            }

            //该方法用于获取返回的错误信息
            var getResult = function (target, message) {
                //校验错误后backbone不会将错误数据set到model中，所以此处需要偷偷的设置进去,
                //以便于后续提交时能统一校验model数据
                if (args.target == target) {
                    var obj = {};
                    obj[target] = attrs[target];
                    self.set(obj, { silent: true });
                }
                var value = {};
                value[target] = message;
                console.log(value);
                return value;
                }

            //验证主题内容有效性
            var key = "activityTitle";
            if (_.has(data, key)) {
                if (data[key].length == 0) {
                    return getResult(key, self.TIPS.TITLE_ERROR);
                }
                if (data[key].length > 30) {
                    return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [30]));
                }
            }
            //验证地点内容有效性
            key = "site";
            if (_.has(data, key) && data.site.length > 30) {
                return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [30]));
            }
            //验证会议详情有效性
            key = "content";
            if (_.has(data, key) && data.content.length > 500) {
                return getResult(key, $T.format(self.TIPS.MAX_LENGTH, [500]));
            }
        },
        //提交到服务器保存
        saveToServer: function (fnSuccess, fnError, fnFail, validate) {
            var self = this;
            //检查数据的有效性
            if (validate) {
                if (!self.isValid()) {
                    console.log('不通过');
                    fnFail && fnFail();
                    return;
                }
            }
            console.dir(self.getData());
            console.log('最后组装时候啦！');
            M139.RichMail.API.call('calendar:addCalendar', self.getData(), function (response) {
                if (response.responseData && response.responseData["code"] == "S_OK") {
                    fnSuccess && fnSuccess(response);
                } else {
                    top.$Msg.alert("发送失败，请重试");
                }
            })

            /*
            return;
            var options = {
                data: self.getData(),
                success: function (result) {
                    if (result.code == "S_OK") {
                        fnSuccess && fnSuccess(result["var"]);
                        return;
                    }
                    var msg = self.TIPS.OPERATE_ERROR;
                    fnError && fnError(msg, result);
                },
                error: function (e) {
                    fnError && fnError(self.TIPS.OPERATE_ERROR);
                }
            };

            //提交数据
            self.master.trigger(self.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    api.addCalendar(options);
                }
            });*/
        }


        }
    ));
})(jQuery,Backbone,_,M139);




