/**
 * @fileOverview 读信页输出邮件正文
 */
(function(jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    /**
     * @namespace
     * 读信页输出邮件正文内容
     */

    M139.namespace('M2012.ReadMail.View.ReadMailContent', superClass.extend({

        /**
         *@lends M2012.ReadMail.View.ReadMailContent.prototype
         */

        el: "",

        template: {
            quote: ['<p class="pt_10 pl_5 mb_10 showyi" >', '<a href="javascript:void(0)" id="quote" hidefocus="true" style="text-decoration:none;color:#666;">显示历史邮件 <i class="i_3trid"></i></a>', '</p>'],
            sessionStyle: ['<style type="text/css">',
            '.showyi a{text-decoration:none;color:#666;font-size:12px;}',
            '.i_3tridd{display:inline-block;width:0;height:0;overflow:hidden;line-height:0;font-size:0;vertical-align:middle;border-bottom:5px solid #666666;border-top:0 none;border-left:5px solid transparent;border-right:5px solid transparent;_color:#FF3FFF;_filter:chroma(color=#FF3FFF);}',
            '.i_3trid{display:inline-block;width:0;height:0;overflow:hidden;line-height:0;font-size:0;vertical-align:middle;border-top:5px solid #666666;border-bottom:0 none;border-left:5px solid transparent;border-right:5px solid transparent;_color:#FF3FFF;_filter:chroma(color=#FF3FFF);}',
                '</style>'].join('')
        
        }, 

        /** 
         * 获取内容视图 
         * @param {mid} String 邮件mid
         * @param {newUrl} Bollean 是否用新url
         * @param {csslink} String 添加样式参数                
         */
        getMailContentIframe: function(mid,newUrl,csslink) {
            var mid = mid || this.options.mid;
            var thisurl = newUrl ? this.getNewMailContentUrl(mid,csslink) : this.getMailContentUrl(mid);
            var iframe = "<iframe name='{1}' rel='' id='{1}' src='{0}' frameborder='0' height='160' style='width:100%'></iframe>";
            return $T.Utils.format(iframe, [thisurl, 'mid_' + mid]);
        },

		detactAttachPlayerMark: function(doc) {
			
			if(!doc || $(doc).find(".inserted_Mark").length === 0) {
				return ;
			}

			top.loadCSS("module/atta/in_mail_atta_preview.css", doc);
			top.loadScript("/m2012/js/packs/libs.pack.js", doc);
			//top.loadScript("/m2012/js/plugin/avplayer.js", doc);
			//top.loadScript("/m2012/js/richmail/readmail/initAllPlayers.js", doc);
			top.loadScript("/m2012/js/richmail/readmail/initReadMailAttachMedia.js", doc);
		},
		
		/** 读信渲染完毕 */
		mailDomReady:function(dataSource,win){
			var self = this,
				thisDoc = win.document,
				mid = dataSource.omid,
				thismid = "mid_" + mid,
				thisiframe = $($T.Utils.format("iframe[id='{0}']", [thismid]))[0];
				
			var hideQuoteFlag = self.hideQuoteFlag = false; 
			if(win && /csslink=cov/i.test(win.location.href)){
				hideQuoteFlag = self.hideQuoteFlag = true; //隐藏引文标记
			}
			
			BH('readmail_load');
			
            //add by yly
            self.replaceLinksSid(thisDoc.links);

            // add by xy
            self.detactAttachPlayerMark(thisDoc);

            // add by tkh
            var imgCollection = $("img", thisDoc);
            var imgCount = imgCollection.length; //图片总数
            var loaded = 0;
            setTimeout(function() {
                if(loaded < imgCount) { //避免图片404的容错，5秒钟还没加载完，强制执行一次resize
                    self.resize(mid);
                }
            }, 5000);

            imgCollection.each(function() {
                //ie6下 gif图片会一直触发onload事件  所以执行完一次之后要清空掉事件
                var This = this;
                This.onerror = function() {
                    loaded++; //图片加载失败也增加计数器，避免有只图片沉了，就永远也到不了岸。
                };
                This.onload = function() {
                    This.onload = null;
                    loaded++;
                    if(loaded >= imgCount) { //最后一张图片加载完再执行resize
                        self.resize(mid);
                    }
                }
            });

            BH('readmail_load');
            var iframe_content = $(thisDoc).find('body');
            self.initEvents(mid, thisDoc);

            new M139.Event.GlobalEventManager({
                window: win
            });

            
            $App.showImgEditor(iframe_content);

            //获取正文高度
            function getDocHeight(){
                return Math.max( $(thisDoc).find('body').height(), $(thisDoc).find('html').height());
            }
            
            //会话邮件加载后引用收起展开功能(支持外域） update by sukunwei
			if($App.isSessionMid($App.getCurrMailMid())) {
				var allHistoryContent = $(thisDoc).find('hr[id=replySplit],div[id=reply139content],div[id=isForwardContent],blockquote[id=isReplyContent],div[id=mailcontent],div[id=origbody],blockquote[id=oriMsgHtmlSeperator],div.gmail_extra,div.gmail_quote,div.yahoo_quoted');
				var outerContainr = allHistoryContent[0];
				if(outerContainr){
					hideQuoteFlag = self.hideQuoteFlag = true;
				}else{
					hideQuoteFlag = self.hideQuoteFlag = false;
				}
			}
			
			if(hideQuoteFlag) {
                var quotehtml = self.template.quote.join('');
                var replyContent = $(thisDoc).find('#reply139content');
                var replySplit = $(thisDoc).find("#replySplit");
                var allReplyContent = $(thisDoc).find('div[id=reply139content]');
                var allReplySplit = $(thisDoc).find('hr[id=replySplit]');
                var quoteContainer,bodyHeight,quoteOffsetTop,setChangeHeight = 0;
			
                if(replySplit[0] && !replyContent[0]){ //只有分割线没有引文不处理
                    hideQuoteFlag = self.hideQuoteFlag = false;
                } 

                if(outerContainr && hideQuoteFlag) {
					allHistoryContent.hide();
                    $(outerContainr).before(quotehtml);
                    quoteContainer = $(thisDoc).find("#quote");
                    quoteContainer.parents(".MsoNormal").css("text-align","left");	//避免客户端样式影响					
					$(thisDoc).find('body').append(self.template.sessionStyle); //插入会话邮件修改后的样式
					quoteOffsetTop = quoteContainer.offset().top;
					bodyHeight = getDocHeight();
					setChangeHeight = self.setChangeHeight = Math.max(quoteOffsetTop + 30,bodyHeight);
                    setChangeHeight = Math.max(setChangeHeight,270);                  
                    quoteContainer.attr('oldh', setChangeHeight);
                    $(win).load(function(){
                        quoteContainer.attr('oldh', getDocHeight);
                    });


					quoteContainer.click(function(){
                        if($(this).html().indexOf('显示') > -1) { //点击显示
                            $(this).html("收起历史邮件 <i class='i_3tridd'></i>");
                            allHistoryContent.show();
                            M139.Timing.watchIframeHeight(thisiframe, 10);
                            BH('cov_showhistorycontent');
                        } else { //点击收起
                            $(this).html("显示历史邮件 <i class='i_3trid'></i>");
                            allHistoryContent.hide();
                            var oldH = $(this).attr('oldh');
                            $(thisiframe).contents().height(oldH);
                            $(thisiframe).height(oldH);	
                            M139.Timing.watchIframeHeight(thisiframe, 10, hideQuoteFlag);
                            BH('cov_hidehistorycontent');
                        }
                    })
                }
            }

            M139.Timing.watchIframeHeight(thisiframe, 300, hideQuoteFlag);            

			// add by tkh
            self.resize(mid);
            // 读信视图往来邮件的开闭按钮定位依赖于正文长度 add by yeshuo
            setTimeout(function() {
                self.parentView.resizeSwitchBtn();
            }, 500);
            // 用于图片加载（之所以不放在resize是为了避免每张图片加载都要执行一次该方法） add by yeshuo
            setTimeout(function() {
                self.parentView.resizeSwitchBtn();
            }, 3000);
            self.parentView.resizeSwitchBtn();
		},
		
		
        /** 读信内容输出 */
        writeContent: function(dataSource, win) {
            var self = this;
            var thisDoc = win.document;
            var mid = dataSource.omid;
            var thismid = "mid_" + mid;

            var thisiframe = $($T.Utils.format("iframe[id='{0}']", [thismid]))[0];

            //正文内容特殊处理
            var content = dataSource.html.content;
            if($B.is.webkit && content.indexOf("windowtext") > -1) { //webkit excel粘贴加表格线
                content = content.replace(/windowtext 0.5pt solid/g, "windowtext 1pt solid");
            }

            thisDoc.write(content);
			
			this.mailDomReady(dataSource,win);
          
        },


		getNewMailContentHtml: function(mid, dataSource) {
            var self = this;
			var mid = mid || this.options.mid;
            var thismid = "mid_" + mid;
            var thisiframe = $($T.Utils.format("iframe[id='{0}']", [thismid]))[0];

            M139.Iframe.domReady(thisiframe, function() {
                //暂无callback 正文输出在iframe页调用
            }, {
                checkIframeHealth: true,
                query: "letterInfo" //检查iframe中的方法是否存在
            });

        },
		
        getMailContentHtml: function(mid, dataSource) {
            var self = this;
			var mid = mid || this.options.mid;
            var thismid = "mid_" + mid;
            var thisiframe = $($T.Utils.format("iframe[id='{0}']", [thismid]))[0];

            M139.Iframe.domReady(thisiframe, function() {
                //暂无callback 正文输出在iframe页调用
            }, {
                checkIframeHealth: true,
                query: "writeContent" //检查iframe中的方法是否存在
            });

        },

        /**
         *在$App里也调用了这个函数,做页面预加载
         */
        getNewMailContentUrl: function(mid,csslink) {
            var url = "/RmWeb/view.do?func=view:readMessage&comefrom="+$T.Url.queryString("comefrom");
			var self = this;
			var fid = self.options.fid;
            if(csslink){
                url+='&csslink=' + csslink;   
            }
			if(fid !== 0 ){
				fid = fid || 1;
			}
			url = $T.Url.makeUrl(url,{
					sid:$App.getSid(),
					cguid:Math.random(),
					mid:self.options.mid || mid,
					callback:'readMailReady',
					fid:fid
				});
            return url;
        },
		
		getMailContentUrl: function(mid) {
			var fid = $App.getCurrentFid() || 1;
            var url = "/m2012/html/readmailcontent.html?d={0}#mid={1}&fid="+fid;
			if(this.options && this.options.isSessionMail){
				url = url + '&t=sessionmail';
			}
			return $T.Utils.format(url, [top.$App.getSid().substring(0, 20), mid]);
			
		},
        
        replaceLinksSid: function(links){
            var link = '';
            for (var i = 0, len = links.length; i < len; i++) {
                 link = links[i];
                 try{
                    if (link.href.indexOf("javascript:") != 0) {
                        link.target = "_blank";
                    }
                    if (link.href.indexOf("$sid") >= 0) {
                        link.href=link.href.replace("$sid",top.$App.getSid());
                    }
                 }catch(e){}
            }
        },

        initialize: function() {
            this.model = this.options.model;
            this.parentView = this.options.parentView;
			return superClass.prototype.initialize.apply(this, arguments);
        },

        initEvents: function(mid) {
            var self = this;
            this.changeFontSize(mid);
            $App.on('mailResize', function(data) {
                if(data && data.mid == mid) {
                    self.resize(mid);
                }
            });
		
        },

        /** 字体大小切换 */
        changeFontSize: function(mid) {

            var self = this;

            //字体切换
            //*action  'increase':加大   'reduce':减小
            var iframeId = "mid_" + mid;
            var iframedoc = document.getElementById(iframeId).contentWindow.document;
            var contentText = iframedoc.body;
            var initContent = '';
            var contentNode = $(contentText).find("*"); //所有子节点
            var fontZoom = $('#fontzoom_' + mid).find("a");
            var fontSizes = [12, 14, 16, 18, 20, 22, 24, 32];
            var orignHeight = $(contentText).height(); //原始高度,要onload完才准确

            function getNewFontSize(action, size) {
                var newsize = size;
                var len = fontSizes.length;
                if(action == 'increase') {
                    for(var i = 0; i <= len; i++) {
                        if(size < fontSizes[i]) {
                            newsize = fontSizes[i];
                            break;
                        }
                    }
                } else { //缩小
                    for(var i = len - 1; i >= 0; i--) {
                        if(size > fontSizes[i]) {
                            newsize = fontSizes[i];
                            break;
                        }
                    }
                }
                return newsize;
            }

            //高度设置

            function setHeight(h) {
                $(contentText).height(h);
                $('#' + iframeId).height(h);
            }

            //字体大小

            function getFontSize(obj) {
                return parseInt((obj.css("font-size") || '14px').replace("px", ''));
            }

            fontZoom.click(function() {
                var action = $(this).attr("rel"); //切换操作：放大，原型，缩小
                $(contentText).attr('prevHeight', $(contentText).height()); //保存上一次高度
				var font_size = $(contentText).css("font-size") || "14px";
				var containerfontSize = parseInt(font_size.replace("px", ''));
                
				if(action == 'close') {
					$(this).parent().remove();
					return;
				}				
				if(action == 'normal') { //高度还原
                    setHeight($(contentText).attr('orignheight') || orignHeight);
                }
                if(action == 'reduce') {
                    setHeight($(contentText).attr('prevHeight'));
                }

                //body字体切换
                var bodyFontSize = getFontSize($(contentText));
                var bodyNewSize = '';
                if(!$(contentText).attr("data-size")) {
                    $(contentText).attr("data-size", bodyFontSize + 'px')
                }
                if(action == 'normal') {
                    $(contentText).css("font-size", $(contentText).attr("data-size"));
                } else {
                    bodyNewSize = getNewFontSize(action, bodyFontSize) + "px";
                    $(contentText).css({
                        "font-size": bodyNewSize
                    });
                }

                //子节点字体切换
                if(contentNode.length > 0) {
                    contentNode.each(function(n) {
                        if(!/br|button|hr|img|input|link|style|script/i.test($(this)[0].tagName)) {
                            var thisNodeSize = getFontSize($(this));
                            var parentNodeSize = getFontSize($(this).parent()); //父节点
                            var newSize = thisNodeSize;
                            var changeFlag = true;

                            if(thisNodeSize == parentNodeSize) {
                                changeFlag = false;
                            }

                            //保存原值
                            if(!$(this).attr("data-size") && changeFlag) {
                                $(this).attr("data-size", thisNodeSize + "px");
                            }

                            //字体大小切换
                            if(action == 'normal') {
                                $(this).attr("data-size") ? newSize = $(this).attr("data-size") : '';
                            } else {
                                if(!changeFlag) {
                                    return
                                }
                                newSize = getNewFontSize(action, thisNodeSize) + "px";
                            }
                            $(this).css({
                                "font-size": newSize,
                                'line-height': '1.6'
                            });
                        }
                    })

                }
                // add by tkh
                self.resize(mid);
            })
        },
        createScrollBar: function () {
            var self = this;
            var jContainer = self.jContainer;
            if(jContainer){
                var layout = $App.getLayout();
                if (layout == "left") {
                    jContainer.css("position", "relative");
                }

                self.scrollBarView = new M2012.ReadMail.ScrollBar.View({
                    container: jContainer,
                    widthEl: jContainer,
                    contentIframe: jContainer.find("iframe")[0]
                });
                self.scrollBarView.render();

                //fix css
			    if (layout == "top" || layout == "list") {
                    self.scrollBarView.$el.css("bottom", "3px");
			    }
            }

        },
        // add by tkh
        resize: function (mid) {
            //console.log("readmail resize.......");
            var self = this;
            var thismid = "mid_" + mid;
            var reduceH = this.hideQuoteFlag ? 45 : 0;
			var frame = window.frames[thismid];
            // 分栏模式下不存在读信放在容器$("#readWrap")内
            // 普通模式下会分配一个视图
            if ($App.getLayout() == "list") {
                self.jContainer = $("#toolbar_" + mid).closest("div[id^=view_]");
            } else {
                self.jContainer = $("#toolbar_" + mid).closest("#readWrap");
            }
            
            var jContainer = self.jContainer;
            
			if(reduceH > 0 && $B.is.ie && $B.getVersion() == 8){
				reduceH = 30;
			}
			
			try {
				if(!frame){return;} 
				var jReadPage = jContainer.find("div.J-readMailArea:eq(0)"); // pageRead 即为  inboxfl
				var _readPage = jContainer.find("div.cov-list:eq(0)"); //会话邮件
				if (_readPage.length > 0) {
				    jReadPage = _readPage;
                }
				var topBodyHeight = $App.getBodyHeight();
                if($App.getLayout() == "top" || $App.getLayout() == "left") { //上下分栏读信，读信的容器在分栏以下
                    jReadPage.height(topBodyHeight - jContainer.offset().top - 4); //整个读信模块高度
                } else { //普通读信
                    jContainer.height(topBodyHeight - 107); //整个读信模块高度
                    var readPageHeight = topBodyHeight - 164; //读信除去工具栏后的高度
                    jReadPage.height(readPageHeight);
                }
                var frmLetterContent = frame.frameElement || document.getElementById(thismid);
                var frmBody = frame.document.body || document.getElementById(thismid).contentWindow.document.body;

                if (!frmBody) return;
                if (frmBody.scrollHeight > frmLetterContent.offsetHeight) {
                    frmLetterContent.style.height = (frmBody.scrollHeight + 35 - reduceH).toString() + "px";
                    //frmBody.style.overflowX = "hidden";
                }
				
				//todo
				if ( frmBody.scrollHeight === 0 && frmLetterContent.offsetHeight === 0){
					frmLetterContent.style.height = '600px';
				}

                //会话邮件不显示滚动条
                if(_readPage.length > 0){return}

                if (!self.scrollBarView) {
                    self.createScrollBar();
                } else {
                    self.scrollBarView.update();
                }
            } catch(e) {
                console.log(e);
            }
        }
    }));
})(jQuery, _, M139);