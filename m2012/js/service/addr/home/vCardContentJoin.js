function IsEmpty(code) {
    if(typeof(code) == "undefined" || code == null || code.length == 0) return true;
    return false;
}
var VcarContent = {
   //拼接名片信息
	connectSendContent:function(info){
       if(!info) return;
       
       var mmscontent = "";
        
       if(!IsEmpty(info.name)){
           mmscontent = "您好，以下是" + info.name + "的电子名片:\n"+info.name;
       }   
          
       if(!IsEmpty(info.FavoWord)){
            mmscontent += "\n" + info.FavoWord ;
       }
       
       if(!IsEmpty(info.UserJob)){
           mmscontent += "\n职务：" + info.UserJob;
       }
       
       if(!IsEmpty(info.CPName)){
           mmscontent += "\n公司：" + info.CPName;
       }
       
       if(!IsEmpty(info.CPAddress)){
           mmscontent += "\n地址：" + info.CPAddress;
       }
       
       if(!IsEmpty(info.FamilyEmail)){
           mmscontent += "\n邮箱：" + info.FamilyEmail;
       }
       
       if(!IsEmpty(info.MobilePhone)){ 
           mmscontent += "\n手机：" + info.MobilePhone;
       }
       if(!IsEmpty(info.OtherPhone) ){
           mmscontent += "\n电话：" + info.OtherPhone;
       }
       if(!IsEmpty(info.BusinessFax)){
           mmscontent += "\n传真：" + info.BusinessFax;
       }
       if(!IsEmpty(info.CPZipCode)){
           mmscontent += "\n邮编：" + info.CPZipCode;
       }
       return mmscontent;
   }
};