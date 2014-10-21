; (function ($, _, M139, top) {

    M139.namespace("M2012.Calendar.Constant", {

        //接口请求来源 0 标示来自web
        comeFrom: 0,
        //接口请求来源 8 标示来自内嵌版
        caiyunComeFrom : 8,

        defaultLabelId:10, //我的日历ID

        //接口返回的通用错误码
        codes: {
            S_OK: "S_OK",
            UNKNOW: "FS_UNKNOW",
            TIMEOUT: "FS_SESSION_ERROR"
        },

        FIFA_WORLD_CUP_ID: 8587, //2014巴西世界杯日历ID

        //活动类型
        scheduleTypes: {
            OWNER: 0, //自己创建的
            INVITE: 1, //邀请的
            SHARE: 2, //共享的
            SUBSCRIBE: 3 //订阅的
        },

        calendarTypes: {
            lunar: 20,
            calendar: 10
        },

        //日历类型
        specialType: {
            general: 0,      //普通日历
            birth: 1,        //生日
            baby: 2,         //宝宝防疫
            countDown: 3     //倒数日
        },

        //假日类型,用于左下角显示"假","班"用的
        holidayTypes: {
            "restday": 1, //1嘛,就是多一天假
            "normal": 0,
            "workday": -1 //-1,就是少一天holiday咯
        },

        activityType: {
            //自己的活动
            myself: 0,
            //邀请下的活动
            invited: 1,
            //共享下的活动
            shared: 2,
            //订阅下的活动
            subscribed: 3,
            //群活动
            group: 4
        },

        //不同活动类型对应小图标Class
        activilyIconType: {
            99: 'birthIcon',
            birthday: 'birthIcon',
            1: 'springIcon',     //指定运营账号创建日历下的活动
            4: 'baskIcon',
            5: 'footIcon',
            clock: "i-clocks",
            black_clock: "i-clock",
            unaccepted: "i_message", //未接受消息
            0: '' //特殊标记为0时,没图标样式
        },

        //提醒类型
        remindBeforeType: {
            "0": '分钟',
            "1": "小时",
            "2": "天",
            "3": "周",
            "4": "月"
        },

        //提醒方式
        remindSmsEmailType: {
            '11': '免费短信和邮件提醒',
            '10': '免费短信提醒',
            '01': '邮件提醒',
            '1': '邮件提醒'
        },

        activilyTxtColor: {
            blackColor: '#000',        //生日活动文字颜色
            unSystem: '#fff'
        },
        LEFT_SIDEBAR_WIDTH: 170,  // 用于订阅日历详情
        subscribeStatus: { // 是否订阅,0表示未订阅
            isSubscribed: 1,
            noSubscribed: 0
        },

        /**
         * 活动背景颜色对应的特效样式
         */
        activilyColors: {

            "#a2da79": "userGreen",
            "#a5a5f0": "userPurple",
            "#fcc44d": "userYellow",
            "#f399d5": "userPink",
            "#93cbee": "userDarkblue",
            "#ef7f7f": "userRed",
            "#afbecf": "userGray",
            "#7fdada": "userDarkgreen",
            "#5eabf3": "userBlue",
            "#ffb089": "userOrange",
            "#e3f4d7": "adminGreen",
            "#e4e4fa": "adminPurple",
            "#feedc9": "adminYellow",
            "#fbe0f2": "adminPink",
            "#deeffa": "adminDarkblue",
            "#fad8d8": "adminRed",
            "#e7ebf1": "adminGray",
            "#d8f4f4": "adminDarkgreen",
            "#cee6fb": "adminBlue",
            "#ffe7db": "adminOrange",
            "#6699ff": "userPurple_old",
            "#319eff": "userBlue_old",
            "#58a8b4": "userlightgreen_old",
            "#009898": "userDarkgreen_old",
            "#51b749": "userGreen_old",
            "#ff9966": "userOrange_old",
            "#cc9999": "userBrown_old",
            "#cc0000": "userRed_old",
            "#cc99cc": "userPink_old",
            "#b5bfca": "userGray_old",
            "#f9d8e1": "adminLightpink"   //生日提醒活动
        },

        /**
         * 日历视图类型
         */
        calViewTypes: {
            //月视图
            MONTH: 0,
            //日视图
            DAY: 1,
            //列表视图
            LIST: 2
        },

        //提醒时间间隔
        //0分, 1时, 2天, 3周,4月
        remindTimesEnum: {
            "不提醒": 0, '准点提醒': 0, '5分钟': 0, '10分钟': 0, '15分钟': 0, '30分钟': 0, '1小时': 1, '2小时': 1, '3小时': 1, '6小时': 1, '12小时': 1,

            '1天': 2, '2天': 2, '3天': 2, '4天': 2, '5天': 2, '6天': 2, '7天': 2
        },

        //提醒接收方式
        remindSmsEmailTypes: {
            email: { text: '邮件', value: '01' },
            freeSms: { text: '免费短信', value: '10' }
        },
        // 按日，周，月，年提醒模板
        scheduleTempMap: {
            dayTemp: 'dayTemp',
            weekTemp: 'weekTemp',
            monthTemp: 'monthTemp',
            yearTemp: 'yearTemp'
        },
        // 输入字符宽度的限制
        lengthConfig: {
            inputLength: 100,   // 输入框字符不超过100
            label_detailLength: 200 // 创建,编辑日历的日历说明中,描述字段的长度不超过200个字符
        },

        //日视图相关配置
        dayViewConf: {
            //行高
            lineHeight: 21,
            //最大显示活动条数
            maxCount: 5,
            moreCalWidth: 36 //16
        },
        // 接口响应错误代码
        errorCode: {
            //需验证码
            IDENTITY: 910,
            //频率过快
            OVER_LIMIT: 911
        },
        IDENTIFY_CODES: {
            IS_NEED_IDETIFY: 910,//需要验证码
            MORE_M30_STOP: 911,//一分钟加30次，禁止
            ERROR_INPUT_IDETIFY: 912,//验证码输入出错
            ERROR_BLACK_LIST: 913,//在黑名单中
            ERROR_OUT_DATE: 914,//验证码过期
            SESSION_TIMEOUT: 900//SESSION超时
        },
        Common_Config : { // 可以共用的一些配置
            Max_Labels_Sum : 10,  // 最多可以快捷创建的日历数目
            Shortcut_setTime_Height : "23px" // 架构调整后的设置时间控件的高度,加这个配置是考虑兼容性的问题(暂时在快捷创建活动中有用到)
        },
        Discovery_Config : { // 日历广场中用到的一些配置
            IS_SAVE_CALENDARMENU_STATUS : "isSaveMenuStatus"   // 是否需要保持"日历菜单"的状态:"展开"/"伸缩"
        },
        LeftMenu_Config : {// 左侧菜单栏中用到的一些配置
            IS_SAVE_CALENDARMENU_STATUS : "isSaveMenuStatus",   // 是否需要保持"日历菜单"的状态:"展开"/"伸缩"
            IS_OPEN_STATUS : "isOpenStatus",  // 日历菜单的状态:"展开"/"伸缩"
            ICON_RIGHT : "t_globalRight", // 向右小箭头样式
            ICON_DOWN : "t_globalDown",   // 向下小箭头样式
            INASIDE_BUG : 'inAsideBug'    // 修复IE6下左侧菜单栏遮挡日月视图的问题
        },
        Invited_Activity_Status : { // 邀请活动持有的四种状态
            0 : "未回复",
            1 : "已接受",
            2 : "已谢绝",
            3 : "已删除"
        }
    });

})(jQuery, _, M139, window._top || window.top);