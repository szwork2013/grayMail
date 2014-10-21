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

    el:"",

    template:{        
        editor:['<div class="boxIframeText">',
              '<div class="addtxcontent">',
         '<p class="fw_b pb_10">在以下时间短信提醒我：<span class="c_ff6600" id="remindTimeText">{remindtime}</span></p>',
         '<div class="clearfix">',
             '<div class="dropDown dropDown-ydm" id="calendarPicker">',
                '<div class="dropDownText fl">{date}</div>',
                '<a href="javascript:void(0)" class="i_ymd fl"></a>',
             '</div>',
             '<div class="dropDown dropDown-month" id="hourMenu">',
                 '<div class="dropDownA" href="javascript:void(0)">',
                     '<i class="i_triangle_d"></i>',
                 '</div>',
                 '<div class="dropDownText" id="hourText">{hour}</div>',
             '</div>',
             '<div class="ydmtext">时</div>',
             '<div class="dropDown dropDown-month" id="minuteMenu">',
                 '<div class="dropDownA" href="javascript:void(0)">',
                     '<i class="i_triangle_d"></i>',
                 '</div>',
                 '<div class="dropDownText" id="minuteText">{minute}</div>',
             '</div>',
             '<div class="ydmtext">分</div>',
         '</div>',
         '<p class="fw_b mt_20 pb_5">提醒内容:</p>',
         '<textarea id="content" class="iText">{content}</textarea>',
         '<p id="countTips">您还可以输入<span class="c_ff6600"></span>字，最多<span class="c_ff6600">{max}</span>字</p>',
     '</div>',
         '</div>',
         '<div class="boxIframeBtn">',
             '<span class="bibText"></span>',
                 '<span class="bibBtn">',
                     '<a href="javascript:;" class="btnSure"><span>确 定</span></a> <a href="javascript:;" class="btnNormal"><span>取 消</span></a>',
                 '</span>',
         '</div>'
         ].join("")
    },
    
    maxCount:100,
    
    initialize: function(){
        var self = this;
        return superClass.prototype.initialize.apply(this, arguments);
    },

    render:function(){
        var self = this;
        var data = this.initData;
        var dealTime = data.dealTime;
        var d = '';
        var status = self.initData.status;
        if(status && status == 'hasremind' && dealTime && dealTime > 0){
            d = new Date(dealTime);
        }else{
            d = new Date();
            d.setDate(d.getDate() + 1); //设为明天
        }
		var temp = this.template.editor;
		var content = $T.Utils.format(temp,{
			remindtime:d.format('yyyy-MM-dd hh:mm'),
			date:d.format('yyyy-MM-dd'),
			hour:d.format('hh'),
			minute:d.format('mm'),
			content:self.getContent(),
            max:self.maxCount
		});
		$('body').html(content);
	},
	
	/** 获取提醒内容 */
	getContent:function(){
        var content = this.initData.content;
        var max = this.maxCount;
        if(!content){
            var d = this.initData.listData;
            var temp = '请处理{date}来自{name}的邮件：{subject}';
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
		var day = $('#calendarPicker .dropDownText').text() || '',
			hour = $('#hourText').text() || '',
			minute = $('#minuteText').text() || '';
		$('#remindTimeText').text(day + ' ' + hour + ':' + minute); 
	},
	
	/** 日期控件 */
	calendarPickerEvent:function(){
        var self = this;
		var calendarPicker = new M2012.UI.Picker.Calendar({
				bindInput:$('#calendarPicker')[0],
				value: new Date(),
				stopPassDate: true
			});
		var pickerText = $('#calendarPicker .dropDownText');
		calendarPicker.on("select", function (e) {
			var calendar = e.value.format("yyyy-MM-dd");
			pickerText.html(calendar);
            self.setRemindTimeTips(); //重置
		});
	},
	
	/** 小时控件 */
	selectHourEvent:function(){
		var self = this;
		var hourItems = self.getMenuItems({begin:0,end:23,id:'hourText'});
        var hourMenu = M2012.UI.PopMenu.createWhenClick({
				target : $("#hourMenu")[0],
	            width : 55,
				maxHeight: 170,
                customClass: "setmonthPop",
	            items : hourItems
	    });
	},

	/** 分钟控件 */
	selectMinuteEvent:function(){
		var self = this;
		var minuteItems = self.getMenuItems({begin:0,end:59,id:'minuteText'});
        var hourMenu = M2012.UI.PopMenu.createWhenClick({
			target : $("#minuteMenu")[0],
			width : 55,
			maxHeight: 170,
            customClass: "setmonthPop",
			items : minuteItems
	    });
	},
	
	getMenuItems : function(options){
		var self = this,
			begin = options.begin,
			end = options.end,
			id = options.id,
			items = [];
		for(var i = begin;i <= end;i++){
			var text = '';
			text = i < 10 ? '0' + i : i;
			var item = {
				text : text,
				onClick : function() {
					$("#" + options.id).html(this.text);
					self.setRemindTimeTips(); //重置
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
		var textArea = document.getElementById('content');
		var countTips = $('#countTips');
		var countSpan = countTips.find('span:eq(0)');
		
		var initLen = max - textArea.value.length;
        
		initLen = initLen > 0 ? initLen : 0;
		countSpan.text(initLen);
		countTips.find('span:eq(1)').text(max);
        
        /*textArea.keydown(function(){
            self.countChangeEvent(this);
        }).keyup(function(){
            self.countChangeEvent(this);
        }).change(function(){
            self.countChangeEvent(this);
        });*/
        
        try{
            M139.Timing.watchInputChange(textArea, function () {
                var len = textArea.value.length;
                countSpan.text(max - len > 0 ? max - len : 0); 
                if(len > max){
                    self.countFlag = false;
                    textArea.value = textArea.value.substring(0,max);
                }else{
                    self.countFlag = true;
                }
            });
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
	
	/** 保存事件 */
	saveEvent:function(){
		var self = this;
        var max = this.maxCount;
		var textarea = $('#content');
		$('.btnSure').click(function(){
			if(textarea.val().length > max){
				$Msg.alert('最多输入不能超过' + max + '字');
				return;
			}
			if(textarea.val().trim().length == 0){
				$Msg.alert('提醒内容不能为空');
				textarea.val('');
				return;
			}
            var time = $('#remindTimeText').text() + ':00';
            var timeMillisecond = $Date.parse(time); //毫秒
            var now = new Date();
            var nowMillisecond = now.getTime();
            if(timeMillisecond <= nowMillisecond){
                $Msg.alert('下发提醒的时间不能早于当前时间，请重新选择提醒时间');
                return;
            }
            var content = textarea.val().trim();
			var data = {
				time:time,
				content:content,
                subject:content,
                status: self.initData.status,   // add、update
                type:self.initData.type   //用于非邮件邮件添加日历识别
			};
			top.$App.trigger('saveMailRemind',data);
		});
		
	},

	/** 取消事件 */
	cancelEvent:function(){
		$('.btnNormal').click(function(){
			top.$App.trigger('cancelMailRemind',{});
		});
	},
	
	initEvents:function(data){
		this.initData = data;
		this.render();
		this.calendarPickerEvent();
		this.selectHourEvent();
		this.selectMinuteEvent();
		this.saveEvent();
		this.cancelEvent();
		this.countEvent();
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


