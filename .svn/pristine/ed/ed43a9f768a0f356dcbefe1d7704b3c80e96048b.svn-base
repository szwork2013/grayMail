jQuery(function()
{
   if(varisDayCanSend=="0" && varisMonthCanSend=="0")
   {
     document.getElementById("sendmonthmsg").style.display="";
   }
   else
   {
       if(varisDayCanSend=="0")
       {
          document.getElementById("senddaymsg").style.display="";
       }
        if(varisMonthCanSend=="0")
       {
          document.getElementById("sendmonthmsg").style.display="";
       }
   }
    /* 
    $("#linkSave").click(function()
      {
            __doPostBack("btnSave","");
             return false;
     });
     */
     
     $("#linkSendAgain").click(function()
    {
		window.location.href = "sms_free_send.html?sid="+ window.top.UserData.ssoSid +"&rnd="+ Math.random() +"&smsid="+ varSmsId +"&sign="+escape(varSignature);
       return false;
    });
    
     var sendSuccessMobiles = varSendMobile;
     var isHideDivAddress = true;
    var mobiles = sendSuccessMobiles.split(",");
    var linmansHTML = $("#divAddress table").html();
    for (var i=0;i<mobiles.length;i++)
    {
        try
        { 
        if (!window.top.Contacts.isExistMobile(mobiles[i]) && mobiles[i].length>0)
        {
            isHideDivAddress = false;
	        linmansHTML = linmansHTML + "<td class=\"check\"><input name=\"rptAddress$ctl00$chkIsSave\" type=\"checkbox\" /></td><td class=\"name\"><input name=\"rptAddress$ctl00$txtName\" type=\"text\" maxlength=\"8\" class=\"textfiled\" /></td><td class=\"email\"><input name=\"rptAddress$ctl00$txtEmail\" type=\"text\" maxlength=\"40\" class=\"textfiled\" /></td><td class=\"mobile on\"><input name=\"rptAddress$ctl00$txtMobileReadOnly\" type=\"text\" value=\"" + mobiles[i] + "\" readonly=\"readonly\" class=\"textfiled\" /></td></tr>";
        }
        }
        catch(e)
        {}
    }
   
    if(!isHideDivAddress)  
    {
         document.getElementById("divAddr").style.display="block";
    } 
    
    $("#divAddress table").html(linmansHTML);
    
     $("#linkSave").click(function(){
        //检查是否选择保存选项
        var isrblSmsStoreClassNull = true;
        if (isrblSmsStoreClassNull)
        {
            $("input[name='rptAddress$ctl00$chkIsSave']").each(function(i){
	            if (this.checked)
	            {
	                isrblSmsStoreClassNull = false;
	                return false;
	            }
            });
        }
        
        if (isrblSmsStoreClassNull)
        {
            alert("请填写您要保存的内容！");
            return false;
        }
        
        //保存联系人
        var linkmans=[];
        var linkmanerro=true;
        $("input[name='rptAddress$ctl00$chkIsSave']").each(function(i){
	        if (this.checked)
	        {
		        var newlinkman=new top.ContactsInfo();
		        newlinkman.name = $("input[name='rptAddress$ctl00$txtName']")[i].value;
		        newlinkman.email = $("input[name='rptAddress$ctl00$txtEmail']")[i].value;
		        newlinkman.mobile = $("input[name='rptAddress$ctl00$txtMobileReadOnly']")[i].value;
		        if (newlinkman.validate()) {
			        linkmans.push(newlinkman);
		        }
		        else{
			        alert(newlinkman.error);
			        linkmanerro = false;
			        return false;
		        }
	        }
        });
        if (linkmanerro) {
	        if (linkmans.length > 0) {
		        window.top.Contacts.addContacts(linkmans, addContactsCallback);
	        }
	        else{
		        hiddivAddr();
		        top.FloatingFrame.alert("保存成功！");
	        }			
        }
        return false;
    });       
    
});

function addContactsCallback(result){
    if(result.success){
        hiddivAddr();
        top.FloatingFrame.alert("保存成功！");
    }else{
         alert(result.msg);
    }
}

function selectAll()
{     
    var selectall = document.getElementById("chkSelectAll");
    if(selectall!=null)
    {
        setCheckState(selectall.checked);
    }
}
function setCheckState(state)
{
    var elements = document.getElementsByTagName("input");
    for(var i=0;i<elements.length;i++)
    {
        if(elements[i].type=='checkbox' && elements[i].id!='chkSelectAll')
        {
            elements[i].checked = state; 
        }        
    }
}
function hiddivAddr()
{
     if(document.getElementById("divAddr"))
     {
        document.getElementById("divAddr").style.display="none";
        return false;
     }
}
