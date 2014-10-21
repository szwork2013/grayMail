/**   
* @fileOverview 飞信同窗
*/
(function (jQuery, _, M139) {

/**
* @namespace 
* 飞信同窗
*/

M139.namespace("M2012.Fetionspace.Model",Backbone.Model.extend({

    defaults:{  
        
        fesionSpaceCount:0,
        fetionCredential:null,
        fetionSpaceRelease:true,
        agent:'http://g2.mail.10086.cn',
        url:'http://i2.feixin.10086.cn/home/indexpart?sid={0}&c={1}&rnd={2}',
        data:{ //暂时用数据代替
       
            diskShareFile:{
                resultCode:0,
                ShareFileCount:2
            },
        
            fetionSpace:{ 
                credential:"CFECAACOqjE06Jvfe%2BlioN7pwWwIIn05%2BIVXtj2d8mo2j66BkrbQopIAvEtBSNJjFokcExVaf7noyO6pCFjoFft%2BPHr2HbGO%2BH8UMI9tnTelBTyn5g%3D%3D",
                messages:{
                    "new_at_count": "1",
                    "new_friend_invite_count": "2",
                    "new_comment_count": "3",
                    "new_feed_count": "4",
                    "new_guestbook_count": "5",
                    "new_msg_nitify_count": "6"
                },
                Uec:{
                    uec_state:2,
                    uec_list:[]
                }
            }
        } //data         
	},
	
	/**
	* 获取飞信同窗信息数量
	*/
	getFetionCount:function(){
        var fesionSpaceCount = this.get('fesionSpaceCount');
        var fetion_messages = this.get('data').fetionSpace.messages;
        fesionSpaceCount = parseInt(fetion_messages.new_at_count);
		fesionSpaceCount+=parseInt(fetion_messages.new_friend_invite_count);
		fesionSpaceCount+=parseInt(fetion_messages.new_comment_count);
		fesionSpaceCount+=parseInt(fetion_messages.new_feed_count);
	    return fesionSpaceCount;
	},
	
	/**
	* 获取飞信认证号
	*/
	getFetionCredential:function(){
	    var fetion_credential = this.get('data').fetionSpace.credential;
	    return fetion_credential == null? null:fetion_credential;
	}
	
}));

})(jQuery, _, M139);
