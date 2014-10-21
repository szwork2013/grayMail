(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    var _model = null ,
        _menuCounter = 0 ; //防止事件冒泡多次createMenu

    M139.namespace('M2012.GroupMail.View.msgPager', superClass.extend(
    {
        el: "#msg_status_wrapper",
        allies : [ $("#msg_pager_bottom")],
        m139Pages:[],
        template:"",
        events: {
            "click [data-action]":"clickHandle"
        },
        clickHandle : function( e ){
            e = e || window.event;
            var cur = e.target || e.srcElement,
                action = cur.getAttribute("data-action");
                switch( action ){
                    case "close" :
                        if(cur.getAttribute("data-aim") === "new_mail_warning"){
                            $(cur.parentNode.parentNode).hide();
                        }
                        break;
                    /**
                     * [clickHandle 驱动数据获取]
                     * @page_list 展开页列表
                     * @page_num 展示选中页码
                     * @page_pre 上一页数据
                     * @page_next 下一页数据
                     */
                    case "page_num":
                        var page_number = cur.getAttribute("data-page");
                         _model.getMessageList(function( data ){
                            _model.set("pageIndex" , data.curPage);
                        } , {
                            param : {
                                pageIndex : parseInt( page_number , 10 )
                            }
                        });
                        break;
                    default:
                        break;
                }
        },
        initialize: function (options) {
            var that = this;
        	this.model = options.model;
            _model = this.model;
            var self = this;
            /**
             * [注册请求数据事件]
             * @完成数据请求时渲染自身
             * @当前页码改变时渲染自身
             */
            this.model.on( "gom:queryMessageList" ,function( result ){
                that.render(result.responseData);
            });
      
            var pages = [ 
                    M2012.UI.PageTurning.create(_.extend({ container : $("#msg_pager_top")[0] } , M2012.UI.PageTurning.STYLE_2 , {
                            template : '<div class="toolBarPaging mr_15 fr"><div>' ,
                            prevButtonTemplate: '<a rel="prev" data-tid="group_mail_pager_click" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
                            nextButtonTemplate: '<a rel="next" data-tid="group_mail_pager_click" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray -->
                            selectButtonTemplate: '<a rel="selector" data-tid="group_mail_pager_pop_click" href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
                            pageNumberButtonTemplate : ""
                        })) , 
                    M2012.UI.PageTurning.create(_.extend({ container : $("#msg_pager_bottom")[0] } , M2012.UI.PageTurning.STYLE_2 , {
                            template : '<div class="toolBarPaging fr"><div>' ,
                            prevButtonTemplate: '<a rel="prev" data-tid="group_mail_pager_click" title="上一页" href="javascript:;" class="up"></a>',//<!-- 不可点击时 加 上  up-gray -->
                            nextButtonTemplate: '<a rel="next" data-tid="group_mail_pager_click" title="下一页" href="javascript:;" class="down "></a>',//<!-- 不可点击时 加 上  down-gray --> 
                            selectButtonTemplate: '<a rel="selector" data-tid="group_mail_pager_pop_click"  href="javascript:;" class="pagenum"><span class="pagenumtext">100/5000</span></a>',
                            pageNumberButtonTemplate : ""
                        }))
                    ];
            for(var i = 0 ; i < pages.length ; ++ i ){
                pages[i].on("pagechange",function(pageIndex){

                    if (pageIndex == 1) {
                        // 如果切换到第一页, 应该将消息栏隐藏(设置未读数为0)
                        // 同时要显示最新的数据
                        _model.trigger("isShowNewMsgBar", {
                            unreadNum : 0
                        });
                    }
                    _model.getMessageList(function( data ){
                        _model.set("pageIndex" , data.curPage);
                        } , {
                        param : {
                            pageIndex : pageIndex
                        }
                    });
                });
                var selectClick = pages[i].onSelectPageClick;

                var aopFn = (function( curItem ){
                    var handlefn = function(){
                        var contentEl , p , plist = M139.UI.Popup.popupList;
                        for( p in plist){
                            if(plist[p].contentElement){
                                contentEl = plist[p].contentElement;
                                break;
                            }
                        }
                        contentEl.find(".i_u_close").attr("data-tid" , "group_mail_pager_pop_close_click");
                        contentEl.find(".btnNormal").attr("data-tid" , "group_mail_pager_pop_done_click");
                    }
                    return function(){
                        selectClick.apply( curItem , []);
                        handlefn.apply( curItem , [] );
                    };
                })(pages[i]);

                pages[i].onSelectPageClick =  aopFn;
                this.m139Pages.push(pages[i]);
            }
        },
        initEvents : function(){
            this.el.find("#replyMsg").click(function() {
            });
        },
		render : function(result){
            var allies = this.m139Pages , i = 0 ,l = allies.length ,
                totalPages = Math.ceil( parseInt( result["var"].totalRecord , 10 )/this.model.get("pageSize"));

            for(; i < l ; ++i ){    
                allies[i].update(this.model.get("pageIndex") , totalPages , true)
            }
            if( totalPages < 2){
                $("#msg_pager_bottom").hide();
            }else{
                $("#msg_pager_bottom").show();
            }
		}
    }));
})(jQuery, _, M139);

