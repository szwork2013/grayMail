/**
* @fileOverview 信纸成功页视图层--主视图
* @namespace 
*/
(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    M139.namespace('M2012.Compose.View.Success.Subscribe', superClass.extend(
    {
        elModule: $("#randomModule"),
        subscriptionTemple:[ '<div class="viagreader-warp" style="width:448px;margin: 0;border: none;">',
                       '<div class="left-warp">',
                            '<h3><span>推荐阅读</span><a class="text-link" id="moreSubscript" href="javascript:;">去云邮局,查看更多&gt;&gt;</a></h3>',
                            '<ul class="viag-warp">',
                            '</ul>',
                        '</div>',
                        '<div class="right-warp" style="display:none">',
                            '<h3>手机畅享海量资讯</h3>',
                            '<a href="http://mpost.mail.10086.cn" target="_blank" id="mailApp"><img width="112" height="112" src="../images/201403/app.png"></a>',
                            '<p>点击或扫描<br>下载云邮局APP</p>',
                        '</div>',
                        '</div>'].join(""),
        subscriptionItem:['<li>',
                            '<a href="javascript:;" dataId="{id}"><img width="120" height="86" src="{src}"></a>',
                            '<p>{name}</p>',
                            '<a class="viag-btn {isSubcript}" href="javascript:top.BH(\'send_email_subscribe\');" columnId="{id}">订阅</a>',
                        '</li>'].join(""),
        failSubscript:[ '<fieldset class="boxIframeText">',
                        '<legend class="hide">开启邮件到达通知：</legend>',
                        '<div class="norTips"><span class="norTipsIco"><i class="i_warn"></i></span>',
                            '<dl class="norTipsContent">',
                                '<dt class="norTipsLine">客官，订阅君出小差拉，订阅不成功~~~<br>要不直接去<span class="orange">云邮局</span>选吧！</dt>   ',
                            '</dl>',
                        '</div>',
                        '</fieldset>',
                        '<div class="boxIframeBtn"><span class="bibText"></span><span class="bibBtn"><a class="btnSure" href="javascript:$App.show(\'googSubscription\');top.failSubscript.close();"><span>现在去</span></a></span>',
                        '</div>'].join(""),
        initialize: function () {
            this.render();
            return superClass.prototype.initialize.apply(this, arguments);
        }, 
        render:function(){        
            var i=0,len=3,listHtml = '',item,self=this;
            var list = this.model.get('list');
            if(list.length<len){return;}
            for(;i<len; i++){
                item = list[i];
                listHtml += M139.Text.Utils.format(self.subscriptionItem,{
                    src : item.journalLogo,
                    name : item.columnName,
                    id : item.sub == 0?item.columnId:'',
                    isSubcript:item.sub == 0?'':'gury-btn'
                });
            }
            self.elModule.html(self.subscriptionTemple).show().find('ul').html(listHtml).find('a[columnId]').one({
                'click':function(){
                    var item = $(this);
                    var columnId = $(this).attr('columnId');
                    if(!columnId) return;
                    self._subscript(columnId,function(){
                        item.addClass('gury-btn').text('已订阅');
                    });
                }
            });
            self.elModule.find('a[dataId]').click(function(){
                var columnId = $(this).attr('dataId');
                top.BH('send_email_subscribeGoto');                
                top.$App.show("googSubscription",{cid : columnId,comeFrom:1005})

            })
            $('#moreSubscript').click(function(){
                top.BH('send_email_subscribeMore');
                top.$App.show('googSubscription');
            })
        },
        _subscript:function(id,callback){
            var postUrl = top.getDomain('subscribeUrl') + "subscribe?sid=" + top.sid;
            var option = '{"comeFrom":503,"columnId":' + id + '}';
            top.M139.RichMail.API.call(postUrl, option,function(response){
                var res = response.responseData;
                if(res && res['body'] && res['body']['returnCode'] == 10){
                    callback();
                }else{
                    top.$Msg('订阅失败，请稍后再试！');
                }

            });                
        }
    }));
})(jQuery, _, M139);

