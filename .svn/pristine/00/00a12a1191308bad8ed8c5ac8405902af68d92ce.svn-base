/*global ADDR_I18N: false, top: false, window: false, Utils:false */

//尽可能聚合顶层的对象;
var Pt = {

    sid: top.$App.getSid(),
    $U: top.$Url,
    $RM: top.$RM,
    $Cookie: top.M139.Text.Cookie,
    $T: top.$T,
    UI_Menu: top.M2012.UI.ListMenu,
    loadStatus: false,
    loadNum: 100,
    alert: function() {
        top.$Msg.alert.apply(top.$Msg, arguments);
    },

    confirm: function(){
        top.$Msg.confirm.apply(top.$Msg, arguments);
    },

    parent: function() {
        return top;
    },

    param: function(key) {
        return this.parent().$Url.queryString(key, location.href);
    },

    htmlEncode: function(str) {
        return $T.Html.encode(str);
    },
 
    cookie: function() {
        if (arguments.length === 2) {
            this.$Cookie.set({name: arguments[0], value: arguments[1]});
        } else {
            this.$Cookie.get(arguments[0]);
        }
    },

    doCommand: function() {
        this.parent().$App.doCommand.apply(this.parent().$App, arguments);
    },

    callOldApi: function(option) {
        var api = "/g2/addr/apiserver/" + option.action;
        var params = option.param || {};
        params.sid = this.sid;

        var _url = this.$U.makeUrl(api, params);

        this.$RM.call(_url, {}, function(json) {
            json = json.responseData;
            if (json.ResultCode == 0) {
                $.isFunction(option.success) && option.success(json);
            } else {
                $.isFunction(option.error) && option.error(json);
            }
        });
    },

    encodeXML:function(text){
        return top.$T.Xml.encode(text);
    },

    transformPhotoUrl: function(imagePath){
        return new top.M2012.Contacts.ContactsInfo({ImageUrl: imagePath}).ImageUrl;
    }
};



if (window.ADDR_I18N) {
    var PageMsg = ADDR_I18N[ADDR_I18N.LocalName].detail;
}

//Declare global variables (add-FavoWord-5.16 pyh)
var gContactsData = {"name": "", "FavoWord": "", "FamilyEmail": "", "OtherEmail": "", "MobilePhone": "", "FamilyPhoneBrand": "",
                     "FamilyPhoneType": "", "OtherMobilePhone": "", "OtherPhoneBrand": "", "OtherPhoneType": "", "OtherPhone": "",
                     "OtherFax": "", "GroupId": "", "ImageUrl": "", "AddrNickName": "", "UserSex": "", "BirDay": "", "StartCode": "",
                     "BloodCode": "", "OtherIm": "", "OICQ": "", "MSN": "", "PersonalWeb": "", "Memo": "", "FamilyPhone": "",
                     "FamilyFax": "", "ProvCode": "", "CityCode": "", "HomeAddress": "", "ZipCode": "", "CPName": "", "UserJob": "",
                     "BusinessEmail": "", "BusinessMobile": "", "BusinessPhoneBrand": "", "BusinessPhoneType": "", "BusinessPhone": "",
                     "BusinessFax": "", "CPProvCode": "", "CPCityCode": "", "CPAddress": "", "CPZipCode": "", "CompanyWeb": ""};

var gContactInfoKey = [["name", "FamilyEmail", "MobilePhone", "FamilyPhoneBrand", "FamilyPhoneType", "OtherPhone"],
                      ["ImageUrl", "UserSex", "BirDay", "Memo"],
                      ["ProvCode", "CityCode", "HomeAddress"],
                      ["CPName", "UserJob", "BusinessEmail", "BusinessMobile", "BusinessPhone", "BusinessFax",
                       "CPProvCode", "CPCityCode", "CPAddress", "CPZipCode", "OtherIm"]];
var gIsMyDetails = false,   //当前是否为我的资料
	gAddNewContactSuccess = false,
	gContactsGroups,
    updateFileds = [],
	gContactsDetails = new top.ContactsInfo(gContactsData),
	gContactsObject = window.top.Contacts,
	frmInfoOnLoad = function (obj) {};


//Global base function
function GId(id){
     return document.getElementById(id);
}

function IsEmpty(code) {
     if(typeof(code) == "undefined" || code == null || code.length == 0) return true;
     return false;
}

//判断是名片还是详细信息
function IsCard() {
     var _type = Pt.param ("type");
     if (IsEmpty(_type)) {
         return false;
     }
     return /^(my)?businesscard$/i.test(_type);
}

//判断是本人名片还是联系人名片
function IsMyCard(){
     if (Pt.param ("type") && Pt.param ("type").toLowerCase() == "mybusinesscard") {
         return true; 
     }else{
         return false;
   }
}

//判断是否已将名片设置为默认签名

//名片编辑状态显示控制
function EditAreaShow(){
    var Els = $("#cardContent").children().find(":input");
    $.each(Els,function(){//隐藏显示区域
			$(this).show().next().hide().parent().parent().show();
	});
    $("#uploadButton").show();//显示图片上传
    $("#fileUpload").show();
    var favoriteWord = $("#FavoWord");
    var name = $("#name");
    
    //按钮域控制
    $("#btnSave").parent().show().siblings().hide();
    $("#btnCancelEdit").parent().show();
     
    $("#bottombtnSave").parent().show().siblings().hide();
    $("#bottombtnCancelEdit").parent().show();

     //本人电子名片个性签名设置      
    if(IsMyCard()){
        if(IsEmpty(favoriteWord.val())){
             favoriteWord.val("[个性签名]");
             favoriteWord.css("color","gray");
         }
         
        if(IsEmpty(name.val())){
            name.val("姓名").css("color","gray"); 
        }
        top.addBehaviorExt({actionId:101261,thingId:0,moduleId:14});
         
    }else{
        favoriteWord.hide().parent().hide().parent().hide();
        top.addBehaviorExt({actionId:101263,thingId:0,moduleId:14});
    } 

   $("#infoNotComplete").hide(); //编辑时隐藏提示信息
  
}

//电子名片读取状态显示控制
function EditAreaHide(){   
    var validEmNum = 0; //电子名片 信息少于三条是显示完善资料提示
    var Els = $("#cardContent").children().find("em");
    
    $.each(Els,function(){
    	if(IsEmpty($(this).text())){
    	      $(this).prev().parent().parent().hide();// 不是所有的inupt em都在table里面
    	   }else{
    		 $(this).show().prev().hide().parent().show().parent().show();
             validEmNum++;
    	   }
    });
    
    $("#cardContentArea").css("display",""); //显示整个框
    $("#divToolBar").css("display","");
    $("#bottomdivToolBar").css("display","");
    $("#uploadButton").hide();//隐藏图片上传
    $("#fileUpload").hide();
    //按钮域控制
    $("#btnSave").parent().siblings().show().end().hide();
    $("#btnCancelEdit").parent().hide();
    
    $("#bottombtnSave").parent().siblings().show().end().hide();
    $("#bottombtnCancelEdit").parent().hide();
    
    var aDefSign =$("#aDefSign");
    var bottomaDefSign = $("#bottomaDefSign");
	
    //只有本人电子名片有设置为默认签名
	if(IsMyCard()){
        var cardsign = ContactModule.CardSignInfo();
        var IsCardDefaultSign = cardsign? cardsign.isDefault : 0;console.log(IsCardDefaultSign);
        var defaultSignText = IsCardDefaultSign == 0?  PageMsg["set_card_sign"] : PageMsg["cancel_card_sign"];
           bottomaDefSign.attr("title",defaultSignText).find("span").text(defaultSignText).end().parent().show(); //修改显示的时候修改title
            aDefSign.attr("title",defaultSignText).find("span").text(defaultSignText).end().parent().show();
      
    }else{
        aDefSign.parent().hide();
        bottomaDefSign.parent().hide();
       }    
      
      //提示信息设置
    if (validEmNum >3&& !IsEmpty(GId("name").value) && !IsEmpty(GId("MobilePhone").value) && !IsEmpty(GId("FamilyEmail").value)) {
        $("#infoNotComplete").hide();
    }else{
        var tipStr = IsMyCard()? PageMsg["self_empty_tip"] :PageMsg["other_empty_tip"];
        $("#infoNotComplete").html(tipStr).show(); 
    }
       
    validEmNum = 0;
 }


function GetURL(name){
    name = $.trim(name.toLowerCase());
    var url = "";
    switch(name){
    case "contact":
        url =  "/addr/matrix/newcontactdetails.htm";//5.16 old-contactdetails.htm
        break;
    case "uplodimage":
        url =  "/addr/apiserver/uploadcontactimage.aspx";
        break;
    case "loadimg":
        url = "/addr/apiserver/httpimgload.ashx";
        break;
    default:
        break;
    }
    if(!IsEmpty(url))
        url = top.ucDomain + url + "?sid=" + top.$App.getSid();
    return url;
}

//获取性别
function GetSex(){ 
    if(GId("UserSex"+"0").checked) return GId("UserSex"+"0").value;
    if(GId("UserSex"+"1").checked) return GId("UserSex"+"1").value;
    if(GId("UserSex"+"2").checked) return GId("UserSex"+"2").value;
}

//2012.5.11 设置联系人姓名 在fillData()调用
function SetTopContactName(contactName){
    if(contactName){
       $("#tipContentName").text(" － " + contactName);
    }
}

