/**   
* @fileOverview 移动微博
*/
(function (jQuery, _, M139) {

/**
* @namespace 
* 移动微博
*/

M139.namespace("M2012.Weibo.Model",Backbone.Model.extend({

    defaults:{  
        
        shuokeCount:0,
        url:'http://auth.weibo.10086.cn/sso/139mailframe.php?sid={0}&environment=2&partId=12&path=&skin=shibo&username={1}&rnd={2}',
        data:{
            //由于接口未生效，暂时用数据测试
            weibo:{
    	        code:0,
   	 	        data:100, //未读微博个数
   	 	        username:"",
    	        intervaltime:7200000
            },

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
	* 获取微博信息数量
	*/
	getWeiboCount:function(){
        return this.get('data').weibo.data;
	}
	
}));

})(jQuery, _, M139);
