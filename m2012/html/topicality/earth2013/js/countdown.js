/**
 * @fileOverview 定义倒计时组件.
 * @options {year : year,month : month,date : date,hour : hour,minute : minute,callback : callback}
 */
(function(){
	CountDown = function(options){
		// 构造函数
		this.year = options.year;
		this.month = options.month;
		this.date = options.date;
		this.hour = options.hour;
		this.minute = options.minute;
		this.callback = options.callback;
		
		this.timerID = null;
		this.timerRunning = false;
	};
	CountDown.prototype = {
		/**
		* 显示倒计时视图
		*/
		show: function() {
			var self = this;
			var today = new Date();
			var nowHour = today.getHours();
			var nowMinute = today.getMinutes();
			var nowMonth = today.getMonth();
			var nowDate = today.getDate();
			var nowYear = today.getFullYear();
			var nowSecond = today.getSeconds();
			today = null;
			hourleft = self.hour - nowHour;
			minuteleft = self.minute - nowMinute;
			secondleft = 0 - nowSecond;
			yearleft = self.year - nowYear;
			monthleft = self.month - nowMonth - 1;
			dateleft = self.date - nowDate;
			if(secondleft < 0) {
				secondleft = 60 + secondleft;
				minuteleft = minuteleft - 1;
			}
			if(minuteleft < 0) {
				minuteleft = 60 + minuteleft;
				hourleft = hourleft - 1;
			}
			if(hourleft < 0) {
				hourleft = 24 + hourleft;
				dateleft = dateleft - 1;
			}
			if(dateleft < 0) {
				dateleft = $Date.getDaysOfMonth(new Date()) + dateleft;
				monthleft = monthleft - 1;
			}
			if(monthleft < 0) {
				monthleft = 12 + monthleft;
				yearleft = yearleft - 1;
			} else {
				if(monthleft == 2){
					dateleft += monthleft * 30 - 1;
				}else{
					dateleft += 28;
				}
			}
			dateleft-=28;
			//dateleft-=$Date.getDaysOfMonth(new Date());
			//Temp=yearleft+'年, '+monthleft+'月, '+dateleft+'天, '+hourleft+'小时, '+minuteleft+'分, '+secondleft+'秒'
			dateleft = dateleft < 10 ? '0' + dateleft : dateleft;
			hourleft = hourleft < 10 ? '0' + hourleft : hourleft;
			minuteleft = minuteleft < 10 ? '0' + minuteleft : minuteleft;
			secondleft = secondleft < 10 ? '0' + secondleft : secondleft;
			
			var time = {year : yearleft,month : monthleft,date : dateleft,hour : hourleft,minute : minuteleft,second : secondleft};
			self.callback(time);
			if(self.timerID){
				clearTimeout(self.timerID);
			}
			self.timerID = setTimeout(function(){
				self.show();
			}, 1000);
			self.timerRunning = true;
		},
		stop: function(){
			var self = this;
			if(self.timerRunning){
				clearTimeout(self.timerID);
			}
			self.timerRunning = false;
		},
		start : function() {
			var self = this;
			self.stop();
			self.show();
		}
	};
})();