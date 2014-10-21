/**
* @fileOverview 定时发信视图层.
*/
/**
*@namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Timing', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        template : ['',
            ,'<div class="pl_20 pt_10">'
                ,'<p class="pl_20 pb_10">请选择定时发送的时间：</p>'
                ,'<div class="pl_20 clearfix">'
                    ,'<div class="dropDown dropDown-ydm" id="txtCalendar">'
                        ,'<div class="dropDownText fl">2013-07-24</div>'
                        ,'<a hidefocus="1" href="javascript:void(0)" class="i_ymd fl"></a>'
                    ,'</div>'
                    ,'<div class="dropDown dropDown-month" id="hourMenu">'
                        ,'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>'
                        ,'<div class="dropDownText" id="hourText">09</div>'
                    ,'</div>'
                    ,'<div class="ydmtext">时</div>'
                        ,'<div class="dropDown dropDown-month" id="miniuteMenu">'
                            ,'<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div>'
                            ,'<div class="dropDownText" id="miniuteText">56</div>'
                        ,'</div>'
                    ,'<div class="ydmtext">分</div>'
                ,'</div>'
                ,'<p class="pl_20 pb_10 mt_10">本邮件将在 <strong class="c_ff6600"><span id="dateTip">2013-07-24</span><span id="timeTip"> 13:40</span></strong> 发送</p>'
            ,'</div>'].join(""),
        name : "timing",
        initialize: function (options) {
        	this.model = options.model;
        	this.initEvents();
        	this.isScheduleDate = false;
        	this.targetEle = $("#topTiming")[0];// 默认点击的是顶部定时小三角
            return superClass.prototype.initialize.apply(this, arguments);
        },
        // 创建定时器组件
        createCalander : function(){
            var self = this;
            var calendarPicker = this.calendarPicker = top.M2012.UI.Picker.Calendar.create({
                bindInput: self.$el.find("#txtCalendar")[0],
                value: new Date(),
                stopPassDate: true
            });
            var jCalenderText = self.$el.find("#txtCalendar > div:eq(0)");
            calendarPicker.on("select", function (e) {
                var calendar = e.value.format("yyyy-MM-dd");
                jCalenderText.html(calendar);
                self.$el.find("#dateTip").html(calendar + ' ');
            });
        },
        // 创建时间组件
        createTimer : function(){
        	var self = this;
        	var hourItems = self._getMenuItems(0, 23, 'hourText');
        	var hourMenu = top.M2012.UI.PopMenu.createWhenClick({
				target : self.$el.find('#hourMenu')[0],
	            width : 70,
                maxHeight : 170,
	            items : hourItems,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	            	var time = self.$el.find("#hourText").html()+ ':' + self.$el.find("#miniuteText").html();
	            	self.$el.find("#timeTip").html(time);
	            }
	        });
        	var miniuteItems = self._getMenuItems(0, 59, 'miniuteText');
        	top.M2012.UI.PopMenu.createWhenClick({
				target : self.$el.find("#miniuteMenu")[0],
	            width : 70,
                maxHeight : 170,
	            items : miniuteItems,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	            	var time = self.$el.find("#hourText").html()+ ':' + self.$el.find("#miniuteText").html();
	            	self.$el.find("#timeTip").html(time);
	            }
	        });
        },
        // 初始化定时时间
        initializeDate : function(date){
        	var self = this;
        	// 初始化时间
        	var now = date || getDefaultDate();
        	var date = $Date.format("yyyy-MM-dd", now);
        	var time = getFullTime(now.getHours())+ ':' + getFullTime(now.getMinutes());
	        self.$el.find("#txtCalendar > div:eq(0)").html(date);
	        self.$el.find("#hourText").html(getFullTime(now.getHours()));
	        self.$el.find("#miniuteText").html(getFullTime(now.getMinutes()));
	        // 初始化提示语
	        self.$el.find("#dateTip").html(date+' ');
	        self.$el.find("#timeTip").html(time);
	        
	        function getDefaultDate(){
				var now = new Date();
				return new Date(now.getTime() + 5 * 60 * 1000);
			};
	        
	        function getFullTime(time){
	        	return time >= 10?time:('0'+time);
	        }
        },
        initEvents : function (){
            var self = this;
            this.$el = jQuery(this.template);
            $("#topTiming, #bottomTiming").bind('click', function (event) {
                if (top.$App.isNewWinCompose()) {
                    BH({ key: "newwin_compose_send_toptiming" });
                }
                self.createInstance();
            });
        },
        createInstance: function(initTime){
            this.show();
            //top.$Event.stopEvent(event);
	        // 每次单击都创建新的日历组件实例
            this.createTimer();
            this.initializeDate(initTime);
            this.createCalander();
            this.isScheduleDate = true;
            this.targetEle = this;
        },
        // 渲染定时器控件 
        render : function(pageType, dataSet){
		    if (pageType == "draft" || dataSet.isShowTimeSet) {
		        if(dataSet.scheduleDate){
		        	var initTime = new Date(dataSet.scheduleDate * 1000);
		        	if(typeof dataSet.scheduleDate === 'string'){
		        		initTime = $Date.parse(dataSet.scheduleDate);
		        	}
		            this.isScheduleDate = true;
		            this.createInstance(initTime);
		        }
		    }
        },
        //弹窗显示定时发送
        showSchedule : function(){
            var self = this;
            var dialog = top.$Msg.showHTML(self.template,function(e){
                BH({key : "compose_send_toptiming"});
                mainView.toSendMail(e);
            },function(){
                self.isScheduleDate = false;
            },{
                dialogTitle:'定时发送',
                buttons:['定时发送','取消']
            });
            self.setElement(dialog.el);
        },
        // 显示定时器弹出层 
        show : function(){
            var self = this;
            self.showSchedule();
        },
		// 取得毫秒时间
		getScheduleDate : function(){
		    var time = this._getDefiniteTime();
		    console.log('定时邮件时间为getScheduleDate:'+time);
		    if(time){
		        time = parseInt(time.getTime()/1000);
		    }else{
		        time = 0;
		    }
		    return time;
		},
		//得到定时邮件设置的时间 
		_getDefiniteTime : function() {
		    if (this.isScheduleDate) {
		    	var date = this.$el.find("#txtCalendar > div:eq(0)").html();
		    	var time = this.$el.find("#hourText").html()+ ':' + this.$el.find("#miniuteText").html();
		    	console.log(date + ' '+time+':00');
		        return $Date.parse(date + ' '+time+':00');
		    } else {
		        return 0;
		    }
		},
		/**
		 * 获得时/分菜单项
		 */
		_getMenuItems : function(begin, end, id){
			var self = this;
		    var items = [];
		    for(var i = begin;i <= end;i++){
		    	var text = '';
		    	if(i < 10){
		    		text = '0' + i;
		    	}else{
		    		text = i + '';
		    	}
		        var item = {
					text : text,
					onClick : function() {
						self.$el.find("#"+id).html(this.text);
						self.targetText = this.text;
						// todo 第二个popMenu从dom移除后，会将第一个popMenu的bindautohide属性置为'0'，导致第一个popMenu不响应全局单击事件
						// $("div.sTipsSetTime").attr('bindautohide', '1');
					}
				}
				items.push(item);
		    }
		    return items;
		},
		// 验证定时发送 ，从草稿箱恢复定时邮件,单击发送，提示用户是否立即发送
		checkTiming : function(event){
			var self = this;
			var isContinue = true;
			var dataSet = this.model.get('initDataSet');
			if(dataSet.scheduleDate){
	            var scheduleTime = new Date(dataSet.scheduleDate * 1000), now = new Date();
	            var isShowTip = scheduleTime-now>0?true:false;
	            if(isShowTip){
	            	isContinue = false;
	            	// 弹出提示用户是否立即发送
	            	var msg = self.model.tipWords['SCHEDULE_MAIL'];
	            	var date = $Date.format("yyyy年MM月dd日 hh点mm分", scheduleTime);
	            	msg = $T.Utils.format(msg, [date]);
	            	var popup = M139.UI.Popup.create({
						target : $(event.target).parents("li")[0],
						icon : "i_ok",
						width : 300,
						buttons : [{
							text : "仍定时发送",
							click : function() {
								self.isScheduleDate = true;
								mainView.sendMail();
								popup.close();
							}
						}, {
							text : "立即发送",
							click : function() {
								self.isScheduleDate = false;
								mainView.sendMail();
								popup.close();
							}
						}],
						content : msg
					});
					popup.render();
	            }else{
	            	console.log('定时邮件设置的时间已过');
	            }
	        }
			return isContinue;
		},
		// 判断单击的是否为‘定时发送’
		isClickTimingBtn : function(event){
			if(!event){
				return;
			}
			var target = $(event.target);
			var id = target.attr('id') || target.parent('a').attr('id');
			if(!id){ //id == 'timingSend'
				return true;
			}else{
				return false;
			}
		},
		// 上报用户行为:定时发送包括（顶部与底部）
		addBehavior : function(jEle){
			var id = jEle.attr('id');
			if(id === 'topTiming'){
				BH({key : "compose_send_toptiming"});
			}else if(id === 'bottomTiming'){
				BH({key : "compose_send_bottomtiming"});
			}else{
				console.log('未知的属性ID：'+id);
			}
		}
    }));
})(jQuery, _, M139);