//设置名片字段值
function SetInputValue(el,value){
	if(!el){return;}
	el.value = value || "";
}

//设置名片显示值
function SetSpanText(el,text){
  if(!el){return;}
  var _text = text || "";
  $(el).text(_text);
}

//设置名片头显示
function SetCarTitile(cardTitle){
    if(cardTitle) {
        $("#spanDetailsTitle").text(cardTitle);
    }
}
//设置省份
function SetProvince(provinceobj,provinceval) {
    if(!provinceobj) return;
    if (provinceobj.options != null){
        provinceobj.length = 0;
		for (var i = 0; i < ProvinceArray.length; i++){ 
			if (ProvinceArray[i][2] == '86'){  
				provinceobj.options[provinceobj.length] = new Option(ProvinceArray[i][0], ProvinceArray[i][1]);
				if(!IsEmpty(provinceval) && $.trim(ProvinceArray[i][0]) == $.trim(provinceval))
			        provinceobj.options[i].selected = true;
			}     
		}
		if(IsEmpty(provinceval))
		    provinceobj.options[provinceobj.length-1].selected = true;
    }    
} 
//设置城市
function SetCity(cityobj,provinceobj,cityval) {
	if(!(cityobj || provinceobj)) return;
	var pval = provinceobj.value;
	if (cityval && cityval.indexOf('市') == cityval.length-1){
		cityval = cityval.substring(0, cityval.length-1);
	}
	if (cityobj.options != null){
		cityobj.length = 0;
		if(pval != '-1'){
			for (var i = 0,j = 0; i < CityArray.length; i++){
				var city = CityArray[i];
				if (city[1] == pval){  
					cityobj.options[cityobj.length] = new Option(city[0], city[2]);
					if(!IsEmpty(cityval) && $.trim(city[0]) == $.trim(cityval)){
				        cityobj.options[j].selected = true;
				    }
				    j++;
				}
			}
		}
		else{
		    cityobj.options[0]  = new Option('城市', '-1');
		}
	}    
}
//构造下拉框
function AddDropDownListItem(obj,optionsArray,val) { 
    if (obj && optionsArray.length > 0 && obj.options != null){
	    obj.length = 0; 
	    var selectIndex = -1;
	    for (var i = 0; i < optionsArray.length; i++) { 
		    obj.options[obj.length] = new Option(optionsArray[i][0], optionsArray[i][1]); 
		    if(val && obj.options[i].value == val) 
		        selectIndex = i;
	    }
	    if(selectIndex == -1){
		    obj.options[obj.length-1].selected = true;
	    }else{
		    obj.options[selectIndex].selected = true;
	    }
	}
}


//设置联系人分组
function BindContactGroups(ContainerObj, gid){
    //获取联系人组信息
    try{
        gContactsGroups = gContactsObject.data.groups;
    }catch(e){}
    if(ContainerObj && gContactsGroups && gContactsGroups.length > 0) {
        var gidArray = "";
        if(!IsEmpty(gid)) gidArray = gid.split(",");
        var htmlCode = "";
        try{
            for(var i = 0; i < gContactsGroups.length; i++){
                htmlCode += "<li><label for=\"Chk" + gContactsGroups[i].GroupId + "\">";
                htmlCode += "<input id=\"Chk" + gContactsGroups[i].GroupId + "\" value=\"" + gContactsGroups[i].GroupId + "\" type=\"checkbox\" ";
                for(var j = 0; j < gidArray.length; j++){ 
                    if(gContactsGroups[i].GroupId == gidArray[j])
                        htmlCode += " checked=\"checked\" ";
                }
                htmlCode += " />" + Pt.htmlEncode(gContactsGroups[i].GroupName) + "</label></li>";
            }
        }catch(e){}
        ContainerObj.innerHTML = htmlCode;
    }
    GId("ChkNewGroupId").checked = false;
    $("#NewGroupName").val("新建组名");
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
//获取联系组ID
function GetGroupId(){
    var groupId = "";
    if(!IsEmpty(gContactsGroups)) {
        var obj;
        for(var i = 0; i < gContactsGroups.length; i++){
            obj = GId("Chk" + gContactsGroups[i].GroupId);
            if(obj && obj.checked){
                groupId += obj.value + ",";
            }
        }
        groupId = groupId.length > 0 ? groupId.substring(0, groupId.length - 1) : "";
    }
    return groupId;
}
//显示查看往来邮件按钮
function ShowTraffic(){
    if(!IsEmpty(gContactsDetails.FamilyEmail) || !IsEmpty(gContactsDetails.OtherEmail) || !IsEmpty(gContactsDetails.BusinessEmail)){
        $("#aSearchEmails,#bottomaSearchEmails").show(); 
    }else{
        $("#aSearchEmails,#bottomaSearchEmails").hide(); 
    }
}

//判断数组arr中是否包含value
function IsContains(arr, value){
    if(arr.length > 0){
        for(var i = 0; i < arr.length; i++){
            if(value == arr[i])
                return true;
        }
    }
    return false;
}

//往来邮件
function getTraffic(){        
    top.$Msg.confirm('查看往来邮件，未保存的内容将丢失，确定跳转？', function(){
        var emails = new Array();
        if(!IsEmpty(gContactsDetails.FamilyEmail) && !IsContains(emails,gContactsDetails.FamilyEmail))
            emails.push(gContactsDetails.FamilyEmail);
        if(!IsEmpty(gContactsDetails.OtherEmail) && !IsContains(emails,gContactsDetails.OtherEmail))
            emails.push(gContactsDetails.OtherEmail);
        if(!IsEmpty(gContactsDetails.BusinessEmail) && !IsContains(emails,gContactsDetails.BusinessEmail))
            emails.push(gContactsDetails.BusinessEmail);
        
       
       var searchStr = $.trim(emails.join(" "))? $.trim(emails.join(" ")) : gContactsDetails.name;
        Pt.doCommand("showTraffic",{email: searchStr});
    });
}

//预览选择图片
function ImageView(){
    var fileEl = GId("fileUpload");
    var delEl = GId("btnDelImage");
    var imgEl =  GId("ImageUrl");
    if(!ValidImage(fileEl)){
       GId("frmUpload").reset();
       return;
    }
    if(!IsCard()){
       if(IsEmpty(fileEl.value))     
          delEl.disabled = true; 
       else
          delEl.disabled = false;
     }  
     
    //只有IE6支持本地图片浏览
    if ($.browser.msie &&  $.browser.version < 7) {
        GimgEl.src = GId("fileUpload").value;
    }else if($.browser.mozilla && fileEl.files){
        imgEl.src= fileEl.files.item(0).getAsDataURL();
    }else{
        imgEl.src = resourcePath + "/images/haspic.png";
    }

}
//设置联系人头像
function SetContactImage(imgurl) {
    GId("ImageUrl").src = imgurl;
}


//联系人图像
function ValidImage(obj){
    if(!obj) return false;
	var fileName = $.trim(obj.value);
	if(fileName.length == 0) return false;
	
	var fileFormat = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
	var picFormatArr = ["gif","jpg","jpeg","png","bmp"];
	var flag = false;
	for(var i = 0; i < picFormatArr.length; i++){
	    if(fileFormat == picFormatArr[i])
	        flag = true;
	}
	if (!flag){
		top.FloatingFrame.alert(PageMsg['warn_picformat']);
		GId("frmUpload").reset();
		return false;
	}
	return true;
}

//上传图片
function UploadImage(){
	gContactsDetails.ImagePath = document.getElementById("oldImageUrl").value;
	if(!(gContactsDetails.SerialId > -1)){//添加资料的时候
		gContactsDetails.ImageUrl = document.getElementById("oldImageUrl").value;
	}
	updateFileds.push("ImageUrl");
	SaveDataAPI();//此处可能引起两次保存数据
	return;
	//下面的不要了
    if(!ValidImage(GId("fileUpload"))) {
        GId("frmUpload").reset();
        return;
    }
    
    var oldpath = IsEmpty(gContactsDetails.ImagePath) ? "" : gContactsDetails.ImagePath;
    GId("funcid").value = "upload";
    GId("oldImageUrl").value = oldpath;
    GId("frmUpload").action = GetURL("uplodimage");

    if(!IsMyCard()){
        //unreserved=true 就是删除原图片 只有操作联系人的时候才删除unreserved只在详细信息页里有
        GId("unreserved").value = true;
    }

    top.WaitPannel.show("图片上传中...");
    frmInfoOnLoad = function (obj){
        
        top.WaitPannel.hide();

        var errCode = "";
        var oldImageUrl = "";

        if(obj.contentWindow && obj.contentWindow.document.getElementById("errCode")){
            errCode     = obj.contentWindow.document.getElementById("errCode").value;
            oldImageUrl = obj.contentWindow.document.getElementById("oldImageUrl").value;
        }else{
            errCode     = "";
            oldImageUrl = "";
        }
        //状态值:  1001-上传失败  1005-数量超过限制  1006-获取配置信息失败  
        switch(errCode){
            case "1000"://上传成功
                gContactsDetails.ImagePath = oldImageUrl //先使用原始路径保存
                updateFileds.push("ImageUrl");
                SaveDataAPI();//此处可能引起两次保存数据
                break;
            case "1002"://文件格式不对
                top.FloatingFrame.alert(PageMsg['warn_picformat']);
                break;
            case "1003"://未上传文件
                top.FloatingFrame.alert(PageMsg['warn_nopic']);
                break;
            case "1004"://大小超过限制
                top.FloatingFrame.alert(PageMsg['warn_fileSizeOver']);
                break;
            default:
                top.FloatingFrame.alert(PageMsg['fail_uploadPic']);
                break;
        }
        //再转换成图片接口路径来显示
        gContactsDetails.ImagePath = oldImageUrl;
        gContactsDetails.ImageUrl = Pt.transformPhotoUrl(oldImageUrl);
        SetContactImage(gContactsDetails.ImageUrl);
        GId("frmUpload").reset();
    };
     $("#frmUpload").submit();
	 }
//删除联系人头像
function DeleteImage(imgurl){
	if(gContactsDetails.SerialId == "-1" || imgurl.length == 0){
		SetContactImage("");
		GId("frmUpload").reset();
	}else {
       if(IsCard()){ContactModule.updateCardData();}else{ContactModule.updateData();} //更新名片或者详细信息
        if(ValidateData()){
            top.FloatingFrame.confirm(PageMsg['warn_delPic'],function(){
                gContactsDetails.ImageUrl = "";
                if(gIsMyDetails){//修改用户个人资料
                    try{
                        gContactsObject.AddUserInfo(gContactsDetails, function(result){
                            if(result.success){
                                DeleteServerImage(imgurl);
                            }
                            else{
                                gContactsDetails.ImageUrl = imgurl;
                                top.FloatingFrame.alert(result.msg);
                            }
                        });
                    }catch(e){}
                }else{
                    try{
                        gContactsObject.editContactDetails(gContactsDetails,function(result){
                            if(result.success){
                                DeleteServerImage(imgurl);
                            }
                            else{
                                gContactsDetails.ImageUrl = imgurl;
                                top.FloatingFrame.alert(result.msg);
                            }
                        });
                    }catch(e){}
                }
            });
        }
    }
}
//删除服务器上头像
function DeleteServerImage(imgurl){
    GId("funcid").value = "delete";
    GId("oldImageUrl").value = imgurl;
    GId("frmUpload").action = GetURL("uplodimage") + "&rnd=" + Math.random();
    
    frmInfoOnLoad = function (obj){
        var errCode = "", oldImageUrl = "";
        
        try {
            obj.contentWindow.scrollTo(0,0);
        } catch (ex) {
            top.FF.alert(PageMsg['fail_uploadPic']);
            return ;
        }

        if(obj.contentWindow && obj.contentWindow.document.getElementById("errCode")){
            errCode     = obj.contentWindow.document.getElementById("errCode").value;
            oldImageUrl = obj.contentWindow.document.getElementById("oldImageUrl").value;
        }else{
            errCode     = "";
            oldImageUrl = "";
        }
        /*状态值:  2000-删除成功 2001-没有对应的文件  2002-删除失败  2003-删除非法 */
        switch(errCode){
        case "2003":
        case "2001":
        case "2000": //删除成功
            gContactsDetails.ImagePath = "";
            gContactsDetails.ImageUrl = Pt.transformPhotoUrl("");
            SetContactImage(gContactsDetails.ImageUrl);
            top.FloatingFrame.alert(PageMsg['info_delsuccess']);
            break;
        default:
            gContactsDetails.ImageUrl = GId("oldImageUrl").value;
            SetContactImage(gContactsDetails.ImageUrl);
            if(gIsMyDetails){//恢复个人资料图片
                try{
                    gContactsObject.AddUserInfo(gContactsDetails, function(result){
                        top.FloatingFrame.alert(PageMsg['fail_delPic']);
                    });
                }catch(e){}
            }else{
                try{
                    gContactsObject.editContactDetails(gContactsDetails,function(result){
                        top.FloatingFrame.alert(PageMsg['fail_delPic']);
                    });
                }catch(e){}
            }
            break;
        }
    };
    document.frmUpload.submit();
}

//验证数据合法性
function ValidateData(){
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
                top.FloatingFrame.alert(r.msg,function(){
                    $("#name").focus();
                });
                break;
            case "familyemail":
                top.FloatingFrame.alert(PageMsg['warn_fieldformat'].replace("$field$", "常用邮箱地址") ,function(){
                    $("#FamilyEmail").focus();
                });
                break;
            case "otheremail":
                top.FloatingFrame.alert(PageMsg['warn_fieldformat'].replace("$field$", "常用邮箱地址"),function(){
                    $("#liOtherEmail").show();
                    $("#OtherEmail").focus();
                });
                break;
            case "businessemail":
                top.FloatingFrame.alert(PageMsg['warn_fieldformat'].replace("$field$", "商务邮箱地址"),function(){
                    $("#BusinessEmail").focus();
                });
                break;
            case "zipcode":
                gContactsDetails.ZipCode = "";return true;
                break;
            case "cpzipcode":
                top.FloatingFrame.alert(PageMsg['warn_fieldformat'].replace("$field$", "公司邮编"),function(){
                    if (ContactBean.IsDetailCollapsed && !IsCard()){//电子名片不用
                         ContactBean.ToggleDeteil();
                      }
                  $("#CPZipCode").focus();
                });
                break;
            default:
                if (!IsCard()) {
                    top.FloatingFrame.alert(r.msg);
                    break;
                }

                var cardProperty = ["FamilyEmail", "MobilePhone", "OtherPhone", "BusinessFax", "CPZipCode"];
                if ( /[(email)|(phone)|(fax)]$/i.test(r.errorProperty) && $.inArray(r.errorProperty, cardProperty) == -1 ) {
                    return true; //如果是名片页，并且是不显示的字段，则强制跳过前端较验，免得无法修改到正确。
                } else {
                    top.FloatingFrame.alert(r.msg);
                }
        }
        return false;
    }
}
/********************************* 名片模块 **************************/

