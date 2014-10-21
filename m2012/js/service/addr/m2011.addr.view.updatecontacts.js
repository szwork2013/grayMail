/**
 @更新联系人
 @2012.05.31
 */

//更新联系人接口
if (window.ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].detail;
    var UpdateMsg = ADDR_I18N[ADDR_I18N.LocalName].updatecontacts;
    var ErrorMsg = ADDR_I18N[ADDR_I18N.LocalName].whoaddme;
}
function encodeXML(str){
	return top.$Xml.encode(str);
}
function htmlEncode(str) {
    return top.$T.Html.encode(str);
}

var anchorLocal = (function(d){
    return (function(url){
        var b = d.createElement("a");
        if (b.click) {
            b.href = url;
            d.body.appendChild(b);
            b.click();
        } else {
            b = d.createElement("META");
            b.httpEquiv="refresh";
            b.content="0;url=" + url; 
            d.getElementsByTagName("head")[0].appendChild(b);
        }
    });
})(document);
var wu = window.UpdateContactInterface;
var imgLoadurl = "/addr/apiserver/httpimgload.ashx";//imgLoadurl
var UpdateContacts = {
    count:0,//当前显示第几个
    deal:0,//已处理
    sum:0,//总人数
    deletNum:0,//不再提示的人数
    contactsInfoFiled:{ ImageUrl:"头像：", name:"姓名：",AddrFirstName :"姓名：",FamilyEmail:"电子邮箱：" ,BusinessEmail:"商务邮箱：",MobilePhone:"手机号码：", 
                        BusinessMobile:"商务手机：",FamilyPhone:"常用固话：",BusinessPhone:"公司固话：", UserSex:"性别：", CPName:"公司名称：", UserJob:"职务：",
                        HomeAddress:"家庭地址：",CPAddress:"公司地址：",CPZipCode:"公司邮编：" ,  Birday:"生日：", OtherIm:"飞信号 ："},
    gContactsDetails : new top.ContactsInfo(this.contactsInfoFiled),
    ContactMethod:"", //联系人账号 举报用
    RelatedAccount:"",//被举报联系人的电话
    ReportedSid:"",
    reportImage:"",//举报头像
    birthDay : null,
	logger: new M139.Logger("updatecontacts.js"),
	getUid:function(){
		return top.$User.getUid();
	},
	getUrlPrama:function(key,url){
		 var url = url || location.href;
		 return top.$Url.queryString(key,url );
	},
    initPage: function(){
        var _this =this;
		$("#nowupdateCount").text(this.count);
        this.bindEvents();
        this.birthDay = new DateControl("dateWrap"); //日期控件 dateWarp
        this.queryUpdateCount();//更新联系人总数
        top.addBehaviorExt({actionId:101245,thingId:0,moduleId:14});    
    },
    
	/**
	@绑定页面元素事件
	*/
	bindEvents: function(){

        //全部合并
        $("#aMergeAll_Up,#aMergeAll_Down").click(function(){
	    top.BH("addr_updateContact_updateAll");
            UpdateContacts.mergeAll();
            if (top.dyinfoNeedUpdateLength) {
                top.$App.dyinfoChanged1 = true;
                top.dyinfoNeedUpdateLength = 0; //用于欢迎页动态消息局部更新;
            }
            top.addBehaviorExt({actionId:101246,thingId:0,moduleId:14});
        });
    
        //更新，下一个
        $("#aMergeAndGoToNext").click(function(){
	    top.BH("addr_updateContact_updateNext");
            UpdateContacts.mergeAndGoToNext();
            if (top.dyinfoNeedUpdateLength) {
                top.$App.dyinfoChanged1 = true;
                top.dyinfoNeedUpdateLength-- //用于欢迎页动态消息局部更新;
            }
            top.addBehaviorExt({actionId:101246,thingId:0,moduleId:14});
        });
    
        //跳过
        $("#aGoToNext").click(function(){
            UpdateContacts.goToNextEvent();
            top.addBehaviorExt({actionId:101244,thingId:0,moduleId:14});
        });
        $("#aBack_Down,#aBack_Up,#aBack1,#aBack0").click(function(){
            UpdateContacts.goHomePage();
            return false;//ie6兼容
        });
        
        //不再提示
        $("#neverPrompt").click(function(){
            UpdateContacts.neverPrompt();
            top.addBehaviorExt({actionId:101574,thingId:0,moduleId:14});
        });
        
        //头像举报
        $("#reportImg").click(function(){
            if($(this).hasClass("IsReported")){return false;}
            UpdateContacts.reportImg();            
        });
		//手机号过滤
		 $("#MobilePhone").blur(function(e){//手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
			var mobile = e.target.value.replace(/\D/g, "");
			$(this).val(mobile);
		 });
         
		 $("#BusinessMobile").blur(function(e){//手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
			var mobile = e.target.value.replace(/\D/g, "");
			$(this).val(mobile);
		 });
	},
	
	/**
	@查询待更新联系人总数
	@param:
	@reutrn:
	*/
	queryUpdateCount: function(){
        var _this = this;
	    var param = new wu.QueryAllParams();
            param.UserNumber = _this.getUid();
            try{
              wu.Service.ProcessData(
                param,
                wu.ApiType.NeedUpdateContact,
                function(res){
					if(!res){return false;}//总数获取失败不需要提示 会在获取待更新详细信息里提示
                    if(res.UpdatedContactsNum > 0){
                        _this.sum = res.UpdatedContactsNum;
                        $("#updateCount").text(_this.sum);
                        $("#updateCountOnBtn").text('(' + _this.sum + ')');
                        _this.queryUpContactInfo(1,_this);//解决不同步问题。
						$("#UpdateContacts").show();
                    }
					
					if(res.UpdatedContactsNum<=0){
						$("#noUpdateContacts").show();
					}
                });
            }catch(e){
				 _this.logger.error("待更新联系人总数queryUpdateCount异常" + e );
            }   
	},
    /**
     * 设置更新前信息
     * @parma {}oldinfo
     * */
	setOldInfo:function(oldInfo){
       var sexSelect =["男","女","保密"];//0-男，1--女-2--保密
       var trStr = "";
           $.each(oldInfo,function(k,v){
             switch(k){
                 case "AddrFirstName":
                         $("#oldName").html(v).show();
                         $("#updataUserName").html(v);
                         break;
                 case "ImageUrl":
                         setImg("oldUserImg",v);
                         $("#oldUserImg").show();
                         break;
                 default:
                         if(v && UpdateContacts.contactsInfoFiled[k]){
                             if (k == "FamilyEmail" || k == "BusinessEmail" || k == "MobilePhone" || k == "BusinessMobile") {
                                 trStr = '<tr><td class="td1">' + UpdateContacts.contactsInfoFiled[k] + '</td><td>' + htmlEncode(v) + '</td></tr>';
                                 $(trStr).appendTo($("#oldInfoTable"));
                             }
                         }
                         break;
             }     
     });
                     
    },
    /**
     *设置更新后信息
     *param{}newInfo 
     */
    setNewInfo:function(oldInfo,newInfo){
        $.each(newInfo,function(i,n){
            switch(i){
                case "AddrFirstName":
                          $("#AddrFirstName").val($T.Html.decode(oldInfo[i])).show();
                         break;
                 case "ImageUrl":
                          setImg("newUserImg",oldInfo[i]);
                          $("#newUserImg").show();
                          if(n){
                              $("#newImgVal").val(oldInfo[i]);
                          }
                         break;
                 default:
					 var el = "#" + i;
					 var ppel = $(el).parent().parent();
					 if (n && UpdateContacts.contactsInfoFiled[i] && (i == "FamilyEmail" || i == "BusinessEmail" || i == "MobilePhone" || i == "BusinessMobile")) {
					     $(el).val($T.Html.decode(n));
						 ppel.show();
					 } else {
						 ppel.hide();
					 } 
					 break;
            }         
     });
    },
	/**
	@查询待更新联系人信息接口
	@param:
	@reutrn:
	*/
	queryUpContactInfo: function(page,context){
        var _this = context || this; //在queryContent回调里调用时设置回调作用域
	    var param = new wu.QueryDetailParams();
            param.UserNumber = _this.getUid();
            param.Page = page || 1; //翻页
            param.Record = 1; 
            try{
                wu.Service.ProcessData(
                param,
                wu.ApiType.NeedUpdateContactDetail,
                function (result) {  
                    if(!result || result.ResultCode!=0 ||!result.ContactsInfo){
                        top.FF.alert(UpdateMsg["getInfo_erro"]);//提示获取更新资料失败
                        return false;
                    }
                    var data = result.ContactsInfo;
                    _this.count++;
                    $("#nowupdateCount").text(_this.count);
                  
                    var textstr = _this.sum == _this.count ? "更新" : "更新，下一个";
                    $("#labelMergeAndGoToNext").text(textstr);
                    $("#updateIgnoreBtn").css("display","");
                 
                    $("#SerialId").val(data.SerialId);
                 
                    //显示更新前联系人信息
                    var oldInfo = data.OldInfo;
                    if(!oldInfo){return false;}
                    _this.setOldInfo(oldInfo);
                     
                    //显示更新后联系人信息
                    var newInfo = data.NewInfo;
                    if(!newInfo){return false;}
                    _this.setNewInfo(oldInfo,newInfo);
                     
                    //变更显示蓝色
                    var requeriedFiled =["FamilyEmail","MobilePhone","BusinessEmail","BusinessMobile"];
                    for(var j=0; j < requeriedFiled.length; j++){
                        var iblueEl = $("#"+requeriedFiled[j]);
                        if($.trim(oldInfo[requeriedFiled[j]]) == $.trim(newInfo[requeriedFiled[j]])){
                            iblueEl.removeClass("iblue");  
                        }else{
                            iblueEl.addClass("iblue");  
                         }
                     }
                     
                    //举报设置
                    _this.ReportedSid = data.SerialId;
                    _this.ContactMethod = data.ContactMethod;
                    _this.RelatedAccount = data.RelatedAccount;
               
                    _this.reportImage = newInfo.ImageUrl;
                    var reported = data.ReportOrNot;
                    
                    //默认图片不举报
                   
					/*if(!hasImg(_this.reportImage)){
                        $("#reportImg").hide().next().hide();
                    }else{
                        //判断是否已举报
                        if(reported == 1){
                            $("#reportImg").hide().next().show();
                        }else{
                            $("#reportImg").show().next().hide();
                        }
                    }*/
                    
                }
            );    
           }catch(e){
               _this.logger.error("待更新联系人queryUpContactInfo异常" + e );
            } 
	},
	
	/**
	@更新单个联系人接口 点击左下角的“更新，处理下一个”时
	@param:
	@reutrn:
	*/
	mergeAndGoToNext: function(){
        var _this = this;
            _this.updateEditData(); //获取提交数据
      
        //手机和邮箱两个必须有一个并非两个都必填，所以不能限死，只能判断两个都为空的时候给提示 7.17
        if(IsEmpty(UpdateContacts.gContactsDetails.AddrFirstName) && IsEmpty(UpdateContacts.gContactsDetails.MobilePhone)){
            top.FF.alert(PageMsg.error_mainAddrEmpty);
        }
        if(!ValidateData(UpdateContacts.gContactsDetails)){ return false;}
      
        var param = new wu.SaveIncrimentParams();
            param.UserNumber = _this.getUid();
          
        //SaveIncrimentParams的嵌套对象（xml中的集合）
        var item = new wu.SaveIncrimentParamsItem();
            //必填字段
            item.SerialId = UpdateContacts.gContactsDetails.SerialId;
            item.AddrFirstName = encodeXML(UpdateContacts.gContactsDetails.AddrFirstName);
          
            //选填字段 对输入字段进行专业XML内容不能对空格进行转义，所以要使用encodeXML不能用htmlEncode
            item.FamilyEmail = encodeXML(UpdateContacts.gContactsDetails.FamilyEmail) || '';
            item.MobilePhone = encodeXML(UpdateContacts.gContactsDetails.MobilePhone) || '';
            item.ImageUrl = UpdateContacts.gContactsDetails.ImageUrl|| '';
            item.FamilyEmail =  encodeXML(UpdateContacts.gContactsDetails.FamilyEmail) || '';
            item.FamilyPhone =  encodeXML(UpdateContacts.gContactsDetails.FamilyPhone) || '';
            item.UserSex = UpdateContacts.gContactsDetails.UserSex || '';
            item.Birday =  UpdateContacts.gContactsDetails.Birday || '';
            item.OtherIm =  encodeXML(UpdateContacts.gContactsDetails.OtherIm) || '';
            item.HomeAddress =  encodeXML(UpdateContacts.gContactsDetails.HomeAddress) || '';
            item.CPName =  encodeXML(UpdateContacts.gContactsDetails.CPName) || '';
            item.UserJob =  encodeXML(UpdateContacts.gContactsDetails.UserJob) || '';
            item.BusinessEmail =  encodeXML(UpdateContacts.gContactsDetails.BusinessEmail) || '';
            item.BusinessMobile =  encodeXML(UpdateContacts.gContactsDetails.BusinessMobile) || '';
            item.BusinessPhone =  encodeXML(UpdateContacts.gContactsDetails.BusinessPhone) || '';
            item.CPAddress =  encodeXML(UpdateContacts.gContactsDetails.CPAddress) || '';
            item.CPZipCode =  encodeXML(UpdateContacts.gContactsDetails.CPZipCode) || '';
            param.ContactInfos.push(item);
            try{
                wu.Service.ProcessData(
                param,
                wu.ApiType.SaveIncrementalUpdatedInfo,
                function(res){

                    if(!res || res.ResultCode != 0) {
                        var msg = {
                            "21":  "更新失败，联系人数量已达上限",

                            "85": "生日格式不正确或是未来时间",

                            "224": "手机号码已存在",
                            "225": "商务手机已存在",
                            "226": "电子邮箱已存在",
                            "227": "商务邮箱已存在",

                            "12820": "手机号码格式不正确，请输入3-20位数字",
                            "12821": "商务手机格式不正确，请输入3-20位数字",

                            "12823": "电子邮箱格式不正确。应如zhangsan@139.com，长度6-90位",
                            "12824": "商务邮箱格式不正确。应如zhangsan@139.com，长度6-90位",

                            "12826": "常用固话格式不正确，请输入3-30位数字、-",
                            "12827": "公司固话格式不正确，请输入3-30位数字、-",

                            "12830": "传真号码话格式不正确，请输入3-30位数字、-",
                            "12833": "飞信号格式不正确，请输入3-30位数字、-",
                            "12834": "公司邮编格式不正确，请输入3-10位字母、数字、-或空格"
                        }[res.ResultCode];

                        top.FF.alert(msg || ErrorMsg["fail_update"]);//提示更新失败
                        return false;
                    }

                    _this.deal++;
                    
                    //更新缓存
                    var updataParam = {
                        info:UpdateContacts.gContactsDetails
                    }
                    top.Contacts.updateCache("EditContactsDetails",updataParam);
                    
                    $("#divOtherMessage").text(UpdateMsg["count_tip"].replace("$count$",_this.count)).show();
                    
                    if(_this.sum > _this.count){
                        _this.updateContatsInfo(); //合并完成一个的时候更新页面信息 
                        
                    }else{
                        top.FF.alert(UpdateMsg["deal_succ"].replace("$deal$",_this.deal),_this.goHomePage);
                    }

                    if(top.$Addr){
                        var master = top.$Addr;
                        master.trigger(master.EVENTS.LOAD_MODULE, {
                            key: 'events:contacts',
							actionKey: '320'
                        }); 
						
						setTimeout(function(){
							master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getUpdateData'});
						}, 1000);						
                    }

                });
            }catch(e){
               _this.logger.error("待更新联系人总数mergeAndGoToNext异常" + e );
          }
	     
	},
	
	/**
	@更新全部联系人接口
	@param:
	@reutrn:
	*/
	mergeAll: function(){
        var _this = this;
        function merge(){
            top.M139.UI.TipMessage.show("正在更新...");
            var param = new wu.SaveAllParams();
                param.UserNumber = _this.getUid();
            try{
                wu.Service.ProcessData(
                    param,
                    wu.ApiType.SaveAllUpdatedInfoResp,
                    function(res){
                        if(!res || res.ResultCode!=0){
                            top.FF.alert(ErrorMsg["fail_update"]);//提示更新失败
                            return false;
                         }
                        //top.Contacts.reload()//刷新联系人
                        top.$App.trigger("change:contact_maindata")
						top.M139.UI.TipMessage.hide();
                         
                        var dealNum = Number(_this.sum)-Number(_this.deletNum);
                        top.FF.alert(UpdateMsg["deal_succ"].replace("$deal$",dealNum),_this.goHomePage);

                        if(top.$Addr){
                            var master = top.$Addr;
                            master.trigger(master.EVENTS.LOAD_MODULE, {
                                key: 'events:contacts',
								actionKey: '321'
                            });
							
							setTimeout(function(){
								master.trigger(master.EVENTS.LOAD_MODULE, {key: 'remind:getUpdateData'});
							}, 1000);                           
                        }
                    });
                    
            }catch(e){
                 _this.logger.error("待更新联系人总数mergeAll异常" + e );
            }
     }
    
     top.FF.confirm(UpdateMsg["update_all"],merge);  
	},
	/**
	@返回通讯录
	@param:
	@reutrn:
	*/
	
   goHomePage:function(){ 
        setTimeout(function() {
            if(top.$Addr){                
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }else{
				top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
			}
        }, 0xff);		
	},
	
	/**
	@跳过更新此联系人接口
	@param:
	@reutrn:
	*/
	goToNextEvent: function(){
        var _this = this;
        $("#divOtherMessage").text(UpdateMsg["ignore_tip"].replace("$count$" ,_this.count )).show();
      
        if(_this.count == _this.sum){
            if(_this.deal>0){
                 top.FF.alert(UpdateMsg["ignore_deal_tip"].replace("$deal$" , _this.deal),_this.goHomePage);
            }else{
                top.FF.alert(UpdateMsg["ignore_gohomepage"],_this.goHomePage);
            }
        }else{
            _this.updateContatsInfo();
        }
	  
	},
	/**
	 * 当用户手动编辑了信息时更新已修改信息
	 */
	updateEditData:function(){
        //必须通过去input的值来给gContactsDetails赋值，因为联系人信息是可编辑的
        //必须取所以字段 否则隐藏字段的值会继续传到下个联系人信息里.filter(":visible");
        var inputAareEl = $("#newArea").children().find(":input");
		var inputId="";
		$.each(inputAareEl,function(){
			inputId =$(this).attr("id"); 
			UpdateContacts.gContactsDetails[inputId] = $("#"+inputId).val();
		});
        
        //name字段用于验证
        UpdateContacts.gContactsDetails["name"] = UpdateContacts.gContactsDetails["AddrFirstName"];
        UpdateContacts.gContactsDetails["ImageUrl"] = $("#newImgVal").val();
        UpdateContacts.gContactsDetails["SerialId"] = $("#SerialId").val();
        if($("#birthDay").parent().parent().is(":visible")){
            UpdateContacts.gContactsDetails["Birday"] = UpdateContacts.birthDay.getDateString();
        }
        
        if($("#UserSex").parent().parent().is(":visible")){
            UpdateContacts.gContactsDetails["UserSex"] = GetSex();
        }
    },
    
    //清空上一个待更新联系人信息
    updateContatsInfo:function(){
        var _this =this;
        
        //先清空上个联系人更新前信息
        if ($("#oldInfoTable").children()) {
            $("#oldInfoTable").children().remove();
        }
  
        //重置更新后联系人信息 hidden字段没法用reset必须手动清空
        document.getElementById("newInfoForm").reset();
		$("#newImgVal").val("");
		$("#SerialId").val("");
        
        //生日 和性别是组装字段 所以也必须手动清空 没必要delete
        UpdateContacts.gContactsDetails["UserSex"] = '';
        UpdateContacts.gContactsDetails["Birday"] = '';
        
        //records：分页参数 当有联系人被更新或者不再提示时 查询总数在变化 所以分页总数需随查询总数进行变化 当前人数加1还要减去已更新的人数（已更新+不在提示）
        var records = Number(_this.count) + 1 - Number(_this.deal) - Number(_this.deletNum);
        var page =  records? records : 1;       
        _this.queryUpContactInfo(page);
    },
    //不再提示
   neverPrompt: function(){
        var _this = this;
        function noprompt(){
            top.addBehaviorExt({actionId:101610,thingId:0,moduleId:14});
            var param = new wu.NeverPromptParams();
                param.UserNumber = _this.getUid();
                param.SerialId = $("#SerialId").val();
            try{
                wu.Service.ProcessData(
                    param,
                    wu.ApiType.NoRromptInfo,
                    function(res){
                        if(!res || res.ResultCode!=0){
                            top.FF.alert(UpdateMsg["sys_busy"]);//提示系统繁忙
                            return false;
                        }
                        _this.deletNum++ ;
                        if(_this.sum > _this.count){
                            _this.updateContatsInfo();
                            return false; 
                        }
                         
                        if(_this.deal>0){
                             top.FF.alert(UpdateMsg["ignore_deal_tip"].replace("$deal$" , _this.deal),_this.goHomePage);
                        }else{
                             _this.goHomePage();
                        }
                         
                    });
                    
                }catch(e){
					_this.logger.error("待更新联系人总数neverPrompt异常" + e );
                }
     }
     top.FF.confirm(UpdateMsg["no_prompt_update"],noprompt);  
    }, 
    //头像举报
    reportImg: function(){
        //行为日志
        if(!this.ContactMethod){return;}
        var param = "account=" + encodeURIComponent(this.ContactMethod) + "&mobile=" 
                    + this.RelatedAccount + "&reportImg=" + encodeURIComponent(UpdateContacts.reportImage)
                    + "&ReportedSid=" +  encodeURIComponent(UpdateContacts.ReportedSid);
        var url = "addr/addr_report.html?" + param;
            top.FloatingFrame.open("举报", url, 440, 250, true);
    },
    initReportPage: function(){
        this.bindReportEvent();
        //获取传递参数 账号 手机 图片地址  
        this.ContactMethod = decodeURIComponent(this.getUrlPrama("account",window.location.href));
        this.RelatedAccount = this.getUrlPrama("mobile",window.location.href);
        this.reportImage = decodeURIComponent(this.getUrlPrama("reportImg",window.location.href));
        this.ReportedSid = decodeURIComponent(this.getUrlPrama("ReportedSid",window.location.href));
        $("#reportUser").text(this.ContactMethod);
      
    },
    //举报提交
    reportSubmit:function(){
		var _this =this;
        var reportTypeEl = $("#reportType").find(":checkbox");
        var checkboxlen = reportTypeEl.length;
        var checkedValues =[];
        for(var i=0; i<checkboxlen; i++){
            checkedValues[i] = reportTypeEl[i].checked? reportTypeEl[i].value : "0";
        }
        var ReportType =checkedValues.join(""); 
        if(ReportType ==UpdateMsg["no_report_type"]){
            $("#chooseReportType").show();
            return false;
        }
        
        var reportInfo = $("#describeReport").val();
            reportInfo =  reportInfo !=UpdateMsg["report_default_des"]? reportInfo :"" ;

        var param = new wu.SaveAllParams();
            param.UserNumber = _this.getUid();
            param.ReportedNumber = _this.RelatedAccount;
            param.ReportedSid = _this.ReportedSid;
            param.ImageUrl = _this.reportImage; //图片地址不在这里转义
            param.ReportType = ReportType;
            param.ReportInfo =top.$Xml.encode(reportInfo);
         
        try{
          wu.Service.ProcessData(
            param,
            wu.ApiType.ReportImg,
            function(res){
                if(!res || res.ResultCode!=0){
                   top.FF.alert(UpdateMsg["report_erro"],function(){top.FF.close();});//提示更新失败 
                    return false;
                }
                top.FloatingFrame.setWidth(420,"px");
                top.FloatingFrame.setHeight(130,"px")
                location.href = top.location.protocol + '//' + top.location.host + '/m2012/html/addr/addr_reportsuccess.html';
                var el = top.$('#addr').contents().find('#addr_main').contents().find('#reportImg');
                el.hide().next().show();
            });
            
        }catch(e){
          _this.logger.error("待更新联系人总数reportSubmit异常" + e );
        }
    },
    bindReportEvent:function(){
        //输入框获取焦点 失去焦点时默认值显示控制
        $("#describeReport").focus(function(){
           if ($(this).val() == UpdateMsg["report_default_des"]) {
               $(this).val("");
           }
        });
        $("#describeReport").blur(function(){
          if(IsEmpty($(this).val()) ){
             $(this).val(UpdateMsg["report_default_des"]);
          }
        });
        
        //取消举报
        $("#cancelReport").click(function(){
			top.FF.close();//关闭弹出窗口
         });
         
         //举报
         $("#reportSubmit").click(function(){
            top.addBehaviorExt({actionId:101617,thingId:0,moduleId:14});
            UpdateContacts.reportSubmit();
         });
         //举报类型选择框事件
         $("#reportType").find(" :checkbox").click(function(){
            $("#chooseReportType").hide();
         });
	
    }
    
}; 

