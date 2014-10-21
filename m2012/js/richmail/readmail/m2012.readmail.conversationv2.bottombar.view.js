/**
* @fileOverview 会话邮件卡片底部工具栏
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
         
    M139.namespace('M2012.ReadMail.ConversationBottomBar.View', superClass.extend({

        /**
        *快捷回复提示语
        */
        tips: {
            replySuccess: '邮件回复成功',
            replyFail: '系统繁忙,请稍后重试。',
            replyContentError: '请输入要回复的内容。',
            replyMailError: '请输入正确的邮件地址。',
            replyMailNull: '请输入回复的邮件地址。'
        },

        replyPrefix: {
            "1": "Re:",
            "2": ">",
            "3": "Reply:"
        },

        events: {
            "click li[name=more]": "onBottomToolbarClick",
            "click li[name=reply]": "onBottomToolbarClick",
            "click li[name=replyall]": "onBottomToolbarClick",
            "click li[name=forward]": "onBottomToolbarClick",
            "click li[name=del]": "onBottomToolbarClick",
            "click li[name=edit]": "onBottomToolbarClick"
        },
	
        name: "M2012.ReadMail.ConversationBottomBar", // 45<!--  94px  150px  189px -->'

        bottombarCurPos: {
            "reply": "45px",
            "replyall": "94px",
            "forward": "150px",
            "del": "200px",
            "edit": "200px"
        },

	    template:{
	        replybox: (function () {
	            return ['<ul class="toolBarUl" name="covMail_bottom_toolbar" style="display: block;">',
                               '<li name="reply"><a href="javascript:;" class="btnTb"><span class="p_relative">回复<i class="r-line"></i></span></a></li>',
                               '<li name="replyall" class="ml-1 ml_10"><a href="javascript:;" class="btnTb ml_10"><span class="p_relative">全部回复<i class="l-line"></i></span></a></li>',
                               '<li name="forward" class="ml-1 ml_10"><a href="javascript:;" class="btnTb ml_10"><span class="r two">转发</span></a></li>',                               
                               '<li name="del"><a href="javascript:;" class="btnTb ml_10"><span class="p_relative">删除<i class="r-line"></i></span></a></li>',
                               '<li name="edit" style="display: none;"><a href="javascript:;" class="btnTb ml_10"><span class="r two">编辑主题</span></a></li>',
                               '<li name="more"><a href="javascript:;" class="btnTb ml_10"><span class="p_relative">更多</span></a></li>',
                         '</ul>'].join("")
	        })(),

            bottomCompose: [ '<div class="covv-min-warp innerboxshadow" name="covMail_bottom_compose">',
                                '<div class="tipsTopblue diamond" id="bottombar-cur-pos" style="display: none;"></div>',
                                '<iframe id="conversationcompose_{mid}" width="100%" src="conversationcompose.html?sid={sid}&v={random}#mid={mid}" frameborder="0" ></iframe>',
                             '</div>'].join("")
        },        
        
        initialize: function(options){
            this.parentview = options.parentview;
            this.model = this.parentview.model;
            this.mid = options.mid;
            this.dataSource = options.data;
            this.setElement(options.el); //定义el
            this.curMail = this.model.get('sessionData')[this.mid];
            this.attachments = this.curMail && this.curMail.dataSource.attachments;
            this.rPrefix = this.replyPrefix[$App.getConfig('UserAttrs').replyPrefix];
            this.rQuote = $App.getConfig('UserAttrs').replyWithQuote;
            return superClass.prototype.initialize.apply(this, arguments);
        },    
    
        initEvents: function () {
            this.setBottombar();
        },

        setBottombar: function () {
            var self = this,
                _$el = this.$el;

            _$el.html(self.template.replybox);

            setTimeout(function(){
                self.parentview.onResize();
            },300);
        },

        onBottomToolbarClick: function (e) {
            var self = this;
            var $el = this.$el;
            var target = $(e.target || e.srcElement).closest('li[name]');
            var name = target.attr("name");
            var isCurrentTab = this.curBtn == name;
            var mid = this.mid;
            var iframe = $('#conversationcompose_' + mid)[0];
            var curMail = this.curMail;

            if (isCurrentTab && name != 'more' && name != 'del' && name != 'edit') {
                return false;
            }

            // 保存上一次点击按钮
            this.curBtn = name;
            
            if (name === "more") {
                self.createMoreMenu($(target));
            } else if (name == 'del') {
                self.delMailInMailbody();//ovcur_
            } else if (name == 'edit') {
                $App.trigger('bottomComposeEditSubject')
            } else {
                self.composeHandler(name);
            }

            //滚动条调整
            if(!/edit|more/i.test(name)){
                var scrollTop = $(target).parent().offset().top;
                var toTop = 180;
                if(scrollTop > toTop){
                    this.parentview.scrollToPosition(scrollTop-toTop);
                }
            }           
        },
        //ovcur_
        delMailInMailbody: function() {
            BH('cov_delmail');
            /*var changed = this.parentview['compose'+this.mid].isDataChanged();
            alert(changed);
            return*/

            var self = this;
            var mid = self.mid;
            var args = {
                    command: "move" , 
                    fid: 4,
                    mid: [self.mid],
                    inCovMainbody: true,
                    comefrom: 'singleSessionMail',
                    callback: function() {
                        $App.trigger('delCovMails', {mids: [mid]});
                    }
                }
            if(self.model.get('total') === 1){ delete args.comefrom }
            $App.trigger("mailCommand", args);            
        },

        /** 写信处理 */
        composeHandler:function( type ){
            var self = this;
            var mid = this.mid;
            var options = {
                type:type,
                parentview:this.parentview,
                model:this.model,
                mid:mid,
                dataSource:this.dataSource,
                curMail:this.curMail,
                attachments:this.attachments,
                rPrefix:this.rPrefix,
                rQuote:this.rQuote
            };

            if(!$('#conversationcompose_' + mid)[0]){
                self.createIframe(mid, options); //第一次要创建iframe
            }else{
                self.parentview.$el.find("div[name=covMail_bottom_compose]").show();
                self.composeTrigger(mid, options);
            }
           
        },

        /** 写信通知消息 */
        composeTrigger:function(mid, options){
			setTimeout(function(){
				$App.trigger('conversationCompose_' + mid, options);	
			},200);
        },

        /** 写信页创建iframe */
        createIframe:function(mid, options){
            var self = this,
                mid = mid || this.mid,
                container = $('#bottomBar_' + mid),
                iframe = "";
            
            iframe = $T.Utils.format(this.template.bottomCompose ,{
                mid:mid,
                sid:$App.getSid(),
                random: Math.random()
            });
            this.$el.closest('div[name=covMail_mainbody_content]').after(iframe).after('<div name="loading" style="position:absolute;left:40%;top:30%;text-align:center;padding:30px"><img src="/m2012/images/global/loading.gif">&nbsp;正在加载中...</div>');
            $('#conversationcompose_' + mid).load(function(){
                self.$el.closest('div[name=covMail_mainbody]').find("div[name='loading']").remove();
                self.composeTrigger(mid, options);
                // self.$el.find('li[name=del]').hide();
                // self.$el.find('li[name=edit]').show();
            });

        },

        /**
        * 更多操作菜单
        */
        createMoreMenu:function(moreContainer){
            var self = this,
                mid = this.mid, 
                lastFlag = false;
            var hasComposeFrame = !$('#conversationcompose_'+ this.mid)[0];

            if( mid === this.parentview.covCon.find("div.cov-cur:last").attr("mid")){
                lastFlag = true;
            }    

            var moreItems = [
                    {
                        text:"导出邮件",
                        onClick:function(){
                            var wmsvrPath2 =  domainList.global.wmsvrPath2;
                            var sid = $App.getSid();
                            var downloadUrl = wmsvrPath2 + "/mail?func=mbox:downloadMessages&sid={0}&mid={1}&";
                            window.open($T.Utils.format(downloadUrl,[sid,mid]));
                            BH('cov_exportmail');
                        }
                    },

                    {
                        text:"打印",
                        onClick:function(){
                        window.open("/m2012/html/printmail.html?mid=" + mid);
                        BH('cov_print');
                        }
                    },                    
                    
                    {
                        text:"显示邮件原文",
                        onClick:function(){
                            var orignUrl = "/RmWeb/view.do?func=mbox:getMessageData&mode=text&part=0&sid={0}&mid={1}&";
                            window.open($T.Utils.format(orignUrl,[sid,mid]));
                            BH('cov_mailcode');
                        }
                    },

                    {
                        text:"新窗口打开",
                        onClick:function(){
                            $App.openNewWin(mid);
                            BH('cov_newwinreadmail');
                        }
                    },

                    {
                        text:"备份至彩云网盘",
                        onClick:function(){   
                            BH('cMail_tab_saveDisk');                         
                            $App.trigger("mailCommand", {
                                command: 'backupMail',
                                mids: [mid]
                            });
                        }
                    },

                    {
                        text:"保存至和笔记",
                        onClick:function(){
                            BH('cMail_tab_saveNote');
                            var mailObj = M139.PageApplication.getTopApp().print[mid];
                            if (mailObj && mailObj.html) {
                                var title = mailObj.subject || "";
                                title = title.slice(0, 65);
                                var content = mailObj.html.content || "";
                            }
                            // content = content.replace(/\\/ig, "\\\\").replace(/(\r)?\n/ig, "\\n").replace(/\"/ig, "\\\"").replace(/\//ig, "\\\/"); //转义
                            var options = {
                                title: title || '邮件标题',
                                content: content || '邮件内容',
                                attachmentDirId: ""
                            }
                            top.M139.RichMail.API.call("mnote:createNote", options, function (res) {       //创建笔记
                                if (res.responseData && res.responseData["code"] == "S_OK") {
                                    M139.UI.TipMessage.show("邮件已转存至和笔记 <a href='javascript:top.$App.show(\"note\")'>查看</a>");
                                    // var noteId = res.responseData["var"]["noteid"];         //返回新建的noteId
                                } else {
                                    M139.UI.TipMessage.show("保存失败，请重试");
                                }
                                setTimeout(function () {
                                    M139.UI.TipMessage.hide();
                                }, 5000);
                            });
                        }
                    }
                ];
            /*if (!hasComposeFrame) {
                moreItems.push({
                        text:"删除",
                        onClick:function(){
                            self.delMailInMailbody();
                        }
                    });
            }*/

            M2012.UI.PopMenu.create({
                items: moreItems,
                container: moreContainer[0],
                top: '-161px',
                left: "10px"
            });
        }      
       
    }));


})(jQuery, _, M139);    


