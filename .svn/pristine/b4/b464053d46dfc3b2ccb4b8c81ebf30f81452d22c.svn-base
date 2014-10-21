/**   
* @fileOverview 邮件风险预警提醒
*/

(function (jQuery, _, M139) {

/**
* @namespace 
* 邮件风险预警提醒
*/

M139.namespace("M2012.ReadMail.RiskTips.Model",Backbone.Model.extend({
        
    defaults:{
        fid:null,
        mid:null,
        dataSource:null
        //warnFile:[1, 5, 6, 9, 11] //定义预警的文件夹：收件箱(1)、垃圾箱(5)、病毒文件夹(6)、我的订阅(9)、广告文件夹(11)
    },
	
	/** 入口判断：预警提醒是否生效 */    
	isEnable: function () {
	    var self = this;
        var fid = this.get('fid');
        var response = this.get('dataSource');
        
        /*
        var warnFile = this.get('warnFile');
        if($.inArray(fid, warnFile) == -1) {
            return false;
        }*/
        
        //发件人是自己不提醒
        var sender = $Email.getEmail(response.account);
        if($.inArray(sender,self.getMyAccount())>-1){ 
            return false;
        }
        //系统邮件不提醒
        if($.inArray(sender,self.getSysAccount())>-1){ 
            return false;
        }
        //会话邮件不提醒
        if( response.sessionMails && response.sessionMails.length > 1){
            return false;
        }
        
        //会话邮件里的单封邮件不提醒
        /*if( response.readMode && response.readMode == 'sessionMode'){
            return false;
        }*/
        
        //我的订阅是本域邮件不提醒
        if( fid == 9 && $App.isLocalDomainAccount(response.account)){
            return false;
        }
        //转发邮件不提示        
        if(response.headers && response.headers.Sender != undefined) {
            return false;
        }
        
        return true;
    },
    
    /** 是否符合图片不显示 */
    isDisableImg: function(){
        //垃圾箱和广告箱预警提示是否显示图片
        var self = this;
        var fid = this.get('fid');
        if(self.isEnable() && ( fid == 5 || fid == 11)) {
            return true;       
        }
    },  
    
    getMyAccount:function(){
        return $User.getAccountListArray().join(',').toLowerCase().split(',');
    },
    
    //系统邮件地址
    getSysAccount:function(){
        return $App.getSysAccount() || [];
    },
    
    //是否密送邮件
    isBcc: function () {
        var flag = true;
        var myAccount = this.getMyAccount();
        
        //合并收件抄送
        var data = this.get('dataSource');
        var to = data.to || '';
        var cc = data.cc || '';
        var mail = [];
        if (to!= '' && cc!= '') {
            mail = to.split(',').concat(cc.split(','));
        }else{
            mail = to.split(',');
        }
        
        //验证
        for(var i=0;i< mail.length;i++){
            var email = mail[i];
            var addr = $Email.getEmail(email).toLowerCase();
             
            if ($.inArray(addr, myAccount) > -1) {
                flag = false;
                break;
            }          
        }
        return flag;
    },
    
    //是否涉及财产安全
    isPropertySafe: function(){
        var exceptFid = [5,6,9,11]; //这些文件夹显示原本的提醒
        var fid = this.get('fid')/1; //确保为数字
        if( $.inArray(fid,exceptFid) > -1 ){ 
            return false;
        }
        var data = this.get('dataSource');
        if(data.headers && data.headers.fraudFlag != 0){
            return true;
        }
        return false; 
    }, 

    //预警文件夹配置 
    config:{
        1: [{
                text:'您不在收件人里，可能这封邮件是密送或者自动转发给您的。',
                style:'rmListGray'
           }],
        5: [{
                text:'这是一封垃圾箱中的邮件，请勿轻信密保、汇款、中奖信息，请勿轻易拨打陌生电话。', //无图无附件
                style:'rmListYellow',
                trust:true,
                refuse:true 
            },
            {
                text:'为了保护邮箱安全，内容中的图片未被显示。', //有图片无附件 
                style:'rmListYellow',
                showpic:true,
                trust:true,
                refuse:true 
            },
            {
                text:'该邮件中包含附件，为保护邮箱安全，请勿轻易打开附件。',//只有附件  
                style:'rmListYellow',
                trust:true,
                refuse:true             
            }    
           ],
        6: [{ 
                text:'这是一封病毒文件夹中的邮件，可能会损害您的电脑及帐号安全！',
                style:'rmListRed',
                refuse:true 
                
            }], 
        9: [{ 
                text:'为营造健康的邮件环境，如果不是您订阅的邮件，请点击',
                style:'rmListRed',
                refuse:true 
            }],
            
        11: [{
                text:'这是一封广告文件夹中的邮件，请勿轻信密保、汇款、中奖信息，请勿轻易拨打陌生电话。', //无图无附件
                style:'rmListYellow',
                trust:true,
                refuse:true 
            },
            {
                text:'这是一封广告文件夹中的邮件，内容中的图片未被显示。', //有图片无附件 
                style:'rmListYellow',
                showpic:true,
                trust:true,
                refuse:true 
            },
            {
                text:'这是一封广告文件夹中的邮件，为保护邮箱安全，请勿轻易打开附件。',//只有附件  
                style:'rmListYellow',
                trust:true,
                refuse:true             
            }],
        propertySafe:[{
                text:'邮件中可能有涉及账号或财产安全的操作，请先对发件人身份进行核实。',
                style:'rmListYellow',
                spam:'true'
           }]
            
    }
    
    
}));

})(jQuery, _, M139);


