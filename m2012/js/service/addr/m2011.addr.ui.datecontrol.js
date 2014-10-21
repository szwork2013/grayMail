/**
*@param dateWarpId 日期控件 一dateWrapDomId元素为父元素，
**                 内嵌三个<slecet>作为年月日选择下拉框，
**                 class分别对应dateForYear、dateForMonth、dateForDay
**var date = new DateControl(DomId) init this dateControl
**    date.setDate("2011-01-03");set date
**    date.getDateString(); 
*/
function DateControl(dateWrapDomId){
	var _this =this;
    var _yearObj = $("#" +dateWrapDomId).find(".dateForYear")[0];
    var _monthObj = $("#" +dateWrapDomId).find(".dateForMonth")[0];
    var _dayObj = $("#" +dateWrapDomId).find(".dateForDay")[0];
    var Options = "<option value>--</option>";
    
    //绑定控件事件选择了年才能选择月 选择了月才能选择日期
    $(_yearObj).change(function(){
         _this.clickYear();
     });
        
     $(_monthObj).change(function(){
         _this.clickMonth();
     });
	 $(_dayObj).change(function(){
         _this.clickDay();
     });
	this.currentTime = new Date();
 
    this.year = _yearObj.value|| "";
    this.month = _monthObj.value || "";
    this.day = _dayObj.value || "";
    
    //this.MinYear = this.currentTime.getFullYear() - 100;  
    this.MinYear = 1900;  //设置最小年份1900年
    this.MaxYear = this.currentTime.getFullYear();       //获取今年年份
    
    this.yearObj = _yearObj; 
    this.monthObj = _monthObj;
    this.dayObj = _dayObj;
    
	//初始化日期控件
    this.init = function() {
        this.drawYear();
        this.drawMonth();
        this.drawDay();
	};
	
	//draw year select
    this.drawYear = function() {
		$(this.yearObj).empty();
		Options = "<option value>--</option>";
		$(Options).appendTo($(this.yearObj));
        for (var i = this.MaxYear; i >= this.MinYear; i--){
			if($.trim(this.year) == $.trim(i)){
				Options = "<option value=" + i + " selected> " + i +"</option>";
			}else{
				Options = "<option value=" + i + " > " + i +"</option>";
			}
			$(Options).appendTo($(this.yearObj));
        }
		//用户填写的时间不在本控件时间范围内1900~201+++内，则单独生产一个选项
		if(this.year>0 & this.year < this.MinYear){
			Options = "<option value=" + this.year + " selected> " + this.year +"</option>";
			$(Options).appendTo($(this.yearObj));
		}
    };
	//draw month select
    this.drawMonth = function() { 
		$(this.monthObj).empty();
		Options = "<option value>--</option>";
		$(Options).appendTo($(this.monthObj));
        for (var i = 1; i <= 12; i++){
		   if($.trim(this.month) == i){
				Options = "<option value=" + i + " selected> " + i +"</option>";
		   }else{
				Options = "<option value=" + i + "> " + i +"</option>";
		   }
		  $(Options).appendTo($(this.monthObj));
        }
    };
	//draw day  select 日期根据年和月来控制，瑞年2月29天
    this.drawDay = function() {
		$(this.dayObj).empty();
		 Options = "<option value>--</option>";
		$(Options).appendTo($(this.dayObj)); 
        if($.trim(this.year) ==""  || $.trim(this.month) == ""){ return;}
		for (var i = 1; i <= new Date(this.year,this.month,0).getDate(); i++){
			if($.trim(this.day) == i ){
			   Options = "<option value=" + i + " selected > " + i +"</option>";
			}else{ 
			  Options = "<option value=" + i + "> " + i +"</option>";
			}
			$(Options).appendTo($(this.dayObj));
		}
    };
    this.clickYear = function() {//this.yearObj.value 选中的值;
        this.year = this.yearObj.value;
		this.month = this.monthObj.value;
		this.day = this.dayObj.value; //改变年份，记住日期值
        this.drawMonth();
        this.drawDay();
    };
    
    this.clickMonth = function() {
        this.year = this.yearObj.value;
        this.month = this.monthObj.value;
		this.day = this.dayObj.value; //改变年份，记住日期值
        this.drawDay();
    };
	
	this.clickDay = function(){
	};
	
	
	this.setYear = function(Y){
	 if(this.IsEmpty(Y)){
		this.year = "";
		return;
	 }
	 this.year = Y;
	 this.yearObj.value = Y;
	 this.drawYear();
	};
	
	this.setMonth = function(M){
	 if(this.IsEmpty(M)){
		this.month = "";
		return;
	 }
	 this.month = M;
	 this.drawMonth();
	};
	
	this.setDay = function(D){
	 if(this.IsEmpty(D)){
	    this.day = "";
		return;
	}
	 this.day = D;
	 this.drawDay();
	};
	
	
	this.setDate = function(date){
	 if(this.IsEmpty(date)){return;}
	
	 var birArray = date.split("-");
	 if(birArray[0] && !_this.IsEmpty(birArray[0])){
	  this.setYear(birArray[0]);
	 }
	 if(birArray[1] && !_this.IsEmpty(birArray[1])){
	  this.setMonth(birArray[1]);
	 }
	
	 if(birArray[2] && !_this.IsEmpty(birArray[2])){
	  this.setDay(birArray[2]);
	 }
	};
	
	
	this.getYear = function(){
		return this.yearObj.value;
	}
	this.getMonth = function(){
		var m = this.monthObj.value;
		if(m && $.trim(m).length==1){
			m = "0" + m;
		}
		return m;
	}
	this.getDay = function(){
		var d = this.dayObj.value;
		if(d && $.trim(d).length==1){
			d = "0" + d;
		}
		return d;
	}
	this.getDateString = function(){
	  var y = this.getYear();
	  var m = this.getMonth();
	  var d = this.getDay();
	  var date;
	  if(!this.IsEmpty(y) && !this.IsEmpty (m) && !this.IsEmpty(d)){
		date = y + "-" + m + "-" + d;
	  }else{
		date = "";
	  }
	  return date;
	};
	
	this.IsEmpty = function(str){
	 if($.trim(str).length != 0 && str != null && str != "undefined" && str !=NaN && str != "--"){
		return false;
	  }
	  return true;
	};
	
	//初始化日期控件
	this.init(); 
}