//验证数据合法性
function ValidateData(gContactsDetails){
    var c = new top.ContactsInfo();   
    for(var i in gContactsDetails){
        if (typeof(gContactsDetails[i]) =='string') c[i] = gContactsDetails[i];
    }
    var r = c.validateDetails();
    if(r.success){
        return true;
    }else{
        r.errorProperty = IsEmpty(r.errorProperty) ? "" : r.errorProperty;
        switch($.trim(r.errorProperty.toLowerCase())){
            case "name":
                top.FF.alert(r.msg,function(){
                    $("#AddrFirstName").focus();
                });
                break;
            case "familyemail":
               top.FF.alert(r.msg,function(){
                    $("#FamilyEmail").focus();
                });
                break;
            case "businessemail":
                 top.FF.alert(r.msg,function(){
                    $("#BusinessEmail").focus();
                });
                break;
			case "familyphone":
                   top.FF.alert(PageMsg['warn_fieldFamilyPhone'],function(){//此处r.msg="电话号码格式不正确"要替换为"常用固话格式不正确“
                    $("#FamilyPhone").focus();
                });
                break;
            case "zipcode":
                gContactsDetails.ZipCode = "";return true;
                break;
            case "cpzipcode":
               top.FF.alert(r.msg,function(){
                      $("#CPZipCode").focus();
                });
                break;
            default:
                    top.FF.alert(r.msg);
                    break;
        }
        return false;
    }
}