function NewSetCardData(){
    //需要先updateData
    if(IsMyCard()){
        SetCarTitile("我的电子名片");
    }else{
        SetCarTitile(gContactsDetails["name"]+"电子名片");
    }
    
	var inputElId ="";
    var emCount=0;
    var inputEls = $("#cardContent").children().find(":input");
	$.each(inputEls,function(i,n){
	    inputElId = $(n).attr("id");
		SetInputValue(GId(inputElId),gContactsDetails[inputElId]);
		var emEl = $(this).next();
		SetSpanText(emEl,gContactsDetails[inputElId]);
	});
	  getPhotoUploadedAddr = function() {
			var tmpurl = location.host;
			var url = "";
			if(gContactsDetails.ImageUrl.indexOf(".com") > -1 || gContactsDetails.ImageUrl.indexOf(".cn") > -1){
				return "";
			}
			if (tmpurl.indexOf("10086.cn") > -1 && top.$User.isGrayUser()) {
				url = "http://image0.139cm.com";
			} else if(tmpurl.indexOf("10086.cn") > -1 && !top.$User.isGrayUser()) {
				url = "http://images.139cm.com";
			} else if (tmpurl.indexOf("10086ts") > -1) {
				url = "http://g2.mail.10086ts.cn";
			}else if(tmpurl.indexOf("10086rd") > -1){
				url = "http://static.rd139cm.com";
			}
			return url;
	}
	  //设置联系人头像
      SetContactImage(getPhotoUploadedAddr() + gContactsDetails.ImageUrl + '?rd=' + Math.random());
      //隐藏编辑区
      EditAreaHide();
}

