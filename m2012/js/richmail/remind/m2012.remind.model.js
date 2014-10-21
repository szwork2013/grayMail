/**   
* @fileOverview 任务邮件提醒
*/
(function (jQuery, _, M139) {
    
    /**
    * @namespace 
    * 邮件列表页、读信页任务邮件提醒
    */

    M139.namespace("M2012.Remind.Model",Backbone.Model.extend({
    
        callApi: M139.RichMail.API.call,

        setTask: function(options){
            var mid = this.get('mid');
            var taskDate = this.get('taskDate') || 0;
            var defaults = {
                type : 'taskFlag',
                value : 1,
                time : taskDate,
                ids : [mid]
            };
            var requestData = $.extend(defaults,options.requestData);
            this.callApi("mbox:setTaskMessages", requestData, function (result) {
                var response = result.responseData;
                if(response && response.code == 'S_OK'){
                    var data = response['var'];
                    if(data > 0){
                        options.success && options.success();
                    }else{
                        options.error && options.error();
                    }
                }else{
                    options.error && options.error();
                }
            });
        },
        
        addRemind:function(options){
            this.setRemind('calendar:addMailCalendar',options);
        },
        
        editRemind:function(options){
            this.setRemind('calendar:updateMailCalendar',options);
        },
        
        /** 109 表示日程不存在*/
        setRemind: function(api,options){
            var self = this;
            var defaults = {
                comeFrom : 0,
                recMySms : 1,
                startTime : 1630,
                endTime : 1630,
                content : '邮件内容',
                title : '邮件主题',
                dateFlag : '2013-04-19',
                endDateFlag : '2013-04-19',
                recMobile : $User.getShortUid(),
                dateDesc : '2013-04-19 下午 16:30',
                enable : 1,
                mid : self.get('mid')
            };
            var requestData = $.extend(defaults,options.requestData);
            this.callApi(api, requestData, function (result) {
                var response = result.responseData;
                if(response && (response.code == 'S_OK' || response.errorCode == 109)){
                    options.success && options.success();
                }else{
                    options.error && options.error();
                }
            });
        },
        
        getRemind:function(options){
            var self = this;
            var defaults = {
                comeFrom : 0,
                mid : self.get('mid')
            };
            var requestData = $.extend(defaults,options.requestData);
            this.callApi('calendar:getMailCalendar', requestData, function (result) {
                var response = result.responseData;
                if(response && (response.code == 'S_OK' || response.errorCode == 109)){
                    var data = {content:''};
                    if(response['var']){
                        data = response['var'];
                    }
                    options.success && options.success(data);
                }else{
                    options.error && options.error();
                }
            });
        },
        
        deleteRemind:function(options){
            var self = this;
            var defaults = {
                comeFrom : 0,
                mid : self.get('mid'),
                actionType : 0
            };
            var requestData = $.extend(defaults,options.requestData);
            this.callApi('calendar:delMailCalendar', requestData, function (result) {
                var response = result.responseData;
                if(response && (response.code == 'S_OK' || response.errorCode == 109)){
                    options.success && options.success();
                }else{
                    options.error && options.error();
                }
            });
        },

        batchDelRemind: function(options) {
            var requestData = {
                comeFrom: 0,
                mids: options.midArr.join(',')
            }

            this.callApi('calendar:cancelMailCalendars', requestData, function (result) {
                var response = result.responseData;
                if(response && (response.code == 'S_OK' || response.errorCode == 109)){
                    options.success && options.success();
                }else{
                    options.error && options.error();
                }
            });
        }

}));

})(jQuery, _, M139);
