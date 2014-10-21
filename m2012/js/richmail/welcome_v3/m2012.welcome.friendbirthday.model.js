/**
* @namespace 
* 欢迎页
* BirthdayModel
*/

M139.namespace("M2012.Welcome.FriendBirthday.Model",Backbone.Model.extend({

    defaults:{
        birthdayData:null,
        data: null,
	    isBirthdayLinkExist: false //生日提醒链接是否存在
	},
	getCardRemind:function(callback){
        var self = this;
        var options = {op:'get'};
        top.M139.RichMail.API.call("card:birthdayRemind", options, function (response) {
            if (response.responseData && response.responseData.code == "S_OK") {
                callback && callback(response.responseData["var"]);
            } else {
                callback({"mobiles":[]});
                self.logger.error("welcome.card:birthdayRemind data error", "[card:birthdayRemind]", response)
            }
        });
	},
	removeRemBirthMan:function(mobiles,birthData){
	    var mobile,lastBirthData = [],strMobiles = mobiles.join(',');
		$.each(birthData,function(index,item){
			  item.AddrName = item.AddrName;
			  mobile = item.MobilePhone?item.MobilePhone:"";
			  if(strMobiles.indexOf(mobile.replace(/^86/,''))<=-1){
			    lastBirthData.push(item);
			  }
		});
	   return lastBirthData;
	},
	
	//哪些需要显示
	buildBirthUser:function(birhMans,actualLen){
	  var newObject = jQuery.extend(true, [], birhMans);
	  var birthAdds = [],max_ch_count = (82/580)*actualLen-34;
	  var trueName,groupName,showName;
	  for(var i =0;i<newObject.length;i++){
		  trueName = newObject[i].AddrName;
		  groupName = newObject[i].groupName;
		  if(!groupName){
		    showName = trueName;
		  }else{
		   showName = trueName+"("+groupName+")";
		  }
		  birthAdds.push(showName);
	     if(this.isCHOverFlow(birthAdds.join(''),max_ch_count)){
		     birthAdds.pop();
	     }
	}
    return birthAdds;
   },
   //筛选名称与别名与组
	composeUserName:function(birhMans){
		 for(var i =0;i<birhMans.length;i++){//
			 var mobile = birhMans[i].MobilePhone.replace(/^86/,"");
			 var email =  birhMans[i].FamilyEmail;
			 var AddrName = birhMans[i].AddrName;
			 var Info = top.Contacts.getContactsByMobile(mobile)[0],groupName,fullGroupName,trueName;
			 if(!Info){
			   Info = top.Contacts.getContactsByEmail(email)[0]
			 }

			 var name = Info?Info.name:"";//name是对方设置的
			if(name||AddrName){
			    if(name!=mobile){
				  trueName = name;
				}else{//取他自己设置的姓名与别名
				  trueName = AddrName;
				}
				groupName = this.fetchGNameByMobile(mobile);
				birhMans[i].fullGroupName = groupName;
				if(top.$T.Utils.getBytes(groupName)>20){
				  birhMans[i].fullGroupName = groupName.substring(0,10)+'...';;
				}else{
				  birhMans[i].fullGroupName = groupName;
				}
				if(top.$T.Utils.getBytes(groupName)>8){
				 birhMans[i].groupName = groupName.substring(0,4)+'...';
				}else{
				 birhMans[i].groupName= groupName;
				}
			    //原有的数据
				birhMans[i].addrName = birhMans[i].AddrName;
				//为了再贺卡中显示正确
				birhMans[i].AddrName = trueName;
				if(!trueName){
				 birhMans.splice(i,1);
				 --i;
				}				
			}else{
				birhMans.splice(i,1);
				--i;
			}
		}
	},
	fetchGNameByMobile:function(mobileNumber){
	    var gName = '';
	    var _contacts = top.$App.getModel("contacts").getContactsByMobile(mobileNumber);
	    //取到这些联系人所在的所有组名 
	    var _groupNames = $.map(_contacts, //循环每个手机号里的SerialId
             function (i) {
                 return $.map($.grep(top.Contacts.data.map,
                 function (j) { return j.SerialId == i.SerialId }),//查询在group中是否找到相应的SerialId
                 function (k) {
                     var group = top.$App.getModel("contacts").getGroupById(k.GroupId);
                     if (group) {
                         return group.GroupName;
                     }
                     
                 });
             });//找到之后返回数组中
	    if (_groupNames[0]) {
	        if (top.$T.Utils.getBytes(_groupNames[0]) > 20) {
	            gName = _groupNames[0].substring(0, 10) + '...';
	        } else {
	            gName = _groupNames[0]
	        }
	    }
	    return gName;
    },
	//长度控制
   isCHOverFlow:function(str,len){
		return top.$T.Utils.getBytes(str)>len;
   },
   //避免将&-->再次转码
   htmlEnCodeBirth:function(users){
		$.each(users,function(index,item){
		    if (!users[index].isEncode) {
		        users[index].AddrName = top.$T.Utils.htmlEncode(item.AddrName);
		        users[index].addrName = top.$T.Utils.htmlEncode(item.addrName);
		        users[index].groupName = top.$T.Utils.htmlEncode(item.groupName);
		        users[index].fullGroupName = top.$T.Utils.htmlEncode(item.fullGroupName);
		        users[index].isEncode = true;
		    }
		});
		return users;
   }
}));