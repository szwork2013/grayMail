(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;

    function getSelection(){
        try{
            var str = window.getSelection();
            return str.toString();
        }catch(e){
            var range = document.selection.createRange();
            return range.text;    
        }
    }

    M139.namespace('M2012.GroupMail.App', superClass.extend(
    {
        el: "body",
        template:"",
        events: {
            "click [data-action=close]" : "closeHandler",
            "click [data-tid]" : "tidHandler" ,
            "mouseup [data-select]" : "selectHandler"
        },
        tidHandler : function( e ){
            var cur = e.target || e.srcElement,
                tid = cur.getAttribute("data-tid");
                while(!tid){
                    cur = cur.parentNode;
                    tid = cur.getAttribute("data-tid")
                }
                top.BH(tid);
        },
        selectHandler : function( e ){
            var cur = e.target || e.srcElement ;
            var text = getSelection();
            if( text!== "" ){
                top.BH("group_mail_content_select");
            }
        },
        closeHandler : function( e ){
            var cur = e.target || e.srcElement;
                $("#" + cur.getAttribute("data-aim")).hide();
        },
        EVENT : {
            "SEND_GROUPMAIL_EVENT" : "sendGroupMailEvent",  // 发送群邮件按钮绑定的自定义事件名称
            "CREATE_GROUP" : "createGroup"  // 新建群组按钮绑定的自定义事件名称
        },
        /**
         * [STATUS description]
         * @MSG_LIST 列表消息展示状态
         * @MSG_LIST_EMPTY 列表消息为空时的状态
         * @GROUP_EMPTY 群组为空时状态
         * 值对应model的 wrappers数组键与_cover的STYLE数组键
         */
        STATUS : {
            MSG_LIST : 0 ,
            MSG_LIST_EMPTY : 1 ,
            GROUP_EMPTY : 2 
        },
        _model : Backbone.Model.extend({
                defaults:{  
                   wrappers : [ $("#groupInfoReply") , $("#empty_msg_list_wrapper") , $("#group_empty_wrapper")],
                   status : null 
                }
            }),
        initialize: function (options) {
            this.model = new this._model();
            this.initEvents();
            this.interval = 0; // 用于频繁点击事件
            return superClass.prototype.initialize.apply(this, arguments);
        },
        initEvents : function(){
            var that = this;
            // 根据不同的群组,群消息状态显示不同的视图
            this.model.on("change:status" , function(){
                that._change(that.model.get("status"));
            });

            // 当群组消息为空时, 给发送群邮件按钮绑定点击事件
            this.off(this.EVENT.SEND_GROUPMAIL_EVENT).on(this.EVENT.SEND_GROUPMAIL_EVENT, function(fn) {
                $("#empty_msg_list_wrapper").find("a[class='btnSetG']").bind("click",function() {
                    // 这里设置成间隔50ms之后在触发
                    clearTimeout(that.interval);
                    that.interval = _.isFunction(fn) && setTimeout(fn, 50);
                });
            });

            // 当无任何群组时,给新建群组绑定点击事件
            this.off(this.EVENT.CREATE_GROUP).on(this.EVENT.CREATE_GROUP, function(fn) {
                $("#group_empty_wrapper").find("a[class='btnSetG']").bind("click",function() {
                    _.isFunction(fn) && fn();
                });
            });
        },
        /**
         * [_change description]
         */
        _change : function( status ){
            var that = this , wrappers = that.model.get("wrappers");
            _.each( wrappers , function( $el ){
                $el.hide();
            });
            wrappers[status].show();
        },
        /**
         * [setSatatus 整体视图状态改变]
         * @param {[type]} sta [description]
         */
        setStatus : function( sta ){
            if( sta === this.STATUS["GROUP_EMPTY"] ){
                $("#main_wrapper").hide();
            }else{
                $("#main_wrapper").show();
            }
            this.model.set("status" , sta );
        },
        /**
         * [getStatus 获取视图状态]
         * @return {[string]} [description]
         */
        getStatus : function(){
            return this.model.get("status");  
        },
        /**
         * [cover 加载过程中的覆盖层]
         * @param  {[number]} status [父级元素]
         * @param  {[boolean]} cover_sta     []
         * @return {[type]}         [description]
         */
        coverShow : function( status ){
            if(status === this.STATUS["GROUP_EMPTY"]){
                 this._cover.show( $("#main_wrapper")[0] , status );

            }else{
                var wrappers = this.model.get("wrappers");
                this._cover.show(wrappers[status][0] , status);
            }
            this._cover._STATUS = status;
        },
        coverHide : function( status ){
            this._cover.hide( status );
        },
        /**
         * [regularName 名称头像显示规则]
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         * @return size 尺寸大小, 默认50px
         */
        regularName : function(str, size){
            var reg = /([\u4E00-\u9FA5])|[^\u4E00-\u9FA5,^a-z,^A-Z,^\d]/g;
            var str_arr = str.split("");
            var result , name, value;

            value = (size ? size : 50);

            if( result = reg.exec( str ) ){
                if(result.index > 1){
                    name = str.slice(0,2).split("");
                    name[0] = name[0].toUpperCase();
                  return ("<span style='font-size:24px;display: block;height:{0}px;line-height:{0}px;'>" + name.join("") + "</span>").format(value);
                }
                if( !result[1] && (result.index === 0)  ){
                  return false;//按照规则需要返回默认头像图片
                }else{
                  return  str_arr[0];
                }
            }else{
                name = str.slice(0,2).split("");
                name[0] = name[0].toUpperCase();
                return ("<span style='font-size:24px;display: block;height:{0}px;line-height:{0}px;'>" + name.join("") + "</span>").format(value);
            }
        }
    }));

 
})(jQuery, _, M139);

