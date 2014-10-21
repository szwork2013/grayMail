//提示语
var mmsMessages=
{
        //公共提示语
        common_SysError:"系统繁忙，请稍候再试！",
        common_DataInProcess:"数据处理中，请稍候...",
        common_DataInLoading:"数据加载中，请稍候...",
        common_ValidImgTextEmpty:"请输入图片验证码",
        common_ValidImgTextError:"错误的图片验证码，请重新输入!",
        
        mmsRecord_NotSelectMms:"请选择彩信",
        mmsRecord_DeleteConfirm:"您确定删除选中的彩信记录吗?",
        mmsRecord_SearchText:"查找彩信记录",
        mmsRecord_CopySuccess:"复制成功",
        mmsRecord_CollectText:"<em></em>",
        mmsRecord_PerviewErrorInfo:"没有任何可预览的彩信！",
        
        //彩信成功页
        mmsSuccess_RemmendText:"喜欢这条彩信的用户还喜欢：",
        mmsSuccess_RemmendDiyText:"热门推荐：",
        mmsSuccess_SendMmsMsg:"您的彩信发送完成",
        mmsSuccess_SendWordMsg:"您的彩字发送成功"
        
};
var recordType=
{
    allList:0,
    sendedList:1,
    timeList:2,
    collectList:3,
	draftList:4
};
var dateType=
{
    allList:0,
    todayList:1,
    weekList:2,
    monthList:3
};
var mmsConfig=
{
    histDestUserListCount:5
}
//初始化时彩信记录类型
var initRecordType;
var CommonMethod={
    showMessage:function(state,message)
    {
        if(state!=0)
        {
            if(state==2)//登录超时
                Utils.showTimeoutDialog();
            else if(message && $.trim(message)!="")
                top.FloatingFrame.alert(message);
            else
                top.FloatingFrame.alert(mmsMessages.common_SysError);
        }
    },
    getUserNameDecode:function(usernumber)
    {
        if(this.getUserNumberNo86(usernumber)==this.getUserNumberNo86(top.UserData.userNumber))//发给自己
        {
			return this.getTrueName(top.UserData.userName);
        }
        else
        {
            var addrobj = top.Contacts.getSingleContactsByMobile(usernumber,true);
            var result=usernumber;
            if(addrobj!=undefined && addrobj)
            {
                if(addrobj.name.length>0){
                    result=addrobj.name;
                }
            }
        }
        return this.getUserNumberNo86(result);
    },
    getUserNumber86:function(thismobile){
        var reg = /(<)([\w|\+]+)(>)/;
        var re = new RegExp(reg);
        if (re.test(thismobile)) {
            var c = re.exec(thismobile);
            thismobile = c[2];
        }
        if ($.trim(thismobile).length == 11) {
            thismobile = "86" + thismobile;
        }
        if (thismobile.length == 14 && thismobile.substr(0, 1) == "+") {
            thismobile = thismobile.replace("+", "");
        }
        return thismobile;
    },
    getUserNumberNo86:function(thismobile){
        thismobile=$.trim(thismobile);
        if (thismobile.length == 13&&thismobile.indexOf("86")==0) {
            thismobile = thismobile.substring(2,thismobile.length);
        }
        return thismobile;
    },
	getTrueName: function(userName){
	    return top.$User.getSendName() || "";
	},
   getPerviewSize:function (frameData)
   {
        var size=0;
        for(var i=0;i<frameData.length;i++)
        {
            if(frameData[i].width==240&&frameData[i].height==320)
            {
                size="0";
                break;
            }
            if(frameData[i].width==176&&frameData[i].height==220)
            {
                size="1";
                break;
            }
            if(frameData[i].width==128&&frameData[i].height==128)
            {
                size="2";
                break;
            }
        }
        return size;
   },
   substr:function (str, maxLength)
   { 
       if(!str || !maxLength) { return ''; } 
       var charLength = 0; 
       var temp = ''; 
       for (var i = 0; i < str.length; i ++ )
       { 
        if (str.charCodeAt(i) > 255) 
         { 
           charLength += 2; 
        } 
        else 
        { 
           charLength ++ ; 
        }
         if(charLength > maxLength) 
        { 
          return temp+"..."; 
        } 
        temp += str.charAt(i); 
       } 
      return str;
    }
};
String.format = function() 
{
    if( arguments.length == 0 )
        return null; 
    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

//彩信记录
function mmsRecord()
{
    me=this;
    me.recordType=recordType.allList;
    me.dateType=dateType.allList;
    me.destNumber='';
    me.pageIndex=1;
    me.pageCount=1;
	me.pageSize=8;//每页彩信记录的最大条数
    me.groupId=Utils.queryString("groupid");
    if(!me.groupId)
        me.groupId=0;
    if(parseInt(me.groupId)>0)
        me.recordType=recordType.timeList;
    var checkAll=$("p[class=func]");
    $("#hrAllCount").attr("class","current");
    $("#txtSubject").val(mmsMessages.mmsRecord_SearchText);
	var itemMmsHtml = ['<li class="new-aside tab-main category md10">',
             '<div class="name">',
               '<input type="checkbox" class="chk" value="{0}" id="lbl_{0}"/>',
               '<a id="lbl_{0}" type="send" href="javascript:" title="{5}">{1}</a></div>',
             '<div class="lt">{3}',
             '<div class="info">',
               '<p><a href="javascript:" type="send">转发</a><a href="javascript:" type="edit">编辑</a><a href="javascript:" type="del">删除</a></p>',
               '<ul class="send" mmsindex="0">',
                 '<li>{7}</li>',
               '</ul>',
              '</div>',
             '</div>',
             '<div class="rebox fl" MmsIndex="{6}"><!--更多室添加rebox_more-->',
                '<div>',
                 '<p><span>收件人：</span></p>{4}',
                '</div>',
             '</div>',
           '</li>'].join("");
    var collectHtml="<li>"+
                        "<div class=\"ctn\">"+
                    	    "<div class=\"name\"><input type=\"checkbox\" class=\"chk\" value=\"{0}\" id=\"chk_{0}\"/><a id=\"lbl_{0}\" type=\"send\" href=\"javascript:\" title=\"{5}\">{1}</a></div>"+
                            "<div class=\"shadow\" {2} ></div>{3}"+   
                        "</div>"+                     
                		"<p><a href=\"javascript:\" type=\"send\">转发</a><a href=\"javascript:\" type=\"edit\">编辑</a><a href=\"javascript:\" type=\"del\">删除</a></p>"+
                        "<span>{4}</span>"+
                    "</li>";

    //加载数据
   this.loadData=function(pageIndex)
   {
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
            getMmsRecords(pageIndex);
        }
   }
   //首次加载
   this.initData=function()
   {        
        this.loadData(1);     
   }
   //从服务器端加载彩信记录
   function getMmsRecords(p_pageIndex)
   {
	    //debugger;
        me.pageIndex=p_pageIndex;
        top.WaitPannel.show(mmsMessages.common_DataInLoading);
		var dataJson = {pageIndex:p_pageIndex,recordType:me.recordType,groupId:me.groupId,destNumber:me.destNumber,dateType:me.dateType,subject:getSearchSubject(),pageSize:me.pageSize};
		var dataXml = top.namedVarToXML("",dataJson,"");
		$.ajax({
			type:"post",
			dataType: "json",
			url: Utils.getAddedSiteUrl("queryMMSRecord"),
			data:dataXml,
			contentType:"application/xml;charset:utf-8",
			success:function(result)
			{
				initRecordType = result.recordType;
				bindMmsRecords(result,p_pageIndex);
				top.WaitPannel.hide();
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
			}
		  });
   }
   function getSearchSubject()
   {
       var subject = $.trim($("#txtSubject").val());
       subject = subject.encode();
        if(subject==mmsMessages.mmsRecord_SearchText)
            subject="";
        return subject;
   }
   //绑定数据
   function bindMmsRecords(result,pageIndex)
   {
		$("#defNoRecord").hide();

		if(result.code == "S_OK"){
			//debugger;
			var divContent=$("#divContent");
			var ulMmsContent=$("#ulMmsContent");
			ulMmsContent.html("");
			var pNoRecord=$("#pNoRecord");
			var pNoCollect=$("#pNoCollect"); 
			checkAll.text("全选");
			var recordTypeText=["彩信记录","已发送","定时发送","彩信珍藏","草稿箱"];
			var recordCountText=recordTypeText[me.recordType]+"<span>(共 "+result.recordsCount+" 条)</span>";
			if(me.recordType==recordType.collectList)
				recordCountText=recordTypeText[me.recordType]+"<span>(共 "+result.recordsCount+" 条)&nbsp;"+mmsMessages.mmsRecord_CollectText+"</span>";
			$("#hRecordCountText").html(recordCountText);
			$("#dvIframe").css({"display":"none"}); 
			var subLength=(me.recordType!=recordType.collectList && me.recordType!=recordType.draftList)?26:12;

			for(var i=0;i<result.mmsRecords.length;i++)//彩信列表
			{
				var curMmsData=result.mmsRecords[i];
				//var subject=curMmsData.Subject.length>9?(curMmsData.Subject.substring(0,8)+"..."):curMmsData.Subject;
				var allSubject=$.trim(curMmsData.subject);
				var subject=CommonMethod.substr(allSubject,subLength);
				
				//var seqno=curMmsData.groupId+"_"+curMmsData.recordType;
				var seqno=curMmsData.groupId+"_"+result.recordType;
				var curMmsHtml="";
				var text="";
				var styleStr="";
				var size;
				if(curMmsData.frameContent!='')
				{
					 var frameContent=curMmsData.frameContent;
					 size=processSize(frameContent[0].width,frameContent[0].height);
				}
				else
				{
					size=[128,128];
				}
				if(size.length>0)
				{
					styleStr=String.format(' style="width:{0}px;height:{1}px"',size[0],size[1]);
				}
				if(curMmsData.showType=="1"){
					text=String.format('<a href="javascript:;"><img src="{0}" type="send" class="img hover" {1}/></a>', curMmsData.showContent, styleStr);
				}
				else if(curMmsData.showType=="2")
				{
					var text=curMmsData.showContent==''?"暂无内容":unescape(curMmsData.showContent);
					if(text.replace(/[^\x00-\xff]/g,"**").length>50)
						text=text.substring(0,48)+"...";
					text=String.format("<a class=\"img\" type=\"send\"><div class=\"txt\" type=\"send\">{0}</div></a>",text.encode());
				}
				else if(curMmsData.showType=="3")
					text="<a href=\"javascript:;\" class=\"img\" type=\"send\"><div class=\"media\" type=\"play\"></div><span type=\"play\">试听</span></a>";
				if(me.recordType!=recordType.collectList && me.recordType!=recordType.draftList)
				{
					divContent.addClass("divContent");
					curMmsHtml=String.format(itemMmsHtml, seqno, subject.encode(), styleStr, text, getDestUserHtml(curMmsData), allSubject.encode(), i, getMmsTime(curMmsData));
				}
				else
					curMmsHtml=String.format(collectHtml,seqno,subject.encode(),styleStr,text,curMmsData.startSendTime,allSubject.encode());
				var curMmsHtmlObj=$(curMmsHtml);
				curMmsHtmlObj[0].MmsData=curMmsData;
				ulMmsContent.append(curMmsHtmlObj);
                

			    //fixed未知渲染bug
				ulMmsContent.find(".shadow").each(function () {
				    if (this.innerHTML == "") {
				        this.style.display = "none";
				    }
				});

			}
			if(me.recordType!=recordType.collectList && me.recordType!=recordType.draftList)
			{
				$(".btnCopy").show();
				$("#dtDestUser").show();
				divContent.attr("class","content");
				if(me.destNumber=='')
				{
					bindHistDestUsers(result.histDestUserInfo);
				}
			}
			else
			{
			   $(".btnCopy").hide();
			   $("#dtDestUser").hide();
			   $("#scrollBox").hide();
			   $("#hrMoreDestUser").hide();
			   divContent.attr("class","content recs");
			}
			if(result.mmsRecords.length>0)
			{
				pNoRecord.hide(); 
				pNoCollect.hide();
				ulMmsContent.show();
			}
			else
			{
				 if(me.recordType!=recordType.collectList)
				 {
					pNoRecord.show(); 
					pNoCollect.hide();
				 }                    
				 else
				 {
					pNoRecord.hide(); 
					pNoCollect.show();
				 }
				 ulMmsContent.hide();
			}
			if(me.groupId>0)//查看定时彩信记录
			{
				recordTypeHref.removeClass("current");
				$("#dlList [typeGroup=recordType][typeValue=2]").attr("class","current");
			}       
			addEvents();
			bindPagger(result.recordsCount,pageIndex);	
		}else{
			if(result.resultMsg){
				top.FF.alert(result.resultMsg);
			}else{
				top.FF.alert(mmsMessages.common_SysError);
			}
		}
        //CommonMethod.showMessage(result.state,result.resultMsg);
   }
   function processSize(width,height)
   {
      var size=[];
      if(width==160&&height==120)
      {
         size.push(128);
         size.push(96);
      }
      if(width==176&&height==220)
      {
         size.push(102);
         size.push(128);
      }
      if(width==240&&height==320)
      {
         size.push(96);
         size.push(128);
      }
      if(size.length==0)
      {
         size.push(128);
         size.push(128);
      }
      return size;
   }
   //删除(delType:0单个删除，1复选删除)
   function del(groupIds,delType,seq)
   {
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
			if($.trim(groupIds).length!=0)
            {
                top.FloatingFrame.confirm(mmsMessages.mmsRecord_DeleteConfirm,function()
                {  
                    top.WaitPannel.show(mmsMessages.common_DataInProcess);
                    $("button").attr("disabled",true);
                    var newPageIndex=getNewPageIndex(me.pageIndex,delType);
                    me.pageIndex=newPageIndex;
					var dataJson = {optionType:1,groupIds:groupIds,pageIndex:newPageIndex,recordType:me.recordType,dateType:me.dateType,destNumber:me.destNumber,subject:getSearchSubject(),seq:seq};
					var dataXml = top.namedVarToXML("",dataJson,"");
                    $.ajax({type:"post",
						dataType: "json",
						url: Utils.getAddedSiteUrl("delMMSRecord"),
						data:dataXml,
						contentType:"application/xml;charset:utf-8",
						success:function(result)
						{
							//删除成功日志上报
							/*
							Utils.logReports({
								mouduleId: 16,
								action: 62,
								thing: "delMmsRecord",
								type: 1
							});*/

							$("button").attr("disabled",false);
							if(result.code=="S_OK")
							{
								me.isDelete=1;
								bindMmsRecords(result,me.pageIndex);
								me.isDelete=null;
							}
							else
							{
								//CommonMethod.showMessage(result.state,result.resultMsg);
								top.FF.alert(result.resultMsg);
							}
							top.WaitPannel.hide();
						}
                    });               
                });
            }
            else
            {
                 top.FloatingFrame.alert(mmsMessages.mmsRecord_NotSelectMms);
            }
        }
   }
   //复制到珍藏
   function copy(groupIds)
   {
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
            if($.trim(groupIds).length!=0)
            {
                top.WaitPannel.show(mmsMessages.common_DataInLoading);
                $("button").attr("disabled",true);
				var dataJson = {optionType:2,groupIds:groupIds,recordType:me.recordType,dateType:me.dateType};
				var dataXml = top.namedVarToXML("",dataJson,"");
                $.ajax({type:"post",
					dataType: "json",
					url: Utils.getAddedSiteUrl("copyMMSToCollect"),
					data:dataXml,
					contentType:"application/xml;charset:utf-8",
					success:function(result)
					{
						top.WaitPannel.hide();
						$("button").attr("disabled",false);
						if(result.state==0)
						{
							top.WaitPannel.show(mmsMessages.mmsRecord_CopySuccess);
							setTimeout(function(){top.WaitPannel.hide();},500);
						}
						else
						{
							CommonMethod.showMessage(result.state,result.resultMsg);
						}
					}
                });
            }
            else
            {
                 top.FloatingFrame.alert(mmsMessages.mmsRecord_NotSelectMms);
            }
        }
   }
   //得到删除后的新页码(delType:0单个删除，1复选删除)
   function getNewPageIndex(pageIndex,delType)
   {
        var newPageIndex=1;
        if(pageIndex>1)
        {
            newPageIndex=pageIndex;
            var checkbox=$("input[type=checkbox]");
            var checkedLength=$("input[type=checkbox]:checked").length;
            if(delType==0)
                checkedLength=1;
            if(checkbox.length==checkedLength&&pageIndex==me.pageCount)//当前是最后一页并且全部选中了，则跳到前一页
            {
                newPageIndex=pageIndex-1;
            }
        }
        return newPageIndex;
   }
   //加载联系人
   function bindHistDestUsers(destUserInfo)
   {
        me.isShowAllDestUser=0;
        var histDestUserHtml=[];
        var scrollBox=$("#scrollBox");
        if(destUserInfo.length>0)
        {
            histDestUserHtml.push("<a href=\"javascript:\" class=\"current\" hrefType=\"destUser\" userNumber=\"\">全部联系人</a></dd>");
            for(var i=0;i<destUserInfo.length;i++)
            {
                var destUser=CommonMethod.getUserNameDecode(destUserInfo[i].destUserNumber);
                if(destUser.length>12)
                    destUser=destUser.substring(0,11)+"...";
                histDestUserHtml.push(String.format("<a href=\"javascript:\" style=\"display:{0}\" hrefType=\"destUser\" userNumber=\"{1}\">{2}</a></dd>",i<mmsConfig.histDestUserListCount?"":"none",destUserInfo[i].destUserNumber,destUser.encode()));
            }
            var htmlStr=histDestUserHtml.join("");
            scrollBox.html(htmlStr);
            scrollBox.show();
            if(destUserInfo.length<=mmsConfig.histDestUserListCount)
                $("#hrMoreDestUser").hide();
            else
                $("#hrMoreDestUser").html("查看更多").show();
        }
        else
        {
            scrollBox.html("");
            $("#hrMoreDestUser").hide();
        }
   }
   //添加事件
   function addEvents()
   {   
        //转发、编辑、删除、查看更多
        $("#ulMmsContent>li").click(function(event)
        {
            var type=$(event.target).attr("type");
            if(type&&type!="checkbox")
            {
				//求目标元素的索引
				//debugger;
				var targetIndex = $(event.target).parents("div").find("p").index($(event.target).parent()) - 1;
                var mmsData=this.MmsData;
                switch(type)
                {
                    case "send":
                        send(mmsData);
                        break;
                    case "edit":
                        edit(mmsData);
                        break;
					case "sendToUser":
						sendToUser(mmsData,targetIndex);
                        break;
                    case "del":                    
                        var seqno=mmsData.groupId+"_"+initRecordType;
                        del(seqno,0,mmsData.seq);
                        break;
                    case "view":
                        if(!mmsData)
                            mmsData=$(this).parents("li")[0].MmsData;
                        viewMore(event.target,mmsData);
                        break;
                    case "play"://播放音乐
                        var frame=mmsData.frameContent;
                        MMSDIY.playMusic(frame[0].contentPath,frame[0].contentName);
                        break;
                }
                return false;
            }
        });

        //复选框
        var allCheckBox=$("input[type=checkbox]");
        allCheckBox.click(function()
        {        
            var checkedBox=allCheckBox.filter(":checked");
            if(allCheckBox.length==checkedBox.length)
            {
                checkAll.text("不选");
            }
            else
            {
                checkAll.text("全选");
            }
        });
        //联系人
        var destUserHref=$("#divPanel");
        destUserHref.find("a").each(function()
        {
            var href=$(this);
            var type=href.attr("hrefType");
            switch(type)
            {
                case "destUser"://点击联系人
                    this.onclick=function()
                        {
                            destUserHref.find("a[hrefType=destUser]").removeClass("current");
                            href.attr("class","current");
                            me.destNumber=href.attr("usernumber");
                            me.loadData(1);                            
                        };
                    break;
                case "moreDestUser":
                    var scrollBox=$("#scrollBox");
                   this.onclick=function()
                   {
                        if(me.isShowAllDestUser)//显示了全部联系人
                        {   
                            var i=0;
                            scrollBox.find("a[hrefType=destUser]").each(function()
                            {
                                if(i>mmsConfig.histDestUserListCount)
                                 $(this).hide();
                                i++;
                            });
                            href[0].innerHTML="查看更多";
                            me.isShowAllDestUser=null;
                        }
                        else
                        {                            
                            scrollBox.find("a[hrefType=destUser]").each(function()
                            {                                
                                $(this).show();
                            }); 
                            if(scrollBox[0].scrollHeight>160){
	                            scrollBox[0].style.height = "160px";
                            };                
                            href[0].innerHTML="显示部份";           
                            me.isShowAllDestUser=1;
                        }
                   };
                   break;
            }             
        });
        
   }
   //分页
   function bindPagger(recordCount,pageIndex)
   {    
	   //debugger;
        destNumber=me.destNumber;
		pageSize = me.pageSize;
        var pagger=$(".pageCountBar");
        var privPagger=pagger.find(".prev");
        var nextPagger=pagger.find(".next");
        var selPages=pagger.find(".selPages");
		var selectPage = selPages.find(".selectPage");
		var curPage = selPages.find(".curPage");
		var btnSelPage = selPages.find(":first");
        var pageCount=Math.ceil(recordCount/pageSize);
        me.pageCount=pageCount==0?1:pageCount;
        if(pageIndex > 1){//上一页
            privPagger.show();
        }else{
            privPagger.hide();
        }
        if(pageIndex < pageCount){//下一页
            nextPagger.show();
        }else{
            nextPagger.hide();
        }
        if(pageCount>1){
            if(!me.onlyChangePage){//只改变页码时，不重新绑定下拉框 
                var selectHtml=[];
                for(var i=1;i<=pageCount;i++){
                    selectHtml.push(String.format('<li><a href="javascript:;" rel="{0}">{0}/{1}页</a></li>',i,pageCount));
                }
                selectPage.html(selectHtml.join(""));
            }
            me.onlyChangePage=false;
            selPages.show();
        }else{
            selPages.hide();
        }
        setTimeout(function(){
			curPage.html(String.format('{0}/{1}页', pageIndex, pageCount));
		 }, 10);
         
        privPagger.each(function(){
            this.onclick=function(){me.onlyChangePage=true;me.loadData(pageIndex-1);};
        });
        nextPagger.each(function(){
            this.onclick=function(){me.onlyChangePage=true;me.loadData(pageIndex+1);};
        });
        selPages.each(function(){
            this.onchange=function(){
                var newIndex=parseInt($(this).attr("value"));
                selPages.attr("value",newIndex);
                me.onlyChangePage=true;
                me.loadData(newIndex);
            }
        });
		btnSelPage.click(function(e){//翻页下拉菜单的显示
			$(this).next().show();
			e.stopPropagation();
		})
		$(document).click(function(){
			selectPage.hide();
		})
		selectPage.click(function(e){
			var target = e.target;

			if (target.tagName == "UL") return;
			var currentInext = parseInt(target.getAttribute("rel"), 10);
			me.loadData(currentInext);
		})
   }
   //点击接收人，获取接收人的手机号码，index为接收人索引 2011-11-17
   function getMmsPerviewData(mmsData,type,index)
   {
         MMSPerviewData=new Object();
         top._EditTimmingGroupId=-1;//定时彩信传彩信ID，即时传-1
         if(type==1)//编辑
         {
             var destNumber=[];
             for(var i=0;i<mmsData.destUsers.length;i++)
             {
                destNumber.push(mmsData.destUsers[i].destNumber);
             }
             MMSPerviewData.destNumber=destNumber.join(",");             
             if(mmsData.isTime==1)
               {
                    top._EditTimmingGroupId=mmsData.groupId;
                    var dt=new Date(mmsData.startSendTime.replace(/\-/g,"/"));
                    MMSPerviewData.TimmingYear=String(dt.getFullYear());
                    MMSPerviewData.TimmingMonth=dt.getMonth()+1>=10?String(dt.getMonth()+1):"0"+(dt.getMonth()+1);
                    MMSPerviewData.TimmingDay=dt.getDate()>=10?String(dt.getDate()):"0"+(dt.getDate());
                    MMSPerviewData.TimmingHour=dt.getHours()>=10?String(dt.getHours()):"0"+(dt.getHours());
                    MMSPerviewData.TimmingMinute=dt.getMinutes()>=10?String(dt.getMinutes()):"0"+(dt.getMinutes());
               }
			   MMSPerviewData.recordType = initRecordType;
         }
         else if(type==2)//发送
         {
             MMSPerviewData.destNumber=mmsData.destUsers[index].destNumber;             
             if(mmsData.isTime==1)
               {
                    top._EditTimmingGroupId=mmsData.groupId;
                    var dt=new Date(mmsData.startSendTime.replace(/\-/g,"/"));
                    MMSPerviewData.TimmingYear=String(dt.getFullYear());
                    MMSPerviewData.TimmingMonth=dt.getMonth()+1>=10?String(dt.getMonth()+1):"0"+(dt.getMonth()+1);
                    MMSPerviewData.TimmingDay=dt.getDate()>=10?String(dt.getDate()):"0"+(dt.getDate());
                    MMSPerviewData.TimmingHour=dt.getHours()>=10?String(dt.getHours()):"0"+(dt.getHours());
                    MMSPerviewData.TimmingMinute=dt.getMinutes()>=10?String(dt.getMinutes()):"0"+(dt.getMinutes());
               }
			   MMSPerviewData.recordType = initRecordType;
		 }
         else//转发
         {            
            MMSPerviewData.destNumber='';
         }
         MMSPerviewData.frameList=mmsData.frameContent==''?[]:mmsData.frameContent;
         MMSPerviewData.subject=mmsData.subject;
        
         return MMSPerviewData;
   }
   //转发
   function send(mmsData)
   {
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
            var mms=getMmsPerviewData(mmsData,0);            
            if(mms.frameList.length>0)
            {
                var size=CommonMethod.getPerviewSize(mms.frameList);          
                MMSPerview.Open(3,mms,size);
            }
            else
                 top.FloatingFrame.alert(mmsMessages.mmsRecord_PerviewErrorInfo);
        }
   }
   //编辑
   function edit(mmsData)
   {
	   //debugger;
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
             var mms=getMmsPerviewData(mmsData,1);

             if(mms.frameList.length>0)
             {
                 top._MMSDIYEditFromSource=mms;
                 window.location.href="mmsDIY.html?type=1&rnd="+Math.random();
             }
             else
                 top.FloatingFrame.alert(mmsMessages.mmsRecord_PerviewErrorInfo);
             return false;
         }
   }

   //发给接收人
   function sendToUser(mmsData,index)
   {
	   //debugger;
        var isTimeout=top.Utils.PageisTimeOut(true);
        if(!isTimeout)
        {
             var mms=getMmsPerviewData(mmsData,2,index);
             if(mms.frameList.length>0)
             {
                 top._MMSDIYEditFromSource=mms;
                 window.location.href="mmsDIY.html?type=1&rnd="+Math.random();
             }
             else
                 top.FloatingFrame.alert(mmsMessages.mmsRecord_PerviewErrorInfo);
             return false;
         }
   }
   
   //查看更多
   function viewMore(obj,mmsData)
   {
       var ulObj=$(obj).parent().parent().parent();
        //隐藏其它查看列表
       var ulMmsContent= $("#ulMmsContent");
       if(ulMmsContent.find("div.rebox_more").length>0)
       {
            ulMmsContent.find("div.rebox_more").each(function(index)
            {   
                var thisUl=$(this);
                if(thisUl.attr("class")=="rebox_more fl")
                {
                    var ulHref=thisUl.find("a:last");
                    if(ulObj.attr("MmsIndex")&&ulObj.attr("MmsIndex")!=String(index)&&ulHref.length>0)
                    {
                        ulHref.click();
                    }
                }
            });
        }
       
        if(ulObj)
        {
            var destUserHtml=[];
            destUserHtml.push('<p><span>收件人：</span></p>');
            for(var i=0;i<mmsData.destUsers.length;i++)
            {
                 destUserHtml.push(getItemHtml(mmsData.destUsers[i]));
            }
            destUserHtml.push('<p><a href="javascript:;" class="a_name">隐藏↑</a></p>');
            ulObj.find(">div").html(destUserHtml.join("").decode());
        
            ulObj.attr("class","rebox_more fl");
            ulObj.find("a:last").each(function()
            {
                $(this).click(function()
                {
                    hideMore(this,mmsData);
                });
            });
            if(ulObj)
              {
                    
                        setTimeout(function()
                        {
                            try
                            {
	                            ulObj.parent().parent().parent().css({"z-Index":100});
                                //ulObj.hide().show();
                            }
                            catch(e){}
                        },100);
                    
              }
        }
   }
   //隐藏
   function hideMore(obj,mmsData)
   {
        var ulObj=$(obj).parent().parent().parent();
        $("#dvIframe").hide();
        if(ulObj)
        {
            var destUserHtml=getDestUserHtml(mmsData);
            
            ulObj.find(">div").html('<p><span>收件人：</span></p>' + destUserHtml.decode()); 
            ulObj.attr("class", "rebox fl").hide();           
            ulObj.find("a:last").each(function()
            {
                $(this).click(function()
                {
                    viewMore(this,mmsData);
                });
            });  
            setTimeout(function()
            { 
                ulObj.parent().parent().parent().css({"z-Index":0});
                ulObj.show();
            },10);
        }
   };
   //彩信时间显示
	function getMmsTime (curMmsData) {
		var timeHtml = "";
		//草稿箱中，如果彩信没有定时，则取创建彩信的时间
		if (me.recordType == 4 && curMmsData.isTime == 0) {
			timeHtml = curMmsData.createTime.replace(/:\d*$/, "");
		} else {
			timeHtml = curMmsData.startSendTime.replace(/:\d*$/, "");
		}
		return timeHtml;
	};
	//彩信接收人列表
	function getDestUserHtml (curMmsData) {
		var destUserHtml = [];
		for (var i = 0; i < 5; i++){
			if (curMmsData.destUsers[i]) {
				if (i == 4 && curMmsData.destUsers.length > 5) {
					destUserHtml.push('<p><a href="javascript:;" class="a_name" type="view">更多↓</a></p>');
					break;
				} else {
					destUserHtml.push(getItemHtml(curMmsData.destUsers[i]));
				}
			} else {
				break;
			}
		}
		return destUserHtml.join("");
	};
	function getItemHtml (destUsers) {    
		var destUser = CommonMethod.getUserNameDecode(destUsers.destNumber);
		var destUserHtml = [], icon = "", status = destUsers.status;

        //接收人长度过长，进行截取，考虑了双字节和单字节两种情况
		if((/[^\x00-\xff]/ig).test(destUser)){
			if(destUser.length > 7)
				destUser = destUser.substring(0, 7) + "...";
		}else{
			if(destUser.length > 12)
				destUser = destUser.substring(0, 11) + "...";
		}

		if (status == "1") {
			icon = '<i class="icon_send sen_sucful" title="发送中"></i>';
		} else if (status == "200") {
			icon = '<i class="icon_send send_fail" title="发送失败"></i>';
		} else if (status == "100") {
			icon = '<i class="icon_send sen_sucful" title="发送成功"></i>';
		}
		destUserHtml.push('<p><a type="sendToUser" href="javascript:;" class="a_name" title="发彩信给Ta">' + destUser.encode() + '</a>' + icon + '</p>');
		return destUserHtml.join("");
   }
   //按类型查找
   var recordTypeHref=$("#dlList a[typeGroup=recordType]");
   recordTypeHref.click(function()
   {
        me.groupId=0;
        var curObj=$(this),
			todayBtn = $("#dlList [typegroup=dateType][typevalue=1]"),
			weekBtn = $("#dlList [typegroup=dateType][typevalue=2]"),
			MonthBtn = $("#dlList [typegroup=dateType][typevalue=3]");

        recordTypeHref.removeClass("current");
        me.recordType=curObj.attr("typeValue"); 
        if(me.recordType==recordType.collectList)
            me.destNumber='';
        if(me.recordType==recordType.allList)
         {
             me.destNumber='';
             me.dateType=dateType.allList;             
             dateTypeHref.removeClass("current").filter("[typeValue=0]").attr("class","current");
             $("#txtSubject").val(mmsMessages.mmsRecord_SearchText);
         }
		if(me.recordType == recordType.draftList){
			todayBtn.html("今天保存");
			weekBtn.html("本周保存");
			MonthBtn.html("本月保存");
		}else if(me.recordType == recordType.collectList){
			todayBtn.html("今天珍藏");
			weekBtn.html("本周珍藏");
			MonthBtn.html("本月珍藏");
		}else{
			todayBtn.html("今天发送");
			weekBtn.html("本周发送");
			MonthBtn.html("本月发送");
		}
        curObj.attr("class","current");
        me.loadData(1);
   });
   //按时间查找
   var dateTypeHref=$("#dlList a[typeGroup=dateType]");
   dateTypeHref.click(function()
   {
        me.groupId=0;
        var curObj=$(this);
        dateTypeHref.removeClass("current");
        me.dateType=curObj.attr("typeValue");    
        curObj.attr("class","current");
        me.loadData(1);        
   });
   //搜索
   $("#btnSearch").click(function()
   {
        me.loadData(1);
   });
   //搜索输入框
   var txtSubject=$("#txtSubject");
   txtSubject.focus(function()
   {
        if(txtSubject.val()==mmsMessages.mmsRecord_SearchText)
        {
            txtSubject.val("");
        }
   }).blur(function()
   {
        if($.trim(txtSubject.val())=="")
        {
            txtSubject.val(mmsMessages.mmsRecord_SearchText);
        }
   });;
   //全选
   checkAll.click(function()
   {
        var checkBoxs=$("input[type=checkbox]");
        if(checkBoxs.length>0)
        {
            var p=$(this);
            var checked=p.text()=="全选"?true:false;
            var text=p.text()=="全选"?"不选":"全选";
            checkBoxs.each(function()
            {
                $(this).attr("checked",checked);           
            });
            checkAll.text(text);
        }
   });
   //删除
   $(".btnDel").click(function()
   {
        var seqnos=getSelectSeqs();
        del(seqnos,1);
   });
   //复制到珍藏
   $(".btnCopy").click(function()
   {
        var seqnos=getSelectSeqs();
        copy(seqnos);
   });
   function getSelectSeqs()
   {    
       var seqnos="";
       var checkbox=$("input[type=checkbox]:checked");        
       checkbox.each(function(i)
       {
           seqnos+=$(this).val();
		   if(i < checkbox.length-1){
				seqnos+=",";
		   }
       });    
       return seqnos;
   } ;
  //发送
   $("#hrefSendMms").click(function()
   {
       window.location.href="mmsDIY.html?sid="+top.UserData.ssoSid+"&rnd="+Math.random();
       return false;
   });  
}

