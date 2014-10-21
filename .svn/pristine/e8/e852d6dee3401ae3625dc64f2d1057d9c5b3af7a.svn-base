/*********************************浏览器检查*************************************/
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

//请求彩信站点域名
var mmsHost = !top.isRichmail ? "http://" + window.location.host + "/" : top.SiteConfig["mmsMiddleware"];

var MMSDefFactory = {
    defFactoryPath: "/mw2/mms/uploads/html/mmsdef",
	DefMenuPath:    "/mw2/mms/uploads/html/mmsdef/mmsmenu.html",
	DefListPath:    "/mw2/mms/uploads/html/mmslist",
	DefListMenu:	"/mw2/mms/uploads/html/mmslist/mmsmenu.html",
	DefFlage:		"",
	
	DefInit: function() {
		$.get(MMSDefFactory.DefMenuPath+"?rnd="+Math.random(),function(html){
			$(".panel").html(html);
			//处理+-图标
			var infos=$("#menuinfo").attr("maininfo").split('|');
		    infos.pop();
		    var b=0;
		    MMSDefFactory.DefOrListTreeMenuInit(0);
			$(".mms_box").each(function(i){
				var targets = $(this).children("<h1>");
				try
				{
				var title = infos[b].split(',')[1];
				var id = infos[b].split(',')[0];
				 b+=1;
				targets.html(targets.html() + title);
				}
				catch(ex){}
				var item=this;
				if (id == "-1") {
					
				}
				else {				
				    $.ajax({
				        method: "get",
				        url: MMSDefFactory.defFactoryPath + "/mmsdef_" + id + "_1.html?rnd=" + Math.random(),
				        success: function (html) {
				            //加载栏目内容
				            MMSDefFactory.moduleDataLoad(targets, html);

				            var pagecounts = html.match(/pagecount="([0-9]+)/, "$1")[1];
				            var nva = $(item).children("h1").children("ul");
				            if (pagecounts == 1) {
				                nva.hide();
				            } else {
				                nva.find("#nav_lfs").removeClass("nav_lf").addClass("nav_lf_null");
				                nva.attr("pagecount", pagecounts);
				                nva.attr("id", id);
				                nva.attr("currentindex", 1);
				                nva.find("li").eq(1).html("1/" + pagecounts);
				                nva.find("#nav_rt_currs").bind("click", function () {
				                    MMSDefFactory.unbindClickBtn(1, this);
				                });
				                nva.find("#nav_lfs").bind("click", function () {
				                    MMSDefFactory.unbindClickBtn(0, this);
				                });
				            }
				        }
				    });
				}
			});
		});
	},
	DefPageChange: function (flage,targets) {	
	    var gets=$(targets).parents(".nav_bar");
		var pagecount=parseInt(gets.attr("pagecount"));
		var pageindex=parseInt(gets.attr("currentindex"));
		var id=parseInt(gets.attr("id"));
		if(flage==0)
		{
			if (pageindex == 1){
				gets.find("#nav_rt_currs").bind("click", function(){
					MMSDefFactory.unbindClickBtn(1, this);
				});

				return;
			}
			else
			    pageindex=pageindex-1;
		}
		else
		{
		    if(pageindex>=pagecount){
				gets.find("#nav_lfs").bind("click", function(){
					MMSDefFactory.unbindClickBtn(0, this);
				});
				
		        return;
			}
		    else
		      pageindex=pageindex+1;
		}
		$(gets).find(".flage").addClass("dot").removeClass("dot_curr");
		if(pageindex<pagecount)
		{
		       $(gets).find("#nav_rt_currs").removeClass("nav_rt_null").addClass("nav_rt");
		       $(gets).find("#nav_lfs").removeClass("nav_lf_null").addClass("nav_lf"); 
		       if(pageindex>1)
		        $(gets).find("#centers").removeClass("dot").addClass("dot_curr");
		}
        if(pageindex==1 && flage==0)
        {
		    $(targets).removeClass("nav_lf").addClass("nav_lf_null");
		    $(gets).find("#prevs").removeClass("dot").addClass("dot_curr");	
		     $(gets).find("#nav_rt_currs").addClass("nav_rt").removeClass("nav_rt_null");
		}	    
		    
		if(pageindex==pagecount && flage==1)
		{
		    $(targets).removeClass("nav_rt").addClass("nav_rt_null");
		    $(gets).find("#nexts").removeClass("dot").addClass("dot_curr");
		    $(gets).find("#nav_lfs").addClass("nav_lf").removeClass("nav_lf_null");
		}
		
		if(pageindex<pagecount && pageindex>1)
		{
		    $(gets).find("#nav_lfs").addClass("nav_lf").removeClass("nav_lf_null");
		    $(gets).find("#nav_rt_currs").addClass("nav_rt").removeClass("nav_rt_null");
		    $(gets).find("#centers").removeClass("dot").addClass("dot_curr");
		}
		//改变当前页数
		gets.attr("currentindex",pageindex);
		gets.find("li").eq(1).html(pageindex + "/" + pagecount);

		var moudleTitle = gets.parent("h1");

		$.get(MMSDefFactory.defFactoryPath+ "/mmsdef_" +id +"_"+pageindex+".html?rnd=" +Math.random(), function(html){
			//加载栏目内容
			MMSDefFactory.moduleDataLoad(moudleTitle, html);
		});
	},
	/**
	 * 加载栏目内容
	 * @param {Object} targets: 栏目模块的标题
	 * @param {String} html: 请求的彩信数据html片段
	 */
	moduleDataLoad: function (targets, html) {
		//删掉图片及ie中的“加载中”提示
		targets.nextAll().remove();
		//为了防耻IE6两次
		if(Sys.ie){
			targets.after("<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>");
			//获取到请求下来的图片
			var imgs=$(html)[0];
			var images=imgs.getElementsByTagName("img");
			//等待图片加载完成
			var isComplete=true;
			var curinterval=window.setInterval(function(){
				for(var i=0;i<images.length;i++){
					//如果还有未加载完成的，不能翻页
					if(!images[i].complete){
						isComplete=false;
						break;
					}
					isComplete=true;
				}
				if(isComplete){
					targets.after(html);
					window.clearInterval(curinterval);
					//重新绑定按钮的单击事件
					targets.find("#nav_rt_currs").bind("click", function(){
						MMSDefFactory.unbindClickBtn(1, this);
					});
					targets.find("#nav_lfs").bind("click", function(){
						MMSDefFactory.unbindClickBtn(0, this);
					});
				}
			},10);
		}
		else{
			targets.after(html);
			//重新绑定按钮的单击事件
			targets.find("#nav_rt_currs").bind("click", function(){
				MMSDefFactory.unbindClickBtn(1, this);
			});
			targets.find("#nav_lfs").bind("click", function(){
				MMSDefFactory.unbindClickBtn(0, this);
			});
		}
	},
	//移除按钮的单击事件
	unbindClickBtn: function (num, btn) {
		var navLi = $(btn).parents(".nav_bar").find("li"),
			leftBtn = navLi.find(":first b"),
			rightBtn = navLi.find(":last b");
		
		leftBtn.unbind("click");
		rightBtn.unbind("click");
		MMSDefFactory.DefPageChange(num, btn);
	},
	DefMenuClick: function (mmsid,falg) {
        try{
            isBirthdayPage = false; 
            if (birthdayData && parseInt(birthdayData.length) > 0) {
                $("#tipsLink").hide();
            }
        }
        catch(e){}
	    if(falg==0)
		    window.location="mmsFactory_list.html?mmsid="+mmsid;
		else 
		{
		    if(mmsid==-1)
		    {
		        return;
		    }
		    else
		    {
		        $.get(MMSDefFactory.DefListPath+"/mmslist_"+mmsid+"_1.html?rnd="+Math.random(),function(html){
		            //$(".mms_box").html(html);
		            if($(".mms_box").length>0)
		            {
		                //$(".mms_box")[0].innerHTML=html;
		                    //防址图片加载两次
			                var dom=$(".mms_box")[0];
			                if(Sys.ie)
			                {
			                    dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";
		                        //获取到请求下来的图片
		                        var imgs=$(html)[0];
			                    var images=imgs.getElementsByTagName("img");
			                    //等待图片加载完成
			                    var isComplete=true;
			                    var curinterval=window.setInterval(function(){
			                        for(var i=0;i<images.length;i++)
			                        {
			                            //如果还有未加载完成的，不能翻页
			                            if(!images[i].complete)
			                            {
			                                isComplete=false;
			                                break;
			                            }
			                            isComplete=true;
			                        }
			                        if(isComplete)
			                        {
			                             //如果下载完成，将其赋值给DOM
			                             dom.innerHTML=html;	
			                             $(".mms_box").attr("MmsID",mmsid);	
			                             MMSDefFactory.DefListChangedBind();	           
			                             window.clearInterval(curinterval);
                    			         	
			                        }
			                    },10);
			                }
			                else
			                {
			                    dom.innerHTML=html;
			                    $(".mms_box").attr("MmsID",mmsid);	
			                    MMSDefFactory.DefListChangedBind();
			                }
			                //结束图片加载两次的处理
		                
		             }
		            //$(".mms_box").attr("MmsID",mmsid);
		            //MMSDefFactory.DefListChangedBind();
		        });
		    }
		}
	},
	DefOrListTreeMenuInit: function (flag) {
	    $(".tree_list dd").hover(function(){
	        $(this).addClass("current");
	    },function(){
	         $(this).removeClass("current");
	    });
	    $(".tree_list dt").hover(function(){
	        $(this).addClass("current");
	    },function(){
	         $(this).removeClass("current");
	    });
	    
	    $(".tree_list i").each(function(i){	        
	        if($(this).attr("class")=="op"){
				$('.'+$(this).parent().attr("src")).hide();	           
	        }
	    });
	    $(".tree_list i").click(function(e){
			var This = $(this), 
				classVal = This.attr("class");

			if (classVal == "op") {
				This.removeClass("op").addClass("cl");
				$('.'+This.parent().attr("src")).show();
			} else if (classVal == "cl"){
			   This.removeClass("cl").addClass("op");
			   $('.'+This.parent().attr("src")).hide();
			} else if (classVal == "hot"){
				if (flag == 1) {
				    window.location.href = "mmsFactory.html?sid=" + top.$App.getSid();
				}
			}
			if(e && e.stopPropagation()){
				e.stopPropagation();            
			}else{
				window.event.cancelBubble = true;
			}
	    });
	    $(".tree_list dd").click(function(e){		       
			MMSDefFactory.DefMenuClick($(this).attr("src"),flag);
			MMSDefFactory.ClearCSS();
			$(this).addClass("current");
	    });
		$(".tree_list dt").click(function(){	
			if ($(this).children("i").attr("class") == "hot") {
				if (flag == 1) {
					window.location.href = "mmsFactory.html?sid=" + top.$App.getSid();
				}
				return false;
			}
			var mmsCount = $(this).attr("mmsCount");
			if (parseInt(mmsCount) > 0) {
				MMSDefFactory.DefMenuClick($(this).attr("src"), flag);
				MMSDefFactory.ClearCSS();
			} else {//当没有数据时，当作展开树节点
				$(this).children("i").click();
			}
			$(this).addClass("current");
		});
	},

	ClearCSS: function(){
	    $(".tree_list dd").removeClass("current");
	    $(".tree_list dt").removeClass("current");
	},
	DefListInit: function(){
		var mmsid = MMSDefFactory.getParmByUrl("mmsid");
		
	    $.get(MMSDefFactory.DefListMenu + "?rnd=" + Math.random(), function(html){
			$(".panel").html(html);
			MMSDefFactory.DefOrListTreeMenuInit(1);

	        if (typeof(mmsid)=="undefined") {           
				var info = $("#menuinfo").attr("maininfo").split('|');
	            
				for (var i = 0, l = info.length; i < l; i++) {
					var classIndex = info[i].split(',')[0];
	                
					if (classIndex != "-1") {
	                    mmsid = parseInt(classIndex);
	                    break;
	                }
	            }
	        } else if (mmsid == "-1") {
	           $(".toolbar").hide();
	            return;
	        }

	        $.get(MMSDefFactory.DefListPath+"/mmslist_"+mmsid+"_1.html?rnd="+Math.random(), function(html){
	            if ($(".mms_box").length>0) {
	                //防址图片加载两次
	                var dom=$(".mms_box")[0];
	                if (Sys.ie) {
	                    dom.innerHTML="<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";
                        //获取到请求下来的图片
                        var imgs=$(html)[0];
	                    var images=imgs.getElementsByTagName("img");
	                    //等待图片加载完成
	                    var isComplete=true;
	                    var curinterval=window.setInterval(function(){
	                        for(var i=0;i<images.length;i++)
	                        {
	                            //如果还有未加载完成的，不能翻页
	                            if(!images[i].complete)
	                            {
	                                isComplete=false;
	                                break;
	                            }
	                            isComplete=true;
	                        }
	                        if(isComplete)
	                        {
	                             //如果下载完成，将其赋值给DOM
	                             dom.innerHTML=html;
	                              $(".mms_box").attr("MmsID",mmsid);
	                              MMSDefFactory.DefListChangedBind();			           
	                             window.clearInterval(curinterval);
	                        }
	                    },10);
	                } else {
						dom.innerHTML=html;
						$(".mms_box").attr("MmsID",mmsid);
						MMSDefFactory.DefListChangedBind();
	                }
	                //结束图片加载两次的处理
	            }
	        });	        
	       
	    });
	    //生日提醒默认第一张图的情况
	    if(Utils.queryString("first"))
	    {
	        $(".mms_box li a").trigger("click");
	    }
	},
	DefListChangedBind: function() {
	    var pagecount = parseInt($(".item").attr("pagecount"));
        var mmsid = $(".mms_box").attr("MmsID");

        $(".tree_list dd").each(function(){
			if ($(this).attr("src")==mmsid) {
				$(this).addClass("current");
			}
        });        
        $(".tree_list dl").each(function(){
			if ($(this).attr("src")==mmsid) {
				$(this).addClass("current");
			}
        });
	    if (pagecount == 1) {
			$(".showMesBar").css("visibility","hidden");
		} else {
	        $(".mms_box").attr("pagecount", pagecount).attr("currentPage", 1);
	        $(".showMesBar").css("visibility","visible");
			$(".prev").hide();
			$(".next").show();

			$(".selPages").each(function(){//翻页容器
				var This = $(this),
					selPageHtml = [],
					selPage = This.find(".selectPage"),
					btnSelPage = This.find(":first");

				This.find(".curPage").html("1/" + pagecount + "页");

				for (var i = 0; i < pagecount; i++) {
					selPageHtml.push('<li><a href="javascript:;" rel="{0}"><span rel="{1}">{2}/{3}页</span></a></li>'.format(i, i, (i+1), pagecount));
				}
				selPageHtml = selPageHtml.join("");
				selPage.html(selPageHtml);

				btnSelPage.click(function(e){//翻页下拉菜单的显示
					selPage.show();
					e.stopPropagation();
				})
				$(document).click(function(){
					selPage.hide();
				})
			});

			$(".prev").unbind().bind("click",function(){
				MMSDefFactory.DefListChangePage(0, this);
		    });
	        $(".next").unbind().bind("click", function(){
	            MMSDefFactory.DefListChangePage(1, this);
	        });
	        $(".selectPage").unbind().bind("click",function(e){
	            MMSDefFactory.DefListChangePage(2, e.target);
	        });
	    }
	},
	DefListChangePage: function(flag,tags) {
	    if (tags.tagName == "UL") return;

		var toolbar = $(".mms_box"),
			mmsid = toolbar.attr("MmsID"),
			pageindex = parseInt(toolbar.attr("currentPage")),
			pagecount = parseInt(toolbar.attr("pagecount")),
			prevBtn = $(".prev"),
			nextBtn = $(".next"),
            newCurrentPage;
	    
		switch (flag) {
	        case 0:
                newCurrentPage = pageindex - 1;
	            break;
	        case 1:
                newCurrentPage = pageindex + 1;
	            break;
	        case 2:
                newCurrentPage = parseInt(tags.getAttribute("rel"), 10) + 1;
	            break;
	    }
        toolbar.attr("currentPage", newCurrentPage);

        newCurrentPage == 1 ? prevBtn.hide() : prevBtn.show();
        newCurrentPage == pagecount ? nextBtn.hide() : nextBtn.show();

		$(".curPage").each(function(){
			this.innerHTML = newCurrentPage + "/" + pagecount + "页";
		});

		$.get(MMSDefFactory.DefListPath + "/mmslist_" + mmsid + "_" + newCurrentPage + ".html?rnd=" + Math.random(), function(html){
	        if (toolbar.length > 0) {
	            //防址图片加载两次
				var dom = toolbar[0];
				if (Sys.ie) {
					dom.innerHTML = "<div style=\"margin:0 auto;line-height:130px;width:60px;\">加载中...</div>";
					//获取到请求下来的图片
					var imgs = $(html)[0];
					var images = imgs.getElementsByTagName("img");
					//等待图片加载完成
					var isComplete = true;
					var curinterval = window.setInterval(function(){
						for (var i=0, l = images.length; i < l; i++) {
							//如果还有未加载完成的，不能翻页
							if (!images[i].complete) {
								isComplete = false;
								break;
							}
							isComplete=true;
						}
						if (isComplete) {
							 //如果下载完成，将其赋值给DOM
							 dom.innerHTML = html;		           
							 window.clearInterval(curinterval);
						}
					},10);
				} else {
					dom.innerHTML = html;
				}
	         }
	    }); 
	},
	getParmByUrl: function (o) {
        var url = window.location.toString();
        var tmp;
        if (url && url.indexOf("?")) {
            var arr = url.split("?");
            var parms = arr[1];
            if (parms && parms.indexOf("&")) {
                var parmList = parms.split("&");
                for (var i = 0; i < parmList.length; i++){
                    if (parmList[i] && parmList[i].indexOf("=")) {
                        var parmarr = parmList[i].split("=");
                        if (o) {
                            if (typeof(o) == "string" && o == parmarr[0]) {
                                tmp = parmarr[1] == null ? '' : parmarr[1];
                            }
                        }
                        else {
                            tmp = parms;
                        }
                    }
                }
            }
        }
        return tmp;
    },
	//通过url中的key找到value
	getParamByUrl: function (key) {
		var str = window.location.search && window.location.search.slice(1),
			reg = new RegExp(key + "=([^&]*)(&|$)"),
			value = str.match(reg);
		
		return value ? value[1] : "";
	},
    ShowMMsValidate: function (target) {
        MMSPerview.Open(1,target,$(target).attr("mmssize"));
    }
};