//联系人功能模块
var ContactBean = {
    ENABLE_OVERWRITE: '1',
    C: window.top.Contacts,
    //保存自已的个人资料
    SaveMyself: function() {
		top.M2012.Contacts.getModel().UserInfoData = null; //修改资料要清楚缓存，否则读取数据的时候不会取得最新数据
        var _contact = $.extend({}, gContactsDetails);
        _contact.ImageUrl = _contact.ImagePath || "";

        if (ContactModule.MyDetailIsEmpty) {
            this.C.AddUserInfo(_contact, function(result) {
                if (result.success) {
                    NewSetCardData();
                } else {
                    top.FloatingFrame.alert(result.msg);
                }
            });
        } else {
            
            if(_contact.name){
                 _contact.AddrFirstName = _contact.name;
            }
        	var request = [];
        	    request.push("<ModUserInfo>");
        	    request.push("<UserNumber>");
        	    request.push(top.$User.getUid());
        	    request.push("</UserNumber>");
        	for(var i = 0; i< updateFileds.length; i++){
        		var realValue = Pt.encodeXML(_contact[updateFileds[i]]) || "";
        		request.push("<");
        		request.push(updateFileds[i]);
        		request.push(">");
        		request.push(realValue);
        		request.push("</");
        		request.push(updateFileds[i]);
        		request.push(">");
        	}
        	request.push("</ModUserInfo>");
        	request = request.join('');
            updateFileds = [];

            this.C.ModUserInfoIncrement(request, function(result) {
                if (result.success) {
					$D.storage.remove("mail139_addr_homedata"); //我的电子名片 保存成功后调用2012.11.07
					NewSetCardData();
                    //个人电子名片修改成功后如果签名存在需要同步更新默认签名
                    var defaultSign = ContactModule.CardSignInfo();
                    
					if(!IsEmpty(defaultSign)){
                       var IsDefault = defaultSign.isDefault != 1
                       ContactModule.setDefaultSign(IsDefault);
                     }                    
                } else {
                    top.FloatingFrame.alert(result.msg);
                }
            });
        }
    },

    //保存添加的联系人
    Add: function() {
        gContactsObject.addContactDetails(gContactsDetails, function(result) {
            if (result.success) {                
                gContactsDetails.SerialId = result.SerialId;
                gAddNewContactSuccess = true;

                /*
                if (gContactsDetails.FamilyEmail != "") {
                   Pt.parent().$Msg.confirm(
                        "",
                        function(){ 
                            Pt.parent().$App.show("compose", null, { inputData: {
                                type: 'customExtMail',
                                templateid: 'm2012.contacts.tellnew201311',
                                args: {
                                    contactemail: gContactsDetails.FamilyEmail,
                                    contactname: gContactsDetails.name
                                }
                            }});

                            var pageId = Pt.param("pageId");
                            pageId = pageId ? '&pageId='+pageId : '';
                            anchorLocal("addr_detail.html?type=edit&id=" + result.SerialId + pageId);//重要，返回当前页并加载

                            Pt.parent().BH('addr_detail_tellother');
                        },
                        function(){
                            returnToContactsList(true);//回通讯录首页
                        },
                        {
                         buttons: [" 告知好友 ", "去通讯录首页"],
                         title: PageMsg['info_tellother']
                     });
                 } else {
                    Pt.parent().$Msg.confirm(
                        "",
                        function(){ 
                            var pageId = Pt.param("pageId");
                            pageId = pageId ? '&pageId='+pageId : '';                            
                            anchorLocal("addr_detail.html?type=edit&id=" + result.SerialId + pageId);//重要，返回当前页并加载
                        },
                        function(){
                            returnToContactsList(true);//回通讯录首页
                        },
                        {
                         buttons: [" 确定 ", "去通讯录首页"],
                         title: "保存成功"
                     });
                 }
                 */
                //更新组信息和通讯录主架构信息
                top.BH('addr_newContacts_success');
                top.M139.UI.TipMessage.show('保存成功', {delay: 1000});
                loadData(result, addContacts);
                returnToContactsList(true);
            } else {
				switch(result.resultCode){
					case "224" :
					case "225" :
					case "226" :
					case "227" :{
						 var msg = result.msg + "，是否覆盖？";
						ContactBean.ReWrite(result.SerialId,msg,true);
						break;
					}
					default:{
						top.FloatingFrame.alert(result.msg || '服务器连接超时!');
						break;
					}
				
				}
			}
        });
    },

    //保存对联系人的修改
    Edit: function(contact) {
        var _contact = $.extend({}, contact);
        _contact.ImageUrl = _contact.ImagePath || "";        
        gContactsObject.editContactDetails(_contact, function(result) {
            if (result.success) {             
                if (result.newGroupId && result.newGroupName) {
                    gContactsDetails["GroupId"] += "," + result.newGroupId;
                    gContactsDetails["AddGroupName"] = "";
                    BindContactGroups(GId("GroupsContainer"), gContactsDetails["GroupId"]);
                }
               
                 if(IsCard()){//编辑名片直接刷新名片
					top.FloatingFrame.alert(PageMsg['info_savesuccess'],NewSetCardData);
                }
                /*
                 else {

                 top.$Msg.confirm("", function() {
                     if(!gContactsDetails["newRewrite"]) {
                         return false; //编辑在本页
                     }
                     //新建 时强制覆盖 需要重新加载联系人信息
                     var pageId = Pt.param("pageId");
                     pageId = pageId ? '&pageId=' + pageId : '';                                          
                    anchorLocal("addr_detail.html?type=edit&id=" + gContactsDetails.SerialId + pageId);
                 }, function() {
                     returnToContactsList(true); //回通讯录首页                     
                 }, {
                     buttons: [" 确定 ", "去通讯录首页"],
                     //按钮文本，支持3个按钮，默认为2个按钮，即["确定","取消"]
                     title: "保存成功"
                 });
                    
                }
                */
                 
                gContactsDetails['OverWrite'] = null;
                delete gContactsDetails.OverWrite; 

                //更新VIP邮件
                if(top.Contacts.IsVipUser(result.serialId)){
                    top.Contacts.updateCache("editVipContacts",result.serialId);
                }

                //更新组信息和通讯录主架构信息                
                top.M139.UI.TipMessage.show('保存成功', {delay: 1000});
                loadData(result, editContacts);
                returnToContactsList(true);
            } else {
                 switch(result.resultCode){
                    case "224" :
                    case "225" :
                    case "226" :
                    case "227" :{
                        var msg = result.msg + "，是否仍要保存？";//需求“是否仍要保存”
                        //将result返回的发生重复的ID重置为原来的ID: contact.SerialId
                        ContactBean.ReWrite(contact.SerialId, msg, false);
                        break;
                    }
                    default:{
                        top.FloatingFrame.alert(result.msg || '服务器连接超时!');
                        break;
                    }
                }
            }
        });
    },

    //强制覆盖更改联系人资料
    ReWrite: function(sid,tipmsg,newRewirte) {
        var isYesOrNo = true;
        top.FloatingFrame.confirm(
            tipmsg,
            function PressYes() {
                gContactsDetails.SerialId = sid;
                gContactsDetails["OverWrite"] = ContactBean.ENABLE_OVERWRITE;
                gContactsDetails["newRewrite"] = newRewirte;
                ContactBean.Edit(gContactsDetails);
            },
            function PressNo() {
                document.getElementById('FamilyEmail').focus();
            },
            isYesOrNo
        );
    },

    //指示详细信息是否在折叠状态
    IsDetailCollapsed: true,

    //折叠详细信息
    ToggleDeteil: function() {
        var serialId = Pt.param("id") || "";
        var btnHide = $('#btnHidden')[0];
        var css = (btnHide.currentStyle&&btnHide.currentStyle['display'])
            ||(document.defaultView.getComputedStyle(btnHide, null)['display'])
        if (css=='none'){
            btnHide.style['display']='block';
            $('#divPerson')[0].style['display']='block';
            $('#divCompany')[0].style['display']='block';
            $('#btnShowMore')[0].style['display']='none';
            ContactBean.IsDetailCollapsed = false;
            if(serialId && serialId.length > 0){
                top.BH('addr_editContact_more');
            }else{
                top.BH('addr_addContact_more');
            }
        } else {
            btnHide.style['display']='none';
            $('#divPerson')[0].style['display']='none';
            $('#divCompany')[0].style['display']='none';
            $('#btnShowMore')[0].style['display']='block';
            ContactBean.IsDetailCollapsed = true;
        }

        ImageView();//渲染上传图片
    }
};

//保存联系人数据
function SaveDataAPI(){
    if(gIsMyDetails){
        ContactBean.SaveMyself();
    } else {
        if (parseInt(gContactsDetails.SerialId) > -1) {
            ContactBean.Edit(gContactsDetails);
            top.BH('addr_editContact_save');
        } else {
            ContactBean.Add();
            top.BH('addr_addContact_save');
        }
    }
}

//返回通讯录
function returnToContactsList(gotoHome){
    if(top.$Addr){                
        var master = top.$Addr;
        master.trigger(master.EVENTS.LOAD_MAIN);
        if(gotoHome){//回到首页并选中所有联系人
            master.trigger(master.EVENTS.LOAD_MODULE, {
                key: 'events:selectGroup',
                command: 'SELECT_GROUP',
                data: {
                    groupId: 0
                }
            });
        }        
    }else{
		top.$('#addr').attr({'src': 'addr_v2/addr_index.html'});
	}
    return true;
}

function loadData(result, callback){
    callback(result);
    /*
    var interval = setInterval(function(){        
        if(Pt.loadStatus || !Pt.loadNum){
            callback(result);
            Pt.loadNum = 100;
            Pt.loadStatus = false;
            clearInterval(interval);
        }
        Pt.loadNum--;        
    }, 50);
    */
}

function editContacts(result){
    //更新组信息和通讯录主架构信息
    if(top.$Addr){
        var groupsId = []; 
        var master = top.$Addr;

        if(result.newGroupId && result.newGroupId.length){
            groupsId = result.newGroupId.split(',');
        }

        if(result.addGroupId){
            groupsId.push(result.addGroupId);
            master.trigger(master.EVENTS.LOAD_MODULE, {
                key: 'events:group',
                actionKey: '140',
                groupId: result.addGroupId
            });
        }
        
        master.trigger(master.EVENTS.LOAD_MODULE, {
            key: 'events:contacts',
            actionKey: '20',
            contactId: result.serialId,
            groupId: groupsId            
        });

        master.trigger(master.EVENTS.LOAD_MODULE, {
            key: 'remind:getMergeData'
        });
    }
}

function addContacts (result){
    if(top.$Addr){
        var groupsId = [];
        var master = top.$Addr;
        if(result.newGroupId && result.newGroupId.length){
            groupsId = result.newGroupId.split(','); 
        }

        if(result.addGroupId){
            groupsId.push(result.addGroupId);            
            master.trigger(master.EVENTS.LOAD_MODULE, {
                key: 'events:group',
                actionKey: '140',
                groupId: result.addGroupId
            });
        }
        
        master.trigger(master.EVENTS.LOAD_MODULE, {
            key: 'events:contacts',
            actionKey: '10',
            contactId: result.SerialId,
            groupId: groupsId
        });

        master.trigger(master.EVENTS.LOAD_MODULE, {
            key: 'remind:getMergeData'
        });                    
    }
}

