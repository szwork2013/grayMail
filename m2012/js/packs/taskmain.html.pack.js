/**
 *任务二期
 *modelType为任务的类型,0:月任务，1：新手任务，2：活动任务
 */
var NTask = {
   level        : 1,
   taskCount	: -1,
   movePos      : 1,
   starMaxNum   :8,
   leizuMaxNum  :10,
   isIE6        : false,
   strMem       :'0000000000000000000000000000',//纪念章
   strCom       :[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//是否完成任务的时间 0没有完成
   date			: new Date(),
   tasks        :{newTask:{},everyMonth:{},active:{subTaskInfos:[]}},
   tasklevel    :{},//用户所对应的等级称号与名片
   isFNewTask   :false,//是否完成新手任务
   isNoShowMonthTab:false,
   isNoShowActiveTab:false,
   memPics      : [0,1,112,2,100,109,113,3,4,5,111,107,6,101,102,7,8,108,9,105,114,10,104,115,11,103,12,110],
   memPicsMap   : {0:0,1:1,112:2,2:3,100:4,109:5,113:6,3:7,4:8,5:9,111:10,107:11,6:12,101:13,102:14,7:15,8:16,
	               108:17,9:18,105:19,114:20,10:21,104:22,115:23,11:24,103:25,12:26,110:27},
   rowCount		: 4,
   colCount		: 3,
   countPic		: 11,//纪念图标显示的数目
   unFinishCount: 0,//待完成的任务数
   newTaskText  : '新手过关',
   FBtnExcClass :'gray_btn',
   userHead		: '',//用户头像
   historyPath  : "/images/prod/evertask/history/",
   levelPath    : "/images/prod/evertask/level/",
   vhistoryImg	: '<a name="{memName}"  style="width:70px;display:inline-block;"><img style="cursor:{cursor};" memName="{memName}" onclick="{click}"  com="{isCom}" award="{isAward}" src="{src}"></a>',
   vtaildot		: '<a  style="margin-left:20px;" href="javascript:{href}void(0);" ><i class="next_page" ></i></a>',
   memHtml		: '<li isshow="{isshow}"><a title="{memName}" href="javascript:void(0);" style="cursor:default;"><img id="mem_{count}" src="{src}"></a></li>',
   taskUser		: '<li><a class="number">{count}</a></li>',
   taskStarHtml : '<dl style="margin-left:20px;_margin-left:16px;"><dt><a ><img style="width:58px;height:52px;" src="{src}"></a></dt><dd title="{title}" class="c_666 tac pt5 starTrim">{name}</dd></dl>',
   headTaskHtml : ['<div class="tab-main" id="tab-main clear" style="height:auto;">',
					'<div class="rec_box_left fl">',
					'<h3 class="rec_box_h">{completeText}</h3>',
					'<p class="pt5"><span class="pr5">{tTProgress}</span><span class="p-relative rec_box_p" style=""><span class="rec_box_p1" id="taskpercent"></span></span><em id="em_taskpercent" class="c_666 pl10">50%</em></p>',
					'<p class="pt5" >{taskType}：<a href="javascript:{toHistoryHander}void(0);">{memText}纪念图标</a></p>',
					'<div class="mt5" style="display:{showGetPrize};margin-left:214px;"><a href="javascript:void(0);" onclick="{GetPrize}" class="lv_btn {canExcClass}"><span>{GetText}</span></a></div></div>',
					'<ul class="rec_box_right fl c_bcb"  >',
					'<li class="pr10" id="allPeople" >本月已有</li>{totalPeople}',
					'<li class="pl10">人完成</li>',
					'</ul>',
				  '</div>'].join(""),
   taskLeizuHtml: ['<div class="fl {rankClass}"><dl>',
						'<dt class="fl pt5"><strong class="pr10 user_list_number">{rank}</strong></dt>',
						'<dt class="fl mr10"><a  class="user_list_head"><img style="width:50px;height:50px;" src="{src}"></a></dt>',
						'<dd><h3 class="fwb c_000 starLTrim">{uName}</h3></dd>',
						'<dd class="pt5 pb5 c_4a4"><span class="starLeizuTrim">{name}</span><span class="c_b2b pl10 pr10">|</span>完成任务数：<span>{comCount}</span></dd>',
						'<dd><a href="javascript:void(0);" userNumber="{userNumber}" class="give_flower">送鲜花</a><em  title="{tflower}" class="c_666 pl5 fix_w">{flowerCount}</em><span class="pl20"><a href="javascript:void(0);" userNumber="{userNumber}" class="give_egge">丢鸡蛋</a><em  title="{tegg}" class="c_666 pl5 fix_w">{eggCount}</em></span></dd>',
					'</dl></div>'].join(""),
   taskItem	    : ['<dl class="task_dl">',
					'<dt class="fl"><img src="{src}" style="width:100px;height:100px;"></dt><dd><h3 class="fwb pt5">{taskName}</h3></dd>  ',
						'<dd class="pt10 pb10 c_666 lin_20">{taskDesc}</dd>',
						'<dd><span style="display:{isActive};width:184px; overflow:hidden;">任务奖励：<a href="javascript:{taskPrizeHander};void(0);">{taskPrize}</a></span><span style="text-align:center;line-height:25px;height:23px;display:{activeDisplay}" class="c_999 fr pr10">人气：{activePeople}</span><a  onclick="{click}" task=\'{taskexc}\' class="{btnClass} {canExcClass}" ><span>{taskStatus}</span></a><span class="pl10 c_999">任务进度：{taskProgress}</span></dd>',
					'</dl>'].join(""),
   taskTipHtml  : ['<span name=\'time\' style=\'font-size:12px;\' >{time}</span>',
		            '<div style=\'color:#666666;padding-top:3px; font-size:12px;\'>{taskMonth}</div>',
		            '<div style=\'color:#666666; font-size:12px;\'>{taskMem}</div><div>',
		            '<a name=\'linka\' href="javascript:{hander};void(0);" style=\'display:{isShow};float:right; margin-top:5px;color:#0066cc;font-size:12px;\'>去完成任务>></a></div>'].join(""),
   taskProgress : '<em>{schedule}/{aim}</em>',
   blankTaskDiv :'<div class="blankDiv"><div>暂无任务</div></div>',
   inteface		: 's?func=user:',
   adAddr       : "/cximages/monthlytask/ad_1.png",
   starImgURL   : 'AddrStaticImg/',
   logger       :  new top.M139.Logger({name: "new taskmonth"}),
   funcs		: {myTask:'user:getMyTask',taskAward:'user:taskAward',worshipEnvy:'user:taskWorshipEnvy',taskStar:'user:taskStar',taskBadge:'user:taskBadge'},//具体任务，等级，明星，膜拜，
   init:function(){
        NTask.imagesPath = "http://images.mail.10086ts.cn:2080";//test
        //NTask.imagesPath =  "http://images.139cm.com/";
        NTask.isIE6= $.browser.msie&&$.browser.version==6;//不支持滚动
        NTask.isIE7= $.browser.msie&&$.browser.version==7;//不支持滚动
        //广告暂时用自己的
        //NTask.adAddr = top.rmResourcePath+"/images/evertask/ad_1.jpg";
        NTask.adAddr = NTask.imagesPath+NTask.adAddr;
		var sucessHander = function(tasks){
			   tasks = tasks['var'];
			   NTask.taskCount = tasks.completeTaskNum;//完成的任务数
			   NTask.buildTasks(tasks.mytask);
			   NTask.initUserinfo();
		       NTask.renderTasks();
		       top.WaitPannel.hide();
		}
        top.WaitPannel.show();
        NTask.requestAPI('myTask',{},sucessHander);
       
	   
	    this.initConfig();
		
		NTask.MainTip.initTips();
		this.bindEvent();
   },
   requestAPI:function(name,data,callback){
	   	top.M139.RichMail.API.call(NTask.funcs[name],data, function (res) {
	   		  if(!(res&&res.responseData&&res.responseData.code==='S_OK')){
	   		  	 NTask.logger.error(NTask.funcs[name]+"returndata error", NTask.funcs[name], res);
	   		  }
	   		  res = res||{};
	   		  res.responseData = res.responseData||{};
	   		  callback&&callback(res.responseData);
	   		
	   	});
   },
   initConfig:function(){
	   if(NTask.isIE6){//图片显示要这样改的
		    this.historyPath +="2012IE6/";
	   }else{
		    this.historyPath +="2012/";
	   }
   },
   buildData:function(type){
	   var data = "<object><int name='arrayTaskDesc'>2</int>" +
        				"<array name='taskDescs'>"+
							"<object>"+
								"<string name='modelID'>82</string>"+
								"<string name='cycleID'> </string>"+
							"</object>"+
							"<object>"+
								"<string name='modelID'>41</string>"+
								"<string name='cycleID'></string>"+
							"</object>"+
					   "</array>"+
					"</object>";
	  return data;
   },
   buildTasks : function(tasks){
	  var len = tasks.length,item,modelType=0;
	  for(var i=0;i<len;i++){
		  item = tasks[i];
		  modelType = item.modelType;
		  if(modelType==1){//新手任务
			  NTask.tasks['newTask'] = item;
		  }else if(modelType==0){//每月任务
			  NTask.tasks['everyMonth'] = item;		  
		  }else if(modelType==2){//新手任务
			  //NTask.tasks['active']=item;
			  NTask.buildActiveTasks(item);
		  }  
	  }
   },
   getUnFinishTaskCount:function(){
      var tasks = NTask.tasks,subTaskInfos,info,len;
	  var unFinishCount = 0;
	  for(var item in tasks){
          subTaskInfos = tasks[item].subTaskInfos;
		  if(subTaskInfos){
		     len = subTaskInfos.length;
			 for(var i=0;i<len;i++){
				info = subTaskInfos[i];
				if(info.isComplete!=1){
					unFinishCount++;
			  }
			 }
		  }
	  }
    return unFinishCount;
   },
   buildActiveTasks :function(item){
	  var subInfo = NTask.tasks['active'].subTaskInfos;
	  var subTaskInfos = item['subTaskInfos'][0];//只取一个
	  if(subTaskInfos){
		  subTaskInfos.recvPointsCount = item.recvPointsCount;
		  subTaskInfos.isComplete = item.isComplete||0;
		  subTaskInfos.modelType = item.modelType||2;
		  subTaskInfos.modelID = item.modelID;
		  subTaskInfos.cycleID = item.cycleID;
		  subTaskInfos.isGetAward = item.isGetAward||0;
		  subTaskInfos.modelName = item.recvPointsCount;
		  subInfo.push(subTaskInfos);
	  }
   },
   /**
    * 查询活动任务是否完或领奖
    * 查找到一个即返回
    */
   isCompleteOrGetAward :function(){
	 var activeTasks =  NTask.tasks['active'].subTaskInfos; 
	 var len = activeTasks.length,task;
	 var isCA = false;
	 for(var i=0;i<len;i++){
		 task = activeTasks[i];
		 if(task.isComplete==0||task.isGetAward==0){
			 isCA = true;
			 break;
		 }
	 }
	 return isCA;
   },
   renderTasks :function(){
	  var isComplete=isGetAward=0,item,modelType;
	  var tasks = NTask.tasks,task,existTaskName,blankTasks=[],showTab=false;
	  for(name in NTask.tasks){
          task = tasks[name];
          if(task&&task.subTaskInfos&&task.subTaskInfos.length>0){
        	  existTaskName = name;
          }else{
        	  blankTasks.push(name);
        	  task = {isComplete:1,isGetAward:1,subTaskInfos:[],totalPeople:""};  
          }
         var type = task instanceof Array;
         if(type){
        	 var len = task.length;
        	 for(var i=0;i<len;i++){
        		 NTask.renderTask(name,task[i],blankTasks);
        	 }
         }else{
		 	NTask.renderTask(name,task,blankTasks);
		 }
	  }
	  
	 if(NTask.isFNewTask&&NTask.isNoShowMonthTab&&NTask.isNoShowActiveTab){//显示明星榜
			$("#myTask").toggleClass("current");
			$("#taskStar").toggleClass("current");
			$("#content_taskStar").show();
			$("#content_myTask").hide();
			NTask.showTab("taskStar");
			
			//打开其中一个任务
			NTask.showOneTask(existTaskName);
      }
	NTask.creatBlankTask(blankTasks,existTaskName);
	
   },
   renderTask :function(name,task,blankTasks){
     var showTab=false,isComplete,isGetAward;
     if(task){ 
		  isComplete = task['isComplete'];
		  isGetAward = task['isGetAward'];
		  //新手任务
		  switch(name){
			case 'newTask':
				  if(isComplete==0||isGetAward==0){
					 showTab = true;
				  }else{
					$("#newTask").hide();
					$("#content_newTask").hide();
					NTask.isFNewTask =  true;
					showTab = false;
					return;
				  }
				  break;
			case 'everyMonth':
				  if(isComplete==0||isGetAward==0){
					 if(NTask.isFNewTask){
						 showTab = true;
					 }else{
						 showTab = false;
					  }
				  }else{
					  NTask.isNoShowMonthTab = true;
					  showTab = false;
					  if(!NTask.isNotExistName(blankTasks,name)){//每月任务为空时不显示
						  $("#everyMonth").hide();
						  $("#content_everyMonth").hide();
						  return;
					  }
				  }
				  break;
			case 'active':
				  if(NTask.isCompleteOrGetAward()){
					if(NTask.isFNewTask&&NTask.isNoShowMonthTab){
					   showTab = true;
					}else{
					   showTab = false;
					}
				 }else{
				   NTask.isNoShowActiveTab = true;
				   showTab = false;
				 }
				break;
		  }
		 if(!NTask.isFNewTask||name!='newTask'){
		    if(NTask.isNotExistName(blankTasks,name)){//不是空进行渲染
		   		NTask.buildTask(name,task.recvPointsCount,task.subTaskInfos,showTab,task.modelID,task.cycleID,isGetAward);
		   	}
		 }
	  }
   },
   isNotExistName :function(blankTasks,name){
	   var b = blankTasks.join(","); 
	   if(b.indexOf(name)>-1)return false;
	   return true;
   },
   showOneTask :function(existTaskName){
	   existTaskName = existTaskName||'active';
	   NTask.subTabHander.call($("#"+existTaskName));//打开项
   },
   creatBlankTask :function(blankTasks,existTaskName){
	 var len = blankTasks.length;
	 $.each(blankTasks,function(i,name){
		 if(name=='active'){
		  	$("#content_"+name).html(NTask.blankTaskDiv);
		  	$("#"+name).show();
		  }
	 });
   },
   /**
    * 获取请求地址
    * @param {Object} type func名称
    * @return {TypeName} 
    */
   getRequestData:function(funType,callback,data){
	   data = data||"";
	   callback = callback||function(){};
	   NTask.requestAPI(funType,data,callback);
   },
   /**
    * 切换主tab与子tab时用
    */
   bindEvent:function(){
		$("#mainTab").find("li").bind('click',NTask.mainTabHander);
		$("#subTab").find("li").bind('click',NTask.subTabHander);
   },
   /**
    * 初始化个人基本信息
    */
   initUserinfo :function(){
         var context = $("#content_myTask");
		 /*top.Contacts.QueryUserInfo(function(result) {
					var userHead = "";
					if (result&&result.info&&result.info.ImageUrl) {
					     userHead = result.info.ImageUrl;
						 NTask.userHead = userHead;
					}
		 });
		 **/
		 NTask.level = NTask.Utils.getLevelByTaskCount(NTask.taskCount);
		 NTask.tasklevel = NTask.Utils.getLeveNameByLevel(NTask.level);
		 $("#userImg").attr('src',NTask.Utils.getLevelImageSrc(NTask.tasklevel.img)).bind("click",NTask.goLevelPage);
		 //用户名称
		 $("#username").text(top.$PUtils.userInfo.userName);
		 
		 //用户等级
		 $("#level").text(NTask.level);
		 //用户称谓
		 $("#name").text(NTask.tasklevel.name);
		 //待完成任务数
		 $("#tofinish").text(NTask.getUnFinishTaskCount());//待完成的任务数
		 //差多少个完成
		 $("#count").text(NTask.Utils.getTaskCountByLevel(NTask.level+1)-NTask.taskCount);
		 //广告
		 context.find("#adPic").attr("src",NTask.adAddr).bind('click',NTask.toHistoryHander);
		 //用户领奖标记
		 NTask.requestAPI('taskAward',{},function(data){
	          NTask.createStrMemCom(data['var']);
			  NTask.buildMemeyPic(NTask.strMem);
		 	
		 });
   },
   /**
    * 跳转到等级页面
    */
   goLevelPage :function(){
      NTask.mainTabHander.call($("#taskLevel"));//打开项
   },
   /**
    * 构造领奖标记
    * @param {Object} data
    */
   createStrMemCom :function(data){
	 var data = data["taskAward"];
	 
	 var len = data.length,item;
	 var pos = 0;
	 var strsmem = NTask.strMem.split("");
	 for(var i=0;i<len;i++){
		 item = data[i];
		 pos =  NTask.getAwardPos(item.awardID);
		 if(!pos){//完成任务，但是没有领取奖品
			 pos = NTask.getCompletePos(item.modelID,item);
		 }
		 strsmem[pos]=item.isGetAward||0;
		 item.picId = NTask.memPics[pos];
		
		 NTask.strCom[pos]=item.taskCompleteTime;
	 }
	 NTask.taskAward=data;
	 NTask.strMem = strsmem.join(""); 
   },
   getCompletePos :function(modelId,taskAward){
	  var tasks = NTask.tasks,objtask,objActive,len;
	  var pos = "";
	  for(var item in tasks){
		  objtask = tasks[item];
		  if(item!='active'){
			  if(objtask){
				 if(objtask['modelID']==modelId){
					 if(item=='newTask'){
						 return  0;
					 }else{
						 return  NTask.memPicsMap[NTask.date.getMonth()+1];
					 }
				 }
			  }
	      }else{
	    	 len = objtask.subTaskInfos?objtask.subTaskInfos.length:0;
	    	 for(var i=0;i<len;i++){
	    		 objActive = objtask.subTaskInfos[i];
	    		 if(objActive.modelID==modelId){
	    			 return NTask.getAwardPos(NTask.Utils.getActivePicName(objActive.taskName));
	    		 }
	    	 }
	    	  
	      }
	  }
   },
   /**
    * 构建新手任务，每月任务，活动任务
    * @param {Object} typeNum 
    * @param {Object} totalPeople
    * @param {Object} tasks
    */
   buildTask :function(typeName,totalPeople,tasks,isShow,modelID,cycleID,isGetAward){
		NTask.renderTaskHtml(typeName,totalPeople,tasks,isShow,modelID,cycleID,isGetAward);
		if(isShow){
			NTask.subTabHander.call($("#"+typeName));
		}
   },
   /**
    *切换tab
	*/
   subTabHander:function(){
		_this = $(this);
		_this.addClass("on");
		$("#content_"+_this.attr("id")).show();
		_this.siblings().each(function(i,el_LI){
								 $(el_LI).removeClass("on");
								 $("#content_"+el_LI.getAttribute("id")).hide();
							});
   },
  /**
   * 主切换tab
   * @param {Object} e
   * @memberOf {TypeName} 
   */
   mainTabHander :function(){
		 var _this = $(this);
		 _this.addClass("current");
		 _this.siblings().removeClass("current");
		 var  id = _this.attr("id");
		 var _id,_el;
		 $("div.main").find("div[name='content']").each(function(i,item){
			_el = $(item);
			_id = _el.attr("id");
			if(_id=="content_"+id){
				_el.show();
				NTask.showTab(id);
			}else{
				_el.hide();
			}
		 });
   },
   /**
    * 显示不同tab
    * @param {Object} id tab的id
    */
   showTab :function(id){
	   if(NTask[id]){
		   if(NTask.funcs[id]){
			   var isRender =  $("#"+id).attr("isRender");//避免多次点击
			   if(!isRender){
			        $("#"+id).attr("isRender","true");
			    	top.WaitPannel.show();
		   			NTask.getRequestData(id,NTask[id]);
	   		   }
	   		}else{
	   			NTask[id]();
	   		}
	   }
   },
   /**
    * 跳转到荣誉榜
    * @param {Object} count picName
    */
   toHistoryHander :function(picName){
	   NTask.MainTip.hideMainTip();
	   NTask.mainTabHander.call($("#taskHistory"));//打开项
	   var count = NTask.getPosInHistoryByPicName(picName)||1;
	   NTask.move(count);
	   //当前显示
	   setTimeout(function(){
	   	NTask.mouseoverHistory({target:$("img[memname='"+picName+"']")});
	   },100);
   },
   getPosInHistoryByPicName :function(picName){
	   var picNames = NTask.memPics;
	   var len = picNames.length,pos;
	   for(var i=0;i<len;i++){
		   if(picNames[i]==picName){
			   pos = i;
			   break;
		   }
	   }
	  pos =  parseInt(pos/12)+1;
	  return pos;
   },
  /**
   * 纪念章显示
   */
  buildMemeyPic : function(str){
	    var len = NTask.memPics.length;
	    var count = 0,memName,isLive = 1;//用于记录是否领取章
		var context = $("#content_myTask");
		var mempics=[],isshow="Y";//用于记录左右滑动时的效果
		var picName = "";
		for(var i=0;i< len;i++){//一年十二个月的图标,加新手任务共13个图标
			count = i;
			isLive = str.charAt(i)||0;
			if(count>NTask.countPic-1) isshow="N";
			count = NTask.memPics[i];
			picName = NTask.Utils.getTaskNameByPicId(count);
			memName=count+"_"+isLive+"_16.png";
			mempics.push(top.$T.Utils.format(NTask.memHtml,{memName:picName,count:count,src:top.$App.getResourceHost()+"/m2012"+NTask.historyPath+memName,isshow:isshow}));
		}
		context.find("#memSign").html(mempics.join(""));
		context.find("#moveL").bind("click",NTask.moveLeftHander);
		context.find("#moveR").bind("click",NTask.moveRightHander);
	
  },
  updateMemPic : function(i){
	  var context = $("#content_myTask");
	  //更新图标
	  context.find("#mem_"+i).attr("src",top.$App.getResourceHost()+"/m2012"+NTask.historyPath+i+"_1_16.png");
	  //更新数据
	  NTask.updatePosMem(i);
  },
  updatePosMem:function(i){
      var strs = NTask.strMem.split("");
	  var pos =  NTask.getAwardPos(i);
	  strs[pos]=1;
	  NTask.strMem = strs.join(""); 
	  NTask.strCom[pos]= new Date().format("yyyy-MM-dd");
  },
  /**
   * 渲染任务html
   * @param {Object} type
   * @param {Object} totalPeople
   * @param {Object} tasks
   */
  renderTaskHtml : function(type,totalPeople,tasks,isShow,modelID,cycleID,isGetAward){
  		//schedule执行了几次isComplete是否已经完成 aim需要进行多少次
       var context = $("#content_"+type);
       var isActive = "none;"
       //任务列表
       var len = tasks.length,task,display="none",taskStatus="开始任务",taskProgress="",taskHTML=[];
	   var _schedule = _aim = 0,btnClass='lv_btn',activePeople = 0,canExcClass='';
	   var activeDisplay="none;",taskPrize="",click="NTask.execTask(this);",taskPrizeHander,iEveryCount = 1;
	   if(type=='active') activeDisplay="block;";//只有活动任务才有人气
	   for(var i=0;i<len;i++){
	       task = tasks[i];
		   _schedule += task['schedule'];
		   _aim      +=  task['aim'];
	
		   if(type==='active'){
			   isActive= "inline-block;";
			   taskPrize = NTask.Utils.getActiveNamebyName(task.taskName)+"任务纪念图标";
			   taskPrizeHander ="NTask.toHistoryHander("+NTask.Utils.getActivePicName(task.taskName)+");";
			   activePeople = task.recvPointsCount;
			   modelID = task.modelID;
			   cycleID = task.cycleID;
			   if(task['desc']){//加统计行为
				   click+="top.addBehaviorExt({actionId:103701,thingId:"+iEveryCount+", pageId:10544 });";
				   iEveryCount++
			   }
			   canExcClass = task['isGetAward']==1?NTask.FBtnExcClass:'';
		   }else{
			   if(type==='everyMonth'){//加统计id
				   if(task['desc']){
				     click+="top.addBehaviorExt({actionId:101802,thingId:"+iEveryCount+", pageId:10544 });";
				     iEveryCount++
				   }
			   }else if(type==='newTask'){
				   if(task['desc']){
					 click+="top.addBehaviorExt({actionId:103700,thingId:"+iEveryCount+", pageId:10544 });";
				     iEveryCount++
				   }
			   }
			   isActive="none;";
		   }
		   if(task['desc']){//具有可执行的任务
			    display = 'inlne-block';
			    btnClass = 'lv_btn';
			   
		   }else{
			    display = 'none';
			    btnClass = 'lv_btn_other';
			    canExcClass="";
		   }
		    taskStatus = NTask.getPrizeBtnName(type,task['schedule'],task['aim'],task['desc'],isGetAward||task['isGetAward']);
		   if(taskStatus=='可领奖'||taskStatus=='已领奖'){
			   var picName = NTask.Utils.getActivePicName(task.taskName);
			   click = "NTask.GetPrize('"+picName+"','"+modelID+"','"+cycleID+"',this);";
		   }
		   //taskProgress = _schedule==_aim?'已完成':top.$T.Utils.format(NTask.taskProgress,{schedule:task['schedule'],aim:task["aim"]});
		   taskProgress = top.$T.Utils.format(NTask.taskProgress,{schedule:task['schedule'],aim:task["aim"]});
	       taskHTML.push(top.$T.Utils.format(NTask.taskItem,{canExcClass:canExcClass,taskPrizeHander:taskPrizeHander,taskPrize:taskPrize,isActive:isActive,activePeople:activePeople,btnClass:btnClass,taskStatus:taskStatus,activeDisplay:activeDisplay,taskexc:task['desc'],src:NTask.imagesPath+task['picAddr'],taskName:task['taskName'],taskDesc:task['taskDesc']||'&nbsp;',click:click,display:display,taskProgress:taskProgress}));
	       click  = "NTask.execTask(this);";
	   }
	   //显示头
	   $("#"+type).show();
	   
	  
	   //头信息
	   var completeText='',taskType = "新手大礼包",tTProgress="新手任务进度";
       if(type!='active'){
    	     var memText = NTask.newTaskText;
    	     var isComplete = _schedule==_aim?true:false;
    	     var month = NTask.date.getMonth()+1;
    	     var showGetPrize=isComplete?"block;":"none;";
    	     if(type=='everyMonth') {
    	    	 memText = month+"月任务";
    	    	 completeText= isComplete?"你已完成当月任务":"本月的任务还有待你来完成哦！";
    	    	 taskType = "本月奖励";
    	    	 tTProgress = "本月任务进度";
    	     }else if(type=='newTask'){
    	    	 if(_schedule==0){
    	    		 completeText = "尚未开始新手任务，赶快来参加吧！";
    	    	 }else{
    	    		 completeText = isComplete?"祝贺你已经完成全部新手任务！":"新手任务进行中";
    	    	 }
    	    	 month = 0;
    	     }
    	     //完成情况
    	     var GetText = isGetAward==0?'立即领取':'已领取';
    	     canExcClass= isGetAward==0?'':NTask.FBtnExcClass;
      	 	 var mainHtml = top.$T.Utils.format(NTask.headTaskHtml,{canExcClass:canExcClass,GetText:GetText,GetPrize:"NTask.GetPrize("+month+","+modelID+","+cycleID+",this);",showGetPrize:showGetPrize,tTProgress:tTProgress,taskType:taskType,completeText:completeText,toHistoryHander:"NTask.toHistoryHander("+month+");",totalPeople:NTask.allPeopleFinish(totalPeople),memText:memText});
	   		 taskHTML.splice(0,0,mainHtml);
       }
       
	   //各项任务
	   context.html(taskHTML.join(""));
	   
	   var taskpercent = context.find("#taskpercent");
	   var em_taskpercent = context.find("#em_taskpercent");
	   
	   NTask.animateProgress(_schedule,_aim,taskpercent,em_taskpercent);
   },
   getPrizeBtnName :function(type,schedule,aim,exec,isGetAward){
	   var taskStatus;
	   if(schedule<=0){
			  taskStatus = "开始任务"; 
		      if(!exec)taskStatus = "待完成";
		  
	   }else if(schedule<aim){
		   taskStatus="待完成";
		   if(!exec)taskStatus = "待完成";
	   }else{
	       if(type=='active'){//活动任务完成时为可领奖
	    	   if(isGetAward==0){
	    	   		taskStatus = "可领奖";
	    	   }else{
	    		    taskStatus = "已领奖";
	    	   }
	       }else{
	    		    taskStatus="已完成";       	   
	       }
	    }
	   return taskStatus;
   },
   /**
    * 动画显示
    * @param {Object} schedule
    * @param {Object} aim
    * @param {Object} el
    * @param {Object} em_taskpercent
    */
   animateProgress: function (schedule, aim,el,em_taskpercent) {
		var per = Math.ceil((schedule / aim) * 100);
		if (!per) per = 0;
		per = per > 100 ? 100 : per;
		el.css({"width":"0%"}).animate({ "width": per + "%" }, 500);
		em_taskpercent.html(per + "%");
   },
   /**
    * 多少人完成
    * @param {Object} totalPeople
    * @return {TypeName} 
    */
   allPeopleFinish : function(totalPeople){
      totalPeople=""+totalPeople;
	  var len = totalPeople.length;
      var peoples = [];
	  for(var i = 0;i<len;i++){
		peoples.push(top.$T.Utils.format(NTask.taskUser,{count:totalPeople.charAt(i)}));
	  }
	  return peoples.join("");
   },
   //执行任务
   execTask:function(el){
	    var el = $(el);
	    if(el.type) el = this;
	    try{
			eval(el.attr("task"));
		}catch(e){}
  },
  /**
   * 向左移动
   * @return {TypeName} 
   */
   moveLeftHander : function(){
       var context = $("#content_myTask");
	   var showEL = context.find("#memSign li[isshow='N']");
	   if(showEL.length==0) return;
	   if(showEL.length==1)  context.find(".left_move").css("background-position","0px 0");
	   var marginLeft =  parseInt(context.find("#memSign").css("margin-left").replace("px",""));
	   context.find("#memSign").css("margin-left",marginLeft-21);
	   $(showEL[0]).attr("isshow","Y");
	   context.find(".right_move").css("background-position","-8px 0");
  },
  /**
   * 向右移动
   * @return {TypeName} 
   */
  moveRightHander : function(){
       var context = $("#content_myTask");
	   var showEL = context.find("#memSign li[isshow='Y']");
	   if(showEL.length==NTask.countPic) return;
	   if(showEL.length==NTask.countPic+1)   context.find(".right_move").css("background-position","-25px 0");
	   var marginLeft =  parseInt(context.find("#memSign").css("margin-left").replace("px",""));
	   context.find("#memSign").css("margin-left",marginLeft+21);
	   $(showEL[showEL.length-1]).attr("isshow","N");
	   context.find(".left_move").css("background-position","-18px 0");
  	   NTask.hideTips();
  },
  /**
   * 任务荣誉墙
   */
  taskHistory : function(){
		var context = $("#content_taskHistory");
		var month = NTask.date.getMonth()+1;
		//组装荣誉墙
		var objHtml = NTask.buildHistoryHtml(context,NTask.strMem,NTask.strCom);
		$("#memHis",context).html(objHtml.selfPic)
		context.find(".tac").html(objHtml.tail);
		//左右滑动处理
		$(".left_bar",context).click(NTask.leftHand);
		$(".right_bar",context).click(NTask.rightHand);
		context.bind("mouseover",NTask.mouseoverHistory);
  },
  mouseoverHistory :function(e){
	  var target = $(e.target);
	  var tagName = target.attr("tagName");
	  if(tagName=='IMG'){
		   var text ="";
		   var isCom = target.attr("com");
		   var isAward = target.attr('award');
		   var memName = target.attr('memName');
           var name = NTask.Utils.getTaskNameByPicId(memName);
		   var taskMonth = taskMem = "";
		   if(isAward!="0"){//已经完成，已经领奖
			   taskMonth = "完成【"+name+"任务】";
			   taskMem = "获得【"+name+"过关纪念】图标一枚";
		       text = top.$T.Utils.format(NTask.taskTipHtml,{time:isCom,taskMonth:taskMonth,taskMem:taskMem,isShow:"none"});
		   }else{//
		       if(isCom!=""&&isCom!="0"){//已经完成，但没有领奖
			      taskMonth = "您已完成【"+name+"任务】";
			      taskMem = "可获得【"+name+"过关纪念】图标一枚。点击图标即可领取";
			      text = top.$T.Utils.format(NTask.taskTipHtml,{time:isCom,taskMonth:taskMonth,taskMem:taskMem,isShow:"none"});
			   }else{//没有完成
			      taskMonth = "您尚未获得该图标领取资格！";
			      taskMem = "您需要完成任务，才可获得这枚纪念图标哦!";
			      isCom = "";
			      text = top.$T.Utils.format(NTask.taskTipHtml,{time:isCom,taskMonth:taskMonth,taskMem:taskMem,isShow:"none",hander:"alert('暂不处理');"});
			   }
		   }
		   var pos = target.position();
		   NTask.showTips(pos,text);
	  }else{
		   NTask.hideTips();
	  }
  },
  showTips:function(pos,text,width){
	 var context = $("#content_taskHistory");
	 pos = pos||{left:0,top:0};
     if (!width)   width = 200;
     context.find("#taskTip").css({width: width,left: 1500, top: 1000 }).show().find(".tips-text").html(text);
     var height =  context.find("#taskTip").outerHeight();
	 context.find("#taskTip").css({left:pos.left+120, top: pos.top+130-height });
  },
  hideTips:function(){
	 var context = $("#content_taskHistory");
	 context.find("#taskTip").hide();
  },
  /**
   * 任务荣誉墙，向左
   */
  leftHand : function(){
	 if(NTask.movePos==1)return;
	 --NTask.movePos;
	 NTask.move(NTask.movePos);
  },
  /**
   * 任务荣誉墙，向右
   */
  rightHand : function(){
	 if(NTask.movePos==3)return;
	 ++NTask.movePos;
	 NTask.move(NTask.movePos);
  },
  move:function(count){
	var context = $("#content_taskHistory");
    if(NTask.isIE6){
		$("#1",context).css('left',(count-1)*675);
	    $("#2",context).css('left',(count-2)*675);
	    $("#3",context).css('left',(count-3)*675);
	 }else{
    	$("#1",context).animate({left:(count-1)*675},"slow");
	    $("#2",context).animate({left:(count-2)*675},"slow");
	    $("#3",context).animate({left:(count-3)*675},"slow");
	}
   	$(context.find(".tac>a>i")[0]).attr("class",(count==1?"first_page":"next_page"));
	$(context.find(".tac>a>i")[1]).attr("class",(count==2?"first_page":"next_page"));
	$(context.find(".tac>a>i")[2]).attr("class",(count==3?"first_page":"next_page"));
    NTask.movePos = count;
	NTask.hideTips();
	  
  },
  /**
   * 构建荣誉界面
   * @param {Object} context
   * @return {TypeName} 
   */
  buildHistoryHtml :function(context,strMem,strCom){
		var objHmtl = {};
		var vhistory = ['<ul class="vp_box fl" id="1" style="position:absolute;left:0px;" ><li>'];
		var tails = ["<a style='outline-style: none;' href='javascript:NTask.move(1);void(0);'><i class='first_page'></i></a>"];
		var rowcount = 0,colcount = 0;colTime = 1;leftpos=-675;picName=0;
		var isLive,isCom,click='',cursor='default',award;
		var len = NTask.memPics.length;
		for(var i=0;i< len;i++){//一年十二个月的图标,加新手任务共13个图标
			picName = NTask.memPics[i];
			isLive = strMem.charAt(i)||0;
			isCom  = strCom[i];
			picName+="_"+isLive+"_76.png";
			if(isLive=="0"&&isCom!=""){
				cursor = "pointer";
				award = NTask.getAwardByPicId(NTask.memPics[i]);
				click  = "NTask.GetPrize('"+NTask.memPics[i]+"','"+award.modelID+"','"+award.cycleID+"',this,'h');";
			}else{
				cursor = "default";
				award = null;
				click  = "";
			}
			vhistory.push(top.$T.Utils.format(NTask.vhistoryImg,{isCom:isCom,isAward:isLive,memName:NTask.memPics[i],click:click,cursor:cursor,src:top.$App.getResourceHost()+"/m2012"+NTask.historyPath+picName}));
			if(rowcount==NTask.colCount){//行
				colcount++;
				if(colcount==NTask.colCount){//列
					colcount = 0;
					colTime++;
					leftpos = leftpos*(colTime-1)
					vhistory.push('</li></ul><ul class="vp_box fl" id="'+colTime+'" style="position:absolute;left:'+leftpos+'px;" ><li>');
					tails.push(top.$T.Utils.format(NTask.vtaildot,{href:"NTask.move("+colTime+");"}));
				}else{	
					vhistory.push("</li><li>");
				}
				rowcount = 0;
			}else{
				rowcount++;
			} 
	   }
	   objHmtl.selfPic =  vhistory.join("");
	   objHmtl.tail = tails.join("");
       return objHmtl;
  },
  /**
   * 查询领奖状态
   * @param {Object} picId
   * @return {TypeName} 
   */
  getAwardByPicId :function(picId){
	   var awards = NTask.taskAward;
	   var len = awards.length,award,item;
	   for(var i=0;i<len;i++){
		   item = awards[i];
		   if(item.picId==picId){
			   award = item;
			   break;
		   }
	   }
	   return award;
  },
  renderTaskStar:function(data){
	  var context = $("#content_taskStar");
	  var flowerCount = eggCount = 0;
	  var tflower=tegg="";
		   var vstars = data['var']['taskStar']||[];
		   var stars = [],leizuStars=[];
		   if(vstars&&vstars.length>0){
			   var len = vstars.length,star,starCount=leizuCount=0;
			   var rankClass="mr20",src,leveName,completeTaskNum=0;
			   var starname = "";
			   for(var i=0;i<len;i++){
				   star = vstars[i];
				   if(star['starType']==1){//任务明星
					   if(starCount<NTask.starMaxNum){
						   starCount++;
						   star.userName = NTask.Utils.padCharFnum(star.userName);
						   stars.push(top.$T.Utils.format(NTask.taskStarHtml,{title:star.userName,src:NTask.Utils.getStarImageSrc(star.picURL),name:star.userName}));	   
				  	   }
				   }else if(star['starType']==2){//任务雷主
					   if(leizuCount<NTask.leizuMaxNum){
						   flowerCount = NTask.Utils.leftPad(star.supportNum,10);
						   if(flowerCount!=star.supportNum) tflower = star.supportNum;
						   eggCount = NTask.Utils.leftPad(star.opposeNum,10);
						   if(eggCount!=star.opposeNum) tegg = star.opposeNum;
						   rankClass = (leizuCount%2==0)?"mr20":"pink_bg";
						   completeTaskNum =star['completeTaskNum']||0; 
						   leveName = NTask.Utils.getLeveNameByLevel(NTask.Utils.getLevelByTaskCount(completeTaskNum)).name;
						   leizuStars.push(top.$T.Utils.format(NTask.taskLeizuHtml,{uName:NTask.Utils.padCharFnum(star['userName']),rank:leizuCount+1,name:leveName,rankClass:rankClass,src:NTask.Utils.getStarImageSrc(star.picURL),comCount:completeTaskNum,tflower:tflower,flowerCount:flowerCount,eggCount:eggCount,tegg:tegg,userNumber:star.userNumber}));
					       leizuCount++;
					       tflower = tegg="";
				       }
				   }
			  }
			  //这里要做正理，为空情况
			  if(stars.length==0)stars.push("暂时还没有人登上此榜位，加油!");
			  if(leizuStars.length==0) leizuStars.push("<div class='mt20 mb20' style='padding:20px;width:auto;'>暂时还没有人登上此榜位，加油!</div>");
			
		 }else{
			 stars.push("暂时还没有人登上此榜位，加油!");
			 leizuStars.push("<div class='mt20 mb20' style='padding:20px;width:auto;'>暂时还没有人登上此榜位，加油!</div>");
		 }
		 
		$(".user_head",context).html(stars.join(""));//任务明星
		$("#taskLeizu",context).html(leizuStars.join(""));//任务擂主
       context.bind("click",NTask.supOroppose)
		//用户已经设置了头像
		//if(!NTask.userHead){
		   context.find("a[name='setHead']").each(function(i,el){
			  $(el).bind('click',NTask.Utils.updateHead).show();
			});
		//}
       top.WaitPannel.hide();
  },
  /**
   * 送鲜花、砸蛋
   * @param {Object} el
   */
  supOroppose : function(el){
	  var target = $(el.target);
	  var className = target.attr("class");
	  var count = "";
	  var titleCount = 0;
	  if('give_flower'==className||'give_egge'==className){
		   var op = className=='give_flower'?1:2;
		   var callback = function(data){
			 var pos = target.position();
			 if(data.code=='S_OK'){
				 var emEL = $(target.siblings()[0]);
				 count = emEL.text();
				 if(count.indexOf("...")>-1){//超过数仠时
					 titleCount = parseInt(emEL.attr("title"))+1;
					 emEL.attr("title",titleCount);
				 }else{
					 emEL.text(parseInt(emEL.text())+1);
				 }
				
			 }else{
				 NTask.MainTip.updateMainTip({click:"javascript:NTask.MainTip.hideMainTip();void(0);",left:pos.left-100,top:pos.top-200,title:" ",content:data.summary,cName:'确定'});
			 }
		  }
		  var data = "<object><string name='op'>"+op+"</string>" +
		             "<string name='userNumber'>"+target.attr("usernumber")+"</string></object>";
		  NTask.getRequestData('worshipEnvy',callback,data,'post');
	  }
  },
  /**
   *明星榜
   */
  taskStar:function(data){
    NTask.renderTaskStar(data);
  },
  /**
   * 任务等级
   */
  taskLevel:function(){
		var context = $("#content_taskLevel");
		context.find("#levelIMG").attr('src',NTask.Utils.getLevelImageSrc(NTask.tasklevel.img));
		context.find("#my_level").text(NTask.level);
		context.find("#name").text(NTask.Utils.getLeveNameByLevel(NTask.level).name);
		context.find("#count").text(NTask.Utils.getTaskCountByLevel(NTask.level+1)-NTask.taskCount);
		context.find("#finishCount").text(NTask.taskCount);
		context.find("#nextLevel").text(NTask.level+1);
		//所有图片
		var src = "",td
		context.find("img").each(function(i,img){
			//动态构造
			src = $(img).attr("imgsrc");
			if(src){
			 $(img).attr("src",top.$App.getResourceHost()+"/m2012/"+NTask.levelPath+src);
			}
		});
		context.find("#levelPercent").css("width",NTask.level/30*100+"%").attr("title","目前处于"+NTask.level+"级");
	  },
  /**
   * 领取奖品
   * @param {Object} type
   * @param {Object} month
   * @param {Object} modelID
   * @param {Object} cycleID
   * @param {Object} el
   */
  GetPrize :function(month,modelID,cycleID,el,h){
		 
	//检查是否已经领取
	 if(NTask.isGetPize(month)){
		 //var $el = $(el);
		 //var pos = $el.position();
		 //NTask.MainTip.updateMainTip({title:'消息',content:"已经领取过该奖品",left:pos.left,top:pos.top,click:"javascript:NTask.MainTip.hideMainTip();void(0);",cName:'确定'}); 
	     return;
	 }
	 
     if(month==0){//新手任务
    	 top.addBehaviorExt({actionId:101481, pageId:10544 });
     }else if(month<=12){//每月任务
    	 top.addBehaviorExt({actionId:101482, pageId:10544 });
     }else{//活动任务
    	 top.addBehaviorExt({actionId:104006, pageId:10544 });
     }
     var data = "<object><string name='awardType'>1</string><string name='awardID'>"+month+"</string><string name='modelID'>"+modelID+"</string><string name='cycleID'>"+cycleID+"</string></object>";
	 top.WaitPannel.show();

     NTask.getRequestData('taskBadge',function(data){
			 top.WaitPannel.hide();
			 var $el = $(el);
			 if(data&&data.code=='S_OK'){
				    if(!h){
						 $el.html('<span>已领取</span>');
					     $el.bind('click',function(){
							 NTask.execTask.call($el);
						 });
						 $el.attr('onclick',"").addClass(NTask.FBtnExcClass);
					 }
				     NTask.updatePrize(month,$el,h);
			 }else{
				 var pos = $el.position();
				 NTask.MainTip.updateMainTip({title:" ",content:data.summary,left:pos.left,top:pos.top,click:"javascript:NTask.MainTip.hideMainTip();void(0);",cName:'确定'}); 
			 }
		 },data,'post');
  },
  isGetPize :function(month){
	var strsmem = NTask.strMem.split("");
 	var pos =  NTask.getAwardPos(month);
	if(strsmem[pos]==1)return true;
	return false;
  },
  /**
   * 更新奖品图标
   * @param {Object} month
   */
  updatePrize :function(month,$el,h){
	  //1 更新首面纪念章 2、更新mem数据
	  NTask.updateMemPic(month);  
     //2弹出提示
	 var pos = $el.position();
	 var imgSrc = top.$App.getResourceHost()+"/m2012/"+NTask.historyPath+month;
	 var content = NTask.Utils.getTaskNameByPicId(month)+'任务纪念图标：1枚';
	 var param = {
			 title:"你已成功获得",
			 left: pos.left,
			 top : pos.top,
			 imgUrl:imgSrc+"_1_48.png",
			 content:content,
			 click:"javascript:NTask.toHistoryHander("+month+");void(0);"
		 };
	 if(h){
		$el.attr({'award':"1",src:imgSrc+"_1_76.png"}); 
		param.cName="确定";
		param.click="javascript:NTask.MainTip.hideMainTip();void(0);";
	 }
	 NTask.MainTip.updateMainTip(param); 
	 
  },
  /**
   * 获取对应的位置
   * @param {Object} awardID
   * @return {TypeName} 
   */
  getAwardPos :function(awardID){
	  return NTask.memPicsMap[awardID];
  }
};
//任务的配置
NTask.config = {
	 taskLevel:[
		{name:"初学弟子",level:"1",img:'1'},
		{name:"初入江湖",level:"2,3,4",img:"2"},
		{name:"江湖新秀",level:"5,6,7",img:'3'},
		{name:"江湖少侠",level:"8,9,10",img:'4'},
		{name:"江湖豪侠",level:"11,12,13,14,15",img:'5'},
		{name:"一派掌门",level:"16,17,18,19,20",img:'6'},
		{name:"一代宗师",level:"21,22,23,24,25",img:'7'},
		{name:"武林盟主",level:"26,27,28,29,30",img:'8'}
	 ],
	 festival:{"新手":0,"1月":1,"2月":2,"3月":3,"4月":4,"5月":5,"6月":6,"7月":7,"8月":8,"9月":9,"10月":10,"11月":11,"12月":12,"春节":100,"端午":101,"父亲":102,"感恩":103,"国庆":104,"教师":105,
	            "劳动":106,"母亲":107,"七夕":108,"情人":109,"圣诞":110,"五一":111,
	            "元旦":112,"元宵":113,"中秋":114,"重阳":115}
};
//tips功能
NTask.MainTip = {
   initTips:function(){
	  this.mainTip = $("#maintip");
	  this.hideMainTip();
	  this.mainTip.find(".i_close").bind("click",function(){
		   NTask.MainTip.hideMainTip();
	  })
   },
   updateMainTip : function(param){
	   this.hideMainTip();
	   param.cName = param.cName ||'立即查看';
	   var display = param.display||"inline";
	   if(param.title)  this.mainTip.find("#title").text(param.title);
	   if(param.imgUrl){
	   	   this.mainTip.find("#content").css({top:39,left:-17});
	   	   this.mainTip.find("#main_Img").parent().attr('style',"margin-bottom:0px;");
		   this.mainTip.find("#main_Img").attr({'src':param.imgUrl,style:"margin:20px;width:48px;height:48px;"}).show();
	       if(NTask.isIE6)this.mainTip.css('padding-bottom','20px');
		   if(NTask.isIE7) this.mainTip.find("#main_click").css('margin-bottom','10px');
	   }else{
		   this.mainTip.find("#main_Img").hide();
		   this.mainTip.find("#main_Img").parent().attr('style',"margin-bottom:26px;");
		   this.mainTip.find("#content").css({'left':10,top:18});
		   if(NTask.isIE7)this.mainTip.find("#main_click").css('margin-bottom','-40px');
		   if(NTask.isIE6)this.mainTip.css('padding-bottom','0px');
		
	   }
	   this.mainTip.find("#main_cName").text(param.cName);
	   if(param.content)this.mainTip.find("#content").html(param.content);
	   if(param.click)  this.mainTip.find("#main_click").attr("href",param.click);
	   if(param.left)   this.mainTip.css({left:param.left+130,top:param.top+80});
	   this.showMainTip();
   },
   showMainTip:function(){
	    this.mainTip.show();
   },
   hideMainTip:function(){
	    this.mainTip.hide();
   }
}
//任务工具
NTask.Utils = {
	  padCharFnum :function(name,s,e){
		 s = s||4;
		 e = e||7;
		 var gap = e-s;
		 name = name.replace(/^86/,"");//去掉86
		 var left = right = "";
	     if(name.match(/[0-9]{11}/)){
	    	left =  name.substring(0,s);
	    	right = name.substring(e);
	    	return left+"****"+right;
	     }else{
	    	return name ;
	     }
	    
	
	  },
	  leftPad:function(num,count,tag){
		   tag = tag||"..."
		   var strNum = ""+num;
		   if(typeof  num === 'number'){
				   return top.$PUtils.getLeftStr(strNum,count,tag);
		   }else{
			   return num;
		   }
	  },
      getActiveNamebyName:function(name){
    	 name=name||"";
	     var festival =  NTask.config.festival;
	     var activeName  = "";
	     for(var item in festival){
	    	 if(name.match(item)){
	    		 activeName  = item;
	    		 break;
	    	 }
	     }
	     return activeName;
      },
      getActivePicName :function(name){
    	 name = name||"";
	     var festival =  NTask.config.festival;
	     var activeId = "100";
	     for(var item in festival){
	    	 if(name.match(item)){
	    		 activeId  = festival[item]
	    		 break;
	    	 }
	     }
	     return activeId;
      },
	  getTaskNameByPicId :function(pic){
	   var festival =  NTask.config.festival;
	   var taskName = "";
	   for(var item in festival){
	    	 if(festival[item]==pic){
	    		 taskName  = item;
	    		 break;
	    	 }
	     }
	     return taskName;
	  },
	  //根据级数查任务数
	  getTaskCountByLevel : function(L){
		//return 2*L*(L-1)-2; 
		  var N = L*8-14;;
		  if(N<0) N = 0;
		  return N;
	  },
	  //根据任务数查级数
	  getLevelByTaskCount : function(N){
		 /* var moliLevel = parseInt(Math.sqrt((taskCount+2)/2));//实际级数<=molishuo*/
		  var Level = parseInt((N+14)/8);//实际级数<=Level
		  var taskCount = this.getTaskCountByLevel(Level);//实际任务数<=taskCount
		  if(taskCount<0){//如果得到的任务数小于0则级数+1
			 Level++; 
		  }
		  taskCount = this.getTaskCountByLevel(Level);//加之后的级数所得任务数与所级任务数相比
		  while(taskCount<N){//直到找到大于所给的任务数的级数
			  Level++
			  taskCount = this.getTaskCountByLevel(Level);
		  }
		  if(taskCount>N){
			  Level--;
		  }
		  return Level;
		 
	  },
	  //是否具备升级条件,当前任务等级，已完成任务数
	  isCanLevel:function(taskCount,L){
		return  taskCount>= this.getTaskCountByLevel(L+1);
	  },
	  //根据用户等级查询
	  getLeveNameByLevel : function(level){
		var taskLevels = NTask.config.taskLevel;
		var len = taskLevels.length,levels = "";
		for(var i=0;i<len;i++){
		  levels = taskLevels[i].level;
		  if(levels.indexOf(level)>=0){
			 return taskLevels[i];
		  }
		}
		return taskLevels[0];
	  },
	   /**
	   * 获取图片路径
	   * @param {Object} ImageUrl
	   * @return {TypeName} 
	   */
	  getLevelImageSrc : function(img){
		  if(img){
		   		return top.$App.getResourceHost()+"/m2012"+NTask.levelPath+img+"_76.png"
		  }else{
		   		return top.$App.getResourceHost()+"/m2012/images/ad/face.jpg";
		  }
	  },
	/**
	 * 获取图片地址
	 * @param {Object} ImageUrl 图片地址 
	 */
	getStarImageSrc : function(starImgUrl){
	  if(starImgUrl){
	   		return NTask.imagesPath+starImgUrl;
	  }else{
	   		return top.$App.getResourceHost()+"/m2012/images/ad/face.jpg";
	  }
	},
     /**
      * 个人头像设置
      */
	 updateHead : function(){
		top.addBehaviorExt({actionId:103702, pageId:10544 });
		top.$PUtils.updateUserInfo('head');
	 }
  /////////////////////////////////////
}

