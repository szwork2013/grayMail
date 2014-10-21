/**
 * 按模板生成列表类
 * @author sunsc
 * @param {Object} options
 * var list=new ListByTemplate({listContainer:列表容器,linkContainer:链接容器});
 */
function ListByTemplate(options){
	//默认配置参数
	this.options={
		//列表容器，ID或DOM对象
		listContainer:null,
		//链接容器，ID或DOM对象
		linkContainer:null,
		//在链接中显示好友名称数量
		showFriendsNameCountAtLink:3,
		//父级模板，使用时使用itemTemplate替换@itemEleStr标记形成Dom元素
		parentTemplate:"<ul class=\"sendBless\">@itemEleStr</ul>",
		//列表模板，其中@XXX标记在下面绑定数据匿名方法中找到对应
		itemTemplate:"<li><span class=\"fr\"><span class=\"c_7B7C80\">@Status&nbsp;&nbsp;</span><span class=\"c_9B8DA6\">@showBirDay</span></span><input @inputChecked id=\"@chkid\" value=\"@MobilePhone,@BirDay\" type=\"checkbox\">&nbsp;<label for=\"@chkid\">@AddrName</label>&nbsp;<span class=\"c_999\">@showMobilePhone</span></li>",		
		//链接模板
		linkTemplate:"<i class=\"birthdayIco\"></i>&nbsp;<a href=\"#;\">你有@count位好友即将过生日：@friends</a>",
		//数据源，格式详见constructorData
		dataSource:null,
		//替换模板中指点元素的正则表达式
		replaceRegByTemplate:/\@(\w+)/ig,
		//列表点击回调方法
		itemOnClickCallBack:null,
		//列表元素字符串
		itemEleStr:"",
		//父亲元素字符串
		parentEleStr:"",
		//链接元素字符串
		linkEleStr:"",
		//实例化后马上渲染DOM
		isRender:true,
		//已经发送过的手机号集合，字符串
		sentNumbers:"",
		//说明文字
		explainMsg:"已发送祝福",
		//已经选中的缓存
		selectedItemCache:"",
		//随机数
		random:Math.random().toString(),
		//设置缓存id模式
		setCacheIdMode:"birthdayFriendList",
		/**
		 * 取手机号码
		 * @param {string} mobilePhone 手机号码
		 * @return {Object} 返回取手机号码的正则表达式
		 */
		getMobilePhoneReg:function(mobilePhone){
			return "string"==typeof mobilePhone && new RegExp("("+mobilePhone+"{1,13},?)")|| "";
		},
		/**
		 * 得到状态
		 * @param {Object} phoneNumber 检查号码
		 * @param {Object} sentNumbers 已经发送的号码集体
		 * @param {Object} statusMsg 说明文字
		 */
		getStatus:function(phoneNumber,sentNumbers,explainMsg,day,month){
			explainMsg=explainMsg || "";
			var showDifDays = function(){
			   var explainMsg = '';
			   var date = new Date();
			   var nowDay = date.getDate();
			   var nowMonth = date.getMonth()+1;
			   var dif ="";
			   if(nowMonth==month){
			      dif = parseInt(day -nowDay);
			   }else{
			      dif = parseInt(DateTool.daysOfMonth() -nowDay)+parseInt(day,10);
			   }
			   if(0<dif&&dif<10){
				 explainMsg = "还有0"+dif+"天";
			   }else if(dif>=10){
				  explainMsg = "还有"+dif+"天";
			  }
			  return explainMsg;
			}
			if("string"==typeof phoneNumber &&"string"==typeof sentNumbers){
				//如果没有发送号码，显示空
				if(!sentNumbers){
					explainMsg="";
					explainMsg = showDifDays();
				}else{
					//如果有发送，则按形参显示提示
					var isSend = sentNumbers.indexOf(phoneNumber)>-1;
					if(!isSend){
					  explainMsg =  showDifDays();
					}else{
					  explainMsg = explainMsg;
					}
				}
			}
			return explainMsg;
		}
	};
	//数据源是否加载完成或是否有数据源，组件中的方法会根据此值来判断是否运行，为false时不会运行
	this.dataIsReady=false;
	//参数缓存变量
	var _options=null;
	//缓存变量
	_options=this.options||null;
	if("object"==typeof this.options){
		//继承传入参数
		_options=ListByTemplate.extend(_options,options);
	}

	/**
	 * 初始化缓存对象id，存放到top变量中
	 * @param {Object} instance 当前实例
	 * @param {string} byMode 模式
	 * @param {Object} _listContainer 容器对象
	 */
	(function(instance,byMode,_listContainer){
		//缓存id
		var id="";
		switch(byMode){
			case "byContainer"://按容器对象的id存放
				//如果容器标识是字符串，则直接使用
		        if ("string" == typeof _listContainer) {
					//id标识加随机数
		            id= _listContainer + "_" + _options.random;
		        }
		        else {
					//如果容器是DOM对象，则使用其ID
		            if (_listContainer && _listContainer.id) {
						id = _listContainer.id + "_" + _options.random;
		            }
		        }
			break;
			default://默认按全局对象id存放，传入的模式就是ID
				id=byMode;
			break;
		}
		//赋给当前对象缓存id
		instance.options["cacheId"]=id;
	})(this,_options.setCacheIdMode,_options.listContainer);
	
	/**
	 * 构造数据源
	 * @param {Object} _this 当前BirthdayReminder的实例
	 * @param {array} dataSource 数据源
	 */
	(function(instance,dataSource){
		//模拟数据源，基线上线时删除
		//构造测试数据，上线基线要去掉，此逻辑只用在研发期间，测试和上线时要删掉
		//_options.dataSource=ListByTemplate.constructorData();
		//如果有数据源
		if(dataSource && typeof dataSource=="object"){
			//数据源是否加载完成标记
			instance.dataIsReady=true;
		}
	})(this,_options.dataSource);
	/**
	 * 绑定数据
	 * @param {Object} instance 当前BirthdayReminder的实例
	 * @param {Object} options 参数集合
	 * @param {array} dataSource 数据源
	 * @param {string} itemTemplate 列表模板
	 * @param {string} linkTemplate 链接模板
	 * @param {Object} replaceRegByTemplate 替换模板中指点元素的正则表达式
	 * @param {string} sentNumbers 已经发送过的手机号集合，字符串
	 * @param {string} cacheId 缓存ID
	 */
	(function(instance,options,dataSource,itemTemplate,linkTemplate,replaceRegByTemplate,sentNumbers,cacheId){
		//检查数据源
        if (typeof dataSource=="object" && instance.dataIsReady) {
			//取缓存
			var selectedItemCache=top[cacheId]||"";
			//得到缓存放到局部变量中
			selectedItemCache=selectedItemCache && selectedItemCache["selectedItemCache"]||"";
			//得到缓存放到实例中
			instance.options.selectedItemCache=selectedItemCache;
			//存放列表字符串数组
			var itemArr=[],
				//好友名字集合
				friendsArr=[],
				//手机号集合
				mobileArr=[],
				//删除86正则表达式
				del86=/^86/,
				//dataSource长度
				count=dataSource.length,
				//好友姓名
				addName="",
				//好友组名
				fullGroupName = "",
				//手机号
				mobilePhone="",
				//构造已经选择的列表
				selectedItem=(function(){
					return typeof selectedItemCache=="string" && selectedItemCache.match(/(\d{1,13}),?/g)||null;
				})();
                //循环前先递减
				var isSendCard = false;
                for (var i=0;i<count;i++) {
					//手机号码，去86的
					if(!dataSource[i]["MobilePhone"]){
						break;
					}
					mobilePhone=dataSource[i]["MobilePhone"].toString().trim().replace(del86, "");
                    //按正则替换后放到数组中
                    itemArr.push(itemTemplate.replace(replaceRegByTemplate, function(p0, p1){
                        //对应数据源得到值
                        var val = dataSource[i][p1];
                        //根据P1返回对应的替换值
                        switch (p1) {
							//是否选中列表
							case "inputChecked":
								//默认不选择
								val="";
								//如果已选择列表中有数据
								if(Utils.queryString("singleBirthDay")){
								 val="checked";
								  break;
								};
								if(selectedItem){
									for(var iList=0,lList=selectedItem.length;iList<lList;iList++){
										//比如当前手机和已选择列表中的数据，存在则选择
										if(selectedItem[iList].replace(",","")==mobilePhone){
											val="checked";
										}
									}
								}
								else{
									//当前复选框状态默认选择
									isSendCard = sentNumbers.indexOf(mobilePhone)>-1?true:false;
									if(!isSendCard){
										val="checked";
										//增加到选择列表的缓存中
										options.listContainer && instance.addSelectedItem(mobilePhone);
									}
								}
								break;
								//显示生日
							case "showBirDay":
								//正则匹配取得日期
								var dateArr=dataSource[i]["BirDay"].toString().match(/(\d+)-(\d+)-(\d+)/),
									//月份
									month=dateArr[2],
									//天
									day=dateArr[3];
									//月份没有零时要补位
									month.length==1 && (month="0"+month);
									//天没有零时要补位
									day.length==1 && (day="0"+day);
								//组合显示
								val=dateArr && dateArr.length==4 && month+"月"+day+"日"||"";
								dateArr=null;
								break;
							case "showMobilePhone":
								//好友姓名
								fullGroupName=dataSource[i]["fullGroupName"];
								//如果有好友姓名
								fullGroupName = top.$TextUtils.htmlEncode(fullGroupName);
								if(fullGroupName){
									val = "("+fullGroupName+")";
								}
								else{
									val= "("+mobilePhone +")";
								}
								break;
                            	//好友名称，则放入数组中
                            case "AddrName":
							      if(val&&val.match(/^</)) val = top.top.Utils.htmlEncode(val);
                                   friendsArr.push(val);
								   mobileArr.push(mobilePhone);
								   if(friendsArr.join(',').getBytes()>10){//out
										friendsArr.pop();
										mobileArr.pop();
								   }

								
                                break;
                            	//复选框ID
                            case "chkid":
                                val = "chkid_" + mobilePhone;
                                break;
                            	//手机号去86
                            case "MobilePhone":
                                val = mobilePhone;
                                break;
                            	//状态
                            case "Status":
                              //得到号码
                                val = mobilePhone;
                                //显示状态消息
								var dateArr=dataSource[i]["BirDay"].toString().match(/(\d+)-(\d+)-(\d+)/);
								var day=dateArr[3];
                                var month = dateArr[2];
                                val = options.getStatus(val, sentNumbers, options.explainMsg,day,month);
                                break;
                            default:
                                break;
                        }
                        return val || "";
                    }));
                }
			//列表元素字符串
			options.itemEleStr=itemArr.join("");
			//链接元素字符串，控制显示人名个数及优先级
			options.linkEleStr=linkTemplate.replace(replaceRegByTemplate,function(p0,p1){
				//取好友名称或手机号的数据
				var showCount=friendsArr.length,
				//缓存2个手机号
				_mobileArr=mobileArr.slice(0,showCount),
				//缓存2个好友姓名
				_friendsArr=friendsArr.slice(0,showCount),
				//结果
				result=[];
				//linkTemplate模板只有2个标记位@count和@friends，根据p1进行标记匹配
				if(p1=="count"){
					//记录好友数量
					result.push(count);
				}
				else{
					//循环把数组中的手机号或姓名取出来
                    while (showCount--) {
                        //记录姓名优先手机号显示
                        result.push(_friendsArr[showCount] || _mobileArr[showCount]);
                    }
					//添加解决短信与贺卡进入时显示过长问题
					if(dataSource.length>friendsArr.length){
						result.splice(0,0,'...');
					}
				}
				_mobileArr=_friendsArr=null;
				
				//反转数组，因为要按生日顺序显示
				return result.reverse().join(",").replace(/\,$/,"");
			});
			friendsArr=itemArr=null;
		}
	})(this,_options,_options.dataSource,_options.itemTemplate,_options.linkTemplate,_options.replaceRegByTemplate,_options.sentNumbers,_options.cacheId);
	/**
	 * 渲染DOM
	 * @param {Object} instance 当前BirthdayReminder的实例
	 * @param {Object} options 参数集合
	 * @param {string} parentTemplate 父级模板
	 * @param {Object} replaceRegByTemplate 替换模板中指点元素的正则表达式
	 * @param {function} itemOnClickCallBack 点击回调
	 */
	(function(instance,options,parentTemplate,replaceRegByTemplate,itemOnClickCallBack){ 
			//列表容器
		var listContainer=options.listContainer,
			//链接容器
			linkContainer=options.linkContainer,
			//缓存父级元素字符串
			parentEleStr="",
			//初始化列表容器，兼容传入字符和DOM对象的两种方式
			listContainer=document.getElementById(listContainer) || listContainer || null,
			//初始化链接容器，兼容传入字符和DOM对象的两种方式
			linkContainer=document.getElementById(linkContainer) || linkContainer || null,
			//数据长度
			dataLenght=options.dataSource && options.dataSource.length;
			//检查数据源
        if (instance.dataIsReady) {
			//如果有列表容器
            if (listContainer) {
                //按正则替换后放到缓存中
                parentEleStr = parentTemplate.replace(replaceRegByTemplate, function(p0, p1){
                    return options[p1];
                });
				//大于5行时设定UL高度，列表容器滚动显示
				if(dataLenght>=5){
					parentEleStr=parentEleStr.replace(/class=\"sendBless\"/,'class=\"sendBless\" style=\"height:128px;\"');
				}
                //得到当前容器样式文本
                instance.cssText = listContainer.style.cssText;
                //渲染DOM
                listContainer.innerHTML = parentEleStr;
                //把父级元素字符串赋值回给实例的设置项
                options.parentEleStr = parentEleStr;
                //把容器赋值回给实例的设置项
                options.listContainer = listContainer;
                //马上渲染DOM
                if (!options.isRender) {
                    container.style.display = "none";
                }
            }
			//如果有链接容器
			if(linkContainer){
				//链接容器渲染
				linkContainer.innerHTML = options.linkEleStr;
				//回写给实例容器对象
				options.linkContainer = linkContainer;
			}
			//如果有列表容器，绑定列表事件
			listContainer && (listContainer.onclick=function(event){
				event=window.event || event||null;
				var target=event.target||event.srcElement,
					matchResult=null,
					nodeName=target.nodeName.toLowerCase();
				//只绑定复选框，并执行回调
				if(nodeName=="input"){
					//得到匹配值
					matchResult=target.value.match(/(^\d{1,13})/);
					if(matchResult){
						//选择
                        if (target.checked) {
							//增加已选择到缓存
							instance.addSelectedItem(matchResult[0]);
                        }
                        else {
							//删除已选择缓存
							instance.delSelectedItem(matchResult[0]);
                        }
					}
					//如果有回调方法，则运行
					itemOnClickCallBack && itemOnClickCallBack (instance);
				}
				matchResult=target=null;
				return;
			});
        }
		listContainer=linkContainer=null;
	})(this,_options,_options.parentTemplate,_options.replaceRegByTemplate,_options.itemOnClickCallBack);
	_options=null;
}
/**
 * 得到元素
 * @param {object} tag 要查找的目标范围对象
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 */
ListByTemplate.getEle=function(tag,selector){
	//正则匹配搜索条件，(pattern)模式的数据和顺序要对应selectorFun查找方法集合
	var selectorReg=/(^\.\S+)|(\S+)|(\S+\[\S+\=\S+\])/g,
		//按属性匹配正则
		attrReg=/(\S+)\[(\S+)\=(\S+)\]/,
		//查找方法集合
		selectorFun=null,
		//查找到的集合
		nodes=null,	
		//查找方法数量
		funLen=-1;
	if("string"===typeof selector && selector && "object"===typeof tag){
		//初始化查找方法集合,参数t是查找键值，按属性查找则会传入完整的的正则查找字符如：input[checked=true]
        selectorFun = [
		//按类名查找
		function(t){
			try{return tag.getElementsByClassName(t);}
			catch(e){return null;}
        }, 
		//按标签名查找
		function(t){
            try {return tag.getElementsByTagName(t);}
			catch(e){return null;}
        },
		//按属性查找
		function(t){
			//返回结果
			var result=[];
			//传入匹配结果
			(function(rules){
				//属性名称，如：node.getAttribute(attName)或node[attName]
				var attName=null,
				//属性值，如：attVal=node[attName]
					attVal=null,
				//查找到节点的总数
					nodeLen=0,
				//节点的集合
					nodeList=null;
				//校验匹配结果
                if (rules) {
                    //按标签得到节点集合
                    nodeList = tag.getElementsByTagName(rules[1]);
                    //查找到节点的总数
                    nodeLen = nodeList.length;
					//遍历节点集合
                    while (nodeLen--) {
						//传入节点进行属性匹配查找
                        (function(node){
                            if (node) {
								//缓存属性名称
                                attName = rules[2];
								//缓存属性值
                                attVal = node[attName] || node.getAttribute(attName) || null;
                                //转字符串进行比较，相等则填加到结果集中
								attVal + "" == rules[3] && result.push(node);
                            }
                        })(nodeList[nodeLen]);
                    }
                }
				nodeList=null;
			})(selector.match(attrReg));
			return result;
		}
        ];
		//查找方法数量
		funLen=selectorFun.length;
		while(funLen--){
			//保存匹配的值
			(function(rules){
                //去字符
                rules && (rules = rules.join("").replace(/\./g, ""));
                //运行方法集合中的方法，得到查找节点
                nodes = selectorFun[funLen](rules);
			})(selector.match(selectorReg));
			//验证查找结果
			if(nodes && nodes.length>0){break;}
		}
		//如果没有找到元素节点，则置空
		if(nodes && nodes.length==0){nodes=null;}
	}
	selectorFun=null;
	return nodes;
};

/**
 * 继承方法、浅复制
 * @param {Object} baseObject 原对象
 * @param {Object} importObject 导入对象
 */
ListByTemplate.extend = function(baseObject, importObject) {
    for (var _ in importObject) {
        _ && (baseObject[_] = importObject[_]);
    }
    return baseObject;
};

/**
 * 按标签名称得到节点列表
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 * @return {Object} nodeList 节点列表 || null
 */
ListByTemplate.prototype.getNodeList=function(selector){
	//调用getEle
	return selector && "string"==typeof selector && ListByTemplate.getEle(this.options.listContainer,selector) || null;
};

/**
 * 按标签名称得到节点列表
 * @param {string} selector 选择器字符串，支持按元素名称和类名。如：div、.list
 * @return {Object} dataList 节点列表 || null
 */
ListByTemplate.prototype.getDataList= function(selector){
	//数据集合
	var dataList=[];
	//得到节点集合
	(function(nodeList){
        if (nodeList) {
			//节点长度
			var len=nodeList.length,
			//匹配节点标签名称正则
			nodeNameReg=/(DIV|SPAN|P|^I?$|A|LI|TD)|(INPUT|SELECT|TEXTAREA)/,
			//得到元素值方法集合
			getValFuns=[function(){/*占座*/},function(t){return t.innerHTML;},function(t){return t.value;}];
			while(len--){
                (function(node){
					//匹配到的结果
					var rules=null,
						//节点值
						nodeValue="";
					//验证节点并且必须是元素节点
                    if (node && node.nodeType==1) {
						//匹配到结果
						rules=node.nodeName.match(nodeNameReg);
						if(rules){
							//取最大索引的匹配结果，rules[2]则运行getValFuns返回t.value，否则t.innerHTML
							dataList.push(rules[2] && getValFuns[2](node) || getValFuns[1](node));
						}
                    }
					rules=null;
                })(nodeList[len]);
			}
			getValFuns=nodeNameReg=null;
        }
	})(this.getNodeList(selector));
	dataList && dataList.length==0 && (dataList=null);
	return dataList; 
};

/**
 * 显示
 */
ListByTemplate.prototype.show=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.style.display="block");
	lc=null;
};
/**
 * 隐藏
 */
