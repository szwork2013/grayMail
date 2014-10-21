/**
* @fileOverview 任务邮件编辑器
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 任务邮件编辑器
    */   
         
    M139.namespace('M2012.Remind.Editor', superClass.extend({

        /**
        *@lends M2012.Remind.Editor.prototype
        */

    el:"body",
    
    maxCount:100,
    
    initialize: function(){
        var self = this;
        return superClass.prototype.initialize.apply(this, arguments);
    },
    getTimeSpan:function(date){
    	var h=date.getHours();
    	var m=date.getMinutes();
    	h=h>9?h:"0"+h;
    	m=m>9?m:"0"+m;
    	return h+":"+m;
    },
    switchSms:function(enable){
    	var H1 = $B.is.ie && $B.getVersion() < 8 ? 153 : 163;
    	var H2 = $B.is.ie && $B.getVersion() < 8 ? 320 : 314;
    	if(enable){
			$("#div_sms").show();
			top.$Msg.getCurrent().setHeight(H2);
    	}else{
    		$("#div_sms").hide();
    		top.$Msg.getCurrent().setHeight(H1);
    	}
    	top.$Msg.getCurrent().resetHeight();
    },
    render:function(){
        var self = this;
        var data = this.initData;
        var dealTime = data.dealTime;
        var d = '';
        var status = self.initData.status;
        var now = this.getNow();

        if(now.getHours()==23){
			now.setMinutes(59);
        }else{
        	now.setHours(now.getHours() + 1);
        }

        if(status && status == 'hasremind' && dealTime && dealTime > 0){
            d = new Date(dealTime);
            var diff = $Date.getDaysPass(d, this.getNow());
            if(diff==0){ //今天
            	this.changeDateType("today",true);            	
            }else if(diff==-1){
				this.changeDateType("tomorrow",true);				
            } else if ( diff === -2 ) {
            	this.changeDateType("aftertomorrow",true);
            } else{
            	this.changeDateType("other",true);
            	$('#sp_selectedDate').html($Date.format('yyyy-MM-dd', new Date(dealTime)));
            	self.selectedDate = new Date(dealTime);
            }
        }else{
            d = new Date();
            this.changeDateType("today",true);
        }
  
        $("#tb_content").val(this.getContent());

        this.switchSms(data.recMySms?true:false);

        // 是否短信提醒
        data.recMySms && $("#ck_sms").attr("checked", true);
        // 是否同步日历
        data.recMyCanl && $("#ck_canlendar").attr("checked", true);

       	$("#ck_sms").change(function(){
       		top.BH("task_sms");
			self.switchSms($(this).attr("checked")?true:false);
        });
        $("#ck_canlendar").change(function(){
       		top.BH("task_sys_calendar");
        });
	},
	
	/** 获取提醒内容 */
	getContent:function(){
        var content = this.initData.content;
        var max = this.maxCount;
        if(!content){
            var d = this.initData.listData;
            var temp = '请处理来自{name}的邮件：{subject}';
            var date = new Date(Number(d.sendDate)*1000);
            var email = $Email.getEmail(d.from);
            var contact = top.Contacts.getContactsByEmail(email)[0];
            var name = (contact && contact.name) ? contact.name : $Email.getName(d.from);
            content = $T.Utils.format(temp,{
                date : date.format('M月d日 hh:mm'),
                name : name,
                subject : d.subject
            });
        }
        return content.substring(0,max);
	},
	
	/** 时间刷新 */
	setRemindTimeTips:function(){
		/*var day = $('#calendarPicker .dropDownText').text() || '',
			hour = $('#hourText').text() || '',
			minute = $('#minuteText').text() || '';
		$('#remindTimeText').text(day + ' ' + hour + ':' + minute); */
	},
	
	/** 日期控件 */
	calendarPickerEvent:function(){
        var self = this;
        var pickerText4remind = $('#sp_selectedDate');
        var day4sms = this.$el.find("[name=day4sms]");
        var hour4sms = this.$el.find("[name=hour4sms]");
        var minute4sms = this.$el.find("[name=minute4sms]");
        var offset=top.$Msg.getCurrent().$el.offset();

        // 初始化选择待办日期的日历控件
		var calendarPicker4remind = new top.M2012.UI.Picker.Calendar({
		        bindInput: $('#calendarPicker,#sp_selectedDate, #day_04'),
				dx:offset.left,dy:offset.top + 20,
				value: new Date(),
				stopPassDate: true
			});		
		calendarPicker4remind.on("select", function (e) {
			var date = e.value.format("yyyy-MM-dd");
			self.selectedDate=e.value;
			pickerText4remind.html(date);
            self.setRemindTimeTips(); //重置
		});

		// 初始化选择短信提醒日期的日历控件
		var smsTime = this.initData.smsTime;
		if (smsTime) smsTime = $Date.parse(smsTime);

		var calendarPicker4sms = new top.M2012.UI.Picker.Calendar({
            bindInput: $("#smsCalendarPicker"),
            dx:offset.left,dy:offset.top + 20,
            value: smsTime ? smsTime : new Date(),
            stopPassDate: true
        });
		calendarPicker4sms.on("select", function (e) {
			var date = e.value.format("yyyy-MM-dd");
			self.smsTime=e.value;
			day4sms.html(date);
		});

		// 初始化短信提醒时间
		var presetTime = new Date().getTime() + 5 * 60 * 1000;
		presetTime = new Date(presetTime);
		smsTime = smsTime ? smsTime : presetTime;
		day4sms.text( $Date.format('yyyy-MM-dd', smsTime) );
		hour4sms.text( $Date.format('hh', smsTime) );
		minute4sms.text( $Date.format('mm', smsTime) );
		this.smsTime = smsTime;


		// 设置时间下拉框事件
		var hourItems = self._getMenuItems(0, 23, 'hourMenu');
    	var hourMenu = top.M2012.UI.PopMenu.createWhenClick({
			target : self.$el.find('#hourMenu'),
			container: document.body,
            width : 70,
            maxHeight : 160,
            items : hourItems,
            dx: 0,
            dy: 1,
            onItemClick : function(item){
            	var html = '<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div><div class="dropDownText" name="hour4sms">'+ item.text +'</div>'
            	self.$el.find('#hourMenu').html(html)
            }
        });
    	var miniuteItems = self._getMenuItems(0, 59, 'miniuteMenu');
    	top.M2012.UI.PopMenu.createWhenClick({
			target : self.$el.find("#miniuteMenu"),
			container: document.body,
            width : 70,
            maxHeight : 160,
            items : miniuteItems,
            dx: 0,
            dy: 1,
            onItemClick : function(item){
            	var html = '<div class="dropDownA" href="javascript:void(0)"><i class="i_triangle_d"></i></div><div class="dropDownText" name="minute4sms">'+ item.text +'</div>';
            	self.$el.find("#miniuteMenu").html(html);
            }
        });
	},

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
						// self.targetText = this.text;
						// todo 第二个popMenu从dom移除后，会将第一个popMenu的bindautohide属性置为'0'，导致第一个popMenu不响应全局单击事件
						// $("div.sTipsSetTime").attr('bindautohide', '1');
					}
				}
				items.push(item);
		    }
		    return items;
		},

	/** 计算字数 */
	countEvent : function(){
		var self = this;
		var max = this.maxCount;
		//var textArea = $('#content');
		var textArea = document.getElementById('tb_content');
		var countTips = $('#countTips');
		
		function countText(){
			if(textArea.value.length>100){
				textArea.value=textArea.value.substring(0,100);
			}
			countTips.text(textArea.value.length.toString()+"/"+max.toString());

		}
		countText();

        try{
            M139.Timing.watchInputChange(textArea, function () {
            	countText();
            });
            M139.Dom.setTextBoxMaxLength(textArea, 100);
        }catch(e){};
    },
    
    countChangeEvent: function(textArea){
        var countTips = $('#countTips');
        var countSpan = countTips.find('span:eq(0)');
        var len = textArea.value.length;
        var max = this.maxCount;
        countSpan.text(max - len > 0 ? max - len : 0 ); 
        if(len > max){
            this.countFlag = false;
            textArea.value = textArea.value.substring(0,max);
        }else{
            this.countFlag = true;
        }
    },
	getInputTime:function() {
		var type=$("input[type='radio']:checked").val();
		var result,time,hour,minute;
		var now=this.getNow();
		if(type=="today"){
			/*time=$("#tb_today").val().split(":");
			hour=time[0];
			minute=time[1];
			now.setHours(hour);
			now.setMinutes(minute);*/
			result=now;
		}else if(type=="tomorrow"){
			/*time=$("#tb_tomorrow").val().split(":");
			hour=time[0];
			minute=time[1];*/
			var tomorow = new Date(now.setDate(now.getDate()+1));
			/*tomorow.setHours(hour);
			tomorow.setMinutes(minute);*/
			result=tomorow
		} else if (type === "aftertomorrow") {
			result = new Date(now.setDate(now.getDate()+2));
		} else {
			if(!this.selectedDate){return null;}
			result=this.selectedDate;
		}

		return result;
		 
	},
	getNow:function(){
		return new Date();
	},
	/** 保存事件 */
	saveEvent:function(){
		var self = this;
        var max = this.maxCount;
		var textarea = $('#tb_content');
		$('#btn_save').click(function(){
			if(textarea.val().length > max){
				top.$Msg.alert('最多输入不能超过' + max + '字');
				return;
			}
			if(textarea.val().trim().length == 0){
				top.$Msg.alert('提醒内容不能为空');
				textarea.val('');
				return;
			}
            var remindTime = self.getInputTime();
            
            if(!remindTime){
            	top.$Msg.alert('请选择日期');
            	return ;
            }

            var smsChecked = $("#ck_sms").attr("checked")?1:0;
            var canChecked = $("#ck_canlendar").attr("checked")?1:0;
            var smsTime;
            if (smsChecked) {
            	smsTime = self.getSmsTime();
            	if (!smsTime) {
            		return ;
            	}
            }

            var content = textarea.val().trim();
			var data = {
				time:remindTime.getTime(),
				content:content,
                subject:content,
                status: self.initData.status,   // add、update
                type:self.initData.type,   //用于非邮件邮件添加日历识别
                smsTime: smsTime,
                isSaveSms: smsChecked,
                isSaveCalendar: canChecked
			};
			top.$App.trigger('saveMailRemind',data); 
			if (top.$App.isReadSessionMail()) {
                top.BH('cMail_tab_markTask');
            } else {
            	top.BH("task_save");
            }
		});
	},

	getSmsTime: function() {
    	var hour = + $('[name=hour4sms]').text();
    	var minu = + $('[name=minute4sms]').text();
    	var date = this.smsTime;

    	date.setHours(hour);
    	date.setMinutes(minu);
    	date.setSeconds(0);

    	if (date.getTime() < new Date().getTime()) {
    		top.$Msg.alert('提醒时间不能早于当前时间');
    		return null;
    	}

    	return date;
	},

	/** 取消事件 */
	cancelEvent:function(){
		$('#btn_cancel').click(function(){
			top.$App.trigger('cancelMailRemind',{});
		});
	},
	changeDateType:function(type,checkCtrl){
		/*if(type=="today"){
			$("#tb_today").removeClass();
			$("#tb_tomorrow").addClass("v-hide");
			$("#tb_selectedDate").hide();
		}else if(type=="tomorrow"){
			$("#tb_today").addClass("v-hide");
			$("#tb_tomorrow").removeClass();
			$("#tb_selectedDate").hide();
		} else if (type=="aftertomorrow") {

		} else if(type=="other"){
			$("#tb_today").addClass("v-hide");
			$("#tb_tomorrow").addClass("v-hide");

			$("#tb_selectedDate").show();
		}*/
		if(checkCtrl){
			$("input[type='radio']:checked").attr("checked",0);
			$("input[value='"+type+"']").attr("checked",1);
		}
	},
	monitorNumInput:function(){
		function addMonitor(input){
			var oldValue=input.val();
			$(input[0]).change( function () {
        		if(this.value.match(/^\d{1,2}:\d{1,2}$/ig)){
        			var time=this.value.split(":");
        			if((time[0]<24 && time[1]<60) || (time[0]==24 && time[1]==00)) {
        				oldValue=this.value;
        				return ;
        			}
        			

        		} 
        		this.value="09:00";//oldValue;//非法值，还原
        	});

		}
		
		addMonitor($("#tb_today"));
		addMonitor($("#tb_tomorrow"));
		addMonitor($("#tb_selectedDate"));
		


	},
	initEvents:function(data){
		this.initData = data;
		this.render();

		this.countEvent();
		// this.monitorNumInput();
		this.calendarPickerEvent();
		this.saveEvent();
		this.cancelEvent();
		/*
		this.selectHourEvent();
		this.selectMinuteEvent();
		*/
		var self=this;
		$("#calendarPicker").click(function(){
			$("#day_04").attr("checked",true);
			self.changeDateType("other");

		});
		$("input[type=radio]").change(function(){
			self.changeDateType(this.value);
		});
		
	}

}));
	
	$(function(){
        top.remindEditorView = window.remindEditorView = new M2012.Remind.Editor();
		top.$App.trigger('remindPageLoaded',{}); //发布页面加载完成
		top.$App.on('remindRender',function(data){ //接收输出提示框
            remindEditorView.initEvents(data);
            top.$App.off('remindRender');
		});
	})

        
})(jQuery, _, M139);    