function IsEmpty(code) {
    if(typeof(code) == "undefined" || code == null || code.length == 0) return true;
    return false;
}

function GId(id){
    return document.getElementById(id);
}


function setImg(imgEl,imgUrl){
	GId(imgEl).src =getContactImage(imgUrl);
}
function hasImg(imgurl){
	
     //var sysImgPath = ["/system/nopic.jpg","/photo/nopic.jpg","/images/face.png","/addr/apiserver/"];
     var sysImgPath = ["/system/nopic.jpg","/photo/nopic.jpg","/images/face.png"];
	 var lowerImgUrl = imgurl.toLowerCase();
    // if (!IsEmpty(imgurl) && lowerImgUrl.indexOf(sysImgPath[1])<0 && lowerImgUrl.indexOf(sysImgPath[0])< 0 && lowerImgUrl.indexOf(sysImgPath[2])<0&& lowerImgUrl.indexOf(sysImgPath[3])<0 ) {
     if (!IsEmpty(imgurl) && lowerImgUrl.indexOf(sysImgPath[1])<0 && lowerImgUrl.indexOf(sysImgPath[0])< 0 && lowerImgUrl.indexOf(sysImgPath[2])<0) {
         return true;
     }else{
         return false;
     }
}
function getContactImage(imgurl){
       var result='';
       if(hasImg(imgurl)){
            imgurl = imgurl.replace('upload', 'Upload');
            imgurl = imgurl.replace('photo', 'Photo');
           result= (new top.M2012.Contacts.ContactsInfo({ImageUrl: imgurl})).ImageUrl;
       }else{
           result= top.resourcePath + "/images/face.png";
       }
	   return result;
    }
//获取性别
function GetSex(){ 
    if(GId("UserSex"+"0").checked) return GId("UserSex"+"0").value;
    if(GId("UserSex"+"1").checked) return GId("UserSex"+"1").value;
    if(GId("UserSex"+"2").checked) return GId("UserSex"+"2").value;
}

//设置联系人性别 0- 男 1- 女 2- 保密
function SetContactSex(sex){
    switch(parseInt(sex,10)){
    case 0:
        GId("UserSex0").checked = true;
        break;
    case 1:
        GId("UserSex1").checked = true;
        break;
    default:
        GId("UserSex2").checked = true;
        break;
    }
}