function delContacts (result){
    if(top.$Addr){                                    
        var master = top.$Addr;
        master.trigger(master.EVENTS.LOAD_MODULE, {
            key: 'events:contacts',
            actionKey: '30',
            contactId: [result]
        });
    }
}


//绑定事件
function BindControlEvent(){
    if(IsCard()){//电子名片页
	    $("#bottomaEditCard,#aEditCard").click(function(){
		   EditAreaShow();
	    });
        
    	$("#btnCancelEdit,#bottombtnCancelEdit").click(function(){
           var serialId = Pt.param ("id");//避免编辑-取消 再编辑出现上次编辑的内容
            gContactsDetails = null;
            gContactsDetails = new top.ContactsInfo(gContactsData);
           if(IsMyCard()){//我的名片
    		   gIsMyDetails = true;
    		   ContactModule.getContactDetail("");
    		}else if (!IsEmpty(serialId)) { //联系人电子名片
    		       gContactsDetails.SerialId = serialId;
                   ContactModule.getContactDetail(serialId);
            }
            //清空之前上传过的图片值，否则如果再次上传相同图片无法触发change事件 
            GId("frmUpload").reset();
            //NewSetCardData(); //需要重新获取数据库数据，在getContactDeatil中已经执行了NewSetCardData
    	});
        
       
        $("#bottombtnSave").click(function(){
            ContactModule.saveData();
        });
        
        //短信发送名片
        $("#sendsms,#bottomsendsms").click(function(){
            if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }
			ContactModule.sendSMS();
        });
        
        //彩信发送名片
        $("#sendmms,#bottomsendmms").click(function(){
			if (top.$User && !top.$User.checkAvaibleForMobile()) { //非移动用户，屏闭wap短信发送
            return;
        }          
		  ContactModule.sendMMS();
        });
        
         //邮件发送名片
         $("#sendemail,#bottomsendemail").click(function(){
             ContactModule.sendeMail();
         });
         
         //名片设置为默认签名 
         $("#bottomaDefSign,#aDefSign").click(function(){
            var defaultSign = ContactModule.CardSignInfo();
            if(defaultSign && defaultSign.isDefault == 1){//已是默认签名是进行取消操作
               ContactModule.setDefaultSign(true); 
            }else{
               //点击“我的电子名片” "设置为默认签名"行为统计
               top.addBehaviorExt({actionId:101618,thingId: 0, moduleId: 19}); 
               if(!ContactModule.isNeedTip()){return false;}
               ContactModule.setDefaultSign(false);//设置默认
            }
           
         });
         
         $("#name").focus(function(){
             if($(this).val() == "姓名"){
                $(this).val("").css("color","#000");
             }
         }).blur(function(){
             if($(this).val() == ""){
                $(this).val("姓名").css("color","gray");
             }
         });
         
         $("#FavoWord").focus(function(){
             if($(this).val()=="[个性签名]"){
                $(this).val("").css("color","#000");
             }
         }).blur(function(){
             if($(this).val() == ""){
                $(this).val("[个性签名]").css("color","gray");
             }
         });
         
         //返回
         $("#bottomaBackDet,#aBackDet").click(function(){
             var pageId = Pt.param("pageId");
                 pageId = pageId ? '&pageId='+pageId : '';
             if(IsMyCard()){//本人 返回通讯录
                 returnToContactsList();
             }else{
                 var serialId = Pt.param("id") || "";
                 var url = "addr_detail.html?type=edit&id=" + serialId + pageId;
                 anchorLocal(url);
             }
             return false;
         });
         
    }else{//联系人页
       $("#aGoToAdd,#bottomaGoToAdd").click(function() {
            if (top.Utils.PageisTimeOut(true)){
                return;
            }
            var groupId = Pt.param("groupid");
            
            groupId = groupId ? '&groupid='+groupId : '';
            top.BH('addr_editContact_create');
            anchorLocal("addr_detail.html?type=add" + groupId);
            return false;
        });
       
       //删除联系人
        $("#aDeleteLinkMan,#bottomaDeleteLinkMan").click(function() {            
            if (top.Utils.PageisTimeOut(true)){
                return;
            }

            top.BH('addr_editContact_delete');
            function deleteContacts() {
                var serialId = Pt.param("id");
                top.Contacts.deleteContacts(serialId, function(result) {
                    if (result.success) {
						if(top.Contacts.IsVipUser(serialId)){
							top.Contacts.updateCache("delVipContacts",serialId);
							//top.Main.searchVipEmailCount();
							Tool.updateVipMail();

                            
						}                        

                        top.FF.alert(PageMsg['info_contactdeleted'], function() {
                            setTimeout(function(){
                                returnToContactsList();
                            }, 0);
                        });

                        top.BH('addr_delContacts_detail');
                        //更新组信息和通讯录主架构信息
                        delContacts(serialId); 

                    } else {
                        top.FF.alert(result.msg);
                    }
                });
            }
			var sid = Pt.param("id"); 
			var tip = PageMsg["warn_delcontact"];
            if(top.Contacts.IsVipUser(sid) ){
				tip = ADDR_I18N[ADDR_I18N.LocalName].home["warn_delVipContact"];
			 }
		    top.FloatingFrame.confirm(tip, deleteContacts);
            top.addBehavior("19_1407删除联系人");
            return false;
        });
        
        //电子名片链接点击
        $("#aBusinessCard,#bottomaBusinessCard").click(function(){
            if (top.Utils.PageisTimeOut(true)){
                return;
            }

            var serialId = Pt.param("id") || "";
            var pageId = Pt.param("pageId") || "";
            anchorLocal("addr_businesscard.html?type=businesscard&id=" + serialId + "&pageId=" + pageId + "&r=" + Math.random());
            top.addBehaviorExt({actionId:101262,thingId:0,moduleId:14});
            return false;
        });

         //取消编辑联系人信息
         $("#btnCancel").click(function(){/*旧的保留referere?*/
            var serialId = Pt.param("id") || "";
            if(serialId && serialId.length > 0){
                top.BH('addr_editContact_cancel');
            }else{
                top.BH('addr_addContact_cancel');
            }

            returnToContactsList();
            return false;
        });
        
     
       
       //删除图片
        $("#btnDelImage").click(function(){
            DeleteImage(gContactsDetails.ImageUrl);
        });
         
        //新建联系人组
       $("#NewGroupName").focus(function(){
              if($.trim($("#NewGroupName").val()) == "新建组名"){
                  $("#NewGroupName").val("");
              }
        });
        
        $("#NewGroupName").blur(function(){
            if($("#NewGroupName").val() == ""){
                $("#NewGroupName").val("新建组名");
            }
        });
        
        //绑定省份控件
        $("#ProvCode").change(function(){
            SetCity(GId('CityCode'),GId('ProvCode'));
        });
        
        //公司地址控制
        $("#CPProvCode").change(function(){
            SetCity(GId('CPCityCode'),GId('CPProvCode'));
        });
       
         //备注检测
		$("#Memo").keydown(function(){
            if(this.value.length > 100){
                this.value = this.value.substring(0,100);
            }
        });
        $("#Memo").keyup(function(){
            if(this.value.length > 100){
                this.value = this.value.substring(0,100);
            }
        });
      
       $("#BusinessMobile").change(function(e){
            var mp = $("#BusinessEmail");
            var mobile = e.target.value.replace(/\D/g, "");//过滤掉非数字
    
            var isFix = ($Mobile.isMobile(mobile)
                && mp.val() == "");
	    $(this).val(mobile);
            if (isFix) {
                var domain = top.mailDomain || top.coremailDomain;
                mp.val(mobile + "@" + domain); 
            }
        });
        
        //查看往来邮件
        $("#aSearchEmails,#bottomaSearchEmails").click(function(){
            getTraffic();
            top.BH('addr_editContact_mail');
            return false;
        });
        
        $("#BusinessEmail").change(function(e){
            var mp = $("#BusinessMobile");
            var _emailObj = top.Utils.parseSingleEmail(e.target.value);
            var isFix = ( _emailObj != null 
                && $Mobile.isMobile(_emailObj.name)
                && mp.val() == "");
    
            if (isFix) {
                mp.val(_emailObj.name);
            }
        }).blur(function(){ $(this).trigger("change") });
   
    }
   
   
     //上传图片
     $("#fileUpload").change(function(){
    //    ImageView();啥也别干，重新改版了
     });
    //共用按钮事件
    $("#aBack,#aBackContacts,#bottomaBack").click(function(){//返回通讯录5.15 沿用旧代码不知道什么地方调用refferrer
        returnToContactsList();
        return false;
    });
	    
    //保存联系人信息
    $("#btnSave").click(function(){
        ContactModule.saveData();
        return false;
    });
    
    
    $("#ifrmReturnInfo").load(function(){
        frmInfoOnLoad(this);
    });
   
    $("#FamilyEmail,#BusinessEmail,#OtherEmail").keyup(function(){
        add139com(this,false);
    });

    //自动截手机帐号为手机号
    $("#FamilyEmail").change(function(e){
        var mp = $("#MobilePhone");
        var _emailObj = top.Utils.parseSingleEmail(e.target.value);
        var isFix = ( _emailObj != null 
            && $Mobile.isMobile(_emailObj.name)
            && mp.val() == "");

        if (isFix) {
            $("#MobilePhone").val(_emailObj.name);
        }
    }).blur(function(){ $(this).trigger("change") });;

    

    $("#MobilePhone").change(function(e){//手机号支持分隔符“-”,输入手机号 自动填充移动手机邮箱时过滤掉手机号分隔符10.9
        var mp = $("#FamilyEmail");
        var mobile = e.target.value.replace(/\D/g, "");
        var isFix = ($Mobile.isMobile(mobile)
            && mp.val() == "");
			
		$(this).val(mobile);

        if (isFix) {
            var domain = top.mailDomain || top.coremailDomain;
            mp.val(mobile + "@" + domain); 
        }
    });

    $("#name").blur(function(){
        var v = this.value;
        if (v.length>0 && !gIsMyDetails) ContactModule.namesake(v);
    });
    $('span.sync-tips').click(function(event){

        if ($('span.sync-tips i.up').length>0){
            $('span.sync-tips i').removeClass("up").addClass("down");
            $('div.sync-name').remove();
            return;
        }

        $('span.sync-tips i').removeClass("down").addClass("up");
        var txtName = $('#name');
        var contacts = top.Contacts.data.contacts,
            sake = [],
            name = txtName.val(),
            curr = Pt.param("id");
        for (var i=contacts.length-1, k=contacts[i]; i>=0; k=contacts[--i]){
            if (k.AddrFirstName == name && curr!=k.SerialId){
                sake.push({
                    'name':name, 'email':k.emails[0]||'', 'mobile':k.mobiles[0]||'', id: k.SerialId
                });
            }
        }

        var list = document.createElement('UL');
        list.onclick = function(e){
            e = e||window.event;
            e = e.target||e.srcElement;
            while(!e.getAttribute("sid")) e = e.parentNode;
            anchorLocal("addr_detail.html?type=edit&id=" + e.getAttribute("sid"));
            return false;
        };
        for (var i=sake.length-1, k=sake[i]; i>=0; k=sake[--i]){
            var item = document.createElement('LI');

            var p1 = document.createElement('STRONG');
            p1.appendChild(document.createTextNode(k.name));
            item.appendChild(p1);

            if (k.email) {
                var p2 = document.createElement('P');
                p2.appendChild(document.createTextNode('邮箱：' + k.email));
                item.appendChild(p2);
            }

            if (k.mobile) {
                var p3 = document.createElement('P');
                p3.appendChild(document.createTextNode('手机：'+k.mobile));
                item.appendChild(p3);
            }

            item.setAttribute("sid", k.id);
            if ($.browser.msie && $.browser.version=="6.0"){
                item.onmouseover = function(){ this.style.backgroundColor="#ecf9ff" }
                item.onmouseout = function(){ this.style.backgroundColor="#ffffff" }
            }
            list.appendChild(item);
        }
        var pnl = document.createElement('DIV');
        if(pnl.cssName)pnl.cssName = "sync-name";
        else pnl.className = "sync-name";
        pnl.appendChild(list);

        txtName[0].parentNode.appendChild(pnl);
        //event = event||window.event;
        //event.stopPropagation && event.stopPropagation();
        //event.cancelBubble = true;
        return false;
    });

    $(document).click(function(){
        $('span.sync-tips i').removeClass("up").addClass("down");
        $('div.sync-name').remove();
    });
    
    top.$App.on("GlobalContactLoad", function(e){
        Pt.loadStatus = true;
    });
}

