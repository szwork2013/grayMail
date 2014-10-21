/*********************************浏览器检查*************************************/

		var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		//请求彩信站点域名
		var mmsHost=!top.isRichmail?"http://"+window.location.host+"/":top.SiteConfig["mmsMiddleware"];
        //以下进行测试
        //if (Sys.ie) document.write('IE: ' + Sys.ie);
        //if (Sys.firefox) document.write('Firefox: ' + Sys.firefox);
        //if (Sys.chrome) document.write('Chrome: ' + Sys.chrome);
        //if (Sys.opera) document.write('Opera: ' + Sys.opera);
        //if (Sys.safari) document.write('Safari: ' + Sys.safari);
		
/******************************flash 创建*******************************************/
function SWFObject(swf, id, w, h, ver, c){
	
	this.params = new Object();
	this.variables = new Object();
	this.attributes = new Object();
	this.setAttribute("id",id);
	this.setAttribute("name",id);
	this.setAttribute("width",w);
	this.setAttribute("height",h);
	this.setAttribute("version",ver);
	this.setAttribute("swf",swf);
	
	this.setAttribute("classid","clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	this.addParam("bgcolor",c);
}
SWFObject.prototype.addParam = function(key,value){
	this.params[key] = value;
}
SWFObject.prototype.getParam = function(key){
	return this.params[key];
}
SWFObject.prototype.addVariable = function(key,value){
	this.variables[key] = value;
}
SWFObject.prototype.getVariable = function(key){
	return this.variables[key];
}
SWFObject.prototype.setAttribute = function(key,value){
	this.attributes[key] = value;
}
SWFObject.prototype.getAttribute = function(key){
	return this.attributes[key];
}
SWFObject.prototype.getVariablePairs = function(){
	var variablePairs = new Array();
	for(key in this.variables){
		variablePairs.push(key +"="+ this.variables[key]);
	}
	return variablePairs;
}
//wmode="transparent"
SWFObject.prototype.getHTML = function(){

	var con = '';
	if (Sys.chrome) 
	{
		con += '<embed type="application/x-shockwave-flash"   pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}
	else if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
		con += '<embed type="application/x-shockwave-flash"  wmode="transparent"  pluginspage="http://www.macromedia.com/go/getflashplayer" src="'+ this.getAttribute('swf') +'" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'"';
		con += ' id="'+ this.getAttribute('id') +'" name="'+ this.getAttribute('id') +'" ';
		for(var key in this.params){ 
			con += [key] +'="'+ this.params[key] +'" '; 
		}
		var pairs = this.getVariablePairs().join("&");
		if (pairs.length > 0){ 
			con += 'flashvars="'+ pairs +'"'; 
		}
		con += '/>';
	}else{
		con = '<object id="'+ this.getAttribute('id') +'" classid="'+ this.getAttribute('classid') +'"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.setAttribute("version")+',0,0,0" width="'+ this.getAttribute('width') +'" height="'+ this.getAttribute('height') +'">';
		con += '<param name="movie" value="'+ this.getAttribute('swf') +'" />';
		for(var key in this.params) {
		 con += '<param name="'+ key +'" value="'+ this.params[key] +'" />';
		}
		var pairs = this.getVariablePairs().join("&");
		if(pairs.length > 0) {con += '<param name="flashvars" value="'+ pairs +'" />';}
		con += "</object>";
	}
	return con;
}
SWFObject.prototype.write = function(elementId){	
	if(typeof elementId == 'undefined'){
		document.write(this.getHTML());
	}else{
		var n = (typeof elementId == 'string') ? document.getElementById(elementId) : elementId;
		n.innerHTML = this.getHTML();
	}
}
/*************************************************************************/

/**
 * 全局变量提示语
 */
var mmsPopMsg = {
    PromptMsg: "可同时发给{0}个人，手机号以逗号或分号隔开",
    MMSSendToMaxLength: "超过最大发送人数",
    MMSPreviewTitle: "彩信预览",
    DataLoadFail: "数据加载失败",
    ValidMobile: "请正确填写接收手机号码",
    WrongMobile: "不是中国移动手机号码！请检查输入！",
    ValidCode: "请输入验证码",
    InputMobiles: "请填写接收手机",
    SendingMMS: "正在发送彩信",
    Previewing: "正在获取预览效果",
    SystemBusy: "系统正忙！",
    FlashBuilderMMS:"正在生成彩信！",
    FlashBuilderMMSError:"图片合成失败，请关闭预览框再试",
	FlashBuilderMMSError1:"图片上传失败，请关闭预览框再试",
	FlashBuilderMMSError2:"程序开了点小差，请关闭预览框再试",
	FlashBuilderMMSError4:"暂未添加任何内容",
	
	DIYFlashBuilderMMSError:"图片合成失败，请稍候再试",
	DIYFlashBuilderMMSError1:"图片上传失败，请稍候再试",
	DIYFlashBuilderMMSError2:"程序开了点小差，请稍候再试",
	
    FlashBuilderMMSEmpty:"彩信不完整！",
    MMSPerviewErrorInfo:"没有任何可预览的彩信！",
    MMSSendFail:"彩信发送失败！",
    MMSMTLoading:"正在加载数据，请稍候！",
    MMSEditting:"正在加载编辑的彩信,请稍候！",
	SubjectTip:"标题长度不能超过50个字！",
	MMSContentTip:"彩信内容不能超过10000个字！",
	MMSDIYCancle:"离开后彩信将不保存。确定离开吗？",
	//ReceiveMaxMobile:"很抱歉，您每次最多可同时发送{0}个号码，请您删除多余号码再试！",
	ReceiveMaxMobile: "发送人数超过上限：{0}人",
	FlashMMSContentIsEmpty:"您尚未添加彩字内容，无法发送",
	DefaultTitle:"为您制作的彩信",
	FlashPreviewMMSContentIsEmpty:"您尚未添加彩字内容，无法预览！",
	MMSContentAndSujectIsEmpty:"彩信内容和彩信标题都为空不能发送彩信！",
	MMSContentIsEmpty:"彩信内容为空不能发送彩信！",
	MMSContentIsEmptySave:"彩信内容为空不能存草稿！",
	VALIDATE_ERR: "验证码填写不正确，请重新填写!",
	ComboUpgradeMsg: '，<a href="javascript:top.$App.showOrderinfo();" style="color:#0344AE">升级邮箱</a>可添加更多！'
};
//全局变量，为下接列表显示优化
var arr=[]; 
var optionIndex=0;
var optionTimer;

/**
 * 彩信预览组件
 */
var MMSPerview={
	/**
	 * URL：预览框内页的URL地址
	 */
  	Url: "/m2012/html/mms/mmsFactory_window.html?rnd="+Math.random()+"&sid="+top.$App.getSid(),
    
	/**
	 * 打开预览框方法
	 * @param {Object} type:1代表彩仓点击的预览,2代表DIY时点击的预览,3彩信记录 4代表成功页预览,6简洁版预览
	 * @param {Object} mms:彩信的JSON形式
	 * @param {Object} size:0为320 240 1为176 220 2为128 128
	 */
	Open:function(type,mms,size)
	{
		//debugger;
    	//将要预览的彩信保存在Top变量中
    	top.MMSPerviewData=new Object();
	     //彩仓库预览
	    if(type==1)
	    {
			var data=$(mms).attr("maininfo");
			data = data.substring(7, data.length-1);
			var json=$.evalJSON(unescape(data));
			top.MMSPerviewData.MMS=json[0];
			toLowers(top.MMSPerviewData.MMS); //大写键转小写
			toLowers(top.MMSPerviewData.MMS.frameList);
			//将content中的路径赋值给contentPath, 并清空content;
			contentToPath(top.MMSPerviewData.MMS.frameList);
			
			//点击素材的日志
			Utils.logReports({
				mouduleId: 16,
				action: 20116,
				thing: "mmsMaterial"
			});
	    } 
		else if(type==6)
		{
			mms=Utils.getCookie("tempPreMMS");
			Utils.setCookie("tempPreMMS","");
		    if (mms.length > 0) {
				mms = unescape(mms);
				var json = $.evalJSON(mms);
				top.MMSPerviewData.MMS = json[0];
				toLowers(top.MMSPerviewData.MMS); //大写键转小写
				toLowers(top.MMSPerviewData.MMS.frameList);
				//将content中的路径赋值给contentPath, 并清空content;
				contentToPath(top.MMSPerviewData.MMS.frameList);
			}
			type=1;

			//点击素材的日志
			Utils.logReports({
				mouduleId: 16,
				action: 20116,
				thing: "mmsMaterial"
			});
		}   
	    else
	    {       
	        top.MMSPerviewData.MMS=mms;
			
			//点击素材的日志
			Utils.logReports({
				mouduleId: 16,
				action: 20116,
				thing: "mmsMaterial"
			});
	    }   
    	//预览的类型
    	top.MMSPerviewData.Type=type;
    	//彩信预览的尺寸
    	top.MMSPerviewData.Size=size;
		//DIY页进行的彩信预览
	    if(type==2)
	    {
			try {
				//将Flash对象存储在Top变量中	
				var flash=document.getElementById("FlashDIYMMS");
				top.MMSPerviewData.FlashCallBack = flash;
				//其他属性
				top.MMSPerviewData.SaveChecked = $("#chkSave").attr("checked");
				top.MMSPerviewData.TimmingChecked = $("#chkTimming").attr("checked");
				top.MMSPerviewData.TimmingYear = $("#sltYear").selectedValues()[0];
				top.MMSPerviewData.TimmingMonth = $("#sltMonth").selectedValues()[0];
				top.MMSPerviewData.TimmingDay = $("#sltDay").selectedValues()[0];
				top.MMSPerviewData.TimmingHour = $("#sltHour").selectedValues()[0];
				top.MMSPerviewData.TimmingMinute = $("#sltMinute").selectedValues()[0];
			}
			catch(e){}
	    }
		else if(top.MMSPerviewData.MMS.frameList==null||top.MMSPerviewData.MMS.frameList.length<=0)
	    {
	       //没有任何可预览的彩信
	        alert(mmsPopMsg.MMSPerviewErrorInfo); 
	        return;
	    }
	    var mmsWindowHeight = 392;
	    var birthdayURL = "";
	    try
	    {
	        if(isBirthdayPage)
	        {
	            birthdayURL = "&birthday=1&singleBirthDay=1";
	            mmsWindowHeight = 482;
	        }
	    }
	    catch(e){
	    }
      	
	    var ff=FloatingFrame.open(mmsPopMsg.MMSPreviewTitle, MMSPerview.Url + birthdayURL +"&rnd="+Math.random(), 800, mmsWindowHeight,true,null,true, false);
	    ff.onclose=function(){
	   		if (Sys.chrome)
				{
					//隐藏Flash
					$("#swfcontent").css("visibility","visible");
				}
	    };
		top.WindowFF=ff;
	},

	/**
	 * 关闭当前预览窗口
	 */
	Close:function()
	{
		/*if(top.MMSPerviewData.FlashCallBack!=null)
		{
			var flash=top.MMSPerviewData.FlashCallBack;
			if (Sys.chrome)
			 {
							$(flash).removeAttr("wmode");
			}
		}*/	
		//alert('fsf');
	   top.WindowFF.close();
	   //FloatingFrame.close(); 
	}
};  
  
/**
* 自制彩信
*/
var MMSDIY={
	/**
	 * 当前操作动作1:发送2:预览
	 */
	OperatorAction:-1,
	
	/**
	 * 当前编辑中的彩信
	 */
	CurrentMMS:{} ,
	
	/**
	 * 当是处理彩信记录编辑状态
	 */
	RecordEditting:false,
	
	/**
	 * 彩信是否有编辑过
	 */
	Edited:false,
	
	/**
	 * 彩信DIY页面初始化
	 */
	Init:function()
	{
		//debugger;
		//初始化接收人输入框
		MMSCommonHelper.InitReceivePerson();
		//初始化公共类 
		MMSCommonHelper.Init(true);
		//初始化导航 
		MMSCommonHelper.InitTools(); 
	   
		//确定编辑来源，如果type==1那么为彩信记录或者彩云过来的编辑
		var type=parseInt(Utils.queryString("type"));
		if(type==1)
		{ 		
			//从彩信记录页过来编辑的     
			MMSDIY.RecordEditting=true;  
			// 编辑的数据为定时
			if(top._EditTimmingGroupId!=-1 && parseInt(top._EditTimmingGroupId)>0)
			{
			    //同步定时选项和时间
			   $("#chkTimming").attr("checked",true);
			  
			   $("#sltYear").selectOptions(top._MMSDIYEditFromSource.TimmingYear);
			   MMSCommonHelper.IsEditSynchronizationYear=true;
			   
			   $("#sltMonth").selectOptions(top._MMSDIYEditFromSource.TimmingMonth);
			   $("#sltDay").selectOptions(top._MMSDIYEditFromSource.TimmingDay);
			   $("#sltHour").selectOptions(top._MMSDIYEditFromSource.TimmingHour);
			   $("#sltMinute").selectOptions(top._MMSDIYEditFromSource.TimmingMinute);
			}
			//获取待编辑彩信的接收人
			var des=top._MMSDIYEditFromSource.destNumber; 
			//获取待编辑彩信的主题
			$("#txtSubject").val(top._MMSDIYEditFromSource.subject);
			
			//如果有多个接收人				        
			if(des && des.toString().length>0 && des.indexOf(",")>0)
			{
			    //有多个号码
			    var numbers=des.split(",");
			    if(numbers.length>0)
			    {
					//debugger;
					richInput.setTipText("");
					var addrobj;
					var temp;
			        for(var i=0;i<numbers.length;i++)
			        {			              
						addrobj= top.Contacts.getContactsByMobile(numbers[i]);
		        		if(addrobj.length>0)
		        		{	
							temp=numbers[i].substring(0,2);
							if(temp=="86")
							{
								numbers[i]=numbers[i].substring(2);
							}
	            			richInput.insertItem('"'+addrobj[0].name+'"'+"<"+numbers[i]+">");
		        	    }   
		        	    else
		                {
		                     richInput.insertItem('"'+numbers[i]+'"'+"<"+numbers[i]+">");
		                }
			        }
			    }
			   
			} 
			else if(des && des.length>0)
			{
				richInput.setTipText("");
				var addrobj= top.Contacts.getContactsByMobile(des);
		        if(addrobj.length>0)
		        {	
	               var temp=des.substring(0,2);
					if(temp=="86")
					{
						des=des.substring(2);
					}
		           richInput.insertItem('"'+addrobj[0].name+'"'+"<"+des+">");
		        }   
		        else
		        {
		             richInput.insertItem('"'+des+'"'+"<"+des+">");
		        }
			}
		}
		
		//验证码输入提示
		$("#txtValidCode").val(mmsPopMsg.ValidCode);
		$(".tooltip").hide();
		MMSCommonHelper.IsShowValidCode();
		
		//如果没有主题，添写默认主题
		if($.trim($("#txtSubject").val()).length<=0){
			try {
			    $("#txtSubject").val(MMSCommonHelper.getDefaultSubject().decode());
			}
			catch(e){}
		}
		


		if (/.*电子名片$/.test($("#txtSubject").val())) {
			$("#chkSave, #chkTimming").removeAttr("checked").attr("disabled", "disabled");
		}

		//如果定时复选为选中的，那么 显示日期时间输入框
		if($("#chkTimming").attr("checked"))
		{
			$("#spYearToDay, #spHourToMin").css("display","inline");
		} 
		
		$("#txtSubject").focus(function(){//样式控制不了，只好js控制了
			$(this).addClass("bgF");
		}).blur(function(){
			$(this).removeClass("bgF");
		})

        document.getElementById("txtSubject").onpaste=function(){
            //最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
        };
		//标题输入框
		$("#txtSubject").change(function()
		{
			//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});
	
	    //标题输入框
		$("#txtSubject").keyup(function()
		{
				//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				//显示提示
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});
		
		//彩信上方、下方预览按钮
		$("#btnTopPreview, #btnBottomPreview").click(function(){
		    if(Utils.PageisTimeOut(true))return false;
		    MMSDIY.OperatorAction = 2;
			//打开预览框
			//获取当前彩信
			var mms= MMSDIY.GetCurrentMMS();
			//获取flash合成后的帧数据
			mms.frameList=null;
			var flash=document.getElementById("FlashDIYMMS");
			var type=0;
			if(flash!=null)
			{
				try {
					type = flash.mmsSizeIndex();
				}
				catch(e){alert(e);}
			}
            /*if (Sys.chrome) {
                //隐藏Flash
                $("#swfcontent").css("visibility", "hidden");
            }*/

			MMSPerview.Open(2,mms,type==-1?0:type);
		});
		
		//彩信DIY页上方、下方发送按钮
		$("#btnTopSend, #btnBottomSend").click(function(){
			if(Utils.PageisTimeOut(true))return false;
			//如果彩信基本验证未通过则返回false
			if(!MMSCommonHelper.MMSBaseValid())
			{
					return false;
			}
			
			MMSDIY.OperatorAction=1;
			top.WaitPannel.show(mmsPopMsg.FlashBuilderMMS);          
			MMSDIY.CallFlashOutputMMS();
		});
	    
		//看不清，重新获取验证码  
		$("#aValidCodeRefresh").click(function(){
			MMSCommonHelper.RefreshImgRndCode('imgValidate');
			
				return false;
		});
		   
		//收信人添加事件
		$("#aContact").click(function()
		{
			if(Utils.PageisTimeOut(true))return false;
			//点击发送添加的日志上报
			Utils.logReports({
				mouduleId: 16,
				action: 20109,
				thing: "receiveMan"
			});
			//添加联系人
			return MMSCommonHelper.AddContact($(this));
		});    
	    
		//选择月份
		$("#sltMonth").change(function(){
			 MMSCommonHelper.ChangeMonth();
		}); 
	
		//点击验证码输入框事件
		$("#txtValidCode").focus(function(e) {
			e.stopPropagation();
            if (this.value == mmsPopMsg.ValidCode) {
                this.value = "";
                $(this).removeClass("input-default");
            }
            $("#trValide").addClass("show-rnd-img");
            $("#spValidCode").show();

            // ie中由于验证码图片被flash遮挡住，需要重新定位
            if ($.browser.msie) {
                $("#spValidCode").css({top: "24px", bottom: "auto"});
            }

			//显示验证码
			// MMSCommonHelper.RefreshImgRndCode('imgValidate'); 
            $(document).click(function(e) {
                var elem = e.target;
                while(elem && elem.id != "divValidate"){
	                elem = elem.parentNode;
	            }

	            if(!elem || e.target.id == "spanValidate") {
                    $(document).unbind("click");
                    $("#trValide").removeClass("show-rnd-img");
                    $("#spValidCode").hide();
                }
            });
        });
	
		//如果彩信标题更新过就认为编辑过彩信
		$("#txtSubject").change(function(){
			MMSDIY.Edited=true;
		});
	    
		//静态页处理  
		//Tab菜单
		$(".liTabbar").each(function(index,item){
			$($(item).children()[0]).click(function(){   
			    if (MMSCommonHelper.IsLoadingMenuData) return false;
				top.WaitPannel.show(mmsPopMsg.MMSMTLoading);
				MMSCommonHelper.IsLoadingMenuData = true;
				MMSDIY.ProcessTabbar(this);
			});
		});
		
	    //默认菜单
	    var url=MMSCommonHelper.StaticPageHost+"mmsdiy/mmsdiymenu.html?rd"+Math.random(); 
	    //加载默认菜单
		MMSDIY.AmmsTabbar(url,"mmsdiy","hot"); 		
	  
	    //页码选择
		MMSCommonHelper.selectPageTool();
	  
	    //flash对象初始化
		var swfUrl = "/m2012/flash/Richinfo_mms.swf?rd="+ Math.random();
		var so = new SWFObject(swfUrl, "FlashDIYMMS", "566", "475", 9, "#869ca7");
		
		so.addParam("quality", "high");
		so.addParam("swLiveConnect", "true");
		so.addParam("menu", "false");
		so.addParam("allowScriptAccess", "sameDomain");
		//so.addParam("wmode", "transparent");
		if($.browser.msie) {
			//so.addParam("wmode","opaque");
		}
		so.addVariable("movie", swfUrl);
		so.addParam("movie", swfUrl);
		so.write(document.getElementById("swfcontent"));
		
		$("#swfcontent").css({position:"relative", "z-index":"1"})
			.prev("table").css({position:"relative", "z-index":"100"});
	},
	
	/**
	 * 调用Flash合成接口
	 */
	CallFlashOutputMMS:function()
	{          
		//获取flash对象
		var flash=document.getElementById("FlashDIYMMS");
		if(MMSDIY.OperatorAction==1)
		{
		    $("#btnTopSend, #btnBottomPreview, #btnTopPreview, #btnBottomSend").attr("disabled","true");     
		}  
		 try
		{
		    //调用Flash输出
		    flash.outputMMS();
		}
		catch(e)
		{
			//显示错误信息
		    FloatingFrame.alert(mmsPopMsg.FlashBuilderMMSError2);
		}  
	},
	
	/***
	 * Flash点击上传图片后会调此接口，用于日志上报 
	 */
	uploadImage:function()
	{
		//做日志报
		Utils.logReports({
			mouduleId: 16,
			action: 20112,
			thingId: 1,
			thing: "uploadImage"
		});
	},
	/***
	 * Flash点击拍照后会调此接口，用于日志上报 
	 */
	takePhoto:function()
	{
		//做日志报
		Utils.logReports({
			mouduleId: 16,
			action: 20112,
			thingId: 3,
			thing: "takePhoto"
		});
	},
	/**
	 * 改变尺寸时做日志上报
	 */
    sizeSelect:function()
	{
	},
	
	/**
	 * Flash点击上传音乐后会调此接口，用于日志上报
	 */
	uploadMusic:function()
	{
		//做日志报
		Utils.logReports({
			mouduleId: 16,
			action: 20112,
			thingId: 5,
			thing: "uploadMusic"
		});
	},
		
	/**
	 * Flash合成完成之后接口
	 * @param {Object} frameList：合成返回的结果
	 * @param {Object} size：彩信规格
	 */
	outputMMSComplete:function(frameList,size)
	{
		//debugger;
		if(typeof frameList != "string"){
			//如果frameList中有内容，则将键转换成首字母小写
			if(frameList.length > 0){
				toLowers(frameList);
			}
			contentToPath(frameList);
		}
		
		top.WaitPannel.hide();
		//debugger;
		//如果是预览窗口的输出
		if(MMSDIY.OperatorAction==2)
		{
		   //debugger;		
			switch(frameList)
			{
				//合成失败
				case "-100":
				     top.MMSPerviewData.WindowPerviewFlashFailEvent(-100);
				break;
				//超过100kb容量
				case "-101" :
				 	top.MMSPerviewData.WindowPerviewFlashFailEvent(-101);					
				break;
				//Flash上传Gif到分布式失败
				case "-102":
					top.MMSPerviewData.WindowPerviewFlashFailEvent(-102);					
				break;
				//Flash上传Gif到分布式在规定时间内未完成,失败
				case "-103":
					top.MMSPerviewData.WindowPerviewFlashFailEvent(-103);
				break;
				//没有要合成的数据,失败
				case "-104":
					top.MMSPerviewData.WindowPerviewFlashFailEvent(-104);					
				break;
				default: 
					//合成后的彩信帧数据
					//debugger;
					top.MMSPerviewData.MMS.frameList=frameList;
					//当前动作为预览
					if(MMSDIY.OperatorAction==2)
					{
						if(top.MMSPerviewData.MMS.frameList!=null && top.MMSPerviewData.MMS.frameList.length>0)
						{ 
							//开始预览
							//初始化数据并播放第一帧 
							//PerviewWindow.InitPerviewData();
							top.MMSPerviewData.WindowPerviewEvent();
						}
						else
						{
							//没有任何可预览的彩信                
							alert(mmsPopMsg.MMSPerviewErrorInfo);            
						} 
					}
			}

			   return;
		} 
		
		//合成后的结果，发送彩信DIY
		switch(frameList)
		{    
			//合成失败
			case "-100":
			    MMSDIY.setButtonEnable(-100,mmsPopMsg.DIYFlashBuilderMMSError);
				//FloatingFrame.alert(mmsPopMsg.FlashBuilderMMSError+"  Code:"+frameList);
			break;
			//超过100kb容量
			case "-101" :
			    MMSDIY.setButtonEnable(-101,mmsPopMsg.DIYFlashBuilderMMSError);
				//FloatingFrame.alert(mmsPopMsg.FlashBuilderMMSError+"  Code:"+frameList);
			break;
			//Flash上传Gif到分布式失败
			case "-102":
			     MMSDIY.setButtonEnable(-102,mmsPopMsg.DIYFlashBuilderMMSError1);
				//FloatingFrame.alert(mmsPopMsg.FlashBuilderMMSError1+"  Code:"+frameList);
			break;
			//Flash上传Gif到分布式在规定时间内未完成,失败
			case "-103":
			    MMSDIY.setButtonEnable(-103,mmsPopMsg.DIYFlashBuilderMMSError1);
				//FloatingFrame.alert(mmsPopMsg.FlashBuilderMMSError1+"  Code:"+frameList);
			break;
			//没有要合成的数据,失败
			case "-104":
				//获取当前彩信
				//debugger;
				var mms= MMSDIY.GetCurrentMMS();
				
				if($.trim(mms.subject).length<=0)
				{
					if (Sys.chrome) {
						alert(mmsPopMsg.MMSContentAndSujectIsEmpty)
					}
					else {
						FloatingFrame.alert(mmsPopMsg.MMSContentAndSujectIsEmpty);
					}
					$("#btnTopSend").removeAttr("disabled"); 
					$("#btnTopPreview").removeAttr("disabled");   
					$("#btnBottomSend").removeAttr("disabled"); 
					$("#btnBottomPreview").removeAttr("disabled"); 
				}
				else
				{
				  if (Sys.chrome) {
					alert(mmsPopMsg.MMSContentIsEmpty);

					$("#btnTopSend").removeAttr("disabled"); 
					$("#btnTopPreview").removeAttr("disabled");   
					$("#btnBottomSend").removeAttr("disabled"); 
					$("#btnBottomPreview").removeAttr("disabled");
				  }
				  else{
					FF.alert(mmsPopMsg.MMSContentIsEmpty);

					$("#btnTopSend").removeAttr("disabled");
					$("#btnTopPreview").removeAttr("disabled");
					$("#btnBottomSend").removeAttr("disabled");
					$("#btnBottomPreview").removeAttr("disabled");
					}
				}
			break;
			default: 
				//获取当前彩信
				var mms= MMSDIY.GetCurrentMMS();
				//获取flash合成后的帧数据
				mms.frameList=frameList;
				
				//将按钮至灰                          
				$("#btnTopSend").attr("disabled","true"); 
				$("#btnTopPreview").attr("disabled","true");   
				$("#btnBottomSend").attr("disabled","true"); 
				$("#btnBottomPreview").attr("disabled","true");  
				
				var timmingDate="";
				if($("#chkTimming").attr("checked"))
				{
				    //如果定时选中
					timmingDate += $("#sltYear").val() + $("#sltMonth").val() + $("#sltDay").val() + " " + $("#sltHour").val() + ":" + $("#sltMinute").val() + ":" + "00";
				}

				//点击发送按钮的日志上报
				Utils.logReports({
					mouduleId: 16,
					action: 20107,
					thing: "MMSDIYSend"
				});

				//记录日志(图片尺寸)
				var th=parseInt(size)+1;
				Utils.logReports({
					mouduleId: 16,
					action: 20113,
					thingId: th,
					thing: "MMSDIYSize"
				});
				  
			    top.WaitPannel.hide();
				//发送彩信
				var result= MMSCommonHelper.MMSSend(mms,$("#chkSave").attr("checked"),$("#chkTimming").attr("checked"),timmingDate,2);	
		} 
	},
	setButtonEnable:function(errorCode,errormsg)
	{
		$("#btnTopSend, #btnBottomPreview, #btnTopPreview, #btnBottomSend").removeAttr("disabled");
		
		if (Sys.chrome) 
		{
		    // system alert
		    alert(errormsg+"   Code:"+errorCode);
		}else
		{
		    FloatingFrame.alert(errormsg+"   Code:"+errorCode);
		}
	},
	/**
	 * 播放音乐
	 * @param {Object} fileId[音乐的路径：如果包含uploads/串则为彩信共享目录音乐，否则为存在分布式的音乐]
	 * @param {Object} musicName
	 */
	playMusic:function(fileId,musicName)
	{	
		//debugger;
		if(fileId.toLowerCase().indexOf("uploads/")>0)
		{
			//此音乐为公共目录数据
			fileId= fileId.toLowerCase().replace("/"+MMSCommonHelper.SuperMMSStorage,MMSCommonHelper.SuperMMSResource);
			var tempurl= "/m2012/html/mms/mmsMusicplay.html?sid="+top.$App.getSid()+"&musicName="+escape(musicName)+"&url="+fileId;
			window.open(tempurl,'音乐试听','width=490,height=160,scrollbars=no,top=200');
		}
		else
		{
			//Get请求的参数
			var dataJson = {
				fileId:fileId,
				fileName: musicName
			};
			
			var dataXml = namedVarToXML("", dataJson, "");
			$.ajax({
				type: "POST",
				cache:false,
				dataType: "json",
				data: dataXml,
				url: Utils.getAddedSiteUrl("mmsMusic"),
				contentType:"application/xml;charset:utf-8",
				success: function(msg){
				    var tempurl =  "/m2012/html/mms/mmsMusicplay.html?musicName=" + musicName + "&url=" + msg.musicPath;
					window.open(tempurl,'音乐试听','width=490,height=160,scrollbars=no,top=200');
				},
				error: function(result){
					FloatingFrame.alert(mmsPopMsg.SystemBusy);
				}
			});
		}
	
	},

	/**
	 * 处理右边Tabbar
	 * @param {Object} ele:点击的Tabbar对象
	 */
	ProcessTabbar: function (ele) {
		if ($($("#aToolsmmsSend").parent()).attr("class") == "curr_n") {
			$(".liflashMMS").each(function(){
				this.className = "liflashMMS";
			})
			
			ele.parentNode.className = "liflashMMS on";
		} else {
			$(".liTabbar").each(function(){
				this.className = "liTabbar";
			});
			
			ele.parentNode.className = "liTabbar on";
		}
		clearInterval(optionTimer);
		switch (ele.id) {
			//彩信Bar
			case "amms": 
				var url=MMSCommonHelper.StaticPageHost+"mmsdiy/mmsdiymenu.html?rd"+Math.random();
				MMSDIY.AmmsTabbar(url,"mmsdiy","hot");
			break; 
			//祝福语Bar
			case "abless":
				//如果是彩字页的祝福语
				if ($($("#aToolsmmsSend").parent()).attr("class")=="curr_n") {
					$("#dvTongXunLv").hide();
					$("#dvSideSMS").show();
				}
				var url=MMSCommonHelper.StaticPageHost+"mmssms/smsmenu.html?rd"+Math.random(); 
				   //加载最热
				MMSDIY.AmmsTabbar(url,"mmssms","hot");
			break;
			//贺卡Bar 
			case "ageet":
				var url=MMSCommonHelper.StaticPageHost+"mmscard/mmscard.html?rd"+Math.random(); 
				MMSDIY.AmmsTabbar(url,"mmscard","hot"); 
			break; 
			//音乐Bar
			case "amusic":
				var url=MMSCommonHelper.StaticPageHost+"mmsmusic/musicmenu.html?rd"+Math.random(); 
				MMSDIY.AmmsTabbar(url,"mmsmusic","hot"); 
			break; 
			//大头贴Bar
			case "aheadphoto":
				var url=MMSCommonHelper.StaticPageHost+"mmspic/picmenu.html?rd"+Math.random(); 
				MMSDIY.AmmsTabbar(url,"mmspic","hot");           
			break; 
			//通讯录
			case "atongxun":
				$("#dvTongXunLv").css("display","");
				$("#dvSideSMS").css("display","none");
			break;
		}
	},

	/**
	 * 彩信素材Tabbar处理
	 * @param {Object} menuUrl：数据来源
	 * @param {Object} defaultModule：所属模块
	 * @param {Object} defaultItem:默认页
	 */
	AmmsTabbar: function (menuUrl, defaultModule, defaultItem) {
		$.get(menuUrl, function (menuHtml) {
			if (menuHtml.length <= 0) return;
			menuHtml = menuHtml.replace(new RegExp("href=\"#\"","g"),"href=\"javascript:;\"");
			$("#dvsideBox").prevAll().remove();
			$(menuHtml).insertBefore("#dvsideBox");
			
			//更改重构后rm中素材菜单中“彩信记录”的链接 2012-3-7
			if(top.isRichmail){
				$(".side_wrap .category li:first a").attr("href", "javascript:;")
					.click(function(){
						top.Links.show('mms','&id=mms&mmstype=record');
						return false;
					})
			}

			$(".sub-category").css("display","none"); 
			
			//菜单效果
			$(".category li").hover(function(){
				if ($(this).find(".sub-category").children().length > 0) {
					var submenu = $(this).find(".sub-category");
					var asideOffset = $(".aside").offset();
					var asideLeft = asideOffset.left;
					var asideTop = asideOffset.top;
					submenu.css({"left":$(this).offset().left - asideLeft,"top":$(this).offset().top - asideTop +22})
						.show();
					var h = submenu.height();
					if (h > 200) {
						submenu.css({"height":"200px"});
					}
					/*
					$("#dvIframe").attr("zIndex", 100).css({
						"position": "absolute",
						"top": $(this).find(".sub-category").offset().top,
						"left": $(this).find(".sub-category").offset().left,
						"width": $(this).find(".sub-category").width(),
						"height": $(this).find(".sub-category").height()
					}).show();*/
				}
			}, function(){
				$(this).find(".sub-category").hide();	
				if ($(this).find(".sub-category").children().length > 0) {
					//$("#dvIframe").hide();
				}
			});
			//菜单选被选择的样式
			$(".row a").click(function(){
			    this.className = "";
				$(".category>li>a.curr_a").attr("class", "");
			    
				this.className = "curr_a";
			});
				
			$(".category li a").click(function(){
			    //清空最新最热样式
				$(".row a").attr("class", "");

			    $(".category>li>a.curr_a").attr("class", "");
			    if ($(this).parent().parent().attr("class") != "sub-category") {	
			        $(this).attr("class","curr_a");
			    } else {
			        $(this).parent().parent().prev().attr("class","curr_a");
			    }
			});
			
			$("#pnlData").html("");
			$(".showMesBar").css("display","none"); 
			//添加最新，最热事件
			var newEle = $(".new");
			var hotEle = $(".hot");
			defaultModule = defaultModule.toLowerCase();

			$(newEle[0]).next().click(function(){
				this.className = "curr_a";
				$(hotEle[0]).next().attr("class","");
				MMSCommonHelper.InitMenuData(defaultModule,"new",1,null,null);
			});
			
			$(hotEle[0]).next().click(function(){
				this.className = "curr_a";
				$(newEle[0]).next().attr("class","");
				MMSCommonHelper.InitMenuData(defaultModule,"hot",1,null,null);
			});
			window.setTimeout(function(){
			    //MMSCommonHelper.MMSCurrentHolidayId=18;
				//MMSCommonHelper.CurrentHolidayId=7;
				if ((defaultModule == "mmssms" || defaultModule == "mmscard") && MMSCommonHelper.CurrentHolidayId > -1 ) {
					//如果在节日期间，则显示该节日类
					var succ = false;
				    $(".aside a").each(function(i,item){
				        try{
				            succ = false;
				            //找到节日点点
				            if (item.innerText == "节日祝福") {				               
								$(item.nextElementSibling).children().each(function(k,liitem){
									var classId = $($(liitem).children()[0]).attr("url");
									if (classId.length > 0 && classId.indexOf("_"+MMSCommonHelper.CurrentHolidayId)>0) {
										MMSCommonHelper.InitMenuData(defaultModule,classId,1);
										//设置样式				        
										$(".row a").attr("class","");
										$(item).attr("class","curr_a");

										succ = true;
										return;
									}
								});
				            }
				            if (succ) {
				                return;
				            }
				        }catch(e){}
				    });
				    
				    if (!succ) {
				        //再请求最热数据
				        MMSCommonHelper.InitMenuData(defaultModule,defaultItem,1,null,null);   
				    }
				} else if(defaultModule == "mmsdiy" && MMSCommonHelper.MMSCurrentHolidayId > -1) {
					//如果在节日期间，则显示该节日类
					var ssu = false;
				    $(".aside a").each(function(i,item){
				        try{
				            var classId = $(item).attr("url");
				            if (classId.length > 0) {
				                if(MMSCommonHelper.MMSCurrentHolidayId == parseInt(classId)){
									MMSCommonHelper.InitMenuData(defaultModule,classId,1);
				                    $(".row a").attr("class","");
									$(item).attr("class", "curr_a");
			                        ssu = true;
				                 	return;
				                }
				            }
				        }catch(e){}
				    });  
				    if (!ssu) {
						MMSCommonHelper.InitMenuData(defaultModule,defaultItem,1,null,null);//再请求最热数据      
						return;
				    }
				} else {
				    MMSCommonHelper.InitMenuData(defaultModule,defaultItem,1,null,null);//再请求最热数据
				    return;
				}
			}, 20);
		});
	},

	/**
	* 获取当前彩信
	*/
	GetCurrentMMS:function()
	{
		//接收号码
		MMSDIY.CurrentMMS.destNumber=MMSDIY.GetMobileList();
		MMSDIY.CurrentMMS.subject=$("#txtSubject").val();
		MMSDIY.CurrentMMS.frameList=[];
		//MMSDIY.CurrentMMS.ValidCode=$("#txtValidCode").val();
		if(MMSCommonHelper.IsShowValidImg)
		{
			var validCode = $("#txtValidCode").val();
			if(validCode.indexOf("点击查看图片验证码") != -1){
				validCode = "";
			}
			MMSDIY.CurrentMMS.validCode=validCode;
		} 
		return MMSDIY.CurrentMMS;
	},
	
	/**
	 * 获取收件人收机号,多个用逗号分割
	 */
	GetMobileList:function ()
	{
		var arrEmail=richInput.getRightNumbers();
		var result="";
		if(arrEmail.length>0)
		{
			for(var i=0;i<arrEmail.length;i++)
			{
				var email = NumberTool.getNumber(arrEmail[i]);
				if(Utils.isChinaMobileNumber(email))
				{
					result+=email+",";           
				}
			}
		}
		if(result.length > 0) result = result.substr(0, result.length-1);
		return result;
	},

	/**
	 * Flash对象初始化完毕
	 */
	swfInitComplete:function()
	{
	    var flashRequestInterface = mmsHost + "s?func=mms:uploadurl&sid=" + top.sid;
	    var flash = document.getElementById("FlashDIYMMS");
		flash.uploadUrl(flashRequestInterface,"http");
		
        //从url中读取传入的彩信内容
        var initData = MMSCommonHelper.GetInitData();
        if(initData && initData.content){
            flash.inputMMS([{Content:initData.content,ContentType:2}],"bianj");
        }
        //查看是否为读信过来的
         var mmsId = Utils.queryString("yymmsid");
         try
         {
            if(parseInt(mmsId)>0)
            {
				var dataJson = {type:2,mmsSeq:mmsId};
				var dataXml = namedVarToXML("", dataJson, "");
                //跟据彩信ID获取彩信素材
               $.ajax({type:"post",
               dataType: "json",
               url: Utils.getAddedSiteUrl("loadMMSRecord"),
               data: dataXml,
			   contentType:"application/xml;charset:utf-8",
               success:function(result)
               {
                    top.WaitPannel.hide();
                    var arr=new Array();
					pathToContent(result);
					$.each(result,function(index,item)
					{   
						if(item.contentType==2)  
						{
							item.content=unescape(item.content)
						}
						arr.push(item);
					});
					toUppers(arr);
					if(arr.length>0)
					{
                        flash.inputMMS(arr,"bianj"); 
                    }
               }
         });
            }
         }
         catch(e)
         {
         }

		//如果为彩信记录过来的编辑
		if(MMSDIY.RecordEditting)
		{
			//debugger;
			var mms=top._MMSDIYEditFromSource;
			MMSDIY.CurrentMMS=mms; 
			var arr=new Array();
			var list="";
			$.each(mms.frameList,function(k,item)
			{
				if(item.contentType==2)
				{
					item.content=escape(item.content)
				}
				list+="{\"content\":\""+item.content+"\",\"contentPath\":\""+item.contentPath+"\",\"contentType\":"+item.contentType+",\"frame\":"+item.frame+",\"playTime\":"+item.playTime+",\"contentSize\":"+item.contentSize+",\"contentName\":\""+escape(item.contentName)+"\",\"width\":"+item.width+",\"height\":"+item.height+"}";
				if(k<mms.frameList.length-1)
				{
					list+=",";
				}
			});
			//将MMS转成json串
			var strmms="{\"destNumber\":\""+mms.destNumber+"\",\"subject\":\""+escape(mms.subject)+"\",\"recordType\":\""+mms.recordType+"\",\"frameList\":["+list+"]}";
			var dataJson = eval("(" + strmms + ")");
			var dataXml = top.namedVarToXML("", dataJson, "");

			$("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").attr("disabled", "true");
			top.WaitPannel.show(mmsPopMsg.MMSEditting);

			$.ajax({
				type:"POST",
				url: Utils.getAddedSiteUrl("loadMMSRecord"),
				dataType:"json",
				cache:false,
				data:dataXml,
				contentType:"application/xml;charset:utf-8",
				beforeSend:function(XMLHttpRequest)
				{
				
				},       
				success:function(msg)
				{
					if(msg.code == "S_OK"){//成功
						//debugger;
						var mmsData=msg;
						mmsData.subject=unescape(mmsData.subject);
						MMSDIY.CurrentMMS=mmsData; 
						var arr=new Array();
						//contentPath值赋给content
						pathToContent(MMSDIY.CurrentMMS.frameList);

						$.each(MMSDIY.CurrentMMS.frameList,function(index,item)
						{   
							if(item.contentType==2)  
							{
								item.content=unescape(item.content)
							}
							arr.push(item);
						});
						try
						{
							//debugger;
							//向flash中添加过素材则编辑过
							MMSDIY.Edited=true;
							toUppers(arr);
							flash.inputMMS(arr,"bianj");
						}
						catch(e)
						{} 
						top.WaitPannel.hide(); 
						$("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").removeAttr("disabled");		
					}else{
						if(msg.resultMsg){
							FloatingFrame.alert(msg.resultMsg);
						}else{
							FloatingFrame.alert(mmsPopMsg.SystemBusy);
						}
					}	
				},  
				complete:function(XMLHttpRequest,textStatus)
				{
					top.WaitPannel.hide();  
				},   
				error:function(XmlHttpRequest, textStatus,errorThrown)
				{                    
					//错误处理
					FloatingFrame.alert(mmsPopMsg.SystemBusy);
				}
			});
		}
	},

	/**
	 * 截屏， 供Flash调用
	 */
	screenShots:function ()
	{
		//做日志报
		Utils.logReports({
			mouduleId: 16,
			action: 20112,
			thingId: 4,
			thing: "screenShots"
		});
		//debugger;
		if(Utils.isScreenControlSetup(true))
		{
            //截屏控件有域名安全限制，必须要使用http域名
		    var url = top.SiteConfig.mmsMiddleware + "s?func=mms:cutScreen&sid=" + top.$App.getSid();
			var ret =  ScreenSnapshotctrl.GetScreenSnapshotImg(10, url, "");
		}
	},
	
	/**
	 * 截屏回调
	 * @param {Object} id
	 * @param {Object} nResult
	 * @param {Object} strResponse
	 */
	ScreenSnapCallBack:function (id, nResult, strResponse)
	{
		
		//window.focus();
		//top.MM.activeModule("mms");
		top.WaitPannel.hide();//关闭
		
		if(nResult == 0)
		{
			var code = parseInt(strResponse);
			if(code==-100)
			{
			//上传失败
			return;
			}
			var arr=new Array();
			var item={
			Content:Utils.strToJson(strResponse).imgPath,
			ContentName:"",
			ContentSize:-1,
			ContentType:1,
			Frame:0,
			PlayTime:4,
			Width:-1,
			Height:-1,
			Seq:-1,
			isScreenShots:true,
			SeqId:-1};
			
			arr.push(item);
			//获取flash对象
			var flash=document.getElementById("FlashDIYMMS");
			
			//向flash中添加过素材则编辑过
			MMSDIY.Edited=true;
			//将截屏后的图片传给Flash
			flash.inputMMS(arr,"jiep");
		}
	}
};

/**
 * 预览窗口页
 */
var PerviewWindow={
	/**
	 * 预览类型
	 */
	Type:-1,
	
	/**
	 * 是否在预览
	 */
	IsPerview:false,
	
	/**
	 * 帧 数据列表
	 */
	FrameDataList:[],
	
	/**
	 * 自动播发控制器
	 */
	SetIntervalId:-1,
	
	/**
	 * 预览页初始化
	 */
	Init: function() {
		if (Utils.PageisTimeOut(true)){
			return false;
		}
		
		PerviewWindow.IsPerview = true;
		
		MMSCommonHelper.InitReceivePerson();//初始化接收人输入框

		//得到父窗口帧
		var p=top.document.getElementById("mms"); 
		if(p==null){
			//简洁版
			p=top.document.getElementById("mainForm");
		}
		
	    //设置预览框样式
		if ($(top.document).find(".winTipC").length > 0) { //兼容新版对话框
		    var wpc = $(top.document).find(".winTipC")[0].firstChild;
		    $(wpc).css("overflow-x", "hidden");
		}
	   if (window.XMLHttpRequest) { //Mozilla, Safari,IE7 
            //alert('Mozilla, Safari,IE7 ');
            if(!window.ActiveXObject){ // Mozilla, Safari,
                    //alert('Mozilla, Safari');
              } else {
                    //alert('IE7');
               }
			   $("#dvtemp").css("height","auto");
        } else {
         $("#dvtemp").css("height","392px");
        }
        var isBirthdayPageH = false;
        try
        {
            isBirthdayPageH = isBirthdayPage;
        }
        catch(e){}
        if(isBirthdayPageH)
        {
            $("#dvtemp").css("height","482px");
            $(".dialog").css("height","462px");
        }
		//scrolling="yes"
		//$(wpc).attr("scrolling","yes");

		//$("html").css("overflow-y","auto");
		//$("html").css("overflow-x","hidden");
		//alert($(wpc).attr("style"));
		
		//同步属性[预览窗口类型]
		PerviewWindow.Type=top.MMSPerviewData.Type;
		if(PerviewWindow.Type == 1 || PerviewWindow.Type ==4)//彩仓彩信数据统计
		{
		    try
		    {
				var dataXml = top.namedVarToXML("", {sendMmsSeqId:top.MMSPerviewData.MMS.seqId}, "");
		        $.ajax({
					type:"POST",
					url:MMSCommonHelper.fodderLogUrl(),
					data:dataXml,
					contentType:"application/xml;charset:utf-8"
				});
		    }
		    catch(e){}
		}
		
		if (PerviewWindow.Type == 1 || PerviewWindow.Type ==4 ||PerviewWindow.Type==5) {
			try{
				//如果没有主题，添写默认主题
				if($.trim($("#txtSubject").val()).length<=0){
					$("#txtSubject").val(MMSCommonHelper.getDefaultSubject() + "《"+top.MMSPerviewData.MMS.subject+"》");
				}
			}catch(e){}
		}
		else {
			//同步主题
			$("#txtSubject").val(top.MMSPerviewData.MMS.subject);
		}
		//初始化公共类
		MMSCommonHelper.Init(false); 
		//验证码默认不显示 
		$("#spValidCode").css("display","none"); 
		//定时发送默认为不选中 
		$("#chkTimming").attr("checked",false); 
		//验证码输入提示
		$("#txtValidCode").val(mmsPopMsg.ValidCode); 
		//错误提示隐藏
		$("#dvErrorMsg").css("display","none");
		//默认播放和翻页按钮不显示
		$(".mms_next, .mms_prev").hide();
		$("#aPlay, aPause").hide();
		
		//存草稿点击按扭
		var btnSave=document.getElementById("btnSave");
		//绑定存草稿点击
		Utils.addEvent(btnSave,"onclick",MMSCommonHelper.onSave);
		/*
		//彩信预览的尺寸
		switch(top.MMSPerviewData.Size)
		{
			//320*240
			case "0":
				$("#dvPreviewContent").attr("class","wrap")
			break;
			//176x220  
			case "1":
				$("#dvPreviewContent").attr("class","wrap medium")
			break;
			//128x128 
			case "2":
				$("#dvPreviewContent").attr("class","wrap small")
			break; 
		}*/ 
		
		//彩信DIY页点击的预览
		if(PerviewWindow.Type==2)
		{  
			//同步DIY页的联系人到预览窗口 
			if(null!=p.contentWindow.richInput)
			{   
				//清空接收人框
				richInput.clear();
				richInput.setTipText("");
				$.each(p.contentWindow.richInput.items,function(k,v){
					richInput.insertItem(v.allText);
				});
			}  
			
			//同步保存选项
			$("#chkSave").attr("checked",top.MMSPerviewData.SaveChecked);
			//同步定时选项 
			$("#chkTimming").attr("checked",top.MMSPerviewData.TimmingChecked);
			//如果定时选中，测需同步定时时间
			if($("#chkTimming").attr("checked")){
				$("#sltYear").selectOptions(top.MMSPerviewData.TimmingYear);
				MMSCommonHelper.IsPrevSynchronizationYear=true;
				$("#sltMonth").selectOptions(top.MMSPerviewData.TimmingMonth);
				$("#sltDay").selectOptions(top.MMSPerviewData.TimmingDay);
				$("#sltHour").selectOptions(top.MMSPerviewData.TimmingHour);
				$("#sltMinute").selectOptions(top.MMSPerviewData.TimmingMinute);

				MMSCommonHelper.ChangeMonth();

				$("#spYearToDay, #spHourToMin").css("display","inline");
			}
			
			//将内容输入框隐藏
			$("#thSpanContent, #dvTextarea, #dvTextareaTip").hide();  
		}
		else if(PerviewWindow.Type==1 || PerviewWindow.Type==4 ||PerviewWindow.Type==5)
		{
			//彩仓预览
			//将内容输入框显示
			$("#thSpanContent").css("display","");
			$("#dvTextarea").css("display","");
			$("#dvTextareaTip").css("display",""); 
		}
		else if(PerviewWindow.Type==3)
		{
			//彩信记录预览
			//将内容输入框隐藏
			$("#thSpanContent, #dvTextarea, #dvTextareaTip").hide();
		}
		
		//默认彩信预览彩信正在加载状态
	
		$("#ulFramePre").append($("<li class=\"mms_loading\"></li>"));
		$("#btnSend,#btnSave,#txtSubject,#txtContent,#chkSave,#chkTimming,#sltYear,#sltMonth,#sltDay,#sltHour,#sltMinute").attr("disabled","true");
		
		if (PerviewWindow.Type == 2) {
			if(top.MMSPerviewData.FlashCallBack!=null)
			{
				//处理成功返回结果
				top.MMSPerviewData.WindowPerviewEvent=PerviewWindow.InitPerviewData;
				//处理失败返回结果
				top.MMSPerviewData.WindowPerviewFlashFailEvent=PerviewWindow.ShowFlashProcessStatus;
				top.MMSPerviewData.FlashCallBack.outputMMS();
			}
		}
		else 
		{
			//debugger;
			//初始化数据并播放第一帧 
			PerviewWindow.InitPerviewData();
		}
		//如果没有主题，添写默认主题
		if($.trim($("#txtSubject").val()).length<=0){
			try {
				$("#txtSubject").val(MMSCommonHelper.getDefaultSubject());
			} catch(e) {}
		}
		
		//播放按钮事件
		$("#aPlay").click(function()
		{    
			if(PerviewWindow.FrameDataList.length>1)
			{
				$("#aPause").css("display","");
				$("#aPlay").css("display","none");
				//自动播放帧[4秒一帧]
				PerviewWindow.SetIntervalId=window.setInterval(function()
				{
					var f=$("#spPage").attr("currentPage");
					var cur=parseInt(f)+1;
					//如果是最后一帧了则播放第一帧
					if(cur-1==PerviewWindow.FrameDataList.length)
					{
					    cur=1;
					}
					$("#spPage").attr("currentPage",cur) 
					PerviewWindow.ShowFrameContent(cur);
				},4000);
			}
		});

		//停止播放
		$("#aPause").click(function(){
			window.clearInterval(PerviewWindow.SetIntervalId);//停止自动播放
			$("#aPlay").css("display","");
			$("#aPause").css("display","none");
		});

        document.getElementById("txtSubject").onpaste=function(){
            //最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
        };
		 //标题输入框
		$("#txtSubject").change(function()
		{
			//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				$("#dvErrorMsg").html("<i class='warning'></i>"+mmsPopMsg.SubjectTip);
				$("#dvErrorMsg").show();
				
				window.setTimeout(function(){$("#dvErrorMsg").fadeOut();},4000);
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});

	    //标题输入框
		$("#txtSubject").keyup(function()
		{
				//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				$("#dvErrorMsg").html("<i class='warning'></i>"+mmsPopMsg.SubjectTip);
				$("#dvErrorMsg").show();
				window.setTimeout(function(){$("#dvErrorMsg").fadeOut();},4000);
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});
		 
		//文本输入框
		$("#txtContent").change(function()
		{
			//最多可输入10000个字                  
			if($("#txtContent").val().length>=10000)
			{
		        $("#dvErrorMsg").html("<i class='warning'></i>"+mmsPopMsg.MMSContentTip);
				$("#dvErrorMsg").show();
				window.setTimeout(function(){$("#dvErrorMsg").fadeOut();},4000);
				
				$("#txtContent").val($("#txtContent").val().substring(0,10000));
				$("#emWordCount").html("0");
			}
			else
			{
				$("#emWordCount").html(10000-$("#txtContent").val().length)
			}			
			return;
		});

		$("#txtContent").keyup(function()
		{
			//最多可输入1000个字
			//emWordCount                         
			if($("#txtContent").val().length>=10000)
			{
				$("#dvErrorMsg").html("<i class='warning'></i>"+mmsPopMsg.MMSContentTip);
				$("#dvErrorMsg").show();
				window.setTimeout(function(){$("#dvErrorMsg").fadeOut();},4000);
				
				$("#txtContent").val($("#txtContent").val().substring(0,10000));
				$("#emWordCount").html("0");
			}
			else
			{
				$("#emWordCount").html(10000-$("#txtContent").val().length)
			}	
			return;
		});
		
		//上一页帧事件
		$(".mms_prev").click(function(){
			var f=$("#spPage").attr("currentPage");
			var cur=parseInt(f)-1 
			$("#spPage").attr("currentPage",cur) 
			PerviewWindow.ShowFrameContent(cur);
		});

		//上一页帧事件
		$(".mms_next").click(function(){
			var f=$("#spPage").attr("currentPage");
			var cur=parseInt(f)+1 
			$("#spPage").attr("currentPage",cur) 
			PerviewWindow.ShowFrameContent(cur);
		});
		
		//选择定时选项事件
		$("#chkTimming").click(function()
		{
			//如果选中则显示时间选项框
			if(this.checked)
			{
				$("#spYearToDay").css("display","inline");             
				$("#spHourToMin").css("display","inline");  
				var isBirthdayPageT = false;
				try
				{
				    isBirthdayPageT = isBirthdayPage;
				}
				catch(e){}		
				if(isBirthdayPageT)
				{
					var selYear=$("#sltYear")[0],
						selMonth=$("#sltMonth")[0],
						selDay=$("#sltDay")[0];
					var nodeList=br.getDataList("input[checked=true]");
					if(nodeList != null && nodeList.length > 0)
					{
					    if(nodeList.length == 1)
					    {
					        var sYear = "";
					        var arr_DateBirthday;
        					
					        //第一个提醒时间
					        arr_DateBirthday = nodeList[0].split(',')[1].split("-");
					        //如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
					        if (parseInt(arr_DateBirthday[1]) == 1 && parseInt(arr_DateBirthday[2]) < 11 && MMSCommonHelper.CurrentTime.M == 12)
					        {
						        sYear = (MMSCommonHelper.CurrentTime.Y+1).toString();
					        }
					        else
					        {
						        sYear = MMSCommonHelper.CurrentTime.Y.toString();
					        }
        						
					        //默认初始化后选中当前日期
					        for(var i=0;i<selYear.length;i++)if(selYear[i].value==sYear)selYear[i].selected=true;
					        selMonth[parseInt(arr_DateBirthday[1])-1].selected=true;
					        selDay[parseInt(arr_DateBirthday[2])-1].selected=true;
						    //今天就是生日
						    if((MMSCommonHelper.CurrentTime.H > 9) &&(parseInt(arr_DateBirthday[1]) == MMSCommonHelper.CurrentTime.M) && (parseInt(arr_DateBirthday[2]) == MMSCommonHelper.CurrentTime.D))
						    {
							    $("#sltHour option[text="+MMSCommonHelper.CurrentTime.H+"]").attr("selected", true);
							    $("#sltMinute option[text=" + (MMSCommonHelper.CurrentTime.Min<10 ? "0" + MMSCommonHelper.CurrentTime.Min : MMSCommonHelper.CurrentTime.Min) +"]").attr("selected", true); 
						    }
						    else
						    {
							    $("#sltHour option[text=9]").attr("selected", true); 
							    $("#sltMinute option[text=00]").attr("selected", true); 
						    }
					    }
					    else
					    {
				            $("#sltYear option[text="+MMSCommonHelper.CurrentTime.Y+"]").attr("selected", true); 
				            $("#sltMonth option[text="+MMSCommonHelper.CurrentTime.M+"]").attr("selected", true); 
                            var selectDay = MMSCommonHelper.CurrentTime.D;
                            if(selectDay<10)selectDay = "0"+selectDay;
				            $("#sltDay option[value="+selectDay+"]").attr("selected", true); 
				            $("#sltHour option[text="+MMSCommonHelper.CurrentTime.H+"]").attr("selected", true); 
				            $("#sltMinute option[text="+MMSCommonHelper.CurrentTime.Min+"]").attr("selected", true); 
				        }
					}
					nodeList=null;
				}
				else
				{
				$("#sltYear option[text="+MMSCommonHelper.CurrentTime.Y+"]").attr("selected", true); 
				$("#sltMonth option[text="+MMSCommonHelper.CurrentTime.M+"]").attr("selected", true); 
                var selectDay = MMSCommonHelper.CurrentTime.D;
                if(selectDay<10)selectDay = "0"+selectDay;
				$("#sltDay option[value="+selectDay+"]").attr("selected", true); 
				$("#sltHour option[text="+MMSCommonHelper.CurrentTime.H+"]").attr("selected", true); 
				$("#sltMinute option[text="+MMSCommonHelper.CurrentTime.Min+"]").attr("selected", true); 
				}
				//更新月份
				MMSCommonHelper.ChangeMonth();
			}
			else
			{
				$("#spYearToDay, #spHourToMin").hide();
			}  
		}); 

	    //收信人添加事件
		$("#aContact").click(function()
		{
			if(Utils.PageisTimeOut(true))return false;
			//点击发送添加的日志上报
			Utils.logReports({
				mouduleId: 16,
				action: 20110,
				thing: "previewContact"
			});
			//添加联系人
			return MMSCommonHelper.AddContact($(this));
		});

		//预览发送
		$("#btnSend").click(function(){
			if (Utils.PageisTimeOut(true)) {
				return false;
			}

			if (!MMSCommonHelper.MMSBaseValid()) {
				return false;
			}
			
			try{
				isBirthdayPageG = isBirthdayPage;
			}
			catch(e){}
			
			if(isBirthdayPageG){
				//日志上报
				top.addBehaviorExt({
					actionId:100241,
					thingId:0,
					moduleId:14
				});
			}
			var tempMMS=top.MMSPerviewData.MMS;

			//如果彩信内容为空则提示
			if(tempMMS.frameList == null){
				alert(mmsPopMsg.MMSContentIsEmpty);
				//同步联系人和主题
				PerviewWindow.syncPerviewData();

				MMSPerview.Close();

				return;
			}

			//日志上报
			Utils.logReports({
				mouduleId: 16,
				action: 20108,
				thing: "MMSPreviewSend"
			});
			
			//如果是彩仓过来的应该添加文本帧
			if(PerviewWindow.Type==1||PerviewWindow.Type==4)
			{
				if (tempMMS.frameList!=null && tempMMS.frameList.length == 2) {
					tempMMS.frameList.pop();
				}
				//创建一个文本帧
				if($.trim($("#txtContent").val()).length>0)
				{
					var item={
						content:$.trim($("#txtContent").val()),
						contentName:"",
						contentSize:-1,
						contentType:2,
						frame:1,
						playTime:4,
						width:tempMMS.frameList[0].width,
						height:tempMMS.frameList[0].height,
						seq:-1,
						seqId:-1
					};
					tempMMS.frameList.push(item);
				}	
			}
			tempMMS.destNumber=MMSCommonHelper.GetMobileList();
			tempMMS.subject=$("#txtSubject").val();         
			if(MMSCommonHelper.IsShowValidImg)
			{
				tempMMS.validCode=$("#txtValidCode").val();
			} 
			var timmingDate="";
			if($("#chkTimming").attr("checked"))
			{
				//debugger;
				//如果定时选中
				timmingDate += $("#sltYear").val() + $("#sltMonth").val() + $("#sltDay").val() + " " + $("#sltHour").val() + ":" + $("#sltMinute").val() + ":" + "00";
			}
		
		   $("#btnSend").attr("disabled","true"); 
		   $("#btnSave").attr("disabled","true");
		   $("#btnCancel").attr("disabled","true");
		    
			var result= MMSCommonHelper.MMSSend(tempMMS,$("#chkSave").attr("checked"),$("#chkTimming").attr("checked"),timmingDate,PerviewWindow.Type);
		});
		
		//取消按钮事件
		$("#btnCancel").click(function()
		{
			//同步联系人和主题
			PerviewWindow.syncPerviewData();
			
			//关闭预览窗口 
			MMSPerview.Close();  
		});

		//发送按钮事件

		//点击验证码输入框事件
		$("#txtValidCode").focus(function(e) {
			//e.stopPropagation();
            if (this.value == mmsPopMsg.ValidCode) {
                this.value = "";
                $(this).removeClass("input-default");
            }
            $("#trValide").addClass("show-rnd-img");
            $("#spValidCode").show();
			//显示验证码
			// MMSCommonHelper.RefreshImgRndCode('imgValidate');
			
			// 失去焦点，隐藏验证码提示框
			$(document).click(function(e) {
			    var elem = e.target;
			    while(elem && elem.id != "divValidate"){
			        elem = elem.parentNode;
			    }
			    if(!elem || e.target.id == "spanValidate") {
			        $(document).unbind("click");
			        $("#trValide").removeClass("show-rnd-img");
			        $("#spValidCode").hide();
			    }
			}); 
        });
	
		//看不清，重新获取验证码  
		$("#aValidCodeRefresh").click(function(){
			MMSCommonHelper.RefreshImgRndCode('imgValidate');
			return false;
		});
	},

	/**
	 * 初始化预览数据
	 */
	InitPerviewData:function()
	{
		//debugger;
		PerviewWindow.FrameDataList=top.MMSPerviewData.MMS.frameList;	
		var mms=top.MMSPerviewData.MMS;
		var list="";
		$.each(mms.frameList,function(k,item)
		{
			if(item.contentType==2){//如果为文本帧
				//将文本数据编码
				item.content = escape(item.content);
			}
			list+="{\"content\":\""+item.content+"\",\"contentType\":\""+item.contentType+"\",\"frame\":\""+item.frame+"\",\"playTime\":\""+item.playTime+"\",\"round\":\""+(item.round || 0)+"\",\"zoom\":\""+(item.zoom || 0)+"\",\"contentSize\":"+item.contentSize+",\"contentName\":\""+escape(item.contentName)+"\",\"contentPath\":\""+(item.contentPath || "")+"\",\"width\":"+(item.width || 0)+",\"height\":"+(item.height || 0)+"}";
			if(k<mms.frameList.length-1)
			{
				list+=",";
			}
		});
		
		var viewType = (PerviewWindow.Type == 1) ? 1 : 0;
		//将MMS转成json串
		var strmms="{\"destNumber\":\""+mms.destNumber+"\",\"subject\":\""+escape(mms.subject)+"\",\"frameList\":["+list+"],\"viewtype\":"+viewType+"}";
		var dataJson = eval("(" + strmms + ")");
		var dataXml = top.namedVarToXML("",dataJson,"");
		$.ajax({
			type:"POST",
			url: Utils.getAddedSiteUrl("mmsView"),
			dataType:"json",
			cache:false,
			data:dataXml,
			contentType:"application/xml;charset:utf-8",
			beforeSend:function(XMLHttpRequest)
			{
				//设置预览框为加载状态
			},
			success:function(msg)
			{
				//让控件变为可用状态
				$("#btnSend, #btnSave, #txtSubject, #txtContent, #chkSave, #chkTimming, #sltYear, #sltMonth, #sltDay, #sltHour, #sltMinute").removeAttr("disabled");
				//取消加载状态
				$("#ulFramePre").html("");
				if(msg.code == "S_OK"){//成功
					var mmsData=msg;
					var noImgFrame = true;
					//debugger;
					//将数据转换成DOM
					$.each(mmsData.frameList,function(k,item)
					{
						switch(item.contentType)
						{
							case 1://图片
								noImgFrame = false;
								if(!Sys.ie)
								{
									$("#ulFramePre").append($("<li id='frame"+item.frame+"' style='display:none'><table width='100%'><tr><td><img src='"+item.contentPath+"' /></td></tr></table></li>"));
								}
								else
								{
									//防止IE6加载两次
									var ele=$("<li id='frame"+item.frame+"' style='display:none'><table width='100%'><tr><td><img src='"+item.contentPath+"' /></td></tr></table></li>");
									var eleImage=ele[0].getElementsByTagName("img");
									//等待图片加载完成
									var isComplete=true;
									var curinterval=window.setInterval(function(){	
										//如果还有未加载
										if(!eleImage[0].complete)
										{
											isComplete=false;
										}
										else
										{
										  isComplete=true;
										}
										if(isComplete)
										{
											 //如果下载完成，将其赋值给DOM
											 $("#ulFramePre").append(ele);	
											 top.WaitPannel.hide(); 
											 PerviewWindow.ShowFrameContent(1);
											 window.clearInterval(curinterval);
										}
									},10);
								}
								break;

						   case 2://文字
								var str=item.content;
								if (top.MMSPerviewData.MMS.frameList[k].content.toLowerCase().indexOf("/uploads") < 0) {
									top.MMSPerviewData.MMS.frameList[k].content = unescape(str);
								}
							   $("#ulFramePre").append($("<li id='frame"+item.frame+"' style='display:none'><table  width='100%'><tr><td style='vertical-align:top'><textarea class='t' readonly='readonly'>"+unescape(str)+"</textarea></td></tr></table></li>"));
						   break;

						   case 3://声音
								$("#ulFramePre").append($(" <li id='frame"+item.frame+"' style='display:none'><table  width='100%'><tr><td><div class=\"media\"></div><a href='javascript:;' class='listenMusic' musicUrl='"+item.contentPath+"' musicName='"+item.contentName+"'>试听</a></td></tr></table></li>"));
								$("#ulFramePre").find(".listenMusic").click(function(){
								MMSDIY.playMusic($(this).attr("musicUrl"),$(this).attr("musicName"));
								return false;
								});
						   break;
						}
					});
					if(!Sys.ie)
					{ 
							top.WaitPannel.hide(); 
							//播放第一帧
							PerviewWindow.ShowFrameContent(1);
					}
					
					//设置播放按钮状态
					if (PerviewWindow.FrameDataList.length == 1) 
					{
						$("#aPlay, #aPause").hide();
				
				if (Sys.ie)
				{
		            //显示帧
		            var id="#frame0";
		            var h=$("#ulFramePre").parent().height();
		            $(id).find("table").height(h);
		            $(id).css("display","");
		        }
			}
			else if (PerviewWindow.FrameDataList.length > 1)
			 {
				$("#aPlay").css("display", "none");
				$("#aPause").css("display", "");
				
				if (Sys.ie && noImgFrame)
						{
							top.WaitPannel.hide(); 
							//播放第一帧
							PerviewWindow.ShowFrameContent(1);
						}
					 }
				   //设置自动播放
					if(PerviewWindow.FrameDataList.length>1)
					{
						$("#imgAutoPlay").css("display","");
						//自动播放帧[4秒一帧]
						PerviewWindow.SetIntervalId=window.setInterval(function()
						{
							var f=$("#spPage").attr("currentPage");
							var cur=parseInt(f)+1;
							//如果是最后一帧了则播放第一帧
							if(cur-1==PerviewWindow.FrameDataList.length)
							{
								cur=1;
							}
							$("#spPage").attr("currentPage",cur) 
							PerviewWindow.ShowFrameContent(cur);
						},4000);
					}		
				}else if(msg.code == "S_ERROR"){
					if(msg.resultMsg){
						FloatingFrame.alert(msg.resultMsg);
					}else{
						FloatingFrame.alert(mmsPopMsg.SystemBusy);
					}
				}
			},  
			complete:function(XMLHttpRequest,textStatus)
			{
				//取消加载状态
			},   
			error:function(XmlHttpRequest, textStatus,errorThrown)
			{                    
				//取消加载状态
				//错误处理
				FloatingFrame.alert(mmsPopMsg.SystemBusy);
			}
		}); 

	},

	/**
	 * 如果是自制彩信页过来的预览，关闭时需要同步联系人和主题
	 */
	syncPerviewData: function(){
		//自制彩信所处框架
		var p = top.document.getElementById("mms");

		if(PerviewWindow.Type==2)
		{
			//同步预览窗口联系人到DIY页面
			if(null!=richInput)
			{
				p.contentWindow.richInput.clear();
				p.contentWindow.richInput.setTipText("");
				$.each(richInput.items,function(k,v)
				{
					p.contentWindow.richInput.insertItem(v.allText);
				});
			}
			//同步主题
			p.contentWindow.document.getElementById("txtSubject").value=$("#txtSubject").val();
			//同步保存选项
			p.contentWindow.document.getElementById("chkSave").checked=$("#chkSave").attr("checked");
			//同步定时选项 
			p.contentWindow.document.getElementById("chkTimming").checked=$("#chkTimming").attr("checked");
			//如果定时选中，测需同步定时时间
			
			if($("#chkTimming").attr("checked"))
			{     
				try{
					$(p.contentWindow.document.getElementById("sltYear")).selectOptions($("#sltYear").selectedValues()[0]);
					$(p.contentWindow.document.getElementById("sltMonth")).selectOptions($("#sltMonth").selectedValues()[0]); 
					$(p.contentWindow.document.getElementById("sltDay")).selectOptions($("#sltDay").selectedValues()[0]);  
					$(p.contentWindow.document.getElementById("sltHour")).selectOptions($("#sltHour").selectedValues()[0]); 
					$(p.contentWindow.document.getElementById("sltMinute")).selectOptions($("#sltMinute").selectedValues()[0]); 
					MMSCommonHelper.ChangeMonth(true);
					$(p.contentWindow.document.getElementById("sltDay")).selectOptions($("#sltDay").selectedValues()[0]); 

					$(p.contentWindow.document.getElementById("spYearToDay")).css("display","inline");             
					$(p.contentWindow.document.getElementById("spHourToMin")).css("display","inline");  
				}catch(e){}
			}
			else
			{
				$(p.contentWindow.document.getElementById("spYearToDay")).css("display","none");             
				$(p.contentWindow.document.getElementById("spHourToMin")).css("display","none");
			}
			
			if (Sys.chrome)
			{
				//显示Flash
				$(p.contentWindow.document.getElementById("swfcontent")).css("visibility","visible");
			}
		} 
	},
		
	/**
	 * 彩信发送成功
	 */
	SuccessSend:function(isSave)
	{
		isSave = isSave!=undefined ? isSave : 1;
		//得到父窗口帧   
		var p=top.document.getElementById("mms");
		var url = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/mms/mmsSuccess.html?rnd=" + Math.random() + "&type=1&isSave=" + isSave);
		if(p==null)
		{
			//简洁版
			p=top.document.getElementById("mainForm");
			url = mmsHost + "mms/simple/mmsSuccess.html?rnd="+Math.random()+"&type=1&isSave=" + isSave; 
		}

		p.contentWindow.location=url;
		//关闭预览窗口 
		p.contentWindow.MMSPerview.Close();
	},
		
	/**
	 * 预览界面处理Flash处理返回Code
	 * @param {Object} code
	 */
	ShowFlashProcessStatus:function(code)
	{	
	 $("#ulFramePre").find("li").css("display","none");   	
		switch(code)
		{
			case -100:
			$("#ulFramePre").append($("<li class=\"mms_fail\" code='-100'><span>"+mmsPopMsg.FlashBuilderMMSError+"</span></li>"));
			break;
			case -102:
			$("#ulFramePre").append($("<li class=\"mms_fail\" code='-102'><span>"+mmsPopMsg.FlashBuilderMMSError1+"</span></li>"));
			break;
			case -103:
			$("#ulFramePre").append($("<li class=\"mms_fail\" code='-103'><span>"+mmsPopMsg.FlashBuilderMMSError1+"</span></li>"));
			break;
			case -104:
			$("#ulFramePre").append($("<li class=\"mms_fail\" code='-104'><span>"+mmsPopMsg.FlashBuilderMMSError4+"</span></li>"));
			//让控件变为可用状态
			$("#btnSend, #btnSave, #txtSubject, #txtContent, #chkSave, #chkTimming, #sltYear, #sltMonth, #sltDay, #sltHour, #sltMinute").removeAttr("disabled");
			break;
			default:
			break;
		}
	},
		
	/**
	 * 显示当前播放的帧次
	 * @param {Object} frame:帧次
	 */
	ShowFrameContent:function(frame)
	{
		//debugger;	
		$("#ulFramePre").find("li").css("display","none");         
		$(".mms_next, .mms_prev").css("display","");

		if(frame>=PerviewWindow.FrameDataList.length)
		{
			//下一页隐藏
			$(".mms_next").css("display","none");
		} 
		else if(frame<=1)
		{
			//上一页隐藏
			$(".mms_prev").css("display","none");
		}
		if(PerviewWindow.FrameDataList.length==1)
		{
			$(".mms_next, .mms_prev").hide();
		}
		
		$("#spPage").html("");  
		if (PerviewWindow.FrameDataList.length > 1) {
			$("#spPage").html(frame + "/" + PerviewWindow.FrameDataList.length);
		}
		else{
			$("#spPage").html("");
		}
		$("#spPage").attr("currentPage",frame);
		$("#spPage").attr("countPage", PerviewWindow.FrameDataList.length);
		
		//显示帧
		var id=frame-1;
		id="#frame"+id;
		var h=$("#ulFramePre").parent().height();
		$(id).find("table").height(h);
		$(id).css("display","");
	}
};

/**
 * 彩字发送页
 */
var FlashMMS={
	IsFlashMMS:false,
	selSizeTool: function(){
		var sltSizeBtn = $("#sltSize"),
			menu = sltSizeBtn.find(".simulationMenu"),
			labelTxt = sltSizeBtn.find(".simulationSelect_txt2");

		sltSizeBtn.click(function(e){
			e.stopPropagation();
			menu.show();
		})
		$(document).click(function(){
			menu.hide();
		})
		menu.click(function(e){
			var target = e.target;
			e.stopPropagation();
			if (target.tagName == "A") {
				var txt = target.innerHTML;
			} else {
				return;
			}
			labelTxt.html(txt);
			switch (txt.substring(0, 1)) {
				case "大":
					sltSizeBtn.attr("value", 0);
					break;
				case "中":
					sltSizeBtn.attr("value", 1);
					break;
				case "小":
					sltSizeBtn.attr("value", 2);
					break;
			}

			var sizeIndex = parseInt(sltSizeBtn.attr("value"), 10),
				styleIndex = $(":radio[checked!='']").attr("id").substring(4,5);
			
			FlashMMS.setClassByIndex(sizeIndex);
			FlashMMS.setInfoForPic(styleIndex);
			menu.hide();
		})
	},
	//@param {Number} sizeIndex
	setClassByIndex: function (sizeIndex) {
		var picWrap = document.getElementById("dvimageClass"),
			className = FlashMMS.getClassByIndex(sizeIndex);

		picWrap.className = className;
	},
	//@param {Number} sizeIndex
	getClassByIndex: function (sizeIndex) {
		var className = "";

		switch (sizeIndex) {
			case 0:
				className = "view";
				break;
			case 1:
				className = "view medium";
				break;
			case 2:
				className = "view small";
				break;
		}
		return className;
	},
	//@param {String} styleIndex
	getStyleByIndex: function (styleIndex) {
		var strStyle = "可爱",
			style = parseInt(styleIndex, 10),
			imgPreviewClass = "";

		switch (styleIndex) {
			case "0":
				strStyle = "可爱";
				imgPreviewClass = "mms_bg ka";
				break;
			case "1":				
				strStyle = "温馨";
				imgPreviewClass = "mms_bg wx";
				break;
			case "2":			
				strStyle = "绚丽";
				imgPreviewClass = "mms_bg xl";
				break;
		}
		return {
			style: style,
			strStyle: strStyle,
			imgPreviewClass: imgPreviewClass
		};
	},
	//@param {String} styleIndex
	setInfoForPic: function (styleIndex){
		var objStyle = FlashMMS.getStyleByIndex(styleIndex),
			strStyle = objStyle.strStyle;

		$("#pStyle").html("<span class=\"lt\">" + strStyle + "样式</span>" + $("#sltSize .simulationSelect_txt2").html());
	},
	//@param {String} styleIndex
	setImgPreview: function (styleIndex) {
		var objStyle = FlashMMS.getStyleByIndex(styleIndex),
			imgPreviewClass = objStyle.imgPreviewClass,
			imgPreView = document.getElementById("imgPreView");

		imgPreView.className = imgPreviewClass;
	},
	Init:function()
	{
	//debugger;
		 if(Utils.PageisTimeOut(true))return false;
		 FlashMMS.IsFlashMMS=true;
		//初始货接收人输入框
		MMSCommonHelper.InitReceivePerson();
		//初始化导航 
		MMSCommonHelper.InitTools();  
		//预览框选择项样式 
		$(".curr").attr("class",""); 
		$(":radio[checked!='']").parent().attr("class","curr");  
		$("#sltSize").attr("value", 0);
		//选择尺寸
		FlashMMS.selSizeTool();
		
		//选择样式
		$(":radio").click(function(){
			$(".curr").attr("class","");
			this.parentNode.className="curr";	
			
			$("#imgPreView").removeAttr("class");
			$("#imgPreView").html();
			//图版 大小 样式
			var sizeIndex = parseInt($("#sltSize").attr("value"), 10),
				styleIndex = $(":radio[checked!='']").attr("id").toString().substring(4,5);

			FlashMMS.setClassByIndex(sizeIndex);
			FlashMMS.setInfoForPic(styleIndex);
			FlashMMS.setImgPreview(styleIndex);
		}); 
		
		//检查是否要输入验证码
		MMSCommonHelper.Init(true);
		
		//验证码输入提示
		$("#txtValidCode").val(mmsPopMsg.ValidCode);  

		MMSCommonHelper.IsShowValidCode(); 
		//初始化通讯录
		$("#dvTongXunLv").css("display","none");		
		AddressBook.createTelStyle(document.getElementById("dvTongXunLvContent"),function(addr){
			//alert(addr);
			richInput.insertItem(addr);
		},true)
		
		
				//检查是否为短信跳转过来的
		var mobiles=Utils.queryString("mobile");
		var content=Utils.queryString("Content");
		//如果有多个接收人				        
		if(mobiles!=null && mobiles.toString().length>0 && mobiles.indexOf(";")>0)
		{
		    //有多个号码
		    var numbers=mobiles.split(";");
		    if(numbers.length>0)
		    {
				richInput.setTipText("");
		        for(var i=0;i<numbers.length;i++)
		        {
		            richInput.insertItem(numbers[i]);    
		        }
		    }
		   
		} 
		else if(mobiles!=null && mobiles.length>0)
		{
			richInput.setTipText("");
			richInput.insertItem(mobiles);
		}
		if (content!=null && content.length > 0) {
			//文本
			$("#txtContent").val(content)
		}
		
		
		//提示隐藏
		$(".tooltip").hide();	
			

		$("#mmsTo").find("input").focus(function(){
			if(Utils.PageisTimeOut(true))return false; 
			$("#dvTongXunLv").show();
			$("#dvSideSMS").hide();
			$(".liflashMMS")[0].className="liflashMMS on";
			$(".liflashMMS")[1].className="liflashMMS";
		});

		//单击内容框
		$("#txtContent").click(function(){
			if(Utils.PageisTimeOut(true))return false; 
			$("#dvTongXunLv").hide();
			$("#dvSideSMS").show();
			$(".liflashMMS")[0].className = "liflashMMS";
			$(".liflashMMS")[1].className = "liflashMMS on";
		});
		
		//看不清，重新获取验证码  
		$("#aValidCodeRefresh").click(function()
		{
			 MMSCommonHelper.RefreshImgRndCode('imgValidate');
			 
			 return false;
			 
		}); 

		//点击验证码输入框事件
		$("#txtValidCode").focus(function(e) {
			e.stopPropagation();
            if (this.value == mmsPopMsg.ValidCode) {
                this.value = "";
                $(this).removeClass("input-default");
            }
            $("#trValide").addClass("show-rnd-img");
            $("#spValidCode").show();
			//显示验证码
			// MMSCommonHelper.RefreshImgRndCode('imgValidate'); 
            $(document).click(function(e) {
                var elem = e.target;
                while(elem && elem.id != "divValidate"){
	                elem = elem.parentNode;
	            }
	            if(!elem || e.target.id == "spanValidate") {
                    $(document).unbind("click");
                    $("#trValide").removeClass("show-rnd-img");
                    $("#spValidCode").hide();
                }
            });
        });
	
		window.setTimeout(function()
		{
			//默认菜单
			var url=MMSCommonHelper.StaticPageHost+"mmssms/smsmenu.html?rd"+Math.random(); 
			MMSDIY.AmmsTabbar(url,"mmssms","hot"); 
		},101);
		
		MMSCommonHelper.selectPageTool(); //页码选择
	    
	     document.getElementById("txtSubject").onpaste=function(){
        
            //最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
        };
        
				 //标题输入框
		$("#txtSubject").change(function()
		{
			//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});

	    //标题输入框
		$("#txtSubject").keyup(function()
		{
				//最多可输入50个字                  
			if($("#txtSubject").val().length>50)
			{
				//显示提示
					
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtSubject").val($("#txtSubject").val().substring(0,50));				
			}
				
			return;
		});
		//文本输入框
		$("#txtContent").change(function()
		{
			
			//最多可输入70个字
			//emWordCount                         
			if($("#txtContent").val().length>=70)
			{   
			    //显示提示												
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtContent").val($("#txtContent").val().substring(0,70));
				$("#emWordCount").html("0");
			}
			else
			{
				$("#emWordCount").html(70-$("#txtContent").val().length)
			}
			
			return;
		});
		
		$("#txtContent").keyup(function()
		{
			//最多可输入70个字
			//emWordCount                         
			if($("#txtContent").val().length>=70)
			{
									
				var toolTip=$(this).next();
				toolTip.show();
				window.setTimeout(function(){toolTip.hide();},5000)
				$("#txtContent").val($("#txtContent").val().substring(0,70));
				$("#emWordCount").html("0");
			}
			else
			{
				$("#emWordCount").html(70-$("#txtContent").val().length)
			}
			return;
		});
		
		//Tab  
		//通讯录
		$("#atongxun").click(function()
		{    
			MMSDIY.ProcessTabbar(this)
		});
		
		//祝福语
		$("#abless").click(function()
		{
			MMSDIY.ProcessTabbar(this)
		});
		
		//发送按钮
		$("#btnSend").click(function(){
			if (Utils.PageisTimeOut(true)) return false; 
				 
			if (!MMSCommonHelper.MMSBaseValid()) return false;
		  
			//日志上报
			Utils.logReports({
				mouduleId: 16,
				action: 20107,
				thing: "MMSSend"
			});
			
			var style="";  
			switch ($(":radio[checked!='']").attr("id").toString().substring(4,5)) {
				case "0":
					style=0;
					break;
				case "1":
					style=1;
					break;
				case "2":
					style=2;
					break;
			}
			
			//图片大小
			var sizeIndex=$("#sltSize").attr("value"); 
			var adapterSize=sizeIndex;
			if (sizeIndex==0) {
				adapterSize=2;
			}
			if (sizeIndex==2) {
				adapterSize=0;
			}
			
			var rePerson=MMSCommonHelper.GetMobileList();
			var validCodeStr=$("#txtValidCode").val()==mmsPopMsg.ValidCode?"":$("#txtValidCode").val();
			var sendType = 0;//发送类型 0:普通彩子 1:定时彩字
			var timmingDate="";//定时时间
			if($("#chkTimming").attr("checked")){
				sendType = 1;
				//如果定时选中
		        timmingDate += $("#sltYear").val() + $("#sltMonth").val() + $("#sltDay").val() + " " + $("#sltHour").val() + ":" + $("#sltMinute").val() + ":" + "00";
			}
			
			//如果没有主题，添加默认主题
			var mmsSubject = MMSCommonHelper.getDefaultSubject($("#txtSubject").val());

			var dataJson = {
				style: style,
				size:adapterSize,
				content: escape($.trim($("#txtContent").val())),
				validate: validCodeStr,
				title: escape(mmsSubject),
				receiverNumber:rePerson,
				sendType:sendType,
				sendTime:timmingDate
			};
			var dataXml = top.namedVarToXML("", dataJson, "");

			top.WaitPannel.show(mmsPopMsg.SendingMMS);
			$("#txtValidCode").val(mmsPopMsg.ValidCode);
			$("#btnSend, #btnPreView, #btnSave").attr("disabled", "true");

			$.ajax({
				type:"POST",
				url: Utils.getAddedSiteUrl("mmsWord"),//彩字发送
				dataType:"json",
				cache:false,
				data:dataXml,
				contentType:"application/xml;charset:utf-8",
				beforeSend:function(XMLHttpRequest)
				{
					
				},
				success:function(msg)
				{
					top.WaitPannel.hide();
					if(msg.code == "S_OK"){   
						top.WaitPannel.hide();  
						//接收人存在Top变量，为成功页访问   
						top._mmsReceivedPerson = rePerson; 
						//彩信来源   1:彩仓 2：DIY 3:彩信记录 4:成功页 5:彩字
						top._mmsFromSource=5;
						//是否为定时
						//top._mmsisTimming=false; 
						top._mmsisTimming = (sendType == 0) ? false : true;
						//彩信标题
						top._mmsSubject=""; 
						//如果不是彩仓彩信则为-1
						top_mmsStorageSeqId=-1;
						
						var url = "/m2012/html/mms/mmsSuccess.html?rnd="+Math.random()+"&type=1";  
						window.location.href = top.M139.Text.Url.getAbsoluteUrl(url);
					} else if (msg.code == "NO_VERIFY_CODE" || msg.code == "VALIDATE_ERR" || msg.code == "MMS_VALIDATE_INPT") {
						MMSCommonHelper.IsShowValidImg = true;
						MMSCommonHelper.ImageCodePath = msg.validateUrl;
						MMSCommonHelper.IsShowValidCode();
						FloatingFrame.alert(msg.resultMsg);
					} else if (msg.code == "MMS_DAY_LIMIT" && top.SiteConfig.comboUpgrade) {
						MMSCommonHelper.tipMaxDayMonthSend();
					} else if (msg.code == "MMS_MONTH_LIMIT" && top.SiteConfig.comboUpgrade) {
						MMSCommonHelper.tipMaxDayMonthSend(true);
					}else{
						FloatingFrame.alert(msg.resultMsg || mmsPopMsg.SystemBusy);
					}
				},  
				complete:function(XMLHttpRequest,textStatus)
				{
					$("#btnSend, #btnPreView, #btnSave").removeAttr("disabled");
					top.WaitPannel.hide();  
				},   
				error:function(XmlHttpRequest, textStatus, errorThrown)
				{        
					$("#btnSend, #btnPreView, #btnSave").removeAttr("disabled");
					//错误处理
					FloatingFrame.alert(mmsPopMsg.SystemBusy);
				}
			}); 
		});
		//预览按钮
		$("#btnPreView").click(function(){
		    if(Utils.PageisTimeOut(true))return false; 		
			var validCodeStr=$("#txtValidCode").val()==mmsPopMsg.ValidCode?"":$("#txtValidCode").val();
			
			//验证彩字内容不能为空
			if ($.trim($("#txtContent").val()).length <= 0) {
				var conTipTools = new MMSCommonHelper.TipTools({
					FT: $(".txt_wrap").eq(1),
					objErr: $("#txtContent"),
					msg: mmsPopMsg.FlashPreviewMMSContentIsEmpty
				});
				conTipTools.init();
				return false;
			}
			//确认验证码		
			if (MMSCommonHelper.IsShowValidImg) {
				if (validCodeStr == "") {
					var validTipTools = new MMSCommonHelper.TipTools({
						FT: $('#trValidCode').find('td').eq(0),
						objErr: $('#txtValidCode'),
						msg: mmsPopMsg.ValidCode
					});
					validTipTools.init();
					return false;
				}
			}
			
			var styleIndex = $(":radio[checked!='']").attr("id").toString().substring(4,5),
				objStyle = FlashMMS.getStyleByIndex(styleIndex),
				style = objStyle.style;

			//图片大小
			var sizeIndex=parseInt($("#sltSize").attr("value"), 10); 
			var adapterSize=sizeIndex;
			if(sizeIndex==0)
			{
				adapterSize=2;
			}
			if(sizeIndex==2)
			{
				adapterSize=0;
			}
			var dataJson = {
				style: style,
				size:adapterSize,
				content: escape($.trim($("#txtContent").val())),
				validate: validCodeStr
			}
			var dataXml = top.namedVarToXML("",dataJson,"");

		    //$("#txtValidCode").val(mmsPopMsg.ValidCode);
			$("#spValidCode").css("display", "none");
		    //显示ajax执行动作
			top.WaitPannel.show(mmsPopMsg.Previewing);
		    //请求后台获取彩字图片
			$.ajax({
				type:"POST",
				url: Utils.getAddedSiteUrl("mmsWordView"),
				dataType:"json",
				cache:false,
				data:dataXml,
				contentType:"application/xml;charset:utf-8",
				beforeSend:function(XMLHttpRequest)
				{

				},       
				success:function(data)
				{
					top.WaitPannel.hide();			
					//请求成功
					$("#btnPreView").removeAttr("disabled");
					$("#btnPreView").val("预览");
					$("#txtValidCode").val(mmsPopMsg.ValidCode);
					if (data.code == "S_OK"){//成功状态	
						//获取预览图片
						//debugger;
						var items = data.imgPath.split(",");
						var pagecount = items.length;
						if(pagecount>0)
						{
							//预览图片
							$("#imgPreView").html();
							$("#imgPreView").removeAttr("class");
							$("#imgPreView").html("<img src='"+items[0]+"'/>");
						}    
					}
					else{
						//确定是否输入验证码
					    if (data.code == "NO_VERIFY_CODE" || data.code == "VALIDATE_ERR" || data.code == "MMS_VALIDATE_INPT")
						{
							MMSCommonHelper.IsShowValidImg=true;
							MMSCommonHelper.ImageCodePath=data.validateUrl;
							 
							$("#imgValidate").attr("src",data.validateUrl);
						}
						
						//$("#txtValidCode").val(mmsPopMsg.ValidCode);
						if(data.resultMsg){
							FloatingFrame.alert(data.resultMsg);	
						}else{
							FloatingFrame.alert(mmsPopMsg.SystemBusy);
						}
					}	
				},  
				complete:function(XMLHttpRequest,textStatus)
				{
					top.WaitPannel.hide();  
				},   
				error:function(XmlHttpRequest, textStatus, errorThrown)
				{                    
					//错误处理
					FloatingFrame.alert(mmsPopMsg.SystemBusy);
				}
			}); 
		
		});
		}
};

/**
 * 页面公共类
 */
var MMSCommonHelper = {

    /**
    * 彩仓资源路径
    */
    SuperMMSResource: "http://g2.mail." + location.host.match(/[^.]+\.[^.]+$/)[0] + "/mmsstorage",

    /**
    * 贺卡素材地址
    */
    SupperMMSCardPath: "http://g2.mail." + location.host.match(/[^.]+\.[^.]+$/)[0] + "/mmssys",

    /**
    * 彩信存储目录
    */
    SuperMMSStorage: "uploads/sys/mmsstorage",

    /**
    * 贺卡存储目录
    */
    SupperMMSCardStorage: "uploads/sys",

    /**
    * 素材日志上报地址
    */
    fodderLogUrl: function () {
        return Utils.getAddedSiteUrl("mmsStorgeLog");
    },

    /**
    * 当前模块For静态页
    */
    CurrentModuleName: "",

    /**
    * 当前分类For静态页
    */
    CurrentModuleId: -1,

    /**
    * 静态文件地址
    */
    //StaticPageHost:mmsHost+"uploads/html/",
    StaticPageHost: "/mw2/mms/uploads/html/",

    /**
    * 彩信
    */
    MMS: {},

    /**
    * 服务器时间[年，月，日，时，分]
    */
    CurrentTime: { Y: 2010, M: 11, D: 24, H: 11, Min: 11 },

    /**
    * 图片码证码路径
    */
    ImageCodePath: "",

    /**
    * 是否需要显示验证码
    */
    IsShowValidImg: false,

    /**
    *彩信编辑同步年
    */
    IsEditSynchronizationYear: false,

    /**
    *当前节日ID
    */
    CurrentHolidayId: -1,

    /**
    *彩信当前节日ID
    */
    MMSCurrentHolidayId: -1,

    /**
    *彩信预览同频年
    */
    IsPrevSynchronizationYear: false,
    /**
    * 正在加载右边数据
    */
    IsLoadingMenuData: false,

    /**
    * 群发条数
    */
    GroupSendersCount: 200,

    /**
    * 回调
    */
    callback: function () { },

    /**
    *群发提示
    */
    ServiceInfo: "",
	/**
	 * 日封顶数
	 */
	maxDaySend: 1000,
	/**
	 * 月封顶
	 */
	maxMonthSend: 10000,
	getMaxDayMonthSend: function (str) {
		if (str == "") return;

		var dayMatch = str.match(/每天限发(\d*)/),
			monthMatch = str.match(/每月限发(\d*)/);

		dayMatch && (this.maxDaySend = dayMatch[1]);
		monthMatch && (this.maxMonthSend = monthMatch[1]);
	},
	/**
	 * @param {Boolean} isMonth 必填 true 为月封顶
	 */
	tipMaxDayMonthSend: function (isMonth) {
		var self = this,
			txt = "发送彩信超过{0}封顶上限：{1}条{2}",
			txt1 = "，升级邮箱可提高每{0}发送上限。",
			day = "日",
			month = "月";

		if (isMonth) {
			txt1 = txt1.format(month);
			txt = txt.format(month, this.maxMonthSend, this.is20Version() ? "" : txt1);
		} else {
			txt1 = txt1.format(day);
			txt = txt.format(day, this.maxDaySend, this.is20Version() ? "" : txt1);
		}

		top.$Msg.confirm(txt, function(){
			!self.is20Version() && top.$App.showOrderinfo();
		}, function(){
			//
		})
	},
	is20Version: function(){
		return top.$User.getServiceItem() == top.$User.getVipStr("20");
	},
    /**
    * 初始化数据
    */
    Init: function (isShowUserPartnerWindow) {
        var isTimeOut = Utils.PageisTimeOut(true);
        if (isTimeOut) {
            if (Sys.chrome) {
                $("#swfcontent").css("visibility", "hidden");
            }
            return false;
        }

        //初始化公共数据
        var param = {
            fromType: 1
        };
        var isInvoked = false;
        var dataXml = top.namedVarToXML("", param, "");
        $.ajax({
            type: "POST",
            url: Utils.getAddedSiteUrl("mmsInitData"),
            dataType: "json",
            data: dataXml,
            cache: false,
            contentType: "application/xml;charset:utf-8",
            async: false,
            success: function (msg) {
                if (isInvoked) { return; } //ajax有bug会执行两次
                isInvoked = true;
                if (msg.code == "S_OK") {//成功

                    //获取图片验证码地址 [保存在公共类中]
                    MMSCommonHelper.ImageCodePath = msg.validateUrl;
                    //alert("图片验证码路径:"+msg.Result);
                    MMSCommonHelper.CurrentTime.Y = msg.timeDate.substring(0, 4);
                    MMSCommonHelper.CurrentTime.M = msg.timeDate.substring(4, 6);
                    MMSCommonHelper.CurrentTime.D = msg.timeDate.substring(6, 8);
                    MMSCommonHelper.CurrentTime.H = msg.timeDate.substring(9, 11);
                    MMSCommonHelper.CurrentTime.Min = msg.timeDate.substring(12, 14);
                    MMSCommonHelper.IsShowValidImg = (msg.validateUrl.length > 0) ? 1 : 0;
                    Number(msg.groupNumHint) && (MMSCommonHelper.GroupSendersCount = Number(msg.groupNumHint));
                    MMSCommonHelper.CurrentHolidayId = msg.smsClassId;
                    MMSCommonHelper.MMSCurrentHolidayId = msg.mmsClassId;

					MMSCommonHelper.getMaxDayMonthSend(msg.chargeHint);

					//组装发送人数超过上限的提示语
					mmsPopMsg.ReceiveMaxMobile = mmsPopMsg.ReceiveMaxMobile.replace("{0}", MMSCommonHelper.GroupSendersCount);
					if (top.SiteConfig.comboUpgrade && !MMSCommonHelper.is20Version()) {//非20元套餐
						mmsPopMsg.ReceiveMaxMobile += mmsPopMsg.ComboUpgradeMsg;
					}
                    //将资源路径同步在top变量是以便访问

                    top._MMS = new Object();

                    MMSCommonHelper.IsShowValidCode();

                    function showPartnerTip() {
                        if (top.$User.needMailPartner()) {
                            $("#trTip").append("<div><a href='javascript:top.$App.show(\"mobile\");FF.close();'>*开通邮箱伴侣</a>享受更多彩信优惠</div>");
                            top.BH("partner_guide3");
                        }
                    }
                    //处理免费[温馨]提示语
                    var data = msg.chargeHint;
                    $("#spFreeTip").html("");

                    if (data.length > 0) {
                        var s = data.replace("class=\"style12font-ff0000\"", "");
                        $("#trTip").css("display", "");
                        $("#spFreeTip").html(s);
                        showPartnerTip();
                    }
                    else {
                        $("#trTip").css("display", "none");
                    }


                    var newYear = parseInt(MMSCommonHelper.CurrentTime.Y) + 1;
                    //处理年份下拉列 
                    $("#sltYear").html("");
                    $("#sltYear").html("<option value='" + MMSCommonHelper.CurrentTime.Y + "'>" + MMSCommonHelper.CurrentTime.Y + "</option><option value='" + newYear + "'>" + newYear + "</option>");
                    $("#sltYear").change(function () {
                        MMSCommonHelper.ChangeMonth();
                    });

                    if (MMSCommonHelper.IsEditSynchronizationYear) {
                        $("#sltYear").selectOptions(top._MMSDIYEditFromSource.TimmingYear);
                        MMSCommonHelper.IsEditSynchronizationYear = false;
                    }

                    if (MMSCommonHelper.IsPrevSynchronizationYear) {
                        $("#sltYear").selectOptions(top.MMSPerviewData.TimmingYear);
                        MMSCommonHelper.IsPrevSynchronizationYear = false;
                    }
                    MMSCommonHelper.ChangeMonth(false, MMSCommonHelper.CurrentTime.D, MMSCommonHelper.CurrentTime.Y, MMSCommonHelper.CurrentTime.M);

                    //接收人个数提示
                    try {
                        if (richInput) {
                            if (richInput.jContainer.find("div[rel]").length <= 0) {
                                //richInput.setTipText(MMSCommonHelper.ServiceInfo);
                                richInput.setTipText(mmsPopMsg.PromptMsg.replace("{0}", MMSCommonHelper.GroupSendersCount));
                            }
                        }
                    }
                    catch (e) { }

                    if (isShowUserPartnerWindow == true) {
                        if (msg.mmsCharge != 0) {
                            var ff = top.FloatingFrame.open("邮箱伴侣", "/m2012/html/mms/mmsShowPartner.html?sid={0}&mmsCharge={1}&rnd={2}".format(window.top.$App.getSid(), msg.mmsCharge / 100, Math.random()), 480, 325);
                            if (Sys.chrome) {
                                $("#swfcontent").css("visibility", "hidden");
                            }
                            ff.onclose = function () {
                                if (Sys.chrome) {
                                    //隐藏Flash
                                    $("#swfcontent").css("visibility", "visible");
                                }
                            };
                        }
                    }
                } else if (msg.code == "S_ERROR") {
                    top.FloatingFrame.alert(mmsPopMsg.SystemBusy);
                }
            }
        });

        //如果定时发送存在，绑定单击事件
        if ($("#chkTimming")) {
            $("#chkTimming").click(function () {
                //如果选中则显示时间选项框
                if (this.checked) {
                    $("#spYearToDay").css("display", "inline");
                    $("#spHourToMin").css("display", "inline");
                    //初始化当前时间
                    $("#sltYear option[text=" + MMSCommonHelper.CurrentTime.Y + "]").attr("selected", true);
                    $("#sltMonth option[value=" + MMSCommonHelper.CurrentTime.M + "]").attr("selected", true);
                    $("#sltDay option[value=" + MMSCommonHelper.CurrentTime.D + "]").attr("selected", true);
                    $("#sltHour option[value=" + MMSCommonHelper.CurrentTime.H + "]").attr("selected", true);
                    $("#sltMinute option[value=" + MMSCommonHelper.CurrentTime.Min + "]").attr("selected", true);
                    //更新月份
                    MMSCommonHelper.ChangeMonth();
                }
                else {
                    $("#spYearToDay").css("display", "none");
                    $("#spHourToMin").css("display", "none");
                }
            });

            //选择月份		
            $("#sltMonth").change(function () {
                MMSCommonHelper.ChangeMonth();
            });
        }
    },
    /**
    * //初始化菜单数据
    * @param {Object} moduleName 模块名
    * @param {Object} id 模块分类
    * @param {Object} pageNumber 页码
    * @param {Object} dataCallback 请求HTML片段成功后的数据回调
    * @param {Object} changerPageEfeCallBack 换页成功后的回调
    */
    InitMenuData: function (moduleName, id, pageNumber, dataCallback, changerPageEfeCallBack) {
        if (moduleName == "undefined" || moduleName == "" || (parseInt(id) == -1 && pageNumber == -1) || id == "undefined") {
            //无数据隐藏翻页
            $(".showMesBar").css("display", "none");
            return;
        }

        moduleName = String(moduleName).toLowerCase();

        var isSame = true;
        var pageId = pageNumber;
        if (MMSCommonHelper.CurrentModuleName != moduleName || new String(MMSCommonHelper.CurrentModuleId).toUpperCase() != new String(id).toUpperCase()) {
            //当前模块For静态页
            MMSCommonHelper.CurrentModuleName = moduleName;
            //当前分类For静态页
            MMSCommonHelper.CurrentModuleId = id;
            isSame = false;
        }

        var htmlUrl = "";
        htmlUrl = MMSCommonHelper.StaticPageHost + moduleName + "/" + moduleName + "_" + id + "_" + pageNumber + ".html?rd" + Math.random();

        if (htmlUrl != "") {
            top.WaitPannel.show(mmsPopMsg.MMSMTLoading);
            $.get(htmlUrl, function (dataHtml) {
                var selectPage = $(".selectPage");
                var countPage = $(dataHtml).attr("pagecount"); //获得此分类总共多少页

                if (typeof (dataCallback) == "function" && typeof (changerPageEfeCallBack) == "function") {
                    dataCallback(dataHtml);
                    changerPageEfe(countPage, pageId);
                    return;
                }
                selectPage.attr("pagecount", countPage);
                selectPage.attr("currentpage", pageId);
                $("#pnlData").html(dataHtml);

                if (!isSame) {
                    selectPage.empty();
                    var arr = [];
                    for (var i = 1; i <= countPage; i++) {
                        arr.push('<li><a href="javascript:;"><span rel="{0}">{1}</span></a></li>'
							.format(i, i + "/" + countPage + "页"));
                    }
                    arr = arr.join("");
                    selectPage.append($(arr));
                }

                $(".curPage").html(pageId + "/" + countPage + "页");

                if (parseInt(countPage) > 1) {
                    var ele = $(".pageCountBar");
                    $(".showMesBar").show();

                    if (pageId <= 1) {
                        //隐藏上一页
                        $($(ele[0]).children()[0]).hide();
                        $($(ele[1]).children()[0]).hide();

                        $($(ele[0]).children()[1]).show();
                        $($(ele[1]).children()[1]).show();
                    } else if (pageId >= countPage) {
                        //隐藏下一页
                        $($(ele[0]).children()[0]).show();
                        $($(ele[1]).children()[0]).show();

                        $($(ele[0]).children()[1]).hide();
                        $($(ele[1]).children()[1]).hide();
                    } else {
                        $($(ele[0]).children()[0]).show();
                        $($(ele[1]).children()[0]).show();

                        $($(ele[0]).children()[1]).show();
                        $($(ele[1]).children()[1]).show();
                    }
                } else {
                    $(".showMesBar").hide();
                    selectPage.hide();
                    //加下面的代码，避免IE6下下拉列表隐藏不了
                    $(".showMesBar").addClass("tempCss").removeClass("tempCss");
                }
                MMSCommonHelper.IsLoadingMenuData = false;
                top.WaitPannel.hide();
            });
        }
    },
    /**
    * 列表数据上一页
    */
    ListPre: function () {
        var selectEle = $(".selectPage")[0];
        var pageCount = $(selectEle).attr("pagecount");
        var currentPage = $(selectEle).attr("currentpage");
        if (parseInt(currentPage) > 1) {
            var newPage = parseInt(currentPage);
            newPage -= 1;
            MMSCommonHelper.InitMenuData(MMSCommonHelper.CurrentModuleName, MMSCommonHelper.CurrentModuleId, newPage, null, null)
        }
    },
    /**
    * 列数据下一页
    */
    ListNext: function () {
        var selectEle = $(".selectPage")[0];
        var pageCount = $(selectEle).attr("pagecount");
        var currentPage = $(selectEle).attr("currentpage");

        if (parseInt(currentPage) < parseInt(pageCount)) {
            var newPage = parseInt(currentPage);
            newPage += 1;
            MMSCommonHelper.InitMenuData(MMSCommonHelper.CurrentModuleName, MMSCommonHelper.CurrentModuleId, newPage, null, null)
        }
    },
    /**
    * 翻页弹出层
    */
    selectPageTool: function () {
        $(".curPage").parent().click(function (e) {
            $(this).next().show();
            e.stopPropagation();
        })
        $(document).click(function () {
            $(".selectPage").hide();
        })
        $(".selectPage").click(function (e) {
            var target = e.target,
				currPage;

            if (target.tagName == "SPAN") {
                currPage = target.getAttribute("rel");
            } else if (target.tagName == "A") {
                currPage = target.children[0].getAttribute("rel");
            } else {
                return;
            }

            MMSCommonHelper.InitMenuData(MMSCommonHelper.CurrentModuleName, MMSCommonHelper.CurrentModuleId, parseInt(currPage, 10), null, null);
        })
    },
    /**
    * 查看列表详细数据
    * @param {Object} module
    * @param {Object} ele
    */
    RivewDatailsData: function (module, ele) {
        if (module == "MMsSms") {
            //祝福语素材统计	
            Utils.logReports({
                mouduleId: 15,
                action: 20015,
                thing: "MMSRivewDatailsData"
            });
        } else {
            //点击素材的日志
            Utils.logReports({
                mouduleId: 16,
                action: 20116,
                thing: "mmsMaterial"
            });
        }

        var data = $(ele).attr("maininfo");
        data = data.substring(0, data.length - 1);
        data = data.substring(7);
        var json = $.evalJSON(unescape(data));
        //获取flash对象
        var flash = document.getElementById("FlashDIYMMS");
        var arr = new Array();
        $.each(json[0], function (index, item) {
            //如果是彩字页
            if ($($("#aToolsmmsSend").parent()).attr("class") == "curr_n") {
                //最多可输入70个字
                //emWordCount

                $("#txtContent").val($("#txtContent").val() + item.Content);
                if ($("#txtContent").val().length >= 70) {
                    var toolTip = $("#txtContent").next();
                    toolTip.show();
                    window.setTimeout(function () { toolTip.hide(); }, 5000)
                    $("#txtContent").val($("#txtContent").val().substring(0, 70));
                    $("#emWordCount").html("0");
                }
                else {
                    $("#emWordCount").html(70 - $("#txtContent").val().length)
                }

                return;
            }
            if (item.ContentType == 1) {
                //alert(MMSCommonHelper.SuperMMSResource);
                if (item.Content.toLowerCase().indexOf("/uploads") >= 0) {
                    item.Content = item.Content.replace("/" + MMSCommonHelper.SuperMMSStorage, MMSCommonHelper.SuperMMSResource);
                }
                else {
                    item.Content = MMSCommonHelper.SupperMMSCardPath + "/" + item.Content;
                }
            }
            //alert(item.Content)
            arr.push(item);
        });

        try {
            //向flash中添加过素才则编辑过
            MMSDIY.Edited = true;
            //alert(module);
            var from = "";

            switch (module.toLowerCase()) {
                case "mmsdiy": from = "caix";
                    try {
                        var dataXml = top.namedVarToXML("", { sendMmsSeqId: arr[0].SeqId }, "");
                        $.ajax({
                            type: "POST",
                            url: MMSCommonHelper.fodderLogUrl(),
                            data: dataXml,
                            contentType: "application/xml;charset:utf-8"
                        });
                    }
                    catch (e) { }
                    break;
                case "mmscard": from = "hek"; break;
                case "mmssms": from = "zhufy"; break;
                case "mmsmusic": from = "yiny";
                    try {
                        var dataXml = top.namedVarToXML("", { sendMmsSeqId: arr[0].SeqId }, "");
                        $.ajax({
                            type: "POST",
                            url: MMSCommonHelper.fodderLogUrl(),
                            data: dataXml,
                            contentType: "application/xml;charset:utf-8"
                        });
                    }
                    catch (e) { }
                    break;
                case "mmspic": from = "datt";
                    try {
                        var dataXml = top.namedVarToXML("", { sendMmsSeqId: arr[0].SeqId }, "");
                        $.ajax({
                            type: "POST",
                            url: MMSCommonHelper.fodderLogUrl(),
                            data: dataXml,
                            contentType: "application/xml;charset:utf-8"
                        });
                    }
                    catch (e) { }
                    break;
            }
            //debugger;
            flash.inputMMS(arr, from);
        }
        catch (e)
		{ }

    },
    /**
    * 刷新图片验证码
    * @param {Object} validImgEleId
    */
    RefreshImgRndCode: function (validImgEleId) {
        try {
            $("#txtValidCode").val('');
            document.getElementById(validImgEleId).src = MMSCommonHelper.ImageCodePath + "&rnd=" + Math.random();
            return false;
        }
        catch (e) {
        }
    },

    /**
    * 确定验证码是否显示
    */
    IsShowValidCode: function () {
        //alert(MMSCommonHelper.IsShowValidImg);
        if (MMSCommonHelper.IsShowValidImg) {
            $("#trValidCode").css("display", "");
            $("#spValidCode").css("display", "none"); 
            MMSCommonHelper.RefreshImgRndCode("imgValidate");
        }
        else {
            $("#trValidCode").css("display", "none");
        }
    },
    getFeedbackUrl: function () {
        var url = top.getDomain("uec") + "/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=" + top.$App.getSid();
        return url;
    },
    /**
    * 初始化导航链接
    */
    InitTools: function () {
        var self = this;
        //debugger;
        //做日志报
        try {
            //点击彩仓库写日志上报
            $("#aToolsFactory").click(function () {
                //记录跳转入的页面位置
                top.currentIndex = 0;

                Utils.logReports({
                    mouduleId: 16,
                    action: 20111,
                    thingId: 1,
                    thing: "aToolsFactory"
                });

                if (window.location.toString().indexOf("mmsFactory.html") > 0) {
                    return true;
                }
                //DIY
                setTimeout(function () {
                    if ($("#aToolsDIY").parent().attr("class") == "curr_n") {
                        //提示是否保存
                        var flash = document.getElementById("FlashDIYMMS");
                        var flashIsEdit = false;
                        try {
                            flashIsEdit = flash.mmsIsEdit();
                        }
                        catch (e) {
                        }

                        if (MMSDIY.Edited || flashIsEdit) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsFactory.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }

                        }
                        else {
                            window.location = "mmsFactory.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }
                    }
                    //彩字
                    else if ($("#aToolsmmsSend").parent().attr("class") == "curr_n") {
                        if ($.trim($("#txtSubject").val()).length > 0 || $.trim($("#txtContent").val()).length > 0) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsFactory.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsFactory.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }

                    }
                    else {
                        window.location = "mmsFactory.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                    }
                }, 100);
                return true;
            });

            //点击彩信DIY写日志上报
            $("#aToolsDIY").click(function () {
                //记录跳转入的页面位置
                top.currentIndex = 1;

                Utils.logReports({
                    mouduleId: 16,
                    action: 20111,
                    thingId: 2,
                    thing: "aToolsDIY"
                });

                //DIY
                if (window.location.toString().indexOf("mmsDIY.html") > 0) {
                    return true;
                }
                setTimeout(function () {
                    if ($("#aToolsDIY").parent().attr("class") == "curr_n") {
                        //提示是否保存
                        var flash = document.getElementById("FlashDIYMMS");
                        var flashIsEdit = false;
                        try {
                            flashIsEdit = flash.mmsIsEdit();
                        }
                        catch (e) {
                        }

                        if (MMSDIY.Edited || flashIsEdit) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsDIY.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsDIY.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }
                    }
                    //彩字
                    else if ($("#aToolsmmsSend").parent().attr("class") == "curr_n") {
                        if ($.trim($("#txtSubject").val()).length > 0 || $.trim($("#txtContent").val()).length > 0) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsDIY.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsDIY.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }

                    }
                    else {
                        window.location = "mmsDIY.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                    }
                }, 100);

                return true;
            });
            //点击彩字写日志上报
            $("#aToolsmmsSend").click(function () {
                //记录跳转入的页面位置
                top.currentIndex = 2;

                Utils.logReports({
                    mouduleId: 16,
                    action: 20111,
                    thingId: 3,
                    thing: "aToolsmmsSend"
                });

                if (window.location.toString().indexOf("mmsSend.html") > 0) {
                    return true;
                }
                //DIY
                setTimeout(function () {
                    if ($("#aToolsDIY").parent().attr("class") == "curr_n") {
                        //提示是否保存
                        var flash = document.getElementById("FlashDIYMMS");
                        var flashIsEdit = false;
                        try {
                            flashIsEdit = flash.mmsIsEdit();
                        }
                        catch (e) {
                        }

                        if (MMSDIY.Edited || flashIsEdit) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsSend.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsSend.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }
                    }
                    //彩字
                    else if ($("#aToolsmmsSend").parent().attr("class") == "curr_n") {
                        if ($.trim($("#txtSubject").val()).length > 0 || $.trim($("#txtContent").val()).length > 0) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsSend.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsSend.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }
                    }
                    else {
                        window.location = "mmsSend.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                    }
                }, 100);
                return true;
            });
            //点击彩信记录写日志上报
            $("#aToolsmmsRecord").click(function () {
                //记录跳转入的页面位置
                top.currentIndex = 0;

                Utils.logReports({
                    mouduleId: 16,
                    action: 20111,
                    thingId: 4,
                    thing: "aToolsmmsSend"
                });

                if (window.location.toString().indexOf("mmsRecord.html") > 0) {
                    return true;
                }
                //DIY
                setTimeout(function () {
                    if ($("#aToolsDIY").parent().attr("class") == "curr_n") {
                        //提示是否保存
                        var flash = document.getElementById("FlashDIYMMS");
                        var flashIsEdit = false;
                        try {
                            flashIsEdit = flash.mmsIsEdit();
                        }
                        catch (e) {
                        }

                        if (MMSDIY.Edited || flashIsEdit) {

                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsRecord.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsRecord.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }

                    }
                    //彩字
                    else if ($("#aToolsmmsSend").parent().attr("class") == "curr_n") {
                        if ($.trim($("#txtSubject").val()).length > 0 || $.trim($("#txtContent").val()).length > 0) {
                            if (confirm(mmsPopMsg.MMSDIYCancle)) {
                                window.location = "mmsRecord.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            window.location = "mmsRecord.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                        }

                    }
                    else {
                        window.location = "mmsRecord.html?sid=" + top.$App.getSid() + "&rnd=" + Math.random();
                    }
                }, 100);
                return true;

            });
        }
        catch (e) { }

        //$("#aToolsFactory").attr("href","mmsFactory.html?sid="+top.$App.getSid()+"&rnd="+Math.random());
        //$("#aToolsDIY").attr("href","mmsDIY.html?sid="+top.$App.getSid()+"&rnd="+Math.random());
        //$("#aToolsmmsSend").attr("href","mmsSend.html?sid="+top.$App.getSid()+"&rnd="+Math.random());
        //$("#aToolsmmsRecord").attr("href","mmsRecord.html?sid="+top.$App.getSid()+"&rnd="+Math.random()); 
        $("#aSuggest").click(function () {
            //DIY
            if ($("#aToolsDIY").parent().attr("class") == "curr_n") {
                //提示是否保存
                var flash = document.getElementById("FlashDIYMMS");
                var flashIsEdit = false;
                try {
                    flashIsEdit = flash.mmsIsEdit();
                }
                catch (e) {
                }

                if (MMSDIY.Edited || flashIsEdit) {

                    if (confirm(mmsPopMsg.MMSDIYCancle)) {
                        top.window.open(self.getFeedbackUrl());
                    }
                    else {
                        return false;
                    }
                }
                else {
                    top.window.open(self.getFeedbackUrl());
                }

            }
            //彩字
            else if ($("#aToolsmmsSend").parent().attr("class") == "curr_n") {
                if ($.trim($("#txtSubject").val()).length > 0 || $.trim($("#txtContent").val()).length > 0) {
                    if (confirm(mmsPopMsg.MMSDIYCancle)) {
                        top.window.open(self.getFeedbackUrl());
                    }
                    else {
                        return false;
                    }
                }
                else {
                    top.window.open(self.getFeedbackUrl());
                }

            }
            else {
                top.window.open(self.getFeedbackUrl());
            }

        });
    },
    /**
    * 彩信基本项验证
    * @param {boolean} save： 是否为存草稿 true：是
    */
    MMSBaseValid: function (save) {
        var isBirthdayPageT = false;

        try {
            isBirthdayPageT = isBirthdayPage;
        }
        catch (e) { }

        if (isBirthdayPageT) {
            var nodeList = br.getDataList("input[checked=true]");

            if (nodeList == null || nodeList.length < 1) {
                bindMobileTip(mmsPopMsg.InputMobiles);
                nodeList = null;
                return false;
            } else {
                nodeList = null;
            }
        } else {
            //号码验证
            if (!richInput.hasItem() && !save) {
                bindMobileTip(mmsPopMsg.InputMobiles);
                return false;
            }
            var error = richInput.getErrorText();
            if (error) {
                var data = error.encode();

				data = data.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&");
				bindMobileTip(data + ":" + mmsPopMsg.WrongMobile);
				return false;
			}
		
			if (richInput.getRightNumbers().length > MMSCommonHelper.GroupSendersCount) {
				bindMobileTip(mmsPopMsg.ReceiveMaxMobile);
				return false;
			}
		}

        //验证彩字内容不能为空
        if (FlashMMS.IsFlashMMS && $.trim($("#txtContent").val()).length <= 0) {
            var conTipTools = new MMSCommonHelper.TipTools({
                FT: $(".txt_wrap").eq(1),
                objErr: $("#txtContent"),
                msg: mmsPopMsg.FlashMMSContentIsEmpty
            });
            conTipTools.init();
            return false;
        }

        //验证码输入验证 (首先查看是否需要验证码) 
        if (MMSCommonHelper.IsShowValidImg) {
            if ($.trim($("#txtValidCode").val()) == "" || $("#txtValidCode").val() == mmsPopMsg.ValidCode) {
                var validTipTools = new this.TipTools({
                    FT: $('#trValidCode').find('td').eq(0),
                    objErr: $('#txtValidCode'),
                    msg: mmsPopMsg.ValidCode
                });
                validTipTools.init();
                MMSCommonHelper.IsShowValidCode();
                return false;
            }
        }
        return true;

        function bindMobileTip(msg) {
            var mobileTipTools = new MMSCommonHelper.TipTools({
                FT: $('#mmsTo'),
                objErr: $("#mmsTo .RichInputBoxLayout"),
                objFocus: $("#mmsTo .RichInputBoxLayout input"),
                msg: msg
            })
            mobileTipTools.init();
            window.scroll(0, 0);
        }
    },
    /**
    * 彩信验证
    * @param {Object} mms：彩信的JSON对象
    */
    MMSValid: function (mms) {
        if (MMSCommonHelper.MMSBaseValid()) {
            //内容和标题验证
            if ($.trim(mms.subject).length > 0 && mms.frameList != null && mms.frameList.length > 0) {

            }
            else {
                if ($.trim(mms.subject).length <= 0 && mms.frameList.length <= 0) {
                    //
                    if ((PerviewWindow.Type != -1 || Sys.chrome) && !FlashMMS.IsFlashMMS) {
                        alert(mmsPopMsg.MMSContentAndSujectIsEmpty)
                    }
                    else {
                        FloatingFrame.alert(mmsPopMsg.MMSContentAndSujectIsEmpty);
                    }
                    return false;
                }
            }
            //验证码输入验证 (首先查看是否需要验证码)   
            if (MMSCommonHelper.IsShowValidImg) {
                if ($.trim(mms.validCode) == "" || mms.validCode == mmsPopMsg.ValidCode) {
                    if ((PerviewWindow.Type != -1 || Sys.chrome) && !FlashMMS.IsFlashMMS) {
                        $("#txtValidCode").focus();
                        alert(mmsPopMsg.ValidCode);
                    }
                    else {
                        FloatingFrame.alert(mmsPopMsg.ValidCode, function () { $("#txtValidCode").focus(); });

                    }
                    //debugger;
                    MMSCommonHelper.IsShowValidCode();
                    return false;
                }
            }

            return true;
        }
        return false;

    },
    /**
    * 校验提示工具
    * @param {Object} o 包含参数如下
    *				{Object} FT 绑定弹出层的容器
    *				{Object} obj 校验内容容器
    *				{Object} obj 可选项 获取焦点对象，闪烁、提示效果消失
    *				{String} msg 提示语
    */
    TipTools: function (o) {
        var This = this;
        this.FT = o.FT;
        this.objErr = o.objErr;
        this.objFocus = o.objFocus || this.objErr;
        this.msg = o.msg;
        this.FTErr = new floatTips(this.FT);
        this.stopAnimate = function () {
            this.FTErr.fadeOut(200);
            if (this.FTErr.timeOut) {
                this.FTErr.fadeOut(200);
                clearTimeout(this.FTErr.timeOut);
            }
            $(this).unbind('focus');
        };
        this.init = function () {
            this.FTErr.tips(this.msg);
            RichInputBox.Tool.blinkBox(this.objErr, 'comErroTxt');
            this.objFocus.bind('focus', function () {
                This.stopAnimate();
            });
        };
    },
    //环境判断
    doForPlace: function (handler1, handler2) {
        if ((PerviewWindow.Type != -1 || Sys.chrome) && !FlashMMS.IsFlashMMS) {
            handler1();
        } else {
            handler2();
        }
    },
    /**
    * 存草稿验证
    * @param {Object} draftData 彩信数据
    */
    checkDraftMMSData: function (draftData) {
        //校验结果
        var checkResult = true;
        if (!draftData) { checkResult = false; }
        //定时发送
        if (draftData.sendType == 1) {
            if (draftData.sendTime == "") {
                checkResult = false;
            }
        }
        //校验发送号码、接收号码、帧
        (function (sendNumber, frameList) {
            if (!sendNumber || sendNumber == "" || sendNumber == "undefined" ||
			!frameList || frameList.length == 0) {
                checkResult = false;
            }
        })(draftData.sendNumber, draftData.frameList);
        //校验帧元素
        //缓存帧
        var fList = draftData.frameList,
        //帖长度
			frameLength = fList.length;
        while (frameLength--) {
            //帖数、帖类型、文件名带文件后缀、文件路径/分布式储存ID、文字内容、帧大小、播放时间、宽度、高度
            (function (frame, contentType, contentName, contentPath, content, contentSize, playTime, width, height) {
                if (typeof frame == undefined ||
				typeof contentType == undefined ||
				typeof contentName == undefined ||
				typeof contentPath == undefined ||
				typeof content == undefined ||
				typeof contentSize == undefined ||
				typeof playTime == undefined ||
				typeof width == undefined ||
				typeof height == undefined) {
                    checkResult = false;
                    return;
                }
            })(fList[frameLength].frame, fList[frameLength].contentType, fList[frameLength].contentName, fList[frameLength].contentPath, fList[frameLength].content, fList[frameLength].contentSize, fList[frameLength].playTime, fList[frameLength].width, fList[frameLength].height);
        }
        return checkResult;
    },
    /**
    * 获取默认主题
    * @param {String} subjcet 输入彩信主题
    */
    getDefaultSubject: function (subject) {
        if (subject == undefined || (typeof subject == "string" && $.trim(subject).length <= 0)) {
            subject = this.getUserName() + mmsPopMsg.DefaultTitle;
        }
        return subject;
    },
    //取用户名字
    getUserName: function () {
        var userData = top.UserData,
			userName = userData.userName,
			uidList = userData.uidList,
			name = "";

        if (userName && userName.length > 0) {//优先取号码
            name = userName;
        } else if (uidList && uidList.length > 0) {//获取别名
            for (var i = 0, l = uidList.length; i < l; i++) {
                //匹配如果为全数字字符串为飞信，否则为邮箱别名
                var reg = new RegExp("^\\d+$"),
					item = uidList[i];
                if (!reg.test(item)) {
                    name = item;
                }
            }
        }
        //最后获取手机号
        if (name == "") {
            name = userData.userNumber.replace(/^86/, "");
        }
        return toHtml(name);
    },
    /**
    * 存草稿
    */
    onSave: function () {
        //debugger;
        if (Utils.PageisTimeOut(true)) { return false; }
        //如果彩信基本验证未通过则返回false

        if (!MMSCommonHelper.MMSBaseValid(true)) { return false; }

        //彩信数据
        var draftData = top.MMSPerviewData.MMS,
        //彩信第一帧
			tempFrameList = draftData.frameList;

        if (tempFrameList == null) {
            alert(mmsPopMsg.MMSContentIsEmptySave);
            //同步联系人和主题
            PerviewWindow.syncPerviewData();

            MMSPerview.Close();

            return;
        }
        //帧长度
        var frameLength = tempFrameList.length,
        //重构帧，因为彩信重构静态服务没有改这部的格式 
        //reBuildFrame = [],
        //文本帧
			textFrame = null,
        //是否通过数据校验
			isDataValidate = true,
        //彩信文字
			mmsText = $.trim($("#txtContent").val()),
        //最终报文对象
			finalData = {};
        //重构彩信数据格式
        /*
        while(frameLength--) {
        reBuildFrame[frameLength] = {
        frame : tempFrameList[frameLength]["Frame"],
        contentType : tempFrameList[frameLength].ContentType,
        contentName : tempFrameList[frameLength].ContentName,
        contentPath : tempFrameList[frameLength].Content,
        content:tempFrameList[frameLength].content,
        contentSize : tempFrameList[frameLength].ContentSize,
        playTime : tempFrameList[frameLength].PlayTime,
        width : tempFrameList[frameLength].Width,
        height : tempFrameList[frameLength].Height
        };
        }*/
        //如果是彩仓过来的应该添加文本帧
        if (PerviewWindow.Type == 1 || PerviewWindow.Type == 4) {
            if (tempFrameList != null && tempFrameList.length == 2) {
                tempFrameList.pop();
            }
            //创建一个文本帧
            if (mmsText.length > 0) {
                textFrame = {
                    frame: 1,
                    contentType: 2,
                    contentName: "",
                    contentPath: "",
                    content: mmsText,
                    contentSize: "",
                    playTime: 4,
                    width: "",
                    height: ""
                };
                tempFrameList.push(textFrame);
            }
        }
        //fromType 1:web 2.wap
        draftData.fromType = 1;
        //把重构的数据赋回帧
        draftData.frameList = tempFrameList;
        //发送类型 0：普通彩信1：定时彩信
        draftData.sendType = 0;
        //1彩信发送 2.彩信预览
        draftData.actionId = 2;
        //发送号码
        draftData.sendNumber = top.UserData.userNumber;
        //接收号码，多个号码中间用“,”分隔
        draftData.receiverNumber = MMSCommonHelper.GetMobileList();
        //彩信标题
        draftData.subject = $("#txtSubject").val();
        //图片验证码
        if (MMSCommonHelper.IsShowValidImg) {
            draftData.validate = $("#txtValidCode").val();
        }
        //如果定时选中
        if ($("#chkTimming").attr("checked")) {
            //发送类型 
            draftData.sendType = 1;
            //发送时间
            draftData.sendTime = (
				$("#sltYear").val() + "-" + $("#sltMonth").val() + "-" + $("#sltDay").val() + " " + $("#sltHour").val() + ":" + $("#sltMinute").val() + ":" + "00"
			);
        }
        tempFrameList = textFrame = null;
        //校验报文
        isDataValidate = MMSCommonHelper.checkDraftMMSData(draftData);
        //通过校验
        if (isDataValidate) {
            //停止使用按扭
            //$("#btnSend").attr("disabled", "true");
            //$("#btnCancel").attr("disabled", "true");
            //$("#btnSave").attr("disabled", "true");
            //如果没有主题，添写默认主题
            draftData.subject = MMSCommonHelper.getDefaultSubject(draftData.subject);
            if (draftData.validate == mmsPopMsg.ValidCode || draftData.validate == 'undefined') {
                draftData.validate = "";
            }
            //生成最终数据，防止引用删除
            finalData = Object.extend(finalData, draftData);
            //删除不需要的键值
            delete finalData.destNumber;
            //delete finalData.subject;
            //delete finalData.frameList;
            delete finalData.validCode;
            delete finalData.seqId;
            delete finalData.classId;
            //生成XML报文
            var dataXml = top.namedVarToXML("", finalData, "");
            //console.log(dataXml);

            top.WaitPannel.show("正在保存草稿");
            $.ajax({
                type: "POST",
                url: Utils.getAddedSiteUrl("mmsSaveDraft"),
                dataType: "json",
                cache: false,
                data: dataXml,
                contentType: "application/xml;charset:utf-8",
                beforeSend: function (XMLHttpRequest) {

                },
                success: function (msg) {
                    //移除按钮的不可用状态
                    $("#btnSend, #btnSave, #btnCancel").removeAttr("disabled");
                    top.WaitPannel.hide();
                    //存草稿成功
                    if (msg.code == "S_OK") {
                        alert("保存草稿成功！");
                        //同步联系人和主题
                        PerviewWindow.syncPerviewData();

                        MMSPerview.Close();
                    } else if (msg.code == "VALIDATE_ERR") {//图片校验
                        //如果需要输入验证码
                        MMSCommonHelper.IsShowValidImg = true;
                        MMSCommonHelper.ImageCodePath = msg.validateUrl;
                        MMSCommonHelper.IsShowValidCode();
                        $("#txtValidCode").val(mmsPopMsg.ValidCode);
                    } else if (msg.resultMsg) {
                        alert(msg.resultMsg);
                    } else {
                        alert("保存彩信草稿失败!");
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    top.WaitPannel.hide();
                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    //错误处理
                    alert(mmsPopMsg.SystemBusy);
                }
            });
        }
    },

    /**
    * 彩信发送的公共方法
    * @param {Object} mms:彩信的JSON对象
    * @param {Object} isSave：是否保存
    * @param {Object} isTimming：是否为定时
    * @param {Object} timmingDate：定时时间
    * @param {Object} from：发送来源
    */
    MMSSend: function (mms, isSave, isTimming, timmingDate, from) {
        if (mms.frameList == null) {
            mms.frameList = [];
        }
        //如果验证能过则发送
        if (MMSCommonHelper.MMSValid(mms)) {
            if (isTimming) {
                //点击发送按钮定时发送的的日志上报
                Utils.logReports({
                    mouduleId: 16,
                    action: 20114,
                    thingId: 1,
                    thing: "TimmingSend"
                });
            }

            var list = "";
            var istimmingMMSId = -1;
            //如果为定时彩信编辑过来的发送 [top._EditTimmingGroupId:为定时彩信编辑的GruopId便于定时彩信编辑发送成功后删除原来的定时彩信] 
            if (top._EditTimmingGroupId != -1 && parseInt(top._EditTimmingGroupId) > 0) {
                istimmingMMSId = parseInt(top._EditTimmingGroupId);
            }
            $.each(mms.frameList, function (k, item) {

                if (unescape(item.content).indexOf("电子名片") > -1) {
                    item.contentType = 4;
                }

                if (item.contentPath) {
                    var pathLower = item.contentPath.toLowerCase();

                    //素材绝对路径转相对路径
                    if (/http(.+)mmsstorage/.test(pathLower)) {
                        item.contentPath = item.contentPath.replace(/.+mmsstorage/, "/" + MMSCommonHelper.SuperMMSStorage);
                    } else if (item.contentPath && /http(.+)mmssys/.test(pathLower)) {
                        item.contentPath = item.contentPath.replace(/.+mmssys/, "/" + MMSCommonHelper.SupperMMSCardStorage);
                    }
                }
                if ((item.contentType == 2 || item.contentType == 4) && !top._mmsCanSplit) { //将文本数据编码
                    item.content = escape(item.content);
                }
                if (!item.width) {
                    item.width = 0;
                }
                if (!item.height) {
                    item.height = 0;
                }
                if (!item.contentPath) {
                    item.contentPath = "";
                }
                list += "{\"content\":\"" + item.content + "\",\"contentPath\":\"" + item.contentPath + "\",\"contentType\":" + item.contentType + ",\"frame\":" + item.frame + ",\"playTime\":" + item.playTime + ",\"contentSize\":" + item.contentSize + ",\"contentName\":\"" + escape(item.contentName) + "\",\"contentPath\":\"" + item.contentPath + "\",\"width\":" + item.width + ",\"height\":" + item.height + "}";
                if (k < mms.frameList.length - 1) {
                    list += ",";
                }
            });

            //如果没有主题，添写默认主题
            mms.subject = MMSCommonHelper.getDefaultSubject(mms.subject);

            //将MMS转成json串
            if (mms.validCode == mmsPopMsg.ValidCode || mms.validCode == 'undefined') {
                mms.validCode = "";
            }

            var SENDVCF = 6,
				TIMMING = 1,
				NORMAL = 0;
            mms.sendType = isTimming ? TIMMING : NORMAL;

            //如果isSave是布尔值，则转成数字
            if (typeof isSave == "boolean") {
                var isSave = isSave ? 0 : 1;
            } else {
                var isSave = isSave;
            }
            var mmsCanSplit = false;
            //debugger;
            if (top._mmsCanSplit == true) {
                mmsCanSplit = true;
            }
            var curSendMmsSeqId = -1;
            if (PerviewWindow.Type == 1 || PerviewWindow.Type == 4) {
                curSendMmsSeqId = mms.seqId;
            }
            if (!mms.validCode) {
                mms.validCode = "";
            }

            var actionId = (from == 2) ? 2 : 1;
            if (/.*电子名片$/.test(mms.subject)) {
                actionId = SENDVCF;
                isSave = 1;
            }

            var strmms = "{\"receiverNumber\":\"" + mms.destNumber + "\",\"sendNumber\":\"" + top.UserData.userNumber + "\",\"sendType\":\"" + mms.sendType + "\",\"sendTime\":\"" + timmingDate + "\",\"subject\":\"" + escape($.trim(mms.subject)) + "\",\"isSave\":\"" + isSave + "\",\"oldId\":\"" + istimmingMMSId + "\",\"splitFirm\":" + mmsCanSplit + ",\"sendMmsSeqId\":\"" + curSendMmsSeqId + "\",\"fromType\":1,\"actionId\":" + actionId + ",\"frameList\":[" + list + "],\"validate\":\"" + mms.validCode + "\"}";
            var dataJson = eval("(" + strmms + ")");
            var dataXml = top.namedVarToXML("", dataJson, "");

            top.WaitPannel.show(mmsPopMsg.SendingMMS);
            $.ajax({
                type: "POST",
                url: Utils.getAddedSiteUrl("sendMms"),
                dataType: "json",
                cache: false,
                data: dataXml,
                contentType: "application/xml;charset:utf-8",
                beforeSend: function (XMLHttpRequest) {

                },
                success: function (msg) {
                    top.$App.trigger("mms_send", { count: mms.destNumber.split(",").length });
                    //移除按钮的不可用状态
                    $("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").removeAttr("disabled");

                    $("#btnSend, #btnSave, #btnCancel").removeAttr("disabled");

                    top.WaitPannel.hide();
                    top._mmsCanSplit = false;

                    if (msg.code == "S_OK") {
                        //彩信发送成功，进行行为日志上报
                        /* 0：默认
                        彩信仓库（Web)：
                        1.自写彩信->带音乐
                        2.自写彩信->带图片
                        3.自写彩信->音乐图片都带*/
                        try {
                            var hasImg = false;
                            var hasMusic = false;
                            var hasText = false;
                            var hasVcf = false;
                            $.each(mms.frameList, function (k, item) {
                                if (item.contentType == 1) {
                                    //有图片
                                    hasImg = true;
                                }
                                if (item.contentType == 2) {
                                    //有文字
                                    hasText = true;
                                }
                                if (item.contentType == 3) {
                                    //有音乐
                                    hasMusic = true;
                                }
                                if (item.contentType == 4) {
                                    //有电子名片附件
                                    hasVcf = true;
                                }
                            });

                            var postType = 0;
                            if (hasImg) {
                                postType = 2;
                            }
                            if (hasMusic) {
                                postType = 1;
                            }

                            if (hasVcf) {
                                postType = 4;
                            }

                            if (hasImg && hasMusic) {
                                postType = 3;
                            }

                            //做日志报
                            Utils.logReports({
                                mouduleId: 16,
                                action: 60,
                                thingId: postType,
                                thing: "successMmsSend",
                                type: 1
                            });

                            if (isSave == 0)//如果保存彩信
                            {
                                if (hasText) {
                                    if (from == 2) {//如果是自写彩信
                                        Utils.logReports({
                                            mouduleId: 16,
                                            action: 61,
                                            thingId: 1,
                                            thing: "successSaveMmsDIY",
                                            type: 1
                                        });
                                    }
                                    Utils.logReports({
                                        mouduleId: 16,
                                        action: 61,
                                        thingId: 2,
                                        thing: "successSaveMmsText",
                                        type: 1
                                    });
                                }
                                if (hasMusic) {
                                    if (from == 2) {//如果是自写彩信
                                        Utils.logReports({
                                            mouduleId: 16,
                                            action: 61,
                                            thingId: 1,
                                            thing: "successSaveMmsDIY",
                                            type: 1
                                        });
                                    }
                                    Utils.logReports({
                                        mouduleId: 16,
                                        action: 61,
                                        thingId: 3,
                                        thing: "successSaveMmsMusic",
                                        type: 1
                                    });
                                }
                                if (!hasText && !hasMusic) {
                                    if (from == 2) {//如果是自写彩信
                                        Utils.logReports({
                                            mouduleId: 16,
                                            action: 61,
                                            thingId: 1,
                                            thing: "successSaveMmsDIY",
                                            type: 1
                                        });
                                    } else {
                                        Utils.logReports({
                                            mouduleId: 16,
                                            action: 61,
                                            thingId: 0,
                                            thing: "successSaveMmsOther",
                                            type: 1
                                        });
                                    }
                                }
                            }
                        }
                        catch (e)
						{ }

                        //接收人存在Top变量，为成功页访问   
                        top._mmsReceivedPerson = mms.destNumber;
                        //彩信来源1:彩仓2：DIY 3:彩信记录 4:成功页 5：彩字
                        top._mmsFromSource = from;
                        //是否为定时
                        top._mmsisTimming = isTimming;
                        //彩信ID
                        //top._mmsId=msg.Id;
                        //彩信标题
                        top._mmsSubject = mms.subject;

                        //彩仓彩信ID
                        if (PerviewWindow.Type == 1 || PerviewWindow.Type == 4) {
                            top._mmsStorageSeqId = mms.seqId;
                        }
                        else {
                            top._mmsStorageSeqId = -1;
                        }

                        //如果是预览窗口发送 
                        if (PerviewWindow.IsPerview) {
                            PerviewWindow.SuccessSend(isSave);
                        }
                        else {
                            //发送电子名片成功行为上报
                            var vCard = Utils.queryString("vCard");
                            if (vCard) {
                                if (vCard == 'myVcard') top.addBehavior("我的电子名片页-彩信发送成功");
                                else if (vCard == 'contactVcard') top.addBehavior("联系人的电子名片页-彩信发送成功");
                            }
                            //跳转到成功页
                            window.location = top.M139.Text.Url.getAbsoluteUrl("/m2012/html/mms/mmsSuccess.html?rd=" + Math.random() + "&isSave=" + isSave);
                        }
                    } else if (msg.code == "MMS_SPLIT_TIP") {//拆分代码
                        top._mmsCanSplit = false;
                        //彩信超过100KB确认是否可以拆分
                        if (PerviewWindow.Type != -1) {
                            if (confirm(msg.resultMsg)) {
                                top._mmsCanSplit = true;
                                //$("#txtValidCode").val(mmsPopMsg.ValidCode);
                                $("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").attr("disabled", true);
                                $("#btnSend, #btnSave, #btnCancel").attr("disabled", true);

                                MMSCommonHelper.MMSSend(mms, isSave, isTimming, timmingDate, from);
                            }
                        } else {
                            if (Sys.chrome) {
                                if (confirm(msg.resultMsg)) {
                                    top._mmsCanSplit = true;
                                    //$("#txtValidCode").val(mmsPopMsg.ValidCode);
                                    $("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").attr("disabled", true);
                                    $("#btnSend, #btnSave, #btnCancel").attr("disabled", true);

                                    MMSCommonHelper.MMSSend(mms, isSave, isTimming, timmingDate, from);
                                }
                            }
                            else {
                                FloatingFrame.confirm(msg.resultMsg, function () {
                                    top._mmsCanSplit = true;
                                    //$("#txtValidCode").val(mmsPopMsg.ValidCode);
                                    $("#btnTopSend, #btnTopPreview, #btnBottomSend, #btnBottomPreview").attr("disabled", true);
                                    $("#btnSend, #btnSave, #btnCancel").attr("disabled", true);


                                    MMSCommonHelper.MMSSend(mms, isSave, isTimming, timmingDate, from);
                                }, null, true);
                            }
                        }
                        return;
                    } else if (msg.code == "VALIDATE_ERR" || msg.code =="NO_VERIFY_CODE" || msg.code=="WRONG_VERIFY_CODE" ) {//图片校验
                        //如果需要输入验证码
                        MMSCommonHelper.IsShowValidImg = true;
                        MMSCommonHelper.ImageCodePath = msg.validateUrl;
                        MMSCommonHelper.IsShowValidCode();
                        //MMSCommonHelper.validCodeTips(mmsPopMsg.VALIDATE_ERR);
                        var validTipTools = new MMSCommonHelper.TipTools({
                            FT: $('#trValidCode').find('td').eq(0),
                            objErr: $('#txtValidCode'),
                            msg: mmsPopMsg.VALIDATE_ERR
                        });
                        validTipTools.init();
                        $("#txtValidCode").val(mmsPopMsg.ValidCode);
                    } else if ( msg.code == "MMS_VALIDATE_INPT") {//图片校验
                        //如果需要输入验证码
                        MMSCommonHelper.IsShowValidImg = true;
                        MMSCommonHelper.ImageCodePath = msg.validateUrl;
                        MMSCommonHelper.IsShowValidCode();
                        //MMSCommonHelper.validCodeTips(mmsPopMsg.VALIDATE_ERR);
                        var validTipTools = new MMSCommonHelper.TipTools({
                            FT: $('#trValidCode').find('td').eq(0),
                            objErr: $('#txtValidCode'),
                            msg: mmsPopMsg.ValidCode
                        });
                        validTipTools.init();
                        $("#txtValidCode").val(mmsPopMsg.ValidCode);
                    } else if (msg.code == 'MMS_VALIDATE_INPT') {
                        //如果需要输入验证码
                        MMSCommonHelper.IsShowValidImg = true;
                        MMSCommonHelper.ImageCodePath = msg.validateUrl;
                        MMSCommonHelper.IsShowValidCode();
                        //MMSCommonHelper.validCodeTips(mmsPopMsg.VALIDATE_ERR);
                        var validTipTools = new MMSCommonHelper.TipTools({
                            FT: $('#trValidCode').find('td').eq(0),
                            objErr: $('#txtValidCode'),
                            msg: mmsPopMsg.ValidCode
                        });
                        validTipTools.init();
                        $("#txtValidCode").val(mmsPopMsg.ValidCode);
                    }else if (msg.code == "MMS_DAY_LIMIT" && top.SiteConfig.comboUpgrade) {
						MMSCommonHelper.tipMaxDayMonthSend();
                    } else if (msg.code == "MMS_MONTH_LIMIT" && top.SiteConfig.comboUpgrade) {
						MMSCommonHelper.tipMaxDayMonthSend(true);
                    } else {
                        MMSCommonHelper.doForPlace(function () {
							//alert(msg.resultMsg || mmsPopMsg.SystemBusy);
							FloatingFrame.alert(msg.resultMsg || mmsPopMsg.SystemBusy,function(){
							
								 if(msg.code === 'MMS_SIZE_ERROR'){
									  top._mmsCanSplit = true;
									  MMSCommonHelper.MMSSend(mms, isSave, isTimming, timmingDate, from);
							      }
								
								
							});
                        }, function () {
							FloatingFrame.alert(msg.resultMsg || mmsPopMsg.SystemBusy,function(){
							
							      if(msg.code === 'MMS_SIZE_ERROR'){
									  top._mmsCanSplit = true;
									  MMSCommonHelper.MMSSend(mms, isSave, isTimming, timmingDate, from);
							      }
							});
                        })
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    top.WaitPannel.hide();
                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    MMSCommonHelper.doForPlace(function () {
                        alert(mmsPopMsg.SystemBusy);
                    }, function () {
                        FloatingFrame.alert(mmsPopMsg.SystemBusy);
                    });
                }
            });
        }
        else {
            return false;
        }
    },
    sendPartSms:function(){
    	
    	
    },
    /**
    * 接收从URL里传进来的初始化值
    */
    GetInitData: function () {
        var initDataKey = Utils.queryString("initData");
        if (initDataKey) {
            return top[initDataKey];
        }
    },
    /**
    * 初始化接收人输入框
    */
    InitReceivePerson: function () {
        //地址自动匹配
        var param =
		{
		    container: document.getElementById("mmsTo"),
		    autoHeight: true,
		    type: "mobile",
		    plugins: [RichInputBox.Plugin.AutoComplete],
		    autoDataSource: true
		};
        richInput = new RichInputBox(param);
        //richInput.setTipText(mmsPopMsg.PromptMsg);
        //richInput.focus(); 

        var initData = this.GetInitData();

        if (initData) {
            if (initData.receivers && initData.receivers.length > 0) {

                richInput.insertItem(initData.receivers.join(";"));
            }
            if (initData.subject) {
                $("#txtSubject").val(initData.subject);
            }
        }
    },
    /**
    * 获取收件人收机号,多个用逗号分割
    */
    GetMobileList: function () {
        var result = "";
        var isBirthdayPageT = false;
        try {
            isBirthdayPageT = isBirthdayPage;
        }
        catch (e) { }
        if (isBirthdayPageT) {
            var successMobiles = "";        //已发送生日提醒的列表 号码,日期;13760225650,2011-05-05
            var nodeList = br.getDataList("input[checked=true]");
            var arrBirthday;
            var mobile = "";
            var arr_DateBirthday;
            var arr_DateTemp = top.UserData.ServerDateTime.format("yyyy-MM-dd").split("-");
            var birthday_temp;
            if (nodeList != null && nodeList.length > 0) {
                for (var i = 0; i < nodeList.length; i++) {
                    arrBirthday = nodeList[i].split(',');
                    //提醒邮件地址/号码
                    mobile = arrBirthday[0];
                    if (mobile.substring(0, 2) == "86") {
                        mobile = mobile.substring(2);
                    }
                    result += mobile + ","; //发送彩信用
                    successMobiles += mobile + ",";
                    //提醒时间
                    arr_DateBirthday = arrBirthday[1].split("-");
                    //如果当前时间是在12月，而生日的月份是1月，则是明年的提醒(年份+1)
                    if (parseInt(arr_DateBirthday[1]) == 1 && parseInt(arr_DateBirthday[2]) < 11 && parseInt(arr_DateTemp[1]) == 12) {
                        successMobiles += (parseInt(arr_DateTemp[0]) + 1).toString();
                    }
                    else {
                        successMobiles += arr_DateTemp[0];
                    }
                    successMobiles += "-" + arr_DateBirthday[1] + "-" + arr_DateBirthday[2] + ";";
                }
            }
            var dateSuccess = new Date();
            dateSuccess.setDate(dateSuccess.getDate() + 1);
            Utils.setCookie("sucMobiles" + top.$App.getSid(), successMobiles.substr(0, successMobiles.length - 1), dateSuccess); //保存已发送祝福时用				
            nodeList = null;
        }
        else {
            var arrEmail = richInput.getRightNumbers();
            if (arrEmail.length > 0) {
                for (var i = 0; i < arrEmail.length; i++) {
                    var email = NumberTool.getNumber(arrEmail[i]);
                    if (Utils.isChinaMobileNumber(email)) {
                        result += email + ",";
                    }
                }
            }
        }
        if (result.length > 0) result = result.substr(0, result.length - 1);
        return result;
    },
    /**
    * 添加联系人
    * @param {Object} ele
    */
    AddContact: function (ele) {
        var addrFrame = $("#addrFrame");
        if (addrFrame.length == 0) {
            var url = "/m2012/html/addrwin.html?type=mobile&callback=AddrCallback&useNameText=true";
            addrFrame = $("<iframe frameBorder='0' style='z-index:2048;display:none;border:1px solid #b1b1b1;height:310px;width:170px;position:absolute;' id='addrFrame' src='" + url + "'></iframe>");
            addrFrame.appendTo(document.body);
            $(document).click(function () {
                $("#addrFrame").hide();
            });
        }
        var offset = ele.offset();
        addrFrame.css({ top: offset.top + ele.height(), left: offset.left - addrFrame.width() + ele.width() });
        addrFrame.show();
        return false;
    },
    /**
    * 月份改变
    * @param {String} day 初始化时的天
    * @param {String} year 初始化时的年
    * @param {String} month 初始化时的月
    */
    ChangeMonth: function (isIframe, day, year, month) {
        //debugger;
        var sltDay = $("#sltDay");
        var sltYear = $("#sltYear");
        var sltMonth = $("#sltMonth");
        if (isIframe) {
            var p = top.document.getElementById("mms");

            sltYear = $(p.contentWindow.document.getElementById("sltYear"));
            sltMonth = $(p.contentWindow.document.getElementById("sltMonth"));
            sltDay = $(p.contentWindow.document.getElementById("sltDay"));
        };

        var selDay = sltDay[0];
        var selectDay = day || sltDay.selectedValues()[0];
        var date = new Date();
        date.setFullYear(year || sltYear.val());
        date.setDate(1);
        date.setMonth(month || sltMonth.val());
        date.setDate(0);
        var days = date.getDate();
        date.setDate(1);
        var weekDays = ["日 星期天", "日 星期一", "日 星期二", "日 星期三", "日 星期四", "日 星期五", "日 星期六"];
        var startWeekDay = date.getDay();
        selDay.options.length = 0;
        for (var i = 1; i <= days; i++) {
            var wd = (startWeekDay + i - 1) % 7;
            var opValue = i > 9 ? i : "0" + i;
            var op = new Option(i + weekDays[wd], opValue);
            if (wd == 0 || wd == 6) {
                op.style.color = "red";
            }
            selDay.options.add(op);
        }
        $("#sltDay").selectOptions(selectDay);
    }
};

/**
 * 添加联系人的回调
 * @param {Object} addr
 */
function AddrCallback(addr){

	var mobiles = richInput.getRightNumbers();      

	/*if(mobiles.length>=MMSCommonHelper.GroupSendersCount)        
	{
		$("#spanErrMsg").html(mmsPopMsg.ReceiveMaxMobile.replace("{0}",MMSCommonHelper.GroupSendersCount));
		$("#mmsErrMsg").css("display","block");
		return false;
	}
	else
	{   */
	    //添加过联系人则编辑过     
	    MMSDIY.Edited=true;
		richInput.insertItem(addr);

		if(top.UserData.userNumber==NumberTool.add86(addr))
		{
			//发给自己记录日志
			if(PerviewWindow.Type==-1)
			{
				//DIY页
				try{
					Utils.logReports({
						mouduleId: 19,
						action: 26017,
						thingId: 1,
						thing: "sendToSelf"
					});
				}catch(e){}
			}
			else{
				//预览页
				try{
					Utils.logReports({
						mouduleId: 19,
						action: 26017,
						thingId: 2,
						thing: "sendToSelf"
					});
				}catch(e){}
			}		
		}
		
	//}  
}


//html字符串转义
function toHtml(str){
	return str.encode();
	//return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	//return Utils.htmlEncode(str).replace(/&nbsp;/g, " ");
}

/*
 * 将数组或对象中首字母大写的键改成小写
 * param {Array || Object} param 必填: 为数组或者json对象
 */
function toLowers(param){
	var delKeys = []; //定义数组，存储要删除的大写键
	var len = param ? (param.length || 1) : 0;

	for(var i = 0; i < len; i++){
		var obj = param[i] || param;
		
		for(var key in obj){
			//将大写键存储在delKeys数组中
			if((/[A-W]/).test(key.substr(0, 1))){
				delKeys.push(key);
			}
			
			var newKey = key.substr(0, 1).toLowerCase() + key.substring(1); //大写键转小写
			obj[newKey] = obj[key];
		}
		
		//清除大写键
		for(var j = 0, l = delKeys.length; j < l; j++){
			delete obj[delKeys[j]];
		}

		obj = null;
		delKeys = [];
	}
}

/*
 * 将数组或对象中首字母小写的键改成大写
 * param {Array || Object} param 必填: 为数组或者json对象
 */
function toUppers(param){
	var delKeys = []; //定义数组，存储要删除的小写键
	var len = param.length || 1;

	for(var i = 0; i < len; i++){
		var obj = param[i] || param;
		
		for(var key in obj){
			//将小写键存储在delKeys数组中
			if((/[a-w]/).test(key.substr(0, 1))){
				delKeys.push(key);
			}
			
			var newKey = key.substr(0, 1).toUpperCase() + key.substring(1); //小写键转大写
			obj[newKey] = obj[key];
		}
		
		//清除小写键
		for(var j = 0, l = delKeys.length; j < l; j++){
			delete obj[delKeys[j]];
		}

		obj = null;
		delKeys = [];
	}
}

/*
 * 将content中的路径赋值给contentPath, 并清空content
 * param {Array} list 必填
 */
function contentToPath(list){
	for(var i = 0, len = list.length; i < len; i++){
		var fra = list[i];
		
		//如果为图片帧
		if(fra.contentType == 1 || fra.contentType == 3){
			fra.contentPath = fra.content;
			fra.content = "";
		}
	}
}

/*
 * 将contentPath中的路径赋值给content, 并清空contentPath
 * param {Array} list 必填
 */
function pathToContent(list){
	for(var i = 0, len = list.length; i < len; i++){
		var fra = list[i];
		
		//如果为图片帧
		if(fra.contentType == 1 || fra.contentType == 3){
			fra.content = fra.contentPath;
			fra.contentPath = "";
		}
	}
}

//--------------------------------------
/***************jquery json object to string  and  json string to json object***************************/

(function($){$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);


/*****扩展Jquery************************************/
jQuery.extend({   
    /**  
     * 清除当前选择内容  
     */  
    unselectContents: function(){   
        if(window.getSelection)   
            window.getSelection().removeAllRanges();   
        else if(document.selection)   
            document.selection.empty();   
    }   
});   
jQuery.fn.extend({   
    /**  
     * 选中内容  
     */  
    selectContents: function(){   
        $(this).each(function(i){   
            var node = this;   
            var selection, range, doc, win;   
            if ((doc = node.ownerDocument) &&   
                (win = doc.defaultView) &&   
                typeof win.getSelection != 'undefined' &&   
                typeof doc.createRange != 'undefined' &&   
                (selection = window.getSelection()) &&   
                typeof selection.removeAllRanges != 'undefined')   
            {   
                range = doc.createRange();   
                range.selectNode(node);   
                if(i == 0){   
                    selection.removeAllRanges();   
                }   
                selection.addRange(range);   
            }   
            else if (document.body &&   
                     typeof document.body.createTextRange != 'undefined' &&   
                     (range = document.body.createTextRange()))   
            {   
                range.moveToElementText(node);   
                range.select();   
            }   
        });   
    },   
    /**  
     * 初始化对象以支持光标处插入内容  
     */  
    setCaret: function(){   
        if(!$.browser.msie) return;   
        var initSetCaret = function(){   
            var textObj = this;   
            //textObj.caretPos = document.selection.createRange().duplicate();   
			var selectedObj=this.ownerDocument.selection.createRange()
			if(selectedObj.parentElement()==this){
		        textObj.caretPos = selectedObj;
		    }
        };   
        $(this)   
        .click(initSetCaret)   
        .select(initSetCaret)   
        .keyup(initSetCaret);
    },   
    /**  
     * 在当前对象光标处插入指定的内容  
     */  
    insertAtCaret: function(textFeildValue){   
       var textObj = $(this).get(0);   
       if(document.all && textObj.createTextRange && textObj.caretPos){   
           var caretPos= textObj.caretPos;   
		   if (caretPos=="null")
		   {
			   textObj.value+=textFeildValue;
		   }
		   else
		   {
			   caretPos.text +=caretPos.text.charAt(caretPos.text.length-1) == '' ?   
                               textFeildValue+'' : textFeildValue;	               	   
		   }

       }   
       else if(textObj.setSelectionRange){   
           var rangeStart=textObj.selectionStart;   
           var rangeEnd=textObj.selectionEnd;   
           var tempStr1=textObj.value.substring(0,rangeStart);   
           var tempStr2=textObj.value.substring(rangeEnd);   
           textObj.value=tempStr1+textFeildValue+tempStr2;   
           textObj.focus();   
           var len=textFeildValue.length;   
           textObj.setSelectionRange(rangeStart+len,rangeStart+len);   
           textObj.blur();   
       }   
       else {   
           textObj.value+=textFeildValue;   
       }   
    }   
});

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';(6($){$.p.J=6(){5 e=6(a,v,t,b){5 c=U.V("K");c.j=v,c.D=t;5 o=a.z;5 d=o.n;3(!a.s){a.s={};q(5 i=0;i<d;i++){a.s[o[i].j]=i}}3(8 a.s[v]=="P")a.s[v]=d;a.z[a.s[v]]=c;3(b){c.k=9}};5 a=Q;3(a.n==0)7 4;5 f=9;5 m=u;5 g,v,t;3(8(a[0])=="A"){m=9;g=a[0]}3(a.n>=2){3(8(a[1])=="L")f=a[1];h 3(8(a[2])=="L")f=a[2];3(!m){v=a[0];t=a[1]}}4.x(6(){3(4.B.y()!="C")7;3(m){q(5 a W g){e(4,a,g[a],f)}}h{e(4,v,t,f)}});7 4};$.p.X=6(b,c,d,e,f){3(8(b)!="E")7 4;3(8(c)!="A")c={};3(8(d)!="L")d=9;4.x(6(){5 a=4;$.Y(b,c,6(r){$(a).J(r,d);3(8 e=="6"){3(8 f=="A"){e.Z(a,f)}h{e.M(a)}}})});7 4};$.p.R=6(){5 a=Q;3(a.n==0)7 4;5 d=8(a[0]);5 v,F;3(d=="E"||d=="A"||d=="6"){v=a[0];3(v.G==10){5 l=v.n;q(5 i=0;i<l;i++){4.R(v[i],a[1])}7 4}}h 3(d=="11")F=a[0];h 7 4;4.x(6(){3(4.B.y()!="C")7;3(4.s)4.s=S;5 b=u;5 o=4.z;3(!!v){5 c=o.n;q(5 i=c-1;i>=0;i--){3(v.G==N){3(o[i].j.O(v)){b=9}}h 3(o[i].j==v){b=9}3(b&&a[1]===9)b=o[i].k;3(b){o[i]=S}b=u}}h{3(a[1]===9){b=o[F].k}h{b=9}3(b){4.12(F)}}});7 4};$.p.13=6(f){5 a=8(f)=="P"?9:!!f;4.x(6(){3(4.B.y()!="C")7;5 o=4.z;5 d=o.n;5 e=[];q(5 i=0;i<d;i++){e[i]={v:o[i].j,t:o[i].D}}e.14(6(b,c){H=b.t.y(),I=c.t.y();3(H==I)7 0;3(a){7 H<I?-1:1}h{7 H>I?-1:1}});q(5 i=0;i<d;i++){o[i].D=e[i].t;o[i].j=e[i].v}});7 4};$.p.15=6(b,d){5 v=b;5 e=8(b);5 c=d||u;3(e!="E"&&e!="6"&&e!="A")7 4;4.x(6(){3(4.B.y()!="C")7 4;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(v.G==N){3(o[i].j.O(v)){o[i].k=9}h 3(c){o[i].k=u}}h{3(o[i].j==v){o[i].k=9}h 3(c){o[i].k=u}}}});7 4};$.p.16=6(b,c){5 w=c||"k";3($(b).17()==0)7 4;4.x(6(){3(4.B.y()!="C")7 4;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(w=="18"||(w=="k"&&o[i].k)){$(b).J(o[i].j,o[i].D)}}});7 4};$.p.19=6(b,c){5 d=u;5 v=b;5 e=8(v);5 f=8(c);3(e!="E"&&e!="6"&&e!="A")7 f=="6"?4:d;4.x(6(){3(4.B.y()!="C")7 4;3(d&&f!="6")7 u;5 o=4.z;5 a=o.n;q(5 i=0;i<a;i++){3(v.G==N){3(o[i].j.O(v)){d=9;3(f=="6")c.M(o[i],i)}}h{3(o[i].j==v){d=9;3(f=="6")c.M(o[i],i)}}}});7 f=="6"?4:d};$.p.1a=6(){5 v=[];4.T("K:k").x(6(){v[v.n]=4.j});7 v};$.p.1b=6(){7 4.T("K:k")}})(1c);',62,75,'|||if|this|var|function|return|typeof|true||||||||else||value|selected|||length||fn|for||cache||false|||each|toLowerCase|options|object|nodeName|select|text|string|index|constructor|o1t|o2t|addOption|option|boolean|call|RegExp|match|undefined|arguments|removeOption|null|find|document|createElement|in|ajaxAddOption|getJSON|apply|Array|number|remove|sortOptions|sort|selectOptions|copyOptions|size|all|containsOption|selectedValues|selectedOptions|jQuery'.split('|'),0,{}));

$(function () {
    if (top.SiteConfig["showCaiYun"]) {
    	//@2014-7-1 modify by wn 删除导入和通讯录的文字提示和快捷入口
       // caiyunTips.render();
    }
});

var caiyunTips = {
    data: {
        "mmsDIY": {
            pageName: "mmsDIY.html",
            selector: ".wrap>.bd",
            style:""
        },
        "mmsFactory": {
            pageName: "mmsFactory.html",
            selector: ".content",
            style: "width:594px"
        },
        "mmsSend": {
            pageName: "mmsSend.html",
            selector: ".content",
            style: "width:575px"
        }
    },
    template: ['<div class="yellowWarningTips">',
                   '一键导入和通讯录，快速将您的手机联系人添加至139邮箱。',
                   '<a href="javascript:top.BH({actionId:104452});top.Links.show(\'addrImport\',\'&showType=importI&isweb2=1\');">导入和通讯录</a>',
                   '<span class="pl_5 pr_5 gray">|</span>',
                   '<a href="javascript:top.BH({actionId:104453});top.Links.show(\'addrinputhome\');">选择其它方式</a>',
               '</div>'].join(""),
    render: function () {
        var _this = this;
        var key = _this.getPageName();
        var options = _this.data[key];
        if (options) {
            options.template = _this.template;

            _this.show(options);
        }
    },
    show:function(options){
        var selector = options.selector;
        var style = options.style;
        var template = options.template;
        template = $(template).attr("style", style); //设置不同的页面样式
        $(selector).prepend(template);
    },
    getPageName: function () {
        //获取网页文件名称，如访问http://appmail.mail.10086.cn/m2012/html/mms/mmsDIY.html时，返回mmsDIY
        var pathName = location.pathname;
        var start = pathName.lastIndexOf("/") + 1;
        var fullPageName = pathName.substring(start);
        var pageName = fullPageName.substring(0, fullPageName.lastIndexOf("."));

        return pageName;
    }
}
