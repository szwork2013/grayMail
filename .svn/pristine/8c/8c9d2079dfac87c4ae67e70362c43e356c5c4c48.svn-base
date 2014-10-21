



(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    //todo newclass clone
    M139.namespace('M2012.Service.OnlinePreview.Xls.View', superClass.extend({

        /**
        *@lends M2012.ReadMail.View.prototype
        */
        initialize: function () {
            this.mainView = new M2012.Service.OnlinePreview.View();
            this.model = new M2012.Service.OnlinePreview.Model();
            this.unzippath = $T.Url.queryString("unzippath");
            return superClass.prototype.initialize.apply(this, arguments);
        },
        render: function (obj) {
            var self = this;
            var ssoSid = this.model.get("sid");
            var mobile = this.model.get("mobile");
            var url = "/mw2/opes/preview.do?sid=" + ssoSid;
            var dl = encodeURIComponent(obj.dl);
            var options = {
                account: '',
                fileid: obj.id,
                browsetype: 1,
                filedownurl: dl,
                filename: obj.fi,
                comefrom: obj.src,
                sid: ssoSid,
                url: url
            };
            if (this.unzippath) {//是否从压缩包里的附件打开，压缩包里的附件打开要传一个额外的压缩包路径unzippath
                options.unzippath = this.unzippath;
            }
            this.mainView.appendHeaderHtml(obj);
            this.getData(options, obj);
            this.initEvents();

        },
        bindAutoHide: function (options) {
            return $D.bindAutoHide(options);
        },

        unBindAutoHide: function (options) {
            return $D.unBindAutoHide(options);
        },
        initEvents: function () {
            var self = this;
            this.resize();
            this.sheetIndex = 0;
            this.leftWidth = 0;
			this.model.on("change:currentSheet",function(){
				var dataSource,index,part,obj,url
                  	dataSource = self.model.get("dataSource");
                    index = self.model.get("currentSheet");
		            part = getCookie("cookiepartid");
	                obj = domainList[part];
	                url =  obj.rebuildDomain+"/opes/" + dataSource["navList"][index - 1]["detailPage"];
                    $("#docIframe").attr("src", url);
                $("#exlTab .plane").find("a").removeClass("on");   
				$("#exlTab .plane").eq(index - 1).find("a").addClass("on");
                $("#more .list").find("a").removeClass("on");   
				$("#more .list").eq(index - 1).find("a").addClass("on");
			});
			//$("#exlTab .more").live('click',function(){
			//	$("#exlTab .more .moreList").toggle();
				
			//});
            $("#more").live("click", function (e) {//更多sheet
                var objParent = $(".moreList");
				var planeWidth = $('#exlTab').width()+41;
                if(planeWidth < 200){
	                $("#moreList").css({left:0})
                }else{
	                $("#moreList").css({right:0})
                }
				if(objParent.attr('isShow') == '1'){
					objParent.hide();
					objParent.attr('isShow','0');
					$("#more .aBtn").removeClass('on');
				}else{
					objParent.show();
					objParent.attr('isShow','1');
					$("#more .aBtn").addClass('on');
				}
				M139.Event.stopEvent(e)
            });
			$(document).live("click",function(){
                var objParent = $(".moreList");
				if(objParent.attr('isShow') == '1'){
					objParent.hide();
					objParent.attr('isShow','0');
					$("#more .aBtn").removeClass('on');
				}
			})
			this.setSheet();  
        },
        setSheet : function(){//点击sheet
	        var self = this;
            $("#exlTab .plane").live("click", function () {
                var li = $("#exlTab .plane");
                var index = li.index(this);
                if(self.model.get('currentSheet') !== index + 1){
					$(".zoomNow").html("100%");
					$(".zoomRate").css({width:50});
		            $("#rightTools .zoomOpt").each(function(){
			            $(this).removeClass('on');
		            });
                }
                self.model.set({ currentSheet: index + 1 });
            })
            $("#more .list").live("click", function () {
                var li = $("#more .list");
                var index = li.index(this);
                if(self.model.get('currentSheet') !== index + 1){
					$(".zoomNow").html("100%");
					$(".zoomRate").css({width:50});
		            $("#rightTools .zoomOpt").each(function(){
			            $(this).removeClass('on');
		            });
                }
                self.model.set({ currentSheet: index + 1 })
            })
	        
        },
        changeBtn: function(){//sheet左右按钮
        	var self = this;
        	changeState();
			$("#pre").live("click",function(){
				var iWidth = $(window).width()-300;
				var planeWidth = $('#exlTab').width()+41;
				if(planeWidth<iWidth){
					$('.more').css('left',planeWidth)
					return; 
				}
				$("#exlTab").find("li").eq(self.sheetIndex).hide();
				changeState();
				self.sheetIndex++;
			})
			$("#nxt").live("click",function(){
				self.sheetIndex--;
				$("#exlTab").find("li").eq(self.sheetIndex).show();
				changeState();
			})
	        function changeState(){
				var iWidth = $(window).width()-300;
				var planeWidth = $('#exlTab').width()+41;
				if(planeWidth>iWidth){
			        $('.more').css('left',iWidth+41)
					$("#pre").removeClass("none");
				}else{
			        $('.more').css('left',planeWidth)
					$("#pre").addClass("none");
				}
				if(self.sheetIndex <= 0){
					$("#nxt").addClass("none");
					self.sheetIndex = 0;
				}else{
					$("#nxt").removeClass("none");					
				}
	        }
        },
        setHeight: function () {
            var self = this;
            var height = $(window).height()-100;
            //var hasTips = $(".tipBox").length > 0 ? true : false;
            //height = hasTips ? height - 90 : height - 85;
            $(".contentHeight").height(height);
            $("#previewContent").css({ background: "none", height: "auto" ,marginTop:"60px"})
        },
        createiframe: function (result) {
            var iframe = document.createElement("iframe");
            iframe.id = "docIframe";
            iframe.className = "contentHeight";
            iframe.width = "100%";
            iframe.frameBorder = "no";
            iframe.name = 'frSheet';
            var part = getCookie("cookiepartid");
            var obj = domainList[part];
            iframe.src =obj.rebuildDomain + "/opes/" + result.navList[0].detailPage;
            return iframe;
        },
        frameOnload: function (result, obj) {
            var iframe = this.createiframe(result);
            $(iframe).load(function () {
                $("#loadingStatus").remove();
			    document.getElementById('docIframe').className = 'contentHeight rePaintFix';//解决360浏览器预览XLS没有正文，原因未知
            });
            return iframe
        },
        resize: function () {//改变窗口大小
            var self = this;
            $(window).resize(function () {
	            
                self.setHeight();
				var iWidth = $(window).width()-300;
				if(iWidth<0){iWidth = 0}
	            $('#bexlTab').css('width',iWidth);
				self.changeBtn();
				self.setRange();
            });
			

            
        },
        getData: function (options, obj) {
            var self = this;
            this.model.getData(options, function (result) {
                self.model.set({ dataSource: result })
                if (result.code != "2") {
	                if(result.code == "4"){
		                self.mainView.passwordIntBox(obj);
		                $(".iText").focus().val("");
		                $("#btnSure").live("click",function(){
			                if($(".iText").val() !=""){
				                options.filePsw = $(".iText").val();
				                $(".erro").html("请稍候……").show();
				                self.getData(options, obj);
			                }else{
				                $(".erro").html("请输入密码！").show();
			                }
		                })
	                }else if(result.code == "5"){
		                $(".iText").focus().val("");
						$(".erro").html("密码错误，请重新输入").show();
						
		            }else{
	                    if (result.code == "FS_NOT_LOGIN") {
	                        obj.display = "none";
	                        obj.text = self.model.message.relogin;
	                    }
	                    var html = self.mainView.loadingErrorHtml(obj);
	                    $("#loadingStatus").html(html);
	                    top.BH("preview_load_error");
	                    return      
	                }
                }
                else {
                    self.template(result)
                    var iframe = self.frameOnload(result, obj);
                    $("#attrIframe").append(iframe)
                                        self.getSheetList(result)

                    self.setHeight();
                    $("#loadingStatus").remove();
                    if (self.unzippath) {
                        $(".attr-select").remove();
                        $(".toolBarUl li:gt(2)").hide();
                    }
                }

            }, function (result1) {
                $("#previewContent").html('<div class="contentHeight"></div>');
                $("#loadingStatus").html(result1);
                var height = $(window).height();
                $(".contentHeight").height(height - 133);
                top.BH("preview_load_error");
            });
        },
        template: function (result) {
            var tableArr = [{}];
            var str = $("#xlsTemplate").val();
            var rp = new Repeater(str);
            var html = rp.DataBind(tableArr); //数据源绑定后即直接生成dom
            $("#previewContent").html(html);
        },
        getSheetList : function(result){//拼接SheetList
			var iWidth,i ,sLi,aSheetUrlArr,iLiNum,aSheetName,aLiArr = [],
			sList = '',aMoreLiArr = [],sMoreLi,sMoreLiList,part,sDomain,
			planeWidth;
			iWidth = $(window).width()-300;
            part = getCookie("cookiepartid");
            sDomain = domainList[part];
			sLi = '<li class="tab plane"><a href="javascript:void(0);">{sheetName}</a></li>';
			sMoreLi = '';
			sMoreLiList = '<li class="list"><a href="javascript:void(0);">{sheetName}</a></li>';
			iLiNum = result.navList.length;
	        aSheetName = _.map(result.navList,function(str){
		        return str.thumbnail;
	        });
	        for(i = 0;i < iLiNum ; i++){
				sList = $T.Utils.format(sLi,{sheetName : aSheetName[i]});
		        aLiArr.push(sList);
				sList = $T.Utils.format(sMoreLiList,{sheetName : aSheetName[i]});
		        aMoreLiArr.push(sList);
	        }
	        if(aMoreLiArr.length > 12){
		        $("#moreList").height("266").css("overflowY","scroll");
	        }
	        moreSheetList = aMoreLiArr.join("");
	        
	        $("#moreList").html(moreSheetList);
	        //sMoreLi = $T.Utils.format(sMoreLi,{moreSheetList : moreSheetList});
	        //aLiArr.push(sMoreLi);
	        
            sList = aLiArr.join("");
            //sList = sList+sList+sList+sList;
            $('#bexlTab').css('width',iWidth);
	        $('#exlTab').html(sList);
	        $('#exlTab li').eq(0).find('a').addClass('on');
			$('.more ul').hide().prev().removeClass('on').next().find('a').eq(0).addClass('on');
			this.changeBtn();
			this.setRange();
        },
        setRange : function(){//设置sheet更多按钮的位置
			var iWidth = $(window).width()-300;
			var planeWidth = $('#exlTab').width()+41;
			if(planeWidth < iWidth){
		        $('.more').css('left',planeWidth)
			}else{
				$("#pre").removeClass("none");
		        $('.more').css('left',iWidth+41)
			}
        }
    }));

})(jQuery, _, M139);