/**
 * @author sunsc
 * @update by sukw
 * 彩铃管理类
 */
(function(){

    var ringConfig = {
        musicSite:'http://music.10086.cn/',
        serachUrl:"http://218.200.174.140/sosong/search",
        manageMusic:"http://mdll.10086.cn/",
        ringsSearchType:[{ id: 1, text: "歌曲" }, { id: 2, text: "歌手" }, { id: 4, text: "歌词" }, { id: 3, text: "专辑"}] //12530音乐搜索分类
    };
	var ringsCore=window.ringsCore = {
		//当前选择的搜索分类，即歌手、歌词等
		currSearchType:1,
		//当前请求接口分类，对应interfaceType
		currInterfaceType:"billboard",
		//榜单ID，每次点击分类时重写
		currBillBoardId:3045062,
		//默认榜单ID
		defaultBillBoardId:3045062,
		//请求榜单url
		billBoardUrl:(ringConfig.musicSite || "http://music.10086.cn/") + "newweb/jsp/music_service/queryBillboardById.jsp",
		//榜单参数模板
		billBoardParamFmt:"from={0}&billboardId={1}&pageSize={2}&pageNum={3}",
		//请求搜索url
		serachUrl:ringConfig.serachUrl||"http://218.200.174.140/sosong/search",
		//搜索参数模板
		serachParamFmt:"pageNumber={0}&numberPerPage={1}&searchType={2}&requestID={3}&keyword={4}",
		//彩铃站点
		musicStie:ringConfig.musicSite||"http://music.10086.cn/",
		//彩铃管理url
		manageRingsUrl:(ringConfig.manageMusic ||"http://mdll.10086.cn/")+"newweb/zq/component/lyk/139.jsp?Sid="+top.$App.getSid(),
		//查询用户默认彩铃url
		queryDefaultToneUrl:(ringConfig.manageMusic||"http://mdll.10086.cn/")+"newweb/jsp/music_service/queryDefaultTone.jsp?from={0}&Sid="+top.$App.getSid(),
		//开通彩铃Url
		loginMusicUrl:(ringConfig.manageMusic||"http://mdll.10086.cn/")+"newweb/regRing/regRing/12530/_/_/p.html",
		//接口分类配置
		interfaceType:["billboard","search","getsong"],
		//分页配置
		pageSizeItems:[10,15,20],
		//默认每页记录数
		pageSize:10,
		//当前页索引
		pageIndex:1,
		//序号基数
		pageIndexBase:1,
		//当前页信息
		pageInfo:null,
		//加载数据的提示语
		loadMsg:"正在加载数据...",
		/**
		 * 检查返回值
		 */
		checkResult:function(){
			"undefined"==typeof searchResult && (searchResult="")
		},
		/**
		 * 清空数据源
		 */
		cleanResult:function(){
			"undefined"!=typeof searchResult && (searchResult="")
		},
	    /**
	     * 得到彩铃榜单数据，根据榜单ID得到，暂时提供三个榜单，具体请参参照myRings.html
	     * @param {string} 必选 url 请求接口地址
	     * @param {function} 可选 callback 回调方法。 
	     */
		getBillBoardData: function(url, callback){
			this.cleanResult();//清理全局变量searchResult
			if("string"==typeof url && url){
				try{
                    M139.core.utilCreateScriptTag(
                        {
                            id: "ringList",
                            src: url,
                            charset: "utf-8"
                        },
                        function () {
                            //检查返回数据
						    ringsCore.checkResult();
						    var obj = ringsCore.xmlToJson(searchResult);
						    ringsCore.reBulidBillBoardData(ringsCore.xmlToJson(searchResult), callback)
                        }
                    );
				}
				catch(e){}
			}
	    },
		/**
		 * 得到请求接口配置,暂时是返回url
		 * @param {string} 必选 interfaceType 接口分类 对应ringsCore.interfaceType:["billboard","search","getsong"]
		 * @return {string} 请求接口url，参数部分是模板,使用时再用format进行重构
		 */
		getRequestConfig:function(interfaceType){
			var url="";
			if(interfaceType && "string" ==typeof interfaceType){
				switch (interfaceType) {
                    case ringsCore.interfaceType[0]://返回榜单接口地址
                        url= ringsCore.billBoardUrl + "?" + ringsCore.billBoardParamFmt
						break;
                    case ringsCore.interfaceType[1]://返回搜索接口地址
                        url= ringsCore.serachUrl + "?" + ringsCore.serachParamFmt
						break;
					case ringsCore.interfaceType[2]://返回得到歌曲接口地址
						url= ringsCore.getSongUrl + "?" + ringsCore.getSongParamFmt
						break;
                    default:
                        break;
                }
			}
			return url;
		},
		/**
		 * 得到用户彩铃数据，通过12530接口查询当前用户的彩铃情况
		 * @param {string} 必选 url 请求接口地址
		 * @param {function} 可选 callback 回调方法
		 */
		getRingOfUser:function(url,callback){
			this.cleanResult();//清理全局变量searchResult
			if("string" == typeof url && url){
				try {
                     M139.core.utilCreateScriptTag(
                        {
                            id: "userRing",
                            src: url,
                            charset: "utf-8"
                        },
                        function () {
                            ringsCore.checkResult();
						    //转换xml成json后回调
						    var data = ringsCore.xmlToJson(searchResult);
						    //debugger;
						    callback && callback(data);
                        }
                    );
                }
                catch (e) {
					callback && callback({isCrbt:"error"})
				}
			}
		},
		/**
		 * 重构彩铃数据，按照ringsUI.trTemplate模板内容，构造数据结构
		 * @param {Object} 必选 response 数据
		 * @param {function} 可选 callback 回调
		 */
		reBulidBillBoardData:function(result,callback){
            var songList = null,//歌曲列表
             	newList = null,//新歌曲列表
             	curr = null,//当前歌曲
             	i = null,//下标
				songCount=0;//歌曲总数
            /**
             * 创建新的数据
             * @param {Object} 必选 data 遍历的当前源数据
             * @param {int} 必选 pSize 每页记录数
             * @param {int} 必选 pIndex 当前页下标
             * @param {int} 可选 i 遍历的当前源数据下标
             */
            function createData(data,pSize,pIndex,i){
				if(data && 
					"object"===typeof data && 
					"number"===typeof pIndex && 
					"number"===typeof pSize){
					data.trClass = "";//行样式，空为使用灰色，即深色，even是白色
					data.serialHtml = "";
					//行样式，序号列
                    switch (i) {
                        case 0:
                            data.serialHtml = "<i class=\"n1\"></i>"//第二列序号样式
                            break;
                        case 1:
                            data.trClass = "class=\"even\"";//行样式
                            data.serialHtml = "<i class=\"n2\"></i>"//第二列序号样式
                            break;
                        case 2:
                            data.serialHtml = "<i class=\"n3\"></i>"//第二列序号样式
                            break;
                        default:
                            if ("number" == typeof i) {
                                if (pSize % 2 == 0) {//偶数分页，如10、20
                                	//偶数行显示白色
                                    data.trClass = i % 2 != 0 ? "class=\"even\"" : "";
                                }
                                else {//奇数分页，如：15，17
                                	//每页的第一条记录，如果每页按15条显示，则是第15条，第30条，第45条，第一条在前面的case 0时已经处理
                                    if (i % pSize == 0) {
										//第一行显示灰色
                                        data.trClass = "";
                                    }
									else{//当前页是分页基数的偶数页，如第2、4、6
										if(pIndex % 2==0){
											//奇数分页时，偶数页行显示
											data.trClass = i % 2 == 0 ? "class=\"even\"" : "";	
										}
										else{
											//奇数分页时，奇数页行显示
											data.trClass = i % 2 != 0 ? "class=\"even\"" : "";
										}
									}
                                }
								//序号列
                                data.serialHtml = "<span>" + i && (i + 1) + "</span>"
                            }
                            break;
                    }
                    var songName = data.songName || "";//歌曲名
                    var singerName = data.singerName || "";//歌手名
                    data.songName = ConvertStr(songName);//转换字符串
                    data.singerName = ConvertStr(singerName);//转换字符串
                    data.shortSongName = songName.length > 20 ? songName.substr(0, 20) + "..." : songName;//截断显示
                    data.shortSingerName = singerName.length > 10 ? singerName.substr(0, 10) + "..." : singerName;//截断显示
                    songName=singerName=null;
				}
				return data||null;
            }
            /**
             * 转换字符串
             * @param {string} 可选 str 字符串
             * @return {string} 转换后字符串
             */
            function ConvertStr(str){
				if(str && "string"===typeof str){
					str = str.replace(/&#39;/g, "’");
                    str = str.replace(/&quot;/g, "’");
				}
				return str
            }
			if(result && 
				result.operatecode &&//是否成功代码 
				result.operatecode == "200" && //200表示成功
				result.songs &&//列表顶层节点 
				result.songs.song){//列表数组
				songList=result.songs.song,//歌曲列表
				newList=[],//新歌曲列表
				i=0,//下标
				songCount=result.songs.song.length||0,
				pIndex=parseInt(result.pageInfo && result.pageInfo.pageNum || 0),
				pSize=parseInt(result.pageInfo && result.pageInfo.pageSize || 0);
				//序号基数
				ringsCore.pageIndexBase=pIndex*pSize-pSize;
				/**
				 * 以下逻辑是处理由xml转成json的节点问题。
				 * 当songs下只有song一个节点时，如<songs><song></song></songs>
				 * xmltoJson成会默认songs下为对象不是数组，即转换后为songs.song.songName
				 * 应该为songs.song[{songName}]
				 */
				if(songCount){//长度大于1则正常遍历重构数据
					songCount--;//从0开始计算长度
					while (i <= songCount) {
                        curr=songList[i];
						//得到重构数据，并把新数据放到列表中
						curr && (curr = createData(curr, pSize,pIndex,i+ringsCore.pageIndexBase),newList.push(curr));
                        i++
                    }
				}
				else{//如果长度为0则加入子节点
					songList && newList.push(createData(songList,0));
				}
				//把重构数据赋值给列表对象
				result.songList=newList;
				newList=songList=curr=null
			}
			callback && callback(result)
		},
		
		/**
		 * 转换xml字符串成json对象
		 * @param {string} 必选 xml xml格式字符串
		 * @return {object} json对象或空
		 */
		xmlToJson:function(xml){
			var result=null;
			if("string"==typeof xml && 
			xml && 
			$ && 
			$.JxmlToJson){
				try{result=$.JxmlToJson(xml)}catch(e){}
			}
			return result;
		}
	};
	
	var ringsUI=window.ringsUI={
		//是否点击过全选标记
		isChkflag:false,
		//是否创建翻页，用在每次重制列表
		isCreatePageTurnner:false,
		//是否已经加载过我的彩铃信息
		isMyRingsLoaded:false,
		//加载列表操作
		loadListHandler:null,
		//列表加载数据是显示提示语的延迟时间
		delay:15000,
		//参数
		parameters:null,
		//导航分类
	    nvaType: [{
	        text: "音乐推荐",
	        ext: function(obj){
				ringsUI.parameters.contentList.style.display="block";//显示列表内容
				//ringsUI.parameters.searchArea.style.display="block";//搜索区
				ringsUI.parameters.footer.style.display="block";//显示页脚
				ringsUI.parameters.iframeContainer.style.display="none";//显示彩铃管理iframe
				ringsUI.changeNavClass(obj,"current");//改变导航样式
				//如果列表没有加载过，第一个节点是div（无数据时或没有加载完时的占位元素），则请求接口得到数据，显示列表
                ringsUI.parameters.tableList.firstChild.nodeName=="DIV" && (function(param){
                    ringsUI.showList(ringsCore.interfaceType[0], {
                        from: "test",
                        billboardId: ringsCore.currBillBoardId,
                        pageSize: ringsCore.pageSize,
                        tableList: param.tableList,
                        ulTypeList: param.ulTypeList
                    });
                })(ringsUI.parameters);
				//显示广告，12530标榜单
				ringsUI.parameters.showMusicAD(1361,1362)
	        }
	    }, {
	        text: "彩铃管理",
	        ext: function(obj){
				var param=ringsUI.parameters;
				param.contentList.style.display="none";
				//param.searchArea.style.display="none";
				param.footer.style.display="none";
				param.iframeContainer.style.display="block";
				param.mgrIframe.src!=ringsCore.manageRingsUrl && (param.mgrIframe.src=ringsCore.manageRingsUrl);
				ringsUI.changeNavClass(obj,"current");
				param=null;
	        }
	    }],
		//加载彩铃管理页提示
		mgrMsg:'<div style="font-size:12px;width:320px;height:50px;text-align:center;margin:0;padding:0;margin-left:auto;margin-right:auto;margin-top:50px;">正在加载数据... ...<!--如果长时间没有影响请点击 <a href="javascript:top.$App.show(\'myrings\')">刷新</a>--></div>',
		//彩铃推荐给好友的信纸模板
		letterTemplate:{
			subject:"好友{0}向您推荐了歌曲《{1}》，快来试听吧",//参数0：好友手机号，参数1：歌曲名
			//参数0：歌曲名，参数1：歌手名，参数2：试听地址，参数3：资源服务器路径
			content:'<table style="margin:0;font-family:Arial, Helvetica, sans-serif; width:100%;background:#F4F9FF;" align="center" cellpadding="0" cellspacing="0"><tbody><tr>\
						<td style="background:url({3}/images/myRings_mail_top_x.png)" width="235"><img src="{3}/images/myRings_mail_logo.png" alt="logoImg" height="53" width="235"></td>\
						<td style="background:url({3}/images/myRings_mail_top_x.png)">&nbsp;</td>\
						<td width="5"><img src="{3}/images/myRings_mail_top_r.png" alt="bgImg" height="53" width="5"></td></tr></tbody>\
					</table>\
					<table style="margin:0;font-family:Arial, Helvetica, sans-serif; width:100%;background:#F4F9FF;" align="center" cellpadding="0" cellspacing="0"><tbody><tr>\
						<td width="20"></td>\
						<td>\
							<table style="border-bottom:1px #efefef solid;" cellpadding="0" width="100%"><tbody><tr>\
								<td style="padding-bottom: 48px; font-size: 14px; font-family: Arial,Helvetica,sans-serif;" valign="top">\
									<table style="margin:16px auto;width:100%;color:#333;"><tbody><tr>\
										<td style="font-size: 12px;">\
											<h2 style="color:#FF6600;font-size:12px;">{0}</h2>\
											<p style="margin:8px 0;">歌手：<span>{1}</span></p>\
											<p style="margin:8px 0;">试听地址：<a style="color:#666" href="{2}" target="_blank">{2}</a></p>\
										</td></tr><tr>\
										<td style="font-size: 12px;"></td></tr></tbody></table></td></tr></tbody>\
									</table>\
									<table cellpadding="0" style="border-top:1px #fff solid" width="100%"><tr>\
										<td style="width:190px;text-align:right;font-size:14px;font-family:Arial, Helvetica, sans-serif;color:#0739ac;line-height:2.5;"><strong>139邮箱</strong><a href="http://mail.10086.cn/" style="margin-left:.5em;color:#0739ac" target="_blank">mail.10086.cn</a></td>\
										<td style="text-align:right;font-size:12px;font-family:Arial, Helvetica, sans-serif;line-height:2.5;color:#555555;">感谢您一直以来的支持，我们将不断创新，为您带来更好的邮箱体验!</td>\
										<td width="10"></td></tr>\
									</table>\
								</td><td width="20"></td></tr></tbody>\
							</table>\
						</td></tr></tbody>\
					</table>'
		},
		//音乐推荐列表模板
		/*trTemplate:"<!--item start-->\
				<table class=\"tableList\" cellspacing=\"0\" cellpadding=\"0\"><tr $trClass>\
				<td class=\"t1\"><input name=\"songChk\" type=\"checkbox\" value=\"$songId\" /></td>\
				<td class=\"tN\">$serialHtml</td>\
				<td class=\"t2\">$shortSongName</td>\
				<td class=\"t3\">$shortSingerName</td>\
				<td class=\"t4\"><a style=\"cursor:pointer\" behavior=\"彩铃_列表区点击试听\" songId=\"$songId\" href=\"javascript:\" onclick=\"ringsUI.playMusic('$songId')\" title=\"试听\"><i class=\"crA\"></i></a></td>\
				<td class=\"t5\"><a style=\"cursor:pointer\" behavior=\"彩铃_列表区点击推荐给好友\" songId=\"$songId\" href=\"javascript:\" onclick=\"ringsUI.tellFriend('$songName','$singerName','$songId')\" title=\"推荐给好友\"><i class=\"crB\"></i></a></td>\
				<td class=\"t6\"><a style=\"cursor:pointer\" behavior=\"彩铃_列表区点击订制\" songId=\"$songId\" href=\"javascript:\" onclick=\"ringsUI.playMusic('$songId')\" title=\"订制\"><i class=\"crC\"></i></a></td>\
				</tr></table>\
				<!--item end-->",*/
        trTemplate:[
 				'<table class="tableList" cellspacing="0" cellpadding="0"><tr {trClass}>',
 				'<td class="t1"><input name="songChk" type="checkbox" value="{songId}" /></td>',
 				'<td class="tN">{serialHtml}</td>',
 				'<td class="t2">{shortSongName}</td>',
 				'<td class="t3">{shortSingerName}</td>',
 				'<td class="t4"><a style="cursor:pointer" behavior="彩铃_列表区点击试听" songId="{songId}" href="javascript:;" onclick="ringsUI.playMusic(\'{songId}\')" title="试听"><i class="crA"></i></a></td>',
 				'<td class="t5"><a style="cursor:pointer" behavior="彩铃_列表区点击推荐给好友" songId="{songId}" href="javascript:;" onclick="ringsUI.tellFriend(\'{songName}\',\'{singerName}\',\'{songId}\')" title="推荐给好友"><i class="crB"></i></a></td>',
 				'<td class="t6"><a style="cursor:pointer" behavior="彩铃_列表区点击订制" songId="{songId}" href="javascript:;" onclick="ringsUI.playMusic(\'{songId}\')" title="订制"><i class="crC"></i></a></td>',
 				'</tr></table>'].join(""),				
		/*
		 * 创建音乐分类菜单
		 */
		createRingsTypeMenu:function(){
			var data= [{id:1,text:"歌曲"},{id:2,text:"歌手"},{id:4,text:"歌词"},{id:3,text:"专辑"}],//分类
			i=0,//下标
			l=(data && data.length - 1)||0,//菜单长度
			items=[],//菜单组件数据源
			curr=null,//当前子菜单数据
			id=null,
			text=null,
			menuInstance=null,//菜单实例
			menuParameters=null,//菜单参数
			menuContainer=this.parameters.menuContainer||null;
			//构造子菜单数据
			if(menuContainer){
				if (data.length) {
                    while (i <= l) {
                        data[i] && (curr=data[i],id=curr.id,text=curr.text);
                        if (curr && curr.id && curr.text) {
                            items.push({
                                id: id,
                                text: text,
                                click: function(){
                                    ringsCore.currSearchType = id//当前搜索分类
                                }
                            });
                        }
                        i++
                    }
                }
				//菜单参数
                menuParameters = {
                    name: "searchTypeMenu",
                    text: "歌曲",
                    items: items
                };
				//创建菜单
                menuInstance = ringsTypeMenu.createMenu(menuParameters, {
                    button: "",
                    menu: "selectOption",
                    icon: ""
                });
				//加载菜单
				menuInstance && menuContainer.appendChild(menuInstance);
				menuContainer=menuInstance=menuParameters=items=data=null
			}
		},
		/**
		 * 创建分页操作区域
		 * @param {Object} 必选 pageInfo 当前页面的记录信息
		 */
		createPageTurnner:function(pageInfo){
			/**
			 * 创建上页下页按扭
			 * @param {Object} 必选 container 上页下页DOM容器
			 */
			function createButton(container){
				if(container){
					container.innerHTML=" <a class=\"prev\" style=\"display:none\" href=\"javascript:\">上一页</a> <a class=\"nexts\" href=\"javascript:\">下一页</a> ";
					//上页点击事件
					container.children[0].onclick=function(){
						ringsCore.pageIndex > 1 && setPageNum(ringsCore.pageIndex - 1,pageInfo)
					}
					//下页点击事件
					container.children[1].onclick=function(){
						ringsCore.pageIndex < pageInfo.pageTotal && setPageNum(ringsCore.pageIndex + 1,pageInfo)
					}
					container=null;
				}
			}
			/**
			 * 创建分页下拉框
			 * @param {Object} 必选 g1 顶部下拉框DOM对象 
			 * @param {Object} 必选 g2 底部下拉框DOM对象
			 */
			function createPageSize(g1,g2){
				var i=1,
					l=pageInfo.pageTotal||1,//总页数
					param=ringsUI.parameters||null;//参数集合
				if(g1 && g2 && pageInfo && param){
					//先清空下拉框
					g1.options.length = g2.options.length = 0;
					//增加新的元素
		            while (i <= l) {
	                    g1.options.add(ringsUI.getOption(i+"/"+l, i));
	                    g2.options.add(ringsUI.getOption(i+"/"+l, i));
		                i++
		            }
					//改变时翻页并同步另一个下拉框的值
					g1.onchange=function(){
						setPageNum(this.value,pageInfo)
					}
					g2.onchange=function(){
						setPageNum(this.value,pageInfo)
					}
				}
				else{
					try{
						g1.options.length = g2.options.length = 0	
					}catch(e){}
				}
				g1=g2=param=null;
			}
			/**
			 * 设置当前页码，同时翻页操作
			 * @param {string} 必选 value 当前页
			 */
			function setPageNum(value){
				var g1=ringsUI.parameters.showPageHead ||null,
					g2=ringsUI.parameters.showPageFoot||null;
				var i=parseInt(value),
					ph=ringsUI.parameters.pageButtonHead,
					pf=ringsUI.parameters.pageButtonFoot;
				var ph1=ph && ph.children && ph.children[0],
					ph2=ph && ph.children && ph.children[1],
					pf1=pf && pf.children && pf.children[0],
					pf2=pf && pf.children && pf.children[1];
				if(value&& g1 &&g2 && pageInfo){
					ph1.style.display=ph2.style.display=pf1.style.display=pf2.style.display="inline";
					//页码不能小于首页，隐藏上页按扭
					if(i<=1){
						ph1 && (ph1.style.display="none");
						ph2 && (ph2.style.display="inline");
						pf1 && (pf1.style.display="none");
						pf2 && (pf2.style.display="inline");
						i=1
					}
					//页码不能大于末页，隐藏下页按扭
					if(i>=parseInt(pageInfo.pageTotal)){
						ph1 && (ph1.style.display="inline");
						ph2 && (ph2.style.display="none");
						pf1 && (pf1.style.display="inline");
						pf2 && (pf2.style.display="none");
						i=parseInt(pageInfo.pageTotal)
					}
					g1.value=g2.value=ringsCore.pageIndex=i;//设置下拉框和全局页码
	                //翻页
	                ringsUI.showList(ringsCore.currInterfaceType, {
	                    from: "test",
	                    billboardId: ringsCore.currBillBoardId,//接口参数：榜单ID
	                    pageSize: ringsCore.pageSize,//接口参数：每页大小
	                    tableList: ringsUI.parameters.tableList,//列表容器
	                    ulTypeList: ringsUI.parameters.ulTypeList,//分类容器
	                    pageNum:ringsCore.pageIndex//当前页
	                })
					ph=pf=ph1=ph2=pf1=pf2=g1=g2=null
				}
			}
			var param=this.parameters||null;
            if (param &&
            	param.pageButtonHead && //顶部上下页父容器
            	param.showPageHead && //顶部每数设置下拉框
            	param.pageButtonFoot && //底部上下页父容器
            	param.showPageFoot && //底部每数设置下拉框
            	pageInfo && //页面记录对象
            	!this.isCreatePageTurnner) {
                    ringsCore.pageIndex = 1;//当前页下标
                    ringsUI.isCreatePageTurnner = true;//重置
                    createButton(param.pageButtonHead);//头部上页下页按扭
                    createButton(param.pageButtonFoot);//底部上页下页按扭
                    createPageSize(param.showPageHead, param.showPageFoot)//每页显示记录设置
            }
			param=null;
		},
		/**
		 * 创建全选功能
		 */
		createSelectAll:function(){
			var param=this.parameters||null;
			var s1=param && param.selectAllHead ||null;//头部全选
				s2=param && param.selectAllFoot ||null;//底部全选
            /**
             * 全选点击事件
             */
            function click(){
                var chk = document.getElementsByName("songChk"),//当前页所有复选框 
             		i = 0;//复选框下标
                var l = (chk && chk.length && chk.length - 1) || -1;//复选框总数
                if (ringsUI.isChkflag) {
					ringsUI.setSelectAllText("全选");
                    ringsUI.isChkflag = false
                }
                else {
					ringsUI.setSelectAllText("不选");
                    ringsUI.isChkflag = true
                }
                //选中状态
                while (i <= l) {
                    chk[i].checked = ringsUI.isChkflag;
                    i++
                }
            }
            $(s1).click(click);
            $(s2).click(click);
			
			//s1 && (Utils.addEvent(s1,"onclick",click))
			//s2 && (Utils.addEvent(s2,"onclick",click))
			param=s1=s2=null;
		},
		/**
		 * 创建页数设置下拉框
		 * @param {Object} 必选 g1 顶部下拉框DOM对象
		 * @param {Object} 必选 g2 底部下拉框DOM对象
		 */
		createSetPageSize:function(g1,g2){
            var psItems = ringsCore.pageSizeItems||null,//设置页数列表
             	curr = null, 
				i = 0;
            var l = (psItems && psItems.length - 1) || 0;//下拉框长度
            if (g1 && g2 && psItems) {
				//先清空下拉框
                g1.options.length = g2.options.length = 0;
				//增加新的元素
                while (i <= l) {
                    psItems[i] &&
                    (function(value){
                        g1.options.add(ringsUI.getOption(value, value));
                        g2.options.add(ringsUI.getOption(value, value));
                    })(psItems[i]);
                    i++
                }
				//改变事件
                g1.onchange = function(g2){
                    ringsUI.setPageSize.call(this, ringsUI.parameters.showPageSizeFoot)
                }
                g2.onchange = function(g1){
                    ringsUI.setPageSize.call(this, ringsUI.parameters.showPageSizeHead)
                }
				psItems = curr = g1 = g2 = null
            }
		},
		/**
		 * 清理列表
		 */
		cleanList:function(){
			var tl=this.parameters && this.parameters.tableList || null;
			if(tl){//重写容器结构
				tl.innerHTML="<div style=\"height: 300px;\"></div>"
			}
			tl=null;
		},
		/**
		 * 计算高度
		 * @param {Object} 必选 targetDom 目标DOM对象
		 * @param {string} 必选 heightValue 要设置的高度
		 */
		calcHeight:function(targetDom,heightValue){
			targetDom && heightValue && (targetDom.style.height=heightValue+"px")
		},
		/**
		 * 改变DOM对象的className属性
		 * @param 必选 {object} obj DOM对象
		 * @param 可选 {string} value 属性值
		 */
		changeNavClass:function(obj,value){
			obj && (obj.className=value)
		},
		/**
		 * 初始化榜单分类
		 */
		initBillBoardType:function(){
			var param=this.parameters || null;//参数集合
			var typeNodes=param && param.ulTypeList.children || null;//榜单分类子菜单
			var i=0,//绑定事件时当前分类下标
				j=0,//样式切换时当前分类下标
				l="number"==typeof typeNodes.length && typeNodes.length-1||0;//榜单分类总数
			if(param && typeNodes){
				while(i<=l){
					ringsUI.parameters.ulTypeList.children[i].onclick=function(){
						var p=ringsUI.parameters;
						//重置复选框标记
						ringsUI.setSelectAllText("全选");
						//当前榜单ID
						ringsCore.currBillBoardId=this.getAttribute("billboardId");
						p.showMusicAD && p.showMusicAD(this.getAttribute("adtxt")||"",this.getAttribute("adpic")||"");
						//重置创建分页标记
						ringsUI.isCreatePageTurnner = false;
						//显示列表
						ringsUI.showList(ringsCore.interfaceType[0],{
							from:"test",
							billboardId:ringsCore.currBillBoardId,//接口参数：榜单ID
							pageSize:ringsCore.pageSize,//接口参数：每页大小
							tableList:p.tableList,//列表容器
							ulTypeList:p.ulTypeList//分类容器
						});
						j=0
						//样式切换，清空每个分类样式
						while(j<=l){
							p.ulTypeList.children[j].className="";
							j++
						}
						//当前分类样式
						this.className="current";
						p=null;
					}
					i++
				}
			}
			param=typeNodes=null;
		},
		/**
		 * 初始化用户彩铃信息
		 * @param {Object} 必选 彩铃信息DOM对象
		 */
		initRingInfoOfUser:function(dom){
			//得到彩铃信息区域
			var ringLinkWrapper=ringsUI.getRingLinkWrapper();
			if(dom){
				//改变彩铃内容的容器对象
				if(ringLinkWrapper){
					dom.appendChild(ringLinkWrapper);
					//注册鼠标移入事件
					//top.Utils.addEvent(ringLinkWrapper,"onmouseover",ringsUI.getRingInfo);
				    $(ringLinkWrapper).mouseover(ringsUI.getRingInfo);
				}
				ringLinkWrapper=null;
			}
		},
		/**
		 * 初始化多选播放
		 */
		initMultiPlay:function(){
            var p = this.parameters || null;
            if (p && p.multiPlayHead && p.multiPlayFoot) { 
                //顶部播放器点击事件绑定
                $(p.multiPlayHead).click(function(){
                    ringsUI.playMusic(ringsUI.getSelectSongs(), 2);
                });
                //底部播放器点击事件绑定
                $(p.multiPlayFoot).click(function(){
                    ringsUI.playMusic(ringsUI.getSelectSongs(), 2);
                });
                            
            }
            p = null;
		},
		/**
		 * 初始化后退链接，对应搜索按扭
		 */
		initBackLinkClick:function(){
            var p = this.parameters||null;
            if (p && p.seatchBtn &&//搜索按扭
            p.ulListTypeContainer &&//左侧榜单分类
            p.backLink &&//返回按扭
            p.tableListCon_wrap &&//列表容器
            p.placeholder) {//返回链接
				/*Utils.addEvent(p.backLink, "onclick", function(){
                    ringsCore.currInterfaceType = ringsCore.interfaceType[0];//设置当前请示接口类别
                    p.ulListTypeContainer.style.display = "block";//显示列表
                    p.backLink.style.display = "none";//隐藏返回链接
                    p.tableListCon_wrap.style.marginLeft = "150px";//显示榜单分类
                    p.placeholder.className = "w134";//返回链接样式
                });*/
                $(p.backLink).click(function(){
                    ringsCore.currInterfaceType = ringsCore.interfaceType[0];//设置当前请示接口类别
                    p.ulListTypeContainer.style.display = "block";//显示列表
                    p.backLink.style.display = "none";//隐藏返回链接
                    p.tableListCon_wrap.style.marginLeft = "150px";//显示榜单分类
                    p.placeholder.className = "w134";//返回链接样式
                });
            }
            p = null;
		},
		/**
		 * 初始化导航区域
		 */
		initNavigation:function(){
			var mainNav= this.parameters.mainNav || null,//导航Dom对象
			nodes=null,//子元素
			i=0,//绑定事件时当前导航下标
			l=0;//所有导航长度
			if(mainNav){
				nodes=mainNav.children;//所有可点击的导航元素
				l=nodes.length-1;
	            while (i <= l) {
	                nodes[i].onclick = function(){
	                    var j = 0,
							l=this.parentNode.children.length-1;//样式切换时当前导类下标
						//样式切换
	                    while (j <= l) {
	                        this.parentNode.children[j].className = "";
	                        j++
	                    }
						//点击调用
						ringsUI.nvaType[parseInt(this.getAttribute("navName")||0)].ext(this);
	                }
	                i++
	            }
			}
			mainNav=nodes=null;
		},
		/**
		 * 全局初始化
		 * @param {Object} 必选 parameters 所有参数，参见myRings.html页
		 */
		init:function(parameters){
			this.parameters=parameters;//参数集合
			this.initNavigation();//导航
			//this.createRingsTypeMenu();
			this.initBillBoardType();//榜单
			//this.initBackLinkClick();
			var nType=typeof top.currRingNavType=="undefined"?0:top.currRingNavType,//打开tab页标记
				mrgDoc=null;
            try {
                mrgDoc = parameters.mgrIframe.contentDocument || null;//彩铃管理页doc对象
            } 
            catch (e) {}
			//按来源切换tab页
			if(nType && parameters.mgrIframe.src!=ringsCore.manageRingsUrl){//彩铃管理
				ringsUI.resize();//重置内嵌页高度
				mrgDoc && (mrgDoc.body.innerHTML=ringsUI.mgrMsg);//没有渲染前的提示语
				//按导航类别显示页面内容
				ringsUI.nvaType[parseInt(nType)].ext(parameters.nav1)
			}
			else{//音乐推荐列表
				//切换导航样式
                ringsUI.changeNavClass(parameters.nav0, "current");
				//显示列表
                ringsUI.showList(ringsCore.interfaceType[0], {
                    from: "test",
                    billboardId: ringsCore.currBillBoardId,
                    pageSize: ringsCore.pageSize,
                    tableList: parameters.tableList,
                    ulTypeList: parameters.ulTypeList
                });
                //显示广告，默认12530标榜单
                parameters.showMusicAD(1361, 1362)
			}
			//页大小设置
			this.createSetPageSize(parameters.showPageSizeHead,parameters.showPageSizeFoot);
			this.createSelectAll();//全选
			this.initMultiPlay();//连续播放
			mrgDoc=null;
		},
		/**
		 * 得到彩铃链接容器
		 */
		getRingLinkWrapper:function(){
			//创建彩铃信息区域
			var ringLinkWrapper=document.createElement("div");
			ringLinkWrapper.id="ringLinkWrapper";
			ringLinkWrapper.style.display="inline";
			//显示默认提示文字
			ringLinkWrapper.innerHTML="您的彩铃：<a id=\"ringLink\" href=\"javascript:\">查看您定制的彩铃</a>";
			return ringLinkWrapper||null;
		},
		/**
		 * 得到彩铃信息
		 */
		getRingInfo:function(){
            //如果当前请求后，则不再请求(如果刷新当前页，则可以请求，因为变量被重置了)
			if(ringsUI.isMyRingsLoaded){return;}
			//彩铃链接容器
			var ringLinkWrapper=document.getElementById("ringLinkWrapper") || null;
			//显示加载提示
			ringLinkWrapper && (document.all?(ringLinkWrapper.innerText="您的彩铃：Loading... ..."):ringLinkWrapper.innerHTML="您的彩铃：Loading... ...");
			//删除鼠标移入事件
			//top.Utils.removeEvent(ringLinkWrapper,"onmouseover",ringsUI.getRingInfo);
			$(ringLinkWrapper).unbind('onmouseover');
			ringLinkWrapper=null;
			//请求用户彩铃
            ringsCore.getRingOfUser(top.$T.Utils.format(ringsCore.queryDefaultToneUrl,[top.$User.getShortUid()]), function(data){
                var ringInfo = {
                    toneName: "",//歌曲名
                    text: "",//提示语
                    click: "",//点击事件绑定方法
                    behavior: ""//上报属性
                },//用户彩铃信息
                toneInfo=data && data.toneInfo||null,//铃音信息
                isCrbt=data && data.isCrbt ||"",//是否开通彩铃标记
             	tn = "您没有设置彩铃，",//歌曲名称或提示语部分
				ringLinkWrapper=null,//彩铃链接容器
				ringLink=null;//彩铃链接
                if (data && data.isCrbt) {
					//如果没有歌曲名，则显示默认提示语
					tn = toneInfo && toneInfo.toneName ||tn;
					//替换特殊字符
					tn=tn.replace(/&#39;/g,"'"); 
                    //歌曲名称，超过13个字符截断显示
                    ringInfo.toneName = (tn.length > 13 ? tn.substr(0, 13) + "..." : tn) + " -";
                    //在欢迎页点击彩铃入口，彩铃导航下标,0:音乐推荐，1:彩铃管理
                    top.currRingNavType = 1
					//case用户彩铃信息状态
                    if (isCrbt == "true") {//有彩铃
                        ringInfo.text = "-更换彩铃";
						//特殊情况，标记有彩铃，但没有铃音信息
                        ringInfo.toneName = !toneInfo && "未知歌曲名，" || ringInfo.toneName;
                        ringInfo.behavior = "彩铃_更换彩铃";
                    }
                    else if (isCrbt == "false") {//没有彩铃
                            ringInfo.text = "-开通彩铃";
                            ringInfo.toneName = "您现在没有彩铃，";
                            ringInfo.behavior = "彩铃_开通彩铃";
                        }
					else{
						ringInfo.text = "查询失败，请稍候再试";
                        ringInfo.toneName = "error";
                        ringInfo.behavior = "";
					}
					//彩铃链接容器
					ringLinkWrapper=document.getElementById("ringLinkWrapper");
					if(ringLinkWrapper){
						//如果请求错误，显示提示语，并再次注册事件。
						if(ringInfo.toneName=="error"){
							ringInfo.toneName="";
							//打开开关，可以继续请求彩铃信息
							ringsUI.isMyRingsLoaded=false;
							//注册鼠标移入事件
							//top.Utils.addEvent(ringLinkWrapper,"onmouseover",ringsUI.getRingInfo);
						    $(ringLinkWrapper).mouseover(ringsUI.getRingInfo);
						}
						else{
							//已经成功请求彩铃接口，关闭开关
							ringsUI.isMyRingsLoaded=true;
						}
						//改变个人信息彩铃节点 
						ringLinkWrapper.innerText="";
						ringLinkWrapper.innerHTML="";
						var t=document.createTextNode("您的彩铃："+ringInfo.toneName);
						ringLinkWrapper.appendChild(t);
						t=null;
						ringLink=document.createElement("a");
						ringLink.onclick=function(){top.$App.show('myrings')}
						ringLink.setAttribute("behavior",ringInfo.behavior);
						ringLink.href="javascript:void(0)";
						document.all?(ringLink.innerText=ringInfo.text):(ringLink.textContent=ringInfo.text);
						ringLinkWrapper.appendChild(ringLink);
						ringLink=null;
					}
                }
                ringLinkWrapper=ringInfo =toneInfo=null;
            })
		},
		/**
		 * 得到下拉框的option元素对象
		 * @param {string} 必选 text
		 * @param {string} 必选 value
		 * @return {Object} Option对象
		 */
		getOption:function (text,value){
			return (text && value && new Option(text,value))||null
		},
		/**
		 * 得到选择的复先框(歌曲ID)
		 * @return {string} 逗号分割的歌曲ID，如 123456,9875
		 */
		getSelectSongs:function(){
			//当前页所有复选框
			var songChks=ringsUI.parameters.songChksName && document.getElementsByName(ringsUI.parameters.songChksName)||"",
			idArray=[],//所有已经选择的复选框
			ids="";//字符串形势的id串连
			if(songChks){
				//累加所选的复选框的值
				$.each(songChks,function(index,item){
					item && item.checked && idArray.push(item.value);
				})
				ids=idArray.join(",");
			}
			idArray=null;
			return ids;
		},
		/**
		 * 得到播放器Url
		 * @param {string} 必选 songsId 单个或多个(逗号分割)的歌曲ID，如 123456,9875或123456
		 * @param {int} 可选 mode 播发模式 1单曲播放，2连续播放
		 * @return {string} 播放器地址
		 */
		getPlayerUrl:function(songsId,mode){
			//单曲播放地址
			var singlePlayUrl= ringsCore.musicStie+'newweb/qk/qkshow/{0}/t/139mail.html',
			//继续播放地址
			multiPlayUrl= ringsCore.musicStie+'newweb/music_service/playerForLink/139mail/_/_/{0}/2/3/p.html';
			if("string"==typeof songsId && songsId){
				switch(parseInt(mode)){
					case 1://单放
						return singlePlayUrl.format(songsId)
					break;
					case 2://连播
						return multiPlayUrl.format(songsId)
					break;
					default://其它情况单放
						return singlePlayUrl.format(songsId)
					break;
				}
			}
			return false;
		},
		/**
		 * 播放歌曲，调用第三方接口新开窗口
		 * @param {string} songsId 单个或多个(逗号分割)的歌曲ID，如 123456,9875或123456
		 * @param {int} mode 播发模式 1单曲播放，2连续播放
		 */
		playMusic:function(songsId,mode){
			if("string"==typeof songsId && songsId){//新开窗口调用12530播放器
				window.open(ringsUI.getPlayerUrl(songsId,mode)||"", 'orders')
			}
			else{//没有选择歌曲，弹出提示语
				top.$Msg.alert('请选择歌曲再播放！');
			}
		},
		/**
		 * 调整我的彩铃管理iframe高度
		 */
		resize:function(){
			var mgrIframe=this.parameters.mgrIframe,//彩铃管理
			mainIframe=top.document.getElementById("myRings"),//我的彩铃
			mianHeight =0,//彩铃iframe高度
			navHeight=0;//彩铃页顶部导航区域高度
            try {
                mianHeight = parseInt(mainIframe.style.height);
                navHeight = parseInt(ringsUI.parameters.mainNav.offsetHeight);
				//计算iframe高度
                $(mgrIframe).height(mianHeight - navHeight - 4);
				mgrIframe.style.overflowY="visible";
            } 
            catch (e) {
            }
		},
		/**
		 * 全选文字变化
		 */
	    setSelectAllText: function(text){
			var s1=this.parameters && this.parameters.selectAllHead||null,
				s2=this.parameters && this.parameters.selectAllFoot||null;
	        this.isChkflag = false;
	        s1 && s2 && text && "string"==typeof text && (s1.innerHTML = s2.innerHTML = text);
			s1=s2=null;
	    },
		/**
		 * 显示彩铃列表
		 * @param {string} 必选 interfaceType 接口类型对应ringsCore.interfaceType:["billboard","search"]
		 * @param {Object} 必选 parameters 列表显示参数 分别对应billBoardParamFmt、serachParamFmt
		 */
		showList:function(interfaceType,parameters){
			//top.WaitPannel.show(ringsCore.loadMsg);//加载提示语
			top.M139.UI.TipMessage.show(ringsCore.loadMsg);
			//请求没有响应处理
			clearTimeout(this.loadListHandler);
			/*
			this.loadListHandler=setTimeout(function(){
				var cwp=top.document.getElementById("contextWaitPannel")||null;
				if(cwp){
					cwp.innerHTML="抱歉！数据加载太久没响应，请继续<font style=\"font-weight: bold;\">等待</font>或试试<a onclick=\"\
					top.document.getElementById('myRings').contentWindow.location.reload();\
					top.WaitPannel.hide();\
					top.Glass.hide()\" href=\"javascript:\">刷新</a>";
				}
				//从显示提示5秒后关闭玻璃层
				setTimeout(function(){
					top.Glass.hide();
				},5000);
				cwp=null;
			},ringsUI.delay);
			*/
			//top.Glass.show();//玻璃层
			var template=null,//列表模板
			ift=null,//接口分类
			url = null,//接口URL
			pSize=parameters.pageSize ||10;//每页显示记录
			pSize=pSize<10?10:pSize;//因为html设计问题，要和html结构样式对应，暂时不支持每页10条以下的显示方式
			if(interfaceType && parameters){
				template=ringsCore.getRequestConfig(interfaceType);
				ift=ringsCore.interfaceType;
				//初始化接口URL
                switch (interfaceType) {
                    case ift[0]://榜单url
                        url = template.format(parameters.from, parameters.billboardId, pSize, parameters.pageNum || "");
                        break;
                    case ift[1]://搜索url
                        url = template.format(parameters.pageNumber, parameters.numberPerPage, parameters.searchType, parameters.requestID, parameters.keyword);
                        break;
                    default:
                        url = ""
                        break;
                }
				//请求数据源
                ringsCore.getBillBoardData(url, function(data){
					var repeater=null,//列表组件
						tl=parameters.tableList||null,//列表tableList
						ul=parameters.ulTypeList||null;//榜单分类ul
					if(parameters.tableList &&//列表容器
                    ringsUI.trTemplate &&//列表模板
					data && 
					data.songList && //歌曲列表
					data.songList.length){//使用Repeater组件生成列表
                        var html = [];
					    $.each(data.songList,function(n,val){
					        html.push($T.Utils.format(ringsUI.trTemplate,{
					            serialHtml:val.serialHtml,
					            shortSingerName:val.shortSingerName,
					            shortSongName:val.shortSongName,
					            singerId:val.singerId || '',
					            singerName:val.singerName,
					            songId:val.songId,
					            songName:val.songName,
					            trClass:val.trClass
					        }));
					    });
					    
					    html = html.join('');
					    $(parameters.tableList).html(html);
					
					}
					else{
						ringsUI.cleanList()//清理列表
					}
					//列表及分类区域高度计算，列表区300px为最小高度，分类区301px
					if(tl.offsetHeight < 300 || tl.offsetHeight == ""){//列表小于最小高度
						ringsUI.calcHeight(ul, 301);//分类区高度
                        tl.style.height = "300px"//列表区高度
					}
					else{//列表大于分类区
						tl.style.height = ""
					}
                    ringsUI.calcHeight(ul, tl.offsetHeight - 7);//分类区域高度
					//记录页面信息
					data && data.pageInfo&&(ringsCore.pageInfo=data.pageInfo);
					//初始化分页功能
                    ringsUI.createPageTurnner(data && data.pageInfo && data.pageInfo || null);
					//重置选择
					ringsUI.setSelectAllText("全选");
					//关闭提示语
                    //top.WaitPannel.hide();
                    top.M139.UI.TipMessage.hide();
					//关闭玻璃层
                    //top.Glass.hide();
					ul=tl=null
                })
				template=ift=null;
			}
		},
		/**
		 * 设置列表每页显示条数,同时修改ringsCore.pageSize变量，在不刷新页面的情况下每次调用第三方接都按设置的值进行请求
		 * @param {Object} 必选 other 页面中另一个没有被点击的下拉框DOM对象
		 */
		setPageSize:function(other){
			var param=ringsUI.parameters || null;
			if(other && param){
                //重置创建分页标记
                ringsUI.isCreatePageTurnner = false;
                other.value = ringsCore.pageSize = this.value;
                other = null;
                //翻页
                ringsUI.showList(ringsCore.currInterfaceType, {
                    from: "test",
                    billboardId: ringsCore.currBillBoardId,//接口参数：榜单ID
                    pageSize: ringsCore.pageSize,//接口参数：每页大小
                    tableList: param.tableList,//列表容器
                    ulTypeList: param.ulTypeList//分类容器
                })
			}
			other=param=null;
		},
		/**
		 * 推荐给好友，调用写信接口，使用ringsUI.letterTemplate模板
		 * @param {string} 必选 songName 歌曲名称
		 * @param {string} 必选 singerName 歌手名称
		 * @param {string} 必选 songId 歌曲ID
		 */
        tellFriend: function(songName, singerName, songId){
            var subject = ringsUI.letterTemplate && ringsUI.letterTemplate.subject || "",//标题模板
         		content = ringsUI.letterTemplate && ringsUI.letterTemplate.content || "",//内容模板
         		userNumber = top.$User.getShortUid();
            if (songId &&
            songName &&
            "string" == typeof songName &&
            singerName &&
            "string" == typeof singerName &&
            subject &&
            "string" == typeof subject &&
            content &&
            "string" == typeof content &&
            userNumber) {
                //调用写信接口
                /*
                top.CM.show({
                    subject: subject.format(userNumber, songName),//标题
                    content: content.format(songName, singerName, ringsUI.getPlayerUrl(songId)||"", resourcePath || window.top.resourcePath)//内容
                })*/
                top.$App.show("compose",null,{inputData:{subject: subject.format(userNumber, songName), content:content.format(songName, singerName, ringsUI.getPlayerUrl(songId)||"", "http://images.139cm.com/rm/coremail" ) }}); 

                }
			subject=content=userNumber=null;
        }
	};
	/**
	 * 我的彩铃菜单
	 */
	var ringsTypeMenu=window.ringsTypeMenu = {
	    MENU: null,
	    lastMenu: null,
		childMenuTmplate:"<li>{0}</li>",
		/**
		 * 创建菜单
		 * <pre>示例：<br>
		 * <br>Menu.createMenu(data,styles);
		 * </pre>
		 * @param {Object} data 必选参数，菜单项目信息 如：data{name: ,text: ,item: [数组],width: ,itemClick: ,click}
		 * @param {Object} styles 可选参数，样式内容。如： styles = {button: "tlBtn",menu: "dMenu",icon: "tlBtn3"};
		 * @return {菜单DOM对象}
		 */
	    createMenu: function(data, styles) {
			if(!data ||!styles){return null}
	        MENU = this;
	        var container = document.createElement("div"),
			ul = document.createElement("ul");
			container.className="selectBox";
			container.id = data["name"]||"";
			container.innerHTML="<div>"+data["text"]+"</div>";
			
	        ul.style.display = "none";
	        ul.className = styles["menu"]
			
	        for (var i = 0; i < data["items"].length; i++) {
	            var item = data["items"][i],
				li = document.createElement("li");
	            li.innerHTML = item.text;
	            if(item.title)li.title=item.title;
	            ul.appendChild(li);
				(function(obj){
					if(obj){
						obj.onclick=function(){
							this.parentNode.previousSibling.innerHTML=this.innerHTML;
							//MENU.hideMenu();
							item.click()
						}
					}
				})(li);
	        }
	        container.appendChild(ul);
			//Utils.addEvent(container.firstChild, "onclick", this.showMenu);
			var self = this;
	        $(container.firstChild).click(self.showMenu);
	        return container
	    },
		/**
		 * 显示菜单
		 * <pre>示例：<br>
		 * <br>&lt;button onclick="javascript:MENU.showMenu(event)"/&gt;
		 * </pre>
		 * @param {Object} e 必选参数，事件对象。
		 * @return {无返回值}
		 */
	    showMenu: function(e) {
	        if (MENU.lastMenu) {
	            MENU.lastMenu.style.display = "none";
	        }
	        var f = (e.srcElement || e.target).nextSibling;
			f.style.display = "block";
	        MENU.lastMenu = f;
	        //Utils.stopEvent();
	        //Utils.addEvent(document, "onclick", MENU.docClick)
	        M139.Event.stopEvent(e); 
	        $(document).click(MENU.docClick);
	    },
		/**
		 * 隐藏菜单
		 * <pre>示例：<br>
		 * <br>&lt;button onclick="javascript:MENU.hideMenu(event)"/&gt;
		 * </pre>
		 * @param {Object} e 必选参数，事件对象。
		 * @return {无返回值}
		 */
	    hideMenu: function(e) {
	        if (e) {
	            //Utils.findParent((e.srcElement || e.target), "ul").style.display = "none"
	        } else if (MENU.lastMenu) {
	            MENU.lastMenu.style.display = "none"
	        }
	        MENU.lastMenu = null;
	        //Utils.stopEvent();
	        //Utils.removeEvent(document, "onclick", MENU.docClick)
	    },
	    docClick: function() {
	        MENU.hideMenu()
	    }
	}	
})();
