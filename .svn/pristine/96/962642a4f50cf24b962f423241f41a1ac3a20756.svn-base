
/*
  运营快速唤起功能入口
  点击读信页的链接执行
*/


var $Evocation = {

    /*
    option:{
        type:1,                    
        to: 5,                      //是哪种类型的收件人    lastest | clostest | birthdayWeek | me | specified
        email: "13923797879@139.com",                  //收件人地址
        subject: "运营给您发来的邮件",
        content: "运营发来的邮件内容邮件内容邮件内容邮件内容邮件内容邮件内容邮件内容"
    },
    */

    create: function (params) {
        if (top.SiteConfig.evocation) {
            if (typeof params == "string") {
                var params = params || "";
                params = params.split('&');
                var option = {}
                for (var i = 0; i < params.length; i++) {
                    option[params[i].split('=')[0]] = params[i].split('=')[1]
                }
            } else if (typeof params == "object") {
                var option = params;
            }

            var self = this;
            document.domain = window.location.host.match(/([^.]+\.[^.:]+):?\d*$/)[1];

            top.M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/evocation.pack.js", charset: "utf-8" }, function () {
                EvocationPopWindow = new top.Evocation.Main.View(option);
            });
        }
    },

    /**
     *  弹出订阅日历活动详情
     *  @param {Number} options.labelId //日历ID
     *  @param {Boolean} options.isOffical //是否是官方（后台）发布日历
     *  @param {Function} options.subscribe //订阅成功后的处理函数
     *  @param {Function} options.unsubscribe //订阅失败后的处理函数
     */
    openSubsCalendar: function (options) {
        if (_.isUndefined(M2012.Calendar) || _.isUndefined(M2012.Calendar.View) ||
            _.isUndefined(M2012.Calendar.View.CalendarDetail)) {
            top.M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/calendar/cal_pop_subscribedetail.pack.js", charset: "utf-8" }, function () {
                new M2012.Calendar.View.CalendarDetail(options);
            });          
            return;
        }
        new M2012.Calendar.View.CalendarDetail(options);
    },
    
    changeSkin: function (skinName) {
        top.M139.core.utilCreateScriptTag({ src: "/m2012/js/packs/m2012.changeskin.pack.js", charset: "utf-8" }, function () {
            setTimeout(function () {
                top.$App.trigger('EvochangeSkin', { skinName: skinName });
            }, 500)
        });

    },

    openAndSubject:function(columnId){
        columnId = columnId + '';
        top.$App.show('googSubscription');
        top.$App.show('mpostOnlineService', null, {
            key : columnId,
            inputData : {
                columnId : columnId
            }
        }); 
        var postUrl = top.getDomain('image') + 'subscribe/inner/bis/subscribe?sid=' + top.sid;
        var postOption = '{comeFrom:503,columnId:' + columnId + '}';
        top.M139.RichMail.API.call(postUrl, postOption);
    },

    showMessageBox:function(){
        var msgBox = new M2012.RemindboxView;
        msgBox.render();
    },

    msgBoxHot:{

        show:function(){
            var cguid = $Url.queryString("cguid");
            $('#msgBoxComing').show();
            $Cookie.set({name:'msg',value: cguid + '|s'})
        },

        hide:function(){
            var cguid = $Url.queryString("cguid");
            $('#msgBoxComing').hide();
            $Cookie.set({name:'msg',value: cguid + '|h'})
        },

        setStatus:function(){
            var self = this;
            var cguid = $Url.queryString("cguid");
            var v = $Cookie.get('msg');
            //如果是此次登录的cguid,则保持状态
            if(v && v.split('|')[0] == cguid){
                var d = v.split('|')[1]; //状态值
                switch(d){
                    case 's':self.show();break;
                    case 'h':self.hide();break;
                }
            }
        }
    }
}