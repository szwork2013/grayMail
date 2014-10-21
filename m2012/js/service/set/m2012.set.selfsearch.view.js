
//开始 view.js
;(function(M139, Backbone, _, MiniQuery)
{

//链接模块，提供跳转
var Links = M139.Core.namespace('M2012.Set.SelfSearch.Links',
{
    //城市显示有错误反馈
    feedback: function()
    {
        var url = top.getDomain('uec') + '/jumpFeedbackRedirect.do?isdirect=1&nav=3&isfirst=1&sid=' + top.sid;
        window.open(url);
        return false;
    }
});


//登录历史模块
var LoginHistoryView = (function()
{
    var div = document.getElementById('divLoginHistory');
    var samples = 
    {
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.LoginHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(div.innerHTML, '<!--table', 'table-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
        
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
    
})(); //结束 LoginHistoryView 模块的定义

//邮件删除历史模块
var MailDeleteHistoryView = (function()
{
    var div = document.getElementById('divMailDeleteHistory');
    var samples = 
    {
        original: div.innerHTML,
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.MailDeleteHistoryModel;
    
    function render(index)
    {
        index = index || 0;
        

        
        Model.getList(index, function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(samples.original, '<!--table', 'table-->', html);
            
            $(div).find('p>a').each(function(i)
            {
                var a = this;
                $(a).click(function()
                {
                    render(i);
                }).toggleClass('current', i==index);
            });
            
            show();
            
        });
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
    
})(); //结束 MailDeleteHistoryView 模块的定义

//邮件代收历史模块
var MailAgentHistoryView = (function()
{
    var div = document.getElementById('divMailAgentHistory');
    var samples = 
    {
        table: $.String.between(div.innerHTML, '<!--table', 'table-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.MailAgentHistoryModel;
    var hasRendered = false ; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                        
                    }).join('')
                });
                
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(div.innerHTML, '<!--table', 'table-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
})(); //结束 MailAgentHistoryView 模块的定义

//密码修改历史模块
var PasswordModifyHistoryView = (function()
{
    var div = document.getElementById('divPasswordModifyHistory');
    var samples = 
    {
        original: div.innerHTML,
        table: $.String.between(div.innerHTML, '<!--table.data', 'table.data-->'),
        nodata: $.String.between(div.innerHTML, '<!--table.nodata', 'table.nodata-->'),
        tr: $.String.between(div.innerHTML, '#tr.start#', '#tr.end#')
    };
    
    var Model = M2012.Set.SelfSearch.PasswordModifyHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            if( !list || !list.length )
            {
                nodata();
                return;
            }
            
            var table = $.String.replaceBetween( samples['table'], '#tr.start#', '#tr.end#', '{trs}');
        
            var html = $.Array.map(list, function(item, index)
            {
                return $.String.format(table, 
                {
                    date: $.Date( item[0] ).toString('MM月dd日'),
                    trs: $.Array.map(item[1], function(item, index)
                    {
                        return $.String.format( samples['tr'], item);
                    }).join('')
                });
                
                
            }).join('');
            
            div.innerHTML = $.String.replaceBetween(samples.original, '<!--table.data', 'table.data-->', html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function nodata()
    {
        div.innerHTML = $.String.replaceBetween
        (
            samples.original, 
            '<!--table.nodata', 
            'table.nodata-->', 
            samples.nodata
        );
                
        hasRendered = true; //指示已经呈现过
        show();
    }
    
    function hide()
    {
        $(div).addClass('hide');
    }
    
    function show()
    {
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };
    
})(); //结束 PasswordModifyHistoryView 模块的定义

var VolumeDoubleHistoryView = (function(){
    var div = document.getElementById('divVolumeDoubleHistoryView');
    var base = 25;
    function getVL(key){
        var key = 0 | key.slice(0,-1);
        key = 0 | (key>1?key:1);
        var len = base * key;
        if(len < 600){
            return base * key + 'px';
        }else{
            return 600 + 'px'
        }
        


    }
    var templateItem = ['<li class="userdouble">',
            '<div class="time"><span>{time}</span></div>',
            '<div class="datewarp" style="width:{length};"></div>',
            '<span class="datenum">{volume}</span>',
        '</li>'].join("");
    
    var Model = M2012.Set.SelfSearch.VolumeDoubleHistoryModel;
    var hasRendered = false; //指示是否已经呈现过
    
    function render()
    {
        if(hasRendered) //已经呈现过，避免重新获取数据和填充
        {
            show();
            return;
        }
        
        Model.getList(function(list)
        {
            if( !list || !list.length ){
                nodata();return;
            }   
            var max = 0    
            for(var i=0; i<list.length; i++){
                var now = list[i].totalCapacity.slice(0,-1);
                now = 0| now;
                if(now>max) max = now;
            }
            if(max>16){
                base = 0 | (25/(max/16));
                base = base?base:1;
            }

            var html = _.map(list, function(item){
                return $.String.format(templateItem, {
                    time: item.updateTime,
                    volume: item.totalCapacity,
                    length: getVL(item.totalCapacity)
                });
            }).join("");
            $(div).find('ul').html(html);
            hasRendered = true; //指示已经呈现过
            show();
        });
    }
    
    function nodata()
    {
        var noDataTips = '<p class="userdoublenodate-text">您目前还没有翻倍记录</p>';
        $(div).find('ul').replaceWith(noDataTips).end();           
        $('#thVolumeDouble').hide();     
        hasRendered = true; //指示已经呈现过
        show();
    }
    
    function hide(){
        $(div).addClass('hide');
    }
    
    function show(){
        $(div).removeClass('hide');
    }
    
    
    return {
        render: render,
        hide: hide,
        show: show
    };

})();//结束 VolumeDoubleHistoryView 模块的定义


//分类 tab 模块，主视图
var Tabs = M139.Core.namespace('M2012.Set.SelfSearch.Tabs', (function()
{
    var ul = document.getElementById('ulTabs');
    var sample = $.String.between(ul.innerHTML, '<!--', '-->');
    var currentIndex = -1;
    
    var list = 
    [
        { name: '登录查询', view: LoginHistoryView },
        { name: '删信查询', view: MailDeleteHistoryView },
        { name: '代收邮件查询', view: MailAgentHistoryView },
        { name: '用户密码修改', view: PasswordModifyHistoryView},
        { name: '用户容量翻倍查询', view: VolumeDoubleHistoryView}
    ];
    
    
    function render()
    {
        ul.innerHTML = $.Array.map(list, function(item, index)
        {
            return $.String.format(sample, $.Object.extend(
            {
                index: index
            }, item) );
            
        }).join('');
    }
    
    //切换 tab
    function click(index, a)
    {   
        if(index == currentIndex) //避免重复点击
        {
            return;
        }
        
        //高亮当前 tab
        var anchors = $.Array.parse( ul.getElementsByTagName('a') );
        a = a || anchors[index];
        
        $( anchors[currentIndex] ).removeClass('current'); //把之前高亮的项去掉
        currentIndex = index;
        $(a).addClass('current');
        
        
        //呈现对应模块的数据视图
        $.Array.each(list, function(item, i)
        {
            var v = item.view;
            if( !v ) //安全起见
            {
                return;
            }
            
            if(i == index)
            {
                v.render();
            }
            else
            {
                v.hide();
            }
        });
        
    }
    
    return {
        render: render,
        click: click
    };
    
})() ); //结束 Tabs 模块的定义



//开始
(function()
{
    Tabs.render();
    var indexDaiShou = M139.Text.Url.queryString("type");
    if(indexDaiShou !=null){
        Tabs.click(indexDaiShou);
        return;
    }
    Tabs.click(0);
    
})();




})(M139, Backbone, _, MiniQuery);
//结束 view.js