ListByTemplate.prototype.hide=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.style.display="none");
	lc=null;
};
/**
 * 清理列表
 */
ListByTemplate.prototype.cleanList=function(){
	var lc=this.options.listContainer||null;
	lc && (lc.innerHTML="");
	lc=null;
};
/**
 * 清理链接
 */
ListByTemplate.prototype.cleanLink=function(){
	var lc=this.options.linkContainer||null;
	lc && (lc.innerHTML="");
	lc=null;
};
/**
 * 清空选择列表
 */
ListByTemplate.prototype.cleanSelectedItem=function(){
    if(top[this.options.cacheId]&&top[this.options.cacheId]["selectedItemCache"]){
	  top[this.options.cacheId]["selectedItemCache"]=this.options.selectedItemCache="";
	}
}
/**
 * 增加选择列表到缓存中
 * @param {string} itemVal 项目值
 */
ListByTemplate.prototype.addSelectedItem=function(itemVal){
	//得到缓存
	var selectedItemCache=this.options.selectedItemCache,
	//当前实例
		instance=this;
	if(itemVal && "string"==typeof itemVal){
		//如果有缓存
		if(selectedItemCache){
			//使用逗号累加数据
			selectedItemCache+=","+itemVal;
		}
		else{
			//没有缓存直接赋值
			selectedItemCache=itemVal;
		}
		/**
		 * 
		 * @param {Object} cacheObj 缓存对象
		 * @param {Object} selectedItemCache 当前已经选择数据
		 */
		(function(cacheObj,selectedItemCache){
			//全局缓存对象存在则直接赋值
			if(cacheObj){
				cacheObj["selectedItemCache"]=selectedItemCache;
			}
			else{//如果没有全局缓存对象，则创建
				top[instance.options.cacheId]={
					"selectedItemCache":selectedItemCache
				};
			}
			//写回给当前实例 
			instance.options.selectedItemCache=selectedItemCache;
		})(top[this.options.cacheId],selectedItemCache);
	}
}
/**
 * 从缓存中删除选择列表
 * @param {string} itemVal 项目值
 */
ListByTemplate.prototype.delSelectedItem=function(itemVal){
	//得到缓存
	var selectedItemCache=this.options.selectedItemCache;
	//手机号和缓存都存在
	if(itemVal && "string"==typeof itemVal && selectedItemCache){
		//删除当前项从缓存中删除，并写回全局缓存和当前对象的实例中
		if(top[this.options.cacheId]&&top[this.options.cacheId]["selectedItemCache"]){
		  top[this.options.cacheId]["selectedItemCache"]=this.options.selectedItemCache=selectedItemCache.replace(this.options.getMobilePhoneReg(itemVal),"");
		}
	} 
}