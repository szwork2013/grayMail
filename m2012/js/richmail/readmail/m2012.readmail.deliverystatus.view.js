/**
* @fileOverview 读信页邮件投递状态查询
*/

(function (jQuery, _, M139) {
    var $ = jQuery;
    var superClass = M139.View.ViewBase;
    
    /**
    * @namespace 
    * 读信页邮件投递状态查询
    */   
         
    M139.namespace('M2012.DeliveryStatus.View', superClass.extend({

    /**
    *@lends M2012.DeliveryStatus.View.prototype
    */

    el:"",

    events:{},

    template:{
        content:[
 		        '<span class="rMl">发信状态：</span>',
 		        '<div class="rMr">',
 			        '<span><a href="javascript:;">查看详情</a><a href="javascript:;" style="display:none">关闭</a></span>',
 			        '<div class="mail-tdztdiv">',
 			        '<table class="mail-tdzt" style="display:none; width: 70%;">',
 			            '<tr>',
 				            '<th>收件人</th><th>投递状态</th><th>时间</th>',
 			            '</tr>',
 			            '{0}',
 		            '</table>',
 		            '</div>',
 		        '</div>'].join(''),
 		        
 	        tips:[
 		        '<span class="rMl">发信状态：</span>',
 		        '<div class="rMr">',
 			        '<span>{0}</span>',
 		        '</div>'].join(''),

 		    item:['<tr>',
		            '<td>{0}</td>',
		            '<td>{1}</td>',
		            '<td>{2}</td>',
 			      '</tr>'].join('')        
 		      },

    initialize: function(){
       var self=this;
       this.model=new M2012.DeliveryStatus.Model();
       return superClass.prototype.initialize.apply(this, arguments);
       
    },

    initEvents:function(){
        var self = this;
        var span = $(self.el).find(".rMr span");
        var detail = $(self.el).find(".mail-tdzt");
        $(self.el).show();
        span.find("a:eq(0)").click(function(){
            $(this).hide();
            span.find("a:eq(1)").show();
            detail.show();        
        });
        span.find("a:eq(1)").click(function(){
            $(this).hide();
            span.find("a:eq(0)").show();
            detail.hide();        
        });
    },

    render:function (){
        var self=this;
        var contentTemp = self.template.content;
        var tipsTemp = self.template.tips;
		var itemTemp = self.template.item;   
        var rcptFlag = self.model.get('rcptFlag');
        var tipsHtml = '';
        var tips1 = '邮件发送已经超过系统设置的最大天数，查询不到详情';
        var tips2 = '投递失败，邮件被反垃圾系统过滤';
        
		if(rcptFlag && rcptFlag < 5){
		     this.model.getDataSource(function(dataSource){
		        if(dataSource.code == 'FS_UNKNOWN' && dataSource.errorCode == '2308309' ){
		            tipsHtml = $T.Utils.format(tipsTemp,[tips1]);
		            $(self.el).html(tipsHtml).show();
		        }
		        
		        //查到详情
		        if(dataSource.code == 'S_OK' && dataSource['var']){
		            var itemData = [];
		            var html = '';
		            var data = dataSource['var'][0]; //数据格式比较特殊	
		            if(data && data.tos){
		                var tos = data.tos;
		                for(var i = 0; i< tos.length;i++){
		                    var mails = $T.Utils.htmlEncode(tos[i]['mail']);
		                    var times = self.getDate(tos[i]['lastTime']);
		                    var states = self.getStatus(tos[i]['state']);
		                    itemData.push($T.Utils.format(itemTemp,[mails,states,times]));
		                }
		            }
		            html = $T.Utils.format(contentTemp,[itemData.join('')]);    
		            $(self.el).html(html).show();
                    self.initEvents();		        
		        }
            }); 
		}
		
		//邮件被反垃圾过滤
		if(rcptFlag && rcptFlag == 6){
		    tipsHtml = $T.Utils.format(tipsTemp,[tips2]);
		    $(self.el).html(tipsHtml).show();
		}
    },
    
    /**
    * 获取邮件投递状态
    */
    getStatus:function(state){
        var sendStatus = this.model.sendStatus;
        var statusText = sendStatus["state_" + state];
        return statusText != undefined ? statusText : sendStatus["state_0"];  
    },
    
    /**
    * 获取邮件投递日期格式
    */
    getDate:function(lastTime){
       //有时用lastDate
        return $Date.format("yyyy年MM月dd日(星期w) hh点mm分",new Date(lastTime * 1000));
    }    
   



}));
    
    
})(jQuery, _, M139);    