//编辑联系人模块
var ContactModule = {
    MyDetailIsEmpty: false,
    birthDay: null,
    bindEvent: function() {
        BindControlEvent();
    },
    getContactDetail: function(serialId) {
        if (gIsMyDetails) {
            //获取本人电子名片资料
            try {
                top.WaitPannel.show();
                gContactsObject.QueryUserInfo(function(result) {
                    if (result.success) {
                        //成功加载我的电子名片页面
                        top.addBehaviorExt({actionId:30180,thingId:0,moduleId:14});
                       
                        if (result.info) { 
                             for (m in result.info) {
                                gContactsDetails[m] = result.info[m];
                            }
                             gContactsDetails.SerialId = "me";
                             NewSetCardData();
                        } else { 
                            ContactModule.MyDetailIsEmpty = true;
                            gContactsDetails.SerialId = "me";
                            NewSetCardData();
                            top.FloatingFrame.alert(PageMsg['warn_userinfoempty']);
                        }
                        
                    } else {
                        top.FloatingFrame.alert(result.msg);
                    }
                    
                    top.WaitPannel.hide();
                });
            } catch (e) { }
        } else {
            try {
                gContactsObject.getContactsInfoById(serialId, function(result) {
                    if (result.success) {
                        //成功加载查看联系人页面
                        top.addBehaviorExt({actionId:30181,thingId:0,moduleId:14});
                        for (m in result.contactsInfo) {
                            gContactsDetails[m] = result.contactsInfo[m];
                        }

                       if (IsCard()) {
                            NewSetCardData(); //填充联系人名片
                            top.addBehaviorExt({actionId:101271,thingId:0,moduleId:14});

                        }else{ //填充联系人资料
                            ContactModule.fillData();
                        }

                        //ShowTraffic(); //显示查看往来邮件
                    } else {
                        top.FF.alert(result.msg);
                    }
                    top.WaitPannel.hide();
                });
            } catch (e) { }
        }
    },
    //编辑联系人页面初始化
    initPage: function() {
        ContactModule.bindEvent();  //绑定页面事件
        this.birthDay = new DateControl("dateWrap"); //日期控件
        var serialId = Pt.param ("id");
            $(".groupSelect").show();
     
        //是否为新添联系人
        if (!IsEmpty(serialId)){//编辑
            gContactsDetails.SerialId = serialId;
            ContactModule.getContactDetail(serialId);
           $("#divToolBar").show().find(":hidden").show();
           $("#bottomdivToolBar").find(":hidden").show();

           $('#newHead').hide();
           $('#editHead').show();           
        } else {//新建
            if (!IsEmpty(Pt.param ("name")))
                //新建联系人有些可能是通过url转义参数进行跳转，将转义的参数进行还原
                gContactsDetails.name = unescape(Pt.param("name")); 
            if (!IsEmpty(Pt.param ("email")))
                gContactsDetails.FamilyEmail = unescape(Pt.param("email"));
            if (!IsEmpty(Pt.param ("mobile")))
                gContactsDetails.MobilePhone = Pt.param("mobile");
            if (!IsEmpty(Pt.param ("fax")))
                gContactsDetails.OtherFax = Pt.param("fax");

            //如果首页是在分组显示状态，新建时勾上该组。
            var gid = Pt.param ("groupid");
            if (!IsEmpty(gid)) gContactsDetails["GroupId"] = gid;

            gContactsDetails.SerialId = "-1";
            BindContactGroups(GId("GroupsContainer"), gContactsDetails["GroupId"]);
            ContactModule.fillData();
            
            //新建联系人时 联系人资料页面返回除外的其它按钮隐藏
            //$("#aBack").parent().siblings().hide();
            //$("#bottomaBack").parent().siblings().hide();
            $('#divToolBar').hide().find('div').hide();
            $("#tipHead").text("新建联系人");

           $('#newHead').show();
           $('#editHead').hide(); 

            top.WaitPannel.hide()
        }
    },
    //电子名片初始化
    initCardPage:function(){
           ContactModule.bindEvent();  //绑定页面事件
           var serialId = Pt.param ("id");
           if(IsMyCard()){//我的名片
    		   gIsMyDetails = true;
    		   ContactModule.getContactDetail("");
               
    		}else if (!IsEmpty(serialId)) { //联系人电子名片    		
                gContactsDetails.SerialId = serialId;
                ContactModule.getContactDetail(serialId);
             }
    },
    fillData: function() {//填充联系人资料
        var obj;

        //2010年5月新规则
        //如果常用手机二为空但有商务手机，则将商务手机取到常用手机二显示
        //2010年12月底修正为：如果常用手机二有且商务手机空，则将其取到商务手机。
        if (!IsEmpty(gContactsDetails["OtherMobilePhone"])) {
            if (IsEmpty(gContactsDetails["MobilePhone"])) {
                gContactsDetails["MobilePhone"] = gContactsDetails["OtherMobilePhone"];
            } else if (IsEmpty(gContactsDetails["BusinessMobile"])) {
                gContactsDetails["BusinessMobile"] = gContactsDetails["OtherMobilePhone"];
            }

            gContactsDetails.OtherMobilePhone = null;
            delete gContactsDetails.OtherMobilePhone;
        }

        if (!IsEmpty(gContactsDetails["OtherEmail"])) {
            if (IsEmpty(gContactsDetails["FamilyEmail"])) {
                gContactsDetails["FamilyEmail"] = gContactsDetails["OtherEmail"];
            } else if (IsEmpty(gContactsDetails["BusinessEmail"])) {
                gContactsDetails["BusinessEmail"] = gContactsDetails["OtherEmail"];
            }

            gContactsDetails.OtherEmail = null;
            delete gContactsDetails.OtherEmail;
        }

        //如果常用固话为空但有家庭电话，则将家庭电话取到常用固话显示
        //#region 20130722,取消OtherPhone，FamilyPhone作为常用电话
        /*
        if (IsEmpty(gContactsDetails["OtherPhone"])
            && !IsEmpty(gContactsDetails["FamilyPhone"])) {
            gContactsDetails["OtherPhone"] = gContactsDetails["FamilyPhone"];
            gContactsDetails.FamilyPhone = null;
            delete gContactsDetails.FamilyPhone;
        }
        if (!IsEmpty(gContactsDetails["FamilyPhone"])) {
            var fp = "\r\n家庭固话：" + gContactsDetails["FamilyPhone"];
            var index = gContactsDetails.Memo.indexOf("家庭固话：");
            if (index<0){
                gContactsDetails.Memo += fp;
            } else if (index>-1){
                gContactsDetails.Memo += "\r\n";
                gContactsDetails.Memo = gContactsDetails.Memo.replace(/家庭固话：(.*\r\n)/, fp+"\r\n");
            }
            gContactsDetails.FamilyPhone = null;
            delete gContactsDetails.FamilyPhone;
        }
        //*/
        //#endregion

        //20130722,取消OtherPhone，FamilyPhone作为常用电话(逆向操作，以作兼容)
        if (IsEmpty(gContactsDetails["FamilyPhone"])
            && !IsEmpty(gContactsDetails["OtherPhone"])) {
            gContactsDetails["FamilyPhone"] = gContactsDetails["OtherPhone"];
            gContactsDetails.OtherPhone = null;
            delete gContactsDetails.OtherPhone;
        }

        //businessfax > otherfax > familyfax
        if (IsEmpty(gContactsDetails["BusinessFax"])){
            gContactsDetails["BusinessFax"] = gContactsDetails["OtherFax"];
            gContactsDetails["OtherFax"] = "";
        }
        if (IsEmpty(gContactsDetails["BusinessFax"])){
            gContactsDetails["BusinessFax"] = gContactsDetails["FamilyFax"];
            gContactsDetails["FamilyFax"] = "";
        }

        //attach to note remark
        if (IsEmpty(gContactsDetails.Memo)) {
            gContactsDetails.Memo = '';
        }

        for (key in gContactsDetails) {
            switch ($.trim(key.toLowerCase())) {
                case "familyphonebrand": break;
                case "familyphonetype": break;
                case "otherphonebrand": break;
                case "otherphonetype": break;
                case "businessphonebrand": break;
                case "businessphonetype": break;
                case "groupid": break;
                case "imageurl": break;
                case "usersex": break;
                case "birday": break;
                case "startcode": break;
                case "bloodcode": break;
                case "provcode": break;
                case "citycode": break;
                case "cpprovcode": break;
                case "cpcitycode": break;
                default:
                    if (GId(key)) GId(key).value = gContactsDetails[key];
                    break;
            }
        }
        //设置联系人分组 我的资料无分组
        if (!gIsMyDetails) {
            BindContactGroups(GId("GroupsContainer"), gContactsDetails["GroupId"]);
        }
        if (gIsMyDetails) {
            SetMobileType(GId("FamilyPhoneBrand"), GId("FamilyPhoneType"), gContactsDetails["FamilyPhoneBrand"]);
            SetMobileType(GId("BusinessPhoneBrand"), GId("BusinessPhoneType"), gContactsDetails["BusinessPhoneBrand"]);
            SetMobileModel(GId("FamilyPhoneBrand"), GId("FamilyPhoneType"), gContactsDetails["FamilyPhoneType"]);
            SetMobileModel(GId("BusinessPhoneBrand"), GId("BusinessPhoneType"), gContactsDetails["BusinessPhoneType"]);
        }

        //设置左上角链接前面的姓名
        if(gContactsDetails.name){ //避免IE出现undefined
            SetTopContactName(gContactsDetails.name);
        }
         
        //设置联系人头像
        SetContactImage(gContactsDetails.ImageUrl);
        //设置联系人性别
        SetContactSex(gContactsDetails["UserSex"]);
        //设置联系人生日
        ContactModule.birthDay.setDate(gContactsDetails["BirDay"]); 
        //设置家庭地址
        SetProvince(GId("ProvCode"), gContactsDetails.ProvCode);
        SetCity(GId("CityCode"), GId("ProvCode"), gContactsDetails.CityCode);
        //设置公司地址
        SetProvince(GId("CPProvCode"), gContactsDetails.CPProvCode);
        SetCity(GId("CPCityCode"), GId("CPProvCode"), gContactsDetails.CPCityCode);
        
    },
    updateData: function() {//更新联系人资料数据 （图片不在此更新）
        var obj;
        for (key in gContactsDetails) {
            obj = GId(key);
            switch ($.trim(key.toLowerCase())) {
                case "groupid":
					gContactsDetails[key] = GetGroupId();
                    var gname = $.trim(GId("NewGroupName").value);

                    if (GId("ChkNewGroupId").checked && gname != "" && gname != "新建组名") {
                        gContactsDetails["AddGroupName"] = gname;
                    } else {
                        delete gContactsDetails["AddGroupName"];
                        delete gContactsDetails["AddNewGroup"];
                        delete gContactsDetails["AddGroupId"];
                    }
                    break;
                case "imageurl":
                    break;
                case "usersex":
                    gContactsDetails[key] = GetSex();
                    break;
                case "birday":
                    gContactsDetails[key] = ContactModule.birthDay.getDateString(); 
                    break;
                case "familyphonebrand":
                case "familyphonetype":
                    if (obj) gContactsDetails[key] = (IsEmpty($.trim(GId("MobilePhone").value)) || obj.selectedIndex == -1 || obj.options[obj.selectedIndex].value == "-1") ? "" : obj.options[obj.selectedIndex].text;
                    break;
                case "otherphonebrand":
                case "otherphonetype":
                    if (obj) gContactsDetails[key] = (IsEmpty($.trim(GId("OtherMobilePhone").value)) || obj.selectedIndex == -1 || obj.options[obj.selectedIndex].value == "-1") ? "" : obj.options[obj.selectedIndex].text;
                    break;
                case "businessphonebrand":
                case "businessphonetype":
                    if (obj) gContactsDetails[key] = (IsEmpty($.trim(GId("BusinessMobile").value)) || obj.selectedIndex == -1 || obj.options[obj.selectedIndex].value == "-1") ? "" : obj.options[obj.selectedIndex].text;
                    break;
                case "startcode":
                case "bloodcode":
                case "provcode":
                case "citycode":
                case "cpprovcode":
                case "cpcitycode":
                    if (obj) gContactsDetails[key] = (obj.selectedIndex == -1 || obj.options[obj.selectedIndex].value == "-1") ? "" : obj.options[obj.selectedIndex].text;
                    break;
                case "familyphone":
                    if (obj) gContactsDetails[key] = obj.value;
                    break;
                default:
                    if (obj) gContactsDetails[key] = $.trim(obj.value);
                    break;
            }
        }
    },
    
    //更新电子名片
	updateCardData: function(){
        //我的电子名片增量保存 需要将gContactsDetails清空，保存时只获取名片字段
        if(IsMyCard()){
            for(var key in gContactsDetails ){
                if( key != "ImageUrl" && key != "ImagePath" && key !="SerialId"){
                    delete gContactsDetails[key];
                }
            }

            //图片字段隐藏域需手动添加 如果没有修改头像则不传值
            var sysImgPath = ["/upload/photo/system/nopic.jpg","/upload/photo/nopic.jpg"];
            var imgurl = gContactsDetails["ImageUrl"];

            if (! /(nopic)|(face)\.(jpg)|(png)/i.test(imgurl)) {
                updateFileds.push("ImageUrl");
            }
        }
        
        var inputAreEl = $("#cardContent").children().find(":input");
		var inputId="";
		$.each(inputAreEl,function(){
			inputId =$(this).attr("id"); 
			gContactsDetails[inputId] = $("#"+inputId).val();
            if(IsMyCard()){
                 if(inputId == "name"){
                    inputId = "AddrFirstName"; 
                  }
                 updateFileds.push(inputId);
            }
		});
        
        if(gContactsDetails["UserSex"]== "" ){
            gContactsDetails["UserSex"] = 0;
        }
        
        //当姓名字段没有编辑的时候不能直接把”姓名“保存到数据库
        if(gContactsDetails["name"] == "姓名"){
            gContactsDetails["name"] = "";
        }
        
        //当"个性签名"没有编辑时不报错
        if(gContactsDetails["FavoWord"] == "[个性签名]"){
            gContactsDetails["FavoWord"] = "";
        }  
        
    },
    
    saveData: function() {
		if (!top.Utils.PageisTimeOut(true)) {
             if(IsCard()){//更新名片信息
			    ContactModule.updateCardData();
			 }else{
				ContactModule.updateData();
			 }

            if (ValidateData()) {
                if (GId("fileUpload").value.length > 0) {
                    UploadImage();
                }else{
                    SaveDataAPI();  
                }
                gContactsDetails.validated = true; //标记为已校验过。
                            
            }
        }
    },
    
   //判断是否需要提示输入手机号用户名
   isNeedTip:function(){
        if(!gContactsDetails.name){//姓名为空需要提示
           top.FloatingFrame.alert(PageMsg['send_card_check_name']);
            return false ;
        }
        
        //姓名不为空其它两项同时为空需要提示
        if(!gContactsDetails.FamilyEmail && !gContactsDetails.MobilePhone){
            top.FloatingFrame.alert(PageMsg['send_card_check_email']);
            return false;
         }   
         
       return true;
   },

    //短信发送名片接口
   sendSMS:function(){
       if(!this.isNeedTip()){return false;}
       var sendContent = VcarContent.connectSendContent(gContactsDetails); //VcardContent js拼接发送内容
       if (sendContent) {
           top.SmsContent = sendContent;
           var cardType = IsMyCard() ? "myVcard" : "contactVcard";//区别是本人的还是联系人的
           top.Links.show("sms", "&from=2&vCard=" + cardType);
        }
        //行为统计
        top.addBehaviorExt({
            actionId: IsMyCard() ? 1418 : 101264,
            thingId: 1,
            moduleId: 19
        });
    },

    //彩信发送名片接口
    sendMMS:function(){ 
        if(!this.isNeedTip()){return false;}

        var sendContent = VcarContent.connectSendContent(gContactsDetails);
        var cardType = IsMyCard() ? "myVcard" : "contactVcard";//区别是本人的还是联系人的
        var _subject = gContactsDetails.name +"的电子名片";

        if(sendContent){
            top.Main.setReplyMMSData({
                content : sendContent,
                subject : _subject ||""
           });
            top.Links.show("mms","&mmstype=diy&initData=replyMMSData&vCard=" + cardType );
            top.addBehaviorExt({actionId: IsMyCard() ? 1418 : 101264, thingId: 2, moduleId: 19});
        }
    },
   
   //邮件发送名片接口
   sendeMail:function(){
       if(!this.isNeedTip()){return false;}
       if(!gContactsDetails.SerialId){return;}

        var _args = { sd: gContactsDetails.SerialId };
        if (IsMyCard()) {
            _args = {}; //个人名片发送时不带sd参数
        }

        Pt.parent().$App.show("compose", null, { inputData: {
            type: 'customExtMail',
            templateid: 'm2012.contacts.vcard2013',
            args: _args
        }});

       top.addBehaviorExt({actionId: IsMyCard() ? 1418 : 101264, thingId: 3, moduleId: 19});
   },
   //判断签名是否存在
   QueryCardSign: function(){
		top.$RM.getSignatures(function (result) {
			var sl = result["var"];
            top.$App.registerConfig("SignList", sl);
        });
   },
   /**电子名片
   */
   CardSignInfo:function(){
        var signsData = top.$App.getConfig("SignList");
        var signsLen = signsData.length;
        var signcard;
        for(var i=0;i<signsLen;i++){
            var type = signsData[i].type;
            var signId = signsData[i].id;
            if(signId != -1 && type ==1){ //约定电子名片签名type 为1 且判断是否已设为默认 在设置 修改签名是必须把type 写为1 否则这边无法获取
                signcard =  signsData[i];
            }
         }
       return signcard;
   },
   //设置邮件签名模板组装
   templateSet:function(){
        //var imgUrl = getContactImage(gContactsDetails["ImageUrl"]); //图片存在外连接 此处不传递 放到写信页重新获取
        var filedsData = [gContactsDetails["UserJob"],gContactsDetails["CPName"],gContactsDetails["CPAddress"]
                   ,gContactsDetails["FamilyEmail"],gContactsDetails["MobilePhone"],gContactsDetails["OtherPhone"]
                   ,gContactsDetails["BusinessFax"],gContactsDetails["CPZipCode"]];
        var fields = ["职务:","公司:","地址:","邮箱:","手机:","电话:","传值:","邮编:"];
      
        var tmp=[];
            tmp.push('<div class="mySLinfo" style="padding: 10px; border: 1px solid #b5cbdd; background-color:#f8fcff; overflow: hidden; _zoom: 1;float:left; -webkit-border-radius: 5px; border-radius: 5px; -webkit-box-shadow: 2px 2px 0px -1px #eee; box-shadow: 2px 2px 0px -1px #eee;">');
            tmp.push('<div style="padding: 1px;border: 1px solid #6D91B5;float: left;margin-right: 10px;width: 96px;height: 96px;position: relative;"><img width="96" height="96" id="ImageUrl" />');
            tmp.push('</div><dl  style="float:left;"><dt style="font-size: 14px; font-weight: bold; margin-bottom: 6px; padding: 0; margin: 0;"><span>{0}</span></dt>'.format(gContactsDetails["name"]));
            tmp.push('<dd style="padding:0;margin:0;"><table style="color: #333333; font-size: 12px;">');
      
        if(gContactsDetails["FavoWord"]){
           tmp.push('<dt style="font-size: 14px; font-weight: bold; margin-bottom: 6px; padding: 0; margin: 0;"><span>{0}</span></dt>'.format(gContactsDetails["FavoWord"]));   
        }
      
        for(var i=0; i<filedsData.length; i++) {
          if(!IsEmpty(filedsData[i])){ //在写信页如果用display：none来隐藏无法达到隐藏效果，所以必须用动态添加
              tmp.push('<tr><td width="36">{0}</td><td>{1}</td></tr>'.format(fields[i],filedsData[i]));
            }
        } 
        tmp.push('</table></dd></dl></div>');
        var signContent = tmp.join('');
        
        return signContent;
   },
   //设置签名
   setDefaultSign: function(Iscancel){
        var defaultSign = ContactModule.CardSignInfo();
        var signContent = this.templateSet(); //获取名片内容
        var signId = IsEmpty(defaultSign)? -1 : defaultSign.id;
        var editType = IsEmpty(defaultSign) ? 1 : 3;  // 存在则为修改否则为添加
        var IsDefault = Iscancel? 0 : 1 ; //false为设置为默认 true 为取消默认
        var paramData = {
            'opType':     editType, //opType，1:增加，2:删除，3:修改
            'id':         signId,
            'title':      '我的电子名片',//签名名称
            'content':    signContent,//此处不能htmlEncode(),调用 RequestBuilder.call中namedVarToXML有进行encodeXML2
            'isHtml':     1,//是否是HTML格式
            'isDefault':  IsDefault,//是否是默认签名档
            'isAutoDate': 0,//1：自动加入 0：不加入默认为0，不自动加入写信日期
            'isSMTP':     0,//是否在smtp信件中追加签名   1:是 0:否默认为0，不在smtp中追加签名
            'type':       1 // //签名的类型，0：用户自定义的签名   1: 我的电子名片签名(通讯录)
        };

        var _this = this;
        //设置的回调函数
        var setHandler = function(res){
            if(res.code!= "S_OK"){
                top.FF.alert(PageMsg["set_sign_failed"]);
                return false;
            }
        
            $("#bottomaDefSign").attr("title",PageMsg["cancel_card_sign"]).find("span").text(PageMsg["cancel_card_sign"]);
            $("#aDefSign").attr("title",PageMsg["cancel_card_sign"]).find("span").text(PageMsg["cancel_card_sign"]);
            _this.QueryCardSign();
            
            //"设置为默认签名"成功行为统计
            top.addBehaviorExt({actionId:101619,thingId: 1, moduleId: 19}); 
        };
        //取消的回调函数
        var cancelHandler = function(res){
            if(res.code!= "S_OK"){
                top.FF.alert(PageMsg["set_sign_failed"]);
                return false;
            }
            
            $("#bottomaDefSign").attr("title",PageMsg["set_card_sign"]).find("span").text(PageMsg["set_card_sign"]);
            $("#aDefSign").attr("title",PageMsg["set_card_sign"]).find("span").text(PageMsg["set_card_sign"]);
            _this.QueryCardSign();
        };
    
        var successHandler = Iscancel? cancelHandler : setHandler; 
         top.$RM.setSignatures(paramData,successHandler);
		//if(!top.MS.setSignatures){return;}//兼容cm,rm cm没有!top.MS.setSignatures
        //top.MS.setSignatures(paramData,successHandler);  
   },
   
    //作同名检测
    namesake: function(name){
        if (!name) return;
        name = name.toLowerCase().trim();
        var contacts = top.Contacts.data.contacts,
            isExists = false,
            curr = Pt.param("id");

        for (var i=contacts.length-1, k=contacts[i]; i>=0; k=contacts[--i]){
            var n = k.AddrFirstName.toLowerCase().trim();
            if (n == name && k.SerialId != curr){
                isExists = true;
                break;
            }
        }
        var txtName = $('#name');
        if (isExists){
            txtName.addClass("notice");
            $('span.sync-tips').show();
        } else {
            txtName.removeClass("notice");
            $('span.sync-tips').hide();
            $('div.sync-name').remove();
        }
    }
};

function add139com(obj, isMore){
    var valNumber = obj.value.replace(/;/g,",").replace(/；/g,",").replace(/，/g,",");
    var domain = top.coremailDomain||top.mailDomain;
    if(valNumber.indexOf(",")==-1){
        
        if($Mobile.isMobile(obj.value)){
            
            if(isMore){
                obj.value=obj.value+"@"+ domain+ ",";
            }
            else{
                obj.value=obj.value+"@"+ domain;
            }
        }
    }else{
        var match=valNumber.match(/[,，；;]([^;，；,]+)$/);
        if(match && $Mobile.isMobile(obj.value)){
            if(isMore){
                obj.value=valNumber+"@"+ domain+ ",";
            }
            else{
                obj.value=valNumber+"@"+ domain;
            }
        }
    }
}

var anchorLocal = (function(d){
    return (function(url){
        var b = d.createElement("a");
        b.href = url;
        d.body.appendChild(b);

        try {
            b.click();
        } catch (e) {
            b = d.createElement("META");
            b.httpEquiv="refresh";
            b.content="0;url=" + url;
            d.getElementsByTagName("head")[0].appendChild(b);
        }
    });
})(document);