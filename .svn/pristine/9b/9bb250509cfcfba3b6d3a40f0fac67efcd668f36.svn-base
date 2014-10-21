/**
 * 签到
 */
var CheckIn = {
    state: 0,
    isCheck:false,
    invitePhizseq: '42',//邀请好友签到表情
	inviteCount:6,
    ckSelfIndex: 0,
    ckFriendIndex: 0,
    maxStrCount: 70,
    maxInviterCount: 50,
    maxInviterLen :43,
    left:0,
    top: 0,
    currentYear:new Date().getFullYear(),
    friendChecked  : false,
    isLoadFaceImg  :true,
    defaultTxtTip: "快来发布你的签到吧！",
	feelText:[],
    checkTxtValue:"",
    sendCkTxtTip: "请先选择表情再发布签到！",
    inviteMaxCountTip: "一次最多邀请<font style='color:red;'>50</font>个好友哦!",
    inviteTipTxt: '最多可同时邀请50人，以“;”号隔开，输入任意邮箱和移动手机号都能邀请哦！',
    vSucHtml   :[ '<p class="yq-ok"><i class="i_ok mr_5"></i>你已成功发送邀请给好友！</p><div class="qd-yqbg">',
                     '<div class="imgInfo">',
                         '<img src="{imgSrc}" width="20" class="imgLink" alt="">',
                         '<dl>',
                             '<dd id="inviteText" style="word-wrap:break-word;word-break:break-all;">{inviteFriends}</dd>',
                         '</dl>',
                     '</div>',
                 '</div><div class="text-a pt_15">',
                     '<a href="javascript:{sendCheck};void(0);"  class="qd-yqbtn">发布此签到</a>',
                 '</div>'].join(""),
    vLockHtml  :"<i class='i_lock'></i>",
    vMainHtml  :[ '<div class=\'qd-time\'>',
				    '{time}<br>',
				    '<strong>{date}</strong>',
			     '</div>',
			     '<div class=\'qd-face\'>',
				     '<img id="ckMainImg" src=\'{imgSrc}\'  class=\'img_face_class\' onclick=\"{showface};top.addBehaviorExt({actionId:102147, thingId:1,pageId:10011,actionType:20,moduleId:13});\"      width=\'40\' height=\'40\'>',
			     '</div>',
			     '<div class=\'qd-btn\'>',
				     '<a class=\'sl-rc\'>',
					    '<span class=\'sl-rc-cnt\'>',
					       '<span class=\'sl-rc\'>',
						       '<span class=\'sl-rc-cnt\' onclick=\"{showface};top.addBehaviorExt({actionId:102147, thingId:2,pageId:10011,actionType:20,moduleId:13});\">签到</span>',
					      '</span>',
					    '</span>',
				    '</a>',
				    '<p id="ckPrompt">{ckPrompt}</p>',
			     '</div>'].join(""),
    vImgHtml: "<a title='{title}'><img id='{id}' name='{name}' unlockday='{unlockday}' style='cursor:{cursor};'  src='{path}' feel='{feel}'>{lock}</a>",
    vFaceHtml  :[ '<div class="tips qd-tips" id="checkDiv"  style="top:{top}px;left:{left}px;z-index: 100;">',
			     '<a href="javascript:CheckIn.close();" class="i_close i_u_close"></a>',
			     '<div class="tips-text">',
				     '<p class="qd-top">本月已有<span class="yelc" id="signcount">0</span>人签到哦</p>',
				     '<div id="checkin_Container" style="height:264px;overflow:hidden;position: relative;">{loading}',
					    '<div id="ckFeel"><div  class="qd-facelist"></div>',
					    '<div class="qd-textarea">',
						    '<span id="cIcon"></span><textarea    id="checkTxt" cols="30"  onpropertychange="CheckIn.countChar();" oninput="CheckIn.countChar();"   rows="10" style="width:100%;"></textarea>',
						    '<p><span id="c_chars"><font style="color:red;">0</font>/70</span></p>',
					    '</div>',
				      '</div><div id="ckFriend"><div class="qd-body" >{ckFriend}</div></div><div id="ckSelf"><div class="qd-body">{ckSelf}</div></div><div id="ckTail" ><div class="qd-body">{ckTail}</div></div></div>',
				      '<div  class="qd-bottom"><div class="qd-ok" style="display:none;">请选择表情，再发布签到</div>',
					     '<a class="sl-rc fr" id="sendCheck" onclick="{sendCheck}">',
					       '<span class="x sl-rc-cnt">',
						      '<span class="sl-rc">',
						       '<span class="x sl-rc-cnt" id="sendTxt">{sendTxtName}</span>',
						      '</span>',
					       '</span>',
					     '</a>',
					     '<p id="ckHand"><a href="javascript:void(0);" id="afd"  onclick="{friendFace}">好友签到</a> | <a href="javascript:void(0);"  onclick="{selfFace}" id="asf">我的签到</a></p>',
				      '</div>',
			     '</div>',
			     '<div class="tipsTop diamond"></div>',
		     '</div>'].join(""),
    vFriendHtml: ['<p class="gray text-a pt_10"  >目前还没有好友签到哦，<br>赶快喊他们一起来玩吧！</p>',
              '<div class="qd-yqbg">{inviteFriends}</div>',
              '<div class="text-a pt_15">',
                  '<a  href="javascript:{inviteHander}" class="qd-yqbtn">邀请好友</a>',
              '</div>'].join(""),
    vLabelCheck: '<label title={title}><input checked  type="checkbox"  name={name} class="mr_5"  email={email}>{name}</label>',
    vSelfHtml  :[  '{time}<p class="gray text-a pt_10" >您还没有发布任何签到哦！</p>',
                 '<div class="text-a pt_15">',
                    '<a class="sl-rc" onclick="CheckIn.sendCheck(\'toCheck\');">',
                   '<span class="sl-rc-cnt">',
                      '<span class="sl-rc">',
                       '<span class="sl-rc-cnt">',
                         '立即签到',
                       '</span>',
                      '</span>',
                   '</span>',
                 '</a></div>'].join(""),
    vCheckHtml :[ '<div class="imgInfo imgqdlist">',
                     '<img src="{faceSrc}" style="cursor:{cursor};margin-left:2px;" upface={upface} width="40" height="40px"  class="imgLink" title="{title}">',
                     '<dl>',
                         '<dt><span class="fr gray" style="margin-right:4px;">{time}</span><span title={userName} class="textov">{userName}</span></dt>',
                         '<dd>',
                             '<div class="imgInfo">',
                                 '<img src="{imgSrc}" width="20" height="20" class="imgLink" alt="">',
                                 '<dl>',
                                     '<dd isfull={isfull} fullContent="{fullContent}" style="text-overflow: ellipsis;overflow: hidden;max-height:55px;word-wrap:break-word;word-break:break-all;" class="gray">{ckContent}</dd>',
                                 '</dl>',
                             '</div>',
                         '</dd>',
                     '</dl>',
                 '</div>'].join(""),
    vTimeHtml:[ '<div class="qd-date">',
                     '<div class="qd-datediv"> </div>',
                     '<span class="qd-datenum">{time}</span>',
                 '</div>'].join(""),
    vTipHtml: ['<div id="lockTip" class="tips qd-ytips qdday-ytips" style="z-index:101;top:-64px;left:10px;z-index: 999;padding: 5px 5px;display:none;word-wrap:break-word;word-break:break-all;">',
                     '<div class="tips-text"></div>',
                     '<div class="tipsBottom diamond"></div>',
                 '</div>'].join(""),
     loading: '<div id="loading"  class="glass" style="position:absolute;z-index:1px;height:{height};width:{width}"><div class="qd-body"><div class="loadingInfo" >加载中，请稍候........</div></div></div>',
     lastInviteTipTxt:'还可以填写<span class="red ml_5 mr_5">{count}</span>人',
     inteface: '{part}s?func=poperations:',
     logger:   new top.M139.Logger({name: "checkin"}),
	 userMail:  null,
     funcs:['poperations:signInit','poperations:queryphiz','poperations:publishedsign','poperations:querysign','poperations:invitefriends','poperations:checkinviteadd'],
    /**
     *初始化入口界面
     */
     init: function () {
         //CheckIn.getRequestUrl(0,null,function(data){
         var self = this;
         top.M139.Timing.waitForReady("top.$App.getConfig('signInInfo')", function () {
             self.userMail = top.$User.getShortUid() + "@" + top.coremailDomain;
            var data = top.$App.getConfig('signInInfo');
        	    if (data) {
                    CheckIn.isCheck = data.signed>0?true:false;
                    //if (data.code == 'S_OK') {
                    var param = {
                         time: data.date,
                         date: data.week,
                         imgSrc: CKUtils.getImageUrl(data.signIcon),
                         ckPrompt:data.prompt,
                         showface: "void(0);"
                     };
					 $("#adv1").html($TextUtils.format(CheckIn.vMainHtml, param)).addClass("qingdao clearfix");
					 
					 // add by tkh 打开添加日程提醒页签并上报日志
					 $("#adv1 > div.qd-time").click(function(event){
					 	BH({key : "welcome_checkin_calendar"});
					 	top.$App.show('addcalendar', {ywextend : 'checkin'});
					 });
					 
					 $GlobalEvent.on("click",function(obj){
					    var e = obj.event;
						var target = e.target || e.srcElement;
                         if (target.className === 'sl-rc-cnt' || target.className == 'img_face_class') {
                             CheckIn.showface();
                             return;
                         }
                         if (CKUtils.containsElement($("#checkDiv")[0], target)) {
                             CheckIn.close();
                             return;
                         }
					});
                 } else {
                  	//CheckIn.logger.error("poperations:signInit","[poperations:signInit]", data);
                 }
             
         
         });
	},

    /** 签到初始化数据 */
    getSignInitData:function(callback){
      top.M139.Timing.waitForReady("$App.getConfig('signInInfo')", function () { 
          
      });
    },


     /**
      * 获取请求地十
      * @param {Object} type
      */
     getRequestUrl: function (type,data,callback,option) {
          top.M139.RichMail.API.call(CheckIn.funcs[type],data, function (response) {
				if (response.responseData) {
			        callback(response.responseData);
            }
			  },option);
     },
   /**
    * 显示发布签到
    * @param {Object} e
    */
    showface: function (e) {
        var position = $("#adv1").position();
	    var left = position.left;
	    var topz = position.top+$("#adv1").outerHeight()+4;//4为箭头的高度
        //行为统计
       if(CheckIn.state>0){
          $('#checkDiv').css({'visibility':'visible',left:left,top:topz});
		  CheckIn.ckFeel.css("height",'264px').show();
		  CheckIn.ckFriend.css("height",'0px');
		  CheckIn.ckSelf.css("height",'0px');
		  CheckIn.ckTail.css("height",'0px');
		  $("#asf").css("font-weight","normal");
		  $("#afd").css("font-weight","normal");
	      $("#sendTxt").text("发布签到");  
          if(CheckIn.loadingEL)CheckIn.loadingEL.hide();
		  if(document.getElementById('sendCheck')){
			document.getElementById('sendCheck').onclick = function(){
			  CheckIn.sendCheck(this);
			 }
		 }
		  return;
	    }
        //确定界面位置
	  
	    this.left = left;
	    this.top = topz;
	
	    var param = {
		    top       :topz,
		    left      :left,
		    sendCheck :"CheckIn.sendCheck(this);",
		    friendFace:"CheckIn.friendFace(this);",
		    selfFace  :"CheckIn.selfFace(this);",
		    ckFriend  :'',
		    ckTail: '',
		    signcount: 0,
		    sendTxtName:"发布签到",
	        loading   :$TextUtils.format(CheckIn.loading,{width:'230px',height:'264px'}),
	        ckSelf: $TextUtils.format(CheckIn.vSelfHtml, { inviteHander: "CheckIn.inviteHander();", time: CheckIn.vTimeHtml})
	    };
	    CheckIn.mainEl = $("body");//$('#divMain', top.window.document);
	    CheckIn.mainEl.append($TextUtils.format(CheckIn.vFaceHtml, param)).append(CheckIn.vTipHtml);
	    var callback = function (data) {
	        if (data) {
	            if (data.code == 'S_OK') {
	                //确定图片
	                var signcount = data.signcount;//人数
	                var signday = data.signday;//签到天数
	                var feelImgs = CheckIn.loadImg(data['phizrecord'], signday);
	                //保存相关元素
	                CheckIn.loadingEL = CheckIn.mainEl.find("#loading");
	                CheckIn.checkTxtEL = CheckIn.mainEl.find("#checkTxt");
	                CheckIn.ckFriend = CheckIn.mainEl.find("#ckFriend");
	                CheckIn.ckSelf = CheckIn.mainEl.find("#ckSelf");
	                CheckIn.ckFeel = CheckIn.mainEl.find("#ckFeel");
	                CheckIn.ckTail = CheckIn.mainEl.find("#ckTail");
					CheckIn.lockTip = CheckIn.mainEl.find("#lockTip");
                    //表情提示
					CheckIn.ckFeel.find(".qd-facelist").html(feelImgs).bind('click', CheckIn.changeFeel).bind('mouseover', CheckIn.mouseOver).bind('mouseout', CheckIn.mouseOut);

	                CheckIn.ckFriend.bind('click', CheckIn.ckFriendHand);
					//滚动
	                CheckIn.ckFriend.find(".qd-body").scroll(CheckIn.scroll);
	                CheckIn.ckSelf.find(".qd-body").scroll(CheckIn.scroll);
					
	                CheckIn.divHight = CheckIn.ckFriend.find(".qd-body").height();
                   

	                CheckIn.checkTxtEL.val(CheckIn.defaultTxtTip).addClass('gray');
	                CheckIn.checkTxtEL.bind('focus', CheckIn.checkTxtFocus).bind('blur', CheckIn.checkTxtblur).bind('keyup', CheckIn.countChar).bind('keydown',CheckIn.checkTxtKeyhander);
	                CheckIn.width = $('#checkDiv').width();
	                $('#signcount').text(signcount)
	                CheckIn.checkTxtValue = CheckIn.defaultTxtTip;
	                CheckIn.loadingEL.hide();
	            }
	        }
	    };
	    CheckIn.getRequestUrl(1,null,callback);
	    CheckIn.state = 3;//防止重新加载多次
    },
	/**
	 * el
	 * @param {Object} el
	 */
    scroll: function (el) {
       var type = $(el.target).parent().attr("id");
       var data = CheckIn.buildQueryData(type);
       if (!data)  return;//已超过查询记录数
       var scrollHight = $(this)[0].scrollHeight;
       var scrollTop = $(this)[0].scrollTop;
       if (scrollTop + CheckIn.divHight >= scrollHight-1) {
           var callback = function (data) {
               if (data) {
                   if (data.code == 'S_OK' && data.exist > 0) {
					    CheckIn.insertSignrecordHtml(type,data.signrecord);
                   }
               }
               CheckIn.loadingEL.hide();
           }
           setTimeout(function () {
               CheckIn.loadingEL.show();
			   CheckIn.getRequestUrl(3,data,callback);
           },700)
          
       };
    },
   /**
    * 加载表情 1、图片提示 2、是否枷锁
    * @param {Object} data
    */
    loadImg: function (data, signday) {
        var imgs = [], vImgHtml;
        var feels = data || [];
        var feel,lockTime, isLock = true;
        for (var item in feels) {
            feel = feels[item];
			if(feel.signdesc){
			  CheckIn.feelText.push(feel.signdesc);
			}
            feel.unlockday -= signday;
            unlockday = feel.unlockday;
            isLock = feel.unlockday>0?true:false;
            vImgHtml = $TextUtils.format(CheckIn.vImgHtml, { id: feel.phizseq, unlockday: unlockday, name: feel.phizpath, path: CKUtils.getImageUrl(feel.phizpath), cursor: isLock ? '' : 'pointer', title: feel.phizname, feel: feel.signdesc, lock: isLock ? CheckIn.vLockHtml : "", size: 40 });
            imgs.push(vImgHtml);

        }
        return imgs.join("");
    },
     /**
      *自动联系人输入框 
      */
     inputMailUI: function () {
     	var callback = function (data) {
            if (data) {
                if (data.code == 'S_OK') {
                    if (data.legitimate == 'false') {
                        callback.obj.error = true;
                        callback.obj.errorMsg = "该好友已经被邀请过!";
                        CheckIn.ckFriend.find(".qg-slbgtop-x").show().text("该好友已经被邀请过!");
                    }
                }
            }
        }
         CheckIn.$ckreceivers = document.getElementById("ckreceivers");
		 CheckIn.richInput = M2012.UI.RichInput.create({
		        container:CheckIn.$ckreceivers,
		        maxSend : 50,
		        preventAssociate:true,
		        type:"email",
		        errorfun:function(obj, text){
		        	
		        	//是否为移动的号码
		        	CheckIn.errorChinaMobilefun(obj, text);
	                if (obj.error) {
	                    CheckIn.ckFriend.find(".qg-slbgtop-x").show().text(obj.errorMsg);
	                    return;
	                };
	                  //地址是否存在
	                var splitMail =top.$PUtils.getEmail(text);
	                if (!splitMail[1]) {
	                    return;
	                }

	                 //校验是否已经邀请
	                callback.obj = obj;
	                callback.text = text;
	 
	                var data = "<object><string name='mail'>" + splitMail[1] + "</string></object>";
	                
	                CheckIn.getRequestUrl(5,data,callback,{async:false});
	                

		        },
		        change:function(addr){
		        	var sendMan = CheckIn.richInput.getItems();
		        	
	                var len = sendMan.length;
	                var difLen = CheckIn.maxInviterCount - len;
	                if (len == 0) {
	                    CheckIn.ckFriend.find(".qg-slbgtop-x").hide();
	                    return;
	                }
	 
	                if (!CheckIn.richInput.getErrorText()) { //没有错误的,隐藏提示
	                    CheckIn.hideTips();
	                }
                    if (CheckIn.richInput.getErrorText()) { //存在输入错误
                        for (var i = 0; i < sendMan.length; i++) {
                            if (sendMan[i].error) {
                                if (sendMan[i].errorMsg.match("该好友已经被邀请过!")) {
                                    CheckIn.ckFriend.find(".qg-slbgtop-x").show().text("输入框中有被邀请过的好友");
                                } else {
                                    CheckIn.ckFriend.find(".qg-slbgtop-x").show().text(sendMan[i].errorMsg);
                                }
                                return;
                                break;
                            }
                        }
                     }
		          	CheckIn.$ckreceivers.scrollTop=CheckIn.$ckreceivers.scrollHeight;;
		       }
		          
		    }).render();
		if($.browser.msie && ($.browser.version <= "7.0")){
			 if($.browser.version == "7.0"){
				$("#ckreceivers").find('.ItemContainer').css("border-color","#fff");
			 }
			 $("#ckreceivers").find('.ItemContainer').css({'height':'56px','width':'200px','overflow-y':"auto"});
             $("#ckreceivers").css({'height':'65px','overflow-x':"hidden",'overflow-y':"auto",'position':'relative'});
         }else{
           $("#ckreceivers").css('min-height','56px');
           $("#ckreceivers").find('.ItemContainer').css('min-height','56px');
         }
		 $("#ckreceivers").children().css("z-index",0);
        CheckIn.richInput.on("itemchange",function(a){
        	var sendMan = CheckIn.richInput.getItems();
        	if(sendMan.length==0||!CheckIn.richInput.getErrorText()){
        		 CheckIn.ckFriend.find(".qg-slbgtop-x").hide();
        	}
        	
        });
     },
     errorChinaMobilefun:function(obj,text){
         var isNotRightFormat = CKUtils.checkMail(text);
         if ('noFullNum' == isNotRightFormat) {
             obj.error = false;
             obj.errorMsg = "";
             return;
         }
         if (isNotRightFormat) {
             obj.error = isNotRightFormat;
             if (!top.$T.Email.isEmailAddr(top.$PUtils.getEmail(text)[1])) {
                 obj.errorMsg = "该地址格式有误，请双击修改";
             } else {
                 obj.errorMsg = "暂不支持联通与电信号码，请双击修改";
             }

         }
     },
   /**
    * 邀请好友签到
    * @param {Object} e
    */
     inviteHander: function (e) {
         var mails = [], userNames = [],names = [],allNames=[], errorText, name,nameEL,len,el;
         if(CheckIn.friendChecked==2){//好友邀请一
             var ckfriends = CheckIn.ckFriend.find(".qd-yqbg").find('input:checkbox:checked'),len = ckfriends.length;
             for (var i = 0; i < ckfriends.length; i++) {
                 el = $(ckfriends[i]);
                 name = top.$PUtils.getLeftStr(el.attr('name'),12);//11个字符
                 mails.push(el.attr('email'));
                 names.push(name);
                 if (names.join(",").length <= CheckIn.maxInviterLen) {
                     nameEL = "<strong>" + name + "</strong>";
                     userNames.push(nameEL);
                 }
                 allNames.push( el.attr('name'));
             }
         }else if(CheckIn.friendChecked==3){//好友邀请二
             var mails = CheckIn.richInput ? CheckIn.richInput.getItems() : [];
             len = mails.length;
             for(var i=0;i<mails.length;i++){
                 if(mails[i].error){
                     errorText = mails[i].errorMsg;
                     break;
                 }
             }
             if (errorText) {
                 CheckIn.ckFriend.find(".qg-slbgtop-x").show().text(errorText);
                 return;
             } else {
                 var mailsplit = [];
                 for (var i = 0; i < len; i++) {
                     mailsplit = top.$PUtils.getEmail(mails[i].allText);
                     name = top.$PUtils.getLeftStr(mailsplit[0],12);
                     names.push(name);
                     if (names.join(",").length <= CheckIn.maxInviterLen) {
                         nameEL = "<strong>" + name + "</strong>";
                         userNames.push(nameEL);
                     }
                     mails[i] = mailsplit[1];
                     allNames.push(mailsplit[0]);
                 }
             }
         }
         //////////////////////////////////////////////////////////////////////////////////////
	    if(mails.length==0){//显示提示
	        if (CheckIn.friendChecked == 2) {
	         CheckIn.lockTip.find('.tipsBottom').hide();
	            CheckIn.showTips({ top: 30, left: CheckIn.width / 2 - 50 }, "请先勾选相关好友!");
	            CheckIn.lockTip.fadeOut(3000,function(){
	                CheckIn.lockTip.find('.tipsBottom').hide();
	            });
	            
	        } else {
			     CheckIn.showInviteInput();
	             CheckIn.ckFriend.find(".qg-slbgtop-x").show().html("请填写邮箱地址或移动号码!");
				
	        }
	        return;
	    } else if (len > CheckIn.maxInviterCount) {//邀请人数超过规定人数
	        CheckIn.lockTip.find('.tipsBottom').hide();
	        CheckIn.showTips({ top: 100, left: CheckIn.width / 2 - 40 }, CheckIn.inviteMaxCountTip);
	        CheckIn.lockTip.fadeOut(3000, function () {
	            CheckIn.lockTip.find('.tipsBottom').show();
	        });
	        return;
	    }else{
	        //调用接口
	        var callback = function (data) {
	            if (data) {
	                if (data.code == 'S_OK') {
	                    //成功之后发送日志
	                    CheckIn.sendSucLog(data.successcount);
	                    var isAll = userNames.length < mails.length, rightNames = [];
	                    var strNames = allNames.join(",");
	                    var inviteFriends = "我邀请了" + userNames.join(",")  + (isAll ? "等" : "") + "<font class='yelc' title='" + strNames + "'>" + (isAll?mails.length:"") + "</font>"+(isAll?"位好友":"")+"参加签到。";
	                    
						CheckIn.ckTail.find('.qd-body').html($TextUtils.format(CheckIn.vSucHtml, { 'imgSrc': CKUtils.getImageUrl("0"+CheckIn.invitePhizseq+".gif"), 'sendCheck': "CheckIn.sendCheck('suc');", inviteFriends: inviteFriends }));
						CheckIn.ckTail.show();	                    
						if($.browser.msie){//IE6处理
	                          CheckIn.ckSelf.hide();
                              CheckIn.ckFriend.hide();
                              CheckIn.ckFeel.hide();
                              CheckIn.ckTail.show();
	                      }else{
                             CheckIn.ckSelf.animate({ height: 0 }, "slow");
                             CheckIn.ckFriend.animate({ height: 0 }, "slow");
                             CheckIn.ckFeel.animate({ height: 0 }, "slow");
                             CheckIn.ckTail.animate({ height: 264 }, "slow");
                           }
	                    setTimeout(function () {
	                        CheckIn.showInviteTips(); //邀请完显示初始界面
	                        if(CheckIn.richInput)CheckIn.richInput.clear();//清除已邀请的好友
	                    },1000);
	                } else {//邀请失败
	                    CheckIn.lockTip.find('.tipsBottom').hide();
	                    CheckIn.showTips({ top: 55, left: 10 }, data.resultMsg || data.code,180);
	                    CheckIn.lockTip.fadeOut(2000,function(){
                            CheckIn.lockTip.find('.tipsBottom').show();
	                    });
	                }
	            }
	            
	        }
	        var initData = "<object><string name='mails'>" + mails.join(",") + "</string><string name='senderName'>" + top.$T.Utils.htmlEncode(top.$PUtils.userInfo.userName) + "</string></object>";
			CheckIn.getRequestUrl(4,initData,callback);
	    }
     },
     sendSucLog: function (successcount) {
         for (var i = 0; i <= successcount; i++) {
             top.addBehaviorExt({ actionId: 102151, pageId: 10544, actionType: 20,thingId:1 });
         }
     },
   /**
    * 显示提醒内容
    * @param {Object} pos
    * @param {Object} text
    * @param {Object} width
    */
     showTips:function(pos,text,width){
         pos = pos||{left:0,top:0};
         if (!width)   width = 80;
         CheckIn.lockTip.css({width: width,left: CheckIn.left + pos.left, top: CheckIn.top + pos.top }).show().find(".tips-text").html(text);

     },
	 /**
	  *解决显示问题
	  */
	  showfullTips:function(pos,text,width){
         pos = pos||{left:0,top:0};
         if (!width)   width = 80;
         CheckIn.lockTip.css({width: width,left: 1500, top: CheckIn.top + pos.top }).show().find(".tips-text").text(text);
         var height =  CheckIn.lockTip.outerHeight();
		 CheckIn.lockTip.css({width: width,left: CheckIn.left+ pos.left, top: CheckIn.top + pos.top-height });
     },
	 /**
	  * 隐藏tips
	  */
     hideTips:function(){
         if (CheckIn.lockTip) CheckIn.lockTip.hide();
     },
     /**
      *显示邀请朋友的输入框
      */
     showInviteInput: function () {
		$("#inviteTips").hide();
		if (CheckIn.richInput&&!CheckIn.richInput.getErrorText()) {
		    CheckIn.hideTips();
		}
		$("#ckreceivers").show();
		$(".addrText").children().focus();
     },
     /**
      *显示邀请朋友提示
      */
     showInviteTips:function(){
	    $("#inviteTips").show().html(CheckIn.inviteTipTxt);
	    $("#ckreceivers").hide();
	    CheckIn.hideTips();
	    CheckIn.ckFriend.find(".qg-slbgtop-x").hide();
     },
  /**
   * 好友签到,1、没有好友签到 2、具有好友签到历史
   * @param {Object} el
   */
     friendFace: function (el) {
	    if(!CheckIn.lockTip) return;
	    top.addBehaviorExt({ actionId: 102148, thingId: 1, pageId: 10544, actionType: 20, moduleId: 13 });
		
	    CheckIn.lockTip.hide();

        if (CheckIn['ckFriendIndex'] >= 1) {
            CheckIn.friendUIAnimate(el);
            return;
        }
        var callback = function (data) {
          CheckIn.loadingEL.hide();
          if (data) {
              if (data.code == 'S_OK') {
                  if (data.exist > 0) {//存在好友签到
                      CheckIn.friendChecked = 1;
                      CheckIn.ckFriendcurmaxrecord = data.curmaxrecord;
                      CheckIn.insertSignrecordHtml('ckFriend', data.signrecord);
                      //CheckIn.ckFriend.bind('mouseover', CheckIn.mouseOver).bind('mouseout', CheckIn.mouseOut);
                  } else {//不存在好友签到
                      var users =  CheckIn.queryUser(data.invitedmails);            
					  var len = users.length;
                      if (len > 0) {//填写输入界,邀请方式一
                          //整体界面
                          CheckIn.friendChecked = 2;
                          var labelCheck = [], fullName, name;
                          for (var i = 0; i < len; i++) {
                              fullName = users[i].AddrName;
                              name = top.$PUtils.getLeftStr(fullName,10);
                              labelCheck.push($TextUtils.format(CheckIn.vLabelCheck, { email: users[i].AddrContent, title: users[i].AddrContent, name: top.$PUtils.getLeftStr(fullName,12) }));
                          }
                          CheckIn.ckFriend.find(".qd-body").html($TextUtils.format(CheckIn.vFriendHtml, { inviteHander: "CheckIn.inviteHander(this);", inviteFriends: labelCheck.join('') }));
                      } else {//邀请方式二
                          if (CheckIn.friendChecked != 3) {//初始化
                              CheckIn.friendChecked = 3;
							  var vstyle = "display:none;"
							  if(!($.browser.msie && ($.browser.version == "6.0"))){
							    vstyle+="border-style:solid;border-width:1px;border-color:#7C7C7C #C3C3C3 #C3C3C3 #9A9A9A;";
							  }
                              CheckIn.ckFriend.find(".qd-body").html($TextUtils.format(CheckIn.vFriendHtml, { inviteHander: "CheckIn.inviteHander(this);", inviteFriends: "" }));
                         							 
							  CheckIn.ckFriend.find(".qd-yqbg").html("<div id='inviteTips' class='gray' style='height:60px;_height:50px;' onclick='CheckIn.showInviteInput(this);'>" + CheckIn.inviteTipTxt + "</div><div style="+vstyle+"  id='ckreceivers' tabindex='0'  ></div><div  style='display:none;'  class='qg-slbgtop-x'></div>");
                              CheckIn.ckFriend.find(".qd-yqbg").bind('blur',CheckIn.ckFriendHand);                             
							  if (!CheckIn.richInput) {
							      CheckIn.loadingEL.show();
								
                                  var url = "/m2012/js/packs/richinput.html.pack.js?rnd="+Math.random();
								  M139.core.utilCreateScriptTag({id:"RichInputBox", src:url, charset:"utf-8"},function(){
										CheckIn.inputMailUI();
										CheckIn.loadingEL.hide();
									});
                               
                              }
                          }
                      }
                  }
              } else {//返回错误,上报日志
                  CheckIn.ckFriend.find(".qd-body").html("数据请求失败!");
                  top.ScriptErrorLog.sendLog("查询好友签到失败:" + initData + data.summary);
              }
              CheckIn.friendUIAnimate(el);
          }
      };
      //查询接口
      var initData = CheckIn.buildQueryData("ckFriend");
      CheckIn.loadingEL.show();
	  CheckIn.getRequestUrl(3,CheckIn.buildQueryData("ckFriend"),callback);
      
    },
	//紧密联系人if (top.CloseLinkList) CloseLinkList = top.CloseLinkList.concat(); >> 最近联系人 LastLinkList = 最近联系人：top.LastLinkList.concat();>> 联系人
	queryUser:function(invitedmails){
	  var rightUser=[];
	  var contactData = top.$App.getConfig("ContactData")||{};
			var close = contactData.closeContacts || [];
			var last = contactData.lastestContacts || [];
			var link = contactData.contacts || [];
	  if(!close||!last||!link) return rightUser;
	  var  allUser= close.concat().concat(last.concat()).concat(link.concat());
	  var isGood = false;
	  var len = allUser.length;
	  var count = 0,obj;
	  for(var i=0;i< len;i++){//选择6个人
	     //1必须要有email,有name,2不能存在邀请过的,3name不能为号码,4addr存在
	      CheckIn.fixAddrAndName(allUser[i]);
	      obj =allUser[i];
		 if(obj.AddrName&&obj.AddrContent&&CheckIn.checkISInvite(obj.AddrContent,invitedmails)&&CheckIn.isChinaMobile(obj.AddrContent)&&CheckIn.filterSelf(obj.AddrContent)&&CheckIn.filterDuplicate(obj.AddrName,obj.AddrContent,rightUser)){
		   rightUser.push(allUser[i]);
		   count++;
		 }
	     if(count==CheckIn.inviteCount){
		   break;
		 }
	  }
      return rightUser;
	},
	fixAddrAndName:function(obj){
		obj.AddrContent=obj.AddrContent||obj.FamilyEmail;
		obj.AddrName = top.$App.getModel("contacts").getAddrNameByEmail(obj.AddrContent);
	},
	//去掉重复号码
	filterDuplicate:function(name,add,array){
	 var len = array.length,flag = true;
	 for(var i=0;i<len;i++){
	    if(array[i].name==name){//名字相同，优先取139的
		   if(add.match("@"+top.coremailDomain)){
		      array[i].addr = add;
		   }
		   flag =  false;
		   break;
		}
	    if(array[i].AddrContent==add){//邮箱地址相同
		   flag =  false;
		   break;
		}
		
	 }
	 return flag;
	
	},
	//是否已经被邀请
	checkISInvite:function(addr,invitedmails){
	  if(!invitedmails) return true;
	  return invitedmails.match(addr)?false:true;
	 
	},
	//去掉电信，联通号码
	isChinaMobile:function(email){
	  var strsplit = "@"+top.coremailDomain;
	  var splits;
	  if(email){
	    splits = email.split(strsplit);
		if(splits.length==2&&splits[0].match(/[\d]{11}/)){
		   return top.$Mobile.isChinaMobile(splits[0]);
		}
	  }
	  return true;
	},
	//过滤掉自己与10086
	filterSelf:function(mail){
	 if(mail.match("10086"))return false;
	 return (mail==top.$User.getDefaultSender()||mail.match(CheckIn.userMail))?false:true;
	},
   /**
    * 我的签到
    * @param {Object} el
    */
    selfFace: function (el) {
	    if(!CheckIn.lockTip) return;
	    top.addBehaviorExt({ actionId: 102148, thingId: 2, pageId: 10544, actionType: 20, moduleId: 13 });
        CheckIn.lockTip.hide();
        if (CheckIn['ckSelfIndex'] >= 1) {
            CheckIn.selfUIAnimate(el);
            return;
        }
        var callback = function (data) {
            if(CheckIn.loadingEL)CheckIn.loadingEL.hide();
            if (data) {
                if (data.code == 'S_OK') {
                    if (data.exist > 0) {//存在签到
                        CheckIn.ckSelfcurmaxrecord = data.curmaxrecord;
                        CheckIn.insertSignrecordHtml('ckSelf', data.signrecord);
                    } else {
                        var time = CheckIn.splitTime(top.$Date.format('yyyy-MM-dd hh:mm:ss',top.$Date.getServerTime()));
                        CheckIn.ckSelf.find(".qd-datenum").html(time);
                    }
                    CheckIn.selfUIAnimate(el);
                } else {//记录日志
                    CheckIn.ckFriend.find(".qd-body").html("数据请求失败!");
                    top.ScriptErrorLog.sendLog("查询好友签到失败:" + initData + data.summary);
                }
            }
        }
        var initData = CheckIn.buildQueryData("ckSelf");
        CheckIn.loadingEL.show();
		CheckIn.getRequestUrl(3,initData,callback);
    },
	/**
	 * 生成签到html
	 * @param {Object} type 自己为ckSelf,好友为ckFriend
	 * @param {Object} signrecord 签到记录
	 */
	insertSignrecordHtml:function(type,signrecord){
	      var item = null, vhtml = [], fullContent, imgSrc, userName, mtime, cursor,faceSrc, upface = 0, content, len = signrecord.length;
		  var nextTime, time = CheckIn.splitTime(signrecord[0].signdate);
		  var tip = "",isFull = false;
          for (var i = 0; i < len; i++) {
              item = signrecord[i];
              upface = (!item.avatarpath && type == 'ckSelf') ? 1 :0;
              cursor = (upface == 0) ? 'default' : 'pointer';
               //插入时间
	          nextTime = CheckIn.splitTime(item.signdate);
	          if (nextTime != time||i==0) {
	            vhtml.push($TextUtils.format(CheckIn.vTimeHtml, { time: nextTime }));
	            time = nextTime;
	          } 
			  //////////
	          faceSrc = top.$PUtils.getImageSrc(item.avatarpath);//face.png
	       
			  imgSrc = CKUtils.getImageUrl(item.phizpath);
			  mtime = CKUtils.getTime(item.signdate);
			  fullContent = $T.Html.encode(unescape(item.sign));
			  userName = $T.Html.encode((type == 'ckSelf'?top.$PUtils.userInfo.userName:item.username));
			  if($.browser.msie && ($.browser.version <= 8.0)){
			     if($.browser.version==8){
				   content = top.$PUtils.getLeftStr(fullContent,58,true).replace(/$&n/);
				 }else if($.browser.version==7){
				   content = top.$PUtils.getLeftStr(fullContent,58,true);
				 }else{
				   content = top.$PUtils.getLeftStr(fullContent,55,true);
				 }
			  }else{
			      content = top.$PUtils.getLeftStr(fullContent,64,true);
			  }
			  isFull = content == fullContent?true:false;
			  content = content.replace(/&[^&]*$/," ");
			  //tip = (content == fullContent)?"":$TextUtils.format(CheckIn.vFullTipHtml,{fullcontent:fullContent});
              vhtml.push($TextUtils.format(CheckIn.vCheckHtml, {tip:tip,title:(upface==1?'点击更新头像':''), time: mtime, userName: userName, faceSrc: faceSrc, imgSrc: imgSrc, upface: upface, cursor: cursor, ckContent: content, isfull: isFull ? 1 : 0, fullContent: fullContent }));
         }
		 if (CheckIn[type + 'Index'] == 0) {
		 	CheckIn[type].find(".qd-body").html(vhtml.join("")).bind('click', CheckIn.ckSfBodyHand);
		 	CheckIn[type + 'Index'] = 1;
		 	CheckIn[type].bind('mouseover', CheckIn.mouseOver).bind('mouseout', CheckIn.mouseOut);
		 } else {
		 	CheckIn[type].find(".qd-body").append(vhtml.join(""));
		 }
	},
	/**
	 * 显示时间
	 * @param {Object} time
	 */
	splitTime: function (time) {
	    var str = ['日', '一', '二', '三', '四', '五', '六'];
        if (time) {
            time = time.split(" ")[0];
            if (time && time.match(/[1-9][0-9]*[-][0-9]{1,2}[-][0-9]{1,2}/)) {
                var times = time.split("-");
                var date = new Date(times[0], times[1]-1, times[2]);
                if (times[0] == CheckIn.currentYear) {
                    return times[1] + "-" + times[2] + "(" + str[date.getDay()]+")";
                } else {
                    return times[0] + "-" + times[1] + "-" + times[2] + "(" + str[date.getDay()]+")";
                }
            }
        }
    },
	
    /**
     * 构造查询数据
     * @param {Object} type
     * @param {Object} pageIndex
     * @param {Object} pageSize
     */
    buildQueryData: function (type, noUpdate, pageSize) {
        type = type || "ckSelf";
        var index = 0,pageIndex = type + "Index";
        if (pageIndex) {
            index = pageIndex;
        } if (noUpdate) {//整体更新数据
            index = 0;
            CheckIn[pageIndex] = 0;
        } else {
            if (CheckIn[pageIndex] == 0) {
                index = 0;
            } else {
                CheckIn[pageIndex] = CheckIn[pageIndex] + 100;//每次次100条数据
            }
            index = CheckIn[pageIndex];
        }
        if ((index > CheckIn[type + "curmaxrecord"]) && !noUpdate) {//超过最大记录,不再查询
            return "";
        } else {
            pageSize = pageSize || 100;
            return "<object><string name='type'>" + (type == "ckSelf" ? 0 : 1) + "</string><string name='recordstart'>" + index + "</string><string name='pagesize'>" + pageSize + "</string></object>";
        }
        },
	 /**
	  * 
	  * @param {Object} el
	  */
    friendUIAnimate:function(el){
	    if(el){
		    var el =  $(el);
		    el.css("font-weight",'bold');
		    el.siblings().css("font-weight",'normal');
	    }
	     if($.browser.msie){//IE6处理
	          CheckIn.ckFeel.hide();
	          CheckIn.ckSelf.hide();
	          CheckIn.ckTail.hide();
	          CheckIn.ckFriend.show();
	     }else{
            CheckIn.clickF = true;//避免点击我的签到时，双重滚动
            CheckIn.ckTail.hide();
            //没有好友签到处理
            CheckIn.ckFriend.show();
            CheckIn.ckFeel.animate({height:0},"slow");
            CheckIn.ckFriend.animate({height:264},"slow");
            CheckIn.ckSelf.css({ 'height': 0, 'display': 'block' });
	    }
	    
	   CheckIn.state = 2;//显示好友界面
	   $("#sendTxt").text(CheckIn.isCheck?"继续签到":"发布签到");
	   document.getElementById('sendCheck').onclick = function(){
	     CheckIn.sendCheck("toCheck");
	   }
	   
    },
	/**
	 * 
	 * @param {Object} el
	 */
    selfUIAnimate:function(el){
	      if(el){
		    var el =  $(el);
		    el.css("font-weight",'bold');
		    el.siblings().css("font-weight",'normal');
	     }
        if($.browser.msie){//IE6处理
	         CheckIn.ckFeel.hide();
	         CheckIn.ckFriend.hide();
	         CheckIn.ckTail.hide();
	         CheckIn.ckSelf.show();
	     }else{
             if(!this.clickF){//避免点击我的签到时，双重滚动
                this.clickF = false;
                CheckIn.ckFriend.css({'height':0,'display':'block'});
             }else{
                CheckIn.ckFriend.animate({height:0},"slow");
             }
             CheckIn.ckFeel.animate({height:0},"slow");
             CheckIn.ckSelf.animate({height:264},"slow");
	     }
	     CheckIn.state = 2;
	     $("#sendTxt").text(CheckIn.isCheck ? "继续签到" : "发布签到");
		 document.getElementById('sendCheck').onclick = function(){
	      CheckIn.sendCheck("toCheck");
	     }
    },
    /**
     * 修改头像
     * @param {Object} e 目标元素
     */
    ckSfBodyHand:function(e){
	     var e = $(e.target);
	     if(e.attr("upface")=='1'){
		    CKUtils.updateHead();
	     }

    },
    /**
     * 邀请好友签到事件
     * @param {Object} e 目标元素
     */
    ckFriendHand: function (e) {
	     var target = $(e.target);
         var mails = CheckIn.richInput ? CheckIn.richInput.getItems() : [];
	     var className = target.attr('class')||"";
	     var id = target.attr('id');
	     if (('qd-body' == className || className.match("text-a")) && mails.length == 0) {
	         CheckIn.showInviteTips();
	     }
    },
   
  
      /**
       *统计字符数
       */
    countChar:function(){
        var text = CheckIn.checkTxtEL.val();
		
        if (text == CheckIn.defaultTxtTip || text == CheckIn.sendCkTxtTip) return;
        if (text) {
            var count = text.length;
            if (count > CheckIn.maxStrCount) {//超出时添加保留的内容
                count = CheckIn.maxStrCount;
                CheckIn.checkTxtEL.val(CheckIn.checkTxtValue);
                //提示
                CheckIn.lockTip.find('.tipsBottom').hide();
                var pos = CheckIn.checkTxtEL.position();
                pos.top += 176;
                CheckIn.showTips(pos, "您的输入已超过70字的上限", 180);
                CheckIn.lockTip.fadeOut(2500,function(){
                    CheckIn.lockTip.find('.tipsBottom').show();
                })
            }
        } else {
            count = 0;
        }
        CheckIn.checkTxtValue = CheckIn.checkTxtEL.val();
        $("#c_chars").html("<font color='red'>" + count + "</font>/70");
    },
    /**
     *关闭面板
     */
    close: function () {
        if (CheckIn.state > 0) {
            $('#checkDiv').css('visibility', 'hidden');
        }
		if(CheckIn.lockTip) CheckIn.lockTip.hide();
		if(CheckIn.checkTxtEL&&CheckIn.checkTxtValue == CheckIn.sendCkTxtTip) CheckIn.checkTxtEL.val(CheckIn.defaultTxtTip);
    },

    /**
     *移去图片锁定提醒
     */
    mouseOut:function(e){
	     var target = $(e.target);
	     var isFull = target.attr("isfull");
	     if(isFull==0){
	          target.css('background-color','');
	     }else{
		   CheckIn.hideTips();
		 }
	     e.stopPropagation();
    },
    /**
     *添加图片锁定提醒
     */
    mouseOver:function(e){
        var target = $(e.target);
	    var id =  target.attr("id");
	    var isFull = target.attr("isfull");
	    var unlockday = target.attr("unlockday");
	    if (id && unlockday > 0) {//表情图标提示
	       var parent = $(target.parent());
	       var pos = parent.position();
	       pos.top -= 35;
	       CheckIn.showTips(pos, "再签到" + unlockday + "天就可以解锁该表情了。");
	       return;
	    }
	    if (isFull == 0) {//签到记录提示
	       var pos = $(target.parent()).position();
	        target.css('background-color', '#EFF4FA');//23是每行高度，30是一行的字符个数
			var fullContent = target.attr("fullContent");
	        pos.left -= 35;   
			CheckIn.showfullTips(pos, fullContent, 180);
	    } else {
	        CheckIn.hideTips();
	    }
    },
	/**
	 * 获取焦点
	 */
    checkTxtFocus: function () {
         var cIcon = $("#cIcon img");
         var text =  CheckIn.checkTxtEL.val();
         if ((text == CheckIn.sendCkTxtTip || text == CheckIn.defaultTxtTip) && cIcon.length == 0) {
		    CheckIn.checkTxtEL.removeClass('gray');
		    CheckIn.checkTxtEL.val("");
        }
    },
	/**
	 * 失去焦点为
	 */
    checkTxtblur: function (e) {
       var cIcon = $("#cIcon img");
       var text =  CheckIn.checkTxtEL.val();
       if(!text&&cIcon.length==0){
         CheckIn.checkTxtEL.val(CheckIn.defaultTxtTip);
         CheckIn.checkTxtEL.addClass('gray');
       }
    },
	/**
	 * 键盘按下
	 * @param {Object} e
	 */
    checkTxtKeyhander: function (event) {
        var keyCode = event.keyCode;
        if (!CheckIn.checkTxtValue && keyCode==8) {
            var cIcon = $("#cIcon img");
            if (cIcon.length > 0 ) {
                $("#cIcon").html("");
                CheckIn.checkTxtEL.css('width', '100%');
            }
        }
       
    },
    /**
     * @param {Object} e
     */
    changeFeel:function(e){
	    var target = $(e.target);
	    var id =  target.attr("id");
	    var unlockday = target.attr("unlockday");
	    var feel = target.attr("feel");
		//是否替换fell
	    var name = target.attr("name");
	    if (id && unlockday <= 0) {
		     if($.browser.msie && ($.browser.version == "6.0")){//IE6处理
			 CheckIn.checkTxtEL.css('width', '202px');
			 }else{
	            CheckIn.checkTxtEL.css('width', '205px');
			}
	        var vImgHtml = $TextUtils.format(CheckIn.vImgHtml, { id: id, name: name, path: CKUtils.getImageUrl(name), unlockday: "0", cursor: 'default', title: feel, feel: feel, lock: "" })
	        $("#cIcon").html(vImgHtml);
	        $("#cIcon").find('img').css('width', '18px');
			if(CheckIn.checkTxtValue == CheckIn.defaultTxtTip || CheckIn.checkTxtValue == CheckIn.sendCkTxtTip||CheckIn.checkTxtValue==''){
			   CheckIn.checkTxtEL.val(feel);
			}else{
			   if(CheckIn.isSelfFeel()){
			     CheckIn.checkTxtEL.val(CheckIn.checkTxtValue);
			   }else{
			      CheckIn.checkTxtEL.val(feel);
			   }
			
			}
	        CheckIn.checkTxtEL.removeClass('gray');
	        CheckIn.countChar();
	    }
    },
	//是否是自己输入的
	isSelfFeel:function(){
	  var count = 0,len = CheckIn.feelText.length;
	  for(var i=0;i<len;i++){
		if(CheckIn.checkTxtValue!=CheckIn.feelText[i]){
		     count++;
		}
	  }
	  if(count==len){
	    return true;
	  }else{
	    return false;
	  }
	},
    /**
     *发布签到
     */
    sendCheck: function (param) {
        if(CheckIn.lockTip) CheckIn.hideTips();;
        var callback = function (data) {
            if (data) {
                if (data.code == 'S_ERROR') {
                    var pos = null;
                    if (param == 'suc') {
                        pos = CheckIn.ckTail.find(".qd-yqbg").position();
                    } else {
                        pos = CheckIn.checkTxtEL.position();
                        pos.top += 176;
                    }
                    CheckIn.lockTip.find('.tipsBottom').hide();
                    CheckIn.showTips(pos, data.resultMsg, 180);
                    CheckIn.lockTip.fadeOut(2000,function(){
                      CheckIn.lockTip.find('.tipsBottom').show();
                    })
                } else {
                    //修改签到入口
                    CheckIn.lockTip.find('.tipsBottom').hide();
                    var imgName = "042.gif";
					if(param!= 'suc'){
					     imgName = $("#cIcon img").attr("name");
					}
                    CheckIn.updateCkEntrance(imgName, data.signcount,data.prompt);

                    //去掉已发的签到
                    CheckIn.isCheck = true;
                    $("#sendTxt").text("继续签到");
                    $("#cIcon").html("");
                    CheckIn.checkTxtEL.css('width', '100%').val("");
					CheckIn.checkTxtValue = CheckIn.defaultTxtTip;
					CheckIn.checkTxtEL.val(CheckIn.defaultTxtTip).addClass("gray");
					$("#c_chars").html("<font color='red'>0</font>/70");
                    CheckIn.showTips({ top: 40, left: CheckIn.width / 2 - 40 }, "签到发布成功");
					//滚动条位置
					CheckIn.ckSelf.find(".qd-body").scrollTop(0);
                    //查询自己的签到
                    var ckSelfCB = function (dataMsg) {
                        if (dataMsg) {
                            if (dataMsg.code == 'S_OK' && dataMsg.exist > 0) {
                                CheckIn.ckSelfcurmaxrecord = dataMsg.curmaxrecord;
                                CheckIn.insertSignrecordHtml("ckSelf", dataMsg.signrecord, true);
                            }
                        }
                        CheckIn.selfUIAnimate($("#asf"));
                        CheckIn.lockTip.fadeOut(2500, function () {
                            CheckIn.lockTip.find('.tipsBottom').show();
                        });

                    };
                  // var queryUrl = CheckIn.getRequestUrl(3);
                   var queryData = CheckIn.buildQueryData("ckSelf", true);
                   if (queryData) CheckIn.getRequestUrl(3,queryData,ckSelfCB);
                }
               
            }
           
        }
        if (param == 'suc') {//发布签到并展现我的签到Utils.htmlEncode(
            var signdesc = escape($("#inviteText").text());
            CheckIn.publishCheckIn(CheckIn.invitePhizseq, signdesc, callback);
	        top.addBehaviorExt({actionId:102150, thingId:2,actionType:10});
            return ;
         }
         var iconLen = $("#cIcon img").length;
         if((CheckIn.state==2&&param=='toCheck')||param=='toCheckUI'){//发布签到页面展现
            if($.browser.msie){//IE6处理
              CheckIn.ckSelf.hide();
              CheckIn.ckFeel.show();
            }else{
              CheckIn.ckSelf.css({'height':0,'display':'block'});
              CheckIn.ckFeel.animate({ height: 264 }, "slow");
             }
            $("#sendTxt").text("发布签到");
            CheckIn.state = 1;
            this.clickF = false;//避免点击我的签到时，双重滚动
            $("#ckHand").children().css("font-weight",'normal');
	        if(iconLen==0){
	            if (CheckIn.checkTxtE) CheckIn.checkTxtEL.css('width', '100%');
	        }
         }else{
	         if(iconLen==0){//没有pic
	             var checkVal = CheckIn.checkTxtEL.val();
	             if (checkVal && checkVal != CheckIn.defaultTxtTip && checkVal != CheckIn.sendCkTxtTip) {
	                 CheckIn.lockTip.find('.tipsBottom').hide();
	                 CheckIn.showTips({ top: 220, left: CheckIn.width / 2 - 40 }, CheckIn.sendCkTxtTip);
	                 CheckIn.lockTip.fadeOut(2000, function () {
	                     CheckIn.lockTip.find('.tipsBottom').show();
	                 });
	             } else {
	                 CheckIn.checkTxtEL.val(CheckIn.sendCkTxtTip).addClass("gray");
					 CheckIn.checkTxtValue = CheckIn.sendCkTxtTip;
	                 CKUtils.blinkAnimate(CheckIn.checkTxtEL, 'blinkColor');
	             }
	            
	         } else {//发布
	           var phizseq =  $("#cIcon img").attr("id");
	           var signdesc = escape(CheckIn.checkTxtEL.val().replace("\n",""));//过滤空格
	           CheckIn.publishCheckIn(phizseq, signdesc, callback);
	           top.addBehaviorExt({actionId:102150, thingId:1,actionType:10});
	         }
         //文字是否超
         }
    },
    /**
     *更新签到入口
     */
    updateCkEntrance: function (imgName, signcount,prompt) {
        if (imgName) $("#ckMainImg").attr("src", CKUtils.getImageUrl(imgName));
        if (signcount>0) $("#signcount").text(signcount);
		if(prompt) $("#ckPrompt").text(prompt);
    },
	/**
	* 
	* @param {Object} phizseq
	* @param {Object} signdesc
	* @param {Object} callback
	*/
    publishCheckIn: function (phizseq, signdesc, callback) {
        //var initUrl = CheckIn.getRequestUrl(2);
        var data = "<object><string name='phizseq'>" + phizseq + "</string><string name='signdesc'>" + signdesc + "</string></object>";
		CheckIn.getRequestUrl(2,data,callback);
    },
   /**
    * 获取头像
    * @param {Object} ImageUrl
    */
    getHeadSrc: function(ImageUrl){
		if (ImageUrl) {
			return top.SiteConfig["net"] + "/addr/apiserver/httpimgload.ashx?sid=" + top.sid + "&path=" + encodeURIComponent(ImageUrl) + "&rnd=" + Math.random();
		}
		else {
			return top.rmResourcePath + "/images/face.png";
		}
	}
}
/**
 * 工具类
 */