//成功页
var SuccessPage={
    Init:function()
    {
        SuccessPageObj=this;
        var source=top._mmsFromSource;   //彩信来源1：彩仓  2：DIY   3：彩信记录 4：成功页的彩信数据  5：彩字     
        var mmsSeq=0;
        var isDiy=1;//是否DIY
        var isTime=top._mmsisTimming;//是否为定时
		var isSave = Utils.queryString("isSave");//是否保存在彩信记录
        var sid=top.UserData.ssoSid;
        var hMsg=$("#hMsg");
        if(source==1||source==4)//如果是彩仓的，取当前发送的彩仓彩信SEQ，不能推荐该彩信
        {
            isDiy=0;
            mmsSeq=top._mmsStorageSeqId?top._mmsStorageSeqId:0;
            hMsg.html(mmsMessages.mmsSuccess_RemmendText);
            $("#btnSendMms").click(function()//继续发彩信
            {
                window.location.href="mmsFactory.html?sid="+sid+"&rnd="+Math.random();
				return false;
            }).show();
        }
        else//DIY或彩字
        {
            hMsg.html(mmsMessages.mmsSuccess_RemmendDiyText);
            if(source==5)//彩字
            {
                $("#btnBack").click(function()//返回彩信首页
                {
                    window.location.href="mmsFactory.html?sid="+sid+"&rnd="+Math.random();
					return false;
                }).show();
                $("#btnSendWord").click(function()//继续发彩字
                {
                    window.location.href="mmsSend.html?sid="+sid+"&rnd="+Math.random();
					return false;
                }).show();
                $("#hSendTypeMsg").html(mmsMessages.mmsSuccess_SendWordMsg);
            }
            else//DIY
            {
                $("#btnSendMms").click(function()//继续发彩信
                {
                     window.location.href="mmsDIY.html?sid="+sid+"&rnd="+Math.random();
					 return false;
                }).show();
                 $("#hSendTypeMsg").html(mmsMessages.mmsSuccess_SendMmsMsg);
            }
        }           
        $("#hrefViewRecord").click(function()//查看彩信记录
        {
             window.location.href="mmsRecord.html?sid="+sid+"&rnd="+Math.random();
             return false;
        });   
        var pViewHis=$("#pViewHis"); 
        if(isTime)//查看定时彩信
        {
//            mmsSeq=top._mmsId?top._mmsId:0; 
//            mmsSeq=mmsSeq?mmsSeq:0;           
//            pViewHis.find("a").attr("href","mmsRecord.html?groupId="+mmsSeq+"&sid="+sid+"&rnd="+Math.random());
            pViewHis.find("a").attr("href","mmsRecord.html?groupid=1&sid="+sid+"&rnd="+Math.random());
            pViewHis.show();
        }
        else
        {
            pViewHis.hide();
        }
		if (isSave == 0) {
			$("#recordMes").show();
		}
		var dataJson = {
			isDiy:isDiy,
			isTime:isTime,
			mmsSeq:mmsSeq
		}
		var dataXml = top.namedVarToXML("", dataJson, "");
         $.ajax({
			type: "post",
			dataType: "json",
			url: Utils.getAddedSiteUrl("recommendMMS"),

			data: dataXml,
			contentType:"application/xml;charset:utf-8",
			success: function(result)
			{
				top.WaitPannel.hide();
				if(result.code=="S_OK")
				{
					SuccessPageObj.BindRemmendMms(result);
				}
				else
				{
					if(result.resultMsg){
						top.FF.alert(result.resultMsg);
					}else{
						top.FF.alert(mmsMessages.common_SysError);
					}
					
				}
			}
         });

    },
    //绑定推荐彩信数据
    BindRemmendMms:function(result)
    {
        var ulRemmendMms=$("#ulRemmendMms");
        //var mmsFileSite=result.mmsFileSite;
        //var mmsStorageDir=result.mmsStorageDirectory;
        var htemlTemplate="<li><a href=\"javascript\"><img src=\"{0}\"/></a>{1}</li>";
        var html=[];
        for(var i=0;i<result.mmsInfo.length;i++)
        {
            var curHref=document.createElement("a");
            //curHref.innerHTML="<img src=\""+mmsFileSite+result.mmsInfo[i].showImage.toLowerCase().replace("/"+mmsStorageDir,"")+"\"/>";
			curHref.innerHTML="<img src=\""+result.mmsInfo[i].showImage.toLowerCase()+"\"/>";
            curHref.title=result.mmsInfo[i].subject;
            curHref.mmsData=result.mmsInfo[i];
            curHref.onclick=function()
            {
                 MMSPerviewData=new Object();
                 MMSPerviewData.seqId=this.mmsData.seq;
                 MMSPerviewData.destNumber='';
                 MMSPerviewData.frameList=this.mmsData.frameInfo;
                 MMSPerviewData.subject=this.mmsData.subject;
                 var size=CommonMethod.getPerviewSize(MMSPerviewData.frameList);
                 MMSPerview.Open(4,MMSPerviewData,size);
            };
            var li=document.createElement("li");
            $(li).append(curHref);
            ulRemmendMms.append(li);
        }
    }
}
