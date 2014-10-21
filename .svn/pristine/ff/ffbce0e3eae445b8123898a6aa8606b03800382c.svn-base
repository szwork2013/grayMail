var Tool = {
    //得到选中的联系人
    getSelectedContacts: function(onlyId) {
        var result = [];
        $("#tableContactsList input:checkbox:checked[id!='chkSelectAll']").each(function() {
            var cid = Tool.getRowContactsId(this);
            if (onlyId) {
                result.push(cid);
            } else {
                var item = window.top.Contacts.getContactsById(cid);
                if (item) result.push(item);
            }
        })
        return result;
    },
    //得到筛选后的联系人列表
    getFilterContacts: function() {
        var contacts;
        var ft = filter;
        if(ft.uncompleted)
        {
            contacts = [];
            var contactsMap=top.Contacts.data.ContactsMap;
            var sids=ft.uncompleted;
            if ('string' == typeof sids) {
                sids = sids.split(',');
            }

            for(var i=0;i<sids.length;i++)
            {
                var item = contactsMap[sids[i]];
                if (item) contacts.push(item);
            }
            contacts.sort(function (first, second) {
                //按照现网规则排序一次
                var qp1 = first.Quanpin || first.AddrFirstName,
                    qp2 = second.Quanpin || second.AddrFirstName;
                var num1 = qp1 - 0,
                    num2 = qp2 - 0;
                if (num1 && num2) {//都是数字
                    return num1 - num2;
                }
                else if (!num1 && !num2) {//都不是数字
                    return qp1.localeCompare(qp2);
                }
                else {
                    return num1 ? 1 : -1; //字母的排在前面，数字的后面
                }
            });
            return contacts;
        }
        //筛选组
        var vipGroup = top.Contacts.data.vipDetails;
        var vipGroupId = vipGroup.vipGroupId ||"vip";
        var vipCount = vipGroup.vipn || 0;
        if (ft.groupId) {
            //未分组
            if (ft.groupId == "-3") {
                var addrNotInGroup = Tool.getContactsNotInGroup().contactsMap;
                contacts = [];
                var contactsMap = top.Contacts.data.ContactsMap;
                for (var i=0; i<addrNotInGroup.length; i++) {
                    var obj = contactsMap[addrNotInGroup[i]];
                    if (obj) contacts.push(obj);
                }
            }else if(ft.groupId == vipGroupId){ //vip联系人组后台没有传递映射关系过来，所有点击vip联系人组是，要手动组装vip联系人-vip联系人最多20人
                var vipContactsSid = "";
                if(vipCount >0){
                    vipContactsSid = vipGroup.vipSerialIds.split(",");
                    var tmpvipContacts = [];
                    for(var i = 0; i< vipContactsSid.length;i++){
                        var vip = top.Contacts.getContactsById(vipContactsSid[i]);
                        if(vip){
                            tmpvipContacts.push(vip);
                        }
                    }
                    contacts = tmpvipContacts;
                }else{
                    contacts = [];
                }
            } else {
                contacts = window.top.Contacts.getContactsByGroupId(ft.groupId);
            }
        } else {
            //所有联系人的操作均会触发
            var fw = ft.firstNameWord;
            if (fw == "" || fw == "All") {
                //查询字母时不显示浮层
                Render.showFloatTips();
            }
            contacts = [].concat(window.top.Contacts.data.contacts);
        }
        //搜索关键字
        if (ft.keyword) {
            var searchResult = []
            for (var i = 0; i < contacts.length; i++) {
                var item = contacts[i];
                if (item.search(ft.keyword)) {
                    searchResult.push(contacts[i]);
                }
            }
            contacts = searchResult;
        }
        var result = [];
        //首字母
        if (ft.firstNameWord.length == 1) {
            var firstNameWord = ft.firstNameWord.toLowerCase();
            for (var i = 0; i < contacts.length; i++) {
                var item = contacts[i];
                if (item.FirstNameword && item.FirstNameword.toLowerCase() == firstNameWord) {
                    result.push(item);
                }
            }
            return result;
        }
	
        return contacts;

    },
    //根据一个tr里的页面元素得到该tr对应的联系人id
    getRowContactsId: function(tag) {
        while (tag) {
            if (tag.tagName == "TR") {
                return tag.SerialId;
            }
            tag = tag.parentNode;
        }
        return null;
    },
    //外链跳转
    showFrame: function(param) {
        var links = {
            "share"         : "addr_share_home.html?check=1&sid=" + Pt.getSid(),
            "importI"       : Pt.ucDomain("/addr/matrix/input/default.aspx?sid=" + Pt.getSid()), //导入：彩云，其他邮箱

            "importClient"  : "addr_importclient.html?check=1&sid=" + Pt.getSid(),//导入：客户端,check=1表示检查控件是否安装
            "myinfo"        : "addr_detail.html?type=myinfo&sid=" + Pt.getSid() + "&pageId=" + filter.pageIndex,//我的资料
            "editContacts"  : "addr_detail.html?type=edit&id=" + param.serialId + "&pageId=" + filter.pageIndex,
            "sendBuzzCard"  : "addr_detail.html?type=mybusinesscard&sid=" + Pt.getSid() + "&sendto=" + param.receiver + "&pageId=" + filter.pageIndex,
            "addContacts"   : "addr_detail.html?type=add",//old备份到此为new
            "addGroup"      : "addr_group.html?sid=" + Pt.getSid(),
            "editGroup"     : "addr_group.html?id=" + param.groupId,
            "whoaddme"      : "addr_maybeknown.html",
            "input"         : "addr_import_file.html?sid=" + Pt.getSid(),
            "output"        : "addr_export.html?sid=" + Pt.getSid(),
            "merge"         : "addr_merge.html?sid=" + Pt.getSid(),
            "updateContacts": "addr_updatecontact.html?sid=" + Pt.getSid(),
            "mybusinesscard": "addr_businesscard.html?type=mybusinesscard&sid=" + Pt.getSid() + "&pageId=" + filter.pageIndex,
            "addr_import_pim": "addr_import_pim.html?sid=" + Pt.getSid(),
            "addr_import_file": "addr_import_file.html?sid=" + Pt.getSid(),
            "addr_import_clone": "addr_import_clone.html?sid=" + Pt.getSid()
        };
        var linksRouter = {
            "baseData": "baseData",
            "setPrivate": "setPrivate"
        };
        var link = links[param.key];
        if (param.key == "addContacts" && !param.serialId) {
            link += "&email={0}&mobile={1}&fax={2}&name={3}".format(
                escape(param.email || ""),
                escape(param.mobile || ""),
                escape(param.fax || ""),
                escape(param.name || "")
            );
        }
        else if (param.key == "importI" && param.type) {
            link += "&showtype=" + param.type;
            link += "&isweb2=1"; //标准版不做修改
        }else if(param.key == 'addr_import_pim' && param.type){
            link += "&showtype=" + param.type;
            link += "&isweb2=1"; //标准版不做修改
        }// add  change by jinrui 2014.02.13

        if(param.key == "whoaddme"){            
            if(mail139.addr.home){
                if(mail139.addr.home.relationId){
                    link += "?relationId=" + mail139.addr.home.relationId +"&r="+Math.random();
                }else if(mail139.addr.home.uinId){
                    link += "?uinId=" + mail139.addr.home.uinId +"&r="+Math.random();
                }else{
                   link += "?r="+Math.random(); 
                }                
            }else{
               link += "?r="+Math.random(); 
            }
        }


        if (!link) link = param.url;
        if (filter.groupId && parseInt(filter.groupId)>1){
            var and = link.indexOf('?')>-1 ? '&' : '?';
            link += and + 'groupid='+filter.groupId;
        }
        if (linksRouter[param.key]) {
            //优先调用LinksConfig配置，不用配置2次url
            top.$App.show(linksRouter[param.key]);
            return;
        }
        window.location.href = link;
    },
    showControlBar: function(e) {
        var trObj = $(focusRow.parentNode);
		
        var serialId = trObj[0].SerialId;
        if (typeof serialId === 'undefined') return;

        var info = top.Contacts.getContactsById(serialId); //联系人信息
        var htmlCode = "";
        
		var warpDiv ='<div id="controlBar" style="background:white;z-index: 20; position: absolute; top: 2px; left: 0px; display: none;box-shadow: 1px 2px 3px #CCC; -webkit-box-shadow: 1px 2px 3px #CCC; -moz-box-shadow: 1px 2px 3px #CCC; -o-box-shadow: 1px 2px 3px #CCC; " class="menuWrap w"></div>'; 
		htmlCode =' <div class="mPop" style="width:342px; border:1px solid #b0b0b0;">\
    <table class="attrCard" width="100%" id="attrCardPanel">\
      <tbody>\
        <tr>\
          <td>\
           <span class="cotect_dir" ><i class="b22">◆</i><i class="o2">◆</i></span>\
           <span class="cotect_dir2" ><i class="b">◆</i><i class="o">◆</i></span>\
            <div class="short" id="usrInfoArea"><div class="clearfix">\
             <div class="fl" style="margin:16px 20px 0 20px; height:68px;"><a hidefocus="" href="javascript:;" class="head_portrait" onclick="editContacts(this);return false;" behavior="在通讯录页联系人列表弹出联系人通用属性卡_头像"><img id="imgHead"  src="{0}" class="pic" style="width:48px;height:48px;"></a></div>\
              <div class="fl vip_phone" style="padding-top: 4px; _padding-top:8px;">\
                <h2 rel="name" title="{8}">{1}<i id="vipIcon" class="{5}" command= "{7}" title="{6}" ></i></h2>\
                <p><a title="写邮件" rel="email" href="javascript:;" command="gotoCompose" class="fe c_666">{2}</a></p>\
                <p><a behavior="写短信" class="fe c_666" href="javascript:void(0);"  command="gotoSMS">{3}</a></p> \
             </div>\
             </div> \
             <div class="getMail">\
              <table>\
                <tbody>\
                  <tr style="cursor:pointer; position:relative;">\
                    <td style="border-left:0;"><em class="fcI" command="editContacts">编辑</em></td>\
                    <td><em behavior="属性卡-发邮件" class="fcI" command="gotoCompose">发邮件</em></td>\
                    <td><em behavior="属性卡-发短信" class="fcI chinaMobile" command="gotoSMS">发短信</em></td>\
                    <td  style="border-right:0;"><em behavior="更多" class="fcI" command="moreMenu">更多</em><i class="contact_more"></i> </td>\
                  </tr>\
                </tbody>\
              </table>\
			   <ul  id= "moreLinksInGetMail" rel = "moreLinksInGetMail" class="toolBar_listMenu contact_listMeau" style="display:none; position:absolute;left:343px;top:49px; top:58px\\0;border:1px solid #b0b0b0;">\
                <li><a href="javascript:void(0);" command="gotoMailFilter" class="fcI" behavior="联系人页卡-设置邮件分拣"><em command="gotoMailFilter" class="fcI chinaMobile" behavior="联系人页卡-设置邮件分拣">创建收信规则</em></a></li>\
                <!-- 功能不完善 li><a href="javascript:void(0);" command="addTag" class="fcI" behavior="联系人页卡-设置自动标签"><em command="addTag" class="fcI" behavior="联系人页卡-设置自动标签">设置自动标签</em></a></li -->\
                <li><a href="javascript:void(0);" command="gotoMailNotify" class="fcI chinaMobile"><em command="gotoMailNotify" class="fcI">设置邮件到达通知</em></a></li>\
                <!-- 功能不完善  li style="display:{4}" rel="inviteFriend" ><a href="javascript:void(0);" command="inviteFriend" class="fcI" ><em command="inviteFriend" class="fcI chinaMobile" >邀请</em></a></li -->\
                <li><a href="javascript:void(0);" command="searchLetters" class="fcI" behavior="联系人页卡-往来邮件"><em command="searchLetters" class="fcI" behavior="联系人页卡-往来邮件">往来邮件</em></a></li>\
              </ul>\
            </div>\
           </div>\
            </td>\
        </tr>\
      </tbody>\
    </table>\
  </div>';

    
                

        var headImg = info.ImageUrl;
        
		//姓名 电话 邮件显示
        var name = trObj.find("a[jpath=name]").text();
        var email = trObj.find("a[jpath=email]").text();
        var mobile = trObj.find("a[jpath=mobile]").text();
        var _name = "";
        if (name) {
            _name = top.M139.Text.Utils.getTextOverFlow2(name, 20, true);
        } else {
            name = "";
        }
        var _email = "";
        if (email) {
            _email = email;
        } else {
            email = "";
        }
        var _mobile = "";
        if (mobile) {
            _mobile = mobile;
        } else {
            mobile = "";
        }

        if(name != "")
        {
            name = Pt.htmlEncode(name);
        }
        if(_name != "")
        {
            _name = Pt.htmlEncode(_name);
        }

        if (email != "" && email.length > 26) {
            _email = email.substring(0, 25) + "…";
        }

        if (mobile != "" && mobile.length > 26) {
            _mobile = mobile.substring(0, 25) + "…";
        }

        //判断是否是139邮箱
        var inviteFriendCss = "none";
		if(email.indexOf("@139.com") == -1){
			 inviteFriendCss ="";
		}
		
		//text
		var vipMsg = ADDR_I18N[ADDR_I18N.LocalName]["vip"];
		
		//vip标示显示控制
		var isVip = top.Contacts.IsVipUser(serialId);
		var vipIconClass = "user_gray_vip";
		var vipCommand = "addVip";
		var vipTitle = vipMsg.setVipTip;
		if(isVip){
			vipIconClass ="user_vip";
			vipCommand = "cancelVip";
			vipTitle = vipMsg.cancelVipTip;
		}
		
		var newhtmlCode = htmlCode.format(headImg, _name, _email, _mobile,inviteFriendCss,vipIconClass,vipTitle,vipCommand, name);
        var obj = $("#controlBar");
		
		if (obj.length==0) {
            obj = $(warpDiv);
        } else {
            obj.html(warpDiv);
        }
		$(newhtmlCode).appendTo($(obj));
		//位移控制
		var p = $(focusRow).offset();
		var _top = 0;
		var ey = e.pageY;
		var MenuHeight = 129;
		var bodyHeight = top.window.document.body.clientHeight; //窗口高度
			_top = bodyHeight-  p.top - 86 > MenuHeight ? p.top +24 : p.top - MenuHeight + 22 ;
		obj.appendTo(focusRow).css({
            "display": 'none',
            "left": 49,
            "top": _top
        }).unbind("click").click(function(e) {
            if (e.target.tagName == "A") {
                setTimeout("Tool.hideControlBar()", 16);
            }
        });
		if(bodyHeight-  p.top - 86 > MenuHeight){//86 
			$("#controlBar").find('span.cotect_dir').show();
			$("#controlBar").find('span.cotect_dir2').hide();
		}else{
			$("#controlBar").find('span.cotect_dir').hide();
			$("#controlBar").find('span.cotect_dir2').show();
		}
		
        //事件绑定
		var contactsData = {serialId: serialId,email : email,name :name , mobile : mobile};
		
		//更多
		obj.find("em[command=moreMenu]").click(function(e){
			gotoMoreMenu(e);
		});
		
		//添加vip联系人
		obj.find("*[command=addVip]").click(function(){
			top.addBehaviorExt({ actionId: 102044, thingId: 0, moduleId: 14 });
			Tool.hideControlBar();
			if(contactsData.email != ""){
				addSinglVipInCard(contactsData);
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "AddVip";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
		});	
		
		//取消vip联系人delSinglVipInCard	
		obj.find("*[command=cancelVip]").click(function(){
			top.addBehaviorExt({ actionId: 102045, thingId: 0, moduleId: 14 });
			Tool.hideControlBar();
			function cancelVip(){
				delSinglVipInCard(contactsData);
			}
			top.FloatingFrame.confirm(vipMsg["cancelVipText"],cancelVip );
		});		
		
		//编辑
		obj.find("em[command=editContacts]").click(function(){
			//editContactsInCard(contactsData);
            editContacts(contactsData);
			Tool.hideControlBar();
		});	
		 
		//邀请
		obj.find("a[command=inviteFriend]").click(function(){
			Tool.hideControlBar();
			if(contactsData.email != ""){
				//inviteFriendInCard(contactsData);
                top.$App.jumpTo('invitebymail', {
                    email: contactsData.email
                });
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "inviteFriend";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
			
		});	
		
			
		//快捷发邮件	
		obj.find("*[command=gotoCompose]").click(function(){
			Tool.hideControlBar();

            if (contactsData.email == "") {
                sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
                sendCantactServer.sendType = "Mail";
                sendCantactServer.hoverRow = trObj[0];
                if (!sendCantactServer.CheckContactType("e")) {
                    return;
                }
            }

            if (contactsData.email) {
                var args = { receiver: M139.Text.Email.getSendText(contactsData.name, contactsData.email)}
            }
            top.$App.show("compose", null, {
                inputData:args
            });
			
		});	
		
		//设置邮件分拣
		obj.find("a[command=gotoMailFilter]").click(function(){
			Tool.hideControlBar();
			if(contactsData.email != ""){
				//setFilterInCard(contactsData);
                top.$App.trigger("mailCommand", { command: "autoFilter", email: contactsData.email });
			}else{
				sendCantactServer.selContact = top.Contacts.getContactsById(serialId);
				sendCantactServer.sendType = "setFilter";
				sendCantactServer.hoverRow = trObj[0];
				if (!sendCantactServer.CheckContactType("e")) {
					return;
				}
			}
		});
        
		
		//发短信gotoSMS
		obj.find("*[command=gotoSMS]").click(function(){//暂时屏蔽
			Tool.hideControlBar();
			sendSMS(focusRow);
		});
		
		//设置邮件到达通知
		obj.find("a[command=gotoMailNotify]").click(function(){//暂时屏蔽
			Tool.hideControlBar();
			//setMailNotifyInCard(contactsData);
            if (!top.$User.isChinaMobileUser()) {
                top.$User.showMobileLimitAlert();
                return;
            }
            top.$App.show("notice");
		});
		
		
        if (info && info.emails.length>0 ) {
			obj.find("a[command=searchLetters]").click(function(){
				Tool.hideControlBar();
				searchMailRecords(focusRow);
			});
        }else{
			obj.find("a[command=searchLetters]").parent().hide();
		}

        var GUANGDONG = "1";
        if (top.$User.getProvCode() == GUANGDONG) {
            obj.find("a[rel='fax']").show();
        }
        obj.fadeIn();       
        obj = null;
    },

    hideControlBar: function() {
        $("#controlBar").hide();
    },
    getPageSizeCookie: function() {
        return Pt.cookie("addr_ps") || 20;
    },
    setPageSizeCookie: function(pageSize) {
        setTimeout(function() {
            Pt.cookie("addr_ps", pageSize);
        }, 0);
    },

    compareMap : {
        "E": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.emails.some(function(e,i){
                    return a == e.toLowerCase();
                })) {
                    return b.SerialId;
                };

            } else {
                for (var j = b.emails.length; j--; ) {
                    if (a == b.emails[j].toLowerCase()) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        },
        "M": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.mobiles.some(function(e,i){
                    return $Mobile.compare(a, e);
                })) {
                    return b.SerialId;
                }

            } else {
                for (var j = b.mobiles.length; j--; ) {
                    if ( $Mobile.compare(a, b.mobiles[j]) ) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        },
        "F": function(a, b) {
            if (a === "") {
                return false;
            }

            if (Array.prototype.some) {
                if (b.faxes.some(function(e,i){
                    return $Mobile.compare(a, e);
                })) {
                    return b.SerialId;
                };

            } else {
                for (var j = b.faxes.length; j--; ) {
                    if ( $Mobile.compare(a, b.faxes[j]) ) {
                        return b.SerialId;
                    }
                }
            }

            return false;
        }
    },

    searchLastContactsInfoBeLong: function(item, contacts) {

        var compareFoo = this.compareMap[item.type];

        var addr = item.addr;
        for (var i = 0, len = contacts.length; i < len; i++) {
            var serialid = compareFoo(addr, contacts[i]);
            if (serialid) {
                return contacts[i];
            }
        }
        return null;
    },
    saveString: function(value) {
        if (!keyMap[value]) {
            stringMap.push(value);
            keyMap[value] = stringMap.length - 1;
        }
        return keyMap[value];
    },
    getString: function(key) {
        return stringMap[key];
    },
    fixImage: function(img) {
        var fixSize = 96;
        img.removeAttribute("width");
        img.removeAttribute("height");
        if (img.width > img.height) {
            img.width = 96;
        } else {
            img.height = 96;
        }
    },
    getContactsNotInGroup: function() {
        var cData = top.M2012.Contacts.getModel().get("data");
        var addrsNotInGroup = cData.noGroup;
        var addrsNotInGroupCount = addrsNotInGroup.length;
        return {
            contactsMap: addrsNotInGroup,
            count: addrsNotInGroupCount
        };
    },
	updateVipMail:function(){
		if(top.Main.searchVipEmailCount){
			top.Main.searchVipEmailCount();
		}
	},

    fixmobile: function(str) {
        return $Mobile.remove86(str.replace(/[^\d]/g, ""));
    },

    fetionBean: {

        //一分钟内已发出的飞信添加好友
        addMap: {},

        //唤出飞信bar的提示框
        showtip: function(msg, id){
            return (function(d,a, fetion$){var g=fetion$.fxbar.ui.floatWindow({title:"提示"}),e=fetion$('<div class="fxbar_tip_m"></div>'),c=fetion$('<div class="statebk">'+d+"</div>"),b=fetion$('<div class="bt_bk"><a href="javascript:;" onclick="return false;">确定</a></div>'),f=fetion$('<div class="fxbar_tip_b"></div>');e.append(c).append(b);g.append(e).append(f);b.children().eq(0).bind("click",function(){g.hide()});g.show();if(a)g[0].id=a;return g;})(msg, id, top.fetion$);
        },

        ready: function(callback) {
            var fetion$ = top.fetion$, _this = this, count = 0;

            if (fetion$.fxbar.cache.contactMap) {
                return callback(fetion$.fxbar.cache.contactMap.values());
            }

            fetion$.fxbar.logic.loadContactList(); //加载飞信好友列表

            var timer = setInterval(function(){
                if (fetion$.fxbar.cache.contactMap && fetion$.fxbar.cache.contactMap.size() > 0 && fetion$.fxbar.cache.contactMap.values()) {
                    clearInterval(timer);

                    setTimeout(function(){
                        callback(fetion$.fxbar.cache.contactMap.values());
                    }, 500);
                } else {
                    count++;
                    if (count > 100) {
                        clearInterval(timer);
                        _this.showtip("飞信没有正常加载，请尝试点左上方飞信图标来发短信", "fx_tip_yx_error", $fx);
                    }
                }
            }, 0xff);
        },

        addBuddy: function(mobile) {
            var fetion$ = top.fetion$, _this = this, count = 0;

            function clear() {
                if (_this.addMap[mobile]) {
                    clearTimeout(_this.addMap[mobile]);
                    _this.addMap[mobile] = false;
                }
            };

            if (_this.addMap[mobile]) {
                _this.showtip("添加好友请求已发送，请耐心等待", "fx_tip_yx_wait");
                return;
            }

            fetion$.fxbar.common.beginAddBuddy({"mn": mobile});

            _this.addMap[mobile] = setTimeout(function(){
                clear();
            }, 60000);

            try {
                top.$("#fx_link_cancel, .fxbar_close").click(function(){
                    clear();
                });
            } catch (ex) {
            }
        },

        isfriend: function(mobile) {
            var fetion$ = top.fetion$, _this = this, user;

            return {
                yesqueue: [],
                noqueue: [],

                yes: function(callback){
                    this.yesqueue.push(callback);
                    return this;
                },
                no: function(callback){
                    this.noqueue.push(callback);
                    return this;
                },
                done: function() {
                    var promiss = this;
                    _this.ready(function(lst) {
                        var user;
                        for (var i = lst.length; i--; ) {
                            if ( $Mobile.compare(lst[i].mn, mobile) ) {
                                user = fetion$.fxbar.cache.contactMap.get(lst[i].uid);
                                break;
                            }
                        }

                        if (user) {
                            while(promiss.yesqueue.length) {
                                promiss.yesqueue.pop()(user);
                            }
                        } else {
                            while(promiss.noqueue.length) {
                                promiss.noqueue.pop()(mobile);
                            }
                        }
                    });
                    return this;
                }
            };
        },

        chat: function(mobile) {
            var _this = this, fetion$ = top.fetion$;

            _this.isfriend(mobile)
              .yes(function(user) {
                fetion$.fxbar.common.openChatWrapper(user);

            }).no(function(mn) {
                _this.addBuddy(mn);

            }).done();
        }
    },

    //唤出飞信对话框 TODO: 这个逻辑要移进fetionBean
    fetionchat: function(e, sender) {

        //登录状态
        if (!Render.fetionlogined()) {
            return;
        }

        var _this = Tool;

        try {
            var mobile = sender.parentNode.previousSibling;
            mobile = mobile.innerText || mobile.textContent;
            mobile = Tool.fixmobile(mobile);

            _this.fetionBean.chat(mobile);

        } catch (ex) {
            top.M139.Logger.getDefaultLogger().error('调用飞信bar出错', ex)
        }
    }
};
stringMap = [];
keyMap = {};