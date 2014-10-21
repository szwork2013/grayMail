
; (function (jQuery, _, M139, top) {
    var className = "M2012.Calendar.Popup.BabyTemplet.Model";
    M139.namespace(className, Backbone.Model.extend({
        defaults:{
            defautParam: {
                comeFrom: 0,
                calendarType: 10,
                beforeType: 2, //天 <=== 这个不会动
                labelId: 10,
                color: "#319eff",
                enable: 1,
                recEmail: (top.$User.getDefaultSender() || ""), //补充接收邮箱
                sendInterval: 0,
                week: "0000000",
                specialType: 2,
                inviteInfo: []
            },
            listData: [
                {
                    index:1,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 0,
                    timeTip: '出生24小时',
                    title: "注射乙型肝炎疫苗第一针，预防乙型病毒性肝炎; 注射卡介苗，预防结核病",
                    desc: ['<li><i class="i-point"></i>注射乙型肝炎疫苗第一针，预防乙型病毒性肝炎</li>',
 						   '<li><i class="i-point"></i>注射卡介苗，预防结核病</li>'].join('')
                },
                {
                    index: 2,
                    afterDays: 0,
                    afterMonths: 1,
                    afterYears: 0,
                    timeTip: '宝宝1个月大',
                    title: "注射乙型肝炎疫苗第二针，预防乙型病毒性肝炎",
                    desc: '<li><i class="i-point"></i>注射乙型肝炎疫苗第二针，预防乙型病毒性肝炎</li>'
                },
                {
                    index: 3,
                    afterDays: 0,
                    afterMonths: 2,
                    afterYears: 0,
                    timeTip: '宝宝2个月大',
                    title: "口服脊髓灰质炎糖丸第一粒，预防脊髓灰质炎（小儿麻痹症）",
                    desc: '<li><i class="i-point"></i>口服脊髓灰质炎糖丸第一粒，预防脊髓灰质炎（小儿麻痹症）</li>'
                },
                {
                    index: 4,
                    afterDays: 0,
                    afterMonths: 3,
                    afterYears: 0,
                    timeTip: '宝宝3个月大',
                    title: "卡介苗复查，检查卡介苗接种效果; 口服脊髓灰质炎糖丸第二粒，预防脊髓灰质炎（小儿麻痹症）; 注射百白破疫苗第一针，预防百日咳、白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>卡介苗复查，检查卡介苗接种效果</li>',
 						   '<li><i class="i-point"></i>口服脊髓灰质炎糖丸第二粒，预防脊髓灰质炎（小儿麻痹症）</li>',
                           '<li><i class="i-point"></i>注射百白破疫苗第一针，预防百日咳、白喉、破伤风</li>'].join('')
                },
                {
                    index: 5,
                    afterDays: 0,
                    afterMonths: 4,
                    afterYears: 0,
                    timeTip: '宝宝4个月大',
                    title: "口服脊髓灰质炎糖丸第三粒，预防脊髓灰质炎（小儿麻痹症）; 注射百白破疫苗第二针，预防百日咳、白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>口服脊髓灰质炎糖丸第三粒，预防脊髓灰质炎（小儿麻痹症）</li>',
 						   '<li><i class="i-point"></i>注射百白破疫苗第二针，预防百日咳、白喉、破伤风</li>'].join('')
                },
                {
                    index: 6,
                    afterDays: 0,
                    afterMonths: 5,
                    afterYears: 0,
                    timeTip: '宝宝5个月大',
                    title: "注射百白破疫苗第三针，预防百日咳、白喉、破伤风",
                    desc: '<li><i class="i-point"></i>注射百白破疫苗第三针，预防百日咳、白喉、破伤风</li>'
                },
                {
                    index:7,
                    afterDays: 0,
                    afterMonths: 6,
                    afterYears: 0,
                    timeTip: '宝宝6个月大',
                    title: "注射乙型肝炎疫苗第三针，预防乙型病毒性型肝炎",
                    desc: '<li><i class="i-point"></i>注射乙型肝炎疫苗第三针，预防乙型病毒性型肝炎</li>'
                },
                {
                    index: 8,
                    afterDays: 0,
                    afterMonths: 8,
                    afterYears: 0,
                    timeTip: '宝宝8个月大',
                    title: "注射麻疹疫苗，预防麻疹",
                    desc: '<li><i class="i-point"></i>注射麻疹疫苗，预防麻疹</li>'
                },
                {
                    index: 9,
                    afterDays: 0,
                    afterMonths: 6,
                    afterYears: 1,
                    timeTip: '宝宝1岁半至2岁',
                    title: "注射百白破疫苗加强针，预防百日咳、白喉、破伤风; 口服脊髓灰质炎加强糖丸，预防小儿麻痹症",
                    desc: ['<li><i class="i-point"></i>注射百白破疫苗加强针，预防百日咳、白喉、破伤风</li>',
 						   '<li><i class="i-point"></i>口服脊髓灰质炎加强糖丸，预防小儿麻痹症</li>'].join('')
                },
                {
                    index: 10,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 4,
                    timeTip: '宝宝4岁',
                    title: "口服脊髓灰质炎加强糖丸，预防小儿麻痹症",
                    desc: '<li><i class="i-point"></i>口服脊髓灰质炎加强糖丸，预防小儿麻痹症</li>'
                },
                {
                    index: 11,
                    afterDays: 0,
                    afterMonths: 0,
                    afterYears: 7,
                    timeTip: '宝宝7岁',
                    title: "注射麻疹疫苗加强针，预防麻疹; 注射白破二联疫苗加强针，预防白喉、破伤风",
                    desc: ['<li><i class="i-point"></i>注射麻疹疫苗加强针，预防麻疹</li>',
 						   '<li><i class="i-point"></i>注射白破二联疫苗加强针，预防白喉、破伤风</li>'].join('')
                }
            ]
        },
        initialize: function (options) {
            //this.callAPI = M2012.Calendar.CalendarView.callAPI;
            this.master = options.master;
            this.set({
                //默认选项
                validImg: '',
                beforeTime: 1, //提前一天
                recMyEmail: 0,
                recMySms: 1
            });
        },
        request: function (fnName, data, fnSuccess, fnError) {
            var _this = this;
            data = $.extend(data, _this.get("defautParam"));
/**
            this.callAPI(funcName, data,
                function (response, json) { //success
                    if (typeof callback == 'function') {
                        callback(response);
                    }
                }, function (code, json) { //onfail, eg. code or resultcode incorrect
                    _this.trigger("onfail");
                    if (typeof onfail == 'function') {
                        onfail(json);
                    }
                }, function () { //onfail, eg. response is null or empty
                    _this.trigger("onerror");
                    if (typeof onerror == 'function') {
                        onerror();
                    }
                });*/
            //获得主控API实例
            this.master.trigger(this.master.EVENTS.REQUIRE_API, {
                success: function (api) {
                    if (api[fnName] && typeof api[fnName] === 'function'){
                        api[fnName]({
                            data : data,
                            success : function(detail, text) {
                                fnSuccess && fnSuccess(detail, text);
                            },
                            error : function (detail) {
                                fnError && fnError(detail);
                            }
                        });
                    }
                }
            });
        },
        batchAddCalendar: function (params,onsuccess,onerror) {
            this.request("batchAddCalendar", params, onsuccess, onerror);
        },
        addBabyData: function (onsuccess, onfail, onerror) {
            var _this = this;

            //拼接自定义参数
            var params = {
                beforeTime: _this.get("beforeTime"),
                recMyEmail: _this.get("recMyEmail"),
                recMySms: _this.get("recMySms"),
                validImg: _this.get("validImg")
            };
            var babyName = _this.get("name");

            var extInfos = [];
            var selectItems = _this.get("items");
            $.each(selectItems, function (i, item) {
                var dateStr = M139.Date.format("yyyy-MM-dd", item.nextDate);
                extInfos.push({
                    title: item.title,
                    site: '',
                    content: babyName,
                    dateDesc: '',
                    dateFlag: dateStr,
                    endDateFlag: dateStr,
                    startTime: "0800",
                    endTime: "1000"
                })
            });

            params = $.extend(params, { extInfos: extInfos });
            //end

            _this.batchAddCalendar(params, onsuccess, onfail, onerror);
        }
    }));
})(jQuery, _, M139, window._top || window.top);