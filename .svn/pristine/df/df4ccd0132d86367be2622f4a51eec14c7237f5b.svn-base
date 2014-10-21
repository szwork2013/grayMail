/**
* @fileOverview 信纸视图层.
*@namespace 
*/
(function (jQuery, _ , M139) {
	var $ = jQuery;
	var superClass = M139.View.ViewBase;

	var SCENE = {
		"version2.0/scene/meeting.html?v=2" : "会议纪要" ,
		"version2.0/scene/offer.html?v=2" : "入职通知" ,
		"version2.0/scene/resume.html?v=2" : "个人简历",
		"version2.0/scene/resign.html?v=2" : "离职告别",
		"version2.0/scene/vacate.html?v=2" : "请假单",
		"version2.0/scene/fees.html?v=2" : "费用审批单"
	};

	var IS_SCENE_MODE = false;

	var hev = parent.htmlEditorView;
	var ed_doc = hev.editorView.editor.editorWindow.document;

	hev.editorView.editor.on("before_send_mail" , function( e ) {
		var content = ed_doc.body.innerHTML;
		ed_doc.body.innerHTML = content.replace(/<form[\s,\S]*?form>|<iframe[\s,\S]*?iframe>/g,"");
	});
	if( $B.is.firefox ){
		try{
			ed_doc.execCommand('enableObjectResizing', false, 'false');
		}catch(e){}
	} else if( $B.is.ie || $B.is.ie11 ){
		$(ed_doc).on("mousedown", "input", function(e){
			return false;
		});
	}

	var business_tpl = {
		ready : false ,
		init : function( doc , ed ){
			if( this.ready ){
				return;
			}
			this.ready = true;
			var that = this ;
			this.doc = doc;
			this.ed = ed;

			$(doc.body).on("click", function( e ){
				var $edts = that.$edts ;
					e = e || window.event ;
				var cur = e.srcElement || e.target ,
					action = cur.getAttribute("data-action");
				 	 if( action === "upload" ){
						if(cur.tagName === "IMG"){
								that.curImg = cur ;
							}else{
								that.curImg = cur.getElementsByTagName("IMG")[0];
							}								 	 	
				 	 	$(that.f).find("INPUT").click();
				 	 }
					if( action === "placeHolder" ){
						if( cur.parentNode.className === "editable" ){
							hev.editorView.editor.selectElementText( cur );
						}
						$edts.each(function(){
							var sp = this.getElementsByTagName("SPAN")[0];
							var txt = this.getAttribute("data-text");
						if(!sp&&($.trim(this.innerHTML)==="")){
							}else if( $.trim(sp.innerHTML) === "" || sp.innerHTML === txt ){
								sp.className="";
								sp.parentNode.className = "editable";
							}
						});
						cur.className = "tpl-black";	
						cur.parentNode.className = "";
					}
				});
		},
		curImg : {} ,
		initTpl : function( context ){
			var $edts = $(context).find(".editable");
			this.$edts = $edts ;
			$edts.each(function(){
				var text = this.innerHTML ;
				this.innerHTML = "<span data-action='placeHolder' data-text='"+ text +"' >" + text + "</span>";
				this.text = this.innerHTML ;
				this.setAttribute( "data-text" , text );
			});
			var imageUploader = new parent.M2012.Compose.View.UploadForm({
				wrapper : this.doc.body ,
				accepts: ["jpg", "jpeg", "gif", "bmp", "png"],
				uploadUrl: parent.utool.getControlUploadUrl(true),
				onSelect: function(value, ext){
					if (_.indexOf(this.accepts, ext) == -1) {
						$Msg.alert("只允许插入jpg, jpeg, gif, bmp, png格式的图片", {icon:"warn"});
						return false;	// 取消后续操作，不触发onload
					}
					return true;
				},
				onUploadFrameLoad: function (frame) {
					var imageUrl = parent.utool.getControlUploadedAttachUrl(frame);
					imageUrl && business_tpl.getImg( imageUrl );
				}
			}).render();	
			this.f = imageUploader.$el[0];
			this.f.contentEditable = false ;
			imageUploader.$el.hide();
			imageUploader.$("input").hide();
		} ,		
		getImg : function( url ){
			this.curImg.src = url ;
			this.curImg.style.display = "block";
		},
		reset : function(){	
			$(this.doc).unbind("click") ;
			this.ready = false ;
			this.doc = null ;
			this.ed = null ;
			this.curImg = null ;
		}
	};
    M139.namespace('M2012.Compose.View.LetterPaper', superClass.extend(
        /**
        *@lends M2012.Compose.View.prototype
        */
    {
        el: "body",
        name : "letterpaper",
        count : 19,
        events: {
        },
        initialize: function (options) {
        	this.model = options.model;
            return superClass.prototype.initialize.apply(this, arguments);
        },
		// 信纸iframe加载完毕后执行初始化
		initLeterPaper : function(){
		    var self = this;
		    var letterMenu = [];
			var papers = self.model.papers;
			for(var i = 0, len = papers.length; i < len; i++) {
				var paper = papers[i];
				var letterMenuItem = {
					text : paper.group,
					value : i,
					onClick : function() {
						$("#papers > .dropDownText").html(this.text);
						self.render(parseInt(this.value, 10));
					}
				};
				/**
				 * [modify by wn]
				 * @deprecated  2014 -7- 28
				 * @type {[type]}
				 */
				if( paper.group === "商务模版 <span style='color:red;'>new</span>"){
					letterMenuItem.html = "商务模版 <span style='color:red;'>new</span>";
					letterMenuItem.onClick = function(){ 
						$("#papers > .dropDownText").html(this.html);
						self.render(parseInt(this.value, 10));
					};
					delete letterMenuItem.text;
				}				
				letterMenu.push(letterMenuItem);
			}
			//var width = $("#papers").css("width");
			M2012.UI.PopMenu.createWhenClick({
				target : $("#papers"),
	            width : 169,
	            items : letterMenu,
	            top : "200px",
	            left : "200px",
	            onItemClick : function(item){
	            	if( /商务模版/g.test(item.html) ){
	            		top.BH("compose_scene");
	            	}
	                //alert("子项点击");
	            }
	        });
		    self.render(0);
            self.setLetterListH();
		},
        setLetterListH : function(){
            $('.letterList').height($(window).height() - $('#papers').outerHeight(true) - 1 - 30);
        },
		setPaper : function(letterPaperUrl, thisObj, letterPaperId){
			var set_paper = function( keep ){
				BH({key : "compose_letterpaper"});
				
				var self = letterPaperView;
				var paperLevel=(thisObj && thisObj.getAttribute("level"))||"",//可以使用当前信纸的特级
					userLevel = top.$User.getUserLevel();//当前用户等级
				if(letterPaperId){
					var paperItem = self.getLetterPaperItem(letterPaperId);
					if(paperItem && paperItem['page']){
						letterPaperUrl = paperItem['page'];
						paperLevel = paperItem.level || top.$User.getVipStr();
					}
				}
				if (paperLevel && paperLevel.indexOf(userLevel) > -1){//记录最后一个可用的信纸
					self.model.lastLetterPaperUrl = letterPaperUrl;
				}
			    $.get(letterPaperUrl, function(html) {
			        var reg1 = /(style="[^"]*?)background-image:\s*url\(([^\)]+)\)/ig;
			        var reg2 = /(background=")([^"]+)/ig;
			        var reg3 = /(<img[^>]+?src=")([^"]+)/ig;
					var reg4 = /(background:url\()(\S+\))/gi;//内联样式背景替换规则
			        var replaceUrl = self.model.letterPaperBaseUrl;
			        if (top.$T.Url.queryString("v", letterPaperUrl) == "2") {
			            replaceUrl = self.model.letterPaperBaseUrl + letterPaperUrl.replace(/\/[^\/]+$/, "/");
			        }
			        html = html.replace(reg1, "background=\"$2\" $1");
			        html = html.replace(reg2, "$1" + replaceUrl + "$2");
			        html = html.replace(reg3, "$1" + replaceUrl + "$2");
			        html = html.replace(reg4, "$1" + replaceUrl + "$2");
			        self.usePaper( html , keep );
					self.model.useLetterPager(paperLevel,userLevel,{set:self.setPaper,cancel:self.cancelPaper});//信纸使用入口
					//top.UserData.isUseLetterPager=true;
					business_tpl.initTpl( ed_doc.body );
			    });
			};
			if(  SCENE[letterPaperUrl] ){
				var reg = /\/([^\/]+).html/.exec( letterPaperUrl ) ;
				top.BH( "compose_scene_" + reg[1]);
				if(  $.trim( hev.getTextContent() ) !== "" ){
					top.$Msg.confirm( "确定使用" + SCENE[letterPaperUrl] + "模版？使用后，已输入内容将被清空!" ,
						function(){ set_paper(); IS_SCENE_MODE = true;
							business_tpl.init( ed_doc , hev );
						},{ dialogTitle:"使用邮件模版",icon:"warn"});
				}else{
					set_paper(); 
					IS_SCENE_MODE = true;
					business_tpl.init( ed_doc , hev );					
				}
			}else{
				if( IS_SCENE_MODE ){
					top.$Msg.confirm( "确定使用该信纸？使用后，已输入内容将被清空!" ,
					function(){ set_paper(); IS_SCENE_MODE = false; },{ dialogTitle:"使用信纸",icon:"warn"});					
				}else{
					set_paper( true );
				}
			}			
		},
		usePaper : function(html , keep ){
		    var doc = parent.htmlEditorView.editorView.editor.editorWindow.document;
		    var contentContainer = doc.getElementById("content139");
		    var text="";
		    if(contentContainer){
		        text=contentContainer.innerHTML;
		    }else{
		        text=doc.body.innerHTML;
		    }
		
		    var matchCss = html.match(/(<style.*?>[\w\W\s\S]+<\/style>)/i);
		    if(matchCss){
		        var styleCss=matchCss[1];
		    }
		    var letterHTML = html.match(/<body.*?>([\w\W\s\S]+)<\/body>/i)[1];
		    $("head style", doc).remove();
		    
		    doc.body.innerHTML=letterHTML;
		    if (matchCss) $(doc.body).append(styleCss);
		    doc.body.contenteditable = false;
		    
		    $("table",doc.body).each(function(){
		        if(this.parentNode == doc.body){
		            this.style.width="99%";
		        }
		    });
		    contentContainer = doc.getElementById("content139");
		    if (contentContainer) {
		    	if( keep ){
		        	contentContainer.innerHTML = text.replace(/(?:<br>)*$/i, "<br><br><br><br><br><br><br><br><br>");
		    	}
		    }
		    try{
		        this.setEditorFocus(doc);
		        doc.body.scrollTop=0;
		    }catch(e){}
		},
		cancelPaper : function(){
			/**
			 * [modify by wn]
			 * @deprecated  2014-8-7
			 * @type {[type]}
			 */
			var self = letterPaperView;
		    var doc = parent.htmlEditorView.editorView.editor.editorWindow.document;
		    var contentContainer=doc.getElementById("content139");
		    if(!contentContainer){
		    	if( IS_SCENE_MODE ){
		    		top.$Msg.confirm( "确定撤销使用邮件模版？使用后，已输入内容将被清空!" ,
					function(){ 	
			    		IS_SCENE_MODE = false ;
			    		doc.body.innerHTML = "";
					},{ dialogTitle:"撤销使用邮件模版",icon:"warn"});
		    		return;
		    	}else{
		    		return ;
		    	} 
		    }
		    doc.body.innerHTML = contentContainer.innerHTML;
			self.model.lastLetterPaperUrl = "";
			//top.UserData.isUseLetterPager = false;
		},
		setEditorFocus : function(doc) {
		    if(document.all){
		    	setTimeout(function () {
			        var r = doc.body.createTextRange();
			        r.moveStart("character",0);
			        if( doc.getElementById("content139") ){
				        r.moveToElementText(doc.getElementById("content139").firstChild||doc.getElementById("content139"));
				        r.collapse(false);
				        r.select();
			        }
		        }, 0);
		    }
		},
		render : function(index){
            var self = this;
		    this.paper = this.model.papers[index];
		    this.groupId = this.paper.groupId;
            this.pages = Math.ceil(this.paper.items.length / this.count);
            if(!this.pagingView){
                this.pagingView = new M2012.Compose.View.Paging();
            }
            this.pagingView.render(this.pages, function(curPage){
                self.renderPage(curPage);
            });
            this.renderPage(1); //默认显示第一页
		},
        renderPage : function(curPage){ //curPage当前页码
            var htmlCode = '<a hideFocus="1" href="javascript:;" onclick="letterPaperView.cancelPaper()"><img width="64" height="48" alt="取消信纸" src="/m2012/images/module/letter/no_lp.gif" /></a>';
			var itemTemplate='<a hideFocus="1" href="javascript:;" onclick="letterPaperView.setPaper(\'{0}\',this);return false;" level="{2}" paperId="{4}"><span class="{3}"></span><img width="64" height="48" src="{1}"/></a>';
		    var paper = this.paper;
            var groupId = this.groupId;
            var len = curPage * this.count;
            var maxLen = paper.items.length;
            len = len <= maxLen ? len : maxLen;
            var cur = (curPage - 1) * this.count;
		    for(var i = cur; i < len; i++){
				var currPaper = paper.items[i];
				var paperId = groupId + i;
				var cornerImg = "";
				if(currPaper.cornerImg){
				    cornerImg = currPaper.cornerImg.indexOf('vip')>-1?'vip':currPaper.cornerImg;
				}
				htmlCode+=top.$T.format(itemTemplate,[currPaper.page,currPaper.thumbnail,currPaper.level||top.$User.getVipStr(),cornerImg,paperId]);
		    }
		    $("#paperContainer").html(htmlCode);
		    $("#paperContainer a").hover(
		        function(){$(this).addClass("on")},
		        function(){$(this).removeClass("on")}
		    );
        },
		// 根据信纸ID取信纸item对象
		getLetterPaperItem : function(letterPaperId){
			var groupId = letterPaperId.substr(0, 3);
			var paperIndex = letterPaperId.substr(3);
			for(var i = 0,len = this.model.papers.length;i < len;i++){
				var group = this.model.papers[i];
				if(group['groupId'] == groupId){
					var items = group['items'];
					var index = parseInt(paperIndex, 10);
					return items[index];
				}
			}
		},
        initEvents : function (){
        }
    }));
    
    window.onload = function(){
        letterPaperModel = new M2012.Compose.Model.LetterPaper();
        letterPaperView = new M2012.Compose.View.LetterPaper({model : letterPaperModel});
        letterPaperView.initLeterPaper();
	}
})(jQuery, _, M139);

