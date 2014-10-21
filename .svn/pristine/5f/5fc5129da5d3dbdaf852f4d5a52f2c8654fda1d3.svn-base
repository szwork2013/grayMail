/**
 * @fileOverview 读信页往来邮件会话 create by zhangsixue
 */
(function (jQuery, _, M139) {

	M139.namespace("M2012.ReadMail.ContactRecord.Model", Backbone.Model.extend({
			defaults : {
				email : null, //往来邮件帐号
				mailListData: null,
				type: "myreceive",
				attachListData : null
			},
		//	
			/**
			 * 获取邮件列表数据
			 */
			getDefaultsAccount : function(){
				return top.$User.getDefaultSender();
			},
            //通过mid从缓存中找到邮件数据
			getMailById:function(mid){
			    var result=$.grep(this.get("listData"), function (n, i) {
			        return (n["mid"]==mid)
			    })
			    if (result.length > 0) {
			        return result[0];
			    }
			},
            //得到友好的日期供前端展示
			getReceiveDate:function(date){
			    var now = new Date();
			    var diff = $Date.getDaysPass(date, now);
			    if (diff == 0) {
			        return '<p class="time">' + $Date.format("hh:mm", date) + '</p>';
			    } else {
			        var html = '<p class=""><span class="num">' + $Date.format("dd", date) + '</span><span>日</span></p>\
                      <p class="year"><span>' + $Date.format("yyyy/MM", date) + '</span></p>';
			        return html;


			    }

			},
			readMail:function(mid,callback){
			    var data = {
			        mid: mid,
			        autoName: 1,
			        markRead: 0,
			        mode: "text"
			    }

			    M139.RichMail.API.call("mbox:readMessage", data, function (result) {
			        callback && callback(result.responseData["var"]);
			    });

             
			},
			searchContactsMail : function (callback) {
				var self = this;
				var from = this.get('email');
				//var keywords = keyword + ";" + self.getDefaultsAccount();
				var keywords = [];
				var list = $User.getAccountList();
				var type = this.get("type");
				$($User.getAccountList()).each(function(i,n){
				    
				    if (type == "myreceive") {//收到的邮件
				        keywords.push(from + ";" + n.name);
				    } else { //发出的邮件
				        keywords.push( n.name + ";"+from );
				    }
		    		
		    	});
		
				var option = {
						start : 1,
						total: 20, 
						pairs :keywords
					};
				this.set("searchContactsMailOptions", option); //查看等多
				M139.RichMail.API.call("mbox:queryContactMessages", option, function (result) {
				    var moreData = false;
				    if (result.responseData.stats && result.responseData.stats.messageCount >20) {
				        moreData=true;
				    }
				    var data = result.responseData["var"];
				    /*for (var i = 0; i < data.length; i++) {
				        if (data[i].mid == self.get("mid") || i == data.length-1) { //剔除当前邮件，如找不到就剔除最后一封，保持总数为20封
				            data.splice(i,1);
				            break;
				        }
				    }*/


				    self.set("listData", data);
				    callback && callback(result.responseData["var"], moreData);
				});
			}

			

		}));

})(jQuery, _, M139);
