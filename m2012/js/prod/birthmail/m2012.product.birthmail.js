/**
 * 生日邮件
 */
var BirthRemind = { 
    birdthMan: [],
    cardIdsxx:[10677,10655,10646,10637,10559,10556,158,156,154,151,149,155],
	cardIds:  [694,693,692,691,690,694,693,692,691,690,691,690],
	logger: new top.M139.Logger({name: "m2012.product.birthmail"}),
	addLink:function(){
	  this.init();
	  this.fixBtn();
	  top.BH({actionId: 104191,thingId: 1}); 
	},
   /**
    * 初始化
    */
    init: function () {
        var _document = top.$PUtils.getCurTabWin().document;
        var birthTable = $("#birthRemind2",_document);
         
		var inputEL = null, check = null;
		//上一次最新
		birthTable.find("ul").bind("click", function (e) {
		    e = $(e.target);
		    if (e.attr("tagName") == 'IMG') {
		        inputEL = e.parent().prev();
		        check = inputEL.attr("checked");
		        inputEL.attr("checked", check ? "" : "checked");
		    }
		});
		//这次新加的
		birthTable.find('#moreFriend').bind('click',this.moreFriend);
		this.birthInfo = birthTable.find("#birthInfo");
		
		this.birthInfo.find('img').bind("click", function (e) {
		    e = $(e.target);
		        inputEL = e.parent().parent().parent().find('input');
		        check = inputEL.attr("checked");
		        inputEL.attr("checked", check ? false :true);
		});
      
		$("#sendCard",_document).bind("click", this.sendCard).css('cursor','pointer').removeAttr('href');

    },
  
    moreFriend:function(){
    	var  birthInfo = $('#birthInfo',top.$PUtils.getCurTabWin().document);
	 	birthInfo.find("tr").show();
	 	$('#moreFriend', top.$PUtils.getCurTabWin().document).hide();
	 	top.$(window.parent).trigger('resize');
	 	top.BH({actionId: 104191,thingId: 1}); 
	},
	/**
	 * 发贺卡
	 */
    sendCard: function () {
    	var _self = top.$App.get('birth');
        var _document = top.$PUtils.getCurTabWin().document;
	    _self.birdthMan = [];
        top.BH({ actionId: 101081, thingId: 1, moduleId: 19 });
        //旧版本
        var birthTable = $("#birthRemind2",_document), pEL = null, AddrName, BirDay, mail, gName, MobilePhone;
        birthTable.find("ul input:checked").each(function (i, input) {
            pEL = $(input).parent().find("p");
            BirDay = pEL.find("span").text();
            AddrName = pEL.text().replace(BirDay, "");
            mail = pEL.attr("mail");
            MobilePhone = pEL.attr("mobilephone");
            gName = _self.fetchGNameByMobile(MobilePhone);
            _self.birdthMan.push({ AddrName: AddrName, BirDay: _self.formateTime(BirDay), email: mail, MobilePhone: MobilePhone, fullGroupName: gName });
        });
        
        //新版本
		var  birthInfo = birthTable.find("#birthInfo")
		var tdInfo;
        birthInfo.find("tr:visible input:checked").each(function (i, input) {
		    tdInfo = $($(input).parent().parent().children()[3]);
            pEL = $(tdInfo.children()[0]);
            BirDay = $(tdInfo.children()[1]).text();
            AddrName = pEL.text();
            mail = pEL.attr("mail");
            MobilePhone = pEL.attr("mobilephone");
            gName = pEL.attr('groupname')==='未分组'?MobilePhone:pEL.attr('groupname');
            _self.birdthMan.push({ AddrName: AddrName, BirDay: _self.formateTime(BirDay), email: mail, MobilePhone: MobilePhone, fullGroupName: gName });
        });
		
		
       if(_self.birdthMan.length<=0){
	     top.FF.alert("请选择要过生日的好友!");
		 return;
	   }
        var param = '&birthday=1&singleBirthDay=1&senddate=true&materialId='+_self.cardIds[parseInt(11 * Math.random() + 1)];
        setTimeout("top.Links.show('greetingcard','" + param + "')", 100);
    },
	/**
	 *格式化时间
	 */
    formateTime: function (time) {
        var times = time.split("月");
        return "2011-" + times[0] + "-" + times[1].replace("日","");

    },
	/**
	 *��װ�û�
	 */
	getUser:function(mail){
	  var users = top.$App.get('birth').birdthMan;
	  var len = users.length;
	  var mailDomain= "@"+top.$App.getMailDomain()
	  for(var i= 0;i<len;i++){
	   if(users[i].MobilePhone==mail.replace(mailDomain,"")){
	      return users[i];
	   }
	  }
	  return {};
	},
  /**
    * 发送祝福事件
    * @param {Object}  content邮件内容 to投递给谁 subject主题
    */
    sendTimeMail: function(obj){
        //修改内容
        var date = new Date();
		var year = date.getFullYear();
		var now = date.format("yyyy-MM-dd");
		now = top.$PUtils.dateFormat(now+" 09:00:00");
		this.sucessMobile ={suc:[],fail:[]};
		var count = 0;
		var usersMail = obj.to.replace(/;$/,"").split(";");//已勾选的人
		if(usersMail.length==0){
		  top.FF.alert("请选择即将过生日的好友");
		  return;
		}
		_this = this;
		//邮件回调函数
        var callback = function(data){
		    count++;
		    if(data.code!='S_OK'){
			  _this.sucessMobile.fail.push('error');
			  _this.sucessMobile.suc.pop();
			}
			if(count == usersMail.length){
			  _this.requestBirthHis(_this.sucessMobile.suc);
			}
        }
		var birth,time,dateTime,toUser;
		var diffTime = 0;
		var name= top.$PUtils.userInfo.userName;
		var subject = obj.subject;
		var user;
		var subjectContet;
		//给每个人发送邮件
        for (var i = 0; i < usersMail.length; i++) {
			toUser = usersMail[i];
			if(toUser){
				user  = this.getUser(usersMail[i]);
				birth = user.BirDay.split("-");
				birth[1] = top.$PUtils.fixTime2Str(birth[1]);
				birth[2] = top.$PUtils.fixTime2Str(birth[2]);
				time = "" + year + "-" + birth[1] + "-" + birth[2] + " 09:00:00";
				dateTime = top.$PUtils.dateFormat(time);
				diffTime = top.$Date.getDaysPass(now, dateTime);
				//比较时间 显示不同的主题
				if(obj.isDefiniteTime){
					if (diffTime < 0) {//迟到的邮件
						subjectContet = "迟到的祝福，"+subject;
						dateTime = null;
					}else if(diffTime==0){//当天直接发送
						dateTime = null;
						subjectContet = subject;
					}else if(diffTime>=0){
					  subjectContet = subject;
					}
				}else{
				  subjectContet = subject;
				  dateTime = null;
				}
				this.saveMail({subject: subjectContet, content: obj.content,time: dateTime,toEmail:toUser,priority:obj.priority,returnReceipt:obj.returnReceipt,callback:callback});
			}
		}
    },

	/**
	 * 发邮件
	 * @param {} Info
	 */
    saveMail: function(Info){
        var mailInfo = {
            account: top.UserData.DefaultSender,
            to: [Info.toEmail],
            isHtml: true,
            subject: Info.subject,
            content: Info.content,
			singleSend:true,
            priority: 3, 
            sendReceipt: Info.sendReceipt,
			saveToSent:true,
			showOneRcpt:false,
            timeset: Info.time,
            callback: Info.callback
        };
        top.CM.sendList = [];
        top.CM.sendList.push({
            action: Info.time ? "schedule" : "deliver",
            subject: Info.subject,
            to: [Info.toEmail]
        });
		this.sucessMobile.suc.push(Info.toEmail);
        top.CM.sendMail(mailInfo,"greetingCard");
    },
	/**
	 *�����Ѿ����ͺؿ�
	 */
	requestBirthHis:function(mails){
	    var self = top.$App.get('birth');
		var birthUsers = this.buildBirthHisParam(mails);
		var options = {op:'set',mobiles:birthUsers};
        top.M139.RichMail.API.call("card:birthdayRemind", options, function (response) {
        	if(!(response.responseData&&response.responseData.code==='S_OK')){
        		self.logger.error("card:birthdayRemind", "[card:birthdayRemind]", response);
        	}
        });
	},
	/**
	 * 获取发生日邮件的人
	 * @param {} mails
	 * @return {}
	 */
	buildBirthHisParam:function(mails){
	   var users = top.$App.get('birth').birdthMan;
	   var hisParam=[];
	   var year = new Date().getFullYear();
	   var mailLength = mails.length;
	   var userLength = users.length;
	   var bithDay,sendDay,user;
	   for(var i=0;i<mailLength;i++){
	       user =  top.$App.get('birth').getUser(mails[i]);
			bithDay = user.BirDay.split("-");
			sendDay = year + "-" + bithDay[1] + "-" + bithDay[2];
			hisParam.push(user.MobilePhone+","+sendDay+";");
			top.BH({actionId: 104191,thingId: 1}); ({ actionId: 103663, moduleId: 13 });
	   }
	  return hisParam.join('').replace(/;$/,"");
	},
	/**
    * 获取分组
    */
	fetchGNameByMobile:function(mobileNumber){ 
	    var gName = '';
	    var _contacts = top.Contacts.getContactsByMobile(mobileNumber);
	    //取到这些联系人所在的所有组名 
	    var _groupNames = $.map(_contacts, //循环每个手机号里的SerialId
             function (i) {
                 return $.map($.grep(top.Contacts.data.map,
                 function (j) { return j.SerialId == i.SerialId }),//查询在group中是否找到相应的SerialId
                 function (k) {
                     var group = top.Contacts.getGroupById(k.GroupId);
                     if (group) {
                         return group.GroupName;
                     }
                     
                 });
             });//找到之后返回数组中
	    if (_groupNames[0]) {
	        if (_groupNames[0].getBytes() > 20) {
	            gName = _groupNames[0].getLeftStr(20) + '...';
	        } else {
	            gName = _groupNames[0]
	        }
	    }
	 return gName;
    },
	  //屏蔽掉以前的页面
	fixBtn:function(){
        var _document = top.$PUtils.getCurTabWin().document;
        var birth_content = _document.getElementById("birth_content");
		if(birth_content){
			//修正链接头像
			var imgs  =  $(birth_content).find('div.f_li img');
			var imgsLen = imgs.length-1;
			var imgSrc = '';
			for(var j=0;j<=imgsLen;j++){
				imgSrc = $(imgs[j]).attr('src');
				$(imgs[j]).attr('src',BirthRemind.getImageSrc(imgSrc));
			}
			//修改连接
			var htmlStr = birth_content.innerHTML;
			htmlStr = htmlStr.replace(/(href)(="")/g, "");
			htmlStr = htmlStr.replace("target=_blank","");
			
			htmlStr = htmlStr.replace(/birthck/g, "onclick=\"javascript:top.FF.alert('请查看升级版!');\"");
			birth_content.innerHTML = htmlStr;
			//修改个人生日信息
			var myBirthInfolink = _document.getElementById("birth_info");
			$(myBirthInfolink).removeAttr("target");
			//查询用户是否设置了生日
			top.Contacts.QueryUserInfo(function(result) {
				if (result&&result.info&&result.info.BirDay) {
					myBirthInfolink.style.display = "none";
				}else {
					myBirthInfolink.style.display = "";
					myBirthInfolink.href = "javascript:setTimeout(top.Links.show('baseData');";
				}
			});
			//发送祝福
			var sendWidsh = _document.getElementById("sendWish");
			$(sendWidsh).removeAttr("target");
			$(sendWidsh).attr('href',"javascript:javascript:top.FF.alert('请查看升级版!');");
		}
	}
}
