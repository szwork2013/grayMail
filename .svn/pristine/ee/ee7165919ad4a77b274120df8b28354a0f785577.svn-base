

;(function(M139, Backbone)
{


var ReadOnly = M2012.Uec.LabMain.ReadOnly;
var Statistic = M2012.Uec.LabMain.Statistic;
var Switcher = M2012.Uec.LabMain.Switcher;


//------------------------------------------------------------------------------------------------
//超链接模块
var Links = M139.Core.namespace('M2012.Uec.LabMain.Links', 
{
    reload: function()
    {
        top.location.reload();
    },
    
    toUEC: function()
    {
	    var url = M139.Text.Url.makeUrl( ReadOnly.domain + 'indexLoadRedirect.do', 
	    {
	        isdirect: 1,
	        isfirst: 1,
	        nav: 0,
	        sid: ReadOnly.sid
	    });

	    
	    window.open(url);
    }
}); //结束 Links 模块
 
 
//功能列表-视图
var ListView = M139.core.namespace('M2012.Uec.LabMain.ListView', Backbone.View.extend(
{
    
    initialize: function()
    {
        this.model = new M2012.Uec.LabMain.Model();
        var funcId = $Url.queryString("funcid");
        if (funcId) {
            this.model.set("funcId", funcId);
        }
        this.setElement( $('#ulList') );
        this.template = $('#ulList').html().replace('<!--', '').replace('-->', '');
    },
    
    events:
    {
        'click a[title^="我要体验"]': 'doExperience',//"我要体验" 的 click
        'click a[title^="马上开通"]': 'doOpen',      //"马上开通" 的 click
        'click a[id^="aShutdown_"]': 'doOpen',  //"关闭"，绑定所有 id 以 aShutdown_ 开头的 <a>
        'click a[id^="aFeedback_"]': 'feedback' //"我要反馈"，绑定所有 id 以 aFeedback_ 开头的 <a>
    },
    
    //我要体验
    doExperience: function(event)
    {
        var item = this.getItem(event);
        
        var url = item.experienceUrl;
        var reg = new RegExp( '((^http)|(^https)|(^ftp)):\/\/(\\w)+\.(\\w)+' );
        
        //针对邮件自动清理等进行兼容，即旧的映射到新的
        var newUrls = 
        {
            'javascript:window.top.Links.show(\'clearMail\');': //邮件自动清理
                'javascript:top.$App.show("preference", {anchor:"clearFolders"})',
            'javascript:top.Links.show(\"groupMail\");':        //群邮件
                'javascript:top.$App.jumpTo(\"groupMail\");'
        };
        
        if( reg.test(url) ) //打开新窗口跟发送统计可以并行
        {
            window.open(url);
            Statistic.send( item.id );
        }
        else //在当前窗口跳转的，则需要先发送统计
        {
            var redirect = function()
            {
                location.href = newUrls[url] || url;
            };
            
            Statistic.send( item.id, redirect, redirect, redirect );
        }

    },
    
    //我要开通|关闭
    doOpen: function(event)
    {
        var item = this.getItem(event);
        
        //一个内部的共用方法
        function update(item)
        {
            top.$Msg.alert('设置成功');
            
            var id = item['id'];
            var isToOpen = item['openStatus'] == 0; //当前是关闭的，则要开通
            
            item['openStatus'] = isToOpen ? 1 : 0; //已开通，更新本地数据项的状态
            
            $('#ddOpenStatus0_' + id).toggle( !isToOpen );  //已开通，则隐藏
            $('#ddOpenStatus1_' + id).toggle( isToOpen );   //已开通，则显示
            $('#spanRefresh_' + id).toggle( item.isOpenType ); //显示刷新提醒，只针对具有开通|关闭的类型 
        }
        
        if( item.isFullTextSearch ) //全文检索
        {
            Switcher.toggleFullTextSearch(item, function(json) //成功
            {
                update(item);
                
            }, function(code, json) //失败
            {
                top.$Msg.alert('很抱歉，设置失败');
                
            }, function() //错误
            {
                top.$Msg.alert('很抱歉，设置发生错误');
            });
        }
        else if( item.isSessionMode ) //会话模式
        {
            Switcher.toggleSessionMode(item, function(json) //成功
            {
                update(item);
                
            }, function(code, json) //失败
            {
                top.$Msg.alert('很抱歉，设置失败');
                
            }, function() //错误
            {
                top.$Msg.alert('很抱歉，设置发生错误');
            });
        }
        else //其他的
        {
        }
        
    }, 
     
    
    //"我要反馈"
    feedback: function(event)
    {
        var item = this.getItem(event);
        
        //加一个，反馈窗口中会用到
        top.UserData = top.UserData || {}; //安全写法
        top.UserData.DefaultSender = top.$User.getDefaultSender(); 
        
        top.$Msg.open(
        {
            dialogTitle: '用户反馈',
            url: M139.Text.Url.makeUrl( ReadOnly.domain + 'jumpLabFeedback.do', 
            {
                sid: ReadOnly.sid,
                funcId: item.id
            }),
            
            width: 550,
            height: 520
        });
        
        return false;
    },
    
    //内部方法
    getItem: function(event)
    {
        var target = event.target;
        while( target.tagName.toLowerCase() != 'li' )
        {
            target = target.parentNode;
        }
        
        var index = $(target).attr('data-index');
        var item = this.model.list[index]; 
        return item;
    },
    
    render: function()
    {
        var self = this;
        
        this.model.getList(function(list)
        {
            var sample = self.template;
            
            
            var html = $.map(list, function(item, index)
            {
                var hasOpen = //指示是否已开通，只针对开通类型：会话模式|全文检索
                        item['isOpenType'] && 
                        item['openStatus'] == 1;
                
                return $T.Utils.format(sample, $.extend(
                {
                    img: ReadOnly.domain + 'Uploads' + item['imgUrl'],
                    detailDisplay: item['detailUrl'] ? '' : 'display:none;',
                    
                    buttonText: item['isOpenType'] ? item['openText'] : item['experienceText'],
                    buttonFunction: item['isOpenType'] ? 'doOpen' : 'doExperience',
                    
                    openStatusDisplay0: hasOpen ? 'display:none;' : '',
                    openStatusDisplay1: hasOpen ? '' : 'display:none;'
                    
                    
                }, item) );
                
            }).join('');
            
            $('#ulList').html( html );
        });
    }
}));






//开始
(function()
{
    var listview = new ListView();
    listview.render();
    
})();




})(M139, Backbone);