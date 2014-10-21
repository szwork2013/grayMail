﻿/**
 * @fileOverview 定义选择器组件（包括选择时间、日历等）
 */
 (function (jQuery,_,M139){
 var $ = jQuery;
 var superClass = M139.View.ViewBase;
M139.namespace("M2012.UI.Picker.PickerBase",superClass.extend(
 /**
  *@lends M2012.UI.Picker.PickerBase.prototype
  */
{
    /** 弹出菜单组件
    *@constructs M2012.UI.Picker.PickerBase
    *@extends M139.View.ViewBase
    *@param {Object} options 初始化参数集
    *@param {String} options.template 组件的html代码
    *@param {HTMLElement} options.container 可选参数，容器，表示该控件是静止的
    *@param {HTMLElement} options.bindInput 可选参数，挂载的文本框
    *@example
    */
    initialize: function (options) {
        options = options || {};
        var $el = jQuery(options.template||this.template);
        this.setElement($el);

        //绑定文本框获得焦点事件
        this.bindHostEvent();

        return superClass.prototype.initialize.apply(this, arguments);
    },
    name: "M2012.UI.Picker.PickerBase",

    render:function(){
        //使render只执行一次
        this.render = function(){
            return this;
        }
        this.$el.appendTo(this.options.container || document.body);
        
        return superClass.prototype.render.apply(this, arguments);
    },

    /**
     *@param {Object} options 参数集
     *@param {HTMLElement} options.dockElement 可选参数，根据什么元素定位（缺省是以文本框定位）
     *@param {Number} options.top 可选参数定位坐标
     *@param {Number} options.left 可选参数定位坐标
     */
    show:function(options){
        options = options || {};
        var dockElement = options.dockElement || this.options.bindInput;

        if(dockElement){
            var param= {
                margin:10
            };
            if(options.dx){param.dx=options.dx;param.dy=options.dy;}
            M139.Dom.dockElement(dockElement, this.el,param);
        }else if(options.x && options.y){
            this.$el.css({
                top:options.y,
                left:options.x
            });
        }
        this.$el.css("z-index","9999");
        return superClass.prototype.show.apply(this, arguments);
    },

    hide:function(){
        M2012.UI.PopMenu.unBindAutoHide({
            action:"click",
            element:this.el
        });
        return superClass.prototype.hide.apply(this, arguments);
    },

    /**
     *绑定文本框获得焦点后显示控件
     *@inner
     */
    bindHostEvent:function(){
        if(!this.options.bindInput){
            return;
        }
        var This = this;

        this.$el.click(function (e) {
            M139.Event.stopEvent(e);
        });

        $(this.options.bindInput).click(function(){
            This.render().show(This.options);

            M2012.UI.PopMenu.bindAutoHide({
                action:"click",
                element:This.el,
                stopEvent:true,
                callback:function(){
                    This.hide();
                }
            });
        });
    },

    /**子类中调用，当选择值发生变化后，主动调用onSelect，会触发select事件*/
    onSelect:function(value,index){
        if(value === undefined){
            if(this.getValue){
                value = this.getValue();
            }else if(this.getSelectedValue){
                value = this.getSelectedValue();
            }
        }
        /**选择值发生变更的时候触发
        * @name M2012.UI.Picker.PickerBase#select
        * @event
        * @param {Object} e 事件参数
        * @example
        picker.on("select",function(e){
            e.value
        });
        */
        this.trigger("select",{value:value,index:index});
    }
}
));


})(jQuery,_,M139);
﻿/**
 * @fileOverview 定义日历控件
 */

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M2012.UI.Picker.PickerBase;
    M139.namespace("M2012.UI.Picker.Calendar", superClass.extend(
     /**
      *@lends M2012.UI.Picker.Calendar.prototype
      */
    {
        /** 日历选择组件
        *@constructs M2012.UI.Picker.Calendar
        *@extends M2012.UI.Picker.PickerBase
        *@param {Object} options 初始化参数集
        *@param {Date} options.value 初始化值
        *@param {Object} options.container 如果是静态控件，指定一个父容器
        *@param {Object} options.bindInput 如果是外挂，指定一个绑定的文本框
        *@param {Boolean} options.stopPassDate 是否禁选过去时间，默认是false
        *@example
        */
        initialize: function (options) {
            options = options || {};

            this.stopPassDate = options.stopPassDate;

            if (options.value) {
                if (this.stopPassDate) {
                    var now = new Date;
                    this.value = now > options.value ? now : options.value;
                } else {
                    this.value = options.value;
                }
            } else {
                this.value = new Date;
            }

            return superClass.prototype.initialize.apply(this, arguments);
        },
        name: "M2012.UI.Picker.Calendar",
        template:['<div class="dayControl" style="position:absolute;z-index:9999;background-color:white">',
             '<div class="dayControlTitle">',
                 '<a href="javascript:;" class="upYear UpMonth"></a>',
                 '<a href="javascript:;" class="upMonth UpYear"></a>',
                 '<span class="MonthLabel"></span>',
                 '<a href="javascript:;" class="downYear DownYear"></a>',
                 '<a href="javascript:;" class="downMonth DownMonth"></a>',
             '</div>',
             '<div class="dayControlNo"></div>',
             '<table>',
                 '<thead>',
                 '<tr>',
                     '<th>日</th>',
                     '<th>一</th>',
                     '<th>二</th>',
                     '<th>三</th>',
                     '<th>四</th>',
                     '<th>五</th>',
                     '<th>六</th>',
                 '</tr>',
                 '</thead>',
                 '<tbody>',
                 '</tbody>',
             '</table>',
         '</div>'].join(""),
        events:{
            "click a.UpYear": "onPrevYearClick",
            "click a.DownYear":"onNextYearClick",
            "click a.UpMonth":"onPrevMonthClick",
            "click a.DownMonth":"onNextMonthClick",
            "click td":"onDateClick"
        },
        render:function(){
            this.updateContent(this.value);
            return superClass.prototype.render.apply(this, arguments);
        },
        /**
         *@inner
         */
        onPrevYearClick: function () {
            if (this.stopPassDate) {
                var prevYear = new Date(this.curValue);
                prevYear.setFullYear(prevYear.getFullYear() - 1);
                if (this.compareMonth(new Date,prevYear) > 0) {
                    return;
                }
            }
            this.curValue.setFullYear(this.curValue.getFullYear() - 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextYearClick:function(){
            this.curValue.setFullYear(this.curValue.getFullYear() + 1);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onPrevMonthClick: function () {
            if (this.stopPassDate && this.isCurrentMonth(this.curValue)) {
                //禁选过去月
                return;
            }

            this.curValue.setDate(0);
            this.updateContent(this.curValue);
        },
        /**
         *@inner
         */
        onNextMonthClick:function(){
            this.curValue.setDate(32);
            this.updateContent(this.curValue);
        },

        /**
         *日期变更后刷新html
         *@inner
         */
        updateContent: function (date) {
            this.$("tbody").html(this.getCalendarHTML(date));
            this.$(".MonthLabel").text(date.format("yyyy-MM"));
            this.curValue = new Date(date);
            this.focusSelectedCell(date);
        },


        /**
         *让选中的日期单元格高亮
         *@inner
         */
        focusSelectedCell:function(){
            this.$("td.on").removeClass("on");
            var date = this.value.getDate();
            this.$("td[rel='" + date + "']").addClass("on");
        },

        /**@inner*/
        onDateClick:function(e){
            var td = e.target;
            var date = td.innerHTML;
            
            if(/\d+/.test(date)){
                var selDate = new Date(this.curValue);
                selDate.setDate(date);

                if (this.stopPassDate) {
                    var now = new Date();
                    if (!M139.Date.isSameDay(now, selDate) && now > selDate) {
                        return;
                    }
                }

                this.value = selDate;
                this.focusSelectedCell();
                this.onSelect(selDate);
                this.hide();
            }
        },

        //是否过去的月份
        compareMonth:function(date1,date2){
            if (date1.getFullYear() > date2.getFullYear()) {
                return 1;
            } else if (date1.getFullYear() < date2.getFullYear()) {
                return -1;
            } else {
                return date1.getMonth() - date2.getMonth();
            }
        },

        //是否本月
        isCurrentMonth: function (date) {
            var now = new Date();
            return date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear();
        },

        /**根据日期获得日期区域的html内容*/
        getCalendarHTML:function(date){
            var days = M139.Date.getDaysOfMonth(date);
            var firstMonthDay = M139.Date.getFirstWeekDayOfMonth(date);
            var htmlCode = [];
            var cellsCount = days + firstMonthDay ;

            //是否禁选过去时间
            var stopPassDate = this.stopPassDate;
            var passMonth = this.compareMonth(new Date(),date);
            var today = new Date().getDate();

            htmlCode.push("<tr>");
 
            for(var i=1,j=1;i<=cellsCount;i++,j++){
                if(i>firstMonthDay && j<=days){
                    htmlCode.push("<td rel='" + j + "' " + getColor(j) + ">" + j + "</td>");
                }else{
                    htmlCode.push("<td></td>");
                    j--;
                }
                if(i%7 == 0 || i==cellsCount){
                    htmlCode.push("</tr>");
                }
            }
            function getColor(date) {
                if (!stopPassDate) return "";
                var disableColor = 'style="color:silver;"';
                if (passMonth > 0) {
                    return disableColor;
                } else if (passMonth < 0) {
                    return "";
                }else{
                    return date < today ? disableColor : "";
                }
            }
            return htmlCode.join("");
        }
    }
    ));

    jQuery.extend(M2012.UI.Picker.Calendar , {
        create : function(options){
            var calendar = new M2012.UI.Picker.Calendar(options);
            return calendar;
        }
    });

})(jQuery, _, M139);
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