var CKUtils = {
	  /**
     * 容器中是否包含些元素
     * @param {Object} container
     * @param {Object} element
     */
    containsElement:function(container,element){
        while (element && element.parentNode) {
		        if (container === element) {
			         return false;
			    }
		        element = element.parentNode;
                }
                return true;

    },
	 /**
    * 闪烁效果实现 
    * @param {Object} obj
    * @param {Object} className
    */
    blinkAnimate: function(obj,className){
	    obj.addClass(className);
	    var keep;
	    var loop = setInterval(function(){
		    if(keep)clearTimeout(keep);
		    obj.addClass(className);
		    keep = setTimeout(function(){obj.removeClass(className);},100);
	    },200);
	    setTimeout(function(){
		    if(loop) clearInterval(loop);
	    },1000);
    },
	 /**
     *上传头像
     */
     updateHead:function(){
	    top.LinksConfig.updateHead={url: top.getDomain('webmail') + "/userconfig/Personal/HeadPicture.aspx",site:"net",title:"头像设置"};
	    top.Links.show("updateHead");
    },
	 /**
    * 获取图片路径
    * @param {Object} imgName
    * @param {Object} size
    */
    getImageUrl: function(imgName, size){
		if (!size) 
			size = "40&40";
		if (imgName) {
			return top.rmResourcePath + "/images/checkin/" + size + "/" + imgName;
		}
		else {
			return top.rmResourcePath + "/images/checkin/nocheck.jpg";
		}
    },
    getTime: function (time) {
        if (time) {
            time = time.split(" ")[1].split(":");
            return time[0]+":"+time[1];
        } else {
            return ""
        }
    },
    getRightStrNames: function (names) {
        var righNames = [],len = names.length;
        for (var i = 0; i < len; i++) {
            righNames.push(names[i]);
            if (CKUtils.isOverflow(righName.join(''), 43)) {//总为70，减去"我邀请了等7位好友参加签到。"
                righNames.pop();
            }
        }
        return righNames;

    },
    isOverflow: function (str,len) {
            return str.length>len;
    },
    //1、是否是移动号码,2、是否号码不完整
    checkMail: function (text) {
    	//1、得到email
    	var users = top.$PUtils.getEmail(text);
    	var email,number;
    	if(users[1]){
    		email = users[1];
    	}
    	//2、得到号码
    	number = top.$T.Email.getAccount(email);
    	//3、如果号码为11为，判断是否为移动码
    	if(/\d{11}/.test(number)){
    		return !top.$T.Mobile.isChinaMobile(number);
    	}else{
    		return 'noFullNum';
    	}
    }
}
