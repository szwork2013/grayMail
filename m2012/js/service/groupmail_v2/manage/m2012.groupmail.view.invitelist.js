(function (jQuery, _, M139) {
    var $ = jQuery;
    var global = this.top ;
    var superClass = M139.View.ViewBase;
    var _model , blocker = false ;
    var host  = /http:\/\/[^\/]*/.exec(window.location.href)[0];
    M139.namespace('M2012.GroupMail.View.InviteList', superClass.extend(
    {
        el: "#group_message_wrapper",
        wrappers : [$("#empty_invite_wrapper") , $("#invite_wrapper")] ,
        template:$("#group_message_template").html(),
        events: {
            "click [data-action]" : "clickHandler"
        },
        clickHandler : function( e ){
            var cur = e.target || e.srcElement ;
            while(!cur.getAttribute("data-action")){
                cur = cur.parentNode ;
            }
            var id = cur.getAttribute("data-id") ,
                act = cur.getAttribute("data-act") , 
                tpl = (parseInt( act , 10 ) == 1)?"<span class='green'>已同意</span>" : "已忽略";
                if(!blocker){
                    blocker = true;
                _model.updateInvitation({
                    recordId : id ,
                    actionId : act
                } , function( data ){
                    data = data.responseData ;
                        if(data.code === "S_OK"){
                            M139.UI.TipMessage.show( data.summary );
                            cur.parentNode.innerHTML = tpl ;
                            /**
                             * [description]
                             * @return {[type]} [description]
                             */
                            /**
                             * 更新主视图边栏
                             */
                            _model.set({ refreshMain: _model.REFRESH_STATE.REFRESH });
                            _model.set({ refreshNotice: new Date() });
                            if (parseInt(act, 10) == 1) {
                                top.BH('gom_notify_agree_success');
                            } else {
                                top.BH('gom_notify_ignore_success');
                            }
                        }else if( data.code === "PML10406003" ){
                            M139.UI.TipMessage.show("群成员已达上限" , {
                                delay : 3000 ,
                                calssName : "msgYellow"
                            });
                            cur.parentNode.innerHTML = "已失效";                            
                        }else{
                             M139.UI.TipMessage.show("暂时无法处理该请求，请稍后再试" ,  {
                                delay : 3000 ,
                                calssName : "msgYellow"
                            });
                        }
                  
                        blocker = false;
                });
            }
        },
        initialize: function (options) {
        	this.model = options.model;
            this.config = {
                type : 0 ,
                pageSize : 50
            };
            var params = this.config;
            params.pageIndex  = 1;
            var self=this;
            _model = this.model ;
            /**
             * 1: 新邀请
             * 2：已接受
             * 3：已忽略
             * 4: 已失效
             * @return {[type]} [description]
             */
            
            /**
             * [邀请消息分页]
             * @type {[type]}
             */
            this.pager = M2012.UI.PageTurning.create(_.extend({ container : $("#msg_pager_top")[0] } , M2012.UI.PageTurning.STYLE_2 , {
                            template : '<div class="toolBarPaging ml_10 fr"><div>' ,
                            pageNumberButtonTemplate : ""
                        }));
            this.pager.on("pagechange",function(pageIndex){
                    params.pageIndex = pageIndex;
                    self.model.queryInvitedRecord( params,
                        function( data ){
                            self.render( data );
                        });
                });

            self.model.queryInvitedRecord(params , function(e){
                        var data = e.responseData ;
                        if( data.code === "S_OK" ){
                            self.render(e);
                        }

                   if( data.code === "S_ERROR" && data.summary === "服务端校验不通过"){
                            top.$App.setSessionOut();
                            }
                    });
             
            this.model.on("change:state", function (e) {
                if (self.model.get("state") == "inviteList") {
                    self.render();
                }
            });

            this.initEvents();

            top.BH('gom_load_group_notify_success');
            return superClass.prototype.initialize.apply(this, arguments);

        },
        initEvents: function () {
            var _this = this;

            $('#goBack').click(function () {
                _this.clickBack();
            });
        },
        render: function ( data ) {
            var self = this;
            var wrappers = this.wrappers;
            data = data.responseData;
            _.each( wrappers , function( $item ){
                $item.hide();
            });
            if( parseInt(data.totalRecord ) !== 0){

            self.el.innerHTML = _.template( this.template , {
                data : data["var"]
            } );
            self.pager.update( parseInt(data["curPage"] ,10 ), Math.ceil( parseInt(data["totalRecord"] , 10 )/this.config["pageSize"] ) , true );
                wrappers[1].show();
            }else{
                wrappers[0].show();
            }
        },
        clickBack: function () {
            if (top.$Addr) {
                var master = top.$Addr;
                master.trigger(master.EVENTS.LOAD_MAIN);
            }
        },
		// 初始化模型层数据
		getDataSource : function(callback){
		  
		}
    }));
})(jQuery, _, M139);

