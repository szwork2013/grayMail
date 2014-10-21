/**
 * @author wuxiang
 * @fileOverview
 * @description 产品运营相关工具方法
 */

(function(jQuery, _, M139) {

	M139.PUtils = {
         
		mobileMail : top.$User.getShortUid() + "@"
				+ top.coremailDomain,
				
		getImageSrc:function(ImageUrl){
			var imgUrlTemp = '{0}/addr/apiserver/httpimgload.ashx?sid={1}&path={2}';
            if (ImageUrl) {
                var headUrl = top.$T.Utils.format(imgUrlTemp, [top.domainList[top.$User.getPartid()].webmail, top.$App.getSid(), encodeURIComponent(ImageUrl)]);
                return top.M139.HttpRouter.getNoProxyUrl(headUrl);
            } else {
                return "/m2012/images/ad/face.jpg";
            }
		},
		userInfo:{},
		updateUserInfo:function(type){
			if(type==='name'){
			    top.$App.show('account','&info=accountSet');
			}else if(type==='birth'){
			 	top.$App.show('account','&info=userInfo');
			}else if(type==='mail'){
			 	top.$App.show('preference','&info=onlinetips');
			}else if(type==='head'){
				top.$App.show('account','&info=userInfo');
			}else if(type==='importContact'){
				top.appView.show("addrinputhome");
			}
		},
		getUserinfo : function(callback) {
			top.M139.Timing.waitForReady('top.$App.getModel("contacts")',function(){
                if(!top.$App.getModel("contacts").getUserInfoWaiting){
				top.$App.getModel("contacts").getUserInfo(null, function(info) {
					if(info&&info.code === "S_OK"){
						var data = info["var"]||{};
						data.headImg = $PUtils.getImageSrc(data.ImageUrl);
						var userName = "";
	                    var aliasName = top.$User.getAliasName();
					    //发件人姓名>别名>手机号
	                    if (data.AddrFirstName) {
	                        userName = data.AddrFirstName;
	                    } else if (aliasName) {
	                        userName = top.$Email.getAccount(aliasName); //别名
	                    } else {
	                        userName = top.$User.getShortUid();
	                    }
	                    data.UserNumber = data.UserNumber.replace(/^86/,"");
						data.userName = userName;
						callback&&callback(data);
					}
				});
                }
			});
		},
		isHasHead : function(imgUrl) {
			if (imgUrl.match("face.jpg")) {
				return false;
			}
			return true;
		},

		iframetransparent: function () {
		    top.$App.get('birthWishFrame').$("iframe").attr("allowtransparency", "true");  //兼容IE78,iframe背景透明

		    $('div.boxIframeMain').css({"background": "none", "border": "none" });		
		},

		


	    destroyEl:function(div){
	     if(div)div.innerHTML = "";
	   },
	    _creatElement:function(tag,id){
	   	 var div = document.getElementById(id)?document.getElementById(id):document.createElement(tag);
		 div.id = id;
		 div.style.display = "none";
	   	 return div;
	   },
        htmlEncode:function(str){
		  var div = this._creatElement('div','htmlCode');
		  div.appendChild(document.createTextNode(str)); 
		  var innerHTTML = div.innerHTML;
		  this.destroyEl(div);
		  return innerHTTML;  
	   },
	    htmlDecode:function(str){
	    var div = this._creatElement('div','htmlCode'); 
		div.innerHTML = str;
		var innerText = div.innerText || div.textContent;
		this.destroyEl(div);
		return innerText  
	  },
		getEmail:function(text){
			return [$T.Email.getName(text),$T.Email.getEmail(text)];
		},
		/**
		 * 根据权重获取选择哪一个数据
		 * s为是否加入计算,weight为权限
		 * @example[{s:true,weight:3},{s:true,weight:5},{s:true,weight:6}]];
		 */
		getRandomByWeigth:function(weights){
			  var data = [],count=0;
			  for(var i = 0;i<weights.length;i++){
			    if(weights[i].s){
				 count+=weights[i].weight;
				 data.push(ads[i]);
				}
			  }
			  //构建数据
			  var random = Math.floor(Math.random()*count);
			  //数据落在哪里区间
			  var pos = 0;
			  var weight = null;
			  for(var j= 0;j<data.length;j++){
			       pos +=data[j].weight;
				   if(random<pos){//找到数据
					   weight = data[j];
					 break;
				   }
			  
			  }
			 return weight;
		},
		isCurTInRangeTime : function(arr) {
			var startTime = arr[0], endTime = arr[1];
			var flag = false;
			var sysTime = top.$Date.getServerTime();
			if (startTime instanceof Date && endTime instanceof Date
					&& sysTime >= startTime && sysTime < endTime) {
				flag = true;
			}
			return flag;
		},
		isContainNum : function(mobiles, num) {
			var strMobiles = mobiles.join(",");
			if (strMobiles.match(num))
				return true
			return false
		},
		fixTime2Str : function(num) {
			num = "0" + num;
			num = num.length == 3 ? num.substr(1) : num;
			return num;
		},
		setCharVal:function(str,num,val){
			str = str||'';
			var len = str.length,sub = num-len;
			var strs = str.split('');
			if(sub>1){
				for(var i=0;i<sub;i++){
				  strs[len+i] = 0;
			 	}
			}
			strs[num-1]=val;
			return strs.join('');
		},
		dateFormat : function(str) {  
        	var isoExp  = /^\s*(\d{4})-(\d\d)-(\d\d)( (\d{2}):(\d{2}):(\d{2}))?\s*$/,  
            	date    = new Date(NaN), month,  
            	parts   = isoExp.exec(str);  
            if(parts) {  
            	month   = +parts[2];  
           		date.setFullYear(parts[1], month - 1, parts[3]);
           		if(parts[4]){
           			date = new Date(parts[1],month - 1,parts[3],parts[5],parts[6],parts[7]);
           		}
                if(month != date.getMonth() + 1) {  
                	date.setTime(NaN);  
                }  
            }      
            return date;  
    	}, 
		getLeftStr:function(str,len,showSymbol,tail){
    		showSymbol = showSymbol||true;
			var leftStr = str;
			var curLen  = 0;
			for(var i=0;i<str.length;i++){
				curLen += str.charCodeAt(i)>255 ? 2 : 1;
				if(curLen > len){
					leftStr = str.substring(0,i);
					break;
				}else if(curLen == len){
					leftStr = str.substring(0,i + 1);
					break;
				}
			}
			if(showSymbol){
				if(leftStr != str){
					leftStr += (tail?tail:"..."); 
				}
			}
			return leftStr;
		},
		getGNameByMobile:function(mobileNumber){
			 var gName = '';
			 var _contacts = top.$App.getModel("contacts").getContactsByMobile(mobileNumber)||[]; 
			 //取到这些联系人所在的所有组名 
			 var _groupNames = $.map(_contacts, //循环每个手机号里的SerialId
				  function(i){ return $.map($.grep(top.Contacts.data.map, 
				  function(j){ return j.SerialId == i.SerialId }),//查询在group中是否找到相应的SerialId
				  function(k){ return top.$App.getModel("contacts").getGroupById(k.GroupId).GroupName;}); });//找到之后返回数组中
		     if(_groupNames[0]){
			    if(top.$T.Utils.getBytes(_groupNames[0])>20){
			     gName = _groupNames[0].substring(0,10)+'...';
			    }else{
				 gName = _groupNames[0]
				}
			 }
			 return gName;
		 },
		/**
		 *发送邮件
		 */
		
		sendMail:function(param){
	       var  mailInfo = {
            id: param.id || "",
        	mid : param.mid || "", //后台返回的草稿ID,成功调用存草稿方法后修改该属性
			messageId: "",
        	account: param.account?param.account:top.$User.getDefaultSender()|| top.$PUtils.mobileMail,//发件人
	        to: param.email,//收件人地址‘,’号分隔
	        cc: "",//抄送人地址
	        bcc: "",//密送人地址
	        showOneRcpt: param.showOneRcpt || 0, //是否群发单显1 是 0否 
	        isHtml: 1,
	        subject: param.subject,
	        content: param.content,
	        priority: 3, //是否重要
	        signatureId: 0,//使用签名档
	        stationeryId: 0,//使用信纸
	        saveSentCopy: 1,//发送后保存副本到发件箱
	        requestReadReceipt : 0,//是否需要已读回执
	        inlineResources: 1, //是否内联图片
	        scheduleDate: param.scheduleDate || 0, //定时发信
	        normalizeRfc822: 0,
	        attachments: param.attachments || []//所有附件信息
            }
	    top.$PUtils._sendMail(mailInfo, param.callback||function(){}, param.action);
		},
		_sendMail:function(mailInfo,callback,action){
	       var data = {
                "attrs"  :     mailInfo,
                "action" :     action||'deliver',
                "replyNotify": 0,
            	"returnInfo":  1
	       };
	       top.M139.RichMail.API.call("mbox:compose&comefrom=5&categroyId=103000000", data, function(res) {
    	   		if(callback){callback(res);}
	       });
		},
		getContact : function(count, filterFun) {
			filterFun = filterFun || function(mail) {
				if (mail.match("10086"))
					return false;
				return (mail == top.$User.getDefaultSender() || mail
						.match(this.mobileMail)) ? false : true;
			};
			var retUser = [];
			var contactData = top.$App.getConfig("ContactData")||{};
			var close = contactData.closeContacts || [];
			var last = contactData.lastestContacts || [];
			var link = contactData.contacts || [];
			var allUser = close.concat().concat(last.concat()).concat(link
					.concat());
			count = count || allUser.length;
			var user = null;
			for (var i = 0; i < count; i++) {
				user = allUser[i];
				if (user.name && user.addr && this._distinctUser(user)
						&& filterFun.apply(null, user.addr)) {
					retUser.push(user);
				}
			}
			return retUser;
		},
		_distinctUser : function(name, addr, users) {
			var len = users.length, flag = true;
			for (var i = 0; i < len; i++) {
				if (users[i].name == name) {// 名字相同，优先取139的
					if (add.match("@" + top.coremailDomain)) {
						users[i].addr = add;
					}
					flag = false;
					break;
				}
				if (users[i].addr == add) {// 邮箱地址相同
					flag = false;
					break;
				}
			}
			return flag;
		},
		getFlashHtml : function(flashName, width, height) {
			var flashHtml = "";
			var name = flashName.replace(/\.swf/, "");
			if ($.browser.msie) {
				flashHtml = "<object id='"
						+ name
						+ "' name='"
						+ name
						+ "' wmode='transparent' "
						+ " classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'"
						+ "codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0'"
						+ "width='" + width + "' height='" + height + "' >"
						+ "<param name='movie' value='" + top.wmsvrPath2 + "/"
						+ flashName + "'>"
						+ "<param name='wmode' value='transparent'>"
						+ "<param name='AllowScriptAccess' value='always'/>"
						+ "<param name='quality' value='high'>" + "</object>";
			} else {
				flashHtml = "<embed name='"
						+ name
						+ "' id='"
						+ name
						+ "' wmode='transparent' src='"
						+ top.wmsvrPath2
						+ "/"
						+ flashName
						+ "' quality='high' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' width='"
						+ width + "px' height='" + height
						+ "px'  allowscriptaccess='always'></embed>";
			}
			return flashHtml;
		},
		show : function(param, href) {
			if(param=='updateHead'){
				top.$App.show('account');
			}
		},
		getCurTabWin : function(winName) {
			
			var iframeId = winName?winName:(top.$App.getCurrentTab().view.readmailcontentview
					.getEl().replace(/^#mailContent/, "mid"));
			return top.$("iframe[name='" + iframeId + "']")[0].contentWindow;
		},
		setIframeScrollTop:function(el,win){
			var top;
			win = win||window;
			if(el){
        		top = el.offset().top;
        		win.scroll(0,top);
        	}
		},
		
		//添加日程
		 renderSchdedule : function(data,options){
      	
	        var PageApp = new M139.PageApplication({name : 'popSchedule_utils'});
	        var url = "http://" + top.window.location.host + "/m2012/html/calendar_reminder/";
	        url += "pop_schedule.html?&sid"+top.sid;
	        url = PageApp.inputDataToUrl(url,{data:data,type:1});
	        var scheduleIFrame = top.$Msg.open({
	                                dialogTitle: "添加日程提醒",
	                                url: url,
	                                width: 650,
	                                height: 520
	                      });;
      	   top.$App.set('scheduleIFrame',scheduleIFrame);
      	   top.$App.set('scheduleIFrame_options',options);
         },
		createStyle:function(css,win){
			if(!css) return;
			var doc = win?win.document:document;
			var htmlCode = "<style type='text/css'>"+css + "</style>";
			$(htmlCode).appendTo(doc.body);
		},
		showCheck:function(timeout){
			top.$App.show('welcome'); //打开欢迎页签到
			setTimeout(function(){
				if(top.document.getElementById("welcome").contentWindow.CheckIn){
					top.document.getElementById("welcome").contentWindow.CheckIn.showface();
				}
			},timeout||200);
		},
		date : function(y) {
			var P = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176,
					39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400,
					54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216,
					27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432,
					59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536,
					54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938,
					43344, 46423, 27808, 46416, 86869, 19872, 42448, 83315,
					21200, 43432, 59728, 27296, 44710, 43856, 19296, 43748,
					42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925,
					19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846,
					38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870,
					43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480,
					21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888,
					30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240,
					47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312,
					31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856,
					60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192,
					118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864,
					42359, 42160, 43600, 111189, 27936, 44448];
			var K = "甲乙丙丁戊己庚辛壬癸";
			var J = "子丑寅卯辰巳午未申酉戌亥";
			var O = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
			var L = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏",
					"小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露",
					"霜降", "立冬", "小雪", "大雪", "冬至"];
			var D = [0, 21208, 43467, 63836, 85337, 107014, 128867, 150921,
					173149, 195551, 218072, 240693, 263343, 285989, 308563,
					331033, 353350, 375494, 397447, 419210, 440795, 462224,
					483532, 504758];
			var B = "日一二三四五六七八九十";
			var H = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一",
					"腊"];
			var E = "初十廿卅";
			var V = {
				"0101" : "*1元旦节",
				"0214" : "情人节",
				"0305" : "学雷锋纪念日",
				"0308" : "妇女节",
				"0312" : "植树节",
				"0315" : "消费者权益日",
				"0401" : "愚人节",
				"0501" : "*1劳动节",
				"0504" : "青年节",
				"0601" : "国际儿童节",
				"0701" : "中国共产党诞辰",
				"0801" : "建军节",
				"0910" : "中国教师节",
				"1001" : "*3国庆节",
				"1224" : "平安夜",
				"1225" : "圣诞节"
			};
			var T = {
				"0101" : "*2春节",
				"0115" : "元宵节",
				"0505" : "*1端午节",
				"0815" : "*1中秋节",
				"0909" : "重阳节",
				"1208" : "腊八节",
				"0100" : "除夕"
			};
			function U(Y) {
				function c(j, i) {
					var h = new Date((31556925974.7 * (j - 1900) + D[i] * 60000)
							+ Date.UTC(1900, 0, 6, 2, 5));
					return (h.getUTCDate())
				}
				function d(k) {
					var h, j = 348;
					for (h = 32768; h > 8; h >>= 1) {
						j += (P[k - 1900] & h) ? 1 : 0
					}
					return (j + b(k))
				}
				function a(h) {
					return (K.charAt(h % 10) + J.charAt(h % 12))
				}
				function b(h) {
					if (g(h)) {
						return ((P[h - 1900] & 65536) ? 30 : 29)
					} else {
						return (0)
					}
				}
				function g(h) {
					return (P[h - 1900] & 15)
				}
				function e(i, h) {
					return ((P[i - 1900] & (65536 >> h)) ? 30 : 29)
				}
				function C(m) {
					var k, j = 0, h = 0;
					var l = new Date(1900, 0, 31);
					var n = (m - l) / 86400000;
					this.dayCyl = n + 40;
					this.monCyl = 14;
					for (k = 1900; k < 2050 && n > 0; k++) {
						h = d(k);
						n -= h;
						this.monCyl += 12
					}
					if (n < 0) {
						n += h;
						k--;
						this.monCyl -= 12
					}
					this.year = k;
					this.yearCyl = k - 1864;
					j = g(k);
					this.isLeap = false;
					for (k = 1; k < 13 && n > 0; k++) {
						if (j > 0 && k == (j + 1) && this.isLeap == false) {
							--k;
							this.isLeap = true;
							h = b(this.year)
						} else {
							h = e(this.year, k)
						}
						if (this.isLeap == true && k == (j + 1)) {
							this.isLeap = false
						}
						n -= h;
						if (this.isLeap == false) {
							this.monCyl++
						}
					}
					if (n == 0 && j > 0 && k == j + 1) {
						if (this.isLeap) {
							this.isLeap = false
						} else {
							this.isLeap = true;
							--k;
							--this.monCyl
						}
					}
					if (n < 0) {
						n += h;
						--k;
						--this.monCyl
					}
					this.month = k;
					this.day = n + 1
				}
				function G(h) {
					return h < 10 ? "0" + h : h
				}
				function f(i, j) {
					var h = i;
					return j.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function(k) {
								switch (k) {
									case "yyyy" :
										var l = "000" + h.getFullYear();
										return l.substring(l.length - 4);
									case "dd" :
										return G(h.getDate());
									case "d" :
										return h.getDate().toString();
									case "MM" :
										return G((h.getMonth() + 1));
									case "M" :
										return h.getMonth() + 1
								}
							})
				}
				function Z(i, h) {
					var j;
					switch (i, h) {
						case 10 :
							j = "初十";
							break;
						case 20 :
							j = "二十";
							break;
						case 30 :
							j = "三十";
							break;
						default :
							j = E.charAt(Math.floor(h / 10));
							j += B.charAt(h % 10)
					}
					return (j)
				}
				this.date = Y;
				this.isToday = false;
				this.isRestDay = false;
				this.solarYear = f(Y, "yyyy");
				this.solarMonth = f(Y, "M");
				this.solarDate = f(Y, "d");
				this.solarWeekDay = Y.getDay();
				this.solarWeekDayInChinese = "星期" + B.charAt(this.solarWeekDay);
				var X = new C(Y);
				this.lunarYear = X.year;
				this.shengxiao = O.charAt((this.lunarYear - 4) % 12);
				this.lunarMonth = X.month;
				this.lunarIsLeapMonth = X.isLeap;
				this.lunarMonthInChinese = this.lunarIsLeapMonth ? "闰"
						+ H[X.month - 1] : H[X.month - 1];
				this.lunarDate = X.day;
				this.showInLunar = this.lunarDateInChinese = Z(this.lunarMonth,
						this.lunarDate);
				if (this.lunarDate == 1) {
					this.showInLunar = this.lunarMonthInChinese + "月"
				}
				this.ganzhiYear = a(X.yearCyl);
				this.ganzhiMonth = a(X.monCyl);
				this.ganzhiDate = a(X.dayCyl++);
				this.jieqi = "";
				this.restDays = 0;
				if (c(this.solarYear, (this.solarMonth - 1) * 2) == f(Y, "d")) {
					this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2]
				}
				if (c(this.solarYear, (this.solarMonth - 1) * 2 + 1) == f(Y,
						"d")) {
					this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2
							+ 1]
				}
				if (this.showInLunar == "清明") {
					this.showInLunar = "清明节";
					this.restDays = 1
				}
				this.solarFestival = V[f(Y, "MM") + f(Y, "dd")];
				if (typeof this.solarFestival == "undefined") {
					this.solarFestival = ""
				} else {
					if (/\*(\d)/.test(this.solarFestival)) {
						this.restDays = parseInt(RegExp.$1);
						this.solarFestival = this.solarFestival.replace(/\*\d/,
								"")
					}
				}
				this.showInLunar = (this.solarFestival == "")
						? this.showInLunar
						: this.solarFestival;
				this.lunarFestival = T[this.lunarIsLeapMonth
						? "00"
						: G(this.lunarMonth) + G(this.lunarDate)];
				if (typeof this.lunarFestival == "undefined") {
					this.lunarFestival = ""
				} else {
					if (/\*(\d)/.test(this.lunarFestival)) {
						this.restDays = (this.restDays > parseInt(RegExp.$1))
								? this.restDays
								: parseInt(RegExp.$1);
						this.lunarFestival = this.lunarFestival.replace(/\*\d/,
								"")
					}
				}
				if (this.lunarMonth == 12
						&& this.lunarDate == e(this.lunarYear, 12)) {
					this.lunarFestival = T["0100"];
					this.restDays = 1
				}
				this.showInLunar = (this.lunarFestival == "")
						? this.showInLunar
						: this.lunarFestival;
				this.showInLunar = (this.showInLunar.length > 4)
						? this.showInLunar.substr(0, 2) + "..."
						: this.showInLunar
			}
			return new U(y);
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////
	if(!Function.prototype.bind){
		Function.prototype.bind=function(){
            var __method = this;
            var args = Array.prototype.slice.call(arguments);
            var object = args.shift();
            return function() {
                return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
            }
        };
	}
	window.$PUtils = M139.PUtils;
	 top.M139.Timing.waitForReady('top.$App.getConfig("UserData")', function () {
		window.$PUtils.getUserinfo(function(info){
		    $PUtils.userInfo = info;
		    $PUtils.userInfo.aliasName = ($User.getAliasName()).replace(/@139\.com$/,'');
		});
	 });
})($, _, M139);