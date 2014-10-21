
  
;(function(M139, Backbone)
{


var API = 
{
    call: function(url, data, fnSuccess, fnFail, fnError)
    {
        M139.RichMail.API.call(url, data, function(res)
        {
            var json = res.responseData;
            
            if(json)
            {
                var code = json['code'];
                
                if(code == 'S_OK') //成功
                {
                    fnSuccess && fnSuccess(json);
                }
                else //失败
                {
                    fnFail && fnFail( code, json );
                }
            }
            else //错误
            {
                fnError && fnError();
            }
           
        });
    }
};

//只读变量列表
var ReadOnly = M139.Core.namespace('M2012.Uec.LabMain.ReadOnly',
{
    sid: top.UserData.ssoSid,       // ssi，或 top.sid 也可以获取到
    domain: top.getDomain('uec')    // 以 / 结束
});


//统计用户的"我要体验"操作
var Statistic = M139.Core.namespace('M2012.Uec.LabMain.Statistic', (function()
{
    function send(id, fnSuccess, fnFail, fnError)
    {
        
		$.ajax(
		{
		    url: ReadOnly.domain + 'FuncUsed.do?sid=' + ReadOnly.sid,
		    data: 
		    {
		        id: id
		    },
		    
		    type: 'post', 
		    dataType: 'json',
		    
		    //当请求完成之后调用这个函数，无论成功或失败。
		    //传入XMLHttpRequest对象，以及一个包含成功或错误代码的字符串。 
		    complete: function(xhr, msg)
		    {
		        if(xhr && xhr.status == 200)
		        {
		            //这里返回的字符串为非标准格式，要用 tryEval 来解析
		            var json = M139.JSON.tryEval(xhr.responseText);
		            
		            if( json && json.falg ) //注意，后台返回的 falg 拼错了，应该是 flag 的，这里历史原因，适应后台
		            {
		                fnSuccess && fnSuccess();
		            }
		            else //失败
		            {
		                fnFail && fnFail();
		            }
		        }
		        else
		        {
		            fnError && fnError();
		        }
		    }
		    
		}); //结束 $.ajax()
    }
    
    return {
        send: send
    };
    
})() ); //结束 Statistic 模块


//开通|关闭器，主要用于"会话模式" 和 "全文检索" 的开通和关闭
var Switcher = M139.Core.namespace('M2012.Uec.LabMain.Switcher', (function()
{
    function getParam(item)
    {
        return {
            funcId: item.id,
            status: item.openStatus == 0 ? 1 : 0
        };
    }
    
    
    //全文检索
    function toggleFullTextSearch(item, fnSuccess, fnFail, fnError)
    {
        API.call("user:setAttrs", 
        {
            attrs: 
            {
                fts_flag: item['openStatus'] == 0 ? 1 : 0
            }
            
        }, function(json) //成功
        {
           //再调用体验室的接口 
            API.call('uec:status', getParam(item), fnSuccess, fnFail, fnError);
            
        }, fnFail, fnError);
    }
    
    //会话模式
    function toggleSessionMode(item, fnSuccess, fnFail, fnError)
    {
        //先调用邮箱的接口
        API.call('mbox:setSessionMode', 
        {
            flag: item['releasedStatus'] //要把发布状态传过去
            
        }, function(json) //成功
        {
            var param = getParam(item);
            
            //再调用体验室的接口 
            API.call('uec:status', param, function() //成功
            {
                //调用邮件列表中的会话模式来更新
                top.$App.setReadMailMode(param.status, fnSuccess, fnFail);
                
            }, fnFail, fnError);
            
        }, fnFail, fnError);
    }
    
    
    return {
        toggleFullTextSearch: toggleFullTextSearch,
        toggleSessionMode: toggleSessionMode
    };
    
})() ); //结束 Switcher 模块




M139.namespace('M2012.Uec.LabMain.Model', Backbone.Model.extend(
{
    initialize: function(data)
    {
        this.list = []; //分配一个数组
    },
    
    getList: function(fn)
    {
        var self = this;
        
        if(self.list.length > 0) //已有数据，避免重新拉取
        {
            fn && fn( self.list );
            return;
        }
        var data = {};
        if(this.get("funcId")){
            data={ "funcid": this.get("funcId") }
        }
        
        API.call("uec:list", data, function (json) //成功
        {
            var data = json['var'] || [];
            
            self.list = $.map(data, function(item, index)
            {
                return {
                    index: index,
                    code: item['funccode'],
                    id: item['funcid'],
                    
                    name: item['funcname'],         //名称
                    imgUrl: item['funcimageurl'],   //图片 Url
                    summary: item['funcsummary'],   //简介
                    
                    detailUrl: item['funccontenturl'],          //详情 Url
                    experienceUrl: $.trim( item['funcbtnurl'] ),//体验 Url
                    experienceText: item['funcbtnname'],//我要体验
                    openText: item['funcbtnenable'],    //马上开通
                    openStatus: item['funccode'] == 's_fts' ? (top.$App.getConfig("UserAttrs") && top.$App.getConfig("UserAttrs").fts_flag == 1) : item['status'],         //开通状态：0:未开通; 1:已开通
                    
                    isOpenType: item['funcbtnurl'] == '', //指示是否为开通类型，只有少数是开通类型的，其他的为体验类型
                    isFullTextSearch: item['funccode'] == 's_fts' ,  //指示是否为全文检索，特殊类型
                    isSessionMode: item['funccode'] == 's_sessionmode', //指示是否为会话模式，特殊类型
                    
                    releasedStatus: item['funcstatus']  //发布状态：0:未发布; 1:已发布

                };
            });
            
            fn && fn(self.list);
            
        }, function(code, json) //错误
        {
            
        }, function() //失败
        {
        });
    }
    
    
    
    
}));    
    
    
    
    
    
    
    
    
})(M139, Backbone);
﻿

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
